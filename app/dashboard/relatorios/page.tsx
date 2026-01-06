"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Search, Loader2, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { propertyService } from "@/services/propertyService"
import { producerService } from "@/services/producerService"
import { pdfService } from "@/services/pdfService"
import type { Property } from "@/types/property"
import type { Producer } from "@/types/producer"
import { toast } from "sonner"

export default function RelatoriosPage() {
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set())

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setIsLoading(true)

            // Busca paralela de propriedades e produtores
            const [propertiesData, producersData] = await Promise.all([propertyService.getAll(), producerService.getAll()])

            // Enriquece as propriedades com dados do produtor
            const enrichedProperties = propertiesData.map((prop) => {
                if (prop.producer) return prop

                const foundProducer = (producersData as Producer[]).find((p) => p.id === prop.idProducer)

                return {
                    ...prop,
                    producer: foundProducer ? { name: foundProducer.name, cpf: foundProducer.cpf } : undefined,
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

    const handleDownloadPdf = async (property: Property) => {
        try {
            // Adiciona o ID à lista de downloads em andamento
            setDownloadingIds((prev) => new Set(prev).add(property.id))

            const fileName = `relatorio_${property.productiveAreaName.replace(/\s+/g, "_")}.pdf`
            await pdfService.downloadPdf(property.id, fileName)

            toast.success(`PDF baixado com sucesso!`)
        } catch (error) {
            console.error("Erro ao baixar PDF:", error)
            toast.error("Erro ao gerar PDF. Verifique se todos os dados estão preenchidos.")
        } finally {
            // Remove o ID da lista de downloads em andamento
            setDownloadingIds((prev) => {
                const next = new Set(prev)
                next.delete(property.id)
                return next
            })
        }
    }

    const safeProperties = Array.isArray(properties) ? properties : []

    const filteredProperties = safeProperties.filter(
        (p) =>
            p.productiveAreaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.producer?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Relatórios PDF</h1>
                <p className="text-muted-foreground">Gere e baixe relatórios completos das propriedades cadastradas</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Propriedades Cadastradas</CardTitle>
                    <div className="pt-2">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por propriedade ou produtor..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                            <p className="mt-4 text-muted-foreground">Carregando propriedades...</p>
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">
                                {searchTerm ? "Nenhuma propriedade encontrada." : "Nenhuma propriedade cadastrada ainda."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredProperties.map((property) => {
                                const isDownloading = downloadingIds.has(property.id)

                                return (
                                    <div key={property.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-primary/10 rounded-lg">
                                                    <FileText className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-lg truncate">{property.productiveAreaName}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Produtor: {property.producer?.name || `ID: ${property.idProducer}`}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Área Total: {property.totalArea} ha • ID: {property.id}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleDownloadPdf(property)}
                                                disabled={isDownloading}
                                                className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"
                                            >
                                                {isDownloading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Gerando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Baixar PDF
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {filteredProperties.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900 dark:text-blue-100">
                                <p className="font-medium mb-1">Sobre os Relatórios</p>
                                <p className="text-blue-700 dark:text-blue-300">
                                    Os PDFs são gerados com todos os dados cadastrados da propriedade, incluindo informações do produtor,
                                    núcleo familiar, dados de infraestrutura, produção e domínios vinculados.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
