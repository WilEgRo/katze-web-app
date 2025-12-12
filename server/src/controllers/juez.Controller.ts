import { Request, Response } from "express";
import { analizarImagenGato } from "../services/gemini.Service";
import fs from "fs";

// Extendemos la interfaz Request para asegurar que TypeScript vea el archivo
interface UploadedFile {
    name: string;
    tempFilePath: string;
    mimetype: string;
    mv: (path: string) => Promise<void>;
}

export const evaluarGato = async (req: Request, res: Response) => {
    let rutaLocal = "";
    try {
        // Validamos usando la variable convertida
        if (!req.files || !Object.keys(req.files).length || !req.files.imagen) {
            return res.status(400).json({ mensaje: "Por favor sube una imagen." });
        }   

        const archivo = req.files.imagen as UploadedFile;
        rutaLocal = archivo.tempFilePath; // express-fileupload nos da esta ruta temporal

        console.log("Procesando imagen en:", rutaLocal);

        // Llamamos al servicio
        const esGato = await analizarImagenGato(rutaLocal);

        // limpieza de datos temporales manualmente
        try {
            if (fs.existsSync(rutaLocal)) fs.unlinkSync(rutaLocal);
        } catch (e) { console.error("No se pudo borrar temporal:", e); }


        // Decisión basada en el análisis
        if (!esGato) {
        console.log("RECHAZADO: La IA dice que no es un gato.");
        return res.status(400).json({
            aprobado: false,
            mensaje: "Lo sentimos, la imagen no parece ser un gato."
        });
        }

        console.log("APROBADO: Es un gato.");
        
        return res.status(200).json({
        aprobado: true,
        mensaje: "¡Gato verificado correctamente!"
        });

    } catch (error) {
        console.error("Error en juez:", error);
        if (rutaLocal && fs.existsSync(rutaLocal)) fs.unlinkSync(rutaLocal);
        return res.status(500).json({mensaje: "El servicio de IA está saturado temporalmente. Intenta de nuevo en unos segundos."});
    }
};