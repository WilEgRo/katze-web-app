import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.Model";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    console.error('Error: JWT_SECRET no está definido en .env');
    process.exit(1);
}

// ------- Funcion de login -------
export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // buscar el usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // comparar la contraseña con la guardada que esta hasheada
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Crear el token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email }, // datos que guardamos en el token
            JWT_SECRET, // la clave secreta para firmar el token
            { expiresIn: '24h' } // el token expira en 24 horas
        );

        // enviar el token al cliente
        res.status(200).json({
            message: "Login exitoso",
            token: token,
            userId: user._id,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

// ------- Funcion de registro (temporal) ------- //borrar temporal una vez concluido el desarrollo
export const registerAdmin = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "El email ya esta registrado" });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Crear un nuevo usuario
        user = new User({
            email,
            passwordHash,
            role
        });

        await user.save();

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });      
    }
}