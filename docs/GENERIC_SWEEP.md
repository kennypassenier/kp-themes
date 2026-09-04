# The generic sweep — findings of 2026-09-05

Correction KT6 became a sweep the moment Kenny answered field 4. His
remarks set the frame, and they are quoted in full in
[CORRECTIONS.md](CORRECTIONS.md) under KT6. The short form: this package
offers functionality and styling; the consumer fills in content and owns
behaviour; every feature of every component is configurable, with
defaults; no language choices; the only contract is that a change raises
the version.

This document is the audit that the frame demanded: every component and
module measured against what mature component libraries do in 2026, and
only the gaps recorded. It was produced by three read-only sweeps (React
components; framework-free modules; CSS, fx and the package surface),
and every claim that shaped a decision was verified by hand before it
reached a form — file and line are given so the next reader can do the
same. A second section, "What was done", is appended as the work lands.

## The rubric

| | Norm | What it means here |
| --- | --- | --- |
| A | State ownership | Every internal state has a controlled form (`value` + `onChange`) and an uncontrolled default (`defaultValue`); framework-free, every state the module sets can be read and set from outside |
| B | Async | The component never owns the outcome of async work it did not start |
| C | Content | All text and nodes through props, children, render props or `strings`; hardcoded *structure* counts too |
| D | Element substitution | `as` / `linkComponent` / render props where the element may need to differ |
| E | Behaviour flags | Every behaviour a consumer might not want is a prop with a default |
| F | Refs | A ref on every component that renders a focusable or measurable element |
| G | Passthrough | `className`, `style`, `...rest` reach the root |
| H | Events | Every state change has a callback; framework-free, a bubbling event with a useful detail |
| I | Magic numbers | No timeout, delay, size, limit or z-index a consumer cannot change |

## Headline numbers, verified

- **0** of 17 React component files use `forwardRef` or `useImperativeHandle`.
- **6** of 17 spread `...rest` onto anything; the other 11 accept no `style`, `id` or `data-*` on their root.
- **16** of 17 framework-free modules attach themselves on import or `DOMContentLoaded`; `listbox.js` is the exception and the model.
- **3** `--kp-*` custom properties exist in the authored CSS, all three runtime state written by JS. There is no styling API: every max-width, control height, breakpoint and z-index is a literal.
- **`"sideEffects": ["*.css"]`** in `package.json:12-14` declares the JavaScript pure while 15 modules mutate `document` on import.

## Outright defects (not "could be more configurable" — wrong)

| # | Where | What | Verified |
| --- | --- | --- | --- |
| 1 | `package.json:12-14` | `sideEffects` lies; a tree-shaking bundler may drop the auto-attach code the framework-free channel depends on | yes |
| 2 | `css/_rules.css:334` vs `:10` | The print rule hides `body::before`; the texture lives on `body::after`. The texture prints. `USER_GUIDE.md:273` promises the opposite | yes |
| 3 | `css/_rules.css:403` | Topo's drift animates `body::before`, which carries nothing. Topo never drifts | yes |
| 4 | `css/components.css:658` vs `_rules.css:14` | `.kp-toasts` z-index 50 sits under the texture layer at 80 | yes |
| 5 | `fx/index.js:5` → `fx/boot-sequence.jsx:5` | The `fx` barrel imports `motion/react`, an optional peer; no `./fx/*` subpath exists to avoid it | yes |
| 6 | `js/datatable.js:122` vs `:239-246` | Detach never restores row order; the consumer's DOM stays sorted | yes |
| 7 | `js/datatable.js:64,70,75`; `components/datatable.jsx:29,35,38` | Comparator locale `'nl'` hardcoded; `1,284.50` mis-sorts for anyone else | yes |
| 8 | `js/overlays.js:30-46, 62-120` | `attachDialogs` and `attachTabs` have no attached-guard; a second call double-binds | yes |
| 9 | `js/no-flash.js:26-32` | Reads `localStorage` and writes `data-theme` on import, with no function to do it deliberately | yes |
| 10 | `js/patterns.js:111-116` | The optimistic-delete timer is not cancelled on detach; `COMMIT_EVENT` fires after detach | yes |
| 11 | `components/button.jsx:26,33,68` | `onUndo` is declared, checked for truthiness, and never invoked. The documented alternative to `confirm` does nothing | yes |
| 12 | `components/button.jsx:65,72` | `{...rest}` after `disabled`, so `disabled={false}` re-enables a contract-broken button; a consumer `onBlur` deletes disarm-on-blur | yes |
| 13 | `components/palette.jsx:175` | `ShortcutSheet` renders `{label}` in its `<h2>` where `name` (the resolved default) was meant; omitting `label` gives an empty heading | yes |
| 14 | `components/patterns.jsx:26` | `EmptyState` silently discards the consumer's `action` when `filtered` — the one case where "Clear filters" is the right action | yes |
| 15 | `components/structure.jsx:51,76,103,114` | Tree ids are `tree-${id}`, unscoped and looked up on `document`; two trees fight over focus | yes |
| 16 | `components/flow.jsx:88` | DatePicker looks its day buttons up on `document`; two pickers steal each other's arrow keys | by audit |
| 17 | `components/flow.jsx:285` | React Upload pins `aria-valuenow={0}`; the progress bar is decorative | yes (KT6 sweep) |
| 18 | `components/combobox.jsx:111,200` | Disabled options are fully selectable; `data-kp-disabled` is cosmetic | by audit |
| 19 | `components/overlays.jsx:113` | `TOAST_MS` is re-exported and never used; the React toasts never auto-dismiss | by audit |
| 20 | `hooks/use-strings.jsx:37` | Nested `StringsProvider`s replace rather than layer | yes (read) |
| 21 | `js/theme-picker.js:159,163,170` | Labels interpolated into HTML unescaped | by audit |
| 22 | `js/palette.js:19` | `data-kp-keys` is documented in the markup comment and never read | by audit |

"By audit" means the sweep reported it with file and line and it was not
re-read by hand before this document; it is verified at the moment it is
fixed.

## Language decisions the package still makes

Kenny: "geen keuzes over talen". `gates/check-strings.mjs` sees strings;
these are formats and structure, which is why they survived KT5.

| Where | Decision | Kind |
| --- | --- | --- |
| `js/strings.js:212-284` | `STRINGS_NL`, a Dutch dictionary maintained inside the package | forced maintenance of one language |
| `themes/*/tokens.json` `label` ×11 → `js/theme-registry.js:22-32` | Dutch theme labels in the token schema | default, but in the schema |
| `js/theme-picker.js:147-173` | `themeMenuMarkup()` writes the Dutch labels with no `labels` option; React's `ThemeSwitcher` has one | forced, framework-free only |
| `js/datepicker.js:49-51, 65-66, 100`; `components/flow.jsx:28, 33` | `toDutch()` dd-mm-yyyy, day-first parsing, Monday-first grid | forced |
| `js/strings.js:158` `dateFormatHint` | A placeholder only; changing it desynchronises the hint from `toDutch` | misleading |
| `js/datatable.js:64,70,75`; `components/datatable.jsx:29,35,38` | `localeCompare(…, 'nl')` | forced |
| `gates/generate-showcase.mjs:65,146` | writes `<html lang="nl">` | forced, in a shipped generator |
| `js/upload.js:37-41`; `components/flow.jsx:202-206` | `1.5 MB` with a period, base-1024, not from strings | forced |

## Cross-cutting gaps

**React.** No refs anywhere. Passthrough on 6 of 17. No `classNames`/slot
props for sub-parts on any component. Props used as one-time initial
state and never re-synced in six components (Combobox `value`/`values`,
DatePicker `value`, Reorder `items`, SplitPane `initial`, ColorPicker
`initial`, GridLayout `tiles`). No controlled/uncontrolled pair on any
state: Tabs `active`, Tree `open`/`at`, Combobox `query`/`chosen`/`open`,
DataTable `query`/`sort`/`page`/`chosen`, Wizard `at`, Dialog (controlled
only), DropdownMenu (no state at all), Tooltip `shown`, Accordion
(native, unreachable), CommandPalette (keyboard-only, no `open`),
ShortcutSheet (same), ThemeSwitcher `open`, ColorPicker `colour`,
GridLayout `layout`, Upload `rows`, Copyable `state`, Button `armed`.
SplitPane has no React `onChange` at all (`structure.jsx:215`, DOM event
only). Inline styles that beat any stylesheet: Skeleton
`marginBottom: '0.375rem'` (`overlays.jsx:252`), Tree
`paddingInlineStart: ${depth}rem` (`structure.jsx:121`), ThemeSwitcher
`z-50` (`theme-switcher.jsx:107`).

**Framework-free.** Auto-attach in 16 of 17. State closure-local and
unreachable in: datatable (sort, page, query, selection), datepicker
(date, panel), wizard (step — no `goToStep`), gridlayout (`layoutOf()`
reads, nothing applies), combobox (chosen values; server-rendered tags
invisible), split (value mirrored to `aria-valuenow` but writing it does
nothing), palette (query), colorpicker (colour), tabs (selected), tree
(no events at all). Detach restores nothing in structure.js; leaves
generated content in datepicker, upload, combobox, datatable. No
exported `showError`/`clearError` in forms.js for server-side errors.
Filter/compare/match functions hardcoded in datatable, combobox, palette.
Global keyboard shortcuts (Ctrl+K, `?`) bound on `document` with no
opt-out and a first-in-DOM-wins singleton. `enforceContracts` disables
consumer markup with no detach, no rule selection, English literals not
from `getStrings()` (`js/components.js:55-56, 70`).

**CSS.** No sizing, spacing, type, radius, duration, breakpoint or z-index
scale. Pill radii `999px` ×7, `calc(var(--radius) / 2)` ×8, ~25 raw font
sizes, `@media (max-width: 40rem)` ×2, four different fallbacks for
`--fx-duration` and one place with none (`components.css:900-901`).
Spinner 900ms, skeleton 1600ms, blink 1000ms, drift 40s and the whole
cyberpunk register carry their own numbers while `USER_GUIDE.md:293`
says every transition reads the token. `!important` ×4. Content glyphs
baked into CSS (`✓`, `/`, `↕↑↓`, `▸▾`, the required star, `//`). Print
colours literal. The global focus ring is `2px` literal while components
read `--focus-ring-width`. The texture overlay is a fixed full-viewport
layer imposed by importing the stylesheet.

**fx.** All four effects gated on `theme === 'cyberpunk'` with no prop.
Glyph sets, speeds, densities, the DPR cap, `'#0ff'` and
`'rgba(0,0,0,0.12)'` literals, and the canvas font all hardcoded.
`useReducedMotion` not exported. `BootSequence` requires Tailwind
classes and a fixed sessionStorage key.

**Package surface.** No `./components/*` or `./fx/*` subpaths: one
`Button` pulls the barrel and its 14 side effects. `./hooks/use-theme`
not exported. Theme token sources shipped but not exported. No `types`
condition on exports. `themeMenuMarkup()` — a string builder — schedules
a document-wide attach (`js/theme-picker.js:156`).

## Per-component gap tables

The three sweeps' tables, condensed to one line per gap. Line numbers
are as of `e6a8cd3` (branch `kt6-generic`).

### React

**Alert** (`alert.jsx`): no `as` (:21); bare inner `<span>` (:22); `": "`
separator hardcoded (:23); no icon slot; no dismiss; no ref.

**Badge** (`badge.jsx`): consumer `style` replaces the status colours
(:24, :28); `--status-` prefix hardcoded (:19); `console.error` not
suppressible (:16); no `as`; no ref.

**Button** (`button.jsx`): `onUndo` dead (:26, :33, :68); `armed`
uncontrolled (:30); `onBlur` before rest (:71/:72); `disabled` before
rest (:65/:72); no ref; no `as`; `console.error` (:37).

**Card** (`card.jsx`): `<h3>` fixed (:9); `title` string only; body
wrapper always present (:10); no footer; no `classNames`; no ref.

**Field** (`field.jsx`): rest goes to the input, root gets only
`className` (:20, :24); a consumer `id` breaks the label association
(:15, :21, :24); input only; no required marker; no ref; no
`labelHidden`.

**Table** (`table.jsx`): no rest, no style, no ref (:9); wrapper fixed
(:11); cells `string|number` only (:7, :27); header keyed by label (:16);
rows keyed by index (:25); caption fixed (:13).

**NavBar** (`nav-bar.jsx`): brand is a `<span>`, string only (:23, :33);
skip link always rendered (:29); no rest (:25); link rendering fixed
(:36-39); `aria-current="page"` fixed (:37); `<ul>/<li>` fixed (:34);
fragment layout (:28); no ref.

**Combobox** (`combobox.jsx`): `value`/`values` seed once (:38-39);
`open` (:40) and `active` (:41) uncontrolled; filter hardcoded (:49);
disabled options selectable (:111, :200); open-on-focus (:183),
close-on-blur (:136-138), Backspace-removes (:121) all forced; no clear,
no creatable, no `name`/hidden input; tag markup fixed, `×` (:160,
:145); no rest/ref/`inputProps` (:36).

**DataTable** (`datatable.jsx`): `query` (:70), `sort` (:71), `page`
(:72), `chosen` (:73) uncontrolled; comparator `'nl'` (:25-39); Dutch
number parsing (:27-28); filter over all values (:78); sort by bare
`<th onClick>` — mouse only (:156); asc→desc only (:157-161); cells
`row[key]` only (:193); no row interaction; pager always rendered (:213);
search always rendered (:105); no rest/ref/`classNames`.

**Form / FormField** (`form.jsx`): busy latch — closed by `e6a8cd3`;
`errors` not injectable (:203); `summaryList` not clearable (:204);
validate timing fixed (:70, :219); focus-on-error forced (:265, :289);
submit button always rendered, no actions slot (:300); `<form>` takes no
rest, `noValidate` fixed (:276); `onValid` gets `FormData` only (:271);
FormField rest lands on the control (:117, :141, :169, :180, :182);
`onBlur` (:116, :159) and `aria-describedby` (:157) before rest; no ref;
required marker forced (:73); label always visible (:164); radio group
`options` only (:95-123).

**Dialog** (`overlays.jsx:20`): controlled only; Escape always closes
(:35); always modal (:30); `<h2>` + string title (:36); no close button;
empty actions div (:40); class-less body (:39); no initial-focus
control; no rest/ref.

**DropdownMenu** (`overlays.jsx:52`): no open state (:59); `auto`
fixed; no `closeOnSelect` (:63); `className` goes to the trigger (:56);
trigger fixed (:56); `style` would drop `anchorName`; no placement;
items `{label, onSelect}` keyed by label (:50, :61); no ref.

**Tooltip** (`overlays.jsx:81`): `shown` uncontrolled (:83); no delays
(:85-86); no Escape dismiss (WCAG 1.4.13); not hoverable; no placement;
two bare `<span>`s (:85-86); no className/style/rest/ref; `text` string
only (:79).

**Toasts** (`overlays.jsx:99`): politeness fixed (:103); `{id, text}`
only (:97); `TOAST_MS` unused (:113); no placement/limit; no
passthrough.

**Accordion** (`overlays.jsx:118`): no value/open control (:122); no
single mode; keyed by summary (:122); bare `<summary>` (:123); no
per-item props; no rest/ref.

**Tabs** (`overlays.jsx:137`): `active` uncontrolled (:139); automatic
activation only (:148-150); horizontal only (:145); all panels mounted
(:172-183); `{label, panel}` keyed by label (:135, :158); no
`classNames`; no rest/ref.

**Breadcrumb** (`overlays.jsx:194`): no className/style/rest/ref;
separator CSS-only; last item forced non-link (:204); keyed by label
(:200); `aria-label` via strings only (:197).

**Pagination** (`overlays.jsx:214`): renders every page (:219); no
prev/next; no `onPageChange`; `current` required (:213); no passthrough.

**Progress / Spinner / Skeleton** (`overlays.jsx:232, 239, 246`): no
passthrough on any; Progress has no value text; Skeleton
`marginBottom: '0.375rem'` inline (:252) with no prop to beat it.

**CommandPalette** (`palette.jsx:21`): no `open`/ref/trigger (:29-57);
hotkey fixed and not disableable (:40); singleton (:46); matcher fixed
(:32); `query` (:29), `active` (:30) uncontrolled; reset on close forced
(:77-80); close on run forced (:62); no groups/icons/`renderItem`; fixed
empty state (:133); no passthrough; no `onClose`.

**ShortcutSheet** (`palette.jsx:145`): empty `<h2>` when `label`
omitted (:175); `?` fixed (:153); typing guard fixed (:157-158);
singleton (:164); flat `<dl>` keyed by keys (:176, :178); close button
forced (:187); no passthrough.

**DatePicker** (`flow.jsx:17`): `text` seeds once (:20); `open` (:21),
`cursor` (:22) uncontrolled; format fixed to `toDutch`/`parseDate`
(:33, :119); Monday-first (:28, :64, :67); no min/max/disabled; day
lookup on `document` (:88); close-on-select + refocus forced (:35-36);
Escape/blur forced (:74-77, :97-99); `‹ ›` fixed (:145, :156); trigger
fixed (:125-135); no passthrough; no range.

**Upload** (`flow.jsx:213`): `rows` owned (:216); `aria-valuenow={0}`
(:285); `multiple` fixed (:245); no `accept`; no `maxFiles`; no
`onReject` (:230, :233); `readableSize` fixed (:202-206); drag always on
(:258-267); `×` fixed (:298); zone text only (:269); no passthrough.

**Wizard** (`flow.jsx:312`): `at` uncontrolled (:314); Next always
advances (:352-355); step list not navigable (:328); focus forced (:321);
actions fixed (:345-358); `onFinish` sync (:353); keyed by label (:328);
no passthrough.

**Tree** (`structure.jsx:15`): `open` (:16), `at` (:17) uncontrolled;
`onSelect` leaves only (:91, :126); unscoped ids (:51, :76, :103, :114);
click always toggles (:125); typeahead forced (:93-104); indent inline
(:121); `label` only (:130); no passthrough.

**Reorder** (`structure.jsx:142`): `order` seeds once (:144); no pointer
drag (:167-190); Up/Down only (:172); `⠿` fixed (:189); focus restore
forced (:178-186); DOM event always (:160); `onChange(order)` only
(:155); no passthrough.

**SplitPane** (`structure.jsx:203`): `value` uncontrolled (:206); no
React `onChange` (:215); steps `2`/`10` literal (:242); vertical
separator only (:235, :257); no collapse/snap; `pointercancel` leak
(:263-264); `--kp-split` name fixed (:225); no passthrough.

**ColorPicker** (`canvas.jsx:18`): `colour` seeds once (:21); HSL only
(:47-51); output format fixed (:33); no `step` (:66-67); measures on
`document` (:27-30); one `against`; all parts always rendered (:73-83);
`display: contents` inline (:56); no passthrough.

**GridLayout** (`canvas.jsx:95`): `layout` seeds once (:97); no pointer
drag (:136-147); keymap/step fixed (:140-143); no row bound (:107);
`onLayout` per keystroke (:110); tile shell fixed (:121-130); no
passthrough.

**EmptyState / Copyable / Health / Timeline / Diff** (`patterns.jsx`):
`action` discarded when filtered (:26); `<p>` title (:21-22); no icon;
Copyable `1500` literal (:63), clipboard only (:54), no `onCopy`/
`onError`, `state` uncontrolled (:38); Health four states only (:80),
dot fixed (:85); Timeline strings only (:94), no `dateTime` (:103), keyed
by content (:100); Diff signs fixed (:127), line numbers forced (:126);
no passthrough on any of the five.

**ThemeSwitcher** (`theme-switcher.jsx`): `open` uncontrolled (:69); all
eleven themes always (:119); Escape (:80-81) and outside `mousedown`
(:76-83) forced; icons local, not replaceable (:12, :34, :101, :145);
Tailwind trigger classes (:95); `z-50`, fixed placement (:107); wrapper
positioning forced (:92); `<li>` status rows inside `role="listbox"`
(:110, :115); `tabIndex={0}` on every option, no roving (:126); no
rest/ref (:63).

**hooks/use-strings.jsx**: nearest provider replaces (:37); memo no-op
(:24); inline `strings` defeats memo (:39); no plural/ICU hook.

**hooks/use-theme.js**: optimistic apply not optional (:99-120);
persistence not optional (:100); target fixed (`theme-core.js:76`); no
`onError`.

### Framework-free

**colorpicker.js**: colour not settable — `update()` only on `'input'`
(:59-92, :95), no handle (:38, :110); `data-kp-contract-ok`
write-only (:87-88); HSL only (:95, :104); unconditional `document`
listener (:100); event detail lacks ratio and verdict (:91); spurious
event at attach (:101); detach leaves `--kp-color`, swatch, value,
attribute (:103-107); auto-attach (:115-118).

**combobox.js**: chosen values closure-local, server-rendered tags
invisible (:81); no `open()`/`close()` (:83-91); filter hardcoded (:99-
101), `subsequence` unreachable; `loop` never passed (:156-161); open on
focus (:209-211), close on blur (:198-205, :212), Backspace (:175-180),
stay-open (:129) all forced; no cap/duplicate policy (:120); no debounce
(:207); tag structure and `×` fixed (:138-153, :151); one `CHANGE_EVENT`
for add/remove (:48, :179, :195); detach leaves tags, `hidden`,
`aria-expanded` (:217-224); auto-attach (:232-235).

**components.js**: `enforceContracts` disables with no detach, no prior
state recorded (:89-96); English literals not from `getStrings()`
(:55-56, :70); no rule selection (:45-76); unconditional `console.error`
(:92); confirm window per call, not per element (:39, :105); `armed`
closure-local (:117, :139); disarm on blur forced (:144); first click
swallowed (:133-134); no arm/disarm events (:119-141); auto-attach and
enforce on `DOMContentLoaded` (:160-166).

**datatable.js**: page/sort/query closure-local (:105-106, :166-179,
:158-163); selection unreadable (:192-231); comparator `'nl'` (:59-76,
:62-64, :70, :75); filter over whole-row text (:160); no debounce (:233);
asc/desc only (:189); paging implicit on pager presence (:117); pager
structure fixed (:130-138, :144-156); status text two forms (:128);
detach leaves order, `aria-sort`, pager, empty state (:239-246 vs :122,
:175-176, :131, :140); rows snapshotted at attach (:103); `VIEW_EVENT`
detail incomplete (:141, :220), empty key emitted silently (:219);
auto-attach (:254-257).

**datepicker.js**: date closure-local, `data-kp-date-value` goes stale
(:93, :185-186); panel not settable (:170-181); no min/max/disabled
(:148-166); Monday-first (:100, :238, :241); `dd-mm-yyyy` (:49-51, :185),
parse ISO or Dutch only (:64-65); title format (:119); no range/today/
week numbers; close/refocus forced (:188-189); outside/Escape forced
(:269-273, :209-211, :248-252); panel built entirely here with `‹ ›`
(:104-167, :111, :124); `DATE_EVENT` undifferentiated, `{iso}` only
(:187, :202); detach leaves panel content and attributes (:283-290);
auto-attach (:298-301).

**forms.js**: busy latch closed (:48-56, :193-194, :266); `showError`/
`clearError` closure-local — no server-side errors (:123, :140); no
revalidate/read handle (:102, :271); blur-only (:171, :228);
`noValidate` forced, not restored (:112, :234); focus stealing forced
(:225, :199); `.kp-field` wrapper class fixed (:124, :127, :141, :144);
summary structure fixed (:202-220); `Math.random()` ids (:129); nothing
fires on invalid submit (:48, :56); late fields never validate (:228,
:232); auto-attach (:276-279).

**gridlayout.js**: no `applyLayout()`; writing `data-x`/`data-y` does
nothing (:38, :67); no pointer drag (:84-133); step fixed (:109-131);
keys fixed (:107-132); no collision policy; global clamp only (:97-101);
aria-label overwritten (:78, :77); event per keystroke (:81); detach
leaves inline grid placement and labels (:138-141, :72-73, :64);
auto-attach (:149-152).

**listbox.js** — the model: no import side effect; `loop`, callbacks,
index readable/settable. Gaps: `OPTION_SELECTOR` and the disabled filter
module constants (:35, :47); hover follows highlight, not disableable
(:175-181); `scrollIntoView` unconditional (:83); key map fixed
(:120-156); no typeahead; Escape not disableable (:150-151); id prefix
and `is-active` fixed (:58, :78, :93); no events at all (:187-212);
destroy leaves ids and stamps `aria-selected="false"` (:206-211, :58,
:93).

**no-flash.js**: import side effect (:26-32); `'theme'` and `data-theme`
literal in both places, not `STORAGE_KEY` (:21, :28, :22, :29); snippet
not parameterised (:19-24); no `THEME_EVENT` (:29).

**overlays.js**: `attachDialogs`/`attachTabs` not idempotent (:30-46,
:62-120); selected tab closure-local (:72); automatic activation only
(:95, :101); Left/Right only (:92); wrap forced (:95); always `showModal`
(:37); toast region fixed (:137-143); toast text only (:145-147); no
events at all (:30-151); detach leaves `tabIndex` and `hidden` (:116-119,
:111, :78); auto-attach (:153-159).

**palette.js**: Ctrl/⌘+K fixed on `document` (:59-61, :152); `?` fixed
(:173, :180), typing list fixed (:71); first-in-DOM singleton (:142,
:175); no preset query (:94-109); matcher fixed (:102); clear on close
forced (:127-130); no grouping/recents; `data-kp-keys` never read (:19);
`RUN_EVENT` only, sheet dispatches nothing (:43, :164-185); detach leaves
`hidden` and an open dialog (:155-161); auto-attach (:192-195).

**patterns.js**: `COMMIT_EVENT`/`UNDO_EVENT` no detail (:115, :107); no
failure recovery (:94, :111-116); in-flight state hidden (:95); `1500`
literal (:69-72); toast lifetime = undo window (:98); hide target chain
fixed (:89); `.hidden` only (:94); copy source by id on `root` (:51);
undo button fixed (:99-102, :109); failure toast unconditional (:60); no
copy events (:63-72); detach does not cancel the timer, restore the row
or remove the toast (:76-79, :120-123, :111); auto-attach (:131-134).

**structure.js**: tree expand state readable in `aria-expanded` but no
`expandAll`/`focusItem` (:98, :104, :123, :34); roving tab stop not
settable (:63-67); no events at all (:57-158); no selection; typeahead
forced (:130-138); click always toggles (:144-149); reorder Up/Down only,
no drag (:177); no `setOrder` (:161-194); no announcement, no
`getStrings()` (:181-186); split value closure-local, attribute
write-only (:206, :209-217, :211); steps `2`/`10` literal (:222);
horizontal only (:223-224, :236); pointer leak (:242-243); detach
restores nothing (:153-157, :190-193, :248-252); auto-attach (:260-263).

**theme-core.js** — the other model, with gaps: target forced to
`documentElement` (:60, :76-78); `dark` class fixed (:83); unknown theme
silently substituted (:75); cross-tab sync bundled (:141-148); event on
`document`, not bubbling, not cancelable (:85); storage failure invisible
from `applyTheme` (:99-106).

**theme-picker.js**: late options unmarked (:84, :109); menu markup and
inline SVG fixed (:147-173, :164-168); unescaped labels (:159, :163,
:170); string builder schedules an attach (:156); persist on click forced
(:95); close enclosing popover forced (:98-100); status placement fixed
(:95, :44-48); no own event; detach leaves selection marks (:110-113,
:56-64); auto-attach (:177-183).

**upload.js**: row structure and `×` fixed (:63-104, :94); no
`setError`/`setDone` beside `setProgress` (:116, :179); no `files()`/
`clear()` (:47, :163); one validation rule, `accept` ignored (:60); drop
always on (:150-152); removal silent, no event (:95); size format fixed
(:37-41); reject reason fixed (:118); detach leaves rows and drag state
(:154-160); auto-attach (:182-185).

**wizard.js**: step closure-local, no `goToStep` (:50); `onNext` sync,
no cancelable before-step (:90-95, :75-88); validation gate unconditional
(:92); labels not navigable (:46); focus and `tabindex` forced, never
removed (:69-70); linear only (:66, :91); spurious `STEP_EVENT` at attach,
no previous/direction (:71, :104); detach leaves everything (:106-110);
auto-attach (:118-121).

### CSS, fx, package

See "Cross-cutting gaps" above for the CSS scale and the fx gating; the
full literal-by-literal list is in the sweep transcript and is rebuilt
here as each is tokenised. The package-surface gaps: no `./components/*`
or `./fx/*` subpaths (`package.json:15-44`); barrel side effects
(`index.js`, 17 imports); `sideEffects` wrong (`package.json:12-14`);
`fx` requires `motion` (`fx/index.js:5`); `useReducedMotion` not exported;
`./hooks/use-theme` not exported; token sources not exported; no `types`
condition; `"private": true` (`package.json:6`).

## Decisions, 2026-09-05

Kenny answered the sweep's form:

| | Decision | Consequence |
| --- | --- | --- |
| D1 | **Everything now** — rounds A and B in one release | the build is days, not hours; one combined report at the end |
| D2 | **Pure modules, with `js/auto.js`** | every `js/*.js` loses its import-time attach; one entry attaches everything on `DOMContentLoaded`; `sideEffects` becomes truthful |
| D3 | unanswered | `STRINGS_NL` stays untouched until Kenny answers; asked again in the report |
| D4 | **English labels in the source, override in both channels** | `themes/*/tokens.json` labels become English; `themeMenuMarkup({ labels })` |
| D5 | **Browser locale** | `Intl` decides date format, week start and collation unless the consumer passes `locale`, `weekStartsOn`, `format`/`parse` |
| D6 | **3.0.0** | MIGRATION.md per decision |
| D7 | **Keep disabling, make it recoverable** | DI10 stays enforced; `enforceContracts` records prior state, returns a detach, re-evaluates, takes per-element opt-out, and speaks through the dictionary |

And one request in the remarks, verbatim: "In de theme picker, kan je een
onderscheid maken tussen light en dark themes? Misschien met een kleine
scheiding tussen hun en een kleine tekst per sectie die Light/Dark zegt?
Maak er iets moois van." — recorded as TH63, both channels.

## What was done

Appended as the work lands.
