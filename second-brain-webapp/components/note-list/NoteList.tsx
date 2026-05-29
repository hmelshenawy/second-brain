'use client'

import { useState, useMemo } from 'react'
import { useSidebarStore } from '@/store/sidebar.store'
import { useNotes, useTags, useDeleteNote, usePinNote, useCreateNote } from '@/hooks/use-notes'
import { NoteListHeader } from './NoteListHeader'
import { NoteFilterBar } from './NoteFilterBar'
import { NoteListBody } from './NoteListBody'
import type { SortOption } from '@/types'

const VIEW_TITLES: Record<string, string> = {
  all: 'All notes',
  pinned: 'Pinned',
  trash: 'Trash',
}

export function NoteList() {
  const {
    activeNotebookId,
    activeTagId,
    activeView,
    activeNoteId,
    sortBy,
    setSortBy,
    setActiveNote,
  } = useSidebarStore()

  // local filter state
  const [search, setSearch] = useState('')
  const [localTagId, setLocalTagId] = useState<string | null>(null)
  const [pinnedOnly, setPinnedOnly] = useState(false)

  // resolve effective tag: sidebar takes priority over local filter
  const effectiveTagId = activeTagId ?? localTagId

  // fetch notes
  const { data, isLoading } = useNotes({
    notebookId: activeNotebookId,
    tagId: effectiveTagId,
    pinned: activeView === 'pinned' || pinnedOnly || undefined,
    sortBy,
  })

  // fetch tags (cached from sidebar)
  const { data: tags = [] } = useTags()

  // mutations
  const deleteNote = useDeleteNote()
  const pinNote = usePinNote()
  const createNote = useCreateNote()

  // client-side search filter
  const notes = useMemo(() => {
    const all = data?.data ?? []
    if (!search.trim()) return all
    const q = search.toLowerCase()
    return all.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.contentMd?.toLowerCase().includes(q),
    )
  }, [data, search])

  // derive header title
  const title = activeNotebookId
    ? (data?.data[0] as any)?.notebookTitle ?? 'Notebook'
    : VIEW_TITLES[activeView] ?? 'Notes'

  async function handleCreateNote() {
    const note = await createNote.mutateAsync({
      title: 'Untitled',
      notebookId: activeNotebookId,
    })
    setActiveNote(note.id)
  }

  function handleDelete(id: string) {
    if (id === activeNoteId) setActiveNote(null)
    deleteNote.mutate(id)
  }

  function handlePin(id: string, isPinned: boolean) {
    pinNote.mutate({ id, isPinned })
  }

  return (
    <div className="flex flex-col h-full border-r border-border/40 bg-background w-[240px] shrink-0">
      <NoteListHeader
        title={title}
        sortBy={sortBy}
        onSortChange={(s: SortOption) => setSortBy(s)}
        onSearchChange={setSearch}
        onNewNote={handleCreateNote}
        isCreating={createNote.isPending}
      />

      <NoteFilterBar
        tags={tags}
        activeTagId={localTagId}
        pinnedOnly={pinnedOnly}
        onTagChange={setLocalTagId}
        onPinnedToggle={setPinnedOnly}
      />

      <NoteListBody
        notes={notes}
        isLoading={isLoading}
        isSearching={!!search.trim()}
        activeNoteId={activeNoteId}
        onNoteClick={setActiveNote}
        onPin={handlePin}
        onDelete={handleDelete}
        onCreateNote={handleCreateNote}
      />
    </div>
  )
}
