// src/types/producer.ts

export interface Producer {
    id: number;
    name: string;
    socialName?: string;
    dateBirth?: string;
    cpf: string;
    rg?: string;
    nickname?: string;
    contact?: string;
    community?: string;
    municipality?: string;
    state?: string;
    personalAddress?: string;
    cadUnique?: string;
    nis?: string;
    caf?: string; // ou DAP
    colorRace?: string;
    ethnicity?: string;
    civilState?: string;
    schooling?: string;
    naturalness?: string;
    isRetired?: boolean;
    isPcd?: boolean;
    pcdDescription?: string;
    createdAt?: string;
}