# research/heatstates-1102: the heat grid on a phone, and its loading footprint

One review page, formal only, one section per visible change of batch `heatstates-1102` (02/11/2026):

| Section       | Asked by                                                     | Change                                                                                  | Controls                       |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------ |
| `heat-days`   | Habits gap of 01/11/2026, "heat grid cells on a phone"        | a tap on a row whose cells are smaller than a fingertip opens that row's list of days   | Opened, When (auto/always/off), width |
| `heat-states` | the heat grid's state items (kyu 11, 36; homelab 28)          | a loading grid keeps its loaded height (the waiting names stay inside their rows)       | State, width                   |

The grid is the Habits app's counters history (`~/Projects/habits/web/js/features/counters/history.js`), its own spec shape with
each column's `full` name added; the counters, counts and dates are mock (`data.js`, fixed dates, no clock). A touch screen's tap is
shown with the Opened control (`openHeatDays`), because a mouse is not a finger; Always lets a mouse open a row.

## Measured (Firefox, 2026-11-02)

- Row tap, touch at 390 (`hasTouch`, `locator.tap()`): 120 cells of 4.3 x 22 px, all under 44 px. Before: the tap picked one cell.
  After: the list opened whole on screen (320 x 407 px, raised over the card's scroller), 30 days, every day 44 px high, names and
  values each starting on one x; choosing a day picked its column and gave the focus back to its cell. With a mouse at 1280 (`auto`)
  a click still picks the cell and opens nothing.
- Loading height, four rows by 30 days, 12 themes at 1280 and 390: formal 134 → 146 px and pastel 134 → 148 px before, 134 → 134
  after; the other ten 134 → 134 before and after (solstice's loaded names are 1 px taller, 136 → 134, which js/footprint.js holds).
- Unchanged and not asked again: the heat grid's empty and failed plates (192 px, the 12rem floor, centred, Retry 36 px = a normal
  button), the code view's (plate 240 px in the 279 px block under its head, Retry 36 px) and the progress bar's failed plate
  (Retry 36 px; a one-line bar's row grows to hold it, as documented in js/progressbar.js).

**Generated** by `node research/heatstates-1102/build.mjs` from `sections.mjs` and `markup.mjs` (edit those, never the page);
`demo.js` and `data.js` fill and wire it.
