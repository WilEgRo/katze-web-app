import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllReportesAdmin, updateReporteEstado, type Reporte } from '../../services/reporte.Service';
import { getAllGatosAdmin, updateGato, type Gato } from '../../services/gato.Service';
import { logout, getAllUsers, updateUserRole, type User } from '../../services/auth.Service';
import { getSolicitudesAdmin, updateSolicitudEstado, type Solicitud } from '../../services/solicitud.Service';
import {
  FaCheck, FaTimes, FaClipboardList, FaSearch, FaUserShield,
  FaSignOutAlt, FaClock, FaHistory, FaCogs, FaCat, FaPlus, FaBullhorn,
  FaEnvelopeOpenText, FaUser, FaHome, FaPhone, FaUserTie, FaUsers, FaPaw
} from 'react-icons/fa';
import { toast } from 'react-toastify';


const DashboardPage = () => {
  // Estados
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [gatos, setGatos] = useState<Gato[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pestaña activa: 'reportes', 'gatos', 'solicitudes', 'users'
  const [activeTab, setActiveTab] = useState<'reportes' | 'gatos' | 'solicitudes' | 'users'>('reportes');
  const [filterReportes, setFilterReportes] = useState<'pendiente' | 'todos'>('pendiente');
  const [filterGatos, setFilterGatos] = useState<'solicitudes' | 'inventario'>('solicitudes');

  // Buscador de solicitudes
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos
  const fetchData = async () => {
    console.log("Cargando datos admin...", loading);
    setLoading(true);
    // Reportes
    try { const res = await getAllReportesAdmin(); setReportes(res); } catch (e) { console.error(e); }
    // Gatos (Inventario + Pendientes)
    try {
      const res = await getAllGatosAdmin();
      setGatos(res);
    } catch (e) { console.error(e); }
    // Solicitudes Adopción
    try { const res = await getSolicitudesAdmin(); setSolicitudes(res); } catch (e) { console.error(e); }
    // Usuarios
    try { const res = await getAllUsers(); setUsers(res); } catch (e) { console.error(e); }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- BUSCADOR INTELIGENTE ---
  const handleSearchSolicitudes = async (term: string) => {
    setSearchTerm(term);
    // Debounce manual simple o búsqueda directa
    try {
      const results = await getSolicitudesAdmin(term);
      setSolicitudes(results);
    } catch (error) {
      console.error("Error buscando solicitudes", error);
    }
  };

  // --- LÓGICA USUARIOS (ROLES) ---
  const handleChangeRole = async (id: string, newRole: string) => {
    if (!window.confirm(`¿Seguro que deseas cambiar el rol a ${newRole}?`)) return;
    try {
      await updateUserRole(id, newRole);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole as any } : u));
      toast.success("Rol actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar rol");
    }
  };

  // --- LÓGICA REPORTES ---
  const handleModerateReporte = async (id: string, nuevoEstado: 'aprobado' | 'rechazado') => {
    try {
      await updateReporteEstado(id, nuevoEstado);
      setReportes(prev => prev.map(r => r._id === id ? { ...r, estado: nuevoEstado } : r));
      toast.success(`Reporte ${nuevoEstado}`);
    } catch (e) { toast.error("Error al moderar reporte"); }
  };

  // --- LÓGICA GATOS ---
  const handleChangeGatoStatus = async (id: string, nuevoEstado: string) => {
    try {
      await updateGato(id, { estado: nuevoEstado } as any);
      setGatos(prev => prev.map(g => g._id === id ? { ...g, estado: nuevoEstado as Gato['estado'] } : g));
      toast.success(`Estado actualizado a: ${nuevoEstado}`);
    } catch (e) { toast.error("Error al actualizar estado"); }
  };

  const handleSolicitudState = async (id: string, nuevoEstado: 'aprobada' | 'rechazada') => {
    try {
      await updateSolicitudEstado(id, nuevoEstado);
      setSolicitudes(prev => prev.map(s => s._id === id ? { ...s, estado: nuevoEstado } : s));
      toast.success(`Solicitud ${nuevoEstado}`);
    } catch (e) {
      toast.error("Error al actualizar estado de la solicitud");
      console.log(setError);
    }
  };

  // Aprobar solicitud de usuario (Pendiente -> En Adopción)
  const handleAprobarGato = async (id: string) => {
    try {
      await updateGato(id, { estado: 'enAdopcion' } as any);
      setGatos(prev => prev.map(g => g._id === id ? { ...g, estado: 'enAdopcion' } : g));
      toast.success("Gato aprobado y publicado en la web 🚀");
    } catch (error) {
      toast.error("Error al aprobar el gato");
    }
  }

  // Rechazar solicitud
  const handleRechazarGato = async (id: string) => {
    if (!confirm("¿Rechazar esta publicación?")) return;
    try {
      await updateGato(id, { estado: 'rechazado' } as any);
      setGatos(prev => prev.map(g => g._id === id ? { ...g, estado: 'rechazado' } : g));
      toast.success("Publicación rechazada");
    } catch (error) {
      toast.error("Error al rechazar");
    }
  }


  // Filtrado visual de reportes
  const filteredReportes = filterReportes === 'pendiente' ? reportes.filter(r => r.estado === 'pendiente') : reportes;
  const sortedSolicitudes = [...solicitudes].sort((a, b) => {
    if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1;
    if (a.estado !== 'pendiente' && b.estado === 'pendiente') return 1;
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  // Filtros Gatos
  const gatosPendientes = gatos.filter(g => g.estado === 'pendiente');
  const gatosInventario = gatos.filter(g => g.estado !== 'pendiente' && g.estado !== 'rechazado');

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
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${activeTab === 'users' ? 'bg-katze-gold text-white shadow' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <FaUserShield /> Usuarios y Roles
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

        {/* ================= CONTENIDO: SOLICITUDES ================= */}
        {activeTab === 'solicitudes' && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            {/* BUSCADOR */}
            <div className="bg-white dark:bg-katze-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar solicitudes por nombre del gato (Ej: Kitty)..."
                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200"
                value={searchTerm}
                onChange={(e) => handleSearchSolicitudes(e.target.value)}
              />
            </div>
            {sortedSolicitudes.length === 0 && <p className="text-center text-gray-400 py-10">No hay solicitudes pendientes.</p>}

            {sortedSolicitudes.map((sol) => (
              <div key={sol._id} className="bg-white dark:bg-katze-dark-card rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row gap-6 hover:shadow-lg transition">

                {/* Datos del Interesado */}
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
                    <p><FaPhone className="inline mr-2 opacity-50" /> {sol.telefono}</p>
                    <p className="truncate" title={sol.email}><FaEnvelopeOpenText className="inline mr-2 opacity-50" /> {sol.email}</p>
                    <p><FaHome className="inline mr-2 opacity-50" /> {sol.vivienda} {sol.tieneMallas ? '(Con Mallas ✅)' : '(Sin Mallas ⚠️)'}</p>
                    <p><FaCat className="inline mr-2 opacity-50" /> Otras Mascotas: {sol.otrasMascotas ? 'Sí' : 'No'}</p>
                    <p><FaUserTie className="inline mr-2 opacity-50" /> Tiene niños: {sol.tieneNiños ? 'Sí' : 'No'}</p>
                    {sol.tieneNiños && <p><FaUsers className="inline mr-2 opacity-50" /> Cantidad: {sol.cantidadNiños}</p>}
                    <p><FaClock className="inline mr-2 opacity-50" /> Fecha: {new Date(sol.fecha).toLocaleDateString()}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl text-sm italic text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                    "{sol.motivo}"
                  </div>
                </div>

                {/* Datos del Gato y Acciones */}
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
                    <div className="w-full mt-auto flex flex-col gap-2">
                        {/* Botón Principal: Contactar */}
                        <a 
                            href={`https://wa.me/${sol.telefono}?text=Hola ${sol.nombreSolicitante}, revisamos tu solicitud para ${typeof sol.gatoId === 'object' ? sol.gatoId.nombre : 'el gato'} y queremos coordinar una entrevista.`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full text-center bg-green-100 text-green-700 py-3 rounded-xl font-bold hover:bg-green-200 transition border border-green-200 flex items-center justify-center gap-2"
                        >
                            <FaPhone /> Contactar por WhatsApp
                        </a>

                        {/* Botón de Rechazo (Filtro Humano Fallido) */}
                        <button 
                            onClick={() => {
                                if(window.confirm(`¿La entrevista no fue exitosa? \n\nAl aceptar, la solicitud de ${sol.nombreSolicitante} pasará a RECHAZADA.`)) {
                                    handleSolicitudState(sol._id, 'rechazada');
                                }
                            }}
                            className="w-full text-center text-xs text-red-400 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition flex items-center justify-center gap-1 font-medium"
                        >
                            <FaTimes /> No pasó la entrevista (Rechazar)
                        </button>
                    </div>
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
                <FaClock className="inline mr-1" /> Pendientes
              </button>
              <button onClick={() => setFilterReportes('todos')} className={`pb-2 text-sm font-bold border-b-2 transition ${filterReportes === 'todos' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <FaHistory className="inline mr-1" /> Historial
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

        {/* ================= CONTENIDO: GESTIÓN DE GATOS ================= */}
        {activeTab === 'gatos' && (
          <div>
            {/* SUB-NAVEGACIÓN GATOS */}
            <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setFilterGatos('solicitudes')}
                className={`pb-2 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${filterGatos === 'solicitudes' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <FaClipboardList /> Solicitudes Pendientes ({gatosPendientes.length})
              </button>
              <button
                onClick={() => setFilterGatos('inventario')}
                className={`pb-2 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${filterGatos === 'inventario' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <FaPaw /> Inventario Activo
              </button>
            </div>

            {/* --- TABLA 1: SOLICITUDES DE USUARIOS (PENDIENTES) --- */}
            {filterGatos === 'solicitudes' && (
              <div className="grid grid-cols-1 gap-4 animate-fade-in">
                {gatosPendientes.length === 0 && <p className="text-gray-400 text-center py-8">No hay gatos pendientes de aprobación.</p>}

                {gatosPendientes.map(gato => (
                  <div key={gato._id} className="bg-white dark:bg-katze-dark-card p-4 rounded-xl shadow border border-orange-200 dark:border-orange-900/30 flex flex-col md:flex-row gap-4 items-center">
                    <img src={gato.fotos[0]} className="w-24 h-24 rounded-lg object-cover" />
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-lg dark:text-white">{gato.nombre}</h3>
                      <p className="text-sm text-gray-500 mb-1">{gato.descripcion}</p>
                      <div className="text-xs text-gray-400 flex gap-3 justify-center md:justify-start">
                        <span>Edad: {gato.edad}</span>
                        <span>Salud: {gato.estadoSalud}</span>
                        <span>Ubicación: {gato.ubicacion || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAprobarGato(gato._id)} className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                        <FaCheck /> Aprobar Publicación
                      </button>
                      <button onClick={() => handleRechazarGato(gato._id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                        <FaTimes /> Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- TABLA 2: INVENTARIO (GESTIÓN DE ESTADO) --- */}
            {filterGatos === 'inventario' && (
              <div className="bg-white dark:bg-katze-dark-card rounded-xl shadow overflow-hidden animate-fade-in">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-black/20 text-xs text-gray-400 uppercase">
                    <tr>
                      <th className="p-4">Foto</th>
                      <th className="p-4">Info</th>
                      <th className="p-4">Estado Actual</th>
                      <th className="p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {gatosInventario.map(gato => (
                      <tr key={gato._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="p-3"><img src={gato.fotos[0]} className="w-12 h-12 rounded-full object-cover border border-gray-200" /></td>
                        <td className="p-3">
                          <p className="font-bold dark:text-white">{gato.nombre}</p>
                          <p className="text-xs text-gray-400">{gato.edad}</p>
                        </td>
                        <td className="p-3">
                          <select
                            value={gato.estado}
                            onChange={(e) => handleChangeGatoStatus(gato._id, e.target.value)}
                            className={`bg-transparent border rounded-lg text-xs p-1.5 font-bold outline-none cursor-pointer
                                                    ${gato.estado === 'enAdopcion' ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}
                                                    ${gato.estado === 'adoptado' ? 'text-green-600 border-green-200 bg-green-50' : ''}
                                                    ${gato.estado === 'hogarTemporal' ? 'text-purple-600 border-purple-200 bg-purple-50' : ''}
                                                `}
                          >
                            <option value="enAdopcion">En Adopción (Público)</option>
                            <option value="adoptado">Adoptado (Historia)</option>
                            <option value="hogarTemporal">Hogar Temporal</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <Link to={`/adopta/${gato._id}`} target="_blank" className="text-xs text-katze-gold hover:underline">Ver Ficha</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {gatosInventario.length === 0 && <p className="text-center p-8 text-gray-400">No hay gatos activos.</p>}
              </div>
            )}
          </div>
        )}

        {/* === TAB: USUARIOS (NUEVO) === */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-katze-dark-card rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-black/20 text-xs text-gray-400 uppercase">
                <tr>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rol Actual</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="p-4 font-bold dark:text-white">{u.username}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'MODERADOR' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u._id, e.target.value)}
                        className="bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 text-sm rounded px-2 py-1 outline-none focus:border-katze-gold"
                      >
                        <option value="USER">User</option>
                        <option value="MODERADOR">Moderador</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;