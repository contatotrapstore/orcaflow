"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
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
import { QuoteStatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { deleteQuote } from "@/actions/quotes"
import { formatBRL, formatDate } from "@/lib/utils"
import { Search, FileText, Eye, Trash2 } from "lucide-react"
import type { Quote, Customer, QuoteStatus } from "@/types/database"

type QuoteWithCustomer = Quote & { customers: Customer | null }

const statusTabs: { value: string; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "novo", label: "Novo" },
  { value: "enviado", label: "Enviado" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
]

interface QuotesListProps {
  quotes: QuoteWithCustomer[]
}

export function QuotesList({ quotes }: QuotesListProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("todos")

  const filteredQuotes = useMemo(() => {
    let result = quotes

    // Filter by status tab
    if (activeTab !== "todos") {
      result = result.filter((q) => q.status === activeTab)
    }

    // Filter by search
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(term) ||
          q.customers?.name?.toLowerCase().includes(term) ||
          q.customers?.company_name?.toLowerCase().includes(term) ||
          String(q.quote_number).includes(term)
      )
    }

    return result
  }, [quotes, activeTab, search])

  async function handleDelete(quote: QuoteWithCustomer) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o orçamento "${quote.title}"?`
    )
    if (!confirmed) return

    const result = await deleteQuote(quote.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Orçamento excluído com sucesso!")
    }
  }

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1 w-fit">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar orçamentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Table */}
      {filteredQuotes.length === 0 ? (
        quotes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhum orçamento criado"
            description="Crie seu primeiro orçamento para começar a gerenciar suas propostas."
            actionLabel="Novo Orçamento"
            actionHref="/orcamentos/novo"
          />
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum orçamento encontrado
              {search ? ` para "${search}"` : ""}.
            </p>
          </div>
        )
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">N.</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Titulo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[100px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-mono text-muted-foreground">
                    #{quote.quote_number}
                  </TableCell>
                  <TableCell>
                    {quote.customers?.name ?? (
                      <span className="text-muted-foreground">Sem cliente</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/orcamentos/${quote.id}`}
                      className="hover:underline"
                    >
                      {quote.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatBRL(quote.total_amount)}
                  </TableCell>
                  <TableCell>
                    <QuoteStatusBadge status={quote.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(quote.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        nativeButton={false}
                        render={<Link href={`/orcamentos/${quote.id}`} />}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(quote)}
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
    </div>
  )
}
