"use client"

import { useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  workspaceSchema,
  type WorkspaceInput,
} from "@/lib/validators/workspace"
import {
  updateWorkspace,
  type WorkspaceActionState,
} from "@/actions/workspace"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import type { Workspace } from "@/types/database"

interface CompanyFormProps {
  workspace: Workspace | null
}

export function CompanyForm({ workspace }: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema) as any,
    defaultValues: {
      name: workspace?.name ?? "",
      email: workspace?.email ?? "",
      phone: workspace?.phone ?? "",
      address: workspace?.address ?? "",
      default_terms: workspace?.default_terms ?? "",
      default_validity_days: workspace?.default_validity_days ?? 15,
    },
  })

  const [state, formAction, isPending] = useActionState<
    WorkspaceActionState,
    FormData
  >(updateWorkspace, {})

  useEffect(() => {
    if (state.success) {
      toast.success("Configurações salvas com sucesso!")
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  function onValid(data: WorkspaceInput) {
    const fd = new FormData()
    fd.set("name", data.name)
    fd.set("email", data.email ?? "")
    fd.set("phone", data.phone ?? "")
    fd.set("address", data.address ?? "")
    fd.set("default_terms", data.default_terms ?? "")
    fd.set(
      "default_validity_days",
      String(data.default_validity_days ?? 15)
    )
    formAction(fd)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
        <CardDescription>
          Informações que aparecem nos orçamentos e comunicações.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onValid as any)}
          className="space-y-4 max-w-lg"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome da empresa *</Label>
            <Input
              id="name"
              placeholder="Ex: Minha Empresa Ltda"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Rua, número, bairro, cidade - UF"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_terms">
              Termos e condições padrão
            </Label>
            <Textarea
              id="default_terms"
              placeholder="Condições de pagamento, prazo de entrega, garantias..."
              rows={4}
              {...register("default_terms")}
            />
            {errors.default_terms && (
              <p className="text-xs text-destructive">
                {errors.default_terms.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_validity_days">
              Validade padrão dos orçamentos (dias)
            </Label>
            <Input
              id="default_validity_days"
              type="number"
              min={1}
              max={365}
              className="w-32"
              {...register("default_validity_days")}
            />
            {errors.default_validity_days && (
              <p className="text-xs text-destructive">
                {errors.default_validity_days.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
