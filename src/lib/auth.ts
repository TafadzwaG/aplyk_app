import { UserManager, WebStorageStateStore, type User } from "oidc-client-ts"

import { config } from "@/lib/config"

let userManager: UserManager | null = null
let renewalPromise: Promise<User | null> | null = null

export function getUserManager(): UserManager {
  if (!userManager) {
    userManager = new UserManager({
      authority: config.oidc.authority,
      client_id: config.oidc.clientId,
      redirect_uri: config.oidc.redirectUri,
      post_logout_redirect_uri: config.oidc.postLogoutRedirectUri,
      response_type: "code",
      scope: config.oidc.scope,
      automaticSilentRenew: true,
      accessTokenExpiringNotificationTimeInSeconds: 60,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    })
  }

  return userManager
}

export async function signIn(returnUrl?: string): Promise<void> {
  if (returnUrl) {
    rememberReturnUrl(returnUrl)
  }

  await getUserManager().signinRedirect()
}

export function rememberReturnUrl(returnUrl: string): void {
  if (returnUrl.startsWith("/") && !returnUrl.startsWith("//")) {
    sessionStorage.setItem("aplyk_auth_return_url", returnUrl)
  }
}

export async function completeSignIn(): Promise<User> {
  return getUserManager().signinRedirectCallback()
}

export async function signOut(): Promise<void> {
  await getUserManager().signoutRedirect()
}

export async function getAccessToken(): Promise<string | null> {
  const user = await getCurrentUser()
  if (!user) return null
  return user.access_token
}

export async function getCurrentUser(): Promise<User | null> {
  const manager = getUserManager()
  const user = await manager.getUser()
  if (!user) return null
  if (!user.expired) return user

  renewalPromise ??= manager
    .signinSilent()
    .catch(async () => {
      await manager.removeUser()
      return null
    })
    .finally(() => {
      renewalPromise = null
    })

  return renewalPromise
}

export function consumeReturnUrl(): string | null {
  const url = sessionStorage.getItem("aplyk_auth_return_url")
  sessionStorage.removeItem("aplyk_auth_return_url")
  return url
}

const GENERIC_AUTH_RETURN_PATHS = new Set([
  "/onboarding",
  "/onboarding/contexts",
  "/dashboard",
])

export function shouldUsePostAuthPath(returnUrl: string | null) {
  return !returnUrl || GENERIC_AUTH_RETURN_PATHS.has(returnUrl)
}
