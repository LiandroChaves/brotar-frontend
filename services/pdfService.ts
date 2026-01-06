import api from "@/lib/api"

export const pdfService = {
    generatePropertyPdf: async (propertyId: number): Promise<Blob> => {
        const response = await api.get(`/pdf/form/${propertyId}`, {
            responseType: "blob", // Importante para receber arquivo binário
        })
        return response.data
    },

    downloadPdf: async (propertyId: number, fileName?: string) => {
        try {
            const blob = await pdfService.generatePropertyPdf(propertyId)

            // Cria uma URL temporária para o blob
            const url = window.URL.createObjectURL(blob)

            // Cria um link invisível e clica nele para fazer o download
            const link = document.createElement("a")
            link.href = url
            link.download = fileName || `propriedade-${propertyId}.pdf`
            document.body.appendChild(link)
            link.click()

            // Limpa o link e a URL
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            return true
        } catch (error) {
            console.error("Erro ao baixar PDF:", error)
            throw error
        }
    },
}
