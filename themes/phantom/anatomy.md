# phantom — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

The playful dark theme the set lacked. Black, white and one violent
red, cut-paper shapes, a halftone screen, condensed italic headings in
capitals — the menus of Persona 5, which are the most imitated game UI
of the last decade. Energy without any light emission: cyberpunk glows,
this is print.

## What is load-bearing

1. **Three colours, and the red is a plate.** Red at `#E60012` on black
   measures 4.12:1, under the text floor, so the red is never a word: it
   is `--primary` with black ink, lifted to `hsl(355, 100%, 58%)` so the
   black reads on it, and it is the sidebar, the signal and the
   destructive plate. White text on red is 3.3:1 and is not used.
2. **White is the second plate.** `--accent` is a light grey plate with
   black ink — 86% rather than 98%, because a derived active state has
   to be visibly different and white has nowhere to go. Offer is the one
   pure-white plate; rejected is the one red one; they could not be
   further apart on any axis.
3. **The sidebar is red.** The only theme whose sidebar is a loud
   colour: white text on `hsl(355, 100%, 45%)` at 4.6:1, the ring in
   white.
4. **Barlow Condensed, 800, italic, uppercase** for the headings, Barlow
   for the body. The heading treatment is the theme; a regular heading
   would make this a dark grey theme with a red button.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 60% grey on black, card and popover.

**DI2 — the focus ring.** Red over black, white as the second channel.

**DI3 — states you can see.** Derived by lightness. Red at 58% steps
both ways; the light plate at 86% steps down.

**DI4 — colour is never the only carrier.** Black-on-white against
white-on-red for offer and rejected: lightness carries it before hue
does. Sent (90% grey) and offer (white) are close in lightness and
distinct by label, which is what the label is for.

**DI5 — the flash threshold.** One gesture: a badge slides in 6px from
the left, a transform only. Persona's real menus are violent; this
theme keeps the shapes and drops the motion.

**DI6 — light or dark.** `color-scheme: dark`; ground 4%, card 9%,
popover 13%.

**DI7 — reduced motion.** `--fx-duration: 120ms`, a sharp ease; the
slide sits under the guard.

**DI9 — theme colour stays in the token layer.** One texture — a
halftone dot screen at 5% — and one flourish. `--fx-notch: 6px` reuses
cyberpunk's clipped corner as a cut-paper edge.

## What it deliberately does not do

- **No glow, no gradient, no scanline.** Those are cyberpunk's, and the
  two themes share only the word "dark".
- **No white text on red.** 3.3:1.
- **No second hue.** The yellow of `--fx-signal` and one chart series is
  the whole exception, and it carries black ink.
