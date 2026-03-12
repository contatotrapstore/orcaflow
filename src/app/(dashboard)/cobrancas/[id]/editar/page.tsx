import { notFound } from "next/navigation"
import { getCharge } from "@/actions/charges"
import { listCustomers } from "@/actions/customers"
import { PageHeader } from "@/components/shared/page-header"
import { ChargeForm } from "@/components/charges/charge-form"

interface EditarCobrancaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarCobrancaPage({ params }: EditarCobrancaPageProps) {
  const { id } = await params
  const [charge, customers] = await Promise.all([
    getCharge(id),
    listCustomers(),
  ])

  if (!charge) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Editar Cobrança" />
      <ChargeForm charge={charge} customers={customers} />
    </div>
  )
}
