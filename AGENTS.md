# kp-themes 🎨

**Project:** kp-themes — the house theme system as a shared package
(`@kp-soft/themes`), and the reference every other project of Kenny's
points at so his apps look like one family. Nineteen themes
(`themes/*/tokens.json`, one register each in `css/<name>-register.css`),
the components on them, a layout layer, a utility API, and the fonts. Web
today; GUI (Avalonia) and TUI (Ratatui) later.

> This file is the tool-neutral project brief. Claude Code reads it through the `@AGENTS.md`
> import at the top of CLAUDE.md; other coding agents read it directly. Claude-specific rules,
> the agents and the Procedure status table live in CLAUDE.md.

**State:** 19 themes since 2026-10-07 (lapis, shade-light and shade-dark were dropped on
2026-10-06); the next release is 10.0.0 (form v44). Every character demo is decided. One
session per theme applies Kenny's verdict to that theme's register and picks; then the
port (research/PACKAGE_FINDINGS.md), the single release check and the Go for 10.0.0. The
latest published release is `v9.2.1` (2026-10-04). The full history of every release and
round is in [docs/RELEASE_HISTORY.md](docs/RELEASE_HISTORY.md); the live position is the
Procedure status table in CLAUDE.md.

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

| Command                                                           | What                                                                                                              | When                                                                                                                                            |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run gates`                                                   | the blocking code checks, seconds                                                                                 | every commit, by the hook in `.claude/hooks/gates.sh`                                                                                           |
| `npm run test:tags -- --level building`                           | the tests tagged with what changed, firefox                                                                       | while building; `--dry-run` shows the selection and the count                                                                                   |
| `npm run test:tags -- --level commit`                             | building plus every `@sweep` test, firefox                                                                        | once before a report or a commit; manual, not in the hook                                                                                       |
| `npm run test:tags -- --level engines`                            | the commit selection, both engines                                                                                | at a layer's close and after a paint, focus or keyboard fix [fix-51]                                                                            |
| `npm run test:release -- --go`                                    | what changed since the last release tag, plus every `@sweep` test on all 19 themes; every test at a major release | before a minor or patch release, on Kenny's go given in a form [form v9, 2026-10-04]                                                            |
| `npm run test:browser`                                            | the whole suite, firefox (chromium with `KP_TEST_CHROMIUM=1`)                                                     | before a major release, on Kenny's go given in a form; never on Claude's own                                                                    |
| `npm run release:preflight -- X.Y.Z`                              | what `scripts/release.sh` would refuse, seconds                                                                   | before any release form or "nothing blocks" claim [fix-89]                                                                                      |
| `npm run advice`                                                  | the readings, printed, never refusing                                                                             | when Kenny wants the reading                                                                                                                    |
| `npm run verify`                                                  | gates, the whole suite, advice, in order                                                                          | before a release, on the same go                                                                                                                |
| review site: <https://kennypassenier.github.io/kp-themes/review/> | the catalogue and the research demos, published                                                                   | Claude pushes `main` whenever it asks Kenny to look [scope-67], and links only `catalogue/changed.html` (To judge), the one page he starts from |

No CI runs on commits; `scripts/release.sh X.Y.Z` builds a release on this
machine and uploads it as a draft (GitHub Actions builds nothing), and
`pages.yml` publishes the site on a push to `main`. Node 26 (`.nvmrc`). All artefact text in English.

**Sessions never block each other** (Kenny, 2026-10-07 18:54). Each session
works in its own worktree (`git worktree add ~/Projects/kp-themes-wt/<name> -b theme/<name> origin/main`),
never in the shared `~/Projects/kp-themes`, and runs gates, commits and pushes
from there; before every push `git fetch && git rebase origin/main`, push to
`main`, then remove your own leftovers from the shared folder.

## Project documents

| Doc                            | Purpose                                                            |
| ------------------------------ | ------------------------------------------------------------------ |
| README.md                      | how to consume the package, tokens, provenance                     |
| docs/CYCLE.md                  | the three steps this project works in, from round eight            |
| docs/RELEASE_HISTORY.md        | every release and round, written out (moved from CLAUDE.md)        |
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
