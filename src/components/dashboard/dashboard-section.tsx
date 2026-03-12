import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardSectionProps {
  title: string
  actionLabel?: string
  actionHref?: string
  children: React.ReactNode
}

export function DashboardSection({
  title,
  actionLabel,
  actionHref,
  children,
}: DashboardSectionProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {actionLabel && actionHref && (
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-emerald-600 dark:hover:text-emerald-400"
              nativeButton={false}
              render={<Link href={actionHref} />}
            >
              {actionLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
