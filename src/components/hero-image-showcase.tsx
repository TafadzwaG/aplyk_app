import * as React from "react"

import { cn } from "@/lib/utils"

const SLIDE_INTERVAL_MS = 5200

export const heroSlides = [
  {
    src: "/images/hero/hero-warehouse.png",
    label: "Logistics & warehousing",
    alt: "Warehouse team confirming a shift handover",
  },
  {
    src: "/images/hero/hero-events.png",
    label: "Events & venues",
    alt: "Event crew coordinating setup with a tablet",
  },
  {
    src: "/images/hero/hero-workforce.png",
    label: "Multi-sector workforce",
    alt: "Professionals across healthcare, construction, and hospitality",
  },
  {
    src: "/images/hero/hero-hospitality.png",
    label: "Hospitality & front-of-house",
    alt: "Hotel team welcoming a colleague on shift",
  },
  {
    src: "/images/hero/hero-retail.png",
    label: "Retail & local business",
    alt: "Inclusive retail team greeting a confirmed worker",
  },
] as const

type HeroImageShowcaseProps = {
  className?: string
  fullBleed?: boolean
  showControls?: boolean
  active?: number
  onActiveChange?: (index: number) => void
}

export function HeroImageShowcase({
  className,
  fullBleed = false,
  showControls = true,
  active: controlledActive,
  onActiveChange,
}: HeroImageShowcaseProps) {
  const [internalActive, setInternalActive] = React.useState(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)
  const active = controlledActive ?? internalActive

  const setActive = React.useCallback(
    (index: number) => {
      if (onActiveChange) onActiveChange(index)
      else setInternalActive(index)
    },
    [onActiveChange]
  )

  React.useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  React.useEffect(() => {
    if (reduceMotion || controlledActive !== undefined) return
    const timer = window.setInterval(() => {
      setInternalActive((current) => (current + 1) % heroSlides.length)
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [controlledActive, reduceMotion])

  const slide = heroSlides[active]

  return (
    <div
      className={cn(
        "landing-hero-showcase overflow-hidden bg-brand-navy",
        fullBleed
          ? "absolute inset-0 h-full w-full"
          : "relative aspect-[4/5] w-full rounded-2xl border border-border/60 shadow-[0_24px_80px_color-mix(in_oklab,var(--brand-navy)_28%,transparent)] sm:aspect-[5/6] lg:aspect-auto lg:min-h-[min(72vh,720px)]",
        className
      )}
      aria-label="Workforce scenes across industries"
      aria-hidden={fullBleed}
    >
      {!fullBleed && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-brand-orange/35 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-0 right-0 z-20 h-24 w-24 bg-brand-orange/90"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
            aria-hidden="true"
          />
        </>
      )}

      {heroSlides.map((item, index) => {
        const isActive = index === active
        return (
          <div
            key={item.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out",
              isActive ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={!isActive}
          >
            <img
              src={item.src}
              alt={isActive && !fullBleed ? item.alt : ""}
              className={cn(
                "h-full w-full object-cover object-center",
                isActive && !reduceMotion && "landing-hero-slide-active"
              )}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        )
      })}

      {!fullBleed && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/55 via-brand-navy/10 to-transparent" />
      )}

      {showControls && !fullBleed && (
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/70 uppercase">
                Built for every shift
              </p>
              <p
                key={slide.label}
                className="landing-hero-label mt-1 text-lg font-semibold text-white sm:text-xl"
              >
                {slide.label}
              </p>
            </div>
            <HeroSlideControls active={active} onSelect={setActive} />
          </div>
        </div>
      )}
    </div>
  )
}

export function HeroSlideControls({
  active,
  onSelect,
  className,
}: {
  active: number
  onSelect: (index: number) => void
  className?: string
}) {
  return (
    <div className={cn("flex shrink-0 gap-1.5", className)} role="tablist" aria-label="Hero scenes">
      {heroSlides.map((item, index) => (
        <button
          key={item.src}
          type="button"
          role="tab"
          aria-selected={index === active}
          aria-label={item.label}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            index === active ? "w-7 bg-brand-orange" : "w-1.5 bg-white/35 hover:bg-white/55"
          )}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  )
}

export function useHeroSlides() {
  const [active, setActive] = React.useState(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  React.useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length)
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [reduceMotion])

  return { active, setActive, slide: heroSlides[active], reduceMotion }
}
