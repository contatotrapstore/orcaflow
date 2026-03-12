"use client"

import { useState } from "react"
import { AlertTriangle, Clock, CalendarCheck, ListChecks } from "lucide-react"
import { FollowUpCard } from "@/components/follow-ups/follow-up-card"
import { FollowUpFormDialog } from "@/components/follow-ups/follow-up-form"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import type { FollowUpWithRelations } from "@/actions/follow-ups"
import type { Customer } from "@/types/database"

interface FollowUpSection {
  title: string
  icon: React.ReactNode
  headerClassName: string
  items: FollowUpWithRelations[]
}

interface FollowUpListProps {
  overdue: FollowUpWithRelations[]
  today: FollowUpWithRelations[]
  upcoming: FollowUpWithRelations[]
  customers: Customer[]
}

export function FollowUpList({
  overdue,
  today,
  upcoming,
  customers,
}: FollowUpListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const totalCount = overdue.length + today.length + upcoming.length

  const sections: FollowUpSection[] = [
    {
      title: "Atrasados",
      icon: <AlertTriangle className="h-4 w-4" />,
      headerClassName: "text-destructive",
      items: overdue,
    },
    {
      title: "Hoje",
      icon: <Clock className="h-4 w-4" />,
      headerClassName: "text-yellow-700 dark:text-yellow-400",
      items: today,
    },
    {
      title: "Próximos",
      icon: <CalendarCheck className="h-4 w-4" />,
      headerClassName: "text-muted-foreground",
      items: upcoming,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups"
        description="Gerencie suas tarefas de acompanhamento."
        actionLabel="Novo Follow-up"
        onAction={() => setDialogOpen(true)}
      />

      {totalCount === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nenhum follow-up encontrado"
          description="Crie um follow-up para acompanhar seus orçamentos e clientes."
          actionLabel="Novo Follow-up"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {sections.map((section) => {
            if (section.items.length === 0) return null

            return (
              <div key={section.title} className="space-y-3">
                <div className={`flex items-center gap-2 ${section.headerClassName}`}>
                  {section.icon}
                  <h2 className="text-sm font-semibold uppercase tracking-wide">
                    {section.title}
                  </h2>
                  <span className="text-xs font-medium rounded-full bg-muted px-2 py-0.5">
                    {section.items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {section.items.map((followUp) => (
                    <FollowUpCard key={followUp.id} followUp={followUp} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <FollowUpFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customers={customers}
      />
    </div>
  )
}
