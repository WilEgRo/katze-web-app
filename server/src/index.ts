import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.Routes';
import gatoRoutes from './routes/gato.Routes';
import reporteRoutes from './routes/reporte.Routes';
import fileUpload = require('express-fileupload');

//cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 8080;

// ------------- Middleware -------------
app.use(cors());
app.use(express.json());

app.use(fileUpload({
  useTempFiles: true, // Usar archivos temporales en lugar de memoria
  tempFileDir: '/tmp/', // Directorio temporal para almacenar archivos
}))

// --------- Definir Rutas de la API --------- //
app.use('/api/auth', authRoutes); //→ Rutas de autenticación
app.use('/api/gatos', gatoRoutes); //→ Rutas de gestión de gatos
app.use('/api/reportes', reporteRoutes); //→ Rutas de gestión de reportes

// Rutas de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send('¡Servidor KATZE funcionando correctamente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});