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
    const { id } = use(params)

    const [producerData, setProducerData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

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

                if (data.dateBirth) {
                    data.dateBirth = data.dateBirth.split("T")[0]
                }

                setProducerData(data)
            } catch (error) {
                console.error("Erro ao carregar:", error)
                toast.error("Erro ao carregar dados.")
                router.push("/dashboard/produtores")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) loadData()
    }, [id, router])

    const handleUpdate = async (data: any) => {
        try {
            setIsSaving(true)

            // O backend não tem endpoints separados para FamilyMember
            const { familyMembers, ...producerRaw } = data

            const producerPayload = {
                ...producerRaw,
                socialName: producerRaw.socialName || null,
                nickname: producerRaw.nickname || null,
                cpf: producerRaw.cpf.replace(/\D/g, ""),
                contact: producerRaw.contact.replace(/\D/g, ""),
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

            // A gestão de familyMembers será feita via endpoints separados que você criar no backend
            await producerService.update(id, producerPayload)

            if (familyMembers && familyMembers.length > 0) {
                const existingIds = producerData?.familyMembers?.map((m: any) => m.id) || []
                const currentIds = familyMembers.filter((m: any) => m.id).map((m: any) => m.id)

                // Identifica membros que foram deletados
                const deletedIds = existingIds.filter((id: number) => !currentIds.includes(id))

                console.log("[v0] Membros para deletar:", deletedIds)
                console.log("[v0] Membros atuais:", familyMembers)

                // TODO: Quando você criar o endpoint DELETE /family-members/:id no backend,
                // descomentar o código abaixo:
                /*
                        for (const memberId of deletedIds) {
                            await familyMemberService.delete(memberId);
                        }
                        
                        for (const member of familyMembers) {
                            const memberPayload = {
                                idProducer: Number(id),
                                name: member.name,
                                kinship: member.kinship,
                                age: member.age ? Number(member.age) : undefined,
                                sex: member.sex || undefined,
                                colorRace: member.colorRace || undefined,
                                schooling: member.schooling || undefined,
                                isPcd: !!member.isPcd,
                                observation: member.observation || undefined
                            };
        
                            if (member.id) {
                                await familyMemberService.update(member.id, memberPayload);
                            } else {
                                await familyMemberService.create(memberPayload);
                            }
                        }
                        */
            }

            toast.success("Produtor atualizado!")
            router.push("/dashboard/produtores")
        } catch (error: any) {
            console.error("Erro ao salvar:", error)
            const msg = error.response?.data?.message || "Erro ao salvar alterações."
            toast.error(typeof msg === "string" ? msg : msg[0])
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
                <Link href="/dashboard/produtores">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Editar Produtor</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Editar: {producerData?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {producerData && <ProducerForm initialData={producerData} onSubmit={handleUpdate} isLoading={isSaving} />}
                </CardContent>
            </Card>
        </div>
    )
}
