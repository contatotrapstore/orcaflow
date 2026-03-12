import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Button className="mt-2 sm:mt-0" nativeButton={false} render={<Link href={actionHref} />}>
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button onClick={onAction} className="mt-2 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
