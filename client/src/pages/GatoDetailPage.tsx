import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGatoById, type Gato } from '../services/gatoService';
import { FaArrowLeft, FaHeart, FaWhatsapp, FaMapMarkerAlt, FaSyringe, FaPaw } from 'react-icons/fa';

const GatoDetailPage = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [gato, setGato] = useState<Gato | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGato = async () => {
      if (!id) return;
      try {
        const data = await getGatoById(id);
        setGato(data);
      } catch (error) {
        console.error("Error cargando gato", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGato();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-katze-gold">Cargando perfil...</div>;
  if (!gato) return <div className="min-h-screen flex items-center justify-center text-gray-500">Gato no encontrado.</div>;

  // Mensaje predefinido para WhatsApp
  const mensajeWsp = `Hola, estoy interesado en adoptar a ${gato.nombre}, lo vi en la web de KATZE.`;
  const linkWsp = `https://wa.me/59179903823?text=${encodeURIComponent(mensajeWsp)}`;

  return (
    <div className="min-h-screen bg-white dark:bg-katze-dark transition-colors pb-20">
      
      {/* FOTO GRANDE (Hero del detalle) */}
      <div className="relative h-[50vh] md:h-[60vh] w-full bg-gray-200">
        <img 
          src={gato.fotos[0]} 
          alt={gato.nombre} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <Link to="/adopta" className="absolute top-6 left-6 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 hover:bg-katze-gold transition">
           <FaArrowLeft /> Volver
        </Link>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
           <div className="container mx-auto">
             <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 font-serif">{gato.nombre}</h1>
             <div className="flex items-center gap-4 text-white/90 text-lg">
               <span className="bg-katze-gold text-black px-3 py-1 rounded-full text-xs font-bold uppercase">{gato.estado}</span>
               <span>• {gato.edad}</span>
               <span>• {gato.caracter}</span>
             </div>
           </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="container mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Historia */}
          <div className="md:col-span-2 bg-white dark:bg-katze-dark-card rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaPaw className="text-katze-gold" /> Mi Historia
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
              {gato.descripcion}
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><FaSyringe /></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Salud</p>
                  <p className="text-gray-800 dark:text-white font-medium">{gato.estadoSalud}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl">
                <div className="bg-green-100 text-green-600 p-3 rounded-full"><FaMapMarkerAlt /></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Ubicación Actual</p>
                  <p className="text-gray-800 dark:text-white font-medium">Refugio Central</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Acción */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-katze-dark-card rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                ¿Te enamoraste?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Dale a {gato.nombre} el hogar que siempre soñó. El proceso es gratuito y guiado.
              </p>
              
              <a 
                href={linkWsp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition transform hover:-translate-y-1 mb-4 flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="text-xl" /> Solicitar Adopción
              </a>
              
              <button className="w-full text-center border-2 border-katze-gold text-katze-gold font-bold py-3 rounded-xl hover:bg-katze-gold hover:text-white transition flex items-center justify-center gap-2">
                <FaHeart /> Guardar en Favoritos
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default GatoDetailPage;