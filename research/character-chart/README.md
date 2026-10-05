# A time chart of its own, per theme

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
