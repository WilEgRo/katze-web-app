import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import { type Gato } from "../services/gatoService";

interface Props {
    gato: Gato;
}

const GatoCard = ({ gato }: Props) => {
    return (
        <div className="bg-white dark:bg-katze-dark-card rounded-[30px] shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 dark:border-katze-gold group">
            {/* IMAGEN DEL GATO */}
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={gato.fotos[0]} 
                    alt={gato.nombre} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Badge de Estado */}
                <div className="absolute top-4 right-4 bg-katze-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                    {gato.estado === 'enAdopcion' ? 'Adóptame' : gato.estado}
                </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white font-serif">
                        {gato.nombre}
                    </h3>
                    <FaPaw className="text-katze-gold opacity-50" />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
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

                {/* BOTÓN DE ACCIÓN */}
                <Link 
                    to={`/adopta/${gato._id}`} 
                    className="block w-full text-center border-2 border-katze-gold text-katze-gold font-bold py-2 rounded-full hover:bg-katze-gold hover:text-white transition duration-300"
                >
                    Ver Historia
                </Link>
            </div>
        </div>
    );
};

export default GatoCard;