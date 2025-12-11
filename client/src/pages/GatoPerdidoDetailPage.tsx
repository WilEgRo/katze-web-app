import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReporteById, type Reporte } from '../services/reporte.Service';
import { FaMapMarkerAlt, FaPhone, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

const GatoPerdidoDetailPage = () => {
  const { id } = useParams();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        if (id) {
            const data = await getReporteById(id);
            setReporte(data);
        }
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-32 text-center">Cargando...</div>;
  if (!reporte) return <div className="min-h-screen pt-32 text-center">Reporte no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark pt-28 pb-10 px-4">
      <div className="container mx-auto max-w-4xl">
        
        <Link to="/comunidad" className="inline-flex items-center gap-2 text-gray-500 hover:text-katze-gold mb-6 transition">
            <FaArrowLeft /> Volver a la comunidad
        </Link>

        <div className="bg-white dark:bg-katze-dark-card rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row">
            
            {/* FOTO GRANDE */}
            <div className="md:w-1/2 h-96 md:h-auto relative bg-gray-200">
                <img src={reporte.foto} alt="Gato Perdido" className="w-full h-full object-cover" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white ${
                    reporte.estado === 'encontrado' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {reporte.estado === 'encontrado' ? 'Encontrado 🎉' : 'Se busca 🔍'}
                </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 font-serif">
                    {reporte.nombreGato ? reporte.nombreGato : "Gato sin nombre"}
                </h1>
                <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                    <FaCalendarAlt /> Reportado el: {new Date(reporte.fecha).toLocaleDateString()}
                </p>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-katze-gold mb-1">Descripción</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {reporte.descripcion}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-katze-gold mb-1 flex items-center gap-2">
                            <FaMapMarkerAlt /> Zona / Ubicación
                        </h3>
                        <p className="text-gray-700 dark:text-gray-200 text-lg mb-3">
                            {reporte.zona}
                        </p>
                        {/* BOTÓN INTELIGENTE A GOOGLE MAPS */}
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reporte.zona)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-bold"
                        >
                            <FaMapMarkerAlt /> Ver en Google Maps
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-center text-gray-400 text-sm mb-3">¿Tienes información?</p>
                    <a 
                        href={`https://wa.me/${reporte.contacto}?text=Hola, vi tu reporte sobre el gato perdido en ${reporte.zona}...`}
                        target="_blank"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg text-lg"
                    >
                        <FaPhone /> Contactar Dueño ({reporte.contacto})
                    </a>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default GatoPerdidoDetailPage;