"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateQuoteStatus } from "@/actions/quotes"
import type { QuoteStatus } from "@/types/database"

const statusOptions: { value: QuoteStatus; label: string; color: string }[] = [
  { value: "novo", label: "Novo", color: "bg-slate-400" },
  { value: "enviado", label: "Enviado", color: "bg-blue-400" },
  { value: "aguardando", label: "Aguardando", color: "bg-yellow-400" },
  { value: "follow_up_1", label: "Follow-up 1", color: "bg-orange-400" },
  { value: "follow_up_2", label: "Follow-up 2", color: "bg-orange-500" },
  { value: "fechado", label: "Fechado", color: "bg-green-400" },
  { value: "perdido", label: "Perdido", color: "bg-red-400" },
  { value: "cobranca_pendente", label: "Cobrança Pendente", color: "bg-purple-400" },
  { value: "pago", label: "Pago", color: "bg-emerald-500" },
]

interface QuoteStatusSelectProps {
  currentStatus: QuoteStatus
  quoteId: string
  onStatusChange?: () => void
}

export function QuoteStatusSelect({
  currentStatus,
  quoteId,
  onStatusChange,
}: QuoteStatusSelectProps) {
  const [status, setStatus] = useState<QuoteStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  function handleChange(newStatus: string | null) {
    if (!newStatus) return
    const typedStatus = newStatus as QuoteStatus
    setStatus(typedStatus)

    startTransition(async () => {
      const result = await updateQuoteStatus(quoteId, typedStatus)
      if (result.error) {
        toast.error(result.error)
        setStatus(currentStatus) // revert on error
      } else {
        toast.success("Status atualizado com sucesso!")
        onStatusChange?.()
      }
    })
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[200px]">
        <SelectValue>
          {(() => {
            const opt = statusOptions.find((o) => o.value === status)
            return opt ? (
              <span className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${opt.color}`} />
                {opt.label}
              </span>
            ) : null
          })()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <span className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${opt.color}`} />
              {opt.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
