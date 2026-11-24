/* global AudioWorkletProcessor, registerProcessor, sampleRate */
class VoiceRecorder extends AudioWorkletProcessor {
  constructor() {
    super()
    this.active = true
    this.frames = 0
    this.buffer = []
    this.port.onmessage = () => this.finish()
  }
  flush() {
    if (this.buffer.length) {
      const samples = new Float32Array(this.buffer)
      this.port.postMessage({ samples }, [samples.buffer])
      this.buffer = []
    }
  }
  finish() {
    if (!this.active) return
    this.active = false
    this.flush()
    this.port.postMessage({ done: true })
  }
  process(inputs) {
    if (!this.active) return false
    const channel = inputs[0]?.[0]
    if (channel) {
      const remaining = Math.min(channel.length, sampleRate * 60 - this.frames)
      for (let i = 0; i < remaining; i++) this.buffer.push(channel[i])
      this.frames += remaining
      if (this.buffer.length >= 4096) this.flush()
      if (this.frames >= sampleRate * 60) this.finish()
    }
    return this.active
  }
}
registerProcessor("voice-recorder", VoiceRecorder)
