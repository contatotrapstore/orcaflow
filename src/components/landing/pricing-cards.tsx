"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar a organizar seus orçamentos.",
    features: ["Até 20 orçamentos/mês", "1 usuário"],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 97",
    period: "/mês",
    description: "Para empresas que querem escalar suas vendas.",
    features: [
      "Orçamentos ilimitados",
      "Até 5 usuários",
      "Templates personalizados",
      "Relatórios avançados",
    ],
    cta: "Começar grátis",
    highlighted: true,
  },
]

export function PricingCards() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="w-full py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Planos simples, sem surpresa
        </h2>

        <div
          ref={ref}
          className={`mt-12 grid gap-8 sm:grid-cols-2 transition-all duration-700 ${
            isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
          }`}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-xl bg-card p-6 ${
                plan.highlighted
                  ? "ring-2 ring-[#208E76] brand-glow"
                  : "glass-light transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <>
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2aab8f] via-teal-400 to-[#2aab8f]" />
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    Mais popular
                  </Badge>
                </>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                nativeButton={false}
                render={<Link href="/cadastro" />}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
