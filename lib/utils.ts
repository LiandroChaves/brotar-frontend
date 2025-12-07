import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata Celular: (88) 99999-8888 ou Fixo: (88) 3333-4444
export const formatarTelefone = (value: string | null | undefined) => {
  if (!value) return "-"; // AQUI É A BLINDAGEM: Se for null, retorna traço

  const v = value.replace(/\D/g, "");

  // Lógica para 11 dígitos (Celular)
  if (v.length === 11) {
    return v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Lógica para 10 dígitos (Fixo)
  if (v.length === 10) {
    return v.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return value; // Se não bater o tamanho, retorna o original
}

// Formata CPF: 123.456.789-00
export const formatarCPF = (value: string | null | undefined) => {
  if (!value) return "-";

  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1"); // Limita tamanho
}

// Formata RG (Geralmente varia, mas o básico é sem pontuação ou livre)
// Se quiser forçar algo visual, pode usar, mas RG é chato pq varia por estado.
// Vou deixar simples:
export const formatarRG = (value: string | null | undefined) => {
  if (!value) return "-";
  return value; // RG geralmente a gente só exibe, pq tem letra as vezes
}

// Formata CEP: 62930-000
export const formatarCEP = (value: string | null | undefined) => {
  if (!value) return "-";
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d{3})/, "$1-$2");
}

export const formatarApenasNumeros = (value: string) => {
  return value.replace(/\D/g, "")
}

export const formatarNIS = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 11)
}