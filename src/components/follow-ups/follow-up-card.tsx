"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Check,
  Clock,
  MessageCircle,
  MoreHorizontal,
  X,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { TaskStatusBadge } from "@/components/shared/status-badge"
import { cn, formatRelativeDate, formatDate } from "@/lib/utils"
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-wa-link"
import {
  completeFollowUp,
  snoozeFollowUp,
  cancelFollowUp,
} from "@/actions/follow-ups"
import type { FollowUpWithRelations } from "@/actions/follow-ups"
import type { FollowUpType } from "@/types/database"

const followUpTypeLabels: Record<FollowUpType, string> = {
  follow_up_1: "Follow-up 1",
  follow_up_2: "Follow-up 2",
  follow_up_3: "Follow-up 3",
  cobranca: "Cobrança",
  manual: "Manual",
}

const followUpTypeBadgeStyles: Record<FollowUpType, string> = {
  follow_up_1: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  follow_up_2: "bg-blue-200 text-blue-800 hover:bg-blue-200",
  follow_up_3: "bg-blue-300 text-blue-900 hover:bg-blue-300",
  cobranca: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  manual: "bg-slate-100 text-slate-700 hover:bg-slate-100",
}

function getDateCategory(dueDate: string): "overdue" | "today" | "future" {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const dueDateStr = dueDate.split("T")[0]

  if (dueDateStr < todayStr) return "overdue"
  if (dueDateStr === todayStr) return "today"
  return "future"
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  return date.toISOString().split("T")[0]
}

interface FollowUpCardProps {
  followUp: FollowUpWithRelations
}

export function FollowUpCard({ followUp }: FollowUpCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const dateCategory = getDateCategory(followUp.due_date)
  const isPending = followUp.status === "pendente"

  async function handleComplete() {
    setIsLoading(true)
    try {
      const result = await completeFollowUp(followUp.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Follow-up concluído!")
      }
    } catch {
      toast.error("Erro ao concluir follow-up.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSnooze(days: number) {
    setIsLoading(true)
    try {
      const newDate = addDays(followUp.due_date, days)
      const result = await snoozeFollowUp(followUp.id, newDate)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Follow-up adiado para ${formatDate(newDate)}`)
      }
    } catch {
      toast.error("Erro ao adiar follow-up.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCancel() {
    setIsLoading(true)
    try {
      const result = await cancelFollowUp(followUp.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Follow-up cancelado.")
      }
    } catch {
      toast.error("Erro ao cancelar follow-up.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleWhatsApp() {
    if (!followUp.customers?.whatsapp) return
    const url = buildWhatsAppUrl(followUp.customers.whatsapp, "")
    window.open(url, "_blank")
  }

  return (
    <Card
      size="sm"
      className={cn(
        "transition-colors",
        isPending && dateCategory === "overdue" &&
          "ring-destructive/30 bg-destructive/5",
        isPending && dateCategory === "today" &&
          "ring-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20",
      )}
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Customer and quote info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium truncate">
              {followUp.customers?.name ?? "Sem cliente"}
            </span>
            {followUp.customers?.company_name && (
              <span className="text-xs text-muted-foreground truncate">
                {followUp.customers.company_name}
              </span>
            )}
          </div>

          {/* Quote reference */}
          {followUp.quotes && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="h-3 w-3 shrink-0" />
              <span className="truncate">
                #{followUp.quotes.quote_number} - {followUp.quotes.title}
              </span>
            </div>
          )}

          {/* Badges row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="secondary"
              className={cn(
                "font-medium text-xs",
                followUpTypeBadgeStyles[followUp.type]
              )}
            >
              {followUpTypeLabels[followUp.type]}
            </Badge>
            <TaskStatusBadge status={followUp.status} />
            <span
              className={cn(
                "text-xs",
                isPending && dateCategory === "overdue" && "text-destructive font-medium",
                isPending && dateCategory === "today" && "text-yellow-700 dark:text-yellow-400 font-medium",
                dateCategory === "future" && "text-muted-foreground",
              )}
            >
              {formatRelativeDate(followUp.due_date)} ({formatDate(followUp.due_date)})
            </span>
          </div>

          {/* Notes */}
          {followUp.notes && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {followUp.notes}
            </p>
          )}
        </div>

        {/* Actions */}
        {isPending && (
          <div className="flex items-center gap-1 shrink-0">
            {followUp.customers?.whatsapp && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleWhatsApp}
                disabled={isLoading}
                title="Abrir WhatsApp"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleComplete}
              disabled={isLoading}
              title="Concluir"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={isLoading}
                  />
                }
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Adiar</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleSnooze(1)}>
                  <Clock className="h-4 w-4" />
                  +1 dia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSnooze(3)}>
                  <Clock className="h-4 w-4" />
                  +3 dias
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSnooze(7)}>
                  <Clock className="h-4 w-4" />
                  +7 dias
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleComplete}>
                  <Check className="h-4 w-4" />
                  Concluir
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                  Cancelar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
