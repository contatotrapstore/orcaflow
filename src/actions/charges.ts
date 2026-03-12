"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { chargeSchema } from "@/lib/validators/charge"
import { toCents } from "@/lib/utils"
import type { Charge, ChargeStatus, Customer, Quote } from "@/types/database"

export type ChargeActionState = {
  error?: string
  success?: boolean
  id?: string
}

export type ChargeWithRelations = Charge & {
  customers: Customer | null
  quotes: Quote | null
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

export async function listCharges(filters?: {
  status?: ChargeStatus
  search?: string
}) {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return []

  let query = (supabase.from("charges") as any)
    .select("*, customers(id, name, company_name, whatsapp, email), quotes(id, title, quote_number, total_amount)")
    .eq("workspace_id", workspaceId)
    .order("due_date", { ascending: true })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`)
  }

  const { data, error } = (await query) as {
    data: ChargeWithRelations[] | null
    error: any
  }

  if (error) {
    console.error("Error listing charges:", error)
    return []
  }

  return data ?? []
}

export async function getCharge(id: string): Promise<ChargeWithRelations | null> {
  const supabase = await createClient()

  const { data, error } = (await (supabase.from("charges") as any)
    .select("*, customers(id, name, company_name, whatsapp, email), quotes(id, title, quote_number, total_amount)")
    .eq("id", id)
    .single()) as { data: ChargeWithRelations | null; error: any }

  if (error) {
    console.error("Error getting charge:", error)
    return null
  }

  return data
}

export async function createCharge(
  _prevState: ChargeActionState,
  formData: FormData
): Promise<ChargeActionState> {
  const rawJson = formData.get("data") as string

  let rawData: unknown
  try {
    rawData = JSON.parse(rawJson)
  } catch {
    return { error: "Dados inválidos" }
  }

  const parsed = chargeSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return { error: "Usuário não autenticado" }
  }

  const amountCents = toCents(parsed.data.amount)

  const { data, error } = (await (supabase.from("charges") as any)
    .insert({
      workspace_id: workspaceId,
      title: parsed.data.title,
      amount: amountCents,
      due_date: parsed.data.due_date,
      quote_id: parsed.data.quote_id || null,
      customer_id: parsed.data.customer_id || null,
      notes: parsed.data.notes || null,
      status: "pendente" as ChargeStatus,
    })
    .select("id")
    .single()) as { data: { id: string } | null; error: any }

  if (error) {
    console.error("Error creating charge:", error)
    return { error: "Erro ao criar cobrança. Tente novamente." }
  }

  revalidatePath("/cobrancas")
  return { success: true, id: data?.id }
}

export async function updateCharge(
  id: string,
  _prevState: ChargeActionState,
  formData: FormData
): Promise<ChargeActionState> {
  const rawJson = formData.get("data") as string

  let rawData: unknown
  try {
    rawData = JSON.parse(rawJson)
  } catch {
    return { error: "Dados inválidos" }
  }

  const parsed = chargeSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const amountCents = toCents(parsed.data.amount)

  const { error } = (await (supabase.from("charges") as any)
    .update({
      title: parsed.data.title,
      amount: amountCents,
      due_date: parsed.data.due_date,
      quote_id: parsed.data.quote_id || null,
      customer_id: parsed.data.customer_id || null,
      notes: parsed.data.notes || null,
    })
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error updating charge:", error)
    return { error: "Erro ao atualizar cobrança. Tente novamente." }
  }

  revalidatePath("/cobrancas")
  return { success: true, id }
}

export async function markAsPaid(id: string) {
  const supabase = await createClient()

  const { error } = (await (supabase.from("charges") as any)
    .update({
      status: "pago" as ChargeStatus,
      paid_at: new Date().toISOString(),
    })
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error marking charge as paid:", error)
    return { error: "Erro ao registrar pagamento." }
  }

  revalidatePath("/cobrancas")
  return { success: true }
}

export async function deleteCharge(id: string) {
  const supabase = await createClient()

  const { error } = (await (supabase.from("charges") as any)
    .delete()
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error deleting charge:", error)
    return { error: "Erro ao excluir cobrança." }
  }

  revalidatePath("/cobrancas")
  return { success: true }
}
