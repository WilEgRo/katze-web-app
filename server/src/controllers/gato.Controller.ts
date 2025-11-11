import { Request, Response } from "express";
import Gato, {IGato} from "../models/Gato.Model";
//import { UploadedFile } from "express-fileupload";
//import cloudinary from "../config/cloudinary";

/**
 * @desc obtener dtodos los gatos
 * @route GET /api/gatos
 * @access Public
 */
export const getGatos = async (req: Request, res: Response) => {
    try {
        const gatos = await Gato.find({ estado: 'enAdopcion' }); // mostrar solo gatos en adopcion
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
        //espacio para la logica de subida de fotos que se anadira aqui mas tarde
        const { nombre, descripcion, edad, caracter, estadoSalud, estado } = req.body;

        try {
            const nuevoGato = new Gato({
                nombre,
                descripcion,
                edad,
                caracter,
                estadoSalud,
                estado,
                fotos: ['url_de_ejemplo.jpg'] // reemplazar con las URLs reales despues de implementar la subida de fotos,
            })

            const gatoGuardado = await nuevoGato.save();
            res.status(201).json(gatoGuardado);
        } catch (error) {
            res.status(500).json({ message: "Error en el servidor al crear el gato", error });
        }
    } catch (error) {
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
