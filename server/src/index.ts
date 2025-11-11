import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.Routes';
import gatoRoutes from './routes/gato.Routes';

//cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// --------- Definir Rutas de la API --------- //
app.use('/api/auth', authRoutes);
app.use('/api/gatos', gatoRoutes);

// Rutas de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send('¡Servidor KATZE funcionando correctamente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});