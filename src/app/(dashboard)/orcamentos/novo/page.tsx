import { listCustomers } from "@/actions/customers"
import { PageHeader } from "@/components/shared/page-header"
import { NewQuoteForm } from "@/components/quotes/new-quote-form"

export default async function NovoOrcamentoPage() {
  const customers = await listCustomers()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo Orçamento"
        description="Crie um novo orçamento para enviar ao cliente."
      />
      <NewQuoteForm customers={customers} />
    </div>
  )
}
