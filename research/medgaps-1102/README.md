# research/medgaps-1102: Medicine Cabinet's popover and table gaps

**Decided (2026-11-02 12:26 UTC):** Kenny approved this demo in formal. Recorded in `VERDICTS.json`; the page is not offered again.

Built from Medicine Cabinet's gaps of 01/11/2026 (`~/Projects/kp-gaps/medicine-cabinet.md`, iteration 3) [medicine-1102]. One
review page, formal only, one section per visible change, on the app's own shapes (names, counts and stock are mock):

| Section            | Gap | Part or option                                                                             | Controls                    |
| ------------------ | --- | ------------------------------------------------------------------------------------------ | --------------------------- |
| `popover-panel`    | 25  | `.kp-popover--panel` (padding `--kp-popover-panel-padding`, width up to `--kp-popover-panel-max-width`), `.kp-popover--end` | look, edge, open, width |
| `keep-focused-row` | 27  | `data-kp-keep-focused-row` on a data table, `kp-datatable-row-kept`                          | refresh, keep, width        |

Not shown, as it has no new look: gap 29, the tab bar's More drawer. A More tab drawn after the bundle had wired the bar was
never wired (the bar's later `attachTabbars()` was a no-op), so its drawer was the whole window on a phone and did not close on a
routed link; js/tabbar/controller.js now wires a More tab whenever it arrives.

**Generated** by `node research/medgaps-1102/build.mjs` from `sections.mjs` and `markup.mjs` (edit those, never the page);
`demo.js` fills and wires it, `controls.js` holds the control groups.
