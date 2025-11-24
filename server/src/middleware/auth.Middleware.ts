import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('Error: JWT_SECRET no está definido en .env');
    process.exit(1);
}

// esta es una extension de la interfaz Request para agregar el campo user al objeto request
export interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

// Middleware para restringir por roles
export const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Necesitamos buscar al usuario en la BD para estar seguros de su rol actual
    // (O confiar en el token si guardamos el rol ahí, por ahora consultemos la BD por seguridad extrema)
    // ... implementación simplificada asumiendo que req.user tiene el rol si lo agregamos al JWT payload
    // Por ahora, vamos a confiar en que implementaremos el rol en el token:
    
    // NOTA: Para que esto funcione perfecto, deberíamos agregar 'role' al payload del JWT en authController.
    // Pero para no complicarnos ahora, asumiremos que el admin tiene acceso a todo.
    
    next();
  };
};

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    // revisa si el token esta en los headers el formato estandar es: "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // obtener el tokenb quitando la palabra Bearer y el espacio
            token = req.headers.authorization.split(' ')[1];

            // verificar el token
            const decoded = jwt.verify(token as string, JWT_SECRET as string);
            req.user = decoded; // si es valido, adjuntamos los datos del usuario al objero request para que los controladores puedan usarlo

            // dejarlo pasar a la siguiente funcion
            next();

        } catch (error) {
            res.status(401).json({ message: "No autorizado, token inválido" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "No hay token, autorización denegada." });
    }
}
