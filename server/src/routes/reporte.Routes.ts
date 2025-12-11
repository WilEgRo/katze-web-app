import { Router } from "express";
import {
    createReportePerdido,
    getReportesAprobados,
    getAllReportesAdmin,
    updateReporteEstado,
    deleteReporte,
    getMisReportes,
    marcarComoEncontrado,
    getReporteById
} from "../controllers/reporte.Controller";
import {
    reporteRules,
    validate
} from "../middleware/validator.Middleware";
import { protect, authorize } from "../middleware/auth.Middleware";

const router = Router(); // crear el router que maneje las rutas

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
// obtiene solo los reportes que un admin ya aprobo
router.get("/", getReportesAprobados);
router.get("/:id", getReporteById);


// ==========================================
// RUTAS DE USUARIO (Requiere Login)
// ==========================================
// Crear un reporte
router.post("/", reporteRules(), protect, validate, createReportePerdido);

// Ver mis propios reportes
router.get("/user/mis-reportes", protect, getMisReportes);

// Marcar MI reporte como encontrado
router.put("/user/:id/encontrado", protect, marcarComoEncontrado);


// ==========================================
// RUTAS DE ADMIN/MOD (Requiere Permisos)
// ==========================================
// Ver TODOS los reportes (incluido pendientes y rechazados)
router.get("/admin/all", protect, authorize("ADMIN", "MODERADOR"), getAllReportesAdmin);

// Aprobar o Rechazar reporte
router.put("/admin/:id", protect, authorize("ADMIN", "MODERADOR"), updateReporteEstado);

// Eliminar reporte físicamente
router.delete("/admin/:id", protect, authorize("ADMIN"), deleteReporte);


export default router;