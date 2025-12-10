import mongoose, { Schema, Document} from "mongoose";

export interface ISolicitud extends Document {
  gatoId: mongoose.Types.ObjectId; // A qué gato quieren
  nombreSolicitante: string;
  telefono: string;
  email: string;
  motivo: string; // "¿Por qué quieres adoptar?"
  vivienda: 'casa' | 'departamento';
  tieneMallas: boolean; // Vital para la seguridad
  tienePatio: boolean;
  tieneNiños: boolean;
  cantidadNiños: number;
  otrasMascotas: boolean;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fecha: Date;
}

const SolicitudSchema: Schema = new Schema(
    {
        gatoId:{
            type: Schema.Types.ObjectId,
            ref: 'Gato',
            required: true
        },
        nombreSolicitante:{
            type: String,
            lowercase: true,
            trim: true,
            minlength: 3,
            required: true
        },
        telefono:{
            type: String,
            trim: true,
            minlength: 8,
            required: true
        },
        email:{
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Por favor, ingrese un correo electrónico válido.'],
            required: true
        },
        motivo:{
            type: String,
            required: true
        },
        vivienda:{
            type: String,
            enum: ['casa', 'departamento'],
            required: true
        },
        tieneMallas:{
            type: Boolean,
            required: true
        },
        tienePatio:{
            type: Boolean,
            required: true
        },
        tieneNiños:{
            type: Boolean,
            required: true
        },
        cantidadNiños: {
            type: Number,
            default: 0,
            min: 0,
            validate: {
                validator: function (value: number) {
                    if (this.tieneNiños && value <= 0) {
                        return false;
                    }
                    return true;
                },
                message: "Debe indicar una cantidad válida de niños."
            }
        },
        otrasMascotas:{
            type: Boolean,
            required: true
        },
        estado:{
            type: String,
            enum: ['pendiente', 'aprobada', 'rechazada'],
            default: 'pendiente'
        },
        fecha:{
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Solicitud = mongoose.model<ISolicitud>('Solicitud', SolicitudSchema);
export default Solicitud;