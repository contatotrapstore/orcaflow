import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { QuoteStatus, ChargeStatus, TaskStatus } from "@/types/database"

const quoteStatusConfig: Record<
  QuoteStatus,
  { label: string; className: string }
> = {
  novo: { label: "Novo", className: "bg-slate-100 text-slate-700 hover:bg-slate-100" },
  enviado: { label: "Enviado", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  aguardando: { label: "Aguardando", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  follow_up_1: { label: "Follow-up 1", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
  follow_up_2: { label: "Follow-up 2", className: "bg-orange-200 text-orange-800 hover:bg-orange-200" },
  fechado: { label: "Fechado", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  perdido: { label: "Perdido", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  cobranca_pendente: { label: "Cobrança Pendente", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  pago: { label: "Pago", className: "bg-[#208E76]/10 text-[#1a7562] hover:bg-[#208E76]/15" },
}

const chargeStatusConfig: Record<
  ChargeStatus,
  { label: string; className: string }
> = {
  pendente: { label: "Pendente", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  pago: { label: "Pago", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  atrasado: { label: "Atrasado", className: "bg-red-100 text-red-700 hover:bg-red-100" },
}

const taskStatusConfig: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  pendente: { label: "Pendente", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  concluida: { label: "Concluída", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  cancelada: { label: "Cancelada", className: "bg-slate-100 text-slate-700 hover:bg-slate-100" },
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const config = quoteStatusConfig[status]
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

export function ChargeStatusBadge({ status }: { status: ChargeStatus }) {
  const config = chargeStatusConfig[status]
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = taskStatusConfig[status]
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}
