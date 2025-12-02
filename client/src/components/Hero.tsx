import PopupReglas from "./popup";
import { useState } from "react";

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full px-6 pb-15">
      {/* CAJA PRINCIPAL: Fondo gris en día, oscuro en noche, bordes redondeados */}
      <div className="
            container mx-auto 
            bg-gray-100 border dark:border-katze-gold
            dark:bg-katze-dark-card rounded-[40px] p-10 md:p-20 flex flex-col md:flex-row items-center relative overflow-hidden transition-colors duration-300">

        {/* COLUMNA IZQUIERDA (Texto) */}
        <div className="w-full md:w-1/2 z-10 space-y-8">

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-katze-gold">
            ENCUENTRA TU <br />
            <span className="text-gray-900 dark:text-white">AMIGO PERFECTO</span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md font-medium">
            Únete a nuestra comunidad. Adopta, ayuda a un gato perdido o encuentra a tu nuevo mejor amigo hoy mismo.
          </p>

          <div>
            <button className="bg-katze-gold text-white font-bold py-3 px-8 rounded-full hover:bg-yellow-600 transition shadow-md" onClick={() => setIsOpen(true)}>
              ADOPTAR
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA (Imagen) */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end relative">
          {/* Efecto de brillo dorado detrás */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-katze-gold opacity-20 blur-[100px] rounded-full"></div>

          {/* IMAGEN DEL GATO (Usaremos una más parecida a la referencia: fondo limpio) */}
          <img
            src="https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=1935&auto=format&fit=crop"
            alt="Gato elegante"
            className="relative w-[400px] h-[500px] object-cover rounded-[30px] shadow-2xl z-10 grayscale-[20%] hover:grayscale-0 transition duration-500"
          />
        </div>

      </div>
      {isOpen && <PopupReglas onClose={() => setIsOpen(false)} />}
    </section>
  );
};

export default Hero;