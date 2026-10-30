# research/medicine-1030: the Medicine Cabinet package

Kenny approved all thirteen items of `~/Projects/kp-gaps/medicine-cabinet-workpackage.md` on 2026-10-30 20:05 (item 13 of the app's list, the chassis-rs wiring of
`attachSegmented`, is not here). One bundled review page, formal only (DEMO_RULES ch. 6: a new demo starts in formal), one section per item, the five fixes with a
Before and an After. Branch `theme/mc-1030`. Round `medicine-1030-<uuid>` is written by the builder.

| Topic | Sections (work package item) |
| --- | --- |
| The Cabinet list | list-row (1), quantity-fill (2), badge-run (5) |
| Today | attention-max (4), header-updated (13, fix) |
| The medicine form | row-editor (3), pills-none (8) |
| Dialogs and managed tables | dialogs (6), table-columns (7) |
| Fixes in the package | fix-text-align (9), fix-card-gap (10), fix-error-line (11), fix-switch-state (12) |

The data is the app's own shape (medicines, doses, symptoms, forms of medicine), with mock names, counts and times. The width control of every section sets the stage to
a phone's 390 px; the components answer the width of their own container.

**Generated** by `node research/medicine-1030/build.mjs` (edit the builder, never the page).
