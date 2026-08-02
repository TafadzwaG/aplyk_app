import * as React from "react"
import type { User } from "oidc-client-ts"

import { getPostAuthPath, meApi } from "@/lib/api"
import {
  completeSignIn,
  getCurrentUser,
  getUserManager,
  signIn,
  signOut,
} from "@/lib/auth"
import type { MeProfile } from "@/types/api"

type AuthContextValue = {
  user: User | null
  profile: MeProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (returnUrl?: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<MeProfile | null>
  handleAuthCallback: () => Promise<string>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [profile, setProfile] = React.useState<MeProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const refreshProfile = React.useCallback(async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      setProfile(null)
      return null
    }

    const nextProfile = await meApi.getProfile()
    setProfile(nextProfile)
    return nextProfile
  }, [])

  React.useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        const currentUser = await getCurrentUser()
        if (!active) return

        setUser(currentUser)
        if (currentUser) {
          const nextProfile = await meApi.getProfile()
          if (active) setProfile(nextProfile)
        }
      } catch {
        if (active) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void bootstrap()

    const manager = getUserManager()
    const onUserLoaded = (loadedUser: User) => {
      setUser(loadedUser)
      void refreshProfile()
    }
    const onUserUnloaded = () => {
      setUser(null)
      setProfile(null)
    }

    manager.events.addUserLoaded(onUserLoaded)
    manager.events.addUserUnloaded(onUserUnloaded)

    return () => {
      active = false
      manager.events.removeUserLoaded(onUserLoaded)
      manager.events.removeUserUnloaded(onUserUnloaded)
    }
  }, [refreshProfile])

  const login = React.useCallback(async (returnUrl?: string) => {
    await signIn(returnUrl)
  }, [])

  const logout = React.useCallback(async () => {
    setUser(null)
    setProfile(null)
    await signOut()
  }, [])

  const handleAuthCallback = React.useCallback(async () => {
    const signedInUser = await completeSignIn()
    setUser(signedInUser)
    const nextProfile = await meApi.getProfile()
    setProfile(nextProfile)
    return getPostAuthPath(nextProfile)
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      profile,
      isLoading,
      isAuthenticated: Boolean(user && !user.expired),
      login,
      logout,
      refreshProfile,
      handleAuthCallback,
    }),
    [
      user,
      profile,
      isLoading,
      login,
      logout,
      refreshProfile,
      handleAuthCallback,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hooks are intentionally colocated with the provider so they share one context instance.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
