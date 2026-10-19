# research/app-hsb-align: HTTPSwitchboard, everything on the grid

One bundled, layout-only fix demo (Kenny, 2026-10-19: "HOE VAAK MOET IK NOG ZEGGEN OM ALLES DEFTIG VERTICAAL TE ALIGNEN EN GRID TE
GEBRUIKEN IPV LINKS ALIGNEN???"). Formal only (`data-review-themes="formal"`), twelve sections, each one HTTPSwitchboard view on shared
tracks (`.kp-formgrid`, subgrids) with the components, options, defaults and wording of the approved demos
(`app-hsb-health`, `-history`, `-profiles`, `-settings`, `-translate`) and one sentence on screen saying what moved.

The markup follows the real app (`web/*.js`, `web/*.css`, `src/dashboard*.rs` of http-switchboard); the sample data is the approved
demos'. `demo.html` is generated: `node research/app-hsb-align/build.mjs`. `page.css` (`hsa-` classes) only lays the views out.

Held to: `measure-gaps.mjs` (its 1 px "align" check) prints clear at 1280 and 390 px, and `check-kit.mjs` prints clear.
The same faults are fixed in the four source demos. Package findings: `~/Projects/kp-gaps/http-switchboard.md` 26 to 34.
