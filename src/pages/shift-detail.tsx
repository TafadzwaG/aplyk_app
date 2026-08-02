import * as React from "react"
import {
  ArrowLeftIcon,
  BriefcaseBusinessIcon,
  CalendarClockIcon,
  ChevronRightIcon,
  Clock3Icon,
  InfoIcon,
  MapPinIcon,
  PencilIcon,
  UsersRoundIcon,
  WalletIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getApiErrorMessage, shiftsApi } from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import {
  bookedCount,
  canEditShift,
  estimateTotalPay,
  formatOccurrenceDate,
  formatRate,
  scheduleTypeLabel,
  shiftDateDisplay,
  shiftReferenceCode,
  shiftTimeDisplay,
  statusLabel,
} from "@/lib/shift-utils"
import type { CompanyShift, ShiftApplication } from "@/types/api"

type DetailTab =
  | "overview"
  | "applicants"
  | "accepted"
  | "waiting"
  | "attendance"

const tabs: Array<{ id: DetailTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "applicants", label: "Applicants" },
  { id: "accepted", label: "Accepted" },
  { id: "waiting", label: "Waiting" },
  { id: "attendance", label: "Attendance" },
]

function applicationStatusLabel(status: number) {
  return (
    {
      1: "Applied",
      2: "Accepted",
      3: "Waitlisted",
      4: "Rejected",
      5: "Withdrawn",
      6: "Cancelled",
      7: "Ineligible",
    }[status] ?? "Unknown"
  )
}

function DetailField({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function HiringStat({
  label,
  value,
  highlight,
  urgent,
}: {
  label: string
  value: string
  highlight?: boolean
  urgent?: boolean
}) {
  return (
    <div
      className={`rounded-lg px-3 py-2.5 ring-1 ring-foreground/8 ${
        highlight ? "border-l-2 border-l-primary bg-primary/5" : "bg-muted/35"
      }`}
    >
      <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${
          urgent ? "text-destructive" : ""
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function ApplicationList({
  applications,
  emptyMessage,
}: {
  applications: ShiftApplication[]
  emptyMessage: string
}) {
  if (!applications.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="divide-y divide-border/70 p-0">
        {applications.map((application) => (
          <div
            key={application.id}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">
                Candidate #{application.candidateId}
              </p>
              <p className="text-xs text-muted-foreground">
                Applied{" "}
                {new Intl.DateTimeFormat(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(application.appliedAtUtc))}
              </p>
            </div>
            <Badge variant="outline">
              {applicationStatusLabel(application.status)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ShiftDetailPage({ shiftId }: { shiftId: number }) {
  const navigate = useNavigate()
  const [shift, setShift] = React.useState<CompanyShift | null>(null)
  const [applications, setApplications] = React.useState<ShiftApplication[]>([])
  const [activeTab, setActiveTab] = React.useState<DetailTab>("overview")
  const [isLoading, setIsLoading] = React.useState(true)

  const loadShift = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const [nextShift, nextApplications] = await Promise.all([
        shiftsApi.get(shiftId),
        shiftsApi.listApplications(shiftId).catch(() => [] as ShiftApplication[]),
      ])
      setShift(nextShift)
      setApplications(nextApplications)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load this shift."))
      setShift(null)
    } finally {
      setIsLoading(false)
    }
  }, [shiftId])

  React.useEffect(() => {
    void loadShift()
  }, [loadShift])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-5 w-40" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <Skeleton className="h-11 w-full max-w-xl" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!shift) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <CalendarClockIcon className="size-10 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-xl font-semibold">Shift not found</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            This shift may have been removed or you may not have access to it.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/shifts">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to shifts
          </Link>
        </Button>
      </div>
    )
  }

  const acceptedApplications = applications.filter((item) => item.status === 2)
  const applicantPool = applications.filter((item) =>
    [1, 2, 3].includes(item.status)
  )
  const waitingApplications = applications.filter((item) => item.status === 3)
  const acceptedCount = Math.max(bookedCount(shift), acceptedApplications.length)
  const remaining = Math.max(shift.peopleNeeded - acceptedCount, 0)
  const hiringProgress =
    shift.peopleNeeded > 0
      ? Math.min((acceptedCount / shift.peopleNeeded) * 100, 100)
      : 0
  const totalPay = estimateTotalPay(shift)

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/shifts"
        className="inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back to shifts
      </Link>

      <div className="flex flex-col gap-5 border-b border-border/70 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={shift.status === 2 ? "secondary" : "outline"}>
              {statusLabel(shift.status)}
            </Badge>
            <Badge variant="outline" className="font-mono text-[0.6875rem]">
              {shiftReferenceCode(shift.id)}
            </Badge>
          </div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            {shift.jobName || `Shift #${shift.id}`}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={!canEditShift(shift)}
            onClick={() => navigate(`/shifts/new?edit=${shift.id}`)}
          >
            <PencilIcon data-icon="inline-start" />
            Edit shift
          </Button>
          <Button onClick={() => setActiveTab("applicants")}>
            <UsersRoundIcon data-icon="inline-start" />
            Manage applications
          </Button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border/70">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-5">
          {activeTab === "overview" && (
            <>
              <Card>
                <CardHeader className="border-b border-border/70 pb-4">
                  <CardTitle>Key details</CardTitle>
                  <CardDescription>
                    Schedule, pay, and staffing requirements for this shift.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 pt-5 sm:grid-cols-2 xl:grid-cols-4">
                  <DetailField
                    label="Date"
                    value={shiftDateDisplay(shift)}
                    icon={CalendarClockIcon}
                  />
                  <DetailField
                    label="Time"
                    value={shiftTimeDisplay(shift)}
                    icon={Clock3Icon}
                  />
                  <DetailField
                    label="Hourly rate"
                    value={
                      shift.hourlyRate > 0 ? `${formatRate(shift)} / hour` : "—"
                    }
                    icon={WalletIcon}
                  />
                  <DetailField
                    label="Total pay"
                    value={totalPay ? `${totalPay} est.` : "—"}
                    icon={WalletIcon}
                  />
                  <DetailField
                    label="Location"
                    value={shift.locationName || "Not selected"}
                    icon={MapPinIcon}
                  />
                  <DetailField
                    label="Schedule type"
                    value={scheduleTypeLabel(shift)}
                    icon={CalendarClockIcon}
                  />
                  <DetailField
                    label="People needed"
                    value={`${shift.peopleNeeded || 0} people`}
                    icon={UsersRoundIcon}
                  />
                  <DetailField
                    label="Waiting list"
                    value={shift.keepWaitingList ? "Enabled" : "Disabled"}
                    icon={UsersRoundIcon}
                  />
                </CardContent>
              </Card>

              {(shift.shiftInstructions || shift.description) && (
                <Card className="overflow-hidden border-l-4 border-l-primary">
                  <CardHeader className="gap-2 pb-3">
                    <div className="flex items-center gap-2">
                      <InfoIcon className="size-4 text-primary" />
                      <CardTitle>Shift instructions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {shift.shiftInstructions || shift.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="border-b border-border/70 pb-4">
                  <CardTitle>Related details</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border/70 p-0">
                  <Link
                    to={`/job-profiles/${shift.jobProfileId}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/35"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/35 ring-1 ring-foreground/8">
                      <BriefcaseBusinessIcon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {shift.jobName || "Job profile"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reusable role profile
                      </p>
                    </div>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                  <Link
                    to="/locations"
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/35"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/35 ring-1 ring-foreground/8">
                      <MapPinIcon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {shift.locationName || "Workplace"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {shift.locationAddress || "View location details"}
                      </p>
                    </div>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "applicants" && (
            <ApplicationList
              applications={applications.filter((item) => item.status === 1)}
              emptyMessage="No pending applicants yet."
            />
          )}

          {activeTab === "accepted" && (
            <ApplicationList
              applications={acceptedApplications}
              emptyMessage="No accepted professionals yet."
            />
          )}

          {activeTab === "waiting" && (
            <ApplicationList
              applications={waitingApplications}
              emptyMessage="No one is on the waiting list."
            />
          )}

          {activeTab === "attendance" && (
            <Card>
              <CardHeader className="border-b border-border/70 pb-4">
                <CardTitle>Occurrences</CardTitle>
                <CardDescription>
                  Attendance tracking will appear here once shifts begin.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 pt-5 sm:grid-cols-2">
                {shift.occurrences.length ? (
                  shift.occurrences.map((occurrence) => (
                    <div
                      key={occurrence.id}
                      className="rounded-lg bg-muted/35 px-3 py-3 ring-1 ring-foreground/8"
                    >
                      <p className="text-sm font-medium">
                        {formatOccurrenceDate(occurrence.localDate)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {occurrence.booked} of {occurrence.peopleNeeded} filled
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No occurrences scheduled yet.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-5">
          <Card>
            <CardHeader className="gap-3 border-b border-border/70 pb-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">Hiring progress</CardTitle>
                <span className="text-sm font-semibold text-primary">
                  {acceptedCount} of {shift.peopleNeeded} accepted
                </span>
              </div>
              <Progress value={hiringProgress} className="h-2" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pt-4">
              <HiringStat
                label="Applicants"
                value={`${applicantPool.length} people`}
              />
              <HiringStat
                label="Accepted"
                value={`${acceptedCount} people`}
                highlight
              />
              <HiringStat
                label="Waiting list"
                value={`${waitingApplications.length} people`}
              />
              <HiringStat
                label="Remaining"
                value={`${remaining} places`}
                urgent={remaining > 0 && shift.status === 2}
              />
            </CardContent>
            <div className="border-t border-border/70 px-5 py-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setActiveTab("applicants")}
              >
                Manage applicants
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex h-36 items-center justify-center bg-muted/50 ring-1 ring-inset ring-foreground/8">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <MapPinIcon className="size-6" />
                <p className="text-xs">Workplace map preview</p>
              </div>
            </div>
            <CardContent className="flex flex-col gap-1 pt-4">
              <p className="text-sm font-semibold">
                {shift.locationName || "Workplace"}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {shift.locationAddress || "Address not available"}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
