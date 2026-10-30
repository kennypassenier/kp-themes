# css/ source index

Generated, never hand-edited: `css/components.css` and `css/<theme>-register.css` (twelve themes). They are built
by `node gates/generate-css.mjs` (`npm run generate:css`) by joining part files in the order of an `index.json`
manifest. `node gates/generate-css.mjs --check` (inside `npm run gates`) fails when a generated file differs from
its parts, so a hand edit of a generated file is refused. Edit a part, regenerate, commit both.

## How a style is found

- A class `.kp-x` is styled in `css/components/x.css`, or in `css/components/x/…` when the component has several
  parts (`base.css` first, then one file per concern). Names follow the component, not the class prefix, so
  `.kp-nav` lives in `navbar/`, `.kp-sidenav` in `sidenav/`, `.kp-heat` in `heat-grid.css`. When in doubt,
  `grep -rn "\.kp-x" css/components/`.
- The theme look of the same component is in `css/registers/<theme>/x…`, using the same component name where the
  register is organised per component. A register also has `base.css` (the theme's knobs and texture) and, after
  it, the parts of its `kp.signature` layer (`signature-base/`, `the-approved-grammar.css`, and so on).
- Every part opens with one line, `/* @part: <component>: <what it styles> */`. The generator strips that line, so
  it never reaches the output.
- A layer block that is too long for one file is split over several parts: the manifest holds the exact
  `@layer … {` opening and the closing `}`, and the parts hold only what sits inside it. A rare part may therefore
  start or end inside a nested `@media` block; the manifest order is what makes it whole.
- No hand-written source file may pass 500 lines (`npm run check:file-size`, `gates/file-size.json`).

## How the generated files are built

`css/components/index.json` and `css/registers/<theme>/index.json` each list their parts in the fixed output order.
Add a part by creating the file with its `@part` header and adding it to the manifest at the right place; the
generator refuses a part that is not listed, a listed part that is missing and a part without a header. Then run
`npm run generate:css`.

## css/components/

| Part                            | Styles                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `accordion.css`                 | Accordion                                                                        |
| `ack-gate/`                     | Acknowledge gate (2 parts)                                                       |
| `action-columns.css`            | Action columns                                                                   |
| `action-tiles.css`              | Action tiles, status rows, facet list                                            |
| `activity-feed/`                | The activity feed (2 parts)                                                      |
| `alarm/`                        | Alarm (2 parts)                                                                  |
| `alert.css`                     | Alert                                                                            |
| `anchors/`                      | Link anchors on headings and rows (2 parts)                                      |
| `annotations/`                  | Annotations (2 parts)                                                            |
| `attention-band.css`            | Attention band                                                                   |
| `auto-refresh.css`              | The automatic refresh chooser                                                    |
| `autogrow-textarea.css`         | A text box that grows with its text                                              |
| `avatar.css`                    | Avatar                                                                           |
| `back-to-top.css`               | Back to top                                                                      |
| `badge.css`                     | Badge                                                                            |
| `bar-cell.css`                  | A value with a bar, in a table cell                                              |
| `breadcrumb-pagination.css`     | Breadcrumb and pagination                                                        |
| `bullet-rows.css`               | Bullet rows                                                                      |
| `button.css`                    | Button                                                                           |
| `calm-mode.css`                 | Calm mode                                                                        |
| `calm-status.css`               | The calm vocabulary of the status list, and the today card                       |
| `calm-tones.css`                | Calm tones for the calendar, the heat grid and the uptime strip                  |
| `card.css`                      | Card                                                                             |
| `checklist-sink.css`            | A checklist whose ticked items sink                                              |
| `code-block.css`                | Code block                                                                       |
| `code-field.css`                | Code field                                                                       |
| `colour-picker.css`             | Colour picker                                                                    |
| `combobox.css`                  | Combobox and tag input                                                           |
| `command-block.css`             | Command block                                                                    |
| `command-palette.css`           | Command palette and shortcut sheet                                               |
| `compare-slider.css`            | Compare slider                                                                   |
| `connection-banner.css`         | The connection banner                                                            |
| `connection-path.css`           | Path of a connection                                                             |
| `console.css`                   | An interactive console                                                           |
| `conversation.css`              | Conversation thread                                                              |
| `countdown.css`                 | Countdown                                                                        |
| `datatable/`                    | DataTable (3 parts)                                                              |
| `date-picker.css`               | Date picker                                                                      |
| `dated-option-picker.css`       | Dated option picker                                                              |
| `dependency-list.css`           | Dependency list                                                                  |
| `dialog.css`                    | Dialog                                                                           |
| `diff.css`                      | A diff of several files                                                          |
| `disabled-reason.css`           | A disabled control says why                                                      |
| `document-page.css`             | The page that means "a document"                                                 |
| `drawer-tour.css`               | Drawer, help and the tour                                                        |
| `entity-card.css`               | Entity card                                                                      |
| `entrance-reverse.css`          | An entrance played backwards                                                     |
| `facet-list.css`                | Facet list                                                                       |
| `flash-button.css`              | The flash button                                                                 |
| `focus-steps.css`               | One step at a time                                                               |
| `form-field.css`                | Form field                                                                       |
| `form-grid/`                    | Form grid (2 parts)                                                              |
| `form-rows.css`                 | Form rows                                                                        |
| `forms.css`                     | Forms                                                                            |
| `freshness-line.css`            | Freshness line                                                                   |
| `gallery.css`                   | A grid of pictures that open large                                               |
| `graph/`                        | Network graph (2 parts)                                                          |
| `grow-shrink.css`               | Growing and shrinking                                                            |
| `heat-grid.css`                 | Heat grid                                                                        |
| `heat-paging.css`               | Heat paging bar                                                                  |
| `identity-mark.css`             | Identity mark                                                                    |
| `intro.css`                     | opening comment, knobs and base                                                  |
| `job-line.css`                  | Job line                                                                         |
| `json-box.css`                  | The JSON box                                                                     |
| `key-figure-columns.css`        | Key-figure strip on allowed column counts                                        |
| `key-figure-trend.css`          | A key figure with its 24-hour trend                                              |
| `key-figures.css`               | Key figures                                                                      |
| `key-value-grid.css`            | Key-value grid                                                                   |
| `kitchen-timers.css`            | Kitchen timers                                                                   |
| `layout/`                       | The tour's dim is the target's box-shadow, and a register that gives t (9 parts) |
| `layout-base.css`               | opening of the layout block                                                      |
| `lede.css`                      | The lede                                                                         |
| `log-viewer.css`                | A live log viewer                                                                |
| `log.css`                       | Log                                                                              |
| `master-detail.css`             | Master and detail                                                                |
| `matrix.css`                    | Matrix                                                                           |
| `media.css`                     | Media                                                                            |
| `menu-button.css`               | Menu button with a rich menu                                                     |
| `meter.css`                     | Meter with a mark                                                                |
| `month-heatmap.css`             | Month heatmap                                                                    |
| `movable-grid.css`              | Movable grid layout                                                              |
| `navbar/`                       | Navigation bar (2 parts)                                                         |
| `new-lines-pill.css`            | The "N new lines" pill                                                           |
| `next-times.css`                | Next times                                                                       |
| `notification-centre.css`       | The notification centre                                                          |
| `on-this-page.css`              | On this page                                                                     |
| `one-question.css`              | Answering one question per screen                                                |
| `ops-page.css`                  | The operations page                                                              |
| `page-header/`                  | Page header (2 parts)                                                            |
| `page-shell.css`                | The page's shell                                                                 |
| `palette-any-order.css`         | Palette that finds words in any order                                            |
| `parallel-tracks.css`           | Parallel tracks                                                                  |
| `passkey-list.css`              | Passkey list                                                                     |
| `pipeline.css`                  | Pipeline                                                                         |
| `plain-card.css`                | Plain card                                                                       |
| `popover.css`                   | Dropdown and tooltip, on the popover layer                                       |
| `problem-alert.css`             | The problem alert                                                                |
| `progress-spinner-skeleton.css` | Progress, spinner, skeleton                                                      |
| `qr-link.css`                   | A link as a QR code                                                              |
| `quantity.css`                  | A quantity with minus and plus                                                   |
| `question-card.css`             | The question card                                                                |
| `quiet-hours.css`               | Quiet hours                                                                      |
| `quote-card.css`                | The quote card                                                                   |
| `range-picker.css`              | Range picker                                                                     |
| `rating.css`                    | The star rating                                                                  |
| `request-inspector.css`         | The request inspector                                                            |
| `run-timeline/`                 | Run timeline (3 parts)                                                           |
| `running-job-button.css`        | A running-job button                                                             |
| `segmented-toolbar/`            | Segmented control, filter chips, list toolbar, key line (2 parts)                |
| `sentence-form.css`             | Sentence form                                                                    |
| `sequencer.css`                 | The editable timeline                                                            |
| `share-bar.css`                 | Share bar                                                                        |
| `shortcut-engine.css`           | The shortcut engine's parts                                                      |
| `showing-data.css`              | Showing data                                                                     |
| `sidenav/`                      | Side navigation (3 parts)                                                        |
| `slider.css`                    | Slider                                                                           |
| `small-patterns.css`            | The small patterns                                                               |
| `snooze-picker.css`             | Snooze picker                                                                    |
| `state-plate.css`               | The plate an empty or failed area is drawn with                                  |
| `state-plates-last-layer.css`   | State plates in the last layer                                                   |
| `state-word.css`                | A state word that keeps its width                                                |
| `status-rows.css`               | Status rows                                                                      |
| `step-list.css`                 | Step list                                                                        |
| `switch.css`                    | Switch                                                                           |
| `tabbar.css`                    | Bottom tab bar                                                                   |
| `table.css`                     | Table                                                                            |
| `tabs.css`                      | Tabs                                                                             |
| `theme-menu.css`                | The theme menu                                                                   |
| `theme-picker.css`              | The theme picker                                                                 |
| `ticking-number.css`            | A number that ticks to its new value                                             |
| `tiles.css`                     | Tiles of one height                                                              |
| `time-chart.css`                | Time chart                                                                       |
| `time-field.css`                | A field for a time of day                                                        |
| `toast.css`                     | Toast                                                                            |
| `toggle-button.css`             | Toggle button                                                                    |
| `touch-target.css`              | Touch target                                                                     |
| `transfer.css`                  | A transfer with its speed and the time left                                      |
| `tree-reorder-split.css`        | Tree, reorder and split pane                                                     |
| `typed-confirmation.css`        | Typed confirmation                                                               |
| `typed-tile-name.css`           | The typed part of a tile's name                                                  |
| `unsaved-bar.css`               | Unsaved-changes bar                                                              |
| `upload-wizard.css`             | Upload and wizard                                                                |
| `uptime-strip.css`              | Uptime strip                                                                     |
| `used-by.css`                   | "Used by"                                                                        |
| `usual-picker.css`              | A picker with the usual on top                                                   |
| `version-jump.css`              | Version jump chip                                                                |
| `viewer.css`                    | The viewer shell                                                                 |
| `visual-timer.css`              | Visual timer                                                                     |
| `week-agenda/`                  | Week agenda (2 parts)                                                            |
| `weekday-picker.css`            | Weekday picker                                                                   |
| `wheel.css`                     | A wheel that picks                                                               |
| `who-brings.css`                | Who brings it                                                                    |
| `who-can-come.css`              | Who can come                                                                     |

## css/registers/

One folder per theme: `blueprint`, `brutalism`, `cyberpunk`, `dark`, `deco`, `forest`, `formal`, `nostromo`,
`pastel`, `solstice`, `synthwave`, `titanium`. Each has an `index.json`, a `base.css` and parts named after the
component or concern they restyle; list a folder to see them, and read the first line of a part for what it holds.
