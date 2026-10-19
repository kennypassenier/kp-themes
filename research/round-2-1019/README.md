# research/round-2-1019: fixes from the project threads, round 2

**Decided (2026-10-19 11:22):** Kenny approved every pair. Recorded in `VERDICTS.json`; the page is not offered again.

Round `round-2-1019-382869d9-92cf-437d-81cf-5098f9924499` (2026-10-19): 19 sections, 19 pairs, formal only (none of the faults depends on the theme).

Four package-fix demos in ONE review page (Kenny, 2026-10-19 02:38: "als ze van hetzelfde project komen kan je ze bundelen tot 25 items
groot"). **Generated** by `node research/round-2-1019/build.mjs`; edit the source demos, never this page. The four source folders stay as the
sources the page is built from and are no longer on the Agenda (`"bundledInto": "round-2-1019"` in their `VERDICTS.json`); the page reads their
`demo.html` for the sections and loads their `demo.js` and `page.css` as they are. Sections are found by depth, because a section may hold a
nested `<section>` (a timeline, a pipeline).

| Topic (source) | Sections |
| --- | --- |
| Six components on a shared line ([align-pkg-1019](../align-pkg-1019/)) | `feed-line`, `action-lead`, `problems-cols`, `stackbar-legend`, `shortcuts-ends`, `week-label` |
| Calendar and pipeline when empty or failed ([r1r2-1019](../r1r2-1019/)) | `calendar-states`, `pipeline-states` |
| Run timeline and uses map ([r3r5-1019](../r3r5-1019/)) | `gantt-names`, `gantt-zone`, `gantt-frame`, `gantt-rules`, `uses-labels`, `uses-line` |
| Data table and disabled reasons ([b3b4-1019](../b3b4-1019/)) | `table-removed-rows`, `table-held-row`, `table-date-pills`, `table-expand-single`, `reason-columns` |

Each section keeps its controls, its script, its page CSS and its "What changed since you approved it" text. At most 25 items; more would be
split into round-2-1019 and round-2b-1019 by topic.

`VERDICTS.json` holds no rounds yet. When Kenny answers, record his answer there before touching the page; the page then takes a fresh round id.
