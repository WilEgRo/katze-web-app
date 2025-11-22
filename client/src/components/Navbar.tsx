import { Link } from 'react-router-dom';
import { FaCat, FaSun, FaMoon, FaUserCircle } from 'react-icons/fa'; 
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

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