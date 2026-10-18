# research/kpadopt56-formal: approved in formal, changed since, judged again

Kenny approved these components in formal earlier (`research/kpadopt5-*`, `research/kpadopt6-*`). The shared package code changed
afterwards (css/components.css, js/), so formal looks different there and needs his eye again (a visual question is a review demo,
never a form, DEMO_RULES ch. 7). Formal only (`data-review-themes="formal"`); 11 sections, 11 pairs.

| Section                 | What changed in the package                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| auto-refresh            | S1: the bar stays inside its card, the segmented track scrolls                                                             |
| request-inspector       | S1: the filter bar stays inside its card; narrow request rows wrap whole items                                             |
| segmented-scroll        | every scrolling segmented control: snaps to whole segments, fades the side that has more (at rest, mid-scroll, end, roomy) |
| version, version-states | S2: the digest and long parts wrap inside the badge                                                                        |
| print-checklist         | S3: the detail wraps in at most half the row                                                                               |
| entity, entity-states   | S4: actions that do not fit fold into More                                                                                 |
| chart-annotations       | S5: first and last x-axis labels anchored inside the plot                                                                  |
| uses-lines              | unchanged by the fixes; asked with the chart                                                                               |
| availability-grid       | S6: the answers stand under the name on a phone                                                                            |

Titanium's straight badge plates (S8) are judged in the eleven-theme parts, not here.

**Generated** from [research/kpadopt56/src](../kpadopt56/src/) by `node research/kpadopt56-formal/build.mjs`; edit the sources or the
builder, never the page. Where it helps, the dialog's controls hold a **Width** switch (1280 / 390).

**Waiting for theme/t56-h** (S9 to S13, the state changes): not on this branch yet. After that branch is merged, run the builder again:
once `css/components.css` carries `data-kp-ops-failed`, the gallery and the operations page join the page by themselves, the ops page with
its choice set (default `plate`, `keep` switchable live, "Remove this option" from the review kit), wired in `demo.js`.
