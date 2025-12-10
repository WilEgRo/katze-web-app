// src/services/gemini.Service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv"; 

dotenv.config();

// Iniciamos Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

// Convierte imagen local a base64
function fileToGenerativePart(path: string, mimeType: string) {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString("base64"),
            mimeType,
        },
    };
}

export const analizarImagenGato = async (rutaImagen: string): Promise<boolean> => {
    try {
        // Usamos el modelo Flash (rápido y económico)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "Actúa como un filtro estricto. Analiza esta imagen. Responde SOLAMENTE con la palabra 'SI' si la imagen contiene un gato real (felino doméstico). Responde 'NO' si es un perro, un dibujo, un peluche, una persona o si la imagen no es clara. No des explicaciones.";

        const imagePart = fileToGenerativePart(rutaImagen, "image/jpeg");

        console.log("Consultando a Gemini sobre la imagen...");
        
        const result = await model.generateContent([
            { text: prompt },
            imagePart
        ]);

        const text = result.response.text().trim().toUpperCase();

        console.log(`Veredicto de Gemini: ${text}`);

        return text === "SI";

    } catch (error) {
        console.error("Error en el servicio de Gemini:", error);
        // Si falla la IA, devolvemos false por seguridad (o true si para revisión humana)
        return false;
    }
};