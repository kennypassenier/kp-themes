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

## The twenty-five themes

| `data-theme` | Label | Dark |
| --- | --- | --- |
| `formal` | Formal | no |
| `light` | Light | no |
| `dark` | Dark | yes |
| `cyberpunk` | Cyberpunk | yes |
| `synthwave` | Synthwave | yes |
| `pastel` | Pastel | no |
| `terminal` | Terminal | yes |
| `topo` | Topographic | no |
| `high-contrast` | High contrast | no |
| `sepia` | Sepia | no |
| `blueprint` | Blueprint | yes |
| `solstice` | Solstice | yes |
| `brutalism` | Brutalism | no |
| `deco` | Art Deco | yes |
| `academia` | Dark Academia | yes |
| `phantom` | Phantom | yes |
| `ticker` | Ticker | yes |
| `nishiki` | Nishiki | no |
| `shade-light` | Shade (light) | no |
| `shade-dark` | Shade (dark) | yes |
| `mono` | Mono | no |
| `retro` | Retro | no |
| `grotesk` | Grotesk | no |
| `tazhib` | Tazhib | yes |
| `nostromo` | Nostromo | no |

Eleven of these are the set 3.0.0 shipped; the thirteen from `brutalism`
on arrived in 3.1.0, chosen and researched in `THEME_CANDIDATES.md`;
`synthwave` is 5.0.0's, the first theme lifted after cyberpunk on the
research in `RESEARCH_2026-09.md` (LIFT_PLAN row 1); `phantom` is the
second, rebuilt from its approved demo "Calling Card" (row 2); `retro`
is the third, its 3.1.0 bevel register grown into the whole desktop from
"Bevel 95" (row 3).

That table is generated from the token sources into
`js/theme-registry.js`; import it rather than typing the list:

```js
import { THEMES, DEFAULT_THEME, STORAGE_KEY } from '@kp-soft/themes/js/registry';
```

Each theme's character is written down — what it is, what is load-bearing,
what it deliberately does not do — in `themes/<name>/anatomy.md`. Read the
one you are about to change before you change it.

The `Theme` type is the union of exactly those twenty-five names since 1.1.0,
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

## What a scroll region clips [TH114]

Three boxes in this package scroll sideways inside themselves rather than
widening the page: `.kp-table-wrap` (`css/components.css:708`), `.kp-diff`
(`css/components.css:1979`) and every `<pre>` (`css/_rules.css:459`). Each
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
(`css/components.css:901`) is a `popover` element.

Two things about that which surprise people, both measured rather than
assumed:

- **A popover does not sit relative to its DOM parent.** Its
  `position: absolute` resolves against the initial containing block, so
  the same `inset-block-start: 100%` that means "just under this box" for
  an ordinary absolute child means "the bottom of the viewport" for a
  popover — measured `top: 720px` in a 720px-tall viewport. Place it with
  anchor positioning, the way `.kp-popover` does
  (`position-area: block-end span-inline-end`, `css/components.css:917`),
  not with insets.
- **`container-type` does not make `.kp-table-wrap` a containing block.**
  The wrapper carries `container: kp-table / inline-size`
  (`css/components.css:726`) for the card breakpoint, and that does not
  catch an absolutely positioned descendant: with no `position` on the
  wrapper, such a child resolves against the initial containing block and
  lands somewhere else entirely — measured, the wrapper spanning 0–114px
  and the child at 580px.

The clip is not a defect and there is no repair for it: `overflow-x: auto`
is what keeps a wide table off the page's own scrollbar (SC 1.4.10, DI11).
Use the top layer for the thing that has to escape.

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
declares (cyberpunk deciphers, synthwave tracks, phantom shouts, retro
dissolves, formal stays still), and
its 4.x props `delay`, `direction`, `preserve` and `glyphs` are gone —
`charsPerSecond` and `reduceMotion` remain (`MIGRATION.md`).

## The hook vocabulary [S45]

Since 5.0.0 a page marks what a passage *is* and every theme answers in
its own way — loudly in cyberpunk, synthwave, phantom and retro, quietly in
the rest. Six
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

## How a theme moves

A theme's handwriting is three tokens, and every transition in the package
reads them rather than carrying its own number — with three exceptions the
motion gate insists on: the terminal cursor blink, the skeleton pulse and
the cyberpunk flicker change luminance, and DI5 pins their durations above
the flash threshold, so they are literals rather than knobs:

| Token | What it decides |
| --- | --- |
| `--fx-duration` | how long anything takes — 90 ms in terminal, 240 ms in sepia and solstice |
| `--fx-ease` | how it accelerates. Pastel overshoots, terminal uses `steps(2, end)` because a character display jumps rather than sweeps, blueprint and high-contrast are `linear` |
| `--fx-lift` | how far a control rises under the cursor. Formal, sepia and high-contrast answer `0px`, which is a character rather than an omission |
| `--fx-shadow-offset` | how far a hard, unblurred shadow sits from a button, card or input — brutalism's `4px`; `0px` everywhere else, which paints nothing (3.1.0) |
| `--chart-pattern-1` … `-5` | an image drawn over the matching `--chart-*` colour so a series is told apart without hue — mono's five SVG fills; `none` everywhere else (3.1.0) |
| `--kp-highlight` | the hover and keyboard-highlight wash on rows and options — the foreground at 8% alpha by default, so it is quiet in every theme; a theme or a page sets it for more (3.1.0) |
| `--kp-control-accent` | what the browser paints a check, a radio dot and the progress bar in — `--primary` by default; brutalism and mono set it because their primary is the ink (3.1.0) |

A native `<select>`'s open list wears the theme only where the browser lets a page take it over (`appearance: base-select`, Chromium 135+). Firefox and older browsers draw that list themselves, in the platform's highlight colour — a known limitation since 3.1.0, not a bug in a theme.

Each theme also has at most one gesture of its own: a rule that draws
itself under a heading in formal, a blinking block cursor after the label
of the field a person is typing into in terminal (3.1.1), a
badge that settles in pastel, a drifting contour layer in topo, a ruled
line in blueprint, an ember around a new card in solstice, the whole
register in cyberpunk; since 3.1.0 a box that drops onto its shadow in
brutalism, a double gold rule in deco, a slower gold rule in academia, a
badge that slides in in phantom (and since 5.0.0 its cut-paper register:
the plate under a `<mark>`, the rail under a heading, the torn-paper
divider, the calling card on arrival), a hanko seal after a heading in
nishiki,
the bevel register in retro (and since 5.0.0 the whole desktop: the
dither a headline clears out of, the selection bar under a `<mark>`, the
groove under a heading and as divider, the POST on arrival), and since
5.0.0 the horizon register in
synthwave — a striped sun and a drifting floor on the hero, a neon tube
that a `<mark>` switches on, a laser line under a heading, a boot line
with a Skip once per session. Sepia, high-contrast, ticker, mono and
both halves of shade have none on purpose — in the restful theme, the
accessible one, the data-dense one and the medium-contrast pair, a
gesture works against the reason the theme exists.

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
