"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { loginSchema, signUpSchema, resetPasswordSchema } from "@/lib/validators/auth"

export type AuthState = {
  error?: string
  success?: string
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const parsed = loginSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: "E-mail ou senha incorretos" }
  }

  redirect("/dashboard")
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    companyName: formData.get("companyName") as string,
  }

  const parsed = signUpSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
        company_name: parsed.data.companyName,
      },
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Este e-mail já está cadastrado" }
    }
    return { error: "Erro ao criar conta. Tente novamente." }
  }

  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function resetPassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
  }

  const parsed = resetPasswordSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
  })

  if (error) {
    return { error: "Erro ao enviar e-mail de recuperação" }
  }

  return { success: "E-mail de recuperação enviado. Verifique sua caixa de entrada." }
}
