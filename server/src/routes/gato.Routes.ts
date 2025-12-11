import { Router } from "express";
import {
    getGatos,
    getGatoById,
    createGato,
    updateGato,
    deleteGato,
    getMisGatos,
    getGatosAdoptados,
    getAllGatosAdmin
} from "../controllers/gato.Controller";
import { protect, authorize } from "../middleware/auth.Middleware";
import { gatoRules, validate } from "../middleware/validator.Middleware";

const router = Router();

// ------------ Ruta Publicas ------------ //
router.get("/", getGatos); // GET /api/gatos
router.get("/adoptados", getGatosAdoptados); // GET /api/gatos/adoptados
router.get("/:id", getGatoById); // GET /api/gatos/:id

// ------------ Rutas Privadas (Usuarios Logueados) ------------ //
// Crear gato: Ahora cualquier usuario logueado puede hacerlo (se guarda como pendiente)
router.post("/", protect, createGato); 
router.get("/user/mis-gatos", protect, getMisGatos); // Ver mis gatos subidos

// ------------ Rutas Privadas (Admin) ------------ //
router.post("/", protect, gatoRules(), validate, authorize("ADMIN"), createGato); // POST /api/gatos
router.put("/:id", protect, authorize("ADMIN"), updateGato); // PUT /api/gatos/:id
router.delete("/:id", protect, authorize("ADMIN"), deleteGato); // DELETE /api/gatos/:id
router.get("/admin/all", protect, authorize("ADMIN", "MODERADOR"), getAllGatosAdmin); // GET /api/gatos/admin/all

export default router;