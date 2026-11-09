// Hop to It! - game data (original content, MIT licensed)
// Items: n = name, e = emoji glyph (rendered with the player's system font),
// f = look filter, bowl = shown in a mixing bowl, top = small topping glyph, p = price (dishes)

export const ITEMS = {
  // ---- raw ingredients
  egg: { n: 'Egg', i: 'egg' },
  bread: { n: 'Bread', i: 'bread' },
  carrot: { n: 'Carrot', i: 'carrot' },
  potato: { n: 'Potato', i: 'potato' },
  lettuce: { n: 'Lettuce', i: 'leafy-green' },
  tomato: { n: 'Tomato', i: 'tomato' },
  bacon_raw: { n: 'Bacon', i: 'bacon', f: 'raw' },
  patty: { n: 'Patty', i: 'cut-of-meat' },
  milk: { n: 'Milk', i: 'glass-of-milk' },
  flour: { n: 'Flour', i: 'sheaf-of-rice' },
  onion: { n: 'Onion', i: 'onion' },
  butter: { n: 'Butter', i: 'butter' },
  chocolate: { n: 'Chocolate', i: 'chocolate-bar' },
  strawberry: { n: 'Strawberry', i: 'strawberry' },
  apple: { n: 'Apple', i: 'red-apple' },
  beans: { n: 'Coffee Beans', i: 'chestnut' },
  tea_leaves: { n: 'Tea Leaves', i: 'leaf-fluttering-in-wind' },
  rice_raw: { n: 'Rice', i: 'takeout-box' },
  seaweed: { n: 'Seaweed', i: 'herb' },
  tofu: { n: 'Tofu', i: 'ice' },
  noodles: { n: 'Noodles', i: 'spaghetti' },
  shrimp: { n: 'Shrimp', i: 'shrimp' },
  fish: { n: 'Fish', i: 'fish' },
  cabbage: { n: 'Cabbage', i: 'leafy-green' },
  honey: { n: 'Honey', i: 'honey-pot' },

  // ---- in-between products
  diced_potato: { n: 'Diced Potato', i: 'potato', bowl: 1 },
  batter: { n: 'Pancake Batter', i: 'bowl-with-spoon' },
  cooked_patty: { n: 'Cooked Patty', i: 'cut-of-meat', f: 'cooked' },
  cookie_dough: { n: 'Cookie Dough', i: 'cookie', f: 'pale', bowl: 1 },
  muffin_batter: { n: 'Muffin Batter', i: 'strawberry', bowl: 1 },
  grated_carrot: { n: 'Grated Carrot', i: 'carrot', bowl: 1 },
  cake_batter: { n: 'Cake Batter', i: 'bowl-with-spoon', top: 'carrot' },
  sliced_apple: { n: 'Apple Slices', i: 'red-apple', bowl: 1 },
  raw_pie: { n: 'Unbaked Pie', i: 'pie', f: 'pale' },
  shredded_cabbage: { n: 'Shredded Cabbage', i: 'leafy-green', bowl: 1 },
  raw_dumplings: { n: 'Raw Dumplings', i: 'dumpling', f: 'pale' },
  fish_slices: { n: 'Fish Slices', i: 'fish', bowl: 1 },
  veg_chunks: { n: 'Veggie Chunks', i: 'carrot', top: 'potato', bowl: 1 },
  curry_sauce: { n: 'Curry Sauce', i: 'shallow-pan-of-food' },

  // ---- dishes (p = price)
  fried_egg: { n: 'Fried Egg', i: 'cooking', p: 20 },
  toast: { n: 'Toast', i: 'bread', f: 'gold', p: 15 },
  carrot_juice: { n: 'Carrot Juice', i: 'beverage-box', p: 18 },
  baked_potato: { n: 'Baked Potato', i: 'roasted-sweet-potato', f: 'gold', p: 30 },
  salad: { n: 'Garden Salad', i: 'green-salad', p: 40 },
  bacon: { n: 'Crispy Bacon', i: 'bacon', p: 30 },
  soup: { n: 'Tomato Soup', i: 'pot-of-food', p: 50 },
  fries: { n: 'Home Fries', i: 'french-fries', p: 60 },
  pancakes: { n: 'Pancakes', i: 'pancakes', p: 70 },
  burger: { n: 'Bunny Burger', i: 'hamburger', p: 100 },

  coffee: { n: 'Coffee', i: 'hot-beverage', p: 25 },
  croissant: { n: 'Croissant', i: 'croissant', p: 12, ready: 1 },
  donut: { n: 'Donut', i: 'doughnut', p: 10, ready: 1 },
  tea: { n: 'Green Tea', i: 'teacup-without-handle', p: 22 },
  cookies: { n: 'Choco Cookies', i: 'cookie', p: 60 },
  muffin: { n: 'Berry Muffin', i: 'cupcake', p: 70 },
  cocoa: { n: 'Choco Milk Tea', i: 'bubble-tea', p: 45 },
  candy: { n: 'Lollipop', i: 'lollipop', p: 0, treat: true },
  carrot_cake: { n: 'Carrot Cake', i: 'shortcake', top: 'carrot', p: 130 },
  apple_pie: { n: 'Apple Pie', i: 'pie', p: 140 },

  rice: { n: 'Steamed Rice', i: 'cooked-rice', p: 25 },
  onigiri: { n: 'Rice Ball', i: 'rice-ball', p: 45 },
  miso: { n: 'Miso Soup', i: 'bowl-with-spoon', p: 40 },
  ramen: { n: 'Ramen', i: 'steaming-bowl', p: 90 },
  tempura: { n: 'Shrimp Tempura', i: 'fried-shrimp', p: 80 },
  dumplings: { n: 'Dumplings', i: 'dumpling', p: 110 },
  sushi: { n: 'Sushi', i: 'sushi', p: 120 },
  dango: { n: 'Honey Dango', i: 'dango', p: 50 },
  curry: { n: 'Curry Rice', i: 'curry-rice', p: 150 },
};

export const STATIONS = {
  skillet: { n: 'Skillet' },
  toaster: { n: 'Toaster' },
  juicer: { n: 'Juicer' },
  oven: { n: 'Oven' },
  chop: { n: 'Chopping' },
  pot: { n: 'Pot' },
  mixer: { n: 'Mixer' },
  board: { n: 'Plating' },
  coffee: { n: 'Coffee' },
  kettle: { n: 'Kettle' },
  ricecooker: { n: 'Rice Cooker' },
  steamer: { n: 'Steamer' },
};

// [station, inputs, output, cook seconds, burn seconds (0 = never burns), servings]
const RAW_STEPS = [
  ['skillet', ['egg'], 'fried_egg', 5, 9],
  ['toaster', ['bread'], 'toast', 4, 0],
  ['juicer', ['carrot'], 'carrot_juice', 4, 0],
  ['oven', ['potato'], 'baked_potato', 8, 12],
  ['chop', ['lettuce', 'tomato'], 'salad', 4, 0],
  ['skillet', ['bacon_raw'], 'bacon', 6, 8],
  ['pot', ['tomato', 'onion'], 'soup', 7, 12],
  ['chop', ['potato'], 'diced_potato', 3, 0],
  ['skillet', ['diced_potato'], 'fries', 6, 10],
  ['mixer', ['milk', 'egg', 'flour'], 'batter', 5, 0],
  ['skillet', ['batter'], 'pancakes', 6, 9],
  ['skillet', ['patty'], 'cooked_patty', 8, 10],
  ['board', ['cooked_patty', 'lettuce', 'bread'], 'burger', 4, 0],

  ['coffee', ['beans'], 'coffee', 6, 0, 3],
  ['kettle', ['tea_leaves'], 'tea', 5, 0, 3],
  ['mixer', ['flour', 'butter', 'chocolate'], 'cookie_dough', 4, 0],
  ['oven', ['cookie_dough'], 'cookies', 7, 8],
  ['mixer', ['flour', 'milk', 'strawberry'], 'muffin_batter', 5, 0],
  ['oven', ['muffin_batter'], 'muffin', 8, 8],
  ['kettle', ['milk', 'chocolate'], 'cocoa', 5, 0, 2],
  ['chop', ['carrot'], 'grated_carrot', 3, 0],
  ['mixer', ['grated_carrot', 'flour', 'egg'], 'cake_batter', 5, 0],
  ['oven', ['cake_batter'], 'carrot_cake', 10, 9],
  ['chop', ['apple'], 'sliced_apple', 3, 0],
  ['board', ['sliced_apple', 'flour', 'butter'], 'raw_pie', 4, 0],
  ['oven', ['raw_pie'], 'apple_pie', 10, 10],

  ['ricecooker', ['rice_raw'], 'rice', 6, 0, 3],
  ['board', ['rice', 'seaweed'], 'onigiri', 3, 0],
  ['pot', ['tofu', 'seaweed'], 'miso', 5, 10],
  ['pot', ['noodles', 'egg'], 'ramen', 8, 10],
  ['skillet', ['shrimp', 'flour'], 'tempura', 6, 8],
  ['chop', ['cabbage'], 'shredded_cabbage', 3, 0],
  ['board', ['flour', 'shredded_cabbage'], 'raw_dumplings', 4, 0],
  ['steamer', ['raw_dumplings'], 'dumplings', 7, 10],
  ['chop', ['fish'], 'fish_slices', 3, 0],
  ['board', ['rice', 'fish_slices'], 'sushi', 4, 0],
  ['board', ['rice', 'honey'], 'dango', 3, 0],
  ['chop', ['carrot', 'potato'], 'veg_chunks', 3, 0],
  ['pot', ['veg_chunks', 'onion'], 'curry_sauce', 8, 12],
  ['board', ['curry_sauce', 'rice'], 'curry', 3, 0],
];

export const STEPS = RAW_STEPS.map(([st, inp, out, t, burn, servings]) => ({
  st, in: inp, out, t, burn, servings: servings || 1,
}));

export const stepFor = (out) => STEPS.find((s) => s.out === out);

// Every step needed to make a dish (dependency order, deduplicated)
export const chainFor = (out, acc = []) => {
  const s = stepFor(out);
  if (!s) return acc;
  for (const i of s.in) chainFor(i, acc);
  if (!acc.includes(s)) acc.push(s);
  return acc;
};

export const chainTime = (out) => chainFor(out).reduce((a, s) => a + s.t + 1.5, 0);

export const WORLDS = [
  {
    id: 0, name: 'New Yolk City', blurb: 'The city that never sleeps in. Breakfast all day!',
    theme: 'diner', icon: 'cityscape', starsToUnlock: 0,
  },
  {
    id: 1, name: 'Pie-ris', blurb: 'Croissants, cookies and very fancy pies.',
    theme: 'bakery', icon: 'croissant', starsToUnlock: 12,
  },
  {
    id: 2, name: 'Tokyummy', blurb: 'Lantern-lit noodle bars that stay open past midnight.',
    theme: 'noodle', icon: 'tokyo-tower', starsToUnlock: 32,
  },
];

// type: 'seat' = serve a set number of customers, 'timer' = guests arrive until the clock runs out, then the line is served out,
// 'lose' = set number of customers but you fail after `walkouts` leave unhappy.
// h = seconds per patience heart, arrive = [min,max] seconds between arrivals,
// multi = chance of a 2-dish order, extra = additional copies of a station.
const L = (world, type, limit, seats, dishes, arrive, h, opts = {}) => ({
  world, type, limit, seats, dishes, arrive, h, multi: 0, extra: {}, walkouts: 3, plates: 1, ...opts,
});

const RAW_LEVELS = [
  // World 1: Carrot Corner Diner
  L(0, 'seat', 4, 1, ['fried_egg'], [2, 3], 10, { tut: 'basics', plates: 0 }),
  L(0, 'seat', 6, 2, ['toast', 'fried_egg'], [3, 6], 9.5, { tut: 'burn', plates: 0 }),
  L(0, 'seat', 7, 2, ['carrot_juice', 'toast', 'fried_egg'], [3, 6], 9, { tut: 'plate' }),
  L(0, 'timer', 90, 3, ['baked_potato', 'carrot_juice', 'fried_egg'], [4, 8], 9, { tut: 'timer' }),
  L(0, 'seat', 10, 3, ['salad', 'baked_potato', 'toast', 'carrot_juice'], [4, 8], 8.5),
  L(0, 'lose', 12, 3, ['bacon', 'salad', 'fried_egg', 'carrot_juice'], [4, 8], 8.5, { multi: 0.15, tut: 'lose' }),
  L(0, 'timer', 120, 3, ['soup', 'bacon', 'salad', 'baked_potato'], [4, 9], 8.5, { multi: 0.15 }),
  L(0, 'seat', 12, 4, ['fries', 'soup', 'fried_egg', 'carrot_juice'], [4, 9], 8.5, { multi: 0.2, tut: 'multi' }),
  L(0, 'timer', 150, 4, ['pancakes', 'fries', 'bacon', 'toast', 'carrot_juice'], [5, 10], 8.5, { multi: 0.2, extra: { skillet: 1 } }),
  L(0, 'lose', 14, 4, ['burger', 'pancakes', 'salad', 'carrot_juice', 'fries'], [5, 10], 8.5, { multi: 0.3, extra: { skillet: 1 } }),

  // World 2: Clover Bakery
  L(1, 'seat', 8, 3, ['coffee', 'croissant', 'donut'], [3, 7], 9, { tut: 'servings' }),
  L(1, 'seat', 9, 3, ['cookies', 'coffee', 'croissant'], [4, 8], 9),
  L(1, 'timer', 120, 3, ['tea', 'cookies', 'donut', 'coffee'], [4, 8], 8.5, { multi: 0.15 }),
  L(1, 'seat', 11, 3, ['muffin', 'cookies', 'tea'], [4, 8], 8.5, { multi: 0.15 }),
  L(1, 'lose', 12, 4, ['cocoa', 'muffin', 'croissant', 'coffee'], [4, 9], 8.5, { multi: 0.2 }),
  L(1, 'timer', 150, 4, ['carrot_cake', 'cookies', 'tea', 'donut'], [5, 10], 8.5, { multi: 0.2, extra: { oven: 1 } }),
  L(1, 'seat', 13, 4, ['carrot_cake', 'muffin', 'cocoa', 'coffee'], [5, 10], 8.5, { multi: 0.25, extra: { oven: 1, mixer: 1 }, plates: 2 }),
  L(1, 'timer', 160, 4, ['apple_pie', 'cookies', 'tea', 'croissant'], [5, 10], 8.5, { multi: 0.25, extra: { oven: 1 }, plates: 2 }),
  L(1, 'lose', 15, 4, ['apple_pie', 'carrot_cake', 'coffee', 'donut'], [5, 10], 8.5, { multi: 0.3, extra: { oven: 1 }, plates: 2 }),
  L(1, 'timer', 180, 5, ['apple_pie', 'carrot_cake', 'muffin', 'cookies', 'cocoa', 'coffee'], [5, 10], 8.5, { multi: 0.35, extra: { oven: 1, mixer: 1 }, plates: 2 }),

  // World 3: Moonlit Noodle House
  L(2, 'seat', 8, 3, ['rice', 'tea', 'onigiri'], [3, 7], 9),
  L(2, 'seat', 10, 3, ['miso', 'onigiri', 'tea', 'rice'], [4, 8], 9),
  L(2, 'timer', 120, 3, ['ramen', 'miso', 'tea'], [4, 8], 8.5, { multi: 0.15 }),
  L(2, 'seat', 12, 4, ['tempura', 'ramen', 'onigiri'], [4, 9], 8.5, { multi: 0.2 }),
  L(2, 'lose', 12, 4, ['dumplings', 'tempura', 'tea', 'miso'], [5, 9], 8.5, { multi: 0.2 }),
  L(2, 'timer', 150, 4, ['sushi', 'dumplings', 'onigiri', 'tea'], [5, 10], 8.5, { multi: 0.25, extra: { board: 1 }, plates: 2 }),
  L(2, 'seat', 14, 4, ['dango', 'sushi', 'ramen', 'miso'], [5, 10], 8.5, { multi: 0.25, extra: { board: 1 }, plates: 2 }),
  L(2, 'timer', 160, 5, ['curry', 'tempura', 'onigiri', 'tea'], [5, 10], 8.5, { multi: 0.25, extra: { pot: 1, board: 1 }, plates: 2 }),
  L(2, 'lose', 14, 5, ['curry', 'dumplings', 'sushi', 'miso'], [7, 12], 10.5, { multi: 0.2, walkouts: 5, extra: { pot: 1, board: 1 }, plates: 2 }),
  L(2, 'timer', 200, 5, ['curry', 'ramen', 'sushi', 'dumplings', 'dango', 'tea'], [5, 10], 9, { multi: 0.35, extra: { pot: 1, board: 1 }, plates: 2 }),
];

// Average coins from an automated test chef (instant reactions). Star goals for a human
// are set as a share of this; levels without a sample use the payout estimate below.
const CAL = {"1-1": 184, "1-2": 298, "1-3": 388, "1-4": 965, "1-5": 868, "1-6": 1021, "1-7": 1712, "1-8": 1266, "1-9": 2346, "1-10": 2450, "2-1": 534, "2-2": 890, "2-3": 2170, "2-4": 1488, "2-5": 1377, "2-6": 1212, "2-7": 2532, "2-8": 2963, "2-9": 2908, "2-10": 2856, "3-1": 684, "3-2": 1008, "3-3": 1544, "3-4": 2094, "3-5": 1952, "3-6": 1560, "3-7": 2166, "3-8": 2463, "3-9": 2100, "3-10": 2400};

// Coin goals are derived from what a level can reasonably pay out.
const goalsFor = (lv) => {
  const avgPrice = lv.dishes.reduce((a, d) => a + ITEMS[d].p, 0) / lv.dishes.length;
  const perCustomer = avgPrice * (1 + lv.multi) * 1.45; // price + typical tip
  let n;
  if (lv.type === 'timer') {
    const avgChain = lv.dishes.reduce((a, d) => a + chainTime(d), 0) / lv.dishes.length;
    const avgArrive = (lv.arrive[0] + lv.arrive[1]) / 2;
    n = lv.limit / Math.max(avgArrive, 3 + avgChain * 0.45);
  } else {
    n = lv.limit;
  }
  const max = n * perCustomer + Math.min(n, 12) * 12;
  const r = (x) => Math.max(10, Math.round(x / 10) * 10);
  return lv.type === 'timer' ? [r(max * 0.35), r(max * 0.55), r(max * 0.75)] : [r(max * 0.42), r(max * 0.62), r(max * 0.8)];
};

export const LEVELS = RAW_LEVELS.map((lv, i) => {
  const inWorld = RAW_LEVELS.slice(0, i).filter((o) => o.world === lv.world).length;
  const id = `${lv.world + 1}-${inWorld + 1}`;
  const steps = [];
  lv.dishes.forEach((d) => chainFor(d).forEach((s) => !steps.includes(s) && steps.push(s)));
  const stationTypes = [];
  steps.forEach((s) => !stationTypes.includes(s.st) && stationTypes.push(s.st));
  const products = new Set(steps.map((s) => s.out));
  const bins = [];
  steps.forEach((s) => s.in.forEach((i2) => !products.has(i2) && !bins.includes(i2) && bins.push(i2)));
  lv.dishes.forEach((d) => ITEMS[d].ready && !bins.includes(d) && bins.push(d));
  const prevDishes = new Set(RAW_LEVELS.slice(0, i).flatMap((o) => o.dishes));
  return {
    ...lv, index: i, id, steps, stationTypes, bins,
    newDishes: lv.dishes.filter((d) => !prevDishes.has(d)),
    goals: i >= 3 && CAL[id] ? [0.3, 0.45, 0.6].map((f) => Math.round((CAL[id] * f) / 10) * 10) : goalsFor(lv),
  };
});

// Shop, modelled on how the classic games handled it: every appliance has a
// level 2 and level 3 model that cooks faster (level 3 also burns slower and,
// for brewers, makes an extra serving), plus helper appliances and Mochi's gear.
// Everything is bought with coins earned in the kitchen. No real money anywhere.
export const TIER_BONUS = [
  { speed: 1, burn: 1, serv: 0 },
  { speed: 1.3, burn: 1.15, serv: 0 },
  { speed: 1.55, burn: 1.45, serv: 1 },
];
const T = (n1, n2, d2, n3, d3, c2, c3) => [
  { n: n1 },
  { n: n2, d: d2, cost: c2 },
  { n: n3, d: d3, cost: c3 },
];
export const APPLIANCES = {
  skillet: T('Skillet', 'Heart Skillet', 'Fries 30% faster. Eggs love it.', 'Star Skillet', 'Fries 55% faster and keeps food from burning.', 250, 900),
  toaster: T('Toaster', 'Bunny Toaster', 'Pops toast 30% faster.', 'Cloud Toaster', '55% faster, and toast stays golden longer.', 250, 900),
  juicer: T('Juicer', 'Twirl Juicer', 'Squeezes 30% faster.', 'Rainbow Juicer', 'Squeezes 55% faster.', 300, 1000),
  oven: T('Oven', 'Cozy Oven', 'Bakes 30% faster, but burns just as slow.', 'Dream Oven', 'Bakes 55% faster and burns much slower.', 450, 1500),
  chop: T('Chopping board', 'Maple Board', 'It slices even faster!', 'Magic Board', 'Slices and dices in a blink.', 300, 1000),
  pot: T('Pot', 'Bubble Pot', 'Simmers 30% faster.', 'Starlight Pot', 'Simmers 55% faster and never scorches quickly.', 400, 1400),
  mixer: T('Mixer', 'Swirl Mixer', 'Whips batter 30% faster.', 'Turbo Mixer', 'Whips batter 55% faster.', 400, 1400),
  board: T('Plating board', 'Petal Board', 'Plates dishes 30% faster.', 'Crown Board', 'Plates dishes 55% faster.', 500, 1600),
  coffee: T('Coffee maker', 'Latte Maker', 'Brews 30% faster.', 'Barista Bot', 'Brews 55% faster and pours one extra cup.', 400, 1400),
  kettle: T('Kettle', 'Bloom Kettle', 'Steeps tea 30% faster.', 'Moon Kettle', 'Steeps 55% faster and pours one extra cup.', 450, 1500),
  ricecooker: T('Rice cooker', 'Puff Cooker', 'Cooks rice 30% faster.', 'Cloud Cooker', '55% faster and makes one extra bowl.', 500, 1600),
  steamer: T('Steamer', 'Bamboo Steamer', 'Steams 30% faster.', 'Mist Steamer', 'Steams 55% faster and holds food longer.', 500, 1600),
};
export const HELPERS = [
  { id: 'jar', n: 'Sweet Jar', icon: 'lollipop', d: 'A jar of free lollipops. Give one to any guest to fill up their hearts.',
    tiers: [{ d: '2 lollipops per shift', cost: 600 }, { d: '3 lollipops per shift', cost: 1500 }, { d: '4 lollipops per shift', cost: 3000 }] },
  { id: 'plate', n: 'Holding Plates', icon: 'fork-and-knife-with-plate', d: 'Park finished food so it never burns.',
    tiers: [{ d: 'One more holding plate', cost: 400 }, { d: 'And one more', cost: 1100 }] },
  { id: 'cushion', n: 'Cozy Seats', icon: 'chair', d: 'Comfy guests wait longer before getting grumpy.',
    tiers: [{ d: 'Guests wait 10% longer', cost: 350 }, { d: 'Guests wait 20% longer', cost: 900 }, { d: 'Guests wait 30% longer', cost: 1800 }] },
];
export const GEAR = [
  { id: 'paws', n: 'Speedy Paws', icon: 'paw-prints', d: 'Mochi hops around the kitchen faster.',
    tiers: [{ d: '15% faster', cost: 300 }, { d: '30% faster', cost: 800 }, { d: '45% faster', cost: 1800 }] },
  { id: 'tray', n: 'Bigger Tray', icon: 'teapot', d: 'Mochi can carry more at once.',
    tiers: [{ d: 'Carry 3 things', cost: 500 }, { d: 'Carry 4 things', cost: 1500 }] },
];
export const JAR_CUPS = [0, 2, 3, 4];
// Old upgrades that were replaced by per-appliance models; their coins get refunded.
export const RETIRED_UPGRADES = { stove: [150, 450, 1000], burn: [100, 300, 700] };

export const ANIMALS = ['cat', 'fox', 'bear', 'frog', 'panda', 'owl', 'duck', 'mouse', 'pup', 'raccoon'];
