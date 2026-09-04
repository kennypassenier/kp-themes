# solstice — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Warm dark. Charcoal with amber and rust, for the reader who finds dark
too clinical and cyberpunk too loud. Both existing dark themes are cool —
one indigo, one magenta-on-violet — and neither is restful.

The reference is firelight rather than screenlight: the low sun of the
name, not a neon sign.

## What is load-bearing

1. **The ground is warm charcoal, not black.** `hsl(20, 14%, 10%)` — a
   trace of red in the dark. Take the hue out and it becomes dark's
   neutral cousin, which the set already has.
2. **Amber leads, rust supports.** `--primary` at 28° and `--accent` at
   12°, close enough to be one family and far enough apart to tell which
   is which. This is the only theme whose primary and accent are
   neighbours on the wheel.
3. **A serif for display.** Shared with sepia, and for the same reason:
   warmth reads better with a little contrast in the letterforms.
4. **`--radius: 0.625rem`.** The softest in the set. Sharp corners fight
   the warmth; this theme is the one place where roundness is doing work.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are a warm
grey at 55% lightness, clearing the floor on all three surfaces.

**DI2 — the focus ring.** Warm off-white over charcoal.

**DI3 — states you can see.** Lightness alone reaches the floor. Amber at
58% has room above it, unlike neon.

**DI4 — colour is never the only carrier.** The worst case in the whole
set: the first draft had offer and rejection **2.9** apart under
deuteranopia, because a warm green and a warm red on a warm ground
collapse into the same muddy tone. Solved to 23.6 by pushing offer to a
deeper true green and rejection to a deeper red. Everything else leans on
the label.

**DI5 — the flash threshold.** No animation.

**DI6 — light or dark.** `color-scheme: dark`, surfaces rising from 10%
to 17%.

**DI7 — reduced motion.** `--fx-duration: 240ms`, the slowest of all
eleven. Warmth is unhurried; this theme should never feel snappy.

**DI9 — theme colour stays in the token layer.** No texture, no register.

## What it deliberately does not do

- **No orange-on-black terminal look.** The amber is a light source, not
  a phosphor. Terminal owns the glowing-monospace idea and this theme
  stays out of it — hence the serif display face and the soft corners.
- **No cool accent for contrast.** A single teal would make the palette
  "designed"; the discipline is that every hue stays between 0° and 45°,
  except the three chart series that cannot.
- **No gradients.** Firelight suggests them and they would cost contrast
  on every surface that carries text.
