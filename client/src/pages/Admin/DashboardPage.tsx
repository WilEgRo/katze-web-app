import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllReportesAdmin, updateReporteEstado, type Reporte } from '../../services/reporte.Service';
import { getGatos, updateGato, type Gato } from '../../services/gato.Service';
import { logout } from '../../services/auth.Service';
import { getSolicitudesAdmin, updateSolicitudEstado, type Solicitud } from '../../services/solicitud.Service';
import { FaCheck, FaTimes, FaSignOutAlt, FaClock, FaHistory, FaCogs, FaCat, FaPlus, FaBullhorn, FaEnvelopeOpenText, FaUser, FaHome, FaPhone, FaUserTie, FaUsers } from 'react-icons/fa';

const DashboardPage = () => {
  // Estados para REPORTES
  const [reportes, setReportes] = useState<Reporte[]>([]);
  
  // Estados para GATOS (Adopción)
  const [gatos, setGatos] = useState<Gato[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pestaña activa: 'reportes', 'gatos', 'solicitudes'
  const [activeTab, setActiveTab] = useState<'reportes' | 'gatos' | 'solicitudes'>('reportes');
  const [filterReportes, setFilterReportes] = useState<'pendiente' | 'todos'>('pendiente');

  // Cargar datos
  const fetchData = async () => {
    console.log(`cargando datos para el panel de admin... ${loading}`);
    setLoading(true);
    setError('');
    try {
      // Cargamos TODO junto (Reportes, Gatos y Solicitudes)
      const [reportesData, gatosData, solicitudesData] = await Promise.all([
        getAllReportesAdmin(),
        getGatos(),
        getSolicitudesAdmin()
      ]);

      setReportes(reportesData);
      setGatos(gatosData);
      setSolicitudes(solicitudesData);
      
    } catch (err: any) {
      console.error("Error cargando los datos", err);
      setError( err.response?.data?.message ||'Error al cargar datos del panel.');
      
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

  // --- LÓGICA GATOS ---
  const handleChangeGatoStatus = async (id: string, nuevoEstado: string) => {
    try {
      // Llamada al backend
      // Usamos "as any" porque la función espera un Partial<Gato> y TS se queja si le pasamos un string directamente
      await updateGato(id, { estado: nuevoEstado } as any);
      
      setGatos(prev => prev.map(g => 
        g._id === id ? { ...g, estado: nuevoEstado as Gato['estado'] } : g 
      ));
      alert(`Estado actualizado a: ${nuevoEstado}`);
    } catch (e) { alert("Error al actualizar gato"); }
  };

  const handleSolicitudState = async (id: string, nuevoEstado: 'aprobada' | 'rechazada') => {
    try {
      await updateSolicitudEstado(id, nuevoEstado);
      setSolicitudes(prev => prev.map(s => s._id === id ? { ...s, estado: nuevoEstado } : s));
      alert(`Solicitud ${nuevoEstado} correctamente.`);
    } catch (e) {
      alert("Error al actualizar estado de la solicitud");
    }
  };

  // Filtrado visual de reportes
  const filteredReportes = filterReportes === 'pendiente' 
    ? reportes.filter(r => r.estado === 'pendiente')
    : reportes;

  // filtro visual para solicitudes (pendiente primero luego por fecha)
  const sortedSolicitudes = [...solicitudes].sort((a, b) => {
    if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1;
    if (a.estado !== 'pendiente' && b.estado === 'pendiente') return 1;
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

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

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">⚠️ {error}</div>}

        {/* --- PESTAÑAS DE NAVEGACIÓN --- */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white dark:bg-katze-dark-card p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 w-fit">
          <button 
            onClick={() => setActiveTab('solicitudes')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${activeTab === 'solicitudes' ? 'bg-katze-gold text-white shadow' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'}`}
          >
            <FaEnvelopeOpenText /> Solicitudes ({solicitudes.filter(s => s.estado === 'pendiente').length})
          </button>
          <button 
            onClick={() => setActiveTab('reportes')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${activeTab === 'reportes' ? 'bg-katze-gold text-white shadow' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'}`}
          >
            <FaClock /> Reportes Comunidad
          </button>
          <button 
            onClick={() => setActiveTab('gatos')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${activeTab === 'gatos' ? 'bg-katze-gold text-white shadow' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'}`}
          >
            <FaCat /> Gestión Gatos
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

        {/* ================= CONTENIDO: SOLICITUDES ================= */}
        {activeTab === 'solicitudes' && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            {sortedSolicitudes.length === 0 && <p className="text-center text-gray-400 py-10">No hay solicitudes pendientes.</p>}

            {sortedSolicitudes.map((sol) => (
              <div key={sol._id} className="bg-white dark:bg-katze-dark-card rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row gap-6 hover:shadow-lg transition">
                
                {/* 1. Datos del Interesado */}
                <div className="flex-1 space-y-3 border-r border-gray-100 dark:border-gray-700 pr-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <FaUser className="text-katze-gold" /> {sol.nombreSolicitante}
                    </h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${sol.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : sol.estado === 'aprobada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {sol.estado}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <p><FaPhone className="inline mr-2 opacity-50"/> {sol.telefono}</p>
                    <p className="truncate" title={sol.email}><FaEnvelopeOpenText className="inline mr-2 opacity-50"/> {sol.email}</p>
                    <p><FaHome className="inline mr-2 opacity-50"/> {sol.vivienda} {sol.tieneMallas ? '(Con Mallas ✅)' : '(Sin Mallas ⚠️)'}</p>
                    <p><FaCat className="inline mr-2 opacity-50"/> Otras Mascotas: {sol.otrasMascotas ? 'Sí' : 'No'}</p>
                    <p><FaUserTie className="inline mr-2 opacity-50"/> Tiene niños: {sol.tieneNiños ? 'Sí' : 'No'}</p>
                    {sol.tieneNiños && <p><FaUsers className="inline mr-2 opacity-50"/> Cantidad: {sol.cantidadNiños}</p>}
                    <p><FaClock className="inline mr-2 opacity-50"/> Fecha: {new Date(sol.fecha).toLocaleDateString()}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl text-sm italic text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                    "{sol.motivo}"
                  </div>
                </div>

                {/* 2. Datos del Gato y Acciones */}
                <div className="lg:w-1/3 flex flex-col justify-between items-end">
                  <div className="flex items-center gap-3 mb-4 w-full justify-end">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Interesado en:</p>
                      {/* Validamos si el gato existe (populate) */}
                      {typeof sol.gatoId === 'object' ? (
                        <p className="font-bold text-katze-gold text-lg">{sol.gatoId.nombre}</p>
                      ) : (
                        <p className="text-red-400 text-sm">Gato no disponible</p>
                      )}
                    </div>
                    {typeof sol.gatoId === 'object' && sol.gatoId.fotos && (
                       <img src={sol.gatoId.fotos[0]} className="w-16 h-16 rounded-full object-cover border-2 border-katze-gold shadow-sm" alt="Gato" />
                    )}
                  </div>

                  {sol.estado === 'pendiente' && (
                    <div className="flex gap-2 w-full mt-auto">
                      <button 
                        onClick={() => handleSolicitudState(sol._id, 'aprobada')}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-700 transition shadow-md"
                      >
                        Aprobar
                      </button>
                      <button 
                        onClick={() => handleSolicitudState(sol._id, 'rechazada')}
                        className="flex-1 bg-gray-200 text-gray-600 py-2 px-4 rounded-lg font-bold hover:bg-gray-300 transition"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                  
                  {sol.estado === 'aprobada' && (
                    <a 
                      href={`https://wa.me/${sol.telefono}?text=Hola ${sol.nombreSolicitante}, aprobamos tu solicitud de adopción para ${typeof sol.gatoId === 'object' ? sol.gatoId.nombre : 'el gato'}.`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full text-center bg-green-100 text-green-700 py-3 rounded-xl font-bold hover:bg-green-200 transition border border-green-200 mt-auto flex items-center justify-center gap-2"
                    >
                      <FaPhone /> Contactar por WhatsApp
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

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
                          <option value="adoptado">Adoptado</option>
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