import { useState, type ChangeEvent, type FormEvent } from 'react';
import { createReporte } from '../services/reporte.Service';
import { FaCamera, FaMapMarkerAlt, FaPhone, FaCat, FaCalendarAlt } from 'react-icons/fa';
import { validarImagenGato } from '../services/juez.Service';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../services/auth.Service';
import { Link } from 'react-router-dom';

const ReportarPage = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombreGato: '',
    descripcion: '',
    zona: '',
    contacto: '',
    fecha: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Estados de interfaz (carga, éxito, error)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Manejar cambios en inputs de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar selección de archivo (foto)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setPreview(URL.createObjectURL(file)); // Crear preview local
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!foto) {
      setError('Por favor, sube una foto del gato.');
      setLoading(false);
      return;
    }

    // variable para guardar el ID de la notificación de carga
    let toastId;

    try {
      // validacion con MCP local
      toastId = toast.loading('Validando reporte con el MCP local...');

      await validarImagenGato(foto);

      toast.dismiss(toastId);
      toast.success('Reporte validado por el MCP local.');

      // guardar el reporte normalmente
      // Crear objeto FormData para enviar archivo + datos
      const data = new FormData();
      data.append('nombreGato', formData.nombreGato);
      data.append('descripcion', formData.descripcion);
      data.append('zona', formData.zona);
      data.append('contacto', formData.contacto);
      data.append('fecha', formData.fecha);
      data.append('foto', foto);

      await createReporte(data); // ¡Llamada al Backend!
      
      setSuccess(true);
      // Limpiar formulario
      setFormData({ nombreGato: '', descripcion: '', zona: '', contacto: '', fecha: '' });
      setFoto(null);
      setPreview(null);

    } catch (err: any) {
        // quitamos el toast de carga
        if (toastId) toast.dismiss(toastId);

        // Mostrar el error que viene del backend si existe
        console.error("Error detallado: ", err);
        
        let mensajeError = 'Error al validar el reporte.';
        // si el error es de axios y tiene respuesta del servidor
        if (err.response) {
          // si es 400 sabemos que es un error del usuario
          if (err.response.status === 400 && err.response.data.mensaje) {
            mensajeError = err.response.data.mensaje;
            toast.error("Imagen rechazada por la IA: " + mensajeError);
          }else{
            mensajeError = 'Error del servidor: ' + (err.response.data.mensaje || 'Inténtalo de nuevo más tarde.');
            toast.error(mensajeError);
          }
        } else {
          mensajeError = 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.';
        }

        setError(mensajeError);

    } finally {
      setLoading(false);
    }
  };

    // Si no está logueado, mostramos pantalla de bloqueo
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-katze-dark flex items-start justify-center p-6 pt-24">
        <div className="text-center max-w-md bg-white dark:bg-katze-dark-card p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-katze-gold font-serif mb-4">Acceso Restringido</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Para evitar el spam y mantener la comunidad segura, necesitas una cuenta para reportar un gato perdido.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="bg-katze-gold text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-600 transition">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="border-2 border-katze-gold text-katze-gold px-6 py-3 rounded-xl font-bold hover:bg-katze-gold hover:text-white transition">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark transition-colors py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-katze-gold mb-3 font-serif">
            Reportar Gato Perdido
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ayúdanos a reunir a las mascotas con sus familias. Tu reporte será revisado por nuestro equipo antes de publicarse.
          </p>
        </div>

        {/* TARJETA DEL FORMULARIO */}
        <div className="bg-white dark:bg-katze-dark-card rounded-[30px] shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-800">
          
          {success ? (
            // MENSAJE DE ÉXITO
            <div className="text-center py-10 animate-fade-in">
              <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">¡Reporte Enviado!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Gracias por tu ayuda. Un administrador revisará la información y la publicará pronto.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-katze-gold font-bold hover:underline"
              >
                Enviar otro reporte
              </button>
            </div>
          ) : (
            // FORMULARIO
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-100 text-red-600 p-4 rounded-lg text-center text-sm">
                  {error}
                </div>
              )}

              {/* Subida de Foto (Área Grande) */}
              <div className="flex justify-center mb-6">
                 <label className="relative w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-katze-gold transition bg-gray-50 dark:bg-black/20 overflow-hidden group">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <FaCamera className="mx-auto text-4xl text-gray-400 mb-2 group-hover:text-katze-gold transition" />
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Haz clic para subir una foto</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                 </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nombre Gato */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nombre del Gato (Opcional)</label>
                  <div className="relative">
                    <FaCat className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      name="nombreGato"
                      value={formData.nombreGato} 
                      onChange={handleChange}
                      placeholder="Ej: Misifu"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white"
                    />
                  </div>
                </div>

                {/* Fecha */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Fecha de Avistamiento</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                      type="date" 
                      name="fecha"
                      value={formData.fecha} 
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Zona */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Zona / Ubicación *</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    name="zona"
                    required
                    value={formData.zona} 
                    onChange={handleChange}
                    placeholder="Ej: Parque Urbano, cerca de la fuente"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white"
                  />
                </div>
              </div>

              {/* Contacto */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tu Contacto (WhatsApp/Celular) *</label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    name="contacto"
                    required
                    value={formData.contacto} 
                    onChange={handleChange}
                    placeholder="Ej: 77001234"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Descripción *</label>
                <textarea 
                  name="descripcion"
                  required
                  value={formData.descripcion} 
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe al gato: color, tamaño, si tenía collar, estado de salud aparente..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white resize-none"
                ></textarea>
              </div>

              {/* Botón Enviar */}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-katze-gold hover:bg-yellow-600'}`}
              >
                {loading ? 'Enviando...' : 'Enviar Reporte'}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportarPage;