import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReportesPublicos, type Reporte } from '../services/reporte.Service';
import { FaBullhorn, FaSearchLocation, FaHeart } from 'react-icons/fa';

const ComunidadPage = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReportesPublicos();
        setReportes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark transition-colors pb-20">
      
      {/* HEADER TIPO COMUNIDAD */}
      <div className="bg-white dark:bg-katze-dark-card py-16 px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-katze-gold font-serif mb-4">Comunidad Katze</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Un espacio donde nos ayudamos mutuamente. Encuentra mascotas perdidas, celebra adopciones y conecta con otros amantes de los gatos.
          </p>

          {/* BOTÓN DE ACCIÓN PRINCIPAL (Punto 7) */}
          <div className="mt-8">
            <Link 
              to="/reportar" 
              className="inline-flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-red-500/30 transition transform hover:-translate-y-1"
            >
              <FaBullhorn className="text-xl" />
              ¿Perdiste a tu mascota? Repórtalo aquí
            </Link>
          </div>
        </div>
      </div>

      {/* LISTA DE ALERTAS / HISTORIAS */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
          <FaSearchLocation className="text-katze-gold" /> Alertas Recientes
        </h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Cargando comunidad...</div>
        ) : reportes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportes.map((item) => (
              <div key={item._id} className="bg-white dark:bg-katze-dark-card rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition group">
                
                {/* Foto */}
                <div className="h-64 overflow-hidden relative">
                  <img src={item.foto} alt="Mascota" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {item.estado === 'aprobado' ? 'Buscando' : item.estado}
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1">{item.zona}</h3>
                    <span className="text-xs text-gray-400">{new Date(item.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {item.descripcion}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                    <span className="text-xs font-bold text-katze-gold uppercase">Contacto</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.contacto}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-katze-dark-card rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <FaHeart className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">No hay alertas activas en este momento. ¡Eso es bueno!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ComunidadPage;