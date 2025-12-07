// Em stores/useAuthStore.ts
import { create } from 'zustand'

// Definimos os tipos para o estado do usuário
interface User {
    id: string;
    cpf: string;
    role: 'ADMIN' | 'SUPER_ADMIN'; // Baseado na sua regra de hierarquia
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Ações do store
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User | null) => void; // Para inicializar o estado
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        console.log('Zustand Store: Usuário logado', user);
    },

    logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        console.log('Zustand Store: Usuário deslogado');
    },

    setUser: (user) => {
        set({ user, isAuthenticated: !!user });
    }
}));