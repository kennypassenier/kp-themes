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
`pastel:10`, `pastel:48`, `topo:12`, `nishiki:9`, `retro:14`. Headings,
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
and `--muted-foreground`, so code is green in terminal and gold in tazhib
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
CSS properties; TH114 is a test plus a sentence in the guide; D3 removes
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
(`js/components.js:33-35`) are retired; D3 removes them.

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
