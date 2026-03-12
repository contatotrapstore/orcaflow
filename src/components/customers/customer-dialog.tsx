"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { CustomerForm } from "@/components/customers/customer-form"
import {
  createCustomer,
  updateCustomer,
  type CustomerActionState,
} from "@/actions/customers"
import type { CustomerInput } from "@/lib/validators/customer"
import type { Customer } from "@/types/database"

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer
}

export function CustomerDialog({
  open,
  onOpenChange,
  customer,
}: CustomerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!customer

  async function handleSubmit(data: CustomerInput) {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.set("name", data.name)
      formData.set("company_name", data.company_name ?? "")
      formData.set("whatsapp", data.whatsapp ?? "")
      formData.set("email", data.email ?? "")
      formData.set("notes", data.notes ?? "")

      let result: CustomerActionState

      if (isEditing) {
        result = await updateCustomer(
          customer.id,
          {} as CustomerActionState,
          formData
        )
      } else {
        result = await createCustomer({} as CustomerActionState, formData)
      }

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          isEditing
            ? "Cliente atualizado com sucesso!"
            : "Cliente criado com sucesso!"
        )
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
          <DialogTitle>
            {isEditing ? "Editar cliente" : "Novo cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do cliente."
              : "Preencha os dados para cadastrar um novo cliente."}
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          initialData={
            isEditing
              ? {
                  name: customer.name,
                  company_name: customer.company_name,
                  whatsapp: customer.whatsapp,
                  email: customer.email,
                  notes: customer.notes,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
