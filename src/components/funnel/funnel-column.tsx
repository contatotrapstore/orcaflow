"use client"

import { useDroppable } from "@dnd-kit/core"
import { cn, formatBRL } from "@/lib/utils"
import { FunnelCard } from "./funnel-card"
import type { Quote, QuoteStatus, Customer } from "@/types/database"

interface FunnelColumnProps {
  status: QuoteStatus
  quotes: (Quote & { customers: Customer | null })[]
  label: string
}

export function FunnelColumn({ status, quotes, label }: FunnelColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  const totalValue = quotes.reduce((sum, q) => sum + q.total_amount, 0)

  return (
    <div
      className={cn(
        "flex h-full w-72 shrink-0 flex-col rounded-xl border bg-muted/30 transition-colors",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{label}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
            {quotes.length}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {formatBRL(totalValue)}
        </span>
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
      >
        {quotes.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-xs text-muted-foreground">
              Nenhum orcamento
            </p>
          </div>
        ) : (
          quotes.map((quote) => <FunnelCard key={quote.id} quote={quote} />)
        )}
      </div>
    </div>
  )
}
