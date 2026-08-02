import { CalendarPlusIcon } from "lucide-react"
import type { ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { ContextSwitcher } from "@/components/context-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "@/lib/router"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/locations": "Locations",
  "/job-profiles": "Job profiles",
  "/team": "Team",
  "/roles": "Roles & permissions",
  "/shifts": "Shifts",
  "/settings": "Settings",
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const shiftDetailMatch = pathname.match(/^\/shifts\/(\d+)$/)
  const jobProfileDetailMatch = pathname.match(/^\/job-profiles\/(\d+)$/)
  const locationDetailMatch = pathname.match(/^\/locations\/(\d+)$/)
  const jobProfileCreateMatch = pathname === "/job-profiles/new"
  const shiftCreateMatch = pathname === "/shifts/new"
  const pageTitle = shiftCreateMatch
    ? "Create shift"
    : shiftDetailMatch
      ? "Shift details"
      : locationDetailMatch
        ? "Location details"
        : jobProfileCreateMatch
          ? "Create job profile"
          : jobProfileDetailMatch
            ? "Job profile details"
            : (pageTitles[pathname] ?? "Aplyk")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 bg-background/95 px-4 shadow-[var(--shadow-elevated)] backdrop-blur supports-backdrop-filter:bg-background/80">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="truncate text-sm font-medium">{pageTitle}</h1>
          <div className="ml-auto flex items-center gap-2">
            <ContextSwitcher />
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link to="/shifts">
                <CalendarPlusIcon data-icon="inline-start" />
                Create a shift
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col bg-background p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
