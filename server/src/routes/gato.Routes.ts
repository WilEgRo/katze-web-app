import { Router } from "express";
import {
    getGatos,
    getGatoById,
    createGato,
    updateGato,
    deleteGato
} from "../controllers/gato.Controller";
import { protect, authorize } from "../middleware/auth.Middleware";
import { gatoRules, validate } from "../middleware/validator.Middleware";

const router = Router();

// ------------ Ruta Publicas ------------ //
router.get("/", getGatos); // GET /api/gatos
router.get("/:id", getGatoById); // GET /api/gatos/:id

// ------------ Rutas Privadas (Admin) ------------ //
router.post("/", protect, gatoRules(), validate, authorize("admin"), createGato); // POST /api/gatos
router.put("/:id", protect, authorize("admin"), updateGato); // PUT /api/gatos/:id
router.delete("/:id", protect, authorize("admin"), deleteGato); // DELETE /api/gatos/:id

export default router;