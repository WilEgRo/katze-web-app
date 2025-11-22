import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { FaCat, FaLock, FaEnvelope } from 'react-icons/fa';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Si funciona, redirigir al Dashboard
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-katze-dark transition-colors px-4">
      
      <div className="w-full max-w-md bg-white dark:bg-katze-dark-card rounded-[30px] shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-katze-gold/10 mb-4">
            <FaCat className="text-4xl text-katze-gold" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-serif">
            Acceso Administrativo
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Ingresa tus credenciales para gestionar KATZE.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-katze-gold hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default AdminLoginPage;