import * as React from "react"
import type { ComponentType } from "react"
import {
  BanknoteIcon,
  BriefcaseBusinessIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  CalendarPlusIcon,
  ChartNoAxesColumnIncreasingIcon,
  CheckCircle2Icon,
  CircleIcon,
  Clock3Icon,
  EyeIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
  UserPlusIcon,
  UsersRoundIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { dashboardApi, getApiErrorMessage } from "@/lib/api"
import { Link } from "@/lib/router"
import type {
  CompanyDashboardOverview,
  CompanyDashboardUpcomingShift,
} from "@/types/api"

type DashboardIcon = ComponentType<{
  className?: string
  "data-icon"?: "inline-start" | "inline-end"
}>

function showPremiumPlaceholder() {
  toast.info("Premium jobs are coming soon", {
    description: "Your standard shift workflow is ready to use today.",
  })
}

function formatDate(localDate: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${localDate}T00:00:00`))
}

function formatTimeRange(shift: CompanyDashboardUpcomingShift) {
  const formatter = new Intl.DateTimeFormat("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: shift.timeZoneId,
  })
  return `${formatter.format(new Date(shift.startsAtUtc))}–${formatter.format(
    new Date(shift.endsAtUtc)
  )}`
}

function formatRate(shift: CompanyDashboardUpcomingShift) {
  try {
    return `${new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: shift.currencyCode,
      maximumFractionDigits: 2,
    }).format(shift.hourlyRate)}/hr`
  } catch {
    return `${shift.currencyCode} ${shift.hourlyRate.toFixed(2)}/hr`
  }
}

function IconTile({ icon: Icon }: { icon: DashboardIcon }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary/35 text-foreground">
      <Icon className="size-4" />
    </span>
  )
}

function SetupItem({
  label,
  done,
  href,
}: {
  label: string
  done: boolean
  href: string
}) {
  return (
    <div className="flex min-h-12 items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 ring-1 ring-foreground/8">
      {done ? (
        <CheckCircle2Icon className="size-5 shrink-0 text-primary" />
      ) : (
        <CircleIcon className="size-5 shrink-0 text-muted-foreground/60" />
      )}
      <span className="min-w-0 flex-1 text-sm font-medium">{label}</span>
      {done ? (
        <Badge variant="secondary">Done</Badge>
      ) : (
        <Button size="sm" asChild>
          <Link to={href}>Set up</Link>
        </Button>
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | null
  icon: DashboardIcon
}) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <IconTile icon={icon} />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          {value === null ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="font-heading text-2xl font-semibold tracking-tight">
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickAction({
  label,
  icon,
  href,
}: {
  label: string
  icon: DashboardIcon
  href: string
}) {
  return (
    <Button
      variant="outline"
      className="h-auto justify-start gap-3 px-3 py-3 text-sm"
      asChild
    >
      <Link to={href}>
        <IconTile icon={icon} />
        <span>{label}</span>
      </Link>
    </Button>
  )
}

function ShiftCard({ shift }: { shift: CompanyDashboardUpcomingShift }) {
  const detailHref = `/shifts/${shift.shiftId}`

  return (
    <Card
      size="sm"
      className="transition-shadow hover:shadow-[var(--shadow-elevated)]"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary/35 text-foreground">
            <BriefcaseBusinessIcon className="size-4" />
          </span>
          <span className="min-w-0">
            <Link
              to={detailHref}
              className="block truncate transition-colors hover:text-primary"
            >
              {shift.jobName}
            </Link>
          </span>
        </CardTitle>
        <CardDescription>{shift.locationName}</CardDescription>
        <CardAction>
          <Button variant="secondary" size="sm" asChild>
            <Link to={detailHref}>
              <EyeIcon data-icon="inline-start" />
              View details
            </Link>
          </Button>
        </CardAction>
        <div className="col-span-2 flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">
            {shift.status === 3 ? "Filled" : "Published"}
          </Badge>
          <Badge variant="outline">
            {shift.booked} of {shift.peopleNeeded} filled
          </Badge>
          <Badge variant="outline">
            {shift.applicantCount}{" "}
            {shift.applicantCount === 1 ? "applicant" : "applicants"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <span className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 text-foreground" />
          {formatDate(shift.localDate)}
        </span>
        <span className="flex items-center gap-2">
          <Clock3Icon className="size-4 text-foreground" />
          {formatTimeRange(shift)}
        </span>
        <span className="flex items-center gap-2">
          <BanknoteIcon className="size-4 text-foreground" />
          {formatRate(shift)}
        </span>
      </CardContent>
    </Card>
  )
}

function ShiftCardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { profile } = useAuth()
  const [dashboard, setDashboard] =
    React.useState<CompanyDashboardOverview | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [reloadKey, setReloadKey] = React.useState(0)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!profile?.activeCompanyId) return

    let active = true

    dashboardApi
      .getCompanyOverview()
      .then((overview) => {
        if (active) setDashboard(overview)
      })
      .catch((error: unknown) => {
        if (!active) return
        const message = getApiErrorMessage(
          error,
          "Dashboard statistics could not be loaded."
        )
        setLoadError(message)
        toast.error("Could not load dashboard", { description: message })
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [profile?.activeCompanyId, reloadKey])

  if (!profile) return null

  const setup = dashboard?.setup
  const setupSteps = [
    {
      label: "Company details",
      done: setup?.companyDetailsComplete ?? profile.companyProfileCompleted,
      href: "/onboarding/company",
    },
    {
      label: "Add location",
      done: (setup?.locationCount ?? 0) > 0,
      href: "/locations",
    },
    {
      label: "Add job profile",
      done: (setup?.jobProfileCount ?? 0) > 0,
      href: "/job-profiles",
    },
    {
      label: "Invite a user",
      done:
        (setup?.teamMemberCount ?? 0) > 1 ||
        (setup?.pendingInvitationCount ?? 0) > 0,
      href: "/team",
    },
  ]
  const completedSteps = setupSteps.filter((step) => step.done).length
  const setupProgress = (completedSteps / setupSteps.length) * 100
  const metrics = dashboard
    ? [
        {
          label: "Total shifts",
          value: dashboard.metrics.totalShifts.toLocaleString(),
          icon: CalendarDaysIcon,
        },
        {
          label: "Active shifts",
          value: dashboard.metrics.activeShifts.toLocaleString(),
          icon: ChartNoAxesColumnIncreasingIcon,
        },
        {
          label: "Upcoming",
          value: dashboard.metrics.upcomingOccurrences.toLocaleString(),
          icon: Clock3Icon,
        },
        {
          label: "Attendance",
          value: `${dashboard.metrics.attendancePercentage.toLocaleString()}%`,
          icon: ShieldCheckIcon,
        },
      ]
    : [
        { label: "Total shifts", value: null, icon: CalendarDaysIcon },
        {
          label: "Active shifts",
          value: null,
          icon: ChartNoAxesColumnIncreasingIcon,
        },
        { label: "Upcoming", value: null, icon: Clock3Icon },
        { label: "Attendance", value: null, icon: ShieldCheckIcon },
      ]
  const attentionItems = [
    {
      label: "Applicants awaiting review",
      count: dashboard?.attention.applicantsAwaitingReview,
      icon: UsersRoundIcon,
      href: "/applications",
    },
    {
      label: "Shifts still needing cover",
      count: dashboard?.attention.shiftsNeedingCover,
      icon: TriangleAlertIcon,
      href: "/shifts",
    },
    {
      label: "Attendance to confirm",
      count: dashboard?.attention.attendanceToConfirm,
      icon: CheckCircle2Icon,
      href: "/shifts",
    },
  ]

  function retryDashboard() {
    setIsLoading(true)
    setLoadError(null)
    setReloadKey((value) => value + 1)
  }

  return (
    <div className="grid items-start gap-5 2xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
      <div className="flex min-w-0 flex-col gap-5">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Complete your company setup</CardTitle>
            <CardDescription>
              Complete each step in any order to get your company ready.
            </CardDescription>
            <CardAction>
              {isLoading && !dashboard ? (
                <Skeleton className="h-5 w-28" />
              ) : (
                <Badge variant="secondary">
                  {completedSteps} of {setupSteps.length} completed
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress value={setupProgress} />
            <div className="grid gap-3 md:grid-cols-2">
              {setupSteps.map((step) => (
                <SetupItem key={step.label} {...step} />
              ))}
            </div>
          </CardContent>
        </Card>

        <section
          className="flex flex-col gap-3"
          aria-labelledby="overview-heading"
        >
          <div className="flex flex-col gap-1">
            <h2
              id="overview-heading"
              className="font-heading text-lg font-semibold"
            >
              Live overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Current activity across your company.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </section>

        <section
          className="flex flex-col gap-3"
          aria-labelledby="upcoming-shifts-heading"
        >
          <div className="flex items-center justify-between gap-4">
            <h2
              id="upcoming-shifts-heading"
              className="font-heading text-lg font-semibold"
            >
              Upcoming shifts
            </h2>
            <Button variant="link" className="px-0" asChild>
              <Link to="/shifts">See all</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {isLoading && !dashboard ? (
              <>
                <ShiftCardSkeleton />
                <ShiftCardSkeleton />
              </>
            ) : loadError && !dashboard ? (
              <Card size="sm">
                <CardContent>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <TriangleAlertIcon />
                      </EmptyMedia>
                      <EmptyTitle>Dashboard unavailable</EmptyTitle>
                      <EmptyDescription>{loadError}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button onClick={retryDashboard}>Try again</Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            ) : dashboard?.upcomingShifts.length ? (
              dashboard.upcomingShifts.map((shift) => (
                <ShiftCard key={shift.occurrenceId} shift={shift} />
              ))
            ) : (
              <Card size="sm">
                <CardContent>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <CalendarDaysIcon />
                      </EmptyMedia>
                      <EmptyTitle>No upcoming shifts</EmptyTitle>
                      <EmptyDescription>
                        Publish a shift to see it in your live company overview.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button asChild>
                        <Link to="/shifts">Create a shift</Link>
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>

      <aside className="flex min-w-0 flex-col gap-5">
        <section
          className="flex flex-col gap-3"
          aria-labelledby="quick-actions-heading"
        >
          <h2
            id="quick-actions-heading"
            className="font-heading text-lg font-semibold"
          >
            Quick actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-3 2xl:grid-cols-1">
            <QuickAction
              label="Create shift"
              icon={CalendarPlusIcon}
              href="/shifts"
            />
            <QuickAction
              label="Create job profile"
              icon={BriefcaseBusinessIcon}
              href="/job-profiles"
            />
            <QuickAction label="Invite user" icon={UserPlusIcon} href="/team" />
          </div>
        </section>

        <section
          className="flex flex-col gap-3"
          aria-labelledby="needs-attention-heading"
        >
          <h2
            id="needs-attention-heading"
            className="font-heading text-lg font-semibold"
          >
            Needs attention
          </h2>
          <Card size="sm">
            <CardContent className="flex flex-col gap-1 p-2">
              {attentionItems.map(({ label, count, icon: Icon, href }) => (
                <Button
                  key={label}
                  variant="ghost"
                  className="h-auto justify-start gap-3 px-3 py-3 text-left text-xs"
                  asChild
                >
                  <Link to={href}>
                    <Icon data-icon="inline-start" />
                    <span className="min-w-0 flex-1 whitespace-normal">
                      {label}
                    </span>
                    {count === undefined ? (
                      <Skeleton className="size-5 rounded-full" />
                    ) : (
                      <Badge className="rounded-full">{count}</Badge>
                    )}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card size="sm" className="border border-secondary/30 bg-secondary/15">
          <CardHeader>
            <CardTitle>Scale your team</CardTitle>
            <CardDescription>
              Access a network of certified healthcare professionals.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              type="button"
              className="w-full"
              onClick={showPremiumPlaceholder}
            >
              <CalendarCheckIcon data-icon="inline-start" />
              Post a Premium Job
            </Button>
          </CardFooter>
        </Card>
      </aside>
    </div>
  )
}
