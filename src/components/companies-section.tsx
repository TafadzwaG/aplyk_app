import {
  ArrowRightIcon,
  BarChart3Icon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersRoundIcon,
  WandSparklesIcon,
} from "lucide-react"

import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Link } from "@/lib/router"

const companyFeatures = [
  {
    icon: WandSparklesIcon,
    title: "AI-assisted shift creation",
    description:
      "Turn a few details into a complete shift brief, with requirements and screening built in.",
    accent: "from-brand-navy/12 to-brand-orange/8",
  },
  {
    icon: UsersRoundIcon,
    title: "Qualified matches in minutes",
    description:
      "Reach vetted, available professionals who already match the role, location, and schedule.",
    accent: "from-brand-orange/12 to-brand-navy/8",
  },
  {
    icon: BarChart3Icon,
    title: "One operational view",
    description:
      "Track confirmations, attendance, hours, and ratings without juggling spreadsheets or chats.",
    accent: "from-brand-blend-soft to-brand-navy/6",
  },
] as const

const workflowSteps = [
  { label: "Publish shift", detail: "Role, rate, location" },
  { label: "Match talent", detail: "Skills & availability" },
  { label: "Confirm team", detail: "Accept & notify" },
  { label: "Track live", detail: "Attendance & ratings" },
] as const

function CompaniesVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="companies-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-navy)" stopOpacity="0.04" />
            <stop offset="55%" stopColor="var(--brand-orange)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--brand-navy)" stopOpacity="0.03" />
          </linearGradient>
          <pattern id="companies-dot-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--brand-navy)" fillOpacity="0.08" />
          </pattern>
        </defs>

        <rect width="1440" height="900" fill="url(#companies-bg-gradient)" />
        <rect width="1440" height="900" fill="url(#companies-dot-grid)" />

        <path
          d="M1180 -40 L1440 180 L1440 -40 Z"
          fill="var(--brand-orange)"
          fillOpacity="0.12"
          className="landing-companies-vector-drift"
        />
        <path
          d="M0 720 Q360 620 720 740 T1440 680 L1440 900 L0 900 Z"
          fill="var(--brand-navy)"
          fillOpacity="0.04"
        />

        <g className="landing-companies-vector-pulse" opacity="0.55">
          <circle cx="220" cy="180" r="56" fill="none" stroke="var(--brand-navy)" strokeOpacity="0.12" strokeWidth="1.5" />
          <circle cx="220" cy="180" r="34" fill="var(--brand-navy)" fillOpacity="0.05" />
          <circle cx="220" cy="180" r="8" fill="var(--brand-navy)" fillOpacity="0.18" />
        </g>

        <g opacity="0.45">
          <path
            d="M320 260 C520 180, 680 320, 880 240 S1160 300, 1280 220"
            fill="none"
            stroke="var(--brand-blend)"
            strokeWidth="2"
            strokeDasharray="8 10"
            className="landing-companies-vector-flow"
          />
          <circle cx="320" cy="260" r="6" fill="var(--brand-orange)" fillOpacity="0.65" />
          <circle cx="620" cy="210" r="5" fill="var(--brand-navy)" fillOpacity="0.35" />
          <circle cx="880" cy="240" r="7" fill="var(--brand-orange)" fillOpacity="0.5" />
          <circle cx="1080" cy="270" r="5" fill="var(--brand-navy)" fillOpacity="0.3" />
          <circle cx="1280" cy="220" r="8" fill="var(--brand-navy)" fillOpacity="0.22" />
        </g>

        <g opacity="0.35" className="landing-companies-vector-drift-reverse">
          <rect x="1080" y="520" width="180" height="120" rx="16" fill="var(--brand-navy)" fillOpacity="0.06" />
          <rect x="1100" y="540" width="120" height="10" rx="5" fill="var(--brand-orange)" fillOpacity="0.25" />
          <rect x="1100" y="560" width="90" height="8" rx="4" fill="var(--brand-navy)" fillOpacity="0.15" />
          <rect x="1100" y="578" width="105" height="8" rx="4" fill="var(--brand-navy)" fillOpacity="0.12" />
        </g>

        <g opacity="0.3">
          <path
            d="M120 640 L220 580 L320 620 L420 560"
            fill="none"
            stroke="var(--brand-orange)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          <circle cx="120" cy="640" r="10" fill="var(--brand-orange)" fillOpacity="0.15" />
          <circle cx="220" cy="580" r="10" fill="var(--brand-navy)" fillOpacity="0.12" />
          <circle cx="320" cy="620" r="10" fill="var(--brand-orange)" fillOpacity="0.12" />
          <circle cx="420" cy="560" r="10" fill="var(--brand-navy)" fillOpacity="0.1" />
        </g>
      </svg>
    </div>
  )
}

function WorkflowPipeline() {
  return (
    <div className="relative rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        Operational flow
      </p>
      <ol className="mt-4 flex flex-col gap-0">
        {workflowSteps.map((step, index) => (
          <li key={step.label} className="relative flex gap-4 pb-5 last:pb-0">
            {index < workflowSteps.length - 1 && (
              <span
                className="absolute top-8 left-[0.6875rem] h-[calc(100%-0.75rem)] w-px bg-gradient-to-b from-brand-orange/60 to-brand-navy/20"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-[0.625rem] font-semibold text-white">
              {index + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function CompaniesSection() {
  return (
    <section id="companies" className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32">
      <CompaniesVectorBackground />

      <div className="landing-container relative z-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.75fr)] lg:items-start lg:gap-14">
          <Reveal className="flex flex-col items-start gap-5">
            <Badge variant="outline" className="border-brand-navy/20 bg-card/80">
              For companies
            </Badge>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              From open shift to confirmed team,{" "}
              <span className="text-brand-blend">without the busywork.</span>
            </h2>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Aplyk brings sourcing, scheduling, attendance, and performance into one
              operational flow — so managers spend less time chasing updates.
            </p>
            <Button size="lg" asChild>
              <Link to="/register">
                Build your workforce
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={120}>
            <WorkflowPipeline />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {companyFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 90}>
              <Card
                className={cn(
                  "group relative h-full overflow-hidden border-border/70 bg-card/90 backdrop-blur-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-elevated",
                  index === 0 && "lg:col-span-1"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                    feature.accent
                  )}
                  aria-hidden="true"
                />
                <CardHeader className="gap-4">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-navy text-white shadow-sm ring-1 ring-brand-navy/15 transition-transform duration-300 group-hover:scale-105">
                    <feature.icon className="size-5" />
                  </span>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="mt-2 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6" delay={180}>
          <Card className="overflow-hidden border-border/70 bg-card/92 backdrop-blur-sm">
            <div className="brand-blend-card-stripe" aria-hidden="true" />
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    <SparklesIcon data-icon="inline-start" />
                    Today&apos;s operations
                  </Badge>
                  <Badge variant="outline" className="tabular-nums">
                    Live workspace
                  </Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Everything important, visible at a glance.
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    See what is filled, who is arriving, and where attention is needed —
                    without opening five different tools.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "12", label: "Open shifts", progress: 42, icon: BriefcaseBusinessIcon },
                    { value: "48", label: "Workers confirmed", progress: 78, icon: UsersRoundIcon },
                    { value: "96%", label: "On-time arrival", progress: 96, icon: ShieldCheckIcon },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-border/60 bg-background/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                            {metric.value}
                          </p>
                        </div>
                        <metric.icon className="size-4 text-brand-orange" />
                      </div>
                      <Progress value={metric.progress} className="mt-3 h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[15rem]">
                {[
                  "3 applicants awaiting review",
                  "2 shifts still need cover",
                  "All locations reporting on time",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2.5 text-sm"
                  >
                    <CheckCircle2Icon
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        index === 2 ? "text-brand-navy" : "text-brand-orange"
                      )}
                    />
                    <span className="leading-snug text-muted-foreground">{item}</span>
                  </div>
                ))}
                <Button className="mt-1 w-full sm:w-auto lg:w-full" asChild>
                  <Link to="/register">
                    Open command center
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
