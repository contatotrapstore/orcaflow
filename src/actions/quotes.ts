"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { quoteSchema } from "@/lib/validators/quote"
import { toCents } from "@/lib/utils"
import { calculateItemTotal } from "@/lib/utils/quote-calculations"
import type { Quote, QuoteItem, Customer, QuoteStatus, QuoteWithCustomer, QuoteFull } from "@/types/database"

export type QuoteActionState = {
  error?: string
  success?: boolean
  id?: string
}

async function getWorkspaceId() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = (await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .single()) as { data: { workspace_id: string } | null }

  return profile?.workspace_id ?? null
}

export async function listQuotes(filters?: { status?: QuoteStatus; search?: string }) {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return []

  let query = (supabase.from("quotes") as any)
    .select("*, customers(id, name, company_name, whatsapp, email)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,customers.name.ilike.%${filters.search}%`
    )
  }

  const { data, error } = (await query) as {
    data: (Quote & { customers: Customer | null })[] | null
    error: any
  }

  if (error) {
    console.error("Error listing quotes:", error)
    return []
  }

  return data ?? []
}

export async function getQuoteWithItems(id: string): Promise<QuoteFull | null> {
  const supabase = await createClient()

  const { data, error } = (await (supabase.from("quotes") as any)
    .select("*, quote_items(*), customers(*)")
    .eq("id", id)
    .single()) as { data: QuoteFull | null; error: any }

  if (error) {
    console.error("Error getting quote:", error)
    return null
  }

  // Sort items by sort_order
  if (data?.quote_items) {
    data.quote_items.sort((a: QuoteItem, b: QuoteItem) => a.sort_order - b.sort_order)
  }

  return data
}

export async function createQuote(
  _prevState: QuoteActionState,
  formData: FormData
): Promise<QuoteActionState> {
  const rawJson = formData.get("data") as string

  let rawData: unknown
  try {
    rawData = JSON.parse(rawJson)
  } catch {
    return { error: "Dados inválidos" }
  }

  const parsed = quoteSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return { error: "Usuário não autenticado" }
  }

  const { items, discount_amount, ...quoteData } = parsed.data

  // Calculate totals: items have unit_price in reais, convert to cents
  const discountCents = toCents(discount_amount)
  const subtotalCents = items.reduce(
    (sum, item) => sum + calculateItemTotal(item.quantity, item.unit_price),
    0
  )
  const totalCents = Math.max(0, subtotalCents - discountCents)

  // Create quote
  const { data: quote, error: quoteError } = (await (supabase
    .from("quotes") as any)
    .insert({
      workspace_id: workspaceId,
      customer_id: quoteData.customer_id || null,
      title: quoteData.title,
      description: quoteData.description || null,
      valid_until: quoteData.valid_until || null,
      notes: quoteData.notes || null,
      subtotal: subtotalCents,
      discount_amount: discountCents,
      total_amount: totalCents,
      status: "novo" as QuoteStatus,
    })
    .select("id")
    .single()) as { data: { id: string } | null; error: any }

  if (quoteError || !quote) {
    console.error("Error creating quote:", quoteError)
    return { error: "Erro ao criar orçamento. Tente novamente." }
  }

  // Create items
  const itemsToInsert = items.map((item, index) => ({
    quote_id: quote.id,
    name: item.name,
    description: item.description || null,
    quantity: item.quantity,
    unit: item.unit || null,
    unit_price: toCents(item.unit_price),
    total_price: calculateItemTotal(item.quantity, item.unit_price),
    sort_order: index,
  }))

  const { error: itemsError } = (await (supabase
    .from("quote_items") as any)
    .insert(itemsToInsert)) as { error: any }

  if (itemsError) {
    console.error("Error creating quote items:", itemsError)
    // Delete the quote if items failed
    await (supabase.from("quotes") as any).delete().eq("id", quote.id)
    return { error: "Erro ao criar itens do orçamento. Tente novamente." }
  }

  revalidatePath("/orcamentos")
  return { success: true, id: quote.id }
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = { status }

  // Set timestamp fields based on status
  if (status === "enviado") {
    updateData.sent_at = new Date().toISOString()
  } else if (status === "fechado") {
    updateData.closed_at = new Date().toISOString()
  } else if (status === "perdido") {
    updateData.lost_at = new Date().toISOString()
  }

  const { error } = (await (supabase
    .from("quotes") as any)
    .update(updateData)
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error updating quote status:", error)
    return { error: "Erro ao atualizar status." }
  }

  revalidatePath("/orcamentos")
  revalidatePath(`/orcamentos/${id}`)
  return { success: true }
}

export async function deleteQuote(id: string) {
  const supabase = await createClient()

  const { error } = (await (supabase
    .from("quotes") as any)
    .delete()
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error deleting quote:", error)
    return { error: "Erro ao excluir orçamento." }
  }

  revalidatePath("/orcamentos")
  return { success: true }
}
