import { useEffect, useState } from 'react';
import { getGatosEnAdopcion, type Gato, getGatosHogarTemporal } from '../services/gatoService';
import GatoCard from '../components/GatoCard';

const AdoptaPage = () => {
  const [gatos, setGatos] = useState<Gato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Este useEffect se ejecuta cuando carga la página
  useEffect(() => {
    const fetchGatos = async () => {
      try {
        const [enAdopcion, hogarTemporal] = await Promise.all([
          getGatosEnAdopcion(),
          getGatosHogarTemporal(),
        ]);
        setGatos([...enAdopcion, ...hogarTemporal]);
      } catch (err) {
        setError('Error al cargar los gatitos. Intenta de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false); //
      }
    };

    fetchGatos();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-katze-dark transition-colors py-10 px-6">
      
      <div className="container mx-auto">
        
        {/* TÍTULO */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-katze-gold mb-4 font-serif">
            Encuentra a tu Compañero
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Estos pequeños están buscando una segunda oportunidad. <br />
            Conoce sus historias y dales el hogar que merecen.
          </p>
        </div>

        {/* ESTADOS DE CARGA/ERROR */}
        {loading && (
          <div className="text-center text-katze-gold text-xl">Cargando gatitos... 🐾</div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* GRID DE TARJETAS */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {gatos.map((gato) => (
              <GatoCard key={gato._id} gato={gato} />
            ))}
          </div>
        )}

        {/* EMPTY STATE (Si no hay gatos) */}
        {!loading && gatos.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No hay gatos disponibles para adopción en este momento.
          </div>
        )}

      </div>
    </div>
  );
};

export default AdoptaPage;