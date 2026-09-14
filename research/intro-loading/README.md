# Intros and loading [scope-85]

Kenny's question (2026-09-15): can the intros make sure every resource (.css, .js) has loaded, or do those load too fast to
matter? And: are these all the intros — did cyberpunk not have one?

Measured 2026-09-15 on this checkout (base `aa1c7b6d`), Playwright 1.62.1, headless chromium and firefox, on
`examples/concept.html` with the theme stored in localStorage. Nothing in `css/`, `js/`, `components/` or `themes/` changed.

## 1. Every theme's on-load motion

Four themes have an intro (`--kp-arrival`). **Cyberpunk has no intro.** On load it plays its headline `decipher` (glyph
noise resolving at 26 characters a second after a 260 ms lead, then a 600 ms slice burst) and its `classified` marks
clearing from 1.5 s. The line "▶ Calibrating neural uplink" was cyberpunk's voice, but synthwave's boot showed it until
scope-84 (comment in `js/strings.js`). That is probably the "cyberpunk intro" Kenny remembers.

Intro: `.kp-boot` added until removed. Reveal: headline attach until `data-kp-reveal-state`. For the CSS-only rows, the
animation's end time on the headline. All from `inventory.mjs`, chromium, unthrottled. The intro and the reveal both play
once per session. The high-contrast wipe is the one exception: it runs on every load.

| Theme         | Arrival (intro) · measured                 | Headline reveal on load · measured         | Words shown                                                                                      |
| ------------- | ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| synthwave     | `boot`, percentage · 1.81 s (random steps) | `tracking` + shine · 0.74 s (+1.4 s shine) | "▶ Play", "Tracking N%", "Press start", "Skip"                                                   |
| terminal      | `boot`, lines · 1.53 s                     | `type` · 0.86 s                            | "KP-THEMES BIOS v5.0.0" … "READY." (5 lines), "Skip"; the headline is typed                      |
| retro         | `boot`, lines + block bar · 1.24 s         | `dissolve` · 0.65 s                        | "KP Modular BIOS v4.51PG", "kp-themes 95 — retro build", "Memory Test : {count}K" to 640, "Skip" |
| phantom       | `card` · 1.86 s                            | `shout` · 0.81 s                           | the theme name "phantom", "Skip"                                                                 |
| cyberpunk     | none                                       | `decipher` · 1.24 s + 0.6 s burst          | glyphs `01<>/\|=+*#%@&$?!ZXKQ` resolving to the headline                                         |
| formal        | none                                       | `arrive` · 0.52 s                          | none                                                                                             |
| light         | none                                       | `clip` · 0.64 s                            | none                                                                                             |
| dark          | none                                       | `resolve` · 0.83 s                         | none                                                                                             |
| pastel        | none                                       | `overprint` · 0.67 s                       | none                                                                                             |
| forest        | none                                       | CSS `kp-headline-in` · 0.60 s              | none                                                                                             |
| high-contrast | none                                       | CSS `kp-hc-headline-wipe` · 0.55 s         | none                                                                                             |
| sepia         | none                                       | `ink` transition · 1.05 s                  | none                                                                                             |
| blueprint     | none                                       | CSS `kp-headline-fade` · 0.90 s            | none                                                                                             |
| solstice      | none                                       | `calibrate` · 0.76 s                       | none                                                                                             |
| brutalism     | none                                       | `slam` · 0.61 s                            | none                                                                                             |
| deco          | none                                       | CSS `kp-cartouche-in` · 0.52 s             | none                                                                                             |
| shade-light   | none                                       | `blur` · 0.92 s                            | none                                                                                             |
| shade-dark    | none                                       | `focus` · 1.10 s                           | none                                                                                             |
| grotesk       | none                                       | `sharpen` · 0.66 s                         | none                                                                                             |
| lapis         | none                                       | `gild` · 0.92 s                            | none                                                                                             |
| nostromo      | none                                       | `popdown` · 0.34 s                         | none                                                                                             |
| titanium      | none                                       | `resolve` · 0.83 s                         | none                                                                                             |

A side finding: all four intro themes start their headline reveal at the same moment as the intro. The reveal is over
before the intro ends (0.65–0.86 s against 1.24–1.86 s), so nobody sees it on a first visit.

## 2. Measured: resources against the intro

Commands (foreground, own server on the port, no `pkill`):

```
KP_TEST_PORT=4511 node research/intro-loading/measure.mjs --engine=chromium </dev/null   # then --engine=firefox
KP_TEST_PORT=4511 node research/intro-loading/inventory.mjs </dev/null
node research/intro-loading/summarize.mjs                                                  # prints every table
```

**How it was measured.** `serve.mjs` serves the repository gzipped with `max-age=600`, the way GitHub Pages does. The
stock fixture server sends `no-store`, and a warm cache is impossible behind it. "Fast 3G" is set in the server: 562 ms
before the first byte of every response, and one shared 180 kB/s budget for all of them. The server throttle matches
chromium's own CDP throttle to within 0.15 s (eager route: paint 4.02/4.14 s, scripts 7.71/7.84 s). There are two routes.
"Eager" is `examples/concept.html` as it is, with all 22 registers linked. "Lazy" is scope-50's route: the no-flash snippet
writes one register, render-blocking. A cold load is a fresh browser context. A warm load is a new tab in the same context:
same HTTP cache, server hits 0, new sessionStorage, so the intro plays again. Each cell is a single run. Unthrottled runs
vary by about ±50 ms.

**Lazy route, synthwave.** Seconds from navigation start. "Shown early" is how long the page was visible before the intro
covered it. "Fallback" is how long a fallback font was on screen.

| Load             | Engine   | First paint = stylesheets + register | Scripts ran (attach) | `fonts.ready` | Intro     | Shown early | Fallback |
| ---------------- | -------- | -----------------------------------: | -------------------: | ------------: | --------- | ----------: | -------: |
| Fast 3G, cold    | chromium |                          2.47 / 2.43 |                 5.46 |          5.47 | 5.46–7.13 |        2.99 |     1.26 |
| Fast 3G, cold    | firefox  |                          3.94 / 3.93 |                 4.51 |          5.25 | 4.51–6.43 |        0.57 |     1.31 |
| Fast 3G, warm    | chromium |                          0.05 / 0.01 |                 0.09 |          0.10 | 0.09–1.89 |        0.04 |     0.01 |
| Fast 3G, warm    | firefox  |                          0.04 / 0.03 |                 0.07 |          0.13 | 0.07–1.88 |        0.04 |     0.04 |
| unthrottled cold | chromium |                          0.07 / 0.02 |                 0.12 |          0.14 | 0.12–1.80 |        0.05 |     0.02 |
| unthrottled cold | firefox  |                          0.06 / 0.05 |                 0.08 |          0.11 | 0.08–1.77 |        0.04 |     0.04 |

**Eager route (today's examples), Fast 3G cold.** Chromium: paint 4.02, scripts 7.71, intro 7.71–9.40, shown early 3.69,
fallback 1.40. Firefox: paint 3.88, scripts 7.73, intro 7.73–9.41, shown early 3.87. The other three intro themes behave
the same way. Across both routes and both engines the page is shown early for 0.57–4.12 s, and the fallback font is
visible for 0.58–1.95 s. Cyberpunk, cold on Fast 3G, is readable at first paint (2.47 s in chromium, lazy) and has its
own font at 3.96 s. Its decipher starts only at 5.36 s, over a headline the reader has already read. A second load in the
same tab makes one server request (the page itself), paints at 0.60 s and skips the intro (`rest`).

**What this answers.**

- **No unthemed flash, in any run** (0 ms in all 192 loads). Stylesheets block rendering, the document-written register
  included. By the time `js/auto.js` runs, every stylesheet has already loaded. So an intro started by the script cannot
  hold anything back for the CSS: the CSS is always there first.
- **Warm cache, or a fast network: yes, too fast to matter.** Stylesheets, scripts and fonts are all ready within 0.32 s (the
  slowest, firefox eager unthrottled cold `fonts.ready`), long before the intro ends (1.2–1.9 s). The intro is pure
  decoration here, and it adds 1.2–1.9 s on top of a page that was ready. A second page in the same tab skips it anyway.
- **Cold on Fast 3G: very relevant, but the other way round.** The intro does not cover the loading. It starts only when
  the scripts arrive (4.5–7.7 s). Until then the finished page sits on screen, often in a fallback font, and then the intro
  drops over it. Even on a fast load (unthrottled or warm), the page was on screen for up to 61 ms, a few frames, before the intro covered it: in 46 of 50 such loads.
- **Fonts** are the only resource that can still be arriving while the intro plays: 0.74 s into the intro in firefox (lazy
  route, cold, Fast 3G).
- **Reduced motion.** Today these readers get no intro. On a cold Fast 3G load they see the page at 2.47 s (chromium) in a
  fallback font until 3.73 s.

## 3. Options, prototyped and measured

The prototypes are in `proto/`, inserted into the page by `serve.mjs` (`?option=B|C|D`). They are copies, not the package.
"Waits" is when the page is uncovered and in its own font. Lazy route, Fast 3G, cold, then warm:

| Option                                                                                                                                       | What it is for               | Reference                                                                                                                                                                                                                | What the package can reuse                                                                                                    | Waits, cold chromium / firefox · warm                             | Flashes left (cold)                                                                                                                               | Build cost | Recommendation    |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| A, today: fixed timers from attach                                                                                                           | decoration                   | —                                                                                                                                                                                                                        | —                                                                                                                             | 7.13 / 6.43 · 1.89                                                | page shown early 2.99 / 0.57 s, fallback 1.26 / 1.31 s                                                                                            | none       | —                 |
| B: the intro is in the first paint and holds for stylesheets, scripts and `fonts.ready`; minimum = today's sequence, maximum 4 s after paint | make the intro honest        | [script-blocking style sheets](https://html.spec.whatwg.org/multipage/semantics.html#contributes-a-script-blocking-style-sheet), [FontFaceSet.ready](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready) | `.kp-boot` and its register paint as they are; the overlay moves into the no-flash snippet, and `js/effects.js` takes it over | 7.71 / 6.29 · 1.80 / 1.96                                         | none before the intro; fallback font inside the intro 0.72 / 0.63 s; phantom eager hit the 4 s cap, and its page showed 0.65 s before the scripts | medium     | **yes, 4 themes** |
| C: a neutral veil for every theme until the same milestones, then the intro as today                                                         | hide loading for every theme | same                                                                                                                                                                                                                     | `--background`, `--primary`; one root pseudo-element                                                                          | synthwave 7.83 / 6.95 · 2.01 / 1.74; cyberpunk 6.19 / 5.09 · 0.10 | none                                                                                                                                              | small      | no                |
| D: no gating; `modulepreload` for the 26 modules + `preload` for the theme's fonts                                                           | load sooner                  | [modulepreload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload), [preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)                                     | a generated hint list (`proto/preload-hints.json`)                                                                            | 5.97 / 7.41 · 1.87 / 1.78                                         | chromium: shown early 1.27 s, fallback 1.63 s; firefox: none, but its first paint moved from 3.94 to 5.64 s                                       | small      | no, not alone     |

**The trade-offs.**

- **B** removes the "page, then intro" flash on every load, fast ones included, and makes the percentage true. It costs no
  wait on a warm load (1.80 against 1.89 s). Cold, it moves from −0.14 s to +0.58 s, because the sequence can no longer
  finish before the fonts. It covers only the four intro themes, and was prototyped on synthwave (a counting boot) and phantom (the card). Terminal and retro take the same lines-mode path, but were not measured with B. The maximum has to be there: without it, a stalled module
  graph would keep the intro up for good. With it, phantom's cold eager load dropped the card at 4 s, 0.65 s before the
  scripts ran. Reduced motion still gets nothing.
- **C** removes every flash for every theme, reduced motion included (a veil without its fade). But on a cold Fast 3G load
  it takes away the early readable page from all eighteen themes without an intro: cyberpunk goes from readable at 2.47 s
  to veiled until 6.19 s in chromium. That hides 1.5 s of fallback font at the price of 3.7 s of blank screen.
  Warm, it adds about 0.05 s.
- **D** means something different in each engine. In chromium the scripts ran 1.16 s sooner (5.46 → 4.30 s), but paint came
  0.56 s later and the flashes stayed. In firefox the preloads held the first paint back to about the moment the scripts
  ran: no flashes, but the blank lasted 1.7 s longer.

## Recommendation

**B, for the four intro themes, and no veil for the others.** The intro should start in the first paint and end on real
milestones, not on timers. Keep today's sequence as the minimum and add a maximum (4 s after paint in the prototype).
Concretely: `noFlashSnippet({ effects: true })` already knows the theme before paint. It would add the `.kp-boot` overlay,
or a root attribute the register paints the overlay on. `js/effects.js` would then adopt that overlay instead of creating
one, and hold its end on `document.fonts.ready`. This is a contract change to the snippet and the arrival [SW2], so it
needs Kenny's decision and a minor version. It does not answer "make sure resources are loaded" for the CSS, because the
browser already does that. What it fixes is the one flash that is real: the finished page shown before its intro, from a
few frames on a fast load up to 4 s on a cold slow one. Two follow-ups for Kenny, not measured here: start the headline reveal when the intro ends, so the
four intro themes' reveals are seen; and consider C's veil only for `fonts.ready`, which would be much cheaper than
waiting for the scripts. D is not recommended on its own, because firefox trades flashes for a longer blank.

## Files

- `serve.mjs`: the gzip, cache and throttle server, plus the page rewrites (`route=lazy`, `option=B|C|D`).
- `measure.mjs`, `summarize.mjs`, `inventory.mjs`: the measurements. Raw results are in `out/results-*.json`,
  `out/inventory.json` and `out/log-*.txt`.
- `proto/intro-proto.js`, `proto/intro-proto.css`, `proto/preload-hints.json`: the B, C and D prototypes (12,265, 1,219 and
  2,370 bytes, from `wc -c`).
- `demo.html` and `frame.html`: A, B and C side by side on simulated timings taken from the table above.
  `verify-demo.mjs` photographs it (`out/demo-*.png`).
