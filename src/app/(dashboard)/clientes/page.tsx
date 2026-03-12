import { listCustomers } from "@/actions/customers"
import { PageHeader } from "@/components/shared/page-header"
import { CustomersList } from "@/components/customers/customers-list"

export default async function ClientesPage() {
  const customers = await listCustomers()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerencie seus clientes e contatos."
      />
      <CustomersList customers={customers} />
    </div>
  )
}
