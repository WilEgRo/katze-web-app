import { useState } from 'react';
import { FaTimes, FaPaw, FaPaperPlane } from 'react-icons/fa';
import { createSolicitud } from '../services/solicitud.Service';

interface Props {
  gatoId: string;
  gatoNombre: string;
  onClose: () => void;
}

const SolicitudPopup = ({ gatoId, gatoNombre, onClose }: Props) => {
  const [formData, setFormData] = useState({
    nombreSolicitante: '',
    telefono: '',
    email: '',
    motivo: '',
    vivienda: 'casa',
    tieneMallas: false,
    tienePatio: false,
    tieneNiños: false,
    cantidadNiños: 0,
    otrasMascotas: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSolicitud({ ...formData, gatoId });
      setSuccess(true);
    } catch (error) {
      alert("Error al enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-katze-dark-card rounded-2xl p-8 text-center max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">¡Solicitud Enviada!</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-6">
            Gracias por querer adoptar a <strong>{gatoNombre}</strong>. Revisaremos tu formulario y te contactaremos pronto.
          </p>
          <button onClick={onClose} className="bg-katze-gold text-white px-6 py-3 rounded-full font-bold w-full hover:bg-yellow-600 transition">
            Entendido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-katze-dark-card rounded-2xl w-full max-w-lg shadow-2xl relative my-10">
        
        {/* Header */}
        <div className="bg-katze-gold p-5 rounded-t-2xl flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 font-serif">
            <FaPaw /> Adoptar a {gatoNombre}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition"><FaTimes /></button>
        </div>

        {/* Formulario Scrollable */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tu Nombre Completo</label>
              <input name="nombreSolicitante" required onChange={handleChange} className="input-field w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-black/20 dark:text-white" placeholder="Ej: Juan Pérez" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                <input name="telefono" required onChange={handleChange} className="input-field w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-black/20 dark:text-white" placeholder="7700..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input name="email" type="email" required onChange={handleChange} className="input-field w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-black/20 dark:text-white" placeholder="@gmail.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">¿Por qué quieres adoptar?</label>
              <textarea name="motivo" required rows={3} onChange={handleChange} className="input-field w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-black/20 dark:text-white resize-none" placeholder="Cuéntanos un poco..." />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tipo de Vivienda</label>
                <select name="vivienda" onChange={handleChange} className="input-field w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-black/20 dark:text-white">
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 text-sm">
                  <input type="checkbox" name="tieneNiños" onChange={handleChange} className="w-4 h-4 accent-katze-gold" />
                  ¿Viven niños en casa?
                </label>
                {formData.tieneNiños && (
                  <div className="mt-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Cantidad de Niños</label>
                    <input type="number" name="cantidadNiños" min={0} onChange={handleChange} className="input-field w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-black/20 dark:text-white" placeholder="Ej: 2" />
                  </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div className="flex flex-col justify-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 text-sm">
                  <input type="checkbox" name="tieneMallas" onChange={handleChange} className="w-4 h-4 accent-katze-gold" />
                  ¿Tienes mallas de seguridad?
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 text-sm">
                  <input type="checkbox" name="otrasMascotas" onChange={handleChange} className="w-4 h-4 accent-katze-gold" />
                  ¿Tienes otras mascotas?
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 text-sm">
                  <input type="checkbox" name="tienePatio" onChange={handleChange} className="w-4 h-4 accent-katze-gold" />
                  ¿Tienes patio?
                </label>     
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition flex justify-center items-center gap-2">
                {loading ? 'Enviando...' : <><FaPaperPlane /> Enviar Solicitud</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitudPopup;