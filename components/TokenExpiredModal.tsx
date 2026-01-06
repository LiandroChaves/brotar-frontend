"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useTokenExpiredStore } from "@/stores/useTokenExpiredStore"
import Cookies from "js-cookie"
import { useAuthStore } from "@/stores/useAuthStore"

export function TokenExpiredModal() {
    const router = useRouter()

    const [seconds, setSeconds] = useState(5)
    const { isOpen, closeModal } = useTokenExpiredStore()
    const logout = useAuthStore((state) => state.logout)

    const handleRedirectToLogin = () => {
        // Limpa os cookies
        Cookies.remove("brotar.auth-token")
        Cookies.remove("brotar.requires-change")

        // Limpa o store de autenticação
        if (logout) logout()

        // Fecha o modal
        closeModal()

        // Redireciona para login
        router.push("/login")
    }

    // Auto-redirecionar após 5 segundos se o modal estiver aberto
    useEffect(() => {
        if (!isOpen) return

        setSeconds(5) // reseta sempre que abrir

        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    handleRedirectToLogin()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle className="text-xl">Sessão Expirada</DialogTitle>
                    </div>
                    <DialogDescription className="text-base">
                        Sua sessão expirou por motivos de segurança. Por favor, faça login novamente para continuar.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
                    <p className="text-sm text-muted-foreground">Redirecionando em {seconds} segundos...</p>
                    <Button onClick={handleRedirectToLogin} className="w-full sm:w-auto">
                        Ir para Login
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
