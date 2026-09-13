# The kp-themes cycle

How work moves in this project from round eight on (decisions `scope-29`
to `scope-44` in [SCOPE.md](SCOPE.md)). It is the short route of
`~/Projects/dev-procedure/PROCEDURE.md` (Phase 0, the route table) written
out for a theme package: every standing rule still holds, every gate on
the code still runs, the correction loop is unchanged. What changes is how
often the work stops to ask something, and what it asks.

This document is **kp-themes only**. It changes nothing in
`~/Projects/dev-procedure`; where a wish of this project would touch the
global procedure or a user-level hook, that wish is a separate form item
marked "raakt de globale procedure" and waits for Kenny's explicit go.

## The three steps

| Step       | What happens                                                                                                                                                                                                                                   | Ends with                                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bouwen** | The theme or component work. Only the code gates (`npm run gates`, seconds) and the tests of what was touched (see the gradations below). Claude commits per finished piece. No documentation pass, no report form, no correction form for test failures — those are work. | A batch of catalogue pages that shows the work, each block with its "Kijk naar:" text. |
| **Kijken** | Kenny looks at the catalogue. One report form per batch: per page or block, Akkoord · Toon mij dit · Niet akkoord. A "Niet akkoord" goes straight back to Bouwen; no correction form unless the fault is in the process itself. While Kenny looks at batch N, Claude builds batch N+1. | Every block of the batch answered Akkoord. |
| **Uitrol** | Version bump per semver (a released theme never changes in place), tag, the release workflow builds the assets and the draft release, Kenny publishes. Before the tag, Claude asks in a form whether it may run the whole suite in both engines; with the go, it runs it. | The release published, the status block updated. |

Bouwen → Kijken repeats as often as needed before one Uitrol. A large
round (every theme extended) is the same three steps with a longer Bouwen.
A fault found live — in a consumer, in Kenny's own browser — still ends in
a correction form (standing rule 29); a test going red while building does
not.

## Research is a side stream

A question that needs outside references — an alternative component, a
layout family, a loading strategy — goes to the `researcher` agent
(`.claude/agents/researcher.md`), in the background, in its own worktree,
while Bouwen and Kijken continue. It delivers `research/<topic>/README.md`
and `demo.html`; the demo is looked at the Kijken way, and its outcome is
a form. What Kenny approves becomes an ordinary Bouwen step.

## Which agent runs when

Kenny does not call agents; the step does. `researcher` runs at the start
of any research question. `theme-builder` runs when one change must land
in every theme: one instance per theme, in parallel, each measured by the
gates. `checker` runs after an edit to `css/` or `js/` and reports one
line per failure, so the raw test output stays out of the conversation.
Their definitions live in `.claude/agents/` and carry the "use
proactively" description the harness delegates on.

## Tests: three gradations

1. **While building:** the tests tagged with what is being touched, firefox
   only — `npx playwright test --grep "@theme:terminal|@sweep"
   --project=firefox`. Until the tag map (`tests/tags.json`, file → tag)
   exists, the single spec file being worked on.
2. **Before a commit:** the tags of every touched file, firefox only, once.
3. **Before Uitrol:** the whole suite, both engines — Kenny's to authorise,
   asked in a form; Claude runs it with his go.

The tag map is measured once against what it skips before it is trusted
(standing rule 7i), and the count is written beside it.

## What a test is for, from round eight on

A test asserts what a person cannot see on the catalogue or would need
too many clicks to check: invisible behaviour (focus traps, screen-reader
text, reduced-motion guards, the flash threshold, the string dictionary,
token parity, `[hidden]` winning) and cross-products (a pressed state in
22 themes × 3 buttons, a focus ring in every theme). What a single theme
looks like is the catalogue's job, with its "Kijk naar:" text, and the
per-theme register specs go as their catalogue blocks arrive.

## The status line

Every reply of Claude's opens with one line in four fields:

`Stap: bouwen · Bezig met: css/terminal-register.css, knoppen · Tests: @theme:terminal (firefox) · Poorten: nog niet`

`Stap` is one of bouwen · kijken · uitrol · onderzoek · scope. `Tests`
names what ran or "geen". `Poorten` says whether `npm run gates` has run
for the current change. The session title carries the step. Enforcing the
line with the Stop hook touches a user-level file and is a separate form
item for Kenny.

## Worktrees

A background agent works in its own git worktree, never in the checkout
the conversation edits. Its files are picked up from that worktree by
path; the worktree is removed once its content has landed on the branch.
