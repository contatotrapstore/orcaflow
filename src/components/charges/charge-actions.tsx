"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { deleteCharge } from "@/actions/charges"
import { PaymentDialog } from "./payment-dialog"
import { formatBRL, formatDate } from "@/lib/utils"
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-wa-link"
import { interpolateTemplate } from "@/lib/whatsapp/message-builder"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  MessageCircle,
  CheckCircle,
  Pencil,
  Trash2,
} from "lucide-react"
import type { Charge, Customer, Quote } from "@/types/database"

const CHARGE_MESSAGE_TEMPLATE =
  "Olá, {nome}. Gostaria de lembrar sobre o pagamento de {valor_total} referente ao orçamento #{numero_orcamento}, com vencimento em {data_vencimento}."

interface ChargeActionsProps {
  charge: Charge & { customers: Customer | null; quotes: Quote | null }
}

export function ChargeActions({ charge }: ChargeActionsProps) {
  const router = useRouter()

  function handleWhatsApp() {
    const phone = charge.customers?.whatsapp
    if (!phone) {
      toast.error("Cliente não possui WhatsApp cadastrado.")
      return
    }

    const message = interpolateTemplate(CHARGE_MESSAGE_TEMPLATE, {
      nome: charge.customers?.name ?? "cliente",
      valor_total: formatBRL(charge.amount),
      numero_orcamento: charge.quotes?.quote_number ?? "-",
      data_vencimento: formatDate(charge.due_date),
    })

    const url = buildWhatsAppUrl(phone, message)
    window.open(url, "_blank")
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a cobrança "${charge.title}"?`
    )
    if (!confirmed) return

    const result = await deleteCharge(charge.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Cobrança excluída com sucesso!")
    }
  }

  return (
    <div className="flex items-center gap-1">
      {charge.status !== "pago" && (
        <PaymentDialog charge={charge}>
          <Button variant="ghost" size="icon-sm" title="Registrar Pagamento">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="sr-only">Registrar Pagamento</span>
          </Button>
        </PaymentDialog>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" />}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {charge.customers?.whatsapp && (
            <DropdownMenuItem onClick={handleWhatsApp}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Cobrar via WhatsApp
            </DropdownMenuItem>
          )}
          {charge.status !== "pago" && (
            <PaymentDialog charge={charge}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Registrar Pagamento
              </DropdownMenuItem>
            </PaymentDialog>
          )}
          <DropdownMenuItem onClick={() => router.push(`/cobrancas/${charge.id}/editar`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
