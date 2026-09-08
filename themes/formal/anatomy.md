# formal — anatomy

> What makes this theme this theme, and how it answers the questions
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md) puts to every
> theme. Written channel-neutrally: it describes character and rules, not
> CSS, so a TUI or GUI could build the same theme without reading a
> stylesheet. Formal is lifted in round six (S48, LIFT_PLAN row 16); the
> concept demo Kenny approved on 2026-09-08 is "Fair Copy"
> (scratchpad/formal-demo.html).

## The idea

Paper and ink. A warm off-white ground the colour of good stock
(`hsl(40, 25%, 97%)` — never pure white, which reads as a screen rather
than a page), near-black text with a blue cast, and a single navy that
carries every interactive thing. Bronze is the second voice, used for
emphasis rather than for actions, and gold is the signal — wet ink,
never a control.

The reference is editorial print: a serious document that expects to be
read at length. Fraunces on the headings is the whole typographic
gesture — everything else is the system face. Formal is the theme that
stays still while the others move: restraint is its expression, not an
absence of one. It commits to a line once and does not glitch into it.

## What is load-bearing

1. **The ground is warm and off-white.** Move it to pure white and the
   theme becomes `light`. That single value is the difference.
2. **One colour acts.** Navy is the only hue that means "you can do
   something here". Bronze never becomes a button.
3. **No ornament.** No glow, no texture you can see, no rounded
   flourishes. The token radius (0.375rem) is the largest concession.
4. **Contrast is generous, not maximal.** Ink on paper measures 15.73:1,
   comfortably above the floor, because reading is the point.
5. **Motion commits, it does not perform.** Where round six gives the
   theme a reveal, the reveal is a single, whole-hearted change — a
   fade, a rise, a rule that draws once — never a glitch, a decipher or
   a loop. A demo that opens with noise would be the wrong demo for this
   theme.

## The register (5.0.0)

`css/formal-register.css` is the theme's answer to the hook vocabulary
(S45), measured against the approved demo:

- **Surface.** The hero and the app share the one paper ground
  (`--background` = `--surface-hero-bg`); the card is a lighter, brighter
  stock laid on the page, and the dossier's muted stock is darker still
  — three tints of the same paper, per the demo's own comment ("three
  stocks of the same paper").
- **Reveal — headline.** A new routine, `arrive`: the headline is whole
  and untouched — no character is ever replaced — and fades up with a
  small rise (opacity 0→1, 6px→0, 450ms), once. `js/effects.js` gained
  this branch because none of the existing routines (`decipher`,
  `tracking`, `shout`/`slam`, `dissolve`, `type`) leave the text alone;
  every one of them either types, glitches or dissolves it, which is
  exactly the "performance" this theme refuses.
- **Reveal — emphasis.** `wash`: the lede's two marks fill in from an
  ink-gradient wash, staggered 90ms after a 1.05s delay — the demo's own
  timing, carried into `--kp-classified-delay` and `--kp-reveal-stagger`.
  The dossier's three marks answer the same hook differently (see
  "cards" below), which the hook vocabulary allows: one hook, more than
  one register-side treatment for more than one surface.
- **Reveal — rule.** `draw`: the section heading's rule draws itself in,
  full width, when it scrolls into view — the built-in IntersectionObserver
  mechanism of the "rule" hook, unmodified.
- **Divider.** A docket cut, not a tear: a hairline the width of the
  page and a short 4px navy tick — "the kind a printed ledger uses to
  mark a section closed", per the demo's own comment. The second divider
  (before the footer) is a plain dashed rule, quieter still.
- **Accent.** The display face at its highest optical size (144) with
  tightened tracking, on every heading inside a surface.
- **Arrival.** None. The demo boots with nothing; anatomy.md already
  answered DI5 "no animation" for the shipped 3.x theme, and round six
  adds three one-shot reveals on top of that baseline, not a fourth
  mechanism.

Buttons carry one static gesture, the mirror: a 2px navy-on-gold offset
shadow, a letterpress double-strike, never animated — it costs nothing
against DI5 because nothing about it changes over time. The dossier is a
`Card` with a rotated, brick-bordered stamp (`data-kp-label`) and three
redactions that clear left to right, a scale transform on a solid ink
bar, on the same trigger the hook vocabulary already wires (a second
press re-covers them).

**What the demo showed and the package now renders exactly (S49,
2026-09-08).** Kenny's rule is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding
for him rather than a quiet change. This is the first lift where that
rule was written down before the register was built, so the findings
below were caught while building rather than after:

- **The headline's per-word underline could not be carried.** The demo
  recolours an offset underline under one word ("unchanged") only,
  drawing in gold and setting to navy. The package's shared concept-page
  markup (`showcase/examples.mjs`'s `conceptBody()`) renders a theme's
  headline as one plain string with no way to mark a sub-phrase, and
  every other theme's headline depends on that being true. Giving formal
  a marked word would mean teaching `conceptBody()` a second shape, and
  `gates/gates.test.mjs`'s S49 test (`page.includes(copy.headline)`)
  asserts the headline's exact string appears unbroken in the rendered
  page for every theme — a per-word `<span>` would break that assertion
  the moment it split the string. Built instead: the headline's fade and
  rise, exactly as authored, with no underline at all. This is a finding
  for Kenny, not a silent substitution — the fix, if he wants one, is a
  small, additive change to `conceptBody()` (an optional `headlineMark`
  slot that only formal would set), not a change to this register.
- **The hover and pressed colours are close, not identical, to the
  demo's own.** The demo's `:root` declares `--navy-hover: #192843` and
  `--brick-hover: #872222` as its own literal values. DI9 forbids a
  hex colour anywhere in the register, so the mirror and primary
  buttons hover through the system's own derived `--primary-hover` /
  `--destructive-hover` (DI3's standard lightness step, which this
  theme's own anatomy already commits to following "unmodified").
  Measured: `--primary-hover` resolves to `#132749` against the demo's
  `#192843` (within a few RGB units per channel); `--destructive-hover`
  to `#8e1018` against `#872222` (a larger but still small drift). Both
  are close enough to read as the same gesture; neither is the literal
  value the demo declared, and DI9 leaves no way to be closer without a
  new named token, which the demo does not otherwise justify (S47 is a
  floor, not a licence to add a token for one button's hover).
- **The secondary and ghost button hovers are exact.** The demo's own
  `.kp-button--secondary:hover` reads `var(--line)` and
  `.kp-button--ghost:hover` reads `var(--card)` — its own local names
  for what the package already calls `--border` and `--card`. Both map
  onto existing tokens exactly, hex for hex, and the register uses them
  directly.
- **The dossier's redaction and the stamp are carried through the
  package's own mechanism, appearance kept (S49's Class B).** The demo
  builds three separate `<p>` lines with their own `.kp-redact-bar`
  spans and a "Close dossier" button that appears once revealed; the
  package's dossier is a `Card` with `data-kp-reveal="emphasis"` and a
  single trigger that toggles (a second press re-covers). The three
  redacted phrases are the demo's own three sentences, carried nearly
  verbatim as the three `<mark>`s in one flowing paragraph rather than
  three lines. The stamp text ("Draft — not for release") is exact and,
  matching the demo, never changes on reveal — `data-kp-label-open`
  repeats the same word rather than swapping it.
- **The platforms line, the laurels and two of the eight spec rows are
  invented in the demo's own voice, per the words process (A1).** The
  demo's platforms line is prose naming four consumer projects, not four
  plain labels; the four consumer names are carried verbatim into the
  four label slots. The laurels are icon-plus-value in the demo (Vol.
  VI, No. 016, MMXXVI) with no bold/caption split; the three values are
  carried verbatim as the bold lead-ins, and their captions are
  invented. The spec sheet's fifth colour (`--chart-4`, a rust the demo
  never shows) and its mono face row (the demo's own spec sheet has no
  mono swatch) are both invented; every other row is the demo's own
  word for that token. Two nav links (`Effects`, `Docs`) and the
  language dropdown's two options are invented in the package's
  standing convention, because the demo's own nav has neither a
  third/fourth link nor a language dropdown.
- **The texture is unchanged and already under the ceiling.** The
  register makes no claim on `--fx-texture`; formal's grain in
  `css/_rules.css` stays at 0.035, under DI9's 0.06 ceiling, and the
  demo does not mention a texture at all (its own header explicitly
  licenses "no visible texture").
- The old, blanket `[data-theme='formal'] h1::after, h2::after` rule in
  `css/_rules.css` (the 3.x-era "one signature per theme", predating the
  hook vocabulary) is retired: it drew a line under every heading on
  every page unconditionally, which would have doubled the hero
  headline's own reveal and drawn a rule the demo never shows under
  plain, non-surface headings elsewhere in the site. The register's
  hooked reveals replace it exactly where the demo asks for a reveal,
  and nowhere else.

## Answers to the invariant questions

**DI1 — is `--border` a hairline or a boundary?** A hairline. Formal
separates content with rules the way a printed page does, and those may
be quiet. The boundary of a control needs its own, stronger value: on
this ground it must be a low-saturation navy-grey, not a lighter paper
tint. The demo's own header makes the same distinction explicit: the
plain hairline is "never used as a control boundary, only as the quiet
content rule" — DI1 applies to control boundaries and state marks, not
to a paragraph rule.

**DI2 — the focus ring.** Two channels: an inner light gap against the
darkest surface the ring lands on (paper or card) and an outer coloured
ring. The mirror button composes its static offset shadow with the ring
rather than instead of it, in whichever order the demo stacks them
(offset shadow first, ring second).

**DI3 — does this theme follow the state derivation?** Yes, unmodified.
A lightness step is exactly how ink behaves on paper: pressing harder
makes it darker. Hover darkens the navy, pressed darkens it further —
which is also why the register reads `--primary-hover` rather than a
colour of its own for the mirror button's hover (see the S49 finding
above on the small resulting drift from the demo's own literal value).

**DI4 — are the status colours a palette or a code?** A code. Each of
the seven means one stage. Formal fails the colour-vision check today:
offer and rejected sit at a perceptual distance of 1.3 for the commonest
deficiency. They must separate in **lightness** rather than in hue,
which suits ink-on-paper anyway — a printer would have solved it the
same way.

**DI5 — does this theme ship animation?** Yes, three one-shot reveals
added in round six (the headline's fade and rise, the lede's ink wash,
the section rule's draw-in) and one static, non-animated gesture (the
mirror button's offset shadow). None of the three loops, none opposes
its own direction more than once, and none uses `@keyframes` — every one
is a plain CSS transition, so `gates/check-motion.mjs`'s TIMINGS table
has nothing to add for this theme; the guard
(`@media (prefers-reduced-motion: no-preference)`) still holds every
transition, and DI7's rest state is the demo's own finished look.

**DI6 — light or dark, and is the layer ordering deliberate?** Light,
and the ordering is deliberate: the card is a lighter, brighter stock
laid on the page ground, and the dossier's muted stock is darker than
both. In a light theme raised means lighter, which is what the values
already do.

**DI7 — reduced motion.** Every transition of the register sits inside
the no-preference guard; without it, the headline stands at its final
opacity and position, the lede's marks are already fully washed, and the
section rule is already drawn — the rest states are the demo's own
finished look, not a degraded one.

**DI9 — theme colour stays in the token layer.** The register names no
colour: the mirror button's offset shadow is `var(--fx-signal)`, the
stamp and its border are `var(--destructive)`, the dropdown's shadow is
a relative colour of `var(--foreground)`. See the S49 findings above for
the two places (`--primary-hover`, `--destructive-hover`) where this
means the register is close to, not identical with, the demo's own
literal hover values.

## What this theme may not do

- Become pure white, or pure black text. Both break the paper illusion.
- Use bronze for an action.
- Gain a visible texture beyond the 3.5% grain already licensed — it
  must be felt, not seen, and formal is where that rule matters most.
- Use a serif for body text. The display face is for headings only.
- Manipulate the headline's characters. Every other headline routine in
  the package types, glitches or dissolves; this theme's headline is
  whole from the first frame to the last, which is its own answer to
  "does this theme perform its reveals or commit to them".
- Loop a reveal, or bring back the blanket per-heading rule this lift
  retired from `css/_rules.css`.
