import api from '@/lib/api';

export interface ChangePasswordDTO {
    newPassword: string; // No backend é 'newPassword'
}

export const adminService = {
    // A rota final no backend é: /admins/change-password/:id
    changePassword: async (id: number, data: ChangePasswordDTO) => {
        const response = await api.patch(`/admins/change-password/${id}`, data);
        return response.data;
    },
};