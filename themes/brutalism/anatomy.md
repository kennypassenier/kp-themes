# brutalism — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Neo-brutalism, the 2021 kind: off-white paper, boxes drawn with a 3px
black line, a hard shadow that sits exactly where the box would fall if
you let go of it, and plates in the colours of a sweet shop — yellow,
coral, lavender. Nothing is blurred, nothing is translucent, nothing
pretends to be a material. The reference is Gumroad's redesign and the
directories that grew around it, not the concrete of the 1960s.

It is the first theme in the set whose signature is a shadow. Every
other theme is flat by decision; this one is flat by exaggeration.

## What is load-bearing

1. **Black is the structure.** `--border`, `--border-strong`, `--input`,
   `--ring`, `--selected` and `--primary` are all the same ink,
   `hsl(0, 0%, 7%)`. A brutalist box has one line weight and one line
   colour; a grey hairline anywhere would be a different theme.
2. **The shadow is a knob, not a rule.** `--fx-shadow-offset: 4px` is the
   whole effect: `css/components.css` paints
   `offset offset 0 0 var(--border-strong)` on buttons, cards and inputs
   in every theme, and the other eleven answer 0px, which paints nothing.
   Measured at R0: the eleven fixtures are pixel-identical before and
   after the knob existed.
3. **Yellow is the default button, black is the primary.** The contrast
   gate holds `--primary` at 4.5:1 against the page as link text, which
   no yellow can pass on off-white — so the ink is primary (13.4:1 with
   yellow text on it) and the yellow `hsl(48, 100%, 60%)` is
   `--secondary`, the plate an ordinary button wears. That is the
   brutalist reading anyway: the loud colour is the common one.
4. **Radius 0, and a display face with weight.** Archivo Black for
   headings, uppercase with tight tracking; Space Grotesk for the body.
   A rounded corner or a light heading would soften exactly what the
   theme is for.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** Trivial: black on off-white is 18:1, and
the same black is the boundary on the card and the popover.

**DI2 — the focus ring.** The two channels are the ink and the paper.

**DI3 — states you can see.** Derived by lightness like everywhere else.
Pressed adds the theme's own gesture on top: the box moves onto its own
shadow (`translate` by the offset, shadow removed), which is an opt-in in
`css/_rules.css`, not a replacement for the colour step.

**DI4 — colour is never the only carrier.** The status plates are candy
with black ink, except `rejected`, which is the one black plate with
paper ink — so offer (green plate) and rejected (black plate) differ by
lightness before anyone looks at the hue.

**DI5 — the flash threshold.** No animation.

**DI6 — light or dark.** `color-scheme: light`. Card and popover are
pure white on off-white paper.

**DI7 — reduced motion.** `--fx-duration: 100ms`, `--fx-lift: 2px`; the
lift is under the reduced-motion guard like every theme's.

**DI9 — theme colour stays in the token layer.** One texture (a dot grid
at 6%, drawn from `--foreground`), one flourish, no register.

## What it deliberately does not do

- **No grey.** `--muted-foreground` is a dark grey for small print and
  that is the only one; dividers and disabled states are derived, not
  designed.
- **No text on yellow except black.** Yellow at 60% lightness carries
  only the ink; white on it would be 1.4:1.
- **No blur, no gradient, no transparency.** The moment the shadow
  softens, this is `light` with a shadow.
