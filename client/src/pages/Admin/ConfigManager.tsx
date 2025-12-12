import { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient.Service';
import { FaSave, FaImage, FaQrcode, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ConfigData {
    qrBancoUrl: string;
    gatoHeroUrl: string;
}

const ConfigManager = () => {
    const [config, setConfig] = useState<ConfigData>({ qrBancoUrl: '', gatoHeroUrl: '' });
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [heroFile, setHeroFile] = useState<File | null>(null);

    const [previewQr, setPreviewQr] = useState<string | null>(null);
    const [previewHero, setPreviewHero] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // 2. CAMBIO: Usamos apiClient.get('/config') sin la URL completa
                const { data } = await apiClient.get('/config');
                setConfig(data);
            } catch (error) {
                console.error("Error cargando config:", error);
            }
        };
        fetchConfig();
    }, []);

    const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setQrFile(file);
            setPreviewQr(URL.createObjectURL(file));
        }
    };

    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setHeroFile(file);
            setPreviewHero(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const formData = new FormData();

        if (qrFile) formData.append('qrImage', qrFile);
        if (heroFile) formData.append('heroImage', heroFile);

        try {
            // 3. CAMBIO IMPORTANTE:
            // - Usamos apiClient.put('/config')
            // - Ya NO necesitamos buscar el token con localStorage (el apiClient lo hace solo)
            // - Solo especificamos que enviamos un archivo (multipart/form-data)

            const { data } = await apiClient.put('/config', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setConfig(data.config);
            setQrFile(null); setPreviewQr(null);
            setHeroFile(null); setPreviewHero(null);

            alert("¡Configuración actualizada con éxito! 😺✨");
        } catch (error) {
            console.error(error);
            alert("Error al guardar configuración");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">

            {/* --- BOTÓN VOLVER ATRÁS --- */}
            <div className="mb-6">
                <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-katze-gold transition-colors font-bold text-sm"
                >
                    <FaArrowLeft /> Volver al Panel de Control
                </Link>
            </div>

            <div className="p-8 bg-white dark:bg-katze-dark-card rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">

                <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white flex items-center gap-3 pb-6 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-katze-gold">⚙️</span> Configuración Web
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* --- CARD 1: IMAGEN GATO HERO --- */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-katze-gold/30 transition-colors">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <FaImage className="text-katze-gold" /> Portada Donaciones
                        </h3>

                        <div className="h-64 w-full bg-gray-50 dark:bg-black/30 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group border border-dashed border-gray-300 dark:border-gray-700">
                            {(previewHero || config.gatoHeroUrl) ? (
                                <img
                                    src={previewHero || config.gatoHeroUrl}
                                    alt="Hero Preview"
                                    className="h-full w-full object-contain p-2"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">Sin imagen</span>
                            )}
                        </div>

                        <label className="block w-full">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleHeroChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-katze-gold file:text-white hover:file:bg-[#b08d4b] cursor-pointer"
                            />
                        </label>
                    </div>

                    {/* --- CARD 2: IMAGEN QR --- */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-katze-gold/30 transition-colors">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <FaQrcode className="text-katze-gold" /> Código QR Banco
                        </h3>

                        <div className="h-64 w-full bg-gray-50 dark:bg-black/30 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group p-4 border border-dashed border-gray-300 dark:border-gray-700">
                            {(previewQr || config.qrBancoUrl) ? (
                                <img
                                    src={previewQr || config.qrBancoUrl}
                                    alt="QR Preview"
                                    className="h-full object-contain bg-white p-2 rounded shadow-sm"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">Sin QR</span>
                            )}
                        </div>

                        <label className="block w-full">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleQrChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-katze-gold file:text-white hover:file:bg-[#b08d4b] cursor-pointer"
                            />
                        </label>
                    </div>

                </div>

                {/* --- BOTÓN GUARDAR --- */}
                <div className="mt-10 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading || (!qrFile && !heroFile)}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-xl transform active:scale-95
              ${(loading || (!qrFile && !heroFile))
                                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed shadow-none'
                                : 'bg-katze-gold hover:bg-[#b08d4b] hover:shadow-orange-500/30'
                            }
            `}
                    >
                        {loading ? 'Guardando...' : (
                            <>
                                <FaSave /> Guardar Cambios
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfigManager;