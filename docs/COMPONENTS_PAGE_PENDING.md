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

- New component `.kp-logviewer[data-kp-logviewer]` (`__bar`, `__search`, `__find` = a `.kp-field__input`, `__matches`, `__step`, `__glyph`, `__tools`, `__follow`, `__time` = a `.kp-segmented`, `__level-wrap`, `__level-label`, `__level`, `__stage`, `__log` = a `.kp-log` that is the scroller, `__foot`, `__count`, `__dropped`, `__plate`, `__busy`, `__live`; `.kp-log__word`, `.kp-log__match[data-kp-current]`; `[data-kp-log-plate=loading|error|empty|nomatch]`, `[data-kp-log-nosource]`) with `js/logviewer.js`: `attachLogViewers`, `setLogViewer`, `appendLogLines`, `logViewerLines`, `logViewerText`, `clearLogViewer`, `searchLogViewer`, `stepLogMatch`, `logLevel`, `LOGVIEWER`, `LOGVIEWER_EVENT` (`kp-logviewer-change`), `LOGVIEWER_RETRY_EVENT` (`kp-logviewer-retry`), `LOGVIEWER_MAX`, `LOG_LEVELS`; attributes `data-kp-log-max|wrap|time|level|search|search-only|follow|tools|filename|hint|focus-key`, `data-kp-state`; knobs `--kp-logviewer-height|min`; strings `logviewer…`. Built on `.kp-log`, js/log.js and js/newpill.js; no virtual windowing (TH42). Needs a page of its own (2026-10-19, research/gap-log-viewer).
- Tab count, tile keys and heat legend [gap-tab-count; research/gap-tab-count, on the Agenda]: tabs.html gets the count on a `.kp-tab` (`setTabCount`, `data-kp-tab-count` with `-tone`, `-unit`, `-show-unit`, `-state` loading and error, `-zero`) with an example of each tone and state; tiles.html gets `data-kp-tiles-keys` (roving tab stop, Left/Right/Up/Down/Home/End/PageUp/PageDown, `data-kp-tiles-keys-exit`, `kp-tiles-move`, `kp-tiles-exit`); heat.html gets `setHeatLegend` (entries, ramp, keys), the `legend` and `legendKeys` of `setHeat`, and the calm grid's own legend with `data-kp-legend="hide"`.
