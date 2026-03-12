"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { templateSchema } from "@/lib/validators/template"
import type { MessageTemplate } from "@/types/database"

export type TemplateActionState = {
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

export async function listTemplates(category?: string) {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return []

  let query = (supabase.from("message_templates") as any)
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = (await query) as {
    data: MessageTemplate[] | null
    error: any
  }

  if (error) {
    console.error("Error listing templates:", error)
    return []
  }

  return data ?? []
}

export async function getTemplate(id: string) {
  const supabase = await createClient()

  const { data, error } = (await (supabase.from("message_templates") as any)
    .select("*")
    .eq("id", id)
    .single()) as { data: MessageTemplate | null; error: any }

  if (error) {
    console.error("Error getting template:", error)
    return null
  }

  return data
}

export async function createTemplate(
  _prevState: TemplateActionState,
  formData: FormData
): Promise<TemplateActionState> {
  const rawData = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    content: formData.get("content") as string,
  }

  const parsed = templateSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return { error: "Usuário não autenticado" }
  }

  const { data, error } = (await (supabase
    .from("message_templates") as any)
    .insert({
      workspace_id: workspaceId,
      name: parsed.data.name,
      category: parsed.data.category,
      content: parsed.data.content,
    })
    .select("id")
    .single()) as { data: { id: string } | null; error: any }

  if (error) {
    console.error("Error creating template:", error)
    return { error: "Erro ao criar template. Tente novamente." }
  }

  revalidatePath("/configuracoes")
  return { success: true, id: data?.id }
}

export async function updateTemplate(
  id: string,
  _prevState: TemplateActionState,
  formData: FormData
): Promise<TemplateActionState> {
  const rawData = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    content: formData.get("content") as string,
  }

  const parsed = templateSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const { error } = (await (supabase
    .from("message_templates") as any)
    .update({
      name: parsed.data.name,
      category: parsed.data.category,
      content: parsed.data.content,
    })
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error updating template:", error)
    return { error: "Erro ao atualizar template. Tente novamente." }
  }

  revalidatePath("/configuracoes")
  return { success: true, id }
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient()

  const { error } = (await (supabase
    .from("message_templates") as any)
    .delete()
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error deleting template:", error)
    return { error: "Erro ao excluir template." }
  }

  revalidatePath("/configuracoes")
  return { success: true }
}
