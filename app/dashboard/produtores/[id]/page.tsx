"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ProducerForm } from "@/components/ProducerForm"
import { producerService } from "@/services/producerService"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProducerPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params) // Desembrulhando a Promise do ID

    const [producer, setProducer] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // 1. Carrega os dados
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const data = await producerService.getById(id)

                if (!data) {
                    toast.error("Produtor não encontrado.")
                    router.push("/dashboard/produtores")
                    return
                }

                // AJUSTE FINO: Se a data vier ISO do banco, corta pra YYYY-MM-DD pro input entender
                if (data.dateBirth) {
                    data.dateBirth = data.dateBirth.split("T")[0];
                }

                setProducer(data)
            } catch (error) {
                console.error("Erro ao carregar:", error)
                toast.error("Erro ao carregar dados do produtor.")
                router.push("/dashboard/produtores")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            loadData()
        }
    }, [id, router])

    // 2. Função de submit (COM A FAXINA)
    const handleUpdate = async (data: any) => {
        try {
            setIsSaving(true)

            // --- AQUI É A NOVIDADE: LIMPEZA DOS DADOS ---
            const payload = Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    // 1. Vazio vira null
                    if (value === "") return [key, null];

                    // 2. Remove pontuação de CPF e Contato
                    if ((key === 'cpf' || key === 'contact') && typeof value === 'string') {
                        return [key, value.replace(/\D/g, "")];
                    }

                    // 3. Converte data pra ISO
                    if (key === 'dateBirth' && typeof value === 'string') {
                        return [key, new Date(value).toISOString()];
                    }

                    return [key, value];
                })
            );

            console.log("📦 Payload Editado Limpo:", payload)

            await producerService.update(id, payload)

            toast.success("Produtor atualizado com sucesso!")
            router.push("/dashboard/produtores")
        } catch (error: any) {
            console.error("Erro ao salvar:", error)

            // Tratamento de erro detalhado
            const serverMessage = error.response?.data?.message;
            if (Array.isArray(serverMessage)) {
                toast.error(`Erro: ${serverMessage[0]}`);
            } else if (typeof serverMessage === 'string') {
                toast.error(`Erro: ${serverMessage}`);
            } else {
                toast.error("Erro ao salvar alterações.");
            }
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-muted-foreground animate-pulse">Carregando dados...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/produtores">
                    <Button variant="outline" size="icon" title="Voltar">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Editar Produtor</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Editar Cadastro: {producer?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {producer && (
                        <ProducerForm
                            initialData={producer}
                            onSubmit={handleUpdate}
                            isLoading={isSaving}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}