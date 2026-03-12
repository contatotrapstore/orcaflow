"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { OnboardingProgress } from "@/types/database"

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

export async function getOnboardingProgress(): Promise<OnboardingProgress[]> {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return []

  const { data, error } = (await (supabase.from("onboarding_progress") as any)
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true })) as {
    data: OnboardingProgress[] | null
    error: any
  }

  if (error) {
    console.error("Error fetching onboarding progress:", error)
    return []
  }

  return data ?? []
}

export async function completeOnboardingStep(
  stepKey: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return { success: false, error: "Workspace nao encontrado" }
  }

  const { error } = (await (supabase.from("onboarding_progress") as any)
    .update({ completed: true, updated_at: new Date().toISOString() })
    .eq("workspace_id", workspaceId)
    .eq("step_key", stepKey)) as { error: any }

  if (error) {
    console.error("Error completing onboarding step:", error)
    return { success: false, error: "Erro ao completar etapa" }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function skipOnboarding(): Promise<{
  success: boolean
  error?: string
}> {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return { success: false, error: "Workspace nao encontrado" }
  }

  const { error } = (await (supabase.from("onboarding_progress") as any)
    .update({ completed: true, updated_at: new Date().toISOString() })
    .eq("workspace_id", workspaceId)
    .eq("completed", false)) as { error: any }

  if (error) {
    console.error("Error skipping onboarding:", error)
    return { success: false, error: "Erro ao pular onboarding" }
  }

  revalidatePath("/dashboard")
  return { success: true }
}
