import type { ComponentType } from "react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricStatVariant = "rings" | "waves" | "grid"

function StatVectorBackground({ variant }: { variant: MetricStatVariant }) {
  if (variant === "rings") {
    return (
      <>
        <svg
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 size-36 text-brand-navy/12 dark:text-brand-orange/10"
          viewBox="0 0 144 144"
          fill="none"
        >
          <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="72" cy="72" r="44" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="72" cy="72" r="24" fill="currentColor" className="opacity-40" />
        </svg>
        <svg
          aria-hidden
          className="pointer-events-none absolute right-4 bottom-0 size-24 text-brand-orange/18 dark:text-brand-orange/12"
          viewBox="0 0 96 96"
          fill="currentColor"
        >
          <path d="M48 8c22 18 34 34 34 48s-12 30-34 40C28 86 16 70 16 56S26 26 48 8Z" />
        </svg>
      </>
    )
  }

  if (variant === "waves") {
    return (
      <>
        <svg
          aria-hidden
          className="pointer-events-none absolute -right-4 -bottom-6 h-28 w-full max-w-[220px] text-brand-orange/14 dark:text-brand-orange/10"
          viewBox="0 0 220 112"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 72C36 48 72 88 110 64C148 40 184 80 220 56V112H0V72Z"
            fill="currentColor"
          />
          <path
            d="M0 88C40 68 80 96 120 72C160 48 190 84 220 68V112H0V88Z"
            fill="currentColor"
            className="opacity-60"
          />
        </svg>
        <svg
          aria-hidden
          className="pointer-events-none absolute top-3 right-3 size-16 text-brand-navy/10 dark:text-brand-navy/15"
          viewBox="0 0 64 64"
          fill="none"
        >
          <path
            d="M8 32h48M32 8v48"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </>
    )
  }

  return (
    <>
      <svg
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 size-40 text-brand-sand/25 dark:text-brand-pine/15"
        viewBox="0 0 160 160"
        fill="currentColor"
      >
        {[
          [24, 24],
          [56, 24],
          [88, 24],
          [24, 56],
          [56, 56],
          [88, 56],
          [24, 88],
          [56, 88],
          [88, 88],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" className="opacity-70" />
        ))}
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-28 text-brand-pine/8 dark:text-brand-sand/8"
        viewBox="0 0 112 112"
        fill="none"
      >
        <path
          d="M112 0C84 28 56 14 28 42C14 56 0 84 0 112"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M112 28C92 48 64 34 42 56C28 70 14 92 0 112"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-60"
        />
      </svg>
    </>
  )
}

export function MetricStatCard({
  label,
  value,
  icon: Icon,
  variant = "rings",
  className,
}: {
  label: string
  value: number
  icon: ComponentType<{ className?: string }>
  variant?: MetricStatVariant
  className?: string
}) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <StatVectorBackground variant={variant} />
      <CardContent className="relative z-10 flex min-h-28 flex-col justify-between gap-4 py-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand-blend-soft text-brand-navy ring-1 ring-[color-mix(in_oklch,var(--brand-navy)_20%,var(--brand-orange)_12%)] backdrop-blur-[1px]">
          <Icon className="size-4" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
            {label}
          </p>
          <p className="font-heading text-3xl font-semibold tracking-tight">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
