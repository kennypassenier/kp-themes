# kp-themes 🎨

**Project:** kp-themes — the house theme system as a shared package
(`@kp-soft/themes`), and the reference every other project of Kenny's
points at so his apps look like one family. Web today; GUI (Avalonia) and
TUI (Ratatui) later.

**State:** `v5.0.0` is **published** (2026-09-09) at
<https://github.com/kennypassenier/kp-themes/releases/tag/v5.0.0>, and
`5.1.0` is being prepared on top of it from chassis-rs's adoption
feedback (CF1-CF4): a `consumer.tar` release asset built from the
manifest, a dist bundle that exports every published module, and the two
register-loading routes written down with their measurements. 4.0.0 was
released 2026-09-07.
Round six rebuilt cyberpunk on signal yellow, added synthwave as the
twenty-fifth theme, and lifted every remaining theme from its own approved
demo (S48), so all twenty-five carry a register. It ships the fonts (seven
renamed under the OFL), the six-hook vocabulary, the `theme-font-mono`
token, the marquee and the menu caption, and a minified build.
3.2.0 before it It carries round
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

**Enforcement:** `npm run gates` — thirty-two checks — before every commit,
run by the git hook in `.claude/hooks/gates.sh`. No CI: Kenny runs the
browser suite himself (see the rule of 2026-09-09 below). Node 26
(`.nvmrc`). All artefact text in English.

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

## Project rule from correction KT14 (2026-09-08)

A register answers the parts that only show on interaction, not only the
component roots. The nav dropdown is the first: `REQUIRED_PARTS` in
`gates/check-register-coverage.mjs` refuses a register without a rule for
`.kp-nav__menu`, in `npm run gates` and the commit hook. Nineteen concept
demos styled the bar and left the menu alone, and opening it pulled Kenny
out of the theme; a brief for a concept demo names the dropdown as a thing
to style, and Claude opens the menu before publishing. Full record:
[docs/CORRECTIONS.md](docs/CORRECTIONS.md).

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

## Project rule from Kenny's decision of 2026-09-09 (no CI)

There is no CI. `.github/workflows/ci.yml` is deleted and `main` requires
no status check — 254 runs in five days and 35.9 hours of waiting, on a
project whose every change Kenny approves himself.

**Amended 2026-09-12 (Phase 8).** This used to add "and nothing runs on a
server", which is not true and has not been since the decision was made.
Two workflows remain and both fire: `.github/workflows/release.yml` on a
`v*` tag, which runs the gates, writes the checksums and creates the draft
release — the answer to `KT9`, where a hand-built release published a
`SHA256SUMS` covering three files instead of ten — and
`.github/workflows/pages.yml` on a push to `main`, which publishes the
documentation site. What was deleted is the CI that ran on every commit
and made Kenny wait; what remains is the machinery that builds a release
so a person does not build it by hand. A doc-writer drafting the runbook
checked the claim instead of repeating it, which is the whole point of
drafting from code. Five commands replace it, and three of them are his to give — his to GIVE, amended 2026-09-10: the decision is his and
the keyboard work need not be (see the rule from correction fix-2 below):

| Command                 | What                                                             | When                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm run gates`         | the thirty blocking checks, seconds                              | every commit, by the hook                                                                                                     |
| `npm run test:affected` | the specs a change touches, Firefox only                         | once before each report or commit — during the building itself it is the single spec file, see the 2026-09-11 amendment below |
| `npm run test:browser`  | the whole suite, both engines                                    | before a release: Claude asks in a form, Kenny gives the go, Claude runs it. Outside a release: when Kenny asks               |
| `npm run advice`        | contrast, invariants, motion, texture                            | when Kenny wants the reading                                                                                                  |
| `npm run verify`        | all three in order, naming the phase it is in and what each cost | before a release, on his go — the same form                                                                                   |

The accessibility floors are **advice, not gates** [Kenny, 2026-09-09]:
contrast, the design invariants, the flash threshold, the reduced-motion
guards and the texture ceiling are measured and printed, never refused,
and no list of per-theme exceptions is kept any more —
`gates/texture-pending.json` and `textureOpacityCeiling.perTheme` are
gone. README.md and `docs/DESIGN_INVARIANTS.md` say plainly what that
costs, so the package does not claim to enforce what it does not.

Two rules keep the smaller runs honest: `retries` is 0 and stays 0 (a
test that needs a retry is not a test — Kenny, 2026-09-09), and
`forbidOnly` is on always, because nothing downstream is left to catch a
stray `.only`.

This retires correction KT12's measure together with the CI it guarded;
the record and the reasoning are in
[docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from correction KT16 (2026-09-09)

A browser test reads the paint **until** it is the value, never once. A
bare `getComputedStyle` after a click, a hover or a press has one moment
and no second chance, so a value that arrives a tick later leaves the test
red for good — which is how two retro tests failed in Kenny's own verify
run and passed on their own. `tests/paint.mjs` holds the retrying readers
(`style`, `pseudoStyle`, `measured`) and `bootGone`, and the 63 sites in
the register specs that read after an action now use them.

Two things came with it. A click on the boot overlay's Skip resolves when
the click is dispatched, not when the overlay is gone, and that overlay is
fixed over the whole page — so twenty-two places now wait for it to
actually leave. And `js/effects.js` gained `data-kp-reveal-state`
(`armed` · `rest` · `played`) beside the `kp-reveal` event: a state a test
or a consumer can read at any time, where before there was only a moment
you had to have been listening for.

Discipline-enforced for the habit, code-enforced for the state. Full
record: [docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from correction fix-2 (2026-09-10)

The whole browser suite is not Claude's to start. `npm run test:browser`
is `playwright test` — 2528 tests, both engines — and the no-CI table
gives it to Kenny. Claude ran it anyway, and it emptied `test-results/`
with his two failing tests still in it; only a copy taken beforehand kept
the evidence alive.

**Kenny's amendment, the same day, for this project only.** Before a
release Claude ASKS in a form whether it may run the suite, and with his
go Claude runs it. His words: _"Dan beslis ik nog altijd en moet ik niet
zelf die test laten draaien."_ The decision stays where it was; the
typing moves. Outside that moment nothing changes — the whole suite is
still his to ask for, and it does not widen to other projects.

During work the command is `npm run test:affected` and nothing else: it
runs the specs a change touches, in firefox alone, because Kenny's own
browser is a firefox derivative and firefox has been the odd engine here
fourteen times against chromium's six. Where a drill wants the second
engine, Claude asks rather than decides.

**Amended 2026-09-11, and this is the half that costs the time.**
`test:affected` falls back to the whole suite for any change to a
stylesheet or a module, by design — `gates/affected.mjs` says so in its
own comment, because a map subtle enough to split them would be wrong
where nobody looks. In practice that means nearly every step Claude takes
runs everything: 1293 tests, three and a half minutes, dozens of times in
one session, to check five. Kenny noticed from the other side — his
machine stuttering while a run was going — and asked whether all of it
was needed.

The answer is the RHYTHM, not the count. While building, Claude runs the
one spec file being worked on (`npx playwright test tests/<file>.spec.mjs
--project=firefox`, measured at 3.6 seconds against 3.5 minutes), and
runs `npm run test:affected` once before each report or commit. The bar
on the tests themselves does not move: rule 7e still drives every
assertion red, rule 8 still turns every live-found fault into a test
first, and the milestone gate still carries its coverage item.

Workers are capped at `50%` in `playwright.config.mjs` for the same
reason — Playwright's default is every core, and on sixteen that makes
the desktop unusable while a run goes. `KP_TEST_WORKERS` overrides it.

Discipline-enforced. If it recurs, `test:browser` gains a guard that
refuses unless an environment variable only Kenny sets is present. Full
record: [docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from correction fix-1 (2026-09-10)

A value that **settles** and a value that **passes** are read in opposite
ways, and a test has to know which one it is looking at. A colour, a box
or a box-shadow arrives and stays, so the reader waits for it —
`tests/paint.mjs`, and now `wholeRing()` in `tests/ring.mjs` for the
focus ring. A finite animation does not stay: `animation-name` is the
keyframe while it runs and nothing afterwards, so waiting is not patience
but a race the fast machine loses. For those, the listener is armed
before the page exists — `recordAnimations()` and `animationsSeen()`.

This is KT16 a second time, one day later, and the reason it came back is
the reason §8 of the form protocol keeps writing down: KT16's measure was
written for the surface the fault appeared on — "a read after a click, a
hover or a press", 63 sites in the register specs — rather than for the
property it had. Kenny's verify run of 2026-09-10 failed on two reads
that were neither.

Discipline-enforced. The fallback KT16 named — refuse every bare
`getComputedStyle` in a spec, about 465 sites — is deliberately NOT taken:
it would not have caught either failure and would have pushed the
animation half into a poll that waits the full timeout for a value that
left before it started looking. If it recurs, the fallback is two narrow
gates instead: no spec read of `animationName` against a keyframe name,
and no `indicator()` outside `wholeRing()`. Full record:
[docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from correction KT13 (2026-09-08)

A browser test reads the paint, not the attribute: what the browser draws
(computed display, a bounding box, a pixel), never the DOM state the code
under test wrote itself. The package carries `[hidden] { display: none
!important }` in its base layer so a layout class never beats the
attribute; `tests/hidden.spec.mjs` holds it. Discipline-enforced for the
test habit, code-enforced for the rule. Full record:
[docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Project rule from Kenny's answer of 2026-09-08 (the demo is exact)

An approved concept demo is implemented **exactly** — every token, every
element, every mechanism — for the theme it was approved for. A test or a
gate that says the demo must change (contrast, a design invariant, KT8,
a fixture test) does not change the implementation: it produces a
**finding** that is put to Kenny, and only his explicit approval changes
a value the demo showed. Until he answers, the deviation is not made and
the push to `main` waits. Kenny had already read C5 this way for the
cyberpunk lift ("the demo exact, compare as a measured diff"); the retro,
terminal and brutalism lifts each recorded a list of "renders differently
on purpose" without asking, which is the fault recorded as KT15 in
[docs/CORRECTIONS.md](docs/CORRECTIONS.md). Recorded as S49 in
[docs/SCOPE.md](docs/SCOPE.md). Discipline-enforced; the measured diff of
the compare page (R6-Q4) is the mechanical half.

## Round six — the next cyberpunk (opened 2026-09-07)

Kenny wants a cyberpunk that "spits off the screen": signal yellow with
blood-red tints and a little neon, the cyberpunk.net navbar geometry,
notched buttons with a slit, a razor tear between sections, decipher,
one-shot glitch, redactions that clear. It replaces the current theme
under the same name in a new major; 4.0.0 stays what it shipped (S20).
Scope S38–S46 in `docs/SCOPE.md`; the measured references in
`docs/legacy/CYBERPUNK_THEME_RESEARCH.md`. Three rules came out of the gate:
DI5 findings are reported, not silently corrected (S42); meaning lives in
the HTML and expression in the theme, through a hook vocabulary every
theme must answer (S45); and the concept demo, same structure and
elements, is the gate every new theme passes before integration (S46).
The demo lives at
<https://claude.ai/code/artifact/f1cb3978-0bd7-4108-a329-971b0a2afe89>
until it becomes a template in the repository.

## Procedure status

| Field               | Value                                                                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current phase       | **Round seven (6.0.0), Phase 9 — releasing.** The gate was answered on 2026-09-12: semver and field test signed, both faults Kenny found at the live page repaired, the second engine deferred to the next round |
| Last completed gate | **Phase 9's report, 2026-09-12.** Kenny opened the documentation site and found two faults no assertion had thought to make — `fix-17` — and then gave the go: tag and publish                                   |
| Next gate           | Phase 10, the retrospective, whose outcome is a reviewed diff on `~/Projects/dev-procedure`                                                                                                                      |
| Open queue items    | Seven, and not one is Claude's to close: `step-2`, `fix-9-M1`, `KT6-M1`, `HA4`, `gap-9`, `fix-16-M1` and `fix-17-M1`                                                                                             |
| AFK mode            | off                                                                                                                                                                                                              |

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
now holds them all with English defaults, reachable through a `strings`
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

| Doc                                     | Purpose                                                   |
| --------------------------------------- | --------------------------------------------------------- |
| README.md                               | how to consume the package, tokens, provenance            |
| HANDOFF.md                              | start prompt for a procedure session (Dutch)              |
| docs/SCOPE.md                           | the approved Phase 0 scope (S1-S18, B1)                   |
| docs/INVENTORY.md                       | the Phase 1 inventory, 99 units with IDs                  |
| docs/REALIZATION_PLAN.md                | the eleven milestones, the enforcement, the gate log      |
| docs/FEATURES.md                        | the frozen feature list with its test bars (TH1-TH36)     |
| docs/ARCHITECTURE_DECISIONS.md          | the tech choices (T1-T9); Phase 4 adds AR* and freezes it |
| docs/DESIGN_INVARIANTS.md               | what must hold in every theme (DI1-DI11)                  |
| docs/COVERAGE_GAPS.md                   | what the themes do not reach yet, in five groups          |
| docs/CORRECTIONS.md                     | live-found faults and their approved measures             |
| docs/MINI_ROUNDS.md                     | open measurements and mini-rounds                         |
| docs/REQUESTS_FROM_CONSUMERS.md         | what the consumers asked for, 2026-09-03                  |
| docs/legacy/THEMING.md                  | kp-soft's maintainer guide, verbatim copy (2026-09-02)    |
| docs/USER_GUIDE.md                      | how a consumer builds a page with this                    |
| docs/ADOPTION_PROMPTS.md                | the two consumer prompts, one per project (Dutch)         |
| docs/TROUBLESHOOTING.md                 | when it looks wrong, or a check says no                   |
| docs/ARCHITECTURE_REFERENCE.md          | the system as built, as opposed to as decided             |
| docs/TEST_PLAN.md                       | what is tested, where, and what deliberately is not       |
| docs/LAYOUT.md                          | the nineteen layout classes and their eighteen knobs      |
| docs/UTILITIES.md                       | the 118 generated utility classes                         |
| docs/MINIFIED.md                        | the minified build and its per-file sizes (generated)     |
| docs/GENERIC_SWEEP.md                   | the KT6 audit: every feature configurable                 |
| docs/LIFT_PLAN.md                       | the nineteen lifts of round six, one row each             |
| docs/RESEARCH_2026-09.md                | the measured references the lifts were built from         |
| docs/THEME_CANDIDATES.md                | the twenty-one candidates thirteen themes came from       |
| docs/legacy/CYBERPUNK_THEME_RESEARCH.md | kp-soft's cyberpunk research, verbatim copy (2026-09-02)  |
| docs/legacy/README.md                   | what the two copied documents are, and what replaced them |
| docs/DEBUGGING_GUIDE.md                 | symptom to cause, and what to look at first               |
| docs/OPERATIONS_RUNBOOK.md              | the numbered procedures a maintainer performs             |
| docs/ID_TRANSLATIONS.md                 | the KT10 renames, one row each                            |
| docs/THEME_VERDICTS.md                  | what each theme was judged to need, and why               |
