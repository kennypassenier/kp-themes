# research/field-problems-1019: two grid faults (form field width, problem fixes)

**Open:** round `fieldproblems-<uuid>` (see `demo.html`, 2026-10-19), 2 sections, 2 pairs (formal). Bundled into `round-4-1019`
(`VERDICTS.json` says `bundledInto`); this page is the source of the bundle and is not offered on its own.

Found by the project threads (HTTPSwitchboard 32, chassis-rs 9, homelab 48), fixed in the package. They change approved components,
so they come back through the review dialog with a "What changed" text. See CHANGELOG.md "Unreleased".

1. **field-fills**: a `.kp-field` stopped at 28 rem, 42 to 47 px short of its card or column edge. Fix: it fills its place (`--kp-field-max-width` defaults to `none`).
2. **problems-edges**: in a `data-kp-subgrid` list each fix took the width of its words (108 px apart). Fix: the list shares its tracks at every width and folds with the form grid. The plain list was already fixed by align-pkg-1019.

**Generated** by `node research/field-problems-1019/build.mjs` (edit the builder, never the page).
