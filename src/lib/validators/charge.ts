import { z } from "zod"

export const chargeSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  due_date: z.string().min(1, "Data de vencimento é obrigatória"),
  quote_id: z.string().optional().nullable(),
  customer_id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type ChargeInput = z.infer<typeof chargeSchema>
