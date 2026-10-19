# research/align-grid-1019: the form grid

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
6. **phone**: the settings list at 360 px, one column.

**Generated** by `node research/align-grid-1019/build.mjs` (edit the builder, never the page).
