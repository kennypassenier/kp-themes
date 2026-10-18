# research/kyu-11-subscription: kyu's Subscription page on kp-themes 11.0.0

Part of the kyu review demo (Kenny, 2026-10-19). It asks how `/t/notify.kenny/dashboard/subs/desktop` looks with the new components used to the full. Formal only, mock data in kyu's real shape (nothing is read from a server). Sections marked New need kyu backend work.

| Section | Components and options | Choice sets (default) |
| --- | --- | --- |
| The page header | `.kp-page-header` heading line, `lede`, `idmark` + `idmarkColours`, state badge, `freshness` (`stale-after`), breadcrumb | The mark: plate, glyph, pattern (plate) |
| The policy | `.kp-kv` with "(default)" asides inside `.kp-card` with its four states (no Empty: a policy always exists) | Grid layout: lines, stack, columns (lines) |
| Gauges | `bullets` (age against lease, attempts against max, tones, ▸ past the end, four states), `progressbar` (value, indeterminate, done) | Bar size sm/md/lg (md); row order worst/none (worst) |
| The backlog (New: bulk endpoint) | `datatable` (multi-sort, column menu, choice filter, cards, empty `art`), `code` cell (pretty/raw, fold, binary, truncated, empty), `row-select`, `selection-bar` (matching 312), `undo-toast` (defer, refusal), row actions | Bar place (sticky-top); bar names (names); undo clock (ring) |
| Attempts timeline (New: attempt history) | `gantt` runs, points (kinds), zones (lease band), ranges, states | Lease band shown/left out (shown) |
| Attempts as requests (New) | `request-inspector`, masked token, copy modes, four states | Open: failed/none/first (failed); secrets in copy (masked) |
| 90 days (New: daily stats) | `uptime` with `setStrings` words (delivered/dead), quick info or link, fit or scroll, four states | Press: info/link (info); narrow: fit/scroll (fit) |

Run: `python3 -m http.server 8815 --directory <worktree>`, then `check-kit.mjs` and `measure-gaps.mjs` on `research/kyu-11-subscription/demo.html`.
