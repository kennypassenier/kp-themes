# research/almanac-journal: Almanac's status page, Journal and Sources sections, on kp-themes 11.0.0

Formal only (`data-review-themes="formal"`), 4 sections, 4 pairs, two topics. Judges the adoption map rows "Status page, Journal section" and
"Status page, Sources section" (almanac/docs/KP_THEMES_11_ADOPTION.md).

| Section | What it judges | Choice set (default first) |
| --- | --- | --- |
| journal-glance | KPI strip with `data-kp-tick`, two `.kp-health` dots, `.kp-stackbar` of outcomes | outcome bar: legend (default), compact |
| journal-deliveries | `kp-datatable` (When `.kp-ago`, Source `.kp-tag`, Result badge), expandable error in `.kp-code-block`, `.kp-segmented--chips` filter with exact counts, loading/empty/failed card states | rows open: one at a time (default), many |
| journal-live | `.kp-refresh` chooser with its freshness line, `.kp-connection` banner, a delivery arriving in place, Simulate buttons | refresh chooser: menu (default), segmented |
| sources | `.kp-statuslist--rows` vs `.kp-entity-grid`, flash button `data-kp-post` with toast of the count | list: rows (default), cards |

**Real:** version 4.1.7, 3 accepted, 3 delivered, 0 failed, 0 pending, journal "readable; nothing pending", store "writable", the two calendar names.
**Mock (labelled "Sample data" on the page):** every delivery row and its title, the created/updated split, the failed rows and their errors,
the source names other than home-assistant and their calendar mapping, the warning on claude-sessions, the reload (a stand-in `fetch`
answers `/sources/reload`), and everything the Simulate buttons do.
