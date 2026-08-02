import * as React from "react"
import { toast } from "sonner"

import { useAuth } from "@/contexts/auth-context"
import { consumeReturnUrl, shouldUsePostAuthPath } from "@/lib/auth"
import { useNavigate } from "@/lib/router"

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { handleAuthCallback } = useAuth()
  const handledRef = React.useRef(false)

  React.useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    async function complete() {
      try {
        const defaultPath = await handleAuthCallback()
        const returnUrl = consumeReturnUrl()
        navigate(shouldUsePostAuthPath(returnUrl) ? defaultPath : returnUrl!, {
          replace: true,
        })
      } catch {
        toast.error("Sign-in could not be completed. Try again.")
        navigate("/login", { replace: true })
      }
    }

    void complete()
  }, [handleAuthCallback, navigate])

  return (
    <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
      Completing sign-in...
    </div>
  )
}
