# Corrections — kp-themes

Live-found faults and what was decided about them. One section per
correction, filled in by Claude and approved field by field by Kenny
(FORM_PROTOCOL §8, nine fields). A correction is closed only when the
measurement in field 7 has actually happened; until then it sits in
[MINI_ROUNDS.md](MINI_ROUNDS.md).

## KT1 · A checkable claim asserted in a gate form without checking it

Approved 2026-09-03, all nine fields "Correct".

**1 · What went wrong.** In the third round of the Phase 0 gate, Claude
stated that "the page background" belonged to the remainder a Bootstrap
consumer still needs a bridge for, and estimated that remainder at 10-15
lines including it. Kenny caught it. Evidence, gathered only after his
answer: `css/themes.css:531-533` already contains
`body { background-color: var(--background); color: var(--foreground); }`,
so the theme applies the colour rather than only defining it;
`~/Projects/kyu/templates/layout.html` loads `bootstrap.min.css` on line
28 and `themes.css` on line 29, so ours comes later and wins; and
Bootstrap's own body rule carries no `!important`. All three were
checkable on this machine at the moment the form was written.

**2 · Which gate let it through.** None, and that is the finding. The
procedure requires evidence in two places — report-form items, and a
mini-round's proposal tested against reality — but a *claim in the
explanation of an approval form* falls under neither, while that is
exactly the text Kenny decides on.

**3 · Where else the same fault sits.** Claude re-read its own forms from
this session for claims presented as "measured" without being measured by
Claude. Two found, both taken from `docs/REQUESTS_FROM_CONSUMERS.md`
(written by the JobTracker session) and passed on as if verified here:
"three themes carry their own typeface" and "JobTracker emits no
`data-slot` attributes". Both were checked afterwards and both hold —
Fraunces at `css/themes.css:67`, Chakra Petch at `:227`, Share Tech Mono
at `:343`; zero `data-slot` hits in JobTracker's sources. Three claims
without first-hand checking, of which two happened to be right and one
was not: luck, not quality.

**4 · The measure.** Two rules. (a) Every claim in a form's explanation
that is checkable on this machine is checked in the same turn the form is
written, and the explanation names the file and line. (b) A claim taken
from another document carries that label — "measured by the JobTracker
session" — instead of a bare "measured". Not a duty to verify everything:
background and reasoning stay prose. It applies to the sentences a
decision rests on, recognisable because they assert a fact about the code
or about another project.

**5 · What the remedy costs.** For Claude, close to nothing: two or three
extra commands before each form — the same ones run after the fact here.
For Kenny, slightly denser forms. Set against a wrong claim that cost a
whole extra round. The failure mode to watch: citations on sentences that
decide nothing, which makes forms unreadable and protects nothing. Hence
field 9.

**6 · Who enforces it.** Discipline, not code — stated as such
deliberately. No hook or test can inspect prose that only ever exists in
a conversation. What helps: the rule lives in this project's `CLAUDE.md`,
so every session opened in this directory reads it before acting.

**7 · How and when it gets measured.** At the next form in this project
carrying checkable claims — the Phase 2 decision form on components and
missing tokens. Claude counts how many claims assert a fact about code or
another project, and how many of those carry a file:line or an explicit
second-hand label, and reports that count at the top of that form. The
measure works when the two numbers match. Queued in
[MINI_ROUNDS.md](MINI_ROUNDS.md) until it has happened.

**8 · The fallback if the measurement fails.** Switch to the strict form:
a form then contains only claims that carry a source, and everything
unverified becomes its own item asking "I do not know this — shall I
measure it?". Slower and longer, but it makes ignorance visible instead of
presenting it as fact.

**9 · When the measure is reviewed.** At this project's retrospective
(Phase 10). A rule without a review moment outlives its usefulness, and
being able to remove rules is the only thing that keeps the stack
readable.

### KT1's fallback, activated 2026-09-04

Field 8's fallback triggered at the Phase 7 gate, on Kenny's decision. The
measure had already failed once after being agreed: on 2026-09-03, after
KT1 was approved, Claude asserted that cyberpunk had no display face at
all in the plain-CSS consumers. Kenny looked at the live kyu dashboard and
saw Chakra Petch; both consumers set it themselves from their own
`theme-bridge.css`. The claim was checkable and was not checked.

The count KT1 asked for was finally taken at the Phase 7 gate form — nine
claims about code, nine carrying a file:line or a measured number, so they
matched. Kenny's answer was that one matching count does not undo a
measure that had already been broken, and that the fallback applies from
here.

**So, from 2026-09-04, in this project:** every claim in a form carries
its source, or it becomes its own item in that form. Not only the
checkable ones and not only the ones a decision rests on — every claim.
An assertion with no source is not softened with a hedge; it is either
sourced or it is asked.

## KT2 · A gate that checked one half of a two-halved property

Approved 2026-09-04, all nine fields "Correct". The measurement of field 7
happened in the same session; the correction is **closed**.

**1 · What went wrong.** L3 built the derived interaction states and
checked whether the text on such a state still reads. It never asked the
other question: whether the state is distinguishable from the colour it
came from. Measured 2026-09-04, the distance between a base colour and its
pressed state, on the OKLab scale where roughly 10 means "you can see that
it changed": formal 12.1, light 10.6, dark 10.7, pastel 11.4, forest 11.3 —
and cyberpunk 2.6 to 7.1, terminal 4.5 to 8.4. In those two themes,
pressing a control changed nothing anyone could see.

Two things were corrected during the round, both of them my own claims:

- I first reported that hover was under the threshold in every theme and
  that this was the fault. Hover is 2.4 to 3.4 everywhere, which is the
  same order as Material's 8% state layer. The outlier is the pressed
  state in the two opt-out themes, and the wider claim was wrong.
- I first measured the badge plates with a contrast ratio and read 1.04 to
  1.40, which sounds like an invisible badge. A contrast ratio compares
  luminance only, and those plates differ in hue; in perceptual distance
  they sit 5.6 to 12.6 from their card. The instrument was wrong, not the
  badges.

**2 · Which gate let it through.** `checkStates` in
`gates/check-invariants.mjs`. It reported "35 checks, all seven themes in
order" and covered the missing half with that number. AR8 asks a gate how
many things it checked; nothing asked whether they were the right 35.

**3 · Where else the same fault sits.** Stated as *a gate checks one half
of a two-halved property and reports green*, it was found twice more.
A: a badge's text is gated against its plate; the plate was never measured
against the surface it lies on. B: the visited link is held apart from the
link by the generator and by nothing else, so a hand-authored value would
slip past.

**4 · How we prevent recurrence.** Three things. `checkStateVisibility`
measures the missing half and was written failing, before the fix
(standing rule 8). The derivation lets the pressed state give up chroma
when lightness cannot reach the floor — a pressed neon sign desaturates,
which reads as pressed while keeping the hue those two themes are made of;
a theme that already cleared the floor on lightness alone comes back
byte-identical, so the five that were right are untouched. And the two
places from field 3 each got their check.

**5 · What the remedy costs.** Eight colours in cyberpunk and terminal
changed — the pressed state only, not the base colours. The generated
stylesheet changed, so a consumer who vendored it gets the change at their
next copy. The gate grew from 35 to 49 checks per run, which is not
measurable in its runtime.

**6 · Who enforces it.** Code-enforced: all three checks run in
`gates/check-invariants.mjs`, so in the pre-commit hook and in CI. The
floors are house numbers with their reasons in `gates/config.json` —
`stateVisibilityFloor` at 10 and `badgePlateFloor` at 5 — because WCAG
says nothing about state changes and neither number is a standard.

**7 · How we measured that it works, and when.** At the commit that
repairs the derivation. Before: 9 violations across cyberpunk, terminal
and light. After: 0, with all 28 interactive states at 10.1 to 12.1. The
two tests that pinned the fault were written to fail once it was fixed,
which forced them to be rewritten into their opposite — that rewrite is
the record that the measurement happened.

`light`'s `--destructive-active` sat at 9.996, four thousandths under the
floor. It needed no nudge in the end: the search had been testing the
unrounded colour while the stylesheet received the rounded one, and
testing the value as it is written fixed it. Rounding it away would have
hidden a real defect in the search.

**8 · The fallback if it had failed.** If moving chroma had broken the
themes — if cyberpunk's accent had lost its neon — the pressed state would
have been carried by a second channel instead: a visible border or an
inset shadow. Same logic as DI4 with badges: where colour cannot carry it,
shape does. Not needed.

**9 · When we review the measure.** At this project's retrospective
(Phase 10), against how often the floors actually stopped something.

## KT3 · A browser test that could not fail, and a green report that was not measured

Approved 2026-09-04, all nine fields "Correct".

**1 · What went wrong.** One test, two faults, and the second is the
serious one. The assertion `expect(faces.body).not.toMatch(/Times|serif$/i)`
in `tests/fixtures.spec.mjs` could not pass: `sans-serif` ends in `serif`,
so it failed in ten of the eleven themes and succeeded only in terminal,
whose stack ends in `monospace`. Evidence: CI runs 33870661665 and
33870268016, both `20 failed, 182 passed`, on the measured value
`"Instrument Sans", ui-sans-serif, system-ui, sans-serif`.

Underneath that, it could not have failed either. `showcase/showcase.css:9`
set a `body { font-family }` of its own, and that stylesheet is inlined
into every per-theme fixture page. The test measured the showcase's
furniture, not the package. Evidence: with the package's own rule deleted
from `css/_rules.css:95` — the file a consumer installs — the test ran
`11 passed`.

**2 · Which gate let it through.** Two, and the second is Claude.

The drill rule did not reach here. In this project every gate is driven
red before it is trusted, and that happened for all eleven: `npm test`
runs checks explicitly named "a violation is caught". For the *browser
tests* no such requirement existed, and this is the first one to need it.

And the report claimed green without measuring. Claude presented "182
browser tests in two browsers" as evidence at the release gate. Those 182
were the passing part of a run with 20 red tests, and the suite had not
been run at that commit — `npm run gates` deliberately excludes it (H1:
the fast gates block a commit, the browser tests block a merge). Local
green said nothing about the browser suite, and it was presented as one
number anyway. That is KT1's fault in a new place: a checkable claim,
not checked.

**3 · Where else the same fault sits.** The fault is *a check whose
subject is supplied by the check's own scaffolding*, which makes green a
statement about the scaffolding.

Measured on 2026-09-04: rules in `showcase/showcase.css` that target a
bare element rather than a `.sc-` class — exactly one, the `body` of line
9, which is this one. The other two fixture pages,
`tests/fixtures/picker.html` and `components.html`, contain zero `<style>`
blocks.

The precedent weighs more. In Phase 7 a check was found waiting on
`theme.tokens['link-visited']`, a token no theme declares; it could not
fail either. Twice the same shape in one project, both found by happening
to look. Not measured: whether each of the 202 browser tests guards
something the package supplies — which is why field 4 proposes a
mechanical measure rather than a promise to look harder.

**4 · The measure.** Three parts, and the difference between them is
marked on purpose.

(a) Done. The showcase furniture no longer sets a body typeface; it comes
from `css/_rules.css`. The test now asserts that the applied face is the
face the theme names, and was driven red with that rule removed.
`.sc-theme` keeps its `font-family`: that one is load-bearing, so each
block shows its own theme's face.

(b) The layer gate guards the scaffolding too. `gates/check-layers.mjs`
already refuses colour outside the token layer (DI9) across five
stylesheets; `showcase/showcase.css` was not among them. It is now, with
one added rule: the scaffolding may not carry a bare-element selector. An
exception is possible with its reason attached, the same shape as the
three non-theme colours already listed there. `body` is listed, for
`margin` and `line-height` only — furniture the package leaves to the
consumer.

(c) A browser test asserting "the package applies X" records its drill:
one line saying what was removed and that it went red. For that kind of
test, not for all 202.

**5 · What the remedy costs.** (b) costs almost nothing: one more file in
a list that already exists. The real risk is a false alarm — one day the
showcase legitimately wants to style a bare `table` or `pre`. Hence the
exception list with reasons, rather than a ban people route around by
switching the gate off.

(c) costs attention, and that is the expensive part. A drill means
remove, run, restore, run again: four steps nobody sees when they go
well. The failure mode is the comment arriving without the drill having
happened, which is worse than no rule, because it suggests evidence where
there is none.

Against that: this fault cost a red CI just before a tag, and the
previous one of the same shape was only found because someone happened to
be in that file.

**6 · Who enforces it.** (b) is code-enforced: the layer gate runs in
`npm run gates`, so in the commit hook and in CI. (c) is
discipline-enforced, written as such rather than dressed up as a
guarantee — no hook can read whether a drill actually happened, only that
a sentence is there. What helps is that the rule lives in this project's
`CLAUDE.md`, which a next session reads on opening; that is where KT1's
rule lives, and it has held since.

**7 · How we measured that it works, and when.** For (b), at the moment
of building it: the pre-fix `body { font-family }` was put back into
`showcase.css` and the new gate run. It reported
`showcase/showcase.css:9: \`body\` styles a bare element (margin,
font-family, line-height)` and exited 1; restored, it exits 0. Four unit
drills were added to `gates/gates.test.mjs` alongside it, including one
for a fault found while building the gate itself — the first parser read
the prose in a comment as five selectors, because the sentence mentioned
`body` and contained commas.

For (c), at the next browser test that asserts something about the
package: it gets its drill and its line of comment, and Claude reports in
that same turn what was removed and what went red. Until that has
happened, KT3 stays open in `docs/MINI_ROUNDS.md`.

**8 · The fallback if the measurement fails.** If (b) had not gone red,
the bare-selector rule would have been the wrong instrument, and the
showcase CSS would stop being inlined into the fixture pages: eleven
pages loading only the package stylesheets measure the package by
definition. It went red, so this did not trigger.

If (c) fails — that is, if another browser test is found that cannot fail
— the discipline rule lapses and a canary job enters CI: strip the
element rules from `css/_rules.css` and require the browser suite to go
red. Green against a gutted package means the suite guards nothing. That
job costs two minutes per run, which is why it is not proposed yet.

**9 · When we review the measure.** At this project's retrospective
(Phase 10), against whether the rule caught anything or only added noise.
Then again at the first project that vendors this package and builds
fixtures of its own — that is when it shows whether the rule carries
beyond this project, and so whether it moves up into the shared
procedure or stays here.

## KT4 · A package that promised a type and shipped none

Approved 2026-09-04, all nine fields "Correct"; field 4 answered "1.1.0
with the Theme union".

**1 · What went wrong.** The package shipped no type declarations at all.
Checked on the day: `package.json` had no `types`, no `typings`, and there
was not one `.d.ts` in the repository. A consumer resolving with NodeNext
therefore got seven errors, of which the two `TS7016`s are the root:
`js/theme-core.js` handed nothing to whoever imported it, and the
callbacks around it became `any`. JobTracker reported all seven with file
and line; their own code was clean, and 195 tests plus their production
build passed against 1.0.0. Only the typecheck stopped them.

Underneath that sat something worse than the messages. What the package
did promise was a `Theme` type — it is named in README, USER_GUIDE and the
ecosystem entry. `hooks/use-theme.js:31` read `/** @typedef {string} Theme
*/`. An alias for `string`, not a list of the eleven names, so
`applyTheme('formeel')` type-checked and fell back to `formal` at runtime.
JobTracker used that type for their config values and believed it
protected them.

**2 · Which gate let it through.** Three.

The type gate checks our code with our settings. `npm run check:types`
runs `tsc -p jsconfig.json` with `moduleResolution: "bundler"` and
`noUncheckedIndexedAccess: false`; JobTracker runs NodeNext with that flag
on. Our gate says nothing about what a consumer sees and cannot.

The completeness gate approved it. `gates/check-package.mjs` asks whether
every path `exports` promises exists and ships — all of them did. It has
no opinion about whether what ships is usable, which is the distance
between rule 7f and this fault.

And the field test did not catch it, though it exists for exactly this: it
installed the package and drove it through a browser. No typecheck. A
consumer with JSDoc and `checkJs` was not a scenario anyone imagined,
while JobTracker was the only consumer with a build step.

**3 · Where else the same fault sits.** The fault is *a gate that judges
the product under the project's conditions rather than the user's*.

Measured: our type gate differs from a strict consumer on two settings —
`moduleResolution` and `noUncheckedIndexedAccess`. The second exposed a
real hole in our own code: `js/overlays.js:80` called `tabs[index].focus()`
with no guard, which in a browser is a thrown `TypeError` on an
out-of-range index, not merely a type complaint.

The browser suite has the same shape and was hit the day before: it runs
against the repository. The field test is the only thing that runs against
the package, and it is manual and once per release.

Not measured: whether almanac and kyu are affected. They vendor the
stylesheet and run no typecheck over us, so the expectation is no — stated
as an expectation because it was not checked.

**4 · The measure.** Four parts, and 1.1.0 rather than 1.0.1 because of
the fourth.

(a) The package ships declarations: a `.d.ts` beside every entry point,
generated from the JSDoc sources by `npm run generate:types`, held in step
by a `--check` gate — the same contract as `css/themes.css` and `ha/*.yaml`.

(b) A gate that packs the tarball and asserts every published entry point
carries a declaration inside it. It found one immediately: `index.d.ts` was
not published, because `files` named `index.js` as a file rather than a
directory, so the main entry point would have arrived without types a
second time.

(c) `tabs[index]?.focus()`.

(d) `Theme` is the generated union of the eleven names. Only the outputs
narrowed; `storeTheme` and `initializeTheme` still accept a plain string,
because narrowing an input breaks a consumer that reads a theme out of
config or a database — which is what both consumers with a build step do.
kp-soft said explicitly on the day that a narrower type would only add
safety for them.

**5 · What the remedy costs.** (a) costs 23 files in the repository and a
gate that complains when they age; the same bargain as the stylesheets.
(d) costs consumers a narrowing call where they read a theme from
elsewhere, which is what they should be doing and what both already do.

And it cost this project its FEATURE COMPLETE status the day after it
earned it.

**6 · Who enforces it.** Code, all of it: both checks run in
`npm run gates`, so in the commit hook and in CI. There is no
discipline-enforced half in this correction.

**7 · How we measure that it works, and when.** Not by our own gate — a
gate can see that declarations exist, not that they are usable. The
measurement is JobTracker's own typecheck against the new version, run in
their session: zero errors inside `node_modules/@kp-soft/themes`, or it
did not work. Queued as KT4-M1 until their output exists.

Measured at the moment of building, per standing rule 7e: the gate was run
against the state before the fix and reported 31 problems, exiting 1;
restored, it passes.

That drill mattered more than usual here, because the consumer half of
this gate could not fail *twice* before it could. The first version
pointed `paths` at the files in this repository, and TypeScript fell back
to the `.js` beside each missing `.d.ts`. The second packed a real tarball
into a consumer's `node_modules` and still passed, because TypeScript 7
infers types from a dependency's JSDoc where JobTracker's compiler does
not. A fixture pinned to our compiler cannot reproduce their failure, so
the gate stopped claiming to: it checks what is checkable here, and the
consumer supplies the proof.

**8 · The fallback if the measurement fails.** If JobTracker's typecheck
still reports errors in our package, generated declarations are not enough
for a strict consumer, and the next step is not more JSDoc: the public
entry points — `index.js`, `js/theme-core.js`, `hooks/use-theme.js` — get
hand-written `.d.ts` files with a test comparing them to the real exports.

If the packed-tarball gate turns out to be noise, it is replaced by
pinning the fixture consumer to the TypeScript version a consumer actually
runs, which is the only way to reproduce the failure locally.

**9 · When we review the measure.** At the next consumer with a build
step; JobTracker and kp-soft are the only two today. And at the first of
the later channels — Avalonia or Ratatui — where the question of what
"the package ships types" means comes back with no TypeScript in sight.

## KT5 · A package that spoke one language and gave nobody a way in

Approved 2026-09-05, fields 1-3 and 6-9 "Correct"; field 4 answered in
Kenny's own words, and field 5 pointed at that answer.

**1 · What went wrong.** Every user-visible string in the package was
written into the component that renders it, in Dutch. Not a translation
problem — a hardcoded English one would be the same defect wearing a
different word. The fault is **a user-visible string with no way in from
outside**: nothing in the public surface let a consumer pass a different
one.

That definition is not ours. The JobTracker session sharpened it when the
first draft of this form called the fault "Dutch strings", and they were
right: they had already been through the same correction themselves
(their C2 through C6), and the version that names the language fixes the
symptom while leaving the hole open.

Counted on the day, before the fix: 72 distinct strings across 21 source
files. The half that matters most is the half nobody sees — the
screen-reader-only announcements. `components/patterns.jsx` announced a
copied value as `` `${value} gekopieerd` ``; `js/datatable.js` announced
its filtered row count in Dutch into an `aria-live` region. Those fail
silently, and only for the people who cannot see that they failed.

The consequence was measurable in what JobTracker had actually adopted:
the components that carry no text. A ThemeSwitcher whose menu says
"Thema wisselen" on an English page is not a component you can use, so
they did not use it.

**2 · Which gate let it through.** None of them, and that is the finding.
Fourteen gates run on every commit and not one of them reads a string.
The layer gate refuses a colour written outside the token layer; there
was no equivalent asking where a sentence comes from. The browser suite
asserts on the rendered text, which made it worse rather than better:
432 tests asserted Dutch text, so the tests and the code agreed with each
other and the gate stayed green. Agreement between a test and the code it
tests is not evidence when both were written by the same hand in the same
hour.

**3 · Where the same fault sits elsewhere.** Everywhere text is produced.
The sweep found it in all four channels: the framework-free modules, the
React components, the fx layer, and the theme picker that Phase 0 had
already declined for other reasons. It is not present in `css/` — a
stylesheet has no words — nor in the Home Assistant themes.

**4 · The measure.** Kenny's answer, verbatim, is the specification:

> De standaardtaal is overal Engels. Maar als het gaat over tekst
> toevoegen aan een knop ofzo, dan moeten wij daar niet over beslissen.
> Zowel React als html/javascript als alle andere soorten componenten die
> we maken moeten de optie hebben om tekst en dergelijke te kunnen
> veranderen. We willen geen hardcoded "magic strings" in ons project.
> Wij bieden de basis, de consumenten vullen de inhoud in.

Built as three things.

(a) `js/strings.js` — one dictionary, 72 keys, English defaults, frozen.
Keys that vary take arguments rather than being assembled by the caller
(`tableRowsFiltered(shown, total)`, not a template the consumer has to
rebuild), because a consumer who has to concatenate is a consumer who
cannot reorder for their own grammar.

(b) Three layers to reach it, nearest wins: a `strings` prop, then a
`StringsProvider` (`hooks/use-strings.jsx`), then `setStrings()` globally
for the framework-free channel. A consumer who mounts nothing gets
English, so this costs an existing page nothing.

(c) `STRINGS_NL`, exported and frozen: the Dutch that used to be
hardcoded, now one import. It is the migration path for kyu, almanac and
kp-soft, and it is deliberately not the default.

The option this form does not contain is worth recording. An earlier
draft offered "Dutch by design" — keep the defaults Dutch and document
it. JobTracker refused to treat that as a legitimate choice, on the
ground that it answers the language question and leaves the hole. The
option was withdrawn rather than presented, and this note is here so that
the withdrawal is visible rather than silent.

**5 · What the remedy costs.** Kenny's answer to field 5 was "zie vorige
antwoord" — the cost is accepted as part of the measure above. Stated
plainly: the default language on screen changes from Dutch to English for
every consumer who renders a component with text in it. That is visible
and it is breaking, which is why it is a major version rather than a
minor one, and `STRINGS_NL` is the one-line undo for anyone who wants the
old words back.

Inside the repository it cost 21 files rewritten to read from the
dictionary, 432 browser tests rewritten to assert from `DEFAULT_STRINGS`
rather than from literals, and one new gate.

**6 · Who enforces it.** Code. `gates/check-strings.mjs` reads the source
and refuses a literal user-visible string that does not come from the
dictionary — the same shape as the layer gate, and it runs in
`npm run gates`, so in the commit hook and in CI.

It matches sinks rather than shapes. The first version guessed from what
a string looked like and produced 110 findings of which six were real,
which is a gate nobody keeps. This one asks where the literal *goes*:
`textContent`, `placeholder`, `title`, `setAttribute('aria-label', …)`,
JSX attributes and text nodes, and — the case that matters — a bare
literal inside a JSX expression, which is how an sr-only announcement is
written.

**7 · How we measure that it works, and when.** Drilled at the moment of
building, per standing rule 7e, in four shapes, because a gate that
catches three of four is a gate that will be trusted for the fourth:

| Shape | Where | Result |
| ----- | ----- | ------ |
| `textContent =` | `js/datatable.js` | red |
| `setAttribute('aria-label', …)` | `js/combobox.js` | red |
| JSX attribute | `components/datatable.jsx` | red |
| literal in a JSX expression (sr-only) | `components/patterns.jsx` | red |

The fourth one is the reason the drill was worth doing. The gate passed
it on the first attempt — `` `${value} copied` `` reduced to the single
lowercase word "copied", which the gate read as an attribute value rather
than a phrase. That is precisely the string KT5 exists about, so the gate
would have shipped green while missing its own case. Fixed by letting the
template hole stand in as a word; all four drills recorded in
`gates/gates.test.mjs` so the exemptions cannot quietly widen back over
them.

That measures our side. The consumer side is queued as **KT5-M1**: a
consumer builds a screen from these components and supplies their own
words without touching this repository. JobTracker's three input screens
with `Form` and `FormField` is the case, run in their session.

**8 · The fallback if the measurement fails.** If a consumer cannot get
their own words in without patching us, the dictionary is the wrong
shape, and the next step is not more keys: the components that carry text
take a render prop for the text-bearing part, so the consumer supplies
the node rather than the string. That is a larger change and a worse API,
which is why it is the fallback and not the measure.

If the gate turns out to be noise — findings that are not real, often
enough that someone starts adding exemptions to get a commit through —
it narrows to the accessibility sinks alone (`aria-label`, `aria-*` text,
`role="status"` content), because those are the ones that fail silently.

**9 · When we review the measure.** At the first consumer that ships in a
language which is neither English nor Dutch, where plural rules and word
order stop being something a dictionary of complete sentences can
express. And at the first of the later channels — Avalonia or Ratatui —
where "the package ships its strings" has to mean something with no
JavaScript in sight.

## KT6 · A component that sets a state and gives nobody a way out of it

Approved 2026-09-05, fields 1-3 and 5-9 "Correct"; field 4 answered in
Kenny's own words: "Doe wat de gangbare gang van zaken is voor component
libraries in het algemeen in 2026". His remarks on the same form widened
the correction from one fault into a sweep, recorded under field 4.

**1 · What went wrong.** `Form` puts the submit button into a busy state
on a valid submit and nothing ever puts it back. No prop, no callback, no
handle. A submit that fails locks the person out of their own screen.

Measured in our code: `components/form.jsx:270` sets `busy`, `:300` binds
`disabled` and the label to it. Both channels, not only React:
`js/forms.js:233-236` does the same to a server-written form, and the
idle text is restored only when `detach()` runs.

The evidence is JobTracker's. They rebuilt their login screen on `Form`
and ran their existing suite:

```
✘ auth.spec.js:60 — "a wrong password shows the hint; the right one opens the app"
  at line 68, clicking submit: retrying click action — element is not enabled
```

Wrong password → 401 → the hint appears → right password → click. The
click never lands. Their 401 *resolves* rather than rejects — the screen
renders the error instead of throwing — which is the detail that decides
what the fix has to do (field 4). One more thing they saw that we could
not: their Dossier page remounts the subtree on a *successful* save, so
the latch resets by accident there and only the failure path stays stuck.
A suite that walks only the happy path never sees this.

**2 · Which gate let it through.** A test that did half its job.
`tests/forms.spec.mjs:107`, "the submit button says it is working",
asserts `aria-busy="true"` and `toBeDisabled()` and stops. It pins the
latch closing and never asks whether it opens. The same shape as KT2: a
gate that checked one half of a two-halved property.

A second gate said nothing because it does not exist: the submit contract
of `Form` — `onValid`, the `kp-form-valid` event — is documented nowhere.
Zero hits in README and `docs/`. What is not described, a documentation
review cannot contradict.

And a third instance of the same half-a-property shape arrived from
JobTracker the same evening, while this form was open: the skip link in
`NavBar` moves the scroll position and not the focus, because nothing
puts `tabindex="-1"` on the target and nothing in this package says a
consumer must. `css/components.css:155-169` shows the link on focus and
that is all it does. No test asserts that Enter lands focus on the target.
KT2, the busy latch, the skip link: the visible half is tested, the half
that decides whether it works is not. Two is a coincidence; three is a
diagnosis.

**3 · Where the same fault sits elsewhere.** The fault is not "the submit
button stays disabled". It is **a component sets a state on the
consumer's behalf and gives them no way out of it** — JobTracker's own
C2→C6 lesson: name the property, not the place. Measured today, each
verified by hand:

| Where | What is one-way | Compare |
| --- | --- | --- |
| `js/patterns.js:95`, `:114` | Optimistic delete hides the row; the commit event carries no detail, so a failed server delete leaves a vanished row and an expired undo | `js/datatable.js:244` restores its hidden rows on cleanup |
| `js/components.js:88-91` | Contract enforcement sets `disabled` on a destructive button and nothing re-evaluates | `components/button.jsx:65` derives it per render and heals |
| `components/button.jsx:65`, `:72` | The opposite direction: `{...rest}` is spread after `disabled`, so a consumer's `disabled={false}` re-enables a contract-broken button | — |
| `components/flow.jsx:277`, `:286` | React Upload rows are born `waiting` with `aria-valuenow={0}` and no prop or ref ever moves them | `js/upload.js:175` exports `setProgress` |
| `components/patterns.jsx:59` | Copyable's `failed` has no timer back to idle, unlike `copied` | `js/patterns.js:59-61` keeps the label and toasts |

**4 · The measure.** Kenny's answer: the 2026 norm for component
libraries. His remarks on the same form set the frame the norm is applied
in, and they are the specification:

> Dit project is waar ik me op baseer als ik andere projecten heb en
> styling nodig heb. […] Het enige dat we doen, is thema's aanmaken en
> omzetten naar componenten […]. Wij bieden enkel functionaliteit en
> styling. […] alle componenten […] zo dynamisch en generisch mogelijk
> […] zodat consumenten zelf hun invulling kunnen geven. Dus geen keuzes
> over talen […]. Dit is gewoon een bron van inspiratie, geen contracten
> […]. Het enige "contract" is dat we altijd een versie omhoog gaan […].
> Wij doen wat testen […] voor bv contrast […] en of React componenten
> hetzelfde renderen als html/javascript componenten. Maar we testen
> niks voor andere projecten. […] als er componenten zijn zoals die
> navbar, dan moeten alle features van die navbar instelbaar zijn. […]
> Zoals volwassen component libraries dus. Dit geldt voor alle
> instellingen van alle componenten. Er mogen defaults zijn natuurlijk.

Applied to the fault of field 1, the norm is what react-hook-form,
TanStack Form and Conform all do: the form awaits what the submit handler
returns and derives its pending state from that promise, settled either
way — fulfilled or rejected — and a consumer who wants to own the state
outright passes it in. So: `onValid` may return a promise, busy clears
when it settles; `onValid` also receives `done()`; a controlled `busy`
prop wins over both; nothing returned and nothing called keeps today's
behaviour, because a consumer who navigates away on submit must not get
back a button that double-sends. The framework-free channel gets the same
through the event detail.

Applied to the whole package, the norm is the sweep this correction
became: every component audited against the controlled/uncontrolled
pattern, element substitution, content through props, behaviour flags
with defaults, callbacks on every state change, passthrough to the root,
and no magic number a consumer cannot change. The findings and what was
done with them are recorded in `docs/GENERIC_SWEEP.md` and in the
CHANGELOG of the version that carries them.

**5 · What the remedy costs.** A version, and Kenny confirmed 2.1.0 for
the latch alone; whether the sweep needs a major depends on what it
removes, and that is decided in the sweep's own form. One consumer shape
changes behaviour: whoever returns a promise from `onValid` by accident
today gets a button that re-enables. That is the point of the fix and it
goes at the top of the CHANGELOG rather than into a footnote. Third
release in two days: a consumer who has to update three times starts
skipping versions. Accepted, with eyes open, because JobTracker has a
broken login screen the moment they use `Form`.

**6 · Who enforces it.** Code for the tests, discipline for the rule, and
each named as such. Per repaired place, a test in both channels that sets
the state and then opens it. A gate that finds this mechanically cannot
be written without knowing what "a state" is — `disabled` from a prop is
fine, `disabled` from internal state is suspect, and no regex sees the
difference. A gate people add exemptions to in order to commit guards
nothing. So the rule goes into `CLAUDE.md` as a project rule, with the
test bar as its mechanical half.

**7 · How we measure that it works, and when.** Our side, at the moment
of building: per repaired place a test that sets the state, opens it, and
then makes a *second* attempt that lands. Each drilled red first with the
repair removed, per the KT3 rule. For the form, the test pins the shape
JobTracker actually has — a handler that resolves after a failure — not
the easier rejecting one.

The real measurement is theirs and is already defined: KT5-M1 again.
JobTracker rebuilds their login on `Form` and `auth.spec.js:60` passes.
Not our test, their test, on their screen. At their adoption of the
version carrying this repair.

**8 · The fallback if the measurement fails.** Then `Form` should not own
the busy state at all: a controlled `busy` prop only, and we render what
the consumer says. A worse default — no protection against a double
submit for whoever passes nothing — which is why it is the fallback and
not the measure. If the rule of field 4 turns out to be noise, it narrows
to states that can outlive a *failure*, because that is where it hurts.

**9 · When we review the measure.** At the next component that has to
set a state which can outlive a failure. And at the first of the later
channels, Avalonia or Ratatui, where "the consumer returns a promise"
does not exist and it has to show whether the rule was about ownership of
state or about JavaScript.

## KT7 · A gate that only `npm run gates` runs, and nothing runs `npm run gates`

**Approved 2026-09-05 in the combined AFK report, all nine fields
"Klopt".** Found at R0: the first full `npm run gates` of the round was
red on files the round had not touched.

*Corrected while executing the measure:* the form said the hook omitted
five steps. Read in full, `gates.sh` already ran prettier, tsc and the
unit tests; what it omitted was `check:strings` and `check:types:consumer`
— two, not five. The fault and the measure are unchanged; the count in
fields 1 and 3 below was wrong and is left as written, with this note.

**1 · What went wrong.** `npm run check:strings` reports eleven findings
at 3.0.0 — `components/canvas.jsx:259`, `components/flow.jsx:143-150`,
`components/patterns.jsx:225` — and has since those files were written in
the KT6 sweep. Measured today on a worktree of `d5d25c3` (the 3.0.0
merge): `node gates/check-strings.mjs` exits 1 with "11 string(s) a
consumer cannot replace". CI was green on that commit, because CI's Gates
job runs `.claude/hooks/gates.sh`, not `npm run gates`, and the script
omits five of the chain's steps: `check:strings`, `check:types`,
`check:types:consumer`, `npm test` and `prettier --check`. The KT5 record
says the gate "runs in `npm run gates`" — true, and nothing ran it.

All eleven were false positives of the gate's heuristics — a CSS
selector handed to `closest()`, lines of an object literal whose key is
capitalised, and a one-character literal desynchronising the literal
scanner so the code between `'+'` and `'-'` was reported as a string.
Repaired test-first the same day (`gates/gates.test.mjs`, "KT7: the
strings gate does not flag code that only looks like text", red before
the fix on all three shapes). That the findings were false does not make
the fault smaller: a real one would have been just as invisible.

**2 · Which gate let it through.** Phase 5's hook decision H1 — the fast
gates block a commit, the browser tests block a merge — was applied to
the hook and then copied into CI as the same script. Nothing compares the
hook's list with the `gates` script's list, so the two drifted the moment
KT5 added a step to one and not the other. The same shape as 7f (the
manifest versus the tarball): two lists that promise the same thing and
nothing that lays them side by side.

**3 · Where else the same fault sits.** Measured: `gates.sh` runs ten
checks; `package.json` `gates` runs fifteen. The five missing are the
ones named above. The hook side is deliberate for three of them (tsc and
the unit tests are slow, prettier rewrites), not for `check:strings`,
which takes under a second. CI's side is not deliberate for any of them.

**4 · The measure (proposed).** CI's Gates job runs `npm run gates` — the
whole chain — and the hook keeps its fast subset per H1, widened by
`check:strings` and `prettier --check`, which are fast. A unit test in
`gates/gates.test.mjs` asserts that every `check:*` script in
`package.json` is invoked by the `gates` script, and that
`.github/workflows/ci.yml` calls `npm run gates`, so the next step added
to one list fails the build until it is in the other.

**5 · Cost.** The CI gates job grows by tsc, the unit tests and prettier —
about a minute. The hook grows by two sub-second checks.

**6 · Enforced by.** Code: the workflow line and the unit test. The hook
subset stays a recorded decision (H1).

**7 · Measured, and when.** At R0's first CI run after the change: the
full chain is green, and once, a deliberately injected literal in a
component turns it red (the drill). Recorded in the gate log.

**8 · Fallback.** If the full chain is too slow for CI, the hook script
grows instead and CI keeps calling it — but with the unit test, so the
two lists can no longer differ silently.

**9 · Review.** At round three's retrospective.

**Measured, 2026-09-05.** Kenny approved all nine fields in the combined
AFK report; the measure went in as `7fe7869`. At the first CI runs after
it: the full chain green on `bc1e369` (run 33941401074), and a
deliberately injected literal — `js/kt7-drill.js:7` on a throwaway branch
`kt7-drill`, commit `177358e`, made through the GitHub API because the
repaired hook refuses to commit it locally — turned the gates job red on
`check:strings` (run 33940706648). The branch was deleted. The loop in
`docs/MINI_ROUNDS.md` is closed.

## KT8 · What a review sees that no gate measures

**Proposed 2026-09-05, after Kenny's look at the 3.1.0 showcase on Pages;
the form is the next one.** He held the release ("Nog niet") and named
four things: base and hover states differ too little in many themes; in
brutalism the spinner is all black and nothing visibly turns; a checked
radio is hard to see; and a highlighted dropdown item turns purple —
"is bij vele andere thema's ook het geval dus een bug".

**1 · What went wrong.** Three product faults and one design setting, all
invisible to the gates. Measured: `.kp-spinner` drew its track in
`--border-strong` and its head in `--primary` (`css/components.css`), both
the ink in brutalism, so head and track were the same black. The checks
and radios painted `accent-color: var(--primary)`, the ink in brutalism
and a step from it in mono, so a checked box looked like an unchecked one.
Seven hover/highlight rules read `--accent` / `--accent-foreground` — the
theme picker's options, ghost and icon buttons, menu items, the combobox
and palette highlights — which is shadcn's convention for a quiet tint,
and in every theme whose accent is a colour (brutalism's lavender, deco's
emerald, woodblock's beni, cyberpunk's cyan) a highlighted row turned that
colour. The hover step: `gates/config.json` derives hover as half a
lightness step (0.03 in OKLCh L); measured over all 24 themes,
secondary→hover and primary→hover sit 1.4 to 3.6 apart on the same scale
where the pressed state must reach 10.

**2 · Which gate let it through.** None can: these are what a thing looks
like, and the gates measure what a thing is. The review on Pages is the
gate for that, and until now it had no fixed place in the round — the
AFK report asked "Akkoord / Toon mij dit" per milestone, and Kenny
answered Akkoord six times and looked afterwards, at the release go.

**3 · Where the same fault sits elsewhere.** The `--accent` misuse: seven
rules, all found by `grep 'background: var(--accent)'` and all changed.
Controls that paint in `--primary`: the checks, the radios and the
progress bar — all three now read the knob. Components with a head and a
track: only the spinner.

**4 · The measure.** (a) The three product faults are fixed in 3.1.0
before its tag, each with a test on every fixture that goes red on the
fault (`tests/fixtures.spec.mjs`, "review findings [KT8]"): the spinner's
head and track differ by 1.5:1 after compositing; a control's
`accent-color` is 3:1 on the page and 10 OKLab units from the ink; a
highlighted row is a wash of the ink — no more chroma than the surface or
the text — with the list's own text colour. (b) The hover step is Kenny's
choice, put to him in the form with the measured distances. (c) The
review gets a fixed place: **the release go is only asked after Kenny has
looked at Pages** — the report form links the page and says so, and
"Akkoord" on a milestone no longer stands in for having seen it.

**5 · Cost.** Three per-theme tests (72 cases per browser) — about fifteen
seconds. One more look before every release, which is what Kenny already
does.

**6 · Enforced by.** Code for (a); the form text for (c), which is
discipline — a report form that omits the Pages link is the way this
erodes, and there is no gate for the wording of a form.

**7 · Measured, and when.** At Kenny's next look at Pages after the
fixes are merged: the three faults are gone by his eye, and the tests
are green on every fixture in CI. Field (b) is measured the same way once
the hover step is chosen.

**8 · Fallback.** If his next look still finds one of the three, the
test that let it through is wrong about what it measures, and it is
rewritten before anything else — as the register test was in R3.

**9 · Review.** At round three's retrospective, together with KT7.

**Approved 2026-09-05, all nine fields "Klopt"; H1 answered "Eén stap";
release "Nog niet" — and a fourth finding in the remarks:** the hovered
option in the countries `<select>` was still purple in several themes.
Measured: that list is the native `<select>`'s, drawn by the browser in
the platform's highlight colour — purple on Kenny's desktop, in every
theme, because it is the one control the package never painted. Kenny's
question with it: *"Kunnen we niet testen dat zulke kleuren die buiten
ons thema vallen gedetecteerd worden?"*

**What was done.** (1) Hover is one lightness step (`gates/config.json`,
`derivation.hover: 1`), regenerated for all 24 themes; MIGRATION and the
CHANGELOG say so. (2) The `<select>` list wears the theme where the
browser lets a page take it over — Chromium 135+, `appearance:
base-select`: popover surface, the ink wash under the hovered option, a
check on the chosen one; Firefox keeps the platform list, and a test that
runs where the feature exists holds the hovered option's background to
the wash (drilled: with the rule removed Chromium paints its own
`oklab(0.18 … / 0.1)`). (3) **The detector Kenny asked for:** a test on
every fixture that reads every painted background, text, border and
control colour and holds each to the theme's own values within rounding,
transparent, or a translucent wash. Its first run found, on every theme,
four foreign colours nobody had noticed: the browser's grey `<hr>`, the
grey range sliders of the colour picker, the grey `<progress>` track and
border, and — legitimately — the picker's swatch and the "browser"
specimen's native controls. The first three are the theme's now; the
last two are the allowlist, each with its reason. Drilled: with the `hr`
rule removed, every theme reports `color rgb(128, 128, 128) on hr`.

**Measured, 2026-09-05, at Kenny's third look.** "Release nu." The three
faults were gone by his eye; the countries list was still purple in his
browser — "misschien door mijn browser afgedwongen? … voorlopig
accepteerbaar" — which is the platform list Firefox and Chromium before
135 draw themselves, and is recorded as a known limitation in MIGRATION
and the USER_GUIDE. 3.1.0 was tagged on `482e575` and published. The loop
in `docs/MINI_ROUNDS.md` is closed.

## KT9 · The release was improvised past the project's own automation

**Proposed 2026-09-06, live-found during the 3.1.1 patch release.** Kenny
chose "Merge en meteen taggen" for TH89 (terminal's block cursor onto the
focused field). Claude merged PR #16, tagged `v3.1.1`, and then hand-built
a GitHub release instead of reading what the repository already does on a
tag push.

**1 · What went wrong.** Claude ran `gh release create v3.1.1 ...` with
three hand-picked files (`themes.css`, `components.css`, `MIGRATION.md`)
and a `SHA256SUMS` computed by hand over only those three, and published
it directly — without first reading `.github/workflows/release.yml`.
That workflow is the actual process: a `v*` tag push runs the gates, then
`npm run checksums` (`gates/checksums.mjs`, ten files: `css/themes.css`,
`css/components.css`, `css/cyberpunk-register.css`,
`css/tailwind-bridge.css`, `js/theme-core.js`, `js/theme-registry.js`,
`js/theme-picker.js`, `js/components.js`, `js/overlays.js`,
`js/no-flash.js`), then `gh release create "${GITHUB_REF_NAME}" --draft
--notes-file CHANGELOG.md SHA256SUMS MIGRATION.md css/themes.css
css/components.css` — a **draft**, on purpose: "Pushing a tag is a
technical act; publishing is Kenny's, and the two should not be the same
keystroke" (the workflow's own comment). Because Claude's manual release
claimed the tag name first, the CI job's own draft-creation step logged a
confusing interim URL
(`.../releases/tag/untagged-c5bf100edd9eedb60203`) instead of a clean
`v3.1.1` — it still landed correctly as a draft on the right tag
(`id 383642992`), so no release was lost, but the **published** release
Claude made (`id 383642993`) carried an incomplete `SHA256SUMS` — three
of the canonical ten files — for about ten minutes, publicly, before it
was caught. Evidence: CI run 34044610223's "Draft release" step log;
`gh api repos/kennypassenier/kp-themes/releases` before and after the
fix.

**2 · Which gate let it through.** None — this happened outside the
phase-gate procedure, in a same-turn merge-and-release chosen through a
one-item form Claude wrote without having read the repository's release
automation first. KT1's rule (every checkable claim in a form is checked
in the same turn, with file:line) covers exactly this: the form's
consequence line promised "Claude tagt v3.1.1 en maakt de GitHub release
… direct erna" without Claude having checked, that turn, what "de
release" concretely does in this repository.

**3 · Where else does the same fault already sit.** Checked now:
`.github/workflows/` holds exactly one tag-triggered workflow
(`release.yml`); nothing else in this repository automates the same job
a different way. The generalizable shape — replicating by hand a step a
project's own CI already automates, without reading that CI's definition
first — is not yet named anywhere in `~/Projects/dev-procedure/`, so it
can recur in any project with a release or deploy workflow; kp-themes is
simply where it was first caught.

**4 · The measure.** Before performing, by hand, any action a project
might already automate on a trigger Claude is about to fire (a tag push,
a merge to a deploy branch), check that trigger's workflow file(s) first
and follow what they do, rather than reconstructing the step from memory
of an earlier round. Recorded here for kp-themes specifically — the
`.github/workflows/release.yml` comment now doubles as the answer to
"what does releasing do here"; whether the rule generalizes to
`~/Projects/dev-procedure/STANDING_RULES.md` is for the round's
retrospective to decide, alongside KT7 and KT8.

**5 · Cost.** Near zero — one `ls .github/workflows` / grep before a
release-shaped action, on top of the checks Claude already runs for
gates.

**6 · Enforced by.** Discipline only; no gate can force "check the
automation before improvising its job".

**7 · Measured, and when.** At kp-themes' next `v*` tag push: confirm
Claude reads the release workflow (or whatever it has become) before
touching `gh release create` by hand.

**8 · Fallback.** The same repair applies again: delete the wrong
release object, regenerate from the project's own script
(`npm run checksums`), verify every checksum against the tagged tree.
About ten minutes — already exercised once, here.

**9 · Review.** At kp-themes' Phase 10 retrospective for round three,
together with KT7 and KT8.

**Approved 2026-09-06, all nine fields "Klopt".** The measure in field 4
stands as written: before performing by hand any action a project's own
CI might already automate on a trigger about to fire, read that
workflow's definition first. Recorded here for kp-themes; whether it
generalizes to `~/Projects/dev-procedure/STANDING_RULES.md` is decided
at the round's Phase 10 retrospective, together with KT7 and KT8 (field
9). The measurement in field 7 stays open until kp-themes' next `v*` tag
push.

**Closed 2026-09-07.** That tag push was `v3.2.0`, and the measurement
came out right: the release was built by `.github/workflows/release.yml`
rather than by hand, and its draft carries exactly the six assets the
workflow uploads — nothing hand-picked — with a `SHA256SUMS` of 34 lines
covering every copyable file, against the ten of the release this
correction is about. Recorded in `docs/MINI_ROUNDS.md` row KT9 and in
commit `6f0f9a3`. This closing note is written here because the
correction's own header says a correction is closed only when field 7 has
happened, and until now that closure lived only in the queue document —
found by the round-three retrospective's evidence pass on 2026-09-07.

## KT10 · A frozen Essential feature went unbuilt because one ID meant two things

Approved by Kenny on 2026-09-07, all nine fields unchanged.

**1 · What went wrong.** `docs/FEATURES.md:319` names D3 as "`STRINGS_NL`
leaves the exports" and lists it among the eight Essential features of
round five. This project's own Phase 4 text (AR27) and the brief given to
the W1 agent both used D3 for a different removal — `ARM_EVENT` and
`DISARM_EVENT`. The agent built those, and the frozen D3 was never built.
It passed unseen through five milestones, a merge, a full suite of 1302
browser tests and the combined AFK report. That report even said D3 had
"no test"; the truth was milder-sounding and worse — it did not exist.

**2 · Which gate let it through.** The procedure has a check for exactly
this: Phase 6's report carries a registry-coverage item naming, per
feature ID, what exists with its promised tests and what does not. It
exists because two frozen Musts on an earlier project turned out never to
have been built. The item ran; it was filled in wrongly. The search was
"which tests mention D3" rather than "what does the frozen list say D3
is".

**3 · Where else the same fault sits — measured, 2026-09-07.** Across
`FEATURES.md`, `MINI_ROUNDS.md`, `INVENTORY.md`, `SCOPE.md`,
`ARCHITECTURE_DECISIONS.md` and `CORRECTIONS.md`, **270 IDs are defined
and 23 are defined in more than one document.** Five of those are
cross-references to one thing — KT2, KT7, KT8, KT9 and TH47 each appear
in a correction and in the queue, which is the point. **The other
eighteen are genuine collisions:** T1 through T16 mean a technology
choice in `ARCHITECTURE_DECISIONS.md` and an inventoried unit in
`INVENTORY.md` — `T1` is "Seven palette blocks" there and "the
framework-free channel is CSS classes plus one script" here — plus D3
and F1. So the fault is not "D3 was used twice". It is that an ID's
meaning is kept unique nowhere, and that is true eighteen times.

**4 · The measure.** A gate that refuses an ID meaning two different
things in two documents: it reads the ID definitions out of the six
documents and fails when one symbol is defined in two of them, with an
exception list carrying a reason per line for the real cross-references.
And the eighteen existing collisions are cleaned up, because a gate that
is red on day one gets switched off. `INVENTORY.md` takes its own prefix:
it documents units and has no claim on T, D or F. Deliberately NOT a rule
saying "check the feature list before reusing an ID" — that is the kind
of resolution this form exists to replace.

**5 · What it costs.** The gate is small — one script of the same shape
as the others, plus a drill. The cleanup is the real work: renaming
eighteen IDs touches hundreds of lines of `INVENTORY.md`, a historical
document nobody else reads. The risk is that the exception list grows
until it covers half the cases, at which point the gate measures nothing.

**6 · Who enforces it.** Code. The gate runs in `npm run gates` and in
the commit hook, so a commit that adds a colliding ID is physically
refused. That is deliberate: this project's four other named rules are
discipline-enforced, and this fault happened precisely because a person
did not look something up.

**7 · How and when it is measured.** At the next Phase 2 that freezes a
feature list — the moment new IDs come into being, and therefore the only
moment the gate has anything to say. The measurement is an injected
colliding ID: the gate must go red naming both documents. A point in the
process, not a calendar date. The measure stays open in
`docs/MINI_ROUNDS.md` until that has actually happened.

**8 · The fallback.** If the exception list grows until the gate refuses
nothing, it is dropped for something blunter: every ID carries its
document as a prefix — `FEAT-D3`, `INV-D3` — so a collision becomes
impossible rather than caught. More expensive to read, and it cannot
break.

**9 · When the measure is reviewed.** At the Phase 10 of the round in
which field 7's measurement was made.


**Field 7, measured 2026-09-07 at round six's Phase 2 freeze.** A
heading `## TH129 · An injected duplicate for the KT10 drill` appended to
`docs/SCOPE.md` made the gate exit 1 with
`TH129 is defined in docs/FEATURES.md and docs/SCOPE.md`; restored, exit
0. The first attempt used a bold paragraph, which the gate does not count
as a definition (only a table row or a heading is), so it measured
nothing — the drill was reshaped, and that limit is now written down
here. The drill also caught a genuine collision that had been created
minutes earlier: `TH132` defined by its FEATURES.md row and by the
heading of its own mini-round entry; excused in `CROSS_REFERENCES` with
its reason, the shape TH47 set. The loop is closed; the review moment
(field 9) is round six's Phase 10.

## KT11 · The concept page was not the approved demo, and no gate compared them

Approved by Kenny on 2026-09-08, all nine fields unchanged.

**1 · What went wrong.** C0's `examples/concept.html` was a reduced page
in the component vocabulary — a heading, a lede, two buttons, a form, two
cards — while S46 says the concept demo has "the same structure and
elements" as the approved demo. Kenny found it on the live page while
answering the ratification form; no gate had seen it. Evidence:
`git show b6c5e5e:showcase/examples.mjs` (the C0 descriptor, 60 lines
against 250 now) and `docs/SCOPE.md` S46.

**2 · Which gate let it through.** None: S46 was a textual requirement
without a measurement. The hooks gate checks that every theme answers the
hooks and the examples-wired gate that the attributes reach the page;
neither compares the concept page with the approved demo. Phase 5 named
no gate for S46, so the fault was already in the realization plan.

**3 · Where else the same fault sits — measured, 2026-09-07.** One place.
The showcase specimens and the ten other example pages have no approved
demo as their source; the concept demo is the only page with an "exact
source". The same kind of fault — a textual requirement without a
measurement — sits in other frozen requirements: TH127 (the migration
note) and TH134–TH136 (documentation) have no gate either; they come up at
C6.

**4 · The measure.** The approved demo is an inventory in the repository:
`showcase/concept-demo.json` names thirty elements of the demo — the
picker, the brand, the strip with its dropdown, language break and cta,
the hero, the side note, the laurels, the microlabel, the headline, the
lede with its marks, the mirror button, the ghost button, the platforms
line, the spec sheet with its swatch, the tear, the app ground, the
heading with its rule, the form, the select, the textarea, the checkbox,
the confirmed wipe button, the dossier with its label, the trigger, the
second tear, the footer — each with the text the generated page must
carry, and a unit test in `gates/gates.test.mjs` refuses a concept page
in which one is missing. When the demo is ever replaced (S46: for
synthwave too), the inventory changes in the same commit.

**5 · What it costs.** One JSON file of about twenty lines and one test;
every change to the demo touches two files instead of one. No new rule
for Kenny.

**6 · Who enforces it.** Code: the unit test runs in `npm run gates`, in
the commit hook and in CI. The substantive half — whether an element also
looks as it does in the demo — stays discipline-enforced through Kenny's
own look (standing rule 39) and the register gate that makes every
component root answer.

**7 · How and when it is measured.** At the building of the measure
itself, before the form. Measured 2026-09-07: the test is green on the
page as it stands live and red with the laurels taken out of the
descriptor (drill). The loop closed at the moment the measure came into
being; the second measurement is the next change to the demo (synthwave),
where the inventory must move in the same commit.

**8 · The fallback.** If the test stays green with a missing element, the
inventory becomes a pixel comparison: a screenshot of the approved demo
per element beside the rendering under cyberpunk, with a threshold —
heavier, but then it measures the shape and not only the presence.

**9 · When the measure is reviewed.** At this round's Phase 10: if S46
becomes a standing rule of the dev procedure ("an approved demo is an
inventory with a test"), the project rule here is redundant and moves to
the procedure.


## KT12 · The push chain read a watch exit code, and `main` moved on a red browser job

Approved by Kenny on 2026-09-08, all nine fields unchanged; field 7 was
measured before the form was answered. Queued as R6-Q5.

**1 · What went wrong.** Claude pushed commit `b6c5e5e` (C0) to `main`
while CI was not green: the `gates` job was green, the `browser` job red
on one assertion (`tests/overflow.spec.mjs` still expected ten example
pages). The push chain read the exit code of a `gh run watch` that had
been moved to the background, which reported 0, instead of the conclusion
per job. Evidence: `gh run view 34152005920` → gates success, browser
failure; `git log origin/main` showed `b6c5e5e` before the correction.

**2 · Which gate let it through.** Standing rule 36 (wait on the checks
of that sha) was followed to the letter and still let this through,
because it does not say which signal counts. The commit hook and CI
itself worked; the weak link was Claude's reading of CI.

**3 · Where else the same fault sits — measured in this conversation.**
C1's poll did not find the run (an empty run id after 30 s) and so read
nothing; the polls of C2, C3 and C4 have read the conclusion per job
since. In other projects: every session that uses
`gh run watch --exit-status` in a background task has the same blind
spot; no inventory over the other repositories was made (that belongs to
their sessions).

**4 · The measure.** The push chain reads
`gh run view --json conclusion,jobs` for the exact sha and moves `main`
only when every job says success; an empty run id or a watch exit code
never counts. On a red job `main` stays where it is and the fault is
repaired on the branch first.

**5 · What it costs.** One extra API read per push and two lines of
shell; the waiting time is unchanged. No new rule for Kenny.

**6 · Who enforces it.** Discipline, in the session (the chain is a shell
recipe, not code in the repository). Code enforcement is branch
protection on `main` requiring the `browser` job as well — until this
correction `main` required only the `gates` check; set by Claude with
the gh token on Kenny's go (field 9), 2026-09-08: `main` now requires
`gates` and `browser`.

**7 · How and when it is measured.** At the first push chain after the
measure came into being — and that measurement happened before the form
was answered. On commit `a02d31f` the chain read per job: gates success,
browser failure (run 34163234434, one test that polled the compare page's
scroll sync too early in chromium), and `main` stayed. The fault was
repaired on the branch (`f968063` and `713922e`; the second because the
first forgot the generated page, which the examples gate on CI saw) and
`main` moved only after a run green per job. R6-Q5 is closed on Kenny's
confirmation of this field.

**8 · The fallback.** If `main` ever again sits on a commit with a red CI
job: `main` is reset at once to the last green sha (a force-push by
Claude after Kenny's go), and branch protection is set on both jobs so
GitHub refuses it.

**9 · When the measure is reviewed.** At this round's Phase 10: with
branch protection requiring both jobs, the shell rule has become
redundant and may go.

**Reviewed early, 2026-09-09 — the measure is retired with what it
guarded.** Kenny removed CI from this project: `.github/workflows/ci.yml`
is deleted and `main` requires no status check. There is no run to read a
conclusion from, so KT12's measure has nothing left to do and is retired
rather than kept as a rule nobody can follow. What replaces it is not
another automatic check but Kenny's own: `npm run gates` still refuses a
commit, `npm run test:affected` runs what a change touches, and `npm run
verify` runs everything on the command he gives before a release. The
fault KT12 recorded — reading an exit code instead of a verdict — cannot
recur in that shape, because nothing reads an exit code any more; the
shape it can recur in is a release tagged on a sha whose suite nobody
ran, and standing rule 36 (a publish chain verifies every step) is what
holds that.

## KT16 · Two tests gave a different answer under load, and one of them was right by luck

Found by Kenny on 2026-09-09, in his own `npm run verify` before the
v5.1.0 tag. Approved as TF1-TF4 the same day.

**1 · What went wrong.** Two chromium tests failed in the React channel —
`tests/register-retro.spec.mjs`, "the brand is the title bar…" and "the
dossier is a Notepad window…" — while the same twenty tests pass in 4.6 s
when that file runs alone, the whole chromium project passes (1260), and
the whole suite passes twice over (2495 passed, 31 skipped, 5.9 min, run
twice on 2026-09-09). It has not reproduced since. Kenny's rule decides
what that means: a test that answers differently under load is not a test.

**2 · Which gate let it through.** None could. `npm run gates` reads
files, and the browser suite was the thing that was wrong. What let it
survive review is that the specs were written read-once and nothing
refused that.

**3 · Where else the same fault sits.** Measured, not guessed: 538
one-shot reads of computed style across the suite against 73 retrying
ones, of which **63 sit after a click, a hover or a press** in 19 of the
25 register specs. Those 63 are the ones that can lose a race. A read of
something settled the moment the page exists — a border-radius, a font
stack — cannot, and was left alone.

**4 · How we prevent recurrence.** Three things, per Kenny's answers.
`tests/paint.mjs` holds retrying readers (`style`, `pseudoStyle`,
`measured`) and `bootGone`, and the 63 sites now use them (TF1, TF3). The
boot overlay is `position: fixed; inset: 0` over the whole page and only
stops intercepting once `.is-off` lands, so 22 places that clicked Skip
and read immediately now wait for the overlay to actually leave. And the
module gained a readable state (TF2): `data-kp-reveal-state` is `armed`,
`rest` or `played` on the element, beside the `kp-reveal` event that was
previously the only signal — a moment you had to be listening for.

**5 · What the remedy costs.** Almost nothing at runtime: a retrying read
that is already right returns on its first attempt. In the source it costs
one import per spec and a helper module. The module carries one attribute
write per announced element.

**6 · Who enforces it.** Discipline for the habit; code for the state —
`tests/register-retro.spec.mjs` asserts `armed` before the trigger and
`played` after it, and that assertion was drilled red by removing the
attribute from `js/effects.js`.

**7 · How we measure that it works.** At the next full `npm run verify`
Kenny gives: the suite is green, and no test in it reads computed style
after an action without a second chance. Queued in `docs/MINI_ROUNDS.md`.

**8 · The fallback.** If a load-dependent failure appears again after
this, the next measure is the gate TF3 declined: refuse a bare
`getComputedStyle` anywhere in a spec, about 465 sites.

**9 · When the measure is reviewed.** At this round's Phase 10.

**What this correction cannot claim.** Which of the nine reads in those
two tests actually lost is unknown. Playwright wipes `test-results/` at
the start of every run and Claude ran the suite three times while
diagnosing, destroying the traces Kenny's failing run had left behind —
`trace: retain-on-failure` had captured them. That is its own lesson for
Phase 10: the evidence of a live-found fault is collected before anything
is re-run.

## fix-6 · The round ran on forms and stopped running on phases

**What went wrong.** Kenny asked, on 2026-09-11: *"en waarom volg je de
procedure niet meer?"* Measured before answering: `docs/FEATURES.md` had
zero mentions of round seven, `docs/ARCHITECTURE_DECISIONS.md` had zero
entries from that day and still ended at AR46, and both the status block
in `CLAUDE.md` and the session title said "Phase 0" while feature code was
being committed. The round had done its design in decision forms and had
skipped the gates of Phases 2, 4 and 5 entirely.

**Which gate let it through.** The phase-entry refresh — the rule that on
entering any phase, that phase is re-read fresh from disk and the session
is renamed. It was never run on the move from designing to building.
Nothing mechanical watches a phase boundary, so that rule is the whole
guard, and it is the one that was skipped.

**Where the same fault still sits.** Searched across every document a
phase is supposed to produce, against the commit before the repair:

```
git show 35b9ede~1:<doc> | grep -ci "round seven"
```

`docs/SCOPE.md` 2, `docs/REALIZATION_PLAN.md` 1, `docs/FEATURES.md` 0,
`docs/ARCHITECTURE_DECISIONS.md` 0. (`docs/INVENTORY.md` is 0 and is not
owed by a round.) So two of the four documents a round should fill were
empty.

**And it recurred inside this correction, within the hour.** The form
that announced this record said the nine fields stood written out in this
document. They did not: the commit message carried `[fix-6]` and the
entry did not exist. A claim of evidence pointing at nothing is standing
rule 11a, and the shape is identical to the fault above — a record the
procedure asks for, absent, while everything around it spoke as though it
were there. Kenny was not the one who caught it this time; the check that
caught it was `grep -c "fix-6" docs/CORRECTIONS.md` returning zero,
run because the claim had been made and had to be worth something.

**How we prevent recurrence.** The session title becomes the trigger:
before the first commit that adds a feature, the phase-entry refresh runs
and the title is renamed. A title naming a design phase while code lands
is the visible tell that something was skipped. Kenny chose this over the
mechanical version.

**What the remedy costs.** One re-read per phase boundary. Against it:
a round that otherwise reaches a release with no frozen feature list and
no architecture decisions.

**Who enforces it.** Discipline, by Kenny's decision of 2026-09-11. The
mechanical alternative was offered and refused: a commit hook reading the
status block and refusing a `feat(` commit while it names a design phase.
That would have blocked stage 1.1's commit, three commits before his
question. It stays available as the fallback rather than being built now.

**How we measure that it works, and when.** At stage 1.4: does it open
with a phase check and close with a milestone report rather than with a
commit?

**The fallback if it fails.** The hook Kenny refused today gets built.

**When we review it.** At the round-seven retrospective, where this is
the round's most important fault.

**Not repaired, recorded.** The `architecture-critic` never ran over the
four decisions stage 1 rests on, and stages 1.1 to 1.3 closed on commits
rather than on the milestone report Phase 6 asks for. That report is owed
and is the round's next gate.

## fix-5 · Showing Kenny something and then asking, in prose, what he thought

**What went wrong.** Round seven is a chain of things built for Kenny to
look at, and twice the turn that showed one of them ended in running text
asking for his judgement instead of in a form. He said so himself on
2026-09-11: *"volgens mij moest dit in een formulier, maar bon."* The
second time was the four placements; the first was the deepened spectral
instrument, where the reply described what had changed and left the
verdict hanging in the prose.

**Which gate let it through.** None, and that is the point — the rule is
discipline-only. The form protocol says every choice Kenny makes is a
form, however small, and standing rule 16a says a reply never ends on an
open item. Nothing mechanical can see the end of a conversational turn,
so the only guard is remembering, and under a long build it was the part
that slipped.

**Where the same fault still sits.** The property is not "a turn about a
demo" but **a turn whose deliverable is something for Kenny to judge,
ending without a form**. Counted over this round: the hypertech work has
been put in front of him five times — the first cut, the deepened second
cut, the three worlds, the four worlds beside the shapes page, and the
four placements. Three of those five ended in a form; two did not, and
they are the two named above. No other kind of turn in this round ends on
a judgement, because the rest either ask nothing or already carry a form.

**How we prevent recurrence.** The rule gets a trigger that is easy to
see rather than easy to forget: *if this turn published or updated
something Kenny is meant to look at, the turn ends with a form asking
what he thinks of it.* Publishing is the trigger, and publishing is
visible in the turn's own tool calls.

**What the remedy costs.** Nothing but a form that would have been built
anyway, one turn later, after a round trip.

**Who enforces it.** Discipline. A gate cannot read a conversation. What
makes this one different from a plain reminder is that the trigger is a
tool call rather than a state of mind.

**How we measure that it works, and when.** At the next turn in this
round that publishes an artifact: does it end with a form? The round has
several such turns left — the pastel choice, the concept page for
titanium, the quirk pass on nine themes.

**The fallback if it fails.** If a third turn ends on a judgement without
a form, the trigger stops being a rule and becomes a habit with a shape:
the form is written *before* the artifact is published, so the publish
step cannot be the last thing in the turn.

**When we review it.** At the round-seven retrospective, together with
the question of whether a round built almost entirely out of things to
look at needs its own rhythm.

## fix-3 · A check read a release artefact, so it was green here and red on a fresh checkout

Found by the `v5.1.0` release job on 2026-09-10, minutes after a green
`npm run verify` on this machine.

**1 · What went wrong.** `gates/gates.test.mjs`, the CF1 test written for
this very release, read `SHA256SUMS` from the repository root. That file
is a release artefact, it is gitignored, and it existed here only because
a previous release had left one behind — dated 2026-09-09 04:30. On the
runner it does not exist: `Error: ENOENT: no such file or directory, open
'/home/runner/work/kp-themes/kp-themes/SHA256SUMS'`, and the job stopped
before it could build a single asset.

**2 · Which gate let it through.** `npm run gates` ran it and passed, on
a machine holding the artefact. The gate was not wrong about the code; it
was reading a file the repository does not contain, which no check of
this project had a reason to notice.

**3 · Where else the same fault sits.** The property is "a check reads a
path `.gitignore` excludes", and it was searched rather than guessed:
every ignored entry was taken from `.gitignore` and grepped across
`gates/`. Four files name `SHA256SUMS`, and only this one READ it —
`consumer-tar.mjs` reads it at release time and says so when it is
missing, `checksums.mjs` writes it, `check-baseline.mjs` names the
vendored baselines' own copies, which are un-ignored on purpose and do
travel with the repository. `node_modules/` is named by two, correctly.
So: one instance, and the search is the answer rather than the count.

**4 · How we prevent recurrence.** The test generates the manifest
instead of reading one: `checksums()` builds the same text from the
repository's own files, so there is nothing left to be stale or absent.

**5 · What the remedy costs.** Fifteen milliseconds of hashing per run.

**6 · Who enforces it.** Discipline, plus the release job itself, which
is the only thing here that ever runs on a checkout with nothing lying
around.

**7 · How we measure that it works.** At the next tag: the release job
reaches its assets. Queued in `docs/MINI_ROUNDS.md`.

**8 · The fallback.** A gate that greps `gates/` for a read of any path
`.gitignore` excludes, and refuses it.

**9 · When the measure is reviewed.** At this round's Phase 10.

**Drilled.** With the fix reverted and `SHA256SUMS` moved aside, CF1 goes
red exactly as the runner saw it; with the fix and no artefact, 99 pass.

## fix-2 · Claude ran the whole browser suite without being asked

Found by Kenny on 2026-09-10, reading a progress line: "jouw eigen run? ik
dacht dat we hadden afgesproken dat enkel ik de tests uitvoerde?" Approved
the same day on the `suite-run` form, with a new agreement attached.

**1 · What went wrong.** Claude ran `npx playwright test` — the whole
suite, both engines, 2528 tests, 6.0 minutes — and the no-CI table in
`CLAUDE.md` assigns that command two words: "when Kenny asks". He had not.

**2 · Which gate let it through.** None. The rule lives in a document and
`test:browser` is a plain npm script; nothing refuses it.

**3 · Where else the same fault sits.** The property is "Claude starts a
run the no-CI table assigns to Kenny", and this session was counted rather
than guessed: seven playwright runs. One was the whole suite. The other
six ran the specs a change touches — which is the right scope — but in
chromium and firefox together, where `npm run test:affected` runs
`--project=firefox` and nothing else, for a reason its own comment gives:
Kenny's browser is a firefox derivative and firefox has been the odd
engine here fourteen times against chromium's six. Seven of seven
deviated; one of them was the plain violation.

**4 · How we prevent recurrence.** Two things. During work Claude runs
`npm run test:affected` and never playwright directly; where a drill wants
the second engine, that is a question rather than a decision. And Kenny's
new agreement, which changes the rule rather than only the habit — see
below.

**5 · What the remedy costs.** A drill that wants the second engine costs
a round trip. Under the new agreement a release costs one form, which is
cheaper for Kenny than running the suite himself.

**6 · Who enforces it.** Discipline.

**7 · How we measure that it works.** At the next change that needs a
drill, and at the next release: no bare playwright run in the transcript
that Kenny did not clear. Queued in `docs/MINI_ROUNDS.md`.

**8 · The fallback.** `test:browser` gains a guard that refuses unless an
environment variable only Kenny sets is present.

**9 · When the measure is reviewed.** At this round's Phase 10.

**The new agreement (Kenny, 2026-09-10), for this project only.** Before a
release Claude ASKS, in a form, whether it may run the suite; with his go,
Claude runs it. The decision stays his and the keyboard work does not fall
to him. It does not widen beyond a release: outside that moment the whole
suite is still his to ask for.

**What this nearly cost.** Playwright wipes `test-results/` at the start
of every run, and Kenny's two failing tests were sitting there with their
traces. The unrequested run emptied that directory. It survived only
because the artefacts had been copied to a scratchpad first — the lesson
`KT16` recorded after the same evidence was destroyed a day earlier.
Without that copy this correction would have destroyed his evidence for
the second day running, with the very command the rule forbids.

## fix-1 · KT16's measure was written for the half of the fault it was found in

Found by Kenny on 2026-09-10, in the `npm run verify` that KT16's own
field 7 named as its measurement: `gates 0:12 ok`, `browser 7:14 FAILED`.
Two tests, both firefox, both a read with one moment — the shape KT16
exists about, one day after KT16 shipped. Approved by Kenny the same day,
including the deliberate departure from KT16's own field 8.

**1 · What went wrong.** `tests/dashboard.spec.mjs`, "the confirmation's
buttons carry both halves of the ring — React", reported forest as
`shadow rgb(28, 53, 41) 0px 0px 0px 2px, rgb(95, 143, 125) 0px 0px 0px
0px` — the inner layer at nought spread on its way to two, read
mid-transition. `tests/register-shade-light.spec.mjs`, "the headline's
words resolve out of a blur", read `animationName` on the first word and
got `""` where `kp-word-in` was expected. Both artefacts were copied out
of `test-results/` before anything was re-run, which is the lesson KT16
could not apply to itself.

**2 · Which gate let it through.** None, again, and for the same reason:
`npm run gates` reads files. What let it survive KT16 is narrower and
more interesting — KT16 measured "a read of computed style AFTER a click,
a hover or a press", found 63 of them in the register specs, and
converted those. Neither of these two is in that set. One is in a spec
that is not a register spec; the other reads after a page load rather
than after an input.

**3 · Where else the same fault sits.** Named as a property and then
searched, per §8's own rule. The property is **a test that reads a value
which is only true for a moment**, and it has two halves that want
opposite answers:

- _A value that settles_ — a colour, a box, a box-shadow. Waiting works.
  Searched for every call of `indicator()` and `indicatorFor()`, the
  focus-ring readings: **four**, in `tests/dashboard.spec.mjs` (two),
  `tests/button.spec.mjs` and `tests/register-formal.spec.mjs`. All four
  read once, right after the theme changed or the keyboard landed.
- _A value that passes_ — a finite animation. Waiting cannot work,
  because polling for a name that has already gone finds nothing and
  then times out. Searched for every spec read of `animationName`
  compared against a keyframe rather than against `none`: **three**, in
  `register-shade-light`, `register-high-contrast` and `register-deco`.
  Four other specs already did it correctly — `register-dark`,
  `register-light`, `register-shade-dark` and `register-solstice` arm a
  listener or an observer in an init script before the page exists. The
  right idiom was already in the repository, in four places, unnamed.

**4 · How we prevent recurrence.** The idiom gets a name and one home.
`tests/paint.mjs` gains `recordAnimations(page)` — an init script that
remembers every `animationstart` — and `animationsSeen(page)`, which
polls a record that only grows and therefore cannot miss its moment.
`tests/ring.mjs` gains `wholeRing()` and `wholeRingFor()`, which take the
focus-ring reading again until both halves are painted and return the
last reading either way, so a report across twenty-five themes still
names what it saw. All seven sites use them.

**5 · What the remedy costs.** Nothing when the value is already right:
both readers return on the first attempt. `recordAnimations` costs one
init script per test that uses it. `wholeRing` costs up to two seconds on
a ring that never becomes whole — which is a test that was going to fail
anyway.

**6 · Who enforces it.** Discipline, for now. The gate KT16 declined
would not have caught either of these, and one of them it would have made
worse.

**7 · How we measure that it works.** At Kenny's next full `npm run
verify`. Queued in `docs/MINI_ROUNDS.md`.

**8 · The fallback.** KT16's field 8 named one: refuse a bare
`getComputedStyle` anywhere in a spec, about 465 sites. It is on the
table and it is not recommended, because these two failures show what it
would do — a blanket "wrap it in a poll" pushes the animation half of the
fault into a poll that waits the full timeout for a value that left
before it started looking. The narrower fallback is two gates that match
the two halves: refuse a spec read of `animationName` against a keyframe
name, and refuse `indicator()` outside `wholeRing()`.

**9 · When the measure is reviewed.** At this round's Phase 10, together
with KT16, since this is the same fault twice.

## KT13 · A layout class beat the `hidden` attribute, and the test read the attribute

Approved by Kenny on 2026-09-08, all nine fields unchanged. His remark on
the form itself — nine items is too long to read — changed FORM_PROTOCOL
§8 the same day: a correction is one compact item from now on.

**1 · What went wrong.** The second compare page showed all 24 theme
sections at once: the script set the `hidden` attribute on 23 of them, but
the layout class `.kp-stack` sets `display: flex` and beats the browser's
`[hidden]` rule. Kenny found it on the live page ("I have to scroll all the
way down to find the theme"); the same reading found that a theme whose
only difference is typography got a near-empty frame — a design fault,
not a bug, resolved with his V1 answer. Evidence: measured in the browser
on the live page, 2026-09-08 — visibleCount 24, the sections' display
"flex"; `tests/compare.spec.mjs` (second version) counted
`[data-compare-theme]:not([hidden])`, the attribute, not the paint.

**2 · Which gate let it through.** The page's own browser test: it read
the attribute the script set instead of what the browser drew, and was
green on a page that was wrong. KT3's family — a test that could not go
red — in a new shape: the test looked at DOM state the code itself wrote.
Its three drills touched other assertions; this one was never drilled, and
a drill would not have found it either (the attribute really was there).

**3 · Where else the same fault sits — measured 2026-09-08.** One other
bare `hidden` in the generators: the theme picker's status line on the
concept page, a `<p>` without a layout class, where the browser rule
holds. Two explicit `[hidden]` rules in the component CSS (combobox
option, palette option). No other spec reads visibility off the
attribute. The third compare page has no hidden sections: one theme per
page. Found once more the same evening in the synthwave concept demo: its
button frame (`display: inline-flex`) beat `hidden` on the close button.

**4 · The measure.** Two parts. Code: `css/_rules.css` carries
`[hidden] { display: none !important }` in the base layer — the rule every
reset stylesheet has and this package did not, so a layout class never
beats the attribute again, for any consumer. Test: the compare spec asks
for what is painted (computed display, height), not what the attribute
says; the "one theme per page" test counts visible frames on the paint.

**5 · What it costs.** One CSS rule in the base layer (and a line in the
migration note: a consumer who overrode `[hidden]` to show something
anyway will notice), plus the habit of reading the paint in a browser
test. No new rule for Kenny.

**6 · Who enforces it.** Code for the CSS rule: a browser test
(`tests/hidden.spec.mjs`) puts an element with `hidden` and a layout class
on the page and measures that it does not paint — drilled red by removing
the rule. Discipline for the test habit: "a browser test reads the paint,
not the attribute" is a project rule in CLAUDE.md beside KT3.

**7 · How and when it is measured.** At the building of the measure,
right after the form — the test red without the rule and green with it,
in both browsers. Second measurement: the next page with hidden parts this
project builds (the synthwave demo or C6's documentation pages): the
rhythm and overflow gates already run over it, and the new test stays in
the suite.

**8 · The fallback.** If a layout class ever beats a `hidden` anyway (a
higher layer, a consumer stylesheet with `!important`), hiding in this
package moves from the attribute to its own class `.kp-hidden` in the
utility layer, the package's highest.

**9 · When the measure is reviewed.** At this round's Phase 10: if "read
the paint" becomes a standing rule of the dev procedure beside the KT3
drill, the project rule here goes.


## KT14 · Nineteen demos styled the bar and left the dropdown alone, and no gate looked inside it

Found by Kenny on 2026-09-08 on the nineteen-demo approval form.
**Approved by Kenny the same day (Klopt), all nine fields unchanged**; the
measurement of field 7 happened at TM1's commit, whose hook ran the gate
green on the terminal register.

**1 · What went wrong.** Every one of the nineteen concept demos built
by the Sonnet agents on 2026-09-08 left the nav dropdown in its plain,
unthemed state — a white or grey panel with default links — while the
bar around it, the buttons, the fields and the dossier all wore the
theme. Kenny: opening the menu "pulled me out of the theme's feeling
entirely". The earlier demos (brutalism, synthwave) had styled theirs.
Evidence: his remark on the form, and the nineteen files in the session's
scratchpad — a `.kp-nav__menu` rule with the theme's own colours exists
in none of them beyond a border and a background.

**2 · Which gate let it through.** The brief. The agents were briefed
from the inventory of thirty elements (`showcase/concept-demo.json`),
which names the dropdown as a marker (`class="kp-nav__menu"`) and asks
that it exist, not that it be styled. The register coverage gate
(`gates/check-register-coverage.mjs`) audits roots, and the menu is a
part of the nav root: a register that styles `.kp-nav` and never
`.kp-nav__menu` passes. Claude read every file before publishing and
did not see it either — the menus are closed on a screenshot.

**3 · Where else the same fault sits — measured 2026-09-08.** The four
built registers all style the menu (cyberpunk's dash-prefixed panel,
synthwave's, phantom's cut paper, retro's raised panel) — measured by the
new check, green on all four. The same shape exists for every other
part that only shows on interaction: the combobox list, the date
picker's panel, the palette, the tooltip, the toast — all parts, none a
root; today every register answers them by hand, and nothing measures
it.

**4 · The measure.** Code: `REQUIRED_PARTS` in
`gates/check-register-coverage.mjs` — parts a register must answer
besides the roots, each with its reason; the dropdown is the first
entry, and a register without a rule for it is refused in `npm run
gates` and the commit hook. Brief: the agent brief for a concept demo
names the dropdown as a thing to style in the theme's own language
(this session's two follow-up briefs already do). The approved demos
pass as they are (Kenny: "die dat goedgekeurd zijn mogen door"); every
register built from them styles the menu.

**5 · What it costs.** One list in a gate that already exists, one line
in every future brief. Nothing for Kenny.

**6 · Who enforces it.** Code for the registers: the gate, drilled red
by removing retro's menu rules (2026-09-08) and pinned by a unit test
with a synthetic register. Discipline for the briefs.

**7 · How and when it is measured.** At the next register built from a
concept demo (terminal, TM1): the gate runs in its commit hook. At the
next batch of concept demos (blueprint v2 and dark-with-stars, in
progress): the brief names the dropdown, and Claude opens the menu
before publishing.

**8 · The fallback.** If a register answers the menu with a rule that
changes nothing visible (a gate can be satisfied by an empty gesture),
the coverage gate's next step is to measure a computed difference in the
browser, the way the KT8 fixture tests do for the combobox highlight.

**9 · When the measure is reviewed.** At this round's Phase 10: whether
`REQUIRED_PARTS` should grow to every interaction-only part (the list in
field 3), or whether the concept demo's inventory should carry a
"styled" flag per element instead.

## KT15 · Four registers deviated from their approved demos "on purpose", and nobody asked

Found by Kenny on 2026-09-08, while brutalism (the fifth lift) was being
committed: "Ik wil dat de demo's die goedgekeurd zijn exact zo
geïmplementeerd worden, dus zelfs al zeggen onze testen omtrent contrast
en dergelijke dat ze moeten aangepast worden, mag je dat enkel doen als
je mijn expliciete goedkeuring hebt." Recorded as S49. **Put to Kenny in
the deviation form of 2026-09-08; awaiting his answer.**

**Approved by Kenny on 2026-09-08 (Klopt), all nine rows unchanged, and the work it produced was ratified the same evening** (R1–R8 all "Akkoord"; the deviations that could not be built are named in each theme's anatomy). His
answers to the twelve deviation groups in the same form: **Demo exact for
eleven of them** (A1 copy, A2 retro's window, A3 the small elements, A4
the button height with TH111's mini-round, A5 the ring order, A6 the
transitions including the colour — KT8 yields for brutalism, A8 the
texture including the ceiling per theme, A9 the token values, A10 the
fonts, A11 the mechanisms, A12 the select and the highlight — KT8 yields
there too); **A7** (phantom's skewed button) he answered "Eigen antwoord:
show me the difference on a web page", so that one is still open and
phantom's button stays as built until he decides.

**1 · What went wrong.** The phantom, retro, terminal and brutalism
registers were each built from an approved concept demo (S46) and each
shipped with deviations from it that no form ever asked about: retro's
anatomy lists six "on purpose", terminal's four, brutalism's three, and
beside those a fixture test changed a value the demo showed whenever it
went red — the button's `min-height` (terminal, brutalism), the focus
ring's composition (brutalism), a transition (brutalism), the navy
combobox highlight and the select's `appearance: none` (retro). Four
read-only audits on 2026-09-08 (`docs/audits/DEMO_FIDELITY_*.md`) count
**50 class-A deviations** — a value or element the demo showed that the
package changed or dropped: phantom 8, retro 15, terminal 14, brutalism
13. The largest single one is systemic: none of the four demos' own
words ship — `examples/concept.html` is one page for all six lifted
themes and carries cyberpunk's copy under every `data-theme`.

**2 · Which gate let it through.** The milestone ratification in AFK
mode. C5 had already been read by Kenny as "the demo exact, compare as a
measured diff" — for cyberpunk, on 2026-09-07 — but that reading was
recorded as a milestone outcome, not as a rule, so the next four lifts
treated a deviation as something to write down in the anatomy rather
than something to ask. The compare page (R6-Q4) measures the old
register against the new, not the demo against the register, so no gate
saw it either.

**3 · Where else the same fault sits — measured 2026-09-08.** All four
registers built since C5 (the audits). Synthwave (SW0–SW4, ratified
2026-09-08) was built the same way and is not audited yet; cyberpunk
was rebuilt under C5's reading. The same shape — a test that reads one
theme's value as the norm for all — sits in `tests/button.spec.mjs`
(the three sizes, TH111; the ring's channel order, AR30) and in
`gates/check-texture.mjs` (one ceiling for every theme).

**4 · The measure.** S49 in `docs/SCOPE.md` and the project rule in
`CLAUDE.md`: an approved demo is implemented exactly; a test or gate that
disagrees produces a finding for Kenny, with "Demo exact" as the
recommended option, and `main` waits. Every lift's ratification carries
an audit of demo against register (the four audits are the first), and
every deviation in it is an item Kenny answers. The 50 findings of this
correction are put to him grouped by what the deviation *is* (copy,
missing chrome, sizes, the ring, transitions, texture, token values,
fonts, mechanisms, KT8's two points), one item each.

**5 · What it costs.** One audit per lift (a Sonnet agent, ten to
fifteen minutes, read-only) and a longer ratification form. Where Kenny
chooses the demo over a test, the test changes or the frozen feature
gets its mini-round — that is the cost of the rule, and it is his to
spend.

**6 · Who enforces it.** Discipline for the rule and the audit step;
code for the half the compare page measures. The audit is a report, not
a gate, until field 8 says otherwise.

**7 · How and when it is measured.** At the next lift built from a
demo after this form (blueprint v3, once approved): its ratification
form carries the audit, and the audit finds zero deviations that were
not first asked. Recorded as KT15-M1 in `docs/MINI_ROUNDS.md`.

**8 · The fallback.** If that audit finds an unasked deviation, the
audit becomes a gate: a script that lays the demo's declared values
(tokens, sizes, durations, the header comment's measurements) beside the
register's and refuses the commit on a difference without a recorded
approval.

**9 · When we review the measure.** At round six's retrospective
(Phase 10), with the count of deviation items Kenny answered "Demo
exact" against "Houden" — if he keeps nearly every deviation, the rule
costs more than it protects and gets rewritten.

---

## fix-7 · Three faults that nothing had ever looked at from outside (2026-09-11)

Kenny answered **Klopt** on the correction form of 2026-09-11, after
asking to see the sidebar and to close the coverage gap the stage 1.4
gate had found. Both errands turned up defects in code already pushed.

**1 · What went wrong.** Three of them, one cause.

The button announced the moment it was wired rather than the width:
`attachSidebars` read the paint once at attach and never again, so a
window crossing the 40rem step — a phone turning sideways — moved the
aside while `aria-expanded` went on saying the opposite. It fails
silently, and only for the people who cannot see that it failed.

The open drawer lay over the one button that closes it. Escape and an
outside click still worked; the visible way out was the one that did
not. Found by the test that presses the same button twice, and Kenny
then saw the milder half of it on the demonstration page — the first
link sitting partly behind the button.

And attaching is not a toggle: `attachNavToggles` wrote its starting
state *through* the dispatch, so every consumer listening heard a close
nobody performed, on every page load. Two milestones old, in the
published bundle.

**2 · Which gate let it through.** None, and that is the point. The
frozen test bars name states and channels; nothing in them asks whether
anything ever observes the module from outside — no listener, no
detach, no eyes on a page.

**3 · Where else the same fault sits.** The property is "a module
behaviour no test observes from the outside", and it was searched for
twice. `grep -rn "NAV_TOGGLE_EVENT\|attachNavToggles" tests/` returned
four hits, every one inside a generated bundle under
`tests/fixtures/.build`. Then the drill: emptying *every* returned
cleanup loop at once touched four modules and turned exactly two tests
red, so `attachConfirmations` and `attachSkipLinks` are as unexercised
as these two were. Queued as `gap-8` rather than quietly folded in.

**4 · How we prevent recurrence.** A module that returns a detach or
fires an event gets, in the same milestone, a test that pulls it and a
test that listens. `tests/fixtures/attach-api.html` is the harness:
it attaches by hand and keeps the handle, which `js/auto.js` correctly
throws away — and which is why a detach could sit unexercised through
two milestones.

**5 · What it costs.** Two tests per module, about twenty lines each,
plus a harness that already exists and takes a third and a fourth
without changing shape.

**6 · Who enforces it.** Discipline.

**7 · How and when it is measured.** At `gap-8`'s closing, before round
seven's stage 2 ends: if those two go in without anyone being reminded,
the measure works.

**8 · The fallback.** A gate that looks up every exported event constant
and every `attach*` export in `tests/` and refuses what no spec names.

**9 · When we review the measure.** At round seven's retrospective.

---

## fix-8 · Code in a form rendered white on white (2026-09-11)

Kenny answered **Klopt**, and then reported that the measure did not
work: *"maak een notitie dat je `<code>` blokken nog altijd wit op wit
zijn en dus onleesbaar. Maar repareer dat volgende keer, goedgekeurd"*.
So this entry records a fault AND a failed first measure.

**1 · What went wrong.** Every piece of code inside a form's explanation
sat in a bare `<code>` element with no colour of its own, and it rendered
white on white on his screen. Part of the reasoning he was asked to
decide on was unreadable.

**2 · Which gate let it through.** `hooks/form-lint.py` counts pronouns,
coinages, old-shape identifiers and missing examples. It reads the text
and never how the text looks. Nothing in the protocol asks whether a
form can be read.

**3 · Where else the same fault sits.** The property is "a form surface
whose colour I did not set myself". Searched with `grep -c "<code>"` over
the four forms kept in the scratchpad: 6, 8, 14 and 12 — forty
occurrences across this conversation alone.

**4 · How we prevent recurrence — and why the first attempt failed.**
The measure proposed was to give every such element its colour
explicitly, from the widget's own variables, and the form proposing it
did exactly that: `color: var(--text-primary)` and
`background: var(--surface-1)` inline on each `<code>`. Kenny read that
form and reported the blocks still unreadable.

An inline declaration loses to nothing but `!important`, so either the
host stylesheet marks its `code` rule that way, or those two variables
resolve to the same colour in his rendering. The next attempt therefore
does not style `<code>` at all: the same inline styles go on a `<span>`,
which no element-name rule can reach. That is the repair he approved for
next time rather than now.

**5 · What it costs.** One inline style per fragment, written once and
copied between forms.

**6 · Who enforces it.** Discipline.

**7 · How and when it is measured.** At the next form that carries code:
Kenny can read it, or he cannot, and he finds out in the moment. This is
the second attempt at the same measurement; the first is recorded as
having failed.

**8 · The fallback.** `hooks/form-lint.py` refuses a form containing a
`<code>` element at all, the way it already refuses a correction with no
search recorded.

**9 · When we review the measure.** At round seven's retrospective.

---

## fix-9 · A settling value read once, under load (2026-09-11)

**1 · What went wrong.** `tests/register-shade-dark.spec.mjs:182` failed
in a full run and passed on its own seconds later: `1264 passed,
1 failed`, then `20 passed` for that spec alone. Standing rule 8a — a
test that fails and then passes is a defect until its cause has a name.

The name: the test polls `opacity` until it is `1`, then reads `filter`
ONCE. They are two properties of the same reveal, and opacity can finish
while the blur is still running. Under a full suite the machine is slower
and that gap opens.

**2 · Which gate let it through.** None. `retries` is 0 by Kenny's rule,
so the flake surfaced immediately rather than being papered over — that
part worked. What no gate does is tell a settling read from a bare one.

**3 · Where else the same fault sits.** The property is "a spec that
reads a value once when something animates that property". Searched with
`grep -rnE "expect\(await .*getComputedStyle" tests/*.spec.mjs`: 152
bare reads, of which 86 are on a property something in this package
animates. How many of those 86 are actually racy cannot be told by
grepping — a border-radius read on a settled page is fine and a filter
read mid-reveal is not, and the text of the two lines is identical. That
is the honest limit of this search and it is why the measure below is
what it is.

**4 · How we prevent recurrence — Kenny chose discipline, 2026-09-11.**
The wider gate was offered and declined: a check refusing
`expect(await … getComputedStyle(…).<animatable>)` inside a spec, with
86 sites to convert. His answer was **Alleen discipline**, and per the
protocol a written "consciously nothing" is information rather than an
invented measure, so it is written here.

What stands instead: a value that SETTLES is polled — `expect.poll` or
the readers in `tests/paint.mjs` — and the reads that matter are the ones
after a load, a click, a hover or a scroll. The 86 bare reads are not
swept; they are repaired where one is found, which is what fix-1 asked
for and what this recurrence did not change his mind about.

This is the third correction in this family (KT16, fix-1, this one), and
each time the broad sweep has been declined for the same reason: it would
push the animation half into a poll that waits the full timeout for a
value that left before it started looking. That reason has not weakened.

**5 · What it costs.** Nothing up front, and the honest price is that a
flake of this shape can happen again — the search above says grep cannot
tell which of the 86 are racy, so nobody can promise otherwise.

**6 · Who enforces it.** Discipline, by Kenny's decision.

**7 · How and when it is measured.** At round seven's last full run
before the tag: if a spec fails and then passes, discipline was not
enough and field 8 applies. Queued in `docs/MINI_ROUNDS.md` as `fix-9-M1`.

**8 · The fallback.** If a flake of this shape survives the gate, the
suite records `--repeat-each=3` for the register specs once before a
release, so a racy read is found deliberately rather than by luck.

**9 · When we review the measure.** At round seven's retrospective,
against the count of bare reads remaining.

---

## fix-10 · A turn of hours with no word in it (2026-09-11)

Kenny answered **Klopt**, after having to ask for it himself: *"je moet
normaal ook je vooruitgangindicatie tonen in chats"*.

**1 · What went wrong.** The turn he said it in ran eight commits from
end to end with no message in between. He saw tool calls and nothing
else, and could not tell where the work stood.

**2 · Which gate let it through.** None. Standing rule 16 asks for a
progress checklist in EVERY reply during multi-stage work, and nothing
counts how long it has been since there was a reply at all.

**3 · Where else the same fault sits.** The property is "a turn that runs
long without a word". Searched by reading this conversation back: the
last four turns before his remark were each a single unbroken block of
tool calls, and the longest of them landed eight commits. He interrupted
twice during it — once about his processor, once about the checklist —
and those are exactly the two moments a stop would have stood.

**4 · How we prevent recurrence.** The checklist goes at the FRONT of a
reply rather than the end, and a turn that would run past one commit is
cut into turns instead. Shorter turns are the measure; the checklist is
what they carry.

**5 · What it costs.** More turns, and a little repetition in each.
Against that: Kenny stopped having to guess, and twice in one turn he
paid for the guessing by interrupting.

**6 · Who enforces it.** Discipline. No check can see how long somebody
has been looking at an empty chat.

**7 · How and when it is measured.** At the next turn that does more than
one commit: the reply opens with the checklist, and he sees it or he does
not. Queued in `docs/MINI_ROUNDS.md` as `fix-10-M1`.

**8 · The fallback.** Every commit becomes its own turn, so the checklist
cannot be skipped.

**9 · When we review the measure.** At round seven's retrospective.

---

## fix-11 · A relative colour that resolved to nothing (2026-09-12)

**1 · What went wrong.** `hsl(from var(--primary) h s calc(l + 8%))`
paints TRANSPARENT. In a relative colour the `l` channel resolves to a
number, so adding a percentage to it is a type error; the declaration is
dropped and the element keeps no background at all. No engine warns.

Kenny found it by hovering one button. Three separate themes came back
with the same sentence — "de verstuur knop is onleesbaar bij hover" —
and every one of them was this line.

**2 · Which gate let it through.** None, and several looked straight at
it. `check-layers.mjs` reads these declarations to police DI9 and cares
only whether a colour is a token. The contrast advice reads tokens, not
the states a register paints. And a browser test that reads a hover
colour would have caught it, but no test hovers a primary button in
every theme.

**3 · Where else the same fault sits.** The property is "a channel
keyword with a percentage added to it inside a relative colour". Searched
with `grep -rn "calc(l " css/*.css`: 25 occurrences in 10 stylesheets, of
which **20 in 7 registers** carried the percentage and were broken —
blueprint, dark, nostromo, sepia, shade-dark, solstice and woodblock. The
other five already used a valid form. Every one of the twenty was a hover
or an active state, which is why nobody saw it: the resting state is
correct and the fault only appears under the pointer.

**4 · How we prevent recurrence.** `gates/check-relative-colour.mjs`,
in `npm run gates` and in the commit hook. It refuses exactly this shape
and nothing else, because everything else in the family works — measured
the same day: `hsl(from … h s l)`, `calc(l + 8)`, `calc(l * 1.1)`,
`oklch(from … calc(l + .05) c h)` and `color-mix()` all resolve, and only
the percentage does not.

**5 · What it costs.** One narrow gate of about forty lines. The risk of
a wider rule — refusing relative colours, or auditing every state — would
be a rule that fires on correct code, and this one cannot.

**6 · Who enforces it.** Code.

**7 · How and when it is measured.** It was measured before it was
written: the gate was driven red by putting one percentage back, and it
named the file and the line. The standing measurement is that it stays in
the chain; the test that compares the gate list against the commit hook
already refused this gate until it was in both.

**8 · The fallback.** If a variant slips past the shape this gate knows,
the browser suite gains one test that hovers a primary button in every
theme and refuses a transparent background — which is the assertion that
would have caught this one on the day it was written.

**9 · When we review the measure.** At round seven's retrospective.


## fix-12 · A register that cancelled the pressed state (2026-09-12)

**1 · What went wrong.** Pressing a button did nothing visible. Not in
one theme — in thirteen of the twenty-five, and in two more once the gate
was written to see the variants as well as the roots.

**2 · How it was found.** Kenny, reviewing the shade-dark quirk on
2026-09-11: _"ik kan enkel de ingedruktheid zien als ik de knop indruk,
blijf indrukken en dan zo mijn muis van de knop weghaal. Als ik gewoon
blijf klikken op de knop zelf, dan gebeurt er precies niks... bij shade
light werkt het wel precies."_ Dragging the pointer off the button showed
the press — which is the whole diagnosis, stated before anyone knew it.

**3 · The cause.** `@layer kp.base, kp.components, kp.register, kp.layout,
kp.utilities`. A layer beats a state. A register writing
`[data-theme='x'] .kp-button:hover { background: … }` in `kp.register`
outranks `.kp-button:active { background: var(--secondary-active) }` in
`kp.components`, whatever their specificity. So the pressed state existed
and was unreachable — exactly while the pointer was on the button, which
is the only time anyone presses one. Take the pointer away and the hover
rule stops matching, and the pressed state reappears. That is why it
looked like the press only worked after you left.

**4 · Why nothing caught it.** Three gates looked straight at it. The
token gate reads names, not the cascade. The contrast gate measures rest
and hover, never the held-down state. The register-coverage gate asks
whether a root is answered, not whether an answer destroys another. And
no browser test pressed a button and read the paint: the specs that
handle `:active` all check a theme whose press happens to survive.

**5 · The measure, code-enforced.** `gates/check-pressed-state.mjs`, in
`npm run gates` and in the commit hook. It reads which button selectors
the components layer gives a pressed background — three today — and
refuses a register that paints one of them on `:hover` without writing
any `:active` rule of its own for the same selector. Deliberately narrow:
it does not care WHAT the register presses with (retro inverts a bevel
and shifts its padding, and that is a reaction), and it says nothing
about `--ghost`, which the base layer never gave a pressed state.

**6 · The measure, in the browser.** One test per theme in
`tests/registers.spec.mjs`: hover a primary button, let the hover settle,
hold it down, and require the paint to change — background, box-shadow,
translate, both paddings, border and text colour in one vector. Reading
only `background-color` called retro red on the first run, because that
theme presses with its bevel; the narrower question could not see a
reaction that was plainly there.

**7 · The repair.** Twenty-one rules across thirteen registers, each one
restating the components layer's own pressed values token for token.
Nothing new was decided: what the base layer already said was put back
where the cascade can reach it.

**8 · The drills [KT3].** The source gate: the restored
`[data-theme='terminal'] .kp-button--primary:active` rule removed → the
gate refuses that file; restored → green. The browser test: the same
removal → red on terminal alone; restored → green. The unit test covers
the four shapes — cancelled, replaced, out of scope (`--ghost`), and a
hover that paints no ground.

**9 · When we review the measure.** At round seven's retrospective. The
open question is whether the same collision exists for the other states a
register overrides — `:focus-visible` is already known to (DI2 exists
because of it), and `:disabled` has not been looked at.

**Kenny approved fix-12 on 2026-09-12 ("Klopt").** The measurement named
in field 7 — the next new quirk that writes a hover background — is
queued in `docs/MINI_ROUNDS.md` as `fix-12-M1` and comes due when
grotesk's quirk is built. The correction does not close until then.

## fix-13 · A gate that measured on import (2026-09-12)

**1 · What went wrong.** `node --test gates/` died on the whole of
`gates/gates.test.mjs` with `4 contrast violation(s). A theme that fails
AA cannot ship.` — a message about contrast, in a file that tests none,
with no test name attached to it.

**2 · How it was found.** Building the spectral instrument's tokens. The
new dark has a pale signal, which the derivation turns into a pressed
state too close to it, so the contrast check started reporting. That
report should have been advice printed by `npm run advice`. Instead it
ended the test run.

**3 · The cause.** `gates/check-contrast.mjs` did its measuring at module
top level and finished with `process.exit(1)`. `gates.test.mjs` imports
`discoverThemesFromCss`, `EXPECTED_THEMES` and `STATUS_NAMES` from it, and
an import runs the module. So importing a helper killed the importing
process.

Two consequences, and the second is the worse one. The visible one is a
useless failure message. The invisible one is that the accessibility floor
became a **hard gate by accident** — the exact opposite of Kenny's
decision of 2026-09-09, which is that contrast, the invariants, the flash
threshold and the texture ceiling are measured and printed, never refused.
`check:contrast` is correctly absent from the `gates` chain; it leaked in
through an import anyway.

**4 · Where else the same fault sits.** The fault as a property: *a gate
module that another module imports, which can call `process.exit` at
module top level.* Searched on 2026-09-12 across `gates/`:

```
for f in gates/*.mjs; do
  grep -q "process.exit" "$f" || continue
  imp=$(grep -rl "from './$(basename $f)'" gates/ tests/ js/ | grep -v "$f" | wc -l)
  [ "$imp" -eq 0 ] && continue
  grep -q "import.meta.url ===" "$f" || echo "UNGUARDED: $f"
done
```

Sixteen gate modules are imported by something else. Fifteen already put
their run behind `import.meta.url === \`file://${process.argv[1]}\``.
`check-contrast.mjs` was the only one that did not. The first search ran a
wrong pattern and reported forty-one offenders, which is worth recording:
a search that reports everything is as useless as one that reports nothing.

**5 · The measure.** The same guard the other fifteen carry, and a unit
test that asserts the **property** rather than the file — every gate in
`gates/` that another gate imports and that can call `process.exit` must
compare `import.meta.url` against the entry point. A sixteenth gate written
tomorrow is covered without anyone remembering this.

**6 · What the remedy costs.** Nothing. The guard is three lines and the
test is thirty.

**7 · Who enforces it.** Code: `npm test`, which the commit hook runs.

**8 · How we measure that it works, and when.** Done at the moment of the
fix: the guard was removed and the test went red, restored and green. And
the behaviour itself was proved — with a deliberately failing theme in
place, `import('./gates/check-contrast.mjs')` ends the process without the
guard and returns four exports with it.

**9 · When we review the measure.** At round seven's retrospective.

**The four contrast findings stay findings.** They came from the spectral
instrument's own approved values and are put to Kenny rather than quietly
corrected [S49, S42]. They are not the subject of this correction.

## fix-14 · A sweep that walked into other sessions' worktrees (2026-09-12)

**1 · What went wrong.** Removing four themes meant stripping every
mention of their registers from the files that name them. The sweep walked
the repository, and `.claude/worktrees/` is inside the repository. It
rewrote 138 files across sixteen worktrees belonging to other agent
sessions.

**2 · How it was found.** Immediately, in the sweep's own report: the list
of edited files was mostly paths under `.claude/worktrees/`. The exclusion
list it carried — `node_modules`, `.git`, `dist`, `site`, `examples`,
`showcase/themes`, `ha`, `test-results` — had been written by thinking
about GENERATED output, and a worktree is neither generated nor mine.

**3 · The cause.** A directory walk with a deny-list. Every deny-list is
a guess about what exists; this one was a guess made before those
worktrees did.

**4 · Where else the same fault sits.** The fault as a property: *a
repository-wide walk that writes, filtered by a deny-list rather than by
what git tracks in THIS worktree.* Searched on 2026-09-12:

```
grep -rln "os.walk\|readdirSync.*recursive\|find . -type f" gates/ hooks/ .claude/
```

Nothing else in the repository walks-and-writes; the generators all work
from explicit file lists, and the gates only read. The offender was a
one-off script in a shell heredoc, which is exactly the kind of code that
carries no guard because it is expected to be thrown away.

**5 · The measure.** A one-off sweep that writes takes its file list from
`git ls-files`, never from a directory walk. `git ls-files` reports only
what THIS worktree tracks, so another worktree cannot be in the list no
matter where it sits. Discipline-enforced: there is no code to gate, and a
hook that inspected every heredoc would be worse than the disease.

**6 · What the remedy costs.** Nothing. `git ls-files | grep ...` is
shorter than the walk it replaces.

**7 · Who enforces it.** Discipline.

**8 · How we measure that it works, and when.** At the next sweep that
edits many files at once — stage 3 still has the documentation pass, which
touches every document that names a removed theme. The check is that the
command begins with `git ls-files`.

**9 · The recovery, and what made it possible.** Every damaged file was
restored, verified at zero. It worked only because the damage had one
shape: the sweep removed lines and changed nothing else, so a file whose
whole diff against HEAD was deletions of register lines could be restored
outright, and a file carrying its own work could be told apart and left
alone. 107 files restored that way and 31 more from HEAD where the
worktree had unmerged paths; 232 files with their own changes were
untouched. A sweep that had REWRITTEN lines instead of deleting them would
not have been separable like that.

**10 · When we review the measure.** At round seven's retrospective.

## fix-15 · Fifteen browser tests were red on the branch and nobody could see it (2026-09-12)

**1 · What happened.** Phase 7's hardening audit ran the specs together
for the first time since round seven began and found **fifteen failing
browser tests already on the branch** — not introduced by the audit, and
measured that way: `git stash`, run the seven spec files, `git stash pop`,
run again. Fifteen before, sixteen after, and the one added was a real
defect a widened test had just caught.

Some of those fifteen had been red long enough that the thing they exist
to prove had quietly stopped being proven. `tests/bare.spec.mjs` called
`page.route()` with one argument — the signature is `route(pattern,
handler)`, so the handler was taken as the pattern and every run died on
`route.request is not a function` before the page loaded. That test is the
whole framework-free channel's proof: the page readable with its register,
its fonts and its module all refused. It had not actually run.

**2 · Why nobody saw it.** `npm run test:affected` resolved a change to
`css/<theme>-register.css` to `tests/register-<theme>.spec.mjs` and
nothing else. Every quirk and every hover gesture of round seven is a
register edit, so the inner loop ran twenty tests and printed green while
the fifteen every-theme sweeps — press, alert contrast, focus ring,
reflow, bundle — never ran at all. The whole suite is Kenny's to give
(fix-2), so between one of his runs and the next there was nothing
watching. Measured 2026-09-12: one register spec is 20 tests, that spec
plus the sweeps is 446, the whole suite is 1,297.

**3 · The four that were stale rather than broken.** Four themes were
removed at `scope-11` and four tests still named them: `reflow.spec.mjs`
asserted `THEMES.length === 25` and that its findings file held thirteen
entries, three of which were for removed themes; `fallback.spec.mjs`
proved "a name that IS a theme says nothing" by applying `woodblock`,
which had stopped being one — so the test asserted the opposite of its own
title; `marquee.spec.mjs` navigated to `/examples/concept-ticker.html`,
which no longer exists. Each now derives from `themes/order.json` or from
the theme's own copy instead of carrying a hand-written constant.

**4 · The one that hid a whole theme.** `gates/generate-showcase.mjs`
carried a hand-written list of `<link>` tags for the registers, in two
places. `dark` was added in round seven and never added to that list, so
`showcase/themes/dark.html` loaded twenty-one other themes' registers and
none of its own. Fifteen every-theme sweeps read that page; all of them
had been measuring dark undressed. Found by a Phase 7 pointer test that
asked dark for a knob dark's own register declares and got nothing back.
The list is now read off disk, and a unit test refuses a showcase page
that does not load the register of the theme it exists to show.

**5 · What the widened tests then found.** Ten tests stay red, and every
one of them is a product finding rather than a test fault:

| What | Where | Measured |
| ---- | ----- | -------- |
| The plain button does not react to being pressed | grotesk | hovered `rgb(245, 245, 245)`, held down `rgb(245, 245, 245)` — the same |
| Only one half of the focus ring | light, shade-light, shade-dark | an outline, and a decorative shadow where the ring's second half should be (8 tests) |
| Buttons overflow at a phone width | blueprint | content 195 wide in a box of 189, at 320px |

Under `S49` a value an approved demo showed is not changed without Kenny's
word, so these are put to him rather than repaired. The tests stay red
until he answers.

**6 · The gates that could not say no.** Six verdicts were widened in the
same pass. `check-ids.mjs` saw none of round seven's vocabulary — the
patterns wanted `[A-Z]{1,4}[0-9]+`, and `scope-`, `fix-`, `gap-`, `step-`
and `feat-` are lowercase — and deduplicated within a file, so one
document defining an ID twice could not collide with itself. It now sees
463 IDs where it saw 342, and it caught `scope-24`, which named two
different decisions on two consecutive days. That is `KT10` again, in the
document `KT10`'s gate was written for, one ID series later.

`check-pressed-state.mjs` and `check-variant-ground.mjs` printed a green
line with a zero in it if their parser found nothing —
`check-register-coverage.mjs` already guarded exactly that, for exactly
this reason. `check-fonts.mjs` had a written "nothing promised" pass that
fires when `fonts/` is gone, and `css/fonts.css` is generated from
`fonts/`, so the two fall to zero together; the themes name their families
in their own tokens and are now the independent witness. The `S49` sweep
iterated the opt-in list rather than `themes/order.json`. And `fix-13`'s
own guard was keyed on `process.exit` rather than on the property it
names, so a generator that rewrites tracked files on import was invisible
to it — which is how the audit came to rewrite eleven example pages while
running.

**7 · Two tests that could not fail.** `tests/effects.spec.mjs` proved
`TH119` ("final text equals source") by comparing the headline's text
against `data-kp-text` — an attribute `js/effects.js` writes itself, from
the element's own text, every time it runs. Both sides of the assertion
were the module's. Measured with the headline permanently scrambled: the
old comparison answers `true`, the new one — against the authored copy in
`showcase/concept-copy.mjs` — answers `false`.

And `tests/button-surfaces.spec.mjs` carried a drill record for an
assertion that did not exist: "`opacity: 0` removed from the readout ->
red on it being invisible". No test anywhere named `.kp-button__readout`.
That is a false drill record, which is the one thing `KT3` exists to
prevent. The reason it could not be written is its own finding: no page in
the package renders a readout at all, while two registers style it in
full.

**8 · The measure.** Three things, two of them already code:

- `gates/affected.mjs` resolves a register or anatomy edit to its own spec
  **plus every spec that sweeps all themes**, found by reading the specs
  rather than by keeping a list. A unit test asserts the finding is not
  empty, because a widening that finds nothing is the narrow map again.
- A unit test refuses a showcase page that does not load its own theme's
  register.
- Discipline: a test that names a theme names it from `themes/order.json`
  or from the theme's own copy, never as a literal. A literal theme name
  in a spec outlives the theme.

**9 · Gezocht met.** `git ls-files 'tests/*.spec.mjs' | xargs grep -l` for
each removed theme name; `node gates/check-ids.mjs` after widening;
`npx playwright test --project=firefox` whole, twice, once on a stash.

**10 · When we review the measure.** At round seven's retrospective, with
the question: did the widened `test:affected` catch anything before a full
run did.

### fix-15, what closing the eight gaps then found (2026-09-12)

Kenny answered the Phase 7 gate with **Dichten** on eight of the nine gaps
and **Later** on the ninth. Six closed; two came back as findings, and the
reason is worth writing down in both cases.

**`grotesk-press` was `fix-12` a third time, one storey down.** The
register carried a correct `:active` rule with a correct token and it
never painted: the hover rule above it carries three `:not(.class)`
clauses, so it outranks the press by two steps of weight — six against four,
measured by calling `weight()` rather than by counting in prose — and a pointer is
always hovering while it presses. Not a later layer beating a state — a
longer selector in the same layer doing it.
`gates/check-pressed-state.mjs` now compares the weight of each control's
hover rule against its own pressed rule and refuses the first being
heavier, with `:not(:active)` on the hover as the recommended idiom;
`css/high-contrast-register.css` already wrote it that way, which is how
the gate knows what right looks like.

**`focus-ring` was the same fault a fourth and fifth time.** Three themes
painted their own elevation on a button from `kp.register`, which swallowed
the ring `kp.components` draws on `:focus-visible` — a keyboard user got an
outline and nothing behind it. Two more, `dark` and `titanium`, painted
nothing at all on a menu item inside the row menu, because the popover
rounds its corners and a ring drawn outside the item has nowhere to land.
The elevations and the corners are what the demos showed and both stay;
the ring is restored in front of the one and inside the other. A sixth
thing came out of it: `light` transitions box-shadow, and a
one-layer-to-two-layer transition interpolates by inserting a blank layer,
so mid-flight the ring read as a nought-spread layer — which is exactly
"half a ring". Both states carry two layers now.

**`counters` met its frozen bar only after the test was rebuilt.** The bar
is "at the reduced-motion setting the final number is there immediately,
measured on what is painted", and the first version of that test read the
text and found it correct — because the final number is what the HTML
says. It reads correct when nothing counted and when the count has already
finished. The recorder is armed before the module exists now, and the bar
is "this list of changes is empty" [fix-1]. Two faults in the module came
out of the same rebuild: `Number(knob) || 900` read a deliberate `0` as
unset, the absence of a value taken for the value a fifth time in this
package; and `1.204` is one thousand two hundred and four in Dutch and
one-point-two-oh-four in English, which the string alone does not decide —
the nearest `lang` does.

**`sidenav-react` found a foot-gun rather than a missing component.**
`js/auto.js` attaches on load and React mounts after it, so a consumer
would have had to know to attach again by hand — and the first sign of not
knowing is a navigation that renders perfectly and does nothing. The
component attaches itself on mount, with `autoAttach={false}` as the way
out. What the suite compares is the DOM the two channels PRODUCE, element
by element, not a checklist of things each contains.

**Two are back with Kenny, and one of those is a diagnosis that was
wrong.** The gate form told him `blueprint-width` was the letter-spacing
and the 600 weight, and that six pixels of padding would give it back.
Both are false. Every blueprint button is exactly six pixels wider than
its box at every width, because this theme's approved hover gesture puts
two witness lines at `-0.35rem` outside the control and the right-hand one
adds 5.6px plus its own pixel to the scroll area whether or not it is
visible. `overflow: clip` with a clip margin was tried and does not help —
Firefox counts the clip margin in `scrollWidth`. No repair preserves the
approved appearance, so it goes back to him with the real cause.

And the data-surface sweep found `shade-light` declaring
`--muted-foreground` identical to its `--foreground`, both
`hsl(194, 14%, 40%)`. Twenty-one of twenty-two themes differ. It reaches
every caption, every timestamp, every disabled label and every
placeholder in that theme, and it is a palette value, so it is his.

### fix-15, the last three, and one advisory that had become a gate (2026-09-12)

Kenny answered the three open findings: the witness lines move inside,
the readout takes `READY` and `PART 26`, and shade-light's muted colour
goes to 46%.

**The blueprint gap was six pixels of the theme's own gesture.** The gap
changes sign — the lines sit the same distance from the boundary, on the
inside of it — and every button measures `189 in 189` where it measured
`195 in 189`. The vertical overhang is untouched; it never contributed to
the width, and it is what makes them read as measurement marks.

**The readout now exists.** Every theme has the slot because the
slot-equality rule is what makes the concept pages comparable; only the
two whose registers style the surface carry words, and a unit test holds
those two lists together in both directions — a register that styles it
with nothing to say fails, and words no register paints fail too.

**Setting shade-light's muted colour found an advisory that had quietly
become a gate.** `gates/compliance.mjs` shells out to `check-contrast.mjs`
to quote its own output into `docs/DESIGN_INVARIANTS.md`, and let
`execFileSync` throw. Contrast is advice in this package by Kenny's
decision of 2026-09-09 — measured and printed, never refused — but a
throw there failed `npm run gates` on a shortfall he had just chosen
deliberately, with the number in front of him. That is `fix-13`'s shape a
second time: an advisory becoming a gate through a back door. The call
quotes both streams now and does not obey the exit code, and
`check-contrast.mjs` no longer claims "a theme that fails AA cannot ship",
which had not been true in this package since 2026-09-09.

**And a browser test was enforcing the same floor.**
`tests/surfaces.spec.mjs` already had a `REPORTED` list for a pair an
approved demo puts under the floor. It could name one element by its
text, which is the wrong shape for a decision about a TOKEN: shade-light's
muted colour lands on eight lines across two grounds, and naming each
would have recorded the fixture's wording rather than the choice. An
entry may now name a colour pair instead, and it still has to measure
what it says — an entry cannot outlive the thing it excuses, in either
form. The stale entry for `ticker`, a theme `scope-11` removed, went with
it.

## fix-16 · The documents said things the code does not say (2026-09-12)

**1 · What went wrong.** Phase 8's honesty pass found eleven claims in the
project's own documents that the package does not keep. Four were quoted
messages in shapes nothing prints — `theme discovery broke: expected 25,
found 24` where the code says `expected N themes, found M [list]`; a flash
message missing its `— SC 2.3.1 allows 3.` tail and naming a keyframe
`fx-flicker` that does not exist among the `kp-*` ones; and twice "the
twenty-five names" against a package that ships twenty-two. Three were
counts: the README's "Thirty gates" against thirty-four, its "some 2500
tests" against 2,736, and `docs/ARCHITECTURE_REFERENCE.md`'s "25 blocks".
One was a decision record describing `fonts/LICENSES.md`, a file never
made — the build chose `fonts/<family>/LICENSE` instead. One was the
README claiming no theme carries a recorded shortfall while three do. One
was `docs/TROUBLESHOOTING.md` claiming to replace two documents that now
exist. And one was in `CLAUDE.md` itself: "nothing runs on a server",
while `.github/workflows/release.yml` builds every release and
`pages.yml` publishes the site. Only `ci.yml` was ever deleted.

**2 · Which gate let it through.** None, and none could: thirty-four gates
read the code and a person reads the prose, so nobody ran the prose. The
procedure names this exact fault from HTTPSwitchboard, where a README
showed an argument the binary had refused since its previous major.

**3 · Where the same fault sits.** The property is **a document asserting
something the package can be asked about**, and there are three kinds
here. Searched with `git ls-files '*.md' | xargs grep -oE` for each:
`npm run <script>` against `package.json`'s scripts (265 claims, all
real); a backticked path that looks like a file this repository ships,
in the thirteen documents a person FOLLOWS rather than the records
(21 of the 23 first flagged were records correctly naming what was there
at the time); and `from '@kp-soft/themes/…'` against the export map. The
fourth kind — a quoted message — needed its own search, against the whole
source as one body of text.

**4 · How we prevent recurrence.** Three gates, all in `npm run gates`
and in the commit hook:

- `gates/check-docs-runnable.mjs` — every command, path and import subpath
  a followed document names is real. 265 claims.
- `gates/check-doc-quotes.mjs` — every message a followed document quotes
  verbatim is a string the source really prints. A quote carrying a
  placeholder is skipped, because `<file>:NN names …` is a claim about a
  SHAPE and matching those turned out to need a comparison subtle enough
  to be wrong quietly. Two attempts at it reported nineteen legitimate
  rows before that was clear, and a gate that cries wolf is one people
  learn to skip. It costs nothing: every one of the four real faults was
  verbatim.
- `gates/check-docs-private.mjs` — nothing of a refused shape in any
  document, and the things already published held to their count.

Plus two unit tests that bind a hand-written number to its source: the
README's gate count against the hook's, and `CLAUDE.md`'s document table
against `docs/`.

**5 · What the remedy costs.** Three gates and two tests, seconds in the
chain. The real cost was in the building: the quote gate passed its own
drills twice before it worked, because its first matcher let 1,031
template literals between them match every sentence, and its second parsed
JavaScript strings with a regular expression and silently lost every
message in a file containing an apostrophe — including one this very gate
then reported as unprintable.

**6 · Who enforces it.** Code, all three, in the chain and in the hook.

**7 · How we measure that it works.** At the next document a phase
writes: it either passes these three on the first run or it does not, and
either answer is information. Queued in `docs/MINI_ROUNDS.md`.

**8 · The fallback if the measurement fails.** If a false positive ever
makes someone reach for `--no-verify`, the quote gate narrows to an
explicit list of messages worth holding rather than all of them.

**9 · Gezocht met.** `git ls-files '*.md' | xargs grep -ohE '\bnpm run
[a-z][a-z0-9:_-]*'` for the commands; the three gates themselves for the
paths, imports and quotes; `gh repo view --json visibility` and
`ls .github/workflows/` for the two claims about the repository itself.

**10 · When we review the measure.** At round seven's retrospective, with
the question: did a gate catch a documentation fault before a person did.
