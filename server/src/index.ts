import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

//cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send('¡Servidor Express funcionando correctamente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});