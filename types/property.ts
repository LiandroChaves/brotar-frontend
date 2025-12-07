// types/property.ts

export interface PropertyItem {
    id?: number; // Opcional pq na criação ainda não tem ID
    idDomain: number;
    complement: string;
    quantity: number;
    isFunctioning: boolean;
}

export interface Property {
    id: number;
    idProducer: number;
    // O backend deve mandar o objeto producer pra gente mostrar o nome na lista
    producer?: {
        name: string;
        cpf: string;
    };

    // Dados Gerais
    productiveAreaName: string;
    totalArea: number;
    agriculturalArea: number;
    productiveBackyardArea: number;
    backyardType: string;
    latitude: string;
    longitude: string;
    timeOnProperty: string;

    // Infra (Booleans)
    hasElectricity: boolean;
    hasBathroom: boolean;
    hasSepticTank: boolean;
    hasGreyWaterTreatment: boolean;
    greyWaterTreatmentDesc?: string;

    // Social
    culturalTradition?: string;
    hasSchoolInCommunity: boolean;
    schoolTransport?: string;
    visitedByHealthAgent: boolean;
    visitedByEndemicAgent: boolean;

    // Produção e Mercado
    hasIrrigation: boolean;
    hasOrganicCertification: boolean;
    accessedCredit: boolean;
    creditDetail?: string;
    accessedMarket: boolean;
    marketDetail?: string;
    hasFinancialManagement: boolean;
    financialManagementDesc?: string;
    receivesTechSupport: boolean;
    techSupportFrequency?: string;
    trainingAvailability: boolean;
    technicalReport?: string;

    // Itens (Domínios vinculados)
    items: PropertyItem[];
}