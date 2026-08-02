import * as React from "react"
import {
  Building2,
  BriefcaseBusiness,
  Check,
  ChevronsUpDown,
  Loader2,
  PlusCircle,
} from "lucide-react"
import { toast } from "sonner"

import {
  contextKey,
  isActiveContext,
  normalizeContextKind,
  switchToContext,
} from "@/components/contexts-panel"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { ApiRequestError, meApi } from "@/lib/api"
import { Link } from "@/lib/router"
import { cn } from "@/lib/utils"
import type { AvailableContext, UserContexts } from "@/types/api"

function ContextIcon({
  kind,
  className,
}: {
  kind: AvailableContext["kind"]
  className?: string
}) {
  const Icon =
    normalizeContextKind(kind) === "Professional"
      ? BriefcaseBusiness
      : Building2

  return <Icon className={className} />
}

function getActiveContext(
  contexts: UserContexts | null
): AvailableContext | null {
  if (!contexts?.activeContext) return null

  return (
    contexts.availableContexts.find((context) =>
      isActiveContext(context, contexts.activeContext)
    ) ?? null
  )
}

export function ContextSwitcher() {
  const { refreshProfile } = useAuth()
  const [contexts, setContexts] = React.useState<UserContexts | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [switchingKey, setSwitchingKey] = React.useState<string | null>(null)

  const loadContexts = React.useCallback(async () => {
    try {
      setContexts(await meApi.getContexts())
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Could not load workspaces."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // Initial data is loaded from the external API when the switcher mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadContexts()
  }, [loadContexts])

  const activeContext = getActiveContext(contexts)
  const items = contexts?.availableContexts ?? []

  async function handleSelect(context: AvailableContext) {
    if (isActiveContext(context, contexts?.activeContext ?? null)) return

    const key = contextKey(context)
    setSwitchingKey(key)

    try {
      await switchToContext(context)
      await refreshProfile()
      await loadContexts()
      toast.success(`Switched to ${context.displayName}.`)
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Could not switch workspace."
      toast.error(message)
    } finally {
      setSwitchingKey(null)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-8 w-44 rounded-lg" />
  }

  if (!items.length) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/onboarding/contexts">
          <PlusCircle data-icon="inline-start" />
          Choose workspace
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button
          variant="outline"
          size="sm"
          className="max-w-[min(100%,16rem)] cursor-pointer justify-between gap-2 px-2.5"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ContextIcon
                kind={activeContext?.kind ?? items[0].kind}
                className="size-3.5"
              />
            </span>
            <span className="truncate text-left font-medium">
              {activeContext?.displayName ?? "Select workspace"}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map((context) => {
            const key = contextKey(context)
            const active = isActiveContext(
              context,
              contexts?.activeContext ?? null
            )
            const isSwitching = switchingKey === key
            const contextKind = normalizeContextKind(context.kind)

            return (
              <DropdownMenuItem
                key={key}
                disabled={Boolean(switchingKey)}
                onSelect={() => void handleSelect(context)}
                className={cn(
                  "cursor-pointer gap-2 py-2",
                  active && "bg-primary/5"
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <ContextIcon kind={context.kind} className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {context.displayName}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {contextKind}
                  </span>
                </span>
                {isSwitching ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                ) : active ? (
                  <Check className="size-4 shrink-0 text-primary" />
                ) : null}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/onboarding/contexts">
            <PlusCircle />
            Manage workspaces
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
