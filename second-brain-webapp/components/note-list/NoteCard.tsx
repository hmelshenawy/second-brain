'use client'

import { Pin, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { markdownToPreview, formatRelativeDate } from '@/lib/utils'
import type { NoteListItem } from '@/types'

interface NoteCardProps {
  note: NoteListItem
  isActive: boolean
  onClick: (id: string) => void
  onPin: (id: string, isPinned: boolean) => void
  onDelete: (id: string) => void
  onDuplicate?: (id: string) => void
}

export function NoteCard({
  note,
  isActive,
  onClick,
  onPin,
  onDelete,
  onDuplicate,
}: NoteCardProps) {
  const preview = markdownToPreview(note.contentMd ?? '', 90)
  const date = formatRelativeDate(note.updatedAt)

  const menuItems = (
    <>
      <ContextMenuItem onClick={() => onPin(note.id, !note.isPinned)}>
        <Pin className="mr-2 h-3.5 w-3.5" />
        {note.isPinned ? 'Unpin' : 'Pin'}
      </ContextMenuItem>
      {onDuplicate && (
        <ContextMenuItem onClick={() => onDuplicate(note.id)}>
          Duplicate
        </ContextMenuItem>
      )}
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={() => onDelete(note.id)}
        className="text-destructive focus:text-destructive"
      >
        Delete
      </ContextMenuItem>
    </>
  )

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onClick(note.id)}
          onKeyDown={(e) => e.key === 'Enter' && onClick(note.id)}
          className={cn(
            'group relative px-3 py-3 border-b border-border/40 cursor-pointer',
            'transition-colors duration-100',
            'hover:bg-accent/50',
            isActive && 'bg-accent',
          )}
        >
          {/* title row */}
          <div className="flex items-center gap-1.5 mb-1 pr-6">
            {note.isPinned && (
              <Pin className="h-3 w-3 shrink-0 text-blue-500 fill-blue-500" aria-label="Pinned" />
            )}
            <span className="text-sm font-medium text-foreground truncate">
              {note.title}
            </span>
          </div>

          {/* preview */}
          {preview && (
            <p className="text-xs text-muted-foreground truncate mb-2 leading-relaxed">
              {preview}
            </p>
          )}

          {/* tags + date */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-1.5 py-0 text-[10px] font-medium h-4 rounded-full"
                style={{
                  backgroundColor: `${tag.color}22`,
                  color: tag.color,
                  border: `0.5px solid ${tag.color}44`,
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{note.tags.length - 3}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground ml-auto">
              {date}
            </span>
          </div>

          {/* context button — visible on hover / active */}
          <div className="absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  aria-label="Note options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onPin(note.id, !note.isPinned)}>
                  <Pin className="mr-2 h-3.5 w-3.5" />
                  {note.isPinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
                {onDuplicate && (
                  <DropdownMenuItem onClick={() => onDuplicate(note.id)}>
                    Duplicate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(note.id)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-40">
        {menuItems}
      </ContextMenuContent>
    </ContextMenu>
  )
}
