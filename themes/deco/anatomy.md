# deco — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Art Deco, the dark reading: gold on a near-black ground, jewel tones for
the accents — emerald, sapphire, ruby — and geometry drawn with a ruler
and a compass: chevrons, double rules, a display face built from
circles and straight lines. Paris 1925 and the skyscraper lobby, not the
gilt of a palace.

The light ivory-and-gold Deco exists too and is not built: on paper it
sits within a step of formal and sepia. The dark one has no sibling.

## What is load-bearing

1. **Gold is the action and the structure.** `--primary`, `--ring`,
   `--selected` and both boundaries are the same family at 43°. Gold
   `hsl(43, 65%, 52%)` on the ground measures 8.16:1; the boundary is a
   quieter gold at 50% lightness and 35% saturation, so a ruled line and
   a button are not the same thing.
2. **The ground is blue-black, not black.** `hsl(200, 25%, 8%)` — a
   trace of blue under the gold is what makes the gold look warm. Pure
   black would make this phantom's ground with a different accent.
3. **Jewels as accents, never as text.** Emerald is `--accent` with a
   dark ink of its own family (the base pair is a large-text pair at 3:1;
   the derived hover and active states were what forced the dark ink —
   a light ink dropped to 2.6:1 on the lighter active plate). Ruby is
   `--destructive` and `--fx-signal`, lifted to 58% so it reads as text.
   Sapphire is `--info`.
4. **Poiret One for headings, Josefin Sans for everything else.**
   Poiret One is hairline-thin and lives only on h1–h3, uppercase with
   wide tracking; a control label in it would vanish at 14px.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** The gold boundary clears the floor on the
ground, the card and the popover; check-invariants measures all three.

**DI2 — the focus ring.** Gold over blue-black, ivory as the second
channel.

**DI3 — states you can see.** Derived by lightness. Gold at 52% has room
both ways.

**DI4 — colour is never the only carrier.** The first draft had offer
(emerald plate) and rejected (ruby plate) 11.0 apart under deuteranopia,
under the floor of 12; the emerald went lighter and the ruby darker,
which is what a green and a red on a dark ground need to stay apart
once the red channel is gone.

**DI5 — the flash threshold.** One gesture, a rule that draws itself
under a heading (`kp-rule-in`, a horizontal scale), no luminance
change.

**DI6 — light or dark.** `color-scheme: dark`; ground 8%, card 11%,
popover 14%.

**DI7 — reduced motion.** `--fx-duration: 200ms`; the rule sits under
the guard.

**DI9 — theme colour stays in the token layer.** One texture — a chevron
from two repeating gradients at 5% — and one flourish.

## What it deliberately does not do

- **No metallic gradient.** Gold as a flat colour reads as Deco; gold as
  a gradient reads as a casino.
- **No radius.** `0rem`. The style is corners.
- **No black.** The darkest value is the sidebar at 6%, still blue.
