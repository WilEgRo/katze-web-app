import { useEffect, useState } from 'react';
import { getAllReportesAdmin, updateReporteEstado, type Reporte } from '../services/reporteService';
import { logout } from '../services/authService';
import { FaCheck, FaTimes, FaSignOutAlt, FaClock, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';


const DashboardPage = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pendiente' | 'todos'>('pendiente');
  const [error, setError] = useState('');

  // Cargar reportes al iniciar
  const fetchReportes = async () => {
    try {
      setLoading(true);
      setError(''); // limpiar el error previo
      console.log("intentando cargar reportes admin...");
      const data = await getAllReportesAdmin();
      console.log("Reportes cargados:", data);
      setReportes(data);
    } catch (error: any) {
      console.error("Error cargando reportes", error);
      // mostrar el error en pantalla para saber que pasa
      setError(error.response?.data?.message || 'Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  // Manejar la moderación (Aprobar/Rechazar)
  const handleModerate = async (id: string, nuevoEstado: 'aprobado' | 'rechazado') => {
    try {
      // 1. Llamada al backend
      await updateReporteEstado(id, nuevoEstado);
      
      // 2. Actualizar la UI localmente (Optimistic update)
      setReportes(prev => prev.map(rep => 
        rep._id === id ? { ...rep, estado: nuevoEstado } : rep
      ));
      
    } catch (error) {
      alert("Error al actualizar el estado");
    }
  };

  // Filtramos qué mostrar según la pestaña seleccionada
  const filteredReportes = filter === 'pendiente' 
    ? reportes.filter(r => r.estado === 'pendiente')
    : reportes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark transition-colors p-6">
      <div className="container mx-auto max-w-6xl">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-katze-gold font-serif">Panel de Control (MCP)</h1>
            <p className="text-gray-500 dark:text-gray-400">Administra los reportes de la comunidad.</p>
          </div>

          <div className="flex gap-3">
            <Link to="/admin/crear-gato" className="flex items-center gap-2 px-4 py-2 bg-katze-gold text-white rounded-lg hover:bg-yellow-600 transition font-bold text-sm shadow-lg">
              <FaPlus /> Agregar Gato
            </Link>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-bold text-sm"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>

        {/* MENSAJE DE ERROR EN PANTALLA */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            ⚠️ Error: {error}
          </div>
        )}

        {/* PESTAÑAS DE FILTRO */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-1">
          <button 
            onClick={() => setFilter('pendiente')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 transition border-b-2 ${filter === 'pendiente' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <FaClock /> Pendientes de Revisión
          </button>
          <button 
            onClick={() => setFilter('todos')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 transition border-b-2 ${filter === 'todos' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <FaHistory /> Historial Completo
          </button>
        </div>

        {/* LISTA DE REPORTES */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Cargando panel...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {filteredReportes.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white dark:bg-katze-dark-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400">
                No hay reportes en esta sección. ¡Buen trabajo! 🎉
              </div>
            )}

            {filteredReportes.map((reporte) => (
              <div key={reporte._id} className="bg-white dark:bg-katze-dark-card rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6">
                
                {/* FOTO */}
                <div className="sm:w-1/3 h-48 sm:h-auto relative rounded-xl overflow-hidden bg-gray-100">
                  <img src={reporte.foto} alt="Gato" className="w-full h-full object-cover" />
                  
                  {/* Etiqueta de estado */}
                  <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold uppercase text-white shadow-sm
                    ${reporte.estado === 'pendiente' ? 'bg-yellow-500' : ''}
                    ${reporte.estado === 'aprobado' ? 'bg-green-500' : ''}
                    ${reporte.estado === 'rechazado' ? 'bg-red-500' : ''}
                  `}>
                    {reporte.estado}
                  </div>
                </div>

                {/* INFO Y ACCIONES */}
                <div className="sm:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {reporte.zona}
                      </h3>
                      <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {new Date(reporte.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                      {reporte.descripcion}
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="font-bold text-xs uppercase text-gray-400 block mb-1">Contacto:</span>
                      {reporte.contacto}
                    </div>
                  </div>

                  {/* BOTONES DE MODERACIÓN (Solo si está pendiente) */}
                  {reporte.estado === 'pendiente' && (
                    <div className="flex gap-3 mt-2">
                      <button 
                        onClick={() => handleModerate(reporte._id, 'aprobado')}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition"
                      >
                        <FaCheck /> Aprobar
                      </button>
                      <button 
                        onClick={() => handleModerate(reporte._id, 'rechazado')}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition"
                      >
                        <FaTimes /> Rechazar
                      </button>
                    </div>
                  )}
                  
                  {/* SI YA FUE MODERADO */}
                  {reporte.estado !== 'pendiente' && (
                     <div className="text-center text-sm text-gray-400 italic py-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                       Este reporte ya fue procesado.
                     </div>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;