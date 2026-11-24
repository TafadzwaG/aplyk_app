import { test, expect, type Page } from "@playwright/test"

async function setup(page: Page, mode = "employer", fail = false) {
  const requests: { path: string; method: string; body: Record<string, unknown> | null }[] = []
  let proposal = {
    id: "proposal-1", kind: mode === "employer" ? "create_shift" : "apply", status: "pending", version: 1,
    fields: mode === "employer" ? { jobProfileId: 10, locationId: 20, startsOn: "2027-02-01", startTime: "08:00:00", endTime: "16:00:00", peopleNeeded: 2, hourlyRate: 45 } : { shiftId: 99 },
    summary: mode === "employer" ? { jobProfile: "Barista", workplace: "Rosebank", timeZoneId: "Africa/Johannesburg", currencyCode: "ZAR", rateSource: "job_profile_default", acceptanceMethod: "ManualReview", effect: "Create an unpublished draft. Review and publish it separately." }
      : { terms: { jobName: "Barista", hourlyRate: 45, currencyCode: "ZAR" }, effect: "Applying agrees to these terms and may immediately book you onto the shift." },
    expiresAtUtc: "2030-01-01T00:00:00Z", resultId: null as number | null,
  }
  let runs: unknown[] = []
  await page.addInitScript(() => localStorage.setItem("oidc.user:https://localhost:7283:react_spa", JSON.stringify({
    access_token: "test-only", token_type: "Bearer", scope: "openid profile api1", expires_at: 9999999999, profile: { sub: "1" },
  })))
  await page.route("https://localhost:7283/**", async route => {
    const request = route.request(), path = new URL(request.url()).pathname, method = request.method()
    const body = request.headers()["content-type"]?.includes("application/json") ? request.postDataJSON() : null
    requests.push({ path, method, body })
    const reply = (data: unknown) => route.fulfill({ json: { success: true, data } })
    if (path === "/api/me") return reply({ id: 1, emailConfirmed: true, activeCompanyId: mode === "employer" ? 7 : null, firstName: "Test", lastName: "User", isPlatformAdmin: false })
    if (path === "/api/me/contexts") return reply({ activeContext: { kind: mode === "employer" ? "Company" : "Professional", companyId: mode === "employer" ? 7 : null }, availableContexts: [], invitations: [] })
    if (path.endsWith("/status")) return fail ? route.fulfill({ status: 503, json: { detail: "The assistant is unavailable. Continue with the normal screens." } }) : reply({ enabled: true, agent: mode })
    if (path.endsWith("/conversations")) return reply(method === "POST" ? { id: "conversation-1", agent: mode, expiresAtUtc: "2030-01-01" } : [])
    if (path.endsWith("/messages")) {
      const run = { id: "run-1", conversationId: "conversation-1", status: "completed", prompt: body.message, answer: "Please review the proposal.", errorCode: null, modelCalls: 4, toolCalls: 3, proposals: [proposal] }
      runs = [run]; return reply(run)
    }
    if (path.endsWith("/conversations/conversation-1")) return reply({ id: "conversation-1", agent: mode, expiresAtUtc: "2030-01-01", runs })
    if (path.endsWith("/approve")) { proposal = { ...proposal, status: "completed", resultId: 99 }; return reply(proposal) }
    if (path.endsWith("/dismiss")) { proposal = { ...proposal, status: "dismissed" }; return reply(proposal) }
    if (path.endsWith("/proposals/proposal-1")) {
      if (method === "PUT") proposal = { ...proposal, fields: body.fields, version: proposal.version + 1 }
      return reply(proposal)
    }
    return reply({ items: [], total: 0 })
  })
  return requests
}

test("edits require a new version before approval and creation happens only on the explicit action", async ({ page }) => {
  const calls = await setup(page)
  await page.goto("/assistant")
  await page.getByLabel("What would you like to do?").fill("Two baristas tomorrow from 8 am to 4 pm")
  await page.getByRole("button", { name: "Send", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Review your shift draft" })).toBeVisible()
  expect(calls.filter(x => x.path.endsWith("/approve"))).toHaveLength(0)
  await page.getByLabel("People needed", { exact: true }).fill("3")
  await expect(page.getByRole("button", { name: "Approve and create draft" })).toHaveCount(0)
  await page.getByRole("button", { name: "Save changes for review" }).click()
  await expect(page.getByLabel("People needed", { exact: true })).toHaveValue("3")
  expect(calls.filter(x => x.path.endsWith("/approve"))).toHaveLength(0)
  await page.getByRole("button", { name: "Approve and create draft" }).click()
  await expect(page.getByRole("link", { name: "Open shift draft" })).toBeVisible()
  expect(calls.find(x => x.path.endsWith("/approve"))?.body).toEqual({ version: 2 })
  expect(calls.filter(x => x.path.endsWith("/publish"))).toHaveLength(0)
  await page.screenshot({ path: "test-results/agent-draft-receipt.png", fullPage: true })
})

test("professional applications show booking consequences and require explicit agreement", async ({ page }) => {
  const calls = await setup(page, "professional")
  await page.goto("/assistant")
  await page.getByLabel("What would you like to do?").fill("Help me apply for this barista opportunity")
  await page.getByRole("button", { name: "Send", exact: true }).click()
  await expect(page.getByText(/may immediately book you/)).toBeVisible()
  expect(calls.filter(x => x.path.endsWith("/approve"))).toHaveLength(0)
  await page.getByRole("button", { name: "Apply and agree to terms" }).click()
  await expect(page.getByText("Application submitted", { exact: true })).toBeVisible()
})

test("provider outage leaves manual navigation usable", async ({ page }) => {
  await setup(page, "employer", true)
  await page.goto("/assistant")
  await expect(page.getByRole("alert")).toContainText("unavailable")
  await expect(page.getByRole("button", { name: "Send", exact: true })).toBeDisabled()
  await expect(page.getByRole("link", { name: "Shifts", exact: true })).toBeVisible()
})

test("dismissal does not execute a proposal", async ({ page }) => {
  const calls = await setup(page)
  await page.goto("/assistant")
  await page.getByLabel("What would you like to do?").fill("Prepare a shift for next week")
  await page.getByRole("button", { name: "Send", exact: true }).click()
  await page.getByRole("button", { name: "Dismiss", exact: true }).click()
  await expect(page.getByText("Proposal dismissed.")).toBeVisible()
  expect(calls.filter(x => x.path.endsWith("/approve"))).toHaveLength(0)
})


test("denied microphone access keeps typed messages usable", async ({ page }) => {
  await setup(page)
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException("denied", "NotAllowedError") }
  })
  await page.goto("/assistant")
  await page.getByRole("button", { name: "Use voice" }).click()
  await expect(page.getByRole("alert")).toContainText("Microphone access was blocked")
  await page.getByLabel("What would you like to do?").fill("Two baristas tomorrow from 8 am to 4 pm")
  await expect(page.getByRole("button", { name: "Send", exact: true })).toBeEnabled()
})

test("mobile proposal review keeps the explicit approval visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await setup(page)
  await page.goto("/assistant")
  await page.getByLabel("What would you like to do?").fill("Two baristas tomorrow from 8 am to 4 pm")
  await page.getByRole("button", { name: "Send", exact: true }).click()
  const approve = page.getByRole("button", { name: "Approve and create draft" })
  await approve.scrollIntoViewIfNeeded()
  await expect(approve).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: "test-results/agent-mobile-review.png", fullPage: true })
})
