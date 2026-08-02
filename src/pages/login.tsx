import * as React from "react"
import { toast } from "sonner"

import { AuthCardBrand } from "@/components/auth-card-brand"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <Card>
      <CardHeader className="text-center">
        <AuthCardBrand />
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in securely with your Aplyk account to continue onboarding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={isSigningIn}
          onClick={() => void handleSignIn()}
        >
          {isSigningIn ? "Redirecting..." : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
