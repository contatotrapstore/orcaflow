import { renderToBuffer } from "@react-pdf/renderer"
import { createClient } from "@/lib/supabase/server"
import { QuoteTemplate } from "@/lib/pdf/quote-template"
import type { QuoteFull, Workspace } from "@/types/database"
import type { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await createClient()

    // Authenticate
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Fetch quote with items and customer
    const quoteResult = (await supabase
      .from("quotes")
      .select("*, quote_items(*), customers(*)")
      .eq("id", id)
      .single()) as { data: QuoteFull | null; error: unknown }

    if (quoteResult.error || !quoteResult.data) {
      return new Response(
        JSON.stringify({ error: "Orçamento não encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const quote = quoteResult.data

    // Fetch workspace
    const workspaceResult = (await supabase
      .from("workspaces")
      .select("*")
      .eq("id", quote.workspace_id)
      .single()) as { data: Workspace | null; error: unknown }

    if (workspaceResult.error || !workspaceResult.data) {
      return new Response(
        JSON.stringify({ error: "Workspace não encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const workspace = workspaceResult.data

    // Generate PDF
    const buffer = await renderToBuffer(
      QuoteTemplate({ quote, workspace })
    )

    const filename = `orcamento-${quote.quote_number}.pdf`

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Erro ao gerar PDF:", error)
    return new Response(
      JSON.stringify({ error: "Erro interno ao gerar o PDF" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
