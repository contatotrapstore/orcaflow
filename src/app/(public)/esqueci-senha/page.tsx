"use client"

import { useActionState } from "react"
import Link from "next/link"
import Image from "next/image"
import { resetPassword, type AuthState } from "@/actions/auth"
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

export default function EsqueciSenhaPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    resetPassword,
    {}
  )

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center"><Image src="/logo.png" alt="OrçaFlow" width={160} height={42} className="h-10 w-auto" /></div>
        <CardDescription>Recupere sua senha</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
              {state.success}
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar e-mail de recuperação"}
          </Button>
          <Link
            href="/login"
            className="text-sm text-[#208E76] hover:text-[#1a7562] underline-offset-4 hover:underline"
          >
            Voltar para o login
          </Link>
        </CardFooter>
      </form>
    </Card>
    </div>
  )
}
