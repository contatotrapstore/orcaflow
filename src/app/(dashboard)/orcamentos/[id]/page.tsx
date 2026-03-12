import { notFound } from "next/navigation"
import Link from "next/link"
import { getQuoteWithItems } from "@/actions/quotes"
import { PageHeader } from "@/components/shared/page-header"
import { QuoteStatusBadge } from "@/components/shared/status-badge"
import { QuoteStatusSelect } from "@/components/quotes/quote-status-select"
import { WhatsAppSendButton } from "@/components/quotes/whatsapp-send-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatBRL, formatDate, fromCents } from "@/lib/utils"
import { getEntityActivityLogs } from "@/actions/activity-logs"
import { FileDown, ArrowLeft, User, Calendar, StickyNote, Activity } from "lucide-react"

interface QuoteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params
  const [quote, activityLogs] = await Promise.all([
    getQuoteWithItems(id),
    getEntityActivityLogs("quote", id),
  ])

  if (!quote) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href="/orcamentos" />}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Orçamento #{quote.quote_number}
              </h1>
              <QuoteStatusBadge status={quote.status} />
            </div>
            <p className="text-sm text-muted-foreground">{quote.title}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <QuoteStatusSelect currentStatus={quote.status} quoteId={quote.id} />
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/api/quotes/${quote.id}/pdf`} target="_blank" />}
          >
            <FileDown className="size-4" data-icon="inline-start" />
            Gerar PDF
          </Button>
          {quote.customers?.whatsapp && (
            <WhatsAppSendButton
              phone={quote.customers.whatsapp}
              customerName={quote.customers.name}
              quoteNumber={quote.quote_number}
              totalAmount={quote.total_amount}
              quoteId={quote.id}
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {quote.description && (
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{quote.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead>Un.</TableHead>
                      <TableHead className="text-right">Preço Un.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quote.quote_items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{item.name}</span>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell>{item.unit ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          {formatBRL(item.unit_price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatBRL(item.total_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatBRL(quote.subtotal)}</span>
                  </div>
                  {quote.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Desconto</span>
                      <span className="font-medium text-destructive">
                        - {formatBRL(quote.discount_amount)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>TOTAL</span>
                    <span>{formatBRL(quote.total_amount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {quote.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{quote.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote.customers ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome: </span>
                    <span className="font-medium">{quote.customers.name}</span>
                  </div>
                  {quote.customers.company_name && (
                    <div>
                      <span className="text-muted-foreground">Empresa: </span>
                      <span>{quote.customers.company_name}</span>
                    </div>
                  )}
                  {quote.customers.whatsapp && (
                    <div>
                      <span className="text-muted-foreground">WhatsApp: </span>
                      <span>{quote.customers.whatsapp}</span>
                    </div>
                  )}
                  {quote.customers.email && (
                    <div>
                      <span className="text-muted-foreground">E-mail: </span>
                      <span>{quote.customers.email}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum cliente vinculado.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Datas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Criado em: </span>
                  <span>{formatDate(quote.created_at)}</span>
                </div>
                {quote.valid_until && (
                  <div>
                    <span className="text-muted-foreground">Válido até: </span>
                    <span>{formatDate(quote.valid_until)}</span>
                  </div>
                )}
                {quote.sent_at && (
                  <div>
                    <span className="text-muted-foreground">Enviado em: </span>
                    <span>{formatDate(quote.sent_at)}</span>
                  </div>
                )}
                {quote.closed_at && (
                  <div>
                    <span className="text-muted-foreground">Fechado em: </span>
                    <span>{formatDate(quote.closed_at)}</span>
                  </div>
                )}
                {quote.lost_at && (
                  <div>
                    <span className="text-muted-foreground">Perdido em: </span>
                    <span>{formatDate(quote.lost_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Atividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma atividade registrada ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5" />
                        <div className="flex-1 w-px bg-border" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(log.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
