# Inventory — kp-themes (Phase 1)

> Paths inside Kenny's private repositories were replaced with
> descriptions on 2026-09-04: this repository is public and those are not.
> The project names stay — this package is called `@kp-soft/themes`, so
> kp-soft's name is in every import a consumer writes.

Brownfield inventory of everything the repository at
`/home/kenny/Projects/kp-themes` actually contains, at commit `5c378b9`
(package version 0.1.1, git tags `v0.1.0` and `v0.1.1`). Written from the
code, not from the documentation; where a document and the code disagree,
the disagreement is recorded as its own item (INV-D10).

Scope: every tracked file except `node_modules/`, `.git/` and the
contents of `package-lock.json` (the lock file itself is inventoried as
INV-G16). 28 files are tracked; the 27 inventoried here hold 2 820 lines of
text.

Method: entry points first — `package.json` `exports` and `scripts`,
`index.js`, `fx/index.js`, the three CSS files a consumer can `@import`,
and `scripts/check-contrast.mjs` as an executable — then the call graph
from those, then a sweep for files no entry point reaches. Coupling to
the three consumers (`~/Projects/JobTracker`, `~/Projects/kyu`,
`~/Projects/almanac`) was verified in those repositories.

This document rates nothing and proposes nothing. Every claim names its
file and, where useful, its line.

---

## Table of IDs

| ID | Name | File | State |
| --- | --- | --- | --- |
| **T — theme tokens and shared CSS machinery** | | | |
| INV-T1 | Seven palette blocks | css/themes.css:15-398 | working |
| INV-T2 | `:root` fallback = formal | css/themes.css:15-16 | working |
| INV-T3 | Nineteen surface/role tokens | css/themes.css (per block) | working |
| INV-T4 | Five chart tokens | css/themes.css (per block) | working, unused here |
| INV-T5 | Eight sidebar tokens | css/themes.css (per block) | working, unused here |
| INV-T6 | Fourteen status-badge tokens | css/themes.css (per block) | working |
| INV-T7 | `--radius` per theme | css/themes.css:66,120,173,226,289,342,397 | working |
| INV-T8 | `--theme-font-display` (3 of 7 themes) | css/themes.css:67,227,344 | half-wired |
| INV-T9 | `--font-sans` override (terminal only) | css/themes.css:343 | declared, unused in plain CSS |
| INV-T10 | `--fx-signal` pair (cyberpunk only) | css/themes.css:229-230 | working, ungated |
| INV-T11 | `--fx-notch` (cyberpunk only) | css/themes.css:232 | working |
| INV-T12 | `--fx-duration` / `--fx-ease` (cyberpunk only) | css/themes.css:234-236 | working |
| INV-T13 | Shared texture layer `body::after` | css/themes.css:409-418 | working |
| INV-T14 | Per-theme texture declarations | css/themes.css:421-479 | working, 6 of 7 themes |
| INV-T15 | Pastel overprint headings | css/themes.css:452-456 | working |
| INV-T16 | Terminal phosphor bloom headings | css/themes.css:464-467 | working |
| INV-T17 | Terminal `::selection` | css/themes.css:469-472 | working |
| INV-T18 | Formal display-serif headings | css/themes.css:483-487 | working |
| INV-T19 | Cyberpunk `::selection` | css/themes.css:489-492 | working |
| INV-T20 | `.glow-*` utilities | css/themes.css:494-512 | working, nothing here emits them |
| INV-T21 | `.gradient-text` utility | css/themes.css:514-526 | working, nothing here emits it |
| INV-T22 | `body` colour rule + 400 ms transition | css/themes.css:531-537 | working |
| INV-T23 | Tokens no gate covers | css/themes.css | observation |
| INV-T24 | Tokens that do not exist | css/themes.css | absence |
| **C — picker runtime (hook + React component)** | | | |
| INV-C1 | `THEME_META` record | hooks/use-theme.js:8-16 | working |
| INV-C2 | Derived constants | hooks/use-theme.js:21-33 | working |
| INV-C3 | `isTheme` guard | hooks/use-theme.js:39-45 | working |
| INV-C4 | localStorage read/write | hooks/use-theme.js:47-63 | working |
| INV-C5 | Provider-free external store | hooks/use-theme.js:65-91 | working |
| INV-C6 | `applyTheme` | hooks/use-theme.js:98-106 | working |
| INV-C7 | `initializeTheme` | hooks/use-theme.js:112-114 | working |
| INV-C8 | `useTheme` + precedence + revert | hooks/use-theme.js:129-174 | working |
| INV-C9 | `useAppearance` shim | hooks/use-theme.js:178-181 | dead code here |
| INV-C10 | `ThemeSwitcher` | components/theme-switcher.jsx:60-142 | working |
| INV-C11 | Inline SVG icons | components/theme-switcher.jsx:11-48 | working |
| INV-C12 | Outside-click / Escape dismissal | components/theme-switcher.jsx:72-88 | working |
| INV-C13 | Tailwind class dependency + `[data-theme-switcher]` | components/theme-switcher.jsx:91-134 | working, conditional |
| INV-C14 | Dutch default strings | hooks/use-theme.js:9-15, components/theme-switcher.jsx:63-64 | working |
| INV-C15 | Framework-free picker | — | not present |
| **F — cyberpunk register and effect components** | | | |
| INV-F1 | Register texture override | css/cyberpunk-register.css:20-26 | working |
| INV-F2 | `.microlabel` | css/cyberpunk-register.css:30-40 | working, needs `--font-mono` |
| INV-F3 | Neon caret | css/cyberpunk-register.css:43-46 | working |
| INV-F4 | Card underglow | css/cyberpunk-register.css:50-68 | needs `data-slot='card'` |
| INV-F5 | Clipped corner | css/cyberpunk-register.css:71-80 | needs `data-slot` or `.fx-notch` |
| INV-F6 | Button charge sweep | css/cyberpunk-register.css:84-94 | needs `data-slot='button'` |
| INV-F7 | `.fx-brackets` | css/cyberpunk-register.css:98-123 | needs the class |
| INV-F8 | `.fx-rule` | css/cyberpunk-register.css:127-147 | needs the class |
| INV-F9 | Themed scrollbar | css/cyberpunk-register.css:150-171 | working |
| INV-F10 | `.fx-signal-badge` | css/cyberpunk-register.css:174-178 | needs the class |
| INV-F11 | Reduced-motion guard block | css/cyberpunk-register.css:182-242 | working |
| INV-F12 | `.fx-flicker` | css/cyberpunk-register.css:184-186, 244-267 | needs the class |
| INV-F13 | `.fx-pulse` | css/cyberpunk-register.css:190-202, 269-273 | needs the class |
| INV-F14 | `.fx-glitch` | css/cyberpunk-register.css:206-230, 275-311 | needs class + `data-text` |
| INV-F15 | `.fx-media` RGB split | css/cyberpunk-register.css:233-236, 313-326 | needs the class |
| INV-F16 | `.fx-cellpop` | css/cyberpunk-register.css:239-241, 328-336 | needs the class |
| INV-F17 | Register line budget by markup requirement | css/cyberpunk-register.css | measurement |
| INV-F18 | `fx/` barrel | fx/index.js | working |
| INV-F19 | `BootSequence` | fx/boot-sequence.jsx | unverified, needs `motion` |
| INV-F20 | `DecipherText` | fx/decipher-text.jsx | unverified |
| INV-F21 | `DigitalRain` | fx/digital-rain.jsx | unverified |
| INV-F22 | `ScrambleNumber` | fx/scramble-number.jsx | unverified |
| INV-F23 | Shared guard pattern of the four components | fx/*.jsx | working |
| INV-F24 | `role="text"` accessibility wrapper | fx/decipher-text.jsx:53, fx/scramble-number.jsx:36 | non-standard |
| INV-F25 | No component emits a register class | fx/, components/ | observation |
| **B — Tailwind binding** | | | |
| INV-B1 | `@theme` colour aliases | css/tailwind-bridge.css:11-53 | working |
| INV-B2 | `dark` custom variant | css/tailwind-bridge.css:9 | working |
| INV-B3 | `[data-theme]` re-declaration block | css/tailwind-bridge.css:66-103 | working |
| INV-B4 | Radius scale mapping | css/tailwind-bridge.css:17-19, 99-101 | working |
| INV-B5 | Font family mapping | css/tailwind-bridge.css:12-15, 102 | working |
| INV-B6 | Status tokens are not bridged | css/tailwind-bridge.css | absence |
| INV-B7 | Consumer obligations of the bridge | css/tailwind-bridge.css + README.md:191-207 | working, external |
| **G — gates, scripts, packaging, tooling** | | | |
| INV-G1 | Contrast check, what it asserts | scripts/check-contrast.mjs:23-40, 75-98 | working |
| INV-G2 | Theme discovery from the CSS | scripts/check-contrast.mjs:17-18 | working |
| INV-G3 | Colour maths | scripts/check-contrast.mjs:49-73 | working |
| INV-G4 | Target-file argument | scripts/check-contrast.mjs:11-12 | working |
| INV-G5 | Failure modes | scripts/check-contrast.mjs | observation |
| INV-G6 | `STATUS_NAMES` export + module side effect | scripts/check-contrast.mjs:21 | dead export |
| INV-G7 | npm scripts | package.json:32-36 | working |
| INV-G8 | Export map | package.json:14-21 | working |
| INV-G9 | `files` array | package.json:22-31 | working |
| INV-G10 | Peers, engines, `private`, `sideEffects` | package.json:11-13,37-51 | working |
| INV-G11 | `index.js` barrel | index.js:1-15 | working |
| INV-G12 | Node pin | .nvmrc | working |
| INV-G13 | Prettier configuration | .prettierrc, .prettierignore | working |
| INV-G14 | `jsconfig.json` type checking | jsconfig.json | configured, never run |
| INV-G15 | `.gitignore` | .gitignore | working |
| INV-G16 | `package-lock.json` | package-lock.json | stale |
| INV-G17 | Tooling that is absent | — | absence |
| INV-G18 | Version and tag surface | package.json, git tags | working |
| **D — documentation** | | | |
| INV-D1 | README.md | README.md | present, partly stale |
| INV-D2 | CLAUDE.md | CLAUDE.md | present, stale |
| INV-D3 | HANDOFF.md | HANDOFF.md | present |
| INV-D4 | docs/SCOPE.md | docs/SCOPE.md | present, approved |
| INV-D5 | docs/legacy/THEMING.md | docs/legacy/THEMING.md | verbatim copy, foreign paths |
| INV-D6 | docs/legacy/CYBERPUNK_THEME_RESEARCH.md | docs/legacy/CYBERPUNK_THEME_RESEARCH.md | verbatim copy |
| INV-D7 | docs/CORRECTIONS.md | docs/CORRECTIONS.md | present |
| INV-D8 | docs/MINI_ROUNDS.md | docs/MINI_ROUNDS.md | present, one open item |
| INV-D9 | docs/REQUESTS_FROM_CONSUMERS.md | docs/REQUESTS_FROM_CONSUMERS.md | present |
| INV-D10 | Contradictions between the documents and the code | — | findings |

---

## T — Theme tokens and shared CSS machinery

All of section T lives in `css/themes.css` (537 lines). The file is
imported by the export path `@kp-soft/themes/css` (INV-G8) and vendored
verbatim by kyu and Almanac (see "Consumers" below).

### INV-T1 · Seven palette blocks

Seven CSS blocks, one per theme, each a flat list of custom properties:
formal at lines 15-68 (selector `:root, [data-theme='formal']`), light
70-121, dark 123-174, cyberpunk 176-237, pastel 239-290, terminal
292-345, forest 347-398. Every block is self-contained; no block inherits
from another, so a token exists in a theme only if that block spells it
out.

Measured token counts per block: formal 48, light 47, dark 47, cyberpunk
53, pastel 47, terminal 49, forest 47. Forty-seven token names are common
to all seven (INV-T3 + INV-T4 + INV-T5 + INV-T6 + INV-T7). Seven names appear in fewer than
seven blocks and are the entire asymmetry of the file:

| Token | Declared in | Item |
| --- | --- | --- |
| `--theme-font-display` | formal, cyberpunk, terminal (3) | INV-T8 |
| `--font-sans` | terminal (1) | INV-T9 |
| `--fx-signal`, `--fx-signal-foreground` | cyberpunk (1) | INV-T10 |
| `--fx-notch` | cyberpunk (1) | INV-T11 |
| `--fx-duration`, `--fx-ease` | cyberpunk (1) | INV-T12 |

Exercised by: the contrast gate (INV-G1) reads 21 token pairs out of every
block; JobTracker renders all seven through `ThemeSwitcher`; kyu and
Almanac ship the same file byte for byte.

### INV-T2 · `:root` fallback = formal

`css/themes.css:15-16` binds the formal block to `:root` as well as to
`[data-theme='formal']`, so a page with no `data-theme` attribute still
gets a complete token set. Coupled to INV-C6/INV-C7, which are the only things in
the package that set the attribute, and to kyu's `templates/layout.html:2`
which hardcodes `data-theme="formal"` on `<html>` instead.

### INV-T3 · Nineteen surface and role tokens

Per theme: `--background`, `--foreground`, `--card`, `--card-foreground`,
`--popover`, `--popover-foreground`, `--primary`,
`--primary-foreground`, `--secondary`, `--secondary-foreground`,
`--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`,
`--destructive`, `--destructive-foreground`, `--border`, `--input`,
`--ring`. All values are written as `hsl(h, s%, l%)` with commas — a form
the contrast script's parser depends on (INV-G3). Fifteen of the nineteen are
covered by the gate; `--border`, `--input` and `--ring` are not (INV-T23).

### INV-T4 · Five chart tokens

`--chart-1` … `--chart-5` per theme (e.g. `css/themes.css:37-41` for
formal). Nothing in this repository consumes them; they are aliased into
Tailwind by INV-B1 and left to the consumer. No contrast pair covers them.

### INV-T5 · Eight sidebar tokens

`--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`,
`--sidebar-primary-foreground`, `--sidebar-accent`,
`--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` per
theme (formal: `css/themes.css:42-49`). Three of the four pairs are
gated (INV-G1); `--sidebar-border` and `--sidebar-ring` are not (INV-T23). No
markup in this package uses them.

### INV-T6 · Fourteen status-badge tokens

Seven `--status-<name>` / `--status-<name>-foreground` pairs per theme:
draft, sent, screening, interview, offer, rejected, withdrawn. Formal
52-65, light 106-119, dark 159-172, cyberpunk 212-225, pastel 275-288,
terminal 328-341, forest 383-396. These are the only tokens added in this
package rather than extracted from kp-soft (`css/themes.css:7`). They
encode JobTracker's application-pipeline semantics, not a general
severity scale.

Exercised by: the gate checks all seven pairs in all seven themes (49
assertions), and JobTracker's `dashboard/packages/web/src/components/StatusPill.jsx:24-25`
reads them directly as `var(--status-${phase})`.

### INV-T7 · `--radius` per theme

One value per theme: formal `0.375rem` (:66), light `0.5rem` (:120), dark
`0.5rem` (:173), cyberpunk `0.25rem` (:226), pastel `1rem` (:289),
terminal `0rem` (:342), forest `0.625rem` (:397). Nothing in this package's
plain CSS applies it; it reaches a page only through the Tailwind radius
scale (INV-B4). Note that INV-F5 sets `border-radius: 0` on cyberpunk cards and
buttons, overriding the theme's own `0.25rem`.

### INV-T8 · `--theme-font-display`

Declared by three themes: formal `'Fraunces', Georgia, …` (:67),
cyberpunk `'Chakra Petch', 'JetBrains Mono', …` (:227), terminal
`'Share Tech Mono', …` (:344). In plain CSS the token is read exactly
once, at `css/themes.css:485`, and only for `[data-theme='formal'] h1, h2`
(INV-T18). Cyberpunk's and terminal's display faces are therefore never
applied by this stylesheet. The package offers two ways to reach them:
the Tailwind `--font-display` alias (INV-B5), or a consumer writing its own
rule that reads the token.

**Both plain-CSS consumers took the second route, independently and
identically** (measured 2026-09-03). `~/Projects/kyu/static/theme-bridge.css:39-41`
and `~/Projects/almanac/static/theme-bridge.css:53` both carry
`h1, h2, h3, .h1, .h2, .h3, .navbar-brand { font-family: var(--theme-font-display, inherit); }`,
and kyu's `templates/layout.html:26-27` loads the Bunny Fonts stylesheet
including chakra-petch. So Chakra Petch **is** applied on the live kyu
dashboard. The gap is not that the display face fails to arrive; it is
that arriving takes two hand-written lines each consumer had to invent
for itself — the same drift the framework-free picker exists to stop,
in a second place. The fonts themselves are not shipped (see "External
dependencies").

### INV-T9 · `--font-sans` override in terminal

`css/themes.css:343` sets `--font-sans` to a monospace stack inside the
terminal block. No rule in `css/themes.css` or
`css/cyberpunk-register.css` reads `var(--font-sans)`; the only reader is
`css/tailwind-bridge.css:14` and :102, both as a fallback for
`--font-display`. Consequence measured in the file: terminal's promise in
its own comment ("everything is mono", :293) holds only for a Tailwind
consumer that uses `font-sans`, not for a plain-CSS or Bootstrap
consumer.

**And the two plain-CSS consumers ask for a token this package does not
publish** (measured 2026-09-03). Both
`~/Projects/kyu/static/theme-bridge.css:34` and
`~/Projects/almanac/static/theme-bridge.css:47` set the body font from
`var(--theme-font-body, var(--bs-font-sans-serif))`. `--theme-font-body`
occurs zero times in `css/` here and zero times in either vendored copy,
so both fall through to Bootstrap's sans-serif every time. Two consumers
independently invented the same missing token name, which is a strong
signal the package should publish it: kp-themes expresses "terminal's
body is monospace" as `--font-sans`, a name neither consumer thinks to
read.

### INV-T10 · `--fx-signal` / `--fx-signal-foreground`

`css/themes.css:229-230`, cyberpunk only, described in the comment as
"the rare third signal colour". Read by INV-F10 in the register. No other
theme declares them, so `.fx-signal-badge` is inert elsewhere — and this
pair is the one colour pair in the file the contrast gate never checks
(INV-T23).

### INV-T11 · `--fx-notch`

`css/themes.css:232`, cyberpunk only, `14px`. Read by INV-F5's `clip-path`
with a `var(--fx-notch, 0px)` fallback, so themes that do not declare it
clip nothing.

### INV-T12 · `--fx-duration` / `--fx-ease`

`css/themes.css:234-236`, cyberpunk only, `140ms` and a custom cubic
bezier. Read by INV-F4 (`var(--fx-duration, 200ms)`) and INV-F6
(`var(--fx-duration, 140ms)`), both with literal fallbacks. Note the two
fallbacks differ from each other.

### INV-T13 · Shared texture layer

`css/themes.css:409-418`: one `body::after` pseudo-element, `position:
fixed`, `inset: 0`, `z-index: 80`, `pointer-events: none`, painting
`var(--fx-texture, none)` at `var(--fx-texture-opacity, 0)`. A theme that
declares no texture renders a fully transparent layer rather than
nothing. This is the only rule in the package that touches `body`
besides INV-T22, and the only one that assumes a `<body>` element exists.

Coupling: the layer sits at z-index 80; `BootSequence` (INV-F19) renders at
`z-[90]` and the switcher's listbox at `z-50`, so the texture paints over
the picker and under the boot overlay.

### INV-T14 · Per-theme texture declarations

Six declarations, each adding `--fx-texture` (+ size, + opacity) to a
theme block that already exists above: formal, an inline SVG turbulence
grain at 3.5 % (:421-425); light, a two-scale millimetre grid at 5 %
(:428-436); dark, a twelve-star SVG starfield at 50 % opacity of an
already faint image (:439-443); pastel, SVG risograph grain at 5 %
(:446-450); terminal, a repeating scanline gradient at opacity 1, the
gradient itself being 6 % alpha (:459-462); forest, an SVG contour drawing
at 6 % (:475-479).

The seventh theme, cyberpunk, has no texture in this file. Its texture
(vignette + scanlines) is declared in `css/cyberpunk-register.css:20-26`
(INV-F1), which means a consumer that imports only `@kp-soft/themes/css` —
which is exactly what kyu and Almanac vendor — gets a cyberpunk theme
with a blank texture layer.

### INV-T15 · Pastel overprint headings

`css/themes.css:452-456`: `h1, h2` under `[data-theme='pastel']` get a
2 px offset `text-shadow` in a second ink. Works on any markup with
headings.

### INV-T16 · Terminal phosphor bloom

`css/themes.css:464-467`: `h1, h2` under `[data-theme='terminal']` get an
8 px green glow.

### INV-T17 · Terminal `::selection`

`css/themes.css:469-472`: green plate, near-black text, for selected text
in the terminal theme.

### INV-T18 · Formal display-serif headings

`css/themes.css:483-487`: `h1, h2` under `[data-theme='formal']` use
`var(--theme-font-display)` with `letter-spacing: -0.01em`. The single
plain-CSS consumer of INV-T8.

### INV-T19 · Cyberpunk `::selection`

`css/themes.css:489-492`: magenta plate with dark text.

### INV-T20 · `.glow-primary`, `.glow-accent`, `.glow-card`

`css/themes.css:494-512`. Three opt-in classes scoped to
`[data-theme='cyberpunk']`: two multi-layer `text-shadow` glows and one
`box-shadow` card ring. They are declared in `themes.css`, not in the
register, so a consumer that skips the register still gets them. Nothing
in this repository emits these class names (verified: zero hits in
`components/` and `fx/`).

### INV-T21 · `.gradient-text`

`css/themes.css:514-519` defines a theme-driven gradient text fill from
`var(--primary)` to `var(--ring)`; `:521-526` overrides it for cyberpunk
with literal magenta/cyan. Unscoped — the base rule applies in every
theme. Nothing in this repository emits the class.

### INV-T22 · `body` colour rule

`css/themes.css:531-537`: `body { background-color: var(--background);
color: var(--foreground); transition: background-color 400ms ease, color
400ms ease; }`. Header comment (:528-530) records it as the plain-CSS
equivalent of kp-soft's Tailwind `@apply`. This is the rule that makes
the theme govern the page rather than only the components, and the one
`docs/SCOPE.md` S6 and `docs/CORRECTIONS.md` KT1 both cite.

### INV-T23 · Colour pairs no gate covers

Tokens declared in every theme but never appearing in the contrast
script's pair lists (`scripts/check-contrast.mjs:23-40`): `--border`,
`--input`, `--ring`, `--chart-1` … `--chart-5`, `--sidebar-border`,
`--sidebar-ring`. Also ungated: the cyberpunk-only pair `--fx-signal` /
`--fx-signal-foreground` (INV-T10). `--accent` / `--accent-foreground` is
gated at 3:1 rather than 4.5:1 (`:39-40`). Recorded as a measurement, not
a defect claim: several of these tokens are not text-on-surface pairs at
all.

### INV-T24 · Tokens that do not exist

Verified by listing every token name in the file: there is no
`--success`, no `--warning`, no `--info`, and no token carrying a hover,
active, focus or disabled state, in any of the seven blocks (zero hits
each). `--ring` exists but no rule in the package applies it to a focus
state. This matches what `docs/SCOPE.md` S6b asserts.

---

## C — Picker runtime (hook + React component)

`hooks/use-theme.js` (181 lines) and `components/theme-switcher.jsx`
(142 lines). Both are re-exported by `index.js` (INV-G11). `docs/SCOPE.md`
S17 records this pair as explicitly **not** approved.

### INV-C1 · `THEME_META`

`hooks/use-theme.js:8-16`. A frozen object keyed by theme name; each
entry is `{ label, dark, bg, fg, primary }`. Seven entries. `dark: true`
for exactly three: dark, cyberpunk, terminal. The three colour fields
duplicate values from `css/themes.css` as literal strings (e.g.
`'hsl(40,25%,97%)'` for formal, matching `css/themes.css:18`), so the
swatch can preview a theme without activating it. Nothing checks that
these literals still match the stylesheet.

This is the "one source of truth for the theme list" of S9. Everything
else in the module derives from it.

### INV-C2 · Derived constants

`hooks/use-theme.js:21-33`: `THEMES` (`Object.keys(THEME_META)`),
`DEFAULT_THEME = 'formal'`, `STORAGE_KEY = 'theme'`, `THEME_LABELS`
(name → label map), and the module-private `DARK_THEMES` computed by
filtering on `dark`. `THEMES`, `DEFAULT_THEME`, `STORAGE_KEY` and
`THEME_LABELS` are all public exports; `DARK_THEMES` is not exported, so
a consumer that wants the dark set must recompute it from `THEME_META` —
which is what `docs/REQUESTS_FROM_CONSUMERS.md:27` shows both vanilla
consumers doing.

### INV-C3 · `isTheme`

`hooks/use-theme.js:39` plus the private `asTheme` at :45, which narrows
a string to a theme or `null`. `isTheme` is exported and is used
externally: JobTracker's own theme module validates
two server-supplied theme names with it.

### INV-C4 · localStorage read/write

`hooks/use-theme.js:47-63`. `readStored()` returns
`localStorage.getItem('theme')` or `null`; `writeStored(theme)` sets it.
Both wrap the call in `try/catch` and swallow the error, so blocked or
private-mode storage degrades to DOM-only theming.

Storage format: one plain string, one of the seven names, under the key
`theme`. No JSON, no namespace prefix, no expiry.

### INV-C5 · Provider-free external store

`hooks/use-theme.js:65-91`. A module-level `Set` of listeners, a
module-level `current` theme, `subscribe`, `getSnapshot` and
`getServerSnapshot`, consumed by `useSyncExternalStore` at :138.
`getSnapshot` falls back to `document.documentElement.dataset.theme` and
then to `'formal'`. `getServerSnapshot` always returns `'formal'`,
meaning a server-rendered page always renders as formal regardless of the
stored choice. State lives in module scope, so two copies of the package
in one bundle would not share it.

### INV-C6 · `applyTheme`

`hooks/use-theme.js:98-106`. Sets `document.documentElement.dataset.theme`
and toggles the `dark` class using `DARK_THEMES`, then notifies the store
if the value changed. Touches `document` unguarded, so it throws on a
server. Exported and used externally by
JobTracker's entry point.

This function is the DOM contract the two vanilla consumers reimplemented
(`kyu/static/theme.js`, `almanac/static/theme.js`).

### INV-C7 · `initializeTheme`

`hooks/use-theme.js:112-114`. `applyTheme(stored ?? fallback)` with
`fallback` defaulting to `'formal'`. Intended to run before React mounts
to avoid a flash. Exported; used by JobTracker's `main.jsx`.

### INV-C8 · `useTheme`

`hooks/use-theme.js:129-174`. Returns `{ theme, updateTheme, saveFailed }`.

- Options: `preferred`, `fallback`, `onChange` (:130).
- Precedence, implemented at :134: `preferred` → `localStorage` →
  `fallback` → `'formal'`. Both `preferred` and `fallback` are validated
  through `asTheme`, so an unknown name falls through instead of landing
  on `<html>`.
- An effect at :140-142 re-applies the resolved theme whenever
  `preferred` or `fallback` changes.
- `updateTheme(next)` at :147 applies, stores, clears `saveFailed`, then
  calls `onChange(next, previous)`. If `onChange` throws, or returns a
  promise that rejects, the previous theme is re-applied and re-stored
  and `saveFailed` becomes `true` (:158-170) — the "endpoint that lies"
  guard.
- No `prefers-color-scheme` handling anywhere in the module; JobTracker
  supplies that itself in `src/lib/theme.js`.

### INV-C9 · `useAppearance`

`hooks/use-theme.js:178-181`. A shim renaming `theme`/`updateTheme` to
`appearance`/`updateAppearance`, labelled in its own comment as
compatibility for kp-soft components. Exported from `index.js:11`. No
caller exists in this repository and none in the three consumers — dead
code as far as anything reachable goes.

### INV-C10 · `ThemeSwitcher`

`components/theme-switcher.jsx:60-142`, default export, re-exported as a
named export by `index.js:1`. Renders a wrapper `div` carrying
`data-theme-switcher=""`, an icon button, and — when open — a `ul` with
`role="listbox"` containing one `li role="option"` per theme with a
two-colour swatch, the label and a check mark on the active one.

Full prop list (`:51-57`, `:60-66`):

| Prop | Type | Default |
| --- | --- | --- |
| `themeOptions` | `UseThemeOptions` | `undefined` (passed straight to `useTheme`) |
| `label` | string | `'Thema kiezen'` |
| `failedMessage` | string | `'Niet bewaard op de server — je keuze is teruggezet.'` |
| `className` | string | `''` |
| `labels` | partial map theme → string | `undefined` (falls back to `THEME_LABELS`) |

The swatch is an inline style, `linear-gradient(135deg, bg 50%, primary
50%)` (:131), the only place the `bg`/`primary` fields of `THEME_META`
are read. `saveFailed` renders as an extra `li` inside the listbox
(:108) that carries no `role="option"`.

Keyboard behaviour: the trigger is a real `button`; each option has
`tabIndex={0}` and handles Enter and Space (:119-125). There is no arrow-key
roving focus, no `aria-activedescendant`, and focus is not moved into the
list on open or returned to the trigger on close.

Exercised by: JobTracker's Playwright suite
(JobTracker's end-to-end theme spec) asserts the
trigger is visible and wider than 20 px, that the English `labels`
override is used, that clicking an option sets `data-theme` on `<html>`
and `localStorage.theme`, and that the choice survives a reload.

### INV-C11 · Inline SVG icons

`components/theme-switcher.jsx:11-48`. `PaletteIcon` and `CheckIcon`, two
local components, both `aria-hidden`, replacing lucide icons so the
package has no icon dependency.

### INV-C12 · Outside-click / Escape dismissal

`components/theme-switcher.jsx:72-88`. While open, a `mousedown` listener
on `document` closes the menu on a click outside the wrapper and a
`keydown` listener closes it on Escape; both are removed on close and
unmount.

### INV-C13 · Tailwind class dependency

The component's own styling is entirely Tailwind/shadcn utility class
names (`hover:bg-accent`, `bg-popover`, `border-border`,
`text-destructive`, `size-9`, `inline-flex`, …) — see :91-134. Its
header comment (:4-8) states these are harmless outside Tailwind, which
is true in the sense that they do not error, and false in the sense that
the component then has no layout at all. The wrapper's
`data-theme-switcher` attribute is the documented restyling hook
(README.md:103). Two live consequences are recorded in the code: a
Tailwind consumer must add the package as a `@source`
(JobTracker's `src/app.css:4-8`, README.md:191-207) or the switcher
renders at 0×0 px.

### INV-C14 · Dutch default strings

`hooks/use-theme.js:9-15` ships the labels `'Formeel'`, `'Licht'`,
`'Donker'`, `'Cyberpunk'`, `'Pastel'`, `'Terminal'`, `'Topografisch'`;
`components/theme-switcher.jsx:63-64` defaults `label` to
`'Thema kiezen'` and `failedMessage` to a Dutch sentence. The `labels`
prop (added in 0.1.1, commit `33ec65e`) overrides the theme names but not
`label` and `failedMessage`, which have their own props. These are the
only user-facing strings in the package.

### INV-C15 · Framework-free picker

Not present. The repository contains no `.html` file, no vanilla
`.js` picker and no `<script>`-loadable build. The behaviour exists twice
outside this repository, in `~/Projects/kyu/static/theme.js` and
`~/Projects/almanac/static/theme.js` (both ~130 lines, no dependencies),
which derive the theme list from server-rendered markup
(`[data-theme-picker] [data-theme]` with a `data-dark` attribute) rather
than from `THEME_META`, and additionally set `data-bs-theme` for
Bootstrap. Recorded here because `docs/SCOPE.md` S2 puts it in scope.

---

## F — Cyberpunk register and effect components

`css/cyberpunk-register.css` (336 lines) is exported as
`@kp-soft/themes/css/register` and is opt-in. Everything in it is scoped
to `[data-theme='cyberpunk']` and inert in the other six themes. The four
React components live in `fx/` and are exported as `@kp-soft/themes/fx`.
The two halves share the `fx-` name but nothing else: no component in
`fx/` emits any class the register styles (INV-F25).

### INV-F1 · Register texture override

`css/cyberpunk-register.css:20-26` declares `--fx-texture` (a radial
vignette plus a scanline gradient), `--fx-texture-size` and
`--fx-texture-opacity: 1` for cyberpunk, feeding the shared `body::after`
layer of INV-T13. This is the only theme whose texture is not in
`themes.css`; see INV-T14.

### INV-F2 · `.microlabel`

`:30-40`. Uppercase, letter-spaced, `--muted-foreground`-coloured text
with a `'// '` prefix in `--accent` via `::before`. Requires
`font-family: var(--font-mono)` (:31), a token declared **only** in
`css/tailwind-bridge.css:15`. A plain-CSS consumer that imports the
register without the bridge gets an invalid `font-family` here and falls
back to the inherited font.

### INV-F3 · Neon caret

`:43-46`. `caret-color: var(--primary)` on `input` and `textarea`. Needs
no special markup; this is the part of the register that applies in
JobTracker today.

### INV-F4 · Card underglow

`:50-68`. `[data-slot='card']` becomes `position: relative` and grows a
2 px `--primary` line along its bottom edge on hover, animated from
`width: 0` to `100%` over `var(--fx-duration, 200ms)`. Requires shadcn's
`data-slot="card"` attribute.

### INV-F5 · Clipped corner

`:71-80`. Two rules: one for `[data-slot='card']` and `.fx-notch`
together, using `var(--fx-notch, 0px)`; one for `[data-slot='button']`
with a hardcoded `7px`. Both set `border-radius: 0`, overriding INV-T7.
`.fx-notch` is the only markup-agnostic escape hatch in this group.

### INV-F6 · Button charge sweep

`:84-94`. A skewed cyan light band as a background image on
`[data-slot='button']`, moved from `105%` to `-5%` on hover over
`var(--fx-duration, 140ms)`. Requires shadcn's button slot attribute.

### INV-F7 · `.fx-brackets`

`:98-123`. Two 9×9 px corner brackets in `--accent` on `::before`
(top-left) and `::after` (bottom-right). Needs the class on the element.

### INV-F8 · `.fx-rule`

`:127-147`. Turns an element into a flex row with a diamond node
(`::before`) and a fading hairline (`::after`) after the content. Needs
the class.

### INV-F9 · Themed scrollbar

`:150-171`. `scrollbar-color` / `scrollbar-width` on the themed root plus
four `::-webkit-scrollbar*` rules, all with literal magenta/void-purple
values rather than tokens. Needs no markup.

### INV-F10 · `.fx-signal-badge`

`:174-178`. Applies `--fx-signal` / `--fx-signal-foreground` (INV-T10) with
three `!important` declarations — the only `!important` in the package.
Needs the class.

### INV-F11 · Reduced-motion guard

`:182-242`. Every animated rule in the register sits inside one
`@media (prefers-reduced-motion: no-preference)` block. The `@keyframes`
definitions themselves (:244-336) sit outside it, which is harmless
because nothing outside the block references them.

### INV-F12 · `.fx-flicker`

`:184-186` with `@keyframes fx-flicker` at :244-267. A 1.1 s neon-tube
flicker that runs once. Needs the class.

### INV-F13 · `.fx-pulse`

`:190-202` with `@keyframes fx-pulse` at :269-273. A pseudo-element
carrying a static `box-shadow` whose **opacity** is animated on a 2.6 s
infinite loop — the technique `docs/legacy/CYBERPUNK_THEME_RESEARCH.md`
prescribes. Needs the class.

### INV-F14 · `.fx-glitch`

`:206-230` with two keyframe sets at :275-311. On hover, two
pseudo-elements re-render `attr(data-text)` in magenta and cyan with
`mix-blend-mode: screen` and stepped `clip-path` banding. Needs both the
class and a `data-text` attribute mirroring the visible text.

### INV-F15 · `.fx-media`

`:233-236` with `@keyframes fx-rgb-split` at :313-326. A 170 ms RGB split
on a hovered `img` or `iframe` inside `.fx-media`. Needs the class.

### INV-F16 · `.fx-cellpop`

`:239-241` with `@keyframes fx-cellflash` at :328-336. A one-beat cyan
flash, described in the source as the puzzle-cell entry effect from
kp-soft. Needs the class.

### INV-F17 · Register line budget by markup requirement

Full accounting of the 336 lines, so the shadcn coupling can be argued
with a number rather than an impression:

| Category | Lines | Which |
| --- | --- | --- |
| Header comment | 16 | :1-16 |
| Works on any consumer's plain markup | 37 | texture tokens :18-26 (9), `input`/`textarea` :42-46 (5), scrollbar :149-171 (23) |
| Requires a shadcn `data-slot` attribute | 38 | card :48-68 (21), button notch :77-80 (4), button charge :82-94 (13) |
| Requires `data-slot` **or** the `.fx-notch` class | 6 | :70-75 |
| Requires an `fx-`/`microlabel` class on the markup | 125 | `.microlabel` 13, `.fx-brackets` 28, `.fx-rule` 23, `.fx-signal-badge` 6, `.fx-flicker` 4, `.fx-pulse` 15, `.fx-glitch` 27, `.fx-media` 5, `.fx-cellpop` 4 |
| `@keyframes` supporting the class-based motion | 93 | :244-336 |
| Media-query wrapper and section headers | 3 | :180-182, :242 |
| Blank separator lines | 19 | — |

`data-slot` appears on 8 selector lines. In other words: 44 of 336 lines
(13 %) need shadcn markup, 125 lines (37 %) plus the 93 keyframe lines
need a class the consumer must add, and 37 lines (11 %) work on markup
every consumer already has.

### INV-F18 · `fx/` barrel

`fx/index.js`, 8 lines, re-exporting the four components. Its comment
warns that importing the barrel pulls in the optional `motion` peer
because of `BootSequence`. That is accurate: any consumer importing
`@kp-soft/themes/fx` resolves `motion/react` even if it only wants
`ScrambleNumber`.

### INV-F19 · `BootSequence`

`fx/boot-sequence.jsx`, 56 lines. Renders a full-screen monospace boot
log once per browser session when the active theme is cyberpunk: guards
on `theme !== 'cyberpunk'` (:19), a `sessionStorage` key `fx-booted`
(:21-22, inside `try/catch` — a storage failure aborts the effect), and
`prefers-reduced-motion: reduce` (:26). Reveals one line every 140 ms and
fades out after `140 × lines + 260` ms. Click anywhere dismisses it.
Props: `lines` (string array, default four lines at :5). Requires
`motion/react` (`AnimatePresence`, `motion.div`, :1) — the only file in
the package that touches the optional peer, which is not installed in
this repository. Uses Tailwind classes (`bg-background`, `z-[90]`,
`font-mono`). Depends on INV-C8 for the active theme.

### INV-F20 · `DecipherText`

`fx/decipher-text.jsx`, 57 lines. Replaces the characters of `text` with
random glyphs from a 27-glyph pool (:4) and settles them left to right,
one character every two animation frames, via `requestAnimationFrame`.
Outside cyberpunk, or under reduced motion, it renders the plain text
(:21-24). Props: `text` (required), `delay` (ms, default 0). Depends on
INV-C8; no `motion` dependency; cancels its frame on unmount.

### INV-F21 · `DigitalRain`

`fx/digital-rain.jsx`, 64 lines. A `<canvas>` falling-glyph rain, throttled
to one repaint per 50 ms, DPR-capped at 2, colour read at runtime from
`getComputedStyle(document.documentElement).getPropertyValue('--accent')`
with `'#0ff'` as fallback (:35) — the only place in the package that
reads a token back out of the DOM. Returns `null` entirely outside
cyberpunk (:61). Props: `className`. Note the canvas has no intrinsic
size: it measures `clientWidth`/`clientHeight` once (:26-27), so the
caller must size it, and it does not react to resizes.

### INV-F22 · `ScrambleNumber`

`fx/scramble-number.jsx`, 40 lines. Rattles the digits of `value` through
a hex alphabet on a 40 ms `setInterval`, settling one character per tick;
non-digit characters are left alone (:27). Plain value outside cyberpunk
or under reduced motion. Props: `value` (string, required). Depends on
INV-C8.

### INV-F23 · Shared guard pattern

All four components call `useTheme()` from `../hooks/use-theme.js` and
compare against the literal `'cyberpunk'`, and all four consult
`window.matchMedia('(prefers-reduced-motion: reduce)')` themselves rather
than relying on a CSS media query. The media query is read once inside an
effect, so a user changing the OS preference mid-session is not picked up.
This is the coupling that makes `fx/` unusable without the hook of section
C — which S17 approves the fx but not the hook.

### INV-F24 · `role="text"` wrapper

`fx/decipher-text.jsx:53-55` and `fx/scramble-number.jsx:36-38` both
render `<span aria-label={…} role="text"><span aria-hidden="true">…`.
`role="text"` is not part of the ARIA specification (it is a
WebKit-only extension); recorded as a fact about the markup, not as a
verdict.

### INV-F25 · No component emits a register class

Verified by grep across `components/` and `fx/`: zero occurrences of
`microlabel`, `fx-notch`, `fx-brackets`, `fx-rule`, `fx-signal-badge`,
`fx-flicker`, `fx-pulse`, `fx-glitch`, `fx-media`, `fx-cellpop`,
`glow-primary`, `glow-accent`, `glow-card`, `gradient-text`, and zero
occurrences of `data-slot`. The register's class hooks are addressed to
consumer markup only. This contradicts
`docs/REQUESTS_FROM_CONSUMERS.md:145-146`, which states that `.fx-notch`
and `.microlabel` "belong to the React `fx/` components" (INV-D10).

---

## B — Tailwind binding

`css/tailwind-bridge.css`, 103 lines, exported as
`@kp-soft/themes/css/tailwind-bridge`. Optional: plain-CSS consumers do
not import it. It contains no colour values of its own — every value is a
`var()` onto a token from section T.

### INV-B1 · `@theme` colour aliases

`:11-53`. Maps 32 theme tokens onto Tailwind v4's `--color-*` namespace,
so `bg-primary`, `text-muted-foreground`, `border-border`, `bg-chart-3`,
`bg-sidebar` and the rest resolve to the active theme. Note the one
rename: `--sidebar-background` becomes `--color-sidebar` (:45, :91).

### INV-B2 · `dark` custom variant

`:9`: `@custom-variant dark (&:is(.dark *))`. Keeps existing `dark:`
utilities working, driven by the class that INV-C6 toggles. As written the
variant matches *descendants* of `.dark`, so a `dark:` utility placed on
the `<html>` element itself does not match.

### INV-B3 · `[data-theme]` re-declaration block

`:66-103`, with a 10-line comment (`:55-64`) explaining why. Tailwind
substitutes a custom property's `var()` where it is *declared*, so the
`@theme` aliases resolve once on `:root` and a nested `[data-theme]`
subtree could not change them. This block re-declares all 32 aliases plus
the radius scale and `--font-display` on every `[data-theme]` element, so
`<section data-theme="pastel">` themes its own subtree. The comment
records the symptom that led to it (a showcase where swatches changed but
components did not).

### INV-B4 · Radius scale

`:17-19` and `:99-101`. `--radius-lg: var(--radius)`, `--radius-md:
calc(var(--radius) - 2px)`, `--radius-sm: calc(var(--radius) - 4px)`.
For terminal (`--radius: 0rem`) the md and sm values compute to negative
lengths.

### INV-B5 · Font families

`:12-15`. `--font-sans` is given a literal Instrument Sans stack;
`--font-display: var(--theme-font-display, var(--font-sans))` — the only
mechanism by which cyberpunk's and terminal's display faces reach a page
(INV-T8); `--font-mono` a JetBrains Mono stack, which the register depends on
(INV-F2). Re-declared for `--font-display` only at :102, so a nested
`[data-theme]` subtree switches display font but not `--font-mono`.

### INV-B6 · Status tokens are not bridged

The 14 `--status-*` tokens of INV-T6 have no `--color-status-*` alias
anywhere in the file. README.md:128-130 documents this and tells
consumers to write `bg-[var(--status-offer)]`; JobTracker instead uses
inline styles (`StatusPill.jsx:24-25`).

### INV-B7 · Consumer obligations

Using the bridge is not just an import. Measured in the consumer: a
Tailwind v4 consumer must (a) `@import 'tailwindcss'` before the bridge,
(b) declare the package as a `@source` or the classes on `ThemeSwitcher`
and `BootSequence` are never generated, and (c) supply shadcn's own base
layer if it uses shadcn — the bridge deliberately does not carry
`* { @apply border-border }` (README.md:45-47). JobTracker's
`dashboard/packages/web/src/app.css` lists two `@source` roots because npm
did not always hoist the package.

---

## G — Gates, scripts, packaging, tooling

### INV-G1 · Contrast check — what it asserts

`scripts/check-contrast.mjs`, 104 lines. For every discovered theme it
computes the WCAG contrast ratio of 21 token pairs: 20 pairs at a 4.5:1
minimum (`:23-38`) and 1 pair — `accent` / `accent-foreground` — at 3:1
(`:39-40`). The 20 are 13 surface/text pairs plus the 7 status pairs. Two
of the 13 are cross-pairs rather than a token and its own foreground:
`background`/`muted-foreground` and `card`/`muted-foreground` (:29-30),
and one treats `primary` as link text on the page background (:36).
Result today, run at inventory time: `All 7 themes pass WCAG AA on 21
pairs (incl. 7 status badges).`, exit code 0 — 147 assertions.

### INV-G2 · Theme discovery

`:17`. A regex over the stylesheet text collects every
`[data-theme='<name>']` block that declares `--background`, deduplicated.
This is why the register blocks of INV-T14 and INV-F1 are not mistaken for
palettes: they declare no `--background`. `:18` throws if fewer than five
themes are found. The theme name pattern is `[a-z]+`, so a theme named
`high-contrast` or `theme2` would be silently skipped.

### INV-G3 · Colour maths

`:49-73`. `tokenHsl` extracts `--<token>: hsl(<h>, <s>%, <l>%)` by regex;
`hslToRgb`, `luminance` (sRGB, the standard 0.03928 / 2.4 transfer) and
`ratio` implement the WCAG formula. The parser accepts only comma-form
`hsl()` with three numbers; the space-separated form and any other colour
notation would be read as a missing token.

### INV-G4 · Target-file argument

`:11`. `node scripts/check-contrast.mjs [path]` resolves an optional
argument relative to the current working directory, defaulting to
`../css/themes.css` relative to the script. This is the mechanism
`docs/SCOPE.md` S3 relies on for "a consumer that overrides a colour can
run the shipped script against its own file". Nothing in this repository
or in the three consumers actually invokes it that way today.

### INV-G5 · Failure modes

Enumerated from the code:

1. A pair below its minimum: `failures++`, one `FAIL <theme>: <fg> on
   <bg> = <ratio> (need >= <min>)` line on stderr, exit 1 (:91-97,
   :100-103).
2. A token missing or not in comma-`hsl()` form: `tokenHsl` throws, is
   caught at :86, counted as a failure with the message `token --x
   missing`. So an unparseable colour is reported as a contrast
   violation.
3. Fewer than five themes discovered: an uncaught `Error` at :18 — the
   process exits non-zero with a stack trace rather than a gate message.
4. A theme discovered but its block not re-findable by `themeBlock`
   (:45): uncaught throw. `themeBlock` matches `\{([^}]+)\}`, so any
   literal `}` inside a block (for instance in a future data-URI) would
   truncate the block and turn every token in it into failure mode 2.
5. The target file missing: `readFileSync` throws uncaught at :12.
6. Not a failure mode but a silence: only the 21 listed pairs are
   checked; a new token added to all seven themes is checked by nothing
   until it is added to `PAIRS` (INV-T23).

### INV-G6 · `STATUS_NAMES` export

`:21` exports `STATUS_NAMES`. The module is not import-safe: reading that
export runs the whole check at import time and can call
`process.exit(1)`. Nothing imports it — a dead export on a module that is
only ever run as a script.

### INV-G7 · npm scripts

`package.json:32-36`: `check:contrast` (runs the script),
`format` (`prettier --write .`), and `gates`
(`npm run check:contrast && prettier --check .`). `npm run gates` passes
at inventory time. There is no test script, no lint script and no
type-check script.

### INV-G8 · Export map

`package.json:14-21`. Six entries: `.` → `index.js`, `./fx` →
`fx/index.js`, `./css` → `css/themes.css`, `./css/tailwind-bridge`,
`./css/register`, and `./package.json`. Consequences: `hooks/` and
`components/` are shipped but **not** addressable as subpaths, so
`@kp-soft/themes/hooks/use-theme.js` does not resolve; and
`scripts/check-contrast.mjs` has no export path and no `bin` entry, so it
can only be run by file path inside an installed tree — the
`npx @kp-soft/themes check-contrast` shape floated in
`docs/REQUESTS_FROM_CONSUMERS.md:124` does not work today.

### INV-G9 · `files` array

`package.json:22-31`: `index.js`, `hooks`, `components`, `fx`, `css`,
`scripts`, `docs`, `README.md`. The published tarball therefore contains
the two verbatim kp-soft documents and this project's own procedure
documents. `CLAUDE.md`, `HANDOFF.md`, `jsconfig.json` and the dotfiles
are not shipped.

### INV-G10 · Peers, engines, flags

`package.json:37-51`: `peerDependencies` `react >=19` (required) and
`motion >=12`, the latter marked optional at :41-45; `engines.node
>=26 <27`; `devDependencies` prettier `^3.4.2` only. `:11-13`
`sideEffects: ["*.css"]` so bundlers keep the stylesheets. `:6` `"private":
true`, which blocks `npm publish` but not installation from a git tag —
which is how all consumption happens today.

The declared React peer is not optional, so a pure-CSS consumer
installing the package still gets a React peer requirement. Installed in
this repository: prettier 3.x and react 19.2.8 (npm auto-installed the
peer); `motion` is not installed, so `fx/boot-sequence.jsx` cannot
resolve its import here.

### INV-G11 · `index.js` barrel

15 lines. Re-exports `ThemeSwitcher` as a named export (:1) and ten
symbols from the hook (:2-13): `DEFAULT_THEME`, `STORAGE_KEY`,
`THEME_LABELS`, `THEME_META`, `THEMES`, `applyTheme`, `initializeTheme`,
`isTheme`, `useAppearance`, `useTheme`. Plus two JSDoc typedef
re-exports, `Theme` and `UseThemeOptions` (:14-15), which JobTracker
imports as types. The barrel exports no fx and no CSS. Importing it pulls
React in, so a non-React consumer has no JavaScript entry point at all.

### INV-G12 · Node pin

`.nvmrc`, one line: `26`. Matches `engines` (INV-G10). Local Node is 26.8.1.

### INV-G13 · Prettier configuration

`.prettierrc`, 16 lines: `semi`, `singleQuote`, `printWidth: 150`,
`tabWidth: 4`, `htmlWhitespaceSensitivity: css`, plus a YAML override to
`tabWidth: 2` — for which there is no `.yml` file in the repository.
`.prettierignore`, 4 lines, excludes `docs/`, `node_modules/` and
`package-lock.json`; the stated reason is that `docs/` holds verbatim
copies. Effect: `docs/SCOPE.md`, `docs/CORRECTIONS.md` and the other
project-owned documents are also unformatted and unchecked. `prettier
--check .` passes today.

### INV-G14 · `jsconfig.json`

23 lines. `checkJs: true`, `strict: true`, `noImplicitAny`,
`noImplicitReturns`, `jsx: react-jsx`, `moduleResolution: bundler`,
including `index.js`, `hooks`, `components`, `fx`, `scripts`. There is no
`typescript` dependency and no script that runs `tsc`, so nothing in this
repository ever executes these settings; they serve only an editor with
its own TypeScript. The JSDoc annotations throughout `hooks/`,
`components/` and `fx/` are therefore unchecked here.

### INV-G15 · `.gitignore`

One line, `node_modules/`.

### INV-G16 · `package-lock.json`

Tracked in git, lockfile version 3, three packages (root, prettier,
react). Its root entry records `"version": "0.1.0"` while
`package.json` says `0.1.1` — the lock was not regenerated for the 0.1.1
bump (its only commit is `d85ea47`, the 0.1.0 extraction). It also
records no `motion` entry.

### INV-G17 · Tooling that is absent

Observed absences, listed so Phase 2 can reference them: no test of any
kind (no test runner, no test file, no `tests/` or `__tests__`
directory); no `.github/` directory and therefore no CI; no git hooks and
no `core.hooksPath` configuration in the repository; no LICENSE file
(README.md:176 says a license is a Phase 3 decision); no CHANGELOG; no
`bin` entry; no `.editorconfig`; no ESLint configuration; no
`.npmrc`; no HTML file and no showcase page; no machine-readable palette
export (JSON/TOML) of the kind `docs/SCOPE.md` S5/S16 anticipates.

### INV-G18 · Version and tag surface

`package.json` version 0.1.1. Two annotated tags: `v0.1.0` (`d85ea47`)
and `v0.1.1` (`eeaf85d` → `7cd2e8d`). `git diff v0.1.1..HEAD` over
`css/`, `index.js`, `hooks/`, `components/`, `fx/`, `scripts/` and
`package.json` is empty: every commit since the tag is documentation. The
consumers pin or record `v0.1.1`, so the shipped artefacts and the
working tree are identical today.

---

## D — Documentation

### INV-D1 · README.md

213 lines, the consumer-facing document: install snippet, CSS import
recipes for plain CSS and Tailwind, the Bunny Fonts link tag, the
`data-theme` / `.dark` contract, the JavaScript API, the status-token
table, the contrast-gate commands, the register's shadcn caveat, the
provenance paragraph, a "what is NOT here" list, the npm-12 git-install
note, the `@source` requirement, and the `labels` prop. Accurate on the
substance; three concrete drifts are listed in INV-D10.

### INV-D2 · CLAUDE.md

74 lines, project instructions loaded by every session in this directory:
project identity, consumers, enforcement, the KT1 project rule, the
procedure-status table, what Phase 1 and 2 inherit, and the document
table. Current as of commit `5c378b9` — see the note under INV-D10.

### INV-D3 · HANDOFF.md

59 lines, Dutch, the start prompt for the next session. States Phase 0 is
closed, points at SCOPE, MINI_ROUNDS, REQUESTS_FROM_CONSUMERS, names
Phase 1 as the next step and corrects the earlier claim about the
elicitation widget.

### INV-D4 · docs/SCOPE.md

324 lines. The approved Phase 0 scope: 18 statements plus INV-B1, marked
APPROVED 2026-09-03, with an "adjusted during the gate" note under
several statements and a list of open questions carried into Phases 1
and 2. Non-code artefact; treated here as a claim to check, not as
evidence.

### INV-D5 · docs/legacy/THEMING.md

78 lines, a verbatim copy of kp-soft's maintainer guide taken at commit
`2983abb` (header line 1 says so). It describes kp-soft's file layout —
`resources/css/app.css`, `resources/js/hooks/use-appearance.tsx`,
`routes/settings.php`, `tests/Feature/ThemeSyncTest.php` — none of which
exist here, and it names gates (TypeScript, a PHP feature test,
pre-commit) that do not run in this repository. Its description of the
mental model, the register layer and the taste rules ("texture opacity at
or under ~6 %", "a theme changes tokens, never component markup") does
apply to the code in this package.

### INV-D6 · docs/legacy/CYBERPUNK_THEME_RESEARCH.md

83 lines, also verbatim from kp-soft. Live findings from cyberpunk.net,
n-o-d-e.net, Arwes and Cyberpunk 2077, the "five pillars", and technique
notes. The techniques it prescribes are visibly implemented: the single
clipped corner (INV-F5), the opacity-only glow pulse (INV-F13), the two-copy
chromatic aberration (INV-F14), scanlines as a repeating gradient (INV-F1), the
reduced-motion wrapper (INV-F11) and the settle-left-to-right decipher (INV-F20).
It is the only per-theme character document that exists — the other six
themes have none.

### INV-D7 · docs/CORRECTIONS.md

80 lines. One correction, KT1, approved 2026-09-03 across nine fields: a
checkable claim asserted in a gate form without checking it. Its field 6
says the resulting rule "lives in this project's `CLAUDE.md`" — it does
not (INV-D10).

### INV-D8 · docs/MINI_ROUNDS.md

10 lines, one table row: KT1-M1, open, triggering at the Phase 2 decision
form.

### INV-D9 · docs/REQUESTS_FROM_CONSUMERS.md

159 lines, written by the JobTracker session on 2026-09-03. Three
sections: three consumers building the same picker (with kyu's shipped
markup contract), the contrast gate not reaching consumers, and four
smaller findings. It is the source of several claims that
`docs/SCOPE.md` later carries forward.

### INV-D10 · Contradictions between the documents and the code

Each verified against the code. Four claims about `CLAUDE.md` were made
in the first draft of this inventory and are withdrawn — see the note at
the end of this section.

1. **Consumer list.** `CLAUDE.md` and `README.md:9-10` name JobTracker
   and kp-soft as the consumers. Verified: kp-soft does **not** depend on
   this package — kp-soft's own manifest has no
   `@kp-soft/themes` entry, and it still carries its own
   `resources/js/components/fx/*.tsx`, its own `scripts/check-contrast.mjs`
   and its own CI step running it. The actual consumers are JobTracker
   (npm, git tag) and kyu + Almanac (vendored CSS), which is what
   `docs/SCOPE.md` says.
2. **`allow-git` value.** `README.md:185` instructs consumers to set
   `allow-git=root` and calls it measured on 2026-09-02.
   `docs/SCOPE.md` S8 and JobTracker's actual `dashboard/.npmrc` both use
   `allow-git=all`, because `root` covers only the root package and the
   theme package is declared in a workspace.
3. **Install pin in the README.** `README.md:18` pins
   `github:kennypassenier/kp-themes#v0.1.0`; the package is 0.1.1 and
   JobTracker pins `#v0.1.1`.
4. **License reasoning.** `README.md:176` lists the absence of a license
   under "what is not here", giving "private package" as the reason.
   `docs/SCOPE.md` S8 records that the GitHub repository is public. The
   reason is therefore stale even if the conclusion (no license yet,
   decided in Phase 3) still stands.

   *Not* a contradiction, though it reads like one: `package.json:5` sets
   `"private": true`. That flag stops an accidental publish to the npm
   registry and says nothing about the GitHub repository's visibility.
   The two are independent.
5. **Register ownership of the fx classes.**
   `docs/REQUESTS_FROM_CONSUMERS.md:145-146` says `.fx-notch` and
   `.microlabel` "belong to the React `fx/` components". No component in
   `fx/` or `components/` emits any of them (INV-F25); they are hooks for
   consumer markup.
6. **`docs/legacy/THEMING.md` describes another repository.** Its "adding a
   theme = two edits" instruction names `resources/css/app.css` and
   `resources/js/hooks/use-appearance.tsx`, and its gate table names a
   PHP test and a TypeScript gate. In this repository the equivalent
   files are `css/themes.css` and `hooks/use-theme.js`, and neither of
   those two gates exists.
7. **Register vs. `themes.css` split for cyberpunk.** `README.md:30` says
   `@kp-soft/themes/css` is "the seven themes + textures"; the cyberpunk
   texture is not in that file but in the register (INV-T14, INV-F1).
8. **`package-lock.json` is a version behind.** It records
   `"version": "0.1.0"` at both the root and the package entry, while
   `package.json` is at 0.1.1.
9. **`docs/SCOPE.md` S7 on Almanac's staleness check.** Verified as
   correct: `almanac/.claude/hooks/gates.sh:41-86` diffs
   `static/themes.css` (from the `/* @kp-soft/themes` marker onward)
   against `$HOME/Projects/kp-themes/css/themes.css` and fails the commit
   on a difference, printing a warning instead when the source is not on
   the machine. kyu has no equivalent, as S7 says. Note the reverse
   coupling: that gate depends on this repository sitting at a fixed
   absolute path.

**Withdrawn claims, and why they were made.** The first draft of this
inventory reported four contradictions in `CLAUDE.md`: a stale status
table, an incomplete document table, the claim that the CLI cannot render
the gate form, and a missing KT1 rule. All four were checked against the
file on disk and are false — `CLAUDE.md:25` carries the KT1 rule, its
status table reads "Phase 0 — Idea & scope, complete", and its document
table lists all eight documents. Every one of those four statements was
true of the version committed before `5c378b9`, which closed Phase 0
earlier the same day. The likely cause is that project instructions are
injected into an agent at start-up from a copy taken earlier in the
session, so an agent can read a file that has since changed underneath
it. Worth knowing for any future inventory: an agent's view of
`CLAUDE.md` is not necessarily the file on disk, and a claim about it
gets re-read before it is believed.

---

## Cross-cutting summary

**External dependencies (runtime).** `react >= 19` — hooks
(`useCallback`, `useEffect`, `useState`, `useRef`,
`useSyncExternalStore`) and JSX in `hooks/`, `components/` and `fx/`
(INV-G10, C, F19-F22). `motion >= 12`, optional — only
`AnimatePresence` and `motion.div` in `fx/boot-sequence.jsx:1` (INV-F19).
Tailwind CSS v4, not declared as a dependency at all, but required for
`css/tailwind-bridge.css` to parse (`@theme`, `@custom-variant`) and for
`ThemeSwitcher` and `BootSequence` to have any layout (B, INV-C13).
shadcn/ui markup conventions, not a code dependency but a markup
dependency of 44 register lines (INV-F17).

**External dependencies (tooling).** `prettier ^3.4.2` — the only
devDependency, used by `npm run format` and the `gates` script (INV-G7, INV-G13).
Node >= 26 < 27 (INV-G10, INV-G12), using only `node:fs` and `node:process` in
`scripts/check-contrast.mjs`.

**Fonts.** Not shipped and not fetched by any code in the package. The
themes name Fraunces, Chakra Petch, Share Tech Mono, Instrument Sans and
JetBrains Mono (INV-T8, INV-T9, INV-B5); README.md:49-64 documents a Bunny Fonts
`<link>` the consumer must add. Absent it, three themes fall back
silently.

**Storage formats.** Two, both browser-side, both plain strings:
`localStorage['theme']` = one of the seven theme names (INV-C4), and
`sessionStorage['fx-booted']` = `'1'` (INV-F19). No server storage, no files
written by any code in the package. The DOM itself carries state:
`<html data-theme="…">` and the `dark` class (INV-C6), plus the
`data-theme-switcher` marker attribute (INV-C10).

**Network endpoints.** None. No code in the repository performs an HTTP
request, opens a socket or references a URL at runtime. The only URLs in
the package are the `data:image/svg+xml` textures inlined in
`css/themes.css` (INV-T14), the Bunny Fonts link inside a README code block,
and the repository URL in `package.json:9`.

**CLI surface.** One executable: `node scripts/check-contrast.mjs
[path/to/css]` (INV-G4), reachable as `npm run check:contrast`. Two more npm
scripts: `format` and `gates` (INV-G7). No `bin`, so nothing is exposed as a
command in a consumer's `node_modules/.bin`.

**UI surface.** One rendered component, `ThemeSwitcher` — a button with a
palette icon opening a seven-item listbox (INV-C10) — and four cyberpunk
effect components (F19-F22). Plus the purely CSS surfaces: the texture
layer (INV-T13), the heading and selection flourishes (T15-T19), the three
glow utilities and the gradient text (T20-T21), and the sixteen register
effects (F1-F16).

**Consumers, verified in their own repositories.**

| Consumer | How | What it uses |
| --- | --- | --- |
| JobTracker | npm, `github:kennypassenier/kp-themes#v0.1.1` in `dashboard/packages/web/package.json:13`, `allow-git=all` + `engine-strict` in `dashboard/.npmrc`, Dependabot weekly on `/dashboard` | all three CSS entry points (`src/app.css`); `applyTheme`, `initializeTheme` (`src/main.jsx`), `isTheme` + the `Theme` typedef (`src/lib/theme.js`), `ThemeSwitcher` with `labels` and `themeOptions.fallback` (`src/components/Layout.jsx:43-47`), the `--status-*` tokens (`src/components/StatusPill.jsx:24-25`). Does not use `fx/`. Emits no `data-slot`. |
| kyu | vendored copy of `css/themes.css` at `static/themes.css`, header naming v0.1.1 and commit `7cd2e8d`; byte-identical below the header | the token layer only, plus its own `static/theme.js` picker and `static/theme-bridge.css` Bootstrap mapping. No staleness gate. |
| Almanac | vendored copy at `static/themes.css`, same header; byte-identical below the header | the token layer, its own picker and bridge, and a commit-time staleness gate at `.claude/hooks/gates.sh:41-86` that diffs against `$HOME/Projects/kp-themes/css/themes.css`. |

Note the coupling this creates in the other direction: Almanac's gate
depends on this repository existing at a fixed absolute path, and on
`css/themes.css` not changing without both copies being refreshed.

---

## Ecosystem findings (Phase 1)

Consulted `~/Projects/dev-procedure/ECOSYSTEM.md` in full on 2026-09-03.
These findings feed the mandatory Phase 2 item "ecosystem integration";
they are observations here, not decisions.

kp-themes is unusual against this registry: it is a package of static
assets with no process, no server, no state on disk and no credentials.
Most components in the registry integrate with something that *runs*.
That rules several of them out cleanly rather than vaguely.

**Not applicable, with the reason:**

- **latch** (encrypted `.env` secrets) — kp-themes holds no secrets. It
  publishes colours.
- **HTTPSwitchboard** (message-shape translation) — nothing here sends
  or receives messages.
- **almanac** (calendar gateway) — no events, no calendar.
- **kyu-runner** (hub to Home Assistant) — nothing here needs Home
  Assistant to react.
- **BinaryPuzzleToolkit**, **docgen**, **Huurbeheer** — unrelated
  domains; the last two are themselves registered as non-components.
- **Norm N1** (handle SIGTERM) — there is no process to signal.

**Genuine candidates, to be put to Kenny in Phase 2:**

1. **kyu as the release channel for vendoring consumers.** This is the
   strongest match in the registry, and it lands exactly on the hole
   S7 and S10 leave open. Almanac and kyu vendor a copy of
   `css/themes.css`; neither has npm, so Dependabot cannot reach them,
   and today the only mechanism is the provenance header telling a human
   to re-copy. A tag here could publish to a kyu topic
   (`POST /t/<topic>`, the whole contract is three verbs over plain
   HTTP), and a consumer's own build could check that topic. Against it:
   both consumers already sit on the same machine as this repository,
   and Almanac already runs a commit-time comparison against the
   upstream file — which is simpler and needs no hub at all. The Phase 2
   item should offer both, with the local comparison as the cheaper
   default.

2. **Norm N2 applied to a release that has no binary.** The norm exists
   so the orchestrator can verify what it installs. kp-themes ships no
   binary, but its release is exactly what two consumers copy by hand. A
   `SHA256SUMS` beside each tag would let a vendoring consumer verify
   its copy is byte-identical to a named release rather than trusting a
   comment. That is the same guarantee the norm buys, applied to a CSS
   file, and it is cheap.

3. **homelab, only if the showcase page needs a home.** S13 puts a
   static review page in this project. Static hosting has a much cheaper
   answer (GitHub Pages, or simply opening the file), and a homelab
   stack for a page with no server is ceremony. Raise it, recommend
   against it, and record the reason rather than leaving it unasked.

**For the other mandatory Phase 2 items, what Phase 1 already
establishes:**

- *Update and distribution:* two mechanisms already exist and disagree —
  a pinned git tag over npm for JobTracker, a hand-copied file for
  Almanac and kyu. `docs/SCOPE.md` records that the first has never been
  observed working: no tag since v0.1.1, so no Dependabot PR has ever
  appeared.
- *Backup and restore:* the repository is the state, and GitHub is the
  copy. There is no runtime state to lose. This looks like the "state in
  git" pattern and should be recorded as such rather than left implicit.
- *Data and config location (standing rule 28):* nothing is written to
  disk at runtime. The only state this package creates lives in the
  visitor's browser under the `localStorage` key `theme` — which is a
  contract value shared with three consumers, not an operational knob,
  and changing it silently loses every visitor's stored choice.

---

## Unverified

Everything below is present in the code and exercised by no test, no
gate and no consumer in this repository or the three consuming projects.
It works or fails only when a human looks at it.

**Never executed anywhere (no importer at all):**

- INV-C9 `useAppearance` — exported, zero callers here and in all three
  consumers.
- INV-G6 `STATUS_NAMES` — exported from a script nothing imports.
- INV-F19 `BootSequence`, INV-F20 `DecipherText`, INV-F21 `DigitalRain`,
  INV-F22 `ScrambleNumber`, INV-F18 the `fx/` barrel — no consumer imports
  `@kp-soft/themes/fx`; kp-soft still runs its own local `.tsx`
  originals. `motion` is not even installed here, so INV-F19 cannot resolve.
- INV-F24 the `role="text"` wrapper, being part of INV-F20 and INV-F22.
- INV-C15's absent framework-free picker — nothing to verify, recorded for
  completeness.

**CSS with no emitter and no rendering check:**

- INV-T4 chart tokens, INV-T5 sidebar tokens — declared and bridged, used by no
  markup here or in JobTracker.
- INV-T20 `.glow-primary` / `.glow-accent` / `.glow-card`, INV-T21
  `.gradient-text` — no file in the package emits these classes.
- INV-T15, INV-T16, INV-T17, INV-T18, INV-T19 — the heading, selection and display-font
  flourishes; no screenshot test, no showcase page.
- INV-T13 and INV-T14 — the texture layer and six textures; the contrast gate
  explicitly cannot see them (`css/themes.css:404-406`).
- F1-F16, the whole register: only INV-F3 (`input` / `textarea` caret) is
  known to apply at a consumer, because JobTracker imports the register
  while emitting no `data-slot` and none of the `fx-` classes. INV-F2's
  dependency on `--font-mono` from the bridge is unverified in a
  plain-CSS consumer.
- INV-F17's line accounting is a measurement of the file, not of behaviour.
- B1-B5 — the Tailwind bridge compiles and JobTracker renders with it, so
  it is exercised in a loose sense, but nothing asserts that any specific
  alias resolves; INV-B3's nested-subtree behaviour in particular has no
  test and no page in this repository to show it.
- INV-T8 and INV-T9 — cyberpunk's and terminal's fonts reach a page only through
  a Tailwind utility a consumer must write; no consumer does today.

**Gate coverage gaps:**

- INV-T23 — `--border`, `--input`, `--ring`, the five chart tokens,
  `--sidebar-border`, `--sidebar-ring` and the `--fx-signal` pair are in
  no contrast pair.
- INV-C1's swatch literals (`bg`, `fg`, `primary` in `THEME_META`) are
  duplicates of values in `css/themes.css`; nothing checks that they
  still agree.
- INV-G5's failure modes 3, 4 and 5 (uncaught throws) have never been
  triggered.
- INV-G14 — the whole JSDoc type layer is unchecked in this repository; only
  JobTracker's own TypeScript pass ever reads these types, and only for
  the symbols it imports.

**Packaging claims not exercised:**

- INV-G8 — the export map is only exercised for `.`, `./fx` is imported by
  nobody, and `./css/register` only by JobTracker. `./package.json` is
  unused.
- INV-G9 — the `files` array has never been tested by an `npm pack`; the
  package has never been published (`private: true`).
- INV-G18 — Dependabot's ability to follow a git tag is configured in
  JobTracker but has never produced a PR, because no tag has been cut
  since v0.1.1.

## Round six — the next cyberpunk (2026-09-07), series INV-R

Swept by the inventory-scout at `52bec11` after the Phase 0 gate, for
everything the new register and the effects module touch or must answer.
The document's series are per letter; this round opens `INV-R` (R for
round six). Four claims were re-checked by hand in the same session:
`fx-signal` already carries the yellow, `gates.test.mjs` pins the
`fx-flicker` keyframe by name, `check-motion.mjs` reads three
stylesheets, and `css/components.css` never writes `data-slot`.

### 1 · The current cyberpunk theme

- INV-R1 · Token source — 81 tokens under `[data-theme='cyberpunk']`: palette (`primary` magenta `themes/cyberpunk/tokens.json:35`, `accent` cyan `:59`, `destructive` `:67`), status plates `:176-229`, `color-scheme` `:233`, Chakra Petch body/display `:237,245`, `radius` 0.25rem `:241`, DI3 opt-out `stepL` 0.035 `:358-361` (`themes/cyberpunk/tokens.json:1-362`)
- INV-R2 · Existing fx tokens in the same file — `fx-signal` is **already** cyberpunk.net's yellow `hsl(55,97%,52%)` `:251-256`, `fx-notch` 14px `:262`, `fx-duration` 140ms `:272`, `fx-ease` `:277`, `fx-overprint` `:281`, `fx-scanline` `:285`, `fx-lift` 1px `:289`, `fx-shadow-offset` 0 `:293` (`themes/cyberpunk/tokens.json:248-293`)
- INV-R3 · Anatomy document — five pillars `:11-24`, load-bearing colours `:28-32`, DI3 opt-out `:41-47`, DI5 "nobody has computed" `:54-58` (stale, see INV-R32), DI6 ordering fault `:60-61`, prohibitions incl. "texture moves into the theme in L3 (TH13)" `:68-70` (not done, see INV-R5), "Open for L3" `:72-78` (stale) (`themes/cyberpunk/anatomy.md:1-78`)
- INV-R4 · The fx series in the 81-token contract — nine `fx-*` tokens, all mandatory via `findAsymmetry` (`gates/check-tokens.mjs:39-53`); fill across 24 themes: `fx-notch` 0px in 21 themes (14/6/2px in three), `fx-shadow-offset` 4px only in brutalism, `fx-duration` 0ms in retro and ticker, `fx-ease` seven distinct curves; contrast gate pairs `fx-signal`/`fx-signal-foreground` and `background`/`fx-signal` (`gates/check-contrast.mjs:61,79`), `fx-overprint` and `fx-scanline` excused `:120-122`. `--fx-texture`, `-size`, `-opacity` are **not** tokens: per-theme declarations in `css/_rules.css:19-27` etc. and, for cyberpunk, only in the register (INV-R5)
- INV-R5 · Register texture — scanlines (`--fx-scanline` at 4% alpha, 1px in 3px) plus vignette, `--fx-texture-opacity: 1`; the only place cyberpunk's texture is declared (no cyberpunk texture in `css/_rules.css`; TH13 sits unbuilt in the candidates table `docs/FEATURES.md:80`) (`css/cyberpunk-register.css:21-27`)
- INV-R6 · `.microlabel` — uppercase mono with `// ` prefix; `font-family: var(--font-mono)` **without fallback**, and `--font-mono` is declared only in `css/tailwind-bridge.css:15` (TH14 `docs/FEATURES.md:81`, unbuilt; README.md:457 says the class hooks "work on any markup") (`css/cyberpunk-register.css:31-41`)
- INV-R7 · Neon caret on input/textarea (`css/cyberpunk-register.css:44-47`)
- INV-R8 · Card underglow — selects `[data-slot='card']`, which `components/card.jsx:34` and `showcase/examples.mjs:161` write and `css/components.css` never does (zero `data-slot`), so plain `.kp-card` markup gets nothing (`css/cyberpunk-register.css:51-74`)
- INV-R9 · Clipped corner on cards and `.fx-notch` via `--fx-notch` (`css/cyberpunk-register.css:77-81`)
- INV-R10 · `.kp-button` square corner `:87-90` and the bevel `clip-path` with knob `--kp-button-notch` default 7px `:113-116` — a separate knob from the card's `--fx-notch` 14px; AR30 amendment recorded in the comment `:92-112` (`css/cyberpunk-register.css:87-116`)
- INV-R11 · Inset two-ring focus — `outline: none`, inset `--focus-ring` at `--kp-focus-ring-inner-width` (2px) and inset `--focus-ring-contrast` at twice that (`css/cyberpunk-register.css:118-124`)
- INV-R12 · Button charge sweep — `background-image` gradient, `background-position` 105% → -5% on hover, transition guarded (`css/cyberpunk-register.css:128-146`)
- INV-R13 · `.fx-brackets` corner marks (`css/cyberpunk-register.css:150-175`)
- INV-R14 · `.fx-rule` hairline with diamond — static flex `::after`, no draw-in (`css/cyberpunk-register.css:179-199`)
- INV-R15 · Themed scrollbar (`css/cyberpunk-register.css:202-223`)
- INV-R16 · `.fx-signal-badge` — comment says "this selector is doubled below"; it occurs once (`css/cyberpunk-register.css:226-232`)
- INV-R17 · Motion block under `prefers-reduced-motion: no-preference` — `.fx-flicker` 2.2s once `:238-242`, `.fx-pulse` **infinite** opacity on `::after`, knob `--fx-pulse-duration` `:246-258`, `.fx-glitch` hover-only RGB split needing `data-text` `:262-286`, `.fx-media` `:289-292`, `.fx-cellpop` `:295-297` (`css/cyberpunk-register.css:236-298`)
- INV-R18 · Keyframes `fx-flicker` (retimed after check-motion measured 5.5/s, `:300-304`), `fx-pulse`, `fx-glitch-a/b`, `fx-rgb-split`, `fx-cellflash` (`css/cyberpunk-register.css:305-397`)
- INV-R19 · Cyberpunk rules in the base layer — `::selection` `:296-299` (identical to the global one at `:427-430`), `.glow-primary/.glow-accent/.glow-card` `:301-325`, `.gradient-text` `:328-333`; cyberpunk deliberately absent from the per-theme signature block `:534-535` (`css/_rules.css`)
- INV-R20 · Research document — T1 sections `:3-84`; round six section `:85-178`: cyberpunk.net navbar `clip-path` verbatim `:101-103`, buttons and `--rotated` notch `:107-114`, tear as SVG `:115-120`, dossiers `:121-126`, Dribbble `:129-145`, webflow glitch (4s infinite, rejected) `:146-157`, heading lines `:158-166`, libraries `:167-178` (`docs/legacy/CYBERPUNK_THEME_RESEARCH.md`)
- INV-R21 · Gate code that names cyberpunk — `check-motion.mjs:33` (three-file CSS list), `compliance.mjs:42-45` (DI5 scope = themes the register selects) and `:49-65`, `gates.test.mjs:114-118` (pins `fx-flicker` **by name** at 2200ms; breaks when the keyframe is renamed), `gates.test.mjs:142` (KT2 opt-out pair), `check-invariants.mjs:114,188`, `colour.mjs:144,183`, `config.json` `stateVisibilityFloor.why`, `check-layers.mjs:36`, `checksums.mjs:35`, `check-migration.mjs:45`, `generate-bundle.mjs:39`, `check-utilities.mjs:54`, `generate-examples.mjs:31`, `generate-showcase.mjs:134,231`, `gates/site/chrome.mjs:64-65`
- INV-R22 · Home Assistant output — `ha/kp-cyberpunk.yaml` generated from the tokens; `accent-color` ← `fx-signal` (`gates/generate-ha-themes.mjs:44`), card transition ← `fx-duration`/`fx-ease` (`:106`); a palette change regenerates it (`npm run check:ha`)

### 2 · Components and base elements the register must answer

- INV-R23 · Component roots — **64** `.kp-*` roots in `css/components.css`: accordion 1135, alert 557, badge 445, breadcrumb 1182, button 281, card 459, cell-break/-truncate 822, col-low 1920, colorpicker 2455, combobox 1459, confirm 987, copyable 261, datatable 800, datepicker 2256, dialog 965, diff 2098, empty 192, error 229, field 614, fieldset 740, footer 220, form 1939, grid 2520, grid-wrap 2514, health 257, icon-button 1327, id 151, masked 174, menu 1045, nav 895, nav-wrap 885, numeric 163, pagination 1183, palette 1584, popover 1025, progress 1210, reorder 2195, shortcuts 1595, skeleton 1223, skip-link 204, spinner 1263, split 2224, sr-only 2139, swatch 18, tab 1158, table 850, table-wrap 783, tabs 1152, tag 1545, tag-list 1536, theme-group 39, theme-menu 1351, theme-option 1404, timeline 2060, timestamp 164, toast 1102, toasts 1090, tooltip 1082, tree 2153, truncate 182, upload 2328, url 150, wizard 2390
- INV-R24 · Button states — `:focus-visible` 319, `:hover:not(:disabled)` 341, `:active:not(:disabled)` 345, `:disabled` 349, `--primary` 357, `--destructive` 378, `--ghost` 399, `--sm` 431, `--lg` 437, `__undo`; busy is `[aria-busy='true']` in `css/layout.css:156` only (set by `js/forms.js`, `components/form.jsx`, `flow.jsx`, `datatable.jsx`) (`css/components.css:281-445`)
- INV-R25 · Field states — `__label` 623, `__input` 628, `__help` 690, `__error` 697, `--invalid` 702/776, `__check` 758, `__required` 1976, fieldset 740/1928, form summary 1951 (`css/components.css`)
- INV-R26 · Other stateful roots — badge `[data-status]`, health `[data-state]`, tab/datepicker `[aria-selected]`, nav `__link[aria-current='page']` 941, menu `__item:hover` / `--destructive`, toast `--success/--warning/--info/--error` 1113-1125, upload `[data-kp-dragging]`, diff `[data-kind]`, combobox/palette `__option[hidden]` (`css/components.css`, per INV-R23 lines)
- INV-R27 · Base-element layer — `body` font 279, `h1-h3` display face 283-286, links 410-422, `::selection` 427, `code/kbd/samp/pre` 433-469, **`mark`** 471-475 (warning pair), `blockquote` 477, `hr` 488-493, `::marker`, `accent-color`/`caret-color` 501-503, `::placeholder`, `:disabled`, `:invalid` 515-518, two-ring `:focus-visible` 359-380, `color-scheme` 392; no `em`/`strong`/table rules (tables are `.kp-table` only) (`css/_rules.css`)
- INV-R28 · Per-theme signature block (heading accents already exist) — formal `h1::after` rule 538-546, terminal field cursor 566-573, forest drift, blueprint `h1::after`, deco double rule, academia, woodblock `h1::after`, phantom badge, solstice `[data-slot='card']` ember, pastel settle (`css/_rules.css:536-717`)
- INV-R29 · Register coverage today — cyberpunk register reaches `.kp-button` (INV-R10 to INV-R12), cards only via `data-slot` (INV-R8), inputs' caret, scrollbar: **2 of 64 roots**; retro register reaches button/card/popover/icon-button `:15-24`, their focus `:40-48` and active `:52-61`, field/datatable-search/combobox/palette inputs `:65-75`, scrollbar `:79-81`: **8 roots** (`css/retro-register.css`). No register rule anywhere for field label/help/error, nav, toast, dialog, menu, tabs, badge, alert, tag, table, headings, links, `mark`, `hr`, footer

### 3 · Effects and JS infrastructure

- INV-R30 · `js/auto.js` — the one side-effecting module (`package.json` `sideEffects`), `attachAll(root)` calling 18 attach functions `:37-57`, DOMContentLoaded boot `:63-68`; a new `attachEffects` would be added here to reach `dist/kp-themes.js` (`js/auto.js:14-68`)
- INV-R31 · Attach convention — every module exports `attachX(root = document, options) → detach` (`js/combobox.js:96`, `colorpicker.js:64`, `datatable.js:142`, `components.js:273,403`, `palette.js:124`, `overlays.js:50,127`, `patterns.js:52`, `structure.js:96`, `forms.js:181`, `tables.js:70`, `datepicker.js:109`, `gridlayout.js:146`, `theme-picker.js:99`, `wizard.js:66`, `upload.js:86`); ~150 distinct `data-kp-*` descriptor names; **no** `data-kp-surface`, `-reveal`, `-accent`, `-divider`
- INV-R32 · DI5 computation exists — `gates/check-motion.mjs`: constants 3/s and 10% `:18-19`, `parseOpacityKeyframes` `:56-89`, `flashesPerSecond` (worst-case opacity bound) `:102-116`, `animations()` `:131-140`, `unguardedMotion` (only `no-preference` blocks count) `:144-167`, `unsubscribedPreferenceReads` over `fx/*.jsx` only `:179-190`; reads three files `:33` (not `retro-register.css`, not `layout.css`, not any JS); `OUT_OF_SCOPE` by keyframe name `:41-53`. **Blind to** JS-driven effects (decipher, slice, redaction transitions), CSS `transition`s that change luminance, and `clip-path`/`transform` animations. `anatomy.md:54-58` and `docs/DESIGN_INVARIANTS.md:271-274` still say nobody computed it
- INV-R33 · Reduced motion today — CSS guards `no-preference` (`cyberpunk-register.css:66,136,236`, `_rules.css:536`); React `useReducedMotion` subscribing store, SSR snapshot `true` (`fx/use-reduced-motion.js:16-37`); **no framework-free helper**: no `js/*.js` mentions `prefers-reduced-motion`
- INV-R34 · React effects — barrel `fx/index.js:9-12` (DecipherText, DigitalRain, ScrambleNumber, useReducedMotion; BootSequence separate, needs `motion`); `effectActive(when, theme)` default `'cyberpunk'` (`fx/when.js:17-22`); `DecipherText` rAF, time-based `charsPerSecond` 30, `aria-label` + `aria-hidden` glyph span (`fx/decipher-text.jsx:31-98`); React-only (README.md:300-304)
- INV-R35 · Theme detection for "only the active theme's answers" — `currentTheme()` reads `data-theme` on root (`js/theme-core.js:194-203`), `onThemeChange` `:307`, `kp-theme-change` event `:47`; React `useTheme` wraps the same store (`hooks/use-theme.js:114-115`)
- INV-R36 · `js/contrast.js` exports — `parseHsl` 23, `formatHsl` 30, `hslToRgb` 37, `rgbToHsl` 55, `luminance` 76, `contrast` 87, `hsl` 93, `tokenColour` 106, `meets` 125; gate-side twin `gates/colour.mjs` (used by `tests/registers.spec.mjs:10`)
- INV-R37 · Event vocabulary a new effect would extend — `kp-theme-*` (`theme-core.js:47-58`), `kp-form-valid/invalid/field-validity/done` (`forms.js:56-68`), `kp-toast-show/hide`, `kp-dialog-open`, `kp-tab-change` (`overlays.js:31-36`), `kp-action-commit/undo`, `kp-copy` (`patterns.js:37-43`); no `kp-effect-*`
- INV-R38 · Site descriptors claim DI5 coverage for spinner and skeleton "the motion gate measures that" (`gates/site/descriptors.mjs:1302,1339`) — true only for opacity keyframes

### 4 · Test infrastructure the round reuses

- INV-R39 · `tests/ring.mjs` — `tabTo` 26-33, `wearTheme` 36, `shadowLayers` 45-61, `lengths` 64, `indicator` (clone baseline) 73-112, `bothHalves` (outer = outline ≥2px **or** inset contrast ring; `changed`) 125-148, `paintedFocusDelta` (both sides, best delta) 196-216, `paintedFocusPixels` 218+
- INV-R40 · Fixtures — 15 HTML + 7 JSX bundled by esbuild (`tests/global-setup.mjs:12`); both registers loaded by `button.html:15-16`, `dashboard.html:15-16`, `bundle-loose.html:8-9`; `components.html` loads **no** register (`docs/FEATURES.md:285`); per-theme bare pages `showcase/themes/<name>.html` load both (`gates/generate-showcase.mjs:231-232`) and serve `fixtures.spec`, `registers.spec`, `promises.spec`
- INV-R41 · Server and ports — `tests/fixtures/server.mjs` (`PORT`, default 4173), `playwright.config.mjs:20` `KP_TEST_PORT`, chromium + firefox `:35-38`, webServer `:39-44`; `.claude/launch.json` fixtures on 4300, scratchpad (the demo) on 4310
- INV-R42 · Drill convention — 213 `test()` calls in 36 specs; "Drill [KT3]" comments name the removed rule and the red numbers (`tests/button.spec.mjs:62-67,97-100,120-121,132-134`; `registers.spec.mjs:39-43`; `bundle.spec.mjs:92`); MR-NOTCH difference-from-rest rule (`ring.mjs:176-189`)
- INV-R43 · Flake knobs — `window.kpFormHold`, `kpFormSettle`, `kpFormSettleMs` (`tests/fixtures/components.html:492-495`, `react-components.jsx:153-154`, `tests/forms.spec.mjs:116-158`)
- INV-R44 · Budgets — `CORPUS_BUDGET_MS = 10000 + DESCRIPTORS.length*1000` (`tests/site.spec.mjs:75,78,111`); `10000 + THEMES.length*1000` (`showcase.spec.mjs:151`); `examples.spec.mjs` on the 30s default; overflow widths 320/768/1280, `minBlockGap` 2 (`gates/config.json`)
- INV-R45 · Register tests today — TH110 (`button.spec.mjs` ~105-115: `border-radius` 0, gradient), clip/ring delta (~120-140), dashboard second pass under cyberpunk (`dashboard.spec.mjs:99`), retro DI1 (`registers.spec.mjs:23-46`), fx inert/reduced/aria-label (`fx.spec.mjs:17-40`), print on the cyberpunk page (`promises.spec.mjs:11-13`), `gates.test.mjs:114`
- INV-R46 · Accepted gaps — no BootSequence test, no screenshot comparison (`docs/TEST_PLAN.md:52-75`)
- INV-R47 · Commit hook runs the `gates` chain but **not** the browser suite (`.githooks/pre-commit:7` → `.claude/hooks/gates.sh`; `test:browser` absent from `gates` in `package.json`)

### 5 · The site and the examples

- INV-R48 · `gates/generate-examples.mjs` — `SHEETS` six sheets incl. both registers `:31` (reason `:24-30`), `page()` with `js/auto.js` `:38-55`, output `examples/`, index `:62+`; "ten" hard-coded in prose (`:1,63,74`; `gates.sh` echo)
- INV-R49 · `showcase/examples.mjs` — `el`/`renderHTML` `:39,283`, `EXAMPLES` `:354` with ten ids (app-shell, login, list-with-form, settings, wizard, empty-and-error, **hero** 692-729, pricing-and-testimonials, article, profile), `INLINE_STYLE_EXCEPTIONS` `:938`; rendered twice (`showcase/examples-react.jsx`, `tests/fixtures/examples.html`)
- INV-R50 · Hero example — `section.kp-section.kp-stack.kp-text-center[data-example=hero]`, `h1.kp-text-balance`, `p.kp-prose.kp-text-muted`, `.kp-row` of primary + ghost Button, second section of Cards; probes `:697` — the nearest existing page to the demo (`showcase/examples.mjs:692-729`)
- INV-R51 · `gates/check-examples-wired.mjs` — walks each descriptor for `data-kp-*` and demands them in the HTML (`:31-40+`); `check-inline-styles.mjs` refuses `style=` outside the exception list
- INV-R52 · Site shell — `gates/site/chrome.mjs` `shell()` `:26+`, links four sheets + both registers (since 2026-09-07) + `site.css` `:54-66`; 42 descriptors (`gates/site/descriptors.mjs:61-2003`); `check-site.mjs` coverage/truth/one-source; output `site/`
- INV-R53 · Showcase — `showcase/index.html:12-13` loads both registers; `showcase/specimens.mjs` has **zero** `fx-*`/`.microlabel` specimens; `showcase.css` guarded as scaffolding (`gates/check-layers.mjs:65`)
- INV-R54 · Where a template page slots — an `EXAMPLES` entry → `examples/<id>.html`, React mount, index, `examples.spec.mjs` both channels, wiring and inline-style gates; nothing else generates a standalone page

### 6 · Release and consumer surface

- INV-R55 · chassis-rs closure — `VENDORED`: `js/no-flash.js`, `js/theme-registry.js`, `js/theme-core.js`, `js/theme-picker.js`, `js/strings.js`, `js/components.js` (`gates/check-closure.mjs:59-72`); a new effects module may not be imported by any of these
- INV-R56 · Manifest — `FILES` 34 entries (`gates/checksums.mjs:33-66`) ↔ derived from `exports` under `css/`, `js/`, `dist/` plus import walk (`gates/check-manifest.mjs:1-60`); `SHA256SUMS` 34 lines; a new stylesheet or module export must join both
- INV-R57 · Bundle — `STYLESHEETS` themes, components, cyberpunk-register, retro-register, layout, utilities → `dist/kp-themes.css` (`gates/generate-bundle.mjs:36-43`); `dist/kp-themes.js` = `js/auto.js` closure `:52-63`
- INV-R58 · Release assets — `SHA256SUMS MIGRATION.md css/themes.css css/components.css dist/kp-themes.css dist/kp-themes.js` (`.github/workflows/release.yml:63-64`); registers are not separate assets
- INV-R59 · `MIGRATION.md` conventions — newest `## Coming from X to Y` first (`:12`), `### Nothing to change` / `### What does change` / per-feature sections with IDs in brackets; `gates/check-migration.mjs` checks every backticked `.kp-*` against declared classes (`:26-47`)
- INV-R60 · Export names — `./css/register` → `cyberpunk-register.css` (generic name, `package.json`), `./fx`, `./fx/*`, `./js/auto`, `./js/core`, `./js/picker`, `./js/registry`; `VERSION` `js/theme-registry.js:68`
- INV-R61 · Theme union — `ThemeName` 24 literals incl. `'cyberpunk'` (`js/theme-registry.d.ts:1`, `index.d.ts:47`); unchanged by a same-name replacement; picker lists from `THEMES` (`js/theme-picker.js:31`)
- INV-R62 · Ecosystem entry — `~/Projects/dev-procedure/ECOSYSTEM.md:410-490`: names cyberpunk among 24 `:440`, 81 properties `:436`, vendoring consumers kyu/almanac/chassis-rs `:422-425`; no statement about what any theme looks like, so S39's meaning change is a note in MIGRATION, not a contract edit; status lines `:412-413` say "3.2.0 tagged, 4.0.0 in development" while `v4.0.0` is tagged
- INV-R63 · README claims — `:10` two registers, `:452-460` hook list "work on any markup" (see INV-R6), `:300-304` fx React-only, `:400-402` flicker literal pinned by DI5

### 7 · Demo → package mapping (`signal-yellow.html`, 941 lines)

- INV-R64 · Navbar with dropdown (`:662-689`, `ul.menu > li > a.menu-link + ul.sub`, hover/focus-within glitch `:187-192`) → `NavBar` `components/nav-bar.jsx` (flat `links`, trailing `children` `:53`; no sub-menu prop) + `.kp-nav` `css/components.css:895-960`; nearest dropdown is `DropdownMenu` (`components/overlays.jsx:156-274`, button-triggered `.kp-menu`/`.kp-popover`). **No unit** for a hover sub-list or nav-item glitch
- INV-R65 · Hero surface `section.hero.on-yellow` (`:690`) → `.kp-section` `css/layout.css:96`; ground switch (`on-yellow`/`on-void` `:312-317`) — **no unit**; nearest mechanism is nested `data-theme` (ECOSYSTEM `:433-436`)
- INV-R66 · Headline decipher + one-shot slice (`:700`, script `:849-886`, keyframes `:413-429`) → `DecipherText` (React only, INV-R34); `.fx-glitch` is hover-only (INV-R17). Framework-free decipher and load-triggered slice — **no unit**
- INV-R67 · Lede with `<mark class="kp-classified">` (`:701`, CSS `:568-584`, script `:889-892`) → base `mark` `css/_rules.css:471-475`; no `.kp-lede`; classified/cleared — **no unit**
- INV-R68 · Buttons solid/ghost/danger/mirror with slit and charge (`:704-705,756-757`, CSS `:236-319`) → `Button` `components/button.jsx` / `.kp-button` INV-R24 + register INV-R10 to INV-R12; mirrored notch and slit — **no unit** (`--kp-button-notch` is single-corner)
- INV-R69 · Scroll-drawn rules (`.bracket h2 + span.rule` `:732,764`, IntersectionObserver script `:893-903`) → `.fx-rule` static (INV-R14); five themes draw `h1::after` on load (INV-R28); no `IntersectionObserver` anywhere in `js/`, `components/`, `fx/` — **no scroll unit**
- INV-R70 · Form with validation toast (`:733-760`, script `:914-933`) → `Form`/`FormField` `components/form.jsx:249,485`, `attachForms` `js/forms.js:181` (`kp-field--invalid`, summary, events INV-R37), `toast()`/`toastRegion()` `js/overlays.js:255-281`, `Toasts` `components/overlays.jsx:444`, `.kp-toast` INV-R23; checkbox → `.kp-field--check`
- INV-R71 · Dossier card with redactions (`:764-775`, `.redact` `:618-634`, script `:905-913`) → `Card` `components/card.jsx` / `.kp-card` 459; redaction that lifts — **no unit** (`.kp-masked` `css/components.css:174` is a mono muted style, not a mask)
- INV-R72 · Razor tear (`:725,780`, generated SVG `:802-847`) → **no unit**; only `hr` `css/_rules.css:488` and `.kp-menu__separator` 1013 / `.kp-split__separator` 2241
- INV-R73 · Static scanlines + vignette (`:50-60`) → register texture INV-R5 on the shared `body::after` layer (`css/_rules.css:11-21`); DI9 ceiling `textureOpacityCeiling` 0.06 (`gates/config.json`) — the register sets `--fx-texture-opacity: 1` and carries the 4% inside the gradient
- INV-R74 · Footer with tear (`:779-797`) → `.kp-footer` `css/components.css:220`; tear — no unit
- INV-R75 · Palette swatch `style="background:#7a2bff"` (`:717`) → `.kp-swatch` `css/components.css:18`; an inline style fails `check-inline-styles` if the page becomes an example
- INV-R76 · Demo motion polarity — guards use `prefers-reduced-motion: reduce` with `!important` (`:649-658`) and a JS `reduce` flag (`:800`); `check-motion.mjs:145` recognises only `no-preference` blocks and would report every demo transition/animation as unguarded once authored
- INV-R77 · Demo animation inventory for DI5 — `strip-in` 142, `slice-a/b` 195-203, `charge` 301, `slice-1/2` 413-429 (opacity 1→0 once), rule `scaleX` transition 509-518, mark clear 574-584, redact transitions 619-634 (staggered 160/320ms), toast opacity 554-562; all one-shot, none opacity-looping

### 8 · Semantic hooks (S45) — what exists

- INV-R78 · `data-kp-semantic` — the only meaning attribute: DI4 contract "must carry text or an accessible name" (`js/components.js:190-200`), emitted by `Alert` (`components/alert.jsx:44`) and badges in showcase/examples (`showcase/examples.mjs:146`, `specimens.mjs:124-134`); it asserts a property, it does not ask a theme for an expression
- INV-R79 · Emphasis — `mark` has a themed base rule (warning pair, same rule for all 24) `css/_rules.css:471-475`; `em`/`strong` have no rule anywhere; `<em>` rendering in site markdown was the MR-R6-1 decision (`docs/MINI_ROUNDS.md:33`)
- INV-R80 · Heading accent — already answered per theme in `_rules.css:536-717` (formal, blueprint, deco, academia, woodblock `h1::after`); cyberpunk answers nothing there `:534-535`
- INV-R81 · Section divider — `hr` `:488-493` is the only shared divider; no `.kp-divider`
- INV-R82 · Surface — `.kp-section` `css/layout.css:96-103`; `data-theme` on any element is the existing ground switch; no `data-kp-surface`
- INV-R83 · Reveal — no CSS/JS unit; React-only `DecipherText`; no `data-kp-reveal`
- INV-R84 · Eyebrow/lede — none; nearest `.kp-prose`, `.kp-text-muted` (`css/layout.css`) and the cyberpunk-scoped `.microlabel` (INV-R6)
- INV-R85 · Parity-gate precedent — `findAsymmetry` over `tokens.json` (`gates/check-tokens.mjs:39-53`); the only selector parser in gates is `declared()` in `gates/check-migration.mjs:26-38`; no gate checks that every theme answers a selector

### Gaps — needed by the round, no unit today

1. A framework-free effects module with attach/detach, a reduced-motion subscription (INV-R33), theme gating (INV-R35), `data-kp-*` descriptors and `kp-*` events (INV-R31, INV-R37).
2. The semantic hook vocabulary — surface, emphasis via `mark`, reveal, divider, heading accent — none exist (INV-R78 to INV-R84); no parity gate for selectors (INV-R85).
3. Navbar strip geometry, dash-prefixed dropdown, hover slice glitch on nav items (INV-R64).
4. Mirrored notch, slit flanks, one-shot charge on `.kp-button` (INV-R68).
5. Load-triggered decipher and slice in the framework-free channel (INV-R66).
6. Redaction that clears, dossier open/close (INV-R71); classified `mark` (INV-R67).
7. Generated razor tear (INV-R72); scroll-drawn hairline (INV-R69).
8. DI5 measurement for JS-driven effects, transitions and clip-path animations — `check-motion.mjs` cannot see them (INV-R32); `retro-register.css` and `layout.css` are outside its file list.
9. Register coverage of the other 56 roots: field label/help/error, nav, toast, dialog, menu, tabs, badge, alert, tag, table, headings, links, `hr`, footer (INV-R29).
10. A concept-demo template page (S46) — nothing generates a standalone page outside `EXAMPLES` (INV-R54); the demo's inline styles and `reduce`-polarity guards would fail existing gates (INV-R75, INV-R76).
11. `.fx-*` and `.microlabel` showcase specimens (INV-R53) and a framework-free reduced-motion helper (INV-R33).

### Surprises

- `fx-signal` in cyberpunk is **already** the yellow the round adopts as ground (INV-R2) — it exists today as the "rare third signal".
- `anatomy.md:54-58`, `DESIGN_INVARIANTS.md:271-274` and S42 say nobody computed the flash rate; `gates/check-motion.mjs` computes it for CSS opacity keyframes and retimed `fx-flicker` on 2026-09-04 (INV-R18, INV-R32). What is true: JS effects and transitions are uncomputed.
- `anatomy.md:68-70` says the texture moved into the theme at L3 (TH13); it did not — the register still owns it (INV-R5).
- `.microlabel` depends on `--font-mono` from the Tailwind bridge with no fallback (TH14 unbuilt, INV-R6), contradicting README.md:457.
- `.fx-signal-badge` comment claims a doubled selector that does not exist (INV-R16).
- Cyberpunk card rules select `[data-slot='card']`, so plain `.kp-card` markup gets no underglow or notch; only React and the generated pages do (INV-R8).
- `.fx-pulse` runs `infinite` — the anatomy's prohibition ("never permanent") names glitch, not pulse, but S42's "flash count for anything that repeats" reaches it (INV-R17).
- `gates.test.mjs:114-118` pins the old `fx-flicker` keyframe by name; replacing the register goes red there before any new test is written (INV-R21).
- The ECOSYSTEM entry reports 3.2.0 as the tag and 4.0.0 in development; `v4.0.0` is tagged (INV-R62).
- The commit hook and `npm run gates` never run the Playwright suite (INV-R47).
- `compliance.mjs:73` checks DI9 over five files while `check-layers.mjs:30-38` checks seven (adds `retro-register.css`, `layout.css`) — two lists that can drift.
