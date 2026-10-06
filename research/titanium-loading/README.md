# Titanium loading: today and the anodising bath

**What.** One page, titanium only, with every loading element the package has, each as a pair: on the left **Today**, exactly as
the package (and, where one is decided, the character demo in `research/character-*/decided.json`) draws it now; on the right
**Anodising bath**, the same markup with the key figure's loading picture `r2-ti-load-1` applied to the element's own parts.

**Why.** Kenny, 2026-10-06 20:59, after picking "The anodising bath" for the key figure (form v39): "een demo enkel voor titanium
voor laad-elementen, waar ik twee versies wil zien, de bestaande en de aangepaste die dit exact ook implementeert".

**How.**

- `demo.html` holds each element's markup once, in a `<template>`; `demo.js` clones it into both sides, sets the decided titanium
  picks of its character on both, and the loading pick only on the left (the right gets `anodised`, which no character draws).
  The markup of the character components is the package's own, taken from the character demos in their loading state.
- `anodised.css` (in `@layer kp.signature`, scoped to `[data-tl-version='anodised']`) is the whole adaptation: the band of
  `round2-d.css` (100deg, `--warning-foreground` → `--chart-4` 25% → `--chart-2` 50% → `--chart-1` 72% → `--chart-3` 90% →
  `--warning-foreground`, 260% wide, moved -160% in 2200ms, linear), mixed 32% into the plate for a surface (`--tl-bath`) or at
  full strength for a solid metal part (`--tl-oxide`: the drill bit, the progress fill, the meter groove).
- Speed (Full, ½, ¼) and Pause drive every animation on the page through the Web Animations API, so the left side has no rule
  of this page. Under reduced motion nothing moves and every picture shows its still frame.
- No review dialog: Kenny looks at the page itself.
