import { apiRequest } from "@/lib/api"
import { getAccessToken } from "@/lib/auth"
import { config } from "@/lib/config"

export type AiShiftFields = {
  jobProfileId: number | null
  locationId: number | null
  startsOn: string | null
  startTime: string | null
  endTime: string | null
  peopleNeeded: number | null
  hourlyRate: number | null
}
export type AiSearchFields = {
  occupationIds: number[]
  fromDate: string | null
  toDate: string | null
  minHourlyRate: number | null
  sort: "soonest" | "highest_pay"
  eligibleOnly: boolean
}
export type AiSuggestion = {
  mode: string
  timeZoneId: string
  shift: AiShiftFields | null
  search: AiSearchFields | null
  warnings: string[]
}
export type AiStatus = { mode: string; shiftDraftEnabled: boolean; searchEnabled: boolean }

export const aiApi = {
  transcribe: async (feature: "shift" | "search", audio: Blob, signal: AbortSignal): Promise<string> => {
    const token = await getAccessToken()
    const response = await fetch(`${config.apiUrl}/api/ai/${feature}-voice`, {
      method: "POST", body: audio, signal,
      headers: { "Content-Type": "audio/wav", Authorization: `Bearer ${token}` },
    })
    const body = await response.json()
    if (!response.ok) throw new Error(body.detail ?? "Could not transcribe your recording. Try again or type your request.")
    return body.data.text
  },
  status: (signal: AbortSignal) => apiRequest<AiStatus>("/api/ai/status", { signal }),
  suggest: (feature: "shift" | "search", prompt: string, signal: AbortSignal) =>
    apiRequest<AiSuggestion>(`/api/ai/${feature}-suggestion`, {
      method: "POST", body: { prompt }, signal,
    }),
}
