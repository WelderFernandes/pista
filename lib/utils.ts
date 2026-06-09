import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte um valor em centavos (inteiro) para uma string formatada em Real (BRL).
 * Exemplo: 12000 -> "R$ 120,00"
 */
export function formatCentsToBRL(cents: number): string {
  if (isNaN(cents) || cents === null || cents === undefined) {
    cents = 0;
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/**
 * Converte um valor em centavos (inteiro) para um valor numérico em Real (float).
 * Exemplo: 12000 -> 120
 */
export function centsToBRL(cents: number): number {
  if (isNaN(cents) || cents === null || cents === undefined) {
    return 0;
  }
  return cents / 100;
}

/**
 * Converte um valor numérico em Real (float) para centavos (inteiro).
 * Exemplo: 120.50 -> 12050
 */
export function brlToCents(amount: number): number {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 0;
  }
  return Math.round(amount * 100);
}
