import { useEffect, useState } from 'react';
import { getGatos, type Gato } from '../services/gato.Service';
import GatoCard from '../components/GatoCard';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';
import PopupReglas from '../components/PopupReglas';
import { useNavigate } from 'react-router-dom';

const AdoptaPage = () => {
  const [gatos, setGatos] = useState<Gato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // ESTADO PARA MOSTRAR/OCULTAR EL POPUP
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    // Cargar Gatos
    const fetchGatos = async () => {
      try {
        const data = await getGatos();
        setGatos(data);
      } catch (err) {
        setError('Error al cargar los gatitos. Intenta de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGatos();

    // Lógica de Sesión: ¿Ya vio las reglas?
    const rulesAccepted = sessionStorage.getItem('katze_rules_accepted');
    if (!rulesAccepted) {
      setShowRules(true); // Si no hay marca, abre el popup
    }
  }, []);

  // --- MANEJADORES DEL POPUP ---
  
  // Cuando da click en "Aceptar" dentro del Popup
  const handleRulesAccepted = () => {
    sessionStorage.setItem('katze_rules_accepted', 'true'); // Guardar marca
    setShowRules(false); // Cerrar popup
  };

  // Cuando da click en "Cancelar" o la X
  const handleCloseRules = () => {
    // Verificamos si ya había aceptado las reglas antes
    const rulesAccepted = sessionStorage.getItem('katze_rules_accepted');

    if (rulesAccepted) {
      // Ya las aceptó antes (solo las estaba repasando).
      // Solo cerramos el modal y lo dejamos en la página.
      setShowRules(false);
    } else {
      // Es la primera vez y quiere cerrar sin aceptar.
      // Lo expulsamos al inicio.
      navigate('/'); 
    }
  };

  // --- FILTROS ---
  const gatosProcesados = gatos
    .filter(gato => {
       const esVisible = gato.estado === 'enAdopcion' || gato.estado === 'hogarTemporal';
       const textoBusqueda = searchTerm.toLowerCase();
       const coincideTexto = 
         gato.nombre.toLowerCase().includes(textoBusqueda) ||
         gato.descripcion.toLowerCase().includes(textoBusqueda) ||
         gato.edad.toLowerCase().includes(textoBusqueda);
       return esVisible && coincideTexto;
    })
    .sort((a, b) => (a.solicitudesCount || 0) - (b.solicitudesCount || 0));

  return (
    <div className="min-h-screen bg-white dark:bg-katze-dark transition-colors py-10 px-6 pt-28">
      <div className="container mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-katze-gold mb-2 font-serif">
                    Encuentra a tu Compañero
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Dales el hogar que merecen.
                </p>
            </div>

            {/* BOTÓN MANUAL (Por si quiere leer las reglas de nuevo) */}
            <button 
                onClick={() => setShowRules(true)}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-katze-gold text-katze-gold font-bold rounded-full hover:bg-katze-gold hover:text-white transition shadow-sm"
            >
                <FaInfoCircle /> Ver Requisitos
            </button>
        </div>

        {/* BUSCADOR */}
        <div className="max-w-xl mx-auto relative mb-16">
            <FaSearch className="absolute left-5 top-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Buscar por nombre, edad o historia..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-100 dark:bg-katze-dark-card border-2 border-transparent focus:border-katze-gold/50 rounded-2xl outline-none transition text-gray-700 dark:text-white shadow-sm"
            />
        </div>

        {/* CARGA / ERROR */}
        {loading && <div className="text-center text-katze-gold text-xl animate-pulse">Cargando gatitos... 🐾</div>}
        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg max-w-md mx-auto">{error}</div>}

        {/* GRID */}
        {!loading && !error && (
          <>
            {gatosProcesados.length === 0 && searchTerm !== '' && (
               <div className="text-center text-gray-500 mt-10">No encontramos resultados. 😿</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {gatosProcesados.map((gato) => (
                <GatoCard key={gato._id} gato={gato} />
              ))}
            </div>
          </>
        )}

        {!loading && gatos.length === 0 && (
          <div className="text-center text-gray-500 mt-10 py-20 bg-gray-50 dark:bg-katze-dark-card rounded-3xl">
            <p>No hay gatos disponibles por ahora.</p>
          </div>
        )}
      </div>

      {/* --- AQUÍ USAMOS TU COMPONENTE SEPARADO --- */}
      {showRules && (
        <PopupReglas 
            onClose={handleCloseRules} 
            onAccept={handleRulesAccepted} 
        />
      )}

    </div>
  );
};

export default AdoptaPage;