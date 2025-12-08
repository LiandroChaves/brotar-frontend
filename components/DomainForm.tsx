"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Schema simples
const formSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    group: z.string().min(1, "Selecione um grupo"),
    description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface DomainFormProps {
    initialData?: any
    onSubmit: (data: FormValues) => void
    isLoading?: boolean
}

export function DomainForm({ initialData, onSubmit, isLoading }: DomainFormProps) {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            group: initialData?.group || "",
            description: initialData?.description || "",
        },
    })

    // Reset para edição
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || "",
                group: initialData.group || "",
                description: initialData.description || "",
            })
        }
    }, [initialData, form])

    const handleSubmit = (data: FormValues) => {
        onSubmit(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Nome do Item */}
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Nome do Item</FormLabel>
                            <FormControl><Input placeholder="Ex: Trator, Cisterna, Galinheiro..." {...field} value={field.value ?? ""} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Grupo (Categoria) */}
                    <FormField control={form.control} name="group" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Grupo / Categoria</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="INFRAESTRUTURA">Infraestrutura</SelectItem>
                                    <SelectItem value="MAQUINAS">Máquinas e Equipamentos</SelectItem>
                                    <SelectItem value="ANIMAIS">Animais</SelectItem>
                                    <SelectItem value="PRODUTIVO">Insumos Produtivos</SelectItem>
                                    <SelectItem value="OUTROS">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Descrição */}
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Descrição (Opcional)</FormLabel>
                            <FormControl>
                                {/* Se não tiver Textarea, troque por Input */}
                                <Textarea
                                    placeholder="Detalhes adicionais sobre este tipo de item..."
                                    className="resize-none"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Salvando..." : (initialData ? "Atualizar Item" : "Cadastrar Item")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}