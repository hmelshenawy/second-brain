'use client'

import { Pin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toggle } from '@/components/ui/toggle'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Tag } from '@/types'

interface NoteFilterBarProps {
  tags: Tag[]
  activeTagId: string | null
  pinnedOnly: boolean
  onTagChange: (id: string | null) => void
  onPinnedToggle: (val: boolean) => void
}

export function NoteFilterBar({
  tags,
  activeTagId,
  pinnedOnly,
  onTagChange,
  onPinnedToggle,
}: NoteFilterBarProps) {
  if (tags.length === 0 && !pinnedOnly) return null

  return (
    <div className="border-b border-border/40 px-3 py-2">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-1.5 w-max">
          {/* pinned toggle */}
          <Toggle
            size="sm"
            pressed={pinnedOnly}
            onPressedChange={onPinnedToggle}
            aria-label="Show pinned only"
            className={cn(
              'h-6 px-2 text-[11px] rounded-full gap-1',
              pinnedOnly
                ? 'bg-blue-50 text-blue-700 border border-blue-200 data-[state=on]:bg-blue-50 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                : 'text-muted-foreground',
            )}
          >
            <Pin className="h-2.5 w-2.5" />
            Pinned
          </Toggle>

          {tags.length > 0 && (
            <div className="w-px h-4 bg-border/60 mx-0.5" aria-hidden="true" />
          )}

          {/* all tags pill */}
          {tags.length > 0 && (
            <button
              onClick={() => onTagChange(null)}
              className={cn(
                'h-6 px-2.5 text-[11px] rounded-full border transition-colors',
                activeTagId === null
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-muted-foreground border-border/60 hover:border-border',
              )}
            >
              All
            </button>
          )}

          {/* tag pills */}
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagChange(activeTagId === tag.id ? null : tag.id)}
              className={cn(
                'h-6 px-2.5 text-[11px] rounded-full border transition-colors flex items-center gap-1',
                activeTagId === tag.id
                  ? 'border-transparent'
                  : 'bg-transparent text-muted-foreground border-border/60 hover:border-border',
              )}
              style={
                activeTagId === tag.id
                  ? {
                      backgroundColor: `${tag.color}22`,
                      color: tag.color,
                      borderColor: `${tag.color}44`,
                    }
                  : {}
              }
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: tag.color }}
                aria-hidden="true"
              />
              {tag.name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
