# A time chart of its own, per theme

**Judged (2026-10-05 20:03).** Kenny judged all 22 themes from To judge: 19 approved with a pick, 3 not approved. His condition on every approval: the loading screens are NOT approved; he wants them as a separate aspect ("I want those in a separate demo"). Picks: Character 2 for formal, light, dark, terminal, phantom, retro, lapis; Character 1 for cyberpunk, synthwave, pastel, forest, sepia, blueprint, deco, shade-light, shade-dark, grotesk, nostromo, titanium. Not approved: high-contrast ("don't like the options, get new ones"), solstice ("I like the background of character 1, but the riveted tooltip from character 2, combine them"), brutalism ("don't like it, get a new proposal").

Kenny, form v18 (2026-10-05): the character round, one component at a time,
all 22 themes in one demo. The meter came first
(`research/character-meter`); this is the second component, the time chart.

`.kp-chart` (css/components.css, "Time chart", scope-143; js/chart.js) is
today the same shape in every theme: a clear plot with three grid lines, the
lines in `--chart-1..5` over a soft area, the popover as its tooltip, round
legend buttons, a pulsing block while it loads, in the theme's tokens only.
This demo gives every theme two charts drawn in its own world, beside the
plain chart of today.

## Files

- `demo.html`: one section judged per theme with the review kit
  (`../_review/review.js`): one choice per theme, "Character 1",
  "Character 2" or "The plain chart, as today", each character's name and
  parts as the option's hint for that theme. The controls sit inside the
  section, so they move into the review dialog with it: State (Readings,
  Loading, No readings, Error), Sources (one: the lone area and no legend;
  two: soft areas; three: the lines alone), Show (the tooltip pinned at
  07:30 with the alarm and the restart in reach, on by default; Zoomed, which
  brings the zoom chip; a source pressed, which strikes the others and shows
  Show all; a source singled out), and the speed of every animation (full,
  ½, ¼).
- `charts.css`: the 44 characters, in `@layer kp.signature`, scoped
  `[data-theme='<name>'] [data-cc='a'|'b']`. In a register the same rules
  read `[data-theme='<name>'] .kp-chart` (and `.kp-chart-zoom`). The
  contract every character keeps, and the knobs the shared part wires to
  the chart's parts (`--cc-paper`, `--cc-grid`, `--cc-tick`, `--cc-line-w`,
  `--cc-area-k`, `--cc-area-mask`, `--cc-s1..5`, …), are at the top of the
  file; every loop is in one `prefers-reduced-motion: no-preference` block
  at its end.
- `demo.js`: the names and descriptions (`IDEAS`), the review choices and
  look-at lines built from them, the readings (the catalogue's pump houses,
  `catalogue/chart-sample.js`, the last 24 hours), the states and toggles
  driven through the package's own API (`setChartData()`, `chartSelect()`,
  `chartZoom()`, and the plot's keys End, ← and Enter for the pin), the
  speed control.
- `demo.css`: the page layout only, and a 220px plot (instead of 168px) so a
  pinned tooltip leaves the lines in view in a column a third of the page
  wide.

Each column is one chart group: its range buttons (6 h, 24 h) and zoom chip,
the pressure chart (two sources, the alarm level at 2.1 bar dashed, three
events above the plot) and two of the group's spark lines. js/chart.js
draws everything, so hover, drag to zoom, click to pin, the keys and the
legend behave the same in all three columns; js/chart.js is not changed.

## The characters

| Theme         | Character 1                                                                                                                                                                                                                             | Character 2                                                                                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| formal        | The annual report: navy rule over the plot, dotted hairline grid, serif old-style tick figures, a footnote tooltip, underlined legend words, a still dotted leader while loading                                                        | The ledger graph: column rules every tenth, the baseline closed with the double rule, ledger (mono) figures, a hatched area, a ruled ledger-slip tooltip, index-tab legend; still                                   |
| light         | The seam: no frame, seams for the grid, an area fading to the baseline, a white card tooltip with the divider's open circle on the crosshair's side, a still dashed seam while loading                                                  | Daylight: a pale sky and the sun in the top corner, every line throwing a soft shadow, a frosted-glass tooltip, a band of daylight crossing while loading                                                           |
| dark          | The spectrometer: a black slit with rulers along top and foot, glowing lines over fading areas, a black slab tooltip with the oxide film, bracketed `[ ]` legend; still spectrum                                                        | The machined pocket: chamfered corners, engraved grid and figures, chamfered plate tooltip and keys; the empty pocket, still                                                                                        |
| cyberpunk     | The neon HUD: scan grid, corner brackets, neon tubes over scanned areas, a glitch tearing through every 3.2 s, notched tooltip and legend, the data stream while loading                                                                | The hazard terminal: a yellow frame with hazard stripes, cyan dot grid, hard lines over 45° hatching, a yellow tooltip plate, crawling hazard stripes while loading                                                 |
| synthwave     | The grid floor horizon: night sky over a perspective floor with a pink horizon, neon tubes with light cores, VT323 cyan figures, a pink-to-cyan bordered tooltip; the floor drives while loading                                        | The VHS playback: the striped sun setting behind the plot, a tracking band, scan-lined areas, the VCR's on-screen display as tooltip and legend; the band rolls while loading                                       |
| pastel        | Candy: plump pastel paper, dotted riso grid, thick candy lines with a flat sticker shadow, candy-cane striped areas, a sticker-bubble tooltip, candy pills; a candy hops while loading                                                  | Washi tape and riso: riso grain, two strips of washi tape on the corners, lines with an off-register second pass, halftone areas, a taped note tooltip; tape stripes drift while loading                            |
| terminal      | The braille plot: lines and areas made of braille dots, box-drawing dashes for the grid, a double-line `═` tooltip, a `[x]` checklist legend; a walking cell and a 1 Hz caret while loading                                             | The oscilloscope: graticule with minor ticks, phosphor trace and afterglow, the yellow cursor as crosshair, a measurement-box tooltip, lit channel keys; the beam sweeps while loading                              |
| forest        | The ranger's logbook: kraft paper with fibres, ruled lines and a clay margin, italic figures, pencil-hatched areas, a luggage-tag tooltip; a leaf drifts while loading                                                                  | The contour map: contour rings, clay trail dashes for the grid, spaced figures, lake-blue areas, a map key in a double neatline, trail-blaze swatches; the dashes walk while loading                                |
| high-contrast | The ink frame: 2px ink frame, bold figures, every source told by pattern too (solid, dashed, dotted; hatched, cross-hatched, dotted areas), framed legend inked when pressed; three still ink squares                                   | The inverse plate: an ink plate with every line in white, told apart by pattern alone, a yellow crosshair and yellow tooltip plate, white-framed ink legend; a still dashed line                                    |
| sepia         | A nib on laid paper: laid and chain lines, serif italic figures, nib lines with an ink bleed over a fading wash, a double-ink-rule slip; the pen writes a stroke and lets it fade while loading                                         | The letterpress specimen: a blind impression, speckled inked lines, stippled areas, a printed slip with a fleuron ❧, a pilcrow ¶ legend; the platen presses while loading                                           |
| blueprint     | The millimetre paper: 1 mm and 1 cm rulings, drafting mono figures, section-hatched areas, an amber chain-line crosshair, a title-block tooltip; a plotter dash runs while loading                                                      | The drawing frame: double border with zone ticks and registration marks, construction-line grid, the first line in white ink, a callout tooltip whose leader points to the crosshair; marching dashes while loading |
| solstice      | The low sun: a low sun warming the bottom corner, grid lines as long shadows, serif figures, warm glowing lines, a charcoal slab tooltip with an ember edge; a dawn rises while loading                                                 | The embers: a charcoal log with ember specks, glowing filament lines over ember speckle, an iron plate tooltip with four rivets; embers breathe while loading                                                       |
| brutalism     | The slab: 3px box with the hard shadow, heavy dashed grid, bold figures, thick square-ended lines over candy areas, chunky buttons that press in; the yellow-and-black tape runs while loading                                          | The sticker sheet: a lavender sheet in a black frame, every line a sticker with a black outline, a black tooltip plate, sticker-pill legend; blocks drop in while loading                                           |
| deco          | The gilt rules: black lacquer between double gold rules, long-short gold hairlines, deco capitals, fluted areas, a double-gold tooltip with stepped corners; a glint runs along the gilt while loading                                  | The sunburst: a gold fan from the foot under an arched gold frame, a deep emerald plaque tooltip between gold rules, jewelled lamp legend; the fan opens while loading                                              |
| phantom       | The stamped ledger: white-ruled ledger with a red margin and a slanted rubber-stamp frame, grainy stamp-ink lines, condensed capitals, a white index-card tooltip; the halftone slides while loading                                    | The calling card: black under a halftone, red lines with a deep red second plate off register, a red slash at the foot, a slanted ransom-note tooltip, cut-paper scraps; the halftone shuffles in hard steps        |
| shade-light   | Pencil in the shade: pencil grid, serif italic figures, lines throwing a soft shade over pencil-hatched areas, a lifted card; the plot is hatched in once while loading                                                                 | The leaf shade: dappled leaf shade on the paper, crisp lines, a soft-shaded card and pills; a cloud's shade passes while loading                                                                                    |
| shade-dark    | Silverpoint: silver hatching on the dark ground, lines lit along their upper edge, silver-hatched areas, a silver-hairline card; hatched in once while loading                                                                          | The reading lamp: a pool of lamplight with shade at the edges, lit lines, a lamp-lit card and pills; the pool slides while loading                                                                                  |
| retro         | The plotter on fanfold paper: green-bar bands, tractor holes and perforations, pixel figures, a crisp plotter pen, a 1995 tooltip, bevelled legend buttons that sink; still (nothing blinks)                                            | The spreadsheet chart of 1995: a grey sunken plot, black grid, dithered areas, a little window with a navy title bar as tooltip, the legend in a raised frame; still dither                                         |
| grotesk       | The Swiss grid: one heavy black baseline, hairlines, bold flush figures, flat sharp lines, a black tooltip plate, a red square before the pressed source; three squares cut in, hard steps                                              | The zebra scale: a twelve-column zebra along the foot, column grid, black and red lines, a red tooltip plate, a legend numbered 01, 02; the zebra hops while loading                                                |
| lapis         | Lapis on vellum: an ivory vellum plot in a double gold frame, lapis and vermilion ink lines, Markazi figures, a lapis plate tooltip, vellum strips under the spark lines; a burnisher's glint while loading                             | The gilt lattice: a faint girih lattice in a double gold frame, gold-leaf lines with a glint, lattice-tooled areas, a toranj (pointed cartouche) tooltip; a glint runs along the gold                               |
| nostromo      | The amber CRT: a dark CRT set in the beige case with vignette and scanlines, amber and cream phosphor lines, a block cursor that blinks when pinned, a phosphor readout tooltip, beige keys with an LED; the screen warms while loading | The strip-chart recorder: orange millimetre grid on the paper roll, ink and orange pens, an embossed label-tape tooltip with V-cut ends, label-tape legend; the roll feeds while loading                            |
| titanium      | The engraved dial face: brushed titanium, engraved grid and figures, anodised lines, a machined plate tooltip held by four screws, machined keys; the cutter runs linearly while loading                                                | The vernier: carbon weave, a vernier scale along the top, the blue-oxide zero line as crosshair, a sliding-plate tooltip with a knurled edge, knurled keys; the knurl rolls while loading                           |

Loading in every character keeps the plot's height and shows a still frame
that cannot be read as readings (a leader, a ruled page, a rail, a still
spectrum, three squares, a dither); where the theme allows motion it moves on
top of that. Themes whose rules forbid loops keep theirs still: formal 1 and
2, light 1, dark 1 and 2, high-contrast 1 and 2, retro 1 and 2. Two loops run
at rest: cyberpunk 1's glitch (a frame every 3.2 s) and nostromo 1's pinned
block cursor (once a second; it stays lit while the pointer moves, as a
terminal cursor does).

## Measured

Firefox (Playwright's, one script, its own `http.server`, under
`flock /tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport
1600 × 1200 at 2×:

- **Console:** 0 errors and 0 page errors in all 22 themes, with and
  without reduced motion, through every state.
- **Heights:** the plot's box measured in all four states (readings,
  loading, no readings, error) in every column: one height per plot in all
  66 columns (the "Plot" column below; a framed character is its frame
  wider than 220px, the same in every state).
- **Reduced motion:** with `prefers-reduced-motion: reduce`, 0 running
  animations in every column in every state, loading included, in all 22
  themes.
- **Contrast**, from the screenshot's pixels: each part shot twice, once as
  drawn and once with its ink removed (text made transparent, or one
  source's line stroke made transparent); over the pixels that differ, the
  95th percentile of the contrast between the two shots, which is the ink's
  core against what is right under it (paper, pattern, area, scanlines
  included). Per element, the lowest element counts: every tick label;
  every text of the pinned tooltip (head, rows, change plates, foot,
  events); the zoom chip; the legend's labels and values; the words of the
  empty and the error state (the lower of the two); the line of source 1
  and of source 2. Every character is at or above 4.5:1 for text and 3:1
  for the line, in every theme. The lowest: ticks dark 2 (4.60), tooltip
  light 1 (4.51, the package's own change plates, 4.5x in the plain chart
  too), line 1 brutalism 1 (3.15, the plain chart's own 3.15), line 2
  pastel 1 (3.09).

| Theme         | Option |   Plot | Ticks | Tooltip | Zoom chip | Legend | State words | Line 1 | Line 2 | Animates (loading, and at rest)                    |
| ------------- | ------ | -----: | ----: | ------: | --------: | -----: | ----------: | -----: | -----: | -------------------------------------------------- |
| formal        | 1      | 220 px |  6.84 |    4.56 |     15.93 |   7.01 |        6.85 |   7.80 |   3.28 | nothing (still)                                    |
|               | 2      | 222 px | 15.91 |    4.55 |     15.93 |   7.01 |        6.85 |   7.85 |   3.46 | nothing (still)                                    |
|               | plain  | 220 px |  6.80 |    4.57 |     15.94 |   6.85 |        6.85 |   7.78 |   3.16 | kp-pulse                                           |
| light         | 1      | 220 px |  6.77 |    4.51 |     17.20 |   6.77 |        6.77 |   6.68 |   3.95 | nothing (still)                                    |
|               | 2      | 220 px |  6.33 |    4.51 |     17.20 |   6.77 |        6.61 |   6.21 |   3.94 | cc-li-day                                          |
|               | plain  | 220 px |  6.77 |    4.51 |     17.20 |   6.77 |        6.77 |   6.68 |   3.19 | kp-pulse                                           |
| dark          | 1      | 222 px |  5.28 |    8.41 |     16.26 |   5.02 |        5.28 |  12.27 |   4.94 | nothing (still)                                    |
|               | 2      | 220 px |  4.60 |    8.41 |     16.26 |   5.02 |        5.28 |  12.57 |   5.17 | nothing (still)                                    |
|               | plain  | 220 px |  5.02 |    8.41 |     16.26 |   5.02 |        5.02 |  11.95 |   5.14 | kp-pulse                                           |
| cyberpunk     | 1      | 220 px | 13.76 |    8.23 |     12.68 |   5.97 |        6.36 |  14.93 |  11.44 | cc-cy-glitch, cc-cy-stream (at rest: cc-cy-glitch) |
|               | 2      | 224 px | 15.12 |    8.23 |     12.68 |   6.36 |        5.97 |  15.26 |  13.03 | cc-cy-hazard                                       |
|               | plain  | 220 px |  5.58 |    8.23 |     12.68 |   5.89 |        5.97 |  15.26 |  11.67 | kp-pulse                                           |
| synthwave     | 1      | 220 px | 12.69 |    8.64 |     10.11 |   5.36 |        5.51 |   6.99 |   9.73 | cc-sw-drive                                        |
|               | 2      | 222 px | 13.64 |    8.84 |     10.25 |  14.16 |        6.94 |   6.01 |  12.75 | cc-sw-track                                        |
|               | plain  | 220 px |  4.93 |    8.69 |     10.25 |   4.94 |        5.14 |   4.55 |  10.39 | kp-pulse                                           |
| pastel        | 1      | 220 px |  5.99 |    4.63 |     13.77 |  11.51 |        6.12 |   3.85 |   3.09 | cc-pa-hop                                          |
|               | 2      | 220 px |  6.78 |    4.63 |     13.77 |  12.47 |        6.78 |   4.22 |   3.41 | cc-pa-drift                                        |
|               | plain  | 220 px |  6.78 |    4.63 |     13.77 |   6.78 |        6.78 |   4.22 |   3.17 | kp-pulse                                           |
| terminal      | 1      | 222 px |  8.32 |    4.57 |     12.96 |   8.03 |        8.36 |  11.90 |   7.07 | cc-tm-walk, cc-blink                               |
|               | 2      | 224 px |  8.57 |    4.57 |     12.96 |   8.03 |        8.62 |  11.20 |   6.79 | cc-tm-sweep                                        |
|               | plain  | 220 px |  6.17 |    4.65 |     12.96 |   8.03 |        6.04 |  11.96 |   9.08 | kp-pulse                                           |
| forest        | 1      | 220 px |  5.79 |    4.59 |     13.86 |   6.41 |        5.79 |   4.86 |   3.58 | cc-fo-leaf                                         |
|               | 2      | 222 px | 13.86 |    4.59 |     13.86 |   6.41 |        6.41 |   5.38 |   3.52 | cc-fo-walk                                         |
|               | plain  | 220 px |  6.41 |    4.59 |     13.86 |   6.41 |        6.41 |   5.38 |   3.66 | kp-pulse                                           |
| high-contrast | 1      | 224 px | 21.00 |   10.86 |     21.00 |  21.00 |       12.63 |  10.21 |   8.21 | nothing (still)                                    |
|               | 2      | 224 px | 21.00 |   10.86 |     21.00 |  21.00 |       21.00 |  21.00 |  21.00 | nothing (still)                                    |
|               | plain  | 220 px | 12.63 |   10.86 |     21.00 |  12.63 |       12.63 |  10.21 |   7.39 | kp-pulse                                           |
| sepia         | 1      | 220 px |  6.11 |    6.98 |     13.21 |   6.11 |        6.11 |   5.33 |   5.24 | cc-se-write                                        |
|               | 2      | 220 px | 12.44 |    6.98 |     13.21 |   6.11 |        5.76 |   5.10 |   5.73 | cc-se-press                                        |
|               | plain  | 220 px |  6.11 |    6.98 |     13.21 |   6.11 |        6.11 |   5.41 |   5.60 | kp-pulse                                           |
| blueprint     | 1      | 222 px |  9.68 |    7.54 |     13.33 |   8.17 |        9.15 |   9.68 |   8.47 | cc-run-x                                           |
|               | 2      | 226 px |  8.17 |    7.54 |     13.33 |   8.17 |        8.17 |  13.33 |   5.95 | cc-bp-march                                        |
|               | plain  | 220 px |  8.17 |    7.54 |     13.33 |   8.17 |        8.17 |   8.64 |   6.77 | kp-pulse                                           |
| solstice      | 1      | 220 px |  5.30 |    7.90 |     12.72 |   6.20 |        7.62 |   6.40 |   3.72 | cc-so-dawn                                         |
|               | 2      | 222 px |  7.45 |    7.90 |     12.72 |   6.94 |        8.24 |   8.65 |   6.76 | cc-so-breathe                                      |
|               | plain  | 220 px |  7.62 |    7.90 |     12.72 |   7.62 |        7.62 |   6.40 |   4.18 | kp-pulse                                           |
| brutalism     | 1      | 226 px | 18.73 |   11.20 |     18.73 |  18.73 |        9.29 |   3.15 |   4.34 | cc-br-tape                                         |
|               | 2      | 226 px |  8.74 |   11.20 |     18.73 |  18.73 |        8.74 |   8.74 |   7.99 | cc-br-drop                                         |
|               | plain  | 220 px |  9.29 |   11.20 |     18.73 |   9.29 |        9.29 |   3.15 |   5.09 | kp-pulse                                           |
| deco          | 1      | 220 px |  7.96 |    7.33 |     13.87 |   9.38 |       10.14 |   8.65 |   6.90 | cc-run-x                                           |
|               | 2      | 222 px |  8.38 |    7.33 |     13.87 |   9.38 |       10.14 |   8.65 |   6.10 | cc-de-fan                                          |
|               | plain  | 220 px |  9.38 |    7.33 |     13.87 |   9.38 |        9.38 |   8.00 |   5.80 | kp-pulse                                           |
| phantom       | 1      | 220 px | 17.01 |    6.07 |     17.01 |   7.99 |        8.00 |   4.79 |  13.23 | cc-ph-slide                                        |
|               | 2      | 222 px | 18.86 |    6.07 |     17.01 |  18.86 |        8.82 |   5.29 |  14.09 | cc-ph-shuffle                                      |
|               | plain  | 220 px |  7.55 |    6.07 |     17.01 |   7.93 |        8.00 |   4.78 |  13.46 | kp-pulse                                           |
| shade-light   | 1      | 220 px |  5.39 |    6.27 |      6.07 |   5.39 |        5.39 |   5.39 |   3.77 | cc-sh-hatch                                        |
|               | 2      | 220 px |  5.15 |    6.27 |      6.07 |   5.39 |        5.39 |   5.29 |   3.36 | cc-sh-cloud                                        |
|               | plain  | 220 px |  5.39 |    6.27 |      6.07 |   5.39 |        5.39 |   5.39 |   3.47 | kp-pulse                                           |
| shade-dark    | 1      | 220 px |  5.44 |    5.00 |      5.44 |   5.12 |        5.12 |   4.90 |   6.44 | cc-sh-hatch                                        |
|               | 2      | 220 px |  5.59 |    5.00 |      5.44 |   5.12 |        4.83 |   4.90 |   5.58 | cc-sh-lamp                                         |
|               | plain  | 220 px |  5.12 |    5.00 |      5.44 |   5.12 |        5.12 |   4.90 |   5.90 | kp-pulse                                           |
| retro         | 1      | 220 px | 14.25 |    8.30 |     11.97 |  11.97 |       10.35 |  15.67 |   5.94 | nothing (still)                                    |
|               | 2      | 220 px |  9.26 |    8.30 |     11.74 |  11.97 |        5.61 |   8.71 |   3.68 | nothing (still)                                    |
|               | plain  | 220 px |  6.93 |    8.30 |     11.74 |   7.13 |        7.10 |  10.78 |   4.08 | kp-pulse                                           |
| grotesk       | 1      | 220 px | 18.73 |    7.63 |     18.73 |  18.73 |        5.74 |   4.99 |  16.87 | cc-gr-cut                                          |
|               | 2      | 222 px |  5.74 |    4.99 |     18.73 |  18.73 |        5.74 |  18.73 |   4.42 | cc-gr-zebra                                        |
|               | plain  | 220 px |  5.74 |    7.63 |     18.73 |   5.74 |        5.74 |   4.99 |  16.87 | kp-pulse                                           |
| lapis         | 1      | 222 px | 10.38 |    6.09 |      9.39 |   5.26 |       10.96 |  10.96 |   4.93 | cc-la-burnish                                      |
|               | 2      | 226 px |  6.14 |    6.09 |      9.39 |   5.26 |        6.14 |   5.83 |   3.94 | cc-run-x                                           |
|               | plain  | 220 px |  5.26 |    6.09 |      9.39 |   5.26 |        5.26 |   5.00 |   3.16 | kp-pulse                                           |
| nostromo      | 1      | 226 px |  4.64 |    5.14 |     10.61 |   7.63 |       11.03 |   4.95 |   9.78 | cc-no-warm, cc-blink (at rest: cc-blink)           |
|               | 2      | 222 px | 11.86 |    6.21 |     10.61 |  12.37 |        6.53 |   4.74 |  10.91 | cc-no-feed                                         |
|               | plain  | 220 px |  5.84 |    6.21 |     10.61 |   5.84 |        5.84 |   4.24 |   9.80 | kp-pulse                                           |
| titanium      | 1      | 222 px |  5.78 |    7.41 |     13.33 |   8.86 |        4.92 |   4.52 |   3.60 | cc-ti-cut                                          |
|               | 2      | 222 px |  5.48 |    7.41 |     13.33 |  13.33 |        5.48 |   5.66 |   4.27 | cc-ti-knurl                                        |
|               | plain  | 220 px |  4.74 |    7.41 |     13.33 |   4.74 |        4.74 |   4.89 |   3.81 | kp-pulse                                           |

`kp-pulse` is the plain chart's own loading pulse; in the character columns
the legend's placeholder stubs keep it (the register's skeleton), which the
table leaves out.

## Open for the package

- **The plot's inner box is not exposed.** js/chart.js computes the drawing
  area (`P.l`, `P.t`, `P.r`, `P.b`: the tick gutters) and keeps it inside;
  a paper pattern (millimetre paper, a graticule, a zebra, ledger columns)
  is therefore laid over the whole plot, gutters included, not aligned to
  the axes. Writing them as `--kp-chart-inset-*` on `.kp-chart__plot` would
  let a register align its paper.
- **The baseline has no class.** formal 2 (the double rule) and grotesk 1
  (the heavy baseline) find it as `.kp-chart__grid:nth-of-type(1)`, which is
  the draw order, not a contract; a `kp-chart__grid--base` class would make
  it one.
- **The tick gutter assumes about 7px per figure** (`P.l`), so a wide tick
  type would run out of the plot; every character keeps its tick type at
  that width or below (Michroma, nostromo's display face, is not used for
  ticks). A register knob for the gutter would free this.
- **The tooltip's change column is a fixed 4.5rem.** A wider type wraps the
  change onto two lines: the plain chart in terminal does so today (visible
  in its column, a finding). The characters with a mono or display type
  widen it through `--cc-delta-w` and `--cc-tip-max`; in the package that
  would be `--kp-chart-delta-width`.
- **The busy dim greys the paper.** layout.css dims every `[aria-busy]` to
  0.7, so a loading plot's paper turns grey (the dark CRT of nostromo 1
  looked lit). The characters set `--kp-busy-opacity: 1` on the plot: their
  loading picture already says busy.
- **A consumer's own source colour bypasses a character's colours.**
  `series.colour` is written inline, so a character that remaps the sources
  for its paper (nostromo 1's phosphor, lapis 1's inks on vellum,
  high-contrast 2's white, blueprint 2's white ink, grotesk 2's black first)
  does not reach it: `var(--chart-2)` given by a page would be dark brown on
  nostromo 1's dark screen. The demo's spark lines drop the catalogue's
  colour for that reason. A register needs a way in (for instance the
  chart reading `--kp-chart-n` it defines, rather than a literal token).
- **The SVG is drawn again on every pointer move**, so nothing inside it can
  loop; every loop lives on the plot's or the state box's pseudo-elements,
  and nostromo 1's blinking cursor restarts while the pointer moves.
- **An event's warning dot is pale in the tooltip.** `--warning-foreground`
  on the popover all but disappears in shade-light (the plain chart too);
  characters with a coloured tooltip plate ring their dots in the plate's
  ink (`--cc-dot-ring`).
- **Patterns on the lines and areas use `mask-image` on SVG paths**
  (hatching, halftone, dither, braille dots, letterpress speckle), which
  Firefox and Chromium both draw (checked once while building); on the
  spark lines the pattern is stretched by their `preserveAspectRatio:
none`.
- The range buttons are the theme's own `.kp-button`; no character restyles
  them.

## Round 2: one pick per aspect

Kenny, 2026-10-05 20:03 (the verdicts at the top), and his standing rule of
the same day that every aspect is its own choice. The demo now works like
`research/character-meter` round 3: per theme six aspects, each picked on
its own from three options, in the review dialog as six choice groups.

- **Shape** (the drawn chart: paper, frame, grid, tick labels, lines and
  areas, legend). The 19 approved themes: 1 = the character picked in
  round 1 (ticked by `default`), 2 = the other character, 3 = the plain
  chart. High-contrast and brutalism: three new shapes (`round2.css`).
  Solstice: 1 = the low sun (round 1's character 1), 2 the hearth and 3
  midsummer dusk (new).
- **While loading**: open in every theme, three new pictures per theme, every
  one of them animated at full motion and still under reduced motion; no
  fades. One generic picture per kind in `aspects.css`
  (`data-cc-loading="cutter"`, `"type"`, `"scan"`, …, 25 kinds), inked from
  the theme's tokens through `--ccl-ink`/`--ccl-ink2` and, for a typed
  prompt, `--ccl-text`, which demo.js sets per option.
- **How the series arrives** (after Loading, and on Drawn) and **how a new
  reading shows** (Live update moves every source on by one reading). The
  approved themes: 1 = round 1's own (at once, ticked), 2 and 3 animated;
  the three open themes: three animated. js/chart.js draws the SVG anew on
  every pointer move, so the motion runs on the plot as a registered
  `--cca-k`/`--ccu-k` (0 → 1) that the series read; the wrapper carries
  `data-cc-arriving`/`data-cc-updating` while it plays.
- **The event dots**: open everywhere; the approved themes' option 1 is the
  dots as the shape draws them.
- **The pinned tooltip**: the approved themes: 1 = the picked character's
  (ticked), 2 = the other character's, 3 = the plain popover. Solstice: 1 =
  the riveted iron plate (round 1's character 2, his request), 2 = the
  charcoal slab, 3 = a bronze plaque (new). High-contrast and brutalism:
  three new tooltips. The tooltip is pinned only in its own row and the
  preview; elsewhere it would hide a third-width plot.

Each aspect is one attribute on the chart's wrapper: `data-cc-shape` and
`data-cc-tip` (charts.css, round 1's rules split by a one-off script: the
tooltip's rules keyed on `data-cc-tip`, the rest on `data-cc-shape`, the
round-1 loading rules removed; round2.css), `data-cc-loading`,
`data-cc-arrival`, `data-cc-update`, `data-cc-events` (aspects.css). demo.js
maps the option number per theme to its key (`OPTIONS`, built from `PICK`,
`R2`, `NEW` and round 1's `IDEAS`). The page shows "Your combination" at the
top (the ticked picks, option 1 where nothing is ticked, following
`review:choice`), then one row per aspect with three charts that differ in
that aspect only. `data-review-round` "2026-10-05-r2" reopens all 22 themes.

### The options per theme

The loading, arrival, update and event kinds are in brackets.

| Theme                | Shape 1 · 2 · 3                                                                          | While loading 1 · 2 · 3                                                                            | Arrives 1 · 2 · 3                                                                              | New reading 1 · 2 · 3                                                                      | Event dots 1 · 2 · 3                                                                               | Pinned tooltip 1 · 2 · 3                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| formal               | The ledger graph · The annual report · The plain chart, as today                         | The fountain pen (pen) · The ruling pen (dash) · The received stamp (stamp)                        | As approved: at once (none) · Entered from the left (wipe) · Written in by hand (draw)         | As approved: it appears (none) · The new line entered (tail) · The page moved on (shift)   | As the shape draws them (shape) · Open circles (ring) · Pins in the margin (pin)                   | The tooltip of the ledger graph · The tooltip of the annual report · The plain tooltip                         |
| light                | Daylight · The seam · The plain chart, as today                                          | Sunlight along the seam (glint) · Morning rising (rise) · Three beads (hop)                        | As approved: at once (none) · Grows into the light (rise) · Drawn in, softly (wipe)            | As approved: it appears (none) · Slides along (shift) · A new piece drawn (tail)           | As the shape draws them (shape) · The divider's open circle (ring) · A dot in its own light (halo) | The tooltip of Daylight · The tooltip of the seam · The plain tooltip                                          |
| dark                 | The machined pocket · The spectrometer · The plain chart, as today                       | The slit scan (sweep) · The mill pass (cutter) · The calibration ring (radar)                      | As approved: at once (none) · Milled in, evenly (linear) · Exposed top down (scan)             | As approved: it appears (none) · The new cut (tail) · Indexed one step (tick)              | As the shape draws them (shape) · Engraved rings (ring) · Lit markers (target)                     | The tooltip of the machined pocket · The tooltip of the spectrometer · The plain tooltip                       |
| cyberpunk            | The neon HUD · The hazard terminal · The plain chart, as today                           | The HUD scan (scan) · The jack-in prompt (type) · The data perimeter (march)                       | As approved: at once (none) · Glitched in (glitch) · Scanned in (scan)                         | As approved: it appears (none) · A glitch (glitch) · A packet in (tick)                    | As the shape draws them (shape) · Lock-on markers (target) · Neon beacons (halo)                   | The tooltip of the neon HUD · The tooltip of the hazard terminal · The plain tooltip                           |
| synthwave            | The grid floor horizon · The VHS playback · The plain chart, as today                    | The floor drives on (feed) · The sun comes up (rise) · The tracking line (scan)                    | As approved: at once (none) · Up from the horizon (rise) · Rolled in like tape (scan)          | As approved: it appears (none) · The floor rolls on (shift) · A neon swell (swell)         | As the shape draws them (shape) · Neon beacons (halo) · Neon rings (ring)                          | The tooltip of the grid floor horizon · The tooltip of the VHS playback · The plain tooltip                    |
| pastel               | Candy · Washi tape and riso · The plain chart, as today                                  | Sugar cubes (blocks) · The riso dots shuffle (halftone) · A ribbon pulled through (tape)           | As approved: at once (none) · Bounces up (rise) · Unwrapped from the middle (centre)           | As approved: it appears (none) · A happy hop (jolt) · Puffs up (swell)                     | As the shape draws them (shape) · Candy drops (halo) · Sticker rings (ring)                        | The tooltip of Candy · The tooltip of Washi tape and riso · The plain tooltip                                  |
| terminal             | The oscilloscope · The braille plot · The plain chart, as today                          | The prompt (type) · The progress bar (segments) · The phosphor sweep (sweep)                       | As approved: at once (none) · Printed column by column (steps) · Refreshed top down (scan)     | As approved: it appears (none) · One line scrolls (tick) · The new sample drawn (tail)     | As the shape draws them (shape) · Open cells (ring) · Lit cells (target)                           | The tooltip of the oscilloscope · The tooltip of the braille plot · The plain tooltip                          |
| forest               | The ranger's logbook · The contour map · The plain chart, as today                       | The pencil sketch (pen) · The compass needle (needle) · A pine cone drops (drop)                   | As approved: at once (none) · Sketched in (draw) · Grows from the ground (rise)                | As approved: it appears (none) · The new mile walked (tail) · The trail moves on (shift)   | As the shape draws them (shape) · Trail pins (pin) · Waymarks (ring)                               | The tooltip of the ranger's logbook · The tooltip of the contour map · The plain tooltip                       |
| high-contrast (open) | The signal board · The highlighter · Large print                                         | The progress bar (segments) · Three ink squares, cut in (blocks) · The marching frame (march)      | In ten clear steps (steps) · Drawn in from the left (wipe) · At an even pace (linear)          | One clear tick (tick) · The new piece drawn (tail) · Just there (none)                     | Heavy rings (ring) · Ink pins (pin) · Beaded rings (bead)                                          | The inverse plate · The yellow card · The large-print card                                                     |
| sepia                | A nib on laid paper · The letterpress specimen · The plain chart, as today               | The dip pen (pen) · The platen comes down (stamp) · The engraver's dots (halftone)                 | As approved: at once (none) · Written with the nib (draw) · Pressed into the paper (stamp)     | As approved: it appears (none) · A new stroke (tail) · The page turns on (shift)           | As the shape draws them (shape) · Ink rings (ring) · Wax-seal beads (bead)                         | The tooltip of a nib on laid paper · The tooltip of the letterpress specimen · The plain tooltip               |
| blueprint            | The millimetre paper · The drawing frame · The plain chart, as today                     | The plotter pen (dash) · The scanner bar (sweep) · The protractor arm (needle)                     | As approved: at once (none) · Plotted in (draw) · Traced at an even pace (linear)              | As approved: it appears (none) · The next segment plotted (tail) · Indexed one step (tick) | As the shape draws them (shape) · Datum circles (ring) · Reference marks (target)                  | The tooltip of the millimetre paper · The tooltip of the drawing frame · The plain tooltip                     |
| solstice (open)      | The low sun · The hearth · Midsummer dusk                                                | Embers rising (embers) · The sun rising (rise) · Firelight along the rule (glint)                  | Rises like the sun (rise) · Lit from the left (wipe) · Drawn in fire (draw)                    | Flares once (swell) · A new ember (tail) · The day moves on (shift)                        | Glowing embers (halo) · Rivets (bead) · Iron rings (ring)                                          | The riveted iron plate · The charcoal slab · The bronze plaque                                                 |
| brutalism (open)     | The poster · The concrete block · The cut-out                                            | The block drop (drop) · Hazard tape (hazard) · Cut in three (blocks)                               | Dropped in (drop) · In hard steps (steps) · Slammed on (stamp)                                 | A hard jolt (jolt) · A hard tick (tick) · Just there (none)                                | Black pins (pin) · Bolts (bead) · Fat rings (ring)                                                 | The hard box · The black slab · The lavender sticker                                                           |
| deco                 | The gilt rules · The sunburst · The plain chart, as today                                | The fan rays (fan) · The marquee lights (march) · The elevator dial (needle)                       | As approved: at once (none) · Opens like a curtain (centre) · Rises like a skyline (rise)      | As approved: it appears (none) · Glides on (shift) · A new gilt piece (tail)               | As the shape draws them (shape) · Jewelled studs (bead) · Gold rings (ring)                        | The tooltip of the gilt rules · The tooltip of the sunburst · The plain tooltip                                |
| phantom              | The calling card · The stamped ledger · The plain chart, as today                        | The calling-card stamp (stamp) · The typewriter (type) · Cut-out letters (blocks)                  | As approved: at once (none) · Stamped on (stamp) · Torn in (glitch)                            | As approved: it appears (none) · A hard jolt (jolt) · Torn (glitch)                        | As the shape draws them (shape) · Red marks (target) · Pinned notes (pin)                          | The tooltip of the calling card · The tooltip of the stamped ledger · The plain tooltip                        |
| shade-light          | Pencil in the shade · The leaf shade · The plain chart, as today                         | The pencil hatches, over and over (hatch) · The pencil line (pen) · Sun through the leaves (glint) | As approved: at once (none) · Drawn in pencil (draw) · The shade moves off (wipe)              | As approved: it appears (none) · A new pencil stroke (tail) · Slides on (shift)            | As the shape draws them (shape) · Pencil rings (ring) · Pins (pin)                                 | The tooltip of Pencil in the shade · The tooltip of the leaf shade · The plain tooltip                         |
| shade-dark           | Silverpoint · The reading lamp · The plain chart, as today                               | Silverpoint hatching (hatch) · The lamp warms up (rise) · The torch beam (sweep)                   | As approved: at once (none) · Drawn in silver (draw) · Lit from the left (wipe)                | As approved: it appears (none) · A new silver stroke (tail) · Slides on (shift)            | As the shape draws them (shape) · Silver rings (ring) · Lamp-lit dots (halo)                       | The tooltip of Silverpoint · The tooltip of the reading lamp · The plain tooltip                               |
| retro                | The spreadsheet chart of 1995 · The plotter on fanfold paper · The plain chart, as today | The dither bar (dither) · The 1995 progress bar (segments) · The DOS prompt (type)                 | As approved: at once (none) · Painted in steps (steps) · Redrawn top down (scan)               | As approved: it appears (none) · One step on (tick) · Repainted (none)                     | As the shape draws them (shape) · Push pins (pin) · Bevel rings (ring)                             | The tooltip of the spreadsheet chart of 1995 · The tooltip of the plotter on fanfold paper · The plain tooltip |
| grotesk              | The Swiss grid · The zebra scale · The plain chart, as today                             | The ruled bar (segments) · The column count (dash) · The square drops (drop)                       | As approved: at once (none) · Column by column (steps) · At an even pace (linear)              | As approved: it appears (none) · One column on (tick) · The new column (tail)              | As the shape draws them (shape) · Black pins (pin) · Red marks (target)                            | The tooltip of the Swiss grid · The tooltip of the zebra scale · The plain tooltip                             |
| lapis                | The gilt lattice · Lapis on vellum · The plain chart, as today                           | The astrolabe (radar) · The reed pen (pen) · The gilt border (march)                               | As approved: at once (none) · Written with the reed (draw) · Unrolled from the middle (centre) | As approved: it appears (none) · A new stroke of ink (tail) · A gilt swell (swell)         | As the shape draws them (shape) · Gilt studs (bead) · Gold rings (ring)                            | The tooltip of the gilt lattice · The tooltip of Lapis on vellum · The plain tooltip                           |
| nostromo             | The amber CRT · The strip-chart recorder · The plain chart, as today                     | MU-TH-UR at the prompt (type) · The motion tracker (radar) · The CRT warms (scan)                  | As approved: at once (none) · Drawn by the beam (scan) · Plotted in steps (steps)              | As approved: it appears (none) · The roll ticks on (tick) · The pen kicks (jolt)           | As the shape draws them (shape) · Blips (target) · Rings on the glass (ring)                       | The tooltip of the amber CRT · The tooltip of the strip-chart recorder · The plain tooltip                     |
| titanium             | The engraved dial face · The vernier · The plain chart, as today                         | The mill pass (cutter) · The dial indicator (needle) · The laser etch (sweep)                      | As approved: at once (none) · Milled in, linearly (linear) · Etched in (draw)                  | As approved: it appears (none) · Indexed one step (tick) · The new cut (tail)              | As the shape draws them (shape) · Screw heads (bead) · Machined rings (ring)                       | The tooltip of the engraved dial face · The tooltip of the vernier · The plain tooltip                         |

### Measured (round 2)

Firefox (Playwright's, its own `http.server`, under
`flock /tmp/kp-themes-shot.lock`), 2026-10-05, 22 themes × full and reduced
motion, through Drawn, Loading, No readings, Error, Drawn, Live update, every
Show toggle and one, three and two sources:

- **Console:** 0 errors and 0 page errors in all 44 runs.
- **Chart boxes:** every plot keeps one height through every state (44 of 44).
- **Rows:** in every row the three options differ in that row's aspect
  (retro's update row had round 1's "at once" twice; fixed after the run, not
  measured again). One height per row holds where the shape is the same in
  all three cells; the shape row differs by the frame of each shape (as in
  round 1, a framed shape is its frame taller than 220px), which the run did
  not separate from the other rows.
- **The preview** follows `review:choice` for every aspect and option, in
  all 44 runs.
- **Loading:** at full motion every loading option runs 3 to 5 animations
  (66 of 66); under reduced motion 0 running animations in the whole section,
  loading, arrival and update included.
- **The dialog** (formal): six choice groups of three; shape, arrival,
  update and tooltip ticked with 1, loading and the event dots open; the 15
  controls mirrored; ticking loading 2 moves the preview from pen to dash;
  0 errors.
- **Contrast** of the new shapes (high-contrast, brutalism, solstice 2 and 3)
  and tooltips: not measured yet; the first run's clipped shots fell outside
  the viewport, and the rerun could not get the shared screenshot lock
  before the time box ended.

### Measured again (round 2, contrast and rows)

Firefox (Playwright's), 2026-10-05 21:32 to 21:51, DOM reads only (no
screenshots, so without the shared screenshot lock), four processes against
an own `http.server` on 127.0.0.1:8771, 22 themes × full and reduced motion.
Contrast is computed: the ink's computed colour (text `color` or SVG `fill`,
a line's or ring's `stroke`, a swatch's or dot's background, border or ring)
against the plate it sits on, resolved up the ancestors (background colours,
covering gradients at their worst stop, a pseudo-element plate within 6px of
the box); a rivet or dot gradient at a spot and a dimmed series while another
is singled out (the package's own fade) are not plates or inks. Measured:
the shape row of high-contrast, brutalism and solstice (Drawn, a source
pressed, a source singled out) and the pinned tooltip row of every theme.

- **Before the fixes:** 53 failing inks or texts (per element, over the
  states) in 12 themes, the same in both motion settings. The shared tooltip
  rules were keyed on `data-cc-shape`, so a tooltip picked with another shape
  lost its dot ring (`transparent`) and the package's own ring (fix-97) as
  well, also in the plain tooltip: event dots 1.04:1 to 2.89:1 in cyberpunk,
  deco, high-contrast, brutalism, nostromo, shade-light and shade-dark;
  tooltip swatches 1.00:1 to 2.88:1 (formal, high-contrast, lapis, nostromo,
  brutalism). Brutalism's black slab: "Open" 1.00:1 and the change pills
  white on light blue 1.67:1; br2's first source 2.31:1 on the concrete;
  pressed swatches 1.00:1 to 2.14:1 (br1 to br3). High-contrast: the info and
  warning events white on white (or 1.51:1 on the highlighter), because their
  tone tokens are the paper's white there.
  Solstice: the low sun's ticks 4.31:1 and the hearth's 4.13:1, the second
  source 2.48:1 to 2.59:1 and a critical ember 2.22:1 to 2.32:1 where the glow
  is strongest. Layout: dark's tooltip 2 (the spectrometer's, under the
  machined pocket) wrapped its first event line (20 times); no text was cut
  (cyberpunk's "Show all" overflows by its 1px notch only, its text fits).
- **Fixes** (tokens only, one aspect per rule): `charts.css` the shared
  tooltip rules keyed on `data-cc-tip`, the dot ring `currentColor` by
  default, every tooltip's swatch ringed in the tooltip's ink
  (`--cc-swatch-ring`), cyberpunk's notch split into its tooltip and its
  legend, dark's spectrometer tooltip carries its own width, solstice's low
  sun ticks in `--foreground`; `round2.css` high-contrast's event tones
  (`--foreground`, `--warning`), brutalism's pressed swatches ringed, the
  black slab's link and swatches in `--card` with the pills in their own ink,
  br2's first source darkened from `--chart-1`, the hearth's ticks in
  `--foreground`, and on solstice's two glows `--chart-2` and the critical
  tone lifted.
- **After:** 3,510 contrast checks, 0 failures in all 44 runs; the lowest
  text 4.51:1, the lowest line, ring or swatch 3.15:1.
- **Rows:** every plot keeps one height through every state (Drawn, Loading,
  No readings, Error, Live update during and after, every Show toggle, one,
  three and two sources), each chart on its own, in all 44 runs; in the
  five rows other than the shape the three charts have one height in each
  state; the shape row's charts differ only by their frames. The figure
  under the plot grows and shrinks with the legend (sources, Loading), the
  same in every option.
- **Retro's update row:** "At once", "One step on", "The new column painted"
  (`none`, `tick`, `tail`): three distinct options; every row in every theme
  has three distinct keys.
- **Wrap and cut:** 0 labels or tooltip lines wrap and 0 are cut
  (`scrollWidth > clientWidth` with the text past the box) in any cell, state
  or theme. Console: 0 errors.
