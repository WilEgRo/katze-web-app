import { Request, Response } from "express";
import Config from "../models/Config.Model";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";
import fs from 'fs';


export const getConfig = async (req: Request, res: Response) => {
    try {
        let config = await Config.findOne({ clave: 'general' });
        if (!config) {
            config = await Config.create({ clave: 'general', qrBancoUrl: '', gatoHeroUrl: '' });
        }
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener configuración", error });
    }
};



export const updateConfig = async (req: Request, res: Response) => {
    try {
        console.log("1. Entrando a updateConfig");
        console.log("2. req.files recibido:", req.files);
        console.log("3. Body:", req.body);
        const updateData: any = {};

        // Verificar si se subió imagen del QR ('qrImage')
        if (req.files && req.files.qrImage) {
            const qrFile = req.files.qrImage as UploadedFile;

            // Subir a Cloudinary
            const resultQr = await cloudinary.uploader.upload(qrFile.tempFilePath, {
                folder: 'katze/config',
                public_id: `qr-banco-${Date.now()}`
            });

            // Guardar URL y borrar temporal
            updateData.qrBancoUrl = resultQr.secure_url;
            fs.unlinkSync(qrFile.tempFilePath);
        }

        if (req.files && req.files.heroImage) {
            const heroFile = req.files.heroImage as UploadedFile;

            const resultHero = await cloudinary.uploader.upload(heroFile.tempFilePath, {
                folder: 'katze/config',
                public_id: `gato-hero-${Date.now()}`
            });

            updateData.gatoHeroUrl = resultHero.secure_url;
            fs.unlinkSync(heroFile.tempFilePath);
        }


        const configActualizada = await Config.findOneAndUpdate(
            { clave: 'general' },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: "Configuración actualizada correctamente",
            config: configActualizada
        });

    } catch (error) {
        console.error("Error al actualizar config:", error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
};