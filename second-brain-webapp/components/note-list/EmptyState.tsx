import { FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  isSearching: boolean
  onCreateNote: () => void
}

export function EmptyState({ isSearching, onCreateNote }: EmptyStateProps) {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground mb-1">
          No notes match your search
        </p>
        <p className="text-xs text-muted-foreground/60">
          Try different keywords or clear the filter
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <FileText className="h-8 w-8 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium text-muted-foreground mb-1">
        No notes yet
      </p>
      <p className="text-xs text-muted-foreground/60 mb-4">
        Create your first note to get started
      </p>
      <Button variant="outline" size="sm" onClick={onCreateNote}>
        New note
      </Button>
    </div>
  )
}
