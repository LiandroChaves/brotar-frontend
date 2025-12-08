"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { adminService } from "@/services/adminService"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Key } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const formSchema = z.object({
    name: z.string().min(3, "Nome obrigatório"),
    email: z.string().email("Email inválido"),
})

const passwordSchema = z.object({
    newPassword: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
})

type FormValues = z.infer<typeof formSchema>
type PasswordValues = z.infer<typeof passwordSchema>

export default function EditAdminPage() {
    const router = useRouter()
    const params = useParams()
    const id = Number(params.id)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    })

    const passwordForm = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            newPassword: "",
        },
    })

    useEffect(() => {
        loadAdmin()
    }, [id])

    const loadAdmin = async () => {
        try {
            setIsLoadingData(true)
            const data = await adminService.getById(id)
            form.reset({
                name: data.name,
                email: data.email,
            })
        } catch (error) {
            console.error(error)
            toast.error("Erro ao carregar dados do administrador.")
            router.push("/dashboard/admins")
        } finally {
            setIsLoadingData(false)
        }
    }

    const handleSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true)
            await adminService.update(id, data)
            toast.success("Dados atualizados com sucesso!")
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Erro ao atualizar."
            toast.error(typeof msg === "string" ? msg : msg[0])
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangePassword = async (data: PasswordValues) => {
        try {
            await adminService.changePassword(id, data)
            toast.success("Senha alterada com sucesso!")
            passwordForm.reset()
            setIsPasswordDialogOpen(false)
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Erro ao alterar senha."
            toast.error(typeof msg === "string" ? msg : msg[0])
        }
    }

    if (isLoadingData) {
        return <div className="text-center py-8">Carregando...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admins">
                    <Button variant="outline" size="icon" title="Voltar">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Editar Administrador</h1>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Dados do Usuário</CardTitle>
                    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                <Key className="h-4 w-4" /> Alterar Senha
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Alterar Senha</DialogTitle>
                                <DialogDescription>Digite a nova senha para este administrador.</DialogDescription>
                            </DialogHeader>
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nova Senha</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-3 justify-end">
                                        <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit">Alterar</Button>
                                    </div>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-w-[200px]">
                                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
