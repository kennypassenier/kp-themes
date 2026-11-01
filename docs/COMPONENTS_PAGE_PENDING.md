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

- habits-1101 (2026-11-01), site/components/calendar.html: a calm calendar prints a count on every tone that carries one (a `warn` day under `data-kp-calm-map="none"`), not on logged only; the calm paragraph says so.
- fix-1031 (2026-10-31), site/components/badge.html: the badge run's tracks are auto-fit, so the tracks no badge stands in collapse and one or a few badges keep their natural width (no option of its own; the sentence under the run says so).
- fix-1031, site/components/toolbar.html: a labelled group (`.kp-toolbar__label` then the segmented) is a two-track grid, so wrapped chips stay beside the label; under 48rem and in `.kp-toolbar--stacked` every group has its own line and its chips scroll on it (each chip whole, the focus ring inside), where the whole filter zone used to be one scrolling line that hid the groups after the first. An example with two groups at a narrow width shows it.
- fix-1031, site/components/dialog.html (the rich confirmation): a `description` that holds a field (a quantity, an input) gives that field the first focus, whatever `initialFocus` says.
- fix-1031, site/components/segmented.html: the sentence in the chips-tied-to-a-field example and the `data-kp-segmented-for` option row now say that a linked group drawn later is linked as it arrives under an attached root (written in gates/site/descriptors; regenerate the page in the pass).
- fix-1031: `./js/log` is a published module (`sourceColour`, `sourceIndex`, `SOURCE_PROPERTY`, `attachLogs`), so the bundle exports it; the log page names the import.
- list-action-1031 (2026-10-31), site/components/list.html: the trailing action column `.kp-listrow__action` (`[action] auto` at the end of the tracks, only in a list that holds an action; empty cell in a row without one; its own full line in the card), the `--kp-list-tracks` knob row with its new default, and an example of mixed rows (an "I took one" button, the word "Scheduled", no action, and a row with stepper and switch) drawn from research/list-action-1031.
- gaps-1031 (2026-10-31), site/components/question.html: the batch bar, `data-kp-questions-batch` (`off` default, `on`, `confirm`) and `data-kp-questions-batch-min` (default 2), with an example of three open questions and the bar over them.
- gaps-1031, site/components/notices.html: the `preview` look (embedded, read-only: no heading, Mark all read, Mark read or switches; the Inbox link with `data-kp-inbox-href`; no title count and no toasts by default).
- gaps-1031, site/components/passkeys.html: a row's `extra` slot (a string badge or a node), `rename: false` / `data-kp-rename="off"`, and `missingUse` / `data-kp-missing-use` (`never` default, `unknown`, `none`), with a machine-token example.
- gaps-1031, site/components/master-detail.html: the detail + aside variant without a list pane (`data-kp-pane-listless` written, `1fr 24rem` columns, no Back).
- gaps-1031, site/components/week.html: `data-kp-week-off` (`show` default, `hide`).
- gaps-1031, site/components/command.html: a masked token `data-kp-command-secret` with `data-kp-command-secret-mask` (`dots` default, `tail`) and `data-kp-command-secret-reveal` (`on` default, `off`), Copy copying the real value.
- gaps-1031 (2026-10-31), site/components/unsaved.html: the bar counts a quantity, a time field and a tag input as one control each (their own events, written back through their setters; a field marked `data-kp-untracked` stays out); `data-kp-placement` is switchable at runtime; and the `attachUnsaved(root, { show })` option row: `show(control, value, row)` returns the page's own words for a value in the list (both "was" and "now"), for a mirrored editor.
- gaps-1031, site/components/question-card.html and site/components/snooze.html: the question card's `data-kp-measure` (ring, bar, text) and the snooze picker's `data-kp-look` (chips, menu) are switchable at runtime: a "switchable at runtime" note in each option row.
- gaps-1031, site/components/datatable.html (and the calm tones section): `data-kp-tones="calm"` on a `.kp-datatable` or `.kp-table` with `data-kp-tone="logged | quiet | paused"` on a cell (and `data-kp-logged-fill="success"`): an option row and an example of a freezer list whose old-portion hint is a quiet cell.

(Nothing waits. The pass of 2026-10-31, on Kenny's go "components-page: Nu bijwerken", brought every line of the Medicine Cabinet package
(mc-1030) onto its page, with the new pages list rows and row editor, examples drawn from the approved demo research/medicine-1030: the quantity's
`data-kp-quantity-fill`, the attention band's cap, the badge run, the dialog width steps and the rich confirmation (`description`, `acceptLook`,
`acceptLabel`, `acceptFollows`, `acceptVerb`), the data table's actions column and `data-kp-cards-at`, the chips tied to a field
(`single-or-none`, `data-kp-segmented-for`, `-top`), the form grid's reserved error line and start-edge text, the form grid in a card, the switch
without a state word and the page header's updated line. Its excuse in gates/check-site.mjs is gone. Shown as text and option rows only, without
a live example of their own: `data-kp-segmented-field="always"` (the example shows its default, the field left out), `data-kp-formgrid-align="center"`
(the example shows the start edge it now defaults to), `data-kp-rows-attach="none"`, the calls `attachCardsAt` and `attachTableActionColumns`
(js/auto.js makes them for every table that asks), and `kp-dialog--wider` (its table is the data table's actions example).)

(The pass of 2026-10-29, on Kenny's go "components-page: Nu bijwerken", brought every line onto its page, with the new pages
sequencer, formgrid and state-plate. Shown as text and option rows only, without a live example, because the page cannot show them or they
are a script call or a register-level fact: the script calls `getSteps`, `columnIndex` and `watchOptions`, the `configureUnsaved` storage, the
focus-steps lanes and `T` keys, the wheel kiosk, the tooltip's touch card, the entity card trend row and app tile, the gantt legend, rest
stretch and scroll, the heat axis rule, the calendar and pipeline state plates, the matrix and uses-map tones, the kpi, timers, uptime and
checklist states, and every "switchable at runtime" note. The register-level passes (the gantt rest stretch and the uses-map plate in the
twelve registers) were not asked for.)


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

