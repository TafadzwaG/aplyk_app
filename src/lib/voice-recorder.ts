export type VoiceRecording = { stop: () => Promise<Blob>; cancel: () => void }

export async function startVoiceRecording(onLimit: () => void): Promise<VoiceRecording> {
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.AudioWorkletNode) {
    throw new Error("Microphone input is unavailable in this browser. Open this page in Chrome or Edge on localhost or HTTPS, or type your request.")
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
  let context: AudioContext | undefined
  try {
    context = new AudioContext()
    await context.audioWorklet.addModule("/voice-recorder.js")
    await context.resume()
    const audioContext = context
    const source = context.createMediaStreamSource(stream)
    const recorder = new AudioWorkletNode(context, "voice-recorder")
    const silent = context.createGain()
    silent.gain.value = 0
    source.connect(recorder).connect(silent).connect(context.destination)
    const chunks: Float32Array[] = []
    let stopped = false
    let cancelled = false
    let finish!: () => void
    const finished = new Promise<void>(resolve => { finish = resolve })
    function release() {
      stream.getTracks().forEach(track => track.stop())
      source.disconnect()
      recorder.disconnect()
      silent.disconnect()
      void audioContext.close()
    }
    recorder.port.onmessage = ({ data }: MessageEvent<{ samples?: Float32Array; done?: boolean }>) => {
      if (cancelled) return
      if (data.samples) chunks.push(data.samples)
      if (data.done) {
        release()
        finish()
        if (!stopped) onLimit()
      }
    }
    return {
      cancel() {
        cancelled = true
        stopped = true
        chunks.length = 0
        recorder.port.onmessage = null
        release()
        finish()
      },
      async stop() {
        if (!stopped) { stopped = true; recorder.port.postMessage("stop") }
        await finished
        if (cancelled) throw new Error("Recording cancelled")
        const count = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
        if (count < audioContext.sampleRate / 10) throw new Error("No audio was captured. Try recording again.")
        const input = new AudioBuffer({ length: count, sampleRate: audioContext.sampleRate, numberOfChannels: 1 })
        let offset = 0
        for (const chunk of chunks) { input.getChannelData(0).set(chunk, offset); offset += chunk.length }
        chunks.length = 0
        const samples = Math.min(16000 * 60, Math.floor(count * 16000 / audioContext.sampleRate))
        const offline = new OfflineAudioContext(1, samples, 16000)
        const playback = offline.createBufferSource()
        playback.buffer = input
        playback.connect(offline.destination)
        playback.start()
        const pcm = (await offline.startRendering()).getChannelData(0)
        const wav = new ArrayBuffer(44 + pcm.length * 2)
        const view = new DataView(wav)
        const label = (at: number, text: string) => [...text].forEach((char, i) => view.setUint8(at + i, char.charCodeAt(0)))
        label(0, "RIFF"); view.setUint32(4, wav.byteLength - 8, true); label(8, "WAVEfmt ")
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
        view.setUint32(24, 16000, true); view.setUint32(28, 32000, true)
        view.setUint16(32, 2, true); view.setUint16(34, 16, true); label(36, "data")
        view.setUint32(40, pcm.length * 2, true)
        pcm.forEach((sample, i) => view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, sample)) * (sample < 0 ? 32768 : 32767), true))
        return new Blob([wav], { type: "audio/wav" })
      },
    }
  } catch (error) {
    stream.getTracks().forEach(track => track.stop())
    if (context && context.state !== "closed") void context.close()
    throw error
  }
}
