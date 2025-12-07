import api from '@/lib/api';
import { Producer } from '@/types/producer';

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

export const producerService = {
    // Listar todos
    getAll: async () => {
        // O Axios retorna { data: { data: [], meta: ... } }
        const response = await api.get<PaginatedResponse<Producer>>('/producers');

        console.log('📦 Resposta do Backend (/producers):', response.data);

        // CASO 1: O backend retornou o objeto paginado { data: [...], meta: ... }
        // A gente verifica se existe response.data.data e se ele é um array
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        // CASO 2: O backend retornou o array direto (caso mude no futuro)
        if (Array.isArray(response.data)) {
            return response.data;
        }

        console.warn('⚠️ Formato inesperado. Retornando array vazio.');
        return [];
    },

    // Buscar um só (geralmente não é paginado)
    getById: async (id: string) => {
        const response = await api.get(`/producers/${id}`);
        return response.data;
    },

    // Atualizar (PUT ou PATCH)
    update: async (id: string, data: any) => {
        const response = await api.patch(`/producers/${id}`, data);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/producers', data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/producers/${id}`);
    }
};