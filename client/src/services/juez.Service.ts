import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const validarImagenGato = async (imagen: File) => {
    const formData = new FormData();
    formData.append('imagen', imagen);

    const response = await axios.post(`${API_URL}/MCP/validar-gato`, formData);

    return response.data;
};