import { Router } from 'express';
import { crearSolicitud, getSolicitudes, updateSolicitudEstado } from '../controllers/solicitud.Controller';
import { protect, authorize } from '../middleware/auth.Middleware';

const router = Router();

// Público: Enviar solicitud
router.post('/', crearSolicitud);

// Admin: Ver y Gestionar solicitudes
// Nota: getSolicitudes ahora soporta ?search=NombreGato
router.get('/admin/all', protect, authorize('ADMIN', 'MODERADOR'), getSolicitudes);
router.put('/admin/:id', protect, authorize('ADMIN', 'MODERADOR'), updateSolicitudEstado);

export default router;