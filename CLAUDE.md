# kp-themes 🎨

**Project:** kp-themes — the house theme system as a shared package
(`@kp-soft/themes`), and the reference every other project of Kenny's
points at so his apps look like one family. Twenty-two themes
(`themes/*/tokens.json`, one register each in `css/<name>-register.css`),
the components on them, a layout layer, a utility API, and the fonts. Web
today; GUI (Avalonia) and TUI (Ratatui) later.

**State:** `v6.0.0` is published (2026-09-13) at
<https://github.com/kennypassenier/kp-themes/releases/tag/v6.0.0>. Round
eight, opened the same day, is about the working method itself, not a
theme: its sixteen decisions are `scope-29` to `scope-44` in
[docs/SCOPE.md](docs/SCOPE.md), and the cycle they define is
[docs/CYCLE.md](docs/CYCLE.md) — Bouwen → Kijken → Uitrol.

**Consumers:** JobTracker (npm, pinned at v0.1.1), Almanac and kyu (both
vendor a copy of `css/themes.css`), kp-soft (via its queue item #21).

**Rules:** the project rules and the corrections they came from are in
[docs/RULES.md](docs/RULES.md); the ones that are code run in
`npm run gates`. Two that shape every turn: a released theme never
changes in place — any change raises the version — and an approved concept
demo is implemented exactly; a test that disagrees is a finding for Kenny,
never a silent deviation. This project follows
`~/Projects/dev-procedure/` (`/project-flow`) on its short route.

## Commands

| Command                                                 | What                                    | When                                                                   |
| ------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `npm run gates`                                         | the blocking code checks, seconds       | every commit, by the hook in `.claude/hooks/gates.sh`                  |
| `npx playwright test --grep "<tags>" --project=firefox` | the tests of what changed               | while building; the single spec file until `tests/tags.json` exists    |
| `npm run test:browser`                                  | the whole suite, both engines           | before a release, on Kenny's go given in a form; never on Claude's own |
| `npm run advice`                                        | contrast, invariants, motion, texture   | when Kenny wants the reading                                           |
| `npm run verify`                                        | gates, affected tests, advice, in order | before a release, on the same go                                       |

No CI runs on commits; `release.yml` fires on a `v*` tag and `pages.yml`
on a push to `main`. Node 26 (`.nvmrc`). All artefact text in English.

## Agents

`.claude/agents/` holds `researcher` (background, own worktree, a demo page
and a one-page finding), `theme-builder` (one instance per theme when a
change must land in all of them) and `checker` (runs the tagged tests and
the gates, reports one line per failure). The step invokes them, not
Kenny.

## Procedure status

| Field               | Value                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current phase       | **Round eight, layer 1 (the small machine).** Phase 0 closed 2026-09-13 with sixteen decisions (`scope-29`–`scope-44`). Three research streams run in the background (navbar alternatives, futuristic layouts, per-theme loading). CLAUDE.md slimmed, rules moved to `docs/RULES.md`, the cycle in `docs/CYCLE.md`, three agents written |
| Last completed gate | **Phase 0, 2026-09-13.** The scope form of round eight, all sixteen items answered                                                                                                                                                                                                                                                       |
| Next gate           | The global-scope form: which of the layer-1 wishes may touch `~/Projects/dev-procedure` or a user-level hook (lexicon scope, status-line scope, a pointer line, the title convention)                                                                                                                                                    |
| Next action         | waiting on Kenny: the answers to the global-scope form (four items)                                                                                                                                                                                                                                                                      |
| Open queue items    | Eight, none Claude's to close: `step-2`, `fix-9-M1`, `KT6-M1`, `HA4`, `gap-9`, `fix-16-M1`, `fix-17-M1`, `fix-18-M1`                                                                                                                                                                                                                     |
| AFK mode            | off                                                                                                                                                                                                                                                                                                                                      |

## Project documents

| Doc                                     | Purpose                                                     |
| --------------------------------------- | ----------------------------------------------------------- |
| README.md                               | how to consume the package, tokens, provenance              |
| HANDOFF.md                              | start prompt for a procedure session (Dutch)                |
| docs/CYCLE.md                           | the three steps this project works in, from round eight     |
| docs/RULES.md                           | the project rules and the corrections they came from        |
| docs/SCOPE.md                           | every approved scope decision (S1–S49, scope-1–scope-44)    |
| docs/CORRECTIONS.md                     | live-found faults and their approved measures               |
| docs/DESIGN_INVARIANTS.md               | what must hold in every theme (DI1–DI11)                    |
| docs/FEATURES.md                        | the frozen feature list with its test bars                  |
| docs/ARCHITECTURE_DECISIONS.md          | the tech choices, frozen at Phase 4                         |
| docs/ARCHITECTURE_REFERENCE.md          | the system as built, as opposed to as decided               |
| docs/USER_GUIDE.md                      | how a consumer builds a page with this                      |
| docs/LAYOUT.md                          | the layout classes and their knobs                          |
| docs/UTILITIES.md                       | the generated utility classes                               |
| docs/MINIFIED.md                        | the minified build and its per-file sizes (generated)       |
| docs/TEST_PLAN.md                       | what is tested, where, and what deliberately is not         |
| docs/TROUBLESHOOTING.md                 | when it looks wrong, or a check says no                     |
| docs/DEBUGGING_GUIDE.md                 | symptom to cause, and what to look at first                 |
| docs/OPERATIONS_RUNBOOK.md              | the numbered procedures a maintainer performs               |
| docs/REALIZATION_PLAN.md                | the milestones of the full-route rounds, and their gate log |
| docs/INVENTORY.md                       | the Phase 1 inventory of 2026-09-03                         |
| docs/COVERAGE_GAPS.md                   | what the themes do not reach yet                            |
| docs/MINI_ROUNDS.md                     | open measurements and mini-rounds                           |
| docs/GENERIC_SWEEP.md                   | the KT6 audit: every feature configurable                   |
| docs/LIFT_PLAN.md                       | the nineteen lifts of round six, one row each               |
| docs/RESEARCH_2026-09.md                | the measured references the lifts were built from           |
| docs/THEME_CANDIDATES.md                | the twenty-one candidates thirteen themes came from         |
| docs/THEME_VERDICTS.md                  | what each theme was judged to need, and why                 |
| docs/REQUESTS_FROM_CONSUMERS.md         | what the consumers asked for, 2026-09-03                    |
| docs/ADOPTION_PROMPTS.md                | the two consumer prompts, one per project (Dutch)           |
| docs/ID_TRANSLATIONS.md                 | the KT10 renames, one row each                              |
| docs/legacy/THEMING.md                  | kp-soft's maintainer guide, verbatim copy (2026-09-02)      |
| docs/legacy/CYBERPUNK_THEME_RESEARCH.md | kp-soft's cyberpunk research, verbatim copy (2026-09-02)    |
| docs/legacy/README.md                   | what the two copied documents are, and what replaced them   |

The document list is long on purpose for now: `scope-36` gives every
document its own keep-or-go decision, and this table shrinks with it.
