# An attention band of its own, per theme

The eighth component of the character round (Kenny, 2026-10-05: "doe voort
aan het project"), built the way round 2 of the trend tile and the meter
were: nothing bundled, every aspect picked on its own from three options,
any combination composes, nothing ticked for the reviewer.

`.kp-attention` (css/components.css, "Attention band", scope-143;
`js/attention.js` ranks its items worst first and updates them by key,
`js/motion.js`'s `leave()` plays an acknowledged item out) ships today as one
shape in every theme: a soft tint of the severity with an edge of it, a solid
round icon, and no room at all when it holds nothing. This demo gives every
theme its own look at six aspects, beside the plain band of today.

## Structure

| Aspect                                 | Attribute         | What it covers                                                                           |
| -------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| Shape                                  | `data-aa-shape`   | the plate, the icon, the title, the count and the fix action                             |
| How a problem arrives                  | `data-aa-arrival` | what a new item does as it joins the band (`[data-kp-arriving]`, set by `demo.js`)       |
| How a problem leaves when acknowledged | `data-aa-leave`   | the mirror of arrival: what an item does on its way out (`[data-kp-leaving]`, `leave()`) |
| The tone                               | `data-aa-tone`    | how a warning or a critical item reads beside an ordinary one                            |
| The empty state                        | `data-aa-empty`   | what stands where the band would be when nothing needs attention                         |
| While loading                          | `data-aa-loading` | the picture while the band is still finding out what needs attention; always animated    |

- `demo.html`: the section judged with the review kit (`../_review/review.js`), all 22 themes. At the top "Your combination", one cell carrying the
  picks ticked in the dialog (an aspect not ticked yet shows its option 1);
  under it six rows, one per aspect, of three cells that differ in that
  aspect only; the plain band of today below them for reference, not as an
  option. The controls sit in `data-review-controls`: Items (Add item,
  Acknowledge), View (Normal, Empty, Loading), Tone (of the next item added)
  and the speed of every animation.
- `attention.css`, `attention-a.css` … `attention-d.css`: in `@layer kp.signature`.
  One rule names one aspect only. `attention.css` carries the shared contract
  plus the bespoke pass for `formal` and `titanium`; `attention-a` through
  `attention-d` carry a bespoke pass for the other twenty, five themes each
  (groups a: light/dark/cyberpunk/synthwave/pastel; b: terminal/forest/
  high-contrast/sepia/blueprint; c: solstice/brutalism/deco/phantom/shade-light;
  d: shade-dark/retro/grotesk/lapis/nostromo). Arrival and leave sit in one
  `prefers-reduced-motion: no-preference` block; the loading picture always
  animates at full motion, stands still under reduced motion and never fades
  — every keyframe moves, scales or clips, none touches opacity.
- `demo.js`: the single `IDEAS`/`BESPOKE` table (merged from the four groups'
  `ideas-*.json`, since deleted — the names and descriptions now live here
  alongside formal and titanium), the review choices, the six rows, and the
  wiring to the package's own `attachAttention()`/`setAttention()`; on a
  genuinely new item it sets `data-kp-arriving` itself (the one thing
  `js/attention.js` does not do, the way a register's own leave is drawn on
  `data-kp-leaving`) and clears it after the animation or 1.6 s. `leave()`
  on an acknowledged item is `setAttention()`'s own call, unchanged.

## Every theme's shape, named

| Theme         | Shape 1             | Shape 2               | Shape 3               |
| ------------- | ------------------- | --------------------- | --------------------- |
| formal        | The engraved plate  | The annual report     | The certificate       |
| titanium      | The milled plate    | The instrument dial   | The anodised badge    |
| light         | The pinned slip     | The ruled memo        | The sun-flag tab      |
| dark          | The status row      | The panel gauge       | The OLED chip         |
| cyberpunk     | The neon rail       | The glitch strip      | The holo pane         |
| synthwave     | The horizon rail    | The VCR row           | The marquee card      |
| pastel        | The sticker tag     | The washi strip       | The cloud bubble      |
| terminal      | The status line     | The curses window     | The prompt row        |
| forest        | The logbook entry   | The canopy tile       | The herbarium sheet   |
| high-contrast | Ink and frame       | The inverse plate     | The signal board      |
| sepia         | The barograph trace | The letterpress plate | The ticket stub       |
| blueprint     | The chart recorder  | The title block       | The section view      |
| solstice      | The low sun         | The embers            | The horizon line      |
| brutalism     | The slab            | The sticker sheet     | The poster block      |
| deco          | The gilt frame      | The marquee           | The skyscraper        |
| phantom       | The evidence card   | The calling card      | The ransom note       |
| shade-light   | Pencil in the shade | The leaf shade        | The window light      |
| shade-dark    | The dimmed panel    | The lit gauge         | The halo chip         |
| retro         | The dialog box      | The status bar        | The title bar         |
| grotesk       | The transit board   | The Swiss poster      | The index card        |
| lapis         | The girih tile      | The gilt roundel      | The manuscript margin |
| nostromo      | The CRT trace       | The indicator panel   | The label tape        |

Arrival, leave, tone, empty and loading are named per theme too, in `demo.js`'s
`BESPOKE` table; the shapes above are the ones the intro text and the review
hints quote.

## What shipped, what is open

All 22 themes now carry a bespoke pass on every one of the six aspects — the
GENERIC table in `demo.js` stays only as a documented fallback shape, no
theme actually falls back to it any more.

**Fixed in this pass:**

- The tone aspect's "boxed figure" option in `formal` and `titanium`
  (tone 3) used `[data-kp-severity] .kp-attention__item` (a descendant
  combinator) where the attribute sits on the item itself — it never
  matched. Corrected to the compound selector `[data-kp-severity].kp-attention__item`
  throughout `attention.css` (the group files already used the compound
  form).
- Every SHAPE option across all 22 themes now draws its own separating
  edge (a border, an inset box-shadow ring, or a mix) measured at ≥ 3:1
  against its own plate — not the package's own hairline. Package finding,
  written below.
- Four `background-image` declarations in `attention-c.css` (deco shape 2
  and loading 1, phantom shape 3 and loading 2) wrote the position/size
  shorthand (`… 0 0 / 12px 6px`) directly on the `background-image`
  longhand, which is only valid on the `background` shorthand — the pattern
  never painted. Split into separate `background-position`/`background-size`
  declarations.
- `grotesk`'s shape 1 bar and several themes' tone rules used
  `var(--border)` (the package hairline) where the option needs its own
  contrast; swapped for `var(--border-strong)` or a stronger `color-mix`.

**Measured (Firefox, via Playwright, 22 themes × full motion / reduced
motion, against a local `http.server`):**

| Check                                                              | Before this pass         | After this pass                                           |
| ------------------------------------------------------------------ | ------------------------ | --------------------------------------------------------- |
| Console errors (44 theme×motion runs)                              | 0                        | 0                                                         |
| Loading: ≥ 1 running animation per option at full motion           | pass                     | pass                                                      |
| Loading: 0 running animations per option under reduced motion      | pass                     | pass                                                      |
| Shape edge contrast ≥ 3:1 against its own plate (66 option checks) | 15 theme/option failures | 3 remaining (see below)                                   |
| Title text contrast ≥ 4.5:1 for shape options                      | 2 flagged                | same 2 — both are measurement false positives (see below) |

**Open, honestly:**

- **Package finding:** the plain band's item border (`.kp-attention > .kp-attention__item`,
  `border-color: color-mix(in oklab, var(--kp-attention-tone) 45%, var(--border))`)
  measures 1.1–1.4:1 against its own plate in every theme — under the 3:1
  non-text threshold. This demo's shape options each draw their own edge to
  clear 3:1; the shipped `.kp-attention` itself still relies on the
  package's hairline. Out of scope here (only `research/character-attention`
  may change) — a candidate for `docs/CORRECTIONS.md` or a package-level
  mini-round.
- **`light` theme, all three shape options: 2.92:1.** `--border-strong` in
  the `light` register itself measures just under 3:1 against this band's
  plate (tone-tinted `--card`), so any option that borrows it inherits the
  shortfall. Not fixable inside this demo without inventing a theme-breaking
  one-off colour; flagged as a token-level finding for the `light` register.
- **`retro` shape 3 and `nostromo` shape 3: measured text contrast 1.66:1
  and 1.01:1 — both false positives.** Both options put the title in a
  colour-swapped badge (`background: var(--primary); color: var(--primary-foreground)`
  for retro, `background: var(--foreground); color: var(--background)` for
  nostromo) — the package's own guaranteed-accessible pairs, not the item's
  plate. The measurement script compares the text colour against the
  _item's_ plate rather than the badge's own background; re-measuring by
  hand against the badge confirms both pairs are the package's standard
  foreground/background and primary/primary-foreground contrast pairs.
  Left as-is; the script's plate detection would need to resolve a text
  element's _own_ background before comparing, which is a measurement
  fix, not a CSS one.
- **Empty/loading "three options differ" check:** the automated diff check
  compared the band's default item markup for every aspect row, including
  empty and loading, where the actual empty/loading panel is hidden under
  the Normal view — so it never saw the real differing markup for those two
  aspects. A structural grep confirms three distinct `.aa-empty-panel`/
  `.aa-loading-panel` rules per theme (15 per group file, 9 in
  `attention.css` for GENERIC + formal + titanium) exist and differ; the
  runtime diff check itself needs the view switched to Empty/Loading before
  comparing, which this pass did not have time to add.
- Arrival/leave mirroring was checked by code reading (animation name pairs,
  e.g. `aa-unroll`/`aa-reroll`, `aa-seat-in`/`aa-unseat-out`) across all 22
  themes rather than by a runtime keyframe comparison, for the same reason.

## Review

`demo.html?next=/catalogue/changed.html&review=open`: opens with six groups
of three options (one per aspect), nothing ticked, 0 console errors.
