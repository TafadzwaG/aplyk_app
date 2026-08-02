import * as React from "react"
import type { FormEvent, ReactNode } from "react"
import {
  ArrowLeftIcon,
  BanknoteIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClipboardListIcon,
  EyeIcon,
  FileTextIcon,
  LanguagesIcon,
  ListChecksIcon,
  ShieldCheckIcon,
  ShirtIcon,
  TagsIcon,
  UserCheckIcon,
  WalletIcon,
  WrenchIcon,
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
import { getApiErrorMessage, jobProfilesApi, referenceApi } from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import { cn } from "@/lib/utils"
import type {
  ApplicationReviewOption,
  Category,
  Language,
  Skill,
} from "@/types/api"

type JobProfileForm = {
  jobName: string
  categoryId: string
  description: string
  hourlyRate: string
  applicationReview: string
  clothingAndEquipment: string
  workInstructions: string
  workConditions: string
  securityClearance: boolean
  approvalRequired: boolean
  interviewRequired: boolean
  skillIds: number[]
  languageIds: number[]
}

const steps = [
  {
    id: "role",
    label: "Role details",
    description: "Name the profile and describe the role.",
    icon: BriefcaseBusinessIcon,
  },
  {
    id: "pay",
    label: "Pay & workplace",
    description: "Set default pay and on-site expectations.",
    icon: WalletIcon,
  },
  {
    id: "matching",
    label: "Matching",
    description: "Choose skills and languages for matching.",
    icon: WrenchIcon,
  },
  {
    id: "screening",
    label: "Screening",
    description: "Review handling and screening preferences.",
    icon: ShieldCheckIcon,
  },
] as const

const defaultForm = (): JobProfileForm => ({
  jobName: "",
  categoryId: "",
  description: "",
  hourlyRate: "",
  applicationReview: "1",
  clothingAndEquipment: "",
  workInstructions: "",
  workConditions: "",
  securityClearance: false,
  approvalRequired: false,
  interviewRequired: false,
  skillIds: [],
  languageIds: [],
})

function toggleId(values: number[], value: number, checked: boolean) {
  return checked
    ? Array.from(new Set([...values, value]))
    : values.filter((item) => item !== value)
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

function truncate(value: string, maxLength = 120) {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength).trimEnd()}…`
}

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

function ProfileSummaryPanel({
  form,
  categoryLabel,
  reviewLabel,
  selectedSkills,
  selectedLanguages,
  currentStep,
}: {
  form: JobProfileForm
  categoryLabel: string
  reviewLabel: string
  selectedSkills: Skill[]
  selectedLanguages: Language[]
  currentStep: number
}) {
  const screeningFlags = [
    form.securityClearance && "Security clearance",
    form.approvalRequired && "Manager approval",
    form.interviewRequired && "Interview",
  ].filter(Boolean) as string[]

  const hasRoleDetails =
    Boolean(form.jobName.trim()) ||
    Boolean(form.categoryId) ||
    Boolean(form.description.trim())
  const hasPayDetails =
    Boolean(form.hourlyRate) || form.applicationReview !== "1"
  const hasWorkplaceDetails =
    Boolean(form.workInstructions.trim()) ||
    Boolean(form.clothingAndEquipment.trim()) ||
    Boolean(form.workConditions.trim())
  const hasMatching =
    selectedSkills.length > 0 || selectedLanguages.length > 0
  const hasScreening = screeningFlags.length > 0

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-0 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/70 bg-secondary/20 pb-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-foreground/8">
              <EyeIcon className="size-4 text-primary" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-base">Profile preview</CardTitle>
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
                <BriefcaseBusinessIcon className="size-5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Profile
                </p>
                <p className="mt-1 font-heading text-lg font-semibold tracking-tight">
                  {form.jobName.trim() || "Untitled profile"}
                </p>
                {categoryLabel !== "—" && (
                  <Badge variant="secondary" className="mt-2 gap-1">
                    <TagsIcon className="size-3" />
                    {categoryLabel}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <SummarySection
            title="Role details"
            icon={BriefcaseBusinessIcon}
            empty={!hasRoleDetails}
          >
            <dl className="grid gap-3">
              <SummaryField
                label="Category"
                icon={TagsIcon}
                value={categoryLabel}
              />
              <SummaryField
                label="Summary"
                icon={FileTextIcon}
                value={
                  truncate(form.description, 160) ?? (
                    <span className="font-normal text-muted-foreground">
                      Not added yet
                    </span>
                  )
                }
              />
            </dl>
          </SummarySection>

          <SummarySection
            title="Pay & handling"
            icon={WalletIcon}
            empty={!hasPayDetails}
          >
            <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <SummaryField
                label="Default hourly rate"
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
                label="Application handling"
                icon={UserCheckIcon}
                value={reviewLabel}
              />
            </dl>
          </SummarySection>

          <SummarySection
            title="Workplace"
            icon={Building2Icon}
            empty={!hasWorkplaceDetails}
          >
            <dl className="grid gap-3">
              <SummaryField
                label="Instructions"
                icon={ClipboardListIcon}
                value={
                  truncate(form.workInstructions) ?? (
                    <span className="font-normal text-muted-foreground">
                      None
                    </span>
                  )
                }
              />
              <SummaryField
                label="Clothing & equipment"
                icon={ShirtIcon}
                value={
                  truncate(form.clothingAndEquipment) ?? (
                    <span className="font-normal text-muted-foreground">
                      None
                    </span>
                  )
                }
              />
              <SummaryField
                label="Work conditions"
                icon={Building2Icon}
                value={
                  truncate(form.workConditions) ?? (
                    <span className="font-normal text-muted-foreground">
                      None
                    </span>
                  )
                }
              />
            </dl>
          </SummarySection>

          <SummarySection
            title="Matching"
            icon={WrenchIcon}
            empty={!hasMatching}
          >
            <div className="flex flex-col gap-3">
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <WrenchIcon className="size-3.5" />
                  Skills
                </p>
                {selectedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill.id} variant="outline" className="gap-1">
                        <WrenchIcon className="size-3" />
                        {skill.skillName}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None selected</p>
                )}
              </div>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LanguagesIcon className="size-3.5" />
                  Languages
                </p>
                {selectedLanguages.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLanguages.map((language) => (
                      <Badge key={language.id} variant="outline" className="gap-1">
                        <LanguagesIcon className="size-3" />
                        {language.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None selected</p>
                )}
              </div>
            </div>
          </SummarySection>

          <SummarySection
            title="Screening"
            icon={ShieldCheckIcon}
            empty={!hasScreening}
          >
            {screeningFlags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {screeningFlags.map((flag) => (
                  <Badge key={flag} variant="secondary" className="gap-1">
                    <ShieldCheckIcon className="size-3" />
                    {flag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No extra screening enabled
              </p>
            )}
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

function StepSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

export function CreateJobProfilePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const companyId = profile?.activeCompanyId ?? null
  const [currentStep, setCurrentStep] = React.useState(0)
  const [form, setForm] = React.useState<JobProfileForm>(defaultForm)
  const [categories, setCategories] = React.useState<Category[]>([])
  const [skills, setSkills] = React.useState<Skill[]>([])
  const [languages, setLanguages] = React.useState<Language[]>([])
  const [reviewOptions, setReviewOptions] = React.useState<
    ApplicationReviewOption[]
  >([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    async function loadLookups() {
      setIsLoading(true)
      try {
        const [nextCategories, nextSkills, nextLanguages, options] =
          await Promise.all([
            referenceApi.getCategories(),
            referenceApi.getSkills(),
            referenceApi.getLanguages(),
            jobProfilesApi.getApplicationReviewOptions(),
          ])
        setCategories(nextCategories.filter((item) => item.isActive))
        setSkills(nextSkills.filter((item) => item.isActive))
        setLanguages(nextLanguages.filter((item) => item.isActive))
        setReviewOptions(options)
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Could not load form options."))
      } finally {
        setIsLoading(false)
      }
    }

    void loadLookups()
  }, [])

  function validateStep(step: number) {
    if (step === 0) {
      if (!form.jobName.trim()) {
        toast.error("Enter a profile name.")
        return false
      }
      if (!form.categoryId) {
        toast.error("Choose a job category.")
        return false
      }
      if (!form.description.trim()) {
        toast.error("Add a role summary.")
        return false
      }
    }

    if (step === 1) {
      if (!form.hourlyRate || Number(form.hourlyRate) <= 0) {
        toast.error("Enter a valid default hourly rate.")
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!companyId) return
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      const created = await jobProfilesApi.create({
        companyId,
        jobName: form.jobName.trim(),
        categoryId: Number(form.categoryId),
        description: form.description.trim(),
        hourlyRate: Number(form.hourlyRate),
        clothingAndEquipment: form.clothingAndEquipment.trim() || null,
        workInstructions: form.workInstructions.trim() || null,
        workConditions: form.workConditions.trim() || null,
        applicationReview: Number(form.applicationReview),
        ageRangeId: null,
        genderId: null,
        securityClearance: form.securityClearance,
        approvalRequired: form.approvalRequired,
        interviewRequired: form.interviewRequired,
        skillIds: form.skillIds,
        languageIds: form.languageIds,
        skillRequirements: form.skillIds.map((skillId) => ({
          skillId,
          minimumExperienceMonths: null,
        })),
        languageRequirements: form.languageIds.map((languageId) => ({
          languageId,
          minimumProficiency: 1,
        })),
        credentialRequirements: [],
      })
      toast.success("Job profile created", {
        description: `${form.jobName} is now available when creating shifts.`,
      })
      navigate(`/job-profiles/${created.id}`)
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not create the job profile.")
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const reviewLabel =
    reviewOptions.find((option) => option.id === Number(form.applicationReview))
      ?.name ??
    (form.applicationReview === "2"
      ? "Automatic acceptance"
      : "Manual review")
  const categoryLabel =
    categories.find((category) => category.id === Number(form.categoryId))
      ?.categoryName ?? "—"
  const selectedSkills = skills.filter((skill) =>
    form.skillIds.includes(skill.id)
  )
  const selectedLanguages = languages.filter((language) =>
    form.languageIds.includes(language.id)
  )

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

  return (
    <div className="flex w-full flex-col gap-6">
      <Link
        to="/job-profiles"
        className="inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back to job profiles
      </Link>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Hiring library
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Create a job profile
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Build a reusable role template in four steps. You can still adjust pay
          and instructions when scheduling individual shifts.
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
          {steps.map((step, index) => (
            <div
              key={step.id}
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
                <StepSection title="Role details">
                  <FieldGroup>
                    <FieldGroup className="grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="job-name">Profile name</FieldLabel>
                        <Input
                          id="job-name"
                          value={form.jobName}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              jobName: event.target.value,
                            }))
                          }
                          placeholder="Registered Nurse"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Category</FieldLabel>
                        <Select
                          value={form.categoryId}
                          onValueChange={(value) =>
                            setForm((current) => ({
                              ...current,
                              categoryId: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={String(category.id)}
                                >
                                  {category.categoryName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="job-description">
                        Role summary
                      </FieldLabel>
                      <Textarea
                        id="job-description"
                        value={form.description}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Describe the role, its purpose, and the person who will thrive in it."
                        required
                      />
                    </Field>
                  </FieldGroup>
                </StepSection>
              )}

              {currentStep === 1 && (
                <StepSection title="Pay and workplace">
                  <FieldGroup>
                    <FieldGroup className="grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="hourly-rate">
                          Default hourly rate
                        </FieldLabel>
                        <Input
                          id="hourly-rate"
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
                        <FieldDescription>
                          The location currency is applied when scheduling.
                        </FieldDescription>
                      </Field>
                      <Field>
                        <FieldLabel>Application handling</FieldLabel>
                        <Select
                          value={form.applicationReview}
                          onValueChange={(value) =>
                            setForm((current) => ({
                              ...current,
                              applicationReview: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {(reviewOptions.length
                                ? reviewOptions
                                : [
                                    { id: 1, name: "Manual review" },
                                    { id: 2, name: "Automatic acceptance" },
                                  ]
                              ).map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={String(option.id)}
                                >
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="work-instructions">
                        Work instructions
                      </FieldLabel>
                      <Textarea
                        id="work-instructions"
                        value={form.workInstructions}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            workInstructions: event.target.value,
                          }))
                        }
                        placeholder="Core responsibilities, handover process, and expected outcomes..."
                      />
                    </Field>
                    <FieldGroup className="grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="equipment">
                          Clothing & equipment
                        </FieldLabel>
                        <Textarea
                          id="equipment"
                          value={form.clothingAndEquipment}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              clothingAndEquipment: event.target.value,
                            }))
                          }
                          placeholder="Uniform, PPE, or equipment provided..."
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="conditions">
                          Work conditions
                        </FieldLabel>
                        <Textarea
                          id="conditions"
                          value={form.workConditions}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              workConditions: event.target.value,
                            }))
                          }
                          placeholder="Physical demands, environment, or travel..."
                        />
                      </Field>
                    </FieldGroup>
                  </FieldGroup>
                </StepSection>
              )}

              {currentStep === 2 && (
                <StepSection
                  title="Matching requirements"
                  description="Optional — select skills and languages used to match professionals to this role."
                >
                  <FieldGroup className="gap-6">
                    {skills.length > 0 ? (
                      <FieldSet>
                        <FieldLegend className="flex items-center gap-2">
                          <WrenchIcon className="size-4" />
                          Required skills
                        </FieldLegend>
                        <FieldGroup className="grid sm:grid-cols-2">
                          {skills.map((skill) => (
                            <Field key={skill.id} orientation="horizontal">
                              <Checkbox
                                id={`skill-${skill.id}`}
                                checked={form.skillIds.includes(skill.id)}
                                onCheckedChange={(checked) =>
                                  setForm((current) => ({
                                    ...current,
                                    skillIds: toggleId(
                                      current.skillIds,
                                      skill.id,
                                      checked === true
                                    ),
                                  }))
                                }
                              />
                              <FieldLabel htmlFor={`skill-${skill.id}`}>
                                {skill.skillName}
                              </FieldLabel>
                            </Field>
                          ))}
                        </FieldGroup>
                      </FieldSet>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills are configured yet.
                      </p>
                    )}

                    {languages.length > 0 ? (
                      <FieldSet>
                        <FieldLegend className="flex items-center gap-2">
                          <LanguagesIcon className="size-4" />
                          Languages
                        </FieldLegend>
                        <FieldGroup className="grid sm:grid-cols-2">
                          {languages.map((language) => (
                            <Field key={language.id} orientation="horizontal">
                              <Checkbox
                                id={`language-${language.id}`}
                                checked={form.languageIds.includes(language.id)}
                                onCheckedChange={(checked) =>
                                  setForm((current) => ({
                                    ...current,
                                    languageIds: toggleId(
                                      current.languageIds,
                                      language.id,
                                      checked === true
                                    ),
                                  }))
                                }
                              />
                              <FieldLabel htmlFor={`language-${language.id}`}>
                                {language.name}
                              </FieldLabel>
                            </Field>
                          ))}
                        </FieldGroup>
                      </FieldSet>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No languages are configured yet.
                      </p>
                    )}
                  </FieldGroup>
                </StepSection>
              )}

              {currentStep === 3 && (
                <StepSection
                  title="Screening preferences"
                  description="Choose any extra checks required before someone can work this role."
                >
                  <FieldGroup>
                    <FieldSet>
                      <FieldLegend>Application screening</FieldLegend>
                      <FieldGroup>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="security-clearance"
                            checked={form.securityClearance}
                            onCheckedChange={(checked) =>
                              setForm((current) => ({
                                ...current,
                                securityClearance: checked === true,
                              }))
                            }
                          />
                          <FieldLabel htmlFor="security-clearance">
                            Security clearance required
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="approval-required"
                            checked={form.approvalRequired}
                            onCheckedChange={(checked) =>
                              setForm((current) => ({
                                ...current,
                                approvalRequired: checked === true,
                              }))
                            }
                          />
                          <FieldLabel htmlFor="approval-required">
                            Manager approval required
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="interview-required"
                            checked={form.interviewRequired}
                            onCheckedChange={(checked) =>
                              setForm((current) => ({
                                ...current,
                                interviewRequired: checked === true,
                              }))
                            }
                          />
                          <FieldLabel htmlFor="interview-required">
                            Interview required
                          </FieldLabel>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </FieldGroup>
                </StepSection>
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
                      {isSubmitting ? "Creating profile..." : "Create job profile"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <ProfileSummaryPanel
          form={form}
          categoryLabel={categoryLabel}
          reviewLabel={reviewLabel}
          selectedSkills={selectedSkills}
          selectedLanguages={selectedLanguages}
          currentStep={currentStep}
        />
      </div>
    </div>
  )
}
