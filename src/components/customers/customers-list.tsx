"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomerDialog } from "@/components/customers/customer-dialog"
import { deleteCustomer } from "@/actions/customers"
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import type { Customer } from "@/types/database"

interface CustomersListProps {
  customers: Customer[]
}

export function CustomersList({ customers }: CustomersListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(
    undefined
  )
  const [search, setSearch] = useState("")

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers
    const term = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.company_name?.toLowerCase().includes(term) ||
        c.whatsapp?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term)
    )
  }, [customers, search])

  function handleNew() {
    setEditingCustomer(undefined)
    setDialogOpen(true)
  }

  function handleEdit(customer: Customer) {
    setEditingCustomer(customer)
    setDialogOpen(true)
  }

  async function handleDelete(customer: Customer) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o cliente "${customer.name}"?`
    )
    if (!confirmed) return

    const result = await deleteCustomer(customer.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Cliente excluído com sucesso!")
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {filteredCustomers.length === 0 ? (
        customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Cadastre seu primeiro cliente para começar a criar orçamentos."
            actionLabel="Novo Cliente"
            onAction={handleNew}
          />
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum cliente encontrado para &quot;{search}&quot;.
            </p>
          </div>
        )
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.company_name ?? "—"}</TableCell>
                  <TableCell>{customer.whatsapp ?? "—"}</TableCell>
                  <TableCell>{customer.email ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(customer)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={editingCustomer}
      />
    </>
  )
}
