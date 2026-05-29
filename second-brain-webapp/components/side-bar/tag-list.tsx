"use client"

import { Badge } from "@/components/ui/badge"

const tags = [
  { id: "ai", name: "AI", color: "bg-purple-500" },
  { id: "coding", name: "Coding", color: "bg-blue-500" },
  { id: "life", name: "Life", color: "bg-green-500" },
]

export function TagList() {
  return (
    <div className="mt-4 px-2">
      <p className="mb-2 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
        Tags
      </p>

      <div className="flex flex-wrap gap-2 group-data-[collapsible=icon]:hidden">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="cursor-pointer gap-2"
            onClick={() => console.log("filter by tag:", tag.id)}
          >
            <span className={`size-2 rounded-full ${tag.color}`} />
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}