# research/kpadopt-controls

**Decided (2026-10-16 04:39):** Kenny approved it in full in the review dialog: 48 of 48 approved in round 2 (round 1: the toolbar in formal jumped while its buttons opened, mended). Recorded in `VERDICTS.json`; the demo is not offered again.

Three parts the admin dashboard (the homelab repo) still draws itself, because kp-themes 10.1.1 has no component for them
(docs/admin/KP_THEMES_ADOPTION.md, kpa-18, kpa-19, kpa-33). Kenny's rule: a consumer draws nothing itself, so each is built in
kp-themes first. This folder is the review demo; the implementation is in the package (css/components.css, the sixteen
registers, js/segmented.js, js/toolbar.js, js/keys.js).

- `demo.html` is written by `build.mjs`; edit `build.mjs`, `demo.css` and `demo.js`, not the HTML.
- Parts that are the package: every `kp-segmented`, `kp-toolbar`, `kp-keys`, `kp-kbd`, `kp-tag`, `kp-button`, `kp-field__input`, the
  real `kp-datatable`, the attach functions of js/auto.js. Parts that are mock: the list of containers and its filtering (it reads
  the toolbar's controls and writes the counts and tags back), the "hover" and "focus" rows (classes standing in for states a page
  cannot hold still, reading the package's own knobs), and the theme buttons.
- Three judged sections, sixteen themes: 1 segmented control and chips, 2 list toolbar, 3 inline key line. The last section of the page
  shows all sixteen themes side by side (not judged in the dialog).

| Part                                       | What it is for                                                                             | Reference                                                                                                                                                     | What the package reused                                                                          | Cost   | Decision                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------ |
| Segmented control, single                  | one value of a few, always visible; the dashboard's `segSwitch`                            | [APG radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), [Material segmented buttons](https://m3.material.io/components/segmented-buttons)         | button look, `--kp-control-height`, `--fx-duration` and `--fx-ease`, the global focus ring       | medium | built: radio semantics, roving tabindex, a plate that glides |
| Segmented control, multi, and filter chips | several values on, none on is All; the dashboard's `toggleGroup` (`seg` and `chips` looks) | [APG toggle button](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [Radix toggle group](https://www.radix-ui.com/primitives/docs/components/toggle-group) | `.kp-tag` pill proportions, the datatable's filter-pill vocabulary                               | medium | built: `aria-pressed`, All item, collapse to All             |
| List toolbar                               | search, filter groups, view and state above a non-table list; the dashboard's `toolbar`    | [APG toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) (not adopted, see below)                                                                     | `.kp-field__input`, `.kp-tag` and `.kp-tag__remove` (the datatable's pills), `.kp-button--ghost` | medium | built: three grid tracks, active row, reserve option         |
| Inline key line                            | one row of key caps and what they do; the dashboard's `keyRow` and `kbd`                   | [APG keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)                                                                       | the `.kp-help kbd` cap recipe, `isMac` logic of js/palette.js                                    | small  | built: `.kp-kbd` free-standing, `.kp-keys` row               |

## Recommendation

Ship all three as one release item: they are used together on every list page (a toolbar holds segmented groups and shows a key hint,
and a key line sits under the list), so the dashboard can drop `toggleGroup`, `segSwitch`, `toolbar`, `filterChip`, `kbd`, `keyRow`
and about 330 lines of CSS in one step.

Decisions worth Kenny's eye in the demo (also listed in the report):

1. The chosen label keeps its weight (the dashboard made it bold, which makes the label wider and pushes the neighbours). The plate
   and the ink carry the state.
2. The toolbar is `role="group"`, not `role="toolbar"` as the dashboard had it: a toolbar must move between its controls with the
   arrow keys, and the search field needs them. Single and multi groups inside it do use arrows.
3. A multi group is a roving-tabindex group too (one tab stop, arrows move, Space or Enter turns), as the APG toolbar toggle buttons
   do; the dashboard had one tab stop per button.
4. The "Showing only" row is absent when empty (as the dashboard has it), so the list moves by one line when a filter is turned on;
   `data-kp-toolbar-reserve` keeps the room. Which should be the default?
5. The `/` key is bound by the toolbar only when `data-kp-toolbar-key` is present; the first visible toolbar takes it.
6. Not done: the toolbar does not drive a `kp-datatable` (whose own bar already has search and filters); next to one it reads as the
   same family through the shared `.kp-tag`.
