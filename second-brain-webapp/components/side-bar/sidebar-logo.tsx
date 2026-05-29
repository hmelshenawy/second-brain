import { Brain } from "lucide-react"

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-2 px-2 py-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Brain className="size-4" />
      </div>

      <div className="group-data-[collapsible=icon]:hidden">
        <p className="text-xl font-semibold">Second Brain</p>
        <p className="text-xs text-muted-foreground">Notes OS</p>
      </div>
    </div>
  )
}