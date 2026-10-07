# Forest's skeleton: five pictures

**Decided (Kenny, 07/10/2026 20:05): option 1, The treeline fills in** (research/forest-skeleton/decided.json; ported into css/forest-register.css for the block and the circle).

Kenny, 2026-10-07: the skeleton drawn as wide light diagonal stripes in a
rounded bar (the old `.kp-skeleton--block` look) "does not give forest
vibes"; the planted tree line above it he likes. He asked for an alternative
for the part that is not a tree line, as a demo with several clearly
different options, the current version one of them.

## Where the skeleton is used

- **block** (`.kp-skeleton--block`, 6 rem tall): a chart's loading state
  (`kp-chart__state kp-skeleton kp-skeleton--block`, js/chart.js ~1319), the
  chart's legend stubs (`kp-chart__source-stub`, ~1282, height `auto`) and an
  image or card placeholder in the catalogue;
- **circle** (`.kp-skeleton--circle`, 3 rem): an avatar placeholder;
- **lines** (`.kp-skeleton`, 1 rem): paragraph text, and every loading cell of
  a datatable (js/datatable.js ~1911, three rows of `kp-skeleton` spans).

## What

One page, forest only, one aspect (`skeleton`), five options, the first the
recommendation. Every option draws the same scene with the package's own
markup: a block, an avatar circle with three lines, a datatable row of three
loading cells, a loading chart (title, two legend stubs, the state box).
Within an option all shapes carry one picture, drawn with tokens only, in the
leaf corner (`--kp-sig-fo-part`), no new colour.

| #   | Option                       | Picture                                      | Appears                                     | Loop                         |
| --- | ---------------------------- | -------------------------------------------- | ------------------------------------------- | ---------------------------- |
| 1   | The treeline fills in (rec.) | two ridges and the bar's tree line           | ridges rise, whole trees walk start → end   | 3200 ms, linear              |
| 2   | Growth rings                 | a log's end: 12 rings, bark, off-centre pith | ring by ring from the pith, outward         | 3200 ms, 12 steps in and out |
| 3   | A leaf                       | midrib and alternate veins                   | the midrib walks, the veins grow off it     | 3200 ms, linear              |
| 4   | The survey                   | seven contour loops and a clay trig point    | loops drawn outside in, then the trig point | 3200 ms, linear              |
| 5   | A plot being planted (today) | the package's picture, untouched             | whole trees walk every row                  | 6600 ms (the bar's breath)   |

Contour loops and a trig point (option 4) are the page texture's and the
meter's motifs, which is why it is not the recommendation; a trail of
dashes was left out because forest's footprints were already replaced by
the planting (G9), and moss (four patches of dots spreading) was built and
dropped: the dots read as a mesh, not as moss.

## How

- `demo.js` writes the five cards (`data-sk-option`, `data-sk-fx`) with the
  same board, and the demo's tools (restart, speed, reduced-motion preview);
  every loop is CSS.
- `options.css` clears what the register and components draw on a skeleton
  inside options 1 to 4 (`all: unset`, unlayered, specificity zero via
  `:where`) and draws one picture per option from one clock: the registered
  property `--sk-t` (0 to 1), animated by `sk-breath` over 3200 ms: 1400 ms
  in, 400 ms standing, 1400 ms out as the arrival backwards. Rings use
  `steps(12, jump-end)` in and `steps(12, jump-start)` out, so the leave is
  the arrival's states mirrored in time. Measured in Firefox by seeking the
  animation every 100 ms and reading `--sk-t`: 3200 ms period, in and out
  symmetric.
- Reduced motion (the reader's setting or the **Reduced motion** button):
  `--sk-t` stays 1, the finished picture; option 5 takes the register's own
  reduced pose (half the row).
- Lines of one text stand 400 ms apart (`--sk-i`), as the register does.
- The speed buttons slow every loop (`--sk-slow`); the dialog's Pause stops
  them (it pauses every animation).

## Porting the pick

The chosen picture would move into `css/forest-register.css` (kp.signature)
in place of "Skeleton block and circle", keyed on `.kp-skeleton`,
`.kp-skeleton--block`, `.kp-skeleton--circle` and `.kp-chart__state`, and
the lines (`.kp-skeleton:not(--circle, --block)`) would take the same
picture (option 1 and 5 share the bar's row on lines). Not touched here: the
package keeps the current version until Kenny picks.
