# sepia — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Warm parchment, brown ink, and not one cool accent anywhere. Formal is
tidy but it is still blue; this is the only theme in the set that is
genuinely restful, and it is meant for long reading rather than for
dashboards.

The reference is a printed page that has aged well — not a filter over a
photograph, but paper, ink, and the warmth both acquire.

## What is load-bearing

1. **No cool hues in the body.** Everything in the reading surface sits
   between 24° and 45°. The moment a blue-grey appears, the page stops
   feeling like paper and starts feeling like a document viewer.
2. **Ink, not black.** `--foreground` is `hsl(28, 45%, 16%)`. True black
   on warm paper reads as a hole punched in the page.
3. **A serif for display.** The only theme besides terminal that changes
   a typeface, and it changes only the display face — body text stays in
   the house sans, because a serif body at screen sizes costs more than
   it gives.
4. **The surfaces rise by warmth, not by grey.** Page 94%, card 97%,
   popover 98% lightness, each a little more saturated than the last. A
   raised surface here looks like a fresher sheet, not a lighter one.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are a mid
warm brown at 52% lightness, which clears the floor on all three
surfaces. `--selected` had to move: the first draft sat at 2.61 against
the page, and the gate refused it. It is 53% lightness now, measured at
3.03 on the worst of the three.

**DI2 — the focus ring.** Warm ink over warm paper, 12.8:1 apart. Both
channels stay inside the theme's palette, so focus never introduces the
cool colour the theme is built to avoid.

**DI3 — states you can see.** The pressed state reaches the floor on
lightness alone; nothing here is near the edge of the colour space.

**DI4 — colour is never the only carrier.** This theme has the hardest
time of any: warm tints on warm paper converge under a colour deficiency
even more than pale tints elsewhere. The offer and rejection badges are
the pair the gate insists on, and they needed solving rather than
choosing — offer moved to a warmer green and rejection to a deeper rose,
which puts them 12.6 apart under deuteranopia, just over the floor of 12.
Every other pair leans on the label, as DI4 intends.

**DI5 — the flash threshold.** No animation.

**DI6 — light or dark.** `color-scheme: light`, surfaces rising.

**DI7 — reduced motion.** `--fx-duration: 220ms`, the slowest in the set.
This theme is unhurried on purpose.

**DI9 — theme colour stays in the token layer.** No texture, no register.

## What it deliberately does not do

- **No cool accent.** Not for links, not for focus, not for charts one to
  five. Two of the charts are green and blue-ish by necessity, and both
  are pulled towards the warm end far enough to belong.
- **No aged-paper texture.** The obvious flourish, and the wrong one: a
  mottled background reduces text contrast for exactly the reader this
  theme is for.
- **No sepia photograph feel.** The warmth is in the ink and the paper,
  not in a wash over the top.
