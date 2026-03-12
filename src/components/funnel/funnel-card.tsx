"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useRouter } from "next/navigation"
import { cn, formatBRL, formatRelativeDate } from "@/lib/utils"
import type { Quote, Customer } from "@/types/database"
import { GripVertical, User } from "lucide-react"

interface FunnelCardProps {
  quote: Quote & { customers: Customer | null }
}

export function FunnelCard({ quote }: FunnelCardProps) {
  const router = useRouter()

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: quote.id,
      data: {
        quote,
        status: quote.status,
      },
    })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md",
        isDragging && "z-50 opacity-70 shadow-lg ring-2 ring-primary/30"
      )}
      onClick={() => router.push(`/orcamentos/${quote.id}`)}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          {...listeners}
          {...attributes}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {quote.customers?.name ?? "Sem cliente"}
            </span>
          </div>

          <p className="truncate text-sm font-medium leading-tight">
            {quote.title}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-primary">
              {formatBRL(quote.total_amount)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {formatRelativeDate(quote.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
