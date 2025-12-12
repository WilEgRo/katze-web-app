import axios from "axios";

// Variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

// configurar la url del server
const apiClient = axios.create({
  baseURL: API_URL
});

//Interceptor Si tenemos un token guardado, lo añadimos a cada petición
// esto nos servira cuando hagamos el login del Admin
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;