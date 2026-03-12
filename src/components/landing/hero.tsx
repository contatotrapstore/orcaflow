"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)] py-24 md:py-36 lg:py-44">
      <div className="dot-pattern absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Orçamentos que fecham,{" "}
          <span className="text-[#2aab8f]">não ficam no vácuo</span>
        </h1>

        <p className="animate-fade-in-up-delay-1 mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
          O OrçaFlow organiza seus orçamentos, automatiza follow-ups e cobra
          pelo WhatsApp. Chega de proposta perdida.
        </p>

        <div className="animate-fade-in-up-delay-2 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="brand-glow h-12 px-8 text-base"
            nativeButton={false}
            render={<Link href="/cadastro" />}
          >
            Começar grátis
            <ArrowRight className="ml-2 size-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 !border-white/20 !bg-transparent px-8 text-base !text-white hover:!bg-white/10"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Já tem conta? Entrar
          </Button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--background)]" />
    </section>
  )
}
