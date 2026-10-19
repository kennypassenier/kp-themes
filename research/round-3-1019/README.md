# research/round-3-1019: fixes from the project threads, round 3

Round id is in `demo.html` (2026-10-19): 16 sections, 16 pairs, formal only (none of the changes depends on the theme).

Four demos in ONE review page (at most 25 items, as in round 2). **Generated** by `node research/round-3-1019/build.mjs`; edit the source demos, never this page. The four source folders stay as the sources and are no longer on the Agenda (`"bundledInto": "round-3-1019"` in their `VERDICTS.json`); the page reads their `demo.html` for the sections and loads their `demo.js` and `page.css` as they are.

| Topic (source) | Sections |
| --- | --- |
| States and widths ([r6r8-1019](../r6r8-1019/)) | `snooze-width`, `copyable-kv`, `checklist-failed`, `timers-states` |
| Options ([audhd-opts-1019](../audhd-opts-1019/)) | `action-size`, `freshness-tone`, `sentence-computed` |
| Hover card and wheel ([hover-wheel-1019](../hover-wheel-1019/)) | `hovercard-touch`, `wheel-kiosk`, `wheel-resting`, `wheel-answer` |
| Form grid ([formgrid-notes-1019](../formgrid-notes-1019/)) | `form-gap`, `json-action`, `refresh-label`, `check-segmented`, `check-buttons` |

`VERDICTS.json` holds no rounds yet. When Kenny answers, record his answer there before touching the page; the page then takes a fresh round id.
