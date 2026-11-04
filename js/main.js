import { load } from './save.js';
import { UI } from './ui.js';

const stage = document.getElementById('stage');

// Fit the 1000x620 stage into the part of the screen that is actually visible
// (visualViewport ignores browser toolbars), and keep it centered.
let fitQueued = false;
const fit = () => {
  fitQueued = false;
  const vv = window.visualViewport;
  const w = vv ? vv.width : window.innerWidth;
  const h = vv ? vv.height : window.innerHeight;
  const s = Math.min(w / 1000, h / 620) * 0.985;
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  stage.style.left = `${(vv ? vv.offsetLeft : 0) + w / 2}px`;
  stage.style.top = `${(vv ? vv.offsetTop : 0) + h / 2}px`;
  document.body.classList.toggle('portrait', h > w * 1.1);
};
const queueFit = () => {
  if (fitQueued) return;
  fitQueued = true;
  requestAnimationFrame(fit);
};
window.addEventListener('resize', queueFit);
window.visualViewport?.addEventListener('resize', queueFit);
window.visualViewport?.addEventListener('scroll', queueFit);
window.addEventListener('orientationchange', () => setTimeout(fit, 250));
fit();

// Block browser zoom gestures inside the game (pinch, double tap, ctrl+wheel).
['gesturestart', 'gesturechange', 'gestureend'].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
let lastTouch = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouch < 320) e.preventDefault();
  lastTouch = now;
}, { passive: false });
document.addEventListener('dblclick', (e) => e.preventDefault());
document.addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Fullscreen toggle (hides browser bars on phones and tablets).
const fsBtn = document.getElementById('fs');
const canFs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
if (fsBtn && canFs) {
  fsBtn.addEventListener('click', () => {
    const d = document;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else {
      const p = (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen).call(document.documentElement);
      p?.then?.(() => screen.orientation?.lock?.('landscape').catch(() => {})).catch(() => {});
    }
  });
  document.addEventListener('fullscreenchange', () => setTimeout(fit, 120));
} else if (fsBtn) fsBtn.remove();

const ui = new UI(stage, load());
window.mochiUI = ui;
ui.title();
