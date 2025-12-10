import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-katze-dark transition-colors flex items-center justify-center p-6 pt-24">
      <div className="container mx-auto text-center max-w-2xl">
        
        {/* IMAGEN DEL GATO (404) */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Círculo decorativo detrás */}
          <div className="absolute inset-0 bg-katze-gold/20 rounded-full blur-3xl animate-pulse"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1887&auto=format&fit=crop" 
            alt="Gato confundido" 
            className="relative w-full h-full object-cover rounded-full shadow-2xl border-4 border-white dark:border-katze-dark-card z-10"
          />
          
          {/* Etiqueta flotante */}
          <div className="absolute -bottom-4 -right-4 bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg transform rotate-12 z-20">
            Error 404
          </div>
        </div>

        {/* TEXTO */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white font-serif mb-4">
          ¡Miau! 😿
        </h1>
        <h2 className="text-2xl font-bold text-katze-gold mb-6">
          Página no encontrada
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 leading-relaxed">
          Parece que el gato que buscas se ha escapado, se escondió muy bien o esta página nunca existió.
        </p>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-katze-gold text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-yellow-600 transition transform hover:-translate-y-1"
          >
            <FaHome /> Volver al Inicio
          </Link>
          
          <Link 
            to="/adopta" 
            className="flex items-center justify-center gap-2 bg-white dark:bg-katze-dark-card text-gray-700 dark:text-white font-bold py-3 px-8 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <FaSearch /> Buscar Gatos
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
