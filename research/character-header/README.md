# A page header of its own, per theme

**Decided (2026-10-06 21:50).** Kenny approved all 22 themes, one pick per aspect; the picks are in [decided.json](decided.json) (shape / menu / interactive). They move into the registers exactly as the demo draws them at the port.

Kenny, phase 1 brief (2026-10-05): the character round, one dashboard
component at a time, all 22 themes in one demo, as `research/character-kpi`,
`research/character-trend` and the others before it. This demo is the page
header: `.kp-page-header` (css/components.css, "Page header [scope-143]",
around line 263) — the title and its one-sentence description on the left,
secondary buttons, one primary and an overflow menu on the right, folding
under the description below a 40rem container width. No module in `js/`
builds it: a page wires its own overflow button, the way this demo's
`buildHeader()` does.

## Structure (one pick per aspect)

Per theme the header has three aspects, each picked on its own from three
options; any combination composes.

| Aspect                             | Attribute             | What it covers                                                                        |
| ---------------------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| Shape                              | `data-ph-shape`       | the plate, the title, the description, the buttons and the overflow button's own look |
| The overflow menu opens and closes | `data-ph-menu`        | how `More ▾` opens the menu; the leave is always that arrival played in reverse       |
| Hover, focus, press                | `data-ph-interactive` | every button in the header under the pointer, the keyboard and a click                |

Shape is always first (it is what the header looks like at rest); the menu's
open/close is next because it is the one thing in the header that moves on
its own; hover/focus/press is last because it only shows under interaction.
A fourth natural candidate, tone, does not apply — the header carries no
status colour — and the header has no busy or live-updating state, so this
demo has three aspects, not six.

Every option is theme-native (a real material or scene from that theme's
established world in the other character demos — the engraved plate for
formal, the milled plate for titanium, the neon trace for cyberpunk, and so
on), never a fade: no `opacity` keyframe anywhere, and a menu's close reuses
its open's keyframes with `animation-direction: reverse`, so the two are
always exact mirrors.

## Files

- `demo.html` — the page: the controls (`data-review-controls`: open/close
  the menu, a narrow-width toggle, animation speed), "Your combination" at
  the top (`data-ph-preview`), one row per aspect below it, the plain header
  at the foot for reference.
- `demo.js` — `ASPECTS` (the three above) and the full `IDEAS` table: for
  all 22 themes, three named options per aspect, each with a one-sentence
  text saying exactly what it does. This is the spec other helpers build
  `header-a.css` … `header-d.css` from. It also builds every header's markup
  (`buildHeader()`, the package's own shape) and wires the overflow menu's
  open/close, the width toggle and the speed control.
- `demo.css` — the page's own layout (not the header's character).
- `header.css` — complete theme-native CSS for **formal** and **titanium**
  only, in `@layer kp.signature`, one rule per aspect's knobs so any
  combination composes; selectors keep a space after the theme
  (`[data-theme='formal'] [data-ph-shape='1'] …`, since the theme sits on
  `<html>`, not on the header's own wrapper).
- `header-a.css` (light, dark, cyberpunk, synthwave, pastel), `header-b.css`
  (terminal, forest, high-contrast, sepia, blueprint), `header-c.css`
  (solstice, brutalism, deco, phantom, shade-light), `header-d.css`
  (shade-dark, retro, grotesk, lapis, nostromo) — each `@layer kp.signature
{}`, empty: where a later helper round's CSS for those twenty themes
  lands, five themes per file, built from `demo.js`'s `IDEAS` table.

## Checked

Firefox via Playwright against a local `http.server`, DOM/console only
(no screenshot lock), formal and titanium, both motion settings: 0 console
errors, every control works (menu open/close, width, speed), the three
options per row differ in computed style, and the overflow menu's open
animates at full motion and plays nothing under reduced motion.
