"use client"

import { useActionState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signUp, type AuthState } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Check } from "lucide-react"

export default function CadastroPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signUp,
    {}
  )

  return (
    <div className="flex min-h-screen">
      {/* Left column — branding */}
      <div className="hidden lg:flex lg:w-[55%] flex-col items-center justify-center relative bg-gradient-to-br from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)] overflow-hidden">
        <div className="dot-pattern absolute inset-0 opacity-40" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-md px-8">
          <Image
            src="/logo.png"
            alt="OrçaFlow"
            width={280}
            height={72}
            className="h-16 w-auto brightness-200"
          />
          <p className="mt-4 text-xl text-gray-300 font-medium">
            Comece a fechar mais orçamentos
          </p>
          <p className="mt-2 text-gray-400 text-sm">
            Crie sua conta gratuita e organize seu fluxo de vendas em minutos.
          </p>

          <div className="mt-10 space-y-3 w-full text-left">
            {[
              "Crie orçamentos profissionais em PDF",
              "Envie pelo WhatsApp com 1 clique",
              "Follow-ups automáticos em +2, +5 e +15 dias",
              "Funil visual tipo Kanban",
              "Controle de cobranças e pagamentos",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#208E76]/20">
                  <Check className="size-3 text-[#2aab8f]" />
                </div>
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column — form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 lg:hidden">
            <Image src="/logo.png" alt="OrçaFlow" width={160} height={42} className="h-10 w-auto" />
          </div>

          <Card>
            <CardHeader className="text-center pb-2">
              <div className="hidden lg:flex justify-center mb-2">
                <Image src="/logo.png" alt="OrçaFlow" width={140} height={36} className="h-9 w-auto" />
              </div>
              <CardDescription className="text-base">Crie sua conta gratuita</CardDescription>
            </CardHeader>
            <form action={formAction}>
              <CardContent className="space-y-4">
                {state.error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {state.error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Seu nome</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="João Silva"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da empresa</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Minha Gráfica"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Criando conta..." : "Criar conta grátis"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Já tem conta?{" "}
                  <Link
                    href="/login"
                    className="text-[#208E76] hover:text-[#1a7562] underline-offset-4 hover:underline font-medium"
                  >
                    Entrar
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
