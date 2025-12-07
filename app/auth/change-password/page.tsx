'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminService } from '@/services/adminService' // Mantivemos adminService
import { useAuthStore } from '@/stores/useAuthStore'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // Certifique-se de ter o componente Toaster no layout

export default function ChangePasswordPage() {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)

    const [novaSenha, setNovaSenha] = useState('')
    const [confirmaSenha, setConfirmaSenha] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        // 1. Validações de Frontend
        if (novaSenha !== confirmaSenha) {
            setError('A confirmação de senha não confere.')
            setIsLoading(false)
            return
        }

        // ATUALIZAÇÃO: Backend exige min 8 caracteres (@MinLength(8))
        if (novaSenha.length < 8) {
            setError('A senha deve ter no mínimo 8 caracteres.')
            setIsLoading(false)
            return
        }

        if (!user?.id) {
            setError('Erro: Usuário não identificado. Faça login novamente.')
            setIsLoading(false)
            return
        }

        try {
            // 2. Chamada Real ao Backend
            await adminService.changePassword(Number(user.id), {
                newPassword: novaSenha
            })

            setSuccess('Senha alterada com sucesso! Redirecionando...')

            // Se usar sonner/toast:
            // toast.success("Senha alterada com sucesso!")

            // 3. Remover a "trava" de primeiro acesso
            Cookies.remove('brotar.requires-change')

            // 4. Redirecionar para o Dashboard
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)

        } catch (err: any) {
            console.error(err)
            // Lógica para pegar mensagem do NestJS (que as vezes vem como array)
            const responseMsg = err.response?.data?.message;
            const msg = Array.isArray(responseMsg) ? responseMsg.join(', ') : responseMsg || 'Erro ao alterar senha.';

            setError(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">
                        Criar Nova Senha
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Este é seu primeiro acesso. Defina uma senha segura.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="novaSenha">Nova Senha</Label>
                        <Input
                            id="novaSenha"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmaSenha">Confirmar Nova Senha</Label>
                        <Input
                            id="confirmaSenha"
                            type="password"
                            placeholder="Repita a nova senha"
                            value={confirmaSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
                            {success}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Salvando...' : 'Definir Nova Senha'}
                    </Button>
                </form>
            </div>
        </div>
    )
}