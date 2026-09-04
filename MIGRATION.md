# Migrating to v1

v1 is a break, deliberately. Backward compatibility for the old imports
was considered and declined (TH24): keeping a shim alive would have kept
alive the thing the break exists to remove — a copy of every theme's
colours living in JavaScript, drifting away from the stylesheet with no
error and no failing gate.

Five things changed. Each one is a search-and-replace, and each is here
with what it becomes.

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
