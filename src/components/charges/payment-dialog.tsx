"use client"

import { useState } from "react"
import { toast } from "sonner"
import { markAsPaid } from "@/actions/charges"
import { formatBRL } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2 } from "lucide-react"
import type { Charge } from "@/types/database"

interface PaymentDialogProps {
  charge: Charge
  children: React.ReactNode
}

export function PaymentDialog({ charge, children }: PaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleConfirm() {
    setIsLoading(true)
    const result = await markAsPaid(charge.id)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Pagamento registrado com sucesso!")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span className="contents" />}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Pagamento</DialogTitle>
          <DialogDescription>
            Confirme o recebimento do pagamento desta cobrança.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border p-3 space-y-1">
            <p className="text-sm font-medium">{charge.title}</p>
            <p className="text-lg font-bold text-green-600">
              {formatBRL(charge.amount)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_date">Data do pagamento</Label>
            <Input
              id="payment_date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              O pagamento será registrado com a data de hoje.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Confirmar Pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
