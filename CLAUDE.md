# kp-themes 🎨

**Project:** kp-themes — the house theme system as a shared package
(`@kp-soft/themes`), and the reference every other project of Kenny's
points at so his apps look like one family. Web today; GUI (Avalonia) and
TUI (Ratatui) later.

**State:** v0.1.1 is an extraction from kp-soft (commit `2983abb`,
2026-09-02): the seven themes, the registers, the cyberpunk fx, the theme
hook/switcher, the contrast gate, plus the seven status-colour tokens for
JobTracker. Phase 0 approved that base for use but explicitly **not** the
picker — see S17 in [docs/SCOPE.md](docs/SCOPE.md).

**Consumers:** JobTracker (npm, pinned at v0.1.1), Almanac and kyu (both
vendor a copy of `css/themes.css`), kp-soft (via its queue item #21).

**Enforcement:** `npm run gates` (contrast + prettier) before every
commit; git hooks and CI to be installed in this project's Phase 5. Node
26 (`.nvmrc`). All artefact text in English.

This project follows the dev procedure in `~/Projects/dev-procedure/`
(`/project-flow`); standing rules in
`~/Projects/dev-procedure/STANDING_RULES.md`.

## Project rule from correction KT1 (2026-09-03)

Every claim in a form's explanation that is checkable on this machine is
checked in the same turn the form is written, and the explanation names
the file and line. A claim taken from another document carries that label
("measured by the JobTracker session") rather than a bare "measured".
This applies to the sentences a decision rests on — those asserting a
fact about the code or about another project — not to background or
reasoning. Discipline-enforced, not code-enforced. Full record:
[docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from correction KT3 (2026-09-04)

A browser test that asserts the package applies something is drilled
before it is trusted: remove the rule in the package that carries it,
confirm the test goes red, restore it, and record in one line of comment
what was removed. Discipline-enforced. The mechanical half is code —
`gates/check-layers.mjs` refuses a bare-element selector in
`showcase/showcase.css`, because that stylesheet is inlined into every
fixture page and would otherwise supply the very thing under test. Full
record: [docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from Kenny's answer of 2026-09-04

kp-themes is a **source**, not a service, and it makes one promise: a
released version of a theme never changes. Any change to a theme raises
the version — no in-place correction, not even of a value that is plainly
wrong. Recorded as S20 in [docs/SCOPE.md](docs/SCOPE.md).

It follows that this project builds **no tooling for consumers**: no sync
command, no adapter, no per-consumer fixture. Both this project and the
projects using it are run by an LLM working from the latest version; a
consumer arranges its own integration and asks for what it needs. A
request inside the scope — a component, a type, a token — is the supported
way to get one. Scope stays: define themes, build components on them.

## Procedure status

| Field               | Value                                  |
| ------------------- | -------------------------------------- |
| Current phase       | 6 — round two, building towards 1.2.0  |
| Last completed gate | Phase 9, 2026-09-04 — v1.1.0 published |
| Next gate           | the round-two AFK report               |
| Open queue items    | KT3-M1, KT4-M1, TH47                   |
| AFK mode            | ON — build without stopping            |

Correction KT4 reopened the project the day it closed: JobTracker adopted
1.0.0 and found the package ships no type declarations, while README,
USER_GUIDE and the ecosystem entry all promised a `Theme` type that was an
alias for `string`. 1.1.0 answers it — declarations beside every entry
point, `Theme` as the generated union of the eleven names, a gate that
packs the tarball and checks them, and `tabs[index]?.focus()`. Phase 10 ran
first and is committed in `~/Projects/dev-procedure` (`bd56a36`,
`851bf07`): three standing rules, a Phase 6 note, the ecosystem entry, and
the PROC-H1 repair with its drills.

Phase 9 closed on 2026-09-04: `v1.0.0` is tagged on the merge commit on
`main` and published at
<https://github.com/kennypassenier/kp-themes/releases/tag/v1.0.0>, with
`SHA256SUMS`, `MIGRATION.md` and the two stylesheets attached. The field
test that precedes that gate found three defects no gate could see — the
whole framework-free channel unpublished, TH12 never built, and
`themeMenuMarkup()` in the module that attaches on import. CI then found a
fourth, recorded as KT3. Phase 8 closed on 2026-09-04 with the four
documents in `docs/`. Phase 7 closed the same day.

Phase 2 closed on 2026-09-04: `docs/FEATURES.md` holds the frozen list —
29 essential, 2 desired, 3 later, 1 declined — with the test bars agreed at
the freeze, and `docs/DESIGN_INVARIANTS.md` holds the eleven rules that must
hold in every theme together with a compliance table showing what the seven
themes fail today. Phase 6 built all eleven milestones on 2026-09-04 in AFK
mode: L0's gate was signed off, and the gates for L1 to L10 accumulate into
one combined report. Phases 0 and 1 ran on 2026-09-03; `docs/SCOPE.md` holds the
approved scope and `docs/INVENTORY.md` the 99 inventoried units. Correction
KT1, KT2 and KT3 and their follow-ups sit in `docs/CORRECTIONS.md`, with
the open measurements in `docs/MINI_ROUNDS.md`.

The gate ran in this Claude Code CLI session: the visualize elicitation
widget was available here, contrary to what `HANDOFF.md` assumed.

## What the build phases inherit

- **Approved for use (S17):** the seven themes, the cyberpunk fx, the
  register, the contrast check, the Tailwind binding.
- **Not approved (S17):** the picker, React and vanilla alike. It is
  reviewed on the showcase page in all seven themes.
- **Known token gaps (S6b):** closed at L3. All seven themes now declare
  `--success`, `--warning`, `--info`, the derived hover / active / disabled
  states, `--border-strong`, `--focus-ring`, `--link` and `--link-visited`.
- **Restructure (S18):** done as the milestones needed it — `themes/<name>/`
  at L0, `gates/` at L1, `js/` and `components/` at L4-L8, `showcase/` at L5.

## Project documents

| Doc                              | Purpose                                                   |
| -------------------------------- | --------------------------------------------------------- |
| README.md                        | how to consume the package, tokens, provenance            |
| HANDOFF.md                       | start prompt for a procedure session (Dutch)              |
| docs/SCOPE.md                    | the approved Phase 0 scope (S1-S18, B1)                   |
| docs/INVENTORY.md                | the Phase 1 inventory, 99 units with IDs                  |
| docs/REALIZATION_PLAN.md         | the eleven milestones, the enforcement, the gate log      |
| docs/FEATURES.md                 | the frozen feature list with its test bars (TH1-TH36)     |
| docs/ARCHITECTURE_DECISIONS.md   | the tech choices (T1-T9); Phase 4 adds AR* and freezes it |
| docs/DESIGN_INVARIANTS.md        | what must hold in every theme (DI1-DI11)                  |
| docs/COVERAGE_GAPS.md            | what the themes do not reach yet, in five groups          |
| docs/CORRECTIONS.md              | live-found faults and their approved measures             |
| docs/MINI_ROUNDS.md              | open measurements and mini-rounds                         |
| docs/REQUESTS_FROM_CONSUMERS.md  | what the consumers asked for, 2026-09-03                  |
| docs/THEMING.md                  | kp-soft's maintainer guide, verbatim copy (2026-09-02)    |
| docs/CYBERPUNK_THEME_RESEARCH.md | kp-soft's cyberpunk research, verbatim copy (2026-09-02)  |
