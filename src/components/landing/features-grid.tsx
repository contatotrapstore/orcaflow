"use client"

import {
  FileText,
  MessageCircle,
  Clock,
  Columns3,
  Receipt,
  BarChart3,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const features = [
  {
    icon: FileText,
    title: "Orçamentos profissionais",
    description: "Crie e envie PDFs profissionais",
  },
  {
    icon: MessageCircle,
    title: "Envio por WhatsApp",
    description: "Envie orçamentos direto pelo WhatsApp",
  },
  {
    icon: Clock,
    title: "Follow-ups automáticos",
    description: "Lembretes automáticos em +2, +5 e +15 dias",
  },
  {
    icon: Columns3,
    title: "Funil visual",
    description: "Acompanhe cada proposta no kanban",
  },
  {
    icon: Receipt,
    title: "Cobranças organizadas",
    description: "Controle pagamentos e cobranças",
  },
  {
    icon: BarChart3,
    title: "Dashboard inteligente",
    description: "Métricas e insights do seu negócio",
  },
]

export function FeaturesGrid() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="w-full bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Tudo que você precisa
        </h2>

        <div
          ref={ref}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`glass-light flex items-start gap-4 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
              }`}
              style={isVisible ? { animationDelay: `${index * 0.1}s` } : undefined}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#208E76]/10 text-[#1a7562] dark:bg-[#208E76]/10 dark:text-[#2aab8f]">
                <feature.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
