# research/parts-layout-1102: layout options and four new parts from the apps

Kenny approved these parts and options on 2026-11-02 00:41 (opt-in, default off, formal first). One review page, formal only,
eight sections on the apps' own data (names and counts are mock), each shown with its states and its option switched live:

| Section              | Asked by                                  | What it shows                                                                                         |
| -------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `cards-tracks`       | Almanac 21                                | `data-kp-cards` cards on two tracks (already the default; `spread` the earlier look), checked         |
| `calendar-spread`    | Almanac 21                                | `data-kp-calendar-nav="spread"` (exists since gapform-1019), checked, with the calendar's states      |
| `header-equal`       | Almanac 21                                | `data-kp-header-actions="equal"`, new                                                                 |
| `attention-formgrid` | Almanac 21                                | `data-kp-subgrid` band on the form grid's tracks; the plain band in a form grid now spans the grid    |
| `nav-more`           | Kitchen (chassis-rs 25), Medicine Cabinet 28 | `data-kp-nav-more` / `data-kp-nav-hint` pinned behind More; a menu button that is one of the bar's links |
| `snooze-popover`     | Homelab (UX review 2026-11-01)            | the popover form with a date picker and a time field ("Snooze until")                                 |
| `card-empty`         | Homelab (UX review 2026-11-01)            | `data-kp-empty="compact"`, the one-line empty plate                                                   |
| `coupled-wheels`     | Kitchen 15                                | `data-kp-wheel-follows`, the side dish locked until the main course stops; start press, auto or together |

**Round 2** (2026-11-02, after Kenny's verdict of 01:12): only `nav-more` and `coupled-wheels`, the two sent back; the other six
are approved and left the page (round 1 in VERDICTS.json, its page in `_previous/`).

**Generated** by `node research/parts-layout-1102/build.mjs` (edit the builder, sections.mjs, markup-layout.mjs or markup-parts.mjs,
never the page). demo.js wires the controls and the layout sections, demo-parts.js the four new parts.
