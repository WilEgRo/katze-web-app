import apiClient from "./apiClient.Service";

export interface Gato {
    _id: string;
    nombre: string;
    descripcion: string;
    fotos: string[];
    edad: string;
    caracter: string;
    estadoSalud: string;
    estado: 'enAdopcion' | 'adoptado' | 'hogarTemporal' | 'perdido' | 'pendiente' | 'rechazado';
    ubicacion?: string; // Nuevo campo
    creadoPor?: string; // ID del usuario que creó el gato    
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
  // Antes quizás llamaba a /gatos, ahora debe llamar a /gatos/adoptados
  const response = await apiClient.get('/gatos/adoptados');
  return response.data;
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

// --- Para que el usuario cree un gato ---
export const createGatoUser = async (formData: FormData) => {
    // El backend decide si lo pone en "pendiente" automáticamente
    const response = await apiClient.post('/gatos', formData);
    return response.data;
};

// --- Obtener mis gatos subidos ---
export const getMisGatos = async (): Promise<Gato[]> => {
    const response = await apiClient.get('/gatos/user/mis-gatos');
    return response.data;
};

//--- [ADMIN] Traer todos los gatos
export const getAllGatosAdmin = async (): Promise<Gato[]> => {
    const response = await apiClient.get('/gatos/admin/all');
    return response.data;
};

