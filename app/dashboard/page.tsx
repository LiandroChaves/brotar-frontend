import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Tractor, MapPin, FileCheck } from "lucide-react"

// MOCK DATA: Depois substituiremos por chamadas reais à API (services)
const stats = [
    {
        title: "Total de Produtores",
        value: "124",
        description: "+4 novos este mês",
        icon: Users,
        color: "text-blue-600",
    },
    {
        title: "Propriedades Cadastradas",
        value: "98",
        description: "78% com área mapeada",
        icon: Tractor,
        color: "text-green-600",
    },
    {
        title: "Municípios Atendidos",
        value: "12",
        description: "Limoeiro do Norte (Principal)",
        icon: MapPin,
        color: "text-orange-600",
    },
    {
        title: "Relatórios Gerados",
        value: "450",
        description: "Último gerado há 2h",
        icon: FileCheck,
        color: "text-purple-600",
    },
]

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
                <p className="text-muted-foreground">
                    Resumo dos indicadores do Instituto Brotar.
                </p>
            </div>

            {/* Grid de Cartões */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Seção de Acesso Rápido ou Gráfico Futuro */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Atividades Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Aqui listaremos os últimos produtores cadastrados (Em breve).
                        </p>
                        {/* Tabela simplificada virá aqui */}
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
                                <span className="text-green-600 font-medium">Conectado</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>API</span>
                                <span className="text-green-600 font-medium">Online v1.0</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}