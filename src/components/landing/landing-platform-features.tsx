import {
  BellRingIcon,
  CalendarCheckIcon,
  CalendarClockIcon,
  ClipboardCheckIcon,
  FingerprintIcon,
  IdCardIcon,
  ShieldCheckIcon,
  StarIcon,
  UserCheckIcon,
} from "lucide-react"

import { LandingPhoto } from "@/components/landing/landing-photo"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { landingImages } from "@/lib/landing-images"
import { cn } from "@/lib/utils"

const matchingFactors = [
  "Skills",
  "Relevant experience",
  "Availability",
  "Location",
  "Job requirements",
  "Reliability indicators",
  "Previous ratings",
] as const

export function LandingAiMatchingSection() {
  return (
    <section id="ai-matching" className="scroll-mt-20 py-20 sm:py-28">
      <div className="landing-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <LandingPhoto
              src={landingImages.sections.aiMatching}
              alt="Professionals from hospitality, logistics, and service industries"
              className="aspect-[4/3] min-h-[18rem]"
              overlay="left"
            />
          </Reveal>

          <Reveal delay={100} className="flex flex-col gap-5">
            <Badge variant="outline">AI-assisted matching</Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Better matches in less time.
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Aplyk recommends professionals using the signals that matter for shift work — so
              managers spend less time searching and more time operating.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {matchingFactors.map((factor) => (
                <li
                  key={factor}
                  className="rounded-lg border border-border/60 bg-card px-3 py-2 text-sm text-muted-foreground"
                >
                  {factor}
                </li>
              ))}
            </ul>
            <p className="rounded-xl border border-brand-navy/10 bg-brand-blend-soft/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              AI assists the matching process. Final hiring and scheduling decisions always remain
              with the company.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const trustFeatures = [
  { icon: FingerprintIcon, label: "Identity verification" },
  { icon: IdCardIcon, label: "Eligibility and Right-to-Work checks" },
  { icon: ShieldCheckIcon, label: "Business verification" },
  { icon: UserCheckIcon, label: "Candidate profile screening" },
  { icon: StarIcon, label: "Two-way ratings" },
  { icon: CalendarCheckIcon, label: "Attendance records" },
  { icon: BellRingIcon, label: "Incident tracking" },
  { icon: ClipboardCheckIcon, label: "Secure handling of personal information" },
] as const

function VerificationVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 size-full" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
        <circle cx="200" cy="120" r="160" fill="var(--brand-navy)" fillOpacity="0.04" />
        <circle cx="1240" cy="620" r="140" fill="var(--brand-orange)" fillOpacity="0.06" />
        <path
          d="M720 80 L780 200 L900 220 L810 310 L830 430 L720 370 L610 430 L630 310 L540 220 L660 200 Z"
          fill="none"
          stroke="var(--brand-navy)"
          strokeOpacity="0.08"
          strokeWidth="2"
          className="landing-workers-vector-orbit"
          style={{ transformOrigin: "720px 260px" }}
        />
      </svg>
    </div>
  )
}

export function LandingVerificationSection() {
  return (
    <section id="verification" className="relative scroll-mt-20 overflow-hidden border-y py-20 sm:py-28">
      <VerificationVectorBackground />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-navy/[0.03] via-transparent to-brand-orange/[0.04]" />

      <div className="landing-container relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="flex flex-col gap-5 lg:col-span-5 lg:justify-center">
            <Badge variant="outline" className="w-fit border-brand-navy/20 bg-card/80">
              Verification and trust
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Verified from the{" "}
              <span className="text-brand-navy">beginning.</span>
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Trust features help both sides make informed decisions. Verification supports safer
              workflows — it does not replace your own judgement or legal responsibilities.
            </p>

            <div className="rounded-2xl border border-brand-navy/12 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-navy text-white">
                  <ShieldCheckIcon className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Trust layer</p>
                  <p className="text-xs text-muted-foreground">
                    Profiles, documents, attendance, and ratings in one record
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-4">
                {[
                  ["ID", "Verified"],
                  ["RTW", "Checked"],
                  ["Rating", "Tracked"],
                ].map(([label, value]) => (
                  <div key={label} className="text-center">
                    <p className="text-[0.625rem] font-semibold tracking-wide text-muted-foreground uppercase">
                      {label}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-brand-navy">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="relative lg:col-span-7">
            <LandingPhoto
              src={landingImages.sections.verification}
              alt="Inclusive retail team welcoming a professional arriving for a shift"
              className="aspect-[16/11] min-h-[16rem]"
              overlay="left"
            />
            <div className="absolute right-4 bottom-4 left-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {trustFeatures.slice(0, 4).map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-brand-navy/80 px-3 py-2.5 text-white backdrop-blur-sm"
                >
                  <feature.icon className="size-4 shrink-0 text-brand-orange" />
                  <span className="text-[0.6875rem] leading-snug font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((feature) => (
            <div
              key={feature.label}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/90 px-4 py-3.5 backdrop-blur-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-blend-soft text-brand-navy">
                <feature.icon className="size-4" />
              </span>
              <p className="text-sm leading-snug text-muted-foreground">{feature.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

const shiftManagementFeatures = [
  { icon: CalendarClockIcon, label: "Shift scheduling", phase: "Plan" },
  { icon: UserCheckIcon, label: "Worker confirmation", phase: "Confirm" },
  { icon: FingerprintIcon, label: "Clock-in and clock-out", phase: "Track" },
  { icon: CalendarCheckIcon, label: "Attendance monitoring", phase: "Track" },
  { icon: ClipboardCheckIcon, label: "Shift history", phase: "Review" },
  { icon: BellRingIcon, label: "Incident reporting", phase: "Resolve" },
  { icon: BellRingIcon, label: "Status notifications", phase: "Notify" },
  { icon: StarIcon, label: "Operational reporting", phase: "Review" },
] as const

export function LandingShiftManagementSection() {
  return (
    <section id="shift-management" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--brand-orange)_6%,transparent)_0%,transparent_45%)]"
        aria-hidden="true"
      />

      <div className="landing-container relative z-10">
        <Reveal className="mb-10 max-w-2xl">
          <Badge variant="outline" className="mb-4 border-brand-orange/25 bg-card/80">
            Shift operations
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Stay in control of{" "}
            <span className="text-brand-orange">every shift.</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Coordinate teams, confirm attendance, and keep a clear record from scheduling through
            completion.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <div className="border-b border-border/60 bg-brand-navy px-5 py-4 text-white">
                <p className="text-xs font-semibold tracking-[0.12em] text-white/70 uppercase">
                  Live shift board
                </p>
                <p className="mt-1 text-lg font-semibold">Tonight · Gran Via venue</p>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                {[
                  ["Event server", "5 of 6 confirmed", 83, "Live"],
                  ["Bar back", "3 of 3 confirmed", 100, "Filled"],
                  ["Setup crew", "2 of 4 confirmed", 50, "Needs cover"],
                ].map(([role, status, progress, badge]) => (
                  <div key={role as string} className="rounded-xl border border-border/60 bg-background/80 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{role as string}</p>
                      <Badge
                        variant={badge === "Needs cover" ? "outline" : "secondary"}
                        className={cn(
                          badge === "Needs cover" && "border-brand-orange/40 text-brand-orange"
                        )}
                      >
                        {badge as string}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{status as string}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-brand-orange transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:col-span-7 lg:grid-cols-2">
            {shiftManagementFeatures.map((feature, index) => (
              <Reveal key={feature.label} delay={index * 50}>
                <div className="flex h-full items-start gap-3 rounded-xl border border-border/70 bg-card/95 p-4 backdrop-blur-sm transition-shadow hover:shadow-sm">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange">
                    <feature.icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-[0.625rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                      {feature.phase}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold">{feature.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={180} className="mt-6">
          <LandingPhoto
            src={landingImages.sections.shiftManagement}
            alt="Manager and professional coordinating shifts from mobile devices"
            className="aspect-[16/10] min-h-[12rem]"
            overlay="bottom"
          />
        </Reveal>
      </div>
    </section>
  )
}
