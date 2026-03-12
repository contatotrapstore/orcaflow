import { z } from "zod"
import type { FollowUpType } from "@/types/database"

const followUpTypes: [FollowUpType, ...FollowUpType[]] = [
  "follow_up_1",
  "follow_up_2",
  "follow_up_3",
  "cobranca",
  "manual",
]

export const followUpSchema = z.object({
  type: z.enum(followUpTypes).default("manual"),
  due_date: z.string().min(1, "Data de vencimento é obrigatória"),
  quote_id: z.string().optional().nullable(),
  customer_id: z.string().optional().nullable(),
  message_template_id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type FollowUpInput = z.infer<typeof followUpSchema>
export type FollowUpFormValues = z.input<typeof followUpSchema>
