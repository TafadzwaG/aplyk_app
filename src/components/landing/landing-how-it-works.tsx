import {
  ArrowRightIcon,
  BarChart3Icon,
  BellRingIcon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  SparklesIcon,
  UsersRoundIcon,
} from "lucide-react"

import { LandingPhoto } from "@/components/landing/landing-photo"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { landingImages } from "@/lib/landing-images"
import { cn } from "@/lib/utils"

const workflowSteps = [
  {
    step: "01",
    title: "Create",
    description:
      "Define the role, location, time, and requirements in a guided flow.",
    icon: SparklesIcon,
    accent: "navy" as const,
    highlights: ["Role & rate", "Location & schedule", "Requirements"],
  },
  {
    step: "02",
    title: "Match",
    description:
      "Aplyk identifies and notifies the most relevant available professionals.",
    icon: UsersRoundIcon,
    accent: "blend" as const,
    highlights: ["Skills & experience", "Availability", "Reliability signals"],
  },
  {
    step: "03",
    title: "Manage",
    description:
      "Confirm attendance, track time, and close the loop with performance feedback.",
    icon: BarChart3Icon,
    accent: "orange" as const,
    highlights: ["Confirmations", "Attendance", "Two-way ratings"],
  },
] as const

function HowItWorksVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 size-full" viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="how-it-works-flow" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="var(--brand-navy)" stopOpacity="0.08" />
            <stop offset="50%" stopColor="var(--brand-blend)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <circle cx="720" cy="360" r="220" fill="var(--brand-navy)" fillOpacity="0.03" />
        <path
          d="M120 380 H1320"
          stroke="url(#how-it-works-flow)"
          strokeWidth="2"
          strokeDasharray="10 12"
          className="landing-companies-vector-flow"
        />
        <circle cx="120" cy="380" r="6" fill="var(--brand-navy)" fillOpacity="0.35" />
        <circle cx="720" cy="380" r="6" fill="var(--brand-blend)" fillOpacity="0.45" />
        <circle cx="1320" cy="380" r="6" fill="var(--brand-orange)" fillOpacity="0.4" />
      </svg>
    </div>
  )
}

function WorkflowPreviewMock() {
  return (
    <div className="relative flex flex-col gap-3">
      <div className="rounded-xl border border-brand-navy/15 bg-card/95 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-[0.1em] text-brand-navy uppercase">
            New shift
          </p>
          <Badge variant="secondary" className="text-[0.625rem]">
            Draft
          </Badge>
        </div>
        <p className="mt-2 text-sm font-semibold">Warehouse picker · Cape Town</p>
        <p className="mt-1 text-xs text-muted-foreground">Sat 08:00–16:00 · R120/hr</p>
      </div>

      <div className="flex items-center justify-center">
        <ArrowRightIcon className="size-4 rotate-90 text-brand-blend sm:rotate-0" aria-hidden="true" />
      </div>

      <div className="rounded-xl border border-brand-blend/25 bg-card/95 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <BellRingIcon className="size-4 text-brand-blend" />
          <p className="text-xs font-semibold tracking-[0.1em] text-brand-blend uppercase">
            3 matches notified
          </p>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {["Thabo M. · 4.9★", "Zanele K. · 4.8★", "James P. · 4.7★"].map((name) => (
            <li
              key={name}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2 text-xs"
            >
              <span>{name}</span>
              <CheckCircle2Icon className="size-3.5 text-brand-navy" />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center">
        <ArrowRightIcon className="size-4 rotate-90 text-brand-orange sm:rotate-0" aria-hidden="true" />
      </div>

      <div className="rounded-xl border border-brand-orange/20 bg-card/95 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <CalendarCheckIcon className="size-4 text-brand-orange" />
          <p className="text-xs font-semibold tracking-[0.1em] text-brand-orange uppercase">
            Shift confirmed
          </p>
        </div>
        <p className="mt-2 text-sm font-semibold">Team of 2 · On-site 07:55</p>
        <p className="mt-1 text-xs text-muted-foreground">Attendance tracked · Rating pending</p>
      </div>
    </div>
  )
}

export function LandingHowItWorksSection() {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden border-y py-20 sm:py-28">
      <HowItWorksVectorBackground />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-blend-soft/40 via-transparent to-brand-orange/[0.03]"
        aria-hidden="true"
      />

      <div className="landing-container relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          <Reveal className="lg:col-span-5">
            <Badge variant="outline" className="mb-4 border-brand-navy/20 bg-card/80">
              How it works
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              One connected workflow.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Move from demand to a reliable, ready-to-work team in three clear steps — without
              switching tools or losing visibility along the way.
            </p>

            <div className="mt-8 lg:hidden">
              <WorkflowPreviewMock />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
              <Reveal delay={80} className="hidden lg:block">
                <div className="sticky top-24">
                  <LandingPhoto
                    src={landingImages.sections.howItWorks}
                    alt="Temporary workforce professionals ready for shift assignments"
                    className="aspect-[4/5] min-h-[18rem]"
                    overlay="left"
                  />
                  <div className="absolute right-4 bottom-4 left-4 rounded-xl border border-white/20 bg-brand-navy/85 p-4 text-white backdrop-blur-sm">
                    <p className="text-xs font-semibold tracking-[0.12em] text-white/70 uppercase">
                      End-to-end
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      Post, match, and manage — all in one workspace both sides can trust.
                    </p>
                  </div>
                </div>
              </Reveal>

              <div className="relative flex flex-col gap-5">
                <div
                  className="absolute top-8 bottom-8 left-[1.75rem] hidden w-px bg-gradient-to-b from-brand-navy via-brand-blend to-brand-orange lg:block"
                  aria-hidden="true"
                />

                {workflowSteps.map((item, index) => (
                  <Reveal key={item.step} delay={100 + index * 80}>
                    <article
                      className={cn(
                        "relative rounded-2xl border bg-card/95 p-5 shadow-sm backdrop-blur-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-elevated sm:p-6",
                        item.accent === "navy" && "border-brand-navy/15",
                        item.accent === "blend" && "border-brand-blend/25",
                        item.accent === "orange" && "border-brand-orange/20"
                      )}
                    >
                      <div className="flex gap-4">
                        <span
                          className={cn(
                            "relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md",
                            item.accent === "navy" && "bg-brand-navy",
                            item.accent === "blend" && "bg-brand-blend",
                            item.accent === "orange" && "bg-brand-orange"
                          )}
                        >
                          <item.icon className="size-6" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="tabular-nums">
                              {item.step}
                            </Badge>
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {item.highlights.map((highlight) => (
                              <li
                                key={highlight}
                                className="rounded-lg border border-border/60 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground"
                              >
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}

                <Reveal delay={340} className="hidden lg:block">
                  <WorkflowPreviewMock />
                </Reveal>
              </div>
            </div>
          </div>
        </div>

        <Reveal delay={380} className="mt-10">
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-brand-blend/20 bg-brand-blend-soft/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              <span className="font-semibold text-foreground">From first post to final rating</span>{" "}
              — every step stays visible to hiring teams and professionals alike.
            </p>
            <Badge variant="secondary" className="shrink-0">
              3 steps · One platform
            </Badge>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
