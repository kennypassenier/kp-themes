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
it changed": formal 12.1, light 10.6, dark 10.7, pastel 11.4, topo 11.3 —
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
