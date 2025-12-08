"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { domainService } from '@/services/domainService'
import { Domain } from '@/types/domain' // Se não tiver criado o type ainda, pode usar any por enquanto
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { DomainActions } from '@/components/DomainActions'

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setIsLoading(true)
            const data = await domainService.getAll()
            setDomains(data)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao carregar itens.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await domainService.delete(Number(id))
            setDomains(prev => prev.filter(d => String(d.id) !== id))
            toast.success("Item removido!")
        } catch (error) {
            toast.error("Erro ao excluir item.")
        }
    }

    const handleEdit = (domain: any) => {
        router.push(`/dashboard/dominios/${domain.id}`)
    }

    const safeDomains = Array.isArray(domains) ? domains : [];

    const filteredDomains = safeDomains.filter(d =>
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.group?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Catálogo de Itens</h1>
                <Link href="/dashboard/dominios/novo">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" /> Novo Item
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Domínios / Bens</CardTitle>
                    <div className="pt-2">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar item ou categoria..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando catálogo...</div>
                    ) : filteredDomains.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum item cadastrado.
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[600px]">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr className="border-b">
                                        <th className="h-12 px-4 align-middle">Nome</th>
                                        <th className="h-12 px-4 align-middle">Categoria (Grupo)</th>
                                        <th className="h-12 px-4 align-middle">Descrição</th>
                                        <th className="h-12 px-4 align-middle text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDomains.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-blue-600" />
                                                {item.name}
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-secondary px-2 py-1 rounded text-xs font-semibold">
                                                    {item.group}
                                                </span>
                                            </td>
                                            <td className="p-4 text-muted-foreground truncate max-w-[200px]">
                                                {item.description || "-"}
                                            </td>
                                            <td className="p-4 text-right">
                                                <DomainActions
                                                    domain={item}
                                                    onDelete={handleDelete}
                                                    onEdit={handleEdit}
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