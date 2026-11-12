// Menus and screens for Hop to It! (MIT)
import { ITEMS, STATIONS, LEVELS, WORLDS, CITY_APPLIANCES, appKey, dishesFor, HELPERS, GEAR, TIER_BONUS, chainFor } from './data.js';
import * as art from './art.js';
import { sfx, setSound } from './audio.js';
import { store, reset, totalStars, upg } from './save.js';
import { Game } from './game.js';

const TYPE_TEXT = {
  seat: (lv) => `Serve ${lv.limit} guests`,
  timer: (lv) => `Guests arrive for ${Math.floor(lv.limit / 60)}:${String(lv.limit % 60).padStart(2, '0')}, then serve the last in line`,
  lose: (lv) => `${lv.limit} guests, no more than ${lv.walkouts - 1} may leave unhappy`,
};

export class UI {
  constructor(stage, save) {
    this.stage = stage;
    this.save = save;
    this.gameRoot = stage.querySelector('#game');
    this.overlay = stage.querySelector('#overlay');
    this.game = null;
    this.mapWorld = 0;
    setSound(save.settings.sound);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.game && !this.game.over && !this.game.paused) this.pauseMenu();
    });
  }

  persist() { store(this.save); }

  show(html, cls = '') {
    this.overlay.className = `overlay show ${cls}`;
    this.overlay.innerHTML = html;
    this.overlay.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', (e) => {
      sfx.unlock();
      sfx.tap();
      this.act(b.dataset.act, b.dataset.arg, e);
    }));
  }

  hide() { this.overlay.className = 'overlay'; this.overlay.innerHTML = ''; }

  act(a, arg) {
    const fn = {
      title: () => this.title(),
      map: () => this.map(arg !== undefined ? +arg : this.mapWorld),
      cities: () => this.cities(),
      level: () => this.preLevel(+arg),
      start: () => this.startLevel(+arg),
      resume: () => { this.hide(); this.game.pause(false); },
      book: () => this.book(true),
      restart: () => this.startLevel(this.game.lv.index),
      quit: () => { this.endGame(); this.map(LEVELS[this.lastLevel].world); },
      next: () => this.preLevel(+arg),
      shop: () => this.shop(arg),
      buy: () => this.buy(arg),
      shoptab: () => this.shop(undefined, arg),
      shopcity: () => { this.shopCity = +arg; this.shop(); },
      settings: () => this.settings(arg),
      toggle: () => this.toggle(arg),
      reset: () => this.confirmReset(),
      doreset: () => { this.save = reset(); this.persist(); this.title(); },
      about: () => this.about(),
      closebook: () => { this.hide(); this.game?.pause(false); },
    }[a];
    fn?.();
  }

  endGame() { this.game?.destroy(); this.game = null; }

  // -------------------------------------------------------------------------
  title() {
    this.endGame();
    this.gameRoot.innerHTML = '<div class="title-bg"></div>';
    this.show(`
      <div class="title-screen">
        <div class="title-art"><div class="title-bunny">${art.bunnySVG()}</div></div>
        <div class="title-side">
          <h1 class="logo">Hop to It!<span>Mochi's kitchen rush</span></h1>
          <p class="tag">Cook fast, serve cute, never wait for lives.</p>
          <div class="btn-col">
            <button class="btn big" data-act="cities">▶ Play</button>
            <div class="btn-row">
              <button class="btn" data-act="shop">${art.ic('shopping-cart')} Upgrades</button>
              <button class="btn" data-act="settings">${art.ic('gear')} Settings</button>
            </div>
            <button class="btn ghost" data-act="about">About</button>
          </div>
          <div class="wallet">${art.ic('coin')} ${this.save.wallet} · ★ ${totalStars(this.save)}</div>
        </div>
      </div>`, 'full');
  }

  about() {
    this.show(`<div class="panel">
      <h2>About</h2>
      <p>Hop to It! is a free, open-source cooking rush game. No lives, no energy, no ads and no purchases: every upgrade is earned with coins from play.</p>
      <p>All code and art are original and MIT licensed. Food icons are Microsoft's Fluent Emoji (MIT).</p>
      <p class="small">Progress is saved in this browser only.</p>
      <button class="btn" data-act="title">Back</button></div>`);
  }

  // -------------------------------------------------------------------------
  levelUnlocked(i) {
    const lv = LEVELS[i];
    const w = WORLDS[lv.world];
    if (totalStars(this.save) < w.starsToUnlock) return false;
    if (i === 0) return true;
    const prev = LEVELS[i - 1];
    if (prev.world !== lv.world) return !!this.save.stars[prev.id];
    return !!this.save.stars[prev.id];
  }

  cityOpen(i) {
    if (i === 0) return true;
    const prevLast = LEVELS.filter((l) => l.world === i - 1).at(-1);
    return totalStars(this.save) >= WORLDS[i].starsToUnlock && !!this.save.stars[prevLast.id];
  }

  cities() { this.map(); }

  // One long scrolling map: 3 cities, 30 stops on a winding road.
  nodePos(i) {
    // each city's road winds out and loops back on itself before heading to the next city
    const LOOP = [[120, 480], [255, 515], [390, 480], [455, 385], [345, 305], [205, 250], [250, 160], [415, 140], [580, 195], [720, 300]];
    const w = Math.floor(i / 10);
    const [x, y] = LOOP[i % 10];
    return { x: w * 1000 + x, y: 190 + (y - 140) * 0.93 };
  }

  currentNode() {
    let cur = 0;
    LEVELS.forEach((l, i) => { if (this.levelUnlocked(i) && this.cityOpen(l.world)) cur = i; });
    return cur;
  }

  roadPath() {
    const pts = LEVELS.map((_, i) => this.nodePos(i));
    pts.unshift({ x: 20, y: pts[0].y });
    pts.push({ x: 2990, y: pts.at(-1).y + 80 });
    // link each city's last stop to the next city's first stop with a sweeping curve
    for (let w = 2; w >= 1; w--) {
      const idx = w * 10 + 1; // after the unshift
      pts.splice(idx, 0, { x: w * 1000 - 120, y: 430 }, { x: w * 1000 + 20, y: 500 });
    }
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      d += ` C${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
    }
    return d;
  }

  // Points along the road (stops plus in-betweens), used to keep scenery off it.
  roadSamples() {
    if (this._road) return this._road;
    const pts = LEVELS.map((_, i) => this.nodePos(i));
    const out = [];
    pts.forEach((p, i) => {
      const q = pts[i + 1];
      out.push([p.x, p.y]);
      if (q) for (let t = 1; t < 8; t++) out.push([p.x + ((q.x - p.x) * t) / 8, p.y + ((q.y - p.y) * t) / 8]);
    });
    this._road = out;
    return out;
  }

  scenery(w) {
    const off = w * 1000;
    const pal = [['#fff1c9', '#c6ecdf', '#ffd6e5'], ['#efe6ff', '#d6f0c8', '#ffd6e5'], ['#cfc6ff', '#bfe9da', '#ffe9b8']][w];
    let g = `<rect x="${off}" y="0" width="1000" height="620" fill="${pal[0]}"/>`;
    g += `<ellipse cx="${off + 250}" cy="640" rx="420" ry="190" fill="${pal[1]}"/><ellipse cx="${off + 780}" cy="660" rx="380" ry="170" fill="${pal[1]}"/>`;
    g += `<ellipse cx="${off + 520}" cy="140" rx="300" ry="70" fill="#ffffff" opacity=".5"/>`;
    // trees and houses, kept clear of the road, the stops and the city sign
    const road = this.roadSamples();
    const placed = [];
    const gates = [[off - 50, 375], [off + 950, 375]];
    const clear = (x, y, r) => road.every(([rx, ry]) => Math.hypot(rx - x, ry - y) > r)
      && placed.every(([px, py]) => Math.hypot(px - x, py - y) > 62)
      && gates.every(([gx, gy]) => Math.hypot(gx - x, gy - y) > 95)
      && !(y < 200 && Math.abs(x - (off + 500)) < 330);
    const seed = (n) => { const v = Math.sin(n * 12.9898 + w * 78.233) * 43758.5453; return v - Math.floor(v); };
    let trees = 0;
    let houses = 0;
    for (let k = 0; k < 80 && (trees < 12 || houses < 4); k++) {
      const x = off + 40 + seed(k) * 920;
      const y = 160 + seed(k + 100) * 420;
      if (houses < 4 && k % 3 === 0 && clear(x + 23, y + 10, 80)) {
        houses++;
        placed.push([x + 23, y + 10]);
        g += `<rect x="${x}" y="${y}" width="46" height="36" rx="5" fill="#fffdfb" stroke="#6b4a63" stroke-width="2.5"/><path d="M${x - 6} ${y + 2} L${x + 23} ${y - 22} L${x + 52} ${y + 2} Z" fill="${['#ff9cc0', '#b9a2f5', '#6ccfb0'][w]}" stroke="#6b4a63" stroke-width="2.5" stroke-linejoin="round"/><rect x="${x + 17}" y="${y + 16}" width="12" height="20" rx="3" fill="#ffd6e5"/>`;
      } else if (trees < 12 && clear(x, y - 6, 66)) {
        trees++;
        placed.push([x, y - 6]);
        g += `<rect x="${x - 5}" y="${y - 4}" width="10" height="26" rx="4" fill="#d9b39a" stroke="#6b4a63" stroke-width="2.5"/><circle cx="${x}" cy="${y - 14}" r="22" fill="${k % 3 ? '#b8eedd' : pal[2]}" stroke="#6b4a63" stroke-width="2.5"/>`;
      }
    }
    return g;
  }

  map(worldIdx) {
    this.endGame();
    const stars = totalStars(this.save);
    const cur = this.currentNode();
    const hop = this.pendingHop;
    this.pendingHop = null;
    const start = hop ? hop[0] : cur;
    this.gameRoot.innerHTML = '';
    const nodes = LEVELS.map((lv, i) => {
      const p = this.nodePos(i);
      const open = this.cityOpen(lv.world) && this.levelUnlocked(i);
      const st = this.save.stars[lv.id] || 0;
      return `<button class="node ${open ? '' : 'locked'} ${st ? 'cleared' : ''} ${i === cur ? 'current' : ''}" style="left:${p.x}px;top:${p.y}px" ${open ? `data-act="level" data-arg="${i}"` : ''}>
        <span class="n">${open ? lv.id : art.ic('locked')}</span>
        <span class="st">${[0, 1, 2].map((k) => `<i class="${k < st ? 'on' : ''}">★</i>`).join('')}</span>
        <span class="ty">${art.ic(lv.type === 'timer' ? 'stopwatch' : lv.type === 'lose' ? 'broken-heart' : 'paw-prints')}</span></button>`;
    }).join('');
    const banners = WORLDS.map((w, i) => {
      const open = this.cityOpen(i);
      return `<div class="city-banner theme-${w.theme}" style="left:${i * 1000 + 500}px">
          <span class="cb-ic">${art.ic(w.icon)}</span><div><b>${w.name}</b><span>${w.blurb}</span></div></div>
        ${i ? `<div class="gate-sign ${open ? 'open' : ''}" style="left:${i * 1000 - 50}px">${open ? art.ic('sparkles') : art.ic('locked')}<b>★ ${w.starsToUnlock}</b><span>${open ? 'Open!' : `Finish ${WORLDS[i - 1].name}`}</span></div>` : ''}`;
    }).join('');
    const sp = this.nodePos(start);
    this.show(`
      <div class="map-scroll"><div class="map-world">
        <svg class="map-svg" viewBox="0 0 3000 620" width="3000" height="620">${[0, 1, 2].map((w) => this.scenery(w)).join('')}
          <path class="road-edge" d="${this.roadPath()}"/><path class="road" d="${this.roadPath()}"/><path class="road-dash" d="${this.roadPath()}"/></svg>
        ${banners}${nodes}
        <div class="map-mochi" style="left:${sp.x}px;top:${sp.y}px"><div class="mm-body">${art.bunnySVG()}</div></div>
      </div></div>
      <div class="map-head">
        <button class="btn small" data-act="title">⌂</button>
        <div class="map-title"><h2>Mochi's road trip</h2><p>Swipe the map, tap a stop to cook</p></div>
        <div class="wallet">${art.ic('coin')} ${this.save.wallet} · ★ ${stars}</div>
      </div>
      <div class="map-nav"><span></span><button class="btn small ${this.canBuySomething() ? 'has-new' : ''}" data-act="shop" data-arg="map">${art.ic('shopping-cart')} Kitchen Shop</button><span></span></div>`, 'full map');
    const scroller = this.overlay.querySelector('.map-scroll');
    const focusX = worldIdx !== undefined && !hop && worldIdx !== LEVELS[cur].world ? worldIdx * 1000 + 500 : sp.x;
    scroller.scrollLeft = Math.max(0, focusX - 500);
    this.dragScroll(scroller);
    if (hop) setTimeout(() => this.hopMochi(hop[0], hop[1], scroller), 450);
  }

  // Mochi bounces along the road from one stop to the next.
  hopMochi(from, to, scroller) {
    const m = this.overlay.querySelector('.map-mochi');
    if (!m) return;
    const a = this.nodePos(from);
    const b = this.nodePos(to);
    const hops = 3;
    const dur = 1100;
    const t0 = performance.now();
    m.classList.add('hopping');
    const tick = (now) => {
      if (!m.isConnected) return;
      const k = Math.min(1, (now - t0) / dur);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const x = a.x + (b.x - a.x) * e;
      const y = a.y + (b.y - a.y) * e - Math.abs(Math.sin(k * Math.PI * hops)) * 46;
      m.style.left = `${x}px`;
      m.style.top = `${y}px`;
      m.classList.toggle('flip', b.x < a.x);
      scroller.scrollLeft += ((x - 500) - scroller.scrollLeft) * 0.12;
      if (Math.floor(k * hops * 2) !== this.lastHopBeat) { this.lastHopBeat = Math.floor(k * hops * 2); if (this.lastHopBeat % 2 === 0) sfx.hop(); }
      if (k < 1) requestAnimationFrame(tick);
      else {
        m.classList.remove('hopping');
        m.classList.add('landed');
        sfx.star(2);
        this.overlay.querySelector(`.node[data-arg="${to}"]`)?.classList.add('current', 'node-pop');
      }
    };
    requestAnimationFrame(tick);
  }

  dragScroll(el) {
    let down = null;
    el.addEventListener('wheel', (e) => { el.scrollLeft += e.deltaY + e.deltaX; e.preventDefault(); }, { passive: false });
    el.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') down = { x: e.clientX, s: el.scrollLeft, moved: false }; });
    el.addEventListener('pointermove', (e) => {
      if (!down) return;
      const scale = this.stage.getBoundingClientRect().width / 1000;
      const dx = (e.clientX - down.x) / scale;
      if (Math.abs(dx) > 4) down.moved = true;
      el.scrollLeft = down.s - dx;
    });
    const up = () => { if (down?.moved) { el.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true }); } down = null; };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', () => { down = null; });
  }

  // -------------------------------------------------------------------------
  recipeRows(lv, highlightNew = true) {
    return lv.dishes.map((d) => {
      const chain = chainFor(d);
      const steps = chain.length
        ? chain.map((s) => `<span class="rstep">${s.in.map((k) => art.itemHTML(k, { small: true, plate: false })).join('<i>+</i>')}<i>→</i><span class="rst">${STATIONS[s.st].n}</span><i>→</i>${art.itemHTML(s.out, { small: true })}</span>`).join('')
        : '<span class="rstep">Grab it straight from its basket!</span>';
      const isNew = highlightNew && lv.newDishes.includes(d);
      return `<div class="rrow ${isNew ? 'new' : ''}"><div class="rdish">${art.itemHTML(d)}<div><b>${ITEMS[d].n}</b><span>${art.ic('coin')} ${ITEMS[d].p}${isNew ? ' · NEW' : ''}</span></div></div><div class="rsteps">${steps}</div></div>`;
    }).join('');
  }

  preLevel(i) {
    this.endGame();
    const lv = LEVELS[i];
    this.lastLevel = i;
    const best = this.save.best[lv.id];
    this.show(`<div class="panel wide">
      <div class="pl-head"><div class="lv-badge big">${lv.id}</div><div><h2>${WORLDS[lv.world].name}</h2><p>${TYPE_TEXT[lv.type](lv)} · ${lv.seats} seat${lv.seats > 1 ? 's' : ''}</p></div></div>
      <div class="pl-goals">${lv.goals.map((g, k) => `<div class="pg"><span>${'★'.repeat(k + 1)}</span><b>${art.ic('coin')} ${g}</b></div>`).join('')}${best ? `<div class="pg best"><span>Best</span><b>${art.ic('coin')} ${best}</b></div>` : ''}</div>
      <h3>Today's menu</h3>
      <div class="recipes">${this.recipeRows(lv)}</div>
      <div class="btn-row"><button class="btn ghost" data-act="map" data-arg="${lv.world}">Back</button><button class="btn big" data-act="start" data-arg="${i}">Start shift ▶</button></div>
    </div>`);
  }

  book() {
    if (!this.game) return;
    this.game.pause(true);
    this.show(`<div class="panel wide"><h2>${art.ic('open-book')} Recipes</h2><div class="recipes">${this.recipeRows(this.game.lv, false)}</div>
      <p class="small">Tip: tap things in any order. Mochi remembers up to 8 taps and does them one by one.</p>
      <button class="btn" data-act="closebook">Back to the kitchen</button></div>`);
  }

  startLevel(i) {
    this.pendingHop = null;
    this.endGame();
    this.hide();
    this.lastLevel = i;
    const lv = LEVELS[i];
    this.game = new Game(this.gameRoot, lv, this.save, {
      onEnd: (r) => this.results(lv, r),
      onPause: () => this.pauseMenu(),
      onBook: () => this.book(),
    });
  }

  pauseMenu() {
    if (!this.game) return;
    this.game.pause(true);
    this.show(`<div class="panel"><h2>Paused</h2>
      <div class="btn-col"><button class="btn big" data-act="resume">▶ Resume</button>
      <button class="btn" data-act="book">${art.ic('open-book')} Recipes</button>
      <button class="btn" data-act="restart">↻ Restart</button>
      <button class="btn" data-act="settings" data-arg="pause">${art.ic('gear')} Settings</button>
      <button class="btn ghost" data-act="quit">Quit to map</button></div></div>`);
  }

  results(lv, r) {
    const prevStars = this.save.stars[lv.id] || 0;
    const wasOpen = LEVELS[lv.index + 1] ? this.levelUnlocked(lv.index + 1) && this.cityOpen(LEVELS[lv.index + 1].world) : true;
    if (!r.failed && r.stars > 0) {
      this.save.stars[lv.id] = Math.max(prevStars, r.stars);
    }
    this.save.best[lv.id] = Math.max(this.save.best[lv.id] || 0, r.coins);
    const earned = r.coins;
    this.save.wallet += earned;
    this.persist();
    const pass = !r.failed && r.stars > 0;
    const nowOpen = LEVELS[lv.index + 1] && this.levelUnlocked(lv.index + 1) && this.cityOpen(LEVELS[lv.index + 1].world);
    if (pass && !wasOpen && nowOpen) this.pendingHop = [lv.index, lv.index + 1];
    const next = LEVELS[lv.index + 1];
    const nextOpen = next && this.levelUnlocked(next.index) && totalStars(this.save) >= WORLDS[next.world].starsToUnlock;
    const msg = r.failed ? 'Too many guests left unhappy.' : pass ? ['Nice shift!', 'Great shift!', 'Perfect shift!'][r.stars - 1] : `Reach ${art.ic('coin')} ${lv.goals[0]} to pass.`;
    this.show(`<div class="panel result ${pass ? 'win' : 'lose'}">
      <div class="res-bunny" data-mood="${pass ? 'happy' : 'oops'}">${art.bunnySVG()}</div>
      <h2>${msg}</h2>
      <div class="res-stars">${[0, 1, 2].map((k) => `<i class="${k < r.stars ? 'on' : ''}" style="animation-delay:${0.3 + k * 0.35}s">★</i>`).join('')}</div>
      <div class="res-stats"><div>${art.ic('coin')} <b>${r.coins}</b><span>coins</span></div><div>${art.ic('sparkling-heart')} <b>${r.served}</b><span>served</span></div><div>${art.ic('broken-heart')} <b>${r.lost}</b><span>left</span></div></div>
      <p class="small">+${earned} coins added to your wallet (${art.ic('coin')} ${this.save.wallet}). Spend them on upgrades.</p>
      <div class="btn-row">
        <button class="btn ghost" data-act="map" data-arg="${lv.world}">Map</button>
        <button class="btn" data-act="start" data-arg="${lv.index}">↻ Again</button>
        ${pass && nextOpen ? `<button class="btn big" data-act="${this.pendingHop ? 'map' : 'next'}" data-arg="${this.pendingHop ? next.world : next.index}">Next ▶</button>` : ''}
        ${pass && next && !nextOpen ? `<button class="btn big" data-act="map" data-arg="${next.world}">Next world ▶</button>` : ''}
      </div></div>`);
    if (pass) {
      sfx.win();
      for (let k = 0; k < r.stars; k++) setTimeout(() => sfx.star(k), 300 + k * 350);
    } else sfx.lose();
  }

  // -------------------------------------------------------------------------
  // Station types Mochi has already cooked with (or can cook with now).
  seenStations(world) {
    const seen = new Map();
    LEVELS.forEach((lv, i) => {
      if (lv.world !== world || !(this.cityOpen(lv.world) && this.levelUnlocked(i))) return;
      lv.stationTypes.forEach((t) => { if (!seen.has(t)) seen.set(t, i); });
    });
    return seen;
  }

  shopItems() {
    // every city's own appliance line
    const apps = CITY_APPLIANCES.flatMap((line, w) => {
      const seen = this.seenStations(w);
      return Object.keys(line).map((t) => {
        const firstLv = LEVELS.find((l) => l.world === w && l.stationTypes.includes(t));
        const id = appKey(w, t);
        return { kind: 'app', id, world: w, type: t, lvl: this.save.upgrades[id] || 0, open: seen.has(t), unlockAt: firstLv?.id };
      });
    });
    const list = (arr, kind) => arr.map((u) => ({ kind, id: u.id, u, lvl: upg(this.save, u.id), open: true }));
    return { apps, helpers: list(HELPERS, 'helper'), gear: list(GEAR, 'gear') };
  }

  // Something new the wallet can pay for (shows a dot on the Upgrades button).
  canBuySomething() {
    const { apps, helpers, gear } = this.shopItems();
    return [...apps, ...helpers, ...gear].some((it) => {
      if (!it.open) return false;
      const c = this.costOf(it);
      return c !== undefined && c <= this.save.wallet;
    });
  }

  costOf(it) {
    if (it.kind === 'app') return CITY_APPLIANCES[it.world][it.type][it.lvl + 1]?.cost;
    return it.u.tiers[it.lvl]?.cost;
  }

  shop(from, tab) {
    this.shopFrom = from || this.shopFrom || 'title';
    this.shopTab = tab || this.shopTab || 'apps';
    const { apps: allApps, helpers, gear } = this.shopItems();
    if (this.shopCity === undefined || !this.cityOpen(this.shopCity)) this.shopCity = 0;
    const apps = allApps.filter((it) => it.world === this.shopCity);
    const pips = (n, on) => `<span class="pips">${Array.from({ length: n }, (_, k) => `<i class="${k < on ? 'on' : ''}"></i>`).join('')}</span>`;
    const buyBtn = (it) => {
      const cost = this.costOf(it);
      if (cost === undefined) return '<span class="maxed">MAX</span>';
      return `<button class="btn small ${this.save.wallet < cost ? 'disabled' : ''}" data-act="buy" data-arg="${it.id}">${art.ic('coin')} ${cost}</button>`;
    };
    const appCard = (it) => {
      const tiers = CITY_APPLIANCES[it.world][it.type];
      if (!it.open) {
        return `<div class="up app locked" data-id="${it.id}"><div class="up-icon app-art"><svg viewBox="0 0 100 100">${art.STATION_SVG[it.type]}</svg>${art.ic('locked')}</div>
          <div class="up-txt"><b>${tiers[0].n}</b><span>Shows up in ${it.unlockAt}</span></div></div>`;
      }
      const nxt = tiers[it.lvl + 1];
      return `<div class="up app tier-${it.lvl}" data-id="${it.id}"><div class="up-icon app-art"><svg viewBox="0 0 100 100">${art.STATION_SVG[it.type]}</svg>${it.lvl ? `<span class="tier-badge">${art.ic(it.lvl === 2 ? 'crown' : 'sparkles')}</span>` : ''}</div>
        <div class="up-txt"><b>${tiers[it.lvl].n}</b><span class="uses">For ${dishesFor(it.world, it.type).join(', ')}</span><span>${nxt ? `Next: <b>${nxt.n}</b>, ${nxt.d}.` : `Top model! Cooks ${Math.round((TIER_BONUS[2].speed - 1) * 100)}% faster.`}</span>${pips(3, it.lvl + 1)}</div>
        ${buyBtn(it)}</div>`;
    };
    const card = (it) => {
      const t = it.u.tiers;
      const nxt = t[it.lvl];
      return `<div class="up" data-id="${it.id}"><div class="up-icon">${art.ic(it.u.icon)}</div><div class="up-txt"><b>${it.u.n}</b><span>${it.u.d}${nxt ? ` <em>Next: ${nxt.d}.</em>` : ' <em>All done!</em>'}</span>${pips(t.length, it.lvl)}</div>${buyBtn(it)}</div>`;
    };
    const tabs = [['apps', 'Appliances', 'cooking'], ['helpers', 'Helpers', 'lollipop'], ['gear', "Mochi's gear", 'paw-prints']];
    const body = this.shopTab === 'apps' ? apps.map(appCard).join('') : (this.shopTab === 'helpers' ? helpers : gear).map(card).join('');
    this.show(`<div class="panel wide shop-panel"><h2>${art.ic('shopping-cart')} Kitchen Shop</h2>
      <p class="small">New appliances cook faster. Paid with coins you earn in the kitchen, never real money.</p>
      <div class="shop-top"><div class="tabs">${tabs.map(([k, n, ic]) => `<button class="tab ${k === this.shopTab ? 'on' : ''}" data-act="shoptab" data-arg="${k}">${art.ic(ic)} ${n}</button>`).join('')}</div>
        <div class="wallet">${art.ic('coin')} ${this.save.wallet}</div></div>
      ${this.shopTab === 'apps' ? `<div class="city-tabs">${WORLDS.map((w, i) => this.cityOpen(i)
        ? `<button class="ctab ${i === this.shopCity ? 'on' : ''}" data-act="shopcity" data-arg="${i}">${art.ic(w.icon)} ${w.name}</button>`
        : `<span class="ctab locked">${art.ic('locked')} ${w.name}</span>`).join('')}</div>` : ''}
      <div class="shop">${body}</div>
      <button class="btn" data-act="${this.shopFrom === 'map' ? 'map' : 'title'}">Back</button></div>`);
  }

  buy(id) {
    const { apps, helpers, gear } = this.shopItems();
    const it = [...apps, ...helpers, ...gear].find((x) => x.id === id);
    const cost = it && it.open ? this.costOf(it) : undefined;
    if (cost === undefined || this.save.wallet < cost) { sfx.nope(); return; }
    this.save.wallet -= cost;
    this.save.upgrades[id] = it.lvl + 1;
    this.persist();
    sfx.serve();
    this.shop();
    this.overlay.querySelector(`.up[data-id="${id}"]`)?.classList.add('bought');
  }

  settings(from) {
    this.settingsFrom = from || this.settingsFrom || 'title';
    const s = this.save.settings;
    const row = (k, label, desc) => `<button class="setting" data-act="toggle" data-arg="${k}"><div><b>${label}</b><span>${desc}</span></div><i class="sw ${s[k] ? 'on' : ''}"></i></button>`;
    this.show(`<div class="panel"><h2>${art.ic('gear')} Settings</h2>
      ${row('sound', 'Sound', 'Kitchen sound effects')}
      ${row('hints', 'Hints', 'Helper tips and pointer arrows')}
      ${row('relaxed', 'Relaxed mode', 'Guests wait longer and food burns slower')}
      <div class="btn-row">
        ${this.settingsFrom === 'pause' ? '<button class="btn" data-act="resume">Back to game</button>' : '<button class="btn" data-act="title">Back</button>'}
        ${this.settingsFrom === 'pause' ? '' : '<button class="btn ghost danger" data-act="reset">Reset progress</button>'}
      </div></div>`);
  }

  toggle(k) {
    this.save.settings[k] = !this.save.settings[k];
    if (k === 'sound') setSound(this.save.settings.sound);
    this.persist();
    this.settings();
  }

  confirmReset() {
    this.show(`<div class="panel"><h2>Reset everything?</h2><p>This clears stars, coins and upgrades on this device. It can't be undone.</p>
      <div class="btn-row"><button class="btn" data-act="settings">Keep my progress</button><button class="btn danger" data-act="doreset">Reset</button></div></div>`);
  }
}
