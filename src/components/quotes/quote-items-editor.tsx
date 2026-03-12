"use client"

import { useFieldArray, type Control, type UseFormRegister, type UseFormWatch } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { formatBRL } from "@/lib/utils"
import { calculateItemTotal } from "@/lib/utils/quote-calculations"
import type { QuoteInput } from "@/lib/validators/quote"

interface QuoteItemsEditorProps {
  control: Control<QuoteInput>
  register: UseFormRegister<QuoteInput>
  watch: UseFormWatch<QuoteInput>
  errors: any
}

export function QuoteItemsEditor({ control, register, watch, errors }: QuoteItemsEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const watchItems = watch("items")

  const subtotal = watchItems?.reduce((sum, item) => {
    const qty = Number(item?.quantity) || 0
    const price = Number(item?.unit_price) || 0
    return sum + calculateItemTotal(qty, price)
  }, 0) ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Itens</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ name: "", description: "", quantity: 1, unit: "", unit_price: 0 })
          }
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Adicionar item
        </Button>
      </div>

      {errors?.items?.root?.message && (
        <p className="text-sm text-destructive">{errors.items.root.message}</p>
      )}
      {typeof errors?.items?.message === "string" && (
        <p className="text-sm text-destructive">{errors.items.message}</p>
      )}

      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum item adicionado. Clique em &quot;Adicionar item&quot; para começar.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const qty = Number(watchItems?.[index]?.quantity) || 0
          const price = Number(watchItems?.[index]?.unit_price) || 0
          const itemTotal = calculateItemTotal(qty, price)

          return (
            <div
              key={field.id}
              className="rounded-lg border p-3 space-y-3"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Item {index + 1}
                </span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => remove(index)}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Remover item</span>
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`items.${index}.name`}>Nome *</Label>
                  <Input
                    id={`items.${index}.name`}
                    placeholder="Ex: Serviço de consultoria"
                    {...register(`items.${index}.name`)}
                  />
                  {errors?.items?.[index]?.name?.message && (
                    <p className="text-xs text-destructive">
                      {errors.items[index].name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`items.${index}.description`}>Descrição</Label>
                  <Input
                    id={`items.${index}.description`}
                    placeholder="Descrição opcional"
                    {...register(`items.${index}.description`)}
                  />
                </div>
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`items.${index}.quantity`}>Qtd *</Label>
                  <Input
                    id={`items.${index}.quantity`}
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="1"
                    {...register(`items.${index}.quantity`)}
                  />
                  {errors?.items?.[index]?.quantity?.message && (
                    <p className="text-xs text-destructive">
                      {errors.items[index].quantity.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`items.${index}.unit`}>Unidade</Label>
                  <Input
                    id={`items.${index}.unit`}
                    placeholder="un, hr, m²"
                    {...register(`items.${index}.unit`)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`items.${index}.unit_price`}>Preço Un. (R$) *</Label>
                  <Input
                    id={`items.${index}.unit_price`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    {...register(`items.${index}.unit_price`)}
                  />
                  {errors?.items?.[index]?.unit_price?.message && (
                    <p className="text-xs text-destructive">
                      {errors.items[index].unit_price.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Total</Label>
                  <div className="flex h-8 items-center rounded-lg bg-muted px-2.5 text-sm font-medium">
                    {formatBRL(itemTotal)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {fields.length > 0 && (
        <div className="flex justify-end border-t pt-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Subtotal: </span>
            <span className="font-semibold">{formatBRL(subtotal)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
