"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProducerForm } from "@/components/ProducerForm"
import { producerService } from "@/services/producerService"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProducerPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async (data: any) => {
        try {
            setIsLoading(true)

            // --- A FAXINA FINAL (Limpando Formatação e Datas) ---
            const payload = Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    if (value === "") return [key, null];
                    if ((key === 'cpf' || key === 'contact') && typeof value === 'string') return [key, value.replace(/\D/g, "")];
                    if (key === 'dateBirth' && typeof value === 'string') return [key, new Date(value).toISOString()];

                    // --- NOVO: LIMPEZA DA FAMÍLIA ---
                    if (key === 'familyMembers' && Array.isArray(value)) {
                        return [key, value.map((m: any) => ({
                            ...m,
                            age: Number(m.age),
                            income: Number(m.income)
                        }))];
                    }

                    return [key, value];
                })
            );

            console.log("📦 Payload Limpo (Só números):", payload)

            await producerService.create(payload)

            toast.success("Produtor cadastrado com sucesso!")
            router.push("/dashboard/produtores")

        } catch (error: any) {
            console.group("🚨 DETALHES DO ERRO 400 🚨");
            console.log("Status:", error.response?.status);
            console.log("Dados:", error.response?.data);
            console.groupEnd();

            const serverMessage = error.response?.data?.message;

            if (Array.isArray(serverMessage)) {
                toast.error(`Erro: ${serverMessage[0]}`);
            } else if (typeof serverMessage === 'string') {
                toast.error(`Erro: ${serverMessage}`);
            } else {
                toast.error("Erro ao cadastrar. Verifique o console.");
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/produtores">
                    <Button variant="outline" size="icon" title="Voltar">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Novo Produtor</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados Cadastrais</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProducerForm onSubmit={handleCreate} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    )
}