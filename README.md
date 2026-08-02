# Aplyk frontend

A standalone application frontend built with React 19, Vite, TypeScript, Tailwind CSS v4, and shadcn/ui. It follows the spirit of Laravel starter kits—auth screens, an authenticated app shell, profile settings, dark mode, and sensible routing—without requiring Laravel.

## Run locally

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173` by default.

## Available routes

- `/` — animated public welcome and marketing page
- `/login` and `/register` — frontend-only auth forms
- `/dashboard` — overview and recent application activity
- `/applications` — application pipeline table
- `/settings` — profile form

All data and submit handlers are mocked. Replace those handlers with calls to your backend API when it is ready.

## Connect an API

Copy `.env.example` to `.env` and set your backend URL:

```env
VITE_API_URL=http://localhost:8000/api
```

Access it in application code through `import.meta.env.VITE_API_URL`. A good next step is to add a small API client under `src/lib/api.ts` and an auth context that stores the signed-in user and token.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run format
```

Add more shadcn/ui components with:

```bash
npx shadcn@latest add dialog select
```
