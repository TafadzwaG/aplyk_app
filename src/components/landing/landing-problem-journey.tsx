import type * as React from "react"
import {
  Building2Icon,
  Clock3Icon,
  MessageSquareWarningIcon,
  SearchXIcon,
  ShieldAlertIcon,
  TrendingDownIcon,
  UserRoundIcon,
} from "lucide-react"

import { LandingPhoto } from "@/components/landing/landing-photo"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { landingImages } from "@/lib/landing-images"
import { cn } from "@/lib/utils"

const employerChallenges = [
  {
    icon: Clock3Icon,
    text: "Urgent vacancies take too long to fill",
  },
  {
    icon: SearchXIcon,
    text: "Candidate availability is difficult to confirm",
  },
  {
    icon: MessageSquareWarningIcon,
    text: "Informal recruitment channels provide limited visibility",
  },
  {
    icon: TrendingDownIcon,
    text: "Poor hiring decisions affect productivity and service delivery",
  },
] as const

const workerChallenges = [
  {
    icon: SearchXIcon,
    text: "Opportunities are difficult to discover",
  },
  {
    icon: Clock3Icon,
    text: "Application feedback is often delayed",
  },
  {
    icon: ShieldAlertIcon,
    text: "Job information may be unclear",
  },
  {
    icon: UserRoundIcon,
    text: "Reliable professionals struggle to build a visible reputation",
  },
] as const

function ProblemVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="problem-bg-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-navy)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="var(--brand-orange)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--brand-navy)" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <rect width="1440" height="800" fill="url(#problem-bg-gradient)" />
        <path
          d="M0 120 H1440 M0 280 H1440 M0 440 H1440"
          stroke="var(--brand-navy)"
          strokeOpacity="0.05"
          strokeWidth="1"
          strokeDasharray="6 14"
          className="landing-companies-vector-flow"
        />
        <circle cx="120" cy="640" r="120" fill="var(--brand-orange)" fillOpacity="0.06" />
        <circle cx="1320" cy="120" r="96" fill="var(--brand-navy)" fillOpacity="0.05" />
      </svg>
    </div>
  )
}

function ChallengePanel({
  title,
  subtitle,
  items,
  accent,
  delay = 0,
}: {
  title: string
  subtitle: string
  items: readonly { icon: React.ComponentType<{ className?: string }>; text: string }[]
  accent: "navy" | "orange"
  delay?: number
}) {
  const isNavy = accent === "navy"

  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-2xl border bg-card/95 p-6 shadow-sm backdrop-blur-sm sm:p-7",
          isNavy ? "border-brand-navy/15" : "border-brand-orange/20"
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1",
            isNavy ? "bg-brand-navy" : "bg-brand-orange"
          )}
          aria-hidden="true"
        />
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl text-white",
              isNavy ? "bg-brand-navy" : "bg-brand-orange"
            )}
          >
            {isNavy ? <Building2Icon className="size-5" /> : <UserRoundIcon className="size-5" />}
          </span>
          <div>
            <p
              className={cn(
                "text-xs font-semibold tracking-[0.12em] uppercase",
                isNavy ? "text-brand-navy" : "text-brand-orange"
              )}
            >
              {title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <ul className="mt-6 flex flex-col gap-3">
          {items.map((item, index) => (
            <li
              key={item.text}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/80 px-3 py-3"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg text-[0.6875rem] font-semibold tabular-nums",
                  isNavy
                    ? "bg-brand-navy/10 text-brand-navy"
                    : "bg-brand-orange/12 text-brand-orange"
                )}
              >
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 items-start gap-2.5">
                <item.icon
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    isNavy ? "text-brand-navy" : "text-brand-orange"
                  )}
                />
                <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export function LandingProblemSection() {
  return (
    <section id="the-challenge" className="relative scroll-mt-20 overflow-hidden border-b py-20 sm:py-28">
      <ProblemVectorBackground />

      <div className="landing-container relative z-10">
        <Reveal className="max-w-2xl">
          <Badge variant="outline" className="mb-4 border-brand-navy/20 bg-card/80">
            The challenge
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Temporary hiring should not be slow, expensive or uncertain.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Employers and professionals face the same broken loop — too much friction, too little
            visibility, and no shared record of what actually happened on shift.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-6">
          <Reveal delay={80} className="relative lg:col-span-7 lg:row-span-2">
            <LandingPhoto
              src={landingImages.sections.problem}
              alt="Warehouse team coordinating a temporary shift handover"
              className="aspect-[4/3] min-h-[20rem] lg:min-h-full lg:aspect-auto"
              overlay="left"
            />
            <div className="absolute bottom-4 left-4 flex flex-col gap-2 sm:bottom-6 sm:left-6">
              <div className="rounded-xl border border-white/20 bg-brand-navy/85 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
                <p className="text-[0.625rem] font-semibold tracking-[0.12em] text-white/70 uppercase">
                  Employer pain
                </p>
                <p className="mt-1 text-sm font-semibold">Open roles linger while operations wait</p>
              </div>
              <div className="rounded-xl border border-white/20 bg-brand-orange/90 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
                <p className="text-[0.625rem] font-semibold tracking-[0.12em] text-white/85 uppercase">
                  Worker pain
                </p>
                <p className="mt-1 text-sm font-semibold">Good people miss shifts they never saw</p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <ChallengePanel
              title="For employers"
              subtitle="When urgency hits, hiring friction becomes operational risk."
              items={employerChallenges}
              accent="navy"
              delay={120}
            />
          </div>

          <div className="lg:col-span-5">
            <ChallengePanel
              title="For professionals"
              subtitle="Flexible work should feel clear, fair, and worth showing up for."
              items={workerChallenges}
              accent="orange"
              delay={180}
            />
          </div>
        </div>

        <Reveal delay={220} className="mt-6">
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-brand-blend/20 bg-brand-blend-soft/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              <span className="font-semibold text-foreground">Aplyk closes the gap</span> with
              verified profiles, real availability, and one workspace both sides can trust.
            </p>
            <Badge variant="secondary" className="shrink-0 tabular-nums">
              One connected platform
            </Badge>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const companyJourney = [
  { step: "Create and verify the company profile", detail: "Business identity & locations" },
  { step: "Post a job or shift", detail: "Role, rate, requirements" },
  { step: "Receive AI-assisted candidate matches", detail: "Skills, availability, ratings" },
  { step: "Select and schedule professionals", detail: "Confirm your team" },
  { step: "Track attendance and shift progress", detail: "Clock-in, status, incidents" },
  { step: "Rate the worker and build a preferred network", detail: "Reuse trusted people" },
] as const

const workerJourney = [
  { step: "Create a worker profile", detail: "Skills, experience, preferences" },
  { step: "Verify identity and eligibility", detail: "Documents & Right-to-Work" },
  { step: "Set skills, experience, location, and availability", detail: "Control when you work" },
  { step: "Receive relevant shift opportunities", detail: "Matched to your profile" },
  { step: "Apply and receive an immediate status update", detail: "Clear application flow" },
  { step: "Complete the shift and build a trusted reputation", detail: "Ratings that travel" },
] as const

function JourneyPath({
  title,
  steps,
  accent,
}: {
  title: string
  steps: readonly { step: string; detail: string }[]
  accent: "navy" | "orange"
}) {
  const isNavy = accent === "navy"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card/95 p-6 shadow-sm backdrop-blur-sm sm:p-8",
        isNavy ? "border-brand-navy/15" : "border-brand-orange/20"
      )}
    >
      <div
        className={cn("absolute inset-x-0 top-0 h-1", isNavy ? "bg-brand-navy" : "bg-brand-orange")}
        aria-hidden="true"
      />
      <p
        className={cn(
          "text-xs font-semibold tracking-[0.12em] uppercase",
          isNavy ? "text-brand-navy" : "text-brand-orange"
        )}
      >
        {title}
      </p>
      <ol className="mt-6 flex flex-col gap-4">
        {steps.map((item, index) => (
          <li key={item.step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                  isNavy ? "bg-brand-navy" : "bg-brand-orange"
                )}
              >
                {index + 1}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "mt-1 w-px flex-1 min-h-[1.25rem]",
                    isNavy ? "bg-brand-navy/20" : "bg-brand-orange/25"
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-sm font-semibold leading-snug">{item.step}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function JourneyVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 size-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <path
          d="M120 400 C360 320 540 480 720 400 S1080 320 1320 400"
          fill="none"
          stroke="var(--brand-blend)"
          strokeWidth="2"
          strokeDasharray="8 12"
          strokeOpacity="0.35"
          className="landing-companies-vector-flow"
        />
        <circle cx="120" cy="400" r="8" fill="var(--brand-navy)" fillOpacity="0.25" />
        <circle cx="720" cy="400" r="10" fill="var(--brand-orange)" fillOpacity="0.45" />
        <circle cx="1320" cy="400" r="8" fill="var(--brand-navy)" fillOpacity="0.25" />
      </svg>
    </div>
  )
}

export function LandingPlatformJourneySection() {
  return (
    <section id="platform-journey" className="relative scroll-mt-20 overflow-hidden border-b py-20 sm:py-28">
      <JourneyVectorBackground />
      <div className="pointer-events-none absolute inset-0 bg-muted/30" aria-hidden="true" />

      <div className="landing-container relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
          <Reveal className="flex flex-col gap-5">
            <Badge variant="outline" className="w-fit border-brand-blend/30 bg-card/80">
              End-to-end journey
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              From posting a shift to completing and reviewing it.
            </h2>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Aplyk supports the complete temporary-work journey for companies and professionals —
              not just listing openings.
            </p>
          </Reveal>

          <Reveal delay={80} className="hidden lg:flex lg:justify-end">
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/90 px-5 py-4 backdrop-blur-sm">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-blend-soft text-brand-navy text-sm font-semibold">
                6
              </span>
              <div>
                <p className="text-sm font-semibold">Steps each side</p>
                <p className="text-xs text-muted-foreground">One connected workflow</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal delay={100}>
            <JourneyPath title="For companies" steps={companyJourney} accent="navy" />
          </Reveal>
          <Reveal delay={160}>
            <JourneyPath title="For professionals" steps={workerJourney} accent="orange" />
          </Reveal>
        </div>

        <Reveal delay={220} className="mt-6">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-blend/20 bg-brand-blend-soft/60 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              <span className="font-semibold text-foreground">More than a job board.</span> Every
              step leaves a trace — from verification and matching to attendance and ratings.
            </p>
            <Badge variant="secondary" className="shrink-0">
              Full shift lifecycle
            </Badge>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
