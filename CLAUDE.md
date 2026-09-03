# kp-themes 🎨

**Project:** kp-themes — the house themes as a shared package
(`@kp-soft/themes`).

**State:** v0.1.0 = extraction only (2026-09-02): the seven themes, the
registers, the cyberpunk fx, the theme hook/switcher and the contrast gate
lifted from kp-soft (commit `2983abb`), plus the seven status-colour
tokens for JobTracker. The design-system project (TUI/GUI palettes, theme
anatomy docs, "what makes a theme a theme") has NOT run its own procedure
yet — start with `/project-flow start` in a session opened in this
directory.

**Consumers:** JobTracker (from milestone L0), kp-soft (via its queue item
#21).

**Enforcement:** `npm run gates` (contrast + prettier) before every
commit; git hooks to be installed in this project's Phase 5. Node 26
(`.nvmrc`). All artefact text in English.

This project follows the dev procedure in `~/Projects/dev-procedure/`
(`/project-flow`); standing rules in
`~/Projects/dev-procedure/STANDING_RULES.md`.

## Procedure status

| Field               | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| Current phase       | 0 — Idea & scope (draft written, gate open)              |
| Last completed gate | none                                                     |
| Next gate           | Phase 0 approval form over the 10 statements in SCOPE.md |
| AFK mode            | off                                                      |

Phase 0 started 2026-09-03. `docs/SCOPE.md` holds the drafted statements
(S1-S10), marked DRAFT until Kenny answers the approval form. That form
needs the elicitation widget, which the Claude Code CLI has no MCP server
for — the gate therefore runs in a Claude Desktop session.

## Project documents

| Doc                              | Purpose                                                  |
| -------------------------------- | -------------------------------------------------------- |
| README.md                        | how to consume the package, tokens, provenance           |
| HANDOFF.md                       | start prompt for the first procedure session (Dutch)     |
| docs/THEMING.md                  | kp-soft's maintainer guide, verbatim copy (2026-09-02)   |
| docs/CYBERPUNK_THEME_RESEARCH.md | kp-soft's cyberpunk research, verbatim copy (2026-09-02) |
| docs/SCOPE.md                    | to be written in Phase 0                                 |
