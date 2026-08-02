import type { ComponentType, ReactNode } from "react"

type ResourcePageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  action?: ReactNode
}

export function ResourcePageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
}: ResourcePageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-blend-soft text-brand-navy">
          <Icon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {action}
    </header>
  )
}
