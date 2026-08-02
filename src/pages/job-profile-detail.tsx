import * as React from "react"
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CalendarClockIcon,
  InfoIcon,
  MapPinIcon,
  PencilIcon,
  WalletIcon,
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
  jobProfilesApi,
  referenceApi,
  shiftsApi,
} from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import type {
  ApplicationReviewOption,
  Category,
  CompanyRoleProfile,
  CompanyShift,
  Language,
  Skill,
} from "@/types/api"

type DetailTab = "overview" | "upcoming" | "history"

const tabs: Array<{ id: DetailTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "upcoming", label: "Upcoming shifts" },
  { id: "history", label: "Shift history" },
]

function profileReferenceCode(id: number) {
  return `JP-${id}`
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium">{value}</span>
    </div>
  )
}

function profileShiftLabel(shift: CompanyShift) {
  return shift.locationName || "Workplace pending"
}

export function JobProfileDetailPage({ profileId }: { profileId: number }) {
  const navigate = useNavigate()
  const [profile, setProfile] = React.useState<CompanyRoleProfile | null>(null)
  const [categories, setCategories] = React.useState<Category[]>([])
  const [skills, setSkills] = React.useState<Skill[]>([])
  const [languages, setLanguages] = React.useState<Language[]>([])
  const [reviewOptions, setReviewOptions] = React.useState<
    ApplicationReviewOption[]
  >([])
  const [shifts, setShifts] = React.useState<CompanyShift[]>([])
  const [activeTab, setActiveTab] = React.useState<DetailTab>("overview")
  const [isLoading, setIsLoading] = React.useState(true)

  const loadProfile = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const [
        nextProfile,
        nextCategories,
        nextSkills,
        nextLanguages,
        options,
        nextShifts,
      ] = await Promise.all([
        jobProfilesApi.get(profileId),
        referenceApi.getCategories(),
        referenceApi.getSkills(),
        referenceApi.getLanguages(),
        jobProfilesApi.getApplicationReviewOptions(),
        shiftsApi.list().catch(() => [] as CompanyShift[]),
      ])

      setProfile(nextProfile)
      setCategories(nextCategories)
      setSkills(nextSkills)
      setLanguages(nextLanguages)
      setReviewOptions(options)
      setShifts(nextShifts.filter((shift) => shift.jobProfileId === profileId))
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load this job profile."))
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [profileId])

  React.useEffect(() => {
    void loadProfile()
  }, [loadProfile])

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

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <BriefcaseBusinessIcon className="size-10 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-xl font-semibold">
            Job profile not found
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            This profile may have been removed or you may not have access to it.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/job-profiles">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to job profiles
          </Link>
        </Button>
      </div>
    )
  }

  const categoryName =
    categories.find((category) => category.id === profile.categoryId)
      ?.categoryName ?? "Uncategorised"
  const reviewLabel =
    reviewOptions.find((option) => option.id === profile.applicationReview)
      ?.name ?? "Review pending"
  const skillNames = profile.skillIds
    .map((id) => skills.find((skill) => skill.id === id)?.skillName)
    .filter(Boolean) as string[]
  const languageNames = profile.languageIds
    .map((id) => languages.find((language) => language.id === id)?.name)
    .filter(Boolean) as string[]
  const experienceMonths = profile.skillRequirements?.reduce(
    (max, item) => Math.max(max, item.minimumExperienceMonths ?? 0),
    0
  )
  const credentialCount = profile.credentialRequirements?.length ?? 0
  const primaryLocation =
    shifts.find((shift) => shift.locationName)?.locationName ?? null
  const primaryAddress =
    shifts.find((shift) => shift.locationAddress)?.locationAddress ?? null

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

  const hourlyRateLabel =
    profile.hourlyRate > 0
      ? `${new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        }).format(profile.hourlyRate)}/hr`
      : "—"

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/job-profiles"
        className="inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back to job profiles
      </Link>

      <div className="flex flex-col gap-5 border-b border-border/70 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/35 text-foreground ring-1 ring-foreground/8">
            <BriefcaseBusinessIcon className="size-7" />
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                {profile.jobName}
              </h2>
              <Badge variant="secondary">Active</Badge>
              <Badge variant="outline" className="font-mono text-[0.6875rem]">
                {profileReferenceCode(profile.id)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {categoryName}
              {primaryLocation ? ` · ${primaryLocation}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast.message("Profile deactivation will be available soon.")
            }
          >
            Deactivate
          </Button>
          <Button
            onClick={() =>
              toast.message("Profile editing will be available soon.")
            }
          >
            <PencilIcon data-icon="inline-start" />
            Edit profile
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
              ? "Upcoming shifts scheduled with this job profile."
              : "Completed shifts that used this job profile."
          }
          emptyMessage={
            activeTab === "upcoming"
              ? "No upcoming shifts use this profile yet."
              : "No completed shifts for this profile yet."
          }
          getEventLabel={profileShiftLabel}
          getAgendaTitle={profileShiftLabel}
          showLocationInAgenda={false}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <Card>
              <CardHeader className="gap-2 border-b border-border/70 pb-4">
                <div className="flex items-center gap-2">
                  <InfoIcon className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">Job details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <DetailRow label="Category" value={categoryName} />
                <DetailRow
                  label="Description"
                  value={profile.description || "No description added yet."}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="gap-2 border-b border-border/70 pb-4">
                <div className="flex items-center gap-2">
                  <WalletIcon className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">Pay and workplace</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-muted/45 px-4 py-3 ring-1 ring-foreground/8">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Hourly rate
                    </p>
                    <p className="mt-1 font-heading text-2xl font-semibold">
                      {hourlyRateLabel}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/45 px-4 py-3 ring-1 ring-foreground/8">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Review method
                    </p>
                    <p className="mt-1 text-sm font-semibold">{reviewLabel}</p>
                  </div>
                </div>
                <DetailRow
                  label="Clothing and equipment"
                  value={profile.clothingAndEquipment || "Not specified"}
                />
                <DetailRow
                  label="Work instructions"
                  value={profile.workInstructions || "Not specified"}
                />
                <DetailRow
                  label="Workplace conditions"
                  value={profile.workConditions || "Not specified"}
                />
              </CardContent>
            </Card>
          </div>

          <aside className="flex flex-col gap-5">
          <Card>
            <CardHeader className="gap-2 border-b border-border/70 pb-4">
              <div className="flex items-center gap-2">
                <BadgeCheckIcon className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 pt-4">
              <div className="flex flex-col gap-2">
                <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {languageNames.length ? (
                    languageNames.map((name) => (
                      <Badge key={name} variant="outline">
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillNames.length ? (
                    skillNames.map((name) => (
                      <Badge key={name} variant="outline">
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </div>
              </div>

              <DetailRow
                label="Experience"
                value={
                  experienceMonths
                    ? `${Math.ceil(experienceMonths / 12)} year${
                        Math.ceil(experienceMonths / 12) === 1 ? "" : "s"
                      } preferred`
                    : "Not specified"
                }
              />
              <DetailRow
                label="Documents"
                value={
                  credentialCount
                    ? `${credentialCount} credential${
                        credentialCount === 1 ? "" : "s"
                      } required`
                    : "None required"
                }
              />

              {(profile.securityClearance ||
                profile.approvalRequired ||
                profile.interviewRequired) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.securityClearance && (
                    <Badge variant="outline">Security clearance</Badge>
                  )}
                  {profile.approvalRequired && (
                    <Badge variant="outline">Approval required</Badge>
                  )}
                  {profile.interviewRequired && (
                    <Badge variant="outline">Interview required</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex h-36 items-center justify-center bg-muted/50 ring-1 ring-inset ring-foreground/8">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <MapPinIcon className="size-6" />
                <p className="text-xs">Workplace preview</p>
              </div>
            </div>
            <CardContent className="flex flex-col gap-1 pt-4">
              <p className="text-sm font-semibold">
                {primaryLocation || "Set when scheduling shifts"}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {primaryAddress ||
                  "Locations are chosen per shift using this profile."}
              </p>
              {upcomingShifts.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => navigate("/shifts")}
                >
                  <CalendarClockIcon data-icon="inline-start" />
                  View related shifts
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
        </div>
      )}
    </div>
  )
}
