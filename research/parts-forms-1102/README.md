# research/parts-forms-1102: chip filter, add row, unsaved counts, chip menus, run notes

**Decided (2026-11-02 12:26 UTC):** Kenny approved this demo in formal. Recorded in `VERDICTS.json`; the page is not offered again.

The five form parts Kenny approved on 2026-11-02 00:41, built from the apps' requests (`~/Projects/kp-gaps/almanac.md` 4, 6, 11;
`kitchen.md` the inline add row and the row label; `medicine-cabinet.md` 23, 24, 30). One review page, formal only, one section per
part, each on its app's own shapes (names, counts and values are mock):

| Section           | Part                                                                  | Controls                               |
| ----------------- | --------------------------------------------------------------------- | -------------------------------------- |
| `chip-filter`     | `data-kp-filter-for` chips over Almanac's deliveries, exact counts    | rows, mode, width                      |
| `add-row`         | `data-kp-addrow` over Kitchen's meals and as Medicine Cabinet's line; the error icon; `data-kp-row-label` | page answers, width |
| `unsaved-adapter` | `data-kp-track-value` on chips, a row editor and weekday pickers; Leave through a router | width                  |
| `segmented-menu`  | `.kp-segmented__menu` on Medicine Cabinet's categories, rename in place | page answers, state, width           |
| `run-notes`       | `{ at, note }` on the next tries; `tries` on Almanac's timeline lanes | notes, width                           |

**Generated** by `node research/parts-forms-1102/build.mjs` from `sections.mjs` and `markup.mjs` (edit those, never the page);
`demo.js` and `data.js` fill and wire it.
