import { Router } from "express";
import { getConfig, updateConfig } from "../controllers/config.Controller";
import { protect } from "../middleware/auth.Middleware";

const router = Router();

// Publica: Para que el Frontend sepa qué imagen mostrar
router.get("/", getConfig);

// Privada: Solo Admin puede cambiar las fotos
router.put("/", protect, updateConfig);

export default router;