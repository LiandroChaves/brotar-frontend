// app/login/page.tsx
'use client'

// Importamos os tipos do React que vamos usar
import Image from 'next/image'
import { useState, FormEvent, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModeToggle } from '@/components/mode-toggle'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import Cookies from 'js-cookie'
import LogoBrotar from '@/public/logo-brotar.jpg'
import { authService } from '@/services/authService'
import { formatarCPF } from '@/lib/utils'

export default function LoginPage() {
    // Tipagem explícita para os estados
    const [cpf, setCpf] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const authLogin = useAuthStore((state) => state.login)

    // OLHAAAAAA AQUUIIIIIIIIIIII -----> Nomes dos cookies (deve ser igual ao do middleware.ts)
    const AUTH_COOKIE_NAME = 'brotar.auth-token'
    const REQUIRES_CHANGE_COOKIE = 'brotar.requires-change'

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const data = await authService.login({ cpf, password: senha })
            const cpfLimpo = cpf.replace(/\D/g, '')
            if (data.primaryAcess === true) {
                Cookies.set('brotar.requires-change', 'true', { expires: 1, secure: true })
                router.push('/auth/change-password')
            } else {
                Cookies.remove('brotar.requires-change')
                router.push('/dashboard')
            }

            console.log('Resposta do Backend:', data)

            Cookies.set('brotar.auth-token', data.accessToken, { expires: 1, secure: true })

            // Se tiver refresh token, pode salvar também (opcional por enquanto)
            // Cookies.set('brotar.refresh-token', data.refreshToken, { expires: 7, secure: true })

            const userState = {
                id: data.id.toString(),
                cpf: cpfLimpo,
                role: 'ADMIN' as const
            }

            const authLogin = useAuthStore.getState().login
            authLogin(userState, data.accessToken)

            if (data.primaryAcess === true) {
                Cookies.set('brotar.requires-change', 'true', { expires: 1, secure: true })
                router.push('/auth/change-password')
            } else {
                Cookies.remove('brotar.requires-change')
                router.push('/dashboard')
            }

        } catch (err: any) {
            console.error(err)
            const mensagemErro = err.response?.data?.message || 'Erro ao realizar login. Verifique CPF e senha.'
            setError(mensagemErro)
        } finally {
            setIsLoading(false)
        }
    }

    // setIsLoading(false)

    const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCpf(formatarCPF(e.target.value))
    }

    const handleSenhaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSenha(e.target.value)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="absolute top-4 right-4">
                    <ModeToggle />
                </div>
                <div className="text-center">
                    <Image
                        src={LogoBrotar}
                        alt="Logo Instituto Brotar"
                        width={150}
                        className="mx-auto rounded-xl"
                    />
                    <h1 className="mt-4 text-3xl font-bold text-center text-primary">
                        Instituto Brotar
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">Acesso ao Painel Administrativo</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="cpf" className="dark:text-gray-100">CPF</Label>
                        <Input
                            id="cpf"
                            type="text"
                            placeholder="Digite seu CPF"
                            value={cpf}
                            onChange={handleCpfChange} // Usando o handler tipado
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="senha" className="dark:text-gray-100">Senha</Label>
                        <Input
                            id="senha"
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={handleSenhaChange} // Usando o handler tipado
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}