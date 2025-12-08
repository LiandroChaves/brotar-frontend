"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, MapPin } from "lucide-react"
import { producerService } from "@/services/producerService"
import { domainService } from "@/services/domainService"
import type { Producer } from "@/types/producer"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"
import dynamic from "next/dynamic"

const MapPicker = dynamic(() => import("./inputs/MapPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted flex items-center justify-center">Carregando mapa...</div>,
})

const formatarCPFSelect = (val: string) => {
    return val
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
}

const formSchema = z.object({
    idProducer: z.string().min(1, "Selecione um produtor"),
    productiveAreaName: z.string().min(3, "Nome obrigatório"),
    totalArea: z.union([z.string(), z.number()]),
    agriculturalArea: z.union([z.string(), z.number()]),
    productiveBackyardArea: z.union([z.string(), z.number()]),
    backyardType: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    timeOnProperty: z.string(),
    hasElectricity: z.boolean(),
    hasBathroom: z.boolean(),
    hasSepticTank: z.boolean(),
    hasGreyWaterTreatment: z.boolean(),
    greyWaterTreatmentDesc: z.string(),
    culturalTradition: z.string(),
    hasSchoolInCommunity: z.boolean(),
    schoolTransport: z.string(),
    visitedByHealthAgent: z.boolean(),
    visitedByEndemicAgent: z.boolean(),
    hasIrrigation: z.boolean(),
    hasOrganicCertification: z.boolean(),
    processingDistance: z.string(),
    accessedCredit: z.boolean(),
    creditDetail: z.string(),
    accessedMarket: z.boolean(),
    marketDetail: z.string(),
    hasFinancialManagement: z.boolean(),
    financialManagementDesc: z.string(),
    receivesTechSupport: z.boolean(),
    techSupportFrequency: z.string(),
    trainingAvailability: z.boolean(),
    technicalReport: z.string(),
    items: z.array(
        z.object({
            idDomain: z.string().min(1, "Selecione o item"),
            complement: z.string(),
            quantity: z.union([z.string(), z.number()]),
            isFunctioning: z.boolean(),
        }),
    ),
})

type FormValues = z.infer<typeof formSchema>

interface PropertyFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    isLoading?: boolean
}

export function PropertyForm({ initialData, onSubmit, isLoading }: PropertyFormProps) {
    const [producers, setProducers] = useState<Producer[]>([])

    // Tipando como any temporariamente pra aceitar tanto a estrutura da API quanto o Mock
    const [domains, setDomains] = useState<any[]>([])
    const [isMapOpen, setIsMapOpen] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idProducer: initialData?.idProducer ? String(initialData.idProducer) : "",
            productiveAreaName: initialData?.productiveAreaName || "",
            totalArea: initialData?.totalArea || 0,
            agriculturalArea: initialData?.agriculturalArea || 0,
            productiveBackyardArea: initialData?.productiveBackyardArea || 0,
            backyardType: initialData?.backyardType || "",
            latitude: initialData?.latitude || "",
            longitude: initialData?.longitude || "",
            timeOnProperty: initialData?.timeOnProperty || "",
            hasElectricity: !!initialData?.hasElectricity,
            hasBathroom: !!initialData?.hasBathroom,
            hasSepticTank: !!initialData?.hasSepticTank,
            hasGreyWaterTreatment: !!initialData?.hasGreyWaterTreatment,
            greyWaterTreatmentDesc: initialData?.greyWaterTreatmentDesc || "",
            culturalTradition: initialData?.culturalTradition || "",
            hasSchoolInCommunity: !!initialData?.hasSchoolInCommunity,
            schoolTransport: initialData?.schoolTransport || "",
            visitedByHealthAgent: !!initialData?.visitedByHealthAgent,
            visitedByEndemicAgent: !!initialData?.visitedByEndemicAgent,
            hasIrrigation: !!initialData?.hasIrrigation,
            hasOrganicCertification: !!initialData?.hasOrganicCertification,
            processingDistance: initialData?.processingDistance || "",
            accessedCredit: !!initialData?.accessedCredit,
            creditDetail: initialData?.creditDetail || "",
            accessedMarket: !!initialData?.accessedMarket,
            marketDetail: initialData?.marketDetail || "",
            hasFinancialManagement: !!initialData?.hasFinancialManagement,
            financialManagementDesc: initialData?.financialManagementDesc || "",
            receivesTechSupport: !!initialData?.receivesTechSupport,
            techSupportFrequency: initialData?.techSupportFrequency || "",
            trainingAvailability: !!initialData?.trainingAvailability,
            technicalReport: initialData?.technicalReport || "",
            items:
                initialData?.items?.map((item: any) => ({
                    idDomain: String(item.idDomain),
                    complement: item.complement || "",
                    quantity: item.quantity || 1,
                    isFunctioning: !!item.isFunctioning,
                })) || [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    })

    useEffect(() => {
        const loadAuxData = async () => {
            try {
                const [prods, doms] = await Promise.all([producerService.getAll(), domainService.getAll()])
                setProducers(Array.isArray(prods) ? prods : [])

                // LÓGICA DE FALLBACK: Se o banco tiver vazio, usa dados de teste
                if (!doms || doms.length === 0) {
                    console.warn("⚠️ API vazia. Usando Mock de Domínios.")
                    setDomains([
                        { id: 1, name: "Cisterna de Placa", group: "INFRAESTRUTURA" },
                        { id: 2, name: "Trator", group: "MAQUINAS" },
                        { id: 3, name: "Enxada", group: "FERRAMENTAS" },
                    ])
                } else {
                    setDomains(Array.isArray(doms) ? doms : [])
                }
            } catch (error) {
                console.error("Erro ao carregar", error)
            }
        }
        loadAuxData()
    }, [])

    const handleSubmit = (data: FormValues) => {
        const payload = {
            ...data,
            idProducer: Number(data.idProducer),
            totalArea: Number(data.totalArea),
            agriculturalArea: Number(data.agriculturalArea),
            productiveBackyardArea: Number(data.productiveBackyardArea),
            backyardType: data.backyardType || null,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            timeOnProperty: data.timeOnProperty || null,
            greyWaterTreatmentDesc: data.greyWaterTreatmentDesc || null,
            culturalTradition: data.culturalTradition || null,
            schoolTransport: data.schoolTransport || null,
            processingDistance: data.processingDistance || null,
            creditDetail: data.creditDetail || null,
            marketDetail: data.marketDetail || null,
            financialManagementDesc: data.financialManagementDesc || null,
            techSupportFrequency: data.techSupportFrequency || null,
            technicalReport: data.technicalReport || null,
            items: data.items.map((item) => ({
                ...item,
                idDomain: Number(item.idDomain),
                quantity: Number(item.quantity),
            })),
        }
        onSubmit(payload)
    }

    const handleMapSelect = (lat: string, lng: string) => {
        form.setValue("latitude", lat)
        form.setValue("longitude", lng)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="geral" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="geral">Geral</TabsTrigger>
                        <TabsTrigger value="classificacoes">Classificações</TabsTrigger>
                        <TabsTrigger value="agua">Água & Saneamento</TabsTrigger>
                        <TabsTrigger value="producao">Produção & Manejo</TabsTrigger>
                        <TabsTrigger value="gestao">Gestão & Técnica</TabsTrigger>
                        <TabsTrigger value="items">Itens (Bens)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="geral" className="space-y-4 py-4">
                        <Card>
                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="idProducer"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>Produtor (Dono da Terra)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {producers.map((p) => (
                                                        <SelectItem key={p.id} value={String(p.id)}>
                                                            {p.name} (CPF: {formatarCPFSelect(p.cpf)})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="productiveAreaName"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>Nome da Propriedade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Sítio Canto Verde" {...field} value={field.value ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="totalArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Área Total (ha)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} value={field.value} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="agriculturalArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Área Agrícola (ha)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} value={field.value} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="productiveBackyardArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quintal Produtivo (ha)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} value={field.value} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="col-span-1 md:col-span-2 border rounded-md p-4 bg-muted/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Localização (GPS)
                                        </label>
                                        <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="outline" size="sm" className="gap-2 bg-transparent">
                                                    <MapPin className="h-4 w-4" /> Selecionar no Mapa
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                                                <DialogHeader className="p-4 pb-0">
                                                    <DialogTitle>Selecione a Localização</DialogTitle>
                                                    <DialogDescription>Clique no mapa para marcar o ponto.</DialogDescription>
                                                </DialogHeader>
                                                <div className="p-4">
                                                    <MapPicker
                                                        initialLat={form.getValues("latitude")}
                                                        initialLng={form.getValues("longitude")}
                                                        onSelect={handleMapSelect}
                                                    />
                                                    <div className="flex justify-end mt-4">
                                                        <Button onClick={() => setIsMapOpen(false)}>Confirmar</Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="latitude"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Latitude</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="longitude"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Longitude</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="classificacoes" className="space-y-4 py-4">
                        <Card>
                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-muted-foreground">Ocupação da Casa</h3>
                                    <FormField
                                        control={form.control}
                                        name="culturalTradition"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Festa/Tradição Cultural</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Descreva..." {...field} value={field.value ?? ""} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-muted-foreground">Tipo de Habitação</h3>
                                    <FormField
                                        control={form.control}
                                        name="backyardType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Quintal</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Individual, Coletivo, etc" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="agua" className="space-y-4 py-4">
                        <Card>
                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-muted-foreground">Infraestrutura de Água</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="hasBathroom"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Banheiro</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasSepticTank"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Fossa Séptica</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-muted-foreground">Tratamento de Água</h3>
                                    <FormField
                                        control={form.control}
                                        name="hasGreyWaterTreatment"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Tratamento de Água Cinza</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="greyWaterTreatmentDesc"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição do Tratamento</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Descreva o tipo..." {...field} value={field.value ?? ""} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="producao" className="space-y-4 py-4">
                        <Card>
                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-muted-foreground">Produção</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="hasIrrigation"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Possui Irrigação</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasOrganicCertification"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Certificação Orgânica</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-muted-foreground">Beneficiamento</h3>
                                    <FormField
                                        control={form.control}
                                        name="processingDistance"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Distância do Beneficiamento</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Km ou descrição..." {...field} value={field.value ?? ""} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="gestao" className="space-y-4 py-4">
                        <Card>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm text-muted-foreground">Energia & Social</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="hasElectricity"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormLabel>Energia Elétrica</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="hasSchoolInCommunity"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormLabel>Escola na Comunidade</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="schoolTransport"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Deslocamento Escolar</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Descrição..." {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm text-muted-foreground">Assistência & Saúde</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="visitedByHealthAgent"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormLabel>Visitado por Agente de Saúde</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="visitedByEndemicAgent"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormLabel>Visitado por Agente de Endemias</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="receivesTechSupport"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormLabel>Recebe Assistência Técnica</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm text-muted-foreground">Crédito & Mercado</h3>
                                        <FormField
                                            control={form.control}
                                            name="accessedCredit"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Acessou Crédito Rural</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="creditDetail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Detalhes do Crédito</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Tipo, valor, etc..." {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="accessedMarket"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Acessou Mercado Institucional</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="marketDetail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Detalhes do Mercado</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Tipo de mercado, produtos..." {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm text-muted-foreground">Gestão & Treinamento</h3>
                                        <FormField
                                            control={form.control}
                                            name="hasFinancialManagement"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Gestão Financeira</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="financialManagementDesc"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Descrição</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Como é feita..." {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="trainingAvailability"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Disponibilidade para Cursos</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="techSupportFrequency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Frequência de Suporte</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Mensal, semanal, etc..." {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-muted-foreground">Observações Técnicas</h3>
                                    <FormField
                                        control={form.control}
                                        name="technicalReport"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Relatório Técnico</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Observações técnicas, recomendações, etc..."
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        className="min-h-[120px]"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="timeOnProperty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tempo na Propriedade</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Anos ou descrição..." {...field} value={field.value ?? ""} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="items" className="space-y-4 py-4">
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ idDomain: "", quantity: 1, isFunctioning: true, complement: "" })}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                        <div className="md:col-span-4">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.idDomain`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Item</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {domains.map((d) => (
                                                                    <SelectItem key={d.id} value={String(d.id)}>
                                                                        {d.name} ({d.group})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.complement`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Detalhe</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value ?? ""} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Qtd.</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} value={field.value} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex items-center h-10">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.isFunctioning`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormLabel className="text-xs">Funcionando?</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {fields.length === 0 && (
                                <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">
                                    Nenhum item adicionado.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={isLoading}>
                        {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Cadastrar"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
