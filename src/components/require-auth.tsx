import * as React from "react"

import { useAuth } from "@/contexts/auth-context"
import { rememberReturnUrl } from "@/lib/auth"
import { useNavigate } from "@/lib/router"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, profile } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !profile)) {
      rememberReturnUrl(window.location.pathname)
      navigate("/login", { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, profile])

  if (isLoading || !isAuthenticated || !profile) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading your session...
      </div>
    )
  }

  return children
}
