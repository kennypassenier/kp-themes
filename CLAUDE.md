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

## Procedure status

| Field               | Value                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| Current phase       | 0 — Idea & scope, complete                                                           |
| Last completed gate | Phase 0 approval, 2026-09-03 (18 statements + B1, 5 rounds)                          |
| Next gate           | Phase 2 feature decisions; Phase 1 is a brownfield inventory with no gate of its own |
| AFK mode            | off                                                                                  |

Phase 0 ran on 2026-09-03 and is closed. `docs/SCOPE.md` holds the
approved statements. Correction KT1 was raised and approved in the same
session; its pending measurement sits in `docs/MINI_ROUNDS.md`.

The gate ran in this Claude Code CLI session: the visualize elicitation
widget was available here, contrary to what `HANDOFF.md` assumed.

## What Phase 1 and 2 inherit

- **Approved for use (S17):** the seven themes, the cyberpunk fx, the
  register, the contrast check, the Tailwind binding.
- **Not approved (S17):** the picker, React and vanilla alike. It is
  reviewed on the showcase page in all seven themes.
- **Known token gaps (S6b):** no `--success`, `--warning` or `--info`, and
  no hover / active / disabled states.
- **Restructure due in Phase 2 (S18):** `themes/<name>/` per theme, with
  shared `components/v1/{react,vanilla}/`, plus `showcase/` and `gates/`.

## Project documents

| Doc                              | Purpose                                                  |
| -------------------------------- | -------------------------------------------------------- |
| README.md                        | how to consume the package, tokens, provenance           |
| HANDOFF.md                       | start prompt for a procedure session (Dutch)             |
| docs/SCOPE.md                    | the approved Phase 0 scope (S1-S18, B1)                  |
| docs/CORRECTIONS.md              | live-found faults and their approved measures            |
| docs/MINI_ROUNDS.md              | open measurements and mini-rounds                        |
| docs/REQUESTS_FROM_CONSUMERS.md  | what the consumers asked for, 2026-09-03                 |
| docs/THEMING.md                  | kp-soft's maintainer guide, verbatim copy (2026-09-02)   |
| docs/CYBERPUNK_THEME_RESEARCH.md | kp-soft's cyberpunk research, verbatim copy (2026-09-02) |
