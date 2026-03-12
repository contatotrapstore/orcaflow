"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CustomerDialog } from "@/components/customers/customer-dialog"
import { deleteCustomer } from "@/actions/customers"
import { Pencil, Trash2 } from "lucide-react"
import type { Customer } from "@/types/database"

interface CustomerDetailActionsProps {
  customer: Customer
}

export function CustomerDetailActions({
  customer,
}: CustomerDetailActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o cliente "${customer.name}"?`
    )
    if (!confirmed) return

    const result = await deleteCustomer(customer.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Cliente excluído com sucesso!")
      router.push("/clientes")
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setDialogOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={customer}
      />
    </>
  )
}
