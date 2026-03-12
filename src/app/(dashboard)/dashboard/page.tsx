import Link from "next/link"
import {
  FileText,
  Send,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Calendar,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn, formatBRL, formatDate } from "@/lib/utils"
import {
  QuoteStatusBadge,
  ChargeStatusBadge,
} from "@/components/shared/status-badge"
import { MetricCard } from "@/components/dashboard/metric-card"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist"
import {
  getDashboardMetrics,
  getRecentQuotes,
  getTodayFollowUps,
  getUpcomingCharges,
} from "@/actions/dashboard"
import { getOnboardingProgress } from "@/actions/onboarding"
import type { FollowUpType } from "@/types/database"

const followUpTypeLabels: Record<FollowUpType, string> = {
  follow_up_1: "Follow-up 1",
  follow_up_2: "Follow-up 2",
  follow_up_3: "Follow-up 3",
  cobranca: "Cobrança",
  manual: "Manual",
}

export default async function DashboardPage() {
  const [metrics, recentQuotes, todayFollowUps, upcomingCharges, onboardingSteps] =
    await Promise.all([
      getDashboardMetrics(),
      getRecentQuotes(5),
      getTodayFollowUps(),
      getUpcomingCharges(5),
      getOnboardingProgress(),
    ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio
        </p>
      </div>

      {/* Onboarding Checklist */}
      {onboardingSteps.length > 0 &&
        onboardingSteps.some((s) => !s.completed) && (
          <OnboardingChecklist steps={onboardingSteps} />
        )}

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          icon={FileText}
          label="Orçamentos no mês"
          value={String(metrics.quotesThisMonth)}
        />
        <MetricCard
          icon={Send}
          label="Enviados"
          value={String(metrics.quotesSent)}
          trend={metrics.quotesSent > 0 ? "up" : "neutral"}
        />
        <MetricCard
          icon={CheckCircle}
          label="Fechados"
          value={String(metrics.quotesClosed)}
          trend={metrics.quotesClosed > 0 ? "up" : "neutral"}
        />
        <MetricCard
          icon={XCircle}
          label="Perdidos"
          value={String(metrics.quotesLost)}
          trend={metrics.quotesLost > 0 ? "down" : "neutral"}
        />
        <MetricCard
          icon={TrendingUp}
          label="Taxa de conversão"
          value={`${metrics.conversionRate}%`}
          trend={
            metrics.conversionRate >= 50
              ? "up"
              : metrics.conversionRate > 0
                ? "neutral"
                : "neutral"
          }
        />
        <MetricCard
          icon={DollarSign}
          label="Valor fechado"
          value={formatBRL(metrics.totalClosedValue)}
          trend={metrics.totalClosedValue > 0 ? "up" : "neutral"}
        />
      </div>

      {/* Content sections */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Follow-ups de hoje */}
        <DashboardSection
          title="Follow-ups de hoje"
          actionLabel="Ver todos"
          actionHref="/followups"
        >
          {todayFollowUps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum follow-up para hoje
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayFollowUps.map((followUp) => (
                <div
                  key={followUp.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium truncate">
                      {followUp.customers?.name ?? "Sem cliente"}
                    </p>
                    {followUp.quotes && (
                      <p className="text-xs text-muted-foreground truncate">
                        #{followUp.quotes.quote_number} - {followUp.quotes.title}
                      </p>
                    )}
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-100"
                    >
                      {followUpTypeLabels[followUp.type]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        {/* Ultimos orcamentos */}
        <DashboardSection
          title="Últimos orçamentos"
          actionLabel="Ver todos"
          actionHref="/orcamentos"
        >
          {recentQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum orçamento criado ainda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/orcamentos/${quote.id}`}
                  className="flex items-start justify-between gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        #{quote.quote_number}
                      </span>
                      <span className="text-sm font-medium truncate">
                        {quote.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {quote.customers?.name ?? "Sem cliente"}
                    </p>
                    <div className="flex items-center gap-2">
                      <QuoteStatusBadge status={quote.status} />
                      <span className="text-xs font-medium">
                        {formatBRL(quote.total_amount)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </DashboardSection>

        {/* Cobrancas proximas */}
        <DashboardSection
          title="Cobranças próximas"
          actionLabel="Ver todos"
          actionHref="/cobrancas"
        >
          {upcomingCharges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <DollarSign className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma cobrança pendente
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingCharges.map((charge) => {
                const isOverdue =
                  charge.status === "atrasado" ||
                  charge.due_date < new Date().toISOString().split("T")[0]

                return (
                  <div
                    key={charge.id}
                    className={cn(
                      "flex items-start justify-between gap-2 rounded-lg border p-3",
                      isOverdue && "border-destructive/30 bg-destructive/5"
                    )}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium truncate">
                        {charge.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {charge.customers?.name ?? "Sem cliente"}
                      </p>
                      <div className="flex items-center gap-2">
                        <ChargeStatusBadge status={charge.status} />
                        <span className="text-xs font-medium">
                          {formatBRL(charge.amount)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(charge.due_date)}
                      </div>
                      {isOverdue && (
                        <div className="flex items-center gap-1 text-xs text-destructive font-medium">
                          <AlertCircle className="h-3 w-3" />
                          Atrasado
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </DashboardSection>
      </div>
    </div>
  )
}
