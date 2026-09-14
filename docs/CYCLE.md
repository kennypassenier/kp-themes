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

## How a verdict reaches the register

Kijken's verdicts are kept in the repository, in `catalogue/verdicts.json`,
for good: a change to the tooling must never undo one (Kenny, 2026-09-13,
form item verdict-ledger). A verdict belongs to a block, a theme and a
browser engine — `firefox` for Gecko (Firefox, FireDragon), `chromium` for
Blink (Chrome, Chromium, Edge) — which the page detects on its own; a block
approved in FireDragon is still to be judged in Chrome. Each entry keeps the
block's hash, the commit it was recorded on and the date.

1. Kenny judges on the review site or a local server. Every Approve and Not
   approved is kept in that browser first, and the panel says so ("In this
   browser, not yet recorded").
2. Kenny copies the prompt and pastes it into the conversation. Its last
   block, `Verdict lines (hash version N):`, carries one line per verdict not
   yet in the register: `block key · theme · engine · verdict · hash`.
3. Claude saves the pasted text and runs
   `node gates/verdicts.mjs record < prompt.txt`. The tool refuses a block
   no page shows, a theme that does not exist, and lines taken with another hash version, and prints what it
   added and changed. Claude commits the register and pushes `round-six`.
4. From the published register on, the block counts as judged in every
   browser of that engine ("In the register"). A verdict made later in a
   browser, and different from the register's, wins until it is recorded in
   turn.

A block that changes after its verdict hashes differently and comes back to
be judged; that is the point. A change to the hash recipe itself
(`catalogue/block-hash.js`) is not a change to any block, so it must not
bring anything back:

1. The change raises `HASH_VERSION` in `catalogue/block-hash.js`.
2. `npm run gates` then refuses (`gates/check-verdicts.mjs`): the register's
   `hashVersion` differs — "run node gates/verdicts.mjs rehash".
3. `node gates/verdicts.mjs rehash` measures every entry again at the commit
   it was recorded on (a temporary git worktree, served on a free port with
   the new `block-hash.js` injected), in its own engine (Playwright's Firefox
   or Chromium), at 1920 px, and writes the new hashes and version. The
   verdicts, commits and dates stay as they were.
4. The register and the recipe are committed together.

The recipe reads past what differs between two browsers of one engine or
two window sizes, as measured on 2026-09-13 (lengths to the half pixel,
`attr()` in `content` resolved, no translation in `transform`, lengths in
viewport units read as "a length", a block still loading given time to
finish); why is at the head of `catalogue/block-hash.js`. A window narrow
enough to switch a component to another layout (a data table's cards below
a 40rem container) is a different look and hashes differently.

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

1. **Building:** the tests tagged with what is being touched, firefox
   only — `npm run test:tags -- --level building`. The tag map
   (`tests/tags.json`) turns each changed file into tags: a register into
   `@theme:<theme>`, a changed rule in `css/components.css` into the
   component its selector names, a module into its components, a changed
   spec into that file.
2. **Commit:** building plus every `@sweep` test, firefox only, once —
   `npm run test:tags -- --level commit`. About two to three minutes;
   run by hand or by the `checker` agent, not by the commit hook.
3. **Release (before Uitrol):** the whole suite, both engines —
   `npm run test:browser` — Kenny's to authorise, asked in a form; Claude
   runs it with his go.

Every test carries `@component:<name>`, `@theme:<name>` or `@sweep`;
`npm run check:tags` (in the gates) refuses one that does not, and a file
no rule in the map covers. `--dry-run` prints the selection and the count
without starting a browser. The map was measured once against what it
skips (standing rule 7i) on 2026-09-14; the numbers are under `measured`
in `tests/tags.json` and in `docs/TEST_PLAN.md`.

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

## The session title

kp-themes runs three steps, not eleven phases, so the title carries the
step and its subject: `🎨 kp-themes - Bouwen - catalogus`,
`🎨 kp-themes - Kijken - reeks 2`, `🎨 kp-themes - Uitrol - 7.0.0`. The
shape of standing rule 22 is unchanged — Kenny owns the name, Claude owns
the suffix — and rule 22 itself is unchanged for every other project: this
is an exception recorded here, approved 2026-09-13.

## What is enforced outside this repository

Two of round eight's decisions reach past the repo, and each was asked
separately (2026-09-13):

- **The lexicon holds everywhere.** `~/Projects/dev-procedure/LEXICON.md`
  lists the words that do not reach Kenny and what is written instead;
  `~/Projects/dev-procedure/hooks/form-lint.py` refuses a form containing one and
  `~/.claude/hooks/may-i-stop.py` refuses a reply containing one, in every
  project, because the language rule it enforces is already global.
- **The status line holds only here.** The same Stop hook checks the four
  fields only in a project whose CLAUDE.md carries `status-line:
  required`. kp-themes carries it; nothing else does.

`~/Projects/dev-procedure/PROCEDURE.md` is deliberately untouched: the
short route already covers this cycle, and a pointer would invite a second
project to copy it unseen.

## Worktrees

A background agent works in its own git worktree, never in the checkout
the conversation edits. Its files are picked up from that worktree by
path; the worktree is removed once its content has landed on the branch.
