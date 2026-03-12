"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import {
  categoryLabels,
  type TemplateCategory,
} from "@/lib/validators/template"
import type { MessageTemplate } from "@/types/database"

const categoryColors: Record<TemplateCategory, string> = {
  envio: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  follow_up:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  cobranca:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  geral: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
}

interface TemplateCardProps {
  template: MessageTemplate
  onEdit: (template: MessageTemplate) => void
  onDelete: (template: MessageTemplate) => void
}

export function TemplateCard({
  template,
  onEdit,
  onDelete,
}: TemplateCardProps) {
  const category = template.category as TemplateCategory
  const colorClass = categoryColors[category] ?? categoryColors.geral
  const label = categoryLabels[category] ?? template.category

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="truncate">{template.name}</CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-xs" />}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ações</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(template)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge className={colorClass}>{label}</Badge>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {template.content}
        </p>
        <p className="text-xs text-muted-foreground">
          Criado em {formatDate(template.created_at)}
        </p>
      </CardContent>
    </Card>
  )
}
