import { Router } from "express";
import { loginAdmin, register, getAllUsers, updateUserRole } from "../controllers/auth.Controller";
import { registerRules, loginRules, validate } from "../middleware/validator.Middleware";
import { protect, authorize } from "../middleware/auth.Middleware";

const router = Router();

// definir las rutas de autenticacion y que funcion del controlador se debe utilizar

// Rutas publicas
router.post("/register", registerRules(), validate, register);
router.post("/login", loginRules(), validate, loginAdmin);

// Rutas Privadas (Admin)
router.get("/users", protect, authorize("ADMIN"), getAllUsers);
router.put("/users/:id/role", protect, authorize("ADMIN"), updateUserRole);

export default router;