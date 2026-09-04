# User guide

For someone building a page with this package. It goes feature by
feature, and every example is code you can paste.

The two channels — React, and framework-free — render the same class
names and share the same state, so a page can use both and nothing
betrays which is which. Pick per component, not per project.

---

## Getting a theme onto the page

Three lines, and the order matters.

```html
<head>
    <!-- 1. Before the stylesheet: the last choice, so there is no flash
            of the wrong theme while the page loads. -->
    <script>
        (function () {
            try {
                var t = localStorage.getItem('theme');
                if (t) document.documentElement.dataset.theme = t;
            } catch (e) {}
        })();
    </script>

    <!-- 2. The palette. This alone gives you a themed page: body colours,
            links, code, selection, form fields, the print stylesheet. -->
    <link rel="stylesheet" href="/vendor/kp-themes/css/themes.css" />

    <!-- 3. Only if you use the components. -->
    <link rel="stylesheet" href="/vendor/kp-themes/css/components.css" />
</head>
```

The snippet in step 1 knows nothing about which themes are dark — it
copies a name and stops. That is deliberate: the theme list lives in one
generated place, and a snippet carrying its own copy is how a picker comes
to believe in a theme that no longer exists.

An unknown stored value is corrected to `formal` as soon as the picker
module loads.

## The eleven themes

| `data-theme` | Label | Dark |
| --- | --- | --- |
| `formal` | Formeel | no |
| `light` | Licht | no |
| `dark` | Donker | yes |
| `cyberpunk` | Cyberpunk | yes |
| `pastel` | Pastel | no |
| `terminal` | Terminal | yes |
| `topo` | Topografisch | no |
| `high-contrast` | Hoog contrast | no |
| `sepia` | Sepia | no |
| `blueprint` | Blauwdruk | yes |
| `solstice` | Zonnewende | yes |

That table is generated from the token sources into
`js/theme-registry.js`; import it rather than typing the list:

```js
import { THEMES, DEFAULT_THEME, STORAGE_KEY } from '@kp-soft/themes/js/registry';
```

Each theme's character is written down — what it is, what is load-bearing,
what it deliberately does not do — in `themes/<name>/anatomy.md`. Read the
one you are about to change before you change it.

## The theme picker [TH8]

### Framework-free

Your server writes the markup; one module attaches the behaviour.

```html
<div data-kp-theme-picker>
    <button type="button" data-kp-theme="formal"><span class="kp-swatch" data-theme="formal"></span> Formeel</button>
    <button type="button" data-kp-theme="dark"><span class="kp-swatch" data-theme="dark"></span> Donker</button>
</div>
<p data-kp-theme-status hidden></p>

<script type="module" src="/vendor/kp-themes/js/theme-picker.js"></script>
```

The script marks the chosen option three ways — `aria-pressed` for
assistive technology, `data-selected` for tests, `.is-selected` for your
CSS — and writes into `[data-kp-theme-status]` when the browser refuses to
store the choice.

The swatch wears the theme it previews (`data-theme` works on any element,
not only on `<html>`), so it shows that theme's live colours instead of a
copy that drifts.

### As an icon with a dropdown

The same behaviour in the shape the consuming projects preferred: a
square icon button that opens a menu. `themeMenuMarkup()` writes it, so a
server can print it into a template:

```js
import { themeMenuMarkup } from '@kp-soft/themes/js/picker';
html = themeMenuMarkup({ id: 'theme-menu', label: 'Thema kiezen' });
```

The dropdown is a popover: Escape and clicking elsewhere close it without
any code of ours, and it closes itself after a choice. The check mark
beside the current theme is the second carrier, so the menu does not rely
on weight alone.

### React

```jsx
import { ThemeSwitcher, useTheme } from '@kp-soft/themes';

<ThemeSwitcher />;

// or build your own on the hook
const { theme, updateTheme, saveFailed, storageFailed } = useTheme({
    preferred: user?.theme, // a signed-in member's saved choice always wins
    fallback: 'dark', // used when there is nothing stored
    onChange: (next) => api.saveTheme(next), // throw or reject to refuse
});
```

Precedence: `preferred` > `localStorage` > `fallback` > `formal`.

`saveFailed` means your `onChange` refused the change and it was reverted
— the "endpoint that lies" guard. `storageFailed` means the browser
refused to remember it: private mode, blocked storage, a full quota. They
are separate because their remedies are, and neither is swallowed.

### Both at once

They share the document, not a module. A change from either is announced
as one event:

```js
document.addEventListener('kp-theme-change', (e) => {
    console.log(e.detail.theme, 'was', e.detail.previous);
});
```

A choice made in another tab arrives on the same event, so a subscriber
never has to know which tab it came from.

## Components [TH1-TH7]

Same classes in both channels. In React:

```jsx
import { Button, Badge, Alert, Card, Field, Table, NavBar } from '@kp-soft/themes';
```

Framework-free, the same markup by hand:

```html
<button type="button" class="kp-button kp-button--primary">Opslaan</button>
<span class="kp-badge" data-kp-semantic data-status="offer">Aanbod</span>
```

### Two contracts that are enforced, not suggested

**A destructive action must offer an undo or a confirmation** [DI10]. Not
both — WCAG's SC 3.3.4 accepts either. A button that offers neither is
reported to the console and disabled:

```jsx
<Button variant="destructive" confirm="Zeker?" onClick={remove}>Verwijderen</Button>
<Button variant="destructive" onUndo={restore} onClick={remove}>Verwijderen</Button>
```

```html
<button class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Zeker?">Verwijderen</button>
```

The confirmation is a small obstacle rather than a dialog: the first click
arms the button and changes its label to your phrase, the second acts, and
the arming lapses after a few seconds. That shape is what the evidence
supports — a plain "are you sure?" still works for at most a fifth of
people after twenty exposures, one carrying a small obstacle for 44 to 74
per cent.

**A badge whose colour means something must say what it means** [DI4].
Seven pale plates are one plate to a reader who cannot tell those colours
apart, so a semantic badge with no words is refused the same way.

## Overlays [TH35]

```jsx
import { Dialog, DropdownMenu, Tooltip, Toasts, Accordion, Tabs, Breadcrumb, Pagination, Progress, Spinner, Skeleton } from '@kp-soft/themes';
```

Framework-free, `js/overlays.js` wires a dialog to its trigger and gives a
tab list its roving tabindex:

```html
<button type="button" class="kp-button" data-kp-dialog="confirm">Openen</button>
<dialog class="kp-dialog" id="confirm">
    <h2 class="kp-dialog__title">Bevestigen</h2>
    <div class="kp-dialog__actions">
        <button type="button" class="kp-button" data-kp-dialog-close>Sluiten</button>
    </div>
</dialog>
<script type="module" src="/vendor/kp-themes/js/overlays.js"></script>
```

The keyboard behaviour is the browser's, not ours: `<dialog>` traps focus,
closes on Escape and returns focus to whatever opened it. A hand-written
focus trap is how focus traps break, so there is none here.

## Showing data [TH33]

Six patterns that are not components but that every data-heavy page
rewrites badly:

```html
<p class="kp-url">https://example.test/a/very/long/path</p>
<!-- wraps instead of widening the page -->
<span class="kp-id">a3f9-2b71</span>
<!-- monospace -->
<span class="kp-numeric">1.284,50</span>
<!-- digits line up between rows -->
<span class="kp-timestamp">2026-09-04 14:07</span>
<span class="kp-masked">•••• 4417</span>
<span class="kp-truncate">One line, ellipsis</span>
<div class="kp-empty">Nog geen sollicitaties.</div>
```

## The page shell [TH36]

```html
<a class="kp-skip-link" href="#main">Naar de inhoud</a>
<footer class="kp-footer">…</footer>
<div class="kp-error"><h1>404</h1><p>…</p></div>
```

The skip link is invisible until focused and then unmissable — it is the
first thing a keyboard user meets. Printing needs nothing from you: the
print rules drop the theme to black on white and hide the texture layer,
and a printed link gets its address appended, because paper cannot be
clicked.

## Cyberpunk effects [TH14]

```jsx
import { BootSequence, DecipherText, DigitalRain, ScrambleNumber } from '@kp-soft/themes/fx';
```

Cyberpunk only; plain text in every other theme and for anyone who asked
for less motion — and they keep listening, so turning that setting on
mid-session stops them without a reload. The real string always reaches a
screen reader through `aria-label`, whatever the glyphs are doing.

`BootSequence` needs the optional `motion` peer; the other three need
nothing.

## How a theme moves

A theme's handwriting is three tokens, and every transition in the package
reads them rather than carrying its own number:

| Token | What it decides |
| --- | --- |
| `--fx-duration` | how long anything takes — 90 ms in terminal, 240 ms in sepia and solstice |
| `--fx-ease` | how it accelerates. Pastel overshoots, terminal uses `steps(2, end)` because a character display jumps rather than sweeps, blueprint and high-contrast are `linear` |
| `--fx-lift` | how far a control rises under the cursor. Formal, sepia and high-contrast answer `0px`, which is a character rather than an omission |

Each theme also has at most one gesture of its own: a rule that draws
itself under a heading in formal, a blinking block cursor in terminal, a
badge that settles in pastel, a drifting contour layer in topo, a ruled
line in blueprint, an ember around a new card in solstice, and the whole
register in cyberpunk. Sepia and high-contrast have none on purpose — in
the restful theme and the accessible one, a gesture works against the
reason the theme exists.

All of it sits inside `prefers-reduced-motion: no-preference`, and the
flash threshold is measured rather than assumed.

## Adding a theme

1. `themes/<name>/tokens.json` — copy an existing one and change the
   values. Every theme declares the same token names; the parity gate
   refuses one that does not.
2. `themes/<name>/anatomy.md` — what the theme is, what is load-bearing,
   what it will not do.
3. Add the name to `themes/order.json`.
4. `npm run generate` then `npm run gates`.

The gates will tell you what is wrong in plain sentences: which pair is
under contrast, which boundary is under 3:1, which state you cannot see.
Fix the token, not the gate.
