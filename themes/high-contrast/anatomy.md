# high-contrast — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Black on white, one signal yellow, and nothing in between. This is the
theme for someone who finds the other seven too soft — low vision, a
screen in daylight, tired eyes at the end of a shift — and it is the only
one here whose reason for existing is not taste.

It is deliberately loud. A high-contrast theme that has been softened to
look nice has stopped being a high-contrast theme.

## What is load-bearing

1. **Pure black on pure white.** 21:1, the highest a screen offers. Any
   grey in the body text is a concession, and there is none.
2. **The signal yellow.** `--accent` is `hsl(48, 100%, 50%)` with black
   ink — the colour every accessibility convention reaches for, because
   it is the one hue that stays distinct for nearly every kind of colour
   vision. It is the only decoration this theme has.
3. **Status plates are deep, not pale.** The other six light themes tint
   their badges. Pale tints are exactly what this theme exists to avoid,
   so every plate is a saturated colour carrying white ink — except the
   offer badge, which is bright lime with black ink, because it has to
   stay far from the rejection badge for someone with the commonest
   colour deficiency. Measured: 49.5 apart under deuteranopia, where the
   floor is 12 and the other themes sit at 13.
4. **`--radius: 0.25rem`.** Nearly square. A soft corner blurs the edge
   of a control, and an edge is information here.
5. **Atkinson Hyperlegible first.** A typeface drawn by the Braille
   Institute specifically to keep letterforms apart at low acuity — b/d,
   i/l, 0/O. It falls back to the house sans if the face is not
   installed, so nothing breaks; it simply gets better when it is there.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are pure
black: 21:1 against every surface. `--border` is a mid grey at 45%
lightness, which is the one place this theme allows a hairline that is
not black — a divider between two white areas is not a control boundary.

**DI2 — the focus ring.** Black and white, the widest pair a screen has.
Every surface in the theme is either near-white or dark saturated, so one
of the two rings always contrasts.

**DI3 — states you can see.** The pressed state clears the floor on
lightness alone; nothing here sits near the edge of the colour space the
way neon does, so no chroma is given up.

**DI4 — colour is never the only carrier.** Unchanged from the others,
and more important here: the badge label carries the meaning, and this
theme's plates are the ones a reader with a colour deficiency has the
best chance with, because they differ in lightness as well as hue.

**DI5 — the flash threshold.** No animation. The cyberpunk register is
not imported by this theme.

**DI6 — light or dark.** `color-scheme: light`. Card and popover are the
same white as the page; the raised surfaces are told apart by their black
border rather than by a lighter fill, which is the point of the theme.

**DI7 — reduced motion.** `--fx-duration: 120ms`, the shortest in the
set. Nothing here needs to move.

**DI9 — theme colour stays in the token layer.** No texture, no register,
no per-theme rules. This is the only theme that is nothing but tokens.

## What it deliberately does not do

- **No greys in text.** `--muted-foreground` is 20% lightness, not the
  38% the light theme uses. Muted here means quieter, not fainter.
- **No gradients, no shadows, no texture.** Every one of them reduces the
  contrast between two areas, which is the only thing this theme has.
- **No softening for looks.** If a colour is uncomfortable, that is the
  trade this theme makes on purpose. Someone who wants comfortable has
  six other options.
