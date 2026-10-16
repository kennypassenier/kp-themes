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

## Decisions to judge

- Tiles: the "only" button of the facet list is a sibling of the label, always shown on touch; a status row keeps one detail line (`--kp-statusrow-detail-lines: 2` for more); the tile reserves a mark column so a spinner never moves the title.
- Grids: heat tones are fills in the tone's ink with a pattern per state; the matrix dims what a lit name does not touch; `data-kp-sort-value` sorts and range-filters, search keeps reading the shown text.
- Time: a lane with a run still open reserves one spare row and the viewport keeps its first height; pills mark time by their top edge; `+N` opens the menu button; the selected range replaces the toolbar row's range buttons and Live (inert while it stands), so it covers no lane and adds no height.
