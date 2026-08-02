import type { ReactNode } from "react"
import { BadgeCheckIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react"

import { AppLogo } from "@/components/app-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { landingImages } from "@/lib/landing-images"
import { Link } from "@/lib/router"

const authTrustPoints = [
  { icon: ShieldCheckIcon, label: "Secure sign-in" },
  { icon: BadgeCheckIcon, label: "Verified profiles" },
  { icon: SparklesIcon, label: "AI-assisted matching" },
] as const

function AuthPanelVectorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 986 1120"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="auth-panel-dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="var(--brand-navy)" fillOpacity="0.08" />
          </pattern>
          <linearGradient id="auth-panel-wash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-navy)" stopOpacity="0.06" />
            <stop offset="45%" stopColor="var(--brand-orange)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="var(--brand-navy)" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <rect width="986" height="1120" fill="url(#auth-panel-wash)" />
        <rect width="986" height="1120" fill="url(#auth-panel-dots)" />

        <path
          d="M820 -30 L986 140 L986 -30 Z"
          fill="var(--brand-orange)"
          fillOpacity="0.1"
          className="landing-companies-vector-drift"
        />
        <path
          d="M0 920 Q280 860 520 900 T986 880 L986 1120 L0 1120 Z"
          fill="var(--brand-navy)"
          fillOpacity="0.05"
        />

        <g className="landing-companies-vector-pulse" opacity="0.55">
          <circle cx="860" cy="160" r="72" fill="none" stroke="var(--brand-orange)" strokeOpacity="0.18" strokeWidth="1.5" />
          <circle cx="860" cy="160" r="40" fill="var(--brand-orange)" fillOpacity="0.07" />
        </g>

        <g className="landing-companies-vector-pulse" opacity="0.4" style={{ transformOrigin: "120px 920px" }}>
          <circle cx="120" cy="920" r="56" fill="none" stroke="var(--brand-navy)" strokeOpacity="0.14" strokeWidth="1.5" />
          <circle cx="120" cy="920" r="28" fill="var(--brand-navy)" fillOpacity="0.06" />
        </g>

        <g opacity="0.5">
          <path
            d="M100 520 C280 460 420 540 600 490 S860 520 920 480"
            fill="none"
            stroke="var(--brand-blend)"
            strokeWidth="2"
            strokeDasharray="8 10"
            className="landing-companies-vector-flow"
          />
          <circle cx="100" cy="520" r="5" fill="var(--brand-orange)" fillOpacity="0.55" />
          <circle cx="380" cy="505" r="4" fill="var(--brand-navy)" fillOpacity="0.3" />
          <circle cx="620" cy="495" r="5" fill="var(--brand-orange)" fillOpacity="0.4" />
          <circle cx="920" cy="480" r="6" fill="var(--brand-navy)" fillOpacity="0.22" />
        </g>

        <g opacity="0.32" className="landing-companies-vector-drift-reverse">
          <rect x="72" y="240" width="140" height="88" rx="14" fill="var(--brand-navy)" fillOpacity="0.06" />
          <rect x="88" y="256" width="88" height="8" rx="4" fill="var(--brand-orange)" fillOpacity="0.22" />
          <rect x="88" y="272" width="64" height="6" rx="3" fill="var(--brand-navy)" fillOpacity="0.14" />
          <rect x="88" y="286" width="76" height="6" rx="3" fill="var(--brand-navy)" fillOpacity="0.1" />
        </g>

        <g opacity="0.28" className="landing-companies-vector-drift">
          <rect x="780" y="760" width="120" height="76" rx="12" fill="var(--brand-navy)" fillOpacity="0.06" />
          <rect x="796" y="776" width="72" height="7" rx="3.5" fill="var(--brand-orange)" fillOpacity="0.2" />
          <rect x="796" y="790" width="56" height="6" rx="3" fill="var(--brand-navy)" fillOpacity="0.12" />
        </g>
      </svg>
    </div>
  )
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <img
          src={landingImages.authPanel}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--palette-ink)]/96 via-[var(--palette-ink)]/55 to-[var(--palette-ink)]/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[var(--palette-rust)]/10 via-transparent to-[var(--palette-sand)]/20"
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Link
            to="/"
            className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-xl border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-md transition-[border-color,background-color,transform] hover:border-white/30 hover:bg-white/15"
            aria-label="Aplyk home"
          >
            <span
              className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-orange via-white/80 to-brand-orange/60 opacity-90"
              aria-hidden="true"
            />
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/95 p-2 shadow-sm transition-transform group-hover:scale-[1.02]">
              <img
                src="/aplyk-logo.png"
                alt=""
                aria-hidden="true"
                className="h-6 w-auto object-contain"
              />
            </span>
            <span className="flex min-w-0 flex-col pr-1">
              <span className="text-sm font-semibold tracking-tight text-white">Aplyk</span>
              <span className="text-[0.625rem] font-medium tracking-[0.14em] text-white/70 uppercase">
                Workforce platform
              </span>
            </span>
          </Link>

          <div className="max-w-md">
            <p className="font-heading text-3xl font-semibold tracking-tight text-balance">
              Turn every application into a clear next step.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/82">
              Keep opportunities, interviews, and follow-ups together in one
              calm workspace.
            </p>
          </div>

          <p className="text-xs text-white/65">
            Find work that fits your skills, schedule, and goals.
          </p>
        </div>
      </section>

      <section className="relative flex min-h-svh flex-col overflow-hidden bg-background lg:min-h-0">
        <AuthPanelVectorBackground />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blend-soft/35 via-background/70 to-background/88"
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center justify-end px-6 pt-6 md:px-10">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Back to home
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-8 md:px-10 md:py-10">
          <div className="w-full max-w-[26rem]">
            <div className="overflow-hidden rounded-2xl border border-brand-navy/10 bg-card/95 shadow-[var(--shadow-card)] backdrop-blur-sm">
              <div
                className="h-1 bg-gradient-to-r from-brand-navy via-brand-blend to-brand-orange"
                aria-hidden="true"
              />
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex justify-center">
                  <AppLogo to="/" />
                </div>
                {children}
              </div>
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {authTrustPoints.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 text-center text-xs font-medium text-muted-foreground backdrop-blur-sm"
                >
                  <item.icon className="size-3.5 shrink-0 text-brand-orange" aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
