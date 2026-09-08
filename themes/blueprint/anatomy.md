# blueprint — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Blueprint is the
> sixth theme lifted in 5.0.0 (S48, LIFT_PLAN row 6). The concept demo
> Kenny approved on 2026-09-08, at its fourth version, is "Working
> Drawing".

## The idea

A technical drawing. Cyan-white lines on deep Prussian blue, with amber
where something needs attention. Topo is a map — contour lines, land,
elevation; this is the other half of that pair: the drawing of a thing
that does not exist yet.

Where cyberpunk is a dark blue theme that glows, this one is a dark blue
theme that measures.

Round four settled what "measures" means after three rejected drafts. v1
and v2 drew a full rectangular frame around the headline; Kenny's v2
verdict called the background and the frame "far too bulky" for a theme
that should think in "fine lines". v3 redrew the frame as four
corner-bracket construction marks — still a frame, in spirit — and Kenny
rejected it outright: "I just don't like the frame. Can we replace it
entirely with our measurement lines? One vertical and one horizontal."
v4 is that replacement, and it is this theme's signature.

## What is load-bearing

1. **The Prussian ground.** `hsl(215, 65%, 12%)` — a blue dark enough to
   read as ink rather than as a dark grey with a tint. Lighten it and the
   theme becomes "dark blue interface"; deepen it and it becomes black.
2. **Cyan as the drawing line.** `--primary` is `hsl(190, 80%, 62%)`,
   which is the colour a blueprint's line actually is. It carries links,
   focus, the rule reveal and the first chart series.
3. **Amber for annotation.** The one warm colour, used where a drawing
   would use a red pencil: `--accent`, the second chart series and the
   dossier's stamp. It is the only hue in the theme that is not blue or
   cyan.
4. **The two dimension lines.** A hairline under the headline and a
   hairline beside it, each printing the true rendered size of the box it
   measures — never a fixed width. The horizontal one is a plain
   measurement: `js/effects.js` reads the headline's own
   `getBoundingClientRect().width` and writes the same rounded pixel
   number to both the line's `style.width` and its label in one function,
   so the two can never drift apart. The vertical one needs no
   measurement at all: `top: 0; bottom: 0` inside a `position: relative`
   wrap sizes it to the wrap's own content height by CSS containment,
   which is a more direct version of the same guarantee. This is outside
   the six-hook vocabulary of S45 — it is this theme's own mechanism, the
   way terminal's caret column and retro's dither are theirs — gated by
   its own knob, `--kp-measure: live`.
5. **`--radius: 0.125rem`.** Nearly square, because a drawn line does not
   have rounded ends. This is the second-sharpest theme after
   high-contrast.

## The register (5.0.0)

`css/blueprint-register.css` is the theme's answer to the hook vocabulary
(S45):

- **Surface.** One continuous ruled sheet under the whole page: a minor
  rule every 32px at 3%, a major rule every 160px at 5.5% (under DI9's 6%
  ceiling on its own), and a "+" crosshair tile only at the major pitch —
  sparse marks at a pitch you can read, not a woven texture. The
  crosshair's own stroke-opacity (0.18, inside a data URI and so exempt
  from DI9's colour rule) is what this theme's measured texture ceiling
  answers for in `gates/config.json` — see the findings below.
- **Emphasis.** A `<mark>` is a cyan wash (`wash`) that clears in behind
  the words, the same idiom in two places: the lede's marks clear on
  load, one after another; the dossier's redactions are solid ink blocks
  — the sheet's own hairline colour — that narrow away to the left on the
  trigger, staggered 150ms apart.
- **Reveal.** The headline is deliberately **not** answered through the
  vocabulary (`--kp-reveal-headline` is left undeclared). The demo's
  headline is legible throughout — a plain settle, not a decipher — and
  every non-empty value the vocabulary accepts other than `tracking`,
  `shout`, `slam`, `dissolve` and `type` routes a headline through the
  module's character-glitch default, which is not what this demo shows.
  The fade instead plays as a plain CSS animation gated on
  `[data-kp-effects]` alone — the exact attribute the demo's own
  `.kp-arrive` class stood in for — so a page without the module shows
  the headline at rest and a page with it never flashes from rest to
  start. The rule under a heading draws itself left to right when it
  enters the viewport (`draw`, reusing the base layer's own `kp-rule-in`
  keyframe, eased rather than stepped — this sheet's lines are
  continuous, not pixel-drafted like retro's or terminal's).
- **Divider.** A dashed hairline, the fold line of a drawing sheet.
- **Accent.** The headline and the rule reveal both key off `h1`/`h2`
  inside a surface; no text-shadow, no glow — a drawing line does not
  glow, cyberpunk owns that.
- **Arrival.** None. A drawing does not announce itself; it is simply on
  the table.

Buttons keep one mitred corner (`--kp-chamfer: 8px`) as the one required
construction mark the concept-demo inventory holds onto; fields are wells
cut into the sheet — a hairline border on the card ground, no bevel, no
shadow; the dropdown is redrawn as a title block (KT14) — the menu sits
on the page's own ground inside one hairline border with a cyan rule
across the top, items separated by hairlines with mono `01`/`02`/`03`
leaders, hover a cyan wash rather than a filled bar. One answer per
component root (56 of 64, the eight helpers excused).

**What the demo showed and the package now renders exactly (S49,
2026-09-08).** Kenny's rule of 2026-09-08 is that an approved demo is
implemented exactly, and that a test or a gate which disagrees produces a
finding for him rather than a quiet change. What follows is that finding
list for this lift.

- **Built exactly:** the palette (every token in `themes/blueprint/tokens.json`
  matches the demo's hex values precisely — see the
  contrast table below); the ruled grid and crosshair geometry (32px/3%
  minor, 160px/5.5% major); the two dimension lines, live and measuring a
  real box, not a fixed width; the dropdown's title-block redraw; the
  chamfer on the mirrored button; the redaction mechanism (a solid ink
  block clearing left to right, staggered); `theme-font-mono` changed
  from a generic system stack to `'Geist Mono', ui-monospace, …` because
  the demo names Geist Mono explicitly for every mono use on the page —
  the demo wins (S49), and `fonts/families.json` now lists `blueprint`
  under `geistmono`'s `themes`.
- **Adapted, not skipped, with the reason:** the demo's nav dropdown
  title block carries a per-item annotation label (`"Detail · scale 4:1"`,
  `"Key · rev A"`, `"Sheet · lang"`) via `content: attr(data-kp-menu-label)`
  on a data attribute the demo's own markup
  supplies. The canonical `NavBar` component this package's generator
  renders (`showcase/examples.mjs`) does not carry a per-submenu label
  prop, and adding one is outside a single theme's lift — it would touch
  shared component code nineteen worktrees are not coordinating on at
  once. The register keeps everything else of the title block (the
  ground-coloured panel, the single hairline border, the cyan top rule,
  the numbered leaders, the wash hover) and drops only the label text.
  Likewise the dossier's stamp: the demo's raw markup is a literal
  `<span class="kp-stamp">` inside the card header; the canonical `Card`
  the generator renders carries the stamp only as a `data-kp-label`
  attribute with no child node, so the register paints it as
  `content: attr(data-kp-label)` on `::before` instead — the same
  technique retro and terminal already use for their own stamps, same
  visual result, no shared file touched. The demo's cyanotype construction
  diagram (the SVG polygon beside the spec sheet) has no slot in the
  canonical hero at all — the generator's spec aside is a fixed `<dl>`
  with no room for a second graphic — so it is not built; nothing in the
  package shows it. This is the one piece of the demo genuinely missing,
  and it is decorative rather than mechanical (unlike the dimension lines,
  which are built and real).
- **Texture over the ceiling, reported (S42).** The crosshair tile's
  `stroke-opacity` is 0.18 in the demo's own SVG, inside a data URI and so
  exempt from DI9's "no colour of your own" rule but not from
  `gates/check-texture.mjs`'s opacity ceiling, which reads the strongest
  alpha anywhere in `--fx-texture` regardless of how sparse the mark it
  belongs to actually is. `gates/config.json`'s
  `textureOpacityCeiling.perTheme.blueprint` is `0.18`, named here as the
  reason: the demo's crosshair, six marks across a 1280px viewport at
  0.18 alpha each roughly 6px of ink, measured stronger than DI9's blanket
  6% and kept rather than weakened.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are a mid
steel blue that clears the floor on all three surfaces without becoming
the drawing line itself — a boundary that is the same cyan as a link
would make every input look like a control.

**DI2 — the focus ring.** Cyan-white over Prussian blue, the package's
ordinary two-channel ring; the demo stacks nothing in front of it.

**DI3 — states you can see.** Lightness alone reaches the floor. The cyan
is bright but not near the top of the space the way neon magenta is, so
this theme does not need the chroma fallback that cyberpunk does.

**DI4 — colour is never the only carrier.** The offer and rejection
badges were 5.3 apart under deuteranopia in the first draft — both mid
plates on a dark ground, which is the shape that collapses. Solved to 23
by taking offer to a deeper green and rejection to a deeper red, both
still carrying light text. Unchanged by this lift.

**DI5 — the flash threshold.** Five one-shot animations, none looping:
the headline fade (0.3s), the horizontal dimension line drawing
(0.5s) and its label fading in (0.3s), the vertical elevation line
drawing (0.5s) and its label fading in (0.3s), staggered across a 0–1.6s
window so at most one or two are ever active at once — nowhere near the
3/s bar. The lede's marks and the dossier's redactions are plain
transitions on a class toggle, not keyframes, so they carry no row in
`reports/di5.md` — the same choice terminal's own redaction made.

**DI6 — light or dark.** `color-scheme: dark`, surfaces rising from 12%
to 19% lightness. Unchanged by this lift.

**DI7 — reduced motion.** Every animation and transition of this register
lives inside `@media (prefers-reduced-motion: no-preference)`. At rest:
the headline stands at full opacity, both dimension lines stand at their
final size with their labels visible (a live-read width and a
CSS-contained height — the measurement itself does not need JS to have
run, only `getBoundingClientRect()`, which fires even without an
animation), and every mark stands cleared.

**DI9 — theme colour stays in the token layer.** The ruled grid and
crosshair are the one texture, both driven by tokens (or, for the
crosshair's stroke, a literal hex value inside a data URI, which
`check-layers.mjs` exempts from the "no colour of your own" rule by
construction — an SVG data URI's fills are shapes, not theme colour). No
other rule in the file writes a colour that is not `var(--token)` or a
relative colour of one.

## What this theme may not do

- Draw a frame, a bracket, a box or any panel silhouette around a piece
  of content. That device was tried three times and rejected three
  times; the dimension lines are what replaced it, not a fourth attempt
  at the same idea in a new shape.
- Give a dimension line a fixed width. Both lines answer to something
  real — the headline's own rendered box — or they are not this theme's
  device, they are decoration wearing its name.
- Glow. Cyberpunk owns that; the cyan here is a line, not a light source.
- Round a corner past `--radius` (0.125rem). A drawn line does not have
  rounded ends.

## Findings summary

1. Two adaptations, both with no shared file touched: the dropdown's
   per-item annotation label and the dossier stamp move from a literal
   child node (the demo's own markup) to `content: attr(data-kp-label)` /
   a dropped label, because the canonical generator's `NavBar` and `Card`
   components do not carry the extra prop the demo's raw HTML assumes.
2. One piece not built at all: the cyanotype construction diagram beside
   the spec sheet has no slot in the canonical hero structure.
3. One texture ceiling reported, not weakened: `blueprint: 0.18` in
   `gates/config.json`, because the crosshair's own stroke-opacity is
   what the demo measured, sparse marks and all.
