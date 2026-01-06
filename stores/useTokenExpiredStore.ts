import { create } from "zustand"

interface TokenExpiredState {
    isOpen: boolean
    openModal: () => void
    closeModal: () => void
}

export const useTokenExpiredStore = create<TokenExpiredState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}))
