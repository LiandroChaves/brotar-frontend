"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PropertyForm } from "@/components/PropertyForm"
import { propertyService } from "@/services/propertyService"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPropertyPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async (data: any) => {
        try {
            setIsLoading(true)
            await propertyService.create(data)
            toast.success("Propriedade criada com sucesso!")
            router.push("/dashboard/propriedades")
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Erro ao criar propriedade.";
            toast.error(typeof msg === 'string' ? msg : msg[0]);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/propriedades">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Nova Propriedade</h1>
            </div>

            {/* O form já tem Card interno se precisar, ou envolve num Card aqui */}
            <PropertyForm onSubmit={handleCreate} isLoading={isLoading} />
        </div>
    )
}