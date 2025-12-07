"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, MapPin, Tractor } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { propertyService } from '@/services/propertyService'
import { producerService } from '@/services/producerService'
import { Property } from '@/types/property'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PropertyActions } from '@/components/PropertyActions' // Import novo
import { Producer } from '@/types/producer'

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setIsLoading(true)

            // BUSCA PARALELA: Carrega Propriedades E Produtores ao mesmo tempo
            const [propertiesData, producersData] = await Promise.all([
                propertyService.getAll(),
                producerService.getAll()
            ])

            // --- O PULO DO GATO (JOIN MANUAL) ---
            // Se o backend não mandou o nome do produtor, a gente procura na lista de produtores
            const enrichedProperties = propertiesData.map((prop) => {
                // Se já veio com produtor, mantém
                if (prop.producer) return prop;

                // Se não, procura pelo ID
                const foundProducer = (producersData as Producer[]).find(p => p.id === prop.idProducer);

                // Retorna a propriedade com o objeto producer "injetado"
                return {
                    ...prop,
                    producer: foundProducer ? { name: foundProducer.name, cpf: foundProducer.cpf } : undefined
                }
            })

            setProperties(enrichedProperties as Property[])
        } catch (error) {
            console.error("Erro ao carregar dados", error)
            toast.error("Erro ao carregar lista de propriedades.")
        } finally {
            setIsLoading(false)
        }
    }

    // --- AÇÕES ---
    const handleDelete = async (id: string | number) => {
        try {
            // Converte pra number pra mandar pro backend (se ele esperar number)
            await propertyService.delete(Number(id))

            // ATUALIZA A LISTA VISUALMENTE
            // O segredo: String(p.id) !== String(id)
            // Assim garantimos que "5" == "5" ou 5 == 5
            setProperties(prev => prev.filter(p => String(p.id) !== String(id)))

            toast.success("Propriedade removida!")
        } catch (error) {
            console.error(error)
            toast.error("Erro ao excluir propriedade.")
        }
    }

    const handleEdit = (property: any) => {
        router.push(`/dashboard/propriedades/${property.id}`)
    }

    const safeProperties = Array.isArray(properties) ? properties : [];

    const filteredProperties = safeProperties.filter(p =>
        p.productiveAreaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.producer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Propriedades</h1>
                <Link href="/dashboard/propriedades/novo">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" /> Nova Propriedade
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listagem de Áreas</CardTitle>
                    <div className="pt-2">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome do sítio ou produtor..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando terras...</div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhuma propriedade encontrada.
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[600px]">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr className="border-b">
                                        <th className="h-12 px-4 align-middle">Nome da Área</th>
                                        <th className="h-12 px-4 align-middle">Produtor (Dono)</th>
                                        <th className="h-12 px-4 align-middle">Área Total</th>
                                        <th className="h-12 px-4 align-middle text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProperties.map((prop) => (
                                        <tr key={prop.id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium flex items-center gap-2">
                                                <Tractor className="h-4 w-4 text-emerald-600" />
                                                {prop.productiveAreaName}
                                            </td>
                                            <td className="p-4">
                                                {prop.producer?.name || `ID: ${prop.idProducer}`}
                                            </td>
                                            <td className="p-4">
                                                {prop.totalArea} ha
                                            </td>
                                            <td className="p-4 text-right">
                                                {/* Componente de Ações inserido */}
                                                <PropertyActions
                                                    property={prop}
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