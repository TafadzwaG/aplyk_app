import {
  ArrowRightIcon,
  BadgeCheckIcon,
  Clock3Icon,
  EyeIcon,
  MapPinIcon,
  MenuIcon,
  PlayIcon,
  SparklesIcon,
  StarIcon,
  ZapIcon,
} from "lucide-react"

import { AppLogo } from "@/components/app-logo"
import { CompaniesSection } from "@/components/companies-section"
import {
  expandedFaqs,
  LandingFinalConversionSection,
  LandingPilotInterestSection,
  LandingSocialImpactSection,
} from "@/components/landing/landing-closing-sections"
import {
  LandingCompanyBenefitsSection,
  LandingIndustriesSection,
  LandingWorkerBenefitsSection,
} from "@/components/landing/landing-industries-benefits"
import {
  LandingAiMatchingSection,
  LandingShiftManagementSection,
  LandingVerificationSection,
} from "@/components/landing/landing-platform-features"
import {
  LandingPlatformJourneySection,
  LandingProblemSection,
} from "@/components/landing/landing-problem-journey"
import { LandingHowItWorksSection } from "@/components/landing/landing-how-it-works"
import { LandingTrustStrip } from "@/components/landing/landing-trust-strip"
import { HeroImageShowcase, HeroSlideControls, useHeroSlides } from "@/components/hero-image-showcase"
import { MobileAppShowcase } from "@/components/mobile-app-showcase"
import { WorkersSection } from "@/components/workers-section"
import { Reveal } from "@/components/reveal"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from "@/lib/router"

const navigation = [
  { label: "For companies", href: "#companies" },
  { label: "For workers", href: "#workers" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Industries", href: "#industries" },
  { label: "Mobile app", href: "#mobile-app" },
  { label: "FAQ", href: "#faq" },
]

const heroTrustIndicators = [
  { icon: SparklesIcon, label: "AI-assisted matching" },
  { icon: BadgeCheckIcon, label: "Verified professionals" },
  { icon: EyeIcon, label: "Real-time shift management" },
] as const

const faqs = [
  {
    question: "How does Aplyk match companies and workers?",
    answer:
      "Aplyk compares role requirements with worker skills, availability, location, reliability, and previous ratings, then surfaces the strongest available matches.",
  },
  {
    question: "How quickly can a company fill a shift?",
    answer:
      "Urgent shifts can reach qualified workers immediately. The exact fill time depends on the role, location, requirements, and worker availability.",
  },
  {
    question: "Does Aplyk employ or pay the workers?",
    answer:
      "No. Aplyk is the technology layer for matching and workforce operations. The hiring company remains responsible for contracts, payroll, and statutory obligations.",
  },
  {
    question: "Can workers choose which shifts they accept?",
    answer:
      "Yes. Workers can review the role, location, timing, and requirements before choosing whether to accept an opportunity.",
  },
]

const allFaqs = [
  ...faqs,
  ...expandedFaqs.filter(
    (item) => !faqs.some((existing) => existing.question === item.question)
  ),
]

function ReadyCtaVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden="true">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1120 280"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ready-cta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-navy)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="var(--brand-orange)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="var(--brand-navy)" stopOpacity="0.04" />
          </linearGradient>
          <pattern id="ready-cta-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="var(--brand-navy)" fillOpacity="0.07" />
          </pattern>
        </defs>

        <rect width="1120" height="280" fill="url(#ready-cta-gradient)" />
        <rect width="1120" height="280" fill="url(#ready-cta-dots)" />

        <path
          d="M920 -20 L1120 120 L1120 -20 Z"
          fill="var(--brand-orange)"
          fillOpacity="0.1"
          className="landing-companies-vector-drift"
        />
        <path
          d="M0 220 Q280 180 560 210 T1120 190 L1120 280 L0 280 Z"
          fill="var(--brand-navy)"
          fillOpacity="0.04"
        />

        <g className="landing-companies-vector-pulse" opacity="0.5">
          <circle cx="980" cy="72" r="44" fill="none" stroke="var(--brand-orange)" strokeOpacity="0.18" strokeWidth="1.5" />
          <circle cx="980" cy="72" r="24" fill="var(--brand-orange)" fillOpacity="0.06" />
        </g>

        <g opacity="0.45">
          <path
            d="M80 140 C240 100, 360 170, 520 130 S760 150, 920 110"
            fill="none"
            stroke="var(--brand-blend)"
            strokeWidth="2"
            strokeDasharray="8 10"
            className="landing-companies-vector-flow"
          />
          <circle cx="80" cy="140" r="5" fill="var(--brand-orange)" fillOpacity="0.55" />
          <circle cx="360" cy="155" r="4" fill="var(--brand-navy)" fillOpacity="0.3" />
          <circle cx="640" cy="135" r="5" fill="var(--brand-orange)" fillOpacity="0.4" />
          <circle cx="920" cy="110" r="6" fill="var(--brand-navy)" fillOpacity="0.22" />
        </g>

        <g opacity="0.32" className="landing-companies-vector-drift-reverse">
          <rect x="72" y="48" width="120" height="72" rx="12" fill="var(--brand-navy)" fillOpacity="0.06" />
          <rect x="88" y="64" width="72" height="8" rx="4" fill="var(--brand-orange)" fillOpacity="0.22" />
          <rect x="88" y="80" width="56" height="6" rx="3" fill="var(--brand-navy)" fillOpacity="0.14" />
          <rect x="88" y="94" width="64" height="6" rx="3" fill="var(--brand-navy)" fillOpacity="0.1" />
        </g>
      </svg>
    </div>
  )
}

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="landing-container flex h-16 items-center gap-6">
        <AppLogo to="/" />

        <nav
          className="ml-auto hidden items-center gap-6 md:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">
              Get started
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Open navigation"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Explore Aplyk</SheetTitle>
                <SheetDescription>
                  Choose a section or continue to your account.
                </SheetDescription>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 px-4"
                aria-label="Mobile navigation"
              >
                {navigation.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <a
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild>
                    <Link to="/register">Create an account</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function HeroProductPreview() {
  return (
    <div className="landing-product-preview relative w-full max-w-sm">
      <div className="landing-glow absolute inset-6 rounded-full bg-primary/20 blur-3xl" />
      <Card className="relative border-white/20 bg-background/92 shadow-elevated backdrop-blur-md">
        <CardHeader>
          <Badge variant="secondary">
            <ZapIcon data-icon="inline-start" />
            Live matching
          </Badge>
          <CardTitle>Warehouse support · Evening</CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <MapPinIcon className="size-3.5" />
            Cape Town · Today, 18:00–23:00
          </CardDescription>
          <CardAction>
            <Badge variant="outline">12 matches</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AvatarGroup>
                <Avatar>
                  <AvatarFallback>LM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>TK</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AN</AvatarFallback>
                </Avatar>
              </AvatarGroup>
              <div>
                <p className="text-sm font-medium">Top matches notified</p>
                <p className="text-xs text-muted-foreground">
                  Skills and availability verified
                </p>
              </div>
            </div>
            <Badge>Live</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Shift capacity</span>
              <span className="font-medium">4 of 5 confirmed</span>
            </div>
            <Progress value={80} />
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            Updated moments ago
          </span>
          <Button size="sm" asChild>
            <Link to="/register">Review matches</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card
        size="sm"
        className="landing-float-card landing-float-card-top absolute -top-10 -right-3 hidden w-52 border-white/20 bg-background/92 shadow-elevated backdrop-blur-md lg:flex"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BadgeCheckIcon className="size-4" />
            </span>
            Filled instantly
          </CardTitle>
          <CardDescription>Top-rated professional confirmed.</CardDescription>
        </CardHeader>
      </Card>

      <Card
        size="sm"
        className="landing-float-card landing-float-card-bottom absolute -bottom-12 -left-4 hidden w-52 border-white/20 bg-background/92 shadow-elevated backdrop-blur-md lg:flex"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock3Icon className="size-4" />
            </span>
            Clock-in verified
          </CardTitle>
          <CardDescription>On site at 17:58 · GPS confirmed.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export function WelcomePage() {
  const { active, setActive, slide } = useHeroSlides()

  return (
    <div className="min-h-svh overflow-clip bg-background">
      <MarketingHeader />

      <main>
        <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden border-b">
          <HeroImageShowcase fullBleed showControls={false} active={active} onActiveChange={setActive} />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-brand-navy/52"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-brand-navy/78 via-brand-navy/48 to-brand-navy/28"
            aria-hidden="true"
          />
          <div className="landing-grid pointer-events-none absolute inset-0 z-[1] opacity-[0.07]" />

          <div className="landing-container relative z-10 grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16 lg:py-20">
            <div className="landing-hero-copy flex max-w-3xl flex-col items-start gap-6">
              <Badge className="border-white/20 bg-white/12 text-white hover:bg-white/12">
                <SparklesIcon data-icon="inline-start" />
                AI-powered temporary workforce platform
              </Badge>
              <div className="flex flex-col gap-5">
                <h1 className="max-w-3xl text-5xl leading-[0.96] font-semibold tracking-[-0.045em] text-balance text-white sm:text-6xl lg:text-7xl">
                  The right people,{" "}
                  <span className="text-brand-orange">exactly when work happens.</span>
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                  Create shifts, reach qualified professionals, and manage every
                  confirmation from one calm, intelligent workspace.
                </p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Platform trust indicators">
                {heroTrustIndicators.map((item) => (
                  <li
                    key={item.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90"
                  >
                    <item.icon className="size-3.5 text-brand-orange" aria-hidden="true" />
                    {item.label}
                  </li>
                ))}
              </ul>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button size="lg" className="bg-white text-brand-navy hover:bg-white/90" asChild>
                  <Link to="/register">
                    Start hiring
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/5 text-white hover:bg-white/12 hover:text-white"
                  asChild
                >
                  <a href="#how-it-works">
                    <PlayIcon data-icon="inline-start" />
                    See how it works
                  </a>
                </Button>
              </div>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                <AvatarGroup>
                  <Avatar className="ring-white/20">
                    <AvatarFallback>NW</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-white/20">
                    <AvatarFallback>KM</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-white/20">
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </AvatarGroup>
                <p className="text-sm text-white/72">
                  Trusted by growing teams and reliable professionals.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 border-t border-white/15 pt-5 sm:max-w-md">
                <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/60 uppercase">
                  Built for every shift
                </p>
                <div className="flex items-center justify-between gap-4">
                  <p key={slide.label} className="landing-hero-label text-base font-semibold text-white sm:text-lg">
                    {slide.label}
                  </p>
                  <HeroSlideControls active={active} onSelect={setActive} />
                </div>
              </div>
            </div>

            <div className="landing-hero-preview relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <HeroProductPreview />
            </div>
          </div>
        </section>

        <LandingTrustStrip />

        <section aria-label="Platform statistics" className="border-b">
          <div className="landing-container grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
            {[
              ["38 sec", "fastest confirmation"],
              ["24/7", "platform availability"],
              ["4.8/5", "average worker rating"],
              ["100%", "mobile-ready workflows"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="flex flex-col gap-1 px-4 py-8 text-center"
              >
                <p className="font-heading text-2xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <LandingProblemSection />

        <MobileAppShowcase />

        <CompaniesSection />

        <LandingCompanyBenefitsSection />

        <WorkersSection />

        <LandingWorkerBenefitsSection />

        <LandingPlatformJourneySection />

        <LandingAiMatchingSection />

        <LandingVerificationSection />

        <LandingShiftManagementSection />

        <LandingIndustriesSection />

        <LandingHowItWorksSection />

        <LandingSocialImpactSection />

        <section className="border-y bg-muted/30 py-24">
          <div className="landing-container">
            <Reveal>
              <Card>
                <CardContent className="grid gap-10 pt-2 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="flex flex-col gap-5">
                    <div
                      className="flex gap-1 text-primary"
                      aria-label="Five star rating"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} className="size-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="font-heading text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
                      “We stopped chasing updates across five different
                      channels. Now the whole shift is visible from one screen.”
                    </blockquote>
                    <div>
                      <p className="text-sm font-medium">Naledi Mokoena</p>
                      <p className="text-sm text-muted-foreground">
                        Operations lead, Northstar Logistics
                      </p>
                    </div>
                  </div>
                  <Avatar className="size-20">
                    <AvatarFallback>NM</AvatarFallback>
                  </Avatar>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </section>

        <LandingPilotInterestSection />

        <section id="faq" className="scroll-mt-20 py-24 sm:py-32">
          <div className="landing-container grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <Reveal className="flex flex-col items-start gap-4">
              <Badge variant="outline">Support & answers</Badge>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Questions, answered clearly.
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                The essentials about using Aplyk for temporary workforce
                operations.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <Accordion type="single" collapsible defaultValue="item-0">
                {allFaqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-6 text-muted-foreground">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        <section className="pb-8">
          <Reveal className="landing-container">
            <Card className="relative overflow-hidden border border-brand-navy/10">
              <ReadyCtaVectorBackground />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/80"
                aria-hidden="true"
              />
              <CardContent className="relative z-10 flex flex-col items-start gap-8 py-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <Badge variant="secondary">Ready when you are</Badge>
                  <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                    Build a workforce that moves at the speed of your business.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Start with one shift and experience a clearer way to source
                    and manage temporary teams.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Get started
                      <ArrowRightIcon data-icon="inline-end" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>

        <LandingFinalConversionSection />
      </main>

      <footer className="border-t">
        <div className="landing-container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex max-w-sm flex-col items-start gap-4 md:col-span-2 lg:col-span-1">
            <AppLogo to="/" />
            <p className="text-sm leading-6 text-muted-foreground">
              Intelligent temporary workforce operations for companies and
              professionals.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <p className="font-medium">For companies</p>
            <a href="#companies" className="text-muted-foreground hover:text-foreground">
              Company features
            </a>
            <a href="#company-benefits" className="text-muted-foreground hover:text-foreground">
              Benefits
            </a>
            <a href="#industries" className="text-muted-foreground hover:text-foreground">
              Industries
            </a>
            <Link to="/register" className="text-muted-foreground hover:text-foreground">
              Post a shift
            </Link>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <p className="font-medium">For professionals</p>
            <a href="#workers" className="text-muted-foreground hover:text-foreground">
              Worker features
            </a>
            <a href="#worker-benefits" className="text-muted-foreground hover:text-foreground">
              Benefits
            </a>
            <a href="#mobile-app" className="text-muted-foreground hover:text-foreground">
              Mobile app
            </a>
            <Link to="/register" className="text-muted-foreground hover:text-foreground">
              Find work
            </Link>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <p className="font-medium">Platform</p>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
              How it works
            </a>
            <a href="#platform-journey" className="text-muted-foreground hover:text-foreground">
              Full journey
            </a>
            <a href="#verification" className="text-muted-foreground hover:text-foreground">
              Verification
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </a>
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link to="/register" className="text-muted-foreground hover:text-foreground">
              Create account
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
              Open dashboard
            </Link>
          </div>
        </div>
        <Separator />
        <div className="landing-container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Aplyk. All rights reserved.</p>
          <p>Built for fast, reliable workforce operations.</p>
        </div>
      </footer>
    </div>
  )
}
