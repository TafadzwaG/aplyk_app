# Aplyk Web App

React SPA for the Aplyk temporary workforce platform: public marketing site, OIDC sign-in, company hiring workspace, and platform-admin tooling. Built with React 19, Vite, TypeScript, Tailwind CSS v4, and shadcn/ui.

The app talks to the modular monolith backend at [`../aplyk-backend`](../aplyk-backend/README.md) (`https://localhost:7283` by default).

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- [Aplyk backend](https://github.com/your-org/aplyk-backend) running locally on `https://localhost:7283`, or Docker Compose from that repo

Trust the ASP.NET dev certificate if you use HTTPS locally:

```powershell
dotnet dev-certs https --trust
```

---

## Quick start

```bash
npm install
cp .env.example .env   # optional — defaults match local backend
npm run dev
```

Open **http://localhost:5173**.

For a full local stack, run the API in a second terminal:

```powershell
cd ../aplyk-backend
dotnet run --project Aplyk.WebApi/Aplyk.WebApi.csproj
```

---

## Environment

Copy [`.env.example`](.env.example) to `.env` when you need overrides:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `https://localhost:7283` | REST API base URL |
| `VITE_OIDC_AUTHORITY` | `https://localhost:7283` | OIDC issuer (same host as API) |
| `VITE_OIDC_CLIENT_ID` | `react_spa` | Public SPA client registered in backend |
| `VITE_OIDC_SCOPE` | `openid profile email phone roles api1 offline_access` | Token scopes |

Configuration is centralized in [`src/lib/config.ts`](src/lib/config.ts). Redirect URIs are `${origin}/auth/callback`; the backend [`appsettings.Development.json`](../aplyk-backend/Aplyk.WebApi/appsettings.Development.json) already allows `http://localhost:5173` and `https://localhost:5173`.

---

## Authentication

Sign-in uses **OIDC authorization code + PKCE** via [`oidc-client-ts`](https://github.com/authts/oidc-client-ts):

1. `/login` or `/register` starts the flow (`AuthLayout` shell).
2. User is redirected to the backend Identity module.
3. `/auth/callback` completes the code exchange and loads the profile via `/api/profile`.

Auth state lives in [`src/contexts/auth-context.tsx`](src/contexts/auth-context.tsx). API calls attach the bearer token through [`src/lib/api.ts`](src/lib/api.ts).

Post-login routing (`getPostAuthPath`) sends users to onboarding, company dashboard, or platform admin based on profile context.

---

## Routes

### Public

| Path | Page |
|------|------|
| `/` | Landing / welcome (marketing sections, hero, industries, CTA) |
| `/login` | Sign in |
| `/register` | Create account (same OIDC registration entry) |
| `/auth/callback` | OIDC redirect handler |

### Onboarding

| Path | Page |
|------|------|
| `/onboarding` | Choose worker vs company path |
| `/onboarding/contexts` | Select active company context |
| `/onboarding/company` | Register a company |

### Company workspace (authenticated)

| Path | Page |
|------|------|
| `/dashboard` | Overview |
| `/shifts`, `/shifts/new`, `/shifts/:id` | Shift list, create, detail |
| `/job-profiles`, `/job-profiles/new`, `/job-profiles/:id` | Job profiles |
| `/locations`, `/locations/:id` | Locations |
| `/team` | Team members |
| `/roles` | Company roles & permissions |
| `/settings` | Profile settings |

### Platform admin (`RequirePlatformAdmin`)

| Path | Page |
|------|------|
| `/platform` | Overview |
| `/platform/companies` | All companies |
| `/platform/users` | Users |
| `/platform/shifts` | Shifts |
| `/platform/roles` | Platform roles |
| `/platform/reference-data` | Reference data hub |
| `/platform/reference-data/:kind` | industries, skills, categories, … |

---

## Project layout

```text
src/
  components/       UI primitives (shadcn), landing sections, guards
  contexts/         AuthProvider
  layouts/          AppLayout, AuthLayout, PlatformLayout
  lib/              config, auth, api client, utilities
  pages/            Route-level screens
  types/            API TypeScript types
public/
  images/landing/   Marketing photography and industry assets
```

Key files:

- [`src/App.tsx`](src/App.tsx) — path-based routing (no React Router package; lightweight in-app router)
- [`src/lib/api.ts`](src/lib/api.ts) — typed API modules (`meApi`, `shiftsApi`, …)
- [`src/lib/landing-images.ts`](src/lib/landing-images.ts) — landing image map
- [`src/index.css`](src/index.css) — design tokens, brand colors, landing utilities

---

## Brand & UI

| Token | Value | Usage |
|-------|-------|--------|
| Navy | `#2a445f` | Primary brand, headings, nav |
| Orange | `#f48939` | CTAs, accents, highlights |
| Surface | `#f4f6f8` | Page background |

Font: **Instrument Sans** (app-wide). Dark mode is supported via `next-themes`.

Add shadcn components:

```bash
npx shadcn@latest add dialog select
```

---

## Scripts

```bash
npm run dev        # Vite dev server (:5173)
npm run build      # Production build (tsc + vite)
npm run preview    # Preview production build
npm run lint       # ESLint
npm run typecheck  # TypeScript (no emit)
npm run format     # Prettier
```

---

## Related docs

- [Aplyk backend README](../aplyk-backend/README.md) — API host, Docker Compose, migrations, OIDC
- [Modular monolith notes](../aplyk-backend/docs/Modular-Monolith.md)
- [Mobile / SPA authentication](../aplyk-backend/docs/Monolithic-Mobile-Authentication.md)

---

## License

Private repository for the Aplyk product. Internal use only unless otherwise stated by the org.
