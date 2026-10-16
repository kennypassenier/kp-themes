# Heat grid, matrix and a bar in a table cell

Kenny's rule: a consumer draws nothing itself. The admin dashboard still drew three grids because kp-themes 10.1.1 lacked them. Demo: [`demo.html`](demo.html), reviewed in formal first (Kenny's standing rule for a new component); the other fifteen registers carry a draft block until formal is approved.

| Gap                 | What the dashboard did                                                                                              | What the package now offers                                                                                          | Build cost | Recommendation |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| Coverage heatmap    | `bk-heat` in `pages/backups.js`: a grid of buttons, a label column, an axis, a fleet row, hand-written roving focus | `.kp-heat`, `setHeat()`, tones of the month heatmap, summary row, picked column, hover card detail, skeleton loading | large      | Adopt          |
| Reachability matrix | `fw-mx` in `pages/firewall.js`: sticky-less grid, dim-others, pinned cell                                           | `.kp-matrix`, `setMatrix()`, sticky headers, scroll box, glyph and word per state, lit names                         | large      | Adopt          |
| Bar in a table cell | `mp-caps` / `mp-growth` in `pages/fleetview.js` plus a hidden `data-kp-edit-value` span for sorting                 | `.kp-bar-cell` (the meter and its figure) and `td data-kp-sort-value` in the data table                              | small      | Adopt          |

## Decisions to judge in the demo

- The heat tones are fills in the tone's ink (not the calendar's text plates), because a tile holds no text; a state also has a pattern (stripes, rules, dashes, hatching).
- The summary row fills from the bottom by share; the dashboard did the same.
- The column axis names every third column, the rest stay for a screen reader.
- The matrix dims what a lit name does not touch to 40 % (`--kp-matrix-dim`); the dimmed cells are meant to recede, not to be read.
- `data-kp-sort-value` sorts and range-filters; search and choice filters keep reading the shown text.

Not matched: the dashboard's hover detail was a page callback; here it is the hover card (`tip`, or a `fill` the page gives `attachHoverCards`). The dashboard's Page Up / Page Down moved its own window; here they are the event `kp-heat-page` and the page moves it.
