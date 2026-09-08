# grotesk — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Grotesk is the
> theme lifted at LIFT_PLAN row 12 (S48). The concept demo Kenny approved
> on 2026-09-08 is "Twelve Columns"; its own inline comment cites where
> each mechanism was measured (Grilli Type, Hiroto Sato, PDR, Dead North).

## The idea

The International Typographic Style — the Swiss school of Müller-
Brockmann and Hofmann: white paper, black type, one red, a twelve-column
grid, oversized flush-left headings, asymmetric columns. The identity is
carried by typography and the grid rather than by colour, which is what
sets it apart from `light` (indigo, soft radius, millimetre grid) and
from `high-contrast` (black on white for a safety reason, with a yellow).
Its closest candidate was brutalism; brutalism is unstyled, this is the
most styled thing there is.

## What is load-bearing

1. **One red, and it is text-safe.** `hsl(355, 95%, 45%)` — recomputed to
   8-bit sRGB this is `#E00618` (the demo's own recomputation; the `#E30613`
   figure this document carried before 5.0.0 was a 3-unit rounding
   difference, corrected here per the demo's instruction that its own
   recomputed value is what the page paints and what it measures against).
   It is 4.99:1 on paper and is the primary, the signal, the ring and the
   `<mark>` colour. On the grey plate it is a boundary only; nowhere else
   is there a hue except where the semantic tokens require one.
2. **Black is the structure.** Boundaries, inputs, the accent and the
   sidebar are the ink; the grid is the ink at 4–5%.
3. **Twelve columns.** The texture is a single vertical hairline repeated
   every twelfth of the width — columns, not squares — which is the
   poster's grid and not light's drawing-table grid.
4. **Archivo at 800/900 for headings, Inter for the body.** Both
   Helvetica-class; the heading weight and the tight tracking are the
   theme.
5. **Asymmetric columns, everywhere.** The fourteen-column navbar track
   (brand in three, links in eleven, right-aligned), the hero's
   content/spec split, the redaction bars: nothing in this register is a
   50/50 grid.

## The register (5.0.0)

`css/grotesk-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the approved demo:

- **Surface.** The hero reuses the shared two-column hero grid at an
  asymmetric 3fr/1fr ratio (content, spec sheet); the vertical margin
  note sits outside that grid, in the mono face, the way the demo's own
  2fr margin column does.
- **Emphasis.** A loose `<mark>` (the hero's lede) is a static colour
  change — signal red, bold, no reveal, no cut, matching the demo's own
  motion inventory, which lists no animation on the lede's marks. A
  dossier's marks (`.kp-card[data-kp-reveal='emphasis'] mark`) are Dead
  North's stepped, staggered redaction: an ink bar over the word until
  the trigger opens the file, then a three-step monotone cut
  (`steps(3, end)`, ~90ms apart) — a cut, not a fade, matching the
  anatomy's refusal of anything soft.
- **Reveal.** The headline's arrival is optical, not typographic: Hiroto
  Sato's blur+brightness resolve, a one-shot 640ms sweep from dim and
  unfocused to full (`sharpen`, a new headline routine — no existing one in
  `js/effects.js` does a filter-based resolve; `decipher`/`tracking`/
  `shout`/`slam`/`dissolve`/`type` all manipulate the text itself). The
  rule under a heading reuses the base layer's shared `kp-rule-in`
  keyframe at the demo's own 320ms, delayed 640ms so it follows the
  headline settling, `cubic-bezier(0.2, 0, 0, 1)` (`draw`).
- **Divider.** The double rule as razor tear, PDR's measured pattern: two black rules the
  width of the page with a one-pixel signal hairline exactly centred
  between them — a caesura in the grid, not a diagonal cut (a diagonal
  would break rule 2 below). The second divider takes a one-column
  caesura against the theme's own twelve-column texture.
- **Accent.** Quiet — no heading accent beyond the type itself. The base
  layer's pre-round-six red square before every `h1`/`h2`
  (`css/_rules.css`) is suppressed inside a surface by this register: the
  approved demo's headings carry no such glyph, and the demo's appearance
  is what a surface heading shows now (see the closing section).
- **Arrival.** Quiet — no arrival; the page is simply there. The demo's
  own hazards section says so directly ("no CRT/flicker keyframe is used
  anywhere on this page") and builds no boot sequence of its own.

Every hover on a link is the two-speed timing Grilli Type's own reference
measures: `.1s` in, `.15s` out — reused on nav links and footer links
alike. Every button is a plain rectangle, `--radius: 0`, with the primary
button's mirror-invert (colour swap on hover) using the theme's own
`--fx-duration`/`--fx-ease` (120ms, `cubic-bezier(0.2, 0, 0, 1)`) rather
than a value invented for the demo — the same knob the confirmation
dialog's one-shot open/close uses.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** Ink on paper and on the plate, 18.73:1 (see
below); the real boundary/input/focus channel is always ink, never the
1.41:1 hairline, which is decoration only.

**DI2 — the focus ring.** Ink draws the inner channel, paper the outer
one, on every surface (18.73 apart, so whichever channel a surface
defeats, the other clears 3:1) — the same arithmetic DESIGN_INVARIANTS.md
states for the package. The primary button's ring composes paper and ink
in front of the signal fill.

**DI3 — states you can see.** Derived by lightness; red at 45% has room
both ways.

**DI4 — colour is never the only carrier.** Green offer against red
rejected: the first draft measured 8.6 under deuteranopia; a bluer, more
saturated green (`hsl(160, 70%, 30%)`) against a pure red at 30% measures
21.0, with white ink on both above 4.5.

**DI5 — the flash threshold.** Every gesture in the register is one-shot
and monotone: the headline's blur+brightness resolve (640ms, one change),
the rule's draw-in (320ms, delayed, a transform), the redaction's
three-step cut (220ms `steps(3, end)`, a transform), the link/button
colour swaps (0.1–0.15s, one direction at a time), the dialog's open
(120ms, opacity+transform). Nothing loops, nothing oscillates. The
twelve-column texture is static, painted once, never animated.

**DI6 — light or dark.** `color-scheme: light`; paper, card and popover
are all white, and the difference between them is the hairline border.

**DI7 — reduced motion.** Every animation and transition of the register
sits inside the no-preference guard; the rest states hold without them
(the headline shows its plain text, the rule stands drawn, the
redactions stand at whatever `.is-cleared` state the trigger last set).

**DI9 — theme colour stays in the token layer.** The register names no
colour: every rule is `var(--token)`. One texture — a single vertical
hairline at the ink's own colour, at 5% (see the closing section for the
demo's own 4% figure and why the two differ), painted once, never
animated.

## Contrast, measured (per the demo's own working, X0)

Recomputed from `themes/grotesk/tokens.json`'s `hsl()` values, WCAG 2.x
relative-luminance formula:

- ink `#121212` on paper `#FFFFFF`: 18.73 — body text
- ink `#121212` on plate `#F0F0F0`: 16.44 — secondary surfaces, card head
- ink `#121212` on wash `#F5F5F5`: 17.18 — muted panel text
- muted-ink `#666666` on paper: 5.74 — side note, microlabel
- paper on signal `#E00618`: 4.99 — primary button label
- paper on ink: 18.73 — mirror-hover, footer
- paper on alarm `#C70515`: 6.07 — destructive button label
- signal on paper: 4.99 — link colour, `<mark>` ink
- info `#1F4EAD` on paper: 7.63 — dossier stamp ink

Lowest pair used for text is 4.99 (≥ 4.5 required); lowest pair used as a
boundary/state indicator is 16.44 (≥ 3 required). The contrast gate and
the invariants gate were both run after `tokens.json`'s `kp-text-display`
change (below) and both still pass.

## What it deliberately does not do

- **No second colour.** The blue and the amber exist only as `--info`
  and `--warning` and their plates.
- **No radius.** `0rem`; the grid is right angles — which is also why the
  dossier stamp is axis-aligned rather than rotated, unlike some other
  themes' stamps.
- **No off-white.** The paper is white: the Swiss poster was printed on
  white stock, and the warmth of formal and sepia is a different idea.
- **No skew, no clip-path, no bevel.** Those belong to phantom and retro;
  grotesk's whole vocabulary is right angles and a 2px rule.
- **The signal never fills a large plate.** It is a rule, a hairline, a
  stamp border, a label, a ring, never a button-sized fill outside the
  primary/destructive semantic tokens the contract already requires.

## What the demo showed and the package now renders exactly (S49)

The demo ("Twelve Columns") is a standalone fragment that paints its own
literal hex and builds its own bespoke markup (`.gr-nav`, `.gr-hero-grid`,
`.gr-redact-wrap`, and so on); the package renders the same idea through
its shared component classes and the hook vocabulary. Everything the
demo's own "HAZARDS REFUSED" and "CONTRAST" sections claim was re-measured
against `themes/grotesk/tokens.json` and matched exactly (see the table
above) — no token needed to change for colour. One token did change:
`kp-text-display` was `clamp(2rem, 4vw, 3rem)` and the demo's own h1 sets
`clamp(2rem, 4vw, 3.4rem)`; the token now carries the demo's value (X0:
"the demo wins"), and `check-contrast.mjs`/`check-invariants.mjs` still
pass with it.

Three places could not be built as literal ports of the demo's own
markup, because the demo is a one-off page and the package is one
register answering shared markup used by every theme:

- **The 2fr/12fr hero split.** The demo's grid puts the vertical side
  note in a literal 2fr grid column and the headline block in a literal
  12fr one. The shared concept markup's hero grid has two roles instead —
  a content column and a spec-sheet column (`data-kp-hero-grid`) — and
  the side note is a sibling of that grid, not a column in it, in every
  lifted theme. The register keeps the demo's _asymmetry_ (a 3fr/1fr
  split) and positions the side note absolutely in the margin, the same
  adaptation phantom and retro made for their own margin notes.
- **The twelve-column texture's opacity.** The demo's own comment states
  it "holds it at 4%"; `css/_rules.css`'s grotesk texture block predates
  this round (3.1.1) and declares 5% — both are under DI9's 6% ceiling,
  and the file is shared base layer, not this register, so it was not
  changed here. **Finding, not corrected**: Kenny's approval is needed to
  move that pre-existing 5% to the demo's 4%, or to leave it (a 1-point
  difference, both under the ceiling).
- **The base layer's pre-round-six heading accent.** `css/_rules.css`
  already gave grotesk's `h1`/`h2` a static red square before the text
  (Müller-Brockmann's mark, a 3.1.1-era "one signature per theme"
  flourish, unrelated to this round's demo). The approved demo's own
  headings carry no such glyph. Per S49's own worked example ("keep the
  demo's appearance where you can"), the register suppresses the square
  with `content: none`, scoped to a heading inside `[data-kp-surface]`
  only — the flourish still stands on a heading outside a surface (a
  docs page, the showcase). This is not a gate refusing something; it is
  two features of the package disagreeing with each other, resolved in
  the demo's favour inside the file this lift owns. **Finding**: whether
  the base-layer signature should be retired for grotesk everywhere (not
  only inside a surface) is Kenny's call, not made here.

Nothing the demo showed was dropped for want of a token, a routine or a
font: Archivo and Inter both ship already (`fonts/families.json`, no
Reserved Font Name), the `sharpen` headline routine was added to
`js/effects.js` rather than reused from an unrelated one, and every
colour, contrast pair and motion the demo names was measured and holds.
