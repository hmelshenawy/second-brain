import { create } from 'zustand'
import type { ViewOption, SortOption } from '@/types'

interface SidebarStore {
  // active selections (set by sidebar, read by note list)
  activeNotebookId: string | null
  activeTagId: string | null
  activeView: ViewOption
  activeNoteId: string | null

  // sort (shared so note list header can change it)
  sortBy: SortOption

  // sidebar collapse
  isCollapsed: boolean

  // actions
  setActiveNotebook: (id: string | null) => void
  setActiveTag: (id: string | null) => void
  setActiveView: (view: ViewOption) => void
  setActiveNote: (id: string | null) => void
  setSortBy: (sort: SortOption) => void
  toggleCollapsed: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  activeNotebookId: null,
  activeTagId: null,
  activeView: 'all',
  activeNoteId: null,
  sortBy: 'updatedAt',
  isCollapsed: false,

  setActiveNotebook: (id) =>
    set({ activeNotebookId: id, activeTagId: null, activeView: 'all' }),

  setActiveTag: (id) =>
    set({ activeTagId: id, activeNotebookId: null, activeView: 'all' }),

  setActiveView: (view) =>
    set({ activeView: view, activeNotebookId: null, activeTagId: null }),

  setActiveNote: (id) => set({ activeNoteId: id }),

  setSortBy: (sort) => set({ sortBy: sort }),

  toggleCollapsed: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
}))
