import * as React from "react"
import {
  ArrowRightIcon,
  Building2Icon,
  Clock3Icon,
  CoinsIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  UserRoundIcon,
  WarehouseIcon,
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
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { getApiErrorMessage, locationsApi, referenceApi } from "@/lib/api"
import { Link } from "@/lib/router"
import { cn } from "@/lib/utils"
import type {
  City,
  CompanyLocation,
  CompanyLocationManagerOption,
  Country,
  State,
} from "@/types/api"

type LocationForm = {
  locationName: string
  code: string
  managerId: string
  addressLine1: string
  addressLine2: string
  countryId: string
  stateId: string
  cityId: string
  postCode: string
  zone: string
  comments: string
  timeZoneId: string
  currencyCode: string
  isActive: boolean
}

const defaultForm = (): LocationForm => ({
  locationName: "",
  code: "",
  managerId: "auto",
  addressLine1: "",
  addressLine2: "",
  countryId: "",
  stateId: "",
  cityId: "",
  postCode: "",
  zone: "",
  comments: "",
  timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  currencyCode: "",
  isActive: true,
})

function managerName(
  managerId: number | null,
  managers: CompanyLocationManagerOption[]
) {
  return (
    managers.find((manager) => manager.userId === managerId)?.displayName ??
    "Workspace owner"
  )
}

function LocationStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  tone: "navy" | "orange" | "blend"
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border px-4 py-3 ring-1 ring-foreground/5",
        tone === "navy" && "border-brand-navy/15 bg-brand-navy-soft/40",
        tone === "orange" && "border-brand-orange/20 bg-brand-orange-soft/50",
        tone === "blend" && "border-brand-blend/20 bg-brand-blend-soft/60"
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg ring-1",
          tone === "navy" && "bg-brand-navy text-white ring-brand-navy/20",
          tone === "orange" && "bg-brand-orange text-white ring-brand-orange/20",
          tone === "blend" && "bg-brand-blend text-white ring-brand-blend/20"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div>
        <p className="font-heading text-2xl font-semibold tabular-nums leading-none">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function LocationCard({
  location,
  managers,
}: {
  location: CompanyLocation
  managers: CompanyLocationManagerOption[]
}) {
  const address = location.formattedAddress || location.addressLine1

  return (
    <Card
      size="sm"
      className="group overflow-hidden transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_10px_32px_color-mix(in_oklab,var(--brand-navy)_12%,transparent)]"
    >
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-5 md:p-5">
        <div
          className={cn(
            "hidden w-1 shrink-0 self-stretch rounded-full md:block",
            location.isActive ? "bg-brand-blend" : "bg-muted-foreground/30"
          )}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="brand-blend-icon flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-foreground/8">
            <MapPinIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/locations/${location.id}`}
                className="font-heading text-base font-semibold transition-colors hover:text-brand-blend"
              >
                {location.locationName}
              </Link>
              <Badge variant="outline" className="font-mono text-[0.625rem]">
                {location.code}
              </Badge>
              <Badge variant={location.isActive ? "secondary" : "outline"}>
                {location.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {address}
            </p>
            {location.zone && (
              <p className="mt-1 text-xs text-muted-foreground">
                Zone: {location.zone}
              </p>
            )}
          </div>
        </div>

        <div className="grid shrink-0 gap-3 sm:grid-cols-3 md:max-w-md md:gap-4">
          <div className="flex items-center gap-2 text-sm">
            <UserRoundIcon className="size-4 shrink-0 text-brand-navy/70" />
            <div className="min-w-0">
              <p className="text-[0.625rem] font-medium tracking-wide text-muted-foreground uppercase">
                Manager
              </p>
              <p className="truncate font-medium">
                {managerName(location.managerId, managers)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock3Icon className="size-4 shrink-0 text-brand-navy/70" />
            <div className="min-w-0">
              <p className="text-[0.625rem] font-medium tracking-wide text-muted-foreground uppercase">
                Time zone
              </p>
              <p className="truncate font-medium">
                {location.timeZoneId || "Not set"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CoinsIcon className="size-4 shrink-0 text-brand-orange" />
            <div className="min-w-0">
              <p className="text-[0.625rem] font-medium tracking-wide text-muted-foreground uppercase">
                Currency
              </p>
              <p className="truncate font-medium">
                {location.currencyCode || "Not set"}
              </p>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="shrink-0 md:ml-1" asChild>
          <Link to={`/locations/${location.id}`}>
            View
            <ArrowRightIcon data-icon="inline-end" className="size-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}

export function LocationsPage() {
  const { profile } = useAuth()
  const companyId = profile?.activeCompanyId ?? null
  const [locations, setLocations] = React.useState<CompanyLocation[]>([])
  const [managers, setManagers] = React.useState<
    CompanyLocationManagerOption[]
  >([])
  const [countries, setCountries] = React.useState<Country[]>([])
  const [states, setStates] = React.useState<State[]>([])
  const [cities, setCities] = React.useState<City[]>([])
  const [form, setForm] = React.useState<LocationForm>(defaultForm)
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const loadData = React.useCallback(async () => {
    if (!companyId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const [nextLocations, nextManagers, nextCountries] = await Promise.all([
        locationsApi.list(companyId),
        locationsApi.getManagerOptions(),
        referenceApi.getCountries(),
      ])
      setLocations(nextLocations)
      setManagers(nextManagers)
      setCountries(nextCountries)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load locations."))
    } finally {
      setIsLoading(false)
    }
  }, [companyId])

  React.useEffect(() => {
    // Initial resource data is synchronized from the API on mount/context change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData()
  }, [loadData])

  async function handleCountryChange(value: string) {
    setForm((current) => ({
      ...current,
      countryId: value,
      stateId: "",
      cityId: "",
    }))
    setStates([])
    setCities([])

    try {
      setStates(await referenceApi.getStatesByCountry(Number(value)))
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not load provinces or states.")
      )
    }
  }

  async function handleStateChange(value: string) {
    setForm((current) => ({ ...current, stateId: value, cityId: "" }))
    setCities([])

    try {
      setCities(await referenceApi.getCitiesByState(Number(value)))
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load cities."))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!companyId) return

    const country = countries.find((item) => item.id === Number(form.countryId))
    const state = states.find((item) => item.id === Number(form.stateId))
    const city = cities.find((item) => item.id === Number(form.cityId))
    const formattedAddress = [
      form.addressLine1,
      form.addressLine2,
      city?.name,
      state?.name,
      form.postCode,
      country?.name,
    ]
      .filter(Boolean)
      .join(", ")

    setIsSubmitting(true)
    try {
      await locationsApi.create({
        companyId,
        locationName: form.locationName.trim(),
        code: form.code.trim().toUpperCase(),
        managerId: form.managerId === "auto" ? null : Number(form.managerId),
        isActive: form.isActive,
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim() || null,
        countryId: Number(form.countryId),
        stateId: Number(form.stateId),
        cityId: Number(form.cityId),
        postCode: form.postCode.trim(),
        zone: form.zone.trim() || null,
        comments: form.comments.trim() || null,
        formattedAddress,
        cityName: city?.name ?? null,
        stateName: state?.name ?? null,
        countryName: country?.name ?? null,
        countryCode: country?.code ?? null,
        timeZoneId: form.timeZoneId.trim(),
        currencyCode: form.currencyCode.trim().toUpperCase(),
      })
      toast.success("Location added", {
        description: `${form.locationName} is ready to use for new shifts.`,
      })
      setForm(defaultForm())
      setStates([])
      setCities([])
      setOpen(false)
      await loadData()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not add the location."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeCount = locations.filter((location) => location.isActive).length
  const filteredLocations = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return locations
    return locations.filter((location) => {
      const haystack = [
        location.locationName,
        location.code,
        location.formattedAddress,
        location.addressLine1,
        location.cityName,
        location.zone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [locations, search])

  return (
    <div className="flex flex-col gap-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <section className="locations-hero grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-5">
          <Card className="relative overflow-hidden border-l-4 border-l-brand-orange shadow-[var(--shadow-card)]">
            <CardHeader className="gap-4 pb-2">
              <Badge variant="outline" className="w-fit border-brand-navy/20 text-brand-navy">
                Company setup
              </Badge>
              <div className="flex flex-col gap-2">
                <CardTitle className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                  Locations
                </CardTitle>
                <CardDescription className="max-w-xl text-base leading-relaxed">
                  Create the workplaces your team operates from. Time zone and
                  currency are stored per location so shift times and rates stay
                  accurate.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 pt-2">
              <DialogTrigger asChild>
                <Button disabled={!companyId}>
                  <PlusIcon data-icon="inline-start" />
                  Add location
                </Button>
              </DialogTrigger>
              <Button variant="outline" asChild>
                <Link to="/shifts">View scheduled shifts</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <LocationStat
              label="Total locations"
              value={locations.length}
              icon={WarehouseIcon}
              tone="navy"
            />
            <LocationStat
              label="Active workplaces"
              value={activeCount}
              icon={MapPinIcon}
              tone="orange"
            />
            <LocationStat
              label="Available managers"
              value={managers.length}
              icon={Building2Icon}
              tone="blend"
            />
          </div>
        </section>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a location</DialogTitle>
            <DialogDescription>
              Give schedulers a clear workplace, local time zone, and currency.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <form id="location-form" onSubmit={handleSubmit}>
              <FieldGroup>
              <FieldGroup className="grid sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="location-name">Location name</FieldLabel>
                  <Input
                    id="location-name"
                    value={form.locationName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        locationName: event.target.value,
                      }))
                    }
                    placeholder="Rosebank Care Centre"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="location-code">Location code</FieldLabel>
                  <Input
                    id="location-code"
                    value={form.code}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        code: event.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="RBK-01"
                    maxLength={50}
                    required
                  />
                  <FieldDescription>
                    Unique within your company.
                  </FieldDescription>
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel>Location manager</FieldLabel>
                <Select
                  value={form.managerId}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, managerId: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="auto">
                        Assign me automatically
                      </SelectItem>
                      {managers.map((manager) => (
                        <SelectItem
                          key={manager.userId}
                          value={String(manager.userId)}
                        >
                          {manager.displayName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="address-line-1">Street address</FieldLabel>
                <Input
                  id="address-line-1"
                  value={form.addressLine1}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      addressLine1: event.target.value,
                    }))
                  }
                  placeholder="15 Baker Street"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="address-line-2">
                  Unit or building
                </FieldLabel>
                <Input
                  id="address-line-2"
                  value={form.addressLine2}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      addressLine2: event.target.value,
                    }))
                  }
                  placeholder="Building B, Floor 2"
                />
              </Field>

              <FieldGroup className="grid sm:grid-cols-2">
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Select
                    value={form.countryId}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {countries.map((country) => (
                          <SelectItem
                            key={country.id}
                            value={String(country.id)}
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Province / state</FieldLabel>
                  <Select
                    value={form.stateId}
                    onValueChange={handleStateChange}
                    disabled={!form.countryId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={String(state.id)}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <Select
                    value={form.cityId}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, cityId: value }))
                    }
                    disabled={!form.stateId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={String(city.id)}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="post-code">Postal code</FieldLabel>
                  <Input
                    id="post-code"
                    value={form.postCode}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        postCode: event.target.value,
                      }))
                    }
                    placeholder="2196"
                    required
                  />
                </Field>
              </FieldGroup>

              <FieldGroup className="grid sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="time-zone">IANA time zone</FieldLabel>
                  <Input
                    id="time-zone"
                    value={form.timeZoneId}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        timeZoneId: event.target.value,
                      }))
                    }
                    placeholder="Africa/Johannesburg"
                    required
                  />
                  <FieldDescription>
                    Used to calculate shift times.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="currency">Currency code</FieldLabel>
                  <Input
                    id="currency"
                    value={form.currencyCode}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        currencyCode: event.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="ZAR"
                    minLength={3}
                    maxLength={3}
                    required
                  />
                  <FieldDescription>Three-letter ISO code.</FieldDescription>
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel htmlFor="zone">Area or zone</FieldLabel>
                <Input
                  id="zone"
                  value={form.zone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      zone: event.target.value,
                    }))
                  }
                  placeholder="Northern suburbs"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="location-notes">
                  Scheduler notes
                </FieldLabel>
                <Textarea
                  id="location-notes"
                  value={form.comments}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      comments: event.target.value,
                    }))
                  }
                  placeholder="Parking, reception, or access information..."
                />
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="location-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({
                      ...current,
                      isActive: checked === true,
                    }))
                  }
                />
                <FieldLabel htmlFor="location-active">
                  Available for scheduling immediately
                </FieldLabel>
              </Field>
            </FieldGroup>
            </form>
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" form="location-form" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isSubmitting ? "Adding location..." : "Add location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold">Workplace directory</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {search.trim()
                ? `${filteredLocations.length} of ${locations.length} locations match your search`
                : "Every site your schedulers can assign to shifts and job profiles."}
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, code, or address..."
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} size="sm">
                <CardContent className="flex flex-col gap-3 py-5 md:flex-row md:items-center">
                  <Skeleton className="size-11 rounded-xl" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredLocations.length ? (
          <div className="flex flex-col gap-3">
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                managers={managers}
              />
            ))}
          </div>
        ) : locations.length ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-blend-soft ring-1 ring-foreground/8">
                <SearchIcon className="size-5 text-muted-foreground" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-lg font-semibold">
                  No locations match
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Try a different search term or clear the field.
                </p>
              </div>
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-blend-soft ring-1 ring-foreground/8">
                <MapPinIcon className="size-5 text-brand-orange" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-lg font-semibold">
                  No locations yet
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Add your first workplace to start scheduling shifts.
                </p>
              </div>
              <Button onClick={() => setOpen(true)} disabled={!companyId}>
                <PlusIcon data-icon="inline-start" />
                Add location
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
