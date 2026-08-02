import {
  ArrowRightIcon,
  BellRingIcon,
  CalendarCheckIcon,
  Clock3Icon,
  MapPinIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Reveal } from "@/components/reveal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Link } from "@/lib/router"

const workerFeatures = [
  {
    icon: BellRingIcon,
    title: "Relevant opportunities",
    description: "Get notified about shifts that fit your skills and availability.",
    accent: "border-brand-orange/40 bg-brand-orange-soft/60",
  },
  {
    icon: CalendarCheckIcon,
    title: "A schedule that stays clear",
    description: "See confirmed work, upcoming shifts, and changes in one place.",
    accent: "border-brand-navy/20 bg-brand-navy-soft/50",
  },
  {
    icon: StarIcon,
    title: "A reputation that travels",
    description: "Build a trusted profile from verified attendance and ratings.",
    accent: "border-brand-blend/30 bg-brand-blend-soft/80",
  },
] as const

const upcomingShifts = [
  { role: "Event server", when: "Thu · 18:00", rate: "€16/hr", location: "Gran Via" },
  { role: "Barista", when: "Sat · 09:00", rate: "€12.50/hr", location: "Old Town" },
  { role: "Warehouse support", when: "Mon · 14:00", rate: "€14/hr", location: "Port district" },
] as const

function WorkersVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="workers-bg-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity="0.07" />
            <stop offset="45%" stopColor="var(--brand-navy)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity="0.05" />
          </linearGradient>
          <pattern id="workers-line-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M48 0 L0 0 0 48"
              fill="none"
              stroke="var(--brand-orange)"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="1440" height="760" fill="url(#workers-bg-gradient)" />
        <rect width="1440" height="760" fill="url(#workers-line-grid)" />

        <path
          d="M0 0 L280 0 L0 220 Z"
          fill="var(--brand-orange)"
          fillOpacity="0.1"
          className="landing-workers-vector-drift"
        />
        <path
          d="M0 560 Q420 480 840 540 T1440 500 L1440 760 L0 760 Z"
          fill="var(--brand-navy)"
          fillOpacity="0.035"
        />

        <g className="landing-workers-vector-orbit" opacity="0.5">
          <circle cx="1180" cy="200" r="88" fill="none" stroke="var(--brand-orange)" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="6 8" />
          <circle cx="1180" cy="200" r="62" fill="var(--brand-orange)" fillOpacity="0.06" />
          <circle cx="1180" cy="138" r="7" fill="var(--brand-orange)" fillOpacity="0.55" />
          <circle cx="1242" cy="200" r="6" fill="var(--brand-navy)" fillOpacity="0.25" />
          <circle cx="1180" cy="262" r="6" fill="var(--brand-navy)" fillOpacity="0.2" />
          <circle cx="1118" cy="200" r="6" fill="var(--brand-orange)" fillOpacity="0.35" />
        </g>

        <g opacity="0.4">
          <path
            d="M180 420 C340 360 460 480 620 420 S900 360 1060 400"
            fill="none"
            stroke="var(--brand-navy)"
            strokeWidth="2"
            strokeDasharray="7 9"
            className="landing-workers-vector-flow"
          />
          <circle cx="180" cy="420" r="8" fill="var(--brand-orange)" fillOpacity="0.45" />
          <circle cx="420" cy="390" r="6" fill="var(--brand-navy)" fillOpacity="0.22" />
          <circle cx="620" cy="420" r="7" fill="var(--brand-orange)" fillOpacity="0.35" />
          <circle cx="860" cy="380" r="6" fill="var(--brand-navy)" fillOpacity="0.18" />
          <circle cx="1060" cy="400" r="8" fill="var(--brand-navy)" fillOpacity="0.16" />
        </g>

        <g opacity="0.28" className="landing-workers-vector-drift-reverse">
          <rect x="80" y="120" width="140" height="88" rx="14" fill="var(--brand-navy)" fillOpacity="0.07" />
          <rect x="96" y="138" width="72" height="8" rx="4" fill="var(--brand-orange)" fillOpacity="0.3" />
          <rect x="96" y="154" width="96" height="6" rx="3" fill="var(--brand-navy)" fillOpacity="0.14" />
          <rect x="96" y="168" width="84" height="6" rx="3" fill="var(--brand-navy)" fillOpacity="0.1" />
        </g>

        <g opacity="0.35">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${220 + i * 28} 620 L${228 + i * 28} 602 L${236 + i * 28} 620 Z`}
              fill="var(--brand-orange)"
              fillOpacity={0.2 + i * 0.06}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

function ProfileStrengthCard() {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/90 shadow-elevated backdrop-blur-sm">
      <div className="h-1 bg-gradient-to-r from-brand-orange via-brand-blend to-brand-navy" aria-hidden="true" />
      <CardHeader className="gap-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 ring-2 ring-brand-orange/30">
              <AvatarFallback className="bg-brand-navy text-white">LM</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">Your profile</CardTitle>
              <CardDescription>Verified professional</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1 tabular-nums">
            <StarIcon className="size-3 fill-brand-orange text-brand-orange" />
            4.8
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Profile strength</span>
            <span className="font-semibold text-brand-navy">82%</span>
          </div>
          <Progress value={82} className="h-2" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["24", "Shifts done"],
            ["98%", "Attendance"],
            ["12", "Skills"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-lg border border-border/60 bg-background/80 px-2 py-2.5 text-center"
            >
              <p className="text-sm font-semibold tabular-nums">{value}</p>
              <p className="mt-0.5 text-[0.625rem] leading-tight text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function WorkersSection() {
  return (
    <section id="workers" className="relative scroll-mt-20 overflow-hidden border-y py-24 sm:py-32">
      <WorkersVectorBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <Reveal delay={80} className="order-2 lg:order-1">
            <div className="flex flex-col gap-4">
              <ProfileStrengthCard />

              <div className="grid gap-3">
                {workerFeatures.map((feature, index) => (
                  <Reveal key={feature.title} delay={120 + index * 80}>
                    <div
                      className={cn(
                        "flex gap-4 rounded-xl border p-4 backdrop-blur-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-sm",
                        feature.accent
                      )}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
                        <feature.icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{feature.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 flex flex-col items-start gap-5 lg:order-2 lg:pt-4">
            <Badge variant="outline" className="border-brand-orange/30 bg-card/80 text-brand-navy">
              For workers
            </Badge>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Better shifts. Clearer schedules.{" "}
              <span className="text-brand-orange">A profile that gets stronger.</span>
            </h2>
            <p className="max-w-lg text-base leading-7 text-muted-foreground">
              Discover relevant work, respond quickly, and build trust through every completed
              shift — with notifications, calendar clarity, and ratings that follow you.
            </p>
            <Button size="lg" className="bg-brand-orange text-white hover:bg-brand-orange/90" asChild>
              <Link to="/register">
                Find your next shift
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Reveal className="mt-12" delay={200}>
          <Card className="overflow-hidden border-border/70 bg-card/92 backdrop-blur-sm">
            <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange">
                    <CalendarCheckIcon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">This week&apos;s pipeline</p>
                    <p className="text-xs text-muted-foreground">Matched to your skills &amp; radius</p>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUpIcon className="size-3.5 text-brand-orange" />
                  3 new opportunities near you
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {upcomingShifts.map((shift, index) => (
                  <div
                    key={shift.role}
                    className={cn(
                      "group rounded-xl border border-border/60 bg-background/85 p-4 transition-colors hover:border-brand-orange/35",
                      index === 0 && "ring-1 ring-brand-orange/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{shift.role}</p>
                      {index === 0 && (
                        <Badge className="h-5 bg-brand-orange/15 px-1.5 text-[0.625rem] text-brand-orange hover:bg-brand-orange/15">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3Icon className="size-3.5 shrink-0 text-brand-navy" />
                        {shift.when}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPinIcon className="size-3.5 shrink-0 text-brand-navy" />
                        {shift.location}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold tabular-nums text-brand-navy">
                      {shift.rate}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
