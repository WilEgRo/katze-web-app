import { useState } from 'react';
import { FaCheckCircle, FaTimes, FaPaw, FaShieldAlt, FaHome, FaSyringe } from 'react-icons/fa';

interface PopupProps {
  onClose: () => void;   // Para cerrar/cancelar
  onAccept: () => void;  // Para cuando acepta las reglas
}

const PopupReglas: React.FC<PopupProps> = ({ onClose, onAccept }) => {
    const [aceptado, setAceptado] = useState(false);

    // Lista de reglas
    const reglas = [
        {
            titulo: "Mayoría de Edad",
            desc: "Debes ser mayor de 21 años o contar con respaldo de tus padres.",
            icon: <FaPaw className="text-katze-gold" />
        },
        {
            titulo: "Hogar Seguro (Vital)",
            desc: "Si vives en departamento, es obligatorio tener mallas de seguridad. No permitimos gatos con acceso libre a la calle.",
            icon: <FaShieldAlt className="text-blue-500" />
        },
        {
            titulo: "Solvencia Económica",
            desc: "Compromiso de vacunas anuales, alimento de calidad y atención veterinaria.",
            icon: <FaHome className="text-green-500" />
        },
        {
            titulo: "Esterilización",
            desc: "Si adoptas un cachorro, firmas un compromiso de esterilización obligatoria a los 6 meses.",
            icon: <FaSyringe className="text-red-400" />
        }
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999] p-4 animate-fade-in">
        
            <div className="bg-white dark:bg-katze-dark-card rounded-[30px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-katze-gold p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                        <FaPaw /> Requisitos de Adopción
                    </h2>
                    {/* Botón X para cerrar sin aceptar */}
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                        Para asegurar el bienestar de nuestros rescatados, por favor lee atentamente nuestros requisitos indispensables:
                    </p>

                    <div className="space-y-4">
                        {reglas.map((regla, index) => (
                            <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 items-start">
                                <div className="mt-1 text-xl shrink-0">{regla.icon}</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">{regla.titulo}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mt-1">{regla.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 dark:bg-black/40 border-t border-gray-100 dark:border-gray-700">
                    
                    <label className="flex items-center gap-3 cursor-pointer group mb-6 select-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition">
                        <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors shrink-0 ${aceptado ? 'bg-katze-gold border-katze-gold' : 'border-gray-400 bg-white dark:bg-transparent'}`}>
                            {aceptado && <FaCheckCircle className="text-white text-sm" />}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={aceptado} 
                            onChange={(e) => setAceptado(e.target.checked)} 
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition font-medium">
                            He leído y acepto los requisitos.
                        </span>
                    </label>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            Cancelar
                        </button>
                    
                        <button
                            onClick={() => {
                                if (aceptado) onAccept(); // Solo ejecuta si aceptó
                            }}
                            disabled={!aceptado}
                            className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2
                                ${aceptado 
                                ? 'bg-katze-gold hover:bg-yellow-600 cursor-pointer transform hover:-translate-y-1' 
                                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70'
                                }
                            `}
                        >
                            {aceptado ? 'Continuar' : 'Acepta para seguir'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupReglas;