import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaCat, FaBullhorn, FaCheckCircle, FaCamera, FaTimesCircle, FaCheck } from 'react-icons/fa';
import { getMisReportes, marcarComoEncontrado, type Reporte } from '../services/reporte.Service';
import { getMisGatos, createGatoUser, type Gato } from '../services/gato.Service';
import { toast } from 'react-hot-toast';

const PerfilPage = () => {
  const navigate = useNavigate();
  // Leemos usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Estados de Datos
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [misGatos, setMisGatos] = useState<Gato[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Estados de Interfaz
  const [activeTab, setActiveTab] = useState<'reportes' | 'gatos'>('reportes');
  const [showAdopcionForm, setShowAdopcionForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // <--- NUEVO ESTADO PARA EL POPUP

  // Formulario Nuevo Gato
  const [gatoForm, setGatoForm] = useState({
    nombre: '', descripcion: '', edad: '', caracter: '', estadoSalud: '', ubicacion: ''
  });
  const [gatoFoto, setGatoFoto] = useState<File | null>(null);
  const [gatoPreview, setGatoPreview] = useState<string | null>(null);
  const [loadingGato, setLoadingGato] = useState(false);

  // Cargar datos al inicio
  useEffect(() => {
    const fetchPerfilData = async () => {
      setLoadingData(true);
      try {
        const [misReportesData, misGatosData] = await Promise.all([
            getMisReportes(),
            getMisGatos()
        ]);
        setReportes(misReportesData);
        setMisGatos(misGatosData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchPerfilData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleMarcarEncontrado = async (id: string) => {
      if(!window.confirm("¿Confirmas que encontraste a este gato? ¡Qué alegría!")) return;
      try {
          await marcarComoEncontrado(id);
          setReportes(prev => prev.map(r => r._id === id ? {...r, estado: 'encontrado'} : r));
          toast.success("¡Felicidades! Gato marcado como encontrado.");
      } catch (error) {
          toast.error("Error al actualizar el estado");
      }
  }

  // --- SUBIDA DE GATO ---
  const handleGatoSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if(!gatoFoto) return toast.error("La foto es obligatoria");

      setLoadingGato(true);
      const toastId = toast.loading("Subiendo y analizando con IA...");

      try {
          const formData = new FormData();
          Object.entries(gatoForm).forEach(([key, value]) => formData.append(key, value));
          formData.append('foto', gatoFoto);

          await createGatoUser(formData);
          
          toast.dismiss(toastId); 
          
          // AQUÍ ACTIVAMOS EL POPUP DE ÉXITO EN LUGAR DE SOLO EL TOAST
          setShowSuccessModal(true); 
          
          setShowAdopcionForm(false);
          
          // Recargar lista
          const updatedGatos = await getMisGatos();
          setMisGatos(updatedGatos);

          // Limpiar form
          setGatoForm({ nombre: '', descripcion: '', edad: '', caracter: '', estadoSalud: '', ubicacion: '' });
          setGatoFoto(null);
          setGatoPreview(null);

      } catch (error: any) {
          toast.dismiss(toastId);
          console.error("Error al subir:", error);
          const mensaje = error.response?.data?.message || "Ocurrió un error al subir el gato.";
          toast.error(mensaje, { duration: 5000, icon: '🤖' });
      } finally {
          setLoadingGato(false);
      }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGatoFoto(file);
      setGatoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark transition-colors pt-24 pb-20 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        
        {/* HEADER */}
        <div className="bg-white dark:bg-katze-dark-card rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="w-24 h-24 bg-katze-gold/20 text-katze-gold rounded-full flex items-center justify-center text-5xl flex-shrink-0">
            <FaUserCircle />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-serif mb-1">
              Hola, {user.username || "Amante de los Gatos"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                 <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Usuario</span>
                 {user.role === 'ADMIN' && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Admin</span>}
            </div>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 transition flex items-center gap-2">
            <FaSignOutAlt /> Salir
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setActiveTab('reportes')} 
                className={`pb-3 px-2 font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'reportes' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <FaBullhorn /> Mis Reportes ({reportes.length})
            </button>
            <button 
                onClick={() => setActiveTab('gatos')} 
                className={`pb-3 px-2 font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'gatos' ? 'border-katze-gold text-katze-gold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <FaCat /> Mis Gatos en Adopción ({misGatos.length})
            </button>
        </div>

        {/* CONTENIDO REPORTES */}
        {activeTab === 'reportes' && (
            <div className="animate-fade-in space-y-4">
                {reportes.length === 0 && !loadingData && (
                    <div className="text-center py-10 bg-white dark:bg-katze-dark-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-400">No tienes reportes activos.</p>
                    </div>
                )}
                {reportes.map(reporte => (
                    <div key={reporte._id} className="bg-white dark:bg-katze-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center">
                        <img src={reporte.foto} className="w-24 h-24 rounded-xl object-cover" />
                        <div className="flex-1 w-full text-center md:text-left">
                            <h3 className="font-bold text-lg dark:text-white">{reporte.zona}</h3>
                            <p className="text-sm text-gray-500 mb-2">{new Date(reporte.fecha).toLocaleDateString()}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-lg font-bold uppercase ${
                                reporte.estado === 'encontrado' ? 'bg-green-100 text-green-700' :
                                reporte.estado === 'aprobado' ? 'bg-blue-100 text-blue-700' : 
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                {reporte.estado}
                            </span>
                        </div>
                        {reporte.estado === 'aprobado' && (
                            <button onClick={() => handleMarcarEncontrado(reporte._id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition text-sm">
                                <FaCheckCircle /> ¡Lo Encontré!
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )}

        {/* CONTENIDO GATOS */}
        {activeTab === 'gatos' && (
            <div className="animate-fade-in">
                <div className="mb-6 flex justify-end">
                    <button onClick={() => setShowAdopcionForm(!showAdopcionForm)} className="bg-katze-gold text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-yellow-600 transition flex items-center gap-2">
                        {showAdopcionForm ? <><FaTimesCircle /> Cancelar</> : <><FaCat /> Dar en Adopción</>}
                    </button>
                </div>

                {showAdopcionForm && (
                    <div className="bg-white dark:bg-katze-dark-card p-6 rounded-3xl shadow-xl border-2 border-katze-gold/20 mb-8">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Datos del Gato</h3>
                        <form onSubmit={handleGatoSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 flex justify-center mb-4">
                                <label className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-katze-gold overflow-hidden bg-gray-50 dark:bg-black/20">
                                    {gatoPreview ? <img src={gatoPreview} className="w-full h-full object-cover"/> : <div className="text-center text-gray-400"><FaCamera className="mx-auto text-2xl mb-1"/>Subir Foto</div>}
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                            <input required placeholder="Nombre del gato" value={gatoForm.nombre} onChange={e => setGatoForm({...gatoForm, nombre: e.target.value})} className="p-3 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white" />
                            <input required placeholder="Edad (ej: 2 meses)" value={gatoForm.edad} onChange={e => setGatoForm({...gatoForm, edad: e.target.value})} className="p-3 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white" />
                            <input required placeholder="Carácter (ej: Juguetón)" value={gatoForm.caracter} onChange={e => setGatoForm({...gatoForm, caracter: e.target.value})} className="p-3 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white" />
                            <input required placeholder="Estado Salud (ej: Sano)" value={gatoForm.estadoSalud} onChange={e => setGatoForm({...gatoForm, estadoSalud: e.target.value})} className="p-3 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white" />
                            <input required placeholder="Ubicación (Zona/Barrio)" value={gatoForm.ubicacion} onChange={e => setGatoForm({...gatoForm, ubicacion: e.target.value})} className="md:col-span-2 p-3 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white" />
                            <textarea required placeholder="Historia / Descripción..." rows={3} value={gatoForm.descripcion} onChange={e => setGatoForm({...gatoForm, descripcion: e.target.value})} className="md:col-span-2 p-3 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white" />
                            
                            <button disabled={loadingGato} className="md:col-span-2 bg-katze-gold text-white font-bold py-3 rounded-xl hover:bg-yellow-600 transition shadow-lg disabled:bg-gray-400">
                                {loadingGato ? 'Analizando con IA...' : 'Enviar Solicitud'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {misGatos.map(gato => (
                        <div key={gato._id} className="bg-white dark:bg-katze-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 items-center">
                            <img src={gato.fotos[0]} className="w-20 h-20 rounded-xl object-cover" />
                            <div>
                                <h3 className="font-bold dark:text-white">{gato.nombre}</h3>
                                <span className={`inline-block px-2 py-0.5 text-[10px] rounded uppercase font-bold mt-1 ${
                                    gato.estado === 'pendiente' ? 'bg-orange-100 text-orange-700' : 
                                    gato.estado === 'enAdopcion' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {gato.estado === 'enAdopcion' ? 'Publicado' : gato.estado}
                                </span>
                            </div>
                        </div>
                    ))}
                    {misGatos.length === 0 && !loadingData && (
                        <p className="col-span-full text-center text-gray-400 py-10 bg-white dark:bg-katze-dark-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">No has puesto gatos en adopción.</p>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* POPUP DE ÉXITO (MODAL)*/}
      {/* ========================================================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-katze-dark-card w-full max-w-sm rounded-[30px] p-8 text-center shadow-2xl relative animate-scale-up border-4 border-white dark:border-gray-700">
                
                {/* ICONO ANIMADO */}
                <div className="mx-auto w-24 h-24 flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-green-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg">
                        <FaCheck className="animate-bounce-subtle" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-serif">
                    ¡Solicitud Enviada!
                </h2>
                
                <p className="text-gray-500 dark:text-gray-300 mb-8 leading-relaxed">
                    Muchas gracias. Tu mascota ahora está 
                    <span className="font-bold text-katze-gold mx-1">pendiente de aprobación</span>. 
                    Te avisaremos cuando sea publicada.
                </p>

                <button 
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-katze-gold text-white font-bold py-3 rounded-xl hover:bg-yellow-600 transition shadow-lg transform hover:scale-105"
                >
                    Entendido, ¡Gracias!
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default PerfilPage;