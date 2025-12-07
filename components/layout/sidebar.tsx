"use client"

import { LogOut, Moon, Sun } from "lucide-react"
import { SidebarItems } from "./SidebarItems"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useTheme } from "next-themes" // <--- Import do tema
import { Button } from "@/components/ui/button" // Usando o Button do Shadcn pra ficar padrao
import { useEffect, useState } from "react"

interface SidebarProps {
    className?: string;
    onLinkClick?: () => void;
}

export function Sidebar({ className, onLinkClick }: SidebarProps) {
    const router = useRouter()
    const logout = useAuthStore((state) => state.logout)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Evita erro de hidratação do tema no Next.js
    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = () => {
        if (logout) logout()
        Cookies.remove('brotar.auth-token')
        Cookies.remove('brotar.requires-change')
        router.push('/login')
    }

    return (
        <div className={`flex flex-col h-full bg-white border-r dark:bg-gray-900 dark:border-gray-700 ${className}`}>
            {/* Cabeçalho da Sidebar */}
            <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-center text-primary">
                    Brotar Admin
                </h2>
            </div>

            {/* Links de Navegação (Flex-1 faz ele ocupar o espaço disponível e empurrar o rodapé) */}
            <div className="flex-1 px-4 overflow-y-auto">
                <SidebarItems onClick={onLinkClick} />
            </div>

            {/* Rodapé com Tema e Logout */}
            <div className="p-4 border-t dark:border-gray-700 space-y-2">

                {/* Botão de Tema */}
                {mounted && (
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 mr-3" />
                        ) : (
                            <Moon className="w-5 h-5 mr-3" />
                        )}
                        {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
                    </Button>
                )}

                {/* Botão de Sair */}
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sair do Sistema
                </Button>
            </div>
        </div>
    )
}