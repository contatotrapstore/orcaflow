"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { TemplateForm } from "@/components/templates/template-form"
import { TemplatePreview } from "@/components/templates/template-preview"
import {
  createTemplate,
  updateTemplate,
  type TemplateActionState,
} from "@/actions/templates"
import type { TemplateInput } from "@/lib/validators/template"
import type { MessageTemplate } from "@/types/database"

interface TemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: MessageTemplate
}

export function TemplateDialog({
  open,
  onOpenChange,
  template,
}: TemplateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [previewContent, setPreviewContent] = useState(
    template?.content ?? ""
  )
  const isEditing = !!template

  const handleContentChange = useCallback((content: string) => {
    setPreviewContent(content)
  }, [])

  async function handleSubmit(data: TemplateInput) {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.set("name", data.name)
      formData.set("category", data.category)
      formData.set("content", data.content)

      let result: TemplateActionState

      if (isEditing) {
        result = await updateTemplate(
          template.id,
          {} as TemplateActionState,
          formData
        )
      } else {
        result = await createTemplate({} as TemplateActionState, formData)
      }

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          isEditing
            ? "Template atualizado com sucesso!"
            : "Template criado com sucesso!"
        )
        onOpenChange(false)
      }
    } catch {
      toast.error("Ocorreu um erro inesperado.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setPreviewContent("")
        }
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar template" : "Novo template"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do template de mensagem."
              : "Preencha os dados para criar um novo template de mensagem."}
          </DialogDescription>
        </DialogHeader>
        <TemplateForm
          initialData={
            isEditing
              ? {
                  name: template.name,
                  category: template.category as TemplateInput["category"],
                  content: template.content,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onContentChange={handleContentChange}
          isLoading={isLoading}
        />
        <TemplatePreview content={previewContent} />
      </DialogContent>
    </Dialog>
  )
}
