# research/almanac-calendars: Almanac's redesigned Calendars page on kp-themes 11.0.0

Formal only (`data-review-themes="formal"`), 7 sections, 7 pairs, built from the package's parts for the Almanac adoption map
(`~/Projects/almanac/docs/KP_THEMES_11_ADOPTION.md`, section "Calendars page", plus feat-ui-1 the uses map).

| Topic | Section | Judges |
| --- | --- | --- |
| page | page-top | `.kp-page-header` with primary action and `data-kp-menu-button` overflow; `.kp-kpis` toggle counts that filter the rows they count, plus a sample trend tile; loading, nothing yet, failed plate |
| page | attention | `.kp-attention` via `setAttention`, a fix action each, a refused action as a toast |
| calendars | calendars-table | `kp-datatable` (cards, remembered multi-sort), id as `kp-code--cell`, Used by as `kp-tag` with hover cards, fixed delete column with a disabled reason; four states |
| calendars | calendar-delete | typed confirmation (`buildTypeConfirm`) with what is lost, server accepts or refuses |
| dialog | new-calendar | `kp-dialog` with `kp-dialog__section`s, `data-kp-form` validation (blank name refused), busy, refused, owner not set |
| profiles | profile-files | `kp-problems` (what, why, remedy, delete) plus served files with `kp-health`; card states |
| uses | uses-map | feat-ui-1: lines map (`kp-matrix`, `data-kp-view="lines"`) or network graph (`kp-graph`); choice set sets the default (lines) |

Mock: every calendar id, every source except home-assistant, token and use figures, hover-card times, the three profile files that
are not served, and the server (it accepts or refuses on request). Real: version 4.1.7 context, three calendars, the home-assistant profile.
Each component says "Sample data" under itself. The count tiles are toggles; this review shows one
section at a time, so a line under the strip says which rows would be shown.

Generated: `node research/almanac-calendars/build.mjs` writes `demo.html` from `data.js`; edit the builder or the data, never the page.
