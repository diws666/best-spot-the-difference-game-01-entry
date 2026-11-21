// Harbor Lights — synthesised audio (WebAudio). No sound files; every sound is generated here.
const AudioContext = window.AudioContext || window.webkitAudioContext;

let ctx;
let master;

function ensure() {
  if (!ctx) {
    ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0.55;
    gain.connect(ctx.destination);
    master = gain;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq, type = 'sine', duration, when = null, volume = 0.12) {
  const c = ensure();
  const t = when === null ? c.currentTime : when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + duration);
}

const audio = {
  // Satisfying chime when a difference is found (rising arpeggio).
  find: () => {
    const c = ensure();
    const t = c.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => playTone(f, 'sine', 0.12, t + i * 0.06, 0.1));
  },
  // Low buzz for a wrong click / time penalty.
  wrong: () => {
    const c = ensure();
    const t = c.currentTime;
    playTone(110, 'sawtooth', 0.25, t, 0.1);
    playTone(92, 'sawtooth', 0.25, t + 0.08, 0.08);
  },
  // Small UI click.
  click: () => playTone(900, 'square', 0.05, null, 0.05),
  // Subtle timer tick (played sparingly by the caller).
  tick: () => playTone(1600, 'square', 0.03, null, 0.03),
  // Win fanfare.
  win: () => {
    const c = ensure();
    const t = c.currentTime;
    [523, 659, 784, 1047, 1318].forEach((f, i) => playTone(f, 'sine', 0.18, t + i * 0.09, 0.12));
  },
  // Lose sound.
  lose: () => {
    const c = ensure();
    const t = c.currentTime;
    [220, 165, 130].forEach((f, i) => playTone(f, 'sawtooth', 0.2, t + i * 0.12, 0.12));
  },
};

export { audio, playTone };
