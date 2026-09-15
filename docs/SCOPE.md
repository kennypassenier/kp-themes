# Scope — kp-themes

> **APPROVED — 2026-09-03.** Every statement below was answered by Kenny
> in the Phase 0 approval gate, across five rounds (Correct · Adjust ·
> Drop per statement). The wording here is the wording that survived that
> gate; where a statement was adjusted, the adjusted text is the one that
> stands. Nothing may be added to this document outside a mini-round.

Sources: `HANDOFF.md`, `docs/REQUESTS_FROM_CONSUMERS.md` (written by the
JobTracker session on 2026-09-03), Kenny's own brief opening this project,
and the measurements taken during the gate itself — those are cited inline
where they changed a statement.

## Mission

**S11 · Uniformity across every channel is the point.** Any project of
Kenny's that wants it refers to kp-themes so that all of his apps look
like one family. Today that means web pages; GUIs (Avalonia) and TUIs
(Ratatui) follow. Every proposal in this project is judged on one
question: does this make our apps more uniform across channels?

**S1 · kp-themes is the single home of the house theme system.** The
seven themes (formal, light, dark, cyberpunk, pastel, terminal, forest)
live here as design tokens, published as `@kp-soft/themes`, consumable by
any surface — React apps, framework-free server-rendered HTML, and later a
TUI or GUI — without each consumer re-deriving the same behaviour.

## In scope

**S2 · A framework-free picker.** Alongside the CSS token layer, the
contrast gate and the React `useTheme` / `ThemeSwitcher`, the package
ships a framework-free version of the same picker behaviour: same
`localStorage` key, same `data-theme` toggle, same derivation of the
`dark` class, no build step required.

Measured: the Almanac and kyu sessions each rebuilt this by hand in
vanilla JavaScript on 2026-09-03, within an hour of each other, because
their dashboards are server-rendered HTML from a Rust binary with
Bootstrap 5 — no npm, no bundler, no React. kyu shipped its version in
2.2.0.

**S3 · The contrast guarantee sits at the source, not at every
consumer.** kp-themes runs the contrast check automatically before every
release, enforced by CI and a commit hook (to be installed in Phase 5).
Consumers do not run that check again. What a consumer needs instead is
certainty that its copy is not stale — a different check with a different
purpose. A consumer that ever overrides a colour of its own can run the
shipped script against its own file; that demonstrably works.

*Adjusted during the gate.* The draft demanded a contrast gate in every
consumer, on the strength of the T17 promise. Three measurements taken on
2026-09-03 overturned it: (1) Kenny had already decided the opposite in
kyu on 2026-09-02, and the reasoning is written into the header of
`~/Projects/kyu/static/themes.css` — pulling Node into a Rust CI to
re-answer an answered question, for a copy nobody is allowed to edit;
(2) the vendored copies in kyu and almanac are line-for-line identical to
`css/themes.css` below their own headers, so there is nothing else to
check; (3) JobTracker overrides no theme token at all, so the one case a
consumer-side check would catch does not exist today.

Known gap, recorded rather than papered over: kyu's reasoning assumes
kp-themes runs the check before a release. This repository has no CI and
no commit hooks yet, so today that check only runs when someone types the
command. Phase 5 closes this.

↳ *T17 = the JobTracker Phase 3 decision (2026-09-02) that created this
package, which promised "each consumer's contrast gate running on the
bump".*

**S4 · A theme has seven layers, and a consumer need not use them all.**

| Layer      | Where it lives                                              |
| ---------- | ----------------------------------------------------------- |
| Palette    | the theme's tokens (colour roles, not colour names)          |
| Register   | per-theme decoration, e.g. `css/cyberpunk-register.css`      |
| Typography | a per-theme webfont via Bunny Fonts                          |
| Motion     | the cyberpunk `fx/` components                               |
| Gates      | `scripts/check-contrast.mjs`                                 |
| Anatomy    | the per-theme document of S12                                |
| Components | the per-channel building blocks of S13 and S15               |

*Adjusted during the gate:* the draft listed five layers, written before
the anatomy documents and the component set entered the scope.

A consumer using only the palette and the gate — JobTracker today — is
using the theme correctly, not partially. Measured: JobTracker emits no
`data-slot` attributes at all (verified in its own sources, not only
claimed), so most of the 336-line register is inert there while the theme
itself is complete.

**S6 · Web consumers take their components from kp-themes; the theme is
complete.** A consumer building web pages takes its components from this
package — button, badge, table, alert, form field, picker — in the channel
variant that fits. Those components carry the theme themselves, so there
is nothing to translate into another styling library. The theme is
complete: it governs the page's own background, text colour and borders,
not only those of the components. If something still looks unthemed at a
consumer, that is because the consumer uses a foreign utility class that
claims precedence; the answer is to replace that class with ours, not to
patch over it. Only until that replacement has happened may a small
compatibility file close the gap — temporary, and expected to shrink to
zero.

Measured during the gate: `css/themes.css:531` already applies
`background-color: var(--background)` and `color: var(--foreground)` to
`body`, and kyu loads `themes.css` after `bootstrap.min.css`, whose own
body rule carries no `!important` — so the theme already wins there. What
genuinely remains in kyu is one class: `.text-secondary`, used 26 times,
which Bootstrap marks `!important`.

**S6b · Completeness is a continuous process.** A theme is complete only
when every state our components can show has its own token in all seven
themes. When building a component turns up a state with no token, that is
a gap in the theme and not in the component: the token is added to all
seven themes, the contrast check runs over it, every component is
updated, and that state gets its own place on the showcase page so Kenny
can see it in each theme. Closing the gap comes before finishing the
component.

Gaps already known, to be handled in Phase 2 — measured by listing every
token name in a theme block: there is no `--success`, no `--warning` and
no `--info` anywhere in the file (zero hits), and no token for the hover,
active or disabled states. Green and amber exist only as JobTracker's
pipeline status colours, which are semantics for one app rather than for
everyone. Kenny's own two examples — muted text and the red destructive
button — already exist as `--muted-foreground` and
`--destructive` / `--destructive-foreground`, and both are already
covered by the contrast check.

Cost, stated plainly: one new token means seven themes times two values —
the colour and the text colour on it — so fourteen colours per token, each
of which must pass the contrast check.

**S12 · Every theme gets an anatomy document.** One document per theme
saying what makes that theme that theme: why cyberpunk is cyberpunk and
not merely "dark with pink". Colour roles, contrast behaviour, typography,
motion, and explicitly what is not allowed.

Measured in this repository: of the seven themes exactly one has such a
document (`docs/legacy/CYBERPUNK_THEME_RESEARCH.md`, with its "five pillars"
section). `docs/legacy/THEMING.md` explains the system, not the individual
themes. Six themes have none: formal, light, dark, pastel, terminal, forest.

These documents are written channel-neutrally — they describe character,
not CSS — so a later TUI or GUI round can build the same theme without
reading the stylesheet.

**S13 · A static showcase page shows every component in every theme.**
One static web page carrying each web component of this package, once per
theme. With seven themes the picker appears seven times, each in its own
styling. That page is the review surface: Kenny looks at it, gives
feedback, Claude adjusts, until it is right.

Measured: this repository contains zero HTML files today, and one web
component (`components/theme-switcher.jsx`) plus four cyberpunk effects in
`fx/`. The page and its contents grow together.

**S14 · Approved work is frozen as a numbered component set.** What Kenny
approves on the showcase is recorded as v1 of the component set. Later
extensions become v2 and onward; v1 keeps existing so a consumer is never
forced to jump. That set version is separate from the package's npm
version.

The simplest thing that would just work — no separate set version, only
the npm version — was considered and rejected for one measured reason: two
of the three consumers (Almanac and kyu) use no npm and never see that
number, because they vendor a copy of the stylesheet. A set version
carried in the CSS and the markup is legible to them.

**S15 · Each channel gets its own variant, and the showcase can put them
side by side.** Every component exists once per supported channel. Today
that is two: React, and plain HTML with JavaScript. Adding Vue later means
a round that produces a Vue variant of every existing component. The
showcase gains a comparison mode that renders the same component per
channel next to itself.

Comparison is possible for web channels because React, Vue and plain
HTML/JS all render to the same DOM in the same browser. How strict that
comparison becomes — by eye, or an automated screenshot diff that fails on
a pixel — is a Phase 4 decision, deliberately not settled here.

**S16 · For TUI and GUI the tokens are enforceable, the composition is a
recommendation.** If kp-themes publishes the seven palettes as a
machine-readable file, a Ratatui app can read it and take its colours from
there; then "use the right colour" is code that fails on deviation rather
than advice. The same holds for Avalonia through a generated resource
file. Composition cannot be enforced the same way: a terminal has no CSS
cascade and works in a grid of text cells, so a card with rounded corners
and a shadow does not exist there. Components for those surfaces can be
built, but as native code in their own library — a round of its own.

## Non-goals

**S5 · TUI and GUI components are not built in this pass.** What does
change from now on is that the tokens and the anatomy documents are
written channel-neutrally, so a later TUI or GUI round has nothing to
reinterpret. Concretely: the colours also exist independently of their CSS
form, in a file that Rust or .NET can read directly, and no statement
about "a theme" speaks only of CSS.

**B1 · Two kinds of interop file, treated differently.** A *binding*
gives our tokens a second name in a styling library's own vocabulary and
is permanent; today that is Tailwind (`css/tailwind-bridge.css`). A
*patch* temporarily closes the gap a foreign utility class with precedence
tears open, and is expected to shrink to zero; today that would be
Bootstrap. Both are optional. A library not on the list is not supported —
the consumer writes its own. Extending the list is a deliberate round, and
every patch is recorded together with when it disappears.

What becomes of kyu's 131-line `theme-bridge.css`, measured: 32 lines
(lines 100-131) are the theme picker's own styling and become part of the
picker in this package under S2; the component overrides become redundant
as kyu adopts our components; one class remains as a patch with an agreed
end. Neither kyu nor Almanac has to do anything until our component set
exists.

**S7 · The package does not chase every vendoring choice.** Almanac and
kyu vendor a copy of `themes.css` into a compiled binary. kp-themes
guarantees that the gate and a provenance marker are available to run
against such a copy; it does not track whether those consumers actually
refresh it. That residual risk is recorded, not owned.

Measured during the gate, and added to this statement: the provenance
marker already exists in both consumers — the header of both
`~/Projects/kyu/static/themes.css` and
`~/Projects/almanac/static/themes.css` names the source, the version
(v0.1.1), the commit and the date. Almanac already runs a commit-time
check comparing its copy against the upstream file. **Corrected 2026-09-04:**
kyu has one too now — its own commit gate compares the vendored stylesheet
against this repository's. Both consumers guard their copy; neither gap
remains.

↳ *provenance marker = a note at the top of a copied file saying where it
came from, which version it is, and when it was copied.*

**S20 · A released version of a theme never changes** (Kenny,
2026-09-04). This is the one promise kp-themes makes, and it is the
reason a consumer can pin a version and stop thinking about it: the token
values of `dark` at v1.0.0 are the token values of `dark` at v1.0.0
forever. Any change to a theme — a colour, a font, a motion token — raises
the version. Nothing is corrected in place, not even a value that is
plainly wrong; that correction is a new version.

What follows from it, and what deliberately does not:

- kp-themes publishes a version number, a provenance line and a checksum
  with every release. That is the whole of what a consumer can rely on
  mechanically.
- kp-themes does NOT build tooling for consumers — no sync command, no
  adapter, no per-consumer fixture. Both this project and the projects
  that use it are run by an LLM working from the latest version; a
  consumer works out its own integration, and asking for something inside
  our scope (a component, a type, a token) is the supported way to get it.
- The scope stays what it was: define themes, and build components on
  them. A request that is not one of those two is out of scope here, and
  belongs in the project that wants it.

**S19 · The package does not prescribe how it is consumed.** kp-themes
ships files — colours, CSS, components, a machine-readable token file —
and each project arranges for itself how it takes them in: a copy, a git
reference, or something else. That arrangement is made in that project's
own conversation, not here. kp-themes guarantees only that what it
publishes is recognisable and verifiable: a version number, a provenance
line, and a checksum with every release.

*Added by the mini-round of 2026-09-04*, when Kenny dropped JobTracker's
build step as a supported path and decided this package publishes nothing
to npm at all. A large share of the scope's complexity came from that single
route — a setting consumers had to add, a rule Tailwind needed, a bot
following versions nobody had ever seen work. All of it falls away, and
what remains matches what was already happening: two of the three
consumers copied the file anyway.

## Ratification and structure

**S17 · The inherited base is approved; the picker is not.** Approved for
use, and therefore the foundation the following work builds on: the seven
themes (`css/themes.css`), the four cyberpunk effects in `fx/`, the
register (`css/cyberpunk-register.css`), the contrast check
(`scripts/check-contrast.mjs`) and the Tailwind binding
(`css/tailwind-bridge.css`). Explicitly **not** approved: the picker —
neither the React version in this package (`components/theme-switcher.jsx`
and `hooks/use-theme.js`) nor the vanilla version kyu based on it. That is
reviewed together with the other components on the showcase page, in all
seven themes, and approved only there. That a consumer already shipped it
gives it no status.

**S18 · Files are organised by function, per theme, with shared
components.** The restructure happens in Phase 2, before new work is
layered on top. Chosen shape (option B of two put to Kenny):

```
themes/<name>/   tokens, stylesheet, register where it exists, anatomy.md
components/v1/react/      one implementation per component
components/v1/vanilla/    the same components, framework-free
components/v1/contract.md the markup contract both variants honour
showcase/                 the static review page
gates/                    the contrast check and what Phase 5 adds
```

Rejected shape: a full `components/` tree inside every theme. Measured
reason: 7 themes x 6 components x 2 channels = 84 files for v1 against 12,
with every change made fourteen times — while no theme today has component
code of its own. The one theme with its own layer, cyberpunk, carries 336
lines of decoration over the same markup. The freedom that shape buys is
currently used by nothing.

Escape hatch: should one theme genuinely need its own component variant
later, that theme gets its own `components/` directory as an exception,
through a mini-round with the reason recorded.

The public names a consumer uses to address this package keep working.

## Hard constraints

**S8 · Six constraints, none of them a choice.**

- **Node 26**, pinned in `.nvmrc` and `engines: node >=26 <27`.
- **The GitHub repository is public.** Decided through JobTracker
  correction C1: a private git dependency cannot be fetched from CI or an
  image build. Consequence accepted: this code and these colours are
  public.
- ~~Consumers need `allow-git=all` in their `.npmrc`.~~ **Dropped by the
  mini-round of 2026-09-04**: nothing is fetched over npm any more, so the
  setting has nothing to permit.

  **Corrected on 2026-09-07 [TH112].** That reasoning was wrong about the
  facts and not only about the wording, and it left this document
  contradicting `README.md`, which never stopped documenting the setting.
  The git route was not removed with the build step: JobTracker fetches
  this package as `github:kennypassenier/kp-themes#v0.1.1` in
  `dashboard/packages/web/package.json` and carries `allow-git=all` in
  `dashboard/.npmrc` (`docs/INVENTORY.md:1255`). `README.md:538-554`
  documents that setting, says which value to use when, and scopes itself
  to the git route in its opening sentence (`README.md:540`) — "Only if you take the
  git-dependency route. A consumer that copies the files needs none of
  this." That is the correct half, and the two documents now say the same
  thing: **the setting is required of a consumer that takes the git route,
  and of nobody else.** What is genuinely gone is the constraint's status
  as a *hard* one on every consumer, which is what S19 replaced it with.
  The struck text above is left standing rather than rewritten, because
  S20's promise about released themes is the same honesty this record is
  held to: it shows what was believed, and when it was corrected.
- ~~Tailwind consumers must declare this package as a `@source`.~~
  **Dropped by the same mini-round**: that rule existed because Tailwind
  does not scan `node_modules`. A copy living inside the consumer's own
  project is scanned, so the problem disappears with the mechanism. The
  Tailwind binding file itself stays and is still useful.
- **All artefact text is English** — code, comments, commits, docs.
- **The framework-free layer works without a bundler**, loadable with a
  plain `<script>` tag.

## Success criteria

**S9 · One source of truth for the theme list.** After this round the list
of seven themes exists in exactly one place — `THEME_META`, or the DOM
equivalent for the framework-free picker. No picker implementation carries
its own hardcoded list of dark themes.

This is the bug both consumers nearly shipped: both were about to hardcode
the dark set, and kyu had the wrong count. Verified during the gate in
`hooks/use-theme.js`: `THEME_META` marks exactly three themes dark — dark,
cyberpunk, terminal.

**S10 · Every release is demonstrably checked before it gets a version
number, and carries a checksum with which any project can verify that its
copy belongs to that release.** How a project performs that verification
is that project's own business.

*Amended by the mini-round of 2026-09-04.* The original criterion promised
something about other people's projects — "JobTracker through npm and CI"
— which was never verifiable from here. The new one promises only what
this package can deliver and prove, which is the same separation S3 made
when the contrast guarantee moved to the source.

## Open questions carried into Phase 1 and 2

- The version-following mechanism is unproven: JobTracker pins
  `github:kennypassenier/kp-themes#v0.1.1` with Dependabot configured, but
  no kp-themes bump PR has ever been observed because there has been no
  tag since v0.1.1.
- The register's dependency on shadcn markup deserves a README line: the
  cyberpunk theme is correct without the register.
- Three themes carry their own typeface — verified in `css/themes.css`:
  formal at line 67 (Fraunces), cyberpunk at line 227 (Chakra Petch),
  terminal at lines 343-344 (Share Tech Mono, which also sets
  `--font-sans` to monospace). Without the Bunny Fonts link they fall back
  silently, and cyberpunk in particular reads as half-applied. A vendoring
  consumer cannot discover this from `themes.css` alone.
- ~~kyu has no staleness check on its vendored copy; Almanac does.~~
  **Closed 2026-09-04:** kyu shipped one; both consumers now compare their
  vendored copy against this repository's file at commit time.

## Round three — more themes (2026-09-05)

**S21 · Round three adds themes, and only themes.** Kenny listed eleven
candidate styles on 2026-09-05 with one criterion — a candidate that
overlaps too much with an existing theme is not built — and asked for
further ideas that are distinct from everything here. The research and
the decision per candidate are in `docs/THEME_CANDIDATES.md`; the rated
features are TH64–TH87 in `docs/FEATURES.md`. Eight themes are Essential
(brutalism, art deco, dark academia, the shade pair, ticker, woodblock,
phantom), five Desired (retro web, monochrome, grotesk, lapis,
nostromo), four Later, five dropped with their reason.

What stays out of this round, by Kenny's instruction on the same form:
the four findings kp-soft reported against 3.0.0 (P1–P4, recorded in
`docs/REQUESTS_FROM_CONSUMERS.md`) and D3, the removal of `STRINGS_NL`.
Both wait for the round after this one. S20 holds: every new theme ships
in a new minor version; nothing existing changes in place.

## Round four — the layout layer and the documentation site (2026-09-06)

Round four started from four findings chassis-rs reported after vendoring
3.1.0 into the kit, and from Kenny's question underneath them: what does
this package actually support, and what should it support next. Phase 0
ran as three forms — a scope form, a deep dive on the four items that
needed concrete examples, and a last round on Tailwind, the utility API
and the documentation site.

**The measurement everything rests on.** kp-themes ships no layout at
all: every one of the ~150 classes in `css/components.css` is a
component, the only container is `.kp-form`, headings get a typeface and
neither a size scale nor margins (`css/_rules.css:282`), and `aria-busy`
is unstyled. The proof is in a consumer: `crates/chassis/static/chassis.css`
in the kit is 71 lines whose own header calls itself "layout glue and the
few utilities @kp-soft/themes deliberately does not ship", and its
templates carry 28 inline `style=` attributes on top of that.

**S22 · The package grows a layout layer of its own, and does not adopt
Bootstrap.** Sixteen classes: seven containers (`.kp-page`, `.kp-stack`,
`.kp-row` with `--end`/`--between`/`--nowrap`, `.kp-autogrid`,
`.kp-sidebar`, `.kp-section`, `.kp-center`), five text and content
utilities (`.kp-prose`, `.kp-text-muted`, `.kp-text-end`/`-center`,
`.kp-mono`, `.kp-code-block`), three table helpers (S28) and a rule for
`[aria-busy='true']`. Each carries a `--kp-*` knob so a page or a theme
adjusts it without rewriting the class.

*Build-vs-buy, recorded.* Bootstrap 5.3 was considered as the base and
rejected on three measured grounds: no active project of Kenny's depends
on Bootstrap 5 (only one old project on Bootstrap 4), it would place its
own twenty-odd components beside this package's twenty-two, and its next
major renames the grid and utility syntax to Tailwind-style prefixes
(`col-md-6` → `md:col-6`), which would be a class rewrite in every
consumer template. Own class names stay under this package's own semver.

**S23 · A utility API of about 123 classes, `kp-` prefixed, without
breakpoint variants.** Spacing and padding over the six-step scale on
seven sides (84), gap (6), display (5), flex alignment (10), text (13)
and width (5). Breakpoint variants were declined: they would take the set
past 300 classes, they are the part Bootstrap 6 is renaming, and the
primitives plus container queries already do that work. The prefix keeps
it from colliding on a page that also loads Tailwind or Bootstrap.

**S24 · The Tailwind bridge stays and grows with the new tokens.**
Measured: `css/tailwind-bridge.css` is 103 lines and has exactly one
consumer, `kp-soft/resources/css/app.css` (lines 18-21). It maps 31
tokens onto Tailwind's colour namespace and re-declares them per
`[data-theme]`; it ships no utility class, so the utility API of S23 does
not replace it. Tailwind cannot be this package's layout layer, because
it needs a build step and kyu, Almanac and the chassis kit have no npm —
that constraint, not preference, is what splits the two.

**S25 · Both channels stay, and new behaviour starts in a pure module.**
The framework-free channel (`js/`, 22 files, 5798 lines) serves the
server-rendered consumers; the React channel (`components/`, 34 files,
5151 lines) serves the npm consumers. `js/listbox.js` is the model: 310
lines, no imports, no DOM ownership, driven by four files across both
channels. Standing rule 7g's one-suite-drives-both stays the gate.

**S26 · Ten example pages, and layout failures become a gate.** App
shell, login, list-with-form, settings, wizard, empty-and-error, hero,
pricing-and-testimonials, article, profile. A gate measures each at 320,
768 and 1280 px for horizontal page scroll, elements wider than their
container, and adjacent blocks with no space between them — the fault
the kit patched by hand.

**S27 · A generated documentation site, one page per component.** Today
`.github/workflows/pages.yml` redirects the Pages root to the showcase;
the site becomes a real site with the showcase as one page in it. Roughly
45 component pages (58 class families in `css/components.css`, merged
where they are pairs), plus start, tokens and themes, the layout layer,
the utility API, the ten example pages and the diagnostics page of S29.
Each component page carries all nine sections: what it is and when to use
it, a live example, framework-free markup, React usage, a props table, the
events it fires, the `--kp-*` knobs it reads, accessibility notes, and
every variant and state. Generated rather than written, because all 17
React files already carry a `@typedef` the table can come from, and a
written page keeps its claim after a rename. Four gates guard it:
coverage (every family and export has a page), truth (every documented
prop exists and every prop is documented), one source (the shown snippet
is the markup the live example renders), and the layout gate of S26.

**S28 · Tables get the whole modern treatment, starting with a defect.**
The scrolling wrapper is written in four places — `components/table.jsx:69`,
`components/datatable.jsx:208` and two showcase specimens — and none of
them sets `tabindex="0"`, `role="region"` or `aria-label`, so a
keyboard-only user cannot scroll a wide table. That is fixed first. Then
cell strategies (`.kp-cell-truncate`, `.kp-cell-break`), column priority
(`.kp-col-low`), container queries instead of media queries, and a card
layout for the plain `.kp-table` as well as the DataTable, which has one
already (`css/components.css:1584`, opt-in via `data-kp-cards`).

**S29 · An unknown theme name stops failing silently.** `applyTheme`
falls back to `formal` without a word (`js/theme-core.js`), the registry
exports no version, and `css/themes.css` carries its version in a comment
JavaScript cannot read — so a page whose stylesheet knows 24 themes and
whose JavaScript knows eleven silently ignores the thirteen new names.
Kenny confirmed that pattern on almanac.kp-soft.dev: none of the new
themes worked and all the old ones did. The fallback stays, but it warns,
the registry gains a version constant, and a diagnostics page lays the
stylesheet and the JavaScript side by side.

**S30 · A spacing and typography scale as tokens in all 24 themes.**
`--kp-space-*` exists today only as a fallback inside components
(`css/components.css:402` and on), is declared nowhere, and stops at md.
The scale is completed and gated for completeness like the other tokens,
so the layout layer has something to be consistent with.

**S31 · What lands where.** Everything additive is 3.2.0. The one change
to existing behaviour — the destructive-action confirmation becomes a
`<dialog>` naming what will happen, instead of arm-then-act — lands in
4.0.0, together with D3's removal of `STRINGS_NL`. Also in scope: the
checksum manifest gains `js/strings.js` and `css/retro-register.css`, a
density mode (`data-density="compact"`), a single dist bundle, and
`ECOSYSTEM.md` is brought up to date (it still describes 1.2.0, eleven
themes and 66 tokens).

## Round five — the three that waited for a major (2026-09-07)

Approved by Kenny on 2026-09-07, all six statements "Klopt". The round
exists because three decisions he had already taken were all waiting on
the same thing: a major version. Round five clears them; it does not
invent anything.

**S32 · Why there is a round five.** Three settled decisions each change
behaviour a consumer relies on today, which semver answers with 4.0.0.
They were not postponed for being unimportant. The scope below is
therefore mostly things Kenny has already rated, and the round is
small and sharply bounded by design.

**S33 · TH107 is in: the confirmation dialog.** A click on a destructive
button opens a `<dialog>` carrying the attribute's text; Escape and
Cancel do nothing; Confirm performs the action once; focus returns to
the button. Both channels. It replaces arm-then-act, which is what 3.2.0
does and what the documentation site described back to Kenny on
2026-09-07 — the sighting that opened this round. It touches both
channels, the contract enforcer that today disarms a destructive button
carrying neither confirmation nor undo, and the existing arm-then-act
tests, which become tests of the dialog.

**S34 · TH104 is in: container queries beyond the tables.** The movable
card grid and the nav bar still listen to the window rather than to the
box they sit in. Converting them needs a wrapper element in markup that
kyu, Almanac and the chassis kit write by hand, because a container
query cannot style its own container — which is why this is a major and
why each of the three gets a migration note. Kenny's choice of
2026-09-06 stands: convert everything rather than leave two mechanisms
side by side.

**S35 · D3 is in: `STRINGS_NL` goes.** The bundled Dutch dictionary has
been an export since 2.0.0; removing an export is a breaking change, so
it waited for exactly this round. The words do not leave the world: S20
keeps them in the 2.0.0 through 3.2.0 tags, and the migration note says
how a consumer takes them into their own project.

**S36 · The four consumer reports are the round's first work.** P1 (a
wrong import in the migration guide), P2 (the allow-git instruction does
not hold across a version jump), P3 (the cyberpunk layer skips their own
components) and P4 (a request for a size scale on the button) have sat
untouched in `docs/REQUESTS_FROM_CONSUMERS.md` since round three, on
Kenny's instruction to keep them for the next round. **None of the four
has been measured by this project.** Standing rule 13b makes a report
from another session a claim until this project reproduces it, so they
go through Phase 1 — reproduce and measure — before Phase 2 rates them.
P1 and P2 are documentation faults and are probably smaller than a
round; P3 and P4 touch the code.

**S37 · What is not in.** TH47, the visual filter builder, stays out.
**Corrected 2026-09-07:** the statement Kenny approved said it had been
unrated since 2026-09-04, on the authority of a mini-round row that was
stale. It was rated that same day — `docs/FEATURES.md:143` records
**Later**, because it shares its whole mechanism with TH37's filtering
and is superstructure rather than a second system. So it stays out of
this round on its own rating rather than on a missing one, and the queue
row is closed. KT6-M1 stays outside the round because it is a
measurement JobTracker owes, not this project. And no new themes and no
new components: this round is clearing, not extending. Anything that
wants in during Phase 2 goes through the ordinary rating.

**V1, decided 2026-09-07: the site fixes ride along in 4.0.0.** The four
fixes Kenny found on the published site were merged to `main` so the
site itself is correct straight away — the Pages workflow runs on every
commit there and needs no tag. Three of them touch only the
documentation site. The fourth is a package change, `.kp-copyable` no
longer pushing a long value off a narrow screen, and Kenny chose to let
it reach consumers with 4.0.0 rather than cutting a 3.2.1 for it.

## Round six — a cyberpunk register that spits off the screen (2026-09-07)

**Approved by Kenny at the Phase 0 gate on 2026-09-07**, in two forms:
the demo and S38, S40–S44 in the first; S39 rewritten, N1 and R1
resolved, then S45 and A1 in the follow-up. S46 was his own instruction
during the gate.

Draft for the Phase 0 gate. Every statement is an item in the form.

**S38 · Why.** Kenny: the themes are fine, but not at the level of a
next-level hand-made site, and some themes are to be lifted to that
level — cyberpunk first. Not colours and a corner on the buttons: fully
styled elements and interactivity, a super navbar, real glitch and
decipher effects, "the full works". A demo of the elements (hero,
navbar, buttons, form) came before the go, and it did: the artifact
"Signal Yellow" is that demo.

**S39 · The same name, a new major.** The next cyberpunk replaces the
current one under the name `cyberpunk`, in a new major version. Kenny's
answer of 2026-09-07 to the first draft (which proposed a new name and an
archived old theme): "dit nieuwe thema komt in de plaats van cyberpunk,
dus het kan wel de naam houden. Dit verandert geen uitgebrachte versie
van een thema want het is een nieuwe versie." That reading is S20's own:
a released version never changes, and 4.0.0's cyberpunk stays exactly
what 4.0.0 shipped, retrievable from its tag forever. What changes is
what `data-theme="cyberpunk"` means from the next major on — so every
consumer that names it (kp-soft, kyu, Almanac vendor the stylesheet)
sees the new theme when it upgrades, and the migration note says so in
its first line. The old theme does not travel into the new major under another
name (A1, Kenny, 2026-09-07: "Alleen in 4.x"): the new major carries
twenty-four themes, and a consumer that wants the old look pins 4.x.

**S40 · The palette.** Signal yellow as ground and primary
(`#FCEE0A`, the frame colour read off cyberpunk.net), a void near-black
with a violet cast, blood red as alert and destructive and as the tint,
cyan for what must be read (microlabels, form labels, hairlines), and
violet only inside a glitch slice. Kenny's brief verbatim: "voornamelijk
geel met rode tinten en wel nog wat neon blauwe/paarse accenten hier en
daar".

**S41 · The full works.** The register is CSS plus a JS effects module,
every effect opt-in and reduced-motion safe, and every animation under
DI5 computed rather than assumed: the navbar strip with the reference's
clip-path geometry and dash-prefixed dropdowns; hover glitch as RGB
slices that fire once; buttons with the notch, its mirrored variant, the
slit in each flank and a one-shot charge sweep; the decipher of a
headline on load; a dossier card whose redactions lift in steps; the
razor tear between sections, generated; hairlines that draw in under
headings on scroll; static scanlines. Behaviour lands in both channels,
under one suite (rule 7g).

**S42 · What is measured before it is trusted.** The demo becomes the
round's first fixture, and every effect gets the three drills this
project already runs: red without its rule (KT3), the difference from
rest rather than a bare count (MR-NOTCH), and the flash count computed
for anything that repeats. The old register's known gap travels with it —
its anatomy says in so many words that nobody computed the luminance
transitions per second. For the new register that is done on day one.
**DI5 is reported, not silently corrected** (Kenny, 2026-09-07, on
approving the demo): the flash computation runs and its findings are
written down and shown, but no effect is changed on its account until
Kenny orders it. He expects this theme may become an exception to the
rule; Claude's note stands beside it — DI5 is the one invariant with a
bodily consequence, and every effect in the demo is a one-shot event
rather than a loop, so the computation is expected to pass without any
change being needed.

**S43 · Synthwave after.** `docs/THEME_CANDIDATES.md` C1 scored
synthwave "too close" to cyberpunk because both sat on magenta, cyan and
violet over a void. Once cyberpunk moves to yellow that reasoning is
gone: synthwave becomes a candidate again and is the next theme after
this register lands — in this round only if the register is done, else
first in the queue.

**S44 · Out of scope.** No artwork or images ship with the theme —
tokens, CSS and JS only. No change to the theme picker. No change to the
81-token contract beyond what the fx series already allows; a new fx
token goes through the parity gate like every other. Nothing changes for
the other twenty-three themes. Registers stay opt-in for a consumer; the
documentation surfaces load them, as decided on 2026-09-07.

**S45 · Meaning in the HTML, expression in the theme.** Kenny's question
of 2026-09-07, after the demo: can the two-grounds idea and the effects
carry over to other themes, while plain HTML keeps working on every
theme? The answer is a small, shared vocabulary of semantic hooks that
every theme must answer — a surface (`hero` or `app`), emphasis, a
reveal, a section divider, a heading accent — the way every theme must
declare the same 81 tokens. The consumer writes `<mark>` or
`data-kp-surface="hero"` once; signal answers `<mark>` with
classified-then-cleared on load, another theme with a seal, a highlighter
stroke or plain bold, and the markup never changes. A theme's answer may
be quiet, but it may not be missing: a parity gate holds every theme to
every hook, and the effects module runs only the active theme's answers.
Signal is the reference implementation of that vocabulary in this round;
lifting other themes to the same level is a round per theme after it, each
answering the same hooks in its own idiom.

**Resolved at the Phase 0 gate, 2026-09-07.** The name question (N1)
fell with S39: the theme is `cyberpunk`, a new major. The showcase
question (R1) is closed: Kenny asked on 2026-09-07 whether a live site
existed for the Dribbble design he remembered; none does — the search
found the shot, the designer's two profiles and a Pinterest repin. The
three CSS projects recorded in `docs/legacy/CYBERPUNK_THEME_RESEARCH.md` show
the same button language and were consulted, not used.

**S46 · The concept demo is the gate for every new theme.** Kenny,
2026-09-07, while the Phase 0 follow-up was being written: the demo built
for cyberpunk ("Signal Yellow") is from now on the standard demo for
trying a new theme, or its concept, before it is integrated into the
project — same structure, same elements. So every theme proposal after
this one is first shown as that page: the navbar with a dropdown, the
hero with a headline, a lede carrying emphasis, and two buttons, a
section rule, a form, a dossier card, the tear, and the footer — and
Kenny approves the concept there before a token is written. This round
turns the demo into a template the next theme can be poured into; it
lands in the repository as part of the work, not as a scratch file.

**Amended at the Phase 2 gate, 2026-09-07.** Three of Kenny's ratings
change what the round is, and the scope says so here rather than drifting
under it.

**S47 · The token contract grows with the theme, and every theme follows
in the same change.** Kenny on TH115: "ik wil niks uit de demo verloren
zien gaan, dus indien nodig moeten er nieuwe tokens aangemaakt worden en
dan trekken we de rest gelijk met die nieuwe, dat doen we voortaan altijd
als het over nieuwe thema's of nieuwe componenten/elementen gaat." So the
81 are a floor, not a ceiling: when a theme, a component or an element
needs a token the contract does not have, the token is added to the
contract and every other theme declares it in the same change — the
parity gate stays at 100% at every commit. S44's "no change to the
81-token contract" is replaced by this.

**S48 · 5.0.0 lifts every theme, research first, synthwave next.** Kenny
on TH128: "Ik wil een grote 5.0.0 update maken, met vele thema's die onder
de loep worden genomen om alles next level te maken … Ik wil elk bestaand
thema verbeteren. Dan pas doen we v5.0.0." The order he set: a deep dive
across dribbble.com, behance.net, webflow.com and sites like them — every
aspect of every page: effects, buttons, transitions, menus, scroll
triggers — noting per reference which of the twenty-four themes it fits,
not only synthwave; the findings come to Kenny; synthwave is built first;
the next theme is chosen from the findings; and 5.0.0 ships only when
every existing theme has been through it. Research may run in parallel.
S43 ("synthwave after") and S45's "a round per theme after it" are
replaced: the rounds still happen one theme at a time, each with the
concept demo (S46) as its gate, but they all land in one major.

**TH117's dynamic notch.** Kenny: the navbar's notch sat on one side in
the demo; when the navbar sits on the other side of the screen, the
notch sits on the other side too. The geometry follows the placement.

**The findings form, answered 2026-09-07.** Kenny adopted all
twenty-four directions from `docs/RESEARCH_2026-09.md` — including the
five where the recommendation was to hold back (light, ticker, woodblock,
shade-dark, lapis), which now carry a second research pass before their
concept demo — and chose the order **by finding quality**. The order
and the directions live in `docs/LIFT_PLAN.md` (TH134).

**S46, sharpened 2026-09-07.** Every concept demo is reachable at a URL
Kenny can open in a browser, and the form that asks for his approval
names that URL — standing rule 39 applied to the demo. The round-six
demo is at
<https://claude.ai/code/artifact/f1cb3978-0bd7-4108-a329-971b0a2afe89>;
from TH126 on, the site serves `concept/<theme>.html`.

**S19, reversed 2026-09-07 (round six, Phase 3, T19).** The package
ships its font files. Kenny's decision at the gate, against the
recommendation to keep S19 with a tested fallback stack. The reason that
makes it the right call for his consumers: chassis-rs serves dashboards
under `font-src 'self'`, so a named-but-not-shipped face never renders
there. Licences per family (SIL OFL or equivalent), the manifest,
`SHA256SUMS`, a `css/fonts.css` and a size budget are Phase 4's to shape.

**S49 · An approved demo is implemented exactly.** (Kenny, 2026-09-08.)
The concept demo Kenny approved for a theme (S46) is the specification of
that theme's lift: every token, every element and every mechanism it
showed is carried into the package as shown. A test or a gate that reads
the demo as wrong — a contrast ratio, a design invariant, KT8's wash, a
fixture test on the pointer target or the focus ring — does not change
the implementation; it produces a finding that is put to Kenny, and only
his explicit approval changes a value the demo showed. Until he answers,
the deviation is not made and `main` does not move. What a demo could not
show (the dictionary's copy under KT5, the module's own hooks) is carried
by the package's mechanism with the demo's appearance; that, too, is
named in the ratification. The measured diff of the compare page (R6-Q4)
is the mechanical half; the rest is discipline (KT15).

## Round seven — hypertech, and a vocabulary for motion (opened 2026-09-11)

Kenny opened the round by asking for a new theme called **hypertech** with
"the full works" — not a colour scheme but high-tech effects over the whole
page and nearly every element — and, in the same breath, what that would
mean for the themes that are not so cool yet, naming pastel and asking for
cute animations there. Seven items were decided on the scope form of
2026-09-11. His answers are below, each with the measurement it rests on.
The ID shape is the house scheme; the S-series above is closed.

**scope-1 · Three candidates, judged on sight.** Measured first: all
twenty-five themes pin their accent to a single hue, and the obvious
hypertech colour is taken twice — blueprint at `hsl(190, 80%, 62%)` over
`hsl(215, 65%, 12%)` and shade-dark at `hsl(205, 72%, 60%)` over
`hsl(192, 100%, 11%)`. Rather than pick a direction in prose, three full
concept demos are built on one markup and Kenny chooses from the rendered
page: **A · Spectraal instrument** (an accent with no fixed hue, a
dichroic ramp driven by the pointer, instrument white on cold black),
**B · Schone kamer** (hypertech in the light: graphite hairlines, one
electric blue, feedback that is mechanical rather than luminous) and
**C · Dieptelaag** (layered glass over a drifting aurora, with depth on
the pointer — no theme in the package has depth today).

**scope-2 · A vocabulary for motion, not a routine per theme.** Round six
gave each theme one routine and no shared grammar. Instead, three hooks
join the six that exist — `react` (what happens under the pointer),
`commit` (the confirmation of a press or a submission) and `ambient` (the
page's idle life) — and every theme answers each of them in its own
language or says quiet with a reason, which `gates/check-hooks.mjs`
already enforces for the existing six. One shared piece of machinery makes
it affordable: a single rAF-throttled pointer listener publishing the
cursor position on the root, so no element carries a listener of its own.
Every theme changes behaviour, so this is **6.0.0**.

**scope-3 · All twenty-six arrive, and the overlay is repaired first.**
Measured on `themes/hooks.json`: four of the six hooks are answered with a
real rule by all twenty-five themes, `accent` is quiet in seven, and
`arrival` is quiet in **twenty-one** — only phantom, retro, terminal and
synthwave arrive at all. Before the other twenty-one get one, the overlay
those four share stops swallowing clicks: today only its Skip button ends
it, and a click anywhere else disappears without a sign.

**scope-4 · Pastel answers in its own language.** Not a generic set of
bounces shared between themes, but pastel's own risograph idiom extended:
the second ink layer it already springs on headings, carried onto buttons,
cards and fields, landing with a settle rather than a bounce.

**scope-5 · Every gesture defaults to on.** The project rule that every
feature is configurable with a default settles the knob; the choice was
which way it points. It points on: a theme named hypertech with its
effects off is not the theme, and all three consumers set a theme
explicitly, so nobody gets this by accident. The system preference for
reduced motion stays absolute above the knob.

**scope-6 · The four waiting rows come along.** Four rows in
`docs/MINI_ROUNDS.md` carried "at the next version" or "at the next
round": the arrival overlay, the destructive alert whose text is
unreadable in many themes, the theme picker that moves along the bar from
theme to theme, and synthwave's per-cell gradient in a table header. This
is that round, so all four are in it rather than shifting again.

**scope-7 · The compliance table is corrected.** Found while surveying the
motion machinery for this proposal: `docs/DESIGN_INVARIANTS.md` publishes
FAIL for twenty-four of twenty-five themes on the flash threshold while
the gate that measures it is green, because `gates/compliance.mjs` calls
the rating function without its third argument and every one-shot
animation is extrapolated as if it looped. Measured both ways over all
thirty-six animations: fourteen cross the threshold on the two-argument
call, all fourteen with exactly one cycle, and the verdict turns from FAIL
to pass with the argument passed.

**scope-8 · One ambient loop per theme.** (Kenny, 2026-09-11, on the first
cut of the candidates.) "We moeten zien dat we niet teveel tegelijk tonen
qua effecten." The pointer-driven haze and a band sweeping down the screen
were both running in candidate A, and together they read as noise rather
than as an instrument — his words: the pointer system is very good, the
line that occasionally crosses the screen is a bit irritating beside it.
So a theme gets one thing that moves on its own; everything else moves
because something happened. The band is gone from candidate A. Two things
he named as right are kept and extended: the colour transitions under the
pointer, and buttons styled in a way characteristic of the theme.

**scope-9 · A destructive control opens the theme's dialog.** (Kenny,
2026-09-11.) The demos were still showing the arm-then-act confirmation
of 3.x, which the package itself has not defaulted to since
`attachConfirmations` took `mode = 'dialog'` — `js/components.js:274`
builds a real `.kp-dialog.kp-confirm` with a title, a description and two
actions, and `data-kp-confirm-mode` chooses per element. His instruction
was to fix it for the future, so the concept demo now opens that dialog,
built in the package's own shape, and the theme styles it. The inventory
entry in `showcase/concept-demo.json` keeps its `data-kp-confirm` marker,
because the attribute is the same; what changed is what the attribute
does.

**The candidate chosen, 2026-09-11.** Kenny picked **A · Spectraal
instrument** — "de beste van de drie, maar het voelt nog altijd niet
hightech genoeg aan". The second cut answers that without adding a loop:
machined geometry (a cut corner on every control and panel), a data label
above a control that lights in the theme's own ramp, brackets around the
headline that report the box they hold, a character count per field, a
nav marker that follows the pointer, and a fixed instrument rail reading
six values the page measures about itself — pointer, viewport, scroll,
frame time, the live contrast of ink on ground, and the candidate. Every
one of the six was driven to at least two different values before it
shipped, per the standing rule that a status field which cannot be shown
to vary is decoration that lies; a field with no source prints two dashes
rather than a zero.

**scope-10 · The element list, answered 2026-09-11.** Kenny brought a
list of twenty-seven things he had seen elsewhere. Measured against the
code: twelve the package already has, six do not belong here with a
reason each, and nine were a real question. His answers: the collapsible
side navigation defaults to an **overlay** with the pushing variant as a
knob; a navigation that collapses on a narrow screen, a bar that stays at
the top, smooth scrolling with the offset that makes an anchor clear that
bar, a back-to-top control and a component for a hero image are all
**essential**; counters that count up are **wanted**; the three carousels
are **not done**, with a scrollable row offered instead; an icon set is
**later**, a round of its own. Two of the essentials are repairs rather
than features: the package contains zero occurrences of `sticky` and zero
of `scroll-behavior`, `scroll-padding` or `scroll-margin`, which is why
the skip link every page carries lands underneath any bar that stays put.

**scope-11 · Four themes leave the set.** Kenny, 2026-09-11: academia,
ticker and woodblock "mogen verwijderd worden, die hebben we alle drie
niet meer nodig vanaf nu", and mono "gaat eruit, niet meer nodig".
Twenty-one remain and hypertech makes twenty-two. This is the first time
this project removes a theme, and it sits against the rule that a
released theme never changes: 5.0.0 and 5.1.0 shipped all twenty-five, so
the removal is a change only a new major may make, which round seven
already is. What cannot be measured from inside this repository is
whether any consumer selects one of the four; the bundle every consumer
vendors will simply stop carrying them, so each consumer is told before
the tag rather than after.

**scope-12 · Every theme earns a quirk of its own.** Kenny, 2026-09-11,
naming the thing the whole round is actually about: what makes a theme
cool is behaviour that belongs to it, like nostromo's dot in front of the
active page. Measured the same day: the number of silhouettes a register
cuts does not predict whether he finds it distinctive — terminal and
brutalism cut none and he calls both very good, solstice cuts ten and he
calls it sober. So the pass is about behaviour rather than decoration.
The per-theme verdicts, the measurements behind them and the three
observations that turned out differently than expected are in
[THEME_VERDICTS.md](archive/THEME_VERDICTS.md).

**scope-13 · Six worlds refused, and what that says.** Kenny saw three
concept worlds on 2026-09-11, called the spectral instrument the best but
not hightech enough, then saw three more — a lithography bay, a detector
screen, an interferometer — and refused all three. Six proposals, none
chosen. What he wrote about instead, every single time, was the shape of
a control: the buttons and the form fields in one, the mirrored round end
in another, the doubled layer and the ghost button in the third. And the
fallback he named himself is a **ground colour**, not a world.

Two rounds in which the world did nothing and the shape did everything is
a pattern, so the round stops leading with worlds. His answer on
2026-09-11 was **"allemaal"**: three more worlds were built (Cherenkov,
the light over a reactor pool, lit from below; Titanium, anodised metal
over carbon weave, where the shifting colour is an oxide film and has a
cause; and the command table, where a panel stands on a surface rather
than lying on a page) and beside them a page that strips the world away
entirely — the same button, field and card cut six different ways on one
ground, in one typeface, with one accent, so the silhouette is the only
variable left. Worlds: <https://claude.ai/code/artifact/c1e977c6-bab9-434f-90ea-6f3047ca6e2e>.
Shapes: <https://claude.ai/code/artifact/e7a287f1-2b9c-4758-a81d-07b997e9f180>.

**scope-14 · The fallback is the spectral instrument.** Kenny, 2026-09-11,
resolving his own "de allereerste (die met donkerblauwe achtergrond)",
which pointed at two different candidates: the spectral instrument was
first in order on `hsl(220 16% 5%)`, the deep layer was third but was the
only one on a genuinely blue ground at `hsl(234 34% 7%)`. He meant the
first. It is restored beside the three new worlds so they can be judged
against it rather than from memory, in the state he last saw it — the
second cut, with the scanning band gone, the machined corners, the data
label and the dialog.

**scope-15 · Whether hypertech absorbs dark is deferred.** Kenny,
2026-09-11: "beslissen we later, na de volgende ronde." Nothing about the
merge is built or assumed meanwhile; dark keeps its name, loses its stars
as already decided, and the question of whether a neutral dark theme and
the loudest theme in the set can be one theme is left standing rather
than answered by default.

**scope-16 · The spectral instrument becomes dark.** Kenny, 2026-09-11:
"Spectral instrument wordt de nieuwe dark en vervangt deze vanaf nu
helemaal." So the fallback is not a fallback any more — it is the answer
to what dark should be, and it replaces dark outright rather than sitting
beside it. This also settles `scope-15`'s deferred merge question in the
one direction nobody had proposed: dark keeps its name and loses
everything else, including the stars that were already going.

**scope-17 · Titanium becomes a theme of its own.** Kenny, 2026-09-11:
"Titanium wordt een nieuw thema op zichzelf, het is heel mooi." Anodised
metal over carbon weave, where the shifting blue-violet on every edge is
an oxide film rather than a gradient, and where a press takes sixty
milliseconds and runs linear because metal does not ease. What it is
called is the one thing still open — the round set out to build a theme
named hypertech, and this is the theme that round produced.

**scope-18 · Two pieces of the command table survive it.** Kenny,
2026-09-11: the command table as a whole is "te veel zoals blueprint" and
does not become a theme — but its measurement frame, the brackets that
report the box they hold in pixels, is better than the one blueprint has
and **replaces it**. His words: "dan is de demo hier niet voor niks
geweest."

**scope-19 · Cherenkov is not a theme; its gesture is placed.** Kenny,
2026-09-11: good ideas, especially the destructive button with the short
visible bar that expands under the pointer, and the shape of the buttons.
His question — whether it could be applied in another theme — is answered
in the placement item below.

**scope-20 · The chamfer is not crowded, which changes the question.**
Kenny assumed the milled corner was already used a few times and asked
whether some of those should be replaced. Measured on 2026-09-11 across
all twenty-five registers: `clip-path: polygon` appears in six of them,
and thirty-one of the thirty-nine uses are cyberpunk's own notch system.
Of the rest, blueprint has one chamfer (on `.kp-button--mirror`, cut from
`--kp-chamfer`), and every other polygon in the package is a **tear or a
divider** — forest's contour, pastel's torn edges, phantom's slashes,
synthwave's bands — not a control silhouette. So the milled corner exists
twice, once of which is the theme he calls perfect, and there is no crowd
to thin out. The field of control silhouettes is nearly empty, which is
why the four shapes he liked all have somewhere to go.

**scope-21 · The new theme is called titanium.** Kenny, 2026-09-11. The
round opened asking for a theme named hypertech and closes with one named
after its material, which is how every theme in this package is named:
retro is the desktop, terminal is the tube, blueprint is the drawing,
woodblock is the technique, lapis is the stone, nostromo is the ship,
pastel is the ink. Not one is named after a category — and a category was
the starting point that cost six refused worlds, because the first
proposal was defined by the empty place on the colour wheel and it showed.
"Hypertech" stays what it always was: the question the round opened with,
not its answer.

**scope-22 · The four placements are shown before they are approved.**
Kenny, 2026-09-11, answering the placement proposal with "toon het mij" —
the same answer he has given to every proposal made in prose this round,
and by now the clearest standing preference in it. Each of the four is
rendered in the real colours and faces of the theme it would go to, read
out of that theme's own `tokens.json`, with the control as it is today
beside the control with the shape on it and nothing else changed between
them: <https://claude.ai/code/artifact/d4ffceb8-a346-41ab-998c-a31509d15ae6>.
The proposals are the doubled edge to pastel as its second ink plate,
cherenkov's under-lighting and expanding bar to solstice in amber, the
moulded step to nostromo, and the rule that becomes an edge to grotesk.

**scope-23 · Two placements approved, two sent back.** Kenny,
2026-09-11, looking at the rendered pairs. **Nostromo and grotesk are
approved** as shown. **Solstice is the right theme but the wrong
drawing**: the expanding line was a straight bar across the bottom of a
button whose bottom is round, so it hung over the corners, and the filled
button had no gesture at all. Rebuilt so the line *is* the button's own
outline — it inherits the radius and opens from a short piece under the
middle to the whole edge, so it cannot miss the shape — and the filled
button now carries the same line cut out of its own plate in the ink
colour, inverted rather than absent. **Pastel is not a match for the
doubled edge**: a thin outline is a technical gesture and that theme is
not technical. Three alternatives are shown instead, each leaning on
something pastel already declares — the sticker, the squish, and the
second ink clicking into register — at
<https://claude.ai/code/artifact/d4ffceb8-a346-41ab-998c-a31509d15ae6>.

**scope-24 · The four placements are settled.** Kenny, 2026-09-11.
Pastel takes **the sticker**: a flat offset shadow instead of a blurred
one, a lift and a nudge under the pointer, pressed completely flat when
it is used — because a riso print ends up on paper as a sticker, and
because the overshoot it springs on is the easing the theme already
declares. Solstice takes **the expanding line**, second cut, approved on
both objections. Nostromo takes **the moulded step** and grotesk **the
rule that becomes an edge**, both approved as first shown. The doubled
edge, which pastel refused, stays in the demo as a shape without a home;
a thin outline is a technical gesture and no theme in this round is
asking for one.

**scope-25 · Four of the five quirks are approved; lapis comes back.**
Kenny, 2026-09-11. **high-contrast** takes the flip — a control turns
into its own negative with no transition at all, because a theme whose
own sentence says "nothing in between" should not fade, and the signal
yellow exists only in the instant something is pressed. **sepia** takes
the ink spreading into the paper on a press and the rule that is thickest
in the middle. **shade-light and shade-dark** take the one mechanism that
finally makes them a pair: the pointer is the light, and the light half
throws its shade away from it while the dark half is lifted out of shade
by it. **lapis is not approved** and gets a second idea before anything
is built; the gold leaf catching the light was the one proposal of the
five that did not land.

**scope-26 · The build begins, repairs first.** Kenny, 2026-09-11. The
order is his: the six essential pieces from the element list, then the
themes, then the removal of the four. The reason it was worth choosing
rather than letting happen is that removing four themes is the only part
of this round that cannot be undone without rolling back a version, and
it touches every consumer that vendors the bundle. Put last, everything
before it has already run.

**scope-27 · Lapis takes the fourfold ruling.** Kenny, 2026-09-11,
against the recommendation, which is what a form is for. A page of tazhib
is ruled before anything is written on it — concentric lines at unequal
intervals, gold against blue, and what matters sits inside them — so the
frame of a control is not one line but four, and touching it adds the
outermost. The ruling closes around the word instead of a colour
changing. With it, all ten themes that needed a quirk have one.

**scope-28 · A theme may write its own state.** Kenny, 2026-09-12,
answering the pressed-state collision with "Het thema zet zijn eigen
indruk". The derived states (`-hover`, `-active`, `-disabled`) stay the
default for every surface of every theme; a theme that writes one itself
has the last word, exactly as it already did for `--link`. Recorded in
`themes/known-asymmetry.json` for the four names two themes now write,
with the measurement behind each.

The reason is at the ends of the lightness scale rather than in any
theme: one step off a 93% signal barely moves, so a rule that serves
twenty-four themes well cannot serve the twenty-fifth at all. S47 already
says the token contract is a floor and not a ceiling; this says the same
of the derivation.

## Round eight — the working method itself (opened 2026-09-13)

Kenny's brief of 2026-09-13 put the process under review rather than a
theme. Sixteen decisions from one form; the measurements they rest on are
in the session of that date (180 commits since v4.0.0, 90 touching
`css/` or `themes/` and 90 not; 1,371 tests of which 217 in the register
specs assert appearance; 887 gate runs and 137 whole-suite runs in one
transcript; CLAUDE.md at 447 lines). Every decision below is
**kp-themes only** unless it says otherwise; a wish that touches
`~/Projects/dev-procedure` or a user-level hook is a separate item with its
own go.

**scope-29 · The order.** Layer 1 the small machine (this file's
neighbours: CLAUDE.md slimmed, the lexicon, the status line, the cycle
written down), layer 2 the catalogue with its developer overlay, layer 3
tests, tags, gates, drift and purge, research in the background from
layer 1 on, content rounds last.

**scope-30 · The short route is the route.** Bouwen → Kijken → Uitrol,
written out in `docs/CYCLE.md`. The route exists in PROCEDURE.md since
2026-09-09; this project takes it. Versions stay: a released theme never
changes in place.

**scope-31 · One fixed catalogue.** `catalogue/`, hand-written HTML per
component: every variant, state and extreme, a "Kijk naar:" text beside
each block, a theme switcher, the ten example pages as fixed pages. A
gate compares the classes `components.css` defines with the classes the
catalogue shows and refuses a component nobody can see. Nothing else is
generated but CSS and JS. The same folder is the website.

**scope-32 · Appearance goes to the page.** The 217 register tests are
removed as their catalogue blocks arrive. Invisible behaviour and
cross-product sweeps stay tests.

**scope-33 · Tags decide what runs.** Every test carries
`@component:<name>`, `@theme:<name>` or `@sweep`; `tests/tags.json` maps
file → tag; three gradations (building · commit · release); the map is
measured once against what it skips. Replaces `test:affected`.

**scope-34 · The gates get a table.** Per gate what it caught and how
often; Kenny decides per gate in a form. No gate leaves unseen.

**scope-35 · Drift: derive, fewer documents, a source-hash gate.** A
document declares which files it describes; the gate refuses a commit
where a source changed and the document was not looked at. Not
infallible, and said so.

**scope-36 · Purge per document.** One proposal line per document —
keep, to the site, archive, remove — and Kenny decides per document.

**scope-37 · CLAUDE.md carries status and commands.** The rules moved to
`docs/RULES.md`, the cycle to `docs/CYCLE.md`; the document index stays
because `gates/gates.test.mjs` reads it.

**scope-38 · Three agents, invoked by the step, never by Kenny.**
`researcher`, `theme-builder`, `checker` in `.claude/agents/`, each with
a "use proactively" description and only its tools. Kenny's words: "ik ga
niet micromanagen".

**scope-39 · A lexicon with a hook.** One word list, read by the form
linter and by a Stop hook on every reply. The hook lives in a user-level
file, so its scope is a separate item (global or marker-scoped).

**scope-40 · One session, research in the background.** Bouwen overlaps
with Kijken: Claude builds batch N+1 while Kenny looks at batch N.

**scope-41 · Three research streams started 2026-09-13.** Navbar and
component alternatives, futuristic layouts, per-theme loading — each a
`researcher` in its own worktree.

**scope-42 · The developer overlay.** Colour-and-token under the cursor,
an animation timeline (measured feasible: `document.getAnimations()`
pauses and scrubs CSS transitions), a ruler; one `catalogue/devtools.js`.

**scope-43 · The status line.** Four fields at the top of every reply
(step · busy with · tests · gates). Enforcing it with the Stop hook is a
user-level change and a separate item.

**scope-44 · Worktrees for parallel streams.** Background agents work in
their own worktree. Screenshots, Claude in Chrome and plan mode were
offered and not taken.

**The research-and-catalogue form, 2026-09-13.** Seven answers. They were
given before the five review pages were reachable (`fix-19`), so the four
that rest on looking — `scope-47`, `scope-48`, `scope-49` and `scope-51` —
are put to Kenny once more now that the pages open.

**scope-45 · The slim rail keeps its names.** A label in a collapsed rail
leaves the eye and stays in the accessibility tree; the other four navbar
findings wait for the navigation work. Test first:
`tests/sidenav.spec.mjs` "a rail that hides its words still says them to a
screen reader", red on the old rule (expected "Reports", received "").

**scope-46 · The four orphan registers go.** `academia`, `mono`, `ticker`
and `woodblock` minified registers and their maps are removed from
`dist/css/`; no gate is added.

**scope-47 · The catalogue's Look at notes stay English**, like the rest of
the repository.

**scope-48 · Navigation: all four.** The app shell (bar, rail and
breadcrumb together, with a declared slim toggle), the command palette as
navigation (a visible trigger, an option that is a link), the mega menu (a
click-opened disclosure every register answers) and the shrinking header
(after the three registers that bypass `--kp-nav-pad-block` are fixed).

**scope-49 · Futuristic layouts: all four.** HUD brackets as a hook, the
dispatch console, the LCARS elbow frame (with its colour trio on every
theme in the same change) and the case file with its pinboard.

**scope-50 · Loading: shared stylesheets and a lazily fetched register.**
First paint from 1,320,113 to 371,900 bytes; the JavaScript split follows
as its own step.

**scope-51 · The catalogue page shape is approved** for the remaining
components.

**scope-52 · The catalogue is reviewed in the reviewer's own browser, with
notes kept per theme.** Kenny, 2026-09-13, after opening the pages through
`npm run catalogue`: *"goede start, zeker de navbar demo is al heel goed"*,
and the four answers that rest on looking stand. Three additions, trial
rather than final by his own words. Every page carries the package's own
side navigation over every review page, built by `catalogue/catalogue.js`
from one list the catalogue gate compares against the pages on disk. The
tables page gains a data table (search, sort, select, pager, cards). And
under every block a note field keeps a note per theme in the browser;
switching theme swaps the note, and the foot of the page gathers every
note of every theme into one prompt with a copy button.

**scope-53 · One review page, approval by what the browser paints, and a
compare page.** Kenny, 2026-09-13: every component on one long page so
there is one prompt, a filter that shows only what changed, and two themes
side by side with every element starting at the same height. The review
page (`catalogue/index.html`) gathers the blocks of every component page at
load, so each block is still written in one place. Approval is per block
per theme: the browser hashes the block's markup as written plus the
computed style of every element in it, over properties that do not depend
on the window's width, with animations held still while it reads; the hash
is kept in that browser and a block whose hash moves shows as changed.
Measured before trusting it: stable across a reload, all 13 blocks; a
letter-spacing change to `.kp-button` in cyberpunk marked the six button
blocks and exactly the two table blocks that contain buttons, and reverting
it approved all 13 again. The compare page (`catalogue/compare.html`) puts
each theme in its own document — a theme nested in another leaks its
register (`gap-10`) — and lines the rows up across the two by message:
32 rows, none offset, before and after switching one column to brutalism.

**The nostromo notes form, 2026-09-13.** Kenny's first full pass through
one theme proved the review page; his 23 notes were answered in one form.

**scope-54 · A drawn select, on request.** `data-kp-select` on a
`<select>` lays a listbox in the combobox's style over it, built on
`js/listbox.js`; a select without the attribute stays native, so no
consumer's form changes unasked. Firefox cannot style a native select's
list, which is why the note arose.

**scope-55 · Badges rounder in nostromo only, for now.** Measured over 22
themes: 8 pill, 7 small corner, 7 square. Kenny keeps the others for when
he reaches them on the review page.

**scope-56 · The palette matches literally by default.** `substring`
becomes the default; "read" no longer finds "Report an incident", and
"thm" no longer finds "Theme". Subsequence stays available per palette.

**scope-57 · A marked accelerator letter never splits its label.** The
package keeps `[data-kp-key]` in the button's text run in every theme.

**scope-58 · A composition uses the styled components.** Every component
is judged on its own block before it appears in a composition, and a
catalogue composition carries the package's component wherever one exists
(no bare date input outside a date picker); the catalogue gate refuses a
bare control. Kenny's words: "elke component in een compositie moet het
gestylede element zijn."

**scope-59 · Nostromo's bar is put right**: readability of the site mark,
the size and line of the current item, and the collapsed bar's spacing,
without holding it to the concept demo first (Kenny: "Gewoon rechtzetten").

**scope-60 · The direct fixes from the notes are approved**: progress label
and fill shape, toast severity colours, the dialog title's distance from its
close button, no dot on the current page in pagination, inner spacing in the
wizard and the laurels, a theme menu scrollbar that follows its corners,
adding a tag in the tag combobox, and dragging a reorder item across any
number of rows.

**scope-61 · Only retro underlines the accelerator letter.** Kenny,
2026-09-13, after asking whether every theme should: it stays retro's alone,
as decided on 2026-09-12. Every theme keeps a marked label whole (scope-57).

**scope-62 · The drawn select is the default.** Kenny, 2026-09-13, after
asking why a field page showed two selects: every single `select.kp-field__input`
gets the drawn list without opting in; `data-kp-select="native"` keeps the
browser's own, and a `multiple` select always does. This replaces the opt-in
half of scope-54; consumers see it on their next update, which raises the
version as every change does.

**scope-63 · Grotesk hovers by inverting.** Kenny, 2026-09-13, on
`research/grotesk-hover/demo.html`: option B. A primary or destructive button
turns to the page ground with its label in its colour on hover and on keyboard
focus, not while pressed; a bare mirror button takes the grey wash.

**scope-64 · The data table's bars sit inset.** Kenny, 2026-09-13, on the data
table demo's footer block: "Bars inset". The search bar and the status-and-pager
bar carry inline and block padding by default, as a knob.

**scope-65 · A research demo is judged like a component.** Kenny, 2026-09-13:
the Approve and Not approved buttons "moeten er altijd staan en functioneel zijn
als het over approvals gaat". Every block of a research demo carries them, with
the same hash-kept verdicts as the review page; and a copied prompt is not
repeated in the next one.

**scope-66 · All seven data table features, now.** Kenny, 2026-09-13, form item
datatable-build: "Alle zeven, nu". Multi-sort, column choice, row expansion, a
fixed first column, server rows, inline editing and arrow-key cell navigation
enter `.kp-datatable` in both channels. The last two reverse the "left out"
of the data table form earlier that day. The filter design (panel or
"+ Add filter") is not part of this; it waits for his look at the demo.

**scope-67 · The review site is published under /review/.** Kenny, 2026-09-13,
form item pages-review: "Publiceren onder /review/". The Pages workflow
assembles the documentation from main and the catalogue with the research
demos from round-six; Claude pushes round-six whenever it asks Kenny to look.
Kenny's own answer on grotesk's pressed button waits until he has seen it
there ("eerst zien op github pages").

**scope-68 · Verdicts live in a register in the repository.** Kenny, 2026-09-13,
form item verdict-ledger: "Register in de repository", after asking whether his
judgements are kept for good ("dit mag nooit veranderen door een change").
`catalogue/verdicts.json` holds every verdict with the hash and the commit it
was given on; Claude records each pasted prompt and commits it; the hash recipe
carries a version, and a gate refuses a recipe change until every entry is
re-hashed on its own commit. A verdict only returns when the component itself
looks different. Item verdict-import: "Terugzetten wat niet veranderde" — the
131 verdicts of that day are restored where the block hashes alike at the
commit they were given on and at the current one.
Added the same day: verdicts are per browser engine as well — "er moet ook een
verschil zijn tussen firedragon en chrome approved, dat zijn afzonderlijke
testen". A block approved in Firefox is still to be judged in Chromium.

**scope-69 · Every form says how long the step took, measured.** Kenny,
2026-09-13, form item step-timing: "Alleen kp-themes, eerst". Each form carries
an item `step-timing · …`: the time from his last message to the form, the
longest tool calls and agents with their durations, the rest as Claude's own
thinking and writing, one line of why per long part (or "niet vastgesteld")
and what would shorten it, with Akkoord / Niet akkoord. The figures come from
`~/Projects/dev-procedure/hooks/step-timing.py`, which reads the session
transcript; `hooks/form-lint.py` refuses a form without the item wherever a
CLAUDE.md carries `step-timing: required`. Only kp-themes carries it; after
round eight Claude asks whether other projects should.

**scope-70 · Both filter designs, chosen per table.** Kenny, 2026-09-14, form
item filter-design: "Allebei, per tabel". "+ Add filter" joins the filter panel
in `.kp-datatable`; a table picks it with an attribute, the panel stays the
default.

**scope-71 · Grotesk keeps B, with a black label while pressed.** Kenny,
2026-09-14, form item grotesk-hover. Option E stays a demo option.

**scope-72 · Every reference carries its link, to the block.** Kenny,
2026-09-14: "je kan toch altijd links geven als je naar iets refereert. Vaak kan
een anchorlink zelfs … Zie dat de catalogus dit ondersteunt. Doe dit vanaf nu."
Forms and replies link every page they mention, with an anchor to the block;
a catalogue page keeps and scrolls to a linked block even when it is judged.

**scope-73 · Which appearance tests leave, and when.** Kenny, 2026-09-14,
the tests form, on the inventory of that day (1612 tests per engine: 721
behaviour, 319 sweeps, 315 appearance with a catalogue block, 68 appearance
without one, 189 mixed). tests-register: the 98 appearance-only register tests
go, mixed tests stay whole. tests-other: all 217 appearance tests outside the
registers go, the 169 that loop all themes included, and
`tests/data-surfaces.spec.mjs` with them. tests-no-block: a catalogue page
"Page effects" gets the missing blocks first, the ten example pages join the
catalogue navigation, and only then do the 68 go. step-timing: a catalogue
test waits for the page's reading to finish by default.

**scope-74 · After the test waves.** Kenny, 2026-09-14: filter-editor-title
"Gewone tekst, zoals nu" — the add-filter editor's title stays a paragraph,
the deviation from the mock is written in the user guide. density-compact
"Compact overal krapper" — compact density must be measurably tighter in all
22 themes, not only in formal, light, forest and high-contrast. step-timing
"Akkoord" — the timing script counts time waiting on agents apart, work is
split per file so agents run side by side, and whether one `generate:all`
suffices is measured. Measured the same day: each run takes 8 s, and after
an unformatted source edit the second run still rewrites a minified source
map, because `generate:all` ends with prettier over the sources the first run
had already read; two runs stay, or prettier on the changed sources first.

**scope-75 · The commit level runs by hand, before every report.** Kenny,
2026-09-14, form item commit-level: "Handmatig, voor elk verslag". The commit
hook stays gates only; Claude or the checker agent runs
`npm run test:tags -- --level commit` (measured: the 353 sweeps take 149 s in
firefox) before every report to Kenny, and the status line names the result.
step-timing "Akkoord": the status row is committed with the work it describes,
never in a commit of its own.

**scope-76 · Every gate judged once.** Kenny, 2026-09-14, the gates form of
`scope-34`, one item per gate on the table of that day (39 gates, 18.5 s per
commit, 18 recorded catches over 13 gates). All 39 answers follow the
recommendation. Kept as blocking: 29. Merged, the check survives inside its
target and blocks there: tokens into `npm test`, bundle into `check:min`,
migration into `check:docs-runnable`, fonts-css into `check:fonts`, tear into
`check:generated`, package into `check:manifest`. Moved to `npm run advice`,
printed but never refusing a commit: variant-ground, compliance, baseline and
prettier. Removed: none. step-timing "Akkoord": after the change Claude
measures the new duration of `npm run gates`.

**scope-77 · One decision per document.** Kenny, 2026-09-14, the documents form of `scope-36`, on the table of that day (71 tracked Markdown files; 46 judged, the 22 theme stories and 3 agent definitions left out as sources). Kept: 26. To the site: `docs/LAYOUT.md`, its prose and defaults now in the comments of `css/layout.css` that the layout page renders. Archived under `docs/archive/`, out of the document index, the path and privacy gates and the npm package: 18, among them `docs/ARCHITECTURE_DECISIONS.md` against the recommendation to keep it, so the ID gate no longer reads its IDs. Removed: `HANDOFF.md`. worktrees "Verwijderen": the 22 old agent worktrees are deleted. step-timing "Akkoord": the drift gate of `scope-35` follows for the documents that stayed.

**scope-78 · The drift gate blocks, on the narrower sources.** Kenny,
2026-09-14, the drift form of `scope-35`, on a replay of the last 100 commits
(28 would have stopped with the sources first derived, 22 with the narrower
ones; 10 and 6 of the last 30). drift-mode "Blokkerend": `check:drift` runs
in `npm run gates` and the commit hook, and leaves `npm run advice`. Fifteen
documents take the narrower sources — most leave `package.json` out, several
follow a module's `.d.ts` instead of its implementation — and
`docs/UTILITIES.md` keeps its one source. The gate is not infallible and says
so: touching a document counts as looked at. step-timing "Akkoord": agents
whose work does not overlap start together, and the tests run while they
work.

**scope-79 · After layer 3: uniform sizes are measured first, navigation starts.**
Kenny, 2026-09-14, the next-round form. control-height, his own answer:
not one control's height but whether every element can keep nearly the
same size and layout when the theme changes — options on a demo page,
comparing the themes with the largest elements against the smallest, with
the median theme as control. A researcher measures every component's box in
all 22 themes first and builds that demo; nothing in `css/` changes until he
has looked. next-round "Navigatie": `scope-48` starts in two waves. The
first builds the application shell (bar, rail and breadcrumb composed, a
declared slim toggle) and the command palette as navigation (a visible
trigger in the bar, an option that is a link) side by side; the second the
mega menu and the shrinking header, after the three registers that set the
bar's padding directly read `--kp-nav-pad-block`. step-timing "Akkoord":
work that does not overlap starts together.

**scope-80 · Wave 1 judged: E then B, per-theme search trigger, an off-canvas
rail, and the catalogue notes of 2026-09-14.** Kenny, 2026-09-14, the wave-1
form. uniform-size "E, daarna B": control and row heights plus one line
height are fixed in the package first, in all 22 themes; B (headings, labels
and navigation as tokens a register may not override, with a gate) follows as
its own round after he judges E. search-voice "Per thema": each register
draws `.kp-nav__search-trigger` in the voice of its own nav links.
shell-narrow "Uitschuifpaneel": below a breakpoint the shell's rail becomes the
existing `over` panel opened from the bar, and on wide screens the rail runs
to the bottom of the window. fix-27 "Aanpassen", without a text: asked again.
artifacts, his own answer: whether the unlinked ones can be archived and
whether that touches the limit of five; answered in the next form.
step-timing, his own answer: "akkoord", and from now on step durations are
written in minutes and seconds, and in hours past sixty minutes. The notes of
his catalogue prompt of the same day become work: the add-filter editor's
Cancel brackets overlap its label (dark); a sixty-character bar label wraps
over the line above; a click outside the search palette closes it; cyberpunk's
button variants animate unevenly and the animation colour must differ from
the ground; terminal's cursor sits at the text's height and is red on the
destructive button; phantom's primary gets a press animation like the others;
retro's accelerator appears on every button; titanium's primary shows a
visible hover. 156 verdicts recorded in `catalogue/verdicts.json`.

**scope-81 · Decided research demos move to an archive group.** Kenny,
2026-09-14: a research demo that has served its purpose stays reachable but
moves to its own group in the catalogue navigation, so the navigation shows
which demos he still has to look at. All seven demos of the day have their
decision taken — navigation (`scope-48`), futuristic layouts (`scope-49`),
loading (`scope-50`), data tables (built), grotesk hover (option B),
control heights (superseded by uniform sizes) and uniform sizes (`scope-80`)
— and sit under "Archived research". A new demo goes in a "Research to look
at" group above it and moves down once he has decided.

**scope-82 · A new theme keeps the median's sizes.** Kenny, 2026-09-14:
"nieuwe thema's blijven zo dicht mogelijk bij de maten van de mediaan zodat we
geen nieuwe drift veroorzaken in sizes van elementen." Written as a rule in
`docs/RULES.md`: a new theme's type sizes, paddings and gaps stay as close as
possible to the median theme's, and its size index is measured with
`research/uniform-size/` and reported in its integration form.

**scope-83 · The questions after the catalogue notes.** Kenny, 2026-09-14.
fix-27 "Zoals voorgesteld": a bar menu that has no room on the right opens
to the left, measured in all 22 themes by a test that fails first. fix-28
"Klopt": the package gives its unset controls the theme's font, and
`verdicts.mjs record` compares a recorded hash with the test browser's.
retro-accelerator "Alleen het teken": the underline only, no working
shortcut; buttons with an icon before the label get it too. terminal-primary-
cursor "Tekstkleur van de knop": the cursor on terminal's primary takes the
button's ink. e-scope "Met B": tabs, badges and navigation links wait for
option B's round. artifacts "Bewaren, dan verwijderen": the 17 artifacts no
file links are saved under `docs/archive/artifacts/`, then deleted.
step-timing "Akkoord", with a wish for later: the timing item names what each
agent worked on, beside its duration.

**scope-84 · A page to inspect the theme intros, and intro words per theme.**
Kenny, 2026-09-15: a catalogue page where the intro screens some themes have
can be inspected, played at a chosen speed with a slider; and the intro texts
must match their theme ("Cyberpunk teksten passen niet bij een blueprint").
Today four themes perform an arrival (`--kp-arrival`): synthwave, terminal
and retro `boot`, phantom `card`. Retro and terminal carry their own lines in
`arrivalLinesByTheme`; synthwave's boot shows the shared `arrivalLine`
"▶ Calibrating neural uplink" with "Progress" and "OK". Every theme that
performs an arrival gets words of its own world, proposed by Claude and
judged by Kenny on the new page; a theme without its own words shows none of
another theme's.

**scope-85 · After the intro inspector.** Kenny, 2026-09-15, the review-and-
intros form. fix-29 "Klopt". mega-headings "Via de review-site": judged per
theme in his next catalogue prompt. sticky-shrink "De helft": a compact bar
keeps half of its own block padding. control-font "Alleen de familie": as
built. button-text "Beschrijven": `.kp-button__text` is documented public
API. hc-scrolled "Aansluiten": high-contrast's scrolled-bar rule answers
`data-kp-nav-compact`. step-timing "Akkoord". intro-words, his questions:
what "Words now" and "On screen" mean; whether these are all the intros
(cyberpunk seemed to have one); and whether an intro can make sure every
resource (.css, .js) has loaded, or whether those load too fast to matter —
measured by a researcher before anything changes. intro-verdict-theme, his
question: what a block is here — asked again in plain words.

**scope-86 · Intros stay on their timers; the headline reveal waits for the
intro.** Kenny, 2026-09-15, the intros-and-loading form, on
`research/intro-loading/` (192 loads). intro-loading "A": an intro does not
wait for stylesheets, scripts or fonts; on a fast or warm load everything is
ready within 0.32 s, and the slow cold case stays as measured. The research
demo moves to "Archived research" (`scope-81`). reveal-under-intro "Na de
intro": in synthwave, terminal, retro and phantom the headline reveal starts
once the arrival has gone, so a first visit sees it. intro-verdict-theme "Het
thema van de intro": on `catalogue/intros.html` each block records its verdict
under its own theme, whatever the page wears, and shows that theme beside its
buttons. bar-sticky-look "Nog niet gekeken": asked again. step-timing
"Akkoord".

**scope-87 · Option B starts; the futuristic layouts are dropped.** Kenny,
2026-09-15, the next-round form. next-round "Optie B": the round of
`scope-80` begins — headings, labels, tabs, badges and navigation links take
package sizes a register may not override (e-scope "Met B" of `scope-83`), and
`gates/box-metrics.test.mjs` refuses a register that sets them. His remark:
"futuristische layouts gaan we volledig schrappen" — `scope-49` (HUD
brackets, dispatch console, LCARS elbow frame, case file) is withdrawn and
nothing of it is built; `research/futuristic/` stays under "Archived research"
as the record of what was considered.

**scope-88 · Option B's open questions.** Kenny, 2026-09-15, the option B
form (commit `7c707d54`). combobox-flip "Klopt": `fix-30` is approved as
proposed — every overlay raised into the top layer opens upward when there is
too little room below and more above, with a capped, scrolling list when
neither side has room; the same run covers `.kp-nav__link--cta`,
`.kp-field__error` and `.kp-sidenav__title` with package sizes. solstice-hero
"De pakketmaat houden": solstice's hero headline keeps the package's
`--kp-text-display` (48px at 1920px wide, where it was 168px); no `MAY_KEEP`
exception. trail-numerals "Cijfers van gelijke breedte houden": light,
shade-light and pastel keep `font-variant-numeric: tabular-nums` on the
breadcrumb and the pagination. step-timing "Akkoord".

**scope-89 · The solstice review's answers.** Kenny, 2026-09-15, the solstice
review form (commit `1b9c72bd`). marquee-frozen "Klopt": `fix-31` approved.
sticky-slivers "Klopt": `fix-32` approved. datepicker-jump "Titel opent een
raster": a click on the calendar's month title opens a grid of twelve months,
a second click a grid of years (twelve at a time), keyboard reachable, in both
channels and every theme. review-dialog, his own answer: "Build a demo" of a
large review dialog of fixed size that opens a block, where every new item
focuses the comment input so he can type freely; Left and Right move between
blocks, Up approves, Down rejects; Backspace stays text correction. Rejecting
works only when the input holds text — and from now on that holds for every
rejection on every review surface, not only in the dialog. combobox-test
"Klopt": `tests/combobox.spec.mjs` checks "against the input on the side it
took" (`fix-30`). retro-cta-press "Dezelfde uitzondering als de knop": retro's
pressed call to action steps one pixel down again, with a `MAY_KEEP` entry and
its reason. step-timing "Akkoord".

**scope-90 · The review dialog, the month grid and the header's reach.**
Kenny, 2026-09-15, the form after `scope-89` (commit `c3c48b50`).
review-arrows "b · Alleen bij een leeg veld": the review dialog is built on
the review page and the component pages; Left and Right move between blocks
only while the note is empty, and move the caret once it holds text; Up
approves, Down rejects with a note. review-approve-text "Wissen, zoals nu": an
approval clears the note, as `fix-29` has it, in the dialog too. review-last
"Open laten met melding": after the last block without a verdict the dialog
stays open with a message. month-names "Korte namen": the month grid keeps
short names, the full name for screen readers. month-ellipse "Een pil": in
formal and sepia a chosen month or year is a pill, not a stretched circle.
frozen-calendars "Bijwerken": the still calendars in `#open`, `#limits` and
`#locale` take the markup the module builds now. six-rows "Laten zoals nu":
no change. caption-reach "Alleen bij scrollen": the header's 2px reach
(`fix-32`) shows only while the scroll box is scrolled. step-timing "Akkoord".

**scope-91 · The review dialog stays on the review pages.** Kenny,
2026-09-15, the form after `scope-90` (commit `a2c30166`). dialog-research
"Alleen review-site en componentpagina's": research demos, the intro page and
the compare columns get no review dialog. step-timing "Akkoord".

**scope-92 · The catalogue review comes first.** Kenny, 2026-09-15, the
next-step form (commit `bec8bb07`). next-step "Eerst de catalogusreview":
nothing new starts; Kenny reviews the returned blocks in the review dialog,
and the JavaScript split of `scope-50` waits. step-timing "Akkoord".

**scope-93 · The light-theme review's answers.** Kenny, 2026-09-15, the
light-theme review form (commit `957e79ac`). redaction-fix "b": each register
that draws a redaction bar paints it on the phrase itself with
`box-decoration-break: clone`, so a wrapped phrase is covered line by line
(`fix-33`). zoom-hashes "Klopt", with his hash-recovery answer: "niks
opnieuw, ik gebruik die level van zoom standaard, dus mijn oordeel blijft
gelden" — he reviews zoomed by default, so field 5 of `fix-34` holds: the
review page records the zoom a verdict was read at and the comparison with the
test browser reads at that zoom; no verdict is re-judged and the refusal at
another zoom is not built. laurels-direction "B · Wreaths": each claim between
two drawn laurel branches, platforms as app-store badges — in shade-light only, the theme his note was on; Kenny corrected the form, whose consequence line said every theme, the same day, and the other 21 themes keep their laurels.
divider-shape, his own answer "pearls": the shape knob `data-kp-divider-shape`
with pearls as pastel's default; the form offered three of the five shapes,
which he caught. hc-filled-hover "De opstijgende balk van Cancel". light-indigo
"Ook daar weg", with a catalogue prompt approving seven light navigation blocks
and rejecting the application shell: "blauw moet uit navbar". retro-scrollbars
"Tooltips zonder scrollbalk". cta-plates "Gelijktrekken": forest, solstice,
shade-dark, lapis and nostromo get room around a drawn call-to-action plate.
step-timing "Akkoord".

**scope-94 · The dark-theme review and scope-93's follow-ups answered.**
Kenny, 2026-09-15, the form after `scope-93` (commit `895fafbb`). form-scope
"Klopt": `fix-35`. hash-recipe "Berekende stijl houden, met de zoom": the
block hash stays hash version 2 over computed style, read at the verdict's
recorded ratio. unmatched-110, his own answer: "ik wil gewoon die 110 oordelen
niet meer opnieuw hoeven te maken, ze zijn goedgekeurd" — the 110 verdicts
that match no ratio keep their verdict and are re-anchored to a reading at rest
of the commit they were given at, so they do not return unless the block
changed since. alarm-levels "Overal vol drama": `kp-alarm` is built with the
full drama in all 22 themes, each in its own colours and faces. alarm-auto
"Blokkerend, zoals de demo". press-looks "Nog niet gekeken": the dark and
titanium presses wait for his catalogue review. redaction-costs "Aanvaarden, en
pastel's vervaging terug": pastel's redaction fade returns through a
registered custom property. light-breadcrumb "Ook weg". synthwave-reach
"Alleen Try again": the dark frame is narrowed to the failed data table's
retry button. laurels-badges "Met pictogram en Available on": the catalogue's
platform badges carry a glyph and an "Available on" line. step-timing
"Akkoord".

**scope-95 · The divider shapes go; a Look-at text no longer brings a block
back.** Kenny, 2026-09-15, the dividers form, after asking why the dividers
returned in every theme when he only wanted pastel changed. dividers-carry
"Overzetten, en de tekst uit de hash": the block hash stops reading the
block's Look-at text, and existing verdicts carry over wherever the block
itself did not change, so `#dividers` returns in pastel only.
divider-shapes-block "Blok en optie weg": the `data-kp-divider-shape` knob, its
gate and the `#divider-shapes` block are removed; pastel draws its pearls in its
own register. step-timing "Akkoord".

**scope-96 · After the 22-theme review: cyberpunk's data stream, alarms of
each theme's own, and the rest of the hash.** Kenny, 2026-09-15, the form after
his review of all 22 themes. cyberpunk-divider "Data stream": cyberpunk's razor
tear is replaced in its own register by the data stream (three rows of muted
yellow dashes with cyan packets under a scan hairline, two layers drifting at
different speeds, the footer seam flowing the other way); the research demo is
archived. hc-bar "De drie knoppen, en Undo in de neutrale toast zwart": the
white rising bar stays on Cancel, Save changes and Delete account, and a ghost
button on a light toast takes the dark bar again. light-blue, his own answer:
"lijkt al opgelost, is goedgekeurd" — nothing changes. unmatched-218
"Vastzetten zoals de 110": the 218 verdicts the test browser could not carry to
hash version 3 are re-anchored at their commit, as scope-94 did. hash-labels
"Ook uit de hash": a `.cat-note` label outside a stage leaves the hash, and
verdicts carry over where nothing else changed. alarm-flicker, his own answer:
"Die flicker moet enkel bij thema's waar het bij past. elk thema moet een
aangepast alarm krijgen gebaseerd op wat het thema voorstelt, de unieke
mannerismen van het thema en de kleuren" — each theme's alarm is redesigned from
what the theme stands for, its mannerisms and its colours, and the flicker
stays only where it belongs. alarm-button "Per register, zoals nu".
dialog-scroll-reset "Bovenaan openen": a dialog's body opens at the top every
time. fix-36 "Klopt". step-timing "Akkoord".

**scope-97 · A portrait per theme, and a recipe new components follow.** Kenny,
2026-09-15, asking whether the essence of each theme — what makes it unique, its
mannerisms, colours and motion — can be shown on a page of its own, so new
components find their place in every theme more easily. portrait-shape
"Catalogus, en de site linkt ernaar": a live page per theme in the catalogue,
built on the real stylesheets and registers; the site's theme page links to it.
portrait-content, all nine sections in this order: idea, colour in its role,
type, shape, surfaces, motion (enter, leave, press, hover, load, ask for
attention, and what reduced motion keeps), ornaments, voice, and a recipe for a
new component. portrait-data "Databestand, poort als advies":
`themes/<theme>/signature.json` feeds the page, and `npm run advice` reports a
component without an answer to a recipe verb, without refusing. portrait-pilot
"Eerst cyberpunk, formal en pastel": three portraits first, as research to look
at; the other nineteen follow once Kenny has judged the form. portrait-review
"Per sectie, zoals blokken": each section is a hashed block with its own
verdict. alarm-order "Stoppen tot de portretten er zijn": the per-theme alarm
redesign of scope-96 is stopped and is rebuilt from the approved portraits.
step-timing "Akkoord".

**scope-98 · The pilot portraits judged: the alarm glitches only in cyberpunk,
and the other nineteen portraits follow.** Kenny, 2026-09-15, the pilot form and
his catalogue review of the three portraits. Cyberpunk's nine sections approved;
formal and pastel approved except Motion. formal #motion: "het alarm geeft nog
altijd het glitch effect, dat enkel bij cyberpunk thuishoort. het kleurenschema
van het alarm passen volgens mij ook niet super hard bij dit thema". pastel
#motion: "zelfde commentaar, glitch effect past helemaal niet bij pastel, maak
het alarm eigen aan dit thema". So the glitch and the flicker leave the
package's alarm and live in cyberpunk's register; formal and pastel get alarms
of their own from their portraits; the portrait form is approved and the
other nineteen portraits are built in it. anatomy-sync "Bijwerken, en de tekst
naar het portret laten verwijzen": cyberpunk's, formal's, pastel's and dark's
anatomy are corrected to their registers, the lists the portrait proves leave
the text, and the text links to the portrait; the others follow with their
portraits. stamp-cards "Op elke kaart met een label": formal's and pastel's
stamp lands on every labelled card and keeps off the title. hc-side-bars "Ook
in de tekstkleur": a ghost button's side bars on a toast take the toast's ink.
Kenny also asked why the laurels demo was still under "Research to look at"
when it was decided at scope-93: it moves to "Archived research".
step-timing "Akkoord".
