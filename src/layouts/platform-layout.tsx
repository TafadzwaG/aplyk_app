import type { ReactNode } from "react"
import { ShieldCheckIcon } from "lucide-react"

import { PlatformSidebar } from "@/components/platform-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "@/lib/router"

const titles: Record<string, string> = {
  "/platform": "Platform overview",
  "/platform/companies": "Companies",
  "/platform/users": "Users",
  "/platform/shifts": "Shifts",
  "/platform/roles": "Roles & permissions",
  "/platform/reference-data": "Reference data",
}

export function PlatformLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <SidebarProvider>
      <PlatformSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 bg-background/95 px-4 shadow-[var(--shadow-elevated)] backdrop-blur supports-backdrop-filter:bg-background/80">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="truncate text-sm font-medium">{titles[pathname] ?? "Platform"}</h1>
          <div className="ml-auto flex items-center gap-2"><Badge variant="outline"><ShieldCheckIcon data-icon="inline-start" />Platform Admin</Badge><ThemeToggle /></div>
        </header>
        <main className="flex flex-1 flex-col bg-muted/35 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
