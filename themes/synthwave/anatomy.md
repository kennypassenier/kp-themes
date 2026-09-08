# synthwave — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Synthwave is
> the twenty-fifth theme, the first lifted after cyberpunk in 5.0.0
> (S48, LIFT_PLAN row 1). The research behind it is §25 of
> [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md); the concept demo
> Kenny approved on 2026-09-08 is "Outrun Horizon".

## The idea

Cyberpunk is diagonal and day; synthwave is horizontal and night. A
horizon, not a palette:

1. **The void as ground.** `hsl(263, 89%, 7%)` — deep indigo, never pure
   black (every measured reference agrees: `#0d0221`, `#010310`,
   `#171520`). Cards are the tape: `hsl(250, 20%, 17%)`, the Synthwave
   '84 editor ground.
2. **Hot pink as the signal.** `hsl(341, 100%, 64%)` for the primary,
   with the void as its ink (5.5:1 and up). The pink that reads as
   _text_ is lighter, `hsl(316, 100%, 75%)` — 8.9:1 on the void, 6.9:1
   on the tape — because the reference pink `#f92aad` fails on the card
   at 4.34 and the '84 rule puts the colour in the shadow, not the core.
3. **Cyan for what must be read.** `hsl(179, 94%, 59%)`, the accent and
   the label colour, 15:1 on the void.
4. **Laser yellow for a warning**, `hsl(48, 98%, 68%)`, and the sun's
   ramp `#fcc22f → #f945e5` painted by the register only.
5. **Lavender text**, `hsl(260, 100%, 91%)` — never pure white.

## Two surfaces

The app surface is the void with lavender on it. The hero surface is the
night sky: the token is a deep indigo `hsl(258, 60%, 11%)`, and the
register paints the sky ramp, the striped sun, the floor and the haze
over it; the text sits on the darkened lower half, which the token
describes. The hero's second ink is the pink that reads as text; its
frame is `hsl(316, 65%, 62%)`, 3:1 and up on the sky and on the tape
card.

## What is load-bearing

- Pink signals, cyan labels, laser warns. The three never trade places.
- The core of a neon element is near-white; the colour is in its glow.
  Without the glow the text still passes — the register never relies on
  a `text-shadow` for contrast.
- The radius is 2px. Every cut is horizontal: the sun's stripes, the
  button's sun cut, the horizon. Nothing is notched.
- The register is decoration: the theme is complete with `themes.css`
  alone, and `check-hooks` holds that every hook has an answer here even
  when the register is off.

## Answers to the invariant questions

**DI1 — hairline or boundary?** `--border` is a magenta-tinted hairline
on the void (`hsl(300, 45%, 22%)`), under 3:1 on purpose;
`--border-strong` and `--input` are `hsl(313, 55%, 52%)`, over 3:1 on
every app surface. On the hero the frame is `hsl(316, 65%, 62%)`.

**DI3 — does this theme follow the derivation?** **Yes.** Pink on the
void has headroom in both directions; the states derive at the house
step.

**DI4 — palette or code?** A code. Offer is mint green, rejected is red,
interview is violet, sent is cyan; every pair differs in lightness as
well as hue.

**DI5 — animation?** **Yes, and every rate is in the table.** The tube
that switches on has two dips in 1.1 s (1.8/s); the tracking wipe and the
shine run once; the floor drifts one cell per 6 s and never changes
luminance; nothing flickers (the CRT flicker of the references, 133/s,
was measured and refused). Every effect carries a row in `TIMINGS`
(js/effects.js) and `check-motion` reports the rate.

**DI6 — light or dark, and is the ordering deliberate?** Dark. The
surfaces rise: 4% (sidebar) → 7% (void) → 17% (tape) → 18% (popover).
The hero is a second dark ground, indigo rather than void, and the sun on
it is the one light thing on the page.

**DI9 — texture?** A static VHS screen-door: a 2px row raster and a 3px
RGB stripe, held to an effective 0.06 by `check-texture`. It never moves.

## What this theme may not do

- Use pure black, or pure white.
- Flicker: no `infinite alternate` on a glow, no CRT flicker, no scanline
  that scrolls.
- Snap the sun: its stripes are static (the Denerz 1 s loop is refused).
- Let a glow carry contrast: every neon core passes on its own.
- Depend on the register for a colour: `themes.css` alone must pass every
  gate, and does.
