# retro — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

The 1995 desktop: mid-grey chrome, a navy title bar, buttons and fields
drawn as bevels, a pixel face for the headings, and nothing that
blinks. 98.css is the reference. The OS-chrome reading, not Y2K's
candy chrome — that would collide with pastel and cyberpunk.

The style is tamed in exactly two places, both measured: the bevel
that _is_ the style measured 2.17:1 in the original and cannot be the
boundary DI1 asks for, and the dotted focus rectangle is forbidden by
DI2. So the boundary is a gated 38% grey and the bevel sits inside it
(`css/retro-register.css`), and the focus ring is the system's.

## What is load-bearing

1. **The chrome is 75%, not the original's 75% either.** `hsl(0, 0%, 75%)`
   is the classic surface; the card at 84% and the popover at 90% are
   the "button face" and the "window" of the original, ordered so a
   raised surface is lighter (DI6 read for a light theme).
2. **Navy acts, teal signals.** `--primary` is the title-bar navy
   `hsl(240, 100%, 25%)` — 8.8:1 on the chrome — and the sidebar is
   navy too, with white text. Teal `hsl(180, 100%, 20%)` is the accent
   and the signal: the desktop colour, deepened until it clears 3:1 on
   the chrome (25% measured 2.62 as a chart series).
3. **The register carries the bevel.** `css/retro-register.css` paints
   the raised and sunken edges as inset shadows in the theme's own
   tokens — popover as highlight, foreground as the deep edge, border as
   the mid edge — on buttons, cards, popovers and fields, and inverts
   them on press. Scoped to `[data-theme='retro']`, inert elsewhere,
   loaded by the showcase and the fixtures. A browser test holds the
   painted boundary at 3:1 with the register on.
4. **No motion.** `--fx-duration: 0ms`: the original snapped, and so
   does this. Pixelify Sans on headings only; the body is Instrument
   Sans, because pixel body text under 16px is the readability risk
   every retro guide names.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 38% grey on the chrome (3.3), the card
and the popover; the bevel is decoration inside it.

**DI2 — the focus ring.** Navy over chrome, the ink as the second
channel. No dotted rectangle.

**DI3 — states you can see.** Derived by lightness; the register adds
the inverted bevel on top, an opt-in, not a replacement.

**DI4 — colour is never the only carrier.** Green offer against red
rejected: 22.3 apart under deuteranopia with green at 26% and red at
24%, measured before the tokens were written.

**DI5 — the flash threshold.** Nothing animates.

**DI6 — light or dark.** `color-scheme: light`; chrome 75%, card 84%,
popover 90%.

**DI7 — reduced motion.** Nothing to reduce.

**DI9 — theme colour stays in the token layer.** One texture — a
two-pixel checkerboard at 4%, the dither every gradient was — and the
title bar behind h1, which reads tokens. The register reads tokens
only; `gates/check-layers.mjs` holds it there.

## What it deliberately does not do

- **No Y2K.** No chrome gradient, no iridescence, no candy.
- **No pixel body text.** Headings only.
- **No blink, no marquee, no hit counter.** The original had them; the
  flash threshold and taste both say no.
