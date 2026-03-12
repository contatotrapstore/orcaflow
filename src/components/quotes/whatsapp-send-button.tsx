"use client"

import * as React from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-wa-link"
import { interpolateTemplate } from "@/lib/whatsapp/message-builder"
import type { MessageVariables } from "@/lib/whatsapp/message-builder"
import { formatBRL } from "@/lib/utils"

const DEFAULT_TEMPLATE =
  "Olá, {nome}. Tudo bem?\nAcabei de preparar seu orçamento *#{numero_orcamento}*.\nEstou enviando para sua análise. Qualquer ajuste, posso adaptar rapidinho."

type WhatsAppSendButtonProps = {
  phone: string
  customerName: string
  quoteNumber: number
  totalAmount: number
  quoteId: string
}

export function WhatsAppSendButton({
  phone,
  customerName,
  quoteNumber,
  totalAmount,
  quoteId,
}: WhatsAppSendButtonProps) {
  const variables: MessageVariables = {
    nome: customerName,
    numero_orcamento: quoteNumber,
    valor_total: formatBRL(totalAmount),
  }

  const defaultMessage = interpolateTemplate(DEFAULT_TEMPLATE, variables)
  const [message, setMessage] = React.useState(defaultMessage)
  const [open, setOpen] = React.useState(false)

  // Reset message when dialog opens
  React.useEffect(() => {
    if (open) {
      setMessage(interpolateTemplate(DEFAULT_TEMPLATE, variables))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, customerName, quoteNumber, totalAmount])

  function handleSend() {
    const url = buildWhatsAppUrl(phone, message)
    window.open(url, "_blank", "noopener,noreferrer")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="default">
            <MessageCircle className="size-4" data-icon="inline-start" />
            WhatsApp
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar via WhatsApp</DialogTitle>
          <DialogDescription>
            Edite a mensagem abaixo antes de enviar para{" "}
            <strong>{customerName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="min-h-32"
          />
          <p className="text-xs text-muted-foreground">
            A mensagem será aberta no WhatsApp Web/App para envio.
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleSend} className="gap-1.5">
            <MessageCircle className="size-4" data-icon="inline-start" />
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
