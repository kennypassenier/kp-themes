# nostromo — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Cassette futurism: the beige plastic of 1979 hardware — warm-grey
panels, orange indicator LEDs, label tape, vent slots. The case, not the
screen; the screen inside this case is `terminal`. Named for the ship
whose corridors defined the look. A medium-light theme, the second on
the dusk axis with shade.

## What is load-bearing

1. **The ground is moulded plastic.** `hsl(38, 28%, 78%)` — beige with
   the yellow of thirty years — and the card and popover are the same
   plastic lighter, the way a panel catches light.
2. **Ink acts, orange indicates.** `--primary` is the ink at 17%
   lightness (not 15%: the visited-link derivation reached 11.7 from a
   15% ink and 12.5 from 17%). The LED orange `hsl(22, 87%, 55%)` is the
   sidebar's primary and the indicator dot; it measures 1.6:1 on the
   beige and is never text there. The deeper orange at 38% is the
   signal and the selected mark, above 3:1 on the ground.
3. **The LED is lit by shape as well as colour.** The current page in
   a nav carries a filled dot the others do not have — DI4 applied to
   the theme's own flourish.
4. **Michroma for headings, Titillium Web for the body.** Michroma is
   the Eurostile of the case labels; Titillium is the sci-fi UI face
   that is not cyberpunk's Chakra Petch, chosen so the two themes share
   no letter.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A warm grey at 42% on the beige (3.1),
the card and the popover.

**DI2 — the focus ring.** Ink over beige, the light plate as the second
channel.

**DI3 — states you can see.** Derived by lightness.

**DI4 — colour is never the only carrier.** Green offer against red
rejected first measured 5.5 under deuteranopia — a muted green and a
muted red on a warm ground, the solstice trap; `hsl(140, 40%, 30%)`
against `hsl(0, 85%, 30%)` measures 14.9, light ink on both above 5.

**DI5 — the flash threshold.** No animation; the LED does not blink,
which is the one thing the reference hardware did that this theme
refuses.

**DI6 — light or dark.** `color-scheme: light`; 78% → 83% → 88%.

**DI7 — reduced motion.** `--fx-duration: 160ms`, nothing under the
guard.

**DI9 — theme colour stays in the token layer.** One texture — vent
slots, a 1px rib every 6px at 5% — and one static indicator.

## What it deliberately does not do

- **No orange text.** See DI4 and the contrast: the LED colour is a
  plate everywhere.
- **No brass, no leather.** Steampunk was dropped for sitting on
  solstice; this is plastic, and plastic is matte.
- **No screen.** No scanlines, no phosphor, no cursor. The monitor in
  the case is terminal's.
