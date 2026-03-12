import Link from "next/link"
import { type LucideIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button
          variant="outline"
          className="mt-4"
          nativeButton={false}
          render={<Link href={actionHref} />}
        >
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button variant="outline" onClick={onAction} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
