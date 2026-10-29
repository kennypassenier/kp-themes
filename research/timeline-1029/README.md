# research/timeline-1029: the editable sequencer (js/sequencer.js)

Kitchen asked for a part that lays a recipe's steps out like clips in a video editor (Kenny, 2026-10-29: "Echt onderdeel"; spec in kp-gaps/kitchen.md).
Built on branch `theme/fixes-1026`, one review page, formal only (DEMO_RULES ch. 6: a new demo starts in formal; the other themes follow after the verdict).

| Section | Capability |
| --- | --- |
| drag-resize | drag and resize with snap (step, edges, unit) |
| lanes | move between lanes (lanes move or fixed, two or three lanes) |
| keyboard | pick up, move, resize, lane, drop, put back; announced |
| linked | steps that run alongside move together |
| overlap | refuse, push or allow |
| total-now | the live total and the line for now |
| events | `kp-sequencer-change`, `-select`, `-refuse`, get and set |
| phone | scroll inside the box and zoom |
| states | loading, empty, failed |

The data is one recipe (spaghetti bolognese) in Kitchen's own step shape (`track`, `mins`, `start`, `with`; Kitchen docs/agent/DATA.md); the timing is the recipe's own, the clock is not read.

**Generated** by `node research/timeline-1029/build.mjs` (edit the builder, never the page).
