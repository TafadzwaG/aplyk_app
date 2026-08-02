import * as React from "react"
import {
  CalendarClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronRightIcon as AgendaChevronIcon,
  Clock3Icon,
  MapPinIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { statusLabel } from "@/lib/shift-utils"
import type { CompanyShift } from "@/types/api"

export type CalendarShiftEntry = {
  shift: CompanyShift
  occurrence: CompanyShift["occurrences"][number]
}

const timeFormatter = new Intl.DateTimeFormat("en-ZA", {
  hour: "2-digit",
  minute: "2-digit",
})

const dayHeadingFormatter = new Intl.DateTimeFormat("en-ZA", {
  weekday: "long",
  day: "numeric",
  month: "long",
})

const shortDateFormatter = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
})

function monthStart(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1)
}

function calendarDate(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function isDateInMonth(localDate: string, month: Date) {
  const [year, monthIndex] = localDate.split("-").map(Number)
  return year === month.getFullYear() && monthIndex === month.getMonth() + 1
}

function buildCalendarEntries(shifts: CompanyShift[]) {
  const entries = new Map<string, CalendarShiftEntry[]>()

  shifts.forEach((shift) =>
    shift.occurrences.forEach((occurrence) => {
      const values = entries.get(occurrence.localDate) ?? []
      values.push({ shift, occurrence })
      entries.set(occurrence.localDate, values)
    })
  )

  for (const [key, dayEntries] of entries) {
    dayEntries.sort(
      (left, right) =>
        new Date(left.occurrence.startsAtUtc).getTime() -
        new Date(right.occurrence.startsAtUtc).getTime()
    )
    entries.set(key, dayEntries)
  }

  return entries
}

function collectMonthEntries(
  entries: Map<string, CalendarShiftEntry[]>,
  month: Date
) {
  return Array.from(entries.entries())
    .filter(([localDate]) => isDateInMonth(localDate, month))
    .flatMap(([, dayEntries]) => dayEntries)
    .sort(
      (left, right) =>
        new Date(left.occurrence.startsAtUtc).getTime() -
        new Date(right.occurrence.startsAtUtc).getTime()
    )
}

export function shiftEventStyles(status: number) {
  switch (status) {
    case 2:
      return "border-l-primary bg-primary/10 text-primary hover:bg-primary/15 ring-primary/15"
    case 3:
      return "border-l-emerald-500 bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/15 ring-emerald-500/15 dark:text-emerald-300"
    case 4:
      return "border-l-sky-500 bg-sky-500/10 text-sky-800 hover:bg-sky-500/15 ring-sky-500/15 dark:text-sky-300"
    case 5:
      return "border-l-destructive bg-destructive/10 text-destructive hover:bg-destructive/15 ring-destructive/15"
    case 1:
    default:
      return "border-l-muted-foreground/35 bg-muted/55 text-foreground hover:bg-muted/75 ring-foreground/8"
  }
}

function CalendarEventChip({
  entry,
  label,
  onView,
}: {
  entry: CalendarShiftEntry
  label: string
  onView: (shift: CompanyShift) => void
}) {
  const { shift, occurrence } = entry
  const startTime = timeFormatter.format(new Date(occurrence.startsAtUtc))

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onView(shift)
      }}
      className={cn(
        "group/event flex w-full items-center gap-2 rounded-md border-l-[3px] px-2 py-1.5 text-left text-xs ring-1 transition-colors",
        shiftEventStyles(shift.status)
      )}
    >
      <span className="shrink-0 font-semibold tabular-nums">{startTime}</span>
      <span className="min-w-0 truncate font-medium">{label}</span>
    </button>
  )
}

function ShiftAgendaPanel({
  entries,
  selectedDate,
  onClearSelection,
  onView,
  getTitle,
  showLocation,
  emptyMessage,
}: {
  entries: CalendarShiftEntry[]
  selectedDate: string | null
  onClearSelection: () => void
  onView: (shift: CompanyShift) => void
  getTitle: (shift: CompanyShift) => string
  showLocation: boolean
  emptyMessage: string
}) {
  const grouped = React.useMemo(() => {
    const groups = new Map<string, CalendarShiftEntry[]>()
    for (const entry of entries) {
      const key = entry.occurrence.localDate
      const values = groups.get(key) ?? []
      values.push(entry)
      groups.set(key, values)
    }
    return Array.from(groups.entries()).sort(([left], [right]) =>
      left.localeCompare(right)
    )
  }, [entries])

  return (
    <Card className="flex h-full flex-col lg:col-span-4">
      <CardHeader className="gap-3 border-b border-border/70 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">
              {selectedDate ? "Day schedule" : "Month agenda"}
            </CardTitle>
            <CardDescription>
              {selectedDate
                ? dayHeadingFormatter.format(
                    new Date(`${selectedDate}T12:00:00`)
                  )
                : `${entries.length} scheduled occurrence${entries.length === 1 ? "" : "s"}`}
            </CardDescription>
          </div>
          {selectedDate && (
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              Show all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="max-h-[42rem] flex-1 overflow-y-auto p-0">
        {!entries.length ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground ring-1 ring-foreground/8">
              <CalendarClockIcon className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">No shifts scheduled</p>
              <p className="text-xs text-muted-foreground">{emptyMessage}</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {grouped.map(([localDate, dayEntries]) => (
              <div key={localDate} className="px-4 py-3">
                {!selectedDate && (
                  <p className="mb-2 text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                    {shortDateFormatter.format(
                      new Date(`${localDate}T12:00:00`)
                    )}
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {dayEntries.map(({ shift, occurrence }) => {
                    const startTime = timeFormatter.format(
                      new Date(occurrence.startsAtUtc)
                    )
                    const endTime = shift.schedule?.endTime.slice(0, 5)

                    return (
                      <button
                        key={occurrence.id}
                        type="button"
                        onClick={() => onView(shift)}
                        className={cn(
                          "group/agenda flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left ring-1 transition-colors hover:bg-muted/45",
                          shiftEventStyles(shift.status)
                        )}
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/70 text-primary ring-1 ring-foreground/8">
                          <Clock3Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold">
                              {getTitle(shift)}
                            </span>
                            <Badge
                              variant={
                                shift.status === 2 ? "secondary" : "outline"
                              }
                              className="shrink-0 text-[0.625rem]"
                            >
                              {statusLabel(shift.status)}
                            </Badge>
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {startTime}
                            {endTime ? ` – ${endTime}` : ""}
                          </span>
                          {showLocation && shift.locationName && (
                            <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPinIcon className="size-3 shrink-0" />
                              <span className="truncate">{shift.locationName}</span>
                            </span>
                          )}
                        </span>
                        <AgendaChevronIcon className="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/agenda:opacity-100" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export type ShiftScheduleCalendarProps = {
  shifts: CompanyShift[]
  onView: (shift: CompanyShift) => void
  description?: string
  emptyMessage?: string
  getEventLabel?: (shift: CompanyShift) => string
  getAgendaTitle?: (shift: CompanyShift) => string
  showLocationInAgenda?: boolean
}

export function ShiftScheduleCalendar({
  shifts,
  onView,
  description = "Scheduled occurrences for this view.",
  emptyMessage = "Occurrences will appear here once shifts are scheduled.",
  getEventLabel = (shift) => shift.jobName || "Draft shift",
  getAgendaTitle = (shift) => shift.jobName || "Draft shift",
  showLocationInAgenda = true,
}: ShiftScheduleCalendarProps) {
  const [month, setMonth] = React.useState(() => monthStart(new Date()))
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const activeMonth = monthStart(month)

  React.useEffect(() => {
    setSelectedDate(null)
  }, [activeMonth])

  const entries = React.useMemo(() => buildCalendarEntries(shifts), [shifts])
  const monthEntries = React.useMemo(
    () => collectMonthEntries(entries, activeMonth),
    [entries, activeMonth]
  )
  const sidebarEntries = React.useMemo(
    () => (selectedDate ? (entries.get(selectedDate) ?? []) : monthEntries),
    [selectedDate, entries, monthEntries]
  )

  const firstVisible = new Date(activeMonth)
  firstVisible.setDate(1 - firstVisible.getDay())
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisible)
    date.setDate(firstVisible.getDate() + index)
    return date
  })

  const heading = new Intl.DateTimeFormat("en-ZA", {
    month: "long",
    year: "numeric",
  }).format(activeMonth)
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const todayKey = calendarDate(new Date())

  return (
    <section className="grid gap-4 lg:grid-cols-12 lg:items-start">
      <Card className="overflow-hidden lg:col-span-8">
        <CardHeader className="flex flex-col gap-3 border-b border-border/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{heading}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() =>
                setMonth(
                  new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1)
                )
              }
            >
              <ChevronLeftIcon />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMonth(monthStart(new Date()))}
            >
              Today
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() =>
                setMonth(
                  new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1)
                )
              }
            >
              <ChevronRightIcon />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0 pb-0">
          <div className="min-w-[42rem]">
            <div className="grid grid-cols-7 border-b border-border/70 bg-muted/35">
              {weekdayNames.map((day) => (
                <p
                  key={day}
                  className="px-2 py-2.5 text-center text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase"
                >
                  {day}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day) => {
                const key = calendarDate(day)
                const dayEntries = entries.get(key) ?? []
                const isCurrentMonth = day.getMonth() === activeMonth.getMonth()
                const isToday = key === todayKey
                const isSelected = selectedDate === key
                const hasShifts = dayEntries.length > 0

                return (
                  <div
                    key={key}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setSelectedDate((current) =>
                        current === key ? null : key
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedDate((current) =>
                          current === key ? null : key
                        )
                      }
                    }}
                    className={cn(
                      "min-h-36 cursor-pointer border-b border-r border-border/60 p-2 text-left transition-colors last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                      !isCurrentMonth && "bg-muted/15 text-muted-foreground",
                      isCurrentMonth && "bg-card",
                      isToday && "bg-primary/5",
                      isSelected &&
                        "bg-primary/8 ring-2 ring-inset ring-primary/35",
                      hasShifts && "hover:bg-muted/30"
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                          isToday &&
                            "bg-primary text-primary-foreground shadow-sm",
                          isSelected && !isToday && "bg-primary/15 text-primary"
                        )}
                      >
                        {day.getDate()}
                      </span>
                      {dayEntries.length > 0 && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
                          {dayEntries.length}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      {dayEntries.slice(0, 3).map((entry) => (
                        <CalendarEventChip
                          key={entry.occurrence.id}
                          entry={entry}
                          label={getEventLabel(entry.shift)}
                          onView={onView}
                        />
                      ))}
                      {dayEntries.length > 3 && (
                        <p className="px-1 text-[0.6875rem] font-medium text-primary">
                          +{dayEntries.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <ShiftAgendaPanel
        entries={sidebarEntries}
        selectedDate={selectedDate}
        onClearSelection={() => setSelectedDate(null)}
        onView={onView}
        getTitle={getAgendaTitle}
        showLocation={showLocationInAgenda}
        emptyMessage={emptyMessage}
      />
    </section>
  )
}
