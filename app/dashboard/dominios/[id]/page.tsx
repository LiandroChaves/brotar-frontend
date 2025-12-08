"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { DomainForm } from "@/components/DomainForm"
import { domainService } from "@/services/domainService"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditDomainPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params) // Next.js 15 unwrap

    const [domainData, setDomainData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const data = await domainService.getById(id)
                if (!data) {
                    toast.error("Item não encontrado")
                    router.push("/dashboard/dominios")
                    return
                }
                setDomainData(data)
            } catch (error) {
                console.error(error)
                toast.error("Erro ao carregar dados")
                router.push("/dashboard/dominios")
            } finally {
                setIsLoading(false)
            }
        }
        if (id) loadData()
    }, [id, router])

    const handleUpdate = async (data: any) => {
        try {
            setIsSaving(true)
            await domainService.update(id, data)
            toast.success("Item atualizado!")
            router.push("/dashboard/dominios")
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Erro ao salvar.";
            toast.error(typeof msg === 'string' ? msg : msg[0]);
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex h-[50vh] items-center justify-center animate-pulse">Carregando...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/dominios">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Editar Item</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{domainData?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <DomainForm
                        initialData={domainData}
                        onSubmit={handleUpdate}
                        isLoading={isSaving}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
