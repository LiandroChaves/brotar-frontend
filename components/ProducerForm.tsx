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
    familyMembers: z
        .array(
            z.object({
                id: z.number().optional(),
                name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(120),
                kinship: z.string().min(1, "Parentesco é obrigatório"),
                age: z.number().min(0, "Idade inválida"),
                sex: z.string().min(1, "Sexo é obrigatório"),
                colorRace: z.string().min(1, "Cor/Raça é obrigatória"),
                schooling: z.string().min(1, "Escolaridade é obrigatória"),
                isPcd: z.boolean(),
                pcdDescription: z.string(),
                observation: z.string(),
            }),
        )
        .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ProducerFormProps {
    initialData?: any
    onSubmit: (data: FormValues) => void
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
                    age: Number(m.age) || 0,
                    sex: m.sex || "",
                    colorRace: m.colorRace || "",
                    schooling: m.schooling || "",
                    isPcd: !!m.isPcd,
                    observation: m.observation || "",
                    pcdDescription: m.pcdDescription || "Nenhuma",
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
                        age: Number(m.age) || 0,
                        sex: m.sex || "",
                        colorRace: m.colorRace || "",
                        schooling: m.schooling || "",
                        isPcd: !!m.isPcd,
                        observation: m.observation || "",
                        pcdDescription: m.pcdDescription || "Nenhuma",
                    })) || [],
            })
        }
    }, [initialData, form])

    const handleSubmit = (data: FormValues) => {
        const payload = {
            ...data,
            familyMembers:
                data.familyMembers?.map((m) => ({
                    ...m,
                    age: Number(m.age),
                    pcdDescription: m.pcdDescription || "Nenhuma",
                    observation: m.observation || "",
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
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Membros da Família</h3>
                                <p className="text-sm text-muted-foreground">Adicione os membros do grupo familiar do produtor</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    append({
                                        name: "",
                                        kinship: "",
                                        age: 0,
                                        sex: "",
                                        colorRace: "",
                                        schooling: "",
                                        isPcd: false,
                                        pcdDescription: "Nenhuma",
                                        observation: "",
                                    })
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Membro
                            </Button>
                        </div>

                        {fields.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground text-center">
                                        Nenhum membro da família cadastrado ainda.
                                        <br />
                                        Clique em "Adicionar Membro" para começar.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field, index) => {
                                    const isPcdMember = form.watch(`familyMembers.${index}.isPcd`)
                                    return (
                                        <Card key={field.id}>
                                            <CardContent className="pt-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-sm font-medium">Membro {index + 1}</h4>
                                                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`familyMembers.${index}.name`}
                                                            render={({ field }) => (
                                                                <FormItem className="col-span-1 md:col-span-2">
                                                                    <FormLabel>Nome Completo *</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Nome do familiar" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`familyMembers.${index}.kinship`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Parentesco *</FormLabel>
                                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Selecione" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="Pai">Pai</SelectItem>
                                                                            <SelectItem value="Mae">Mãe</SelectItem>
                                                                            <SelectItem value="Filho">Filho(a)</SelectItem>
                                                                            <SelectItem value="Conjuge">Cônjuge</SelectItem>
                                                                            <SelectItem value="Irmao">Irmão(ã)</SelectItem>
                                                                            <SelectItem value="Avo">Avô(ó)</SelectItem>
                                                                            <SelectItem value="Neto">Neto(a)</SelectItem>
                                                                            <SelectItem value="Sobrinho">Sobrinho(a)</SelectItem>
                                                                            <SelectItem value="Primo">Primo(a)</SelectItem>
                                                                            <SelectItem value="Tio">Tio(a)</SelectItem>
                                                                            <SelectItem value="Genro">Genro/Nora</SelectItem>
                                                                            <SelectItem value="Outro">Outro</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`familyMembers.${index}.age`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Idade *</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            min="0"
                                                                            max="150"
                                                                            placeholder="0"
                                                                            {...field}
                                                                            value={field.value}
                                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`familyMembers.${index}.sex`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Sexo *</FormLabel>
                                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Selecione" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="Masculino">Masculino</SelectItem>
                                                                            <SelectItem value="Feminino">Feminino</SelectItem>
                                                                            <SelectItem value="Outro">Outro</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`familyMembers.${index}.colorRace`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Cor/Raça *</FormLabel>
                                                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`familyMembers.${index}.schooling`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Escolaridade *</FormLabel>
                                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Selecione" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="Analfabeto">Analfabeto</SelectItem>
                                                                            <SelectItem value="FundamentalIncompleto">Fundamental Incompleto</SelectItem>
                                                                            <SelectItem value="FundamentalCompleto">Fundamental Completo</SelectItem>
                                                                            <SelectItem value="MedioIncompleto">Médio Incompleto</SelectItem>
                                                                            <SelectItem value="MedioCompleto">Médio Completo</SelectItem>
                                                                            <SelectItem value="SuperiorIncompleto">Superior Incompleto</SelectItem>
                                                                            <SelectItem value="SuperiorCompleto">Superior Completo</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`familyMembers.${index}.isPcd`}
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                                    <FormControl>
                                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                                    </FormControl>
                                                                    <div className="space-y-1 leading-none">
                                                                        <FormLabel>Pessoa com Deficiência (PCD)</FormLabel>
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {isPcdMember && (
                                                            <FormField
                                                                control={form.control}
                                                                name={`familyMembers.${index}.pcdDescription`}
                                                                render={({ field }) => (
                                                                    <FormItem className="col-span-1 md:col-span-2">
                                                                        <FormLabel>Descrição da Deficiência</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Descreva a deficiência" {...field} />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        )}

                                                        <FormField
                                                            control={form.control}
                                                            name={`familyMembers.${index}.observation`}
                                                            render={({ field }) => (
                                                                <FormItem className="col-span-1 md:col-span-3">
                                                                    <FormLabel>Observações</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Informações adicionais" {...field} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar Produtor"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
