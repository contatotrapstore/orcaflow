import { Document, Page, Text, View, Image } from "@react-pdf/renderer"
import type { QuoteFull, Workspace } from "@/types/database"
import { fromCents } from "@/lib/utils"
import { pdfStyles as s } from "./pdf-styles"

type QuoteTemplateProps = {
  quote: QuoteFull
  workspace: Workspace
}

function formatBRLpdf(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(fromCents(cents))
}

function formatDateBR(date: string | null): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
}

export function QuoteTemplate({ quote, workspace }: QuoteTemplateProps) {
  const customer = quote.customers
  const items = quote.quote_items.sort((a, b) => a.sort_order - b.sort_order)

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            {workspace.logo_url ? (
              <Image src={workspace.logo_url} style={s.logo} />
            ) : null}
            <View>
              <Text style={s.workspaceName}>{workspace.name}</Text>
              {workspace.phone ? (
                <Text style={s.workspaceInfo}>{workspace.phone}</Text>
              ) : null}
              {workspace.email ? (
                <Text style={s.workspaceInfo}>{workspace.email}</Text>
              ) : null}
              {workspace.address ? (
                <Text style={s.workspaceInfo}>{workspace.address}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Quote info */}
        <View style={s.quoteInfoSection}>
          <View style={s.quoteNumberBox}>
            <Text style={s.quoteNumberText}>
              ORÇAMENTO #{quote.quote_number}
            </Text>
          </View>
          <View style={s.quoteDetails}>
            <View style={s.quoteDetailRow}>
              <Text style={s.labelText}>Data:</Text>
              <Text style={s.valueText}>
                {formatDateBR(quote.created_at)}
              </Text>
            </View>
            {quote.valid_until ? (
              <View style={s.quoteDetailRow}>
                <Text style={s.labelText}>Validade:</Text>
                <Text style={s.valueText}>
                  {formatDateBR(quote.valid_until)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Customer info */}
        {customer ? (
          <View style={s.customerSection}>
            <Text style={s.sectionTitle}>Cliente</Text>
            <View style={s.customerRow}>
              <Text style={s.customerLabel}>Nome:</Text>
              <Text style={s.customerValue}>{customer.name}</Text>
            </View>
            {customer.company_name ? (
              <View style={s.customerRow}>
                <Text style={s.customerLabel}>Empresa:</Text>
                <Text style={s.customerValue}>{customer.company_name}</Text>
              </View>
            ) : null}
            {customer.whatsapp ? (
              <View style={s.customerRow}>
                <Text style={s.customerLabel}>WhatsApp:</Text>
                <Text style={s.customerValue}>{customer.whatsapp}</Text>
              </View>
            ) : null}
            {customer.email ? (
              <View style={s.customerRow}>
                <Text style={s.customerLabel}>E-mail:</Text>
                <Text style={s.customerValue}>{customer.email}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Items table */}
        <View style={s.table}>
          <Text style={s.sectionTitle}>Itens</Text>

          {/* Table header */}
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderText, { width: "28%" }]}>Item</Text>
            <Text style={[s.tableHeaderText, { width: "22%" }]}>
              Descrição
            </Text>
            <Text
              style={[s.tableHeaderText, { width: "8%", textAlign: "center" }]}
            >
              Qtd
            </Text>
            <Text
              style={[
                s.tableHeaderText,
                { width: "10%", textAlign: "center" },
              ]}
            >
              Unidade
            </Text>
            <Text
              style={[
                s.tableHeaderText,
                { width: "16%", textAlign: "right" },
              ]}
            >
              Valor Unit.
            </Text>
            <Text
              style={[
                s.tableHeaderText,
                { width: "16%", textAlign: "right" },
              ]}
            >
              Total
            </Text>
          </View>

          {/* Table rows */}
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[s.tableRow, index % 2 === 0 ? s.tableRowEven : {}]}
            >
              <Text style={s.tableCellItem}>{item.name}</Text>
              <Text style={s.tableCellDescription}>
                {item.description ?? ""}
              </Text>
              <Text style={s.tableCellQty}>{item.quantity}</Text>
              <Text style={s.tableCellUnit}>{item.unit ?? "un"}</Text>
              <Text style={s.tableCellUnitPrice}>
                {formatBRLpdf(item.unit_price)}
              </Text>
              <Text style={s.tableCellTotal}>
                {formatBRLpdf(item.total_price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsSection}>
          <View style={s.totalsBox}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Subtotal</Text>
              <Text style={s.totalValue}>
                {formatBRLpdf(quote.subtotal)}
              </Text>
            </View>
            {quote.discount_amount > 0 ? (
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Desconto</Text>
                <Text style={s.totalValue}>
                  - {formatBRLpdf(quote.discount_amount)}
                </Text>
              </View>
            ) : null}
            <View style={s.grandTotalRow}>
              <Text style={s.grandTotalLabel}>TOTAL</Text>
              <Text style={s.grandTotalValue}>
                {formatBRLpdf(quote.total_amount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes / Observations */}
        {quote.notes ? (
          <View style={s.notesSection}>
            <Text style={s.notesTitle}>Observações</Text>
            <Text style={s.notesText}>{quote.notes}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={s.footer} fixed>
          {workspace.default_terms ? (
            <Text style={s.footerTerms}>{workspace.default_terms}</Text>
          ) : null}
          <Text style={s.footerBrand}>Gerado por OrçaFlow</Text>
        </View>
      </Page>
    </Document>
  )
}
