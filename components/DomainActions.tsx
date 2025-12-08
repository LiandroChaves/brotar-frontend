"use client"

import { useState } from "react";
import { Pencil, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface DomainActionsProps {
    domain: any;
    onEdit: (domain: any) => void;
    onDelete: (id: string) => void;
}

export function DomainActions({ domain, onEdit, onDelete }: DomainActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <div className="flex items-center justify-end gap-2">

            {/* EDITAR */}
            <Button
                variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-orange-600"
                onClick={() => onEdit(domain)}
            >
                <Pencil className="h-4 w-4" />
            </Button>

            {/* EXCLUIR */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-red-600">
                        {isDeleting ? <Activity className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Item?</AlertDialogTitle>
                        <AlertDialogDescription>
                            O item <b>{domain.name}</b> será removido do catálogo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={async () => {
                                setIsDeleting(true);
                                await onDelete(String(domain.id));
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