/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Check } from "lucide-react"

import { AppLogo } from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Link } from "@/lib/router"
import { cn } from "@/lib/utils"

const steps = [
  { id: "welcome", label: "Welcome", description: "Choose your path" },
  { id: "setup", label: "Setup", description: "Company details" },
  { id: "security", label: "Security", description: "Verify identity" },
  { id: "invite", label: "Invite", description: "Build your team" },
] as const

export type OnboardingStep = (typeof steps)[number]["id"]

type OnboardingHubLayoutProps = {
  activeStep?: OnboardingStep
  children: React.ReactNode
  showHeader?: boolean
}

function getStepIndex(step: OnboardingStep) {
  return steps.findIndex((item) => item.id === step)
}

export function OnboardingHubLayout({
  activeStep = "welcome",
  children,
  showHeader = true,
}: OnboardingHubLayoutProps) {
  const activeIndex = getStepIndex(activeStep)
  const progressValue = ((activeIndex + 1) / steps.length) * 100
  const currentStep = steps[activeIndex]

  return (
    <div className="onboarding-shell flex min-h-svh flex-col">
      {showHeader ? (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 backdrop-blur-md">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <AppLogo to="/onboarding" className="hidden sm:flex" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    Onboarding Hub
                  </p>
                  <p className="truncate text-xs text-muted-foreground md:hidden">
                    Step {activeIndex + 1} of {steps.length} ·{" "}
                    {currentStep.label}
                  </p>
                </div>
              </div>

              <nav
                aria-label="Onboarding progress"
                className="hidden items-center gap-1 md:flex"
              >
                {steps.map((step, index) => {
                  const isComplete = index < activeIndex
                  const isActive = step.id === activeStep

                  return (
                    <React.Fragment key={step.id}>
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                          isActive && "bg-primary/10 text-foreground",
                          isComplete && "text-muted-foreground",
                          !isActive && !isComplete && "text-muted-foreground/70"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full text-[10px] font-semibold",
                            isActive && "bg-primary text-primary-foreground",
                            isComplete && "bg-foreground/10 text-foreground",
                            !isActive &&
                              !isComplete &&
                              "bg-muted text-muted-foreground"
                          )}
                        >
                          {isComplete ? (
                            <Check className="size-3" strokeWidth={3} />
                          ) : (
                            index + 1
                          )}
                        </span>
                        <span>{step.label}</span>
                      </div>
                      {index < steps.length - 1 ? (
                        <span
                          aria-hidden
                          className={cn(
                            "h-px w-6",
                            index < activeIndex ? "bg-primary/40" : "bg-border"
                          )}
                        />
                      ) : null}
                    </React.Fragment>
                  )
                })}
              </nav>

              <Button size="sm" className="shrink-0 shadow-sm">
                Save progress
              </Button>
            </div>

            <Progress
              value={progressValue}
              className="mb-0 h-0.5 rounded-none"
            />
          </div>
        </header>
      ) : null}

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="mt-auto border-t border-border/70 bg-card/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5">
            <AppLogo to="/" className="h-5" compact />
            <span>© 2024 Aplyk. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="#" className="transition-colors hover:text-foreground">
              Legal
            </Link>
            <Link to="#" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="#" className="transition-colors hover:text-foreground">
              Support Center
            </Link>
            <Link to="#" className="transition-colors hover:text-foreground">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export { steps as onboardingSteps }
