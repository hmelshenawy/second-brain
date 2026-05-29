"use client"

import Link from "next/link"
import { ChevronDown, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const notebooks = [
  { id: "personal", name: "Personal", count: 12 },
  { id: "work", name: "Work", count: 8 },
  { id: "ideas", name: "Ideas", count: 21 },
]

export function NotebookList() {
  return (
    <Collapsible defaultOpen className="mt-4">
      <div className="flex items-center justify-between px-2">
        <CollapsibleTrigger className="flex items-center gap-1 text-xl font-medium text-muted-foreground">
          <ChevronDown className="size-3" />
          <span className="group-data-[collapsible=icon]:hidden">
            Notebooks
          </span>
        </CollapsibleTrigger>

        <Button size="icon" variant="ghost" className="size-7">
          <Plus className="size-4" />
        </Button>
      </div>

      <CollapsibleContent className="mt-2 space-y-1">
        {notebooks.map((notebook) => (
          <Button
            key={notebook.id}
            asChild
            variant="ghost"
            className="w-full justify-between text-lg"
          >
            <Link href={`/notebooks/${notebook.id}`}>
              <span className="truncate">{notebook.name}</span>
              <Badge variant="secondary">{notebook.count}</Badge>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}