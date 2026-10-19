# 11.1.0 release suite: triage of 28 failures

Run: `npm run test:release -- --go`, Firefox, at 97ebd7cf: 28 failed, 1846 passed, 29.7 min. Triage on origin/main at dde71433
(which adds 9531919a graph loading, 7c59ac82 phone form grid, 9ce53d86 kyu fixes). All 28 failed the same way on that head before
any fix. Class: a = package regression (package fixed), b = stale test (an approved change or the suite's own default moved),
c = flaky or timing (made deterministic).

Common cause for 14 rows: 9edea86a ("Make the suite's reduced motion real") moved `reducedMotion` into `contextOptions`, so every
test now runs under `prefers-reduced-motion: reduce` unless its file opts out. These files read motion (an animation, a count in
flight, a followed pointer) and had no opt-out of their own, so they measured a page that does not move.

| # | Test | Cause | Class | Fix | Rerun |
|---|------|-------|-------|-----|-------|
| 1-5 | alarm.spec `flash rate in cyberpunk / synthwave / nostromo / formal / pastel` | default reduced motion: the alarm ran 0 animations (expected > 2, pastel > 1) | b | the test asks for `no-preference` (`page.emulateMedia`) before it opens the alarm | pass (32 s alone) |
| 6 | auto-lazy.spec `site/components/logviewer.html ends up the same as with every module attached` | package: the Pause button had no `aria-pressed` on a lazy page. The pill's first `draw()` looks the button up through `document.querySelectorAll`, which `js/as-of.js` narrows to elements that were there at load, and the button is built by the same attach | a | `js/logviewer.js` sets `aria-pressed="false"` when it builds the button (CHANGELOG) | pass |
| 7 | control-font.spec `no control on research/app-homelab-settings/demo.html ...` | the page's own aria-hidden `.kp-sr-only` mirror inputs (form post) are never drawn, but matched the sweep | b | the sweep skips a hidden input and an aria-hidden `.kp-sr-only` input: no glyph, no font to see | pass |
| 8 | control-font.spec `... app-homelab-backups/demo.html ...` | `input[type=hidden].kp-dated__value` (the date picker's value) matched the sweep | b | same filter | pass |
| 9 | catalogue-review.spec `a block the address links to leaves the page once it is judged` | the register is empty, so the review page is 210 000 px tall and the address leaves it ~108 000 px down among hundreds of running skeleton animations; a frame takes ~90 ms and Playwright's two-identical-frames stability check never passes (180 s timeout) though the button does not move (measured: one rect for 120 frames) | c | the three verdicts are `dispatchEvent('click')`, since the handler is what is under test | pass (28 s) |
| 10, 11, 12 | count.spec `a consumer is told when a number has landed`, `the page says which separator is which`, `detaching leaves the real number` | default reduced motion: the number never counts, so no event, no mid-count value, no `running` state | b | file-level `test.use({ contextOptions: { reducedMotion: 'no-preference' } })`; the one reduced-motion test asks for `reduce` itself | pass |
| 13 | dark-themes-notes.spec `synthwave: every button on a red alert is a dark key with the near-white frame` | the data table's failed slot is the package failed plate since pkg-states-1019; synthwave draws that plate as the approved VCR-stop tube (t56-q, 2026-10-18: dark card ground, buttons framed in the failure's coral rgb(254,67,80)), not a solid red plate. The test counted it as a solid red alert and wanted the near-white dark key | b | the test reads tube plates apart: solid red alerts (`#empty`) keep the dark-key assertions, the tube plate's Retry is pinned at the coral frame. FINDING below | pass |
| 14, 15 | datatable-add-filter.spec `dates come from two package date pickers ...` (framework-free, React) | b3b4-1019 ("dates in pills") writes the pill's bounds in the page's locale, the test expected ISO text | b | expectation is the locale writing (`formatDate(d, 'en')`) the pill uses. FINDING below | pass |
| 16, 17 | datatable.spec `at 320 px a row becomes a card, carrying its column names` (framework-free, React) | card cell is `display: grid` (a subgrid of the row's label and value tracks) since backupstwo-1019 ("in the card layout a cell's label always starts on its track", Kenny 2026-10-19 17:20); the test wanted `flex` | b | expects `grid`, citing the change | pass |
| 18, 19 | datatable.spec `a group folds as its open played backwards` (formal, cyberpunk) | default reduced motion: a group snaps, no glide to measure | b | `ready()` asks for `no-preference` | pass |
| 20, 21, 22 | marquee.spec `the duration is a knob ...`, `the five props are five knobs ...`, `the framework-free twin of that band ...` | default reduced motion: `animation-duration` is `0s` | b | each asks for `no-preference` | pass |
| 23-27 | pointer.spec (five tests: the bus writes the position / detach / the vertical / spectral instrument / theme switch arms the bus) | default reduced motion: the pointer bus writes nothing | b | file-level `no-preference`; the one reduced-motion test asks for `reduce` itself | pass |
| 28 | site.spec `every navigation entry leads to a page that exists` | package: the activity feed's descriptor was in the group "Showing data", which is not one of `GROUPS`, so its page (published) was in no navigation (154 links, 155 expected) | a | descriptor group is `Data`; site regenerated (CHANGELOG) | pass |

Classes: a = 2 rows (6, 28), b = 25 rows, c = 1 row (9). Total 28.

## Reruns

- Before any fix, the failing set on the current head: 28 failed (5.7 min, whole-file runs of five specs; line filters over-selected).
- After the fixes, only the 28 by title: 28 passed, 1.9 min (1 min 52.9 s).
- Code that moved after the suite (9ce53d86: master-detail loading, footprint): the existing tests that cover it, datatable-empty-failed, datatable-first-load, datatable-more, batch3-faults and structure specs: 56 passed, 1.3 min (1 min 21 s). There is no browser test for `js/master-detail.js`; `node gates/check-busy-card.mjs` passes (33 data components lay the busy card). `node --test gates/gates.test.mjs gates/site/extractors.test.mjs`: 93 passed, 7.2 s.

## Findings for Kenny (a test disagreeing with an approved look is listed, not bent)

1. Synthwave, the data table's failed slot (row 13). Kenny's 2026-10-19 ruling is "dark keys on every red alert". The failed slot of a data table is, since pkg-states-1019, the package failed plate, which synthwave draws as the 2026-10-18 tube (dark ground, coral frame on its buttons). So Retry there is a coral-framed key, not the near-white dark key, and that is what the package does. The test now pins both looks. If Kenny meant the tube's buttons to be dark keys too, that is a one-selector change in css/synthwave-register.css (t56-q), not a test change.
2. Date pill vs date field (rows 14, 15). The two pickers in the add-filter editor write dates as dd/mm/yyyy (rule52, the picker default), the pill beside them writes the page's locale: "Opened: 08/10/2026 to 08/20/2026" in `en` for a range typed as 10/08/2026 to 20/08/2026. The two read as different days. Left as b3b4-1019 made it; a pill that follows the pickers' `data-kp-date-format` would remove the mismatch.
3. The catalogue review page with an empty register is 210 000 px tall and animates hundreds of skeletons; a frame takes ~90 ms deep in it (row 9). Not a regression of this release, but the reason actionability waits failed.
