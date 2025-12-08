import api from "@/lib/api"

export interface CreateAdminDTO {
    name: string
    email: string
    password: string
}

export interface UpdateAdminDTO {
    name?: string
    email?: string
}

export interface ChangePasswordDTO {
    newPassword: string
}

interface PaginatedResponse<T> {
    data: T[]
    meta: {
        total: number
        page: number
        pageSize: number
        totalPages: number
    }
}

export const adminService = {
    getAll: async () => {
        const response = await api.get<PaginatedResponse<any>>("/admins")
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data
        }
        if (Array.isArray(response.data)) {
            return response.data
        }
        return []
    },

    getById: async (id: number) => {
        const response = await api.get(`/admins/${id}`)
        return response.data
    },

    create: async (data: CreateAdminDTO) => {
        const response = await api.post("/admins", data)
        return response.data
    },

    update: async (id: number, data: UpdateAdminDTO) => {
        const response = await api.patch(`/admins/${id}`, data)
        return response.data
    },

    delete: async (id: number) => {
        await api.delete(`/admins/${id}`)
    },

    changePassword: async (id: number, data: ChangePasswordDTO) => {
        const response = await api.patch(`/admins/change-password/${id}`, data)
        return response.data
    },
}
