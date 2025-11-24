import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaHeart } from 'react-icons/fa';

const PerfilPage = () => {
  const navigate = useNavigate();
  // Leemos datos del usuario
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark transition-colors pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-2xl">
        
        <div className="bg-white dark:bg-katze-dark-card rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 text-center">
          
          <div className="w-24 h-24 bg-katze-gold/20 text-katze-gold rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
            <FaUserCircle />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-serif mb-1">
            Hola, Usuario
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{user.email}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-gray-50 dark:bg-black/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
               <h3 className="font-bold text-katze-gold mb-2 flex items-center gap-2">
                 <FaHeart /> Mis Favoritos
               </h3>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 Aún no has guardado gatos favoritos.
               </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-black/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
               <h3 className="font-bold text-katze-gold mb-2">Mis Reportes</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 No tienes reportes de gatos perdidos activos.
               </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>

        </div>
      </div>
    </div>
  );
};

export default PerfilPage;