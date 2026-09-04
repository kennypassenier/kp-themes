# @kp-soft/themes

The house themes as a shared package: eleven `data-theme` palettes
(formal, light, dark, cyberpunk, pastel, terminal, topo, high-contrast,
sepia, blueprint, solstice) as plain CSS
custom properties, the element-level rules that make a theme complete
(links, code, selection, form fields, print), eighteen components, a
theme picker, and the cyberpunk register with its effects.

**Everything exists in two channels.** React, for a consumer with a build
step; and framework-free — CSS classes plus a `<script type="module">`
that attaches behaviour to markup your own server wrote. They render the
same class names and share the same state, so a page can mix them.

Nine gates run in under a second and refuse a commit that breaks them:
contrast, the design invariants, the flash threshold, reduced-motion
guards, token parity, layer discipline, and whether the generated files
still match their sources. A behaviour suite runs in Chromium and Firefox.

Consumers: JobTracker and kp-soft (React, git dependency), kyu and almanac
(framework-free — they copy the stylesheet).

See it: <https://kennypassenier.github.io/kp-themes/>

## What this is, and what it promises

kp-themes is a **source**, not a service. It defines themes and builds
components on them. That is the whole scope.

**The one promise: a released version of a theme never changes** [S20]. The
token values of `dark` at v1.0.0 are its values at v1.0.0 forever. Any
change to a theme raises the version — a colour, a typeface, a motion
token, no exceptions, not even for a value that is plainly wrong. That
correction is a new version. Pin one and you can stop thinking about it.

What comes with every release, and it is the whole of what you can rely on
mechanically: a version number (the first line of each stylesheet), a
provenance line, and `SHA256SUMS` over the ten files a consumer copies.

**How you take it in is your business** [S19]. A copy, a git dependency,
something else — that decision belongs in your project, and there is no
sync command, adapter or per-consumer fixture here to make it for you. What
you can do is ask: a component, a type, a token that is missing is a
request this project takes, and 1.1.0 exists because JobTracker asked for
declarations.

What is NOT promised: the internals of the generated `css/themes.css` (read
tokens, never the rules), the showcase, and the gates — those are this
project's own tools.

## Install

As a git dependency, pinned to a tag:

```json
"dependencies": {
    "@kp-soft/themes": "github:kennypassenier/kp-themes#v1.1.0"
}
```

Or copy the files you need and verify them against the release's
`SHA256SUMS`. Both are in use.

Peer dependencies: `react >= 19`; `motion >= 12` only if you use
`BootSequence` from `@kp-soft/themes/fx`. Node 26 for the scripts.

Types ship with the package: `.d.ts` beside every entry point since 1.1.0,
and `Theme` is the union of the eleven names rather than `string`.

## Consume the CSS

Plain CSS (any stack):

```css
@import '@kp-soft/themes/css'; /* the seven themes + textures + body colours */
@import '@kp-soft/themes/css/register'; /* optional: cyberpunk HUD chrome and motion */
```

Tailwind v4 (JobTracker, kp-soft): add the bridge so `bg-primary`,
`text-muted-foreground`, `rounded-lg`, `font-display`, `dark:` and the
rest follow the active theme.

```css
@import 'tailwindcss';
@import '@kp-soft/themes/css';
@import '@kp-soft/themes/css/tailwind-bridge';
@import '@kp-soft/themes/css/register';
```

The bridge only aliases tokens; it does not carry kp-soft's shadcn base
layer (`* { @apply border-border }`). Add that in your app if you use
shadcn.

### Fonts

The themes reference Instrument Sans (sans), Fraunces (formal display),
Share Tech Mono (terminal) and Chakra Petch (cyberpunk display). kp-soft
loads them from Bunny Fonts; put this in your `<head>`:

```html
<link rel="preconnect" href="https://fonts.bunny.net" />
<link
    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|fraunces:600,700|share-tech-mono:400|chakra-petch:500,600,700"
    rel="stylesheet"
/>
```

JetBrains Mono (`--font-mono`) is expected to be present locally or loaded
by the app; every stack has a fallback.

### `data-theme` and the `.dark` class

A theme is active when `<html data-theme="…">` carries its name; without
the attribute the `:root` fallback is `formal`. The dark-ish themes
(`dark`, `cyberpunk`, `terminal`) additionally need the `.dark` class on
`<html>` so existing `dark:` variants keep working — `applyTheme()` sets
both. To avoid a flash before React mounts, call `initializeTheme()`
from an inline script or the top of your entry file.

Tokens can also be scoped to a subtree (`<section data-theme="pastel">`)
— the bridge re-declares the Tailwind aliases on every `[data-theme]`
element so they resolve per subtree.

## Every entry point

| Import                                | What it is                                            |
| ------------------------------------- | ----------------------------------------------------- |
| `@kp-soft/themes`                     | React: components, hooks, the switcher                |
| `@kp-soft/themes/fx`                  | React: the cyberpunk effects                          |
| `@kp-soft/themes/css`                 | the palette — the one file a vendoring consumer needs |
| `@kp-soft/themes/css/components`      | the component classes                                 |
| `@kp-soft/themes/css/register`        | the cyberpunk HUD chrome, opt-in                      |
| `@kp-soft/themes/css/tailwind-bridge` | for Tailwind v4 consumers                             |
| `@kp-soft/themes/js/core`             | the theme state, framework-free                       |
| `@kp-soft/themes/js/picker`           | the framework-free picker                             |
| `@kp-soft/themes/js/components`       | the DI4 and DI10 contracts                            |
| `@kp-soft/themes/js/overlays`         | dialogs, tabs, toasts                                 |
| `@kp-soft/themes/js/registry`         | the generated theme list                              |
| `@kp-soft/themes/js/no-flash`         | the first-paint snippet                               |

## Consume the JavaScript

There are two channels, and they share one state. Use either, or both on
the same page — a change in one updates the other.

### React

```js
import { ThemeSwitcher, THEME_RECORDS, THEMES, applyTheme, initializeTheme, useTheme } from '@kp-soft/themes';
import { BootSequence, DecipherText, DigitalRain, ScrambleNumber } from '@kp-soft/themes/fx';
```

- `THEME_RECORDS` — `[{ name, label, dark }]`, generated from the token
  sources, so it cannot disagree with the stylesheet about which themes
  are dark. `THEMES` is the name list, `THEME_LABELS` the name→label map.
  The labels are the theme names — Kenny's names for his themes, not
  interface chrome, so they stay as they are on an English page the way a
  product name does. Everything else the components say comes from
  `js/strings.js` and is English by default; see "The words on screen are
  yours".
- `applyTheme(name)` — sets `data-theme` and toggles `.dark`; every
  `useTheme()` instance on the page sees the change (a tiny external store,
  no provider needed).
- `initializeTheme(fallback = 'formal')` — last localStorage choice or the
  fallback, before React mounts.
- `useTheme({ preferred, fallback, onChange })` → `{ theme, updateTheme,
saveFailed }`. Precedence: `preferred` (e.g. a member's server-saved
  theme) > localStorage > `fallback` (e.g. a section default) > `formal`.
  `updateTheme(next)` applies + stores locally, then calls `onChange(next,
previous)`; if that throws or returns a rejecting promise the change is
  reverted and `saveFailed` becomes true — persist server-side there.
- `<ThemeSwitcher themeOptions label failedMessage storageMessage className />`
  — a dependency-free button + listbox with a swatch per theme and a check
  mark on the current one. The swatch wears the theme it previews, so it
  shows that theme's live colours rather than a copy. It uses Tailwind/shadcn class names;
  restyle via `[data-theme-switcher]` if you are not on Tailwind.

### Framework-free

For a server that renders HTML and has no npm step. You write the markup,
one module attaches the behaviour:

```html
<link rel="stylesheet" href="/vendor/kp-themes/css/themes.css" />
<link rel="stylesheet" href="/vendor/kp-themes/css/components.css" />

<div data-kp-theme-picker>
    <button type="button" data-kp-theme="formal"><span class="kp-swatch" data-theme="formal"></span> Formeel</button>
    <button type="button" data-kp-theme="dark"><span class="kp-swatch" data-theme="dark"></span> Donker</button>
</div>
<p data-kp-theme-status hidden></p>

<script type="module" src="/vendor/kp-themes/js/theme-picker.js"></script>
```

The script marks the chosen option (`aria-pressed`, `data-selected` and
`.is-selected`), stores the choice, and says so in `[data-kp-theme-status]`
when the browser refuses to store it. `@kp-soft/themes/js/core` exports the
same primitives without the picker: `applyTheme`, `currentTheme`,
`storeTheme`, `initializeTheme`, `onThemeChange`.

### No flash on first paint

Paste this in `<head>`, before the stylesheet. It deliberately knows
nothing about which themes are dark — it copies a name, the stylesheet
does the rest:

```html
<script>
    (function () {
        try {
            var t = localStorage.getItem('theme');
            if (t) document.documentElement.dataset.theme = t;
        } catch (e) {}
    })();
</script>
```

An unknown stored value is corrected to `formal` as soon as the picker
module loads.

### Effects

- fx: `BootSequence` (once per session, `lines` prop; needs `motion`),
  `DecipherText`, `DigitalRain`, `ScrambleNumber` — cyberpunk only, plain
  or absent elsewhere and under `prefers-reduced-motion`. They keep
  listening: turning that setting on mid-session stops them, without a
  reload.

Everything is plain JavaScript with JSDoc types (`jsconfig.json` has
`checkJs`); editors pick up the types from your own `@types/react`.

## Forms

`FormField` renders the control its `type` says, not always an `<input>`:

```jsx
<FormField label="Country" name="country" type="select" required options={countries} />
<FormField label="Notes" name="notes" type="textarea" />
<FormField label="Keep me posted" name="news" type="checkbox" />
<FormField label="How do we reach you?" name="channel" type="radio" options={channels} />
```

`options` is `{ value, label, disabled? }[]`; a `select` also accepts
children, so an `<optgroup>` is yours to write. Anything else — `text`,
`email`, `number`, `date` — is the input type, as before.

A radio group renders as a `<fieldset role="radiogroup">` with the
question as its legend, and it behaves as one question: the error summary
counts it once, names it by the legend rather than by one of its answers,
and the group carries `aria-invalid` (putting it on one radio says the
wrong thing about the others).

The framework-free channel needs no component — `attachForms()` works on
whatever markup you wrote, and validates everything the browser validates.
Match the classes in the snippet above for a radio group and it gets the
same treatment.

## Links inside a router

`NavBar`, `Breadcrumb` and `Pagination` render `<a href>` by default,
which reloads the page. Inside React Router or Next that throws the state
away, so hand in your own:

```jsx
import { Link } from 'react-router';

<NavBar brand="kp" links={links} linkComponent={Link} />;
```

The component receives `href`, `className`, `aria-current` and the
children. A router whose prop is called something else takes a two-line
wrapper rather than a fork of the component.

The skip link stays a plain anchor on purpose: it points at an element on
this page, and routing it turns the one link a keyboard user needs into a
navigation.

## Status tokens

New in this package (JobTracker's K4 status model). Every theme declares
seven badge pairs, each chosen for that palette and gated at WCAG AA
4.5:1 (text on badge):

| Token                | Meaning                     |
| -------------------- | --------------------------- |
| `--status-draft`     | application being prepared  |
| `--status-sent`      | submitted                   |
| `--status-screening` | recruiter / phone screening |
| `--status-interview` | interview stage             |
| `--status-offer`     | offer received              |
| `--status-rejected`  | rejected                    |
| `--status-withdrawn` | withdrawn by the applicant  |

Each has a `-foreground` partner: `background: var(--status-offer); color:
var(--status-offer-foreground)`. They are plain custom properties (not in
the Tailwind bridge); in Tailwind v4 use `bg-[var(--status-offer)]` or add
your own `@theme` aliases.

## Contrast gate

```sh
npm run check:contrast            # css/themes.css
node gates/check-contrast.mjs path/to/other.css
npm run gates                     # contrast + prettier --check
```

The script discovers every `[data-theme='…']` block that declares
`--background` and checks each theme's colour pairs: text on its surface
at 4.5:1, non-text things like chart series and the focus ring at 3:1,
and the pairs that must stay far apart rather than readable — a visited
link against an unvisited one, a pressed state against its base. It
prints the counts itself; they are not repeated here, because a number
typed into prose goes stale and a gate's own output does not. Run `npm
run gates` before every commit.

## Cyberpunk register: shadcn markup hooks

`css/cyberpunk-register.css` styles `[data-slot='card']` (underglow line,
clipped corner) and `[data-slot='button']` (clipped corner, charge
sweep). Those are shadcn markup hooks; map them to your own selectors if
you do not use shadcn. The class-based hooks (`.microlabel`, `.fx-notch`,
`.fx-brackets`, `.fx-rule`, `.fx-signal-badge`, `.fx-flicker`, `.fx-pulse`,
`.fx-glitch` + `data-text`, `.fx-media`, `.fx-cellpop`, `.glow-primary`,
`.glow-accent`, `.glow-card`, `.gradient-text`) work on any markup.

## Home Assistant

`ha/kp-*.yaml` is the same eleven themes as Home Assistant themes,
generated from the same token sources. Copy them into Home Assistant's
`themes/` directory and reload; they appear under their Dutch names beside
whatever you already have. The `kp-` prefix is there so a file called
`dark.yaml` cannot land on top of one of yours.

Where [card-mod](https://github.com/thomasloven/lovelace-card-mod) is
installed they also carry the theme's own timing, so a dashboard in
terminal snaps and one in sepia drifts. Without card-mod the two extra
keys are ignored and the colours still work.

Three of Home Assistant's variables are ink rather than plate —
`warning-color`, `success-color`, `info-color` — and which half of our
pair that is depends on the theme, so the generator picks whichever is
readable on that theme's card. A test asserts all four ink colours clear
3:1 in all eleven.

## Documentation

| Document                                                         | For                                                        |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| [docs/USER_GUIDE.md](docs/USER_GUIDE.md)                         | building a page with this                                  |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)               | when it looks wrong, or a gate says no                     |
| [docs/ARCHITECTURE_REFERENCE.md](docs/ARCHITECTURE_REFERENCE.md) | the system as built                                        |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md)                           | what is tested, and what is not by decision                |
| [docs/DESIGN_INVARIANTS.md](docs/DESIGN_INVARIANTS.md)           | the rules every theme must keep, with the compliance table |
| [MIGRATION.md](MIGRATION.md)                                     | the five breaks in v1                                      |

## Provenance

Extracted from kp-soft at commit `2983abb`
(2983abbab22632b4942633a81c17dd50c3d2ac16) on 2026-09-02:
`resources/css/app.css`, `resources/js/hooks/use-appearance.tsx`,
`resources/js/components/theme-switcher.tsx`,
`resources/js/components/fx/{boot-sequence,decipher-text,digital-rain,scramble-number}.tsx`,
`gates/check-contrast.mjs`, `docs/THEMING.md`,
`docs/CYBERPUNK_THEME_RESEARCH.md`. v0.1.0 is extraction only; the only
additions are the status tokens and the de-Inertia'd hook API. The
`docs/` copies are verbatim and still describe kp-soft's file layout.

## What is NOT here

- Inertia bits: `usePage`, `router.patch('theme.update')`, the server-side
  theme column — use `useTheme({ preferred, onChange })` instead.
- shadcn components (DropdownMenu, Card, Button) and lucide icons.
- kp-soft page code and the Inertia-bound fx `data-strip` and
  `page-glitch`.
- The Tailwind `@apply` lines, `@plugin 'tailwindcss-animate'`, the
  `@source` for Laravel pagination, and the `.animate-float` utility.
- A build step. No bundler, no compilation, no polyfills — the package
  ships the files a browser reads.
- Runtime dependencies. React and `motion` are peers, and `motion` is
  optional; only `BootSequence` needs it.

## css/themes.css is generated

Do not edit it. The colour blocks come from `themes/<name>/tokens.json`
and everything after them from `css/_rules.css`; `npm run generate`
assembles the two. A gate refuses a commit where the file and its source
disagree, in either direction.

## Working on this package: activate the hooks once

The quality gates block bad commits, but the wiring is local git config
that a clone cannot carry. Run this once per clone, or nothing enforces
anything:

```
git config core.hooksPath .githooks
```

After that a commit runs the gates and refuses a message without feature
IDs. Both were proved by making them fail; see `docs/REALIZATION_PLAN.md`.

## Installing from the git tag (npm 12)

Only if you take the git-dependency route. A consumer that copies the
files needs none of this.

npm 12 refuses git dependencies unless the consumer opts in. Put this
in the consumer's `.npmrc` (the setting accepts only `all`, `none`,
`root`; `none` refuses):

```
allow-git=all
```

`root` is enough when the dependency is declared in the root package —
kp-soft measured that on 2026-09-04. Use `all` when it is declared inside
a workspace, which is how JobTracker declares it and why this said `all`
without qualification until then.

The package ships `.jsx` and `.js` sources for a bundler (Vite, esbuild);
plain Node cannot import the `.jsx` files.

## Tailwind consumers: add the package as a source

Only on the git-dependency route, for the same reason as above: Tailwind v4
generates only the utility classes it finds in the sources it scans, and it
does not scan `node_modules`. A copy living inside your own project is
scanned, so this problem disappears with the mechanism.

The `ThemeSwitcher` and the fx components carry utility classes (`size-9`,
`inline-flex`, …), so a Tailwind consumer on that route must declare the
package as a source in its CSS entry, next to the imports:

```css
@import 'tailwindcss';
@source '../../../node_modules/@kp-soft/themes'; /* path relative to this file */
@import '@kp-soft/themes/css';
@import '@kp-soft/themes/css/tailwind-bridge';
```

Without it the switcher renders at 0×0 px with no error (found live in
JobTracker's L0 demo, 2026-09-02; correction C3 there).

## The words on screen are yours

Every user-visible string in this package comes from one dictionary,
`js/strings.js`. The defaults are English. Nothing is hardcoded into a
component, which means you can replace any of it without patching us —
including the screen-reader-only announcements, which are the half that
fails silently.

```js
import { DEFAULT_STRINGS, STRINGS_NL, setStrings } from '@kp-soft/themes/js/strings.js';
```

`DEFAULT_STRINGS` is the English set, frozen. `STRINGS_NL` is the Dutch
that this package used to render by default, kept as one import for the
projects that want those words back.

### Three ways in, nearest wins

**A prop**, for one component:

```jsx
<DataTable rows={rows} columns={columns} strings={{ tableSearch: 'Filter…', tableEmpty: 'Nothing here yet' }} />
```

**A provider**, for a subtree — the usual choice, because passing the same
object into every component is the chore people do twice and then stop
doing:

```jsx
import { StringsProvider } from '@kp-soft/themes/hooks/use-strings.jsx';

<StringsProvider value={STRINGS_NL}>
    <App />
</StringsProvider>;
```

**`setStrings()`**, globally — the framework-free channel's way in, and it
also seeds the React default:

```js
setStrings({ ...STRINGS_NL, tableSearch: 'Zoeken in de tabel' });
```

Every override is partial: what you do not name keeps its default.

### Keys that vary take arguments

A count, a name or a date is passed in rather than concatenated by the
caller, so you can reorder for your own grammar:

```js
setStrings({
    tableRowsFiltered: (shown, total) => `${shown} of ${total} rows`,
    removeNamed: (name) => `Remove ${name}`,
    wizardStep: (at, of) => `Step ${at} of ${of}`,
});
```

`js/strings.js` is the full list — 72 keys, each with its English default
beside it.

### Theme names

`ThemeSwitcher` renders the labels from `THEME_RECORDS`, which are Kenny's
names for his themes rather than interface chrome. Pass
`labels={{ formal: 'Formal', light: 'Light', dark: 'Dark', cyberpunk: 'Cyberpunk', pastel: 'Pastel', terminal: 'Terminal', topo: 'Topographic' }}`
to override any of them.

### The gate behind this

`npm run check:strings` reads our own source and refuses a user-visible
literal that does not come from the dictionary. It is why the promise
above is a property of the package rather than an intention.
