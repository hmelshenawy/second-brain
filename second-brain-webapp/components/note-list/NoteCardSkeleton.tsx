import { Skeleton } from '@/components/ui/skeleton'

export function NoteCardSkeleton() {
  return (
    <div className="px-3 py-3 border-b border-border/40">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-1/2 mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-10 rounded-full" />
      </div>
    </div>
  )
}