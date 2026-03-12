import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  company_name: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .nullable()
    .or(z.literal("")),
  notes: z.string().optional().nullable(),
})

export type CustomerInput = z.infer<typeof customerSchema>
