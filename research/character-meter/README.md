# A meter of its own, per theme

**Judged (2026-10-05 17:58).** Kenny judged the demo in all 22 themes from To judge: 19 approved with a pick, 3 not approved. Picks: Character 2 for formal, light, dark, synthwave, high-contrast, sepia, brutalism, deco, retro, nostromo; Character 1 for cyberpunk, pastel, terminal, blueprint, solstice, phantom, shade-light, shade-dark, lapis, titanium. Not approved, with his notes: forest ("I really like the width and filling of character 1, but I don't like the leaf. So can we combine that with the icons from character 2?"), retro ("Just try something different"; his pick Character 2 stands only until the new round), grotesk ("try something else"). At 18:00 he added that he had judged in the dialog without seeing the animations (the state and speed controls sat outside it) and asked to wait: he re-judges the whole demo once the controls are in the dialog. At 18:01 he settled it: only the SHAPE of the 19 picks is approved; their states and animations are not. The next round shows, per theme, three motion treatments of the approved shape (loading, a mark past the end, the three tones, the fill), with a speed control for every animation, inside the review dialog; forest (C1 width and fill with C2 icons, no leaf), retro and grotesk get new shapes with the same three treatments. Nothing is ported until he has chosen.

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

## Round 2: one shape, three ways it moves

Kenny, 2026-10-05 18:01: "onthoud de goedgekeurde items, maar geef nu nog is
drie opties, telkens met loading, mark past the end, de drie tone opties en
speed of every animation, maar wel in de dialog", and "Dus enkel de 'vorm' is
goedgekeurd". Each theme keeps the shape of its round-1 pick on all three
columns; forest gets the wooden gauge with the trail's marks he asked for (the
old Character 1's width and stained-wood filling, the old Character 2's trig
point and clay blaze, no leaf), retro and grotesk get a new shape each. The
three options differ in four things: how the share arrives (after loading, and
on **Drawn**, which replays it), how a new tone shows (the share re-inked in the
new colour, or the meter jolted, knocked or swollen once), how the mark moves
and stands past the end (stopped at the end, just outside it, or leaning over
it, with the theme's glyph), and the loading picture (option 1 the shape's own
from round 1, options 2 and 3 new). Nothing fades. The controls (State: Drawn,
Loading, Mark past the end; Tone: None, Warning, Destructive; Speed: Full, ½,
¼) sit in the section's `data-review-controls` container, which the review kit
mirrors into its dialog; the speed sets the playback rate of every animation and
transition on the page. The plain column is gone; the package's three
`--over-*` modifiers are shown in every column, drawn as the shape's own sign.

The round opens again for all 22 themes: `data-review-round` with round
`2026-10-05-r2` reopens `<theme>|meter` for every theme, so the hub counts the
demo as open in every theme and the dialog walks all 22.

The two new shapes:

- **Retro, the system monitor:** a sunken black panel of LED segments, as Task
  Manager and Winamp drew a level; unlit segments glow dark green, the share is
  lit green (yellow for a warning, a lit red for danger), the mark is a white
  peak-hold segment in a black frame, the red clip lamp past the end.
- **Grotesk, the transit line:** the route diagram of Swiss transit signage; the
  line served so far in red with a station tick every sixth, the rest in grey,
  the interchange capsule (white in a black outline) as the mark, the line run
  on to a black terminus bar past the end.

| Theme         | Shape                                   | Option 1                | Option 2             | Option 3           |
| ------------- | --------------------------------------- | ----------------------- | -------------------- | ------------------ |
| formal        | The bound volume and its ribbon         | Written into the ledger | Stamped and filed    | Counted in tenths  |
| light         | Daylight                                | Morning light           | The shadow swings    | Through the window |
| dark          | The machined channel                    | Machined                | Milled in passes     | Pressed in the die |
| cyberpunk     | The neon tube with a glitch tick        | Ignition                | Data burst           | Packet sync        |
| synthwave     | Chrome over the grid                    | Sunrise                 | Overdrive            | Arcade attract     |
| pastel        | Washi tape                              | Boing                   | Pressed sticker      | Dropped in         |
| terminal      | The htop meter                          | Line by line            | Redraw               | Typed out          |
| forest        | The wooden gauge with the trail's marks | Footsteps               | Growth rings         | Blazed trail       |
| high-contrast | The pattern-coded gauge                 | At once                 | In two steps         | In quarters        |
| sepia         | The letterpress impression              | The platen              | Quill stroke         | Set in type        |
| blueprint     | The engineer's scale with a break line  | The plotter             | Dimensioned          | Redrawn            |
| solstice      | The standing stones                     | Long dawn               | The shadow lengthens | Stone by stone     |
| brutalism     | The stacked blocks                      | Thrown on               | Slammed              | Block by block     |
| deco          | The lobby floor indicator               | The lift ascends        | Gilt sweep           | Fanfare            |
| phantom       | The calling card                        | Card thrown             | Cut out              | The stamp          |
| shade-light   | The pencil gauge                        | Hatched in              | Pressed paper        | Passing shade      |
| shade-dark    | Silverpoint                             | Silver drawn            | Lifted               | Lamp passes        |
| retro         | The system monitor                      | Task Manager            | Winamp               | Disk light         |
| grotesk       | The transit line                        | Departure               | Express              | Timetable          |
| lapis         | The gilt band                           | Gold laid               | Reed stroke          | Tile by tile       |
| nostromo      | The backlit vents                       | Power up                | Relay clack          | Warm-up            |
| titanium      | The heat-tinted groove                  | Cut                     | Heat tint            | Machined tick      |

Each option's full description (arrival, tone, mark, loading) is its hint in the
review dialog and its text on the page (`IDEAS` in `demo.js`).

### Measured, round 2

Firefox (Playwright's, its own `http.server` on 127.0.0.1:8700, under `flock
/tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport 1400 × 1000 at
2×, one run of 1 min 8 s plus a rerun of formal and titanium after a fix:

- **Console:** 0 errors and 0 page errors on all 44 pages (22 themes × with
  and without reduced motion), through all 9 states (3 states × 3 tones).
- **Heights:** every meter's box and its row or sentence, in all 9 states: one
  height each, in every theme and both motion settings.
- **Reduced motion:** 0 running animations or transitions in any of the 9
  states in all 22 themes.
- **Loading at full motion:** every option of every theme runs its own loading
  animation, except dark and high-contrast, whose rules forbid loops: all six of
  their loading pictures are still.
- **Mark contrast**, measured as in round 1 (mark core or halo against the fill
  4 to 9px beside it, worst fill pixel; "On the fill" the lower of the 130 % and
  the inline meter): every option is at or above 3:1 in every tone, on the fill
  and on the track. The mark is the shape's in all three options, so the three
  read alike; the lowest is lapis (3.16, destructive, as in round 1).

| Theme         | Option | On the fill | Fill, warning | Fill, destructive | On the track |
| ------------- | ------ | ----------: | ------------: | ----------------: | -----------: |
| formal        | 1      |        6.42 |          3.94 |              4.83 |         3.39 |
|               | 2      |        6.33 |          3.89 |              4.77 |         3.39 |
|               | 3      |        6.47 |          3.94 |              4.81 |         3.37 |
| light         | 1      |        7.27 |          4.98 |              5.45 |        13.87 |
|               | 2      |        7.40 |          5.06 |              5.51 |        13.08 |
|               | 3      |        7.33 |          5.02 |              5.51 |        13.08 |
| dark          | 1      |       16.73 |         10.79 |              6.86 |        14.75 |
|               | 2      |       16.73 |         10.79 |              6.86 |        14.75 |
|               | 3      |       16.73 |         10.79 |              6.86 |        14.75 |
| cyberpunk     | 1      |       14.51 |         12.48 |              8.83 |        13.40 |
|               | 2      |       14.51 |         12.48 |              8.83 |        13.40 |
|               | 3      |       14.51 |         12.48 |              8.83 |        13.40 |
| synthwave     | 1      |       12.23 |         12.23 |             12.23 |         5.00 |
|               | 2      |       12.16 |         12.16 |             12.16 |         5.01 |
|               | 3      |       12.13 |         12.13 |             12.13 |         5.00 |
| pastel        | 1      |        3.93 |          4.32 |              3.86 |        10.75 |
|               | 2      |        3.93 |          4.32 |              3.86 |        10.81 |
|               | 3      |        3.93 |          4.32 |              3.86 |        10.81 |
| terminal      | 1      |        9.83 |          9.65 |              5.43 |         8.99 |
|               | 2      |        6.19 |          6.06 |              5.43 |         8.99 |
|               | 3      |        9.83 |          9.65 |              5.43 |         8.99 |
| forest        | 1      |        5.62 |          4.73 |              4.84 |         9.48 |
|               | 2      |        5.62 |          4.73 |              4.84 |         9.48 |
|               | 3      |        5.62 |          4.73 |              4.84 |         9.48 |
| high-contrast | 1      |       21.00 |         21.00 |              8.21 |        21.00 |
|               | 2      |       21.00 |         21.00 |              8.21 |        21.00 |
|               | 3      |       21.00 |         21.00 |              8.21 |        21.00 |
| sepia         | 1      |        6.92 |          7.29 |              6.89 |         4.22 |
|               | 2      |        6.92 |          7.29 |              6.89 |         4.22 |
|               | 3      |        6.92 |          7.29 |              6.89 |         4.22 |
| blueprint     | 1      |        5.04 |          4.60 |              6.10 |         7.21 |
|               | 2      |        5.04 |          4.60 |              6.10 |         7.21 |
|               | 3      |        5.28 |          4.80 |              6.42 |         7.57 |
| solstice      | 1      |        5.32 |         10.19 |              3.71 |         3.85 |
|               | 2      |        5.32 |         10.19 |              3.71 |         3.85 |
|               | 3      |        5.32 |         10.19 |              3.71 |         3.85 |
| brutalism     | 1      |        8.74 |         13.31 |              4.61 |        18.73 |
|               | 2      |        8.74 |         13.31 |              4.61 |        18.73 |
|               | 3      |        8.74 |         13.31 |              4.61 |        18.73 |
| deco          | 1      |        8.16 |          8.74 |              4.61 |         9.08 |
|               | 2      |        8.08 |          8.86 |              4.56 |         9.66 |
|               | 3      |        8.16 |          8.19 |              4.61 |         9.25 |
| phantom       | 1      |        5.24 |         17.85 |              5.24 |        17.01 |
|               | 2      |        5.24 |         17.85 |              5.24 |        17.01 |
|               | 3      |        5.24 |         17.85 |              5.24 |        17.01 |
| shade-light   | 1      |        3.65 |          5.85 |              4.42 |         6.07 |
|               | 2      |        3.65 |          5.79 |              4.42 |         5.97 |
|               | 3      |        3.65 |          5.79 |              4.42 |         5.97 |
| shade-dark    | 1      |        5.46 |          6.91 |              4.64 |         4.10 |
|               | 2      |        5.46 |          6.91 |              4.64 |         4.10 |
|               | 3      |        5.46 |          6.91 |              4.64 |         4.10 |
| retro         | 1      |        9.15 |         11.62 |              4.15 |         8.76 |
|               | 2      |        9.05 |         11.50 |              4.11 |         8.49 |
|               | 3      |        9.05 |         11.50 |              4.11 |         8.65 |
| grotesk       | 1      |        4.99 |         18.73 |              6.07 |         8.54 |
|               | 2      |        4.99 |         18.73 |              6.07 |         8.54 |
|               | 3      |        4.99 |         18.73 |              6.07 |         8.54 |
| lapis         | 1      |        3.57 |          5.99 |              3.16 |         4.43 |
|               | 2      |        3.57 |          5.99 |              3.16 |         4.43 |
|               | 3      |        3.57 |          5.99 |              3.16 |         4.43 |
| nostromo      | 1      |        3.61 |          8.27 |              4.32 |         7.13 |
|               | 2      |        3.61 |          8.27 |              4.32 |         7.13 |
|               | 3      |        3.61 |          8.27 |              4.22 |         7.13 |
| titanium      | 1      |        4.77 |          9.68 |              5.89 |        12.28 |
|               | 2      |        4.78 |          9.68 |              5.89 |        12.28 |
|               | 3      |        4.80 |          9.68 |              5.89 |        12.28 |

## Round 3: one pick per aspect

Kenny, 2026-10-05 18:45, judging formal: "I like the shape of option 1, but the
loading behaviour of option 2, so you need to keep these things separate so I
could choose one over another, also do this for the other things you like to
show me." Nothing is bundled any more. Per theme the meter has five aspects,
each its own choice group in the review dialog with three options:

| Group id  | Label in the dialog   | What differs                                                             |
| --------- | --------------------- | ------------------------------------------------------------------------ |
| `shape`   | Shape                 | the track, the share, the mark, the sign past the end                    |
| `loading` | While loading         | the loading picture                                                      |
| `arrival` | How the share arrives | how the share comes in after loading and on **Drawn**                    |
| `tone`    | When the tone changes | the share re-inked (the picked arrival replayed) or the meter moved once |
| `mark`    | The mark past the end | how the mark moves, where a mark past the end stands, its glyph          |

Shape 1 is the shape approved in round 1 (forest, retro, grotesk: round 2's new
shape); shape 2 is the theme's other round-1 character; shape 3 is a new shape
drawn in the theme's world (forest, retro, grotesk: round 1's second
character). The other four aspects keep round 2's option names: option N of
`loading`, `arrival`, `tone` and `mark` is the matching part of round 2's
option N. Every option's name and what it does is its hint in the dialog and
its text on the page (`IDEAS` in `demo.js`); the shape's option 1 says
"Approved in round 1" or "New in round 2".

**How it composes.** Each aspect is one attribute on the meters' wrapper
(`[data-cm]` plus `data-cm-shape`, `data-cm-loading`, `data-cm-arrival`,
`data-cm-tone`, `data-cm-mark`), and every rule in `meters.css` names exactly
one of them, so any combination works. `meters.css` is ordered by aspect, then
theme, then option. Two entanglements of round 2 were split: a tone that
re-inks used to replay its own option's arrival keyframes; the arrival now
names its keyframes in `--cm-arr-o`, `--cm-arr-w` and `--cm-arr-d`, and the
re-inking tone switches `animation-name` to the toned one, so it replays
whichever arrival is picked. And three loading pictures moved the track itself
(synthwave's grid road, sepia's platen, phantom's halftone), which only worked
on their own shape; each now draws its own pattern on `::after`. The
round-1 characters' own loading pictures were left out of shapes 2 and 3:
loading is its own aspect.

**The page.** At the top of the section, "Your combination": the four meters
of round 2 (62 %, 130 %, an inline 91 %, the package's three signs) drawn with
the current picks, the picks in words beside them. Below it one row per aspect,
three meters each that differ in that aspect only, every other aspect at its
current pick (option 1 until ticked); the mark row shows a meter whose mark
moves on **Mark past the end** and one whose mark stands at 115 % throughout.
Ticking an option in the dialog fires `review:choice`; the page writes it on
the preview and the rows' other aspects, and outlines the ticked option in its
row. The ticks are kept per theme while the page is open. The controls (State,
Tone, Speed) are unchanged in the `data-review-controls` container.
`data-review-round` is `2026-10-05-r3`, reopening `<theme>|meter` in all 22
themes.

| Theme         | Shape 1                                 | Shape 2                       | Shape 3 (new unless noted)      | Options 1 / 2 / 3 of the other four aspects                     |
| ------------- | --------------------------------------- | ----------------------------- | ------------------------------- | --------------------------------------------------------------- |
| formal        | The bound volume and its ribbon         | The ledger column             | The signature line and its seal | Written into the ledger / Stamped and filed / Counted in tenths |
| light         | Daylight                                | The seam and its circle       | The folded note                 | Morning light / The shadow swings / Through the window          |
| dark          | The machined channel                    | The spectrometer              | The OLED strip                  | Machined / Milled in passes / Pressed in the die                |
| cyberpunk     | The neon tube with a glitch tick        | The HUD segment gauge         | The barcode                     | Ignition / Data burst / Packet sync                             |
| synthwave     | Chrome over the grid                    | The neon sign                 | The VHS tracking bar            | Sunrise / Overdrive / Arcade attract                            |
| pastel        | Washi tape                              | Gummy candy                   | The bead bracelet               | Boing / Pressed sticker / Dropped in                            |
| terminal      | The htop meter                          | The oscilloscope              | The download line               | Line by line / Redraw / Typed out                               |
| forest        | The wooden gauge with the trail's marks | The wooden gauge with a leaf  | The trail on the map (round 1)  | Footsteps / Growth rings / Blazed trail                         |
| high-contrast | The pattern-coded gauge                 | The ink frame                 | The slotted gauge               | At once / In two steps / In quarters                            |
| sepia         | The letterpress impression              | The pen stroke and the blot   | The bookbinder’s thread         | The platen / Quill stroke / Set in type                         |
| blueprint     | The engineer's scale with a break line  | The tolerance band            | The dimension line              | The plotter / Dimensioned / Redrawn                             |
| solstice      | The standing stones                     | The embers                    | The horizon                     | Long dawn / The shadow lengthens / Stone by stone               |
| brutalism     | The stacked blocks                      | The slab with an overhang     | The concrete formwork           | Thrown on / Slammed / Block by block                            |
| deco          | The lobby floor indicator               | The gilt frieze               | The ziggurat                    | The lift ascends / Gilt sweep / Fanfare                         |
| phantom       | The calling card                        | The ransom collage            | The slashed slab                | Card thrown / Cut out / The stamp                               |
| shade-light   | The pencil gauge                        | The pin and its shade         | The paper cut-out               | Hatched in / Pressed paper / Passing shade                      |
| shade-dark    | Silverpoint                             | The reading lamp              | The stitched leather            | Silver drawn / Lifted / Lamp passes                             |
| retro         | The system monitor                      | The dithered installer bar    | The defragmenter (round 1)      | Task Manager / Winamp / Disk light                              |
| grotesk       | The transit line                        | The red block on the baseline | The zebra scale (round 1)       | Departure / Express / Timetable                                 |
| lapis         | The gilt band                           | Lapis stone on vellum         | The tile frieze                 | Gold laid / Reed stroke / Tile by tile                          |
| nostromo      | The backlit vents                       | The bargraph tube             | The punched tape                | Power up / Relay clack / Warm-up                                |
| titanium      | The heat-tinted groove                  | The vernier caliper           | The anodised bar                | Cut / Heat tint / Machined tick                                 |

### Measured, round 3

Firefox (Playwright's, its own `http.server` on 127.0.0.1:8731, under `flock
/tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport 1400 × 1000 at
2×, one run of 4 min 14 s:

- **Console:** 0 errors and page errors on all 44 pages (22 themes × with and without
  reduced motion) through all 9 states (3 states × 3 tones), and 0 in the dialog run.
- **Heights:** each of the 34 meter rows and sentences of a theme (preview and 15 aspect meters' rows),
  offset height of the row and of its meter, in all 9 states: one height each, in every theme and both motion settings
  (0 rows with more than one).
- **Every aspect meter renders and differs:** in each theme, each of the five rows' three meters has a width, and
  computed styles that differ between neighbours in that aspect (shape: track, share and mark styles; loading, in
  Loading: the meter's and ::after's picture and animation; arrival: the share's animation, duration, easing and
  transition; tone, in Warning: the meter's animation and the share's animation name; mark, past the end: the glyph,
  the mark's transition, position and lean): 110 of 110 rows pass (1 ≠ 2 and 2 ≠ 3), and 1 ≠ 3 in 110.
- **The preview follows the dialog:** a `review:choice` dispatched on the section for each aspect changes the
  preview's attribute and its computed style in that aspect, and outlines the ticked option: 110 of 110.
- **Reduced motion:** 0 running animations in any of the 9 states in all 22 themes.
- **The dialog** (`?next=/kp-themes/review/catalogue/changed.html&review=open`, served locally): every one of the 22
  steps shows the five groups `shape, loading, arrival, tone, mark` (22/22); Approve is refused with none ticked
  (22/22) and with four of five ticked (22/22), and goes through with all five (22/22); the ticks reached the
  preview (22/22). No option is pre-ticked: the kit has no default yet (see Open).
- **Mark contrast**, per shape and tone, Drawn, still frames: each mark pixel (core or halo) against the pixel of the
  same meter it covers (a second screenshot with the mark hidden), the mark's best tenth; on the fill = the 130 %
  meter, on the track = the 62 % meter, both with the mark at 80 %. This differs from round 2's method (a strip 4 to
  9 px beside the mark), which misread patterned fills and wide ornaments. All 396 values are at or above 3:1; the lowest
  is formal shape 1, none (3.39).

| Theme         | Shape |  Fill | Fill, warning | Fill, destructive | Track |
| ------------- | ----: | ----: | ------------: | ----------------: | ----: |
| formal        |     1 | 11.29 |          5.78 |              6.88 |  3.39 |
|               |     2 | 15.64 |         15.64 |             15.64 | 15.88 |
|               |     3 | 11.28 |          5.78 |              6.91 |  6.93 |
| light         |     1 |   9.4 |          5.78 |              6.48 | 15.32 |
|               |     2 |   9.4 |          5.78 |              6.48 |  17.2 |
|               |     3 |   9.4 |          5.78 |              6.48 |  17.2 |
| dark          |     1 | 16.73 |         10.79 |              8.44 | 14.75 |
|               |     2 |  17.1 |          17.1 |              17.1 |  17.1 |
|               |     3 | 16.73 |         10.79 |              6.86 |  17.1 |
| cyberpunk     |     1 | 14.78 |         11.74 |              8.34 | 13.88 |
|               |     2 | 16.25 |         11.74 |             10.08 | 11.83 |
|               |     3 | 16.25 |         11.74 |              5.07 | 13.88 |
| synthwave     |     1 |  13.7 |         14.22 |              13.7 | 14.48 |
|               |     2 | 11.81 |         13.33 |             11.81 | 13.44 |
|               |     3 |  5.98 |         14.24 |              5.66 | 13.48 |
| pastel        |     1 |  6.45 |          6.14 |              6.17 | 11.26 |
|               |     2 |  6.45 |          6.14 |              6.17 | 11.26 |
|               |     3 |  5.22 |          4.96 |                 5 |  7.65 |
| terminal      |     1 | 12.68 |         12.56 |             13.86 | 14.94 |
|               |     2 | 11.46 |         11.31 |             11.44 | 15.57 |
|               |     3 | 15.57 |         15.57 |             15.57 | 15.57 |
| forest        |     1 |  8.06 |          6.45 |              6.35 | 11.42 |
|               |     2 |  8.06 |          6.45 |              6.35 | 11.42 |
|               |     3 |  8.06 |          6.45 |              6.35 | 13.86 |
| high-contrast |     1 |    21 |            21 |                21 |    21 |
|               |     2 |    21 |         13.89 |              8.21 |    21 |
|               |     3 | 10.86 |            21 |              8.21 |    21 |
| sepia         |     1 |  6.92 |          7.29 |              6.95 |  4.22 |
|               |     2 |  6.92 |          7.29 |              6.89 | 13.21 |
|               |     3 |  6.92 |          7.29 |              6.89 | 13.21 |
| blueprint     |     1 |  8.63 |         13.07 |              6.42 |  7.57 |
|               |     2 |  5.04 |          4.51 |              6.25 |  7.57 |
|               |     3 |  9.68 |         15.17 |              4.94 | 13.33 |
| solstice      |     1 |  7.42 |         15.02 |              5.18 |  6.48 |
|               |     2 | 11.25 |         15.55 |              9.46 | 12.09 |
|               |     3 |   6.4 |         13.83 |              4.11 |  9.32 |
| brutalism     |     1 | 13.31 |         13.31 |             13.31 | 18.73 |
|               |     2 | 18.73 |         18.73 |             18.73 | 18.73 |
|               |     3 | 13.31 |         18.23 |              6.31 | 15.94 |
| deco          |     1 | 12.56 |         16.17 |             13.77 | 15.01 |
|               |     2 |  8.16 |         16.17 |              8.16 |  8.16 |
|               |     3 |  6.06 |          4.75 |              4.75 |  8.16 |
| phantom       |     1 |  5.33 |         12.66 |              5.33 | 18.36 |
|               |     2 |  5.78 |         18.08 |              5.78 | 15.43 |
|               |     3 | 18.86 |         18.86 |             18.86 | 18.97 |
| shade-light   |     1 |  5.39 |          5.89 |              6.18 |  6.07 |
|               |     2 |  5.39 |          5.85 |              6.18 |   5.3 |
|               |     3 |  5.39 |          5.85 |              6.18 |   5.3 |
| shade-dark    |     1 |  5.46 |          6.91 |              4.64 |  6.06 |
|               |     2 |  5.46 |          6.91 |              4.64 |  6.06 |
|               |     3 |  5.46 |          5.86 |              4.64 |  4.72 |
| retro         |     1 | 13.69 |         13.69 |             13.69 | 13.57 |
|               |     2 | 12.21 |         13.06 |              8.68 | 13.69 |
|               |     3 | 13.06 |         13.94 |             13.06 | 13.69 |
| grotesk       |     1 | 18.73 |         18.73 |             18.73 | 18.73 |
|               |     2 |  4.99 |         18.73 |              6.07 | 17.18 |
|               |     3 | 18.73 |         18.73 |              6.07 | 18.73 |
| lapis         |     1 |  7.97 |         14.98 |              6.82 |  4.43 |
|               |     2 |  6.64 |         14.98 |              6.82 | 11.88 |
|               |     3 |     5 |          7.11 |              4.11 |  4.58 |
| nostromo      |     1 |  5.75 |         11.54 |              7.64 | 11.07 |
|               |     2 |  5.47 |         11.46 |              5.39 | 11.07 |
|               |     3 |   8.8 |         12.13 |              6.08 |  8.21 |
| titanium      |     1 |  6.08 |          9.68 |              5.89 | 12.47 |
|               |     2 |  9.13 |          6.96 |              5.37 |  5.37 |
|               |     3 | 11.19 |          8.36 |              5.38 | 14.63 |

### Open, round 3

- No option is pre-ticked. The 19 shapes approved in round 1 (formal too, by Kenny's 18:45 verdict) should count as
  answered with shape 1 ticked; the review kit has no way to pre-tick a choice (a `default` on a choice group), and
  the kit was not changed in this round. Until it has one, Kenny ticks Shape 1 himself; its hint says it was
  approved.
- The page keeps the ticks per theme only while it is open; after a reload the preview starts at option 1 until a
  choice is ticked again (the dialog itself remembers them).
