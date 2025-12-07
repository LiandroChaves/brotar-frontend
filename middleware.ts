// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. O nome do cookie
const AUTH_COOKIE_NAME = 'brotar.auth-token'
const REQUIRES_CHANGE_COOKIE = 'brotar.requires-change'

// 2. As rotas
const ADMIN_ROUTES = ['/dashboard'] // Rotas que exigem login
const AUTH_ROUTES = ['/login']      // Rotas de autenticação
const CHANGE_PASS_ROUTE = '/auth/change-password'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 3. Pegue os cookies
    const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const requiresChange = request.cookies.get(REQUIRES_CHANGE_COOKIE)?.value === 'true'

    // Caso 1: Usuário precisa trocar a senha
    if (authToken && requiresChange) {
        // Se ele está logado e precisa trocar a senha...
        // E NÃO está na página de trocar senha...
        if (pathname !== CHANGE_PASS_ROUTE) {
            // Força o redirecionamento para a página de trocar senha.
            return NextResponse.redirect(new URL(CHANGE_PASS_ROUTE, request.url))
        }
        // Se ele já está na página correta, deixa passar
        return NextResponse.next()
    }

    // Caso 2: Usuário logado tenta acessar /login
    if (authToken && !requiresChange && AUTH_ROUTES.includes(pathname)) {
        // Redireciona para o dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Caso 3: Usuário NÃO logado tenta acessar rotas de admin
    if (!authToken && ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
        // Redireciona para o login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Caso 4: Todos os outros casos (deixa o usuário passar)
    return NextResponse.next()
}

// 4. Configuração do Matcher
export const config = {
    matcher: [
        /*
         * Faz o match em todas as rotas exceto:
         * - /api (rotas de API)
         * - /_next/static (arquivos estáticos)
         * - /_next/image (otimização de imagens)
         * - /favicon.ico (ícone)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}