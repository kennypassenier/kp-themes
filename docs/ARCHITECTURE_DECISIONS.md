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
