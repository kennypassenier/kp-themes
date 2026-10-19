# research/heat-deplist-1019: heat grid names and axis, dependency list status

Round `heatdeplist-<uuid>` (see `demo.html`, 2026-10-19): 3 sections, 3 pairs (formal). Found by the homelab thread (gaps 31, 47, 56), confirmed
in the code, fixed in the package. They change approved components, so they come back through the review dialog with a "What changed" text.
The page is bundled into `round-4-1019` (`VERDICTS.json`), so it is not offered on its own and has no catalogue entry. See CHANGELOG.md "Unreleased".

1. **heat-label**: a row name broke inside a word at 390 px ("PAPERLE" / "SS"). Fix: the name column is at least as wide as the longest word (css/components.css).
2. **heat-axis**: `every` was ignored beside `minor`, and a minor name stayed in the DOM drawn invisible. Fix: `every` counts the unmarked columns; a minor name is an aria-label, not text (js/heat.js, css/components.css).
3. **deplist-state**: Running / Stopped / Unknown badges ended on different edges. Fix: one status column, every badge the column's width (css/components.css).

**Generated** by `node research/heat-deplist-1019/build.mjs` (edit the builder, never the page).
