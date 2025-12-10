import { Request, Response } from "express";
import Gato from "../models/Gato.Model";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";
import fs from 'fs';

/**
 * @desc obtener dtodos los gatos
 * @route GET /api/gatos
 * @access Public
 */
export const getGatos = async (req: Request, res: Response) => {
    try {
        const gatos = await Gato.find().sort({ createdAt: -1 });
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
        const gato = await Gato.findById(req.params.id);
        if (!gato) {
            return res.status(404).json({ message: "Gato no encontrado" });
        }
        res.status(200).json(gato);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al obtener el gato", error });
    }
}

/**
 * @desc crear un nuevo gato
 * @route POST /api/gatos
 * @access Private (Admin)
 */
export const createGato = async (req: Request, res: Response) => {
    try {
    
        const { nombre, descripcion, edad, caracter, estadoSalud, estado } = req.body;

        try {
            // validar que vengan los datos
            if (!nombre || !descripcion || !edad || !caracter || !estadoSalud || !estado) {
                return res.status(400).json({ message: "todos los campos de texto son requeridos" });
            }

            // validar que venga la imagen
            if (!req.files || !req.files.foto) {
                return res.status(400).json({ message: "Se requiere una imagen para el gato" });
            }

            const foto = req.files.foto as UploadedFile;

            // subir la imagen a Cloudinary
            const result = await cloudinary.uploader.upload(foto.tempFilePath, {
                folder: 'katze/gatos', // Carpeta donde se guardara en Cloudinary
                public_id: `${Date.now()}-${foto.name}` // Nombre unico para evitar colisiones
            });

            // Borrar el archivo temporal del servidor
            fs.unlinkSync(foto.tempFilePath);

            // crear el nuevo gato con la url de la foto de cloudinary
            const nuevoGato = new Gato({
                nombre,
                descripcion,
                edad,
                caracter,
                estadoSalud,
                estado,
                fotos: [result.secure_url] // usar la URL segura de Cloudinary
            })

            const gatoGuardado = await nuevoGato.save();
            res.status(201).json(gatoGuardado);

        } catch (error) {
            res.status(500).json({ message: "Error en el servidor al crear el gato", error });
        }
    } catch (error) {
        console.error("Error inesperado al crear el gato:", error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

/**
 * @desc actualizar un gato existente
 * @route PUT /api/gatos/:id
 * @access Private (Admin)
 */
export const updateGato = async (req: Request, res: Response) => {
    try {
        const gatoActualizado = await Gato.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // devuelve el documento actualizado
        )

        if (!gatoActualizado) {
            return res.status(404).json({ message: "Gato no encontrado" });
        }
        res.status(200).json(gatoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al actualizar el gato", error });
    }
}

/**
 * @desc eliminar un gato
 * @route DELETE /api/gatos/:id
 * @access Private (Admin)
 */
export const deleteGato = async (req: Request, res: Response) => {
    try {
        const gatoEliminado = await Gato.findByIdAndDelete(req.params.id);

        if (!gatoEliminado) {
            return res.status(404).json({ message: "Gato no encontrado" });
        }
        res.status(200).json({ message: "Gato eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al eliminar el gato", error });
    }
}
