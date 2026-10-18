# research/kpadopt56-formal: approved in formal, changed since, judged again

Kenny approved these components in formal earlier (`research/kpadopt5-*`, `research/kpadopt6-*`). The shared package code changed
afterwards (css/components.css, js/), so formal looks different there and needs his eye again (a visual question is a review demo,
never a form, DEMO_RULES ch. 7). Formal only (`data-review-themes="formal"`); 22 sections, 22 pairs, grouped by the kind of component.
Every section says in plain English under "What changed since you approved it" what is different. Sections that did not change are
not on the page (the uses-lines map was dropped: nothing to ask).

| Topic (component kind) | Sections                                          | What changed in the package                                                                                      |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| bars                   | auto-refresh, request-inspector, segmented-scroll | S1: the bar stays inside its card, the segmented track scrolls and snaps; the track fades the side that has more |
| version                | version, version-states                           | S2: the digest and long parts wrap inside the badge                                                              |
| checklist              | print-checklist, claim-row                        | S3: the detail wraps in at most half the row; the failed box centres a normal Retry and holds the loaded height  |
| entity                 | entity, entity-states                             | S4: actions that do not fit fold into More; S9: states hold the loaded height                                    |
| chart                  | chart-annotations                                 | S5: end labels inside the plot; S12: a failed chart is a plate with a Retry                                      |
| availability           | availability-grid                                 | S6: the answers stand under the name on a phone                                                                  |
| gallery                | gallery-grid, gallery-states                      | S10: the busy card covers the whole gallery; a waiting tile keeps its square                                     |
| ops-page               | ops-page                                          | S12: a failed page is one plate (`data-kp-ops-failed="plate"`, default) or keeps the cards (`keep`)              |
| cards                  | quote-states, today-states, explain-lede          | S11: a card's failure is a plate that fills the card                                                             |
| uses                   | uses-states                                       | S9: loading, empty and failed hold the loaded height                                                             |
| notices                | notices                                           | S9: the states hold a tall footprint, capped at 48rem                                                            |
| rating                 | rating-states                                     | the failed plate covers the whole rating box                                                                     |
| plate                  | usual-states                                      | the Retry and Add button inside a state plate is a normal button, not heading size                               |

The ops page carries the page's one choice set (DEMO_RULES ch. 7: asks only the default `plate`; `keep` is a real option that
switches live; the kit adds "Remove this option"), wired in `demo.js`.

Titanium's straight badge plates (S8) are judged in the eleven-theme parts, not here.

**Generated** from [research/kpadopt56/src](../kpadopt56/src/) by `node research/kpadopt56-formal/build.mjs`; edit the sources or the
builder, never the page. Where it helps, the dialog's controls hold a **Width** switch (1280 / 390).
