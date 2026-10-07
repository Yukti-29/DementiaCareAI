let currentAmbientCtx: AudioContext | null = null;

// Meditative soothing chime using Web Audio API
export function playChime(type: 'gentle' | 'bell' | 'confirm' | 'alert' = 'gentle') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'bell') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // Solfeggio soothing 528Hz
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } else if (type === 'confirm') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2); // E5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'alert') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // AudioContext blocked or not supported
  }
}

// Play gentle Indian classical Tanpura drone (Sa-Pa resonance) for Bhajan immersion
export function playTanpuraDrone(durationSeconds: number = 8, onEnd?: () => void) {
  try {
    stopTanpuraDrone();
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    currentAmbientCtx = ctx;

    const baseFreq = 138.59; // C#3 (traditional warm Indian scale)
    const fifthFreq = 207.65; // G#3 (Pancham)
    const octFreq = 277.18; // C#4 (Taar Sa)

    const frequencies = [fifthFreq, octFreq, octFreq, baseFreq];
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);
    masterGain.connect(ctx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const staggerTime = ctx.currentTime + (idx * 0.45);
      noteGain.gain.setValueAtTime(0.01, staggerTime);
      noteGain.gain.linearRampToValueAtTime(0.06, staggerTime + 0.3);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(staggerTime);
      osc.stop(ctx.currentTime + durationSeconds);
    });

    setTimeout(() => {
      if (onEnd) onEnd();
    }, durationSeconds * 1000);
  } catch {
    // ignore audio block
  }
}

export function stopTanpuraDrone() {
  try {
    if (currentAmbientCtx) {
      currentAmbientCtx.close();
      currentAmbientCtx = null;
    }
  } catch {
    // ignore
  }
}

export function speakMessage(
  text: string,
  lang: string = 'en-IN',
  rate: number = 0.85,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.rate = rate; // gentle, comforting tempo for elders
      utterance.pitch = 1.02;

      // Select best voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        // Look for matching Indian English or Hindi voices
        const preferredVoice =
          voices.find(v => v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes('India') || v.name.includes('Hindi') || v.lang.includes('IN'))) ||
          voices.find(v => v.lang.startsWith(lang.slice(0, 2))) ||
          voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      if (onStart) utterance.onstart = onStart;
      if (onEnd) utterance.onend = onEnd;
      if (onError) {
        utterance.onerror = (e) => {
          if (e.error !== 'canceled') {
            onError();
          }
        };
      }

      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  } catch {
    if (onEnd) onEnd();
  }
}

export function stopSpeech() {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}
