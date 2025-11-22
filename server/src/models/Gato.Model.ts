import mongoose, { Schema, Document } from 'mongoose';

// Definir la interfaz para el gato
export interface IGato extends Document {
    nombre: string;
    descripcion: string;
    fotos: string[]; // Un array de URLs de las imágenes
    edad: string; // Ej: "Adulto", "Cachorro", "1 año"
    caracter: string;
    estadoSalud: string;
    estado: string; // 'enAdopcion', 'adoptado', 'hogarTemporal'
}

// Definir el esquema del gato
const GatoSchema: Schema = new Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String, 
        required: true 
    },
    fotos: [{ 
        type: String, 
        required: true 
    }], // Array de URLs de Cloudinary
    edad: { 
        type: String, 
        required: true 
    },
    caracter: { 
        type: String, 
        required: true 
    },
    estadoSalud: { 
        type: String, 
        required: true 
    },
    estado: {
      type: String,
      required: true,
      enum: ['enAdopcion', 'adoptado', 'hogarTemporal', 'perdido'],
      default: 'enAdopcion',
    },
  },
  {
    timestamps: true,
  }
);

// Crear y exportar el modelo del gato
const Gato = mongoose.model<IGato>('Gato', GatoSchema);
export default Gato;