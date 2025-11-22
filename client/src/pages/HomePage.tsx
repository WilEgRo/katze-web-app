import Hero from '../components/Hero';

const HomePage = () => {
  return (
    <div className="min-h-screen pb-20 bg-white dark:bg-gray-950 transition-colors">
      
      {/* SECCIÓN 1: HERO */}
      <Hero />

      {/* SECCIÓN 2: HISTORIAS DE ÉXITO */}
      <section className="container mx-auto px-8 py-16">
        <div className="flex justify-center gap-2 mb-8">
          <span className="h-2 w-2 bg-gray-600 dark:bg-gray-400 rounded-full"></span>
          <span className="h-2 w-2 bg-katze-gold rounded-full"></span>
          <span className="h-2 w-2 bg-gray-600 dark:bg-gray-400 rounded-full"></span>
        </div>
        
        <h2 className="text-3xl font-bold text-katze-gold mb-10 font-serif">
          Historias de Éxito
        </h2>
        
        <div className="text-gray-400 dark:text-gray-300 text-center border border-gray-800 dark:border-gray-700 p-10 rounded-lg bg-gray-900/50 dark:bg-gray-800/60">
          (Aquí irán las tarjetas de "Milo & Sofía" pronto...)
        </div>
      </section>
      
      {/* SECCIÓN 3: GATOS PERDIDOS */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-katze-gold mb-10 font-serif">
            Gatos Perdidos de Esterilizar
          </h2>
          <div className="text-gray-400 dark:text-gray-300 text-center border border-gray-800 
          dark:border-gray-700 p-10 rounded-lg bg-black/30 dark:bg-gray-800/40">
            (Aquí irán las tarjetas de reporte de gatos...)
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
