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

- gantt-fit-1101 (2026-11-01), site/components/gantt.html: `data-kp-gantt-scroll="fit"` in the `data-kp-gantt-scroll` option row (written in gates/site/descriptors/gantt.mjs): the whole window across the width with no sideways scroll, every label whole (inside, after, before, or on its own line under its bar), lanes as tall as their rows; an example of Kitchen's cook plan at 390 px drawn from research/gantt-fit-1101.
- habits-1101, site/components/task-row.html (new page, generated from gates/site/descriptors/task-row.mjs): the task row with `buildTaskRow`, its facts, actions, menu and context menu, in a reorder group with row picking; one example of a Today list.
- habits-1101, site/components/markdown.html: the reader's `tasks` option (`off`, `show`, `toggle`), `kp-markdown-task` and `toggleTaskLine`; the Markdown editor (`js/markdown-editor.js`): `data-kp-md-editor`, `data-kp-md-preview` (`side`, `tabs`, `off`), `data-kp-md-headings`, the toolbar and its keys, `showMarkdownView`, `refreshMarkdownPreview`; one example with a task's notes.
- habits-1101, site/components/badge.html and the tokens page: the twelve categorical colours `--kp-cat-1` … `--kp-cat-12` with `--kp-cat-ink`, `data-kp-cat`, `.kp-cat-chip` and `.kp-cat-dot`; one example with the twelve as chips and as dots beside project names.
- habits-1101, site/components/pipeline.html (or a page of its own): the board (`js/board.js`): `data-kp-board`, `data-kp-board-lane`, `-label`, `-limit`, `-narrow` (`scroll`, `tabs`), `-group`, `setBoardState`, `showBoardLane`, `recountBoard`, `kp-board-lane`, `kp-board-retry`; one example with three lanes of task rows and a limit.
- habits-1101, site/components/menu-button.html: the context menu (`js/context-menu.js`): `data-kp-context-menu` (empty, `inner`, an id), `setContextMenu`, `attachContextMenus`, `openContextMenu`, `data-kp-context-menu-label`, `data-kp-context-press`, `kp-context-menu-open`; one example with a task row whose right click shows its ⋯ entries.
- habits-1101, site/components/reorder.html: `data-kp-reorder-group`, `data-kp-reorder-list` and `data-kp-reorder-label`, the ← / → keys and `fromList` / `toList` in `kp-reorder`; one example with two day lists that share their tasks.
- habits-1101, a page for `js/row-pick.js` (site/components, next to the selection bar and the data table's select column): `data-kp-row-pick`, `data-kp-row-key`, `data-kp-picked`, `data-kp-pick-mode`, `data-kp-pick-ignore`, the five key functions bound with `registerShortcuts`, and the selection bar fed with no boxes.
- habits-1101, site/components/sidenav.html: the `kp-sidenav-group` event (`{ id, expanded, source }`) and the `.kp-sidenav__category-action` slot beside a category toggle (stays visible folded; `data-kp-sidenav-slim-hide` hides it in the rail); one example with a "+ New project" action.
- habits-1101, site/components/focus-steps.html: a step's `body` (Node or Markdown, `.kp-focus-steps__detail`) and the functions `nextStep(root)` / `prevStep(root)`; one example with a Markdown body and a page-bound Enter key.
- habits-1101, site/components/structure.html: `attachStructure(root)` also wires `root` itself when it is a tree, reorder list or split pane (the option row for `root` says so).
- habits-1101, site/components/selection.html: a floating-bottom bar publishes `--kp-selection-lift` on the root (toasts rise above it; a custom property, not an option), and under 30rem the count has its own row (the narrow layout text says so).
- habits-1101 (2026-11-01), site/components/calendar.html: a calm calendar prints a count on every tone that carries one (a `warn` day under `data-kp-calm-map="none"`), not on logged only; the calm paragraph says so.
- ux-1101, site/components/segmented.html (three-way): `data-kp-segmented-tri-look` (`mark` default, `word`), `data-kp-segmented-tags`, `.kp-segmented__tag`, the `+` / `-` keys and `aria-keyshortcuts`; demo research/ux-parts-1101 section tri-state-chip.
- ux-1101, site/components/segmented.html: `data-kp-segmented-fit` (`flow` default, `tracks`), `data-kp-segmented-fold-at` (`30rem`, `none`), the fold menu `.kp-segmented__fold`, `data-kp-segmented-folded` written; demo research/ux-parts-1101 section chips-narrow.
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
- ux-1101 (2026-11-01), site/components/datatable.html: the Filters popover (`data-kp-filters="inline"` keeps the inline panel; `--kp-datatable-filters-width`), the visible Min / Max / From / To labels, the empty and failed table that is only its plate, and `data-kp-datatable-keep-pager` (the pager hides on one page).
- ux-1101, site/components/datatable.html: `data-kp-row-actions="menu"` with `data-kp-row-primary` (one primary action and a row menu, also in phone cards), and the fixed column tracks while a group folds (a sentence, no option).
- ux-1101, site/components/action-columns.html: `data-kp-actions-narrow="stack"` (the narrow list's buttons are one row, the primary first, by default; `stack` keeps one per line), with a before and after.
- ux-1101, site/components/disabled-reason.html and uptime.html: the reason printed under the control on a coarse pointer; the uptime row tap on a coarse pointer (sentences, no options).
- ux-1101, site/components/list.html: the column head `.kp-listrow--head` (the rows drop their switch word while the list is wider than 40rem); site/components/attention.html and problems.html: the sentence on the band or the Problems list; site/components/menu-button.html: row actions behind a menu.

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
