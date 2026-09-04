# @kp-soft/themes

The kp-soft house themes as a shared package: seven `data-theme` palettes
(formal, light, dark, cyberpunk, pastel, terminal, topo) as plain CSS
custom properties, the per-theme texture "registers", the cyberpunk HUD
register with its motion, a React 19 theme hook + switcher, and the
cyberpunk-only fx components. One contrast gate guards every colour pair.

Consumers: [JobTracker](../JobTracker) (from its L0 milestone) and
kp-soft itself (its queue item #21).

## Install

Private git dependency, pinned to a tag (no registry):

```json
"dependencies": {
    "@kp-soft/themes": "github:kennypassenier/kp-themes#v0.1.1"
}
```

Peer dependencies: `react >= 19`; `motion >= 12` only if you use
`BootSequence` from `@kp-soft/themes/fx`. Node 26 for the scripts.

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

## Consume the JavaScript

```js
import { ThemeSwitcher, THEME_META, THEMES, applyTheme, initializeTheme, useTheme } from '@kp-soft/themes';
import { BootSequence, DecipherText, DigitalRain, ScrambleNumber } from '@kp-soft/themes/fx';
```

- `THEME_META` — `{ name: { label, dark, bg, fg, primary } }`, the one
  client-side list of themes; `THEMES` is its key list. Labels are Dutch
  (the apps' UI language).
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
- `<ThemeSwitcher themeOptions label failedMessage className />` — a
  dependency-free button + listbox with a two-colour swatch per theme and
  a check mark on the current one. It uses Tailwind/shadcn class names;
  restyle via `[data-theme-switcher]` if you are not on Tailwind.
- fx: `BootSequence` (once per session, `lines` prop; needs `motion`),
  `DecipherText`, `DigitalRain`, `ScrambleNumber` — cyberpunk only, plain
  or absent elsewhere and under `prefers-reduced-motion`.

Everything is plain JavaScript with JSDoc types (`jsconfig.json` has
`checkJs`); editors pick up the types from your own `@types/react`.

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
`--background` and checks 21 pairs per theme (13 surface/text pairs,
`accent` at 3:1, and the seven status badges at 4.5:1). Run `npm run
gates` before every commit.

## Cyberpunk register: shadcn markup hooks

`css/cyberpunk-register.css` styles `[data-slot='card']` (underglow line,
clipped corner) and `[data-slot='button']` (clipped corner, charge
sweep). Those are shadcn markup hooks; map them to your own selectors if
you do not use shadcn. The class-based hooks (`.microlabel`, `.fx-notch`,
`.fx-brackets`, `.fx-rule`, `.fx-signal-badge`, `.fx-flicker`, `.fx-pulse`,
`.fx-glitch` + `data-text`, `.fx-media`, `.fx-cellpop`, `.glow-primary`,
`.glow-accent`, `.glow-card`, `.gradient-text`) work on any markup.

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
- A license. The repository is public (SCOPE S8); the licence itself is
  decided in this project's Phase 3.

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

npm 12 refuses git dependencies unless the consumer opts in. Put this
in the consumer's `.npmrc` (the setting accepts only `all`, `none`,
`root`; `none` refuses). Use `all`, not `root`: `root` covers only the
root package, so it does not reach a package declared inside a
workspace — which is how JobTracker, the one npm consumer, declares it.

```
allow-git=all
```

The package ships `.jsx` and `.js` sources for a bundler (Vite, esbuild);
plain Node cannot import the `.jsx` files.

## Tailwind consumers: add the package as a source

Tailwind v4 generates only the utility classes it finds in the sources it
scans, and it does not scan `node_modules`. The `ThemeSwitcher` and the fx
components carry utility classes (`size-9`, `inline-flex`, …), so a Tailwind
consumer must declare the package as a source in its CSS entry, next to the
imports:

```css
@import 'tailwindcss';
@source '../../../node_modules/@kp-soft/themes'; /* path relative to this file */
@import '@kp-soft/themes/css';
@import '@kp-soft/themes/css/tailwind-bridge';
```

Without it the switcher renders at 0×0 px with no error (found live in
JobTracker's L0 demo, 2026-09-02; correction C3 there).

## Labels in another language

`ThemeSwitcher` renders the Dutch labels from `THEME_META` by default; pass
`labels={{ formal: 'Formal', light: 'Light', dark: 'Dark', cyberpunk: 'Cyberpunk', pastel: 'Pastel', terminal: 'Terminal', topo: 'Topographic' }}`
to override any of them (v0.1.1).
