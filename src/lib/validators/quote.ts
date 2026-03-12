import { z } from "zod"

export const quoteItemSchema = z.object({
  name: z.string().min(1, "Nome do item é obrigatório"),
  description: z.string().optional().nullable(),
  quantity: z.coerce.number().min(0.01, "Quantidade deve ser maior que zero"),
  unit: z.string().optional().nullable(),
  unit_price: z.coerce.number().min(0, "Preço unitário deve ser maior ou igual a zero"),
})

export const quoteSchema = z.object({
  customer_id: z.string().optional().nullable(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional().nullable(),
  valid_until: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  discount_amount: z.coerce.number().min(0).default(0),
  items: z.array(quoteItemSchema).min(1, "Adicione pelo menos um item"),
})

export type QuoteInput = z.infer<typeof quoteSchema>
export type QuoteItemInput = z.infer<typeof quoteItemSchema>
