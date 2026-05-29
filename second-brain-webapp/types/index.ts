export interface Tag {
  id: string
  name: string
  color: string
  noteCount?: number
}

export interface Notebook {
  id: string
  title: string
  description?: string
  noteCount: number
  createdAt: string
  updatedAt: string
}

export interface NoteListItem {
  id: string
  title: string
  contentMd?: string
  isPinned: boolean
  notebookId: string | null
  tags: Tag[]
  updatedAt: string
  createdAt: string
}

export interface Note extends NoteListItem {
  links: NoteLink[]
  backlinks: NoteLink[]
  attachments: Attachment[]
  aiSummary: AiSummary | null
}

export interface NoteLink {
  id: string
  sourceNote?: { id: string; title: string }
  targetNote?: { id: string; title: string }
  linkText?: string
}

export interface Attachment {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
  createdAt: string
}

export interface AiSummary {
  id: string
  summary: string
  modelUsed: string
  generatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export type SortOption = 'updatedAt' | 'createdAt' | 'title'
export type ViewOption = 'all' | 'pinned' | 'trash'