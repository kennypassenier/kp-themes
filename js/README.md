# js/ source index

The JavaScript modules a consumer imports live in `js/<name>.js`; the `package.json` exports, `auto.js` and every app point at
those paths and nothing else. The one hundred and nine largest modules are a **facade**: a short file that re-exports exactly the names the module
always exported (and its `@typedef`s), over a folder `js/<name>/` of single-purpose files. A file is never longer than
500 lines (`npm run check:file-size`, `gates/file-size.json`), the same rule as `css/`.

## How a module is found

- Open `js/<name>.js` first: the header comment says what the module is, the `export { … } from './<name>/<file>.js'` lines say
  where each public name lives. Every part opens with one line saying what it does.
- Files are named by responsibility, not by position: `datatable/sort.js`, `datatable/filter.js`, `sidenav/resizer.js`.
  Pure helpers that tests import keep their export names and are re-exported by the facade.
- A big closure (`attachDataTables`, `attachSidenavs`, `plotChart`) is split into **install functions** that share one
  context object `c`: `js/datatable/attach/`, `js/sidenav/attach/` and `js/chart/plot/` hold one file per concern, each
  exporting `install<Name>(c)`. The host file (`attach.js`, `plot.js`) builds `c`, calls the installs in order and returns.
  A part reads what an earlier part published with `const { … } = c`, reads what changes (`let` values) as `c.name`, and
  `context.js` types the whole context from the fields each part adds (`<Part>Fields`). The order of the calls is the order
  the code ran in before the split; keep it.
- **Controller classes** (closure-pattern B, Kenny 2026-10-30) replace both the long closures and the install functions, module by
  module: one class per component instance extends `Controller` from `js/controller.js`, keeps its state on the instance, wires
  the host in `connect()` with `this.listen()` / `this.observe()` / `this.own()`, and is undone by `destroy()`. The public
  `attachX(root, options)` becomes `attachAll(root, SELECTOR, XController, options)`. Converted so far: `footprint.js`, `notices.js`, `row-select.js`, `sentence.js`, `checklist.js`, `qr.js`, `structure.js`, `unsaved.js`, `datepicker.js`, `segmented.js`, `code.js`, `timefield.js`, `gallery.js`, `calendar.js`, `rating.js`, `anchors.js`, `remember.js`, `slider.js`, `tiles.js`, `wheel.js`, `toggle.js`, `snooze.js`, `selection-bar.js`, `request-inspector.js`, `statusrow.js`, `passkeys.js`, `feed.js`, `autosize.js`, `countdown.js`, `forms.js`, `auto-refresh.js`, `json-field.js`, `master-detail.js`, `dated-options.js`, `quote.js`, `thread.js`, `uses-map.js`, `shortcuts.js`, `auto.js`, `effects.js`, `range.js`, `nav-fold.js`, `ack-gate.js`, `code-field.js`, `pipeline.js`, `tabbar.js`, `idmark.js`, `tour.js`, `problems.js`, `facets.js`, `undo-toast.js`, `transfer.js`, `theme-core.js`, `deplist.js`, `docpreview.js`, `quantity.js`, `theme-picker.js`, `freshness.js`, `hovercard.js`, `stackbar.js`, `version-delta.js`, `kpi.js`, `question-card.js`, `page-contents.js`, `listbox.js`, `newpill.js`, `actions.js`, `runs.js`, `weekdays.js`, `path-trace.js`, `alarm.js`, `upload.js`, `timer-disc.js`, `flash.js`, `bullets.js`, `connection.js`, `quiet-hours.js`, `compare.js`, `viewer.js`, `gridlayout.js`, `update.js`, `lazy-register.js`, `card-state.js`.
- Values that several parts of one module change (a counter, a lazily loaded module) live in `<name>/state.js`.
- The loader (`auto.js`), the digests (`gates/generate-code-version.mjs`) and the gates that read module text
  (`gates/js-parts.mjs`) treat a facade and its folder as one module.
- Adding a part: create the file with its one-line header, import it where it is used, add it to `FILES` in
  `gates/checksums.mjs` (and to `VENDORED` in `gates/check-closure.mjs` for `strings` and `components`), then run
  `npm run generate:types`, `npm run generate:bundle`, `npm run generate:min`, `npm run checksums` and
  `node gates/generate-code-version.mjs`.

## js/datatable.js → js/datatable/

The data table: sorting, filtering, paging, cards, detail rows, reorder, editing, server mode. 33 files.

| File                     | Does                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `attach/apply.js`        | Writes the controls from the state, reads them back, and applies sorts and filters.                    |
| `attach/busy.js`         | The loading overlay, the busy clock and the empty state.                                               |
| `attach/chrome.js`       | The chrome around the table: the scroll box, the top and bottom bars.                                  |
| `attach/columns.js`      | The columns: headers, labels, kinds and how a cell reads.                                              |
| `attach/context.js`      | The context the parts of one wired data table share.                                                   |
| `attach/controls.js`     | Finds the controls around the table and reads its options.                                             |
| `attach/details.js`      | The detail rows, the expand cell and the reorder cell.                                                 |
| `attach/edit.js`         | In-cell editing: open, commit, undo and the app's say.                                                 |
| `attach/expand.js`       | Expanding and folding rows and the row keys.                                                           |
| `attach/filter-ui.js`    | The filter panel: its columns, pills, add menu, editor and choice lists.                               |
| `attach/groups.js`       | Row groups: collecting, folding, placing and syncing them.                                             |
| `attach/handle.js`       | The handle a page gets back from the table.                                                            |
| `attach/handlers.js`     | The handlers of the search, scope, density, sort, page size and column controls.                       |
| `attach/identity.js`     | The table's id, its undo list and the arrival mark.                                                    |
| `attach/layout-setup.js` | The grid mode, the held height, the cover box and the page-size select.                                |
| `attach/model.js`        | The table's view state: rows, page, query, scope, filters, sorts and busy flags.                       |
| `attach/pills.js`        | The filter pills, the add menu and the filter editor.                                                  |
| `attach/render.js`       | Renders the rows, the pager and the filter pills area.                                                 |
| `attach/reorder.js`      | Row preparation and the drag and keyboard reorder of rows.                                             |
| `attach/selection.js`    | Row selection: focus memory, announcements and the select-all.                                         |
| `attach/server.js`       | Server mode: sending a request and applying the answer.                                                |
| `attach/sort-setup.js`   | The sort and column controls and the remembered columns.                                               |
| `attach/sync.js`         | Syncs the table's parts with its state: selection, sort marks, columns, fixed columns and card labels. |
| `attach/unwire.js`       | The detach that undoes everything the table added.                                                     |
| `attach/wire.js`         | Registers the table's listeners and applies its initial state.                                         |
| `attach.js`              | Attaches the data tables of a page: its closure, split into parts.                                     |
| `events.js`              | The event names, page sizes and fixed numbers of the data table.                                       |
| `filter.js`              | Pure filtering: filter bounds, matching and the pills that name a filter.                              |
| `grid.js`                | The grid mode: fixed columns, the scrolled marker and the grid attachment.                             |
| `instance.js`            | The table instances, their handles and the default filter.                                             |
| `selectors.js`           | The selectors and class names the data table finds its parts by.                                       |
| `sort.js`                | Pure sorting: the comparison, the order and the next sort of a column.                                 |
| `state.js`               | The counter the data table parts share to give each table its own id.                                  |

## js/strings.js → js/strings/

The dictionary of every user-visible string, by component group. 30 files.

| File                           | Does                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `alert-status-idmark.js`       | The words of the alert, the attention band, the age words, steps, status rows, cards, facets and id marks.                     |
| `availability-qr-time.js`      | The words of availability, QR codes and the time field.                                                                        |
| `calendar-week-gantt.js`       | The words of the calendar, the week agenda and the run timeline.                                                               |
| `claim.js`                     | The words of claims.                                                                                                           |
| `console.js`                   | The words of the console.                                                                                                      |
| `defaults.js`                  | The default strings: the English of every component group, in one frozen object.                                               |
| `deplist-trace-entity.js`      | The words of the dependency list, the path trace and the entity card.                                                          |
| `diff-rating.js`               | The words of the diff and of ratings.                                                                                          |
| `feed-sequencer.js`            | The words of the feed and the sequencer.                                                                                       |
| `focus.js`                     | The words of the focus steps, their tracks and their resume question.                                                          |
| `form-date-copy.js`            | The words of forms, the date picker, upload, the wizard, copy buttons and secrets.                                             |
| `passkeys-thread-chart.js`     | The words of the passkey list, the conversation thread and the first chart words.                                              |
| `pipeline-uptime-timer.js`     | The words of pipelines, the uptime strip, type and command blocks and timers.                                                  |
| `problem-graph-diagnostics.js` | The words of problems, flashes, the graph, breadcrumbs, pagination, themes and diagnostics.                                    |
| `quantity-checklist-focus.js`  | The words of quantities, checklists, timers, the focus steps and the wheel.                                                    |
| `question-transfer-conn.js`    | The words of the question card, the transfer list, markdown, jobs, the connection banner, refresh and the panes.               |
| `quote-status-calm.js`         | The words of quotes, the status list and calm status.                                                                          |
| `range-weekdays-runs.js`       | The words of ranges, weekday pickers and run lists.                                                                            |
| `req-notices.js`               | The words of the request inspector and the notices.                                                                            |
| `runtime.js`                   | The current strings and the functions that read, replace and publish them.                                                     |
| `selection-undo-newpill.js`    | The words of the selection bar, undo, the new pill, payloads, JSON fields and quiet hours.                                     |
| `snooze-dated-slider.js`       | The words of snooze, dated options, sentences, sliders, autosize, anchors and print.                                           |
| `split-confirm-chart.js`       | The words of the split, reorder, tiles, contrast, colour, confirmations, alarms, arrivals, charts, menus, the tour and meters. |
| `stackbar-bullets-code.js`     | The words of the stack bar, the bullets, code blocks and rows.                                                                 |
| `table-heat.js`                | The words of the data table, the toolbar, the heat grid and the matrix.                                                        |
| `toggle-palette-ack.js`        | The words of the toggle, the tab count, the intent line, the command palette, version chips and the acknowledge gate.          |
| `types.js`                     | The Strings type: the strings of every component group, together.                                                              |
| `uses-unsaved-compare.js`      | The words of the uses map, unsaved changes, compare, calm, shortcuts and the lede.                                             |
| `usual-logviewer.js`           | The words of the usual picker and the log viewer.                                                                              |
| `viewer-preview-gallery.js`    | The words of the viewer, the document preview and the gallery.                                                                 |

## js/chart.js → js/chart/

The time chart, the spark chart and the key figure trend. 22 files.

| File              | Does                                                                           |
| ----------------- | ------------------------------------------------------------------------------ |
| `api.js`          | The functions a page calls to fill, select, zoom and detach a chart.           |
| `attach.js`       | Attaches the charts and trend charts of a page.                                |
| `constants.js`    | The attribute, event names and defaults of the chart.                          |
| `dom.js`          | SVG and markup helpers every part of the chart uses.                           |
| `format.js`       | Pure value formatting: nice maxima and number formats.                         |
| `group.js`        | A group of charts that share a selection and a window.                         |
| `plot/api.js`     | The chart's data setter and its public state object.                           |
| `plot/context.js` | The context the parts of one full chart share.                                 |
| `plot/draw.js`    | Draws the chart: the state plate and the plot itself.                          |
| `plot/legend.js`  | The legend: its keys, its median words and its loading skeleton.               |
| `plot/pointer.js` | Pointer, keyboard and focus handling of the plot.                              |
| `plot/readers.js` | Small readers of the chart's state: visible series, window, tones and options. |
| `plot/setup.js`   | The chart's mutable state and the elements it draws into.                      |
| `plot/tip.js`     | The legend repaint, the tooltip and what the chart announces.                  |
| `plot.js`         | The full chart: its plotting closure.                                          |
| `selection.js`    | Pure selection rules: nearest point, hour change and next selection.           |
| `spark.js`        | The spark chart: a plot without axes.                                          |
| `state.js`        | The counter the chart parts share to give each clip path its own id.           |
| `stats.js`        | Pure statistics over a series: spans, median and runs.                         |
| `time.js`         | Pure time maths for the axis: wall time, zones, strides and ticks.             |
| `trend.js`        | The trend chart of a key figure.                                               |
| `words.js`        | The words a chart says: its labels, ranges and descriptions.                   |

## js/motion.js → js/motion/

Dialogs that leave the way they came, and boxes that ease to a new size. 13 files.

| File                | Does                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| `arrive.js`         | An element arriving: glide, arrive and the grouped glide.                       |
| `attach.js`         | Attaches the motion layer to a root.                                            |
| `close.js`          | Closing dialogs and popovers: reversed entrance, ghost and native close.        |
| `constants.js`      | The attribute names, selectors and counters the motion layer shares.            |
| `fold-size.js`      | Fold sizing: settled heights and the eased size change.                         |
| `fold.js`           | Folding: timing, curve and frames of a collapsing block.                        |
| `keyframes.js`      | Reads a theme's entrance keyframes and turns them into lines and entrances.     |
| `leave.js`          | Leaving: the leave of one element, a batch, and repaint tracking.               |
| `reversed-leave.js` | A leave played as the reverse of the arrival.                                   |
| `size.js`           | Size easing: the curve and the stepped clock a height change runs on.           |
| `state.js`          | The mutable values the motion parts share: what is watched, in turn or batched. |
| `timing.js`         | Reads the theme's motion timing and the reduced-motion preference.              |
| `turns.js`          | Arrivals in turn: the gap between successive entrances.                         |

## js/gantt.js → js/gantt/

The run timeline. 13 files.

| File           | Does                                                                            |
| -------------- | ------------------------------------------------------------------------------- |
| `api.js`       | The setters a page calls to fill the timeline.                                  |
| `attach.js`    | Attaches the timeline to its element and wires its controls.                    |
| `axis.js`      | The time axis: ticks, day marks and edge ticks.                                 |
| `build.js`     | Builds the timeline's markup: the frame, its bar and lanes.                     |
| `busy.js`      | The loading picture: busy bars and ghosts.                                      |
| `chrome.js`    | Zones, the legend and the chrome around the plot.                               |
| `constants.js` | The attribute names, events and fixed sizes of the run timeline.                |
| `labels.js`    | Places each bar's label inside, beside or outside its bar.                      |
| `paint.js`     | Paints the runs as bars in their lanes and sizes the view.                      |
| `points.js`    | Lane labels and the single points on the axis, clustered when close.            |
| `scale.js`     | Pure scale helpers: range seconds, axis step, lane row packing and clock words. |
| `selection.js` | Refresh, tab stops, focus, selection and the live tick.                         |
| `window.js`    | The visible time window: fitting, resting and the rest state.                   |

## js/focus-steps.js → js/focus-steps/

One step at a time with the screen kept on (cook mode), with parallel tracks. 15 files.

| File           | Does                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `api.js`       | The functions a page calls to move, read and set the focus steps.                                  |
| `attach.js`    | Attaches the focus steps to their element and wires their events.                                  |
| `band.js`      | The band above the step: alerts, the wait line and the suggestion.                                 |
| `blockers.js`  | What blocks a step: the blockers, their names and the lane summaries.                              |
| `constants.js` | The attribute, event names and state table of the focus steps.                                     |
| `dom.js`       | Element lookups and the markup of one step.                                                        |
| `flow.js`      | The step flow: taking an answer, advancing, the answer and summary markup.                         |
| `lanes.js`     | The lanes beside the focus step: build, paint and lay out.                                         |
| `memory.js`    | Remembers progress and restores it.                                                                |
| `paint.js`     | Paints the focused step.                                                                           |
| `resume.js`    | The resume question and the helpers that read an answer.                                           |
| `state.js`     | The mutable values the focus-steps parts share: the id counter and the lazily loaded timer module. |
| `track-nav.js` | Moving between tracks: switch, next, previous, go and start.                                       |
| `tracks.js`    | Tracks: which steps run in parallel and the timers they wait for.                                  |
| `wake.js`      | Keeps the screen awake while a step runs.                                                          |

## js/sequencer.js → js/sequencer/

The editable multi-track timeline. 16 files.

| File           | Does                                                                             |
| -------------- | -------------------------------------------------------------------------------- |
| `api.js`       | The getters and setters a page calls.                                            |
| `attach.js`    | Attaches the sequencer to its element.                                           |
| `bars.js`      | Syncs the bars, the joins between them, the ticks and the labels.                |
| `build.js`     | Builds the sequencer's markup.                                                   |
| `constants.js` | The attribute, event names and fixed sizes of the sequencer.                     |
| `drag.js`      | Dragging and linking: marks, edge scroll, cancel and navigation.                 |
| `edit.js`      | Editing: drafts, commits, selection, refusals and zoom.                          |
| `instance.js`  | One sequencer's state, its options and the small helpers every part uses.        |
| `keyboard.js`  | Focus and keyboard handling.                                                     |
| `lanes.js`     | Paints the lanes and places elements in them.                                    |
| `links.js`     | Pure link rules: linking, unlinking and moving an item by key.                   |
| `paint.js`     | Paints the window, the selection and the state.                                  |
| `plan.js`      | Pure planning: cleans the items, groups them and settles overlaps.               |
| `pointer.js`   | Pointer handling: down, move, up and cancel.                                     |
| `timeline.js`  | Pure timeline maths: rows, total, visible window, ticks and zoom.                |
| `units.js`     | Pure unit maths: rounding, parsing and snapping a value to the sequencer's unit. |

## js/sidenav.js → js/sidenav/

The side navigation: panel, rail, slim, peek, fly-outs and the resize grip. 21 files.

| File                  | Does                                                                           |
| --------------------- | ------------------------------------------------------------------------------ |
| `attach/backdrop.js`  | The backdrop and the focus trap of an open panel.                              |
| `attach/basics.js`    | The panel's readers, its remembered state and the mode it starts in.           |
| `attach/context.js`   | The context the parts of one side navigation share.                            |
| `attach/controls.js`  | The shortcut, the category toggles and the clicks of the panel.                |
| `attach/flyout.js`    | The fly-out of a rail item: opening, closing and its timers.                   |
| `attach/geometry.js`  | The panel's geometry: togglers, content, margins, sizes and the peek strip.    |
| `attach/handle.js`    | The handle a page gets back and the detach that undoes everything.             |
| `attach/launchers.js` | The launchers, the light turn and the live-region sentence.                    |
| `attach/narrow.js`    | Narrow screens: when the panel hides, slims or comes back.                     |
| `attach/open.js`      | Opening, closing and refusing: the one place the open state changes.           |
| `attach/peek.js`      | The peek: the panel shown from its edge.                                       |
| `attach/rail.js`      | The rail glyphs, the start state and the rail keys.                            |
| `attach/resizer.js`   | The resize grip: drag, keys and reset.                                         |
| `attach/shift.js`     | Shifts the content aside and applies the opener.                               |
| `attach/slim.js`      | The slim and rail modes.                                                       |
| `attach/tip.js`       | The tip beside a rail item and the floating submenu.                           |
| `attach/wire.js`      | Registers the panel's event listeners.                                         |
| `attach.js`           | Attaches the side navigation to its element: its closure, split into parts.    |
| `constants.js`        | The event names, attributes and fixed timings of the side navigation.          |
| `helpers.js`          | Pure helpers: the chord parser, list splitting, slide timing and name lookups. |
| `options.js`          | The table of options the side navigation reads from its element.               |

## js/graph.js → js/graph/

The network graph. 9 files.

| File           | Does                                                               |
| -------------- | ------------------------------------------------------------------ |
| `api.js`       | The functions a page calls to fill and drive the graph.            |
| `attach.js`    | Attaches the graph to its element and wires its events.            |
| `constants.js` | The event names and option attributes of the network graph.        |
| `draw.js`      | Draws the graph: nodes, edges and labels.                          |
| `instance.js`  | One graph's state and the SVG helpers every part uses.             |
| `labels.js`    | Pure label and edge geometry: arrows, bends and label fitting.     |
| `layout.js`    | Pure layout: the hub, the rings and the room a graph needs.        |
| `options.js`   | Reads and sets the graph's options.                                |
| `view.js`      | The graph's view: restyle, zoom, pan, reveal and the detail panel. |

## js/components.js → js/components/

Confirmations, skip links, back to top and the navigation toggles, menus and sticky bar. 10 files.

| File                | Does                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| `confirm-dialog.js` | The confirmation dialog and the buttons that open it.                       |
| `contracts.js`      | Checks the confirmation contracts of a page and attaches its confirmations. |
| `nav-menus.js`      | Opens, closes and keys the navigation dropdowns.                            |
| `nav-place.js`      | Places a nav dropdown or mega panel inside the viewport.                    |
| `nav-toggle.js`     | The navigation toggle that opens and closes the nav on small screens.       |
| `skip-links.js`     | Skip links: jump past the navigation to the content.                        |
| `state-word.js`     | Writes a state word onto an element.                                        |
| `sticky-nav.js`     | Sticky navigation: compacts the nav once the page scrolls.                  |
| `to-top.js`         | The back-to-top button.                                                     |
| `type-confirm.js`   | The type-to-confirm field: its constants, matching and markup.              |

## js/heat.js → js/heat/

The heat grid and the matrix: coloured cells a person reads at a glance and asks about. 12 files.

| File             | Does                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `card.js`        | The busy card over a loading grid and the redraw that waits for it.                       |
| `constants.js`   | The selectors, event names, tone list and cell selectors of the heat grid and the matrix. |
| `dom.js`         | Element, tone and unit helpers every part of the heat grid uses.                          |
| `draw.js`        | Draws the heat grid from its spec.                                                        |
| `grid-state.js`  | The per-grid memory the drawing and the wiring share: decorate, tab stop and lit keys.    |
| `legend.js`      | The legend under a heat grid: its entries, its keys and the calm tones.                   |
| `matrix-wire.js` | Wires the matrices of a page: pointer, keys and the attach.                               |
| `matrix.js`      | Draws the matrix and sets its lit headers and its pinned cell.                            |
| `paging.js`      | The Earlier / Today / Later bar before a heat grid.                                       |
| `pick.js`        | The picked column and the lit rows of a heat grid.                                        |
| `types.js`       | The types of the heat grid and the matrix: specs, cells, options and decorate info.       |
| `wire.js`        | Wires the heat grids of a page: pointer, keys and the attach.                             |

## js/availability.js → js/availability/

The availability grid: who can come, edited cell by cell. 10 files.

| File           | Does                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| `api.js`       | The functions a page calls to set the spec and read or set an answer.                 |
| `attach.js`    | Attaches the availability grids of a page.                                            |
| `constants.js` | The selector, event names, answer words and timings of the availability grid.         |
| `dates.js`     | Pure date helpers: the days and the range an availability grid spans.                 |
| `facts.js`     | Reads the grid: its state, its answers, who may edit what and the facts of a column.  |
| `list.js`      | The list view of the columns on a narrow screen.                                      |
| `menu.js`      | The answer menu on a cell.                                                            |
| `paint.js`     | Paints the cells, the summary row and the whole grid from its state.                  |
| `request.js`   | Sends an answer to the page, with undo, and rolls it back when the page refuses.      |
| `types.js`     | The types of the availability grid: answers, people, columns, the spec and the state. |

## js/usual-picker.js → js/usual-picker/

The picker with the usual on top: pick, add and fold names. 12 files.

| File           | Does                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `add.js`       | Adding a name that is not in the list yet.                                                       |
| `attach.js`    | Attaches the usual pickers of a page and the functions a page calls on one.                      |
| `constants.js` | The selector, event names and states of the usual picker.                                        |
| `layout.js`    | Arranges the options and paints the tail and the headers.                                        |
| `lookup.js`    | Looks an item up: the exact one, the picked values and the nearest name to what was typed.       |
| `model.js`     | The model of one picker and what it reads from its box: items, pinned values, bands and folding. |
| `names.js`     | Pure name matching: normalising, similarity and the nearest names.                               |
| `picking.js`   | Picking, unpicking and adding a name.                                                            |
| `state.js`     | The counter the usual picker parts share to give each picker its own ids.                        |
| `sync.js`      | The yes/no check, the panel and the hint kept in step with the model, and the render.            |
| `types.js`     | The types of the usual picker: its items, its model and the handle a page gets.                  |
| `wire.js`      | Prepares a picker and wires its combobox, segmented control, keys and events.                    |

## js/week.js → js/week/

The week agenda: days, pills, the upcoming list and the busy state. 12 files.

| File           | Does                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- |
| `api.js`       | The functions a page calls to set the events, state, start and legend of a week.             |
| `attach.js`    | Attaches the week agendas of a page.                                                         |
| `build.js`     | Builds the week: the frame, the steppers and the day columns.                                |
| `busy.js`      | Holds the rows of a loading week and places its busy card.                                   |
| `constants.js` | The selector, event names and fixed numbers of the week agenda.                              |
| `helpers.js`   | Small helpers: elements, times, keys and day names.                                          |
| `menu.js`      | The overflow menu of a day, tab stops and the focus on a pill.                               |
| `paint.js`     | Paints the events into the week, draws its busy state, lays it out and ticks the clock line. |
| `pills.js`     | Pure pill layout: how many pills a day holds and how an overflow stacks.                     |
| `state.js`     | The per-week memory and the id counter the parts share.                                      |
| `types.js`     | The types of the week agenda: event states and decorate info.                                |
| `upcoming.js`  | The upcoming list under the week: what is next and how it reads.                             |

## js/patterns.js → js/patterns/

Copy buttons, secret blocks and secret inputs. 7 files.

| File              | Does                                                                           |
| ----------------- | ------------------------------------------------------------------------------ |
| `clipboard.js`    | Clears the clipboard later, only when it still holds the secret.               |
| `constants.js`    | The selectors, event names and timings of copy buttons and secrets.            |
| `copy.js`         | Attaches the copy buttons, the secret blocks and the other patterns of a page. |
| `secret-api.js`   | The functions a page calls to reveal, hide and read a secret.                  |
| `secret-input.js` | Wires one secret input: reveal, copy, mask and clear.                          |
| `secrets.js`      | Attaches the secrets of a page.                                                |
| `types.js`        | The types of the copy buttons and the secret fields.                           |

## js/overlays.js → js/overlays/

Dialogs, tabs, toasts, dismissible alerts, tooltips and scroll boxes. 7 files.

| File            | Does                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| `constants.js`  | The event names, selectors and timings of dialogs, tabs, toasts, dismissals, tooltips and scroll boxes. |
| `dialogs.js`    | Dialogs: opening at the top, the close label and the attach.                                            |
| `dismissals.js` | Dismissible alerts: dismissing, remembering and showing again.                                          |
| `scrollbars.js` | Scroll boxes: the overflow marker and the scrollbar watcher.                                            |
| `tabs.js`       | Tabs: selecting, revealing, the overflow and the attach.                                                |
| `toast.js`      | Toasts: the region, the stack and the toast that waits while it is attended.                            |
| `tooltips.js`   | Tooltips: attaches them to the elements that carry one.                                                 |

## js/console.js → js/console/

The interactive console: a command bar, output blocks and a run. 10 files.

| File           | Does                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `api.js`       | The functions a page calls to feed, read and clear a console, and the tool hook.                      |
| `attach.js`    | Attaches the consoles of a page.                                                                      |
| `bar.js`       | The parts of a console, its bar and its status line.                                                  |
| `blocks.js`    | The blocks of output: one block, the body and the whole redraw.                                       |
| `constants.js` | The selector, event names, states and limits of the console.                                          |
| `history.js`   | The command history, kept in storage per console.                                                     |
| `model.js`     | What a console remembers and reads: its state, its attributes, the elapsed time and the announcement. |
| `run.js`       | Running a command: the ticker, following the output, applying a change and submitting.                |
| `state.js`     | The counter the console parts share to give each console its own ids.                                 |
| `types.js`     | The types of the console: changes, jobs, runs, blocks and state.                                      |

## js/palette.js → js/palette/

The command palette and its intent filter. 7 files.

| File               | Does                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `api.js`           | The handle a page gets for a palette and the lookup by dialog.                                 |
| `attach.js`        | Attaches the command palettes of a page.                                                       |
| `constants.js`     | The part names, the opener selector, the event names and the empty-state words of the palette. |
| `intent-filter.js` | The intent filter: the field, the matching and the keyboard of the palette list.               |
| `keys.js`          | Keyboard facts: the platform, the matchers of a hotkey and whether the focus is typing.        |
| `outside.js`       | Closing a dialog on an outside press and finding the control that opened it.                   |
| `types.js`         | The types of the command palette: the matcher and the handle a page gets.                      |

## js/entity-card.js → js/entity-card/

The entity card and its grid. 7 files.

| File           | Does                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `constants.js` | The selectors and event names of the entity card and its grid.                                         |
| `grid.js`      | The grid of cards: its data, its states and the attach.                                                |
| `helpers.js`   | Small helpers: options, star keys, the name, the slots, the kind of a tile, the frame and the columns. |
| `set.js`       | Writes the data into one entity card; fits its flags and actions and redraws it when they change.      |
| `star.js`      | The star: listening for its key, appending it and syncing it.                                          |
| `tile.js`      | Draws one tile: the trend row and the tile itself.                                                     |
| `types.js`     | The types of the entity card: its data and the empty options.                                          |

## js/logviewer.js → js/logviewer/

The live log viewer. 11 files.

| File           | Does                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| `api.js`       | The functions a page calls to append, read, clear, search and set a log viewer.           |
| `attach.js`    | Attaches the log viewers of a page.                                                       |
| `constants.js` | The selector, event names, limit and level words of the log viewer.                       |
| `levels.js`    | Level aliases and the time and level words a line prints.                                 |
| `model.js`     | What a viewer remembers: its state, built parts, attributes and the reads of its options. |
| `parts.js`     | Builds the parts of a viewer and applies its tools.                                       |
| `reads.js`     | Reads a viewer: its tools, signature, limits, floor, query, announcement and text.        |
| `refresh.js`   | Refreshes the visible rows: the filter, the redraw and the trim.                          |
| `rows.js`      | Builds and dresses one log row, and finds the words that match.                           |
| `state.js`     | The counter the log viewer parts share to give each viewer its own ids.                   |
| `types.js`     | The types of the log viewer: lines, the spec and the state.                               |

## js/art.js → js/art/

The drawings of an empty state, one file per theme set. 17 files.

| File           | Does                                                                                |
| -------------- | ----------------------------------------------------------------------------------- |
| `attach.js`    | Gives every element with a kind its drawing and follows a change of the kind.       |
| `console.js`   | Nostromo's console set of drawings.                                                 |
| `constants.js` | The selector, the kinds and the SVG namespace of the drawings.                      |
| `draw.js`      | Draws one kind: an svg with the group of every set.                                 |
| `drawing.js`   | The drawing-board set of drawings.                                                  |
| `fan.js`       | The fan set of drawings.                                                            |
| `field-kit.js` | The field kit set of drawings.                                                      |
| `horizon.js`   | The horizon set of drawings.                                                        |
| `hud.js`       | The HUD set of drawings.                                                            |
| `ledger.js`    | Formal's set, the ledger: every drawing is something a clerk does to a ledger page. |
| `low-sun.js`   | The low sun set of drawings.                                                        |
| `machined.js`  | Titanium's machined set of drawings.                                                |
| `sets.js`      | Every set the package has, by the name a register shows.                            |
| `slab.js`      | The slab set of drawings.                                                           |
| `spectrum.js`  | Spectrum's set of drawings.                                                         |
| `stickers.js`  | The stickers set of drawings.                                                       |
| `types.js`     | The types of the empty-state drawings: kinds, inks and strokes.                     |

## js/menu-button.js → js/menu-button/

The menu button with its rich menu. 10 files.

| File           | Does                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| `attach.js`    | Attaches the menu buttons of a page.                                                       |
| `constants.js` | The selector, event names, the line-count property and the gutter of the menu button.      |
| `count.js`     | Counting the lines of a menu: the line count property and the count of a menu.             |
| `items.js`     | Builds the items of a menu: roles, labels, entries, the drawn list and the empty line.     |
| `keys.js`      | The key a menu item answers to.                                                            |
| `model.js`     | What a menu remembers and reads: its state, ids, keys and signature.                       |
| `open.js`      | Opening, closing, setting and wiring a menu, and dressing its button.                      |
| `placement.js` | Where a menu goes: the edges it must clear, the clip, the raise and lower and the placing. |
| `state.js`     | The counter the menu button parts share to give each menu its own id.                      |
| `types.js`     | The types of the menu button: items, groups, options, state and placement.                 |

## js/diff.js → js/diff/

The diff view with file headers, folded context and changed words. 12 files.

| File           | Does                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| `actions.js`   | The functions a page calls on a diff: set it, toggle a file and copy a path.                                  |
| `attach.js`    | Attaches the diffs of a page.                                                                                 |
| `constants.js` | The selector, event names and limits of the diff view.                                                        |
| `file.js`      | Draws one file of the diff: its path, its change bar and its header.                                          |
| `fold.js`      | Folding the unchanged context of a hunk.                                                                      |
| `lines.js`     | Draws the lines and rows of a hunk and fills the body of a file.                                              |
| `model.js`     | What a diff remembers and reads: its state, attributes and count.                                             |
| `read.js`      | Reads a diff: the kind and head of a file, normalising it, whether it is open, the announcement and the text. |
| `render.js`    | Renders the whole diff: the column sizes, the skeleton and the files.                                         |
| `state.js`     | The counter the diff parts share to give each diff its own ids.                                               |
| `types.js`     | The types of the diff view: lines, hunks, files, the spec and the state.                                      |
| `words.js`     | Pure word diffing: tokens, segments and the pairs of words that changed.                                      |

## js/claim.js → js/claim/

Who brings what on a checklist. 10 files.

| File           | Does                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `api.js`       | The functions a page calls to set the viewer, the people, the filter and a claim.              |
| `attach.js`    | Attaches the claim lists of a page.                                                            |
| `bulk.js`      | Claiming everything at once and the gaps that copy.                                            |
| `constants.js` | The selector, event names, filters and timings of claims.                                      |
| `decorate.js`  | Decorates a claim list: every row, its filter and its summary; setting the filter redecorates. |
| `model.js`     | What a claim list remembers and reads: its state, people, attributes and the item of a row.    |
| `request.js`   | Sends a claim to the page, refuses it, announces it and offers the undo.                       |
| `rows.js`      | Builds one claim row: its words, its cell, its button and its content.                         |
| `state.js`     | The counter the claim parts share to give each list its own ids.                               |
| `types.js`     | The types of the claim list: people, info, detail and state.                                   |

## js/uptime.js → js/uptime/

The uptime strip. 9 files.

| File           | Does                                                                                 |
| -------------- | ------------------------------------------------------------------------------------ |
| `attach.js`    | Attaches the uptime strips of a page.                                                |
| `constants.js` | The selector, event names, states and counts of the uptime strip.                    |
| `draw.js`      | Draws the strip from its spec.                                                       |
| `figures.js`   | Pure figures: the uptime share, its percent and how many periods fit.                |
| `fit.js`       | Fits the strip to its width and measures its edges.                                  |
| `group.js`     | Strips that group: their host, joining and leaving the group card and the info mode. |
| `helpers.js`   | Small helpers: tone and word of a period, the count and element makers.              |
| `state.js`     | The per-strip memory the parts share: specs, cards, groups and info.                 |
| `types.js`     | The types of the uptime strip: periods, the spec and the figures.                    |

## js/timer.js → js/timer/

Kitchen timers: named countdowns that keep running. 9 files.

| File           | Does                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `attach.js`    | Attaches the timer lists of a page.                                                            |
| `card.js`      | Builds and paints one timer card.                                                              |
| `constants.js` | The selector and the event names of the timers.                                                |
| `model.js`     | What a timer list reads: the clock face, the time left, its state and its parts.               |
| `run.js`       | Running a timer: finishing, starting, pausing, resuming, adding time, stopping and restoring.  |
| `sound.js`     | The sounds a finished timer makes and the ring that stops them.                                |
| `state.js`     | What the timer parts share: the lists, tickers, the audio context and the id counter.          |
| `sync.js`      | Syncs the list with its timers: the busy state, the cards, the tick and the finish of a timer. |
| `types.js`     | The types of the timers: their state and the timer itself.                                     |

## js/combobox.js → js/combobox/

The combobox and the drawn select. 8 files.

| File           | Does                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| `attach.js`    | Attaches the comboboxes of a page.                                           |
| `constants.js` | The part names, event names and empty-state words of the combobox.           |
| `handle.js`    | The handles of the comboboxes and the lookup a page uses.                    |
| `helpers.js`   | Small helpers: the label of an option and the status slot of a box.          |
| `matchers.js`  | The matchers a combobox filters its options with.                            |
| `select.js`    | The drawn select: its test, its handles and its attach.                      |
| `state.js`     | The counter the drawn selects share to give each select its own id.          |
| `types.js`     | The types of the combobox and the drawn select: matchers, handles and hooks. |

## js/notices.js → js/notices/

The notification centre, as a NoticesCentre controller. 6 files.

| File             | Does                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `controller.js`  | NoticesCentre: wires one centre and handles its clicks, source switches, toggle, keys. |
| `events.js`      | The selector, the event names, the severities and the fixed numbers.                    |
| `model.js`       | Reading a time, ordering the notices and taking the panel's newest per severity.         |
| `parts.js`       | Builds the centre's elements and mounts them for its look.                               |
| `row.js`         | One notice row and one source switch.                                                    |
| `view.js`        | NoticesView: the model read through the host's options and the render of every part.     |

## js/row-select.js → js/row-select/

The row keys (j/k, x, Shift+x, Esc, Enter, Ctrl+A, Shift-click, long press), as a RowSelector controller. 3 files.

| File            | Does                                                                                    |
| --------------- | --------------------------------------------------------------------------------------- |
| `controller.js` | RowSelector: the keys, the mouse and touch ticks, the focus, the hint and the wiring.   |
| `core.js`       | RowSelectCore: the options, the voice, the rows and the cursor, and setting boxes.      |
| `rows.js`       | The selector, events and numbers, and the helpers that find rows, boxes, keys, labels.  |

## js/sentence.js → js/sentence/

The sentence form, as a Sentence controller. 2 files.

| File            | Does                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------- |
| `controller.js` | Sentence: the lines, control names, phrases, computed fields, placing, summary and Enter.     |
| `fields.js`     | The words: names, computed fields, summary, invalid marks, the line, loading, control values. |

## js/checklist.js → js/checklist/

The checklist whose ticked items sink, as a Checklist controller over a per-list model. 6 files.

| File            | Does                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------- |
| `api.js`        | Give a list items, tick one, set its state, fire its events and end the Undo.             |
| `controller.js` | Checklist: the ticks, Check all, Uncheck all, Clear checked and Undo.                     |
| `parts.js`      | The bar, the body, the voice and the empty line, made on first use, and the voice.        |
| `render.js`     | Draws the list in place (groups, rows, bar, empty plate) and glides the rows that moved.  |
| `rows.js`       | Grouping the items, a group's shown order, and one row built or updated in place.         |
| `state.js`      | The selector, the events, the per-list registry (items, Undo, plate, busy card), the ids. |

## js/qr.js → js/qr/

The QR code, as a QrControl controller over a per-code state. 6 files.

| File            | Does                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| `actions.js`    | Give a code its link or state, read its SVG, copy the link, download the picture.        |
| `controller.js` | QrControl: the buttons, Shift+C and a draw again when a live option changes.             |
| `draw.js`       | The ink and ground, and the code as an SVG or a canvas.                                  |
| `matrix.js`     | The matrix for a text, the WCAG contrast of two colours and the path of the dark modules. |
| `render.js`     | The plate, the stand-ins, the caption, the actions, the density warning and the expiry.  |
| `state.js`      | The selector, events and numbers, the per-code state registry and the shared helpers.    |

## js/structure.js → js/structure/

The tree, the reorder list and the split pane, one controller each. 4 files.

| File         | Does                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| `reorder.js` | ReorderControl: the grab handle, keys and pointer, the move said in words.              |
| `shared.js`  | The selectors, the events, the defaults and the walk of a tree's visible items.         |
| `split.js`   | SplitControl: the separator by keys and pointer, vertical too, the fold on double click. |
| `tree.js`    | TreeControl: walking, opening, typeahead, one tab stop, selection, remembered branches. |

## js/datepicker.js → js/datepicker/

The date picker: a typed field with a calendar panel of days, months and years, and the handle to set and read the date. 10 files.

| File            | Does                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `attach.js`     | Attaches the date pickers of a page and hands back their handles.                                                              |
| `constants.js`  | The names, event names and fixed numbers of the date picker, and the types of its views and handle.                            |
| `controller.js` | One date picker: the field, the open button and the panel; typing, choosing, setting, and the handle a page gets back.         |
| `dates.js`      | Pure date helpers: ISO and locale text, month clamping, year blocks, range tests and the month and year grid's key moves.      |
| `grid.js`       | Draws the panel: the head with its steps and title, and the day, month or year grid under it.                                  |
| `keys.js`       | The panel's keyboard and pointer: Escape steps back, arrows move the focus, Enter chooses, a click picks a day, month or year. |
| `opening.js`    | Opens and closes the panel: the top layer, the arrival and the close played backwards, and where the focus goes afterwards.    |
| `place.js`      | Places an open calendar panel inside the window, raises it above its containers and measures the day view to hold.             |
| `settings.js`   | What one picker is set to: the page's options and the picker's own attributes, resolved once when it attaches.                 |
| `views.js`      | Which grid the panel shows (days, months or years): redraws, the steps in and out of the month and year grids, and the focus.  |

## js/segmented.js → js/segmented/

The segmented control and the filter chips: single, multi and three-way groups, with the plate under the chosen segment. 14 files.

| File           | Does                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `actions.js`   | Pressing an item: what a click or the keyboard's choice does, and the event it fires.                                          |
| `api.js`       | The calls a page makes on a group: set its values, its three-way chips and its counts, or reset it; none fires a press.        |
| `constants.js` | The selectors, attribute names, event name and fixed numbers of the segmented control, and the types of its items.             |
| `group.js`     | One segmented group: the roles and states its markup left out, its size and scroll watching, and its mode watching.            |
| `items.js`     | Replaces the items of a group when the values change under it, keeping what is on and where the focus was.                     |
| `keys.js`      | The keyboard of a group: where an arrow, Home or End moves the focus, and the delete of a three-way chip.                      |
| `mode.js`      | A group whose `data-kp-segmented` changes at runtime [live-options-1019]: rewrites its roles and states for the new mode.      |
| `paint.js`     | Writes the state of every item from a list of values, then the roving tab stop, then the plate; fires no event.                |
| `plate.js`     | The plate under the chosen segment, and the marks for a scrolling track that has more segments out of sight.                   |
| `read.js`      | Reads a group's markup: its mode, its items, their values and states, and the values that are on.                              |
| `root.js`      | Attaches the segmented groups under a root: delegated click, key and focus handling, and groups that arrive later.             |
| `roving.js`    | The roving tab stop: one item of the group is in the tab order, the others are reached by the arrows.                          |
| `state.js`     | What outlives one group controller: the roving tab stop of each group, and the events already handled.                         |
| `tri.js`       | The three-way look [kpadopt4]: a chip's state and its spoken word, the Clear all item, the summary line and the status region. |

## js/code.js → js/code/

The code block: JSON, TOML and shell text in a scrolling box, with Pretty and Raw, Wrap, Copy, a fold and its states. 12 files.

| File            | Does                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `actions.js`    | What the head's tools do: a layout choice, Wrap, the fold (in place or in a dialog) and Copy.                                 |
| `attach.js`     | Draws code blocks: `setCode` for a page that draws later, `attachCodes` for the blocks js/auto.js finds in markup.            |
| `body.js`       | The body of a block: the coloured lines with their fold and foot, or the plate or sentence of an empty, binary or failed one. |
| `constants.js`  | The selector, timings and fixed numbers of the code block, and the type of what a page draws into it.                         |
| `controller.js` | One code block: the state the reader changes (wrap, layout, fold), the draw flow, and the listeners of its tools.             |
| `dialog.js`     | Opens the whole payload of a folded cell in a modal dialog, as a full block of its own.                                       |
| `dom.js`        | Small element builders shared by the code block's parts.                                                                      |
| `head.js`       | The head of a block: its title and meta, and the tools that keep their place in every state (Pretty and Raw, Wrap, Copy).     |
| `highlight.js`  | Colours one line of text as nodes: JSON keys and punctuation, TOML tables and values, shell commands, flags and variables.    |
| `language.js`   | The language of a block: JSON that parses, the languages that get colour, and `auto` resolved from the text.                  |
| `loading.js`    | The loading state: the block waits at its final height under the data table's busy card.                                      |
| `state.js`      | The counter that gives each code body an id of its own, for the fold button's `aria-controls`.                                |

## js/timefield.js → js/timefield/

The time field: a 24-hour text box, a list of times, keys that step, presets and the hidden value it posts. 10 files.

| File            | Does                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`        | The calls a page makes on a time field: set, read, check, give presets, and attach.                                               |
| `attributes.js` | Reads a root's `data-kp-time-*` options, and the entries and presets they describe.                                               |
| `build.js`      | Builds the parts of a time field once: the text box, the open button, the hidden input, the lines and the list.                   |
| `constants.js`  | The selector, event names and fixed numbers of the time field, and the types of its presets.                                      |
| `controller.js` | Wires one time field: its typing, keys, paste, clicks, focus, outside presses and the attributes it follows.                      |
| `field.js`      | A time field's value and its words: writing the value, the invalid line, committing typed text, and the sync with its attributes. |
| `keys.js`       | The keyboard of the text box: Enter and Escape, Alt+Down to open, arrows through the list, and stepping the time.                 |
| `list.js`       | The list of times: the presets above it, the options, the active option, and opening it on the overlay layer.                     |
| `parse.js`      | Pure time-of-day helpers: reading what was typed, minutes and text, stepping past midnight, and the window test.                  |
| `state.js`      | What the time fields share: the counter that gives each its own ids, and the field each root has been built into.                 |

## js/gallery.js → js/gallery/

The photo gallery: a grid of tiles that open large in the viewer, with previous and next, zoom, swipe and an address per picture. 8 files.

| File                | Does                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `attach.js`         | The calls a page makes on a gallery: write it, read its pictures, open one, and attach it.                                          |
| `constants.js`      | The selector, event names, states and fixed numbers of the gallery, and the types of its pictures, actions and spec.                |
| `dom.js`            | Small helpers of the gallery's parts: an element with a class, an attribute with a default, and a picture address that asks again.  |
| `gallery.js`        | One gallery: its pictures and spec, how it draws itself in each state, the busy card, and what it remembers.                        |
| `lightbox-info.js`  | What the lightbox shows beside the picture: its caption and facts, and the buttons in the foot.                                     |
| `lightbox-input.js` | How a person moves the lightbox: the controls that fade, the swipe on a phone, and the address that carries the open picture.       |
| `lightbox.js`       | The lightbox of one opened picture: the viewer shell, previous and next, zoom, the picture's load, and closing.                     |
| `render.js`         | Builds the gallery's tiles and plates: the grid and its cells, the add tile, the failed-picture tile and the empty or failed plate. |

## js/calendar.js → js/calendar/

The month heatmap: a six-week grid of tone plates with navigation, picking, a state plate, a legend and a calm look. 12 files.

| File            | Does                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`        | The calls a page makes on a calendar: give it days, a state, a selection, a month, a legend and a caption, and attach it.         |
| `build.js`      | Builds the calendar's elements once: the navigation, the state line, the six-week grid of buttons, the busy layer and the legend. |
| `busy.js`       | The busy layers a theme holds on screen while their state goes: marks them as leaving and tidies their words when they are gone.  |
| `constants.js`  | The selector, event names and fixed numbers of the calendar, and the types of its days, states and options.                       |
| `controller.js` | One month heatmap: its month, its days and state, the picking and the keys, and the calls a page makes on it.                     |
| `dates.js`      | Pure calendar arithmetic on `YYYY-MM-DD` keys: the day a moment falls on, shifting days and months, and a month's 42 cells.       |
| `day.js`        | Which tone and words a day gets: the standard vocabulary, or the calm one (logged, quiet, paused).                                |
| `dom.js`        | Small helpers of the calendar's parts: an element with a class and text, and the host's `data-kp-key`.                            |
| `keys.js`       | The keys of the day grid: which day an arrow, Home, End, Page Up or Page Down goes to.                                            |
| `paint.js`      | Repaints the grid in place: the month's title, each day's tone and words, the tab stop, and the busy layers that leave.           |
| `plate.js`      | The plate over a calendar's grid: an empty month's centred plate, and a failed month's with Retry.                                |
| `state.js`      | The counter that gives each calendar's title an id of its own.                                                                    |

## js/rating.js → js/rating/

The star rating: a radio row of stars to set or a display row to read, with half stars, Undo and a saving state. 10 files.

| File            | Does                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`        | The calls a page makes on a rating: attach, read its handle, set it, set its state, and draw one in a table cell.                               |
| `build.js`      | Builds one rating's elements: the row of stars, the caption, the Clear, Save and Cancel buttons, and the lines for reason, flash and failure.   |
| `commit.js`     | A person changes the rating: choosing a value (held for Save or at once), the event that can be refused, the save that is waited for, and Undo. |
| `constants.js`  | The selector, event names, states and fixed numbers of the rating, and the types of its options, sources and handle.                            |
| `controller.js` | One rating: its model (value, draft, preview, busy), the stars it draws, and its pointer, key, button and attribute handling.                   |
| `keys.js`       | The keyboard of the row: arrows and Home and End move and choose, Backspace and Delete clear, Space and Enter choose the focused star.          |
| `math.js`       | Pure rating arithmetic: clamping, snapping a value to the step and the scale, and plain numbers for sentences.                                  |
| `paint.js`      | Brings the stars, the names, the caption and the buttons in step with the rating's model.                                                       |
| `read.js`       | What a rating's attributes say now: its options, its state, and whether it can be changed.                                                      |
| `state.js`      | The counter that gives each rating's caption and reason an id of its own.                                                                       |

## js/unsaved.js → js/unsaved/

The unsaved-changes bar: it counts the marked rows, offers Save, Discard and Undo, lists the changes and warns before the page is left. 12 files.

| File            | Does                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `actions.js`    | What the bar's buttons do: jump to a change, revert one, discard with Undo, save, and take the page's answer to Save.        |
| `changes.js`    | Tracks what is changed: the baseline of every control, the rows marked `data-kp-changed`, and the list of changes.           |
| `config.js`     | The unsaved bar's names, fixed numbers, page-wide storage choice and the settings one bar reads from its markup.             |
| `controller.js` | One unsaved-changes bar: builds it, paints the count, runs Save, Discard, Undo and Revert, and hands the page its handle.    |
| `dock.js`       | Where the bar stands: in the header, or docked to the screen once the header is out of view; and when it goes compact.       |
| `keeper.js`     | Keeps the changes across a reload: writes them to a Storage as they change and puts them back when the bar attaches.         |
| `leave.js`      | Warns before the page is left with unsaved changes: the browser's own prompt, and a confirmation on in-page links.           |
| `paint.js`      | Paints one unsaved bar from its changes: the state, the words, the buttons and the More menu, the list, and the count event. |
| `panel.js`      | The list of changes: opens under the count chip on the overlay layer, closes with motion, and places itself.                 |
| `parts.js`      | Builds the bar's elements, the list entries and the refusal alert; no behaviour, only structure and classes.                 |
| `state.js`      | The counter that gives each bar without an id its own.                                                                       |
| `values.js`     | What a form control holds: reading the live value, the markup's value, and putting a value back.                             |

## js/anchors.js → js/anchors/

The link anchors on headings and rows, as an AnchorBox controller. 4 files.

| File            | Does                                                                                   |
| --------------- | -------------------------------------------------------------------------------------- |
| `controller.js` | AnchorBox: copying a link (press, Shift, `y l`) and landing on one (open, scroll, mark). |
| `copy-key.js`   | The page's one `y l` shortcut, shared by every container, and when a container changed. |
| `marks.js`      | AnchorMarks: the options, the voice, which headings and rows get a mark, and the mark.  |
| `text.js`       | Selectors, events and times, slugs, unique ids, an element's name, copying text.        |

## js/remember.js → js/remember/

Remembered state (open groups, branches, widths, sorts) and the disclosures that remember. 3 files.

| File            | Does                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------- |
| `disclosure.js` | RememberedDisclosure per `<details data-kp-remember>`, and RememberWatch for later ones.    |
| `painters.js`   | The ids the painters read, one painter per component, and painting a page before it draws.  |
| `store.js`      | The defaults, the storage, an element's name and its claims, a memory, and pruning.         |

## js/slider.js → js/slider/

The slider and the range slider, as a SliderControl controller. 4 files.

| File            | Does                                                                                   |
| --------------- | -------------------------------------------------------------------------------------- |
| `build.js`      | The track, its inputs, bubbles and marks, the value boxes, the line and the skeleton.  |
| `controller.js` | SliderControl: builds and takes down the markup; drag, keys, reset and typed boxes.    |
| `core.js`       | SliderCore: the state, the paint, the allowed value, the events, state and values.     |
| `values.js`     | Selector, events, the pure number helpers, the options read once, the value's words.  |

## js/tiles.js → js/tiles/

Tile sets that share one row height, and tile boards moved with the keys. 3 files.

| File          | Does                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------- |
| `geometry.js` | Selectors and events, a tile's visibility, stop and name, the letter search, the arrows.  |
| `keys.js`     | TileBoard: one tab stop per board, arrows, Home/End, Page Up/Down, letters, leaving.      |
| `sets.js`     | tileSets, evenTileSet and TileSetWatch, which keeps every set even and eases its tiles.   |

## js/wheel.js → js/wheel/

The decision wheel, as a WheelControl controller over a per-wheel state. 4 files.

| File            | Does                                                                                 |
| --------------- | ------------------------------------------------------------------------------------ |
| `controller.js` | WheelControl: lays and draws the wheel, the Spin button, kiosk keys, live redraws.   |
| `draw.js`       | The parts laid once, the disc with fitted labels, and the answer, button and stage. |
| `spin.js`       | The weights' glide, the items, the state, the result and the spin.                   |
| `state.js`      | Selector, events, the per-wheel state, geometry, the weighted pick, the angles.     |

## js/toggle.js → js/toggle/

The toggle button and its groups, as a ToggleControl controller. 4 files.

| File            | Does                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------- |
| `controller.js` | ToggleControl: the wiring, the press, the remembered value, the arrows, the shortcut.        |
| `group.js`      | Selector, events, looks and modes, a group and its keys, what a press would make of it.      |
| `handle.js`     | ToggleAnswers: the handle (set, count, hint, done, refuse), the async answer, the memory.    |
| `parts.js`      | ToggleParts: stamps, label, tick, count, hint, refusal, spinner, the live line and Clear.    |

## js/snooze.js → js/snooze/

The snooze picker, as a SnoozePicker controller. 4 files.

| File            | Does                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| `build.js`      | The bar (chips or a menu button, End snooze), the status line and the date/time panel.  |
| `choices.js`    | Selector, events, the picker's words, the moments its choices stand for, what it offers. |
| `controller.js` | SnoozePicker: wiring, status, choices, a pick from chips, menu or panel, End, handle.    |
| `panel.js`      | SnoozePanel: the state, and the panel opened, placed, closed and checked.               |

## js/selection-bar.js → js/selection-bar/

The selection bar over a list's ticked rows, as a SelectionBar controller. 4 files.

| File            | Does                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------ |
| `api.js`        | Feed the bar by hand, read it, busy and progress, the result and the rules.               |
| `controller.js` | SelectionBar: the memory, the sources and their redraws, the options, buttons and Esc.     |
| `draw.js`       | Parts, the count, names, offer and actions drawn from the memory; saying, unticking, sync. |
| `model.js`      | Selector, events, numbers, the memory's shape, and reading the rows a bar serves.          |

## js/request-inspector.js → js/request-inspector/

The request inspector, as a RequestInspector controller. 6 files.

| File            | Does                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------- |
| `api.js`        | setRequests and setRequestsState, through the controller's memory.                        |
| `controller.js` | RequestInspector: the memory, the card and its states, clicks, filter, Retry, options.    |
| `copy.js`       | Copying a request as curl, JSON or its body, secrets masked unless asked, and saying so. |
| `format.js`     | Selector, events, numbers, tone and class, curl and JSON, options, keys, wrapped paths.   |
| `list.js`       | The card's bar, stage and list, and the list drawn: counts, requests, no match, older.    |
| `request.js`    | One request as a fold: the summary, and the headers, body and copy buttons built on open. |

## js/statusrow.js → js/statusrow/

The status list and the calm today list, as a StatusList controller. 5 files.

| File            | Does                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| `controller.js` | StatusList: rows synced, presses, later state changes, calm keys and live options.       |
| `list.js`       | A calm row turned with Undo, the today order and fold, setStatus, counts, card, building. |
| `state.js`      | Selector, events, states, the per-row memory, and the shared helpers.                    |
| `sync.js`       | One row kept in step with its state: words, Retry or calm actions, "since", the voice.   |
| `voice.js`      | The list's polite region and what a row's change says.                                   |

## js/passkeys.js → js/passkeys/

The passkey list: the ways to sign in with their rows, renaming, removal and the empty, failed and loading states. 9 files.

| File            | Does                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`        | The calls a page makes on a passkey list: draw it with setPasskeys(), or let attachPasskeys() draw the ones that carry JSON.        |
| `constants.js`  | The selector, event names, kinds, glyphs, fixed numbers and the types of the passkey list.                                          |
| `controller.js` | One passkey list: its rows, what is busy, being renamed or refused, and the removal and rename flows [kpadopt5-people].             |
| `dom.js`        | Small DOM builders shared by the parts of the list: an element with a class, the way-in glyph and the row finders.                  |
| `notes.js`      | Builds the parts of the list that are not rows: the empty or failed note, the waiting rows, the insecure warning and the live line. |
| `options.js`    | Pure helpers: the options of a list, the order of its rows and the days a way has gone unused.                                      |
| `paint.js`      | Draws the list: the waiting rows under the busy card, the empty or failed note, or the sorted rows, keeping focus where it was.     |
| `row.js`        | Builds one row of the list: the way's glyph, its name or rename field, its facts, its flags, its hint and its two buttons.          |
| `state.js`      | The counter that gives each drawn row an id of its own, for its label, hint and rename field.                                       |

## js/feed.js → js/feed/

The activity feed: who did what, day by day, with a row per event, states, Load earlier and a freshness line. 11 files.

| File            | Does                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api.js`        | The calls a page makes on a feed: attach the feeds, get a feed's handle and give a feed its model.                                                           |
| `constants.js`  | The selector, event names, states, option attributes, fixed numbers and the types of the activity feed.                                                      |
| `controller.js` | One activity feed: its model, the rows that are open, the clicks and arrow keys, the option watcher, the clock tick and its handle [gap-activity-feed-1019]. |
| `days.js`       | Groups the rows by Brussels day and builds the day groups: a heading with its count and failures, and the day's rows.                                        |
| `dom.js`        | The element builder every part of the feed uses: a tag, a class and, when given, its text.                                                                   |
| `frame.js`      | Builds the fixed frame of a feed (head, body, foot, live line) and the skeleton rows a loading feed shows.                                                   |
| `options.js`    | What a feed's option attributes say now, read each time so they switch at runtime, and the Brussels day key.                                                 |
| `render.js`     | Paints a feed from its model: the host's marks, the head, the day list, the plates, the loading card, the foot, and the focus kept by key.                   |
| `row.js`        | Builds one feed row: the state mark, the title (a plain line, a link or a disclosure button), its detail, its opening lines, who and when.                   |
| `state.js`      | The counter that gives each feed, and each row that opens, an id of its own.                                                                                 |
| `words.js`      | The words of a feed: a counted unit, a row's state word and the word for a day.                                                                              |

## js/autosize.js → js/autosize/

The growing text box: it grows with its text, counts, keeps a draft, submits with Mod+Enter and has a loading and an error state. 8 files.

| File            | Does                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`        | The calls a page makes on a growing box: attach, get its handle, measure again, set its state.                                   |
| `constants.js`  | The selector, event, states, fixed numbers and types of the growing text box.                                                    |
| `controller.js` | One growing text box: its measure (CSS or JS engine), counter, draft, value hook, Mod+Enter, states and handle [kpadopt6-media]. |
| `counter.js`    | The character and line counter under a box, and the polite line that announces 90 % and 100 % of `maxlength`.                    |
| `draft.js`      | A draft kept on this device until the form is sent: the storage key, keeping, bringing back and forgetting it.                   |
| `fit.js`        | Measures how tall a box needs to be: line height and chrome of a computed style, and the exact fit on a hidden twin.             |
| `state.js`      | The counter that gives each box's error line an id of its own.                                                                   |
| `status.js`     | The states of a box: `loading` lays the busy card over it inside a frame, `error` writes the sentence in the field's error line. |

## js/countdown.js → js/countdown/

The countdown: a named timer in digits with Start, Pause, Reset, a minute more, an until moment and the clock the visual timer runs on. 9 files.

| File            | Does                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`        | The calls a page makes on a countdown: attach the timers and get a timer's clock to drive it.                                                     |
| `clock.js`      | The countdown clock: the time left is the end moment minus now, so nothing drifts, and a timer watches the end for a hidden tab.                  |
| `constants.js`  | The selector, events, defaults, unit lengths, option attributes and types of the countdown.                                                       |
| `controller.js` | One countdown: its options, its clock, its digits and controls, the visibility catch-up and the live option watcher [kpadopt4-ideas].             |
| `digits.js`     | The digit cells: one cell per character, rebuilt only when the format changes, else only the digits that changed are written.                     |
| `duration.js`   | Pure time text: a length read from "25m" or "1:30:00", and the digits of a time left.                                                             |
| `parts.js`      | Builds a countdown's fixed elements (name, digits, status line, live line) and its buttons, whose words keep one width.                           |
| `until.js`      | The `until` option: the moment it names, and the words that label it.                                                                             |
| `zones.js`      | Time zones for the `until` option: the readers of an IANA zone, wall-clock parts, a wall-clock time as a moment, and the offset a string carries. |

## js/forms.js → js/forms/

Forms without a framework: field messages, the summary, the valid and invalid events, the submit button's busy state, switch words and the form grids. 10 files.

| File                  | Does                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`              | The calls a page makes on forms: attach the forms, get a form's handle, and attach the form grids.                                          |
| `constants.js`        | The selectors, event names, form grid blocks and types of the forms module [TH38].                                                          |
| `errors.js`           | Showing and clearing a field's message, and naming a field: showError, clearError and nameOf.                                               |
| `form.js`             | One attached form: validation on blur or input, the summary, the valid and invalid events, and the handle [TH38, KT6, wish-1028].           |
| `formgrid-columns.js` | Groups side by side: `data-kp-formgrid-wide` on a grid whose groups all fit beside each other [formgrid-columns-1019].                      |
| `formgrid-stage.js`   | Form grids that share rows: the stage writes `--kp-formgrid-rows`, the row count of its longest card [gapform-1019; HTTPSwitchboard 31].    |
| `state.js`            | The counter that gives error holders without an id one of their own: no Math.random, so server and client agree.                            |
| `submit.js`           | A submit button that says it is working: busy on `kp-form-valid`, back on `kp-form-done`, flash buttons keep their own faces [KT6, kyu 45]. |
| `summary.js`          | The error summary of a form: one line per field (one per radio group), each a link that focuses its field.                                  |
| `switches.js`         | The two words of a switch: the On and Off beside the track come from the dictionary, not from the server [gap-11, KT5].                     |

## js/auto-refresh.js → js/auto-refresh/

The automatic refresh chooser: an interval picker with a freshness line, back-off retries, Refresh now and the R key. 8 files.

| File            | Does                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api.js`        | The calls a page makes on a refresh control: attach, get its handle, answer a refresh, set the interval and the title.                                       |
| `bar.js`        | Builds the fixed parts of a refresh control: the chooser holder, the custom seconds form, the freshness line, the buttons, the run bar and the failure note. |
| `chooser.js`    | The chooser: segments or a menu, whichever `data-kp-look` names, built, wired, redrawn and filled with the choices.                                          |
| `constants.js`  | The selector, events, defaults, option attributes, fixed numbers and types of the automatic refresh chooser.                                                 |
| `controller.js` | One automatic refresh control: the interval, the schedule with its back-off, what makes a refresh wait, and the events [kpadopt5-ops].                       |
| `labels.js`     | The bar's title and label cells: drawn while `data-kp-refresh-title` and `data-kp-refresh-label` have words [wish-1028, formgrid-notes-1019].                |
| `region.js`     | What stops a refresh for now, and the `region` mode: fetch the same URL and swap one element's children.                                                     |
| `words.js`      | The words and numbers of the chooser: the seconds offered, and "Every 30 s", "Every 2 min", "Paused".                                                        |

## js/json-field.js → js/json-field/

The JSON text box: it checks what is typed, marks the line, formats and minifies, and holds the form back while the JSON is broken. 10 files.

| File            | Does                                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`        | The calls a page makes on a JSON field: attach and get a field's handle.                                                                              |
| `constants.js`  | The selector, events, fixed numbers and types of the JSON text box.                                                                                   |
| `controller.js` | One JSON text box: its frame and tools, the check (debounced while typing), the gutter, the growing height, the keys and the live options [kpadopt5]. |
| `explain.js`    | What is wrong with a text as JSON, and where: the engines word it differently.                                                                        |
| `frame.js`      | Builds a JSON field's frame: the tools, the gutter, the status and help lines, the wrap mirror, and the four tool buttons.                            |
| `keys.js`       | The keyboard of the field: Esc then Tab leaves it, Tab indents, Shift+Tab takes an indent off, Mod+Shift+F formats.                                   |
| `layout.js`     | The field's measure: line heights (wrapped lines measured in the mirror), the gutter's numbers and the height the box grows to [kpadopt5-r3].         |
| `state.js`      | The counter that gives each field without an id its own.                                                                                              |
| `tools.js`      | The tool buttons: Format, Minify, Wrap and Copy, and the lock that stills them while the field is disabled or read-only.                              |
| `validation.js` | Checking the text: set the field's state (message, validity, event) and run the check with the page's `kp-json-validate` say.                         |

## js/master-detail.js → js/master-detail/

The master-detail layout: a list and its detail side by side, folding to one pane on a phone, with states, history and a listbox keyboard. 6 files.

| File              | Does                                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`          | The calls a page makes on a master-detail layout: attach, get its handle, set its state, select, open and close.                                                      |
| `constants.js`    | The selector, events, default widths, fold points and types of the master-detail layout.                                                                              |
| `controller.js`   | One master-detail layout: the list as a listbox, the selection, opening and closing the folded detail, history, keys and states [kpadopt5-ops].                       |
| `detail-state.js` | The detail pane's state: empty, loading, error or ready; its plates, its busy card and the watch that lets a component's own failed plate win [kyugaps-1019, KYU 54]. |
| `folding.js`      | Folding: the layout's own width decides when the panes fold to one and the aside moves under them, and which pane a phone shows.                                      |
| `parts.js`        | The layout's panes and the detail's fixed parts: finding a pane, the column list, and the head, Back button, body and state box.                                      |

## js/dated-options.js → js/dated-options/

The dated option picker: a choice where every option has a date and an age, as radio rows or a searchable combobox, with states. 10 files.

| File               | Does                                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`           | The calls a page makes on a dated option picker: attach, get its handle, give it options and a state, read its value.                         |
| `combobox-draw.js` | Draws the options as a searchable combobox: the input, the list of two-line options, the live status and the hidden value.                    |
| `constants.js`     | The selector, events, states, fixed numbers and types of the dated option picker.                                                             |
| `controller.js`    | One dated option picker: its options, its choice, its states, radio rows or a combobox, the type-ahead and the page's handle [kpadopt5-time]. |
| `note.js`          | The note a state stands in for the options with: the empty plate with its reason and action, or the failure alert with Try again.             |
| `radios.js`        | Draws the options as radio rows: one group, two lines per option and the meta values in one column.                                           |
| `rows.js`          | What each option says: its name, its age line, the newest, and the meta column and name line that both drawings share.                        |
| `settings.js`      | What a picker's markup says: its name, kind, order, zone, clock, label and the rows it keeps, read once at attach.                            |
| `state.js`         | The counter that gives each picker without an id its own.                                                                                     |
| `time.js`          | Pure helpers: how long ago a moment was, and the order a picker shows its options in.                                                         |

## js/quote.js → js/quote/

The quote card: your own earlier words with who wrote them and when, a Hide with Undo, folding and states, and a list that shows the first few. 8 files.

| File            | Does                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `actions.js`    | What a press does on a card: say something politely, hide it with an Undo window, copy its words.                   |
| `api.js`        | The calls a page makes on a quote card: attach, write its words, set its state, and get its handle.                 |
| `constants.js`  | The selectors, events, states, fixed numbers, watched attributes and types of the quote card.                       |
| `controller.js` | One quote card: its words, the fold and hide state, its four states, the keys and the attribute watcher [kpadopt6]. |
| `dom.js`        | Small helpers every part of the quote shares: an element builder and a card's `data-kp-quote-*` attribute.          |
| `list.js`       | A list of quote cards: the first few shown and a button for the rest ("Show all 7", the exact number).              |
| `render.js`     | Draws a quote card's parts from its attributes and text, and measures whether a folded quote has more to show.      |
| `when.js`       | Pure date words of a quote: the whole days between two moments by the Brussels calendar, and the date line.         |

## js/thread.js → js/thread/

The message thread, as a ThreadControl controller made by the first setThread(). 4 files.

| File            | Does                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| `controller.js` | ThreadControl: set(spec), the options switchable by attribute, the clicks, Copy.         |
| `message.js`    | One message: a system line, or a bubble with avatar, head, folded text, files and foot. |
| `options.js`    | Selector, events, time zone, the options, days, runs of messages, the newest end.       |
| `view.js`       | ThreadView: the state, loading, the note, the messages in their days, scroll and folds.  |

## js/uses-map.js → js/uses-map/

The lines view of a matrix, drawn from a model and wired by one UsesWire controller per draw. 10 files.

| File           | Does                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `constants.js` | The names the lines view is found and heard by.                                                            |
| `dom.js`       | The small DOM helpers: element making, attribute reads and the words of a line.                            |
| `draw.js`      | Drawing: the empty and failed plates, the columns and phone list, pinning from a script, leaving the view. |
| `keys.js`      | Which card an arrow, Home or End key moves to.                                                             |
| `lines.js`     | The paths and the plates on them: building, placing and lighting.                                          |
| `memory.js`    | What the view remembers on this device: the pinned node and the view.                                      |
| `model.js`     | What one draw knows: the options, the nodes and the relation between them.                                 |
| `nodes.js`     | The card of each source and user, and the phone's list of the same words.                                  |
| `relation.js`  | Pure: the relation of a spec as lists, and the path of one line.                                           |
| `wire.js`      | UsesWire: lighting, pinning, the one tab stop, the keys and the collapse to a list.                        |

## js/shortcuts.js → js/shortcuts/

The shortcut engine, as one ShortcutBoard per document with a LiveSheet controller per help sheet. 8 files.

| File           | Does                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------- |
| `board.js`     | ShortcutBoard: the registry, the pending chord, the key listener and the keys' handling.    |
| `constants.js` | The numbers, event names and key lists of the engine.                                       |
| `entries.js`   | What one registered shortcut can be asked: scope on screen, available, let through a field. |
| `hint.js`      | ChordHint: the small cap a chord shows while it waits, and the unknown-chord line.          |
| `keys.js`      | Reading "g s" into steps, spelling keys for the sheet and matching an event to a step.      |
| `live.js`      | LiveSheet: a sheet filled from the registry and fresh each time it opens.                   |
| `register.js`  | Registering shortcuts under a scope: the faults and the unregister.                         |
| `sheet.js`     | The help sheet's body: groups and rows written from the registry.                           |

## js/auto.js → js/auto/

The loader: its table of selectors in three parts, and one AutoLoader per root. 6 files.

| File           | Does                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `dashboard.js` | The loader's table, part two: dashboard components, tiles, charts, navigation and the data lists. |
| `draw.js`      | What the loader asks of the document: carries a selector, what an attach drew.                    |
| `loader.js`    | AutoLoader: one load of a root, the always-on modules, the fetched ones and the late ones.        |
| `needs.js`     | The loader's table in full, the three parts joined in attach order.                               |
| `page.js`      | The loader's table, part one: page furniture, forms and input widgets.                            |
| `widgets.js`   | The loader's table, part three: calendars, grids, timers, ranges and the late `reason` module.    |

## js/effects.js → js/effects-core/

The effects module: the vocabulary, the knobs and the DI5 table, and one EffectsEngine per attach that builds the context the hooks in js/effects/ receive; the headline hook is split over three helpers beside it. 13 files.

| File                               | Does                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `effects-core/base.js`             | EffectsBase: the settings read once, the timers, the memo, the unknown values and the hooks fetched on demand. |
| `effects-core/context.js`          | The context a hook receives from attachEffects, built from the engine.                                         |
| `effects-core/engine.js`           | EffectsEngine: the dispatch of the reveals, the arrival decision, the theme buses and the handle.              |
| `effects-core/knobs.js`            | The custom properties, attributes, events and fixed numbers a theme sets and the module writes back.           |
| `effects-core/registry.js`         | What is kept per page rather than per attach: what has started, the arrivals on screen, the unknown values.    |
| `effects-core/timings-early.js`    | The DI5 table, part one: the 5.0.0 register, synthwave, alarm and the first theme ports.                       |
| `effects-core/timings-formal.js`   | The DI5 table, part two: blueprint, update motion, formal and the meter rounds.                                |
| `effects-core/timings-grammars.js` | The DI5 table, part three: the phantom throw and the light and dark grammars.                                  |
| `effects-core/timings.js`          | The DI5 table merged from its three parts, in row order.                                                       |
| `effects-core/vocabulary.js`       | The hook vocabulary: attributes, values, state classes and the knobs that name routines.                       |
| `effects/headline-run.js`          | HeadlineRun: one headline reveal, its rest state and the routines that are one class and one keyframe.         |
| `effects/headline-special.js`      | The tracking, draw, arrive and ink routines.                                                                   |
| `effects/headline-text.js`         | The word routines, the typed headline and the decipher.                                                        |

## js/range.js → js/range/

The range picker: a preset or a custom from–to, as a RangeController. 5 files.

| File            | Does                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `build.js`      | The markup: the preset bar, the Custom… button, the two bounds and the panel.                              |
| `controller.js` | RangeController: builds and takes down the bar and the line, the preset choice, the first window.          |
| `core.js`       | RangeCore: the options read once, the window it holds, its words and the way it is set.                    |
| `panel.js`      | RangePanel: the custom panel opened and closed, its bounds read and checked before Apply.                  |
| `values.js`     | Selector, event and presets, a preset's length, a moment's words, a typed time and the faults of a window. |

## js/nav-fold.js → js/nav-fold/

The bar that folds what does not fit behind More, as a NavFold controller. 6 files.

| File            | Does                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------- |
| `controller.js` | NavFold: the More item put in and taken out, the menu's pick, what makes the bar fit again. |
| `core.js`       | NavFoldCore: the state and the fit: measure, plan, mark the items and redraw the More menu. |
| `groups.js`     | FoldGroups: the More menu's groups for the folded items, with their rules.                  |
| `more.js`       | The More item built: the menu button dressed as one of the bar's links.                     |
| `plan.js`       | Pure arithmetic: planFold and planSeparators.                                               |
| `read.js`       | Selectors and event, and the readers of an item: words, counter, separator, unavailable.    |

## js/ack-gate.js → js/ack-gate/

The acknowledge gate: a tick before a button may be pressed, as an AckGate controller. 7 files.

| File            | Does                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `build.js`      | The markup: the notes link, the tick, the problem line, the frame, and putting them in the gate.                |
| `controller.js` | AckGate: the stamp, the tick that is set, the handle, the attributes it watches.                                |
| `core.js`       | AckCore: the state, why the tick is off, the control's reason, the paint and the held height.                   |
| `notes.js`      | AckNotes: the release notes fold with its markdown box.                                                         |
| `sync.js`       | AckSync: holding the guarded controls with a reason, and sending a press on one to the first open tick.         |
| `targets.js`    | The registry of attached gates, the controls a gate guards, the gates that share them, and whether one is open. |
| `values.js`     | The selector, the events and the two small delays.                                                              |

## js/code-field.js → js/code-field/

A multiline field that knows its place in a config file, as a CodeFieldControl controller. 5 files.

| File            | Does                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `build.js`      | The chrome round the textarea: gutter, tools, readout, status and mirror, and putting them on.                  |
| `controller.js` | CodeFieldControl: typing, Tab, the gutter's wheel, the tools, the handle, taking the chrome off.                |
| `core.js`       | CodeFieldCore: the state, the options read from the attributes, line heights, gutter, growth and caret readout. |
| `problem.js`    | CodeFieldProblems: the page's error marked, said and held against the form, and the check.                      |
| `values.js`     | Selector, events, limits and the caret's line and column in a text.                                             |

## js/pipeline.js → js/pipeline/

The pipeline board, a lane per stage, as a PipelineBoard controller. 5 files.

| File            | Does                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `controller.js` | PipelineBoard: the first paint, clicks and keys, and the setters for data, state and the open card. |
| `core.js`       | PipelineCore: the state, the frame and the one tab stop.                                            |
| `lanes.js`      | PipelineLanes: a card kept by id, a lane made fresh, the ghosts and the "+N more" toggle.           |
| `values.js`     | Selector and events, the small counts and the element maker.                                        |
| `view.js`       | PipelineView: the whole board painted: lanes, state plate and the loading card.                     |

## js/tabbar.js → js/tabbar/

The bottom tab bar and the count on a tab, as a TabbarController over small parts. 5 files.

| File             | Does                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `badge.js`       | The calls a page makes on the bottom bar: the count badge, the current tab and a tab that waits.       |
| `controller.js`  | TabbarController: the bar's height on the root and its More tab wired to its dialog.                   |
| `count-watch.js` | attachTabCounts: every count under a root drawn now and when an attribute changes.                     |
| `count.js`       | The count on an underline tab: read from attributes, drawn as a badge part, written by setTabCount.    |
| `dialog.js`      | TabbarDialog: the More tab follows its dialog and the drawer closes on a press outside or on an entry. |

## js/idmark.js → js/idmark/

The identity mark made from a name. It keeps no state per element, so it is split by responsibility and has no controller class. 6 files.

| File           | Does                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `attach.js`    | attachIdmarks: every mark under a root drawn, and the ones added or renamed later.               |
| `avatar.js`    | The avatar part of a mark: status dot, the label a screen reader hears, and the photo.           |
| `draw.js`      | setIdmark: one mark drawn from a name, and the record of what each was drawn from.               |
| `group.js`     | setIdmarkGroup: marks with an exact "+N" for the people left out.                                |
| `mark.js`      | What a mark is from its name: hash, letters, slot, glyph, pattern, and slots shared over a list. |
| `more-list.js` | IdmarkMoreList: the "+N" button and the list of the names it hides.                              |

## js/tour.js → js/tour/

The guided tour, as a TourRun controller whose host is the tour's card. 5 files.

| File        | Does                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `build.js`  | The tour card and its parts, and the one shape it keeps through every step.                          |
| `core.js`   | TourCore: the state, the marked target, placing the card, and showing a step.                        |
| `memory.js` | The tour's memory through js/remember.js: taken before, forgotten.                                   |
| `place.js`  | Pure rules and target lookups: when a tour starts, which steps are on the page, where the card goes. |
| `run.js`    | TourRun: the buttons and keys, following the target, ending and remembering.                         |

## js/problems.js → js/problems/

The problem alert, as a ProblemsBoard controller per container. 7 files.

| File         | Does                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `alert.js`   | The alert of one problem (mode each): made or updated in place, with its close button.          |
| `board.js`   | ProblemsBoard: the layout chosen, the stamp, the paint, and the repaint on an attribute change. |
| `each.js`    | ProblemsEach: the state and the each layout, one alert per problem kept by key.                 |
| `parts.js`   | One problem's parts: what, why, remedy with its command, and the fix beside them.               |
| `stamp.js`   | ProblemsStamp: the layout and count stamped on an attached container.                           |
| `summary.js` | ProblemsSummary: the list and fold layouts, one alert holding every problem.                    |
| `values.js`  | Selector, severities, modes, event, how a severity looks, ranking and the shared helpers.       |

## js/facets.js → js/facets/

The facet list with counts and an "only" button, as a FacetGroup controller. 5 files.

| File            | Does                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------- |
| `api.js`        | What a page calls on a group: getFacetValues, setFacetValues, setFacetCounts, setFacetItems. |
| `controller.js` | FacetGroup: the rows brought in step, the status region, and the change and "only" presses.  |
| `pattern.js`    | The identity pattern: identityCells and the SVG drawn over a swatch.                         |
| `rows.js`       | The rows: finding, wiring, building and painting them, the Everything row and the sync.      |
| `values.js`     | The selector and the event.                                                                  |

## js/undo-toast.js → js/undo-toast/

The toast with Undo and a visible clock, as an UndoRun controller whose host is the toast. 5 files.

| File        | Does                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------- |
| `build.js`  | The toast's settings read from the options and the page's defaults, and its content.         |
| `core.js`   | UndoCore: the state and the clock that holds while the pointer or the focus is on the toast. |
| `run.js`    | UndoRun: Undo, the commit and its failure, Esc and close, and leaving the page.              |
| `stack.js`  | The toasts still counting, and the one key that undoes the newest.                           |
| `values.js` | The class, the event and the fixed numbers.                                                  |

## js/transfer.js → js/transfer/

A transfer with its speed and the time left, as a TransferRow controller per row. 8 files.

| File        | Does                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `core.js`   | TransferCore: the state and what is painted from it: bar, reading, speed, time left, announcement. |
| `group.js`  | TransferGroup: a group that folds to name, bar and numbers by its own width.                       |
| `math.js`   | Pure arithmetic: transferRate and transferEta.                                                     |
| `parts.js`  | The parts of a row, built when it lacks them.                                                      |
| `read.js`   | What a row's attributes ask for: byte base, number options, parts shown, bytes in words.           |
| `row.js`    | TransferRow: the reports, finish, failure and Retry, the linger, and the reset.                    |
| `ticker.js` | The one timer the live transfers share, so a stall is noticed without a report.                    |
| `values.js` | Selector, events, the defaults the attributes override.                                            |

## js/theme-core.js → js/theme-core/

The theme runtime: the theme on the root, its events, the preview, the stored choice and the change subscription. Not a component, so no controller class: it is split by responsibility. 7 files.

| File           | Does                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apply.js`     | Putting a theme on the root and telling everyone: applyTheme() and initializeTheme() [AR6, scope-50, TH26].                                         |
| `preview.js`   | Previewing a theme on the root for a look, without choosing it [anchors-picker-1019].                                                               |
| `read.js`      | Reading the theme a root wears and the theme a change is held for [AR25, scope-50].                                                                 |
| `report.js`    | Saying once, out loud, that a theme name was dropped: the once-per-session memory, the console warning and the event [TH97, AR25].                  |
| `store.js`     | Remembering the choice and reading it back: storeTheme() and storedTheme() [AR6, AR25, S29].                                                        |
| `subscribe.js` | Listening for theme changes, whoever made them: this tab's pickers or, unless declined, another tab [AR5, AR25].                                    |
| `values.js`    | The theme runtime's fixed names and its settable defaults: the event and attribute names, configureTheme(), the theme-name guards [AR5, KT6, TH26]. |

## js/deplist.js → js/deplist/

The dependency list, as a DependencyList controller per list. 5 files.

| File            | Does                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One dependency list: wired once, redrawn from its rows, its state and its attributes, with the fold, the copy button and the states.    |
| `core.js`       | One dependency list's state and its settings: the rows given, the state shown, the elements it is drawn in, the handle a page gets.     |
| `order.js`      | Pure ordering: the rows in the order things must go, cycles set apart, and the rows as plain text.                                      |
| `rows.js`       | The elements of the rows: a name with its mark and link, a row with its number, arrow, state and spoken form, a cycle, a group heading. |
| `values.js`     | The selector, the event, the fixed numbers and the attributes the dependency list redraws on.                                           |

## js/docpreview.js → js/docpreview/

The document preview and the document glyph: a DocOpener per opener, a DocGlyph per glyph, a PreviewRun per open preview. 8 files.

| File        | Does                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `core.js`   | One open preview's state: the options, the viewer, the group it steps through and where it is, the frame, and the load that is running. |
| `glyph.js`  | The document glyph: its name for a screen reader and its number of text lines, wired by DocGlyph or built by docGlyph().                |
| `keys.js`   | The keys a preview adds to the shortcut engine while it is open: open, download, print, and previous / next in a group.                 |
| `kinds.js`  | Pure: the kind of glyph a name means, the plain name of a file, and what a preview draws a file as.                                     |
| `open.js`   | Opening a document in the viewer: the viewer shell first, then one PreviewRun that loads into it.                                       |
| `opener.js` | An opener: a link or a button that opens its document in the preview, off with a reason when it has no file yet.                        |
| `run.js`    | One running preview: it asks the server about the file, then shows it as a frame or a picture, or says why it cannot.                   |
| `values.js` | The selectors, the kinds, the extension table and the fixed numbers of the document preview and the document glyph.                     |

## js/quantity.js → js/quantity/

A quantity with minus and plus, as a QuantityControl controller per control. 6 files.

| File            | Does                                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build.js`      | The parts the markup left out (the field, the unit, the two buttons) and the names they get. Safe to run again.                                         |
| `controller.js` | One quantity: its first paint, a held button that repeats, the keys of the spin button, and the typing that is read on Enter or when the field is left. |
| `math.js`       | Pure: the number a quantity stands at, read from its attributes, written in the page's language, typed back in, kept on a step.                         |
| `paint.js`      | Writing a value everywhere it shows, and changing it as a person did: the field, the unit, the spin button's numbers, the buttons.                      |
| `read.js`       | What a quantity's markup holds: its field, whether it is off, the value it stands at, the unit for a value.                                             |
| `values.js`     | The selector, the event and the fixed numbers of the quantity control.                                                                                  |

## js/theme-picker.js → js/theme-picker/

The framework-free theme picker, as a ThemePicker controller per picker. 6 files.

| File            | Does                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One picker: the choice a press makes, the preview on hover and keyboard focus, and the marks that follow the theme.                     |
| `marks.js`      | What a picker writes on the page: the save-failed word and the selection marks on its options.                                          |
| `markup.js`     | The picker as markup: the options grouped light and dark, and the icon button with its dropdown [TH63, S2].                             |
| `preview.js`    | A picker's preview: a theme shown while the pointer or the keyboard rests on its button, never chosen by it, and taken back afterwards. |
| `register.js`   | Where a preview is shown, and the register a theme needs loaded before it can be shown.                                                 |
| `values.js`     | The selectors, the events and the preview delay of the theme picker.                                                                    |

## js/freshness.js → js/freshness/

The ticking freshness line: pure text helpers, one shared engine and timer, and an AgoWatch controller per attach call. 6 files.

| File        | Does                                                                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `engine.js` | The one ticking engine every attach shares: the repaint pass, the timer that follows the lines and the tab, adopting a line, setAgo().         |
| `paint.js`  | Writing one freshness line as it stands: its words, its reserved width, its moment, its stale state and what it announces.                     |
| `state.js`  | What every freshness attach on a page shares: the ticking lines, the one timer, and what has been measured.                                    |
| `text.js`   | Pure: a span of seconds in words, a line's words, a moment as a person reads it, and the moment an element carries.                            |
| `values.js` | The selector, the zone and the fixed numbers of the freshness line.                                                                            |
| `watch.js`  | One attach call: it adopts the lines under its root, watches for lines that arrive, change or leave, and measures again when the face changes. |

## js/hovercard.js → js/hovercard/

The hover card: one shared card per root, as a HoverCard controller. 5 files.

| File            | Does                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One hover card for a root: the listeners on the root, the pointer and focus asks, the keys, and the handle a page gets back.        |
| `core.js`       | One hover card's state and its helpers: the options, the one card node, what an anchor is, the words, the place, and the aria link. |
| `show.js`       | Opening, moving, closing and refreshing the one card: the entrance, the going-out played backwards, the pending asks.               |
| `touch.js`      | The touch half of the card: a tap opens and closes it, a tap outside closes it, and a control's own tap waits for the second one.   |
| `values.js`     | The names, the defaults and the fixed numbers of the hover card.                                                                    |

## js/stackbar.js → js/stackbar/

The share bar, as a Stackbar controller per bar. 5 files.

| File            | Does                                                                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One share bar: drawn from a spec (its own `data-kp-stackbar` JSON, or setStackbar), with the listeners that light, pick and move between parts.            |
| `core.js`       | One share bar's state and the parts of a draw that do not depend on its parts: the root's marks, the head, the footprint, and the loading and note states. |
| `math.js`       | Pure: a share as words, and the arithmetic of a share bar with no DOM.                                                                                     |
| `parts.js`      | The ready state of the share bar: one segment and one legend row per part, the free or over row, the ticks, and the one tab stop.                          |
| `values.js`     | The selector, the events and the fixed numbers of the share bar.                                                                                           |

## js/version-delta.js → js/version-delta/

The version jump chip, as a VersionChip controller per chip. 6 files.

| File            | Does                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One version chip: drawn from its attributes and redrawn when they change, and copied with Shift+click.                                             |
| `core.js`       | One version chip's state and what it reads: its attributes as settings, the words of a level, and the small text and node helpers.                 |
| `level.js`      | Pure: the numbers in a version, how big a jump is, and a list of jumps counted for a heading.                                                      |
| `links.js`      | Pure: the GitHub repository of an upstream and the release page of a tag.                                                                          |
| `values.js`     | The selector, the event, the levels and the attributes the version chip redraws on.                                                                |
| `view.js`       | What a version chip shows: its tone and marks, the loading, failed and empty words, and the versions with their arrow, level word and spoken form. |

## js/kpi.js → js/kpi/

The key-figure parts: sparklines, toggles, the meter and the strips; the three attach calls are watch controllers, the rest stays functions. 7 files.

| File         | Does                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `columns.js` | The column count of a strip: how many columns n tiles take at a width, and putting a strip on that count.                               |
| `meter.js`   | The meter: what a share and a mark draw, the words it is read by, and setMeter() that writes its share, mark, tone and ARIA.            |
| `scope.js`   | What the attach calls of this module share: a scope (a document, a shadow root or an element) as the controller's host, built directly. |
| `spark.js`   | The sparkline: its two paths from the numbers, its drawing into an SVG, and the watch that redraws it when its numbers change.          |
| `strips.js`  | The KPI strips of a scope: each on an allowed column count by its own width, again when tiles come, go or hide, or the face changes.    |
| `toggle.js`  | The KPI toggle: a click flips aria-pressed and fires the event; the page does the filtering.                                            |
| `values.js`  | The selectors, the event and the fixed numbers of the key-figure parts.                                                                 |

## js/question-card.js → js/question-card/

The question card: the host waits for your answer, as a QuestionRun controller per card. 6 files.

| File        | Does                                                                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build.js`  | The card's elements: the head, the time with its measure, the answer buttons with their consequences, the outcome, Dismiss and the voice.          |
| `core.js`   | One question card's state and what it paints from it: the state and its look, the time left, the outcome line, the countdown animation, the clock. |
| `run.js`    | One running question: its place among the others, its answer and the app's reply, its time running out, and its going.                             |
| `spec.js`   | What a question's spec means: its times in ms, its answers (Allow and Stop by default), its countdown look and what happens at zero.               |
| `title.js`  | The tab title: it says how many questions wait, for every card of the page together.                                                               |
| `values.js` | The container selector, the events and the fixed numbers of the question card.                                                                     |

## js/page-contents.js → js/page-contents/

The "On this page" contents list, as a ContentsList controller per nav. 7 files.

| File            | Does                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One contents list: built once, redrawn when the page's headings or its own options change, following the reader, and taking them to a section.  |
| `core.js`       | One contents list's state and where it looks: the elements it builds, the entries, the current one, and the scope, offset, scroller and motion. |
| `draw.js`       | Drawing the list: the title, the loading bars, and one item per entry, only when the entries changed.                                           |
| `read.js`       | Reading the entries: the items the page gave, or the headings of the scope, each with an id of its own.                                         |
| `slug.js`       | Pure: the id a heading's words make, and which section the reader is in.                                                                        |
| `spy.js`        | The scroll-spy: which entry is current as the reader scrolls, marked on the list, announced by an event, and followed in a pane of its own.     |
| `values.js`     | The selector, the event, the defaults and the attributes the contents list redraws on.                                                          |

## js/listbox.js → js/listbox/

The listbox engine: virtual focus between an input and a list of options, as a ListboxController per list. 5 files.

| File            | Does                                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One wired listbox: the keys that move the highlight, the click and hover on an option, and the way it is taken down again. |
| `core.js`       | One listbox's state and its highlight: the options a person can choose, their ids, the highlight and the choice.           |
| `match.js`      | Matching text against a query the way a command palette does: as a subsequence.                                            |
| `scroll.js`     | Scrolling an option into view inside its own scroll container only, never the window.                                      |
| `values.js`     | The listbox's contract values and options: the option attribute, the two events, the defaults and the options typedef.     |

## js/newpill.js → js/newpill/

The new-lines pill on a live list: following its end, counting what arrived out of sight, as a NewPill controller per scroller. 8 files.

| File            | Does                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `away.js`       | The divider for the rows that came while the tab was away: "New since 14:32", put before the first of them.                                      |
| `controller.js` | One live list: its pill placed, the rows it counts, the listeners for the reader's scroll, keys and pause buttons, and the way it is taken down. |
| `core.js`       | One live list's state and where it looks: the options it read, the pill, what is following and what is unseen, and the scroll position.          |
| `draw.js`       | Drawing the pill: ruled in and taken out the way it came, the count on it, the pause buttons, the event, and the count said now and then.        |
| `options.js`    | Reading the options of one scroller: what the page passed beats the attribute, and the attribute beats the default.                              |
| `parts.js`      | The pill and the status line it speaks through, built but not yet placed.                                                                        |
| `rows.js`       | Which elements are rows: what counts as a new row in a list or in a table body, and the key a row returns by.                                    |
| `values.js`     | The selector, the events and the fixed numbers of the new-lines pill.                                                                            |

## js/actions.js → js/actions/

A list's row buttons on shared columns, busy rows, leaving rows and the keyboard walking them: an ActionColumns controller per root and a RowKeys controller per list. 7 files.

| File         | Does                                                                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `busy.js`    | A row at work: its buttons say no to a press, the pressed one shows the theme's spinner, and nothing moves.                                           |
| `columns.js` | The action columns of everything under a root: fitted now, and again once per frame when a row's buttons change, the theme changes or a font arrives. |
| `fit.js`     | Laying one list's or table's button boxes on shared columns: naming each button's column, and measuring a table's widths.                             |
| `keys.js`    | The keyboard walking the rows of one list: j / k or the arrows, Home and End, Enter to open, and one row in the tab order.                            |
| `remove.js`  | A row that leaves the theme's way, the focus moving to its neighbour first.                                                                           |
| `roles.js`   | Pure: which role each button of a row has, and one column order for every row.                                                                        |
| `values.js`  | The selectors and the event of the row buttons: the button box, the list that shares columns, the lists the keyboard walks.                           |

## js/runs.js → js/runs/

The next-times list: what a repetition really does, as a RunsList controller per list. 9 files.

| File            | Does                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `controller.js` | One wired list: placed and built, its handle, the retry and "show more" presses, the minute refresh, and its first state.                        |
| `core.js`       | One list's state and what changes it: the times, the state, the expanded rows, the busy card and the first run said.                             |
| `input.js`      | Pure: what the app gives as a time (a number, an ISO string, a Date or `{ at, conflict }`) read as a run.                                        |
| `note.js`       | The note under the rows: the package's empty plate with the app's reason, or the error plate with Try again.                                     |
| `options.js`    | Reading the options of one list from its attributes; the page's own clock beats the fixed one, and the fixed one beats the real clock.           |
| `parts.js`      | The elements of one list, built but not yet placed: the title, the stage with its rows and its note, the "show more" button and the status line. |
| `rows.js`       | Drawing the rows: one row per run with its time, its distance and its marks, the loading rows, and the "show more" button.                       |
| `time.js`       | Pure: a run's distance from now in words, how far a zone runs ahead of UTC, a run as rule 52 writes it, and the clock turning.                   |
| `values.js`     | The selector, the event, the states and the fixed numbers of the next-times list.                                                                |

## js/weekdays.js → js/weekdays/

The weekday picker: seven chips, or the days of a month, as a WeekdayPicker controller per picker. 7 files.

| File            | Does                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One wired picker: placed and built, the days it is given, the chips and quick picks a person presses, and its first value.                         |
| `core.js`       | One picker's state and its reading: the options it read, its parts, the picked days in order and in words, and the paint that follows them.        |
| `names.js`      | Day names: a day read from a number or a name, and the weekday names of a style in the reader's language.                                          |
| `options.js`    | Reading the options of one picker from its attributes and the page's defaults.                                                                     |
| `parts.js`      | The elements of one picker, built but not yet placed: the chip group with its items, the line in words, the error, the reason and the quick picks. |
| `summary.js`    | Pure: the picked days in words: "Mon and Thu", "Every weekday", "On the 1st and 15th".                                                             |
| `values.js`     | The selector, the event, the quick picks and the fixed numbers of the weekday picker.                                                              |

## js/path-trace.js → js/path-trace/

The path of one connection: a row of hops, each allowed or refused, as a Trace controller per path. 5 files.

| File            | Does                                                                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One wired trace: its parts placed, its handle, the redraw when an option changes, the swap key, and the way it is taken down.                             |
| `core.js`       | One trace's state: the hops, which state it is in, the message of an error, the busy card and the height kept between states.                             |
| `draw.js`       | Drawing the trace: the empty and error plates, the placeholder hops, the hops as a step list with the words the page says, and the copy and swap buttons. |
| `states.js`     | Pure: the verdict of each hop once the first refusal stops the packet, the outcome in a sentence, and the trace as text for a bug report.                 |
| `values.js`     | The selector, the events and the fixed numbers of the connection path.                                                                                    |

## js/alarm.js → js/alarm/

The full-screen alarm: its markup, the raised AlarmSession per alarm and the AlarmTrigger per trigger. 6 files.

| File           | Does                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `build.js`     | Building an alarm's markup, closed and not yet in the document: the dialog, the headline, the way out and the countdown.           |
| `countdown.js` | The countdown's writes: its two shares and its words.                                                                              |
| `glyphs.js`    | The headline as letter cells for the stylesheet's decode, and the noise glyphs each cell carries.                                  |
| `session.js`   | One raised alarm: the ways out (its button, Escape, the countdown), the focus it takes and gives back, and the promise it settles. |
| `trigger.js`   | A `[data-kp-alarm]` trigger: a press raises the alarm the trigger describes.                                                       |
| `values.js`    | The events and the fixed numbers of the full-screen alarm.                                                                         |

## js/upload.js → js/upload/

The file drop and upload: the zone, the rows and their states, as an UploadZone controller per upload. 6 files.

| File            | Does                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accepts.js`    | Pure: does a file satisfy an `accept` list, by the file picker's own rules.                                                                                         |
| `controller.js` | One wired upload: its change, remove and drag-and-drop handling, its handle, and the way it is taken down.                                                          |
| `core.js`       | One upload's state and its rows: the limits it read, the rows and the files they stand for, and the taking of files (refusing each with its reason on its own row). |
| `item.js`       | A file row's state, written by the page that owns the request: its progress, its being done, its error.                                                             |
| `row.js`        | The default row of one file: its name, its size, a progress bar that is also a number, a message and a named remove button.                                         |
| `values.js`     | The selectors, the events and the defaults of the file drop and upload.                                                                                             |

## js/timer-disc.js → js/timer-disc/

The visual timer: the time left as a shrinking disc, as a TimerDisc controller per disc. 6 files.

| File            | Does                                                                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One wired visual timer: its parts placed, the Start / Pause and Reset presses, the fill on a reset, a counted moment, and the way it is taken down. |
| `core.js`       | One disc's options and its parts: what it reads from its attributes (again when they change), and the face, caption, line and status it builds.     |
| `draw.js`       | Drawing the disc and its words: the edge, the face's label, the caption and the status line, the controls, and the clock that moves them.           |
| `register.js`   | Registering the disc's custom property once, so a reset can fill the disc in the theme's own curve.                                                 |
| `share.js`      | Pure: the share of the disc left.                                                                                                                   |
| `values.js`     | The selector, the custom property and the fixed numbers of the visual timer.                                                                        |

## js/flash.js → js/flash/

The flash button: a button that shows the result for a moment, as a FlashButton controller per button. 7 files.

| File            | Does                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One wired flash button: its faces, and the press that posts or runs the page's work, guarded while it is busy.                        |
| `faces.js`      | One button's faces: its own words, the spinner, the result and the words it may say, all in one grid cell so the width never changes. |
| `outcome.js`    | What a press came to: the work's answer read as a success or a refusal with its word and its line, or the error it threw.             |
| `post.js`       | The chassis pattern: POST (or another method), then show the answer.                                                                  |
| `read.js`       | Reading a button's attributes with a default.                                                                                         |
| `run.js`        | Running work behind the button: busy while it runs, then its result for a moment, then back to rest.                                  |
| `values.js`     | The selector, the events and the times of the flash button.                                                                           |

## js/bullets.js → js/bullets/

The bullet list: rows of a value against a threshold, as a BulletList controller per list. 7 files.

| File            | Does                                                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One bullet list: its clicks, the state it was drawn in, and the drawing of the loading, empty, error and ready states.                   |
| `make.js`       | A small helper: an element with a class.                                                                                                 |
| `note.js`       | The note that stands in place of the rows: the package's empty plate, or the error plate with Retry, filling the list's whole footprint. |
| `row.js`        | One row of a ready list: its lead, its label and detail, its meter with the threshold's tick, and the exact figure.                      |
| `tone.js`       | Pure: the tone of a value against its threshold.                                                                                         |
| `values.js`     | The selector, the events and the defaults of the bullet list.                                                                            |
| `waiting.js`    | The waiting rows of the loading state: the rows' geometry kept as placeholders.                                                          |

## js/connection.js → js/connection/

The connection banner: offline, reconnecting, back and refused, as a ConnectionBanner controller per banner. 5 files.

| File            | Does                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One banner: the state it shows, the grace before a drop shows, the automatic tries with their countdown, and "Connected again" leaving. |
| `options.js`    | Reading the options of one banner from its attributes, each time it needs them so they can be switched at runtime.                      |
| `parts.js`      | The elements of one banner, built but not yet placed: the band with its mark, its words and its Retry, and the spoken status.           |
| `text.js`       | Pure: the two lines a state says, its title and its reason.                                                                             |
| `values.js`     | The selector, the events, the states and the defaults of the connection banner.                                                         |

## js/quiet-hours.js → js/quiet-hours/

Quiet hours: from, to, which days and what still comes through, as a QuietHours controller per control. 5 files.

| File            | Does                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One wired control: the fields it composes, the presses and picks of its parts, and the way it is taken down.                                                   |
| `core.js`       | One control's value and what shows it: the value, the severities as ticks, the paint of the switch, the line in words and the problem, and the event.          |
| `parts.js`      | The elements of one control, built but not yet placed: the switch, the label-and-control rows, the problem line, the summary, the reason and the loading bars. |
| `value.js`      | Pure: a value read from whatever the page wrote, and the value in words.                                                                                       |
| `values.js`     | The selector, the event, the default value and the fixed numbers of the quiet-hours control.                                                                   |

## js/compare.js → js/compare/

The compare slider: two versions stacked with a divider between them, as a Compare controller per slider. 6 files.

| File            | Does                                                                                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One wired slider: its panes dressed, the parts placed, the drag and the keys, and the way it is taken down.                                                                |
| `core.js`       | One slider's panes, its divider and where it stands: moving the divider (with the glide, the values read aloud and the labels stepping aside), and the pointer's position. |
| `keys.js`       | Pure: where a key puts the divider.                                                                                                                                        |
| `load.js`       | The loading of the images: the box waits under the busy card until every image has arrived or failed, and a failed image says so in its pane with a Retry.                 |
| `parts.js`      | The parts a compare slider adds to its two panes, built but not yet placed: the side labels, the divider with its handle, and the loading plate.                           |
| `values.js`     | The selector, the events and the fixed numbers of the compare slider.                                                                                                      |

## js/viewer.js → js/viewer/

The viewer shell: one thing opened large in a modal dialog, as a Viewer controller per open viewer. 6 files.

| File            | Does                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `actions.js`    | The foot's actions: open in a new tab and download as links, print, copy link and the page's own as buttons.      |
| `controller.js` | One open viewer: its dialog and the way it closes, its texts, its actions, its stage and the states of the stage. |
| `make.js`       | A small helper: an element with a class.                                                                          |
| `parts.js`      | The elements of one viewer, built but not yet in the page: the dialog with its head, its stage and its foot.      |
| `plate.js`      | The plate a stage shows when its content failed or cannot be shown here.                                          |
| `values.js`     | The selector, the event and the states of the viewer shell.                                                       |

## js/gridlayout.js → js/gridlayout/

The movable grid: tiles that move and resize on a coarse grid, as a MovableGrid controller per grid. 4 files.

| File            | Does                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | One movable grid: its keyboard and pointer routes, the layout events with their debounce, and the way the placement is taken back. |
| `layout.js`     | A layout as data: read off the tiles, and put back on them.                                                                        |
| `place.js`      | Writing a tile's placement from its data attributes, and taking it back: four custom properties and a description in words.        |
| `values.js`     | The selectors, the events and the defaults of the movable grid.                                                                    |

## js/update.js → js/update/

The update-in-place motion: the names, the theme's timing, the mark, the spark's glide and the batch (an UpdateBatch) that marks every update of a task together. 6 files.

| File        | Does                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `batch.js`  | The batch: every update called in one task is marked together in one microtask, so a page that updates fifty cells pays one style pass. |
| `mark.js`   | The mark an update puts on its host while it plays, and the inline styles it replaces and puts back.                                    |
| `run.js`    | update(): write the value at once, queue the mark in the batch of this task.                                                            |
| `spark.js`  | A spark inside an update: its numbers written, and its last point gliding to the new place.                                             |
| `timing.js` | The idea a register names for an update and the time and curve it plays on, from the theme's motion.                                    |
| `values.js` | The names an update marks an element with, and the inline properties it sets while it plays.                                            |

## js/lazy-register.js → js/lazy-register/

The lazily loaded theme register: its names, its links, the load of one register (RegisterLoad) and the LazyRegisters controller that holds a theme change until its register has arrived. 4 files.

| File            | Does                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `controller.js` | The controller that keeps the document's registers in step with its theme: holds a change until its register has loaded. |
| `ensure.js`     | Making sure a register is in the document: one RegisterLoad per fetch, so a register is fetched once.                    |
| `links.js`      | A register's URL, the link that serves it, whether it has loaded, and the per-document record of loads.                  |
| `values.js`     | The names a lazily loaded register is marked and announced with, and where it is served from by default.                 |

## js/card-state.js → js/card-state/

A card in four data states: the names, the stage parts, the note, the per-card sync (CardSync, also behind setCardState() before any attach) and the CardStateController. 5 files.

| File            | Does                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `controller.js` | The controller of one card: it syncs the card, follows `data-kp-state` and turns a press on Try again into `kp-card-retry`.         |
| `note.js`       | The empty or error note: the package's state plate (js/state-plate.js), written unless the page drew its own.                       |
| `parts.js`      | The card's stage, its data area and its note, made where they are missing.                                                          |
| `sync.js`       | A card's state: the parts, the loading card and the note brought in step with `data-kp-state`, per card and kept before any attach. |
| `values.js`     | The selector, the four states and the events of a card in four data states.                                                         |
