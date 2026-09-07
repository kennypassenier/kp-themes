# Migrating to v1

v1 is a break, deliberately. Backward compatibility for the old imports
was considered and declined (TH24): keeping a shim alive would have kept
alive the thing the break exists to remove — a copy of every theme's
colours living in JavaScript, drifting away from the stylesheet with no
error and no failing gate.

Five things changed. Each one is a search-and-replace, and each is here
with what it becomes.

## Coming from 3.2.0 to 4.0.0

### The movable grid and the nav bar need one element around them

Both now decide their narrow form from the width of the **box they are
given** rather than the width of the window (TH104). A container query
styles a container's contents and never the container itself, so the
element that changes — the grid's column count, the bar's padding —
cannot be the one carrying `container-type`. Each needs a wrapper.

```html
<!-- before -->
<div class="kp-grid" data-kp-grid data-kp-columns="6">…</div>
<nav class="kp-nav" aria-label="Main">…</nav>

<!-- after -->
<div class="kp-grid-wrap">
    <div class="kp-grid" data-kp-grid data-kp-columns="6">…</div>
</div>
<div class="kp-nav-wrap">
    <nav class="kp-nav" aria-label="Main">…</nav>
</div>
```

This is markup, so it is for whoever writes the markup: **kyu, Almanac
and the chassis kit hand-write these in Rust templates and have to add
the two divs.** React consumers do not — `<GridLayout>` and `<NavBar>`
render their own wrapper. Pass `wrap={false}` if your page already
establishes a container of its own, `wrapClassName` to put classes on it.

Nothing breaks without the wrapper: the component keeps the wide form in
every box, which is exactly what 3.2.0 did everywhere. What you lose is
the narrow form. The threshold is 40rem of wrapper width.

Put the wrapper around the `<nav>` only. The skip link stays outside it —
it is the first focusable thing on the page and belongs to the page, not
to the bar.

### The nav bar's padding is two knobs instead of a `clamp()`

Up to 3.2.0 the bar declared `padding: 0.625rem clamp(0.75rem, 3vw,
1.5rem)`. `3vw` read the window, so a bar in a 300px column of a 1280px
page was given a 1280px page's inset. The two ends of that ramp are now
named, and the narrow one is what the container query picks:

| Was                                             | Is                                                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `padding: 0.625rem clamp(0.75rem, 3vw, 1.5rem)` | `--kp-nav-pad-block` (0.625rem), `--kp-nav-pad-inline` (1.5rem), `--kp-nav-pad-inline-narrow` (0.75rem) |

If you were overriding that `padding` declaration, override the knobs
instead. The step replaces a ramp: the inset no longer changes on every
pixel of width, it changes once, at 40rem.

Both wrappers carry a floor of their own, `--kp-grid-wrap-min` and
`--kp-nav-wrap-min`, the same shape as `--kp-table-wrap-min`: they
default to `auto` and do nothing until you set one. Set one if your
wrapper lives in a shrink-to-fit box (a flex row, an inline-block), where
inline-size containment takes it to zero.

### A grid tile's place is four custom properties

`js/gridlayout.js` and `<GridLayout>` used to write `grid-column` and
`grid-row` as inline styles. An inline style beats any rule in any layer,
so the collapse-to-one-column rule had been dead since it was written —
measured at 320px on 3.2.0, a tile read `1 / -1` at 302px before the grid
was attached and `1 / span 2` at 241px after, and attaching is the only
way the grid is used.

Both channels now write `--kp-tile-x`, `--kp-tile-y`, `--kp-tile-w` and
`--kp-tile-h`, and `.kp-grid__tile` derives its tracks from them. If you
were reading a tile's placement out of `element.style.gridColumn`, read
the `data-x` / `data-y` / `data-w` / `data-h` attributes instead — they
have always been the contract, and `layoutOf()` and the layout events
hand you the same numbers. If you were overriding `grid-column` on a
tile, set the custom properties instead: your override still works, but
it now also beats the narrow rule, which is the fault this change
removes.

## Coming from 3.1.1 to 3.2.0

Nothing breaks. Everything here is an addition, and most of it is
something a consumer wrote by hand and can now delete.

### What you can delete

The chassis kit wrote 71 lines of layout glue and 28 inline `style`
attributes, and its own stylesheet said this was the layout the package
did not ship. It ships now. If your project has a rule like the one on
the left, the class on the right replaces it.

| Your own rule                                | The package's class                                                                     |
| -------------------------------------------- | --------------------------------------------------------------------------------------- |
| a centred column with a max width            | `.kp-page`                                                                              |
| a flex column with a gap between children    | `.kp-stack`                                                                             |
| a row of controls that wraps                 | `.kp-row`, with `.kp-row--end`, `.kp-row--start`, `.kp-row--between`, `.kp-row--nowrap` |
| a responsive card grid                       | `.kp-autogrid`                                                                          |
| a sidebar that drops below on narrow screens | `.kp-sidebar` with `.kp-sidebar__aside` and `.kp-sidebar__main`                         |
| space above a block, except the first        | `.kp-section`                                                                           |
| a narrow centred box                         | `.kp-center`                                                                            |
| a readable measure for running text          | `.kp-prose`                                                                             |
| secondary text in the muted colour           | `.kp-text-muted`                                                                        |
| right-aligned or centred text                | `.kp-text-end`, `.kp-text-center`                                                       |
| a monospace span                             | `.kp-mono`                                                                              |
| a block of code on a card                    | `.kp-code-block`                                                                        |

Spacing, gap, display, alignment, text and size utilities replace most of
the remaining one-off rules: 115 of them, listed in
[docs/UTILITIES.md](docs/UTILITIES.md). Every one is a single declaration
on the theme's own scale.

A busy control no longer needs a class of its own. Setting
`aria-busy="true"` -- which you should be setting anyway, because that is
what a screen reader reads -- now also dims the control and changes the
cursor.

### What is new

- **A compact density mode.** `data-density="compact"` on any element
  tightens everything inside it. Buttons stay above the 24px pointer
  target.
- **A scroll region for wide tables** that a keyboard can reach, in both
  channels, plus `.kp-cell-break`, `.kp-cell-truncate`, `.kp-col-low` and
  a card layout for the plain table through `data-kp-cards`.
- **A dist bundle**: `dist/kp-themes.css` and `dist/kp-themes.js`, one
  tag each instead of eight. The loose files stay exactly as they are.
- **An unknown theme name is no longer silent.** It still falls back, but
  it warns once per session and dispatches an event saying what was
  asked for and what was applied. If a page of yours has silently been
  showing the default theme, you will now hear about it.
- **A documentation site**, with a page per component and the story of
  every theme.

### A status badge no longer needs an inline style

`css/components.css` now carries a rule per status, so a server-rendered
page writes the class and the attribute and gets the plate:

| Before                                                                                                   | Now                                           |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `<span class="kp-badge" style="background: var(--status-offer); color: var(--status-offer-foreground)">` | `<span class="kp-badge" data-status="offer">` |

The seven names are `draft`, `sent`, `screening`, `interview`, `offer`,
`rejected` and `withdrawn`. The React `Badge` stops writing the inline
style for those, and keeps writing it when you point `tokenPrefix` at
your own token family — your names have no rule, so nothing changes for
you. Colour still may not be the only carrier of meaning: a badge with a
status and no words is refused, as it always was.

### One knob changed meaning

`--kp-shortcuts-width` now sets the **total** width of the shortcut
sheet, where it used to set the content width and leave the padding and
border outside it. The default moved from `28rem` to `30.625rem` in the
same breath, so the sheet is the same 490px it has always been on a wide
screen — but it no longer runs off the side of a 360px phone, where it
used to measure 373px and push the page sideways. If you set that knob
yourself, add the 42px back or, better, set the width you actually want
to see.

### One repair

Printing was broken between 3.1.0 and 3.2.0 for every theme: the print
override lost to the theme's own tokens, so a dark theme printed dark. It
is fixed. Nothing on your side changes.

## Coming from 3.1.0 to 3.1.1

Nothing breaks. One theme's signature moved (S20).

- **Terminal's blinking block cursor** no longer sits after every `h1`
  and `h2` on the page. It now appears once, after the label of
  whichever field currently has focus. A page with no focused field
  shows no cursor, where before every heading always showed one.

## Coming from 3.0.0 to 3.1.0

Nothing breaks. Thirteen themes, two knobs and a register arrived; every
existing theme's values are what they were (S20).

- **Thirteen new themes.** `brutalism`, `deco`, `academia`, `phantom`,
  `ticker`, `nishiki`, `shade-light`, `shade-dark`, `mono`, `retro`,
  `grotesk`, `tazhib`, `nostromo`. A vendored `css/themes.css` grows
  accordingly; the `Theme` union grows with it, so a switch over theme
  names that was exhaustive is now missing thirteen cases — TypeScript
  will say so.
- **Two new tokens in every theme.** `--fx-shadow-offset` (a length,
  `0px` in the eleven you had) and `--chart-pattern-1` … `-5` (`none` in
  the eleven you had). A consumer that copies token names by hand adds
  them; one that reads `css/themes.css` has them.
- **A second register.** `@kp-soft/themes/css/retro-register` draws
  retro's bevels; opt-in like the cyberpunk one, inert in every other
  theme.
- **Hover is a whole step, not a half.** Every derived `--*-hover` token
  in every theme — the eleven you had included — moves one OKLCh
  lightness step from its base instead of half of one (about 6 on the
  perceptual scale instead of 3; the pressed state still must reach 10).
  Kenny found the half step too faint on the showcase. Nothing to change
  in a consumer; a hover that looked subtle looks visible.
- **The native `<select>` wears the theme where the browser allows it.**
  Chromium 135+ (`appearance: base-select`) draws the open list on the
  popover surface with the ink wash under the hovered option; Firefox and
  older browsers keep the platform list. A consumer who styled
  `::picker(select)` itself overrides ours by cascade.
- **Highlights no longer read `--accent`.** A hovered menu item, a
  highlighted combobox option and a hovered ghost or icon button paint
  `--kp-highlight` (the foreground at 8% alpha) with the surrounding
  text colour, instead of `--accent` / `--accent-foreground`. Nothing in
  a consumer changes unless it set `--accent` expecting it to drive those
  highlights; set `--kp-highlight` then.
- **The popover scrolls.** `.kp-popover` carries a max height
  (`--kp-popover-max-height`, default `min(80vh, 40rem)`) and
  `overflow: auto`, because a picker with twenty-four options is taller
  than most viewports. A consumer whose menu wanted to be taller sets the
  knob.
- **Fields and inputs shrink inside their track.** `.kp-field`,
  `.kp-field__input` and `.kp-datatable__search` take `min-inline-size:
0` and the inputs `inline-size: 100%`, after a wide face pushed a
  fixture past a 320px viewport. A form that relied on an input's
  intrinsic width sets one.

## Coming from 2.x to 3.0.0

Four things can need a change; most consumers hit one.

### 1 · Framework-free: nothing attaches on import

If you loaded modules with script tags, replace them with one:

```html
<script type="module" src="/vendor/kp-themes/js/auto.js"></script>
```

If you imported a module and relied on it attaching, call the function:

```js
import { attachThemePickers } from '@kp-soft/themes/js/picker';
attachThemePickers();
```

`themeMenuMarkup()` no longer schedules an attach either; attach after the
markup is in the DOM.

### 2 · The theme labels are English

"Formeel" is "Formal" on screen. To keep the Dutch:

```jsx
<ThemeSwitcher
    labels={{
        formal: 'Formeel',
        light: 'Licht',
        dark: 'Donker',
        'high-contrast': 'Hoog contrast',
        blueprint: 'Blauwdruk',
        solstice: 'Zonnewende',
        topo: 'Topografisch',
    }}
/>
```

```js
themeMenuMarkup({ labels: { formal: 'Formeel' /* … */ } });
```

### 3 · The locale is the page's

The date picker wrote `dd-mm-yyyy` and read day-first; now it reads the
nearest `lang` attribute, then the browser. A page with `<html lang="nl">`
sees no change. A page with no `lang` on a browser set to English gets
`mm/dd/yyyy`. Say what you mean:

```html
<html lang="nl">
    <div data-kp-datepicker data-kp-locale="nl-NL"></div>
</html>
```

```jsx
<DatePicker locale="nl-NL" weekStartsOn={1} />
<DataTable locale="nl-NL" … />
```

`toDutch()` still exists, deprecated; it is `formatLocalDate(date, 'nl-NL')`.

### 4 · `BootSequence` moved

```js
import { BootSequence } from '@kp-soft/themes/fx/boot-sequence';
```

The `fx` barrel no longer pulls in `motion`.

### Nothing to do

Every other change is additive: a prop with the old behaviour as its
default, a handle on a detach you were not reading, a custom property with
the old value as its fallback. If you vendor the stylesheets only, nothing
changed on screen.

### Worth checking

- `ThemeSwitcher` now wears `kp-theme-menu` / `kp-icon-button` /
  `kp-popover` / `kp-menu` rather than Tailwind class names; a consumer
  that styled the old names restyles the new ones.
- `Button` with `onUndo` now acts on the click and offers an undo; it was
  a no-op before.
- `GridLayout` tiles keep the `aria-label` you gave them; the geometry is
  in the description.

## Coming from 1.x to 2.0.0

One breaking change, and it is visible rather than structural: **the
default language on screen is English.** No export was removed, no
signature changed, and nothing needs a code change unless you want the
Dutch words back.

### If you want the Dutch back

```js
import { STRINGS_NL, setStrings } from '@kp-soft/themes/js/strings';

setStrings(STRINGS_NL);
```

Once, at startup, before anything renders. In React you can also wrap the
tree:

```jsx
import { StringsProvider } from '@kp-soft/themes/hooks/strings';

<StringsProvider value={STRINGS_NL}>
    <App />
</StringsProvider>;
```

### If you want your own words

That is the point of the change. Pass a partial object at any of three
levels — a `strings` prop on one component, a provider for a subtree, or
`setStrings()` globally. What you do not name keeps its default. The full
key list with the English defaults beside it is `js/strings.js`; the
README section "The words on screen are yours" has the shapes.

### If you vendor the stylesheets only

Nothing changed for you. The strings live in the JavaScript; `css/themes.css`
and `css/components.css` carry no words.

### The thing worth checking

Your own screen-reader announcements. If you built anything on top of our
components that reads their `aria-live` regions or repeats their labels,
those regions now say something else.

## Coming from 1.0.0 to 1.1.0

Nothing below applies to you: 1.1.0 breaks nothing. Two things change and
both only add.

**Types ship now.** A `.d.ts` beside every entry point. If you wrote your
own declarations for this package, delete them — kp-soft did exactly that
on 2026-09-04 and recorded it as temporary for this reason.

**`Theme` is the union of the eleven names**, where it was `string`. It can
only turn code red that was already wrong: `applyTheme('formeel')` used to
type-check and fall back to `formal`. What a function accepts is unchanged
— `storeTheme` and `initializeTheme` still take a plain string — so a theme
read out of config or a database still passes. Narrow it with `isTheme()`
where you want the guarantee.

---

## 1 · `THEME_META` is gone → `THEME_RECORDS`

It carried each theme's label, dark flag, background, foreground and
primary colour: 21 colours duplicating `css/themes.css`, measured on
2026-09-04 as not yet diverging, which is not the same as safe. The most
ordinary change in a theme project is adjusting a palette, and that is
exactly the change that would have made the swatch show a colour the
theme no longer had.

```diff
-import { THEME_META, THEMES } from '@kp-soft/themes';
-const isDark = THEME_META[theme].dark;
-const label  = THEME_META[theme].label;
+import { THEME_RECORDS, THEMES } from '@kp-soft/themes';
+const record = THEME_RECORDS.find((t) => t.name === theme);
+const isDark = record.dark;
+const label  = record.label;
```

`THEME_RECORDS` is generated from `themes/*/tokens.json`, and its `dark`
flag is read from each theme's own `color-scheme` — the same declaration
the gates check. A picker cannot believe in a fourth dark theme any more.
(kyu did. There are three.)

**The colours have no replacement, and do not need one.** A swatch that
previews a theme wears that theme:

```diff
-<span style={{ background: `linear-gradient(135deg, ${THEME_META[t].bg} 50%, ${THEME_META[t].primary} 50%)` }} />
+<span className="kp-swatch" data-theme={t} />
```

`data-theme` works on any element, not only on `<html>`, so the swatch
reads the live custom properties. Four lines of CSS, and the duplication
is gone. Import `@kp-soft/themes/css/components` for `.kp-swatch`.

## 2 · `applyTheme` validates, and returns what it applied

It used to set whatever it was given. It was the only exported entry
point that did not validate, so an unknown value reached the DOM through
it while the same value was rejected everywhere else.

```diff
-applyTheme(fromServer);            // 'chartreuse-deluxe' would land on <html>
+const applied = applyTheme(fromServer);  // unknown values become 'formal'
```

## 3 · `useTheme()` gained `storageFailed`

`saveFailed` still means _your_ `onChange` refused the change. The new
flag means the browser refused to store it — private mode, blocked
storage, a full quota. They are separate because their remedies are:

```diff
-const { theme, updateTheme, saveFailed } = useTheme();
+const { theme, updateTheme, saveFailed, storageFailed } = useTheme();
```

Neither is swallowed any more. In a server-rendered dashboard a
preference that quietly fails to save is indistinguishable from a broken
picker.

## 4 · The theme state lives in the document

The React hook used to keep the current theme and its subscriber list in
module state, which a plain `<script>` cannot reach. It now reads
`document.documentElement.dataset.theme`, and a change is announced as
one DOM event both channels listen to:

```js
document.addEventListener('kp-theme-change', (e) => console.log(e.detail.theme));
```

Nothing to change in your code unless you were reaching into the hook's
internals. If you were, `@kp-soft/themes/js/core` exports the primitives
directly: `applyTheme`, `currentTheme`, `storeTheme`, `storedTheme`,
`initializeTheme`, `onThemeChange`.

## 5 · `ThemeSwitcher` gained a prop, and lost its inline swatch

`storageMessage` is shown when the browser refuses to store the choice;
`failedMessage` still covers a server that refused. The swatch is now a
`.kp-swatch` element rather than an inline gradient, so styling it means
styling that class.

---

## What is new, and worth taking

- **A framework-free picker** — `@kp-soft/themes/js/picker`, one module
  attached to markup your server already wrote. No npm step needed.
- **Components in both channels** — the same class names whether they
  come from React or from your own templates.
- **Contracts that fail loudly** — a destructive action without an undo
  or a confirmation is refused; a badge whose colour means something must
  also say what it means.
- **A complete theme** — links, code, selection, placeholders, the
  browser's own hooks and a print stylesheet. The browser's default link
  blue scored 1.99 against the dark theme's background, where 4.5 is the
  floor.
- **Gates you can run** — `npm run gates` reproduces every claim in
  `docs/DESIGN_INVARIANTS.md`, and `SHA256SUMS` beside the tag verifies
  what you vendored.
