# research/chassis-kit-pages: the chassis-rs kit pages on kp-themes 11.0.0

Shared code of five reviews (`research/chassis-kit-shell`, `-status`, `-clients`, `-login`, `-passkeys`), formal only, 12 pairs in total.
`build.mjs` writes the five `demo.html` pages from one list of sections; `kit.js` and `kit-pages.js` are the pages as functions (data in,
markup out) that chassis-rs templates will become; `demo.js` renders each stage, feeds the script-fed components and wires the controls
and the three choices (problems mode, list look, remove confirmation). The data is what the running example service (chassis-rs 3.8.0,
`examples/inbox`) answered on 2026-10-19 (`data/captured-*.json`, embedded by `build-data.mjs` into `captured.js`); `sample.js` holds
more rows of the same shape (clients, passkeys, problems, an uptime history) and the pages say so.
