import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/shared/loading-skeleton"

export default function FollowUpsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-1 h-4 w-52" />
        </div>
      </div>

      {/* Filter tabs */}
      <Skeleton className="h-9 w-64" />

      {/* Cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
