const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:7283"
const oidcAuthority =
  import.meta.env.VITE_OIDC_AUTHORITY ?? "https://localhost:7283"

export const config = {
  apiUrl: apiUrl.replace(/\/$/, ""),
  oidc: {
    authority: oidcAuthority.replace(/\/$/, ""),
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID ?? "react_spa",
    redirectUri: `${window.location.origin}/auth/callback`,
    postLogoutRedirectUri: `${window.location.origin}/`,
    scope:
      import.meta.env.VITE_OIDC_SCOPE ??
      "openid profile email phone roles api1 offline_access",
  },
} as const
