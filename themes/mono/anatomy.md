# mono — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Greyscale, and nothing else: the ink is the brand. Vercel's Geist is the
living reference — near-white canvas, near-black ink, a mid grey, a
hairline, and no accent colour anywhere — and the register it produces
is the one that puts the content first because there is nothing else to
look at. Different from high-contrast, which keeps a navy, a yellow and
five chart hues for a safety reason; this theme drops hue for an
aesthetic one.

## What is load-bearing

1. **Meaning by lightness.** Every colour that means something elsewhere
   is a grey here, so the seven status plates are a **ladder**: 86% for
   offer, then 74, 62, 52, 34, 22, and 9% for rejected — each pair at
   least 1.25:1 apart, which a unit test holds (`gates/gates.test.mjs`,
   TH86). The DI4 gate's own pair, offer against rejected, is the two
   ends of the ladder.
2. **Charts get a pattern as well as a grey.** `--chart-pattern-1..5`
   are five SVG fills — diagonal, dots, crosshatch, horizontal, vertical
   — drawn at 30–35% black over the series colour, so five greys between
   9% and 55% lightness are told apart by texture before anyone squints
   at the shade. Every other theme answers `none`.
3. **The ink is 9%, the action is 14%.** `--primary` sits a step above
   the text because the visited-link derivation needs room to move: at
   9% the visited colour measured 11.3 from the link, under the floor of
   12, and at 14% it clears (12.7).
4. **Inter Tight for the text, Geist Mono for headings and numerals.**
   A grotesk set tight is the Geist gesture; the mono is where the
   theme allows itself a voice.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 50% grey on paper and card.

**DI2 — the focus ring.** Ink over paper — the two channels are the
theme's only two colours.

**DI3 — states you can see.** Derived by lightness, which is the only
axis there is.

**DI4 — colour is never the only carrier.** The theme's whole premise.
Ladder, pattern, label.

**DI5 — the flash threshold.** No animation.

**DI6 — light or dark.** `color-scheme: light`; paper 98%, card and
popover white.

**DI7 — reduced motion.** `--fx-duration: 150ms`, nothing under the
guard.

**DI9 — theme colour stays in the token layer.** No texture, no
flourish. The absence is the register.

## What it deliberately does not do

- **No hue, anywhere.** Not in the destructive button either: it is a
  25% grey with paper ink, and a consumer that wants a warning icon on
  it adds one — which is the DI4 answer in every theme, not only here.
- **No pure black.** 9% is the floor; black on white is
  high-contrast's, for its own reason.
- **No dark twin yet.** Geist ships one; it is a legitimate follow-up
  and not part of this round.
