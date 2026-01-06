
import axios from "axios"
import Cookies from "js-cookie"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
})

api.interceptors.request.use((config) => {
    const token = Cookies.get("brotar.auth-token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// // Simula token expirado para testes
// api.interceptors.request.use((config) => {
//   const token = Cookies.get("brotar.auth-token")

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return Promise.reject({
//     response: { status: 401 },
//   })
// })

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Detecta erro 401 (Unauthorized - token expirado)
        if (error.response?.status === 401) {
            console.log("[v0] Token expirado detectado - erro 401")

            // Importa dinamicamente para evitar problemas de SSR
            import("@/stores/useTokenExpiredStore").then(({ useTokenExpiredStore }) => {
                const { openModal } = useTokenExpiredStore.getState()
                openModal()
            })
        }

        return Promise.reject(error)
    },
)

export default api
