"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- FUNÇÕES DE MÁSCARA (Helpers) ---
// Elas formatam o texto enquanto o usuário digita
const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, "") // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1") // Limita o tamanho
}

const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d)(\d{4})$/, "$1-$2")
        .substr(0, 15) // Limita tamanho pra (11) 99999-9999
}

// --- SCHEMA ---
const formSchema = z.object({
    name: z.string().min(2, "Nome é obrigatório"),
    socialName: z.string().optional(),
    nickname: z.string().optional(),
    dateBirth: z.string().optional(),
    cpf: z.string().min(14, "CPF incompleto"), // 14 caracteres contando pontos e traço
    rg: z.string().optional(),
    civilState: z.string().optional(),
    colorRace: z.string().optional(),
    ethnicity: z.string().optional(),
    naturalness: z.string().optional(),
    contact: z.string().min(14, "Telefone incompleto"), // (XX) XXXXX-XXXX
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
})

type FormValues = z.infer<typeof formSchema>

interface ProducerFormProps {
    initialData?: any
    onSubmit: (data: FormValues) => void
    isLoading?: boolean
}

export function ProducerForm({ initialData, onSubmit, isLoading }: ProducerFormProps) {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            socialName: initialData?.socialName || "",
            nickname: initialData?.nickname || "",
            dateBirth: initialData?.dateBirth || "",
            cpf: initialData?.cpf || "",
            rg: initialData?.rg || "",
            civilState: initialData?.civilState || "",
            colorRace: initialData?.colorRace || "",
            ethnicity: initialData?.ethnicity || "",
            naturalness: initialData?.naturalness || "",
            contact: initialData?.contact || "",
            personalAddress: initialData?.personalAddress || "",
            community: initialData?.community || "",
            municipality: initialData?.municipality || "Limoeiro do Norte",
            state: initialData?.state || "CE",
            cadUnique: initialData?.cadUnique || "",
            nis: initialData?.nis || "",
            caf: initialData?.caf || "",
            schooling: initialData?.schooling || "",
            isRetired: initialData?.isRetired || false,
            isPcd: initialData?.isPcd || false,
            pcdDescription: initialData?.pcdDescription || "",
        },
    })

    const isPcdValue = form.watch("isPcd")

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || "",
                socialName: initialData.socialName || "",
                nickname: initialData.nickname || "",
                dateBirth: initialData.dateBirth || "",
                cpf: initialData.cpf || "",
                rg: initialData.rg || "",
                civilState: initialData.civilState || "",
                colorRace: initialData.colorRace || "",
                ethnicity: initialData.ethnicity || "",
                naturalness: initialData.naturalness || "",
                contact: initialData.contact || "",
                personalAddress: initialData.personalAddress || "",
                community: initialData.community || "",
                municipality: initialData.municipality || "Limoeiro do Norte",
                state: initialData.state || "CE",
                cadUnique: initialData.cadUnique || "",
                nis: initialData.nis || "",
                caf: initialData.caf || "",
                schooling: initialData.schooling || "",
                isRetired: !!initialData.isRetired,
                isPcd: !!initialData.isPcd,
                pcdDescription: initialData.pcdDescription || "",
            })
        }
    }, [initialData, form])

    const handleSubmit = (data: FormValues) => {
        // IMPORTANTE: Se o backend esperar apenas números, 
        // você pode remover a formatação aqui antes de enviar.
        // Ex: data.cpf = data.cpf.replace(/\D/g, "")
        onSubmit(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

                {/* GRUPO 1: IDENTIFICAÇÃO */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Identificação Pessoal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel>Nome Completo *</FormLabel>
                                <FormControl><Input placeholder="Maria da Silva" {...field} value={field.value ?? ""} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="socialName" render={({ field }) => (
                            <FormItem><FormLabel>Nome Social</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />

                        {/* --- CAMPO CPF COM MÁSCARA --- */}
                        <FormField control={form.control} name="cpf" render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="000.000.000-00"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => {
                                            // Aplica a máscara e atualiza o form
                                            field.onChange(maskCPF(e.target.value))
                                        }}
                                        maxLength={14} // Trava o tamanho máximo
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="rg" render={({ field }) => (
                            <FormItem><FormLabel>RG</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />

                        <FormField control={form.control} name="dateBirth" render={({ field }) => (
                            <FormItem><FormLabel>Data de Nascimento</FormLabel><FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />

                        <FormField control={form.control} name="civilState" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado Civil</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                                        <SelectItem value="Casado">Casado(a)</SelectItem>
                                        <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                                        <SelectItem value="Viuvo">Viúvo(a)</SelectItem>
                                        <SelectItem value="UniaoEstavel">União Estável</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="colorRace" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cor/Raça</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Branca">Branca(o)</SelectItem>
                                        <SelectItem value="Preta">Preta(o)</SelectItem>
                                        <SelectItem value="Parda">Parda(o)</SelectItem>
                                        <SelectItem value="Amarela">Amarela(o)</SelectItem>
                                        <SelectItem value="Indigena">Indígena(o)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="ethnicity" render={({ field }) => (
                            <FormItem><FormLabel>Etnia</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="naturalness" render={({ field }) => (
                            <FormItem><FormLabel>Naturalidade</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />
                    </div>
                </div>

                <Separator />

                {/* GRUPO 2: CONTATO E ENDEREÇO */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contato e Localização</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* --- CAMPO CONTATO COM MÁSCARA --- */}
                        <FormField control={form.control} name="contact" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Celular / WhatsApp *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="(88) 99999-9999"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => {
                                            // Aplica a máscara de telefone
                                            field.onChange(maskPhone(e.target.value))
                                        }}
                                        maxLength={15}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="personalAddress" render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel>Endereço Residencial</FormLabel>
                                <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="community" render={({ field }) => (
                            <FormItem><FormLabel>Comunidade / Sítio</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />

                        <FormField control={form.control} name="municipality" render={({ field }) => (
                            <FormItem><FormLabel>Município</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />

                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem><FormLabel>UF</FormLabel><FormControl><Input {...field} value={field.value ?? ""} maxLength={2} /></FormControl></FormItem>
                        )} />
                    </div>
                </div>

                <Separator />

                {/* GRUPO 3: DADOS SOCIAIS */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Dados Sociais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField control={form.control} name="nis" render={({ field }) => (
                            <FormItem><FormLabel>NIS</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="cadUnique" render={({ field }) => (
                            <FormItem><FormLabel>CadÚnico</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="caf" render={({ field }) => (
                            <FormItem><FormLabel>CAF</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="schooling" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Escolaridade</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Nao Alfabetizado">Não Alfabetizado</SelectItem>
                                        <SelectItem value="Fundamental Incompleto">Fundamental Incompleto</SelectItem>
                                        <SelectItem value="Fundamental Completo">Fundamental Completo</SelectItem>
                                        <SelectItem value="Medio Incompleto">Médio Incompleto</SelectItem>
                                        <SelectItem value="Medio Completo">Médio Completo</SelectItem>
                                        <SelectItem value="Superior Incompleto">Superior Incompleto</SelectItem>
                                        <SelectItem value="Superior Completo">Superior Completo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </div>

                <Separator />

                {/* GRUPO 4: SITUAÇÃO */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                        <FormField control={form.control} name="isRetired" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>É Aposentado?</FormLabel>
                                    <FormDescription>Marque se o produtor recebe aposentadoria.</FormDescription>
                                </div>
                            </FormItem>
                        )}
                        />

                        <FormField control={form.control} name="isPcd" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                        <FormField control={form.control} name="pcdDescription" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição da Deficiência</FormLabel>
                                <FormControl><Input placeholder="Ex: Cadeirante, Deficiência Visual..." {...field} value={field.value ?? ""} /></FormControl>
                            </FormItem>
                        )} />
                    )}
                </div>

                <div className="pt-4 pb-10">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-w-[200px]">
                        {isLoading ? "Salvando..." : (initialData ? "Salvar Alterações" : "Cadastrar Produtor")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}