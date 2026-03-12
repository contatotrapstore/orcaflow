import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  description?: string
  trend?: "up" | "down" | "neutral"
}

const trendColors = {
  up: "text-green-600 dark:text-green-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
}

const iconBgColors = {
  up: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
  down: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  neutral: "bg-[#208E76]/10 text-[#1a7562] dark:bg-[#052e23] dark:text-[#2aab8f]",
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  trend = "neutral",
}: MetricCardProps) {
  return (
    <Card size="sm" className="border-t-2 border-t-[#208E76]/30 hover:-translate-y-0.5 hover:shadow-md transition-all">
      <CardContent className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            iconBgColors[trend]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className={cn("text-xl font-bold leading-none", trendColors[trend])}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
