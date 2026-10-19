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

- New component `.kp-diffview[data-kp-diffview]` (`__bar`, `__summary`, `__tools`, `__list`, `__file[data-kp-diff-status|data-kp-diff-file-open]`, `__head`, `__title`, `__toggle`, `__chevron`, `__status` = a `.kp-badge`, `__path`, `__dir`, `__name`, `__renamed`, `__arrow`, `__counts`, `__added`, `__removed`, `__proportion`, `__block`, `__copy`, `__body`, `__note`, `__plate`, `__stage`, `__wait`, `__live`; inside the lines `.kp-diff__fold`, `.kp-diff__more`, `.kp-diff__row-button`, `.kp-diff__text`, `.kp-diff__word`) with `js/diff.js`: `attachDiffs`, `setDiff`, `diffWords`, `foldContext`, `DIFF`, `DIFF_TOGGLE_EVENT` (`kp-diff-toggle`), `DIFF_EXPAND_EVENT`, `DIFF_COPY_EVENT`, `DIFF_RETRY_EVENT`, `DIFF_CONTEXT`, `DIFF_FOLD_MIN`, `DIFF_MAX_LINES`, `DIFF_WORD_LIMIT`, `DIFF_WORD_SHARE`, `DIFF_STATUSES`; attributes `data-kp-diff-open|context|words|bar|copy|max-lines|label|state`; knobs `--kp-diffview-min|status|gap`; strings `diff…`. The existing diff page gains a live example with data (2026-10-19, research/gap-diff-view, formal only until approved).

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
