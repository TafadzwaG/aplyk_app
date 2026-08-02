import * as React from "react"
import type { FormEvent, ReactNode } from "react"
import {
  ArrowLeftIcon,
  BanknoteIcon,
  BriefcaseBusinessIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  Clock3Icon,
  EyeIcon,
  ListChecksIcon,
  MapPinIcon,
  RepeatIcon,
  SendIcon,
  UsersRoundIcon,
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
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
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import {
  getApiErrorMessage,
  jobProfilesApi,
  locationsApi,
  shiftsApi,
} from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import {
  defaultShiftForm,
  isoDay,
  shiftToForm,
  todayValue,
  toggleDay,
  type ShiftForm,
} from "@/lib/shift-form"
import { canEditShift, weekDays } from "@/lib/shift-utils"
import { cn } from "@/lib/utils"
import type { CompanyLocation, CompanyRoleProfile } from "@/types/api"

const steps = [
  {
    id: "role",
    label: "Role & location",
    description: "Choose the job profile and workplace.",
    icon: BriefcaseBusinessIcon,
  },
  {
    id: "schedule",
    label: "Schedule",
    description: "Set dates, times, and recurrence.",
    icon: CalendarDaysIcon,
  },
  {
    id: "staffing",
    label: "Staffing & pay",
    description: "Define rate, headcount, and briefing.",
    icon: UsersRoundIcon,
  },
  {
    id: "publish",
    label: "Publish",
    description: "Review hiring options and go live.",
    icon: SendIcon,
  },
] as const

function SummarySection({
  title,
  icon: Icon,
  children,
  empty,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: ReactNode
  empty?: boolean
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", empty && "opacity-60")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/60 ring-1 ring-foreground/8">
          <Icon className="size-3.5 text-muted-foreground" />
        </span>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </p>
      </div>
      <div className="pl-8">{children}</div>
    </div>
  )
}

function SummaryField({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: ReactNode
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex gap-2.5">
      {Icon ? (
        <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      ) : null}
      <div className="min-w-0 flex flex-col gap-0.5">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}

function ShiftSummaryPanel({
  form,
  profileLabel,
  locationLabel,
  currentStep,
}: {
  form: ShiftForm
  profileLabel: string
  locationLabel: string
  currentStep: number
}) {
  const scheduleLabel =
    form.assignmentType === "1"
      ? `${form.startsOn}, ${form.startTime}–${form.endTime}`
      : `${form.startsOn} → ${form.endsOn}, ${form.isoDaysOfWeek
          .map((day) => weekDays.find((item) => item.id === day)?.label)
          .filter(Boolean)
          .join(", ")}, ${form.startTime}–${form.endTime}`

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-0 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/70 bg-secondary/20 pb-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-foreground/8">
              <EyeIcon className="size-4 text-primary" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-base">Shift preview</CardTitle>
              <CardDescription>
                Live summary of what you have captured so far.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-5">
          <div className="rounded-xl bg-muted/45 p-4 ring-1 ring-foreground/8">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-foreground/8">
                <CalendarClockIcon className="size-5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Shift
                </p>
                <p className="mt-1 font-heading text-lg font-semibold tracking-tight">
                  {profileLabel !== "—" ? profileLabel : "Untitled shift"}
                </p>
                {locationLabel !== "—" && (
                  <Badge variant="secondary" className="mt-2 gap-1">
                    <MapPinIcon className="size-3" />
                    {locationLabel}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <SummarySection
            title="Role & location"
            icon={BriefcaseBusinessIcon}
            empty={profileLabel === "—" && locationLabel === "—"}
          >
            <dl className="grid gap-3">
              <SummaryField
                label="Job profile"
                icon={BriefcaseBusinessIcon}
                value={profileLabel}
              />
              <SummaryField
                label="Location"
                icon={MapPinIcon}
                value={locationLabel}
              />
            </dl>
          </SummarySection>

          <SummarySection title="Schedule" icon={CalendarDaysIcon}>
            <dl className="grid gap-3">
              <SummaryField
                label="Type"
                icon={RepeatIcon}
                value={
                  form.assignmentType === "1" ? "Single shift" : "Recurring weekly"
                }
              />
              <SummaryField
                label="When"
                icon={Clock3Icon}
                value={scheduleLabel}
              />
            </dl>
          </SummarySection>

          <SummarySection
            title="Staffing & pay"
            icon={BanknoteIcon}
            empty={!form.hourlyRate && !form.instructions.trim()}
          >
            <dl className="grid gap-3">
              <SummaryField
                label="Hourly rate"
                icon={BanknoteIcon}
                value={
                  form.hourlyRate ? (
                    `${form.hourlyRate} / hr`
                  ) : (
                    <span className="font-normal text-muted-foreground">—</span>
                  )
                }
              />
              <SummaryField
                label="People needed"
                icon={UsersRoundIcon}
                value={form.peopleNeeded || "—"}
              />
              <SummaryField
                label="Briefing"
                icon={CalendarClockIcon}
                value={
                  form.instructions.trim() || (
                    <span className="font-normal text-muted-foreground">
                      None
                    </span>
                  )
                }
              />
            </dl>
          </SummarySection>

          <SummarySection title="Publishing" icon={SendIcon}>
            <div className="flex flex-wrap gap-1.5">
              {form.keepWaitingList && (
                <Badge variant="outline">Waiting list enabled</Badge>
              )}
              <Badge variant={form.publishNow ? "default" : "secondary"}>
                {form.publishNow ? "Publish immediately" : "Save as draft"}
              </Badge>
            </div>
          </SummarySection>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardContent className="flex flex-col gap-2 pt-4">
          <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <ListChecksIcon className="size-3.5" />
            Progress
          </p>
          <div className="flex flex-col gap-2 pl-5">
            {steps.map((step, index) => {
              const isComplete = index < currentStep
              const isActive = index === currentStep
              const StepIcon = step.icon
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    isActive && "font-medium text-foreground",
                    isComplete && "text-muted-foreground",
                    !isActive && !isComplete && "text-muted-foreground/70"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2Icon className="size-4 shrink-0 text-primary" />
                  ) : (
                    <StepIcon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground/60"
                      )}
                    />
                  )}
                  <span>{step.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

function StepNav({
  currentStep,
  onStepClick,
}: {
  currentStep: number
  onStepClick: (index: number) => void
}) {
  return (
    <nav className="hidden flex-col gap-2 lg:flex">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentStep
        const isComplete = index < currentStep

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => index < currentStep && onStepClick(index)}
            disabled={index > currentStep}
            className={cn(
              "flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
              isActive && "bg-secondary/35 ring-1 ring-foreground/8",
              isComplete && "hover:bg-muted/45",
              index > currentStep && "opacity-50"
            )}
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-foreground/8",
                isActive && "bg-background",
                isComplete && "bg-primary/10 text-primary"
              )}
            >
              {isComplete ? (
                <CheckCircle2Icon className="size-4" />
              ) : (
                <Icon className="size-4" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">{step.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {step.description}
              </span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export function CreateShiftPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const companyId = profile?.activeCompanyId ?? null
  const [currentStep, setCurrentStep] = React.useState(0)
  const [form, setForm] = React.useState<ShiftForm>(defaultShiftForm)
  const [jobProfiles, setJobProfiles] = React.useState<CompanyRoleProfile[]>([])
  const [locations, setLocations] = React.useState<CompanyLocation[]>([])
  const [draftId, setDraftId] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const isEditing = draftId !== null

  React.useEffect(() => {
    async function loadLookups() {
      if (!companyId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const [nextProfiles, nextLocations] = await Promise.all([
          jobProfilesApi.list(companyId),
          locationsApi.list(companyId),
        ])
        setJobProfiles(nextProfiles)
        setLocations(nextLocations.filter((location) => location.isActive))
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Could not load shift options."))
      } finally {
        setIsLoading(false)
      }
    }

    void loadLookups()
  }, [companyId])

  React.useEffect(() => {
    if (isLoading) return

    const params = new URLSearchParams(window.location.search)
    const profileId = Number(params.get("profileId"))
    if (profileId) {
      const selectedProfile = jobProfiles.find((item) => item.id === profileId)
      if (selectedProfile) {
        setForm({
          ...defaultShiftForm(),
          jobProfileId: String(selectedProfile.id),
          hourlyRate: String(selectedProfile.hourlyRate),
        })
      }
    }

    const editId = Number(params.get("edit"))
    if (editId) {
      void shiftsApi.get(editId).then((shift) => {
        if (!canEditShift(shift)) {
          toast.message("Only draft shifts can be edited.")
          return
        }
        setDraftId(shift.id)
        setForm(shiftToForm(shift))
      })
    }

    if (profileId || editId) {
      params.delete("profileId")
      params.delete("edit")
      const nextSearch = params.toString()
      const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`
      window.history.replaceState({}, "", nextUrl)
    }
  }, [isLoading, jobProfiles])

  function validateStep(step: number) {
    if (step === 0) {
      if (!form.jobProfileId) {
        toast.error("Choose a job profile.")
        return false
      }
      if (!form.locationId) {
        toast.error("Choose a location.")
        return false
      }
      const location = locations.find(
        (item) => item.id === Number(form.locationId)
      )
      if (location && (!location.timeZoneId || !location.currencyCode)) {
        toast.error("This location needs a time zone and currency before scheduling.")
        return false
      }
    }

    if (step === 1) {
      if (form.assignmentType === "2" && !form.isoDaysOfWeek.length) {
        toast.error("Choose at least one weekday for a recurring shift.")
        return false
      }
      if (form.assignmentType === "2" && !form.endsOn) {
        toast.error("Choose an end date for the recurring shift.")
        return false
      }
    }

    if (step === 2) {
      if (!form.hourlyRate || Number(form.hourlyRate) <= 0) {
        toast.error("Enter a valid hourly rate.")
        return false
      }
      if (!form.peopleNeeded || Number(form.peopleNeeded) < 1) {
        toast.error("Enter how many people are needed.")
        return false
      }
    }

    return true
  }

  function goNext() {
    if (!validateStep(currentStep)) return
    setCurrentStep((value) => Math.min(value + 1, steps.length - 1))
  }

  function goBack() {
    setCurrentStep((value) => Math.max(value - 1, 0))
  }

  function handleProfileChange(value: string) {
    const selected = jobProfiles.find((item) => item.id === Number(value))
    setForm((current) => ({
      ...current,
      jobProfileId: value,
      hourlyRate: selected ? String(selected.hourlyRate) : current.hourlyRate,
    }))
    if (!isEditing) setDraftId(null)
  }

  function handleAssignmentTypeChange(value: string) {
    const assignmentType = value as "1" | "2"
    setForm((current) => ({
      ...current,
      assignmentType,
      endsOn:
        assignmentType === "1"
          ? current.startsOn
          : current.endsOn < current.startsOn
            ? current.startsOn
            : current.endsOn,
      isoDaysOfWeek:
        assignmentType === "1"
          ? [isoDay(current.startsOn)]
          : current.isoDaysOfWeek,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!companyId) return
    if (!validateStep(currentStep)) return

    const selectedProfile = jobProfiles.find(
      (item) => item.id === Number(form.jobProfileId)
    )
    const selectedLocation = locations.find(
      (item) => item.id === Number(form.locationId)
    )

    if (!selectedProfile || !selectedLocation) {
      toast.error("Choose both a job profile and a location.")
      return
    }

    setIsSubmitting(true)
    let activeDraftId = draftId
    try {
      if (!activeDraftId) {
        const draft = await shiftsApi.createDraft(selectedProfile.id)
        activeDraftId = draft.id
        setDraftId(draft.id)
      }

      await shiftsApi.saveDetails(activeDraftId, {
        jobProfileId: selectedProfile.id,
        locationId: selectedLocation.id,
        assignmentType: Number(form.assignmentType),
        schedule: {
          pattern: form.assignmentType === "1" ? 1 : 3,
          interval: 1,
          startsOn: form.startsOn,
          endsOn: form.assignmentType === "1" ? form.startsOn : form.endsOn,
          noEndDate: false,
          startTime: form.startTime,
          endTime: form.endTime,
          isoDaysOfWeek: form.assignmentType === "1" ? [] : form.isoDaysOfWeek,
        },
        hourlyRate: Number(form.hourlyRate),
        peopleNeeded: Number(form.peopleNeeded),
        shiftInstructions: form.instructions.trim() || null,
      })

      await shiftsApi.saveHiringPreferences(activeDraftId, {
        acceptanceMethod: selectedProfile.applicationReview,
        keepWaitingList: form.keepWaitingList,
        skills: (selectedProfile.skillRequirements ?? []).map((item) => ({
          skillId: item.skillId,
          minimumExperienceMonths: item.minimumExperienceMonths,
        })),
        languages: (selectedProfile.languageRequirements ?? []).map((item) => ({
          languageId: item.languageId,
          minimumProficiency: item.minimumProficiency,
        })),
        credentials: (selectedProfile.credentialRequirements ?? []).map(
          (item) => ({
            credentialId: item.credentialId,
            verificationRequired: item.verificationRequired,
          })
        ),
      })

      if (form.publishNow) {
        await shiftsApi.saveBroadcast(activeDraftId)
        const result = await shiftsApi.publish(activeDraftId)
        toast.success("Shift published", {
          description: `${result.occurrencesCreated} occurrence${
            result.occurrencesCreated === 1 ? "" : "s"
          } created and matching has started.`,
        })
        navigate(`/shifts/${activeDraftId}`)
      } else {
        toast.success(isEditing ? "Shift updated" : "Shift saved as draft", {
          description: "Your changes are saved and ready to publish later.",
        })
        navigate("/shifts")
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save this shift."), {
        description: activeDraftId
          ? "Your draft is preserved. Correct the form and try again."
          : undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const profileLabel =
    jobProfiles.find((item) => item.id === Number(form.jobProfileId))?.jobName ??
    "—"
  const locationLabel =
    locations.find((item) => item.id === Number(form.locationId))
      ?.locationName ?? "—"

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
          <Skeleton className="hidden h-80 lg:block" />
          <Skeleton className="h-[480px] w-full rounded-xl" />
          <Skeleton className="hidden h-[520px] lg:block" />
        </div>
      </div>
    )
  }

  if (!jobProfiles.length || !locations.length) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Link
          to="/shifts"
          className="inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to shifts
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <CalendarClockIcon className="size-8 text-muted-foreground" />
            <p className="font-medium">
              {!jobProfiles.length
                ? "Create a job profile first"
                : "Add a location first"}
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Shifts need both a reusable role and a workplace with time zone and
              currency configured.
            </p>
            <Button asChild>
              <Link to={!jobProfiles.length ? "/job-profiles/new" : "/locations"}>
                {!jobProfiles.length ? "Create job profile" : "Add location"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Link
        to="/shifts"
        className="inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back to shifts
      </Link>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Scheduling
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {isEditing ? "Edit shift" : "Create a shift"}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Turn a saved role into a schedule in four steps. You can publish
          immediately or save as a draft to review later.
        </p>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{steps[currentStep].label}</span>
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full",
                index <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)_minmax(300px,360px)] lg:items-start">
        <StepNav
          currentStep={currentStep}
          onStepClick={(index) => setCurrentStep(index)}
        />

        <Card className="min-w-0">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle>{steps[currentStep].label}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              {currentStep === 0 && (
                <FieldGroup>
                  <FieldGroup className="grid sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Job profile</FieldLabel>
                      <Select
                        value={form.jobProfileId}
                        onValueChange={handleProfileChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {jobProfiles.map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                {item.jobName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Location</FieldLabel>
                      <Select
                        value={form.locationId}
                        onValueChange={(value) =>
                          setForm((current) => ({ ...current, locationId: value }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a workplace" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {locations.map((location) => (
                              <SelectItem
                                key={location.id}
                                value={String(location.id)}
                                disabled={
                                  !location.timeZoneId || !location.currencyCode
                                }
                              >
                                {location.locationName}
                                {(!location.timeZoneId ||
                                  !location.currencyCode) &&
                                  " · Setup incomplete"}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </FieldGroup>
              )}

              {currentStep === 1 && (
                <FieldGroup className="gap-5">
                  <Field>
                    <FieldLabel>Schedule type</FieldLabel>
                    <Select
                      value={form.assignmentType}
                      onValueChange={handleAssignmentTypeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">Single shift</SelectItem>
                          <SelectItem value="2">Recurring weekly</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <FieldGroup className="grid sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="shift-start-date">
                        {form.assignmentType === "1" ? "Shift date" : "Starts on"}
                      </FieldLabel>
                      <Input
                        id="shift-start-date"
                        type="date"
                        min={todayValue()}
                        value={form.startsOn}
                        onChange={(event) => {
                          const value = event.target.value
                          setForm((current) => ({
                            ...current,
                            startsOn: value,
                            endsOn:
                              current.assignmentType === "1" ||
                              current.endsOn < value
                                ? value
                                : current.endsOn,
                            isoDaysOfWeek:
                              current.assignmentType === "1"
                                ? [isoDay(value)]
                                : current.isoDaysOfWeek,
                          }))
                        }}
                        required
                      />
                    </Field>
                    {form.assignmentType === "2" && (
                      <Field>
                        <FieldLabel htmlFor="shift-end-date">Ends on</FieldLabel>
                        <Input
                          id="shift-end-date"
                          type="date"
                          min={form.startsOn}
                          value={form.endsOn}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              endsOn: event.target.value,
                            }))
                          }
                          required
                        />
                      </Field>
                    )}
                  </FieldGroup>

                  {form.assignmentType === "2" && (
                    <FieldSet>
                      <FieldLegend>Repeat on</FieldLegend>
                      <FieldGroup className="grid grid-cols-2 sm:grid-cols-4">
                        {weekDays.map((day) => (
                          <Field key={day.id} orientation="horizontal">
                            <Checkbox
                              id={`weekday-${day.id}`}
                              checked={form.isoDaysOfWeek.includes(day.id)}
                              onCheckedChange={(checked) =>
                                setForm((current) => ({
                                  ...current,
                                  isoDaysOfWeek: toggleDay(
                                    current.isoDaysOfWeek,
                                    day.id,
                                    checked === true
                                  ),
                                }))
                              }
                            />
                            <FieldLabel htmlFor={`weekday-${day.id}`}>
                              {day.label}
                            </FieldLabel>
                          </Field>
                        ))}
                      </FieldGroup>
                    </FieldSet>
                  )}

                  <FieldGroup className="grid sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="shift-start-time">Start time</FieldLabel>
                      <Input
                        id="shift-start-time"
                        type="time"
                        value={form.startTime}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            startTime: event.target.value,
                          }))
                        }
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="shift-end-time">End time</FieldLabel>
                      <Input
                        id="shift-end-time"
                        type="time"
                        value={form.endTime}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            endTime: event.target.value,
                          }))
                        }
                        required
                      />
                      <FieldDescription>
                        An end time before the start time is treated as overnight.
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </FieldGroup>
              )}

              {currentStep === 2 && (
                <FieldGroup className="gap-5">
                  <FieldGroup className="grid sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="shift-rate">Hourly rate</FieldLabel>
                      <Input
                        id="shift-rate"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.hourlyRate}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            hourlyRate: event.target.value,
                          }))
                        }
                        placeholder="250.00"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="people-needed">People needed</FieldLabel>
                      <Input
                        id="people-needed"
                        type="number"
                        min="1"
                        max="100000"
                        value={form.peopleNeeded}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            peopleNeeded: event.target.value,
                          }))
                        }
                        required
                      />
                    </Field>
                  </FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="shift-instructions">
                      Shift briefing
                    </FieldLabel>
                    <Textarea
                      id="shift-instructions"
                      value={form.instructions}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          instructions: event.target.value,
                        }))
                      }
                      placeholder="Arrival point, on-duty contact, handover details..."
                    />
                  </Field>
                </FieldGroup>
              )}

              {currentStep === 3 && (
                <FieldSet>
                  <FieldLegend>Hiring & publishing</FieldLegend>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <Checkbox
                        id="waiting-list"
                        checked={form.keepWaitingList}
                        onCheckedChange={(checked) =>
                          setForm((current) => ({
                            ...current,
                            keepWaitingList: checked === true,
                          }))
                        }
                      />
                      <div className="flex flex-col gap-0.5">
                        <FieldLabel htmlFor="waiting-list">
                          Keep a waiting list
                        </FieldLabel>
                        <FieldDescription>
                          Continue collecting eligible applications after the shift
                          fills.
                        </FieldDescription>
                      </div>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox
                        id="publish-now"
                        checked={form.publishNow}
                        onCheckedChange={(checked) =>
                          setForm((current) => ({
                            ...current,
                            publishNow: checked === true,
                          }))
                        }
                      />
                      <div className="flex flex-col gap-0.5">
                        <FieldLabel htmlFor="publish-now">
                          Publish and start matching now
                        </FieldLabel>
                        <FieldDescription>
                          Broadcast to eligible professionals in staged intervals.
                        </FieldDescription>
                      </div>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              )}

              <div className="mt-8 flex flex-col-reverse gap-2 border-t border-border/70 pt-5 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  Back
                </Button>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  {currentStep < steps.length - 1 ? (
                    <Button type="button" onClick={goNext}>
                      Continue
                      <ChevronRightIcon data-icon="inline-end" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting || !companyId}>
                      {isSubmitting && <Spinner data-icon="inline-start" />}
                      {isSubmitting
                        ? "Saving shift..."
                        : form.publishNow
                          ? isEditing
                            ? "Save & publish shift"
                            : "Create & publish shift"
                          : isEditing
                            ? "Save changes"
                            : "Save as draft"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <ShiftSummaryPanel
          form={form}
          profileLabel={profileLabel}
          locationLabel={locationLabel}
          currentStep={currentStep}
        />
      </div>
    </div>
  )
}
