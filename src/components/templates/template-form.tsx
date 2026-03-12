"use client"

import { useRef, useCallback, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  templateSchema,
  templateCategories,
  categoryLabels,
  type TemplateInput,
} from "@/lib/validators/template"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const TEMPLATE_VARIABLES = [
  { label: "{nome}", value: "{nome}" },
  { label: "{numero_orcamento}", value: "{numero_orcamento}" },
  { label: "{valor_total}", value: "{valor_total}" },
  { label: "{data_vencimento}", value: "{data_vencimento}" },
  { label: "{empresa}", value: "{empresa}" },
] as const

interface TemplateFormProps {
  initialData?: TemplateInput
  onSubmit: (data: TemplateInput) => void
  onContentChange?: (content: string) => void
  isLoading?: boolean
}

export function TemplateForm({
  initialData,
  onSubmit,
  onContentChange,
  isLoading,
}: TemplateFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<TemplateInput>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      category: initialData?.category ?? "geral",
      content: initialData?.content ?? "",
    },
  })

  const watchedContent = watch("content")

  useEffect(() => {
    onContentChange?.(watchedContent)
  }, [watchedContent, onContentChange])

  const insertVariable = useCallback(
    (variable: string) => {
      const textarea = textareaRef.current
      if (!textarea) {
        const currentContent = getValues("content")
        setValue("content", currentContent + variable, { shouldValidate: true })
        return
      }

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const currentContent = getValues("content")
      const newContent =
        currentContent.substring(0, start) +
        variable +
        currentContent.substring(end)

      setValue("content", newContent, { shouldValidate: true })

      requestAnimationFrame(() => {
        const newPos = start + variable.length
        textarea.focus()
        textarea.setSelectionRange(newPos, newPos)
      })
    },
    [getValues, setValue]
  )

  const { ref: formRef, ...contentRegister } = register("content")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          placeholder="Ex: Envio de orçamento"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {templateCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo *</Label>
        <Textarea
          id="content"
          placeholder="Digite o conteúdo do template..."
          className="min-h-32"
          {...contentRegister}
          ref={(el) => {
            formRef(el)
            textareaRef.current = el
          }}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">
            Clique para inserir variáveis no conteúdo:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATE_VARIABLES.map((v) => (
              <Button
                key={v.value}
                type="button"
                variant="outline"
                size="xs"
                onClick={() => insertVariable(v.value)}
              >
                {v.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? "Salvar alterações" : "Criar template"}
      </Button>
    </form>
  )
}
