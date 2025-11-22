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