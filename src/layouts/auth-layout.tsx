import type { ReactNode } from "react"

import { AppLogo } from "@/components/app-logo"
import { ThemeToggle } from "@/components/theme-toggle"

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <img
          src="/images/auth-job-seeker.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
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
          <div className="w-fit rounded-lg bg-white/95 p-2.5 shadow-sm">
            <AppLogo to="/" />
          </div>

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

      <section className="relative flex items-center justify-center p-6 md:p-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  )
}
