import type { ComponentType, ReactNode } from "react"
import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react"

import { ResourcePageHeader } from "@/components/resource-page-header"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import {
  getProfileCompletion,
  getProfileDisplayName,
  getProfileInitials,
} from "@/lib/profile"

function ReadOnlyField({
  label,
  value,
  description,
  icon: Icon,
  badge,
}: {
  label: string
  value: string
  description?: string
  icon?: ComponentType<{ className?: string }>
  badge?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="onboarding-form-label">{label}</p>
      <div className="flex min-h-10 items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 ring-1 ring-foreground/8">
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{value}</p>
        {badge}
      </div>
      {description && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

function StatusTile({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-xl bg-muted/45 p-3 ring-1 ring-foreground/8">
      <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-secondary/35">
        <Icon className="size-4 text-foreground" />
      </div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function intentLabel(intent: string | null) {
  if (intent === "hire_staff") return "Hiring staff"
  if (intent === "find_work") return "Finding work"
  return "Not set"
}

export function SettingsPage() {
  const { profile } = useAuth()

  if (!profile) return null

  const displayName = getProfileDisplayName(profile)
  const initials = getProfileInitials(profile)
  const completion = getProfileCompletion(profile)
  const firstName = profile.firstName?.trim() || "—"
  const lastName = profile.lastName?.trim() || "—"
  const phone = profile.phoneNumber?.trim() || "Not provided"

  return (
    <div className="flex w-full flex-col gap-6">
      <ResourcePageHeader
        eyebrow="Account"
        title="Profile settings"
        description="Review the identity details connected to your Aplyk account and workspace access."
        icon={UserRoundIcon}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <div className="border-b border-border/70 bg-linear-to-br from-secondary/20 via-background to-muted/30 px-6 py-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar className="size-20 rounded-2xl ring-2 ring-background shadow-[var(--shadow-elevated)]">
                  {profile.profilePictureUrl && (
                    <AvatarImage src={profile.profilePictureUrl} alt={displayName} />
                  )}
                  <AvatarFallback className="rounded-2xl text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-2xl font-semibold tracking-tight">
                      {displayName}
                    </h3>
                    {profile.emailConfirmed && (
                      <Badge variant="secondary" className="gap-1 bg-secondary/50">
                        <BadgeCheckIcon className="size-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile.email ?? "No email on file"}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Account ID #{profile.id}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
              <StatusTile
                label="Intent"
                value={intentLabel(profile.initialIntent)}
                icon={BriefcaseBusinessIcon}
              />
              <StatusTile
                label="Email status"
                value={profile.emailConfirmed ? "Confirmed" : "Pending"}
                icon={MailIcon}
              />
              <StatusTile
                label="Company setup"
                value={
                  profile.companyProfileCompleted ? "Complete" : "In progress"
                }
                icon={ShieldCheckIcon}
              />
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Personal details</CardTitle>
              <CardDescription>
                Name and contact information from your authenticated account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyField label="First name" value={firstName} />
              <ReadOnlyField label="Last name" value={lastName} />
              <ReadOnlyField
                label="Email address"
                value={profile.email ?? "Not provided"}
                description="Used for account notifications and sign-in."
                icon={MailIcon}
                badge={
                  profile.emailConfirmed ? (
                    <Badge variant="secondary">Confirmed</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )
                }
              />
              <ReadOnlyField
                label="Phone number"
                value={phone}
                description="Optional contact number for workspace updates."
                icon={PhoneIcon}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Profile completeness</CardTitle>
              <CardDescription>
                Fields currently available from your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-3">
                <p className="font-heading text-3xl font-semibold tracking-tight">
                  {completion}%
                </p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
              <Progress value={completion} />
              <ul className="flex flex-col gap-2 text-sm">
                {[
                  { label: "First name", done: Boolean(profile.firstName?.trim()) },
                  { label: "Last name", done: Boolean(profile.lastName?.trim()) },
                  { label: "Email address", done: Boolean(profile.email) },
                  { label: "Phone number", done: Boolean(profile.phoneNumber?.trim()) },
                  { label: "Email confirmed", done: profile.emailConfirmed },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 ring-1 ring-foreground/8"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <Badge variant={item.done ? "secondary" : "outline"}>
                      {item.done ? "Done" : "Missing"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card size="sm" className="border border-secondary/30 bg-secondary/10">
            <CardHeader>
              <CardTitle>Editing coming soon</CardTitle>
              <CardDescription>
                Profile updates will sync with your Aplyk identity account once
                editing is enabled.
              </CardDescription>
            </CardHeader>
          </Card>
        </aside>
      </div>
    </div>
  )
}
