import apiClient from "./apiClient.Service";

export interface Gato {
    _id: string;
    nombre: string;
    descripcion: string;
    fotos: string[];
    edad: string;
    caracter: string;
    estadoSalud: string;
    estado: 'enAdopcion' | 'adoptado' | 'hogarTemporal' | 'perdido';
    solicitudesCount: number;
}

// Funcion para obtener todos los gatos publicos
export const getGatos = async (): Promise<Gato[]> => {
    const response = await apiClient.get<Gato[]>("/gatos");
    return response.data;
};

// Funcion para obtener un gato por su ID
export const getGatoById = async (id: string): Promise<Gato> => {
    const response = await apiClient.get<Gato>(`/gatos/${id}`);
    return response.data;
};

export const getGatosAdoptados = async (): Promise<Gato[]> => {
    const response = await apiClient.get('/gatos');
    const adoptados = response.data.filter((gato: Gato) => gato.estado === 'adoptado');
    return adoptados;
};

export const getGatosEnAdopcion = async (): Promise<Gato[]> => {
    const response = await apiClient.get('/gatos');
    const enAdopcion = response.data.filter((gato: Gato) => gato.estado === 'enAdopcion');
    return enAdopcion;
};

export const getGatosHogarTemporal = async (): Promise<Gato[]> => {
    const response = await apiClient.get('/gatos');
    const hogarTemporal = response.data.filter((gato: Gato) => gato.estado === 'hogarTemporal');
    return hogarTemporal;
};

// [ADMIN] Crear un nuevo gato (requiere FormData por la foto)
export const createGato = async (formData: FormData) => {
    const response = await apiClient.post('/gatos', formData);
    return response.data;
};

// [ADMIN] Actualizar un gato existente
export const updateGato = async (id: string, datos: Partial<Gato>) => {
    const response = await apiClient.put(`/gatos/${id}`, datos);
    return response.data;
};