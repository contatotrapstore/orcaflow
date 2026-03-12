"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { customerSchema } from "@/lib/validators/customer"
import type { Customer } from "@/types/database"

export type CustomerActionState = {
  error?: string
  success?: boolean
  id?: string
}

export async function listCustomers(search?: string) {
  const supabase = await createClient()

  // Get workspace_id for current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: profile } = (await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .single()) as { data: { workspace_id: string } | null }

  if (!profile) {
    return []
  }

  let query = supabase
    .from("customers")
    .select("*")
    .eq("workspace_id", profile.workspace_id)
    .order("name", { ascending: true })

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,company_name.ilike.%${search}%,whatsapp.ilike.%${search}%`
    )
  }

  const { data, error } = (await query) as {
    data: Customer[] | null
    error: any
  }

  if (error) {
    console.error("Error listing customers:", error)
    return []
  }

  return data ?? []
}

export async function getCustomer(id: string) {
  const supabase = await createClient()

  const { data, error } = (await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single()) as { data: Customer | null; error: any }

  if (error) {
    console.error("Error getting customer:", error)
    return null
  }

  return data
}

export async function createCustomer(
  _prevState: CustomerActionState,
  formData: FormData
): Promise<CustomerActionState> {
  const rawData = {
    name: formData.get("name") as string,
    company_name: (formData.get("company_name") as string) || null,
    whatsapp: (formData.get("whatsapp") as string) || null,
    email: (formData.get("email") as string) || null,
    notes: (formData.get("notes") as string) || null,
  }

  const parsed = customerSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Usuário não autenticado" }
  }

  const { data: profile } = (await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .single()) as { data: { workspace_id: string } | null }

  if (!profile) {
    return { error: "Workspace não encontrado" }
  }

  const insertData = {
    workspace_id: profile.workspace_id,
    name: parsed.data.name,
    company_name: parsed.data.company_name || null,
    whatsapp: parsed.data.whatsapp || null,
    email: parsed.data.email || null,
    notes: parsed.data.notes || null,
  }

  const { data, error } = (await (supabase
    .from("customers") as any)
    .insert(insertData)
    .select("id")
    .single()) as { data: { id: string } | null; error: any }

  if (error) {
    console.error("Error creating customer:", error)
    return { error: "Erro ao criar cliente. Tente novamente." }
  }

  revalidatePath("/clientes")
  return { success: true, id: data?.id }
}

export async function updateCustomer(
  id: string,
  _prevState: CustomerActionState,
  formData: FormData
): Promise<CustomerActionState> {
  const rawData = {
    name: formData.get("name") as string,
    company_name: (formData.get("company_name") as string) || null,
    whatsapp: (formData.get("whatsapp") as string) || null,
    email: (formData.get("email") as string) || null,
    notes: (formData.get("notes") as string) || null,
  }

  const parsed = customerSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const updateData = {
    name: parsed.data.name,
    company_name: parsed.data.company_name || null,
    whatsapp: parsed.data.whatsapp || null,
    email: parsed.data.email || null,
    notes: parsed.data.notes || null,
  }

  const { error } = (await (supabase
    .from("customers") as any)
    .update(updateData)
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error updating customer:", error)
    return { error: "Erro ao atualizar cliente. Tente novamente." }
  }

  revalidatePath("/clientes")
  revalidatePath(`/clientes/${id}`)
  return { success: true, id }
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()

  const { error } = (await supabase
    .from("customers")
    .delete()
    .eq("id", id)) as { error: any }

  if (error) {
    console.error("Error deleting customer:", error)
    return { error: "Erro ao excluir cliente." }
  }

  revalidatePath("/clientes")
  return { success: true }
}
