# Project rules

The rules this project works under, moved here from `CLAUDE.md` on
2026-09-13 (round eight, decision `scope-37`) so that the file every turn
reads carries the status and the commands, and this one carries the
reasoning. Nothing was dropped in the move; the text below is the text
that stood in `CLAUDE.md`, section by section. Each rule says whether it is
code-enforced (a gate, a hook, a test) or discipline-enforced; the code
half needs no reading to hold, the discipline half is read at the step it
applies to — `docs/CYCLE.md` says which step. The full record of each
correction is in [CORRECTIONS.md](CORRECTIONS.md).

## Correction KT1 (2026-09-03) — claims are checked in the same turn

Every claim in a form's explanation that is checkable on this machine is
checked in the same turn the form is written, and the explanation names
the file and line. A claim taken from another document carries that label
("measured by the JobTracker session") rather than a bare "measured".
This applies to the sentences a decision rests on — those asserting a
fact about the code or about another project — not to background or
reasoning. Discipline-enforced, not code-enforced.

## Correction KT3 (2026-09-04) — a browser test is made to fail first

A browser test that asserts the package applies something is made to
fail before it is trusted: remove the rule in the package that carries it,
confirm the test goes red, restore it, and record in one line of comment
what was removed. Discipline-enforced. The mechanical half is code —
`gates/check-layers.mjs` refuses a bare-element selector in
`showcase/showcase.css`, because that stylesheet is inlined into every
fixture page and would otherwise supply the very thing under test.

## Correction KT6 (2026-09-05) — every state has a way out

Every state a component sets on the consumer's behalf has a named way out
— a prop, a callback, an event detail, a handle or an exported function —
and every feature of every component is configurable with a default.
"Configurable" stops at an invariant: a knob that could put an animation
under DI5's flash threshold is not offered. Code-enforced where a test can
pin it (a test per state that sets it and opens it, both channels);
discipline-enforced as a rule, because no gate can tell a prop-derived
`disabled` from an internal one. The audit that measured the package
against this rule is `docs/archive/GENERIC_SWEEP.md`.

## Correction KT5 (2026-09-05) — no string in the code that renders it

No user-visible string is written into the code that renders it. Every
one comes from `js/strings.js`, English by default, and a consumer
replaces any of it through a `strings` prop, a `StringsProvider` or
`setStrings()` — the screen-reader-only announcements included, because
those fail silently and only for the people who cannot see that they
failed. Code-enforced: `gates/check-strings.mjs` runs in `npm run gates`.

## Correction KT14 (2026-09-08) — a register answers the interaction parts

A register answers the parts that only show on interaction, not only the
component roots. The nav dropdown is the first: `REQUIRED_PARTS` in
`gates/check-register-coverage.mjs` refuses a register without a rule for
`.kp-nav__menu`, in `npm run gates` and the commit hook. Nineteen concept
demos styled the bar and left the menu alone, and opening it pulled Kenny
out of the theme; a brief for a concept demo names the dropdown as a thing
to style, and Claude opens the menu before publishing.

## Kenny's answer of 2026-09-04 — a source, not a service

kp-themes is a **source**, not a service, and it makes one promise: a
released version of a theme never changes. Any change to a theme raises
the version — no in-place correction, not even of a value that is plainly
wrong. Recorded as S20 in [SCOPE.md](SCOPE.md).

It follows that this project builds **no tooling for consumers**: no sync
command, no adapter, no per-consumer fixture. Both this project and the
projects using it are run by an LLM working from the latest version; a
consumer arranges its own integration and asks for what it needs. A
request inside the scope — a component, a type, a token — is the supported
way to get one. Scope stays: define themes, build components on them.

## Correction KT10 (2026-09-07) — one ID means one thing

One ID means one thing. A symbol defined in two of this project's
documents is refused by `gates/check-ids.mjs`, which runs in `npm run
gates` and in the commit hook — with an exception list for the handful of
genuine cross-references, each carrying its reason. `docs/archive/INVENTORY.md`
has its own `INV-` namespace, because it documents units and has no claim
on the T, D or F series the other documents use.

Code-enforced, deliberately: the rules above this one rest on discipline,
and this fault happened precisely because a person did not look something
up. A frozen Essential feature went unbuilt through five milestones, a
merge, 1302 browser tests and a combined report, because D3 meant
`STRINGS_NL` in the feature list and something else in the architecture
text.

## Kenny's answer of 2026-09-07 (TH115) — the token contract is a floor

The token contract is a floor, not a ceiling. When a theme, a component or
an element needs a token the contract does not have, the token is added
and **every other theme declares it in the same change** — the parity
gate stays at 100% at every commit, and nothing a concept demo showed is
lost for want of a token. Code-enforced by `gates/check-tokens.mjs`
(parity; since scope-76 a commit runs it through the TH22 tests in
`npm test`) and discipline-enforced for the "in the same change" half.
Recorded as S47 in [SCOPE.md](SCOPE.md).

## Correction KT11 (2026-09-08) — the approved demo is an inventory

The approved concept demo is an inventory, not a description.
`showcase/concept-demo.json` names every element of the approved demo with
the text the generated page must carry, and a unit test in
`gates/gates.test.mjs` refuses `examples/concept.html` when one is missing.
When the demo is replaced (S46, for synthwave and every theme after), the
inventory changes in the same commit. Code-enforced for presence;
discipline-enforced for appearance, through Kenny's own look at the URL.

## Kenny's decision of 2026-09-09 — no CI

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
so a person does not build it by hand. Five commands replace it, and three
of them are his to GIVE (amended 2026-09-10: the decision is his and the
keyboard work need not be — see correction fix-2 below):

| Command                 | What                                                             | When                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm run gates`         | the blocking checks; a check whose inputs did not move is skipped [gate-cache, 2026-09-16], and a document whose sources moved stops the commit until `npm run drift:seen` [scope-78] | every commit, by the hook — in full on the first commit of each day and whenever `GATE_FULL=1` |
| `npm run test:tags`     | the tests tagged with what a change touches, Firefox only        | `--level building` while building, `--level commit` once before each report or commit — scope-33, replacing `test:affected` |
| `npm run test:browser`  | the whole suite, both engines                                    | before a release: Claude asks in a form, Kenny gives the go, Claude runs it. Outside a release: when Kenny asks               |
| `npm run advice`        | contrast, invariants, motion, texture, variant grounds, compliance, baseline, prettier [scope-76] | when Kenny wants the reading                                                                                                  |
| `npm run verify`        | all three in order, naming the phase it is in and what each cost | before a release, on his go — the same form                                                                                   |

**A check that cannot see anything change does not run** [Kenny,
2026-09-16]. Every check in `.claude/hooks/gates.sh` goes through
`gate` or `gate_glob` from `.githooks/gate-cache.sh`. While a check runs
it is loaded under `.githooks/trace-inputs.cjs`, which records every path
it opens; the next commit hashes exactly those paths and skips the check
when the hash has not moved. Nobody writes or maintains the list — it is
rewritten by every green run.

Measured on this repository before it was built: over the last 200
commits, 30 checks amount to 6000 runs, of which 4239 (70%) could not
have found anything. `gates/check-fonts.mjs` ran 200 times and was
relevant twice; `gates/generate-ha-themes.mjs --check` once. The chain's
8.79 s per commit falls to 4.19 s.

Three properties make it safe, and none of them is configurable: only a
green run is remembered, so a failure always runs again; the check's own
source is part of its input set, so editing a check re-runs it; and the
cache lives in `.git/gate-cache`, so it never travels and a fresh clone
runs everything. On top of that the cache is ignored entirely on the
first commit of each day and whenever `GATE_FULL=1` is set, which bounds
an incomplete input set to one working day.

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

This retires correction KT12's measure together with the CI it guarded.

## Correction KT16 (2026-09-09) — a test reads the paint until it is the value

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

Discipline-enforced for the habit, code-enforced for the state.

## Correction fix-2 (2026-09-10) — the whole suite is Kenny's to start

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

During work the command was `test:affected` (retired at scope-33) and nothing else: it
runs the specs a change touches, in firefox alone, because Kenny's own
browser is a firefox derivative and firefox has been the odd engine here
fourteen times against chromium's six. Where a check wants the second
engine, Claude asks rather than decides.

**Amended 2026-09-11, and this is the half that costs the time.**
`test:affected` falls back to the whole suite for any change to a
stylesheet or a module, by design — `gates/affected.mjs` (removed at
scope-33) said so in its own comment, because a map subtle enough to split them would be wrong
where nobody looks. In practice that means nearly every step Claude takes
runs everything: 1293 tests, three and a half minutes, dozens of times in
one session, to check five. Kenny noticed from the other side — his
machine stuttering while a run was going — and asked whether all of it
was needed.

The answer is the RHYTHM, not the count. While building, Claude runs the
one spec file being worked on (`npx playwright test tests/<file>.spec.mjs
--project=firefox`, measured at 3.6 seconds against 3.5 minutes), and
runs `test:affected` (now `npm run test:tags -- --level commit`) once before each report or commit. The bar
on the tests themselves does not move: rule 7e still drives every
assertion red, rule 8 still turns every live-found fault into a test
first, and the milestone gate still carries its coverage item.

Workers are capped at `50%` in `playwright.config.mjs` for the same
reason — Playwright's default is every core, and on sixteen that makes
the desktop unusable while a run goes. `KP_TEST_WORKERS` overrides it.

Discipline-enforced. If it recurs, `test:browser` gains a guard that
refuses unless an environment variable only Kenny sets is present.
**Round eight replaced `test:affected` with tags** (decision `scope-33`,
2026-09-14): `tests/tags.json`, `npm run test:tags`, and the three
gradations in `docs/CYCLE.md`. **A theme sweep became a level too**
(`scope-103`, 2026-09-16): a test declared once per theme runs on formal,
dark and cyberpunk while building and at the commit, and on all 22 at the
release level. A spec asks `sweepThemes()` from
`tests/helpers/sweep-themes.mjs` for the list rather than reading
`themes/order.json` itself; `gates/run-tags.mjs` sets `KP_SWEEP_THEMES`
per level, and an unset variable still means all 22. Narrow a loop only
when its faults have never been one theme's — four are named in that
helper's head and stay whole.

## Correction fix-1 (2026-09-10) — a value that settles, a value that passes

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
and no `indicator()` outside `wholeRing()`.

## Correction KT13 (2026-09-08) — a test reads the paint, not the attribute

A browser test reads the paint, not the attribute: what the browser draws
(computed display, a bounding box, a pixel), never the DOM state the code
under test wrote itself. The package carries `[hidden] { display: none
!important }` in its base layer so a layout class never beats the
attribute; `tests/hidden.spec.mjs` holds it. Discipline-enforced for the
test habit, code-enforced for the rule.

## Kenny's answer of 2026-09-08 — the demo is exact

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
[CORRECTIONS.md](CORRECTIONS.md). Recorded as S49 in [SCOPE.md](SCOPE.md).
Discipline-enforced; the measured diff of the compare page (R6-Q4) is the
mechanical half.

## Kenny's answer of 2026-09-14 (scope-80, scope-82) — a new theme keeps the median's sizes

A theme changes how the package looks, not how big it is. Since option E
(`scope-80`) controls and table rows take their height from the package
(`--kp-control-height`, `--kp-row-height`, `--kp-control-line-height`) and
`gates/box-metrics.test.mjs` refuses a register that sets them. A new theme
goes further: its type sizes, paddings and gaps stay as close as possible to
the median theme's — titanium, index 1.008 on 2026-09-14 in
`research/uniform-size/` — so no new drift in element sizes enters with it.
Discipline-enforced for now: before a new theme is integrated, Claude runs
`research/uniform-size/measure.mjs` and `analyze.mjs` over it and reports its
size index beside the median's in the integration form. Since option B
(`scope-87`) headings, card, dialog and footer titles, form labels and help
text, tabs, badges, bar, menu and side-navigation links, the breadcrumb and
the pagination take their type size, line height and block padding from the
package too, at titanium's values; the same gate refuses a register that sets
them or restates their tokens. A register keeps colour, border, face, case,
letter spacing and ornaments.

## Round six — the next cyberpunk (opened 2026-09-07)

Kenny wanted a cyberpunk that "spits off the screen": signal yellow with
blood-red tints and a little neon, the cyberpunk.net navbar geometry,
notched buttons with a slit, a razor tear between sections, decipher,
one-shot glitch, redactions that clear. It replaced the theme under the
same name in a new major; 4.0.0 stays what it shipped (S20). Scope S38–S46
in `SCOPE.md`; the measured references in
`archive/legacy/CYBERPUNK_THEME_RESEARCH.md`. Three rules came out of the gate:
DI5 findings are reported, not silently corrected (S42); meaning lives in
the HTML and expression in the theme, through a hook vocabulary every
theme must answer (S45); and the concept demo, same structure and
elements, is the gate every new theme passes before integration (S46).
The demo lives at
<https://claude.ai/code/artifact/f1cb3978-0bd7-4108-a329-971b0a2afe89>
until it becomes a template in the repository.

## Kenny's answer of 2026-09-16 (scope-105) — a look is compared, not described

Kenny, answering a form that asked in prose whether dark's dropdown menu
should take the oxide halo: *"maak een demo om het verschil te zien. Doe
dit in het vervolg nog als er zulke keuzes zijn. Het is veel beter om
dingen met het oog te vergelijken dan een tekst te lezen en mijn
verbeelding te moeten gebruiken"*. So: a choice about how something looks
— a colour, a shadow, a shape, a motion — comes with a demo page showing
the options side by side on the real stylesheets, and the form links to
it. The prose says what each option costs and what it measures; the eye
does the comparing. A choice with no visible difference (a selector, a
gate, a test level) stays prose.

## Kenny's answer of 2026-09-16 (scope-106) — a comparison demo is minutes, not research

Kenny, when a comparison demo took nine minutes: *"de demo duurt nu al 9
minuten, terwijl het toch vrij simpel is? een bekende component naast een
licht aangepaste versie ervan draaien? dat kan toch sneller"*, and
*"kunnen we bv de demo pagina ook al vastleggen zodat enkel de componenten
zelf er in moeten geplaatst worden?"*. So the page is fixed once, in
`research/_compare/template.html`, and a demo is Claude copying it and
filling four slots. No agent, no measurement, no spec of its own — a
measurement only when the choice turns on a number, said out loud before
it is built.
