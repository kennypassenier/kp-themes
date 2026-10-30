# css/ source index

Generated, never hand-edited: `css/components.css`, `css/_rules.css` (the `kp.base` rules, exported as `css/rules`) and
`css/<theme>-register.css` (twelve themes). They are built
by `node gates/generate-css.mjs` (`npm run generate:css`) by joining part files in the order of an `index.json`
manifest. `node gates/generate-css.mjs --check` (inside `npm run gates`) fails when a generated file differs from
its parts, so a hand edit of a generated file is refused. Edit a part, regenerate, commit both.

## How a style is found

- A class `.kp-x` is styled in `css/components/x.css`, or in `css/components/x/…` when the component has several
  parts (`base.css` first, then one file per concern). Names follow the component, not the class prefix, so
  `.kp-nav` lives in `navbar/`, `.kp-sidenav` in `sidenav/`, `.kp-heat` in `heat-grid.css`. When in doubt,
  `grep -rn "\.kp-x" css/components/`.
- The theme look of the same component is in `css/registers/<theme>/x.css` (or `x/…`), under the **same name** as the
  component in `css/components/`: `.kp-datatable` is `components/datatable/` and `registers/<theme>/datatable…`.
  Theme-wide parts have plain names: `properties.css` (the registered `@property` numbers), `tokens`, `base`,
  `signature` and `motion`. A name that holds several parts is a folder (`button/`); one part is a plain file.
- Every part opens with one line, `/* @part: <component>: <what it styles> */`. The generator strips that line, so
  it never reaches the output.
- Every part is whole, valid CSS: complete rules and at-rule blocks, so it can be read and linted on its own
  (`npm run check:css-parse` parses each one). The manifest wraps parts in their `@layer … {` … `}`: it holds the
  exact opening and the closing, and the parts hold what sits inside.
- No hand-written source file may pass 500 lines (`npm run check:file-size`, `gates/file-size.json`).

## How the generated files are built

`css/components/index.json`, `css/rules/index.json` and `css/registers/<theme>/index.json` each list their parts in the fixed output order.
Add a part by creating the file with its `@part` header and adding it to the manifest at the right place; the
generator refuses a part that is not listed, a listed part that is missing and a part without a header. Then run
`npm run generate:css`.

## css/rules/

The base layer every page gets (`@layer kp.base`), joined into `css/_rules.css`; `gates/generate-themes.mjs` then
concatenates that file into `css/themes.css`.

| File             | Styles                                                                   |
| ---------------- | ------------------------------------------------------------------------ |
| `textures.css`   | the page textures every theme lays under its content                     |
| `typography.css` | the typefaces, heading sizes and surface headlines                       |
| `flourishes.css` | the theme flourishes                                                     |
| `page.css`       | the page ground, the theme cross-fade, the focus ring and reduced motion |
| `elements.css`   | links, selection, text elements, surfaces, dividers and rules            |
| `browser.css`    | the browser's own hooks and form validity                                |
| `signatures.css` | one motion signature per theme                                           |

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
| `form-grid/`                    | Form grid (3 parts)                                                              |
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
| `accept-follows.css`            | The line that says why a quantity-following button is off                        |
| `segmented-link.css`            | Chips tied to a field                                                            |
| `attention-more.css`            | The attention band's cap                                                         |
| `badge-run.css`                 | A run of badges that wraps                                                       |
| `datatable-columns.css`         | A table's actions column and card threshold                                      |
| `dialog-widths.css`             | Dialog width steps                                                               |
| `list-row.css`                  | A list of rows with columns that continue                                        |
| `page-header-updated.css`       | The page header's updated line                                                   |
| `quantity-fill.css`             | A quantity that fills its cell                                                   |
| `row-editor.css`                | The repeating row editor                                                         |
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

One folder per theme, with the same layout in every theme. A part is named after the component it styles
(the names of `css/components/` above); a name with several parts is a folder, a name with one part is a file.

- **Inside a component folder** the files are named after the cascade layer they sit in: `register.css`
  (`kp.register`, the theme's look of the component), `signature.css` (`kp.signature`, its motion and character),
  and for a layer that is entered more than once `register-2.css`, `register-3.css`, `signature-2.css` and so
  on. The number is the order in `index.json`, which is the cascade order; it is never a version.
- **Theme-wide names** are `properties.css` (top-level `@property` registrations), `tokens` (the knobs, custom
  properties on the theme root), `base` (rules of no one component: type, hooks, the page), `signature` (the same
  for `kp.signature`) and `motion` (keyframes and `prefers-reduced-motion` blocks of no one component, such as the
  shared opening and leaving of dialogs, drawers and the tour). They become folders in the same way.
- **A part is named for the component that owns most of its lines.** Neighbouring runs of a few lines for other
  components ride along (the part's `@part` line says "also …"): the generated stylesheet has one fixed order, and
  the cascade within a layer depends on it, so a rule cannot move away from its neighbours. `grep -rn "\.kp-x"
  css/registers/<theme>/` finds a class anywhere.
- `index.json` lists the parts in output order, grouped by the `@layer` block they sit in.

### blueprint

Theme-wide: `base/`, `motion/`, `properties.css`, `tokens/`.

Components: `ack-gate.css`, `action-columns.css`, `action-tiles.css`, `alarm.css`, `alert.css`, `auto-refresh.css`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink/`, `code-block.css`, `combobox.css`, `command-block.css`, `compare-slider.css`, `datatable.css`, `dialog/`, `facet-list/`, `focus-steps.css`, `form-field/`, `form-grid.css`, `forms.css`, `graph/`, `identity-mark.css`, `key-figures.css`, `key-value-grid.css`, `kitchen-timers.css`, `log.css`, `menu-button.css`, `meter/`, `month-heatmap/`, `navbar/`, `page-header/`, `pipeline.css`, `popover/`, `progress-spinner-skeleton/`, `question-card.css`, `request-inspector.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `sidenav/`, `small-patterns/`, `state-plate.css`, `state-word.css`, `status-rows.css`, `step-list/`, `switch.css`, `tabbar.css`, `tabs.css`, `time-field.css`, `toast/`, `upload-wizard.css`, `uptime-strip.css`, `visual-timer.css`, `week-agenda.css`, `wheel.css`.

### brutalism

Theme-wide: `base.css`, `motion/`, `properties.css`, `tokens.css`.

Components: `action-columns.css`, `action-tiles.css`, `alarm.css`, `alert.css`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink.css`, `code-block.css`, `command-block.css`, `command-palette.css`, `compare-slider.css`, `countdown.css`, `datatable/`, `dialog/`, `diff.css`, `drawer-tour.css`, `facet-list.css`, `focus-steps.css`, `form-field/`, `form-grid.css`, `forms.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-figure-columns.css`, `key-figures/`, `key-value-grid.css`, `kitchen-timers.css`, `log.css`, `media.css`, `menu-button.css`, `meter.css`, `month-heatmap/`, `navbar/`, `page-header/`, `pipeline.css`, `popover.css`, `progress-spinner-skeleton/`, `quantity.css`, `range-picker.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `showing-data.css`, `sidenav/`, `small-patterns/`, `state-plate.css`, `status-rows/`, `step-list/`, `switch.css`, `tabbar.css`, `table.css`, `tabs.css`, `tiles.css`, `time-chart.css`, `toast/`, `typed-confirmation.css`, `upload-wizard.css`, `uptime-strip.css`, `visual-timer.css`, `week-agenda.css`, `weekday-picker.css`, `wheel.css`.

### cyberpunk

Theme-wide: `base/`, `motion/`, `signature.css`, `tokens/`.

Components: `action-columns.css`, `action-tiles.css`, `alarm/`, `alert.css`, `badge.css`, `breadcrumb-pagination.css`, `bullet-rows/`, `button/`, `card/`, `checklist-sink.css`, `code-block/`, `command-block.css`, `command-palette.css`, `compare-slider.css`, `connection-path.css`, `conversation.css`, `countdown.css`, `dialog.css`, `drawer-tour.css`, `facet-list/`, `focus-steps.css`, `form-field/`, `forms.css`, `gallery.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-figures/`, `kitchen-timers.css`, `log.css`, `media.css`, `menu-button/`, `meter/`, `month-heatmap/`, `navbar/`, `page-header/`, `pipeline.css`, `progress-spinner-skeleton/`, `quote-card.css`, `range-picker.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar/`, `showing-data.css`, `sidenav/`, `small-patterns/`, `snooze-picker.css`, `state-plate.css`, `status-rows.css`, `step-list/`, `switch.css`, `tabbar.css`, `table.css`, `time-field.css`, `toast.css`, `tree-reorder-split.css`, `typed-confirmation.css`, `upload-wizard.css`, `uptime-strip.css`, `usual-picker.css`, `visual-timer.css`, `week-agenda.css`, `weekday-picker.css`, `wheel/`.

### dark

Theme-wide: `base.css`, `motion/`, `properties.css`, `signature.css`, `tokens/`.

Components: `action-columns.css`, `action-tiles.css`, `alarm/`, `alert/`, `badge.css`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink.css`, `code-block/`, `combobox.css`, `command-block.css`, `compare-slider.css`, `conversation.css`, `datatable/`, `dialog/`, `facet-list.css`, `focus-steps.css`, `form-field/`, `forms.css`, `gallery.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-figures/`, `kitchen-timers.css`, `menu-button.css`, `meter.css`, `month-heatmap/`, `navbar/`, `page-header/`, `pipeline.css`, `progress-spinner-skeleton/`, `quote-card.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `sidenav/`, `small-patterns/`, `snooze-picker.css`, `state-plate.css`, `state-word/`, `status-rows.css`, `step-list.css`, `switch.css`, `tabbar.css`, `tabs.css`, `time-field.css`, `toast.css`, `typed-confirmation.css`, `upload-wizard.css`, `uptime-strip.css`, `usual-picker.css`, `visual-timer.css`, `week-agenda.css`, `weekday-picker.css`, `wheel.css`.

### deco

Theme-wide: `base.css`, `motion/`, `properties.css`, `tokens/`.

Components: `action-columns.css`, `action-tiles.css`, `alarm.css`, `alert/`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink/`, `code-block.css`, `command-block.css`, `command-palette.css`, `compare-slider.css`, `conversation.css`, `datatable/`, `dialog/`, `facet-list.css`, `focus-steps/`, `form-field/`, `form-grid.css`, `forms.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-figures/`, `key-value-grid.css`, `kitchen-timers.css`, `menu-button.css`, `meter/`, `month-heatmap/`, `navbar/`, `page-header/`, `pipeline.css`, `popover/`, `progress-spinner-skeleton/`, `quantity.css`, `range-picker.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `showing-data.css`, `sidenav.css`, `small-patterns/`, `snooze-picker.css`, `state-plate.css`, `status-rows.css`, `step-list.css`, `switch.css`, `tabbar.css`, `table.css`, `tabs.css`, `toast/`, `typed-confirmation.css`, `upload-wizard.css`, `uptime-strip.css`, `visual-timer.css`, `week-agenda.css`, `wheel.css`.

### forest

Theme-wide: `base.css`, `motion/`, `properties.css`, `tokens/`.

Components: `action-columns.css`, `action-tiles.css`, `alarm/`, `alert.css`, `auto-refresh.css`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink.css`, `code-block/`, `combobox/`, `compare-slider.css`, `datatable.css`, `dialog.css`, `drawer-tour/`, `facet-list.css`, `form-field/`, `forms.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-figures/`, `kitchen-timers.css`, `menu-button/`, `meter.css`, `month-heatmap/`, `navbar/`, `page-header/`, `pipeline.css`, `popover.css`, `progress-spinner-skeleton/`, `question-card.css`, `request-inspector.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `showing-data.css`, `sidenav/`, `small-patterns/`, `snooze-picker.css`, `state-plate.css`, `state-word.css`, `status-rows/`, `step-list.css`, `switch.css`, `tabbar.css`, `tiles.css`, `time-chart/`, `toast/`, `tree-reorder-split/`, `typed-confirmation.css`, `upload-wizard/`, `uptime-strip.css`, `usual-picker.css`, `visual-timer.css`, `weekday-picker.css`, `wheel.css`.

### formal

Theme-wide: `base.css`, `motion.css`, `properties.css`, `signature.css`, `tokens/`.

Components: `ack-gate.css`, `action-tiles/`, `alarm.css`, `alert/`, `badge.css`, `button/`, `card/`, `command-palette/`, `connection-path.css`, `dependency-list.css`, `dialog/`, `drawer-tour.css`, `entity-card.css`, `form-field/`, `graph/`, `heat-grid.css`, `key-figures/`, `kitchen-timers.css`, `menu-button.css`, `meter.css`, `month-heatmap/`, `navbar/`, `page-header.css`, `pipeline.css`, `popover/`, `progress-spinner-skeleton/`, `run-timeline/`, `segmented-toolbar.css`, `showing-data.css`, `sidenav/`, `small-patterns/`, `state-word/`, `step-list/`, `switch.css`, `tabbar.css`, `toast/`, `toggle-button.css`, `transfer.css`, `tree-reorder-split.css`, `upload-wizard.css`, `version-jump.css`, `week-agenda.css`, `wheel.css`.

### nostromo

Theme-wide: `base/`, `motion/`, `properties.css`, `tokens/`.

Components: `action-columns.css`, `action-tiles.css`, `alarm.css`, `alert/`, `breadcrumb-pagination.css`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink.css`, `code-block/`, `compare-slider.css`, `countdown.css`, `dialog/`, `focus-steps.css`, `form-field/`, `form-grid/`, `forms.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-figures/`, `key-value-grid.css`, `kitchen-timers.css`, `master-detail.css`, `meter.css`, `navbar/`, `page-header/`, `pipeline.css`, `progress-spinner-skeleton/`, `quantity.css`, `quote-card.css`, `range-picker.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `sidenav.css`, `slider.css`, `small-patterns/`, `state-plate.css`, `status-rows/`, `step-list.css`, `switch.css`, `tabbar.css`, `table/`, `tabs.css`, `time-chart.css`, `toast/`, `typed-confirmation.css`, `upload-wizard.css`, `uptime-strip.css`, `visual-timer.css`, `week-agenda.css`, `weekday-picker.css`, `wheel.css`, `who-can-come.css`.

### pastel

Theme-wide: `base.css`, `motion/`, `properties/`, `signature.css`, `tokens/`.

Components: `action-columns.css`, `action-tiles.css`, `alarm/`, `alert.css`, `auto-refresh.css`, `badge.css`, `breadcrumb-pagination.css`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink.css`, `code-block.css`, `combobox.css`, `command-block.css`, `command-palette.css`, `compare-slider.css`, `countdown.css`, `datatable.css`, `dialog.css`, `facet-list.css`, `focus-steps.css`, `form-field/`, `forms.css`, `gallery.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-figures.css`, `kitchen-timers/`, `matrix.css`, `menu-button.css`, `meter.css`, `month-heatmap/`, `navbar/`, `page-header/`, `pipeline.css`, `popover/`, `progress-spinner-skeleton/`, `question-card.css`, `quote-card.css`, `request-inspector.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `sidenav/`, `small-patterns/`, `snooze-picker.css`, `state-plate.css`, `status-rows/`, `step-list.css`, `switch.css`, `tabbar.css`, `table.css`, `time-chart/`, `toast/`, `upload-wizard/`, `uptime-strip.css`, `usual-picker.css`, `weekday-picker.css`, `wheel.css`.

### solstice

Theme-wide: `base.css`, `motion/`, `properties.css`, `tokens/`.

Components: `action-columns.css`, `action-tiles.css`, `alarm.css`, `alert/`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink.css`, `code-block.css`, `command-block.css`, `command-palette.css`, `compare-slider.css`, `conversation.css`, `countdown.css`, `dialog/`, `facet-list.css`, `focus-steps.css`, `form-field/`, `form-grid.css`, `forms.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-value-grid.css`, `kitchen-timers.css`, `meter.css`, `month-heatmap.css`, `navbar/`, `page-header/`, `pipeline.css`, `popover.css`, `progress-spinner-skeleton/`, `quantity.css`, `range-picker.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `sidenav/`, `small-patterns/`, `state-plate.css`, `status-rows/`, `step-list.css`, `switch.css`, `tabbar.css`, `toast/`, `tree-reorder-split.css`, `typed-confirmation.css`, `upload-wizard.css`, `uptime-strip.css`, `visual-timer.css`, `week-agenda.css`, `wheel.css`.

### synthwave

Theme-wide: `base/`, `motion/`, `signature.css`, `tokens.css`.

Components: `action-columns.css`, `action-tiles.css`, `alarm.css`, `alert/`, `attention-band.css`, `bullet-rows/`, `button/`, `card/`, `checklist-sink.css`, `code-block/`, `command-block.css`, `command-palette.css`, `compare-slider.css`, `conversation.css`, `countdown.css`, `dialog/`, `facet-list.css`, `focus-steps/`, `form-field/`, `forms.css`, `gallery.css`, `graph/`, `heat-grid.css`, `identity-mark/`, `key-figures/`, `kitchen-timers.css`, `meter.css`, `navbar/`, `page-header/`, `pipeline.css`, `progress-spinner-skeleton/`, `question-card.css`, `quote-card.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar.css`, `showing-data/`, `sidenav/`, `slider.css`, `small-patterns/`, `snooze-picker.css`, `state-plate/`, `state-word.css`, `status-rows.css`, `step-list/`, `switch.css`, `tabbar.css`, `table/`, `tabs.css`, `time-chart/`, `toast/`, `tree-reorder-split.css`, `typed-confirmation.css`, `upload-wizard.css`, `uptime-strip.css`, `usual-picker.css`, `visual-timer.css`, `week-agenda.css`, `wheel.css`.

### titanium

Theme-wide: `base/`, `motion/`, `properties.css`, `tokens/`.

Components: `action-columns.css`, `action-tiles.css`, `alarm.css`, `alert/`, `bullet-rows.css`, `button/`, `card/`, `checklist-sink.css`, `code-block/`, `command-palette.css`, `compare-slider.css`, `countdown.css`, `datatable/`, `dialog/`, `focus-steps.css`, `form-field/`, `form-grid/`, `forms.css`, `graph/`, `heat-grid.css`, `identity-mark.css`, `key-value-grid/`, `kitchen-timers.css`, `meter.css`, `month-heatmap/`, `navbar/`, `page-header/`, `pipeline.css`, `popover/`, `progress-spinner-skeleton/`, `quantity.css`, `range-picker.css`, `request-inspector.css`, `run-timeline/`, `segmented-toolbar/`, `share-bar/`, `sidenav.css`, `slider.css`, `small-patterns/`, `snooze-picker.css`, `state-plate.css`, `status-rows.css`, `step-list.css`, `switch.css`, `tabbar.css`, `table/`, `tabs.css`, `time-field.css`, `toast/`, `typed-confirmation.css`, `upload-wizard.css`, `uptime-strip.css`, `visual-timer.css`, `week-agenda.css`, `weekday-picker.css`, `wheel.css`.
