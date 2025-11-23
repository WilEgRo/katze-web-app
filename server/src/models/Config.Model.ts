import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
    clave: string;
    qrBancoUrl: string;
    gatoHeroUrl: string;
}

const ConfigSchema: Schema = new Schema({
    clave: { type: String, default: 'general', unique: true },
    qrBancoUrl: { type: String, default: '' },
    gatoHeroUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IConfig>('Config', ConfigSchema);