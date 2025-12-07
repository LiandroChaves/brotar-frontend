"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Tractor,
    FileText,
    Settings
} from "lucide-react"

const menuItems = [
    { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { href: '/dashboard/produtores', label: 'Produtores', icon: Users },
    { href: '/dashboard/propriedades', label: 'Propriedades', icon: Tractor },
    { href: '/dashboard/relatorios', label: 'Relatórios PDF', icon: FileText },
    // { href: '/dashboard/dominios', label: 'Configurações', icon: Settings },
]

interface SidebarItemsProps {
    onClick?: () => void; // Pra fechar o menu mobile quando clicar
}

export function SidebarItems({ onClick }: SidebarItemsProps) {
    const pathname = usePathname()

    return (
        <nav className="space-y-2">
            {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClick}
                        className={cn(
                            "flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-md",
                            // Teu estilo original restaurado:
                            isActive
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary"
                        )}
                    >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}