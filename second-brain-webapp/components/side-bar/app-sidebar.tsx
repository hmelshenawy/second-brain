"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter as ShadcnSidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"


import { SidebarLogo } from "./sidebar-logo"
import { SidebarNav } from "./sidebar-nav"
import { NotebookList } from "./notebook-list"
import { TagList } from "./tag-list"
import { SidebarFooter } from "./sidebar-footer"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarNav />
        <NotebookList />
        <TagList />
      </SidebarContent>

      <ShadcnSidebarFooter>
        <SidebarFooter />
      </ShadcnSidebarFooter>
    </Sidebar>
  )
}

