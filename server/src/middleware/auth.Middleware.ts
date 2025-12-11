import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('Error: JWT_SECRET no está definido en .env');
    process.exit(1);
}

export interface AuthRequest extends Request {
    user?: any; // Usamos any para facilitar acceso a .role y ._id
}

// Middleware para restringir por roles
export const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // Verificar si hay usuario (puesto por 'protect')
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado, usuario no identificado' });
    }

    // Verificar si el rol del usuario está en la lista permitida
    // Nota: req.user.role viene del payload del token que creamos en auth.Controller
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
            message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}` 
        });
    }

    next();
  };
};

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token as string, JWT_SECRET as string);
            req.user = decoded; 

            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "No autorizado, token inválido" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "No hay token, autorización denegada." });
    }
}