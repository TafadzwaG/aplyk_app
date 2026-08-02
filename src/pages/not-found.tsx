import { ArrowLeftIcon } from "lucide-react"

import { AppLogo } from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { Link } from "@/lib/router"

export function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <AppLogo />
      <div>
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you requested does not exist in this starter.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">
          <ArrowLeftIcon data-icon="inline-start" />
          Back to dashboard
        </Link>
      </Button>
    </main>
  )
}
