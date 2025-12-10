import e, { Request, Response } from 'express';
import Solicitud from '../models/Solicitud.Model';
import Gato from '../models/Gato.Model';
import axios from 'axios';

// Solicitud publica
export const crearSolicitud = async (req: Request, res: Response) => {
    try {
        const { gatoId, nombreSolicitante, telefono, email, motivo, vivienda, tieneMallas, tienePatio, tieneNiños, cantidadNiños, otrasMascotas } = req.body;

        // verificar que el gato exista
        const gato = await Gato.findById(gatoId);
        if (!gato) {
            return res.status(404).json({ message: 'Gato no encontrado' });
        }

        // auto.rechazo pre-filtro
        let estadoInicial = 'pendiente';
        // si es departamento y tiene más de 2 hijos
        if (vivienda === 'departamento' && parseInt(cantidadNiños) > 2) {
            estadoInicial = 'rechazada';
        }

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
            cantidadNiños: cantidadNiños || 0,
            otrasMascotas,
            estado: estadoInicial
        });
        await nuevaSolicitud.save();

        // Incrementar el contador de solicitudes del gato
        await Gato.findByIdAndUpdate(gatoId, { $inc: { solicitudesCount: 1 } });

        // disparador a make 
        try {
            axios.post('https://hook.us2.make.com/fabgtkv45jni3lf8fic9hclicqywd7n3', {
                id: nuevaSolicitud._id,
                nombre: req.body.nombreSolicitante,
                email: req.body.email,
                vivienda: req.body.vivienda,
                hijos: req.body.cantidadNiños || 0,
                motivo: req.body.motivo,
                estado: estadoInicial
            });
        } catch (error) {
            console.error('Error al enviar datos a Make:', error);
        }
        
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