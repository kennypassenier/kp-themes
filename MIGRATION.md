# Migrating to v1

v1 is a break, deliberately. Backward compatibility for the old imports
was considered and declined (TH24): keeping a shim alive would have kept
alive the thing the break exists to remove — a copy of every theme's
colours living in JavaScript, drifting away from the stylesheet with no
error and no failing gate.

Five things changed. Each one is a search-and-replace, and each is here
with what it becomes.

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
