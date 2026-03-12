"use client"

import { useActionState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signIn, type AuthState } from "@/actions/auth"
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
import { FileText, MessageCircle, Bell } from "lucide-react"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signIn,
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
            Orçamentos que viram vendas
          </p>
          <p className="mt-2 text-gray-400 text-sm">
            Organize seus orçamentos, automatize follow-ups e cobre pelo WhatsApp.
          </p>

          <div className="mt-10 grid gap-4 w-full">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#208E76]/20">
                <FileText className="size-4 text-[#2aab8f]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Orçamentos profissionais</p>
                <p className="text-xs text-gray-400">Crie e envie PDFs em segundos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#208E76]/20">
                <MessageCircle className="size-4 text-[#2aab8f]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Envio por WhatsApp</p>
                <p className="text-xs text-gray-400">Link direto com mensagem pronta</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#208E76]/20">
                <Bell className="size-4 text-[#2aab8f]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Follow-ups automáticos</p>
                <p className="text-xs text-gray-400">Nunca perca uma venda por falta de retorno</p>
              </div>
            </div>
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
              <CardDescription className="text-base">Entre na sua conta</CardDescription>
            </CardHeader>
            <form action={formAction}>
              <CardContent className="space-y-4">
                {state.error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {state.error}
                  </div>
                )}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      href="/esqueci-senha"
                      className="text-xs text-[#208E76] hover:text-[#1a7562] hover:underline underline-offset-4"
                    >
                      Esqueceu?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Sua senha"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Não tem conta?{" "}
                  <Link
                    href="/cadastro"
                    className="text-[#208E76] hover:text-[#1a7562] underline-offset-4 hover:underline font-medium"
                  >
                    Cadastre-se grátis
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
