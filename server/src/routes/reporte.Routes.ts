import { Router } from "express";
import {
    createReportePerdido,
    getReportesAprobados,
    getAllReportesAdmin,
    updateReporteEstado,
    deleteReporte
} from "../controllers/reporte.Controller";
import {
    reporteRules,
    validate
} from "../middleware/validator.Middleware";
import { protect } from "../middleware/auth.Middleware";

const router = Router(); // crear el router que maneje las rutas

// ----------------------------
// Ruta Publicas 
// ----------------------------
// GET /api/reportes
// obtiene solo los reportes que un admin ya aprobo
router.get("/", getReportesAprobados);

// POST /api/reportes
// Permite a cualquier usuario crear un nuevo reporte (que nacera como pendiente)
// pasara por las reglas de validacion (reporteRules) y luego por el validador (validate)
// si todo esta bien, llegara al controlador "createReportePerdido"
router.post("/", reporteRules(), validate, createReportePerdido);

//----------------------------
// Rutas Privadas - Admin
//----------------------------
// Get /api/reportes/admin/all
// obtiene todos los reportes (pendientes, aprobados, rechazados, etc)
router.get("/admin/all", protect, getAllReportesAdmin);

// PUT /api/reportes/admin/:id
// permite actualizar el estado de un reporte (aprobar/rechazar)
router.put("/admin/:id", protect, updateReporteEstado);

// DELETE /api/reportes/admin/:id
// permite eliminar un reporte
router.delete("/admin/:id", protect, deleteReporte);


export default router;