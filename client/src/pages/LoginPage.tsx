import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      const userData = await login(formData.email, formData.password);

      // verificar ROL para decidir el destino
      if (userData.role === 'ADMIN' || userData.role === 'MODERADOR') {
        navigate('/admin/dashboard');  
      } else {
        navigate('/perfil');
      }
      
    } catch (err: any) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start pt-24 justify-center bg-gray-50 dark:bg-katze-dark transition-colors px-4">
      <div className="w-full max-w-md bg-white dark:bg-katze-dark-card rounded-[30px] shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-katze-gold ">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-katze-gold/10 mb-4">
            <FaCat className="text-4xl text-katze-gold" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-serif">
            Iniciar sesión
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Ingresa tus credenciales.
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
          
          {/* 👇 NUEVO: SECCIÓN DE REGISTRO */}
          <div className="text-center mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 mb-2">
              ¿Eres nuevo en Katze?
            </p>
            <Link 
              to="/register" 
              className="inline-block border-2 border-katze-gold text-katze-gold font-bold py-2 px-6 rounded-full hover:bg-katze-gold hover:text-white transition text-sm"
            >
              Crear una cuenta
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AdminLoginPage;