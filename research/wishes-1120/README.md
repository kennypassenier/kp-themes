# research/wishes-1120: the homelab wishes built in the package

Round `wishes-1120-3f03e480-0bd2-4c7c-b33d-56b4fd7059d1` (2026-10-20): 22 sections, 22 pairs, formal only (DEMO_RULES ch. 6: a new demo starts in formal;
the other themes follow after the verdict). One page for all of them (at most 25 items, DEMO_RULES ch. 6 and the bundling rule of 2026-10-19).

Every section is one wish from the homelab admin dashboard's gap list (`~/Projects/kp-gaps/homelab.md`), built as an opt-in option or a new part of the package on branch
`theme/wishes-1120`. Nothing changes for a component that is not given the option. The components are the package's own, attached by `js/auto.js`;
`demo.js` gives them mock data and wires each section's controls by its own elements; `page.css` is the frame.

| Topic                    | Sections (homelab gap)                                                                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| States and progress      | plain-card (90), job-line (98), batch-progress (112), clipboard-clear (108), countdown-days (124)                                                                       |
| Lists, tables and grids  | dated-meta (101), table-reorder (93), tile-match (121), tile-keys (120), heat-paging (100)                                                                              |
| Charts and logs          | chart-seconds (103), chart-columns (104), logviewer (117 and 115)                                                                                                       |
| Forms and keys           | yaml-field (94), quiet-hours (96), snooze-words (125), confirm-id (123), space-key (122)                                                                                |
| Pages and notices        | page-contents (95), notes-gate (113), alert-remember (119), decorate-hook (65, 66, 67 and 114)                                                                          |

Two wishes are not visual and have no section: homelab 131 (measure-align no longer compares a master-detail's centred empty plate with its list, a change to a
measuring script) and the CSS half of 117 sits in the logviewer section.

**Generated** by `node research/wishes-1120/build.mjs` (edit the builder, never the page).
