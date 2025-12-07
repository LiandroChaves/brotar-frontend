// services/propertyService.ts
import api from '@/lib/api';
import { Property } from '@/types/property';

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export const propertyService = {
    getAll: async () => {
        const response = await api.get<PaginatedResponse<Property>>('/properties');
        // Tratamento pra garantir que retorna array
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    },

    getById: async (id: string) => {
        const response = await api.get<Property>(`/properties/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/properties', data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.patch(`/properties/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/properties/${id}`);
    }
};