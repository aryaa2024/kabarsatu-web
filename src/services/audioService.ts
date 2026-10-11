/**
 * Audio Service for KabarSatu
 * Generates a pleasant futuristic chime using Web Audio API synthesis
 * with an optional fallback to /sounds/intro.mp3 if available.
 */

class AudioService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    return this.audioCtx;
  }

  /**
   * Plays a futuristic, calm, crystal-clear chime using Web Audio API synthesis.
   * Chords: F4 -> A4 -> C5 -> E5 (Lush Modern Ambient sound)
   */
  public async playFuturisticChime(): Promise<void> {
    try {
      // First attempt to play static mp3 file if it exists
      const hasAudioFile = await this.tryPlayAudioFile('/sounds/intro.mp3');
      if (hasAudioFile) return;

      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      // High-tech chord: D5 (587.33Hz), F#5 (739.99Hz), A5 (880Hz), D6 (1174.66Hz)
      const notes = [
        { freq: 440.00, delay: 0.00, duration: 1.4 },  // A4
        { freq: 554.37, delay: 0.08, duration: 1.5 },  // C#5
        { freq: 659.25, delay: 0.16, duration: 1.6 },  // E5
        { freq: 880.00, delay: 0.24, duration: 1.8 },  // A5
        { freq: 1108.73, delay: 0.32, duration: 2.0 }, // C#6
      ];

      // Master gain for warmth and gentleness
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, now);
      masterGain.connect(ctx.destination);

      notes.forEach(({ freq, delay, duration }) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Blend sine with gentle triangle for tech-modern warmth
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        // Exponential decay envelope
        noteGain.gain.setValueAtTime(0.0001, now + delay);
        noteGain.gain.exponentialRampToValueAtTime(0.4, now + delay + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + delay);
        osc.stop(now + delay + duration);
      });
    } catch (err) {
      console.log('Audio chime auto-play info:', err);
    }
  }

  private async tryPlayAudioFile(url: string): Promise<boolean> {
    try {
      const audio = new Audio(url);
      audio.volume = 0.4;
      await audio.play();
      return true;
    } catch {
      return false; // Fallback to synth chime
    }
  }
}

export const audioService = new AudioService();
