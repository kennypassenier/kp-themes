# research/kpadopt2-tiles

Three parts the admin dashboard still draws itself (docs/admin/KP_THEMES_ADOPTION.md): `nx-action`, `perstack-chip`, `hl-opt`. Built in the
package first. Reviewed in **formal only** first (Kenny's rule of 2026-10-04); the other fifteen registers carry a block but are not yet checked.

- `demo.html` is written by `build.mjs`; edit `build.mjs`, `looks.mjs`, `demo.css`, `demo.js`.
- Package: every `kp-action*`, `kp-statuslist`, `kp-statusrow*`, `kp-facets*`, `kp-facet*`, and the three scripts. Mock: the sample data, the scripted
  runs, the log, and the hover / focus / press rows (the page copies the package's own rules with the pseudo-class turned into a class; needs http).

| Part        | What it is for                               | Reference                                                             | What the package reused                         | Cost   | Decision                                                   |
| ----------- | -------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------- | ------ | ---------------------------------------------------------- |
| Action tile | a button or link with a title and a sentence | [APG button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)        | card colours, ring, spinner, button transitions | medium | built: `.kp-action`, busy, destructive                     |
| Status row  | one state per item, Retry on failure         | [APG alert / status](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) | the step list's marks and region                | medium | built: four states, summarised announcement                |
| Facet list  | checkbox rows, counts, "only"                | [APG checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)    | `.kp-field__check`, ghost button                | medium | built: sibling button, subgrid columns, in-place reconcile |

## Recommendation

Ship all three. Decisions for Kenny: (1) the "only" button is a sibling of the label, not inside it as in the dashboard, and always shown on touch;
(2) pressing Everything always selects every row; (3) a status row keeps one detail line by default, `--kp-statusrow-detail-lines: 2` for lists where long
reasons are expected; (4) the tile reserves a 1.25rem mark column so a spinner never moves the title.
