# What the components page still has to show

The site's component pages (`site/components/*.html`, every component with its
code examples) are brought up to date in one pass, on Kenny's go, once every
open review is approved (Kenny, 2026-10-13: "nadat alles approved is, vraag je
aan mij of je onze pagina waar al onze componenten staan (met codevoorbeelden)
mag updaten met alles wat nieuws is en alle nieuwe opties").

Every session that adds or changes a component, an option, an attribute or a
token adds a line here in the same commit. The pass works down the list, gives
each line its example and its option row, and empties the list.

## Waiting

- findings-1019 (2026-10-19), site/components/flash.html: the `data-kp-width` row says "`keep` (default) or `grow`"; make it say that `grow` works set by hand (the button is as wide as what it says: its own words at rest and busy, the result's width while the result stands) and that a width set by hand stays after a refusal on the button. Also its example may show a `grow` button.
- findings-1019, site/components/lede.html: the sentence "(on a lede of its own: a folded lede takes no link)" is no longer true: `data-kp-lede-collapsible` with `data-kp-lede-link` folds, and Learn more stands at the end after the folded part.
- findings-1019, site/components/command.html and site/components/focus-steps.html: one sentence each: in a column too narrow for the head the Copy button goes under the terminal's name and the badge, and Back and Next stand one under the other when two do not fit side by side; neither breaks a word.
- state-plates-1019 (2026-10-19), site/components/state-plate.html (and each component's own page): `hostStatePlate(host, { kind, title, text, art, retryEvent })` in js/state-plate.js is how every data component draws an empty or failed area (heat grid, matrix, run timeline, week agenda, network graph, data table), with `art` (a node or a glyph) over the title and a normal-size Retry that fires `kp-heat-retry`, `kp-matrix-retry`, `kp-gantt-retry`, `kp-week-retry`, `kp-graph-retry` (the data table keeps `kp-datatable-retry`); `setHeat` / `setMatrix` take `message`, `text`, `art`; `setGraphState`, `setGanttState` and `setWeekState` take `{ text, art }` as a fourth argument; strings `stateRetry`, `stateFailedText`, `graphEmpty`, `graphFailed`; `--kp-stateplate-floor` (12rem) is the least height of a plate with no loaded height to hold.
- state-plates-1019, site/components/table.html: a failed table and a table with nothing to show cover their rows and the plate fills the height the table had (`[data-kp-state-covered]`, `--kp-datatable-held`), the page's own `data-kp-datatable-empty` and `data-kp-datatable-failed` slots become the same plate; say that the rows stay in the document.
- state-plates-1019, site/components/card.html (card states): `setCardState(card, 'empty' | 'error', { title, text, art })`, `art` is a node (an inline SVG) or a glyph; the empty note is the state plate with its title at heading size and Try again is a normal-size button (no longer `kp-button--sm`).
- state-plates-1019, site/components/uptime.html: strips that load together are a group with ONE busy card over the group: `data-kp-uptime-group` on the box that holds them (`="off"` opts out), or two or more strips that are direct children of one parent (marked `data-kp-uptime-group="auto"`).
- state-plates-1019, site/components/matrix.html and the heat page: the lines view's busy card is centred over the whole map (its least height), not over the waiting rows; `.kp-heat` joins js/footprint.js (`FOOTPRINT_HOSTS`), so a heat grid keeps its loaded height while a state shows.

(The pass of 2026-10-18, on Kenny's go "components-page: Nu bijwerken", brought every line that stood here onto its page: the new components rating,
quote, passkeys, thread, idmark, stackbar, bullets, kv, formrows, code, pipeline, quantity, checklist (with its claim part), timers, focus steps,
wheel, uptime, command, weekdays, runs, snooze, dated options, sentence, gallery, viewer, docpreview, slider, availability, qr, time, console,
unsaved, timer disc, countdown, range, compare, lede, flash button, split panes, ops layout, refresh, connection, transfer, question, notices,
toggles, version badge, ack, deplist, trace and entity grid; the options of the status list (calm vocabulary), calendar, heat grid and uptime (calm
tones), focus steps (answer mode), the combobox (the usual on top), chart annotations, page header, the tiles field, the status-row fix, card data
states, the action list lead, the secret field, dialog sections and the typed confirmation, data table external sort, run timeline point events, step
list journey, empty state drawings, three-way segmented chips and the segmented scroll edge, matrix lines view, multiline autosize, anchors, print
rules, calm mode, shortcuts, disabled reason, the rows group, intent, the written attribute and knobs, and the shared state fixes (footprints held in
loading, empty and failed).
The pass of 2026-10-16, on Kenny's go "components-page: Nu bijwerken", brought every line that stood here onto its page: the toast's `pause`,
`linger`, `close` and `sticky`; the step list, the week agenda, the run timeline (days, series, legend, busy card, the end-edge label), the segmented
control, the list toolbar, the key line, the action tile, the status rows, the facet list (with its pattern), the heat grid (with `data-kp-heat-latest`),
the matrix and the bar cell; the diff hunk header; the menu button's `--kp-menu-anchor-x`; the navigation bar's fold, keep, separator and bottom tab
bar; the live button; the hover card; the data table's click multi-sort, `data-kp-sort-value`, `data-kp-filter-value`, `data-kp-group-always` and the busy
card; and the sentence that the toasts and the back-to-top control rise by the tab bar. Examples that wait for data carry their page's own part as an
example `script`, run live and printed under the markup. Not on a page, because it is a catalogue block and not a components-page line: the tab bar's
own block in the review catalogue, still listed in `catalogue/coverage.json`. The pass of 2026-10-15 brought the date picker's `data-kp-date-format`,
the key-figure label wrap and the side navigation's `data-kp-sidenav-opener`; the pass of 2026-10-14 every line before them.)
