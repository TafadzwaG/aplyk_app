import * as React from "react"
import {
  ArchiveIcon,
  ArrowUpDownIcon,
  BanknoteIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  CalendarPlusIcon,
  Clock3Icon,
  EyeIcon,
  LayoutGridIcon,
  ListIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UsersRoundIcon,
} from "lucide-react"
import { toast } from "sonner"

import { MetricStatCard } from "@/components/metric-stat-card"
import { ResourcePageHeader } from "@/components/resource-page-header"
import { ShiftScheduleCalendar } from "@/components/shift-schedule-calendar"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useAuth } from "@/contexts/auth-context"
import {
  getApiErrorMessage,
  jobProfilesApi,
  locationsApi,
  shiftsApi,
} from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import {
  canArchiveShift,
  canEditShift,
  formatRate,
  scheduleSummary,
  statusLabel,
} from "@/lib/shift-utils"
import type {
  CompanyLocation,
  CompanyRoleProfile,
  CompanyShift,
  ShiftListQuery,
} from "@/types/api"

type SortOption =
  | "created-desc"
  | "created-asc"
  | "name-asc"
  | "name-desc"
  | "rate-asc"
  | "rate-desc"
  | "status-asc"
  | "status-desc"
  | "location-asc"
  | "schedule-asc"

function parseSortOption(value: SortOption): Pick<
  ShiftListQuery,
  "sortBy" | "sortDirection"
> {
  const [sortBy, sortDirection] = value.split("-") as [
    ShiftListQuery["sortBy"],
    "asc" | "desc",
  ]
  return { sortBy, sortDirection }
}

function ShiftCard({
  shift,
  busyShiftId,
  onView,
  onEdit,
  onArchive,
}: {
  shift: CompanyShift
  busyShiftId: number | null
  onView: (shift: CompanyShift) => void
  onEdit: (shift: CompanyShift) => void
  onArchive: (shift: CompanyShift) => void
}) {
  const booked = shift.occurrences.reduce(
    (total, occurrence) => total + occurrence.booked,
    0
  )
  const isBusy = busyShiftId === shift.id

  return (
    <Card size="sm" className="h-full">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/35 text-foreground ring-1 ring-foreground/8">
            <CalendarClockIcon className="size-4" />
          </span>
          <Badge variant={shift.status === 2 ? "secondary" : "outline"}>
            {statusLabel(shift.status)}
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle>
            {shift.jobName || `Draft shift #${shift.id}`}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {shift.shiftInstructions ||
              shift.description ||
              "Details pending"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg bg-muted/45 px-3 py-2.5 ring-1 ring-foreground/8">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Schedule
          </p>
          <p className="mt-1 text-sm font-medium">{scheduleSummary(shift)}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium">
                {shift.locationName || "Not selected"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <UsersRoundIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Staffing</p>
              <p className="font-medium">
                {booked} booked · {shift.peopleNeeded || 0} needed
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-sm ring-1 ring-foreground/8">
          <BanknoteIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">Rate</span>
          <span className="ml-auto font-medium">
            {shift.hourlyRate > 0 ? `${formatRate(shift)} / hr` : "—"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t border-border/70 bg-muted/30">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isBusy}
          onClick={() => onView(shift)}
        >
          <EyeIcon data-icon="inline-start" />
          View
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isBusy || !canEditShift(shift)}
          onClick={() => onEdit(shift)}
        >
          <PencilIcon data-icon="inline-start" />
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isBusy || !canArchiveShift(shift)}
          onClick={() => onArchive(shift)}
        >
          {isBusy ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <ArchiveIcon data-icon="inline-start" />
          )}
          Archive
        </Button>
      </CardFooter>
    </Card>
  )
}

type ShiftView = "calendar" | "cards" | "list"

function ShiftList({
  shifts,
  busyShiftId,
  onView,
  onEdit,
  onArchive,
}: {
  shifts: CompanyShift[]
  busyShiftId: number | null
  onView: (shift: CompanyShift) => void
  onEdit: (shift: CompanyShift) => void
  onArchive: (shift: CompanyShift) => void
}) {
  return <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Shift</TableHead><TableHead>Schedule</TableHead><TableHead>Location</TableHead><TableHead>Staffing</TableHead><TableHead>Rate</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{shifts.map((shift) => { const booked = shift.occurrences.reduce((total, occurrence) => total + occurrence.booked, 0); const isBusy = busyShiftId === shift.id; return <TableRow key={shift.id}><TableCell><div className="flex flex-col"><span className="font-medium">{shift.jobName || `Draft shift #${shift.id}`}</span><span className="text-xs text-muted-foreground">{shift.shiftInstructions || "Details pending"}</span></div></TableCell><TableCell>{scheduleSummary(shift)}</TableCell><TableCell>{shift.locationName || "Not selected"}</TableCell><TableCell>{booked}/{shift.peopleNeeded || 0} booked</TableCell><TableCell>{shift.hourlyRate > 0 ? `${formatRate(shift)} / hr` : "—"}</TableCell><TableCell><Badge variant={shift.status === 2 ? "secondary" : "outline"}>{statusLabel(shift.status)}</Badge></TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" disabled={isBusy} onClick={() => onView(shift)}><EyeIcon data-icon="inline-start" />View</Button><Button size="sm" variant="outline" disabled={isBusy || !canEditShift(shift)} onClick={() => onEdit(shift)}><PencilIcon data-icon="inline-start" />Edit</Button><Button size="sm" variant="destructive" disabled={isBusy || !canArchiveShift(shift)} onClick={() => onArchive(shift)}>{isBusy ? <Spinner data-icon="inline-start" /> : <ArchiveIcon data-icon="inline-start" />}Archive</Button></div></TableCell></TableRow> })}</TableBody></Table></CardContent></Card>
}

export function ShiftsPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const companyId = profile?.activeCompanyId ?? null
  const [allShifts, setAllShifts] = React.useState<CompanyShift[]>([])
  const [shifts, setShifts] = React.useState<CompanyShift[]>([])
  const [jobProfiles, setJobProfiles] = React.useState<CompanyRoleProfile[]>([])
  const [locations, setLocations] = React.useState<CompanyLocation[]>([])
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [locationFilter, setLocationFilter] = React.useState("all")
  const [profileFilter, setProfileFilter] = React.useState("all")
  const [scheduleFilter, setScheduleFilter] = React.useState("all")
  const [upcomingFilter, setUpcomingFilter] = React.useState("all")
  const [sortOption, setSortOption] = React.useState<SortOption>("created-desc")
  const [view, setView] = React.useState<ShiftView>("calendar")
  const [archiveShift, setArchiveShift] = React.useState<CompanyShift | null>(
    null
  )
  const [busyShiftId, setBusyShiftId] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const listQuery = React.useMemo((): ShiftListQuery => {
    const { sortBy, sortDirection } = parseSortOption(sortOption)
    return {
      search: debouncedSearch || undefined,
      status: statusFilter !== "all" ? Number(statusFilter) : undefined,
      locationId:
        locationFilter !== "all" ? Number(locationFilter) : undefined,
      jobProfileId:
        profileFilter !== "all" ? Number(profileFilter) : undefined,
      assignmentType:
        scheduleFilter === "single"
          ? 1
          : scheduleFilter === "recurring"
            ? 2
            : undefined,
      hasUpcoming:
        upcomingFilter === "all"
          ? undefined
          : upcomingFilter === "upcoming"
            ? true
            : false,
      sortBy,
      sortDirection,
    }
  }, [
    debouncedSearch,
    statusFilter,
    locationFilter,
    profileFilter,
    scheduleFilter,
    upcomingFilter,
    sortOption,
  ])

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    statusFilter !== "all" ||
    locationFilter !== "all" ||
    profileFilter !== "all" ||
    scheduleFilter !== "all" ||
    upcomingFilter !== "all" ||
    sortOption !== "created-desc"

  const loadReferenceData = React.useCallback(async () => {
    if (!companyId) return
    try {
      const [nextProfiles, nextLocations] = await Promise.all([
        jobProfilesApi.list(companyId),
        locationsApi.list(companyId),
      ])
      setJobProfiles(nextProfiles)
      setLocations(nextLocations.filter((location) => location.isActive))
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load shift filters."))
    }
  }, [companyId])

  const loadAllShifts = React.useCallback(async () => {
    try {
      const nextShifts = await shiftsApi.list()
      setAllShifts(nextShifts)
    } catch {
      setAllShifts([])
    }
  }, [])

  const loadShifts = React.useCallback(async () => {
    if (!companyId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const nextShifts = await shiftsApi.list(listQuery)
      setShifts(nextShifts)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load shifts."))
    } finally {
      setIsLoading(false)
    }
  }, [companyId, listQuery])

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const locationId = Number(params.get("locationId"))
    if (locationId) {
      setLocationFilter(String(locationId))
      params.delete("locationId")
      const nextSearch = params.toString()
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`
      )
    }
  }, [])

  React.useEffect(() => {
    void loadReferenceData()
  }, [loadReferenceData])

  React.useEffect(() => {
    if (companyId) void loadAllShifts()
  }, [companyId, loadAllShifts])

  React.useEffect(() => {
    void loadShifts()
  }, [loadShifts])

  function clearFilters() {
    setSearch("")
    setStatusFilter("all")
    setLocationFilter("all")
    setProfileFilter("all")
    setScheduleFilter("all")
    setUpcomingFilter("all")
    setSortOption("created-desc")
  }

  async function handleArchiveConfirm() {
    if (!archiveShift) return

    setBusyShiftId(archiveShift.id)
    try {
      await shiftsApi.cancel(archiveShift.id, "Archived from shift list")
      toast.success("Shift archived", {
        description: `${archiveShift.jobName || "Shift"} has been removed from your active schedule.`,
      })
      setArchiveShift(null)
      await Promise.all([loadAllShifts(), loadShifts()])
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not archive this shift."))
    } finally {
      setBusyShiftId(null)
    }
  }

  function handleViewShift(shift: CompanyShift) {
    navigate(`/shifts/${shift.id}`)
  }

  function handleEditShift(shift: CompanyShift) {
    if (!canEditShift(shift)) {
      toast.message("Only draft shifts can be edited right now.")
      return
    }
    navigate(`/shifts/new?edit=${shift.id}`)
  }

  const publishedCount = allShifts.filter((shift) => shift.status === 2).length
  const draftCount = allShifts.filter((shift) => shift.status === 1).length
  const upcomingCount = allShifts.reduce(
    (total, shift) =>
      total +
      shift.occurrences.filter(
        (occurrence) => new Date(occurrence.endsAtUtc).getTime() > Date.now()
      ).length,
    0
  )

  const canCreate =
    Boolean(companyId) && jobProfiles.length > 0 && locations.length > 0

  return (
    <div className="flex flex-col gap-6">
      <ResourcePageHeader
        eyebrow="Scheduling"
        title="Shifts"
        description="Turn a saved role into a single or recurring schedule, then publish it to eligible professionals."
        icon={CalendarClockIcon}
        action={
          <Button disabled={!canCreate} asChild>
            <Link to="/shifts/new">
              <PlusIcon data-icon="inline-start" />
              Add shift
            </Link>
          </Button>
        }
      />

      <AlertDialog
        open={archiveShift !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && busyShiftId === null) setArchiveShift(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <ArchiveIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Archive this shift?</AlertDialogTitle>
            <AlertDialogDescription>
              {archiveShift?.jobName || "This shift"} will be cancelled and
              removed from your active schedule. Professionals will no longer
              see open occurrences.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyShiftId !== null}>
              Keep shift
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={busyShiftId !== null}
              onClick={(event) => {
                event.preventDefault()
                void handleArchiveConfirm()
              }}
            >
              {busyShiftId !== null && <Spinner data-icon="inline-start" />}
              Archive shift
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricStatCard
          label="Published shifts"
          value={publishedCount}
          icon={CalendarDaysIcon}
          variant="rings"
        />
        <MetricStatCard
          label="Upcoming occurrences"
          value={upcomingCount}
          icon={Clock3Icon}
          variant="waves"
        />
        <MetricStatCard
          label="Drafts in progress"
          value={draftCount}
          icon={CalendarPlusIcon}
          variant="grid"
        />
      </div>

      {!jobProfiles.length && !isLoading && (
        <Card size="sm" className="bg-muted/40">
          <CardHeader>
            <CardTitle>Add a job profile first</CardTitle>
            <CardDescription>
              Shifts inherit their role description and matching requirements
              from a job profile.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      {!locations.length && !isLoading && (
        <Card size="sm" className="bg-muted/40">
          <CardHeader>
            <CardTitle>Add a location first</CardTitle>
            <CardDescription>
              A location supplies the local time zone and currency used by the
              shift.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold">Shift schedule</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasActiveFilters
                ? `${shifts.length} shift${shifts.length === 1 ? "" : "s"} match your filters`
                : "Published shifts and drafts for the active company workspace."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) => { if (value) setView(value as ShiftView) }}
              variant="outline"
              size="sm"
              spacing={0}
              aria-label="Choose shift display"
            >
              <ToggleGroupItem value="calendar" aria-label="Calendar view" title="Calendar view"><CalendarDaysIcon /></ToggleGroupItem>
              <ToggleGroupItem value="cards" aria-label="Card view" title="Card view"><LayoutGridIcon /></ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" title="List view"><ListIcon /></ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-3 py-4">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search shifts by role, location, or briefing..."
                className="pl-9"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SlidersHorizontalIcon
                    data-icon="inline-start"
                    className="size-4 text-muted-foreground"
                  />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="1">Draft</SelectItem>
                    <SelectItem value="2">Published</SelectItem>
                    <SelectItem value="3">Filled</SelectItem>
                    <SelectItem value="4">Completed</SelectItem>
                    <SelectItem value="5">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full">
                  <MapPinIcon
                    data-icon="inline-start"
                    className="size-4 text-muted-foreground"
                  />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={String(location.id)}>
                        {location.locationName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={profileFilter} onValueChange={setProfileFilter}>
                <SelectTrigger className="w-full">
                  <CalendarClockIcon
                    data-icon="inline-start"
                    className="size-4 text-muted-foreground"
                  />
                  <SelectValue placeholder="Job profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All profiles</SelectItem>
                    {jobProfiles.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.jobName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={scheduleFilter} onValueChange={setScheduleFilter}>
                <SelectTrigger className="w-full">
                  <CalendarDaysIcon
                    data-icon="inline-start"
                    className="size-4 text-muted-foreground"
                  />
                  <SelectValue placeholder="Schedule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All schedule types</SelectItem>
                    <SelectItem value="single">Single shift</SelectItem>
                    <SelectItem value="recurring">Recurring weekly</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={upcomingFilter} onValueChange={setUpcomingFilter}>
                <SelectTrigger className="w-full">
                  <Clock3Icon
                    data-icon="inline-start"
                    className="size-4 text-muted-foreground"
                  />
                  <SelectValue placeholder="Timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All shifts</SelectItem>
                    <SelectItem value="upcoming">Upcoming only</SelectItem>
                    <SelectItem value="past">No upcoming occurrences</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <SelectTrigger className="w-full">
                  <ArrowUpDownIcon
                    data-icon="inline-start"
                    className="size-4 text-muted-foreground"
                  />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="created-desc">Newest first</SelectItem>
                    <SelectItem value="created-asc">Oldest first</SelectItem>
                    <SelectItem value="name-asc">Role (A–Z)</SelectItem>
                    <SelectItem value="name-desc">Role (Z–A)</SelectItem>
                    <SelectItem value="rate-asc">Rate (low to high)</SelectItem>
                    <SelectItem value="rate-desc">Rate (high to low)</SelectItem>
                    <SelectItem value="status-asc">Status</SelectItem>
                    <SelectItem value="location-asc">Location</SelectItem>
                    <SelectItem value="schedule-asc">Start date</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} size="sm">
                <CardHeader className="gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : shifts.length ? (
          view === "calendar" ? (
            <ShiftScheduleCalendar
              shifts={shifts}
              onView={handleViewShift}
              description="Scheduled occurrences from your current shift filters."
              emptyMessage="Occurrences from your filters will appear here."
            />
          ) : view === "list" ? (
            <ShiftList
              shifts={shifts}
              busyShiftId={busyShiftId}
              onView={handleViewShift}
              onEdit={handleEditShift}
              onArchive={setArchiveShift}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shifts.map((shift) => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  busyShiftId={busyShiftId}
                  onView={handleViewShift}
                  onEdit={handleEditShift}
                  onArchive={setArchiveShift}
                />
              ))}
            </div>
          )
        ) : allShifts.length ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-foreground/8">
                <SearchIcon className="size-5 text-muted-foreground" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-lg font-semibold">
                  No shifts match your filters
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-foreground/8">
                <CalendarClockIcon className="size-5 text-muted-foreground" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-lg font-semibold">
                  No shifts scheduled
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Add a shift once your role and location are ready.
                </p>
              </div>
              <Button asChild disabled={!canCreate}>
                <Link to="/shifts/new">
                  <PlusIcon data-icon="inline-start" />
                  Create shift
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
