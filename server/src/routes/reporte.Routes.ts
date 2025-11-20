import { Router } from "express";
import {
    createReportePerdido,
    getReportesAprobados,
} from "../controllers/reporte.Controller";
import {
    reporteRules,
    validate
} from "../middleware/validator.Middleware";

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

export default router;