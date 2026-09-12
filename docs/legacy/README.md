# Legacy documents

Two documents that describe a state this package has left. They are kept
verbatim rather than corrected, because their worth is precisely that
they say what was true when kp-themes was extracted from kp-soft on
2026-09-02 (commit `2983abb`). Correcting them would destroy the only
thing they are for.

| Document | What it is | What replaced it |
| -------- | ---------- | ---------------- |
| [THEMING.md](THEMING.md) | kp-soft's maintainer guide for the house themes, copied whole. Its file paths are claims about THAT repository, not this one. | [../USER_GUIDE.md](../USER_GUIDE.md) for consuming the package, [../OPERATIONS_RUNBOOK.md](../OPERATIONS_RUNBOOK.md) for maintaining it |
| [CYBERPUNK_THEME_RESEARCH.md](CYBERPUNK_THEME_RESEARCH.md) | kp-soft's research behind the first cyberpunk theme. Round six rebuilt that theme on signal yellow from new measurements, so this describes a design the package no longer ships. | [../RESEARCH_2026-09.md](../RESEARCH_2026-09.md), and `docs/CYBERPUNK_THEME_RESEARCH.md`'s successor measurements in it |

**Nothing here is maintained.** A claim in one of these files is a fact
about the past, and `gates/check-docs-runnable.mjs` deliberately does not
check their paths for that reason.

Moved here 2026-09-12 (Phase 8). Everything else in `docs/` is either
current or a dated record of this project's own rounds — a record is
history, which is not the same as legacy, and it stays where it is.
