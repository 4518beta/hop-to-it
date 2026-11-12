// Original SVG art for Hop to It! (MIT). Food and UI icons come from js/icons.js (Fluent Emoji, MIT).
import { ITEMS } from './data.js';
import { ICONS } from './icons.js';

const INK = '#6b4a63';

export const ic = (name, cls = '') => `<span class="ic ${cls}">${ICONS[name] || ''}</span>`;

// ---------------------------------------------------------------------------
// Mochi: a round, mochi-shaped bunny chef in a kawaii sticker style.
// Pastel palette: cream fur, peach ears, mint toque, lavender bow, butter-yellow apron.
export const bunnySVG = () => `
<svg class="bunny-svg" viewBox="0 -34 130 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="65" cy="160" rx="36" ry="6" fill="rgba(107,74,99,.16)"/>
  <!-- cotton tail -->
  <circle cx="99" cy="134" r="9" fill="#fffdf9" stroke="${INK}" stroke-width="3"/>
  <!-- feet -->
  <ellipse cx="50" cy="153" rx="12" ry="7.5" fill="#fffdf9" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="80" cy="153" rx="12" ry="7.5" fill="#fffdf9" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="50" cy="154" rx="5" ry="3" fill="#ffc9d6"/>
  <ellipse cx="80" cy="154" rx="5" ry="3" fill="#ffc9d6"/>
  <!-- round body -->
  <ellipse cx="65" cy="128" rx="31" ry="27" fill="#fffdf9" stroke="${INK}" stroke-width="3"/>
  <!-- apron -->
  <path d="M44 112 Q65 106 86 112 L84 140 Q65 150 46 140 Z" fill="#fff0b3" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M58 124 h14 v9 q-7 4 -14 0 z" fill="#ffe08a" stroke="${INK}" stroke-width="2"/>
  <path d="M65 126 l-2.6 6 h5.2 z" fill="#ffad6b"/><path d="M64 125 l-2 -3 M66 125 l2 -3" stroke="#7fcf9a" stroke-width="1.8" stroke-linecap="round"/>
  <!-- paws -->
  <g class="arms">
    <circle cx="38" cy="124" r="9" fill="#fffdf9" stroke="${INK}" stroke-width="3"/>
    <circle cx="92" cy="124" r="9" fill="#fffdf9" stroke="${INK}" stroke-width="3"/>
  </g>
  <!-- ears -->
  <g class="ear ear-l">
    <path d="M42 44 C34 20 30 -10 42 -16 C54 -21 60 10 58 40 Z" fill="#fffdf9" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M45 36 C40 18 38 -4 44 -8 C51 -11 54 12 53 34 Z" fill="#ffd0c2"/>
  </g>
  <g class="ear ear-r">
    <path d="M72 40 C70 14 78 -2 90 -4 C102 -5 104 6 96 12 C88 18 86 26 88 42 Z" fill="#fffdf9" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M77 34 C76 16 81 5 89 4 C96 3 96 8 91 12 C85 17 82 24 83 34 Z" fill="#ffd0c2"/>
  </g>
  <!-- big round mochi head -->
  <ellipse cx="65" cy="68" rx="47" ry="38" fill="#fffdf9" stroke="${INK}" stroke-width="3.2"/>
  <!-- mint chef toque -->
  <g transform="translate(64 34) rotate(-8)">
    <circle cx="-9" cy="-10" r="8.5" fill="#ffffff" stroke="${INK}" stroke-width="2.6"/>
    <circle cx="9" cy="-10" r="8.5" fill="#ffffff" stroke="${INK}" stroke-width="2.6"/>
    <circle cx="0" cy="-15" r="9.5" fill="#ffffff" stroke="${INK}" stroke-width="2.6"/>
    <rect x="-14" y="-6" width="28" height="11" rx="5" fill="#b8eedd" stroke="${INK}" stroke-width="2.6"/>
    <rect x="-11" y="-9" width="22" height="5" fill="#ffffff"/>
    <circle cx="6" cy="-0.5" r="2.2" fill="#ffadc6"/>
  </g>
  <!-- eyes open -->
  <g class="eyes-open">
    <g class="eye"><ellipse cx="46" cy="72" rx="5.6" ry="7.2" fill="#4a3348"/><circle cx="44.2" cy="69.2" r="2.3" fill="#fff"/><circle cx="47.8" cy="75.2" r="1.1" fill="#fff"/></g>
    <g class="eye"><ellipse cx="84" cy="72" rx="5.6" ry="7.2" fill="#4a3348"/><circle cx="82.2" cy="69.2" r="2.3" fill="#fff"/><circle cx="85.8" cy="75.2" r="1.1" fill="#fff"/></g>
  </g>
  <g class="eyes-happy">
    <path d="M40 74 Q46 66 52 74" stroke="#4a3348" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M78 74 Q84 66 90 74" stroke="#4a3348" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  </g>
  <g class="eyes-oops">
    <path d="M41 68 l9 4.5 l-9 4.5" stroke="#4a3348" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M89 68 l-9 4.5 l9 4.5" stroke="#4a3348" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <!-- blush -->
  <ellipse cx="33" cy="83" rx="9" ry="5.5" fill="#ffb3c8" opacity=".85"/>
  <ellipse cx="97" cy="83" rx="9" ry="5.5" fill="#ffb3c8" opacity=".85"/>
  <path d="M29 82 l2 -3 M33 82 l2 -3 M37 82 l2 -3 M93 82 l2 -3 M97 82 l2 -3 M101 82 l2 -3" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>
  <!-- mouth -->
  <path class="mouth" d="M60 81 Q62.5 84.5 65 81 Q67.5 84.5 70 81" stroke="#4a3348" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- lavender bow -->
  <g transform="translate(65 103)">
    <path d="M0 0 L-13 -7 Q-16 0 -13 7 Z" fill="#d6c4ff" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M0 0 L13 -7 Q16 0 13 7 Z" fill="#d6c4ff" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
    <circle r="4" fill="#bfa8ff" stroke="${INK}" stroke-width="2.4"/>
  </g>
</svg>`;

// ---------------------------------------------------------------------------
// Customers: pastel animal guests.
const PALETTES = {
  cat: { fur: '#ffe0b8', inner: '#ffc2c9', shirt: '#b9d8ff' },
  fox: { fur: '#ffc49b', inner: '#fff4ea', shirt: '#b8eedd' },
  bear: { fur: '#e9c7ad', inner: '#f8e2d0', shirt: '#ffc2d4' },
  frog: { fur: '#c4efb0', inner: '#e3fad6', shirt: '#fff0b3' },
  panda: { fur: '#ffffff', inner: '#6b5a70', shirt: '#d6c4ff' },
  owl: { fur: '#d6c4ff', inner: '#fff1cf', shirt: '#ffd6b0' },
  duck: { fur: '#fff1a8', inner: '#ffc08a', shirt: '#bfe6f5' },
  mouse: { fur: '#e6e1ec', inner: '#ffc9d6', shirt: '#c6f0d8' },
  pup: { fur: '#f5e3cc', inner: '#d9b39a', shirt: '#ffc2d4' },
  raccoon: { fur: '#d3d3dd', inner: '#8d879a', shirt: '#ffe39a' },
};

const earsFor = (a, p) => {
  const s = `stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"`;
  switch (a) {
    case 'cat': return `<path d="M24 34 L28 8 L44 24 Z" fill="${p.fur}" ${s}/><path d="M76 34 L72 8 L56 24 Z" fill="${p.fur}" ${s}/><path d="M29 28 L30 16 L38 24Z" fill="${p.inner}"/><path d="M71 28 L70 16 L62 24Z" fill="${p.inner}"/>`;
    case 'fox': return `<path d="M20 36 L24 2 L46 22 Z" fill="${p.fur}" ${s}/><path d="M80 36 L76 2 L54 22 Z" fill="${p.fur}" ${s}/><path d="M27 26 L28 13 L38 22Z" fill="${p.inner}"/><path d="M73 26 L72 13 L62 22Z" fill="${p.inner}"/>`;
    case 'bear': case 'panda': case 'raccoon': {
      const ec = a === 'panda' ? p.inner : p.fur;
      return `<circle cx="27" cy="22" r="11" fill="${ec}" ${s}/><circle cx="73" cy="22" r="11" fill="${ec}" ${s}/>${a === 'bear' ? `<circle cx="27" cy="22" r="5" fill="${p.inner}"/><circle cx="73" cy="22" r="5" fill="${p.inner}"/>` : ''}`;
    }
    case 'pup': return `<path d="M22 26 Q10 30 14 56 Q24 52 30 34 Z" fill="${p.inner}" ${s}/><path d="M78 26 Q90 30 86 56 Q76 52 70 34 Z" fill="${p.inner}" ${s}/>`;
    case 'mouse': return `<circle cx="22" cy="24" r="15" fill="${p.fur}" ${s}/><circle cx="78" cy="24" r="15" fill="${p.fur}" ${s}/><circle cx="22" cy="24" r="8" fill="${p.inner}"/><circle cx="78" cy="24" r="8" fill="${p.inner}"/>`;
    case 'owl': return `<path d="M26 26 L22 8 L40 20Z" fill="${p.fur}" ${s}/><path d="M74 26 L78 8 L60 20Z" fill="${p.fur}" ${s}/>`;
    default: return '';
  }
};

const faceFor = (a, p) => {
  const eyeY = a === 'frog' ? 30 : 50;
  let extra = '';
  if (a === 'panda') extra += `<ellipse cx="37" cy="50" rx="8" ry="10" transform="rotate(-20 37 50)" fill="${p.inner}"/><ellipse cx="63" cy="50" rx="8" ry="10" transform="rotate(20 63 50)" fill="${p.inner}"/>`;
  if (a === 'raccoon') extra += `<path d="M24 48 Q50 40 76 48 Q72 58 60 56 Q50 52 40 56 Q28 58 24 48Z" fill="${p.inner}"/>`;
  if (a === 'owl') extra += `<circle cx="37" cy="50" r="11" fill="${p.inner}"/><circle cx="63" cy="50" r="11" fill="${p.inner}"/>`;
  if (a === 'fox') extra += `<path d="M30 58 Q50 76 70 58 Q66 72 50 74 Q34 72 30 58Z" fill="${p.inner}"/>`;
  if (a === 'frog') extra += `<circle cx="36" cy="30" r="11" fill="${p.fur}" stroke="${INK}" stroke-width="2.6"/><circle cx="64" cy="30" r="11" fill="${p.fur}" stroke="${INK}" stroke-width="2.6"/>`;
  const eyeC = a === 'panda' || a === 'raccoon' ? '#fff' : '#4a3348';
  const hl = eyeC === '#fff' ? '#4a3348' : '#fff';
  let mouth = `<path d="M45 62 Q47.5 65 50 62 Q52.5 65 55 62" stroke="#4a3348" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  if (a === 'duck') mouth = `<ellipse cx="50" cy="62" rx="9" ry="4.5" fill="${p.inner}" stroke="${INK}" stroke-width="2.2"/>`;
  if (a === 'owl') mouth = `<path d="M46 58 L54 58 L50 64Z" fill="#ffc08a" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`;
  return `${extra}
    <g class="c-eyes"><ellipse cx="37" cy="${eyeY}" rx="3.8" ry="4.8" fill="${eyeC}"/><ellipse cx="63" cy="${eyeY}" rx="3.8" ry="4.8" fill="${eyeC}"/>
    <circle cx="35.8" cy="${eyeY - 1.8}" r="1.5" fill="${hl}"/><circle cx="61.8" cy="${eyeY - 1.8}" r="1.5" fill="${hl}"/></g>
    <g class="c-eyes-happy"><path d="M32 ${eyeY + 1} Q37 ${eyeY - 5} 42 ${eyeY + 1}" stroke="${eyeC}" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M58 ${eyeY + 1} Q63 ${eyeY - 5} 68 ${eyeY + 1}" stroke="${eyeC}" stroke-width="2.8" fill="none" stroke-linecap="round"/></g>
    <g class="c-eyes-mad"><path d="M31 ${eyeY - 6} l10 4 M69 ${eyeY - 6} l-10 4" stroke="#4a3348" stroke-width="2.6" stroke-linecap="round"/></g>
    <ellipse cx="27" cy="61" rx="6.5" ry="4" fill="#ffb3c8" opacity=".8"/><ellipse cx="73" cy="61" rx="6.5" ry="4" fill="#ffb3c8" opacity=".8"/>
    ${mouth}`;
};

export const customerSVG = (animal, shirtShift = 0) => {
  const p = PALETTES[animal] || PALETTES.cat;
  const hue = shirtShift ? `style="filter:hue-rotate(${shirtShift}deg)"` : '';
  return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="146" rx="30" ry="4" fill="rgba(107,74,99,.18)"/>
    <rect x="33" y="122" width="13" height="22" rx="6" fill="${p.fur}" stroke="${INK}" stroke-width="2.4"/>
    <rect x="54" y="122" width="13" height="22" rx="6" fill="${p.fur}" stroke="${INK}" stroke-width="2.4"/>
    <path ${hue} d="M20 128 Q16 90 50 86 Q84 90 80 128 Q50 134 20 128 Z" fill="${p.shirt}" stroke="${INK}" stroke-width="2.6"/>
    <circle cx="22" cy="112" r="7" fill="${p.fur}" stroke="${INK}" stroke-width="2.4"/><circle cx="78" cy="112" r="7" fill="${p.fur}" stroke="${INK}" stroke-width="2.4"/>
    ${earsFor(animal, p)}
    <ellipse cx="50" cy="52" rx="33" ry="${animal === 'frog' ? 27 : 31}" fill="${p.fur}" stroke="${INK}" stroke-width="2.8"/>
    ${faceFor(animal, p)}
  </svg>`;
};

// ---------------------------------------------------------------------------
// Kitchen stations, pastel with little faces. viewBox 0 0 100 100.
const S = `stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"`;
const face = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">
  <ellipse cx="-7" cy="0" rx="2.2" ry="2.8" fill="#4a3348"/><ellipse cx="7" cy="0" rx="2.2" ry="2.8" fill="#4a3348"/>
  <circle cx="-7.6" cy="-1" r=".8" fill="#fff"/><circle cx="6.4" cy="-1" r=".8" fill="#fff"/>
  <ellipse cx="-12" cy="4" rx="3.6" ry="2.2" fill="#ffb3c8"/><ellipse cx="12" cy="4" rx="3.6" ry="2.2" fill="#ffb3c8"/>
  <path d="M-2.5 3 Q0 5.5 2.5 3" stroke="#4a3348" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
const burner = `<ellipse cx="50" cy="82" rx="34" ry="8" fill="#e6dcf2" ${S}/><ellipse cx="50" cy="80" rx="22" ry="4" fill="#cdbfe0"/>`;
export const STATION_SVG = {
  skillet: `${burner}<path d="M86 66 L99 60" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M86 66 L98 60.5" stroke="#ffc2d4" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="36" ry="12" fill="#a9c7e8" ${S}/><ellipse cx="50" cy="66" rx="29" ry="8" fill="#7f9fc4"/>`,
  pot: `${burner}<path d="M20 40 L22 74 Q50 84 78 74 L80 40 Z" fill="#d6c4ff" ${S}/><ellipse cx="50" cy="40" rx="30" ry="8" fill="#bfa8ff" ${S}/><path d="M14 46 h8 M78 46 h8" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>${face(50, 60)}`,
  oven: `<rect x="10" y="22" width="80" height="70" rx="14" fill="#ffc9b0" ${S}/><rect x="20" y="40" width="60" height="36" rx="8" fill="#fff6ee" ${S}/><circle cx="26" cy="31" r="4" fill="#fff" ${S}/><circle cx="40" cy="31" r="4" fill="#fff" ${S}/><rect x="58" y="28" width="24" height="6" rx="3" fill="#fff" ${S}/>${face(50, 58, 1.1)}`,
  toaster: `<rect x="16" y="38" width="68" height="50" rx="18" fill="#bfe6f5" ${S}/><rect x="30" y="36" width="14" height="6" rx="3" fill="#6b4a63"/><rect x="56" y="36" width="14" height="6" rx="3" fill="#6b4a63"/><rect x="84" y="56" width="6" height="14" rx="3" fill="#ffadc6" ${S}/>${face(50, 64, 1.1)}`,
  juicer: `<rect x="24" y="68" width="52" height="22" rx="10" fill="#fff0b3" ${S}/><path d="M30 68 L36 34 L64 34 L70 68 Z" fill="#fff8e0" ${S}/><path d="M36 34 Q50 22 64 34" fill="#ffd08a" ${S}/>${face(50, 78, .8)}`,
  chop: `<rect x="10" y="62" width="80" height="24" rx="10" fill="#ffd9b8" ${S}/><path d="M60 50 L92 62 L88 68 L56 58Z" fill="#eef3f8" ${S}/><rect x="48" y="48" width="14" height="8" rx="3" transform="rotate(20 55 52)" fill="#ffadc6" ${S}/>${face(32, 74, .8)}`,
  mixer: `<path d="M24 88 h52" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M28 56 Q30 86 50 86 Q70 86 72 56 Z" fill="#e8f4fb" ${S}/><path d="M62 88 L66 24 Q66 14 54 14 L30 14 Q22 14 22 24 L22 34 L52 34 L54 50" fill="#ffc2d4" ${S}/><path d="M50 34 L50 56" stroke="${INK}" stroke-width="3"/>${face(40, 24, .7)}`,
  board: `<rect x="6" y="62" width="88" height="26" rx="10" fill="#fdf6ff" ${S}/><ellipse cx="50" cy="66" rx="24" ry="6" fill="#ffffff" ${S}/>${face(50, 78, .75)}`,
  coffee: `<rect x="22" y="16" width="56" height="20" rx="9" fill="#e9c7ad" ${S}/><rect x="24" y="36" width="16" height="50" rx="4" fill="#e9c7ad" ${S}/><rect x="20" y="84" width="60" height="8" rx="4" fill="#d9b39a" ${S}/><path d="M46 54 L46 82 Q58 88 70 82 L70 54 Z" fill="#f2fbff" ${S}/><path d="M70 60 q8 0 8 8 t-8 8" stroke="${INK}" stroke-width="2.6" fill="none"/>${face(50, 26, .7)}`,
  kettle: `${burner}<path d="M24 72 Q20 38 50 36 Q80 38 76 72 Z" fill="#b8eedd" ${S}/><path d="M76 52 L92 42" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M36 36 Q50 18 64 36" fill="none" stroke="${INK}" stroke-width="4"/>${face(50, 56)}`,
  ricecooker: `<path d="M16 50 Q16 90 50 90 Q84 90 84 50 Z" fill="#fff8f3" ${S}/><path d="M14 50 Q50 24 86 50 Z" fill="#ffc2d4" ${S}/><circle cx="50" cy="34" r="5" fill="#ffadc6" ${S}/>${face(50, 66, 1.1)}`,
  steamer: `${burner}<path d="M18 46 L20 74 Q50 82 80 74 L82 46 Z" fill="#ffe3b3" ${S}/><path d="M20 58 Q50 66 80 58" stroke="#e5bf86" stroke-width="2.4" fill="none"/><ellipse cx="50" cy="46" rx="32" ry="9" fill="#ffd696" ${S}/>${face(50, 66, .9)}`,
};

export const trashSVG = `<svg viewBox="0 0 100 100"><path d="M24 30 L30 92 L70 92 L76 30 Z" fill="#cfe0ef" ${S}/><rect x="18" y="20" width="64" height="12" rx="6" fill="#e3eef8" ${S}/><rect x="42" y="12" width="16" height="9" rx="4" fill="#e3eef8" ${S}/>${face(50, 60)}</svg>`;

export const plateSVG = `<svg viewBox="0 0 100 60"><ellipse cx="50" cy="34" rx="44" ry="18" fill="#fff" ${S}/><ellipse cx="50" cy="32" rx="30" ry="11" fill="#fdf0f5"/></svg>`;

export const binSVG = (color = '#ffd9b8') => `<svg viewBox="0 0 100 70"><path d="M6 20 L94 20 L88 66 L12 66 Z" fill="${color}" ${S}/><path d="M10 36 L90 36 M12 50 L88 50" stroke="#ffffff88" stroke-width="3"/><rect x="2" y="12" width="96" height="12" rx="6" fill="#fff4e8" ${S}/></svg>`;

// ---------------------------------------------------------------------------
// Food items: Fluent Emoji icons dressed with plates, bowls, filters and,
// for finished dishes, a tiny kawaii face.
const KFACE = `<svg class="kface" viewBox="0 0 24 12"><ellipse cx="7" cy="4" rx="1.6" ry="2" fill="#4a3348"/><ellipse cx="17" cy="4" rx="1.6" ry="2" fill="#4a3348"/><ellipse cx="3.5" cy="7.5" rx="2.4" ry="1.4" fill="#ff8fb3" opacity=".8"/><ellipse cx="20.5" cy="7.5" rx="2.4" ry="1.4" fill="#ff8fb3" opacity=".8"/><path d="M10.5 6.5 Q12 8.5 13.5 6.5" stroke="#4a3348" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`;

export const itemHTML = (key, opts = {}) => {
  const it = ITEMS[key];
  if (!it) return '';
  const cls = ['itm'];
  if (it.bowl) cls.push('bowl');
  if (it.p && !it.bowl && opts.plate !== false) cls.push('plated');
  if (it.f) cls.push(`f-${it.f}`);
  if (opts.burned) cls.push('burned');
  if (opts.ghost) cls.push('ghost');
  if (opts.small) cls.push('small');
  const kawaii = it.p && !opts.burned && !opts.ghost && opts.face !== false;
  return `<span class="${cls.join(' ')}" title="${it.n}"><span class="e">${ICONS[it.i] || ''}</span>${it.top ? `<span class="top">${ICONS[it.top] || ''}</span>` : ''}${kawaii ? KFACE : ''}${opts.burned ? `<span class="smoke">${ICONS['dashing-away']}</span>` : ''}</span>`;
};

// ---------------------------------------------------------------------------
// City skylines seen from the street behind the queue.
export const skylineSVG = (theme) => {
  const pal = {
    diner: ['#ffd6e5', '#cfe8f7', '#fff0b3', '#e3d6ff', '#c6ecdf'],
    bakery: ['#e3d6ff', '#ffd6e5', '#fff0b3', '#ffe3c9', '#d6f0ff'],
    noodle: ['#b9b0f0', '#d9c8ff', '#9fd8c7', '#ffd6e5', '#c6d8ff'],
  }[theme];
  const win = theme === 'noodle' ? '#fff3b0' : '#ffffff';
  const blds = [[0, 70, 52], [46, 120, 40], [80, 90, 50], [124, 140, 44], [162, 100, 56], [210, 130, 42], [246, 80, 60]];
  let out = '';
  blds.forEach(([x, h, w], i) => {
    const y = 300 - h;
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${pal[i % pal.length]}" stroke="${INK}" stroke-width="2.4"/>`;
    for (let wy = y + 12; wy < 290; wy += 18) for (let wx = x + 8; wx < x + w - 10; wx += 14) out += `<rect x="${wx}" y="${wy}" width="7" height="9" rx="2" fill="${win}" opacity=".9"/>`;
  });
  if (theme === 'bakery') out += `<path d="M150 130 L162 40 L174 130 Z M154 100 h16" fill="#fff6ee" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  if (theme === 'noodle') out += `<path d="M170 140 L180 50 L190 140 Z M172 110 h16 M176 80 h8" fill="#ffb3c8" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><circle cx="60" cy="90" r="18" fill="#fff6cf"/>`;
  if (theme === 'diner') out += `<circle cx="250" cy="70" r="20" fill="#fff0b3"/><path d="M20 60 q10 -12 22 0 q10 -10 20 2 q-20 8 -42 -2Z" fill="#fff"/>`;
  return `<svg class="skyline-svg" viewBox="0 0 310 300" preserveAspectRatio="xMidYMax slice">${out}</svg>`;
};

// ---------------------------------------------------------------------------
// 3/4 food truck scene. Stage 1000 x 620, HUD covers the top 52px.
const THEME = {
  diner: { truck: '#ff9cc0', truck2: '#fff0b3', wall1: '#fff3d6', wall2: '#ffe2ad', floor1: '#fffaf3', floor2: '#ffe0d2', top: '#fffdfb', face: '#ffd1c0', sky1: '#bfe6f5', sky2: '#eaf7ff', walk: '#ffe9f1' },
  bakery: { truck: '#b9a2f5', truck2: '#fff6ee', wall1: '#efe6ff', wall2: '#dccdfb', floor1: '#fffaf6', floor2: '#ece2ff', top: '#fffdfb', face: '#d9ccfb', sky1: '#ffd6e5', sky2: '#fff3e8', walk: '#f3ecff' },
  noodle: { truck: '#6ccfb0', truck2: '#fff3b0', wall1: '#dff6ee', wall2: '#bfe9da', floor1: '#fbfffd', floor2: '#d6f2e7', top: '#fffdfb', face: '#b7e6d6', sky1: '#8f86d6', sky2: '#c9b8ff', walk: '#e2f6ef' },
};
const counterTopY = (x) => 224 + (372 - x) * 0.4167; // slanted service counter edge

// Floor in the classic 3/4 view: no vanishing point, every tile the same size,
// rows foreshortened so the floor reads as lying flat. Walls and side counters
// use the same parallel projection, so all edges agree.
const perspectiveFloor = (c) => {
  const Y0 = 150; const Y1 = 620; const TW = 62; const TH = 40;
  let out = `<rect x="0" y="${Y0}" width="1000" height="${Y1 - Y0}" fill="${c.floor1}"/>`;
  for (let r = 0; r * TH + Y0 < Y1; r++) {
    for (let k = 0; k * TW < 1000; k++) {
      if ((k + r) % 2) continue;
      out += `<rect x="${k * TW - 8}" y="${Y0 + r * TH}" width="${TW}" height="${TH}" fill="${c.floor2}"/>`;
    }
  }
  // soft contact shadows where the floor meets the counters
  out += `<defs><linearGradient id="fsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a63" stop-opacity=".22"/><stop offset="1" stop-color="#6b4a63" stop-opacity="0"/></linearGradient>
    <linearGradient id="fshr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#6b4a63" stop-opacity=".2"/><stop offset="1" stop-color="#6b4a63" stop-opacity="0"/></linearGradient></defs>
    <rect x="0" y="266" width="1000" height="22" fill="url(#fsh)"/><rect x="852" y="226" width="26" height="394" fill="url(#fshr)"/>`;
  return out;
};

export const truckSceneSVG = (theme) => {
  const c = THEME[theme];
  const S2 = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  // outside view through the service window: sky, skyline, sidewalk
  const win = `M0 52 L540 52 L540 154 L0 ${counterTopY(0) - 6} Z`;
  let g = `<defs><clipPath id="winclip"><path d="${win}"/></clipPath></defs>`;
  g += perspectiveFloor(c);
  g += `<g clip-path="url(#winclip)"><rect x="0" y="52" width="540" height="360" fill="${c.sky2}"/><rect x="0" y="52" width="540" height="120" fill="${c.sky1}" opacity=".7"/>
    <g transform="translate(20 -30) scale(1.15)">${skylineSVG(theme).replace(/<svg[^>]*>|<\/svg>/g, '')}</g>
    <path d="M0 250 L540 120 L540 420 L0 420Z" fill="${c.walk}"/></g>`;
  g += `<path d="${win}" fill="none" ${S2} stroke-width="5"/>`;
  // back wall with tiles, string lights and a pantry shelf
  g += `<rect x="540" y="52" width="460" height="150" fill="${c.wall1}"/>`;
  for (let x = 540; x < 1000; x += 30) for (let y = 52; y < 202; y += 30) if (((x - 540) / 30 + (y - 52) / 30) % 2 === 0) g += `<rect x="${x}" y="${y}" width="30" height="30" fill="${c.wall2}"/>`;
  g += `<path d="M540 52 V202" ${S2}/>`;
  g += `<path d="M548 130 H996" stroke="${INK}" stroke-width="4"/><rect x="548" y="126" width="448" height="9" rx="4" fill="#e9c7ad" ${S2}/>`;
  for (let x = 560; x < 1000; x += 46) g += `<circle cx="${x}" cy="${62 + ((x / 46) % 2) * 3}" r="4.5" fill="#fff3b0" stroke="${INK}" stroke-width="1.5"/>`;
  // back counter: top surface + cabinet face
  g += `<path d="M540 202 L1000 202 L1000 226 L540 226Z" fill="${c.top}" ${S2}/><path d="M540 226 L1000 226 L1000 266 L540 266Z" fill="${c.face}" ${S2}/>`;
  for (let x = 560; x < 990; x += 70) g += `<rect x="${x}" y="233" width="58" height="26" rx="5" fill="#ffffff66" stroke="${INK}" stroke-width="1.5"/>`;
  // right column counter
  g += `<path d="M892 226 L1000 226 L1000 560 L892 560Z" fill="${c.truck2}" ${S2}/>`;
  for (let y = 250; y < 560; y += 34) g += `<path d="M895 ${y} H1000" stroke="${c.face}" stroke-width="2"/>`;
  g += `<path d="M878 232 L892 226 L892 560 L878 566Z" fill="${c.face}" ${S2}/>`;
  // left column counter (under the window)
  g += `<path d="M0 ${counterTopY(0) + 50} L160 ${counterTopY(160) + 50} L160 620 L0 620Z" fill="${c.truck2}" ${S2}/><path d="M160 ${counterTopY(160) + 50} L174 ${counterTopY(160) + 56} L174 620 L160 620Z" fill="${c.face}" ${S2}/>`;
  // awning over the window
  g += `<path d="M0 52 H540 V70 H0Z" fill="${c.truck}"/>`;
  for (let x = 0; x < 540; x += 36) g += `<path d="M${x} 70 h36 v8 a18 10 0 0 1 -36 0Z" fill="${(x / 36) % 2 ? '#fff' : c.truck}" stroke="${INK}" stroke-width="2.5"/>`;
  return `<svg viewBox="0 0 1000 620" preserveAspectRatio="none">${g}</svg>`;
};

// the slanted service counter is drawn above the queue so it hides the guests' legs
export const serviceCounterSVG = (theme) => {
  const c = THEME[theme];
  const S2 = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  const t = (x) => counterTopY(x);
  return `<svg viewBox="0 0 1000 620" preserveAspectRatio="none">
    <path d="M0 ${t(0)} L560 ${t(560)} L560 ${t(560) + 24} L0 ${t(0) + 24}Z" fill="${c.top}" ${S2}/>
    <path d="M0 ${t(0) + 24} L560 ${t(560) + 24} L560 ${t(560) + 50} L0 ${t(0) + 50}Z" fill="${c.truck}" ${S2}/>
    <path d="M0 ${t(0) + 33} L560 ${t(560) + 33}" stroke="${c.truck2}" stroke-width="7"/>
  </svg>`;
};

// front counter with the stovetop row, drawn over Mochi's legs; the truck's side panel below
export const frontCounterSVG = (theme, name) => {
  const c = THEME[theme];
  const S2 = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  return `<svg viewBox="0 500 1000 120" preserveAspectRatio="none">
    <path d="M174 506 L898 506 L898 532 L174 532Z" fill="${c.top}" ${S2}/>
    <path d="M174 532 L898 532 L898 640 L174 640Z" fill="${c.truck}" ${S2}/>
    <path d="M174 546 H898" stroke="${c.truck2}" stroke-width="9"/>
    <circle cx="290" cy="626" r="30" fill="#6b5a70" ${S2}/><circle cx="290" cy="626" r="12" fill="#fff"/>
    <circle cx="780" cy="626" r="30" fill="#6b5a70" ${S2}/><circle cx="780" cy="626" r="12" fill="#fff"/>
    <text x="540" y="590" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="#fff" stroke="${INK}" stroke-width="2.5" paint-order="stroke">Mochi's · ${name}</text>
  </svg>`;
};
