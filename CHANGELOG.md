# Changelog

## 5.0.0 — in progress

**Three themes changed name.** `topo` is now `forest`, `tazhib` is now
`lapis`, `nishiki` is now `woodblock` (Kenny, 2026-09-08, at their lift).
The rename is total — tokens, register, export path, Home Assistant
theme, example pages, the `Theme` type — and `MIGRATION.md` carries the
one-line map a consumer needs. The compare pages ask 4.0.0 for the name
4.0.0 knew, so a rename reads as a rename and not as a redesign.

**The next cyberpunk, and the first theme lifted after it.** Cyberpunk is
rebuilt on signal yellow under the same name (S39); `synthwave` is the
twenty-fifth theme, built from the approved concept demo "Outrun
Horizon" (2026-09-08) on the §25 research: the striped sun and the
drifting floor on the hero, the horizon as divider, chrome type with one
tracking wipe and one shine, the neon tube a `<mark>` switches on, the
laser line under a heading, a boot line with a Skip once per session
(`--kp-arrival: boot`, the sixth hook), VT323 as its mono face. Every
theme gained `theme-font-mono` (the contract is 96 tokens, S47) and the
base layer carries `[hidden] { display: none !important }` (KT13). The
fonts ship with the package; the two registers became three
(`css/synthwave-register.css`). `MIGRATION.md` has the consumer-facing
detail at C6.

**The second lift: phantom.** Built from the approved concept demo
"Calling Card" (2026-09-08) on the §15 research: black, white and one
red that is always a plate, never a word. The headline's words shout in
one after another (`--kp-reveal-headline: shout`), a `<mark>` is a plate
of cut paper shoved under the word (`slab`), the rail under a heading
sweeps from grey to red (`rail`), the divider is torn paper, every hover
is Omicron69's skewed bar, every button a key cap, every popover cut
paper arriving on a three-step film cut, and the page arrives as a
calling card — the theme's name, a red bar, the whole card shoved off to
the left (`--kp-arrival: card`, the second arrival routine). The
register is `css/phantom-register.css`; the effects module gained the
word routines (`shout`, `slam`), `dissolve` and `type` for the lifts
that follow.

**The third lift: retro.** Built from the approved concept demo "Bevel
95" (2026-09-08) on the §21 research (98.css, Win95 SGJ, 2bit.chat, the
NW pixel dissolve). The 3.1.0 bevel register grew into the whole 1995
desktop: the headline clears out of a dither in four discrete densities
(`--kp-reveal-headline: dissolve`), a `<mark>` is the selection bar that
drags across the words in eight steps (`select`), the groove under a
heading rules itself in, in twelve (`groove`), the dividers are the
shell groove — dithered band first, plain two-line second — the brand is
the title-bar ramp, every hover the selection bar, the default button
carries the navy bevel and the mirror modifier the one-pixel ink ring,
the selected tab lifts, the dossier is a Notepad window whose redactions
are the 50% dither brush lifting off, the scrollbar track the 2×2
checkerboard, and the page arrives through the POST (`--kp-arrival:
boot`) and leaves it through the pixel dissolve. VT323 is retro's DOS
voice for labels, help and status. Nothing eases, loops or blinks: every
step is discrete and every effect goes one way. The register stays
`css/retro-register.css`; on a surface the register sets the h1 in ink
with a hard white shadow where the 3.x theme painted a title bar.

**The fourth lift: terminal.** Built from the approved concept demo
"Green Phosphor" (2026-09-08) on the §6 research (PX PUSH, ekeijl,
dottxt.ai). The headline types itself one glyph at a time with a block
caret riding the last one (`--kp-reveal-headline: type`), a `<mark>` is
inverse video (`inverse`), the dashed rule under a heading types itself
out in twelve steps (`dashes`), the dividers are dashes with a plus at
each end, every hover is inverse video, the cta and the ghost button are
bracketed, the checkbox is `[ ]` and `[x]`, the dossier's redactions are
runs of character cells repainting left to right, the glass carries
ekeijl's bezel and the sweep band that crosses once every ten seconds,
and the page arrives through the POST and leaves it as the tube
collapses (`--kp-arrival: boot`). **The cursor moved (R6-Q7):** since
3.1.1 a blinking block sat after the label of the field being typed
into; it is gone from the base layer, and the register paints a block of
one character cell inside the focused text field at the caret — the
effects module writes the column (`--kp-caret: block` on the root,
`--kp-col` on the field), the register paints and blinks it. The
register is `css/terminal-register.css`.

**The demos, exactly (S49).** Kenny's rule of 2026-09-08: an approved
concept demo is implemented exactly, every token and every element, and a
test or a gate that disagrees produces a finding for him rather than a
quiet change. Four read-only audits (`docs/audits/`) measured the four
registers built since C5 against their demos and found fifty deviations;
he answered eleven of the twelve groups "Demo exact". What that changed:

- **The words.** `examples/concept-<theme>.html` is one page per theme
  with an approved demo — the same structure and the same markers (S46),
  the theme's own words, its own theme in the markup. Until now every
  theme's concept page carried cyberpunk's copy. `showcase/concept-copy.mjs`
  holds the ninety slots per theme and a unit test refuses a page that
  says another theme's headline; the React channel takes `?copy=<theme>`.
- **The chrome.** Retro is an application window on the teal desktop
  again, with its window controls, its resize grip, its groove well and
  the segmented bar its POST counts along; the arrival routine learns a
  lines mode fed by the dictionary (`arrivalLinesByTheme`), so a theme's
  boot is its own five POST lines rather than one percentage counter.
- **The values.** Retro's title-bar ramp, terminal's panel, well, footer
  ground and typing speed, brutalism's dot grid and its `oklch` hover
  step are the demos' own. Two tokens join the contract, `--fx-hot` and
  `--fx-hot-alarm` (96 tokens, S47), and phantom ships Barlow Condensed's
  real Black Italic and ExtraBold Italic.
- **The rules that yielded.** TH111 is amended: the three button sizes
  must be told apart, and where a demo pins one height they separate in
  type and padding. AR30's reader accepts a ring stacked either way.
  KT8's one-step hover yields for brutalism, and its themeable select and
  ink-wash highlight yield for retro and terminal — per theme, with the
  reason recorded beside each exception and the exception itself
  measured.
- **Still with Kenny:** phantom's skewed button, where the demo skews the
  element and the package skews the plate (R6-Q8).

**The fifth lift: brutalism.** Built from the approved concept demo
"Hard Copy" (2026-09-08) on the §7 research (Gumroad, BEIGE FORCE,
Future Pharmaceutical). The headline's words slam onto their yellow
offset one after another (`--kp-reveal-headline: slam`), a `<mark>` is a
yellow plate wiped in behind the word and closed by the line (`plate`),
a six-pixel bar rules a heading off when it enters the viewport (`bar`),
the dividers are a hatched marquee strip translating seamlessly — the
second one the other way — every hover is the yellow plate with the
line, the cta and the buttons lift two pixels away from a shadow that
grows, the labels carry the pixel outline of four hard box-shadows, the
dossier's stamp is tilted signal red and its redactions are ink bars
that slide off, and there is no arrival at all: printed matter is simply
there. The register is `css/brutalism-register.css`; it introduces no
family (Archivo Black already ships) and no token.

## 4.0.0 — 2026-09-07

**A destructive button asks before it acts, and four things that were
broken in public stop being broken.** The major version is the
confirmation: a click on a destructive control no longer arms the button
for a second click but opens a dialog. Everything else in this release
is either a repair of something the released package got wrong or an
addition that breaks nothing.

`MIGRATION.md` has the consumer-facing detail; this is what changed and
why.

### The confirmation is a dialog [TH107, D4, AR27, AR28, AR29]

A native `<dialog>` opened through `showModal()`, so the browser supplies
the focus trap, the Escape close and the return of focus. Confirm
re-fires the click behind a one-shot lock, which is the only shape that
costs consumers listening for ordinary clicks nothing — measured, because
the obvious version does not work: without the lock the re-fired click is
caught by the same listener and reopens the dialog, `["open", "confirm",
"open"]` and nothing ever performed. `ARM_EVENT` and `DISARM_EVENT` leave
the exports; arm-then-act survives as `data-kp-confirm-mode="inline"`.

The dialog re-shows the popover it displaced before returning focus,
because `showModal()` light-dismisses an open `popover="auto"` and a row
action lives in a menu.

### Four faults the released package had

Each was found by the `architecture-critic` before this round was frozen,
and each started as a test that failed on the released code.

- **A destructive React button could never be confirmed.** The React
  button wrote `data-kp-confirm` and the framework-free module selected
  it document-wide, so the two channels re-armed each other's button
  forever and the action never fired at any number of clicks. The test
  asserting otherwise was green only because its fixture did not attach
  the module over the React part.
- **Half the focus ring was missing on every button in every theme.**
  `.kp-button`'s own `box-shadow` sat in a later cascade layer than the
  global two-part ring and replaced its inner half. It composes now.
- **The cyberpunk register never reached the package's own buttons.**
  Every button rule in it selected `[data-slot='button']`, an attribute
  `css/components.css` never sets.
- **The movable grid's collapse rule had been dead since it was
  written.** `js/gridlayout.js` wrote the tile's place as an inline
  style, which beats any rule in any layer, so the narrow rule lost the
  moment the grid was attached — the only way it is used. The place is
  four custom properties now.

### Container queries beyond the tables [TH104, AR31]

The card grid and the nav bar read the box they are given rather than the
width of the window; the nav bar's `clamp(…, 3vw, …)` was the same fault
in a different disguise. Both need one wrapper element, which the React
components render themselves and `MIGRATION.md` spells out for
hand-written markup. The DataTable needed nothing — `@container kp-table`
has carried it since 3.2.0, checked rather than assumed.

### The button, and the page's edges [TH110, TH111, TH113, AR30, AR32]

Three button sizes as modifier classes with a `size` prop beside them.
One shared rule stops `.kp-button`, `.kp-badge`, `.kp-tag`, `.kp-health`
and `.kp-copyable` pushing the page sideways at 320 and 360px.

### What a scroll region clips [TH114, AR33]

Six assertions and a section of the guide, replacing an assumption with a
measurement: an absolutely positioned child of `.kp-table-wrap`,
`.kp-diff` or a `<pre>` is clipped, and a popover is not — it lives in the
top layer, where no ancestor's overflow applies.

### Two new gates, both blocking

`check:closure` holds the import closure of the six modules chassis-rs
bakes into a Rust binary at exactly those six, because one import edge
would make its whole chassis fail to load. `check:wrappers` refuses one
of this package's own pages that draws a converted component outside a
container that carries it — 65 components over 82 pages today.

### Also

`README.md` and `docs/SCOPE.md` no longer disagree about the git route
[TH112]. Three flaky tests were given a cause rather than an excuse: two
budgets that never scaled with their corpus, and one assertion racing a
state the fixture threw away after 400ms.

## 3.2.0 — 2026-09-07

**The layout the package kept telling consumers to write themselves.** A
consuming project shipped 71 lines of its own layout glue and 28 inline
`style` attributes, and said so in its own stylesheet header. Round four
is the answer: a layout layer, a utility API, ten example pages built out
of nothing else, and a documentation site that shows all of it.

Everything here is additive. Nothing that worked in 3.1.1 stops working.

### Added

- **A layout layer** (`css/layout.css`, exported as `./css/layout`):
  sixteen classes for the shape of a page, each reading a knob that
  defaults to the theme's own spacing scale.
  [docs/LAYOUT.md](docs/LAYOUT.md).
- **A utility API** (`css/utilities.css`, exported as `./css/utilities`):
  118 single-purpose classes in six families, generated from one source
  and documented by hand so the two can disagree.
  [docs/UTILITIES.md](docs/UTILITIES.md).
- **Cascade layers** — `kp.base`, `kp.components`, `kp.register`,
  `kp.layout`, `kp.utilities`. A layout class or a utility now wins on a
  component that sets the same property, without `!important`. Measured
  first: 44 component rules had higher specificity than a utility, so
  load order alone would not have been enough.
- **A spacing scale as tokens** in all 24 themes, pinned to the values
  the components already used, so nothing shifted.
- **A compact density mode**: `data-density="compact"` on any element.
  Pointer targets stay above 24px.
- **A keyboard-reachable scroll region for wide tables** in both
  channels, plus `.kp-cell-break`, `.kp-cell-truncate`, `.kp-col-low`,
  container queries in place of media queries, and a card layout for the
  plain table through `data-kp-cards`.
- **A dist bundle**: `dist/kp-themes.css` and `dist/kp-themes.js`, one
  tag each instead of eight. The loose files are unchanged.
- **Ten example pages** in both channels, built out of the layout layer
  and the utility API and nothing else — zero inline styles, with one
  excused pair of properties a popover needs.
- **A documentation site** with the story of every theme, taken from its
  own anatomy document, and its live tokens beside it.
- **A diagnostics page** that lays a vendored stylesheet and the
  JavaScript beside it and says which half is behind.

### Changed

- **An unknown theme name is no longer silent.** It still falls back to
  the default, but it warns once per session and dispatches a
  `kp-theme-unknown` event carrying what was asked for, what was
  applied, and which of the four paths dropped it. A page that has been
  quietly showing the default theme will now say so.
- **The stylesheet declares its own version** and the theme names it
  knows, as custom properties, so JavaScript can read them.
- **The checksum manifest** is derived from the package exports rather
  than hand-picked, and from what those exports import, so a file a
  consumer has to copy alongside them cannot fall outside it. That is how
  `js/locale.js` — imported by the date picker, the data table and the
  upload field, and exported by nothing — got in.
- **The typography scale is a set of tokens.** `--kp-text-xs`, `--kp-text-sm`
  and `--kp-text-md` are declared in all 24 themes. The six component rules
  that wanted a size the scale name did not mean kept their own value under
  their own knob, so no text moved anywhere.
- **A floor under a collapsed table wrapper.** `--kp-table-wrap-min` does
  nothing by default and gives a way out to a consumer who puts
  `.kp-table-wrap` in a box that shrinks to fit, where inline-size
  containment takes it to zero.

### Fixed

- **A status badge needed an inline style to be coloured.** `css/components.css`
  carries a rule per status now, so `<span class="kp-badge" data-status="offer">`
  gets its plate from the class. The React `Badge` stops writing the style for
  the seven names the package ships and keeps writing it for a consumer's own
  token family.
- **The shortcut sheet ran off a phone.** It was content-box, so at a 360px
  viewport it measured 373px and pushed the page sideways. It is border-box now,
  with the default width raised by exactly what used to sit outside it, so a wide
  screen sees the same 490px it always did.
- **Printing dropped the theme again.** Between the cascade layers
  landing and this release, the print override sat inside a layer while
  the theme tokens did not, and unlayered CSS wins; a dark theme printed
  dark in every theme and both browsers. The override is unlayered now.
  This never reached a published version.

## 3.1.1 — 2026-09-06

**Terminal's cursor moves off the headings.** The blinking block after
every `h1` and `h2` read as a screensaver rather than a flourish once a
page had more than one heading on it. It now appears once, after the
label of the field a person is currently focused in — the one place a
terminal cursor actually marks something.

### Changed

- **Terminal's block-cursor signature** now renders on
  `.kp-field:focus-within .kp-field__label::after` instead of on every
  `h1::after`/`h2::after`. Same glyph, colour and blink timing (DI5's
  flash-threshold literal, unchanged); nothing else about the theme's
  tokens moved (S20).

## 3.1.0 — 2026-09-05

**Thirteen more themes.** Round three researched eleven candidates and
ten further ideas against the existing set, dropped everything that sat
on a theme already here (vaporwave on cyberpunk, botanical on forest,
steampunk on solstice, cosmic on dark), and built the rest —
`docs/THEME_CANDIDATES.md` is the research, `themes/*/anatomy.md` the
result. Nothing existing changed (S20).

### Added

- **Themes:** brutalism, deco, academia, phantom, ticker, woodblock,
  shade-light and shade-dark (one scheme, two halves), mono, retro,
  grotesk, lapis, nostromo. Thirteen light, eleven dark in total.
- **`--fx-shadow-offset`** — a hard offset shadow on buttons, cards and
  inputs; brutalism's signature, `0px` everywhere else (TH85).
- **`--chart-pattern-1` … `-5`** — an image over each chart colour so a
  series is told apart without hue; mono's five fills, `none` elsewhere
  (TH86).
- **`css/retro-register.css`** — raised and sunken bevels inside a gated
  boundary, scoped to retro (TH87). Exported as
  `@kp-soft/themes/css/retro-register`.
- **The showcase compares two themes side by side** — a picker per half,
  one scroll, every specimen twice — and loads each theme's faces from
  Google Fonts (the package still loads none) (TH88).
- **`--kp-popover-max-height`** — the popover scrolls inside itself.

### Changed

- **Hover and the keyboard highlight are a wash of the ink**, not
  `--accent`: `--kp-highlight`, default the foreground at 8% alpha, on
  menu items, the theme picker's options, ghost and icon buttons, and the
  combobox and palette highlights. Seven rules read `--accent` before, and
  a theme whose accent is a colour rather than a tint turned every
  highlighted row that colour. The text keeps the list's colour.
- **`--kp-control-accent`** — what the browser paints checks, radio dots
  and the progress bar in; default `--primary`. Brutalism and mono set
  it, because their primary is (near) the ink.
- **Hover is one lightness step** in every theme (was a half): Kenny's
  finding on the 3.1.0 showcase, KT8/H1. Derived tokens only; no
  authored value changed.
- **The native `<select>` list wears the theme** where the browser
  supports `appearance: base-select` (Chromium 135+): popover surface,
  ink-wash hover, a check on the chosen option. Elsewhere it stays the
  platform's.
- **`<hr>` and `<progress>` wear the theme.** Both were the browser's
  grey — the two elements on a fixture that wore no theme at all, found
  by the foreign-colour test below.
- **A foreign-colour test on every fixture** (`tests/fixtures.spec.mjs`,
  "paints no colour that is not its own"): every painted background,
  text, border and control colour is one of the theme's own values
  within rounding, transparent, or a translucent wash of one; the colour
  picker's swatch and the "browser" specimen's native controls are the
  allowlist, each with its reason. Kenny asked for exactly this after the
  third look at the showcase.
- **The spinner's track is the head at a quarter alpha**, so the two can
  never coincide (brutalism's were both black).

### Fixed

- The strings gate flagged three shapes of code that only looked like
  text (a CSS selector, a capitalised object key, the code between two
  one-character literals); repaired test-first (KT7).
- Fields and inputs shrink inside a grid or flex track instead of
  pushing a 320px viewport sideways, found by the reflow test on a wide
  face.

## 3.0.0 — 2026-09-05

**The release in which every feature of every component became
configurable.** Correction KT6 opened on a busy button with no way back;
Kenny's answer widened it into a sweep of the whole package against what
mature component libraries do in 2026, and this is the result. The audit
and the record of what was done are `docs/GENERIC_SWEEP.md`.

### Breaking

- **The framework-free modules are pure.** Importing `js/*.js` attaches
  nothing. Load `js/auto.js` for what 2.x did, or call the `attach…()`
  functions yourself. `package.json` now tells bundlers the truth about
  side effects — it did not for two versions.
- **The theme labels are English** in the token source. Override with
  `labels` in either channel.
- **The locale is the page's**, not Dutch: the date picker's format and
  week start, the DataTable's collation and number parsing, the upload's
  sizes all read the nearest `lang` attribute, else the browser. Pass
  `locale` / `data-kp-locale` to override. `toDutch()` stays, deprecated.
- **`@kp-soft/themes/fx` no longer exports `BootSequence`**; import it from
  `@kp-soft/themes/fx/boot-sequence`, which is the only place the optional
  `motion` peer is required.
- `ThemeSwitcher` renders the package's own class names, not Tailwind's.
- `Reorder`'s `onChange` receives `(order, { id, from, to })`;
  `Combobox`'s `onChange` receives `(value, values, action)`; `Tree`'s
  `onSelect` still fires on a leaf, and `onSelectedChange` beside it.
- `GridLayout` describes a tile's geometry (`aria-describedby`) instead
  of overwriting its `aria-label`.

### Everything is a knob

Every React component forwards a ref, passes `className`, `style` and the
rest to its root, takes `classNames` for its parts, and holds every state
controlled or uncontrolled through `hooks/use-controllable`. Every
framework-free `attach…()` returns a detach with `handles` whose state is
readable and settable, takes its behaviours as options and `data-kp-*`
attributes, dispatches an event with a detail on every change, and
restores what it changed on detach. Every literal in the CSS a site might
change is `var(--kp-…, <default>)` — 116 of them. README "Everything is a
knob" has the five rules; the per-component list is in the sweep record.

### Repairs found by the audit

`onUndo` on `Button` is invoked at last (it was declared and dead for two
versions). Contract enforcement is recoverable (D7). The skip link moves
focus (`skipTo`, `attachSkipLinks`). The print rule and the forest drift
addressed the wrong pseudo-element. Toasts sat under the texture layer.
`attachDialogs` and `attachTabs` double-bound on a second call. DataTable's
detach left the rows sorted. `no-flash.js` mutated the document on import.
`ShortcutSheet` rendered an empty heading. `EmptyState` discarded its
action when filtered. Tree ids collided across instances. The React
upload's progress bar was pinned at 0. Disabled combobox options were
selectable. `TOAST_MS` was exported and unused. Nested `StringsProvider`s
replaced each other. `data-kp-keys` was documented and never read.

### New

The theme picker groups light and dark with a label per section, in both
channels (TH63). `js/locale.js`. `hooks/use-controllable.js`.
`configureTheme()`. Pointer drag on Reorder and GridLayout. Min, max and
disabled days on both date pickers. Server mode on DataTable
(`totalRows`). Pagination with an ellipsis. Manual and vertical tabs.
Tooltip delays and Escape. Toast variants, actions and auto-dismiss.
Accordion single mode. `beforeStep` on both wizards. `accept`, `maxFiles`
and a validator on both uploads. Command groups in both palettes.

### Kept, on purpose

Three animation durations stay literals: the cursor blink, the skeleton
pulse and the cyberpunk flicker change luminance, and DI5 pins them above
the flash threshold. `STRINGS_NL` is unchanged pending a decision.

## 2.0.0 — 2026-09-05

**The words on screen changed from Dutch to English.** That is the whole
breaking change, and `STRINGS_NL` is the one-line undo. See MIGRATION.md.

Correction KT5. Every user-visible string in the package was written into
the component that renders it, in Dutch, with no way for a consumer to
pass a different one. The fault is not the language — a hardcoded English
string is the same defect — it is that there was no door. JobTracker had
adopted only the components that carry no text at all, which is what the
defect looks like from outside.

### One dictionary

`js/strings.js` holds all 72 keys with English defaults, frozen. Keys that
vary take arguments — `tableRowsFiltered(shown, total)`, `removeNamed(name)`,
`wizardStep(at, of)` — so a consumer can reorder for their own grammar
instead of concatenating ours.

`STRINGS_NL` exports the Dutch that used to be the default, for kyu,
almanac and kp-soft.

### Three ways in, nearest wins

A `strings` prop on any component, a `StringsProvider` from
`hooks/use-strings.jsx` for a subtree, or `setStrings()` globally for the
framework-free channel. Every override is partial. A consumer who does
nothing gets English.

### The screen-reader half

The announcements are the part of this that matters most, because they
fail silently and only for the people who cannot see that they failed. A
copied value announced `` `${value} gekopieerd` ``; the DataTable
announced its filtered row count in Dutch into an `aria-live` region.
Both now come from the dictionary, and the gate does not know they are
special: they are strings.

### `js/contrast.js` is public

The WCAG primitives moved out of `gates/colour.mjs` so a consumer measures
a ratio with the same code our gate measures it with, rather than a second
opinion. `gates/colour.mjs` re-exports from it, unchanged for anyone
importing it there.

### Every field type, not only a text box [TH61]

`FormField` took a `type` prop and rendered an `<input>` whatever it was
told, so a real form grew a hand-written half beside it — without the
label, the error and the `aria-describedby` wiring that are the point of
the component. It now renders `select`, `textarea`, `checkbox` and
`radio` as what they say, and passes `options` through for the two that
need a list.

A radio group is a group: a `<fieldset role="radiogroup">` with the
question as its legend. That has three consequences the suite pins.
The summary counts it once rather than once per button. It is named by
its legend rather than by one of its answers — "How do we reach you?",
not "Email". And the group carries `aria-invalid`, because putting it on
one radio says the wrong thing about the others.

The framework-free channel already validated anything the browser
validates, since it works on `form.elements`. What it did not know was
that a radio group is one question; it does now, so both channels answer
the same.

`Form` itself was collecting only `HTMLInputElement`, so a required
select nobody chose from was thrown away before the summary looked at it.

### A consumer's own link component [TH62]

`NavBar`, `Breadcrumb` and `Pagination` take `linkComponent`, defaulting
to `'a'`. A plain anchor is correct HTML and reloads the page, which is
right for a server-rendered site and wrong inside React Router or Next,
where every click would throw the state away.

The skip link is deliberately not routed: it is a same-page anchor, and
sending it through a router turns the one link a keyboard user needs into
a navigation.

Kenny asked for this on `NavBar`. `Breadcrumb` and `Pagination` had the
same hardcoded `<a>`, and a measure written for the place a fault showed
rather than for the property it has meets you again somewhere else.

### The gate

`npm run check:strings` reads our source and refuses a user-visible
literal that does not come from the dictionary — the same shape as the
layer gate. It matches sinks rather than shapes: where a literal _goes_
(`textContent`, `placeholder`, `setAttribute('aria-label', …)`, JSX
attributes and text nodes, and a bare literal inside a JSX expression),
not what it looks like.

Drilled red in all four of those shapes before it was trusted. It passed
the fourth on the first attempt — the sr-only case, which is the one KT5
exists about — and was fixed. The drills are frozen in
`gates/gates.test.mjs` so the exemptions cannot widen back over them.

## 1.2.0 — 2026-09-04

Twenty-two components, in both channels. Kenny asked for a DataTable and
"top of the line forms", then went through
<https://github.com/brillout/awesome-react-components> with me and rated
the rest.

### The two that were asked for

**DataTable** — sorting, global filtering, pagination, row selection, an
empty state, and a narrow layout where each row becomes a card carrying
its column names. Measured against TanStack Table's feature list, which
is what "best in 2026" means. Deliberately without virtualisation,
in-cell editing or export: that is a grid, a different product, and the
decision is recorded rather than forgotten.

The features were the easy part. `aria-sort` lands on the sorted column
and nowhere else, the row count after a filter is announced, a number
column sorts as numbers, and the header checkbox goes indeterminate on a
partial selection — because a box reading "checked" while one of three
rows is selected is a lie.

**Forms** — the browser already validates; what it does not do is put the
message where a screen reader will read it, gather the errors, or move
focus to them. The summary takes focus rather than merely appearing,
`aria-describedby` is appended to rather than replaced, and validation
reports on blur. Telling someone their email is invalid while they type
the third character is technically true and practically hostile.

### The rest of the round

Combobox and tag input on a shared listbox engine, with virtual focus.
Command palette and shortcut sheet, together, because a palette without
discoverability is a secret. Tree, drag-to-reorder and split pane — all
keyboard-first, no drag library. Date picker, file upload, step wizard.
Empty states that know the difference between "nothing yet" and "nothing
matched", optimistic actions with undo, status parts, a copyable value
and a diff view.

A movable grid layout where every gesture has a keyboard equivalent and
the keyboard one is what the tests drive.

And a colour picker that reports the WCAG contrast ratio of the chosen
colour against the current theme's background, using the same function
the contrast gate uses. That is the one thing a colour picker inside a
theme system can do that a general-purpose one cannot — and a picker that
shows a colour without saying whether anyone can read it is how the
unreadable colours got in.

### What the suites found

Every one of these was found by a test or by the showcase, not by review:

- The two channels disagreed about what a choice is: Enter took `banaan`
  in one and `Banaan` in the other, because the framework-free half
  conflated an option's label with its value.
- Two command palettes on one page both answered Ctrl+K and stacked two
  modal dialogs.
- The React palette kept the old query when opened any way other than the
  shortcut, while the other channel had already cleared it.
- The React form gathered a summary and left the FIELDS unmarked — no
  `aria-invalid`, no per-field message, no blur validation. Four
  assertions failed at once.
- Reorder moved focus with a document-wide query and landed in the other
  channel's list.
- And the showcase found, within a minute, that the combobox input
  overflowed its wrapper by 10 px: at 320 px that pushed the page
  sideways and DI11 went red on all eleven themes. Every browser test had
  been green; the fixture pages were not narrow enough to notice.

### Also

`js/contrast.js` is new and public: the colour primitives moved out of
`gates/`, which is the package's own tooling, so a consumer gets the same
contrast measurement rather than a second opinion.

418 browser tests in Chromium and Firefox, 25 unit tests, 59 export paths.

---

## 1.1.0 — 2026-09-04

Types, and the promise that a version does not move under you.

**Everything here came from a consumer, on the day 1.0.0 shipped.**
JobTracker adopted it and could not: the package carried no type
declarations at all — no `types`, no `typings`, not one `.d.ts` — while
the README, the user guide and the ecosystem entry all promised a `Theme`
type. Their own code was clean; all seven errors were in ours.

### The package ships types

A `.d.ts` beside every entry point, generated from the JSDoc sources and
held in step by a gate, the same contract as the stylesheets and the Home
Assistant themes. `index.d.ts` is published too, which it would not have
been: `files` named `index.js` as a file rather than a directory, so the
main entry point would have arrived without types a second time. The gate
found that before the release did.

### `Theme` is the eleven names, not `string`

It was `@typedef {string} Theme`, which meant the type promised something
it did not deliver: `applyTheme('formeel')` type-checked and then fell
back to `formal` at runtime. It is the generated union now.

Only the OUTPUTS narrowed. What a function accepts stayed lenient —
`storeTheme` and `initializeTheme` still take a plain string — because
narrowing an input breaks a consumer that reads a theme out of config or a
database, which is what JobTracker and kp-soft both do. Narrowing a return
value cannot break anyone. Use `isTheme()` to narrow a string you hold.

That change is why this is 1.1.0 rather than 1.0.1.

### One real defect, found by a stricter compiler

`tabs[index].focus()` in the tab-list keyboard handler had no guard. Under
`noUncheckedIndexedAccess` it is a type error; in a browser it is a thrown
`TypeError` that stops the key handler on an out-of-range index.

### A gate that checks what a consumer gets

`npm run check:types` type-checks OUR sources with OUR resolution — bundler,
`noUncheckedIndexedAccess` off — and could never have seen this. The new
gate packs the tarball and asserts that every published entry point carries
a declaration inside it.

It does not pretend to be a consumer's type checker. Two attempts to build
that could not fail — the first fell back to the `.js` beside the missing
`.d.ts`, the second because TypeScript 7 infers types from a dependency's
JSDoc where JobTracker's compiler does not — and a check that cannot fail
is the one thing this project has a rule against.

### Documentation that matched the decisions

The README still documented an npm setting and a Tailwind `@source` as
requirements after both were struck, and still pinned `#v0.1.1`. It now
says what this package is: a source, with one promise.

**A released version of a theme never changes.** The token values of `dark`
at v1.0.0 are its values at v1.0.0 forever; any change raises the version,
including a correction of a value that is plainly wrong. Pin one and stop
thinking about it. Every release carries a version number, a provenance
line and `SHA256SUMS`, and that is the whole of what a consumer can rely on
mechanically.

Also: how to keep another framework's theme flag in step using the theme
event, without a second list of which themes are dark — two consumers were
found keeping one, and both had it wrong. And why a theme switch can look
stuck in a browser that renders no frames.

---

## 1.0.0 — 2026-09-04

The first release of kp-themes as its own thing. v0.1.1 was the
extraction from kp-soft: seven palettes, a React hook, a switcher, and
one contrast check. This is a package.

**It is a breaking release, and the breaks are worth the price.** They are
listed with what each becomes in [MIGRATION.md](MIGRATION.md); the short
version is that a copy of every theme's colours used to live in
JavaScript, and it is gone.

### Two channels, sharing one state

React for a consumer with a build step, and framework-free — CSS classes
plus a `<script type="module">` that attaches behaviour to markup your own
server wrote. They render the same class names and share the same state,
so a page can mix them and nothing betrays which is which.

That state lives on the document rather than in a React module, which is
what makes it possible: a plain `<script>` cannot reach a React closure,
so two pickers on one page would each have set the theme correctly and
each failed to update the other's mark. A change from either is announced
as one DOM event, and a choice made in another tab arrives on the same
one.

### Eleven themes

The seven that came from kp-soft — formal, light, dark, cyberpunk,
pastel, terminal, forest — and four that fill gaps the set had:

- **high-contrast** — black on white with one signal yellow. The only
  theme here whose reason is not taste.
- **sepia** — warm parchment and brown ink, no cool hue in the reading
  surface. The restful one.
- **blueprint** — cyan on Prussian blue, ruled like a technical drawing.
  Topo is a map; this is the drawing of a thing that does not exist yet.
- **solstice** — warm dark: charcoal, amber and rust, for the reader who
  finds dark clinical and cyberpunk loud.

Each has an anatomy document saying what it is, what is load-bearing, and
what it deliberately does not do. Colour choices come from those
documents rather than from taste.

### A theme is complete now

Links, visited links, text selection, code, kbd, mark, blockquote, list
markers, placeholders, invalid fields, the checkbox tick, and a print
stylesheet. Before this, a consumer who took the palette and wrote
ordinary HTML got a themed page with browser-default holes in it — the
browser's own link blue scored 1.99 against the dark theme's background,
where 4.5 is the floor.

Eighteen components in both channels: button, badge, table, alert, form
field, card, navigation bar, and the eleven overlays. Two of their
contracts are enforced rather than documented — a destructive action must
offer an undo or a confirmation, and a badge whose colour means something
must also say what it means.

### Motion is part of a theme's character

`--fx-duration`, `--fx-ease` and `--fx-lift` were declared by every theme
and used by nothing. Every transition reads them now: terminal steps
rather than eases, because a character display jumps; pastel overshoots;
formal, sepia and high-contrast do not move things at all. Each theme has
at most one gesture of its own, and two have none on purpose.

### Home Assistant

`ha/kp-*.yaml` is the same eleven themes as Home Assistant themes,
generated from the same token sources, so a dashboard and a web page mean
the same thing by "primary". Where card-mod is installed they carry the
theme's timing too.

### Eleven gates, and a rule about them

Contrast, the design invariants, the flash threshold, reduced-motion
guards, token parity, layer discipline, the type check, and whether the
generated files still match their sources — all in Node, all under a
second, all blocking a commit. A behaviour suite of 182 tests runs in
Chromium and Firefox.

Every one of them has been shown red on a deliberately injected violation
before being trusted, because one check in this project was written,
reported as built, and never ran once.

### What they found

Not theory. Each of these was live in the code:

- `fx-flicker` made 5.5 opposing luminance changes per second where
  SC 2.3.1 allows three.
- The focus ring measured 1.00 — identical luminance — against a primary
  button in three themes.
- `--color-scheme` was declared by every theme and applied by nothing, so
  the browser drew light scrollbars over every dark theme.
- 42 colour literals duplicated tokens, three of which had already
  drifted from the token they came from.
- The pressed state was invisible in cyberpunk and terminal.
- `--chart-4` in pastel sat at 2.20 against the page where 3.0 is the
  floor: a chart series nobody could see.
- The whole framework-free channel was missing from the published
  package, found by the first field test.
- Both typefaces a theme declares were applied almost nowhere, so a
  vendored copy rendered in Times New Roman.

### Also

MIT licence. Checksums beside the release tag, because kyu and almanac
vendor the stylesheet and have no npm to verify anything for them. A
showcase at <https://kennypassenier.github.io/kp-themes/> showing all
eleven themes and everything in them.

---

## 0.1.1 — 2026-09-02

Extraction from kp-soft at commit `2983abb`: the seven themes, the
registers, the cyberpunk effects, the theme hook and switcher, the
contrast check, and the seven status-colour tokens JobTracker needed.
