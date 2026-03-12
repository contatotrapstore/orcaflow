import { z } from "zod"

export const templateCategories = ["envio", "follow_up", "cobranca", "geral"] as const

export type TemplateCategory = (typeof templateCategories)[number]

export const categoryLabels: Record<TemplateCategory, string> = {
  envio: "Envio",
  follow_up: "Follow-up",
  cobranca: "Cobrança",
  geral: "Geral",
}

export const templateSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  category: z.enum(templateCategories, {
    error: "Selecione uma categoria válida",
  }),
  content: z
    .string()
    .min(1, "Conteúdo é obrigatório")
    .max(2000, "Conteúdo deve ter no máximo 2000 caracteres"),
})

export type TemplateInput = z.infer<typeof templateSchema>
