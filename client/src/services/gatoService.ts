import apiClient from "./apiClient";

export interface Gato {
    _id: string;
    nombre: string;
    descripcion: string;
    fotos: string[];
    edad: string;
    caracter: string;
    estadoSalud: string;
    estado: 'enAdopcion' | 'adoptado' | 'hogarTemporal' | 'perdido';
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
    const response = await apiClient.get('/gatos?estado=adoptado');
    return response.data;
};

// [ADMIN] Crear un nuevo gato (requiere FormData por la foto)
export const createGato = async (formData: FormData) => {
    const response = await apiClient.post('/gatos', formData);
    return response.data;
};