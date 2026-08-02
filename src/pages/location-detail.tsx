import * as React from "react"
import {
  ArrowLeftIcon,
  Building2Icon,
  ChevronRightIcon,
  Clock3Icon,
  ExternalLinkIcon,
  MapPinIcon,
  PencilIcon,
  StoreIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ShiftScheduleCalendar } from "@/components/shift-schedule-calendar"
import {
  getApiErrorMessage,
  locationsApi,
  shiftsApi,
} from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import type {
  CompanyLocation,
  CompanyLocationManagerOption,
  CompanyShift,
} from "@/types/api"

type DetailTab = "overview" | "upcoming" | "history"

const tabs: Array<{ id: DetailTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "upcoming", label: "Upcoming shifts" },
  { id: "history", label: "Shift history" },
]

function managerName(
  managerId: number | null,
  managers: CompanyLocationManagerOption[]
) {
  return (
    managers.find((manager) => manager.userId === managerId)?.displayName ??
    "Workspace owner"
  )
}

function fullAddress(location: CompanyLocation) {
  return (
    location.formattedAddress ||
    [
      location.addressLine1,
      location.addressLine2,
      location.cityName,
      location.stateName,
      location.postCode,
      location.countryName,
    ]
      .filter(Boolean)
      .join(", ")
  )
}

function mapsSearchUrl(location: CompanyLocation) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(location))}`
}

function mapsDirectionsUrl(location: CompanyLocation) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(location))}`
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium">{value}</span>
    </div>
  )
}

function ActivityStat({
  label,
  value,
  suffix,
  highlight,
}: {
  label: string
  value: number
  suffix?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl px-4 py-4 ring-1 ring-foreground/8 ${
        highlight ? "bg-primary/5" : "bg-card"
      }`}
    >
      <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={`font-heading text-3xl font-semibold tracking-tight ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </p>
    </div>
  )
}

function locationShiftLabel(shift: CompanyShift) {
  return shift.jobName || `Shift #${shift.id}`
}

function computeShiftStats(shifts: CompanyShift[]) {
  const now = Date.now()
  let upcomingOccurrences = 0
  let completedOccurrences = 0

  for (const shift of shifts) {
    for (const occurrence of shift.occurrences) {
      const endsAt = new Date(occurrence.endsAtUtc).getTime()
      if (endsAt > now) upcomingOccurrences += 1
      else completedOccurrences += 1
    }
  }

  return {
    upcomingOccurrences,
    completedOccurrences,
    totalShifts: shifts.length,
  }
}

function todayWindows(shifts: CompanyShift[]) {
  const today = new Date().toISOString().slice(0, 10)
  const windows: Array<{ label: string; time: string }> = []

  for (const shift of shifts) {
    for (const occurrence of shift.occurrences) {
      if (occurrence.localDate !== today) continue
      const start = shift.schedule?.startTime.slice(0, 5) ?? "—"
      const end = shift.schedule?.endTime.slice(0, 5) ?? "—"
      windows.push({
        label: shift.jobName || "Scheduled shift",
        time: `${start} - ${end}`,
      })
    }
  }

  return windows
}

export function LocationDetailPage({ locationId }: { locationId: number }) {
  const navigate = useNavigate()
  const [location, setLocation] = React.useState<CompanyLocation | null>(null)
  const [managers, setManagers] = React.useState<
    CompanyLocationManagerOption[]
  >([])
  const [shifts, setShifts] = React.useState<CompanyShift[]>([])
  const [activeTab, setActiveTab] = React.useState<DetailTab>("overview")
  const [isLoading, setIsLoading] = React.useState(true)

  const loadLocation = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const [nextLocation, nextManagers, nextShifts] = await Promise.all([
        locationsApi.get(locationId),
        locationsApi.getManagerOptions(),
        shiftsApi.list({ locationId }).catch(() => [] as CompanyShift[]),
      ])
      setLocation(nextLocation)
      setManagers(nextManagers)
      setShifts(nextShifts)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load this location."))
      setLocation(null)
    } finally {
      setIsLoading(false)
    }
  }, [locationId])

  React.useEffect(() => {
    void loadLocation()
  }, [loadLocation])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-5 w-44" />
        <div className="flex gap-4">
          <Skeleton className="size-16 rounded-2xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-11 w-full max-w-xl" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <MapPinIcon className="size-10 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-xl font-semibold">
            Location not found
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            This workplace may have been removed or you may not have access to it.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/locations">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to locations
          </Link>
        </Button>
      </div>
    )
  }

  const now = Date.now()
  const upcomingShifts = shifts.filter((shift) =>
    shift.occurrences.some(
      (occurrence) => new Date(occurrence.endsAtUtc).getTime() > now
    )
  )
  const pastShifts = shifts.filter(
    (shift) =>
      shift.occurrences.length > 0 &&
      shift.occurrences.every(
        (occurrence) => new Date(occurrence.endsAtUtc).getTime() <= now
      )
  )
  const stats = computeShiftStats(shifts)
  const windows = todayWindows(shifts)
  const address = fullAddress(location)

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/locations"
        className="inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back to locations
      </Link>

      <div className="flex flex-col gap-5 border-b border-border/70 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/35 text-foreground ring-1 ring-foreground/8">
            <StoreIcon className="size-7" />
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                {location.locationName}
              </h2>
              <Badge variant={location.isActive ? "secondary" : "outline"}>
                {location.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              ID:{" "}
              <span className="font-mono font-medium text-foreground">
                {location.code}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/team">
              <UsersRoundIcon data-icon="inline-start" />
              Manage staff
            </Link>
          </Button>
          <Button
            onClick={() =>
              toast.message("Location editing will be available soon.")
            }
          >
            <PencilIcon data-icon="inline-start" />
            Edit location
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

      {activeTab === "upcoming" || activeTab === "history" ? (
        <ShiftScheduleCalendar
          shifts={activeTab === "upcoming" ? upcomingShifts : pastShifts}
          onView={(shift) => navigate(`/shifts/${shift.id}`)}
          description={
            activeTab === "upcoming"
              ? "Upcoming shifts scheduled at this location."
              : "Completed shifts at this location."
          }
          emptyMessage={
            activeTab === "upcoming"
              ? "No upcoming shifts are scheduled at this location."
              : "No completed shifts at this location yet."
          }
          getEventLabel={locationShiftLabel}
          getAgendaTitle={locationShiftLabel}
          showLocationInAgenda={false}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <section className="flex flex-col gap-3">
              <h3 className="font-heading text-base font-semibold">
                Shift activity
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <ActivityStat
                  label="Upcoming"
                  value={stats.upcomingOccurrences}
                  suffix="shifts"
                  highlight
                />
                <ActivityStat
                  label="Completed"
                  value={stats.completedOccurrences}
                  suffix="total"
                />
                <ActivityStat
                  label="Total shifts"
                  value={stats.totalShifts}
                />
              </div>
            </section>

            <Card>
              <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">Address</CardTitle>
                </div>
                <Button variant="link" size="sm" className="h-auto px-0" asChild>
                  <a
                    href={mapsDirectionsUrl(location)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get directions
                  </a>
                </Button>
              </CardHeader>
              <CardContent className="pt-1">
                <DetailRow label="Street" value={location.addressLine1} />
                <DetailRow label="City" value={location.cityName || "—"} />
                <DetailRow
                  label="Province / state"
                  value={location.stateName || "—"}
                />
                <DetailRow
                  label="Zip / postal code"
                  value={location.postCode || "—"}
                />
                <DetailRow
                  label="Country"
                  value={location.countryName || "—"}
                />
              </CardContent>
            </Card>

            {(location.timeZoneId || location.currencyCode) && (
              <Card>
                <CardHeader className="gap-2 border-b border-border/70 pb-4">
                  <div className="flex items-center gap-2">
                    <Building2Icon className="size-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Scheduling defaults
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-1">
                  <DetailRow
                    label="Time zone"
                    value={location.timeZoneId || "Not set"}
                  />
                  <DetailRow
                    label="Currency"
                    value={location.currencyCode || "Not set"}
                  />
                  {location.zone && (
                    <DetailRow label="Zone" value={location.zone} />
                  )}
                  {location.comments && (
                    <DetailRow label="Notes" value={location.comments} />
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="flex flex-col gap-5">
          <Card>
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="text-base">Management</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Link
                to="/team"
                className="flex items-center gap-3 rounded-xl bg-muted/35 px-3 py-3 ring-1 ring-foreground/8 transition-colors hover:bg-muted/55"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRoundIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-muted-foreground">
                    Manager
                  </span>
                  <span className="block text-sm font-semibold">
                    {managerName(location.managerId, managers)}
                  </span>
                </span>
                <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border/70 pb-4">
              <CardTitle className="text-base">Location map</CardTitle>
              <Button variant="ghost" size="icon-sm" asChild>
                <a
                  href={mapsSearchUrl(location)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open in maps"
                >
                  <ExternalLinkIcon className="size-4" />
                </a>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <a
                href={mapsSearchUrl(location)}
                target="_blank"
                rel="noreferrer"
                className="relative block aspect-[4/3] overflow-hidden bg-muted/60"
              >
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--secondary)/0.4) 50%, hsl(var(--muted)) 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary)/0.08),transparent_55%),radial-gradient(circle_at_70%_60%,hsl(var(--primary)/0.06),transparent_50%)]" />
                <MapPinIcon className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
                <div className="absolute right-3 bottom-3 left-3">
                  <Badge
                    variant="secondary"
                    className="max-w-full truncate bg-background/95 shadow-sm"
                  >
                    {address || location.locationName}
                  </Badge>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary/15 bg-primary/5">
            <CardHeader className="gap-2 border-b border-primary/10 pb-4">
              <div className="flex items-center gap-2">
                <Clock3Icon className="size-4 text-primary" />
                <CardTitle className="text-base">Today&apos;s window</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-4">
              {windows.length ? (
                windows.map((window, index) => (
                  <div
                    key={`${window.label}-${index}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-medium">{window.label}</span>
                    <span className="text-muted-foreground">{window.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No shifts scheduled at this location today.
                </p>
              )}
              <Button
                variant="outline"
                className="mt-1 w-full bg-background"
                onClick={() => navigate(`/shifts?locationId=${location.id}`)}
              >
                View full schedule
              </Button>
            </CardContent>
          </Card>
        </aside>
        </div>
      )}
    </div>
  )
}
