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
  process.env.FRONTEND_URL, //vercel
  "http://localhost:5173", //vite dev
];

app.use(cors({
  origin: function (origin, callback) {
    // permitir peticiones sin origin (curl, servidores, same-origin)
    if (!origin) return callback(null, true);

    if (whiteList.includes(origin)) {
      return callback(null, true);
    }

    console.log('Bloqueado por CORS. Origen intentando entrar:', origin);
    // devolver false en vez de lanzar error para que CORS responda correctamente
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Responder preflight para todas las rutas
app.options('*', cors());

app.use(express.json());

// ARCHIVOS TEMPORALES (Universal)
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