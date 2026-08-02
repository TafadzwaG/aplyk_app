import type { CompanyShift } from "@/types/api"

export const weekDays = [
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
  { id: 7, label: "Sun" },
]

export function statusLabel(status: number) {
  return (
    {
      1: "Draft",
      2: "Published",
      3: "Filled",
      4: "Completed",
      5: "Cancelled",
      6: "Archived",
    }[status] ?? "Unknown"
  )
}

export function shiftReferenceCode(id: number) {
  return `SH-${id}`
}

export function scheduleSummary(shift: CompanyShift) {
  if (!shift.schedule) return "Schedule incomplete"
  const schedule = shift.schedule
  const time = `${schedule.startTime.slice(0, 5)}–${schedule.endTime.slice(0, 5)}`
  if (schedule.pattern === 1) {
    return `${new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${schedule.startsOn}T12:00:00`))}, ${time}`
  }
  const days = schedule.isoDaysOfWeek
    .map((day) => weekDays.find((item) => item.id === day)?.label)
    .filter(Boolean)
    .join(", ")
  return `${days || "Recurring"}, ${time}`
}

export function shiftDateDisplay(shift: CompanyShift) {
  const upcoming = shift.occurrences.find(
    (occurrence) => new Date(occurrence.endsAtUtc).getTime() > Date.now()
  )
  const localDate = upcoming?.localDate ?? shift.schedule?.startsOn
  if (!localDate) return "Not scheduled"

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${localDate}T12:00:00`))
}

export function shiftTimeDisplay(shift: CompanyShift) {
  if (!shift.schedule) return "—"
  return `${shift.schedule.startTime.slice(0, 5)} – ${shift.schedule.endTime.slice(0, 5)}`
}

export function scheduleTypeLabel(shift: CompanyShift) {
  if (!shift.schedule) return "—"
  return shift.schedule.pattern === 1 ? "Single shift" : "Recurring weekly"
}

export function formatRate(shift: CompanyShift) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: shift.currencyCode || "USD",
      maximumFractionDigits: 2,
    }).format(shift.hourlyRate)
  } catch {
    return `${shift.currencyCode} ${shift.hourlyRate.toFixed(2)}`
  }
}

export function estimateTotalPay(shift: CompanyShift) {
  if (!shift.schedule || shift.hourlyRate <= 0) return null

  const [startHour, startMinute] = shift.schedule.startTime
    .slice(0, 5)
    .split(":")
    .map(Number)
  const [endHour, endMinute] = shift.schedule.endTime
    .slice(0, 5)
    .split(":")
    .map(Number)

  let startMinutes = startHour * 60 + startMinute
  let endMinutes = endHour * 60 + endMinute
  if (endMinutes <= startMinutes) endMinutes += 24 * 60

  const hours = (endMinutes - startMinutes) / 60
  const total = shift.hourlyRate * hours * Math.max(shift.peopleNeeded, 1)

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: shift.currencyCode || "USD",
      maximumFractionDigits: 2,
    }).format(total)
  } catch {
    return `${shift.currencyCode} ${total.toFixed(2)}`
  }
}

export function formatOccurrenceDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`))
}

export function canEditShift(shift: CompanyShift) {
  return shift.status === 1
}

export function canArchiveShift(shift: CompanyShift) {
  return shift.status !== 5 && shift.status !== 6
}

export function bookedCount(shift: CompanyShift) {
  return shift.occurrences.reduce(
    (total, occurrence) => total + occurrence.booked,
    0
  )
}
