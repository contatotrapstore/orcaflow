import { notFound } from "next/navigation"
import Link from "next/link"
import { getCustomer } from "@/actions/customers"
import { listQuotes } from "@/actions/quotes"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, Building2, StickyNote, FileText } from "lucide-react"
import { CustomerDetailActions } from "@/components/customers/customer-detail-actions"
import { QuoteStatusBadge } from "@/components/shared/status-badge"
import { formatBRL, formatDate } from "@/lib/utils"

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params
  const [customer, allQuotes] = await Promise.all([
    getCustomer(id),
    listQuotes(),
  ])

  if (!customer) {
    notFound()
  }

  const customerQuotes = allQuotes.filter((q) => q.customer_id === id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/clientes" />}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {customer.name}
          </h1>
          {customer.company_name && (
            <p className="text-sm text-muted-foreground">
              {customer.company_name}
            </p>
          )}
        </div>
        <CustomerDetailActions customer={customer} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações de contato</CardTitle>
            <CardDescription>Dados cadastrais do cliente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <p className="text-sm">{customer.whatsapp || "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="text-sm">{customer.email || "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Empresa</p>
                <p className="text-sm">
                  {customer.company_name || "Não informado"}
                </p>
              </div>
            </div>
            {customer.notes && (
              <div className="flex items-start gap-3">
                <StickyNote className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Observações</p>
                  <p className="text-sm whitespace-pre-wrap">
                    {customer.notes}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orçamentos</CardTitle>
            <CardDescription>
              Orçamentos vinculados a este cliente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerQuotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum orçamento vinculado ainda.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customerQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/orcamentos/${quote.id}`}
                    className="flex items-start justify-between gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          #{quote.quote_number}
                        </span>
                        <span className="text-sm font-medium truncate">
                          {quote.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <QuoteStatusBadge status={quote.status} />
                        <span className="text-xs font-medium">
                          {formatBRL(quote.total_amount)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(quote.created_at)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
