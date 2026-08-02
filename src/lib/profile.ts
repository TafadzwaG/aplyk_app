import type { MeProfile } from "@/types/api"

export function getProfileDisplayName(profile: MeProfile): string {
  const name = [profile.firstName, profile.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ")

  return name || profile.email?.split("@")[0] || "Aplyk member"
}

export function getProfileFirstName(profile: MeProfile): string {
  return profile.firstName?.trim() || getProfileDisplayName(profile)
}

export function getProfileInitials(profile: MeProfile): string {
  const initials = [profile.firstName, profile.lastName]
    .map((part) => part?.trim().charAt(0))
    .filter(Boolean)
    .join("")

  if (initials) return initials.toUpperCase()

  return (profile.email?.charAt(0) || "A").toUpperCase()
}

export function getProfileCompletion(profile: MeProfile): number {
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phoneNumber,
    profile.emailConfirmed,
  ]
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}
