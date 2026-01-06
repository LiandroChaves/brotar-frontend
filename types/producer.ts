// src/types/producer.ts

export interface Producer {
    id: number
    name: string
    socialName?: string
    dateBirth?: string
    cpf: string
    rg?: string
    nickname?: string
    contact?: string
    community?: string
    municipality?: string
    state?: string
    personalAddress?: string
    cadUnique?: string
    nis?: string
    caf?: string // ou DAP
    colorRace?: string
    ethnicity?: string
    civilState?: string
    schooling?: string
    naturalness?: string
    isRetired?: boolean
    isPcd?: boolean
    pcdDescription?: string
    familyMembers?: FamilyMember[]
    createdAt?: string
}

// 1. Definimos o que é um membro da família
export interface FamilyMember {
    id?: number // Opcional pq na criação não tem ID ainda
    name: string
    kinship: string // Parentesco (Filho, Esposa, etc)
    age: number
    sex: string
    colorRace: string
    schooling: string
    isPcd: boolean
    pcdDescription: string
    observation: string
    idProducer?: number
}
