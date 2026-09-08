# nostromo — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Nostromo is a
> lift in 5.0.0 (S48, LIFT_PLAN nostromo row). The concept demo Kenny
> approved on 2026-09-08 is "Beige Freight"; every mechanism below is
> measured against it, per S49.

## The idea

Cassette futurism: the beige plastic of 1979 hardware — warm-grey
panels, orange indicator LEDs, label tape, vent slots. The case, not the
screen; the screen inside this case is `terminal`. Named for the ship
whose corridors defined the look. A medium-light theme, the second on
the dusk axis with shade.

## What is load-bearing

1. **The ground is moulded plastic.** `hsl(38, 28%, 78%)` — beige with
   the yellow of thirty years — and the card and popover are the same
   plastic lighter, the way a panel catches light.
2. **Ink acts, orange indicates.** `--primary` is the ink at 17%
   lightness (not 15%: the visited-link derivation reached 11.7 from a
   15% ink and 12.5 from 17%). The LED orange `hsl(22, 87%, 55%)` is the
   sidebar's primary and the indicator dot; it measures 1.6:1 on the
   beige and is never text there. The deeper orange at 38% is the
   signal and the selected mark, above 3:1 on the ground.
3. **The LED is lit by shape as well as colour.** The current page in
   a nav carries a filled dot the others do not have — DI4 applied to
   the theme's own flourish.
4. **Michroma for headings, Titillium Web for the body.** Michroma is
   the Eurostile of the case labels; Titillium is the sci-fi UI face
   that is not cyberpunk's Chakra Petch, chosen so the two themes share
   no letter. Both are shipped already (see "Fonts" below).
5. **The mono is a system stack, on purpose.** "Label tape" — the
   tracked, uppercase mono set on every button, microlabel and platform
   tag — is `--theme-font-mono`'s default system stack, five names
   deep starting with `ui-monospace`, not a bespoke face. A Dymo tape
   used whatever wheel was in the gun; this theme ships no display-mono
   face for the same reason.

## The register (5.0.0)

`css/nostromo-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured against "Beige Freight":

- **Surface.** The hero and app surfaces both stand on the plain beige
  ground, felt through the vent-slot texture (a 1px vertical rib every
  6px at 5%, `css/_rules.css`) rather than a surface colour shift; the
  side note is a vertical status strip in the margin, the laurels are
  moulded plates in a row, and the spec sheet is a nameplate grid —
  every swatch and font sample a fixed 3∶2 (or 3∶1 for type) plate,
  riveted rather than reflowed.
- **Emphasis (`stamp`).** A `<mark>` outside a dossier is a highlighted
  phrase, ink on transparent with a signal-orange underline (the same
  rule as the demo's `.kp-lede mark`) — this is the theme's _base_
  answer, and it never redacts. Inside a dossier card — a
  `[data-kp-reveal='emphasis']` container — the marks are moulded over
  in ink until a trigger is pressed, then clear together, staggered
  90ms apart by the
  register's own `transition-delay` on `:nth-of-type` — the way label
  tape peels, one motion, not a flicker. The card's own stamp
  (`data-kp-label`, read through `attr()` so the word is data, not copy
  in the register, KT5) pops down 120ms after the headline.
- **Reveal (`popdown`).** The headline and the dossier stamp share one
  mechanism: a clip-path sweeping open top-down under an opacity fade,
  340ms, once, on load. This is a **new routine** — see "The effects
  module" below — because every existing headline routine touches the
  text (splits it into glyphs, words or characters); this one never
  does. The section rule under `data-kp-reveal="rule"` reuses the
  package's existing `kp-rule-in` keyframe (a scaleX underline, already
  used by four other themes at their own durations) at the demo's own
  280ms with a 60ms delay, gated the same way every sibling theme gates
  it — on `.is-in`, once the heading scrolls into view — rather than
  the demo's own unconditional-on-load timing; see the finding below.
- **Divider.** A row of vent-texture dots between sections — a
  perforated seam, not a razor tear (that vocabulary is cyberpunk's).
  The alt divider (before the footer) darkens to the sidebar's own
  plate.
- **Accent.** Michroma at 400 weight, 0.01em tracking, sentence case —
  the demo's own correction of the pre-lift placeholder, which had
  uppercase heading text (see "What the demo showed" below).
- **No arrival.** The demo boots into its content directly, like
  cyberpunk; `--kp-arrival` is left undeclared.

Every hover is a lightness step (DI3's derivation, not an opt-out); the
buttons and every tracked label are "label tape" — uppercase mono,
0.12–0.18em tracking; the dropdown is a dark control-strip panel, one
boundary in the sidebar's own accent, KT14 answered; the checkbox, the
progress bar and the skeleton are moulded plates; the focus ring is ink
on beige (dark plate: sidebar ink on sidebar beige), two channels always.
One answer per component root (56 of 64, the eight helpers excused).

## The effects module

`js/effects.js` gained one routine: **`popdown`**, for the headline
property `--kp-reveal-headline`. Every existing headline routine
(`decipher`, `tracking`, `shout`/`slam`, `dissolve`, `type`) replaces
or rebuilds the element's
text content; the demo's own headline never does — the words are whole
from the first paint, and only a clip-path and an opacity fade move. The
new routine (modelled on `dissolve`'s shape, which also never touches
text) toggles `is-popping`, waits for the `kp-popdown` keyframe or its
table duration, and rests. Its `TIMINGS` row: 340ms, one cycle, opacity
0 → 1. The dossier stamp reuses the same keyframe purely in CSS (a
`::before` pseudo-element, which JS can never select) at a 120ms delay.
No new routine was needed for `--kp-reveal-emphasis` (`stamp`) or
`--kp-reveal-rule`: the emphasis dispatch in `js/effects.js` is already
routine-name-agnostic when a trigger element is present (it only checks
_whether_ a trigger exists, never _which_ word names the routine), and
the rule dispatch is unconditionally IntersectionObserver-driven for any
non-empty routine name — both are exactly the demo's own dossier-trigger
and section-rule mechanics with no code change required. A second new
`TIMINGS` row, `kp-dialog-in` (160ms, opacity 0 → 1), covers the confirm
dialog's own open transition, which the demo also carries — this is not
part of the S45 hook vocabulary (no routine, no root property), an
ordinary component animation the way `kp-settle` or `kp-ember` are for
other themes.

**What the demo showed and the package now renders exactly (S49,
2026-09-08).** Kenny's rule of 2026-09-08 is that an approved demo is
implemented exactly, and that a test or a gate which disagrees produces a
finding for him rather than a quiet change.

- The page is the demo's own words at `examples/concept-nostromo.html`;
  the palette, both fonts, the button "label tape" treatment, the
  spec-sheet plates, the dossier stamp and redaction mechanics, the
  dialog and the footer are the demo's measured values, read from tokens
  rather than the demo's literal hex (the token values already matched
  to within rounding — see "Tokens" below).
- The vent texture's direction was corrected to match the demo (a
  vertical rib, 90deg) from the horizontal band the pre-lift placeholder
  in `css/_rules.css` carried; the opacity (0.05) already matched.
- The heading treatment was corrected to match the demo (sentence case,
  0.01em tracking) from the pre-lift placeholder's uppercase, 0.08em
  tracking; the old rule is retired in `css/_rules.css` with a comment
  rather than left to contradict what the register now paints.
- **Still as the package renders it, not as the raw demo file did:** the
  demo's standalone HTML plays the headline and rule reveals
  unconditionally the instant `data-kp-effects` is present in the markup
  (it has no scroll-linked behaviour to preserve — the file is a single
  short page). The package's shared `rule()` dispatch in `js/effects.js`
  is IntersectionObserver-gated for every theme that declares a rule
  routine, with no per-theme override point; nostromo's rule reveal is
  gated the same way (`.is-in`, threshold 0.5) rather than firing purely
  off `[data-kp-effects]`. The headline is unaffected — no headline
  routine is scroll-gated in the shared module, so it fires at load
  exactly as the demo does. This is a **finding**: the visual is
  identical when the rule is above the fold (as it is in the generated
  concept page and the spec's tests), and every other lifted theme
  shares the same `.is-in` gating, so this keeps the architecture
  consistent rather than adding a per-theme exception to shared code for
  a difference invisible in the approved demo's own page.
- The page-wide texture layer (a fixed, viewport-covering `body::after`)
  is the package's one shared mechanism for every theme's texture; the
  demo scopes its vent gradient to the hero section alone
  (`.kp-vent`). This is a **finding**, not a correction: every other
  lifted theme uses the same page-wide layer, the demo's page is short
  enough that hero and the first section fill most of a normal
  viewport, and scoping texture per-section would need new shared
  machinery no other theme has asked for.
- Michroma and Titillium Web were already fully shipped ahead of this
  lift (plan, files and `@font-face` rules all present) — see "Fonts"
  below. No finding here.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A warm grey at 42% lightness
(`--border-strong`) on the beige measures 3.23, on the card 3.63, on
the popover 4.06 — all clear the 3:1 floor DI1 sets for non-text
boundaries.

**DI2 — the focus ring.** Ink over beige for the app surface (fg
`#2b2522` vs bg `#d7cbb7`, 9.43 — both channels clear 4.5 on their own,
so whichever a background flips under, the other still carries it), and
the dark plate's own ink-over-plate pair for the sidebar/footer context
— two channels, always.

**DI3 — states you can see.** Derived by lightness, the package's
default step (no opt-out): hover, selected and active each move one, one
and two OKLCh lightness steps toward the ground.

**DI4 — colour is never the only carrier.** Two applications: the
success/rejected pair (`hsl(140, 40%, 30%)` vs `hsl(0, 85%, 30%)`, light
ink on both, 14.9 apart) carries meaning by lightness as well as hue; and
the current-page LED carries a filled dot no other nav item has, so a
reader who cannot see orange still sees which item is current.

**DI5 — the flash threshold.** The LED does not blink — the one thing
the reference hardware did that this theme refuses — and nothing else on
the page loops. Every reveal plays once: the headline (340ms,
clip-path+opacity), the two section rules (280ms each, scaleX, 60ms
delay, one per heading), the dossier stamp (340ms, clip-path+opacity,
120ms delay), and the three redaction marks clearing on a click
(220ms each, staggered 0/90/180ms — a single triggered burst, not a
loop, and each mark only ever transitions covered → clear, never back
without a second click resetting it). The dialog open/close is 160ms,
opacity+transform, once per open. Button and field hover/focus/press are
continuous 160ms colour transitions, interaction-triggered only. Nothing
on this page ever receives more than one luminance change per roughly
90ms in the fastest burst (the staggered redactions), which is one
change roughly every 0.09s in a cluster that resolves within 400ms of
its trigger — well inside DI5's three-per-second ceiling measured over
any rolling second, and every other mechanism is far slower. Full
inventory and the rate arithmetic: `reports/di5.md`.

**DI6 — light or dark, and is the ordering deliberate?** Light
(`color-scheme: light`), and correct: relative luminance rises
background (78%L) → card (83%L) → popover (88%L), each successive layer
lighter, matching the rule DI6 sets for a layer that should read as
floating above the one under it.

**DI7 — reduced motion.** Every keyframe and every reveal-triggering
transition in the register lives inside the guard,
`@media (prefers-reduced-motion: no-preference)`; at rest the headline
and stamp show at full opacity with no clip, the rules stand drawn, and
the dossier's marks either show
covered (never seen) or clear immediately with no transition — DI7's
"resolves to rest" rule, not "plays anyway".

**DI9 — theme colour stays in the token layer.** One texture (the vent
ribs, 0.05, under DI9's 0.06 ceiling — no per-theme ceiling override
needed) and no theme colour outside `var(--token)` or a relative colour
of one; the redaction ink, the LED glow and the backdrop tint are all
`hsl(from var(--token) h s l / …)`.

## What this theme may not do

- Use a colour outside the token contract, or bake an opacity into a hex
  literal — every alpha is a relative colour of a token.
- Show orange as body text. The LED orange is a plate or a boundary dot,
  never text — DI4's arithmetic forces this (`--accent` on the bare
  background fails even the 3:1 floor at 2.87).
- Blink the LED, or loop any element. Every reveal on this page plays
  once.
- Use brass or leather ornament. Steampunk was dropped for sitting on
  solstice; this is plastic, and plastic is matte.
- Render a screen, scanlines, phosphor or a blinking cursor. That
  vocabulary belongs to `terminal`, the monitor inside this case.
- Tear a razor edge between sections. That vocabulary belongs to
  `cyberpunk`; nostromo's seam is the vent-dot divider.

## Tokens

Every value the demo's own comment measures (section 4 of the demo
file, "CONTRAST, WCAG 2.x, COMPUTED BEFORE USE") was checked against
`themes/nostromo/tokens.json`'s existing HSL values at the lift: every
pair the demo names already matched the token's HSL-to-hex conversion
to within rounding, so no token value changed at this lift.
`check-contrast.mjs` and `check-invariants.mjs` were run after the
register and the `_rules.css` corrections landed, both green — see the
verification report.

## Fonts

Michroma and Titillium Web are the demo's two families, both OFL-1.1
with no Reserved Font Name, and both were **already shipped** ahead of
this lift: `fonts/families.json` names them for `["nostromo"]`,
`fonts/michroma/michroma-regular.woff2` and the four
`fonts/titilliumweb/*.woff2` weights are present, and `css/fonts.css`
already declares their `@font-face` rules ("named by nostromo"). X3
needed no work — `--theme-font-display` and `--theme-font-body` already
resolve to the named faces, not a system-stack fallback. The register's
own `--theme-font-mono` is deliberately the system stack per "What is
load-bearing" above, not a gap.
