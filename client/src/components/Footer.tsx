import { FaCat, FaFacebook, FaInstagram, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-katze-dark-card border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors">
      <div className="container mx-auto px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Columna 1: Marca */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-katze-gold">
              <FaCat />
              <span>Katze.</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Una comunidad dedicada a transformar la vida de los gatos en Santa Cruz. Adopta, cuida y ama.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-6">Explorar</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="/" className="hover:text-katze-gold transition">Inicio</a></li>
              <li><a href="/adopta" className="hover:text-katze-gold transition">Adopciones</a></li>
              <li><a href="#" className="hover:text-katze-gold transition">Historias</a></li>
              <li><a href="#" className="hover:text-katze-gold transition">Voluntariado</a></li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-6">Comunidad</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="/reportar" className="hover:text-katze-gold transition">Reportar Perdido</a></li>
              <li><a href="#" className="hover:text-katze-gold transition">Blog Educativo</a></li>
              <li><a href="/donar" className="hover:text-katze-gold transition">Donaciones</a></li>
              <li><a href="#" className="hover:text-katze-gold transition">Contacto</a></li>
            </ul>
          </div>

          {/* Columna 4: Social */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-6">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-katze-gold hover:text-white transition">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-katze-gold hover:text-white transition">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-katze-gold hover:text-white transition">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; 2025 Katze Community. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            Hecho con <FaHeart className="text-red-500" /> en Bolivia
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;