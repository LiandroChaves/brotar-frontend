// frontend/lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // A URL do seu NestJS
});

// Interceptor para injetar o Token automaticamente em toda requisição
api.interceptors.request.use((config) => {
    const token = Cookies.get('brotar.auth-token');

    // ADICIONE ESTES LOGS PARA DEBUG
    console.log('Interceptor - URL:', config.url);
    console.log('Interceptor - Token encontrado?', !!token);
    // console.log('Interceptor - Token:', token); // Descomente se quiser ver o token

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;