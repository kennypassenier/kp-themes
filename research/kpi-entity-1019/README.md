# research/kpi-entity-1019: key-figure names and entity-card actions

Round `kpientity-<uuid>` (see `demo.html`, 2026-10-19): 4 sections, 4 pairs (formal). Bundled into `round-4-1019` (`VERDICTS.json`), not offered alone.
Found by the project threads (almanac 23, kyu 14, http-switchboard 33 and BACKLOG Round SW), confirmed in the code, fixed in the package.
They change approved components, so they come back through the review dialog with a "What changed" text. See CHANGELOG.md "Unreleased".

1. **kpi-label-hint**: "Delivered" broke into DEL / IVE / RED beside a pressable tile's hint. Fix: the label track keeps its longest word, the hint's words wrap (css/components.css).
2. **kpi-label-note**: a wrapped note began its line with a stray dot. Fix: the dot hangs in the gap before the note and is clipped at the label's start edge.
3. **entity-actions**: the same action was another width on every card. Fix: equal `minmax(0, 1fr)` tracks; a button whose word does not fit folds into More for the grid (js/entity-card.js).
4. **entity-options**: bar tones `success` and `neutral`; the empty plate's `action: 'none'`, `data-kp-entity-empty-action`, `onAction`, and `setEntityGrid(grid, [], empty)`.

**Generated** by `node research/kpi-entity-1019/build.mjs` (edit the builder, never the page).
