import apiClient from "./apiClient";

interface LoginResponse {
    token: string;
    userId: string;
    email: string;
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
    // Aqui podríamos agregar lógica adicional para verificar la validez del token
    return !!token;
};
