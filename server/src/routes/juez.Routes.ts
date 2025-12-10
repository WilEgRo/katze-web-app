// src/routes/juez.Routes.ts
import { Router } from "express";
import { evaluarGato } from "../controllers/juez.Controller";


const router = Router();

// POST /api/juez/validar-gato
// 'imagen' es el nombre del campo que debes usar en Postman o en el Frontend
router.post("/validar-gato", evaluarGato);

export default router;