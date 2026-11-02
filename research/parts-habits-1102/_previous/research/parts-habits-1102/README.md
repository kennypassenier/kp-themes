# research/parts-habits-1102: five parts for the Habits todo app

Kenny approved five new parts on 2026-11-02 00:41 from the Habits todo app's requests of 01/11/2026 (`~/Projects/kp-gaps/habits.md`),
each opt-in and built from the package's own parts:

| Section         | Part                                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `dayline`       | `js/dayline.js`, `.kp-dayline[data-kp-dayline]`: one day top to bottom, lanes, read-only events, all-day strip, now line, moves, drops |
| `swipe-row`     | `js/swipe.js`, `data-kp-swipe` with `-start` / `-end`: touch swipe to a plate in the action's tone, `kp-swipe`              |
| `chord-keys`    | `js/keys.js` `setKeys` with `[["O", "T"], what, { chord: true }]`: the caps with "then" between them                       |
| `settled-row`   | `js/settled.js`, `data-kp-settled="Deleted"`: a row that left keeps its place, quiet and inert, until the list is left      |
| `swatch-picker` | `js/swatches.js`, `.kp-swatches[data-kp-swatches]`, `setSwatches`: the twelve `--kp-cat-N` colours as a grid of toggles    |

**Round 1** is formal only (DEMO_RULES ch. 6), one section per part, on the app's own shapes: Today's timeline with its calendar events
and the tasks without a time, Today's list, the overdue banner, the Inbox and the project editor. The clock is frozen at 10:40
(`data-kp-dayline-now`); the swipe section sets `data-kp-swipe-pointers="any"` so a mouse can show what a finger does. Titles, times,
projects and events are mock. Only the day timeline loads data, so only it carries Loading, Empty and Failed.

**Generated** by `node research/parts-habits-1102/build.mjs` (edit the builder, sections.mjs, data.js or the demo scripts, never the page).
measure-gaps (formal, 1280 and 390) and check-kit print clear.
