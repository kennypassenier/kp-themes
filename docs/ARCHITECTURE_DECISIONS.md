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

> **Amended 2026-09-09 — there is no CI runner.** Kenny deleted
> `.github/workflows/ci.yml` and `main` requires no status check: 254 runs
> in five days for a verdict he gives himself. The rule that survives is
> the half that was ever about correctness — a gate may not depend on a
> path to a sibling project, because kyu and almanac have none either. The
> half about two environments agreeing is moot: there is one environment,
> Kenny's PC, and "green here" is the only green there is. The entries
> below that reason from a clean CI checkout are the record of a decision
> taken when there was one; they are not rewritten. Where a decision's
> mechanism depended on CI, the mechanism is now a command in
> `package.json` — `npm run gates`, `test:affected`, `test:browser`,
> `advice`, `verify`.

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

**Amended 2026-09-06 (round four, AR25).** The comment stays; a machine
readable version is added beside it. The generated stylesheet now also
declares `--kp-themes-version` on `:root`, because the mismatch this
project actually needs to detect — a vendored stylesheet from one version
beside JavaScript from another — lives on a consumer's page, and a comment
is the one place JavaScript cannot look. The reasoning above was right
about banners and wrong about the reader: it assumed the reader was a
person.

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

---

# Round four (2026-09-06)

Phase 3 added T10–T13; Phase 4 added AR17–AR26 after an
`architecture-critic` pass that found eight blocking objections, four of
them demonstrated in a browser rather than argued. Where the critic was
simply right and nothing was open to choose, the decision below already
carries the repair; where reasonable people could differ, Kenny decided
and the counter-argument is recorded with the decision.

## T10 · The theme stories are rendered by a renderer we own

Measured across the 24 `themes/*/anatomy.md` documents: 323 bold spans,
189 inline code spans, 128 headings, 97 ordered items, 76 bullets, 54
quotes, 26 links — and zero tables, zero fenced code blocks. Seven
constructs, none of them the hard ones.

So: an own renderer for exactly those constructs, and it **refuses**
anything else with the file and line rather than passing it through as
literal characters. A renderer that silently emits unknown syntax is the
same silent fallback AR25 exists to remove. T6 is untouched: no
dependency.

**Amended 2026-09-07 (MR-R6-1): eight constructs, not seven.** The count
above was wrong in three of its eight figures. Re-measured over the same
24 documents by the renderer's own census, and by an independent regex
census that agrees with it: **327** bold spans (not 323), **193** inline
code spans (not 189), and **9 underscore-emphasis spans** the count had
missed entirely — `dark:32`, `dark:62`, `cyberpunk:22`, `cyberpunk:44`,
`pastel:10`, `pastel:48`, `forest:12`, `woodblock:9`, `retro:14`. Headings,
links, ordered items, bullets and quotes were correct.

Kenny chose to correct the measurement rather than rewrite the nine
spans as bold, because two of them are exactly what emphasis is for and
bold is not: `_bero-ai_` is a foreign pigment name, and `_is_` in retro
carries contrastive stress. Emphasis renders as `<em>`; there is no flag
and no opt-in, because there is nothing left to choose. Asterisk
emphasis stays refused — one spelling, not two — and the boundary this
decision is actually about is unchanged: no tables, no fenced code, no
raw HTML, and refuse rather than pass through.

## T11 · The documentation site extends the generators that exist

Seven generators already work this way — the showcase, the 24 fixtures,
the theme stylesheet, the registry, the Home Assistant themes, the type
declarations — all plain Node and template strings, all covered by the
"generated file differs from its source" gate. A static site generator
would give navigation for free and cost a large dev dependency with its
own template language, in a project with zero dependencies. The plumbing
is written here instead.

## T12 · Code snippets are coloured by a small tokenizer reading tokens

A third-party highlighter brings its own palette, and this project has a
test (KT8) that fails a page painting a colour that is not the theme's —
so any library would need remapping onto tokens anyway, and the library
would then be the smaller half of the work. Instead: a small tokenizer
for the level a snippet needs, colouring from `--chart-1`, `--chart-2`
and `--muted-foreground`, so code is green in terminal and gold in lapis
like everything else on the page.

## T13 · The targets stand; GitHub Pages becomes a named environment

T8 and T9 are unchanged. Round four adds a fourth environment to T9's
table: **GitHub Pages**, which has its own fonts and its own scrollbars.
Not theoretical — round three found the CI runner had fonts and
scrollbars the PC did not, and two tests went red there that were green
locally.

## AR17 · The cascade is layered, and a gate proves a utility wins

The draft said utilities load last and therefore win. That is true only at
equal specificity, and the specificity is not equal: the critic measured,
in this project's own browser, that `<td class="kp-text-end">` stays on
`start`, `.kp-p-0` keeps its 8px by 10px padding and `.kp-gap-lg` stays at
8px, because `.kp-table td` and `.kp-breadcrumb ol` outrank a single-class
utility whatever the file order. The critic counted 44 such rules in
`css/components.css`; a narrower re-count here confirmed twelve of one
shape. Right-aligning a numeric column — the most common use the utility
API will ever have — did nothing at all.

**Decision:** cascade layers. `@layer kp.components, kp.layout,
kp.utilities;` puts the order beyond specificity, which is exactly what
the mechanism exists for, and AR15's baseline covers it. There is no
`@layer` anywhere in `css/` today, so this is a greenfield choice rather
than a migration.

**The consequence, taken deliberately:** a consumer's own unlayered CSS
then wins over everything this package puts in a layer, components
included. For a package whose whole posture is that a consumer overrides
it, that is the right default — but it is a decision, not a side effect,
and it belongs in the user guide.

**And it gets a gate**, because a rule added later at (0,1,1) would break
a utility silently: for every generated utility, a browser test asserts it
wins on at least one representative element per component family.

## AR18 · One scale, pinned where it already stands

The scale is declared once per theme in the token source, and the layout
classes, the generated utilities and the Tailwind bridge all read it. The
bridge's `@theme` block is **generated** from that source rather than
hand-kept — the critic showed the draft's claim that "adding a step means
editing one file" was false while the bridge stayed authored and ungated.

`--kp-space-xs`, `-sm` and `-md` are **pinned to the values they have as
fallbacks today** — 0.25, 0.5 and 0.75 rem — and the new steps are added
around them. Round four is otherwise additive, and declaring the tokens
with different values would silently move spacing in sixteen places in
`css/components.css` in a minor release, against S20. Whoever wants a
differently designed scale gets it in 4.0.0, where the other break
already waits. Once the tokens exist, the sixteen uses lose their
fallbacks, so a consumer copying `components.css` without the matching
`themes.css` fails loudly rather than rendering a third set of values.

## AR19 · A descriptor per unit, and the example is the snippet

One descriptor per documented unit: id, **kind** (component, module or
React-only wrapper — the critic found the draft could not express a unit
with no framework-free markup), title, intro, when-to-use, examples, and
the machine-sourced sections of AR21.

The mechanism at its heart survives untouched: the page renders the
example's markup and prints that same string beneath it. One artefact,
so the live example and the snippet cannot drift.

## AR20 · The channel comparison is narrowed, and honestly named

The draft compared server-rendered React against the framework-free
markup and called it proof that both channels agree. It is not: the
framework-free markup is a string the same person writes in the same
sitting as the React example, so the comparison proves that person was
consistent. The critic also demonstrated four categories of legitimate
difference at once — attribute order, empty attributes, style
serialisation, letter case — which would put an exception on every page
on day one.

**Decision:** compare **class names and role/ARIA attributes per element
in document order, and nothing else.** That is exactly what AR7 promises,
it is immune to all four noise categories, and it already finds a real
defect shipped in 3.1.0: the framework-free alert writes its body in a
bare `<span>` while React writes `<span class="kp-alert__body">`, and that
class carries `flex: 1`.

It is documentation hygiene, not parity proof. AR7's behaviour suite
remains the only thing that proves the two channels agree, and this
decision says so out loud so nobody later reads AR20 and concludes the
suite is redundant. Exceptions live in the gate as a central dictionary
with a reason each — never in the descriptors — and the gate reports how
many pairs it compared and how many it excused. The React examples live
in real files inside `jsconfig.json`'s include, so `npm run check:types`
type-checks them; the critic demonstrated that a wrong prop name in a
documented example (`variant` where the prop is `flavour`) otherwise
becomes a bogus DOM attribute with no error anywhere.

## AR21 · Every documented fact comes from a source that can be checked

Four machine sources, one human section:

- **Props** from the generated `.d.ts`, not from the `@typedef` — tsc has
  already resolved the intersection with `HTMLAttributes`, the ref and the
  optionality, and `gates/check-types.mjs` already fails when those files
  drift. Reading the JSDoc means writing a second parser that will
  disagree with tsc.
- **Attributes** from the framework-free modules. The critic found 83
  distinct `data-kp-*` attributes — the framework-free channel's props —
  which the draft documented nowhere. That is the channel kyu, Almanac and
  the chassis kit actually use.
- **Events** from the exported constants (`TAB_CHANGE_EVENT`,
  `COMMIT_EVENT`, …), which are already machine-readable.
- **Knobs** from the 51 `--kp-*` custom properties the stylesheet reads.

The human section is what a person must write: what it is, and when to use
it. A descriptor may not restate a machine-sourced fact; the gate refuses
it.

**One new check falls out of this.** Defaults live in prose ("Default
true.") and in the destructuring (`wrap = true`) and can disagree today
with nothing to notice. The truth gate compares them.

## AR22 · The site is committed, deterministic, and assembled once

The draft proposed an atomic write and thereby argued against AR3 without
saying so. AR3 stands: determinism is the property that matters, and the
recovery from a half-finished run is running it again — which is also the
only environment where a half-finished run can happen, since CI always
starts from a clean checkout.

So: the generated site is **committed**, like the showcase and the 24
fixtures, and the existing "generated file differs from its source" gate
covers all sixty pages. `.github/workflows/pages.yml` stops assembling a
site from its own list of directories and uploads only what the generator
wrote — the critic pointed out that two lists of what the site consists of
means the CI one ships.

## AR23 · The layout and utility names are contract from 3.2.0

`.kp-page`, `.kp-stack`, `.kp-row`, `.kp-autogrid`, `.kp-sidebar`,
`.kp-section`, `.kp-center`, the text utilities and every generated
`kp-` utility carry the same semver promise as the component classes.
They are proven on the ten example pages before the release, which is the
evidence the critic asked for, gathered earlier in the round rather than
after it.

**`.kp-grid` stays the movable dashboard grid** (`css/components.css:2198`,
TH56, shipped since 1.2.0). The display utility is `.kp-d-grid`. A
**collision gate** compares every generated name against the 170 `.kp-`
names already in the component stylesheet and reports the count, so this
cannot happen again quietly.

The site's own chrome keeps the `sc-` prefix. And — the critic's sharpest
catch here — the site's stylesheet is **scaffolding** in the
`gates/check-layers.mjs` sense: it is inlined beside live examples on 45
pages, which is KT3's fault at six times the scale. The SCAFFOLDING list
is derived rather than hand-kept.

## AR24 · Container queries, and the one thing they cannot do

A container query styles a container's **contents**, never the container
itself — demonstrated: a grid with a container query on itself keeps its
three columns at 300px while its child gets the narrow form. The rules
that matter for the movable grid (`css/components.css:2227`) and the nav
bar sit on that element, so converting them needs a wrapper element in
markup that kyu, Almanac and the chassis kit hand-write in Rust
templates.

**Decision (Kenny, against Claude's recommendation): convert everything,
and TH104 moves to 4.0.0** with a migration note for the three Rust
projects. The alternative — two mechanisms side by side — is what TH104's
own text forbids, and Kenny chose the honest version over the convenient
one. `docs/FEATURES.md` carries the dated amendment.

`container-type: inline-size` applies inline-axis containment, so it
changes how an element sizes to its contents. Each element that gets it is
measured before and after, `.kp-table-wrap` first, since TH95 is repairing
that same wrapper in this round.

## AR25 · The fallback is loud in four places, once per session, and the version is readable

The draft put the warning in `applyTheme`. That function never sees an
unknown name: `asTheme` returns null inside `storedTheme` and
`currentTheme`, which then apply `?? DEFAULT_THEME` — so the name is gone
before anything could warn. Shipped as drafted, TH97 would have passed its
own drill while Almanac still failed silently.

**All four sites warn**: `storedTheme`, `currentTheme`, `applyTheme` and
the cross-tab handler.

**Once per session, and the stored value is left alone.** In a
server-rendered dashboard every click is a page load; warning on each one
makes any consumer listening to the event unusable, and persisting the
fallback destroys a preference that would work again after the next
deployment.

**The version becomes readable** (AR10, amended above): the generated
stylesheet declares `--kp-themes-version` on `:root`, the registry carries
the same constant, and the two are compared in the browser. The gate
comparing the registry to `package.json` can never fail inside this
repository — both come from the same commit — and the mismatch that
matters only exists on a consumer's page.

## AR26 · Every new gate says what it expected to check

AR8 applied to round four's seven new gates: the overflow-and-rhythm gate,
the four documentation gates, the utility-parity gate, the theme-story
gate, the manifest gate, the migration-note gate and the inline-style
gate. Each reports the number it expected, and that number comes from the
**sources** — the class families in `css/components.css`, the exports in
`components/*.jsx`, the entries in `themes/order.json` — never from
globbing the directory the generator just wrote, which would always find
exactly what was written and always pass.

Round four's new thresholds are configuration, not literals: the viewport
widths (320, 768, 1280), the minimum gap the rhythm check accepts, and the
utility scale's step count go into `gates/config.json` with their reason.
The query thresholds that CSS cannot read from a custom property stay
pinned constants in one declared list, counted by a gate, the way
`css/components.css:1585` already handles the one that exists today.

## Round five — 4.0.0 (2026-09-07)

Phase 3 approved by Kenny on 2026-09-07. Phase 4 follows, after an
`architecture-critic` pass over the draft.

## T14 · The confirmation dialog is a native `<dialog>`

TH107 asks for a dialog carrying the attribute's phrase, where Escape
and Cancel do nothing, Confirm acts once, and focus returns to the
button. The browser does the three hard parts — the focus trap, the
Escape close, and returning focus — and this package already relies on
that twice: `js/overlays.js` for ordinary dialogs and `js/palette.js`
for the command palette, both through `showModal()`.

The alternatives were put with their cost. A `role="dialog"` layer means
hand-writing a focus trap in a package that has one three times over. A
non-modal popover does not block the page, so a second click can land
while the question is open — which is the thing a confirmation exists to
prevent. `<dialog>` sits inside AR15's browser baseline.

## T15 · The button's size scale is modifier classes

`.kp-button--sm` and `.kp-button--lg` beside the four variants the button
already carries, rather than a `data-kp-size` attribute.

The attribute is the cleaner separation on paper — size and colour
variant are independent axes, and the badge's status plate became
`data-status` on 2026-09-07 for exactly that reason. Kenny chose classes
anyway, and the reasoning is recorded because it is not the abstract
argument: the button already carries four modifier classes, and a fifth
axis through a second mechanism would make the button the one component
mixing both styles. Consistency on this component beats purity across
the package.

## T16 · Everything else uses machinery that exists

No new gate scripts, no new generators, no new dev dependency. TH104
uses the container queries 3.2.0 introduced for the tables; TH110 is one
selector in the existing register; TH112 is documentation; TH113 is two
CSS properties; TH114 is a test plus a sentence in the guide; D4 removes
an export. The existing 22-check chain covers this work.

Recorded as a decision rather than left implicit, so nobody adds tooling
later on the grounds that the round never said not to.

## AR27 · The confirmation is a dialog that re-fires the click behind a lock

Approved by Kenny on 2026-09-07. TH107 replaces arm-then-act outright:
the first click on a `[data-kp-confirm]` button is swallowed, a modal
`<dialog>` opens carrying the attribute's phrase, and Confirm acts.

**What happens after Confirm is the part that had to be measured.** The
draft said "re-fire the click", and the `architecture-critic` built it
and drove it with real clicks: `["open", "confirm", "open"] — posts: 0`.
The re-fired click is caught by the same delegated listener that opened
the dialog, so it opens it again and the action never runs. Re-firing
synchronously is worse than a loop: the browser's in-flight-click flag
turns it into a silent no-op, with no error and no clue.

So the re-fire carries a one-shot lock: the handler sets a flag naming
that element, the delegated listener sees the flag, clears it, and lets
the click through untouched. Measured with the lock: two cycles clean,
two posts.

The lock clears on the same tick it is consumed, not on a timer. If a
consumer's handler navigates or replaces the DOM, nothing is left armed
— the flag dies with the element. This is written down because a lock
that outlives its click would leave that button unguarded for the rest
of the page, and that failure is invisible until someone deletes the
wrong row.

Re-firing rather than dispatching a new `kp-confirm-accepted` event is
the choice that costs consumers nothing: chassis-rs, kyu and Almanac all
listen for ordinary clicks, and a custom event would make every one of
them change code to keep working. `ARM_EVENT` and `DISARM_EVENT`
(`js/components.js:33-35`) are retired; D4 removes them.

**Renumbered 2026-09-07, at the AFK report.** This text said D3, which is
the ID round five froze for a different removal — `STRINGS_NL` leaving
`js/strings.js` and `index.js`, decided by Kenny on 2026-09-05. Two
removals had one number, and the consequence was worse than untidy: W1
was briefed with the wrong meaning and built this one while the frozen
D3 went unbuilt. The events are D4 from here; D3 keeps the meaning the
feature list gave it.

## AR28 · The dialog is built in `js/components.js`, and it restores the menu it displaced

Approved by Kenny on 2026-09-07. Two decisions that both come from
measurement rather than taste.

**Where the code lives.** The obvious move is to import the dialog
machinery from `js/overlays.js`. It is refused. chassis-rs bakes exactly
six of this package's JavaScript files into its Rust binary, and the
import closure of those six is exactly those six — `js/overlays.js` is
not among them. One import edge and `/static/kp/overlays.js` is a 404,
the module graph fails, and `chassis.js` dies whole: the theme picker,
the contract enforcer, the confirmations and the skip links with it.
Their own gate cannot see it, because it checks the eight files they
copied rather than the closure those files need. That is R4-LOCALE one
round later with an empty dashboard instead of hand-written CSS. The
dialog is fifteen lines — create, `showModal()`, listen on two buttons —
and it is written where the confirmation already lives.

**The menu it displaces.** A row action lives in a menu, and this
package renders that menu as a `popover` — `components/overlays.jsx`
puts a destructive item in one. `showModal()` light-dismisses every open
`popover="auto"`: measured `menu open before: true — after: false`, the
button still connected but `checkVisibility()` false, and on close the
focus lands on `<body>`. TH107 requires focus to return to the button,
so the button has to exist. On close, the dialog re-shows the popover it
displaced before restoring focus.

## AR29 · The framework-free module skips what React already owns

Approved by Kenny on 2026-09-07. This is not a risk being avoided; it is
a defect shipped today.

`components/button.jsx:124` writes `data-kp-confirm` on its element, and
`attachConfirmations` (`js/components.js:156`) selects exactly that
attribute across the whole document — including from `js/auto.js`, which
kyu, Almanac and chassis all load. Measured on the existing fixture in
both browsers, after attaching the module over the React part: click 1 →
"Zeker?", click 2 → "Zeker?", and the action never fires at any number
of clicks. The two channels re-arm each other's button forever.

`tests/components.spec.mjs:60-68` asserts the opposite and is green,
only because that fixture happens not to attach the module over the
React part. AR8's point exactly: a gate that passes because it was
pointed away from the thing.

The React button marks its element as owned; the module skips a marked
element. Both channels keep their own props and their own behaviour, and
neither disappears from the markup a consumer can inspect.

## AR30 · The register hooks on `.kp-button` without `clip-path`, and the ring is repaired

Approved by Kenny on 2026-09-07. Two things, and the second is older
than this round.

**The ring, as it actually is.** The focus indicator is deliberately two
parts (`css/_rules.css:371`): an `outline` in `--focus-ring-contrast`
and a `box-shadow` in `--focus-ring`, so that whatever the element sits
on, one of the two contrasts. It lives in `@layer kp.base`.
`.kp-button` sets its own `box-shadow` in `@layer kp.components`
(`css/components.css:274`) for the brutalist offset shadow, and a later
layer wins: on every button in every theme, the inner half of the ring
is replaced by `0px 0px 0px 0px`, which paints nothing. The outline
survives, so this is half a ring rather than none — but half is exactly
what DI2's two-part design exists to prevent.

**What TH110 would have added.** The register's `clip-path`
(`css/cyberpunk-register.css:80`) clips the outline too. Measured in
painted pixels, both browsers: `green 784 → 0, red 912 → 0`. Hooking
the register on `.kp-button` as drafted would have removed the last
visible focus indicator from every button under cyberpunk.

So the register gives `.kp-button` its radius, its gradient and its
border treatment, and not the bevelled corner; and `.kp-button` composes
the focus shadow with its own rather than replacing it, in every theme.
The bevel stays available on the elements that already carry it.

### AR30 amended 2026-09-07 — the bevel comes back, drawn from the inside

Kenny asked where the bevel had gone, having approved AR30 without ever
having been shown the shape it decided about. Mini-round MR-NOTCH.

The original reasoning was right about the mechanism and wrong about the
conclusion. `clip-path` does clip the focus outline away with the corner
— 784 painted pixels to 0. What it cannot clip is a ring drawn **inside**
the box, and nothing had tried that. Under the bevel the indicator is two
inset rings instead of an outline plus a shadow.

That changes what the halves contrast against: an inset ring reads
against the button's own fill rather than half against the page, which is
the promise DI2's two-part design makes. Measured over **24 themes × 4
button fills = 96 pairs** before it shipped: every pair has at least one
half at 3.0 or better against the fill, always `--focus-ring-contrast`,
between 5.00 and 18.30.

**Three things the mini-round turned up that were not the question.**

1. **The old bevel rule reached nothing.** It selected
   `[data-slot='button']`, which nothing in this package writes on a
   button, while a comment beside it claimed the bevel stayed "on the
   elements that already carried it". There were none. `data-slot='card'`
   is real — `components/card.jsx` writes it — which is why the mistake
   was easy to make and impossible to see.
2. **The retro register erased the same ring half, one layer up.**
   `kp.register` comes after `kp.components`, so its four-layer inset
   bevel replaced `.kp-button:focus-visible`'s shadow outright. Measured:
   under retro the focused and unfocused `box-shadow` were **identical**.
   It now composes the ring in front of the bevel.
3. **Neither ring fixture loaded `css/retro-register.css`.** The test set
   `data-theme="retro"` on a page that never had the retro register, so
   it measured a theme without the thing that breaks it — standing rule
   7e, in the round that already broke that rule twice. Both fixtures
   load both registers now, and the retro failure appeared the moment
   they did.

**And the measurement itself was weaker than it looked.** `bothHalves`
scored a ring by colour and spread, so a theme whose own decoration is
ring-coloured passed while focus changed nothing at all — retro's case
exactly. It now also compares the focused element against an unfocused
clone. The painted-pixel count had the same shape of fault in the other
direction: counting inside the box, 171 of cyberpunk's gradient pixels
are already ring-coloured, so `> 0` passed with the rule deleted. It
measures the **difference** focus makes now: 1591 against 171, and 0
without the rule.

## AR31 · TH104 fixes the grid before it converts it, and warns nobody at runtime

Approved by Kenny on 2026-09-07.

**The rule TH104 would convert is already dead.** `js/gridlayout.js:91-92`
writes `gridColumn` and `gridRow` as inline styles, which beat any rule
in any layer. Measured at 320px: before attach `tile "1 / -1", width
304`; after attach `"1 / span 3", width 268`. The collapse-to-one-column
media query therefore stops working the moment the grid is attached, and
attaching is the only way the grid is used. Converting it would produce
a container query just as dead, plus a wrapper element three Rust
projects must hand-write, for no change in behaviour. The module's own
header already says the position belongs in data attributes rather than
inline styles.

So the module writes the position as custom properties the stylesheet
derives the track from, and the narrow rule can win again. Then TH104
converts it.

**No runtime warning for a missing wrapper.** The draft borrowed AR25's
once-per-session warning. It has nowhere to live and reaches nobody:
`kp-nav` appears in zero JavaScript files — the navbar is CSS plus
server-rendered markup, there is no attach function — and `chassis.js`
calls four attach functions, of which `attachGrids` and `attachAll` are
neither. The check would also be depth-blind: a container query binds to
the nearest container at any depth, so a consumer who put
`container-type` on `.kp-page` gets a correct layout *and* a warning, on
every page load, forever.

Instead: a migration note per consumer saying what markup to add, and a
gate that fails if one of this package's own example or showcase pages
is missing a wrapper it needs. The evidence sits where it can be
measured.

## AR32 · The overflow floor is one shared declaration, not four

Approved by Kenny on 2026-09-07, unchanged by the critic pass — the only
draft decision that survived it.

TH113's four components get `max-inline-size: 100%` plus
`overflow-wrap: anywhere` on the element that carries the text, written
once as a rule the four selectors share rather than copied four times.
`.kp-copyable` joins that rule rather than keeping the copy it grew in
3.2.0.

## AR33 · TH114 documents the boundary that exists, not the one that was assumed

Approved by Kenny on 2026-09-07.

The draft would have written into the guide that a popover belongs
outside a scroll area because nothing escapes one. The critic measured
the opposite: a popover lives in the top layer, where no ancestor's
overflow applies. In `.kp-table-wrap`, both browsers: `box 30–92,
popover 100–174, escapes: true`, and clickable outside the box. What is
clipped is an absolutely positioned child.

The boundary is therefore `position: absolute`, not "a popover", and
writing the draft's sentence would have steered consumers away from the
one construction that works — in a package that ships `popover` itself
and established it as available in AR15.

The guide gets the true statement per scroll area, and six assertions
pin both halves: an absolutely positioned child is clipped, a popover is
not.

## Round five is frozen

T14-T16 and AR27-AR33 are the architecture of 4.0.0. AR27, AR29, AR30
and AR31 each correct something that is wrong in the released package
today; they are round-five work rather than field-found faults, because
the `architecture-critic` pass found them before the freeze, which is
what that pass is for.

## Round six — Phase 3, decided 2026-09-07

Five choices and the two open questions, answered by Kenny at the gate.
What was checkable was measured in the two Playwright browsers the same
day (`CSS.supports`, chromium 151 and firefox 153).

## T17 · The scroll trigger is IntersectionObserver, with `view()` as enhancement

The effects module triggers reveals (TH119, TH120, TH122) with
`IntersectionObserver`, which both browsers in the matrix support. Where
`animation-timeline: view()` exists — chromium 151 yes, **firefox 153
no**, measured — the register may also carry the drawing CSS-only under
`@supports`, so a page without the script already moves in chromium. The
rest state (drawn) is the default, never the fallback. One suite proves
the behaviour in both browsers (rule 7g).

## T18 · The tear is generated at build time

`gates/generate-tear.mjs` writes the razor SVG as a data URI into the
register stylesheet; `npm run gates` checks it is current. No JS in the
browser for the rest state, no asset file (S44), the shape identical in
every release; colour comes from the two surfaces through `mask`, so
one SVG serves every transition.

## T19 · Fonts ship with the package — S19 reversed

Kenny's decision at this gate, against the recommendation: the package
ships its font files. This reverses S19 (2026-09-03, "no font files in
the package"), recorded as a dated amendment in `docs/SCOPE.md`. What it
buys, measured: chassis-rs serves its dashboards under
`font-src 'self'`, so a Google Fonts link never loads there — a shipped
font is the only way a chassis-rs dashboard sees a theme's typeface.
What it costs: licences checked per family (SIL OFL or equivalent only),
the manifest and `SHA256SUMS` grow by one file per face, a `css/fonts.css`
with `@font-face` rules, and a size budget. **The shape is a Phase 4
decision** (AR), fed by the inventory below: which families the
twenty-four themes name, which are on Google Fonts under the OFL, and
what a latin woff2 subset weighs.

## T20 · DI5 for JS effects: a timing table, calibrated by one browser measurement

The effects module exports per effect its duration, repetitions and the
property that moves; the register declares per keyframe its luminance
steps; `gates/check-motion.mjs` computes the flash rate in Node and
writes the report (TH129, reported never corrected — S42). One Playwright
test counts luminance changes per frame on the slice glitch and must land
within 10% of the table, so the table is proven rather than assumed.

## T21 · No runtime dependencies for the effects

T6 stands. `js/effects.js` is built on platform APIs
(`IntersectionObserver`, `requestAnimationFrame`, CSS); `package.json`
keeps zero runtime dependencies. Scroll-scrubbing and smooth scroll are
outside the frozen list; if a feature ever asks for them, GSAP or Lenis
come through a mini-round, not through the back door.

## T8 and T9, re-put at round six

**T8 (targets):** unchanged since round one, Kenny's answer. **T9 (the
environments):** two additions. The concept demo lives as a Claude
artifact until TH126 exists — its CSP admits Google Fonts and no other
external source. chassis-rs is sharpened: `font-src 'self'` (why T19),
and without the register and the effects module until it vendors them
(M2) — the environment where the new cyberpunk differs most from the
site. One test loads the fixture the way chassis-rs does — no register,
no effects module, no webfonts — and proves the page stays functional
and readable (S45's quiet answers).

## Round six — Phase 4, revised after the critic (2026-09-07)

The first draft (AR34–AR44, commit `789f490`) went to the
architecture-critic in a fresh context. Twenty objections came back,
four blocking; five of its factual claims were re-checked in the code
and all five held. The decisions below are the revised list; each names
the objection it answers, and the gate form shows both sides. Kenny
freezes the list at the gate.

**Frozen 2026-09-07.** Kenny took every decision as revised (AR34–AR46:
Herzien) and froze the list (F1: Bevriezen). Changes go through
mini-rounds only; the critic re-runs with the build phase as its lens
before Phase 6 starts (L7).

## AR34 · One effects module; the start state is armed by a root attribute before first paint

`js/effects.js` exports `attachEffects(root = document, options) →
{ detach, observe }`, importing does nothing, `js/auto.js` calls it.
**Critic #2 (blocking):** end-state classes (`is-in`) make the no-class
CSS the *start* state, so a page without the script shows undrawn lines
— the opposite of T17's "drawn is the default" — and with the script,
`auto.js` runs at `DOMContentLoaded` (`js/auto.js:66`), after first
paint on a streamed page: firefox paints drawn, snaps to undrawn,
redraws. **Revised:** the register keys every start state on a root
attribute, `[data-kp-effects] [data-kp-reveal]:not(.is-in)`; that
attribute is set synchronously by the head-script slot `js/no-flash.js`
already owns, so the start state holds from first paint with the script
and the rest state holds without it. `detach` removes the one attribute
and nothing else. **Critic #7:** two roots on one page (React island plus
server markup) and elements added later. **Revised:** a module-level
`WeakSet` of started elements plus `data-kp-effects-done` guard a
second attach; the handle exposes `observe(el)` for content rendered
later; a `MutationObserver` is not built (priced: a subtree scan per
mutation on a dashboard that repaints tables). The two subscriptions
(`matchMedia` for DI7, `onThemeChange`) survived the critic unchanged.

## AR35 · The hook values name the role, never the expression

**Critic #1 (blocking):** `decipher`, `classified`, `tear` are cyberpunk
expressions written into the consumer's HTML; under synthwave a
"tear" is a horizon, and S20 makes the names permanent at 5.0.0.
**Revised:** `data-kp-surface="hero|app"`; `<mark>` for emphasis;
`data-kp-reveal="headline|emphasis|rule"` (what the element *is*);
`data-kp-divider` bare, or `="section"`; the heading accent by position
inside a surface. The module toggles state classes only (`is-in`,
`is-cleared`, `is-deciphered`, `is-glitching` — pinned as contract
values, consumers will select on them); the register decides the look;
a theme without a rule has answered quietly. The dossier variant is
`data-kp-reveal="emphasis"` on a container with a
`data-kp-reveal-trigger` child. **Critic #12:** `content: 'CLASSIFIED'`
in CSS is a user-visible string KT5's gate never reads. **Revised:** the
register uses `content: attr(data-kp-label)`; the consumer writes the
label from `js/strings.js`; punctuation-only prefixes (`/// `, `> `)
are exempted in `check-strings.mjs` with a reason.

## AR36 · One hook matrix for all themes; a non-quiet answer names a selector scoped to that theme

**Critic #9:** 24 manifests where 23 carry no information, and "the
selector exists in the named stylesheet" lets formal cite cyberpunk's
rule. **Revised:** one file, `themes/hooks.json`, a matrix with a
`default` row (the shared base answers, e.g. `mark` at
`css/_rules.css#mark`) and a row per theme that overrides; a non-quiet
entry must name a selector that contains `[data-theme='<that theme>']`,
checked as written against the stylesheet; a quiet entry carries its
reason. `gates/check-hooks.mjs` drilled red at birth by blanking one
cell.

## AR37 · Register coverage is inferred with a non-empty-body check, one parser for both gates

**Critic #10:** AR36 refused to infer while AR37 inferred, and "touches"
would count an empty rule or a `:hover::after`. **Revised:** one selector
parser (`gates/selectors.mjs`) serves `check-hooks.mjs` and
`check-register-coverage.mjs`; a root counts as covered only by a rule
whose selector names the root itself (not only a descendant or
pseudo-element) and whose body is non-empty. The 64 roots are read from
`css/components.css` at run time; utility-shaped roots (`sr-only`,
`skip-link`, `swatch`, `grid-wrap`, `table-wrap`, `tag-list`,
`theme-group`, `col-low`) start in the exception list with the reason
"layout or accessibility helper, no visual identity" — eight entries,
not fifteen.

## AR38 · The hero surface is a generated ground, states included, painted in `themes.css`

**Critic #4 (blocking):** six tokens remap `--primary` but not its DI3
states (`--primary-hover` is a per-theme literal from
`gates/generate-themes.mjs:92-99`), so the hero's own button hovers with
the app's colour; no gate measures focus on the hero; nothing paints the
surface. **Revised:** a theme's `tokens.json` gains the hero *sources*
(`surface-hero-bg`, `-fg`, `-fg-2`, `-muted`, `-border`, `-primary`,
`-danger`) under S47 — every theme declares them, one-ground themes
point them at the app values; the generator derives hover, active and
disabled exactly as it does for the app ground and emits the whole set
under `[data-theme='x'] [data-kp-surface="hero"]` in `css/themes.css`
(layer `kp.base`, so components and registers layer above it as today).
`check-contrast.mjs`, `check-invariants.mjs` (`FOCUS_SURFACES`) and the
DI tables iterate surfaces. **Critic #19:** the demo's hero also reads a
second foreground, red-on-yellow for the danger frame, and a display
size no `--kp-text-*` step carries; the sources above include `-fg-2`
and `-danger`, and a `--kp-text-display` step joins the scale.

## AR39 · Fonts ship per family, subset per script, gated on licence, reserved names and a 1.5 MB budget

**Critic #3 (blocking):** `check-manifest.mjs:86-87` admits only
`css|js|dist` and `.css|.js`, so font files are refused, and
`release.yml` attaches no fonts. **Revised:** the gate grows a `url()`
walk and a `fonts/` prefix (drilled red); the release gains a
`fonts.tar` asset; `css/fonts.css` is listed as copyable only together
with it. **Critic #13:** chassis-rs already ships 17 faces (latin +
latin-ext, 215 kB, `crates/chassis/static/fonts.css`, from bunny.net)
and will keep them — our relative `url(../fonts/…)` cannot resolve under
their `/static/`; measured per latin face 9–18 kB, so 3 MB was slack.
**Revised:** per-family subpath exports `./fonts/<family>` so JobTracker
takes one family, not twenty-nine; budget knob `fontsBudgetBytes`
default 1.5 MB; the migration note tells chassis-rs the file names so
their `fonts.css` can point at the same faces. **Critic #13 also
corrects T19's premise:** chassis-rs was never blind to typefaces — it
self-hosts; the shipped fonts serve the consumers that vendor a
stylesheet and nothing else (kyu, almanac) and the npm consumer.
**Latin-only breaks two themes** (woodblock: Zen Kaku Gothic New, Shippori
Mincho; lapis: Vazirmatn, Markazi Text): those ship their script subset
(`japanese`, `arabic`) beside latin, and the budget is per theme, not
per package. **Critic #14:** subsetting is a Modified Version under the
OFL; a family with a Reserved Font Name may not ship subset under it.
**Revised:** `gates/check-fonts.mjs` records the RFN per family and
refuses a subset under a reserved name; `fonts/LICENSES.md` lists every
family with its licence; `package.json` notes the OFL tree beside MIT.
`font-display: swap` stays (no invariant forbids it); tests await
`document.fonts.ready` before any measurement (critic #18).

## AR40 · The DI5 table lives in the module; three effects are calibrated; the block glyphs go

**Critic #8:** the draft's comment example did not describe the demo's
slice; decipher swaps half the glyphs per frame between letters and
solid blocks at 7.4 rem — a mean-luminance swing over a 341×256 px area,
the DI5 case; a comment block drifts from its keyframes. **Revised:**
`js/effects.js` exports `TIMINGS` per effect (`durationMs`, `cycles`,
`property`, `luminanceSteps`); the register's keyframes carry no
comment — `check-motion.mjs` reads the keyframe names from the register
and fails when one has no table row, and reads the table's opacity
steps against the keyframe's own stops. Three calibrations, not one:
decipher, slice, and the classified wipe, each within 10% of the table.
The decipher glyph set drops `▮▯` (React's `DECIPHER_GLYPHS` has none).
The report is `reports/di5.md`; per S42 the gate corrects nothing.
**Critic #17:** the module's own `matchMedia` read is allowlisted in the
gate's scan, which grows from `fx/*.jsx` to `js/`.

## AR41 · The tear's whole parameter set is the contract; two seeds; the hairline is a layer

**Critic #15:** the approved demo uses seeds 7 and 23 — two tears on
one page — and a cyan hairline a mask cannot carry; the seed alone is
not the shape. **Revised:** `gates/tear.json` pins the generator's
parameters (LCG constants, run 40–180, deep cut 18%, notch 32%, widths,
ridge depth 26, viewBox 1920×44) as one contract value with its reason;
the generator emits `--fx-tear` (seed 7) and `--fx-tear-alt` (seed 23);
the hairline is a `::after` layer in the register, `--fx-tear-line`;
`--kp-tear-height` scales the box with `preserveAspectRatio` so the cut
angles hold. The drift gate compares both URIs.

## AR42 · One `concept` example, rendered per theme by query, under the gates that exist

**Critic #11:** neither `check-examples-wired` nor `check-inline-styles`
reads a `concept/` directory. **Revised:** one entry `concept` in
`EXAMPLES` (so it lands in `examples/concept.html` under both gates and
`examples.spec.mjs`, both channels), a theme picker on the page reading
`?theme=<name>`, and a generated index page linking
`concept.html?theme=<name>` for all twenty-four — S46's URL per theme,
one file. ~~Copy text comes from `js/strings.js` (KT5).~~

**Amended 2026-09-08 (R6-Q3, Kenny: "clausule schrappen").** The copy
clause is struck. The concept page is built with literal copy like its
ten siblings: the strings gate scopes to `js/` and `components/`, and a
generated example page has never spoken through the dictionary — KT5 is
about the strings a *component* renders on a consumer's behalf, not the
prose of an example. The deviation was recorded at C0 rather than fixed
silently (S42's spirit), and this is the answer.

## AR43 · The configuration surface, aligned with the approved demo

**Critic's fixed check:** four values silently changed from the demo and
fourteen bare numbers had no knob. **Revised, taking the demo's values
as defaults (S46: the demo is the gate):** `--kp-button-notch` 14px,
`--kp-button-slit` 10px, `.kp-button--mirror`; `--kp-nav-notch` 13px,
`data-kp-nav-side="start|end"`, `--kp-nav-enter` 520ms/80ms;
`--kp-decipher-cps` 26, `--kp-decipher-lead` 260ms, `--kp-decipher-swap`
0.5; `--kp-reveal-threshold` 0.6; `--kp-reveal-stagger` 260ms (marks)
and `--kp-redact-stagger` 160ms; `--kp-classified-delay` 1500ms,
`--kp-wipe` 720ms; `--kp-rule-draw` 900ms, `--kp-rule-weight` 3px;
`--kp-slice` 600ms (headline) and `--kp-slice-hover` 320ms;
`--kp-charge` 520ms; `--fx-lift` (exists) for the hover lift;
`--kp-tear-height` 44px; the four corner clips collapse onto `--fx-notch`
with a `--fx-notch-sm` for controls; disabled opacity reads the
`--*-disabled` tokens; the toast uses `js/overlays.js`, so its hold is
that module's knob. `attachEffects(root, { reduceMotion, theme,
threshold, cps, stagger, delay })` takes options; CSS custom properties
are read once per attach, not per element. Contract values, pinned: the
state class names, the `kp-effect-*` event names, the tear parameters,
the DI5 thresholds, the hook names.

## AR44 · Reveals run once per session by default; an unknown hook is reported, never thrown

**Critic #5:** bfcache restores classes, so back does not re-run; a
forward click on a server-rendered dashboard is a full load and does —
every click deciphers the heading. **Revised:** a per-session memo like
AR25's (`sessionStorage`, key per path and hook), reveals default to
once per session, `data-kp-reveal-every="load"` opts back in; the memo
is the module's only storage and is documented beside the theme key
(M4). **Critic #6:** a silent no-op is the silence AR25 spent four sites
breaking. **Revised:** the module never throws; an unknown value emits
`kp-effect-unknown` once per page with the attribute and the accepted
values, and `js/diagnostics.js` lists it. `detach` stays safe to call
twice.

## AR45 · One decipher engine; React wraps the module

**Critic #16:** `fx/decipher-text.jsx` (rAF, 30 cps, its own glyphs,
React-only) beside `js/effects.js` is two engines and two DI5 tables.
**Revised:** `DecipherText` wraps `attachEffects` in 5.0.0 and is
deprecated in `MIGRATION.md`; one suite drives both channels (rule 7g).

## AR46 · The scanlines meet DI9's ceiling, or Kenny grants the exception at the gate

**Critic #20:** the approved demo's scanlines are 0.13 alpha at 0.55
opacity = 7.2%, over DI9's `textureOpacityCeiling` of 0.06
(`gates/config.json:15`), and the current register hides its 4% inside
a gradient with `--fx-texture-opacity: 1`, which the gate cannot see.
**Revised:** the register declares the texture's effective opacity as
one custom property the DI9 gate reads, the demo's scanlines come down
to 6%, and the gate is drilled on the old hidden shape. The alternative
is Kenny's override (DESIGN_INVARIANTS.md, "Kenny's override"): a
recorded DI9 exception for cyberpunk at 7.2%.

## Round seven — decisions taken while building, recorded after (2026-09-11)

**Back-filled.** These four were decided while stage 1 was being written
and were not in this document until Kenny asked why the procedure had
stopped being followed. Phase 4's whole purpose is that a decision
expensive to change later is written down before it is built on; these
were written down after. That is the fault, and recording them is the
smaller half of repairing it. The IDs are the house scheme; the AR series
is closed.

### arch-1 · Behaviour is opted into by an attribute, and the default changes nothing

`data-kp-sticky` and `data-kp-nav-toggle` turn on the two behaviours
stage 1 added. An attribute rather than a class, because staying put or
folding away is something *this element does on this page* rather than a
kind of element — the same reasoning the reveal hooks already use.

Every default is inert: the scroll offset is `0px`, the scroll behaviour
is `auto`, and a nav without a toggle keeps exactly the layout it had. A
consumer who upgrades and changes nothing sees nothing, which is standing
rule 46's requirement that a shared foundation may only extend in ways a
caller cannot feel.

### arch-2 · One width decides, and it is the one already there

The collapse fires inside the `@container kp-nav (max-width: 40rem)`
block the nav already stepped at, rather than in a second query of its
own. A container query cannot read a custom property, so the number is a
contract value either way (TH26); the choice was whether the package has
one such number or two. It has one, and `docs/USER_GUIDE.md` names it.

### arch-3 · The channel that wires a control marks it, and the other skips marked controls

`data-kp-nav-owner`, mirroring `data-kp-confirm-owner`. AR29 paid for
this once: two channels wired the same button, re-armed each other's
state forever, and the action never fired at any number of clicks. That
was treated as a fix for the confirmation; it is the package's general
answer to double-attachment, and stage 1.3 is where it became one. Every
attach function that could meet a React-rendered control takes `ownedBy`,
and `''` turns the guard off for a consumer who wants the module anyway.

### arch-4 · The configuration surface grew by six knobs

Phase 4 asks which operational knobs a project exposes and how, so that
a knob nobody wrote down does not quietly become a constant again. Stage
1 added `--kp-sticky-top`, `--kp-sticky-layer`, `--kp-scroll-offset`,
`--kp-scroll-behavior`, `--kp-nav-toggle-size` and `--kp-nav-menu-indent`.
All six are custom properties, which is this package's only configuration
mechanism, and all six default to a no-op. The count the site gate reads
moved from 87 to 89; the two layout knobs live in `docs/LAYOUT.md` and
the two nav knobs in `docs/USER_GUIDE.md`.

**What was not done and is owed.** The `architecture-critic` pass never
ran over these four. Phase 4 puts the critic before the form so Kenny
decides with both sides visible, and here there was neither a critic nor
a form.
