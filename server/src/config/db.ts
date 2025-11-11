import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
    try {
        // leer la url de conexion desde las variables de entorno
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error("MONGO_URI no está definida en el archivo .env");
            process.exit(1);
        }
        // mongoose.connect devuelve una promesa
        await mongoose.connect(mongoURI);
        console.log("Conectado a la base de datos MongoDB");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
};

export default connectDB;