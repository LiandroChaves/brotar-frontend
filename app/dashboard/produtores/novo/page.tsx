"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProducerForm } from "@/components/ProducerForm"
import { producerService } from "@/services/producerService"
import { familyMemberService } from "@/services/familyMemberService"
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

            const { familyMembers, ...producerRaw } = data

            const producerPayload = {
                ...producerRaw,
                socialName: producerRaw.socialName || null,
                nickname: producerRaw.nickname || null,
                cpf: producerRaw.cpf?.replace(/\D/g, ""),
                contact: producerRaw.contact?.replace(/\D/g, ""),
                dateBirth: producerRaw.dateBirth ? new Date(producerRaw.dateBirth).toISOString() : null,
                rg: producerRaw.rg || null,
                civilState: producerRaw.civilState || null,
                colorRace: producerRaw.colorRace || null,
                ethnicity: producerRaw.ethnicity || null,
                naturalness: producerRaw.naturalness || null,
                personalAddress: producerRaw.personalAddress || null,
                community: producerRaw.community || null,
                cadUnique: producerRaw.cadUnique || null,
                nis: producerRaw.nis || null,
                caf: producerRaw.caf || null,
                schooling: producerRaw.schooling || null,
                pcdDescription: producerRaw.pcdDescription || null,
            }

            const newProducer = await producerService.create(producerPayload)

            if (familyMembers && familyMembers.length > 0) {
                for (const member of familyMembers) {
                    const memberPayload = {
                        idProducer: newProducer.id,
                        name: member.name,
                        kinship: member.kinship,
                        age: member.age ? Number(member.age) : undefined,
                        sex: member.sex || undefined,
                        colorRace: member.colorRace || undefined,
                        schooling: member.schooling || undefined,
                        isPcd: !!member.isPcd,
                        pcdDescription: member.pcdDescription || "Nenhuma",
                        observation: member.observation || "",
                    }

                    await familyMemberService.create(memberPayload)
                }
            }

            toast.success("Produtor cadastrado com sucesso!")
            router.push("/dashboard/produtores")
        } catch (error: any) {
            console.error("Erro ao cadastrar:", error)

            const serverMessage = error.response?.data?.message

            if (Array.isArray(serverMessage)) {
                toast.error(`Erro: ${serverMessage[0]}`)
            } else if (typeof serverMessage === "string") {
                toast.error(`Erro: ${serverMessage}`)
            } else {
                toast.error("Erro ao cadastrar. Verifique o console.")
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
