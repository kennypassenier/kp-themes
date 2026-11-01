# research/ux-parts-1101: seven parts from the app review

The app review of 2026-11-01 (`~/Projects/ux-review/kp-themes.md` and `kp-themes-components.md`, reviewers A and B over kyu,
Almanac, homelab, http-switchboard, Medicine Cabinet and Kitchen) found seven things the package lacked. Kenny's answers: three
options whose default this demo sets ("Als optie, demo kiest"), four parts to build ("Bouwen, met demo"):

| Section             | Item                       | Part or option                                                                                                  |
| ------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `chips-narrow`      | chips-narrow, option       | `data-kp-segmented-fit="tracks"` (`flow` default), `data-kp-segmented-fold-at` (30rem), the fold menu          |
| `tri-state-chip`    | tri-state-chip, build      | `data-kp-segmented-tri-look="word"` (`mark` default), `data-kp-segmented-tags`, `+` / `-` keys                  |
| `popover-form`      | popover-form, build        | `js/popover-form.js`, `data-kp-popover-form`, `kp-popover-form-accept` with `waitUntil`                         |
| `empty-ghost-lines` | empty-ghost-lines, option  | `data-kp-empty-lines="off"` (`on` default)                                                                      |
| `auto-refresh-form` | auto-refresh-form, option  | `data-kp-refresh-line="off"` (`on` default) with `data-kp-look="menu"`                                         |
| `date-nav`          | date-nav, build            | `js/date-nav.js`, `data-kp-date-nav` (`month`, `week`, `day`), `-for`, `data-kp-calendar-nav="off"`             |
| `row-undo-delete`   | row-undo-delete, build     | `js/row-undo.js`, `data-kp-row-delete`, `kp-row-delete-commit` with `waitUntil`, `deleteRowWithUndo`           |

**Round 1** (seven sections, formal only): each on its app's own data (Medicine Cabinet's Overview filters, cabinet and stock
table; Kitchen's wheel filters; kyu's dead letters and Topics header; Almanac's Status with its deliveries and syncs). The names,
counts, days and runs are mock. The four option sections (chips-narrow, tri-state-chip, empty-ghost-lines, auto-refresh-form) show
the approved look and the new one under each other and ask only which is the default; the approved look stays the default until
Kenny's verdict. Every section has the stage at a phone's 390 px; the date navigation has the calendar's and the week's states;
the popover form and Delete with Undo have a save that fails.

Found while building, not fixed here (belongs to the data table): an empty-from-start data table reads its held height back from
its own plate, so the plate grew to `--kp-footprint-max` (48rem) at 1280 and swung 2 px a frame at 390; the page sets
`--kp-footprint-max: 0px` and `--kp-stateplate-floor: 14rem` on its frames.

**Generated** by `node research/ux-parts-1101/build.mjs` (edit the builder, sections.mjs or markup.mjs, never the page).
