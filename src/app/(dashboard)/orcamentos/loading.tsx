import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/shared/loading-skeleton"

export default function OrcamentosLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-1 h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>

      {/* Filters / Search */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Table */}
      <TableSkeleton rows={5} />
    </div>
  )
}
