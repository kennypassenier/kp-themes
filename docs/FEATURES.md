# Features — kp-themes

> **FROZEN — 2026-09-04.** Rated by Kenny across four rounds in Phase 2 of
> the dev procedure, and frozen at the report gate on the same day.
> Changes go through a mini-round only: one form covering that single
> point, carrying the original decision, the new insight, and what it
> costs in work already done.
>
> Kenny's override from [DESIGN_INVARIANTS.md](DESIGN_INVARIANTS.md)
> applies unchanged. Freezing governs *how* a change happens, not whether
> he may make one.

Feature IDs `TH*` are permanent: they appear in commits, test names,
documentation and every later form. Design invariants carry `DI*` and
live in their own document; the nine that produce work are cross-
referenced below.

## The tally

| Rating | Count |
| --- | --- |
| Essential — this is v1 | 29 |
| Desired — after the essential list is empty | 2 |
| Later — recorded, untouched this round | 3 |
| Don't do | 1 |
| **Rated** | **35** |

Plus six decisions that are not ratings, and twelve design invariants.

Round three (2026-09-05, TH64–TH88): seven Essential decisions covering
eight themes, five Desired, four Later, five Don't do, plus three pieces of
enabling work and the showcase comparison view — all shipped in 3.1.0.

## Test bars, agreed at the freeze

Defined now rather than discovered in Phase 7. These apply to every
feature in their category; a feature's own row adds only what is specific
to it.

**A component is done when** it appears on the showcase in all seven
themes and in every variant and state it has, actually rendered rather
than screenshotted · every colour pair it uses is in the contrast gate and
its boundaries clear the 3:1 floor of DI1 · where an invariant applies
there is a test that fails without it (a destructive button lacking undo
or confirmation must error; a badge carrying a semantic colour without
text or icon must error) · and both channel variants exist, React and
framework-free, rendering the same markup structure, verifiable side by
side on the comparison page.

**A gate is done when it has been red once.** A violation is deliberately
injected, the gate is shown to fail, the violation is removed, the gate is
shown to pass, and that drill is recorded. Provenance: the Huurbeheer
retrospective, where checks keyed on a filename .NET 10 no longer emits,
so every "green" run had silently skipped them — the only tell was that it
finished suspiciously fast. A gate that has never fired is a hope.

**The picker is done when** five behaviours are tested: it stores the
choice and reads it back · it sets the theme attribute on the root element
· it derives which themes are dark from the data rather than from a list ·
it falls back to formal on an unknown value · and two pickers on one page
stay in step. The third is the one with a name attached: kyu assumed four
dark themes where there are three.

## Essential — v1

| ID | Feature | Specific bar |
| --- | --- | --- |
| TH1 | Button, with its variants and states | 39 uses measured in kyu; carries the DI10 destructive contract |
| TH2 | Badge | JobTracker hand-wrote this as `StatusPill.jsx`; carries the DI4 label-or-icon contract |
| TH3 | Table | appearance only; sorting and filtering are out of scope |
| TH4 | Alert | four flavours, so it blocks on TH9 |
| TH5 | Form field, with label, help and error text | |
| TH6 | Card | `--card` pair already gated |
| TH7 | Navigation bar | the skip-link of TH36 rides on this |
| TH8 | Theme picker | the five tests above |
| TH9 | Semantic colours: success, warning, info | 3 tokens × 7 themes × 2 values = 42 colours, each through the contrast gate |
| TH10 | Interaction states: hover, active, disabled | values derived per DI3 |
| TH11 | Publish `--theme-font-body` | two consumers independently invented this name |
| TH12 | The package applies the display face itself | today read once, at `themes.css:485`, formal only |
| TH13 | Move cyberpunk's texture into `themes.css` | makes a vendored copy complete for all seven |
| TH14 | Remove the register's hidden dependency on the Tailwind file | `--font-mono` is declared only there |
| TH16 | Components emit the register's classes | brings 169 otherwise inert lines to life |
| TH18 | `SHA256SUMS` beside every release tag | ecosystem norm N2, applied to a CSS file |
| TH20 | All seven themes declare the same tokens | ten names are asymmetric today |
| TH21 | Anatomy document first, then the colours | six of seven themes have no such document |
| TH22 | A parity check enforcing TH20 | turns TH20 from agreement into gate |
| TH23 | Ship the no-flash snippet | six lines, proven in kyu, deliberately ignorant of which themes are dark |
| TH26 | Pin the contract values with their reason | `theme`, `data-theme`, the `dark` class |
| TH27 | Picker behaviour tests | the five above |
| TH28 | `DESIGN_INVARIANTS.md` | written 2026-09-04 |
| TH31 | Links, visited links, text selection | browser blue scores 1.99 / 2.09 / 2.06 on the dark themes |
| TH32 | Ordinary text elements | `code`, `pre`, `kbd`, `mark`, `blockquote`, `hr`, list markers |
| TH33 | Showing data | long URL or identifier, masked value, tabular numerals, truncation, timestamp, empty state — three already hand-written in kyu |
| TH34 | The browser's own hooks | `accent-color`, autofill, `::placeholder`, `:disabled` / `:invalid` / `:checked`, `::marker` |
| TH35 | Components that sit above the page | dropdown, dialog with backdrop, tooltip, toast, accordion, tabs, breadcrumb, pagination, progress, spinner, skeleton |
| TH36 | The page's shell | skip link, footer, print stylesheet, error page |

## Desired

| ID | Feature | Note |
| --- | --- | --- |
| TH15 | Widen the contrast gate to the nine uncovered pairs | per token, decide which threshold applies; borders are not text |
| TH19 | Run the type check that `jsconfig.json` already declares | one dev dependency and one gate line |

## Later

| ID | Feature | Why not now |
| --- | --- | --- |
| TH17 | Staleness check for the vendoring consumers | no consumer is behind today, and **both** already have their own — corrected 2026-09-04, kyu shipped one after this was rated |
| TH25 | The picker optionally sets Bootstrap's own dark switch | our components are scheduled to remove the need |
| TH30 | Check whether a consumer conforms to the themes | needs a numbered component set to compare against, so after v1 |

## Don't do

| ID | Feature | Kenny's reason |
| --- | --- | --- |
| TH24 | Backward compatibility for JobTracker's five imports | v1 is a break; JobTracker adapts. It hears about it at the tag (TH29), with the five names and their replacements. |

## Round two — components, rated 2026-09-04

A second rating round after v1.1.0, opened by Kenny: "wat ik nog als
component wil toevoegen is een datatable … ik wil ook top of the line
forms. En eigenlijk nog zoveel meer." The candidates were drawn by going
through the whole of <https://github.com/brillout/awesome-react-components>
— 24 categories under UI Components, 21 under Form Components, plus
layout, animation and frameworks — and keeping what is high-tech or
crucial in a modern codebase.

TH37 and TH38 were not rated: Kenny asked for them directly.

| ID | Feature | Rating | Note |
| --- | --- | --- | --- |
| TH37 | DataTable — sorting, per-column and global filtering, pagination, column visibility and resizing, row selection, expandable rows, empty and loading states, and a narrow layout where a row becomes a card | asked for | Measured against TanStack Table's feature list, which is what "best in 2026" means. Deliberately WITHOUT virtualisation, spreadsheet editing or Excel export: that is a grid, a different product (see TH42). |
| TH38 | Forms — field group with label, hint, error and description correctly tied together, an error summary that jumps to the first bad field, a required marking that is not only an asterisk, validation that reports on blur, and a submit button that says it is working | asked for | The input types are TH39, TH41, TH43, TH44 |
| TH39 | Combobox / autocomplete | Essential | The most-used complex form element we do not have, and the hardest to do well: keyboard navigation, `aria-activedescendant`, announcing the result count, and a list that arrives from a server |
| TH40 | Command palette (⌘K) | Essential | Reaches everything without growing the menu. Pairs with TH49 |
| TH41 | Tag input | Essential | Shares its whole mechanism with TH39, so cheaper built together |
| TH42 | Virtual list | Don't do | Kenny, 2026-09-04. It is what would turn the DataTable into a grid; TH37 stays a table |
| TH43 | Date and date-range picker | Essential | Half of every dashboard filter, and the classic place where keyboard access dies |
| TH44 | File drop and upload | Essential | The appearance and the states; the sending stays the consumer's |
| TH45 | Tree view | Essential | Without drag-and-drop |
| TH46 | Drag to reorder | Essential | Must work from the keyboard too. SortableJS is framework-free, so both channels can share one engine |
| TH47 | Visual filter builder | Later | Rated 2026-09-04 once the description named the Notion and Airtable equivalents and pointed at a live demo. It shares its whole mechanism with TH37's filtering, so it is superstructure rather than a second system — but it stays Later |
| TH48 | Step wizard | Essential | The superstructure on TH38 |
| TH49 | Keyboard shortcut sheet (`?`) | Essential | A command palette without discoverability is a secret |
| TH50 | Empty states with an action | Essential | `.kp-empty` is text today. A real empty state says why there is nothing and what to do, and differs from an empty list *after* a filter |
| TH51 | Optimistic row action with undo | Essential | DI10 already forces the choice between undo and confirmation; this is the pattern itself |
| TH52 | Status page parts — health indicator, event timeline, "last updated" | Essential | The category Kenny's own projects use most: homelab, kyu, kyu-runner, the Home Assistant dashboard |
| TH53 | Copyable value | Essential | `.kp-id` and `.kp-masked` exist; this is the action beside them |
| TH54 | Diff / comparison view | Essential | Every retrospective ends in a diff someone has to read |
| TH55 | Split pane | Essential | Small, and accessible with a separator that moves on the arrow keys |
| TH56 | Movable grid layout | Desired | Big, and only useful once there is something to arrange |
| TH57 | Colour picker | Desired | With the contrast ratio against the current theme, measured the way our own gate measures it |
| TH58 | Guided tour / onboarding | Don't do | Kenny, 2026-09-04. A lot of machinery for something seen once |
| TH59 | Rich text editor | Don't do | Kenny, 2026-09-04. tiptap and slate are frameworks, not components; taking one on means maintaining an editor. Markdown input and the styling of its output stay in scope |
| TH60 | One string dictionary, English by default, replaceable from outside | Essential | Correction KT5, 2026-09-05. Test bar: `gates/check-strings.mjs` goes red for each of the four shapes a literal can take, and a consumer replaces a string through a prop, a provider or `setStrings()` without touching this repository |
| TH61 | FormField renders every control, not only an input | Essential | Kenny, 2026-09-05. Test bar: a select, a textarea, a checkbox and a radio group render and validate in both channels, and a radio group counts as one question in the summary and carries the invalid state as a group |
| TH62 | A consumer's own link component in NavBar, Breadcrumb and Pagination | Essential | Kenny, 2026-09-05. Test bar: a link component handed in is what renders, keeps the class and the aria-current, and the skip link stays a plain anchor |
| TH63 | The theme picker groups light and dark, with a small label per section | Essential | Kenny, 2026-09-05, in the sweep's remarks: "Maak er iets moois van." Test bar: both channels render a light group and a dark group from the registry's `dark` flag, each labelled from the dictionary, every theme in exactly one; drilled by defaulting `grouped` to false in each channel |

**Built on 2026-09-04**, all of round two, in both channels: TH37-TH41,
TH43-TH46 and TH48-TH57. TH42 (virtual list), TH58 (guided tour) and TH59
(rich text editor) are Kenny's "don't do" and stay undone; TH47 is Later.
418 browser tests drive them in Chromium and Firefox, and every one is on
the showcase and on the eleven bare per-theme pages.

**Deliberately outside the scope**, recorded so the question does not come
back: charts (the `--chart-*` tokens are ours, a charting library is not),
maps, spreadsheet grids, captcha, payment fields, and icon sets. kp-themes
defines themes and builds components on them.

## Round three — themes, rated 2026-09-05

Kenny's form of 2026-09-05 over eleven candidates and ten ideas; the
research and the overlap scores are in `THEME_CANDIDATES.md`. One test
bar for every theme: `tokens.json` passes every gate in `npm run gates`
(all 39 contrast pairs, the invariants, the layers), an `anatomy.md`
answers the invariant questions, the bare fixture and the showcase render
it, and the browser suite is green for the new name in both browsers.
Where a theme needs enabling work, that work is its own feature and is
built first.

| ID | Feature | Rating | Notes |
| --- | --- | --- | --- |
| TH64 | Theme `brutalism` — neo-brutalism, light | Essential | 3px black borders, hard offset shadow, candy plates; needs TH85 |
| TH65 | Theme `deco` — art deco, dark | Essential | gold on near-black, jewel accents, geometric display face, chevron texture |
| TH66 | Theme `academia` — dark academia, dark variant | Essential | ink/mahogany ground, oxblood + forest, candle gold, Garamond display; the parchment version is not built (sepia) |
| TH67 | Themes `shade-light` and `shade-dark` — a medium-contrast pair | Essential | Solarized-derived, one scheme, two themes; light foreground is base01 (4.99), accents are plates |
| TH68 | Theme `ticker` — amber on black, data-dense | Essential | IBM Plex Mono numerals, ledger rules, no motion; the theme JobTracker's tables want |
| TH69 | Theme `woodblock` — ukiyo-e, light | Essential | washi, Prussian blue, beni red, 2px black key-block outline as `--border-strong` |
| TH70 | Theme `phantom` — playful dark, Persona 5 | Essential | black, white, one red (plate with white ink), halftone, condensed italic display |
| TH71 | Theme `retro` — Windows 95 chrome, light, tamed | Desired | gated boundary under the bevel, pixel face for headings only, no dotted focus; needs TH87 |
| TH72 | Theme `mono` — greyscale, light | Desired | status plates as a lightness ladder + outline/dash; chart pattern fills; needs TH86 |
| TH73 | Theme `grotesk` — Swiss typographic, light | Desired | white, black, one red, 12-column grid texture, red square before headings |
| TH74 | Theme `lapis` — Persian illumination, dark | Desired | lapis ground, ivory, gold, girih tile; vermilion is plate-only (3.20) |
| TH75 | Theme `nostromo` — cassette futurism, medium-light | Desired | beige plastic, orange LED plates (never text), vent-slot texture |
| TH76 | Theme neumorphism | Later | fights DI1 by definition; a tamed version is `light` with shadows |
| TH77 | Theme glassmorphism | Later | needs a glass register (blur on card/popover only) and a non-indigo ground |
| TH78 | Theme pea soup (Game Boy) | Later | four shades; depends on TH86's pattern fills |
| TH79 | Theme atomic (mid-century) | Later | cream, teal, mustard, coral; next round |
| TH80 | Theme vaporwave / synthwave | Don't do | synthwave scores 3 against cyberpunk, vaporwave 2 against pastel |
| TH81 | Theme botanical / earth | Don't do | scores 3 against forest; sage fails DI1 as a boundary (2.23) |
| TH82 | Theme steampunk | Don't do | scores 3 against solstice, 2–3 against sepia |
| TH83 | Theme cosmic / space | Don't do | scores 3 against dark, which already carries the starfield |
| TH84 | Theme reader (e-paper) | Don't do | duplicates TH72 |
| TH85 | `--fx-shadow-offset` knob — a hard offset shadow on card, button and input | Essential | 0px in every existing theme; the first theme knob added since L3, so a minor version. Test bar: the knob paints in brutalism and nothing changes in the eleven (pixel comparison on the fixture) |
| TH86 | Pattern fills for status plates and chart colours | Desired | `--chart-pattern-1..5` and outline/dash badge variants, as tokens per DI9. Test bar: the seven badges of `mono` are pairwise distinguishable with hue removed |
| TH87 | Retro register stylesheet — raised/sunken bevel on button, input and card, title bar behind h1 | Desired | decoration around a gated `--border-strong`, never instead of it. Test bar: DI1 still passes on every control with the register loaded |
| TH88 | The showcase compares two themes side by side | Essential | Kenny, 2026-09-05, at the Phase 5 gate: the page had become "unwieldy" for its purpose, comparing themes. Every element is still rendered; the page splits vertically into a left and a right half, each with its own picker at the top choosing that half's theme, and the two halves scroll together. The picker changes this needs are showcase-only — an exception, not a package feature. Test bar: both halves render every specimen, the left picker changes only the left half and the right picker only the right, and scrolling one side scrolls the other by the same amount |
| TH89 | Terminal's block cursor scoped to the focused field | Essential | Kenny, 2026-09-06: the cursor after every h1/h2 "is een beetje 'too much'" on a page with more than one heading — 3.1.1, outside the round-three rating batch. Test bar: `.kp-field:focus-within .kp-field__label::after` carries the glyph only while a descendant control has focus; no heading carries it |

## Decisions that are not ratings

| ID | Decision |
| --- | --- |
| M1 | Distribution stays a git tag plus a checksum. **Amended 2026-09-04:** the Dependabot measurement is closed unmeasured — there is no longer a dependency for it to follow (S19). |
| M2 | No ecosystem integration, deliberately. kyu as a release channel was the one real candidate; both vendoring consumers sit on the same machine as this repository and Almanac already solves it locally. Revisit when a consumer moves to another machine. |
| M3 | Git is the backup; GitHub is the copy; there is no runtime state. **No restore drill**, by Kenny's decision — the risk accepted is that a fresh clone has never been proven to build. |
| M4 | The `localStorage` key stays `theme` as a pinned contract value, with an optional prefix so apps on one domain need not share a choice. |
| TH29 | JobTracker is told at the tag, with a migration note naming the five imports. |
| U1 | Almanac's markup is not measured. What kyu and Almanac built has no official status; conformance is a later question (TH30). |

## Design invariants that produce work in v1

See [DESIGN_INVARIANTS.md](DESIGN_INVARIANTS.md) for the evidence and the
per-theme compliance table.

| ID | Work |
| --- | --- |
| DI1 | Split `--border` from `--border-strong`; raise control boundaries to 3:1 in all seven themes; extend the gate |
| DI2 | The two-channel focus ring as a system constant, verified against every surface |
| DI3 | One derivation rule for state values, with a recorded per-theme opt-out |
| DI4 | Fix the status colours in five themes; add the colour-vision gate |
| DI5 | Compute the flash threshold for the existing animations; add the gate |
| DI6 | Declare `color-scheme` per theme; repair the layer ordering in the three dark themes |
| DI7 | Close the two reduced-motion gaps: the unguarded transition, and the missing change listener |
| DI8 | A disabled token without a contrast floor — Kenny's decision against the recommendation |
| DI11 | Text-spacing and reflow checks in a real browser, once the components exist |

## Order of work

Fixed by TH21 and by what blocks what:

1. `DESIGN_INVARIANTS.md` (TH28) — done, it defines the questions
2. The seven anatomy documents (TH21) — they are the source for every colour choice
3. Tokens: TH9, TH10, TH11, TH20, and the DI repairs
4. The gates: TH22, DI4, DI5, DI6, DI7 — each drilled red-then-green
5. Components (TH1-TH8, TH31-TH36) and the showcase
6. Then TH15, TH19

## Round four — the layout layer, the utility API and the documentation site (2026-09-06)

Twenty features, TH90–TH109, rated over two forms on 2026-09-06: nineteen
Essential, one Desired, none Later, none dropped. The scope they decompose
is S22–S31 in `docs/SCOPE.md`. Everything is additive and ships in 3.2.0
except TH107, which changes existing behaviour and therefore waits for
4.0.0 together with D3.

The test bar column is the concrete expectation agreed at rating time, not
in Phase 7. Where a bar says "drilled", it means the test is driven red by
removing the thing it measures before it is trusted (KT3).

| ID | Feature | Rating | Test bar, agreed at the rating |
| --- | --- | --- | --- |
| TH90 | Layout containers: `.kp-page`, `.kp-stack`, `.kp-row` (+ `--end`, `--between`, `--nowrap`), `.kp-autogrid`, `.kp-sidebar`, `.kp-section`, `.kp-center` | Essential | One browser test per class pinning its measurable property: page has a max width and centres; stack leaves a measurable gap between two adjacent children; row aligns its controls on one line and wraps at 320px; autogrid has more columns at 1280 than at 480; sidebar drops below its threshold; section adds space above; center caps its width. Each drilled red by removing the rule |
| TH91 | Text and content utilities: `.kp-prose`, `.kp-text-muted`, `.kp-text-end`/`-center`, `.kp-mono`, `.kp-code-block` | Essential | Muted text is exactly `--muted-foreground`; prose stops at its measure; mono uses the theme's mono family; a 200-character key in a code block does not widen the page at 320px. All 24 themes, on the documentation page |
| TH92 | The busy state made visible: a rule for `[aria-busy='true']` | Essential | The same button with and without `aria-busy="true"` differs in at least one computed property, in both channels, and the rule lives in the package rather than in the fixture |
| TH93 | The utility API: ~123 generated `kp-`-prefixed classes (spacing, gap, display, flex alignment, text, width), no breakpoint variants | Essential | A gate lays the generated stylesheet beside the documented list and goes red on any difference in either direction. One browser test per family measuring the real effect — `.kp-p-md` yields the padding its token says, and follows the token when a theme changes it |
| TH94 | A spacing and typography scale as tokens in all 24 themes | Essential | The existing token-parity gate covers the names once they are tokens. A page with h1–h6 shows a strictly descending size ladder in every theme, and no layout class carries a literal where a token exists. Built before TH90 and TH93, which read it |
| TH95 | The table scroll region reachable by keyboard (`tabindex="0"`, `role="region"`, a label) | Essential | In both channels the wrapper carries the three attributes; a browser test tabs to the region and scrolls it with the arrow keys; the label names the table. The test demonstrably fails on the current code before the repair goes in (standing rule 8) |
| TH96 | The four remaining table layers: cell strategies (`.kp-cell-truncate`, `.kp-cell-break`), column priority (`.kp-col-low`), container queries, a card layout for the plain `.kp-table` | Essential | A 70-character identifier in a breakable cell does not push the table past its container at 320px; a truncated cell shows an ellipsis and keeps the full value reachable; a low-priority column is present at 1280 and gone at 480, header and cells together; the same table in a 400px container adapts while the viewport stays 1280; the plain table falls into cards at narrow like the DataTable, each cell carrying its column header |
| TH97 | The loud fallback, a version constant in the registry, and a diagnostics page | Essential | An unknown name produces one console warning and one event carrying both the requested and the applied name; the version constant is generated and a gate goes red when it disagrees with `package.json`; the diagnostics page names both versions and both theme lists, and is fed a deliberately mismatched pair in a test so its verdict is itself measured |
| TH98 | The ten example pages: app shell, login, list-with-form, settings, wizard, empty-and-error, hero, pricing-and-testimonials, article, profile | Essential | Each renders in both channels and appears in the site navigation; the list-with-form page demonstrably contains the two shapes from the chassis-rs report — two fields with a button on one row, and a 70-character table cell — so TH99 has something to measure |
| TH99 | The overflow and rhythm gate | Essential | Runs over every example page and every documentation page, in both browsers, at 320, 768 and 1280: no horizontal page scroll, no element wider than its container, no two consecutive blocks touching. Demonstrably red once on each of the three faults separately |
| TH100 | The generated documentation site, one page per component (~45), nine sections each | Essential | The site builds from one generator and the Pages workflow publishes it; every page is reachable from the navigation; a gate counts all nine sections on every component page; the props tables come from the `@typedef` blocks all 17 React files already carry |
| TH101 | The four documentation gates: coverage, truth, one source, layout | Essential | Each has been red once on an injected fault — a component without a page, a prop in the table that is not in the source and a prop in the source that is not in the table, a snippet that differs from the example rendered beside it, and a page that scrolls sideways. The four drills are recorded in the gate's own comments |
| TH102 | The per-theme story on the site, rendered from the anatomy documents | Essential | Every theme in `themes/order.json` has its story on the site; a gate goes red as soon as a theme arrives without one. The text demonstrably comes from `themes/<name>/anatomy.md` rather than being a copy of it, and the colours beside it are that theme's live tokens rather than an image |
| TH103 | The checksum manifest completed (`js/strings.js`, `css/retro-register.css`) plus a gate | Essential | The manifest holds every file the package offers as an export and a vendoring consumer can copy; a gate lays the two lists beside each other and goes red on a difference, so a new file cannot silently fall outside again |
| TH104 | Container queries beyond the tables (card grid, nav bar, DataTable) | Essential | One test per converted component placing it in a narrow container while the viewport stays wide, measuring the narrow form. The old viewport media query is removed in the same commit, so two mechanisms never coexist |
| TH105 | A density mode, `data-density="compact"` | Desired | The same table and form are measurably shorter in compact mode, in all 24 themes, and the touch targets of buttons and checkboxes stay above 24px (WCAG 2.5.8) even compact. Depends on TH94 |
| TH106 | One dist bundle: a single CSS and a single JS file beside the loose files | Essential | A page loading only the bundle behaves identically to one loading the loose files — the same tests run over both setups. The bundle is generated and a gate goes red when it drifts from its sources |
| TH107 | The confirmation dialog as the default for destructive actions (4.0.0) | Essential | In both channels a click on a destructive button opens a `<dialog>` carrying the attribute's text; Escape and Cancel do nothing; Confirm performs the action once; focus returns to the button; the existing arm-then-act tests stay green against the variant. The contract check that refuses a destructive button with neither confirmation nor undo keeps applying |
| TH108 | A migration note naming what consumers may delete | Essential | Every class the note names exists in the package — a gate reads the table and compares it with the generated class list, so the note cannot point at something that is not there |
| TH109 | Zero inline styles on the rebuilt consumer pages | Essential | A gate reads every example page and goes red on a `style` attribute or a page-local `<style>` block, with one exception list for what demonstrably cannot be avoided (the anchor names the popovers need), each with its reason. This is the round's exit criterion for the layout layer |
| TH110 | The cyberpunk register reaches the package's own buttons | Essential | A `.kp-button` under cyberpunk measures differently from the same button under formal, in both channels, and the test goes red when the register's rule is removed. **Evidence corrected 2026-09-07:** the first measurement named `box-shadow`, and it was taken on `tests/fixtures/components.html`, which does not load `css/cyberpunk-register.css` at all — the fixture could not supply what the test measured (standing rule 7e, this project's own). Re-measured on the showcase, which does load it: `box-shadow` is **identical** on both (`rgb(147,66,174) 0 0 0 0`, zero-sized, painting nothing, and coming from `.kp-button`'s own `--fx-shadow-offset` rule rather than the register). What the register actually changes is `border-radius` 4px → 0, `clip-path` none → polygon, and `background-image` none → gradient. The conclusion is unchanged and independently checkable: every button rule in the register selects `[data-slot='button']`, and `css/components.css` carries zero `data-slot` references. The card half is already correct |
| TH111 | A size scale on the button | Essential | Three sizes measurably different in all 24 themes — **amended 2026-09-08** (A4 of the deviation form, S49): in height, or, where a theme's approved demo pins one height for every button (terminal 2.9rem, brutalism 3rem), in type size and inline padding; each reading the typography scale R0-TYPO declared, and none below the 24px WCAG 2.5.8 asks of a pointer target — the floor the density mode already respects |
| TH112 | The allow-git contradiction resolved | Essential | Documentation, so no browser test: the bar is that a reader of both documents gets one answer rather than two. `README.md:543` documents the setting; `docs/SCOPE.md:323` says the requirement was dropped on 2026-09-04 because nothing is fetched over npm. The README is the correct half — the git route exists and JobTracker takes it — so the scope statement carries a dated correction rather than being quietly rewritten |
| TH113 | The same overflow shape on four more components | Essential | None of `.kp-button`, `.kp-badge`, `.kp-tag` or `.kp-health` pushes the page sideways at 320 and 360px with an unbroken value, in both browsers, and each test goes red when its own rule is removed. Measured at 360px before rating: 607, 485, 483 and 581px respectively, all four scrolling the page; `.kp-icon-button` stays at 36px because it has a fixed size |
| TH114 | The clip trap in the package's own scroll regions | Essential | An absolutely positioned element inside each of `.kp-table-wrap`, `.kp-diff` and the `<pre>` rule is visible past that box, or the guide says in words that it cannot be and why. Measured before rating: `.kp-table-wrap` does clip — `overflow-x: auto` computes `overflow-y` to `auto` — but nothing positioned lives inside one today, so this was rated as a latent hazard rather than a defect. Kenny rated it Essential anyway |

**TH104 amended 2026-09-06, at the Phase 4 gate.** Converting the movable
grid and the nav bar to container queries needs a wrapper element in markup
the Rust consumers hand-write, because a container query cannot style its
own container. Kenny chose to convert everything rather than leave two
mechanisms side by side, so **TH104 moves from 3.2.0 to 4.0.0** with a
migration note for kyu, Almanac and the chassis kit. TH96's table
conversion is unaffected and stays in 3.2.0. Reasoning in AR24.

**Round four tally.** Nineteen Essential, one Desired (TH105), none Later,
none dropped. Kenny raised three of Claude's own recommendations —
TH92 (the busy state), TH104 (container queries beyond the tables) and
TH106 (the dist bundle) — from Desired to Essential.

**M1 amended, 2026-09-06.** Distribution stays a git tag with a checksum
file, and from now on a release also carries the dist bundle as an asset;
the checksum file covers every file a consumer can copy, not a hand-picked
subset (the fault recorded as KT9). M2, M3 and M4 were re-put and confirmed
unchanged: no ecosystem integration, git is the backup with no runtime
state, and the storage key stays `theme`.


## Round five — the three that waited for a major (2026-09-07)

Eight features, **all eight Essential**, nothing Desired, nothing Later,
nothing dropped.

Three were carried in already rated and frozen, each waiting on a major:
**TH104** (container queries beyond the tables), **TH107** (the
confirmation dialog) and **D3** (`STRINGS_NL` leaves the exports). They
are not re-rated; they are built.

Five were rated in this round's Phase 2, all Essential: **TH110**,
**TH111**, **TH112**, **TH113** and **TH114**. The first three came out
of the four kp-soft reports after this project measured them itself
(P1 did not reproduce and produced nothing to build; P4 became TH111).
The last two are Claude's own proposals, both measured before being put:
TH113 is a real fault on four components, TH114 a latent hazard that
Kenny rated Essential over a recommendation of Later.

**M1, M3 and M4 were re-put and confirmed unchanged.**

**M2 replaced, 2026-09-07.** The standing answer said there was no
ecosystem integration and named kyu as the only candidate. Kenny: *"kyu
is geen releasekanaal meer. momenteel wordt chassis-rs gebruikt om onze
thema's in te bakken in onze Rust API applicaties."* Measured in
chassis-rs rather than assumed:
`crates/chassis/src/shell/assets.rs` bakes **eight** of this package's
files into the binary with `include_bytes!` — `themes.css`,
`components.css` and six `js/` modules — and serves them under a content
hash. It pins one version constant (`KP_THEMES_VERSION = "3.1.0"`) and
keeps a `KP_THEMES.sha256` built from **our** release manifest, checked
by a unit test so their gate holds offline. All eight copies verify
against our `v3.1.0` tag byte-for-byte.

So the answer is: **there is an integration, and it is chassis-rs.** Its
shape is vendoring-with-verification — this package ships a tag plus a
checksum file, chassis-rs copies eight files and checks them offline
against it. kyu as a release channel is dropped as a candidate. Revisit
when a consumer needs something other than a verified copy.

Two things follow for this round. chassis-rs sits two releases behind,
and its own notes say it waits on us: *"the kp-themes hold (layout
utilities, theme revert, confirm dialog)"*. Two of those three shipped in
3.2.0; the third is TH107. And their manifest records that they had to
take `strings.js` from the tag by hand because our release manifest did
not list it although `theme-picker.js` imports it — which is exactly the
fault repaired as R4-LOCALE on 2026-09-07. That handwork disappears at
the next release.

**Frozen 2026-09-07.** Kenny confirmed the tally (F1: Akkoord) and froze
the list (F2: Bevriezen). Changes from here go through mini-rounds only.

## Round six — the next cyberpunk, and the road to 5.0.0 (2026-09-07)

Fourteen features rated in round one of Phase 2, **all fourteen
Essential** — including TH123, which was recommended Desired, and TH128,
which was recommended Later and came back Essential with a research
programme attached (S48).

| ID    | Feature                                                          | Rating    | Test bar agreed                                                                                                                                       |
| ----- | ---------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| TH115 | The palette as tokens — the 81, plus any token the demo needs (S47) | Essential | `check-tokens` parity at 100% across all themes, `check-contrast` green on every pair, the DI table computed for the new theme, `ha/kp-cyberpunk.yaml` regenerated |
| TH116 | Two surfaces in one theme, `data-kp-surface="hero|app"`           | Essential | a fixture with both surfaces under cyberpunk where every text/ground pair passes contrast; the parity gate (TH125) sees all themes answer the hook  |
| TH117 | The navbar: strip geometry, dash-prefixed dropdown, one-shot hover glitch; the notch follows the navbar's side of the screen | Essential | hit test on the dropdown link hits the link in both browsers; keyboard reachable; `clip-path` computed and mirrored when the navbar is placed on the other side; glitch runs once (DI5 computed); one suite drives both channels |
| TH118 | Buttons: notch, mirrored variant, slit flanks, one-shot charge   | Essential | difference-from-rest focus measurement on both sides per variant; `clip-path` per variant computed; KT3 drill                                        |
| TH119 | Decipher and one slice glitch on headings, both channels          | Essential | final text equals source in both channels; runs once per page; reduced motion gives the end state at once; the slice's flash count computed and reported |
| TH120 | Classified emphasis: `mark` clears itself; the dossier variant   | Essential | `::after` scaleX 1→0 with the measured stagger; text always in the DOM; reduced motion clears at once; the dossier opens and closes in both channels |
| TH121 | The razor tear, `data-kp-divider="tear"`, generated at build     | Essential | pixel sampling above and below the ridge at five x positions in both orders; no JS for the rest state                                                 |
| TH122 | Hairlines that draw under headings when scrolled into view       | Essential | scaleX 0 before, 1 after entering the viewport; reduced motion always 1; without the module: drawn                                                    |
| TH123 | Scanlines and vignette retuned on the new palette                 | Essential | texture opacity under the DI9 ceiling; the scanline visible on a hero screenshot                                                                      |
| TH124 | The register answers every component root                        | Essential | a coverage gate: 64 roots answered or excused with a reason; the dashboard fixture passes DI1, DI2, DI4; drill red by removing one root               |
| TH125 | The effects module in both channels, with the hook parity gate   | Essential | `check-closure` green; `check-manifest` counts the file; one suite drives both channels; parity gate drilled red; mid-session reduced-motion stops every effect |
| TH126 | The concept demo as a template in the repository (S46)           | Essential | passes `check-examples-wired` and `check-inline-styles`; renders in both channels; is the fixture for TH117–TH122; in the site navigation           |
| TH127 | The major: migration note, anatomy rewritten, old theme in 4.x   | Essential | `check-migration` green; `check-ids` green; the ecosystem entry updated                                                                                |
| TH128 | Synthwave — after the research programme of S48                  | Essential | its own concept demo (S46) approved before a token is written; the research findings delivered to Kenny first                                       |

Kenny's three annotations are recorded in `docs/SCOPE.md` as S47, S48 and
TH117's dynamic notch.

**Round two, rated 2026-09-07** — Claude's eight proposals: seven
Essential, one Later.

| ID    | Feature                                                                 | Rating    | Test bar agreed                                                                                                                          |
| ----- | ----------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| TH129 | DI5 computed for JS effects and transitions — reported, never corrected by the gate (S42) | Essential | the report names every effect of TH117–TH122 with its flash rate; an injected 5/s loop shows red in the report (drill); the gate changes nothing |
| TH130 | One stylesheet list for every CSS gate, in `gates/config.json`          | Essential | `gates.test.mjs` fails when a manifest stylesheet is missing from the list; drill: remove one file                                        |
| TH131 | The DI5 test reads the register's real keyframes instead of pinning `fx-flicker` by name | Essential | stays green after the register is replaced; drill: a 5/s keyframe turns it red                                                           |
| TH132 | `.fx-pulse` capped with `--fx-pulse-cycles` (default 3)                  | Later     | queued in `docs/MINI_ROUNDS.md`; the pulse still appears in TH129's report                                                               |
| TH133 | Three repairs from the inventory: `.kp-card` instead of `[data-slot]`, a mono fallback for `.microlabel`, the phantom "doubled selector" comment | Essential | a bare `.kp-card` gets the register rule (computed); `.microlabel` renders mono without the Tailwind bridge; the README claim holds      |
| TH134 | The lift plan for 5.0.0, `docs/LIFT_PLAN.md`                             | Essential | 24 rows, each with research, demo and build status; the CLAUDE.md status block points at it                                              |
| TH135 | The research as a repository document (`docs/RESEARCH_2026-09.md`)      | Essential | every reference carries a URL and the label measured/observed; every theme has a row, "nothing found" included — **delivered 2026-09-07** |
| TH136 | The hook vocabulary as a contract in README, USER_GUIDE and the site     | Essential | `check-site` truth: every attribute the section names exists in the effects module; every hook in the parity gate is in the table        |

**M1, M3 and M4 re-put and confirmed unchanged. M2 re-put and confirmed
unchanged** against a recommendation to amend it: the integration stays
chassis-rs as recorded in round five; the two files chassis-rs does not
vendor today (the register stylesheet and the effects module) are named
by TH127's migration note, not by the ecosystem decision.

## The tally of round six

| Rating    | Count  |
| --------- | ------ |
| Essential | 21     |
| Desired   | 0      |
| Later     | 1      |
| Don't do  | 0      |
| **Rated** | **22** |

Plus S47 and S48, two scope amendments made at the gate.

**Frozen 2026-09-07.** Kenny confirmed the tally (F1: Akkoord), accepted
KT10's measurement (K1: Akkoord) and froze the list (F2: Bevriezen).
TH115–TH136 change through mini-rounds only. The research findings and
the per-theme lists of 5.0.0 are deliberately outside this freeze: each
theme gets its own short Phase 2 when its turn comes (TH134).

## Round seven — the element list, rated (2026-09-11)

**Back-filled, and the back-filling is the point.** These nine were rated
by Kenny on 2026-09-11, on the canonical scale, in a form — and then lived
only as prose in `docs/SCOPE.md` while the code was already being built.
Phase 2's output is this document, so this is where they belong. The IDs
are the house scheme; the TH series is closed.

| ID | Feature | Rating | Test bar agreed |
| -- | ------- | ------ | --------------- |
| feat-nav-1 | A navigation that collapses into a toggle on a narrow screen | Onmisbaar | at 320 px the bar is one row with a button; the button opens and closes it; opening puts the focus where the keyboard expects it — **delivered 2026-09-11**, six tests over both channels, drill four red |
| feat-layout-1 | A bar that stays at the top, and the scroll offset an anchor needs to clear it | Onmisbaar | a page longer than the screen keeps the bar in view, measured on the painted position; the skip link's target lands below it — **delivered 2026-09-11**, two tests, both halves of the drill run |
| feat-layout-2 | Smooth in-page scrolling | Onmisbaar | read inside the reduced-motion guard, so `smooth` cannot survive a reader who asked for less — **delivered 2026-09-11** with feat-layout-1 |
| feat-nav-2 | A side navigation that can be hidden, defaulting to an overlay | Onmisbaar | one test per state the component sets — open, closed, remembered — each of which also opens again, measured on what the browser paints — **delivered 2026-09-11**, eight tests in `tests/sidebar.spec.mjs`, drill four red |
| feat-page-1 | A back-to-top control | Onmisbaar | absent at the top, present after scrolling, and it moves the focus and not only the view |
| feat-media-1 | A component for an image in the hero | Onmisbaar | the space is there before the image loads, measured on the painted box with a slow image |
| feat-count-1 | Numbers that count up | Gewenst | at the reduced-motion setting the final number is there immediately, measured on what is painted |
| feat-carousel-1 | The three rotating banks | Niet doen | Kenny, 2026-09-11: a bank that advances by itself takes control away from someone who is reading, and one that does not is a row nobody looks past. A scrollable row is offered instead |
| feat-icons-1 | An icon set shipped with the package | Later | a round of its own: a licence, a size budget, and the question of whether each of the themes may redraw them |
