import apiClient from './apiClient.Service';

export interface Solicitud {
    _id: string;
    gatoId: { _id: string; nombre: string; fotos: string[] } | string; // Puede venir populado o solo ID
    nombreSolicitante: string;
    telefono: string;
    email: string;
    motivo: string;
    vivienda: 'casa' | 'departamento';
    tieneMallas: boolean;
    otrasMascotas: boolean;
    tienePatio: boolean;
    tieneNiños: boolean;
    cantidadNiños: number;
    estado: 'pendiente' | 'aprobada' | 'rechazada';
    fecha: string;
}

export const createSolicitud = async (datos: any) => {
    const response = await apiClient.post('/solicitudes', datos);
    return response.data;
};

export const getSolicitudesAdmin = async (): Promise<Solicitud[]> => {
    const response = await apiClient.get('/solicitudes/admin/all');
    return response.data;
};

export const updateSolicitudEstado = async (id: string, estado: string) => {
    const response = await apiClient.put(`/solicitudes/admin/${id}`, { estado });
    return response.data;
};