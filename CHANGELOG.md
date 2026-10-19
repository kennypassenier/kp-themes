# Changelog

## Unreleased

- **Fixed: a key figure's name is never broken inside a word beside its hint** [kpi-entity-1019; almanac 23]. A pressable tile's hint (`.kp-kpi__hint`) took its full width in a `auto` track and left the name 29.5 px in a 148 px tile, so "Delivered since start" broke into DEL / IVE / RED. The name's track is `minmax(min-content, 1fr)`, the hint's `minmax(min-content, auto)` and right-aligned: the hint's own words wrap and no word of either is cut.
- **Fixed: the note after a key figure's name never starts a line with a dot** [kpi-entity-1019; kyu 14]. In a trend tile `.kp-kpi__label-note` moved to the next line with its `::before` dot ("· SAMPLE DATA"). The label with a note is a wrapping flex row; the dot hangs in the gap before the note and the label clips only its start edge, so a note that starts a line shows no dot.
- **Changed: an entity card's actions are equal columns** [kpi-entity-1019; http-switchboard 33]. `.kp-entity__actions` used `minmax(min-content, 1fr)`, so the same action was another width on cards with different words. The tracks are `minmax(0, 1fr)`, a label wraps between words inside its button, the buttons of a row share its height, and `fitActions()` (js/entity-card.js) folds a button whose longest word spills out of its column into "More" for the whole grid.
- **Added: entity-card meter tones `success` and `neutral`, and an empty plate with no action or your own** [kpi-entity-1019; http-switchboard Round SW]. `meters[].tone` (and `setMeter`'s `tone`) takes `success` and `neutral` beside `warning` and `destructive`, which stops the automatic amber and red. `setEntityGridState(grid, 'empty', { action: 'none' | actionLabel, onAction })`, `setEntityGrid(grid, [], emptyOptions)` and `data-kp-entity-empty-action="none"` leave the plate's action out or word it and run your function in place of `kp-entity-new`.
- **Changed: a run timeline's lane names are never cut** [r3r5-1019; almanac 4, homelab 32, kyu 20]. A lane's name and second line ended in an ellipsis even at `--kp-gantt-label: 15rem`. The name column is now `fit-content(min(40%, 14rem))` (`--kp-gantt-label-max`), never narrower than `--kp-gantt-label`, so it is as wide as the longest name; a longer name wraps and the lane grows (`.kp-gantt__track` has `min-block-size` now, not a fixed height). The first line of a name stands on the middle of the lane's first row, level with the bars and marks of that row. Judged in `research/r3r5-1019`, section gantt-names.
- **Changed: a lane's own stretch stands on the foot of the lane's first row** [r3r5-1019; homelab 32]. The thin band (a lease, a wait) ran through the middle of the row, behind the mark and under the count plate ("+3") of a crowded mark at 390 px. It now sits at the row's foot under the marks and their plates; the knob `--kp-gantt-zone` defaults to 0.25rem (was 0.375rem) and formal's 2 px rule uses it (no own `inset-block-start`). Section gantt-zone.
- **Changed: a run timeline's frame shows whole lanes** [r3r5-1019; homelab 32]. The viewport was cut through the middle of the last visible lane when there were more lanes than fit under `--kp-gantt-height`, and the layers over the lanes (the rules, the line for now, the selection) ran on, unseen, past the frame and the legend under it. `js/gantt.js` now holds the height of the last lane that fits completely and measures it again when the width changes (lane names wrap differently), a scroll comes to rest on a lane's top (`scroll-snap-type: y proximity`), and `.kp-gantt__lines` and `.kp-gantt__plot` are as tall as the viewport under the axis (`--kp-g-view`, sticky). A timeline whose lanes all fit is unchanged. Section gantt-frame.
- **Fixed: a queued bar of a run timeline stands on the card's ground** [r3r5-1019; kyu 20]. Its hollow was `transparent`, so the time rules behind it showed through the bar and its words. Finished, failed and running bars already covered them. Section gantt-rules.
- **Changed: the uses map's grid view never cuts a name** [r3r5-1019; homelab 35]. The row-label column was one fixed width (`--kp-matrix-head`) and a name ended in an ellipsis ("VAULTWARD…"). The column is `fit-content(--kp-matrix-head-max)` (12rem, 8rem in a box under 36rem) with `--kp-matrix-head` as its least width, names wrap (`overflow-wrap: break-word`), and a column is never narrower than the longest word of its header (`minmax(min-content, 1fr)`, cells keep `--kp-matrix-cell-min`). Section uses-labels.
- **Added: a line of the uses map carries a tone and a label** [r3r5-1019; HTTPSwitchboard, Round SW]. `cell(row, column)` returns `{ tone, label }` (the object the grid view reads): `tone` `ok`, `warn`, `bad` or `muted` colours the line and gives it its own pattern (solid, dashed, dotted and heavier, thin), `label` stands on the line in a small plate in the gap between the columns with the tone's mark (✓ ! × –), never over a card; the plate wraps its words, moves along its line to keep clear of the others, and one with no free place shows while its line is lit. The node's spoken words and the phone list name the label ("Vaultwarden (writes here)"). `usesRelation` also returns `lines` (by `"<row>><column>"`). A map whose lines carry neither is unchanged. Section uses-line; the twelve registers keep the base look (a theme pass is open, see docs/COMPONENTS_PAGE_PENDING.md).
- **Changed: the review kit's measures** [r3r5-1019]. `measure-gaps.mjs` no longer counts a gantt's time rule (`.kp-gantt__rule`, a gridline under the bars) as a box a text can cross: it sees boxes, not stacking, so every bar label a rule lay under was reported; `check-kit.mjs` asks a second time when the first `focus()` into a lane's frame is dropped (the frame takes the window focus, `activeElement` stays on the body), which reported "never opened" for whichever lane came first.
- **Added: parallel tracks in cook mode** [focus-tracks-1019; Kenny, AuDHD recipes: "de pasta koken terwijl we met de saus bezig zijn"; audhd gaps 7, 26, 31, 33]. A `FocusStep` may carry `track`, `id`, `title`, `waitFor` (alias `after`; step ids or whole track names) and `timer.id`. With two tracks or more, `.kp-focus-steps[data-kp-focus-tracked]` shows the active track's step large and every track as a lane (a package button with name, live clock, step title, words, place and the theme's bar) beside the step, or as short rows above it on a root under 44rem. The lanes are tabs (`role=tablist` / `tab`, `aria-selected`, one tab stop, ArrowUp, ArrowDown, Home and End between them) and the step area is their tabpanel. A tap on a lane or T / Shift T switches track, Back and Next move the active track only, a step that waits shows what for and how long and offers the track that can go on, a track whose timer ended or that can go on asks for you on a js/attention.js band, and a finished track says so on a state plate. Events `kp-focus-steps-track` and `kp-focus-steps-track-attention`; `kp-focus-steps-change` also carries `track`. Options `data-kp-tracks`, `data-kp-lanes`, `data-kp-lane-detail`, `data-kp-track-follow`, `data-kp-track-attention`, `data-kp-track-shared`, all live. Every step timer button now has `data-kp-timer-id` (the timer's own id, default the step's id) instead of `start:<name>`, and shows its clock while it runs. New `focusTrack*`, `focusLane*`, `focusTimer*` words in js/strings.js.
- **Changed: cook mode's empty and failed states are state plates, and `data-kp-wake` is live** [focus-tracks-1019; audhd gaps 27 and 28]. Read mode drew `kp-focus-steps__message` lines; it now uses the one plate of js/state-plate.js (`data-kp-focus-retry` fires `kp-focus-steps-retry`), and a change of `data-kp-wake` asks for the screen again or lets it go (`watchOptions` replaces the mutation observer).
- **Changed: a calendar in any tone puts an empty or failed month on the state plate** [r1r2-1019; Kenny, 2026-10-16 "de hele grootte van de component gebruiken"; almanac 1]. Only `data-kp-tones="calm"` had the plate and `kp-calendar-retry`; a calendar in its normal colours showed one small grey line and its days as grey plates, and a failed month had no Retry. `syncStatePlate()` in js/calendar.js now covers the six weeks with `hostStatePlate()` in every tone: the heading is `setCalendarState`'s `words` (else `heatEmpty` / `heatFailed`), a failure has a Retry that fires `kp-calendar-retry`, the grid is dimmed and inert under it, and the state line keeps its row (transparent, still read out) so the page does not jump. The plate stands on the nav's and legend's left and right edges, from the weekday row to the last week (6 px of the grid's own spacing, not the old 1 and 1.5 rem), the calm plate too. The calm words, the loading pulse and a loaded month are unchanged.
- **Changed: an empty or failed pipeline is one state plate over the whole board, a lane can be failing, names wrap** [r1r2-1019; almanac 5]. A failed board was a thin strip above lanes that went on showing counts of 0, and an empty one a sentence above them. `js/pipeline.js` now draws `hostStatePlate()` over the frame and the closed lane (kept in the document, `inert`, hidden), its heading "Could not read the board." with `setPipelineState`'s `words` as the reason and Try again (`kp-pipeline-retry`, now from the shared plate), or the page's empty sentence; `[data-kp-pipeline]` joins `FOOTPRINT_HOSTS` (and the footprint entry of js/auto.js) so the plate has the height the board had; an empty board reports `data-kp-state="empty"`. A lane with `danger: true` takes `--destructive` as its tone and carries a flag (`.kp-pipeline__flag`, the destructive status plate with `pipelineDanger`, "Needs attention"). Lane names wrap (`overflow-wrap: break-word`) instead of an ellipsis, and the lanes of a board share their rows through a subgrid, so name plates, share lines and first cards line up across the lanes (a board without a share line has two rows; under 40rem the lanes are rows again as before). The twelve registers' `.kp-pipeline__state` rules went with the strip.
- **Fixed: a data table follows rows the page adds or removes, and keeps the reader's page** [b3b4-1019; homelab 34, kyu 28]. A removed row stayed in the count ("14 rows, of 27") and in the pager until the page called `refresh()`, and `refresh()` sent the reader back to page 1. A client-side table now watches its body: rows that come and go are re-read at once, the page is kept (`refresh({ keepPage: true })`, also available to a page), and a row marked `data-kp-row-hidden` is held out (not counted, paged, searched or shown, and never un-hidden by a redraw) until the attribute is taken off. Detach no longer puts back a row the page removed.
- **Fixed: a date filter's pill writes the date the way the page does** [b3b4-1019; homelab 33]. The pill and the backwards-range refusal printed the stored `2026-10-05`; they now use the table's locale (`boundText`, `filterPills(…, locale)`, `filterPillLabel(…, locale)`, `readFilterBounds(…, locale)`). `view().pageNumber` is the number the pager prints; `page()` counts from 0 like `view().page`, now documented, and stops at the last page.
- **Fixed: `data-kp-expand-single` is read when it changes** [b3b4-1019; almanac 8]. It was read once at attach; it joins the options that wire the table again with its view. That the toggle is the first column, and counts in every column number of the handle, is documented.
- **Fixed: a disabled button with a reason keeps its column of actions** [b3b4-1019; kyu 16, almanac 13]. `attachDisabledReasons` wraps the button in a span that lost `data-kp-action`, so an off Delete was another column from its neighbours' and the column split. The wrapper now wears the role (and follows it), and in a `.kp-row-actions` the wrapper fills the column and the button fills the wrapper.
- **Changed: every empty and failed data area is the one state plate** [state-plates-1019; Kenny, 2026-10-16 "de hele grootte van de component gebruiken", 2026-10-17 "prominent, proportioneel groot, centraal"; kyu 11, homelab 28]. `js/state-plate.js` gains `hostStatePlate()` and an `art` option; the heat grid and matrix (`setHeat`, `setMatrix`: `message`, `text`, `art`), the run timeline (`setGanttState`), the week agenda (`setWeekState`) and the network graph (`setGraphState`) draw their empty and failed states as the package's plate over the whole footprint, at heading size, with a normal-size Retry that fires `kp-heat-retry`, `kp-matrix-retry`, `kp-gantt-retry`, `kp-week-retry` or `kp-graph-retry`. They were a small grey or red sentence over the plot with no plate and no Retry. `.kp-heat` joins js/footprint.js so the grid keeps its loaded height.
- **Changed: the network graph loads under the busy card** [state-plates-1019; kyu 1]. Loading is the theme's busy card centred over the whole picture (the ghost network stays under it, the words are read out only), empty and failed are the state plate; the loaded picture is untouched (gates/check-busy-card.mjs: js/graph.js moves from OWN to CARD).
- **Changed: a failed data table, and a table with nothing to show, take the table's place** [state-plates-1019; kyu 6 and 10, audhd 5]. `fail()` and `state('failed')` showed a small red strip above rows that stayed drawn, and the empty slot sat under the still-drawn table. The rows are now covered (`[data-kp-state-covered]`, kept in the document) and the failed or empty slot is a state plate at the height the table had with its rows (`--kp-datatable-held`), the reason at heading size and Try again a normal button. A slot the page wrote gets the same classes.
- **Changed: a card's empty and failed notes are state plates, with an optional `art`** [state-plates-1019; http-switchboard 17, audhd 12 and 19]. `setCardState(card, 'empty' | 'error', { art })` puts a picture (a node or a glyph) over the title; the title is at heading size, the notes carry `.kp-stateplate` classes and Try again is a normal `.kp-button` instead of `kp-button--sm`.
- **Fixed: strips that load together draw one busy card over the group** [state-plates-1019; http-switchboard 10]. Each `.kp-uptime` laid its own card, so a stack of three loading strips drew three. Strips in one `[data-kp-uptime-group]` box (or two or more direct children of one parent) share ONE card over the strips that load at that moment; it leaves with the last one.
- **Fixed: the matrix's lines view loads with the busy card over the whole map** [state-plates-1019; http-switchboard 4]. The card was centred over the few skeleton rows (`.kp-uses`), shorter than the loaded map; it now covers the matrix box with its least height.
- **Fixed: Refresh now, the R key and Retry now work while the automatic refresh is paused** [live-options-1019; kyu 8, http-switchboard 8]. `fire()` of js/auto-refresh.js returned at once when no interval was set, so a refresh the person asked for did nothing on a paused control. The timer still only runs while an interval is set; a refresh asked for by the person (`now`, `retry`, the R key) always runs, and no longer waits for an open dialog or a field being typed in. A refresh that fails while paused says `Last refresh failed.` (new string `refreshFailedPaused`) instead of promising a retry that will not come; Retry now stays.
- **Changed: options that were read once at attach follow their attribute at runtime** [live-options-1019; Kenny, 2026-10-17: a variant that could be a setting is an option with a default, switchable at runtime]. New `js/live-options.js` (`watchOptions(element, attributes, onChange)`, also from the root export): one observer per component that calls the module with the names whose value really changed. Through it: the auto-refresh `data-kp-look` (segments or menu, redrawn with the interval, countdown and updated line kept; also `data-kp-refresh-choices`, `data-kp-stale-after`, `data-kp-announce`, `data-kp-refresh` and `data-kp-refresh-key`) [kyu 9, http-switchboard 9]; the new pill's `data-kp-pill-placement` [http-switchboard 11]; the data table's `data-kp-sort-multi` and `data-kp-filter-mode` (the table is wired again and keeps its sort, search, filters, page, hidden columns, density, folds, open rows and selection, and the handle a page holds stays valid) [kyu 9]; the lede's `data-kp-lede-collapsible` and `data-kp-lede-link` [kyu 9, audhd-recepten 10]; the secret field's `data-kp-secret-ttl`, `-reveal-on`, `-mask` and `-mask-char` [kyu 9]; the palette's `data-kp-match` (the old matcher gives the commands back, the new one draws them again for what is typed, a loading or failed state is kept) [kyu 2]; the segmented control's `data-kp-segmented` (`single`, `multi`, `tri`: roles and states rewritten, values that were on stay on) [kyu 18]. Defaults are unchanged.
- **Fixed: a QR code's `data-kp-qr-retry` is observed** [live-options-1019; audhd-recepten 13]. It was the one option missing from the list the code watches, so adding it to a code that could not be made showed no Retry until `setQr` ran again.
- **Fixed: the palette's start-of-name match ignores the markup's indentation** [live-options-1019; found while showing `data-kp-match="prefix"` live]. The text a matcher got began with the whitespace of pretty-printed markup, so `prefix` found nothing in an indented list.
- **Added: `.kp-formgrid`, one grid for forms, settings, key-value panels and button groups** [align-grid-1019; Kenny, 2026-10-19 06:43, after seven settings sections of the homelab and chassis-rs demos were rejected for misalignment: "Gebruik het grid en align deftig verticaal!"]. Four named column tracks, `label | control | value | actions`, shared by every row as a subgrid; `.kp-formrows`, `.kp-kv`, `fieldset`, `form` and `.kp-formgrid__group` inside it become subgrids too, so a key-value panel, a form and a row of buttons line up without hand work. The label track is the longest label; every control starts on one edge, a field fills the track and a short control (stepper, time, number, date) takes one step, `--kp-formgrid-short` (14rem); every cell stands on the row's first baseline; `.kp-formgrid__row--buttons` puts a button group on the fields' edge and the row's own action in the actions column, on one line. Under 36rem of its own width every row reads top to bottom. Options (attributes, live): `data-kp-formgrid-label` (fit, wide), `-align` (baseline, center), `-stack` (auto, always, never), `-lines` (none, lines); `data-kp-formgrid-span` on a cell. docs/USER_GUIDE.md calls it THE way to lay these out. Review page: research/align-grid-1019 (formal).
- **Changed: a form row lines its cells up on the first baseline, and its controls take one width per kind** [align-grid-1019]. `.kp-formrow` was `align-items: start` with a padding guess on the label (half the control height less half a line): a 44 px stepper stood 4 px and a switch 6 px off its label, and fields, steppers and the time field ended on four different edges (measured in the homelab settings demo). Now the row is `align-items: first baseline`, a switch reads its baseline from its words, the aside aligns on the baseline, a field fills the control track up to `--kp-formrow-input-max` (28rem) and a stepper, time, number or date field takes `--kp-formgrid-short` (14rem); a stepper is never squeezed under its unit. `.kp-formrow--top` no longer changes anything.
- **Changed: every tool row has one height** [align-grid-1019; HTTPSwitchboard gap 23]. The code block's Wrap and Copy (`.kp-code__tools`) were 36 px high while the JSON field's tools and a command's Copy were 28 px; all three now take the small button's box, `--kp-tools-height` (the small button's height).
- **Changed: the refresh bar is a grid** [align-grid-1019; HTTPSwitchboard gap 24, almanac the same]. `.kp-refresh__bar` was a flex row, so "Refresh now" could not stand on a page's grid track; it is now three tracks (chooser, freshness, Refresh now), and inside a `.kp-formgrid` the refresh becomes a subgrid: the chooser in the control column, the freshness in the value column, Refresh now in the actions column.
- **Added: `data-kp-subgrid` on `.kp-attention` and `.kp-problems`** [align-grid-1019; HTTPSwitchboard gap 25]. Both are inline-size containers, and a layout-contained grid cannot be a subgrid, so a band and its neighbours could not share rows. With the attribute they are no container; their narrow fold then follows the form grid around them (36rem).
- **Added: `research/_review/measure-align.mjs`, run by `measure-gaps.mjs`** [align-grid-1019]. Fails a demo section, naming the elements and the px, when sibling rows' cells or controls start or end on different edges, when a row's cell is off its label's first line (centre or baseline, 1 px), when buttons side by side are off one line, when two buttons of one label in one column differ in size, when a button group under rows is off their column edges, when a field stops short of its cell or of the blocks above and below it (chassis-rs: a 448 px cap 47 px short of a card's edge), and when columns side by side do not start on one line.
- **Added: a live log viewer** [gap-log-viewer; homelab's host log explorer and Stack logs tab, found missing by the admin dashboard; docs/FEATURES.md TH42 keeps virtual lists out]. `.kp-logviewer[data-kp-logviewer]` and the new js/logviewer.js (`attachLogViewers`, `setLogViewer`, `appendLogLines`, `logViewerLines`, `logViewerText`, `clearLogViewer`, `searchLogViewer`, `stepLogMatch`; also through js/auto.js and the root export): the existing `.kp-log` rows inside a frame with a bar and a foot. A ring buffer with a cap (`data-kp-log-max`, 2000) drops the oldest lines first and says the exact number dropped; a line is kept once per `id`, so overlapping polls are fine. Find with every match marked, an exact count, Enter and Shift+Enter (or the two arrow buttons) to walk them, `/` to jump to the box, and `data-kp-log-search-only` to hide the lines without a match; a wrap toggle (off keeps one line each and scrolls sideways under a sticky time column); a time column of time, date and time, or off, that closes up without a gap; the level as a word, a plate on the word and a faint tint behind the whole line, with a lowest-level filter; Copy (width held, "Copied") and Download of the lines shown; the loading (the busy card), empty, no-match (with Clear search and level) and failed (with Retry) states fill the whole log area, so nothing around it moves. Following the tail, Pause and Resume and the exact "N new lines" pill are js/newpill.js, not written again; the source colours are js/log.js. Every option is live as an attribute. No virtual windowing: every kept line is a real row. Words `logviewer…` in js/strings.js.
- **Added: a count on a tab of the underline row** [gap-tab-count; the admin dashboard's `sh-count` on a stack page]. `setTabCount(tab, count, { tone, unit, zero, showUnit })` and `attachTabCounts(root)` (js/tabbar.js; also through js/auto.js) draw a `.kp-badge.kp-tab__count` after the label of a `.kp-tab`, from `data-kp-tab-count`, `-tone` (neutral, info, success, warning, error: the badge's own plates), `-unit` ("error,errors": heard by a screen reader as "Logs, 12 errors", drawn with `-show-unit`), `-state` (`loading`: a skeleton as wide as the last number; `error`: a dash and "could not be counted") and `-zero` (`show`). The number is exact (1534 is 1534), `null` and 0 draw nothing, the room of the digits is held so no tab moves, and an attribute change redraws. `setTabbarBadge` on a `.kp-tab` calls the same function. New strings `tabCountCounting` and `tabCountFailed`. Review demo (formal): research/gap-tab-count.
- **Added: arrow keys over a board of tiles** [gap-tab-count; the admin dashboard's Apps board]. `data-kp-tiles-keys` on a grid, a board or any element above grids (js/tiles.js `attachTileKeys`, also `nextTile` and `tileStop`; through js/auto.js) makes all the tiles under it one tab stop with a roving `tabindex`. Left and Right walk the row and go on to the next row, Up and Down take the nearest row and, in it, the nearest column (a short last row sends Down to its last tile), Home, End, PageUp and PageDown. Hidden tiles, shut folds and tiles with nothing to focus are skipped; Up from the first row fires `kp-tiles-exit` and focuses the element named by `data-kp-tiles-keys-exit`; every move fires `kp-tiles-move`; `data-kp-tiles-keys="off"` gives the tab order back.
- **Added: `setHeatLegend`, and the calm legend a heat grid promised** [gap-tab-count]. `setHeatLegend(el, entries, { keys })` (js/heat.js) writes the `ul.kp-heat__legend` under a heat grid: a swatch and its words per entry, a value ramp (`{ ramp: true }`, "Less" to "More") and, at the end, the line of keys (`keys: true` or pairs); the grid names it in `aria-describedby`; no entries hides it. `setHeat` takes `legend` (entries, or `false`) and `legendKeys`. A grid with `data-kp-tones="calm"` now draws Logged, Nothing logged and Paused by itself (site/components/heat.html said so; js/heat.js did not), `data-kp-legend="hide"` leaves it out, and flipping either attribute redraws. New strings `heatLegendLess`, `heatLegendMore`, `heatLegendLabel`, `heatKeysMove`, `heatKeysPick`, `heatKeysDrop`, `heatKeysPage`; `calmLegendEntries()` in js/calm-tones.js.
- **Added: a diff of several files** [gap-diff-view-1019; the homelab admin dashboard's gap 3, editui.js `diffBlocks`; Kenny: components used to the full]. `.kp-diffview[data-kp-diffview]` and the new js/diff.js (`attachDiffs`, `setDiff`, and the pure `diffWords` and `foldContext`; also through js/auto.js and the root export), generating the markup `.kp-diff` and `.kp-diff__hunk` already dress: a header per file (a chevron, a status word on a badge, the path with the folder quiet, `old → new` for a rename, exact `+N` and `-M` counts and five blocks for their share in columns as wide as the longest of the page, Copy path), a bar with the file count and Expand all / Collapse all, unchanged lines folded into one row "12 unchanged lines" that is a button (opens in place, says "Hide 12 unchanged lines", keeps focus), the changed words marked inside a replaced line (`.kp-diff__word`: bold plus underline when added, bold plus strike when removed, so it survives without colour; skipped past 60% changed or 500 characters), a per-file line limit with "Show the other N lines", and loading (file headers at final size under the busy card), empty and failed (state plates with Try again, `kp-diff-retry`) states at the height the diff had (js/footprint.js). Options `data-kp-diff-open|context|words|bar|copy|max-lines|label|state`, all live; events `kp-diff-toggle`, `kp-diff-expand`, `kp-diff-copy`, `kp-diff-retry`; knobs `--kp-diffview-min|status|gap`; strings `diff…`. Formal only until Kenny approves it (research/gap-diff-view).
- **Added: `kp-feed`, the activity feed** [gap-activity-feed-1019; found missing by the homelab admin dashboard, which drew this row twice]. `js/feed.js` (`data-kp-feed`, `setFeed`, `feedOf`, `attachFeeds`; also through js/auto.js and the root export) draws who did what, and when, day by day, from parts the package already has: a row is a state mark (the status row's shapes and glyph tokens: ok, failed, warn, running, info), a title with its muted detail line, the identity chip of the actor and the time, which is the ticking `kp-ago` for the first 24 hours and the dd/mm/yyyy HH:mm moment after; the timeline's rule joins the marks of a day; a heading per day (the thread's divider) says Today, Yesterday or the weekday, the date and that day's exact count with "N failed" or "all ok". The list is one grid (subgrids), so chips and times stand in one column each across every day. Rows open (`more`: a log excerpt), link (`href`), and keep their open state and focus by key across a refresh. Options, each an attribute switchable at run time with a default: `data-kp-feed-group` (day), `-summary` (on), `-unit`, `-time` (auto; relative, clock, moment), `-actor` (chip; mark, off), `-expand` (many; one, off), `-rail` (on), `-head` (on), `-max` (a height that scrolls, with sticky day headings) and `-level`. States: loading (skeleton rows under the theme's busy card, the loaded height held by js/footprint.js, which gained `[data-kp-feed]`), empty and failed (the state plate, Retry), stale (the rows kept, "Not refreshed: ... Rows from 14:02." and Read it again) and "Load earlier" (more, loading, error, end) with its room always reserved. Events `kp-feed-retry`, `kp-feed-earlier` and `kp-feed-open`. Judged in formal first (research/gap-activity-feed); no register answers it yet (gates/register-pending.json).
- **Added: `data-kp-ago-bare` on a freshness line** [gap-activity-feed-1019]. A line with it has no verb ("12 s ago" instead of "updated 12 s ago"), for a time that stands in a column of its own; with no moment yet it still reads "not updated yet". Lines without it are unchanged.
- **Added: `feed*` words in `js/strings.js`** [gap-activity-feed-1019]. Twenty-eight entries (the day words, the count, the state words, the stale line, the plates, Load earlier and the announcements), English by default and replaceable like the rest.
- **Added: the entity card has a trend line and an app tile** [gap-entity-tiles-1019; research/gap-entity-tiles; draft, not yet judged]. The admin dashboard still drew both by hand. Two options of the existing card, nothing else changed for a card that uses neither:
  `trend: number[]` (with `trendLabel` and `trendText`) adds one row to the meters block, a 24-hour line drawn with `drawSparkline` from js/kpi.js and the current value, on the meters' columns; `data-kp-entity-trend` is `auto` (default: every card of the grid has the row once one card has a trend, so the cards stay level), `on` or `off`, and a card with fewer than two readings keeps the row and says "no line yet".
  `data-kp-entity-kind="tile"` makes the card an app or link tile (data `href`, `external`, `description`, `lines`, `starred`): the name is the real anchor stretched over the whole card, with the mark, the state as the package's health dot and word, a description that wraps whole and the lines at the foot of every tile alike, and no actions row.
  The favourite star (`data-kp-entity-star`, on by default on a tile and off on a stack card) is a real toggle button (js/toggle.js) above the link, so pressing it, or the key `s` (`data-kp-entity-star-key`) while the card has the focus, never follows the link; it fires the new `kp-entity-star` `{ key, starred }` (`ENTITY_STAR_EVENT`), and a refill with `starred` puts it back.
  A tile in `loading` is bones in the same rows, `empty` says "not measured", `error` says "reading failed" with a Retry of normal size. New strings `entityStar`, `entityOpensNew`, `entityTrend`, `entityTrendNone`, `entityTrendName`, `entityTileFailed`; knobs `--kp-entity-spark`, `--kp-entity-tile-body`. Demoed in formal only.
- **Fixed: a loading network graph draws the theme's decided picture** [graph-loading-1019; found by the kyu thread, Kenny 2026-10-19 02:38]. The loading pictures decided in research/character-graph (2026-10-06) never reached the package: every theme pulsed the whole ghost network. Now each of the twelve registers draws its own (formal's courier's round, the packet race, hazard tape, ...) through the new knobs `--kp-graph-ghost`, `--kp-graph-ghost-anim`, `--kp-graph-edge-anim`, `--kp-graph-node-anim` (with `-stagger` and `-delay`); the ghost's links carry `pathLength` 100 and the loading sentence stands at the foot. A theme without a decided picture keeps the generic pulse. Empty and error are untouched.
- **Fixed: the count of a tab bar stands beside its icon, not over it** [rule-fixes-1019; found by the chassis-rs thread]. `.kp-tabbar__badge` sat over the icon's end corner, so its number touched the drawing; it now starts 0.25rem past the icon's end edge, still out of the flow.
- **Fixed: a palette's key chord keeps its line** [rule-fixes-1019; found by the chassis-rs thread]. `.kp-palette__keys` could wrap (`Ctrl Shift` over `P`); it is now `nowrap` and `flex: none`, and the command's name gives way.
- **Fixed: the text of a dialog section keeps air from the section's edge** [rule-fixes-1019; found by the chassis-rs thread]. `.kp-dialog__section` text began exactly at the section's rule (0 px). The section's box is now `--kp-dialog-section-inset` (0.5rem) wider than the text column on each side and pads the text back (the body takes the same room, so its scroll edge does not cut the rule); the danger sections of brutalism, synthwave and deco, which had no inline padding, get the same.
- **Fixed: a long line of a code block stops short of the plate's edge** [rule-fixes-1019; found by the HTTPSwitchboard thread]. The whole `.kp-code__body` scrolled, so a long line was cut at the plate's edge; now the `code` inside it scrolls (and takes the focus, `tabindex` moved there in js/code.js), inside the body's padding.
- **Fixed: a run of JSON punctuation is one element** [rule-fixes-1019; found by the kyu thread]. `},` and `],` were two `.kp-code__punct` spans at 0 px from each other; `jsonLine` now matches a whole run.
- **Fixed: formal's empty card draws no stray marks** [rule-fixes-1019; found by the HTTPSwitchboard thread]. The empty state inside a card (`.kp-card__empty`) drew the plate's double rule along its top and three ruled lines at its foot; formal now draws neither there (the standalone `.kp-empty` keeps them).
- **Fixed: the new-lines pill is as wide as its words** [rule-fixes-1019; found by the HTTPSwitchboard thread]. The count reserved room for two digits, leaving an empty gap before a one-digit count; the reservation and `--kp-newpill-digits` are gone, and a digit more grows the pill round its centre.
- **Fixed: a heat grid's row name wraps instead of ending in an ellipsis** [rule-fixes-1019; found by the kyu thread]. `.kp-heat__label-text` was `nowrap` with `text-overflow: ellipsis`; it now wraps and the row grows.
- **Fixed: the wheel never cuts a name with an ellipsis** [rule-fixes-1019; found by the AuDHD recipes thread]. A label takes the largest type its slice allows, goes onto two lines when that reads larger, then uses the item's new `short` field, and when no form fits it is not drawn on the disc (the segment's tooltip and the result say it whole).

- **Changed: a feed row's actor chip and time stand on the title's baseline** [align-pkg-1019; Kenny, 2026-10-19, "everything on a grid, never loose left alignment"; measure-align.mjs found it on an approved demo]. The chip and the time were each centred in a line of their own (13 px text) beside a title in the body size, so both sat 2 px above the title's line (gap-round-1, 68 lines). `.kp-feed__text`, `.kp-feed__actor` and `.kp-feed__when` take `align-self: first baseline`, the chip's baseline is its name's, and a chip that is only its mark stands in a cell one title line high.
- **Changed: a lead list's buttons stand on the row's first line** [align-pkg-1019; Kenny, 2026-10-19, "everything on a grid, never loose left alignment"; measure-align.mjs found it on an approved demo]. `.kp-action-list--lead` centred the buttons on the whole row, so beside a two-line row they hung 21 px under the badge. The badge, the title's first line and the buttons share one band as high as a control (`--kp-action-list-band`); a one-line row keeps its height.
- **Changed: the alerts of one `.kp-problems` share their columns** [align-pkg-1019; Kenny, 2026-10-19, "everything on a grid, never loose left alignment"; measure-align.mjs found it on an approved demo]. Each alert was its own flex row, so the width of its fix decided where its text ended (56 px apart). From 34rem the list is a grid of icon, text, fix and close and each alert is a subgrid of it; the narrow fold and a list without fixes are unchanged.
- **Changed: the share bar's legend is a table, and a label is never cut** [align-pkg-1019; Kenny, 2026-10-19, "everything on a grid, never loose left alignment"; measure-align.mjs found it on an approved demo]; OPEN.md R4. The value cell was as wide as its own words, so the label edge was up to 36 px apart on a phone. The legend has one value column (`--kp-stackbar-value-n`, written by js/stackbar.js: the longest value in characters), and a label wraps instead of ending in an ellipsis, with the swatch and the value on its first line.
- **Changed: shortcut-sheet descriptions and week pill labels fill their cells** [align-pkg-1019; Kenny, 2026-10-19, "everything on a grid, never loose left alignment"; measure-align.mjs found it on an approved demo]. `.kp-shortcuts__row dd` and `.kp-week__label` were as wide as their words and ended on a different edge in every row (up to 107 px and 15 px); both now fill the rest of the row.
- **Changed: `measure-align.mjs` reads a stack of centred buttons as aligned** [align-pkg-1019]. Buttons that all share one centre line (the action list under 30rem, centred on Kenny's 2026-10-05 rule) were reported for starting on different edges; the check now accepts buttons on one centre line and still holds fields and left-aligned columns to the start edge.

## 11.0.0 — 2026-10-18

Released on Kenny's go (2026-10-18 22:40, form release-11 "Uitbrengen na de componentenpagina"): a major release because four themes are removed (`terminal`, `phantom`, `light` and `grotesk`; twelve remain) and the `max` option of `setTabbarBadge` is gone. MIGRATION.md has the section "Coming from 10.x to 11.0.0". Everything else is added or fixed: the kpadopt4 to kpadopt6 component rounds, the shared state fixes measured in all twelve themes, and the components pages.

- **Fixed: a failed rating's plate fills the rating** [t56-statefix-1018; found by the pastel, forest and blueprint states round]. The plate was laid over the rating's body, which is only as wide as the stars, so a failed input row showed a small patch in a wide box; it is now laid over the rating's whole box (the input's full width), the stars and words still keeping their room under it.
- **Fixed: the Retry of a failed checklist is a normal button in the middle** [t56-statefix-1018; found by the pastel, forest and blueprint states round]. The failed (and empty) box of `.kp-checklist` is a grid whose items stretched, so Retry was a strip across the box; the box now centres its items and Retry is 2.25rem high, at the control size (with the state plate's action size). The box keeps its dashed or solid frame and its minimum rows.
- **Fixed: a waiting gallery tile keeps its square** [t56-statefix-1018; found by the pastel, forest and blueprint states round]. A register sets `.kp-skeleton` to a line of 1 to 1.5 rem and beats the gallery's `block-size: auto`, so the loading tiles were 16 to 24 px high (formal drew 24 px of 146); the rule is restated in the last layer and the tiles are as tall as the loaded ones.
- **Fixed: the action of a state plate is a normal button** [t56-statefix-1018; found by the pastel, forest and blueprint states round]. `.kp-stateplate__action` inherited the plate's heading size, so Retry and Add were 23.7 px text in every theme; it is now `--kp-text-md` (1rem). A register's own button size still wins.
- **Added: `data-kp-ops-failed` on the operations page, `plate` by default** [t56-statefix-1018, S12; Kenny, 2026-10-17: a variant that could be a setting is an option with a default, switchable at runtime]. A `.kp-ops` that carries `data-kp-state="error"` shows the failure whole: the alert takes the page's body, centred at heading size, at the height the page had (the page joined js/footprint.js), the cards of the last read hidden. `data-kp-ops-failed="keep"` is the earlier behaviour: the cards stay under one attention band. An attribute change switches it, no script.
- **Changed: a failed chart is a plate with a Retry** [t56-statefix-1018, S12; Kenny, 2026-10-17: empty and failed states are prominent and at heading size]. `{ error }` in a chart's data was a red dot and a 13 px sentence, nothing painted, no action. It is now a tinted, bordered plate over the plot's height, the sentence at `--kp-stateplate-text` and a normal Retry (2.25rem) under it that fires the new `kp-chart-retry` (`CHART_RETRY_EVENT`, bubbling from the chart; string `chartRetry`). The focus goes to the plot first, as a card's Try again hands it to its stage.
- **Changed: a card's failure is a state plate** [t56-statefix-1018, S11; Kenny, 2026-10-17 15:37: failed and empty states are prominent, centred and at heading size]. `.kp-card__failure` (js/card-state.js) was an alert row, words left and Try again right at body size, filling 27 to 76 percent of the stage. It is now centred in the stage and fills it, its title at `--kp-stateplate-text` (24 px at 1280 in every theme; solstice's 20 px and nostromo's and titanium's 13 to 16 px are restated), its sentence at body size and Try again a normal 2.25rem button. The rules sit in `@layer kp.layout`, the last package layer, because a register's title size beats `kp.components`; no register changed. The card grows while failed.
- **Changed: the gallery's busy card covers the whole gallery** [t56-statefix-1018, S10; DEMO_RULES ch. 4: a data area's busy card is centred over the whole component]. While loading, the grid is a strip of skeleton lines and the card sat at the top of it, its panel cut; `setGallery` now hands `openBusyCard()` the gallery itself, so the card is centred over the held footprint. The claim row, the availability grid and the operations page keep their cards over their rows and cells by design (a card over the toolbar or the names column would veil what stays readable).
- **Changed: a data component holds the height it had while a state shows** [t56-statefix-1018, S9; Kenny, 2026-10-16: "de hele grootte van de component gebruiken"]. The new js/footprint.js (`holdFootprint`, `attachFootprints`, `FOOTPRINT_HOSTS`, `FOOTPRINT_MAX`; also through js/auto.js and the root export) remembers the height of the matrix, the entity grid, the checklist, the notices, the gallery, the availability grid and the request inspector while they are ready, and holds it as `min-block-size` while `data-kp-state` is `loading`, `empty` or `error`, capped by `--kp-footprint-max` (default 48rem) and keeping a `min-block-size` of the consumer's own. A checklist with no items now writes `data-kp-state="empty"`, and a checklist that fails straight from ready shows the failed plate alone, with its buttons at rest, not the old rows with the error under them.
- **Fixed: a version badge stays inside its row** [t56-sharedfix-1018, S1; found by the eleven-theme review of kpadopt56]. `.kp-badge--version` is capped at its row (`max-inline-size: 100%`, border-box), and `.kp-version__from` and `.kp-version__to` may shrink and break anywhere, so a raw digest no longer pushes the chip past its row. A normal version still breaks only after a dot, hyphen, underscore or colon.
- **Fixed: a checklist detail never squeezes the label** [t56-sharedfix-1018, S2]. The row columns are `auto`, `minmax(0, 1fr)` and `fit-content(50%)` and the detail wraps (`overflow-wrap: anywhere`): a short detail stays on one line, a long one takes at most half the row and the label keeps its words.
- **Fixed: the refresh chooser and the request inspector bar fit a phone** [t56-sharedfix-1018, S3]. The grid track is `minmax(0, 1fr)` and the chooser and the filter may shrink (`min-inline-size: 0`, `max-inline-size: 100%`), so their segments scroll (`data-kp-segmented-overflow`) instead of sticking out of the card. A narrow request row wraps whole items and puts the path on its own line.
- **Fixed: the first and last time label of a chart stay inside the drawing** [t56-sharedfix-1018, S4]. After the drawing is in the document, the first and last axis label are anchored start and end at their tick when centred they would cross the edge (4 px kept). The plot width is unchanged.
- **Fixed: an availability row with answers gives the name the whole line** [t56-sharedfix-1018, S5]. A column row that carries answers is one column (`:has`), so the name is no longer left 0 to 76 px by the answer buttons.
- **Fixed: an entity card action that does not fit folds into More, for the whole grid** [t56-sharedfix-1018, S6]. After the draw the grid measures its rows and takes one button at a time into More (`data-kp-entity-fit` on the grid, like `data-kp-flags-fit` for flags) until no button runs past its card; a resize that changes the grid width starts again. A button never breaks a word.
- **Changed: a scrolling segmented track snaps to whole segments and fades only the side that has more** [t56-scrolledge-1018; the track of S3 cut a label at the clip edge]. A `.kp-segmented` that overflows (`data-kp-segmented-overflow`) uses `scroll-snap-type: x proximity` with `scroll-padding-inline` of the fade width, and masks the side with more segments out of sight; `js/segmented.js` writes the new `data-kp-segmented-more` (`start`, `end` or both; export `MORE_ATTRIBUTE`) on scroll and layout, and the side with nothing beyond it stays whole. Knob `--kp-seg-fade` (1.5rem). No animation, so reduced motion needs nothing; right-to-left tracks fade the mirrored sides.
- **Changed: the busy-card rule is for data areas** [t56-statefix-1018, S14; research/_review/DEMO_RULES.md ch. 4]. The package's busy card (42 to 84 px) would cover an 18 to 62 px inline control, so inline loadings stay as they are; the rule now names data areas. No package code changed.
- **Fixed: the master-detail demo no longer overwrites Failed** [t56-statefix-1018, S13]. The demo's state button selected an item after Empty, and the `kp-pane-select` listener started a load that ended in Ready over the state just set; the button now marks its pane while it sets the state and the listener skips it. Demo source only; the package already draws the failed detail plate in every theme.
- **Fixed: titanium's badge is a straight plate under its chamfer** [t56-titaniumbadge-1018; Kenny, 2026-10-18 04:03, titanium-badge: "Aanpassen in titanium"]. The shared 999px radius drew an arc inside the straight cut; `[data-theme='titanium'] .kp-badge` has `border-radius: 0`.
- **Changed: dark, cyberpunk and synthwave on the kpadopt56 parts** [themes-kpadopt56-1018; t56-b to t56-d]. Segmented track wraps on a phone and weekday chips close up; the version badge is cut (dark) and stays inside its row; a long checklist detail no longer breaks the label and the trace tag keeps its lead; the conversation bubble and its box, the gallery tile and the quote card (the same footprint loaded, loading, empty and failed) are the theme's own; what stuck out of a phone on the part pages fits. Synthwave adds the VCR warning symbol that no longer pushes the attention band and the question card apart, round identity marks that keep their letters 4 px off the neon ring, a code cell fold button with room on both sides, buttons on a solid coral plate as dark keys, and Back, Next and Done as whole words in cook mode on a phone.
- **Changed: pastel, forest and blueprint on the kpadopt56 parts** [themes-kpadopt56-1018; t56-b]. The version badge stays in its place; the refresh chooser and the request inspector fit a phone; a checklist label is never squeezed by its detail; a hidden-names list has no soft shadow. Empty and failed plates of every state are the theme's own, the card in a state fills its stage (failed centred at heading size, Retry a normal button), Empty and Loading keep the footprint of Ready, the quote card's Empty keeps the height of its quote, a loading gallery fills its footprint with tiles and the next-times Empty is 166 px again. Pastel: a problem alert is a soft tint of its tone, the rating's failed plate stays over the stars. Forest: the planting row stands clear of the busy card words. Blueprint: the question card is not swallowed by the measurement readout, the destructive button on a question card keeps a visible edge, and segments and weekday cells keep 4 px of margin on a phone.
- **Changed: solstice, brutalism and deco on the kpadopt56 parts** [themes-kpadopt56-1018; t56-b to t56-d]. The part pages' text gaps and overflow are right in the registers and new adoption parts keep 4 px of margin (brutalism as slabs, deco with the lobby inlay). Failed areas are the theme's own: solstice's red sky (not a salmon block), deco's ruby with the gold rule, a readable failed note in solstice and brutalism, and the passkeys and thread failure as the theme's alert rather than an empty plate. Empty plates fit their component (brutalism's quote card and runs list; deco's are centred as one block at heading size). Solstice: a full digest stays inside its badge and bubbles are lit from below. Brutalism: the label tab leaves the box tree until pointed at. Deco: Mark unread and Show all N lines are no longer cut by the button's clip.
- **Changed: nostromo and titanium on the kpadopt56 parts** [themes-kpadopt56-1018; t56-d]. Phone-width fit on the part pages (segmented track, weekday chips at 390 px, bars, code cell fold button, request inspector row, long versions, a checklist detail that wraps, the person's name on its own line in the availability list). Nostromo: tape corners, readable chart kinds, a fader for the slider, a growing text box that no longer glides for seven seconds, a folded quote that ends under its fourth line, empty and failed titles at heading size, the quote card's loading room kept in every state, a failed card's title in the klaxon plate's ink. Titanium: square corners on the new tags and counts, a machined slider, the rating in a table cell with words under the stars on a phone, a card state's title at heading size in the display face, Retry and Add at the control size, and a picked master-detail row that does not change the list's height.
- **Changed: the eleven themes drop their copies of the shared fixes** [t56-cleanup-1018]. Dark, cyberpunk, synthwave, pastel, forest, blueprint, solstice, brutalism, deco, nostromo and titanium lose the register rules that S1 to S6 and S9 to S14 made redundant, inert or conflicting (the digest break, the 26rem inspector grid, the 10rem detail cap); each theme's own looks stay. `dist/` and `docs/MINIFIED.md` regenerated.
- **Changed: the shared fixes are measured in all twelve themes** [t56-shared-1018, t56-sharedfix-1018, t56-statefix-1018]. The evidence page `research/kpadopt56-shared/evidence.html` (not a review demo) holds Now beside Proposed for the shared faults; after the fixes Now equals Proposed in 237 of 240 measured cells (three differ by 1 px: dark and nostromo claim row, deco ops page). The formal re-review demo `research/kpadopt56-formal/demo.html` shows the approved components the fixes changed, eleven sections in formal alone, with a section for the scrolling segmented control.
- **Fixed: two demo frames keep their content inside** [t56-demoframe-1018]. The shortcut sheet of shortcut-engine is held in a 28rem frame and scrolls inside itself, and the dated list's frame keeps 15.5rem of room around the field. Demo sources only.
- **Fixed: the gates count what ships** [gatefaults-1018, gatetests-twelve-1018]. The event extractor counts dispatches through an `emit()` helper and ternary types (all 254 events now count at least one dispatch); the knob extractor ignores wildcard fragments in comments (944 distinct knobs, 936 read through `var()`, AR21 re-pinned); the commit hook runs `check:rereview` and `check:raised-plate` like the package chain; three decided demos list their last round as received; docs/ARCHITECTURE_REFERENCE.md names the 84 adoption-round modules. The unit tests that still expected sixteen themes (gates, markdown, code-version, check-rereview) derive the count from `themes/order.json` or the registry, and the entry-point guard check accepts the `process.argv[1] === fileURLToPath(import.meta.url)` spelling.
- **Added: an interactive console** [kpadopt6-social; Kenny, 2026-10-17: "Alleen zolang het tabblad open is", focus key ":"; homelab's Shell page]. `.kp-console[data-kp-console]` and the new js/console.js (`attachConsoles`, `setConsoleRun`, `setConsoleContext`, `setConsoleComplete`, `setConsole`, `runConsoleCommand`, `clearConsole`, `consoleBlocks`; also through js/auto.js and the root export): a prompt (an optional select before it, Run, a hint line whose height is reserved) and a block per command with its states (sending, queued, running with a timer, ok, failed with its exit code, refused in what and what to do now, cancelled, lost with Check again), the output in the package's code block folded to 12 lines, Copy command, Copy output, Run again, Collapse, Cancel. The app supplies `run(command, context)` returning a job (`update(handler)`, optional `cancel()`); what a command may do stays with the app. Up and Down recall earlier lines, kept only while the tab is open (`data-kp-console-remember`, `session` by default), Esc clears the line, Ctrl+L clears the screen behind Undo, `:` jumps to the prompt, Tab asks `complete`, a line the app lists needs a second press. The body follows the newest block with a counted pill when you scrolled up, keeps its height in every state (empty plate, busy card, failed with Retry), folds blocks past 200 and output past 256 KB. `data-kp-console-mode="bar"` is the prompt alone with blocks handed out as `kp-console-block`. Words `console…` in js/strings.js.
- **Added: a field for a time of day** [kpadopt6-social; Kenny, 2026-10-17: "Ons eigen veld met een lijst van tijden"; homelab's Schedules "At" field]. `.kp-time[data-kp-time]` and the new js/timefield.js (`attachTimes`, `setTime`, `timeValue`, `timeValid`, `setTimePresets`, `parseTimeOfDay`, `stepTime`, `timeInWindow`, `timeMinutes`, `timeText`; also through js/auto.js and the root export): 24 hours only, typed forgivingly (0230, 2:30, 02.30, 2h30, 230, 7; 24:00 refused; a pasted 2:30 PM becomes 14:30 and says so), stepped with Up and Down (Shift or Page keys an hour, wrapping past midnight and saying so), or picked from the package's own list of times (a sheet at the foot of a phone, rows 44 px high) with preset chips, a Now entry, an explicit no time and a mark on entries near a busy moment. It posts `HH:MM` through a hidden input, sits in a form or inside `.kp-sentence__field` (`data-kp-time-look="inline"`, the underline form), shows its own skeleton at its final width while loading, says why when disabled, and keeps the list's presets states (loading, failed with Retry) in the list. Options `data-kp-value|name|label`, `-time-id|step|min|max|seconds|popup|presets|now|zone|look|clear|required|near`, `data-kp-remember`. Words `time…` in js/strings.js.
- **Added: a link as a QR code** [kpadopt6-social; kp-soft's invitations, chassis-rs pairing]. `.kp-qr[data-kp-qr]` and the new js/qr.js (`attachQr`, `setQr`, `qrMatrix`, `qrSvg`, `qrContrast`; also through js/auto.js and the root export) with Project Nayuki's MIT encoder vendored in js/vendor/qr-encode.js (the link is encoded on the page and never leaves it): an SVG (or canvas) on a plate that stays light in every theme with a 4 module quiet zone, the link as text under it that wraps at any character, Copy that keeps its width (js/flash.js) and Shift+C, optional PNG or SVG download, a code hidden behind Show QR code, an expiry that withdraws the code, a warning above 512 bytes, a link over 160 characters folded behind Show all N characters (Copy copies the whole). Every option of the five social components is live: change the attribute and it redraws. Options `data-kp-qr-value|ecc|size|quiet|look|modules|render|caption|copy|download|reveal|expires|label|max|narrow|retry`. Making the link shows the busy card in the square; empty, too long, expired and hidden stand in the same square. `_print.css` keeps the code and the link and drops the buttons. Words `qr…` in js/strings.js.
- **Added: who can come, an availability grid** [kpadopt6-social; Kenny, 2026-10-17: "Allebei, met een schakelaar per reis"; kp-soft's trip Datums tab]. `.kp-availability[data-kp-availability]` and the new js/availability.js (`attachAvailability`, `setAvailability`, `availabilityAnswers`, `setAvailabilityAnswer`, `availabilityBest`, `availabilityDays`, `availabilityRange`; also through js/auto.js and the root export), the heat grid made editable: people in the rows, days or proposed periods in the columns, each person answers can, maybe or cannot for their own row (cell glyph and tone, a press cycles, `y` `m` `n` and Backspace, a drag across the row paints a stroke behind one Undo), the summary row counts who can and its hover card names them, the best column is ringed and starred, `data-kp-availability-choose` offers Choose these dates. A trip is asked per period or per day and the organiser switches it (`sets` with `canSwitchUnit`, event `kp-availability-unit`). Saving shows the spinner in the pressed cell only; a refusal puts it back and marks it for 3000 ms. Options `data-kp-heat-edit`, `-availability-answers|press|paint|best|best-rule|window|quorum|sort|summary|choose|locked|narrow|keys|undo-ms`, `-availability-density`. Loading is heat's busy card with the names beside it; empty and failed are plates at the grid's height. Words `availability…` in js/strings.js.
- **Added: who brings it, a claim on every row of a checklist** [kpadopt6-social; Kenny, 2026-10-17: "Meerdere personen kunnen een item meenemen"; kp-soft's packing list "Ik breng mee"]. `data-kp-checklist-claim` on `.kp-checklist` and the new js/claim.js (`attachClaims`, `setClaimViewer`, `setClaimPeople`, `setClaim`, `setClaimFilter`, `claimFilter`, `claimPeople`; also through js/auto.js and the root export): an item has `claim: { by: [people], locked? }`; each row ends in a column of its own with the people (mark and name) or a loud gap (red edge, glyph, the words Nobody yet) and one button whose three faces share a width (I'll bring it, I'm bringing it, the spinner). A press fires the cancelable `kp-claim-change` and the page may `detail.settle(promise)`: the row waits on its spinner, a refusal (`{ refused, by, error }`) puts the row back, outlines it for 3000 ms and says who was faster; letting go offers Undo. Options `data-kp-claim-mode` (`claim`, `assign` with a person menu), `-gap`, `-gap-sort`, `-filter` (chips All, Nobody yet, Mine with exact counts), `-person`, `-count`, `-undo-ms`, `-self-label`, `-max`, `-keys` (`c`, `Shift C`), `-take-all`, `-copy`, `-disabled` with its reason; `data-kp-remember="claim-filter"`. js/checklist.js fires `kp-checklist-render` after every draw. Words `claim…` in js/strings.js.
- **Added: a picker with the usual on top** [kpadopt6-calm; Life's daily check-in]. The combobox gains `data-kp-usual` through the new js/usual-picker.js (`attachUsualPickers`, `usualPicker`, `setUsual`, `setUsualState`, `usualNotToday`, `nearNames`, `similarity`, `normaliseName`; also through js/auto.js and the root export) and a small `extend(hook)` on its handle: a band of the usual choices first (given by the app, never re-sorted per tap, from a list or `{ value, uses }`), pinned "Nothing to log" and "Not sure", the rest alphabetical, "Show all 38" over 12 items, tag mode with a one-tap "Not today", inline add with Undo, the near-match guard (identical selects, near offers "Did you mean ...?" and "Add as new"), loading, empty and failed panels, Alt U. A plain combobox is unchanged; every option is an attribute that redraws the picker. Strings `usual...`, formal first.
- **Added: answering one question per screen** [kpadopt6-calm; Kenny, 2026-10-17: "Allebei, twee knoppen"; Life's daily check-in]. `js/focus-steps.js` gains answer mode: a step with `answer` (`kind` `choice`, `multi` or `text`, `choices`, `previous`, `usual`) is a question with big answer buttons, "Same as yesterday: Matig" and "Same as usual: Good" (both buttons by default), Not today (a skip is an answer), automatic advance after 350 ms, a summary screen, progress as count, dots or nothing, resume with `data-kp-remember` (`data-kp-resume`, `data-kp-resume-until`), centred plates for empty, failed and save-failed (answers kept, `setFocusStepsState(el, 'save-error')`), keys ArrowUp, ArrowDown, `s`, `u`, `n`; `kp-focus-steps-before-answer|answer|resume|retry|save-retry`, Done carries the answers; every option is an attribute that redraws the view. Cook mode is unchanged. Strings `focus...`, formal first.
- **Added: calm tones, a day with nothing logged is quiet** [kpadopt6-calm; Kenny, 2026-10-17: the theme's accent for a logged day; Life's trackers, the plant dashboard]. `data-kp-tones="calm"` on the calendar, the heat grid and the uptime strip (the new js/calm-tones.js: `calmTone`, `calmWord`, `inPausedRange`, `isCalmTones`): `logged` (`--primary`, or `data-kp-logged-fill="success"`), `quiet` (no border, glyph or count, never "missed") and `paused` (hatched, `data-kp-paused-range`); foreign tones are mapped with one warning (`data-kp-calm-map`); `data-kp-quiet-words`, `data-kp-legend`; the calendar's plate over an empty or failed month (`kp-calendar-retry`) and `setCalendarCaption`; the uptime strip sums up as "21 of 28 days logged". Standard tones stay the default. Strings `calm...`, formal first.
- **Added: a calm vocabulary for the status list, the today card** [kpadopt6-calm; Kenny, 2026-10-17: paused stays a quiet row; Life's Today screen, the plant dashboard]. `data-kp-status-vocab="calm"` on `.kp-statuslist` (js/statusrow.js): `open`, `done` (the info pair), `paused` (dashed, "Paused since 03/10/2026" from `data-kp-since`, Resume with Undo that restores the original date) and `unknown` (a thing that reports ok with no data is never done); anything red is drawn as unknown with a console warning; `data-kp-today-since|resume|pause|order|paused|fold-after|mark`, `data-kp-resume-reason`, keys ArrowUp, ArrowDown and `r`; `kp-status-resume`, `kp-status-pause`, `kp-status-undo`, `settleToday`, `setTodayState` (the card's loading, empty and failed in calm words). The standard vocabulary is untouched. Strings `status...`, formal first.
- **Added: a quote card** [kpadopt6-calm; Kenny, 2026-10-17, survey item quote-card; the Life weekly summary]. `figure.kp-quote[data-kp-quote]`, `.kp-quote-list` and the new js/quote.js (`attachQuotes`, `setQuote`, `setQuoteState`, `quote`, `quoteWhen`; also through js/auto.js and the root export): your own words verbatim in a `.kp-card` with its four states, who and when (`date`, `relative` or `both`, the exact moment in the time's title), folded at four lines behind Show all, `data-kp-quote-why|source|lang|size|copy|hide|max`, Hide with Undo (`kp-quote-hide` after the window, `wait(promise)` for a save), keys `h` and Mod C, a list with an exact "Show all 7". Strings `quote...`, formal first.
- **Added: a star rating** [kpadopt6-calm; Kenny, 2026-10-17: five whole stars; the parked recipes app]. `.kp-rating[data-kp-rating]` and the new js/rating.js (`attachRatings`, `rating`, `setRating`, `setRatingState`, `ratingCell`, `snapRating`; also through js/auto.js and the root export): five whole stars as a radio group (one tab stop, arrows, Home and End, Backspace or Delete clears, the chosen star again clears), or the same row read only as one image ("Rated 4.5 of 5 by 12 people"); `data-kp-rating-max|step|mode|value|clear|labels|size|commit|preview|unrated-text|count|name|for`, `data-kp-readonly`, `data-kp-disabled-reason`; `kp-rating-change` (cancelable, `wait(promise)` for a save that can be refused, Undo toast, a refused save puts the old value back and says so); loading as dashed stars that breathe, a failed read as one plate of the same size with Retry; `ratingCell` for a data table cell that sorts by the number. Strings `rating...`, formal first.
- **Added: the entity card, one fixed card per stack** [kpadopt6-ops; homelab's Overview cards (`cardEl`, `sk-card*`)]. `.kp-card.kp-card--entity` in `.kp-entity-grid[data-kp-entity-grid]` and the new js/entity-card.js (`attachEntityCards`, `setEntityGrid`, `setEntity`, `setEntityGridState`; also through js/auto.js and the root export): the same five rows on every card, kept whether a row holds anything or not (identity with the mark made from the name, the name as the card's one stretched link, the id, the state in words; exact figures; flags; meters with the number beside the bar; actions in fixed columns), every card of the grid as high as the tallest. `data-kp-entity-meters` (0 to 3), `-flags-max` (an exact "+2" that opens the package's own menu button; a flag that does not fit goes there too), `-inline` (the rest of the actions in "More", all of them under 30rem), `-link`, `-mark`, `-min`, `data-kp-selectable` (a tick; the keys j, k, x of the row selection) and `data-kp-density="compact"`; every attribute draws the cards again, and a refill by key changes the words in place. A card's `loading`, `empty` ("not measured") and `error` (a failed state with Retry) keep its height; the grid's loading (skeleton cards under the busy card), empty ("No stacks yet" with its action) and failed (Retry) fill the grid. Words `entity…` in js/strings.js.
- **Added: the path of a connection** [kpadopt6-ops; homelab's firewall path box (`fw-path`); the host's full-path query is a later wave]. `.kp-trace[data-kp-trace]` with `.kp-steplist.kp-steplist--trace` and the new js/path-trace.js (`attachTraces`, `setTrace`, `trace`, `traceStates`, `traceSummary`, `traceText`; also through js/auto.js and the root export): hops side by side (a column under 30rem), each the step list's item with its check or cross and the verdict word, the hops after the first refusal dimmed as "not reached", a hop with no verdict "not measured", a summary line as a polite status ("Blocked at rule "IoT to media""), the deciding rule a keyboard-reachable chip (`kp-trace-rule`). `data-kp-trace-layout`, `-stop` (`first-refusal` or `all`), `-verdict` (`both`, `mark`, `word`), `-rule` (`chip`, `inline`, `off`), `-summary`, `-copy` (the trace as text), `-swap` (a button and the key S, `kp-trace-swap`), `data-kp-density`; every attribute redraws the trace. States running (the busy card over placeholder hops), empty ("Pick a source and a target") and failed (Retry, `kp-trace-retry`) keep the trace's height. Words `trace…` in js/strings.js.
- **Added: the dependency list** [kpadopt6-ops; Kenny, 2026-10-17: "Ja, met nummers"; homelab's "who notices this app" rows (`uf-dep`, `whoNotices`)]. `.kp-deplist[data-kp-deplist]` and the new js/deplist.js (`attachDeplists`, `setDeplist`, `deplist`, `orderDependencies`, `depText`; also through js/auto.js and the root export): rows "A → B", each one subgrid (number, identity mark and name, arrow, needed name, state) so every column stands in the same place in every row and state, numbered in the order things must go (a thing stands after what it needs), a cycle one red unnumbered row. `data-kp-dep-order` `numbers` (default) or `none`, `-direction`, `-group` (`by-to`, `by-from`), `-arrow`, `-states`, `-collapse` (8, an exact "Show all 23"), `-link`, `-self`, `-empty`, `-heading`, `-copy` (the flash button), `-rows`; every attribute redraws the list. States loading (the busy card over placeholder rows), empty (no action: nothing is wrong) and failed (Retry, `kp-deplist-retry`) keep the list's height; under 30rem each row stacks. Words `deplist…` in js/strings.js.
- **Added: the acknowledge gate, a tick before a button may be pressed** [kpadopt6-ops; homelab's major-version box (`uf-major__item`, `paintGo`)]. `.kp-alert.kp-ack[data-kp-ack]` and the new js/ack-gate.js (`attachAckGates`, `ackGate`; also through js/auto.js and the root export): a warning with the release-notes link (new tab, ticks nothing) and a tick with its sentence, the whole label one hit area; the control it guards (`data-kp-ack-for`) is `aria-disabled`, dimmed and says why ("Tick … first", "2 of 3 release notes still to read"), and a press on it moves the focus to the first open tick. `data-kp-ack-mode` `each` (default) or `all`, `data-kp-ack-reset` `on-change` (default: a changed key, label or version clears the tick) or `never`, `data-kp-ack-require-link`, `-min-ms`, `-focus`, `-tone`, `-key`, `-retry`, `data-kp-ack-locked`; states `data-kp-state` loading (two skeleton lines, the alert keeps its height), error ("No release notes link found", the tick stays, a Retry) and empty (hidden, the control on). `kp-ack-change` `{ key, checked, remaining, at }` and `kp-ack-retry`; one polite line per change. Words `ack…` in js/strings.js.
- **Added: the version jump chip** [kpadopt6-ops; Kenny, 2026-10-17: "Eerste getal, plus een lijstje apps waarvan ook het tweede getal groot telt"; homelab's `uf-ver` chips and `js/staleimages.js`]. `.kp-badge.kp-badge--version` and the new js/version-delta.js (`attachVersionDeltas`, `setVersionDelta`, `versionLevel`, `versionNumbers`, `summarizeDeltas`, `releaseUrl`, `githubRepo`, `VERSION_SORT`; also through js/auto.js and the root export): "10.11 → 12.1" with the old version struck and lighter, the new one strong (a link with `data-kp-version-href`, a `{to}` template allowed); a big jump is the first number differing, plus the second number for the apps in `data-kp-version-big-minor` (`data-kp-version-app`, `data-kp-version-big-at`), and says so in the warning tone, the word "major" and a "!" in a ring; a version that went back is destructive and "older"; same is "up to date"; a version without numbers or a digest is never big (a `sha256:` tag shows its first 12 characters, `data-kp-version-digest="full"` all). `data-kp-version-scheme` `numbers` (default), `semver`, `calver`, `none`; `-level`, `-tones`, `-show` (`both`, `to`, `level`), `-arrow`; states `data-kp-state` loading (a skeleton at the final width), error ("could not check") and empty ("not tracked"). The chip sets `data-kp-level` and `data-kp-sort-value` for a table to sort risky first, says "from 10.11 to 12.1, major update" to a screen reader, redraws when an attribute changes and copies on Shift+click (`kp-version-copy`). Words `version…` in js/strings.js.
- **Changed: every command palette matches by words in any order** [kpadopt6-ops; Kenny, 2026-10-17: "Woorden in elke volgorde (nieuw), ook voor bestaande paletten"; homelab's `admin/web/js/intent.js`]. The new js/intent.js (`matchIntent`, `intentScore`, `intentWords`, `intentTokens`, `intentRanges`, `queryWords`, `startsWord`, `rankCommands`, `noMatchText`, `INTENT_MAX_SHOWN`; also through the root export) is the palette's default matcher `intent` (`data-kp-match`; `substring`, `prefix` and `subsequence` stay one attribute away, and React's `CommandPalette` `match` defaults to it too): every typed word has to start a word of the command, in any order ("jellyfin upd" finds "Update jellyfin"; "read" still does not find "Report an incident"), letters match without their accents, a hyphenated word is also found by its parts, `data-kp-typo="1"` finds a word one letter off. The best answer comes first in its group, the matched words are marked (`.kp-palette__mark`, the words wrapped once in `.kp-palette__label`; `data-kp-highlight="off"`, `data-kp-mark-look="wash"`), a description or `data-kp-hint` and the hidden `data-kp-words` count as a weaker match, the open subject's commands (`data-kp-context`, `data-kp-context-of`) rank higher, a palette that marks commands `data-kp-featured` or `data-kp-recent="5"` shows only those before anything is typed (one with none still shows every command), at most `data-kp-max-shown` (40) rows show and the status line says "40 of 112 shown, type more words", `data-kp-group-order` orders the sections. A query nothing answers is the empty plate in the list's footprint (`.kp-palette__nomatch`; `data-kp-nomatch="status"` keeps the old line), naming what a known verb works on (`data-kp-verb`, `data-kp-subject-name`, `data-kp-nomatch-hint`). `palette(el).setState('loading' | 'error')`: the busy card over the list, or the failed plate with a normal-size Retry (`kp-palette-retry`) above the commands marked `data-kp-static`. Words `intentNoMatch`, `intentNoSubject`, `paletteNothing`, `paletteCapped`, `paletteLoading`, `paletteFailed`, `paletteFailedText`, `paletteRetry`. Formal rules a matched word under in navy. The catalogue's palette block says "by words" now.
- **Added: the toggle button, a button that stays pressed** [kpadopt6-ops; homelab's filter chips, segmented switches and pin buttons, JobTracker's `Toggle` and `Seg`; research/kpadopt6-ops]. `.kp-button[data-kp-toggle][aria-pressed]` and the new js/toggle.js (`attachToggles`, `toggle`, `toggleGroup`, `togglePressedKeys`, `toggleKey`; also through js/auto.js and the root export): one rule family for the pressed button (a face turned round, `mixed` a dashed edge on a half wash, formal keeps its double rule drawn), looks `data-kp-look` `button` (default), `chip` and `icon`, an exact `data-kp-count` (`loading` a skeleton, the room of the next digit held), `data-kp-pressed-hint` (a row that is always there), `data-kp-pressed-mark="check"` (its room kept), groups with `data-kp-toggle-group` and `data-kp-toggle-mode` `multi` (default), `single` (arrow keys walk, one tab stop) or `single-or-none`, an All member (`data-kp-toggle-all`), `data-kp-toggle-clear` ("Clear filters (N)", in place while idle), `data-kp-toggle-key` through the shortcut sheet (a bare digit is refused: AZERTY), `data-kp-remember`, `data-kp-disabled-reason`, and a cancelable `kp-toggle` whose `detail.wait(promise)` makes the button busy and, if refused, puts the state back and shows "Refused" for 3 s. One polite line per change (`data-kp-announce`). Words `toggle…` in js/strings.js. The group container is `.kp-toggles`.
- **Added: the basics, five parts and one helper** [kpadopt5; Kenny, 2026-10-17, answers to the option questions]. Calm mode (`html[data-kp-calm]`, `js/calm.js`; calm stops transitions and animations in every theme while a spinner or skeleton breathes as one slow pulse, scope `motion`, `effects` or `all`; the seven scripts that read `prefers-reduced-motion` now ask `motionAllowed`); the shortcut engine (`js/shortcuts.js`, one list for the keys and the help sheet, chords, scopes, a warning for AltGr keys); `.kp-lede` and `.kp-field__why` (`js/lede.js`); the problem alert (`.kp-alert__what|why|remedy|actions`, `.kp-problems`, `setProblems` with the layouts `each`, `list` and `fold`); the flash button (`js/flash.js`, busy, a short word, the sentence in a line under the button, one width); `data-kp-disabled-reason` (`js/reason.js`). Formal's register answers the problem alert and the flash button; the other themes follow Kenny's verdict. Demo: research/kpadopt5-basics.
- **Added: the rows group, formal first** [kpadopt5; research/kpadopt5-rows]. `js/row-select.js` (j / k, x, Shift+x, Esc, Shift-click ranges, optional arrows and Ctrl+A, a cursor ring `is-cursor`, long-press selection mode; on for every data table with a select column, `data-kp-select-keys="false"` off), `.kp-selection` with `js/selection-bar.js` (sticky-top, inline or floating-bottom; names with an exact "+N more"; the offer for all matching rows; busy, result with refused rows, actions off with a reason), `undoToast()` in `js/undo-toast.js` (ring, rule, text or no clock that stops while held; `defer` or `revert`; Mod+Z; leave `carry`; stack of 3), `.kp-newpill` with `js/newpill.js` (following, an exact count, a divider "New since"), `.kp-code--cell` in `js/code.js` (the payload cell: three lines, binary, truncated, dialog or inline), `textarea[data-kp-json]` with `js/json-field.js` (line and column of the error, gutter, Format and Minify, Tab that never traps) and `.kp-inspector` with `js/request-inspector.js` (requests with masked secrets, `toCurl`, the card's four states). 98 strings.

- **Added: avatar, ways to sign in, conversation, chart markers** [kpadopt5-people; Kenny, 2026-10-17, survey items 28 to 30 and 27]. `kp-idmark` takes a photo (`data-kp-idmark-src`, with `-status`, `-alt`, `-loading`, `-frame`; letters stay when it fails; `setIdmarkGroup` with a "+N" button that lists the names left out). New `.kp-passkeys` (js/passkeys.js): rows per way in with Rename and Remove, the only way in refused by default, typed-name confirmation for the one in use, the server's refusal on the row. New `.kp-thread` (js/thread.js): bubbles, day dividers, system lines, attachments, grouping, folding (only the newest whole by default, configurable), sending and failed messages, Jump to newest. `kp-chart` gains event kinds with a key, bands, edge counts, a median line, run rings and a "too few readings" state. Formal-only demo research/kpadopt5-people.
- **Removed: four themes, `terminal`, `phantom`, `light` and `grotesk`** [breaking; Kenny, 2026-10-16
  23:38 to 23:40: "we gaan het terminal thema bij deze ook verwijderen uit ons pakket", "En phantom ook", "en light ook",
  "en grotesk ook"]. Twelve themes remain: formal, dark, cyberpunk, synthwave, pastel, forest, blueprint, solstice,
  brutalism, deco, nostromo and titanium. Gone with them, as with retro: their token sources (`themes/<name>/`), their
  registers (`css/<name>-register.css` and the `./css/<name>-register` and `/min` exports), their blocks in
  `css/themes.css` and entries in `js/theme-registry.js` (and so in the `ThemeName` type), their texture and heading
  rules in `css/_rules.css`, their hooks, their `kp-sig-<theme>-*` TIMINGS rows and terminal's `kp-sweep`, `kp-tube-off`,
  `kp-caret`, `kp-caret-reverse` and `kp-tp-*` rows, terminal's BIOS lines in `arrivalLinesByTheme`, the font families
  only they used (Barlow and Barlow Condensed for phantom, Inter for grotesk; Share Tech Mono stays as cyberpunk's and
  synthwave's `KP Tech Mono`), their showcase, compare and concept pages, terminal's and phantom's intro blocks and every
  theme-menu entry in the catalogue and the site, their verdict, hash and pixel rows (770 block/theme pairs), their
  theme-specific tests and their research demos (`<name>-anchor`, `<name>-character`, grotesk-hover, their variant
  sheets in the character demos). The `shout` headline routine and the card arrival keep the TIMINGS rows they time
  themselves by (`kp-sig-phantom-fly`, `kp-bar-run`, `kp-load-out`). Synthwave is now the only theme with an arrival
  intro. A page that stores one of the four names falls back to `formal` like any unknown name. The review demos that
  opened in light open in formal. See MIGRATION.md.
- **Changed: the wheel's Spin button stays put, and a spin's length varies** [cook-1017; Kenny, 2026-10-17: "bij hover glitched de spin knop in het midden naar een andere locatie", "maak het spinnen zelf ook dynamisch ... binnen bepaalde minimum en maximum waardes"]. The hub is centred by its insets and auto margins, not by a `translate` that the button's own hover and press lift (every register's) replaced, so it no longer jumps half its size on hover or focus in any theme (pastel's and deco's own `translate` rules are gone or now only add the press). A spin draws its whole turns between `data-kp-wheel-turns-min` (3) and `data-kp-wheel-turns-max` (6) (`data-kp-wheel-turns` still fixes it) and its time follows the travel (`data-kp-wheel-duration` is the time of the mean travel, 60% to 140%); the outcome is still drawn by the weights first. `kp-wheel-spin` carries `turns`. A segment is as large as its weight, as before; the demo shows it with three weightings.
- **Changed: cook mode's needs box has room, its amounts line up, and empty and failed are large and centred** [cook-1017; Kenny, 2026-10-17: "text die tegen de rand plakt zonder marge", "de empty en de fail versies ... een veel prominentere plaats"]. `.kp-focus-steps__needs` has padding of its own on every side (`--kp-focus-steps-needs-pad`, 1rem; nostromo and titanium 0.75rem all round), the amounts start on one line (they were right-aligned), and an empty or failed step is the whole body, its sentence at the heading size (`--kp-focus-steps-state-text`) centred in the theme's own empty plate or alert.
- **Changed: kitchen timers' buttons never break a word, and the time is right-aligned** [cook-1017; Kenny, 2026-10-17: "Paus/e ... dat is lelijk", "tekst van de timers zelf rechts uitgelijnd"]. The card's three buttons are one line (`white-space: nowrap`); the first button's column is as wide as the widest of Pause, Resume and Stop in the button's own face (a hidden `.kp-timer__sizer`), so it keeps its width across states; the close button is a square of the target in every theme; synthwave's card buttons take the small button's padding so the three fit. The time is right-aligned (titanium's and nostromo's screens too). The cards' least width is 19.5rem (`--kp-timer-min`, was 16rem).
- **Added: Uncheck all, and a list that keeps its height** [cook-1017; Kenny, 2026-10-17: "als er check all is moet er ook uncheck all zijn", "een minimum aantal items ... minder plaats verspringt"]. The checklist's bar has Uncheck all (`.kp-checklist__none`, string `checklistUncheckAll`, dimmed when nothing is ticked, fires `kp-checklist-change` with `id: null, checked: false`); the body is never shorter than `--kp-checklist-min-rows` rows (10), so loading, ready, empty and failed stand in the same height, and empty and failed say their sentence at the heading size in the middle of it (`--kp-checklist-state-text`). `--kp-checklist-busy-height` is gone.
- **Changed: the compare slider loads as a table does** [kpadopt4 round 2; Kenny, 2026-10-16: "het laadstreepje is super dun ten opzichte van het laadveld. Doe iets in de aard van een table die laadt met centraal de laadanimatie"]. While an image loads, a quiet plate covers the box at its size and the data table's own loading card stands in its middle (js/busy-card.js, `.kp-compare__busy`, string `compareLoading`); the skeleton block is gone. New `setCompareBusy(el, busy)` holds the box in loading for a page that reads its panes itself. A failed image fills the visible part of its pane with the sentence and a normal-size Retry (string `compareRetry`) that asks for it again and fires `kp-compare-retry` (`COMPARE_RETRY_EVENT`, `{ pane }`). gates/check-busy-card.mjs moves js/compare.js to the components that lay the card.
- **Added: uptime cells that open something** [kpadopt4 round 2; Kenny, 2026-10-16: "zie dat de items zelf klikbaar zijn zodat ze bv iets kunnen openen, ofwel een pagina, ofwel mss een tooltip ofzo met wat snelle info"]. Opt-in, two ways. A period with `href` is a link to its page (Enter or Space follows it). `open: 'info'` on `setUptime` (or `data-kp-uptime-open="info"`) makes a press, Enter or Space open the period's quick info under its cell: the theme's popover plate (`.kp-uptime__info`, in the top layer, placed against the cell, opened and closed in the theme's motion) with the period, its state as a swatch and a word, its exact figures, the period's `details` lines and, with `href`, a link to its page; the arrows carry it along the strip, a second press, Escape (focus back to the cell) or a press outside closes it, the hover card rests meanwhile. `kp-uptime-open` (`UPTIME_OPEN_EVENT`, cancelable, `{ key, index, period, panel }`) fires before it opens; `kp-uptime-pick` as before. Strings `uptimeInfoFigures`, `uptimeOpen`; knob `--kp-uptime-info-width`. Without `href` and `open` a strip is unchanged.
- **Changed: the bullet rows' nothing-due and failed states take the list's full size** [kpadopt4 round 2; Kenny, 2026-10-16: the Retry button was "heel kort en veel te hoog"]. Both are the package's empty state (`.kp-empty`, each theme's own) over the list's whole footprint, the height its rows had (`--kp-bullets-state-min`, 7.5rem, for a list that never had rows), the words centred; failed has a normal-size Retry (`.kp-bullets__retry`, no longer stretched by the grid; `retry: false` leaves it out, `BULLETS_RETRY_EVENT`). A focused Retry that goes with its note leaves the focus on the list.
- **Changed: the share bar's loading, empty and failed states** [kpadopt4 round 2; Kenny, 2026-10-16]. Loading shows the meter's own loading picture in the bar (js/kpi.js `setMeter`; formal rules a navy line along it), the theme's approved loading for a bar, instead of a skeleton block. Not read and failed are one calm note (the empty state's dashed frame and title, the sentence and Retry side by side) over the bar's and the legend's whole footprint, the height they had (`--kp-stackbar-state-min`, 4rem, before any draw); failed adds a normal-size Retry (`retry: false` leaves it out) that fires `kp-stackbar-retry` (`STACKBAR_RETRY_EVENT`); a bar without a legend keeps its track and gives the sentence in its hover card. String `stackbarRetry`.
- **Added: a weekday picker** [kpadopt5-time; homelab's `.sch-daypick`, Life's repeat editor]. `.kp-weekdays[data-kp-weekdays]` and the new js/weekdays.js (`attachWeekdays`, `weekdays`, `weekdaysOf`, `setWeekdays`, `weekdaySummary`, `monthSummary`, `dayNames`, `dayNumber`, `joinWords`; also through js/auto.js and the root export): the package's chip group in `multi` mode with seven equal chips from the locale's week start, the quick picks Weekdays, Weekend and Every day, one line in words ("Mon and Thu", "Every weekday") and, below `data-kp-min`, the reason. Options `data-kp-days` (`week` or `month`), `-week-starts-on`, `-day-names` (`short`, `narrow`), `-min` (1), `-presets`, `-summary`, `-value`, `-disabled` with `-disabled-reason`; event `kp-weekdays-change`. A day's name is never cut on a phone. Words `weekdays…` in js/strings.js. Formal-only demo in research/kpadopt5-time.
- **Added: the next times of a schedule** [kpadopt5-time; homelab's `.sch-preview`, Life's to-do repeat editor]. `.kp-runs[data-kp-runs]` and the new js/runs.js (`attachRuns`, `setRuns`, `setRunsState`, `runs`, `runsRelative`, `runMoment`, `clockShift`, `zoneOffset`; also through js/auto.js and the root export): the page works out the times, the package lists them with the weekday in rule 52, how far away each is ("in 2 days") and an amber mark where the clock is turned before a run ("Clock goes back 1 h") or the page names a conflict. Options `data-kp-runs-count` (3), `-relative`, `-warn`, `-more` ("Show N more"), `-title`, `data-kp-time-zone`, `data-kp-now` (a fixed clock). The four states keep the height of the rows: empty is the page's reason centred in the package's empty plate, loading is the busy card over placeholder rows (js/busy-card.js), failed is the destructive alert with a normal Try again (`kp-runs-retry`). Words `runs…` in js/strings.js.
- **Added: a "remind me later" picker** [kpadopt5-time; Kenny, 2026-10-17: "Een mix"; homelab's `SNOOZE_CHOICES` and Notifications, Life's nudges, JobTracker's follow-ups, newsflash's Snooze]. `.kp-snooze[data-kp-snooze]` and the new js/snooze.js (`attachSnoozes`, `snoozeChoices`, `snooze`, `setSnoozedUntil`, `setSnoozeBusy`, `openSnoozePanel`, `dayAt`; also through js/auto.js and the root export): the package's rich menu button (or, with `data-kp-look="chips"`, a row of two-line chips) offering `1h 4h tonight tomorrow monday pick` (any length in m, h, d, w; `next-week`) each over the exact moment it resolves to; a choice that has passed or lies past `data-kp-snooze-max` (7d) is left out, "Pick a date and time…" opens a panel with the date picker and a time, the last custom moment is offered at the top (`data-kp-remember`), a line says "Snoozed until …" with End snooze, and a busy picker shows the spinner in its button. Options `data-kp-snooze-choices|morning|evening|max`, `data-kp-look`, `data-kp-time-zone`, `data-kp-snoozed-until`, `data-kp-now`; events `kp-snooze` and `kp-snooze-end`. Words `snooze…` in js/strings.js.
- **Added: a choice where every option has a date and an age** [kpadopt5-time; homelab's snapshot picker (`js/snapshotpicker.js`, the radio rows of `js/actiondialog.js`), JobTracker's version pickers]. `.kp-dated[data-kp-dated]` and the new js/dated-options.js (`attachDatedOptions`, `setDatedOptions`, `setDatedState`, `datedValue`, `datedOptions`, `datedAge`, `orderDated`; also through js/auto.js and the root export): each option is two lines, its name (or its date in rule 52) with a "Latest" badge on the newest and how long ago under it, with a size or a kind in one column at the end; up to `data-kp-picker-inline-max` (7) options radio rows of the package's fieldset (`data-kp-layout="dated"`), more a searchable combobox whose list shows the same two lines, the newest chosen first, newest-first order, type-ahead on the name, a disabled option that says why. Options `data-kp-picker`, `-picker-inline-max`, `-latest`, `-order`, `-meta-column`, `-preselect`, `-rows`, `-name`, `data-kp-time-zone`, `data-kp-now`; events `kp-dated-change` and `kp-dated-retry`. Empty, loading (the busy card over placeholder rows) and failed keep the height the picker had. Also `data-kp-label` on a combobox option: what a chosen option writes in the field (js/combobox.js), so an option drawn in two lines is chosen by its name alone. Words `dated…` in js/strings.js.
- **Added: a form that reads as a sentence** [kpadopt5-time; Kenny, 2026-10-17: "De zin loopt door, te brede velden op een eigen regel"; homelab's Schedules `.sch-sentence`, Life's repeat editor, almanac's rules, JobTracker's follow-up rule]. `.kp-sentence[data-kp-sentence]` and the new js/sentence.js (`attachSentences`, `sentenceSummary`, `setSentenceInvalid`, `setSentenceWhy`, `setSentenceFieldState`, `sentence`; also through js/auto.js and the root export): the package's own inputs (an input, a select, a combobox, the weekday picker) inside `.kp-sentence__field` stand between the words of one paragraph (1.125rem on a 2.4 line), drawn as an underline in the primary colour (`data-kp-look="boxed"` a small box, `data-kp-sentence-size="md"` smaller). The sentence wraps like text and a field wider than `data-kp-own-line-ratio` (0.7) of the line takes a line of its own (`data-kp-narrow` `wrap`, `stack` or `flow`; `data-kp-block` always); `data-kp-show-when="field=value"` shows a phrase only then and takes its controls out of reach; a status region says the whole sentence in words after a change; Enter in the last field submits; an invalid control is a destructive underline with a line that names the field; a waiting field shows the package's skeleton at the width it had; a disabled sentence says why. Words `sentence…` in js/strings.js.
- **Added: a map of what is used by what** [kpadopt6-media; Kenny, 2026-10-17 "Onmisbaar"; JobTracker's `ReuseMap`]. `data-kp-view="lines"` on `kp-matrix` and the new js/uses-map.js (`setMatrix` draws it; `usesRelation`, `usesPath`, `setUsesPin`, `rememberedView`; through the root export): the sources in one column, the things that use them in the other, a line for each use (`curve`, `elbow`, `straight`), a card lights its lines and dims the rest on hover or focus and pins on a press, exact counts, "Not used", faint dashed ghost sources, nodes with a document mark, a note and a link, one tab stop with arrow keys, and under 640 px a list of cards with their users as chips. Loading is the busy card over the map, empty and failed fill its footprint. Options `data-kp-lines-side|shape|light|count|empty-sources|collapse-below`, `data-kp-density`, `data-kp-remember`; events `kp-uses-pin`, `kp-uses-retry`. A matrix without the attribute is unchanged. Words `uses…`.
- **Added: a picture gallery with a lightbox, on a viewer shell** [kpadopt6-media; Kenny: "stoppen is default, doorgaan een optie"; kp-soft's photo gallery]. `.kp-gallery[data-kp-gallery]` with js/gallery.js (`setGallery`, `openGalleryItem`, `setGalleryUploading`, `galleryItems`, `galleryLast`, `openGalleryFromHash`) on the new js/viewer.js (`openViewer`: a modal `.kp-dialog.kp-viewer` with a head, a stage that is the busy card, a plate for a failed or unsupported file, and a foot that always keeps its way out). Tiles square or in their own ratio, captions on hover (always on touch), a clip with its play mark, an add tile that is off with its reason while uploading, a failed picture as a state tile with Retry. Lightbox: previous and next that stop at the end (`data-kp-lightbox-loop="on"` wraps), Left, Right, Home, End, `z`, `+`, `-`, `f`, zoom to full size, an exact announced position, controls that fade after 3 s, a swipe on a phone, the address carries the picture and the back button closes it first, actions per picture with the package's confirmation. Options `data-kp-grid-columns|tile-shape|caption|lightbox-loop|lightbox-preload|lightbox-zoom|lightbox-chrome|lightbox-info|lightbox-actions|lightbox-hash|hash-prefix|lazy|remember`. Words `gallery…`, `viewer…`.
- **Added: a document preview and the page icon** [kpadopt6-media; Kenny: show Open in a new tab and Download; JobTracker's Files tab and CV viewer]. js/docpreview.js (`openDocPreview`, `attachDocPreviews`, `docGlyph`, `docKindOf`, `previewTypeOf`) and `.kp-docglyph`: a PDF, picture or text in the viewer shell (the browser's own PDF viewer, opened at a page; text with scripts removed), a plate with the two ways out where a browser cannot show a PDF, a gone file said in words, the facts from a HEAD request, documents of one `data-kp-preview-group` step previous and next with an exact "2 of 5", keys `o`, `d`, `p`. The icon: three sizes, six kinds, a faint dashed missing page. Options `data-kp-preview|-type|-engine|-size|-actions|-title|-page|-sandbox|-group|-name`, `data-kp-doc-kind|-doc-lines`. Words `preview…`, `doc…`.
- **Added: a text box that grows with its text** [kpadopt6-media; Kenny: 20 lines, then scroll inside the box; JobTracker's correspondence box, kyu's publish payload]. `data-kp-autosize` on a multiline field and the new js/autosize.js (`attachAutosize`, `autosize`, `refreshAutosize`, `setAutosizeState`, `fitTextarea`; the growth that lived privately in js/json-field.js is now this one, which the JSON box calls): the field is as tall as its text between its rows and 20 lines (`data-kp-autosize-max`, `none`), measured on a hidden twin so the page never moves, the browser's own `field-sizing` where it has it, never animated, a phone's cap is 60 % of the visible height, a read-only or disabled box shows its whole value, a paste longer than the cap keeps its start in view. Exact counter (`data-kp-counter`, with `maxlength` a warning plate from 90 %), Ctrl+Enter sends (`data-kp-submit-key`), a kept draft (`data-kp-remember`), loading (the busy card, read-only) and failed (the text stays, a sentence in the error line). Event `kp-autosize-resize`. Words `autosize…`.
- **Added: link anchors on headings and rows** [kpadopt6-media; Kenny: the # only on hover or keyboard focus, always on a phone; kyu's dead-letter list]. `data-kp-anchors` and the new js/anchors.js (`attachAnchors`, `refreshAnchors`, `anchorSlug`, `uniqueAnchorId`): a `#` beside each heading of the chosen levels and each row that says its own id (`data-kp-anchor`), a press copies the link and the mark says "Copied" without changing width, Shift copies a Markdown link, the address bar follows, opening a link scrolls (leaving room for a sticky bar) and marks the place for 2 s, a folded `details` is opened first, a hash that arrives before its row waits up to 10 s and one with no place says "That item is no longer here" with a way to clear it, `y` then `l` on a focused row. Options `data-kp-anchors|anchor|anchor-label|anchor-levels|anchor-show|anchor-position|anchor-copy|anchor-target|anchor-offset|anchor-open`; events `kp-anchor-copy`, `kp-anchor-reveal`, `kp-anchor-missing`. Words `anchor…`.
- **Added: lists that print well** [kpadopt6-media; Kenny: print with a filled box, text kept; kp-soft's packing and shopping lists]. css/_print.css grows (unlayered, only `@media print`): black on white, controls and decoration dropped, a real drawn box a pen can tick (a filled box with a tick for a ticked item, `data-kp-print-done` show, hide or strike, `data-kp-print-box`), group headings that stay with their first items, `data-kp-print-groups="columns"`, dotted note lines, no link addresses in a list, A4 with a 15 mm margin. The new js/print.js (`attachPrint`, `preparePrint`) adds a title, the date of printing at the foot (rule 52), the sentence a list that is still loading or failed prints, opens folded groups for the paper and closes them again, and wires `data-kp-print-action` buttons. Words `print…`.
- **Added: a slider with the value in a box beside it** [kpadopt5-time; Kenny, 2026-10-17: "Invulvak ernaast"; kp-soft's sketch controls, Mothership]. `.kp-slider[data-kp-slider]` and the new js/slider.js (`attachSliders`, `slider`, `sliderValues`, `setSliderValues`, `setSliderState`, `snapSlider`, `sliderPercent`, `parseSliderText`; also through js/auto.js and the root export): the native `<input type="range">` drawn by the package (a rail, a fill from thumb centre to thumb centre, a round thumb ringed in the primary colour inside a 44 px touch target, the focus as a second ring), one value or `data-kp-slider="range"` with two thumbs that never cross (`data-kp-min-gap`); the number in a small box beside the track that can be typed in (read on Enter or blur, snapped to the step, refused with a line under the slider while the thumb keeps its last good value, Esc puts it back); `data-kp-slider-value` `field` (default), `bubble`, `both` or `none`, `data-kp-unit`, `data-kp-format` (`number`, `percent`, `bytes`, `duration`), `data-kp-ticks` (`auto` or `0,25,50:Half`), `data-kp-commit`, `data-kp-orientation="vertical"`, `data-kp-default` (double-click goes back to it), `data-kp-disabled` with `-disabled-reason`, `data-kp-state="loading"` (the package's skeleton over track and box). Shift with an arrow steps ten times as far, Page Up and Page Down a tenth of the range; `aria-valuetext` carries the unit; events `kp-slider-input` and `kp-slider-change`. Words `slider…` in js/strings.js.
- **Added: a bar for unsaved changes** [kpadopt5-time; Kenny, 2026-10-17: "In de kop, onderaan zodra de kop uit beeld is"; homelab's Settings staged-changes chip, Discard and write, JobTracker's status form]. `.kp-unsaved[data-kp-unsaved]` and the new js/unsaved.js (`attachUnsaved`, `unsaved`, `unsavedSaved`, `markUnsavedClean`, `discardUnsaved`, `setUnsavedSaving`; also through js/auto.js and the root export): in the page header's actions, "No changes" with Save and Discard off and the reason on each, or a chip "2 changes" (the list of `key old → new`, each with its own Revert and a link to its row), Discard and "Save 2 changes"; once the header is scrolled out of view the same bar stands at the foot of the screen on the raised plate and its place in the header keeps its size (`data-kp-placement` `header+sticky` (default), `header`, `sticky-bottom`; `data-kp-dock="container"` and `data-kp-scroll-root` for a page that scrolls in a box). It counts the rows marked `data-kp-changed` and marks them itself as the form is edited (`data-kp-track="app"` leaves it to the page; values come from the markup's own defaults, so a browser's restoring of a reloaded form counts as unsaved). Save fires the cancelable `kp-unsaved-save` and shows the spinner; `unsavedSaved(el, { refused })` stops counting what went through and says why for the rest ("1 saved, 1 refused"); Discard puts every value back with Undo (`data-kp-undo-ms`, 6000); Ctrl or Cmd+S saves; closing the tab (`beforeunload`) and following a link (`kp-unsaved-leave`, then the package's confirmation) ask first (`data-kp-warn-leave`); the changes are kept in sessionStorage across a reload and a toast says so, a password or `[data-kp-secret]` never. Below 30rem Discard goes behind More. Words `unsaved…` in js/strings.js.
- **Added: data pieces every app drew itself** [kpadopt4-data; component survey G1, G4, G12, G17, G18, G20, G24; review in formal only, research/kpadopt4]. `.kp-idmark` (an identity plate made from a name: letters, `--pattern`, `--round`, `--glyph`, sizes `--xs` to `--xl`, empty, current, loading; `.kp-idmark-group` with an exact `+N`, `.kp-idmark-name`; js/idmark.js `idmarkFor`, `idmarkColours`, `setIdmark`, `attachIdmarks`). `.kp-stackbar` (parts of a whole with a legend, hover card and arrow keys per part, Other, over the whole, marks, loading, not read, failed; js/stackbar.js `setStackbar`, event `kp-stackbar-pick`). `.kp-bullets` (a value against a threshold per row on the meter, worst first, links or buttons, busy card while loading, empty and failed with Retry; js/bullets.js `setBullets`). `.kp-kv` (`--lines`, `--stack`, `--columns`) and `.kp-formrows` / `.kp-formrow` (`--top`, `--wide`, changed, error, locked): CSS only. `.kp-code` (a payload block: Pretty/Raw for JSON, Wrap, Copy that keeps its width, line numbers, fold, truncated, loading with the busy card, empty, binary, failed; js/code.js `setCode`). The page header's opt-in heading line (`__heading`, `__lead`, `__line`, `__meta`). `[data-kp-tick]` (js/tick.js `tickTo`, `attachTicks`): a live number counts from the shown number to the newly written one, knob `--kp-tick`. 29 strings. Every existing component and default unchanged; the registers do not answer the new roots yet (gates/register-pending.json).

- **Added: rows with a lead, for an inbox, a message backlog, a file list and appointments** [kpadopt4-rows; homelab's `nx-inbox`, JobTracker's queue, Files and Appointments, kyu's backlog]. `.kp-action-list--lead` on the existing action list: a lead column as wide as its widest lead (`__lead`; `time.__when` for a moment), the words in `__main` (`__title`, `__text`, `__meta` with dots kept with the part before them), a folded payload (`__more` > `__payload`, the bare accordion item), heading rows `li.__group`, and `data-kp-state` new / active / warn / failed / next / done / past as a reserved start bar (next also a primary wash). `js/actions.js` gains `setRowBusy` (the pressed button's spinner at its own width, the row's buttons refusing a press, the focus kept), `removeRow` (the theme's leave, the focus handed to the next row) and `attachRowKeys` (j / k, `kp-row-open`), wired into js/auto.js for `data-kp-row-keys`. Knobs `--kp-action-list-lead-gap`, `-bar`, `-pad`, `-next-wash`, `-payload-max`. A list without the modifier is unchanged.
- **Added: a card in four data states** [kpadopt4-rows; JobTracker's `Card` with `state`, homelab's `failBox`]. `data-kp-state` loading, empty, error or ready on a `.kp-card`, its data in `.kp-card__stage > .kp-card__data`: loading lays the data table's own loading card over the stage (js/busy-card.js) with the data under it dimmed and inert; empty fills the stage with `.kp-empty` (title, sentence, action); error is the destructive alert with Try again (`kp-card-retry`); data and note share one cell, so no state moves anything around the card. New js/card-state.js (`setCardState`, `attachCardStates`, `CARD_STATE`, `CARD_STATES`, `CARD_STATE_EVENT`, `CARD_RETRY_EVENT`), wired into js/auto.js; strings `cardLoading`, `cardEmpty`, `cardFailed`, `cardRetry`; knobs `--kp-card-stage-min`, `--kp-card-stage-gap`. A card without `data-kp-state` is unchanged.
- **Added: a check list with the fix written out** [kpadopt4-rows; JobTracker's readiness card, homelab's doctor checks]. Status rows take `data-state="warn"` (the warning pair on the mark, "!" as `--kp-glyph-warn`, the word `statusWarn`) and `.kp-statusrow__fix` in the body, shown on a failed or warn row only (`--kp-statusrow-fix-gap`). `buildStatusList` and `setStatus` take `fix`; new `countStatus(list)` for a summary line. Opt-in; the four states before are unchanged.
- **Added: choices as tiles** [kpadopt4-rows; JobTracker's `jt-check-tile`]. `data-kp-layout="tiles"` on a `.kp-fieldset` turns its `.kp-field__option` labels into tiles: the native checkbox or radio at the start, `.kp-field__option-title` and `.kp-field__option-hint` beside it, one height per row, one column under `--kp-field-tiles-min`. Checked, hover, focus (the ring on the tile), disabled (dashed, muted) and the fieldset's invalid outline. Knobs `--kp-field-tiles-min`, `--kp-field-tiles-gap`, `--kp-field-tile-pad`, `-radius`, `-ground`, `-ground-checked`, `-edge-checked`. Opt-in; no other group changes.
- **Added: drawings for an empty state, in the theme's own hand** [kpadopt4; homelab's `drawing()` and `nx-art`; research/kpadopt4, formal first]. `data-kp-art="none | nomatch | error | offline | done | locked"` on a `.kp-empty` (or any element), and the new js/art.js (`attachArt`, `drawArt`, `ART_KINDS`, `ART_SETS`; through js/auto.js and the root export): a 120 by 72 line drawing at its top, a picture only (`aria-hidden`). The svg carries every theme set the package has and the register shows its own; a theme without a set shows none (`.kp-art` is hidden in the components layer). Formal's set is the ledger: a ruled blank page, the page searched with the reading glass, an entry struck through in red ink, the double rule broken, the account closed with the double rule, the ledger shut with its clasp; each stroke ruled in at 400 ms, 60 ms apart, top down. `data-kp-art-size="sm | lg"`; knobs `--kp-art-size`, `--kp-art-stroke`, `--kp-art-rule`, `--kp-art-line`, `--kp-art-ink`, `--kp-art-red`.
- **Added: the pipeline** [kpadopt4; JobTracker's Overview `Pipeline` (`pl__*`); research/kpadopt4, formal first]. `section.kp-pipeline[data-kp-pipeline]` and the new js/pipeline.js (`attachPipelines`, `setPipeline`, `setPipelineState`, `setPipelineSelected`; also through js/auto.js and the root export): a read-only board, a lane per stage at one width each and as tall as the tallest, a plate with the stage's name and exact count in its colour (`tone` 1 to 5), the share of all under it, and its cards (a link or a button with a mark, a title, a sub line and a meta line; `dimmed` keeps a filtered-out card in place). A `closed` lane stands under the board across its width; `data-kp-pipeline-limit` keeps the rest of a lane behind “+N more”; under 40rem the lanes turn to rows. Loading keeps the lanes with ghost cards under the data table's own loading card; empty keeps every lane with “none” and one sentence on a plate; error says why with Try again. One tab stop with arrow keys across lanes and along them. Events `kp-pipeline-open`, `kp-pipeline-retry`, `kp-pipeline-more`; strings `pipeline…`. The root export also gains the secret field's and the timeline's new functions.
- **Added: a journey stepper** [kpadopt4; JobTracker's Dossier `Journey`; research/kpadopt4, formal first]. `.kp-steplist--journey` lays a step list along one path: a mark over each name, the date it was reached under it (`.kp-steplist__time`), joined by a rule drawn in the step's colour once reached; under 30rem of its own width the path turns to a column. A new step state `current` (the step it stands at now: a ring with a dot, `aria-current="step"`, string `stepCurrent`), `data-kp-tone="1"` … `"5"` (or `--kp-step-tone`) for a step's own colour, and `StepRow.tone` for `buildSteplist`. A closed path ends with a `failed` step. Under it a `.kp-gantt--line` with `setGanttPoints` and `setGanttZones` is the dated line. Existing lists are unchanged.
- **Added: moments on the run timeline, and a dated line** [kpadopt4; JobTracker's Contact timeline (`Timeline`, graphics.jsx) and the Journey's dated line; research/kpadopt4, formal first]. `.kp-gantt` takes point events next to runs: `setGanttPoints(el, points, lanes)` puts each moment (`at`, `kind`, `label`, `detail`, `planned`) as a mark in its lane, `setGanttKinds(el, kinds)` names the kinds in the legend with a shape (`dot`, `diamond`, `square`, `triangle`, `ring`) and a colour (`series` 1 to 5 or `tone`), and `setGanttZones(el, zones)` lays stretches under them (a lane's thin band, or a band behind every lane, named in the legend). A planned point is hollow; marks too close to tell apart become one mark with a count whose name and card list them all, and `kp-gantt-open` reports every point of it in `points`. A lane may carry `href` (its name a link) and `sub` (a second line). The range word `all` fits the window to everything and now; the axis steps reach one, two and four weeks, a week starting on Monday. `.kp-gantt--line` is one lane without toolbar, names, hint or brush, its axis under the line. The marks walk with the arrows as the bars do, and use the page's one hover card. Strings `ganttAll`, `ganttAllTitle`, `ganttPoint`, `ganttPlanned`, `ganttCluster`, `ganttClusterMore`, `ganttPointsHint`. Without points, kinds, zones, `all` or the line class the timeline is unchanged (a run never chose a step past two days before).
- **Added: a data table whose page sorts the rows** [kpadopt4; homelab's Schedules `sch-sort` with its own `sched-sort` key; research/kpadopt4]. `data-kp-sort-external` on a `.kp-datatable` (or `sortExternal: true`): a header press does everything the sort does (arrow, `aria-sort`, the key numbers and the summary with `data-kp-sort-multi`, Reset, the remembered sort, `kp-datatable-sort`) except moving rows; the page reorders its rows and calls `refresh()`, and the table keeps the order it finds. A sortable `th` with `aria-disabled="true"` cannot be pressed and keeps an arrow it already has. Without the attribute nothing changes.
- **Added: a dialog in sections and a confirmation that depends on something** [kpadopt4; chassis's `client-dialog__head/__body/__section/__heading/__note`, almanac's calendars that a source still writes to; research/kpadopt4, formal first]. `.kp-dialog--wide` (42rem at once, `--kp-dialog-wide`), `.kp-dialog__head` (title, a state badge beside it, the description under both), `.kp-dialog__section` with `__heading` and `__note` (`--kp-dialog-section-gap`), and `.kp-dialog__section--danger` ruled along its start edge in the destructive colour. The confirmation (`openConfirmation`, `attachConfirmations`) takes three opt-in checks: `data-kp-confirm-dependents="a; b"` (or `dependents`) lists what still uses the thing under a heading with the exact count; `data-kp-confirm-blocked="what to do first"` (or `blocked`) makes it a notice with one Close button and no Confirm; `data-kp-confirm-type` is the typed confirmation below (a blocked removal shows no field). Strings `confirmDependents`, `confirmBlocked`, `confirmClose`. Formal divides the sections with the docket cut and writes the danger section as the red-ink entry.
- **Added: the secret field** [kpadopt4; homelab's `sx-mask` on the Secrets page, kyu's `data-reveal-target` snippets, chassis's client token line; research/kpadopt4, formal first]. `.kp-secret[data-kp-secret]`, built by `attachPatterns()` in js/patterns.js (`attachSecrets`, `revealSecret`, `hideSecret`, `SECRET_TTL`, `SECRET_MASK`): a masked value in a box of the control height, Reveal and Copy (package buttons; Copy wears `.kp-copyable__button`'s copied and blocked looks and copies without showing), and one line under them that always keeps its room for the countdown with a drain rule, the reason a field is off, or why it could not be read. `data-kp-secret-ttl` (30 s; 0 keeps it until Hide), `-mask`, `-mask-char`, `-reveal-on="hold"`, `-copy="false"`, `-wrap="wrap"` with `-lines`, `-disabled="why"`, `-value`; the value is read on demand through `kp-secret-request` (`respond`, `fail`) or the `secretLoad` option and is in the page only while shown. The countdown pauses while the value is selected or focused, the value hides when the tab goes to the background, and a polite region says shown, 10 s left and hidden again. Events `kp-secret` `{ shown, reason }`. Formal draws it as a ledger figure under a cover: the value ruled in at 400 ms linear, the countdown a navy rule ruled off. The fifteen other registers answer it once it is judged (gates/register-pending.json).
- **Added: a wheel that picks** [kpadopt4; research/kpadopt4, formal only first]. `.kp-wheel` with `js/wheel.js`: a segment per choice sized by its weight, soft in the theme's five chart colours, labels along the radius that are never upside down and are cut to their segment (whole in the result), a still pointer, the theme's primary button round in the middle. The outcome is drawn by the weights first (`pickWeighted`) and the wheel turns to it (4 turns, 3.6 s, `--kp-wheel-ease`, no overshoot; under reduced motion a short turn of 0.6 s or none), never the same choice twice in a row, then the chosen segment is filled deeper and the name stands in two reserved lines and is said once. New choices glide the segments to their size in the theme's size time; one choice is the outcome at once, none is a dashed disc and a sentence; loading lays the busy card, an error stands on the destructive plate. The disc keeps its size in every state. Nine strings `wheel…`; wired into js/auto.js, exported, listed in gates/check-busy-card.mjs; formal closes the outcome with its double rule.
- **Added: one step at a time, with the screen kept on (cook mode)** [kpadopt4; research/kpadopt4, formal only first]. `.kp-focus-steps` with `js/focus-steps.js`: the count and the theme's progress bar on top, one step in large type with what it needs (amounts in one column), a timer button that starts a `js/timer.js` timer, a note as the theme's alert, and Back and Next half the width each and 4rem high at the foot (Next says Done on the last step). A three-row grid, so the head and the buttons never move and a long step scrolls inside. The Wake Lock API keeps the screen on while it is attached and the page is shown, asks again when the page comes back, lets go on detach, and the head says which it is. Arrows, PageUp/PageDown, Space, Home/End and a swipe turn the step; the new step arrives the theme's way; Read aloud uses the browser's voice; every change is announced. Loading lays the busy card, error and empty have their own line. `kp-focus-steps-change` carries the index so the page remembers where a person stopped; `setFocusSteps(…, { start })` comes back there. Fourteen strings `focus…`; wired into js/auto.js, exported, listed in gates/check-busy-card.mjs.
- **Added: kitchen timers** [kpadopt4; research/kpadopt4, formal only first]. `.kp-timers` / `.kp-timer` with `js/timer.js`: named countdowns side by side, each a card of one height with its name, a state word, the time left large in figures of one width, the theme's progress bar, Pause/Resume, +1 min and Remove. Counted from the end time, so the background, a locked phone or a sleeping laptop never put it wrong; an ended timer turns to the done plate with its name large and a primary Stop, a soft two-note chime (Web Audio, no file) every 4 s for a minute, a buzz, and a system notification when the page has the permission (`askTimerNotifications()`). A button with `data-kp-timer-start="10m"` anywhere in the page starts one, and never a second while it runs. A start, the last minute and the end are said; never every second. `getTimers()` / `restoreTimers()` for the page to keep them. Fourteen strings `timer…`; wired into js/auto.js, exported; formal draws the ended card as its red-ink entry.
- **Added: a checklist whose ticked items sink** [kpadopt4; research/kpadopt4, formal only first]. `.kp-checklist` with `js/checklist.js`: items in groups (a heading and "4 of 9" per group, the theme's check once a group is done), every row a checkbox's label a fingertip high with its amount in its own column; a ticked row is struck through and glides to the end of its group in the theme's size time (at once under reduced motion; `data-kp-checklist-sink="false"` keeps it in place); ticked with the keyboard, the focus goes to the row that took its place; Check all, Clear checked with an Undo in the bar's own line; loading lays the data table's busy card, error and empty have their own line. Nothing is stored: `kp-checklist-change`, `kp-checklist-clear` and `kp-checklist-undo` carry the whole list. Thirteen strings `checklist…`; wired into js/auto.js, exported, listed in gates/check-busy-card.mjs as a data component.
- **Added: a quantity with minus and plus** [kpadopt4; research/kpadopt4, formal only first]. `.kp-quantity` with `js/quantity.js`: the theme's own buttons, square and a fingertip big (2.75rem, 3rem on touch, `kp-quantity--lg` 3.5rem), the number and its unit in one field box, the number a spin button (arrows, PageUp/PageDown, Home/End) that can be typed in the page's language with a comma or a point, kept inside its bounds and on its step; a held button repeats, slowly then faster; a button at a bound is `aria-disabled` and keeps the focus; the field and the unit hold the width of their widest value, so nothing moves; a singular unit for 1. Event `kp-quantity-change`; three strings `quantity…`; wired into js/auto.js and exported as `@kp-soft/themes/js/quantity`. Also exported from the root now: `getSegmentedTri`, `setSegmentedTri`.
- **Added: three-way filter chips** [kpadopt4; the AuDHD recipe app's tri-state filter, research/kpadopt4, formal only first]. An opt-in mode of the segmented chips, `data-kp-segmented="tri"`: each chip is either way, must be in (filled, a check in its mark) or must not be in (the destructive edge, a cross on the destructive pair, the label struck through); a press walks either way → in → out → either way, Delete or Backspace lets a chip go, `data-kp-segmented-all` is Clear all (dimmed while nothing is chosen). The mark is always there and one size, so a chip never changes width; a screen reader hears the state after the name ("Chicken, required") and a status region says what a press changed. `data-kp-segmented-summary` keeps one line after the group: how it works, then what is chosen. `kp-segmented-change` carries `include` and `exclude`; new `getSegmentedTri`, `setSegmentedTri`, `TRI_ATTRIBUTE`, `TRI_STATES`; seven strings `tri…`. Single and multi groups are unchanged.
- **Added: the compare slider** [kpadopt4-ideas; Kenny, 2026-10-16]. `.kp-compare` and `js/compare.js`: two versions stacked with a divider (a slider: arrows, Shift, Page Up and Down, Home, End; a press on images glides there, a drag follows), Before and After labels that step aside, images or live HTML panes (then only the handle drags and both panes stay usable), the theme's skeleton while images load and a sentence for one that fails, `kp-compare-change`. `attachCompares`, `setCompare`, `compareKey`; strings `compare…`; wired into js/auto.js; registers pending.
- **Added: the range picker** [kpadopt4-ideas; Kenny, 2026-10-16]. `.kp-range` and `js/range.js`: presets (`1h 6h 24h 7d 30d`, any number with m, h, d, w) as the package's segmented control, Custom… opening a panel on the popover plate with two date pickers (dd/mm/yyyy) and two times (HH:MM), validated (whole values, order, not in the future, an optional maximum span) with the reasons under the fields, Apply and Cancel; one line names the window exactly in Europe/Brussels; `kp-range-change` with the preset and ISO start and end. `attachRanges`, `setRange`, `rangeOf`; strings `range…`; wired into js/auto.js; registers pending.
- **Added: two timers, a disc and digits** [kpadopt4-ideas; Kenny, 2026-10-16: "Ik wil ook een timer met getallen, apart"]. `.kp-timer-disc` (`js/timer-disc.js`): the time left as a shrinking disc with twelve marks and no ticking figures, one custom property written only when its edge moves a tenth of a degree, Reset filling it in the theme's own time and curve, a breathing end, stepped once a minute under reduced motion, an optional 60-minute dial. `.kp-countdown` (`js/countdown.js`): a named countdown in mm:ss or h:mm:ss whose digits stand in one-`ch` cells so nothing ever shifts, Start, a minute more and Reset, the time rounded up, a breathing end. Both on `countdownClock()` (the end moment minus now; a test hands in `now`), Start keeping one width for Start, Pause and Resume, `kp-countdown-change` and `kp-countdown-end`; strings `timer…`; wired into js/auto.js; registers pending.
- **Added: the command block** [kpadopt4-ideas; Kenny, 2026-10-16]. `.kp-command` and `js/command.js`: one command with its terminal (`data-kp-command` = `wsl`, `powershell`, `cmd`, `garuda`, `bash`), the `admin` or `sudo` badge (`data-kp-command-elevated`), the package's copy button that confirms and keeps its width, and "Runs on …" (`data-kp-command-where`); every line behind the terminal's prompt, drawn so it is never copied, continuation lines indented; long lines wrap under their first character or, with `data-kp-command-wrap="scroll"`, scroll with a faded edge. `attachCommands`, `commandLines`, `COMMAND_SHELLS`; strings `command…`; wired into js/auto.js; registers pending.
- **Added: the typed confirmation** [kpadopt4-ideas; Kenny, 2026-10-16]. Opt-in on the destructive button's confirmation: `data-kp-confirm-type="<name>"` makes the dialog show what will be lost (`data-kp-confirm-loses`), the field, the matching rule (spaces at the ends never count, capitals do unless `data-kp-confirm-case="any"`) and a match line; Confirm stays disabled until the name matches, carries the button's own words (or `data-kp-confirm-label`) and Enter confirms a match. The same block in a page's own dialog or form: `data-kp-type-confirm` with `-for="<button id>"` (`attachTypeConfirms`, `buildTypeConfirm`, `typeConfirmMatches`, `kp-type-confirm`). In js/components.js (no new import, the closure stays as it was); without the attribute the confirmation is unchanged. Strings `typeConfirm…`.
- **Added: the uptime strip** [kpadopt4-ideas; Kenny, 2026-10-16]. `.kp-uptime` and `js/uptime.js`: one cell per period (90 days, 48 hours) toned up, degraded (ruled), down (striped) or no data (an empty frame), the window's summary in exact figures ("99.4% · 2 incidents", the share cut and never rounded up), the hover card per cell, one tab stop with arrow keys and `kp-uptime-pick`, the busy card while loading, empty and error in the same footprint, and on a narrow page the latest cells that fit with "N of M shown" or, with `data-kp-uptime-fit="scroll"`, every cell scrolling. `attachUptimes`, `setUptime`, `uptimeFigures`, `uptimePercent`, `uptimeFit`; strings `uptime…`; wired into js/auto.js; registers pending (formal demo, research/kpadopt4).
- **Added: action tiles, status rows and the facet list** [kpadopt2-tiles; the dashboard's `nx-action`, `perstack-chip` and `hl-opt`, kpa-9..33; review in formal only first, research/kpadopt2]. `.kp-actions` / `.kp-action`: a button or link tile with a title and one sentence, a grid of equal heights, a mark column that is always there (chevron on a link, the theme's spinner while `aria-busy`), disabled, destructive (a start bar plus ink), pressed; `setActionBusy`, `attachActionTiles` (a busy or disabled tile ignores a press). `.kp-statuslist` / `.kp-statusrow`: ok, loading, failed with a Retry that fires `kp-status-retry`, empty with its reason; shape and word as well as colour, a detail line that keeps its room (`--kp-statusrow-detail-lines`), focus kept when Retry goes, one summarised announcement for a burst. `.kp-facets` / `.kp-facet`: real checkboxes in labels with a count and an "only" button that is a sibling of the label (shown on hover or focus-within, always on touch), an Everything row with a mixed state, in-place reconcile by `setFacetItems`, loading counts as quiet bars, `kp-facets--row` for a phone. New js/action-tiles.js, js/statusrow.js, js/facets.js (wired into js/auto.js, exported), 13 strings, knobs `--kp-action-*`, `--kp-statusrow-*`, `--kp-facet-*`. All 16 registers carry a block (each theme's own tile hover and press); only formal has been checked on screen so far.

Three components the admin dashboard still drew itself (homelab kp-adopt-rest, kpa-9, kpa-14, kpa-18, kpa-19, kpa-32, kpa-33), built here first (research/kpadopt-feedback, awaiting Kenny's judgement; dist/ and the checksums are rebuilt at release).

- **Fixed: a folding bar stays one row and its More button and menu stay at the bar, in every theme** (research/kpadopt-nav round 3). A register that dressed the list items (`position: relative` in cyberpunk) or a menu (`position: relative` on `.kp-menu` in phantom's signature layer, later than the layer that makes it absolute or, raised, fixed) beat the component, so folded links took room in the bar, More stood outside it, and a raised menu followed the page's scroll instead of its button: the fold's out-of-flow rule and the raised menu's `position: fixed` are `!important` now, and phantom leaves a menu button's menu out of that rule. Grotesk's fourteen-column grid gave the search and the running job no column and wrapped them to a second row; a folding grotesk bar is a flex row, and its narrow collapse only applies with a toggle. A folding bar never wraps (`flex-wrap: nowrap`, the brand gives way first, to an ellipsis, the list keeps the More button's room: `--kp-nav-fold-more`). The More menu hangs from the button's start edge; a menu whose button the window does not show is no longer clamped into the window; a popover the browser took out of the top layer when its page moved is put back on the next scroll or resize. The hidden counter text of More used the class `sr-only`, which does not exist (`kp-sr-only`).
- **Added: a toast that waits while it is read.** `toast()` takes `pause` (default true: the clock stops while the pointer is on the toast or focus is inside it, `data-kp-paused` is set and `kp-toast-pause` is dispatched on the region), `linger` (ms left after both are gone, default `TOAST_LINGER_MS` 2000), `close` (a close button) and `sticky` (no clock, with a close button). Esc on a focused toast closes it; a touch does not count as hovering. Existing calls are unchanged except that a toast now waits for the pointer; `pause: false` brings back the plain timer.
- **Added: `.kp-steplist` and `js/steplist.js`.** The live list of the steps of a run: `data-state` pending, running (the theme's own spinner), done, failed, skipped, each a shape and a word as well as a colour, a fixed mark box so nothing moves, a time column, and a status region that announces changes. `attachSteplists`, `buildSteplist`, `setStep`, `kp-steplist-step`. A new component rather than a variant of the timeline or the wizard steps (research/kpadopt-feedback/README.md). All 16 registers answer it; six strings `stepPending` ... `stepAnnounce` in js/strings.js; wired into js/auto.js.
- **Added: `.kp-diff__hunk`** (and `.kp-diff__hunk-context`): the `@@ -a,b +c,d @@` header row of a diff hunk, a muted band with a rule under it and over it from the second hunk on. The registers that set a face on the lines set it on this row too; terminal and brutalism draw its rules their own way.
- **Added: `.kp-week` and `js/week.js`.** The week agenda of the dashboard's schedules page: seven day columns (rows below 40rem of its own width), items as pills at their time of day, a now-line, a today mark, next/off/skipped/reference states, a `+N` menu button for a crowded day, roving keyboard, the hover card for detail. `attachWeeks`, `setWeekEvents`, `setWeekState`, `setWeekStart`, `setWeekLegend`, `kp-week-open`, `kp-week-range`; strings `week…`; wired into js/auto.js (research/kpadopt2-time, formal first).
- **Added: `.kp-gantt` and `js/gantt.js`.** The run timeline of the Activity page: a lane per job, a bar per run on a live axis (queued, running growing, ok, failed, each a shape as well as a colour), range buttons, Live, a brushed selection with Zoom and Clear, hover card, status announcements. `attachGantts`, `setGanttRuns`, `setGanttState`, `setGanttWindow`, `setGanttSelection`, `kp-gantt-open`, `kp-gantt-select`, `kp-gantt-window`; strings `gantt…`; wired into js/auto.js. Draft register rules for all 16 themes; only formal is under review so far.

- **Added: the segmented control and the filter chips** [kpadopt-controls; the dashboard's `toggleGroup` and `segSwitch`, kpa-18 and kpa-33]. `.kp-segmented` is a group of buttons that choose among values: a track with a plate under the chosen one, or with `.kp-segmented--chips` separate pills; `.kp-segmented--block` makes every segment equally wide. `data-kp-segmented="single"` is a radio group (one tab stop, arrows move and choose, Home and End jump), `"multi"` is the plain-click toggle group (`aria-pressed`, several on, none on is All, every value on collapses back to All; `data-kp-segmented-all` marks the All item, `data-kp-segmented-collapse="false"` keeps them on). Counts sit beside the values (`.kp-segmented__count`), a disabled value or group, a busy group that keeps its counts' places, a long label cut with an ellipsis, a track that scrolls when it has no room, right-to-left. The plate moves by `translate` in the theme's own `--fx-duration` and `--fx-ease`; the chosen label keeps its weight so nothing shifts. New js/segmented.js (`attachSegmented`, `getSegmentedValues`, `setSegmentedValues`, `resetSegmented`, `setSegmentedCounts`, `setSegmentedItems`; event `kp-segmented-change`), wired into js/auto.js and exported as `@kp-soft/themes/js/segmented`. Knobs `--kp-seg-*` and `--kp-chip-*`; every register answers it.
- **Added: the list toolbar** [kpadopt-controls; the dashboard's `toolbar` and `filterChip`, kpa-18]. `.kp-toolbar` puts the search (a `.kp-field__input` with a key hint), labelled filter groups (segmented controls or chips), and view and state on one grid row, and under them the filters that are on as the data table's own removable `.kp-tag` and a Clear all; absent when none is on, or kept in place with `data-kp-toolbar-reserve`. `kp-toolbar--stacked` is the phone layout on demand. New js/toolbar.js (`attachToolbars`, `setToolbarActive`, `toolbarSearch`; events `kp-toolbar-remove`, `kp-toolbar-clear`): Escape clears the search, `data-kp-toolbar-key="/"` focuses it, the focus moves to the next tag when one is removed. Two strings in js/strings.js: `toolbarShowingOnly`, `toolbarClearAll`.
- **Added: the inline key line and the key cap** [kpadopt-controls; the dashboard's `kbd` and `keyRow`, kpa-19]. `kbd.kp-kbd` is a key cap that stands alone (in a button, a hint, a sentence); `.kp-keys` is a one-line row of caps with what each does, wrapping by whole shortcuts, outside the Help sheet. New js/keys.js (`setKeys`, `attachKeys`): `Mod` is ⌘ on a Mac and Ctrl elsewhere. One string: `keysLabel`. Knobs `--kp-kbd-*`, `--kp-keys-gap`.
- **Added: a top bar that folds what does not fit behind a More menu** [kpadopt-nav; homelab dashboard kpa-33, main.js `fitBar`]. `data-kp-nav-fold` on a `.kp-nav` (js/nav-fold.js, loaded by js/auto.js; `NavBar fold` in React). The links that do not fit fold from the end behind a More button that is the package's own menu button (`.kp-menu-button` with a `.kp-menu--rich`), so it has the keys, the placement and the look of every other menu; nothing is moved or cloned: a folded item stays in the list (`data-kp-nav-folded`, out of the flow, invisible, out of the tab order) and its menu entry clicks the real link, so a router's handler still runs. A link with a dropdown or a mega menu becomes a named group. The list is `flex: 1 1 0` and does not wrap, so the bar is one row before the script runs and after it (no layout shift); the decision is taken in a `ResizeObserver` callback, before the frame is painted, from each item's natural width. Marks: `data-kp-nav-fold-ready`, `data-kp-nav-folding`, `data-kp-nav-keep` (an item that never folds), `data-kp-nav-more-current` / `aria-current="true"` on the button when the current page is behind it, a dot (`.kp-nav__more-dot`) when a counter is; event `kp-nav-fold` `{ folded, items }`; exports `attachNavFolds()`, `foldNav()`, `planFold()` (pure). The bar's own phone toggle wins below 40rem. Dictionary: `navMore`, `navMoreMenu`, `navMoreAlert`, `navMoreUnavailable`. Knob: `--kp-nav-more-dot`. Cyberpunk's void panel follows the visible links (`--kp-nav-fold-used`). Demo: research/kpadopt-nav.
- **Added: the bottom tab bar for phones** [kpadopt-nav; homelab dashboard kpa-33, `.nx-tabbar`]. `nav.kp-tabbar` of `.kp-tabbar__tab`s (icon over label, `.kp-tabbar__badge` count or dot at the icon's corner, a More tab that opens the package's drawer through `data-kp-dialog`), in css/components.css with a rule in all 16 registers (the current tab's mark is each theme's own) and js/tabbar.js (`attachTabbars`, `setTabbarBadge`, `setTabbarCurrent`, `setTabbarBusy`). Shows below 40rem; `kp-tabbar--wide` below 60rem, `--always`, `--static`. Safe-area aware, publishes `--kp-tabbar-height` on the root while shown so the body, `scroll-padding`, toasts and back-to-top keep clear of it. Knobs: `--kp-tabbar-tab-height`, `--kp-tabbar-icon`, `--kp-tabbar-pad`, `--kp-tabbar-size`, `--kp-tabbar-safe-bottom`, `--kp-tabbar-duration`, `--kp-z-tabbar`. States: current, held (More with the current page in the drawer), count, dot, busy tab, disabled tab, loading bar.
- **Added: the running-job button** [kpadopt-nav; homelab dashboard kpa-33, `.nx-pill`]. `kp-button--live` on any `.kp-button`: a row with the theme's own `.kp-spinner` (`kp-button__spin`), a `kp-button__short` and a `kp-button__long` label; the long one is cut with an ellipsis at `--kp-live-max` (30rem) and gives way to the short one in a container under 40rem; `hidden` leaves no gap. No new look: it is the theme's button.
- **Fixed: a tab count shows the real number** [kpadopt-nav; Kenny's rule of 2026-10-03, every counter shows the real number]. `setTabbarBadge(tab, count)` no longer caps at `99+` (the `max` option is gone, also from js/tabbar.d.ts): 12 is 12, 1534 is 1534, and `data-kp-count` carries the same whole number. `.kp-tabbar__badge` sizes to its digits (`inline-size: max-content`, no clip, no ellipsis) and is anchored at its start edge out of the flow, so a wider number grows outward over the icon's corner and moves no neighbour.
- **Fixed: the review dialog dropped a pair Kenny had marked not approved from its list on reopening** [research/_review, kpadopt-nav round 1: "option 2 disappeared from the list when I reopened the page"]. A step that still had open pairs listed only those (`step.pairs.filter(isOpen)`), and a rejected pair is not open, so the row he had ticked (2 · The bottom tab bar) was gone with its note and the head read "1 already approved, not shown" for a pair that was not approved. A rejected pair now stays in the list, ticked, with its note, until a new round reopens it; only an approved pair leaves, and only those are counted as approved.
- **Changed: toasts and back-to-top rise by `--kp-tabbar-height`** (0px unless a tab bar is on the screen), so neither stands under the bar.
- **Fixed: the hover card is a rectangle of the theme's own corner in light, pastel and solstice** [kpadopt round 2; Kenny's "really oval" on research/kpadopt-tooltip-sort]. The card is a `.kp-tooltip`, and those three registers give a tooltip a pill radius (999px) because it holds one line; on a card of several lines that is an oval. Each now gives `.kp-tooltip[data-kp-hovercard-card]` the radius of its popovers and a little more room above and below.
- **Fixed: a group folded in forest played its rows' growth again and hid them** [kpadopt round 2; groupalways · forest]. Forest wrote a toast's arrival as its leave with `animation-direction: reverse`; a table row borrows the toast's entrance, and `js/motion.js` turns an entrance round by forcing `reverse`, which on an entrance that is already `reverse` turns nothing: the rows rose out of the ground and vanished. The arrival is now written forwards (`kp-sig-forest-arrive` on the growth curve, the same frames), so folding is the opening played backwards.
- **Fixed: a tag never wraps** [kpadopt round 2; kpadopt-controls toolbar · formal]. `.kp-tag { white-space: nowrap }`: in a theme that folds the width of what arrives (formal) the tag's width started at 0, its words wrapped to one letter a line and the tag, and the page under it, were 279 px tall until the arrival ended.
- **Fixed: the tab bar's More drawer has a way back** [kpadopt round 2; kpadopt-nav]. `js/tabbar.js` marks the drawer `data-kp-tabbar-drawer`: on a phone it leaves a dimmed strip of the page (`min(28rem, 100vw - 3.5rem)`), a press on the strip closes it, and so does a press on one of its entries (a link is still followed). Give the drawer's close button a glyph (`×`). A side drawer stays; no bottom sheet (research/kpadopt-nav/README.md).
- **Added: the heat grid, the matrix and the bar cell** [kpadopt2-grids; the dashboard's `bk-heat`, `fw-mx`, `mp-caps` and `mp-growth`; research/kpadopt2, formal first]. `.kp-heat` (js/heat.js `setHeat`, `attachHeats`, `setHeatPick`, `setHeatRows`): rows by columns of small cells toned by a state (`data-kp-tone` ok, warn, bad, muted, future, before, none, the month heatmap's words) or a value (`level` with `--kp-heat-level`), a label column whose names toggle (`data-kp-heat-toggle`), a column axis, a summary row filled from the bottom (`--kp-heat-share`), a legend (`.kp-heat__legend`, `.kp-heat__swatch`, `.kp-heat__ramp`), a picked column, a roving-tabindex keyboard, hover detail through the hover card, and a loading state made of the theme's own `.kp-skeleton--block`, so it keeps its footprint; empty and failed states. A state is told by a pattern as well as a colour. Events `kp-heat-pick`, `kp-heat-row`, `kp-heat-page`. `.kp-matrix` (`setMatrix`, `attachMatrices`, `setMatrixLit`, `setMatrixPick`): a cell per source and destination in a plate, a word and a glyph, `self` and `none` inert, a red ring for traffic stopped at the source, sticky headers that light a row and a column, one pinned cell, a rule marker (`data-kp-mark`), a scroll box under 36rem; events `kp-matrix-pick`, `kp-matrix-light`. `.kp-bar-cell` (js/barcell.js `setBarCell`, `attachBarCells`, `data-kp-bar`): the meter with its figure in a fixed column, tone from `warnAt`/`badAt`. New data table attribute `td data-kp-sort-value`: the value a cell sorts and range-filters by in place of its text (`data-kp-edit-value` still works). Strings `heatLoading`, `heatEmpty`, `heatFailed`, `matrixSelf`, `matrixUnknown`. Knobs `--kp-heat-*`, `--kp-matrix-*`, `--kp-bar-cell-*`. All 16 registers carry a block of their own (formal's is the one under review; the other fifteen are drafts until formal is approved).
- **Added: the hover card** [kpadopt-9; research/kpadopt-tooltip-sort]. `attachHoverCards()` in the new `js/hovercard.js` (also `@kp-soft/themes/js/hovercard` and the root export, wired into `js/auto.js` for `[data-kp-hovercard]`): one shared `.kp-popover.kp-tooltip` card, delegated from a root so anchors rebuilt after the attach keep working, its words from the `data-kp-hovercard` attribute or a `fill(anchor, card)` callback run when it opens. It wears every theme's tooltip look and entrance (it leaves as the entrance played backwards), sits under the anchor like a tooltip in its anchor does, flips above and stays in the window, can be entered by the pointer, closes on Escape and when its anchor is removed. `attachTooltips()` is unchanged. Pastel's pass plate is drawn on the card itself.
- **Added: plain-click multi-sort** [kpadopt-sort]. `data-kp-sort-multi="click"` (option `multiSort: 'click'`) on a data table: every plain header click, Enter or Space adds the column as a sort key (ascending, descending, out), Shift + click sorts on that column alone. The reset button and the summary line are the existing ones. The default (Shift adds) is unchanged. The React component is not changed.
- **Added: a group heading that stays** [kpadopt-groups]. `data-kp-group-always` on a data table's `tr[data-kp-row-group]` keeps the heading visible with no data row under it (rows still loading, failed, or none). Default unchanged.
- **Added: a list and its detail that folds on a phone** [kpadopt5-ops; Kenny, 2026-10-17: "Eén paneel tegelijk met een terugknop"; spec item 7]. `.kp-split--panes[data-kp-master-detail]` with `js/master-detail.js` extends the split with a list, a detail and an optional aside (`data-kp-pane="list|detail|aside"`), columns from `data-kp-pane-widths`, and a narrow behaviour by the layout's own width (`data-kp-fold-at`, 48rem): one pane at a time with a Back button (the default; also Esc and the browser's Back), `sheet`, or `stack`; the aside moves under the others below `data-kp-aside-fold-at`. Arrow keys change the selection without leaving the list, focus goes to the detail's heading and back to the row, the list keeps its scroll. The detail has the states `empty` ("Pick an item on the left"), `loading` (the busy card over the detail only), `error` (Retry) and `ready`, each filling the pane (`setPaneState`). New `js/state-plate.js` and `.kp-stateplate`: the centred, heading-size empty or failed plate every operations component uses. Strings `pane*`. Demo: research/kpadopt5-ops, formal only.
- **Added: the operations page frame** [kpadopt5-ops; spec item 6]. `.kp-ops` with `__head`, `__kpis`, `__attention`, `__toolbar` and `__body` fixes the order of a dashboard page (UI_PRINCIPLES section 3), the gaps and the 12-column spans (12 / 8 / 6 / 4 / 3, then 6 / 12 on a tablet and 12 on a phone by the page's own width), a toolbar that stays reachable (`data-kp-ops-sticky`), cards of one height per row, empty slots that take no room, two KPI tiles a row on a phone and header actions that move into the More menu (`data-kp-ops-wide` / `-narrow`). CSS only; demo in research/kpadopt5-ops, formal only.
- **Added: the automatic refresh chooser** [kpadopt5-ops; Kenny, 2026-10-17: "default 30 seconden, maar moet aanpasbaar zijn (dynamisch)"; spec item 8]. `.kp-refresh[data-kp-refresh]` with `js/auto-refresh.js`: "Every 30 s" (a menu or segments, plus Other… for any number of seconds, also `setRefreshInterval` from the consumer), the freshness line and Refresh now, a thin rule that runs down to the next refresh, `kp-refresh` for the app to read its data and answer `done(ok)`, modes `event` / `page` / `region`. A refresh waits while the tab is hidden (and runs once on return), a dialog is open or a field has the focus; a failed refresh keeps the data, says so with Retry now and backs off; R refreshes now; `data-kp-remember` keeps the choice. `Remembered` gains `refresh` and `notices`. Strings `refresh*`. Demo in research/kpadopt5-ops, formal only.
- **Added: the offline and reconnecting banner** [kpadopt5-ops; spec item 9]. `.kp-connection[data-kp-connection]` with `js/connection.js`: a page band (the theme's alert) under the navigation bar that takes no room while online and says what / why / what now when the connection is gone: "You are offline", the exact count of changes waiting, the time to the next try (3, 10, 30, 60 s), then "Reconnecting…" with the attempt number, "Connected again" for 3 s, and a destructive plate when the server refuses while the browser is online. `data-kp-connection-source` browser | app | both, a grace of 3 s so a short drop shows nothing, Retry now, `kp-connection-retry`, announced once per change (assertively on going offline). One height in every state; one line plus Retry now on a phone. Strings `conn*`. Demo in research/kpadopt5-ops, formal only.
- **Added: a transfer with its speed and the time left** [kpadopt5-ops; spec item 26]. `.kp-progress-group--transfer` with `.kp-transfer[data-kp-transfer]` rows and `js/transfer.js` extend the progress bar and group with `.kp-progress__rate` and `.kp-progress__eta`: the app calls `setTransfer(row, { done, total, at })` and the package works out the moving-average speed (5 s), the time left in coarse human words ("about 3 min left", "estimating…" for the first 3 s), "stalled for 12 s" after 10 s without a byte (a warning plate, no time left), "4.1 GB in 3 min 12 s" on a success plate when done (it stays 30 s), a destructive note with Retry when it fails, and "1.2 GB so far" with an indeterminate bar when the size is unknown. Columns shared by every row in tabular figures, folding to name, bar and numbers on a phone by the group's own width; 25 / 50 / 75 / 100 % announcements. Strings `transfer*`. Demo in research/kpadopt5-ops, formal only.
- **Added: the question card** [kpadopt5-ops; Kenny, 2026-10-17: "Kaart blijft met de uitkomst"; spec item 19]. `.kp-question` with `js/question-card.js`, from homelab's ask card: the question, one button per answer with what it sets in motion beside it (one shared column; under the button on a phone), "If nobody answers: Stop." and the time left as a rule that shrinks over the whole wait (or a ring, or words). States waiting, urgent (from 30 s, the time in bold, announced once), sending, answered ("Allowed. The operation goes on."), refused ("Not sent: why. Nothing changed; answer again.") and expired, where the card stays with the default's outcome (`expired: 'remove'` takes it away). `kp-question-answer` hands the app `respond(ok, why)`; keys 1 to n answer; each consequence is the button's `aria-describedby`; the tab title carries "(1) waiting". Several cards stack, oldest first. Strings `question*`. Demo in research/kpadopt5-ops, formal only, with every state frozen and a tickable look for the countdown.
- **Added: the notification centre** [kpadopt5-ops; Kenny, 2026-10-17: "Paneel met de nieuwste, plus de Inbox-pagina"; spec item 20]. `.kp-notices[data-kp-notices]` with `js/notices.js`: a counter with the exact unread number (never "9+"; none shows no number and the label "none unread"), a raised panel on the theme's opaque plate with the newest notices (worst first, then newest; 10 per severity, then "All 37 in the Inbox") and the same list as the Inbox page (`data-kp-notices-look="page"`) with a switch per source. A notice is what happened with its age, what it affects, what to do, Fix and Mark read; Mark all read, read state that survives a refresh, `data-kp-read="on-open"`, a quiet time in plain words with End quiet, the count in the tab title, keys `g i` and `m`, new notices announced once (critical ones assertively, optionally toasted). Loading, empty and failed fill the list's full height (busy card, large centred plates, Retry); on a phone the panel is a full-height sheet. Strings `notices*`. Demo in research/kpadopt5-ops, formal only.

## 10.1.1 — 2026-10-15

Released on Kenny's go (2026-10-15, form release-1011 "Nu uitbrengen, zonder suite"): a patch for two stylesheets a strict CSS parser refuses, found by JobTracker's Tailwind v4 build. No browser suite ran; the gates did, with the new CSS parse gate. The five known-noise tests of 10.1.0 (suite-noise-1011) wait for the next release suite.

- **Fixed: a comment in brutalism's register closed early** [comment-glob-1011; JobTracker, 2026-10-15]. The path `research/character-*/` in a comment ended it at `*/`, so the rest of the comment became part of the next selector: brutalism's tile-hover rule was dropped by browsers and Tailwind v4 refused the stylesheet. The path is now written `research/character-<name>/`.
- **Fixed: twenty-one empty entries in a cyberpunk selector list** [comment-glob-1011]. A hover-and-focus rule in css/cyberpunk-register.css listed `button, , summary, , …`; browsers forgive it inside `:is()`, a strict parser refuses the file. The empty entries are gone; nothing changes on screen.
- **Added: a gate that parses every shipped stylesheet** [comment-glob-1011]. `npm run check:css-parse` (part of `npm run gates`) parses each stylesheet the package ships with esbuild and refuses on any warning, so a comment closed early or an empty selector entry no longer reaches a consumer.

## 10.1.0 — 2026-10-15

Released on Kenny's go (2026-10-15 03:06, form release-go "Nu uitbrengen"; 03:26 "Eerst oplossen"). The release suite ran once (1638 passed, 60 failed, 4 skipped, 17.7 min); the 60 were fixed by cause (research/SUITE_10_1_0_CAUSES.md) and re-run alone: five remain, all known measurement noise, listed for 10.1.1 in docs/MINI_ROUNDS.md (suite-noise-1011). The screenshot approval check is skipped: every pair is approved and anchored at ad6d6ad1 (Kenny, 2026-10-15 01:21).

- **Fixed: a turned overlay is placed by its layout box, not by its bounding box** [scope-143, group 9 of research/SUITE_10_1_0_CAUSES.md; Kenny, 2026-10-15 03:26].
  Phantom's menus, lists and cards land a degree and a half askew (`rotate: -1.5deg`, 3eba5336, 10-13). `layoutRect()` in js/top-layer.js (used by
  `raiseInPlace()` and `placeBlockSide()`) measured the part's bounding rectangle, which for a turned box is larger: a 1227 px combobox list read
  1232 px wide and 32 px taller, so the list was placed 16 px above its field (`top` 633.3 px against 649.3 px; the gap under the input read -28 px)
  and 3 px too wide. It now sets the part's own single-angle `rotate` aside (about its `transform-origin`) before it sets the `translate` aside,
  so the list stands 4 px under its field at the field's width in every theme. Phantom's hard plate (4987a95d) moved no box: select list, nav dropdown, mega menu and menu
  items measure identical before and after it in Firefox. The failing select, nav-menu and choice-centre tests read the bounding box of a part that
  is askew by design.
- **Fixed: a closed over-the-page side navigation is off the screen in cyberpunk, synthwave, terminal and solstice** [scope-143, group 10]. These four
  keep the panel still (it is torn, climbed, printed or kindled in place, G3) and hid it with `visibility` only, so shut it stood on the screen at
  `translate: 0` (240 px wide). Shut, the panel now also carries `transform: translateX(var(--kp-sidenav-away))`, which takes effect after the close has
  played (`transform 0s` with the close's own delay: 480, 450, 816 and 480 ms) and is `none` the instant it opens; `translate` stays the clock
  js/sidenav.js reads for a pushed page. The opening and the closing look as before (the last frame on the screen is at 467, 450, 802 and 467 ms).
- **Fixed: a typed date is written back in the field's display format** [scope-143, group 12]. `13-09-2026` in a date field becomes `13/09/2026` when the
  field is left (`change`) or the calendar opens, in both channels (js/datepicker.js `tidy()`, components/flow.jsx); never while typing, and text that
  is not a date is left alone.
- **Fixed: cyberpunk's current log line no longer moves its cells** [scope-143, group 16]. The pointed-at line washed each cell with padding and a negative
  margin, which put the cell's box 4 px left of its column (289 against 293 for time, 353/357 source, 434/438 level, 512/516 message). The wash is now
  two hard shadows a quarter rem to either side: same paint, no box moves; a warning or error level on that line now has the same padding as on the
  other lines.
- **Fixed: pastel's tooltip hangs within 12 px of a hovered trigger** [scope-143; coordinator, 2026-10-15]. A hovered pastel button lifts 2 px (`translate`),
  and the tooltip's 12 px gap was measured from the lifted button: 14 px. A tooltip whose button is hovered takes `calc(0.75rem - 2px)`, so it rises with the button
  and the gap stays 12 px (all four tooltips of catalogue/overlays.html#tooltip: 12, 12, 12, 12; were 12, 12, 14, 14).

- **Fixed: phantom's cut-paper parts show their deep red second plate** [scope-143; Kenny, 2026-10-15 02:12, research/leftover-looks option 1 "one hard plate"].
  A card, a menu, a toast and a dialog are clipped by `--kp-paperclip`, and a `clip-path` also clips the part's own `box-shadow`, so the plate the
  register declared (G7) was never seen. css/phantom-register.css now widens the clip to take in the plate (`--kp-sig-ph-d`: 4 px on a card and a
  menu, 6 px on a toast, 10 px on a dialog) so the part's own `box-shadow` shows, and one pseudo-element fills the bottom-end cut (`::after`; the
  dialog's `::after` is its slash, so a dialog takes `::before`; a toast tone's corner follows the tone's plate through `--kp-sig-ph-corner`). The
  dot mask of an arrival and a leave no longer clips at the border box (`mask-clip: no-clip` on the four parts and on `[data-kp-leaving]`), so the
  plate is dots with the part while it is in the air. A card also takes `position: relative` (weakest rule), which is what the `data-kp-label`
  tag's `::before` was always placed against: a labelled card without `data-kp-reveal` had its tag clipped away. A menu or theme menu inside a surface
  (clip `none`) has no plate. Phantom-only selectors; no duration, curve or keyframe changed. Computed `clip-path`, `box-shadow` and the
  pseudo-element equal the demo's option 1 on all four parts at 1280 and 390 px; no horizontal overflow at 1280, 390 and 320 px.

- **Fixed: an old local answer no longer comes back in a copied prompt after the register entry was flipped by hand** [scope-143; Kenny, 2026-10-15 02:30]. Commit 58cf1601 set ten old deco and phantom rejections to approved but kept their `given` day, so a rejection still held in Kenny's browser from that same day counted as "given the same day or later" and outranked the register: it showed up as a new answer ("Not approved (1): Tables > Buttons in shared columns") in a review that never touched it. The ten entries now carry `given: 2026-10-15`, `newer()` in `catalogue/verdict-age.js` documents the rule (a hand-edited register verdict must move its `given`), and `gates/verdict-age.test.mjs` pins it. Measured in Firefox with the old rejection seeded: the prompt carried the line before, and is empty now.
- **Changed: deco's menu inlay starts drawing under the button that opened it** [scope-143; Kenny, 2026-10-15 02:30, research/leftover-looks]. `placeMenu()` in
  js/menu-button.js writes `--kp-menu-anchor-x` on the open menu (the button's centre in px from the menu's left edge, kept 14 px inside it) for every
  theme, and removes it when the menu closes; css/deco-register.css reads it as `--kp-sig-deco-at: var(--kp-menu-anchor-x, 50%) 50%` on
  `.kp-menu-button > .kp-menu`. A menu that flips above its button gets no property and keeps the middle of its top edge. The close is still the open
  played backwards (0.0 % off over 20 frames in Firefox at 1280 and 390 px, buttons at the start, middle and end of a bar). Open and close durations in
  formal (620 ms), cyberpunk (480 ms), forest (1000 ms) and deco (480 ms) are identical before and after.
- **Added: the React `DatePicker` follows rule 52 too, with a `dateFormat` prop** [datetime-M1; Kenny's go for 10.1.0]. `components/flow.jsx` called `parseDate`, `formatDate` and `datePattern` with their default `'locale'` format, so it wrote, hinted and read in the reader's order. It now defaults to `dateFormat="rule52"` (dd/mm/yyyy whatever the locale) and `dateFormat="locale"` brings the reader's own order back, the same option as `attachDatePickers(root, { dateFormat })`. The placeholder, the typed text, a picked day and `min`/`max` all follow it; the ISO value passed to `onChange` does not change.
- **Fixed: the network graph's loading picture is the ghost of the network** [Kenny's go for 10.1.0, leftover 3; PACKAGE_FINDINGS 2026-10-06].
  js/graph.js drew one grey ellipse while loading. It now draws the coming network: the last drawn nodes and links, or a hub with a ring of six
  when nothing was drawn yet, in the package's own `kp-graph__edge`, `__node`, `__ring` and `__core` classes (so each theme's settled shape draws
  it), inside `g.kp-graph__ghost[aria-hidden]` (45 % opacity, `kp-pulse` breath under motion; `--i` per part and `--n` on the group for a
  register's staggered motion). `.kp-graph__skeleton` is gone. Kenny's decided per-theme loading pictures (research/character-graph/decided.json,
  `data-cg-loading`) live only in that demo's research stylesheets and are not in any register; this is the minimum they need, not their port.
  The ready graph is untouched: its SVG markup is identical before and after in all 16 themes at 1280 and 390 px, and the screenshot of the
  graph is byte-identical in 15 themes (synthwave's own glow differs between two runs of the same code).
- **Checked, nothing to fix: forest's small motion strays F-15, F-25, F-33, F-34** [Kenny's go for 10.1.0, leftover 4]. Measured in Firefox: the
  prose link's underline colour and thickness take 200 ms on `--fx-ease` and the dash turns solid at once (F-15); the dialog backdrop plays the
  1000 ms growth curve (F-25); the calendar's busy card grows in 1000 ms and closes as that growth reversed, 1000 ms, frame for frame within one
  frame of lag (F-33); the tick, the meter's wipe, the drawer's edge and the section rule run from the inline start on a right-to-left page, and the
  headline grows vertically (F-34).
- **Fixed: phantom's focus settles its animations** [Kenny's go for 10.1.0, leftover 5; tests/focus-visible.spec.mjs:136]. A focused bar link
  (`.kp-nav__links > li:focus-within > .kp-nav__link::before`) and every hovered bar, tab, menu entry and key-figure label kept
  `kp-sig-phantom-bar` finished but held by `animation-fill-mode: both`, so `getAnimations()` still listed one finite animation on the focused
  link for ever (the test waits for none). The rules now fill `backwards` and state the solid face themselves (`mask-image: none`, the animation's
  last frame). Per-frame computed `mask-image` and `width` of the bar on hover and on Tab focus, and of the button's `::after` on hover, run through
  the same states before and after; animations on the focused link: 1 before, 0 after.
- **Removed: cyberpunk's dead `kp-charge` rule, keyframes, knob and timing row** [Kenny's go for 10.1.0, leftover 6]. The hover rule on
  `.kp-button:hover:not(:disabled)::after` never played (`animation: none` in `kp.signature` wins), the keyframes with it, the `--kp-charge` knob,
  the `TIMINGS` row in js/effects.js and the gate's motion description. themes/cyberpunk/signature.json (idea, two claims, hover description and its
  proof, two answers) and themes/cyberpunk/CHARACTER.md (hover row, G8, G17, the base-element row) now describe what plays: the circuit grid on the
  face and the edge ring closing in over four steps (`--kp-cp-t`, `steps(4, jump-end)`, 180 ms), nothing lifts and nothing sweeps. Measured in
  Firefox on the plain and the primary button, 11 paused frames (0 to 800 ms) of the hovered button, its `::before` and `::after` (animation name,
  transform, clip-path, background, shadow, colour): identical before and after (one sha256 over all frames).
- **Fixed: a dialog, a drawer or an arriving part whose register animates a custom property is replayed whole** [Kenny's go for 10.1.0;
  formal's package finding 1]. `rememberEntrance()`, `arriveAsReversedLeave()` and the leave of an entrance part replayed
  `effect.getKeyframes()` with `Element.animate()`, and Chromium leaves the keyframes of a custom property out of `getKeyframes()`, so a
  `--x` the register animated played nothing when the entrance was turned round (the dialog stood still for its whole close). js/motion.js
  now keeps a copy of the effect (`new KeyframeEffect(effect)`, which carries every keyframe, the custom properties included, and the
  pseudo-element) and plays that. Measured on a dialog ruled by a registered `--t` over 740 ms, 21 frames of the open and the close: Chromium
  stood at 1.00 before and now runs 0.00 to 1.00 and back; Firefox is frame for frame the same before and after. The open/close pair meter
  on formal, dark, cyberpunk and forest (Firefox) reads the same animations, durations and worst-frame differences before and after.
- **Added: `--kp-lines: keep`, a part is played line by line** [Kenny's go for 10.1.0; formal's package finding 2]. A register that rules a part
  frame first and then its lines (each with its own wait) says `--kp-lines: keep`. Then (a) a dialog's close and open play every kept
  entrance with its own time and wait, the whole turned round and scaled to the theme's close time (`turnLines()`: the line that came in last
  goes first; frame t of the open is frame close - t of the close), instead of every entrance in one duration with no wait; (b) an exit, and
  an arrival as the leave played backwards, read every line inside the part that ends (`exitsOf()`: the part's own animations and those of its
  lines, each on its own element with its own delay), so a part is gone only when its last line is, and its arrival is the same timeline
  backwards. The shade behind a dialog (`::backdrop`) is no line: it takes the whole time as before. A line that never ends
  (a spinner, a caret) is left alone. Only formal says it (below); every other theme plays as before. Proof on a synthetic card with three lines waiting 100, 200 and 300 ms: with the token its arrival frames are its leave frames reversed (21 of 21, both
  engines) and it leaves after 627 ms (Chromium 597), without it after 413 ms with the lines cut, as before.
- **Formal's tour card takes its lines' waits round with it** [scope-143]. The tour closes through `playEntranceBackwards()`, a CSS reversal in
  which a reversed animation waits its delay first, so the card's ruled lines (waiting 0, 60, 120 ms) closed 7.8 % off their opening's mirror.
  Formal's register now gives each line and pen of the card, in `[data-kp-reversing='play']`, the delay that mirrors it (the 740 ms span minus
  the line's end: 340, 280, 220 ms and 180, 120, 60 ms for the pens, 180 ms for the top edge); the pair meter reads 1.0 % again, as before.
- **Added: `--kp-update-time`, a register says how long its live update lasts** [Kenny's go for 10.1.0; formal's package finding 3].
  `updateTiming()` (js/update.js) takes the register's `--kp-update-time` when it is set (a time, read where the element stands, played as
  fast or slow as `--kp-motion-scale`), and otherwise the dialog's close or resize time times 1.25 as before; `updateTimingOf()` takes it as
  `time`. All sixteen themes read the same update time before and after except formal, which now says `850ms`: its update was 925 ms (the
  dialog's 740 ms times 1.25) while the register, its character document and the approved demo (research/character-kpi) are 850 ms, so the
  first rule now takes 400 ms (47 %) as drawn, not 435 ms. The frames are the same fractions of a shorter time.
- **Added: `--kp-menu-count`, a register can count the lines of a menu** [Kenny's go for 10.1.0; formal's package finding 4]. js/menu-button.js
  writes the number of lines a menu has (`menuLineCount()`: its children, the groups `setMenu()` drew or the entries of a menu written by
  hand) on the menu when it is wired, filled and opened, and on the popover that holds a `.kp-menu` when the menu buttons are attached.
  Formal's menu button drops seven `:has(> :nth-child(k))` rules for one (`max(1, min(var(--kp-menu-count, 1), 8))`; its ninth and later
  lines are still ruled with the eighth); a menu of 2 groups, 1 group and 10 entries opens and closes in the same 620, 560 and 980 ms with
  every frame identical. A popover's menu keeps its `:has()` rules, which need no script.
- **Fixed: the plain calendar no longer scrolls sideways in a 334 px pane** [Kenny's go for 10.1.0; package findings re-check]. The grid's
  deliberate overhang (`inline-size: calc(100% + 2 * gap)`, moved by a relative `inset`) left its box 12 px (brutalism 18 px) past the
  calendar, and Firefox counts the unshifted box of a relative offset, so a pane with `overflow: auto` read `scrollWidth` 346 (352) in 334.
  The box is now moved two gaps toward the start with `translate` and its `thead` / `tbody` one gap back, mirrored on a right-to-left page:
  the box ends at the calendar's edge, every day's rectangle is the same to 0.1 px (42 cells and the weekday row, 16 themes, left-to-right and
  right-to-left), and the scroll width is 334 in 15 themes. Forest's today leaf (a corner ornament 3 px outside its cell) still reaches 339
  when today is in the last column; it is drawn that way and left.
- **Fixed: the React theme list closes as it opens** [package findings re-check]. `components/theme-switcher.jsx` removed the list at once
  (gone in 15 to 17 ms in every theme). It now stays until `playClose()` of js/motion.js (the close of the framework-free menu and every
  menu button) has played the opening backwards, and takes no focus or pointer meanwhile; opened again, it turns round. Dark 873 ms open /
  867 ms close, cyberpunk 469 / 465, pastel 561 / 567, blueprint 784 / 799, forest 1000 close; themes whose list has no opening of its own
  still leave at once, as they arrive.
- **Added: a busy button's words have their own element** [package findings re-check]. js/forms.js writes the busy words of a submit button
  into a `span.kp-button__label` (the element the React button already has) and the React form does the same, so a register can style the
  words alone. Nothing visible changes: a busy button in five variants per theme is pixel-identical before and after in all 16 themes;
  phantom, whose label stands upright, keeps its busy words leaning with the button as before.
- **Fixed: dark's pass starts at the right edge of a right-to-left page** [package findings re-check]. The mask, the line, a figure's film
  and a small part's clip were physical left to right. Five custom properties (`--kp-sig-dk-s`, `-from`, `-end`, `-gdir`, `-cut`) now carry
  the direction, turned by `:dir(rtl)` (and back inside a `[dir]` island); the close is still the same frames reversed. Left-to-right pages
  are pixel-identical (8 frames of a menu's open and close); on a right-to-left page the line runs right to left with the panel laid behind it.
- **Fixed: blueprint's menu closes as its open drawn backwards in the research menu demo** [fix-114; the new assert in
  tests/review-kit-dialog.spec.mjs]. The package already closes the menu with the register's own exit (`[data-kp-closing]`, the trace
  drawn backwards); the demo's Close then cleared the menu's animation for a frame to restart its own leave, which ended the animation the
  package was waiting for, and the menu was hidden after two frames (about 90 ms, no animation running, inset and width reset). The demo
  now leaves a running exit alone when its own leave names the same keyframes and time (blueprint's only), and marks the leave
  (`data-mb-leaving`). Measured per frame in Firefox, Open then Close through the review dialog: blueprint 3 frames, no running reverse,
  to 50 frames, the trace running backwards for about 870 ms; the other 15 themes unchanged (within 40 ms of their earlier time).
- **Fixed: deco's seal plays whole on a quick tap** [package findings re-check]. The ring (`kp-sig-deco-seal`, 400 ms) ran on `:active`, so a
  tap shorter than 400 ms cut it where the pointer lifted. js/effects.js has a third answer to a press, `--kp-press: hold`: the pressed part
  carries `data-kp-pressed` for `--kp-press-hold` (400 ms here) from the pointer or Space or Enter going down, and the register keys the
  ring on `:is(:active, [data-kp-pressed])`. Measured in Firefox on a button, the ring was visible 50 ms (a 60 ms tap) and 134 ms (150 ms)
  against 166 ms for a held press; now 166 ms for all three. The sink and everything else are unchanged.
- **Fixed: a waiting deco button keeps its label readable under reduced motion** [package findings re-check]. The doors stood parted by a
  third, which covered 43 % of the label of a 128 px button (the doors cover two thirds of the button). A busy `.kp-button` now stands with
  them parted 2.5 thirds: 0 % of the label covered, about 10 px of each door left at the plate's ends. Other waiting parts are unchanged.
- **Fixed: the destructive item of the row menu shows its keyboard focus in formal and phantom** [Kenny's go for 10.1.0; triage of the 10.0.0
  suite, tests/dashboard.spec.mjs:255 and :291]. Formal's red edge bar is an `inset` box-shadow and it outranked the shared two-channel
  ring, which is a box-shadow too, so the keyboard saw only the paper-coloured outer half (an almost invisible mark): the entry now keeps
  the bar and the inner navy ring together, as every other entry of the menu shows it. Phantom's destructive entry is a red plate and its
  focus ring stands inside it (`overflow: clip`): the dashed red ring was red on red and the black contrast ring was clipped away. On this
  plate the dashes take the plate's ink (black) and the hugging ring is an inset line in the surface colour; every other part is unchanged.
- **Fixed: the key-figure block of catalogue/data.html no longer chases itself at phone width** [triage of the 10.0.0 suite, row 26]. Its
  line under the buttons was rewritten with the same words on every change of the strip, and `attachKpiStrips()` writes the strip's column
  count twice while a label does not fit (the trial count, then the one that fits), so at 390 px the two heard each other about 500 times a
  second (a press on a count took 1 to 6 s, the test 79 s). The line is written only when its words change (catalogue/demos.js); 7 s now.

- **Fixed: a destructive menu entry keeps its ink** [Kenny's go for 10.1.0; package findings re-check]. `.kp-menu__item--destructive` came before
  `.kp-menu__item` and its hover in kp.components, and their `color: inherit` cancelled it, so in every theme whose register does not restate
  the ink (synthwave, pastel, blueprint, solstice, titanium, grotesk, forest, terminal, cyberpunk) "Delete" read like every other entry. The
  rule now follows them and holds under the pointer too; the registers that restate it are unchanged.
- **Fixed: synthwave's buttons no longer measure 4 px of overflow** [package findings re-check]. The sun cut's two slits reached 4 px past the
  padding box with `left` / `right: -4px`, which is scrollable overflow, so every `.kp-button` read `scrollWidth` 4 px over `clientWidth`
  (a label that looked cut). The slits now span the padding box and reach the same 4 px with a side shadow: the paint and every button's size
  are unchanged. Blueprint's buttons still measure 28 px of `scrollHeight` over `clientHeight`: that is the pointing scale and the dimension,
  decorative boxes drawn below the part, and no label is outside its button.
- **Fixed: cyberpunk's rich menu entries carry the dash on the title's line** [package findings re-check]. A rich entry is a grid, so the
  `::before` dash (and the TARGET tag of a destructive entry) was a grid item on a row of its own, 25 px (destructive: 19 px) taller than
  the entry needs. The prefix and the label now share the first row and the hint runs under both.
- **Removed: light's dead blueprint grid (T6) in css/\_rules.css** [package findings re-check]. The light register switched the grid off
  (`--fx-texture: none`), so nothing of it was visible; the source block, and its copy in css/themes.css and the minified files, are gone.
- **Fixed: the tour's dim covers a later sibling in plain block flow** [package findings re-check]. `[data-kp-tour-target]` set `z-index` on a
  part with no position, which does nothing, so the dim (the part's box-shadow) was painted under every later opaque sibling in normal flow
  (formal, forest, light: the part below the target was not dimmed at all). A target with no position of its own is now `position: relative`
  (`:where()`, so every rule that positions a part wins).
- **Fixed: blueprint's construction line no longer makes room that is not there** [Kenny, 2026-10-14; triage of the 10.0.0 suite, fault 1]. The
  trace `::after` of the toast, date picker, palette, tour card, bar menus and the other traced panels kept `inset: -9px` after the pen
  had lifted, so a panel with `overflow: auto` scrolled by 9 px (the table's filter menu: scroll width 177 in 168) and a panel at the
  window's edge widened the page (320 px: 329). The box now runs 9 px outside the panel only while the pen draws (`--kp-bp-ink` 0) and rests
  on the panel when it is inked; the drawing is the same frame for frame.
- **Fixed: the frozen toast of the showcase pages is its own positioning box** [Kenny, 2026-10-14; triage of the 10.0.0 suite, fault 2]. The
  specimen carried `position: static` inline, which beat the registers' `position: relative`, so the toast's pseudo-elements were placed
  against the page: pastel's plate and pass went 6 px past a 320 px window (page 327) and were never drawn at the toast, blueprint's dimension
  line sat at the top of the page. The specimen (showcase/specimens.mjs) is now `position: relative`, as every toast in a register is.
- **Fixed: formal's calendar nav in a 334 px card** [Kenny, 2026-10-14; triage of the 10.0.0 suite, fault 3]. September in formal's small
  capitals and the three buttons need 342 px, and the package's 20.5rem let the card hold them on one row with Today 7 px outside it.
  Formal sets `--kp-calendar-nav-fit: 21.5rem`, so below 344 px the title takes a row of its own, the same row in every month, as in the
  other themes; the wide calendar is unchanged.
- **Fixed: nostromo's key-figure tile keeps one height in every state** [Kenny, 2026-10-14; triage of the 10.0.0 suite, fault 4;
  tests/kpi-columns.spec.mjs:115, fix-101]. In a narrow tile (a 334 px pane gives a 127 px content box) Michroma's "412 m³/h" or "1,834 kWh"
  did not fit beside its unit, so the unit dropped to a second line (css/nostromo-register.css, the `.kp-kpi__value` rule: 17.7 px), while
  a skeleton or a dash never wraps: 121.2 px loading or empty, 138.9 to 139.4 px drawn. In a tile with a content box of 140 px or less the
  figure now takes a 6.5th of that width at most (never above `--kp-kpi-value-size`) and its box keeps the height of a full-size line, so
  the figure and its unit stay on one line and the tile is 121.2 px in every state; the tile's mono change tape has `line-height: 1`
  so it no longer adds 0.5 px to the trend line. Tiles wider than that are untouched.

- **Changed: the edge tab is the side navigation's default opener** [Kenny, 2026-10-14; sidenav-opener-1]. With no `data-kp-sidenav-opener`
  (or any value but `launcher` / `both`), an `over` or `push` panel behaves as `"tab"`: the tab shows, the launcher is not drawn and the
  header and page room for the launcher is given back, on the first frame too (the pre-JS rules follow). A page with no `.kp-sidenav__tab` for the
  panel keeps its launcher, so a panel never loses its opener. Write `data-kp-sidenav-opener="both"` for the old markup-decides result on a page
  with both elements. `side` mode and the collapsed rail are unchanged.

- **Added: the side navigation chooses its opener** [Kenny, 2026-10-14; sidenav-opener-M1; research/sidenav-opener]. `data-kp-sidenav-opener="launcher" | "tab" | "both"`
  on the panel (React prop `opener`) says which of the fixed launcher and the edge tab an `over` or `push` panel shows, with or without
  `data-kp-sidenav-reserve`. The box the choice turns off is not drawn (`data-kp-sidenav-opener-off`, `display: none` in the layout layer, none on the first
  frame by the markup alone), and the panel's header gets the launcher's room back when only the tab shows (`data-kp-sidenav-launched` is written only
  while a launcher is). Its default is the edge tab (see the change above). `side` mode and the collapsed
  rail ignore it.
- **Fixed: a key figure's label is never cut** [kpi-label-cut-M1; Kenny, 2026-10-14]. A plain tile's `.kp-kpi__label` wraps between words (a
  word longer than the tile breaks) instead of ending in an ellipsis; the trend tile's label next to its corner link does the same and stops
  before the link (4.5rem, 2.25rem in a narrow tile; nostromo's register keeps that room), with two label lines kept so a row of trends stays one
  height. The label of a tile in a strip with columns keeps its one line (fix-101). Measured in Firefox on catalogue/data.html in 16 themes at
  1280 and 390 px: 288 plain labels and 768 trend tiles (also at a forced 148 px) with none cut, none under the link, one height inside a strip.
- **Changed: the date picker writes dd/mm/yyyy for every reader** [datetime-M1; rule 52]. Its field, placeholder and typing are day first with
  slashes whatever the locale (en-US used to write `09/04/2026`, de-DE `04.09.2026`); month and weekday names still follow the locale. New:
  `data-kp-date-format="locale"` (and the `dateFormat` option of `attachDatePickers`) keeps the locale's own order; `formatDate`, `parseDate` and
  `datePattern` in js/locale.js take the format as a last argument. gates/datepicker-format.test.mjs.
- **Closed, already built: header-menu, kpi-meter, kpi-spark, counts-exact, port-spec** [docs/MINI_ROUNDS.md]. Each measured once in Firefox on the
  catalogue and closed with its numbers.

- **Fixed: the review of research/all-themes-applied, round 2** [Kenny, 2026-10-13 20:37]. The side navigation and the alarm open and close
  with each theme's own dialog effect in every theme (they slid, faded or rose with the package's motion in ten themes); pastel's bar, palette,
  pickers, menus, alarm and side navigation take pastel's sheet; dark's alarm runs the pass; grotesk's Equipment hover draws the straight rule;
  forest's tour dim no longer flashes green on a card; phantom's loading pictures stay inside their part (they covered the screen) and its
  combobox list lands askew in the right place. Round 3 opens with a reference block, the theme's own dialog (lessons 50, 51).
- **Added: the side navigation at the window's edge, with a launcher** [Kenny, 2026-10-13; research/sidenav-edge]. `.kp-sidenav__launcher` is a box
  fixed at the window's start corner holding the panel's toggler (a `.kp-icon-button` with `data-kp-sidenav-toggle`): always in the same place, above
  the panel, with the package's three bars (`.kp-sidenav__bars`, put in an empty toggler) and its name from the strings. The panel it drives is marked
  `data-kp-sidenav-launched` and starts its header beside the launcher, so the launcher never covers an item; the box is lit
  (`data-kp-sidenav-lit`, the accent plate) from the opening's first frame to the closing's last; `data-kp-sidenav-launcher-room` keeps a page
  element in the launcher's corner clear. Three variants by attribute: `data-kp-sidenav-mode="push"` with `data-kp-sidenav-content` pushes the
  content by the panel's width, now moving with the panel (js/sidenav.js copies the panel's own slide timing onto the content as
  `--kp-sidenav-shift-duration`, `-ease`, `-delay`; a register that draws the move wins); the same plus the new `data-kp-sidenav-reserve` keeps a
  gutter as wide as the panel, open or shut, so the panel covers nothing; `data-kp-sidenav-mode="over"` with `data-kp-sidenav-backdrop="false"`
  slides over the content. A launcher is never hidden by `data-kp-sidenav-over-below`, and a reserve gives way while that has made the panel narrow.
  Every theme's own side-navigation motion runs unchanged; pair meter (Firefox) on formal, forest, cyberpunk, nostromo, titanium and dark: every
  variant's close is its open backwards.
- **Added: the side navigation's options from other libraries** [Kenny, 2026-10-13 19:47; research/sidenav-edge/OTHER-LIBRARIES.md]. A shut
  `over` or `push` panel is `inert` (`data-kp-sidenav-inert`, default on). The collapsed rail shows each item's label as the package's tooltip
  (`data-kp-sidenav-rail-tips`, default on) and opens a group beside the rail as a floating `.kp-popover` with the theme's popover effect, its
  close the opening backwards, on hover intent, a press or the keyboard (`data-kp-sidenav-flyout`, default on; `data-kp-sidenav-flown`
  written). `data-kp-sidenav-slim-below` collapses the rail at a width the page names. `data-kp-sidenav-shortcut` toggles the panel with a key
  chord (`Control` is ⌘ on a Mac; `aria-keyshortcuts` on the togglers). `data-kp-sidenav-initial-focus` names where the focus lands on
  opening. `data-kp-sidenav-hover-delay` (150 ms) makes an expand-on-hover rail wait for a resting pointer, and the rail also widens on focus
  (`data-kp-sidenav-peek` written; its words stay while it narrows, so the narrowing is the widening backwards). `.kp-sidenav__tab` is an
  edge tab that rides on the panel's far edge. A push panel on the end edge now moves the content's end margin, not its start.
- **Fixed: the review of research/all-themes-applied, round 1** [Kenny, 2026-10-13 18:19]. Every tour: the card no longer drops into the
  page on a step (the flash and the jump, `.kp-tour` fixed in every state), the page stays dimmed on a target with its own shadow or a cut
  corner (`--kp-tour-dim`, lesson 48). Blueprint's tour traces in and back and its busy month shows its compasses; brutalism's veil lets
  the page read through; titanium's side navigation has no colour splash; deco's bar opens by the approved inlay and both lift doors
  close; solstice's decided kindled dome is built for every part that opens; grotesk's phone links stand in one column. Back-to-top
  scrolls the box it sits in (js/components.js); the review kit no longer animates its mirrored controls and lets a part on stage take
  its own Escape.
- **Changed: every other theme, the cyberpunk faults kept out** [Kenny, 2026-10-12; research/all-themes, Firefox]. In formal, light, dark, synthwave,
  terminal, blueprint, solstice, brutalism, deco, phantom, grotesk, nostromo and titanium every part that opens or arrives (command palette, date
  picker, combobox, menus and popovers, the bar's dropdown, mega menu and phone panel, the tour with its dim and ring, the alarm, the calendar and table
  busy layers) runs the theme's own effect, and its close is that open played backwards (20 to 21 of 25 pairs per theme; the rest are state changes or
  decided, listed in research/all-themes/README.md); pastel takes the shared mechanism only. Keyboard focus is visible on every stop: the selected tab
  (grotesk, nostromo), grotesk's switch and synthwave's slider drew nothing. The focus returns to the opener when a date picker or side navigation has
  closed, not at the start of the close (js/datepicker.js, js/sidenav.js); a turned popover's closing copy sits where the popover was (js/motion.js). The
  review kit asks a section only in the themes it names (`data-review-themes` on a section). Lessons 41 to 47 in docs/THEME_LESSONS.md.

- **Changed: cyberpunk, the review of 2026-10-12 (round 2)** [Kenny, research/cyberpunk-applied]. The command palette and shortcuts open and close by the channel
  split (they had only the plate shape), the phone bar panel and its toggle play it with text ghosts and a mirrored close, and an identity audit
  (`research/cyberpunk-applied/_audit/identity.mjs`, animation names printed by `gates/measure-pairs.mjs`) now fails a pair that does not run the theme's signature.
  The alarm's Acknowledge button reads 5.29:1 again (a `background:` shorthand had tiled the notch line over it). A tree row keeps its inset in every theme
  (`--kp-tree-inset`, default 0.375rem, css/components.css; cyberpunk 0.5rem). Calendar days and alerts have a neon variant with 8:1 to 15:1 text.
- **Changed: cyberpunk, the audited rows A-H mended** [2026-10-12, research/cyberpunk-applied/_audit/MISSING.md, Firefox]. Keyboard focus: the clock reset
  on buttons is `:where()`, so every button draws the four closing brackets; hover, focus and press (split edge, brackets, closed circuit) reach tabs,
  pagination, icon buttons, options, tree rows, sort heads, checks, switches, fields, selects, nav links and days; `--fx-lift: 0px` stops the lift. Leaving:
  a table busy layer, upload row, empty state, tree branch, tabs swap, alert re-show and calendar busy layer arrive and leave as the channel split
  (`--kp-leave-state`, `--kp-arrive-unseen`, `--kp-leave-fold-grow`, `--kp-leave-fold-start`, `--kp-leave-fold-ease`, `--kp-swap-fold-ease`,
  `--kp-calendar-busy-leave`, `--kp-accordion-size: own`; every one set by cyberpunk only), the accordion opens in 8 ticks. Shape: plates take the 14 px
  notch, controls 8 px, small parts a share of their height; the navbar is a holo plate that arrives and leaves by the channel split. Type: prose is
  Rajdhani, labels carry `//`. Waiting: one picture per busy part (bars with the glitch copy, the word LOADING), no `kp-pulse`; contact transitions are
  `steps(3)` ticks. The divider (8 s) and marquee (18 s) loops are recorded as decided exceptions (themes/cyberpunk/CHARACTER.md). A busy layer arrives with its siblings, not 240 ms behind them (`--kp-arrive-turn: siblings`, js/motion.js).

- **Changed: cyberpunk, the open/close pairs of the audit, every close its open reversed** [2026-10-12, research/cyberpunk-applied/_audit/MISSING.md]. The date
  picker, combobox, theme menu, row-actions popover, palette, desktop dropdowns and the phone bar open by the channel split and close as that reversed (480 ms);
  the tour card, its ring and dim, the alarm, the dialog backdrops and the side navigation (panel, backdrop, pushed content) follow, in four ticks each way.
  Shared code moved only behind tokens that cyberpunk alone sets: `--kp-nav-close-time` (js/components.js holds a hover dropdown in Firefox),
  `--kp-tour-dim-time`, `--kp-tour-dim-close-ease` and `--kp-tour-dim-close-delay` (css/components.css) and an inert `data-kp-sidenav-shift` (js/sidenav.js);
  every other theme computes what it did.
- **Changed: forest, the CSS-only rows of the audit** [2026-10-12, research/forest-applied/_audit/MISSING.md rows 6-8, 11, 13-23, 25]. Prose is in the body face (the
  alarm's detail, hint, countdown and button, the error page, platforms, health, status lines, truncated cells, microlabels); the busy table shows the planting row
  alone; a pressed plain or ghost button keeps its plate (ghost words 4.35:1 to 6.7:1); the phone toggle's tint follows `aria-expanded`; the leaf corner on the
  code block, date picker title, key figure value, log level, mono chip and palette keys; one swatch shape (the part leaf) and the sort-order pill; hover blaze on a
  calendar day, the month title, a sortable header and a tag's remove button; the press closes the blaze on rows, checks and switches; one-channel focus rings
  on the tile link and the palette link; the alarm's backdrop fades on the growth curve; the phone bar's links fade in the growth time; `outline-style` and the
  progress bar's head use the register's curve. The marquee's 48 s loop is a decided exception (CHARACTER.md).
- **Changed: forest, the motion rows of the audit, every close its open reversed** [2026-10-12, research/forest-applied/_audit/MISSING.md rows 1-5, 9, 10, 12].
  The busy table's layer, the table's empty state and an upload's file row leave before they go (open and close 1000 ms, mirror within 6 %); a
  tab switch grows the new panel while the old one withers (1000 ms in all, not 2000); a tree branch's children glide open and shut on the growth
  curve; a dismissed alert arrives again when it is shown; the tour's ring and dim withers as they were drawn (14.4 % off to 2.2 %); the space a
  leave folds takes the growth time (1000 ms, not 1583). Shared code: `js/motion.js` gains `leavesState()`, `arriveShown()`, `glideGroup()` and
  the tokens `--kp-leave-state`, `--kp-leave-fold-grow`, `--kp-leave-fold-start`, `--kp-arrive-unseen`; `css/components.css` the token
  `--kp-tour-dim-close`. Every one is set by forest alone, so no other theme changes. The calendar's busy pair (open 1000 ms, close 1820 ms: the days
  grow in turn when the data arrives) is a decided exception (CHARACTER.md).
- **Fixed: menus placed under their button in every theme, and a capped arrival queue** [2026-10-09]. `js/top-layer.js` `layoutRect()` measures a
  box without its growth translate, so the menu button's menu, the drawn select and the date picker open at their trigger even when a theme grows
  them from its edge (forest opened them about one menu height too low); `js/motion.js` `inTurnGap()` caps a row of three or more items arriving or
  leaving one by one at about 600 ms in all.
- **Changed: forest, straightened, as Kenny decided it on research/forest-uniformity** [2026-10-09, themes/forest/CHARACTER.md]. The bar's dropdown,
  mega menu and phone menu grow out of the bar and close as that growth reversed; the palette, date picker, theme list, combobox list, tour and
  side navigation grow like their family and every backdrop fades on the growth curve. Every pointable part, field and row blazes (tabs, crumbs
  and pages answer as links), focus is the two-channel ring everywhere. The tick and radio dot are set and cleared as mirror images, the alarm
  grows like the dialog with a growth ring instead of the glow, one loading picture per panel, one 6.6 s breath for everything that waits, the
  leaf corner on the last small parts. Fixes: pressed primary and destructive button contrast, growth clip past its anchor, one-channel focus
  rings, a double plate in popover menus, monospace crumbs and pages, right-to-left rule, meter and alert edge, DI5 table rows.
- **Changed: deco's grammar, as Kenny decided it on research/deco-character** [2026-10-09, themes/deco/CHARACTER.md]. Plates are lacquer with
  the wallpaper and coved corners; the inlay draws itself on opening and the close is its reverse; a great fan leaves and arrives; lift doors
  wait; the progress bar is the doubled inlay; hover is gold leaf, a press is a seal, focus is a double gold ring, a live update is gilded;
  `fx-ease` is the settle curve `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Changed: dark's grammar, as Kenny decided it on research/dark-character** [2026-10-09, themes/dark/CHARACTER.md]. Every opening is a pass
  left to right over the part's own box and the close is the pass back; loading is a comet on every waiting surface and the busy bar, the
  spinner is five spectrum bars; a live update is one pass over the figure (`--kp-update: pass`), a warning is the film gone coral; hover rests
  a 2 px film line, a press turns the film edge a quarter; `fx-ease` is the settle curve. Removed: the develop flash, the misregistration
  ghosts, the two-wavelength resolve, the tone swell, the darkroom resize.
- **Changed: phantom's grammar, as Kenny decided it on research/phantom-character** [2026-10-09, themes/phantom/CHARACTER.md]. The shove and
  its inverse on every travel; one 700 ms throw that resolves from halftone dots (dialog, toast, menu, popover, dropdown, tour, drawer,
  headlines), the leave as its inverse, a closed part never drawn; a fixed 14 px corner cut; a warning is the yellow overprint, a failure the
  red plate; a live update is six cuts of the halftone mask; every waiting surface is the red slash; `fx-ease` is `cubic-bezier(0.81, 0, 0, 1)`.
- **Research: retro update 2 and deco update 3** [2026-10-09]. Retro's loading is redrawn from the real Windows 95 animations (torch, progress band,
  hourglass, defrag, file copy, dial-up lights); deco's leaving and arriving are ten variations in the festoon's art style.
- **Changed: formal's grammar, as Kenny decided it on research/formal-character** [2026-10-08, themes/formal/CHARACTER.md §4]. The
  clerk rules a ledger: `--fx-ease` is `linear` (css/themes.css); everything that opens, leaves, loads, spins or updates is a rule
  being ruled (400 ms, 60 ms apart, loop 2400 ms; `kp-sig-formal-line-k`/`-pen-k`/`-leave`/`-ruling`/`-loading`/`-update-closed`/
  `-arc-*`/`-bar-*`, css/formal-register.css). Hover is a rule under the label, a press doubles the rule, a warning is a red-ink
  entry on paper (alerts, key figures, menu entry, calendar days), a live update is ruled again and closed, gold is the meter's
  ribbon only (the laurels are navy), tags and tooltips are square, labels are small capitals. The stamp, the dial, the dotted
  leader, the fold and the fade-and-rise are gone.
- **Changed: formal's research variants** [2026-10-08]. `formal.css` beside character-busy, -calendar, -chart, -columns, -drawer,
  -header, -kpi, -menu, -meter, -state, -tiles and -trend redraws the picks on the grammar.
- **Changed: light's grammar, as Kenny decided it on research/light-character** [2026-10-08, themes/light/CHARACTER.md §4]. Light
  exposes: a part comes into focus out of a glare (brightness 1.6, blur 5 px) where it stands and leaves back into it
  (`kp-sig-light-expose`/`-leave`, css/light-register.css), 700 ms on the settle `cubic-bezier(0.16, 1, 0.3, 1)`, closing on its
  inverse. `--fx-ease` is the settle and `--fx-duration` is 200 ms (css/themes.css), a group is 120 ms apart and a loop 3600 ms;
  the dialog, menu, popover, tooltip, toast, drawer, tour, headline, rule and mark all arrive this way. Waiting surfaces stand out
  of focus and breathe; the busy bar's bead runs the hairline and back; the spinner's bead burns out at the top. A live update is
  re-exposed (`--kp-update: reexpose`). A warning is a 3 px top band and a soft pill on the key figure, trend tile, alert and
  destructive menu entry. Hover settles 2 px, the focus ring is DI2's, and a press lands and flashes. One face in two weights,
  and the blueprint grid texture is off.
- **Changed: the research demos' light picks** (busy, calendar, chart, columns, drawer, header, kpi, menu, meter, state, tiles,
  trend) are redrawn on the grammar in a `light.css` each.
- **Removed: two more themes, `high-contrast` and `sepia`** [breaking, next
  major release; Kenny, 2026-10-08, in the review dialog: "we are actually
  not going further with high contrast, the theme can be removed from
  everywhere" and "We are also stopping with Sepia, it may be deleted"].
  Seventeen themes remain. Gone with them: their token sources
  (`themes/<name>/`), their registers (`css/<name>-register.css` and the
  `./css/<name>-register` and `/min` exports), their blocks in
  `css/themes.css` and entries in `js/theme-registry.js` (and so in the
  `ThemeName` type), their `kp-hc-*` and `kp-sig-<theme>-*` TIMINGS rows,
  their hooks, the font family only high-contrast used (Atkinson
  Hyperlegible), their showcase, compare and concept pages, their verdict
  rows and their theme-specific tests. A page that stores one of the two
  names falls back to the default theme. See MIGRATION.md.
- **Removed: the `retro` theme** [breaking, next major release; Kenny,
  2026-10-09: "I am so disappointed in retro that we simply scrap the whole
  theme for now; put it as an idea for future themes, in case we want
  more"]. Sixteen themes remain. Gone with it: `themes/retro/`, its register
  (`css/retro-register.css` and the `./css/retro-register` and `/min`
  exports), its block in `css/themes.css` and its entry in
  `js/theme-registry.js` (and so in the `ThemeName` type), its
  `kp-sig-retro-*` TIMINGS rows, its BIOS lines in `arrivalLinesByTheme`,
  its hooks, its texture and title-bar rules in `css/_rules.css`, the font
  family only retro used (Pixelify Sans), its showcase, compare and concept
  pages, its intro block in the catalogue, its verdict rows, its
  theme-specific tests and its research demos (retro-anchor,
  retro-character, retro-alarm-face, its variant sheets in the character
  demos). The idea is kept in docs/FUTURE_THEMES.md. A page that stores
  `retro` falls back to the default theme. See MIGRATION.md.

## 10.0.0 — 2026-10-08

- **Released with open review pairs, on Kenny's word** [2026-10-08, forms open-blocks,
  suite-red and approval-gate]. The screenshot check reopened 2515 block/theme pairs whose
  look changed with the character rounds (1154 carried); they wait in the review dialog.
  Three earlier rejections (`data--kpi-columns` in phantom, `motion--leave-options` in deco
  and phantom) ship as they are: deco, dark, retro and phantom are being redrawn on the
  branch `claude/eloquent-hamilton-37jler` for 10.1.0, with formal and light. The release
  suite ran once: 1791 passed, 67 failed, 4 skipped (19 min 2 s); the 67 are findings for
  10.1.0 in research/PACKAGE_FINDINGS.md.

- **Fixed: a trend tile's label no longer runs under its "Charts ↗" link**: `.kp-kpi--trend > .kp-kpi__label` ends
  before the link (`margin-inline-end` 4.5 rem, 1.5 rem in a narrow tile) and a label that is still too long ends in an
  ellipsis (`overflow: hidden`, `text-overflow: ellipsis`), in every theme (css/components.css). Measured at 390 and
  1280 px in formal and brutalism: no tile's label overlaps its link.
- **Fixed: brutalism at a phone width (390 px)**: the dialog stays inside the window on every
  frame of its 2.5 rem drop (it leaves 2.5 rem of room on both sides at narrow widths:
  `max-inline-size` `min(32rem, 100vw - 2 × --kp-sig-br-h-slab)`; the drop, its curve and its 1500 ms are
  unchanged, 1280 px is unchanged), and a busy `.kp-button`'s lintel well is a 0.5 rem strip
  along the foot of the button's own box, inside it, in place of one hanging under it (no
  overlap with the next element, no layout shift, the label uncovered).

- **Changed: synthwave's grammar, as Kenny decided it on research/synthwave-character
  and research/synthwave-anchor** [2026-10-07 21:21 to 23:54, themes/synthwave/CHARACTER.md
  §0]. Anchor: the page horizon. `.kp-page-header` draws one 3 px tube on its foot
  (`::after`), the floor under it (`::before`, 8.5 rem deep at `z-index: -1` inside the
  header's own stacking context [Kenny, 2026-10-08 01:00: the floor is the page, behind
  the plates]; the header reserves nothing, and whatever follows a `.kp-page-header` is
  `position: relative` at no specificity so it paints above the floor),
  and, under a hand on a header action, a brighter piece of the tube exactly as wide as
  the action (anchor positioning on the action's own `::after`, so a popover's trigger
  with an inline `anchor-name`, such as More ▾, lights its piece too). Tokens (`css/themes.css`, from `themes/synthwave/tokens.json`): `--fx-duration`
  225 ms (one beat), `--fx-ease` the sunrise curve `cubic-bezier(0.65, 0, 0.35, 1)`,
  `--fx-lift` 0 (nothing lifts or drops); the root says `--kp-close-max` and
  `--kp-size-max` 450 ms. Durations are beats of 225 ms: an opening 2, a live change 3,
  an arrival or a leave 4, the spinner 8 (1800 ms). Surface: plates (`.kp-card`,
  `.kp-kpi`) are chrome over the floor (3 px stripe, a lit line under it, a shaded foot,
  the grid floor in the lower part), panels the same without the floor, square; the
  corners fall (pink down the left side, cyan down the right, fading out, starting in
  the colour of the stripe end they touch). Colour roles: icon and copy buttons and the
  section rule are pink (laser yellow stays for a warning). Type: identifiers and the
  data faces speak in VT323 (`--kp-mono` is the OSD face, sized by x-height).
  Hover turns the tube up (no lift); press charges the part (its top edge burns, the
  ground takes the pressed token, the header's piece charges); focus is two tubes, top
  and foot, plus a hairline each side, on every part that takes the keyboard
  (`--kp-sw-rails-in` inside buttons, fields, selects, textareas, tabs, menu entries, nav
  links, table cells and rows, tree and accordion triggers, calendar days, pagination,
  tags, key-figure links; `--kp-sw-rails-out` outside links in text, checkboxes, radios
  and switches; a catch-all for any other button or role; a forced-colours outline). Tone: the VCR's symbols (a pause for a warning, a stop for a failure) in
  the part's own ink before a key figure's figure or an alert's label, the stripe and
  sides turning to the tone's ink. Live: `--kp-update: laser`, a 2 px laser drawn under
  the changed value from its centre out, 675 ms. Opening: the beam climbs to the
  horizon: the dialog, popovers, tooltips and the menu button's menu are uncovered from
  their foot upward behind a 2 px beam, 450 ms, and the popovers and menus close as that
  climb reversed (transitions). Leave: the sun sets through it, the part sinking with
  the sun, 900 ms (`[data-kp-leaving]`, replacing the striped circle); a toast and what
  arrives play it backwards; new rows rise over the horizon instead of racing in
  skewed. Loading (the oncoming tube and floor, the bars as they were): while a header
  or an ancestor is `aria-busy='true'` the tube is a track with the sun's ramp flowing
  through it (1800 ms) and the floor drives toward you (900 ms); a `.kp-progressbar`
  with a share fills from nothing on the sunrise curve in four beats, a beat behind the
  tube. The same loading at the scale of a tile: a `.kp-card` or `.kp-kpi` that is
  `aria-busy='true'` (or sits in a `.kp-tiles` or `.kp-kpis` that is) has its stripe as the
  unlit tube with the sun's ramp flowing through it (1800 ms) and the lines of its floor
  driving toward you (900 ms), at full light (`--kp-busy-opacity: 1`, the package's 0.7 dim
  would dull the tube). A tile whose value changes draws the laser too: on the value
  (`[data-kp-updating='laser']`, a `.kp-kpi__value`'s line as wide as the figure) or, when the
  whole plate is marked, under the plate (`::before`; a dossier card keeps its label there and
  draws none). The key figure's number is counted in the chrome display face
  (`--theme-font-display`, a near-white core with the pink tube; its unit and note go back to
  the body face; a figure on a warning or destructive plate keeps the plate's ink, no glow).
  A key figure that is a toggle or a link charges when pressed (`:active`) and a toggle that
  is on (`button.kp-kpi--toggle[aria-pressed='true']`) stays charged: the stripe and the sides
  burn near-white, the bloom gathers above, the ground takes `--secondary-active`, and a second
  channel that is not colour [DI2]: the VCR's play symbol in the tile's padding before the
  label (out of the flow, so no sibling moves) and the horizon of its floor lit near-white.
  The demos `research/character-tiles` (loading 1, live 2) and `research/character-kpi`
  (number, loading 1, press) carry the same pictures in their `synthwave.css`, replacing the
  pink dashes along the foot and the tiles' tracking jump. Retired: the headline's tracking bands and RGB fringe (the reveal is the tube
  striking on, then the shine), the meter's spring and bump, the check's tween, the
  tooltip's typing, the plates' glowing rims, the nav's drop (it rises). The network
  graph, the skeleton, the busy road, the busy table's loading and the boot screen are
  unchanged. Research demos: the synthwave picks of the busy table (shape), trend tile
  (arrival), key figure (live) and dashboard tiles (hover, tone) are redrawn in
  `research/character-*/synthwave.css`.
- **Changed: grotesk's grammar, as Kenny decided it on research/grotesk-character** [2026-10-07 23:43, themes/grotesk/CHARACTER.md "Applied 2026-10-07"; all nineteen questions approved, the press = the rule thickens]. The anchor is Out of register: a second, red plate under the black ink. `--fx-ease` is `linear` (on time: an even pace, a dead stop, a dwell); units of the register's 120 ms: contact 1, a set 2, a fall 8 (960 ms), a loop 22 (2640 ms); the root says `--kp-close-max` 960 ms and `--kp-size-max` 240 ms (the resize stays Kenny's three cuts). What arrives or opens (dialog, toast, tooltip, `[data-kp-arriving]`) is printed in black and its red plate, a `drop-shadow` of the part, falls into register on it along a closing spiral, clockwise (`kp-sig-grotesk-fall`; the dialog's unopened probe runs 1440 ms, the open one 960, so open and close are one fall); focus is DI2's ring and the same fall; a live change is `--kp-update: plate` (`kp-sig-grotesk-update-plate`), a meter's tone turning to warning or destructive falls again. The leave is NOT the arrival reversed, on his explicit word (CHARACTER.md section 0b): the plate opens out clockwise, one turn, then the part is gone (`kp-sig-grotesk-leave`, registered `--kp-sig-gr-a` and `--kp-sig-gr-q`, never turning back, in either text direction); the register no longer declares `--kp-open: reverse-close`, so an arrival plays its own fall. Loading is out of register: the skeleton (lines, block, circle), the busy bar (the slab, 22 units), the loading meter's ruler, a loading calendar day and menu entry print a red copy that travels the clockwise loop; the spinner is the twin that turns (a quarter turn in 8 units, a dwell of 3, clockwise only); `--kp-busy-opacity: 1`. Hover is a bar on the edge (a 3 px red bar on a button's foot, ink on a red face; a menu entry's top edge; a link tile's rule red and 7 px), the press thickens the baseline in the deeper red on the paper face, and a pressed button is never grey (the grey face of 2026-09-14 and the inverting coloured buttons are retired); a nav link keeps its baseline. A card, key figure, busy panel and page header are a column under a 3 px ink rule, no frame; a warning is indexed (a 6 px bar of the tone down the start edge, the tone's word before the figure, the change on a square plate with the arrows ↗ ↘); badges and tags speak Inter 700 in sentence case; the reveal knobs and the signature's durations count whole units. The research/character-* demos carry grotesk's decided options redrawn on the same grammar (`grotesk.css` in each).
- **Added: `--kp-press: size`, the measured width of a pressed button written as `data-kp-press-size`** [2026-10-08, blueprint character]. `js/effects.js` arms the press bus for a theme that declares `--kp-press: size` as it did for `point` (new export `PRESS_SIZE`); `js/effects/pointer.js` writes the width in whole pixels on `.kp-button` and `.kp-icon-button` at pointer-down and on Space or Enter, and answers per press from the theme then active, so a page that changes theme keeps each theme's own answer. Sepia's `point` and every other theme are unchanged. Blueprint declares `size` and letters the dimension below a pressed part with `content: attr(data-kp-press-size)` in the draughtsman's lettering (mono, sloped 15 degrees), the line broken around it; without the module or before a first press the line runs unbroken.
- **Fixed: three more leftovers of the old blueprint** [2026-10-08, themes/blueprint/CHARACTER.md G3, G7, G8, G17]. The nav dropdown's links, the combobox's and the palette's active row take the menu entry's witness-line hover (two amber lines and a ruler with a pointer at each end, no ground change; `--kp-menu-wash` is removed). A menu inside a popover or the theme menu's list is unframed, so a popover with a menu draws one 1 px frame (the pen traces that frame; a standalone menu, a menu button's list, the combobox list and the date picker panel keep their own single frame). A captioned nav dropdown shows its caption instead of a solid bar. CHARACTER.md §1-§3 now state the pen-read meter and the one-frame windows.
- **Fixed: blueprint's combobox list and toast open by their own trace at once** [2026-10-08]. They opened as a leave turned around by `js/motion.js`, so the pen started 466 ms late and the list opened by the part's read-out; they now say `--kp-open: normal`, and every traced panel's leave (`[data-kp-leaving]`) is the trace played backwards, never the part's read-out mask.
- **Fixed: three leftovers of the old blueprint in its register, against the approved character** [2026-10-08, themes/blueprint/CHARACTER.md G3, G7, G8, G9]. The meter's share arrives by the register's read-out (`kp-sig-blueprint-read`, three 160 ms units, the leave its reverse per frame) and a changed reading slides on the feed, in place of the 1200 ms wipes (`kp-sig-blueprint-meter-wipe-*` removed); a warning or failure is a pointer under the track in the tone's ink (also past the end, the over sign keeps `::after`); the windows (menu, popover, tooltip, dialog, toast, nav dropdown) carry no blur shadow, only their one frame; a menu entry is read on a scale like a button (witness lines, a ruler with a pointer), with no wash.
- **Changed: blueprint's character, as Kenny decided it on research/blueprint-character** [2026-10-07 23:41, sixteen of sixteen, with the tracing pen of research/blueprint-anchor as the anchor; themes/blueprint/CHARACTER.md "Applied 2026-10-08"]. One visible plotter pen draws everything, on the package's own components and with no new element or script: `--fx-ease` is the plotter's feed (`linear(0, 0.031 10%, 0.125 20%, 0.875 80%, 0.969 90%, 1)`, `themes/blueprint/tokens.json`), durations count 160 ms (a part 3 units, a panel and the dialog 5 with `--kp-close-max` 800 ms, a tooltip 3, a revision 6, a loop 18). A part arrives and leaves by being read out on its own scales: the pen runs the diagonal of the part, amber witness lines and pointers on its start edge and foot follow it, each line is inked as the pen passes (a `round(up, …, 1lh)` mask over the content box), and the leave is the arrival played backwards by `js/motion.js` (`kp-sig-blueprint-read`, replacing the hatched leave and the resize plot and its closed dashed frame). Dialog, popover, menu, menu button, combobox list, date picker panel and toast open by the pen tracing the outline from its corner and the panel being inked at three quarters (`kp-sig-blueprint-trace`, the dialog's crosses move inside its corners); a tooltip draws its leader, then its outline. A control read on a scale: hover sets the two amber witness lines and runs them on to a ruler with a pointer on each end, focus keeps the two-channel ring and the lines, a press draws the dimension below the part with a slash at each end and never changes its ground (the primary and destructive hover inversions and every pressed ground are gone); a menu entry takes the lines. Plates (card, key figure, tile, pane, spec, log, diff, wizard, data table, form summary, reorder list, plain alert, empty state) stand on the graticule's two axes with no fill and no closed frame; a tone is pointed out on a ruler under the figure instead of a plate; the draughtsman's lettering (mono capitals sloped 15 degrees) is the voice of labels, tags, heads, the change, toasts, the tooltip and the dialog title. A live update is read again: `--kp-update: read` slides an amber pointer along a short ruler under the value. Loading is one pen: skeleton lines are underlined place by place two units apart, a block is traced round, a circle is ringed, the progress bar is the pen's stroke with the pen at its end (busy it strokes, lifts, goes back and strokes again), and the meter's loading does the same; the arrowhead, hatched fill and chain line of the dimension bar are gone. Not built as CSS: the size lettered on a press's dimension (CSS cannot print a measured length).
- **Changed: brutalism's grammar, as Kenny decided it on research/brutalism-character**
  [2026-10-07 23:44, themes/brutalism/CHARACTER.md "Applied 2026-10-07"].
  Gravity: brutalism's `--fx-ease` is the fall curve `cubic-bezier(0.6, 0, 0.9, 0.5)`
  and `--kp-sig-br-up` its mirror; contact 100 ms, a fall, an arrival and a leave
  300 ms, the dialog 1500 ms, a loop 1200 ms (`--kp-sig-br-*`; the root says
  `--kp-close-max` 1500 ms and `--kp-size-max` 300 ms). What opens is dropped onto its
  footprint from up-left with its hard shadow on the ground from the first frame (the
  dialog, the toast, the tooltip, the meter's share; no tilt, no fade, no scale; the
  backdrop holds solid), and what leaves is lifted 1 rem up-left off it and gone in one
  cut, replacing the slam to the left. Loading is the lintel hoisted in four hard lifts
  on every waiting surface (skeleton lines, block and circle, a loading meter, the data
  table's busy panel, a loading menu entry, a busy button, a busy card, the busy
  calendar); the spinner is the block tipped over. The progress bar is Ruled and
  labelled, slowest: the share is printed in the yellow tip and walks to its value in
  ten hard steps of 80 ms, busy the tip hops in ten steps over 2400 ms and prints
  three dots (the tape is gone). Pointing inverts every button, icon button, menu
  entry and navigation link, focus lifts under the two-channel ring, a press is driven
  onto the shadow's own 6 px (3 px on a small part). A new value is slammed onto its
  yellow offset (`--kp-update: slam`); a warning or a failure is taped off (an alert's
  foot, a meter's share, an invalid field's error plate); a status is paint under an ink
  line, never a coloured line. Prose is 500, labels, dates and figures 700 or heavier
  and never under 12 px, dates bold mono in ink. The research demos' brutalism picks
  (`research/character-*/brutalism.css`) follow; the network graph is unchanged. Found while watching the states (2026-10-08): a refreshing data table no longer dims its rows (`--kp-datatable-busy-opacity: 1`, nothing is translucent), a loading menu entry's well is 0.75 rem (the beam was 2 px), an alert's close cross is 700 and 1.5 rem.
- **Changed: terminal's grammar, as Kenny decided it on research/terminal-character** [2026-10-07 23:43, themes/terminal/CHARACTER.md G1-G18, sixteen of sixteen approved]. The cursor writes the screen. Clocks: `--fx-duration` 34 ms and `--fx-ease` `steps(1, jump-end)` (contact is one step), a cell 34 ms, a printed line 136 ms, the slow blink 1000 ms, a change 900 ms (`--kp-sig-tm-*`). Arrival: the meter's share is typed a cell a step with the block cursor on its head (1088 ms); the dialog is printed six lines at 136 ms with the cursor at the line being printed (its unopened probe runs 1.5 times that and `--kp-close-max` is 816 ms, so `js/motion.js` opens and closes it in one print); toast and tooltip type at the cell clock; the leave keeps Kenny's 480 ms sweep with a one-cell cursor in the bloom (no glow) and mirrors under `dir="rtl"`. Loading is an htop row, the cursor its head (dim brackets and cells, cells lit in the ink a cell a step, emptying as they filled, 1000 ms each way) on skeleton lines, block skeletons, a loading meter, the data table's busy panel, a busy calendar, a loading menu entry and a busy card or key figure; a busy button shows the cursor alone; the spinner and the busy bar are unchanged. A change blinks three times (`--kp-update: blink`, `kp-sig-terminal-update-blink`, 900 ms); a new meter tone blinks the share. Pointing is the cursor ring (buttons, icon buttons, menu entries, links, nav and side nav, footer links, link and toggle key figures, tiles), focus the 2 px dashed box in the bright phosphor, a press reverse video; plates (card, key figure, grid tile, pane, plain alert, data table, busy panel, wizard, spec, log, diff, form summary) are a line of htop between square brackets instead of a closed frame; a toned key figure stands on the tone's plate with `[warn]` or `[fail]` before it and its change underlined; labels, badges, tags, tabs, table heads, the alert label and the footer heads are lower case and untracked; the meter loses its glow and its blink at rest. Every keyframe row of the old meter jolt, pos and blink is replaced in js/effects.js and gates/check-motion.mjs. The network graph is untouched. The per-component demos carry terminal's picks on the same grammar (research/terminal-character/grammar.css, research/character-*/terminal.css; research/character-busy/terminal.js keeps the removed overlay for its leave).
- **Changed: cyberpunk's grammar, as Kenny decided it on research/cyberpunk-character**
  [2026-10-07 23:52, themes/cyberpunk/CHARACTER.md §0]. Motion: the dialog, the
  toast, the tooltip and every `[data-kp-leaving]` part arrive and leave as the
  channel split (a yellow and a cyan ghost that come home 6, 4, 2 and 1 px in
  four 120 ms ticks, 480 ms in all, inside a notch-safe wide clip); a close is
  its open played backwards. Shape: the holo plate with its 14 px notch (8 px on
  a control and the tooltip), rim, 135 degree scan lines and prefixed `///` mono
  labels. Pointing is the split edge (a cyan and red doubled edge that follows
  the part's own cut), focus is four closing brackets, a press closes the circuit
  with no lift. The spinner is four bars with a glitch copy (3000 ms), loading is
  the on-screen word LOADING over the skeleton, meter and busy progress bar, and
  the live update's stutter has a fixed 480 ms duration. The meter's knock
  keyframes are removed. Not ported yet: the TARGET and CAUTION tags, the meter's
  tone brackets, hover and press on a plain card or calendar day, and a menu
  (popover) open, which needs a `js/motion.js` hook. css/cyberpunk-register.css.
  (arrival), key figure (shape, tone, hover, focus, live), dashboard tiles (shape, hover,
  tone), the page header (shape, actions) and the strip (shape, change) are redrawn in
  `research/character-*/synthwave.css`: square plates on the register's chrome over the
  floor, the corners falling; the old 2 px pink rim with its glow, the 0.4 rem, 6 px and
  4 px corners, the header's frame, its 999 px cyan pills and the strip's cyan-glow pill
  are retired. New review demo `research/synthwave-floor`: how deep the page floor is
  (a 3.5 rem band inside the header as the package has it, the floor behind the plates
  at 8.5 rem, a header as deep as the floor, deep only where there is room); the
  package keeps the band until Kenny picks.
  keyframes are removed. A warning or destructive key figure carries a boxed CAUTION or TARGET tag, a destructive menu entry a [TARGET] prefix, a toned standalone meter four closing brackets, and a pointable card and a calendar day take the split edge and the closed circuit; a plain card takes neither. Not ported yet: a menu (popover) open, which needs a `js/motion.js` hook. css/cyberpunk-register.css.
  (`research/character-*/brutalism.css`) follow; the network graph is unchanged.
- **Changed: terminal's grammar, as Kenny decided it on research/terminal-character** [2026-10-07 23:43, themes/terminal/CHARACTER.md G1-G18, sixteen of sixteen approved]. The cursor writes the screen. Clocks: `--fx-duration` 34 ms and `--fx-ease` `steps(1, jump-end)` (contact is one step), a cell 34 ms, a printed line 136 ms, the slow blink 1000 ms, a change 900 ms (`--kp-sig-tm-*`). Arrival: the meter's share is typed a cell a step with the block cursor on its head (1088 ms); the dialog is printed six lines at 136 ms with the cursor at the line being printed (its unopened probe runs 1.5 times that and `--kp-close-max` is 816 ms, so `js/motion.js` opens and closes it in one print); toast and tooltip type at the cell clock; the leave keeps Kenny's 480 ms sweep with a one-cell cursor in the bloom (no glow) and mirrors under `dir="rtl"`. Loading is an htop row, the cursor its head (dim brackets and cells, cells lit in the ink a cell a step, emptying as they filled, 1000 ms each way) on skeleton lines, block skeletons, a loading meter, the data table's busy panel, a busy calendar, a loading menu entry and a busy card or key figure; a busy button shows the cursor alone; the spinner and the busy bar are unchanged. A change blinks three times (`--kp-update: blink`, `kp-sig-terminal-update-blink`, 900 ms); a new meter tone blinks the share. Pointing is the cursor ring (buttons, icon buttons, menu entries, links, nav and side nav, footer links, link and toggle key figures, tiles), focus the 2 px dashed box in the bright phosphor, a press reverse video; plates (card, key figure, grid tile, pane, plain alert, data table, busy panel, wizard, spec, log, diff, form summary) are a line of htop between square brackets instead of a closed frame; a toned key figure stands on the tone's plate with `[warn]` or `[fail]` before it and its change underlined; labels, badges, tags, tabs, table heads, the alert label and the footer heads are lower case and untracked; the meter loses its glow and its blink at rest. Every keyframe row of the old meter jolt, pos and blink is replaced in js/effects.js and gates/check-motion.mjs. A menu or popover is printed four lines at 136 ms with the cursor at the line being printed (the reverse is the same keyframes, played by `playEntranceBackwards`), the dialog's dim comes up in the dialog's own six steps instead of the package's fade, and the switch's thumb leaves the way it came (`steps(4, jump-start)` going off). Menu entries take the ring on hover, the dashed box on focus and reverse video on the press, chart legend keys are small terminal buttons (ring, dashed box, reverse while held), and a calendar day takes the ring while the pick is the `>` prompt with its count in reverse and today the figure in reverse. The network graph is untouched. The per-component demos carry terminal's picks on the same grammar (research/terminal-character/grammar.css, research/character-*/terminal.css; research/character-busy/terminal.js keeps the removed overlay for its leave).

- **Changed: solstice's pointing is the sun climbing its arc, its press the sun swelling inside the part** [2026-10-07, Kenny: both picks of research/solstice-character, replacing the rake of scope-12 and the restated `-active` faces of fix-12]. One grammar for every pressable part (buttons of every variant including primary, mirror and icon, menu items, calendar days, key figures that are links or toggles, chart legend keys): a real `:hover` raises a sun along its arc under the part with a dome of warm light and a lit foot edge (`::before` and `::after`), a real `:active` swells a half-sun from the middle of the foot, lights the foot edge and takes the ground half-way to its held face, the words lifting to cream. Two registered numbers (`--kp-sig-solstice-point`, `--kp-sig-solstice-press`) run 240 ms on `cubic-bezier(.37, 0, .63, 1)`, in and out identical (measured in Firefox, real mouse: t50 120 ms, t90 191 ms, both ways, all parts). The register paints no hover face any more; the alarm keeps its own paint. Reduced motion: the finished pose at once.

- **Changed: nostromo's toast, card tile and key figure are drawn and erased under the raster's beam, as the dialog is** [the raster for opening and leave, research/nostromo-character]. They were clipped in whole frames without the beam. The beam (`--kp-sig-no-beam`, the LED orange with its fading tail, 1.1 rem tail as the research demo's tile) is a background layer that exists only while the part plays (`kp-sig-nostromo-beam-layer`, `kp-sig-nostromo-beam-layer-erase`), so no pseudo-element is taken and the part's own background is untouched at rest: 4 frames of 80 ms, the beam's foot on the same edge per frame as the dialog's (0, 25, 50, 75 % of the height, measured in Firefox), the leave the draw backwards frame for frame (75, 50, 25, 0 %), and a tile's or key figure's arrival, which js/motion.js plays as that leave turned round, the exact mirror. It lies under the text and the klaxon frame. Reduced motion: the finished part, no layer.

- **Changed: nostromo's busy progress bar keeps its LED window and its lamps compute** [Kenny, 08/10/2026 01:02: option `led` of research/nostromo-character, update 3, question `busy`]. A `.kp-progressbar[data-kp-indeterminate]` keeps the LED window in its moulded bezel (the meter's cells, 3 px on a 6 px pitch, times `--kp-progressbar-scale`); its lit cells, in the LED orange with their glow, switch in a fixed unordered pattern (a 37-cell tile with 11 lit, shifted 0, 14, 5, 25, 11 cells): a new pattern every 4 frames of 80 ms, five patterns, 1600 ms a cycle, in held steps (`kp-sig-nostromo-compute`); under reduced motion the first pattern stands. It replaces the amber COMPUTING glass this bar took with loading "raster" (d81d9892): the word was 0.5 rem in a 10 px window. Every other waiting part keeps the glass; the bar with a share, the meter and the sizes are unchanged.

- **Changed: nostromo's live update and loading, the last two picks of research/nostromo-character**
  [Kenny, 08/10/2026 00:05, live "raster" and loading "raster"; G9, G10]. Live:
  `--kp-update: raster`; js/update.js's new value stands at once, dimmed to a third
  (its own mask), and is rewritten from the top in 4 frames (320 ms) under the beam
  (`::before`), while the lamp beside a key figure's label lights as the LED in one
  frame, holds and goes out after 8 frames (640 ms). Every key figure's label now
  carries its lamp (unlit at rest; G16), with room inside the label's clip so the
  lit lens and glow are whole. Loading is the waiting screen: dark glass, scanlines,
  a hum band rolling in 10 steps, COMPUTING written row by row in 12 frames under
  the beam, standing 6, blank 2 (1600 ms); the busy progress bar is that screen in
  its own window (it was every other LED lit, standing still), a skeleton line a
  glass whose phosphor line is written in its turn (rows 4 frames apart), a block
  skeleton (the time chart's plot while it loads) writes COMPUTING in its middle,
  a loading day is a glass cell, the menu's loading entry and the data table's busy
  panel carry a glass along their foot. The skeleton's orange glow is retired. A bar
  with a share, the meter and the tape reel are unchanged.

- **Changed: nostromo's grammar, as Kenny decided it on research/nostromo-character**
  [2026-10-07 23:18, sixteen of eighteen approved; themes/nostromo/CHARACTER.md].
  The anchor is the raster. Motion runs on the ship's 80 ms frame clock:
  nostromo's `--fx-ease` is the register's curve held per frame (a 2-frame
  `linear()`), `--fx-lift` is 0, and the register declares the frame tokens
  `--kp-sig-no-f2/-f4/-f8`, contact 160 ms, a panel 320 ms, a print 640 ms,
  a loop 1600 ms, with `--kp-close-max` and `--kp-size-max` at 320 ms. The
  dialog, the drawer, the toast, the tooltip and the tour card are drawn by
  the raster from their top edge down in whole frames (`kp-sig-nostromo-raster`,
  steps; the dialog with the beam on its `::after`), the headline, the stamp
  and the section rule too; the leave is that draw played backwards
  (`kp-sig-nostromo-erase`, 320 ms), so every arrival is the draw. The tape
  reel turns once in 1600 ms in 20 frames; the radio's lens switches on in a
  frame; the tick prints in 2 frames; the switch moves in 2. Corners are
  moulded: buttons, icon buttons, menu entries and small controls 0.3rem,
  badge and tag label tape 2 px (the badge is no longer a pill), and the
  focus ring keeps the part's corner. Every switch has its lamp: the button,
  the menu entry and the key figure that is a link or a filter; lit in ink
  under the pointer, full when pressed, lit orange as the LED on keyboard
  focus; a key at rest is raised and a press turns it into a well without
  moving it; the side navigation's lamp no longer slides. Cards and key
  figures are raised moulding; the key figure's figure is Michroma and its
  label label tape; a warning or failed key figure, meter or destructive
  menu entry is framed 3 px in its tone's ink (the meter's sideways jolt is
  gone). A tick and a picked day are ink. The meter's share prints in 640 ms.
  The live update and the loading pictures are unchanged (both reopened).
  nostromo's picks in research/character-* are redrawn on the same grammar
  (`nostromo.css` per demo, `research/character-busy/nostromo.js`).

- **Changed: solstice's focus ring is a halo** [2026-10-07, Kenny: the halo of research/solstice-character, replacing the global two-channel ring]. A 3 px double rust outline 3 px off the part on every `:focus-visible`; the mirror button keeps only its highlight. The leave comment now names the morning mist, not an eclipse (css/solstice-register.css).

- **Fixed: `.kp-skeleton--block` and `.kp-skeleton--circle` have their own size again** [2026-10-07, Kenny]. The base `.kp-skeleton` rule (1rem tall) came later in components.css than the two shape rules and won at equal specificity, so in every theme a block was a flat 1rem bar and a circle a flat ellipse. The shape rules now follow the base rule: a block is `--kp-skeleton-block` (6rem) tall, a circle `--kp-skeleton-circle` (3rem) wide and as tall as wide.

- **Changed: forest's skeleton block and circle are a treeline that fills in** [2026-10-07, Kenny: option 1 of research/forest-skeleton, replacing the planted plot]. Two ridges rise from the foot, then the planted tree line (the lines' own trees, whole trees only) walks across start to end; 3200 ms linear loop (`--kp-fo-grow`), the leave is the arrival reversed, the leaf corner on the block, clipped to the circle, a finished still under reduced motion. The chart's loading panel and legend stubs take it too; the text lines are unchanged (css/forest-register.css, themes/forest/CHARACTER.md).
- **Fixed: no register frames the theme picker's icon button** [2026-10-07, Kenny]. Sixteen registers (blueprint, brutalism, dark, deco, formal, grotesk, high-contrast, light, nostromo, pastel, retro, sepia, solstice, synthwave, terminal, titanium) listed `.kp-theme-menu`, the wrapper round the button, among the popover surfaces and drew a card border or shadow round it; the surface now belongs to `.kp-theme-menu__list`, the dropdown, and the wrapper takes none (as phantom's already did).

- **Changed: forest's skeleton block and circle, and the empty state, carry forest's own pictures** [2026-10-07, Kenny: "not convinced" by the diagonal stripes and the rings]. The skeleton block and circle are a treeline that fills in (entry above); no stripe is left in forest. The empty state is a clearing on the map: a dashed leaf-cornered plot, one seedling that grows once (1000 ms, growth curve), a clay trig point at the corner (css/forest-register.css only; DOM, sizes and copy unchanged).

- **Changed: forest's contour field is one seamless tile, static and part of the
  page** [2026-10-07, Kenny: "they do not form a whole"]. A 900 x 900 px
  periodic topographic tile (lines continue across every edge, closed summit
  rings and long wandering lines, no ring cut off) replaces the 900 x 460 px
  field of four cut-off rings. It is the body's own background: it scrolls with
  the content and no longer drifts; the 40 s `kp-drift` animation and the fixed
  `body::after` overlay are off for forest (css/themes.css, css/_rules.css,
  css/forest-register.css). Weight measured in Firefox: 0.07 luminance levels
  darker than the paper before, 0.09 after (alpha 0.05 ink either way).

- **Fixed: forest's theme picker no longer sits in a card frame** [2026-10-07, Kenny]. The register painted the card chrome (border and shadow) on `.kp-theme-menu`, the wrapper round the icon button, so the button had a square frame around it; the chrome now belongs to `.kp-theme-menu__list`, the dropdown the React switcher draws.

- **Changed (research demos only): the busy overlay's leave in forest's demo
  is its arrival reversed** [2026-10-07, Kenny: every close is its open
  reversed]. research/character-busy withers back with `fog-grow-back` (the
  arrival's keyframes `reverse`, 1000 ms, same curve; measured identical frame
  for frame in Firefox). The package removes the layer at once, so the demo's
  `forest.js` only holds it for the leave. The meter and the progress bar keep
  their 3 px corners (Kenny, 2026-10-07 18:22: they take no leaf corner).

- **Changed: forest's grammar, as Kenny decided it on research/forest-character**
  [2026-10-07 17:47, themes/forest/CHARACTER.md "Applied 2026-10-07"].
  Growth: forest's `--fx-ease` is the Gompertz growth curve (a `linear()` list,
  `--kp-sig-fo-grow`) and `--fx-lift` is 0; contact stays 200 ms, a growth,
  opening, arrival and leave is 1000 ms (`--kp-sig-fo-time`), a loop 3200 ms,
  a stagger 80 ms; the root says `--kp-close-max` and `--kp-size-max` 1000 ms
  so `themeMotion()` closes and resizes in one growth. The dialog grows up
  out of its base line (a `translate` clipped at that line, never scaled; its
  unopened probe runs 1500 ms, the open dialog 1000 ms, so open and close are
  both one growth), the toast grows from its base as its leave reversed, the
  tooltip grows down out of its trigger like a root; the leave withers into
  its line from green to sepia on the growth curve turned around
  (`--kp-sig-fo-wither`), which makes its arrival the growth, frame for
  frame. Pointing is blazing: a 2 px dashed `--primary` ring 2 px out on a
  button, icon button, menu entry or key-figure link (no lift, no shadow), a
  press closes it in to 1 px and solid; focus is DI2's ring. Live: forest
  declares `--kp-update: ring`, a growth ring drawn once round what changed
  (`kp-sig-forest-update-ring`, 1000 ms); a meter's tone to warning or
  destructive lays the same ring. Loading: the planting strip, the bar's busy
  breath, on skeleton lines (400 ms apart), a loading meter's groove, the data
  table's busy panel, a loading menu entry, a busy button, a busy card, the
  busy calendar and the chart's loading state; the spinner plants a tree in
  three whole stages, 1600 ms a tree. The leaf corner (top-right and
  bottom-left rounded) is one rule and one token (`--kp-sig-fo-leaf`) on every
  plate and small part; tags and plain badges are light wood; notes (tags,
  the change on a tile with ↑ ↓, labels, help text) are italic. The progress
  bar and the network graph are unchanged. The key-figure link and the other
  composites keep the package's own markup and take these rules through their
  buttons.

- **Changed: forest's progress bar breathes and loses its sapling** [Kenny,
  2026-10-07]. The light-green sapling head (and its sway, mound and the
  travelling grove keyframes) is gone, determinate and busy alike. A busy bar
  fills the planted row start to end in 3000 ms, holds full 600 ms and empties
  in 3000 ms with the same frames reversed (`--kp-fo-breath`,
  `kp-progressbar-forest-breath`); reduced motion shows whole trees at half
  breath. The compass spinner is unchanged [themes/forest/CHARACTER.md].
- **Fixed: grotesk's resize cut cuts in three.** `kp-sig-grotesk-size-cut`
  declared only a `from` inset, and an inset does not interpolate with a
  line's own `clip-path: none`, so a line arriving in a resized box was
  hidden for 120 ms and then whole. The keyframe now ends on `inset(0)`:
  hidden, a third, two thirds, whole, 80 ms apart [themes/grotesk/CHARACTER.md
  outlier-14].
- **Fixed: blueprint's resize plot plots top down.** `kp-sig-blueprint-size-plot`
  had the same missing end (hidden for 210 ms, then whole); it now ends on
  `inset(0)` and uncovers the line from its top edge at an even pace over
  420 ms [themes/blueprint/CHARACTER.md outlier-14].
- **Fixed: terminal's ghost button keeps its `]` under the pointer.** The
  ghost's closing bracket and the gap-4 cursor both live on `::after`, and the
  cursor's rule emptied the content, so a hovered or focused ghost showed `[`,
  its label and a cursor but never the `]`. The `]` is back and the cursor
  stands on it, the bracket in reverse while the block is lit
  (`kp-caret-reverse`, new, in step with `kp-caret`, with its row in
  `TIMINGS`); both brackets sit on the cursor's line box, level with the
  label. Under reduced motion the cursor stands lit on the bracket
  [themes/terminal/CHARACTER.md outlier-16].
- **Changed: cyberpunk's live update is the count-down stutter** [Kenny on
  research/cyberpunk-live, 2026-10-07 02:49]. `update()` in cyberpunk plays
  `--kp-update: stutter` (was `glitch`): two unblurred neon copies of the
  value, yellow `--primary` right and up, cyan `--accent` right and down,
  tick home 6, 4, 2, 1 px in four hard steps over 480 ms (0.64 of the update
  time, so `--kp-motion-scale` slows it too), the value sharp on top and
  never moved (`kp-sig-cyberpunk-update-stutter`, a text-shadow; the glitch's
  jitter and torn line are gone). Under reduced motion the copies stand 2 px
  out for 1.2 s and go (`kp-sig-cyberpunk-update-still`). A spark in
  cyberpunk takes its new point at once (`--kp-update: none` on the svg).
- **Changed: `update()` marks every update of one task in one batch.** The
  value is still written at the call; the marks go on together in one
  microtask that reads every element's idea and display first, the theme's
  timing once per theme, then writes every mark, then reads the animations,
  so a dashboard that changes fifty values pays one style pass instead of a
  forced layout per value. `markUpdating()` no longer forces a reflow of its
  own; `updatePlays(idea)` is true whenever the register names an idea (a
  register that names one under reduced motion plays a still version on its
  own time). The idea is read on the element itself, so a spark's svg can
  name none.
- **Changed: titanium moves on one curve.** `--fx-ease` for titanium is
  `cubic-bezier(0.2, 0.8, 0.2, 1)` (was `cubic-bezier(0.3, 0.9, 0.3, 1)`),
  and the register's one-shot motions use it: button contact (60 ms, was
  linear), the headline `kp-mill`, the switch thumb, the toast rail and
  scribe, the dialog cut and its cutter, the tooltip, the progress fill and
  head, the meter's grow, jolt and mark; `--kp-settle` resolves to the same
  curve. Because `themeMotion()` reads the dialog's curve, a dialog's close,
  a box's size glide (`--kp-size-ease`, was linear) and `update()`'s heat
  tint follow it. Loops keep a constant feed [themes/titanium/CHARACTER.md
  G1, Kenny 2026-10-07].
- **Changed: titanium's loading is the anodising bath** [Kenny on
  research/titanium-loading, 2026-10-07 00:54]. The skeleton (line, circle,
  block), the progress bar (busy: the slug is gone, the fill spans the track;
  with a share: the fill is the oxide film), the meter while measuring (was
  the 1400 ms cutter), the data table's busy panel and refreshing rows, a
  menu's loading entry, a busy button, a busy card, the month's busy card and
  a time chart's loading state carry the oxide ramp washed 32% into their
  plate, drifting start → end, `kp-sig-titanium-bath`, one period
  (`--kp-sig-ti-loop`, 2200 ms). Standing still the wash stays, still. The
  spinner is unchanged.
- **Changed: titanium's leave** runs 400 ms on the theme curve (was 650 ms
  ease-in) and its heat band runs start → end, as the update's; the arrival,
  its reverse, follows.
- **Changed: titanium's size arrival** (`[data-kp-arriving]`) is fed in from
  inline-start (was from inline-end), and it and the toast mirror under
  `dir="rtl"`.
- **Changed: titanium's one chamfer diagonal**, top-left and bottom-right, on
  the switch thumb, the wizard step and the tooltip (were top-right and
  bottom-left, the tooltip top-right only). The skeleton line and the empty
  state, which named a custom property the dialog's registered
  `--kp-sig-ti-cut` had made invalid and so were never cut, now carry it.
- **Changed: titanium's spinner is the facing cut** [Kenny on
  research/titanium-spinner, 2026-10-07 01:33]. The drill (a 1.6 × 0.6 bar
  whose flutes travelled one pitch per 480 ms) is replaced by the end face of
  a bar turning on the lathe: turning grain and a centre point, a bright tool
  tip running round the face and leaving the oxide film in its track, gold
  to cyan. Square at `--kp-spinner-size` (so it fits the busy panel, the
  status line, a calendar day and a busy button), one turn per 1800 ms,
  linear, clockwise and mirrored under `dir="rtl"`
  (`kp-sig-titanium-ti-facing`); under reduced motion it stands still, the
  tip with its tail. Same contract: one span, `--kp-spinner-size`,
  `role`/`aria-*` on the span.

- **Removed: three themes, `lapis`, `shade-light` and `shade-dark`**
  [breaking, next major release; Kenny, 2026-10-06 23:49: "Ik heb ook
  beslist van drie themas te laten vallen, Lapis, Shade (light) en Shade
  (dark) mogen vanaf nu verwijderd worden."]. Kenny decided to drop them
  from the set, which leaves nineteen themes. Gone with them: their token
  sources (`themes/<name>/`), their registers (`css/<name>-register.css`
  and the `./css/<name>-register` and `/min` exports), their blocks in
  `css/themes.css` and entries in `js/theme-registry.js` (and so in the
  `ThemeName` type), the lapis texture in `css/_rules.css`, their 15
  `kp-sig-<theme>-meter-*` TIMINGS rows, their hooks, the four font
  families only they used (Source Sans 3 shipped as `KP Shade Sans`, Source
  Serif 4, Vazirmatn, Markazi Text), their showcase, compare and concept
  pages, and their theme-specific tests. A page that stores one of the
  three names falls back to the default theme. See MIGRATION.md.
- **The meter draws itself each theme's way in all 22 registers** [feature,
  9.3.0; research/character-meter round 4, Kenny's picks of 2026-10-05]:
  cyberpunk 2/3/2/3/3, high-contrast 2/3/1/1/3, shade-light 1/3/1/1/2,
  shade-dark 1/3/1/1/2, retro 1/2/1/2/2 and grotesk 1/2/3/3/2 (shape, while
  loading, how the share arrives, when the tone changes, the mark past the
  end) carry their meter in `kp.signature` on the package's own `.kp-meter`
  markup and states, and dark moves to 1/2/3/3/3 (the oxide film runs while
  loading, the share pressed in): 32 keyframes `kp-sig-<theme>-meter-*` with
  their TIMINGS rows. Measured in Firefox against the demo's composed
  combination: identical pixels in drawn, loading, warning, destructive, a
  mark past the end and a share past the end, in all seven, at full and
  reduced motion.
- **The meter draws itself each theme's way in sixteen registers** [feature,
  9.3.0; research/character-meter round 3, Kenny's picks of 2026-10-05]:
  formal, light, dark, synthwave, pastel, terminal, forest, sepia,
  blueprint, solstice, brutalism, deco, phantom, lapis, nostromo and
  titanium each carry their picked shape, loading picture, arrival of the
  share, reaction to a new tone and mark past the end in the
  `kp.signature` layer of their register, on the package's own `.kp-meter` (and
  `.kp-kpi__meter`) markup and states, with 77 keyframes
  `kp-sig-<theme>-meter-*` and their TIMINGS rows. Measured in Firefox
  against the demo's composed combination: identical pixels in drawn,
  loading, warning, destructive, a mark past the end and a share past the
  end, in all sixteen. Cyberpunk, high-contrast, shade-light, shade-dark,
  retro and grotesk keep the plain meter until round 4.
- **The demo review dialog no longer sinks on every approval** [fix-102,
  2026-10-05]: opened from the hub, research/_review/review.js opened its
  dialog before the catalogue shell moved the body's children into its
  column, which took the dialog out of the top layer; it stayed open as a
  plain box after the answer and moved down as the answer grew (840 to
  1096 px over ten approvals on character-graph). The dialog now opens once
  the page's scripts have run, modal, at 36 px in every theme; pinned by
  tests/review-kit-dialog.spec.mjs.
- **The plain key-figure strip keeps one height, one-line labels and a
  frame that reads** [fix-101, 2026-10-05]: in a strip with columns
  (`data-kp-kpis-columns`) the label, the figure and two lines of words
  keep their line boxes in every state, so the strip no longer moves
  (79.4 to 139.2 px in one strip before, 121.2 px tiles now in all 22
  themes); every label is one line, never cut, stepping down with the
  tile, and attachKpiStrips() takes fewer columns while one does not fit,
  in a phone pane too; the tile is framed in `--border-strong`, at 3:1 or
  more on the page (was 1.21 to 2.72:1 in 20 themes), through the new knob
  `--kp-kpi-border` that dark and titanium mix a share of ink into. The
  destructive tile's frame mixes into `--border-strong`; a trend tile's
  hover draws `--ring`.
- **A page's first render no longer arrives as news** [fix-100]: since
  every opposite motion became a mirror, the chrome a late module drew into
  an eased box on load (a data table's pager, group and edit buttons, a
  combobox's list) arrived as the theme's leave played backwards, 346
  elements on the catalogue's index in a queue of about ten seconds, and
  the table's pager bar stood 186 px tall instead of 52 until a click. A
  box now takes what it is given in its first two frames, and under a root
  wearing `data-kp-settling`, at once; js/auto.js holds the root of every
  `attachAll()` so until its modules have attached and two frames are
  painted (`SETTLING_ATTRIBUTE`, `settleAfter()` in js/as-of.js). Only what
  is added after that arrives: an opened group, a new toast. Measured in
  Firefox on catalogue index, data and table in formal, cyberpunk and
  terminal: 0 arrivals in the first 2 s (was 331 to 346), the bar 52/53 px
  from the first frame, no console errors.
- **The progress bar in three sizes** [9.3.0, feature; Kenny, 2026-10-05:
  "zodat dit de kleine is, een midden en een grotere optie"]: the bar as it
  was is the small one, and `.kp-progressbar--md` and `.kp-progressbar--lg`
  (React: `size="md" | "lg"`) make it 1.5 and 2 times as tall. One number,
  `--kp-progressbar-scale`, that the base track and all 22 registers'
  signature bars multiply their drawing by (heights, glyphs, cells,
  pitches, travel distances; line weights stay), so each theme's bar grows
  as one drawing; the label and reading in the same row step to 16 and
  18px (`--kp-progressbar-text`). The small bar is pixel-identical to 9.2.1.
- **A data table's group folds as the mirror of its open** [scope-143;
  Kenny's form v21, 2026-10-05]: while the rows play their arrival
  backwards the table box eases shut on the open's curve turned around, in
  the same time, ending where the open began (it snapped shut in one frame
  once they had gone). The rows carry `data-kp-folding="out"`, which
  `easeSize` leaves out of the box's settled height; the glide ends with the
  rows' own motion. A box no longer holds its glide for an element whose
  leave or arrival folds sideways or is not drawn: the catalogue's tables
  snapped open and shut for the ten seconds the page's first arrivals took.
  Measured in Firefox over 22 themes (catalogue Tables, group "home"): the
  fold's glide is the open's frame for frame turned around within 0.017 px,
  in the open's time (192 to 480 ms), held back only as long as the rows'
  own playback outlasts it (0 to 312 ms); the fold ends 179 to 545 ms after
  the click (was 412 to 1029 ms, the box waiting for the rows); in the first
  seconds after load the box no longer jumps 120 px in one frame either way;
  under reduced motion both are instant; no console errors.
- **The trend tile: a figure and a change on half a pair, a label that
  moved the tile** [fix-99, 2026-10-05]: a key figure's change with a tone
  carries its status pair (`--success` under `--success-foreground`,
  `--destructive` under `--destructive-foreground`), 4.51:1 or more in all
  22 themes (was 1.00:1 in high-contrast, shade-light and grotesk, 4.11:1
  in solstice); the figure in a tone sits on that tone's pair, one rule for
  both tones, the plate hugging the figure with its unit and note in the
  plate's ink: warning 4.55:1 or more (was 1.00:1 in high-contrast, 1.04:1
  in shade-light), destructive 4.79:1 or more (was 4.11:1 in solstice to
  4.47:1 in synthwave, six themes under 4.5:1); and the trend tile's label
  is one line, never wrapped and never cut: it steps down with the tile's
  width (`--kp-text-xs` to seven eighths of it, `5cqi`), and where it still
  does not fit, the strip (`attachKpiStrips()`) takes its next allowed
  column count, so the tile grows to its label and the row stays aligned
  (the catalogue's trend strip: two columns of 469 px in 16 themes, four of
  228.5 px in six; the phone pane one column of 360 px; tiles 187.2 px
  tall, were 205.2 to 242.7 px).
- **The month heatmap: a ring that hid, dimmed figures, a wrapping title**
  [fix-98, 2026-10-05]: today's ring is drawn in the day's own ink
  (`currentColor`), 4.51:1 or more on every tone in all 22 themes (was
  1.29:1 in shade-light, 1.45:1 in shade-dark, 2.50:1 in nostromo);
  `.kp-calendar` sets `--kp-busy-opacity: 1`, so a loading day's figure
  reads 4.52:1 or more (was 2.65:1 to 4.81:1 under the 0.7 dim); formal's
  amber day takes a twentieth of `--foreground` in its ink, 4.78:1 (was
  4.51:1, 4.44:1 under the paper grain); the nav's title and buttons stay
  on one line, the title stepping down under a 334 px nav and taking a
  row of its own over the buttons below the new knob
  `--kp-calendar-nav-fit` (20.5rem; twelve registers set their own), so
  the calendar keeps one height in every month (the title took up to six
  lines in nostromo's phone pane); and a stretched calendar keeps its
  rows at the top (`align-content: start`; the weekday row grew from 18
  to 48 px).
- **The time chart's tooltip: a change that wrapped, a dot that hid**
  [fix-97, 2026-10-05]: the change column is no longer a fixed 4.5rem but
  at least `--kp-chart-delta-width` (default 5.5rem) and as wide as its
  change, on one line (`▼ 74.5 KiB/s` wrapped in 16 of 22 themes, and in
  terminal the pinned pressure tooltip's changes in bar too); an event's dot in the
  tooltip carries a 1.5px ring in the popover's ink, so the warning dot
  reads at 5.00:1 or more on the plate in all 22 themes (was 1.07:1 in
  shade-light, 1.00:1 in high-contrast, 1.04:1 in nostromo, 1.38:1 in
  shade-dark).
- **Fewer clicks per verdict on the review site** [Kenny, 2026-10-05]: every
  block with try-buttons gets **▶ Play** beside Approve (and in the review
  dialog), pressing them in turn with a caption and a pause set by the
  theme's motion (`catalogue/play.js`, `data-cat-play` to order or limit);
  the look is also a checklist with ticks per block and theme and buttons
  for the controls it names (`catalogue/checklist.js`); keys A, R, N, P, T
  and K, with Alt in the dialog's note (`catalogue/shortcuts.js`); the theme
  menu counts what is left per theme; the dialog can open by itself on the
  last block; and `catalogue/changed.html` gathers only the open pairs of
  the theme on screen (`catalogue/open-pairs.js`).
- **Kenny's phantom and shade-light review** [scope-143, 2026-10-05]: the
  catalogue's try-buttons work on the review page too (a block is wired by
  what it carries, when it is composed, not by its id at import: the key
  figures' columns, the trend tiles' data, the meter, the tile set, the
  remembered board, the data table's reload); the rich menu keeps clear of
  sticky side bars as well (`coveredEdges` on all four edges) and its
  loading plate is opaque; the review dialog switches themes in 0.25 s
  instead of 7 s (hashes are kept across a theme change); the navigation
  dropdown grows with its longest row (`width: max-content`, nav-dropdown-M1
  closed); a theme switch restamps only the effect hosts on screen.

- **A dropdown is as wide as its longest link** [nav-dropdown-M1; Kenny,
  form v18, 2026-10-05]: `.kp-nav__menu` takes `width: max-content` above its
  12rem floor, so a long link no longer breaks onto two lines (a 38-character
  link took two or three in all 22 themes). The wider panel is still slid
  inside the window by `--kp-nav-menu-shift`; the mega menu and the phone
  drawer keep `width: auto` and are unchanged.
- **Information that updates in place** [Kenny's picks on
  research/update-motion, 2026-10-05]: `update(el, next)` in the new
  `js/update.js` (`@kp-soft/themes/js/update`, also on the root) writes a new
  value into a text element, a `.kp-state-word` or a spark at once and plays
  the register's update once at the theme's time (`--kp-update-duration`,
  max(resize, close) × 1.25 from `themeMotion()`), marked
  `[data-kp-updating]`. Formal lands a checked stamp (`stamp`), cyberpunk
  glitches and settles (`glitch`), titanium runs a heat tint across it
  (`anodise`), each declared in `--kp-update` with its keyframes in
  kp.signature; the other nineteen registers declare none, so there the value
  simply changes. Reduced motion: the value changes and nothing plays. The
  catalogue's Motion page has the block "Information that updates in place".
- **Every opposite motion is a mirror** [scope-143; Kenny, 2026-10-05]: in
  all 22 themes a dialog opens as its close played backwards and a card
  arrives as its leave played backwards (`--kp-open: reverse-close` in
  every register; several arrive one by one top first, the mirror of the
  leave's bottom-first stagger); a shrink runs on the grow's curve turned
  around (`sizeEase`, for easeSize, attachFold and tile sets); the sidenav
  rail and its submenus collapse on their expand curve turned around; a
  tooltip and the tour card hide by playing their entrance backwards; a
  toast leaves through `leave()` (`TOAST_HIDE_EVENT` fires once it is
  gone); a data table's group rows fold by playing their arrival backwards,
  and the table no longer replays arrivals on a sort or a rebuilt pager.
  The catalogue's size-selector block rebuilds its cards from the sample
  data (a grown card eases back) and lets a removed card's box go.
  Research demo `research/update-motion`: information updating in place,
  three ideas per theme for formal, cyberpunk and titanium.

- **Opening as the reverse of close** [scope-143]: in formal, cyberpunk and
  titanium a dialog opens, and a card arrives, as its theme's close and
  leave played backwards (`--kp-open: reverse-close` in the register,
  played by js/motion.js from the theme's own keyframes and timings; the
  other themes keep their entrances). Approved from `research/open-reverse`
  (2026-10-05). A research demo page no longer carries the catalogue's
  Copy prompt beside its own Copy answer.

- **Kenny's deco review, round one (2026-10-05)** [scope-143]: the rich menu
  always opens fully on screen (`menuPlacement()`: the other edge, above the
  button, or clamped, clear of sticky bars; 144 of 144 cases measured); the
  meter's share past the end is offered in four signs on the catalogue
  (`.kp-meter--over-hatch`, `--over-spill`, `--over-break` beside the ▸);
  the month heatmap's loading in three looks (`.kp-calendar--busy-days`,
  `--busy-whole` beside the pulse) and its live update named; the action
  list's stacked buttons under 30rem are centred; `setAttention` no longer
  moves the items under a leaving one; `easeSize` no longer restarts a
  glide every frame when the box is a flex column (`data-kp-gliding`),
  keeps fractional heights, and watches the box itself; `attachFold` glides
  an `open` set from outside (`data-kp-folding`); `.kp-tiles` ease every
  tile together (`data-kp-tiles-easing`, `sizeMotion()`); `leave()` closes
  the flex gap it leaves. Research demo `research/open-reverse`: opening as
  the reverse of close, in formal, cyberpunk and titanium.

- **Menu button with a rich menu** [scope-143, port spec B]:
  `.kp-menu-button` with a `.kp-menu.kp-menu--rich`, on the package's own
  `.kp-menu` and `.kp-menu__item`, wired by the new `js/menu-button.js`
  (`attachMenuButtons`, `setMenu`, `openMenu`, `closeMenu`, the pure
  `menuSignature` and `menuKeyTarget`; events `kp-menu-open`, `kp-menu-close`
  and the cancelable `kp-menu-select`; `decorate`). Every other action of a
  page, grouped under small muted capitals (`.kp-menu__group`,
  `.kp-menu__heading`, which names its `role="group"`), each a label over a
  one-line hint; an action that cannot be used now keeps its hint, says why
  under it in italics (`.kp-menu__reason`) and stays focusable
  (`aria-disabled`). The keys of an APG menu button (↓ ↑ wrapping, Home,
  End, a letter, Esc that the page does not hear, Tab); a fill that shows
  the same is skipped and one that arrives while the menu is open waits for
  it to close; loading, empty (`data-kp-menu-empty="hide|disable"`) and a
  menu that scrolls past its height. In a page header of 40rem or less the
  open menu spans the header's buttons. Words in the dictionary
  (`menuLoading`, `menuEmpty`). Knobs: `--kp-menu-rich-min`,
  `--kp-menu-rich-max`, `--kp-menu-max-height`. Catalogue:
  overlays.html#menu-button.

- **Help drawer and a short tour** [scope-143, port spec I.3]: `.kp-drawer`
  (a head, a body that scrolls, a foot that stays; a `dialog.kp-drawer` at
  the end edge at full height), `.kp-help` cards whose `.kp-help__list`
  puts the words beside their meanings (over them in a card of 22rem or
  less), and the new `js/tour.js`: `startTour(steps, { start, remember,
returnFocus, onEnd, decorate, strings })` shows one non-modal card
  (`.kp-tour`) per step, 12 px beside its part and 16 px inside the window,
  following it on scroll, with an exact count (a step whose part is not on
  the page is left out first); the part is ringed and the rest of the page
  dimmed (`data-kp-tour-target`). Back, Skip, Next/Done, ← →, Esc; the focus
  returns where it was. A tour that ended is remembered through
  `js/remember.js` (component `tour`; `tourMemoryKey`, `tourRemembered`,
  `forgetTour`), and `shouldStartTour()` starts it on `?tour` or a person's
  first visit only. Words in the dictionary (`tour…`). Knobs:
  `--kp-drawer-width`, `--kp-help-term`, `--kp-tour-width`. Catalogue:
  overlays.html#drawer and #help-tour.

- **A meter with a mark** [scope-143]: `.kp-meter` is a used-of-total bar
  for anywhere (a table cell, a line of words with `.kp-meter--inline`), and
  `.kp-kpi__meter` is now the same meter. `--kp-mark` puts a tick across the
  bar that sticks out above and below without making it taller; a share or
  a mark past the end (`data-kp-over`) shows a small ▸ at the end;
  `data-kp-tone="warning|destructive"` colours the fill and
  `data-kp-loading` pulses the track. `setMeter(el, { value, mark, tone,
label, markLabel, loading })` in `js/kpi.js` writes it all with its ARIA,
  the real share past 100 % in `aria-valuetext`; also `meterText()` and
  `meterParts()`, and the dictionary words `meterUsed`, `meterNotMeasured`
  and `meterMeasuring`. Knobs `--kp-meter-height`, `--kp-meter-fill`,
  `--kp-meter-mark-colour`, `--kp-meter-mark-overhang`, `--kp-meter-halo`,
  `--kp-meter-inline-size`. A `.kp-kpi__meter` no longer clips what sticks
  out of it. Catalogue: data.html#meter.
- **Key figures never leave one tile alone** [scope-143]:
  `.kp-kpis[data-kp-kpis-columns="all 3 2 1"]` takes the first allowed column
  count at which every tile is at least `--kp-kpi-min` wide, by the strip's
  own width, and steps down when that would leave one tile alone on the last
  row; when no count avoids it, the last tile spans the row
  (`data-kp-kpis-span-last`). `attachKpiStrips()`, `fitKpiStrip()` and the
  pure `kpiColumns()` in `js/kpi.js`; `js/auto.js` loads it for such a strip.
  Catalogue: data.html#kpi-columns.
- **A key figure with its 24-hour trend** [scope-143]: `.kp-kpi--trend`
  stretches its `.kp-kpi__link` over the tile (↗ alone in a narrow tile) and
  takes "avg 15 min" in its label (`.kp-kpi__label-note`); the label wraps
  between words and is never cut (the note moves to the next line as one
  unit), every state is as tall as filled (value line, two or three lines of
  words, knob `--kp-kpi-trend-lines`, and the axis row kept), and the line
  takes the figure's `--kp-chart-series`. The time chart's
  spark variant gains two options: `data-kp-spark-head="none"` reads a point
  in a chip over the line, on the trend's own crosshair, and follows the
  tile's link on a click that was not a drag; `data-kp-spark-axis="relative"`
  puts `14:40 yesterday` … `now` under the line. New in `js/chart.js`:
  `setTrendData()`, `trendAxis()`, `attachTrendCharts()`, `TREND_CHART`, the
  option `now` of `attachCharts()`, and the dictionary words `chartToday`,
  `chartYesterday` and `chartTrendKeys`. Catalogue: data.html#kpi-trend.

- **Month heatmap** [scope-143, port spec I.1]: `.kp-calendar` in a
  `.kp-calendar-layout` (calendar | the page's own detail, one column under
  45rem), built by the new `js/calendar.js` (`attachCalendars`,
  `setCalendarDays`, `setCalendarState`, `setCalendarLegend`,
  `calendarSelect`, `calendarMonth`, the pure `monthCells`, `shiftDay`,
  `shiftMonth`, `dayKey`; events `kp-calendar-pick` and `kp-calendar-month`;
  `decorate`). A month of days, each a plate in the colour of its state
  (`ok`, `warn`, `bad`, `muted`, `future`/`before` dashed, `none`, `loading`
  pulsing only without reduced motion), its count under the number; always
  six week rows of 42 cells built once and updated in place, the neighbouring
  months' days as quiet numbers, a night with nothing done told by its red
  plate and its words alone. One tab stop with the keys of a date grid
  (arrows, Home/End, Page Up/Down, Shift for a year); today is the day in
  Europe/Brussels whatever the reader's zone, and every day reads
  `dd/mm/yyyy: …` (rule 52). Words in the dictionary (`calendar…`). Knobs:
  `--kp-calendar-aside`, `-gap`, `-cell-height`, `-cell-font`, `-title-size`.
  Catalogue: data.html#calendar.

- **Network graph** [scope-143]: `.kp-graph` and `js/graph.js`, a picture
  of a network with one centre: the hub in the middle, the other nodes on a
  ring from the top, clockwise, A to Z and then the nodes outside the
  network, the links drawn by kind (a colour and a dash each) and listed
  above the picture with Show all. Each node takes its own hue at the
  theme's chart lightness (`--kp-graph-hue` over `--chart-1`, no literal
  colour). Hover or focus a node to see only its links (classes only, no
  node rebuilt); click or Enter keeps it picked, several at once; Esc or
  Show all clears; the picture is one tab stop and the arrows walk the
  ring. Two links between one pair bend apart (0, ±26). A label points
  away from the hub and is shortened with an ellipsis where it would touch
  another or leave the picture, fitted again when a web font arrives; the
  full name stays in the title and the accessible name. Loading, empty and
  error keep the picture's height. `attachGraphs(root, { decorate, strings })`,
  `setGraphData()` (or a `script[data-kp-graph-data]` JSON child),
  `setGraphState()`, `graphSelect()`, `graphHideKind()`, the pure
  `graphLayout()`, `graphBends()`, `hubOf()`, `ringOf()`,
  `graphLabelText()` and `fitGraphLabels()`, the event `kp-graph-change`,
  the knobs `--kp-graph-h`, `--kp-graph-label-size`, `--kp-graph-dim`, and
  the dictionary words `graph…`. Approved in formal from
  `research/dashboard-ports-2` (each node its own colour; the kinds above
  the picture); catalogue: chart.html#graph.

- **Data table: one open row, groups that fold, Enter on a row, and
  `decorate`** [scope-143, J2]: `data-kp-expand-single` (or
  `expandSingle`) keeps one row open, and the opening's
  `kp-datatable-expand` names the row it closed in `closed`. A heading row
  `tr data-kp-row-group="<key>"` folds the rows marked
  `data-kp-group-of="<key>"` with a real button (`aria-expanded`,
  `aria-controls`, `strings.tableGroupRows`); a sort orders rows within
  their group, the status line keeps the exact number while a group is
  folded, `[data-kp-group-count]` counts each group's matched rows, the fold
  survives `refresh()` by key, and the handle has `fold()`,
  `view().folded` and the event `kp-datatable-group`. Enter or Space on a
  row or grid cell that holds the focus opens it as a click does, and
  `refresh()` keeps the focus on the toggle that had it, by key. The attach
  option `decorate(part, info)` is called with every row toggle
  (`row-toggle`) and group toggle (`row-group-toggle`) it builds. All off
  until asked for; catalogue: table.html#datatable-expand-groups.
- **Time chart: dates and times follow rule 52** [scope-143]: every time the
  chart prints is `dd/mm/yyyy HH:mm` (or a part of it) on a 24-hour clock in
  Europe/Brussels, whatever the reader's zone and the page's language. The
  tooltip's head and an event marker's title read `04/10/2026 14:05`, an
  event line `14:05`, the time axis `14:00` below a day's stride and
  `04/10/2026` from a day on (the 7 d range), and the zoom chip names both
  dates once a zoom spans two days
  (`Zoomed: 03/10/2026 22:00 – 04/10/2026 02:00`; it read `22:00–02:00`).
  Until now the chart printed through
  `Intl` in the browser's zone ("Sun 4", "Sun 4 Oct, 14:05", `02:05 PM`
  under `en-US`). The time axis lands on round wall-clock times in that
  zone, worked out tick by tick: six-hour ticks on 00:00, 06:00, 12:00 and
  18:00 across a change of the clock, day ticks at Brussels midnight (one
  `getTimezoneOffset()` of the browser at the window's start did it before).
  New: `attachCharts(root, { timeZone, time })` with
  `time(ms, style, ctx)` and the styles `clock`, `tick`, `full` and
  `range`; the exports `numericTime()`, `timeTicks()` and
  `CHART_TIME_ZONE`; the dictionary word `chartZoomedSpan` (a reworded
  `chartZoomed` keeps working). `locale` now steers the numbers only.
- **Time chart: units, groups across calls, control from the page, every
  state** [scope-143, port-spec-M1]: `unitKind` (`bytes`, `bytes/s` or
  `rate`, `percent`, `celsius`, `count`, `flag`) prints values the
  dashboard's way with the unit on the axis (`0 B`, `1.0 GiB`, `2.0 GiB`;
  `3.2 MiB/s`), a percent axis of 10, 25, 50 or 100 that goes above 100 when
  a value does (nothing cut off), and counts exact outside the axis
  (`12,345`; `12.3k` on the axis only); `format(v, where, chart)` and the
  export `formatChartValue()`, and `niceMax(v, kind)`. A group is its
  element's across `attachCharts()` calls (a chart attached later shares the
  crosshair and the zoom), charts outside any group share the page's, and a
  zoom chip may sit anywhere (`data-kp-chart-zoom-for`); `kp-chart-zoom`
  reaches the document when there is no group element. New exports
  `chartSelect(el, index, on?)`, `chartZoom(el, zoom)`, `detachChart(el)`,
  and `nextSelection()` in js/chart.js; the option `decorate(part, info)` marks every legend
  source, Show all, ✕, plot, range button and zoom Reset, each time it is
  built; `key` in the data (`data-kp-key`). After a live update only the
  chart under the pointer, or a pinned one, shows its tooltip; a pin the
  window moves past stays docked with `(pinned, outside the window)` until
  ✕; leaving a chart no longer clears a crosshair another chart has taken.
  States at the plot's final height (`--kp-chart-height`): loading
  (`data-kp-chart-loading`, `data-kp-chart-sources`), no readings
  (`chartEmpty`), `{ error }`, one reading (a whole dot, `onePointNote`,
  `chartOnePoint`); new words `chartEmpty`, `chartOnePoint`, `chartLoading`,
  `chartPinnedOutside`. Unit tests in gates/chart-api.test.mjs; measured in
  firefox at 1280 and 390 px (A7.6 to A7.15 and the states table, no console
  errors). Catalogue: chart.html#time-chart-units, #time-chart-states,
  #time-chart-chip-elsewhere, #time-chart-no-group.
- **Every alert's text reads at 4.6:1 or more on its plate** [scope-143,
  alert-contrast-M1]: measured in firefox over all 22 themes (440 distinct
  ink-on-plate pairs: the label and body of the five catalogue alerts and
  the long warning, the title, text and icon of the attention band's three
  items), 22 text pairs read under 4.6, the lowest 4.49. Raised: formal
  warning 4.51 → 4.78, light info 4.51 → 4.79, pastel success 4.57 → 4.79
  and warning 4.58 → 4.75, forest success 4.51 → 4.75 and info
  4.59 → 4.80 (each ink drawn 5 % towards the page's `--foreground` in the
  register), shade-light warning 4.55 → 4.67 (its light ink drawn 60 %
  towards `--card`), and shade-dark's info item on the attention band
  4.49 → 4.71. The band's plate takes the new knob `--kp-attention-tint`
  (default 8 %, unchanged elsewhere), which shade-dark sets to 6 % on its
  info item. The lowest text pair now reads 4.63; no token changed, and the
  band's items keep the page's own text in every theme.
- **The attention band follows a live page** [scope-143, attention-live-M1]:
  `attachAttention(root)` also orders a `.kp-attention` added after it ran
  and lets go of one that leaves (its watcher disconnected). New
  `setAttention(band, items)` sets a band's problems by key
  (`data-kp-key`): an unchanged item stays the same element and only what
  changed is rewritten, so a critical problem is put into the page (and
  announced) once rather than on every poll and a focused fix keeps its
  focus; a new key builds the 9.2.0 markup, a missing one leaves through
  `leave()`. New dictionary words `attentionCritical`, `attentionWarning`,
  `attentionInfo`. Measured in firefox: a band inserted after attach reads
  critical before info, a critical item kept over four refreshes is
  inserted once, focus on its fix survives a refresh. Catalogue:
  feedback.html#attention-live.
- **Only what is new arrives** [scope-143, arrive-none-M1]:
  `data-kp-arrive="new"` on a box (or `attachMotion(root, { arrive: 'new' })`)
  keeps a row redrawn under the key of a row that just left still
  (`data-kp-key`, `data-kp-row-key`, `id`, plus `arriveKeys`), and only a
  row with a new key arrives; a sort, an unkeyed redraw of as many rows and
  data replacing a skeleton do not arrive either. The test is the homelab
  dashboard's, exported as `repaintedIn(records, { keys })` and unit-tested
  with its cases (gates/motion-arrive.test.mjs). Measured in firefox: five
  keyed rows redrawn, 0 arrivals (3 in the default mode); a sixth key, 1;
  three unkeyed rows redrawn as four, 1; the same five reversed, 0.
  Catalogue: motion.html#arrive-new.
- **Size motion: a selector option, and boxes that leave are let go**
  [scope-143, size-motion-docs-M1]: `attachMotion(root, { size })` eases a
  consumer's own boxes by selector, also those added later; a box, dialog or
  disclosure that leaves the page has its observers disconnected a
  microtask later (a move stays), and `motionWatchCount()` reads how many
  are watched. Measured: 1000 boxes added and removed return the count to
  where it was; a 158-cell box redrawn costs about 5 ms per change.
  Catalogue: motion.html#size-selector.
- **Tiles of one height across a board** [scope-143, tiles-board-M1]:
  `data-kp-tiles-set="<name>"` makes the `.kp-tiles` grids under it (or
  carrying it, across branches by name) share the set's tallest visible
  tile as the floor of their rows, `--kp-tile-row-min`, measured and
  written by `attachTileSets(root)` in the new `js/tiles.js` (in
  `js/auto.js`, `index.js` and the exports map). Folded and hidden tiles do
  not count; it writes only when the height changed. Measured in firefox
  with the spec's 72/96 px tiles: all 96, back to 72 within a frame when the
  tall one goes, 72 with its fold closed, 0 style writes on an identical
  refresh. Catalogue: data.html#tiles-set.
- **A freshness line that ticks** [scope-143, freshness-M1]: the new
  `js/freshness.js` rewrites every `[data-kp-ago]` once a second with one
  timer per page ("updated 12 s ago", "2 min 5 s", "1 day 1 h"; the words
  in the dictionary: `agoText`, `agoNever`, `agoSeconds`, `agoMinutes`,
  `agoHours`, `agoDays`, `agoVerb`, `agoStale`, `agoFresh`,
  `agoInLiveRegion`), from `datetime` or `data-kp-ago`, with the verb in
  `data-kp-ago-verb`. The title is the moment as rule 52 writes it
  (`04/10/2026 14:00`, Europe/Brussels); `data-kp-stale-after` sets
  `data-kp-stale`, a warning plate drawn without a size change; the line
  reserves the width of its unit's longest text, is `aria-live="off"`,
  warns once inside a live region, can announce only stale and fresh
  (`data-kp-ago-announce="state"`), and pauses while the tab is hidden.
  Exports `attachAgo`, `setAgo`, `agoText`, `humanDuration`, `agoMoment`,
  `momentOf`; in `js/auto.js`, `index.js` and the exports map; unit tests in
  gates/freshness.test.mjs. Measured in firefox with a fake clock: one
  width (180 px) over 70 ticks from 0 s, stale at 181 s with the box
  unchanged, correct on the frame the tab is shown after 5 min hidden.
  Catalogue: feedback.html#freshness.
- **Remembered disclosures on a page that rebuilds them** [scope-143,
  size-motion-docs-M1]: `attachRemembered(root)` wires a
  `<details data-kp-remember>` added later and paints its memory before the
  first frame (measured: rebuilt closed, `open` false on the first frame),
  and lets go of one that leaves; `data-kp-remember-hold` on it or an
  ancestor stops painting and writing until it goes, then paints the stored
  state back; `forgetRememberedExcept(component, prefix, names)` prunes the
  names no longer used. `.kp-accordion__item--bare` is the accordion's
  glide without its chrome. Catalogue: structure.html#remember-later.
- **Row buttons on a narrow screen** [scope-143, action-columns-narrow-M1]:
  under 30rem a `.kp-action-list` stacks its buttons under the row's text,
  one per line on one left edge, each label on a single line, never wrapped
  or cut (Kenny's UI rule; the equal columns cut "Review and update all 4…"
  by 20 px). The narrow table's
  stacking holds for any `<table>` holding `.kp-row-actions`: in the
  `kp-table` container under 30rem, and outside it while the window is under
  48rem. A table's measured widths count a register's button margin (sepia's
  label sat 5 px into its padding). Measured in firefox over all 22 themes:
  no label cut or wrapped, stacked under 30rem and in the plain table. Catalogue: table.html#action-columns-narrow.

## 9.2.1 — 2026-10-04

- **An alert's close button takes the alert's plate and ink** [fix-95]: in
  every register `.kp-alert .kp-icon-button` draws no plate or border of its
  own and inherits the alert's colour, as the toast's close button does
  since 9.2.0. Measured before the fix: eleven close buttons in seven
  themes under 4.5:1 (forest and brutalism 1.03). The severity-contrast test
  now reads the alerts as well as the toasts.

## 9.2.0 — 2026-10-04

- **Buttons in shared columns** [scope-143]: `.kp-action-list` (a list whose
  rows are one grid) and `.kp-row-actions` line a list's row buttons up in
  columns, by position from the end with no script, or by role
  (`data-kp-action`) through `attachActionColumns()` in the new
  `js/actions.js`, which also measures a table's. On a phone the buttons go
  under the text, side by side in equal columns over the full width.
- **Tiles of one height** [scope-143]: `.kp-tiles` lays `.kp-card`s out with
  every row as tall as the tallest tile and each footer on the bottom edge.
- **Key figures** [scope-143]: `.kp-kpis` and `.kp-kpi` (label, value with a
  unit and a note, trend, delta, sparkline, meter, warning and destructive
  tones). The new `js/kpi.js` draws `svg[data-kp-spark]` as a line over a soft
  area and makes a `button.kp-kpi--toggle` a filter: pressed, a primary border
  over a faint primary background; it fires `kp-kpi-toggle`.
- **Page header** [scope-143]: `.kp-page-header`, the title and description
  beside the page's actions with a "More ▾" overflow menu; on a phone the
  primary comes first at the full width.
- **Attention band** [scope-143]: `.kp-attention`, one soft-tinted alert per
  problem with a coloured edge, no room at all when empty, kept worst first
  in the DOM by `attachAttention()` in the new `js/attention.js`.
- **A state word that keeps its width** [scope-143]: `.kp-state-word` with
  `data-kp-words`, and `setStateWord(el, word)` in `js/components.js`.
- **A data table loading on a phone** [scope-143]: in a table under 30rem the
  busy overlay's panel lies flat (the spinner beside the words, three lines at
  most) and the layer is clipped to the table.
- **Time chart** [scope-143]: `.kp-chart`, `.kp-chart-group`,
  `.kp-chart-ranges` and `.kp-chart-zoom`, drawn by `attachCharts()` in the
  new `js/chart.js` from the page's data (`setChartData()` or a JSON child):
  a legend that singles a source out and keeps sources on, one crosshair per
  group, a tooltip beside it, drag to zoom, event markers, keys, range
  buttons and a spark variant. It fires `kp-chart-select`, `kp-chart-zoom`
  and `kp-chart-range`; its words are `chart…` in `js/strings.js`. The
  catalogue has a new page for it, `catalogue/chart.html`.
- **Back to top on every example page** [feat-page-1]: the generated example
  pages carry `.kp-to-top`, and the user guide says how to add it.
- **A narrow card's actions wrap** instead of breaking their own words
  (`.kp-card__header` wraps), and **the combobox clear button is centred on
  the input**, not on the whole box with its label and status line.
- **The catalogue shows every option and effect** with copyable markup: a
  Motion page, and blocks for the data table's live busy counter, failure
  reason and empty texts, undo after an action, inline confirm, count-up
  numbers, remembered navigation, `.kp-shell`, the error toast, date picker
  views and locale, the overflowing dialog, card actions, the theme status
  line, validation timing and reveals on every load.
- **Elements leave the theme's way** [scope-142]: `leave(el)` (js/motion.js)
  marks the element `[data-kp-leaving]` and every register now draws its own
  exit on it, one per theme, picked by Kenny on research/size-motion over
  rounds five to eight (formal folds up like a letter, terminal's block cursor
  deletes the line, retro shrinks in pixel steps, titanium anodises,
  cyberpunk glitches, high-contrast announces REMOVED, ...). The space closes
  during the exit, so the box around it shrinks along; then the element is
  removed (or hidden with `{ hide: true }`). Elements told to leave together
  go one by one, bottom first, the next starting halfway through the one
  before (`--kp-leave-stagger`, `--kp-leave-fold` and `--kp-leave-pause` to
  change it). `data-kp-arrive="none"` on a box keeps a live view's redraws
  from replaying every arrival.
- **leave() and arrivals follow their animation's own clock**: they end when
  their CSS animations (pseudo-elements included) have played out, at any
  playback rate, instead of on a fixed timeout.
- **The demo review kit asks for picks as ticked choices**
  (`data-review-choices`, per theme or once), each option explained, and
  puts them in the answer.

## 9.1.0 — 2026-10-04

- **A dialog leaves the way it came, and boxes ease to a new size**
  [scope-142]. `js/motion.js` (loaded by `js/auto.js`, attached by the React
  `Dialog`) closes every `.kp-dialog` by playing its theme's entrance
  backwards, in two thirds of the entrance's time, and eases dialogs,
  accordion items, tabs, the data table, toasts, the upload and combobox
  lists, the tree, the wizard, fields and any `[data-kp-size-motion]` box to a
  new height, growing and shrinking, in four fifths of it. Knobs:
  `--kp-close-max` (600ms), `--kp-size-max` (480ms), `--kp-motion-scale` (1).
  A closing dialog stays `open` until its motion ends; its `close` event comes
  then. Reduced motion: nothing moves.
- A size change never overshoots, a padded box no longer clicks smaller at
  the end of its glide, terminal grows and shrinks one line at a time, and
  what arrives in a box arrives with the theme's toast entrance
  [scope-142].
- Growing and shrinking have a character per theme [scope-142]: a register
  draws it on `[data-kp-resizing]` (the gliding box) and `[data-kp-arriving]`
  (what arrives), and may set `--kp-size-ease` or `--kp-size-steps: line`.
  Fourteen registers carry one (formal's ink, dark's darkroom, synthwave's
  neon, high-contrast's two clear steps, sepia's page, blueprint's plotter,
  solstice's dawn, shade's shadow, grotesk's cuts, lapis's gilt, nostromo's
  amber lines, titanium's drawer, light's bloom); the others use their toast
  entrance.
- Deco's dialog entrance is remade without a clip: the dialog unfolds from
  its top edge and the sunburst fans open. The circle clip it opened with
  stayed cut at the bottom corners in Firefox.

## 9.0.1 — 2026-10-04

- **A modal dialog opens centred under a CSS reset.** Tailwind's preflight
  sets `margin: 0` on every element, which took the browser's centring away
  from `<dialog>`, and a `.kp-dialog` opened with `showModal()` landed in the
  top-left corner (found in JobTracker, 2026-10-03). `.kp-dialog` now carries
  `margin: auto` and a modal one `inset: 0` itself; keep `tailwindcss`
  imported before the package (README).
- **The theme menu keeps every row on one line.** The React switcher's list
  is as wide as its longest row (`inline-size: max-content`, capped at the
  window), and a row does not wrap: the bold selected row broke onto two
  lines in high-contrast, shade-light and shade-dark (JobTracker,
  2026-10-03).

## 9.0.0 — 2026-10-03

**Breaking** [scope-140].

- **The progress bar is `.kp-progressbar`**, replacing `<progress class="kp-progress">`:
  one element whose track, fill and head every theme draws its own way, one
  line high and as wide from the first frame, the fill clipped to
  `--kp-value` (0 to 1) so only `clip-path` and `transform` move.
  `data-kp-indeterminate` without `aria-valuenow` is busy with no amount;
  under reduced motion nothing in the bar moves and the busy bar stands as
  stripes. Knobs: `--kp-progressbar-height`, `--kp-progressbar-max-width`,
  `--kp-progressbar-duration`, `--kp-progressbar-ease`. The keyframes
  `kp-progress-stripes` and the knobs `--kp-progress-max-width` and
  `--kp-progress-stripe` are gone. `.kp-progress-group`, `.kp-progress__wrap`,
  `.kp-progress__label` and `.kp-progress__value` stay. MIGRATION.md has the
  before and after.
- **A new cascade layer, `kp.signature`**, right after `kp.register`:
  `@layer kp.base, kp.components, kp.register, kp.signature, kp.layout, kp.utilities`.
  A page that declares its own layer order adds it there.

**Added** [scope-140].

- **Every theme draws its own signature** for the progress bar, spinner,
  skeleton, switch, checkbox and radio, toast, dialog (with its entrance and
  backdrop), tooltip, wizard steps, empty state and link hover, as Kenny
  approved them in three review rounds on 2026-10-03, at the end of each
  register file in `kp.signature`. Busy indicators move in a seamless loop;
  every skeleton line starts at the inline-start edge; the dialog titles keep
  the package's metrics (scope-87); nothing a theme draws on a focusable
  control covers its focus ring (DI2).

- **`js/progressbar.js`** (`@kp-soft/themes/js/progressbar`, loaded by
  `js/auto.js`): keeps `--kp-value` in step with `aria-valuenow`,
  `aria-valuemin` and `aria-valuemax`, writes the track, fill and head into a
  bar that carries only the outer element, and exports `setProgress(el,
value)`, `setIndeterminate(el, on)`, `attachProgressbars(root)`,
  `buildProgressbar(el)` and `syncProgressbar(el)`; the package root
  re-exports the two setters as `setProgressbar` and
  `setProgressbarIndeterminate`.

**Fixed** [fix-88].

- **A radio is round in retro and cyberpunk**: both registers drew every
  `.kp-field__check` square, so an option button looked like a checkbox.
- **Cyberpunk's wizard steps get their mono capitals**: the rule targeted
  `.kp-wizard__step`, a class the package never renders.

**Changed.**

- **An expandable data table row opens from anywhere in it** (Kenny, on the
  homelab dashboard's notifications: "ergens in die rij klikken, niet enkel
  op dat icoon"), and shows a pointer; a click on a button, link, field or
  checkbox in the row does only its own thing, and the toggle keeps Enter
  and Space.

## 8.1.0 — 2026-09-30

A minor: pages use the width of a wide screen, a loading table can show it
over its rows, and an indeterminate progress bar is striped again.

**Changed.**

- **`.kp-page` takes 80% of the window**, never narrower than the old 64rem
  and the whole width on a phone (Kenny: "gebruik standaard 80% vanaf nu van
  de breedte"). A wide desktop screen is used instead of left empty; text
  keeps its measure through `.kp-prose`, and `--kp-page-max` still sets any
  other width.

**Fixed.**

- **An indeterminate progress bar shows its stripes in every theme** [fix-86]:
  twenty registers set the track with the `background` shorthand, which
  reset the stripes, so a bar meaning "no idea yet" was an empty track. The
  registers set only the track's colour now. Reported by the homelab
  dashboard, which can drop its shim once it runs a release carrying this.

**Added.**

- **A loading data table can show it over its rows**: `busy({ text, since,
overlay: true })`, or `data-kp-busy-overlay` on the wrapper, sets a large
  spinner with the status words and the count over the rows while it loads,
  under the header and hidden from assistive technology; the status line
  stays the live region. Asked for by the homelab dashboard, where a long
  table's status line sat below the fold.

## 8.0.1 — 2026-09-29

A patch with nothing new for a web page that imports the package: the
documentation site and the review tools.

**Fixed.**

- **The documentation site's theme menu opens under its button**: Firefox
  drew it at the far left over the sidebar, and in Chromium it ran past the
  window's right edge.

**Changed (review tools)** [scope-138].

- **The review hash is the block's markup alone** (hash version 10), and
  `node gates/verdicts.mjs pixels` judges the rest: it photographs every
  approved block at its approval commit and at HEAD, and carries the
  approval when the pixels are equal. `catalogue/pixel-checks.json` records
  each outcome.

## 8.0.0 — 2026-09-29

A major that only removes: the themes for other programs leave for
repositories of their own, and nothing a web page imports changes.

**Removed (breaking)** [scope-139].

- **The Home Assistant, VS Code, TUI, Windows, Linux and Jellyfin themes
  moved to repositories of their own**: kp-themes-ha, kp-themes-vscode,
  kp-themes-tui (kp-tui renamed), kp-themes-windows, kp-themes-linux and
  kp-themes-jellyfin, each with its history. The `./ha/*`, `./vscode/*` and
  `./tui/*` exports and the `ha-themes.tar`, `vscode-themes.tar` and
  `kp-tui-palette.rs` assets are gone; MIGRATION.md says where each went.

**Added.**

- **`tokens.tar` on every release** [scope-139]: the tokens, `css/themes.css`
  and the modules that read them, which those repositories pin by version
  and sha256. `gates/terminal.mjs` holds the terminal colours and the sixteen
  ANSI that VS Code, Windows Terminal and Konsole share; `check:tokens-tar`
  unpacks a fresh build and imports every entry module from it.

## 7.3.0 — 2026-09-29

A minor for what the homelab dashboard met in use, two rounds of it, and for
the documentation site. The data table gains `busy()` with a count it keeps
itself and `fail()` with the reason in its words, every table can fail
visibly, a multi-sort summary has a line of its own, and a bar's ghost and
icon buttons wear the bar's ink at rest and on hover. Dark's pointer effect
follows a theme switch. The site carries a theme switcher on every page and
the catalogue's blocks as more examples on every component page.

**Fixed.**

- **A ghost or icon button in the bar wears the bar's ink** [fix-77] — it
  took the page's, and read 1.2:1 on cyberpunk's yellow bar and 1:1 on
  nostromo's. `.kp-nav :is(.kp-button--ghost, .kp-icon-button)` inherits the
  bar's colour, in the package and in the four registers that repaint the
  ghost.
- **A select's open list stays in the window** [fix-78] — with
  `appearance: base-select` it was as wide as its longest option and the
  check mark pushed every label to the end. It is now at most
  `--kp-picker-max-width` (40rem, or the window less 2rem), options wrap, and
  the mark sits after the label.
- **Flipping a switch moves nothing** [fix-79] — both words share one cell,
  so the box is as wide as the wider word in any language.
- **A datatable's first load shows its spinner** [fix-80], as a refresh
  does, and the handle's new `busy(text)` puts the consumer's own progress
  words in the status line while it loads.
- **Dark's pointer effect follows a theme switch** [fix-81]: the effects
  module arms the pointer and press buses the first time a theme asks for
  them, not only at attach.
- **A hovered ghost or icon button in the bar keeps the bar's ink** [fix-82]:
  its hover plate is a veil of that ink (nostromo's read 1.12:1).
- **Sorting on several columns moves nothing** [fix-83]: the summary has a
  line of its own under the toolbar, one line high, with a **Reset the sort**
  button that keeps its room and shows only when the sort differs from the
  opening one.
- **`busy({ text, since })` counts by itself** [fix-84], in a part the live
  region does not announce each second.
- **Every data table can fail, with its reason** [fix-85]: the failed slot and
  its Try again are made for any table, `fail(reason)` puts the reason in its
  words, and the empty slot may say "nothing yet" and "nothing matches" apart
  (`data-kp-datatable-empty-none`, `data-kp-datatable-empty-nomatch`).

**Added.**

- **The documentation site**: a theme switcher fixed top right on every page,
  the choice carried from page to page, and every component page showing the
  catalogue's blocks as more examples (136 of them).

## 7.2.0 — 2026-09-27

A minor for a new component and three fixes found in use. `.kp-log` gives a
log line its time, source, level and message on fixed columns, with a
source name's own colour from `js/log.js`; the side navigation marks a
submenu item per theme. Then what a consumer and a desktop ran into: kyu's
login opened with its required field already red [fix-74], retro drew its
pressed icon-button plate at the page's corner [fix-75], and the desktop
apply scripts wrote through Kenny's linked `starship.toml` [fix-76]. The
Windows and Linux desktop files live in `desktop/` from this release on; they
are not part of the npm package.

**Fixed.**

- **An untouched required field no longer loads red** [fix-74] — kyu's login
  page opened with its token field already in the destructive colour, because
  the base layer painted every `:invalid` field and an empty required field is
  invalid before anyone types. The rule now reads `:user-invalid`, which waits
  until the field has been touched or a submit was tried. A consumer that
  worked around it with its own `:user-invalid` rule can drop that rule.
- **An icon button is the containing block of what hangs off it** [fix-75]
  — retro draws its pressed plate as an absolutely placed `::before`, and the
  icon button was not positioned, so the plate was drawn at the page's
  top-left corner. `.kp-icon-button` is now `position: relative` at zero
  specificity, as `.kp-button` already was, in every theme; a part that
  places the button itself, like the dialog's close, still wins.
- **A submenu item carries a mark of its own** — Kenny, 2026-09-20: _"bij
  subitems op de sidenav zou ik graag nog, per thema, een specifiek symbool
  voor de subitemnaam willen zetten zodat het extra duidelijk is wat nu juist
  een hoofdmenuitem en een submenuitem is."_ The package gives the place, in
  the indent a submenu item already carries, so no label moves for it
  [fix-64] — in the name's own line, right before its first letter, because a
  register may give a submenu row its own inline padding and a mark measured
  from the row's edge fell on the word in eleven themes; each register gives
  the mark through `--kp-sidenav-submenu-mark`
  — formal a middot, cyberpunk its double slash, blueprint the grid mark,
  high-contrast a filled square, terminal a prompt, and nostromo the same dot
  it draws on its buttons, drawn rather than typed. On the label's own
  `::before`, because five registers already draw with the link's. Nostromo
  lights the dot its rows already carry instead of drawing a second one, and
  its rows are positioned now, so that dot stops standing in the middle of
  the panel while the list scrolls [fix-73].

**Changed.**

- **A log's loud severities carry a plate, and its stamp stops at the
  second** (fix-70): `--info-foreground` and `--warning-foreground` are the
  ink _on_ a plate, not an ink for a card, and which half of a status pair
  is dark is each theme's own answer — measured 2026-09-20, nineteen words
  in nine themes sat under 4.5:1 and ten of those at 1.00 to 1.38, which is
  white on white. A warning, an error and a critical now take the pair
  itself, plate and ink, which the contrast gate already holds at 4.5:1 in
  all twenty-two themes; a routine line keeps its quiet word, whose colour
  became the knob `--kp-log-level-ink`. The time column reads `09:41:02` —
  Kenny, 2026-09-20: "na seconden moet er niks komen, geen duizendsten".

- **The side navigation travels from the far edge again** (gap-9): the
  `transition: none` that sat on `[data-kp-sidenav-side='end']` since
  2026-09-11 is gone, so that side slides on the register's own duration
  and easing like every other. It was excepted because the slide read as
  rough through two attempts; measured frame by frame on 2026-09-20 it
  drops nothing — 10 to 15 frames at one every 17 to 18 ms in six
  registers, and terminal's two steps are its own `steps(2, end)`
  [research/gap-9-far-edge/README.md].

**Added.**

- **`.kp-log`, a log line** (gap-14): the time, the source, the level and
  the message in four columns that do not move — the list is the grid and
  every line hands its parts to it, so each message begins in the same place
  whatever the source before it is called [fix-64]. The level is a word in a
  column of its own before it is a colour [fix-1], the loud severities carry
  their own plate behind that word [fix-70], and `data-kp-current` marks the
  line a reader is pointed at with the muted ground and nothing else. All
  twenty-two registers dress it with what they already decided for
  `.kp-spec`, so no theme had to invent a second taste.

    This is the shape homelab writes three times by hand and kp-tui carries as
    `LogPane`. The web had the colours for it and not the component.

- **`js/log.js`: a name's own colour** (gap-15): `sourceIndex` hashes a
  source name with FNV-1a — the same offset basis and prime kp-tui uses — and
  `attachLogs` writes `--kp-source-colour: var(--chart-N)` on every
  `[data-kp-source]`. So `media` is the third chart colour in a terminal and
  the third on a page, in all twenty-two themes, and nothing picks a hue by
  hand. Measured against the crate on 2026-09-20: media 3, web 1, backup 5,
  monitoring 4, dns 5, host 1, caddy 2, restic 5; `tests/log.spec.mjs`
  carries that table so the two implementations cannot drift apart quietly.

    The module is lazy like every other: `js/auto.js` fetches it only for a
    page carrying `[data-kp-source]`. Without it a source name is simply ink.

## 7.1.0 — 2026-09-20

A minor for one rule, found in the terminal and brought back to the web.
Kenny, on a set of progress bars whose tracks each began where the word in
front of them happened to end: _"Elementen beginnen op vaste punten, niet
afhankelijk van de lengte van andere elementen … Dat wil ik ook in andere
componenten. Het moet altijd netjes ogen."_

**Added.**

- **`.kp-progress-group`** (fix-64): a set of labelled bars in three
  columns — label, track, reading — with the row handing its parts to them
  through `display: contents`. Every track in the group begins and ends in
  the same place, and the label column is as wide as the longest label in
  that group and no wider. A lone bar keeps `.kp-progress__wrap` and needs
  none of it. `.kp-progress__label` styles the word in front of a bar, and
  `--kp-progress-group-gap` is the row gap.

    Measured: without the rule the three demo bars read
    `lefts 320/580/1042` in formal; with it, one left edge and one right edge
    in all 22 themes (`tests/nostromo-notes.spec.mjs`, "bars in one group all
    start and end in the same column").

**Notes.**

- No theme changed. The rule is a layout in `css/components.css`, so every
  register's own colours, radii and borders are untouched; the twenty-two
  `tokens.json` files are byte for byte those of 7.0.0.
- The catalogue's progress block carries the group now, so its thirty
  neighbouring blocks were judged again on the review site — 660 pairs,
  all approved on 2026-09-19 at device pixel ratio 2.222. The hash resolves
  the code that touches a block per component rather than per family, which
  is why a table with a badge in it came back for a rule about bars.
- The rule is code in kp-tui too, as `label_column` [kp-tui fix-64], which
  is where Kenny found the fault.

## 7.0.0 — 2026-09-17

A major for one break: `attachAll()` and `attachEffects()` finish after they
return, because a page now downloads only the JavaScript its markup uses. A
login page loads 241,556 bytes of it where 6.1.0 loaded 722,686 (Chromium,
`examples/login.html`). No consumer in `~/Projects` calls `attachAll()`;
chassis-rs bakes ten more files at its upgrade (MIGRATION.md has its task).

**Breaking.**

- **`attachAll()` and `attachEffects()` are asynchronous** (`scope-115`,
  `scope-117`): both handles carry `ready`. Code that reads a component's
  state in the same tick awaits it first; `<html data-kp-auto-ready>` marks
  the boot's attach. The individual attach functions stay synchronous.
- **A vendored `js/effects.js` needs `js/effects/` and `js/as-of.js` beside
  it** (`scope-117`, fix-55, fix-56): `SHA256SUMS` lists them.

**Added.**

- **The 22 themes as VS Code colour themes** (`scope-125`): `vscode/kp-<theme>-color-theme.json`,
  generated from the same tokens by `gates/generate-vscode-themes.mjs` and
  checked in the gates chain like the Home Assistant themes. 394 colour keys,
  17 syntax rules and 30 semantic ones per theme; each file carries its own
  measured contrast pairs under `kpThemes.contrast`. A release attaches them as
  `vscode-themes.tar`, the eleventh asset, and the package exports `./vscode/*`.
  They are not in `consumer.tar`: an editor theme is not a stylesheet a page
  serves.

- **`--code-keyword` and `--code-string`, in all 22 themes** (`scope-123`,
  fix-58): the two inks a code block colours its keywords and its strings
  with. They were the chart hues, which are chosen and measured as LINES at
  3:1, and nine themes came out under the 4.5:1 text asks — strings in
  formal, light, pastel, forest, shade-light, lapis and titanium, keywords
  in pastel, brutalism and nostromo. Each new token is its theme's chart hue
  and saturation with the lightness moved until it reads: ten of the 44
  moved, by 2 to 10 points, and the other 34 are the chart colour unchanged.
  `check:site` now measures every colour `site/site.css` gives to text
  against the surface under it and refuses anything below 4.5:1.

**Changed.**

- **`js/auto.js` fetches only what the page carries** (`scope-115`): the
  document is asked first, one selector per module, and a module is
  imported only when its markup is there. Measured in Chromium on
  `examples/login.html`: 10 files and 294,139 bytes of JavaScript where it
  was 28 files and 722,686. Remember, overlays, the theme picker and effects
  are still loaded on every page, because what they do does not depend on
  markup a load-time check can see. `attachAll()` now returns its detach with
  `ready` and `modules`; code that read a component's state in the same tick
  as `attachAll()` awaits `ready` first. `dist/kp-themes.js` stays one file.
- **`js/effects.js` fetches its hooks when asked** (`scope-117`): the nine
  hooks moved into `js/effects/`, each fetched the first time an element or
  a theme knob needs it; the module that every page loads went from 108,896
  to 53,877 bytes. `attachEffects()` returns `ready` on its handle.
- **The catalogue asks only about what a change touches** (`scope-116`,
  fix-54): a block's review hash reads the CSS families and component
  modules its markup carries, not every file in `css/`, `js/` and
  `components/`. Measured: a change to the data table's module brings back
  264 of 3062 block/theme pairs, the loader none.
- **The Home Assistant themes ship with the release** (`scope-120`): the
  22 `ha/kp-*.yaml` as `ha-themes.tar`, listed in `SHA256SUMS`, with the
  install steps in the README.
- **`npm run test:tags -- --level engines`** (fix-51): the commit level's
  selection in both engines, run at a layer's close.

## 6.1.0 — 2026-09-17

A minor: one new thing a consumer can use, twenty-two themes corrected
where Kenny turned a block down, and a review cycle that finally answers
the question it was built to answer.

**New.**

- **A component remembers what the reader set** (`scope-110`):
  `data-kp-remember="<name>"` opts an element in and names its key, so two
  of the same component on one page keep separate state. The side
  navigation's groups and rail, the accordion, the tree, the split pane
  and the data table's columns, sort and density are covered; dialogs,
  popovers, menus, tooltips, toasts, the combobox, the date picker, the
  wizard and the alarm deliberately are not — each is opened for a
  moment, and a page that reopens one by itself argues with its reader.
  `js/remember.js` paints the stored state back as the attributes an
  author could have written, so every module goes on reading its own
  markup; blocked storage leaves everything at its default.

**Corrected.** Every one of these came from Kenny judging the catalogue,
and each is in `docs/CORRECTIONS.md` with the measurement behind it.

- Dark's halo is cut at the chamfer instead of squaring it (`fix-41`);
  dark and titanium show one select arrow, not two (`fix-42`); dark's
  buttons show a focus ring again, with eleven of the twenty-two themes
  measured in the same sweep (`fix-38`).
- Brutalism's alarm fits its frame at every size, and retro's alarm
  speaks the theme's own body face (`scope-108`); retro's dialog no
  longer overlaps its own title, close button and scrollbar.
- A menu opens inside the box that clips it (`fix-39`), and brutalism's
  over-the-page navigation stays off screen when it is closed (`fix-40`).
- Sepia's ink washes, its retry border and its gestures; blueprint's
  laurels; phantom's theme menu; synthwave's, terminal's and
  high-contrast's page effects.

**The review cycle.** Not shipped code, but it is why this release could
be cut at all.

- **The block hash is what a block is made of, not what it looks like**
  (`scope-114`): its markup as written, the theme, and digests of the
  code that shapes it. A verdict no longer follows the zoom, the window,
  the focus, a typed value or the page a block is shown on — and a
  version bump is not a change to a block.
- **Nothing is released while an element is not approved** (`scope-107`),
  counted by `npm run advice`; at this release, 3062 of 3062 block/theme
  pairs carry an approval.
- **One dialog for a whole round** (`scope-113`) and a page that says
  whether the round is finished (`fix-48`, `catalogue/round.html`).

## 6.0.0 — 2026-09-12

A major because four themes are gone and a fifth was replaced outright.
Everything else in this release is additive, but those two are enough:
a page wearing `academia`, `mono`, `ticker` or `woodblock` will fall back
to `formal` and say so in the console, and a page wearing `dark` will
look like a different theme, because it is one.

**Breaking.**

- **Four themes removed** (`scope-11`): `academia`, `mono`, `ticker`,
  `woodblock`. Twenty-two remain. The registry no longer knows the names,
  so `applyTheme('mono')` warns once and applies the fallback rather than
  writing an attribute nothing styles.
- **`dark` is a different theme** (`scope-16`): the spectral instrument,
  rebuilt from its own approved demo. Same name, same token contract, an
  entirely new register — and it now declares `--kp-pointer: track`, so a
  page that loads its register also gets `--kp-px` and `--kp-py` written
  to the root while the pointer moves.

**New.**

- **A side navigation, in both channels.** `js/sidenav.js` shipped first;
  `components/sidenav.jsx` is the other half, rendering the same markup
  and attaching itself on mount, because `js/auto.js` runs at load and
  React mounts after it. `autoAttach={false}` is the way out. Three
  modes, a slim rail, folding categories and either edge; every attribute
  the module reads is a prop.
- **Numbers that count up** (`feat-count-1`): `data-kp-count` on an
  element whose text already holds the final figure. The module reads the
  number out of that text, counts to it and puts the same string back, so
  a page without the module — and a reader who asked for less movement —
  simply sees the number. Which character groups the digits and which is
  the decimal point is decided by the nearest `lang`, never guessed:
  `1.204` is one thousand two hundred and four in Dutch and
  one-point-two-oh-four in English.
- **`titanium`**, the twenty-second theme: anodised metal and carbon
  weave, the machined chamfer, and the oxide film that shifts with the
  angle you look from.
- **Two surfaces a theme may paint on a button** (`scope-16`,
  `scope-17`): an empty `.kp-button__edge` over the whole control, and an
  optional `.kp-button__readout` above it carrying the consumer's own
  word. Both inert in every theme that does not style them.
- **Eight per-theme gestures and six hover gestures**, each from its
  theme's own approved demo.

**Fixed, and each one is a fault that reached a person.**

- **A button that did not react to being pressed** (`fix-12`, and twice
  more in Phase 7). Three shapes of one fault: a later layer beating a
  state, a variant's ground swallowing its flavours, and — the third — a
  longer hover selector outranking the pressed rule in the _same_ layer.
  grotesk carried a correct `:active` rule with a correct token for a
  whole round and it never painted. `gates/check-pressed-state.mjs` now
  compares the two weights.
- **Half a focus ring.** Three themes painted their own elevation on a
  button from the register layer, swallowing the ring the components
  layer draws on `:focus-visible` — a keyboard user got an outline and
  nothing behind it. Two more painted nothing at all on a menu item
  inside a popover that rounds its corners. Both repaired without moving
  what the demos showed.
- **`shade-light` had no muted colour**: `--muted-foreground` was
  identical to `--foreground`, the only theme of twenty-two where the two
  matched, so captions, timestamps, disabled labels and the text of an
  empty field all read as body text. Now 46%, measured at 3.99 against a
  4.5 floor — there is no lighter colour that clears it, because the body
  text only reaches 5.01 itself, and the reading is recorded rather than
  hidden.
- **`blueprint`'s buttons overflowed at a phone width.** Its own approved
  hover gesture put two witness lines outside the control, and the
  right-hand one added six pixels to every button's scrollable area
  whether or not it was visible. The lines moved inside; the gesture is
  unchanged in everything else.

**Under it.**

Thirty-five gates, up from thirty. Five are new and three of those are
about the documents: every command, path and import subpath a document
names is real; every message it quotes verbatim is a string the source
prints; and nothing of a refused shape appears in any of them. The other
two guard the pressed state and the variant grounds.

110 unit tests and 1,343 browser tests in Firefox, 2,736 across both
engines. Fifteen of those browser tests were red on the branch for most
of this round and nobody could see them, because a register edit resolved
to one spec file and skipped the fifteen sweeps that read every register.
`gates/affected.mjs` now resolves a register edit to its own spec plus
every spec that sweeps all themes, found by reading the specs rather than
by keeping a list.

`docs/DEBUGGING_GUIDE.md` and `docs/OPERATIONS_RUNBOOK.md` are new: the
maintainer's half of the troubleshooting pair, and the numbered
procedures this repository actually performs on itself.

## 5.1.0 — 2026-09-09

The first release shaped by a consumer rather than by this project's own
gates. chassis-rs adopted 5.0.0 the day it published and reported two
things back (their R3); both were measured here and both were right.

**A release carries `consumer.tar`.** The release attached eight assets
while `SHA256SUMS` beside them named 231 copyable files, so a consumer
that bakes the package into its own binary pulled the six JavaScript
modules, the twenty-five registers, `css/layout.css` and
`css/utilities.css` off the git tag one file at a time. The tarball is
built FROM the manifest — not from a list anyone maintains, which is the
drift KT7 and TH130 exist about — and carries everything it names except
the fonts (already `fonts.tar`) and the source maps: 92 files, 4.7 MB. It
travels with `SHA256SUMS`, so a consumer verifies what it just received
without a second download:

```sh
tar -xf consumer.tar && sha256sum -c --ignore-missing SHA256SUMS
```

The flag is not optional. The manifest inside is the release's own and
names the fonts and maps the tarball leaves out, so a bare `sha256sum -c`
buries ninety-two `OK` lines under a hundred-odd warnings.

**`dist/kp-themes.js` exports every published module.** It bundled
`js/auto.js` and therefore exported one name, `attachAll` — so a consumer
calling `enforceContracts`, `attachConfirmations`, `attachSkipLinks`,
`attachThemePickers` or `applyStoredTheme` found all five inside the
bundle and none of them coming out, and had to take the loose modules
instead. The bundle now exports a namespace per module
(`comboboxExports`, `themeCoreExports`, …) plus every name that exactly
one module _declares_, flat. Declares, not re-exports: `THEMES` is
written once in `js/theme-registry.js` and passed on by two others, so it
flattens safely, while `OPEN_EVENT` and `MATCHERS` are each written by
several modules with different values and stay namespace-only rather than
silently becoming one of them. A unit test holds the bundle's surface
beside the modules', the way KT7's test holds the check lists.

**How to load twenty-five registers is written down.** chassis-rs asked
how a consumer with a client-side picker should do it, and the honest
answer was that the package already solves it and never said so:
`dist/kp-themes.css` is twenty-nine stylesheets including all twenty-five
registers, each scoped to `[data-theme='name']`, so a theme change fetches
nothing. README.md and `docs/USER_GUIDE.md` now carry both routes with the
measurements: 693 kB minified for everything at once, against an average
of 20 kB per register (dark 44 kB, light 12 kB) for loading the one in
use. Neither is more supported than the other.

No colour and no token moves in this release. Two rules do, and both are
below: a component gained a knob and the Home Assistant themes gained a
register. Every existing page renders exactly as it did.

**A reveal's state is readable** [TF2, KT16]. `js/effects.js` sets
`data-kp-reveal-state` on the element it handled — `armed` (wired to a
trigger, nothing has run), `rest` (settled without playing) or `played`.
Until now the only signal was the `kp-reveal` event, which is a moment:
whoever was not listening when it fired could never learn the answer, so a
consumer asking "is the dossier armed yet" had nowhere to look. The event
is unchanged and still fires.

It came out of two browser tests that failed under load and passed alone
in Kenny's verify run. The tests are repaired the same way the state is:
63 reads that happened after a click, a hover or a press now retry instead
of reading one moment, 22 places that clicked the boot overlay's Skip now
wait for the overlay to actually leave, and `tests/paint.mjs` holds the
readers. Recorded as KT16.

It came back the next day, in the verify run that measure was queued
against, on two reads that were neither of those things [fix-1]. The
repair separates the two halves the first one had run together: a value
that settles is read until it is the value (`wholeRing()` for the focus
ring, four sites), and a value that passes is caught by a listener armed
before the page exists (`recordAnimations()` and `animationsSeen()`,
three sites) — because polling for a keyframe name that has already gone
finds nothing and then costs the whole timeout. Nothing a consumer runs
changes; this is the suite.

**A badge can be told not to break its word** [ask-1]. Five components
share one rule that lets an unbroken value break rather than push the
page sideways — measured before it existed at 607, 485, 483 and 581px in
a 360px viewport. chassis-rs found the other half of that trade: in a
narrow status column the badge cut "active" into "acti / ve", because the
badge was narrow through its column and not through its content. Both
cases are real, so neither becomes the rule. The default is unchanged and
`.kp-badge` now reads `overflow-wrap: var(--kp-badge-wrap, anywhere)`; a
consumer whose badges only hold labels sets `--kp-badge-wrap: normal` on
the column. A custom property rather than a modifier class, because the
place that knows is usually the column rather than the badge.

**Cyberpunk and synthwave wear their register on a Home Assistant
dashboard** [feat-ha-1]. A generated Home Assistant theme carried 23
colour variables, the card radius and width, and the theme's own duration
as a transition — the colour travelled and the expression did not, because
a dashboard has no `.kp-*` class for a register to hang on. Where card-mod
is installed, those two themes now inject their own: cyberpunk's notched
card corner, its signal-yellow tick and its scanlines at DI9's 0.06
ceiling; synthwave's fixed horizon with the floor running to a vanishing
point, and cards as lit panels. Every colour and face comes from the same
tokens as the rest of the file. The other twenty-three are unchanged and
carry colour and timing only — a register is a design choice per theme,
and two of them have been made.

## 5.0.0 — 2026-09-09

**Three themes changed name.** `topo` is now `forest`, `tazhib` is now
`lapis`, `nishiki` is now `woodblock` (Kenny, 2026-09-08, at their lift).
The rename is total — tokens, register, export path, Home Assistant
theme, example pages, the `Theme` type — and `MIGRATION.md` carries the
one-line map a consumer needs. The compare pages ask 4.0.0 for the name
4.0.0 knew, so a rename reads as a rename and not as a redesign.

**The next cyberpunk, and the first theme lifted after it.** Cyberpunk is
rebuilt on signal yellow under the same name (S39); `synthwave` is the
twenty-fifth theme, built from the approved concept demo "Outrun
Horizon" (2026-09-08) on the §25 research: the striped sun and the
drifting floor on the hero, the horizon as divider, chrome type with one
tracking wipe and one shine, the neon tube a `<mark>` switches on, the
laser line under a heading, a boot line with a Skip once per session
(`--kp-arrival: boot`, the sixth hook), VT323 as its mono face. Every
theme gained `theme-font-mono` (the contract is 96 tokens, S47) and the
base layer carries `[hidden] { display: none !important }` (KT13). The
fonts ship with the package; the two registers became three
(`css/synthwave-register.css`), and by the end of round six every one of
the twenty-five themes carried its own. `MIGRATION.md` has the consumer-facing
detail at C6.

**The second lift: phantom.** Built from the approved concept demo
"Calling Card" (2026-09-08) on the §15 research: black, white and one
red that is always a plate, never a word. The headline's words shout in
one after another (`--kp-reveal-headline: shout`), a `<mark>` is a plate
of cut paper shoved under the word (`slab`), the rail under a heading
sweeps from grey to red (`rail`), the divider is torn paper, every hover
is Omicron69's skewed bar, every button a key cap, every popover cut
paper arriving on a three-step film cut, and the page arrives as a
calling card — the theme's name, a red bar, the whole card shoved off to
the left (`--kp-arrival: card`, the second arrival routine). The
register is `css/phantom-register.css`; the effects module gained the
word routines (`shout`, `slam`), `dissolve` and `type` for the lifts
that follow.

**The third lift: retro.** Built from the approved concept demo "Bevel
95" (2026-09-08) on the §21 research (98.css, Win95 SGJ, 2bit.chat, the
NW pixel dissolve). The 3.1.0 bevel register grew into the whole 1995
desktop: the headline clears out of a dither in four discrete densities
(`--kp-reveal-headline: dissolve`), a `<mark>` is the selection bar that
drags across the words in eight steps (`select`), the groove under a
heading rules itself in, in twelve (`groove`), the dividers are the
shell groove — dithered band first, plain two-line second — the brand is
the title-bar ramp, every hover the selection bar, the default button
carries the navy bevel and the mirror modifier the one-pixel ink ring,
the selected tab lifts, the dossier is a Notepad window whose redactions
are the 50% dither brush lifting off, the scrollbar track the 2×2
checkerboard, and the page arrives through the POST (`--kp-arrival:
boot`) and leaves it through the pixel dissolve. VT323 is retro's DOS
voice for labels, help and status. Nothing eases, loops or blinks: every
step is discrete and every effect goes one way. The register stays
`css/retro-register.css`; on a surface the register sets the h1 in ink
with a hard white shadow where the 3.x theme painted a title bar.

**The fourth lift: terminal.** Built from the approved concept demo
"Green Phosphor" (2026-09-08) on the §6 research (PX PUSH, ekeijl,
dottxt.ai). The headline types itself one glyph at a time with a block
caret riding the last one (`--kp-reveal-headline: type`), a `<mark>` is
inverse video (`inverse`), the dashed rule under a heading types itself
out in twelve steps (`dashes`), the dividers are dashes with a plus at
each end, every hover is inverse video, the cta and the ghost button are
bracketed, the checkbox is `[ ]` and `[x]`, the dossier's redactions are
runs of character cells repainting left to right, the glass carries
ekeijl's bezel and the sweep band that crosses once every ten seconds,
and the page arrives through the POST and leaves it as the tube
collapses (`--kp-arrival: boot`). **The cursor moved (R6-Q7):** since
3.1.1 a blinking block sat after the label of the field being typed
into; it is gone from the base layer, and the register paints a block of
one character cell inside the focused text field at the caret — the
effects module writes the column (`--kp-caret: block` on the root,
`--kp-col` on the field), the register paints and blinks it. The
register is `css/terminal-register.css`.

**The demos, exactly (S49).** Kenny's rule of 2026-09-08: an approved
concept demo is implemented exactly, every token and every element, and a
test or a gate that disagrees produces a finding for him rather than a
quiet change. Four read-only audits (`docs/audits/`) measured the four
registers built since C5 against their demos and found fifty deviations;
he answered eleven of the twelve groups "Demo exact". What that changed:

- **The words.** `examples/concept-<theme>.html` is one page per theme
  with an approved demo — the same structure and the same markers (S46),
  the theme's own words, its own theme in the markup. Until now every
  theme's concept page carried cyberpunk's copy. `showcase/concept-copy.mjs`
  holds the ninety slots per theme and a unit test refuses a page that
  says another theme's headline; the React channel takes `?copy=<theme>`.
- **The chrome.** Retro is an application window on the teal desktop
  again, with its window controls, its resize grip, its groove well and
  the segmented bar its POST counts along; the arrival routine learns a
  lines mode fed by the dictionary (`arrivalLinesByTheme`), so a theme's
  boot is its own five POST lines rather than one percentage counter.
- **The values.** Retro's title-bar ramp, terminal's panel, well, footer
  ground and typing speed, brutalism's dot grid and its `oklch` hover
  step are the demos' own. Two tokens join the contract, `--fx-hot` and
  `--fx-hot-alarm` (96 tokens, S47), and phantom ships Barlow Condensed's
  real Black Italic and ExtraBold Italic.
- **The rules that yielded.** TH111 is amended: the three button sizes
  must be told apart, and where a demo pins one height they separate in
  type and padding. AR30's reader accepts a ring stacked either way.
  KT8's one-step hover yields for brutalism, and its themeable select and
  ink-wash highlight yield for retro and terminal — per theme, with the
  reason recorded beside each exception and the exception itself
  measured.
- **Still with Kenny:** phantom's skewed button, where the demo skews the
  element and the package skews the plate (R6-Q8).

**The fifth lift: brutalism.** Built from the approved concept demo
"Hard Copy" (2026-09-08) on the §7 research (Gumroad, BEIGE FORCE,
Future Pharmaceutical). The headline's words slam onto their yellow
offset one after another (`--kp-reveal-headline: slam`), a `<mark>` is a
yellow plate wiped in behind the word and closed by the line (`plate`),
a six-pixel bar rules a heading off when it enters the viewport (`bar`),
the dividers are a hatched marquee strip translating seamlessly — the
second one the other way — every hover is the yellow plate with the
line, the cta and the buttons lift two pixels away from a shadow that
grows, the labels carry the pixel outline of four hard box-shadows, the
dossier's stamp is tilted signal red and its redactions are ink bars
that slide off, and there is no arrival at all: printed matter is simply
there. The register is `css/brutalism-register.css`; it introduces no
family (Archivo Black already ships) and no token.

**The remaining nineteen lifts, and the twenty-five registers.** After
brutalism the other nineteen themes were lifted the same way in one day
(2026-09-08), each from its own approved concept demo and each recording
what it reported rather than corrected —
`docs/audits/DEMO_FIDELITY_ROUND_SIX_2026-09-08.md` gathers all of it in
one place. Every one of the twenty-five themes now ships a register of
its own, `css/<name>-register.css`, opt-in and exported separately, and
every one answers all six hooks. Five registers had to retire a
pre-register signature from `css/_rules.css` first: an animation there
outranks a normal declaration, so formal, blueprint, deco, nishiki and
woodblock had each been painting the rule their register was trying to
draw.

**Three themes changed name at their lift** — recorded above.

**Two shared elements, from what the lifts found missing.** A marquee
(`data-kp-marquee`, `components/marquee.jsx`) that doubles its row for a
seamless pass, hides the copy from a screen reader, rests off screen by
default (`--kp-marquee-pause`) and takes its speed from
`--kp-marquee`; and a caption above a nav dropdown
(`data-kp-menu-label`, or `menuLabel` on a NavBar link) that draws
nothing where nobody asked for one. Kenny judged all twenty-five side by
side and chose each theme's own version. Cyberpunk's band is signal
yellow with blood-red ink at his instruction — 3.21 against the 4.5
floor, an approved exception recorded in `themes/cyberpunk/anatomy.md`.

**A minified build.** Every stylesheet the package ships now has a
minified twin under `dist/css/`, plus the bundle — 45% smaller, with a
source map beside each and the per-file sizes in `docs/MINIFIED.md`,
generated and gated. `url(../fonts/…)` is rewritten one level deeper so
the twin finds the faces.

**How this package is tested changed** [Kenny, 2026-09-09]. There is no
CI: the workflow is deleted and `main` requires no status check. Five
commands replace it — `npm run gates` on every commit, `test:affected`
for what a change touches, `test:browser` for all of it, `advice` for
the reading, and `verify` for everything before a release. The
accessibility floors (contrast, the design invariants, the flash
threshold, the reduced-motion guards, the texture ceiling) are **advice
rather than gates**: measured and printed, never refused, with no
per-theme exception list any more. README.md and
`docs/DESIGN_INVARIANTS.md` say plainly what that costs, so the package
does not claim to enforce what it does not.

**No field test before this release** [Kenny, 2026-09-09, REL3]. Phase 9
asks for one — the package used once from a clean install as a real
consumer would. Kenny chose to skip it, and it is recorded here rather
than left unsaid: what such a run would have found, a consumer finds.

## 4.0.0 — 2026-09-07

**A destructive button asks before it acts, and four things that were
broken in public stop being broken.** The major version is the
confirmation: a click on a destructive control no longer arms the button
for a second click but opens a dialog. Everything else in this release
is either a repair of something the released package got wrong or an
addition that breaks nothing.

`MIGRATION.md` has the consumer-facing detail; this is what changed and
why.

### The confirmation is a dialog [TH107, D4, AR27, AR28, AR29]

A native `<dialog>` opened through `showModal()`, so the browser supplies
the focus trap, the Escape close and the return of focus. Confirm
re-fires the click behind a one-shot lock, which is the only shape that
costs consumers listening for ordinary clicks nothing — measured, because
the obvious version does not work: without the lock the re-fired click is
caught by the same listener and reopens the dialog, `["open", "confirm",
"open"]` and nothing ever performed. `ARM_EVENT` and `DISARM_EVENT` leave
the exports; arm-then-act survives as `data-kp-confirm-mode="inline"`.

The dialog re-shows the popover it displaced before returning focus,
because `showModal()` light-dismisses an open `popover="auto"` and a row
action lives in a menu.

### Four faults the released package had

Each was found by the `architecture-critic` before this round was frozen,
and each started as a test that failed on the released code.

- **A destructive React button could never be confirmed.** The React
  button wrote `data-kp-confirm` and the framework-free module selected
  it document-wide, so the two channels re-armed each other's button
  forever and the action never fired at any number of clicks. The test
  asserting otherwise was green only because its fixture did not attach
  the module over the React part.
- **Half the focus ring was missing on every button in every theme.**
  `.kp-button`'s own `box-shadow` sat in a later cascade layer than the
  global two-part ring and replaced its inner half. It composes now.
- **The cyberpunk register never reached the package's own buttons.**
  Every button rule in it selected `[data-slot='button']`, an attribute
  `css/components.css` never sets.
- **The movable grid's collapse rule had been dead since it was
  written.** `js/gridlayout.js` wrote the tile's place as an inline
  style, which beats any rule in any layer, so the narrow rule lost the
  moment the grid was attached — the only way it is used. The place is
  four custom properties now.

### Container queries beyond the tables [TH104, AR31]

The card grid and the nav bar read the box they are given rather than the
width of the window; the nav bar's `clamp(…, 3vw, …)` was the same fault
in a different disguise. Both need one wrapper element, which the React
components render themselves and `MIGRATION.md` spells out for
hand-written markup. The DataTable needed nothing — `@container kp-table`
has carried it since 3.2.0, checked rather than assumed.

### The button, and the page's edges [TH110, TH111, TH113, AR30, AR32]

Three button sizes as modifier classes with a `size` prop beside them.
One shared rule stops `.kp-button`, `.kp-badge`, `.kp-tag`, `.kp-health`
and `.kp-copyable` pushing the page sideways at 320 and 360px.

### What a scroll region clips [TH114, AR33]

Six assertions and a section of the guide, replacing an assumption with a
measurement: an absolutely positioned child of `.kp-table-wrap`,
`.kp-diff` or a `<pre>` is clipped, and a popover is not — it lives in the
top layer, where no ancestor's overflow applies.

### Two new gates, both blocking

`check:closure` holds the import closure of the six modules chassis-rs
bakes into a Rust binary at exactly those six, because one import edge
would make its whole chassis fail to load. `check:wrappers` refuses one
of this package's own pages that draws a converted component outside a
container that carries it — 65 components over 82 pages today.

### Also

`README.md` and `docs/SCOPE.md` no longer disagree about the git route
[TH112]. Three flaky tests were given a cause rather than an excuse: two
budgets that never scaled with their corpus, and one assertion racing a
state the fixture threw away after 400ms.

## 3.2.0 — 2026-09-07

**The layout the package kept telling consumers to write themselves.** A
consuming project shipped 71 lines of its own layout glue and 28 inline
`style` attributes, and said so in its own stylesheet header. Round four
is the answer: a layout layer, a utility API, ten example pages built out
of nothing else, and a documentation site that shows all of it.

Everything here is additive. Nothing that worked in 3.1.1 stops working.

### Added

- **A layout layer** (`css/layout.css`, exported as `./css/layout`):
  sixteen classes for the shape of a page, each reading a knob that
  defaults to the theme's own spacing scale.
  [docs/LAYOUT.md](docs/LAYOUT.md).
- **A utility API** (`css/utilities.css`, exported as `./css/utilities`):
  118 single-purpose classes in six families, generated from one source
  and documented by hand so the two can disagree.
  [docs/UTILITIES.md](docs/UTILITIES.md).
- **Cascade layers** — `kp.base`, `kp.components`, `kp.register`,
  `kp.layout`, `kp.utilities`. A layout class or a utility now wins on a
  component that sets the same property, without `!important`. Measured
  first: 44 component rules had higher specificity than a utility, so
  load order alone would not have been enough.
- **A spacing scale as tokens** in all 24 themes, pinned to the values
  the components already used, so nothing shifted.
- **A compact density mode**: `data-density="compact"` on any element.
  Pointer targets stay above 24px.
- **A keyboard-reachable scroll region for wide tables** in both
  channels, plus `.kp-cell-break`, `.kp-cell-truncate`, `.kp-col-low`,
  container queries in place of media queries, and a card layout for the
  plain table through `data-kp-cards`.
- **A dist bundle**: `dist/kp-themes.css` and `dist/kp-themes.js`, one
  tag each instead of eight. The loose files are unchanged.
- **Ten example pages** in both channels, built out of the layout layer
  and the utility API and nothing else — zero inline styles, with one
  excused pair of properties a popover needs.
- **A documentation site** with the story of every theme, taken from its
  own anatomy document, and its live tokens beside it.
- **A diagnostics page** that lays a vendored stylesheet and the
  JavaScript beside it and says which half is behind.

### Changed

- **An unknown theme name is no longer silent.** It still falls back to
  the default, but it warns once per session and dispatches a
  `kp-theme-unknown` event carrying what was asked for, what was
  applied, and which of the four paths dropped it. A page that has been
  quietly showing the default theme will now say so.
- **The stylesheet declares its own version** and the theme names it
  knows, as custom properties, so JavaScript can read them.
- **The checksum manifest** is derived from the package exports rather
  than hand-picked, and from what those exports import, so a file a
  consumer has to copy alongside them cannot fall outside it. That is how
  `js/locale.js` — imported by the date picker, the data table and the
  upload field, and exported by nothing — got in.
- **The typography scale is a set of tokens.** `--kp-text-xs`, `--kp-text-sm`
  and `--kp-text-md` are declared in all 24 themes. The six component rules
  that wanted a size the scale name did not mean kept their own value under
  their own knob, so no text moved anywhere.
- **A floor under a collapsed table wrapper.** `--kp-table-wrap-min` does
  nothing by default and gives a way out to a consumer who puts
  `.kp-table-wrap` in a box that shrinks to fit, where inline-size
  containment takes it to zero.

### Fixed

- **A status badge needed an inline style to be coloured.** `css/components.css`
  carries a rule per status now, so `<span class="kp-badge" data-status="offer">`
  gets its plate from the class. The React `Badge` stops writing the style for
  the seven names the package ships and keeps writing it for a consumer's own
  token family.
- **The shortcut sheet ran off a phone.** It was content-box, so at a 360px
  viewport it measured 373px and pushed the page sideways. It is border-box now,
  with the default width raised by exactly what used to sit outside it, so a wide
  screen sees the same 490px it always did.
- **Printing dropped the theme again.** Between the cascade layers
  landing and this release, the print override sat inside a layer while
  the theme tokens did not, and unlayered CSS wins; a dark theme printed
  dark in every theme and both browsers. The override is unlayered now.
  This never reached a published version.

## 3.1.1 — 2026-09-06

**Terminal's cursor moves off the headings.** The blinking block after
every `h1` and `h2` read as a screensaver rather than a flourish once a
page had more than one heading on it. It now appears once, after the
label of the field a person is currently focused in — the one place a
terminal cursor actually marks something.

### Changed

- **Terminal's block-cursor signature** now renders on
  `.kp-field:focus-within .kp-field__label::after` instead of on every
  `h1::after`/`h2::after`. Same glyph, colour and blink timing (DI5's
  flash-threshold literal, unchanged); nothing else about the theme's
  tokens moved (S20).

## 3.1.0 — 2026-09-05

**Thirteen more themes.** Round three researched eleven candidates and
ten further ideas against the existing set, dropped everything that sat
on a theme already here (vaporwave on cyberpunk, botanical on forest,
steampunk on solstice, cosmic on dark), and built the rest —
`docs/THEME_CANDIDATES.md` is the research, `themes/*/anatomy.md` the
result. Nothing existing changed (S20).

### Added

- **Themes:** brutalism, deco, academia, phantom, ticker, woodblock,
  shade-light and shade-dark (one scheme, two halves), mono, retro,
  grotesk, lapis, nostromo. Thirteen light, eleven dark in total.
- **`--fx-shadow-offset`** — a hard offset shadow on buttons, cards and
  inputs; brutalism's signature, `0px` everywhere else (TH85).
- **`--chart-pattern-1` … `-5`** — an image over each chart colour so a
  series is told apart without hue; mono's five fills, `none` elsewhere
  (TH86).
- **`css/retro-register.css`** — raised and sunken bevels inside a gated
  boundary, scoped to retro (TH87). Exported as
  `@kp-soft/themes/css/retro-register`.
- **The showcase compares two themes side by side** — a picker per half,
  one scroll, every specimen twice — and loads each theme's faces from
  Google Fonts (the package still loads none) (TH88).
- **`--kp-popover-max-height`** — the popover scrolls inside itself.

### Changed

- **Hover and the keyboard highlight are a wash of the ink**, not
  `--accent`: `--kp-highlight`, default the foreground at 8% alpha, on
  menu items, the theme picker's options, ghost and icon buttons, and the
  combobox and palette highlights. Seven rules read `--accent` before, and
  a theme whose accent is a colour rather than a tint turned every
  highlighted row that colour. The text keeps the list's colour.
- **`--kp-control-accent`** — what the browser paints checks, radio dots
  and the progress bar in; default `--primary`. Brutalism and mono set
  it, because their primary is (near) the ink.
- **Hover is one lightness step** in every theme (was a half): Kenny's
  finding on the 3.1.0 showcase, KT8/H1. Derived tokens only; no
  authored value changed.
- **The native `<select>` list wears the theme** where the browser
  supports `appearance: base-select` (Chromium 135+): popover surface,
  ink-wash hover, a check on the chosen option. Elsewhere it stays the
  platform's.
- **`<hr>` and `<progress>` wear the theme.** Both were the browser's
  grey — the two elements on a fixture that wore no theme at all, found
  by the foreign-colour test below.
- **A foreign-colour test on every fixture** (`tests/fixtures.spec.mjs`,
  "paints no colour that is not its own"): every painted background,
  text, border and control colour is one of the theme's own values
  within rounding, transparent, or a translucent wash of one; the colour
  picker's swatch and the "browser" specimen's native controls are the
  allowlist, each with its reason. Kenny asked for exactly this after the
  third look at the showcase.
- **The spinner's track is the head at a quarter alpha**, so the two can
  never coincide (brutalism's were both black).

### Fixed

- The strings gate flagged three shapes of code that only looked like
  text (a CSS selector, a capitalised object key, the code between two
  one-character literals); repaired test-first (KT7).
- Fields and inputs shrink inside a grid or flex track instead of
  pushing a 320px viewport sideways, found by the reflow test on a wide
  face.

## 3.0.0 — 2026-09-05

**The release in which every feature of every component became
configurable.** Correction KT6 opened on a busy button with no way back;
Kenny's answer widened it into a sweep of the whole package against what
mature component libraries do in 2026, and this is the result. The audit
and the record of what was done are `docs/GENERIC_SWEEP.md`.

### Breaking

- **The framework-free modules are pure.** Importing `js/*.js` attaches
  nothing. Load `js/auto.js` for what 2.x did, or call the `attach…()`
  functions yourself. `package.json` now tells bundlers the truth about
  side effects — it did not for two versions.
- **The theme labels are English** in the token source. Override with
  `labels` in either channel.
- **The locale is the page's**, not Dutch: the date picker's format and
  week start, the DataTable's collation and number parsing, the upload's
  sizes all read the nearest `lang` attribute, else the browser. Pass
  `locale` / `data-kp-locale` to override. `toDutch()` stays, deprecated.
- **`@kp-soft/themes/fx` no longer exports `BootSequence`**; import it from
  `@kp-soft/themes/fx/boot-sequence`, which is the only place the optional
  `motion` peer is required.
- `ThemeSwitcher` renders the package's own class names, not Tailwind's.
- `Reorder`'s `onChange` receives `(order, { id, from, to })`;
  `Combobox`'s `onChange` receives `(value, values, action)`; `Tree`'s
  `onSelect` still fires on a leaf, and `onSelectedChange` beside it.
- `GridLayout` describes a tile's geometry (`aria-describedby`) instead
  of overwriting its `aria-label`.

### Everything is a knob

Every React component forwards a ref, passes `className`, `style` and the
rest to its root, takes `classNames` for its parts, and holds every state
controlled or uncontrolled through `hooks/use-controllable`. Every
framework-free `attach…()` returns a detach with `handles` whose state is
readable and settable, takes its behaviours as options and `data-kp-*`
attributes, dispatches an event with a detail on every change, and
restores what it changed on detach. Every literal in the CSS a site might
change is `var(--kp-…, <default>)` — 116 of them. README "Everything is a
knob" has the five rules; the per-component list is in the sweep record.

### Repairs found by the audit

`onUndo` on `Button` is invoked at last (it was declared and dead for two
versions). Contract enforcement is recoverable (D7). The skip link moves
focus (`skipTo`, `attachSkipLinks`). The print rule and the forest drift
addressed the wrong pseudo-element. Toasts sat under the texture layer.
`attachDialogs` and `attachTabs` double-bound on a second call. DataTable's
detach left the rows sorted. `no-flash.js` mutated the document on import.
`ShortcutSheet` rendered an empty heading. `EmptyState` discarded its
action when filtered. Tree ids collided across instances. The React
upload's progress bar was pinned at 0. Disabled combobox options were
selectable. `TOAST_MS` was exported and unused. Nested `StringsProvider`s
replaced each other. `data-kp-keys` was documented and never read.

### New

The theme picker groups light and dark with a label per section, in both
channels (TH63). `js/locale.js`. `hooks/use-controllable.js`.
`configureTheme()`. Pointer drag on Reorder and GridLayout. Min, max and
disabled days on both date pickers. Server mode on DataTable
(`totalRows`). Pagination with an ellipsis. Manual and vertical tabs.
Tooltip delays and Escape. Toast variants, actions and auto-dismiss.
Accordion single mode. `beforeStep` on both wizards. `accept`, `maxFiles`
and a validator on both uploads. Command groups in both palettes.

### Kept, on purpose

Three animation durations stay literals: the cursor blink, the skeleton
pulse and the cyberpunk flicker change luminance, and DI5 pins them above
the flash threshold. `STRINGS_NL` is unchanged pending a decision.

## 2.0.0 — 2026-09-05

**The words on screen changed from Dutch to English.** That is the whole
breaking change, and `STRINGS_NL` is the one-line undo. See MIGRATION.md.

Correction KT5. Every user-visible string in the package was written into
the component that renders it, in Dutch, with no way for a consumer to
pass a different one. The fault is not the language — a hardcoded English
string is the same defect — it is that there was no door. JobTracker had
adopted only the components that carry no text at all, which is what the
defect looks like from outside.

### One dictionary

`js/strings.js` holds all 72 keys with English defaults, frozen. Keys that
vary take arguments — `tableRowsFiltered(shown, total)`, `removeNamed(name)`,
`wizardStep(at, of)` — so a consumer can reorder for their own grammar
instead of concatenating ours.

`STRINGS_NL` exports the Dutch that used to be the default, for kyu,
almanac and kp-soft.

### Three ways in, nearest wins

A `strings` prop on any component, a `StringsProvider` from
`hooks/use-strings.jsx` for a subtree, or `setStrings()` globally for the
framework-free channel. Every override is partial. A consumer who does
nothing gets English.

### The screen-reader half

The announcements are the part of this that matters most, because they
fail silently and only for the people who cannot see that they failed. A
copied value announced `` `${value} gekopieerd` ``; the DataTable
announced its filtered row count in Dutch into an `aria-live` region.
Both now come from the dictionary, and the gate does not know they are
special: they are strings.

### `js/contrast.js` is public

The WCAG primitives moved out of `gates/colour.mjs` so a consumer measures
a ratio with the same code our gate measures it with, rather than a second
opinion. `gates/colour.mjs` re-exports from it, unchanged for anyone
importing it there.

### Every field type, not only a text box [TH61]

`FormField` took a `type` prop and rendered an `<input>` whatever it was
told, so a real form grew a hand-written half beside it — without the
label, the error and the `aria-describedby` wiring that are the point of
the component. It now renders `select`, `textarea`, `checkbox` and
`radio` as what they say, and passes `options` through for the two that
need a list.

A radio group is a group: a `<fieldset role="radiogroup">` with the
question as its legend. That has three consequences the suite pins.
The summary counts it once rather than once per button. It is named by
its legend rather than by one of its answers — "How do we reach you?",
not "Email". And the group carries `aria-invalid`, because putting it on
one radio says the wrong thing about the others.

The framework-free channel already validated anything the browser
validates, since it works on `form.elements`. What it did not know was
that a radio group is one question; it does now, so both channels answer
the same.

`Form` itself was collecting only `HTMLInputElement`, so a required
select nobody chose from was thrown away before the summary looked at it.

### A consumer's own link component [TH62]

`NavBar`, `Breadcrumb` and `Pagination` take `linkComponent`, defaulting
to `'a'`. A plain anchor is correct HTML and reloads the page, which is
right for a server-rendered site and wrong inside React Router or Next,
where every click would throw the state away.

The skip link is deliberately not routed: it is a same-page anchor, and
sending it through a router turns the one link a keyboard user needs into
a navigation.

Kenny asked for this on `NavBar`. `Breadcrumb` and `Pagination` had the
same hardcoded `<a>`, and a measure written for the place a fault showed
rather than for the property it has meets you again somewhere else.

### The gate

`npm run check:strings` reads our source and refuses a user-visible
literal that does not come from the dictionary — the same shape as the
layer gate. It matches sinks rather than shapes: where a literal _goes_
(`textContent`, `placeholder`, `setAttribute('aria-label', …)`, JSX
attributes and text nodes, and a bare literal inside a JSX expression),
not what it looks like.

Drilled red in all four of those shapes before it was trusted. It passed
the fourth on the first attempt — the sr-only case, which is the one KT5
exists about — and was fixed. The drills are frozen in
`gates/gates.test.mjs` so the exemptions cannot widen back over them.

## 1.2.0 — 2026-09-04

Twenty-two components, in both channels. Kenny asked for a DataTable and
"top of the line forms", then went through
<https://github.com/brillout/awesome-react-components> with me and rated
the rest.

### The two that were asked for

**DataTable** — sorting, global filtering, pagination, row selection, an
empty state, and a narrow layout where each row becomes a card carrying
its column names. Measured against TanStack Table's feature list, which
is what "best in 2026" means. Deliberately without virtualisation,
in-cell editing or export: that is a grid, a different product, and the
decision is recorded rather than forgotten.

The features were the easy part. `aria-sort` lands on the sorted column
and nowhere else, the row count after a filter is announced, a number
column sorts as numbers, and the header checkbox goes indeterminate on a
partial selection — because a box reading "checked" while one of three
rows is selected is a lie.

**Forms** — the browser already validates; what it does not do is put the
message where a screen reader will read it, gather the errors, or move
focus to them. The summary takes focus rather than merely appearing,
`aria-describedby` is appended to rather than replaced, and validation
reports on blur. Telling someone their email is invalid while they type
the third character is technically true and practically hostile.

### The rest of the round

Combobox and tag input on a shared listbox engine, with virtual focus.
Command palette and shortcut sheet, together, because a palette without
discoverability is a secret. Tree, drag-to-reorder and split pane — all
keyboard-first, no drag library. Date picker, file upload, step wizard.
Empty states that know the difference between "nothing yet" and "nothing
matched", optimistic actions with undo, status parts, a copyable value
and a diff view.

A movable grid layout where every gesture has a keyboard equivalent and
the keyboard one is what the tests drive.

And a colour picker that reports the WCAG contrast ratio of the chosen
colour against the current theme's background, using the same function
the contrast gate uses. That is the one thing a colour picker inside a
theme system can do that a general-purpose one cannot — and a picker that
shows a colour without saying whether anyone can read it is how the
unreadable colours got in.

### What the suites found

Every one of these was found by a test or by the showcase, not by review:

- The two channels disagreed about what a choice is: Enter took `banaan`
  in one and `Banaan` in the other, because the framework-free half
  conflated an option's label with its value.
- Two command palettes on one page both answered Ctrl+K and stacked two
  modal dialogs.
- The React palette kept the old query when opened any way other than the
  shortcut, while the other channel had already cleared it.
- The React form gathered a summary and left the FIELDS unmarked — no
  `aria-invalid`, no per-field message, no blur validation. Four
  assertions failed at once.
- Reorder moved focus with a document-wide query and landed in the other
  channel's list.
- And the showcase found, within a minute, that the combobox input
  overflowed its wrapper by 10 px: at 320 px that pushed the page
  sideways and DI11 went red on all eleven themes. Every browser test had
  been green; the fixture pages were not narrow enough to notice.

### Also

`js/contrast.js` is new and public: the colour primitives moved out of
`gates/`, which is the package's own tooling, so a consumer gets the same
contrast measurement rather than a second opinion.

418 browser tests in Chromium and Firefox, 25 unit tests, 59 export paths.

---

## 1.1.0 — 2026-09-04

Types, and the promise that a version does not move under you.

**Everything here came from a consumer, on the day 1.0.0 shipped.**
JobTracker adopted it and could not: the package carried no type
declarations at all — no `types`, no `typings`, not one `.d.ts` — while
the README, the user guide and the ecosystem entry all promised a `Theme`
type. Their own code was clean; all seven errors were in ours.

### The package ships types

A `.d.ts` beside every entry point, generated from the JSDoc sources and
held in step by a gate, the same contract as the stylesheets and the Home
Assistant themes. `index.d.ts` is published too, which it would not have
been: `files` named `index.js` as a file rather than a directory, so the
main entry point would have arrived without types a second time. The gate
found that before the release did.

### `Theme` is the eleven names, not `string`

It was `@typedef {string} Theme`, which meant the type promised something
it did not deliver: `applyTheme('formeel')` type-checked and then fell
back to `formal` at runtime. It is the generated union now.

Only the OUTPUTS narrowed. What a function accepts stayed lenient —
`storeTheme` and `initializeTheme` still take a plain string — because
narrowing an input breaks a consumer that reads a theme out of config or a
database, which is what JobTracker and kp-soft both do. Narrowing a return
value cannot break anyone. Use `isTheme()` to narrow a string you hold.

That change is why this is 1.1.0 rather than 1.0.1.

### One real defect, found by a stricter compiler

`tabs[index].focus()` in the tab-list keyboard handler had no guard. Under
`noUncheckedIndexedAccess` it is a type error; in a browser it is a thrown
`TypeError` that stops the key handler on an out-of-range index.

### A gate that checks what a consumer gets

`npm run check:types` type-checks OUR sources with OUR resolution — bundler,
`noUncheckedIndexedAccess` off — and could never have seen this. The new
gate packs the tarball and asserts that every published entry point carries
a declaration inside it.

It does not pretend to be a consumer's type checker. Two attempts to build
that could not fail — the first fell back to the `.js` beside the missing
`.d.ts`, the second because TypeScript 7 infers types from a dependency's
JSDoc where JobTracker's compiler does not — and a check that cannot fail
is the one thing this project has a rule against.

### Documentation that matched the decisions

The README still documented an npm setting and a Tailwind `@source` as
requirements after both were struck, and still pinned `#v0.1.1`. It now
says what this package is: a source, with one promise.

**A released version of a theme never changes.** The token values of `dark`
at v1.0.0 are its values at v1.0.0 forever; any change raises the version,
including a correction of a value that is plainly wrong. Pin one and stop
thinking about it. Every release carries a version number, a provenance
line and `SHA256SUMS`, and that is the whole of what a consumer can rely on
mechanically.

Also: how to keep another framework's theme flag in step using the theme
event, without a second list of which themes are dark — two consumers were
found keeping one, and both had it wrong. And why a theme switch can look
stuck in a browser that renders no frames.

---

## 1.0.0 — 2026-09-04

The first release of kp-themes as its own thing. v0.1.1 was the
extraction from kp-soft: seven palettes, a React hook, a switcher, and
one contrast check. This is a package.

**It is a breaking release, and the breaks are worth the price.** They are
listed with what each becomes in [MIGRATION.md](MIGRATION.md); the short
version is that a copy of every theme's colours used to live in
JavaScript, and it is gone.

### Two channels, sharing one state

React for a consumer with a build step, and framework-free — CSS classes
plus a `<script type="module">` that attaches behaviour to markup your own
server wrote. They render the same class names and share the same state,
so a page can mix them and nothing betrays which is which.

That state lives on the document rather than in a React module, which is
what makes it possible: a plain `<script>` cannot reach a React closure,
so two pickers on one page would each have set the theme correctly and
each failed to update the other's mark. A change from either is announced
as one DOM event, and a choice made in another tab arrives on the same
one.

### Eleven themes

The seven that came from kp-soft — formal, light, dark, cyberpunk,
pastel, terminal, forest — and four that fill gaps the set had:

- **high-contrast** — black on white with one signal yellow. The only
  theme here whose reason is not taste.
- **sepia** — warm parchment and brown ink, no cool hue in the reading
  surface. The restful one.
- **blueprint** — cyan on Prussian blue, ruled like a technical drawing.
  Topo is a map; this is the drawing of a thing that does not exist yet.
- **solstice** — warm dark: charcoal, amber and rust, for the reader who
  finds dark clinical and cyberpunk loud.

Each has an anatomy document saying what it is, what is load-bearing, and
what it deliberately does not do. Colour choices come from those
documents rather than from taste.

### A theme is complete now

Links, visited links, text selection, code, kbd, mark, blockquote, list
markers, placeholders, invalid fields, the checkbox tick, and a print
stylesheet. Before this, a consumer who took the palette and wrote
ordinary HTML got a themed page with browser-default holes in it — the
browser's own link blue scored 1.99 against the dark theme's background,
where 4.5 is the floor.

Eighteen components in both channels: button, badge, table, alert, form
field, card, navigation bar, and the eleven overlays. Two of their
contracts are enforced rather than documented — a destructive action must
offer an undo or a confirmation, and a badge whose colour means something
must also say what it means.

### Motion is part of a theme's character

`--fx-duration`, `--fx-ease` and `--fx-lift` were declared by every theme
and used by nothing. Every transition reads them now: terminal steps
rather than eases, because a character display jumps; pastel overshoots;
formal, sepia and high-contrast do not move things at all. Each theme has
at most one gesture of its own, and two have none on purpose.

### Home Assistant

`ha/kp-*.yaml` is the same eleven themes as Home Assistant themes,
generated from the same token sources, so a dashboard and a web page mean
the same thing by "primary". Where card-mod is installed they carry the
theme's timing too.

### Eleven gates, and a rule about them

Contrast, the design invariants, the flash threshold, reduced-motion
guards, token parity, layer discipline, the type check, and whether the
generated files still match their sources — all in Node, all under a
second, all blocking a commit. A behaviour suite of 182 tests runs in
Chromium and Firefox.

Every one of them has been shown red on a deliberately injected violation
before being trusted, because one check in this project was written,
reported as built, and never ran once.

### What they found

Not theory. Each of these was live in the code:

- `fx-flicker` made 5.5 opposing luminance changes per second where
  SC 2.3.1 allows three.
- The focus ring measured 1.00 — identical luminance — against a primary
  button in three themes.
- `--color-scheme` was declared by every theme and applied by nothing, so
  the browser drew light scrollbars over every dark theme.
- 42 colour literals duplicated tokens, three of which had already
  drifted from the token they came from.
- The pressed state was invisible in cyberpunk and terminal.
- `--chart-4` in pastel sat at 2.20 against the page where 3.0 is the
  floor: a chart series nobody could see.
- The whole framework-free channel was missing from the published
  package, found by the first field test.
- Both typefaces a theme declares were applied almost nowhere, so a
  vendored copy rendered in Times New Roman.

### Also

MIT licence. Checksums beside the release tag, because kyu and almanac
vendor the stylesheet and have no npm to verify anything for them. A
showcase at <https://kennypassenier.github.io/kp-themes/> showing all
eleven themes and everything in them.

---

## 0.1.1 — 2026-09-02

Extraction from kp-soft at commit `2983abb`: the seven themes, the
registers, the cyberpunk effects, the theme hook and switcher, the
contrast check, and the seven status-colour tokens JobTracker needed.
