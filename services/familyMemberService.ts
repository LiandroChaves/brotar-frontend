import api from "@/lib/api"

export interface FamilyMember {
    id?: number
    idProducer: number
    name: string
    kinship: string
    age?: number
    sex?: string
    colorRace?: string
    schooling?: string
    isPcd: boolean
    pcdDescription?: string
    observation?: string
}

export const familyMemberService = {
    create: async (data: FamilyMember) => {
        const response = await api.post("/familyMembers", data)
        return response.data
    },

    update: async (id: number, data: Partial<FamilyMember>) => {
        const response = await api.patch(`/familyMembers/${id}`, data)
        return response.data
    },

    delete: async (id: number) => {
        await api.delete(`/familyMembers/${id}`)
    },

    getAll: async () => {
        const response = await api.get("/familyMembers")
        return Array.isArray(response.data) ? response.data : []
    },

    getByProducer: async (idProducer: number) => {
        const response = await api.get("/familyMembers")
        const allMembers = Array.isArray(response.data) ? response.data : []
        return allMembers.filter((member: FamilyMember) => member.idProducer === idProducer)
    },
}
