import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCat, FaSun, FaMoon, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; 
import { useTheme } from '../context/ThemeContext';
import { isAuthenticated } from '../services/authService';

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
      setIsScrolled(window.scrollY > 50);
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
    <nav className="w-full py-6 px-8 bg-transparent z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <FaCat className="text-3xl text-katze-gold group-hover:scale-110 transition" />
          <span className="text-2xl font-extrabold text-katze-gold tracking-tight">Katze.</span>
        </Link>

        {/* MENU CENTRAL - Forzamos que sea visible */}
        {/* Usamos 'hidden md:flex' para ocultarlo solo en celulares muy pequeños */}
        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-katze-gold dark:hover:text-katze-gold transition text-gray-900 dark:text-white">Home</Link>
          <Link to="/adopta" className="hover:text-katze-gold dark:hover:text-katze-gold transition">Descubrir</Link>
          <Link to="/reportar" className="hover:text-katze-gold dark:hover:text-katze-gold transition">Comunidad</Link>
          <Link to="/donar" className="hover:text-katze-gold dark:hover:text-katze-gold transition">Donar</Link>
        </div>

        {/* ZONA DERECHA */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-katze-gold hover:bg-katze-gold hover:text-white transition"
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          <Link to="/login">
            <FaUserCircle className="text-3xl text-gray-300 dark:text-gray-600 hover:text-katze-gold transition" />
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;