import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGato } from '../../services/gato.Service';
import { FaCat, FaCamera, FaArrowLeft } from 'react-icons/fa';

const CreateGatoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    edad: '',
    caracter: '',
    estadoSalud: '',
    estado: 'enAdopcion', // Valor por defecto
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!foto) return alert('La foto es obligatoria');

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key as keyof typeof formData]);
      });
      data.append('foto', foto); // 'foto' debe coincidir con el backend (req.files.foto)

      await createGato(data);
      alert('¡Gato creado exitosamente!');
      navigate('/admin/dashboard'); // Volver al dashboard
    } catch (error) {
      console.error(error);
      alert('Error al crear el gato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark transition-colors p-6">
      <div className="container mx-auto max-w-2xl">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-katze-gold">
          <FaArrowLeft /> Volver al panel de control
        </button>

        <div className="bg-white dark:bg-katze-dark-card rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-katze-gold mb-6 flex items-center gap-2">
            <FaCat /> Registrar Nuevo Gato
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FOTO */}
            <div className="flex justify-center">
                <label className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-katze-gold overflow-hidden bg-gray-50 dark:bg-black/20">
                  {preview ? <img src={preview} className="w-full h-full object-cover" /> : (
                    <>
                      <FaCamera className="text-3xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Subir Foto Principal</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>

            {/* CAMPOS */}
            <div className="grid grid-cols-2 gap-4">
              <input name="nombre" placeholder="Nombre del Gato" onChange={handleChange} required className="input-field p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 w-full dark:text-white" />
              <input name="edad" placeholder="Edad (Ej: 2 meses)" onChange={handleChange} required className="input-field p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 w-full dark:text-white" />
            </div>

            <input name="caracter" placeholder="Carácter (Ej: Juguetón, Tímido)" onChange={handleChange} required className="input-field p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 w-full dark:text-white" />
            <input name="estadoSalud" placeholder="Estado de Salud (Ej: Vacunado)" onChange={handleChange} required className="input-field p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 w-full dark:text-white" />

            <textarea name="descripcion" placeholder="Historia del gato..." rows={3} onChange={handleChange} required className="input-field p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 w-full dark:text-white resize-none" />

            <select name="estado" onChange={handleChange} className="input-field p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 w-full dark:text-white">
              <option value="enAdopcion">En Adopción</option>
              <option value="adoptado">Adoptado</option>
              <option value="hogarTemporal">Hogar Temporal</option>
            </select>

            <button type="submit" disabled={loading} className="w-full bg-katze-gold hover:bg-yellow-600 text-white font-bold py-3 rounded-xl shadow-lg transition disabled:opacity-50">
              {loading ? 'Guardando...' : 'Publicar Gato'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGatoPage;