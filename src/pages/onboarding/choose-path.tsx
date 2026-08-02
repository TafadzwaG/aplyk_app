import * as React from "react"
import {
  Building2,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  Inbox,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react"
import { toast } from "sonner"

import { AppLogo } from "@/components/app-logo"
import {
  ContextsPanel,
  contextKey,
  switchToContext,
} from "@/components/contexts-panel"
import { RequireAuth } from "@/components/require-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { ApiRequestError, meApi } from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import type {
  AvailableContext,
  CompanyInvitation,
  UserContexts,
} from "@/types/api"

function formatRole(role: string) {
  return role
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function InvitationsEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--primary) 16%, transparent) 0, transparent 42%), radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--accent) 35%, transparent) 0, transparent 38%)",
        }}
      />

      <div className="relative mx-auto flex max-w-sm flex-col items-center">
        <div className="relative mb-5">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-foreground/8">
            <Inbox className="size-7 text-primary" />
          </div>
          <div className="absolute -right-2 -bottom-2 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Mail className="size-4" />
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground">
          No invitations yet
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          When a company invites you using your verified email, the invitation
          will appear here with a one-click accept option.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="size-3" />
            Verified email only
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock3 className="size-3" />
            Expires automatically
          </Badge>
        </div>
      </div>
    </div>
  )
}

function InvitationsPanel({
  invitations,
  isLoading,
  acceptingId,
  onAccept,
}: {
  invitations: CompanyInvitation[]
  isLoading: boolean
  acceptingId: number | null
  onAccept: (id: number) => void
}) {
  return (
    <section className="mx-auto mt-10 w-full max-w-3xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <UserPlus className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                Company invitations
              </h2>
              {!isLoading && invitations.length > 0 ? (
                <Badge>{invitations.length} pending</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Join an existing team without creating a new company workspace.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      ) : invitations.length === 0 ? (
        <InvitationsEmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {invitations.map((invitation) => (
            <Card
              key={invitation.id}
              className="overflow-hidden border-border/70 shadow-sm"
            >
              <div className="h-1.5 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
              <CardHeader className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/40 text-accent-foreground ring-1 ring-border/60">
                    <Building2 className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">
                      {invitation.companyName}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Invited to join as {formatRole(String(invitation.role))}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1 text-[11px]">
                    <Mail className="size-3" />
                    {invitation.email}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[11px]">
                    <Clock3 className="size-3" />
                    Expires{" "}
                    {new Date(invitation.expiresAt).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full shadow-sm shadow-primary/15"
                  disabled={acceptingId !== null}
                  onClick={() => onAccept(invitation.id)}
                >
                  {acceptingId === invitation.id
                    ? "Accepting invitation..."
                    : "Accept invitation"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 shrink-0" />
        Only invitations sent to your verified email appear here.
      </p>
    </section>
  )
}

export function ChoosePathPage() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const [invitations, setInvitations] = React.useState<CompanyInvitation[]>([])
  const [contexts, setContexts] = React.useState<UserContexts | null>(null)
  const [loadingIntent, setLoadingIntent] = React.useState<
    "find_work" | "hire_staff" | null
  >(null)
  const [acceptingId, setAcceptingId] = React.useState<number | null>(null)
  const [switchingKey, setSwitchingKey] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      try {
        const [nextInvitations, nextContexts] = await Promise.all([
          meApi.getInvitations(),
          meApi.getContexts(),
        ])
        setInvitations(nextInvitations)
        setContexts(nextContexts)
      } catch (error) {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : "Could not load onboarding data."
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

  async function handleIntent(intent: "find_work" | "hire_staff") {
    setLoadingIntent(intent)
    try {
      await meApi.setInitialIntent(intent)
      await refreshProfile()

      if (intent === "hire_staff") {
        navigate("/onboarding/company")
        return
      }

      navigate("/onboarding/contexts")
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 409) {
        await refreshProfile()
        navigate(
          intent === "hire_staff"
            ? "/onboarding/company"
            : "/onboarding/contexts"
        )
        return
      }

      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Could not save your choice."
      toast.error(message)
    } finally {
      setLoadingIntent(null)
    }
  }

  async function handleAcceptInvitation(invitationId: number) {
    setAcceptingId(invitationId)
    try {
      await meApi.acceptInvitation(invitationId)
      await refreshProfile()
      toast.success("Invitation accepted.")
      navigate("/dashboard")
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Could not accept the invitation."
      toast.error(message)
    } finally {
      setAcceptingId(null)
    }
  }

  return (
    <RequireAuth>
      <div className="onboarding-shell flex min-h-svh flex-col">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6">
          <div className="mx-auto mb-8 flex flex-col items-center text-center">
            <AppLogo className="mb-6 h-10" />
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Choose how to continue
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Start as a professional, create a company, or respond to an
              invitation.
            </p>
          </div>

          <section className="mx-auto w-full max-w-3xl">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              Your options
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                disabled={loadingIntent !== null || switchingKey !== null}
                onClick={() => void handleIntent("find_work")}
                className="group text-left"
              >
                <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <div className="h-1 bg-gradient-to-r from-secondary via-secondary/80 to-transparent" />
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="rounded-xl bg-secondary p-3 text-secondary-foreground ring-1 ring-border/60">
                      <BriefcaseBusiness className="size-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">Find work</CardTitle>
                      <CardDescription className="mt-1">
                        Create your professional profile and discover shifts.
                      </CardDescription>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </CardHeader>
                </Card>
              </button>

              <button
                type="button"
                disabled={loadingIntent !== null || switchingKey !== null}
                onClick={() => void handleIntent("hire_staff")}
                className="group text-left"
              >
                <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/15">
                      <Building2 className="size-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">Hire staff</CardTitle>
                      <CardDescription className="mt-1">
                        Create a company workspace and start building your team.
                      </CardDescription>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </CardHeader>
                </Card>
              </button>
            </div>
          </section>

          <ContextsPanel
            contexts={contexts}
            isLoading={isLoading}
            switchingKey={switchingKey}
            onSelect={handleSelectContext}
            className="mt-10"
          />

          <InvitationsPanel
            invitations={invitations}
            isLoading={isLoading}
            acceptingId={acceptingId}
            onAccept={(id) => void handleAcceptInvitation(id)}
          />
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
