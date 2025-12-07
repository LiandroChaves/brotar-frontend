// services/domainService.ts
import api from '@/lib/api';

export interface Domain {
    id: number;
    label: string;
    type: string; // 'INFRASTRUCTURE', 'MACHINERY', etc
}

export const domainService = {
    getAll: async () => {
        // Se o endpoint não existir ainda, retorna vazio pra não quebrar
        try {
            const response = await api.get('/domains');
            return Array.isArray(response.data) ? response.data : [];
        } catch (e) {
            console.warn("Domínios não carregados");
            return [];
        }
    }
};