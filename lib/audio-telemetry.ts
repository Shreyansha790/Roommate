// Cyber-Cartographic Web Audio Telemetry Engine
// 100% Browser-Native Web Audio API synthesis - zero external audio asset dependencies.

const STORAGE_KEY = "roommatesphere_sound_muted";
const SOUND_TOGGLE_EVENT = "telemetry-sound-toggled";

class AudioTelemetryEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        // Default to unmuted (false) unless explicitly muted by user
        this.muted = stored === "true";
      } catch {
        this.muted = false;
      }
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {
        // Autoplay policy prevented resume until explicit user gesture
      });
    }

    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, String(muted));
        window.dispatchEvent(
          new CustomEvent(SOUND_TOGGLE_EVENT, { detail: { muted } })
        );
      } catch {
        // LocalStorage fallback
      }
    }
  }

  public toggleMute(): boolean {
    const newState = !this.muted;
    this.setMuted(newState);
    if (!newState) {
      this.playToggle(true);
    }
    return newState;
  }

  /**
   * Short crisp UI interaction blip (sine oscillator with exponential decay)
   */
  public playBlip(freq: number = 880, duration: number = 0.035): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio execution error ignored
    }
  }

  /**
   * Resonant tactical radar sonar ping (triangle wave + bandpass filter Q=6)
   */
  public playPing(freq: number = 1200, duration: number = 0.15): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + duration);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.setValueAtTime(6, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio execution error ignored
    }
  }

  /**
   * 4-note ascending cyber arpeggio (C5 -> E5 -> G5 -> C6)
   */
  public playSuccess(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const noteDuration = 0.06;

    try {
      const startTime = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const noteStart = startTime + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.09, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    } catch {
      // Audio execution error ignored
    }
  }

  /**
   * Dual-tone chirp for state changes (440->880Hz for ON, 880->440Hz for OFF)
   */
  public playToggle(state?: boolean): void {
    if (this.muted && state !== true) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const isOpening = state ?? true;
    const startFreq = isOpening ? 440 : 880;
    const endFreq = isOpening ? 880 : 440;
    const duration = 0.08;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio execution error ignored
    }
  }

  /**
   * Sawtooth alert tone with frequency drop for warnings / validation errors
   */
  public playWarning(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.18);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio execution error ignored
    }
  }

  /**
   * Tactical radar sweep pulse
   */
  public playScan(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio execution error ignored
    }
  }
}

// Global Singleton Instance
export const audioTelemetry = new AudioTelemetryEngine();

// Convenience helper wrappers
export const playBlip = (freq?: number, duration?: number) => audioTelemetry.playBlip(freq, duration);
export const playPing = (freq?: number, duration?: number) => audioTelemetry.playPing(freq, duration);
export const playSuccess = () => audioTelemetry.playSuccess();
export const playToggle = (state?: boolean) => audioTelemetry.playToggle(state);
export const playWarning = () => audioTelemetry.playWarning();
export const playScan = () => audioTelemetry.playScan();
export const isAudioMuted = () => audioTelemetry.isMuted();
export const toggleAudioMute = () => audioTelemetry.toggleMute();
export const setAudioMuted = (muted: boolean) => audioTelemetry.setMuted(muted);
