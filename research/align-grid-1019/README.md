# research/align-grid-1019: the form grid

**Decided (2026-10-19 18:55):** Kenny approved every pair (formal) over three rounds: form, request, tools in round 1, settings in round 2, facts and phone in round 3. Recorded in `VERDICTS.json`; the page is not offered again.

Round `aligngrid-<uuid>` (see `demo.html`, 2026-10-19): 6 sections, 6 pairs, formal. After Kenny rejected seven settings
sections of the homelab and chassis-rs demos for misalignment (2026-10-19 06:43, "Gebruik het grid en align deftig
verticaal!"), the package got one layout for forms, settings, key-value panels and button groups, `.kp-formgrid`
(css/components.css, docs/USER_GUIDE.md), and a measurement that holds every demo to it,
`research/_review/measure-align.mjs` (run by `measure-gaps.mjs`).

1. **settings**: a settings list, five kinds of control on one edge; the options switched live.
2. **form**: help under the fields, buttons on the field edge.
3. **facts**: a `.kp-kv` and a `.kp-formrows` inside one grid share its columns.
4. **request**: Send test on the line of Format and Minify.
5. **tools**: tool rows of one height, the refresh bar on the tracks (HTTPSwitchboard gaps 23 to 25).
6. **phone**: the settings list at 360 px, composed on the grid's tracks (label and Reset on one line).

Kenny's verdicts of 2026-10-19 11:22 rejected settings, facts and phone; the fixes are in the package (`.kp-formgrid` in
css/components.css), and the three sections now describe them (no new page): a row whose label has a note is centred on
the label block; a `.kp-formrows` or `.kp-kv` inside the grid is no size container (it is a subgrid), facts keep the
key-value gap and a heading sits close on its rows; under 36rem the rows stay on the tracks (label | action, the control
under them, the value under that; a fact and its value on one line). `measure-align.mjs` checks B2 (a label block that
hangs under its row) and H (an action or a fact's value stacked under its label on one left edge).

**Generated** by `node research/align-grid-1019/build.mjs` (edit the builder, never the page).
