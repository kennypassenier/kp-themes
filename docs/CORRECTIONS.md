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
