# nishiki — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Ukiyo-e, the polychrome woodblock print: unbleached washi for the
ground, Prussian blue — _bero-ai_, the imported pigment Hokusai's wave
is printed in — for the water, safflower red for the seal, and the
black key-block line that gives every shape its edge. A non-Western
print tradition, the first in the set, and a flat, outlined, graphic
one: nothing soft, nothing organic.

## What is load-bearing

1. **The key-block line.** `--border-strong` and `--input` are the ink
   itself, `hsl(36, 10%, 10%)`. In a woodblock print the black block is
   printed first and every colour sits inside its lines; here every
   control has the same edge, and DI1 is free instead of hard.
2. **Prussian blue acts, beni marks.** `--primary` at `hsl(215, 51%, 25%)`
   measures 10.01:1 on washi; `--accent` and the signal are beni red
   `hsl(1, 58%, 46%)` at 5.18:1, used as a plate with washi ink and as
   the hanko seal after a heading.
3. **Washi, not white.** The ground is `hsl(42, 52%, 92%)`, the card a
   step lighter, the popover lighter still (DI6 read the other way: the
   paper gets whiter as it rises).
4. **Shippori Mincho for headings, Zen Kaku Gothic New for the body.**
   Both carry Latin well and both are drawn for Japanese; the Mincho's
   contrast is the brush, the Gothic is the print shop.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** Ink on washi is 15:1 and the same ink is
the boundary on every surface.

**DI2 — the focus ring.** Prussian blue over washi, the ink as the
second channel.

**DI3 — states you can see.** Derived by lightness. Prussian at 25%
steps lighter on hover and active; washi buttons step darker.

**DI4 — colour is never the only carrier.** The one place the print
palette fought the gate: moss green (offer) against beni (rejected) is
the classic deuteranopia pair, and the first three drafts measured 6.3,
7.5 and 6.4 apart against a floor of 12 — and the depth of the red
did not help, because a red plate carrying washi ink cannot get
lighter. So rejected is the one plate with the ink on it: a lighter
beni `hsl(3, 75%, 56%)` under black, against a deep teal offer under
washi. Lightness carries the difference before hue does, which is the
point of DI4.

**DI5 — the flash threshold.** One gesture: the hanko settles after h1
(`kp-settle`, a scale), no luminance change.

**DI6 — light or dark.** `color-scheme: light`; ground 92%, card 95%,
popover 97%.

**DI7 — reduced motion.** `--fx-duration: 180ms`; the seal sits under
the guard.

**DI9 — theme colour stays in the token layer.** One texture — washi
fibre, a stretched turbulence at 4.5% — and one flourish.

## What it deliberately does not do

- **No gradient, no shadow.** A print has none; the key line does the
  work a shadow does elsewhere.
- **No sage or terracotta.** The earth palette belongs to topo; this
  theme is pigment on paper, not landscape.
- **No pastel reading.** Beni and Prussian are strong; a softened
  version would be pastel with a different font.
