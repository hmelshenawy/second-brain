'use client'

import { useState } from 'react'
import { Plus, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { SortOption } from '@/types'

interface NoteListHeaderProps {
  title: string
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  onSearchChange: (q: string) => void
  onNewNote: () => void
  isCreating?: boolean
}

const SORT_LABELS: Record<SortOption, string> = {
  updatedAt: 'Last updated',
  createdAt: 'Date created',
  title: 'Title A–Z',
}

export function NoteListHeader({
  title,
  sortBy,
  onSortChange,
  onSearchChange,
  onNewNote,
  isCreating,
}: NoteListHeaderProps) {
  const [search, setSearch] = useState('')

  function handleSearch(value: string) {
    setSearch(value)
    onSearchChange(value)
  }

  return (
    <div className="border-b border-border/40">
      {/* top row: title + actions */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-2">
        <h2 className="text-sm font-medium text-foreground truncate">{title}</h2>
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onNewNote}
                disabled={isCreating}
                aria-label="New note"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">New note</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="Sort notes"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Sort</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={(v) => onSortChange(v as SortOption)}
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                  <DropdownMenuRadioItem key={opt} value={opt}>
                    {SORT_LABELS[opt]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* search */}
      <div className="px-3 pb-3">
        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Filter notes…"
          className="h-8 text-xs bg-muted/40 border-border/40 placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  )
}
