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
seven themes (formal, light, dark, cyberpunk, pastel, terminal, topo)
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
document (`docs/CYBERPUNK_THEME_RESEARCH.md`, with its "five pillars"
section). `docs/THEMING.md` explains the system, not the individual
themes. Six themes have none: formal, light, dark, pastel, terminal, topo.

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
(brutalism, art deco, dark academia, the shade pair, ticker, nishiki,
phantom), five Desired (retro web, monochrome, grotesk, tazhib,
nostromo), four Later, five dropped with their reason.

What stays out of this round, by Kenny's instruction on the same form:
the four findings kp-soft reported against 3.0.0 (P1–P4, recorded in
`docs/REQUESTS_FROM_CONSUMERS.md`) and D3, the removal of `STRINGS_NL`.
Both wait for the round after this one. S20 holds: every new theme ships
in a new minor version; nothing existing changes in place.
