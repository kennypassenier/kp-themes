# Loading exactly what a page needs, per theme

Measured 2026-09-13 on this checkout (6.0.0) with `node research/loading/run.mjs`; raw is `Buffer.byteLength`, gz is
node's zlib at its default level, min is esbuild — the same minifier `dist/` is built with. The browser numbers are
Firefox's own resource log, read by `verify.spec.mjs` on the demo page and its twin.

**Today.** `examples/index.html` links 27 stylesheets, 1,320,113 bytes raw (267.4 kB gz; the minified twins would be
674.4 kB / 116.3 kB gz), of which one theme's register is visible and twenty-one are not. `js/auto.js` imports
twenty modules unconditionally: 25 files, 400,261 bytes raw (119.5 kB gz; minified one by one 118.8 kB / 45.0 kB gz),
whatever the page contains. The bundle route is 1,293,319 bytes raw for `dist/kp-themes.css` (654.4 kB / 89.3 kB gz
minified) and 128,134 bytes for `dist/kp-themes.min.js` (40.0 kB gz).

## The three strategies, measured

| Strategy                                                             | First load CSS, raw / gz (min)                    | First load JS, raw / gz (min)                               | After one theme switch                                                  | What breaks                                                                                                                                                                                                                                                                               | Build cost                                                                                                                                                                                                                |
| -------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| today, loose files (`examples/index.html`)                           | 1,320,113 / 267.4 kB (674.4 / 116.3 kB)           | 400,261 / 119.5 kB (118.8 / 45.0 kB)                        | 0 bytes                                                                 | nothing                                                                                                                                                                                                                                                                                   | none                                                                                                                                                                                                                      |
| **(a) one stylesheet per theme** — `kp-cyberpunk.css`                | 236,847 / 54.0 kB (105.5 / 19.2 kB)               | as today                                                    | another whole sheet: `kp-formal.css` 208,452 / 49.5 kB (86.3 / 15.7 kB) | runtime switching (the other theme is not in the document); the picker's swatches (every `.kp-swatch[data-theme]` wears the one theme loaded); the no-flash snippet (a stored theme the sheet does not carry shows tokens with no register — KT8's "a theme that is not that theme"); S20 | a generator plus 22 sheets, 22 minified twins and 22 maps (4.93 MB raw, 2.13 MB min) in `dist/`, `exports`, `SHA256SUMS`, `gates/config.json` and `docs/MINIFIED.md`; every change to `components.css` regenerates all 22 |
| **(b) shared stylesheets + the active register fetched at runtime**  | formal first: 371,900 / 69.3 kB (205.6 / 30.6 kB) | as today + `lazy-register.js` 6,767 / 2.5 kB (1.7 / 0.9 kB) | one register: cyberpunk 57,229 / 10.6 kB (32.5 / 5.9 kB)                | nothing measured broke — see the list below for the two contract changes it needs (the snippet's position, and `applyTheme()` returning the previous theme while a register is on its way)                                                                                                | two modules and a snippet; no generated files, no change to the bundle                                                                                                                                                    |
| **(c) JS split** — `examples/login.html`, loose                      | as today                                          | 7 files, 118,367 / 37.8 kB (34.1 / 12.2 kB)                 | n/a                                                                     | `attachAll()` becomes asynchronous; `data-kp-effects-done` arrives later; `js/effects.js`'s constants move to the core                                                                                                                                                                    | `split-effects.mjs` (a mechanical cut today, a refactor for real) plus 11 files in `js/`                                                                                                                                  |
| (c) JS split — `examples/login.html`, bundled with esbuild splitting | as today                                          | 5 files, 61,571 / 18.8 kB (32.9 / 11.9 kB)                  | n/a                                                                     | as above, plus 33 hashed chunk files in `dist/` that churn `SHA256SUMS` every release                                                                                                                                                                                                     | one esbuild call with `splitting: true`                                                                                                                                                                                   |

Strategy (b) under cyberpunk first (the heaviest tokens): 400,109 bytes raw / 73.7 kB gz, minified 224.5 kB /
33.9 kB gz. A register weighs 31,462 (`light`) to 65,573 (`retro`) bytes raw, 13.0 to 33.5 kB minified, 2.5 to 5.7 kB
minified and gzipped — that is what one switch costs, once per theme per visitor, and nothing on a switch back.

The demo page (`demo.html`) and its twin on today's route (`out/demo-today.html`) carry identical markup — a hero
with a headline and two marks, a nav, a card, the picker with all twenty-two themes, a marquee, a rule reveal.
Firefox's resource log for both, from `verify.spec.mjs`:

| Page                          | CSS files | CSS bytes | JS files | JS bytes | after a switch to cyberpunk          |
| ----------------------------- | --------: | --------: | -------: | -------: | ------------------------------------ |
| `demo.html` (b + c)           |         6 |   371,900 |       13 |  170,464 | 7 files, 429,129 bytes; JS unchanged |
| `out/demo-today.html` (today) |        27 | 1,320,113 |       25 |  400,261 | unchanged                            |

The paint is the same on both pages — eight elements, nine properties each, under formal and after the switch —
and the demo fetched `theme-picker.js`, `components.js`, `effects-core.js` and four of the nine effects hooks
(headline, emphasis, rule, marquee), because those are what its markup carries. Neither `datatable.js` nor the
arrival, caret, count, measure and pointer hooks were fetched.

## What breaks, checked

**Runtime theme switching.** (a) cannot switch without fetching the other theme's whole sheet, ~164 kB of which
(components, layout, utilities, the shared rules) is byte-identical to what the page already has. (b) switches by
fetching one register; the demo's click on Cyberpunk fetched `cyberpunk-register.css` once (57,229 bytes), a second
click fetched nothing, and a switch to retro while its register was on its way left `data-theme` on cyberpunk until
the file had loaded, then flipped it (`lazy-register.js` cancels `kp-theme-before-change`, loads, and applies again).
(c) does not touch the stylesheets.

**The theme picker.** (b): works unchanged; its marks follow `kp-theme-change`, which fires after the hold. (a): the
swatches are the one visible casualty — a swatch previews a theme by wearing that theme's token block, and there
is only one block in the document. (c): `theme-picker.js` is fetched when `[data-kp-theme-picker]` is on the page.

**The no-flash script.** (b) needs it to do one more thing: write the FIRST register link, or the page paints its
tokens with no register and gets the register a frame later. A `<link>` appended by script is not render-blocking;
one written by `document.write` during parsing is, in every browser — so `src/no-flash-lazy.js` writes it that way,
validates the stored name against the generated theme list first, and the link element also carries
`blocking="render"` for the browsers that honour it on script-inserted links. The snippet must sit BELOW the
`themes.css` link, see the next point. (a) has no answer for a stored theme the sheet does not carry: the tokens
stay (the per-theme block is on `:root` too) but the register, scoped to `[data-theme='name']`, goes dark.

**The cascade layer order.** Holds, with one condition. The order is fixed by whichever stylesheet declares the
layers first — the first statement of `css/themes.css` — and a register wrapped in `@layer kp.register { ... }` that
arrives later lands in the layer that statement gave it. Verified on the demo: after the lazily inserted register,
a `.kp-m-0` utility on a `.kp-button` computes `margin-top: 0px` (the utility wins), and the Firefox paint
comparison matched the twin on every sampled property. The condition: a register written ABOVE `themes.css` would
declare `kp.register` before `kp.base` and `kp.components` exist, and the components would then beat the register.
`build-b.mjs` and `demo.html` place the snippet after the shared links for that reason.

**The dist bundle and `consumer.tar`.** (b) adds two modules to the manifest and changes nothing in the bundle;
`dist/kp-themes.css` stays the route for whoever does not count bytes. (a) adds 66 files and ~7 MB to the tarball
(4.6 MB today), each needing an export, a manifest row and a `gates/config.json` role — `gates.test.mjs` (TH130)
refuses a `css/` file in the manifest without one. (c) loose adds 11 files; (c) bundled produces hashed chunk names
(`components-KTQQ5IKJ.js`), so a split `dist/kp-themes.js` would rewrite `SHA256SUMS` on every release, and the
consumer who imports named functions from the bundle (chassis-rs, CF2) needs the whole file anyway — the split is
for the auto-attach entry, not for the bundle.

**The browser tests' fixture pages.** None change under any strategy as long as the new files are additive: the
fixtures link `css/themes.css` and `css/components.css` by name, the register specs open
`examples/concept.html?theme=<name>` with every register linked. What would go red if a fixture opted in: (b) a
test asserting `applyTheme(x) === x` synchronously while x's register is not yet loaded (it returns the previous
theme during the hold); (c) every spec that calls `attachAll()` or loads `js/auto.js` and reads state in the same
tick — `attach-api.spec.mjs` first — because a module now arrives after `attachAll()` returns (`detach.ready`
resolves when it has). The reveals themselves are unaffected in what they show: their start states are CSS keyed
on the root attribute the snippet arms, so a late module means a later reveal, never a snap.

**Effects, per hook.** `js/effects.js` cut at its own section markers: a core of 43,793 bytes raw (13,290 min,
4.0 kB min+gz) and nine hooks — headline 23,593 (6,675 min; this is the decipher and the glitch burst, the code a
page without `data-kp-reveal="headline"` never downloads), emphasis 6,032 (1,663), rule 1,669 (547), count 5,626
(1,607), caret 3,142 (1,139), pointer 3,145 (645), measure 2,702 (1,114), marquee 2,683 (921), arrival 6,020
(2,060) — against 89,398 raw / 25,821 min for the file as it is. The split minifies to 29,661 bytes in total, 15%
more than the whole, which is the price of the `ctx` object (61 shared names) each hook destructures; a real
refactor would pass a typed context. `tsc --checkJs` reports no unresolved name in the generated modules. Four hooks
are decided by a theme knob on the root rather than by the DOM (caret, pointer, measure, arrival); the core reads
the knob before importing, as `js/effects.js` reads it before running — and, as today, once per attach.

## Build cost, and the gates

(a) is the expensive one: a generator, 66 generated files, and a per-theme file that changes whenever
`components.css` does — so every version bumps all 22 under S20. (b) costs two modules (`lazy-register.js` 6,767
bytes with its comments, the snippet 673 bytes) and their tests. (c) costs a refactor of `js/effects.js` into a core
and nine modules, an entry that asks the DOM before importing, and — for the loose route — one extra round trip
(entry → module → its imports).

`npm run gates` in this worktree: 34 stages pass, then `check:types:consumer` breaks on the worktree itself
(`gates/check-types.mjs` spawns `node_modules/.bin/tsc` by absolute path and this worktree has no `node_modules`;
`check:types`, which runs `tsc` through npm's PATH, passed). The stages after it were run by hand: `npm test` 110/110,
and `prettier --check .` warns on 87 files, all under `research/loading/out/` — the generated stylesheets, chunks and
JSON, the same shape `dist/` is ignored for in `.prettierignore`. No gate objects to the authored prototypes; nothing
in `css/`, `js/` or `dist/` was changed.

## Recommendation

**(b), with (c) as a second step.** (b) takes the first load from 1,320,113 to 371,900 bytes raw (267 → 69 kB gz)
without a generated file, keeps every switch to one register, and breaks nothing a fixture measures; it is the
README's own "per theme" route made safe (hold until loaded, keep what was fetched, write the first link before
paint). Its two contract changes — the snippet's position below `themes.css`, and `applyTheme()` answering with the
previous theme while a register is on its way — need a line in the README and a test each. (c) is worth doing for
the effects module alone (a login page never needs the decipher), but `attachAll()` turning asynchronous touches
every spec that reads state right after load, so it is its own change with its own test pass. (a) is not
recommended: it costs the picker's swatches and the stored-theme case for a first load that is 135 kB smaller than
(b)'s, and every theme change regenerates 22 files.

## Files

- `run.mjs` — builds and measures all three; writes `out/summary.json`, `out/{a,b,c}/sizes.json` and the demo's twin.
- `build-a.mjs` → `out/a/kp-<theme>.css` and `.min.css` (22 each), `out/a/login-cyberpunk.html`.
- `build-b.mjs`, `src/lazy-register.js`, `src/no-flash-lazy.js` → `out/b/login-lazy.html`, `out/b/no-flash-lazy.snippet.js`.
- `build-c.mjs`, `split-effects.mjs`, `src/auto-lazy.js` → `out/c/js/effects-core.js`, `out/c/js/effects-hooks/*.js`,
  `out/c/dist/` and `out/c/dist-min/` (the esbuild-split builds).
- `demo.html` — the recommended route, live: pick a theme and the readout lists what was fetched; served from the
  repository root (`node tests/fixtures/server.mjs`, then `/research/loading/demo.html`).
- `verify.spec.mjs` — the paint and network comparison against `out/demo-today.html`; its header says how to run it.
