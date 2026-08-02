import * as React from "react"
import type { FormEvent, ReactNode } from "react"
import {
  Building2,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { RequireAuth } from "@/components/require-auth"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { OnboardingHubLayout } from "@/layouts/onboarding-hub-layout"
import { ApiRequestError, companiesApi, referenceApi } from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"
import { cn } from "@/lib/utils"
import type {
  City,
  Country,
  EmployeeRange,
  IndustryType,
  State,
} from "@/types/api"

function toCompanyCode(name: string, taxId: string) {
  const base = (taxId || name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24)

  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base || "company"}-${suffix}`
}

function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function SetupField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <Field>
      <FieldLabel htmlFor={htmlFor} className="onboarding-form-label">
        {label}
      </FieldLabel>
      {children}
    </Field>
  )
}

function SetupSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
        <div className="hidden space-y-4 lg:block">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div className="w-full rounded-2xl bg-card p-6 shadow-sm ring-1 ring-foreground/8 sm:p-8">
          <Skeleton className="mx-auto mb-4 size-14 rounded-2xl" />
          <Skeleton className="mx-auto mb-2 h-8 w-56" />
          <Skeleton className="mx-auto mb-8 h-4 w-72" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CreateCompanyPage() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()
  const [industryTypes, setIndustryTypes] = React.useState<IndustryType[]>([])
  const [employeeRanges, setEmployeeRanges] = React.useState<EmployeeRange[]>(
    []
  )
  const [countries, setCountries] = React.useState<Country[]>([])
  const [states, setStates] = React.useState<State[]>([])
  const [cities, setCities] = React.useState<City[]>([])
  const [selectedCountryId, setSelectedCountryId] = React.useState<string>("")
  const [selectedStateId, setSelectedStateId] = React.useState<string>("")
  const [selectedCityId, setSelectedCityId] = React.useState<string>("")
  const [industryTypeId, setIndustryTypeId] = React.useState<string>("")
  const [employeeRangeId, setEmployeeRangeId] = React.useState<string>("")
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isLoadingLookups, setIsLoadingLookups] = React.useState(true)

  React.useEffect(() => {
    async function loadLookups() {
      try {
        const [nextIndustryTypes, nextRanges, nextCountries] =
          await Promise.all([
            referenceApi.getIndustryTypes(),
            referenceApi.getEmployeeRanges(),
            referenceApi.getCountries(),
          ])
        setIndustryTypes(
          [...nextIndustryTypes].sort((left, right) =>
            left.typeName.localeCompare(right.typeName)
          )
        )
        setEmployeeRanges(nextRanges)
        setCountries(nextCountries)

        if (nextCountries[0]) {
          setSelectedCountryId(String(nextCountries[0].id))
        }
      } catch (error) {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : "Could not load company setup options."
        toast.error(message)
      } finally {
        setIsLoadingLookups(false)
      }
    }

    void loadLookups()
  }, [])

  React.useEffect(() => {
    if (!selectedCountryId) return

    async function loadStates() {
      try {
        const nextStates = await referenceApi.getStatesByCountry(
          Number(selectedCountryId)
        )
        setStates(nextStates)
        setSelectedStateId(nextStates[0] ? String(nextStates[0].id) : "")
      } catch {
        setStates([])
        setSelectedStateId("")
      }
    }

    void loadStates()
  }, [selectedCountryId])

  React.useEffect(() => {
    if (!selectedStateId) return

    async function loadCities() {
      try {
        const nextCities = await referenceApi.getCitiesByState(
          Number(selectedStateId)
        )
        setCities(nextCities)
        setSelectedCityId(nextCities[0] ? String(nextCities[0].id) : "")
      } catch {
        setCities([])
        setSelectedCityId("")
      }
    }

    void loadCities()
  }, [selectedStateId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const companyName = String(form.get("companyName") ?? "").trim()
    const legalName = String(form.get("legalName") ?? "").trim()
    const taxId = String(form.get("taxId") ?? "").trim()
    const businessEmail = String(form.get("businessEmail") ?? "").trim()
    const businessPhone = String(form.get("businessPhone") ?? "").trim()

    if (!companyName || !businessEmail || !industryTypeId || !employeeRangeId) {
      toast.error("Complete all required fields before continuing.")
      return
    }

    if (!acceptedTerms) {
      toast.error("Accept the terms and conditions to create your company.")
      return
    }

    const country = countries.find(
      (item) => item.id === Number(selectedCountryId)
    )
    const state = states.find((item) => item.id === Number(selectedStateId))
    const city = cities.find((item) => item.id === Number(selectedCityId))
    const industryType = industryTypes.find(
      (item) => item.id === Number(industryTypeId)
    )

    if (!country || !state || !city || !industryType) {
      toast.error("Select a valid industry and company address.")
      return
    }

    setIsSubmitting(true)
    try {
      await companiesApi.create({
        companyName,
        companyCode: toCompanyCode(legalName || companyName, taxId),
        phoneNumber: businessPhone || profile?.phoneNumber || null,
        contactFirstName: profile?.firstName || "Company",
        contactLastName: profile?.lastName || "Owner",
        contactEmail: businessEmail,
        employeeRangeId: Number(employeeRangeId),
        termAndCondition: true,
        industryIds: [industryType.industryId],
        address: {
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          addressLine1: legalName || companyName,
          postCode: "0000",
          formattedAddress: `${legalName || companyName}, ${city.name}, ${state.name}, ${country.name}`,
          cityName: city.name,
          stateName: state.name,
          countryName: country.name,
          countryCode: country.code,
        },
      })

      await refreshProfile()
      toast.success("Company created successfully.")
      navigate("/onboarding/contexts")
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Could not create the company."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RequireAuth>
      <OnboardingHubLayout activeStep="setup">
        {isLoadingLookups ? (
          <SetupSkeleton />
        ) : (
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                      Company workspace
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                      Build the foundation for hiring on Aplyk
                    </h1>
                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                      Tell us who you are, how you operate, and how to reach
                      your team. You can add locations and verification details
                      after your workspace is created.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        icon: Building2,
                        title: "Business identity",
                        copy: "Public name, legal entity, and registration details.",
                      },
                      {
                        icon: Sparkles,
                        title: "Industry profile",
                        copy: "Sector and team size help us tailor your setup.",
                      },
                      {
                        icon: Mail,
                        title: "Primary contact",
                        copy: "Verification and onboarding updates go here.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <item.icon className="size-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.copy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="ghost" size="sm" asChild className="px-0">
                    <Link to="/onboarding" className="text-muted-foreground">
                      Back to onboarding options
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </aside>

              <div className="w-full rounded-2xl bg-card shadow-sm ring-1 ring-foreground/8">
                <div className="border-b border-border/70 px-6 py-8 text-center sm:px-8">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Building2 className="size-6" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Set up your company
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Add the business details Aplyk needs to create your company
                    workspace.
                  </p>
                </div>

                <form
                  onSubmit={(event) => void handleSubmit(event)}
                  className="space-y-8 px-6 py-6 sm:px-8 sm:py-8"
                >
                  <FormSection
                    title="Business identity"
                    description="How your company should appear across Aplyk."
                  >
                    <FieldGroup className="gap-4">
                      <SetupField label="Company name" htmlFor="companyName">
                        <Input
                          id="companyName"
                          name="companyName"
                          className="h-10"
                          placeholder="Name shown in Aplyk"
                          required
                        />
                      </SetupField>

                      <SetupField
                        label="Legal business name"
                        htmlFor="legalName"
                      >
                        <Input
                          id="legalName"
                          name="legalName"
                          className="h-10"
                          placeholder="Registered company name"
                        />
                      </SetupField>

                      <SetupField
                        label="Business registration or tax ID"
                        htmlFor="taxId"
                      >
                        <Input
                          id="taxId"
                          name="taxId"
                          className="h-10"
                          placeholder="Enter registration or tax ID"
                        />
                      </SetupField>
                    </FieldGroup>
                  </FormSection>

                  <Separator />

                  <FormSection
                    title="Industry profile"
                    description="Helps us configure the right defaults for your sector."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SetupField label="Industry" htmlFor="industryTypeId">
                        <Select
                          value={industryTypeId}
                          onValueChange={setIndustryTypeId}
                        >
                          <SelectTrigger
                            id="industryTypeId"
                            className="h-10 w-full"
                          >
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {industryTypes.map((industryType) => (
                                <SelectItem
                                  key={industryType.id}
                                  value={String(industryType.id)}
                                >
                                  {industryType.typeName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </SetupField>

                      <SetupField label="Company size">
                        <Select
                          value={employeeRangeId}
                          onValueChange={setEmployeeRangeId}
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select number of employees" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeRanges.map((range) => (
                              <SelectItem
                                key={range.id}
                                value={String(range.id)}
                              >
                                {range.rangeLabel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </SetupField>
                    </div>
                  </FormSection>

                  <Separator />

                  <FormSection
                    title="Primary contact"
                    description="Used for verification messages and workspace notifications."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SetupField
                        label="Business email"
                        htmlFor="businessEmail"
                      >
                        <div className="relative">
                          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="businessEmail"
                            name="businessEmail"
                            type="email"
                            className="h-10 pl-9"
                            defaultValue={profile?.email ?? ""}
                            placeholder="company@example.com"
                            required
                          />
                        </div>
                      </SetupField>

                      <SetupField
                        label="Business phone"
                        htmlFor="businessPhone"
                      >
                        <div className="relative">
                          <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="businessPhone"
                            name="businessPhone"
                            type="tel"
                            className="h-10 pl-9"
                            defaultValue={profile?.phoneNumber ?? ""}
                            placeholder="Enter business phone number"
                          />
                        </div>
                      </SetupField>
                    </div>
                  </FormSection>

                  <Accordion type="single" collapsible defaultValue="address">
                    <AccordionItem value="address" className="border-none">
                      <AccordionTrigger className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm font-medium hover:no-underline">
                        <span className="flex items-center gap-2">
                          <MapPin className="size-4 text-primary" />
                          Registered business address
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <SetupField label="Country">
                            <Select
                              value={selectedCountryId}
                              onValueChange={setSelectedCountryId}
                            >
                              <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="Country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem
                                    key={country.id}
                                    value={String(country.id)}
                                  >
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </SetupField>

                          <SetupField label="State">
                            <Select
                              value={selectedStateId}
                              onValueChange={setSelectedStateId}
                              disabled={!states.length}
                            >
                              <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="State" />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map((state) => (
                                  <SelectItem
                                    key={state.id}
                                    value={String(state.id)}
                                  >
                                    {state.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </SetupField>

                          <SetupField label="City">
                            <Select
                              value={selectedCityId}
                              onValueChange={setSelectedCityId}
                              disabled={!cities.length}
                            >
                              <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="City" />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map((city) => (
                                  <SelectItem
                                    key={city.id}
                                    value={String(city.id)}
                                  >
                                    {city.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </SetupField>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
                    <label className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Checkbox
                        checked={acceptedTerms}
                        onCheckedChange={(checked) =>
                          setAcceptedTerms(checked === true)
                        }
                        className="mt-0.5"
                      />
                      <span className="space-y-1">
                        <span className="flex items-center gap-2 font-medium text-foreground">
                          <ShieldCheck className="size-4 text-primary" />
                          Terms and workspace policy
                        </span>
                        <span>
                          I agree to the platform terms and conditions required
                          to create a company workspace on Aplyk.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <p className="text-center text-xs text-muted-foreground italic">
                      You can add workplace locations and submit the company for
                      verification after creating it.
                    </p>

                    <Button
                      type="submit"
                      size="lg"
                      className="h-11 w-full text-base shadow-md shadow-primary/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating company..." : "Create company"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </OnboardingHubLayout>
    </RequireAuth>
  )
}
