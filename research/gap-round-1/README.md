# research/gap-round-1: new components for the homelab dashboard, round 1

**Decided (2026-10-19 06:43):** Kenny approved every pair. Recorded in `VERDICTS.json`; the page is not offered again.

Round `gap-round-1-a0038e7c-8f87-477a-846d-660f15c47ae8` (2026-10-19): 21 sections, 21 pairs, formal only (a new component is demoed in
formal first; the other eleven themes come after the verdict).

Five demos of the homelab admin dashboard's gap report in ONE review page (Kenny, 2026-10-19 02:38: "als ze van hetzelfde project komen
kan je ze bundelen tot 25 items groot, dan gaat het proces vlotter"). **Generated** by `node research/gap-round-1/build.mjs`; edit the
source demos, never this page. The five source folders stay as the sources the page is built from and are no longer on the Agenda; the
page reads their `demo.html` for the sections and loads their `demo.js` and `page.css` as they are, one script per source demo.

| Topic (source) | Sections |
| --- | --- |
| The live log viewer ([gap-log-viewer](../gap-log-viewer/)) | `ring`, `find`, `look`, `log-states` |
| A diff of several files ([gap-diff-view](../gap-diff-view/)) | `diff-files`, `diff-context`, `diff-words`, `diff-states`, `diff-long` |
| The activity feed ([gap-activity-feed](../gap-activity-feed/)) | `feed-days`, `feed-row-options`, `feed-rows-open`, `feed-earlier`, `feed-narrow` |
| Entity card: trend line and app tile ([gap-entity-tiles](../gap-entity-tiles/)) | `trend`, `tile`, `tile-states` |
| A count on a tab, arrow keys over tiles, the heat grid legend ([gap-tab-count](../gap-tab-count/)) | `tab-count`, `tile-keys`, `heat-legend`, `heat-calm` |

The builder renames only the two item ids that two sources both used (`states` became `log-states` and `tile-states`) and wraps each
source's sections in a div carrying the source's own page class, so its page rules apply as before. Each section keeps its controls
and its script. At most 25 items; more would be split in two pages by topic.

`VERDICTS.json` holds no rounds yet. When Kenny answers, record his answer there before touching the page; the page then takes a fresh
round id.
