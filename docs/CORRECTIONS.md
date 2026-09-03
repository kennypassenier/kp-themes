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
