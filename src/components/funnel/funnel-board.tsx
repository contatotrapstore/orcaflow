"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FunnelColumn } from "./funnel-column"
import { updateQuoteStatus } from "@/actions/funnel"
import type { Quote, QuoteStatus, Customer } from "@/types/database"

type QuoteWithCustomer = Quote & { customers: Customer | null }

const STATUS_COLUMNS: { status: QuoteStatus; label: string }[] = [
  { status: "novo", label: "Novo" },
  { status: "enviado", label: "Enviado" },
  { status: "aguardando", label: "Aguardando" },
  { status: "follow_up_1", label: "Follow-up 1" },
  { status: "follow_up_2", label: "Follow-up 2" },
  { status: "fechado", label: "Fechado" },
  { status: "perdido", label: "Perdido" },
]

interface FunnelBoardProps {
  initialData: Record<string, QuoteWithCustomer[]>
}

export function FunnelBoard({ initialData }: FunnelBoardProps) {
  const router = useRouter()
  const [columns, setColumns] =
    useState<Record<string, QuoteWithCustomer[]>>(initialData)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      if (!over) return

      const quoteId = active.id as string
      const sourceStatus = (active.data.current?.status as QuoteStatus) ?? null
      const targetStatus = (over.id as QuoteStatus) ?? null

      if (!sourceStatus || !targetStatus || sourceStatus === targetStatus) {
        return
      }

      // Find the quote being moved
      const quote = columns[sourceStatus]?.find((q) => q.id === quoteId)
      if (!quote) return

      // Optimistic update
      setColumns((prev) => {
        const newColumns = { ...prev }
        newColumns[sourceStatus] = prev[sourceStatus].filter(
          (q) => q.id !== quoteId
        )
        const updatedQuote: QuoteWithCustomer = {
          ...quote,
          status: targetStatus,
        }
        newColumns[targetStatus] = [updatedQuote, ...prev[targetStatus]]
        return newColumns
      })

      // Persist to database
      const result = await updateQuoteStatus(quoteId, targetStatus)

      if (result.success) {
        toast.success("Status atualizado com sucesso")
        router.refresh()
      } else {
        // Rollback optimistic update on error
        setColumns((prev) => {
          const newColumns = { ...prev }
          newColumns[targetStatus] = prev[targetStatus].filter(
            (q) => q.id !== quoteId
          )
          newColumns[sourceStatus] = [quote, ...prev[sourceStatus]]
          return newColumns
        })
        toast.error(result.error ?? "Erro ao atualizar status")
      }
    },
    [columns, router]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map(({ status, label }) => (
          <FunnelColumn
            key={status}
            status={status}
            label={label}
            quotes={columns[status] ?? []}
          />
        ))}
      </div>
    </DndContext>
  )
}
