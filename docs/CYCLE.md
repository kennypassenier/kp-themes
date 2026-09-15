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
block's hash, the commit it was recorded on and the date. The theme is the
page's, unless the block declares its own with `data-cat-theme="<name>"`: an
intro block on `catalogue/intros.html` is judged, labelled and recorded in the
theme its window plays, whatever the page wears [scope-86].

1. Kenny judges on the review site or a local server. Every Approve and Not
   approved is kept in that browser first, and the panel says so ("In this
   browser, not yet recorded"). Not approved records only when the block's
   note holds text; with an empty note the panel refuses, marks the note and
   says why, on every review surface [scope-89]. Approve needs no text.
   On the review page and the component pages, **Review in a dialog** (in
   the bar, and on every block) opens one block at a time in a dialog of one
   fixed size, the cursor in the note: Up approves, Down rejects (only with
   text), Left and Right move to another block while the note is empty and
   move the cursor once it holds text, and after each verdict the next block
   still to judge comes in. Escape returns to the page. The dialog stores
   the same verdict, hash and note as the panel under the block [scope-90].
   Its four buttons sit in a footer pinned to the bottom of the side column,
   in the same place for every block; the block's review note, when it has
   one, stands above "Look at" in one scrolling frame that opens at its top
   [scope-92].
2. Kenny copies the prompt and pastes it into the conversation. Its last
   block, `Verdict lines (hash version N):`, carries one line per verdict not
   yet in the register: `block key · theme · engine · verdict · hash`, and a
   sixth field `@1.25` when the block was read at a device pixel ratio other
   than 1 [fix-34]. Gecko resolves a border width to whole device pixels, so
   a hash follows the browser's zoom (and the desktop's scale): a 3px border
   reads 2.4px at 125%. Kenny reviews at a zoom other than 100% by default
   (scope-93), so the page reads the ratio when it reads the blocks
   (`catalogue/engine.js`) and every verdict keeps it; the register writes it
   as `ratio` in the entry. A line with five fields, and an entry without a
   ratio, were read at 1. Zooming after the page has read its blocks changes
   nothing recorded; the next reading (a theme switch, a reload) takes the
   zoom on screen.
3. Claude saves the pasted text and runs
   `node gates/verdicts.mjs record < prompt.txt`. The tool refuses a block
   no page shows, a theme that does not exist, and lines taken with another hash version, and prints what it
   added and changed. Claude then runs the command it prints last,
   `node gates/verdicts.mjs compare --against-browser --commit <HEAD>`: every
   entry recorded at that commit hashed again in Playwright's browser of its
   engine, at the ratio it was read at (Firefox launched with
   `layout.css.devPixelsPerPx` and a matching deviceScaleFactor, one browser
   per ratio), with the ones whose hash the test browser does not read listed
   (about 17 s for 158 entries). A mismatch means Kenny's browser saw
   something the tools do not — his desktop font on a control the package
   left without one was the cause of 39 of 158 on 2026-09-14 [fix-28] — and
   goes into the report. Claude commits the register and pushes `round-six`.
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
   or Chromium), at 1920 px and at the entry's own pixel ratio, and writes
   the new hashes and version. The verdicts, commits, dates and ratios stay
   as they were.

The entries recorded before verdicts kept a ratio (the light-theme review of
2026-09-15, at d499b6b2) get theirs once, from readings of the blocks at
several ratios: `node gates/verdicts.mjs annotate-ratio --from <readings.json>
--commit d499b6b2` gives an entry the ratio whose reading matches its hash,
never changes a hash or a verdict, and lists the entries no ratio matches
[fix-34]. Those 110 kept their verdict and were re-anchored on 2026-09-15
with `node gates/verdicts.mjs reanchor --commit d499b6b2` [scope-94]: each
took the hash of its block at rest at d499b6b2 (a fresh page load, nothing
scrolled or opened), read at the ratio most of its theme's annotated entries
have (brutalism, forest, light, nostromo, retro and sepia 1.25; formal,
pastel and shade-light 1.333; grotesk and high-contrast 1.5), and that ratio.
The register's entries hold no provenance field, so this paragraph is the
record of which entries were re-anchored rather than judged on that hash.

Hash version 3 (2026-09-15, scope-95) stopped reading the block's reading
aids: the markup line is the block's section without its "Look at" text,
the reviewer's panel and its own headings (`componentMarkup` in
`catalogue/block-hash.js`), so correcting a Look-at sentence brings no block
back; the stages and everything in them still count. Every page that hashes
a block (catalogue page, review page, compare column, research demo, and the
tools) goes through that one function. The register was carried over with
`node gates/verdicts.mjs migrate --to 3` instead of `rehash`: each entry read
at its commit and ratio, and only where the version-2 reading of that moment
was its stored hash did it take the version-3 reading; 2796 of 3014 did.
The other 218 (117 recorded at cf2c5634, 98 at 62dcfba6 — Kenny's review at
ratio 2.222 — two at 6dd76c6c, one at ff81ed71) are entries Kenny's browser
read differently from the test browser at the time [fix-28]. On Kenny's
answer "Vastzetten zoals de 110" [scope-96] they were re-anchored like the
110 of scope-94, with `node gates/verdicts.mjs reanchor --commit <hash>` for
each of the four commits: an entry whose stored hash is not the version-3
reading at rest of its commit, at its own ratio, keeps its verdict, commit
and date and takes that reading. The ratio each was re-anchored at is the one
it already kept: 1 for the 120 at cf2c5634, 6dd76c6c and ff81ed71 (phantom
44, synthwave 35, dark 13, deco 9, cyberpunk 7, terminal 3, blueprint 2,
lapis 2, solstice 2, light, shade-dark and titanium 1 each), 2.222 for the
98 at 62dcfba6 (lapis 28, titanium 27, synthwave 8, cyberpunk 6, and one to
three in seventeen more themes). This paragraph is their record. A verdict
still held in a reviewer's browser under an earlier version is carried over
by the page as it reads the block in that theme, where its hash is that
version's reading of the block as it stands (`carryOver` in
`catalogue/judgements.js`, with the readings `readBlocks` returns in
`earlier`); where the block changed since, it shows "Changed since judged"
as before.

Hash version 4 (2026-09-15, scope-96, "Ook uit de hash") also leaves a
label out: a `.cat-note` that stands in the block but outside every
`.cat-stage` ("At rest" above `page-effects#headline`'s stage, "Live" in the
bar of a live copy) names a part of the block for the reviewer and is not
the component. A `.cat-note` inside a stage still counts, because it is part
of what is judged (combobox `#open` puts one under the box for the open list
to cover; the wizard writes its status line into one). In a block without a
stage (a research demo) every note leaves the markup line. The register was
carried over with `node gates/verdicts.mjs migrate --to 4` in the same way:
where the version-3 reading at an entry's commit and ratio was its stored
hash, it took the version-4 reading. All 3014 did (in 6 min 48 s); the hash
moved for the 264 entries of the twelve blocks with such a label (22 themes
each), and stayed for the rest.
4. The register and the recipe are committed together.

The recipe reads past what differs between two browsers of one engine or
two window sizes, as measured on 2026-09-13 (lengths to the half pixel,
`attr()` in `content` resolved, no translation in `transform`, lengths in
viewport units read as "a length", a block still loading given time to
finish); why is at the head of `catalogue/block-hash.js`. Animations are
held still for the reading by time alone: a finite one is run to its end, an
infinite one is set to time 0 and given its own time back once every block is
read, and its play state is never touched, so a marquee that was resting off
screen runs again when it comes into view [fix-31]. A window narrow
enough to switch a component to another layout (a data table's cards below
a 40rem container) is a different look and hashes differently.

### A rejection's temporary note

When Kenny rejects a block with a note and Claude proposes a change, the
answer does not go into the block's "Look at:" text, which says what every
theme must show (Kenny, 2026-09-14; under hash version 2 that text was also
part of the hash and sent all 22 themes back, which version 3 no longer does). It goes into `catalogue/review-notes.json`, per block and
theme, written with `node gates/verdicts.mjs note <block> <theme>
--rejected "<his note, verbatim>" --change "<what changed and why>"`. The
judging panel shows it in that theme only, as a "Rejected — what changed"
alert above the verdict buttons, outside the component and outside the
hash, and the block stays on the page as left to judge even when its hash
did not move. Recording an approved verdict for that block and theme, in
any engine, removes the note and prints `note cleared: <block> · <theme>`;
a rejection leaves it for Claude to rewrite. `npm run gates` refuses a
note on an unknown block or theme, or with an empty text.

## Research is a side stream

A question that needs outside references — an alternative component, a
layout family, a loading strategy — goes to the `researcher` agent
(`.claude/agents/researcher.md`), in the background, in its own worktree,
while Bouwen and Kijken continue. It delivers `research/<topic>/README.md`
and `demo.html`; the demo is looked at the Kijken way, and its outcome is
a form. What Kenny approves becomes an ordinary Bouwen step.
The demo enters the catalogue navigation under "Research to look at"
and moves to "Archived research" once his decision is taken, so the
navigation shows what still waits for him [scope-81].

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
