import * as React from "react"
import {
  ArchiveIcon,
  ArrowUpDownIcon,
  BriefcaseBusinessIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  EyeIcon,
  LanguagesIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  TagsIcon,
  UsersRoundIcon,
  WrenchIcon,
} from "lucide-react"
import { toast } from "sonner"

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
import { useAuth } from "@/contexts/auth-context"
import { getApiErrorMessage, jobProfilesApi, referenceApi } from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import { cn } from "@/lib/utils"
import type {
  ApplicationReviewOption,
  Category,
  CompanyRoleProfile,
  JobProfileListQuery,
} from "@/types/api"

type SortOption =
  | "name-asc"
  | "name-desc"
  | "rate-asc"
  | "rate-desc"
  | "created-desc"
  | "created-asc"
  | "category-asc"

function parseSortOption(value: SortOption): Pick<
  JobProfileListQuery,
  "sortBy" | "sortDirection"
> {
  const [sortBy, sortDirection] = value.split("-") as [
    JobProfileListQuery["sortBy"],
    "asc" | "desc",
  ]
  return { sortBy, sortDirection }
}

function JobProfileCard({
  profile,
  categoryLabel,
  reviewLabel,
  busyProfileId,
  onView,
  onEdit,
  onArchive,
  onCreateShift,
}: {
  profile: CompanyRoleProfile
  categoryLabel: string
  reviewLabel: string
  busyProfileId: number | null
  onView: (profile: CompanyRoleProfile) => void
  onEdit: (profile: CompanyRoleProfile) => void
  onArchive: (profile: CompanyRoleProfile) => void
  onCreateShift: (profile: CompanyRoleProfile) => void
}) {
  const isBusy = busyProfileId === profile.id
  const requirementCount =
    profile.skillIds.length + profile.languageIds.length

  return (
    <Card
      size="sm"
      className="group relative h-full overflow-hidden transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_color-mix(in_oklab,var(--brand-navy)_14%,transparent)]"
    >
      <div className="brand-blend-card-stripe" aria-hidden />
      <CardHeader className="gap-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="brand-blend-icon flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-foreground/8">
              <BriefcaseBusinessIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-base">
                <button
                  type="button"
                  onClick={() => onView(profile)}
                  className="text-left transition-colors hover:text-brand-blend"
                >
                  {profile.jobName}
                </button>
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {categoryLabel}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-xl font-semibold tabular-nums text-brand-navy">
              {profile.hourlyRate.toFixed(0)}
            </p>
            <p className="text-[0.625rem] font-medium tracking-wide text-muted-foreground uppercase">
              / hour
            </p>
          </div>
        </div>
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
          {profile.description || "No description added yet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={profile.applicationReview === 2 ? "secondary" : "outline"}
          >
            {reviewLabel}
          </Badge>
          {requirementCount > 0 ? (
            <>
              {profile.skillIds.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <WrenchIcon className="size-3" />
                  {profile.skillIds.length}
                </Badge>
              )}
              {profile.languageIds.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <LanguagesIcon className="size-3" />
                  {profile.languageIds.length}
                </Badge>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">
              No requirements set
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex-wrap gap-2 border-t border-border/70 bg-muted/30 pt-3">
        <Button
          type="button"
          variant="default"
          size="sm"
          className="flex-1 sm:flex-none"
          disabled={isBusy}
          onClick={() => onCreateShift(profile)}
        >
          <CalendarClockIcon data-icon="inline-start" />
          Create shift
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isBusy}
          onClick={() => onView(profile)}
        >
          <EyeIcon data-icon="inline-start" />
          View
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={isBusy}
          aria-label="Edit profile"
          onClick={() => onEdit(profile)}
        >
          <PencilIcon className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={isBusy}
          aria-label="Archive profile"
          onClick={() => onArchive(profile)}
        >
          {isBusy ? (
            <Spinner className="size-3.5" />
          ) : (
            <ArchiveIcon className="size-3.5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function HeroStatTile({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="font-heading text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium text-white/75">{label}</p>
      </div>
    </div>
  )
}

function JobProfilesFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  reviewFilter,
  onReviewChange,
  requirementsFilter,
  onRequirementsChange,
  sortOption,
  onSortChange,
  categories,
  reviewOptions,
  hasActiveFilters,
  onClearFilters,
  resultCount,
}: {
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  reviewFilter: string
  onReviewChange: (value: string) => void
  requirementsFilter: string
  onRequirementsChange: (value: string) => void
  sortOption: SortOption
  onSortChange: (value: SortOption) => void
  categories: Category[]
  reviewOptions: ApplicationReviewOption[]
  hasActiveFilters: boolean
  onClearFilters: () => void
  resultCount: number
}) {
  return (
    <Card className="overflow-hidden xl:sticky xl:top-20 xl:self-start">
      <CardHeader className="gap-2 border-b border-border/70 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Find profiles</CardTitle>
          <Badge variant="outline" className="tabular-nums">
            {resultCount}
          </Badge>
        </div>
        <CardDescription>
          Search and narrow your reusable role library.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name or description..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full">
              <TagsIcon
                data-icon="inline-start"
                className="size-4 text-muted-foreground"
              />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={reviewFilter} onValueChange={onReviewChange}>
            <SelectTrigger className="w-full">
              <SparklesIcon
                data-icon="inline-start"
                className="size-4 text-muted-foreground"
              />
              <SelectValue placeholder="Review method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All review methods</SelectItem>
                {(reviewOptions.length
                  ? reviewOptions
                  : [
                      { id: 1, name: "Manual review" },
                      { id: 2, name: "Automatic acceptance" },
                    ]
                ).map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={requirementsFilter}
            onValueChange={onRequirementsChange}
          >
            <SelectTrigger className="w-full">
              <WrenchIcon
                data-icon="inline-start"
                className="size-4 text-muted-foreground"
              />
              <SelectValue placeholder="Requirements" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All requirement levels</SelectItem>
                <SelectItem value="with">With skills or languages</SelectItem>
                <SelectItem value="without">No requirements set</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={sortOption}
            onValueChange={(value) => onSortChange(value as SortOption)}
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
                <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                <SelectItem value="rate-asc">Rate (low to high)</SelectItem>
                <SelectItem value="rate-desc">Rate (high to low)</SelectItem>
                <SelectItem value="created-desc">Newest first</SelectItem>
                <SelectItem value="created-asc">Oldest first</SelectItem>
                <SelectItem value="category-asc">Category</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" className="w-full" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function JobProfilesPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const companyId = profile?.activeCompanyId ?? null
  const [allProfiles, setAllProfiles] = React.useState<CompanyRoleProfile[]>([])
  const [profiles, setProfiles] = React.useState<CompanyRoleProfile[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [reviewOptions, setReviewOptions] = React.useState<
    ApplicationReviewOption[]
  >([])
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [reviewFilter, setReviewFilter] = React.useState("all")
  const [requirementsFilter, setRequirementsFilter] = React.useState("all")
  const [sortOption, setSortOption] = React.useState<SortOption>("name-asc")
  const [archiveProfile, setArchiveProfile] =
    React.useState<CompanyRoleProfile | null>(null)
  const [busyProfileId, setBusyProfileId] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const listQuery = React.useMemo((): JobProfileListQuery => {
    const { sortBy, sortDirection } = parseSortOption(sortOption)
    return {
      search: debouncedSearch || undefined,
      categoryId: categoryFilter !== "all" ? Number(categoryFilter) : undefined,
      applicationReview: reviewFilter !== "all" ? Number(reviewFilter) : undefined,
      hasRequirements:
        requirementsFilter === "all"
          ? undefined
          : requirementsFilter === "with",
      sortBy,
      sortDirection,
    }
  }, [
    debouncedSearch,
    categoryFilter,
    reviewFilter,
    requirementsFilter,
    sortOption,
  ])

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    categoryFilter !== "all" ||
    reviewFilter !== "all" ||
    requirementsFilter !== "all" ||
    sortOption !== "name-asc"

  const loadReferenceData = React.useCallback(async () => {
    try {
      const [nextCategories, options] = await Promise.all([
        referenceApi.getCategories(),
        jobProfilesApi.getApplicationReviewOptions(),
      ])
      setCategories(nextCategories.filter((item) => item.isActive))
      setReviewOptions(options)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load job profile filters."))
    }
  }, [])

  const loadAllProfiles = React.useCallback(async () => {
    if (!companyId) return
    try {
      const nextProfiles = await jobProfilesApi.list(companyId)
      setAllProfiles(nextProfiles)
    } catch {
      setAllProfiles([])
    }
  }, [companyId])

  const loadProfiles = React.useCallback(async () => {
    if (!companyId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const nextProfiles = await jobProfilesApi.list(companyId, listQuery)
      setProfiles(nextProfiles)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load job profiles."))
    } finally {
      setIsLoading(false)
    }
  }, [companyId, listQuery])

  React.useEffect(() => {
    if (!companyId) {
      setIsLoading(false)
      return
    }
    void loadReferenceData()
    void loadAllProfiles()
  }, [companyId, loadAllProfiles, loadReferenceData])

  React.useEffect(() => {
    void loadProfiles()
  }, [loadProfiles])

  async function handleArchiveConfirm() {
    if (!archiveProfile) return

    setBusyProfileId(archiveProfile.id)
    try {
      await jobProfilesApi.remove(archiveProfile.id)
      toast.success("Job profile archived", {
        description: `${archiveProfile.jobName} has been removed from your role library.`,
      })
      setArchiveProfile(null)
      await Promise.all([loadAllProfiles(), loadProfiles()])
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not archive this job profile."))
    } finally {
      setBusyProfileId(null)
    }
  }

  function clearFilters() {
    setSearch("")
    setCategoryFilter("all")
    setReviewFilter("all")
    setRequirementsFilter("all")
    setSortOption("name-asc")
  }

  const automatedCount = allProfiles.filter(
    (item) => item.applicationReview === 2
  ).length
  const requirementTotal = allProfiles.reduce(
    (total, item) => total + item.skillIds.length + item.languageIds.length,
    0
  )
  const categoryName = (categoryId: number) =>
    categories.find((category) => category.id === categoryId)?.categoryName ??
    "Uncategorised"
  const reviewName = (reviewId: number) =>
    reviewOptions.find((option) => option.id === reviewId)?.name ??
    (reviewId === 2 ? "Automatic acceptance" : "Manual review")

  return (
    <div className="flex flex-col gap-8">
      <section className="job-profiles-hero relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(125deg,var(--brand-navy)_0%,var(--brand-blend)_48%,color-mix(in_oklab,var(--brand-orange)_85%,var(--brand-navy)_15%)_100%)]" />
        <div className="absolute -top-24 -right-16 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-56 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="relative grid gap-4 p-5 md:p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-5">
          <div className="flex flex-col justify-between gap-6 lg:py-2">
            <div className="flex flex-col gap-3">
              <Badge className="w-fit border-white/20 bg-white/10 text-white hover:bg-white/10">
                Hiring library
              </Badge>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Job profiles
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                Define each role once — skills, languages, pay defaults — then
                spin up consistent shifts without re-entering the same details.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={!companyId}
                className="bg-white text-brand-navy hover:bg-white/90"
                asChild
              >
                <Link to="/job-profiles/new">
                  <PlusIcon data-icon="inline-start" />
                  Add job profile
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                asChild
              >
                <Link to="/shifts/new">Create shift from profile</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-2 lg:grid-rows-2">
            <HeroStatTile
              label="Reusable profiles"
              value={allProfiles.length}
              icon={BriefcaseBusinessIcon}
              className="lg:col-span-1"
            />
            <HeroStatTile
              label="Auto-accept enabled"
              value={automatedCount}
              icon={SparklesIcon}
              className="lg:col-span-1"
            />
            <HeroStatTile
              label="Matching requirements"
              value={requirementTotal}
              icon={UsersRoundIcon}
              className="sm:col-span-3 lg:col-span-2 lg:row-start-2"
            />
          </div>
        </div>
      </section>

      <AlertDialog
        open={archiveProfile !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && busyProfileId === null) setArchiveProfile(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <ArchiveIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Archive this job profile?</AlertDialogTitle>
            <AlertDialogDescription>
              {archiveProfile?.jobName || "This profile"} will be removed from
              your role library. Existing shifts already created from it will
              not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyProfileId !== null}>
              Keep profile
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={busyProfileId !== null}
              onClick={(event) => {
                event.preventDefault()
                void handleArchiveConfirm()
              }}
            >
              {busyProfileId !== null && <Spinner data-icon="inline-start" />}
              Archive profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)] xl:items-start">
        <JobProfilesFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          reviewFilter={reviewFilter}
          onReviewChange={setReviewFilter}
          requirementsFilter={requirementsFilter}
          onRequirementsChange={setRequirementsFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          categories={categories}
          reviewOptions={reviewOptions}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          resultCount={profiles.length}
        />

        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-lg font-semibold">Role library</h3>
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? `${profiles.length} profile${profiles.length === 1 ? "" : "s"} match your filters`
                : `${allProfiles.length} reusable template${allProfiles.length === 1 ? "" : "s"} ready for scheduling`}
            </p>
          </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} size="sm">
                <CardHeader className="gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : profiles.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {profiles.map((item) => (
              <JobProfileCard
                key={item.id}
                profile={item}
                categoryLabel={categoryName(item.categoryId)}
                reviewLabel={reviewName(item.applicationReview)}
                busyProfileId={busyProfileId}
                onView={(nextProfile) =>
                  navigate(`/job-profiles/${nextProfile.id}`)
                }
                onEdit={() =>
                  toast.message("Profile editing will be available soon.")
                }
                onArchive={setArchiveProfile}
                onCreateShift={(nextProfile) =>
                  navigate(`/shifts/new?profileId=${nextProfile.id}`)
                }
              />
            ))}
          </div>
        ) : allProfiles.length ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-foreground/8">
                <SearchIcon className="size-5 text-muted-foreground" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-lg font-semibold">
                  No profiles match
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Try a different search term or clear your filters.
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
                <CheckCircle2Icon className="size-5 text-muted-foreground" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-lg font-semibold">
                  Build your first role
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Reusable profiles make shift creation faster and more
                  consistent.
                </p>
              </div>
              <Button asChild disabled={!companyId}>
                <Link to="/job-profiles/new">
                  <PlusIcon data-icon="inline-start" />
                  Add job profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        </section>
      </div>
    </div>
  )
}
