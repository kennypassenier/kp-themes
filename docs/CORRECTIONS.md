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
