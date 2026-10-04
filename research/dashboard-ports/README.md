# Dashboard components to port

**Decided (2026-10-04).** Kenny approved all eight in formal with these picks:
tiles, every row as tall as the tallest tile; key figures, a filter tile when on
has a border and a coloured background, and the 24-hour sparkline is a line over
a soft area; page header, the overflow button is the word "More" with ▾, and on a
phone the primary comes first at the full width; attention band, a soft tint with
a coloured edge; time chart, the tooltip beside the crosshair and a soft area
under the lines while one or two sources are on; action columns, on a phone the
buttons go under the text, side by side, in equal columns over the full width;
the state word and the data table loading on a phone as shown. Moved into the
package [scope-143].

**Round one open (2026-10-04).** Formal only; eight sections in the review dialog, choices to tick in six of them. The time chart (9) joined the same round later that day: the round id stays `2026-10-04-r1`, so verdicts already given stand and only the new section is open.

The homelab admin dashboard (branch `fix-371-1`, `admin/web/`) grew components
any app on this package needs. This demo shows the generic ones already written
in package style, so they can be approved before they move into
`css/components.css` and `js/`. No app names, data or knowledge came along: the
sample is the catalogue's usual world (pump houses, readings, incidents).

| File                               | What                                                                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `demo.html`, `demo.css`, `demo.js` | the review page: each component at full width and in a 360 px frame, the option buttons, the sample data moving                                                                      |
| `ports.css`                        | the proposal, one `@layer kp.components { … }` block as it would land; both options of each choice are in it, marked Option A / B, and the one not picked is deleted before the move |
| `ports.js`                         | the behaviour, pure exports in the style of `js/components.js`: one `attachX(root)` per behaviour returning a detach                                                                 |

## The components

### 1. Buttons in shared columns

From `js/actcols.js` (whole file) and `css/app.css:4003-4029` (`.nx-acts`).
A list's row buttons share columns: one role, one left edge, one width on every
row; a row without that role leaves its column empty.

The dashboard measures every button in JS and writes pixel widths. The port
lets the browser do it where it can: a list is a CSS grid, each row a subgrid,
the button box a subgrid of the row, so each column is as wide as its widest
button with no measuring and nothing to redo on a font or theme change. By
position from the end (`:nth-last-child`) it needs no script at all, up to four
buttons. Only named roles and tables need `attachActionColumns()`; a table
cannot be a subgrid, so there the widths are measured as the dashboard does.

- CSS: `.kp-action-list` (a `ul`/`ol`), `.kp-row-actions` (the button box in a
  row or table cell), knobs `--kp-action-gap`; written by the script:
  `--kp-action-count`, `--kp-action-col`, `--kp-action-widths`,
  `--kp-action-stack`. Container `kp-action-list`, 30rem.
- Attributes: `data-kp-action="<role>"` on a button;
  `data-kp-action-phone="stack"` on the list (choice B).
- JS: `attachActionColumns(root)`, `fitActionColumns(list)`, `rowRoles()`,
  `mergeRoles()`, `ROW_ACTIONS`, `ACTION_LIST`.
- Choice: on a phone, buttons side by side under the text (A) or stacked beside
  it at one width (B, the dashboard's).

### 2. Tiles of one height

From `css/app.css:3499-3508` (`grid-auto-rows: 1fr`), `:3815-3818` (a card's
foot pinned) and `:193-230` (`.stat-grid`). The port lays the package's own
`.kp-card` out; it adds no card of its own.

- CSS: `.kp-tiles` on a list or div of `.kp-card`s; the footer
  (`.kp-card__footer`) keeps to the bottom; knobs `--kp-tile-min` (15rem),
  `--kp-tiles-gap`, `--kp-tile-title-size` (1.125rem).
- Choice: every row as tall as the tallest tile (A, the dashboard's) or each
  row its own (B, `.kp-tiles--per-row`).

### 3. Key figures (KPI strip and tile)

From `css/app.css:3499-3613`, `:4481-4489` (meter in the trend line),
`:4772-4806` (toggle, hint, bare tile) and `js/ui.js:333` (`kpi`), `:475`
(`kpiStrip`), `:973` (`sparkline`). The "avg 15 min" note beside the number is
3.71.1's and is drawn here from the request, not from the branch.

- CSS: `.kp-kpis` (strip, `grid-auto-rows: 1fr`, knob `--kp-kpi-min` 9rem),
  `.kp-kpi` (a `div`, an `a`, or a `button.kp-kpi--toggle`), parts
  `__label`, `__value` (with `<small>` unit), `__note`, `__trend`, `__delta`
  (`data-kp-direction="up|down"`, `data-kp-tone="good|bad"`), `__spark`
  (inline SVG), `__meter` (`role="meter"`, `--kp-value` 0-1), `__hint` with
  `[data-kp-when="off|on"]` children in the consumer's words. Tone on the
  tile: `data-kp-tone="warning|destructive"`.
- JS: `attachSparklines(root)` draws `svg[data-kp-spark="1 2 3…"]` and redraws
  on change; `drawSparkline(svg, values)`, `sparkPaths(values)`;
  `attachKpiToggles(root)` flips `aria-pressed` and fires `kp-kpi-toggle`
  (`detail.pressed`); `data-kp-kpi-owned` leaves a tile to a framework.
- Choices: pressed look, a doubled primary edge (A, the dashboard's) or a
  primary edge over a wash (B, `.kp-kpis--tint`); sparkline, line over a soft
  area (A) or the line alone (B, `.kp-kpi__spark--line`).

### 4. Page header

From `css/app.css:57-114` (`.title-row`, fix-235/244/245) and `:3341-3410`
(`.nx-head`, phone order).

- CSS: `.kp-page-header` > `.kp-page-header__inner` > (text block with
  `__title`, `__description`) + `__actions`. Container `kp-page-header`,
  40rem. The overflow menu is the package's `.kp-popover` + `.kp-menu`.
- Choices: the overflow button as ⋯ (`.kp-icon-button`, A) or "More ▾" (B);
  on a phone one wrapping row (A) or the primary first and full width (B,
  `.kp-page-header--primary-first`).

### 5. Attention band

From `css/app.css:3615-3676`, `:1246-1257` (the verdict line) and
`js/ui.js:506` (`attentionBand`).

- CSS: `.kp-attention` (a region; no items = no box), items are
  `.kp-alert.kp-alert--<tone>.kp-attention__item` with
  `data-kp-severity="critical|warning|info"`, parts `__icon`, `__text`,
  `__actions`. Container `kp-attention`, 34rem.
- JS: `attachAttention(root)` keeps the DOM worst first (so reading order
  matches), `sortAttention(band)`, `SEVERITIES`.
- Choice: soft tint with a coloured edge (A, the dashboard's,
  `.kp-attention--soft`) or the package's alert plates as they are (B).

### 6. A row that opens from anywhere in it: already covered

`js/rowtoggle.js` itself says kp-themes 8.1.1+ does this. It does:
`js/datatable.js:2957` opens a `data-kp-expandable` row on a click anywhere,
except on its own controls (`OWN_CONTROLS`, `:133`). It waits on main for the
next release (CLAUDE.md, d97f1fc6). No block.

### 7. A state word that keeps its width

From `css/app.css:1427-1444` (`.state-word`, its words in `data-size`).

- CSS: `.kp-state-word` with `data-kp-words` (one word per line, `&#10;` in
  markup); `.kp-state-word--center`.
- JS: `setStateWord(el, word)`.

### 8. A data table loading, on a phone

From `css/app.css:1616-1640`. Checked against the package first: the skeleton
rows (`js/datatable.js:1621`) and the busy overlay (`components.css:4317-4357`)
exist; what is missing is only the narrow shape. The port clips the layer and,
in a `kp-table` container under 30rem, lays the panel flat (spinner beside the
words, words clamped to three lines). Lands in the data table's block; no new
class, knob `--kp-busy-overlay-spinner-narrow`.

### 9. Time chart

From `js/timechart.js` (whole file: legend `:591-645`, tooltip `:647-726`,
pointer and keys `:728-819`, the group and its zoom chip `:186-245`),
`css/app.css:4059-4308` (the `tc-` classes) and `css/pages/metrics.css:367-382`
(pointer or touch hint). Left out: the Live view `declare()`/`drivable()`
hooks and the `percent/bytes/rate/celsius` units (a value is a number and a
unit string here). Added: the group's range buttons, the 24 h spark variant,
an `aria-live` readout, a JSON child as a data source, and 30 min / 3 h tick
steps so a zoomed span keeps more than one time label.

- CSS: `.kp-chart-group` (`[data-kp-chart-group]`, `data-kp-chart-span="24h"`)
  with `__bar` holding `.kp-chart-ranges` (buttons with
  `data-kp-chart-range="1h|24h|7d"`, `aria-pressed` written by the script) and
  `[data-kp-chart-zoom]` (the "Zoomed: 20:41–05:29 · Reset" chip, filled by
  the script). `.kp-chart` (`[data-kp-chart]`, a `figure` with an optional
  `.kp-chart__title`), parts drawn by the script: `__plot` (focusable,
  `role="application"`), `__tip`, `__readout` (`kp-sr-only`, `aria-live`),
  `__legend` with `__source` buttons and `__show-all`, `__hint` (pointer or
  touch words). Colours: `data-kp-series="1-5"` maps to `--chart-n` through
  `--kp-chart-series`, `data-kp-dash="1-3"` from the sixth source on; a
  series' own `colour` overrides. Event tones `data-kp-tone="critical|warning|info"`.
  Container `kp-chart`, 30rem. Spark: `.kp-chart--spark`
  (`data-kp-chart="spark"`), parts `__spark-head`, `__spark-label`,
  `__spark-value`, `__spark` (the SVG, `__spark-line`, `__spark-area`).
- JS: `attachCharts(root, { strings?, locale? })` returns a detach;
  `setChartData(el, data)` before or after attaching (or a
  `<script type="application/json" data-kp-chart-data>` child). `ChartData`:
  `{ label?, unit?, digits?, series: [{ label, points: [[ms, value]…] } |
{ label, start, step, values }, colour?, total? ], events?: [{ at, label,
tone?, href? }], from?, to?, yMax?, threshold?, stacked?, height? }`.
  Events: `kp-chart-select` on a chart (`detail.on`), `kp-chart-zoom` on the
  group (`{ from, to }` or null), `kp-chart-range` on the group
  (`{ range, span }`, fired before the redraw so the page can hand new data).
  Pure helpers: `dashOf`, `parseSpan`, `niceMax`, `indexAt`, `hourChange`,
  `toggleSource`, `pointsOf`; words in `CHART_STRINGS` (they join
  `js/strings.js` on the move). The spark variant draws through
  `drawSparkline(svg, values, { parts })`, the KPI tile's own function, which
  gained the `parts` option for that.
- Behaviour: legend hover or focus singles a source out; a click keeps one or
  several on (no modifier keys); Show all and Esc reset. One crosshair for the
  group; only the chart under the pointer shows its tooltip (values, time,
  ▲/▼ over the hour before, events within a thirtieth of the window); a click
  pins it (✕ releases). Drag zooms the group, double-click or Esc (anywhere
  outside a plot or dialog) resets. Keys on a plot: ←/→ (Shift: ten points),
  Home/End, Enter pins, Esc releases → shows all → resets the zoom. A marker
  snaps the crosshair on hover and pins on click, with its link.
- Choices: tooltip beside the crosshair (A, the dashboard's) or docked in a
  top corner (B, `.kp-chart--tip-docked`); a soft area under one or two
  sources (A, the dashboard's) or lines only (B, `.kp-chart--lines`).

## Notes, no block

- **"12 s ago" words (`js/ago.js`) versus `js/as-of.js`.** Nothing to merge:
  `as-of.js` attaches a late module to the page as it stood, it has no notion
  of time. The port would be a new `js/freshness.js`: `data-kp-ago="<ISO or
ms>"`, an optional verb (`data-kp-ago-verb`), `data-kp-stale-after="180"`
  setting `data-kp-stale`, one timer per page, words through the dictionary
  (`Intl.RelativeTimeFormat` in the page's locale). Its own round.
- **A folded group that remembers.** Covered: `.kp-accordion` on `<details>`
  with `data-kp-remember` keeps `open` across pages (`js/remember.js`,
  USER_GUIDE "What a page remembers"). The dashboard's extra, filling the body
  only on first open (`js/ui.js:663-680`), is app code.

## Later

The calendar heatmap
(`js/backupcalendar.js`), the help tour (`js/helptour.js`) and the topology
graph (`js/topology.js`).
