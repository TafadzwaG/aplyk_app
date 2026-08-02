import {
  ArrowRightIcon,
  BadgeCheckIcon,
  Building2Icon,
  CalendarClockIcon,
  ClipboardListIcon,
  HardHatIcon,
  LeafIcon,
  ShoppingBagIcon,
  TimerIcon,
  TruckIcon,
  UtensilsCrossedIcon,
  WineIcon,
} from "lucide-react"

import { LandingPhoto } from "@/components/landing/landing-photo"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { landingImages } from "@/lib/landing-images"
import { cn } from "@/lib/utils"
import { Link } from "@/lib/router"

const industries = [
  {
    icon: UtensilsCrossedIcon,
    title: "Hospitality",
    description: "Cover busy services, events, and seasonal demand.",
    image: landingImages.industries.hospitality,
    alt: "Restaurant team preparing tables for a busy service",
    span: "lg:col-span-8 lg:row-span-2 min-h-[22rem] lg:min-h-[28rem]",
  },
  {
    icon: TruckIcon,
    title: "Logistics and warehousing",
    description: "Find reliable warehouse, fulfilment, and delivery workers.",
    image: landingImages.industries.warehouse,
    alt: "Warehouse team scanning and moving fulfilment boxes",
    span: "lg:col-span-4 min-h-[14rem]",
  },
  {
    icon: WineIcon,
    title: "Events",
    description: "Assemble flexible teams for venues and live experiences.",
    image: landingImages.industries.events,
    alt: "Event crew setting up seating and AV equipment in a venue",
    span: "lg:col-span-4 min-h-[14rem]",
  },
  {
    icon: ShoppingBagIcon,
    title: "Retail",
    description: "Respond to promotions, holidays, and customer-demand peaks.",
    image: landingImages.industries.retail,
    alt: "Retail associates stocking shelves in a boutique store",
    span: "lg:col-span-4 min-h-[14rem]",
  },
  {
    icon: HardHatIcon,
    title: "Construction",
    description: "Connect projects with suitable temporary skills.",
    image: landingImages.industries.construction,
    alt: "Construction team reviewing plans on a building site",
    span: "lg:col-span-4 min-h-[14rem]",
  },
  {
    icon: LeafIcon,
    title: "Agriculture",
    description: "Support seasonal campaigns with flexible local workers.",
    image: landingImages.industries.agriculture,
    alt: "Seasonal workers harvesting produce in a field",
    span: "lg:col-span-8 min-h-[14rem]",
  },
] as const

function IndustriesVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="industries-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M40 0 L0 0 0 40"
              fill="none"
              stroke="var(--brand-navy)"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#industries-grid)" />
        <path
          d="M0 680 Q480 620 960 660 T1440 640 L1440 900 L0 900 Z"
          fill="var(--brand-orange)"
          fillOpacity="0.05"
        />
        <circle
          cx="1280"
          cy="160"
          r="100"
          fill="var(--brand-navy)"
          fillOpacity="0.04"
          className="landing-workers-vector-orbit"
        />
      </svg>
    </div>
  )
}

function IndustryTile({
  industry,
  featured = false,
}: {
  industry: (typeof industries)[number]
  featured?: boolean
}) {
  return (
    <article
      className="group relative h-full min-h-[14rem] overflow-hidden rounded-2xl border border-white/10 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <img
        src={industry.image}
        alt={industry.alt}
        width={800}
        height={600}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-navy/92 via-brand-navy/45 to-brand-navy/15"
        aria-hidden="true"
      />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm">
            <industry.icon className="size-4" />
          </span>
          {featured && (
            <Badge className="border-white/20 bg-brand-orange/90 text-white hover:bg-brand-orange/90">
              Featured sector
            </Badge>
          )}
        </div>

        <div className="mt-auto">
          <h3 className={cn("font-semibold text-white", featured ? "text-2xl sm:text-3xl" : "text-lg")}>
            {industry.title}
          </h3>
          <p
            className={cn(
              "mt-2 leading-relaxed text-white/78",
              featured ? "max-w-md text-sm sm:text-base" : "text-sm"
            )}
          >
            {industry.description}
          </p>
          <Link
            to="/register"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange transition-colors hover:text-white"
          >
            Explore opportunities
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function LandingIndustriesSection() {
  return (
    <section id="industries" className="relative scroll-mt-20 overflow-hidden border-y py-20 sm:py-28">
      <IndustriesVectorBackground />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/40 via-transparent to-muted/30"
        aria-hidden="true"
      />

      <div className="landing-container relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-12">
          <Reveal className="flex flex-col gap-5">
            <Badge variant="outline" className="w-fit border-brand-navy/20 bg-card/80">
              Industry coverage
            </Badge>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Built for industries where{" "}
              <span className="text-brand-orange">timing matters.</span>
            </h2>
            <p className="max-w-lg text-base leading-7 text-muted-foreground">
              From peak-season hospitality to same-day logistics — Aplyk helps you staff up when
              demand spikes and fill roles with people who match the work.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                ["6", "Priority sectors"],
                ["Shift-based", "Flexible roles"],
                ["Real photos", "Real workplaces"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/70 bg-card/90 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold tabular-nums text-brand-navy">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100} className="hidden lg:block">
            <div className="rounded-2xl border border-border/70 bg-card/90 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                  <TimerIcon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">When the clock is ticking</p>
                  <p className="text-xs text-muted-foreground">
                    Urgent shifts need verified people who can start now — not tomorrow.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-fr">
          {industries.map((industry, index) => (
            <Reveal
              key={industry.title}
              delay={index * 60}
              className={cn("min-h-[14rem]", industry.span)}
            >
              <IndustryTile industry={industry} featured={index === 0} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-navy/10 bg-brand-navy px-6 py-6 text-white sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="text-sm font-semibold">Don&apos;t see your sector?</p>
            <p className="mt-1 text-sm text-white/75">
              Aplyk supports any temporary or shift-based role — create an account and define your
              first opportunity.
            </p>
          </div>
          <Button className="bg-brand-orange text-white hover:bg-brand-orange/90" asChild>
            <Link to="/register">
              Get started
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

const companyBenefits = [
  "Reduce time spent searching for available workers",
  "Reach professionals based on real availability",
  "Make more informed selection decisions",
  "Manage shifts from one platform",
  "Build a reusable network of reliable workers",
  "Improve transparency and accountability",
  "Access clear pricing and assignment information",
] as const

export function LandingCompanyBenefitsSection() {
  return (
    <section id="company-benefits" className="scroll-mt-20 py-20 sm:py-28">
      <div className="landing-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <LandingPhoto
              src={landingImages.sections.companyBenefits}
              alt="Diverse group of professionals connecting outdoors"
              className="aspect-[4/3] min-h-[18rem]"
              overlay="left"
            />
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-5">
            <Badge variant="outline" className="w-fit">
              <Building2Icon className="size-3.5" data-icon="inline-start" />
              For companies
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Fill urgent roles without losing operational control.
            </h2>
            <ul className="flex flex-col gap-2.5">
              {companyBenefits.map((benefit) => (
                <li key={benefit} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button size="lg" className="bg-brand-orange text-white hover:bg-brand-orange/90" asChild>
                <Link to="/register">Post a shift</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Create a company account</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const workerBenefits = [
  "Discover suitable temporary opportunities",
  "Receive clear job and shift information",
  "Apply quickly from any device",
  "Track application status",
  "Manage upcoming shifts",
  "Build a trusted professional profile",
  "Receive recognition for reliable work",
] as const

const workerHighlightChips = [
  { value: "Flexible", label: "Your hours", icon: CalendarClockIcon },
  { value: "Clear", label: "Shift info", icon: ClipboardListIcon },
  { value: "Trusted", label: "Profile", icon: BadgeCheckIcon },
] as const

export function LandingWorkerBenefitsSection() {
  return (
    <section id="worker-benefits" className="relative scroll-mt-20 overflow-hidden border-y py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-orange/[0.06] via-transparent to-brand-navy/[0.04]"
        aria-hidden="true"
      />

      <div className="landing-container relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-5 lg:pt-4">
            <div className="relative lg:sticky lg:top-24">
              <LandingPhoto
                src={landingImages.sections.workerBenefits}
                alt="Professional reviewing a shift notification on a phone in the city"
                className="aspect-[4/5] min-h-[20rem]"
                overlay="left"
              />
              <div className="absolute inset-x-3 bottom-4 grid grid-cols-3 gap-2 sm:inset-x-4 sm:bottom-5">
                {workerHighlightChips.map((chip) => (
                  <div
                    key={chip.label}
                    className="rounded-xl border border-white/20 bg-brand-navy/85 px-2.5 py-2.5 text-center backdrop-blur-sm sm:px-3 sm:py-3"
                  >
                    <span className="mx-auto flex size-7 items-center justify-center rounded-lg bg-brand-orange/20 text-brand-orange sm:size-8">
                      <chip.icon className="size-3.5 sm:size-4" aria-hidden="true" />
                    </span>
                    <p className="mt-1.5 text-xs font-semibold text-white sm:text-sm">{chip.value}</p>
                    <p className="mt-0.5 text-[0.625rem] text-white/70">{chip.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-7">
            <Reveal delay={80} className="flex flex-col gap-5">
              <Badge variant="outline" className="w-fit border-brand-orange/30 bg-card/80">
                For professionals
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Flexible work that fits{" "}
                <span className="text-brand-orange">your availability.</span>
              </h2>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Whether you are a student, carer, experienced professional, or seeking additional
                income — discover shifts that respect your time and skills.
              </p>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-2">
              {workerBenefits.map((benefit, index) => (
                <Reveal key={benefit} delay={120 + index * 50}>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border/70 bg-card/95 p-4 backdrop-blur-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-sm">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/12 text-sm font-semibold tabular-nums text-brand-orange">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{benefit}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200} className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="bg-brand-orange text-white hover:bg-brand-orange/90" asChild>
                <Link to="/register">
                  Find work
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Create your profile</Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
