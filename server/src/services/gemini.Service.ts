// src/services/gemini.Service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv"; 

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("La clave API de Google Generative AI no está configurada.");
}


// Iniciamos Gemini
const genAI = new GoogleGenerativeAI(apiKey);

//funcion de espera
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    const maxIntentos = 3;
    let intentos = 0;

    while (intentos < maxIntentos) {
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

            const response = await result.response; // Esperamos a que la respuesta esté lista
            const text = response.text().trim().toUpperCase();
            
            console.log(`🤖 Intento ${intentos + 1}: Veredicto ${text}`);

           return text.includes("SI");

        } catch (error: any) {
            if (error.message && error.message.includes("503")) {
                intentos++;
                console.warn(`⚠️ Servidor ocupado (503). Reintentando (${intentos}/${maxIntentos})...`);
                await delay(2000); // Esperamos 2 segundos antes de reintentar
                continue;
            }

            // Si es otro error (o se acabaron los intentos), fallamos de verdad
            console.error("❌ Error definitivo en Gemini:", error);
            
            throw error;
        }
    }
    return false; // Si agotamos los intentos, asumimos que no es un gato
};