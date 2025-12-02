import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllReportesAdmin, updateReporteEstado, type Reporte } from '../../services/reporteService';
import { getGatos, updateGato, type Gato } from '../../services/gatoService';
import { logout } from '../../services/authService';
import { FaCheck, FaTimes, FaSignOutAlt, FaClock, FaHistory, FaCogs, FaCat, FaPlus, FaBullhorn } from 'react-icons/fa';

const DashboardPage = () => {
  // Estados para REPORTES
  const [reportes, setReportes] = useState<Reporte[]>([]);
  
  // Estados para GATOS (Adopción)
  const [gatos, setGatos] = useState<Gato[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pestaña activa: 'reportes' o 'gatos'
  const [activeTab, setActiveTab] = useState<'reportes' | 'gatos'>('reportes');
  const [filterReportes, setFilterReportes] = useState<'pendiente' | 'todos'>('pendiente');

  // Cargar datos
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Cargamos TODO junto (Reportes y Gatos)
      const [reportesData, gatosData] = await Promise.all([
        getAllReportesAdmin(),
        getGatos()
      ]);
      setReportes(reportesData);
      setGatos(gatosData);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar datos del panel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LÓGICA REPORTES ---
  const handleModerateReporte = async (id: string, nuevoEstado: 'aprobado' | 'rechazado') => {
    try {
      await updateReporteEstado(id, nuevoEstado);
      setReportes(prev => prev.map(r => r._id === id ? { ...r, estado: nuevoEstado } : r));
    } catch (e) { alert("Error al moderar reporte"); }
  };

  // --- LÓGICA GATOS (NUEVO) ---
  const handleChangeGatoStatus = async (id: string, nuevoEstado: string) => {
    try {
      // 1. Llamada al backend
      // @ts-ignore (Si TypeScript se queja del string, aunque updateGato debería aceptar Partial<Gato>)
      await updateGato(id, { estado: nuevoEstado });
      
      // 2. Actualizar UI
      // CORRECCIÓN AQUÍ: Usamos "as Gato['estado']" para decirle a TS que el string es válido
      setGatos(prev => prev.map(g => 
        g._id === id ? { ...g, estado: nuevoEstado as Gato['estado'] } : g 
      ));
      alert(`Estado actualizado a: ${nuevoEstado}`);
    } catch (e) { alert("Error al actualizar gato"); }
  };

  // Filtrado visual de reportes
  const filteredReportes = filterReportes === 'pendiente' 
    ? reportes.filter(r => r.estado === 'pendiente')
    : reportes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark transition-colors p-6 pt-24">
      <div className="container mx-auto max-w-6xl">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-katze-gold font-serif">Panel de Control (MCP)</h1>
            <p className="text-gray-500 dark:text-gray-400">Bienvenido, Admin.</p>
          </div>
          
          <div className="flex gap-3 flex-wrap justify-end">
             {/* BOTÓN CONFIGURACIÓN */}
             <Link 
               to="/admin/configuracion"
               className="flex items-center gap-2 px-4 py-2 bg-katze-gold text-white rounded-lg hover:bg-[#b08d4b] transition font-bold text-sm shadow-lg"
             >
               <FaCogs /> Configurar Web
             </Link>

             {/* BOTÓN NUEVO GATO */}
             <Link 
               to="/admin/crear-gato" 
               className="flex items-center gap-2 px-4 py-2 bg-katze-gold text-white rounded-lg hover:bg-[#b08d4b] transition font-bold text-sm shadow-lg"
             >
               <FaPlus /> Nuevo Gato
             </Link>

             {/* BOTÓN NUEVA NOTICIA */}
             <Link 
               to="/admin/crear-noticia" 
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-sm shadow-lg"
             >
               <FaBullhorn /> Nueva Noticia
             </Link>

             {/* BOTÓN CERRAR SESIÓN */}
             <button 
               onClick={logout} 
               className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-bold text-sm transition"
             >
               <FaSignOutAlt />
             </button>
          </div>
        </div>

        {/* --- PESTAÑAS PRINCIPALES (REPORTES vs GATOS) --- */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-katze-dark-card p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 w-fit">
          <button 
            onClick={() => setActiveTab('reportes')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'reportes' ? 'bg-katze-gold text-white shadow' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'}`}
          >
            Reportes Comunidad
          </button>
          <button 
            onClick={() => setActiveTab('gatos')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'gatos' ? 'bg-katze-gold text-white shadow' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'}`}
          >
            Gestión de Adopciones
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

        {/* ================= CONTENIDO: REPORTES ================= */}
        {activeTab === 'reportes' && (
          <div>
            {/* Sub-filtros Reportes */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-1">
              <button onClick={() => setFilterReportes('pendiente')} className={`pb-2 text-sm font-bold border-b-2 transition ${filterReportes === 'pendiente' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <FaClock className="inline mr-1"/> Pendientes
              </button>
              <button onClick={() => setFilterReportes('todos')} className={`pb-2 text-sm font-bold border-b-2 transition ${filterReportes === 'todos' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <FaHistory className="inline mr-1"/> Historial
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReportes.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white dark:bg-katze-dark-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400">
                  No hay reportes en esta sección. ¡Buen trabajo! 🎉
                </div>
              )}
              
              {filteredReportes.map((reporte) => (
                <div key={reporte._id} className="bg-white dark:bg-katze-dark-card rounded-2xl p-4 shadow border border-gray-100 dark:border-gray-800 flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img src={reporte.foto} className="w-full h-full rounded-lg object-cover bg-gray-200" alt="Reporte" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800 dark:text-white truncate pr-2">{reporte.zona}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full text-white uppercase font-bold flex-shrink-0
                        ${reporte.estado === 'pendiente' ? 'bg-yellow-500' : ''}
                        ${reporte.estado === 'aprobado' ? 'bg-green-500' : ''}
                        ${reporte.estado === 'rechazado' ? 'bg-red-500' : ''}
                      `}>
                        {reporte.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 my-1">{reporte.descripcion}</p>
                    <div className="text-xs text-gray-400 mb-2">Contacto: <span className="text-gray-600 dark:text-gray-300">{reporte.contacto}</span></div>
                    
                    {reporte.estado === 'pendiente' && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleModerateReporte(reporte._id, 'aprobado')} className="flex-1 bg-green-100 text-green-700 py-1 rounded text-xs font-bold hover:bg-green-200 flex items-center justify-center gap-1 transition"><FaCheck /> Aprobar</button>
                        <button onClick={() => handleModerateReporte(reporte._id, 'rechazado')} className="flex-1 bg-red-100 text-red-700 py-1 rounded text-xs font-bold hover:bg-red-200 flex items-center justify-center gap-1 transition"><FaTimes /> Rechazar</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CONTENIDO: GATOS (ADOPCIÓN) ================= */}
        {activeTab === 'gatos' && (
          <div className="bg-white dark:bg-katze-dark-card rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-black/20 text-xs text-gray-400 uppercase">
                  <tr>
                    <th className="p-4">Foto</th>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Estado Actual</th>
                    <th className="p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {gatos.map((gato) => (
                    <tr key={gato._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                      <td className="p-4">
                        <img src={gato.fotos[0]} alt={gato.nombre} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
                      </td>
                      <td className="p-4 font-bold text-gray-800 dark:text-white">
                        {gato.nombre}
                        <span className="block text-xs font-normal text-gray-400">{gato.edad}</span>
                      </td>
                      <td className="p-4">
                        {/* SELECTOR DE ESTADO */}
                        <select 
                          value={gato.estado}
                          onChange={(e) => handleChangeGatoStatus(gato._id, e.target.value)}
                          className={`
                            px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer shadow-sm appearance-none pr-8 relative
                            ${gato.estado === 'enAdopcion' ? 'bg-blue-100 text-blue-700' : ''}
                            ${gato.estado === 'adoptado' ? 'bg-green-100 text-green-700' : ''}
                            ${gato.estado === 'hogarTemporal' ? 'bg-purple-100 text-purple-700' : ''}
                          `}
                        >
                          <option value="enAdopcion">En Adopción</option>
                          <option value="adoptado">Adoptado 🏠</option>
                          <option value="hogarTemporal">Hogar Temporal</option>
                        </select>
                      </td>
                      <td className="p-4 text-gray-400">
                        <Link to={`/adopta/${gato._id}`} className="text-xs hover:text-katze-gold hover:underline flex items-center gap-1">
                          Ver Ficha
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {gatos.length === 0 && (
              <div className="text-center py-20">
                <FaCat className="mx-auto text-4xl text-gray-300 mb-4" />
                <p className="text-gray-400">No has registrado gatos aún.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;