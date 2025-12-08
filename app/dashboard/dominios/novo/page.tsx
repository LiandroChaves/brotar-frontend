"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DomainForm } from "@/components/DomainForm" // Aquele form simples que a gente fez antes
import { domainService } from "@/services/domainService"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewDomainPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async (data: any) => {
        try {
            setIsLoading(true)
            await domainService.create(data)
            toast.success("Item cadastrado com sucesso!")
            router.push("/dashboard/dominios")
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Erro ao cadastrar item.";
            toast.error(typeof msg === 'string' ? msg : msg[0]);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/dominios">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Novo Item do Catálogo</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Item</CardTitle>
                </CardHeader>
                <CardContent>
                    <DomainForm onSubmit={handleCreate} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    )
}