import { useEffect, useState } from 'react';
import { getGatos, type Gato } from '../services/gato.Service'; // Usamos getGatos para traer todo y filtrar aquí
import GatoCard from '../components/GatoCard';
import { FaSearch } from 'react-icons/fa';

const AdoptaPage = () => {
  const [gatos, setGatos] = useState<Gato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ESTADO PARA EL BUSCADOR
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGatos = async () => {
      try {
        // Pedimos TODOS los gatos al backend
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
  }, []);

  //FILTRADO Y ORDENAMIENTO
  const gatosProcesados = gatos
    .filter(gato => {
       // Filtro de Estado: Solo mostramos los que buscan hogar (En Adopción o Temporal)
       // Ocultamos los "Adoptados" y "Perdidos" de esta página
       const esVisible = gato.estado === 'enAdopcion' || gato.estado === 'hogarTemporal';

       // Filtro de Búsqueda: Coincidencia con el texto del usuario
       const textoBusqueda = searchTerm.toLowerCase();
       const coincideTexto = 
         gato.nombre.toLowerCase().includes(textoBusqueda) ||
         gato.descripcion.toLowerCase().includes(textoBusqueda) ||
         gato.edad.toLowerCase().includes(textoBusqueda);

       return esVisible && coincideTexto;
    })
    .sort((a, b) => {
      // Ordenamiento por Popularidad (Los menos solicitados primero)
      // Si solicitudesCount es undefined, asumimos 0
      const solicitudesA = a.solicitudesCount || 0;
      const solicitudesB = b.solicitudesCount || 0;
      return solicitudesA - solicitudesB;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-katze-dark transition-colors py-10 px-6">
      
      <div className="container mx-auto">
        
        {/* TÍTULO Y BUSCADOR */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-katze-gold mb-4 font-serif">
            Encuentra a tu Compañero
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Estos pequeños están buscando una segunda oportunidad. <br />
            Conoce sus historias y dales el hogar que merecen.
          </p>

          {/* INPUT DE BÚSQUEDA */}
          <div className="max-w-md mx-auto relative">
            <FaSearch className="absolute left-4 top-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, edad o historia..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-katze-dark-card border border-transparent focus:border-katze-gold rounded-full outline-none transition text-gray-700 dark:text-white shadow-sm"
            />
          </div>
        </div>

        {/* ESTADOS DE CARGA/ERROR */}
        {loading && (
          <div className="text-center text-katze-gold text-xl animate-pulse">Cargando gatitos... 🐾</div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg max-w-md mx-auto border border-red-200">
            {error}
          </div>
        )}

        {/* GRID DE TARJETAS */}
        {!loading && !error && (
          <>
            {/* Si buscaste algo y no hay resultados */}
            {gatosProcesados.length === 0 && searchTerm !== '' && (
               <div className="text-center text-gray-500 mt-10">
                 No encontramos gatos que coincidan con "{searchTerm}". 😿
               </div>
            )}

            {/* Lista Final */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {gatosProcesados.map((gato) => (
                <GatoCard key={gato._id} gato={gato} />
              ))}
            </div>
          </>
        )}

        {/* EMPTY STATE GLOBAL (Si no hay gatos en la BD) */}
        {!loading && gatos.length === 0 && (
          <div className="text-center text-gray-500 mt-10 py-20 bg-gray-50 dark:bg-katze-dark-card rounded-3xl">
            <p>No hay gatos disponibles para adopción en este momento.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdoptaPage;