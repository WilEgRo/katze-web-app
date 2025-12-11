import mongoose, { Schema, Document} from "mongoose";

//interface para TS
export interface IReportePerdido extends Document {
    nombreGato?: string; // Nombre del gato opcional
    descripcion: string;
    foto: string;
    zona: string; // donde se encontro o perdio
    contacto: string; // informacion de contacto
    fecha: Date;
    estado: 'pendiente' | 'aprobado' | 'rechazado' | 'encontrado';
    creadoPor: mongoose.Schema.Types.ObjectId; // Relación con el Usuario
}

// Esquema (Schema) de Mongoose
const ReportePerdidoSchema: Schema = new Schema({
    nombreGato:
    {
        type: String,
        required: false
    },
    descripcion:
    {
        type: String,
        required: true
    },
    foto:
    {
        type: String, // url de cloudinary
        required: true
    },
    zona:
    {
        type: String,
        required: true
    },
    contacto:
    {
        type: String,
        required: true
    },
    fecha:
    {
        type: Date,
        default: Date.now
    },
    estado: 
    {
        type: String,
        required: true,
        enum: ["pendiente", "aprobado", "rechazado", "encontrado"],
        default: "pendiente"
    },
    creadoPor: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true 
});

// creamos y exportamos el modelo
const ReportePerdido = mongoose.model<IReportePerdido>(
    'ReportePerdido',
    ReportePerdidoSchema
);

export default ReportePerdido;
