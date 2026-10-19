# research/kyu-11-topics: kyu's Topics page on kp-themes 11.0.0

**Decided (2026-10-19 02:38):** Kenny approved every pair. Defaults kept. Recorded in `VERDICTS.json`; the part is not offered again.

Part of the kyu review demo (adoption map `kyu/docs/KP_THEMES_11_ADOPTION.md`). It asks how kyu's `/topics` page looks when it is built from the
11.0.0 components instead of the hand-written table and snippet. Formal only. All data is mock: five topics (`notify.kenny`, `ha.events`,
`almanac.sync`, `jobtracker.mail`, `newsflash.items`), five subscriptions, the dead letter `{"title":"eerste echte bericht","body":"hello from HA"}`
on notify.kenny/desktop, and a stand-in for kyu (`demo.js` wraps `fetch`) that answers the automatic refresh with moved numbers.

| Section (topic) | Components | Choice sets (default first) |
| --- | --- | --- |
| Page header, lede and headline (page) | `.kp-page-header`, `lede`, `effects` headline reveal, `freshness` | A long lede: always in full / folds behind More; Headline reveal: once per session / every load / never |
| Key figures, attention and the topics table (page) | `kpi` toggle tiles (Backlog and Dead filter), `attention`, `datatable` (sort, multi-sort, search, choice filter on Status, range filters, column menu, cards on a phone, remembered), `idmark` + `idmarkColours`, `barcell`, `stackbar` per topic and one for the hub (with legend), `freshness` with `stale-after`, `hovercard`, `auto-refresh` in region mode with `tick` and `update`, `actions`, `.kp-empty` + `art` (none, nomatch, done, error), `anchors` on rows | Sorting on more than one column: Shift + click / plain click; Filters: one panel / + Add filter; Quiet after: 24 h / 6 h / 1 h; Refresh control: segmented / menu; While you read the table: waits / keeps refreshing |
| Start a topic: the command to copy (page) | `command` (bash, copy, where), `anchors` on the heading | A long line: wraps / scrolls |
| New: heat map of topic by hour (server) | `heat`, `hovercard`, `idmark` colours | none (Published / Dead letters is a state control) |
| New: key figures with their last 24 hours (server) | `kpi` trend tiles, `chart` spark (`setTrendData`) | none |

State controls stand at each component (filled, loading, empty or no history, could not read; hub busy / all quiet; width full / phone 390).
Sections 4 and 5 are marked **New**: kyu would need hourly per-topic counts (heat) and a sampled 24-hour history of its totals (trends).
