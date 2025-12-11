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
            { 
                _id: user._id,
                email: user.email, 
                role: user.role 
            }, // datos que guardamos en el token
            JWT_SECRET, // la clave secreta para firmar el token
            { expiresIn: '24h' } // el token expira en 24 horas
        );

        // enviar el token al cliente
        res.status(200).json({
            message: "Login exitoso",
            token: token,
            _id: user._id,
            email: user.email,
            role: user.role,
            username: user.username,
        });

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

// ------- Funcion de registro -------
export const register = async (req: Request, res: Response) => {
    // Recibir username del body
    const { username, email, password } = req.body; // <--- AQUÍ

    try {
    // Verificar si el usuario YA existe (por email O por username)
    // Usamos $or para buscar si existe alguno de los dos
    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    });

    if (existingUser) {
        return res.status(400).json({ message: 'El correo o el nombre de usuario ya están en uso.' });
    }

    //Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario con username
    const newUser = new User({
        username, // <--- GUARDARLO
        email,
        passwordHash,
        role: 'USER' // Por defecto
    });

    const savedUser = await newUser.save();

    //  Generar token
    const token = jwt.sign(
        { 
            _id: savedUser._id, 
            role: savedUser.role 
        },
        process.env.JWT_SECRET || 'secreto_super_seguro',
        { expiresIn: '1d' }
    );

    res.status(201).json({
        message: 'Usuario registrado exitosamente.',
        token: token,
        _id: savedUser._id,
        username: savedUser.username, // <--- DEVOLVERLO AL FRONTEND
        email: savedUser.email,
        role: savedUser.role
    });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
    }
};

// ------- Obtener todos los usuarios (Para el Admin) -------
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Devolvemos todos menos la contraseña
        const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

// ------- Cambiar Rol de Usuario -------
export const updateUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body; // Esperamos "ADMIN", "MODERADOR" o "USER"

    try {
        if (!['ADMIN', 'MODERADOR', 'USER'].includes(role)) {
            return res.status(400).json({ message: "Rol no válido" });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: `Rol actualizado a ${role}`, user });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar rol" });
    }
};