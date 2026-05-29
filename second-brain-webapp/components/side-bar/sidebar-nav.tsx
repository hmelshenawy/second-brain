import Link from "next/link"
import { Archive, Pin, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const links = [
  { label: "All notes", href: "/notes", icon: Archive },
  { label: "Pinned", href: "/notes/pinned", icon: Pin },
  { label: "Search", href: "/search", icon: Search },
  { label: "Trash", href: "/trash", icon: Trash2 },
]

export function SidebarNav() {
  return (
    <nav className="space-y-1 " >
      {links.map((item) => (
        <Button
          key={item.href}
          asChild
          variant="ghost"
          className="w-full justify-start gap-2 text-md font-bold"
        >
          <Link href={item.href}>
            <item.icon className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">
              {item.label}
            </span>
          </Link>
        </Button>
      ))}
    </nav>
  )
}