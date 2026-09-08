# academia — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Academia is the
> tenth theme lifted in 5.0.0 (S48, `docs/LIFT_PLAN.md` row 10). The
> research behind it is §14 of
> [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md); the concept demo
> Kenny approved on 2026-09-08 is "The Reading Room".

## The idea

Dark academia: the library at night. Ink and mahogany for the ground,
parchment for the text, candle gold for what you can act on, oxblood and
forest green for the blocks that mean something. Cormorant Garamond for
the headings, Lora for the reading.

This is sepia's darker counterpart — Kenny's own framing — and that is
the reason it is dark. The style's own sources describe a parchment
ground with oxblood and forest blocks, and that version sits within a
step of sepia. Turn it over and it has no sibling: solstice is a sunset,
this is a room.

## What is load-bearing

1. **The ground is ink with a trace of red.** `--background`
   `hsl(24, 30%, 9%)`; the card is a leather brown a shade lighter, the
   popover a shade lighter again — three surfaces rising at 0.0087 →
   0.0153 → 0.0219 relative luminance (measured, `node gates/check-invariants.mjs`
   reads this theme clean). Take the hue out and it is dark; take the
   lightness down and it is phantom.
2. **Gold acts, oxblood and forest mean.** `--primary` is candle gold
   `hsl(38, 50%, 58%)` because the contrast gate holds primary at 7.49:1
   against the ground as a link and 7.32:1 as the button's own ink
   underneath it (the demo's own header comment, verbatim: both
   token values match this theme's `tokens.json` to the pixel — measured
   by converting every HSL token to hex and diffing against the demo's
   literal hex table, 2026-09-08). Oxblood at 1.74:1 cannot read on ink,
   so it is never a word — `--accent` is a plate only, with parchment ink
   on top at 8.79:1.
3. **Serifs everywhere, but a readable one for the body.** Cormorant
   Garamond is thin and lives on headings; Lora carries the body at
   normal weight. The house pattern that forbids a serif body is met
   halfway: this is the reading theme, and Lora was drawn for screens.
4. **Radius 0, hairline rules.** A rounded corner in a library is a
   modern intrusion — every panel, button, field and dialog in the
   register is square.
5. **The one gesture is a rule drawing under a heading, slower than
   everyone else's.** Other registers that answer this hook draw at
   `--fx-duration` multiples or a shared 900ms baseline (cyberpunk and
   synthwave both set `--kp-rule-draw: 900ms`); academia's section rule
   draws at that same 900ms, and its headline — the same mechanism,
   generalised to h1 — draws slower still, at 1100ms. A library is not in
   a hurry.

## The register (5.0.0)

`css/academia-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the research:

- **Surface.** The hero and app grounds carry a duotone wash — Lemke's
  duotone-over-image mechanism (§14, measured), generalised to a texture
  wash with no photograph since the package ships no images: a gradient
  from oxblood through transparent to gold, blended in overlay mode at 4%
  opacity, a local texture layer declared through `--fx-texture` /
  `--fx-texture-opacity` on the surface's own pseudo-element (the same
  convention phantom uses for its card halftone), additional to the
  theme's own base grain-and-ledger texture in `css/_rules.css`
  (unrelated, pre-existing, untouched by this lift). The side note is a
  volume/section mark set vertically in the margin; the laurels are three
  measures in a border-left rule; the spec sheet is a bordered card.
- **Emphasis.** A dossier's `<mark>` is a redaction: at rest — no module,
  AR34 — the words simply read, because a page without the script must be
  whole. Only once the module has armed the page (`[data-kp-effects]`)
  and before the trigger opens the file does the mark's own background
  and text colour hide it (not a pseudo-element positioned by an inset
  box, so a redaction wrapping across lines gets one cover per line
  fragment via `box-decoration-break: clone`). A mark outside the
  dossier — the lede's two marked phrases — is never covered at all: it
  is a gold underline the whole time, because the demo never applies a
  reveal to it. `--kp-reveal-emphasis: redact` is a free label:
  `js/effects.js`'s emphasis routine does not branch on the string, only
  the register's own CSS decides what "covered" and "cleared" look like.
- **Reveal.** The headline and the section rule both draw as one gold
  bar — the "one gesture" above — via a **new** JS routine,
  `--kp-reveal-headline: draw` (`js/effects.js`, this lift): the words
  are never touched, no noise, no split into words; an
  `IntersectionObserver` adds `.is-in` once the heading enters the
  viewport, exactly the mechanism the `rule` hook already performed,
  generalised to h1 because the demo drives both off one observer and
  one class. The five existing headline routines (decipher, tracking,
  shout, slam, dissolve, type) all rewrite the element's text; this
  theme's headline does not, so none of them fit, and the addition is
  documented here per the lift brief's "adding one is allowed when the
  demo genuinely does something else."
- **Divider.** A double hairline — one line in a wash of gold, one in
  `--border-strong` — the ruled lines of a ledger's page. The second
  divider (before the footer) reverses which line is which, doubling the
  emphasis.
- **Accent.** The display step of the type scale on every hero heading,
  the demo's own `line-height: 1.08`.
- **Arrival.** Quiet. The demo has no boot sequence — a page in a library
  is simply there — so `--kp-arrival` is left undeclared and the default
  answer applies.

The navbar carries Lemke's ribbon underline (§14, measured): a 1px rule
under a nav link that grows from 0 to 40px on hover and focus, CSS-only,
`.3s ease`. The dossier card sits on Mosby's Files' folder-stack idiom
(§14, measured, "fits academia/sepia as much as nostromo"): a rotated
plate in `--card` behind the card, static, no animation — one plate
rather than the demo's two, a finding recorded below. The confirmation
dialog and every other panel (popover, menu, toast,
tooltip, the pickers) share one popover-surfaced, hairline-bordered,
square-cornered look. One answer per component root (56 of 64, the eight
helpers excused) — `node gates/check-register-coverage.mjs` holds it.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are a warm
grey at 52% lightness: 5.28:1 against the background, 4.75:1 against the
card, 4.33:1 against the popover, 4.01:1 against muted (the demo's own
table, verified against this theme's tokens).

**DI2 — the focus ring.** The base layer's default order already matches
the demo exactly — inner ring `--foreground`, outer ring `--background` —
so the register adds no ring override of its own. On every ground the
theme paints (primary, secondary, accent, destructive), at least one of
the two channels clears 3:1, per the demo's own table.

**DI3 — states you can see.** Follows the standard derivation: the token
layer's generated hover/active/disabled states are untouched, and the
register's own hand-painted hover deltas — a `color-mix()` toward
`--background` for a step down, toward `--foreground` for a step up —
move in the same direction the derivation would, toward the ground or
toward the ink, never toward a colour of the register's own.

**DI4 — colour is never the only carrier.** `status-offer` and
`status-rejected` are 15.0 apart for deuteranopia (measured,
`node gates/check-invariants.mjs`'s own arithmetic run against this
theme, floor 12) — comfortably clear, because this theme's palette
already separates forest from oxblood by more than hue. Everything else
leans on the label, same as every theme (DI4-SCOPE).

**DI5 — the flash threshold.** Every gesture in the register runs once:
the headline's draw (1100ms), the section rule's draw (900ms), the
redactions clearing on their trigger (220ms each, staggered 260ms
apart — three changes over ~740ms, well under three per second), the
dialog opening (180ms). No loop, no autoplay past its one-shot.
`reports/di5.md` carries the ledger; this theme adds no new `@keyframes`
of its own (the dialog's `kp-dialog-in` is a transform+opacity mount, not
a flash) beyond that one entry.

**DI6 — light or dark, and is the ordering deliberate?** Dark, and right:
0.0087 → 0.0153 → 0.0219, rising at every step (measured above). The
register paints its panels on `--popover`, the lightest of the three, so
a dialog or a dropdown always reads as raised.

**DI7 — reduced motion.** Every animation and transition of the register
lives inside `@media (prefers-reduced-motion: no-preference)`; at rest
the headline and rule stand drawn (AR34), the redactions read (or, once
armed, stand covered until the trigger — an instant class flip, no
motion either way), and the dialog is simply present.

**DI9 — theme colour stays in the token layer.** Every colour in the
register is a token or a relative colour of one — `color-mix()` or
`hsl(from …)`, never a hex or a named colour — including the hover
deltas, which the demo painted as a mix toward black or white and this
register reproduces as a mix toward `--background` or `--foreground`
instead: the same direction (darker toward the dark ground, lighter
toward the pale ink) without a colour of the register's own. The duotone
wash sits at 0.04 effective opacity (measured by
`gates/check-texture.mjs`), under DI9's 0.06 ceiling with room to spare —
no per-theme ceiling override was needed.

## What this theme may not do

- Round a corner. `border-radius: 0` everywhere the register paints a
  boundary.
- Use oxblood as text. It is a plate only (1.74:1 on the ground; the
  demo's own header comment names this "FAILS as text on purpose").
- Introduce candle flicker. The obvious animation is a luminance change
  on repeat, which DI5 counts — nothing here loops.
- Cover the lede's marks. The dossier redacts; the lede never does, on
  the demo's own authority (it never applies a reveal to those marks).

## What the demo showed and the package now renders exactly (S49)

Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding for
him rather than a quiet change. This lift found no case where a gate
disagreed with the demo — every token was already at parity (see below)
and every contrast pair the demo cites passes at the ratio it claims. Two
places where the shared package's own architecture (not a gate, not a
test) shaped how the demo's mechanism was reproduced are recorded here,
because the rendered result differs from the demo's own standalone
fragment in ways worth naming even though nothing Kenny approved was
changed:

- **The headline and rule draw at rest, not hidden.** The demo's own
  standalone CSS starts both `::after` bars at `scaleX(0)` and relies
  entirely on its own inline `<script>` to reveal them — reasonable for a
  self-contained artifact, but the package's own invariant (AR34: "a page
  without the module shows drawn rules and clear marks") requires a
  register's rest state to be the _revealed_ one, exactly as cyberpunk,
  synthwave and terminal already solve the same tension. So the register
  draws both bars by default and hides them only while
  `[data-kp-effects]` is present and the heading has not yet entered the
  view — identical to the demo whenever the module runs, and additionally
  correct for the no-script case the demo's own fragment never had to
  handle.
- **The redaction mark is covered only while armed, not by default.**
  Same reasoning, applied to the dossier: the demo's own `<mark>` starts
  covered unconditionally; the register instead starts revealed and
  covers only under `[data-kp-effects] mark:not(.is-cleared)`, so a
  reader without JavaScript sees the file's own words rather than a
  permanently redacted page.
- **The folder stack is one plate, not two.** The demo's own standalone
  markup wraps the card in a separate `.kp-folder-stack` element carrying
  two rotated plates on its own `::before` and `::after`; the shared
  concept-page template puts the `data-kp-reveal` hook (the dossier) and
  `data-kp-label` (the stamp) on the same `Card` element with no such
  wrapper, and the stamp already needs `::before` — the demo's own
  convention, shared with terminal, retro, phantom and brutalism.
  Splitting an element's two pseudo-elements between a two-plate stack
  and a stamp is not possible, so the register keeps the stamp on
  `::before` and the stack on `::after` alone: one plate rather than the
  demo's two. Found and fixed 2026-09-08 after the first version put the
  stack on both pseudo-elements and the stamp silently lost its
  position, its background and half its content to the cascade —
  `tests/register-academia.spec.mjs`'s dossier test now asserts the
  stamp's own content independently of the stack's, which is what caught
  it.
- **The stamp never swaps its word.** The demo's own JS never changes
  the "Restricted" stamp when the file opens — no `stampLabelOpen` logic
  exists in its standalone script at all. The shared `conceptBody()`
  template that every lifted theme's generated page uses always emits a
  `data-kp-label-open` attribute (added for phantom/retro/terminal/
  brutalism's own swaps, S49-A11), so a word ("Cleared") was supplied for
  it in `showcase/concept-copy.mjs` — but the register does not read
  that attribute, keeping the stamp static exactly as the demo shows it.
- **The spec sheet's nine rows fit the shared template's fixed eight.**
  The demo's own spec sheet names nine swatches (ground, card, act,
  ordinary, means, alarm, display, body, mono); the shared concept page
  template (`showcase/examples.mjs`) has eight fixed slots tied to
  specific tokens (`surface-hero-bg`, `background`, `destructive`,
  `accent`, `chart-4`, then the three faces) — the same constraint every
  other lifted theme's spec sheet meets. `spec1`/`spec2` ("hero"/"ground")
  stand in for the demo's single "ground" row split across the template's
  two ground swatches (identical colour in this theme), and `spec5`
  ("marginal") is invented for the template's required fifth-colour row
  (`--chart-4`), which the demo's own dossier never discusses. "card",
  "act" and "ordinary" — the demo's own three remaining words — have no
  slot in the shared template and are not shown.
- **Tokens needed no change.** Every value in `themes/academia/tokens.json`
  already matched the demo's literal hex table to the pixel (verified by
  converting each HSL token to hex and diffing, 2026-09-08) — measured
  before any register line was written, so X0 made no token edits.
- **Fonts and the register's own colour discipline needed no change
  either.** `fonts/families.json` already lists Cormorant Garamond and
  the renamed Lora (`KP Academia Serif`) for this theme, both subsetted
  on disk (`fonts/cormorantgaramond/`, `fonts/lora/`) — this lift shipped
  no new font work.
