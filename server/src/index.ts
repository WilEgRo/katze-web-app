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
const normalizeOrigin = (value: string) => value.trim().replace(/\/$/, '');

const envOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS?.split(',') ?? []),
]
  .filter((origin): origin is string => Boolean(origin?.trim()))
  .map(normalizeOrigin);

const whiteList = new Set([
  ...envOrigins,
  'http://localhost:5173',
  'https://katze-web-app.vercel.app',
]);

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (curl, servidores, same-origin)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    // Permite el dominio principal y previews de Vercel del proyecto
    const isKatzVerceOrigin = /^https:\/\/katze-web-app(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(normalizedOrigin);

    if (whiteList.has(normalizedOrigin) || isKatzVerceOrigin) {
      return callback(null, true);
    }

    console.log('Bloqueado por CORS. Origen intentando entrar:', normalizedOrigin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

app.use(cors(corsOptions));

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
  console.log('CORS permitido para:', Array.from(whiteList));
}); 