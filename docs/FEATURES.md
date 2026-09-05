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
| TH69 | Theme `nishiki` — ukiyo-e, light | Essential | washi, Prussian blue, beni red, 2px black key-block outline as `--border-strong` |
| TH70 | Theme `phantom` — playful dark, Persona 5 | Essential | black, white, one red (plate with white ink), halftone, condensed italic display |
| TH71 | Theme `retro` — Windows 95 chrome, light, tamed | Desired | gated boundary under the bevel, pixel face for headings only, no dotted focus; needs TH87 |
| TH72 | Theme `mono` — greyscale, light | Desired | status plates as a lightness ladder + outline/dash; chart pattern fills; needs TH86 |
| TH73 | Theme `grotesk` — Swiss typographic, light | Desired | white, black, one red, 12-column grid texture, red square before headings |
| TH74 | Theme `tazhib` — Persian illumination, dark | Desired | lapis ground, ivory, gold, girih tile; vermilion is plate-only (3.20) |
| TH75 | Theme `nostromo` — cassette futurism, medium-light | Desired | beige plastic, orange LED plates (never text), vent-slot texture |
| TH76 | Theme neumorphism | Later | fights DI1 by definition; a tamed version is `light` with shadows |
| TH77 | Theme glassmorphism | Later | needs a glass register (blur on card/popover only) and a non-indigo ground |
| TH78 | Theme pea soup (Game Boy) | Later | four shades; depends on TH86's pattern fills |
| TH79 | Theme atomic (mid-century) | Later | cream, teal, mustard, coral; next round |
| TH80 | Theme vaporwave / synthwave | Don't do | synthwave scores 3 against cyberpunk, vaporwave 2 against pastel |
| TH81 | Theme botanical / earth | Don't do | scores 3 against topo; sage fails DI1 as a boundary (2.23) |
| TH82 | Theme steampunk | Don't do | scores 3 against solstice, 2–3 against sepia |
| TH83 | Theme cosmic / space | Don't do | scores 3 against dark, which already carries the starfield |
| TH84 | Theme reader (e-paper) | Don't do | duplicates TH72 |
| TH85 | `--fx-shadow-offset` knob — a hard offset shadow on card, button and input | Essential | 0px in every existing theme; the first theme knob added since L3, so a minor version. Test bar: the knob paints in brutalism and nothing changes in the eleven (pixel comparison on the fixture) |
| TH86 | Pattern fills for status plates and chart colours | Desired | `--chart-pattern-1..5` and outline/dash badge variants, as tokens per DI9. Test bar: the seven badges of `mono` are pairwise distinguishable with hue removed |
| TH87 | Retro register stylesheet — raised/sunken bevel on button, input and card, title bar behind h1 | Desired | decoration around a gated `--border-strong`, never instead of it. Test bar: DI1 still passes on every control with the register loaded |

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
