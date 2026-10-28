# research/wishes-1028: the eleven wishes of cycle 1026, built in the package

Kenny chose these on 2026-10-28 21:08 from the open-item inventory (`~/Projects/kp-gaps/CYCLE-1026.md`); each is an option or a part of the package on
branch `theme/fixes-1026`, one bundled review page, formal only (DEMO_RULES ch. 6: a new demo starts in formal; the other themes follow after the verdict).
Round `wishes-1028-9e4dacdf-6533-4420-9408-50812b09704c`: 11 sections, 11 pairs.

Everything is opt-in or invisible to approved looks except two, which say so on the page and in the CHANGELOG: `attachForms` no longer lets the browser submit a
valid form (`data-kp-form-native-submit` brings it back), and a run timeline narrower than 32rem scrolls inside its own frame (`--kp-gantt-min-width`,
`data-kp-gantt-scroll="off"`).

| Topic | Sections (gap) |
| --- | --- |
| Data tables | pill-tbody (almanac 9), filter-field (homelab 136) |
| Code block | code-toml (almanac 17) |
| Refresh | refresh-title (almanac 21) |
| Forms and keeping changes | secret-input (chassis-rs 1), unsaved-storage (chassis-rs 20), form-submit (Kitchen 5) |
| Run timeline | gantt-legend (Kitchen 1), gantt-rest (Kitchen 2), gantt-phone (Kitchen 3) |
| Cook mode | steps-getter (Kitchen 4) |

The data is the apps' own, with mock times and counts: Almanac's deliveries, mapping profile and calendars, homelab's stacks, Kitchen's dishes and cooking steps.
The two gantts that need a window hold a fixed window around the real clock (50 minutes back, 40 ahead); a running bar is live by nature.

**Generated** by `node research/wishes-1028/build.mjs` (edit the builder, never the page).
