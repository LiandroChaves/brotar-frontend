import api from '@/lib/api';

export interface FamilyMember {
    id?: number;
    idProducer: number; // A chave estrangeira é obrigatória pra saber quem é o pai
    name: string;
    kinship: string;
    age?: number;
    sex?: string;
    colorRace?: string;
    schooling?: string;
    isPcd: boolean;
    observation?: string;
}

export const familyMemberService = {
    // Cria um membro novo
    create: async (data: FamilyMember) => {
        const response = await api.post('/family-members', data);
        return response.data;
    },

    // Atualiza um membro existente
    update: async (id: number, data: Partial<FamilyMember>) => {
        const response = await api.patch(`/family-members/${id}`, data);
        return response.data;
    },

    // Deleta um membro (vamos usar isso no botão de lixeira do form depois)
    delete: async (id: number) => {
        await api.delete(`/family-members/${id}`);
    }
};