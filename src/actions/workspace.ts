"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { workspaceSchema } from "@/lib/validators/workspace"
import type { Workspace } from "@/types/database"

export type WorkspaceActionState = {
  error?: string
  success?: boolean
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

export async function getWorkspace(): Promise<Workspace | null> {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return null

  const { data, error } = (await (supabase.from("workspaces") as any)
    .select("*")
    .eq("id", workspaceId)
    .single()) as { data: Workspace | null; error: any }

  if (error) {
    console.error("Error getting workspace:", error)
    return null
  }

  return data
}

export async function updateWorkspace(
  _prevState: WorkspaceActionState,
  formData: FormData
): Promise<WorkspaceActionState> {
  const rawData = {
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    address: (formData.get("address") as string) || null,
    default_terms: (formData.get("default_terms") as string) || null,
    default_validity_days: formData.get("default_validity_days")
      ? Number(formData.get("default_validity_days"))
      : 15,
  }

  const parsed = workspaceSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return { error: "Usuário não autenticado" }
  }

  const { error } = (await (supabase.from("workspaces") as any)
    .update({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
      default_terms: parsed.data.default_terms || null,
      default_validity_days: parsed.data.default_validity_days,
    })
    .eq("id", workspaceId)) as { error: any }

  if (error) {
    console.error("Error updating workspace:", error)
    return { error: "Erro ao atualizar configurações. Tente novamente." }
  }

  revalidatePath("/configuracoes")
  return { success: true }
}

export async function uploadLogo(
  formData: FormData
): Promise<WorkspaceActionState & { url?: string }> {
  const file = formData.get("logo") as File | null

  if (!file || file.size === 0) {
    return { error: "Nenhum arquivo selecionado" }
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
  if (!allowedTypes.includes(file.type)) {
    return { error: "Formato inválido. Use JPG, PNG, WebP ou SVG." }
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: "Arquivo muito grande. Máximo 2MB." }
  }

  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return { error: "Usuário não autenticado" }
  }

  // Generate a unique file path
  const ext = file.name.split(".").pop() ?? "png"
  const filePath = `${workspaceId}/logo.${ext}`

  // For now, since Supabase Storage may not be configured,
  // we save the path as the logo_url
  const logoUrl = `/logos/${filePath}`

  // Try to upload to Supabase Storage
  try {
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      // Still save the path even if storage fails
    } else {
      // Get public URL if upload succeeded
      const { data: publicUrlData } = supabase.storage
        .from("logos")
        .getPublicUrl(filePath)

      if (publicUrlData?.publicUrl) {
        const { error: updateError } = (await (supabase.from("workspaces") as any)
          .update({ logo_url: publicUrlData.publicUrl })
          .eq("id", workspaceId)) as { error: any }

        if (updateError) {
          console.error("Error updating logo_url:", updateError)
        }

        revalidatePath("/configuracoes")
        return { success: true, url: publicUrlData.publicUrl }
      }
    }
  } catch {
    console.error("Storage not configured, saving path only")
  }

  // Fallback: save path as logo_url
  const { error: updateError } = (await (supabase.from("workspaces") as any)
    .update({ logo_url: logoUrl })
    .eq("id", workspaceId)) as { error: any }

  if (updateError) {
    console.error("Error updating logo_url:", updateError)
    return { error: "Erro ao salvar logo. Tente novamente." }
  }

  revalidatePath("/configuracoes")
  return { success: true, url: logoUrl }
}
