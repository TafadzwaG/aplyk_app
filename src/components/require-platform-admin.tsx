import * as React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useNavigate } from "@/lib/router"

export function RequirePlatformAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, profile } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !profile)) {
      navigate("/login", { replace: true })
    } else if (!isLoading && profile && !profile.isPlatformAdmin) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, profile])

  if (isLoading || !isAuthenticated || !profile || !profile.isPlatformAdmin) {
    return <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">Checking platform access...</div>
  }

  return children
}
