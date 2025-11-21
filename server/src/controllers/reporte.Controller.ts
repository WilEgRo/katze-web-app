import fs from 'fs'; // Para borrar archivos temporales
import { Request, Response } from 'express';
import ReportePerdido from '../models/ReportePerdido.Model';
import { UploadedFile } from 'express-fileupload';
import cloudinary from '../config/cloudinary';

/**
 * @desc Crear un nuevo reporte de gato perdido
 * @route POST /api/reportes
 * @access Public
 */
export const createReportePerdido = async (req: Request, res: Response) => {
    const { nombreGato, descripcion, zona, contacto, fecha } = req.body;

    try {
        // validar que vengan los datos (la validacion de 'express-validator' actuara primero)
        // luego validamos la imagen
        if (!req.files || !req.files.foto) {
            return res.status(400).json({ message: 'La sequiere una imagen valida del gato' });
        }

        const foto = req.files.foto as UploadedFile;

        // subir la imagen a Cloudinary
        const result = await cloudinary.uploader.upload(foto.tempFilePath, {
            folder: 'katse/reportes', // Carpeta en Cloudinary
            public_id: `${Date.now()}-${foto.name}`, // Nombre unico
        });

        // Borrar el archivo temporal del servidor
        fs.unlinkSync(foto.tempFilePath);

        // crear el nuevo reporte
        const nuevoReporte = new ReportePerdido({
            nombreGato,
            descripcion,
            zona,
            contacto,
            fecha,
            foto: result.secure_url, // URL de la imagen en Cloudinary
            estado: 'pendiente' // estado inicial
        });

        const reporteGuardado = await nuevoReporte.save();
        res.status(201).json({
            message: 'Reporte enviado exitosamente y está pendiente de revisión',
            reporte: reporteGuardado,
        });

    } catch (error) {
        console.error('Error al crear el reporte de gato:', error);
        res.status(500).json({ message: 'Error en el servidor al crear el reporte' });
    }
};

/**
 * @desc Obtener todos los reportes APROBADOS
 * @route GET /api/reportes
 * @access Public
 */
export const getReportesAprobados = async (req: Request, res: Response) => {
    try {
        // solo mostramos al publico los que el admin apruebe
        const reportes = await ReportePerdido.find({ estado: 'aprobado' }).sort({ createdAt: -1 }); // ordenar por fecha mas reciente

        res.status(200).json(reportes);
    } catch (error) {
        console.error('Error al obtener los reportes de gatos:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener los reportes' });
    }
}

/**
 * @desc Obtener TODOS los reportes (Pendientes, Aprobados, etc.)
 * @route GET /api/reportes/admin/all
 * @access Private (Admin)
 */
export const getAllReportesAdmin = async (req: Request, res: Response) => {
    try {
        const reportes = await ReportePerdido.find().sort({ createdAt: -1 });
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los reportes' });
    }
};

/**
 * @desc Actualizar el estado de un reporte (Aprobar/Rechazar - Protegido Admin)
 * @route PUT /api/reportes/admin/:id
 * @access Private (Admin)
 */
export const updateReporteEstado = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { estado } = req.body; // El admin enviará el nuevo estado (ej: "aprobado" o "rechazado") 

    // Validación de seguridad
    if (!['aprobado', 'rechazado'].includes(estado)) {
        return res.status(400).json({ message: 'Estado no válido' });
    }

    try {
        const reporte = await ReportePerdido.findById(id);

        if (!reporte) {
        return res.status(404).json({ message: 'Reporte no encontrado' });
        }

        reporte.estado = estado;
        await reporte.save();

        res.status(200).json({ message: `Reporte ${estado} exitosamente`, reporte });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el reporte' });
    }
};

/**
 * @desc Eliminar un reporte (Protegido Admin)
 * @route DELETE /api/reportes/admin/:id
 * @access Private (Admin)
 */
export const deleteReporte = async (req: Request, res: Response) => {
  try {
    const reporte = await ReportePerdido.findByIdAndDelete(req.params.id);

    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    // mas adelante aqui vamos a crear la logica para borrar la imagen de Cloudinary

    res.status(200).json({ message: 'Reporte eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el reporte' });
  }
};