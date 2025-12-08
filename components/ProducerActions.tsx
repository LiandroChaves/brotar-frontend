import { useState } from "react";
import { Eye, Pencil, Trash2, MapPin, User, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatarTelefone, formatarCPF, formatarRG } from "@/lib/utils";

// --- INTERFACES E PROPS ---
interface ProducerActionsProps {
    producer: any;
    onEdit: (producer: any) => void;
    onDelete: (id: string) => void;
}

// --- FUNÇÕES AUXILIARES DE FORMATAÇÃO ---

const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    // Ajuste pra não pegar fuso horário e mudar o dia
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

// AQUI TÁ A MÁGICA: Traduz o Estado Civil do Banco pra Tela
const traduzirEstadoCivil = (valor: string) => {
    const mapa: Record<string, string> = {
        "Solteiro": "Solteiro(a)",
        "Casado": "Casado(a)",
        "Divorciado": "Divorciado(a)",
        "Viuvo": "Viúvo(a)",
        "UniaoEstavel": "União Estável"
    };
    return mapa[valor] || valor; // Se não achar no mapa, mostra o original mesmo
}

// O mesmo pra Escolaridade (se quiser deixar bonito também)
const traduzirEscolaridade = (valor: string) => {
    const mapa: Record<string, string> = {
        "Nao Alfabetizado": "Não Alfabetizado",
        "Fundamental Incompleto": "Fund. Incompleto",
        "Fundamental Completo": "Fund. Completo",
        "Medio Incompleto": "Médio Incompleto",
        "Medio Completo": "Médio Completo",
        "Superior Incompleto": "Sup. Incompleto",
        "Superior Completo": "Sup. Completo"
    };
    return mapa[valor] || valor;
}

const InfoRow = ({ label, value, fullWidth = false }: { label: string, value: any, fullWidth?: boolean }) => (
    <div className={`${fullWidth ? "col-span-2" : "col-span-1"}`}>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-1 truncate" title={String(value)}>
            {value || "-"}
        </p>
    </div>
);

export function ProducerActions({ producer, onEdit, onDelete }: ProducerActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <div className="flex items-center gap-2">

            {/* --- BOTÃO DETALHES (SHEET) --- */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" title="Ver Detalhes">
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                </SheetTrigger>

                <SheetContent className="sm:max-w-md flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Detalhes do Produtor
                        </SheetTitle>
                        <SheetDescription>
                            Ficha completa de cadastro.
                        </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                        <div className="space-y-6 pb-6">

                            {/* GRUPO 1: IDENTIFICAÇÃO BÁSICA */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                                    <User className="h-4 w-4" /> Identificação
                                </h4>
                                <div className="grid grid-cols-2 gap-4 border p-3 rounded-md bg-muted/20">
                                    <InfoRow label="Nome Completo" value={producer.name} fullWidth />
                                    {producer.socialName && <InfoRow label="Nome Social" value={producer.socialName} fullWidth />}
                                    <InfoRow label="Apelido" value={producer?.nickname} />
                                    <InfoRow label="Data Nasc." value={formatDate(producer.dateBirth)} />
                                    <InfoRow label="CPF" value={formatarCPF(producer.cpf)} />
                                    <InfoRow label="RG" value={formatarRG(producer.rg)} />

                                    {/* AQUI APLICAMOS A TRADUÇÃO */}
                                    <InfoRow label="Estado Civil" value={traduzirEstadoCivil(producer.civilState)} />

                                    <InfoRow label="Cor/Raça" value={producer.colorRace} />
                                    <InfoRow label="Etnia" value={producer.ethnicity} />
                                    <InfoRow label="Naturalidade" value={producer.naturalness} />
                                </div>
                            </div>

                            <Separator />

                            {/* GRUPO 2: CONTATO E ENDEREÇO */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                                    <MapPin className="h-4 w-4" /> Localização & Contato
                                </h4>
                                <div className="grid grid-cols-2 gap-4 border p-3 rounded-md bg-muted/20">
                                    <InfoRow label="Celular/Zap" value={formatarTelefone(producer.contact)} fullWidth />
                                    <InfoRow label="Endereço" value={producer.personalAddress} fullWidth />
                                    <InfoRow label="Comunidade" value={producer.community} />
                                    <InfoRow label="Município" value={producer.municipality} />
                                    <InfoRow label="UF" value={producer.state} />
                                </div>
                            </div>

                            <Separator />

                            {/* GRUPO 3: DADOS SOCIAIS/GOVERNO */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                                    <FileText className="h-4 w-4" /> Dados Sociais
                                </h4>
                                <div className="grid grid-cols-2 gap-4 border p-3 rounded-md bg-muted/20">
                                    <InfoRow label="CadÚnico" value={producer.cadUnique} />
                                    <InfoRow label="NIS" value={producer.nis} />
                                    <InfoRow label="CAF" value={producer.caf} />

                                    {/* APLICAMOS A TRADUÇÃO NA ESCOLARIDADE TAMBÉM */}
                                    <InfoRow label="Escolaridade" value={traduzirEscolaridade(producer.schooling)} fullWidth />
                                </div>
                            </div>

                            <Separator />

                            {/* GRUPO 4: SITUAÇÃO (PCD / APOSENTADO) */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                                    <Activity className="h-4 w-4" /> Situação
                                </h4>
                                <div className="grid grid-cols-2 gap-4 border p-3 rounded-md bg-muted/20">
                                    <InfoRow label="Aposentado?" value={producer.isRetired ? "Sim" : "Não"} />
                                    <InfoRow label="PCD?" value={producer.isPcd ? "Sim" : "Não"} />

                                    {/* Só mostra a descrição se for PCD */}
                                    {producer.isPcd && (
                                        <InfoRow label="Descrição PCD" value={producer.pcdDescription} fullWidth />
                                    )}
                                </div>
                            </div>

                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* --- BOTÃO EDITAR --- */}
            <Button
                variant="ghost"
                size="icon"
                title="Editar Produtor"
                className="h-8 w-8 hover:bg-muted"
                onClick={() => onEdit(producer)}
            >
                <Pencil className="h-4 w-4 text-orange-600" />
            </Button>

            {/* --- BOTÃO EXCLUIR COM CONFIRMAÇÃO --- */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" title="Deletar Produtor">
                        {isDeleting ? <Activity className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-600" />}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. O produtor <b>{producer.name}</b> será excluído permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={async () => {
                                setIsDeleting(true);
                                await onDelete(producer.id);
                                setIsDeleting(false);
                            }}
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}