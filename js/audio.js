// Tiny synthesized sound effects (no audio files needed).
let ctx = null;
let enabled = true;

export const setSound = (on) => { enabled = on; };

const ac = () => {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { ctx = null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
};

const tone = (freq, dur = 0.1, type = 'sine', vol = 0.12, slide = 0, delay = 0) => {
  if (!enabled) return;
  const a = ac();
  if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
};

export const sfx = {
  unlock: () => ac(),
  tap: () => tone(660, 0.06, 'triangle', 0.08),
  pick: () => { tone(520, 0.07, 'triangle', 0.1); tone(780, 0.07, 'triangle', 0.08, 0, 0.05); },
  place: () => tone(330, 0.08, 'square', 0.05, -80),
  start: () => tone(220, 0.25, 'sawtooth', 0.03, 120),
  done: () => { tone(880, 0.09, 'sine', 0.12); tone(1320, 0.12, 'sine', 0.1, 0, 0.08); },
  warn: () => tone(440, 0.07, 'square', 0.04),
  burn: () => tone(180, 0.4, 'sawtooth', 0.06, -100),
  nope: () => tone(160, 0.12, 'square', 0.05, -40),
  trash: () => tone(300, 0.18, 'triangle', 0.08, -200),
  serve: () => { tone(988, 0.08, 'sine', 0.12); tone(1319, 0.1, 'sine', 0.1, 0, 0.07); tone(1760, 0.14, 'sine', 0.08, 0, 0.14); },
  arrive: () => { tone(740, 0.06, 'triangle', 0.06); tone(988, 0.08, 'triangle', 0.06, 0, 0.06); },
  leave: () => { tone(392, 0.15, 'triangle', 0.08); tone(294, 0.25, 'triangle', 0.08, 0, 0.12); },
  rush: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, 'square', 0.05, 0, i * 0.07)),
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.2, 'triangle', 0.1, 0, i * 0.11)),
  lose: () => [392, 349, 311, 262].forEach((f, i) => tone(f, 0.25, 'triangle', 0.09, 0, i * 0.16)),
  star: (i) => tone(880 + i * 220, 0.18, 'sine', 0.12),
  hop: () => tone(500, 0.05, 'sine', 0.03, 200),
};
