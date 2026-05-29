import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { NoteListItem, PaginatedResponse, Tag, SortOption } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

// ── fetch helper ──────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `API error ${res.status}`)
  }

  return res.json()
}

// ── query keys ────────────────────────────────────────────────────────────────

export const noteKeys = {
  all: ['notes'] as const,
  list: (params: NotesParams) => ['notes', 'list', params] as const,
  detail: (id: string) => ['notes', 'detail', id] as const,
}

export const tagKeys = {
  all: ['tags'] as const,
}

// ── types ─────────────────────────────────────────────────────────────────────

export interface NotesParams {
  notebookId?: string | null
  tagId?: string | null
  pinned?: boolean
  search?: string
  sortBy?: SortOption
  page?: number
  limit?: number
}

// ── hooks ─────────────────────────────────────────────────────────────────────

export function useNotes(params: NotesParams) {
  const query = new URLSearchParams()
  if (params.notebookId)  query.set('notebookId', params.notebookId)
  if (params.tagId)       query.set('tagId', params.tagId)
  if (params.pinned)      query.set('pinned', 'true')
  if (params.search)      query.set('search', params.search)
  if (params.sortBy)      query.set('sortBy', params.sortBy)
  if (params.page)        query.set('page', String(params.page))
  if (params.limit)       query.set('limit', String(params.limit ?? 50))

  console.log("notes data:", query.toString())
  //console.log("isLoading:", isLoading)

    
  return useQuery<PaginatedResponse<NoteListItem>>({
    queryKey: noteKeys.list(params),
    queryFn: () => apiFetch(`/notes?${query.toString()}`),
  })
}

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: tagKeys.all,
    queryFn: () => apiFetch('/tags'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/notes/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function usePinNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      apiFetch(`/notes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isPinned }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { title: string; notebookId?: string | null }) =>
      apiFetch<NoteListItem>('/notes', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  })
}
