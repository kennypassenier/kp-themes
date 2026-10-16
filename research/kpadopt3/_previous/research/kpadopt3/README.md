# research/kpadopt3: round 3 of the dashboard adoption, six opt-in options

**Decided (2026-10-16 15:21):** Kenny approved all six options in formal in the review dialog (week-upcoming on the condition that its loading is phone-only, which it is). Recorded in `VERDICTS.json`; the demo is not offered again.

The admin dashboard (homelab `admin/web`) still drew six things itself because kp-themes lacked them. Each is now an
opt-in option of a component Kenny already approved; without the new attribute or field nothing changes. One page,
[`demo.html`](demo.html), six sections, **formal only** (`data-review-themes="formal"`), one review topic (`kpadopt3`).

- Package: every `kp-` class and every script under `js/`. Mock: the sample data, the frames and the width slider, the
  history box under the timeline, the readouts and the buttons that drive a section (`demo.js`, `demo.css`).

| Part                        | Dashboard source                                   | What the package offers now                                                                                                       | Cost   | Recommendation |
| --------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------- |
| Separator in the nav bar    | `.nx-nav-sep` (main.js)                            | `li.kp-nav__sep`; the fold (`js/nav-fold.js`, `planSeparators()`) keeps it only between shown links, the More menu's own rule     | small  | Adopt          |
| Choice filter value         | `filterCell` + hidden `data-kp-edit-value` on Host | `td[data-kp-filter-value]` (js/datatable.js), as `td[data-kp-sort-value]` is for sorting; on a header it stays the opening filter | small  | Adopt          |
| Run timeline: day, legend   | activity.js before the swap (274114e9)             | `data-kp-gantt-days`, `kp-gantt-select` `source: 'day'` + `day`; `GanttRun.series`, `setGanttLegend()`                            | medium | Adopt          |
| Week agenda on a phone      | `agenda()` "next 8" list (schedules.js)            | `data-kp-week-upcoming="8"`, `-label`, `-empty` (js/week.js), `.kp-week__upcoming`, `.kp-week__next`                              | medium | Adopt          |
| Facet swatch with a pattern | `stackMark` / `markCells` (ui.js)                  | `FacetItem.pattern`, `data-kp-facet-pattern`, `identityCells()` (js/facets.js), `.kp-facet__pattern`                              | small  | Adopt          |
| Heat grid: to the latest    | Home key on the Backups heat (backups.js)          | `data-kp-heat-latest="end" \| "start"`: End (Home) also sends `kp-heat-page { direction: 'latest' }`                              | small  | Adopt          |

Every word the options add comes from the dictionary or the page (no new dictionary word: the dictionary is in every
block's digest). Formal's own look: the separator is the docket cut stood upright (G19), a pressed day on the axis is
closed with the double rule and pointing rules the navy rule under it (G15, G7), a series' finished run carries the
ledger's heavy rule on its start edge.
