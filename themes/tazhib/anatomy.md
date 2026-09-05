# tazhib — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Tazhib, the illumination of a Persian manuscript: a lapis-ultramarine
ground, ivory text, gold ruling, vermilion accents, and an eight-fold
girih star tiled under the glass. The only dark theme in the set built
on a saturated pigment rather than a neutral — formal has the navy and
the bronze but on light paper, blueprint has the blue but as a
technical drawing, and neither is black anywhere. Nothing here is.

## What is load-bearing

1. **The ground is a pigment.** `hsl(228, 60%, 26%)` is lapis, not
   navy; the card and popover are the same pigment lifted (31%, 36%),
   so DI6's rising layers are written in lightness, not in saturation —
   a more saturated lapis would look richer and read as lower.
2. **Gold acts.** `--primary` at `hsl(43, 67%, 50%)` measures 5.89:1
   on lapis and carries a deep-blue ink; the boundaries are a quieter
   gold, and the card carries a gold hairline inset from its edge — the
   ruling a page was drawn inside.
3. **Vermilion is a plate, never text.** `hsl(5, 75%, 55%)` on lapis
   measures 3.20:1 — enough for a large-text accent with a dark ink,
   not for a word. Where red must be text (`--destructive`) it is lifted
   to 70% lightness.
4. **Markazi Text for headings, Vazirmatn for the body.** Both drawn
   for Arabic script with a Latin that holds its own; the pairing is
   the manuscript and its margin notes.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A muted gold at 52% on ground, card and
popover.

**DI2 — the focus ring.** Gold over lapis, ivory as the second channel.

**DI3 — states you can see.** Derived by lightness towards light.

**DI4 — colour is never the only carrier.** Verdigris offer against
vermilion rejected first measured 8.6 under deuteranopia; a deep teal
(`hsl(175, 70%, 24%)`) against a deep red at 30% measures 14.2, ivory
ink on both above 5.

**DI5 — the flash threshold.** No animation; the ruling is static.

**DI6 — light or dark.** `color-scheme: dark`; 26% → 31% → 36%.

**DI7 — reduced motion.** `--fx-duration: 220ms`, nothing under the
guard.

**DI9 — theme colour stays in the token layer.** One texture — the
girih star at 5%, drawn in the gold — and one static rule.

## What it deliberately does not do

- **No black.** The sidebar at 18% lightness is the darkest value and
  it is still lapis.
- **No gradient gold.** Flat gold reads as leaf; gradient gold reads as
  a slot machine.
- **No Western geometry.** The tile is eight-fold; Deco's chevrons and
  the Swiss grid belong to their own themes.
