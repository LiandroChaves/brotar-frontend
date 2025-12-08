"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { PropertyForm } from "@/components/PropertyForm"
import { propertyService } from "@/services/propertyService"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params) // Next.js 15 unwrap

    const [propertyData, setPropertyData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const data = await propertyService.getById(id)
                if (!data) {
                    toast.error("Propriedade não encontrada")
                    router.push("/dashboard/propriedades")
                    return
                }
                setPropertyData(data)
            } catch (error) {
                console.error(error)
                toast.error("Erro ao carregar dados")
                router.push("/dashboard/propriedades")
            } finally {
                setIsLoading(false)
            }
        }
        if (id) loadData()
    }, [id, router])

    const handleUpdate = async (data: any) => {
        try {
            setIsSaving(true)

            // --- FAXINA DOS DADOS (Crucial para o backend aceitar) ---
            const payload = {
                ...data,
                idProducer: Number(data.idProducer),
                totalArea: Number(data.totalArea),
                agriculturalArea: Number(data.agriculturalArea),
                productiveBackyardArea: Number(data.productiveBackyardArea),

                // Limpeza de opcionais (Vazio "" vira null)
                backyardType: data.backyardType || null,
                latitude: data.latitude || null,
                longitude: data.longitude || null,
                timeOnProperty: data.timeOnProperty || null,
                greyWaterTreatmentDesc: data.greyWaterTreatmentDesc || null,
                culturalTradition: data.culturalTradition || null,
                schoolTransport: data.schoolTransport || null,
                creditDetail: data.creditDetail || null,
                marketDetail: data.marketDetail || null,
                financialManagementDesc: data.financialManagementDesc || null,
                techSupportFrequency: data.techSupportFrequency || null,
                technicalReport: data.technicalReport || null,

                // Itens também precisam de conversão
                items: data.items.map((item: any) => ({
                    ...item,
                    idDomain: Number(item.idDomain),
                    quantity: Number(item.quantity)
                }))
            }

            console.log("📦 Payload Atualizado:", payload)

            await propertyService.update(id, payload)

            toast.success("Propriedade atualizada!")
            router.push("/dashboard/propriedades")
        } catch (error: any) {
            console.error("Erro ao atualizar:", error)
            const msg = error.response?.data?.message || "Erro ao salvar.";
            toast.error(typeof msg === 'string' ? msg : msg[0]);
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex h-[50vh] items-center justify-center animate-pulse">Carregando dados...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/propriedades">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Editar Propriedade</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{propertyData?.productiveAreaName}</CardTitle>
                </CardHeader>
                <CardContent>
                    <PropertyForm
                        initialData={propertyData}
                        onSubmit={handleUpdate}
                        isLoading={isSaving}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
