import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/shared/loading-skeleton"

export default function ClientesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Search bar */}
      <Skeleton className="h-9 w-full max-w-sm" />

      {/* Table */}
      <TableSkeleton rows={5} />
    </div>
  )
}
