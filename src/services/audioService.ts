/**
 * Audio Service for KabarSatu
 * Plays the user's custom intro audio (/sounds/intro.mp3) with crystal clarity
 * and handles browser autoplay restrictions gracefully.
 */

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private hasPlayedIntro = false;
  private gestureListenerAttached = false;

  constructor() {
    this.setupAutoplayUnlock();
  }

  private setupAutoplayUnlock() {
    if (typeof window === 'undefined') return;

    const unlockOnGesture = () => {
      if (!this.hasPlayedIntro) {
        this.playFuturisticChime();
      }
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };

    if (!this.gestureListenerAttached) {
      window.addEventListener('pointerdown', unlockOnGesture, { once: true });
      window.addEventListener('keydown', unlockOnGesture, { once: true });
      this.gestureListenerAttached = true;
    }
  }

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
   * Plays the intro audio (User's custom sound first: /sounds/intro.mp3 or /intro.mp3)
   */
  public async playFuturisticChime(): Promise<boolean> {
    try {
      // 1. Try user's custom audio file from /sounds/intro.mp3
      const playedSoundsPath = await this.tryPlayAudioFile('/sounds/intro.mp3');
      if (playedSoundsPath) {
        this.hasPlayedIntro = true;
        return true;
      }

      // 2. Try fallback path /intro.mp3
      const playedRootPath = await this.tryPlayAudioFile('/intro.mp3');
      if (playedRootPath) {
        this.hasPlayedIntro = true;
        return true;
      }

      // 3. Fallback to Web Audio API synthesizer
      await this.playSyntheticChime();
      this.hasPlayedIntro = true;
      return true;
    } catch (err) {
      console.log('Audio playback waiting for gesture:', err);
      return false;
    }
  }

  /**
   * Directly plays the user's uploaded MP3 audio file
   */
  public tryPlayAudioFile(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }

        const audio = new Audio(url);
        audio.volume = 1.0;
        this.currentAudio = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => resolve(true))
            .catch(() => resolve(false));
        } else {
          resolve(true);
        }
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Ambient synthesizer fallback
   */
  public async playSyntheticChime(): Promise<void> {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const notes = [
      { freq: 440.00, delay: 0.00, duration: 1.4 },
      { freq: 554.37, delay: 0.08, duration: 1.5 },
      { freq: 659.25, delay: 0.16, duration: 1.6 },
      { freq: 880.00, delay: 0.24, duration: 1.8 },
      { freq: 1108.73, delay: 0.32, duration: 2.0 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.25, now);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, delay, duration }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      noteGain.gain.setValueAtTime(0.0001, now + delay);
      noteGain.gain.exponentialRampToValueAtTime(0.4, now + delay + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + duration);
    });
  }
}

export const audioService = new AudioService();
