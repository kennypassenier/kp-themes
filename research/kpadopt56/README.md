# research/kpadopt56: the fifth and sixth adoption rounds in the other themes

Kenny approved 79 sections of nine demos in formal only (`research/kpadopt5-{basics,people,time,rows,ops}`,
`research/kpadopt6-{calm,social,media,ops}`). This asks the same sections in dark, cyberpunk, synthwave, pastel, forest,
blueprint, solstice, brutalism, deco, nostromo and titanium, in eleven reviews of at most 99 pairs
(`research/kpadopt56-<topic>/`: schedule, choose, fields, updates, confirm, lists, status, calm, charts, media, people).

- `src/<demo>/`: per demo, every section in its latest version (`sections.html`), its scripts with dropped wiring restored
  (`demo.js`) and its styles (`page.css`). `src/SOURCES.json` says which commit each section came from. Derived from git by
  `extract-sources.mjs` (needs the history); committed so nothing else does.
- `build-parts.mjs`: writes the eleven pages from `src/` (idempotent; the parts, their lists and the per-theme look-at
  lines are in it). Edit the sources or the builder, never a generated page.
- `check-wiring.mjs`, `measure-overflow.mjs`: measuring scripts (Firefox) beside `research/_review/check-kit.mjs` and
  `measure-gaps.mjs`.
- `FINDINGS.md`: faults in the package the measures found, for the designers.
