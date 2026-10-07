# Cyberpunk's live update: the chromatic split, six ways

Kenny, 2026-10-07 01:32, rejecting cyberpunk's live update on
research/families: "The glitch effect where one colour goes a bit to the
right and up/down and another colour goes to the right and the opposite of
the other, with neon colours".

## What

Round one: six options of that one idea, a chromatic split. The new value is
written at once and stays on top, sharp and readable throughout; behind it two
neon copies of it jump to the right, one up and the other down, and come
back. The options differ in what is seen at a glance:

| #   | Option                       | Offset                        | Motion                | Colours (↗ / ↘)                      | Time   | Settles                 |
| --- | ---------------------------- | ----------------------------- | --------------------- | ------------------------------------ | ------ | ----------------------- |
| 1   | Split and snap (recommended) | 3–4 px                        | three hard frames     | cyan `--accent` / violet `--chart-4` | 240 ms | snaps back in one frame |
| 2   | Shove and spring             | 10 px, the value recoils 2 px | one smooth slide      | cyan / red `--chart-3`               | 420 ms | springs past the middle |
| 3   | Count-down stutter           | 6 → 0 px                      | four ticks            | yellow `--primary` / cyan            | 480 ms | ticks down to nothing   |
| 4   | Sliced copies                | 5 px                          | three slices          | violet / yellow                      | 360 ms | the slices drop out     |
| 5   | Scanline tear                | 5 px, a cyan beam             | one linear sweep      | cyan / red                           | 600 ms | wiped clean top down    |
| 6   | Afterglow                    | 7 px, a neon glow             | one glide, easing out | violet / cyan                        | 900 ms | glides home, glow fades |

Option 1 is recommended: it is exactly the described glitch, in the theme's
own glitch pair (cyan and violet are the two copies of the headline's slice
burst, themes/cyberpunk/anatomy.md), and the shortest, so a dashboard where
many values change at once stays calm.

Every option is shown on every place a live update happens: a key figure and
its change, a trend tile, a tile, a key-figure strip (two of its four columns
change), a state word and a table cell, all the package's own components on
cyberpunk's register. Only a value that changed splits. The trend line takes
its new point at once: the split is the value's.

## How

- `demo.js` holds the six options, writes one card per option
  (`data-cl-option`, `data-cl-fx`, the two colours as `--cl-up`/`--cl-down`)
  and runs one clock: a live update every 2.6 s (or on **Live update**, Z in
  the dialog). A changed value's wrapper `.cl-v` gets the new text, the same
  text in `data-cl-text`, and `data-cl-hit` while the split plays.
- `demo.css` draws the split: two pseudo-element copies of `data-cl-text`
  under the value in its own stacking context, offset by the registered
  properties `--cl-x`/`--cl-y` (the up copy reads `--cl-y` negated), and the
  six keyframe sets. Colours are tokens only.
- Reduced motion (the reader's setting, or the **Reduced motion** button,
  which previews it): no motion; the copies stand 2 px out in the option's
  colours for 1.2 s and go, the value never moves.
- The speed buttons slow every split (`--cl-slow`); the dialog's Pause stops
  the clock.
- Review kit, aspect mode, cyberpunk only, one aspect (`live`), the
  recommendation first.

## Porting the pick

The picked option becomes cyberpunk's `--kp-update` idea in
`css/cyberpunk-register.css` (kp.signature, today `glitch`, the one this
replaces): js/update.js already writes the value and marks the element
`data-kp-updating`; the copies need the value as `data-kp-text` on the
element, which update.js would write beside the value.
