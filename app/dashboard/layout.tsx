"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        // h-screen pode dar bug em mobile, h-[100dvh] é o 'dynamic viewport height' que resolve
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950">

            {/* SIDEBAR DESKTOP */}
            <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
                <Sidebar />
            </aside>

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 flex flex-col md:pl-64 h-full w-full">

                {/* HEADER MOBILE */}
                <header className="md:hidden flex items-center p-4 border-b bg-white dark:bg-gray-900 h-16 shrink-0 sticky top-0 z-40">
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-ml-2">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>

                        {/* AQUI TÁ A CORREÇÃO:
                   1. 'h-[100dvh]': Força altura real do viewport mobile
                   2. 'flex flex-col': Garante que o filho ocupe o espaço
                */}
                        <SheetContent side="left" className="p-0 w-72 border-r-0 h-[100dvh] flex flex-col">
                            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                            <SheetDescription className="sr-only">Menu principal do sistema</SheetDescription>

                            {/* A Sidebar precisa preencher o espaço do flex pai */}
                            <div className="flex-1 h-full">
                                <Sidebar onLinkClick={() => setIsMobileOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="ml-4 font-bold text-lg text-primary">Brotar</div>
                </header>

                {/* CONTEÚDO */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-[100vw]">
                    {children}
                </main>
            </div>
        </div>
    )
}