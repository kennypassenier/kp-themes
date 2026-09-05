# shade-dark — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

The dark half of the shade pair: the same Solarized scheme with the
lightness steps mirrored, so switching between the two halves changes
the ground and keeps the accents. Medium contrast on a deep blue-black,
for reading at night without the glare of white text. See
[shade-light](../shade-light/anatomy.md) for the idea the pair shares;
this document records only what the dark half does differently.

## What is load-bearing

1. **The ground is base03, the text is lifted.** `hsl(192, 100%, 11%)`
   is Solarized's own; the canonical text colour base0 measured 4.28:1
   on the card and was lifted to `hsl(186, 8%, 64%)`, which reads at
   4.5 on every surface and still stops far short of white.
2. **Accents lighter than the light half's.** Blue at 60% instead of
   38%, magenta at 58%, red at 66%: the same hues, mirrored across the
   middle, so a plate reads at the same contrast on either ground.
3. **The layers rise.** Ground 11%, card 14%, popover 17% — deliberate,
   where the light half's card goes the other way.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 50% grey on all three surfaces; base01
at 40% failed the popover at 2.71 and was lifted.

**DI2 — the focus ring.** A light blue at 68% — lifted above the
primary so it reaches 3:1 on the olive and ochre plates, where 60%
measured 2.64.

**DI3 — states you can see.** Derived by lightness towards light; the
dark button took a lighter ink for the same reason the light half's
took a darker one.

**DI4 — colour is never the only carrier.** As the light half.

**DI5 — the flash threshold.** No animation.

**DI6 — light or dark.** `color-scheme: dark`.

**DI7 — reduced motion.** `--fx-duration: 180ms`, nothing under the
guard.

**DI9 — theme colour stays in the token layer.** No texture, no
flourish.

## What it deliberately does not do

- **No white text.** 64% lightness is the ceiling for body text; only
  plates carry a near-white ink.
- **No starfield, no grain.** Dark owns the first; this half owns
  nothing but its contrast.
