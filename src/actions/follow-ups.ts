"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { followUpSchema } from "@/lib/validators/follow-up"
import type { FollowUpTask, Quote, Customer, TaskStatus } from "@/types/database"

export type FollowUpActionState = {
  error?: string
  success?: boolean
  id?: string
}

export type FollowUpWithRelations = FollowUpTask & {
  quotes: Pick<Quote, "id" | "title" | "quote_number" | "total_amount"> | null
  customers: Pick<Customer, "id" | "name" | "company_name" | "whatsapp"> | null
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

export async function listFollowUps(filters?: {
  status?: TaskStatus
  date?: "today" | "overdue" | "upcoming"
}) {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return []

  let query = (supabase.from("follow_up_tasks") as any)
    .select(
      "*, quotes(id, title, quote_number, total_amount), customers(id, name, company_name, whatsapp)"
    )
    .eq("workspace_id", workspaceId)
    .order("due_date", { ascending: true })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.date) {
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]

    if (filters.date === "today") {
      query = query.eq("due_date", todayStr)
    } else if (filters.date === "overdue") {
      query = query.lt("due_date", todayStr).eq("status", "pendente")
    } else if (filters.date === "upcoming") {
      query = query.gt("due_date", todayStr)
    }
  }

  const { data, error } = (await query) as {
    data: FollowUpWithRelations[] | null
    error: any
  }

  if (error) {
    console.error("Error listing follow-ups:", error)
    return []
  }

  return data ?? []
}

export async function createFollowUp(
  _prevState: FollowUpActionState,
  formData: FormData
): Promise<FollowUpActionState> {
  const rawData = {
    type: (formData.get("type") as string) || "manual",
    due_date: formData.get("due_date") as string,
    quote_id: (formData.get("quote_id") as string) || null,
    customer_id: (formData.get("customer_id") as string) || null,
    message_template_id: (formData.get("message_template_id") as string) || null,
    notes: (formData.get("notes") as string) || null,
  }

  const parsed = followUpSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return { error: "Usuário não autenticado" }
  }

  const { data, error } = (await (supabase
    .from("follow_up_tasks") as any)
    .insert({
      workspace_id: workspaceId,
      type: parsed.data.type,
      due_date: parsed.data.due_date,
      quote_id: parsed.data.quote_id || null,
      customer_id: parsed.data.customer_id || null,
      message_template_id: parsed.data.message_template_id || null,
      notes: parsed.data.notes || null,
      status: "pendente",
    })
    .select("id")
    .single()) as { data: { id: string } | null; error: any }

  if (error) {
    console.error("Error creating follow-up:", error)
    return { error: "Erro ao criar follow-up. Tente novamente." }
  }

  revalidatePath("/followups")
  return { success: true, id: data?.id }
}

export async function completeFollowUp(id: string) {
  const supabase = await createClient()

  const { error } = (await (supabase
    .from("follow_up_tasks") as any)
    .update({
      status: "concluida",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error completing follow-up:", error)
    return { error: "Erro ao concluir follow-up." }
  }

  revalidatePath("/followups")
  return { success: true }
}

export async function snoozeFollowUp(id: string, newDate: string) {
  const supabase = await createClient()

  const { error } = (await (supabase
    .from("follow_up_tasks") as any)
    .update({
      due_date: newDate,
    })
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error snoozing follow-up:", error)
    return { error: "Erro ao adiar follow-up." }
  }

  revalidatePath("/followups")
  return { success: true }
}

export async function cancelFollowUp(id: string) {
  const supabase = await createClient()

  const { error } = (await (supabase
    .from("follow_up_tasks") as any)
    .update({
      status: "cancelada",
    })
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error cancelling follow-up:", error)
    return { error: "Erro ao cancelar follow-up." }
  }

  revalidatePath("/followups")
  return { success: true }
}
