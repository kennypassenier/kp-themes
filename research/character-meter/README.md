# A meter of its own, per theme

Kenny, form v18 (2026-10-05): the character round starts with the meter,
one component at a time, all 22 themes in one demo.

`.kp-meter` (css/components.css, "Meter with a mark", scope-143) is today
the same shape in every theme: a rounded track, a fill at `--kp-value`, a
2px tick at `--kp-mark`, a small ▸ past the end, `.kp-meter--inline`, the
warning and destructive tones and a loading pulse, all in the theme's
tokens. This demo gives every theme two meters drawn in its own world, the
way the exits were, beside the plain meter of today.

## Files

- `demo.html`: one section judged per theme with the review kit
  (`../_review/review.js`): one choice per theme, "Character 1",
  "Character 2" or "The plain meter, as today", each character's name and
  parts as the option's hint for that theme. Controls: Loading, Mark past
  the end, the tone (none, warning, destructive), the speed of every
  animation (full, ½, ¼).
- `meters.css`: the 44 characters, in `@layer kp.signature`, scoped
  `[data-theme='<name>'] [data-cm='a'|'b'] .kp-meter`. In a register the
  same rules read `[data-theme='<name>'] .kp-meter` (and `.kp-kpi__meter`).
  The contract every character keeps is at the top of the file.
- `demo.js`: the names and descriptions (`IDEAS`), the review choices and
  look-at lines built from them, the meters written with the package's
  `setMeter()`, the speed control.
- `demo.css`: the page layout only.

Each column shows the same three meters: 62 % with the mark at 80 % (the
mark on the empty track), 130 % with the mark at 80 % (full, past the end,
the mark on the fill), and an inline meter in a sentence (91 %, the mark
at 80 %). "Mark past the end" moves the first meter's mark to 115 %.

## The characters

| Theme         | Character 1                                                                                                                                                     | Character 2                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| formal        | The ledger column: ruled column, navy entry, tick-and-tie mark, closed with the double rule and "c/f" past the end                                              | The bound volume: fore-edge track, navy buckram share, gold ribbon bookmark mark, one more volume leaning past the shelf                   |
| light         | The seam and its circle: 1px seam, indigo pill, the divider's open circle as the mark, the seam runs on to a cyan circle                                        | Daylight: the share brightens towards its end, a gnomon with a short shadow, a cyan glint past the end                                     |
| dark          | The spectrometer: ruled black slit, one emission line coloured by the oxide film at its reading, "]" bracket mark, a magenta "]" past the end                   | The machined channel: chamfered channel, bright metal with the film along its top, a milled V mark, a chamfered tip past the end           |
| cyberpunk     | The neon tube: glowing yellow tube, a cyan tick that glitches every 3.2 s, "OVR" past the end, loading tries to strike                                          | The HUD gauge: yellow plates split by void slits, cut at 45°, cyan target notch, red notched plate past the end, data stream loading       |
| synthwave     | The neon sign: light core, pink glow, cyan tube mark, a glowing › past the end                                                                                  | Chrome over the grid: grid floor track, chrome share (sky, horizon, sunset), half-risen striped sun mark, cyan » past the end              |
| pastel        | Washi tape: plum striped tape with the sky pass off register, torn end, sticker-on-a-pin mark, curled corner past the end                                       | Gummy candy: sticker pill with flat shadow, glossy plum share, white-and-mint candy stick mark, a gummy drop past the end                  |
| terminal      | The htop meter: [\|\|\|\| ] in character cells, blinking block caret mark, "+" past the bracket                                                                 | The oscilloscope: graticule, phosphor trace over its afterglow, yellow cursor mark, "OL" past the end                                      |
| forest        | The wooden gauge: routed groove in light wood, stained forest-green share, stem-and-leaf mark, a sprouting leaf past the end                                    | The trail on the map: contours and clay dashes, the walked trail in forest ink, a trig-point mark, a clay blaze past the end               |
| high-contrast | The ink frame: 2px frame, solid ink share, a white slot between ink edges as the mark, a yellow "+" plate past the end                                          | The pattern-coded gauge: ink hatching closed by an ink edge, yellow column mark, an ink arrowhead past the end                             |
| sepia         | The pen stroke: pencilled dotted guide, a nib stroke tapered and pooled, lozenge-topped hairline mark, an ink blot past the end                                 | The letterpress impression: debossed track, inked and speckled share, brass rule with ¶ as the mark, ink squeezed out past the end         |
| blueprint     | The engineer's scale: ticks every 5 % and 25 %, line weight on the baseline, amber datum triangle mark, a break line past the end                               | The tolerance band: outlined band on the mm grid, tinted share, amber centre (chain) line mark, amber hatching past the end                |
| solstice      | The standing stones: ridged ground lit by the low sun, a standing stone with its long shadow as the mark, the sun rising past the end                           | The embers: charcoal log, breathing embers, dark poker mark, sparks past the end                                                           |
| brutalism     | The slab: 3px box with hard shadow, yellow plate, black post with lavender cap, a yellow block slammed out over the edge                                        | The stacked blocks: ten boxes filled lavender, yellow peg mark, one more block thrown on top past the end                                  |
| deco          | The gilt frieze: double gold rules, flat gold ending in a chevron, emerald lozenge on a dark spire, ››› past the end                                            | The lobby floor indicator: a row of lamps lit in gold, gold arrow down as the mark, an arrow up past the end                               |
| phantom       | The calling card: -8° slab under a halftone, red plate with its second plate off register, white shard mark, a white "!" burst past the end                     | The ransom collage: cut pieces of red, white and red, black shard mark edged in white, a torn white shard past the end                     |
| shade-light   | The pencil gauge: pencil outline, blue plate hatched in pencil, graphite stroke with a soft shade, scribble past the end                                        | The pin and its shade: raised blue strip with a soft shade, magenta-headed pin, the strip hangs over the end, its shade beyond             |
| shade-dark    | Silverpoint: silver hatching on the dark ground, blue plate with a lit edge, pale metal stroke, silver scribble past the end                                    | The reading lamp: blue plate lifted out of a deep well, a pale pin under a pool of lamplight, light spilling out past the end              |
| retro         | The installer bar: sunken bevelled field, navy with dithered end, raised grey slider-thumb mark, a scroll-arrow button past the end                             | The defragmenter: two rows of cells, navy with teal, a white framed cell column as the mark, two cells outside the field                   |
| grotesk       | The red block on the baseline: flat red block on a black baseline, flush black rule mark, an oversized → past the end                                           | The zebra scale: twelve-column zebra foot, black share, red rule with a square flag, a red square set lower past the end                   |
| lapis         | The gilt band: lapis ruled in gold, tooled gold leaf, vermilion reed stroke with its nuqta, a vermilion toranj past the end                                     | Lapis stone on vellum: ivory track ruled in gold, lapis stone with pyrite and calcite, gold leaf stroke, a chipped shard past the end      |
| nostromo      | The bargraph tube: dark glass tube in the case, glowing orange column, cream tick, the overload lamp lit past the end                                           | The backlit vents: vent slots lit orange from inside, black label-tape ▼ tab, a cut piece of label tape reading + past the end             |
| titanium      | The heat-tinted groove: engraved groove, heat-tint oxide fixed by position (gold, bronze, violet, blue), two-faceted milled pointer, a bright burr past the end | The vernier caliper: engraved main scale, knurled bright beam, oxide-blue vernier zero line with its small scale, the jaw tip past the end |

Loading in every character keeps the meter's height and shows a still
frame that cannot be read as a share (a leader, a dashed seam, a faint
spectrum, a hatched or speckled track, a still lamp or glint); where the
theme allows motion it moves on top of that. Themes whose rules forbid
loops keep theirs still: formal 1, light 1, dark 1 and 2, high-contrast 1
and 2, retro 1.

## Measured

Firefox (Playwright's, one script, its own `http.server`, under
`flock /tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport
1400 × 1000 at 2×:

- **Console:** 0 errors and 0 page errors in all 22 themes, with and
  without reduced motion, through every state.
- **Heights:** every meter's box and the row or sentence around it measured
  in 12 states (3 tones × loading on/off × mark past the end on/off): one
  height per meter and per row in all 264 meter/column pairs; no state moves
  anything.
- **Reduced motion:** with `prefers-reduced-motion: reduce` and every meter
  loading, 0 animations run on the page in all 22 themes.
- **Mark contrast:** from the screenshot's pixels at the meter's middle
  row: the best contrast of any pixel of the mark (core or halo, the mark's
  box ±1.5px) against the fill 4 to 9px beside it, worst case over those
  fill pixels (so a patterned fill counts its least favourable pixel). "On
  the fill" is the 130 % and the inline meter (mark at 80 %), the lower of
  the two; "On the track" the 62 % meter. Every character is at or above
  3:1 in every tone, on the fill and on the track; the lowest are lapis 1
  (3.16, destructive) and lapis 2 (3.20, no tone).

| Theme         | Option | On the fill | Fill, warning | Fill, destructive | On the track | Animates (loading / at rest)           |
| ------------- | ------ | ----------: | ------------: | ----------------: | -----------: | -------------------------------------- |
| formal        | 1      |       11.86 |          5.98 |              7.10 |        15.99 | nothing (still)                        |
|               | 2      |        6.65 |          4.01 |              4.93 |         3.38 | cm-formal-riffle                       |
|               | plain  |       11.27 |          5.77 |              6.90 |        13.26 | kp-pulse                               |
| light         | 1      |        9.40 |          5.78 |              6.48 |         5.21 | nothing (still)                        |
|               | 2      |        7.26 |          5.02 |              5.47 |        13.22 | cm-light-day                           |
|               | plain  |        9.40 |          5.78 |              6.48 |        14.59 | kp-pulse                               |
| dark          | 1      |       14.31 |         13.13 |             10.23 |        17.10 | nothing (still)                        |
|               | 2      |       16.73 |         10.79 |              6.86 |        14.75 | nothing (still)                        |
|               | plain  |       15.91 |         10.26 |              6.52 |        15.08 | kp-pulse                               |
| cyberpunk     | 1      |       14.51 |         12.48 |              8.83 |        12.07 | cm-cy-strike / cm-cy-jolt, cm-cy-ghost |
|               | 2      |       13.85 |         11.74 |              5.07 |         4.48 | cm-cy-stream                           |
|               | plain  |       15.26 |         11.02 |              4.76 |         9.95 | kp-pulse                               |
| synthwave     | 1      |       13.39 |         13.39 |             13.39 |        11.02 | cm-sw-ignite                           |
|               | 2      |       14.32 |         14.32 |             14.32 |         4.80 | cm-sw-road                             |
|               | plain  |        4.12 |          9.66 |              3.90 |        11.00 | kp-pulse                               |
| pastel        | 1      |        3.86 |          4.23 |              3.77 |         7.95 | cm-pa-drift                            |
|               | 2      |        6.04 |          5.76 |              5.82 |        10.71 | cm-pa-hop                              |
|               | plain  |        6.41 |          6.13 |              6.15 |        11.26 | kp-pulse                               |
| terminal      | 1      |        9.83 |          9.76 |              5.43 |         5.16 | cm-tm-walk / cm-tm-blink               |
|               | 2      |       12.69 |         12.59 |              5.43 |         5.62 | cm-tm-sweep                            |
|               | plain  |       12.17 |         12.08 |              5.21 |         7.71 | kp-pulse                               |
| forest        | 1      |        5.62 |          4.73 |              4.84 |        11.42 | cm-fo-wind                             |
|               | 2      |        8.06 |          6.45 |              6.35 |         3.96 | cm-fo-walk                             |
|               | plain  |        8.06 |          6.45 |              6.35 |        11.42 | kp-pulse                               |
| high-contrast | 1      |       21.00 |         13.89 |              8.21 |        21.00 | nothing (still)                        |
|               | 2      |       21.00 |         13.89 |              8.21 |        21.00 | nothing (still)                        |
|               | plain  |       10.86 |         21.00 |              8.21 |        18.43 | kp-pulse                               |
| sepia         | 1      |        6.92 |          7.29 |              6.89 |         4.98 | cm-se-write                            |
|               | 2      |        4.30 |          4.51 |              4.53 |         4.22 | cm-se-press                            |
|               | plain  |        6.92 |          7.29 |              6.89 |        11.38 | kp-pulse                               |
| blueprint     | 1      |        5.28 |          4.80 |              6.42 |         7.21 | cm-bp-plot                             |
|               | 2      |        3.59 |          3.21 |              4.51 |         5.18 | cm-bp-trace                            |
|               | plain  |        8.64 |         13.54 |              4.42 |        10.87 | kp-pulse                               |
| solstice      | 1      |        5.22 |         10.51 |              3.59 |         3.85 | cm-so-dawn                             |
|               | 2      |        4.67 |          5.22 |              4.34 |        10.35 | cm-so-glow / cm-so-breathe             |
|               | plain  |        6.40 |         13.83 |              4.11 |        10.35 | kp-pulse                               |
| brutalism     | 1      |       13.31 |         18.73 |              6.48 |        18.73 | cm-br-tape                             |
|               | 2      |        8.74 |         13.31 |              4.61 |        16.59 | cm-br-stack                            |
|               | plain  |       18.73 |         18.73 |              6.48 |        15.94 | kp-pulse                               |
| deco          | 1      |        7.94 |         15.20 |              4.47 |         7.94 | cm-de-glint                            |
|               | 2      |        7.70 |          8.70 |              4.35 |         9.58 | cm-de-lift                             |
|               | plain  |        7.49 |         14.44 |              4.26 |        11.24 | kp-pulse                               |
| phantom       | 1      |        5.01 |         16.74 |              5.01 |        10.41 | cm-ph-screen                           |
|               | 2      |        4.57 |         14.55 |              4.57 |        11.23 | cm-ph-shuffle                          |
|               | plain  |        4.43 |         14.94 |              4.43 |        11.23 | kp-pulse                               |
| shade-light   | 1      |        3.65 |          5.85 |              4.42 |         6.07 | cm-sh-hatch                            |
|               | 2      |        5.39 |          5.85 |              6.18 |         5.30 | cm-sh-cloud                            |
|               | plain  |        5.39 |          5.85 |              6.18 |         5.30 | kp-pulse                               |
| shade-dark    | 1      |        5.46 |          6.91 |              4.64 |         4.10 | cm-sh-hatch                            |
|               | 2      |        5.46 |          6.91 |              4.64 |         6.06 | cm-sh-lamp                             |
|               | plain  |        4.90 |          6.91 |              4.17 |         5.36 | kp-pulse                               |
| retro         | 1      |       12.83 |         13.94 |              8.77 |        12.81 | nothing (still)                        |
|               | 2      |       12.83 |         13.94 |              8.77 |         4.41 | cm-rt-read                             |
|               | plain  |       11.02 |         11.97 |              7.53 |         9.98 | kp-pulse                               |
| grotesk       | 1      |        4.99 |         18.73 |              6.07 |        17.18 | cm-gr-cut                              |
|               | 2      |       18.73 |         18.73 |              6.07 |         4.99 | cm-gr-zebra                            |
|               | plain  |        4.99 |         18.73 |              6.07 |        17.18 | kp-pulse                               |
| lapis         | 1      |        3.57 |          5.99 |              3.16 |         4.43 | cm-la-burnish                          |
|               | 2      |        3.20 |         14.89 |              6.82 |        11.88 | cm-la-glint                            |
|               | plain  |        5.00 |          9.39 |              4.28 |         8.61 | kp-pulse                               |
| nostromo      | 1      |        6.13 |         11.27 |              4.41 |         5.43 | cm-no-warm                             |
|               | 2      |        3.51 |          7.67 |              4.04 |         7.13 | cm-no-scan                             |
|               | plain  |        9.90 |         12.37 |              6.84 |         8.21 | kp-pulse                               |
| titanium      | 1      |        4.79 |          9.68 |              5.89 |        12.28 | cm-ti-cut                              |
|               | 2      |        8.26 |          6.34 |              4.06 |         5.37 | cm-ti-knurl                            |
|               | plain  |       11.19 |          8.36 |              5.09 |        14.63 | kp-pulse                               |

`kp-pulse` is the plain meter's own loading pulse.

## Open for the package

- Signs that take room past the end (formal 1 "c/f", cyberpunk 1 "OVR",
  terminal 2 "OL", deco 1 "›››", phantom 1 "!") need up to 1.75rem beside a
  block meter; `--cm-room` says how much, and an inline meter keeps it in
  every state. In the package that would become a register knob.
- A character draws its own sign past the end, so the modifiers
  `--over-hatch`, `--over-spill` and `--over-break` would do nothing in a
  theme whose pick is a character; the plain column shows them as they are.
- High-contrast's warning tone fills with `--warning-foreground`, which is
  white in that theme: on the plain meter a warning fill is white on a light
  track. Both characters fill a warning with the yellow (`--accent`), closed
  by an ink edge.
