"use client"

import { useActionState } from "react"
import Link from "next/link"
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
  CardTitle,
} from "@/components/ui/card"

export default function CadastroPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signUp,
    {}
  )

  return (
    <div className="flex min-h-screen">
      {/* Left column — branding */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center relative bg-gradient-to-br from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)]">
        <div className="dot-pattern absolute inset-0" />
        <div className="relative z-10 text-center space-y-4">
          <h1 className="gradient-text-emerald text-3xl font-bold">OrçaFlow</h1>
          <p className="text-gray-300 text-lg">Comece a fechar mais orçamentos</p>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>Crie orçamentos profissionais</li>
            <li>Envie pelo WhatsApp com 1 clique</li>
            <li>Follow-ups automáticos</li>
          </ul>
        </div>
      </div>

      {/* Right column — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold gradient-text-emerald">OrçaFlow</CardTitle>
            <CardDescription>Crie sua conta gratuita</CardDescription>
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
                {isPending ? "Criando conta..." : "Criar conta"}
              </Button>
              <span className="text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link
                  href="/login"
                  className="text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline font-medium"
                >
                  Entrar
                </Link>
              </span>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
