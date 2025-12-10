import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth.Service';
import { FaLock, FaEnvelope, FaUserPlus, FaUser } from 'react-icons/fa';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // Estados
  const [formData, setFormData] = useState({ 
    username: '',
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Validar longitud
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Llamar al servicio
      await register(formData.username, formData.email, formData.password);
      
      // Éxito: Redirigir al Perfil (Los nuevos usuarios van a perfil, no a dashboard)
      navigate('/perfil');
    } catch (err: any) {
      // Si el usuario ya existe o hay error
      setError(err.response?.data?.message || 'Error al registrarse. Intenta con otro correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-katze-dark transition-colors px-4 py-20">
      
      <div className="w-full max-w-md bg-white dark:bg-katze-dark-card rounded-[30px] shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-green-100 text-green-600 mb-4">
            <FaUserPlus className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-serif">
            Únete a Katze
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Crea una cuenta para guardar favoritos y reportar mascotas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <FaUser className="absolute left-4 top-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Nombre de Usuario (Ej: GatoLover99)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white transition-colors"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              minLength={3}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
            <input 
              type="email" 
              placeholder="Correo electrónico"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-3.5 text-gray-400" />
            <input 
              type="password" 
              placeholder="Contraseña"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-3.5 text-gray-400" />
            <input 
              type="password" 
              placeholder="Confirmar Contraseña"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-katze-gold dark:text-white transition-colors"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-katze-gold hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          {/* LINK PARA VOLVER AL LOGIN */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-katze-gold font-bold hover:underline">
                Inicia Sesión aquí
              </Link>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RegisterPage;