// Progress is stored on this device only. No accounts, no servers.
const KEY = 'hop-to-it-v1';

const fresh = () => ({
  stars: {}, best: {}, wallet: 0, upgrades: {},
  settings: { sound: true, relaxed: false, hints: true },
  seenTut: {},
});

export const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const d = JSON.parse(raw);
    const f = fresh();
    return { ...f, ...d, settings: { ...f.settings, ...(d.settings || {}) } };
  } catch {
    return fresh();
  }
};

export const store = (data) => {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
};

export const reset = () => {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  return fresh();
};

export const totalStars = (save) => Object.values(save.stars).reduce((a, b) => a + b, 0);
export const upg = (save, id) => save.upgrades[id] || 0;
