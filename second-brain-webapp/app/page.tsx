import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/side-bar/app-sidebar"
import { NoteList } from '@/components/note-list/NoteList'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <NoteList />

      <main className="flex-1 p-6">
        Select or create a note
      </main>
    </div>
  )
}
