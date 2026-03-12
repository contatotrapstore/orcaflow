"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ChargeStatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { ChargeActions } from "./charge-actions"
import { formatBRL, formatDate, formatRelativeDate } from "@/lib/utils"
import { Search, Receipt } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { Charge, Customer, Quote, ChargeStatus } from "@/types/database"

type ChargeWithRelations = Charge & {
  customers: Customer | null
  quotes: Quote | null
}

interface ChargesListProps {
  charges: ChargeWithRelations[]
}

function ChargesTable({ charges }: { charges: ChargeWithRelations[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell className="font-medium">
                {charge.title}
              </TableCell>
              <TableCell>
                {charge.customers?.name ?? (
                  <span className="text-muted-foreground">Sem cliente</span>
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatBRL(charge.amount)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{formatDate(charge.due_date)}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(charge.due_date)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <ChargeStatusBadge status={charge.status} />
              </TableCell>
              <TableCell>
                <ChargeActions charge={charge} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function ChargesList({ charges }: ChargesListProps) {
  const [search, setSearch] = useState("")

  const filteredCharges = useMemo(() => {
    if (!search.trim()) return charges

    const term = search.toLowerCase()
    return charges.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.customers?.name?.toLowerCase().includes(term) ||
        c.customers?.company_name?.toLowerCase().includes(term)
    )
  }, [charges, search])

  const pendentes = useMemo(
    () => filteredCharges.filter((c) => c.status === "pendente"),
    [filteredCharges]
  )
  const atrasadas = useMemo(
    () => filteredCharges.filter((c) => c.status === "atrasado"),
    [filteredCharges]
  )
  const pagas = useMemo(
    () => filteredCharges.filter((c) => c.status === "pago"),
    [filteredCharges]
  )

  if (charges.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Nenhuma cobrança criada"
        description="Crie sua primeira cobrança para acompanhar os pagamentos dos seus orçamentos."
        actionLabel="Nova Cobrança"
        actionHref="/cobrancas/nova"
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar cobranças..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="todas">
        <TabsList>
          <TabsTrigger value="todas">
            Todas ({filteredCharges.length})
          </TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes ({pendentes.length})
          </TabsTrigger>
          <TabsTrigger value="atrasadas">
            Atrasadas ({atrasadas.length})
          </TabsTrigger>
          <TabsTrigger value="pagas">
            Pagas ({pagas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          {filteredCharges.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma cobrança encontrada
                {search ? ` para "${search}"` : ""}.
              </p>
            </div>
          ) : (
            <ChargesTable charges={filteredCharges} />
          )}
        </TabsContent>

        <TabsContent value="pendentes">
          {pendentes.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma cobrança pendente.
              </p>
            </div>
          ) : (
            <ChargesTable charges={pendentes} />
          )}
        </TabsContent>

        <TabsContent value="atrasadas">
          {atrasadas.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma cobrança atrasada.
              </p>
            </div>
          ) : (
            <ChargesTable charges={atrasadas} />
          )}
        </TabsContent>

        <TabsContent value="pagas">
          {pagas.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma cobrança paga.
              </p>
            </div>
          ) : (
            <ChargesTable charges={pagas} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
