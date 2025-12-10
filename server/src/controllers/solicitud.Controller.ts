import { Request, Response } from 'express';
import Solicitud from '../models/Solicitud.Model';
import Gato from '../models/Gato.Model';

// Solicitud publica
export const crearSolicitud = async (req: Request, res: Response) => {
    try {
        const { gatoId, nombreSolicitante, telefono, email, motivo, vivienda, tieneMallas, tienePatio, tieneNiños, cantidadNiños, otrasMascotas } = req.body;

        const nuevaSolicitud = new Solicitud({
            gatoId,
            nombreSolicitante,
            telefono,
            email,
            motivo,
            vivienda,
            tieneMallas,
            tienePatio,
            tieneNiños,
            cantidadNiños,
            otrasMascotas
        });
        await nuevaSolicitud.save();
        res.status(201).json({ message: 'Solicitud enviada con éxito', solicitud: nuevaSolicitud });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar solicitud' });
    }
};

// Obtener solicitudes (Admin)
export const getSolicitudes = async (req: Request, res: Response) => {
    try {
        // Usamos .populate('gatoId') para traer los datos del gato (nombre, foto) junto con la solicitud
        const solicitudes = await Solicitud.find()
        .populate('gatoId', 'nombre fotos') 
        .sort({ fecha: -1 });
        
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener solicitudes' });
    }
};

// Aprobar/Rechazar Solicitud (Admin)
export const updateSolicitudEstado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const solicitud = await Solicitud.findByIdAndUpdate(id, { estado }, { new: true });
        
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

        res.status(200).json(solicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar solicitud' });
    }
};