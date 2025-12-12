import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import { type Gato } from "../services/gato.Service";

interface Props {
    gato: Gato;
}

const GatoCard = ({ gato }: Props) => {
    const isAdoptado = gato.estado === 'adoptado';

    const badgeColor = isAdoptado ? 'bg-green-500' : 'bg-katze-gold';
    const badgeText = isAdoptado ? 'Adoptado' : (gato.estado === 'enAdopcion' ? 'Adóptame' : gato.estado);
    const badBorder = isAdoptado ? 'border-green-500' : 'border-katze-gold';

    // Estilos comunes para el botón (sea Link o Button)
    const buttonStyles = `block w-full text-center border-2 font-bold py-2 rounded-full transition duration-300 ${
        isAdoptado 
            ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white' 
            : 'border-katze-gold text-katze-gold hover:bg-katze-gold hover:text-white'
    }`;

    return (
        <div className={`bg-white dark:bg-katze-dark-card rounded-[30px] shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border ${badBorder} group h-full flex flex-col`}>
            {/* IMAGEN DEL GATO */}
            <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img 
                    src={gato.fotos[0]} 
                    alt={gato.nombre} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Badge de Estado */}
                <div className={`absolute top-4 right-4 ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide`}>
                    {isAdoptado ? 'Final Feliz' : badgeText}
                </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white font-serif">
                        {gato.nombre}
                    </h3>
                    <FaPaw className="text-katze-gold opacity-50" />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                    {gato.descripcion}
                </p>

                {/* Detalles Rápidos */}
                <div className="flex gap-2 mb-6">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                        {gato.edad}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full line-clamp-1">
                        {gato.caracter}
                    </span>
                </div>

                {/* BOTÓN DE ACCIÓN (Lógica Condicional) */}
                {isAdoptado ? (
                    // ADOPTADO -> Botón normal (El click sube al div padre en HomePage y abre el Popup)
                    <button type="button" className={buttonStyles}>
                        Leer Final Feliz
                    </button>
                ) : (
                    // EN ADOPCIÓN -> Link de React Router (Navega a la ficha)
                    <Link to={`/adopta/${gato._id}`} className={buttonStyles}>
                        Adoptar
                    </Link>
                )}
            </div>
        </div>
    );
};

export default GatoCard;