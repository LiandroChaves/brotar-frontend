"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { adminService } from "@/services/adminService"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Edit } from "lucide-react"

interface Admin {
    id: number
    name: string
    email: string
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    useEffect(() => {
        loadAdmins()
    }, [])

    const loadAdmins = async () => {
        try {
            setIsLoading(true)
            const data = await adminService.getAll()
            setAdmins(data)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao carregar administradores.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await adminService.delete(id)
            setAdmins((prev) => prev.filter((a) => a.id !== id))
            toast.success("Administrador removido!")
        } catch (error) {
            toast.error("Erro ao excluir administrador.")
        }
    }

    const handleEdit = (admin: Admin) => {
        router.push(`/dashboard/admins/${admin.id}`)
    }

    const safeAdmins = Array.isArray(admins) ? admins : []

    const filteredAdmins = safeAdmins.filter(
        (a) =>
            a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
                <Link href="/dashboard/admins/novo">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" /> Novo Admin
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Usuários do Sistema</CardTitle>
                    <div className="pt-2">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou email..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando administradores...</div>
                    ) : filteredAdmins.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Nenhum administrador cadastrado.</div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[600px]">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr className="border-b">
                                        <th className="h-12 px-4 align-middle">Nome</th>
                                        <th className="h-12 px-4 align-middle">Email</th>
                                        <th className="h-12 px-4 align-middle text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAdmins.map((admin) => (
                                        <tr key={admin.id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-blue-600" />
                                                {admin.name}
                                            </td>
                                            <td className="p-4">{admin.email}</td>
                                            <td className="p-4 text-right space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(admin)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja remover este administrador? Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                        <div className="flex gap-3 justify-end">
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(admin.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Remover
                                                            </AlertDialogAction>
                                                        </div>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
