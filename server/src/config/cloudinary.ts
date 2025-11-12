import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

//obtener las variables para que Ts no de error
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Hacemos una validacion en tiempo de ejecucion para asegurarnos de que las variables de entorno existen
if (!cloudName || !apiKey || !apiSecret) {
    console.error("Error critico: las variables de entorno de Cloudinary no estan definidas.");
    console.error("Asegurate de tener CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en tu archivo .env");
    process.exit(1); // detener la ejecucion del servidor si faltan las clases
}

// Configurar Cloudinary con las credenciales de entorno
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true // Usar HTTPS para las URLs de las imagenes
});

export default cloudinary;