"use client"

import { MessageSquareOff, HelpCircle, BanknoteIcon } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const painPoints = [
  {
    icon: MessageSquareOff,
    title: "Orçamentos esquecidos no WhatsApp",
    description:
      "Propostas que ficam perdidas entre mensagens e nunca recebem resposta.",
  },
  {
    icon: HelpCircle,
    title: "Sem saber quem precisa de follow-up",
    description:
      "Você não sabe quais clientes estão esperando retorno ou quem já desistiu.",
  },
  {
    icon: BanknoteIcon,
    title: "Cobranças que nunca são feitas",
    description:
      "Trabalho entregue mas o pagamento fica pendente porque ninguém cobrou.",
  },
]

export function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="w-full bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Sua empresa vive isso?
        </h2>

        <div
          ref={ref}
          className={`mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ${
            isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
          }`}
        >
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="glass-light flex flex-col items-center gap-4 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-destructive/10">
                <point.icon className="size-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">{point.title}</h3>
              <p className="text-sm text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
