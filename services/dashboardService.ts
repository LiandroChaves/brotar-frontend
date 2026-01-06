import api from "@/lib/api"

export interface DashboardStats {
    totalProducers: number
    totalProperties: number
    totalPcdProducers: number
    totalDomains: number
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        try {
            const [producersResponse, propertiesResponse, pcdResponse, domainsResponse] = await Promise.all([
                api.get("/producers", { params: { page: 1, pageSize: 1 } }),
                api.get("/properties", { params: { page: 1, pageSize: 1 } }),
                api.get("/producers", { params: { isPcd: true, page: 1, pageSize: 1 } }),
                api.get("/domains"),
            ])

            return {
                totalProducers: producersResponse.data.meta?.total || 0,
                totalProperties: propertiesResponse.data.meta?.total || 0,
                totalPcdProducers: pcdResponse.data.meta?.total || 0,
                totalDomains: Array.isArray(domainsResponse.data) ? domainsResponse.data.length : 0,
            }
        } catch (error) {
            console.error("Erro ao buscar estatísticas:", error)
            throw error
        }
    },
}
