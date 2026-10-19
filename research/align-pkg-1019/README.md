# research/align-pkg-1019: six components off a shared line

**Pending**, bundled into `round-2-1019` (see `VERDICTS.json`); the page has no catalogue entry of its own.

Round `alignpkg-<uuid>` (see `demo.html`, 2026-10-19): 6 sections, 6 pairs (formal; none of the faults depends on the theme). Found by
`research/_review/measure-align.mjs` (Kenny, 2026-10-19: everything on a grid, never loose left alignment) on approved demos, confirmed in
the component, fixed in the package. They change approved components, so they come back through the review dialog with a "What changed"
text. See CHANGELOG.md "Unreleased".

1. **feed-line**: the actor chip and the time sat 2 px above the title's line. Fix: the three share the title's baseline (css/components.css).
2. **action-lead**: a lead row's buttons were centred on the row, 21 px below the badge. Fix: badge, title's first line and buttons share a first line one control high.
3. **problems-cols**: alerts in one list ended their text up to 56 px apart. Fix: the alerts are subgrids of the list's four columns (icon, text, fix, close) wider than 34rem.
4. **stackbar-legend**: the value cell was as wide as its own words; a label was cut with an ellipsis (OPEN.md R4). Fix: one value column per legend (`--kp-stackbar-value-n`, js/stackbar.js); labels wrap, with swatch and value on the first line.
5. **shortcuts-ends**: the description cells ended where their words did. Fix: `dd` fills the row.
6. **week-label**: the labels of a day's pills ended where their words did. Fix: the label fills the pill.

The check was narrowed once (`research/_review/measure-align.mjs`): a stack of buttons that share one centre line is aligned (the action list under 30rem, centred by Kenny's 2026-10-05 rule).

**Generated** by `node research/align-pkg-1019/build.mjs` (edit the builder, never the page).
