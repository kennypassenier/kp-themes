# topo — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

A topographic map on kraft paper. A warm sand ground, deep forest ink, a
clay trail and a lake blue, with contour lines wandering faintly across
the background.

Where `formal` is a printed document, this is a printed _map_: the same
respect for paper, but the information is spatial and the palette comes
from outdoors.

## What is load-bearing

1. **Kraft, not cream.** `hsl(42, 32%, 95%)` is more saturated than
   formal's paper and reads as recycled stock.
2. **Forest green acts.** `hsl(158, 42%, 24%)` is the only interactive
   colour, and it is dark enough to read as ink rather than as a highlight.
3. **The contour lines.** A hand-drawn SVG pattern in the texture layer,
   at low opacity. It is the theme's signature and the only ornament.
4. **Terracotta accents.** The clay tone is warm against the green and
   never acts.

## Answers to the invariant questions

**DI1 — hairline or boundary?** A hairline at `hsl(42, 20%, 80%)`, in the
paper family. Its boundary should come from the forest family instead —
a map draws its features in ink, not in paper.

**DI3 — does this theme follow the derivation?** Yes, unmodified. Ink on
paper again.

**DI4 — palette or code?** A code, failing at 4.2. Better than formal and
pastel and still under the floor. Its palette has an advantage the others
lack: an outdoor palette has natural, well-separated hues to draw on —
water, clay, moss, stone — which are distinguishable by lightness as well
as hue.

**DI5 — animation?** None.

**DI6 — light or dark?** Light, with card and popover slightly lighter
than the ground — the only light theme whose layer ordering rises
correctly by lightness rather than by becoming white. That is the more
robust pattern and it should be preserved.

## What this theme may not do

- Let the contour lines become legible as a picture. They are terrain, not
  illustration, and they sit at low opacity for that reason.
- Use terracotta for an action.
- Lose the warmth of the ground; a neutral grey turns it into a generic
  light theme with a green accent.

## Open for L3

This is the theme with the easiest answers for the semantic colours. Lake
blue is already the natural "info", moss reads as success, and the clay
family gives a warning tone without inventing a hue. The danger colour is
already a brick `hsl(8, 62%, 40%)` that sits in the same world. Expect
this theme to be finished first and to serve as the worked example for the
others.
