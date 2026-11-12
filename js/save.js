// Progress is stored on this device only. No accounts, no servers.
import { RETIRED_UPGRADES, RETIRED_APPLIANCES, appKey } from './data.js';
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
    const out = { ...f, ...d, settings: { ...f.settings, ...(d.settings || {}) }, upgrades: { ...(d.upgrades || {}) } };
    // Refund upgrades that were replaced by per-appliance models.
    Object.entries(RETIRED_UPGRADES).forEach(([id, costs]) => {
      const lvl = out.upgrades[id] || 0;
      if (lvl) out.wallet += costs.slice(0, lvl).reduce((a, b) => a + b, 0);
      delete out.upgrades[id];
    });
    // Appliances used to be shared by every city; refund those models.
    Object.entries(RETIRED_APPLIANCES).forEach(([type, costs]) => {
      const id = `app_${type}`;
      const lvl = out.upgrades[id] || 0;
      if (lvl) out.wallet += costs.slice(0, lvl).reduce((a, b) => a + b, 0);
      delete out.upgrades[id];
    });
    return out;
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
export const tier = (save, world, type) => save.upgrades[appKey(world, type)] || 0;
