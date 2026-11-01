# research/ux-fixes-1101: eight UX fixes from the app reviews

**Decided (2026-11-01 23:22):** Kenny approved all eight pairs (formal) in round 1. Recorded in `VERDICTS.json`; the page is not offered again.

Kenny's review of the apps (`~/Projects/ux-review/kp-themes.md`, `kp-themes-components.md`, 2026-11-01) found faults in the package, and he
approved nine fixes. This page shows the eight that change what a reader sees, one section each, formal only, on the apps' own shapes (kyu's
Topics, Medicine Cabinet's rows, http-switchboard's uptime rows; the names, counts, dates and times are mock):

| Section | Change | Control |
| --- | --- | --- |
| `filters` | the data table's Filters open as a popover with a label on every input | Popover (now) / Inline (before), Open / Closed, width |
| `states` | an empty or failed table is only its plate; a pager with one page hides | Rows / Empty / Failed, five a page, width |
| `row-actions` | one primary action and a row menu, also in phone cards (`data-kp-row-actions="menu"`) | Row menu (now) / Stacked (before), width |
| `required` | a required field is red only after it is left or a send is tried | Fresh / After leaving / After Publish |
| `action-list` | the narrow action list: one full-width row, the primary first (before and after) | width |
| `list-head` | the list's column head carries the switch label once | With head (now) / Without (before), width |
| `disabled-reason` | the reason under the button on a touch screen | Mouse / Touch |
| `uptime` | a tap on an uptime row opens the nearest cell's list on a touch screen | Mouse / Touch |

A touch screen's behaviour (`(pointer: coarse)`) is shown with a switch, because a mouse cannot be a finger: the disabled reason has
`data-kp-reason-line="always"`, the uptime strip `data-kp-uptime-open="info"` with `data-kp-uptime-row-tap`. The ninth fix, the review dialog's
"Last: approved · Undo" line, the Agenda's gutter for the Top button and the wrapping side-navigation labels, is in the review tools you are
using now.

**Generated** by `node research/ux-fixes-1101/build.mjs` (edit the sections and parts, never the page).
