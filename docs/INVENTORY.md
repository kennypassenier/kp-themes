# Inventory — kp-themes (Phase 1)

Brownfield inventory of everything the repository at
`/home/kenny/Projects/kp-themes` actually contains, at commit `5c378b9`
(package version 0.1.1, git tags `v0.1.0` and `v0.1.1`). Written from the
code, not from the documentation; where a document and the code disagree,
the disagreement is recorded as its own item (D10).

Scope: every tracked file except `node_modules/`, `.git/` and the
contents of `package-lock.json` (the lock file itself is inventoried as
G16). 28 files are tracked; the 27 inventoried here hold 2 820 lines of
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
| T1 | Seven palette blocks | css/themes.css:15-398 | working |
| T2 | `:root` fallback = formal | css/themes.css:15-16 | working |
| T3 | Nineteen surface/role tokens | css/themes.css (per block) | working |
| T4 | Five chart tokens | css/themes.css (per block) | working, unused here |
| T5 | Eight sidebar tokens | css/themes.css (per block) | working, unused here |
| T6 | Fourteen status-badge tokens | css/themes.css (per block) | working |
| T7 | `--radius` per theme | css/themes.css:66,120,173,226,289,342,397 | working |
| T8 | `--theme-font-display` (3 of 7 themes) | css/themes.css:67,227,344 | half-wired |
| T9 | `--font-sans` override (terminal only) | css/themes.css:343 | declared, unused in plain CSS |
| T10 | `--fx-signal` pair (cyberpunk only) | css/themes.css:229-230 | working, ungated |
| T11 | `--fx-notch` (cyberpunk only) | css/themes.css:232 | working |
| T12 | `--fx-duration` / `--fx-ease` (cyberpunk only) | css/themes.css:234-236 | working |
| T13 | Shared texture layer `body::after` | css/themes.css:409-418 | working |
| T14 | Per-theme texture declarations | css/themes.css:421-479 | working, 6 of 7 themes |
| T15 | Pastel overprint headings | css/themes.css:452-456 | working |
| T16 | Terminal phosphor bloom headings | css/themes.css:464-467 | working |
| T17 | Terminal `::selection` | css/themes.css:469-472 | working |
| T18 | Formal display-serif headings | css/themes.css:483-487 | working |
| T19 | Cyberpunk `::selection` | css/themes.css:489-492 | working |
| T20 | `.glow-*` utilities | css/themes.css:494-512 | working, nothing here emits them |
| T21 | `.gradient-text` utility | css/themes.css:514-526 | working, nothing here emits it |
| T22 | `body` colour rule + 400 ms transition | css/themes.css:531-537 | working |
| T23 | Tokens no gate covers | css/themes.css | observation |
| T24 | Tokens that do not exist | css/themes.css | absence |
| **C — picker runtime (hook + React component)** | | | |
| C1 | `THEME_META` record | hooks/use-theme.js:8-16 | working |
| C2 | Derived constants | hooks/use-theme.js:21-33 | working |
| C3 | `isTheme` guard | hooks/use-theme.js:39-45 | working |
| C4 | localStorage read/write | hooks/use-theme.js:47-63 | working |
| C5 | Provider-free external store | hooks/use-theme.js:65-91 | working |
| C6 | `applyTheme` | hooks/use-theme.js:98-106 | working |
| C7 | `initializeTheme` | hooks/use-theme.js:112-114 | working |
| C8 | `useTheme` + precedence + revert | hooks/use-theme.js:129-174 | working |
| C9 | `useAppearance` shim | hooks/use-theme.js:178-181 | dead code here |
| C10 | `ThemeSwitcher` | components/theme-switcher.jsx:60-142 | working |
| C11 | Inline SVG icons | components/theme-switcher.jsx:11-48 | working |
| C12 | Outside-click / Escape dismissal | components/theme-switcher.jsx:72-88 | working |
| C13 | Tailwind class dependency + `[data-theme-switcher]` | components/theme-switcher.jsx:91-134 | working, conditional |
| C14 | Dutch default strings | hooks/use-theme.js:9-15, components/theme-switcher.jsx:63-64 | working |
| C15 | Framework-free picker | — | not present |
| **F — cyberpunk register and effect components** | | | |
| F1 | Register texture override | css/cyberpunk-register.css:20-26 | working |
| F2 | `.microlabel` | css/cyberpunk-register.css:30-40 | working, needs `--font-mono` |
| F3 | Neon caret | css/cyberpunk-register.css:43-46 | working |
| F4 | Card underglow | css/cyberpunk-register.css:50-68 | needs `data-slot='card'` |
| F5 | Clipped corner | css/cyberpunk-register.css:71-80 | needs `data-slot` or `.fx-notch` |
| F6 | Button charge sweep | css/cyberpunk-register.css:84-94 | needs `data-slot='button'` |
| F7 | `.fx-brackets` | css/cyberpunk-register.css:98-123 | needs the class |
| F8 | `.fx-rule` | css/cyberpunk-register.css:127-147 | needs the class |
| F9 | Themed scrollbar | css/cyberpunk-register.css:150-171 | working |
| F10 | `.fx-signal-badge` | css/cyberpunk-register.css:174-178 | needs the class |
| F11 | Reduced-motion guard block | css/cyberpunk-register.css:182-242 | working |
| F12 | `.fx-flicker` | css/cyberpunk-register.css:184-186, 244-267 | needs the class |
| F13 | `.fx-pulse` | css/cyberpunk-register.css:190-202, 269-273 | needs the class |
| F14 | `.fx-glitch` | css/cyberpunk-register.css:206-230, 275-311 | needs class + `data-text` |
| F15 | `.fx-media` RGB split | css/cyberpunk-register.css:233-236, 313-326 | needs the class |
| F16 | `.fx-cellpop` | css/cyberpunk-register.css:239-241, 328-336 | needs the class |
| F17 | Register line budget by markup requirement | css/cyberpunk-register.css | measurement |
| F18 | `fx/` barrel | fx/index.js | working |
| F19 | `BootSequence` | fx/boot-sequence.jsx | unverified, needs `motion` |
| F20 | `DecipherText` | fx/decipher-text.jsx | unverified |
| F21 | `DigitalRain` | fx/digital-rain.jsx | unverified |
| F22 | `ScrambleNumber` | fx/scramble-number.jsx | unverified |
| F23 | Shared guard pattern of the four components | fx/*.jsx | working |
| F24 | `role="text"` accessibility wrapper | fx/decipher-text.jsx:53, fx/scramble-number.jsx:36 | non-standard |
| F25 | No component emits a register class | fx/, components/ | observation |
| **B — Tailwind binding** | | | |
| B1 | `@theme` colour aliases | css/tailwind-bridge.css:11-53 | working |
| B2 | `dark` custom variant | css/tailwind-bridge.css:9 | working |
| B3 | `[data-theme]` re-declaration block | css/tailwind-bridge.css:66-103 | working |
| B4 | Radius scale mapping | css/tailwind-bridge.css:17-19, 99-101 | working |
| B5 | Font family mapping | css/tailwind-bridge.css:12-15, 102 | working |
| B6 | Status tokens are not bridged | css/tailwind-bridge.css | absence |
| B7 | Consumer obligations of the bridge | css/tailwind-bridge.css + README.md:191-207 | working, external |
| **G — gates, scripts, packaging, tooling** | | | |
| G1 | Contrast check, what it asserts | scripts/check-contrast.mjs:23-40, 75-98 | working |
| G2 | Theme discovery from the CSS | scripts/check-contrast.mjs:17-18 | working |
| G3 | Colour maths | scripts/check-contrast.mjs:49-73 | working |
| G4 | Target-file argument | scripts/check-contrast.mjs:11-12 | working |
| G5 | Failure modes | scripts/check-contrast.mjs | observation |
| G6 | `STATUS_NAMES` export + module side effect | scripts/check-contrast.mjs:21 | dead export |
| G7 | npm scripts | package.json:32-36 | working |
| G8 | Export map | package.json:14-21 | working |
| G9 | `files` array | package.json:22-31 | working |
| G10 | Peers, engines, `private`, `sideEffects` | package.json:11-13,37-51 | working |
| G11 | `index.js` barrel | index.js:1-15 | working |
| G12 | Node pin | .nvmrc | working |
| G13 | Prettier configuration | .prettierrc, .prettierignore | working |
| G14 | `jsconfig.json` type checking | jsconfig.json | configured, never run |
| G15 | `.gitignore` | .gitignore | working |
| G16 | `package-lock.json` | package-lock.json | stale |
| G17 | Tooling that is absent | — | absence |
| G18 | Version and tag surface | package.json, git tags | working |
| **D — documentation** | | | |
| D1 | README.md | README.md | present, partly stale |
| D2 | CLAUDE.md | CLAUDE.md | present, stale |
| D3 | HANDOFF.md | HANDOFF.md | present |
| D4 | docs/SCOPE.md | docs/SCOPE.md | present, approved |
| D5 | docs/THEMING.md | docs/THEMING.md | verbatim copy, foreign paths |
| D6 | docs/CYBERPUNK_THEME_RESEARCH.md | docs/CYBERPUNK_THEME_RESEARCH.md | verbatim copy |
| D7 | docs/CORRECTIONS.md | docs/CORRECTIONS.md | present |
| D8 | docs/MINI_ROUNDS.md | docs/MINI_ROUNDS.md | present, one open item |
| D9 | docs/REQUESTS_FROM_CONSUMERS.md | docs/REQUESTS_FROM_CONSUMERS.md | present |
| D10 | Contradictions between the documents and the code | — | findings |

---

## T — Theme tokens and shared CSS machinery

All of section T lives in `css/themes.css` (537 lines). The file is
imported by the export path `@kp-soft/themes/css` (G8) and vendored
verbatim by kyu and Almanac (see "Consumers" below).

### T1 · Seven palette blocks

Seven CSS blocks, one per theme, each a flat list of custom properties:
formal at lines 15-68 (selector `:root, [data-theme='formal']`), light
70-121, dark 123-174, cyberpunk 176-237, pastel 239-290, terminal
292-345, topo 347-398. Every block is self-contained; no block inherits
from another, so a token exists in a theme only if that block spells it
out.

Measured token counts per block: formal 48, light 47, dark 47, cyberpunk
53, pastel 47, terminal 49, topo 47. Forty-seven token names are common
to all seven (T3 + T4 + T5 + T6 + T7). Seven names appear in fewer than
seven blocks and are the entire asymmetry of the file:

| Token | Declared in | Item |
| --- | --- | --- |
| `--theme-font-display` | formal, cyberpunk, terminal (3) | T8 |
| `--font-sans` | terminal (1) | T9 |
| `--fx-signal`, `--fx-signal-foreground` | cyberpunk (1) | T10 |
| `--fx-notch` | cyberpunk (1) | T11 |
| `--fx-duration`, `--fx-ease` | cyberpunk (1) | T12 |

Exercised by: the contrast gate (G1) reads 21 token pairs out of every
block; JobTracker renders all seven through `ThemeSwitcher`; kyu and
Almanac ship the same file byte for byte.

### T2 · `:root` fallback = formal

`css/themes.css:15-16` binds the formal block to `:root` as well as to
`[data-theme='formal']`, so a page with no `data-theme` attribute still
gets a complete token set. Coupled to C6/C7, which are the only things in
the package that set the attribute, and to kyu's `templates/layout.html:2`
which hardcodes `data-theme="formal"` on `<html>` instead.

### T3 · Nineteen surface and role tokens

Per theme: `--background`, `--foreground`, `--card`, `--card-foreground`,
`--popover`, `--popover-foreground`, `--primary`,
`--primary-foreground`, `--secondary`, `--secondary-foreground`,
`--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`,
`--destructive`, `--destructive-foreground`, `--border`, `--input`,
`--ring`. All values are written as `hsl(h, s%, l%)` with commas — a form
the contrast script's parser depends on (G3). Fifteen of the nineteen are
covered by the gate; `--border`, `--input` and `--ring` are not (T23).

### T4 · Five chart tokens

`--chart-1` … `--chart-5` per theme (e.g. `css/themes.css:37-41` for
formal). Nothing in this repository consumes them; they are aliased into
Tailwind by B1 and left to the consumer. No contrast pair covers them.

### T5 · Eight sidebar tokens

`--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`,
`--sidebar-primary-foreground`, `--sidebar-accent`,
`--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` per
theme (formal: `css/themes.css:42-49`). Three of the four pairs are
gated (G1); `--sidebar-border` and `--sidebar-ring` are not (T23). No
markup in this package uses them.

### T6 · Fourteen status-badge tokens

Seven `--status-<name>` / `--status-<name>-foreground` pairs per theme:
draft, sent, screening, interview, offer, rejected, withdrawn. Formal
52-65, light 106-119, dark 159-172, cyberpunk 212-225, pastel 275-288,
terminal 328-341, topo 383-396. These are the only tokens added in this
package rather than extracted from kp-soft (`css/themes.css:7`). They
encode JobTracker's application-pipeline semantics, not a general
severity scale.

Exercised by: the gate checks all seven pairs in all seven themes (49
assertions), and JobTracker's `dashboard/packages/web/src/components/StatusPill.jsx:24-25`
reads them directly as `var(--status-${phase})`.

### T7 · `--radius` per theme

One value per theme: formal `0.375rem` (:66), light `0.5rem` (:120), dark
`0.5rem` (:173), cyberpunk `0.25rem` (:226), pastel `1rem` (:289),
terminal `0rem` (:342), topo `0.625rem` (:397). Nothing in this package's
plain CSS applies it; it reaches a page only through the Tailwind radius
scale (B4). Note that F5 sets `border-radius: 0` on cyberpunk cards and
buttons, overriding the theme's own `0.25rem`.

### T8 · `--theme-font-display`

Declared by three themes: formal `'Fraunces', Georgia, …` (:67),
cyberpunk `'Chakra Petch', 'JetBrains Mono', …` (:227), terminal
`'Share Tech Mono', …` (:344). In plain CSS the token is read exactly
once, at `css/themes.css:485`, and only for `[data-theme='formal'] h1, h2`
(T18). Cyberpunk's and terminal's display faces are therefore never
applied by this stylesheet. The package offers two ways to reach them:
the Tailwind `--font-display` alias (B5), or a consumer writing its own
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

### T9 · `--font-sans` override in terminal

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

### T10 · `--fx-signal` / `--fx-signal-foreground`

`css/themes.css:229-230`, cyberpunk only, described in the comment as
"the rare third signal colour". Read by F10 in the register. No other
theme declares them, so `.fx-signal-badge` is inert elsewhere — and this
pair is the one colour pair in the file the contrast gate never checks
(T23).

### T11 · `--fx-notch`

`css/themes.css:232`, cyberpunk only, `14px`. Read by F5's `clip-path`
with a `var(--fx-notch, 0px)` fallback, so themes that do not declare it
clip nothing.

### T12 · `--fx-duration` / `--fx-ease`

`css/themes.css:234-236`, cyberpunk only, `140ms` and a custom cubic
bezier. Read by F4 (`var(--fx-duration, 200ms)`) and F6
(`var(--fx-duration, 140ms)`), both with literal fallbacks. Note the two
fallbacks differ from each other.

### T13 · Shared texture layer

`css/themes.css:409-418`: one `body::after` pseudo-element, `position:
fixed`, `inset: 0`, `z-index: 80`, `pointer-events: none`, painting
`var(--fx-texture, none)` at `var(--fx-texture-opacity, 0)`. A theme that
declares no texture renders a fully transparent layer rather than
nothing. This is the only rule in the package that touches `body`
besides T22, and the only one that assumes a `<body>` element exists.

Coupling: the layer sits at z-index 80; `BootSequence` (F19) renders at
`z-[90]` and the switcher's listbox at `z-50`, so the texture paints over
the picker and under the boot overlay.

### T14 · Per-theme texture declarations

Six declarations, each adding `--fx-texture` (+ size, + opacity) to a
theme block that already exists above: formal, an inline SVG turbulence
grain at 3.5 % (:421-425); light, a two-scale millimetre grid at 5 %
(:428-436); dark, a twelve-star SVG starfield at 50 % opacity of an
already faint image (:439-443); pastel, SVG risograph grain at 5 %
(:446-450); terminal, a repeating scanline gradient at opacity 1, the
gradient itself being 6 % alpha (:459-462); topo, an SVG contour drawing
at 6 % (:475-479).

The seventh theme, cyberpunk, has no texture in this file. Its texture
(vignette + scanlines) is declared in `css/cyberpunk-register.css:20-26`
(F1), which means a consumer that imports only `@kp-soft/themes/css` —
which is exactly what kyu and Almanac vendor — gets a cyberpunk theme
with a blank texture layer.

### T15 · Pastel overprint headings

`css/themes.css:452-456`: `h1, h2` under `[data-theme='pastel']` get a
2 px offset `text-shadow` in a second ink. Works on any markup with
headings.

### T16 · Terminal phosphor bloom

`css/themes.css:464-467`: `h1, h2` under `[data-theme='terminal']` get an
8 px green glow.

### T17 · Terminal `::selection`

`css/themes.css:469-472`: green plate, near-black text, for selected text
in the terminal theme.

### T18 · Formal display-serif headings

`css/themes.css:483-487`: `h1, h2` under `[data-theme='formal']` use
`var(--theme-font-display)` with `letter-spacing: -0.01em`. The single
plain-CSS consumer of T8.

### T19 · Cyberpunk `::selection`

`css/themes.css:489-492`: magenta plate with dark text.

### T20 · `.glow-primary`, `.glow-accent`, `.glow-card`

`css/themes.css:494-512`. Three opt-in classes scoped to
`[data-theme='cyberpunk']`: two multi-layer `text-shadow` glows and one
`box-shadow` card ring. They are declared in `themes.css`, not in the
register, so a consumer that skips the register still gets them. Nothing
in this repository emits these class names (verified: zero hits in
`components/` and `fx/`).

### T21 · `.gradient-text`

`css/themes.css:514-519` defines a theme-driven gradient text fill from
`var(--primary)` to `var(--ring)`; `:521-526` overrides it for cyberpunk
with literal magenta/cyan. Unscoped — the base rule applies in every
theme. Nothing in this repository emits the class.

### T22 · `body` colour rule

`css/themes.css:531-537`: `body { background-color: var(--background);
color: var(--foreground); transition: background-color 400ms ease, color
400ms ease; }`. Header comment (:528-530) records it as the plain-CSS
equivalent of kp-soft's Tailwind `@apply`. This is the rule that makes
the theme govern the page rather than only the components, and the one
`docs/SCOPE.md` S6 and `docs/CORRECTIONS.md` KT1 both cite.

### T23 · Colour pairs no gate covers

Tokens declared in every theme but never appearing in the contrast
script's pair lists (`scripts/check-contrast.mjs:23-40`): `--border`,
`--input`, `--ring`, `--chart-1` … `--chart-5`, `--sidebar-border`,
`--sidebar-ring`. Also ungated: the cyberpunk-only pair `--fx-signal` /
`--fx-signal-foreground` (T10). `--accent` / `--accent-foreground` is
gated at 3:1 rather than 4.5:1 (`:39-40`). Recorded as a measurement, not
a defect claim: several of these tokens are not text-on-surface pairs at
all.

### T24 · Tokens that do not exist

Verified by listing every token name in the file: there is no
`--success`, no `--warning`, no `--info`, and no token carrying a hover,
active, focus or disabled state, in any of the seven blocks (zero hits
each). `--ring` exists but no rule in the package applies it to a focus
state. This matches what `docs/SCOPE.md` S6b asserts.

---

## C — Picker runtime (hook + React component)

`hooks/use-theme.js` (181 lines) and `components/theme-switcher.jsx`
(142 lines). Both are re-exported by `index.js` (G11). `docs/SCOPE.md`
S17 records this pair as explicitly **not** approved.

### C1 · `THEME_META`

`hooks/use-theme.js:8-16`. A frozen object keyed by theme name; each
entry is `{ label, dark, bg, fg, primary }`. Seven entries. `dark: true`
for exactly three: dark, cyberpunk, terminal. The three colour fields
duplicate values from `css/themes.css` as literal strings (e.g.
`'hsl(40,25%,97%)'` for formal, matching `css/themes.css:18`), so the
swatch can preview a theme without activating it. Nothing checks that
these literals still match the stylesheet.

This is the "one source of truth for the theme list" of S9. Everything
else in the module derives from it.

### C2 · Derived constants

`hooks/use-theme.js:21-33`: `THEMES` (`Object.keys(THEME_META)`),
`DEFAULT_THEME = 'formal'`, `STORAGE_KEY = 'theme'`, `THEME_LABELS`
(name → label map), and the module-private `DARK_THEMES` computed by
filtering on `dark`. `THEMES`, `DEFAULT_THEME`, `STORAGE_KEY` and
`THEME_LABELS` are all public exports; `DARK_THEMES` is not exported, so
a consumer that wants the dark set must recompute it from `THEME_META` —
which is what `docs/REQUESTS_FROM_CONSUMERS.md:27` shows both vanilla
consumers doing.

### C3 · `isTheme`

`hooks/use-theme.js:39` plus the private `asTheme` at :45, which narrows
a string to a theme or `null`. `isTheme` is exported and is used
externally: `JobTracker/dashboard/packages/web/src/lib/theme.js` validates
two server-supplied theme names with it.

### C4 · localStorage read/write

`hooks/use-theme.js:47-63`. `readStored()` returns
`localStorage.getItem('theme')` or `null`; `writeStored(theme)` sets it.
Both wrap the call in `try/catch` and swallow the error, so blocked or
private-mode storage degrades to DOM-only theming.

Storage format: one plain string, one of the seven names, under the key
`theme`. No JSON, no namespace prefix, no expiry.

### C5 · Provider-free external store

`hooks/use-theme.js:65-91`. A module-level `Set` of listeners, a
module-level `current` theme, `subscribe`, `getSnapshot` and
`getServerSnapshot`, consumed by `useSyncExternalStore` at :138.
`getSnapshot` falls back to `document.documentElement.dataset.theme` and
then to `'formal'`. `getServerSnapshot` always returns `'formal'`,
meaning a server-rendered page always renders as formal regardless of the
stored choice. State lives in module scope, so two copies of the package
in one bundle would not share it.

### C6 · `applyTheme`

`hooks/use-theme.js:98-106`. Sets `document.documentElement.dataset.theme`
and toggles the `dark` class using `DARK_THEMES`, then notifies the store
if the value changed. Touches `document` unguarded, so it throws on a
server. Exported and used externally by
`JobTracker/dashboard/packages/web/src/main.jsx:21`.

This function is the DOM contract the two vanilla consumers reimplemented
(`kyu/static/theme.js`, `almanac/static/theme.js`).

### C7 · `initializeTheme`

`hooks/use-theme.js:112-114`. `applyTheme(stored ?? fallback)` with
`fallback` defaulting to `'formal'`. Intended to run before React mounts
to avoid a flash. Exported; used by JobTracker's `main.jsx`.

### C8 · `useTheme`

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

### C9 · `useAppearance`

`hooks/use-theme.js:178-181`. A shim renaming `theme`/`updateTheme` to
`appearance`/`updateAppearance`, labelled in its own comment as
compatibility for kp-soft components. Exported from `index.js:11`. No
caller exists in this repository and none in the three consumers — dead
code as far as anything reachable goes.

### C10 · `ThemeSwitcher`

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
(`JobTracker/dashboard/packages/web/e2e/theme.spec.js`) asserts the
trigger is visible and wider than 20 px, that the English `labels`
override is used, that clicking an option sets `data-theme` on `<html>`
and `localStorage.theme`, and that the choice survives a reload.

### C11 · Inline SVG icons

`components/theme-switcher.jsx:11-48`. `PaletteIcon` and `CheckIcon`, two
local components, both `aria-hidden`, replacing lucide icons so the
package has no icon dependency.

### C12 · Outside-click / Escape dismissal

`components/theme-switcher.jsx:72-88`. While open, a `mousedown` listener
on `document` closes the menu on a click outside the wrapper and a
`keydown` listener closes it on Escape; both are removed on close and
unmount.

### C13 · Tailwind class dependency

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

### C14 · Dutch default strings

`hooks/use-theme.js:9-15` ships the labels `'Formeel'`, `'Licht'`,
`'Donker'`, `'Cyberpunk'`, `'Pastel'`, `'Terminal'`, `'Topografisch'`;
`components/theme-switcher.jsx:63-64` defaults `label` to
`'Thema kiezen'` and `failedMessage` to a Dutch sentence. The `labels`
prop (added in 0.1.1, commit `33ec65e`) overrides the theme names but not
`label` and `failedMessage`, which have their own props. These are the
only user-facing strings in the package.

### C15 · Framework-free picker

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
`fx/` emits any class the register styles (F25).

### F1 · Register texture override

`css/cyberpunk-register.css:20-26` declares `--fx-texture` (a radial
vignette plus a scanline gradient), `--fx-texture-size` and
`--fx-texture-opacity: 1` for cyberpunk, feeding the shared `body::after`
layer of T13. This is the only theme whose texture is not in
`themes.css`; see T14.

### F2 · `.microlabel`

`:30-40`. Uppercase, letter-spaced, `--muted-foreground`-coloured text
with a `'// '` prefix in `--accent` via `::before`. Requires
`font-family: var(--font-mono)` (:31), a token declared **only** in
`css/tailwind-bridge.css:15`. A plain-CSS consumer that imports the
register without the bridge gets an invalid `font-family` here and falls
back to the inherited font.

### F3 · Neon caret

`:43-46`. `caret-color: var(--primary)` on `input` and `textarea`. Needs
no special markup; this is the part of the register that applies in
JobTracker today.

### F4 · Card underglow

`:50-68`. `[data-slot='card']` becomes `position: relative` and grows a
2 px `--primary` line along its bottom edge on hover, animated from
`width: 0` to `100%` over `var(--fx-duration, 200ms)`. Requires shadcn's
`data-slot="card"` attribute.

### F5 · Clipped corner

`:71-80`. Two rules: one for `[data-slot='card']` and `.fx-notch`
together, using `var(--fx-notch, 0px)`; one for `[data-slot='button']`
with a hardcoded `7px`. Both set `border-radius: 0`, overriding T7.
`.fx-notch` is the only markup-agnostic escape hatch in this group.

### F6 · Button charge sweep

`:84-94`. A skewed cyan light band as a background image on
`[data-slot='button']`, moved from `105%` to `-5%` on hover over
`var(--fx-duration, 140ms)`. Requires shadcn's button slot attribute.

### F7 · `.fx-brackets`

`:98-123`. Two 9×9 px corner brackets in `--accent` on `::before`
(top-left) and `::after` (bottom-right). Needs the class on the element.

### F8 · `.fx-rule`

`:127-147`. Turns an element into a flex row with a diamond node
(`::before`) and a fading hairline (`::after`) after the content. Needs
the class.

### F9 · Themed scrollbar

`:150-171`. `scrollbar-color` / `scrollbar-width` on the themed root plus
four `::-webkit-scrollbar*` rules, all with literal magenta/void-purple
values rather than tokens. Needs no markup.

### F10 · `.fx-signal-badge`

`:174-178`. Applies `--fx-signal` / `--fx-signal-foreground` (T10) with
three `!important` declarations — the only `!important` in the package.
Needs the class.

### F11 · Reduced-motion guard

`:182-242`. Every animated rule in the register sits inside one
`@media (prefers-reduced-motion: no-preference)` block. The `@keyframes`
definitions themselves (:244-336) sit outside it, which is harmless
because nothing outside the block references them.

### F12 · `.fx-flicker`

`:184-186` with `@keyframes fx-flicker` at :244-267. A 1.1 s neon-tube
flicker that runs once. Needs the class.

### F13 · `.fx-pulse`

`:190-202` with `@keyframes fx-pulse` at :269-273. A pseudo-element
carrying a static `box-shadow` whose **opacity** is animated on a 2.6 s
infinite loop — the technique `docs/CYBERPUNK_THEME_RESEARCH.md`
prescribes. Needs the class.

### F14 · `.fx-glitch`

`:206-230` with two keyframe sets at :275-311. On hover, two
pseudo-elements re-render `attr(data-text)` in magenta and cyan with
`mix-blend-mode: screen` and stepped `clip-path` banding. Needs both the
class and a `data-text` attribute mirroring the visible text.

### F15 · `.fx-media`

`:233-236` with `@keyframes fx-rgb-split` at :313-326. A 170 ms RGB split
on a hovered `img` or `iframe` inside `.fx-media`. Needs the class.

### F16 · `.fx-cellpop`

`:239-241` with `@keyframes fx-cellflash` at :328-336. A one-beat cyan
flash, described in the source as the puzzle-cell entry effect from
kp-soft. Needs the class.

### F17 · Register line budget by markup requirement

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

### F18 · `fx/` barrel

`fx/index.js`, 8 lines, re-exporting the four components. Its comment
warns that importing the barrel pulls in the optional `motion` peer
because of `BootSequence`. That is accurate: any consumer importing
`@kp-soft/themes/fx` resolves `motion/react` even if it only wants
`ScrambleNumber`.

### F19 · `BootSequence`

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
`font-mono`). Depends on C8 for the active theme.

### F20 · `DecipherText`

`fx/decipher-text.jsx`, 57 lines. Replaces the characters of `text` with
random glyphs from a 27-glyph pool (:4) and settles them left to right,
one character every two animation frames, via `requestAnimationFrame`.
Outside cyberpunk, or under reduced motion, it renders the plain text
(:21-24). Props: `text` (required), `delay` (ms, default 0). Depends on
C8; no `motion` dependency; cancels its frame on unmount.

### F21 · `DigitalRain`

`fx/digital-rain.jsx`, 64 lines. A `<canvas>` falling-glyph rain, throttled
to one repaint per 50 ms, DPR-capped at 2, colour read at runtime from
`getComputedStyle(document.documentElement).getPropertyValue('--accent')`
with `'#0ff'` as fallback (:35) — the only place in the package that
reads a token back out of the DOM. Returns `null` entirely outside
cyberpunk (:61). Props: `className`. Note the canvas has no intrinsic
size: it measures `clientWidth`/`clientHeight` once (:26-27), so the
caller must size it, and it does not react to resizes.

### F22 · `ScrambleNumber`

`fx/scramble-number.jsx`, 40 lines. Rattles the digits of `value` through
a hex alphabet on a 40 ms `setInterval`, settling one character per tick;
non-digit characters are left alone (:27). Plain value outside cyberpunk
or under reduced motion. Props: `value` (string, required). Depends on
C8.

### F23 · Shared guard pattern

All four components call `useTheme()` from `../hooks/use-theme.js` and
compare against the literal `'cyberpunk'`, and all four consult
`window.matchMedia('(prefers-reduced-motion: reduce)')` themselves rather
than relying on a CSS media query. The media query is read once inside an
effect, so a user changing the OS preference mid-session is not picked up.
This is the coupling that makes `fx/` unusable without the hook of section
C — which S17 approves the fx but not the hook.

### F24 · `role="text"` wrapper

`fx/decipher-text.jsx:53-55` and `fx/scramble-number.jsx:36-38` both
render `<span aria-label={…} role="text"><span aria-hidden="true">…`.
`role="text"` is not part of the ARIA specification (it is a
WebKit-only extension); recorded as a fact about the markup, not as a
verdict.

### F25 · No component emits a register class

Verified by grep across `components/` and `fx/`: zero occurrences of
`microlabel`, `fx-notch`, `fx-brackets`, `fx-rule`, `fx-signal-badge`,
`fx-flicker`, `fx-pulse`, `fx-glitch`, `fx-media`, `fx-cellpop`,
`glow-primary`, `glow-accent`, `glow-card`, `gradient-text`, and zero
occurrences of `data-slot`. The register's class hooks are addressed to
consumer markup only. This contradicts
`docs/REQUESTS_FROM_CONSUMERS.md:145-146`, which states that `.fx-notch`
and `.microlabel` "belong to the React `fx/` components" (D10).

---

## B — Tailwind binding

`css/tailwind-bridge.css`, 103 lines, exported as
`@kp-soft/themes/css/tailwind-bridge`. Optional: plain-CSS consumers do
not import it. It contains no colour values of its own — every value is a
`var()` onto a token from section T.

### B1 · `@theme` colour aliases

`:11-53`. Maps 32 theme tokens onto Tailwind v4's `--color-*` namespace,
so `bg-primary`, `text-muted-foreground`, `border-border`, `bg-chart-3`,
`bg-sidebar` and the rest resolve to the active theme. Note the one
rename: `--sidebar-background` becomes `--color-sidebar` (:45, :91).

### B2 · `dark` custom variant

`:9`: `@custom-variant dark (&:is(.dark *))`. Keeps existing `dark:`
utilities working, driven by the class that C6 toggles. As written the
variant matches *descendants* of `.dark`, so a `dark:` utility placed on
the `<html>` element itself does not match.

### B3 · `[data-theme]` re-declaration block

`:66-103`, with a 10-line comment (`:55-64`) explaining why. Tailwind
substitutes a custom property's `var()` where it is *declared*, so the
`@theme` aliases resolve once on `:root` and a nested `[data-theme]`
subtree could not change them. This block re-declares all 32 aliases plus
the radius scale and `--font-display` on every `[data-theme]` element, so
`<section data-theme="pastel">` themes its own subtree. The comment
records the symptom that led to it (a showcase where swatches changed but
components did not).

### B4 · Radius scale

`:17-19` and `:99-101`. `--radius-lg: var(--radius)`, `--radius-md:
calc(var(--radius) - 2px)`, `--radius-sm: calc(var(--radius) - 4px)`.
For terminal (`--radius: 0rem`) the md and sm values compute to negative
lengths.

### B5 · Font families

`:12-15`. `--font-sans` is given a literal Instrument Sans stack;
`--font-display: var(--theme-font-display, var(--font-sans))` — the only
mechanism by which cyberpunk's and terminal's display faces reach a page
(T8); `--font-mono` a JetBrains Mono stack, which the register depends on
(F2). Re-declared for `--font-display` only at :102, so a nested
`[data-theme]` subtree switches display font but not `--font-mono`.

### B6 · Status tokens are not bridged

The 14 `--status-*` tokens of T6 have no `--color-status-*` alias
anywhere in the file. README.md:128-130 documents this and tells
consumers to write `bg-[var(--status-offer)]`; JobTracker instead uses
inline styles (`StatusPill.jsx:24-25`).

### B7 · Consumer obligations

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

### G1 · Contrast check — what it asserts

`scripts/check-contrast.mjs`, 104 lines. For every discovered theme it
computes the WCAG contrast ratio of 21 token pairs: 20 pairs at a 4.5:1
minimum (`:23-38`) and 1 pair — `accent` / `accent-foreground` — at 3:1
(`:39-40`). The 20 are 13 surface/text pairs plus the 7 status pairs. Two
of the 13 are cross-pairs rather than a token and its own foreground:
`background`/`muted-foreground` and `card`/`muted-foreground` (:29-30),
and one treats `primary` as link text on the page background (:36).
Result today, run at inventory time: `All 7 themes pass WCAG AA on 21
pairs (incl. 7 status badges).`, exit code 0 — 147 assertions.

### G2 · Theme discovery

`:17`. A regex over the stylesheet text collects every
`[data-theme='<name>']` block that declares `--background`, deduplicated.
This is why the register blocks of T14 and F1 are not mistaken for
palettes: they declare no `--background`. `:18` throws if fewer than five
themes are found. The theme name pattern is `[a-z]+`, so a theme named
`high-contrast` or `theme2` would be silently skipped.

### G3 · Colour maths

`:49-73`. `tokenHsl` extracts `--<token>: hsl(<h>, <s>%, <l>%)` by regex;
`hslToRgb`, `luminance` (sRGB, the standard 0.03928 / 2.4 transfer) and
`ratio` implement the WCAG formula. The parser accepts only comma-form
`hsl()` with three numbers; the space-separated form and any other colour
notation would be read as a missing token.

### G4 · Target-file argument

`:11`. `node scripts/check-contrast.mjs [path]` resolves an optional
argument relative to the current working directory, defaulting to
`../css/themes.css` relative to the script. This is the mechanism
`docs/SCOPE.md` S3 relies on for "a consumer that overrides a colour can
run the shipped script against its own file". Nothing in this repository
or in the three consumers actually invokes it that way today.

### G5 · Failure modes

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
   until it is added to `PAIRS` (T23).

### G6 · `STATUS_NAMES` export

`:21` exports `STATUS_NAMES`. The module is not import-safe: reading that
export runs the whole check at import time and can call
`process.exit(1)`. Nothing imports it — a dead export on a module that is
only ever run as a script.

### G7 · npm scripts

`package.json:32-36`: `check:contrast` (runs the script),
`format` (`prettier --write .`), and `gates`
(`npm run check:contrast && prettier --check .`). `npm run gates` passes
at inventory time. There is no test script, no lint script and no
type-check script.

### G8 · Export map

`package.json:14-21`. Six entries: `.` → `index.js`, `./fx` →
`fx/index.js`, `./css` → `css/themes.css`, `./css/tailwind-bridge`,
`./css/register`, and `./package.json`. Consequences: `hooks/` and
`components/` are shipped but **not** addressable as subpaths, so
`@kp-soft/themes/hooks/use-theme.js` does not resolve; and
`scripts/check-contrast.mjs` has no export path and no `bin` entry, so it
can only be run by file path inside an installed tree — the
`npx @kp-soft/themes check-contrast` shape floated in
`docs/REQUESTS_FROM_CONSUMERS.md:124` does not work today.

### G9 · `files` array

`package.json:22-31`: `index.js`, `hooks`, `components`, `fx`, `css`,
`scripts`, `docs`, `README.md`. The published tarball therefore contains
the two verbatim kp-soft documents and this project's own procedure
documents. `CLAUDE.md`, `HANDOFF.md`, `jsconfig.json` and the dotfiles
are not shipped.

### G10 · Peers, engines, flags

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

### G11 · `index.js` barrel

15 lines. Re-exports `ThemeSwitcher` as a named export (:1) and ten
symbols from the hook (:2-13): `DEFAULT_THEME`, `STORAGE_KEY`,
`THEME_LABELS`, `THEME_META`, `THEMES`, `applyTheme`, `initializeTheme`,
`isTheme`, `useAppearance`, `useTheme`. Plus two JSDoc typedef
re-exports, `Theme` and `UseThemeOptions` (:14-15), which JobTracker
imports as types. The barrel exports no fx and no CSS. Importing it pulls
React in, so a non-React consumer has no JavaScript entry point at all.

### G12 · Node pin

`.nvmrc`, one line: `26`. Matches `engines` (G10). Local Node is 26.8.1.

### G13 · Prettier configuration

`.prettierrc`, 16 lines: `semi`, `singleQuote`, `printWidth: 150`,
`tabWidth: 4`, `htmlWhitespaceSensitivity: css`, plus a YAML override to
`tabWidth: 2` — for which there is no `.yml` file in the repository.
`.prettierignore`, 4 lines, excludes `docs/`, `node_modules/` and
`package-lock.json`; the stated reason is that `docs/` holds verbatim
copies. Effect: `docs/SCOPE.md`, `docs/CORRECTIONS.md` and the other
project-owned documents are also unformatted and unchecked. `prettier
--check .` passes today.

### G14 · `jsconfig.json`

23 lines. `checkJs: true`, `strict: true`, `noImplicitAny`,
`noImplicitReturns`, `jsx: react-jsx`, `moduleResolution: bundler`,
including `index.js`, `hooks`, `components`, `fx`, `scripts`. There is no
`typescript` dependency and no script that runs `tsc`, so nothing in this
repository ever executes these settings; they serve only an editor with
its own TypeScript. The JSDoc annotations throughout `hooks/`,
`components/` and `fx/` are therefore unchecked here.

### G15 · `.gitignore`

One line, `node_modules/`.

### G16 · `package-lock.json`

Tracked in git, lockfile version 3, three packages (root, prettier,
react). Its root entry records `"version": "0.1.0"` while
`package.json` says `0.1.1` — the lock was not regenerated for the 0.1.1
bump (its only commit is `d85ea47`, the 0.1.0 extraction). It also
records no `motion` entry.

### G17 · Tooling that is absent

Observed absences, listed so Phase 2 can reference them: no test of any
kind (no test runner, no test file, no `tests/` or `__tests__`
directory); no `.github/` directory and therefore no CI; no git hooks and
no `core.hooksPath` configuration in the repository; no LICENSE file
(README.md:176 says a license is a Phase 3 decision); no CHANGELOG; no
`bin` entry; no `.editorconfig`; no ESLint configuration; no
`.npmrc`; no HTML file and no showcase page; no machine-readable palette
export (JSON/TOML) of the kind `docs/SCOPE.md` S5/S16 anticipates.

### G18 · Version and tag surface

`package.json` version 0.1.1. Two annotated tags: `v0.1.0` (`d85ea47`)
and `v0.1.1` (`eeaf85d` → `7cd2e8d`). `git diff v0.1.1..HEAD` over
`css/`, `index.js`, `hooks/`, `components/`, `fx/`, `scripts/` and
`package.json` is empty: every commit since the tag is documentation. The
consumers pin or record `v0.1.1`, so the shipped artefacts and the
working tree are identical today.

---

## D — Documentation

### D1 · README.md

213 lines, the consumer-facing document: install snippet, CSS import
recipes for plain CSS and Tailwind, the Bunny Fonts link tag, the
`data-theme` / `.dark` contract, the JavaScript API, the status-token
table, the contrast-gate commands, the register's shadcn caveat, the
provenance paragraph, a "what is NOT here" list, the npm-12 git-install
note, the `@source` requirement, and the `labels` prop. Accurate on the
substance; three concrete drifts are listed in D10.

### D2 · CLAUDE.md

74 lines, project instructions loaded by every session in this directory:
project identity, consumers, enforcement, the KT1 project rule, the
procedure-status table, what Phase 1 and 2 inherit, and the document
table. Current as of commit `5c378b9` — see the note under D10.

### D3 · HANDOFF.md

59 lines, Dutch, the start prompt for the next session. States Phase 0 is
closed, points at SCOPE, MINI_ROUNDS, REQUESTS_FROM_CONSUMERS, names
Phase 1 as the next step and corrects the earlier claim about the
elicitation widget.

### D4 · docs/SCOPE.md

324 lines. The approved Phase 0 scope: 18 statements plus B1, marked
APPROVED 2026-09-03, with an "adjusted during the gate" note under
several statements and a list of open questions carried into Phases 1
and 2. Non-code artefact; treated here as a claim to check, not as
evidence.

### D5 · docs/THEMING.md

78 lines, a verbatim copy of kp-soft's maintainer guide taken at commit
`2983abb` (header line 1 says so). It describes kp-soft's file layout —
`resources/css/app.css`, `resources/js/hooks/use-appearance.tsx`,
`routes/settings.php`, `tests/Feature/ThemeSyncTest.php` — none of which
exist here, and it names gates (TypeScript, a PHP feature test,
pre-commit) that do not run in this repository. Its description of the
mental model, the register layer and the taste rules ("texture opacity at
or under ~6 %", "a theme changes tokens, never component markup") does
apply to the code in this package.

### D6 · docs/CYBERPUNK_THEME_RESEARCH.md

83 lines, also verbatim from kp-soft. Live findings from cyberpunk.net,
n-o-d-e.net, Arwes and Cyberpunk 2077, the "five pillars", and technique
notes. The techniques it prescribes are visibly implemented: the single
clipped corner (F5), the opacity-only glow pulse (F13), the two-copy
chromatic aberration (F14), scanlines as a repeating gradient (F1), the
reduced-motion wrapper (F11) and the settle-left-to-right decipher (F20).
It is the only per-theme character document that exists — the other six
themes have none.

### D7 · docs/CORRECTIONS.md

80 lines. One correction, KT1, approved 2026-09-03 across nine fields: a
checkable claim asserted in a gate form without checking it. Its field 6
says the resulting rule "lives in this project's `CLAUDE.md`" — it does
not (D10).

### D8 · docs/MINI_ROUNDS.md

10 lines, one table row: KT1-M1, open, triggering at the Phase 2 decision
form.

### D9 · docs/REQUESTS_FROM_CONSUMERS.md

159 lines, written by the JobTracker session on 2026-09-03. Three
sections: three consumers building the same picker (with kyu's shipped
markup contract), the contrast gate not reaching consumers, and four
smaller findings. It is the source of several claims that
`docs/SCOPE.md` later carries forward.

### D10 · Contradictions between the documents and the code

Each verified against the code. Four claims about `CLAUDE.md` were made
in the first draft of this inventory and are withdrawn — see the note at
the end of this section.

1. **Consumer list.** `CLAUDE.md` and `README.md:9-10` name JobTracker
   and kp-soft as the consumers. Verified: kp-soft does **not** depend on
   this package — `~/Projects/kp-soft/package.json` has no
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
   `fx/` or `components/` emits any of them (F25); they are hooks for
   consumer markup.
6. **`docs/THEMING.md` describes another repository.** Its "adding a
   theme = two edits" instruction names `resources/css/app.css` and
   `resources/js/hooks/use-appearance.tsx`, and its gate table names a
   PHP test and a TypeScript gate. In this repository the equivalent
   files are `css/themes.css` and `hooks/use-theme.js`, and neither of
   those two gates exists.
7. **Register vs. `themes.css` split for cyberpunk.** `README.md:30` says
   `@kp-soft/themes/css` is "the seven themes + textures"; the cyberpunk
   texture is not in that file but in the register (T14, F1).
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
(G10, C, F19-F22). `motion >= 12`, optional — only
`AnimatePresence` and `motion.div` in `fx/boot-sequence.jsx:1` (F19).
Tailwind CSS v4, not declared as a dependency at all, but required for
`css/tailwind-bridge.css` to parse (`@theme`, `@custom-variant`) and for
`ThemeSwitcher` and `BootSequence` to have any layout (B, C13).
shadcn/ui markup conventions, not a code dependency but a markup
dependency of 44 register lines (F17).

**External dependencies (tooling).** `prettier ^3.4.2` — the only
devDependency, used by `npm run format` and the `gates` script (G7, G13).
Node >= 26 < 27 (G10, G12), using only `node:fs` and `node:process` in
`scripts/check-contrast.mjs`.

**Fonts.** Not shipped and not fetched by any code in the package. The
themes name Fraunces, Chakra Petch, Share Tech Mono, Instrument Sans and
JetBrains Mono (T8, T9, B5); README.md:49-64 documents a Bunny Fonts
`<link>` the consumer must add. Absent it, three themes fall back
silently.

**Storage formats.** Two, both browser-side, both plain strings:
`localStorage['theme']` = one of the seven theme names (C4), and
`sessionStorage['fx-booted']` = `'1'` (F19). No server storage, no files
written by any code in the package. The DOM itself carries state:
`<html data-theme="…">` and the `dark` class (C6), plus the
`data-theme-switcher` marker attribute (C10).

**Network endpoints.** None. No code in the repository performs an HTTP
request, opens a socket or references a URL at runtime. The only URLs in
the package are the `data:image/svg+xml` textures inlined in
`css/themes.css` (T14), the Bunny Fonts link inside a README code block,
and the repository URL in `package.json:9`.

**CLI surface.** One executable: `node scripts/check-contrast.mjs
[path/to/css]` (G4), reachable as `npm run check:contrast`. Two more npm
scripts: `format` and `gates` (G7). No `bin`, so nothing is exposed as a
command in a consumer's `node_modules/.bin`.

**UI surface.** One rendered component, `ThemeSwitcher` — a button with a
palette icon opening a seven-item listbox (C10) — and four cyberpunk
effect components (F19-F22). Plus the purely CSS surfaces: the texture
layer (T13), the heading and selection flourishes (T15-T19), the three
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

- C9 `useAppearance` — exported, zero callers here and in all three
  consumers.
- G6 `STATUS_NAMES` — exported from a script nothing imports.
- F19 `BootSequence`, F20 `DecipherText`, F21 `DigitalRain`,
  F22 `ScrambleNumber`, F18 the `fx/` barrel — no consumer imports
  `@kp-soft/themes/fx`; kp-soft still runs its own local `.tsx`
  originals. `motion` is not even installed here, so F19 cannot resolve.
- F24 the `role="text"` wrapper, being part of F20 and F22.
- C15's absent framework-free picker — nothing to verify, recorded for
  completeness.

**CSS with no emitter and no rendering check:**

- T4 chart tokens, T5 sidebar tokens — declared and bridged, used by no
  markup here or in JobTracker.
- T20 `.glow-primary` / `.glow-accent` / `.glow-card`, T21
  `.gradient-text` — no file in the package emits these classes.
- T15, T16, T17, T18, T19 — the heading, selection and display-font
  flourishes; no screenshot test, no showcase page.
- T13 and T14 — the texture layer and six textures; the contrast gate
  explicitly cannot see them (`css/themes.css:404-406`).
- F1-F16, the whole register: only F3 (`input` / `textarea` caret) is
  known to apply at a consumer, because JobTracker imports the register
  while emitting no `data-slot` and none of the `fx-` classes. F2's
  dependency on `--font-mono` from the bridge is unverified in a
  plain-CSS consumer.
- F17's line accounting is a measurement of the file, not of behaviour.
- B1-B5 — the Tailwind bridge compiles and JobTracker renders with it, so
  it is exercised in a loose sense, but nothing asserts that any specific
  alias resolves; B3's nested-subtree behaviour in particular has no
  test and no page in this repository to show it.
- T8 and T9 — cyberpunk's and terminal's fonts reach a page only through
  a Tailwind utility a consumer must write; no consumer does today.

**Gate coverage gaps:**

- T23 — `--border`, `--input`, `--ring`, the five chart tokens,
  `--sidebar-border`, `--sidebar-ring` and the `--fx-signal` pair are in
  no contrast pair.
- C1's swatch literals (`bg`, `fg`, `primary` in `THEME_META`) are
  duplicates of values in `css/themes.css`; nothing checks that they
  still agree.
- G5's failure modes 3, 4 and 5 (uncaught throws) have never been
  triggered.
- G14 — the whole JSDoc type layer is unchecked in this repository; only
  JobTracker's own TypeScript pass ever reads these types, and only for
  the symbols it imports.

**Packaging claims not exercised:**

- G8 — the export map is only exercised for `.`, `./fx` is imported by
  nobody, and `./css/register` only by JobTracker. `./package.json` is
  unused.
- G9 — the `files` array has never been tested by an `npm pack`; the
  package has never been published (`private: true`).
- G18 — Dependabot's ability to follow a git tag is configured in
  JobTracker but has never produced a PR, because no tag has been cut
  since v0.1.1.
