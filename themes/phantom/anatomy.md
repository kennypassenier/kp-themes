# phantom — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Phantom is the
> second theme lifted in 5.0.0 (S48, LIFT_PLAN row 2). The research
> behind it is §15 of [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md);
> the concept demo Kenny approved on 2026-09-08 is "Calling Card".

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
   white. The register borrows that deep red as the second plate under
   the first — the print misregistration of the reference.
4. **Barlow Condensed, 900, italic, uppercase** for the headings, Barlow
   for the body. The heading treatment is the theme; a regular heading
   would make this a dark grey theme with a red button.

## The register (5.0.0)

`css/phantom-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the research:

- **Surface.** The hero is the void with a denser halftone and the
  measured `#slash` silhouette in red on the right (a clip-path, a
  transform on arrival).
- **Emphasis.** A `<mark>` is a plate of cut paper shoved under the word,
  black ink on red; a dossier's redactions are censor plates that shear
  off right edge first.
- **Reveal.** The headline's words shout in 28 ms apart (`shout`); the
  rule under a heading is a skewed slab whose red half sweeps across the
  grey (`rail`); the emphasis routine is `slab`.
- **Divider.** Torn paper: the void, the paper and the red, each cut by
  the measured slash polygon; the second tear is the first mirrored.
- **Accent.** A hard black shadow and one red offset on every surface
  heading.
- **Arrival.** `card`: the theme's name in the display face, a red bar
  that runs under it, the whole card shoved off to the left with the
  Phantom.Land easings. Once per session, skippable, never under reduced
  motion.

Every hover is Omicron69's skewed bar growing behind the item; every
button is a key cap — a skewed plate behind a straight label; every
popover is cut paper with the red edge, arriving on a three-step film
cut.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 60% grey on black, card and popover.

**DI2 — the focus ring.** Red over black, white as the second channel.
On the buttons the ring sits outside the skewed plate: paper hugging the
button, the void around it.

**DI3 — states you can see.** Derived by lightness. Red at 58% steps
both ways; the light plate at 86% steps down.

**DI4 — colour is never the only carrier.** Black-on-white against
white-on-red for offer and rejected: lightness carries it before hue
does. Sent (90% grey) and offer (white) are close in lightness and
distinct by label, which is what the label is for.

**DI5 — the flash threshold.** Every gesture is a transform or a
clip-path; the words of a headline fade in once (1.00/s), the toast's
film cut is one monotonic three-step change (1.00/s). Nothing loops. The
references' CRT flicker (133/s and 10 Hz) was measured and refused;
Dead North's `brightness(1.15)` overshoot on a cut was dropped so no
cut is an opposing pair.

**DI6 — light or dark.** `color-scheme: dark`; ground 4%, card 9%,
popover 13%.

**DI7 — reduced motion.** Every animation and transition of the
register sits inside the no-preference guard; the rest states hold
without them, and the module builds no arrival.

**DI9 — theme colour stays in the token layer.** The register names no
colour: every plate, shadow and screen is a token or a relative colour
of one. One texture — Dead North's halftone screen and its 1px/3px scan,
both static, at DI9's ceiling.

## What this theme may not do

- Use the red as a word: red is always a plate with black ink.
- Put white on red anywhere (3.57, and 3.30 on the deep red).
- Glow: no text-shadow blur, no box-shadow blur. Shadows are hard and
  offset.
- Flicker, oscillate a scanline, or move the halftone.
- Depend on the register for a colour: `themes.css` alone must pass every
  gate, and does.
