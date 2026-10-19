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

An unknown stored value is corrected to the default theme as soon as the
picker is attached; `initializeTheme(fallback)` names another, and
`applyTheme(name, { strict: true })` throws instead of substituting.

## The subpaths, because they are not the file names

Found in the 2026-09-12 field test, by guessing wrong twice from a clean
install. The export map names the things a consumer reaches for, and those
names are shorter than the paths:

| You want | Import or link | Not |
| -------- | -------------- | --- |
| the palette | `@kp-soft/themes/css` | `…/css/themes` |
| the components layer | `@kp-soft/themes/css/components` | |
| the layout layer | `@kp-soft/themes/css/layout` | |
| the utilities | `@kp-soft/themes/css/utilities` | |
| the minified palette | `@kp-soft/themes/css/min` | |
| the theme list | `@kp-soft/themes/js/registry` | `…/js/theme-registry` |
| the state | `@kp-soft/themes/js/core` | `…/js/theme-core` |
| the picker | `@kp-soft/themes/js/picker` | |
| a register | `@kp-soft/themes/themes/<name>/…`, or copy `css/<name>-register.css` | |

Two things follow from that. A stylesheet is usually **linked by path**
rather than imported — you copy the files you want into whatever your
server serves, as the three lines above do — and the subpaths exist for
bundlers and for tooling that resolves through `package.json`. And the
React channel needs a bundler that understands JSX: the package ships
`.jsx` sources on purpose, so plain Node cannot import the root entry.
Vite, esbuild and webpack all handle it with no configuration beyond
their own JSX setting.

```sh
# What the field test ran, from a clean install, to prove both channels:
npm install @kp-soft/themes
node -e "import('@kp-soft/themes/js/registry').then(m => console.log(m.THEMES.length))"   # 22
```

---

## The twelve themes

| `data-theme` | Label | Dark |
| --- | --- | --- |
| `formal` | Formal | no |
| `dark` | Dark | yes |
| `cyberpunk` | Cyberpunk | yes |
| `synthwave` | Synthwave | yes |
| `pastel` | Pastel | no |
| `forest` | Forest | no |
| `blueprint` | Blueprint | yes |
| `solstice` | Solstice | yes |
| `brutalism` | Brutalism | no |
| `deco` | Art Deco | yes |
| `nostromo` | Nostromo | no |
| `titanium` | Titanium | yes |

Eleven of these are the set 3.0.0 shipped; the thirteen from `solstice`
on arrived in 3.1.0, chosen and researched in `docs/archive/THEME_CANDIDATES.md`;
`synthwave` is 5.0.0's, the first theme lifted after cyberpunk on the
research in `docs/archive/RESEARCH_2026-09.md` (LIFT_PLAN row 1); `phantom` is the
second, rebuilt from its approved demo "Calling Card" (row 2); `retro`
was the third (removed 2026-10-09), its 3.1.0 bevel register grown into the whole desktop from
"Bevel 95" (row 3); `terminal` is the fourth, from "Green Phosphor"
(row 4); `brutalism` is the fifth, from "Hard Copy" (row 5); and the
remaining nineteen were lifted the same way over 2026-09-08, each from
its own approved demo, so every theme carries a register. Three were
removed again on 2026-10-06 (Lapis, Shade (light) and Shade (dark);
see MIGRATION.md), two more on 2026-10-08 (High contrast and Sepia), and
Retro on 2026-10-09 (its idea is kept in docs/FUTURE_THEMES.md), and
Terminal, Phantom, Light and Grotesk on 2026-10-16, which leaves the
twelve above. A stored or written name of a removed theme falls back to
`formal`.

That table is generated from the token sources into
`js/theme-registry.js`; import it rather than typing the list:

```js
import { THEMES, DEFAULT_THEME, STORAGE_KEY } from '@kp-soft/themes/js/registry';
```

Each theme's character is written down — what it is, what is load-bearing,
what it deliberately does not do — in `themes/<name>/anatomy.md`. Read the
one you are about to change before you change it.

The `Theme` type is the union of exactly those twelve names since 1.1.0,
not `string`. A name that is not one of them is a compile error rather
than a silent fallback to `formal`. What a function *accepts* stayed
lenient — `storeTheme` and `initializeTheme` still take a plain string —
because narrowing an input would break a consumer that reads a theme out
of config or a database; use `isTheme()` to narrow one of those.

## The theme picker [TH8]

### Framework-free

Your server writes the markup; one module attaches the behaviour.

```html
<div data-kp-theme-picker>
    <button type="button" data-kp-theme="formal"><span class="kp-swatch" data-theme="formal"></span> Formal</button>
    <button type="button" data-kp-theme="dark"><span class="kp-swatch" data-theme="dark"></span> Dark</button>
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

**In a form row** [anchors-picker-1019]. Put the picker in a `.kp-formgrid__control` (see "the form grid"): a theme button takes the
baseline of its own name (its colour dot is centred on it), so the row's label and the buttons share one line. A grouped picker
(`themeOptionsMarkup()` in a plain `ul[data-kp-theme-picker]`) draws each group as one line, the themes from the control's start edge
and the Light or Dark word at the line's end, in a column of its own. A picker inside a menu keeps its stacked sections.

**Previewing a theme without choosing it** [anchors-picker-1019]. `data-kp-theme-preview="hover"` on the picker (or
`attachThemePickers(root, { preview: true })`) shows a theme while the pointer rests on its button or the keyboard is on it, and
goes back when it leaves (after `PREVIEW_LEAVE_MS`, 90 ms, so crossing the gap between two buttons does not flicker). Nothing is
chosen, stored or announced: `currentTheme()`, the marks and every `kp-theme-change` listener keep the real theme; a press still
chooses. `data-kp-theme-preview-target="#sample"` names the element that wears the preview (default: the page's theme root). A
touch screen has no hover, so a tap chooses. A picker in a menu ends the preview when the menu closes. The picker fires
`kp-theme-preview` (`{ theme }`, `{ theme: null }` at the end). For your own code: `previewTheme(theme, { root })`,
`endPreview({ root })` and `previewedTheme({ root })` in js/theme-core.js (the root carries `data-theme-preview-from` while it
shows one). On a page that loads registers on demand (js/lazy-register.js) the register is loaded before the theme is shown.
Off by default.

**How deep a theme nests** [gap-10, measured 2026-09-20,
`research/gap-10-nested-themes/demo.html`]. One level works completely: a
pane carrying `data-theme="cyberpunk"` inside a `formal` page gets
cyberpunk's tokens *and* cyberpunk's register — its clip-path, its face,
its tracking. A second theme **inside** that one gets its own tokens and
keeps the outer theme's register: measured, a `formal` pane inside a
`nostromo` pane reads formal's `border-radius: 6px` and formal's blue,
with nostromo's `letter-spacing: 1.56px` and `ui-monospace` still on it.
Every register rule is written as `[data-theme='x'] .kp-component`, which
matches descendants, and an inner theme has the same specificity, so file
order decides rather than depth.

So: theme a page, and theme a pane inside it. Do not nest a third. The
fix is `@scope ([data-theme='x']) to ([data-theme])` in all twelve
registers, which is a round of its own rather than a patch.

### As an icon with a dropdown

The same behaviour in the shape the consuming projects preferred: a
square icon button that opens a menu. `themeMenuMarkup()` writes it, so a
server can print it into a template:

```js
import { themeMenuMarkup } from '@kp-soft/themes/js/picker';
html = themeMenuMarkup({ id: 'theme-menu', label: 'Thema kiezen' });
```

The dropdown is a popover: Escape and clicking elsewhere close it without
any code of ours, and it closes itself after a choice — unless you attach
with `{ closePopover: false }`, or pass `closeOnSelect={false}` in React.
The check mark
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

### Keeping another framework's theme flag in step

A component library that switches on its own attribute — Bootstrap's
`data-bs-theme`, for instance — knows nothing about this package, and it
should stay that way. The event and the applied `color-scheme` are enough
to follow it without keeping a second list of which themes are dark:

```js
import { onThemeChange } from '@kp-soft/themes/js/core';

const follow = () => {
    const scheme = getComputedStyle(document.documentElement).colorScheme;
    document.documentElement.dataset.bsTheme = scheme === 'dark' ? 'dark' : 'light';
};
follow();
onThemeChange(follow);
```

Written by kyu on 2026-09-04, and the point is the list that is *not*
there. A hand-kept set of dark theme names is exactly what two consumers
got wrong — kyu believed in four, kp-soft in three — before this package
generated it.

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

**A label beside an icon.** `.kp-button__text` is public API: the
element that holds the words of a button label which also holds an icon
or any other element. Use it whenever the label is more than bare text;
a label of text alone needs none. The icon stays a hidden sibling.

Why it exists: a register that underlines the first letter of a label
when the button is pointed at — its accelerator key, the way a menu bar
marks one; retro did until it was removed on 2026-10-09 — cannot tell a
bare run of text from the icon beside it in CSS. Without the element, that
underline never finds the letter next to an icon. No theme styles it today, so in the button's flex row it lays out exactly
as the bare text did. A label that marks its own letter with
`data-kp-key` is left as written.

In framework-free markup you write it yourself. `<Button>` wraps each run of text it is given
beside an element in `.kp-button__text`, and the generated framework-free
examples do the same [scope-83, scope-85].

```html
<button type="button" class="kp-button"><span aria-hidden="true">↻</span><span class="kp-button__text">Retry</span></button>
```

```jsx
<Button>
    <span aria-hidden="true">↻</span> Retry
</Button>
```

**A badge that only ever holds a label.** Five components share one rule
that lets an unbroken value break rather than push the page sideways:
`.kp-button`, `.kp-badge`, `.kp-tag`, `.kp-health` and `.kp-copyable` all
carry `overflow-wrap: anywhere`. It was measured — before that rule a
badge with a 44-character id in it was 485px wide in a 360px viewport —
and it is still the default.

The badge is the one of the five whose content is usually a word, and a
word cut in half in a narrow column reads worse than a column that grew.
So it takes a knob, and the place that knows is normally the column
rather than the badge:

```css
.status-column {
    --kp-badge-wrap: normal;
}
```

Set it to `normal` where badges hold labels; leave it alone where one
might hold an id. Reported by chassis-rs [ask-1], which measured "acti /
ve" in a status column at a 1000px viewport.

### Two contracts that are enforced, and can be taken back

**A destructive action must offer an undo or a confirmation** [DI10]. Not
both — WCAG's SC 3.3.4 accepts either. A button that offers neither is
reported to the console and disabled. Since 3.0.0 [KT6, decision D7] the
enforcement is recoverable: `enforceContracts()` records what it changed
and returns a detach that puts it back, calling it again re-evaluates a
page whose markup arrived later, `data-kp-contract-ignore` exempts an
element, `{ disable: false }` reports without disabling, and the messages
come from the dictionary. The rule is the same; the ownership moved:

```jsx
<Button variant="destructive" confirm="Zeker?" onClick={remove}>Verwijderen</Button>
<Button variant="destructive" onUndo={restore} onClick={remove}>Verwijderen</Button>
```

```html
<button class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Zeker?">Verwijderen</button>
```

**The confirmation is a modal dialog** [TH107, since 4.0.0]. The click is
swallowed, a native `<dialog>` opens with your phrase as its title, and
the browser does the focus trap, the Escape close and the focus return.
Escape and Cancel do nothing at all. Confirm re-fires the click on the
button, so the handler you already had runs exactly once and you change
no code; if the button sat in a menu on the popover layer, that menu is
shown again before focus returns to it, because `showModal()` closes
every open `popover="auto"`.

Both labels and the description come from the dictionary
(`confirmAccept`, `confirmCancel`, `confirmDescription`), so a consumer
replaces them like every other string. `openConfirmation(button, …)` is
exported if you want the same dialog somewhere else, and it hands you the
`<dialog>` it made.

The obstacle of 3.x is still there as a variant:
`data-kp-confirm-mode="inline"`, or `confirmMode="inline"` on the React
button. The first click arms the button and changes its label to your
phrase, the second acts, and the arming lapses after a few seconds. That
shape is what the evidence supports — a plain "are you sure?" still works
for at most a fifth of people after twenty exposures, one carrying a small
obstacle for 44 to 74 per cent — and the dialog is the same obstacle
somewhere a screen reader and a keyboard both find it.

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
A dialog opened by a `data-kp-dialog` trigger or the React `Dialog` opens
at the top every time, the dialog and its `.kp-dialog__body` scrolled back
to 0, unless the element it focuses lies further down [scope-96].

Both channels also say whether an overlay's box scrolls: `attachScrollbars`
(in `attachAll`, and inside the React `Dialog`, `DropdownMenu` and
`Tooltip`) keeps `data-kp-popover-overflowing` on a `.kp-popover`, `.kp-dialog` or
`.kp-dialog__body` while its content is taller than the box, with
`--kp-scroll-view`, `--kp-scroll-ratio` and `--kp-scroll-progress` beside it.
It draws nothing. A register that draws its own scrollbar reads them —
retro did, the 1995 bar disabled until the box scrolls, until it was
removed on 2026-10-09 — and declares
`--kp-scrollbar-size`, `--kp-scrollbar-inset` and `--kp-scrollbar-button`
so a press on the drawn arrows, track and thumb scrolls the box.

## The progress bar [scope-140]

Since 9.0.0 the bar is `.kp-progressbar`, one element with three parts every
register draws its own way: a track, a fill clipped to the value, and a head
on the fill's leading edge. It is one line high whatever a theme draws inside
it and keeps its width from the first frame; only the fill moves.

```html
<div
    class="kp-progressbar"
    role="progressbar"
    aria-label="Export"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="35"
    style="--kp-value: 0.35"
>
    <span class="kp-progressbar__track" aria-hidden="true"
        ><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span
    ></span>
</div>
```

`--kp-value` is the share done, 0 to 1, and is what the stylesheet paints;
`aria-valuenow` against `aria-valuemin` and `aria-valuemax` (0 and 100 when
absent) is what a screen reader reads. With `js/progressbar.js` on the page
(`js/auto.js` loads it wherever a `.kp-progressbar` is) the ARIA is the
source: set `aria-valuenow` and the paint follows, and the outer element
alone is enough, because the track, the fill and the head are written in:

```html
<div class="kp-progressbar" role="progressbar" aria-label="Export" aria-valuenow="35"></div>
```

Busy with no idea how far is `data-kp-indeterminate` and no `aria-valuenow`.
It moves while it waits; for a reader who asked for less motion nothing in
the bar moves, in any theme, and the busy bar stands as diagonal stripes so
it still reads as busy and never as a share.

From script, the module's own names:

```js
import { setProgress, setIndeterminate } from '@kp-soft/themes/js/progressbar';

setIndeterminate(bar, true); // busy: data-kp-indeterminate on, aria-valuenow off
setProgress(bar, 40); // 40 in the bar's own range; busy off, --kp-value 0.4
```

The package root re-exports them as `setProgressbar` and
`setProgressbarIndeterminate` (its `setProgress` is the upload row's), beside
`attachProgressbars(root)`, `buildProgressbar(el)` and `syncProgressbar(el)`.
In React, `<Progress value={40} label="Export" />` renders the same markup, and
leaving `value` out renders the busy bar.

Driving its states [kyu-plates-1019]: loading is the busy bar (`setIndeterminate(bar, true)`); done is `setProgress(bar, 100)`.
A task that failed is `setProgressFailed(bar, { title, text?, art? })` (the package root: `setProgressbarFailed`): the bar's row
(`.kp-progress__wrap`, label and reading with it) gives way to the package's failed plate, the title at heading size, with a
normal-size Retry that fires `kp-progressbar-retry` on the bar (bubbling; `PROGRESSBAR_RETRY_EVENT`). A bar is one line high, so
this is the one state that cannot keep the height. Listen for the event, restart the task and call `setProgress()` or
`setIndeterminate(bar, true)` (or `setProgressFailed(bar, null)`): any of them puts the bar back. Without `title` the
dictionary's `progressFailed` speaks.

Beside a reading, a bar goes in `.kp-progress__wrap` with a
`.kp-progress__value`; several labelled bars go in `.kp-progress-group`, which
gives the labels one column as wide as the longest of them so every track
begins and ends in the same place [fix-64]. The wrap is a `div` now, because
the bar is one. Knobs: `--kp-progressbar-height` (0.75rem),
`--kp-progressbar-max-width` (32rem, none inside a group),
`--kp-progressbar-duration` (240ms), `--kp-progressbar-ease` (ease-out) and
`--kp-progress-group-gap`.

### Three sizes

The bar comes in three sizes. The plain `.kp-progressbar` is the small one,
the bar as it has always been; add `.kp-progressbar--md` or
`.kp-progressbar--lg` for the other two:

```html
<div class="kp-progress__wrap">
    <div class="kp-progressbar kp-progressbar--lg" role="progressbar" aria-label="Import" aria-valuenow="40"></div>
    <span class="kp-progress__value">40%</span>
</div>
```

| Size   | Class                 | Track          | Label and reading | Use it for                                         |
| ------ | --------------------- | -------------- | ----------------- | -------------------------------------------------- |
| Small  | `.kp-progressbar`     | the theme's own | 13px (`--kp-text-sm`) | beside a line of text, in a table row, in a list |
| Medium | `.kp-progressbar--md` | × 1.5          | 16px (`--kp-text-md`) | the bar a panel or card is about              |
| Large  | `.kp-progressbar--lg` | × 2            | 18px              | the one task the whole page is waiting on          |

A size is one number, `--kp-progressbar-scale` (1, 1.5, 2), and the theme
multiplies its whole drawing by it — the track, and its own marks, cells
and patterns — so a larger bar is the same bar larger, not a taller box.
Line weights (hairlines, the theme's rule) stay as they are. The track
heights land on whole pixels in every theme, because each theme's small
height is a whole multiple of 2px. The size sits on the bar; a
`.kp-progress__wrap` around it reads it from there, so its label, its
reading and the gap between them grow with it, and a `.kp-progress-group`
takes the gaps of the largest size it holds. In React it is the `size` prop:
`<Progress value={40} label="Import" size="lg" showValue />`.

## Closing and resizing [scope-142]

A dialog leaves the way it came, and a box whose content changes eases to its
new height, growing and shrinking alike. `js/motion.js` does it, and
`js/auto.js` loads it wherever a dialog, accordion, tab set, data table, toast
stack, upload or combobox list, tree, wizard or field is; the React `Dialog`
attaches it itself. Every speed comes from the theme's dialog entrance: a
close takes two thirds of it, a resize four fifths, on the entrance's curve,
capped at `--kp-close-max` (600ms) and `--kp-size-max` (480ms).
`--kp-motion-scale` on the root plays all of it slower or faster at once.

Any other box opts in with one attribute:

```html
<div class="kp-card" data-kp-size-motion>…</div>
```

or, for a page that does not load `js/auto.js`:

```js
import { attachMotion, closeDialog } from '@kp-soft/themes/js/motion';

attachMotion(document);
await closeDialog(dialog, 'saved');
```

A size never overshoots, even in a theme whose entrance does, and what
arrives in a box (a row, a panel or a message shown) arrives with the theme's
own toast entrance. A theme may ask for its sizes to move one line at a time
with `--kp-size-steps: line` (none of the twelve does since terminal left); `withoutOvershoot(ease)` is the
curve rule, exported for a page that animates its own boxes.

What leaves goes with its theme's own exit: `leave(el)` marks it
`[data-kp-leaving]`, the theme's register draws the exit on it (formal folds
it up like a letter, titanium runs it through
the colours titanium takes under heat, and so on: one per theme, picked by Kenny on 2026-10-04), its space
closes during the exit so the box around it shrinks along, and then it is
removed (`leave(el, { hide: true })` sets `hidden` instead). A theme without
an exit of its own plays the element's arrival backwards.

```js
import { leave } from '@kp-soft/themes/js/motion';

await leave(row);
```

Several elements told to leave in the same task go one by one, the lowest
first, each starting when the one before is halfway through its exit:

```js
for (const row of selected) leave(row); // bottom row first, then upward
```

Two custom properties change that, on the element or any ancestor:
`--kp-leave-stagger` is how far into one exit the next starts (`0.5` by
default, `1` waits for each in full), and `--kp-leave-fold` is when the space
closes: `together` (the default, a third of the way into the exit), `after`
(once the exit is over, plus `--kp-leave-pause` ms) or `ghost` (a copy plays
the exit on top while the element folds underneath at once). An exit is
drawn inside the element's own box.

A register that rules a part line by line (a card's frame first, then its
lines top down, each with its own wait) says `--kp-lines: keep` on the root.
Then an exit or an arrival reads every line inside the part that ends, each on
its own element with its own time and wait, so the part is gone only when its
last line is, and an arrival is the leave played backwards line by line; a
dialog's close and open do the same, each kept entrance with its own wait
instead of one time for all. Without it every part plays as one, as before.

A live view that redraws its rows on every refresh marks the box
`data-kp-arrive="none"`; otherwise every refresh replays every row's
arrival (found on the homelab dashboard, 2026-10-04).

`data-kp-arrive="new"` is the finer choice for a live view whose rows carry a
stable id: a row added back under the key of a row that left in the same
change (`data-kp-key`, `data-kp-row-key` or `id`, read in that order) is a
repaint and stays still, and only a row with a new key arrives. Without
keys, a row counts as a repaint when its parent lost one more element of its
tag and class than it took back; a sort is a repaint; and what replaces a
loading skeleton (`.kp-skeleton`, `[data-kp-skeleton]`) is not news either.
The attribute goes on the box or any ancestor; `repaintedIn(records)` is the
test, exported. `attachMotion(root, options)` takes three options for a
consumer's own page: `size` (a selector of more boxes to ease, beside
`[data-kp-size-motion]`, for blocks you do not want to mark one by one),
`arrive` (`'all'`, the default, `'new'` or `'none'`, for the whole root) and
`arriveKeys` (more id attributes, read first, such as `['data-key']`):

```js
attachMotion(document, { size: '.card, .panel', arrive: 'new', arriveKeys: ['data-key'] });
```

A box, dialog or disclosure that leaves the page is let go a moment after
(its observers disconnected), so a page that rebuilds itself on every
navigation does not keep the old boxes watched; `motionWatchCount()` says how
many are watched, for a test. Measured (Firefox, 2026-10-04): a thousand
boxes added and removed leave the count where it was, and a box of 158 cells
redrawn under `data-kp-arrive="new"` costs about 5 ms per change.

A closing dialog keeps `open` until its motion ends, and its `close` event
comes then, with its return value. A reader who asked for reduced motion gets
none: the dialog closes and the box takes its size at once.

Every opposite motion is a mirror: what shuts plays what opened backwards,
frame t of the one being frame T - t of the other. A box shrinks on its grow
curve turned around, in the same time. A data table's group folds as its
open did, turned around: its rows play their arrival backwards while the box
eases shut, ending where the open began, and the rows are hidden once they
have played. The rows carry `data-kp-folding="out"` meanwhile; any element a
page marks so is taken out of the box's settled height while it plays, so the
box glides shut with it instead of snapping shut once it is gone, and the
glide ends when the longest of their motions ends.

### Information that updates in place

A value a live page changes (a key figure, a table cell, a state word, a
chart's last point) can show that it changed, the theme's way: call
`update(el, next)` from `js/update.js` instead of setting the text. It writes
the new value at once, marks the element `[data-kp-updating]` with the
register's idea for as long as the theme's update plays, once, and takes the
mark off; it resolves with the milliseconds it played. Picked by Kenny on
research/update-motion (2026-10-05): formal lands a stamp's frame round the
value and lets it soak in (`stamp`), cyberpunk tears off cyan and magenta
copies, jitters for a beat and locks (`glitch`), titanium runs the anodised
colours across it and cools away (`anodise`). A register names its idea in
`--kp-update`; the other seven declare none yet, and there the value simply
changes.

```js
import { update } from '@kp-soft/themes/js/update';

await update(document.querySelector('#pressure'), '3.41'); // a text value
await update(row.querySelector('.kp-state-word'), 'Restarting'); // keeps room for every word (setStateWord)
await update(tile.querySelector('svg[data-kp-spark]'), [...last24h, 3.41]); // a spark: its last point glides
```

The time is the theme's own: `--kp-update-duration` is the longer of its
resize and close times from `themeMotion()`, times 1.25, on
`--kp-update-ease`, its curve without overshoot (formal 300 ms, cyberpunk
750 ms, titanium 240 ms). A register that knows its own update time says it
with `--kp-update-time` (formal: `850ms`): when set it is the time, whatever
the dialog's is. The new value is in the page from the first frame
and readable throughout, and nothing beside it moves: a width the new value
itself needs is taken at once, with the value. A second update during the
first restarts it. A spark is an svg, which has no pseudo-elements, so its
parent carries the mark and the overlay covers the parent's last part: give
the svg a box of its own (a `div` round it). Call it only on a change, never on
first paint. With reduced motion asked for, the value changes and nothing
plays.

## Back to top [feat-page-1]

Put one on every page that can grow taller than the window; every example
page carries it, so a page copied from one has it already:

```html
<button type="button" class="kp-button kp-to-top" data-kp-to-top></button>
```

`js/auto.js` wires it. It stays out of sight, and out of the tab order,
until the reader is 400 px down (`data-kp-to-top-after` changes that); a
press scrolls to the top and moves the focus there too, so the next Tab
starts where the eye is (`data-kp-to-top-target`, a selector, lands it
elsewhere). An empty button draws the theme's arrow and is named "Back to
top"; give it words of your own and it keeps them. `--kp-to-top-offset`
moves it from the corner, and the `kp-to-top` event (`{ shown }`) says when
it comes and goes.

## The alarm [scope-94]

Bigger than a toast: a full-screen dramatic alert with a code line, one huge
word, the reason under it and one way out, over a plate that takes the whole
window. It opens as a modal `<dialog role="alertdialog">`, so the page behind
it cannot be clicked or tabbed to until it is dealt with, and focus goes back
to the trigger when it closes. Every theme draws it in its own colours and
faces: the plate, the ink, the frame and the bars come from each theme's
tokens, and each register adds its voice (brutalism's slammed stamp, nostromo's amber console).

From a script, `showAlarm()` resolves with why it closed — `'ack'`,
`'timeout'` or `'escape'`:

```js
import { showAlarm } from '@kp-soft/themes/js/alarm';

const reason = await showAlarm({
    title: 'Access denied',
    code: 'Security protocol 7 · lockout',
    detail: 'Three failed attempts on terminal 4. This console is locked for ten minutes.',
    mode: 'ack', // 'ack': only its button closes it · 'auto': closes after `seconds`
    seconds: 8, // auto only
    escape: false, // ack only: may Escape close it too
    action: 'Acknowledge', // the button's label; the dictionary's alarmAction by default
});
```

- **`mode: 'ack'`** — only the button closes it: a click, Enter or Space.
  Escape does nothing unless `escape: true`, and a click on the plate never
  closes it.
- **`mode: 'auto'`** — it closes by itself after `seconds`, with a bar that
  shrinks towards the start. Escape closes it. The alarm focuses itself, so
  an Enter meant for the page presses nothing; the first Tab reaches **Keep
  open**, which stops the clock and turns it into an acknowledged alarm.

From markup, `attachAlarms()` (in `attachAll`, so `js/auto.js` does it)
wires a button whose attributes describe the alarm. The close event,
`kp-alarm-close` with `{ reason }`, is dispatched on the button:

```html
<button
    type="button"
    class="kp-button kp-button--destructive"
    data-kp-alarm="Connection lost"
    data-kp-alarm-code="Telemetry"
    data-kp-alarm-detail="The link to pump house 4 dropped."
    data-kp-alarm-mode="auto"
    data-kp-alarm-seconds="6"
>
    Test the timed alarm
</button>
```

In React, `<Alarm open title=… onClose={(reason) => …} />` when the state
lives in the component, or `useAlarm()` when the alarm is a question with an
answer:

```jsx
import { useAlarm } from '@kp-soft/themes';

function Console() {
    const [showAlarm, alarm] = useAlarm();
    const lock = async () => {
        const reason = await showAlarm({ title: 'Access denied', mode: 'auto', seconds: 6 });
        console.log(reason);
    };
    return (
        <>
            <button type="button" className="kp-button" onClick={lock}>
                Lock
            </button>
            {alarm}
        </>
    );
}
```

The words the alarm adds itself — the button's default label, Keep open,
the key hint, the countdown and the sentence a screen reader hears once —
come from `js/strings.js` (`alarmAction`, `alarmKeepOpen`, `alarmHint`,
`alarmCountdown`, `alarmClosesBy`, `alarmPressTo`, `alarmKeptOpen`), per
alarm through `strings` in both channels.

Motion runs only when the reader has not asked for less: the plate fades in,
the headline flickers in and decodes letter by letter, a split copy slices
through it, the glow breathes and the bars march, all under two flashes a
second, measured from rendered frames in `tests/alarm.spec.mjs`. Under
reduced motion nothing moves, and the bar steps a whole second at a time.
`data-kp-alarm-inline` holds a frame open in the flow of a page for a style
guide; the knobs (`--kp-alarm-ground`, `--kp-alarm-ink` and the rest) are
listed on the alarm's documentation page.

## The date picker's numeric date is dd/mm/yyyy [datetime-M1]

Every date a kp component shows is `dd/mm/yyyy` (Kenny's rule 52), so the
date picker writes, hints and reads its field day first whatever the
reader's language: `04/09/2026` is the fourth of September for an en-US
reader in New York as it is in Brussels. Typing `4-9-2026`, `4.9.26` or an
ISO date works too. `data-kp-date-format="locale"` on a picker, or the
`dateFormat: 'locale'` option of `attachDatePickers` (the `dateFormat="locale"` prop of the React `DatePicker`, whose default is `"rule52"`), brings back the order
and separator the reader's locale writes (`09/04/2026` under en-US,
`04.09.2026` under de-DE); the placeholder and the parsing follow it. The
month and weekday names, and the first day of the week, always follow the
locale (`data-kp-locale`, the nearest `lang`, the browser's). The value in
`data-kp-date-value` is ISO in every case.

## The date picker's month and year grids [scope-89]

The calendar's title is a button in both channels. Pressing it (a click,
Enter or Space) swaps the days for the twelve months of the shown year,
the shown month marked and focused; in that grid the title is the year,
and pressing it shows twelve years, the block that holds the shown year.
Previous and next move by a month over the days, by a year over the
months and by twelve years over the years. Choosing a year returns to its
months, choosing a month returns to its days; neither changes the value
in the field — only a day does.

The keys are the day grid's, one size up: the arrows move by a cell and a
row (three cells a row) and cross into the next year or block at the
edge, Home and End go to the ends of the row, PageUp and PageDown move by
twelve, and one cell is the tab stop. Escape steps back one grid, to where
the calendar was when that grid opened; from the days it still closes the
calendar. A month or year that lies wholly before `min` or after `max`
(`data-kp-min`, `data-kp-max`) is disabled the way a day is: in the grid,
`aria-disabled`, and no way in. The disabled weekdays and
`isDateDisabled` decide days only.

Nothing is needed to style them. A month or year cell carries
`.kp-datepicker__day`, `aria-selected` and `aria-disabled` like a day, so
every register that paints days paints them; the grid says which it is
with `data-kp-view="days" | "months" | "years"`, and a cell with
`data-kp-month="2026-09"` or `data-kp-year="2026"`. While the months or
years show, the panel keeps the size the days had: the module writes the
day view's measured size as inline minimums on the panel and the grid,
and removes them when the days return.

The words come from the dictionary: `chooseMonth` and `chooseYear` name
the title button (the words it shows, then what it opens),
`previousYear`, `nextYear`, `previousYears`, `nextYears` name the arrows,
`monthGrid` and `yearGrid` name the grids and are said through a polite
live region when one opens, `yearRange` is the year grid's title, and
`monthsShort` fills the month cells — a full "September" ran out of a
third of the grid in eleven themes. Under a non-English `lang` the short
names come from `Intl`; a consumer who set `months` but not `monthsShort`
sees their own full names in the cells.

## Showing data [TH33]

Seven patterns that are not components but that every data-heavy page
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

## Dashboard components [scope-143]

Fifteen things the homelab admin dashboard grew and any dashboard on this
package needs: eight approved by Kenny in formal on 2026-10-04 from
`research/dashboard-ports/`, and seven more (the menu button, the meter with
a mark, the strip's column count, the trend tile, the month heatmap, the
network graph, and help with its tour) approved on 2026-10-05 from
`research/dashboard-ports-2/`, all moved in as approved. The registers do not
answer them yet (they are on `gates/register-pending.json`), so every theme
draws them from the tokens alone. `js/auto.js` fetches each module only on a
page that carries its markup; the attach functions are also exported for a
subtree rendered later, and each returns a detach.

### Buttons in shared columns

A list's row buttons share columns: a button of one role starts at one edge
and has one width on every row, whatever its label, and a row without that
role leaves its column empty.

```html
<ul class="kp-action-list">
    <li>
        <div><b>INC-4471</b> Pump house 3: pressure below 2.1 bar</div>
        <div class="kp-row-actions">
            <button type="button" class="kp-button kp-button--sm">Assign…</button>
            <button type="button" class="kp-button kp-button--sm kp-button--primary">Open</button>
        </div>
    </li>
</ul>
```

The list is a grid and every row a subgrid of it, so the browser sizes each
column to its widest button, with nothing to redo when a font arrives or the
theme changes. By position from the end it needs no script, up to four
buttons. Where the rows' buttons differ, name them by role with
`data-kp-action="<role>"`: `attachActionColumns(root)` (`js/actions.js`)
writes each button's column. A table cannot be a subgrid, so in a table the
same function measures each role's widest button and writes the widths on
the table. In a list narrower than 30rem the buttons go under the row's
text, side by side and spread over the full width in equal columns; in a
narrow table they stack in the cell at one width. Knob:
`--kp-action-gap`. Exports: `attachActionColumns`, `fitActionColumns(list)`,
`rowRoles`, `mergeRoles`, `ROW_ACTIONS`, `ACTION_LIST`.

On a narrow list (under 30rem) the buttons stack under the row's text, one
per line on one left edge, each label on a single line; a label is never
wrapped or cut. The table rule holds for any
`<table>` holding `.kp-row-actions`, not only a `.kp-table`: in the table
wrapper (`.kp-table-wrap`) under 30rem, and in a table outside it while the
window is under 48rem. A register's margin on its buttons counts in a
table's measured widths.

### Tiles of one height

`.kp-tiles` lays the package's own `.kp-card` out in a grid: every tile as
tall as the tallest tile of the grid, on every row, and each card's
`.kp-card__footer` kept to its bottom edge, so the footers of a row form one
line.

```html
<ul class="kp-tiles">
    <li class="kp-card">
        <h3 class="kp-card__title">Pump house 1</h3>
        <p class="kp-card__body">Two pumps, both running.</p>
        <div class="kp-card__footer kp-row kp-row--between">
            <span class="kp-timestamp">Read 2 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" href="/ph/1">Open</a>
        </div>
    </li>
</ul>
```

Knobs: `--kp-tile-min` (15rem, the narrowest column), `--kp-tiles-gap`,
`--kp-tile-title-size` (1.125rem, a step under a page card's title). No
script.

A board of several grids (groups of tiles under their own headings, in folds
or columns) shares one tile height when it is marked
`data-kp-tiles-set="<name>"`: every `.kp-tiles` inside it, or carrying it,
belongs to the set, and two branches of the page with the same name are one
set.

```html
<div class="board" data-kp-tiles-set="apps">
    <details open><summary>Media</summary><ul class="kp-tiles">…</ul></details>
    <ul class="kp-tiles">…</ul>
</div>
```

`attachTileSets(root)` (`js/tiles.js`, loaded by `js/auto.js` where the
attribute is) reads the natural height of every visible tile of the set (a
tile in a closed `<details>` or hidden does not count; a skeleton tile does)
and writes the tallest on each grid as `--kp-tile-row-min`, the floor of its
rows. It runs once per frame after a tile's size or content changes, a grid's
width changes or a fold opens or closes, and writes only when the height
changed, so a refresh that redraws the same tiles writes nothing. A tile's
inside stays yours: reserve a row (a "lines" row on every tile) if you want
it on one line across the board. Exports: `attachTileSets`,
`evenTileSet(grids)`, `tileSets(root)`, `TILES_SET`, `TILE_ROW_MIN`.

### Key figures

`.kp-kpis` is a strip of `.kp-kpi` tiles, one height on every row it wraps
to, so labels, numbers and trend lines line up across it:

```html
<div class="kp-kpis" role="group" aria-label="Network at a glance">
    <a class="kp-kpi" href="/flow">
        <span class="kp-kpi__label">Flow now</span>
        <span class="kp-kpi__value">412<small>m³/h</small><span class="kp-kpi__note">avg 15 min</span></span>
        <span class="kp-kpi__trend"><span class="kp-kpi__delta" data-kp-direction="up" data-kp-tone="good">6 %</span> on yesterday</span>
        <svg class="kp-kpi__spark" data-kp-spark="380 371 352 340 335 338 360 395 430 451"></svg>
    </a>
    <button type="button" class="kp-kpi kp-kpi--toggle" aria-pressed="false" data-kp-tone="warning">
        <span class="kp-kpi__label">Open incidents</span>
        <span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Filter</span><span data-kp-when="on">Filtering ×</span></span>
        <span class="kp-kpi__value">3</span>
        <span class="kp-kpi__trend">2 new today</span>
    </button>
</div>
```

A tile is a `div`, an `a` that leads to its detail, or a
`button.kp-kpi--toggle` that turns a filter on this page on and off.
`data-kp-tone="warning"` or `"destructive"` on a tile gives it a coloured
edge and a coloured number. A `.kp-kpi__delta` takes ▲ or ▼ from
`data-kp-direction="up|down"` and its colour from `data-kp-tone="good|bad"`.
At the bottom, a sparkline or a meter:
`<span class="kp-kpi__meter" role="meter" … style="--kp-value: 0.71">`
paints a used-of-total bar (the meter below, with its mark).

`js/kpi.js` brings the two behaviours. `attachSparklines(root)` draws every
`svg[data-kp-spark]` from its numbers as a line over a soft area, and draws
it again when the attribute changes (`drawSparkline(svg, values)` and
`sparkPaths(values)` are there for a page that draws its own).
`attachKpiToggles(root)` makes a click on a toggle flip `aria-pressed` and
fire `kp-kpi-toggle` (bubbling, `detail.pressed`); the page does the
filtering. Pressed, the tile takes a primary border over a faint primary
background, and its `.kp-kpi__hint` shows the `data-kp-when="on"` child in
place of the `off` one; the words are yours. A tile marked
`data-kp-kpi-owned` is left to a framework that keeps the pressed state
itself. Knobs: `--kp-kpi-min` (9rem), `--kp-kpis-gap`,
`--kp-kpi-value-size` (1.75rem), `--kp-kpi-spark-height` (1.75rem),
`--kp-kpi-meter-fill`.

### A meter with a mark

`.kp-meter` is a used-of-total bar that works anywhere: in a table cell, at
the bottom of a key figure (`.kp-kpi__meter`, the same rules), or at the
start of a line of words (`.kp-meter--inline`, three rem wide, its middle on
the line's middle):

```html
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62"
    aria-valuetext="62% full; 80% the target level" style="--kp-value: 0.62; --kp-mark: 0.8"
    ><span class="kp-meter__mark" aria-hidden="true"></span
></span>
```

`--kp-value` is the share, from 0 up; `--kp-mark` puts a tick across the bar
(a target, a limit, what is booked), sticking out a little above and below
without making the meter taller. A share above 1 fills the bar and, with
`data-kp-over` on the meter, puts a small ▸ at its end; a mark above 1 stops
just short of the end with the ▸ after it (`data-kp-over` on the mark).
`data-kp-tone="warning"` or `"destructive"` colours the fill, as a tone on
the key figure around it does; `data-kp-loading` pulses the track at its
height with no fill and no mark.

`setMeter(el, { value, mark, tone, label, markLabel, loading })`
(`js/kpi.js`) writes all of it in one call, the ARIA included: `role="meter"`,
`aria-valuenow` from 0 to 100, and an `aria-valuetext` that names the real
share, past 100 % too:

```js
import { setMeter } from '@kp-soft/themes/js/kpi';

setMeter(capacity, { value: 0.58, mark: 1.3, label: 'running now', markLabel: 'booked for tonight' });
// aria-valuetext: "58% running now; 130% booked for tonight"
```

`meterText(value, mark, { label, markLabel, unit })` is those words alone
(without a `label`, the dictionary's `meterUsed`; no number reads
`meterNotMeasured`, loading `meterMeasuring`), and `meterParts(value, mark)`
the arithmetic. Knobs: `--kp-meter-height` (0.375rem), `--kp-meter-fill`,
`--kp-meter-mark-colour`, `--kp-meter-mark-overhang` (3px),
`--kp-meter-halo` (the card colour around the tick),
`--kp-meter-inline-size` (3rem).

### A heat grid, a matrix and a bar in a table cell

`.kp-heat` is rows by columns of small cells, each toned by a state (`data-kp-tone`
`ok`, `warn`, `bad`, `muted`, `future`, `before`, `none`: the words of the month heatmap) or by a value (`level`, with
`--kp-heat-level` from 0 to 1). `setHeat(el, spec)` (`js/heat.js`) writes the label column, the column axis, an optional
summary row whose cells fill from the bottom (`share`), and the rows; the grid keeps its columns and its heights in every
state, and `state: 'loading'` draws the theme's own skeleton cells in the same places:

```js
import { setHeat } from '@kp-soft/themes/js/heat';

setHeat(grid, {
    columns: [{ key: '2026-10-14', label: '14' }, { key: '2026-10-15', label: '15' }],
    rows: [{ key: 'media', label: 'media', cells: [{ tone: 'ok', label: 'backed up', tip: 'Snapshot at 03:12' }, { tone: 'bad', label: 'missed' }] }],
});
```

The root listens for the page: `kp-heat-pick` (a column was picked or dropped), `kp-heat-row` (a label was pressed, with
`data-kp-heat-toggle`) and `kp-heat-page` (Page Up and Page Down). `data-kp-heat-owned` leaves the state to the page.
`tip` is the hover card's text (`js/hovercard.js`). A legend is a `ul.kp-heat__legend` of `.kp-heat__swatch[data-kp-tone]`.

`.kp-matrix` is source by destination: `setMatrix(el, { rows, columns, cell: (row, column) => ({ tone, text, label }) })`. Each
cell has a plate, a word or a glyph, and a label for the screen reader; the headers are buttons that light their row and
column and stay in place while the grid scrolls (under 36rem the box scrolls). `kp-matrix-pick` and `kp-matrix-light` are its
events; `data-kp-matrix-select="follow"` pins the cell the arrow keys land on.

`.kp-bar-cell` is a value with its bar inside a table cell: `<td><span class="kp-bar-cell" data-kp-bar="0.62"></span></td>`
or `setBarCell(span, { value: 0.62, text: '62%' })`. A data table sorts a cell by `data-kp-sort-value` (on the `td`) when it
has one, else by its text; `setBarCell` writes it for the cell it is in.

#### Driving the states of the heat grid, the matrix and the run timeline [kyu-plates-1019]

`setHeat(el, { state: 'loading' | 'empty' | 'error', message?, text?, art? })` and `setMatrix(el, { state, … })` (`js/heat.js`)
take the grid's whole footprint with the busy card (loading) or the state plate (empty, failed); a failure's Retry fires
`kp-heat-retry` or `kp-matrix-retry` on the host (bubbling). The run timeline (`js/gantt.js`) is `setGanttState(el, 'loading' |
'empty' | 'error', words?, { text?, art? })`, its Retry `kp-gantt-retry`; `setGanttRuns()` and `setGanttPoints()` bring a
loading, empty or failed timeline back to ready.

#### The run timeline: planned bars, a bare look and labels outside narrow bars [gaps-time-1019]

A run's `state` may be `planned`: still to come, from `start` to `end`. It is an outline on the card's own ground with the
theme's own hatching (formal fine diagonal rules, brutalism hard stripes, blueprint cross-hatch, cyberpunk scanlines, forest
dots …), never a filled bar; with a `series` the outline and hatching take that chart colour. The legend names it
("planned") only while a run is planned. A window that follows now (Live) ends just after now, so a plan is read in a fixed or
fitted window (`data-kp-gantt-range="all"`, or `setGanttWindow`).

Three options, read again when the attribute changes:

| Attribute | Default | What it does |
| --- | --- | --- |
| `data-kp-gantt-toolbar="off"` | on | Leaves out the range buttons and Live, and the brush that selects a range (a timeline that is read, not searched); the window is `data-kp-gantt-range`'s or the page's `setGanttWindow`. A selection the page makes (day buttons, `setGanttSelection`) still shows its chip in the toolbar's place. The hint then says only "Click a bar to open it" (`ganttHintOpen`). |
| `data-kp-gantt-legend="off"` | on | Leaves out the legend of the states; the page's own series, kinds and stretches stay, and a legend left with nothing is not drawn. |
| `data-kp-gantt-hint="off"` | on | Leaves out the line under the timeline. |

A label that does not fit its bar stands outside it: after the bar when its row has room before the next bar, else before it,
else cut with an ellipsis on the roomier side, and left to the bar's name and card when even that is under 3 rem
(`data-kp-label` on the bar: `after`, `before` or `none`; the label is a `.kp-gantt__outside` sibling in the lane, so a
theme's clip cannot cut it). The rows are walked in time order, so two labels never meet, and a growing bar takes its label
back in once it is wide enough.

### Key figures on allowed column counts

A strip whose number of tiles changes can leave one tile alone on its last
row. `data-kp-kpis-columns` lists the column counts the strip may take,
largest first, `all` meaning as many as there are tiles:

```html
<div class="kp-kpis" data-kp-kpis-columns="all 3 2 1" role="group" aria-label="The northern network right now">
    <div class="kp-kpi">…</div>
    <!-- … -->
</div>
```

`attachKpiStrips(root)` (`js/kpi.js`, loaded by `js/auto.js` for such a
strip) takes the first count at which every tile is at least
`--kp-kpi-min` wide, by the strip's own width rather than the window's. If
that leaves one tile alone on the last row it steps down to a count that
does not; only when none exists does the last tile span the whole row
(`data-kp-kpis-span-last`). It follows the strip as it resizes and as tiles
come, go or hide. Five tiles at a desk width sit on one row; in 700 px,
3 + 2; at a phone width, 2 + 2 and the fifth across. Before the script runs
the strip keeps the package's auto-fit. `kpiColumns(n, width, { allowed,
minTilePx, gapPx })` is the rule itself and `fitKpiStrip(strip)` applies it
once.

### A key figure with its 24-hour trend

A key figure whose whole tile opens its chart, with its last 24 hours
inside it:

```html
<div class="kp-kpi kp-kpi--trend">
    <span class="kp-kpi__label">Pressure <span class="kp-kpi__label-note">avg 15 min</span></span>
    <a class="kp-kpi__link" href="/charts/pressure" title="Open Pressure on Charts"><span class="kp-kpi__link-word">Charts</span> ↗</a>
    <span class="kp-kpi__value">3.30<small>bar</small></span>
    <span class="kp-kpi__trend">now <b>3.28 bar</b> · peak 3.62 bar · two pumps</span>
    <figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative"
        aria-label="Pressure, last 24 hours" style="--kp-chart-series: var(--chart-1)"></figure>
</div>
```

The `.kp-kpi__link` is stretched over the tile, so a click anywhere opens
it, and the whole tile takes the focus ring while the link has it. In a
tile of 12rem or less the corner shows ↗ alone; the word stays for a screen
reader. A note such as "avg 15 min" goes in the label, in its capitals,
after a dot (`.kp-kpi__label-note`). The label is never cut: it wraps
between words, its first line keeps clear of the corner, and the note moves
to the next line as one unit when it does not fit beside the name. The line
takes the figure's `--kp-chart-series` (`--chart-1` when unset), so a strip
of trends can give each its own `--chart-n`.

A tile is as tall loading, with no trend and with one reading as filled:
the value line keeps its height under a skeleton, the axis row is always
there, and the words under the number keep two lines (three in a tile of
12rem or less; knob `--kp-kpi-trend-lines`).

The trend is the time chart's spark variant (`js/chart.js`, drawn by
`attachCharts()`) with two options. `data-kp-spark-head="none"` leaves out
its name and value line: a pointer, a finger or the arrow keys read one
point in a chip over the line, its moment and value, kept inside the tile;
when the two do not fit on one line the value goes under the moment, and
when even that does not fit the reading takes the axis row. The trend
keeps its own crosshair, not its group's, and a click that was not a drag
follows the tile's link. `data-kp-spark-axis="relative"` puts the axis under
the line: where it starts, as `14:40 yesterday` or `07:00 today` (or its
date when older), and `now` while the last point is at most two steps old,
else that point's clock (`14:00`).

The data is the page's, as for any chart, or the short way:

```js
import { setTrendData } from '@kp-soft/themes/js/chart';

setTrendData(figure, { points: [[ms, 3.31], [ms + 600_000, 3.28] /* … */], step: 600_000, unit: 'bar', digits: 2 });
setTrendData(figure, null); // loading: the theme's busy card over the trend, the tile aria-busy
```

Driving its states [kyu-plates-1019]: `setTrendData(figure, null)` is loading (the busy card over the trend at its height);
`setTrendData(figure, { points: [] })` is empty (the state plate in the trend's place, `art` and `text` optional);
`setTrendData(figure, { error: 'Could not read the trend', text?, art? })` is failed (the failed plate, its Retry fires
`kp-chart-retry` on the figure, bubbling: read again and call `setTrendData(figure, data)`). The plate is at heading size, so
the tile grows by what its words need; loading keeps the tile's height. One reading (not empty) still draws no line.

No points is a tile with no trend; one point keeps the axis row with two
no-break spaces. The trend is a tab stop only with two points or more;
there ←/→ read point by point (Shift: ten), Home and End go to the ends, and
Esc hides the reading; a live region says what a key read. A live update
keeps a reading on screen at its moment. Every moment is `dd/mm/yyyy HH:mm`
on the Brussels clock (rule 52), `attachCharts(root, { timeZone, now })`
counts from another zone or moment, and `trendAxis(points, { now, step })`
gives the axis words alone. `attachTrendCharts(root, options)` draws only
the trends under `root`. The words are the dictionary's `chartNow`,
`chartToday`, `chartYesterday` and `chartTrendKeys`. Knob:
`--kp-kpi-spark-height` (2.75rem in a trend).
### The page header

```html
<header class="kp-page-header">
    <div class="kp-page-header__inner">
        <div>
            <h1 class="kp-page-header__title">Pump houses</h1>
            <p class="kp-page-header__description">Fifteen pump houses on the northern network.</p>
        </div>
        <div class="kp-page-header__actions">
            <button type="button" class="kp-button">Export readings</button>
            <button type="button" class="kp-button kp-button--primary">Add a pump house</button>
            <button type="button" class="kp-button" popovertarget="page-more" aria-haspopup="menu" style="anchor-name: --page-more">More ▾</button>
            <div popover="auto" id="page-more" class="kp-popover" style="position-anchor: --page-more">
                <ul class="kp-menu" role="menu">
                    <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Import from a file…</button></li>
                </ul>
            </div>
        </div>
    </div>
</header>
```

The title and its one-sentence description on the left, the page's actions
against the right edge, level with the title: secondary buttons, one
primary, and an overflow button that says "More ▾" for the rare things; its
popover hangs under it towards the start, so it stays on the page. Under
40rem of its own width the title takes the line and the buttons fold under
the description: the primary first, on a line of its own at the full width,
the others beside each other under it. That order is visual only; the tab
order stays yours. No script.

### The attention band

One alert per problem, worst first, each with the action that fixes it, as a
soft tint of its severity with a coloured edge in the page's own text
colour. With nothing wrong the band takes no room at all.

```html
<div class="kp-attention" role="region" aria-label="Needs attention">
    <div class="kp-alert kp-alert--destructive kp-attention__item" role="alert" data-kp-severity="critical">
        <span class="kp-attention__icon" aria-hidden="true">!</span>
        <div class="kp-attention__text">
            <strong><span class="kp-sr-only">Critical: </span>Pump house 3 is below 2.1 bar</strong>
            <span>For forty minutes.</span>
        </div>
        <div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Open the incident</button></div>
    </div>
</div>
```

`data-kp-severity` is `critical`, `warning` or `info`. `attachAttention(root)`
(`js/attention.js`) keeps the items in that order in the DOM, now and when
one arrives or changes severity, so a screen reader meets them in the order
the eye does; `sortAttention(band)` does it once. In a band under 34rem the
actions go under the words.

**`data-kp-subgrid`: the band on shared tracks** [gapform-1019]. With the
attribute the band is three named tracks, `icon | words | actions`, and every
item is a subgrid of them: the icons, the words and the fixes of all items
stand in three columns down the band, and a single fix fills the actions
track, so every fix has one width. The band is no size container then (a
container cannot be a subgrid), so a page may also let it share rows with a
neighbour: `grid-row: span 2; grid-template-rows: subgrid` on the band puts
item N beside the neighbour's item N. Placed straight in a `.kp-formgrid` the
band takes the form grid's tracks: the icon in the label track, the words
from the control edge where every field starts, the fix in the actions
column. Under 36rem of the nearest size container (the form grid, a card,
the page), or of the screen where there is none, each item folds to icon |
words with the fix under them. `.kp-problems[data-kp-subgrid]` does the same
for problem alerts, with a fourth track for the dismiss cross when one may be
closed; folded, the cross keeps its own track on the words' line, so every
alert's words end on one edge.

The item's plate is `--kp-attention-tint` of its severity's colour mixed
into `--card`, 8 % by default. Lower it on an item when the page's text
reads too faint on the tint, for example
`.kp-attention__item[data-kp-severity='info'] { --kp-attention-tint: 6%; }`,
which took one theme's info item from 4.49:1 to 4.71:1.

A live page builds its band later and refreshes it on every poll.
`attachAttention(root)` also orders a band added under `root` after it ran,
and lets go of one that leaves the page. `setAttention(band, items)` sets the
band's problems by key:

```js
import { setAttention } from '@kp-soft/themes/js/attention';

setAttention(band, [
    { key: 'inc-4471', severity: 'critical', title: 'Pump house 3 is below 2.1 bar', text: 'For forty minutes.', action: openButton },
    { key: 'fw-4.2', severity: 'info', title: 'Firmware 4.2 is out for six field units', action: planButton },
]);
```

An item whose key is already on the band stays the same element, and only
what changed in it is rewritten, so a critical problem is put into the page
(and announced, `role="alert"`) once rather than on every poll, and a focused
fix button keeps its focus. A new key makes the markup above (`role="alert"`
for critical, `role="status"` otherwise, the screen reader's severity word
from the dictionary's `attentionCritical`, `attentionWarning` and
`attentionInfo`, or the item's own `srSeverity`); a key no longer given
leaves the theme's way (`leave()` from `js/motion.js`). The band ends worst
first, in your order within a severity. `action` left out keeps the action
an item has, `null` removes it, and a new node equal in markup to the one
shown keeps the one shown (and its listeners).

### A state word that keeps its width

```html
<span class="kp-state-word" data-kp-words="Running&#10;Stopped&#10;Starting in 3 min">Stopped</span>
<button type="button" class="kp-button kp-button--sm">Start</button>
```

`.kp-state-word` is as wide as the widest word in `data-kp-words` (one per
line), so the button beside it never moves when the state changes.
`setStateWord(el, word)` (`js/components.js`) changes the word and adds a
new one to the list, so the width never shrinks back.
`.kp-state-word--center` keeps the word in the middle of that width.

### How old the data is

A freshness line that ticks by itself, `updated 12 s ago`:

```html
<time class="kp-ago" data-kp-ago data-kp-ago-verb="updated" data-kp-stale-after="180" datetime="2026-10-04T12:00:05Z">updated 12 s ago</time>
```

`js/freshness.js` (loaded by `js/auto.js` where `data-kp-ago` is) rewrites
every line once a second, with one timer for the whole page however many
lines it carries, and finds lines added later itself. The moment is the
element's `datetime` (ISO, for machines), or the value of `data-kp-ago`
(ISO or milliseconds). The words are exact, with the two largest units and a
zero part left out (`12 s`, `2 min`, `2 min 5 s`, `3 h 12 min`, `1 day 1 h`);
a moment in the future reads `0 s`, and no moment reads `not updated yet`.
They come from the dictionary (`agoText`, `agoNever`, `agoSeconds`,
`agoMinutes`, `agoHours`, `agoDays`, `agoVerb`), so a Dutch page writes its
own. The title (and `aria-description`) is the moment itself as rule 52
writes one, `dd/mm/yyyy HH:mm` on a 24-hour clock in Europe/Brussels,
whatever the reader's zone.

- `data-kp-stale-after="<seconds>"`: older than that, the line gets
  `data-kp-stale`, drawn as a warning plate whose edge is a shadow, so
  nothing moves. Knobs: `--kp-ago-stale-bg`, `--kp-ago-stale-fg` (the warning
  pair), `--kp-ago-stale-edge` (0.25em).
- The line keeps the width of the widest text its unit can reach ("updated
  59 min 59 s ago" under an hour), so the words after it never move when
  `59 s` becomes `1 min`; `data-kp-ago-width="14ch"` sets the width itself.
- It is `aria-live="off"`: a screen reader is not told the time every second.
  Keep it out of a live region (a line found inside one warns once in the
  console). `data-kp-ago-announce="state"` adds a hidden status beside it
  that speaks only when the line turns stale or fresh again (`agoStale`,
  `agoFresh`).
- The timer stops while the tab is hidden and every line is repainted the
  moment it is shown again.

```js
import { attachAgo, setAgo } from '@kp-soft/themes/js/freshness';

const stop = attachAgo(document, { timeZone: 'Europe/Brussels' }); // `now` can be given, for a test
setAgo(line, Date.now()); // a new moment, in ms; null for none
```

Also exported: `agoText(verb, atMs, nowMs)`, `humanDuration(seconds)`,
`agoMoment(ms, timeZone)`, `momentOf(el)`, `AGO`, `FRESHNESS_TIME_ZONE`.

### A data table loading on a phone

Nothing to write: a data table with the busy overlay (`data-kp-busy-overlay`
or `busy({ overlay: true })`) that is narrower than 30rem lays its panel flat
over the skeleton rows, the spinner beside the words and the words kept to
three lines, and clips the layer to the table so the status line under it
stays free. Knob: `--kp-busy-overlay-spinner-narrow` (1.75rem).

### A month heatmap

A month as a grid of days, each a plate in the colour of its state, with a
short count under the number: a month of nightly backups, of shifts
covered, of readings received.

```html
<div class="kp-calendar-layout">
    <section class="kp-calendar" data-kp-calendar data-kp-calendar-month="2026-10" aria-label="Nightly backups"></section>
    <aside aria-live="polite"><p>Pick a day to see every service's own state that night.</p></aside>
</div>
```

`js/calendar.js` (loaded by `js/auto.js` where `data-kp-calendar` is) builds
the calendar into the section: the month's title between ‹ Prev and Next ›,
Today, a line for the state, a six-week grid and a legend. The grid is always
six week rows, so the page does not jump from month to month; the
neighbouring months' days fill the first and last weeks as quiet numbers you
cannot pick. `.kp-calendar-layout` puts the page's own detail of the picked
day beside the calendar, and under it once the layout is narrower than 45rem.

The page gives every day's state by date, the whole history at once (a month
change needs no new call):

```js
import { attachCalendars, setCalendarDays, setCalendarLegend, setCalendarState, CALENDAR_PICK_EVENT } from '@kp-soft/themes/js/calendar';

attachCalendars(document); // { timeZone, locale, weekStartsOn, now, strings, decorate }
const calendar = document.querySelector('[data-kp-calendar]');
setCalendarState(calendar, 'loading', 'Reading the backups of 9 services: 4 of 9 read.');
setCalendarDays(calendar, {
    '2026-10-03': { tone: 'ok', count: '9/9', label: '9 of 9 services backed up' },
    '2026-10-04': { tone: 'warn', count: '7/9', label: '7 of 9 services backed up; missing: Telemetry archive, Mail relay' },
});
setCalendarLegend(calendar, [
    { tone: 'ok', label: 'Every service backed up' },
    { tone: 'warn', label: 'Some missing' },
    { tone: 'bad', label: 'None backed up' },
]);
calendar.addEventListener(CALENDAR_PICK_EVENT, (event) => showNight(event.detail.date)); // 'YYYY-MM-DD'
```

- **Tones**, per day: `ok`, `warn` and `bad` are the status plates with their
  own ink (all done, partly done, nothing done); `muted` is nothing to do;
  `future` and `before` are a dashed outline without a count (still to come,
  before anything was kept); `none` is an outline (nothing known). A past day
  the page says nothing about is `none`, a later one `future`. A day's name,
  for a screen reader and as its title, is its date and your `label`:
  `04/10/2026: 7 of 9 services backed up; …`, so the colour is never the only
  carrier. A night with nothing done is its red plate and its words; its count
  reads like any other.
- **States**, for the whole: `setCalendarState(el, 'loading' | 'ready' |
  'empty' | 'error', words)`. While loading every day pulses at its final size
  (at rest under reduced motion); `empty` and `error` stop the pulse and put
  the words under the month, an error's after a red dot. `setCalendarDays()`
  makes a loading calendar ready.
- **Today** is the day it is in `timeZone`, Europe/Brussels unless
  `data-kp-time-zone` or the option says otherwise, whatever zone the reader's
  computer is in: 22:30 UTC on 4 October is already the 5th. It has an inner
  ring; the picked day (`td[aria-selected="true"]`) an outer one.
- **Keys**: one tab stop. The arrows move a day or a week, Home and End go to
  the week's ends, Page Up and Page Down change the month (with Shift, the
  year), Enter or Space picks and fires `kp-calendar-pick` with
  `{ date, source }`. A move to another month fires `kp-calendar-month` with
  `{ year, month }`.
- **From the page**: `calendarSelect(el, '2026-10-07')` picks a day and shows
  its month, `calendarMonth(el, { year: 2026, month: 9 })` shows a month;
  neither fires an event. A live `setCalendarDays()` repaints in place: the
  focus and the pick stay where they were.
- **Per calendar**: `data-kp-calendar-month="YYYY-MM"` (the month shown first,
  today's by default), `data-kp-calendar-selected`, `data-kp-locale` (the
  month and weekday names; else the nearest `lang`), `data-kp-week-starts-on`
  (0 = Sunday; else the locale's), `data-kp-heading-level` (the title's, 2),
  `data-kp-key` (handed to `decorate`), `data-kp-calendar-nav` (`start`, the
  default: Prev, the title, Next and Today in a run from the start edge;
  `spread`: the nav stands on the days' own seven tracks, so every button
  edge is a day's edge: Prev over the first day, the title centred over the
  middle three, Next and Today over the last two; on a nav narrower than
  `--kp-calendar-nav-spread-fit` (40rem) the title takes a row of its own
  and Prev, Next and Today stand over two, three and two days. CSS alone, so
  a change at run time re-lays the nav) [gapform-1019].
- **Words**: the dictionary's `calendarNav`, `calendarPrev`, `calendarNext`,
  `calendarToday`, `calendarTodayTitle`, `calendarDay`, `calendarFuture`,
  `calendarLoading`, `calendarUnknown`, with `previousMonth`, `nextMonth`,
  `months` and `monthTitle` shared with the date picker; `strings` overrides
  them per call.
- **Knobs**: `--kp-calendar-aside` (16rem, the detail's width),
  `--kp-calendar-gap` (6px), `--kp-calendar-cell-height` (3.25rem),
  `--kp-calendar-cell-font` (`clamp(0.85rem, 1.4vw, 1.15rem)`),
  `--kp-calendar-title-size` (1.125rem), `--kp-calendar-nav-spread-fit`
  (40rem, where `spread` puts the four on one line).

`decorate(part, info)` is called with the three buttons (`month-prev`,
`month-next`, `today`) and every day (`day`, with `index` and `value`, again
each time the month changes). Also exported:
`monthCells(year, month, firstDay)` (the 42 dates of a month's grid),
`shiftDay`, `shiftMonth`, `dayKey(ms, timeZone)`, `formatDayKey(iso)`,
`calendarSelect`, `calendarMonth`, `CALENDAR`.
### The time chart

One time chart for every page, so its controls mean the same everywhere:

```html
<div class="kp-chart-group" data-kp-chart-group data-kp-chart-span="24h">
    <div class="kp-chart-group__bar">
        <div class="kp-chart-ranges" role="group" aria-label="Time range">
            <button type="button" class="kp-button kp-button--sm" data-kp-chart-range="1h">1 h</button>
            <button type="button" class="kp-button kp-button--sm" data-kp-chart-range="24h">24 h</button>
            <button type="button" class="kp-button kp-button--sm" data-kp-chart-range="7d">7 d</button>
        </div>
        <span class="kp-chart-zoom" data-kp-chart-zoom hidden></span>
    </div>
    <figure class="kp-chart" data-kp-chart aria-label="Pressure">
        <figcaption class="kp-chart__title">Pressure, bar</figcaption>
        <script type="application/json" data-kp-chart-data>
            { "unit": "bar", "digits": 2, "threshold": 2.1, "series": [{ "label": "Pump house 1", "start": 1791010800000, "step": 3600000, "values": [3.36, 3.45, 3.44] }] }
        </script>
    </figure>
    <div class="kp-chart" data-kp-chart="spark" aria-label="Pump house 3"></div>
</div>
```

`attachCharts(root, { strings?, locale?, timeZone?, time?, format?, decorate? })` (`js/chart.js`) draws every
`[data-kp-chart]` under `root`. A chart's data is the page's: a
`script[type="application/json"][data-kp-chart-data]` child, or
`setChartData(el, data)` before or after the attach. The data is
`{ label?, key?, unit?, unitKind?, digits?, series, events?, from?, to?, yMax?, threshold?, stacked?, height?, error?, onePointNote? }`;
a series is `{ label, points: [[ms, value], …] }` or, compact,
`{ label, start, step, values }`, with an optional `colour` (`var(--…)`) and
`total`; an event is `{ at, label, tone?, href? }` with `tone` `critical`,
`warning` or `info`.

The charts of one `[data-kp-chart-group]` share a crosshair, a zoom and a
range, whichever `attachCharts()` call attached them: a chart added later
joins the group as it is (zoomed, if it is). Charts outside any group
element share the page's one group. Hover or focus a source in the legend to single it out; a click keeps
one or several on (`kp-chart-select`, `detail.on`), Show all and Esc reset.
Only the chart under the pointer, or a pinned one, shows its tooltip,
also after a zoom or a live update. The tooltip sits beside the crosshair,
on the side with room and never past the chart's edge, with every
visible source's value, ▲/▼ over the hour before and the events within
reach; a click pins it, ✕ or Esc releases it. A drag zooms the whole group
(`kp-chart-zoom` on the group, `detail` `{ from, to }` or null), a
double-click or Esc resets. On a focused plot ←/→ (Shift: ten points),
Home/End, Enter and Esc move, pin and step back, and a live region says what
is under the crosshair. Under the lines lies a soft area while one or two
sources are on, the lines alone with three or more. The colours are the
theme's `--chart-1` to `--chart-5`; from the sixth source on they come round
again with a dashed line.

A range button (`data-kp-chart-range="1h|24h|7d"`, any `15m`, `6h`, `2d`)
sets the group's window and fires `kp-chart-range` (`detail` `{ range, span }`)
before the charts redraw, so a page can hand them that range's data first:

```js
import { CHART_RANGE_EVENT, setChartData } from '@kp-soft/themes/js/chart';

group.addEventListener(CHART_RANGE_EVENT, (event) => {
    setChartData(pressure, readingsFor(event.detail.range));
});
```

`data-kp-chart="spark"` is the spark variant: one source's line over a soft
area (drawn by the KPI tile's own `drawSparkline()`), its value at the
crosshair or now beside its name, on the group's crosshair. The numbers
follow `locale`, else the nearest `lang` above the group, and are printed
whole: a legend total of 12345 reads `12,345`, never `12.3k`. Every word the
chart says is in the dictionary (`chartPlot`, `chartShowAll`,
`chartZoomedSpan`, … in `js/strings.js`); `setStrings()` changes them for
every chart and `attachCharts(root, { strings })` for those under `root`.

Every date and time a chart prints is `dd/mm/yyyy HH:mm` (or a part of it)
on a 24-hour clock in Europe/Brussels, whatever the reader's zone and the
page's language (rule 52):

| Option     | Default                 | What it does                                                                                                                                                                                                                                                 |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `strings`  | the dictionary          | any of the dictionary's `chart…` words, for these charts only                                                                                                                                                                                                |
| `locale`   | the nearest `lang`      | how numbers are grouped and pointed (`1,534.5` or `1.534,5`); times do not follow it                                                                                                                                                                         |
| `timeZone` | `'Europe/Brussels'`     | the IANA zone every printed time is in, and the zone the time axis is aligned to: six-hour ticks on 00:00, 06:00, 12:00 and 18:00, day ticks at midnight, worked out tick by tick so a change of the clock inside the window moves none of them off the hour |
| `time`     | `numericTime(timeZone)` | `(ms, style, ctx) => string`, prints every time itself; `style` is where the time goes (below)                                                                                                                                                               |

| `style` | Where                                                    | Built in                                                                                      |
| ------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `clock` | the spark's value, an event line in the tooltip          | `14:05`                                                                                       |
| `tick`  | a time-axis label; `ctx.stride` is the tick distance, ms | `14:00` while the ticks are less than a day apart, `04/10/2026` from a day on (the 7 d range) |
| `full`  | the tooltip's head, an event marker's title, the readout | `04/10/2026 14:05`                                                                            |
| `range` | the zoom chip; `ctx.from` and `ctx.to` are the zoom      | `14:00–16:30` within one Brussels day, `03/10/2026 22:00 – 04/10/2026 02:00` across days      |

`numericTime(timeZone)` is the built-in formatter, exported so a page's own
times and the chart's agree; `timeTicks(from, to, most, timeZone)` is the
time axis (`{ stride, ticks }`), exported for the same reason. A consumer
who reworded the chip through `chartZoomed(from, to)` keeps those words: the
two ends are clock times within one day and full dates across days.

A value's kind, `unitKind` in the data, prints and scales it the dashboard's
way, and puts the unit on the axis too (a plain `unit` stays off the axis):

| `unitKind`                  | Tooltip, legend, readout                              | Axis                                                       |
| --------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| `bytes`                     | binary steps, `512 B`, `1.5 GiB`, `120 MiB`           | `0 B`, `1.0 GiB`, `2.0 GiB`: round in the unit it prints   |
| `bytes/s` (or `rate`)       | the same per second, `3.2 MiB/s`                      | the same, `/s`                                             |
| `percent`                   | a decimal under 10, `7.5%`, `42%`, `0%`               | a top of 10, 25, 50 or 100; above 100 when a value is      |
| `celsius`                   | whole degrees, `54 °C`                                | the same                                                   |
| `count`, `flag`             | exact and grouped, `12,345` (R-COUNT)                 | shortened from 10,000 on, `12.3k`                          |

`format: (v, where, chart) => string` prints values itself (`where` is
`axis`, `tip`, `delta`, `legend`, `readout` or `spark`; anything but a
string falls back to the built-in), and `formatChartValue(v, where, data,
locale)` is that built-in, exported so a page's own numbers match.

The page can drive a chart, and mark what the chart builds:

| Call or markup                                  | What it does                                                                                                                                                                                       |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chartSelect(el, index, on?)`                   | presses legend source `index` as a click does (a toggle without `on`), or with `null` shows every source; fires `kp-chart-select` when the selection changes                                       |
| `chartZoom(el, { from, to } \| null)`           | zooms the group of `el` (a chart, a group element, or the document for the charts outside any group), or resets it; fires `kp-chart-zoom`                                                         |
| `detachChart(el)`                               | takes one chart away; its group draws on, and a group left empty lets go of its range buttons and chips                                                                                            |
| `data-kp-chart-zoom` anywhere                   | a zoom chip outside its group: `data-kp-chart-zoom-for="<group id>"`, else the group around it, else the page's charts outside any group; `kp-chart-zoom` fires on the group element, else on the document |
| `decorate: (part, info) => void`                | called with every control a chart builds, each time it builds it (a rebuilt legend included): `info.kind` is `source`, `show-all`, `release`, `plot`, `range` or `zoom-reset`, with `host`, `key`, `index`, `label` or `value` |
| `key` in the data, or `data-kp-key`             | the chart's stable name, passed to `decorate`                                                                                                                                                      |

Every state keeps the plot at its height (`data.height`, else
`--kp-chart-height` on the chart, else 168 px), so a card does not move when
its readings arrive. `data-kp-chart-loading` makes the plot pulse (it stands still
under reduced motion) and keeps the legend row for
`data-kp-chart-sources="N"` sources; `setChartData()` ends it. No readings
show the `chartEmpty` words in the middle; `{ error: '…' }` shows the
page's sentence with a red dot on a tinted, bordered plate at heading size
(`--kp-stateplate-text`) with a Retry under it that fires `kp-chart-retry` on
the chart (`CHART_RETRY_EVENT`; the page reads again and calls `setChartData()`;
the words are `chartRetry`); a single reading is a dot, with
`onePointNote` the `chartOnePoint` words under it.

`setChartData()` on an attached chart is a live update: the crosshair stays
at its moment, a pin at its own (when the window moves past it, the tooltip
stays docked at the edge with `(pinned, outside the window)` until ✕), a
zoom, the selection, the singled-out source and the focus stay. New
sources reset the selection and fire `kp-chart-select` with `[]`.
Knobs: `--kp-chart-height` (168px), `--kp-chart-tip-min` (14rem),
`--kp-chart-tip-max` (17.5rem), `--kp-chart-tick-size` (11px).

### The network graph

A picture of a network with one centre: the hub in the middle, the other
nodes on a ring around it, the links drawn by kind.

```html
<figure class="kp-graph" data-kp-graph aria-label="The northern network">
    <script type="application/json" data-kp-graph-data>
        {
            "hub": "centre",
            "nodes": [
                { "id": "centre", "label": "Control centre", "description": "where every reading arrives" },
                { "id": "ph1", "label": "Pump house 1", "description": "two pumps, ring main west" },
                { "id": "ph3", "label": "Pump house 3", "description": "two pumps, ring main north", "flag": "mismatch" },
                { "id": "weather", "label": "Weather service", "description": "an address outside the network", "external": true }
            ],
            "edges": [
                { "from": "ph1", "to": "centre", "kind": "telemetry" },
                { "from": "centre", "to": "ph1", "kind": "control", "detail": "pump start and stop" },
                { "from": "ph3", "to": "centre", "kind": "telemetry" },
                { "from": "weather", "to": "centre", "kind": "telemetry" }
            ],
            "kinds": [
                { "kind": "telemetry", "label": "Telemetry", "hint": "Readings sent every minute", "style": "solid", "colour": "var(--chart-1)" },
                { "kind": "control", "label": "Remote control", "hint": "Commands to the site", "style": "dash", "colour": "var(--chart-2)" }
            ]
        }
    </script>
</figure>
```

`attachGraphs(root, { decorate?, strings? })` (`js/graph.js`) builds every
`[data-kp-graph]` under `root`: a bar over the picture with the kinds of
link and Show all, the picture, and a hint under it in the page's flow. The
data is the page's: a `script[type="application/json"][data-kp-graph-data]`
child, or `setGraphData(el, data)` after the attach; until then the graph
shows loading. The data is `{ nodes, edges, kinds, hub? }`:

| Field   | What it is                                                                                                                                                                                                             |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a node  | `{ id, label, description, hue?, weight?, flag?, external? }`: `description` follows the label in its accessible name and title; `weight` 0 to 1 sizes it; `flag: 'mismatch'` puts a dotted ring round it; `external` makes it an address outside the network (a dashed grey ring at the end of the ring) |
| an edge | `{ from, to, kind, detail? }`: `detail` is the link's title, after its two ends                                                                                                                                        |
| a kind  | `{ kind, label, hint, style, colour }`: `style` is `solid`, `dash`, `dot` or `long-dash`; `colour` a token such as `var(--chart-2)`; `hint` the toggle's title. A kind no edge uses is left out of the list              |
| `hub`   | the id in the middle; without it, the node with the most links                                                                                                                                                         |

The ring starts at the top and runs clockwise, A to Z by label and then the
nodes outside the network. Each node takes its own hue, spread evenly over
the nodes A to Z (or the node's own `hue`), at the lightness and strength of
the theme's `--chart-1`, so it reads on every theme's ground. Two links
between one pair bend apart, 26 px a step, so two kinds never draw on top
of each other. Under 600 px the ring trades width for height to keep room
for the labels at its sides. A label points away from the hub; where it
would touch another label or leave the picture, the longer of the two loses
a letter at a time and ends in `…`, and the full name stays in the node's
title and accessible name. The labels are fitted again when a web font
arrives.

Hover or focus a node to see only its links (the rest dim); click it, or
press Enter or Space, to keep it picked, several at once; Esc or Show all
clears the picks and the kinds turned off. A toggle in the list turns a kind
off and on. The picture is one tab stop: Tab lands on the hub (or the node
last focused), the arrow keys walk the ring, Home and End jump to the hub
and the last node. Every change fires `kp-graph-change` on the graph,
`detail` `{ selected, hover, hiddenKinds }`. A hover or a pick changes
classes only, so the node under the pointer is never rebuilt, and only a new
width redraws the picture.

| Call                                    | What it does                                                                                                                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setGraphData(el, data)`                | a live update: ids that stay keep their pick and the focus; picks whose node went are dropped (and `kp-graph-change` says so)                                                                |
| `setGraphState(el, state, words?, { text?, art? })` | `loading` (the chart's own loading picture over the whole picture: every theme's decided look for a data plot, the sentence read out) [graph-loading-1019], `empty` or `error` (the state plate over the picture at its full height, `words` its heading; an error has a Retry that fires `kp-graph-retry` on the graph, bubbling) [kyu-plates-1019] |
| `graphSelect(el, ids)`                  | picks these nodes and only these                                                                                                                                                             |
| `graphHideKind(el, kind, hide)`         | turns one kind of link off or on                                                                                                                                                             |
| `decorate: (part, info) => void`        | called with every control the graph builds, each time it builds it: `info.kind` is `node` (`value` the id), `kind` (`value` the kind) or `show-all`, with `host`, `key` (`data-kp-key`), `index` and `label` |

The pure halves are exported for a page that draws its own picture or wants
to know where a node will be: `hubOf(data)`, `ringOf(data, hub)` (the ring's
order), `graphLayout(data, W, H)` (every node's `{ x, y, angle }` in a W×H
box), `graphBends(edges)`, `graphLabelText(full, length)` and
`fitGraphLabels(labels, W, H, measure)`. Every word the graph says is in the
dictionary (`graphShowAll`, `graphHint`, `graphKinds`, `graphLoading`, … in
`js/strings.js`); `attachGraphs(root, { strings })` changes them for the
graphs under `root`. Knobs: `--kp-graph-h` (480px; the script sets the
height it draws at), `--kp-graph-label-size` (12px), `--kp-graph-dim`
(0.08, a link that is not lit while a node is).
### Every other action: the menu button

The rare actions of a page or a record go behind one "More ▾" at the end of
its header, grouped under small muted capitals, each with a one-line hint
under its label:

```html
<div class="kp-menu-button" data-kp-menu-button data-kp-key="pump-more">
    <button type="button" class="kp-button">More ▾</button>
    <div class="kp-menu kp-menu--rich" role="menu" aria-label="Every other action on this pump house" hidden></div>
</div>
```

The menu is the package's own `.kp-menu` of `.kp-menu__item`s, so every
register paints it as it paints any menu; `.kp-menu--rich` gives it the
groups, the hints and its width. `js/menu-button.js` (loaded by `js/auto.js`
where `data-kp-menu-button` is) wires it, and `setMenu(wrapper, groups)` fills
it:

```js
import { setMenu } from '@kp-soft/themes/js/menu-button';

setMenu(wrapper, [
    {
        group: 'Run',
        items: [
            { label: 'Restart the pumps', hint: 'Stop and start both pumps, one after the other', value: 'restart' },
            { label: 'Run a pressure test', hint: 'Close the ring main valve', disabled: 'Not while a field engineer is on site', value: 'test' },
        ],
    },
    { group: 'Records', items: [{ label: 'Archive this pump house…', hint: 'Its readings are kept', danger: true, value: 'archive' }] },
]);
wrapper.addEventListener('kp-menu-select', (event) => run(event.detail.value));
```

An entry is a `button`, or an `a` with `href` (and `download`); `danger`
paints its label in the destructive colour, `attrs` adds attributes, and
`value` is what `kp-menu-select` reports (`{ item, value }`; the label when
absent). An entry with `disabled` stays in the list and in the keyboard's
reach: it keeps its hint, says why under it in italics
(`.kp-menu__reason`), takes the focus (`aria-disabled`, its hint and reason
its description), and does nothing. The entries can also be written as
markup, in the shape `setMenu` writes (the block `menu-button` in
`catalogue/overlays.html` shows it whole).

- `setMenu(wrapper, 'loading')` shows one grey entry at the height of a real
  one. No entries grey the button and its title says why (`menuEmpty`);
  `data-kp-menu-empty="hide"` takes the button away instead.
- A fill that shows the same as now is skipped (`menuSignature`), and while
  the menu is open a new fill waits until it closes, so a live refill never
  moves an entry under the pointer or the focus.
- One group of one entry, or a group without a name, has no heading.
- The menu carries `--kp-menu-count`, how many lines it has (its children:
  the groups `setMenu` drew, the entries of one written by hand), so a
  register that rules a menu line by line can count them in CSS; a popover
  holding a `.kp-menu` carries it too. It is written when the menu is wired,
  filled and opened.
- The keys are a menu's: ↓ or ↑ on the button opens it on the first or last
  entry, ↓ ↑ (wrapping), Home and End move, a letter jumps to the next entry
  that starts with it, Esc closes it and puts the focus back on the button
  (the page's own Escape listeners hear nothing), Tab closes it and moves
  on, and a click outside closes it. `openMenu(wrapper, { focus })` and
  `closeMenu(wrapper, { focus })` do it from a script; `kp-menu-open` and
  `kp-menu-close` say it happened, and a page that cancels `kp-menu-select`
  keeps the menu open.
- In a `.kp-page-header` of 40rem or less the open menu spans the header's
  buttons, inside the screen.
- `attachMenuButtons(root, { decorate, strings })`: `decorate(part, info)` is
  handed the button (`kind: 'menu-button'`) and every entry
  (`kind: 'menu-item'`, with its `index`, `label` and `value`), each time one
  is built, with `key` from the wrapper's `data-kp-key`; `strings` overrides
  `menuLoading` and `menuEmpty` for these menus.

Knobs: `--kp-menu-rich-min` (19rem) and `--kp-menu-rich-max`
(`min(26rem, 100vw - 2rem)`), the menu's width; `--kp-menu-max-height`
(`calc(100dvh - 12rem)`), past which it scrolls inside itself.

The script writes one property on the open menu, `--kp-menu-anchor-x`: where
the button's centre falls across the menu, in px from its left edge (kept 14 px
inside it; not written when the menu hangs above its button). A theme may read
it to start something under the button; deco's gold inlay does, and every other
register ignores it.

### Help, a drawer and a short tour

Help is a drawer at the end edge of the window, full height: a head, a body
that scrolls, and a foot that stays.

```html
<button type="button" class="kp-button" data-kp-dialog="help">Help ?</button>
<dialog class="kp-drawer kp-dialog" id="help" aria-labelledby="help-title">
    <header class="kp-drawer__head">
        <h2 class="kp-dialog__title" id="help-title">Help</h2>
        <button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close Help" data-kp-dialog-close>✕</button>
        <p class="kp-drawer__desc">Where things live on this site, the words it uses, and its keys.</p>
    </header>
    <div class="kp-drawer__body">
        <section class="kp-help kp-card">
            <h3>Keys</h3>
            <p>Pressed anywhere outside a field.</p>
            <dl class="kp-help__list">
                <dt><kbd>?</kbd></dt>
                <dd>Open this Help.</dd>
                <dt><kbd>Esc</kbd></dt>
                <dd>Close what is open, or show all again.</dd>
            </dl>
        </section>
    </div>
    <footer class="kp-drawer__foot">
        <button type="button" class="kp-button kp-button--primary" data-help-tour>Take the 1-minute tour</button>
    </footer>
</dialog>
```

`.kp-drawer` lays out any element; a `dialog.kp-drawer` is placed at the
edge and slides in (not under reduced motion), and opens and closes as any
`.kp-dialog` does. A `.kp-help` card's `.kp-help__list` puts the words beside
their meanings, the meanings starting at one edge across every card; in a
card of 22rem or less each word goes over its meaning. Knobs:
`--kp-drawer-width` (`min(28rem, 100vw)`), `--kp-help-term` (8rem, the
words' column).

The tour walks a first-time reader over the page, one card per part:

```js
import { shouldStartTour, startTour, tourRemembered } from '@kp-soft/themes/js/tour';

const steps = [
    { target: '[data-area="nav"]', title: 'The areas', text: 'Five areas, always in the same place.' },
    { target: '#search', title: 'Search', text: 'Find a pump house by its name or its number.' },
    { target: () => document.querySelector('.map'), title: 'The map', text: 'Which site talks to which.' },
];
const start = shouldStartTour({ search: location.search, remembered: tourRemembered('network'), automated: navigator.webdriver });
if (start != null) startTour(steps, { start, remember: 'network' });
helpTourButton.addEventListener('click', () => {
    helpDialog.close();
    startTour(steps, { remember: 'network', returnFocus: helpButton });
});
```

- A step whose `target` (a selector, whose first shown match is taken, or a
  function) is not on the page is left out before counting, so the count is
  exact: six steps with one missing read `1 of 5` … `5 of 5`. With none on
  the page, `startTour` returns null and nothing starts; otherwise it
  returns `{ end, goto }`.
- The card (`.kp-tour`) is a non-modal dialog, so the page stays usable. It
  sits 12 px under its part, or over it when the part is in the lower half
  of the window, never on it; 16 px inside the window's edges (on a phone
  the window's width less those two gutters, `--kp-tour-width`); and it
  follows its part when the page scrolls. When the part is inside an open
  modal dialog, the card goes into that dialog.
- The part gets `data-kp-tour-target`: a ring in the focus colour, and the
  rest of the page dimmed around it.
- Back, Skip and Next (Done on the last step), ← and → on the card, and Esc
  from anywhere. When it ends the focus goes back where it was, or to
  `returnFocus`, and `onEnd(finished)` is called once.
- A tour that ended, finished or skipped, is remembered under `remember`
  through `js/remember.js` (component `tour`: `kp-remember:tour:network:done`,
  `tourMemoryKey(name)`); `tourRemembered(name)` reads it and
  `forgetTour(name)` forgets it. `shouldStartTour()` starts it on `?tour`
  (`?tour=3` on the third step) always, and otherwise only on a first visit
  by a person, not a browser driven by a script.
- `decorate(part, info)` is handed the card's three buttons
  (`tour-next`, `tour-back`, `tour-skip`) each time a tour builds them;
  `strings` overrides the dictionary's `tour…` words for this tour.
## Forms, settings, facts and buttons: the form grid [align-grid-1019]

**This is THE way to lay out a form, a settings list, a key-value panel and the buttons that act on them.** Kenny,
2026-10-19, after seven settings sections were rejected for a second column that "ziet er totaal niet uniform uit" and a
"Send test" that stood off the line of "Format" and "Minify": "Gebruik het grid en align deftig verticaal!". Do not lay
these out with flex rows, `justify-content: space-between` or a label and a control side by side in a `div`: the columns
then line up by accident, and by accident they do not.

`.kp-formgrid` is one grid of four named column tracks that every row inside it shares as a subgrid:

    label | control | value | actions

| Track     | Width                                                                                                     | Holds                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `label`   | the longest label (at most `--kp-formgrid-label-max`, 40 %; at least `--kp-formgrid-label-min`)            | `.kp-formgrid__label`, a `dt`, `.kp-formrow__label`                         |
| `control` | `--kp-formgrid-control` (3fr; a length caps it)                                                                   | `.kp-formgrid__control`, `.kp-formrow__control`; a `dd` spans control+value |
| `value`   | `--kp-formgrid-value` (2fr)                                                                                                | `.kp-formgrid__value`, `.kp-formrow__aside`: a default, a source, a hint    |
| `actions` | its widest button group                                                                                   | `.kp-formgrid__actions`, buttons at its end                                 |

```html
<div class="kp-formgrid" data-kp-formgrid-lines="lines">
    <div class="kp-formgrid__row">
        <label class="kp-formgrid__label" for="hour">Nightly hour</label>
        <div class="kp-formgrid__control"><input class="kp-field__input" type="time" id="hour" value="02:00" /></div>
        <p class="kp-formgrid__value">default off</p>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Reset</button></div>
    </div>
    <dl class="kp-kv">
        <div class="kp-kv__row"><dt>Last run</dt><dd>19/10/2026 02:00</dd></div>
    </dl>
    <div class="kp-formgrid__row kp-formgrid__row--buttons">
        <div class="kp-formgrid__control">
            <div class="kp-formgrid__buttons">
                <button class="kp-button" type="button">Format</button>
                <button class="kp-button" type="button">Minify</button>
            </div>
        </div>
        <div class="kp-formgrid__actions"><button class="kp-button kp-button--primary" type="button">Send test</button></div>
    </div>
</div>
```

What it does for you, without hand work:

- **Columns run through every row and every block.** A `.kp-formrows`, a `.kp-kv`, a `fieldset`, a `form` or a
  `.kp-formgrid__group` placed inside the grid becomes a subgrid of it: a key-value panel under a form starts its values on
  the edge where the fields start. A `legend` or `.kp-formgrid__heading` in a group spans the whole width and sits close on
  its rows (`--kp-space-xs`); groups stand apart by the grid's row gap. Inside the grid a `.kp-formrows` or `.kp-kv` is no
  size container (a size container cannot be a subgrid), and facts keep the key-value list's own gap, `--kp-kv-gap`
  (0.375rem), so a facts panel reads as one compact list. Such a block stands on the top of its own row
  (`align-self: start`) while its rows keep the first baseline: on the grid's first baseline Chromium 151 laid a
  key-value list in a form grid at y = -33554328 and the facts vanished [gapform-1019].
- **One edge per kind of control.** Every control starts on the control track's edge. A field, select, combobox, textarea,
  secret, code block or command fills the track; a short control (stepper, time, number, date, `.kp-field__input--short`,
  `.kp-formgrid__short`) takes one fixed step, `--kp-formgrid-short` (14rem), and a stepper is never squeezed under its unit;
  a switch or a checkbox keeps its own size. So the column ends on at most two edges. A date picker is a short control
  too, in the cell or in a `.kp-formgrid__short`: its input box is the step, so it ends where a stepper's box ends, and
  the calendar button stands after it [gapform-1019].
- **A combobox's status is the row's value text.** In a row whose control is a `.kp-combobox` and that has no `.kp-formgrid__value` of its own, `attachComboboxes` moves the combobox's status line ("11 results") into the value track, so the row is as high as its label and the status stands in the column of every other row's hint. In a row with value text of its own the status stays a live region under the input but is read, not shown, so that row too is as high as its label [gapform-1019]. A combobox outside a form grid keeps the status under the input.
- **Every row on one line.** Cells align on the row's first baseline: the label's first line, the text in a field, the number
  of a stepper, a switch's word, a value's words. A multi-line label or a field with help under it keeps its first line on
  that line. `data-kp-formgrid-align="center"` centres instead. A row whose label has a note under it (`<small>` or
  `.kp-formgrid__note` in the label) is centred on the label block by itself: on the first baseline the field and the
  Reset stood on the block's first line and the block hung under them (Kenny, 2026-10-19 11:22).
- **Buttons on the tracks.** `.kp-formgrid__row--buttons` is a row of buttons, centred on one line: its
  `.kp-formgrid__control` puts a `.kp-formgrid__buttons` group on the fields' start edge, and its `.kp-formgrid__actions`
  puts the row's own action at the end of the actions column, so "Send test" stands on the line of "Format" and "Minify"
  and in the column of every other row action. Give buttons that stand on one line the same size.
- **A JSON field's first line is its tool row.** In a row that holds a `.kp-jsonfield`, the label, the `__value` text and the
  `__actions` cell (its button centred on the tools) all stand on the line of Format, Minify, Wrap and Copy.
- **A refresh in the grid.** A `.kp-refresh` placed in the grid becomes a subgrid row: the chooser in the control track,
  its freshness line in the value track (its words on the start edge), Refresh now in the actions track, all on the
  grid's column gap. `data-kp-refresh-label="Auto-refresh"` adds the row's label in the label track (outside a form grid
  it is a line above the bar, and the bar folds to one column under 40rem; `data-kp-refresh-stack` sets the fold). In a
  narrow column on a wide screen the freshness line keeps the width of its words and the chooser gives way (its segments scroll).
- **The attention band and problem alerts in the grid.** A `.kp-attention[data-kp-subgrid]` placed in the grid takes its
  tracks: the icon in the label track, the words from the control edge, the fix in the actions column (see "The
  attention band").
- **The grid does not stretch across a wide panel** [formgrid-compact-1019]. A grid with nothing that needs the width (no code block,
  JSON field, text area, refresh bar or spanning cell) is compact: its tracks are as wide as what they hold (the label, the widest
  control up to `--kp-formgrid-control-max` 28rem, the hint up to `--kp-formgrid-value-max` 20rem, the widest action) and what is left over is
  one empty filler track at the end. A hint therefore follows its control at the column gap and an action follows its row, instead of
  being flung to the panel's far edge (Kenny, 2026-10-19 17:20: hints at x 1120 and an action at x 1945 on a 2000 px panel). A
  field is `--kp-formgrid-field` (18rem, at most 38 % of the grid) wide. A grid with a wide block keeps the stretching tracks, held at
  `--kp-formgrid-max` (60rem).
- **Groups side by side.** A grid whose children are all `.kp-formgrid__group` (facts and settings, say) stands them in a row when the panel
  holds all of them, each group as wide as its own tracks, `--kp-formgrid-group-gap` (2rem) apart, all starting at the top:
  `attachFormgridColumns` (`js/forms.js`, run by `auto.js`) measures what the groups need and writes `data-kp-formgrid-wide` on the grid
  while they fit. Otherwise they stand under each other on the grid's shared tracks, so every label, value and button starts on one edge.
  Put each group's buttons in the group (a `.kp-formgrid__row--buttons` with the buttons in its control cell), so they stand beside what
  they act on. `data-kp-formgrid-columns="never"` keeps the groups under each other.
- **A field fills its track.** A `.kp-field` has no width cap of its own (`--kp-field-max-width` sets one where a page
  wants a measure), so a field in a value track or a page's grid column ends on the column's edge.
- **Cards that share rows: `data-kp-formgrid-stage`** [gapform-1019]. A form grid is a size container (it folds on its own
  width), and a size container cannot be a subgrid, so two cards side by side could not put "Source" beside "Source".
  Put the cards in an element with `data-kp-formgrid-stage` (the stage) and give each `data-kp-formgrid-rows="subgrid"`: the stage holds the container
  (by the same name, so every rule of the grid folds on the stage's width), lays the cards side by side, each at least
  `--kp-formgrid-stage-min` (24rem) wide and one under the other when they do not fit, and every card takes its rows from
  the stage, so row N of every card has one height. Its blocks (`.kp-kv`, `.kp-formrows`, `.kp-formgrid__group`, `form`)
  give their rows to the card itself. `attachFormgridStages(root)` (`js/forms.js`, run by `auto.js`) writes
  `--kp-formgrid-rows`, the row count of the longest card, on each stage and keeps it when a row comes or goes; a page
  that does not load it sets the count itself.

  ```html
  <div data-kp-formgrid-stage>
      <article class="kp-card kp-formgrid" data-kp-formgrid-rows="subgrid" data-kp-formgrid-lines="lines">
          <h3 class="kp-card__title" data-kp-formgrid-span="all">alertmanager</h3>
          <dl class="kp-kv"><div class="kp-kv__row"><dt>Source</dt><dd>kyu topic alerts.raw</dd></div></dl>
      </article>
      <article class="kp-card kp-formgrid" data-kp-formgrid-rows="subgrid" data-kp-formgrid-lines="lines">…</article>
  </div>
  ```

- **A cell that needs more room says so**: `data-kp-formgrid-span="control-value"`, `"wide"` (control to actions) or
  `"all"`.
- **The phone** [formgrid-phone-1019]. Under 36rem of the grid's own width every row is three lines on the grid's tracks (Kenny,
  2026-10-19 11:22 and 17:20): the label with its note across the whole width (a button never stands beside wrapping text), the control
  across the whole width, and under it the hint on the start side with the row's action in the actions track at the end, so every action has
  one width and ends on one edge. Short controls (stepper, time, number, date, short field) fill the width, and every one-line field, select,
  stepper and time field centres what it shows. A switch is the exception: label on the left, the switch in the actions track on the right.
  A fact and its value share one line. A group of buttons is equal columns (a pair is two equal columns, four are two by two, an odd last
  one runs across), a row of buttons without a label puts its note centred under them and a lone action across the width.
  `data-kp-formgrid-stack="always"` keeps the plain top-to-bottom column.

Options, all attributes on `.kp-formgrid`, read by CSS alone, so changing one at run time re-lays the grid at once:

| Attribute                 | Values                                     | Default    |
| ------------------------- | ------------------------------------------ | ---------- |
| `data-kp-formgrid-label`  | `fit` (the longest label), `wide` (14rem+) | `fit`      |
| `data-kp-formgrid-align`  | `baseline`, `center`                       | `baseline` |
| `data-kp-formgrid-stack`  | `auto` (the phone layout under 36rem), `always` (one plain column), `never` | `auto` |
| `data-kp-formgrid-lines`  | `none`, `lines` (a rule under every row)   | `none`     |
| `data-kp-formgrid-rows`   | `own`, `subgrid` (rows from a `data-kp-formgrid-stage` parent) | `own` |
| `data-kp-formgrid-columns` | `auto` (groups side by side when wide), `never` | `auto` |

Knobs: `--kp-formgrid-gap` (between rows, the md step), `--kp-formgrid-column-gap` (the lg step), `--kp-formgrid-label-min`,
`--kp-formgrid-label-max`, `--kp-formgrid-control`, `--kp-formgrid-value`, `--kp-formgrid-short`, `--kp-formgrid-line-pad`, `--kp-formgrid-max` (60rem, grids with a wide block), `--kp-formgrid-control-max` (28rem), `--kp-formgrid-value-max` (20rem), `--kp-formgrid-field` (18rem), `--kp-formgrid-group-gap` (2rem); on a stage
`--kp-formgrid-stage-min` (24rem), `--kp-formgrid-stage-gap` (the lg step) and `--kp-formgrid-rows`. A row takes
`data-kp-changed` and `data-kp-state="error"` like a form row.

`.kp-formrows` on its own got the same two rules (first baseline, one width per kind of control), so a page that has not
moved to the form grid yet already lines up inside one list. The check that holds every review demo to this is
`research/_review/measure-align.mjs`, run by `measure-gaps.mjs`; it also flags a label block that hangs under its row
(B2) and a form, settings or key-value row that stacks its action or a fact's value under its label on one left edge (H).

## Rows, cards and choices [kpadopt4-rows]

What Kenny's apps still drew themselves around their lists (the homelab
Inbox, JobTracker's queue, files, appointments and readiness card, kyu's
dead letters), built as opt-in options on components the package already
had. Nothing changes for a page that does not ask for them.

### Choices as tiles

A group of checkboxes or radios where each answer needs a sentence of its
own: the fieldset and labels of any group, with `data-kp-layout="tiles"`.

```html
<fieldset class="kp-fieldset" data-kp-layout="tiles">
    <legend class="kp-field__label">What should the reply do?</legend>
    <label class="kp-field__option">
        <input class="kp-field__check" type="checkbox" name="act" value="thank" checked />
        <span class="kp-field__option-title">Thank them for the interview</span>
        <span class="kp-field__option-hint">One sentence about Tuesday's talk.</span>
    </label>
</fieldset>
```

The whole tile is the target; the box stays the native input, so Space,
a radio group's arrows and the form's own submit work unchanged. Tiles
share one height per row and fall to one column under
`--kp-field-tiles-min` (14rem). Checked: the primary edge, a 1 px inner
ring and a 6 % primary plate; focus: the ring around the tile; disabled:
a dashed edge on the muted ground. An invalid group is the fieldset's own
outline (`aria-invalid="true"` on the fieldset, the message in a
`.kp-field__error` after it). Knobs: `--kp-field-tiles-min`,
`--kp-field-tiles-gap`, `--kp-field-tile-pad`, `--kp-field-tile-radius`,
`--kp-field-tile-ground`, `--kp-field-tile-ground-checked`,
`--kp-field-tile-edge-checked`. No script.

### A check list with the fix written out

The status rows (`.kp-statuslist`, `js/statusrow.js`) carry a system's
checks too: two opt-in parts, a `warn` state for a check that passes with
a reservation and `.kp-statusrow__fix`, the fix written out, shown on a
failed or warn row only. A row that carries a fix keeps its room in every
state, so a check that passes on the next read moves nothing; leave the
part out of a check that cannot fail.

```html
<ul class="kp-statuslist kp-statuslist--rows" aria-label="What JobTracker needs" data-kp-status-retry="false">
    <li class="kp-statusrow" data-state="warn" data-kp-status-id="almanac">
        <span class="kp-statusrow__mark" aria-hidden="true"></span>
        <span class="kp-statusrow__body">
            <span class="kp-statusrow__label">Calendar (Almanac)</span>
            <span class="kp-statusrow__detail">partly set up</span>
            <span class="kp-statusrow__fix">Add the Almanac token to the configuration to send follow-ups and interviews.</span>
        </span>
    </li>
</ul>
```

The warn mark is the warning pair (its plate, its own ink on it) with "!"
as its shape (`--kp-glyph-warn`), and a screen reader hears "needs
attention" (`statusWarn`). `buildStatusList(rows)` and
`setStatus(list, id, { state, detail, fix })` take `fix`;
`countStatus(list)` counts the rows per state for the summary line ("3 of
4 checks pass"). A list of checks usually re-checks as a whole, from its
card's header: `data-kp-status-retry="false"` leaves out the Retry per
row. Knob: `--kp-statusrow-fix-gap`.

### Every data component uses its standard states

Every data component ships its loading, empty and failed states; an app wires them and never draws its own (Kenny,
2026-10-19: "we hebben zoveel tijd en moeite in die componenten gestoken en dan kan je ze nog niet eens met hun standaard
functionaliteit implementeren?"). Loading is the busy card centred over the data area (`js/busy-card.js`, the table's own
spinner and words); empty and failed are the package plate (`.kp-stateplate`, `js/state-plate.js`), centred, the title at
heading size, a normal-size Retry that fires `kp-<component>-retry` on the host. So:

- set the state from the moment the read starts (`loading`), not after it; a blank component, a "Loading…", "No data" or
  "Could not load" line, a spinner of your own, a row spanning the columns or a bare `.kp-empty` is never the state;
- an empty result is the component's empty state, a failure its failed state, and the page listens to the retry event;
- a form with a submit is `<form data-kp-form>` with `data-kp-submit` (busy while it sends, `form(el).done()`) and
  `data-kp-form-summary` (what failed: `form(el).errors({ name: message })`).

| Component | Kind: its loading look | Host | Loading | Empty | Failed (Retry event) |
| --- | --- | --- | --- | --- | --- |
| data table | table: busy card | `[data-kp-datatable]` | `dataTable(el).busy({ overlay: true })` (or `data-kp-busy-overlay`) and `.state('loading')` | no rows: the package's own plate (a title at heading size, held at the loaded height), or your slot `<div class="kp-empty" data-kp-datatable-empty hidden>` (bare words become its body text, a missing title is the dictionary's) | `.fail(reason)` (`kp-datatable-retry`) |
| network graph | plot: chart picture | `[data-kp-graph]` | `setGraphState(el, 'loading')` | `setGraphState(el, 'empty', title, { text })` | `setGraphState(el, 'error', title, { text })` (`kp-graph-retry`) |
| heat grid / matrix | grid: busy card | `[data-kp-heat]` / `[data-kp-matrix]` | `setHeat(el, { state: 'loading', skeleton })` / `setMatrix(el, { state: 'loading' })` | `{ state: 'empty', message, text }` | `{ state: 'error', message, text }` (`kp-heat-retry` / `kp-matrix-retry`) |
| run timeline | timeline: busy card | `[data-kp-gantt]` | `setGanttState(el, 'loading')` | `setGanttState(el, 'empty', title, { text })` | `setGanttState(el, 'error', title, { text })` (`kp-gantt-retry`) |
| week | timeline: busy card | `[data-kp-week]` | `setWeekState(el, 'loading')` | `setWeekState(el, 'empty', title, { text })` | `setWeekState(el, 'error', title, { text })` (`kp-week-retry`) |
| uptime strip | strip: busy card | `[data-kp-uptime]` | `setUptime(el, { label, state: 'loading', count })` | `{ state: 'empty' }` | `{ state: 'error', error }` |
| calendar | calendar: calendar picture | `[data-kp-calendar]` | `setCalendarState(el, 'loading')` | `setCalendarState(el, 'empty', words)` | `setCalendarState(el, 'error', words)` (`kp-calendar-retry`) |
| pipeline | timeline: busy card | `[data-kp-pipeline]` | `setPipelineState(el, 'loading')` | `setPipelineState(el, 'empty', words)` | `setPipelineState(el, 'error', words)` (`kp-pipeline-retry`) |
| activity feed | list: busy card | `[data-kp-feed]` | `setFeed(el, { state: 'loading' })` | `{ state: 'empty' }` | `{ state: 'error', error }` (`kp-feed-retry`) |
| notices | list: busy card | `[data-kp-notices]` | `setNotices(el, { state: 'loading' })` | `{ state: 'empty' }` | `{ state: 'error', error }` (`kp-notices-retry`) |
| log viewer | text: busy card | `[data-kp-logviewer]` | `data-kp-state="loading"` (or `setLogViewer(el, { state: 'loading' })`) | no lines | `data-kp-state="error"` (`kp-logviewer-retry`) |
| diff view | text: busy card | `[data-kp-diffview]` | `setDiff(el, { state: 'loading' })` | `{ state: 'empty' }` | `{ state: 'error', message }` (`kp-diff-retry`) |
| checklist | list: busy card | `[data-kp-checklist]` | `setChecklistState(list, 'loading')` | `setChecklistItems(list, [])` | `setChecklistState(list, 'error', message)` (`kp-checklist-retry`) |
| timers | list: busy card | `[data-kp-timers]` | `setTimersState(list, 'loading')` | no timers | `setTimersState(list, 'error', message)` (`kp-timers-retry`) |
| card with data | card: busy card | `.kp-card[data-kp-state]` with `.kp-card__stage` | `setCardState(card, 'loading', { words })` (or write `data-kp-state`) | `setCardState(card, 'empty', { title, text, action })` (`action` is one node, an array or a fragment: several lie on the plate's own action row) | `setCardState(card, 'error', { title, text })` (`kp-card-retry`) |
| today card | card: busy card | a `.kp-card` | `setTodayState(card, 'loading')` | `setTodayState(card, 'empty')` | `setTodayState(card, 'error')` (`kp-card-retry`) |
| status list | row: row spinner | `.kp-statuslist` | per row: `setStatus(list, key, { state: 'loading' })` | `{ state: 'empty' }` | `{ state: 'failed' }` (`kp-status-retry`) |
| entity grid | list: busy card | `[data-kp-entity-grid]` | `setEntityGridState(grid, 'loading', { count })` | `setEntityGrid(grid, [], { title })` or `setEntityGridState(grid, 'empty', { title })` | `setEntityGridState(grid, 'error', { message })` (`kp-entity-grid-retry`) |
| chart | plot: chart picture | `[data-kp-chart]` | `data-kp-chart-loading` on the chart | `setChartData(el, { series })` with no points | `setChartData(el, { series, error })` (`kp-chart-retry`) |
| bullets | list: busy card | `[data-kp-bullets]` | `setBullets(el, { state: 'loading' })` | `{ state: 'empty', emptyTitle }` | `{ state: 'error', message }` (`kp-bullets-retry`) |
| runs | list: busy card | `[data-kp-runs]` | `setRunsState(el, 'loading')` | `setRuns(el, [], { reason })` | `setRunsState(el, 'error', { title, text })` (`kp-runs-retry`) |
| master-detail | pane: busy card | `[data-kp-master-detail]` | `setPaneState(root, 'loading')` | `setPaneState(root, 'empty', { title })` | `setPaneState(root, 'error', { title, text })` (`kp-pane-retry`) |
| dependency list | list: busy card | `[data-kp-deplist]` | `deplist(el).setState('loading')` | `.setState('empty')` | `.setState('error', { message })` (`kp-deplist-retry`) |
| code view | text: busy card | `[data-kp-code]` | `setCode(el, { state: 'loading' })` | `{ state: 'empty' }` | `{ state: 'error', message }` (`kp-code-retry`) |
| gallery | list: busy card | `[data-kp-gallery]` | `setGallery(el, { state: 'loading' })` | `{ state: 'empty' }` | `{ state: 'error', message }` (`kp-gallery-retry`) |
| console | text: busy card | `[data-kp-console]` | `setConsole(root, { state: 'loading' })` | no blocks | `{ state: 'error', message }` (`kp-console-retry`) |
| request inspector | list: busy card | `[data-kp-requests]` | `setRequestsState(el, 'loading')` | `setRequests(el, [])` | `setRequestsState(el, 'error', { message })` (`kp-requests-retry`) |
| availability grid | grid: busy card | `[data-kp-availability]` | `setAvailability(root, { state: 'loading' })` | `{ state: 'empty' }` | `{ state: 'error' }` (`kp-availability-retry`) |

#### Which loading look belongs to which kind of element

A component's loading is not a choice: it is the look of its KIND, and every kind already has one in all twelve registers
(Kenny, 2026-10-19: "Heeft elke component geen eigen laadgedrag intussen? Dan kan je toch niet meer fout kiezen als je een
component kiest?"). The package draws it from the component's state call; a page never draws, picks or invents one, and a new
component names its kind first, then reuses the look of that kind.

| Kind | What it is | Its loading look | Drawn by | Components |
| --- | --- | --- | --- | --- |
| table, grid, strip, timeline, list, text, pane, card | data in rows, cells, lanes, items, lines or a card's stage | **busy card**: the theme's spinner and words centred over the data area, the data kept at its height | `js/busy-card.js` (`.kp-datatable__busy-card`) | data table; heat grid, matrix, availability grid; uptime strip; run timeline, week, pipeline; activity feed, notices, checklist, timers, entity grid, bullets, runs, dependency list, request inspector, gallery; log viewer, diff view, code view, console; master-detail; card with data, today card |
| plot | a drawn picture of values: lines, bars, nodes and edges | **chart picture**: the plot's place held as the theme's loading block, no busy card on it | `.kp-chart__state[data-kp-state='loading']` in each register | chart, network graph (the graph is a plot, not a table) |
| calendar | a month of days | **calendar picture**: the days wait as the theme's loading days (or its own busy spinner) | `.kp-calendar__day[data-kp-tone='loading']`, `.kp-calendar__busy` | calendar |
| row | one row with a mark | **row spinner**: the theme's spinner in that row's mark, the rest of the row kept | `.kp-statusrow__mark .kp-spinner` | status list |

The rule that decides a new case: if the element draws values as a picture, it is a plot and loads with the chart picture;
if it is a grid of days it is a calendar; if it is one row it is a row; anything else holds data in a box and loads with the
busy card. `research/_review/measure-states.mjs` drives every component into loading and fails with a line like
`chart: loading shows the busy card, but a chart is a plot (a drawn plot: lines, bars, nodes) and a plot loads with the chart
picture`, so a wrong look cannot be handed over.

The check is `research/_review/measure-states.mjs`; run it on your own page served locally before you hand it over:
`node research/_review/measure-states.mjs <port> <page> formal 1280,390` (from a kp-themes checkout, the page on
`127.0.0.1:<port>`). It prints `clear` or one line per fault, naming the component, the section and the call to use.

### A card in four data states

A card that shows data read from somewhere is loading, empty, failed or
filled, and keeps its place and size in all four: `data-kp-state` on a
`.kp-card`, the data in `.kp-card__stage > .kp-card__data`.

```html
<section class="kp-card" data-kp-state="loading" aria-labelledby="files-t">
    <div class="kp-card__header">
        <h2 class="kp-card__title" id="files-t">Files</h2>
        <div class="kp-card__actions"><span class="kp-timestamp">3 files</span></div>
    </div>
    <p class="kp-card__body">Everything in this application's folder.</p>
    <div class="kp-card__stage"><div class="kp-card__data"></div></div>
</section>
```

```js
import { setCardState } from '@kp-soft/themes/js/card-state';

setCardState(card, 'loading', { words: 'Reading the folder…' });
setCardState(card, 'error', { title: 'Could not list the files', text: 'The server answered 502 Bad Gateway.' });
setCardState(card, 'empty', { title: 'No files yet', text: 'Files the procedure writes land here.', action: uploadButton });
setCardState(card, 'ready');
card.addEventListener('kp-card-retry', () => reload());
```

Loading lays the data table's own loading card over the stage (the
theme's spinner and plate, `js/busy-card.js`); data already there stays
under it, dimmed and inert, so a refresh never blanks the card, and a
first load has `--kp-card-stage-min` (7.5rem) of room. Empty fills the
stage with the package's empty state (title, sentence, optional action);
error is the destructive alert turned into a state plate (centred in the
stage, its title at heading size, `--kp-stateplate-text`, a normal 2.25rem
Try again under the sentence), which fires `kp-card-retry` on the card; the
card is as high as the plate needs, more than one alert row. In both the data keeps its room, hidden, with the note
centred in it, so a failed refresh of a full card does not collapse it;
clear the data when it no longer holds and the stage falls back to its
least height. When the focused Try again goes with its state, the focus moves to
the stage. A framework that writes `data-kp-state` itself is followed by
`attachCardStates(root)` (loaded by `js/auto.js`), and may render its own
note in a `.kp-card__state` inside the stage. Exports: `setCardState`,
`attachCardStates`, `CARD_STATE`, `CARD_STATES`, `CARD_STATE_EVENT`
(`kp-card-state`, `{ card, state, previous }`), `CARD_RETRY_EVENT`.
Strings: `cardLoading`, `cardEmpty`, `cardFailed`, `cardRetry`. Knobs:
`--kp-card-stage-min`, `--kp-card-stage-gap`.

### A data component holds its height while a state shows

A data component that is loading, empty or failed fills the height it had when it was loaded, so the page under it does not
jump twice [t56-statefix-1018; Kenny, 2026-10-16: "de hele grootte van de component gebruiken"]. The matrix, the entity grid,
the checklist, the notices, the gallery, the availability grid, the request inspector and the operations page (`.kp-ops`) write `data-kp-state` on their host, and
`js/footprint.js` follows that one attribute (loaded by `js/auto.js`; `attachFootprints(root)` for a subtree you render yourself, `holdFootprint(host)` for one host):
while the host is ready it remembers its height, and while it is `loading`, `empty` or `error` it holds that height as `min-block-size`.
A first load that fails or comes back empty has nothing remembered: a data table is then held at what its page of rows would make it (its own frame
plus `data-kp-page-size`, default 10, rows of `--kp-footprint-row`, default `2.75rem`), and any other host that says
`data-kp-footprint-rows="N"` is held at its frame plus N such rows; a loaded height, once there is one, wins. A table that shows cards when narrow
sets `--kp-footprint-row` for that width. The hold is capped by `--kp-footprint-max` (default `48rem`; set it on the host or on any
ancestor), because a plate in the middle of 1600 px is out of sight; a `min-block-size` you set yourself is kept (the host is held at the larger
of the two); a content-box host is held at its content height. A checklist with no items writes `data-kp-state="empty"` itself, and a
checklist set to `error` shows the failed plate alone (its rows stay in memory for the next ready).

### A failed operations page

A `.kp-ops` page with `data-kp-state="error"` shows the failure whole [t56-statefix-1018, S12]. `data-kp-ops-failed` chooses how:
`plate` (the default) lets the failure alert take the page's body, centred and at heading size (`--kp-stateplate-text`), at the height the page had
when it was ready (the page is one of the hosts of `js/footprint.js`, capped by `--kp-footprint-max`), with the cards of the last read hidden; `keep` leaves the
cards where they are under one attention band on top, the behaviour before this option. It is read from the attribute, so changing it on a live page switches the look with no script.

### A segmented control that scrolls

A segmented track wider than its room scrolls inside its bar and carries `data-kp-segmented-overflow` (written by `js/segmented.js`). A resting scroll lands on
a whole segment (`scroll-snap-type: x proximity`, `scroll-padding-inline` of the fade width), and the side that has more segments out of sight fades out, so a label is never
left cut at the edge [t56-scrolledge-1018]. `js/segmented.js` writes `data-kp-segmented-more` on the track while it scrolls and lays out: `start`, `end` or `start end`
(export `MORE_ATTRIBUTE`); a side with nothing beyond it is not faded. Set the width of the fade with `--kp-seg-fade` (default `1.5rem`; `--kp-seg-fade-start` and
`--kp-seg-fade-end` are set by the attribute and are not meant to be set). Nothing animates, so reduced motion changes nothing. The refresh chooser and the
request inspector's filter are such tracks on a phone.

### Staying inside the row

Four components keep their parts inside their own row at any width [t56-sharedfix-1018]; none has an option. A version badge (`.kp-badge--version`) is
as wide as its row at most, and `.kp-version__from` and `.kp-version__to` break inside a word only when the text has no dot, hyphen, underscore or colon to break after (a raw digest). A checklist item's
detail gets at most half of the row and wraps, the label keeps its words. An availability row that carries answers puts the person's name on its own line above them. The first and last time label of a chart anchor to
their tick (start and end) when centred they would cross the edge of the drawing, 4 px kept.

### Rows with a lead: an inbox, a backlog, files, appointments

`.kp-action-list--lead` adds a lead column before the words of the list's
rows (the buttons in shared columns stay as they are): a state badge or
dot, a file's format, an appointment's day and hour. The column is as wide
as the widest lead of the list, so every title starts at one edge, on a
phone too.

```html
<ul class="kp-action-list kp-action-list--lead" aria-label="Inbox" data-kp-row-keys>
    <li data-kp-state="new">
        <span class="kp-action-list__lead"><span class="kp-badge kp-badge--destructive">dead</span></span>
        <div class="kp-action-list__main">
            <strong class="kp-action-list__title">Backups of vault failed twice</strong>
            <span class="kp-action-list__text">The backup target refused the connection.</span>
            <span class="kp-action-list__meta"><span>Backups</span><span>12 min ago</span></span>
            <details class="kp-accordion__item kp-accordion__item--bare kp-action-list__more">
                <summary>Payload</summary>
                <pre class="kp-action-list__payload">{ "job": "backup" }</pre>
            </details>
        </div>
        <div class="kp-row-actions">
            <button type="button" class="kp-button kp-button--sm">Mark seen</button>
            <button type="button" class="kp-button kp-button--sm kp-button--primary">Open</button>
        </div>
    </li>
</ul>
```

Parts: `__lead` (every row carries one, empty if need be), `__main` with
`__title`, `__text`, `__meta` (its plain parts set apart by a dot that
stays with the part before it; badges stand on their own plate) and the
folded payload `__more` > `__payload` (at most
`--kp-action-list-payload-max`, 16rem, then scrolling); `time.__when` for
a moment (the day over the hour); `li.__group` for a heading row across
the list (Upcoming, Past). `data-kp-state` on a row is `new`, `active`,
`warn`, `failed`, `next` (the bar, a primary wash and the lead in the
primary) or `done` / `past` (quieter ink); each draws a bar along the
start edge that every row reserves, so a state moves nothing.

`js/actions.js` runs the row's work: `setRowBusy(row, busy, button)`
dims the row (`aria-busy`), makes its buttons refuse a press
(`aria-disabled`, the focus stays) and lays the theme's spinner over the
pressed button's words at its own width; `removeRow(row)` lets the row
leave the theme's way (`leave()`), the focus first going to the same
button of the next row; `attachRowKeys(root)` (loaded by `js/auto.js` for
`data-kp-row-keys`) walks the rows with j / k or the arrows, Home and End,
one row in the tab order, and fires `kp-row-open` (`{ row }`) on Enter on
a row. Exports: `setRowBusy`, `removeRow`, `attachRowKeys`, `ROW_KEYS`,
`ROW_OPEN_EVENT`. Knobs: `--kp-action-list-lead-gap`,
`--kp-action-list-bar`, `--kp-action-list-pad`,
`--kp-action-list-next-wash`, `--kp-action-list-payload-max`.

## Seven everyday components [kpadopt4-ideas]

Seven things Kenny's apps kept drawing by hand, approved as components on 2026-10-16 and demoed in formal
(`research/kpadopt4/`). The registers do not answer them yet (they are on `gates/register-pending.json`), so every
theme draws them from its tokens and its own buttons, segmented control, date picker, hover card and busy card.
`js/auto.js` fetches each module only on a page that carries its markup; each attach function returns a detach.

### An uptime strip

One thin strip of cells, one per period (90 days, 48 hours), each toned up, degraded, down or no data, with the window's
summary over it in exact figures and the first and the latest period's names under it:

```html
<div class="kp-uptime" data-kp-uptime data-kp-uptime-label="jellyfin" data-kp-uptime-count="90"></div>
```

```js
import { setUptime } from '@kp-soft/themes/js/uptime';

setUptime(strip, {
    label: 'jellyfin',
    from: '90 days ago',
    to: 'Today',
    periods: [
        { key: '2026-10-15', label: '15/10/2026', state: 'degraded', uptime: 0.981, incidents: 1, tip: 'Slow answers for 27 min' },
        { key: '2026-10-16', label: '16/10/2026', state: 'up' },
    ],
});
```

Until the page calls `setUptime()` the strip shows its loading state from its attributes (`data-kp-uptime-count`
skeleton cells under the data table's busy card), so it is loading from the first frame. `state` is `ready` (the
default), `loading`, `empty` or `error`. Empty and failed are the package's state plate over the strip's whole footprint
(js/footprint.js holds the height the strip had with its cells): `setUptime(el, { state: 'empty', message?, text?, art? })`
("No data yet" without `message`) and `setUptime(el, { state: 'error', error: 'The checks could not be read', text?, art? })`,
a failure with a Retry that fires `kp-uptime-retry` on the strip (bubbling; `UPTIME_RETRY_EVENT`): read again and call
`setUptime(el, { periods })`. A strip with data but no period that has any stays ready and says "No data yet" in its summary.

The figures are exact: the share is cut to one decimal, never rounded up, so only a window without any time down reads
100%, and the incident count is the number. A period counts with its `uptime` (0 to 1) when given, else 1 for up and
degraded and 0 for down; a period without data does not count. Its incidents are `incidents`, else 1 for a degraded or
down period. `uptimeFigures(periods)`, `uptimePercent(share)` and `uptimeFit(count, width, min, gap)` are the arithmetic.

A strip never wraps. Narrower than its cells at `--kp-uptime-cell-min` (4px) each, it shows the latest periods that fit
and says "N of M shown" under them; with `data-kp-uptime-fit="scroll"` it keeps every period, scrolls sideways,
starts at the latest and fades the edge it has more behind. Every cell is a button with the hover card for its detail
(`tip`, else its label, state and figures): the strip is one tab stop, the arrows walk the cells, Home and End jump,
and a press fires `kp-uptime-pick` (`{ key, index, period }`). The dictionary words are `uptime…`
(`uptimeLoading`, `uptimeEmpty`, `uptimeError`, `uptimePercent`, `uptimeIncidents`, `uptimeSummary`, `uptimeTrack`,
`uptimeStateWord`, `uptimeCell`, `uptimeShown`). Knobs: `--kp-uptime-height` (1.75rem), `--kp-uptime-cell-min`,
`--kp-uptime-gap` (2px), `--kp-uptime-cell-radius`, `--kp-uptime-up`, `--kp-uptime-degraded`, `--kp-uptime-down`,
`--kp-uptime-lift`. Exports: `attachUptimes`, `setUptime`, `uptimeFigures`, `uptimePercent`, `uptimeFit`, `UPTIME`,
`UPTIME_PICK_EVENT`, `UPTIME_STATES`, `UPTIME_COUNT`.

### A typed confirmation

For the few actions that delete what cannot come back, the confirmation dialog of the destructive button can ask for
the name first. Add `data-kp-confirm-type` to a button that already has `data-kp-confirm`:

```html
<button
    type="button"
    class="kp-button kp-button--destructive"
    data-kp-destructive
    data-kp-confirm="Wipe the stack media?"
    data-kp-confirm-type="media"
    data-kp-confirm-loses="lost-media"
>
    Wipe media…
</button>
<template id="lost-media">
    <ul class="kp-type-confirm__list">
        <li>3 containers: jellyfin, jellyseerr, tdarr</li>
        <li>/srv/media/config (2.4 GB)</li>
    </ul>
</template>
```

The dialog then shows what will be lost (the template's content, under "This deletes, for good:"), the label "Type
media to confirm" with the name in a code chip, the field (it has the focus), the rule and one line that says whether
it matches. Confirm stays disabled until it does and carries the button's own words without the trailing "…"
(`data-kp-confirm-label` sets others); Enter in the field confirms a match; your handler runs once, as with every
confirmation. Spaces at the start and the end never count, capitals do unless `data-kp-confirm-case="any"`; the rule
under the field says which. From a script, `openConfirmation(button, { typeName, anyCase, loses, acceptLabel })`.
Without the attribute the confirmation is exactly what it was.

Inside a dialog or form of your own (a wizard's review step), put the block where it belongs and name the button it
holds off:

```html
<div data-kp-type-confirm="media" data-kp-type-confirm-for="wipe" data-kp-type-confirm-loses="lost-media"></div>
<button type="button" class="kp-button kp-button--destructive" id="wipe">Wipe media</button>
```

`attachTypeConfirms(root)` (in `js/components.js`, attached by `js/auto.js`) fills it and keeps the button disabled
until the name matches; a button you disabled yourself stays disabled. The block fires `kp-type-confirm`
(`{ matched, value, name }`) when the answer turns and carries `data-kp-matched`. `typeConfirmMatches(typed, name, {
anyCase })` is the rule and `buildTypeConfirm(document, { name, anyCase, loses, onChange })` builds the block for a
page that draws its own. The words are `typeConfirmLabel`, `typeConfirmRuleExact`, `typeConfirmRuleAnyCase`,
`typeConfirmMatched`, `typeConfirmMismatch` and `typeConfirmLoses`. Knobs: `--kp-type-confirm-gap`,
`--kp-type-confirm-list-max` (12rem; a longer list scrolls), `--kp-confirm-typed-max-width` (30rem).

### A command to run

One command with the terminal it runs in, an admin or sudo badge, a copy button that confirms and where it runs:

```html
<div class="kp-command" data-kp-command="powershell" data-kp-command-elevated data-kp-command-where="the Windows PC">
    <pre class="kp-command__code"><code>Get-Service -Name "Claude*" |
    Restart-Service -Force</code></pre>
</div>
```

`attachCommands(root)` (`js/command.js`, attached by `js/auto.js`) writes the head: the terminal's name
(`data-kp-command` is `wsl`, `powershell`, `cmd`, `garuda` or `bash`; `data-kp-command-label` names another), the
warning badge `admin` (Windows) or `sudo` (Linux) for `data-kp-command-elevated`, and the package's copy button
(`[data-kp-copy]`, js/patterns.js: "Copied" on the button and announced, `kp-copy`; a refused clipboard marks the
button and says so in a toast, `kp-copy-failed`). The button keeps one width for both words. `data-kp-command-where`
becomes "Runs on …" under the code.

Every line stands behind its terminal's prompt (`$`, `PS>`, `>`), drawn by the stylesheet (`--kp-command-prompt`), so
it is never selected or copied: the copy is the command as written, newlines and all. A line that ends in the
terminal's continuation mark (`\` in a Linux shell, a backtick in PowerShell, `^` in cmd) or in a pipe (and `&&` or
`||` in a Linux shell) carries on, indented, on the next. A long line wraps under its first character after the
prompt; with `data-kp-command-wrap="scroll"` it stays whole and the code scrolls sideways, a focusable region whose
edge fades on the side with more. Before the script runs the block keeps its head's room, so the code does not move.
`commandLines(text, continues)` is the line rule and `COMMAND_SHELLS` the table of terminals. The words are
`commandShell`, `commandAdmin`, `commandAdminTitle`, `commandSudo`, `commandSudoTitle` and `commandRunsOn`, beside the
copy button's own `copy` and `copied`. Knobs: `--kp-command-prompt`, `--kp-command-prompt-width`,
`--kp-command-prompt-ink`, `--kp-command-head-height` (2.75rem), `--kp-command-code-max`.

### Two timers: a disc and digits

Two separate components, on one clock (`countdownClock()` in `js/countdown.js`: the time left is the end moment minus
`now()`, so neither drifts or loses time in a hidden tab, and a test hands in its own `now`).

**The visual timer** shows the time left as a shrinking disc, with no figures ticking:

```html
<div class="kp-timer-disc" data-kp-timer-disc="25m" data-kp-timer-disc-name="Focus"></div>
```

`attachTimerDiscs(root)` (`js/timer-disc.js`) draws a round face with twelve marks on its rim and a disc in the
theme's primary colour that turns back towards twelve o'clock; under it the name and length ("Focus · 25 min"), one
line for Paused or Time is up, and Start (Pause, Resume, one width) and Reset as package buttons. The whole disc is the
set length; `data-kp-timer-disc-scale="60"` makes the face a 60-minute dial instead. The disc is one number,
`--kp-timer-disc-left` (1 full, 0 gone), written only when its edge has moved a tenth of a degree; Reset fills it again
in the theme's `--fx-duration` and `--fx-ease`. Paused, the disc rests a shade lighter; at the end the face breathes
three slow times and keeps a ring. Under reduced motion the disc steps once a minute (each second in the last minute)
and nothing glides or breathes. The face is an image named by the time left in whole minutes. `timerDiscOf(el)` is
the clock of an attached timer, `discShare(remaining, scale)` the arithmetic. Knobs: `--kp-timer-disc-size` (12rem,
at most 70vw), `--kp-timer-disc-fill`, `--kp-timer-disc-inset`, `--kp-timer-disc-marks`, `--kp-timer-disc-ring`.

**The countdown** counts down in digits:

```html
<div class="kp-countdown" data-kp-countdown="3:00" data-kp-countdown-name="Tea"></div>
```

`attachCountdowns(root)` draws the name, the digits, one line for Paused or Time is up, and Start, "+1 min"
(`data-kp-countdown-step` sets the amount) and Reset. Every digit stands in a cell one `ch` wide and only the digits
that change are written, so the time never moves the layout, whatever the theme's face. The format is mm:ss, or
h:mm:ss once the timer holds an hour; it changes only on a press, never while it runs. The time shown is rounded up,
so 0:00 is the end; a minute more on a timer whose time is up starts it again. `countdownOf(el)` is its clock
(`start`, `pause`, `reset(seconds)`, `add(seconds)`, `remaining`, `state`); `parseDuration('1h30m')` and
`formatCountdown(ms, hours)` are the rules. Knobs: `--kp-countdown-size` (3rem), `--kp-countdown-ink`,
`--kp-countdown-ring`.

Both fire `kp-countdown-change` (`{ state, remaining, total }`, on a start, a pause, a reset or more time) and
`kp-countdown-end` (`{ total }`), and take `data-kp-…-disabled`. Their words are `timer…` (`timerStart`, `timerPause`,
`timerResume`, `timerReset`, `timerAddMinute`, `timerAddMinuteTitle`, `timerPaused`, `timerEnded`, `timerEndedNamed`,
`timerStarted`, `timerResumed`, `timerLeft`, `timerDuration`, `timerDiscLeft`, `timerUnderMinute`, `timerDiscCaption`).
The recipes app's named kitchen timers are their own component; they may run on `countdownClock()` too.

**Options of both timers** (attributes, read again when they change; the disc spells them `data-kp-timer-disc-…`, the
digits `data-kp-countdown-…`) [gaps-time-1019]:

| Attribute | Default | What it does |
| --- | --- | --- |
| `…-until="14:30"` | off | Counts down to a moment instead of for a length. `14:30` (or `14:30:15`) is the next such time on the device's clock (today when it is still ahead, else tomorrow), a date and time (`2026-10-20T09:00`) or epoch ms is that moment. The timer starts at once, has no controls (a moment does not wait) and counts anew when a sleeping tab comes back. A moment that has passed reads "Time is up". The disc's line says "until 14:30" (`timerUntil`), "until 20/10/2026 09:00" on another day. |
| `…-controls="none"` | all | Display only: Start, Pause, +1 min and Reset are not built, so they are not in the tab order either, and their row is not laid out. The page drives the clock with `timerDiscOf(el)` / `countdownOf(el)` (`start`, `pause`, `reset(seconds)`). |

The disc's caption follows the clock, so `timerDiscOf(el).reset(900)` from the page changes "Focus · 25 min" to
"Focus · 15 min", and the digits of a countdown take the hours format again when a `reset(seconds)` brings the timer back
to an hour or more. `parseUntil(value, now)` and `untilLabel(ms, now)` are the rules.

### A range of time

The window of a metrics page, as presets or a custom from–to:

```html
<div class="kp-range" data-kp-range="24h" data-kp-range-presets="1h 6h 24h 7d 30d" aria-label="Metrics range"></div>
```

`attachRanges(root)` (`js/range.js`, attached by `js/auto.js`) builds the presets as the package's segmented control
(a radio group, one tab stop, arrow keys) and a Custom… button, and under them one line that names the window exactly:
"Last 24 hours · 15/10/2026 14:05 – 16/10/2026 14:05" (rule 52, in Europe/Brussels unless `data-kp-time-zone` names
another zone). A preset is a length back from now: a number and `m`, `h`, `d` or `w`. Choosing one, or applying a
custom window, fires `kp-range-change` with `{ preset, start, end, label }`: the preset's key or null, the moments as
ISO strings, and the line.

Custom… opens a panel under the control on the theme's popover plate, with From and To, each the package's date picker
(dd/mm/yyyy, with its calendar) and a time (HH:MM, 24 hours; `1405` and `14.05` are read too), filled with the window in
force. Apply checks that both are whole, that the end comes after the start, that it is not in the future (unless
`data-kp-range-future`) and that it spans at most `data-kp-range-max-days`; what is wrong is said under the fields,
which are marked, and the panel stays. Cancel, Escape (after an open calendar) or a press outside closes it and keeps
the window. `data-kp-range-start` and `-end` start with a custom window, `data-kp-range-disabled` turns the picker off. `data-kp-range-custom="off"` makes it presets only: the Custom… button and the panel are not built, so they are not in the page or the tab order, and the window's name takes the whole line (a custom window from the markup or `setRange` is ignored).
Narrower than 26rem of its own, the presets take the whole line and Custom… stands under them beside the line.

From a script: `setRange(el, { preset: '7d' })` or `setRange(el, { start, end })` sets the window without the event,
and `rangeOf(el)` reads it. `presetMs`, `parseTime`, `rangeFaults` and `rangeMoment` are the rules. The words are
`range…` (`rangePresets`, `rangePresetName`, `rangePresetShort`, `rangeCustom`, `rangeCustomTitle`,
`rangeCustomName`, `rangeFrom`, `rangeTo`, `rangeDateLabel`, `rangeTimeLabel`, `rangeTimeHint`, `rangeApply`,
`rangeCancel`, `rangeLabel`, `rangeErrorDate`, `rangeErrorTime`, `rangeErrorOrder`, `rangeErrorFuture`,
`rangeErrorSpan`). Knobs: `--kp-range-gap`, `--kp-range-panel-width` (24rem), `--kp-range-time-width` (5.5rem).

### Before and after, with a divider

```html
<div class="kp-compare" data-kp-compare aria-label="Pressure chart, before and after">
    <div data-kp-compare-pane="before"><img src="before.png" width="1200" height="675" alt="The chart before" /></div>
    <div data-kp-compare-pane="after"><img src="after.png" width="1200" height="675" alt="The chart after" /></div>
</div>
```

`attachCompares(root)` (`js/compare.js`, attached by `js/auto.js`) lays the two panes on top of each other and shows
the before pane on the start side of a divider and the after pane on the end side (each cut by `clip-path`, so a pane
is only hit where it shows). The divider is a slider: drag its handle, or use the arrow keys (1%, with Shift 10%), Page
Up and Down (10%), Home (all after) and End (all before). On images a press anywhere moves the divider there, gliding in
the theme's own time, and a drag follows at once; on live HTML panes (a pane holding a link, a button or a field) only
the handle drags, so the panes stay usable (`data-kp-compare-drag` sets either). The labels are "Before" and "After",
or `data-kp-compare-before` and `-after`, and step aside while the divider covers them.

Give images their width and height, or the box `data-kp-compare-ratio="16/9"`, so the box has its size from the
first frame; while an image loads the theme's skeleton covers the box, and an image that fails says so in its pane.
`data-kp-compare-position` is where the divider starts (50), `setCompare(el, position)` moves it from a script, and
`kp-compare-change` (`{ position }`) says where a person moved it. `compareKey` is the key rule. The words are
`compareBefore`, `compareAfter`, `compareSlider`, `compareValue` and `compareFailed`. Knobs: `--kp-compare-ratio`,
`--kp-compare-line` (2px), `--kp-compare-handle` (2.25rem), `--kp-compare-ink` (--primary).

### Days of the week and of the month

The days a schedule runs on, as chips with a line in words under them:

```html
<div class="kp-weekdays" data-kp-weekdays data-kp-value="1,4" aria-label="Run on"></div>
```

`attachWeekdays(root)` (`js/weekdays.js`, attached by `js/auto.js`) builds the package's chip group in `multi` mode: seven chips of
one width, the week starting where the locale's week starts (Monday for nl-BE and en-GB; `data-kp-week-starts-on` says it
outright), the quick picks Weekdays, Weekend and Every day, and a line in words ("Mon and Thu", "Every weekday"). All seven
days is a real choice, so the group never falls back to "All". `data-kp-days="month"` draws 1 to 31 and Last; `data-kp-min`
(1) is the fewest days a schedule needs, and below it the group says so under the chips and in `aria-describedby`. A value is
a list of numbers (0 is Sunday) or names. `kp-weekdays-change` carries `{ values, summary, valid }`; `setWeekdays(el, values)`
sets the days without the event, `weekdaysOf(el)` reads them. The words are `weekdays…` in the dictionary. Knobs:
`--kp-weekdays-gap`, `--kp-weekdays-max` (32rem), `--kp-weekdays-chip-height` (2.5rem).
### The next times of a schedule

Under a repetition, the times it will really run:

```html
<div class="kp-runs" data-kp-runs data-kp-runs-count="3"></div>
```

The page works out the times (it owns the rule); `setRuns(el, times, { reason })` draws them (`js/runs.js`, attached by `js/auto.js`).
A time is a number of ms, an ISO string or a Date, or `{ at, conflict }` with a sentence the page words. Each row shows the time
with its weekday in rule 52, in Europe/Brussels unless `data-kp-time-zone` says otherwise, how far away it is ("in 12 h 55 min",
"in 2 days"; `data-kp-runs-relative="false"` leaves it out) and an amber mark where the clock is turned before the run
("Clock goes back 1 h") or a conflict is named (`data-kp-runs-warn="false"` leaves the marks out). `data-kp-runs-more="10"` adds
"Show 10 more" for times past the count. No times is the empty state with `reason` ("Pick a time") centred at heading size;
`setRunsState(el, 'loading')` lays the busy card over placeholder rows and `'error'` shows the alert with Try again, which fires
`kp-runs-retry`; every state keeps the height of `count` rows. A fixed clock, `data-kp-now="2026-10-17T14:05:00+02:00"`, is
for a demo or a test. The words are `runs…` in the dictionary. Knobs: `--kp-runs-row` (2.75rem), `--kp-runs-pad`, `--kp-runs-gap`.
### Remind me later

Put a reminder off with a few quick choices, each over the exact moment it means:

```html
<div class="kp-snooze" data-kp-snooze data-kp-snooze-choices="1h 4h tonight tomorrow monday pick"></div>
```

`attachSnoozes(root)` (`js/snooze.js`, attached by `js/auto.js`) builds a button that opens the package's rich menu, or with
`data-kp-look="chips"` a row of chips. The default choices are the mix Kenny chose: in 1 hour, in 4 hours, this evening
(`data-kp-snooze-evening`, 18:00), tomorrow (`data-kp-snooze-morning`, 09:00), Monday and a date and time of your own; any
length in m, h, d or w and `next-week` work too. Each shows the exact moment, "Sun 18/10/2026 09:00 · in 18 h 55 min"
(Europe/Brussels unless `data-kp-time-zone`). A choice that has passed is left out, as is one past `data-kp-snooze-max` (7d).
A choice fires `kp-snooze` with `{ until, choice }` (an ISO moment); the page stores it and calls
`setSnoozedUntil(el, iso)` to show "Snoozed until …" with End snooze (`kp-snooze-end`), and `setSnoozeBusy(el, true)` while it
saves. `snoozeChoices({ now, … })` is the same list as a pure function, for a server or a test. The words are `snooze…`.
### Options with a date and an age

A choice of snapshots, backups or versions, where every option carries its moment:

```html
<div class="kp-dated" data-kp-dated aria-label="Snapshot to restore"></div>
```

The page hands over the options, `setDatedOptions(el, [{ value, when, meta, label?, disabled? }])` (`js/dated-options.js`, attached by
`js/auto.js`). `when` (ISO, ms or a Date) is the moment: the component writes "3 days ago" and the date in rule 52 (Europe/Brussels);
`meta` is a short text the page has formatted (`formatBytes`); `label` names the option (the date stands in without it); `disabled`
is the sentence that says why it cannot be chosen. Up to `data-kp-picker-inline-max` (7) options draw as radio rows of one group,
the meta in one column; beyond that a search field and a list of the same two lines (`data-kp-picker="radio"` or `"combobox"`
forces one). The newest is ordered first, labelled Latest (`data-kp-latest="none"`) and chosen (`data-kp-preselect="false"`);
`data-kp-order` is `newest`, `oldest` or `given`. Typing letters on the rows chooses the option whose name starts with them.
`kp-dated-change` carries `{ value, option }`; `datedValue(el)` reads the choice and the radios carry `data-kp-name` for a form.
States: `setDatedState(el, 'loading')` lays the busy card over placeholder rows, `'empty'` shows the page's `reason` and `action`
centred, `'error'` the alert whose Try again fires `kp-dated-retry`; each keeps the height the picker had (`data-kp-rows` says how many
rows the first load keeps). The words are `dated…`. Knobs: `--kp-dated-row` (3.5rem), `--kp-dated-gap`.
### A form that reads as a sentence

"Run [backup] on [nextcloud] every [week] at [03:00]": the fields stand inside the words.

```html
<fieldset class="kp-sentence" data-kp-sentence>
    <p class="kp-sentence__text">
        Run <span class="kp-sentence__field"><select name="job" aria-label="What to run">…</select></span>
        at <span class="kp-sentence__field"><input name="at" size="5" value="03:00" aria-label="At (HH:MM)" /></span>.
    </p>
</fieldset>
```

`attachSentences(root)` (`js/sentence.js`, attached by `js/auto.js`) keeps every field's own behaviour and draws it inline: an
underline in the primary colour in semibold (`data-kp-look="boxed"` draws a small box; `data-kp-sentence-size="md"` makes the
text 1rem). The sentence wraps like text; a field whose natural width is more than 70 % of the line (`data-kp-own-line-ratio`)
takes a line of its own, the full width (`data-kp-narrow="stack"` does it for every field below 30rem, `flow` never;
`data-kp-block` on a field always). `data-kp-show-when="how=once"` on a phrase shows it only then (a comma lists values) and
takes its controls out of reach. Give every control an `aria-label` (the words round it are not its label): a status region says
the whole sentence ("Run backup on nextcloud every week at 03:00.") after a change, `sentenceSummary(el)` reads the same text, and
`kp-sentence-change` carries it. Enter in the last field submits the form. `setSentenceInvalid(el, 'at', why)` underlines a control
in red and writes the line under the sentence that names it; `setSentenceFieldState(field, 'loading')` shows the field's own
skeleton at the width it had; `disabled` on the fieldset with `data-kp-disabled-reason` says why it is off. The words are
`sentence…`. Knobs: `--kp-sentence-size`, `--kp-sentence-line`, `--kp-sentence-edge`.
### A slider

One value, or a range with two thumbs, with the number in a box you can type in:

```html
<div class="kp-slider" data-kp-slider data-kp-min="10" data-kp-max="30" data-kp-step="0.5" data-kp-value="21" data-kp-unit="°C" aria-label="Temperature"></div>
```

`attachSliders(root)` (`js/slider.js`, attached by `js/auto.js`) builds the track around the native `input[type=range]` (or around the one or
two you wrote yourself), which keeps the keyboard, the screen reader and the touch: the arrows step, Shift with an arrow steps ten
times as far, Page Up and Page Down a tenth of the range, Home and End the ends; `aria-valuetext` says "21 °C". `data-kp-slider="range"`
is two thumbs (`data-kp-value="20,60"`) that never come closer than `data-kp-min-gap`. The box beside the track shows the number
(`data-kp-slider-value`: `field`, `bubble`, `both` or `none`); a typed value is read on Enter or when the box loses the focus, snapped
to the step, and refused with a line under the slider if it is not a number in range, while the thumb keeps its last good value. `data-kp-format` is `number`, `percent`,
`bytes` or `duration` (the value is seconds; the box is then a readout). `data-kp-ticks="auto"` or `"0,25,50:Half,100"` marks the track,
`data-kp-default` is what a double-click on a thumb goes back to, `data-kp-commit="input"` makes `kp-slider-change` fire on every move instead of
on release. `kp-slider-input` and `kp-slider-change` carry `{ values, value, thumb, text }`; `setSliderValues(el, [..])` sets without an event;
`setSliderState(el, 'loading')` shows the skeleton. The words are `slider…`. Knobs: `--kp-slider-thumb` (2.75rem), `--kp-slider-rail`, `--kp-slider-fill`.
### Unsaved changes

A bar that says "2 changes", offers Save and Discard, and warns on leaving, in the page header and, once the header is scrolled away, at the foot of the screen:

```html
<div class="kp-page-header__actions">
    <div class="kp-unsaved" data-kp-unsaved data-kp-unsaved-for="#settings" data-kp-name="settings"></div>
</div>
```

`attachUnsaved(root)` (`js/unsaved.js`, attached by `js/auto.js`) watches the form (or the area `data-kp-unsaved-for` names) and counts the rows marked
`data-kp-changed` (`.kp-formrow`, `.kp-kv__row`, or any `[data-kp-row]`); it marks them itself as the form is edited, against the values
the markup carries (`value`, `checked`, `selected` as written; `data-kp-track="app"` leaves the marking to the page). Call `markUnsavedClean(el)` after your own
script has loaded values into the form. The chip opens the list `key old → new` with a Revert for each change; a password or a `[data-kp-secret]` shows `••••••`.
Save fires the cancelable `kp-unsaved-save` with `{ changes }` and puts the spinner in the button; answer with
`unsavedSaved(el, { refused: { 'http.port': 'The port is already used.' } })`: what went through stops counting, what was refused stays marked and the bar says why.
Discard puts every value back and offers Undo for `data-kp-undo-ms` (6000, 0 for none). Ctrl or Cmd+S saves. `data-kp-warn-leave` (`both`) asks before the tab closes and
before a link leaves the page (`kp-unsaved-leave`, cancelable, then the package's confirmation). `data-kp-keep="session"` keeps the changes through a reload
(never `[type=password], [data-kp-secret]`, or what `data-kp-keep-exclude` names) and says so in a toast. `data-kp-placement` is `header+sticky` (default), `header` or
`sticky-bottom`; for a page that scrolls inside a box use `data-kp-dock="container"` and `data-kp-scroll-root="#box"`. The words are `unsaved…`.
Knobs: `--kp-unsaved-dock-width`, `--kp-unsaved-dock-offset`, `--kp-unsaved-save-min`.
### Pictures, documents, links and text [kpadopt6-media]

A growing text box, link anchors, a gallery, a document preview, a map of what is used by what and lists that print well. Each is an opt-in attribute or a script call; nothing that exists changes.

```html
<textarea class="kp-field__input kp-field__input--multiline" rows="3" data-kp-autosize data-kp-counter="chars" maxlength="4000"></textarea>
<main data-kp-anchors="both">…</main>
<div class="kp-gallery" data-kp-gallery aria-label="Photos"></div>
<button class="kp-button" data-kp-preview="files/cv.pdf" data-kp-preview-page="2">Preview</button>
<div class="kp-matrix" data-kp-matrix data-kp-view="lines" aria-label="What uses what"></div>
<div class="kp-checklist" data-kp-checklist data-kp-print-title="Packing list"></div>
```

`data-kp-autosize` makes the field as tall as its text between its `rows` and 20 lines (`data-kp-autosize-max`), then it scrolls inside; `data-kp-counter` and `maxlength` give an exact count, `setAutosizeState(el, 'loading' | 'error', sentence)` the other states. `data-kp-anchors` puts a `#` beside headings of levels 2 and 3 and beside rows that carry `data-kp-anchor="<their own id>"`: it shows on hover or keyboard focus (always on a phone), a press copies the link and says "Copied", and opening a link marks the place for two seconds. A link to a row that is not there says "That item is no longer here" after about a second (`data-kp-anchor-wait` is the longest wait, 10 s by default, `0` says it at once; the wait goes on only while something in an anchored container is loading or changing). The `y l` key is listed once on the shortcut sheet however many containers there are. Under a `.kp-formgrid` a row's mark stands at the end of its label cell and a group heading's mark at the grid's end edge [anchors-picker-1019]. `setGallery(el, { items })` draws the grid; a press opens the lightbox (arrows stop at the end, `data-kp-lightbox-loop="on"` wraps), and `openViewer()` is the shell it and the preview share. `data-kp-preview` opens a file in the viewer with Open in a new tab and Download always in the foot; `.kp-docglyph[data-kp-doc-kind]` is the page icon. `setMatrix(el, { view: 'lines', rows, columns, cell })` draws the relation as two columns joined by lines, under 640 px as cards with chips. Ctrl+P on a page with a checklist prints black on white with drawn boxes (`data-kp-print-done` show, hide or strike); `js/print.js` adds the date and the sentence for a list that has no rows. The words are `autosize…`, `anchor…`, `gallery…`, `viewer…`, `preview…`, `uses…` and `print…`.

### A star rating

Five whole stars to give something a score, and the same row read only to show one:

```html
<div class="kp-rating" data-kp-rating data-kp-rating-for="Lasagne" data-kp-rating-labels="Not for me|Okay|Good|Great|Make again"></div>
<div class="kp-rating" data-kp-rating data-kp-rating-mode="display" data-kp-rating-for="Lasagne" data-kp-rating-value="4.5" data-kp-rating-count="12"></div>
```

`attachRatings(root)` (`js/rating.js`, attached by `js/auto.js`) draws the stars. The input is a radio group named "Rating for Lasagne" with one tab stop: the arrows
move and choose, Home and End go to the ends, Backspace or Delete (or the chosen star pressed again, or the small Clear on a mouse) removes the rating; no digit keys
(they need Shift on AZERTY). `0` is "not rated", which an empty row says in words (`data-kp-rating-unrated-text`, "Not rated yet"), never as a zero score. `data-kp-rating-max` is 3 to 10 (5),
`data-kp-rating-step="0.5"` turns the row into one slider that steps by a half, `data-kp-rating-size` is `sm`, `md` or `lg`, `data-kp-rating-labels` gives one word per level for the caption.
`kp-rating-change` carries `{ value, previous, source, wait }` and is cancelable; `event.detail.wait(promise)` hands over a save: the row is busy, and a rejection puts the
previous value back and says so under the row for `data-kp-flash-error-ms` (3000). A change offers Undo for `data-kp-undo-ms` (6000, 0 for none).
`data-kp-rating-commit="confirm"` holds a tap until Save rating. `data-kp-readonly` is a viewer; `data-kp-disabled` with `data-kp-disabled-reason` is a lock, and the sentence is
shown under the row. `setRatingState(el, 'loading' | 'error' | 'ready')`: loading keeps the stars as dashed outlines, error puts one plate of the same size over them
(`kp-rating-retry`). A table cell: `ratingCell(td, 4, { count: 12 })` draws the display row and writes `data-kp-sort-value` for the data table. The words are `rating…`.
Knobs: `--kp-rating-star`, `--kp-rating-hit`, `--kp-rating-ink`, `--kp-rating-empty`, `--kp-rating-stroke`, `--kp-rating-gap`.
### A quote card

Your own earlier words, word for word, with who wrote them and when:

```html
<figure class="kp-quote" data-kp-quote data-kp-quote-date="2026-10-14T19:40:00+02:00" data-kp-quote-lang="nl" data-kp-quote-why="What helped last time">
    <blockquote>Wandelen na het eten hielp, mijn hoofd werd rustiger.</blockquote>
</figure>
```

`attachQuotes(root)` (`js/quote.js`, attached by `js/auto.js`) builds a `.kp-card` around it (`figure` > `blockquote` > `figcaption` with a `time` whose title is the exact `dd/mm/yyyy HH:mm`).
It only shows: choosing which words to show, and never a negative one on a rough day, is the application's job. `data-kp-quote-date-style` is `both` ("Wednesday 14/10/2026 (3 days ago)", default), `date` or `relative`;
`data-kp-quote-lines` (4, or `all`) folds a long entry behind Show all with the whole text still in the page; `data-kp-quote-source` adds "Open that day"; `data-kp-quote-copy` shows Copy;
`data-kp-quote-size="lg"` is a hero place; `data-kp-quote-lang` makes a screen reader pronounce the words right. "Do not show this again" hides the card at once and offers Undo for `data-kp-undo-ms` (6000);
when the window passes `kp-quote-hide` fires with `{ text, wait }` (call `wait(promise)` for a save: a refusal puts the card back and the toast says why). Keys while the focus is in the card: `h` hides, Mod C copies. `setQuoteState(el, 'loading' | 'empty' | 'error' | 'ready')`
uses the card's four states (`kp-quote-retry`). A `data-kp-quote-list` holds several quotes: the first `data-kp-quote-max` (3) and "Show all 7". The words are `quote…`. Knobs: `--kp-quote-rule`, `--kp-quote-mark-size`, `--kp-quote-min`, `--kp-glyph-quote`.
### A calm today card

A card with one row per thing in the day, each only open, done or paused since a date, with no red and no tally:

```html
<section class="kp-card" data-kp-state="ready" aria-labelledby="today-t">
    <div class="kp-card__header"><h3 class="kp-card__title" id="today-t">Today</h3></div>
    <div class="kp-card__stage"><div class="kp-card__data">
        <ul class="kp-statuslist kp-statuslist--rows" aria-label="Today" data-kp-status-vocab="calm">
            <li class="kp-statusrow" data-state="paused" data-kp-since="2026-10-03" data-kp-status-id="move">
                <span class="kp-statusrow__mark" aria-hidden="true"></span>
                <span class="kp-statusrow__body"><span class="kp-statusrow__label">Movement</span><span class="kp-statusrow__detail"></span></span>
            </li>
        </ul>
    </div></div>
</section>
```

`data-kp-status-vocab="calm"` on a status list (`js/statusrow.js`) gives `open`, `done`, `paused` and `unknown` (and `loading`), each with its own glyph. `done` is the info pair, never success green; `unknown` is for a thing that reports
"ok" with no data (a plant whose soil sensor is dead) and is never drawn as done. A row told `failed`, `warn` or anything else is drawn as `unknown` and the console says so, so a red cannot slip in. A paused row says
"Paused since 03/10/2026 (2 weeks)" from `data-kp-since` (`data-kp-today-since`: `both` by default, `date` or `relative`) and offers Resume (`data-kp-today-resume="off"` leaves it out; `data-kp-resume-reason` on the row disables it and says why):
`kp-status-resume` fires (cancelable), the row is open, and a toast offers Undo for `data-kp-undo-ms` that puts it back paused with its original date (`kp-status-undo`). `data-kp-today-pause` adds Pause on open rows. `data-kp-today-order="open-first"`
orders once at attach and never again; `data-kp-today-paused="fold"` with `data-kp-today-fold-after` (30) gathers long pauses into one line (`settleToday(list)` does it again). Keys while the focus is in the list: ArrowUp and ArrowDown, `r` resumes.
`setTodayState(card, 'loading' | 'empty' | 'error' | 'ready')` brings the card's loading card, "Nothing planned today" over "That is fine, nothing is waiting", and a blame-free failure with a normal-size Retry. "As of 14:02" for a card fed from
outside is the existing freshness line (`data-kp-ago`). There is no summary line by design. The words are `status…` (`statusOpen`, `statusSinceDate`, `statusTodayEmptyTitle`). Knobs: `--kp-today-row-min`, `--kp-glyph-open`, `--kp-glyph-paused`, `--kp-glyph-unknown`.
### Calm tones: a day with nothing logged is quiet

For a tracker of a person (movement, mood, sleep, watering), not a machine:

```html
<section class="kp-calendar" data-kp-calendar data-kp-tones="calm" data-kp-paused-range="2026-10-03/2026-10-14" aria-label="Movement"></section>
```

`data-kp-tones="calm"` on a calendar, a heat grid (`.kp-heat`) or an uptime strip (`.kp-uptime`) swaps the tones `ok`, `warn` and `bad` for `logged` (the theme's accent, `--primary`; `data-kp-logged-fill="success"` asks for the success plate),
`quiet` (nothing logged: lighter than `muted`, no border, no glyph, never a count, never the word "missed") and `paused` (hatched, from `data-kp-paused-range="from/to"`); `future`, `before` and `loading` are shared. A page that hands over
`ok` becomes logged and anything else quiet, with one console warning per foreign tone (`data-kp-calm-map="none"` passes tones through). A quiet cell keeps an accessible name, "14/10/2026: nothing logged"
(`data-kp-quiet-words="none"` leaves the words out) and is still a 44 px target, since adding a missing entry is allowed. The calendar prints a day's count only on a logged day, draws a legend Logged, Nothing logged, Paused (`data-kp-legend="hide"`),
keeps its six rows under a centred plate over a month with nothing logged ("Nothing logged this month", "That is fine, it starts whenever you do") and dims a failed month under one with Retry (`kp-calendar-retry`); `setCalendarCaption(el, text)` writes the page's own sentence under the grid.
The uptime strip maps `up` and `degraded` to logged and `down` to quiet, says "nothing logged" in its tooltip and sums up as "21 of 28 days logged", with no incident count. The helpers are in `js/calm-tones.js` (`calmTone`, `calmWord`, `inPausedRange`, `isCalmTones`).
The standard tones stay the default: a missed backup is a fault. The words are `calm…`. Knobs: `--kp-logged-fill`, `--kp-logged-ink`, `--kp-quiet-fill`, `--kp-quiet-ink`.
### Answering one question per screen

The one-step view (`data-kp-focus-steps`, cook mode) in answer mode, for a daily check-in: one question large, big answer buttons, "Same as yesterday: Matig", "Same as usual: Good" and Not today:

```js
setFocusSteps(el, [
    { text: 'How is your mood today?', answer: { id: 'mood', kind: 'choice', previous: 'matig', usual: 'good',
        choices: [{ value: 'rough', label: 'Rough' }, { value: 'matig', label: 'Matig' }, { value: 'good', label: 'Good' }] } },
]);
el.addEventListener('kp-focus-steps-answer', (e) => save(e.detail)); // { index, id, value, source, same?, previous }
el.addEventListener('kp-focus-steps-done', (e) => post(e.detail.answers)); // { total, answers, startedAt, finishedAt }
```

A step with `answer` is a question; a step without stays a reading step, so one flow can mix them (`data-kp-focus-mode="answer"` also draws the empty, failed and save-failed states as centred plates). `kind` is `choice` (a tap picks and the flow moves on after `data-kp-advance-ms`, 350),
`multi` (taps, then Next) or `text` (a box; Next saves). Every option is an attribute and redraws the view when changed: `data-kp-advance` (`auto`, `button`), `data-kp-same` (`both`, `yesterday`, `usual`, `off`), `data-kp-skip`, `data-kp-pinned-first`
(JSON, "Nothing to log" and "Not sure" first), `data-kp-back`, `data-kp-choice-layout` (`auto`, `stack`, `row`), `data-kp-choice-height` (`lg`, `md`), `data-kp-progress` (`count`, `off`), `data-kp-summary` (`on`),
`data-kp-resume` (`auto`, `ask`, `off`) with `data-kp-remember="checkin"` and `data-kp-resume-until` (`midnight`, `hours:N`, `never`). The screen is not kept on and Read aloud is off in answer mode. `kp-focus-steps-before-answer` is cancelable.
`setFocusStepsState(el, 'save-error')` keeps the answers and says "Could not save your answers" with Try again (`kp-focus-steps-save-retry`). Keys while the focus is in the view: ArrowUp and ArrowDown, Enter, `s` (same as yesterday), `u` (usual), `n` (Not today).

**Resume, and the empty plate's action** [gaps-time-1019]. With `data-kp-remember="<name>"` the place is kept in cook mode as well as in
answer mode and put back after a reload (`data-kp-resume` `auto`, `ask` or `off`, `data-kp-resume-until`): the active step,
the place on every track, the active track and the steps passed, so a recipe with two tracks comes back as it was left, not on one step
with everything else undone. `kp-focus-steps-resume` carries `{ index, answers, track, done }`. A stored place is only used for the
same steps (a key made of their ids or titles); a changed recipe starts at the top. A running timer is not part of it, and the place
is forgotten when the flow is done. `data-kp-focus-steps-empty-action="Add a recipe"` puts a normal-size button on the empty plate
(read mode and answer mode) that fires `kp-focus-steps-empty-action` on the root, like Retry on the failed plate; it and
`data-kp-focus-steps-empty` are read again when they change.
The words are `focus…`. Knobs: `--kp-focus-answer-min`, `--kp-focus-answer-gap`.
### A picker with the usual on top

The combobox with the choices a person uses most standing first, the rest alphabetical below, and a guard against a near-duplicate name:

```html
<div class="kp-combobox" data-kp-combobox data-kp-usual='["headache","fatigue"]' data-kp-add="inline" data-kp-multiple>
    <input class="kp-combobox__input" type="text" role="combobox" aria-expanded="false" aria-controls="sym-list" aria-label="Symptom" />
    <ul class="kp-combobox__list" id="sym-list" role="listbox" hidden>
        <li class="kp-combobox__option" role="option" data-kp-option data-value="headache">Headache</li>
    </ul>
    <p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
```

`attachUsualPickers(root)` (`js/usual-picker.js`, attached by `js/auto.js`) stands on the combobox and attaches it itself (a box with `data-kp-usual` is skipped by `attachComboboxes` until it is ready). The band is `data-kp-usual` (a comma list, a JSON array, or `{ value, uses }` with
`data-kp-usual-source="counts"`), `data-kp-usual-max` 1 to 7 (5); it is given by the app and changes slowly, never per tap (`setUsual(el, values)`). `data-kp-pinned` JSON puts "Nothing to log" and "Not sure" first, never usual. More than 12 items fold behind "Show all 38" (the exact number;
`data-kp-all="open"` never folds; `data-kp-remember` keeps it). `data-kp-usual-while-typing` is `first` (the usual choices that match still lead) or `hide`. `data-kp-multiple` is the combobox's tag mode; `data-kp-preselect="usual"` pre-ticks the band; `data-kp-not-today` gives a ticked item a one-tap
"Not today", distinct from unset (`usualNotToday(el)`). `data-kp-add="inline"` adds a typed name at the point of use with Undo; `kp-usual-add` is cancelable (the app keeps the vocabulary). A name identical after case, accents and spacing selects the existing item; a near one (`data-kp-near` `ask`,
`select` or `off`, `data-kp-near-threshold` 0.8, `data-kp-near-max` 3) offers "Did you mean Hoofdpijn?" and always "Add 'hoofdpjn' as new". `data-kp-state="loading" | "empty" | "error"` (`setUsualState`) draws the busy card, a plate with Add, or a plate with Retry (`kp-usual-retry`) in the place of the list.
Every attribute redraws the picker when changed. Alt U jumps to the first usual choice (a bare `u` would take the first letter of a name; it is on the `?` sheet; no digit keys). `kp-usual-pick` carries `{ value, from }`. The words are `usual…`. Knobs: `--kp-usual-option-min`, `--kp-usual-panel-min`.

Every behaviour of the picker is an option with a default, never a choice made for you (Kenny, 2026-10-17): the usual band **leads** while typing (`data-kp-usual-while-typing="hide"` steps it aside), a near name **asks** "Did you mean ...?" (`data-kp-near="select"` takes the closest at once, `off` turns the guard off), the full list stays **behind "Show all N"** (`data-kp-all="open"` shows it fully), the rest is **alphabetical** (`data-kp-order="given"`), the band holds **5** (`data-kp-usual-max`), "Not today" and adding a typed name are **opt-in** (`data-kp-not-today`, `data-kp-add="inline"`). Each is also settable at run time; the picker redraws.

### Who can come (availability grid)

`setAvailability(el, spec)` (`js/availability.js`) turns the heat grid into a grid people edit: each person answers on their own row (press a cell: empty, can, maybe, cannot), the column everybody can is ringed and starred, "Choose these dates" fires `kp-availability-choose`. Every behaviour is an attribute with a default, and changing one redraws the grid:

- `data-kp-availability-best`: `most` (default: the column with most who can, once everybody answered), `everyone` (only a column where everybody can) or `none`; `data-kp-availability-best-rule` `yes-count` (default) or `no-nobody` (fewest who cannot first); `data-kp-availability-quorum` how many must answer (default everybody).
- `data-kp-availability-press`: `menu` (default: a press opens the answers) or `cycle`; `data-kp-availability-answers`: `3` (default) or `2`; `data-kp-availability-paint`: `false` turns the drag across a row off.
- `data-kp-availability-summary`: `both` (number and fill, default), `count` or `bar`.
- `data-kp-availability-unit-switch`: `on` or `off` shows or hides the organiser's periods/days switch per trip (absent: the spec's `canSwitchUnit` decides); the spec carries both sets in `sets`.
- `data-kp-heat-edit` (`own`, `all`, `off`), `data-kp-availability-sort`, `-narrow`, `-density`, `-choose`, `-locked`, `-window`.

### Toggle button

A button that stays pressed until it is pressed again, for a filter, a pin or a follow. The state is `aria-pressed`; the words never change:

```html
<button class="kp-button" type="button" data-kp-toggle aria-pressed="false">Only errors</button>

<div class="kp-toggles" role="group" aria-label="Level" data-kp-toggle-group="level" data-kp-toggle-clear>
    <button class="kp-button" type="button" data-kp-toggle data-kp-toggle-all data-kp-look="chip" aria-pressed="true" data-kp-count="138">All</button>
    <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-count="12">Error</button>
</div>
```

`attachToggles(root)` (`js/toggle.js`, attached by `js/auto.js`) flips `aria-pressed`, keeps a group coherent and fires the cancelable `kp-toggle`
(`{ button, pressed, previous, group, pressedKeys, wait }`) before anything changes, then `kp-toggle-changed`. `data-kp-toggle-mode` on the group is
`multi` (default), `single` (one is always on, the arrow keys walk) or `single-or-none`; `data-kp-toggle-all` marks the All chip, on while nothing else is;
`data-kp-toggle-clear` adds "Clear filters (N)", which keeps its place when idle. `data-kp-count` is the exact number beside the words (`loading` is a
skeleton, never 0), `data-kp-pressed-hint` a line under them while on, `data-kp-pressed-mark="check"` a tick whose room is kept, `data-kp-look` `button`,
`chip` or `icon`. `data-kp-toggle-key` presses it from the keyboard through the shortcut sheet (never a bare digit). When the change takes time call
`detail.wait(promise)` from `kp-toggle`: the theme's spinner covers the words, and a rejection puts the state back and shows "Refused" on the button for 3 s.
`toggle(el).set(true|false|'mixed')`, `.setCount(n)` and `.setHint(text)` drive it from script. Every press is announced once, politely. The words are `toggle…`.
Knobs: `--kp-toggle-on`, `--kp-toggle-on-ink`, `--kp-toggle-count-size`, `--kp-toggle-hit`.

### The palette finds words in any order

Every command palette matches by words now (`data-kp-match="intent"`, the default; Kenny, 2026-10-17): each typed word has to start a word of the command, in any order, so
"jellyfin upd", "upd jellyfin" and "update jelly" all find "Update jellyfin" while "read" still does not find "Report an incident". The older matchers stay one attribute away
(`data-kp-match="substring" | "prefix" | "subsequence"`).

```html
<dialog class="kp-palette" data-kp-palette data-kp-context="jellyfin" data-kp-subject-name="stack">
    …
    <li class="kp-palette__option" role="option" data-kp-option data-value="update-jellyfin" data-kp-verb="Update" data-kp-context-of="jellyfin"
        data-kp-words="upgrade pull">Update jellyfin<span class="kp-palette__description">Pull the newest image</span></li>
</dialog>
```

The best answer comes first in its group and the matched words are marked (`.kp-palette__mark`; `data-kp-highlight="off"` keeps them plain). A description (`.kp-palette__description`, or `data-kp-hint`)
and `data-kp-words` (never shown) count as a weaker match than the label. Letters match without their accents and a hyphenated word is also found by its parts
(`data-kp-fold-diacritics="off"`, `data-kp-split-hyphen="off"`); `data-kp-typo="1"` also finds a word one letter off. Before anything is typed a palette that marks commands
`data-kp-featured`, `data-kp-context-of` the open subject (`data-kp-context` on the palette) or run last (`data-kp-recent="5"`) shows only those, the open subject's first; a palette
with none of those shows every command. At most `data-kp-max-shown` (40) rows show and the status line says "40 of 112 shown, type more words". A query nothing answers is the empty plate in the
list's footprint; when the first word is a verb the palette knows (`data-kp-verb`) it names what the verb works on. `palette(el).setState('loading')` lays the busy card over the list,
`setState('error')` shows the failed plate with Retry (`kp-palette-retry`) above the commands marked `data-kp-static`. A consumer that draws its own list uses `rankCommands(commands, query, { context })`
from `js/intent.js`; the React `CommandPalette` takes `match="intent"` (its default) and a `words` field on a command.

### The version jump chip

A chip that shows a version moving, "10.11 → 12.1", with the old version struck and lighter, the new one strong, and a big jump named in words:

```html
<span class="kp-badge kp-badge--version" data-kp-version-from="10.11.11" data-kp-version-to="12.1" data-kp-version-href="https://example.com/releases/tag/{to}"></span>
```

`attachVersionDeltas(root)` (`js/version-delta.js`, attached by `js/auto.js`) draws it and redraws it when an attribute changes. A jump is big when the **first number** differs (Kenny, 2026-10-17), plus
the second number for the apps in `data-kp-version-big-minor` ("jellyfin immich", on the chip or anything above it; the chip names its app in `data-kp-version-app`); a big jump takes the warning tone, the word "major"
and a "!" in a ring, a version that went back the destructive tone and "older"; the rest stays plain. A version with no number is never called big. `data-kp-version-scheme` is `numbers` (default), `semver`, `calver` or `none`;
`-show` is `both`, `to` or `level` (the word alone); `-tones` maps levels to tones; `data-kp-state` is `loading`, `error` or `empty`. The chip carries `data-kp-level` and `data-kp-sort-value` (4 older, 3 major, 2 minor, 1 patch, 0 other)
for a data table to sort on. `summarizeDeltas(list)` counts a list exactly for its heading; `versionLevel`, `versionNumbers` and `releaseUrl(upstream, tag)` are the pure parts. Shift+click copies "10.11 → 12.1" (`kp-version-copy`).
The words are `version…`.

### The acknowledge gate

A warning that holds a button back until a box is ticked ("I read the release notes of 12.1"). The button says why it is off, and a press on it moves the focus to the first open box:

```html
<div class="kp-alert kp-alert--warning" data-kp-ack data-kp-ack-for="#update" data-kp-ack-key="jellyfin" data-kp-ack-label="I read the release notes of 12.1" data-kp-ack-link="https://example.com/notes">
    <div class="kp-alert__body"><strong>jellyfin 10.11 → 12.1 is a major version.</strong> A major release can change its settings or move its data.</div>
</div>
<button class="kp-button kp-button--primary" id="update">Update</button>
```

`attachAckGates(root)` (`js/ack-gate.js`, attached by `js/auto.js`) adds the link and the tick, puts `aria-disabled` and `data-kp-disabled-reason` on the control while any gate that guards it is open ("Tick … first", or "2 of 3 release notes still to read"), and fires
`kp-ack-change` (`{ key, checked, remaining, at }`) on the gate; the change is announced once. `data-kp-ack-mode` is `each` (default, one tick per gate) or `all`; a changed `data-kp-ack-key`, `-label` or `-version` clears the tick unless
`data-kp-ack-reset="never"`; `data-kp-ack-require-link` and `-min-ms` hold the tick back until the notes were opened; `data-kp-state` is `loading`, `error` (with Retry on `data-kp-ack-retry`, event `kp-ack-retry`) or `empty` (hidden, the control on).
`ackGate(el)` gives `set`, `setState`, `setLocked` (the tick locked while the job runs) and `remaining`. The gate is a human guard: keep the server's own check. The words are `ack…`.

### The dependency list

Rows "A → B" that say what needs what, numbered in the order things must go (Kenny, 2026-10-17: "Ja, met nummers"):

```html
<div class="kp-deplist" data-kp-deplist id="who" data-kp-dep-heading="{n} stacks reach these apps"></div>
```

```js
import { setDeplist } from '@kp-soft/themes/js/deplist';
setDeplist(document.getElementById('who'), [{ from: 'paperless', to: 'postgres' }, { from: 'immich', to: 'paperless', state: 'running' }]);
```

`attachDeplists(root)` (`js/deplist.js`, attached by `js/auto.js`) draws the rows from `setDeplist(el, items)` or `deplist(el).set(items)`: one fixed grid per row (number, mark and name, arrow, needed name, state), each name with its identity mark, the rows
ordered so a thing stands after what it needs (`orderDependencies` is the pure part), a cycle as one red unnumbered row. `data-kp-dep-order` is `numbers` (default) or `none`; `-direction` `from-needs-to` (default) or `from-reaches-to`;
`-group` `by-to` or `by-from` (with `none` order); `-states` adds running, stopped or unknown in words; `-collapse` (8) folds the rest behind an exact "Show all 23"; `-link` ("/stacks/{name}") makes names links; `-self` shows a thing's own row;
`-empty`, `-heading` ("{n} stacks reach these apps") and `-copy` (a button that copies "paperless -> postgres" per line) set the words and the extras. Each attribute change draws the list again. `deplist(el).setState('loading' | 'empty' | 'error')`:
the busy card over placeholder rows, the empty plate (no action), the failed plate with Retry (`kp-deplist-retry`), each as high as the list was. The words are `deplist…`.

### The path of a connection

The way one connection takes, hop by hop, stopping at the first refusal:

```html
<div class="kp-trace" data-kp-trace id="path" data-kp-trace-copy></div>
```

```js
import { setTrace } from '@kp-soft/themes/js/path-trace';
setTrace(document.getElementById('path'), [
    { title: 'tv', note: 'IoT network', verdict: 'allowed' },
    { title: 'Firewall', note: 'tcp 8096', verdict: 'refused', rule: 'IoT to media' },
    { title: 'Jellyfin', verdict: 'allowed' },
]);
```

`attachTraces(root)` (`js/path-trace.js`, attached by `js/auto.js`) draws the hops it is given on the step list (`.kp-steplist.kp-steplist--trace`): an allowed hop is `done`, a refused one `failed`, the hops after the first
refusal `skipped` ("not reached") and a hop with no verdict `pending` ("not measured"); a summary line over them says the outcome ("Blocked at rule "IoT to media"") as a polite status, and the deciding rule is a chip that fires `kp-trace-rule`
(`{ rule, hop }`). `data-kp-trace-layout` is `auto` (a row, a column under 30rem), `row` or `column`; `-stop` `first-refusal` (default) or `all`; `-verdict` `both`, `mark` or `word`; `-rule` `chip`, `inline` or `off`; `-summary` `off`;
`-copy` adds a button that copies the trace as text; `-swap` a Swap button and the key S (`kp-trace-swap`); `data-kp-density="compact"` hides the notes. Each attribute redraws the trace. `trace(el).setState('running' | 'empty' | 'error')`:
the busy card over placeholder hops, the empty plate "Pick a source and a target", the failed plate with Retry (`kp-trace-retry`), each as high as the trace was. The trace shows what the host measured; it decides nothing. The words are `trace…`.

### The entity card

One fixed card per thing (a stack, a host): its identity mark, name, state in words, a few exact figures, flags, two meters and its actions, in the same five rows on every card:

```html
<div class="kp-entity-grid" data-kp-entity-grid id="stacks" data-kp-entity-link="/stacks/{key}"></div>
```

```js
import { setEntityGrid } from '@kp-soft/themes/js/entity-card';
setEntityGrid(document.getElementById('stacks'), [{ key: 'media', name: 'media', vmid: '106', state: { label: 'running', tone: 'success' },
    figures: [{ value: '3/5', label: 'apps up' }], flags: [{ label: 'update available', tone: 'warning' }],
    meters: [{ label: 'CPU', value: 0.34 }, { label: 'RAM', value: 0.71, text: '5.6 of 8 GB' }],
    actions: [{ id: 'restart', label: 'Restart' }, { id: 'logs', label: 'Logs' }] }]);
```

`attachEntityCards(root)` (`js/entity-card.js`, attached by `js/auto.js`) keeps the cards in step with the grid's options; `setEntityGrid(grid, list)` draws or refills by key (a card already there changes its words in place, so a card under the pointer never moves)
and `setEntity(card, data)` draws one. Every row is kept whether it holds anything or not and every card of a grid is as high as the tallest. `data-kp-entity-meters` (0 to 3, default 2), `-flags-max` (3; more are an exact "+2" that opens the package's menu
button, and a flag that does not fit the width goes there too), `-inline` (3 action buttons in fixed columns, the rest in "More"; under 30rem all fold into "More", and a button that does not fit the card's width folds into it too, for every card of the grid; the grid notes it in `data-kp-entity-fit`, written), `-link` (the name's link template, stretched over the card), `-mark`, `-min` (22rem) on the grid or a card,
`data-kp-selectable` (a tick; the card is a row of a selection) and `data-kp-density="compact"` (no figures row); every attribute draws the cards again. Events `kp-entity-action`, `kp-entity-flag`, `kp-entity-tick`, `kp-entity-retry`, `kp-entity-new`,
`kp-entity-grid-retry`. A card with `status: 'loading' | 'empty' | 'error'` shows bones, "not measured" or a failed state with Retry at the same height; `setEntityGridState(grid, 'loading' | 'empty' | 'error')` shows skeleton cards under the busy card,
the empty plate "No stacks yet" with its action, or the failed plate with Retry. The action columns are equal on every card (a long label wraps inside its button). A meter's `tone` takes `success`, `neutral`, `warning` or `destructive` (none: amber from 75 %, red from 90 %). The empty plate takes `{ action: 'none', actionLabel, onAction }` (also `setEntityGrid(grid, [], options)`, and `data-kp-entity-empty-action="none"` on the grid); `onAction` runs in place of `kp-entity-new`. The words are `entity…`.

<!-- kpadopt4-ideas: next component -->

## Tables that fit [TH95, TH96]

A table is the widest thing on most pages, and everything below is about
what happens when it does not fit.

**The scroll box is a region, and the keyboard can reach it.** Wrap the
table and the package does the rest:

```html
<div class="kp-table-wrap">
    <table class="kp-table">
        <caption>
            Quarterly revenue
        </caption>
        …
    </table>
</div>
```

`attachTableRegions()` — which `js/auto.js` calls for you, and
`attachDataTables()` calls for its own table — gives that box
`tabindex="0"`, `role="region"` and a name, so someone without a mouse can
tab to it and scroll it with the arrow keys. Up to 3.1.1 they could not:
the columns past the edge were unreachable. React does the same from
`<Table>` and `<DataTable>`, which render the wrapper themselves.

The name is yours at every level, and the last one is the dictionary
rather than a word written into the code:

| What you write | The region is called |
| --- | --- |
| `data-kp-region-label="Orders"` on the wrapper | Orders |
| `attachTableRegions(root, { label: (wrap, table) => … })` | what you return |
| `<caption>Quarterly revenue</caption>` | Quarterly revenue |
| nothing | `strings.tableRegion`, "Table" by default |

React takes `regionLabel="Orders"`, falls back to a string `caption`, and
then to the same dictionary entry. `region={false}` (or
`data-kp-region="off"`, or `attachDataTables(root, { regions: false })`)
leaves the wrapper alone; an `aria-labelledby` you put there yourself is
never overwritten.

**Two ways for a cell to hold what does not fit.**

```html
<td class="kp-cell-break">a3f92b71c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5…</td>
<td class="kp-cell-truncate" title="the whole sentence">the whole sentence</td>
```

`.kp-cell-break` is for identifiers: a 70-character key with no space in
it is one word, and one such word widens the whole table past its
container. `.kp-cell-truncate` is for prose — one line and an ellipsis,
with the value still whole in the cell for a screen reader, find-in-page
and copy. Put it in the `title` as well, for the pointer;
`{ key: 'note', truncate: true }` on a React column does that for you.
`--kp-cell-truncate-max` (12rem by default) is how wide the column may
get before it starts clipping.

**A column that may go when it is tight.** `class="kp-col-low"` on the
header and on its cells — both, always: a column of values with no header
is worse than no column. Below 40rem of table width it disappears.

**Narrow means the table's own container, not the window.** The card
layout and `.kp-col-low` are container queries as of 3.2.0, so a table in
a 400px column of a 1280px page gets the narrow form it needs. The
threshold is **40rem**, and it is a contract value: CSS cannot read a
custom property in a query, so this number is written here rather than
exposed as a knob.

```html
<!-- Rows become cards, each cell carrying its column's name. -->
<div class="kp-table-wrap">
    <table class="kp-table" data-kp-cards>
        …
        <td data-label="Customer">Acme</td>
    </table>
</div>
```

**The card's lines are on two tracks** [datatable-r5-1019]. A card is a grid of a
name track (the longest name, at most `--kp-datatable-card-label`, 40 %) and a
value track; every line is a subgrid of both, so the values of a card start on
one edge, a code cell included. A cell with no `data-label` in a table that
asks for cards (`data-kp-cards` on the `.kp-datatable`) takes its header's
words; a column with no header words (selection, actions) spans the card.
`data-kp-cards="spread"` keeps the earlier look (name left, value pushed right).

`<Table cards />` writes both the attribute and every `data-label`;
`<DataTable>` has done the card layout since 1.0.0 and now does it by
container width. For a plain table it is opt-in, so no table that ships
today changes shape.

**What the container query costs.** `.kp-table-wrap` and `.kp-datatable`
carry `container-type: inline-size`, which means they no longer size to
their contents. Measured in Chromium 141 and Firefox 145: in normal block
flow and inside `.kp-datatable` nothing moves (500px before, 500px
after). A wrapper you put in a **shrink-to-fit** box does move — as a
flex-row item 279/328px becomes 0, as an inline-block 207/244px becomes
0, in an auto grid track 389/414px becomes 250px. If a table of yours
lives in one of those, give the wrapper a width, or a flex item around
it that has one.

There is also a floor: `--kp-table-wrap-min`. It defaults to `auto`, the
initial value, so it does nothing at all until you set it. Set it and the
wrapper cannot go below that width:

```css
.my-toolbar .kp-table-wrap {
    --kp-table-wrap-min: 20rem;
}
```

It is a floor and not a repair, and the difference matters. Nothing
restores the natural width, because the contents are exactly what
stopped counting: `min-inline-size: 100%` gives you the whole parent
(measured: 800px in a flex row) and still zero as an inline-block, and
`min-content` gives zero. Pick the floor you want to see.

**The data table's bars are inset.** The search bar above a
`.kp-datatable` and the status-and-pager bar below it carry their own
padding, so in a theme that frames the table the row count does not sit
on the frame. Two knobs move it, the block half and the inline half, on
the table or anywhere above it:

```css
.my-report .kp-datatable {
    --kp-datatable-bar-padding-block: 0.25rem; /* default var(--kp-space-sm) */
    --kp-datatable-bar-padding-inline: 1.5rem; /* default var(--kp-space-md) */
}
```

The filter panel, the pills, the action bar, the loading slot and the
card layout's sort control take the same inset. The pager's Previous and
Next are the theme's own button (`kp-button`; `pagerClassName` in
`attachDataTables`, `classNames.pagerButton` on `<DataTable>`), and
Previous carries `data-kp-direction="back"`, which a theme may answer —
cyberpunk turns its notch to that side.

## Eight more things a data table does [Kenny, 2026-09-13 and 2026-09-14]

Each is off until the markup (or a prop) asks for it, each keeps its
state in the handle `attachDataTables()` returns (`dataTable(element)`
finds it again), and each looks the way its approved mock in the data
table research demo did. The catalogue's Tables page shows every one live.

### Sorting on more than one column

```html
<div class="kp-datatable" data-kp-datatable data-kp-sort-multi>
    …
    <th data-kp-sort="text" data-kp-sort-order="Low,Medium,High,Critical" aria-sort="descending" data-kp-sort-priority="1">Severity</th>
    <th data-kp-sort="number" aria-sort="descending" data-kp-sort-priority="2">Hours open</th>
</div>
```

A plain click sorts on that column alone. **Shift** + click — or Shift +
Enter on a focused header — adds the column as the next key, a second
one turns it round, a third takes it out. Each sorted header carries its
`aria-sort` and, with two keys or more, its place in a small ring
(`.kp-datatable__sort-order`); a line in the top bar says the whole sort in
words, from `strings.tableSortedBy` and `strings.tableSortKey`. Headers the
server rendered with `aria-sort` open sorted, in the order
`data-kp-sort-priority` gives; a button with `data-kp-datatable-sort-reset`
puts that opening sort back. A new sort goes to the first page.

The handle: `sortBy([{ column, direction }, …])` sets every key, and
`view().sorts` reads them (`view().sort` is still the first).
`kp-datatable-sort` still announces the first key. React:
`multiSort`, and `sorts` / `defaultSorts` / `onSortsChange` with
`{ key, direction }` entries; `sort` and `onSortChange` keep working and
hear the first key. Knobs: `--kp-datatable-sort-order-radius`,
`--kp-datatable-sort-order-size`.

### Choosing which columns show

```html
<div class="kp-datatable" data-kp-datatable data-kp-column-menu>
    …
    <th>Reference</th>
    <th data-kp-column-hidden>Note</th>
</div>
```

A **Columns** button in the top bar (made when the markup has no top bar)
opens a `.kp-menu` on a `.kp-popover`, anchored under the button, with one
of the theme's checkboxes per column and **Show every column** at the
end; beside the button the count says how many show. A column hides with
its header and its cells together. The key column — the first that is not
a column of checkboxes or expand buttons — is locked and says so;
`data-kp-column-locked` locks another, `data-kp-column-locked="false"`
unlocks the key column. `data-kp-column-hidden` starts a column hidden.

The handle: `hideColumns([indices])`, `view().hidden`, and the
`kp-datatable-columns` event with `{ hidden }`. React: `columnMenu`,
`hiddenColumns` / `defaultHiddenColumns` / `onHiddenColumnsChange` by
column key, and `locked` on a column (the first by default).

### Rows that open to show more

```html
<div class="kp-datatable" data-kp-datatable data-kp-expandable>
    …
    <tbody>
        <tr data-kp-row-key="INC-4471" data-kp-expanded>…</tr>
        <tr data-kp-row-detail hidden>
            <td colspan="6">The whole note, the owner, the history…</td>
        </tr>
    </tbody>
</div>
```

The detail is yours: a `tr data-kp-row-detail` straight after its row, or
a `detail: (row) => Node | string` option that builds it the first time
the row opens, or — with neither — the `kp-datatable-expand` event, whose
`cell` you fill. The table puts a column in front (its header read by a
screen reader only, `strings.tableDetailsColumn`) with a button per row:
`aria-expanded`, `aria-controls` on the detail, a name from
`strings.tableRowDetails`, Enter and Space from the keyboard. A click
anywhere else in the row opens and closes it too, and the row shows a
pointer; a click on a control in the row (a button, a link, a field, a
checkbox) does only what that control does, and a click that ends a text
selection does nothing. Column
indices the handle takes count that column. An open row keeps its detail
directly under it through a sort and onto another page, and the detail
spans every visible column. `data-kp-expanded` opens a row from the start;
buttons with `data-kp-datatable-expand-all` and
`data-kp-datatable-collapse-all` open or close the page's rows.

The handle: `expand([keys])`, `view().expanded`. React: `renderDetail`,
`rowExpandable`, `expanded` / `defaultExpanded` / `onExpandedChange`,
`expandGlyph` and `collapseGlyph` (▸ and ▾; `expandGlyph` and
`collapseGlyph` as attach options). Knobs:
`--kp-datatable-detail-padding-block`, `--kp-datatable-expand-size`.

#### One open row, groups that fold, and marking the toggles

```html
<div class="kp-datatable" data-kp-datatable data-kp-expandable data-kp-expand-single>…</div>

<tbody>
    <tr data-kp-row-group="media" data-kp-folded>
        <th scope="rowgroup" colspan="4">Stack media <span class="kp-badge" data-kp-group-count></span></th>
    </tr>
    <tr data-kp-row-key="media-jellyfin" data-kp-group-of="media">…</tr>
    <tr data-kp-row-key="media-sonarr" data-kp-group-of="media">…</tr>
</tbody>
```

`data-kp-expand-single` on the wrapper (or `expandSingle: true` as an
attach option) keeps one row open at a time: opening a row closes the one
that was open, in the same step, and `kp-datatable-expand` fires once for
the opening, with the keys it closed in `closed` beside `expanded`.
`expand([keys])` opens only the last key, and of several rows marked
`data-kp-expanded` the last stays open.

A `tr data-kp-row-group="<key>"` is a heading row over the rows marked
`data-kp-group-of="<key>"`. Write it with one cell; the table spans that
cell across the visible columns and puts a fold button first in it: a real
button with `aria-expanded`, `aria-controls` naming the group's rows on the
page (give them `data-kp-row-key`), and a name from
`strings.tableGroupRows(group, count)`; the group's name is the heading's
text, or `data-kp-group-label`. A click anywhere in the heading folds or
unfolds it, as for a row that opens. A `[data-kp-group-count]` in the
heading gets the number of the group's rows that match the search and the
filters. `data-kp-folded` starts a group folded. Folded rows still count
as matched, so the status line keeps the exact number. The fold is kept
by group key, so it survives `refresh()`, even when the heading row was
replaced. A sort orders the rows within their group, and the groups (and
any run of rows outside a group between them) keep the place the markup
gave them, so a heading always stands above its own rows; a group whose
rows all fail the search or a filter hides its heading, and a group split
over two pages shows its heading on both. `data-kp-group-always` on a heading keeps it visible when no data row is under it (skeleton rows do not count): a stack still loading, one that failed (put a Retry button in the heading; a click on a control in it does not fold) or one with nothing to list (put the reason in the heading). The handle: `fold([keys])` and
`view().folded`; the event `kp-datatable-group` with
`{ key, row, open, members, folded }`. Not for a `data-kp-server` table,
whose server orders the rows. In the card layout a heading is the whole
width over its cards. Knobs: `--kp-datatable-group-ground`,
`--kp-datatable-group-weight`.

Enter or Space on a row or a cell that holds the focus itself (a cell of
the `data-kp-grid` keyboard grid, or a row you gave a `tabindex`) opens the
row, or folds the group, as a click does; a control in the row keeps its
own keys. After `refresh()` the toggle that held the focus keeps it, and
when you replaced its row, the new row's toggle with the same key takes it.

`decorate(part, info)`, an attach option, is called with every toggle the
table builds, each time it builds one (rows added and refreshed later
included): `info.kind` is `row-toggle` (`info.value` is the row key) or
`row-group-toggle` (`info.value` is the group key), `info.host` the
wrapper, `info.key` its `data-kp-key`, `info.label` the row's or group's
name. It is the same shape every kp module's `decorate` takes, for a
consumer that marks what its own tooling presses:

```js
attachDataTables(document, { decorate: (el, info) => (el.dataset.drive = `${info.kind}:${info.value}`) });
```

These four are in the plain-JS attach; the React channel does not have
them yet.

### A first column that stays

```html
<div class="kp-datatable" data-kp-datatable data-kp-fixed-columns data-kp-max-height="22rem">…</div>
```

Scrolled sideways, the key column — and every column of checkboxes or
expand buttons before it — stays at the left edge; `data-kp-fixed-columns="2"`
names a count instead. With a max height the box scrolls both ways and the
header stays too, with the corner above both. The script measures the
columns and writes `data-kp-fixed` and `--kp-datatable-fixed-start` on
their cells (`syncFixedColumns(table, count)` does it for a table of your
own); the stylesheet sticks them on an opaque ground,
`--kp-datatable-fixed-ground` (the header's ground by default), and the
last fixed column draws a hairline, `--kp-datatable-fixed-rule` and
`--kp-datatable-fixed-rule-width`. In the card layout nothing is fixed.
React: `fixedColumns` (`true`, or a count).

**A last column that stays** [datatable-r5-1019]: `data-kp-fixed-end="1"` (or a
count) keeps the last columns at the end edge, with the same opaque ground and a
hairline on their inner side (`syncFixedColumns(table, count, endCount)`; cells
carry `data-kp-fixed-end` and `--kp-datatable-fixed-end`). Cards keep nothing.

**Filters the page draws itself** [datatable-r5-1019]: `data-kp-filter-ui="none"`
on a table with `data-kp-filter` headers keeps `handle.filter()`, the view and
the events, and draws no Filters button, panel, "+ Add filter" or pills.

A header that stays (any `data-kp-max-height`, or React's `maxHeight`)
stands on `--kp-datatable-head-ground` (the page's `--background` by
default). While its box is scrolled away from the top, the script sets
`data-kp-scrolled` on the data table (`watchScrolled(element, box)` does it
for a table of your own) and the header's ground then reaches 2px above
the header, `--kp-datatable-head-reach`, so no sliver of a row shows over
it mid-scroll. Under the same attribute the box clips its own top edge
(`clip-path`, top side only, not while it has a keyboard focus ring), so
row text cannot paint a device pixel above it on a zoomed screen. At the
top the attribute goes and so do the reach and the clip, which
leaves a caption right above the header untouched; without script there
is no reach at all.

### Rows that come from a server

```html
<div class="kp-datatable" data-kp-datatable data-kp-server data-kp-page-size="25">
    …
    <th data-kp-sort="text" data-kp-field="ref">Reference</th>
    <th data-kp-sort="number" data-kp-field="hours" data-kp-cell-class="kp-text-end kp-numeric">Hours open</th>
</div>
```

```js
attachDataTables(document, {
    load: async ({ query, sorts, filters, page, pageSize, signal }) => {
        const response = await fetch(`/api/incidents?${params}`, { signal });
        const { rows, total } = await response.json();
        return { rows, total };
    },
});
```

The table searches, sorts, filters and pages nothing itself: every change
asks `load` — or, without the option, whoever answers the
`kp-datatable-request` event through its `respond(answer)` and
`fail(error)` — for one page, and shows the rows and the `total` it
answers. `rows` are table rows or plain objects; an object's cells are
read through each header's `data-kp-field`, wear the header's
`data-kp-cell-class`, and its key is the field `data-kp-row-key-field`
names (else the key column's field, else `key` or `id`; a `rowKey`
option decides otherwise). The search waits 300 ms after the last key
(`data-kp-debounce`). An answer to a request that is no longer the newest
is thrown away, and the older request's `signal` is aborted. While it
waits the old rows stay, dimmed, and the status shows the theme's spinner;
a first load with no loading slot of yours shows three skeleton rows and
the same spinner [fix-80]; `busy(text)` on the handle puts your own words in
the status line while it loads, kept across `refresh()` and gone once the
table is ready, and `busy({ text, since })` has the table count how long it
has been loading by itself ("42 s so far"), in a part the live region does
not announce each second [fix-84]; `busy({ text, since, overlay: true })`, or
`data-kp-busy-overlay` on the wrapper, also sets a large spinner with those
words and that count over the rows while it loads, for a table long or slow
enough that the status line is out of sight — hidden from a screen reader,
which hears the status line, and moving nothing when it comes or goes;
`fail(reason)` puts any table, not only a
server's, in the failed state with your reason in the words and Try again
under them [fix-85]; an empty slot may hold a `data-kp-datatable-empty-none`
part and a `data-kp-datatable-empty-nomatch` part, shown when there are no
rows at all and when a search or a filter hides them all; a failed answer shows the failed slot — made, with **Try again**, when the
markup has none — and Try again asks again. A server-rendered first page
with `data-kp-total` is shown without asking. Selected keys outlive the
page they were ticked on.

The handle: `reload()`. React: `load` with the same request (column keys
instead of indices), `rows` then left out, `debounceMs` 300 by default, and
`apiRef.current.reload()`; `totalRows` still serves a table whose page you
fetch yourself.

### Editing a value in its cell

```html
<th data-kp-edit="text" data-kp-edit-required>Site</th>
<th data-kp-edit="select" data-kp-edit-options="Open,Watching,Closed">Status</th>
<th data-kp-edit="number" data-kp-edit-min="0">Hours open</th>
<th data-kp-edit="date">Opened</th>
```

```js
table.addEventListener('kp-datatable-edit', (event) => {
    const { key, label, value, previous, reject, waitUntil } = event.detail;
    if (label === 'Hours open' && Number(value) > 100) reject('No more than 100 hours.');
    else waitUntil(save(key, label, value)); // resolve to a string or false to refuse
});
```

Every value in an editable column becomes a button with a dashed
underline and a pencil (`.kp-datatable__edit`; `--kp-datatable-edit-rule`,
`--kp-datatable-edit-glyph`, a paint that stays out of the value). Pressing
it opens the package's own control in the cell, in the compact density: a
field, a number field, the drawn select, or the date picker. Enter saves
(on a select, Enter on the open list takes the highlighted option and
saves), moving away saves, Escape cancels. A required value that is empty,
or a number that is not one, shows the field's error and saves nothing.
Before saving, the table fires `kp-datatable-edit` (cancelable) and calls
the `onEdit` option; `reject(message)`, `preventDefault()`, or a string or
false from `waitUntil` or `onEdit` refuses the value and the cell shows the
message. A saved value is written into the cell — into its badge, where
the cell holds one — and a line under the table says what changed, with
**Undo**, which asks again with `undo: true`. The focus returns to the
cell.

The handle: `edit(key, column)` and `cancelEdit()`. React: `edit`,
`editOptions`, `editRequired`, `editMin` and `editMax` on a column, and
`onCellEdit({ row, rowKey, key, label, value, previous, undo })` —
return a string or false (or a promise of one) to refuse; accepting is
yours to show, by updating `rows`.

### Moving through cells with the arrow keys

```html
<div class="kp-datatable" data-kp-datatable data-kp-grid>…</div>
```

The table becomes an ARIA grid with one tab stop. Inside it the arrow keys
move a cell at a time, Home and End go to the start and end of the row,
Ctrl + Home and Ctrl + End to the first and last cell, Page Up and Page
Down five rows (`gridPageRows`). A cell that holds one control hands it
the focus, so Enter on a sort header sorts and Enter on an editable value
edits it; Escape from the editor comes back to the cell. Keys pressed in
an editor stay the editor's. The focus ring is drawn inside the cell. A
line under the table says where the focus is, from
`strings.tableGridPosition`. `attachGrid(table)` gives a table of your own
the same keys. React: `grid` and `gridPageRows`.

### Adding a filter, one at a time [Kenny, 2026-09-14]

The filters a header declares (`data-kp-filter="choice"`, `"range"`,
`"date"`) are set in a panel by default. A table can choose the second
design instead:

```html
<div class="kp-datatable" data-kp-datatable data-kp-filter-mode="add">
    <div class="kp-datatable__bar">
        <!-- optional: without it the button is made and put in the top bar -->
        <button type="button" class="kp-button" data-kp-datatable-add-filter>+ Add filter</button>
    </div>
    …
    <th data-kp-filter="choice" data-kp-filter-value="Open,Watching">Status</th>
    <th data-kp-filter="range">Hours open</th>
    <th data-kp-filter="date">Opened</th>
</div>
```

**+ Add filter** opens a menu (`.kp-menu` in a `.kp-popover`, under its
button, above it where the window has no room) of every filterable column;
the arrow keys, Home and End move through it and Escape closes it. Choosing
a column opens an editor between the bar and the table: the package's
checkboxes for a choice (the header's `data-kp-filter-options`, else the
values the rows hold, read when the editor opens), two fields for a number
range, two package date pickers for dates. **Apply** checks the bounds — a
number that is not one, a date the picker cannot read, a range that runs
backwards each get a message under the fields — and adds one pill for the
filter, `Status: Open, Watching` or `Hours open: 10–30`. The pill's words
reopen its editor with its values; its × removes it; **Clear all** shows
from two pills. A column that is filtered already is marked in the menu and
opens its own pill's editor rather than a second pill. Cancel and Escape
leave everything as it was, an editor applied empty removes its filter, and
the focus comes back to the pill or to the button.

The editor's title ("Status", "Hours open") is a paragraph, not a heading.
An editor that opens for a moment is not a section of the page, and a
heading there would add an entry to the outline of every page that uses the
table. The approved mock drew an `<h3>`; Kenny chose the paragraph on
2026-09-14.

The state is the panel's: `view().filters`, `filter(column, value)`,
`clearFilters()`, `kp-datatable-view` and, in React, `filters` /
`defaultFilters` / `onFiltersChange` hold the same shape in both modes, so
an app that reads the filters does not know which design is on screen. The
handle's `editFilter(column)` opens a column's editor and `editFilter(null)`
closes it (in the panel mode it opens and closes the panel); React's
`apiRef.current.editFilter(key)` does the same. A default for every table
at once: `attachDataTables(root, { filterMode: 'add' })`.

React: `filterMode="add"`. The words are `strings.tableAddFilter`,
`tableAddFilterMenu`, `tableAddFilterItem`, `tableAddFilterItemActive`,
`tableFilterMarked`, `tableFilterEditor`, `tableFilterChoicesLegend`,
`tableFilterBound`, `tableFilterChoicePill`, `tableFilterSpanPill`,
`tableEditFilter`, `tableFilterApply`, `tableFilterCancel`,
`tableFilterClearAll`, `tableFilterNotNumber`, `tableFilterNotDate` and
`tableFilterBackwards`. The editor's frame is its own rather than a card
or a popover, because some registers clip those to a cut corner and an
open calendar would be clipped with them; the calendar opens in the top
layer. Knobs: `--kp-datatable-filter-editor-ground`, `-ink`, `-border`,
`-border-width`, `-radius`, `-padding`, `-gap`, `-max-width` and
`-title-weight`, `--kp-datatable-filter-choice-min`,
`--kp-datatable-filter-bound-min` and `--kp-datatable-add-mark-gap`.

## What a scroll region clips [TH114]

Three boxes in this package scroll sideways inside themselves rather than
widening the page: `.kp-table-wrap` (`css/components.css:950`), `.kp-diff`
(`css/components.css:2406`) and every `<pre>` (`css/_rules.css:464`). Each
declares `overflow-x: auto` and says nothing about the other axis — and
`overflow-y` then computes to `auto` rather than staying `visible`,
because a box that scrolls in one axis is a clip in both. Each of the
three is therefore a clip in the block axis too, which is not what
"scrolls sideways" sounds like.

What that means for something you place against one of them, measured in
Chromium 151 and Firefox 153 (`tests/scroll-boundary.spec.mjs`):

| Region | An absolutely positioned child | A popover |
| --- | --- | --- |
| `.kp-table-wrap` | clipped at the box edge | escapes, and is clickable outside |
| `.kp-diff` | clipped at the box edge | escapes, and is clickable outside |
| any `<pre>` | clipped at the box edge | escapes, and is clickable outside |

**An absolutely positioned child is clipped.** Give one of these boxes
`position: relative` — or anything inside it — and a menu, a tooltip or a
row action positioned against it stops at the box's edge. Measured in all
three regions and both browsers: the probe is laid out past the box's
bottom, and a click at the probe's own centre reaches the page behind it
instead of the probe.

**A popover is not clipped.** An element with the `popover` attribute is
painted in the top layer, where no ancestor's overflow applies. Measured
in the same three regions and both browsers, with the same declarations
on the same pixels: the probe is the element a click at its own centre
reaches. So a menu that has to hang out of a scroll region is a popover,
which is what this package's own menus already are — `.kp-popover`
(`css/components.css:1333`) is a `popover` element.

Two things about that which surprise people, both measured rather than
assumed:

- **A popover does not sit relative to its DOM parent.** Its
  `position: absolute` resolves against the initial containing block, so
  the same `inset-block-start: 100%` that means "just under this box" for
  an ordinary absolute child means "the bottom of the viewport" for a
  popover — measured `top: 720px` in a 720px-tall viewport. Place it with
  anchor positioning, the way `.kp-popover` does
  (`position-area: block-end span-inline-end`, `css/components.css:1349`),
  not with insets.
- **`container-type` does not make `.kp-table-wrap` a containing block.**
  The wrapper carries `container: kp-table / inline-size`
  (`css/components.css:974`) for the card breakpoint, and that does not
  catch an absolutely positioned descendant: with no `position` on the
  wrapper, such a child resolves against the initial containing block and
  lands somewhere else entirely — measured, the wrapper spanning 0–114px
  and the child at 580px.

The clip is not a defect and there is no repair for it: `overflow-x: auto`
is what keeps a wide table off the page's own scrollbar (SC 1.4.10, DI11).
Use the top layer for the thing that has to escape.

**The package's own calendars and lists already do.** A `clip-path` clips
the same way an overflow does, and four registers draw a container's
silhouette with one — the cut corners of `.kp-card`, `.kp-alert`,
`.kp-popover`, `.kp-dialog` or `.kp-spec` in dark, cyberpunk, phantom (removed 2026-10-16) and
titanium. Measured on 2026-09-13 inside a `.kp-card` in those four themes:
every day of an open date picker and every option of a combobox and of a
drawn select was out of reach, the clipped area handing the click to what
lay beneath. Since then the date picker's panel, the combobox's list and
the drawn select's list become a manual popover while they are open
(`js/top-layer.js`), placed in window coordinates beside their control and
following it when anything scrolls. They stay where they are in the
document, so the theme, the register rules and focus behave as before. A
calendar that would run past the window's inline end opens toward the
inline start instead (`data-kp-align="end"` on the panel). A list or
calendar whose field sits near the window's bottom edge opens above the
field when there is more room there, and says so with
`data-kp-overlay-side="above"`; when neither side has room for all of it,
it takes the larger side and scrolls itself [fix-30].

## The grid and the nav bar measure their own box too [TH104]

From 4.0.0 the movable grid and the navigation bar ask the same question
the tables ask: how much room have I actually been given? Both need one
element around them to ask it, because a container query styles a
container's **contents** and never the container itself — and what has to
change is the grid's own column count and the bar's own padding.

```html
<div class="kp-grid-wrap">
    <div class="kp-grid" data-kp-grid data-kp-columns="6">…</div>
</div>

<div class="kp-nav-wrap">
    <nav class="kp-nav" aria-label="Main">…</nav>
</div>
```

`<GridLayout>` and `<NavBar>` render that wrapper themselves. Pass
`wrap={false}` if your page already establishes a container of its own,
and `wrapClassName` to put your classes on it. **Markup you write by
hand needs the wrapper added**, and without it nothing breaks — the
component simply keeps its wide form in every box, which is what 3.2.0
did everywhere.

The threshold is **40rem**, the same number the tables use, and it is a
contract value for the same reason: CSS cannot read a custom property in
a query. Below it the grid becomes one column in source order, and the
nav bar takes `--kp-nav-pad-inline-narrow` (0.75rem) instead of
`--kp-nav-pad-inline` (1.5rem). Both of those are knobs, as is
`--kp-nav-pad-block`.

Up to 3.2.0 the bar's inline padding was `clamp(0.75rem, 3vw, 1.5rem)` —
it read the **window**, so a bar in a 300px column of a 1280px page was
given a 1280px page's padding. If you were overriding that `padding`
declaration, override the two knobs instead.

Each wrapper carries `container-type: inline-size`, so it no longer sizes
to its contents; `--kp-grid-wrap-min` and `--kp-nav-wrap-min` are the
same floor `--kp-table-wrap-min` is, defaulting to `auto` and doing
nothing until you set one.

### A bar that collapses [stage 1.3]

Below that same 40rem the bar can fold its links into a toggle. It is
opt-in by the button being there, so a nav without one behaves exactly as
it did:

```html
<div class="kp-nav-wrap">
    <nav class="kp-nav" aria-label="Main">
        <span class="kp-nav__brand">Your app</span>
        <button type="button" data-kp-nav-toggle class="kp-nav__toggle"></button>
        <ul class="kp-nav__links">…</ul>
    </nav>
</div>
```

`js/auto.js` wires it: the button gets `aria-expanded` and an
`aria-controls` pointing at the list, the nav gets `data-kp-nav-open`
while it is open, and every state has a way out — the button, Escape
while the focus is inside the nav, and a click outside it. Each change
fires `kp-nav-toggle` on the nav with `{ open }`.

The button draws three bars itself, because this package ships type and
not icons; put your own glyph inside it and yours is used instead. Its
accessible name comes from the dictionary (`menu`, `closeMenu`) and says
which way the press goes rather than what the control is. Knobs:
`--kp-nav-toggle-size` (2.25rem) and `--kp-nav-menu-indent` (1rem), which
is how far a dropdown is inset once it is a nested list rather than a
floating panel.

In React it is the `collapsible` prop, and `toggleIcon` for what goes in
the button. That channel wires its own button and marks it
`data-kp-nav-owner`, so `attachNavToggles` leaves it alone; pass
`ownedBy: ''` if you want the module over a React nav anyway.

### A header that stays and shrinks [scope-48]

On a long page the bar can stay at the top and give some of its height
back once the reader has scrolled. It is opt-in by a modifier on the
wrapper, so a bar without it behaves exactly as it did:

```html
<a class="kp-skip-link" href="#main">Skip to content</a>
<div class="kp-nav-wrap kp-nav-wrap--sticky">
    <nav class="kp-nav" aria-label="Main">…</nav>
</div>
```

The stylesheet makes the wrapper `position: sticky` at the top of the box
that scrolls it, on the bar's own layer (`--kp-z-nav`, 30). `js/auto.js`
(or `attachStickyNavs(root)` from `js/components.js`) does two things:

- once that box has scrolled further than the bar is tall, it sets
  `data-kp-nav-compact` on the wrapper, and the bar keeps half of its own
  block padding, top and bottom each: every theme's padding, and a
  `--kp-nav-pad-block` you set, is multiplied by `--kp-nav-sticky-shrink`
  (0.5). A theme whose top and bottom differ keeps that ratio, and the
  compact bar is never taller than the bar at rest. Back within that distance less
  the bar's height, the attribute goes again — the gap stops the bar
  flipping between its two heights when the browser's scroll anchoring
  moves the page. `data-kp-nav-sticky-after="200"` starts it later; a
  value below the bar's height is raised to it. Each change fires
  `kp-nav-compact` on the wrapper with `{ compact }`.
- it writes the bar's current height to `--kp-nav-sticky-height` on the
  scrolling box (the page's root, or the nearest ancestor that scrolls)
  and marks that box `data-kp-nav-sticky-root`. Its
  `scroll-padding-block-start` reads `--kp-scroll-offset` first and that
  height second, so an anchor, the skip link's target and an element
  reached with Tab land below the bar. Set `--kp-scroll-offset` yourself
  and yours wins.

The padding glides over `--kp-nav-sticky-duration` (the theme's
`--fx-duration`) only under `prefers-reduced-motion: no-preference`;
otherwise it changes at once. Every register reads `--kp-nav-pad-block`
and multiplies it by `--kp-nav-pad-scale` (1 at rest, the shrink factor
when compact — the stylesheet sets it; set `--kp-nav-sticky-shrink`
instead), so the bar shrinks in all 19 themes. Keep the skip link before the
wrapper: it stays the first thing Tab reaches.

A sticky box sticks inside its parent, so the wrapper's parent has to be
the page or the column that scrolls — not a mount point exactly as tall
as the bar.

In React it is the `sticky` prop, with `stickyAfter` for the distance.
That channel wires its own wrapper and marks it
`data-kp-nav-sticky-owner`, so `attachStickyNavs` leaves it alone.

### The command palette as navigation [scope-48]

A palette that only opens on a key is a secret, so the bar keeps a
visible door to it in a slot at its far end, and the palette's commands
can be the places themselves:

```html
<div class="kp-nav-wrap">
    <nav class="kp-nav" aria-label="Main">
        <span class="kp-nav__brand">Your app</span>
        <ul class="kp-nav__links">…</ul>
        <div class="kp-nav__search">
            <button type="button" class="kp-nav__search-trigger" data-kp-palette-open="places">
                Search <kbd class="kp-palette__keys" data-kp-palette-keys></kbd>
            </button>
        </div>
    </nav>
</div>

<dialog class="kp-palette" id="places" data-kp-palette aria-label="Go to">
    <input class="kp-palette__input" type="text" role="combobox" aria-label="Go to"
           aria-expanded="true" aria-controls="places-list" autocomplete="off" />
    <ul class="kp-palette__list" id="places-list" role="listbox" aria-label="Go to">
        <li role="presentation">
            <a class="kp-palette__option" role="option" data-kp-option
               data-value="reports" href="/reports">Reports</a>
        </li>
    </ul>
    <p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>
```

`js/auto.js` (through `attachPalettes`) does the rest. The trigger is an
ordinary `data-kp-palette-open` opener: pressing it opens the palette with
the focus in its input, and Escape — or a click anywhere outside the
palette's box — closes it and gives the focus back to the trigger. A press
that starts inside the box and ends outside it, the way a mouse selects
the query, does not close it [scope-80].
What the markup leaves out the module writes — `aria-haspopup="dialog"`,
and `aria-keyshortcuts` when the palette has a key — and it fills the empty
`<kbd data-kp-palette-keys>` with the key in the platform's spelling, ⌘K
on a Mac and Ctrl K elsewhere (the dictionary's `paletteHotkey`; the
visible word is yours, or `paletteTrigger` in React).

An option that is an `<a href>` is followed: on a click by the browser, on
Enter by a click the module makes, so `target` and a router's own click
handler behave as they would anywhere. `kp-palette-run` still fires first,
with `{ value, option, href }`, and it is cancelable: a single-page
application calls `preventDefault()` on it and routes itself. The module
takes the link out of the Tab order while it is attached, because the
highlight is virtual focus and the focus belongs in the input. Before the
module attaches, and on a page without JavaScript, the list is a list of
plain links that work on their own.

`.kp-nav__search` pushes itself to the bar's end, and every register
answers it in the voice of its own bar links — their typeface, case,
spacing, shape and pointer answer, without the underline that marks a
link [scope-80]. The one knob is `--kp-nav-search-min` (10rem), the trigger's
minimum width, never more than the bar itself.

In React, NavBar's `search` prop fills the slot and `PaletteTrigger` is the
button; a command with an `href` is a link, and `linkComponent` hands its
rendering to your router the way NavBar's does:

```jsx
<NavBar brand="Your app" links={links} search={<PaletteTrigger palette="places" />} />
<CommandPalette id="places" commands={[{ value: 'reports', label: 'Reports', href: '/reports' }]} />
```

### A dropdown at the bar's end [fix-27]

A `.kp-nav__menu` hangs from its item's start edge. Under an item near the
window's end that ran it past the edge, so `js/auto.js` (through
`attachNavMenus`) measures a dropdown as it opens — on hover and on focus —
and again when the window changes size, and when the start edge leaves it
outside the window and the end edge does not, it writes
`data-kp-nav-menu-end` on the panel, which hangs it from the item's end edge
instead. Nothing to add to your markup. The React NavBar calls the same
`placeNavMenu(item)` from its items; a page that opens a dropdown some other
way can call it too. Without script the panel keeps its start edge.

### A mega menu [scope-48]

One bar item can open a wide panel of grouped links, for a site with more
places than a dropdown holds. It is a disclosure, not a hover dropdown: a
button opens it, never the pointer alone, so a touch or keyboard reader
opens it on purpose.

```html
<div class="kp-nav-wrap">
    <nav class="kp-nav" aria-label="Main">
        <span class="kp-nav__brand">Your app</span>
        <ul class="kp-nav__links">
            <li>
                <button type="button" class="kp-nav__link kp-nav__disclosure" data-kp-nav-disclosure>Equipment</button>
                <div class="kp-nav__menu kp-nav__menu--wide">
                    <div class="kp-nav__group">
                        <h2 class="kp-nav__menu-heading">Pumps</h2>
                        <ul>
                            <li><a href="/pumps/main">Main line pumps</a></li>
                            <li><a href="/pumps/boosters">Booster sets</a></li>
                        </ul>
                    </div>
                    <div class="kp-nav__group">…</div>
                </div>
            </li>
        </ul>
    </nav>
</div>
```

`js/auto.js` (through `attachNavMenus`) wires it. The button gets
`aria-expanded` and an `aria-controls` naming the panel (the panel gets an
id if it has none), and the panel is shown while the button says `true`.
Every open state has a way out: the button again, Escape while the focus is
in the bar — the focus goes back to the button — a click outside the item,
and the focus leaving it. Tab walks from the button through the panel's
links in order. One panel is open at a time: opening one closes the others.
A button with no words of its own, a glyph only, is named from the
dictionary (`navDisclosure`).

The panel is plain lists under headings — site navigation, so not
`role="menu"` — and the heading level is yours: pick the one that fits your
page's outline. It spans the bar's width in a grid of at most four columns,
each at least `--kp-nav-mega-min` (11rem) wide, `--kp-nav-mega-gap` (1.5rem)
apart. The panel is a `.kp-nav__menu` too, so every register's dropdown
voice dresses it, and its headings speak in the voice of the register's menu
caption. Behind a collapsed bar's toggle the panel is a nested list in one
column, and still opens only when its button is pressed.
`data-kp-nav-menu-open` on the item shows it open without a press, the way
it does for a dropdown.

In React, give a link `groups` instead of `links`, and NavBar renders the
button and the panel and wires them itself; `headingLevel` (2) sets the
headings' level. That channel marks its bar `data-kp-nav-owner`, so
`attachNavMenus` leaves it alone; pass `ownedBy: ''` if you want the module
over a React bar anyway.

```jsx
<NavBar
    brand="Your app"
    links={[
        {
            href: '#equipment',
            label: 'Equipment',
            groups: [{ label: 'Pumps', links: [{ href: '/pumps/main', label: 'Main line pumps' }] }],
        },
    ]}
/>
```

### The bar's layer [scope-48]

`.kp-nav-wrap` is positioned and sits on `--kp-z-nav` (30): above the
popover layer (20), below back-to-top (50) and a covering side navigation
(60). The whole bar is one layer, so its open dropdown stays above
whatever follows the bar on the popover layer, in every theme. Until
scope-48 two registers lifted the wrapper, nine the nav inside it and the
rest nothing, so an element at `z-index: 20` after the bar covered the
dropdown in six themes.

Two consequences. A page that wants the bar sticky writes
`position: sticky; top: 0` on `.kp-nav-wrap` in its own stylesheet, which
wins over the package's layers. And a control inside the bar is on the
bar's layer: a `.kp-sidenav__toggle` placed in the bar sits under an
`over` panel (60) rather than above it, so give that panel
`--kp-sidenav-inset-block` to start below the bar, or put its closing
control inside the panel.

### An application shell, and its rail on a phone [scope-80]

`.kp-shell` is the whole window: the bar, then `.kp-shell__body`, a row
that takes the rest of the window's height, so a rail beside the content
runs to the bottom of the window rather than stopping where the content
does. The page gives up the browser's 8px body margin while a shell is on
it. Knob: `--kp-shell-min` (100dvh).

On a phone that rail is in the way, so `data-kp-sidenav-over-below` turns
it into the `over` panel while the box it lives in is 40rem wide or
narrower — the width the bar and the table already step at — or at the
length you give it (`data-kp-sidenav-over-below="52rem"`):

```html
<div class="kp-shell">
    <div class="kp-nav-wrap">
        <nav class="kp-nav" aria-label="Main">
            <span class="kp-nav__brand">Your app</span>
            <ul class="kp-nav__links">…</ul>
            <button type="button" class="kp-sidenav__toggle kp-icon-button" data-kp-sidenav-toggle aria-controls="rail" hidden>
                <span aria-hidden="true">☰</span>
            </button>
        </nav>
    </div>
    <div class="kp-shell__body">
        <nav class="kp-sidenav" id="rail" aria-label="Section" data-kp-sidenav-slim data-kp-sidenav-over-below>
            <div class="kp-sidenav__scroll">…</div>
            <div class="kp-sidenav__footer">
                <button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="rail">…</button>
                <button type="button" class="kp-sidenav__toggle kp-sidenav__link" data-kp-sidenav-toggle aria-controls="rail" hidden>
                    <span class="kp-sidenav__icon" aria-hidden="true">×</span>
                </button>
            </div>
        </nav>
        <div class="kp-flex-1">…</div>
    </div>
</div>
```

Narrow, the module sets `data-kp-sidenav-mode="over"` and
`data-kp-sidenav-narrow` on the panel, closes it, and gives the labels back
if the rail was collapsed to icons; the toggle opens it with the focus
trap, Escape, the backdrop and the focus return `over` already has. Wide
again, the panel is what the markup declared, slim state included. The
controls follow through `hidden`: the panel's `data-kp-sidenav-toggle`
buttons show only while narrow, its slim toggles only while wide, so
write the narrow ones `hidden` and a page without JavaScript never shows a
button that does nothing. The close inside the panel matters: the panel
covers the bar, and the bar's toggle with it. The width is the panel's
parent's, measured as the bar measures its wrapper. In React it is
`<Sidenav overBelow>` (or `overBelow="52rem"`) with `SidenavToggle`, which
passes `hidden` through.

### A panel at the window's edge, with a launcher

[Kenny, 2026-10-13; research/sidenav-edge] A page whose navigation comes
out of the window's left edge puts its toggler in a `.kp-sidenav__launcher`
box: fixed at the start corner, in the same place at every width and in
every state, above the panel. Leave the button empty and the module puts
the package's three bars in it and names it from the strings:

```html
<div class="kp-sidenav__launcher">
    <button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="nav"></button>
</div>
<nav class="kp-sidenav" id="nav" aria-label="Sections" data-kp-sidenav-mode="push" data-kp-sidenav-content="#main" data-kp-sidenav-backdrop="false">
    <div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
    <div class="kp-sidenav__scroll">…</div>
</nav>
<main id="main">
    <header class="kp-page-header" data-kp-sidenav-launcher-room>…</header>
    …
</main>
```

The module marks the panel `data-kp-sidenav-launched`, which starts its
header beside the launcher (a panel without a header starts its first row
below it), so the launcher never covers an item; `data-kp-sidenav-launcher-room`
keeps the page header clear of it. The launcher box is lit
(`data-kp-sidenav-lit`, the accent plate) from the opening's first frame
to the closing's last, so its change is part of the open and played back
with the close. Three ways to meet the page, one attribute each:

- **push**, as above: opening pushes the content by the panel's width. The
  content moves on the panel's own slide (the module copies its time, curve
  and delay onto the content as `--kp-sidenav-shift-duration`, `-ease` and
  `-delay`), so it travels with every theme's slide and comes back on its
  reverse; a register that draws the move itself wins.
- **reserved gutter**, `push` plus `data-kp-sidenav-reserve`: the content
  keeps the panel's width whether the panel is open or not, so the panel
  opens into empty room and covers nothing. Add `data-kp-sidenav-open="true"`
  to start open.
- **over**, `data-kp-sidenav-mode="over"` with `data-kp-sidenav-backdrop="false"`:
  the panel slides over the content, with the focus trap and Escape `over` has.

On a phone a push squeezes the content and a gutter takes 15rem of it; add
`data-kp-sidenav-over-below` to turn either into an `over` panel at 40rem
and narrower. The launcher stays (it is never hidden by that option) and
the gutter gives its room back while the panel is narrow. Knobs:
`--kp-sidenav-launcher-inset` (`--kp-space-sm`) and
`--kp-sidenav-launcher-size` (2.25rem).

### The side navigation's options from other libraries

[Kenny, 2026-10-13; research/sidenav-edge, pages 1 to 5] Each is one
attribute on the panel, and each opening and closing runs the theme's own
effect with the close as the open backwards.

- **A shut panel is inert.** A closed `over` or `push` panel is out of the
  tab order and the accessibility tree from the closing's last frame to the
  opening's first. `data-kp-sidenav-inert="false"` keeps it reachable.
- **Edge tab.** A `.kp-sidenav__tab` box holding a toggler rides on the
  panel's far edge, halfway down, and stays at the window's edge while the
  panel is away; it works beside the launcher:

  ```html
  <div class="kp-sidenav__tab">
      <button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="nav"></button>
  </div>
  ```

- **Which opener shows.** `data-kp-sidenav-opener="launcher"`, `"tab"` or
  `"both"` on the panel chooses the opener for an `over` or `push` panel (with
  or without `data-kp-sidenav-reserve`): the module does not draw the other box
  (no paint, out of the tab order and the accessibility tree, and none on the
  first frame), and the panel's header gets the room kept for the launcher back
  when only the tab is shown. Without the attribute the edge tab is the
  default: the panel behaves as `"tab"`, the launcher is not drawn and its room
  is given back; write `"both"` to keep both. A page with no
  `.kp-sidenav__tab` for the panel keeps its launcher, so a panel never has no
  opener. A `side` panel and the
  collapsed rail ignore it and show whatever the markup holds. The focus,
  `aria-controls`, `inert` and the theme's own opening and closing are the same
  with either opener.

- **Shortcut.** `data-kp-sidenav-shortcut="Control+b"` opens and closes the
  panel from anywhere but a text field; `Control` (or `Mod`) is ⌘ on a Mac.
- **Where the focus lands.** `data-kp-sidenav-initial-focus="[aria-current='page']"`
  names the element that takes the focus on opening, in every mode; the
  focus goes back to the opener once the panel has closed.
- **The collapsed rail** (`data-kp-sidenav-slim` with
  `data-kp-sidenav-slim-collapsed`): each item shows its label as the
  package's tooltip on hover and focus (`data-kp-sidenav-rail-tips="false"`
  turns it off), and a group opens beside the rail as a floating panel with
  the theme's popover effect, on a resting pointer, a press, Enter or the
  arrow away from the edge; Escape or the arrow back folds it
  (`data-kp-sidenav-flyout="false"` keeps groups folding in place).
- **The rail's step.** `data-kp-sidenav-slim-below="60rem"` collapses the
  rail when its box is that wide or narrower; wider again it is what the
  reader left it. `data-kp-sidenav-over-below` (with a length too) is the
  step for the variant.
- **Widening on hover.** With `data-kp-sidenav-expand-on-hover`, the rail
  widens after the pointer has rested `data-kp-sidenav-hover-delay`
  milliseconds (150 by default) and while the keyboard focus is inside it.

### Four behaviour options, off until a page asks

[Kenny, 2026-10-13, the first four of the ten minor options; research/sidenav-minor]
Each is one attribute on the panel; a panel without them behaves exactly as before.

- **Events a page can refuse, with a reason.** `data-kp-sidenav-cancelable`
  makes `kp-sidenav-toggle` (and `kp-sidenav-slim`) fire *before* the change,
  cancelable, with `event.detail.reason`: `toggler`, `escape`, `backdrop`,
  `shortcut` or `api` (a call on the handle). `event.preventDefault()` leaves
  the panel as it is and fires `kp-sidenav-prevented`, whose `detail` holds
  `kind` (`toggle` or `slim`), the state that was asked for (`open` or
  `collapsed`), `reason` and `source` (`listener` or `static`). What a layout
  does by itself (`breakpoint`, `mode`, `init`) is told, never asked. Without
  the attribute the events fire after the change, as they always did, and
  carry `reason` too.

  ```js
  nav.addEventListener('kp-sidenav-toggle', (event) => {
      if (!event.detail.open && draftIsUnsaved()) event.preventDefault();
  });
  ```

- **Resize by dragging.** `data-kp-sidenav-resizable` adds a handle
  (`.kp-sidenav__resizer`, `role="separator"` with `aria-valuenow`, `-min` and
  `-max` in pixels) inside the panel on the edge that faces the content, so it
  covers none of the page. A pointer drags it; with the focus on it Left and
  Right move one rem, Shift five, Home and End go to the limits, a double press
  gives the stylesheet's width back. The limits are
  `data-kp-sidenav-min-width` (12rem) and `data-kp-sidenav-max-width` (32rem),
  any length. It writes `--kp-sidenav-width`, so a pushed or reserved content
  follows, and keeps it with `data-kp-remember`. No handle in the collapsed rail.
- **Static backdrop.** `data-kp-sidenav-backdrop="static"`: the backdrop is
  there and a click on it does not close the panel. The panel is pulled a
  little toward its edge and let go on the theme's own time and curve (never
  shorter than 120 ms a leg), and `kp-sidenav-prevented` fires with
  `source: 'static'`. Knobs: `--kp-sidenav-refuse-travel` (0.75rem),
  `--kp-sidenav-refuse-duration`, `--kp-sidenav-refuse-ease`. No motion when the
  system asks for none; the panel carries a ring while the cue lasts.
- **Close on backdrop.** `data-kp-sidenav-close-on-backdrop="false"` makes a
  click on the backdrop do nothing, silently, the sibling of
  `data-kp-sidenav-close-on-esc="false"`.

The last two only matter where a panel has a backdrop. The package's default is
unchanged: a page that wants no scrim says `data-kp-sidenav-backdrop="false"`
as before.

### The side navigation's minor options

[Kenny, 2026-10-14; research/sidenav-minor] Opt-in, one attribute or one
token each; a panel that sets none of them looks and moves as before, in
every theme, and every opening and closing keeps the theme's own effect with
the close as the open backwards.

- **A narrower panel on a narrow screen.** Set `--kp-sidenav-width-narrow`
  (say `18rem`) on the panel or above it. While `data-kp-sidenav-over-below`
  holds the panel as an `over` panel (40rem and narrower, or the length you
  gave it; the module writes `data-kp-sidenav-narrow`) the panel is that
  wide instead of `--kp-sidenav-width`. Unset, it keeps the width it has
  everywhere else.
- **Floating.** `data-kp-sidenav-variant="floating"` detaches the panel from
  the window's edge: a gap all round (`--kp-sidenav-float-inset`, default
  `--kp-space-sm`), the theme's radius (`--kp-sidenav-float-radius`,
  `--radius`), an edge on every side (`--kp-sidenav-float-edge`, `1px solid
  --border-strong`) and a shadow made of the theme's own tokens (its hard
  `--fx-shadow-offset` where it has one, plus a soft drop,
  `--kp-sidenav-float-shadow`). Push and gutter leave the gap on both sides
  of the panel, the edge tab rides on its edge, and a shut panel leaves
  nothing on the screen. The theme's opening and closing play as they do on
  the flush panel; a register that reveals the panel by a number of its own
  hands it to `--kp-sidenav-float-ink` on the panel (pastel does), so the
  edge and the shadow come and go with it.
- **Inset.** `data-kp-sidenav-variant="inset"` keeps the panel flush with the
  window, on the page's ground and with no edge of its own, and makes the
  content (the element `data-kp-sidenav-content` names, which the module marks
  `data-kp-sidenav-inset="start|end"`) a rounded card beside it: the theme's
  card ground, radius, edge and shadow, with a gap round it
  (`--kp-sidenav-inset-gap`, default `--kp-space-sm`; `--kp-sidenav-inset-radius`,
  `--kp-sidenav-inset-edge`; set them on the panel and the module carries them
  to the card). The push and the gutter clear the panel exactly; over the page
  the panel stands in front of the card. The card is the module's doing, so a
  page without it keeps the flush panel only.
- **A peek strip.** Set `--kp-sidenav-peek` (say `0.75rem`) on the panel or
  above it and a thin strip of the panel stays at the window's edge while the
  panel is shut: the module makes a `.kp-sidenav__peek` element beside the
  panel (aria-hidden, no pointer, drawn in the theme's `--muted` ground,
  `--kp-sidenav-peek-surface`, and strong edge). A theme's own opening and
  closing run where the panel stands, not from the edge, so the strip is a
  part of its own that is simply always there under the panel: the effect
  does not change. A push panel keeps the strip's room in the content while
  it is shut (the edge tab stands beside the strip), and a gutter already
  holds it. **Over the page the strip is the one thing that overlaps the
  content**, by exactly its width; nothing else of the panel does. A floating
  panel hides the strip while it is open. Without the token there is no
  strip, and the module does nothing.
- **Density.** `data-kp-sidenav-density="compact"` or `"comfortable"` on the
  panel is one attribute that only sets tokens the panel already reads: a
  row's block padding, its type size, the icon's width and the header and
  footer padding. Default (no attribute) is 37px a row; `compact` is 29px
  (above the 28px floor under a control) and `comfortable` 45px. The gap
  between rows, the list's padding and whatever a theme says about its own
  rows stay the theme's. It is the panel's own preset, apart from the
  page-wide `data-density="compact"`.
- **An action beside an item.** A trailing icon button next to a link: make
  the list item a `.kp-sidenav__row` and put the link and the button in it as
  siblings, never the button inside the link, so pressing it cannot follow
  the link. Both are in the tab order, in that order, and the button has an
  accessible name of its own. Put the theme's own `.kp-icon-button` on it
  too and it wears the theme's icon button, with this component's size and
  place:

  ```html
  <li class="kp-sidenav__row">
      <a class="kp-sidenav__link" href="/alarms">
          <span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span>
      </a>
      <button type="button" class="kp-icon-button kp-sidenav__action" aria-label="More about Alarms">
          <span aria-hidden="true">⋯</span>
      </button>
  </li>
  ```

  The button is as tall as its row (so it follows the density preset) and
  `--kp-sidenav-action-size` wide (2rem), a gap of `--kp-sidenav-action-gap`
  (0.25rem) from the link; hover is the link's, and its focus ring is drawn
  inside it, where the panel's scroll cannot cut it. In the collapsed rail the
  actions go with the labels.

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

Cyberpunk by default — pass `when` (a theme name, a list, a boolean, or a
function of the theme) to run them elsewhere; plain text for anyone who
asked for less motion — and they keep listening, so turning that setting on
mid-session stops them without a reload. The real string always reaches a
screen reader through `aria-label`, whatever the glyphs are doing.

`BootSequence` needs the optional `motion` peer, so it is not in the `fx`
barrel: import it from `@kp-soft/themes/fx/boot-sequence`. The other three
need nothing, and every glyph set, speed, density and colour they use is a
prop.

Since 5.0.0 `DecipherText` is a wrapper around `attachEffects()` from
`js/effects.js`: it renders the headline reveal the current theme
declares (cyberpunk deciphers, synthwave tracks, brutalism slams,
formal stays still), and
its 4.x props `delay`, `direction`, `preserve` and `glyphs` are gone —
`charsPerSecond` and `reduceMotion` remain (`MIGRATION.md`).

## Which register a page loads [CF1, CF2, CF3]

Every theme has a register — the opt-in stylesheet carrying its
expression — and a page with a picker can end up on any of the
twelve. There are two ways to handle that, and the package supports
both.

The simple one is `dist/kp-themes.css`: sixteen stylesheets in one
file, including all twelve registers, each scoped to
`[data-theme='name']`. Load it once and a theme change fetches nothing —
`applyTheme()` sets the attribute and the right register is already
there. It costs 693 kB minified.

The frugal one is a `<link>` whose `href` follows `onThemeChange`. A
register averages 20 kB minified (dark 44 kB, solstice 12 kB), so a visitor
who stays in one theme downloads far less; the cost is a request per
switch and a frame between the old register leaving and the new one
arriving.

If you serve your own files, take the bundle. If bytes over the wire are
the constraint, take the link. README.md has both snippets.

**Taking the files.** A release attaches `consumer.tar`: everything the
checksum manifest names except the fonts (they ship as `fonts.tar`) and
the source maps. It carries `SHA256SUMS` itself, so:

```sh
tar -xf consumer.tar
sha256sum -c --ignore-missing SHA256SUMS
```

The flag matters. The manifest inside is the release's own and names the
fonts and maps the tarball leaves out, so a bare `sha256sum -c` buries
ninety-two `OK` lines under a hundred-odd warnings about files that were
never supposed to be there.

**One module instead of eight.** `dist/kp-themes.js` exports every
published module: a namespace per module (`comboboxExports`,
`themeCoreExports`, …) plus every function and constant that exactly one
module declares, flat. So `attachThemePickers`, `enforceContracts`,
`attachConfirmations`, `attachSkipLinks` and `applyStoredTheme` come
straight out of it. Two names are namespace-only — `OPEN_EVENT` and
`MATCHERS` — because combobox, datepicker and palette each declare their
own, and a flat one would silently be somebody else's.

## Knowing where a reveal is [TF2]

`js/effects.js` writes `data-kp-reveal-state` on every element it handles:

| Value | What it means |
| --- | --- |
| `armed` | wired to its `data-kp-reveal-trigger` and waiting for it; nothing has run |
| `rest` | settled without playing — reduced motion, no routine, or already seen this session |
| `played` | the routine ran |

Read it whenever you need to know, rather than having had to listen. The
`kp-reveal` event still fires and carries the same information in its
detail; the difference is that the attribute is still there afterwards.

```js
const dossier = document.querySelector('[data-kp-reveal="emphasis"]');
if (dossier.dataset.kpRevealState === 'armed') showTheHint();
```

An element with no value has not been handled yet — a `rule` below the
fold waiting for the viewport reads exactly that way, which is how to tell
"not yet" from "nothing to do".

## The marquee, and the menu's caption [M1, M3]

Two shared elements round six added. Both are meaning in your HTML and
expression in the theme: you say what the thing is, the register says what
it looks like.

**A marquee** is one row of items that passes. `js/effects.js` builds the
track, doubles the row so the pass is seamless and hides the copy from a
screen reader, so both channels produce the same DOM — and a page that
never loads the module shows the items standing still rather than broken.

```html
<div data-kp-marquee>
    <span>EUR 1.0842</span><span>GBP 0.8531</span><span>JPY 156.20</span>
</div>
```

```jsx
<Marquee items={rates} duration="42000ms" pause="never" label="Exchange rates" />
```

Two knobs, both settable inline and both answerable by a theme:
`--kp-marquee` (how long one pass takes) and `--kp-marquee-pause`
(`offscreen`, the default, or `never`). Resting off screen is the default
because a band nobody is looking at should not keep a compositor awake.
Give it a `label` only when the content is information; scenery is better
left unlabelled.

**A menu caption** is a line above a nav dropdown's items saying what the
menu is — blueprint's title block reads "Detail · scale 4:1" there. Set
`menuLabel` on the NavBar's link, or `data-kp-menu-label` on the
`.kp-nav__menu` by hand. A menu without one has no line at all, so nothing
appears where nothing was asked for, and every register draws it its own
way.

## The hook vocabulary [S45]

Since 5.0.0 a page marks what a passage *is* and every theme answers in
its own way — loudly in cyberpunk, synthwave and brutalism, quietly
in the rest. Six
hooks: `data-kp-surface="hero|app"` on a section, a `<mark>` for an
emphasis, `data-kp-reveal="headline|emphasis|rule"` on something that
arrives, `data-kp-divider` between sections, the heading accent (an
`h1` or `h2` inside a surface), and `--kp-arrival` on the root for how a
page comes on. The reveals need `js/effects.js`, which `js/auto.js`
attaches: `attachEffects(root, { threshold, cps, stagger, delay,
reduceMotion })` returns `{ detach, observe }`. They run once per session
per page (`data-kp-reveal-every="load"` opts back in), announce
`kp-reveal` with `{ reveal, routine, skipped }`, report an unknown value
once as `kp-effect-unknown`, and resolve to their rest state under
reduced motion — a page without the script shows the rest states.
`README.md` has the table of what each theme answers;
`themes/hooks.json` is the matrix the gate reads.

A surface keeps its content off its own inline edges in every theme:
`--kp-surface-padding-inline`, the lg step, is the room between the
ground a surface paints and its first letter; it gives way on a surface
of 20rem or less, where the content needs every pixel, and the block axis
is left to the section rhythm. `data-kp-surface-align="center"` sets a surface's
content on its middle — the text centres, a narrower child takes auto
margins, a `.kp-row` centres its controls — and is off unless a page
writes it. A theme that covers a phrase inside
`data-kp-reveal="emphasis"` paints the cover as the mark's own background,
cloned onto every line the phrase takes (`box-decoration-break: clone`), so
a redacted phrase may wrap like any other words and stays covered line by
line [fix-33]; a theme that answers with its own pseudo-element keeps the
phrase from wrapping.

The arrival's words are the theme's own [scope-84]: synthwave's counting
boot reads `arrivalWordsByTheme.synthwave` ("▶ Play", "Tracking",
"Press start"); `arrivalLinesByTheme` holds a theme's own lines when it
prints several (none of the twelve does since terminal left). A theme
that asks for `boot` with no entry shows the neutral `arrivalLine`,
`arrivalProgress` and `arrivalReady` ("Loading", "Progress", "Ready").
To change synthwave's words, set `arrivalWordsByTheme` with `setStrings`;
setting `arrivalLine` alone changes only the neutral line. How fast the
arrival plays is `--kp-arrival-rate` on the root: every wait is divided
by it and the overlay's animations play at it, so `0.5` takes twice as
long; unset, it is 1.

The headline reveal waits for the arrival [scope-86]: while the overlay is
on screen a `data-kp-reveal="headline"` is held, and its routine starts the
moment the overlay is removed — at its own end, on Skip, on a click, or on
`detach()`. Without an arrival (a theme that declares none, seen this
session, reduced motion) the headline starts at once, as before.

## The side navigation [feat-nav-3]

A navigation that stands beside the content instead of above it: three
modes, a slim rail that keeps the icons and drops the words, categories
that fold, and either edge.

Both channels render the same markup. The React component writes the
element and the knobs; `js/sidenav.js` — which `js/auto.js` attaches —
does the behaviour, so a page that never loads the module still shows a
working list of links.

```jsx
import { Sidenav, SidenavToggle } from '@kp-soft/themes';

<SidenavToggle controls="nav">Menu</SidenavToggle>
<Sidenav
    id="nav"
    label="Sections"
    title="Sections"
    mode="over"
    backdrop
    items={[{ label: 'Overview', href: '/', current: true }]}
/>;
```

Every attribute the module reads is a prop, and one you leave out keeps
the module's own default rather than restating it. The component attaches
itself on mount, because `js/auto.js` runs at load and React mounts after
it — pass `autoAttach={false}` if you attach on your own schedule.

The way out of the opened state is the handle:

```js
import { sidenavOf } from '@kp-soft/themes/js/sidenav';

const handle = sidenavOf(ref.current);
handle.open();
handle.setMode('side');
handle.isOpen();
handle.destroy();
```

Without React, write the same markup and let `js/auto.js` find it:

```html
<button type="button" class="kp-sidenav__toggle" data-kp-sidenav-toggle aria-controls="nav">Menu</button>
<nav class="kp-sidenav" id="nav" aria-label="Sections" data-kp-sidenav-mode="over" data-kp-sidenav-backdrop>
    <div class="kp-sidenav__scroll">
        <ul class="kp-sidenav__list">
            <li><a class="kp-sidenav__link" href="/"><span class="kp-sidenav__label">Overview</span></a></li>
        </ul>
    </div>
</nav>
```

### A rail that collapses from its own toggle [scope-48]

`data-kp-sidenav-slim` allows the rail. A button with
`data-kp-sidenav-slim-toggle`, pointed at the panel by `aria-controls`,
collapses it to its icons and gives the words back; without
`aria-controls` it drives every rail on the page. No script of your own:
the module keeps `aria-expanded` on the button (true while the rail is
wide) and fires `kp-sidenav-slim` with `{ collapsed }` on the panel. A
button with no words of its own — empty, or holding only an `aria-hidden`
glyph — is named from the dictionary (`collapseRail`, `expandRail`), and
the name says which way the press goes. The button is not replaced when
the rail changes, so the focus stays on it.

```html
<nav class="kp-sidenav" id="rail" aria-label="Invoices" data-kp-sidenav-slim>
    <div class="kp-sidenav__scroll">
        <ul class="kp-sidenav__list">
            <li>
                <a class="kp-sidenav__link" href="/invoices" aria-current="page"
                    ><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">All invoices</span></a
                >
            </li>
        </ul>
    </div>
    <div class="kp-sidenav__footer">
        <button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="rail">
            <span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span>
            <span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span>
        </button>
    </div>
</nav>
```

In React the button is `SidenavSlimToggle`, and `footer` on `Sidenav` puts
it under the list:

```jsx
import { Sidenav, SidenavSlimToggle } from '@kp-soft/themes';

<Sidenav
    id="rail"
    label="Invoices"
    slim
    items={[{ label: 'All invoices', href: '/invoices', icon: '▤', current: true }]}
    footer={<SidenavSlimToggle controls="rail" className="kp-sidenav__link">…</SidenavSlimToggle>}
/>;
```

The labels of a collapsed rail leave the eye and stay in the
accessibility tree, so every link keeps its name; give every link a label
even when the rail starts collapsed.

### The application shell

`examples/app-shell.html` puts the parts together, in both channels from
one descriptor (`showcase/examples.mjs`): the bar across the top for the
product's areas, the rail beside the content for the pages of the area the
reader is in, and a `.kp-breadcrumb` that says where in it. The row is
`kp-d-flex kp-flex-wrap` with the rail and a `kp-flex-1` column, so in a
narrow window the content drops under the rail instead of pushing the page
sideways; the breadcrumb comes
before `<main>`, so the skip link passes it along with both navigations.
No page stylesheet is involved.

## What a page remembers [Kenny, 2026-09-16]

Some state belongs to the reader rather than to the page. A group of links
the reader folded away should still be folded on the page the link led to;
a divider they dragged should be where they left it. Kenny's words, after
closing the review site's Components group and clicking a link: *"de
sidenav moet zijn state onthouden … Dit gedrag moet tellen voor alle
elementen waar dit verwacht wordt door een user."*

**It is opt-in, and the element names itself.** Write
`data-kp-remember="<name>"` on the component and it remembers; leave it off
and this package writes nothing at all into your storage.

```html
<nav class="kp-sidenav" id="nav" aria-label="Sections" data-kp-remember="main-nav">
    <div class="kp-sidenav__scroll">
        <ul class="kp-sidenav__list">
            <li class="kp-sidenav__category" data-kp-sidenav-expanded data-kp-remember="components">
                <button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__label">Components</span></button>
                <div class="kp-sidenav__submenu">
                    <ul class="kp-sidenav__list">
                        <li><a class="kp-sidenav__link" href="/button"><span class="kp-sidenav__label">Button</span></a></li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</nav>
```

Fold that group away, follow the link, and it is still folded. Nothing
else is needed: `js/auto.js` restores every remembering element before the
first frame, and each module goes on reading the markup. A page that
attaches modules itself calls `restoreRemembered()` once, as early as it
can, and `attachRemembered()` for its `<details>` disclosures.

`attachRemembered(root)` also wires a remembering `<details>` added under
`root` later, and paints its memory in the same step, before the browser
paints it: a live page that rebuilds its groups on every refresh shows each
one as it was left, with no frame of its markup default. While
`data-kp-remember-hold` is on the element or an ancestor, the memory is
neither painted nor written (a page that opens every group while a search
runs); when the hold goes, the stored state is painted back.
`forgetRememberedExcept(component, prefix, names)` removes the stored state of
every name of that component starting with `prefix` that is not in `names`,
so a board whose groups come and go can prune what it remembers.

A group whose title is the page's own, rather than an accordion's, takes
`.kp-accordion__item--bare`: the accordion's glide and memory with none of
its chrome. Give its summary a class of your own, not
`.kp-accordion__summary`, which every register paints.

```html
<details class="kp-accordion__item kp-accordion__item--bare" open data-kp-remember="apps-media">
    <summary class="kp-text-muted kp-fs-sm">Media</summary>
    …
</details>
```

**The key is composed, never hardcoded**:

```text
kp-remember:<component>:<name>:<slot>
kp-remember:sidenav:main-nav:groups
```

`<component>` is the package's own word for the kind of thing, `<name>` is
what the element wrote, `<slot>` is which piece of state. The page is
deliberately not part of it — the state has to cross a navigation, which is
the whole case. An author who wants a per-page memory gives the element a
per-page name. A group inside a side navigation may carry its own
`data-kp-remember` too; without one it is known by the words in its toggle,
so a group renamed starts fresh rather than inheriting a stranger's state.

What each component keeps:

| Component | `data-kp-remember` on | Slots |
| --- | --- | --- |
| side navigation | `.kp-sidenav` | `groups` (which categories are folded), `open`, `rail` |
| accordion, any disclosure | a `<details>` | `open` |
| tree | `[data-kp-tree]` | `branches` |
| split pane | `[data-kp-split]` | `value` |
| data table | `[data-kp-datatable]` | `columns`, `sort`, `density` |

Everything transient is deliberately left out: dialogs, popovers, menus,
tooltips, toasts, the combobox, the date picker, a wizard's step and the
alarm. Each of those is a thing the reader opened for a moment, and a page
that reopens one by itself on the next load is a page arguing with its
reader. A reorder list is left out for a different reason: the order is the
app's data, and `kp-reorder` hands it over so the app can store it where
its data lives.

**Two elements, one name.** Two of the same component with different names
keep separate state — that is what naming them buys. Two with the SAME name
are a fault: the first to attach owns the key, the second is refused a
memory entirely (it works, at its markup default, and writes nothing), and
the clash is reported once in the console and as `kp-remember-clash` on the
element that was refused.

**When there is no storage** — a private window, a browser set to refuse
site data — every read and write fails quietly and every component works at
its markup default. Nothing throws.

**The way out** [KT6]: `configureRemember({ prefix, storage })` sets the
first key segment and where the values go for the whole document
(`storage: null` turns the mechanism off without touching a component), and
`memoryFor(element, component)` hands you the composed key and its
`read` / `write` / `forget`, so a consumer can clear or migrate what this
package wrote.

```js
import { configureRemember, memoryFor } from '@kp-soft/themes/js/remember';

configureRemember({ prefix: 'acme' });
memoryFor(document.querySelector('#nav'), 'sidenav')?.forget('groups');
```

One thing this cannot do: a frame the browser paints between the end of the
parse and the deferred module — the window before any script can address an
element that has just been parsed. `js/auto.js` restores at the earliest
moment a DOM-dependent restore exists, which is before `DOMContentLoaded`.
A page that builds its navigation with script calls
`paintRemembered(element, 'sidenav')` before it puts it in the document, so
the restored state is the first thing drawn; the review site does exactly
that.

## Numbers that count up [feat-count-1]

Write the final number. The module reads it, counts to it, and puts the
same string back — so a page without the module, and a reader who asked
for less movement, both simply see the number. Nothing is ever hidden
behind the animation.

```html
<span data-kp-count>1204</span>
```

Which character groups the digits and which one is the decimal point is
not decidable from the string: `1.204` is one thousand two hundred and
four in Dutch and one-point-two-oh-four in English. The nearest `lang`
decides, so the module never guesses.

```html
<p lang="nl"><span data-kp-count>1.118.204,75</span></p>
<p lang="en"><span data-kp-count>1,204.50</span></p>
```

Two knobs, both custom properties, so a theme may answer them and you may
override one without losing the other. `--kp-count` is how long it takes
in milliseconds and `--kp-count-from` is where it starts. **`--kp-count: 0`
means no counting at all** — a deliberate zero, not an absent value.

The element carries `data-kp-count-state`: `running` while it counts,
`done` afterwards. A `kp-count` event fires when it lands, with the value
in `detail`.

### A number that ticks when it changes [kpadopt4-data]

`data-kp-count` counts once, when a number arrives. A live counter changes after that; mark it `data-kp-tick` and write the
new number as always (text, or a framework re-render). `js/tick.js` counts from the number shown to the new one in its own
precision and the page's language, and lands on exactly the text written. `--kp-tick` is the length in ms (600; `0` none);
reduced motion writes the number at once. `tickTo(el, text)` does the same by call.

```html
<span class="kp-kpi__value" data-kp-tick>1,204</span>
```

## Data pieces [kpadopt4-data]

Five things Kenny's apps drew by hand, drawn from the tokens until each register answers them.

**The identity mark.** `<span class="kp-idmark" data-kp-idmark="Acme Logistics" aria-hidden="true"></span>`: two letters on a
wash of one of the theme's five chart colours, the same for a name everywhere. `--pattern` draws a mirrored 5 by 5 pattern
instead, `--round`, `--glyph` (a corner shape), sizes `--xs` to `--xl`, `data-kp-idmark-hue="free"` for a hue of its own.
Marks inside one `data-kp-idmark-set` never share a colour while one is free (`idmarkColours(names)`). Put the name beside it in
`.kp-idmark-name`; `.kp-idmark-group` overlaps several with an exact `.kp-idmark-group__more`. `js/idmark.js`: `idmarkFor`, `setIdmark`.

**The share bar.** `setStackbar(el, { title, total, format, parts: [{ key, label, value }], marks })` on a
`figure.kp-stackbar` (`js/stackbar.js`) draws the parts in the chart colours, the rest as the track, and a legend with every
exact value. Each part has a hover card and the arrow keys walk them; `kp-stackbar-pick` tells the page which. `state` is
`loading`, `empty` or `error`, each at the bar's height.

**Bullet rows.** `setBullets(el, { threshold, rows: [{ key, label, detail, value, lead, href }] })` on a `.kp-bullets`
(`js/bullets.js`): one meter per row with its tick on the threshold, the exact figure beside it, worst first; past the threshold
the warning tone, past `bad` the destructive one. Loading lays the data table's busy card over waiting rows.

**Key-value grids and form rows.** CSS only:

```html
<dl class="kp-kv kp-kv--lines">
    <div class="kp-kv__row"><dt>Host</dt><dd>pve-01</dd></div>
</dl>
<div class="kp-formrows">
    <div class="kp-formrow">
        <label class="kp-formrow__label" for="ret">Retention</label>
        <div class="kp-formrow__control"><input class="kp-field__input" id="ret" /></div>
        <div class="kp-formrow__aside">Default 14</div>
    </div>
</div>
```

The label column is as wide as the longest label; `--stack` and `--columns` for the grid, `--top`, `--wide`,
`data-kp-changed`, `data-kp-state="error"` and `data-kp-locked` for a row. Under 36rem a form row reads top to bottom.
Cells stand on the row's first baseline and a control takes the width of its kind (a field the track, a short control one
step). To line a form up with a key-value panel and its buttons, put them in one `.kp-formgrid` (see "Forms, settings,
facts and buttons: the form grid").

**The code block.** `<figure class="kp-code" data-kp-code data-kp-code-title="Payload" data-kp-code-language="JSON"><pre><code>…</code></pre></figure>`
or `setCode(el, { text, title, language, lines, maxLines, truncated, state })` (`js/code.js`): Pretty and Raw for JSON, Wrap,
Copy (its word keeps one width), line numbers outside the text, a fold with "Show all N lines", and loading under the busy card.

**The page header's heading line.** `.kp-page-header__heading` holds a `.kp-page-header__lead` (a mark) and a
`.kp-page-header__line` with the title, a badge and the freshness line (`.kp-ago.kp-page-header__meta`).

## Two surfaces a theme may paint on a button [scope-16, scope-17]

Every button carries an empty `.kp-button__edge`, out of flow and inert
unless a register styles it. Two themes run an oxide film along it; the
rest never notice it is there. You do not have to do anything.

The second is optional and is yours to fill: a small reading above the
control.

```jsx
<Button variant="primary" readout="READY">
    Send
</Button>
```

It is decoration over a control that already has a name, so it carries
`aria-hidden` and is never announced — put meaning in the label, not here.
A theme that does not style it shows nothing, and a page that passes no
`readout` renders no element at all.

## The pointer, for a theme that wants it [scope-16, scope-101]

A theme that declares `--kp-pointer: track` has `--kp-px` and `--kp-py`
written to the root as the pointer moves, both 0 to 1. That is all: the
theme decides what to do with them, and a theme that does not ask pays
nothing. The bus writes once per animation frame, does not run under
reduced motion, and removes what it wrote when the module is detached.

The same bus also writes a per-ELEMENT light, for a theme that declares
`--kp-light: pointer` as well [scope-101, from scope-25]. No shipped
theme declares it since the two Shade themes were removed (2026-10-06);
the mechanism stays for a theme that wants it. Two root numbers cannot say which way a shadow falls, because
"away from the pointer" is a different direction for every box on the
screen, so each card, plain button and hero surface gets six properties of
its own:

| Property | What it is |
| --- | --- |
| `--kp-light-x`, `--kp-light-y` | the direction away from the pointer: about 1 at 240px and beyond, shrinking to 0 directly under it |
| `--kp-light-near` | 1 under the pointer, 0 at 560px and further |
| `--kp-light-lift` | `0.6 + near`, for a theme that lengthens its shadow with the light |
| `--kp-light-at-x`, `--kp-light-at-y` | where the pointer sits inside the element's own box, in px |

Write every rule with the fallback it had before — `var(--kp-light-x, 1)`
— because there is no pointer on a touch screen, none while a reader is
tabbing, none under reduced motion and none without the module. A theme can
multiply its shadow offsets by `x` and `y`, or by `x * lift` and paint a
radial patch of the foreground at `at-x`/`at-y`, faded by `near`. The light goes out on a touch, on Tab, when the pointer
leaves the window and when the module is detached.

## The press point, for a theme that wants it [scope-101]

A theme that declares `--kp-press: point` has `--kp-press-x` and
`--kp-press-y` written to the button a press started on, in pixels from
that button's own top left corner. Sepia asked for it (it was dropped on
2026-10-08; no theme asks today), because its press
grows a stain of ink and ink spreads from where the nib touched down, not
from the middle of the plate. CSS knows a button is being pressed; it
cannot know where.

The theme declares its own default for both, so the gesture is whole
before a pointer has ever touched it: a key press, a page with no module,
and a detached module all fall back to that value, and Sepia's was the
middle of the button. Unlike the pointer bus this one stays armed under
reduced motion — someone asking for less movement is not asking for the
stain to appear in the wrong place; the register gives them the same
stain without a transition.
## How a theme moves

A theme's handwriting is three tokens, and every transition in the package
reads them rather than carrying its own number — with three exceptions the
motion gate insists on: the skeleton pulse and
the cyberpunk flicker change luminance, and DI5 pins their durations above
the flash threshold, so they are literals rather than knobs:

| Token | What it decides |
| --- | --- |
| `--fx-duration` | how long anything takes — 220 ms in pastel, 240 ms in solstice |
| `--fx-ease` | how it accelerates. Pastel overshoots, blueprint is `linear` |
| `--fx-lift` | how far a control rises under the cursor. Most of the twelve answer `0px` — formal among them — which is a character rather than an omission |
| `--fx-shadow-offset` | how far a hard, unblurred shadow sits from a button, card or input — brutalism's `4px`; `0px` everywhere else, which paints nothing (3.1.0) |
| `--chart-pattern-1` … `-5` | an image drawn over the matching `--chart-*` colour so a series is told apart without hue — mono's five SVG fills; `none` everywhere else (3.1.0) |
| `--kp-highlight` | the hover and keyboard-highlight wash on rows and options — the foreground at 8% alpha by default, so it is quiet in every theme; a theme or a page sets it for more (3.1.0) |
| `--kp-control-accent` | what the browser paints a check and a radio dot in — `--primary` by default (the progress bar stopped reading it in 9.0.0: each register draws its own); brutalism and mono set it because their primary is the ink (3.1.0) |

A native `<select>`'s open list wears the theme only where the browser lets a page take it over (`appearance: base-select`, Chromium 135+); Firefox and older browsers draw that list themselves, in the platform's highlight colour. So the package draws it: every single `<select class="kp-field__input">` gets a listbox in the combobox's look laid over it by `attachSelects` (which `auto.js` runs) and by the React `Field`, `FormField` and `DataTable`, without asking. The native select stays the control — it holds the value, submits with the form, fires `change` and is what a screen reader reads. To keep the browser's own list on one select, write `data-kp-select="native"` (React: `drawn={false}`); a `multiple` select always keeps it. A bare `data-kp-select` still asks for the drawn list on a select without the class.

Each theme also has at most one gesture of its own: a rule that draws
itself under a heading in formal, a
badge that settles in pastel, a drifting contour layer in forest, a ruled
line in blueprint, an ember around a new card in solstice, the whole
register in cyberpunk; since 3.1.0 a box that drops onto its shadow in
brutalism, a double gold rule in deco,
and since
5.0.0 the horizon register in
synthwave — a striped sun and a drifting floor on the hero, a neon tube
that a `<mark>` switches on, a laser line under a heading, a boot line
with a Skip once per session. Every theme has one now. What differs is how far it goes — the
data-dense one and the medium-contrast pair each answer the six hooks
quietly, because a loud gesture there works against the reason the theme
exists.

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
