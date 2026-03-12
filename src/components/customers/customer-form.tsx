"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { customerSchema, type CustomerInput } from "@/lib/validators/customer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CustomerFormProps {
  initialData?: CustomerInput
  onSubmit: (data: CustomerInput) => void
  isLoading?: boolean
}

export function CustomerForm({
  initialData,
  onSubmit,
  isLoading,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      company_name: initialData?.company_name ?? "",
      whatsapp: initialData?.whatsapp ?? "",
      email: initialData?.email ?? "",
      notes: initialData?.notes ?? "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" placeholder="Nome do cliente" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_name">Empresa</Label>
        <Input
          id="company_name"
          placeholder="Nome da empresa"
          {...register("company_name")}
        />
        {errors.company_name && (
          <p className="text-xs text-destructive">
            {errors.company_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          placeholder="(00) 00000-0000"
          {...register("whatsapp")}
        />
        {errors.whatsapp && (
          <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="cliente@email.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Anotações sobre o cliente..."
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? "Salvar alterações" : "Criar cliente"}
      </Button>
    </form>
  )
}
