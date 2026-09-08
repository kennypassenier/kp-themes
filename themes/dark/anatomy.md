# dark — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Dark is the
> seventh theme lifted in 5.0.0 (S48, LIFT_PLAN row 15). The concept demo
> Kenny approved on 2026-09-08, at its second reading, is "Small Hours"
> (stars II) — `dark-demo-stars-v2.html`; the plain first draft
> ("Small Hours") and the first, tiled starfield try
> (`dark-demo-stars.html`) stay comparison points beside it.

## The idea

The ordinary dark theme, done properly. A deep slate ground with a blue
cast (`hsl(226, 22%, 8%)` — not black), soft off-white text, and a
luminous, unsaturated violet that lifts off the ground without glaring.
The whole job of this theme is to be the one someone reads in for two
hours.

The one ornament is a starfield of 112 irregular, once-generated points —
"a starfield you cannot quite see" resolved, on Kenny's second reading, to
one you **can**: still faint at this theme's own scale, but no longer
invisible, with ten of the brightest points carrying a soft JWST-style
diffraction shimmer.

## What is load-bearing

1. **Not black, not white.** The ground is 8% lightness and the text is
   93%, giving 14.85:1 rather than the 21:1 of pure black on pure white.
   That gap is deliberate: the extreme ratio causes halation around glyphs
   and pupil fatigue.
2. **The violet is light, not saturated.** `hsl(255, 85%, 74%)` works on a
   dark ground because it is bright; a dark saturated violet would vibrate
   against it.
3. **A blue cast throughout.** Ground, border and muted text all carry the
   same hue family. A neutral grey would read as cheap.
4. **The starfield is static.** No `@keyframes`, no opacity cycling,
   nothing that could ever oppose luminance — a still photograph, painted
   once, of 112 literal positions from a seeded PRNG run once at build
   time (seed 20260908; nothing here is randomised in the browser).

## The register (5.0.0)

`css/dark-register.css` is the theme's answer to the hook vocabulary
(S45):

- **Surface.** The void, quiet on purpose: no chrome beyond the ground and
  the two texture layers. The laurels are three quiet panels; the spec
  sheet a plain card; the side note a difference-blend margin note over
  the hero's own violet glow (there is no photograph to invert over, S48,
  so the "imagery" is the glow itself — decorative, `aria-hidden`, checked
  for contrast on every surface it might land on though it carries no
  required text).
- **Emphasis.** Two readings of the same hook, both answering `mark`, by
  context — the general rule (`ignite`) is the lede's own: a mark stands
  muted until the reader scrolls it into range, then its ink and
  underline resolve to violet, bound to the reader's own scroll position
  (`animation-timeline: view()`, `entry 30%` to `entry 80%`) rather than a
  timer, so it cannot free-run and cannot loop. Inside the dossier a more
  specific rule takes over: the mark is a redact bar in the theme's edge
  colour that lifts right to left on the trigger, staggered 90ms apart —
  the demo's own mechanism for that slot, distinct from the lede's
  colour-only ignite.
- **Reveal.** The headline resolves word by word out of a blur
  (`resolve`): each word settles from invisible and blurred, offset a
  little below its line, to its rest state over 640ms, staggered 28ms
  apart, Dead North's measured word-stagger timing reused but reskinned
  from its own skew-and-shout into a blur-and-settle, because this theme
  is read for two hours, not shouted at. The rule under a heading sweeps
  in the same still-life way as the mark — a scroll-bound background
  slide, not a timed one-shot (`sweep`).
- **Divider.** A night seam: one step darker than the page ground
  (`--sidebar-background`), its own denser local sample of the starfield
  technique (twelve hand-placed points, not the page's global field), a
  thin violet line at true centre.
- **Accent.** Nothing beyond the heading's own type and the word-resolve
  above; there is no accent mechanism the demo adds beyond the reveal.
- **Arrival.** Quiet. The demo has no boot sequence; the page is simply
  there.

Every button is a flat panel with an edge, no bevel; fields are the same
panel with a violet focus border; the dropdown carries its own violet
keyboard ring, replacing the page-wide ink outline for that one context
(KT14 — the part every one of the first batch's demos left unstyled).
Panels (dialog, popover, menu, toast, confirm, palette, theme-menu) share
one quiet dark ground and a shadow derived from the background token
itself, never a raw black. One answer per component root (56 of 64, the
eight helpers excused).

**What the demo showed and the package now renders exactly (S49,
2026-09-08).**

- **The starfield, exactly.** All 112 positions, radii and per-dot alphas
  are the literal values the demo's own header comment carries (its own
  stdout from `scratchpad/dks2-generate-stars.mjs`, seed 20260908),
  translated only from the demo's own `var(--ink)` token name to the
  package's `var(--foreground)` — no position was moved, no alpha
  retuned. The field's own opacity is 0.35, exactly as measured, over
  DI9's 0.06 ceiling and **reported, not corrected** (S42) —
  `gates/config.json`'s `textureOpacityCeiling.perTheme.dark` is 0.35,
  the demo named as the reason.
- **The shimmer, as a mechanism substitution.** The demo built its ten
  brightest stars as an inline SVG `<symbol>` reused by ten `<use>`
  elements. A register is CSS only, and the concept page's markup is
  shared by every theme in the package — a register cannot add an SVG
  block to it. The same look — a soft core plus eight thin rays, subtle,
  fading with distance from the centre, only ten of 112 stars carrying it
  at all — is rebuilt as layered `conic-gradient` rays (the demo's own
  per-star rotation, recomputed as angle offsets) masked by a small
  `radial-gradient` window per star, so the rays taper by distance the
  way the SVG's own gradient stroke did. This is named here as a build
  note rather than a finding that changes the demo's appearance: the
  visual target — the glyph Kenny asked for, "subtly please" — is the
  same; only the drawing technique differs, because the alternative was
  not offered by the architecture at all.
- **The dossier's second paragraph and the stamp's open-state word** have
  no equivalent in the demo (its dossier carries one paragraph, and its
  stamp never swaps its label), so `showcase/concept-copy.mjs`'s
  `dossierPara2` and `stampLabelOpen` slots are written in the demo's own
  voice rather than taken from it, and are listed as invented in the
  lift's report.
- **The spec sheet's eight labels** answer the page's own fixed eight
  slots (hero ground, page ground, alert, label, a theme's own fifth
  colour, display, body, mono) in the demo's own vocabulary (`ground`,
  `void`, `danger`, `accent`, `edge`, `display`, `body`, `mono`) — the
  demo's own sheet has ten rows in a different shape (no separate
  hero-ground row, an extra `ink`/`tokens` pair), so this is an
  interpretive mapping onto the template's fixed slots, not a literal
  transcription.

## Answers to the invariant questions

**DI1 — hairline or boundary?** Both exist and are distinct: `--border`
(`hsl(226, 15%, 20%)`) stays the ungated hairline, never used as a
boundary; `--border-strong`/`--input` (`hsl(226, 16%, 45%)`, the demo's
own `--edge`) is the boundary DI1 measures, clearing 3:1 against both the
void and the panel.

**DI3 — does this theme follow the derivation?** Yes, inverted: on a dark
ground "one step" moves toward lighter, not darker, because the ground is
dark. Buttons and fields already follow it — a relative-colour lighten of
`--primary` on a primary button's hover, `--accent` on a ghost or a nav
link's hover.

**DI4 — palette or code?** A code; status colours are lighter than their
light-theme equivalents, not darker, per the design invariant's own
warning against reusing the same hex in a dark theme.

**DI5 — animation?** Every reveal on this page is one monotonic change:
the word resolve (640ms, once per word, staggered), the mark's ignite and
the rule's sweep (both scroll-bound via `animation-timeline: view()`,
bound to the reader's own scroll position rather than a clock — they
cannot free-run and cannot loop, and `gates/check-motion.mjs`'s
`OUT_OF_SCOPE` carries the reason for each), and the dossier's redact bar
(one clip transition per redaction on the trigger, staggered 90ms apart,
one-shot). None of it is a repeating cycle. The starfield itself carries
zero animation of any kind.

**DI6 — light or dark, and is the ordering deliberate?** Dark; L3 already
corrected the ordering this theme's Phase 2 anatomy flagged as accidental
(background → card → popover rising by getting lighter, as a dark theme's
layers should).

**DI7 — reduced motion.** Every animation and transition of the register
lives inside `@media (prefers-reduced-motion: no-preference)`; at rest
every word of the headline already stands sharp, every mark already
stands violet (or, in the dossier, already cleared once the trigger is
pressed), the rule already fully drawn. The two view-timeline mechanisms
degrade to the same finished rest state in a browser that supports
`prefers-reduced-motion` but not `animation-timeline: view()`, because the
`@supports` guard sits inside the `@media` one.

**DI9 — theme colour stays in the token layer.** Every stop in both
texture layers and every other rule is a token or a relative colour of
one; nothing is named.

## What this theme may not do

- Reach pure black or pure white.
- Use a saturated mid-lightness colour over a large area; it vibrates.
- Let the starfield move, cycle, or gain a keyframe of any kind — it is a
  photograph, not an effect.
- Let the shimmer stop being a minority: only ten of 112 stars may carry
  the spike glyph, or it reads as a wash rather than "a little brighter."

## Open for L3

Closed: L3 already resolved the boundary gap and the layer-ordering fault
this theme's Phase 2 anatomy flagged before the round-six lift; both are
verified above rather than left open.
