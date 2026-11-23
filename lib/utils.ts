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

/**
 * Sanitiza um número de telefone brasileiro para o formato internacional com DDI 55.
 * Remove caracteres não numéricos e adiciona o prefixo 55 se ainda não estiver presente.
 * Exemplo: "(11) 99999-9999" -> "+5511999999999"
 */
export function sanitizePhoneBR(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined;
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned && !cleaned.startsWith("55")) {
    cleaned = `55${cleaned}`;
  }
  return cleaned ? `+${cleaned}` : undefined;
}
