````bash
/katze-web-app (Carpeta Raíz del Proyecto)
│
├── 🖥️ client/ (Todo el Frontend - React + TypeScript)
│   │
│   ├── public/             # (Favicon, logo, etc.)
│   ├── src/
│   │   ├── assets/         # (Imágenes estáticas, iconos, CSS global si no es Tailwind)
│   │   │
│   │   ├── components/     # (Componentes Reutilizables)
│   │   │   ├── ui/         # (Botones, Tarjetas, Inputs, Modales - ej. Button.tsx)
│   │   │   ├── layout/     # (Navbar.tsx, Footer.tsx, Sidebar.tsx)
│   │   │   └── common/     # (Componentes específicos como GatoCard.tsx, ReporteMap.tsx)
│   │   │
│   │   ├── hooks/          # (Custom Hooks, ej: useAuth.ts, useApi.ts)
│   │   │
│   │   ├── pages/          # (Las "Vistas" principales de la App)
│   │   │   ├── HomePage.tsx          # (La página de inicio de la imagen)
│   │   │   ├── AdoptaPage.tsx        # (Galería de gatos en adopción)
│   │   │   ├── GatoDetailPage.tsx    # (Detalle de un gato específico)
│   │   │   ├── ReportarPage.tsx      # (Formulario público para reportar gato perdido)
│   │   │   ├── HistoriasPage.tsx     # (Historias de éxito)
│   │   │   ├── HogaresPage.tsx       # (Formulario para ser hogar temporal)
│   │   │   │
│   │   │   └── Admin/ (Sección Protegida - El MCP)
│   │   │       ├── AdminLoginPage.tsx      # (Formulario de login)
│   │   │       ├── Dashboard.tsx           # (Página principal del admin)
│   │   │       ├── GatosManager.tsx        # (CRUD para crear/editar gatos)
│   │   │       └── ReportesManager.tsx     # (¡El MCP! Para aprobar/rechazar reportes)
│   │   │
│   │   ├── services/       # (Lógica para conectar con nuestra API Backend)
│   │   │   ├── apiClient.ts  # (Configuración de Axios o Fetch, con headers)
│   │   │   ├── authService.ts  # (Funciones login(), register())
│   │   │   └── gatoService.ts  # (Funciones getGatos(), createGato())
│   │   │
│   │   ├── context/        # (Para estado global, ej: AuthContext.tsx)
│   │   │
│   │   ├── App.tsx         # (Define todas las rutas del Frontend)
│   │   └── main.tsx        # (Punto de entrada de React)
│   │
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
│
└── ⚙️ server/ (Todo el Backend - Node.js + Express)
    │
    ├── src/
    │   ├── config/         # (Configuración de servicios externos)
    │   │   ├── cloudinary.ts
    │   │   └── db.ts
    │   │
    │   ├── controllers/    # (Lógica de negocio)
    │   │   ├── auth.Controller.ts     # (Lógica de login/registro)
    │   │   ├── gato.Controller.ts     # (Lógica CRUD de Gatos)
    │   │   ├── reporte.Controller.ts  # (Lógica CRUD de Reportes - ¡Próximo paso!)
    │   │   └── (otros... ej: hogarTemporalController.ts)
    │   │
    │   ├── middleware/     # (Funciones intermedias)
    │   │   ├── auth.Middleware.ts     # (Seguridad de rutas - 'protect')
    │   │   └── validator.Middleware.ts # (Seguridad de datos - 'express-validator')
    │   │
    │   ├── models/         # (Esquemas de la Base de Datos)
    │   │   ├── Gato.Model.ts
    │   │   ├── ReportePerdido.Model.ts
    │   │   ├── User.Model.ts
    │   │   └── (otros... ej: HogarTemporalModel.ts)
    │   │
    │   ├── routes/         # (Definición de las URLs de la API)
    │   │   ├── auth.Routes.ts
    │   │   ├── gato.Routes.ts
    │   │   └── reporte.Routes.ts # (¡Próxmo paso!)
    │   │
    │   └── index.ts        # (Punto de entrada del Servidor Express)
    │
    ├── .env                # (¡SECRETO!)
    ├── package.json
    └── tsconfig.json
```# Estructura del Proyecto Katze Web App