import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { getPostAuthPath } from "@/lib/api"
import { Link, useNavigate } from "@/lib/router"

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading, profile } = useAuth()
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && profile) {
      navigate(getPostAuthPath(profile), { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, profile])

  async function handleSignIn() {
    setIsSigningIn(true)
    try {
      await login()
    } catch {
      toast.error("Could not start sign-in. Try again.")
      setIsSigningIn(false)
    }
  }

  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.12em] text-brand-orange uppercase">
          Account access
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sign in securely with your Aplyk account to continue onboarding.
        </p>
      </div>
      <div className="space-y-5">
        <Button
          type="button"
          size="lg"
          className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
          disabled={isSigningIn}
          onClick={() => void handleSignIn()}
        >
          {isSigningIn ? "Redirecting..." : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-brand-navy underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </>
  )
}
