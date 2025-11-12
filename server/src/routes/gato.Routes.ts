import { Router } from "express";
import {
    getGatos,
    getGatoById,
    createGato,
    updateGato,
    deleteGato
} from "../controllers/gato.Controller";
import { protect } from "../middleware/auth.Middleware";

const router = Router();

// ------------ Ruta Publicas ------------ //
router.get("/", getGatos); // GET /api/gatos
router.get("/:id", getGatoById); // GET /api/gatos/:id

// ------------ Rutas Privadas (Admin) ------------ //
router.post("/", protect, createGato); // POST /api/gatos
router.put("/:id", protect, updateGato); // PUT /api/gatos/:id
router.delete("/:id", protect, deleteGato); // DELETE /api/gatos/:id

export default router;