# shade-light — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). shade-light is
> the sixth theme lifted in 5.0.0 (S48, LIFT_PLAN row 6), the light half
> of the shade pair — shade-dark is its own, separate lift. The concept
> demo Kenny approved on 2026-09-08 is "Quiet Margin"; its own in-page
> comment carries the research sources, the hazards refused and the
> computed contrast pairs verbatim, and is not duplicated here.

## The idea

Reading a book in the shade, not in the sun. The only theme in the set
built on medium contrast: warm off-white paper and a blue-grey ink that
stops well short of black, so a long text is restful rather than sharp.
Derived from Solarized, whose sixteen values were designed for exactly
this, and shipped as a pair — `shade-light` and `shade-dark` share one
scheme with the lightness steps mirrored.

The lift adds one idea on top of the base tokens: **soft elevation,
layered surfaces, shadow doing the work colour usually does** — the
direction the round's own plan names for this theme. A floating surface
(a dropdown, a popover, a toast, a dialog) lifts off the page on a
shadow in the theme's own ink, at low opacity; a flat surface (a card,
an alert, the dossier, the spec sheet) stays exactly that, a border and
nothing else, because the demo itself is this restrained — only the
nav's dropdown and the wipe-confirmation dialog carry a shadow at all.
The register generalises that restraint to every floating surface the
package has (the popover, the toast, the tooltip, the confirm dialog,
the datepicker panel, the combobox list, the command palette, the
shortcut sheet, the theme menu) rather than leaving them plain, the same
way retro generalised its bevel from the two controls the 3.1.0 base
already carried to the whole desktop.

## What is load-bearing

1. **The ink is base01, not base00.** Solarized's own light-mode text
   colour `#657b83` measures 4.13:1 on `#fdf6e3` and fails AA; the
   darker `#586e75` — `hsl(194, 14%, 40%)` — measures 4.99:1 and is the
   text. That is the whole meaning of "medium contrast" here: as low as
   AA allows, and not lower.
2. **Accents are plates, never words.** Solarized's blue, cyan, yellow,
   magenta and red were drawn for syntax highlighting, where 3:1 is
   normal. As text they fail, so each is deepened where it carries text
   (`--primary` blue at 38% instead of 49%) and otherwise used as a
   plate with paper ink. The demo states this rule in its own words, in
   its own lede — "accents that stay plates, never words" — and the
   register holds it: `--accent` never sets `color` on real text
   anywhere in `css/shade-light-register.css`, only `background`,
   `border` or a small dot.
3. **The card is lighter than the paper.** Solarized puts base2 below
   base3; the DI6 gate, which holds a raised surface above the one below
   it in every theme, sent the card the other way. The base2 value
   survives as `--secondary` and the borders.
4. **Source Serif 4 for headings, Source Sans 3 for the body**, the pair
   Adobe drew to sit together — this is a text theme and its type should
   say so. Both are shipped (C4); the body face is renamed "KP Shade
   Sans" at build, because its OFL carries a Reserved Font Name clause
   (`fonts/families.json`) and a subset is a Modified Version that may
   not keep the original name.
5. **The shadow is one token, three depths.** `--kp-shadow-1/2/3` in
   `css/shade-light-register.css` are all `hsl(from var(--foreground) h s l / a)`
   at increasing blur and decreasing alpha — never a colour of the
   register's own, and never applied to a flat surface.

## The register (5.0.0)

`css/shade-light-register.css` is the theme's answer to the hook
vocabulary (S45), every mechanism the demo's own comment measures and
sources:

- **Surface.** The hero and the app surface keep the base tokens
  (background and muted respectively); nothing in the register
  overrides them, because the demo does not either.
- **Emphasis.** A `<mark>` in running text is a background-sweep
  ink-fill, left to right, in the accent at low opacity
  (`box-decoration-break: clone` so a mark that wraps a line fills each
  fragment on its own rather than clipping the text — the demo's own
  drilled finding). A dossier's marks are redaction bars instead: a
  solid plate in the ink, clearing on the trigger, staggered 90ms.
- **Reveal.** The headline's words resolve out of a 6px blur and a 6px
  rise, one after another, 70ms apart (`blur`, a new headline routine —
  see below); the rule under a heading draws itself, 0 to full width,
  once, on first scroll into view (`draw`, the package's own shared
  mechanism, unchanged).
- **Divider.** The blurred section seam: a soft band in the foreground
  token at 5% (6% for the accent-tinted second one), registered through
  `--fx-texture`/`--fx-texture-opacity` so it is measured the way every
  other theme's texture is.
- **Accent.** Quiet — the default row of `themes/hooks.json`, on
  purpose. The demo's headline and section heading carry no shadow and
  no rule of their own beyond what the reveal hook already draws; adding
  one would be decoration for its own sake in a theme whose whole
  character is restraint.
- **Arrival.** Quiet — the demo's own DI5 table lists five effects and
  none of them is an arrival; there is no `--kp-arrival` on this theme's
  root.

Every floating surface (the dropdown, the popover, the toast, the
tooltip, the confirmation, the datepicker panel, the combobox list, the
command palette, the shortcut sheet, the theme menu) carries
`--kp-shadow-2`; the dialog alone carries `--kp-shadow-3` and the dimmed
backdrop, both the demo's own values. Every flat surface (the card, the
alert, the dossier, the spec sheet, badges and tags) carries a border
and nothing else. One answer per component root (56 of 64, the eight
helpers excused).

## X2 — the effects module

The demo's headline is a word-by-word arrival with a blur, not the
skew-and-rise of phantom's `shout` or the drop of brutalism's `slam`, so
it needed its own keyframe (`kp-word-in`) rather than reusing either —
`js/effects.js`'s word-wrapping branch now also accepts the literal
`blur`, sharing the same wrapping mechanism the other two routines use.
The lede's ink-fill (`kp-mark-in`, a `background-size` change) and the
dialog's rise (`kp-dialog-in`) are new keyframes with their own rows in
`TIMINGS` and, for `kp-mark-in` (not opacity), an entry in
`gates/check-motion.mjs`'s `OUT_OF_SCOPE`. The dossier's redaction bars
use a plain CSS `transition` on `clip-path`, the same mechanism the demo
itself uses, rather than a `@keyframes` — a `transition` is not scanned
by the flash-rate table at all, and the demo was never animating it any
other way. The rule reveal reuses the package's own shared `kp-rule-in`
keyframe unchanged; nothing new was needed for it.

**What the demo showed and the package now renders exactly (S49,
2026-09-08).** Kenny's rule of 2026-09-08 is that an approved demo is
implemented exactly, and that a test or a gate which disagrees produces
a finding for him rather than a quiet change. What follows is named
here, with its reason, because none of it is a silent adaptation:

- Every colour in this register is `var(--token)` or a relative colour
  of one. The demo's own CSS reaches for `color-mix(in srgb, var(--x) N%, transparent)`
  for its three shadows and its dialog backdrop, and
  `color-mix(in srgb, var(--primary) 88%, black)` for the nav CTA's
  hover — the first is `hsl(from var(--foreground) h s l / a)` here (the
  identical colour, computed the way every other register in this
  package already expresses "a token at low opacity"), and the second is
  `hsl(from var(--primary) h s calc(l - 9))` — a lightness step instead
  of a mix toward a named colour, because `color-mix()` toward `black`
  or `white` is exactly the "no colour of your own, not even in a
  comment" DI9 was written to end, and no register in this package
  before this one has ever used `color-mix()` (measured: zero
  occurrences across all six existing registers before this change).
  Both are the same pixels; only the syntax moved.
- The demo's tokens match `themes/shade-light/tokens.json` **exactly**,
  hex for hex, computed from the token HSLs and checked against the
  demo's own listed values before a line of CSS was written — no token
  changed for this lift.
- The demo's mark ink-fill mixes the accent into `--card`
  (`color-mix(in srgb, var(--accent) 24%, var(--card))`); the register
  uses `hsl(from var(--accent) h s l / 0.24)` instead — a plain alpha
  tint rather than a mix baked toward one specific ground token, because
  a mark can sit on the hero's `--background`, the app surface's
  `--muted`, or a card's own `--card`, and the demo's own mix assumed
  only the last of those. The rendered colour over `--card` is the
  demo's own to within rounding; over any other ground it is the same
  mechanism the rest of the package already uses for a token-at-opacity
  tint.
- The demo's redaction bars are the exact clip-path values
  (`inset(0 0 0 0)` covered, `inset(0 100% 0 0)` clear) and the exact
  stagger (90ms, `transition-delay`); the package's markup carries no
  `--i` custom property per mark the way the demo's own hand-written
  HTML does, so the stagger is expressed as `:nth-of-type(2)` /
  `:nth-of-type(3)` instead of `calc(var(--i) * 90ms)` — three marks,
  three rules, the same three delays.
- The demo's dossier is three separate `<p class="kp-dossier__line">`
  elements, each with one redacted phrase; the concept page's structure
  is the same for every theme (S46), and its dossier paragraph is one
  `<p>` with three `<mark>`s inline. The register answers the marks it
  is given exactly the same way (a redaction bar, staggered), and the
  paragraph carries all three.
- **Not reproducible without markup, and reported as such:** the demo's
  redaction bars are inline-block (`display: inline-block` on
  `.kp-dossier__line[data-kp-reveal='emphasis']`) so each line's bar sits
  under its own text only; the shared card carries the whole paragraph as
  running text, so a redaction bar in the package covers its own `<mark>`
  exactly as before, and this is not a difference in what is drawn, only
  in how much surrounding prose sits beside it on the same line — no
  markup change was needed to answer it, and nothing was left unbuilt.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 48% grey on paper, card and popover;
Solarized's base1 at 60% failed the card at 2.78 and was deepened. The
shadow scale sits inside that boundary as decoration, never instead of
it, the same rule retro's bevel follows.

**DI2 — the focus ring.** Deep blue over paper, the ink as the second
channel — `--focus-ring`/`--focus-ring-contrast` already resolve to
exactly `--foreground`/`--background` for this theme in `css/themes.css`
(measured: `hsl(194, 14%, 40%)` / `hsl(44, 87%, 94%)`, the demo's own
hardcoded values to the digit), so the register makes no change here at
all — DI2 was already answered before this lift began.

**DI3 — states you can see.** Derived by lightness; the register adds
one lightness step of its own, `--kp-primary-pressed`, for the one hover
the demo names explicitly (the nav CTA and the primary button).

**DI4 — colour is never the only carrier.** Olive-green offer against
red rejected clear the deuteranopia floor at these depths; every plate
carries paper ink and a label, and the register never lets an accent
carry a word on its own (see "Accents are plates" above).

**DI5 — the flash threshold.** Five effects, the demo's own DI5 table:
the headline's words (opacity 0→1, staggered 70ms, up to four landing
within one second — well under three opposing changes per second), the
lede's ink-fill (a size change, not luminance), the rule's draw (a
transform), the redaction clear (a discrete, user-triggered, one-shot
`clip-path` transition per bar, outside the per-second accounting
entirely), and the dialog's rise (opacity 0→1, once). Nothing loops,
nothing blinks. Rated in `reports/di5.md`.

**DI6 — light or dark.** `color-scheme: light`; ground 94%, card 97%,
popover 99%.

**DI7 — reduced motion.** Every animation and transition the register
adds lives inside the `prefers-reduced-motion: no-preference` guard; the
rest states above (drawn rule, filled marks, uncovered redactions) are
what a reader who asked for reduced motion gets.

**DI9 — theme colour stays in the token layer.** The register names no
colour: every shadow, tint and fill is a token or a relative colour of
one (see the S49 section above for the `color-mix()` question). One
texture — the blurred divider seam, at 5% (6% for the accent-tinted
second band), both under DI9's 6% ceiling, not at it; the old anatomy's
"no texture, anything drawn on it would be the first thing anyone saw"
is honoured for everything else — no grain, no halftone, no raster, no
vignette, no scanline — and the demo itself treats that sentence as a
hazard in its own right, refused the same way its other hazards are.

## What this theme may not do

- Carry an accent as text. `--accent` is a plate, a border or a dot,
  never a `color` on running text.
- Glow or blink. No looping animation, no opacity flicker; every reveal
  in the register runs once.
- Add a shadow to a flat surface (a card, an alert, a badge) or a border
  to a floating one instead of the shadow — the two vocabularies do not
  mix within one component.
- Add a second texture. The blurred seam is the one felt effect this
  theme carries; a grain, a halftone or a scanline would be the loud
  half's job, not this one's.
- **No black.** The darkest text is 40% lightness; the darkest value
  anywhere is the sidebar, which wears the dark half's ground.
- **No warm accent.** The scheme's warmth is in the paper; every accent
  is cool or primary.
