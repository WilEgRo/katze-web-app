import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

// Importamos Modelos
import Gato from '../models/Gato.Model';
import ReportePerdido from '../models/ReportePerdido.Model';
import User from '../models/User.Model';
import Solicitud from '../models/Solicitud.Model';

// Configuración de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDB = async () => {
    try {
        console.log('🌱 Iniciando Seed (Semilla) de Datos...');

        if (!process.env.MONGO_URI) throw new Error("Falta MONGO_URI en .env");
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Conectado a MongoDB');

        // LIMPIEZA TOTAL (Borrar todo lo viejo)
        console.log('🧹 Limpiando base de datos...');
        await User.deleteMany({});
        await Gato.deleteMany({});
        await ReportePerdido.deleteMany({});
        await Solicitud.deleteMany({});

        // CREAR USUARIOS (Contraseña universal: "123456")
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("123456", salt);

        const users = [
            {
                _id: "692f423cac4783de197fdc66", // ID Original Admin
                username: "WilsonAdmin",
                email: "admin@katze.com",
                passwordHash,
                role: "ADMIN"
            },
            {
                _id: "692f43c6ff8f5df42914498d", // ID Original Cat86
                username: "Cat86",
                email: "usuario1@katze.com",
                passwordHash,
                role: "USER"
            },
            {
                _id: "692f44fcff8f5df429144990", // ID Original gatolover86
                username: "gatolover86",
                email: "usuario2@katze.com",
                passwordHash,
                role: "USER"
            },
            {
                _id: "693a3942e2d83bc97afb58dc", // ID Original WilsonER
                username: "WilsonER",
                email: "wilson@katze.com",
                passwordHash,
                role: "USER"
            }
        ];

        await User.insertMany(users);
        console.log('✅ Usuarios creados (Password: 123456)');

        // CREAR GATOS
        // Asignamos creadores lógicos para la demo
        const gatos = [
            {
                _id: "6913bf61ef902d710629a56b",
                nombre: "Milo",
                descripcion: "Un gato muy juguetón y cariñoso, rescatado de la calle.",
                fotos: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"],
                edad: "Cachorro",
                caracter: "Juguetón, amigable",
                estadoSalud: "Vacunado",
                estado: "hogarTemporal",
                creadoPor: users[1]?._id, // Cat86
                solicitudesCount: 1
            },
            {
                _id: "6914039fc639a22bc2795ea0",
                nombre: "Bombón",
                descripcion: "Encontrado en un motor, muy tímido al principio.",
                fotos: ["https://images.unsplash.com/photo-1573865526739-10659fec78a5"],
                edad: "2 meses",
                caracter: "Tímido, cariñoso",
                estadoSalud: "Primera vacuna",
                estado: "adoptado",
                creadoPor: users[2]?._id, // gatolover86
                solicitudesCount: 0
            },
            {
                _id: "69224ac66c4dd8bd30615d45",
                nombre: "Katze",
                descripcion: "Es un gatito amoroso que salva otros gatos.",
                fotos: ["https://images.unsplash.com/photo-1495360019602-e05980bf54ce"],
                edad: "1 año",
                caracter: "Juguetón, líder",
                estadoSalud: "Sin vacunas",
                estado: "adoptado",
                creadoPor: users[2]?._id, // gatolover86
                solicitudesCount: 0
            },
            {
                _id: "69236d44c4526886b0c1c934",
                nombre: "Zaira",
                descripcion: "Encontrada perdida cerca del parque.",
                fotos: ["https://images.unsplash.com/photo-1533738363-b7f9aef128ce"],
                edad: "2 meses",
                caracter: "Asustadiza",
                estadoSalud: "Tímida",
                estado: "enAdopcion",
                creadoPor: users[3]?._id, // WilsonER
                solicitudesCount: 2
            },
            {
                _id: "69236d9ac4526886b0c1c939",
                nombre: "Max",
                descripcion: "Encontrado en una escuela primaria.",
                fotos: ["https://images.unsplash.com/photo-1529778873920-4da4926a7071"],
                edad: "2 meses",
                caracter: "Juguetón",
                estadoSalud: "Vacunado",
                estado: "enAdopcion",
                creadoPor: users[0]?._id, // Admin
                solicitudesCount: 4
            },
            // Gatos pendientes de aprobación
            {
                _id: "693b480221733f4e491aadcf",
                nombre: "King (Pendiente)",
                descripcion: "Gato independiente busca hogar.",
                fotos: ["https://images.unsplash.com/photo-1519052537078-e6302a4968ef"],
                edad: "5 años",
                caracter: "Afable",
                estadoSalud: "Vacunas al día",
                estado: "pendiente",
                ubicacion: "Av. San Aurelio",
                creadoPor: users[3]?._id, // WilsonER
                solicitudesCount: 0
            }
        ];

        await Gato.insertMany(gatos);
        console.log('✅ Gatos creados (Inventario y Pendientes)');

        // CREAR REPORTES PERDIDOS
        const reportes = [
            {
                _id: "6917cf8389d2a3e3a815a596",
                nombreGato: "Michi Desconocido",
                descripcion: "Gatito atigrado con collar rojo, parece asustado.",
                foto: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6",
                zona: "Av. Mutualista, 3er Anillo",
                contacto: "79903823",
                estado: "aprobado",
                creadoPor: users[0]?._id // Admin
            },
            {
                _id: "69213e3fb03db454f581c4dd",
                nombreGato: "King",
                descripcion: "Se perdió saliendo de casa.",
                foto: "https://images.unsplash.com/photo-1574158622682-e40e69881006",
                zona: "Av. 3 pasos al frente",
                contacto: "79903823",
                estado: "aprobado",
                creadoPor: users[3]?._id // WilsonER
            },
            {
                _id: "693988ab418b0f217fd8720c",
                nombreGato: "Niko (Pendiente)",
                descripcion: "Gato blanco perdido ayer.",
                foto: "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
                zona: "Parque Urbano",
                contacto: "78945612",
                estado: "pendiente",
                creadoPor: users[1]?._id // Cat86
            }
        ];

        await ReportePerdido.insertMany(reportes);
        console.log('✅ Reportes creados');

        // CREAR SOLICITUDES DE ADOPCIÓN
        const solicitudes = [
            {
                _id: "6938b75e2b78ff519dce2a59",
                gatoId: gatos[4]?._id, // Max
                nombreSolicitante: "Wilson Eguez",
                telefono: "79903823",
                email: "eguez.r.wilson@gmail.com",
                motivo: "Le daré un lindo lugar",
                vivienda: "casa",
                tieneMallas: true,
                tienePatio: true,
                tieneNiños: true,
                cantidadNiños: 1,
                otrasMascotas: true,
                estado: "pendiente"
            },
            {
                _id: "6938e1afc833117ecf90e512",
                gatoId: gatos[3]?._id, // Zaira
                nombreSolicitante: "Santino Eguez",
                telefono: "79801307",
                email: "lamartina.bo@gmail.com",
                motivo: "Soy muy responsable",
                vivienda: "departamento",
                tieneMallas: true,
                tienePatio: false,
                tieneNiños: true,
                cantidadNiños: 2,
                otrasMascotas: true,
                estado: "aprobada"
            }
        ];

        await Solicitud.insertMany(solicitudes);
        console.log('✅ Solicitudes creadas');

        console.log('🚀 ¡SEED COMPLETADO EXITOSAMENTE!');
        process.exit();

    } catch (error) {
        console.error('❌ Error fatal en seed:', error);
        process.exit(1);
    }
};

seedDB();