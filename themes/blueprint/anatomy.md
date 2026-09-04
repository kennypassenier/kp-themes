# blueprint — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

A technical drawing. Cyan-white lines on deep Prussian blue, with amber
where something needs attention. Topo is a map — contour lines, land,
elevation; this is the other half of that pair: the drawing of a thing
that does not exist yet.

Where cyberpunk is a dark blue theme that glows, this one is a dark blue
theme that measures.

## What is load-bearing

1. **The Prussian ground.** `hsl(215, 65%, 12%)` — a blue dark enough to
   read as ink rather than as a dark grey with a tint. Lighten it and the
   theme becomes "dark blue interface"; deepen it and it becomes black.
2. **Cyan as the drawing line.** `--primary` is `hsl(190, 80%, 62%)`,
   which is the colour a blueprint's line actually is. It carries links,
   focus and the first chart series.
3. **Amber for annotation.** The one warm colour, used where a drawing
   would use a red pencil: `--accent`, and the second chart series. It is
   the only hue in the theme that is not blue or cyan.
4. **`--radius: 0.125rem`.** Nearly square, because a drawn line does not
   have rounded ends. This is the second-sharpest theme after
   high-contrast.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are a mid
steel blue that clears the floor on all three surfaces without becoming
the drawing line itself — a boundary that is the same cyan as a link
would make every input look like a control.

**DI2 — the focus ring.** Cyan-white over Prussian blue.

**DI3 — states you can see.** Lightness alone reaches the floor. The cyan
is bright but not near the top of the space the way neon magenta is, so
this theme does not need the chroma fallback that cyberpunk does.

**DI4 — colour is never the only carrier.** The offer and rejection
badges were 5.3 apart under deuteranopia in the first draft — both mid
plates on a dark ground, which is the shape that collapses. Solved to 23
by taking offer to a deeper green and rejection to a deeper red, both
still carrying light text.

**DI5 — the flash threshold.** No animation.

**DI6 — light or dark.** `color-scheme: dark`, surfaces rising from 12%
to 19% lightness.

**DI7 — reduced motion.** `--fx-duration: 160ms`. Quick and matter-of-
fact; a drawing does not linger.

**DI9 — theme colour stays in the token layer.** No texture yet. A fine
ruled grid would suit this theme and is the obvious candidate if the
texture layer is ever extended — it belongs in `css/_rules.css` beside
the others, not in a rule of its own.

## What it deliberately does not do

- **No glow.** Cyberpunk owns that. The cyan here is a line, not a light
  source, and adding a bloom would make the two themes hard to tell apart
  in a thumbnail.
- **No second warm hue.** Amber is the annotation colour; a second warm
  accent would turn a drawing into a diagram.
- **No paper-blue nostalgia.** Real blueprints are white lines on blue
  because of the cyanotype process, and inverting that for a screen —
  dark lines on light blue — would be historically right and unreadable.
