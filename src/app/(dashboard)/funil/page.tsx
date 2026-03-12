import { getQuotesForFunnel } from "@/actions/funnel"
import { PageHeader } from "@/components/shared/page-header"
import { FunnelBoard } from "@/components/funnel/funnel-board"

export default async function FunilPage() {
  const data = await getQuotesForFunnel()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funil de Vendas"
        description="Acompanhe seus orcamentos em cada etapa do funil"
      />

      <div className="min-h-[calc(100vh-12rem)]">
        <FunnelBoard initialData={data} />
      </div>
    </div>
  )
}
