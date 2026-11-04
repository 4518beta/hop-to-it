import { load } from './save.js';
import { UI } from './ui.js';

const stage = document.getElementById('stage');

const fit = () => {
  const s = Math.min(window.innerWidth / 1000, window.innerHeight / 620);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  document.body.classList.toggle('portrait', window.innerHeight > window.innerWidth * 1.1);
};
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', () => setTimeout(fit, 200));
fit();

const ui = new UI(stage, load());
window.mochiUI = ui;
ui.title();
