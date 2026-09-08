# light — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Light is lifted
> in 5.0.0 (S48, LIFT_PLAN row 22). The concept demo Kenny approved on
> 2026-09-08 is "Plain Sight", built from a second research pass over
> loom.com, notion.so and Aardvark Book Club (measured independently of
> the first pass, per LIFT_PLAN row 22's note).

## The idea

The neutral one. Pure white, near-black text, and a confident indigo. No
character of its own by design — this is the theme you pick when you want
the content to carry everything and the interface to disappear.

That is a real design position, not an absence of one. Every other theme
here has a mood; this one is the control against which the others are
read. The demo's own laurel says it plainly: "white isn't neutral, it's a
decision" — restraint chosen on purpose, theme 22 of 25.

## What is load-bearing

1. **Pure white ground.** `hsl(0, 0%, 100%)`. The moment it warms up it
   becomes `formal`; the moment it cools it becomes a blue-grey theme with
   opinions.
2. **Indigo, not blue.** `hsl(243, 60%, 45%)` sits deliberately off the
   default browser blue. It reads as chosen rather than inherited.
3. **A cyan accent that never acts.** The pale cyan (`--accent`) is a
   highlight surface, never a second action colour; its saturated
   companion `--fx-signal` (TH115/S47's base/soft pairing) is used only
   as a decorative fill — the divider's alt circle, the laurel rule —
   never as text, because it clears the 3:1 boundary floor but not the
   4.5:1 text floor.
4. **Two radius vocabularies, not one reused everywhere.** A small
   surface radius (`--radius`, 0.5rem) for cards, inputs and the dialog;
   a full pill (`--kp-radius-pill`, 999px) for buttons and chips. The
   demo measured this as a real, independently-shipped pattern (loom.com,
   notion.so), not a house habit invented for this theme.
5. **Nothing textured, nothing looping.** No display face, no ornament,
   no background image or gradient anywhere in the register. The theme is
   defined by its restraint, so additions cost more here than anywhere.

## The register (5.0.0)

`css/light-register.css` is the theme's answer to the hook vocabulary
(S45):

- **Surface.** Quiet by inheritance from `css/themes.css`'s hero remap;
  the register adds nothing of its own beyond the ground the base layer
  already paints.
- **Reveal — headline.** A rounded clip window opens once around the
  whole headline (`clip`), eased on the demo's own measured notion.so
  curve (`--kp-ease-arrive`, `cubic-bezier(.16,1,.3,1)`). The text is
  never touched — no glyph noise, no per-word stagger, no dither — which
  none of the package's existing six headline routines do, so `clip` is a
  new one: `js/effects.js`'s `headline()` gained a branch for it,
  structured like `dissolve`'s (a transient class, one keyframe,
  `animationend` or the table's duration ends it), and
  `TIMINGS['kp-clip-reveal']` carries its row.
- **Reveal — rule.** Reuses the base layer's own `kp-rule-in` (the same
  keyframe formal, blueprint and deco already draw a heading rule with),
  at the demo's own 480ms and the arrive easing rather than `--fx-ease` —
  "prefer an existing routine" held here, because the demo's rule is the
  same scaleX draw those themes already have a keyframe for.
- **Emphasis.** Two readings of the same hook, partitioned by ancestry so
  a CSS animation (which always outranks a normal declaration regardless
  of specificity) cannot leak one look into the other. A loose mark (the
  lede) sweeps in with a highlighter's `background-size`, staggered by
  the module itself through `--kp-classified-delay` (620ms) and
  `--kp-reveal-stagger` (160ms) — the demo's own two delays, reproduced
  exactly. A mark inside a `[data-kp-reveal='emphasis']` container (the
  dossier) is a different mechanism entirely: an opaque bar in
  `--foreground` that clears to `--accent` on the trigger, the demo's own
  `.kp-redaction` translated onto `<mark>` so the package's built-in
  trigger wiring can drive it; its three-mark, 140ms stagger is
  reproduced as a CSS `transition-delay` per `nth-of-type` rather than
  the demo's three `setTimeout`s, because the module's `wireTrigger`
  toggles every mark's class in the same tick — same visible result, one
  clock instead of three (the same technique retro already uses for its
  own redaction brush).
- **Divider.** A hairline seam, not a tear — the demo's own words for it.
  A 1px `--border` line with a small circle resting on it; the alt
  divider tints the circle with the accent/signal pair, the one place in
  this theme that saturated companion is used at all.
- **Accent.** Quiet, inherited from the default row ("no accent beyond
  the heading's own type"): the register adds `font-weight: 600` and
  `letter-spacing: -0.01em` to every heading directly, matching the
  demo's own reset, rather than through a separate accent mechanism.
- **Arrival.** Quiet. The demo has no boot sequence; the page is simply
  there.

Buttons and the icon button are pills (`--kp-radius-pill`); every other
surface keeps the base layer's small radius. Elevation is answered once,
for every panel that floats over the page (popover, menu, toast,
tooltip, the datepicker/combobox/palette panels, the theme menu, the
dialog): the demo's own three shadow steps, each a relative colour of
`--foreground` (DI9) at the demo's own measured alpha — necessary because
`--card` and `--popover` are both pure white (DI6), so the base layer's
border-only treatment leaves them looking like a page with no surfaces at
all. The nav dropdown carries its own rule (KT14). One answer per
component root (56 of 64, the eight helpers excused).

**What the demo showed and the package now renders exactly (S49,
2026-09-08).**

- **Every token, exactly.** The demo's header comment gives sixteen hex
  values converted from `themes/light/tokens.json`'s own HSL; all sixteen
  were independently recomputed (HSL → hex, WCAG relative luminance) and
  matched the token file exactly — no token in `themes/light/tokens.json`
  needed to change for this lift, and none did.
- **The clip-path mechanism, exactly**, including the demo's own
  discovery that a `<mark>`'s background-size sweep (not clip-path) is
  the wrap-safe technique for an inline emphasis that can fragment across
  a line at 320px — the register keeps the same split the demo made
  between the headline (a block box, clip-path) and the lede's marks
  (inline, background-size).
- **The redaction bar, exactly** in its rest colour, its cleared colour,
  its 260ms duration and its 140ms stagger, translated from the demo's
  hand-rolled `setTimeout` staggering onto the package's own trigger
  wiring (`data-kp-reveal-trigger`) and `<mark>` elements rather than the
  demo's bespoke `.kp-redaction` spans and inline `<script>` — the
  demo's page is a standalone specification; the package's concept page
  is one shared markup structure every theme's register paints, and the
  built-in reveal/trigger machinery (`js/effects.js`) is how every other
  lifted theme's dossier already works. No visual difference results:
  same opaque-to-tinted transition, same stagger, same trigger button.
- **The copy is the shared page's, not yet the demo's own**, for the
  words that live in `showcase/concept-copy.mjs`: this file did not exist
  at the start of this lift (round-six had not yet built the per-theme
  copy infrastructure when this worktree started) and was pulled in only
  by merging `round-six` mid-lift. Light's full ninety-one-slot entry was
  then written from the demo verbatim (headline, lede, laurels, the
  dossier's three marks, the form copy, the spec sheet's eight labels
  `ground`/`ink`/`signal`/`label`/`fx`/`display`/`body`/`mono` — the
  demo's own words exactly), so the generated page now carries light's
  own voice rather than cyberpunk's placeholder copy. `dossierPara2` and
  `stampLabelOpen` have no literal equivalent in the demo (its dossier
  carries one paragraph and its stamp never swaps its label under this
  theme, since the demo predates the label-swap mechanism other themes
  later added) and are written in the demo's own restrained voice rather
  than taken from it — an invented slot, named here as such.
- **The mark's exact 620/780ms lede timing** is reproduced through
  `--kp-classified-delay`/`--kp-reveal-stagger` on the theme root rather
  than through the demo's own `animation-delay` literals on
  `:nth-of-type(1)`/`(2)`, because the package's `looseMarks()` already
  staggers marks that way generically; retuning the shared knobs to the
  demo's own numbers reproduces its exact timing without a bespoke
  per-nth-of-type rule.
- **The button hover lift** is 2px (the shared `--fx-lift` token every
  theme reads) rather than the demo's own 1px `translateY`. `--fx-lift`
  is a cross-theme token this lift did not touch — retuning it for a 1px
  cosmetic difference would move every other theme's hover by the same
  amount, well outside a single-theme lift's scope. Reported, not
  corrected (S42).
- **The dialog backdrop** stays the base layer's `rgb(0 0 0 / 0.5)`
  (`css/components.css`, deliberately not a token: "a backdrop is a
  dimming of whatever is behind it") rather than the demo's own
  `rgba(23, 27, 38, 0.35)`. The base rule is a cross-theme convention, not
  a light-specific choice, and the visual difference (a slightly darker,
  slightly less blue dim) is minor; reported, not corrected.

## Answers to the invariant questions

**DI1 — hairline or boundary?** Both exist and are distinct, and the
gap the previous anatomy flagged is closed: `--border`
(`hsl(220, 13%, 88%)`, 1.34 against the page) stays the ungated hairline
for region dividers and card edges, never a control boundary;
`--border-strong`/`--input` (`hsl(220, 10%, 57%)`) is the boundary DI1
measures, clearing 3.30 against the page — comfortably over the 3:1
floor.

**DI2 — the focus ring.** The base layer's two-part indicator (an
`outline` in `--focus-ring-contrast`, a `box-shadow` ring in
`--focus-ring`) already reproduces the demo's own two-ring design
exactly: `--focus-ring` is `--foreground` and `--focus-ring-contrast` is
`--background` for this theme, so no override was needed in the
register.

**DI3 — does this theme follow the derivation?** Yes, unmodified. This
is the theme the derivation should be tuned against: if a step looks
right here, it is the baseline the others deviate from.

**DI4 — palette or code?** A code. Not remeasured in this lift (out of
scope for a register-only change); the previous anatomy's open question
about the seven-stage lightness ladder stands.

**DI5 — animation?** Two one-shot keyframes (the headline's clip reveal,
the lede mark's colour sweep) plus one reused one (the rule's scaleX
draw); the dossier's redaction is a plain CSS transition, not a
keyframe. Nothing loops, nothing repeats automatically, and every
opposing change is rated well under the three-per-second threshold
(`reports/di5.md`: `kp-clip-reveal` at 1.00/s, `kp-mark-sweep` at 0.00/s
since colour is not the property the gate rates for it).

**DI6 — light or dark?** Light. Card and popover are both pure white,
which the register now answers directly rather than leaving flat: the
demo's own three shadow steps give every floating panel its elevation
from the border and the shadow, since there is no lighter value left to
raise it with.

**DI7 — reduced motion.** Every animation and transition the register
adds lives inside `@media (prefers-reduced-motion: no-preference)`; at
rest the headline already stands unclipped, every mark already stands
filled (or, in the dossier, cleared once the trigger is pressed), the
rule already fully drawn.

**DI9 — theme colour stays in the token layer.** Every colour in the
register is `var(--token)` or a relative colour of one
(`hsl(from var(--foreground) h s l / 0.06)` for the three shadow steps);
nothing is named, and no hex or named colour appears anywhere in the
file.

## What this theme may not do

- Acquire a mood. Any texture, display face or second accent belongs in a
  different theme.
- Use the browser's default link blue, which would undo the one
  deliberate colour choice it makes.
- Loop or repeat any animation automatically. Every reveal in this
  register plays once.
- Use `--fx-signal` as text. It clears the boundary floor, not the text
  floor.

## Open for L3

Success, warning and info have the most straightforward answer here —
conventional, saturated, legible on white. This theme is where those get
decided first, and the others adapt from it. DI4's seven-stage lightness
ladder (opened by the previous anatomy at a measured distance of 1.7) was
not remeasured by this lift and stays open.
