# research/state-plates-1019: failed, empty and loading states on one plate

**Decided (2026-10-19 18:55):** the seven other sections were approved in round 1 and the network graph's loading, rejected three times, is fixed directly in the package as the twelve loading animations Kenny approved on 2026-10-06 in research/character-graph (`css/<theme>-register.css`, `js/graph.js`); approved items are not demoed again. Recorded in `VERDICTS.json`; the page is not offered again.

**Round** `state-plates-0f2626d7-9b76-45d9-abc0-088f54516acd` (2026-10-19): 8 sections, 8 pairs (formal only: every fix is the theme's existing
state plate and busy card, so the other themes follow). They change components Kenny had approved, so they come back through the review dialog
with a "What changed since you approved it" text per section (DEMO_RULES ch. 7 and 9). Fixes are in the package (`css/components.css`, `js/`),
bundled as one review page (Kenny, 2026-10-19: up to 25 items per page).

The rule they enforce (docs/RULES.md, 2026-10-16 and 2026-10-17): failed, empty and loading states fill the component's footprint, prominent and
centred at heading size, with a normal-size Retry, and the busy card sits centred over the whole data component. One shared mechanism, no copies:
`hostStatePlate()` in js/state-plate.js (the plate, `art`, the Retry as `kp-<component>-retry` on the host), js/footprint.js (the loaded height),
js/busy-card.js (the card).

1. **graph-states** (kyu 1): loading was words over the ghost network; empty and failed were a grey line with no plate and no Retry. Now the busy card
   over the whole picture and the plate over the whole picture (`kp-graph-retry`). The loaded picture is untouched (DEMO_RULES: the network graph
   changes in no theme).
2. **table-states** (kyu 6 and 10, audhd 5): `fail()` drew a small strip above rows that stayed drawn, and the empty slot sat under the drawn table.
   Now the rows are covered (kept in the document) and the slot is the plate at the table's measured height.
3. **heat-states** (kyu 11): empty and error were one word in a 6 rem gap, no Retry, no art. Now the plate (`message`, `text`, `art`) with Retry.
4. **matrix-states** (http-switchboard 4; the grid view as heat): the lines view's busy card was centred over the skeleton rows, not the footprint.
5. **gantt-states** and 6. **week-states** (homelab 28): empty and failed were small words over the plot. Now the plate over the plot or the agenda.
6. **uptime-group** (http-switchboard 10): one busy card per strip; now one over a group of strips that load together.
7. **card-states** (http-switchboard 17, audhd 12 and 19): the empty and failed notes carry `.kp-stateplate`, the title at heading size, `art`.

**Generated** by `node research/state-plates-1019/build.mjs` (edit the builder, never the page).
