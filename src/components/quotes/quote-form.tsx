"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { quoteSchema, type QuoteInput } from "@/lib/validators/quote"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { QuoteItemsEditor } from "@/components/quotes/quote-items-editor"
import { formatBRL } from "@/lib/utils"
import { calculateItemTotal } from "@/lib/utils/quote-calculations"
import { Loader2 } from "lucide-react"
import type { Customer } from "@/types/database"

interface QuoteFormProps {
  customers: Customer[]
  initialData?: Partial<QuoteInput>
  onSubmit: (data: string) => void
  isLoading?: boolean
}

export function QuoteForm({ customers, initialData, onSubmit, isLoading }: QuoteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema) as Resolver<QuoteInput>,
    defaultValues: {
      customer_id: initialData?.customer_id ?? "",
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      valid_until: initialData?.valid_until ?? "",
      notes: initialData?.notes ?? "",
      discount_amount: initialData?.discount_amount ?? 0,
      items: initialData?.items ?? [
        { name: "", description: "", quantity: 1, unit: "", unit_price: 0 },
      ],
    },
  })

  const watchItems = watch("items")
  const watchDiscount = Number(watch("discount_amount")) || 0

  const subtotalCents = watchItems?.reduce((sum, item) => {
    const qty = Number(item?.quantity) || 0
    const price = Number(item?.unit_price) || 0
    return sum + calculateItemTotal(qty, price)
  }, 0) ?? 0

  const discountCents = Math.round(watchDiscount * 100)
  const totalCents = Math.max(0, subtotalCents - discountCents)

  const selectedCustomerId = watch("customer_id")

  function handleFormSubmit(data: QuoteInput) {
    onSubmit(JSON.stringify(data))
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Customer Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="customer_id">Selecionar cliente</Label>
            <Select
              value={selectedCustomerId || undefined}
              onValueChange={(val) => setValue("customer_id", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cliente (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                    {customer.company_name ? ` — ${customer.company_name}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quote Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Orçamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: Reforma do banheiro"
              {...register("title")}
            />
            {errors.title?.message && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição geral do orçamento..."
              {...register("description")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="valid_until">Válido até</Label>
            <Input
              id="valid_until"
              type="date"
              {...register("valid_until")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteItemsEditor
            control={control}
            register={register}
            watch={watch}
            errors={errors}
          />
        </CardContent>
      </Card>

      {/* Totals & Discount */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="discount_amount">Desconto (R$)</Label>
            <Input
              id="discount_amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register("discount_amount")}
            />
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatBRL(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Desconto</span>
              <span className="font-medium text-destructive">
                {discountCents > 0 ? `- ${formatBRL(discountCents)}` : formatBRL(0)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>TOTAL</span>
              <span>{formatBRL(totalCents)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notas internas</Label>
            <Textarea
              id="notes"
              placeholder="Observações sobre este orçamento..."
              {...register("notes")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Salvando..." : "Salvar Orçamento"}
        </Button>
      </div>
    </form>
  )
}
