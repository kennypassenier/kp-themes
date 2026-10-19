# research/r3r5-1019: run timeline and uses map, six fixes

**Round** `r3r5-<uuid>` (see `demo.html`, 2026-10-19): 6 sections, 6 pairs, formal only. Found by the project threads (almanac 4, kyu 20,
homelab 32 and 35, HTTPSwitchboard line tone/label), confirmed in the code, fixed in the package. They change approved components, so they
come back through the review dialog with a "What changed" text. The pages of this round are bundled into one review afterwards
(`VERDICTS.json` `bundledInto`); there is no `catalogue/pages.js` entry. See CHANGELOG.md "Unreleased".

1. **gantt-names**: lane names and second lines ended in an ellipsis. Fix: the name column is as wide as the longest name (at most 40 % and
   14 rem), names wrap, the first line stands on the middle of the lane's first row (css/components.css).
2. **gantt-zone**: a lane's stretch ran behind the count plate of a crowded mark. Fix: it stands on the foot of the lane's first row.
3. **gantt-frame**: the frame cut a lane at its edge. Fix: the viewport holds whole lanes, a scroll rests on a lane, the height is measured
   again when the width changes (js/gantt.js, css/components.css).
4. **gantt-rules**: the quarter-hour rules showed through a queued bar's words. Fix: the hollow bar stands on the card's ground.
5. **uses-labels**: row names of the uses map ended in an ellipsis. Fix: the label column fits its longest name, names wrap, columns are never
   narrower than their header's longest word (css/components.css).
6. **uses-line**: a line can carry a tone and a label (js/uses-map.js, css/components.css).

**Generated** by `node research/r3r5-1019/build.mjs` (edit the builder, never the page).
