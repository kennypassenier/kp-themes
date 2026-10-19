# research/chassis-kit-pages: the chassis-rs kit pages on kp-themes 11.0.0

Shared code of five reviews (`research/chassis-kit-shell`, `-status`, `-clients`, `-login`, `-passkeys`), formal only, 12 pairs in total.
`build.mjs` writes the five `demo.html` pages from one list of sections; `kit.js` and `kit-pages.js` are the pages as functions (data in,
markup out) that chassis-rs templates will become; `demo.js` renders each stage, feeds the script-fed components and wires the controls
and the three choices (problems mode, list look, remove confirmation). The data is what the running example service (chassis-rs 3.8.0,
`examples/inbox`) answered on 2026-10-19 (`data/captured-*.json`, embedded by `build-data.mjs` into `captured.js`); `sample.js` holds
more rows of the same shape (clients, passkeys, problems, an uptime history) and the pages say so.

Round 3 (2026-10-19): `demo.html` offers four sections (shell-phone, login, clients-issue, clients-manage), all rebuilt on the form grid
(`.kp-formgrid`, docs/USER_GUIDE.md "the form grid"): the manage dialog's test is one grid row (label, JSON field with its tools, Send test on
the actions track, a small button like Format and Minify), the issue dialog's two fields are grid rows, the login card is one grid (label above
the field, Show on the actions track, the passkey and Log in buttons on the grid's start edge), the login columns stand on one first baseline,
and the phone bar's Search is a square button the size of the theme menu (its icon had no size, so the trigger measured 0 px wide).
`measure-gaps.mjs` (formal, 1280 and 390) must print no `align` line in any state of these sections.
