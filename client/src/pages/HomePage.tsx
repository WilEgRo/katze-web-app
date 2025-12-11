import Hero from '../components/Hero';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GatoCard from '../components/GatoCard';
import { getGatosAdoptados, type Gato } from '../services/gato.Service';
import { getReportesPublicos, type Reporte } from '../services/reporte.Service';
import { FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaQuoteLeft } from 'react-icons/fa';

const HomePage = () => {
  const [historias, setHistorias] = useState<Gato[]>([]);
  const [perdidos, setPerdidos] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHistoria, setSelectedHistoria] = useState<Gato | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gatosData, reportesData] = await Promise.all([
          getGatosAdoptados(),
          getReportesPublicos()
        ]);
        setHistorias(gatosData.slice(0, 4));
        setPerdidos(reportesData.slice(0, 4));
      } catch (error) {
        console.error("Error al cargar los datos de la HomePage:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-white dark:bg-katze-dark transition-colors relative">
      
      {/* SECCIÓN 1: HERO */}
      <Hero />

      {/* SECCIÓN 2: HISTORIAS DE ÉXITO */}
      <section className="container mx-auto px-8 py-16">
        <div className="flex flex-col items-center mb-12">
          <span className="h-2 w-2 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
          <span className="h-2 w-2 bg-katze-gold rounded-full"></span>
          <span className="h-2 w-2 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
        </div>
        
        <h2 className="text-4xl font-bold text-katze-gold font-serif text-center">Historias de Éxito</h2>
        <p className='text-center text-gray-500 mt-4 max-w-2xl mx-auto'>
          Ellos ya encontraron su final feliz. Con tu ayuda, podemos escribir muchas historias más.
        </p>

        {loading ? (
          <div className="text-center mt-10 text-gray-400">Cargando historias...</div>
        ) : historias.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10'>
            {historias.map(gato => (
              <div key={gato._id} onClick={() => setSelectedHistoria(gato)}>
                 {/* NOTA: Necesitamos GatoCard.tsx para quitarle el Link interno y que use este onClick */}
                 <GatoCard gato={gato} />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-2xl text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 mt-8'>
            Aún no hay historias publicadas. ¡Sé el primero en adoptar!
          </div>
        )}
      </section>
      
      {/* SECCIÓN 3: GATOS PERDIDOS (Aprobados) */}
      <section className="py-20 bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
        <div className="container mx-auto px-8">
          <div className='flex justify-between items-end mb-12'>
            <div>
              <h2 className="text-4xl font-bold text-katze-gold font-serif text-center md:text-left">
                Ayúdanos a Encontrarlos
              </h2>
              <p className="text-katze-gold font-medium text-center md:text-left">Gatos reportados recientemente</p>
            </div>
            <Link to="/comunidad" className="hidden md:block text-sm font-bold text-gray-500 hover:text-katze-gold transition underline">
              Ver todos los reportes
            </Link>
          </div>

          {loading ? (
             <div className="text-center py-10 text-gray-400">Cargando alertas...</div>
          ) : perdidos.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {perdidos.map(reporte => (
                 // --- ENLACE AL DETALLE (Punto 4) ---
                 <Link to={`/reporte/${reporte._id}`} key={reporte._id} className="block group">
                   <div className="bg-white dark:bg-katze-dark-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-red-600/30 h-full flex flex-col">
                     <div className="h-48 overflow-hidden relative">
                       <img src={reporte.foto} alt="Gato Perdido" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                       <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                         Perdido
                       </div>
                     </div>
                     
                     <div className="p-5 flex-1 flex flex-col">
                       <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">{reporte.zona}</h3>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{reporte.descripcion}</p>
                       
                       <div className="mt-auto flex flex-col gap-2 text-xs text-gray-400">
                         <div className="flex items-center gap-2">
                           <FaMapMarkerAlt className="text-katze-gold" />
                           <span className="truncate">{reporte.zona}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <FaCalendarAlt className="text-katze-gold" />
                           <span>{new Date(reporte.fecha).toLocaleDateString()}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
          ) : (
             <div className="text-center py-10 text-gray-400">
               No hay reportes de gatos perdidos activos. ¡Buenas noticias!
             </div>
          )}

          <div className="mt-10 text-center md:hidden">
             <Link to="/reportar" className="btn-primary bg-katze-gold text-white py-3 px-6 rounded-full font-bold shadow-lg">
               Reportar un Gato
             </Link>
          </div>
        </div>
      </section>

      {/* --- POPUP (MODAL) DE HISTORIA DE ÉXITO --- */}
      {selectedHistoria && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedHistoria(null)}>
          <div className="bg-white dark:bg-katze-dark-card w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            
            <button onClick={() => setSelectedHistoria(null)} className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition">
              <FaTimes />
            </button>

            <div className="h-64 relative">
              <img src={selectedHistoria.fotos[0]} className="w-full h-full object-cover" alt={selectedHistoria.nombre} />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                <h3 className="text-3xl font-bold text-white font-serif">{selectedHistoria.nombre}</h3>
                <p className="text-white/80 text-sm">Adoptado felizmente</p>
              </div>
            </div>

            <div className="p-8">
              <FaQuoteLeft className="text-4xl text-katze-gold/20 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 italic text-lg leading-relaxed mb-6">
                "{selectedHistoria.descripcion}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                 <div className="w-12 h-12 bg-katze-gold text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {selectedHistoria.nombre[0]}
                 </div>
                 <div>
                    <p className="font-bold text-gray-800 dark:text-white">Familia Adoptante</p>
                    <p className="text-xs text-gray-400">Final Feliz en KATZE</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;