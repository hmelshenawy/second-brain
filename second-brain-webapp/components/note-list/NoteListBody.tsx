import { ScrollArea } from '@/components/ui/scroll-area'
import { NoteCard } from './NoteCard'
import { NoteCardSkeleton } from './NoteCardSkeleton'
import { EmptyState } from './EmptyState'
import type { NoteListItem } from '@/types'

interface NoteListBodyProps {
  notes: NoteListItem[]
  isLoading: boolean
  isSearching: boolean
  activeNoteId: string | null
  onNoteClick: (id: string) => void
  onPin: (id: string, isPinned: boolean) => void
  onDelete: (id: string) => void
  onCreateNote: () => void
}

export function NoteListBody({
  notes,
  isLoading,
  isSearching,
  activeNoteId,
  onNoteClick,
  onPin,
  onDelete,
  onCreateNote,
}: NoteListBodyProps) {
  return (
    <ScrollArea className="flex-1 min-h-0">
      {isLoading ? (
        // loading skeletons
        Array.from({ length: 5 }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))
      ) : notes.length === 0 ? (
        // empty state
        <EmptyState isSearching={isSearching} onCreateNote={onCreateNote} />
      ) : (
        // note cards
        notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isActive={note.id === activeNoteId}
            onClick={onNoteClick}
            onPin={onPin}
            onDelete={onDelete}
          />
        ))
      )}
    </ScrollArea>
  )
}
