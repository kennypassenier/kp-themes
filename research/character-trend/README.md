# A trend tile of its own, per theme

Kenny, form v18 (2026-10-05): the character round, one component at a time,
all 22 themes in one demo. The meter (`research/character-meter`), the time
chart (`research/character-chart`), the month heatmap
(`research/character-calendar`) and the network graph
(`research/character-graph`) came first; this is the fifth component, the key
figure with its 24-hour trend.

`.kp-kpi--trend` (css/components.css, "A key figure with its 24-hour trend",
scope-143; js/chart.js draws the trend, js/kpi.js its line) is today the same
shape in every theme: a card with the label in small capitals and ↗ in the
corner (the whole tile is a link), the number with its unit, a line of words,
the 24-hour line over a soft area in the series colour, and the axis under it
(where the line starts, and `now`); a pointer, a finger or the arrow keys read
one point with a crosshair and a chip; grey skeletons while it loads. This
demo gives every theme two tiles drawn in its own world, beside the plain tile
of today.

## Files

- `demo.html`: one section judged per theme with the review kit
  (`../_review/review.js`): one choice per theme, "Character 1",
  "Character 2" or "The plain tile, as today", each character's name and
  parts as the option's hint. The controls sit inside the section, so they
  travel into the review dialog: State (Drawn, Loading, Nothing to draw,
  Could not read, and a live update ten minutes later), Figure (pressure, a
  long label, a wide value, a figure that stopped 40 minutes ago, one that
  began this morning, one reading, the warning tone), and the speed of every
  animation.
- `trends.css`: the 44 characters, in `@layer kp.signature`, scoped
  `[data-theme='<name>'] [data-tr='a'|'b']`. In a register the same rules
  read `[data-theme='<name>'] .kp-kpi--trend`. The contract and the shared
  knobs (`--tr-plate`, `--tr-pat`, `--tr-over`, `--tr-frame`, `--tr-label-*`,
  `--tr-num-*`, `--tr-line-*`, `--tr-area*`, `--tr-plot-*`, `--tr-axis-*`,
  `--tr-delta-*`, `--tr-load`, `--tr-load-anim`, …) are at the top of the
  file; every loop is in one `prefers-reduced-motion: no-preference` block
  at the end, and only the loading picture ever moves.
- `demo.js`: the names and descriptions (`IDEAS`), the review choices and
  look-at lines built from them, the readings (pump house 1, every ten
  minutes, "now" fixed at 20/10/2026 14:40 in Brussels and handed to
  `attachTrendCharts()` as its clock), the states driven through the
  package's own `setTrendData()`, the speed control.
- `demo.css`: the page layout only; the three columns share their rows (a
  subgrid), so the three tiles start on one line.

js/chart.js and js/kpi.js are not changed.

## What js/kpi.js and js/chart.js do not hand a character

Found while building; each would want a change in a module, so none of the
44 characters leans on it:

- **No loading or error state of the trend's own.** `setTrendData(null)`
  marks the tile `aria-busy` and leaves the plot empty; an error is an empty
  `points` like "no readings yet", so a character cannot draw "could not
  read" differently from "nothing to draw" (the page's words say which). The
  loading picture here is drawn on the plot's `::before` under
  `[aria-busy='true']`.
- **The skeletons are the page's markup**, not the module's: the number and
  the words are written by the page (the catalogue writes `.kp-skeleton`
  with an inline height). A character has to size the number's skeleton
  itself (`0.7lh` here) to keep the tile's height when its number is
  smaller or larger than the package's 1.75rem.
- **No end-point marker, gradient or pattern in the SVG**: drawSparkline()
  writes two paths with no `<defs>`, so a dot on the last reading, a
  gradient under the line or a hatched area cannot be drawn; the area takes
  one fill and an opacity. Grids, rules and scanlines are the plot's
  background and `::after` instead.
- **The line is drawn with `vector-effect: non-scaling-stroke` in a
  `preserveAspectRatio="none"` box**, so a dash pattern is in screen pixels
  but the line's joins are stretched; a stepped (character-cell) line, as a
  terminal would draw it, is not possible.
- **The series colour lives on the figure** (`--kp-chart-series`), not on
  the tile, so a stripe or a frame on the tile in the series colour cannot
  read it (grotesk 1's top bar takes `--primary`).
- **The change (`.kp-kpi__delta`) has no plate of its own in the package**:
  it is coloured with `--success-foreground` and `--destructive` on the
  card, half a status pair (fix-70). Every character here gives it the pair
  (the plate and its own ink); the plain tile keeps the package's, which is
  a finding below.

## The characters

| Theme         | Character 1                                                                                                                                                                                                          | Character 2                                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| formal        | The engraved plate: a ruled double frame, the label in the serif’s small capitals, the number in the display serif, the line engraved as a fine rule with no wash under it, the change boxed like an engraved figure | The annual report: a heavy rule above the label, the number large in the display serif, the line over ledger rules with a ruled baseline, the axis in small capitals, the change in italics on its own plate |
| light         | The soft card: A white card lifted on a soft shadow, a wider radius, the line soft and round-capped over a fuller wash, the change as a soft pill                                                                    | Daylight: A pale sky over the line, from the primary wash at the top to the card at the foot, the sun as a warm glow in the corner, the change as a pill                                                     |
| dark          | The status board: the number lit in ticker mono, the plot a dark well with a fine grid, the line lit with a soft glow, the change as a lit square chip                                                               | The machined panel: the label in mono capitals, the line in a recessed slot (an inner shadow above, a lit lip below), the change as a flat machined tab                                                      |
| cyberpunk     | The neon trace: the line a neon tube with its glow, the number in tech mono with a cyan halo, cut corners on the frame, the change as a cut-corner chip                                                              | The glitch HUD: yellow brackets at the corners of the plot, the number with an RGB split, the line a square-capped data stream, hazard tape along the top edge                                               |
| synthwave     | The grid-floor horizon: The plot is a perspective grid floor under a pink horizon, the line a sunset laser with its glow, the number in VT323, the change on a glass chip                                            | The VCR display: OSD numerals, scanlines over the tile, the line a hard square trace, the change as an inverse block                                                                                         |
| pastel        | The sticker chart: the line fat and round-capped like icing, the change as a sticker with its own flat shadow, the number in the rounded face                                                                        | The washi planner: A dotted planner pad with a strip of washi tape across the top of the tile, the line a dashed doodle, the change as a taped label                                                         |
| terminal      | The top(1) row: everything in the mono, the label in capitals, the line square-joined in the phosphor, the change in reverse video                                                                                   | The dumb-terminal plot: the plot a grid of character cells, the line drawn in dots like a row of asterisks, the axis in brackets of rules, the change underlined                                             |
| forest        | The ranger’s logbook: the label in serif italic, contour rings behind the line, the line a moss trail with round caps, the change on a wooden tag                                                                    | The canopy: a leaf-green wash on the card, the area under the line a dense canopy, the line a twig in bark ink, the change on a leaf tag                                                                     |
| high-contrast | Ink and frame: the number bold, the line 3px with no wash, a solid baseline under it, the change as a framed plate with its own ink                                                                                  | The inverse plate: an ink plate with the line drawn in the paper colour, the label bold, the number heavy, the change framed                                                                                 |
| sepia         | The barograph: the plot is ruled chart paper (fine level lines and hour lines in sepia), the line a fine nib trace, an aged vignette on the paper                                                                    | Letterpress: the number pressed into the sheet, the label in small capitals, the line a heavier ink rule, the change as a printed border                                                                     |
| blueprint     | The chart recorder: a millimetre grid in the plot, the line in white ink, the label and the axis in technical mono capitals                                                                                          | The title block: the tile parted into cells by drawn rules, the axis with dimension ticks, the line as a chain line over a hatched area                                                                      |
| solstice      | The low sun: a warm glow rising from the foot of the tile, the line in warm light, the change on a glowing chip                                                                                                      | The embers: the line a glowing coal with a hot halo, the wash a faint heat, the number in the serif                                                                                                          |
| brutalism     | The slab: a heavy black frame with a hard offset shadow, the label in heavy capitals, the line 3px square-capped, the change as a block with the hard shadow                                                         | The sticker sheet: the number huge and heavy, the change as an askew sticker in a black outline, the plot a white well in black                                                                              |
| deco          | The gilt frame: a double gold rule, a faint sunburst rising behind the number, the label and the number in the display face’s capitals, the change on a gold-framed plaque                                           | The marquee: a row of bulbs along the top and the foot of the plot, the number in display capitals, the change as a marquee plaque                                                                           |
| phantom       | The evidence card: the label slanted, the line as red string, the change as a stamped ring set askew                                                                                                                 | The calling card: the label skewed in display capitals, a red slash across the corner, the line in the card’s ink                                                                                            |
| shade-light   | Pencil in the shade: the plot hatched in pencil, the line a soft graphite stroke, the change on a lifted paper chip                                                                                                  | The leaf shade: Dappled leaf shade over the card, a soft line, the number on the paper                                                                                                                       |
| shade-dark    | Silverpoint: the line a silver hairline over a faint silver wash, a silver rule above the label                                                                                                                      | The reading lamp: a pool of light behind the number, the line in warm ink                                                                                                                                    |
| retro         | The 1995 dialog: a raised grey bevel around the tile, the plot a sunken white well, one-pixel line with no wash, the label in the system face without capitals, the change as a raised button                        | The performance monitor: a black well with a green grid, the line in the phosphor, the number in the mono                                                                                                    |
| grotesk       | The transit board: a thick bar in the series colour across the top, the number in bold grotesque, the line 3px round-capped, the change as a flat colour bar                                                         | The Swiss poster: the number huge and flush left, the line a hairline, the change in the red index colour on its own plate                                                                                   |
| lapis         | The girih tile: a faint star lattice on the tile, a double gold frame, the number in the display face, the line in gold                                                                                              | Lapis on vellum: the line in lapis ink, a gold rim around the plot, the label in serif italic                                                                                                                |
| nostromo      | The CRT trace: scanlines over the plot, the line a phosphor trace with its glow, the label and the number in mono capitals                                                                                           | The indicator panel: the label on embossed label tape, the change as a lit indicator lamp, the plot an embossed window                                                                                       |
| titanium      | The milled plate: a brushed grain on the tile, the plot ringed in an anodised edge, the label in small capitals, the number in instrument mono                                                                       | The instrument dial: the plot a recessed aperture with an inner shadow, a knurled band along the top of the tile, the change on a machined tab                                                               |

The still characters (formal 1 and 2, light 1, dark 1 and 2, high-contrast 1
and 2, retro 1 and 2) also stop the skeletons' pulse and the register's own
skeleton signature, so nothing on the tile moves while it loads. Nothing
loops at rest in any character.

## Measured

Firefox (Playwright's, one script, its own `http.server` on 127.0.0.1:8731,
under `flock /tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport
1600 × 1200, with and without `prefers-reduced-motion: reduce`; the fourth
full run, 56.9 s for 44 pages.

- **Console:** 0 errors and 0 page errors in all 22 themes, with and without
  reduced motion, through every state and every figure.
- **Heights:** the tile measured in all 4 states × 7 figures, and after the
  live update: one height per column in all 44 character columns (189.2 px
  in 22, the rest between 187.2 and 203 px by their frame and number
  size). The plain tile is 187.2 px in 21 themes; in retro it is 187.2 or
  205.2 px, because its label wraps (below).
- **Reduced motion:** with `prefers-reduced-motion: reduce`, 0 running
  animations in the three columns at rest and while loading, in all 22
  themes. Without it, 0 at rest as well; only the loading picture and the
  skeletons move.
- **Contrast**, from the computed styles (every colour resolved through a
  canvas, alpha composited onto the tile's plate, the plate onto the
  section): the label, the number and the words against the plate, the
  change's ink against its own plate, and the line's stroke against the
  plot's paper (or the plate where the plot has none). The table gives the
  lowest of each over the seven figures, drawn. Every character holds 4.5:1
  for text (lowest 4.51, forest's success pair) and 3:1 for the line
  (lowest 4.21).
- **Labels:** the label's text read back through a Range in every state and
  figure: wrapped (more than one line box), cut (wider than its box) and
  run under the ↗ link. 0 wrapped, 0 cut and 0 under the link in all 44
  characters. The long label is "Pressure, far end of the ring · avg 15
  min"; dark, blueprint, nostromo, retro, synthwave 1 and titanium set their
  label smaller or with less tracking to keep it on one line beside the
  link.

| Theme         | Option |           Height | Label | Number | Words | Change |  Line | Wrapped / cut | Loading animates          |
| ------------- | ------ | ---------------: | ----: | -----: | ----: | -----: | ----: | ------------: | ------------------------- |
| formal        | 1      |         192.2 px |  9.34 |  16.41 |  9.34 |   4.72 | 11.51 |         0 / 0 | nothing (still)           |
|               | 2      |         196.8 px |  9.34 |  16.41 |  9.34 |   4.72 | 11.16 |         0 / 0 | nothing (still)           |
|               | plain  |         187.2 px |  7.01 |   5.98 |  7.01 |   6.17 |  8.04 |         0 / 0 | the skeletons             |
| light         | 1      |         189.2 px |  9.29 |  17.20 |  9.29 |   4.73 |  8.66 |         0 / 0 | nothing (still)           |
|               | 2      |         189.2 px |  9.29 |  17.20 |  9.29 |   4.73 |  8.66 |         0 / 0 | tr-slide, the skeletons   |
|               | plain  |         187.2 px |  6.77 |   5.78 |  6.77 |   5.73 |  6.68 |         0 / 0 | the skeletons             |
| dark          | 1      |         187.7 px |  7.82 |  17.10 |  7.82 |   6.60 | 12.48 |         0 / 0 | nothing (still)           |
|               | 2      |         187.7 px |  7.43 |  16.26 |  7.43 |   6.60 | 13.60 |         0 / 0 | nothing (still)           |
|               | plain  |         187.2 px |  5.02 |  10.26 |  5.02 |   6.52 | 11.95 |         0 / 0 | the skeletons             |
| cyberpunk     | 1      |         189.2 px |  8.13 |  13.51 |  8.13 |   4.92 | 16.00 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         189.2 px |  8.13 |  13.51 |  8.13 |   4.92 | 15.50 |         0 / 0 | tr-glitch, the skeletons  |
|               | plain  |         187.2 px |  5.97 |  11.02 |  5.97 |   4.76 | 15.26 |         0 / 0 | the skeletons             |
| synthwave     | 1      |         198.4 px |  8.75 |  14.03 |  8.75 |   5.59 |  6.89 |         0 / 0 | tr-march-y, the skeletons |
|               | 2      |         189.2 px |  8.75 |  14.03 |  8.75 |   5.59 |  7.69 |         0 / 0 | tr-roll, the skeletons    |
|               | plain  |         187.2 px |  5.36 |  10.74 |  5.36 |   4.47 |  4.72 |         0 / 0 | the skeletons             |
| pastel        | 1      |         191.2 px |  8.43 |  13.77 |  8.43 |   4.57 |  5.67 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         189.2 px |  8.43 |  13.77 |  8.43 |   4.57 |  5.67 |         0 / 0 | tr-slide, the skeletons   |
|               | plain  |         187.2 px |  6.78 |   6.14 |  6.78 |   5.92 |  4.22 |         0 / 0 | the skeletons             |
| terminal      | 1      |         193.2 px |  9.78 |  13.50 |  9.78 |  13.50 | 12.85 |         0 / 0 | tr-blink, the skeletons   |
|               | 2      |         189.2 px |  9.78 |  13.50 |  9.78 |   4.71 | 12.85 |         0 / 0 | tr-march, the skeletons   |
|               | plain  |         187.2 px |  8.03 |  12.08 |  8.03 |   5.21 | 12.17 |         0 / 0 | the skeletons             |
| forest        | 1      |         192.2 px |  8.00 |  13.52 |  8.00 |   4.51 |  6.78 |         0 / 0 | tr-march, the skeletons   |
|               | 2      |         189.2 px |  7.17 |  12.11 |  7.17 |   4.51 |  7.58 |         0 / 0 | tr-sway, the skeletons    |
|               | plain  |         187.2 px |  6.41 |   6.45 |  6.41 |   5.92 |  5.38 |         0 / 0 | the skeletons             |
| high-contrast | 1      |         191.2 px | 17.04 |  21.00 | 17.04 |   7.18 | 14.44 |         0 / 0 | nothing (still)           |
|               | 2      |         191.2 px | 17.04 |  21.00 | 17.04 |   7.18 | 21.00 |         0 / 0 | nothing (still)           |
|               | plain  |         187.2 px | 12.63 |   1.00 | 12.63 |   1.00 | 10.21 |         0 / 0 | the skeletons             |
| sepia         | 1      |         192.2 px |  7.75 |  13.21 |  7.75 |   6.90 |  8.59 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         192.2 px |  7.75 |  13.21 |  7.75 |   6.90 |  8.25 |         0 / 0 | tr-pulse, the skeletons   |
|               | plain  |         187.2 px |  6.11 |   7.29 |  6.11 |   6.89 |  5.41 |         0 / 0 | the skeletons             |
| blueprint     | 1      |         187.7 px |  9.58 |  13.33 |  9.58 |   5.27 | 13.33 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         188.7 px |  9.58 |  13.33 |  9.58 |   5.27 |  9.64 |         0 / 0 | tr-march, the skeletons   |
|               | plain  |         187.2 px |  8.17 |  13.33 |  8.17 |   4.42 |  8.64 |         0 / 0 | the skeletons             |
| solstice      | 1      |         189.2 px |  8.99 |  12.72 |  8.99 |   5.00 |  7.14 |         0 / 0 | tr-pulse, the skeletons   |
|               | 2      |         189.2 px | 10.11 |  14.30 | 10.11 |   5.00 |  6.90 |         0 / 0 | tr-pulse, the skeletons   |
|               | plain  |         187.2 px |  7.62 |  12.72 |  7.62 |   4.11 |  6.40 |         0 / 0 | the skeletons             |
| brutalism     | 1      |         193.2 px | 12.08 |  18.73 | 12.08 |   6.31 |  5.10 |         0 / 0 | tr-stamp, the skeletons   |
|               | 2      |         202.4 px |  8.78 |  13.60 |  8.78 |   6.31 |  5.10 |         0 / 0 | tr-drop, the skeletons    |
|               | plain  |         187.2 px |  9.29 |  18.73 |  9.29 |   6.48 |  3.15 |         0 / 0 | the skeletons             |
| deco          | 1      |         189.2 px | 10.60 |  13.87 | 10.60 |   4.79 |  8.98 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         189.2 px | 10.60 |  13.87 | 10.60 |   4.79 |  8.98 |         0 / 0 | tr-march, the skeletons   |
|               | plain  |         187.2 px |  9.38 |  13.87 |  9.38 |   4.26 |  8.00 |         0 / 0 | the skeletons             |
| phantom       | 1      |         189.2 px |  9.83 |  15.86 |  9.83 |   5.31 |  4.41 |         0 / 0 | tr-pulse, the skeletons   |
|               | 2      |         189.2 px | 11.35 |  18.97 | 11.35 |   5.31 |  6.47 |         0 / 0 | tr-march, the skeletons   |
|               | plain  |         187.2 px |  7.99 |  16.46 |  7.99 |   4.81 |  4.81 |         0 / 0 | the skeletons             |
| shade-light   | 1      |         189.2 px |  5.62 |   6.07 |  5.62 |   5.27 |  5.69 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         189.2 px |  5.62 |   6.07 |  5.62 |   5.27 |  5.51 |         0 / 0 | tr-slide, the skeletons   |
|               | plain  |         187.2 px |  5.39 |   1.04 |  5.39 |   1.00 |  5.39 |         0 / 0 | the skeletons             |
| shade-dark    | 1      |         189.2 px |  5.23 |   5.44 |  5.23 |   5.38 |  4.22 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         189.2 px |  5.23 |   5.44 |  5.23 |   5.38 |  4.74 |         0 / 0 | tr-pulse, the skeletons   |
|               | plain  |         187.2 px |  5.12 |   1.27 |  5.12 |   1.25 |  4.90 |         0 / 0 | the skeletons             |
| retro         | 1      |         187.2 px |  6.77 |   9.46 |  6.77 |   7.24 | 11.14 |         0 / 0 | nothing (still)           |
|               | 2      |         189.2 px |  8.57 |  11.97 |  8.57 |   7.24 |  9.34 |         0 / 0 | nothing (still)           |
|               | plain  | 187.2 / 205.2 px |  7.13 |  11.97 |  7.13 |   1.45 | 11.02 |        16 / 0 | the skeletons             |
| grotesk       | 1      |         189.2 px |  8.72 |  18.73 |  8.72 |   6.07 |  7.32 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |           203 px |  8.72 |  18.73 |  8.72 |   6.07 |  7.32 |         0 / 0 | tr-cut, the skeletons     |
|               | plain  |         187.2 px |  5.74 |  18.73 |  5.74 |   1.00 |  4.99 |         0 / 0 | the skeletons             |
| lapis         | 1      |         187.2 px |  6.26 |   9.39 |  6.26 |   5.12 |  5.51 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         192.2 px |  5.76 |   9.35 |  5.76 |   5.12 |  6.83 |         0 / 0 | tr-slide, the skeletons   |
|               | plain  |         187.2 px |  5.26 |   9.39 |  5.26 |   4.28 |  5.00 |         0 / 0 | the skeletons             |
| nostromo      | 1      |         187.7 px |  7.15 |  10.61 |  7.15 |   6.01 |  8.11 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         187.7 px |  7.15 |  10.61 |  7.15 |   6.01 |  4.21 |         0 / 0 | tr-slide, the skeletons   |
|               | plain  |         187.2 px |  5.84 |   1.17 |  5.84 |   1.17 |  4.24 |         0 / 0 | the skeletons             |
| titanium      | 1      |         189.2 px |  6.67 |  13.33 |  6.67 |   6.09 |  6.29 |         0 / 0 | tr-slide, the skeletons   |
|               | 2      |         189.2 px |  7.72 |  15.42 |  7.72 |   6.09 |  7.06 |         0 / 0 | tr-march, the skeletons   |
|               | plain  |         187.2 px |  4.74 |   8.36 |  4.74 |   5.09 |  4.89 |         0 / 0 | the skeletons             |

### Findings on the plain tile (the package, not changed here)

- **The warning tone's number is half a pair** (`--warning-foreground` on
  the card): 1.00:1 in high-contrast, 1.04:1 in shade-light, 1.27:1 in shade-dark,
  1.17:1 in nostromo.
- **The change is half a pair** (`--success-foreground` / `--destructive`
  on the card): 1.00:1 in high-contrast, shade-light and grotesk, 1.25:1 in
  shade-dark, 1.17:1 in nostromo, 1.45:1 in retro, and between 4.11 and 4.47
  in solstice, deco, lapis, blueprint and synthwave.
- **The long label wraps in retro** (the package lets a trend's label wrap
  between words), and the tile grows from 187.2 to 205.2 px: against Kenny's
  rule that a label never wraps and that tiles in a row share one height.

### Not measured

- Phone width (the narrow tile shows ↗ alone and three lines of words) and
  the catalogue's own trend block: this round judges the three columns side
  by side at desk width.
- The keys (← →, Home, End, Esc) and the focus rings in each character: the
  module's, unchanged, and the release suite covers them.
