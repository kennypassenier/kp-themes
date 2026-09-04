# Architecture decisions — kp-themes

Phase 3 (tech choice) decided 2026-09-04. Phase 4 (architecture) will add
its own entries below and freeze the whole file.

IDs `T*` are Phase 3, `AR*` will be Phase 4. They are permanent.

## T1 · The framework-free channel is CSS classes plus one script

Consumers without npm — kyu and almanac — render HTML from a Rust binary.
The package therefore ships CSS classes and one JavaScript file that
attaches behaviour to markup the server already wrote.

Rejected: custom elements. Their content appears only after the script
runs, which is what a server-rendered page exists to avoid and what
reintroduces the flash TH23 removes. Also rejected: a JavaScript function
returning HTML — the server is Rust and calls no JavaScript.

Precedent: kyu already built exactly this shape for its picker.

## T2 · The hard components are written here, not taken from a library

Dialogs, dropdowns, tooltips and tabs are the components where
accessibility is genuinely hard: focus containment, Escape, keyboard
reachability, the right announcements. Libraries exist that solve this
without bringing their own looks.

**Decided against, for a measured reason.** The Phase 2 test bar requires
the React variant and the framework-free variant to produce the same
markup structure, comparable side by side (S15's comparison mode). Such a
library generates its own structure and its own attributes, which cannot
be reproduced on the other side without imitating the library — and then
the comparison proves nothing. Second reason: JobTracker runs React 19.2
with hand-written components and no such library (measured in its
`package.json`); anything taken here would be inherited there.

The cost is accepted and stated: this is real work, and mistakes in it are
silent. Which browser capabilities carry the weight is a Phase 4 decision,
verified there rather than assumed here.

## T3 · The data model is the source; the CSS is generated

Colours are authored in a structured, machine-readable file. `themes.css`
is generated from it, and the generation runs inside the gates so a
forgotten step cannot leave a stale stylesheet behind.

Chosen over keeping `themes.css` as the source with a script reading
values out of it. That path makes every other channel — the TUI, the GUI,
the parity check of TH22 — depend on someone maintaining a CSS parser;
the current contrast gate already reads tokens with a regular expression,
which works and is brittle.

Consequence to hold on to: `themes.css` is the file two consumers copy
verbatim. Once generated, nobody edits it by hand, and the gate is what
guarantees the copy matches its source.

## T4 · Node's own runner for computation, a real browser for the page

Measured on 2026-09-04: Node 26.8.1 runs tests with no dependency at all
(verified by running one), and has no DOM — `document` is undefined.

So the tests split. Arithmetic checks — contrast, parity, flash
threshold, layer ordering — run in Node. Anything touching the page — the
five picker tests of TH27, and the text-spacing and reflow checks of
DI11 — runs in a real browser.

No DOM shim. A real browser is needed for DI11 regardless, so a shim adds
a dependency and a test that does not measure what it appears to. Standing
rule 9 applies directly: a test double silently deletes whole classes of
behaviour.

## T5 · The showcase is generated, and published once it exists

A script reads which components exist and writes the page, rather than
hundreds of hand-maintained blocks going stale — the same reasoning as
the single source of truth for the theme list.

Publication: GitHub Pages. Kenny's condition was that it must need no
extra tokens or services. Measured 2026-09-04: the repository is public,
no Pages site exists yet, and enabling it is one repository setting
reachable with existing access. Claude enables it once the showcase
exists, so that exactly one directory is published and the project
documents are not.

## T6 · Strict about dependencies

Zero runtime dependencies. Development tooling only where Claude cannot
reasonably write it: prettier stays, a test browser may be added, a
library that only saves time may not.

Reason: this package has one dev dependency today and none at runtime.
Anything added at runtime is inherited by every consumer.

## T7 · MIT

The repository is public; without a licence nobody may formally use it.
MIT costs nothing, removes an ambiguity, and is easier now than once
copies exist.

## T8 · Targets — Kenny's own answer, not a pick-list

Chrome and Firefox, modern versions only. Linux and Windows.
Smartphones, laptops, ordinary screens and 4K screens. **No support for
older systems.**

Two consequences worth carrying forward. Modern-only permits leaning on
recent browser capabilities, which is what makes T2 affordable — the
specific ones get named and verified in Phase 4, not assumed here. And 4K
matters for the texture layer: a repeating pattern tuned on one pixel
density lands somewhere else on another, which is exactly the band the
pattern-glare invariant guards.

## T9 · The environments, and what differs

Amended by the mini-round of 2026-09-04: JobTracker's build step is no
longer an environment this package proves itself against.

| Environment | What it has that the others do not |
| --- | --- |
| Kenny's PC | the sibling projects on disk, git credentials, a real browser with his settings |
| The CI runner | the repository and nothing else — no sibling projects, so no check may depend on a path to one |
| kyu and almanac | a vendored copy inside a Rust binary; no npm, no build step |

Every gate must run on the CI runner. The browser tests run in the same
browser CI uses, so "green here" and "green there" mean the same thing.
Provenance: standing rule 35, added after JobTracker went red in CI three
times on things that were green on the PC.

---

# Phase 4 · Architecture

Decided 2026-09-04 and **frozen**. Changes go through a mini-round only.

A draft of ten decisions was attacked by the `architecture-critic` agent
in a fresh context, which returned seven blocking objections, seven
serious and five minor. The load-bearing ones were then verified by hand
before being put to Kenny; three held and one was worse than the critic
said. What follows is what survived, plus what Kenny decided against the
recommendation.

## AR0 · What this project is, and is not

kp-themes supplies style advice, components and CSS. Nothing more. A
project that adopts something from it does so **voluntarily** and carries
the responsibility for that implementation from then on — kyu may decide
to take cyberpunk v1, and how that goes there is kyu's business. This
project imposes nothing, polices nobody else's code, and its own choices
may never be the reason another project cannot proceed. Where a change
here causes friction elsewhere, that is discussed in *that* project's
conversation.

Kenny, 2026-09-04. It is placed first because it decides how every other
item is weighed: two of the critic's objections rested entirely on
guarding other people's copies, and they fall away here.

## AR1 · Gates run against the artefact, not only the source

T3 makes the data model the source and generates the CSS. The draft then
said gates read the source. They read both: derivation gates over the
token data, and one artefact gate that parses the emitted stylesheet back
into tokens and asserts it round-trips.

Without it a generator bug — a dropped token, a changed notation — passes
every gate, because every gate ran against data that was correct. Standing
rule 9 applies literally: gating the source instead of the artefact is a
test double that deletes the generator's behaviour.

## AR2 · The stylesheet is generated blocks plus authored rules

Most of `themes.css` is not tokens: the body rule, the texture layer, the
per-theme heading rules, `::selection`, the scrollbar, the glow classes,
a 1.4 kB embedded contour drawing. TH31 to TH36 add hundreds of lines
more, including a print stylesheet. None of that is expressible as a
colour token.

So the file is assembled: generated token blocks plus hand-written rule
partials, concatenated in a declared order. The output path is a
**contract value** — it is what the whole ecosystem points at.

## AR3 · Generated output is committed, and generation is deterministic

The generated stylesheet lives in git. Generation produces identical bytes
from identical input: no timestamps, no host names, no commit hashes,
stable key ordering. A gate regenerates and asserts the tree is clean.

Determinism, not atomicity, is the property that matters. The recovery
from any half-finished run is "run it again", and that only works if
running it again produces the same thing. The draft's promise of an
all-or-nothing move was also wrong on its own terms: moving a set of files
is several renames, and nothing makes that one operation.

## AR4 · Colours are derived in a perceptual space, emitted as `hsl()`

DI3 adopts a derivation ("hover is half a step, selected one, active
two"). A step of equal size must look equally large in every theme, and in
the current notation it does not: the same numeric step on terminal's
saturated green and on formal's dark navy produces very different
perceived and measured results.

So the derivation runs in a perceptual space and the result is written out
in the existing notation, which keeps the current parser and the vendored
copies working. DI4's colour-vision distance needs the same machinery.

## AR5 · The picker's state lives in the DOM; both channels share one bus

Today the React hook keeps its own subscriber list in module state, which
a plain `<script>` cannot reach. On the comparison page the two pickers
would set the theme correctly and each fail to update the other's
selection mark — on the very surface built to compare them.

So the active theme is read from the document, and a change is announced
on one shared event both channels listen to. Cross-tab following rides on
the same bus, and the ordering question the draft agonised over dissolves.

## AR6 · A failed save is shown, not swallowed

Storage can fail — private mode, blocked storage, quota. Today that
failure disappears into an empty `catch`. In a server-rendered dashboard
every click is a new page load, so a lost preference is visible within
seconds and indistinguishable from a broken picker.

The hook already carries a "save failed" flag and the switcher already has
a place to render it; it is simply never surfaced. It will be.

Related, from the critic and adopted without a separate decision:
validation belongs at `applyTheme`'s own boundary, since that is the
exported entry point and the only one that does not validate, which
collapses three duplicated checks into one.

## AR7 · The component contract is behavioural, not structural

The draft proposed a machine-readable markup spec both channels assert
against. The critic showed it would prove little: the framework-free
channel emits no markup at all — it attaches behaviour to markup a
consumer's server wrote — so there is no second output to compare.

What it would catch is still worth having (a renamed attribute, a dropped
role, a register class no component emits). What it misses is where the
failures live, and one exists today: on Escape the framework-free script
returns focus to the trigger and the React component does not. A
structural spec scores those as identical.

So the contract is one behaviour suite per component, run twice in the
same browser — once against the React mount, once against the
script-attached mount — driving the same keys and asserting the same
observable state.

## AR8 · Every gate declares how many things it expected to check

A gate answers "did I check everything", not only "did what I ran pass".

Measured on 2026-09-04, in this repository's own shipped gate: theme
discovery matches names of lowercase letters only, so a theme called
`high-contrast` or `topo2` is silently skipped while the run reports that
all themes pass. The floor test only fires below five themes, so with
seven present an eighth is never noticed. This is the Huurbeheer pattern
that FEATURES.md quotes as its cautionary example, present in our own
code. Recorded as a defect to fix with its test in the first build step.

## AR9 · Generation-time knobs are configuration

Three numbers are Kenny's house values and will be tuned: the derivation
steps of DI3, the perceptual-distance floor of DI4 (which is a chosen
house number, not a standard — WCAG has no such threshold), and the
texture opacity ceiling of DI9. They are configuration, not literals in
the generator.

Standards constants stay pinned with a comment saying why: 4.5, 3.0, three
flashes per second, the 10% luminance change, 341×256 px.

## AR10 · The version goes inside the existing marker comment

No banner above it, no timestamp, no hash. The first line of the generated
stylesheet has been that file's recognition point for as long as it has
existed; moving it buys nothing. Cheap courtesy rather than an obligation
— AR0 means no other project's tooling is our responsibility.

## AR11 · The swatch reads the live theme colours

`hooks/use-theme.js` carries the background, foreground and primary colour
of each theme as text, duplicating the same values in `css/themes.css`.
Measured 2026-09-04: **21 values duplicated, none currently diverging.**
The switcher builds its preview swatch from that copy.

Nothing on the frozen work list changes those three tokens, so this is
latent rather than imminent — that was checked, after the first version of
this argument overstated it. But the most natural change in a theme
project is adjusting a palette, and that is exactly the change that makes
the swatch show a colour the theme no longer has, with no error and no
failing gate.

So the swatch becomes an element carrying the theme, reading
`var(--background)` and `var(--primary)`. Four lines per channel, and the
three duplicated colours leave the JavaScript record. The label and the
dark flag stay there: moving them was justified by other projects finding
them in the stylesheet, and AR0 removes that reason.

## AR12 · Prove the property, check the worst case

Gating every generated state value naively is roughly 280 assertions, plus
112 for the focus ring and 147 for colour vision — about six hundred
producing one line on green. Nobody reads that, and nobody notices when it
becomes four hundred.

Instead: the derivation is monotone in luminance away from the foreground,
that property is proved once per theme, and only the worst case per
surface is checked — 56 instead of 280, with the same guarantee. A theme
that uses DI3's opt-out (cyberpunk and terminal will, expressing hover as
a glow rather than a lightness step) forfeits the property and is checked
in full.

## AR13 · Nothing here may block another project

Sister projects run their own commit gates comparing their vendored copy
to this repository's file. Under AR0 those gates are their business: this
project makes no accommodation for them, does not modify their
repositories, and does not schedule around their tooling. Where a change
here makes noise there, it is raised in that project's conversation.

## AR14 · One showcase page; three features tested on bare fixtures

Kenny chose the simple showcase: seven theme blocks on one page, because
looking and comparing is what that page is for.

Three things cannot be verified there, because they exist once per
document: the light-or-dark declaration of DI6 (one scrollbar, one autofill
treatment per page), the narrow-viewport reflow of DI11, and the print
stylesheet of TH36. The generator therefore also writes a bare fixture page
per theme, which only the tests open. Without it those three would sit in
the documents as "tested" while nothing tested them.

## AR15 · The browser baseline, measured

Phase 3 deferred this deliberately (T2, T8). Verified on 2026-09-04 in a
current Chrome, and cross-checked for Firefox: the native dialog element,
the popover mechanism, anchor positioning, `inert`, `:has()`, `color-mix`,
OKLCh, container queries, `accent-color` and `color-scheme` are all
available. Anchor positioning — the hardest of them, and the one that
decides whether dropdowns and tooltips need a hand-written positioning
engine in two channels — reached every engine with Firefox 147 and is
Baseline 2026.

This is what makes T2's decision to hand-write the components affordable.
The date is recorded because the claim is time-dependent.

## AR16 · Storage, security, and the unit of a transaction

**Storage.** `localStorage`, one key, pinned as a contract value with its
reason (TH26). An optional prefix (M4). No cookies, no IndexedDB, no
server state. If a theme is ever renamed, stored values for the old name
fall back to the default silently — a migration clause is owed at that
moment, not before.

**Security.** The framework-free script reads attributes from markup a
consumer's server wrote. It never evaluates them, never assigns them to
`innerHTML`, and never builds a selector from them unescaped. The showcase
generator escapes everything it interpolates. AR11 removes the one place
where a colour value was interpolated into a style attribute, which is a
context HTML escaping does not protect.

**The unit of a transaction.** Two kinds of state change. A visitor
changing theme: announce on the shared bus, apply, persist — and if
persisting fails, say so (AR6) rather than leaving the page and the memory
disagreeing in silence. A generation run: the unit is the whole run, and
the recovery is running it again (AR3), not a promise of atomicity the
filesystem does not offer for a set of files.
