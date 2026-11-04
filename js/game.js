// Hop to It! - core gameplay engine (MIT)
import { ITEMS, STATIONS, ANIMALS, WORLDS, chainTime } from './data.js';
import * as art from './art.js';
import { sfx } from './audio.js';
import { upg } from './save.js';

// 3/4 kitchen layout (stage is 1000 x 620). Arrangement follows the classic layout of the
// genre: diagonal pickup counter upper-left, U-shaped counters, stoves along the front.
const BACK_STAND = 322;
const FRONT_STAND = 498;
const SERVE = [430, 322];
const QUEUE = [[372, 246, 0.74], [300, 276, 0.79], [228, 306, 0.84], [156, 336, 0.89], [84, 366, 0.94]];
const ZONE_OF = {
  skillet: 'front', pot: 'front', mixer: 'front', toaster: 'front',
  oven: 'back', coffee: 'back', kettle: 'back',
  chop: 'left', steamer: 'left', juicer: 'left',
  board: 'right', ricecooker: 'right',
};
const ZONES = {
  front: { max: 6, cx: 560, cy: 480, dx: 104, dy: 0, size: 96, stand: (x) => [x, FRONT_STAND] },
  back: { max: 5, cx: 790, cy: 172, dx: 92, dy: 0, size: 80, stand: (x) => [Math.min(860, Math.max(560, x)), BACK_STAND] },
  left: { max: 2, cx: 88, cy: 505, dx: 0, dy: 88, size: 86, stand: (x, y) => [200, Math.min(FRONT_STAND, Math.max(440, y))] },
  right: { max: 2, cx: 946, cy: 330, dx: 0, dy: 86, size: 78, stand: (x, y) => [862, Math.max(BACK_STAND, y + 20)] },
};
const BUNNY_W = 100;
const BUNNY_H = 154;
const depthScale = (y) => 0.8 + 0.2 * Math.min(1, Math.max(0, (y - BACK_STAND) / (FRONT_STAND - BACK_STAND)));
const MAX_QUEUE = 8;
const RUSH_NEED = 30;
const RUSH_TIME = 15;

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const isSub = (a, b) => {
  const c = {};
  b.forEach((x) => { c[x] = (c[x] || 0) + 1; });
  return a.every((x) => (c[x] ? (c[x]--, true) : false));
};
const minus = (b, a) => {
  const out = [...b];
  a.forEach((x) => { const i = out.indexOf(x); if (i >= 0) out.splice(i, 1); });
  return out;
};
const el = (cls, html = '', parent = null) => {
  const d = document.createElement('div');
  d.className = cls;
  d.innerHTML = html;
  if (parent) parent.appendChild(d);
  return d;
};
const spread = (n, from, to) => (n === 1 ? [(from + to) / 2] : Array.from({ length: n }, (_, i) => from + ((to - from) * i) / (n - 1)));

export class Game {
  constructor(root, level, save, hooks) {
    this.root = root;
    this.lv = level;
    this.save = save;
    this.hooks = hooks;
    const relaxed = save.settings.relaxed;
    this.mods = {
      speed: 440 * (1 + 0.15 * upg(save, 'paws')),
      cook: 0.88 ** upg(save, 'stove'),
      burn: (1 + 0.3 * upg(save, 'burn')) * (relaxed ? 1.5 : 1),
      carry: 2 + upg(save, 'tray'),
      patience: (1 + 0.1 * upg(save, 'cushion')) * (relaxed ? 1.45 : 1),
    };
    this.coins = 0;
    this.served = 0;
    this.lost = 0;
    this.spawned = 0;
    this.streak = 0;
    this.heart = 0;
    this.rush = 0;
    this.elapsed = 0;
    this.timeLeft = level.type === 'timer' ? level.limit : 0;
    this.nextArrival = 1;
    this.paused = false;
    this.over = false;
    this.customers = [];
    this.queue = [];
    this.current = null;
    this.marked = new Set();
    this.hintUntil = 0;
    this.warnTick = 0;
    this.build();
    this.last = performance.now();
    this.raf = requestAnimationFrame((t) => this.loop(t));
  }

  // -------------------------------------------------------------------------
  build() {
    const lv = this.lv;
    const world = WORLDS[lv.world];
    this.root.innerHTML = '';
    const scene = el(`scene theme-${world.theme}`, '', this.root);
    this.scene = scene;
    // 3/4 top-down food truck: street + skyline behind the slanted service window (upper left),
    // U-shaped kitchen (back counter, left and right columns) and a perspective floor.
    el('bg', art.truckSceneSVG(world.theme), scene);
    this.custLayer = el('layer cust-layer', '', scene);
    el('service', art.serviceCounterSVG(world.theme), scene);
    this.bubbleLayer = el('layer bubble-layer', '', scene);
    this.kitchen = el('layer kitchen', '', scene);
    this.fx = el('layer fx', '', scene);
    el('fg-front', art.frontCounterSVG(world.theme, world.name), this.kitchen);

    // queue spots along the slanted service counter (back = upper right, front = lower left)
    const spots = QUEUE.filter((_, i) => lv.seats >= 5 || [[2], [1, 3], [0, 2, 4], [0, 1, 3, 4]][lv.seats - 1].includes(i));
    this.seats = spots.map(([x, y, sc], i) => {
      const seat = { isSeat: true, x, y, scale: sc, cust: null, sx: SERVE[0], sy: SERVE[1] };
      seat.hit = el('seat-hit', '', this.bubbleLayer);
      Object.assign(seat.hit.style, { left: `${x - 50 * sc}px`, top: `${y - 150 * sc}px`, width: `${100 * sc}px`, height: `${130 * sc}px` });
      seat.hit.addEventListener('pointerdown', (e) => { e.preventDefault(); this.tapSeat(i); });
      return seat;
    });

    // stations go to the zone each one belongs to, spilling over to the next free zone
    const list = [];
    lv.stationTypes.forEach((t) => {
      const n = 1 + (lv.extra[t] || 0);
      for (let i = 0; i < n; i++) list.push(t);
    });
    const zones = { front: [], back: [], left: [], right: [] };
    list.forEach((t) => {
      const order = [ZONE_OF[t] || 'back', 'back', 'front', 'right', 'left'];
      const z = order.find((zn) => zones[zn].length < ZONES[zn].max);
      zones[z].push(t);
    });
    this.stations = [];
    Object.entries(zones).forEach(([zn, types]) => {
      const Z = ZONES[zn];
      types.forEach((type, i) => {
        const off = i - (types.length - 1) / 2;
        const x = Z.cx + off * Z.dx;
        const y = Z.cy + off * Z.dy;
        const s = {
          kind: 'station', type, row: zn, x, y, sx: Z.stand(x, y)[0], sy: Z.stand(x, y)[1],
          contents: [], state: 'idle', t: 0, dur: 0, product: null, servings: 0, age: 0, burnT: 0, step: null, dirty: true,
        };
        s.el = el(`station row-${zn}`, `<div class="st-art"><svg viewBox="0 0 100 100">${art.STATION_SVG[type]}</svg></div>
          <div class="st-items"></div>
          <svg class="ring" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="rbg"/><circle cx="20" cy="20" r="16" class="rfg"/></svg>
          <div class="st-label">${STATIONS[type].n}</div><div class="qb"></div>`, this.kitchen);
        Object.assign(s.el.style, { left: `${x}px`, top: `${y}px`, width: `${Z.size}px`, height: `${Z.size}px`, zIndex: zn === 'front' ? 560 : Math.round(y + Z.size / 2) });
        s.itemsEl = s.el.querySelector('.st-items');
        s.ring = s.el.querySelector('.ring');
        s.rfg = s.el.querySelector('.rfg');
        s.el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.enqueue(s); });
        this.stations.push(s);
      });
    });

    // pantry crates on the back wall shelf
    const n = lv.bins.length;
    const bx = spread(n, n > 7 ? 548 : 580, n > 7 ? 978 : 950);
    const bsize = Math.min(58, (n > 1 ? bx[1] - bx[0] : 60) * 0.98);
    this.bins = lv.bins.map((item, i) => {
      const b = { kind: 'bin', item, x: bx[i], y: 100, sx: Math.min(860, Math.max(540, bx[i])), sy: BACK_STAND };
      b.el = el('bin', `${art.binSVG(ITEMS[item].ready ? '#ffc2d4' : ['#ffd9b8', '#c6ecdf', '#e3d6ff', '#cfe8f7', '#fff0b3'][i % 5])}<div class="bin-item">${art.itemHTML(item, { plate: false })}</div><div class="bin-label">${ITEMS[item].n}</div><div class="qb"></div>`, this.kitchen);
      Object.assign(b.el.style, { left: `${b.x}px`, top: `${b.y}px`, width: `${bsize}px` });
      b.el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.enqueue(b); });
      return b;
    });

    // holding plates on a little pass table beside the service window
    const nPlates = Math.min(3, lv.plates + upg(this.save, 'plate'));
    this.plates = Array.from({ length: nPlates }, (_, i) => {
      const y = 350 + i * 52;
      const p = { kind: 'plate', item: null, x: 268, y, sx: 330, sy: Math.min(FRONT_STAND, y + 30) };
      p.el = el('hplate', `${art.plateSVG}<div class="hp-item"></div><div class="qb"></div>`, this.kitchen);
      Object.assign(p.el.style, { left: `${p.x}px`, top: `${p.y}px`, zIndex: Math.round(y + 20) });
      p.el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.enqueue(p); });
      return p;
    });
    if (nPlates) {
      const tbl = el('pass-table', '', this.kitchen);
      Object.assign(tbl.style, { left: '232px', top: '330px', height: `${nPlates * 52 + 26}px`, zIndex: 330 });
    }

    // trash on the right column, near the front
    this.trash = { kind: 'trash', x: 938, y: 470, sx: 850, sy: FRONT_STAND - 14 };
    this.trash.el = el('trash', `${art.trashSVG}<div class="qb"></div><div class="st-label">Trash</div>`, this.kitchen);
    Object.assign(this.trash.el.style, { left: `${this.trash.x}px`, top: `${this.trash.y}px`, zIndex: 505 });
    this.trash.el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.enqueue(this.trash); });

    // Mochi (scaled by depth like the classic games: 80% at the back, 100% at the front)
    this.bunny = { x: 600, y: 410, hands: [], face: 1, mood: '', moodT: 0, hop: 0 };
    this.bunny.el = el('bunny', `<div class="bunny-body">${art.bunnySVG()}</div><div class="held"></div>`, this.kitchen);
    this.heldEl = this.bunny.el.querySelector('.held');

    // HUD
    this.hud = el('hud', `
      <div class="hud-l"><div class="lv-badge">${lv.id}</div><div class="lv-goal"></div></div>
      <div class="hud-c"><div class="coinbar"><div class="coinfill"></div>
        ${lv.goals.map((g, i) => `<div class="goalmark" style="left:${(g / lv.goals[2]) * 100}%"><span class="gstar">★</span><span class="gnum">${g}</span></div>`).join('')}
        <div class="coins">${art.ic('coin')}<b>0</b></div></div></div>
      <div class="hud-r"><div class="heartmeter" title="Heart Rush meter"><div class="hm-fill"></div>${art.ic('pink-heart')}</div>
        <button class="hbtn book" title="Recipes">${art.ic('open-book')}</button><button class="hbtn pause" title="Pause"><b>II</b></button></div>`, this.root);
    this.hud.querySelector('.book').addEventListener('click', () => this.hooks.onBook?.());
    this.hud.querySelector('.pause').addEventListener('click', () => this.hooks.onPause?.());
    this.coinsEl = this.hud.querySelector('.coins b');
    this.coinFill = this.hud.querySelector('.coinfill');
    this.goalEl = this.hud.querySelector('.lv-goal');
    this.hmFill = this.hud.querySelector('.hm-fill');
    this.marks = [...this.hud.querySelectorAll('.goalmark')];

    this.tray = el('tray', '<div class="tray-title">Mochi\'s paws</div><div class="tray-slots"></div>', this.root);
    this.traySlots = this.tray.querySelector('.tray-slots');
    this.traySlots.addEventListener('pointerdown', (e) => {
      const slot = e.target.closest('.tslot');
      if (!slot || slot.dataset.i === undefined) return;
      const it = this.bunny.hands[+slot.dataset.i];
      if (!it) return;
      if (this.marked.has(it)) this.marked.delete(it); else this.marked.add(it);
      sfx.tap();
      this.renderHands();
    });

    this.banner = el('banner', '', this.root);
    this.toastEl = el('toast', '', this.root);
    this.hintEl = el('hint', '<div class="hint-text"></div>', this.root);
    this.pointer = el('pointer', '<svg viewBox="0 0 40 44"><path d="M20 42 L4 22 h10 V4 h12 v18 h10 Z" fill="#ff8fb3" stroke="#6b4a63" stroke-width="3" stroke-linejoin="round"/></svg>', this.root);

    this.renderHands();
    this.updateHud(true);
  }

  // -------------------------------------------------------------------------
  loop(t) {
    if (this.destroyed) return;
    const dt = Math.min(0.05, (t - this.last) / 1000);
    this.last = t;
    if (!this.paused && !this.over) this.update(dt);
    this.render(dt);
    this.raf = requestAnimationFrame((tt) => this.loop(tt));
  }

  update(dt) {
    const lv = this.lv;
    this.elapsed += dt;
    if (lv.type === 'timer') this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.rush > 0) {
      this.rush -= dt;
      if (this.rush <= 0) this.scene.classList.remove('rush');
    }

    // arrivals
    const free = this.seats.filter((s) => !s.cust);
    const canSpawn = lv.type === 'timer' ? this.timeLeft > 6 : this.spawned < lv.limit;
    if (canSpawn && free.length && this.elapsed >= this.nextArrival) {
      this.spawn(pick(free));
      const busy = this.seats.length - free.length;
      this.nextArrival = this.elapsed + rand(lv.arrive[0], lv.arrive[1]) * (busy === 0 ? 0.4 : 1);
    }

    // customers
    for (const c of [...this.customers]) this.updateCustomer(c, dt);

    // stations
    for (const s of this.stations) this.updateStation(s, dt);

    // Mochi
    this.updateBunny(dt);

    // end conditions
    if (lv.type === 'timer' && this.timeLeft <= 0) this.finish(false);
    if (lv.type !== 'timer' && this.spawned >= lv.limit && this.customers.length === 0) this.finish(false);
    if (lv.type === 'lose' && this.lost >= lv.walkouts) this.finish(true);

    this.updateHint();
  }

  // -------------------------------------------------------------------------
  spawn(seat) {
    const lv = this.lv;
    this.spawned++;
    const newest = lv.dishes[0];
    const dishPick = () => (Math.random() < 0.3 ? newest : pick(lv.dishes));
    const order = [dishPick()];
    if (Math.random() < lv.multi) {
      let d2 = pick(lv.dishes);
      if (d2 === order[0] && lv.dishes.length > 1) d2 = pick(lv.dishes.filter((d) => d !== order[0]));
      order.push(d2);
    }
    const complexity = Math.max(...order.map(chainTime)) + (order.length > 1 ? 4 : 0);
    const animal = pick(ANIMALS);
    const c = {
      seat, animal, order: order.map((k) => ({ k, done: false })),
      gen: rand(0.8, 1.35),
      state: 'enter', x: -70, t: 0,
    };
    c.heartSec = (lv.h + complexity * 0.2) * rand(0.88, 1.15) * this.mods.patience;
    c.max = c.heartSec * 5;
    c.patience = c.max;
    seat.cust = c;
    c.el = el('cust', `<div class="cust-body">${art.customerSVG(animal, Math.random() < 0.5 ? Math.floor(rand(-60, 60)) : 0)}</div>`, this.custLayer);
    c.bubble = el('bubble hidden', '<div class="b-items"></div><div class="b-hearts"></div>', this.bubbleLayer);
    Object.assign(c.bubble.style, { left: `${seat.x + 26 * seat.scale}px`, top: `${seat.y - 150 * seat.scale - 6}px` });
    c.el.style.zIndex = Math.round(seat.y);
    c.bubble.style.zIndex = Math.round(seat.y) + 600;
    c.bubble.addEventListener('pointerdown', (e) => { e.preventDefault(); this.tapSeat(this.seats.indexOf(seat)); });
    c.heartsEl = c.bubble.querySelector('.b-hearts');
    c.itemsEl = c.bubble.querySelector('.b-items');
    this.renderOrder(c);
    this.customers.push(c);
  }

  renderOrder(c) {
    c.itemsEl.innerHTML = c.order.map((o) => `<span class="oi ${o.done ? 'done' : ''}">${art.itemHTML(o.k)}</span>`).join('');
  }

  updateCustomer(c, dt) {
    c.t += dt;
    const target = c.seat.x;
    if (c.state === 'enter') {
      c.x += 520 * dt;
      if (c.x >= target) {
        c.x = target;
        c.state = 'wait';
        c.bubble.classList.remove('hidden');
        sfx.arrive();
      }
    } else if (c.state === 'wait') {
      c.patience -= dt * (this.rush > 0 ? 0.5 : 1);
      if (c.patience <= 0) {
        c.state = 'leave';
        c.mood = 'mad';
        c.el.classList.add('mad');
        this.lost++;
        this.streak = 0;
        this.release(c);
        sfx.leave();
        this.popText(c.seat.x, c.seat.y - 150 * c.seat.scale, 'Hmph!', 'bad');
      }
    } else if (c.state === 'happy') {
      if (c.t > 0.9) { c.state = 'leave'; this.release(c); }
    } else if (c.state === 'leave') {
      c.x -= 560 * dt;
      if (c.x < -90) {
        c.el.remove();
        this.customers.splice(this.customers.indexOf(c), 1);
      }
    }
    const hearts = Math.max(0, Math.ceil(c.patience / c.heartSec - 0.001));
    if (hearts !== c.hearts) {
      c.hearts = hearts;
      c.heartsEl.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < hearts ? 'on' : ''}">♥</i>`).join('');
      c.bubble.classList.toggle('low', hearts <= 2);
    }
  }

  release(c) {
    c.bubble.remove();
    if (c.seat.cust === c) c.seat.cust = null;
    this.queue = this.queue.filter((q) => q.ref !== c.seat || q.cust !== c);
    this.updateMarkers();
  }

  // -------------------------------------------------------------------------
  stepsFor(type) { return this.lv.steps.filter((s) => s.st === type); }

  updateStation(s, dt) {
    if (s.state === 'cooking') {
      s.t += dt;
      if (s.t >= s.dur) {
        s.state = 'done';
        s.product = s.step.out;
        s.servings = s.step.servings;
        s.contents = [];
        s.age = 0;
        s.burnT = s.step.burn ? s.step.burn * this.mods.burn : 0;
        s.dirty = true;
        sfx.done();
      }
    } else if (s.state === 'done' && s.burnT > 0) {
      s.age += dt;
      const left = s.burnT - s.age;
      if (left < s.burnT * 0.4) {
        s.el.classList.add('warn');
        this.warnTick -= dt;
        if (this.warnTick <= 0) { sfx.warn(); this.warnTick = 0.7; }
      }
      if (left <= 0) {
        s.state = 'burned';
        s.el.classList.remove('warn');
        s.dirty = true;
        sfx.burn();
        this.setMood('oops', 1.2);
        this.popText(s.x, s.y - 60, 'Burnt!', 'bad');
      }
    }
  }

  startCook(s, step) {
    s.step = step;
    s.state = 'cooking';
    s.t = 0;
    s.dur = Math.max(0.3, step.t * this.mods.cook);
    s.dirty = true;
    sfx.start();
  }

  resetStation(s) {
    Object.assign(s, { state: 'idle', contents: [], product: null, servings: 0, age: 0, burnT: 0, step: null, dirty: true });
    s.el.classList.remove('warn');
  }

  // -------------------------------------------------------------------------
  tapSeat(i) {
    const seat = this.seats[i];
    if (!seat.cust || seat.cust.state === 'leave') return;
    this.enqueue(seat, seat.cust);
  }

  enqueue(ref, cust = null) {
    if (this.over || this.paused) return;
    sfx.unlock();
    if (this.queue.length >= MAX_QUEUE) { sfx.nope(); this.toast('Mochi has enough to do!'); return; }
    sfx.tap();
    this.queue.push({ ref, cust });
    this.updateMarkers();
  }

  standPoint(ref) {
    return { x: ref.sx, y: ref.sy };
  }

  updateBunny(dt) {
    const b = this.bunny;
    if (b.moodT > 0) { b.moodT -= dt; if (b.moodT <= 0) this.setMood('', 0); }
    if (!this.current && this.queue.length) {
      this.current = this.queue[0];
      this.current.wait = 0.1;
    }
    const cur = this.current;
    if (!cur) { b.moving = false; return; }
    const p = this.standPoint(cur.ref);
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    const d = Math.hypot(dx, dy);
    const step = this.mods.speed * dt;
    if (d > step) {
      b.x += (dx / d) * step;
      b.y += (dy / d) * step;
      b.moving = true;
      if (Math.abs(dx) > 2) b.face = dx > 0 ? 1 : -1;
      return;
    }
    b.x = p.x;
    b.y = p.y;
    b.moving = false;
    cur.wait -= dt;
    if (cur.wait > 0) return;
    this.queue.shift();
    this.current = null;
    this.perform(cur);
    this.updateMarkers();
  }

  perform({ ref, cust }) {
    const b = this.bunny;
    const room = b.hands.length < this.mods.carry;
    switch (ref.kind) {
      case 'bin':
        if (!room) return this.fail('Paws are full! Use a plate or the trash.');
        b.hands.push({ k: ref.item });
        sfx.pick();
        break;
      case 'station': this.useStation(ref); break;
      case 'plate':
        if (ref.item && room) {
          b.hands.push(ref.item);
          ref.item = null;
          sfx.pick();
        } else if (!ref.item && b.hands.length) {
          const it = b.hands.find((h) => this.marked.has(h)) || b.hands.find((h) => ITEMS[h.k].p && !h.burned) || b.hands.find((h) => !h.burned) || b.hands[0];
          b.hands.splice(b.hands.indexOf(it), 1);
          this.marked.delete(it);
          ref.item = it;
          sfx.place();
        } else return this.fail(ref.item ? 'Paws are full!' : 'Nothing to put down.');
        ref.el.querySelector('.hp-item').innerHTML = ref.item ? art.itemHTML(ref.item.k, { burned: ref.item.burned }) : '';
        break;
      case 'trash': {
        if (!b.hands.length) return this.fail('Nothing to throw away.');
        let gone = b.hands.filter((h) => this.marked.has(h));
        if (!gone.length) gone = b.hands.filter((h) => h.burned);
        if (!gone.length) gone = [b.hands[b.hands.length - 1]];
        b.hands = b.hands.filter((h) => !gone.includes(h));
        gone.forEach((g) => this.marked.delete(g));
        sfx.trash();
        break;
      }
      default:
        if (ref.isSeat) this.serve(ref, cust);
    }
    this.renderHands();
  }

  useStation(s) {
    const b = this.bunny;
    const room = b.hands.length < this.mods.carry;
    if (s.state === 'done' || s.state === 'burned') {
      if (!room) return this.fail('Paws are full!');
      const burned = s.state === 'burned';
      b.hands.push({ k: s.product, burned });
      s.servings--;
      if (burned || s.servings <= 0) this.resetStation(s);
      else { s.dirty = true; s.age = 0; }
      sfx.pick();
      return;
    }
    if (s.state === 'cooking') return this.fail('Still cooking...');
    const usable = b.hands.filter((h) => !h.burned);
    const steps = this.stepsFor(s.type).filter((st) => isSub(s.contents, st.in));
    // Prefer a recipe that can be completed right now, ideally one a guest is waiting for.
    const wanted = new Set(this.customers.flatMap((c) => c.order.filter((o) => !o.done).map((o) => o.k)));
    const complete = steps
      .map((st) => ({ st, need: minus(st.in, s.contents) }))
      .filter(({ need }) => isSub(need, usable.map((h) => h.k)))
      .sort((a, c) => (wanted.has(c.st.out) - wanted.has(a.st.out)) || (c.need.length - a.need.length));
    if (complete.length) {
      const { st, need } = complete[0];
      need.forEach((k) => {
        const h = b.hands.find((x) => x.k === k && !x.burned);
        b.hands.splice(b.hands.indexOf(h), 1);
        this.marked.delete(h);
      });
      s.contents.push(...need);
      this.startCook(s, st);
      return;
    }
    let added = false;
    for (const h of [...usable]) {
      const next = [...s.contents, h.k];
      if (steps.some((st) => isSub(next, st.in))) {
        s.contents.push(h.k);
        b.hands.splice(b.hands.indexOf(h), 1);
        this.marked.delete(h);
        added = true;
      }
    }
    if (added) { s.dirty = true; sfx.place(); return; }
    if (!b.hands.length && s.contents.length) {
      // take back loose ingredients
      const k = s.contents.pop();
      b.hands.push({ k });
      s.dirty = true;
      sfx.pick();
      return;
    }
    this.fail(b.hands.length ? `The ${STATIONS[s.type].n} station can't use that.` : 'Bring ingredients here first.');
  }

  serve(seat, cust) {
    const c = seat.cust;
    if (!c || c !== cust || c.state !== 'wait') return this.fail('');
    const b = this.bunny;
    let any = false;
    for (const o of c.order) {
      if (o.done) continue;
      const h = b.hands.find((x) => x.k === o.k && !x.burned);
      if (h) {
        b.hands.splice(b.hands.indexOf(h), 1);
        this.marked.delete(h);
        o.done = true;
        any = true;
      }
    }
    if (!any) return this.fail(b.hands.some((h) => h.burned) ? 'Nobody wants burnt food!' : "That's not what they ordered.");
    this.renderOrder(c);
    if (c.order.every((o) => o.done)) {
      const hearts = Math.max(1, Math.ceil(c.patience / c.heartSec));
      const base = c.order.reduce((a, o) => a + ITEMS[o.k].p, 0);
      const tip = Math.round(base * 0.5 * c.gen * (hearts / 5));
      this.streak++;
      const chain = this.streak >= 2 ? Math.min(10 * (this.streak - 1), 50) : 0;
      let total = base + tip + chain;
      if (this.rush > 0) total = Math.round(total * 1.5);
      this.coins += total;
      this.served++;
      c.state = 'happy';
      c.t = 0;
      c.el.classList.add('happy');
      sfx.serve();
      this.setMood('happy', 1);
      this.popText(seat.x + 30, seat.y - 150 * seat.scale + 20, `+${total}`, 'coin');
      if (chain) this.popText(seat.x + 30, seat.y - 150 * seat.scale - 10, `Streak x${this.streak}!`, 'streak');
      if (this.rush <= 0) {
        this.heart += hearts;
        if (this.heart >= RUSH_NEED) this.startRush();
      }
      this.updateHud();
    } else {
      c.patience = Math.min(c.max, c.patience + c.heartSec * 0.7);
      sfx.place();
    }
  }

  startRush() {
    this.heart = 0;
    this.rush = RUSH_TIME;
    this.scene.classList.add('rush');
    this.customers.forEach((c) => { if (c.state === 'wait') c.patience = c.max; });
    sfx.rush();
    this.showBanner('Heart Rush! Coins x1.5');
  }

  fail(msg) {
    sfx.nope();
    if (msg) this.toast(msg);
    this.bunny.el.classList.remove('shake');
    void this.bunny.el.offsetWidth;
    this.bunny.el.classList.add('shake');
  }

  setMood(m, t) {
    this.bunny.mood = m;
    this.bunny.moodT = t;
    this.bunny.el.dataset.mood = m;
  }

  // -------------------------------------------------------------------------
  finish(failed) {
    if (this.over) return;
    this.over = true;
    const stars = failed ? 0 : this.lv.goals.filter((g) => this.coins >= g).length;
    setTimeout(() => this.hooks.onEnd?.({
      coins: this.coins, stars, failed, served: this.served, lost: this.lost,
    }), 900);
    this.showBanner(failed ? 'Too many unhappy guests...' : this.lv.type === 'timer' ? "Time's up!" : 'Shift complete!');
  }

  pause(on) {
    this.paused = on;
    this.last = performance.now();
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.root.innerHTML = '';
  }

  // -------------------------------------------------------------------------
  render() {
    const b = this.bunny;
    if (b.moving) b.hop += 0.016 * 16;
    const hopY = b.moving ? -Math.abs(Math.sin(b.hop)) * 12 : 0;
    if (b.moving && Math.sin(b.hop) * Math.sin(b.hop - 0.25) < 0) sfx.hop();
    const sc = depthScale(b.y);
    b.el.style.transform = `translate(${b.x - (BUNNY_W * sc) / 2}px, ${b.y - BUNNY_H * sc + hopY}px) scale(${sc})`;
    b.el.style.zIndex = Math.round(b.y);
    b.el.classList.toggle('flip', b.face < 0);
    b.el.classList.toggle('moving', !!b.moving);

    for (const c of this.customers) {
      c.el.style.transform = `translate(${c.x - 50 * c.seat.scale}px, ${c.seat.y - 150 * c.seat.scale}px) scale(${c.seat.scale})`;
      if (c.state === 'wait') {
        const frac = c.patience / c.max;
        c.el.classList.toggle('impatient', frac < 0.35);
      }
    }

    for (const s of this.stations) {
      if (s.dirty) {
        s.dirty = false;
        s.el.dataset.state = s.state;
        if (s.state === 'done' || s.state === 'burned') {
          s.itemsEl.innerHTML = `<span class="product">${art.itemHTML(s.product, { burned: s.state === 'burned' })}${s.servings > 1 ? `<b class="serv">x${s.servings}</b>` : ''}</span>`;
        } else {
          let ghosts = [];
          if (s.state === 'idle' && s.contents.length) {
            const cands = this.stepsFor(s.type).filter((st) => isSub(s.contents, st.in));
            if (cands.length === 1) ghosts = minus(cands[0].in, s.contents);
          }
          s.itemsEl.innerHTML = s.contents.map((k) => art.itemHTML(k, { small: true, plate: false })).join('')
            + ghosts.map((k) => art.itemHTML(k, { small: true, ghost: true, plate: false })).join('');
        }
      }
      let frac = -1;
      let color = '#5ccf8f';
      if (s.state === 'cooking') frac = s.t / s.dur;
      else if (s.state === 'done' && s.burnT) {
        frac = 1 - s.age / s.burnT;
        color = frac < 0.4 ? '#ff5a5a' : '#ffb340';
      }
      s.ring.style.opacity = frac >= 0 ? 1 : 0;
      if (frac >= 0) {
        s.rfg.style.strokeDashoffset = `${100.5 * (1 - frac)}`;
        s.rfg.style.stroke = color;
      }
    }
    this.updateHud();
  }

  renderHands() {
    const b = this.bunny;
    this.heldEl.innerHTML = b.hands.map((h) => art.itemHTML(h.k, { burned: h.burned, small: true })).join('');
    let html = '';
    for (let i = 0; i < this.mods.carry; i++) {
      const h = b.hands[i];
      html += h
        ? `<div class="tslot ${this.marked.has(h) ? 'marked' : ''}" data-i="${i}" title="Tap to mark for the trash">${art.itemHTML(h.k, { burned: h.burned })}</div>`
        : '<div class="tslot empty"></div>';
    }
    this.traySlots.innerHTML = html;
    this.trash.el.classList.toggle('glow', this.marked.size > 0 || b.hands.some((h) => h.burned));
  }

  updateMarkers() {
    const counts = new Map();
    const all = [...this.stations, ...this.bins, ...this.plates, this.trash];
    all.forEach((r) => counts.set(r, []));
    this.seats.forEach((s) => counts.set(s, []));
    this.queue.forEach((q, i) => counts.get(q.ref)?.push(i + 1));
    counts.forEach((nums, r) => {
      const target = r.isSeat ? r.hit : r.el;
      let qb = target.querySelector('.qb');
      if (!qb) qb = el('qb', '', target);
      qb.textContent = nums.length ? nums.join(' ') : '';
      qb.classList.toggle('on', nums.length > 0);
    });
  }

  updateHud(force) {
    const lv = this.lv;
    const shown = Math.round(this.coins);
    if (force || shown !== this.shownCoins) {
      this.shownCoins = shown;
      this.coinsEl.textContent = shown;
      this.coinFill.style.width = `${Math.min(100, (this.coins / lv.goals[2]) * 100)}%`;
      this.marks.forEach((m, i) => m.classList.toggle('got', this.coins >= lv.goals[i]));
    }
    let g;
    if (lv.type === 'timer') {
      const s = Math.ceil(this.timeLeft);
      g = `${art.ic('stopwatch')} ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    } else {
      g = `${art.ic('paw-prints')} ${Math.max(0, lv.limit - this.served - this.lost)} guests left`;
    }
    if (lv.type === 'lose') g += ` · ${art.ic('broken-heart')} ${this.lost}/${lv.walkouts}`;
    if (g !== this.lastGoal) { this.lastGoal = g; this.goalEl.innerHTML = g; }
    const hm = this.rush > 0 ? this.rush / RUSH_TIME : this.heart / RUSH_NEED;
    this.hmFill.style.width = `${Math.min(100, hm * 100)}%`;
    this.hud.classList.toggle('rush', this.rush > 0);
    this.hud.classList.toggle('lowtime', lv.type === 'timer' && this.timeLeft < 15 && this.timeLeft > 0);
  }

  popText(x, y, text, kind) {
    const p = el(`pop ${kind}`, text, this.fx);
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    setTimeout(() => p.remove(), 1200);
  }

  toast(msg) {
    this.toastEl.textContent = msg;
    this.toastEl.classList.remove('show');
    void this.toastEl.offsetWidth;
    this.toastEl.classList.add('show');
  }

  showBanner(msg) {
    this.banner.textContent = msg;
    this.banner.classList.remove('show');
    void this.banner.offsetWidth;
    this.banner.classList.add('show');
  }

  // -------------------------------------------------------------------------
  // Light tutorial: a hint line plus a pointer at the thing to tap next.
  updateHint() {
    if (!this.save.settings.hints) { this.setHint(null); return; }
    const tut = this.lv.tut;
    const b = this.bunny;
    const has = (k) => b.hands.some((h) => h.k === k && !h.burned);
    if (b.hands.some((h) => h.burned)) return this.setHint('Burnt! Tap the trash can to toss it.', this.trash);
    if (tut === 'basics') {
      const sk = this.stations[0];
      const waiting = this.customers.find((c) => c.state === 'wait');
      if (has('fried_egg') && waiting) return this.setHint('Tap the guest to serve their fried egg!', waiting.seat, true);
      if (sk.state === 'done') return this.setHint('Ready! Tap the skillet to grab it before it burns.', sk);
      if (sk.state === 'cooking') return this.setHint('Cooking... the ring shows how long is left.', null);
      if (has('egg')) return this.setHint('Now tap the skillet to cook the egg.', sk);
      if (!has('fried_egg')) return this.setHint('Tap the egg basket. Mochi hops over and grabs one.', this.bins[0]);
      return this.setHint('A guest will hop in soon!', null);
    }
    const intro = {
      burn: 'Finished food burns if you leave it too long. Watch for the red ring!',
      plate: 'Holding plates (left) keep finished food safe while you work.',
      timer: 'Timed shift! Serve as many guests as you can before the clock runs out.',
      lose: 'Careful: if 3 guests leave unhappy, the shift ends early.',
      multi: 'Some guests order two dishes. Serve both to get paid.',
      servings: 'Coffee makers brew 3 cups at once. Tap again for each cup.',
    }[tut];
    if (intro && this.elapsed < 9) {
      const target = tut === 'plate' ? this.plates[0] : tut === 'servings' ? this.stations.find((s) => s.type === 'coffee') : null;
      return this.setHint(intro, target);
    }
    if (this.lv.index < 3 && b.hands.length >= this.mods.carry && this.elapsed > 10) return this.setHint('Paws are full! Serve, use a plate, or tap an item below and then the trash.', null);
    this.setHint(null);
  }

  setHint(text, target, isSeat) {
    if (text !== this.hintText) {
      this.hintText = text;
      this.hintEl.querySelector('.hint-text').textContent = text || '';
      this.hintEl.classList.toggle('show', !!text);
    }
    if (target) {
      const x = target.isSeat ? target.x + 50 : target.x;
      const y = target.isSeat ? target.y - 150 * target.scale - 50 : (target.y - (target.kind === 'bin' ? 62 : 80));
      this.pointer.style.transform = `translate(${x - 18}px, ${y}px)`;
      this.pointer.classList.add('show');
    } else {
      this.pointer.classList.remove('show');
    }
  }
}
