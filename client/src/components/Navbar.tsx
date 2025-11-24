import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCat, FaSun, FaMoon, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; 
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // estado para saber si el usuario hizo scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // estado del usuario logeado
  const [user, setUser] = useState<{email: string, role: string} | null>(null);

  // detetar el escroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  // leer usuario del localStorage al cargar
  useEffect(() =>{
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  },[location]) // se actualiza si cambiamos de ruta

  // funcion para saber si el link esta activo
  const isActive = (path: string) => location.pathname === path ? 'text-katze-gold font-bold' : 'text-gray-600 dark:text-gray-300 hover:text-katze-gold';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  
  return (
    // Navbar transparente que hereda el color del fondo general
    <div className={`fixed z-50 transition-all duration-500 ease-in-out flex justify-center
      ${isScrolled 
        ? 'top-4 left-0 right-0' // MODO ISLA: Bajamos un poco y centramos
        : 'top-0 left-0 w-full'  // MODO NORMAL: Pegado arriba, ancho completo
      }
    `}>
      <nav className={`transition-all duration-500 ease-in-out flex justify-between items-center px-8
        ${isScrolled 
          ? 'w-[90%] md:w-[85%] lg:w-[1200px] rounded-full py-3 shadow-2xl bg-white/90 dark:bg-black/90 backdrop-blur-md border border-gray-200 dark:border-gray-800' // ESTILOS ISLA
          : 'w-full py-5' // ESTILOS NORMALES (Sólido)
        }
      `}>
        <div className="container mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <FaCat className="text-3xl text-katze-gold group-hover:scale-110 transition" />
            <span className="text-2xl font-extrabold text-katze-gold tracking-tight">Katze.</span>
          </Link>

          {/* MENU CENTRAL - Forzamos que sea visible */}
          {/* Usamos 'hidden md:flex' para ocultarlo solo en celulares muy pequeños */}
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-gray-500 dark:text-gray-400">
            <Link to="/"className={isActive('/')}>Inicio</Link>
            <Link to="/adopta" className={isActive('/adopta')}>Descubrir</Link>
            <Link to="/comunidad" className={isActive('/comunidad')}>Comunidad</Link>
            <Link to="/donar" className={isActive('/donar')}>Ayudar</Link>
          </div>

          {/* ZONA DERECHA */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-katze-gold hover:bg-katze-gold hover:text-white transition"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            
            {/* LOGICA DE USUARIO (Punto 1) */}
            {user ? (
              <div className={`flex items-center gap-3 pl-4 border-l border-gray-300 dark:border-gray-700 `}>
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-katze-gold uppercase">{user.role || 'Usuario'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[100px] truncate">{user.email}</p>
                </div>
                
                {/* Si es Admin o Moderador, clic en el icono lleva al Dashboard */}
                <Link to={user.role === 'ADMIN' || user.role === 'MODERADOR' ? "/admin/dashboard" : "/perfil"} className="text-2xl text-gray-700 dark:text-gray-200 hover:text-katze-gold">
                  <FaUserCircle />
                </Link>

                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition" title="Cerrar Sesión">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <FaUserCircle className="text-3xl text-gray-300 dark:text-gray-600 hover:text-katze-gold transition border border-katze-gold rounded-full p-1" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;