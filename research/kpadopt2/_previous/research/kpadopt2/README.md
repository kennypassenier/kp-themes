# research/kpadopt2: round 2 of the dashboard adoption, one page

Kenny's rule (2026-10-04): a demo is ONE central page where every section is judged through one review dialog. This folder holds the eight components
the admin dashboard still draws itself (docs/admin/KP_THEMES_ADOPTION.md), built in the package first, in **formal only** until Kenny approves them:
[`demo.html`](demo.html), eleven sections, `data-review-themes="formal"`, one review topic (`kpadopt2`).

- `demo.html` is written by `build.mjs`; edit `build.mjs`, `parts/`, `demo.css`, `demo-*.js`.
- `parts/tiles.mjs` (+ `parts/looks.mjs`): action tiles, status rows, the facet list (3 sections). `parts/grids.html`: heat grid, matrix, bar in a table
  cell (3 sections). `parts/time.mjs`: week agenda (3 sections) and run timeline (2 sections).
- Package: every `kp-` class and every script under `js/`. Mock: the sample data, the scripted runs, the buttons that drive a demo, the hover / focus / press
  rows (the page copies the package's own rules with the pseudo-class turned into a class; needs http).

| Part                | What it is for                                        | Dashboard source       | What the package offers                                                     | Cost   | Recommendation |
| ------------------- | ----------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------- | ------ | -------------- |
| Action tile         | a button or link with a title and one sentence        | `nx-action`            | `.kp-action`, busy, destructive, equal heights                              | medium | Adopt          |
| Status row          | one state per item, Retry on failure                  | `perstack-chip`        | `.kp-statusrow`, `.kp-statuslist`: ok, loading, failed with Retry, empty    | medium | Adopt          |
| Facet list          | checkbox rows, counts, an "only" button               | `hl-opt`               | `.kp-facets`                                                                | medium | Adopt          |
| Heat grid           | stacks by nights                                      | `bk-heat`              | `.kp-heat`, `setHeat()`                                                     | large  | Adopt          |
| Matrix              | source by destination                                 | `fw-mx`                | `.kp-matrix`, `setMatrix()`                                                 | large  | Adopt          |
| Bar in a table cell | a value with a proportional bar, sorted by its number | `mp-caps`, `mp-growth` | `.kp-bar-cell`, `td[data-kp-sort-value]`                                    | small  | Adopt          |
| Week agenda         | seven days, items at their time, now-line, `+N`       | `sch-week`, `sch-pill` | `.kp-week`, `js/week.js`                                                    | medium | Adopt          |
| Run timeline        | bars per job on a live axis, a brushed selection      | `ac-tl`                | `.kp-gantt`, `js/gantt.js`; the selected range is a chip in the toolbar row | large  | Adopt          |

## Round 2 of the page (2026-10-16-r2): the four still open

Kenny approved seven sections in round 1 (`VERDICTS.json`); the page now builds only the matrix, the bar cell, the week agenda and its
states (`OPEN` in `build.mjs`; the other parts stay in `parts/`, and the demo scripts wire a section only when it is on the page). His
general note: build from the package's own parts and each theme's spirit. What changed, at the root:

- **Matrix:** a column header had no `gap` between its colour mark and its name (only the row header had one); both now share one
  rule, `--kp-matrix-mark-gap` and `--kp-matrix-head-pad` (`--kp-space-sm`, `--kp-space-xs` in a box under 36rem). The demo's state
  buttons are the package's segmented control.
- **Bar cell:** loading did animate (formal's ledger rule in the groove) but read as empty rows. The figure now waits too, as a skeleton
  line (`.kp-bar-cell__ghost`), and the demo's Show loading puts the table in its own loading state with its busy panel and the
  theme's spinner (`dataTable().busy({ overlay: true })`).
- **Week agenda:** the steps are one control in the theme's segmented track (chevron back, Today, chevron on, named by the dictionary's own
  Previous and Next; Today is `aria-disabled` while the range starts today), the title in the theme's display face. An agenda that can load or move lets what
  comes later arrive the theme's way (`js/motion.js` `easeSize()`, attached on its first loading state or by its week buttons); a new
  range waits in its loading ghosts in the demo, then its items arrive. In rows (below 40rem) the state sentence stays in the items'
  column, clear of the day names it ran over at 390 px, and stands on a plate of the card's ground so no day's rule runs through it.
- **Week states:** "Make it load, then arrive" drove the agenda of the other section (`weekWide`), off screen in the review dialog; it
  now drives this section's loading agenda, as the package's running-job button (`kp-button--live` with the theme's spinner) while it
  waits.

## Round 3 of the page (2026-10-16-r3): the week agenda's states

Kenny approved the matrix, the bar cell and the week agenda in round 2; only the states section is on the page (`OPEN` in
`build.mjs`). His note: the loading picture was only the sentence "Reading the week" in the middle, and while loading items and
words overlapped (his screenshot: every day's old pills stacked at 00:00 under the ghosts, two items' words on top of each other).

- **The overlap, at its root:** `paint()` in `js/week.js` re-ordered a day only by re-appending the wanted nodes; a loading state
  wants no pills, so nothing was taken out and the previous items stayed in the day, lost their place (`--kp-week-top` is cleared
  for a loading state) and stood stacked at the top. Every node a day holds and no longer wants now leaves it. Before, the first
  "Make it load" looked right only because that agenda had never held items.
- **The loading picture is formal's own** (G10, G2): each ghost is an unwritten entry of a pill's size and shape (paper, the
  entry's heavy 4px rule on its start edge, a short ledger line for the time, a longer one for the label), at a household week's
  times and never touching another; the skeleton's navy rule is ruled along each entry's foot, one step (300 ms) later per day and
  per line down, so the ruling runs through the week (`css/formal-register.css`, "A loading week is the ledger being ruled"). The
  sentence is still read out (`role="status"`) but no longer drawn over the week.
- **In rows (below 40rem)** a pill that arrives first opens its room, then is ruled in at full height (`--kp-leave-fold-start: 1`),
  so no pill shows squeezed words or reaches over its neighbour while the row opens.
- **Review kit:** the last open pair judged, a small dialog offers **Back to the Agenda** first (research/_review/README.md).

## Decisions to judge

- Tiles: the "only" button of the facet list is a sibling of the label, always shown on touch; a status row keeps one detail line (`--kp-statusrow-detail-lines: 2` for more); the tile reserves a mark column so a spinner never moves the title.
- Grids: heat tones are fills in the tone's ink with a pattern per state; the matrix dims what a lit name does not touch; `data-kp-sort-value` sorts and range-filters, search keeps reading the shown text.
- Time: a lane with a run still open reserves one spare row and the viewport keeps its first height; pills mark time by their top edge; `+N` opens the menu button; the selected range replaces the toolbar row's range buttons and Live (inert while it stands), so it covers no lane and adds no height.
