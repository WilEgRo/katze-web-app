import fs from 'fs'; // Para borrar archivos temporales
import { Request, Response } from 'express';
import ReportePerdido from '../models/ReportePerdido.Model';
import { UploadedFile } from 'express-fileupload';
import cloudinary from '../config/cloudinary';

interface AuthRequest extends Request {
    user?: any;
}

/**
 * @desc Crear un nuevo reporte de gato perdido
 * @route POST /api/reportes
 * @access Public
 */
export const createReportePerdido = async (req: AuthRequest, res: Response) => {
    const { nombreGato, descripcion, zona, contacto, fecha } = req.body;
    const usuario = req.user;

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
            estado: 'pendiente', // estado inicial
            creadoPor: usuario._id // Vinculamos al usuario autenticado si existe
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
        const reportes = await ReportePerdido.find({ 
            estado: { $in: ['aprobado', 'encontrado'] } // Mostramos también los encontrados
        }).sort({ createdAt: -1 });
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reportes' });
    }
}

/**
 * @desc Obtener un reporte por su ID
 * @route GET /api/reportes/:id
 * @access Public
 */
export const getReporteById = async (req: Request, res: Response) => {
    try {
        const reporte = await ReportePerdido.findById(req.params.id).populate('creadoPor', 'username email');
        if (!reporte) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el reporte' });
    }
}

/**
 * @desc Obtener mis reportes de gato perdido
 * @route GET /api/reportes/mis-reportes
 * @access Private
 */
// Obtener mis reportes (Perfil Usuario)
export const getMisReportes = async (req: AuthRequest, res: Response) => {
    try {
        const reportes = await ReportePerdido.find({ creadoPor: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tus reportes' });
    }
};

/**
 * @desc Obtener TODOS los reportes (Pendientes, Aprobados, etc.)
 * @route GET /api/reportes/admin/all
 * @access Private
 */
export const getAllReportesAdmin = async (req: Request, res: Response) => {
    try {
        const reportes = await ReportePerdido.find().populate('creadoPor', 'nombre email').sort({ createdAt: -1 });
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reportes' });
    }
};

/**
 * @desc Actualizar el estado de un reporte (Aprobar/Rechazar - Protegido Admin)
 * @route PUT /api/reportes/admin/:id
 * @access Private (Admin)
 */
export const updateReporteEstado = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { estado } = req.body; 

    if (!['aprobado', 'rechazado', 'pendiente'].includes(estado)) {
        return res.status(400).json({ message: 'Estado inválido para admin' });
    }

    try {
        const reporte = await ReportePerdido.findByIdAndUpdate(id, { estado }, { new: true });
        if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' });
        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar' });
    }
};

/**
 * @desc Marcar un reporte como ENCONTRADO (Usuario que creó el reporte)
 * @route PUT /api/reportes/encontrado/:id
 * @access Private
 */
// Usuario marca como encontrado
export const marcarComoEncontrado = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const usuario = req.user;

    try {
        const reporte = await ReportePerdido.findOne({ _id: id, creadoPor: usuario._id });

        if (!reporte) {
            return res.status(404).json({ message: 'Reporte no encontrado o no tienes permiso' });
        }

        reporte.estado = 'encontrado';
        await reporte.save();

        res.status(200).json({ message: '¡Qué alegría! Gato marcado como encontrado.', reporte });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar' });
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
    if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' });
    res.status(200).json({ message: 'Reporte eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar' });
  }
};