# js/ source index

The JavaScript modules a consumer imports live in `js/<name>.js`; the `package.json` exports, `auto.js` and every app point at
those paths and nothing else. The ten largest modules are a **facade**: a short file that re-exports exactly the names the module
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
