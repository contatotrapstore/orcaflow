import { z } from "zod"

export const workspaceSchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .nullable()
    .or(z.literal("")),
  phone: z.string().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable().or(z.literal("")),
  default_terms: z.string().optional().nullable().or(z.literal("")),
  default_validity_days: z.coerce
    .number()
    .int()
    .min(1, "Deve ser pelo menos 1 dia")
    .optional()
    .default(15),
})

export type WorkspaceInput = z.infer<typeof workspaceSchema>
