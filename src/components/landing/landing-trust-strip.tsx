import { BadgeCheckIcon, EyeIcon, SparklesIcon, TimerIcon } from "lucide-react"

import { Reveal } from "@/components/reveal"

const trustBenefits = [
  {
    icon: TimerIcon,
    title: "Faster temporary hiring",
    description: "Reach available professionals when urgency matters.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified professional profiles",
    description: "Identity, eligibility, and work history in one place.",
  },
  {
    icon: SparklesIcon,
    title: "AI-assisted matching",
    description: "Recommendations based on skills, location, and reliability.",
  },
  {
    icon: EyeIcon,
    title: "Complete shift visibility",
    description: "Scheduling, attendance, and status from one workspace.",
  },
] as const

export function LandingTrustStrip() {
  return (
    <section aria-label="Platform benefits" className="border-b bg-card/60">
      <div className="landing-container grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y md:grid-cols-4 md:divide-x md:divide-y-0">
        {trustBenefits.map((item, index) => (
          <Reveal key={item.title} delay={index * 60} className="px-4 py-7 sm:px-6">
            <div className="flex flex-col gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl border border-brand-navy/10 bg-brand-blend-soft text-brand-navy">
                <item.icon className="size-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
