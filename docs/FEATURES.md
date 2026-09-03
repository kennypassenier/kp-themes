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
| TH17 | Staleness check for the vendoring consumers | no consumer is behind today; Almanac already has its own |
| TH25 | The picker optionally sets Bootstrap's own dark switch | our components are scheduled to remove the need |
| TH30 | Check whether a consumer conforms to the themes | needs a numbered component set to compare against, so after v1 |

## Don't do

| ID | Feature | Kenny's reason |
| --- | --- | --- |
| TH24 | Backward compatibility for JobTracker's five imports | v1 is a break; JobTracker adapts. It hears about it at the tag (TH29), with the five names and their replacements. |

## Decisions that are not ratings

| ID | Decision |
| --- | --- |
| M1 | Distribution stays a git tag plus a checksum. At the first tag, check whether Dependabot actually opens a bump PR in JobTracker — never yet observed. |
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
