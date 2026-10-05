# A month heatmap of its own, per theme

Kenny, form v18 (2026-10-05): the character round, one component at a time,
all 22 themes in one demo. The meter (`research/character-meter`) and the
time chart (`research/character-chart`) came first; this is the third
component, the month heatmap.

`.kp-calendar` (css/components.css, "Month heatmap", scope-143; js/calendar.js)
is today the same shape in every theme: rounded plates in the status colours,
the number over its count, dashed days to come or from before, an inner ring
for today, an outer ring in the primary colour for the picked day, square
swatches in the legend, a pulse while it loads (or the theme's spinner, per
day or once over the grid). This demo gives every theme two calendars drawn
in its own world, beside the plain calendar of today.

## Files

- `demo.html`: one section judged per theme with the review kit
  (`../_review/review.js`): one choice per theme, "Character 1", "Character 2"
  or "The plain calendar, as today", each character's name and parts as the
  option's hint. The controls sit inside the section, so they travel into the
  review dialog: State (Read, Loading, Nothing to check, Could not read, and
  the live update in which today's two late copies arrive), Loading look (each
  day's own picture, `kp-calendar--busy-days`, `kp-calendar--busy-whole`),
  Month (August, September, October 2026), and the speed of every animation.
- `calendars.css`: the 44 characters, in `@layer kp.signature`, scoped
  `[data-theme='<name>'] [data-cl='a'|'b']`. In a register the same rules read
  `[data-theme='<name>'] .kp-calendar`. The contract and the shared knobs
  (`--cl-cell-h`, `--cl-<tone>-bg|fg|pat|edge|style|ink|mark`, `--cl-today`,
  `--cl-pick`, `--cl-busy-*`, …) are at the top of the file; every loop is in
  one `prefers-reduced-motion: no-preference` block near its end, and the last
  rule stops the days' own loops under the two spinner looks.
- `demo.js`: the names and descriptions (`IDEAS`), the review choices and
  look-at lines built from them, the nights (nine services' made-up nightly
  backups, "now" fixed at 20/10/2026 14:40 in Brussels), the states driven
  through the package's own API (`setCalendarState()`, `setCalendarDays()`,
  `setCalendarLegend()`, `calendarSelect()`), the speed control.
- `demo.css`: the page layout only; the three columns share their rows (a
  subgrid) so the calendars start on one line, each calendar keeps its own
  height, and the state line holds two lines.

October carries every tone: green and amber nights, the red night of the
power cut (08/10), a night with nothing to back up (11/10), a night whose
report was lost (14/10), today (20/10, 6 of 9), the nights to come; August
starts with nine nights from before the first backup. 16/10 is picked.
js/calendar.js is not changed.

## The characters

| Theme         | Character 1                                                                                                                                                                                     | Character 2                                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| formal        | The desk diary: hairline-framed paper squares, Fraunces old-style figures top left, a rule in the night's ink along the top, today in the navy double rule; a still dotted leader while loading | The ledger: days parted by hairlines, mono ledger figures flush right, a single rule under a night and the double rule under a night with nothing done, today's figure boxed; a still entry line |
| light         | The seam: soft plates with the night's seam along the foot, today in the divider's open circle; a still dashed seam                                                                             | Daylight: white cards lifted off a pale sky, washed in the night's colour, today in a ring of amber sunlight; a band of daylight crosses                                                         |
| dark          | The readout: black cells, a lit strip and figure in the night's light, ticker mono, today between corner brackets; still                                                                        | The machined pocket: chamfered pockets with a lit lower lip, engraved figures, today ringed in light; still                                                                                      |
| cyberpunk     | Neon cells: neon tubes in the night's colour with their glow, tech mono, yellow HUD brackets on today; a cyan packet runs                                                                       | The hazard roster: cut-corner plates, condensed display figures, hazard stripes on nights that went wrong, a yellow NOW tag; the stripes crawl                                                   |
| synthwave     | The grid-floor month: glass plates over a perspective floor and a pink horizon, VT323 figures, today a sunset ring; a horizon line drives up                                                    | The VCR timer: OSD numerals on black, a block in the corner, an inverse red block for none, scanlines; the tracking band rolls                                                                   |
| pastel        | The sticker chart: candy plates with a flat sticker shadow, ★ ☆ ✕ stickers, a dashed candy ring on today; a candy dot hops                                                                      | The washi planner: riso-grain squares with washi tape in the night's colour (striped, crossed), a doodled ring on today; the tape drifts                                                         |
| terminal      | cal(1): character cells, figures flush right, reverse video for none and for today's figure, · ~ ? signs; a 1 Hz caret                                                                          | The boot log: box-line cells with [OK] [WARN] [FAIL] [SKIP] tags, today in the double line; a text spinner                                                                                       | / - \ |
| forest        | The ranger's wall calendar: kraft paper, italic figures, a pinned green or autumn leaf, today circled in pencil; a leaf drifts down                                                             | The trail map: contour rings, the night as a trail blaze (double for none), a map pin on today, a dashed trail for the pick; the dashes walk                                                     |
| high-contrast | The ink grid: every tone three ways, colour, frame (solid, dashed, double, dotted) and sign (✓ ! ✕ – ?); still                                                                                  | The inverse plate: ink plates told apart by a pattern band alone (solid, hatched, cross-hatched, dotted), yellow ring on today; still                                                            |
| sepia         | The almanac page: serif italic figures, moon-phase signs ● ◐ ○, today ringed in ink, the pick in a double rule; a pen stroke writes and fades                                                   | The letterpress specimen: blind-impression plates, speckled ink, a fleuron ❧ on today; the platen presses                                                                                        |
| blueprint     | The drafting schedule: white-ink boxes on millimetre lines, hatched for some missing, amber dimension ticks on today, an amber chain line for the pick; a plotter dash runs                     | The title block: the figure in a boxed field, the count in a strip, △ ▲ revision triangles, today in the double border; a dash marches round                                                     |
| solstice      | The low sun: charcoal plates glowing up from the foot in the night's colour, serif figures, a sun ring on today; a dawn rises                                                                   | The embers: a good night glows along its edges, specks for some missing, the red coal for none, a hot iron rim on today; embers breathe                                                          |
| brutalism     | The slab: 3px black frames with the hard shadow, the pick pressed in, yellow-and-black tape across today; the tape runs                                                                         | The sticker sheet: askew stickers on a lavender sheet, a black starburst behind today's figure, the month on its own line; blocks drop                                                           |
| deco          | The gilt calendar: lacquer panels in double gold hairlines with stepped corners, Poiret figures, a gold sunburst on today; a glint runs                                                         | The marquee: a row of bulbs on every panel (all lit, half lit, dark on red); the bulbs chase                                                                                                     |
| phantom       | The stamped VOID nights: white index cards, VOID and PART stamps, a red tick, today in a red frame; the halftone slides                                                                         | The calling card month: black cards under a halftone, every figure a slanted cut-paper scrap, a red slash on today; the halftone shuffles                                                        |
| shade-light   | Pencil in the shade: lifted paper squares, pencil hatching over the night, the pick lifted further; hatched in once                                                                             | The leaf shade: dappled leaf shade over the sheet, a sun ring on today; a cloud's shade passes                                                                                                   |
| shade-dark    | Silverpoint: silver hairline frames and hatching, today ringed in the figure's own ink; hatched in once                                                                                         | The reading lamp: a warm pool of light over the sheet, a warm ring on today; the pool slides                                                                                                     |
| retro         | The tear-off pad: perforated leaves in green, yellow and red, pixel figures, today ringed in marker, the dotted focus line of 1995; still                                                       | The 1995 date picker: a white well in a bevel, raised bevelled day buttons, a navy weekday bar, today ringed in red, the pick sinks; a still dither                                              |
| grotesk       | The Swiss grid: a heavy black rule over every day, bold figures flush left, today boxed in black, the pick in red; three squares cut in                                                         | The transit bullets: round bullets in the night's colour, open rings for the nights to come, black ring today, red ring for the pick; the zebra hops                                             |
| lapis         | Lapis on vellum: an ivory vellum leaf in a double gold frame under a lapis head band, inked panels, a gold cartouche on today; a burnisher's glint                                              | The girih tiles: lapis tiles under a gold lattice in double gold frames, a gold eight-pointed star behind today's figure; a glint runs the frame                                                 |
| nostromo      | The CRT duty roster: a dark CRT in the beige case, phosphor cells (cream, amber, inverse amber), scanlines, a block cursor under today; the cursor blinks                                       | The indicator panel: coloured keys with a lit lamp in the corner, the count on embossed label tape, the pick pressed in; the lamps scan                                                          |
| titanium      | The anodised tiles: brushed metal anodised in the night's colour, engraved instrument-mono figures, a blue heat-tint ring on today; the cutter runs linearly                                    | The date wheel: the figure in a recessed aperture ringed in the night's anodised colour, a knurled top, blue oxide on today; the knurl rolls                                                     |

Themes whose rules forbid loops keep their loading picture still: formal 1
and 2, light 1, dark 1 and 2, high-contrast 1 and 2, retro 1 and 2 (light 2
keeps the slow daylight band, as the chart's light 2 did). Nothing loops at
rest in any character. shade-light 1 and shade-dark 1 hatch in once.

## Measured

Firefox (Playwright's, one script, its own `http.server`, under
`flock /tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport
1600 × 1200 at 2×. The last fixes for formal, dark, forest, solstice,
shade-dark, lapis and nostromo were measured again in a second run; the
table holds the latest run per theme.

- **Console:** 0 errors and 0 page errors in all 22 themes, with and without
  reduced motion, through every state, look, month and the live update.
- **Heights:** the grid (`table.kp-calendar__grid`) measured in Read,
  August, September, October, Loading in each of its three looks, Nothing to
  check, Could not read, and the live update (reading, then done): one height
  per grid in all 66 columns. The whole calendar keeps one height too, once
  the titles were set so that "September 2026" stays on one line (nostromo 1
  and 2 and brutalism 2 put the month on its own line above the buttons).
- **Reduced motion:** with `prefers-reduced-motion: reduce`, 0 running
  animations in every column in every one of those states, in all 22 themes.
- **Contrast**, from the screenshot's pixels: the day shot twice, as drawn
  and with the figure (then the count) made transparent; over the pixels that
  differ, the 95th percentile of the contrast between the two shots. Per
  character, the lowest over the tones ok, warn, bad, muted, none, future,
  before and loading (the count where a tone has one). Rings the same way:
  the cell and 10px around it with and without `data-kp-today` (today warn,
  and again as ok after the live update; the lower counts) and with and
  without `aria-selected`. Every character is at or above 4.5:1 for figures
  and counts and 3:1 for today's and the picked day's ring, in every theme.
- **Tones:** the plates of the eight tones shot with their figures hidden;
  "Tones" is the smallest mean difference per pixel (0–255) between any two
  of them. In high-contrast it is measured in grey as well: 13.6 (1) and 8.4
  (2), so the pattern alone tells every tone apart.

| Theme         | Option |     Grid | Figure, lowest | Count, lowest | Today | Picked | Tones | Loading animates        |
| ------------- | ------ | -------: | -------------: | ------------: | ----: | -----: | ----: | ----------------------- |
| formal        | 1      | 392.5 px |      4.65 (ok) |          4.64 |  8.72 |  11.59 |   5.2 | nothing (still)         |
|               | 2      | 344.4 px |      4.65 (ok) |          4.64 |  8.74 |   8.75 |   3.3 | nothing (still)         |
|               | plain  |   378 px | 3.03 (loading) |          4.44 | 12.13 |  11.58 |   5.0 | kp-pulse                |
| light         | 1      |   378 px |      4.73 (ok) |          4.73 | 14.18 |   9.40 |   3.2 | nothing (still)         |
|               | 2      |   386 px |      4.81 (ok) |          5.14 |  5.36 |   8.90 |   3.1 | nothing (still)         |
|               | plain  |   378 px | 3.12 (loading) |          4.73 | 14.18 |   9.40 |   3.5 | kp-pulse                |
| dark          | 1      |   378 px | 4.66 (loading) |          6.86 | 16.26 |  16.26 |   2.2 | nothing (still)         |
|               | 2      | 384.5 px |   4.66 (muted) |          6.60 | 17.11 |  15.91 |   3.2 | nothing (still)         |
|               | plain  |   378 px | 2.92 (loading) |          6.60 | 11.20 |  15.91 |   2.9 | kp-pulse                |
| cyberpunk     | 1      |   378 px |     4.92 (bad) |          4.92 | 13.48 |  13.67 |   9.6 | cl-cy-packet            |
|               | 2      | 379.5 px |     4.92 (bad) |          4.92 | 15.26 |  13.03 |   6.3 | cl-cy-hazard            |
|               | plain  |   378 px | 3.32 (loading) |          4.92 |  7.94 |  15.26 |   3.1 | kp-pulse                |
| synthwave     | 1      |   384 px | 5.39 (loading) |          5.46 |  4.94 |  14.28 |   5.7 | cl-sw-horizon           |
|               | 2      |   384 px |  5.20 (before) |          5.46 | 14.84 |   4.55 |   3.8 | cl-sw-track             |
|               | plain  |   378 px | 3.49 (loading) |          5.44 |  7.97 |   4.55 |   1.7 | kp-pulse                |
| pastel        | 1      |   394 px |      4.57 (ok) |          4.57 |  6.45 |   6.45 |   8.1 | cl-pa-hop               |
|               | 2      |   378 px |      4.57 (ok) |          4.57 |  4.81 |  13.77 |   5.0 | cl-pa-drift             |
|               | plain  |   378 px | 2.95 (loading) |          4.57 | 10.27 |   6.45 |   5.1 | kp-pulse                |
| terminal      | 1      |   354 px |    4.66 (warn) |          4.66 |  5.00 |  12.17 |   3.6 | cl-tm-caret             |
|               | 2      |   378 px |     5.55 (bad) |          5.55 | 13.50 |  12.17 |   4.3 | cl-tm-spin              |
|               | plain  |   378 px | 4.28 (loading) |          4.66 |  5.00 |  12.17 |   2.1 | kp-pulse                |
| forest        | 1      |   378 px |      4.51 (ok) |          4.51 |  6.85 |  11.21 |   3.1 | cl-fo-leaf              |
|               | 2      | 376.5 px |      4.51 (ok) |          4.51 |  8.44 |  11.21 |   7.2 | cl-fo-walk              |
|               | plain  |   378 px | 2.87 (loading) |          4.51 | 10.02 |   8.06 |   6.0 | kp-pulse                |
| high-contrast | 1      |   386 px |    6.84 (warn) |          6.84 |  6.84 |  10.86 |  13.6 | nothing (still)         |
|               | 2      |   378 px |     8.21 (bad) |          8.21 | 13.89 |  10.86 |   8.4 | nothing (still)         |
|               | plain  |   378 px | 4.57 (loading) |          6.84 |  3.07 |  10.86 |   3.8 | kp-pulse                |
| sepia         | 1      |   365 px | 5.27 (loading) |          5.94 |  5.64 |   6.92 |   4.6 | cl-se-write             |
|               | 2      | 387.5 px |   5.27 (muted) |          6.22 |  6.62 |   6.92 |   4.4 | cl-se-press             |
|               | plain  |   378 px | 2.90 (loading) |          5.94 | 10.78 |   6.92 |   4.8 | kp-pulse                |
| blueprint     | 1      |   378 px |     5.27 (bad) |          5.27 |  7.57 |   7.57 |   6.8 | cl-bp-plot              |
|               | 2      |   378 px |     5.27 (bad) |          5.27 |  6.21 |   8.64 |   4.4 | cl-bp-march             |
|               | plain  |   378 px | 4.16 (loading) |          5.27 |  6.11 |   8.64 |   5.1 | kp-pulse                |
| solstice      | 1      |   381 px |     5.00 (bad) |          5.00 |  6.40 |   3.84 |   5.6 | cl-so-dawn              |
|               | 2      |   378 px |     5.00 (bad) |          4.81 |  3.04 |  12.72 |   3.8 | cl-so-breathe           |
|               | plain  |   378 px | 3.91 (loading) |          5.00 |  6.04 |   6.40 |   4.8 | kp-pulse                |
| brutalism     | 1      |   402 px |     6.31 (bad) |          6.31 | 18.73 |  18.73 |   5.6 | cl-br-tape              |
|               | 2      |   394 px |     6.31 (bad) |          6.31 | 13.31 |   8.74 |  31.3 | cl-br-drop              |
|               | plain  |   378 px | 3.66 (loading) |          6.31 | 10.84 |  18.73 |   5.6 | kp-pulse                |
| deco          | 1      |   378 px |     4.79 (bad) |          4.79 |  6.95 |   7.55 |   7.2 | cl-de-glint             |
|               | 2      |   378 px |     4.79 (bad) |          4.79 |  4.99 |  13.87 |   3.7 | cl-de-chase             |
|               | plain  |   378 px |     4.79 (bad) |          4.79 |  4.99 |   7.55 |   4.4 | kp-pulse                |
| phantom       | 1      |   378 px | 7.34 (loading) |         14.35 | 14.30 |  17.01 |   8.6 | cl-ph-slide             |
|               | 2      |   378 px |  8.00 (before) |          5.03 |  4.78 |  17.01 |  19.8 | cl-ph-shuffle           |
|               | plain  |   378 px | 4.34 (loading) |          5.03 |  5.24 |   4.79 |   3.0 | kp-pulse                |
| shade-light   | 1      |   386 px |    4.55 (warn) |          4.55 |  4.55 |   5.30 |   6.6 | cl-sh-hatch             |
|               | 2      |   378 px |    4.55 (warn) |          4.55 |  3.77 |   5.39 |   6.9 | cl-sh-cloud             |
|               | plain  |   378 px | 2.70 (loading) |          4.55 |  1.29 |   5.39 |   4.5 | kp-pulse                |
| shade-dark    | 1      |   386 px |    4.94 (warn) |          4.94 |  4.94 |   4.90 |   5.2 | cl-sh-hatch             |
|               | 2      |   378 px | 4.55 (loading) |          4.75 |  6.13 |   4.48 |   2.7 | cl-sh-lamp              |
|               | plain  |   378 px | 3.27 (loading) |          4.75 |  1.45 |   4.90 |   1.0 | kp-pulse                |
| retro         | 1      |   378 px | 6.46 (loading) |          7.21 | 12.24 |  11.97 |   4.6 | nothing (still)         |
|               | 2      | 360.4 px |  5.64 (before) |          7.21 |  7.62 |  17.11 |  17.7 | nothing (still)         |
|               | plain  |   378 px | 3.34 (loading) |          7.24 | 12.24 |  11.02 |   2.1 | kp-pulse                |
| grotesk       | 1      |   370 px |  5.27 (before) |          5.74 |  5.74 |   4.99 |   8.4 | cl-gr-cut               |
|               | 2      |   378 px | 5.27 (loading) |          5.74 | 18.73 |   4.99 |   6.9 | cl-gr-zebra             |
|               | plain  |   378 px | 2.87 (loading) |          5.74 |  5.74 |   4.99 |   1.9 | kp-pulse                |
| lapis         | 1      |   378 px |      5.12 (ok) |          5.12 |  5.15 |  10.96 |   3.9 | cl-la-glint             |
|               | 2      |   378 px |   4.82 (muted) |          5.12 | 14.98 |   5.00 |  11.2 | cl-la-glint             |
|               | plain  |   378 px | 3.21 (loading) |          5.12 |  5.15 |   5.00 |   2.6 | kp-pulse                |
| nostromo      | 1      |   378 px |     4.86 (bad) |          4.86 |  4.83 |  12.37 |   4.3 | cl-no-warm, cl-no-blink |
|               | 2      | 381.5 px |  4.52 (before) |         12.37 |  7.01 |   3.23 |   8.1 | cl-no-scan              |
|               | plain  |   378 px | 2.66 (loading) |          4.94 |  2.50 |   9.90 |   7.0 | kp-pulse                |
| titanium      | 1      |   375 px | 4.55 (loading) |          6.23 |  4.13 |  11.19 |   6.3 | cl-ti-cut               |
|               | 2      |   375 px |  4.74 (before) |          6.09 |  4.13 |  11.19 |   3.1 | cl-ti-knurl             |
|               | plain  |   378 px | 3.28 (loading) |          6.09 | 11.24 |  11.19 |   1.9 | kp-pulse                |

## Open

- **Two tone pairs are close:** dark 1, future and before (2.2: both bare
  black cells, dotted against a dark dashed frame), and shade-dark 2, none and
  before (2.7). Not fixed: the measuring stopped at the coordinator's word.
  dark 1 would give "before" a hatch, shade-dark 2 a sign on "none".
- **Findings in the plain calendar** (the package, not changed here): a
  loading day's figures read 2.7:1 to 4.6:1 in every theme, because
  layout.css dims every `[aria-busy]` to 0.7 and the grid is busy while it
  loads (the characters set `--kp-busy-opacity: 1` on the grid: their loading
  picture says busy); formal's warning pair reads 4.44:1 for the count;
  today's inner ring in the foreground colour reads 1.29:1 in shade-light,
  1.45:1 in shade-dark and 2.50:1 in nostromo on the amber plate; the title
  wraps in synthwave, nostromo and brutalism, so the calendar grows a line in
  some months; and in a grid row stretched by its neighbour the table hands
  the extra height to its header row (the demo sets `align-self: start`).
- **Hooks the calendar does not expose:** the weekday of a cell (the stickers
  of brutalism 2 and the scraps of phantom 2 vary by column, `td:nth-child`,
  which depends on the locale's first weekday); whether a day has a count
  (the count is a no-break space when there is none, so nostromo 2's label
  tape is shown only for the tones that carry one); the weekday names are the
  locale's (cal(1)'s "Mo Tu" cannot be drawn); the month of the grid is in
  the title only.
- **Today's ring in several characters is drawn on `td:has(> [data-kp-today])`**
  (dark 1, cyberpunk 1 and 2, pastel 1, forest 2, sepia 2, blueprint 1,
  brutalism 1, phantom 2, grotesk 2): a `data-kp-today` on the cell would
  spare the `:has()`.
- **terminal 1's caret animates `content`**, which Firefox runs as a discrete
  animation; where it does not, the caret simply stays lit.
