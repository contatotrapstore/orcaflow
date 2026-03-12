"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TemplateCard } from "@/components/templates/template-card"
import { TemplateDialog } from "@/components/templates/template-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { deleteTemplate } from "@/actions/templates"
import {
  templateCategories,
  categoryLabels,
} from "@/lib/validators/template"
import { Plus, Search, FileText } from "lucide-react"
import type { MessageTemplate } from "@/types/database"

interface TemplatesListProps {
  templates: MessageTemplate[]
}

export function TemplatesList({ templates }: TemplatesListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<
    MessageTemplate | undefined
  >(undefined)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("todas")

  const filteredTemplates = useMemo(() => {
    let result = templates

    if (categoryFilter !== "todas") {
      result = result.filter((t) => t.category === categoryFilter)
    }

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.content.toLowerCase().includes(term)
      )
    }

    return result
  }, [templates, search, categoryFilter])

  function handleNew() {
    setEditingTemplate(undefined)
    setDialogOpen(true)
  }

  function handleEdit(template: MessageTemplate) {
    setEditingTemplate(template)
    setDialogOpen(true)
  }

  async function handleDelete(template: MessageTemplate) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o template "${template.name}"?`
    )
    if (!confirmed) return

    const result = await deleteTemplate(template.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Template excluído com sucesso!")
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v ?? "todas")}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {templateCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {filteredTemplates.length === 0 ? (
        templates.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhum template cadastrado"
            description="Crie templates de mensagem para agilizar o envio de orçamentos e cobranças."
            actionLabel="Novo Template"
            onAction={handleNew}
          />
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum template encontrado para os filtros selecionados.
            </p>
          </div>
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={editingTemplate}
      />
    </>
  )
}
