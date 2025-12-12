import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.Routes';
import gatoRoutes from './routes/gato.Routes';
import reporteRoutes from './routes/reporte.Routes';
import fileUpload = require('express-fileupload');
import configRoutes from './routes/config.Routes';
import solicitudRoutes from './routes/solicitud.Routes';
import juezRoutes from "./routes/juez.Routes";

//cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 8080;

// ------------- Middleware -------------
const whiteList = [
  process.env.FRONTEND_URL, // Leerá la URL de Vercel en Producción
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Bloqueado por CORS. Origen intentando entrar:", origin);
      callback(new Error('Error de CORS: No permitido por Katze Policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitimos PUT para subir archivos
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// 3. ARCHIVOS TEMPORALES (Universal)
app.use(fileUpload({
  useTempFiles: true
}));

// --------- Definir Rutas de la API --------- //
app.use('/api/auth', authRoutes); //→ Rutas de autenticación
app.use('/api/gatos', gatoRoutes); //→ Rutas de gestión de gatos
app.use('/api/reportes', reporteRoutes); //→ Rutas de gestión de reportes
app.use('/api/config', configRoutes); // rutas cambiar qr de donaciones y foto del gato
app.use('/api/solicitudes', solicitudRoutes); //→ Rutas de gestión de solicitudes de adopción
app.use("/api/MCP", juezRoutes); //→ Rutas del juez de gatos

// Rutas de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send('¡Servidor KATZE funcionando correctamente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`CORS permitido para: ${whiteList}`);
}); 