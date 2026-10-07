# A key-figure strip of its own, per theme

**Decided (2026-10-06 11:50).** Kenny approved all 22 themes in full, one pick per aspect; the picks are in [decided.json](decided.json) (shape / loading / arrival / tone / live). They move into the registers exactly as the demo draws them at the port, after every component's verdict. The port needs the package to say the strip's moments (arrival after loading, a live update) that the demo sets as `data-cs-moment`; js/kpi.js has only `aria-busy` today (PACKAGE_FINDINGS).

Kenny, form v18 (2026-10-05): the character round, one component at a time,
all 22 themes in one demo. The meter, the time chart, the month heatmap, the
network graph and the trend tile (`research/character-*`) came first; this is
the sixth component, the strip of key figures with one column per figure.

`.kp-kpis[data-kp-kpis-columns="all 3 2 1"]` (css/components.css, "Key
figures" and "Key-figure strip on allowed column counts", scope-143;
js/kpi.js `attachKpiStrips()` picks the column count from the strip's own
width and never leaves one tile alone on a row) is today the same shape in
every theme: a card per figure in equal columns, the label in small capitals,
the number with its unit, a line of words with the change in it, grey
skeletons while it loads. This demo gives every theme two strips drawn in its
own world, beside the plain strip of today.

## Files (round 2: one pick per aspect)

Kenny, 2026-10-05 20:03: every demo gets separate options per aspect, like the
meter (`research/character-meter`), "and it should be like this in the
future". Round 1's two characters per theme are split into their parts; each
part is now its own pick.

- `demo.html`: one section judged per theme with the review kit
  (`../_review/review.js`, `data-review-components="kpi--columns"`), with
  five choice groups per theme, three options each, nothing ticked: Shape
  (the tiles, the dividers, the figure, the label), While loading (always
  moving, a still frame under reduced motion, never a fade), How the figures
  arrive (after loading and on Drawn), The tone and the change (the change's
  plate, sign and type), Live update (how a figure that changed shows it).
  At the top, "Your combination": the strip with the current picks (option 1
  where nothing is ticked yet, said so in words), following every
  `review:choice`. Under it one row per aspect, three strips stacked (a strip
  needs the full width), each at desk width and under it at phone width
  (334 px), differing in that aspect only. The controls sit in the section's
  `data-review-controls` container, so the dialog mirrors them: State
  (Drawn, Loading, Nothing to show, Could not read, Live update ten minutes
  later), Figures (five, a long label, a wide value, many columns (eight),
  two columns), the speed of every animation. The plain strip of today is
  folded away at the foot, for reference, not an option.
  `data-review-round` is `2026-10-05-r2` and reopens all 22 themes.
- `columns.css`: one rule per theme, aspect and option, scoped
  `[data-theme='<name>'] [data-cs-<aspect>='1'|'2'|'3'] .kp-kpis`, ordered by
  aspect, then by theme. A shape sets the strip's and the tiles' knobs
  (`--cl-plate`, `--cl-rule`, `--cl-strip-*`, `--cl-frame*`, `--cl-deco*`,
  `--cl-label-*`, `--cl-tag*`, `--cl-num-*`, `--cl-words-*`, `--cl-hue`,
  `--cl-min`); a loading picture `--cl-load` and `--cl-load-anim` (on each
  tile's ::after while the strip is `aria-busy`); an arrival
  `--cl-arrive-num`, `--cl-arrive-tile` and `--cl-arrive-stagger` (played
  when the page sets `data-cs-moment="arrive"`); a tone the `--cl-delta-*`
  knobs (plate, frame, shadow, sign before and after, face, weight); a live
  update `--cl-live-num`, `--cl-live-tile` and `--cl-live-ink` (played on
  the tiles with `data-cs-changed` when the page sets
  `data-cs-moment="live"`). No rule names two aspects, so any combination
  composes. Motion moves, scales, turns and clips with `translate`, `scale`,
  `rotate` and `clip-path`, which compose with a shape's own `transform`;
  nothing fades, no size changes, and every animation sits in one
  `prefers-reduced-motion: no-preference` block at the end. In a register the
  `[data-cs…]` parts drop out and the moment becomes the package's hook.
- `demo.js`: the five aspects (`ASPECTS`), the names and texts per theme
  (`IDEAS`, three per aspect), the review choices and look-at lines built
  from them, the rows of options, `compose()` (the preview takes the picks,
  every row's cell its own option in its own aspect and the picks in the
  other four), the figures of pump house 1, the states and moments written
  into the package's markup, the speed control.
- `demo.css`: the page layout only: the combination, the rows, the phone
  pane.

Options 1 and 2 of each aspect come from round 1's characters a and b where
they differ. Where round 1 stood still while loading (formal, light, dark's
rack, high contrast, retro) or breathed in opacity (sepia's drawers,
solstice, phantom's pins, shade-light's sheets, shade-dark's lights,
brutalism's stamp, terminal's cursor), the picture is new or redrawn as a
change of size or place. Round 1 had no arrival and no live update: all three
are new there. Where both characters had the same change (light, dark,
cyberpunk, pastel, terminal, high contrast, deco, phantom, retro, grotesk,
lapis, nostromo), tone option 2 is new.

js/kpi.js is not changed.

## What js/kpi.js does not hand a character

Found while building; each would want a change in the module, so none of the
44 characters leans on it:

- **The column count does not know the labels.** `kpiColumns()` picks a count
  from a fixed smallest tile (`--kp-kpi-min`, 144 px when unset), not from the
  widest label in the strip, which is what Kenny's rule on fixed points asks
  (fix-64: a column as wide as its longest label). So at phone width (two
  columns of about 159 px) "Pressure, far end of the ring" does not fit in any
  character and "Delivered this year" not in the wider faces: a character can
  only cut it (measured below), the plain strip wraps it. A count chosen by
  the widest label (or a `data-kp-kpis-columns` step down when a label would
  not fit) would end both.
- **No state on the strip.** Loading, nothing to show and could not read are
  the page's markup (skeletons, a dash, words); the strip carries only
  `aria-busy` while it loads, so a character cannot draw "could not read"
  differently from "nothing to show".
- **No column index or row end.** The module writes the count
  (`--kp-kpis-columns`) but not which tile ends a row, so a rule between
  columns is drawn on every tile's start edge and clipped at the strip's frame;
  on a phone, where the columns wrap, the rule at the start of the second row
  is clipped the same way only when the strip clips.
- **`--kp-kpi-min` is read in px, rem or em only** (`lengthPx()`): a
  character cannot ask for a tile "as wide as 14 characters" (`ch`), which is
  the natural unit for a label.

## The characters

| Theme         | Character 1                                                                                                                                                                                                                                            | Character 2                                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| formal        | The ledger row: A page of an account book: a double rule over the strip, a rule between the columns, each head in the serif’s small capitals over its own rule, the figures set right in the display serif, the words in italics. Still while loading. | The booktabs table: A table from a scholarly book: a heavy rule above, a light one under the heads, a heavy one at the foot, no rules between the columns, every column centred, the figures in the text serif. Still while loading. |
| light         | One card: The whole strip is one white card lifted on a soft shadow, its columns parted by short hairlines, the heads in sentence case. Still while loading: the skeletons alone.                                                                      | The legend chips: Each figure in a soft primary-tinted well with a wide radius, a dot in its column’s chart colour before the head, like a chart’s legend. Still while loading: the skeletons alone.                                 |
| dark          | The departure board: An airport board: every number in a split-flap window with a hinge line across its middle, the heads in mono capitals, the strip a dark panel. Loading: the flaps flick.                                                          | The rack: A server rack: each figure a rack unit with a screw head at each corner and a lit green status lamp before its head, all in the mono. Still while loading.                                                                 |
| cyberpunk     | The ticker rail: A neon ticker: a glowing magenta rail above and below the strip, the columns parted by a `//` before each head, the figures in tech mono with a cyan halo. Loading: a packet runs along the rail.                                     | The data shards: Each figure a shard with two cut corners and a neon edge, its head on a magenta tab. Loading: a glitch line jumps across each shard.                                                                                |
| synthwave     | The cassette counter: A tape deck: every number in a sunken counter window, every head on a cassette label between a pink and a cyan stripe. Loading: the tape’s teeth turn.                                                                           | The arcade scoreboard: A high-score table on the night sky: a rank (01, 02, …) before every head, a pink rule under the heads, the figures lit in cyan. Loading: the screen rolls.                                                   |
| pastel        | The paint swatches: A row of paint chips: each figure on a card with a band of its column’s colour across the top, the heads in sentence case. Loading: a sheen crosses the bands.                                                                     | The sticky notes: A row of sticky notes in each column’s tint, set a little askew with a flat shadow and the bottom corner folded. Loading: a sheen crosses the notes.                                                               |
| terminal      | The df -h table: A framed text table as df(1) prints it: a frame and column rules in the phosphor’s dim ink, a dashed rule under the heads, everything in the mono. Loading: a block cursor blinks in each column.                                     | The tmux status bar: The strip a run of tmux status segments in reverse video with arrow ends, every other one in the second colour. Loading: a band runs through the segments.                                                      |
| forest        | The trail markers: Each figure a rounded wooden post with a painted blaze in its column’s colour, standing on a line of soil; heads in serif italic, centred. Loading: light walks the trail.                                                          | The specimen mounts: Each figure a herbarium sheet held by four photo corners, its head in a ruled specimen box in small capitals, the words in italics. Loading: a seed rolls across.                                               |
| high-contrast | The ruled grid: One table in 2px rules: a frame, a rule between the columns and a rule under the heads, the heads bold, the figures heavy. Still: nothing moves.                                                                                       | The inverse heads: Each figure framed in 2px with its head on an ink band across the top of the frame, the figure heavy on the paper under it. Still: nothing moves.                                                                 |
| sepia         | The typewriter tab stops: A typewriter’s scale along the top of the strip with a tab stop over every column, the heads typed and underlined, everything in the typewriter face. Loading: the carriage steps along.                                     | The card catalogue: A library card catalogue: each figure a drawer front, its head in a brass label holder, a pull ring in the corner. Loading: the drawers breathe.                                                                 |
| blueprint     | The dimension chain: A chain of dimension lines with end ticks over the columns, each tile a drawn box, the heads in technical mono capitals. Loading: a centre line marches along the foot.                                                           | The bill of materials: A parts list: a ruled table, each head with its item number in a balloon, the columns parted by rules. Loading: a scan crosses the table.                                                                     |
| solstice      | The horizon: The figures stand on a warm horizon line that glows, the light rising from it behind each column. Loading: the light breathes.                                                                                                            | The lanterns: A string across the top of the strip with each figure a rounded lantern hung from it, glowing warm from its top, centred. Loading: the lanterns breathe.                                                               |
| brutalism     | The poster grid: The columns butted together under thick black rules with a hard offset shadow, every other column on the accent plate, the heads heavy. Loading: a lintel hoisted in a well at the foot of every column.                                                      | The ticket stubs: Each figure a ticket with notches bitten from its sides, a perforated edge down its left and a heavy outline. Loading: the tickets stamp.                                                                          |
| deco          | The floor indicator: A lift’s floor dial: a gold arc with a fan of rays over every figure, the heads in the display face’s spaced capitals, centred. Loading: a glint runs across.                                                                     | The colonnade: Fluted gold pilasters in the gaps between the columns, each figure under a stepped double capital. Loading: a glint runs across.                                                                                      |
| phantom       | The red-string board: Each figure a card pinned to the board, a red string running from pin to pin across the strip, the cards set a little askew. Loading: the pins beat.                                                                             | The case files: Each figure a folder with a tab standing up from its top corner, the file number on the tab (FILE 01, 02, …). Loading: the folders shuffle.                                                                          |
| shade-light   | The window blinds: Slatted light from a window blind falling across every column, a soft round change. Loading: the slats drift.                                                                                                                       | The paper cut-outs: Each figure a sheet laid on two more, their edges showing below and to the right. Loading: the sheets breathe.                                                                                                   |
| shade-dark    | The gallery wall: Each figure a framed piece with an inner mount under its own picture light, centred. Loading: the lights breathe.                                                                                                                    | The velvet tray: A jeweller’s tray: each figure set into a recessed well, the number in a deeper well, the columns parted by raised ridges. Loading: a sheen crosses the wells.                                                      |
| retro         | The status bar: A 1995 status bar: a raised grey bar holding a sunken pane per figure, the heads in the system face without capitals. Still while loading.                                                                                             | The list view: A 1995 list view: each head a raised column-header button, the figure in the white list under it, the whole set in a sunken frame. Still while loading.                                                               |
| grotesk       | The numbered grid: A Swiss grid: a heavy rule over the strip, a hairline over every column, the column number (01, 02, …) in its corner, the figures bold and flush left. Loading: a line runs across the top.                                         | The line colours: Each figure topped by a thick flat block in its column’s colour, like the lines on a transit map, the heads bold in sentence case. Loading: the blocks fill in.                                                    |
| lapis         | The arcade: An arcade of arches: each figure under a pointed arch framed in a double gold rule, centred, in the display face. Loading: a glint runs across.                                                                                            | The illuminated band: A manuscript’s border: a ribbon of gold lattice across the top of the strip, the figures on vellum panels, the heads in serif italic over a gold rule. Loading: a glint runs across.                           |
| nostromo      | The readout bank: A bank of screen readouts: each figure a segment of glass with corner brackets, its head on an inverse tape, all in the mono. Loading: a sweep rolls down each screen.                                                               | The bulkhead: A bulkhead: hazard chevrons along the foot of the strip, each figure on a riveted plate, the heads stencilled in heavy spaced capitals. Loading: the chevrons march.                                                   |
| titanium      | The anodised bars: A brushed plate per figure with an anodised edge in its column’s colour, the heads in small capitals, the figures in instrument mono. Loading: light rises along the edge.                                                          | The machined bezels: Each figure cut as a chamfered plate, the number behind a chamfered bezel with an inner shadow. Loading: the grain runs.                                                                                        |

The still characters (formal 1 and 2, light 1 and 2, dark 2, high-contrast 1
and 2, retro 1 and 2) draw nothing while loading but the skeletons, and the
formal, high-contrast and retro ones stop the skeletons' pulse too. Nothing
loops at rest in any character.

## Measured

Firefox (Playwright's, one script, its own `http.server` on 127.0.0.1:8747,
under `flock /tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport
1600 × 1200, with and without `prefers-reduced-motion: reduce`; the seventh
full run, 124.0 s for 44 pages.

- **Console:** 0 console errors and page errors in all 22 themes, with
  and without reduced motion, through every state and every set of figures.
- **Heights:** the desk strip measured in all 5 states × 5 sets of figures (25
  readings per option): one height per option in all 44 characters except
  retro's two, where "many columns" takes 3 columns in all three options (the
  retro page leaves the strip under the 8 × 144 px + gaps the module asks
  for; the plain strip does the same).
- **Equal widths:** every column in a row within 1 px of its neighbours, in
  every option, state and set.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, 0 running
  animations in the section at rest and while loading, in all 22 themes.
  Without it, 0 at rest as well; while loading only the loading pictures and
  the registers' own skeleton signatures run (the column "Loading animates").
- **Contrast**, from the computed styles (each colour resolved through a
  canvas, alpha composited onto its plate, the plate down the ancestors to
  the page): the label (and the tag before it) on its plate, the number and
  its unit, the words, the change's ink on its own plate, and every rule a
  character draws (`--cl-rule` on the tile's plate, the strip's top and foot
  rules on the section) at 3:1. The table gives the lowest over every figure,
  drawn. Every character holds 4.5:1 for text (lowest 4.51) and 3:1 for
  rules (lowest 3.83). Patterns under the text (glows, slats, grain, at
  most 18 % of a token) are not composited.
- **Labels:** each label read back through a Range (more than one line box
  is wrapped) and its scroll width (wider than its box is cut), in every
  state and set, at desk width: 0 wrapped and 0 cut in all 44 characters.
  The number is fitted to its tile (`min(1.75rem, 14cqi)` in a box of fixed
  height), so the wide value is never cut either.
- **Phone pane (334 px):** the module gives every option the same counts:
  2 columns with the fifth tile spanning its row for five figures, 2 for eight
  and for two. Labels cut at phone width in the characters: "Pressure, far end of the ring" in 41 of 44 (all but lapis 2, solstice 1, solstice 2); "Delivered this year" in 13 of 44 (formal 1, dark 2, cyberpunk 1 and 2, terminal 2, forest 2, high-contrast 1, blueprint 1 and 2, grotesk 1, nostromo 1 and 2, titanium 2); every other label fits. The
  plain strip wraps those labels instead (by the package's
  `@container kp-kpi (max-width: 12rem)` rule) and grows: 446 / 521 / 141 px
  against 326 to 464 px for five figures in the characters. This is the
  first item under "What js/kpi.js does not hand a character", and open.

| Theme         | Option |                                                  Height | Label | Number | Words | Change | Rules | Wrapped / cut | Phone h (5 / 8 / 2) | Loading animates             |
| ------------- | ------ | ------------------------------------------------------: | ----: | -----: | ----: | -----: | ----: | ------------: | ------------------: | ---------------------------- |
| formal        | 1      |                                                127.3 px |  9.34 |   9.34 |  9.34 |   4.72 |  5.31 |         0 / 0 |  374 / 497 / 127 px | nothing (still)              |
|               | 2      |                                                111.3 px |  9.34 |   9.34 |  9.34 |   4.72 |  5.31 |         0 / 0 |  358 / 481 / 111 px | nothing (still)              |
|               | plain  |                                  101.7 / 106 / 121.2 px |  7.01 |   7.01 |  7.01 |   4.72 |  1.36 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| light         | 1      |                                                108.8 px |  9.29 |   9.29 |  9.29 |   4.73 |  5.57 |         0 / 0 |  326 / 435 / 109 px | nothing (still)              |
|               | 2      |                                                120.8 px |  8.23 |   8.23 |  8.23 |   4.73 |  5.24 |         0 / 0 |  386 / 519 / 121 px | nothing (still)              |
|               | plain  |                                 80.2 / 101.7 / 121.2 px |  6.77 |   6.77 |  6.77 |   4.73 |  1.34 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| dark          | 1      |                                                129.3 px |  7.82 |   6.83 |  7.82 |   6.60 |  5.73 |         0 / 0 |  368 / 487 / 129 px | cl-flap, the skeletons       |
|               | 2      |                                                107.8 px |  6.82 |   6.82 |  6.82 |   6.60 |  5.87 |         0 / 0 |  331 / 443 / 108 px | nothing (still)              |
|               | plain  |                         82.6 / 100.6 / 101.7 / 119.7 px |  5.02 |   5.02 |  5.02 |   6.60 |  1.30 |        10 / 5 |  329 / 443 / 102 px | the skeletons                |
| cyberpunk     | 1      |                                                123.3 px |  8.13 |   8.13 |  8.13 |   4.92 |  4.92 |         0 / 0 |  362 / 481 / 123 px | cl-slide, the skeletons      |
|               | 2      |                                                121.3 px | 15.60 |   7.56 |  7.56 |   4.92 |  4.88 |         0 / 0 |  388 / 521 / 121 px | cl-glitch, the skeletons     |
|               | plain  |                                         85.8 / 101.7 px |  5.97 |   5.97 |  5.97 |   4.92 |  1.71 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| synthwave     | 1      |                                                121.3 px |  5.82 |   8.75 |  6.69 |   5.59 |  4.67 |         0 / 0 |  388 / 521 / 121 px | cl-march, the skeletons      |
|               | 2      |                                                137.3 px |  8.75 |   8.75 |  8.75 |   5.59 |  5.05 |         0 / 0 |  396 / 525 / 137 px | cl-roll, the skeletons       |
|               | plain  |                                         82.6 / 101.7 px |  5.36 |   5.36 |  5.36 |   5.59 |  1.21 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| pastel        | 1      |                                                146.8 px |  8.43 |   8.43 |  8.43 |   4.57 |  4.57 |         0 / 0 |  464 / 623 / 147 px | cl-slide, the skeletons      |
|               | 2      |                                                120.8 px |  9.80 |   9.80 |  9.80 |   4.57 |  4.57 |         0 / 0 |  394 / 531 / 121 px | cl-slide, the skeletons      |
|               | plain  |                                 83.4 / 101.7 / 121.2 px |  6.78 |   6.78 |  6.78 |   4.57 |  1.40 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| terminal      | 1      |                                                122.3 px |  9.78 |   9.78 |  9.78 |   4.71 |  4.82 |         0 / 0 |  363 / 483 / 122 px | cl-blink, the skeletons      |
|               | 2      |                                                107.3 px | 11.33 |  11.33 | 11.33 |   4.71 | 11.33 |         0 / 0 |  328 / 438 / 107 px | cl-march-wide, the skeletons |
|               | plain  |                                 96.2 / 101.7 / 121.2 px |  8.03 |   8.03 |  8.03 |   4.71 |  1.47 |         0 / 0 |  388 / 521 / 121 px | the skeletons                |
| forest        | 1      |                                                145.8 px |  7.58 |   7.58 |  7.58 |   4.51 |  4.53 |         0 / 0 |  447 / 598 / 146 px | cl-slide, the skeletons      |
|               | 2      |                                                124.3 px |  7.25 |   7.25 |  7.25 |   4.51 |  4.41 |         0 / 0 |  397 / 533 / 124 px | cl-slide, the skeletons      |
|               | plain  |                                 81.8 / 101.7 / 121.2 px |  6.41 |   6.41 |  6.41 |   4.51 |  1.49 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| high-contrast | 1      |                                                125.3 px | 21.00 |  21.00 | 21.00 |   7.18 | 21.00 |         0 / 0 |  368 / 489 / 125 px | nothing (still)              |
|               | 2      |                                                116.4 px | 21.00 |  21.00 | 21.00 |   7.18 | 21.00 |         0 / 0 |  373 / 502 / 116 px | nothing (still)              |
|               | plain  |                                   90 / 101.7 / 121.2 px | 12.63 |  12.63 | 12.63 |   7.18 |  4.74 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| sepia         | 1      |                                                124.9 px |  7.75 |   7.75 |  7.75 |   6.90 |  4.53 |         0 / 0 |  364 / 483 / 125 px | cl-slide, the skeletons      |
|               | 2      |                                                124.3 px |  7.75 |   6.97 |  6.97 |   6.90 |  4.31 |         0 / 0 |  389 / 521 / 124 px | cl-pulse, the skeletons      |
|               | plain  |                                 79.4 / 101.7 / 121.2 px |  6.11 |   6.11 |  6.11 |   6.90 |  1.37 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| blueprint     | 1      |                                                137.3 px | 10.73 |  10.73 | 10.73 |   5.27 |  5.86 |         0 / 0 |  396 / 525 / 137 px | cl-march, the skeletons      |
|               | 2      |                                                122.3 px | 10.73 |  10.73 | 10.73 |   5.27 |  5.24 |         0 / 0 |  363 / 483 / 122 px | cl-slide, the skeletons      |
|               | plain  |                                 84.6 / 101.7 / 121.2 px |  8.17 |   8.17 |  8.17 |   5.27 |  1.49 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| solstice      | 1      |                                                122.8 px | 10.11 |  10.11 | 10.11 |   5.00 |  5.59 |         0 / 0 |  388 / 521 / 123 px | cl-pulse, the skeletons      |
|               | 2      |                                                137.2 px |  8.99 |   8.99 |  8.99 |   5.00 |  5.29 |         0 / 0 |  407 / 542 / 137 px | cl-pulse, the skeletons      |
|               | plain  |                                 82.6 / 101.7 / 121.2 px |  7.62 |   7.62 |  7.62 |   5.00 |  1.44 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| brutalism     | 1      |                                                122.6 px |  8.74 |   8.74 |  8.74 |   6.31 |  8.74 |         0 / 0 |  356 / 472 / 123 px | cl-stamp, the skeletons      |
|               | 2      |                                                109.1 px | 12.08 |  12.08 | 12.08 |   6.31 | 18.73 |         0 / 0 |  351 / 472 / 109 px | cl-stamp, the skeletons      |
|               | plain  |                                   94 / 101.7 / 121.2 px |  9.29 |   9.29 |  9.29 |   6.31 | 18.73 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| deco          | 1      |                                                134.9 px | 10.60 |  10.60 | 10.60 |   4.79 |  7.55 |         0 / 0 |  429 / 576 / 135 px | cl-glint, the skeletons      |
|               | 2      |                                                124.3 px | 10.60 |  10.60 | 10.60 |   4.79 |  7.55 |         0 / 0 |  405 / 545 / 124 px | cl-glint, the skeletons      |
|               | plain  |                 84.6 / 101.7 / 102.6 / 119.7 / 121.2 px |  9.38 |   9.38 |  9.38 |   4.79 |  1.36 |        10 / 5 |  329 / 443 / 102 px | the skeletons                |
| phantom       | 1      |                                                141.3 px | 10.28 |  10.28 | 10.28 |   5.31 |  6.45 |         0 / 0 |  440 / 589 / 141 px | cl-pulse, the skeletons      |
|               | 2      |                                                139.7 px |  9.45 |   9.45 |  9.45 |   5.31 |  6.23 |         0 / 0 |  406 / 540 / 140 px | cl-march, the skeletons      |
|               | plain  |                                         83.4 / 101.7 px |  7.99 |   7.99 |  7.99 |   5.31 |  1.53 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| shade-light   | 1      |                                                122.8 px |  5.62 |   5.62 |  5.62 |   5.27 |  3.83 |         0 / 0 |  392 / 527 / 123 px | cl-roll, the skeletons       |
|               | 2      |                                                122.8 px |  5.62 |   5.62 |  5.62 |   5.27 |  3.83 |         0 / 0 |  400 / 539 / 123 px | cl-pulse, the skeletons      |
|               | plain  |                                         79.4 / 101.7 px |  5.39 |   5.39 |  5.39 |   5.27 |  1.28 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| shade-dark    | 1      |                                                122.8 px |  5.23 |   5.23 |  5.23 |   5.38 |  3.84 |         0 / 0 |  400 / 539 / 123 px | cl-pulse, the skeletons      |
|               | 2      |                                                132.8 px |  5.23 |   5.61 |  5.23 |   5.38 |  3.84 |         0 / 0 |  386 / 513 / 133 px | cl-slide, the skeletons      |
|               | plain  |                                         79.4 / 101.7 px |  5.12 |   5.12 |  5.12 |   5.38 |  1.21 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| retro         | 1      |                                        126.8 / 374.4 px | 10.84 |  10.84 | 10.84 |   7.24 |  4.29 |         0 / 0 |  374 / 498 / 127 px | nothing (still)              |
|               | 2      |                                        119.8 / 351.4 px | 10.84 |   8.57 |  8.57 |   7.24 |  4.75 |         0 / 0 |  351 / 467 / 120 px | nothing (still)              |
|               | plain  | 85.8 / 101.7 / 103.8 / 119.4 / 119.7 / 281.4 / 329.1 px |  7.13 |   7.13 |  7.13 |   7.24 |  2.72 |         5 / 0 |  329 / 443 / 102 px | the skeletons                |
| grotesk       | 1      |                                                112.3 px |  8.72 |   8.72 |  8.72 |   6.07 |  6.19 |         0 / 0 |  353 / 473 / 112 px | cl-slide, the skeletons      |
|               | 2      |                                                120.8 px |  7.93 |   7.93 |  7.93 |   6.07 |  5.99 |         0 / 0 |  366 / 489 / 121 px | cl-fill, the skeletons       |
|               | plain  |                                  101.7 / 114 / 121.2 px |  5.74 |   5.74 |  5.74 |   6.07 |  1.41 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| lapis         | 1      |                                                134.9 px |  6.26 |   6.26 |  6.26 |   5.12 |  5.10 |         0 / 0 |  429 / 576 / 135 px | cl-glint, the skeletons      |
|               | 2      |                                                139.8 px |  5.73 |   5.73 |  5.73 |   5.12 |  4.66 |         0 / 0 |  411 / 547 / 140 px | cl-glint, the skeletons      |
|               | plain  |                                   81 / 101.7 / 121.2 px |  5.26 |   5.26 |  5.26 |   5.12 |  1.23 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| nostromo      | 1      |                                                119.3 px |  9.43 |   6.36 |  6.36 |   6.01 |  3.95 |         0 / 0 |  374 / 501 / 119 px | cl-roll, the skeletons       |
|               | 2      |                                                135.7 px |  7.15 |   7.15 |  7.15 |   6.01 |  4.14 |         0 / 0 |  394 / 524 / 136 px | cl-march, the skeletons      |
|               | plain  |                                         80.2 / 101.7 px |  5.84 |   5.84 |  5.84 |   6.01 |  1.74 |         0 / 0 |  329 / 443 / 102 px | the skeletons                |
| titanium      | 1      |                                                110.8 px |  6.67 |   6.67 |  6.67 |   6.09 |  5.53 |         0 / 0 |  356 / 479 / 111 px | cl-rise, the skeletons       |
|               | 2      |                                                124.3 px |  7.72 |   6.89 |  7.72 |   6.09 |  5.94 |         0 / 0 |  389 / 521 / 124 px | cl-march, the skeletons      |
|               | plain  |                 83.4 / 101.4 / 101.7 / 119.7 / 121.2 px |  4.74 |   4.74 |  4.74 |   6.09 |  1.37 |        10 / 0 |  388 / 443 / 121 px | the skeletons                |

### Findings on the plain strip (the package, not changed here)

- **The strip changes height with its state and its figures**: between 79.4
  and 121.2 px in every theme (loading is 79.4 to 114 px, nothing to show
  101.7, drawn 101.7 or 121.2 when the words take a second line), and up to
  329.1 px in retro. The package gives the label, the number and the words no
  fixed line boxes, so a strip jumps when it loads and when a figure's words
  grow: against Kenny's rule that siblings keep one place and size in every
  state.
- **The long label is cut or wrapped at desk width**: cut with an ellipsis in
  dark and deco (5 readings each, "Pressure, far end of the ring" 223 px in a
  220 px box), wrapped in dark, deco and titanium (10 readings each) and in
  retro (5), where the narrow tile's container rule lets it wrap. Against
  Kenny's rule that a label is never cut or wrapped.
- **The tile's frame is under 3:1** on the card behind it in 20 of 22 themes
  (1.21 in synthwave and shade-dark to 1.74 in nostromo; 2.72 in retro); only
  brutalism (18.73) and high-contrast (4.74) draw a frame that reads. A frame
  that is the only edge of a tile is a divider here.
- **The change is coloured with half a status pair** (`--success-foreground`,
  `--destructive` on the card, fix-70): it measures 4.51 to 7.18 with these
  figures, but the trend demo measured the same change at 1.00 in high-contrast,
  shade-light and grotesk.

### Not measured

- The keys and focus rings: a strip of plain tiles has no control of its own;
  the toggle tile and the trend tile are other components of the round.
- The patterns under the text (see Contrast) and the catalogue's own strip
  block.

## Round 2 (2026-10-05): one pick per aspect

### The options per theme

One line per theme and aspect: options 1, 2 and 3 by name (what each does is in `demo.js` `IDEAS` and in the review dialog).

| Theme         | Aspect  | 1                          | 2                      | 3                        |
| ------------- | ------- | -------------------------- | ---------------------- | ------------------------ |
| formal        | Shape   | The ledger row             | The booktabs table     | The engraved certificate |
| formal        | Loading | The pages riffle           | The ink rule           | The dotted leader        |
| formal        | Arrival | Entered with the pen       | Set in type            | The pages turned         |
| formal        | Tone    | The ruled entry            | The margin note        | Plus and minus           |
| formal        | Live    | Underlined in ink          | Struck and rewritten   | The clerk’s stamp        |
| light         | Shape   | One card                   | The legend chips       | Separate cards           |
| light         | Loading | Morning light              | Through the window     | The shadow swings        |
| light         | Arrival | Rising into the light      | Popped up              | Drawn by daylight        |
| light         | Tone    | The pill                   | The soft tag           | The lifted pill          |
| light         | Live    | A ring of light            | Lifted in              | Underlined               |
| dark          | Shape   | The departure board        | The rack               | The oscilloscope         |
| dark          | Loading | The flaps flick            | The status lamp blinks | The activity LEDs        |
| dark          | Arrival | Flipped in                 | Slid into the rack     | Read out                 |
| dark          | Tone    | The flap tag               | Signed in mono         | The LED                  |
| dark          | Live    | The flap turns             | Reverse video          | Rolled up                |
| cyberpunk     | Shape   | The ticker rail            | The data shards        | The HUD brackets         |
| cyberpunk     | Loading | A packet on the rail       | The glitch line        | Data rain                |
| cyberpunk     | Arrival | Glitched in                | Decoded                | Jacked in                |
| cyberpunk     | Tone    | The square chip            | The chevrons           | The neon edge            |
| cyberpunk     | Live    | Glitched                   | Reverse video          | Shaken                   |
| synthwave     | Shape   | The cassette counter       | The arcade scoreboard  | The sunset grid          |
| synthwave     | Loading | The tape’s teeth           | The screen rolls       | The sun rises            |
| synthwave     | Arrival | The score counts up        | Dropped in             | Flipped over             |
| synthwave     | Tone    | The counter tag            | The score chip         | The neon pill            |
| synthwave     | Live    | The counter rolls          | Flipped                | A neon ring              |
| pastel        | Shape   | The paint swatches         | The sticky notes       | The macarons             |
| pastel        | Loading | A sheen on the band        | A sheen on the note    | Bubbles rise             |
| pastel        | Arrival | Bounced in                 | Stuck on               | Rising softly            |
| pastel        | Tone    | The pill                   | The soft square        | The candy                |
| pastel        | Live    | A little wiggle            | A ring                 | Popped                   |
| terminal      | Shape   | The df -h table            | The tmux status bar    | The prompt listing       |
| terminal      | Loading | The block cursor           | The band               | The hash bar             |
| terminal      | Arrival | Printed                    | Line by line           | Scrolled up              |
| terminal      | Tone    | The square block           | Signed                 | The bracket              |
| terminal      | Live    | Reverse video              | Retyped                | The underscore           |
| forest        | Shape   | The trail markers          | The specimen mounts    | The tree rings           |
| forest        | Loading | Light walks the trail      | A seed rolls           | A leaf falls             |
| forest        | Arrival | Growing                    | Hung on the post       | Unfolding                |
| forest        | Tone    | The painted blaze          | The field note         | The pebble               |
| forest        | Live    | The post sways             | Grown in               | Underlined               |
| high-contrast | Shape   | The ruled grid             | The inverse heads      | The heavy underline      |
| high-contrast | Loading | The stepping bar           | The block cursor       | The tally                |
| high-contrast | Arrival | Wiped in                   | Dropped                | Typed                    |
| high-contrast | Tone    | The framed plate           | The bold sign          | The underlined plate     |
| high-contrast | Live    | Inverted                   | Framed                 | Underlined               |
| sepia         | Shape   | The typewriter tab stops   | The card catalogue     | The index card           |
| sepia         | Loading | The carriage steps         | A drawer slides out    | The ink spreads          |
| sepia         | Arrival | Typed                      | The drawer pushed in   | Rubber-stamped           |
| sepia         | Tone    | The typed tag              | The brass tag          | Plus and minus typed     |
| sepia         | Live    | Struck over                | Retyped                | Restamped                |
| blueprint     | Shape   | The dimension chain        | The bill of materials  | The title block          |
| blueprint     | Loading | The centre line marches    | The scan               | The construction line    |
| blueprint     | Arrival | Drafted                    | Rolled out             | Lettered                 |
| blueprint     | Tone    | The square tag             | The tolerance          | The revision triangle    |
| blueprint     | Live    | The revision ring          | Underlined             | Turned over              |
| solstice      | Shape   | The horizon                | The lanterns           | The sundial              |
| solstice      | Loading | The light breathes         | The lanterns breathe   | The sun crosses          |
| solstice      | Arrival | Sunrise                    | The lanterns hung      | Warmly popped            |
| solstice      | Tone    | The warm pill              | The glowing pill       | The sun and moon         |
| solstice      | Live    | Risen                      | A halo                 | The lantern sways        |
| brutalism     | Shape   | The poster grid            | The ticket stubs       | The label stack          |
| brutalism     | Loading | The hoisted lintel             | The accent stamps      | The marching block       |
| brutalism     | Arrival | Stamped                    | Dropped onto its footprint           | Shoved in                |
| brutalism     | Tone    | The boxed plate            | The hard shadow        | The arrow block          |
| brutalism     | Live    | Restamped                  | Slammed onto its yellow offset               | Shaken                   |
| deco          | Shape   | The floor indicator        | The colonnade          | The sunburst panel       |
| deco          | Loading | A glint runs across        | The rays fan out       | The dial’s needle        |
| deco          | Arrival | Drawn in gold              | The doors open         | Rising                   |
| deco          | Tone    | The square plaque          | The gold-edged plaque  | The chevron              |
| deco          | Live    | A gold underline           | The floor turns        | A gold ring              |
| phantom       | Shape   | The red-string board       | The case files         | The redacted dossier     |
| phantom       | Loading | The pins beat              | The folders shuffle    | The flashlight           |
| phantom       | Arrival | Pinned up                  | Typed into the report  | A card turned over       |
| phantom       | Tone    | The evidence tag           | The case number        | The circled clue         |
| phantom       | Live    | Redacted and rewritten     | A shiver               | Inverted                 |
| shade-light   | Shape   | The window blinds          | The paper cut-outs     | Embossed paper           |
| shade-light   | Loading | The slats drift            | A sheet slides in      | A cloud passes           |
| shade-light   | Arrival | Laid down                  | Rising                 | Pressed up               |
| shade-light   | Tone    | The soft pill              | The small tag          | The pressed pill         |
| shade-light   | Live    | Risen                      | The sheet stirs        | A soft ring              |
| shade-dark    | Shape   | The gallery wall           | The velvet tray        | The museum plaque        |
| shade-dark    | Loading | The lights breathe         | A sheen crosses        | The light swings         |
| shade-dark    | Arrival | Lit up                     | Unveiled               | Unfolded                 |
| shade-dark    | Tone    | The square tag             | The cushion            | The engraved tag         |
| shade-dark    | Live    | Underlined                 | A soft ring            | Risen                    |
| retro         | Shape   | The status bar             | The list view          | The group box            |
| retro         | Loading | The progress blocks        | The marquee            | The flying page          |
| retro         | Arrival | Painted                    | Dropped                | Progress                 |
| retro         | Tone    | The flat tag               | The raised button      | The sunken field         |
| retro         | Live    | Selected                   | Repainted              | Flipped                  |
| grotesk       | Shape   | The numbered grid          | The line colours       | The big numerals         |
| grotesk       | Loading | A line runs across         | The blocks fill in     | A square steps the grid  |
| grotesk       | Arrival | Slid in                    | Wiped in               | Rising on the grid       |
| grotesk       | Tone    | The flat block             | Signed, bold           | The arrow                |
| grotesk       | Live    | Inverted                   | Risen                  | Underlined               |
| lapis         | Shape   | The arcade                 | The illuminated band   | The mosaic band          |
| lapis         | Loading | A glint runs across        | The lattice is drawn   | The lamp in the arch     |
| lapis         | Arrival | Gilded in                  | Turned in              | Rising                   |
| lapis         | Tone    | The small tag              | The gilded tag         | The fleuron              |
| lapis         | Live    | Underlined in gold         | A gold ring            | Turned                   |
| nostromo      | Shape   | The readout bank           | The bulkhead           | The CRT screen           |
| nostromo      | Loading | The sweep rolls            | The chevrons march     | The sonar ring           |
| nostromo      | Arrival | Printed out                | Glitched in            | Flipped in               |
| nostromo      | Tone    | The square tag             | The stencil            | The bracketed readout    |
| nostromo      | Live    | Glitched                   | Inverted               | Reprinted                |
| titanium      | Shape   | The anodised bars          | The machined bezels    | The milled bar           |
| titanium      | Loading | Light rises along the edge | The grain runs         | The cutting pass         |
| titanium      | Arrival | Machined up                | Slid into the rail     | Etched                   |
| titanium      | Tone    | The small tag              | The square tag         | The chamfered tag        |
| titanium      | Live    | Risen                      | Flipped                | A ring                   |

### Measured (round 2, 2026-10-05)

Firefox through Playwright at 1440 × 1000, the page served by a local
`http.server`.

**The rebuild's first run** (every option, both motion settings): heights,
columns, the options' differences, the loading pictures (running with motion,
still under reduce) and the preview all held in 22 themes. It found tile
frames under 3:1 (pastel shape 1 at 1.27, forest shape 2 at 1.26, titanium
shape 1 at 1.23, shade-dark shape 3 at 2.93) and labels it counted as cut:
phantom in every cell and the preview, and arrival 2 in forest, solstice
and pastel.

**What changed after it.** The frames of pastel shape 1, forest shape 2 and
titanium shape 1 were a mix of `--border` with transparent; they are now
`1px solid var(--cl-rule)` (the ink mixed into the plate, the rule every
shape already draws), still one pixel wide. Shade-dark shape 3's rule had been set to 72 % ink after the first run without a new measurement; it is measured here. The labels were never cut: the first
run counted a label as wrapped when its bounding box was taller than 1.5
lines, and a turned box is taller than its line (phantom's pinned cards lean
by 0.5 to 0.6 degrees, the swing and pop arrivals turn and scale the tile).
The check now reads the label's own line box (`offsetHeight` and its line
count), which a transform does not change.

**This run.** Every theme, every cell and the preview, with the shape set to
1, 2 and 3 in turn. The frame contrast is the lowest of every drawn side of
the first two tiles of each cell, each against the strip's ground, the page
(`--background`) and the card (`--card`). A label is cut when its
`scrollWidth` exceeds its `clientWidth`, when its line box holds more than
one line, or when it reaches past a clipping ancestor; sampled every 50 ms
for 1.2 s after Loading, after Drawn (the arrival) and after a live update,
for each of the five sets of figures (360 samples per theme, each over every
cell). "No frame" means the shape draws no border (a shadow, a rule above
the strip or nothing).

| Theme         | Shape 1  | Shape 2  | Shape 3  | Labels cut       | Errors |
| ------------- | -------- | -------- | -------- | ---------------- | ------ |
| formal        | no frame | no frame | 5.09     | 0 of 360 samples | 0      |
| light         | no frame | no frame | no frame | 0 of 360 samples | 0      |
| dark          | no frame | 6.40     | 5.73     | 0 of 360 samples | 0      |
| cyberpunk     | no frame | 15.26    | no frame | 0 of 360 samples | 0      |
| synthwave     | 4.67     | no frame | 4.67     | 0 of 360 samples | 0      |
| pastel        | 4.21     | no frame | no frame | 0 of 360 samples | 0      |
| terminal      | no frame | no frame | no frame | 0 of 360 samples | 0      |
| forest        | 4.61     | 4.70     | 4.40     | 0 of 360 samples | 0      |
| high-contrast | no frame | 21.00    | no frame | 0 of 360 samples | 0      |
| sepia         | no frame | 4.51     | 4.26     | 0 of 360 samples | 0      |
| blueprint     | 5.24     | no frame | 5.59     | 0 of 360 samples | 0      |
| solstice      | no frame | 5.29     | 5.29     | 0 of 360 samples | 0      |
| brutalism     | no frame | 18.23    | 18.23    | 0 of 360 samples | 0      |
| deco          | 7.55     | 7.55     | 5.59     | 0 of 360 samples | 0      |
| phantom       | 6.45     | 6.77     | no frame | 0 of 360 samples | 0      |
| shade-light   | 3.70     | 3.70     | no frame | 0 of 360 samples | 0      |
| shade-dark    | 3.84     | no frame | 3.48     | 0 of 360 samples | 0      |
| retro         | no frame | no frame | 3.75     | 0 of 360 samples | 0      |
| grotesk       | 6.19     | no frame | no frame | 0 of 360 samples | 0      |
| lapis         | 5.10     | 3.21     | 4.36     | 0 of 360 samples | 0      |
| nostromo      | no frame | 3.68     | 3.68     | 0 of 360 samples | 0      |
| titanium      | 5.53     | 5.13     | no frame | 0 of 360 samples | 0      |

Every drawn tile frame is at 3:1 or more: the lowest is lapis shape 2
(3.21), then shade-dark shape 3 (3.48, the re-measure after its change to
72 %). Brutalism shape 3 measures 18.23 and labels cut 0; phantom shape 3
draws no frame and its labels cut 0 (both re-measured after the rebuild's
change). The review dialog opened from the hub
(`?next=/catalogue/changed.html&review=open`) shows five choice groups
(shape, loading, arrival, tone, live) of three options each with nothing
ticked, in all 22 themes, with 0 console errors.

**Open, not a label:** while a figure lands from larger (`cl-a-stamp` at
1.6, `cl-l-stamp` at 1.35), the number's box is wider than its tile for
200 to 450 ms, so the tile's `scrollWidth` exceeds its `clientWidth`:
formal live 3, pastel live 3, sepia arrival 3 and live 3, and brutalism's
arrival 1 and live 1 (which every other brutalism cell shows by default).
The label stays inside its tile.
