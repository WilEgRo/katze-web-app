import { Request, Response } from "express";
import Gato from "../models/Gato.Model";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";
import fs from 'fs';
import { analizarImagenGato } from "../services/gemini.Service";


// Extender Request para incluir el usuario (que viene del middleware protect)
interface AuthRequest extends Request {
    user?: any;
}

/**
 * @desc obtener dtodos los gatos
 * @route GET /api/gatos
 * @access Public
 */
export const getGatos = async (req: Request, res: Response) => {
    try {
        const gatos = await Gato.find({ estado: 'enAdopcion' }).sort({ createdAt: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al obtener los gatos", error });
    }
}

/**
 * @desc obtener un gato por su ID
 * @route GET /api/gatos/:id
 * @access Public
 */
export const getGatoById = async (req: Request, res: Response) => {
    try {
        const gato = await Gato.findById(req.params.id).populate('creadoPor', 'nombre email');
        if (!gato) return res.status(404).json({ message: "Gato no encontrado" });
        res.status(200).json(gato);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el gato", error });
    }
}

/**
 * @desc obtener los gatos creados por el usuario autenticado
 * @route GET /api/gatos/mis-gatos
 * @access Private
 */
export const getMisGatos = async (req: AuthRequest, res: Response) => {
    try {
        const gatos = await Gato.find({ creadoPor: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tus gatos", error });
    }
};

/**
 * @desc obtener gatos adoptados para la historia de exito
 * @route GET /api/gatos/exitos
 * @access Public
 */
export const getGatosAdoptados = async (req: Request, res: Response) => {
    try {
        const gatos = await Gato.find({ estado: 'adoptado' }).sort({ updatedAt: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historias", error });
    }
}

/**
 * @desc crear un nuevo gato
 * @route POST /api/gatos
 * @access Private (Admin)
 */
export const createGato = async (req: AuthRequest, res: Response) => {
    try {
        const { nombre, descripcion, edad, caracter, estadoSalud, ubicacion } = req.body;
        const usuario = req.user; // Viene del middleware 'protect'

        if (!nombre || !descripcion || !edad || !caracter || !estadoSalud) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        if (!req.files || !req.files.foto) {
            return res.status(400).json({ message: "Se requiere una imagen para el gato" });
        }

        const foto = req.files.foto as UploadedFile;

        // ANÁLISIS CON GEMINI IA
        // Validamos que sea un gato REAL antes de subir nada a Cloudinary
        const esGato = await analizarImagenGato(foto.tempFilePath);
        
        if (!esGato) {
            // Borramos archivo temporal
            fs.unlinkSync(foto.tempFilePath); 
            return res.status(400).json({ 
                message: "La IA ha detectado que la imagen no corresponde a un gato real. Por favor sube una foto válida." 
            });
        }

        // Subir a Cloudinary
        const result = await cloudinary.uploader.upload(foto.tempFilePath, {
            folder: 'katze/gatos',
            public_id: `${Date.now()}-${foto.name}`
        });

        fs.unlinkSync(foto.tempFilePath);

        // Determinar Estado Inicial
        // Si es Admin, puede publicarlo directo (opcional), si es User, va a pendiente.
        const estadoInicial = usuario.role === 'ADMIN' ? 'enAdopcion' : 'pendiente';

        const nuevoGato = new Gato({
            nombre,
            descripcion,
            edad,
            caracter,
            estadoSalud,
            estado: estadoInicial,
            fotos: [result.secure_url],
            ubicacion, // Guardamos ubicación del mapa
            creadoPor: usuario._id // Vinculamos al usuario
        });

        const gatoGuardado = await nuevoGato.save();
        
        res.status(201).json({
            message: estadoInicial === 'pendiente' 
                ? "Gato creado. Esperando aprobación del administrador." 
                : "Gato publicado exitosamente.",
            gato: gatoGuardado
        });

    } catch (error) {
        console.error("Error al crear gato:", error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

/**
 * @desc actualizar un gato existente
 * @route PUT /api/gatos/:id
 * @access Private
 */
export const updateGato = async (req: Request, res: Response) => {
    try {
        // validar que solo el dueño o el admin edite
        const gatoActualizado = await Gato.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!gatoActualizado) return res.status(404).json({ message: "Gato no encontrado" });
        res.status(200).json(gatoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar", error });
    }
}

/**
 * @desc eliminar un gato
 * @route DELETE /api/gatos/:id
 * @access Private
 */
export const deleteGato = async (req: Request, res: Response) => {
    try {
        const gatoEliminado = await Gato.findByIdAndDelete(req.params.id);
        if (!gatoEliminado) return res.status(404).json({ message: "Gato no encontrado" });
        res.status(200).json({ message: "Gato eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar", error });
    }
}

/**
 * @desc obtener gatos pendientes de aprobación
 * @access Private (Admin)
 */
export const getAllGatosAdmin = async (req: Request, res: Response) => {
    try {
        // Sin filtros, traemos todo y ordenamos por fecha
        const gatos = await Gato.find().populate('creadoPor', 'username email').sort({ createdAt: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener gatos para admin", error });
    }
}