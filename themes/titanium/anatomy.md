# titanium — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Titanium is the
> theme round seven added (scope-17, named at scope-21). Its concept demo
> is the third world of the hypertech page Kenny approved on 2026-09-11:
> _"Titanium wordt een nieuw thema op zichzelf, het is heel mooi."_

## The idea

Not a place but a **material**: anodised titanium over carbon weave. The
round that produced this theme opened asking for one called hypertech —
a category, defined by an empty place on the colour wheel — and it cost
six refused worlds before the answer turned out to be a material, which
is how every theme in this package is named. Retro is the desktop,
terminal is the tube, blueprint is the drawing, lapis is the stone.

The colour has a **cause**, and that is the whole theme. Anodising does
not add pigment: it grows an oxide film, and the film's thickness decides
which wavelength survives. So the blue-violet on every edge really is
interference, and it really does shift with the angle you look from. The
register paints it as a gradient whose start angle follows the pointer
(`--kp-pointer: track`, scope-16), because a fixed angle would make it a
decoration rather than a property of the surface.

## What is load-bearing

1. **The metal is neutral; only the film has hue.** Every token in this
   file sits between hue 206 and 216 at low saturation — ground
   `hsl(216, 16%, 10%)`, panel `hsl(214, 13%, 15%)`, ink
   `hsl(210, 16%, 94%)`. The signal is `hsl(212, 16%, 87%)`, a bright
   machined grey, not a colour. Everything that is actually coloured
   belongs to the oxide, and the oxide lives in the register.
2. **The machined chamfer.** Two corners cut at forty-five degrees, with
   a highlight along the top edge where the tool left the surface bright.
   `--radius: 0rem` and `--fx-notch: 0.6rem`: the corner is cut, never
   rounded.
3. **Metal does not ease.** `--fx-duration: 60ms`, and the controls run
   linear. A press is short and hard, and it arrives instantly, because a
   click is shorter than a transition.
4. **The carbon weave.** Two diagonals crossing at forty-five degrees,
   under the ambient light that follows the pointer.
5. **Sora over Be Vietnam Pro, Martian Mono for the reads.** Three
   families the package did not ship before; Kenny approved adding them
   on 2026-09-12 rather than substituting, because the voice of a theme
   is largely its letter. Measured at 129,804 bytes over six faces,
   8.7% of the per-theme budget.

## What the demo showed and what is still open

The demo's values are implemented as drawn. Three of them fall short of a
floor the package holds elsewhere, and per S49 they are **findings put to
Kenny**, not corrections made here:

1. `--primary-active` against `--primary` — measured 9.95, floor 10.
2. The same pair on the hero surface — measured 9.95, floor 10.
3. `surface-hero-border` on `surface-hero-bg` — measured 2.98, floor 3.

All three are hairline — two of them by five hundredths — and all three
come from the same root: the demo's signal is a near-white at 87%
lightness, so two derived steps down do not travel far enough to read as
a press. That is the same complaint Kenny made about shade-dark on
2026-09-11, arriving from the other direction.

## Answers to the invariant questions

- **A boundary, always (DI1).** `--border` is `hsl(214, 10%, 24%)` and
  `--border-strong` `hsl(214, 10%, 40%)`; the chamfer cuts the corner but
  never removes the edge.
- **Two focus channels (DI2).** The outline and the ring both, with the
  register composing its own oxide underline in front of the ring rather
  than instead of it.
- **A visible pressed state (KT2, fix-12).** The register writes its own
  `:active` for every button variant whose ground it paints on hover, so
  no state of the components layer is cancelled without replacement.
- **Motion is guarded (DI7).** Every transition sits inside a
  `prefers-reduced-motion: no-preference` block, and the pointer bus does
  not attach at all under reduced motion — a colour that follows your
  hand is movement too.
- **No colour outside the token layer (DI9).** Every stop in the register
  is `var(--token)` or a relative colour derived from one.

## What it deliberately does not do

- **No glow.** The oxide is interference, not emission; nothing here
  blooms. That is what separates titanium from cyberpunk and synthwave,
  which are the only other themes in this range of saturation.
- **No easing on the controls.** Sixty milliseconds, linear. The
  temptation to soften it is the temptation to make metal behave like
  rubber.
