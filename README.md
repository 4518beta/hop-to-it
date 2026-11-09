# 🐰 Hop to It!

**Mochi's kitchen rush.** A free, open-source, kawaii cooking game for the browser. Help Mochi the
round little bunny chef cook her way through three cities: **New Yolk City** (breakfast diner),
**Pie-ris** (bakery) and **Tokyummy** (noodle bar). Grab ingredients, cook them on the right station, pull food off before it
burns, and serve hungry animal guests before they run out of patience.

**No lives. No energy timers. No ads. No purchases.** Every upgrade is bought with coins you
earn by playing.

In the Kitchen Shop each appliance has two better models that cook faster (the top model also
burns slower, and brewers pour an extra cup). Helpers like the Sweet Jar (free lollipops that fill
a guest's hearts) and Mochi's gear round it out.

## How to play

- **Tap** a basket, station, plate, trash can or guest. Mochi hops over and does it.
  She remembers up to 8 taps in a row (the pink numbers show her to-do list).
- **Ingredients go into stations.** When a station has everything a recipe needs, it starts cooking.
- **Grab finished food** by tapping the station again. Watch the ring: orange/red means it's about to burn.
- **Multi-step dishes**: e.g. Burger = patty on the Skillet, then cooked patty + lettuce + bread on Plating.
  Open the 📖 recipe book any time.
- **Holding plates** (left side) park finished food. **Trash** tosses burnt food; tap items in
  "Mochi's paws" to mark them for the trash.
- **Hearts** above each guest are their patience. Faster service = bigger tips.
- **Streaks**: serve guests back to back without anyone leaving for bonus coins.
- **Heart Rush**: fill the 💗 meter to get 15 seconds of 1.5x coins and calmer guests.

Level types: 🐾 serve a set number of guests, ⏱ timed shift, 💔 don't let too many guests leave.

## Put it on GitHub Pages

1. Create a new repository on GitHub (e.g. `hop-to-it`).
2. Upload everything in this folder (keep the `css/` and `js/` folders) to the repo's main branch.
3. In the repo go to **Settings → Pages**, set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute your game is live at `https://<your-username>.github.io/hop-to-it/`.

No build step needed. It's plain HTML, CSS and JavaScript modules.
To test locally, run `python3 -m http.server` in this folder and open http://localhost:8000
(opening `index.html` directly from disk won't load JavaScript modules).

## Project layout

```
index.html        page shell
css/style.css     all styling and animation
js/data.js        ingredients, recipes, stations, levels, upgrades (edit here to add content)
js/art.js         SVG art: Mochi, guests, appliances
js/icons.js       food and UI icons (Fluent Emoji, MIT)
js/game.js        gameplay engine
js/ui.js          menus: title, map, recipe book, results, shop, settings
js/audio.js       synthesized sound effects
js/save.js        progress saved in the browser (localStorage)
```

### Adding a level
Add a line to `RAW_LEVELS` in `js/data.js`:
```js
L(world, 'seat' | 'timer' | 'lose', limit, seats, ['newest_dish', 'other_dish'], [minArrive, maxArrive], secondsPerHeart, { multi: 0.2, extra: { oven: 1 } })
```
Star goals are worked out automatically.

## License
MIT. See `LICENSE` and `CREDITS.md`.
