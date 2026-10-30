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

**State:** 12 themes in `themes/`. The latest published release is `v11.3.0`
(2026-10-29), after `v11.2.0` (2026-10-21), and
the live position is in the Procedure status table in CLAUDE.md. Every character demo is decided and the Agenda holds no demo waiting for a
verdict (2026-10-14). The full history of every release and
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
`scripts/release.sh` stay. Running test code any other way (a shim or script
that executes a spec's body) is a test run too, and a brief to a helper never
permits one; without `.claude/release-go` a measuring script is the most a
helper may run [fix-118].

**Chromium is off in the test suite** (Kenny, 2026-10-03: "doe ook het chrome
gedeelte tijdelijk weg, tot ik het terugwil"): `playwright.config.mjs` runs
Firefox only; `KP_TEST_CHROMIUM=1` brings the Chromium project back. Turn it
on again only when Kenny asks.

A re-review round shows only the pairs Kenny has not approved; approved sections and themes leave the demo, enforced by gates/check-rereview.mjs (Kenny, 2026-10-13 and 2026-10-16). A review asks at most 100 pairs: a bigger one is split into one demo per group of components, judged one by one from the Agenda (Kenny, 2026-10-17), enforced by the same gate. Before a round goes on the Agenda, `node research/_review/measure-gaps.mjs <port> <page> <themes> 1280,390` must print clear: no component text closer than 4 px to a neighbour or to the side edge of its plate, in every theme the round asks (Kenny, 2026-10-17, correction text-edge-1017). Beside it, `node research/_review/check-kit.mjs <port> <page>` must print clear on every page before a round goes on the Agenda: every step has one row per shown section with its controls, a note survives a reload, and a new round keeps every verdict in the journal (Kenny, 2026-10-17, correction lost-answer-1017).

Everything Kenny expects from a demo and its rounds is one list, [research/_review/DEMO_RULES.md](research/_review/DEMO_RULES.md): every brief for a demo or a round links it, and Claude walks its chapter "Before a round goes on the Agenda" before every push of a round.

**Rules:** the project rules and the corrections they came from are in
[docs/RULES.md](docs/RULES.md); the ones that are code run in
`npm run gates`. Two that shape every turn: a released theme never
changes in place — any change raises the version — and an approved concept
demo is implemented exactly; a test that disagrees is a finding for Kenny,
never a silent deviation. This project follows
`~/Projects/dev-procedure/` (`/project-flow`) on its short route.

## Commands

| Command                                                           | What                                                                                                              | When                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run gates`                                                   | the blocking code checks, seconds                                                                                 | every commit, by the hook in `.claude/hooks/gates.sh`                                                                                                                                                                                                                                                        |
| `npm run test:tags -- --level building`                           | the tests tagged with what changed, firefox                                                                       | while building; `--dry-run` shows the selection and the count                                                                                                                                                                                                                                                |
| `npm run test:tags -- --level commit`                             | building plus every `@sweep` test, firefox                                                                        | once before a report or a commit; manual, not in the hook                                                                                                                                                                                                                                                    |
| `npm run test:tags -- --level engines`                            | the commit selection, both engines                                                                                | at a layer's close and after a paint, focus or keyboard fix [fix-51]                                                                                                                                                                                                                                         |
| `npm run test:release -- --go`                                    | what changed since the last release tag, plus every `@sweep` test on all 19 themes; every test at a major release | before a minor or patch release, on Kenny's go given in a form [form v9, 2026-10-04]                                                                                                                                                                                                                         |
| `npm run test:browser`                                            | the whole suite, firefox (chromium with `KP_TEST_CHROMIUM=1`)                                                     | before a major release, on Kenny's go given in a form; never on Claude's own                                                                                                                                                                                                                                 |
| `npm run release:preflight -- X.Y.Z`                              | what `scripts/release.sh` would refuse, seconds                                                                   | before any release form or "nothing blocks" claim [fix-89]                                                                                                                                                                                                                                                   |
| `npm run advice`                                                  | the readings, printed, never refusing                                                                             | when Kenny wants the reading                                                                                                                                                                                                                                                                                 |
| `npm run verify`                                                  | gates, the whole suite, advice, in order                                                                          | before a release, on the same go                                                                                                                                                                                                                                                                             |
| review site: <https://kennypassenier.github.io/kp-themes/review/> | the catalogue and the research demos, published                                                                   | Claude pushes `main` whenever it asks Kenny to look [scope-67], and links only `catalogue/agenda.html` (Agenda), the one page he starts from since 2026-10-13; before changing a demo for its next round, run `node research/_review/snapshot.mjs <topic>` so its Previous version shows the round he judged |

Every command in this table that runs a browser test (`test:tags`, `test:release`, `test:browser`,
`verify`) is blocked for Claude until Kenny creates `.claude/release-go`; `test:tags -- --dry-run`
and `npm run gates` are not.

No CI runs on commits; `scripts/release.sh X.Y.Z` builds a release on this
machine and uploads it as a draft (GitHub Actions builds nothing), and
`pages.yml` publishes the site on a push to `main`. Node 26 (`.nvmrc`). All artefact text in English.

**Sessions never block each other** (Kenny, 2026-10-07 18:54). Each session
works in its own worktree (`git worktree add ~/Projects/kp-themes-wt/<name> -b theme/<name> origin/main`),
never in the shared `~/Projects/kp-themes`, and runs gates, commits and pushes
from there; before every push `git fetch && git rebase origin/main`, push to
`main`, then remove your own leftovers from the shared folder.

## CSS source lives in `css/components/` and `css/registers/`

`css/components.css` and the twelve `css/<theme>-register.css` files are **generated**; never edit them by
hand. The source is one folder of part files per component (`css/components/<component>/…`, or a single
`<component>.css` when it is small) and the same names per theme (`css/registers/<theme>/…`). Edit a part, then
run `npm run generate:css`; `node gates/generate-css.mjs --check` (inside `npm run gates`) fails on drift, which is
how a hand edit of a generated file is refused. No hand-written `css/`, `js/` or `gates/` file may pass 500 lines
(`npm run check:file-size`; the dated to-split list in `gates/file-size.json` may only shrink). Index and lookup
rules: [css/README.md](css/README.md). The biggest JavaScript modules (ninety-six so far) are a facade over a folder of single-purpose files; their index is [js/README.md](js/README.md).

## Project documents

| Doc                             | Purpose                                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| README.md                       | how to consume the package, tokens, provenance                                                                                                         |
| docs/CYCLE.md                   | the three steps this project works in, from round eight                                                                                                |
| docs/THEME_LESSONS.md           | what went wrong while finishing a theme and the check that finds it                                                                                    |
| docs/FUTURE_THEMES.md           | theme ideas that were set aside                                                                                                                        |
| docs/RELEASE_HISTORY.md         | every release and round, written out (moved from CLAUDE.md)                                                                                            |
| docs/RULES.md                   | the project rules and the corrections they came from                                                                                                   |
| docs/SCOPE.md                   | every approved scope decision (S1–S49, scope-1–scope-77)                                                                                               |
| docs/CORRECTIONS.md             | live-found faults and their approved measures                                                                                                          |
| docs/DESIGN_INVARIANTS.md       | what must hold in every theme (DI1–DI11)                                                                                                               |
| docs/FEATURES.md                | the frozen feature list with its test bars                                                                                                             |
| docs/ARCHITECTURE_REFERENCE.md  | the system as built, as opposed to as decided                                                                                                          |
| docs/USER_GUIDE.md              | how a consumer builds a page with this                                                                                                                 |
| docs/UTILITIES.md               | the generated utility classes                                                                                                                          |
| docs/MINIFIED.md                | the minified build and its per-file sizes (generated)                                                                                                  |
| docs/TEST_PLAN.md               | what is tested, where, and what deliberately is not                                                                                                    |
| docs/TROUBLESHOOTING.md         | when it looks wrong, or a check says no                                                                                                                |
| docs/DEBUGGING_GUIDE.md         | symptom to cause, and what to look at first                                                                                                            |
| docs/OPERATIONS_RUNBOOK.md      | the numbered procedures a maintainer performs                                                                                                          |
| docs/MINI_ROUNDS.md             | open measurements and mini-rounds                                                                                                                      |
| docs/COMPONENTS_PAGE_PENDING.md | what site/components still has to show; add a line with every new component, option or token; once everything is approved, ask Kenny's go for the pass |
| docs/ID_TRANSLATIONS.md         | the KT10 renames, one row each                                                                                                                         |
| site/layout.html                | the layout classes, their knobs and defaults (from css/layout.css)                                                                                     |
| docs/archive/                   | dated records kept for provenance, out of the index and the gates                                                                                      |

Each document here had its own keep-or-go decision at `scope-77`
(2026-09-14): `HANDOFF.md` was removed, `docs/LAYOUT.md` moved into the
comments of `css/layout.css` that the layout page renders, and eighteen
dated records went to `docs/archive/`.
