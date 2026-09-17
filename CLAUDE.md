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

| Command                                                           | What                                            | When                                                                   |
| ----------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run gates`                                                   | the blocking code checks, seconds               | every commit, by the hook in `.claude/hooks/gates.sh`                  |
| `npm run test:tags -- --level building`                           | the tests tagged with what changed, firefox     | while building; `--dry-run` shows the selection and the count          |
| `npm run test:tags -- --level commit`                             | building plus every `@sweep` test, firefox      | once before a report or a commit; manual, not in the hook              |
| `npm run test:browser`                                            | the whole suite, both engines                   | before a release, on Kenny's go given in a form; never on Claude's own |
| `npm run advice`                                                  | the nine readings, printed, never refusing      | when Kenny wants the reading                                           |
| `npm run verify`                                                  | gates, the whole suite, advice, in order        | before a release, on the same go                                       |
| review site: <https://kennypassenier.github.io/kp-themes/review/> | the catalogue and the research demos, published | Claude pushes `round-six` whenever it asks Kenny to look [scope-67]    |

No CI runs on commits; `release.yml` fires on a `v*` tag and `pages.yml`
on a push to `main`. Node 26 (`.nvmrc`). All artefact text in English.

## Agents

`.claude/agents/` holds `researcher` (background, own worktree, a demo page
and a one-page finding), `theme-builder` (one instance per theme when a
change must land in all of them) and `checker` (runs the tagged tests and
the gates, reports one line per failure). The step invokes them, not
Kenny.

## Procedure status

| Field               | Value                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current phase       | **Round eight, layer 3 (tests, tags, gates, drift, purge).** Every approved fix from the catalogue so far is on the branch: gap-11, gap-12, gap-13, the switch, the data table round, the nostromo notes (scope-54 to scope-60) and held-60 (`e387f11`). Changed blocks return to the review page on their own for Kenny to judge again                     |
| Last completed gate | **Phase 0, 2026-09-13.** The scope form of round eight, all sixteen items answered                                                                                                                                                                                                                                                                          |
| Next gate           | Kenny's catalogue review of the changed blocks (option E, navigation, fix-28 fonts), as the prompt the copy button produces; option B's blocks follow [scope-87]                                                                                                                                                                                            |
| Next action         | waiting on Kenny: publish the v6.1.0 draft (nine assets, 212/212 checksums OK); meanwhile Claude builds `--level engines` [fix-51]                                                                                                                                                                                                                          |
| Open queue items    | Sixteen, none Claude's to close: `step-2`, `fix-9-M1`, `KT6-M1`, `HA4`, `gap-9`, `fix-16-M1`, `fix-17-M1`, `fix-18-M1`, `fix-19-M1`, `gap-10`, `gap-11`, `fix-20-M1`, `gap-12`, `gap-13`, `fix-21-M1`, `fix-23-M1`                                                                                                                                          |
| Status line         | `status-line: required` — every reply opens with the four fields; `~/.claude/hooks/may-i-stop.py` refuses a reply without them, in this project only [scope-43]                                                                                                                                                                                             |
| Step timing         | `step-timing: required` — every form carries a measured item `step-timing · …` from `~/Projects/dev-procedure/hooks/step-timing.py`; `hooks/form-lint.py` refuses a form without it [scope-69]; durations are written in minutes and seconds, and in hours past sixty minutes [scope-80]; it names what each agent worked on beside its duration [scope-83] |
| Forms at wait       | `forms-at-wait: required` — a turn whose Next action waits on Kenny must have shown a form since his last message; a turn in which only an agent works writes "waiting on agent: …" [fix-26]                                                                                                                                                                |
| AFK mode            | off                                                                                                                                                                                                                                                                                                                                                         |

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
