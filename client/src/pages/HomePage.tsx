import Hero from '../components/Hero';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GatoCard from '../components/GatoCard';
import { getGatosAdoptados, type Gato } from '../services/gatoService';
import { getReportesPublicos, type Reporte } from '../services/reporteService';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const HomePage = () => {

  const [historias, setHistorias] = useState<Gato[]>([]);
  const [perdidos, setPerdidos] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos las dos peticiones en paralelo para que sea mas rapido
        const [gatosData, reportesData] = await Promise.all([
          getGatosAdoptados(),
          getReportesPublicos()
        ]);

        //tomamos solo los 3 o 4 para no saturar al inicio
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
    <div className="min-h-screen pb-20 bg-white dark:bg-katze-dark transition-colors">
      
      {/* SECCIÓN 1: HERO */}
      <Hero />

      {/* SECCIÓN 2: HISTORIAS DE ÉXITO */}
      <section className="container mx-auto px-8 py-16">
        <div className="flex flex-col items-center mb-12">
          <span className="h-2 w-2 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
          <span className="h-2 w-2 bg-katze-gold rounded-full"></span>
          <span className="h-2 w-2 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
        </div>
        
        <h2 className="text-4xl font-bold text-katze-gold font-serif text-center">
          Historias de Éxito
        </h2>
        <p className='text-center text-gray-500 mt-4 max-w-2xl'>
          Ellos ya encontraron su final feliz. Con tu ayuda, podemos escribir muchas historias más.
        </p>
        {loading ? (
          <div className="text-center mt-10 text-gray-400">Cargando historias...</div>
        ) : historias.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5'>
            {historias.map(gato => (
              <GatoCard key={gato._id} gato={gato} />
            ))}
          </div>
        ) : (
          <div className='text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-2xl text-gray-400 border border-dashed border-gray-200 dark:border-gray-800'>
            Aún no hay historias publicadas. ¡Sé el primero en adoptar!
          </div>
        )}
      </section>
      
      {/* SECCIÓN 3: GATOS PERDIDOS (Aprobados)*/}
      <section className="py-20 bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
        <div className="container mx-auto px-8">
          <div className='flex justify-between items-end mb-12'>
            <div>
              <h2 className="text-4xl font-bold text-katze-gold font-serif text-center">
                Ayúdanos a Encontrarlos
              </h2>
              <p className="text-katze-gold font-medium">Gatos reportados recientemente</p>
            </div>
            <Link to="/reportar" className="hidden md:block text-sm font-bold text-gray-500 hover:text-katze-gold transition underline">
              Ver todos los reportes
            </Link>
          </div>

          {loading ? (
             <div className="text-center py-10 text-gray-400">Cargando alertas...</div>
          ) : perdidos.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {perdidos.map(reporte => (
                 <div key={reporte._id} className="bg-white dark:bg-katze-dark-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group border border-gray-100 dark:border-gray-800">
                   {/* Foto */}
                   <div className="h-48 overflow-hidden relative">
                     <img src={reporte.foto} alt="Gato Perdido" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                     <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                       Perdido
                     </div>
                   </div>
                   
                   {/* Info */}
                   <div className="p-5">
                     <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">
                       {reporte.zona}
                     </h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 h-8">
                       {reporte.descripcion}
                     </p>
                     
                     <div className="flex flex-col gap-2 text-xs text-gray-400">
                       <div className="flex items-center gap-2">
                         <FaMapMarkerAlt className="text-katze-gold" />
                         <span className="truncate">{reporte.zona}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <FaCalendarAlt className="text-katze-gold" />
                         <span>{new Date(reporte.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</span>
                       </div>
                     </div>
                   </div>
                 </div>
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

    </div>
  );
};

export default HomePage;
