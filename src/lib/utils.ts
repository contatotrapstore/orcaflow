import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata valor em centavos para BRL (R$ 1.234,56)
 */
export function formatBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

/**
 * Formata data para formato brasileiro (dd/mm/aaaa)
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(
    typeof date === "string" ? new Date(date) : date
  )
}

/**
 * Formata data relativa (há 2 dias, em 3 dias, etc.)
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const target = typeof date === "string" ? new Date(date) : date
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" })
  return rtf.format(diffDays, "day")
}

/**
 * Converte valor em reais (float) para centavos (integer)
 */
export function toCents(value: number): number {
  return Math.round(value * 100)
}

/**
 * Converte centavos (integer) para reais (float)
 */
export function fromCents(cents: number): number {
  return cents / 100
}
