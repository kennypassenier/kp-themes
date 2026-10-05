# A network graph of its own, per theme

Kenny, form v18 (2026-10-05): the character round, one component at a time,
all 22 themes in one demo. The meter (`research/character-meter`), the time
chart (`research/character-chart`) and the month heatmap
(`research/character-calendar`) came first; this is the fourth component, the
network graph.

`.kp-graph` (css/components.css, "Network graph", scope-143; js/graph.js) is
today the same shape in every theme: a hub in the middle and the rest of the
network on a ring around it, every node a disc with a ring in its own hue and
a filled core, a node outside the network a dashed grey ring, a node whose
settings differ from the plan a dotted warning ring, the links drawn by kind
(a colour and a dash each), labels pointing away from the hub on a halo in
the page's colour, the kinds as pills above the picture with Show all, a
hover or a pick dimming everything else, and a pulsing ellipse while it
loads. This demo gives every theme two graphs drawn in its own world, beside
the plain graph of today.

## Files

- `demo.html`: one section judged per theme with the review kit
  (`../_review/review.js`): one choice per theme, "Character 1",
  "Character 2" or "The plain graph, as today", each character's name and
  parts as the option's hint. The controls sit inside the section, so they
  travel into the review dialog: State (Drawn, Loading, Nothing to draw,
  Could not read, and a live update that hands over the same network with new
  numbers), Network (fifteen long names, size by flow, pick a node, hide a
  kind), and the speed of every animation.
- `graphs.css`: the 44 characters, in `@layer kp.signature`, scoped
  `[data-theme='<name>'] [data-gr='a'|'b']`. In a register the same rules read
  `[data-theme='<name>'] .kp-graph`. The contract and the shared knobs
  (`--gr-paper`, `--gr-pat`, `--gr-under`, `--gr-over`, `--gr-frame`,
  `--gr-edge-*`, `--gr-ring*`, `--gr-core*`, `--gr-hub*`, `--gr-ext*`,
  `--gr-label`, `--gr-halo`, `--gr-font`, `--gr-chip-*`, `--gr-skel-*`, …)
  are at the top of the file; every loop is in one
  `prefers-reduced-motion: no-preference` block near the end, and only the
  loading picture (and nostromo 1's radar sweep) ever moves.
- `demo.js`: the names and descriptions (`IDEAS`), the review choices and
  look-at lines built from them, the network (the catalogue's northern water
  network and its fifteen-long-name variant), the states driven through the
  package's own API (`setGraphData()`, `setGraphState()`, `graphSelect()`,
  `graphHideKind()`), the `kp-graph-change` line, the speed control.
- `demo.css`: the page layout only; the three columns share their rows (a
  subgrid), so the three pictures start on one line.

js/graph.js is not changed.

## What js/graph.js does not hand a character

Found while building; each would want a change in the module, so none of the
44 characters leans on it:

- **No class or attribute per kind on a node or an edge's group.** A kind is
  on the edge itself (`data-kp-kind`, `data-kp-style`) and its colour comes
  in as an inline `--kp-graph-edge-colour`, which a register cannot override
  without `!important`. A character that wants a kind's own material (a
  radio link drawn as a different stroke) can reach it with
  `[data-kp-kind='radio']`, as phantom 1 does, but it then names the kinds
  the page chose.
- **The nodes' hue is inline too** (`--kp-graph-hue` per node, and the colour
  is built from `--chart-1`). A character can only mix it
  (`--gr-node-mix` here); it cannot replace the hue ladder with a palette of
  its own.
- **No marker, pattern or gradient of the character's own in the SVG**: the
  module writes no `<defs>`, so an arrowhead, a halftone over the picture or
  a per-edge texture has to come from the box's `::before` / `::after`, not
  from the strokes. The CRT sweep, the scanlines and the halftone are drawn
  that way.
- **The label is one `<text>` with a stroke halo**, so a character cannot put
  a plate behind a label (a bracketed tag, a stamped card); it can only change
  the type, the halo's colour and its width.
- **Nothing says which node is hovered on the graph itself**: `data-kp-focus`
  only says that something is lit, and the lit nodes carry `is-on`. A
  character that wanted to dim the paper while one node is read can use
  `[data-kp-focus]`, which is what the shared `--kp-graph-dim` already does
  for the edges.
- **The loading picture is one ellipse** (`.kp-graph__skeleton`): every
  loading character here is that one shape, drawn differently (a dashed
  circle, a plotter line, a chase of bulbs, a sweep behind it).

## The characters

| Theme         | Character 1                                                                                                                      | Character 2                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| formal        | The organisation chart: hairline links, open circles with a pale core, the hub in a double weight, small-caps labels; still      | The engraved plate: a ruled double border, engraved lines, solid dots in an engraved ring, serif italic labels; still    |
| light         | The soft canvas: white discs on a soft shadow with a hue rim, soft round links, misted dimming; a still dashed ring              | Daylight: wide pastel rims, a sunny amber hub over a warm wash; a band of light runs the ring                            |
| dark          | The status board: black discs with a lit rim, thin lit links, ticker-mono labels; still                                          | The machined panel: chamfered pockets lit from below, engraved links, mono capitals; still                               |
| cyberpunk     | The neon circuit: a trace grid, neon tubes with a glow, glowing rings with a dark core, cut-corner chips; a packet runs the ring | The netrunner map: square-capped data links, broken ICE rings, hazard-taped tabs; the ICE ring spins                     |
| synthwave     | The grid-floor constellation: a perspective floor and a pink horizon, star nodes, glowing star lines; the horizon pulses         | The arcade vector screen: outline-only nodes and links under scanlines; the vector ring runs                             |
| pastel        | Candy beads and licorice: fat candy beads with a highlight, thick round licorice strings, sticker-shadow chips; the beads hop    | The pinboard doodle: a dotted pad, dotted hand-drawn rings, dashed doodle links, washi chips; the doodle drifts          |
| terminal      | The box-drawing map: a framed text screen, square-capped links, dashed cell rings, `[x]`/`[ ]` kinds; the ring ticks             | traceroute: hop dots, inverse-video node blocks, a solid hub, underlined kinds; the dots march                           |
| forest        | The trail map: contour rings on kraft, trail-dash links, cairn rings, wooden markers; the trail walks                            | The canopy: thick bark twigs, leaf discs with a dark vein ring, leaf tags; the canopy breathes                           |
| high-contrast | Patterned edges, shaped nodes: every kind its own heavy pattern, every node a different core shape, a 2px frame; still           | The ink plate: black discs with a white core, heavy patterned links, a double-weight hub, framed kinds; still            |
| sepia         | The family tree: fine nib lines, washed ink rings, a vignette, an engraved key; the nib draws the ring                           | The letterpress chart: speckled paper, blind-impressed nodes, heavier ink rules, small-caps labels; the platen presses   |
| blueprint     | The wiring schematic: a millimetre grid, white-ink wires, junction dots, an amber terminal block; the plotter dashes             | The drafting sheet: a 40 px grid in a drawn frame, chain lines, dash-and-dot rings; the dash marches                     |
| solstice      | The low sun: a glow rising from the foot, warm links, sun-lit node rings; a dawn breathes                                        | The embers: coal-dash links, hot warning rims, the fire as the hub; the embers breathe                                   |
| brutalism     | Slabs and heavy lines: 4px square-capped links, 4px black rings with a hard shadow, blocky kinds, a yellow pick; the slab stamps | The sticker sheet: a lavender sheet, fat hue-filled stickers in black outline, askew sticker kinds; the stickers drop in |
| deco          | Gilt rays: a lacquer sunburst in a double gold frame, fine gold rays, gold-framed medallions; a glint runs the gold ring         | The marquee: every link a row of bulbs, nodes ringed in bulbs, marquee plaques; the bulbs chase                          |
| phantom       | Stamped tags and string: white card, red string, stamped ring tags, askew ransom chips; the stamp beats                          | The calling card: black cards under a halftone, a red slash ring, slanted card kinds; the halftone shuffles              |
| shade-light   | Pencil in the shade: hatched paper, soft pencil links, lifted discs with a pencil rim; the sketch hatches                        | The leaf shade: dappled shade over the sheet, a sunny hub rim; a cloud's shade passes                                    |
| shade-dark    | Silverpoint: silver hairlines, silver rings over a dark core; the silver hatches                                                 | The reading lamp: a warm pool behind the hub, warm links and rims; the pool breathes                                     |
| retro         | The 1995 network diagram: a sunken white well, one-pixel links, bevelled grey discs, raised kind buttons that sink; still        | The paint program: flat filled discs in a black outline, solid primary links, tool-button kinds; still                   |
| grotesk       | The transit map: 5px round-capped coloured lines, white interchange rings, flat colour bars; a line runs                         | The Swiss grid: hairline links, solid black discs, a red hub, boxed bold kinds; three blocks cut in                      |
| lapis         | The girih lattice: a girih lattice on lapis in a double gold frame, gold lattice links, gold-ringed medallions; a glint runs     | Lapis on vellum: ivory vellum, lapis ink links, gold-rimmed lapis dots, serif italic labels; a burnisher's glint         |
| nostromo      | The CRT radar sweep: a green-black CRT in the beige bezel under scanlines, phosphor traces and blips; a radar sweep turns        | The indicator panel: embossed links, lit indicator lamps in a thick bezel, label-tape kinds; the lamps scan              |
| titanium      | The milled plate: a brushed plate, engraved links, knurled (dotted) rings, a blue heat-tint hub; the cutter runs                 | The instrument dial: recessed apertures ringed in their anodised hue, a knurled hub ring; the knurl rolls                |

Themes whose rules forbid loops keep their loading picture still: formal 1
and 2, light 1, dark 1 and 2, high-contrast 1 and 2, retro 1 and 2 (light 2
keeps the slow band of daylight, as the chart's and the calendar's light 2
did). Nothing loops at rest in any character; nostromo 1's sweep runs only
while the network is being read.

## Measured

Firefox (Playwright's, one script, its own `http.server`, under
`flock /tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport
1600 × 1200, with and without `prefers-reduced-motion: reduce`.

- **Console:** 0 errors and 0 page errors in all 22 themes, with and without
  reduced motion, through every state and every network.
- **Heights:** the picture (`.kp-graph__box`) measured in Drawn, Loading,
  Nothing to draw, Could not read, a picked node, a hidden kind, sized by
  flow, after the live update and with the fifteen long names: one height per
  column in all 66 columns (482 px, 484 px in high-contrast 1 and retro 1 and
  486 px in both brutalism characters, whose frames are thicker).
- **Reduced motion:** with `prefers-reduced-motion: reduce`, 0 running
  animations in every column, while loading and at rest, in all 22 themes.
- **Contrast**, from the computed styles over the blended paper (every colour
  resolved through a canvas, alpha composited onto the picture's own
  background): the label's fill against its own halo, every drawn edge's
  stroke against the paper, every node ring against the paper, and the kind
  chips' text against their chip. The table gives the lowest of each over
  Drawn, a picked node, sized by flow and the fifteen long names. Every
  character is at or above 4.5:1 for labels and chips and 3:1 for edges and
  node rings, in every theme.
- **Labels:** the graph's own `fitGraphLabels()` result read back from the
  drawn boxes: 0 overlapping pairs and 0 labels outside the viewBox in every
  column in all four networks; the "cut" column counts the labels the fitter
  shortened with an ellipsis (ready / fifteen long names), which is the
  module's own doing and the same order in every character.

| Theme         | Option | Height | Label |  Edge |  Ring |  Chip | Overlaps | Cut (ready / long) | Loading animates |
| ------------- | ------ | -----: | ----: | ----: | ----: | ----: | -------: | -----------------: | ---------------- |
| formal        | 1      | 482 px | 16.41 |  7.54 | 11.22 | 16.41 |        0 |              5 / 8 | nothing (still)  |
|               | 2      | 482 px | 16.41 |  8.22 | 11.22 | 16.41 |        0 |              3 / 5 | nothing (still)  |
|               | plain  | 482 px | 15.73 |  3.37 |  6.72 | 16.41 |        0 |              3 / 3 | kp-pulse         |
| light         | 1      | 482 px | 17.20 |  4.56 |  5.89 | 17.20 |        0 |              3 / 3 | nothing (still)  |
|               | 2      | 482 px | 17.20 |  4.89 |  3.30 | 17.20 |        0 |              3 / 3 | gr-march         |
|               | plain  | 482 px | 17.20 |  3.07 |  4.78 | 17.20 |        0 |              3 / 3 | kp-pulse         |
| dark          | 1      | 482 px | 17.92 |  7.65 | 10.44 | 17.92 |        0 |              4 / 9 | nothing (still)  |
|               | 2      | 482 px | 16.26 |  6.94 |  9.47 | 17.52 |        0 |              4 / 7 | nothing (still)  |
|               | plain  | 482 px | 17.10 |  5.28 |  5.28 | 16.26 |        0 |              2 / 2 | kp-pulse         |
| cyberpunk     | 1      | 482 px | 13.51 |  6.03 |  9.43 | 13.51 |        0 |              4 / 7 | gr-march         |
|               | 2      | 482 px | 13.85 |  6.50 |  9.67 | 13.85 |        0 |              0 / 2 | gr-march         |
|               | plain  | 482 px | 13.51 |  5.54 |  6.36 | 12.68 |        0 |              2 / 2 | kp-pulse         |
| synthwave     | 1      | 482 px | 14.03 |  7.13 |  7.79 | 10.74 |        0 |              3 / 5 | gr-pulse         |
|               | 2      | 482 px | 14.42 |  7.00 |  7.35 | 14.42 |        0 |              3 / 5 | gr-march         |
|               | plain  | 482 px | 14.03 |  5.86 |  6.04 | 10.74 |        0 |              2 / 2 | kp-pulse         |
| pastel        | 1      | 482 px | 13.77 |  5.15 |  4.72 | 13.77 |        0 |              3 / 5 | gr-march         |
|               | 2      | 482 px | 13.77 |  4.76 |  4.25 | 13.77 |        0 |              3 / 3 | gr-march         |
|               | plain  | 482 px | 12.69 |  3.14 |  2.97 | 13.77 |        0 |              3 / 3 | kp-pulse         |
| terminal      | 1      | 482 px | 13.50 | 10.25 |  7.96 | 12.96 |        0 |              4 / 7 | gr-march         |
|               | 2      | 482 px | 13.50 | 10.51 |  8.60 | 12.96 |        0 |              3 / 5 | gr-march         |
|               | plain  | 482 px | 13.50 |  8.36 |  6.48 | 12.96 |        0 |              4 / 7 | kp-pulse         |
| forest        | 1      | 482 px | 13.86 |  5.31 |  7.40 | 11.70 |        0 |              4 / 5 | gr-march         |
|               | 2      | 482 px | 11.82 |  5.48 |  6.70 | 11.27 |        0 |              3 / 3 | gr-pulse         |
|               | plain  | 482 px | 13.04 |  3.72 |  4.77 | 13.86 |        0 |              3 / 3 | kp-pulse         |
| high-contrast | 1      | 484 px | 21.00 | 14.49 |  7.78 | 21.00 |        0 |              4 / 5 | nothing (still)  |
|               | 2      | 482 px | 21.00 | 19.85 |  7.78 | 21.00 |        0 |              4 / 5 | nothing (still)  |
|               | plain  | 482 px | 21.00 |  6.84 |  7.69 | 21.00 |        0 |              2 / 2 | kp-pulse         |
| sepia         | 1      | 482 px | 13.21 |  9.08 |  9.19 | 13.21 |        0 |              2 / 2 | gr-write         |
|               | 2      | 482 px | 13.21 |  8.25 |  9.19 | 13.21 |        0 |              2 / 2 | gr-pulse         |
|               | plain  | 482 px | 12.44 |  5.10 |  4.43 | 13.21 |        0 |              3 / 3 | kp-pulse         |
| blueprint     | 1      | 482 px | 14.93 | 11.11 |  8.47 | 14.93 |        0 |              4 / 7 | gr-march         |
|               | 2      | 482 px | 14.93 | 10.60 | 11.80 | 14.93 |        0 |              4 / 7 | gr-march         |
|               | plain  | 482 px | 14.93 |  6.35 |  8.77 | 13.33 |        0 |              3 / 3 | kp-pulse         |
| solstice      | 1      | 482 px | 14.30 |  7.22 |  8.43 | 10.53 |        0 |              2 / 2 | gr-pulse         |
|               | 2      | 482 px | 15.27 |  7.31 |  4.64 | 15.27 |        0 |              2 / 2 | gr-pulse         |
|               | plain  | 482 px | 14.30 |  5.15 |  6.97 | 12.72 |        0 |              3 / 3 | kp-pulse         |
| brutalism     | 1      | 486 px | 18.23 |  8.26 | 13.78 | 18.73 |        0 |              3 / 5 | gr-march         |
|               | 2      | 486 px | 18.23 |  9.56 | 11.88 | 18.23 |        0 |              3 / 5 | gr-drop          |
|               | plain  | 482 px | 18.23 |  3.06 |  2.77 | 18.73 |        0 |              3 / 5 | kp-pulse         |
| deco          | 1      | 482 px | 15.01 |  9.98 |  8.16 | 15.01 |        0 |              3 / 5 | gr-march         |
|               | 2      | 482 px | 15.82 |  8.38 |  8.60 | 15.82 |        0 |              3 / 5 | gr-march         |
|               | plain  | 482 px | 15.01 |  4.85 |  8.16 | 13.87 |        0 |              3 / 3 | kp-pulse         |
| phantom       | 1      | 482 px | 17.18 |  5.86 |  4.81 | 17.18 |        0 |              2 / 2 | gr-pulse         |
|               | 2      | 482 px | 19.53 | 12.69 |  5.47 | 19.53 |        0 |              2 / 2 | gr-march         |
|               | plain  | 482 px | 18.97 |  3.59 |  5.16 | 17.18 |        0 |              2 / 2 | kp-pulse         |
| shade-light   | 1      | 482 px |  6.07 |  4.71 |  3.27 |  6.07 |        0 |              2 / 2 | gr-pulse         |
|               | 2      | 482 px |  6.07 |  4.58 |  5.16 |  6.07 |        0 |              2 / 2 | gr-pulse         |
|               | plain  | 482 px |  5.86 |  3.64 |  4.68 |  6.07 |        0 |              2 / 2 | kp-pulse         |
| shade-dark    | 1      | 482 px |  6.06 |  5.40 |  4.70 |  5.44 |        0 |              2 / 2 | gr-pulse         |
|               | 2      | 482 px |  6.06 |  5.30 |  4.81 |  5.44 |        0 |              2 / 2 | gr-pulse         |
|               | plain  | 482 px |  6.06 |  4.69 |  5.08 |  5.44 |        0 |              2 / 2 | kp-pulse         |
| retro         | 1      | 484 px | 11.97 |  7.58 |  9.61 | 10.84 |        0 |             8 / 13 | nothing (still)  |
|               | 2      | 482 px | 11.97 |  5.79 |  9.61 | 10.84 |        0 |             8 / 13 | nothing (still)  |
|               | plain  | 482 px |  9.46 |  3.69 |  5.64 | 11.97 |        0 |              7 / 7 | kp-pulse         |
| grotesk       | 1      | 482 px | 18.73 |  6.28 | 11.55 | 18.73 |        0 |              4 / 5 | gr-march         |
|               | 2      | 482 px | 18.73 | 14.09 |  6.07 | 18.73 |        0 |              4 / 5 | gr-march         |
|               | plain  | 482 px | 18.73 |  4.99 |  3.38 | 18.73 |        0 |              3 / 5 | kp-pulse         |
| lapis         | 1      | 482 px | 10.96 |  6.86 |  3.24 | 10.96 |        0 |              2 / 2 | gr-march         |
|               | 2      | 482 px |  9.39 |  6.20 |  4.48 |  9.39 |        0 |              2 / 2 | gr-pulse         |
|               | plain  | 482 px | 10.96 |  3.94 |  5.47 |  9.39 |        0 |              3 / 2 | kp-pulse         |
| nostromo      | 1      | 482 px |  5.70 |  3.97 |  3.79 |  5.70 |        0 |              4 / 7 | gr-sweep         |
|               | 2      | 482 px |  9.43 |  7.22 |  8.08 |  8.21 |        0 |              3 / 5 | gr-march         |
|               | plain  | 482 px |  9.43 |  3.77 |  3.03 | 10.61 |        0 |              2 / 2 | kp-pulse         |
| titanium      | 1      | 482 px | 13.33 |  7.91 |  8.22 | 11.92 |        0 |             7 / 11 | gr-march         |
|               | 2      | 482 px | 15.42 |  9.71 |  7.50 | 13.33 |        0 |             7 / 11 | gr-march         |
|               | plain  | 482 px | 15.42 |  4.76 |  5.30 | 13.33 |        0 |              3 / 5 | kp-pulse         |

The numbers above are the second full run; lapis 1 and 2 (gold is lapis's
`--primary`, not its red `--accent`) and cyberpunk 1 (a yellow hub ring under
3:1 on the black board) were changed after it and measured again in a third
run, which moved only their ring numbers (lapis 1 ring 3.24 → 5.83, lapis 2
ring 4.48 → 5.89, cyberpunk 1 ring 1.70 → 9.43 — the table above already
holds the fixed cyberpunk value); nothing else in the third run differed, and
it too had 0 console errors, one height per column and 0 animations under
reduced motion.

### Not measured

- Phone width (the picture draws a taller, narrower layout under 600 px) and
  the catalogue's own graph page: this round judges the three columns side by
  side at desk width.
- The keys (arrows, Enter, Esc) and the focus ring in each character: the
  module's, unchanged, and the release suite covers them.
