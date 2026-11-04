// Menus and screens for Hop to It! (MIT)
import { ITEMS, STATIONS, LEVELS, WORLDS, UPGRADES, chainFor } from './data.js';
import * as art from './art.js';
import { sfx, setSound } from './audio.js';
import { store, reset, totalStars, upg } from './save.js';
import { Game } from './game.js';

const TYPE_TEXT = {
  seat: (lv) => `Serve ${lv.limit} guests`,
  timer: (lv) => `${Math.floor(lv.limit / 60)}:${String(lv.limit % 60).padStart(2, '0')} timed shift`,
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

  cities() {
    this.endGame();
    const stars = totalStars(this.save);
    this.gameRoot.innerHTML = '<div class="map-bg theme-world"></div>';
    const pos = [[200, 380], [500, 250], [800, 390]];
    this.show(`
      <div class="map-head">
        <button class="btn small" data-act="title">⌂</button>
        <div class="map-title"><h2>Pick a city</h2><p>Mochi's food truck tour</p></div>
        <div class="wallet">${art.ic('coin')} ${this.save.wallet} · ★ ${stars}</div>
      </div>
      <svg class="map-path road" viewBox="0 0 1000 620"><path d="M200 380 C330 380 360 250 500 250 S690 390 800 390"/></svg>
      ${WORLDS.map((w, i) => {
        const open = this.cityOpen(i);
        const levels = LEVELS.filter((l) => l.world === i);
        const got = levels.reduce((a, l) => a + (this.save.stars[l.id] || 0), 0);
        return `<button class="city theme-${w.theme} ${open ? '' : 'locked'}" style="left:${pos[i][0]}px;top:${pos[i][1]}px" ${open ? `data-act="map" data-arg="${i}"` : ''}>
          <span class="city-ic">${art.ic(open ? w.icon : 'locked')}</span>
          <b>${w.name}</b><span class="city-sub">${open ? `★ ${got}/${levels.length * 3}` : `Needs ★ ${w.starsToUnlock}${i ? ` + finish ${WORLDS[i - 1].name}` : ''}`}</span></button>`;
      }).join('')}
      <div class="truck">${art.bunnySVG()}</div>`, 'full map');
  }

  map(worldIdx = 0) {
    this.endGame();
    this.mapWorld = worldIdx;
    const w = WORLDS[worldIdx];
    const levels = LEVELS.filter((l) => l.world === worldIdx);
    const stars = totalStars(this.save);
    const prevWorldDone = worldIdx === 0 || !!this.save.stars[LEVELS.filter((l) => l.world === worldIdx - 1).at(-1).id];
    const locked = stars < w.starsToUnlock || !prevWorldDone;
    this.gameRoot.innerHTML = `<div class="map-bg theme-${w.theme}"></div>`;
    const pts = levels.map((_, i) => {
      const x = 110 + (i % 5) * 190 + (Math.floor(i / 5) % 2 ? 60 : 0);
      const y = i < 5 ? 250 : 430;
      return { x: Math.floor(i / 5) % 2 ? 1000 - x : x, y };
    });
    const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
    this.show(`
      <div class="map-head">
        <button class="btn small" data-act="cities">◀ Cities</button>
        <div class="map-title"><h2>${w.name}</h2><p>${w.blurb}</p></div>
        <div class="wallet">${art.ic('coin')} ${this.save.wallet} · ★ ${stars}</div>
      </div>
      <svg class="map-path" viewBox="0 0 1000 620"><path d="${path}"/></svg>
      ${levels.map((lv, i) => {
        const open = !locked && this.levelUnlocked(lv.index);
        const st = this.save.stars[lv.id] || 0;
        return `<button class="node ${open ? '' : 'locked'} ${st ? 'cleared' : ''}" style="left:${pts[i].x}px;top:${pts[i].y}px" ${open ? `data-act="level" data-arg="${lv.index}"` : ''}>
          <span class="n">${open ? lv.id : art.ic('locked')}</span>
          <span class="st">${[0, 1, 2].map((k) => `<i class="${k < st ? 'on' : ''}">★</i>`).join('')}</span>
          <span class="ty">${art.ic(lv.type === 'timer' ? 'stopwatch' : lv.type === 'lose' ? 'broken-heart' : 'paw-prints')}</span></button>`;
      }).join('')}
      ${locked ? `<div class="gate">${art.ic('locked')} ${!prevWorldDone ? `Finish ${WORLDS[worldIdx - 1].name} to open.` : ''} Needs ★ ${w.starsToUnlock} (you have ${stars})</div>` : ''}
      <div class="map-nav">
        ${worldIdx > 0 ? `<button class="btn small" data-act="map" data-arg="${worldIdx - 1}">◀ ${WORLDS[worldIdx - 1].name}</button>` : '<span></span>'}
        <button class="btn small" data-act="shop" data-arg="map">${art.ic('shopping-cart')} Upgrades</button>
        ${worldIdx < WORLDS.length - 1 ? `<button class="btn small" data-act="map" data-arg="${worldIdx + 1}">${WORLDS[worldIdx + 1].name} ▶</button>` : '<span></span>'}
      </div>`, 'full map');
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
    if (!r.failed && r.stars > 0) {
      this.save.stars[lv.id] = Math.max(prevStars, r.stars);
    }
    this.save.best[lv.id] = Math.max(this.save.best[lv.id] || 0, r.coins);
    const earned = r.coins;
    this.save.wallet += earned;
    this.persist();
    const pass = !r.failed && r.stars > 0;
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
        ${pass && nextOpen ? `<button class="btn big" data-act="next" data-arg="${next.index}">Next ▶</button>` : ''}
        ${pass && next && !nextOpen ? `<button class="btn big" data-act="map" data-arg="${next.world}">Next world ▶</button>` : ''}
      </div></div>`);
    if (pass) {
      sfx.win();
      for (let k = 0; k < r.stars; k++) setTimeout(() => sfx.star(k), 300 + k * 350);
    } else sfx.lose();
  }

  // -------------------------------------------------------------------------
  shop(from) {
    this.shopFrom = from || this.shopFrom || 'title';
    this.show(`<div class="panel wide"><h2>${art.ic('shopping-cart')} Upgrades</h2>
      <p class="small">Paid for with coins you earn in the kitchen. Nothing here costs real money.</p>
      <div class="wallet center">${art.ic('coin')} ${this.save.wallet}</div>
      <div class="shop">${UPGRADES.map((u) => {
        const lvl = upg(this.save, u.id);
        const maxed = lvl >= u.costs.length;
        const cost = u.costs[lvl];
        return `<div class="up"><div class="up-icon">${art.ic(u.icon)}</div><div class="up-txt"><b>${u.n}</b><span>${u.d}</span>
          <span class="pips">${u.costs.map((_, k) => `<i class="${k < lvl ? 'on' : ''}"></i>`).join('')}</span></div>
          ${maxed ? '<span class="maxed">MAX</span>' : `<button class="btn small ${this.save.wallet < cost ? 'disabled' : ''}" data-act="buy" data-arg="${u.id}">${art.ic('coin')} ${cost}</button>`}</div>`;
      }).join('')}</div>
      <button class="btn" data-act="${this.shopFrom === 'map' ? 'map' : 'title'}">Back</button></div>`);
  }

  buy(id) {
    const u = UPGRADES.find((x) => x.id === id);
    const lvl = upg(this.save, id);
    const cost = u.costs[lvl];
    if (cost === undefined || this.save.wallet < cost) { sfx.nope(); return; }
    this.save.wallet -= cost;
    this.save.upgrades[id] = lvl + 1;
    this.persist();
    sfx.serve();
    this.shop();
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
