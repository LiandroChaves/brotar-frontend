"use client"

import { useState } from "react"
import { Eye, Pencil, Trash2, MapPin, Tractor, Ruler, Activity, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import api from "@/lib/api"

interface PropertyActionsProps {
    property: any
    onEdit: (property: any) => void
    onDelete: (id: string) => void
}

const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="col-span-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-1 truncate" title={String(value)}>
            {value || "-"}
        </p>
    </div>
)

export function PropertyActions({ property, onEdit, onDelete }: PropertyActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleExportPDF = async () => {
        try {
            setIsExporting(true)
            const response = await api.get(`/pdf/form/${property.id}`, {
                responseType: "blob",
            })

            const blob = new Blob([response.data], { type: "application/pdf" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `propriedade_${property.productiveAreaName.replace(/\s+/g, "_")}_${property.id}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            toast.success("PDF exportado com sucesso!")
        } catch (error) {
            console.error("Erro ao exportar PDF:", error)
            toast.error("Erro ao exportar PDF. Tente novamente.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
            {/* --- DETALHES (SHEET) --- */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-blue-600">
                        <Eye className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Tractor className="h-5 w-5" /> Detalhes da Propriedade
                        </SheetTitle>
                        <SheetDescription>Ficha técnica da área.</SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                        <div className="space-y-6 pb-6">
                            {/* DADOS GERAIS */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-primary">Geral</h4>
                                <div className="grid grid-cols-2 gap-4 border p-3 rounded-md bg-muted/20">
                                    <div className="col-span-2">
                                        <InfoRow label="Nome" value={property.productiveAreaName} />
                                    </div>
                                    <div className="col-span-2">
                                        <InfoRow label="Proprietário" value={property.producer?.name || "N/A"} />
                                    </div>
                                    <InfoRow label="Área Total" value={`${property.totalArea} ha`} />
                                    <InfoRow label="Área Agrícola" value={`${property.agriculturalArea} ha`} />
                                </div>
                            </div>

                            <Separator />

                            {/* LOCALIZAÇÃO */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-primary flex gap-2 items-center">
                                    <MapPin className="h-4 w-4" /> Localização
                                </h4>
                                <div className="grid grid-cols-2 gap-4 border p-3 rounded-md bg-muted/20">
                                    <InfoRow label="Latitude" value={property.latitude} />
                                    <InfoRow label="Longitude" value={property.longitude} />
                                    <div className="col-span-2">
                                        {property.latitude && property.longitude && (
                                            <a
                                                href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                                                target="_blank"
                                                className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                                                rel="noreferrer"
                                            >
                                                Ver no Google Maps
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                                    <Ruler className="h-4 w-4" /> Itens e Bens
                                </h4>
                                <div className="grid grid-cols-2 gap-4 border p-3 rounded-md bg-muted/20">
                                    {property.items && property.items.length > 0 ? (
                                        property.items.map((item: any, index: number) => (
                                            <div key={index} className="col-span-2 border-b pb-2 last:border-0 last:pb-0">
                                                {/* Tenta mostrar o nome do domínio se vier populado, senão mostra o ID */}
                                                <p className="text-sm font-semibold">{item.domain?.name || `Item (ID: ${item.idDomain})`}</p>
                                                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                                    <span>Qtd: {item.quantity}</span>
                                                    {item.complement && <span>Detalhe: {item.complement}</span>}
                                                    <span>{item.isFunctioning ? "✅ Funciona" : "❌ Quebrado"}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground col-span-2">Nenhum item cadastrado.</p>
                                    )}
                                </div>
                            </div>
                            <Separator />

                            {/* INFRAESTRUTURA */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-primary">Infraestrutura</h4>
                                <div className="border p-3 rounded-md bg-muted/20 text-sm space-y-1">
                                    <p>
                                        ⚡ Energia: <b>{property.hasElectricity ? "Sim" : "Não"}</b>
                                    </p>
                                    <p>
                                        💧 Água/Irrigação: <b>{property.hasIrrigation ? "Sim" : "Não"}</b>
                                    </p>
                                    <p>
                                        🚽 Banheiro: <b>{property.hasBathroom ? "Sim" : "Não"}</b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted text-green-600"
                onClick={handleExportPDF}
                disabled={isExporting}
                title="Exportar para PDF"
            >
                {isExporting ? <Activity className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            </Button>

            {/* --- EDITAR --- */}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted text-orange-600"
                onClick={() => onEdit(property)}
            >
                <Pencil className="h-4 w-4" />
            </Button>

            {/* --- EXCLUIR --- */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-red-600">
                        {isDeleting ? <Activity className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Propriedade?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Isso apagará permanentemente a área <b>{property.productiveAreaName}</b> e seus itens vinculados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={async () => {
                                setIsDeleting(true)
                                await onDelete(String(property.id))
                                setIsDeleting(false)
                            }}
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
