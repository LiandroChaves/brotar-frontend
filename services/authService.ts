import api from '@/lib/api';

export interface LoginDTO {
    cpf: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    // O backend retorna exatamente assim (com erro de grafia), então mantemos assim:
    primaryAcess: boolean;
    accessToken: string;
}

export const authService = {
    login: async (data: LoginDTO) => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },
};