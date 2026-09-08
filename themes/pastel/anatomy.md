# pastel — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Pastel is the
> sixth theme lifted in 5.0.0 (S48, LIFT_PLAN row 6). The research behind
> it is §5 of [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md); the
> concept demo Kenny approved on 2026-09-08 is "Second Pass".

## The idea

Risograph printing. A lavender-milk ground, plum ink, and the slight
misregistration of a second pass that never quite lines up — not as a
flaw dressed up as a feature, but as the theme's actual mechanism: a
duplicate layer that springs from a wide mis-registration into its
2px rest position once, on load. Soft without being weak: the ink
colours are properly saturated, it is the _ground_ that is pale.

The largest corner radius of any theme carries through here as a full
rounded outer clip on the hero, and a torn-tab zig-zag divider answers
S46's razor-tear brief in the theme's own material: paper, not metal.

## What is load-bearing

1. **The ground is tinted, not white.** A lavender so pale it reads as
   white until you put white next to it.
2. **Plum, rose and mint**, plus sky, sand and violet as the same
   base/soft system — every one of them the theme's own existing
   semantic token pair (background/foreground), shown together on the
   concept page's spec sheet as a kit, not invented for the demo.
3. **The overprint.** The headline carries a duplicate layer in a second
   ink, held at its measured 2px offset. It is the theme's signature and
   its main accessibility risk (see "may not do" below); the demo adds
   one arrival on top of the always-static signature, never instead of
   it.
4. **Soft geometry.** Large radii everywhere, and now a full rounded
   clip on the hero and the dossier. Sharpening them makes it another
   light theme.
5. **The springy overshoot.** The theme's own `--fx-ease` (an overshoot
   cubic-bezier, tuned down from Aardvark Book Club's reference for a
   gentler kit) drives the headline's spring-in, the mark fills, the
   rule draw and every hover/press transform. Nothing else in the
   package eases this way.

## The register (5.0.0)

`css/pastel-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the research:

- **Surface.** The hero clips to a rounded outer edge; the halftone
  raster (six-pixel dots in the boundary ink, at 0.05 — under DI9's
  ceiling) replaces the theme's earlier fractal-grain texture for this
  theme only, because the demo measured dots, not noise.
- **Emphasis.** A `<mark>` is a fill: the plate grows in behind the word
  (mint by default, violet for the lede's second mark — the shared
  markup carries no modifier class between the two, so the second is
  reached structurally rather than by a class the demo's own markup
  used). The dossier's redactions are an ink bar over each phrase that
  fades and narrows away on the trigger, staggered 90ms apart.
- **Reveal.** The headline's overprint duplicate springs from a wide
  mis-registration into register once (`overprint`, new to
  `js/effects.js` — no existing routine reproduces a second layer
  springing into an already-static rest position); the app heading's
  rule grows left to right once, when it enters the viewport (`draw`).
- **Divider.** The torn-tab answer: a jagged zig-zag clip-path through a
  filled bar, plum-first and mint-ink-first for the two tears so they
  read as two different sheets, adapted to hold its shape at 320px with
  percentage points rather than the reference's fixed em ones.
- **Accent.** The display step, balanced, with the overprint duplicate
  behind it.
- **Arrival.** None. The demo declares no `--kp-arrival`, and the
  register declares none either.

Every hover is the springy lift the base layer already gives every
button (`--fx-lift`, corrected from 3px to 2px to match the demo's own
measured translateY, X0); a press settles with a small scale, matching
"the only theme that overshoots" written down at L3. The dropdown is a
raised card in the theme's own radius (KT14); the dialog and every panel
share the demo's own literal shadow, expressed as the foreground token's
hue at the demo's own lightness and alpha (X0). One answer per component
root (56 of 64, the eight helpers excused).

**What the demo showed and the package now renders exactly (S49,
2026-09-08).** Kenny's rule of 2026-09-08 is that an approved demo is
implemented exactly, and that a test or a gate which disagrees produces
a finding for him rather than a quiet change. What follows is named here
with its reason; nothing below was decided silently.

- **Every token value in the demo already matched an existing token
  exactly** — measured pixel for pixel (background, foreground, card,
  primary/-foreground, secondary/-foreground, accent/-foreground,
  destructive/-foreground, warning/-foreground, info/-foreground,
  border, border-strong, muted, muted-foreground, sidebar-background,
  fx-overprint, fx-ease, fx-duration, radius, theme-font-body/-display/
  -mono). No token value changed for X0; `--fx-lift` changed from 3px to
  2px, the one place the demo's own measured value (`translateY(-2px)`
  on hover) differed from what the theme already declared.
- **The stamp's plate and ink** had no token that already carried them.
  The plate is the accent token's own hue at a much darker, measured
  lightness (near its saturation too) rather than a new contract-wide
  token, since S47 is for a colour no token can reach at all and this
  one is a token's own hue, darkened to the pixel the demo showed. The
  ink is the foreground token forced to zero lightness.
- **The dialog, backdrop and dropdown shadows** are the foreground
  token's own hue (it matches the demo's literal shadow hue exactly) at
  the demo's own lightness and alpha, carried over exactly rather than
  approximated.
- **The dossier's redaction markup** differs from the demo's own HTML:
  the demo draws three standalone `.kp-redaction` spans beside plain
  text; the package's shared concept skeleton (and every other lifted
  theme's dossier) puts the three redacted phrases inside `<mark>`
  elements in one flowing paragraph, because that is the only wiring
  `js/effects.js`'s emphasis trigger reaches. The visual mechanism (an
  ink bar that fades and narrows away, staggered) is built exactly; the
  markup shape it attaches to is the package's, not the demo's.
- **The stamp's position** is the package's own established pattern
  (an absolutely positioned, rotated corner badge on `::before`, reading
  `data-kp-label`) rather than the demo's inline badge at the top of the
  card, because the shared Card component carries the stamp only through
  that one attribute-and-pseudo-element channel — every other lifted
  theme's stamp is built the same way, for the same reason.
- **The halftone's `mix-blend-mode: multiply`** could not be carried
  through: the package's one shared texture layer (`body::after` in
  `css/_rules.css`) has no blend-mode knob, only `background-image`,
  `background-size` and `background-opacity`. At the demo's own 0.05
  opacity over a near-white ground, a normal-blended dot and a
  multiply-blended one are not distinguishable by eye; reported rather
  than built, per S42.
- **The texture is sitewide**, not scoped to the hero and the dossier
  the way the demo's own `.kp-halftone` class was: every other lifted
  theme's texture also covers the whole page (the one shared
  `body::after` layer), so this follows the established package
  mechanism rather than the demo's more surgical scoping.
- **The spec sheet's content** does not match the demo's own six
  split soft/ink colour-pair chips (mint, sky, sand, violet, plus ground
  and plum). The shared concept skeleton's spec sheet is fixed to five
  single-token swatches (the hero ground, the page ground, the alert
  colour, the label colour, and the theme's fifth colour, `--chart-4`,
  which the demo's own palette never names) plus three font rows; only
  matching labels for those five fixed tokens could be written, and
  `--chart-4` — outside the demo's own kit — is labelled "amber" for
  what it visibly is.
- **The platforms line** carries the demo's own four words (its print
  specs: two Riso drum models, an offset proof, PDF/X-1a) rather than
  the four words every other lifted theme uses there (the browsers and
  channels the package is tested in) — the shared markup's
  `aria-label="Where it renders"` was written for that second meaning,
  so it reads slightly askew of the demo's own words in that one spot.
  Kept as the demo's exact words per S49 rather than silently swapped
  for the other themes' convention.

## Answers to the invariant questions

**DI1 — hairline or boundary?** A hairline, and the faintest problem
case of all: `--accent` measures 1.14 against the ground, the lowest in
the system. Pastel cannot use accent for a selected state at all. Its
boundary colour comes from the plum family at roughly 45% lightness
(`--border-strong`).

**DI2 — the focus ring.** The package's own two-channel ring (inner ink,
outer ground), unrestyled: nothing in this register overrides
`:focus-visible`, because the demo's own ring is the same shape the base
layer already draws.

**DI3 — does this theme follow the derivation?** Yes, but with the least
headroom. The ground is at 97% lightness, so "one step lighter" barely
exists — the derivation moves toward the ink rather than away from it.

**DI4 — palette or code?** A code, and the worst offender: offer and
rejected sit at 1.1 for the commonest colour deficiency, effectively the
same plate. This is also the theme where the primary and danger colours
are closest together, because both live in the rose-plum family.

**DI5 — animation?** Every animation here is one-shot; nothing loops,
nothing opposes its own direction. The headline's spring rates at 1/s;
the mark fill and the rule draw carry no opacity step at all (a
background-size and a width grow, `OUT_OF_SCOPE` in
`gates/check-motion.mjs`); the redaction clear and the hover/press
springs are CSS transitions, guarded the same way as every keyframe.

**DI6 — light or dark?** Light. Card and popover are both pure white
against the tinted ground, so raised reads as _cleaner_ rather than
lighter — an unusual but coherent answer, deliberate rather than a
mistake.

**DI7 — reduced motion.** Every animation and transition of this
register lives inside the no-preference guard; at rest the overprint
sits at its 2px offset, the marks stand full, the rule stands drawn, and
the redactions stand open (see "may not do" below on why open, not
covered, is the safe rest state).

**DI9 — theme colour stays in the token layer.** One texture (a halftone
dot grid, replacing the earlier fractal grain, at 0.05 — under the
ceiling), the stamp and the shadows as relative colours of tokens
(above), and the register reads tokens only.

## What this theme may not do

- Put the overprint on body text. It is scoped to the reveal element
  only (`[data-kp-reveal='headline']`): doubled edges on running text
  are genuinely unreadable for someone with astigmatism.
- Grow past three ink colours. A risograph with six drums is just
  printing.
- Lose the tinted ground.
- Leave a redaction permanently covered on a page with no script
  attached. The dossier's mark cover only renders once
  `[data-kp-effects]` is present and the mark is not yet `.is-cleared`;
  without the effects module, the words stand plain, because a covered
  phrase with a trigger that does nothing is a trap, not a reveal.

## Open for L3 (carried over, unaffected by this lift)

Success and warning have to fit a palette whose hues are already crowded
between rose and plum. Mint is the obvious success colour and already
exists as the accent. Warning likely needs a warm ochre that does not
currently appear anywhere, which makes this the theme where the semantic
colours change the palette rather than extend it.
