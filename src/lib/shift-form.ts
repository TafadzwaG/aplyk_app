import type { CompanyShift } from "@/types/api"

export type ShiftForm = {
  jobProfileId: string
  locationId: string
  assignmentType: "1" | "2"
  startsOn: string
  endsOn: string
  startTime: string
  endTime: string
  isoDaysOfWeek: number[]
  hourlyRate: string
  peopleNeeded: string
  instructions: string
  keepWaitingList: boolean
  publishNow: boolean
}

export function todayValue() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

export function isoDay(value: string) {
  const day = new Date(`${value}T12:00:00`).getDay()
  return day === 0 ? 7 : day
}

export const defaultShiftForm = (): ShiftForm => {
  const today = todayValue()
  return {
    jobProfileId: "",
    locationId: "",
    assignmentType: "1",
    startsOn: today,
    endsOn: today,
    startTime: "08:00",
    endTime: "17:00",
    isoDaysOfWeek: [isoDay(today)],
    hourlyRate: "",
    peopleNeeded: "1",
    instructions: "",
    keepWaitingList: true,
    publishNow: true,
  }
}

export function toggleDay(values: number[], value: number, checked: boolean) {
  return checked
    ? Array.from(new Set([...values, value])).sort()
    : values.filter((item) => item !== value)
}

export function shiftToForm(shift: CompanyShift): ShiftForm {
  const schedule = shift.schedule
  const startsOn = schedule?.startsOn ?? todayValue()
  const assignmentType = schedule?.pattern === 1 ? "1" : "2"

  return {
    jobProfileId: String(shift.jobProfileId),
    locationId: String(shift.locationId),
    assignmentType,
    startsOn,
    endsOn: schedule?.endsOn ?? startsOn,
    startTime: schedule?.startTime.slice(0, 5) ?? "08:00",
    endTime: schedule?.endTime.slice(0, 5) ?? "17:00",
    isoDaysOfWeek:
      schedule?.isoDaysOfWeek.length && assignmentType === "2"
        ? schedule.isoDaysOfWeek
        : [isoDay(startsOn)],
    hourlyRate: shift.hourlyRate > 0 ? String(shift.hourlyRate) : "",
    peopleNeeded: String(shift.peopleNeeded || 1),
    instructions: shift.shiftInstructions ?? "",
    keepWaitingList: shift.keepWaitingList,
    publishNow: false,
  }
}
