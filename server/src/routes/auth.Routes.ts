import { Router } from "express";
import { loginAdmin, register } from "../controllers/auth.Controller";
import { registerRules, loginRules, validate } from "../middleware/validator.Middleware";

const router = Router();

// definir las rutas de autenticacion y que funcion del controlador se debe utilizar

// POST /api/auth/register
// ahora la peticion pasa por las reglas y luego por el validador
// antes de llegar al controlador 'registerAdmin'
router.post("/register", registerRules(), validate, register);

// POST /api/auth/login
router.post("/login", loginRules(), validate, loginAdmin);

export default router;