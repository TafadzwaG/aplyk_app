/* eslint-disable react-refresh/only-export-components */
import {
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiRequestError, meApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { AvailableContext, UserContexts } from "@/types/api"

export function normalizeContextKind(kind: AvailableContext["kind"]) {
  return kind === "Professional" || kind === 1 ? "Professional" : "Company"
}

export function toActiveContextKind(kind: AvailableContext["kind"]): 1 | 2 {
  return normalizeContextKind(kind) === "Professional" ? 1 : 2
}

function formatRole(role: string) {
  return role
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function isActiveContext(
  context: AvailableContext,
  active: UserContexts["activeContext"]
) {
  if (!active) return false

  const contextKind = normalizeContextKind(context.kind)
  const activeKind = normalizeContextKind(active.kind)

  if (contextKind === "Professional") {
    return activeKind === "Professional"
  }

  return (
    activeKind === "Company" &&
    context.companyId !== null &&
    active.companyId === context.companyId
  )
}

function ContextIcon({ kind }: { kind: AvailableContext["kind"] }) {
  if (normalizeContextKind(kind) === "Professional") {
    return <BriefcaseBusiness className="size-5" />
  }

  return <Building2 className="size-5" />
}

type ContextsPanelProps = {
  contexts: UserContexts | null
  isLoading: boolean
  switchingKey?: string | null
  onSelect?: (context: AvailableContext) => void | Promise<void>
  title?: string
  description?: string
  className?: string
}

function contextKey(context: AvailableContext) {
  return `${context.kind}-${context.companyId ?? context.professionalProfileId ?? context.membershipId}`
}

export function ContextsPanel({
  contexts,
  isLoading,
  switchingKey = null,
  onSelect,
  title = "Your contexts",
  description = "Select a workspace to continue into Aplyk.",
  className,
}: ContextsPanelProps) {
  const items = contexts?.availableContexts ?? []

  if (isLoading) {
    return (
      <section className={cn("mx-auto w-full max-w-3xl", className)}>
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </section>
    )
  }

  if (!items.length) return null

  return (
    <section className={cn("mx-auto w-full max-w-3xl", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 size-36 rounded-full bg-primary/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-accent/40 blur-2xl"
        />

        <div className="relative border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <Users className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {items.length} available
            </Badge>
          </div>
        </div>

        <div className="relative grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
          {items.map((context) => {
            const key = contextKey(context)
            const active = isActiveContext(
              context,
              contexts?.activeContext ?? null
            )
            const contextKind = normalizeContextKind(context.kind)
            const isSwitching = switchingKey === key
            const isInteractive = Boolean(onSelect)

            const content = (
              <>
                {active ? (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                    <Sparkles className="size-3" />
                    Active
                  </div>
                ) : null}

                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
                      contextKind === "Professional"
                        ? "bg-secondary text-secondary-foreground ring-border/60"
                        : "bg-accent/50 text-accent-foreground ring-border/60"
                    )}
                  >
                    <ContextIcon kind={context.kind} />
                  </div>

                  <div className="min-w-0 flex-1 pr-12">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {context.displayName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {contextKind === "Professional"
                        ? "Professional profile"
                        : context.role
                          ? `${formatRole(String(context.role))} access`
                          : "Company workspace"}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[11px]">
                        {contextKind}
                      </Badge>
                      {isInteractive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                          {isSwitching ? (
                            <>
                              <Loader2 className="size-3 animate-spin" />
                              Opening...
                            </>
                          ) : (
                            <>
                              Continue
                              <ChevronRight className="size-3" />
                            </>
                          )}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {active && !isInteractive ? (
                  <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                    <CheckCircle2 className="size-3.5" />
                    Currently selected in this session
                  </div>
                ) : null}
              </>
            )

            if (!isInteractive) {
              return (
                <div
                  key={key}
                  className={cn(
                    "relative overflow-hidden rounded-xl border p-4 transition-colors",
                    active
                      ? "border-primary/30 bg-primary/5 shadow-sm"
                      : "border-border/70 bg-muted/20"
                  )}
                >
                  {content}
                </div>
              )
            }

            return (
              <button
                key={key}
                type="button"
                disabled={Boolean(switchingKey)}
                onClick={() => void onSelect?.(context)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-4 text-left transition-all",
                  active
                    ? "border-primary/30 bg-primary/5 shadow-sm"
                    : "border-border/70 bg-muted/20 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm",
                  isSwitching && "opacity-80"
                )}
              >
                {content}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export async function switchToContext(context: AvailableContext) {
  const kind = toActiveContextKind(context.kind)

  if (kind === 2 && !context.membershipId) {
    throw new ApiRequestError("This company workspace cannot be selected.", 400)
  }

  return meApi.setActiveContext({
    kind,
    membershipId: kind === 2 ? context.membershipId : null,
  })
}

export { contextKey }
