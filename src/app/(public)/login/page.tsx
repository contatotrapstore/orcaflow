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

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signIn,
    {}
  )

  return (
    <div className="flex min-h-screen">
      {/* Left column — branding */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center relative bg-gradient-to-br from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)]">
        <div className="dot-pattern absolute inset-0" />
        <div className="relative z-10 text-center space-y-3">
          <Image src="/logo.png" alt="OrçaFlow" width={200} height={52} className="h-12 w-auto brightness-200" />
          <p className="text-gray-300">Orçamentos que viram vendas</p>
        </div>
      </div>

      {/* Right column — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center"><Image src="/logo.png" alt="OrçaFlow" width={160} height={42} className="h-10 w-auto" /></div>
            <CardDescription>Entre na sua conta</CardDescription>
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
                <Label htmlFor="password">Senha</Label>
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
              <div className="flex flex-col items-center gap-2 text-sm">
                <Link
                  href="/esqueci-senha"
                  className="text-[#208E76] hover:text-[#1a7562] underline-offset-4 hover:underline"
                >
                  Esqueci minha senha
                </Link>
                <span className="text-muted-foreground">
                  Não tem conta?{" "}
                  <Link
                    href="/cadastro"
                    className="text-[#208E76] hover:text-[#1a7562] underline-offset-4 hover:underline font-medium"
                  >
                    Cadastre-se
                  </Link>
                </span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
