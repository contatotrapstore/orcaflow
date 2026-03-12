import { listCharges } from "@/actions/charges"
import { PageHeader } from "@/components/shared/page-header"
import { ChargesList } from "@/components/charges/charges-list"

export default async function CobrancasPage() {
  const charges = await listCharges()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cobranças"
        description="Gerencie as cobranças dos seus orçamentos."
        actionLabel="Nova Cobrança"
        actionHref="/cobrancas/nova"
      />
      <ChargesList charges={charges} />
    </div>
  )
}
