"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { producerService } from "@/services/producerService"
import type { Producer } from "@/types/producer"
import Link from "next/link"
import { toast } from "sonner" // Mantendo o Sonner
import { formatarCPF } from "@/lib/utils"
import { ProducerActions } from "@/components/ProducerActions"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function ProducersPage() {
    const [producers, setProducers] = useState<Producer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    // Busca os dados quando a tela carrega
    useEffect(() => {
        loadProducers()
    }, [])

    const loadProducers = async () => {
        try {
            setIsLoading(true)
            const data = await producerService.getAll()
            setProducers(data)
        } catch (error) {
            console.error("Erro ao carregar produtores", error)
            toast.error("Erro ao carregar a lista de produtores.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteProducer = async (id: string) => {
        try {
            const response = await api.delete(`/producers/${id}`)

            if (response.status === 200 || response.status === 204) {
                setProducers((prev) => prev.filter((p) => p.id !== Number(id)))

                toast.success("Produtor removido com sucesso!")
            } else {
                toast.error("Não foi possível excluir o produtor.")
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro de conexão ao tentar excluir.")
        }
    }

    const handleEditProducer = (producer: any) => {
        router.push(`/dashboard/produtores/${producer.id}`)
    }

    const safeProducers = Array.isArray(producers) ? producers : []

    const filteredProducers = safeProducers.filter(
        (p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.cpf).includes(searchTerm),
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Produtores</h1>
                <Link href="/dashboard/produtores/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Novo Produtor
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listagem</CardTitle>
                    <div className="pt-2">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou CPF..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-4">Carregando...</div>
                    ) : filteredProducers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Nenhum produtor encontrado.</div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[600px]">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr className="border-b">
                                        <th className="h-12 px-4 align-middle">Nome</th>
                                        <th className="h-12 px-4 align-middle">CPF</th>
                                        <th className="h-12 px-4 align-middle">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducers.map((prod) => (
                                        <tr key={prod.id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium">{prod.name}</td>
                                            <td className="p-4">{formatarCPF(prod.cpf)}</td>
                                            <td className="p-4">
                                                <ProducerActions
                                                    producer={prod}
                                                    onDelete={handleDeleteProducer} // Agora passa a string
                                                    onEdit={handleEditProducer}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
