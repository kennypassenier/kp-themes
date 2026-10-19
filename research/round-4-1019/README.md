# research/round-4-1019: fixes from the project threads, round 4

Round id is in `demo.html` (2026-10-19): 11 sections, 11 pairs, formal only; `kpi-label-note` and `field-fills` carry a control group (tile kind, field kind) so the variants gate sees the toggle tile and the check and error fields (none of the changes depends on the theme).

Four demos in ONE review page (at most 25 items, as in rounds 2 and 3). **Generated** by `node research/round-4-1019/build.mjs`; edit the source demos, never this page. The four source folders stay as the sources and are no longer on the Agenda (`"bundledInto": "round-4-1019"` in their `VERDICTS.json`); the page reads their `demo.html` for the sections and loads their `demo.js` and `page.css` as they are.

| Topic (source) | Sections |
| --- | --- |
| Heat grid and dependency list ([heat-deplist-1019](../heat-deplist-1019/)) | `heat-label`, `heat-axis`, `deplist-state` |
| Path trace and diff ([trace-diff-1019](../trace-diff-1019/)) | `trace-column`, `diff-line` |
| Key figures and entity card ([kpi-entity-1019](../kpi-entity-1019/)) | `kpi-label-hint`, `kpi-label-note`, `entity-actions`, `entity-options` |
| Form field and problems ([field-problems-1019](../field-problems-1019/)) | `field-fills`, `problems-edges` |

`VERDICTS.json` holds no rounds yet. When Kenny answers, record his answer there before touching the page; the page then takes a fresh round id.
