import * as React from "react"
import {
  BookOpenCheckIcon,
  BadgeCheckIcon,
  Building2Icon,
  LayoutDashboardIcon,
  LanguagesIcon,
  ListTreeIcon,
  LogOutIcon,
  ShieldCheckIcon,
  TagsIcon,
  UsersRoundIcon,
  CalendarDaysIcon,
} from "lucide-react"
import { toast } from "sonner"

import { AppLogo } from "@/components/app-logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { getProfileDisplayName, getProfileInitials } from "@/lib/profile"
import { Link, useLocation } from "@/lib/router"

const navigation = [
  { title: "Overview", href: "/platform", icon: LayoutDashboardIcon },
  { title: "Companies", href: "/platform/companies", icon: Building2Icon },
  { title: "Users", href: "/platform/users", icon: UsersRoundIcon },
  { title: "Shifts", href: "/platform/shifts", icon: CalendarDaysIcon },
  { title: "Roles & permissions", href: "/platform/roles", icon: ShieldCheckIcon },
  { title: "Reference data", href: "/platform/reference-data", icon: BookOpenCheckIcon },
]

const referenceNavigation = [
  { title: "Industries", href: "/platform/reference-data/industries", icon: Building2Icon },
  { title: "Industry types", href: "/platform/reference-data/industry-types", icon: TagsIcon },
  { title: "Categories", href: "/platform/reference-data/categories", icon: TagsIcon },
  { title: "Skills", href: "/platform/reference-data/skills", icon: BadgeCheckIcon },
  { title: "Languages", href: "/platform/reference-data/languages", icon: LanguagesIcon },
  { title: "Age ranges", href: "/platform/reference-data/age-ranges", icon: ListTreeIcon },
  { title: "Genders", href: "/platform/reference-data/genders", icon: UsersRoundIcon },
  { title: "Employee ranges", href: "/platform/reference-data/employee-ranges", icon: ListTreeIcon },
  { title: "Week days", href: "/platform/reference-data/week-days", icon: CalendarDaysIcon },
  { title: "Credentials", href: "/platform/reference-data/credentials", icon: BookOpenCheckIcon },
]

export function PlatformSidebar() {
  const { pathname } = useLocation()
  const { logout, profile } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  if (!profile) return null
  const displayName = getProfileDisplayName(profile)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch {
      toast.error("Could not sign out. Try again.")
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Aplyk Platform">
              <AppLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Platform administration">
              <ShieldCheckIcon />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                <span className="truncate font-medium">Platform control</span>
                <span className="truncate text-xs text-muted-foreground">Global workspace</span>
              </span>
              <Badge variant="secondary">Admin</Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Seeded platform data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {referenceNavigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar size="sm"><AvatarFallback>{getProfileInitials(profile)}</AvatarFallback></Avatar>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs text-muted-foreground">{profile.email}</span>
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end">
                <DropdownMenuLabel>Platform administrator</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild><Link to="/settings">Account settings</Link></DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive" disabled={isLoggingOut} onSelect={() => void handleLogout()}>
                    <LogOutIcon />{isLoggingOut ? "Signing out..." : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
