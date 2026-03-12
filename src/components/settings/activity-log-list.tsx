"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Users,
  CreditCard,
  Bell,
  Settings,
  Activity,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { ActivityLog } from "@/types/database"

interface ActivityLogListProps {
  logs: ActivityLog[]
}

const entityTypeIcons: Record<string, React.ElementType> = {
  quote: FileText,
  customer: Users,
  charge: CreditCard,
  follow_up: Bell,
  workspace: Settings,
}

const entityTypeLabels: Record<string, string> = {
  quote: "orçamento",
  customer: "cliente",
  charge: "cobrança",
  follow_up: "follow-up",
  workspace: "workspace",
  template: "template",
}

const actionLabels: Record<string, string> = {
  create: "criou",
  update: "atualizou",
  delete: "excluiu",
  status_change: "alterou status de",
}

function getActionDescription(log: ActivityLog): string {
  const actionLabel = actionLabels[log.action] ?? log.action
  const entityLabel = entityTypeLabels[log.entity_type] ?? log.entity_type

  const metadata = log.metadata_json as Record<string, unknown> | null
  const entityName = metadata?.name ?? metadata?.title ?? ""

  if (entityName) {
    return `${actionLabel} ${entityLabel} "${entityName}"`
  }

  return `${actionLabel} ${entityLabel}`
}

function getRelativeDate(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: ptBR,
    })
  } catch {
    return dateStr
  }
}

export function ActivityLogList({ logs }: ActivityLogListProps) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Histórico de ações realizadas no workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Nenhuma atividade registrada ainda.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              As ações realizadas no sistema aparecerão aqui.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>
          Histórico de ações realizadas no workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-1">
            {logs.map((log) => {
              const Icon =
                entityTypeIcons[log.entity_type] ?? Activity

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      {getActionDescription(log)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getRelativeDate(log.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
