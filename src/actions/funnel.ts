"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Quote, QuoteStatus, Customer } from "@/types/database"

export type QuoteWithCustomer = Quote & { customers: Customer | null }

const FUNNEL_STATUSES: QuoteStatus[] = [
  "novo",
  "enviado",
  "aguardando",
  "follow_up_1",
  "follow_up_2",
  "fechado",
  "perdido",
]

export async function getQuotesForFunnel(): Promise<
  Record<string, QuoteWithCustomer[]>
> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return buildEmptyResult()
  }

  const { data: profile } = (await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .single()) as { data: { workspace_id: string } | null }

  if (!profile) {
    return buildEmptyResult()
  }

  // Fetch all non-pago quotes with customer join
  const { data, error } = (await supabase
    .from("quotes")
    .select("*, customers(*)")
    .eq("workspace_id", profile.workspace_id)
    .neq("status", "pago")
    .neq("status", "cobranca_pendente")
    .order("created_at", { ascending: false })) as {
    data: QuoteWithCustomer[] | null
    error: any
  }

  if (error) {
    console.error("Error fetching quotes for funnel:", error)
    return buildEmptyResult()
  }

  // Group by status
  const grouped: Record<string, QuoteWithCustomer[]> = buildEmptyResult()

  for (const quote of data ?? []) {
    if (grouped[quote.status]) {
      grouped[quote.status].push(quote)
    }
  }

  return grouped
}

export async function updateQuoteStatus(
  quoteId: string,
  newStatus: QuoteStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const now = new Date().toISOString()

  const updateData: Record<string, any> = {
    status: newStatus,
    updated_at: now,
  }

  // Set timestamps based on status
  if (newStatus === "enviado") {
    updateData.sent_at = now
  }
  if (newStatus === "fechado") {
    updateData.closed_at = now
  }
  if (newStatus === "perdido") {
    updateData.lost_at = now
  }

  const { error } = (await (supabase.from("quotes") as any)
    .update(updateData)
    .eq("id", quoteId)) as { error: any }

  if (error) {
    console.error("Error updating quote status:", error)
    return { success: false, error: "Erro ao atualizar status do orcamento." }
  }

  revalidatePath("/funil")
  revalidatePath("/orcamentos")
  return { success: true }
}

function buildEmptyResult(): Record<string, QuoteWithCustomer[]> {
  const result: Record<string, QuoteWithCustomer[]> = {}
  for (const status of FUNNEL_STATUSES) {
    result[status] = []
  }
  return result
}
