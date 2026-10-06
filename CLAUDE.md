# kp-themes 🎨

**Project:** kp-themes — the house theme system as a shared package
(`@kp-soft/themes`), and the reference every other project of Kenny's
points at so his apps look like one family. Twenty-two themes
(`themes/*/tokens.json`, one register each in `css/<name>-register.css`),
the components on them, a layout layer, a utility API, and the fonts. Web
today; GUI (Avalonia) and TUI (Ratatui) later.

**State:** the whole character round (15 components, one choice per aspect, 22 themes) is on To judge since 2026-10-05 23:19 (fc7d9e27); earlier: the character round had six demos on main (meter, chart, calendar, graph, trend, columns; research/character-*), fix-98 repaired the plain calendar (e9902684) and fix-99 the plain trend tile (f78fa3a7); round two of the dashboard port is on main since 2026-10-05 (a9efa14f: menu button, drawer and tour, meter, strip columns, trend tile, month heatmap, network graph, approved by Kenny in formal with thirteen picks; 50 node and 14 Playwright tests added since 9.2.1), waiting for his verdicts in every theme and the release go. `v9.2.1` is the latest release, published 2026-10-04 22:14: an alert's close button takes the alert's plate and ink in every register [fix-95]; the release suite was skipped on Kenny's word ("skip de tests, het is maar een kleine change"), the extended severity-contrast test ran red-then-green alone. `v9.2.0` was published 2026-10-04 21:46: every register draws its own leave on `[data-kp-leaving]` (22 exits picked by Kenny over eight rounds), several leaves go one by one bottom first, the eight dashboard components (action columns, tiles, key figures, page header, attention band, state word, busy on a phone, time chart; `js/actions.js`, `js/kpi.js`, `js/attention.js`, `js/chart.js`), the catalogue pages Motion and Charts, the showcase with every option, back-to-top on every example page, and the compliance table measured again (DI5 fails synthwave's `kp-sig-synthwave-sw-tube`, a finding). `v9.1.0` was published 2026-10-04 earlier: `js/motion.js` (a dialog leaves the way it came, boxes ease to a new size with a character per theme, scope-142) and deco's dialog entrance remade without a clip. `v9.0.1` (2026-10-04): fix-92 (a modal `.kp-dialog` centred under a CSS reset such as Tailwind's preflight) and fix-93 (the theme menu keeps every row on one line). `v9.0.0` was published 2026-10-03 (10 assets, 224/224 checksums): the signature progress bar `.kp-progressbar` in place of `.kp-progress`, the ten signature elements in every register in the new layer `kp.signature`, and the release-suite fixes. `v8.1.0` was the previous release (2026-09-30): `.kp-page` at 80% of the window, the data table's busy overlay, fix-86. `v8.0.1` (2026-09-29): the site's theme menu and the pixel review tools. `v7.3.0` was published (2026-09-29) at
<https://github.com/kennypassenier/kp-themes/releases/tag/v7.3.0>, the latest
release — twelve assets, 268 of 268 checksums verified against the tagged tree. `v7.2.0` was published (2026-09-27). `v7.0.0` was published (2026-09-19) at
<https://github.com/kennypassenier/kp-themes/releases/tag/v7.0.0>, then the latest
release — twelve assets, 267 of 267 checksums verified against the tagged
tree. Round
eight, opened the same day, is about the working method itself, not a
theme: its sixteen decisions are `scope-29` to `scope-44` in
[docs/SCOPE.md](docs/SCOPE.md), and the cycle they define is
[docs/CYCLE.md](docs/CYCLE.md) — Bouwen → Kijken → Uitrol.

**Consumers:** JobTracker (npm, pinned at v5.0.0, measured 2026-09-26), Almanac and kyu (both
vendor a copy of `css/themes.css`), kp-soft (via its queue item #21), and
since 8.0.0 the split-out theme repositories (kp-themes-windows, -linux,
-vscode, -tui, -ha, -jellyfin), each pinned to a `tokens.tar` release asset
by checksum [scope-139].

**Tests only after a release go** (Kenny, 2026-09-30: "tests draaien we vanaf
nu pas na dat ik de toestemming geef voor een release"): no browser test runs
while building, not even a tagged subset; the suite runs once, after his go for
a release. The gates in the commit hook and the screenshot check inside
`scripts/release.sh` stay.

**Chromium is off in the test suite** (Kenny, 2026-10-03: "doe ook het chrome
gedeelte tijdelijk weg, tot ik het terugwil"): `playwright.config.mjs` runs
Firefox only; `KP_TEST_CHROMIUM=1` brings the Chromium project back. Turn it
on again only when Kenny asks.

**Rules:** the project rules and the corrections they came from are in
[docs/RULES.md](docs/RULES.md); the ones that are code run in
`npm run gates`. Two that shape every turn: a released theme never
changes in place — any change raises the version — and an approved concept
demo is implemented exactly; a test that disagrees is a finding for Kenny,
never a silent deviation. This project follows
`~/Projects/dev-procedure/` (`/project-flow`) on its short route.

## Commands

| Command                                                           | What                                                                                                              | When                                                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `npm run gates`                                                   | the blocking code checks, seconds                                                                                 | every commit, by the hook in `.claude/hooks/gates.sh`                                |
| `npm run test:tags -- --level building`                           | the tests tagged with what changed, firefox                                                                       | while building; `--dry-run` shows the selection and the count                        |
| `npm run test:tags -- --level commit`                             | building plus every `@sweep` test, firefox                                                                        | once before a report or a commit; manual, not in the hook                            |
| `npm run test:tags -- --level engines`                            | the commit selection, both engines                                                                                | at a layer's close and after a paint, focus or keyboard fix [fix-51]                 |
| `npm run test:release -- --go`                                    | what changed since the last release tag, plus every `@sweep` test on all 22 themes; every test at a major release | before a minor or patch release, on Kenny's go given in a form [form v9, 2026-10-04] |
| `npm run test:browser`                                            | the whole suite, firefox (chromium with `KP_TEST_CHROMIUM=1`)                                                     | before a major release, on Kenny's go given in a form; never on Claude's own         |
| `npm run release:preflight -- X.Y.Z`                              | what `scripts/release.sh` would refuse, seconds                                                                   | before any release form or "nothing blocks" claim [fix-89]                           |
| `npm run advice`                                                  | the readings, printed, never refusing                                                                             | when Kenny wants the reading                                                         |
| `npm run verify`                                                  | gates, the whole suite, advice, in order                                                                          | before a release, on the same go                                                     |
| review site: <https://kennypassenier.github.io/kp-themes/review/> | the catalogue and the research demos, published                                                                   | Claude pushes `main` whenever it asks Kenny to look [scope-67], and links only `catalogue/changed.html` (To judge), the one page he starts from |

No CI runs on commits; `scripts/release.sh X.Y.Z` builds a release on this
machine and uploads it as a draft (GitHub Actions builds nothing), and
`pages.yml` publishes the site on a push to `main`. Node 26 (`.nvmrc`). All artefact text in English.

## Agents

`.claude/agents/` holds `researcher` (background, own worktree, a demo page
and a one-page finding), `theme-builder` (one instance per theme when a
change must land in all of them) and `checker` (runs the tagged tests and
the gates, reports one line per failure). The step invokes them, not
Kenny.

## Procedure status

| Field               | Value                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current phase       | **7.3.0 is published** (2026-09-29): fix-74 to fix-85, `busy()`/`fail()` on the data table, the site's theme switcher and catalogue examples. The split into separate repos (desktop, vscode, tui, ha) is owned by the thread "kp-themes opsplitsen + Windows-dialoogfix"                                                                                                                                                       |
| Last completed gate | **Form v2 and v4, 2026-09-29.** fix-81 to fix-85 approved; 7.3.0 released and published on Kenny's word; review hash to become pure HTML with a screenshot comparison, from now on                                                                                                                                                                                                                                              |
| Next gate           | none waiting: the row-click change (d97f1fc6) waits on main for a later release; Kenny, 2026-10-02: "Nog niet … is voor een latere ronde"                                                                                                                                                                                                                                                                                       |
| Next action         | waiting on Kenny: his verdicts from To judge (catalogue/changed.html): the graph's round 3 (six ghost-network loading pictures in all 22 themes, brutalism also arrival, focus, live; 7afe1aa9), the trend tile's round 3 (brutalism, deco, retro, nostromo; 444da6f9), the calendar's round 2 (d5e8ff4f), the chart's round 4 (b9377ed8) and the other 9 components; form v27 (review-status, fix-103). After all verdicts: port each chosen combination exactly (the graph's ghost moves into js/graph.js, PACKAGE_FINDINGS), the single release check (labels never wrapped or cut, one height per component; contrast is advice only, scope-76), a correction for the package findings, the Go for 9.3.0. `scripts/release.sh` refuses while a pair is open [fix-87] |
| Open queue items    | Twenty, in docs/MINI_ROUNDS.md: `fix-9-M1`, `fix-12-M1`, `fix-16-M1` to `fix-18-M1`, `fix-38-M1`, `fix-51-M1`, `fix-56-M1`, `fix-64b-M1`, `fix-70-M1`, `fix-74-M1` to `fix-80-M1`, `feat-nav-3-M1`, `scope-136-M1`, `scope-138-M1`                                                                                                                                                                                              |
| Status line         | `status-line: required` — every reply opens with the four fields; `~/.claude/hooks/may-i-stop.py` refuses a reply without them, in this project only [scope-43]                                                                                                                                                                                                                                                                 |
| Step timing         | `step-timing: required` — every form carries a measured item `step-timing · …` from `~/Projects/dev-procedure/hooks/step-timing.py`; `hooks/form-lint.py` refuses a form without it [scope-69]; durations are written in minutes and seconds, and in hours past sixty minutes [scope-80]; it names what each agent worked on beside its duration [scope-83]                                                                     |
| Forms at wait       | `forms-at-wait: required` — a turn whose Next action waits on Kenny must have shown a form since his last message; a turn in which only an agent works writes "waiting on agent: …" [fix-26]                                                                                                                                                                                                                                    |
| AFK mode            | off since 2026-10-05 17:03 (Kenny answered form v21); was on 13:02–17:03                                                                                                                                                                                                                                                                                                                                                                                                                             |

## Project documents

| Doc                            | Purpose                                                            |
| ------------------------------ | ------------------------------------------------------------------ |
| README.md                      | how to consume the package, tokens, provenance                     |
| docs/CYCLE.md                  | the three steps this project works in, from round eight            |
| docs/RULES.md                  | the project rules and the corrections they came from               |
| docs/SCOPE.md                  | every approved scope decision (S1–S49, scope-1–scope-77)           |
| docs/CORRECTIONS.md            | live-found faults and their approved measures                      |
| docs/DESIGN_INVARIANTS.md      | what must hold in every theme (DI1–DI11)                           |
| docs/FEATURES.md               | the frozen feature list with its test bars                         |
| docs/ARCHITECTURE_REFERENCE.md | the system as built, as opposed to as decided                      |
| docs/USER_GUIDE.md             | how a consumer builds a page with this                             |
| docs/UTILITIES.md              | the generated utility classes                                      |
| docs/MINIFIED.md               | the minified build and its per-file sizes (generated)              |
| docs/TEST_PLAN.md              | what is tested, where, and what deliberately is not                |
| docs/TROUBLESHOOTING.md        | when it looks wrong, or a check says no                            |
| docs/DEBUGGING_GUIDE.md        | symptom to cause, and what to look at first                        |
| docs/OPERATIONS_RUNBOOK.md     | the numbered procedures a maintainer performs                      |
| docs/MINI_ROUNDS.md            | open measurements and mini-rounds                                  |
| docs/ID_TRANSLATIONS.md        | the KT10 renames, one row each                                     |
| site/layout.html               | the layout classes, their knobs and defaults (from css/layout.css) |
| docs/archive/                  | dated records kept for provenance, out of the index and the gates  |

Each document here had its own keep-or-go decision at `scope-77`
(2026-09-14): `HANDOFF.md` was removed, `docs/LAYOUT.md` moved into the
comments of `css/layout.css` that the layout page renders, and eighteen
dated records went to `docs/archive/`.
