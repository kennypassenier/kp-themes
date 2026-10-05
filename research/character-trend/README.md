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

## Structure (round 2: one pick per aspect)

Kenny, 2026-10-05 20:03: every demo gets separate options per aspect, as the
meter (`research/character-meter`), "and it should be like this in the
future". Nothing is bundled any more: per theme the tile has five aspects,
each picked on its own from three options, and any combination composes.

| Aspect                             | Attribute         | What it covers                                                                                                                       |
| ---------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Shape                              | `data-ct-shape`   | the plate, the frame, the label, the number, the plot, the line and its wash, the axis                                               |
| While loading                      | `data-ct-loading` | the picture on the plot while the tile is busy; it always moves (a still frame under reduced motion), and nothing fades              |
| How the figure and the line arrive | `data-ct-arrival` | the number and the line after loading, and on Drawn (one busy frame, then the readings)                                              |
| The tone and the change            | `data-ct-tone`    | the change's plate, and how a warning or destructive figure reads (its note, and an edge, a band, a frame or its number on the tone) |
| Live update                        | `data-ct-live`    | what a new reading does to the line                                                                                                  |

Options 1 and 2 are round 1's two characters split into their parts: their
`--tr-load*` knobs became the loading options, their `--tr-delta-*` knobs
the tone options, the rest the shape. Where both characters had the same (no
arrival and no live update in any theme; a still loading picture in formal,
dark, high-contrast and retro, which now moves; the same change in light and
grotesk), option 1 keeps it, made to move where loading was still, and option
2 is new. Option 3 is new in every aspect. Nothing is ticked for the reviewer.

- `demo.html`: the section judged with the review kit (`../_review/review.js`,
  round `2026-10-05-r2`, all 22 themes reopened). At the top "Your
  combination", one tile carrying the picks ticked in the dialog (an aspect
  not ticked yet shows its option 1); under it five rows, one per aspect, of
  three tiles that differ in that aspect only, every other aspect as ticked;
  the plain tile of today below them for reference, not as an option. The
  controls sit in `data-review-controls`, so they travel into the dialog:
  State (Drawn, Loading, Nothing to draw, Could not read, Live update ten
  minutes later), Tone (None, Warning, Destructive), Figure (pressure, a long
  label, a wide value, stopped 40 minutes ago, began this morning, one
  reading, rising is bad) and the speed of every animation.
- `trends.css`: in `@layer kp.signature`. The shared part (`[data-ct]`), then
  one rule per theme, aspect and option, `[data-theme='<name>']
[data-ct-<aspect>='<n>'] .kp-kpi--trend`, which sets that aspect's knobs
  only (330 rules); in a register the `[data-ct…]` part drops out. Every
  animation sits in one `prefers-reduced-motion: no-preference` block at the
  end; no keyframe touches opacity. The arrival runs on the svg and the
  number when the tile stops being busy; the live update runs on the line's
  paths, which js/chart.js writes anew on every draw.
- `demo.js`: `ASPECTS`, the names and descriptions (`IDEAS`, per theme five
  aspects of three options), the review choices built from them, `compose()`
  (the preview takes the picks, each row's tile its own option in its own
  aspect), the readings (pump house 1, every ten minutes, "now" fixed at
  20/10/2026 14:40 in Brussels and handed to `attachTrendCharts()` as its
  clock), the states driven through the package's own `setTrendData()`, the
  speed control.
- `demo.css`: the page layout only.

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
  (the plate and its own ink); the plain tile kept the package's (fixed
  since by fix-99).
- **No hook for "a new reading".** js/chart.js writes the line's two paths
  anew on every draw, so the live-update options run on those paths: they
  also play when the figure changes, and the number (written by the page)
  cannot take part. A register would want a mark from the module (an
  attribute for one frame on a live update) to tell the two apart.

## Round 1: the characters (now split into options 1 and 2)

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

## Round 1 measured

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

## Round 2: the options per theme

The names of the three options of every aspect; each option's description is in `demo.js` (`IDEAS`) and in the review dialog.

| Theme         | Aspect          | 1                      | 2                            | 3                     |
| ------------- | --------------- | ---------------------- | ---------------------------- | --------------------- |
| formal        | Shape           | The engraved plate     | The annual report            | The certificate       |
|               | While loading   | The dotted leader      | The ledger is ruled          | The seal is pressed   |
|               | Arrival         | At once                | Engraved                     | Entered in the ledger |
|               | Tone and change | The engraved plate     | The annual report            | The red-ink entry     |
|               | Live update     | Redrawn                | The entry is carried forward | Signed again          |
| light         | Shape           | The soft card          | Daylight                     | The paper sheet       |
|               | While loading   | The dashed baseline    | Daylight                     | A cloud passes        |
|               | Arrival         | At once                | Unfolds                      | Sunrise               |
|               | Tone and change | The soft card          | The soft outline             | The coloured tab      |
|               | Live update     | Redrawn                | A soft swell                 | The page turns        |
| dark          | Shape           | The status board       | The machined panel           | The oscilloscope      |
|               | While loading   | The ticker baseline    | The slot is scanned          | The status lamps      |
|               | Arrival         | At once                | Switched on                  | Machined in           |
|               | Tone and change | The status board       | The machined tab             | The alarm lamp        |
|               | Live update     | Redrawn                | The trace jumps              | The trace flares      |
| cyberpunk     | Shape           | The neon trace         | The glitch HUD               | The holo card         |
|               | While loading   | The neon trace         | The glitch HUD               | Packet rain           |
|               | Arrival         | At once                | Jacked in                    | The neon strikes      |
|               | Tone and change | The neon trace         | The glitch HUD               | The hazard frame      |
|               | Live update     | Redrawn                | Packet in                    | The trace burns       |
| synthwave     | Shape           | The grid-floor horizon | The VCR display              | The arcade marquee    |
|               | While loading   | The grid-floor horizon | The VCR display              | The sun rises         |
|               | Arrival         | At once                | Over the horizon             | Tape loads            |
|               | Tone and change | The grid-floor horizon | The VCR display              | The arcade warning    |
|               | Live update     | Redrawn                | The tracking jumps           | The laser flares      |
| pastel        | Shape           | The sticker chart      | The washi planner            | The cloud card        |
|               | While loading   | The sticker chart      | The washi planner            | Sprinkles             |
|               | Arrival         | At once                | Popped                       | Doodled in            |
|               | Tone and change | The sticker chart      | The washi planner            | The heart sticker     |
|               | Live update     | Redrawn                | A happy hop                  | Squished              |
| terminal      | Shape           | The top(1) row         | The dumb-terminal plot       | The curses window     |
|               | While loading   | The top(1) row         | The dumb-terminal plot       | The hash bar          |
|               | Arrival         | At once                | Printed                      | Paged in              |
|               | Tone and change | The top(1) row         | The dumb-terminal plot       | The bell              |
|               | Live update     | Redrawn                | Scrolled                     | Reverse flash         |
| forest        | Shape           | The ranger’s logbook   | The canopy                   | The herbarium sheet   |
|               | While loading   | The ranger’s logbook   | The canopy                   | Fireflies             |
|               | Arrival         | At once                | Grows                        | The trail is walked   |
|               | Tone and change | The ranger’s logbook   | The canopy                   | The trail blaze       |
|               | Live update     | Redrawn                | A branch sways               | Growth ring           |
| high-contrast | Shape           | Ink and frame          | The inverse plate            | The signal board      |
|               | While loading   | The dashed baseline    | The striped block            | The scanning bar      |
|               | Arrival         | At once                | Switched                     | Dropped               |
|               | Tone and change | Ink and frame          | The heavy frame              | The signal plate      |
|               | Live update     | Redrawn                | The bar jumps                | The bar flips         |
| sepia         | Shape           | The barograph          | Letterpress                  | The ticket stub       |
|               | While loading   | The barograph          | The ink spreads              | The drum turns        |
|               | Arrival         | At once                | The nib writes               | Pressed               |
|               | Tone and change | The barograph          | Letterpress                  | The rubber stamp      |
|               | Live update     | Redrawn                | The nib moves on             | Inked again           |
| blueprint     | Shape           | The chart recorder     | The title block              | The section view      |
|               | While loading   | The chart recorder     | The title block              | The dimension line    |
|               | Arrival         | At once                | Drafted                      | Plotted               |
|               | Tone and change | The chart recorder     | The title block              | The revision cloud    |
|               | Live update     | Redrawn                | The pen steps                | Redrawn               |
| solstice      | Shape           | The low sun            | The embers                   | The horizon           |
|               | While loading   | The low sun            | The embers                   | The sun crosses       |
|               | Arrival         | At once                | Dawn                         | Kindled               |
|               | Tone and change | The low sun            | The embers                   | The red sky           |
|               | Live update     | Redrawn                | A flare of sun               | The day moves on      |
| brutalism     | Shape           | The slab               | The sticker sheet            | The poster block      |
|               | While loading   | The stamp              | The drop                     | The hammer            |
|               | Arrival         | At once                | Slammed                      | Shoved in             |
|               | Tone and change | The slab               | The sticker sheet            | The warning poster    |
|               | Live update     | Redrawn                | Kicked                       | Shoved                |
| deco          | Shape           | The gilt frame         | The marquee                  | The skyscraper        |
|               | While loading   | The gilt frame         | The marquee                  | The sunburst opens    |
|               | Arrival         | At once                | The curtain rises            | The marquee lights    |
|               | Tone and change | The gilt frame         | The marquee                  | The gilt notice       |
|               | Live update     | Redrawn                | The bulbs chase              | Gilded                |
| phantom       | Shape           | The evidence card      | The calling card             | The ransom note       |
|               | While loading   | The stamp ring         | The calling card             | The string is pulled  |
|               | Arrival         | At once                | The card is thrown           | Slashed in            |
|               | Tone and change | The evidence card      | The calling card             | The calling card      |
|               | Live update     | Redrawn                | Snatched                     | The string twangs     |
| shade-light   | Shape           | Pencil in the shade    | The leaf shade               | The window light      |
|               | While loading   | Pencil in the shade    | The leaf shade               | Leaves sway           |
|               | Arrival         | At once                | Drawn in pencil              | Out of the shade      |
|               | Tone and change | Pencil in the shade    | The leaf shade               | The pinned note       |
|               | Live update     | Redrawn                | A breeze                     | Pencilled again       |
| shade-dark    | Shape           | Silverpoint            | The reading lamp             | The night window      |
|               | While loading   | Silverpoint            | The lamp                     | The candle            |
|               | Arrival         | At once                | Silverpoint                  | The lamp is lit       |
|               | Tone and change | Silverpoint            | The reading lamp             | The red lamp          |
|               | Live update     | Redrawn                | A glint                      | The page moves        |
| retro         | Shape           | The 1995 dialog        | The performance monitor      | The Notepad window    |
|               | While loading   | The progress blocks    | The marquee bar              | The defragmenter      |
|               | Arrival         | At once                | Painted                      | Dragged in            |
|               | Tone and change | The 1995 dialog        | The flat field               | The message box       |
|               | Live update     | Redrawn                | Repainted                    | Scrolled one          |
| grotesk       | Shape           | The transit board      | The Swiss poster             | The index card        |
|               | While loading   | The transit board      | The Swiss poster             | The flap board        |
|               | Arrival         | At once                | Set in type                  | The board flips       |
|               | Tone and change | The transit board      | The underlined figure        | The index colour      |
|               | Live update     | Redrawn                | Flipped                      | Shifted               |
| lapis         | Shape           | The girih tile         | Lapis on vellum              | The manuscript margin |
|               | While loading   | The girih tile         | The gold leaf is laid        | The star turns        |
|               | Arrival         | At once                | Illuminated                  | Inked                 |
|               | Tone and change | The girih tile         | Lapis on vellum              | The rubric            |
|               | Live update     | Redrawn                | Gilded                       | Inked again           |
| nostromo      | Shape           | The CRT trace          | The indicator panel          | The MU-TH-UR screen   |
|               | While loading   | The CRT trace          | The indicator panel          | The motion tracker    |
|               | Arrival         | At once                | Warmed up                    | Printed out           |
|               | Tone and change | The CRT trace          | The indicator panel          | The klaxon            |
|               | Live update     | Redrawn                | A blip                       | The trace rolls       |
| titanium      | Shape           | The milled plate       | The instrument dial          | The anodised badge    |
|               | While loading   | The milled plate       | The instrument dial          | The lathe             |
|               | Arrival         | At once                | Milled                       | Seated                |
|               | Tone and change | The milled plate       | The instrument dial          | The anodised tag      |
|               | Live update     | Redrawn                | A click of the dial          | A glint               |

## Round 2 measured

Firefox (Playwright), 1600 × 1200, own `http.server` on 127.0.0.1; all 22
themes, each with motion and under `prefers-reduced-motion: reduce` (44
runs, four in parallel: 4 min 21 s). Per run: seven figures × Drawn,
Loading, Nothing to draw, Could not read, Warning, Destructive, plus Live
update; every tile on the page (the preview and the fifteen in the five
rows) read in every one.

| Check                                                                                  | Result                                                               |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Console errors                                                                         | 0 in 44 runs                                                         |
| Label wrapped                                                                          | 0                                                                    |
| Label cut (text past the link's edge, or `scrollWidth > clientWidth` on label or tile) | 0, the preview included                                              |
| One height per tile across every state, tone and figure                                | every tile, 44 runs; reduced motion gives the same heights           |
| Three different options in every aspect row (that aspect's knobs compared)             | 3/3/3/3/3 in all 22 themes                                           |
| The preview follows a ticked option                                                    | 10/10 in every theme; the dialog: five groups of three, none ticked  |
| Text contrast (label, number, words, change, note; every shape and tone option)        | lowest 4.51:1 (formal, forest)                                       |
| Line against its plot                                                                  | lowest 3.42:1 (dark); nostromo shape 3 now 7.11:1, its text ≥ 4.94:1 |
| Loading moves (with motion) / at rest nothing runs                                     | one animation per loading tile, 16 on the page / 0                   |

Tile heights (px) per theme: the shape row's three options may differ from
one another, every other tile keeps option 1's shape height; e.g. formal
192/197/197, synthwave 198.5/189/200.5, high-contrast 191/191/202.5,
brutalism 193/202.5/202.5, grotesk 189/203/196.5, and 187 to 193 elsewhere.

Fixed in this round, faults rather than choices:

- **formal, every tile, long label with a tone** ("Pressure, far end of the
  ring" with "! avg 15 min"): the note ran 4.5 px under the ↗ link. The
  label's tracking is now 0.04em (shapes 1 and 3) and 0.035em (shape 2): 6.7
  px clear.
- **brutalism, arrival 2 (Slammed)**: the number's row spanned the tile, so
  `scale(1.6)` pushed it past the tile's edge for the first frames. The
  number now takes its own width (`justify-self: start`, as the package
  already does under a tone) and grows from its start; pastel's Popped, the
  other arrival that stamps the number, gets the same.
- deco shape 3, the tone options of terminal, high-contrast, deco and retro,
  and nostromo shape 3 (the darker plot) were re-measured: no cut, three
  different options, the contrast above.
