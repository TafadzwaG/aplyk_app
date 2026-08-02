import { LandingPhoto } from "@/components/landing/landing-photo"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/lib/router"
import { landingImages } from "@/lib/landing-images"
import { cn } from "@/lib/utils"

import {
  ArrowRightIcon,
  Building2Icon,
  Globe2Icon,
  HandHeartIcon,
  MapPinIcon,
  RouteIcon,
  ScaleIcon,
  SparklesIcon,
  UserRoundIcon,
} from "lucide-react"

const socialImpactPoints = [
  {
    icon: Globe2Icon,
    label: "Transparent access to temporary opportunities",
  },
  {
    icon: HandHeartIcon,
    label: "Better visibility for underrepresented workers",
  },
  {
    icon: MapPinIcon,
    label: "Local employment and flexible earning",
  },
  {
    icon: ScaleIcon,
    label: "More objective candidate matching",
  },
  {
    icon: RouteIcon,
    label: "Digital and traceable hiring workflows",
  },
  {
    icon: SparklesIcon,
    label: "Reduced paperwork and unnecessary travel",
  },
] as const

function SocialImpactVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 size-full" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
        <circle cx="1100" cy="140" r="120" fill="var(--brand-orange)" fillOpacity="0.07" />
        <circle cx="160" cy="580" r="100" fill="var(--brand-navy)" fillOpacity="0.05" />
        <path
          d="M0 420 Q360 360 720 400 T1440 380"
          fill="none"
          stroke="var(--brand-navy)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          strokeOpacity="0.12"
        />
      </svg>
    </div>
  )
}

export function LandingSocialImpactSection() {
  return (
    <section id="social-impact" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <SocialImpactVectorBackground />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-orange/[0.04] via-transparent to-brand-navy/[0.03]"
        aria-hidden="true"
      />

      <div className="landing-container relative z-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 border-brand-orange/25 bg-card/80">
            Social impact
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Creating faster and{" "}
            <span className="text-brand-orange">fairer access to work.</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Aplyk is designed to make temporary hiring more transparent and accessible — without
            overstating what technology alone can solve.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <div className="relative h-full">
              <LandingPhoto
                src={landingImages.sections.socialImpact}
                alt="Inclusive group of professionals including a colleague using a wheelchair"
                className="aspect-[4/5] min-h-[22rem] lg:min-h-full lg:aspect-auto"
                overlay="left"
              />
              <div className="absolute top-4 right-4 left-4 rounded-xl border border-white/20 bg-brand-orange/90 px-4 py-3 text-white shadow-lg backdrop-blur-sm sm:top-6 sm:right-6 sm:left-auto sm:max-w-[14rem]">
                <p className="text-[0.625rem] font-semibold tracking-[0.12em] text-white/85 uppercase">
                  For workers
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug">
                  Clearer paths to flexible local work
                </p>
              </div>
              <div className="absolute right-4 bottom-4 left-4 rounded-xl border border-white/20 bg-brand-navy/85 p-4 text-white backdrop-blur-sm">
                <p className="text-xs font-semibold tracking-[0.12em] text-white/70 uppercase">
                  Fair access
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  Technology that opens doors — without overpromising what platforms alone can fix.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5 lg:col-span-7">
            <Reveal delay={80}>
              <div className="grid gap-3 sm:grid-cols-2">
                {socialImpactPoints.map((point, index) => (
                  <div
                    key={point.label}
                    className="group flex h-full items-start gap-3 rounded-2xl border border-border/70 bg-card/95 p-4 backdrop-blur-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        index % 2 === 0
                          ? "bg-brand-orange/12 text-brand-orange group-hover:bg-brand-orange/18"
                          : "bg-brand-navy/10 text-brand-navy group-hover:bg-brand-navy/15"
                      )}
                    >
                      <point.icon className="size-4" />
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{point.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-navy/15 bg-brand-navy/[0.04] p-5">
                  <p className="text-xs font-semibold tracking-[0.12em] text-brand-navy uppercase">
                    For employers
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    More objective matching and traceable workflows reduce bias in who gets seen
                    first — and who gets hired.
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.06] p-5">
                  <p className="text-xs font-semibold tracking-[0.12em] text-brand-orange uppercase">
                    For communities
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Local, flexible work keeps earning closer to home — with less paperwork and
                    fewer unnecessary trips.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="flex flex-col items-start gap-3 rounded-2xl border border-brand-blend/20 bg-brand-blend-soft/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  <span className="font-semibold text-foreground">Impact with honesty.</span> We
                  build tools that improve access and transparency — and stay clear about what
                  still requires human judgment and fair employment practice.
                </p>
                <Badge variant="secondary" className="shrink-0">
                  Transparent by design
                </Badge>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
export function LandingPilotInterestSection() {
  return (
    <section id="pilot-interest" className="scroll-mt-20 border-y bg-muted/30 py-20 sm:py-28">
      <div className="landing-container">
        <Reveal>
          <div className="rounded-2xl border border-border/70 bg-card p-8 text-center sm:p-12">
            <Badge variant="secondary" className="mb-4">
              Built with employers and professionals in mind
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Shaped through real conversations with hiring teams and workers.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Aplyk has been developed alongside employers and professionals exploring better ways
              to fill temporary roles. We focus on practical workflows — not inflated claims or
              invented success stories.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Interested in piloting the platform with your team?{" "}
              <Link to="/register" className="font-medium text-brand-navy underline-offset-4 hover:underline">
                Create an account
              </Link>{" "}
              to get started.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function LandingFinalConversionSection() {
  return (
    <section id="get-started" className="relative min-h-[28rem] scroll-mt-20 overflow-hidden sm:min-h-[32rem]">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={landingImages.sections.finalConversion}
          alt=""
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/92 via-brand-navy/78 to-brand-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-brand-navy/20" />
        <FinalConversionVectorBackground />
      </div>

      <div className="landing-container relative z-10 py-20 sm:py-24 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <Badge className="mb-4 border-white/20 bg-white/12 text-white hover:bg-white/12">
              Get started
            </Badge>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to make temporary work{" "}
              <span className="text-brand-orange">simpler?</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/82">
              Whether you need reliable temporary professionals or want flexible opportunities that
              match your availability, Aplyk helps you move faster.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: SparklesIcon, label: "AI-assisted matching" },
                { icon: ScaleIcon, label: "Verified profiles" },
                { icon: RouteIcon, label: "One connected workflow" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90"
                >
                  <item.icon className="size-3.5 text-brand-orange" aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-brand-orange text-white hover:bg-brand-orange/90"
                asChild
              >
                <Link to="/register">
                  Post your first shift
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/35 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                asChild
              >
                <Link to="/register">Find flexible work</Link>
              </Button>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <Reveal delay={100}>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white">
                    <Building2Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-white/70 uppercase">
                      For companies
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      Fill shifts with less friction
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      Post roles, review matches, confirm teams, and track attendance from one
                      workspace.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-5 w-full border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link to="/register">Create a company account</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange text-white">
                    <UserRoundIcon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-white/70 uppercase">
                      For professionals
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      Work on your terms
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      Discover relevant shifts, apply quickly, and build a trusted profile that
                      travels with you.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="mt-5 w-full bg-brand-orange text-white hover:bg-brand-orange/90"
                  asChild
                >
                  <Link to="/register">Create your profile</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalConversionVectorBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="final-cta-dots" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="white" fillOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="1440" height="640" fill="url(#final-cta-dots)" />
      <path
        d="M1120 -40 L1440 160 L1440 -40 Z"
        fill="var(--brand-orange)"
        fillOpacity="0.14"
        className="landing-companies-vector-drift"
      />
      <g className="landing-companies-vector-pulse" opacity="0.45">
        <circle cx="1180" cy="120" r="56" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
        <circle cx="1180" cy="120" r="30" fill="var(--brand-orange)" fillOpacity="0.12" />
      </g>
      <path
        d="M180 420 C420 360 620 440 860 390 S1180 430 1320 380"
        fill="none"
        stroke="var(--brand-orange)"
        strokeWidth="2"
        strokeDasharray="8 10"
        strokeOpacity="0.35"
        className="landing-companies-vector-flow"
      />
      <circle cx="180" cy="420" r="5" fill="var(--brand-orange)" fillOpacity="0.6" />
      <circle cx="620" cy="410" r="4" fill="white" fillOpacity="0.25" />
      <circle cx="980" cy="400" r="5" fill="var(--brand-orange)" fillOpacity="0.45" />
    </svg>
  )
}

export const expandedFaqs = [
  {
    question: "What is Aplyk?",
    answer:
      "Aplyk is a temporary workforce platform that helps companies post shifts, match with qualified professionals, and manage scheduling, attendance, and ratings in one place.",
  },
  {
    question: "Who can use Aplyk?",
    answer:
      "Companies that hire temporary or shift-based workers, and professionals looking for flexible work opportunities can both use Aplyk.",
  },
  {
    question: "What types of jobs are available?",
    answer:
      "Aplyk supports hospitality, logistics, events, retail, construction, agriculture, and other industries where short-term and shift-based roles are common.",
  },
  {
    question: "How are professionals verified?",
    answer:
      "Aplyk supports identity verification, eligibility checks, business verification, profile screening, attendance records, and two-way ratings to support informed decisions.",
  },
  {
    question: "Who is responsible for the employment contract?",
    answer:
      "The hiring company remains responsible for contracts, payroll, and statutory obligations. Aplyk provides technology and staffing-intermediation tools.",
  },
  {
    question: "How does attendance tracking work?",
    answer:
      "Companies can track shift confirmations, clock-in and clock-out, and attendance records within the platform to maintain operational visibility.",
  },
  {
    question: "Can companies build a preferred-worker network?",
    answer:
      "Yes. After completed shifts, companies can rate workers and build a trusted network of preferred professionals for future assignments.",
  },
  {
    question: "Is Aplyk available in English and Spanish?",
    answer:
      "Aplyk is being built with multilingual support in mind. English is available today, with Spanish language support planned as the platform expands.",
  },
  {
    question: "How is personal information protected?",
    answer:
      "Aplyk is designed with secure handling of personal information. Verification and profile data are managed within controlled platform workflows.",
  },
  {
    question: "How can I join the platform?",
    answer:
      "Create an account to register as a company or professional, complete onboarding, and start posting shifts or discovering opportunities.",
  },
] as const
