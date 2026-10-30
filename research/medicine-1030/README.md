# research/medicine-1030: the Medicine Cabinet package

Kenny approved all thirteen items of `~/Projects/kp-gaps/medicine-cabinet-workpackage.md` on 2026-10-30 20:05 (item 13 of the app's list, the chassis-rs wiring of
`attachSegmented`, is not here). Round 1 (page round `medicine-1030-2e8f47fd-00d2-4b26-b645-1248df12cfb5`) was judged 2026-10-31 00:01: eleven approved, two not
(`VERDICTS.json`). **Round 2** shows only those two, formal only (DEMO_RULES ch. 6), and keeps round 1 in `_previous/`:

| Section | Kenny's note | What changed |
| --- | --- | --- |
| pills-none (item 8) | the pill and the field must follow each other both ways; if every symptom is a pill, why a field? | the link never connected (fixed); pills are the most used choices (`data-kp-segmented-top`), the field only exists when there are more choices than pills |
| dialogs (item 6) | the button's text should follow the amount | `data-kp-accept-follows`: "Add 20 tablets", off with its reason at 0 |

The data is the app's own shape (symptoms, forms of medicine), with mock names and counts. The width control of each section sets the stage to a phone's 390 px.

**Generated** by `node research/medicine-1030/build.mjs` (edit the builder, never the page). The builder holds only the two open sections; round 1 is in git history.
