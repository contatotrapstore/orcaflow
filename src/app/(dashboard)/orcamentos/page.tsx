import { listQuotes } from "@/actions/quotes"
import { PageHeader } from "@/components/shared/page-header"
import { QuotesList } from "@/components/quotes/quotes-list"

export default async function OrcamentosPage() {
  const quotes = await listQuotes()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orçamentos"
        description="Gerencie seus orçamentos e propostas."
        actionLabel="Novo Orçamento"
        actionHref="/orcamentos/novo"
      />
      <QuotesList quotes={quotes} />
    </div>
  )
}
