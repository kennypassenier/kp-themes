# formal — anatomy

> **The portrait shows this theme; this text says why.** The
> [formal portrait](https://kennypassenier.github.io/kp-themes/review/research/theme-portraits/formal.html)
> is the live page, generated from `themes/formal/signature.json`: every
> colour in its role, the type, the shapes, the motion verb by verb, the
> ornaments, the voice and the recipe for a new component, each with the
> selector or token that proves it. What follows is what the portrait cannot
> show — the idea, the reasons, and how the theme answers the questions
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md) puts to every
> theme. Where the two disagree, the register and the tokens are the truth
> (scope-98).
>
> Formal was lifted in round six (S48, LIFT_PLAN row 16); the concept demo
> Kenny approved on 2026-09-08 is "Fair Copy"
> (scratchpad/formal-demo.html).

## The idea

Paper and ink. A warm off-white ground the colour of good stock
(`hsl(40, 25%, 97%)` — never pure white, which reads as a screen rather
than a page), near-black text with a blue cast, and a single navy that
carries every interactive thing. Bronze is the second voice, used for
emphasis rather than for actions, and gold is the signal — wet ink, never
a control.

The reference is editorial print: a serious document that expects to be
read at length. Fraunces on the headings is the whole typographic gesture;
everything else is set in Instrument Sans. Formal is the theme that stays
still while the others move: restraint is its expression, not an absence
of one. It commits to a line once and does not glitch into it.

## What is load-bearing

1. **The ground is warm and off-white.** Move it to pure white and the
   theme becomes `light`. That single value is the difference.
2. **One colour acts.** Navy is the only hue that means "you can do
   something here". Bronze and gold never become a button.
3. **No ornament.** No glow, no texture you can see, no flourish. Boxes
   take the token radius (0.375rem); the only rounder shapes are the ones
   that are round by nature — a status dot, a timeline marker, the chosen
   day, the switch's pill.
4. **Contrast is generous, not maximal.** Ink on paper measures 15.75:1,
   comfortably above the floor, because reading is the point.
5. **Motion commits, it does not perform.** Every reveal is a single,
   whole-hearted change — a fade, a rise, a rule that draws once — never a
   glitch, a decipher or a loop. A demo that opens with noise would be the
   wrong demo for this theme.

## Why the register does what it does

`css/formal-register.css` answers the hook vocabulary (S45); the portrait
shows each answer live. Three of them needed a reason:

- **The headline arrives whole.** `js/effects.js` gained a routine,
  `arrive`, for this theme, because none of the existing routines
  (`decipher`, `tracking`, `shout`/`slam`, `dissolve`, `type`) leave the
  text alone: every one of them types, glitches or dissolves it, which is
  exactly the performance this theme refuses.
- **A section closes like a ledger.** The divider is a docket cut, not a
  tear — "the kind a printed ledger uses to mark a section closed", per the
  demo's own comment — because paper is cut and ruled, never torn.
- **The rule doubles under the pointer** (gap-4, approved 2026-09-12). A
  formal document frames what it wants noticed twice, a thin line inside a
  thicker one, the way a certificate or a letterhead does. Formal is the
  package's default theme, so this is the quietest of the hover gestures:
  nothing moves, a second rule appears 2px inside the edge.

The hero is laid on the brighter card stock rather than the page's paper:
the tokens name the paper for the hero surface, and the register paints the
hero with the card colour, so the opening sheet sits on the page like the
cards do. The dossier is the darker muted stock — three stocks of the same
paper, per the demo's own comment.

## What the demo showed and what the package renders (S49, 2026-09-08)

Kenny's rule is that an approved demo is implemented exactly, and that a
test or a gate which disagrees produces a finding for him rather than a
quiet change. The findings of this lift, as recorded on 2026-09-08 and
still standing:

- **The headline's per-word underline could not be carried.** The demo
  recolours an offset underline under one word ("unchanged") only. The
  package's shared concept-page markup (`showcase/examples.mjs`'s
  `conceptBody()`) renders a theme's headline as one plain string with no
  way to mark a sub-phrase, and `gates/gates.test.mjs`'s S49 test asserts
  the headline's exact string appears unbroken in the rendered page for
  every theme. Built instead: the headline's fade and rise, with no
  underline. The fix, if Kenny wants one, is an optional `headlineMark`
  slot in `conceptBody()` that only formal would set, not a change to this
  register.
- **The hover colours are the system's, not the demo's literal ones.** The
  demo declares its own hover hexes; DI9 forbids a colour in the register,
  so the primary and destructive buttons hover through the derived
  `--primary-hover` and `--destructive-hover` (measured at the lift: within
  a few RGB units of the demo's navy, a little further from its brick).
  The secondary and ghost hovers map onto existing tokens exactly
  (`--border` and `--card`).
- **The dossier is the package's mechanism with the demo's appearance.**
  The demo builds three separate lines with their own redaction spans and a
  close button; the package's dossier is a `Card` with
  `data-kp-reveal="emphasis"` and one trigger that toggles. The redactions
  have since become a background on each phrase, cloned onto every line it
  takes (fix-33, scope-93), so a phrase that wraps is covered line by line.
  The stamp's word never changes on reveal, matching the demo.
- **Invented in the demo's voice:** two nav links, the language dropdown's
  options, the laurels' captions, and the spec sheet's fifth colour and
  mono row, none of which the demo had.

The old blanket `[data-theme='formal'] h1::after, h2::after` rule in
`css/_rules.css` was retired with the lift: it drew a line under every
heading unconditionally, and its `kp-rule-in` keyframe outranked the
register's armed rule, so the rule painted itself drawn before the heading
was ever seen. The register's hooked reveals replace it exactly where a
reveal is asked for. The lesson recorded then: a theme whose base-layer
signature in `css/_rules.css` touches a pseudo-element the register also
uses must have that block removed in the same change.

## Answers to the invariant questions

**DI1 — is `--border` a hairline or a boundary?** A hairline (1.31:1 on
the paper). Formal separates content with rules the way a printed page
does, and those may be quiet. The boundary of a control needs its own,
stronger value: `--border-strong` and `--input` are a low-saturation
navy-grey, 3.29:1 on the paper and 3.43:1 on a card, which fields and ghost
buttons wear.

**DI2 — the focus ring.** Two channels, as the package draws them. The
mirror button composes its static gold offset shadow with the ring rather
than replacing it: the offset first, the ring second.

**DI3 — does this theme follow the state derivation?** Yes, unmodified. A
lightness step is exactly how ink behaves on paper: pressing harder makes
it darker. Hover darkens the navy, pressed darkens it further.

**DI4 — are the status colours a palette or a code?** A code. Each of the
seven means one stage, and the pair that means opposite things — offer and
rejected — separates in lightness as well as hue, which suits ink on paper:
a printer would have solved it the same way. `gates/check-invariants.mjs`
finds the pair above its floor.

**DI5 — does this theme ship animation?** Yes: one-shot transitions only.
The register has no `@keyframes` at all, so `gates/check-motion.mjs`'s
TIMINGS table has nothing to add for this theme. Nothing loops, and nothing
opposes its own direction.

**DI6 — light or dark, and is the layer ordering deliberate?** Light, and
deliberate: the card is a lighter, brighter stock (99 %) laid on the page
ground (97 %), and the dossier's muted stock (91 %) is darker than both. In
a light theme raised means lighter, which is what the values do.

**DI7 — reduced motion.** Every transition of the register sits inside the
no-preference guard; without it the headline stands at its final opacity
and position, the marks stand washed, the rule stands drawn and the second
rule of a hovered button appears at once. The rest states are the demo's
own finished look, not a degraded one.

**DI9 — theme colour stays in the token layer.** The register names no
colour: the mirror's offset is `var(--fx-signal)`, the stamp and its frame
are `var(--destructive)`, the dropdown's shadow is a relative colour of
`var(--foreground)`. The grain in `css/_rules.css` stays at 0.035, under
DI9's 0.06 ceiling.

## What this theme may not do

- Become pure white, or pure black text. Both break the paper illusion.
- Use bronze or gold for an action.
- Gain a visible texture beyond the 3.5 % grain already licensed — it must
  be felt, not seen, and formal is where that rule matters most.
- Use a serif for body text. The display face is for headings only.
- Manipulate the headline's characters. This theme's headline is whole
  from the first frame to the last, which is its own answer to "does this
  theme perform its reveals or commit to them".
- Loop a reveal, glitch, flicker, or bring back the blanket per-heading
  rule the lift retired from `css/_rules.css`.
