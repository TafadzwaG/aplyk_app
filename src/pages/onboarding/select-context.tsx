import * as React from "react"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

import { AppLogo } from "@/components/app-logo"
import {
  ContextsPanel,
  contextKey,
  switchToContext,
} from "@/components/contexts-panel"
import { RequireAuth } from "@/components/require-auth"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ApiRequestError, meApi } from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import type { AvailableContext, UserContexts } from "@/types/api"

export function SelectContextPage() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const [contexts, setContexts] = React.useState<UserContexts | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [switchingKey, setSwitchingKey] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      try {
        setContexts(await meApi.getContexts())
      } catch (error) {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : "Could not load your workspaces."
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  async function handleSelectContext(context: AvailableContext) {
    const key = contextKey(context)
    setSwitchingKey(key)

    try {
      await switchToContext(context)
      await refreshProfile()
      toast.success(`Switched to ${context.displayName}.`)
      navigate("/dashboard")
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

  return (
    <RequireAuth>
      <div className="onboarding-shell flex min-h-svh flex-col">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6">
          <div className="mx-auto mb-8 flex max-w-2xl flex-col items-center text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Sparkles className="size-6" />
            </div>
            <AppLogo className="mb-5 h-10" />
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Choose your workspace
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Pick the professional or company context you want to use for this
              session. You can switch workspaces any time from your account
              settings.
            </p>
          </div>

          <ContextsPanel
            contexts={contexts}
            isLoading={isLoading}
            switchingKey={switchingKey}
            onSelect={handleSelectContext}
            title="Available workspaces"
            description="Select one to open your dashboard."
          />

          {!isLoading && !contexts?.availableContexts.length ? (
            <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                You don&apos;t have any workspaces yet. Choose how you want to
                get started on Aplyk.
              </p>
              <Button asChild>
                <Link to="/onboarding">Continue onboarding</Link>
              </Button>
            </div>
          ) : null}

          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/onboarding">Back to onboarding options</Link>
            </Button>
          </div>
        </main>

        <footer className="mt-auto border-t border-border/70 bg-card/80">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>APLYK © 2024 Aplyk. All rights reserved.</span>
            <div className="flex flex-wrap gap-4">
              <Link to="#" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-foreground">
                Contact Support
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </RequireAuth>
  )
}
