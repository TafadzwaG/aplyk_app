# Aplyk assistant

`/assistant` provides employer shift planning and professional opportunity/application review using the backend agent contract. Deploy the backend MCP/agent PR first. Sign in through the existing OIDC flow and select the relevant company or professional context.

The backend controls availability. No model API key belongs in this app. An unavailable assistant leaves manual navigation and the normal shift/opportunity screens usable. Messages and review state are held in the backend; no conversation is persisted to browser storage. Account/company changes remount the session and abort pending requests.

Review cards show an explicit action: create an unpublished shift draft, or apply and agree to the opportunity terms. Edits must be saved as a new proposal version before approval. A lost response can be reconciled by reloading the saved conversation or refreshing the proposal; do not assume an action failed just because the connection failed.

Voice input requires HTTPS or localhost and microphone permission. It records at most 60 seconds, transcribes through the backend, and places editable text in the composer. Sending is a separate action. Cancelling or changing the session stops capture/uploads. Audio is not saved by the app.

## Checks

```sh
npm ci
npm run build
npx eslint src/pages/assistant.tsx src/lib/agent.ts src/components/voice-input.tsx src/lib/voice-recorder.ts src/lib/ai.ts tests/e2e/agent.spec.ts
npm run test:agent
```

Playwright uses Chrome and a Vite test server on port 5186. Tests mock the HTTP contract and exercise the actual React UI: editing before approval, exact proposal version, application booking warning, dismissal and unavailable-provider fallback. Backend tests separately exercise real PostgreSQL, authorization, Agent Framework and MCP with a scripted model. Neither substitutes for live-model evaluation.

The repository-wide lint command currently reports existing issues in unrelated files; changed assistant files are checked separately. Production build warnings about existing bundle size are not introduced by this feature.
