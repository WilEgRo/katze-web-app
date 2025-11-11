import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/auth.Controller";

const router = Router();

// definir las rutas de autenticacion y que funcion del controlador se debe utilizar

// POST /api/auth/register
router.post("/register", registerAdmin); // eliminar esta ruta una vez concluido el desarrollo

// POST /api/auth/login
router.post("/login", loginAdmin);

export default router;