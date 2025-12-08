import api from '@/lib/api';
import { Domain } from '@/types/domain';

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export const domainService = {
    getAll: async () => {
        // Tenta pegar paginado ou array direto
        const response = await api.get<PaginatedResponse<Domain>>('/domains');
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    },

    getById: async (id: string) => {
        const response = await api.get<Domain>(`/domains/${id}`);
        return response.data;
    },

    create: async (data: Omit<Domain, 'id'>) => {
        const response = await api.post('/domains', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Domain>) => {
        const response = await api.patch(`/domains/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/domains/${id}`);
    }
};