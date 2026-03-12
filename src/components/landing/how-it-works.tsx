"use client"

import { Users, MessageCircle, Bell } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const steps = [
  {
    icon: Users,
    step: "1",
    title: "Cadastre o cliente e crie o orçamento",
    description:
      "Adicione seus clientes e monte orçamentos profissionais em poucos cliques.",
  },
  {
    icon: MessageCircle,
    step: "2",
    title: "Envie pelo WhatsApp com 1 clique",
    description:
      "Gere um link direto para o WhatsApp com a mensagem pronta para enviar.",
  },
  {
    icon: Bell,
    step: "3",
    title: "O OrçaFlow cuida do follow-up e cobrança",
    description:
      "Lembretes automáticos e controle de cobranças para você nunca perder uma venda.",
  },
]

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="w-full py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Como funciona
        </h2>

        <div
          ref={ref}
          className={`mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ${
            isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
          }`}
        >
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center gap-4 p-6 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-[#208E76]/10 text-[#1a7562] ring-2 ring-[#208E76]/20 dark:bg-[#208E76]/10 dark:text-[#2aab8f] dark:ring-[#208E76]/30">
                <item.icon className="size-7" />
              </div>
              <span className="absolute -top-1 right-4 text-6xl font-bold text-[#208E76]/10 lg:right-6">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
