import { listCustomers } from "@/actions/customers"
import { PageHeader } from "@/components/shared/page-header"
import { ChargeForm } from "@/components/charges/charge-form"

export default async function NovaCobrancaPage() {
  const customers = await listCustomers()

  return (
    <div className="space-y-6">
      <PageHeader title="Nova Cobrança" />
      <ChargeForm customers={customers} />
    </div>
  )
}
