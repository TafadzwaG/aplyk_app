import * as React from "react"
import {
  CalendarIcon,
  MailCheckIcon,
  MailIcon,
  PlusIcon,
  RotateCwIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from "lucide-react"
import { toast } from "sonner"

import { MetricStatCard } from "@/components/metric-stat-card"
import { ResourcePageHeader } from "@/components/resource-page-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/contexts/auth-context"
import { getApiErrorMessage, teamApi } from "@/lib/api"
import type { CompanyInvitation, CompanyMembershipDetails } from "@/types/api"

function displayName(membership: CompanyMembershipDetails) {
  const name = [membership.user?.firstName, membership.user?.lastName]
    .filter(Boolean)
    .join(" ")
  return name || membership.user?.email || `Member ${membership.userId}`
}

function initials(membership: CompanyMembershipDetails) {
  const name = displayName(membership)
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function invitationStatus(status: string | number) {
  const statuses: Record<string, string> = {
    "1": "Pending",
    "2": "Accepted",
    "3": "Declined",
    "4": "Revoked",
    "5": "Expired",
  }
  return statuses[String(status)] ?? String(status)
}

function isPending(invitation: CompanyInvitation) {
  return invitation.status === 1 || invitation.status === "Pending"
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

function TeamMemberCard({
  membership,
}: {
  membership: CompanyMembershipDetails
}) {
  return (
    <Card size="sm" className="h-full">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <Avatar size="lg" className="rounded-xl">
            <AvatarFallback className="rounded-xl">
              {initials(membership)}
            </AvatarFallback>
          </Avatar>
          <Badge variant="secondary">{membership.statusName}</Badge>
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle>{displayName(membership)}</CardTitle>
          <CardDescription>{membership.user?.email || "—"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant={membership.role === 1 ? "secondary" : "outline"}>
            {membership.roleName}
          </Badge>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-sm ring-1 ring-foreground/8">
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">Joined</span>
          <span className="ml-auto font-medium">
            {formatDate(membership.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function InvitationCard({
  invitation,
  busyInvitationId,
  onResend,
  onRevoke,
}: {
  invitation: CompanyInvitation
  busyInvitationId: number | null
  onResend: (invitation: CompanyInvitation) => void
  onRevoke: (invitation: CompanyInvitation) => void
}) {
  const pending = isPending(invitation)

  return (
    <Card size="sm" className="h-full">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/35 text-foreground ring-1 ring-foreground/8">
            <MailIcon className="size-4" />
          </span>
          <Badge variant={pending ? "secondary" : "outline"}>
            {invitationStatus(invitation.status)}
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle className="break-all">{invitation.email}</CardTitle>
          <CardDescription>Manager invitation</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/45 px-3 py-2.5 ring-1 ring-foreground/8">
            <p className="text-xs text-muted-foreground">Invited</p>
            <p className="mt-1 text-sm font-medium">
              {formatDate(invitation.invitedAt)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/45 px-3 py-2.5 ring-1 ring-foreground/8">
            <p className="text-xs text-muted-foreground">Expires</p>
            <p className="mt-1 text-sm font-medium">
              {formatDate(invitation.expiresAt)}
            </p>
          </div>
        </div>
        {(pending || invitation.status === 5) && (
          <div className="flex flex-wrap gap-2">
            {(pending || invitation.status === 5) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busyInvitationId !== null}
                onClick={() => onResend(invitation)}
              >
                {busyInvitationId === invitation.id ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <RotateCwIcon data-icon="inline-start" />
                )}
                Resend
              </Button>
            )}
            {pending && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={busyInvitationId !== null}
                onClick={() => onRevoke(invitation)}
              >
                <Trash2Icon data-icon="inline-start" />
                Revoke
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TeamPage() {
  const { profile } = useAuth()
  const [memberships, setMemberships] = React.useState<
    CompanyMembershipDetails[]
  >([])
  const [invitations, setInvitations] = React.useState<CompanyInvitation[]>([])
  const [email, setEmail] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [revokeTarget, setRevokeTarget] =
    React.useState<CompanyInvitation | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [busyInvitationId, setBusyInvitationId] = React.useState<number | null>(
    null
  )

  const loadData = React.useCallback(async () => {
    if (!profile?.activeCompanyId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const [nextMemberships, nextInvitations] = await Promise.all([
        teamApi.getMemberships(),
        teamApi.getInvitations(),
      ])
      setMemberships(nextMemberships)
      setInvitations(nextInvitations)
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Could not load team members. Owner access may be required."
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [profile?.activeCompanyId])

  React.useEffect(() => {
    // Initial resource data is synchronized from the API on mount/context change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData()
  }, [loadData])

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await teamApi.invite(email.trim())
      toast.success("Invitation created", {
        description: result.emailSent
          ? `An invitation was emailed to ${email.trim()}.`
          : "The invitation is ready, but email delivery is still pending.",
      })
      setEmail("")
      setOpen(false)
      await loadData()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not invite this user."))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend(invitation: CompanyInvitation) {
    setBusyInvitationId(invitation.id)
    try {
      const result = await teamApi.resendInvitation(invitation.id)
      toast.success("Invitation renewed", {
        description: result.emailSent
          ? `A fresh invitation was sent to ${invitation.email}.`
          : "The invitation was renewed; email delivery is pending.",
      })
      await loadData()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not resend the invitation."))
    } finally {
      setBusyInvitationId(null)
    }
  }

  async function handleRevoke() {
    if (!revokeTarget) return
    setBusyInvitationId(revokeTarget.id)
    try {
      await teamApi.revokeInvitation(revokeTarget.id)
      toast.success("Invitation revoked")
      setRevokeTarget(null)
      await loadData()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not revoke the invitation."))
    } finally {
      setBusyInvitationId(null)
    }
  }

  const pendingInvitations = invitations.filter(isPending)
  const ownerCount = memberships.filter(
    (membership) => membership.role === 1
  ).length

  return (
    <div className="flex flex-col gap-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <ResourcePageHeader
          eyebrow="Workspace access"
          title="Team"
          description="Invite managers, monitor access, and keep the people running your schedule visible in one place."
          icon={UsersRoundIcon}
          action={
            <SheetTrigger asChild>
              <Button disabled={!profile?.activeCompanyId}>
                <PlusIcon data-icon="inline-start" />
                Invite a user
              </Button>
            </SheetTrigger>
          }
        />

        <SheetContent className="data-[side=right]:w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Invite a manager</SheetTitle>
            <SheetDescription>
              They can join with an existing account or create one using this
              email.
            </SheetDescription>
          </SheetHeader>
          <form id="invite-form" onSubmit={handleInvite} className="px-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="invite-email">Work email</FieldLabel>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="manager@company.com"
                  autoComplete="email"
                  required
                />
                <FieldDescription>
                  The invitation is securely matched to their confirmed email.
                </FieldDescription>
              </Field>
              <Card size="sm" className="bg-muted/40">
                <CardContent className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheckIcon className="size-4" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Manager access</p>
                    <p className="text-xs text-muted-foreground">
                      Managers can operate the active company workspace.
                      Ownership remains with company owners.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FieldGroup>
          </form>
          <SheetFooter>
            <Button type="submit" form="invite-form" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isSubmitting ? "Sending invitation..." : "Send invitation"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={Boolean(revokeTarget)}
        onOpenChange={(nextOpen) => !nextOpen && setRevokeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Revoke this invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeTarget?.email} will no longer be able to use this
              invitation to join the company.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyInvitationId !== null}>
              Keep invitation
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={busyInvitationId !== null}
              onClick={() => void handleRevoke()}
            >
              Revoke invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricStatCard
          label="Active team members"
          value={memberships.length}
          icon={UserRoundCheckIcon}
          variant="rings"
        />
        <MetricStatCard
          label="Pending invitations"
          value={pendingInvitations.length}
          icon={MailIcon}
          variant="waves"
        />
        <MetricStatCard
          label="Workspace owners"
          value={ownerCount}
          icon={ShieldCheckIcon}
          variant="grid"
        />
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Team members</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            People with access to this company workspace.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <Card key={index} size="sm">
                <CardHeader className="gap-3">
                  <Skeleton className="size-12 rounded-xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : memberships.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {memberships.map((membership) => (
              <TeamMemberCard key={membership.id} membership={membership} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No team memberships are available.
            </CardContent>
          </Card>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">
            Invitation history
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track delivery and renew or revoke invitations that are still
            pending.
          </p>
        </div>

        {isLoading ? (
          <Card size="sm">
            <CardContent className="py-6">
              <Skeleton className="h-24 w-full rounded-lg" />
            </CardContent>
          </Card>
        ) : invitations.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                busyInvitationId={busyInvitationId}
                onResend={(item) => void handleResend(item)}
                onRevoke={setRevokeTarget}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-foreground/8">
                <MailCheckIcon className="size-5 text-muted-foreground" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-lg font-semibold">
                  No invitations sent
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Invite a manager when you are ready to share the workspace.
                </p>
              </div>
              <Button onClick={() => setOpen(true)} disabled={!profile?.activeCompanyId}>
                <PlusIcon data-icon="inline-start" />
                Invite user
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
