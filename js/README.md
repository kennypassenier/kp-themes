# js/ source index

The JavaScript modules a consumer imports live in `js/<name>.js`; the `package.json` exports, `auto.js` and every app point at
those paths and nothing else. The twenty-seven largest modules are a **facade**: a short file that re-exports exactly the names the module
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
  `attachX(root, options)` becomes `attachAll(root, SELECTOR, XController, options)`. Converted so far: `footprint.js`, `notices.js`, `row-select.js`.
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
