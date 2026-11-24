import * as React from "react"
import { MicIcon, SquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { aiApi } from "@/lib/ai"
import { startVoiceRecording, type VoiceRecording } from "@/lib/voice-recorder"

export function VoiceInput({ feature, disabled, onTranscript, onBusy }: {
  feature: "shift" | "search"; disabled: boolean
  onTranscript: (text: string) => void; onBusy: (busy: boolean) => void
}) {
  const [phase, setPhase] = React.useState<"idle" | "starting" | "recording" | "transcribing">("idle")
  const [seconds, setSeconds] = React.useState(0)
  const [error, setError] = React.useState("")
  const recording = React.useRef<VoiceRecording | null>(null)
  const upload = React.useRef<AbortController | null>(null)
  const generation = React.useRef(0)
  const stopRef = React.useRef<() => void>(() => {})

  React.useEffect(() => () => {
    generation.current++
    recording.current?.cancel()
    upload.current?.abort()
  }, [])
  React.useEffect(() => {
    if (phase !== "recording") return
    const timer = window.setInterval(() => setSeconds(value => Math.min(60, value + 1)), 1000)
    const limit = window.setTimeout(() => stopRef.current(), 60000)
    return () => { window.clearInterval(timer); window.clearTimeout(limit) }
  }, [phase])

  function cancel() {
    generation.current++
    recording.current?.cancel(); recording.current = null
    upload.current?.abort(); upload.current = null
    setPhase("idle"); onBusy(false)
  }
  async function stop() {
    const active = recording.current
    if (!active) return
    recording.current = null
    const version = generation.current
    setPhase("transcribing")
    const controller = new AbortController()
    upload.current = controller
    try {
      const audio = await active.stop()
      if (version !== generation.current) return
      const text = await aiApi.transcribe(feature, audio, controller.signal)
      if (version === generation.current) onTranscript(text)
    } catch (failure) {
      if (version === generation.current) setError(failure instanceof Error ? failure.message : "Could not transcribe. Please try again.")
    } finally {
      if (version === generation.current) { setPhase("idle"); onBusy(false); upload.current = null }
    }
  }
  React.useEffect(() => { stopRef.current = () => void stop() })
  async function start() {
    const version = ++generation.current
    setError(""); setSeconds(0); setPhase("starting"); onBusy(true)
    try {
      const active = await startVoiceRecording(() => stopRef.current())
      if (version !== generation.current) { active.cancel(); return }
      recording.current = active
      setPhase("recording")
    } catch (failure) {
      if (version !== generation.current) return
      const message = failure instanceof DOMException && failure.name === "NotAllowedError"
        ? "Microphone access was blocked. Allow it in your browser's site settings, then try again."
        : failure instanceof DOMException && failure.name === "NotFoundError"
          ? "No microphone was found. Connect one or type your request."
          : failure instanceof Error ? failure.message : "Could not start the microphone. You can type instead."
      setError(message); setPhase("idle"); onBusy(false)
    }
  }
  return <div className="voice-input space-y-2">
    <div className="voice-input-actions flex flex-wrap items-center gap-2">
      {phase === "idle" ? <Button type="button" variant="outline" disabled={disabled} onClick={() => void start()}><MicIcon />Use voice</Button>
        : phase === "recording" ? <Button type="button" variant="outline" onClick={() => void stop()}><SquareIcon />Stop and transcribe</Button> : null}
      {phase !== "idle" ? <Button type="button" variant="ghost" onClick={cancel}>Cancel voice input</Button> : null}
      <span role="status" className="voice-input-status text-sm text-muted-foreground">{phase === "starting" ? "Waiting for microphone permission…" : phase === "recording" ? `Recording · ${seconds}/60 seconds` : phase === "transcribing" ? "Transcribing your recording…" : "Speak your request, then review the text."}</span>
    </div>
    <p className="voice-input-notice text-xs text-muted-foreground">When you stop, audio is sent to OpenAI for transcription. Aplyk does not save the recording. Leave out personal and contact details.</p>
    {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
  </div>
}
