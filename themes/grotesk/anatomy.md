# grotesk — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

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

1. **One red, and it is text-safe.** `hsl(355, 95%, 45%)` — `#E30613`,
   the Swiss red — measures 4.88:1 on white and is the primary, the
   signal, the ring and the mark before every heading. On the grey card
   it is a plate; nowhere else is there a hue except where the semantic
   tokens require one.
2. **Black is the structure.** Boundaries, inputs, the accent and the
   sidebar are the ink; the grid is the ink at 5%.
3. **Twelve columns.** The texture is a single vertical hairline
   repeated every twelfth of the width — columns, not squares — which is
   the poster's grid and not light's drawing-table grid.
4. **Archivo at 800 for headings, Inter for the body.** Both
   Helvetica-class; the heading weight and the tight tracking are the
   theme.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** Black on white and on the card, 19:1.

**DI2 — the focus ring.** Red over white, the ink as the second channel.

**DI3 — states you can see.** Derived by lightness; red at 45% has room
both ways.

**DI4 — colour is never the only carrier.** Green offer against red
rejected: the first draft measured 8.6 under deuteranopia; a bluer,
more saturated green (`hsl(160, 70%, 30%)`) against a pure red at 30%
measures 21.0, with white ink on both above 4.5.

**DI5 — the flash threshold.** No animation; the red square is static.

**DI6 — light or dark.** `color-scheme: light`; paper, card and popover
are all white, and the difference between them is the hairline.

**DI7 — reduced motion.** `--fx-duration: 120ms`, nothing under the
guard.

**DI9 — theme colour stays in the token layer.** One texture, one
static mark, no register.

## What it deliberately does not do

- **No second colour.** The blue and the amber exist only as `--info`
  and `--warning` and their plates.
- **No radius.** `0rem`; the grid is right angles.
- **No off-white.** The paper is white: the Swiss poster was printed on
  white stock, and the warmth of formal and sepia is a different idea.
