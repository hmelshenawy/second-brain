import Link from "next/link"
import { LogOut, Settings } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SidebarFooter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-muted">
        <Avatar className="size-8">
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>H</AvatarFallback>
        </Avatar>

        <div className="text-left group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-medium">Haitham</p>
          <p className="text-xs text-muted-foreground">
            haitham@email.com
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end">
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}