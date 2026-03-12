"use client"

import { useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { chargeSchema, type ChargeInput } from "@/lib/validators/charge"
import { createCharge, updateCharge, type ChargeActionState } from "@/actions/charges"
import { fromCents } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Charge, Quote, Customer } from "@/types/database"

interface ChargeFormProps {
  charge?: Charge & { customers?: Customer | null; quotes?: Quote | null }
  quote?: Quote & { customers?: Customer | null }
  customers?: Customer[]
}

export function ChargeForm({ charge, quote, customers }: ChargeFormProps) {
  const router = useRouter()
  const isEditing = !!charge

  // Build default values
  const defaultTitle = charge
    ? charge.title
    : quote
      ? `Cobrança - ${quote.title}`
      : ""

  const defaultAmount = charge
    ? fromCents(charge.amount)
    : quote
      ? fromCents(quote.total_amount)
      : 0

  const defaultDueDate = charge
    ? charge.due_date
    : ""

  const defaultCustomerId = charge
    ? charge.customer_id ?? ""
    : quote
      ? quote.customer_id ?? ""
      : ""

  const defaultQuoteId = charge
    ? charge.quote_id ?? ""
    : quote
      ? quote.id
      : ""

  const defaultNotes = charge?.notes ?? ""

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChargeInput>({
    resolver: zodResolver(chargeSchema) as any,
    defaultValues: {
      title: defaultTitle,
      amount: defaultAmount,
      due_date: defaultDueDate,
      customer_id: defaultCustomerId,
      quote_id: defaultQuoteId,
      notes: defaultNotes,
    },
  })

  const boundAction = isEditing
    ? updateCharge.bind(null, charge.id)
    : createCharge

  const [state, formAction, isPending] = useActionState<ChargeActionState, FormData>(
    boundAction,
    {}
  )

  useEffect(() => {
    if (state.success) {
      toast.success(isEditing ? "Cobrança atualizada!" : "Cobrança criada!")
      router.push("/cobrancas")
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, isEditing, router])

  function onValid(data: ChargeInput) {
    const fd = new FormData()
    fd.set("data", JSON.stringify(data))
    formAction(fd)
  }

  return (
    <form onSubmit={handleSubmit(onValid as any)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          placeholder="Ex: Cobrança do orçamento #123"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          {...register("amount")}
        />
        {errors.amount && (
          <p className="text-xs text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Data de vencimento *</Label>
        <Input
          id="due_date"
          type="date"
          {...register("due_date")}
        />
        {errors.due_date && (
          <p className="text-xs text-destructive">{errors.due_date.message}</p>
        )}
      </div>

      {customers && customers.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="customer_id">Cliente</Label>
          <select
            id="customer_id"
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("customer_id")}
          >
            <option value="">Selecione um cliente</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company_name ? ` (${c.company_name})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <input type="hidden" {...register("quote_id")} />

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Notas adicionais sobre a cobrança..."
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Salvar alterações" : "Criar cobrança"}
      </Button>
    </form>
  )
}
