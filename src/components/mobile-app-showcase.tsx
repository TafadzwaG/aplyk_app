import * as React from "react"
import {
  BellRingIcon,
  BriefcaseBusinessIcon,
  CalendarCheckIcon,
  ChevronRightIcon,
  MapPinIcon,
  SmartphoneIcon,
  SparklesIcon,
  TimerIcon,
  UsersRoundIcon,
  ZapIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/lib/router"

const SLIDE_MS = 4500

const appScreens = [
  {
    src: "/images/mobile/app-welcome.png",
    title: "Welcome back",
    step: "01",
    caption: "Sign in or create an account in seconds.",
    alt: "Aplyk mobile welcome screen",
  },
  {
    src: "/images/mobile/app-onboarding.png",
    title: "Choose your path",
    step: "02",
    caption: "Find work, hire staff, or accept an invitation.",
    alt: "Aplyk onboarding role selection",
  },
  {
    src: "/images/mobile/app-home.png",
    title: "Command center",
    step: "03",
    caption: "Setup progress, quick actions, and live metrics.",
    alt: "Aplyk mobile home dashboard",
  },
  {
    src: "/images/mobile/app-shifts.png",
    title: "Shift pipeline",
    step: "04",
    caption: "Filter, publish, and fill roles from anywhere.",
    alt: "Aplyk mobile shifts list",
  },
  {
    src: "/images/mobile/app-shift-detail.png",
    title: "Shift detail",
    step: "05",
    caption: "Applicants, acceptance, and attendance in one view.",
    alt: "Aplyk mobile shift detail screen",
  },
] as const

const floatingStats = [
  {
    icon: TimerIcon,
    value: "38s",
    label: "Fastest confirmation",
    className: "landing-mobile-float-a top-[8%] left-[4%] lg:left-[2%]",
    accent: "text-brand-orange",
  },
  {
    icon: CalendarCheckIcon,
    value: "96%",
    label: "On-time arrival",
    className: "landing-mobile-float-b top-[18%] right-[2%] lg:right-[6%]",
    accent: "text-brand-navy",
  },
  {
    icon: BellRingIcon,
    value: "Live",
    label: "Push alerts",
    className: "landing-mobile-float-c bottom-[28%] left-[0%] lg:left-[4%]",
    accent: "text-brand-orange",
  },
  {
    icon: UsersRoundIcon,
    value: "8",
    label: "Applicants tracked",
    className: "landing-mobile-float-b bottom-[12%] right-[0%] lg:right-[2%]",
    accent: "text-brand-navy",
  },
] as const

function PhoneFrame({
  src,
  alt,
  className,
  active = true,
}: {
  src: string
  alt: string
  className?: string
  active?: boolean
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[min(100%,17.5rem)] transition-[transform,opacity] duration-700 sm:w-[18.5rem]",
        active ? "scale-100 opacity-100" : "scale-[0.92] opacity-55",
        className
      )}
    >
      <div className="absolute -inset-4 rounded-[3rem] bg-brand-blend/20 blur-2xl" aria-hidden="true" />
      <div className="relative rounded-[2.75rem] border-[10px] border-brand-navy bg-brand-navy p-1.5 shadow-[0_28px_80px_color-mix(in_oklab,var(--brand-navy)_35%,transparent)]">
        <div className="absolute top-3 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-brand-navy" aria-hidden="true" />
        <div className="overflow-hidden rounded-[2.1rem] bg-background">
          <img src={src} alt={alt} className="block w-full" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  )
}

function FlowInfographic({ active }: { active: number }) {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute top-6 right-0 left-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
      <ol className="grid grid-cols-5 gap-2">
        {appScreens.map((screen, index) => {
          const isActive = index === active
          const isPast = index < active
          return (
            <li key={screen.step} className="relative flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500",
                  isActive
                    ? "border-brand-orange bg-brand-orange text-white shadow-[0_0_0_6px_color-mix(in_oklab,var(--brand-orange)_18%,transparent)]"
                    : isPast
                      ? "border-brand-navy/30 bg-brand-navy text-white"
                      : "border-border bg-card text-muted-foreground"
                )}
              >
                {screen.step}
              </span>
              <span
                className={cn(
                  "max-w-[6.5rem] text-[0.6875rem] leading-snug transition-colors duration-500",
                  isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                {screen.title}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function OrbitRing() {
  return (
    <svg
      className="landing-mobile-orbit pointer-events-none absolute top-1/2 left-1/2 size-[min(100%,22rem)] -translate-x-1/2 -translate-y-1/2 text-brand-orange/25 sm:size-[26rem] lg:size-[30rem]"
      viewBox="0 0 400 400"
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="168" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 10" />
      <circle cx="200" cy="32" r="6" fill="var(--brand-orange)" className="landing-mobile-orbit-dot" />
    </svg>
  )
}

export function MobileAppShowcase() {
  const [active, setActive] = React.useState(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  React.useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % appScreens.length)
    }, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [reduceMotion])

  const screen = appScreens[active]
  const prevIndex = (active - 1 + appScreens.length) % appScreens.length
  const nextIndex = (active + 1) % appScreens.length

  return (
    <section id="mobile-app" className="scroll-mt-20 overflow-hidden border-b py-20 sm:py-28">
      <div className="landing-container relative">
        <div
          className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-brand-orange/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 size-64 rounded-full bg-brand-navy/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <Badge variant="outline" className="w-fit gap-1.5">
              <SmartphoneIcon className="size-3.5" />
              Mobile app
            </Badge>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Run every shift from the palm of your hand.
              </h2>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                The same calm workspace — onboarding, dashboards, shift pipelines, and live
                confirmations — designed for managers and professionals on the move.
              </p>
            </div>

            <FlowInfographic active={active} />

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [BriefcaseBusinessIcon, "Hire or find work", "One app, two journeys."],
                [MapPinIcon, "Location-aware shifts", "See where work happens."],
                [ZapIcon, "Instant notifications", "Fill gaps before they widen."],
                [SparklesIcon, "AI-assisted setup", "From invite to first shift fast."],
              ].map(([Icon, title, description]) => (
                <div
                  key={title as string}
                  className="flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg brand-blend-icon">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{title as string}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {description as string}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/register">
                  Get the app experience
                  <ChevronRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative flex min-h-[28rem] items-center justify-center py-6 sm:min-h-[32rem]">
            <OrbitRing />

            {floatingStats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "landing-mobile-stat absolute z-20 hidden rounded-2xl border border-border/70 bg-card/95 p-3 shadow-elevated backdrop-blur-sm sm:flex sm:min-w-[8.5rem]",
                  stat.className
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg bg-brand-blend-soft",
                      stat.accent
                    )}
                  >
                    <stat.icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-base font-semibold tabular-nums leading-none">{stat.value}</p>
                    <p className="mt-1 text-[0.625rem] leading-tight text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="relative flex w-full max-w-lg items-center justify-center">
              <PhoneFrame
                src={appScreens[prevIndex].src}
                alt=""
                active={false}
                className="landing-mobile-phone-side absolute -translate-x-[38%] -rotate-6 opacity-40 blur-[1px] sm:-translate-x-[42%]"
              />
              <PhoneFrame
                src={appScreens[nextIndex].src}
                alt=""
                active={false}
                className="landing-mobile-phone-side absolute translate-x-[38%] rotate-6 opacity-40 blur-[1px] sm:translate-x-[42%]"
              />

              <div key={screen.src} className="landing-mobile-phone-main relative z-10">
                <PhoneFrame src={screen.src} alt={screen.alt} active />
                <div className="mt-5 flex flex-col items-center gap-3 text-center">
                  <Badge variant="secondary" className="tabular-nums">
                    Step {screen.step}
                  </Badge>
                  <div>
                    <p className="landing-mobile-caption text-lg font-semibold">{screen.title}</p>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">{screen.caption}</p>
                  </div>
                  <div className="flex gap-1.5" role="tablist" aria-label="App screens">
                    {appScreens.map((item, index) => (
                      <button
                        key={item.src}
                        type="button"
                        role="tab"
                        aria-selected={index === active}
                        aria-label={item.title}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          index === active
                            ? "w-7 bg-brand-orange"
                            : "w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/55"
                        )}
                        onClick={() => setActive(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden">
          {floatingStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/70 bg-card p-4 text-center shadow-sm"
            >
              <p className={cn("text-xl font-semibold tabular-nums", stat.accent)}>{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
