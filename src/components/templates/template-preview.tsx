"use client"

import { interpolateTemplate } from "@/lib/whatsapp/message-builder"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const EXAMPLE_DATA = {
  nome: "João Silva",
  numero_orcamento: "0042",
  valor_total: "R$ 1.500,00",
  data_vencimento: "15/04/2026",
  empresa: "Minha Empresa",
}

interface TemplatePreviewProps {
  content: string
}

export function TemplatePreview({ content }: TemplatePreviewProps) {
  const interpolated = interpolateTemplate(content, EXAMPLE_DATA)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Template original
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">
            {content || (
              <span className="italic text-muted-foreground">
                Nenhum conteúdo ainda...
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Pré-visualização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">
            {content ? (
              interpolated
            ) : (
              <span className="italic text-muted-foreground">
                Nenhum conteúdo ainda...
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
