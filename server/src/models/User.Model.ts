import mongoose, { Schema, Document } from "mongoose";

// Definir la interfaz para el usuario
export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    role: 'USER' | 'ADMIN' | 'MODERADOR';
}

// Definir el esquema del usuario
const UserSchema: Schema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true, // No puede haber dos usuarios con el mismo nombre
      trim: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true, 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'MODERADOR'],
        default: 'USER'
    }
}, {    
    timestamps: true 
});

// Crear y exportar el modelo del usuario
const User = mongoose.model<IUser>('User', UserSchema);
export default User;