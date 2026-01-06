"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Tractor, FileCheck, Layers } from "lucide-react"
import { useEffect, useState } from "react"
import { dashboardService, type DashboardStats } from "@/services/dashboardService"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const data = await dashboardService.getStats()
                setStats(data)
                setError(null)
            } catch (err) {
                console.error("Erro ao carregar estatísticas:", err)
                setError("Erro ao carregar dados do dashboard")
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const statsCards = stats
        ? [
            {
                title: "Total de Produtores",
                value: stats.totalProducers.toString(),
                description: stats.totalPcdProducers > 0 ? `${stats.totalPcdProducers} são PCD` : "Nenhum PCD cadastrado",
                icon: Users,
                color: "text-blue-600",
            },
            {
                title: "Propriedades Cadastradas",
                value: stats.totalProperties.toString(),
                description: `${((stats.totalProperties / Math.max(stats.totalProducers, 1)) * 100).toFixed(0)}% dos produtores`,
                icon: Tractor,
                color: "text-green-600",
            },
            {
                title: "Domínios Cadastrados",
                value: stats.totalDomains.toString(),
                description: "Categorias disponíveis",
                icon: Layers,
                color: "text-orange-600",
            },
            {
                title: "Relatórios Disponíveis",
                value: stats.totalProperties.toString(),
                description: "PDFs prontos para download",
                icon: FileCheck,
                color: "text-purple-600",
            },
        ]
        : []

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
                <p className="text-muted-foreground">Resumo dos indicadores do Instituto Brotar.</p>
            </div>

            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">{error}</div>}

            {/* Grid de Cartões */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading
                    ? // Skeleton loading state
                    Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-4 rounded" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-3 w-full" />
                            </CardContent>
                        </Card>
                    ))
                    : statsCards.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <Card key={index}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
            </div>

            {/* Seção de Status do Sistema */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Resumo do Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : stats ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Produtores Ativos</span>
                                    <span className="font-medium">{stats.totalProducers}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Propriedades Mapeadas</span>
                                    <span className="font-medium">{stats.totalProperties}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Taxa de Cadastro</span>
                                    <span className="font-medium">
                                        {stats.totalProducers > 0
                                            ? `${((stats.totalProperties / stats.totalProducers) * 100).toFixed(1)}%`
                                            : "0%"}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Status do Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Banco de Dados</span>
                                <span className="text-green-600 font-medium">{loading ? "Verificando..." : "Conectado"}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>API Backend</span>
                                <span className="text-green-600 font-medium">{loading ? "Verificando..." : "Online"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
