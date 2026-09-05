# shade-light — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Reading a book in the shade, not in the sun. The only theme in the set
built on medium contrast: warm off-white paper and a blue-grey ink
that stops well short of black, so a long text is restful rather than
sharp. Derived from Solarized, whose sixteen values were designed for
exactly this, and shipped as a pair — `shade-light` and `shade-dark`
share one scheme with the lightness steps mirrored.

## What is load-bearing

1. **The ink is base01, not base00.** Solarized's own light-mode text
   colour `#657b83` measures 4.13:1 on `#fdf6e3` and fails AA; the
   darker `#586e75` — `hsl(194, 14%, 40%)` — measures 4.99:1 and is the
   text. That is the whole meaning of "medium contrast" here: as low as
   AA allows, and not lower.
2. **Accents are plates, never words.** Solarized's blue, cyan, yellow,
   magenta and red were drawn for syntax highlighting, where 3:1 is
   normal. As text they fail, so each is deepened where it carries text
   (`--primary` blue at 38% instead of 49%) and otherwise used as a
   plate with paper ink.
3. **The card is lighter than the paper.** Solarized puts base2 below
   base3; the DI6 gate, which holds a raised surface above the one
   below it in every theme, sent the card the other way. The base2
   value survives as `--secondary` and the borders.
4. **Source Serif 4 for headings, Source Sans 3 for the body**, the
   pair Adobe drew to sit together — this is a text theme and its type
   should say so.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 48% grey on paper, card and popover;
Solarized's base1 at 60% failed the card at 2.78 and was deepened.

**DI2 — the focus ring.** Deep blue over paper, the ink as the second
channel.

**DI3 — states you can see.** Derived by lightness; the beige button
took a darker ink than the page text, because its active state
measured 3.0 with base01 on it.

**DI4 — colour is never the only carrier.** Olive-green offer against
red rejected clear the deuteranopia floor at these depths; every plate
carries paper ink and a label.

**DI5 — the flash threshold.** No animation.

**DI6 — light or dark.** `color-scheme: light`; ground 94%, card 97%,
popover 99%.

**DI7 — reduced motion.** `--fx-duration: 180ms`, nothing under the
guard.

**DI9 — theme colour stays in the token layer.** No texture, no
flourish, in either half: the medium contrast is the character, and
anything drawn on it would be the first thing anyone saw.

## What it deliberately does not do

- **No black.** The darkest text is 40% lightness; the darkest value
  anywhere is the sidebar, which wears the dark half's ground.
- **No warm accent.** The scheme's warmth is in the paper; every accent
  is cool or primary.
- **No texture.** See DI9.
