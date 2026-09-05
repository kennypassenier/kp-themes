# academia — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Dark academia: the library at night. Ink and mahogany for the ground,
parchment for the text, candle gold for what you can act on, oxblood
and forest green for the blocks that mean something. Garamond for the
headings, Lora for the reading.

This is sepia's darker counterpart — Kenny's own framing — and that is
the reason it is dark. The style's own sources describe a parchment
ground with oxblood and forest blocks, and that version sits within a
step of sepia. Turn it over and it has no sibling: solstice is a
sunset, this is a room.

## What is load-bearing

1. **The ground is ink with a trace of red.** `hsl(24, 30%, 9%)`; the
   card is a leather brown a shade lighter. Take the hue out and it is
   dark; take the lightness down and it is phantom.
2. **Gold acts, oxblood and forest mean.** `--primary` is candle gold
   `hsl(38, 50%, 58%)` because the contrast gate holds primary at 4.5:1
   as link text, and oxblood at 30% lightness cannot read on ink (1.9:1
   measured). So the gold is the link and the primary button, forest is
   the ordinary button (`--secondary`), and oxblood is `--accent` — a
   plate with parchment ink at 8.42:1.
3. **Serifs everywhere, but a readable one for the body.** Cormorant
   Garamond is thin and lives on headings; Lora carries the body at
   normal weight. The house pattern that forbids a serif body is met
   halfway: this is the reading theme, and Lora was drawn for screens.
4. **Radius 0, hairline rules.** A rounded corner in a library is a
   modern intrusion.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are a warm
grey at 52% lightness, clearing the floor on all three surfaces.

**DI2 — the focus ring.** Candle gold over ink, parchment as the
second channel.

**DI3 — states you can see.** Derived by lightness; gold at 58% and
forest at 20% both have room.

**DI4 — colour is never the only carrier.** Offer (forest) against
rejected (oxblood) first measured 9.1 apart under deuteranopia — the
same trap solstice fell into, a warm green and a warm red on a warm
ground. The green went lighter and greener, the red deeper; the gate
holds them above 12 now. Everything else leans on the label.

**DI5 — the flash threshold.** One gesture: a gold rule drawing under a
heading, slower than formal's.

**DI6 — light or dark.** `color-scheme: dark`; ground 9%, card 13%,
popover 16%.

**DI7 — reduced motion.** `--fx-duration: 240ms`, the same as solstice
and sepia: unhurried on purpose.

**DI9 — theme colour stays in the token layer.** One texture — formal's
grain over faint ledger rules, at 4% — and one flourish.

## What it deliberately does not do

- **No parchment ground.** That theme exists and is called sepia.
- **No oxblood text.** The style's own sources warn that oxblood on
  parchment fails at small sizes; here it is a plate, never a word.
- **No candle flicker.** The obvious animation is a luminance change
  on repeat, which DI5 counts.
