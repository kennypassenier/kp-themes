# research/character-tiles

**Decided (2026-10-06 21:11).** Kenny approved all 22 themes in full, one pick per aspect; the picks, as the attribute keys the demo sets, are in [decided.json](decided.json) (shape / loading / arrival / tone / hover / live). They move into the registers exactly as the demo draws them at the port, after every component's verdict (research/PACKAGE_FINDINGS.md lists what the package must learn first).

Dashboard tiles of their own, per theme (Kenny, 2026-10-05): six aspects —
shape, while loading, how the tiles arrive, the tone of a tile, hover and
focus, and a live update — each picked on its own from three theme-native
options. The markup is the package's own (`.kp-tiles` of `.kp-card`,
evened by `attachTileSets()`); every option is CSS only, in each theme's
`kp.signature` layer, keyed by one attribute per aspect on the grid
(`data-ti-shape`, `data-ti-loading`, `data-ti-arrival`, `data-ti-tone`,
`data-ti-hover`, `data-ti-live`), so any combination composes.

## Files

| File          | Holds                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `demo.html`   | the page, the state controls, the review round                                                                                                                                                       |
| `demo.js`     | `ASPECTS`, the `IDEAS` text table (name + what it does per theme), the page's wiring                                                                                                                 |
| `demo.css`    | the page's own layout (not the tiles)                                                                                                                                                                |
| `tiles.css`   | the shared scaffolding and the generic fallback rules, plus formal and titanium's shape/while-loading                                                                                                |
| `tiles-a.css` | light, dark, cyberpunk, synthwave, pastel — all six aspects                                                                                                                                          |
| `tiles-b.css` | blueprint, forest, high-contrast, sepia, terminal — all six aspects                                                                                                                                  |
| `tiles-c.css` | brutalism, deco, phantom, shade-light, solstice — shape/loading/hover/live                                                                                                                           |
| `tiles-d.css` | grotesk, lapis, nostromo, retro, shade-dark — all six aspects                                                                                                                                        |
| `tiles-e.css` | the finisher group: theme-native **arrival** and **tone** for formal, titanium, solstice, brutalism, deco, phantom and shade-light — the seven themes tiles.css/tiles-c.css left on the generic rule |

## This round's finish (2026-10-05)

1. **tiles-e.css** — arrival and tone, theme-native, for the seven themes
   that still used the generic rule from `tiles.css`: formal (engraved /
   ledger entry; engraved plate / ribbon / red-ink entry), titanium
   (milled / seated; status plate / machined tab / anodised tag),
   solstice (dawn / kindled; glowing chip / status plate / red sky),
   brutalism (slammed / shoved in; hard-shadow block / sticker / warning
   poster), deco (curtain rises / marquee lights; gold-framed plaque /
   marquee plaque / gilt notice), phantom (card is thrown / slashed in;
   stamped ring / status plate / askew card), shade-light (drawn in
   pencil / out of the shade; paper chip / status plate / pinned note).
   Linked in `demo.html` after `tiles-d.css`.

2. **A real bug found and fixed in `tiles-a.css`**: all fifteen "how the
   tiles arrive" rules for light, dark, cyberpunk, synthwave and pastel
   used `[data-theme='…'] [data-ti-arrival='N'] [data-ti] > .kp-card`
   — a stray space turned the aspect attribute and `[data-ti]` into a
   descendant selector. Since both attributes sit on the same `<ul>`
   (never on two different elements), that selector could never match
   anything: arrival never played in those five themes. Fixed to a
   compound selector (`[data-ti-arrival='N'] > .kp-card`), the same
   pattern tiles.css, tiles-b/c/d.css and tiles-e.css already use. No
   other file had the bug.

3. `ideas-b.json` held `{}` (empty) — nothing to merge into `demo.js`'s
   `IDEAS` table. Deleted.

4. Formal and titanium's shape/while-loading/hover/live in `tiles.css`:
   verified structurally — the three shape options differ per theme
   (engraved plate / ledger card / certificate for formal; milled plate
   / instrument dial / anodised badge for titanium). The earlier
   compound-selector bug that kept formal/titanium's shape from applying
   was already fixed before this round; confirmed still correct.

5. **This round (second finisher, 2026-10-05): theme-native
   while-loading (options 2–3), hover and live for formal and
   titanium**, in `tiles-e.css`, matching their own `IDEAS` text —
   while-loading option 1 ("the dotted leader" / "the cutter runs the
   edge") stays in `tiles.css`, unchanged:
    - **formal** — loading 2 "the ledger is ruled" (a clip-path draw of
      two hairline rules, left to right, in `steps()`), loading 3 "the
      seal is pressed" (a ring scaling in and out); hover 1 "the raised
      seal" (soft lift + navy underline + navy border on focus), hover 2
      "the ink deepens" (a double-rule box-shadow ring, a navy plate on
      Open), hover 3 "the wax warms" (the mark glows, Open's underline
      thickens, a fine double rule on focus); live 2 "entered again" (the
      timestamp strikes through once, then resets), live 3 "signed
      again" (a hairline rule traces the tile left to right).
    - **titanium** — loading 2 "the instrument dial" (a knurl pattern
      rolling), loading 3 "the lathe" (knurled ridges running the length
      of the body); hover 1 "the surface catches light" (a diagonal sheen
        - an anodised box-shadow ring), hover 2 "the dial clicks" (a top
          band tightens, Open gets a machined tab), hover 3 "the badge tilts"
          (a wider diagonal sheen, a primary-coloured halo on focus); live 2
          "a click of the dial" (a two-step horizontal jolt), live 3 "a
          glint" (a diagonal sheen sweeps across once).
    - Live option 1 ("Redrawn") is the shared `tl-live-redraw` rule for
      every theme including formal and titanium — its `IDEAS` text is
      identical everywhere, so it was never meant to be theme-native.
    - One fade-worded option text fixed: dark's live option 3 ("The trace
      flares") read "slowing as it **fades**", which the fade-text rule
      forbids even though the CSS itself animates `box-shadow`, not
      opacity; reworded to "slowing as it **settles** back".
    - `demo.css`'s `.tl-grid` tile floor raised from `10.5rem` to
      `13.5rem`: at the old floor several bold or monospace themes (dark,
      synthwave, terminal, blueprint, brutalism, nostromo…) wrapped
      "Pump house 1" / "Reservoir North" to two lines inside the title;
      the grid's own `auto-fill` now stacks the two tiles instead of
      cramming them, which the measurement confirmed clears every wrap.
    - Three real contrast bugs found and fixed (`[data-tl-link]`, the
      "Open" link, left unstyled against an inverted or recoloured
      plate): high-contrast shape 2 ("the inverse plate", link and frame
      both read the page's own colour, 1:1 and 1:1 — frame now reads
      `--border-strong`, link reads the plate's paper colour); retro
      shape 2 ("the performance monitor", link 1.14:1 against the
      near-black well — now the same phosphor green as the title/body);
      nostromo shape 1 and 3 ("the CRT trace" / "the MU-TH-UR screen",
      link ~1.13:1, shape 1's frame also read the page's own background,
      1.12:1 — both now the phosphor green, the frame now
      `--border-strong`). The nostromo fix also cleared the matching tone
      1–3 failures, since the tone cells render on shape option 1 by
      default.

## Measurement (Firefox, Playwright, local `http.server`, 22 themes × 2 motion settings, redone 2026-10-05)

The previous finisher's sweep was unreliable (`document.getAnimations()`
over the whole page instead of the busy tile, counting CSS transitions
alongside real keyframe animations, and a pixel sampler that returned a
constant, impossible 1.00:1 everywhere). This round's script instead:

- scopes every animation check to the component under test with
  `element.getAnimations({ subtree: true })`, counting only
  `CSSAnimation` objects (`a.constructor.name === 'CSSAnimation'` /
  `a.animationName`), never transitions;
- resolves contrast by walking ancestors' computed `background-color`
  and, where a `background-image` gradient is present, taking the worst
  stop colour — and, found live during this round, excluding any
  gradient layer whose `background-clip` is `border-box` (it only paints
  the border ring, never under the text) and any decorative pseudo
  accent that doesn't hug the box on all four sides (a ribbon or sticker
  tag positioned by `%`, not a full-bleed layer) — the same filters the
  proven chart/calendar samplers use;
- replays each motion aspect for real: Loading for while-loading,
  Loading → Shown for arrival (its selector only re-triggers on a
  `[data-kp-busy]` → not-busy transition), the Live update button for
  live, each caught with an `animationstart` listener so the result
  isn't a race against the animation's own duration.

**Full motion, all 22 themes × every aspect:** 0 console errors; every
aspect's three options differ (style fingerprint for shape/tone/hover,
including `.kp-card__body`'s own colour/background/text-decoration,
which several themes — terminal, forest — mark instead of the border or
the mark); every while-loading option plays ≥ 1 scoped `CSSAnimation`;
arrival and live options 2–3 all produced a real `animationstart`.

**Reduced motion, all 22 themes:** 0 console errors, 0 scoped
`CSSAnimation`s anywhere (while-loading, arrival, live) — every theme's
still frame holds, confirmed with the corrected scoping, not asserted.

**Label wrap/cut:** 0 after the `--kp-tile-min` fix above (18 themes
showed a false "wrap" first, from `.tl-label__no { display: block }`
forcing its own line by design — fixed by checking `.tl-label__no` and
`[data-ti-name]` on their own instead of their shared parent).

**Text and separating-edge contrast (4.5:1 text, 3:1 edges):** the three
link/frame bugs above, fixed. Six themes still read a separating edge
under 3:1 on the plain `.kp-card` border against the page around it —
light (2.22–2.62), cyberpunk (2.77), synthwave (2.83), pastel (2.62),
titanium (2.58) and nostromo shape 3 (1.32). These are the theme's own
base `--border` / `--border-strong` token (or, for nostromo shape 3, a
recoloured `--success`), identical across every shape and tone option in
that theme, not a per-option rule this round touched — titanium's is
already a documented, open finding in `css/titanium-register.css` itself
("`--border-strong` reads 2.98:1 on the page and 2.58:1 on the card
here (DI1, open)"), confirmed by this measurement to the decimal. Package
finding, not fixed here — see Open points.

**Tile height across states (ready/loading/empty/error):** fixed in the
demo, 2026-10-05 — `demo.css` now floors every tile at a single
`min-block-size: 11rem`, tall enough for the longest state line
("Could not read: the readings store did not answer") in every theme's
own type size, so switching state no longer reflows the tile underneath
it (confirmed in formal: 212 px in all four states). The underlying
package behaviour is unchanged and stays a finding: `js/tiles.js`'s
`evenTileSet()` floors a grid to its tallest tile _at that redraw_, not
to a height fixed across every possible future state — the demo's own
floor works around it rather than fixing it.

Both package gates are green: `node gates/check-catalogue.mjs` and
`node gates/check-demo-variants.mjs` (run 2026-10-05, after this round's
changes).

## Per-theme names

| Theme         | Shape                                                          | While loading                                                 | Arrival                                          | Tone                                                           | Hover                                                         | Live                                            |
| ------------- | -------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------- |
| formal        | The engraved plate / The ledger card / The certificate         | The dotted leader / The ledger is ruled / The seal is pressed | At once / Engraved / Entered in the ledger       | The engraved plate / The ribbon / The red-ink entry            | The raised seal / The ink deepens / The wax warms             | Redrawn / Entered again / Signed again          |
| light         | The soft card / Daylight / The paper sheet                     | The dashed baseline / Daylight / A cloud passes               | At once / Unfolds / Sunrise                      | The soft pill / The coloured tab / The outline                 | The shadow lifts / The warmth rises / The corner lifts        | Redrawn / A soft swell / The page turns         |
| dark          | The status board / The machined panel / The oscilloscope       | The ticker baseline / The slot is scanned / The status lamp   | At once / Switched on / Machined in              | The lit chip / The machined tab / The alarm lamp               | The panel lights / The glow rises / The slot opens            | Redrawn / The trace jumps / The trace flares    |
| cyberpunk     | The neon trace / The glitch HUD / The holo card                | The neon trace / The glitch bar / Packet rain                 | At once / Jacked in / The neon strikes           | The cut-corner chip / The hazard frame / The glitch mark       | The circuit lights / The HUD locks on / The hologram flickers | Redrawn / Packet in / The trace burns           |
| synthwave     | The grid-floor horizon / The VCR display / The arcade marquee  | The grid-floor horizon / The VCR display / The sun rises      | At once / Over the horizon / Tape loads          | The glass chip / The inverse block / The arcade warning        | The laser brightens / The tracking locks / The marquee glows  | Redrawn / The tracking jumps / The laser flares |
| pastel        | The sticker chart / The washi planner / The cloud card         | The sticker chart / The washi planner / Sprinkles             | At once / Popped / Doodled in                    | The sticker / The washi label / The heart sticker              | The sticker lifts / The tape flutters / The cloud bounces     | Redrawn / A happy hop / Squished                |
| terminal      | The top(1) row / The dumb-terminal card / The curses window    | The top(1) row / The dumb-terminal plot / The hash bar        | At once / Printed / Paged in                     | Reverse video / Underlined / The bell                          | The cursor lands / The row highlights / The prompt blinks     | Redrawn / Scrolled / Reverse flash              |
| forest        | The ranger's logbook / The canopy / The herbarium sheet        | The ranger's logbook / The canopy / Fireflies                 | At once / Grows / The trail is walked            | The wooden tag / The leaf tag / The trail blaze                | The leaves rustle / The tag swings / The light breaks through | Redrawn / A branch sways / Growth ring          |
| high-contrast | Ink and frame / The inverse plate / The signal board           | The dashed baseline / The striped block / The scanning bar    | At once / Switched / Dropped                     | The framed plate / The heavy frame / The signal plate          | The frame thickens / The plate flips / The signal flashes     | Redrawn / The bar jumps / The bar flips         |
| sepia         | The barograph / Letterpress / The ticket stub                  | The barograph / The ink spreads / The drum turns              | At once / The nib writes / Pressed               | The status plate / Letterpress border / The rubber stamp       | The ink deepens / The seal warms / The press lands            | Redrawn / The nib moves on / Inked again        |
| blueprint     | The chart recorder / The title block / The section view        | The chart recorder / The title block / The dimension line     | At once / Drafted / Plotted                      | The status plate / The ruled box / The revision cloud          | The pen hovers / The cell highlights / The hatching tightens  | Redrawn / The pen steps / Retraced in ink       |
| solstice      | The low sun / The embers / The horizon                         | The low sun / The embers / The sun crosses                    | At once / Dawn / Kindled                         | The glowing chip / The status plate / The red sky              | The glow widens / The embers brighten / The horizon lifts     | Redrawn / A flare of sun / The day moves on     |
| brutalism     | The slab / The sticker sheet / The poster block                | The stamp / The drop / The hammer                             | At once / Slammed / Shoved in                    | The hard-shadow block / The sticker / The warning poster       | The shadow grows / The sticker peels / The slab tips          | Redrawn / Kicked / Shoved                       |
| deco          | The gilt frame / The marquee / The skyscraper                  | The gilt frame / The marquee / The sunburst opens             | At once / The curtain rises / The marquee lights | The gold-framed plaque / The marquee plaque / The gilt notice  | The gold warms / The bulbs light / The sunburst widens        | Redrawn / The bulbs chase / Gilded              |
| phantom       | The evidence card / The calling card / The ransom note         | The stamp ring / Stamped askew / The string is pulled         | At once / The card is thrown / Slashed in        | The stamped ring / The status plate / The askew card           | The pin tightens / The halftone sharpens / The string tautens | Redrawn / Snatched / The string twangs          |
| shade-light   | Pencil in the shade / The leaf shade / The window light        | Pencil in the shade / The leaf shade / Leaves sway            | At once / Drawn in pencil / Out of the shade     | The paper chip / The status plate / The pinned note            | The pencil presses / The shade shifts / The light widens      | Redrawn / A breeze / Pencilled again            |
| shade-dark    | Silverpoint / The reading lamp / The night window              | Silverpoint / The lamp / The candle                           | At once / Silverpoint / The lamp is lit          | The status plate / The soft chip / The red lamp                | The silver glints / The lamp brightens / The window clears    | Redrawn / A glint / The page moves              |
| retro         | The 1995 dialog / The performance monitor / The Notepad window | The progress blocks / The marquee bar / The defragmenter      | At once / Painted / Dragged in                   | The raised button / The flat field / The message box           | The bevel presses / The screen glows / The window raises      | Redrawn / Repainted / Scrolled one              |
| grotesk       | The transit board / The Swiss poster / The index card          | The transit board / The Swiss poster / The flap board         | At once / Set in type / The board flips          | The flat colour bar / The underlined figure / The index colour | The bar widens / The type sharpens / The flap turns           | Redrawn / Flipped / Shifted                     |
| lapis         | The girih tile / Lapis on vellum / The manuscript margin       | The girih tile / The gold leaf is laid / The star turns       | At once / Illuminated / Inked                    | The status plate / The gold-ruled plate / The rubric           | The lattice glints / The vellum warms / The margin brightens  | Redrawn / Gilded / Inked again                  |
| nostromo      | The CRT trace / The indicator panel / The MU-TH-UR screen      | The CRT trace / The indicator panel / The motion tracker      | At once / Warmed up / Printed out                | The status plate / The lit lamp / The klaxon                   | The tube warms / The lamp blinks / The console wakes          | Redrawn / A blip / The trace rolls              |
| titanium      | The milled plate / The instrument dial / The anodised badge    | The milled plate / The instrument dial / The lathe            | At once / Milled / Seated                        | The status plate / The machined tab / The anodised tag         | The surface catches light / The dial clicks / The badge tilts | Redrawn / A click of the dial / A glint         |

## Open points

- **Package finding, not fixed here:** six themes' plain `.kp-card`
  border reads under 3:1 against the surrounding page on every shape and
  tone option — light (2.22–2.62), cyberpunk (2.77), synthwave (2.83),
  pastel (2.62), titanium (2.58, already an open finding in
  `css/titanium-register.css` itself) and nostromo shape 3 specifically
  (1.32). It is the theme's own base `--border` / `--border-strong`
  token (or nostromo shape 3's recoloured `--success`), not a
  `research/character-tiles` rule, and the same token is almost
  certainly under 3:1 wherever else that theme uses a plain card border
  — a package-wide DI1 check across all registers, not a per-demo patch.
- **Fixed in the demo, 2026-10-05:** tile height used to drift 10–25 px
  across ready/loading/empty/error because the four states' words are
  genuinely different lengths and `evenTileSet()` floors a grid to its
  tallest tile at the moment of redraw, not to a height fixed across
  every state the content could ever take. `demo.css` now floors every
  `[data-ti] .kp-card` at `min-block-size: 11rem` (the longest state
  line's own height, every theme's own type), so the tile itself no
  longer reflows between states. The package's own `evenTileSet()`
  behaviour (floors only at redraw time) is unchanged and stays a
  package finding — this is a demo-side workaround, not a fix to it.
