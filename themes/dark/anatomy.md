# dark — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

The ordinary dark theme, done properly. A deep slate ground with a blue
cast (`hsl(226, 22%, 8%)` — not black), soft off-white text, and a
luminous violet that lifts off the ground without glaring.

Where `light` disappears, this one is meant to be comfortable at night.
Its whole job is to be the theme someone can read in for two hours.

## What is load-bearing

1. **Not black, not white.** The ground is 8% lightness and the text is
   93%, giving 14.85:1 rather than the 21:1 of pure black on pure white.
   That gap is deliberate: the extreme ratio causes halation around glyphs
   and pupil fatigue.
2. **The violet is light, not saturated.** `hsl(255, 85%, 74%)` works on a
   dark ground because it is bright; a dark saturated violet would vibrate
   against it.
3. **A blue cast throughout.** Ground, border and muted text all carry the
   same hue family. A neutral grey would read as cheap.
4. **A starfield you cannot quite see.** The texture is the only ornament
   and it lives near the threshold of visibility.

## Answers to the invariant questions

**DI1 — hairline or boundary?** Both are needed and only the hairline
exists. On a dark ground a boundary has to be _lighter_ than the surface,
and reaching 3:1 against `hsl(226, 22%, 8%)` means roughly 40% lightness —
much brighter than the current `hsl(226, 15%, 20%)`. That is the single
largest visual change L3 will make to this theme.

**DI3 — does this theme follow the derivation?** Yes, but inverted:
"one step" moves toward lighter, not darker, because the ground is dark.
The derivation must be expressed as distance from the foreground rather
than as a direction, or it will invert wrongly here.

**DI4 — palette or code?** A code. Distance today is 8.8, which is under
the floor but close — this theme is nearest to passing without a redesign,
because its status colours already differ in lightness.

**DI5 — animation?** None of its own.

**DI6 — light or dark, and is the ordering deliberate?** Dark, and the
ordering is **wrong**: background 0.0061, card 0.0099, popover 0.0085. The
popover sits below the card, so a dialog sinks behind the page instead of
floating above it. Accidental, and L3 corrects it — in a dark theme every
layer rises by getting lighter.

## What this theme may not do

- Reach pure black or pure white.
- Let the texture become visible as a pattern.
- Use a saturated mid-lightness colour over a large area; it vibrates.

## Open for L3

Success, warning and info must be _lighter_ than their light-theme
equivalents, not darker. The instinct to reuse the same hex is exactly the
mistake this theme exists to avoid.
