import { cn } from "@/lib/utils"
import { Link } from "@/lib/router"

type AppLogoProps = {
  compact?: boolean
  className?: string
  to?: string
}

export function AppLogo({
  compact = false,
  className,
  to = "/dashboard",
}: AppLogoProps) {
  return (
    <Link
      to={to}
      className={cn("flex min-w-0 items-center", className)}
      aria-label="Aplyk home"
    >
      <img
        src="/aplyk-logo.png"
        alt="Aplyk"
        className={cn(
          "h-auto w-auto object-contain",
          compact ? "h-7 max-w-[5.5rem]" : "h-8 max-w-[7.5rem]"
        )}
      />
    </Link>
  )
}
