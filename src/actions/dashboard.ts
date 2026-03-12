"use server"

import { createClient } from "@/lib/supabase/server"
import type {
  QuoteWithCustomer,
  Charge,
  Customer,
  FollowUpTask,
  Quote,
} from "@/types/database"

type ChargeWithCustomer = Charge & { customers: Customer | null }

type FollowUpWithQuoteAndCustomer = FollowUpTask & {
  quotes: Pick<Quote, "id" | "title" | "quote_number"> | null
  customers: Pick<Customer, "id" | "name" | "company_name" | "whatsapp"> | null
}

export type DashboardMetrics = {
  quotesThisMonth: number
  quotesSent: number
  quotesClosed: number
  quotesLost: number
  conversionRate: number
  totalClosedValue: number
  pendingCharges: number
  overdueCharges: number
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

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) {
    return {
      quotesThisMonth: 0,
      quotesSent: 0,
      quotesClosed: 0,
      quotesLost: 0,
      conversionRate: 0,
      totalClosedValue: 0,
      pendingCharges: 0,
      overdueCharges: 0,
    }
  }

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
  const today = now.toISOString().split("T")[0]

  // Fetch all quotes this month
  const { data: quotesThisMonthData } = (await (supabase.from("quotes") as any)
    .select("id, status, total_amount")
    .eq("workspace_id", workspaceId)
    .gte("created_at", firstDayOfMonth)) as {
    data: { id: string; status: string; total_amount: number }[] | null
    error: any
  }

  const quotes = quotesThisMonthData ?? []

  const quotesThisMonth = quotes.length
  const quotesSent = quotes.filter((q) =>
    ["enviado", "follow_up_1", "follow_up_2", "aguardando"].includes(q.status)
  ).length
  const quotesClosed = quotes.filter((q) => q.status === "fechado").length
  const quotesLost = quotes.filter((q) => q.status === "perdido").length

  const conversionRate =
    quotesClosed + quotesLost > 0
      ? Math.round((quotesClosed / (quotesClosed + quotesLost)) * 100)
      : 0

  const totalClosedValue = quotes
    .filter((q) => q.status === "fechado")
    .reduce((sum, q) => sum + (q.total_amount ?? 0), 0)

  // Fetch pending and overdue charges
  const { data: chargesData } = (await (supabase.from("charges") as any)
    .select("id, status, due_date")
    .eq("workspace_id", workspaceId)
    .in("status", ["pendente", "atrasado"])) as {
    data: { id: string; status: string; due_date: string }[] | null
    error: any
  }

  const charges = chargesData ?? []

  const pendingCharges = charges.length
  const overdueCharges = charges.filter(
    (c) => c.status === "atrasado" || c.due_date < today
  ).length

  return {
    quotesThisMonth,
    quotesSent,
    quotesClosed,
    quotesLost,
    conversionRate,
    totalClosedValue,
    pendingCharges,
    overdueCharges,
  }
}

export async function getRecentQuotes(
  limit = 5
): Promise<QuoteWithCustomer[]> {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return []

  const { data, error } = (await (supabase.from("quotes") as any)
    .select("*, customers(id, name, company_name, whatsapp, email)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit)) as { data: QuoteWithCustomer[] | null; error: any }

  if (error) {
    console.error("Error fetching recent quotes:", error)
    return []
  }

  return data ?? []
}

export async function getTodayFollowUps(): Promise<
  FollowUpWithQuoteAndCustomer[]
> {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return []

  const today = new Date().toISOString().split("T")[0]

  const { data, error } = (await (supabase.from("follow_up_tasks") as any)
    .select(
      "*, quotes(id, title, quote_number), customers(id, name, company_name, whatsapp)"
    )
    .eq("workspace_id", workspaceId)
    .eq("status", "pendente")
    .lte("due_date", today)
    .order("due_date", { ascending: true })) as {
    data: FollowUpWithQuoteAndCustomer[] | null
    error: any
  }

  if (error) {
    console.error("Error fetching today follow-ups:", error)
    return []
  }

  return data ?? []
}

export async function getUpcomingCharges(
  limit = 5
): Promise<ChargeWithCustomer[]> {
  const supabase = await createClient()
  const workspaceId = await getWorkspaceId()

  if (!workspaceId) return []

  const { data, error } = (await (supabase.from("charges") as any)
    .select("*, customers(id, name, company_name, whatsapp, email)")
    .eq("workspace_id", workspaceId)
    .in("status", ["pendente", "atrasado"])
    .order("due_date", { ascending: true })
    .limit(limit)) as { data: ChargeWithCustomer[] | null; error: any }

  if (error) {
    console.error("Error fetching upcoming charges:", error)
    return []
  }

  return data ?? []
}
