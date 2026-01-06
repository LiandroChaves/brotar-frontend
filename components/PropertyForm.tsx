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
    electricityType: z.string(),
    hasBathroom: z.boolean(),
    hasSepticTank: z.boolean(),
    hasGreyWaterTreatment: z.boolean(),
    greyWaterTreatmentDesc: z.string(),
    usesWaterTruck: z.boolean(),
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
    incomeRange: z.string(),
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
            electricityType: initialData?.electricityType || "",
            hasBathroom: !!initialData?.hasBathroom,
            hasSepticTank: !!initialData?.hasSepticTank,
            hasGreyWaterTreatment: !!initialData?.hasGreyWaterTreatment,
            greyWaterTreatmentDesc: initialData?.greyWaterTreatmentDesc || "",
            usesWaterTruck: !!initialData?.usesWaterTruck,
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
            incomeRange: initialData?.incomeRange || "",
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
        const formatted = {
            idProducer: Number(data.idProducer),
            productiveAreaName: data.productiveAreaName || null,
            totalArea: Number(data.totalArea) || null,
            agriculturalArea: Number(data.agriculturalArea) || null,
            productiveBackyardArea: Number(data.productiveBackyardArea) || null,
            backyardType: data.backyardType || null,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            hasElectricity: data.hasElectricity,
            electricityType: data.electricityType || null,
            hasBathroom: data.hasBathroom,
            hasSepticTank: data.hasSepticTank,
            hasGreyWaterTreatment: data.hasGreyWaterTreatment,
            timeOnProperty: data.timeOnProperty || null,
            greyWaterTreatmentDesc: data.greyWaterTreatmentDesc || null,
            usesWaterTruck: data.usesWaterTruck,
            culturalTradition: data.culturalTradition || null,
            hasSchoolInCommunity: data.hasSchoolInCommunity,
            schoolTransport: data.schoolTransport || null,
            visitedByHealthAgent: data.visitedByHealthAgent,
            visitedByEndemicAgent: data.visitedByEndemicAgent,
            hasIrrigation: data.hasIrrigation,
            hasOrganicCertification: data.hasOrganicCertification,
            processingDistance: data.processingDistance || null,
            accessedCredit: data.accessedCredit,
            creditDetail: data.creditDetail || null,
            accessedMarket: data.accessedMarket,
            marketDetail: data.marketDetail || null,
            hasFinancialManagement: data.hasFinancialManagement,
            financialManagementDesc: data.financialManagementDesc || null,
            incomeRange: data.incomeRange || null,
            receivesTechSupport: data.receivesTechSupport,
            techSupportFrequency: data.techSupportFrequency || null,
            trainingAvailability: data.trainingAvailability,
            technicalReport: data.technicalReport || null,
            items: data.items.map((item) => ({
                idDomain: Number(item.idDomain),
                complement: item.complement || null,
                quantity: Number(item.quantity) || null,
                isFunctioning: item.isFunctioning,
            })),
        }
        onSubmit(formatted)
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
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="hasElectricity"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="leading-none">
                                                    <FormLabel>Possui Energia Elétrica?</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="electricityType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Eletricidade</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Monofásica, Trifásica" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="hasBathroom"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="leading-none">
                                                    <FormLabel>Tem Banheiro em Casa?</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="hasSepticTank"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="leading-none">
                                                    <FormLabel>Tem Fossa Séptica?</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="hasGreyWaterTreatment"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="leading-none">
                                                    <FormLabel>Tratamento Águas Cinzas?</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="greyWaterTreatmentDesc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição do Tratamento (Águas Cinzas)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Filtro de areia..." {...field} value={field.value ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="usesWaterTruck"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="leading-none">
                                                <FormLabel>Usa Carro Pipa (Cisterna)?</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
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
                                <FormField
                                    control={form.control}
                                    name="incomeRange"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Faixa de Renda Familiar</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a faixa de renda" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Até 1 SM">Até 1 SM</SelectItem>
                                                    <SelectItem value="1 a 3 SM">1 a 3 SM</SelectItem>
                                                    <SelectItem value="3 a 5 SM">3 a 5 SM</SelectItem>
                                                    <SelectItem value="Acima de 5 SM">Acima de 5 SM</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="accessedCredit"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="leading-none">
                                                    <FormLabel>Acessou Crédito?</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="creditDetail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Qual Crédito?</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: PRONAF" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="hasElectricity"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="!mt-0">Possui Energia Elétrica</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    {/*  Adicionado campo Tipo de Energia Elétrica */}
                                    <FormField
                                        control={form.control}
                                        name="electricityType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Energia Elétrica</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Monofásica">Monofásica</SelectItem>
                                                        <SelectItem value="Bifásica">Bifásica</SelectItem>
                                                        <SelectItem value="Trifásica">Trifásica</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hasBathroom"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="!mt-0">Possui Banheiro</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm text-muted-foreground">Energia & Social</h3>
                                        <div className="grid grid-cols-1 gap-3">
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
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel className="!mt-0">Gestão Financeira</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="financialManagementDesc"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Descrição da Gestão</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Qual?" {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/*  Adicionado campo Faixa de Renda */}
                                        <FormField
                                            control={form.control}
                                            name="incomeRange"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Faixa de Renda Familiar</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Até 1 SM">Até 1 SM</SelectItem>
                                                            <SelectItem value="1 a 3 SM">1 a 3 SM</SelectItem>
                                                            <SelectItem value="3 a 5 SM">3 a 5 SM</SelectItem>
                                                            <SelectItem value="Acima de 5 SM">Acima de 5 SM</SelectItem>
                                                        </SelectContent>
                                                    </Select>
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
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-sm text-muted-foreground">Itens (Bens)</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 bg-transparent"
                                        onClick={() =>
                                            append({
                                                idDomain: "",
                                                complement: "",
                                                quantity: 1,
                                                isFunctioning: true,
                                            })
                                        }
                                    >
                                        <Plus className="h-4 w-4" /> Adicionar Item
                                    </Button>
                                </div>
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border rounded-md p-4 bg-muted/10"
                                    >
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.idDomain`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-1 md:col-span-2">
                                                    <FormLabel>Item</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione o item..." />
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
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.quantity`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantidade</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min={1} {...field} value={field.value} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.isFunctioning`}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-center space-x-2 space-y-0 pt-2">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Em funcionamento?</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.complement`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-1 md:col-span-3">
                                                    <FormLabel>Complemento/Observação</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: Cor, modelo, etc." {...field} value={field.value ?? ""} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="col-span-1 md:col-span-1 flex items-center justify-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar Propriedade"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
