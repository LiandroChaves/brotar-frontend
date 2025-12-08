"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// --- NOVOS IMPORTS (Abas e Cards) ---
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Users, User } from "lucide-react"

// --- HELPERS ---
const maskCPF = (value: string) =>
    value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
const maskPhone = (value: string) =>
    value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d)(\d{4})$/, "$1-$2")
        .substr(0, 15)

// --- SCHEMA ---
const formSchema = z.object({
    // Dados do Produtor
    name: z.string().min(2, "Nome é obrigatório"),
    socialName: z.string().optional(),
    nickname: z.string().optional(),
    dateBirth: z.string().optional(),
    cpf: z.string().min(14, "CPF incompleto"),
    rg: z.string().optional(),
    civilState: z.string().optional(),
    colorRace: z.string().optional(),
    ethnicity: z.string().optional(),
    naturalness: z.string().optional(),
    contact: z.string().min(14, "Telefone incompleto"),
    personalAddress: z.string().optional(),
    community: z.string().optional(),
    municipality: z.string().optional(),
    state: z.string().optional(),
    cadUnique: z.string().optional(),
    nis: z.string().optional(),
    caf: z.string().optional(),
    schooling: z.string().optional(),
    isRetired: z.boolean().optional(),
    isPcd: z.boolean().optional(),
    pcdDescription: z.string().optional(),

    // --- GRUPO FAMILIAR ---
    // IMPORTANTE: z.union([z.string(), z.number()]) permite que o campo aceite
    // string vazia durante a digitação e número vindo do banco, sem travar o formulário.
    familyMembers: z
        .array(
            z.object({
                id: z.number().optional(), // ID opcional para saber se é edição ou criação
                name: z.string().min(2, "Nome obrigatório"),
                kinship: z.string().min(1, "Parentesco obrigatório"),
                age: z.union([z.string(), z.number()]).optional(),
                sex: z.string().optional(),
                colorRace: z.string().optional(),
                schooling: z.string().optional(),
                isPcd: z.boolean().optional(),
                observation: z.string().optional(),
            }),
        )
        .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ProducerFormProps {
    initialData?: any
    onSubmit: (data: any) => void // Mudamos para 'any' para flexibilizar a saída tratada
    isLoading?: boolean
}

// Helper function to apply masks to values from backend
const applyMasks = (data: any) => {
    if (!data) return data

    return {
        ...data,
        cpf: data.cpf ? maskCPF(data.cpf) : "",
        contact: data.contact ? maskPhone(data.contact) : "",
    }
}

export function ProducerForm({ initialData, onSubmit, isLoading = false }: ProducerFormProps) {
    const maskedInitialData = applyMasks(initialData)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: maskedInitialData?.name || "",
            socialName: maskedInitialData?.socialName || "",
            nickname: maskedInitialData?.nickname || "",
            dateBirth: maskedInitialData?.dateBirth || "",
            cpf: maskedInitialData?.cpf || "",
            rg: maskedInitialData?.rg || "",
            civilState: maskedInitialData?.civilState || "",
            colorRace: maskedInitialData?.colorRace || "",
            ethnicity: maskedInitialData?.ethnicity || "",
            naturalness: maskedInitialData?.naturalness || "",
            contact: maskedInitialData?.contact || "",
            personalAddress: maskedInitialData?.personalAddress || "",
            community: maskedInitialData?.community || "",
            municipality: maskedInitialData?.municipality || "Limoeiro do Norte",
            state: maskedInitialData?.state || "CE",
            cadUnique: maskedInitialData?.cadUnique || "",
            nis: maskedInitialData?.nis || "",
            caf: maskedInitialData?.caf || "",
            schooling: maskedInitialData?.schooling || "",
            isRetired: !!maskedInitialData?.isRetired,
            isPcd: !!maskedInitialData?.isPcd,
            pcdDescription: maskedInitialData?.pcdDescription || "",

            // Mapeamento inicial da família
            familyMembers:
                maskedInitialData?.familyMembers?.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    kinship: m.kinship,
                    age: m.age ?? "",
                    sex: m.sex || "",
                    colorRace: m.colorRace || "",
                    schooling: m.schooling || "",
                    isPcd: !!m.isPcd,
                    observation: m.observation || "",
                })) || [],
        },
    })

    // Hook do Array Dinâmico
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "familyMembers",
    })

    const isPcdValue = form.watch("isPcd")

    useEffect(() => {
        if (initialData) {
            const maskedData = applyMasks(initialData)
            form.reset({
                name: maskedData?.name || "",
                socialName: maskedData?.socialName || "",
                nickname: maskedData?.nickname || "",
                dateBirth: maskedData?.dateBirth || "",
                cpf: maskedData?.cpf || "",
                rg: maskedData?.rg || "",
                civilState: maskedData?.civilState || "",
                colorRace: maskedData?.colorRace || "",
                ethnicity: maskedData?.ethnicity || "",
                naturalness: maskedData?.naturalness || "",
                contact: maskedData?.contact || "",
                personalAddress: maskedData?.personalAddress || "",
                community: maskedData?.community || "",
                municipality: maskedData?.municipality || "Limoeiro do Norte",
                state: maskedData?.state || "CE",
                cadUnique: maskedData?.cadUnique || "",
                nis: maskedData?.nis || "",
                caf: maskedData?.caf || "",
                schooling: maskedData?.schooling || "",
                isRetired: !!maskedData?.isRetired,
                isPcd: !!maskedData?.isPcd,
                pcdDescription: maskedData?.pcdDescription || "",
                familyMembers:
                    initialData.familyMembers?.map((m: any) => ({
                        id: m.id,
                        name: m.name,
                        kinship: m.kinship,
                        age: m.age ?? "",
                        sex: m.sex || "",
                        colorRace: m.colorRace || "",
                        schooling: m.schooling || "",
                        isPcd: !!m.isPcd,
                        observation: m.observation || "",
                    })) || [],
            })
        }
    }, [initialData, form])

    const handleSubmit = (data: FormValues) => {
        // PREPARAÇÃO DOS DADOS (O pulo do gato para tabelas separadas)
        // Aqui garantimos que os números sejam números de verdade antes de subir
        const payload = {
            ...data,
            familyMembers:
                data.familyMembers?.map((m) => ({
                    ...m,
                    age: m.age ? Number(m.age) : null,
                    // Mantemos o resto como está
                })) || [],
        }
        onSubmit(payload)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {/* SISTEMA DE ABAS */}
                <Tabs defaultValue="dados" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="dados" className="flex gap-2">
                            <User className="h-4 w-4" /> Dados do Produtor
                        </TabsTrigger>
                        <TabsTrigger value="familia" className="flex gap-2">
                            <Users className="h-4 w-4" /> Grupo Familiar
                        </TabsTrigger>
                    </TabsList>

                    {/* --- ABA 1: DADOS (Seu código original preservado) --- */}
                    <TabsContent value="dados" className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Identificação Pessoal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>Nome Completo *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Maria da Silva" {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socialName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome Social</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nickname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apelido</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nome de referência/conhecimento"
                                                    {...field}
                                                    value={(field.value as string) ?? ""}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cpf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="000.000.000-00"
                                                    {...field}
                                                    value={(field.value as string) ?? ""}
                                                    onChange={(e) => {
                                                        const masked = maskCPF(e.target.value)
                                                        field.onChange(masked)
                                                    }}
                                                    maxLength={14}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rg"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>RG</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dateBirth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Nascimento</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="civilState"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado Civil</FormLabel>
                                            <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                                                    <SelectItem value="Casado">Casado(a)</SelectItem>
                                                    <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                                                    <SelectItem value="Viuvo">Viúvo(a)</SelectItem>
                                                    <SelectItem value="UniaoEstavel">União Estável</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="colorRace"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cor/Raça</FormLabel>
                                            <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Branca">Branca</SelectItem>
                                                    <SelectItem value="Preta">Preta</SelectItem>
                                                    <SelectItem value="Parda">Parda</SelectItem>
                                                    <SelectItem value="Amarela">Amarela</SelectItem>
                                                    <SelectItem value="Indigena">Indígena</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ethnicity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Etnia</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="naturalness"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Naturalidade</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Contato e Localização</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Celular / WhatsApp *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="(88) 99999-9999"
                                                    {...field}
                                                    value={(field.value as string) ?? ""}
                                                    onChange={(e) => {
                                                        const masked = maskPhone(e.target.value)
                                                        field.onChange(masked)
                                                    }}
                                                    maxLength={15}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalAddress"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>Endereço Residencial</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="community"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Comunidade / Sítio</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="municipality"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Município</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>UF</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} maxLength={2} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Dados Sociais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nis"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>NIS</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cadUnique"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CadÚnico</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="caf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CAF</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="schooling"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Escolaridade</FormLabel>
                                            <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Nao Alfabetizado">Não Alfabetizado</SelectItem>
                                                    <SelectItem value="Fundamental Incompleto">Fund. Incompleto</SelectItem>
                                                    <SelectItem value="Fundamental Completo">Fund. Completo</SelectItem>
                                                    <SelectItem value="Medio Incompleto">Médio Incompleto</SelectItem>
                                                    <SelectItem value="Medio Completo">Médio Completo</SelectItem>
                                                    <SelectItem value="Superior Incompleto">Sup. Incompleto</SelectItem>
                                                    <SelectItem value="Superior Completo">Sup. Completo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-6">
                                <FormField
                                    control={form.control}
                                    name="isRetired"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>É Aposentado?</FormLabel>
                                                <FormDescription>Recebe aposentadoria.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isPcd"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>É PCD?</FormLabel>
                                                <FormDescription>Pessoa com Deficiência.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {isPcdValue && (
                                <FormField
                                    control={form.control}
                                    name="pcdDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição da Deficiência</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Cadeirante..." {...field} value={(field.value as string) ?? ""} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </TabsContent>

                    {/* --- ABA 2: GRUPO FAMILIAR --- */}
                    <TabsContent value="familia" className="space-y-6 pt-4">
                        <div className="flex justify-end">
                            {/* Botão de Adicionar sem 'income' (renda) se não houver no banco */}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    append({
                                        name: "",
                                        kinship: "",
                                        age: "",
                                        isPcd: false,
                                        sex: "",
                                        colorRace: "",
                                        schooling: "",
                                        observation: "",
                                    })
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" /> Adicionar Membro
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
                                                name={`familyMembers.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nome</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.kinship`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Parentesco</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Conjuge">Cônjuge (Esposo/a)</SelectItem>
                                                                <SelectItem value="Filho">Filho(a)</SelectItem>
                                                                <SelectItem value="Neto">Neto(a)</SelectItem>
                                                                <SelectItem value="Pai/Mae">Pai/Mãe</SelectItem>
                                                                <SelectItem value="Irmao">Irmão/ã</SelectItem>
                                                                <SelectItem value="Outro">Outro</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.age`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Idade</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} value={field.value as string} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.schooling`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Escolaridade</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Nao Alfabetizado">Não Alfabetizado</SelectItem>
                                                                <SelectItem value="Fundamental">Fundamental</SelectItem>
                                                                <SelectItem value="Medio">Médio</SelectItem>
                                                                <SelectItem value="Superior">Superior</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Checkbox PCD da Família */}
                                        <div className="md:col-span-12 flex items-center gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.isPcd`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormLabel>Possui Deficiência (PCD)?</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {fields.length === 0 && (
                                <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">
                                    Nenhum membro familiar adicionado.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="pt-4 pb-10 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-w-[200px]">
                        {isLoading ? "Salvando..." : initialData ? "Salvar Alterações" : "Cadastrar Produtor"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
