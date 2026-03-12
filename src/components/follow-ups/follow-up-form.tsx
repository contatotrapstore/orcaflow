"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { followUpSchema, type FollowUpInput, type FollowUpFormValues } from "@/lib/validators/follow-up"
import {
  createFollowUp,
  type FollowUpActionState,
} from "@/actions/follow-ups"
import type { Customer } from "@/types/database"

interface FollowUpFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
}

export function FollowUpFormDialog({
  open,
  onOpenChange,
  customers,
}: FollowUpFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      type: "manual",
      due_date: "",
      customer_id: null,
      notes: null,
    },
  })

  async function onSubmit(data: FollowUpFormValues) {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.set("type", data.type ?? "manual")
      formData.set("due_date", data.due_date)
      if (data.customer_id) formData.set("customer_id", data.customer_id)
      if (data.quote_id) formData.set("quote_id", data.quote_id)
      if (data.message_template_id) formData.set("message_template_id", data.message_template_id)
      if (data.notes) formData.set("notes", data.notes)

      const result: FollowUpActionState = await createFollowUp(
        {} as FollowUpActionState,
        formData
      )

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Follow-up criado com sucesso!")
        reset()
        onOpenChange(false)
      }
    } catch {
      toast.error("Ocorreu um erro inesperado.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Follow-up</DialogTitle>
          <DialogDescription>
            Crie uma tarefa de follow-up manual.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer selector */}
          <div className="space-y-2">
            <Label htmlFor="customer_id">Cliente</Label>
            <Controller
              name="customer_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(val: string | null) =>
                    field.onChange(val || null)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                        {customer.company_name
                          ? ` (${customer.company_name})`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <Label htmlFor="due_date">Data de vencimento *</Label>
            <Input
              id="due_date"
              type="date"
              {...register("due_date")}
            />
            {errors.due_date && (
              <p className="text-xs text-destructive">
                {errors.due_date.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? "manual"}
                  onValueChange={(val: string | null) =>
                    field.onChange(val || "manual")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="follow_up_1">Follow-up 1</SelectItem>
                    <SelectItem value="follow_up_2">Follow-up 2</SelectItem>
                    <SelectItem value="follow_up_3">Follow-up 3</SelectItem>
                    <SelectItem value="cobranca">Cobrança</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Anotações sobre o follow-up..."
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-destructive">
                {errors.notes.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar follow-up
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
