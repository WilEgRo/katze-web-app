import apiClient from "./apiClient.Service";

interface LoginResponse {
    token: string;
    userId: string;
    username: string;
    email: string;
    role: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'MODERADOR';
    createdAt: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });

    //si el login es exitoso, guardamos el token automaticamente
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Regirigir al usuario a la página de login
    window.location.href = "/login";
}

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token;
};

export const register = async (username: string,email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', { username, email, password });
    // Si el registro devuelve el token de una vez, iniciamos sesión automáticamente
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
}

export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get('/auth/users');
    return response.data;
};

export const updateUserRole = async (id: string, role: string) => {
    const response = await apiClient.put(`/auth/users/${id}/role`, { role });
    return response.data;
};