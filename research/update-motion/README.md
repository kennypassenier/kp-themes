# Information that updates in place

**Decided (2026-10-05).** Kenny approved the demo at 12:30 with three picks: formal Idea 3 (Checked stamp, `stamp`), cyberpunk Idea 2 (Glitch and settle, `glitch`) and titanium Idea 3 (Heat tint, `anodise`). In the package `update(el, next)` is `js/update.js`; each of those registers declares its idea in `--kp-update` and carries its `kp-sig-<theme>-update-*` keyframes in kp.signature, and catalogue/motion.html#update plays them. The other nineteen themes declare no update motion yet: the value simply changes.

Kenny, 2026-10-05 11:29: "think about an 'update' or 'refresh' type of
animation that updates info the 'theme way'".

The demo (`demo.html`) shows the same small board three times, in formal,
cyberpunk and titanium (the three of research/open-reverse), with the review
kit (`../_review/review.js`): one choice per theme, "Idea 1", "Idea 2" or
"Idea 3". **Update** changes four things at once: a key figure
(`.kp-kpi__value`, 3.26 → 3.41 bar), the chart's last point (the figure's
spark, its last point gliding to the new value), a state word
(`.kp-state-word`, Running → Restarting) and a table cell (the reading time,
08:12 → 08:27). Each column plays one idea of the theme on every changed
value, once. Speed buttons (full, ½, ¼; ¼ by default) slow every animation.

## The ideas

| Theme     | Idea 1                                                                                                                                                | Idea 2                                                                                                                                                                                                                           | Idea 3                                                                                                                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| formal    | **Fresh ink** (`ink`): the value is written in the primary ink and dries to the page's ink; a pen rule is drawn under it left to right and lifts off. | **Ledger turn** (`turn`): the value turns over on its top edge like a ledger leaf (at most 55°, so it never drops under 57 % of its height), a fold shadow lifting off. On the chart only the shadow passes over the last point. | **Checked stamp** (`stamp`): a stamp's frame lands round the value, slightly askew, and soaks in.                                                                                                                 |
| cyberpunk | **Scanline rewrite** (`scan`): a bright scan line runs down over the value with a glowing trail; the value glows and cools.                           | **Glitch and settle** (`glitch`): cyan and magenta copies tear off (the leave's colours), it jitters for a beat, a torn line runs through, it locks.                                                                             | **Neon re-ignite** (`neon`): it flickers like a neon tube striking (never under 55 % opacity), the glow surging and dying down.                                                                                   |
| titanium  | **Re-cut** (`recut`): the cutter runs across at titanium's even, linear pace and leaves the digits engraved before they settle back to plain metal.   | **Brushed sweep** (`brushed`): a band of brushed metal with a sheen slides across the changed digits.                                                                                                                            | **Heat tint** (`anodise`): the anodised colours of titanium's leave (gold, violet, blue) run across the value through `mix-blend-mode: color` and cool away; the value keeps its lightness, so it stays readable. |

Recommended in the hints: formal 1, cyberpunk 2, titanium 1.

## The rules every idea keeps

- **Written at once, readable throughout.** The new value is in the DOM at
  the first frame. No idea hides it, cuts it, scrambles it or changes its
  size: overlays sit on `::before` above the value, effects on the value are
  colour, `filter: drop-shadow()`, opacity no lower than 0.55 and a bounded
  transform.
- **The box keeps its space.** Transforms and pseudo-elements never move a
  neighbour. A value that is itself wider or narrower (3.26 → 3.41 is 4 px
  narrower in cyberpunk's font, 7 px in titanium's) takes its width at the
  first frame, with the value, exactly as without motion, so nothing moves
  while the idea plays or when it ends. `.kp-state-word` keeps room for
  every word it can show.
- **Once per update.** Every keyframe runs one iteration; the mark comes off
  when the last of them has finished, and a second update during the first
  restarts it.
- **The theme's time.** `--kp-update-duration` is
  `max(size, close) × 1.25` from `themeMotion()` (the stretch `leave()`
  gives the fold of a space), `--kp-update-ease` the theme's curve without
  overshoot. Frame-like ideas (glitch, neon, scan, re-cut) run linear.
- **Tokens only**, no literal colour; keyframes named like the registers'
  signatures (`kp-sig-<theme>-update-<idea>`), all under
  `@media (prefers-reduced-motion: no-preference)`.
- **Reduced motion**, a theme without motion or no idea: the value changes
  and nothing plays.

## How a page would ask for it

In the package this would be one function in `js/motion.js` (the demo's
`update()` in `demo.js` is written that way), and the idea one custom
property in each register:

```js
import { update } from '@kp-soft/themes/js/motion';

// A text value: the figure, a table cell.
await update(document.querySelector('#pressure'), '3.41');
// A state word keeps room for every word (setStateWord underneath).
await update(row.querySelector('.kp-state-word'), 'Restarting');
// A spark: its numbers; the last point glides to its new place.
await update(tile.querySelector('svg[data-kp-spark]'), [...last24h, 3.41]);
```

```css
/* In a register, under prefers-reduced-motion: no-preference. */
[data-theme='titanium'] {
    --kp-update: recut;
}
```

`update(el, next)` writes `next`, marks the element
`data-kp-updating="<the register's --kp-update>"` with
`--kp-update-duration` and `--kp-update-ease`, waits for its
`*-update-*` animations to finish and removes the mark; it resolves with
the time it played. A page that sets values another way can call
`update()` on the element after writing, or a module with its own setter
(`setValue(tile, v)` in a KPI module, `setStateWord()`) would call it
inside. Nothing plays on first paint: only a change is an update.

## Measured

Firefox (Playwright's engine, one script), 2026-10-05, full speed, every
idea updating all four parts at once:

| Theme                        | Time per update (all four parts)                            | Each keyframe started | Layout shift while playing                                                        |
| ---------------------------- | ----------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------- |
| formal (300 ms, theme curve) | ink 303–307 ms, turn 320–325 ms, stamp 324–329 ms           | once, 1 iteration     | 0 px (ink); 1 px on a table cell's position in the first frame only (turn, stamp) |
| cyberpunk (750 ms)           | scan 750–754 ms, glitch 771–777 ms, neon 756–761 ms         | once, 1 iteration     | 0 px (scan); 1 px first frame only (glitch, neon)                                 |
| titanium (240 ms, linear)    | re-cut 246–252 ms, brushed 256–261 ms, heat tint 256–260 ms | once, 1 iteration     | 1 px first frame only                                                             |

The value is the new one at the first frame in every case; the mark is off
and no update animation is left afterwards. The figure's own width change
(3.26 → 3.41: 4 px narrower in cyberpunk, 7 px in titanium) happens with
the value, as without motion. Reduced motion: no update keyframe starts,
no element is marked, no animation runs, the values change and the page's
notice shows. No console errors.
