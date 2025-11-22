import apiClient from "./apiClient";

export interface Reporte {
    _id: string;
    nombreGato?: string;
    descripcion: string;
    zona: string;
    contacto: string;
    foto: string;
    fecha: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
}

// funcion para enviar un nuevo reporte con foto
export const createReporte = async (formData: FormData) => {
    // cuando enviamos FromData, el navegador automaticamente añade el header 'Content-Type': 'multipart/form-data'
    const response = await apiClient.post("/reportes", formData);
    return response.data;
};

// funcion para obtener los reportes Aprobados (publicos)
export const getReportesPublicos = async (): Promise<Reporte[]> => {
    const response = await apiClient.get('/reportes');
    return response.data;
}