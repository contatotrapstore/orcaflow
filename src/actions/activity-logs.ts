"use server"

import { createClient } from "@/lib/supabase/server"
import type { ActivityLog, Json } from "@/types/database"

async function getWorkspaceAndUserId() {
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

  if (!profile) return null

  return { userId: user.id, workspaceId: profile.workspace_id }
}

export async function logActivity(
  entityType: string,
  entityId: string,
  action: string,
  metadata?: Record<string, unknown>
) {
  const supabase = await createClient()
  const context = await getWorkspaceAndUserId()

  if (!context) {
    console.error("logActivity: user not authenticated")
    return
  }

  const { error } = (await (supabase.from("activity_logs") as any).insert({
    workspace_id: context.workspaceId,
    user_id: context.userId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    metadata_json: (metadata ?? {}) as Json,
  })) as { error: any }

  if (error) {
    console.error("Error logging activity:", error)
  }
}

export async function listActivityLogs(
  limit: number = 50
): Promise<ActivityLog[]> {
  const supabase = await createClient()
  const context = await getWorkspaceAndUserId()

  if (!context) return []

  const { data, error } = (await (supabase.from("activity_logs") as any)
    .select("*")
    .eq("workspace_id", context.workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit)) as { data: ActivityLog[] | null; error: any }

  if (error) {
    console.error("Error listing activity logs:", error)
    return []
  }

  return data ?? []
}

export async function getEntityActivityLogs(
  entityType: string,
  entityId: string,
  limit: number = 20
): Promise<ActivityLog[]> {
  const supabase = await createClient()
  const context = await getWorkspaceAndUserId()

  if (!context) return []

  const { data, error } = (await (supabase.from("activity_logs") as any)
    .select("*")
    .eq("workspace_id", context.workspaceId)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(limit)) as { data: ActivityLog[] | null; error: any }

  if (error) {
    console.error("Error getting entity activity logs:", error)
    return []
  }

  return data ?? []
}
