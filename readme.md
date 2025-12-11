### KATZE - Plataforma de Adopción y Comunidad Felina
## "Un futuro dorado comienza contigo."

Bienvenido a KATZE, una aplicación web full-stack diseñada para modernizar y optimizar el proceso de adopción de gatos, reportar mascotas perdidas y gestionar una comunidad de ayuda animal. Este proyecto no es solo un catálogo; es un sistema integral con gestión de roles, seguridad y automatización.

## Descripción del Proyecto

KATZE resuelve el problema de la gestión manual en refugios y la dispersión de información sobre gatos perdidos. El sistema se divide en dos experiencias:

#   1.- Experiencia Pública (Usuario):

-   Explorar gatos disponibles para adopción con filtros inteligentes.
-   Solicitar adopciones mediante un flujo guiado (Popup con reglas).
-   Reportar gatos perdidos subiendo fotos y ubicación.
-   Ver transparencia de donaciones y noticias del blog.
-   Interfaz moderna con Modo Oscuro/Claro automático.

#   2.- Experiencia Administrativa (MCP - Moderation Control Panel):

-   Un panel de control protegido para Administradores y Moderadores.
-   **Gestión de Adopciones**: Crear fichas de gatos, subir fotos y cambiar estados (En Adopción -> Adoptado).
-   **Moderación de Reportes**: Aprobar o rechazar reportes de la comunidad antes de que sean públicos.
-   **Bandeja de Solicitudes**: Recibir formularios de interesados, filtrarlos y contactar vía WhatsApp.
-   **Automatización**: Integración con Make para rechazo automático de perfiles no aptos y análisis de imágenes con IA.

## Tecnologías Utilizadas

Este proyecto utiliza el stack MERN (Mongo, Express, React, Node) potenciado con TypeScript para máxima robustez.

## Frontend (Cliente)

-   **React + Vite**: Para una interfaz ultra-rápida y reactiva.
-   **TypeScript**: Tipado estático para evitar errores humanos y mejorar la calidad del código.
-   **Tailwind CSS**: Diseño moderno, responsivo y sistema de temas (Dark Mode) sin escribir CSS tradicional.
-   **Axios**: Gestión de peticiones HTTP con interceptores para seguridad (tokens).
-   **React Router DOM**: Manejo de navegación SPA (Single Page Application).
-   **React Icons**: Iconografía ligera.
-   **React Helmet Async**: Gestión de metadatos para SEO y Open Graph (compartir en redes sociales).

## Backend (Servidor)

-   **Node.js + Express**: El núcleo del servidor REST API.
-   **MongoDB + Mongoose**: Base de datos NoSQL flexible para manejar gatos, usuarios y reportes.
-   **TypeScript**: Mantenemos la consistencia de tipos entre front y back.
-   **Cloudinary**: Almacenamiento y optimización de imágenes en la nube.
-   **Express-FileUpload**: Manejo de subida de archivos (fotos) desde el cliente.

## Ciberseguridad

-   **JWT (JSON Web Tokens)**: Autenticación segura sin sesiones de servidor.
-   **Bcryptjs**: Hashing de contraseñas (nunca se guardan en texto plano).
-   **Express-Validator**: Middleware de sanitización para prevenir inyecciones NoSQL y XSS en todos los formularios.
-   **RBAC (Role-Based Access Control)**: Sistema de permisos estricto (Admin, Moderador, User).

## Automatización e IA

-   **Make (Integromat)**: Orquestación de flujos de trabajo (Emails automáticos, validación externa).
-   **Axios (Backend)**: Comunicación servidor a servidor para los Webhooks.

## Estructura del Proyecto

El proyecto es un Monorepo dividido claramente en dos mundos:

```bash
katze-web-app/
├── 📂 client/    # Todo el Frontend (React)
└── 📂 server/    # Todo el Backend (Node.js)
```

***cliente***

```bash
├── 🖥️ client/
│   │
│   ├── public/                 # (Archivos estáticos públicos)
│   │
│   ├── src/
│   │   ├── assets/             # (Imágenes y recursos estáticos)
│   │   │   ├── gato-donacion.png
│   │   │   ├── qr-banco.png
│   │   │   └── react.svg
│   │   │
│   │   ├── components/         # (Componentes reorganizados por tipo)
│   │   │   ├── AdminRoute.tsx      # (Protección de rutas)
│   │   │   ├── Footer.tsx
│   │   │   ├── GatoCard.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── popup.ts
│   │   │   ├── ProtectedRoute.tsx  # (Protección de rutas)
│   │   │   ├── ScrollToTop.tsx
│   │   │   └── SolicitudPopup.tsx
│   │   │
│   │   ├── context/            # (Contextos globales)
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── pages/              # (Vistas principales)
│   │   │   ├── AdoptaPage.tsx
│   │   │   ├── ComunidadPage.tsx
│   │   │   ├── DonarPage.tsx
│   │   │   ├── GatoDetailPage.tsx
│   │   │   ├── GatoPerdidoDetailPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── PerfilPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ReportarPage.tsx
│   │   │   │
│   │   │   └── Admin/          # (Sub-sección de administración)
│   │   │       ├── ConfigManager.tsx
│   │   │       ├── CreateGatoPage.tsx
│   │   │       └── DashboardPage.tsx
│   │   │
│   │   ├── services/           # (Lógica de conexión con API)
│   │   │   ├── apiClient.Service.ts
│   │   │   ├── auth.Service.ts
│   │   │   ├── gato.Service.ts
│   │   │   ├── juez.Service.ts
│   │   │   ├── reporte.Service.ts
│   │   │   └── solicitud.Service.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .env
│   ├── .env.example
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
```

***server***

```bash
├── ⚙️ server/ (Backend - Node.js + Express + TypeScript)
│   │
│   ├── src/
│   │   ├── config/             # (Configuración de Base de Datos y servicios externos)
│   │   │   ├── cloudinary.ts       # (Configuración de subida de imágenes)
│   │   │   └── db.ts               # (Conexión a MongoDB/SQL)
│   │   │
│   │   ├── controllers/        # (Lógica que recibe la petición y envía la respuesta)
│   │   │   ├── auth.Controller.ts
│   │   │   ├── config.Controller.ts
│   │   │   ├── gato.Controller.ts
│   │   │   ├── juez.Controller.ts
│   │   │   ├── reporte.Controller.ts
│   │   │   └── solicitud.Controller.ts
│   │   │
│   │   ├── middleware/         # (Intermediarios: Protección y validación)
│   │   │   ├── auth.Middleware.ts      # (Verificación de Tokens/Sesión)
│   │   │   └── validator.Middleware.ts # (Validación de datos de entrada)
│   │   │
│   │   ├── models/             # (Esquemas de datos - Mongoose/ORM)
│   │   │   ├── Config.Model.ts
│   │   │   ├── Gato.Model.ts
│   │   │   ├── ReportePerdido.Model.ts
│   │   │   ├── Solicitud.Model.ts
│   │   │   └── User.Model.ts
│   │   │
│   │   ├── routes/             # (Definición de los Endpoints de la API)
│   │   │   ├── auth.Routes.ts
│   │   │   ├── config.Routes.ts
│   │   │   ├── gato.Routes.ts
│   │   │   ├── juez.Routes.ts
│   │   │   ├── reporte.Routes.ts
│   │   │   └── solicitud.Routes.ts
│   │   │
│   │   ├── services/           # (Lógica de negocio compleja o APIs externas)
│   │   │   └── gemini.Service.ts   # (Integración con IA Gemini)
│   │   │
│   │   └── index.ts            # (Punto de entrada: Inicialización del servidor)
│   │
│   ├── tmp/                    # (Archivos temporales)
│   ├── .env                    # (Variables de entorno - CLAVES SECRETAS)
│   ├── .env.example            # (Ejemplo de variables requeridas)
│   ├── package.json            # (Dependencias y scripts)
│   └── tsconfig.json           # (Configuración de TypeScript)
```

## Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en tu máquina local.

# 1.- Prerrequisitos

-   Node.js instalado (v16 o superior).
-   Una cuenta en MongoDB Atlas (para la base de datos).
-   Una cuenta en Cloudinary (para las imágenes).
-   (Opcional) Cuenta en Make para las automatizaciones.

# 2.- Clonar el Repositorio

```bash
git clone https://github.com/WilEgRo/katze-web-app.git
cd katze-web-app
```

# 3.- Configurar el Backend (Servidor)

-   Entra a la carpeta del servidor e instala dependencias:
```bash
    cd server
    npm install
```

-   Crea un archivo `.env` en la raíz de `server/` con las siguientes variables:

```bash
    PORT=8080
    MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/katzeDB
    JWT_SECRET=tu_palabra_secreta_super_segura

    # Cloudinary (Para las fotos)
    CLOUDINARY_CLOUD_NAME=tu_cloud_name
    CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret

    # Make Webhooks (Opcional si no vas a usar automatización aún)
    GOOGLE_API_KEY=tu_gemini_api_key
```

-   Inicia el servidor en modo desarrollo:

```bash
    npm run dev
```
**Deberías ver: "MongoDB Conectado Exitosamente"**

# 4.- Configurar el Frontend (Cliente)

-   Abre una nueva terminal, ve a la carpeta del cliente e instala dependencias:

```bash
    cd client
    npm install
```

-   Crea un archivo `.env` en la raíz de `client/`:

```bash
    VITE_API_URL=http://localhost:8080/api
```

-   Inicia el cliente:

```bash
    npm run dev
```
**Abre tu navegador en** `http://localhost:5173`

# 5.- Gestión de Usuarios y Roles

-   El sistema cuenta con 3 roles jerárquicos:
    - **USER**: Usuario estándar. Puede ver gatos, reportar perdidos y guardar favoritos.
    - **MODERADOR**: Puede aprobar/rechazar reportes de gatos perdidos.
    - **ADMIN**: Acceso total al MCP. Puede crear gatos, noticias, gestionar usuarios y configuraciones.

-   ¿Cómo crear el primer Admin?
    - Regístrate normalmente en la web (`/register`).
    - Ve a tu base de datos (MongoDB Atlas), busca la colección users.
    - Edita tu usuario y cambia el campo `role: "USER"` por `role: "ADMIN"`.
    - Vuelve a iniciar sesión. ¡Ahora verás el acceso al Panel de Control!

# 6.- Pruebas y Uso

- **API**: Las rutas están protegidas. Usa Postman para probar endpoints si es necesario, enviando el token en el Header `Authorization: Bearer <token>`.
- **Make**: Si configuras los webhooks, cada vez que alguien solicite adoptar un gato, Make recibirá los datos. Puedes configurar lógica para rechazar automáticamente si no cumplen requisitos (ej. vivir en departamento con muchos hijos).

