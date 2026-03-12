"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  Building2,
  Users,
  FileText,
  Send,
  Palette,
  ArrowRight,
  X,
} from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { OnboardingProgress } from "@/types/database"
import { completeOnboardingStep, skipOnboarding } from "@/actions/onboarding"

type StepConfig = {
  key: string
  label: string
  href: string
  icon: React.ElementType
}

const STEPS: StepConfig[] = [
  {
    key: "configure_company",
    label: "Configurar dados da empresa",
    href: "/configuracoes",
    icon: Building2,
  },
  {
    key: "create_first_customer",
    label: "Cadastrar primeiro cliente",
    href: "/clientes",
    icon: Users,
  },
  {
    key: "create_first_quote",
    label: "Criar primeiro orcamento",
    href: "/orcamentos/novo",
    icon: FileText,
  },
  {
    key: "send_first_whatsapp",
    label: "Enviar primeiro orcamento por WhatsApp",
    href: "/orcamentos",
    icon: Send,
  },
  {
    key: "customize_templates",
    label: "Personalizar templates de mensagem",
    href: "/configuracoes",
    icon: Palette,
  },
]

interface OnboardingChecklistProps {
  steps: OnboardingProgress[]
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const [isPending, startTransition] = useTransition()
  const [dismissed, setDismissed] = useState(false)

  const completedCount = steps.filter((s) => s.completed).length
  const totalCount = steps.length
  const allComplete = completedCount === totalCount

  if (allComplete || dismissed) return null

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  function isStepCompleted(stepKey: string): boolean {
    return steps.some((s) => s.step_key === stepKey && s.completed)
  }

  function handleSkip() {
    startTransition(async () => {
      const result = await skipOnboarding()
      if (result.success) {
        setDismissed(true)
        toast.success("Onboarding pulado com sucesso")
      } else {
        toast.error(result.error ?? "Erro ao pular onboarding")
      }
    })
  }

  function handleToggleStep(stepKey: string, currentlyCompleted: boolean) {
    if (currentlyCompleted) return
    startTransition(async () => {
      const result = await completeOnboardingStep(stepKey)
      if (result.success) {
        toast.success("Etapa concluida!")
      } else {
        toast.error(result.error ?? "Erro ao completar etapa")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Primeiros passos
          <span className="text-xs font-normal text-muted-foreground">
            {completedCount} de {totalCount}
          </span>
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleSkip}
            disabled={isPending}
            aria-label="Pular onboarding"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {progressPercent}% concluido
          </p>
        </div>

        {/* Step checklist */}
        <div className="space-y-1">
          {STEPS.map((step) => {
            const completed = isStepCompleted(step.key)
            const StepIcon = step.icon

            return (
              <div
                key={step.key}
                className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={completed}
                  disabled={completed || isPending}
                  onCheckedChange={() =>
                    handleToggleStep(step.key, completed)
                  }
                />
                <StepIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span
                  className={`flex-1 text-sm ${
                    completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {step.label}
                </span>
                {!completed && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    nativeButton={false}
                    render={<Link href={step.href} />}
                    aria-label={`Ir para ${step.label}`}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          disabled={isPending}
        >
          Pular
        </Button>
      </CardFooter>
    </Card>
  )
}
