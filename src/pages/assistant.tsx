import * as React from "react"
import { SparklesIcon, SendIcon, SquareIcon, PlusIcon } from "lucide-react"
import { agentApi, type AgentProposal, type Conversation, type ShiftProposalFields } from "@/lib/agent"
import { getApiErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "@/lib/router"
import { VoiceInput } from "@/components/voice-input"
import { useAuth } from "@/contexts/auth-context"

export function AssistantPage() {
  const { profile } = useAuth()
  // Context changes destroy pending requests and all rendered content from the previous workspace.
  return <AssistantSession key={`${profile?.id}:${profile?.activeCompanyId}`} />
}

function AssistantSession() {
  const [conversation, setConversation] = React.useState<Conversation | null>(null)
  const [saved, setSaved] = React.useState<Omit<Conversation, "runs">[]>([])
  const [agent, setAgent] = React.useState<Conversation["agent"] | null>(null)
  const [message, setMessage] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [voiceBusy, setVoiceBusy] = React.useState(false)
  const [error, setError] = React.useState("")
  const activeRequest = React.useRef<AbortController | null>(null)
  const epoch = React.useRef(0)
  const running = pending || conversation?.runs.some(r => r.status === "running")

  React.useEffect(() => {
    const controller = new AbortController()
    void Promise.all([agentApi.status(controller.signal), agentApi.list(controller.signal)])
      .then(([status, list]) => { setAgent(status.agent); setSaved(list) })
      .catch(e => { if (!controller.signal.aborted) setError(getApiErrorMessage(e, "The assistant is unavailable. You can use the normal application screens.")) })
    // Invalidate in-flight callbacks when this account/workspace session unmounts.
    const sessionEpoch = epoch
    const request = activeRequest
    return () => { sessionEpoch.current++; controller.abort(); request.current?.abort() }
  }, [])

  const conversationId = conversation?.id
  React.useEffect(() => {
    if (!conversationId || !running) return
    const controller = new AbortController()
    const id = conversationId
    const timer = window.setInterval(() => {
      void agentApi.get(id, controller.signal).then(next => setConversation(current => current?.id === id ? next : current)).catch(() => {})
    }, 2500)
    return () => { clearInterval(timer); controller.abort() }
  }, [conversationId, running])

  async function send(event: React.FormEvent) {
    event.preventDefault()
    if (running || message.trim().length < 5) return
    const generation = epoch.current
    const controller = new AbortController()
    activeRequest.current = controller
    setPending(true); setError("")
    const prompt = message.trim()
    let selectedId = conversation?.id
    try {
      const selected = conversation ?? { ...await agentApi.create(controller.signal), runs: [] }
      if (generation !== epoch.current) return
      selectedId = selected.id
      setConversation(selected)
      setSaved(current => current.some(x => x.id === selected.id) ? current : [selected, ...current])
      const result = await agentApi.send(selected.id, prompt, crypto.randomUUID(), controller.signal)
      if (generation !== epoch.current) return
      setConversation(current => current?.id === selected.id ? { ...current, runs: [...current.runs.filter(r => r.id !== result.id), result] } : current)
      setMessage("")
      const list = await agentApi.list(controller.signal)
      if (generation === epoch.current) setSaved(list)
    } catch (failure) {
      if (!controller.signal.aborted && generation === epoch.current)
        setError(getApiErrorMessage(failure, "The connection was interrupted. Reload this conversation to check its saved outcome before trying again."))
      if (selectedId && !controller.signal.aborted) {
        try { const latest = await agentApi.get(selectedId, controller.signal); if (generation === epoch.current) setConversation(latest) }
        catch { /* Keep the saved conversation available for a later reconnect. */ }
      }
    } finally { if (generation === epoch.current) setPending(false) }
  }

  async function choose(id: string) {
    epoch.current++; activeRequest.current?.abort(); setPending(false); setVoiceBusy(false); setError(""); setMessage(""); setConversation(null)
    if (!id) return
    const generation = epoch.current
    try { const next = await agentApi.get(id); if (generation === epoch.current) setConversation(next) }
    catch (e) { if (generation === epoch.current) setError(getApiErrorMessage(e, "Could not load the conversation.")) }
  }

  function updateProposal(proposal: AgentProposal) {
    setConversation(current => current ? { ...current, runs: current.runs.map(r => ({ ...r, proposals: r.proposals.map(p => p.id === proposal.id ? proposal : p) })) } : current)
  }

  return <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><div className="mb-2 flex items-center gap-2 text-primary"><SparklesIcon className="size-5" /><span className="text-sm font-medium">Aplyk assistant</span></div>
        <h2 className="text-2xl font-semibold">{agent === "professional" ? "Find your next opportunity" : "Plan your next shift"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{agent === "professional" ? "Search live work, check eligibility, and review applications before submitting." : "Describe the help you need. Review the details before creating a draft."}</p></div>
      <Button variant="outline" disabled={voiceBusy} onClick={() => void choose("")}><PlusIcon />New conversation</Button>
    </div>
    {saved.length > 0 && <label className="grid gap-2 text-sm">Previous conversations<select disabled={voiceBusy} aria-label="Previous conversations" className="rounded-md border bg-background p-2" value={conversation?.id ?? ""} onChange={e => void choose(e.target.value)}>
      <option value="">Choose a conversation</option>{saved.map((s, i) => <option key={s.id} value={s.id}>{s.agent === "employer" ? "Shift planning" : "Find work"} · {i + 1}</option>)}
    </select></label>}
    <div className="space-y-5" role="log" aria-label="Conversation" aria-live="polite">
      {conversation?.runs.map(run => <article key={run.id} className="space-y-3">
        <p className="ml-8 rounded-2xl bg-muted p-4 whitespace-pre-wrap"><span className="sr-only">You: </span>{run.prompt}</p>
        {run.answer && <p className="mr-6 whitespace-pre-wrap p-3"><span className="sr-only">Assistant: </span>{run.answer}</p>}
        {run.status === "running" && <p className="text-sm text-muted-foreground" role="status">{run.toolCalls ? "Checking the details…" : "Working on your request…"}</p>}
        {["failed", "interrupted", "cancelled"].includes(run.status) && <p className="rounded-md border p-3 text-sm">{run.status === "cancelled" ? "This request was cancelled." : "This request did not finish. You can review any saved proposal below or send a follow-up."} {run.errorCode === "budget_exhausted" ? "The assistant allowance has been reached." : ""}</p>}
        {run.proposals.map(proposal => <ProposalCard key={`${proposal.id}:${proposal.version}:${proposal.status}`} proposal={proposal} onUpdate={updateProposal} />)}
      </article>)}
    </div>
    {error && <p role="alert" className="rounded-md border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}
    <form onSubmit={event => void send(event)} className="space-y-3 rounded-xl border bg-card p-4">
      <label htmlFor="agent-message" className="text-sm font-medium">{conversation ? "Continue the conversation" : "What would you like to do?"}</label>
      <Textarea id="agent-message" maxLength={1500} rows={3} value={message} onChange={e => setMessage(e.target.value)} disabled={!agent || Boolean(running) || voiceBusy}
        placeholder={agent === "professional" ? "Find barista opportunities this weekend." : "I need two baristas at Rosebank tomorrow, from 8 am to 4 pm."} />
      <VoiceInput key={conversationId ?? "new"} feature={agent === "professional" ? "search" : "shift"} disabled={!agent || Boolean(running)} onTranscript={setMessage} onBusy={setVoiceBusy} />
      <p className="text-xs text-muted-foreground">Leave out personal and contact details. Conversations are saved temporarily; you can delete them below.</p>
      <div className="flex flex-wrap justify-between gap-2">
        {conversation ? <Button type="button" variant="ghost" disabled={Boolean(running)} onClick={async () => {
          try { await agentApi.delete(conversation.id); setSaved(list => list.filter(x => x.id !== conversation.id)); void choose("") }
          catch (e) { setError(getApiErrorMessage(e, "Could not delete this conversation.")) }
        }}>Delete conversation</Button> : <span />}
        {running && conversation ? <Button type="button" variant="outline" onClick={async () => {
          try { await agentApi.cancel(conversation.id); activeRequest.current?.abort(); setPending(false); setConversation(await agentApi.get(conversation.id)) }
          catch (e) { setError(getApiErrorMessage(e, "Could not cancel. Check the saved outcome.")) }
        }}><SquareIcon />Stop</Button> : <Button type="submit" disabled={!agent || pending || voiceBusy || message.trim().length < 5}><SendIcon />Send</Button>}
      </div>
    </form>
  </main>
}

function ProposalCard({ proposal, onUpdate }: { proposal: AgentProposal; onUpdate: (p: AgentProposal) => void }) {
  const shift = proposal.kind === "create_shift"
  const [fields, setFields] = React.useState(proposal.fields as ShiftProposalFields)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  const expired = new Date(proposal.expiresAtUtc).getTime() <= now
  const dirty = shift && JSON.stringify(fields) !== JSON.stringify(proposal.fields)
  const editable = proposal.status === "pending" && !expired && !busy
  const summary = proposal.summary

  async function act(action: () => Promise<AgentProposal>) {
    if (busy) return
    setBusy(true); setError("")
    try { onUpdate(await action()) }
    catch (e) { setError(getApiErrorMessage(e, "The action could not complete. Refresh and review its current state.")) }
    finally { setBusy(false) }
  }
  if (proposal.status === "completed") return <div className="rounded-xl border bg-card p-4" role="status">
    <p className="font-medium">{shift ? "Draft created" : "Application submitted"}</p>
    {shift && proposal.resultId ? <Link className="mt-2 inline-block text-primary underline" to={`/shifts/${proposal.resultId}`}>Open shift draft</Link> : <p className="mt-2 text-sm">Application reference: {proposal.resultId}.</p>}
  </div>
  return <section className="space-y-4 rounded-xl border border-primary/25 bg-card p-5" aria-label={shift ? "Review shift proposal" : "Review application proposal"}>
    <div><h3 className="font-semibold">{shift ? "Review your shift draft" : "Review and agree to the opportunity terms"}</h3><p className="mt-1 text-sm text-muted-foreground">{String(summary.effect ?? "Review before approving.")}</p></div>
    {shift ? <>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">{[["Job profile", summary.jobProfile], ["Workplace", summary.workplace], ["Time zone", summary.timeZoneId], ["Currency", summary.currencyCode], ["Rate source", summary.rateSource === "job_profile_default" ? "Saved job profile default" : "Reviewed input"], ["Application review", summary.acceptanceMethod]].map(([label, value]) => <div key={String(label)}><dt className="text-muted-foreground">{String(label)}</dt><dd>{String(value ?? "—")}</dd></div>)}</dl>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">Date<Input type="date" disabled={!editable} value={fields.startsOn} onChange={e => setFields(f => ({ ...f, startsOn: e.target.value }))} /></label>
        <label className="grid gap-1 text-sm">People needed<Input type="number" min={1} max={100000} disabled={!editable} value={fields.peopleNeeded} onChange={e => setFields(f => ({ ...f, peopleNeeded: Number(e.target.value) }))} /></label>
        <label className="grid gap-1 text-sm">Start time<Input type="time" disabled={!editable} value={fields.startTime.slice(0, 5)} onChange={e => setFields(f => ({ ...f, startTime: `${e.target.value}:00` }))} /></label>
        <label className="grid gap-1 text-sm">End time<Input type="time" disabled={!editable} value={fields.endTime.slice(0, 5)} onChange={e => setFields(f => ({ ...f, endTime: `${e.target.value}:00` }))} /></label>
        <label className="grid gap-1 text-sm">Hourly rate ({String(summary.currencyCode)})<Input type="number" min="0.01" step="0.01" disabled={!editable} value={fields.hourlyRate ?? ""} onChange={e => setFields(f => ({ ...f, hourlyRate: e.target.value ? Number(e.target.value) : null }))} /></label>
      </div>
      <p className="text-xs text-muted-foreground">An end time at or before the start time means the following day. Ask the assistant to change the job profile or workplace.</p>
    </> : <ValueList value={summary} />}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!editable && !busy && <p className="text-sm text-muted-foreground">{expired ? "This proposal expired. Ask for a new proposal." : `Proposal ${proposal.status}.`}</p>}
    <div className="flex flex-wrap gap-2">
      {dirty ? <Button disabled={!editable} onClick={() => void act(() => agentApi.revise(proposal, fields))}>Save changes for review</Button>
        : <Button disabled={!editable} onClick={() => void act(() => agentApi.approve(proposal))}>{busy ? "Checking…" : shift ? "Approve and create draft" : "Apply and agree to terms"}</Button>}
      <Button variant="outline" disabled={!editable} onClick={() => void act(() => agentApi.dismiss(proposal))}>Dismiss</Button>
      {error && <Button variant="ghost" disabled={busy} onClick={() => void act(() => agentApi.proposal(proposal.id))}>Refresh proposal</Button>}
    </div>
  </section>
}

function ValueList({ value }: { value: Record<string, unknown> }) {
  return <dl className="space-y-2 text-sm">{Object.entries(value).filter(([key]) => key !== "effect").map(([key, item]) => <div key={key}>
    <dt className="text-muted-foreground">{key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</dt>
    <dd className="pl-2">{item !== null && typeof item === "object" ? Array.isArray(item)
      ? item.map((entry, i) => typeof entry === "object" && entry !== null ? <ValueList key={i} value={entry as Record<string, unknown>} /> : <p key={i}>{String(entry)}</p>)
      : <ValueList value={item as Record<string, unknown>} /> : String(item ?? "—")}</dd>
  </div>)}</dl>
}
