# Dashboard components to port, round two

**Round one open (2026-10-04).** Formal only. Seven sections in one review dialog, with thirteen choices to tick (two options each, `"once": true`). Round id `2026-10-04-r1`.

The homelab admin dashboard (branch `fix-371-1`, `admin/web/`) still keeps seven
pieces to itself after the first port round (`research/dashboard-ports/`, moved
into the package at scope-143). The hand-off spec names them B, C, D, E and I.1 to
I.3. This demo shows each one written in package style already, so it can be
approved before it moves into `css/components.css` and `js/`. No app names, data
or app knowledge came along. The sample comes from the catalogue's usual world: a
water company's pump houses, readings, incidents, and the nightly backups of
services with neutral names. "Now" in the sample is 04/10/2026 14:40, and every
date and time is written `dd/mm/yyyy HH:mm` on the Brussels clock (rule 52).

| File                               | What                                                                                                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `demo.html`, `demo.css`, `demo.js` | the review page. Each component is shown at full width and in a 360 px frame, with the option buttons and the try-buttons (refill, loading, empty, error, live update, and so on)                                    |
| `ports2.css`                       | the proposal, as one `@layer kp.components { … }` block the way it would land. Both options of each choice are in it, marked Option A and Option B; the one not picked is deleted before the move                      |
| `ports2.js`                        | the behaviour, as pure exports: one `attachX(root, { decorate })` per component that returns a detach, JSDoc types, `data-kp-*` hooks, and words as plain English constants (`*_STRINGS`) until they join `js/strings.js` |

Shared by every component: `decorate(part, info)` is the spec's R-DRIVE hook.
It is called every time kp builds a control (`menu-button`, `menu-item`, `day`,
`month-prev`, `month-next`, `today`, `node`, `kind`, `show-all`, `tour-next`,
`tour-back`, `tour-skip`), with `info.key` taken from the host's `data-kp-key`.
The time helpers `formatMoment`, `formatClock`, `formatDay` and `dayKey` take a
`timeZone` that defaults to `Europe/Brussels`.

## The components

### 1. A menu of every other action (spec B)

Origin: `js/ui.js:1831-1963` (`moreMenu`), `:1658-1679` (`menuKey`),
`:1797-1810` (`menuSignature`), `css/app.css:4594-4721` (`.nx-menu`, `.nx-more`),
`:3252-3255` (the header lift), and `pages/stack.js:456-466, 516-519` (More ▾ and
the disabled reason).

- CSS: `.kp-menu-button` (the wrapper) > `button` + `.kp-menu.kp-menu--rich[role=menu]`,
  `.kp-menu__group[role=group]` named by `.kp-menu__heading`, entries
  `.kp-menu__item` with `.kp-menu__label` over `.kp-menu__hint`, and
  `--destructive`. Knobs: `--kp-menu-rich-min` (19rem), `--kp-menu-rich-max`,
  `--kp-menu-max-height`. In a `.kp-page-header` at 40rem or narrower, the open
  menu spans `.kp-page-header__actions`.
- JS: `attachMenuButtons(root, { decorate })`, `setMenu(wrapper, groups | 'loading')`
  (skipped when nothing changed, and deferred while open), `openMenu(wrapper, { focus: 'first' | 'last' })`,
  `closeMenu(wrapper, { focus })`, `menuSignature`, `MENU_STRINGS`. Events:
  `kp-menu-open`, `kp-menu-close`, and `kp-menu-select` (`{ item, value }`),
  which is cancelable and keeps the menu open when prevented. Attributes:
  `data-kp-menu-empty="hide|disable"` and `data-kp-menu-reason="add"` (option B).
- A disabled entry has `aria-disabled` and stays focusable (APG). This differs
  from the dashboard, which skips it. The reason is its accessible description,
  and it is muted text, not faded.
- Choices: the group headings are small muted capitals (A, the dashboard's) or
  plain words with a line between groups (B, `.kp-menu--plain-headings`). A
  disabled action shows its reason in place of its hint (A, the dashboard's), or
  keeps the hint with the reason under it (B).
- Verified (B7): 1 (↓ opens on the first entry, the disabled entry is focusable
  and described by its reason, Enter does nothing), 2 (End, the wrap, typeahead
  `r`), 3 (Esc refocuses the button and the page's document Escape listener heard
  nothing), 4 (Tab closes the menu and moves past the button), 5 (a refill while
  open waits until close), 6 (a click outside closes; a click picks, fires the
  event and closes), 7 (`role=group` named by the heading), 8 (at 390 px the menu's
  edges equal the actions' ±1 px, with no sideways scroll), 9 (`decorate` for the
  button and every entry, again after a rebuild). From B6: loading, empty, a
  single entry without a heading, and 24 entries that scroll with the focus kept
  in view. Not measured here: 10 (contrast in every theme), since this round is
  formal only.

### 2. A meter with a mark (spec C)

Origin: `js/ui.js:2071-2088` (`meter`), `:298-306` (`meterParts`), `:468-479`
(`ctxMeter`), and `css/app.css:4329-4355` (`.nx-meter`).

- CSS: `.kp-meter` anywhere, with `.kp-kpi__meter` as an alias of the same rules.
  `--kp-value` runs from 0 up, `--kp-mark` from 0 up, and
  `.kp-meter__mark[data-kp-over]` marks a mark past the end. `data-kp-over` on
  the meter marks a value past the end. Tone: `data-kp-tone="warning|destructive"`.
  Loading: `data-kp-loading` (a pulse, which stops under reduced motion). The
  context-line meter is `.kp-meter--inline` (3rem). Knobs: `--kp-meter-height`,
  `--kp-meter-fill`, `--kp-meter-mark-colour`, `--kp-meter-mark-overhang` (3px),
  `--kp-meter-halo`. The mark has a 1 px halo in the surface colour, so it
  separates from a dark fill.
- JS: `setMeter(el, { value, mark, tone, label, markLabel, loading })` writes the
  properties, the tone and `role=meter` with `aria-valuetext`. `meterText(value, mark, words)`
  states the real share, for example "62% full; 130% booked for tonight".
- Choices: the mark is a tick across the bar (A, the dashboard's) or a small
  triangle over the bar (B, `.kp-meter--notch`). Past the end, a small ▸ sits at
  the end (A), or the bar's end is hatched (B, `.kp-meter--hatch-over`).
- Verified (C7): 1 (in a 200 px meter the fill is 124 px, the mark's centre is at
  160 px and its top 3 px above), 2 (a mark at 1.3 gets `data-kp-over` and the
  words say 130%), 3 (inside a destructive tile the fill is `--destructive`;
  standalone `warning` is `--warning-foreground`), 4 (the inline meter is centred
  on the first text line, 0 px off). From C5: the height is the same with or
  without a mark. Not measured here: 5 (the mark's contrast in every theme).

### 3. Key figures that never leave one alone (spec D)

Origin: `js/ui.js:489-505` (`kpiStrip`), `css/app.css:3294-3316, 4740-4753, 4916-4957`,
and `pages/host.js:375`.

- CSS: `.kp-kpis[data-kp-kpis-columns="all 3 2 1"]`. The script writes
  `--kp-kpis-columns` and `data-kp-kpis-span-last`. Before the script runs, the
  package's auto-fit stays.
- JS: `attachKpiStrips(root)` (a ResizeObserver on the strip's own width, and a
  MutationObserver for tiles that come or go), `fitKpiStrip(strip)`, and the
  pure `kpiColumns(n, width, { allowed, minTilePx, gapPx }) → { columns, spanLast }`.
- Choice: a tile left alone on the last row spans the row (A), or keeps one
  tile's width centred on its row (B, `.kp-kpis--centre-last`).
- Verified (D7): every row of the table, worked out by `kpiColumns` on the page
  itself. In the browser, at 5/full, 4/600, 5/700, 7/700, 8/700, 5/358, 6/358,
  1/358 and 2/358: no lone tile except where the spec wants the span, and every
  row's tiles are equal in height (±0.5 px).

### 4. A key figure with its 24-hour trend (spec E)

Origin: `pages/host.js:163-266` (`trendTile`), `js/host.js:279-360` (`hostTile`),
and `css/pages/host.css:550-593` (`.hx-trend*`).

- Markup per E4: `.kp-kpi.kp-kpi--trend` with `.kp-kpi__label` (and
  `.kp-kpi__label-note`), a stretched `.kp-kpi__link` (with `.kp-kpi__link-word`,
  shown as ↗ alone in a tile of 12rem or less), and
  `figure.kp-kpi__chart[data-kp-chart="spark"][data-kp-spark-head="none"][data-kp-spark-axis="relative"][data-kp-spark-readout="float|axis"]`.
  The script builds `.kp-kpi__chart-plot` (focusable, `role=application`), the
  crosshair, `.kp-kpi__chart-chip`, the axis row and an `aria-live` readout.
- JS: `attachTrendCharts(root, { timeZone, now, format })`, `setTrendData(figure, { points: [[ms, v]…], step } | null)`,
  the pure `trendAxis(points, { now, step, timeZone })`, and `TREND_STRINGS`.
  This stands in for the options that `js/chart.js`'s spark variant gains on the
  move (the attribute names are the spec's). It draws with `drawSparkline` from
  `js/kpi.js`.
- One change from the spec: E4 says a chip too wide for the trend gives its words
  to the axis row. A full `04/10/2026 01:30 · 3.34 bar` is about 165 px, and the
  axis row of a narrow tile is about 135 px, so the spec's fallback cut the value
  off. The chip now first puts the value under the moment (about 113 px wide,
  inside the tile). It falls back to the axis row only when even that does not
  fit.
- Choices: `avg 15 min` goes in the label, in its capitals (A, as the approved
  dashboard demo shows), or beside the number (B, the package's `.kp-kpi__note`;
  this is the decision the spec carries). The reading is a chip over the line
  (A), or always in the axis row with the moment over the value (B; that row is
  then two lines tall in every tile).
- Verified (E7): 1 (`14:40 yesterday` … `now`), 2 (a trend from 05:00Z reads
  `07:00 today`), 3 (the pointer at the middle shows `04/10/2026 02:40 · …` at
  point 72, inside the tile), 4 (with the change above: the narrow tile's reading
  is complete and inside the tile, and the tile's height is unchanged), 5 (Tab
  gives the whole tile its ring, Tab again reaches the trend, End puts
  `04/10/2026 14:40` in the screen-reader readout, ← and Shift+← move 1 and 10,
  Esc hides), 6 (a click without a drag follows the link; a touch drag does not),
  7 (one point: the axis is no-break spaces, with no `tabindex`), 8 (the tiles of
  a row are equal in height in the filled, loading, no-trend and one-point
  states). Also: a stale last point reads `14:00`, not `now`, and a live update
  keeps the reading at its moment (R-LIVE).

### 5. A month of nightly backups (spec I.1)

Origin: `js/backupcalendar.js` (the view model, 328 lines),
`js/pages/backupcalendar.js` (652 lines; cells 176-205, header 341-348, keys
467-494, detail 375-416), and `css/app.css:2219-2527`.

- CSS: `.kp-calendar` (`__nav`, `__title`, `__state`, `__grid`, `__day` with
  `__num` and `__count`, `__pad`, `__legend`, `__swatch`) and
  `.kp-calendar-layout` (calendar | aside, one column under 45rem by container
  query). Tones are set by `data-kp-tone` on the day: `ok`, `warn` and `bad` as
  text on their own status plate, `muted`, `future`/`before` dashed, `none`, and
  `loading` (a pulse only without reduced motion). `data-kp-today` gives an inner
  ring and `td[aria-selected=true]` an outer one. Knobs: `--kp-calendar-gap`,
  `--kp-calendar-cell-height`, `--kp-calendar-cell-font`,
  `--kp-calendar-aside`.
- JS: `attachCalendars(root, { timeZone, locale, now, decorate })`,
  `setCalendarDays(el, { 'YYYY-MM-DD': { tone, count, label } })`,
  `setCalendarState(el, 'loading'|'ready'|'empty'|'error', words)`,
  `calendarSelect(el, iso)`, `calendarMonth(el, { year, month })`,
  `setCalendarLegend(el, entries)`, and the pure `monthCells`, `shiftDay` and
  `shiftMonth`. Events: `kp-calendar-pick` (`{ date, source }`) and
  `kp-calendar-month`. A `table[role=grid]` always has six week rows, and the 42
  cells are built once and updated in place.
- Choices: a night with no backup gets a ✕ before its count (A, the spec's
  addition, flagged for Kenny), or only the red plate (B). The neighbouring
  months' days are left blank (A, the dashboard's), or shown as quiet numbers
  (B, `.kp-calendar--adjacent`).
- Verified (I.1.7): 1 (October back to February: six rows every month, the
  same height), 2 (`aria-label` = `04/10/2026: 7 of 9 services backed up; missing: …`),
  3 (22:30Z on 04/10 is the 5th in Brussels; on DST days the wall clock in
  Brussels is used), 4 (End from 01/10 goes to 04/10, PageDown goes to 04/11 with
  the title November 2026, Shift+PageUp goes back a year), 5 (a click on the 7th
  fires the event, keeps the focus, keeps the same element, and leaves one tab
  stop), 6 (empty: no running animation after 2 s), 7 (one grid, six rows plus a
  header row, seven `th[scope=col]`), 8 (at 390 px the calendar and the detail
  stack, with no sideways scroll). From I.1.6: a live update keeps the focus and
  the selection, and the error state shows the sentence with a dot. Not measured
  here: 9 (contrast in all themes), and axe-core is not in this run.

### 6. A picture of the network (spec I.2)

Origin: the live graph is `js/pages/mapgraph.js` (304 lines; draw 125-262,
restyle, keys) and `js/mapview.js:56-131` (`hubOf`, `layout`, `bends`), with
`css/pages/map.css:79-190` and the kind legend in `pages/fleetview.js:614-655`.
`js/topology.js`'s renderer is dead code (spec I.2.1).

- CSS: `.kp-graph` > `__bar` (`__kinds` with `__kind` toggles, `__show-all`,
  which keeps its place while idle), `__box` (`__svg`, `__note`), and `__hint`
  (in the flow under the picture). In the svg: `__edge` with `data-kp-style`
  (`solid`, `dash`, `dot`, `long-dash`) and `--kp-graph-edge-colour`, and
  `__node` (`__ring`, `__core`, `__flag`, `__label`, `--external`, `--hub`).
  Node colour (option A) is `oklch(from var(--chart-1) l max(c, 0.12) var(--kp-graph-hue))`:
  each node gets its own hue at the theme's chart lightness, with no literal
  colour. Knobs: `--kp-graph-h`, `--kp-graph-label-size`, `--kp-graph-dim`.
- JS: `attachGraphs(root, { decorate })`, `setGraphData(el, { nodes, edges, kinds, hub })`,
  `setGraphState(el, 'loading'|'empty'|'error', words)`, `graphSelect`,
  `graphHideKind`, the pure `graphLayout(data, W, H)`, `graphBends`, `hubOf` and
  `ringOf`, and `GRAPH_STRINGS`. Event: `kp-graph-change`
  (`{ selected, hover, hiddenKinds }`).
- Labels point away from the hub. The longer of two touching labels loses a
  letter at a time, and an ellipsis marks the cut. The full name stays in the
  `<title>` and the accessible name. The labels are fitted again when a web font
  arrives. One deviation from "the layout is homelab's exactly": under 600 px
  the ellipse trades width for height, to keep room for the side labels.
- Choices: each node in its own colour (A, the dashboard's), or one colour for
  every node (B, `.kp-graph--plain-nodes`). The kinds of link are listed above the
  picture (A), or under it (B, `.kp-graph--legend-below`).
- Verified (I.2.7): 1 (hub at the centre, ring A→Z then the outside nodes, the
  first at the top, clockwise), 2 (bends 0 and ±26), 3 (hover: only its edges on,
  the rest dim, zero childList mutations), 4 (Tab lands on the hub, → goes to the
  first ring node, Enter picks it, Esc clears), 5 (fifteen long names: no two label
  boxes intersect, halo included, and none leaves the picture, both in the 360 px
  frame and at a 390 px viewport), 6 (a live update keeps the focus and the
  selection), 7 (the legend lists 4 kinds, the ones present, of 5 given). Also:
  one tab stop.
- To judge: at phone width most side labels end up shortened ("Pump h…"). They
  never overlap, but a narrower ring or labels on two lines would be a next round.

### 7. Help, and a short tour (spec I.3)

Origin: `js/helptour.js:181-290` (`startTour`), `:325-436` (`helpPanel`),
`:138-143` (`shouldTour`), and `css/pages/help.css`.

- CSS: `.kp-drawer` (`__head`, `__desc`, `__body` that scrolls, `__foot` that
  stays). It lays out any element; a `dialog.kp-drawer` is placed at the end edge,
  full height. `.kp-help` cards hold `.kp-help__list`, a `dl` with the terms and
  their meanings in two columns, which stack in a card under 22rem. The tour card
  is `.kp-tour` (`__title`, `__text`, `__foot`, `__count`, `__buttons`), and its
  target gets `[data-kp-tour-target]` (with `[data-kp-tour-spotlight]` for
  option B). Knobs: `--kp-drawer-width`, `--kp-help-term`, `--kp-tour-width`
  (on a phone, the width less 2 × 16 px).
- JS: `startTour(steps, { start, remember, spotlight, decorate, returnFocus, onEnd }) → { end, goto } | null`,
  `shouldStartTour({ search, remembered, automated })`, `tourMemoryKey(name)`,
  and `TOUR_STRINGS`. The memory is `localStorage` under `kp-tour:<name>`, inside
  a try; it moves to `js/remember.js` on the move. The card is a non-modal
  dialog. It goes inside an open modal dialog when its target is in one (this
  matters in the review dialog itself).
- Choices: the tour's target gets a ring (A, the dashboard's), or a ring with the
  rest of the page dimmed (B). The help lists show the word beside its meaning (A),
  or always the word over its meaning (B, `.kp-help__list--stacked`).
- Verified (I.3.7): 1 (six steps with one target absent: `1 of 5` … `5 of 5` with
  Done), 2 (Esc returns the focus to the button that started the tour, and the
  memory is set), 3 (the target is in view and the card 12 px from it, never
  covering it), 4 (after a 200 px scroll the card follows), 5 (at 390 px the card
  is 16 px from both edges), 6 (automated: no automatic start; `?tour` always
  starts it; remembered: no start), 7 (`decorate` received `tour-next`,
  `tour-back` and `tour-skip`; with no resolvable step there is no tour). Also:
  the drawer sits at the end edge at full height with the foot at the bottom, a
  tour started from Help returns the focus to the Help button, and a tour on the
  phone frame runs over its tab bar.

## How it was checked

Firefox (Playwright), at 1280 and 390 px, every section. Each option of every
choice was set through `review:choice`, and both were screenshotted at both
widths with the interactive state open (menu, readout, picked day, picked node,
tour card). There were no console errors and no sideways scroll. Inside the
review dialog: seven sections and 26 options, a tick switches the page, the tour
runs inside the modal, and Esc ends only the tour. The automated checks above
come to 78 out of 78. Out of this round: contrast in the other 21 themes, since
the round is formal only.
