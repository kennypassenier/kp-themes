# kp-themes 🎨

**Project:** kp-themes — the house theme system as a shared package
(`@kp-soft/themes`), and the reference every other project of Kenny's
points at so his apps look like one family. Web today; GUI (Avalonia) and
TUI (Ratatui) later.

**State:** 3.2.0 is tagged (`v3.2.0` on `77f8226`, 2026-09-07) with its
draft release built by `.github/workflows/release.yml` — six assets and a
34-line `SHA256SUMS` — **awaiting Kenny's own publish**. It carries round
four: a layout layer, a 118-class utility API, cascade layers, a spacing
and typography scale, the tables, a loud fallback, ten example pages, the
documentation site at <https://kennypassenier.github.io/kp-themes/>, a
dist bundle and a density mode. 3.1.1 before it took the themes to
twenty-four (thirteen new, chosen from twenty-one candidates in
`docs/THEME_CANDIDATES.md`), with two knobs, a second register and a
side-by-side showcase.
The package began as an extraction from kp-soft (commit `2983abb`,
2026-09-02); Phase 0 approved that base for use but explicitly **not** the
picker — see S17 in [docs/SCOPE.md](docs/SCOPE.md); the picker was
approved at L4.

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

## Project rule from correction KT6 (2026-09-05)

Every state a component sets on the consumer's behalf has a named way out
— a prop, a callback, an event detail, a handle or an exported function —
and every feature of every component is configurable with a default.
"Configurable" stops at an invariant: a knob that could put an animation
under DI5's flash threshold is not offered. Code-enforced where a test can
pin it (a test per state that sets it and opens it, both channels);
discipline-enforced as a rule, because no gate can tell a prop-derived
`disabled` from an internal one. The audit that measured the package
against this rule is `docs/GENERIC_SWEEP.md`. Full record:
[docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from correction KT5 (2026-09-05)

No user-visible string is written into the code that renders it. Every
one comes from `js/strings.js`, English by default, and a consumer
replaces any of it through a `strings` prop, a `StringsProvider` or
`setStrings()` — the screen-reader-only announcements included, because
those fail silently and only for the people who cannot see that they
failed. Code-enforced: `gates/check-strings.mjs` runs in `npm run gates`.
Full record: [docs/CORRECTIONS.md](docs/CORRECTIONS.md).

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

## Project rule from correction KT10 (2026-09-07)

One ID means one thing. A symbol defined in two of this project's
documents is refused by `gates/check-ids.mjs`, which runs in `npm run
gates` and in the commit hook — with an exception list for the handful of
genuine cross-references, each carrying its reason. `docs/INVENTORY.md`
has its own `INV-` namespace, because it documents units and has no claim
on the T, D or F series the other documents use.

Code-enforced, deliberately: the four rules above this one rest on
discipline, and this fault happened precisely because a person did not
look something up. A frozen Essential feature went unbuilt through five
milestones, a merge, 1302 browser tests and a combined report, because
D3 meant `STRINGS_NL` in the feature list and something else in the
architecture text. Full record: [docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from Kenny's answer of 2026-09-07 (TH115)

The token contract is a floor, not a ceiling. When a theme, a component or
an element needs a token the contract does not have, the token is added
and **every other theme declares it in the same change** — the parity
gate stays at 100% at every commit, and nothing a concept demo showed is
lost for want of a token. Code-enforced by `gates/check-tokens.mjs`
(parity) and discipline-enforced for the "in the same change" half.
Recorded as S47 in [docs/SCOPE.md](docs/SCOPE.md).

## Project rule from correction KT11 (2026-09-08)

The approved concept demo is an inventory, not a description.
`showcase/concept-demo.json` names every element of the approved demo with
the text the generated page must carry, and a unit test in
`gates/gates.test.mjs` refuses `examples/concept.html` when one is missing.
When the demo is replaced (S46, for synthwave and every theme after), the
inventory changes in the same commit. Code-enforced for presence;
discipline-enforced for appearance, through Kenny's own look at the URL.
Full record: [docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from correction KT12 (2026-09-08)

The push chain reads `gh run view --json conclusion,jobs` for the exact
sha and moves `main` only when every job says success; an empty run id or
a watch exit code never counts. `main` requires both CI jobs (`gates` and
`browser`) as status checks since 2026-09-08, so GitHub refuses what the
chain would miss. Full record: [docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from correction KT13 (2026-09-08)

A browser test reads the paint, not the attribute: what the browser draws
(computed display, a bounding box, a pixel), never the DOM state the code
under test wrote itself. The package carries `[hidden] { display: none
!important }` in its base layer so a layout class never beats the
attribute; `tests/hidden.spec.mjs` holds it. Discipline-enforced for the
test habit, code-enforced for the rule. Full record:
[docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Round six — the next cyberpunk (opened 2026-09-07)

Kenny wants a cyberpunk that "spits off the screen": signal yellow with
blood-red tints and a little neon, the cyberpunk.net navbar geometry,
notched buttons with a slit, a razor tear between sections, decipher,
one-shot glitch, redactions that clear. It replaces the current theme
under the same name in a new major; 4.0.0 stays what it shipped (S20).
Scope S38–S46 in `docs/SCOPE.md`; the measured references in
`docs/CYBERPUNK_THEME_RESEARCH.md`. Three rules came out of the gate:
DI5 findings are reported, not silently corrected (S42); meaning lives in
the HTML and expression in the theme, through a hook vocabulary every
theme must answer (S45); and the concept demo, same structure and
elements, is the gate every new theme passes before integration (S46).
The demo lives at
<https://claude.ai/code/artifact/f1cb3978-0bd7-4108-a329-971b0a2afe89>
until it becomes a template in the repository.

## Procedure status

| Field               | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current phase       | Round six (5.0.0), Phase 6: C0–C5 built and ratified (the compare page signed off in its third version, 2026-09-08); the synthwave concept demo "Outrun Horizon" approved; SW0–SW4 ratified 2026-09-08 (synthwave in the package); **C6 ratified 2026-09-08** (renamed fonts, MIGRATION 5.0.0, the documents, `5.0.0-alpha.1`, R6-Q2 decided: dark at 0.06); the alpha tag `v5.0.0-alpha.1` on the verified main sha; next: phantom (LIFT_PLAN row 2) — the shape of a theme round is the next decision |
| Last completed gate | Round six Phase 5 (2026-09-07): C0–C6 agreed, all six gates blocking, an alpha tag after C6, AFK from C0 to C5 with one ratification report                                                                                                                                                                                                                                                                                                                                                             |
| Next gate           | C5 — the combined AFK ratification form plus the concept demo URL Kenny opens                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Open queue items    | R6-Q1 (Reserved Font Names), R6-Q2 (DI9's ceiling), R6-Q3 (AR42's copy clause), R6-Q4 / MR-R6-COMPARE (the compare page, reopened 2026-09-08 on Kenny's second reading — one page per theme, pending his V1 answer), R6-Q6 (nishiki over the font budget); KT6-M1, PROC-H1, MR-R6-1, MR-R6-2. Closed: R6-Q5 (KT12, measured on a02d31f)                                                                                                                                                                 |
| AFK mode            | on, C0 to C5 (Kenny, 2026-09-07)                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

Correction KT6 reopened the project a third time on 2026-09-05 — a busy
button with no way back, found by JobTracker's login — and Kenny's answer
to its measure widened it into the generic sweep that became 3.0.0: every
feature of every component configurable, pure modules, the page's locale,
English labels, a `--kp-*` scale. `docs/GENERIC_SWEEP.md` is the audit and
the record.

Correction KT5 reopened the project a second time on 2026-09-05, and the
answer is 2.0.0. Every user-visible string was written into the component
that renders it, in Dutch, with no way for a consumer to pass a different
one — the fault is not the language but the missing door, and JobTracker
had adopted only the components that carry no text at all. `js/strings.js`
now holds all 72 with English defaults, reachable through a `strings`
prop, a `StringsProvider` or `setStrings()`; `STRINGS_NL` keeps the old
words as one import. `gates/check-strings.mjs` refuses a literal outside
the dictionary and was drilled red in all four shapes — it passed the
screen-reader case on the first attempt, which is the case KT5 exists
about. Kenny's answer also closed two gaps that are not about language:
`FormField` renders select, textarea, checkbox and radio (TH61), and
`NavBar`, `Breadcrumb` and `Pagination` take a `linkComponent` (TH62).

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
