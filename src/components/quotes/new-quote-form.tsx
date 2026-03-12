"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { QuoteForm } from "@/components/quotes/quote-form"
import { createQuote } from "@/actions/quotes"
import type { Customer } from "@/types/database"

interface NewQuoteFormProps {
  customers: Customer[]
}

export function NewQuoteForm({ customers }: NewQuoteFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSubmit(jsonData: string) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("data", jsonData)

      const result = await createQuote({}, formData)

      if (result.error) {
        toast.error(result.error)
      } else if (result.success && result.id) {
        toast.success("Orçamento criado com sucesso!")
        router.push(`/orcamentos/${result.id}`)
      }
    })
  }

  return (
    <QuoteForm
      customers={customers}
      onSubmit={handleSubmit}
      isLoading={isPending}
    />
  )
}
