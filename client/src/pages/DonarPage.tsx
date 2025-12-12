import React, { useState } from 'react';
import {
    FaCamera,
    FaHeart,
    FaEnvelope,
    FaUtensils,
    FaHandHoldingHeart,
    FaStethoscope
} from 'react-icons/fa'; // Importamos iconos nuevos para las categorías y el correo
import gatoHeroImage from '../assets/gato-donacion.png';
import qrImage from '../assets/qr-banco.png';

const DonarPage = () => {
    // Estado
    const [monto, setMonto] = useState<number | ''>('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState(''); // <--- NUEVO ESTADO PARA EL CORREO
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    // Definimos las categorías con Iconos. 
    // Mantenemos el 'valor' interno para rellenar el input, aunque no se muestre el texto "Bs".
    const opcionesDonacion = [
        { valor: 10, label: "Alimentos", icon: <FaUtensils className="text-2xl mb-1" /> },
        { valor: 25, label: "Rescates", icon: <FaHandHoldingHeart className="text-2xl mb-1" /> },
        { valor: 50, label: "Salud", icon: <FaStethoscope className="text-2xl mb-1" /> }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);

        // AQUÍ LUEGO CONECTAREMOS CON EL BACKEND PARA ENVIAR EL CORREO A MAKE
        console.log("Datos a enviar:", { nombre, email, monto, file });

        setTimeout(() => {
            alert(`¡Gracias ${nombre || 'amigo'}! Hemos recibido tu comprobante. Te enviaremos un correo a ${email} 😺`);
            setEnviando(false);
            setMonto('');
            setNombre('');
            setEmail(''); // Limpiamos el correo
            setFile(null);
            setPreviewUrl(null);
        }, 2000);
    };

    return (
        <div className="pt-24 pb-12 px-6 flex flex-col items-center justify-center min-h-screen">

            {/* SECCIÓN HERO (Imagen Gato Grande) */}
            <div className="relative mb-12 flex items-center justify-center group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-katze-gold opacity-30 blur-[80px] rounded-full -z-10 group-hover:opacity-40 transition duration-700"></div>
                <div className="relative h-64 w-64 md:h-80 md:w-80 transition-transform duration-500 group-hover:scale-105">
                    <img
                        src={gatoHeroImage}
                        alt="Gato Donación"
                        className="w-full h-full object-contain drop-shadow-2xl"
                        style={{ filter: 'drop-shadow(0 0 15px rgba(197, 160, 89, 0.5))' }}
                    />
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Tu ayuda <span className="text-katze-gold">transforma vidas</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-10">
                Cada donación cuenta para nuestros rescates, alimentos y cuidados veterinarios.
            </p>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* LADO IZQUIERDO: EL QR */}
                <div className="bg-white dark:bg-katze-dark-card p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center h-full justify-center">
                    <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <img
                            src={qrImage}
                            alt="QR Banco"
                            className="w-48 h-48 object-contain"
                        />
                    </div>
                    <p className="text-sm font-bold text-katze-gold uppercase tracking-wider mb-2">Escanea para donar</p>
                    <p className="text-xs text-gray-400">Banco Nacional - Cuenta Corriente</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">123-000000-00</p>
                </div>

                {/* LADO DERECHO: FORMULARIO */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Botones de Categoría (Sin mostrar precio, solo concepto) */}
                    <div className="grid grid-cols-3 gap-3">
                        {opcionesDonacion.map((opcion) => (
                            <button
                                key={opcion.label}
                                type="button"
                                onClick={() => setMonto(opcion.valor)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 group
                                ${monto === opcion.valor
                                        ? 'border-katze-gold bg-orange-50 dark:bg-yellow-900/10 text-katze-gold shadow-md transform scale-105'
                                        : 'border-gray-200 dark:border-gray-700 bg-transparent text-gray-500 hover:border-katze-gold/50 hover:text-katze-gold'
                                    }`}
                            >
                                {/* Icono */}
                                {opcion.icon}
                                {/* Texto solo */}
                                <span className="text-xs md:text-sm font-bold uppercase tracking-wide">
                                    {opcion.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Input Monto (Donde se ve el número) */}
                    <div className="relative group">
                        <input
                            type="number"
                            value={monto}
                            onChange={(e) => setMonto(Number(e.target.value))}
                            placeholder="Monto a donar..."
                            className="w-full bg-gray-50 dark:bg-katze-dark-card border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-katze-gold/50 transition-all placeholder:text-gray-400 pl-4"
                        />
                        <span className="absolute right-4 top-4 font-bold text-gray-400 group-focus-within:text-katze-gold transition-colors">Bs</span>
                    </div>

                    {/* Input Nombre */}
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu Nombre (Opcional)"
                        className="w-full bg-gray-50 dark:bg-katze-dark-card border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-katze-gold/50 transition-all placeholder:text-gray-400"
                    />

                    {/* NUEVO: Input Correo */}
                    <div className="relative group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Tu Correo (Para agradecerte)"
                            required // Hacemos el correo obligatorio si queremos automatizar
                            className="w-full bg-gray-50 dark:bg-katze-dark-card border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-katze-gold/50 transition-all placeholder:text-gray-400 pl-12"
                        />
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-katze-gold transition-colors" />
                    </div>

                    {/* Subir Comprobante */}
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="file-upload"
                            className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 gap-3
                            ${previewUrl ? 'border-katze-gold bg-orange-50 dark:bg-yellow-900/10' : 'border-gray-300 dark:border-gray-700 hover:border-katze-gold text-gray-500'}
                        `}
                        >
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="Preview" className="w-10 h-10 rounded object-cover border border-katze-gold" />
                                    <span className="text-sm font-medium text-katze-gold">¡Comprobante cargado!</span>
                                </>
                            ) : (
                                <>
                                    <FaCamera className="text-xl" />
                                    <span className="text-sm font-medium">Subir Comprobante</span>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Botón Enviar */}
                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full bg-katze-gold hover:bg-[#b08d4b] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {enviando ? 'Enviando...' : (
                            <>
                                Confirmar Donación <FaHeart />
                            </>
                        )}
                    </button>
                </form>

            </div>

            <div className="mt-8 flex gap-4 text-gray-300 dark:text-gray-700 text-2xl">
                <span>•</span><span>•</span><span>•</span>
            </div>

        </div>
    );
};

export default DonarPage;