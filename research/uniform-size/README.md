# Uniform size across themes (scope-79)

**Decided (scope-79):** archived; the decision and what was built from it are in `docs/SCOPE.md`.

**Question** (Kenny): not one control's height, but can every element keep nearly the same size and layout when the theme changes?
Compare the largest theme, the smallest, and a median one.

**How it was measured.** `node research/uniform-size/measure.mjs` (firefox, 1400 px viewport, reduced motion) loads
`frame.html` — a 400 px column of package components: a form card (title, badge, 3 fields, checkbox, switch, a small and a
default button), a nav bar over a side navigation ("shell"), tabs with an alert, a table with pagination, an open dialog — in all 22
themes, reads every element's box, padding, border, margin, gap, font size, line height, letter spacing and face, and measures the main
column of `examples/settings.html`. It repeats that per option stylesheet, plus today in compact density. Output: `measurements.json`.
`node research/uniform-size/analyze.mjs --detail` prints the tables below and writes `summary.json`; `tables.mjs` puts them into the
demo. Screenshots of the demo were checked at 1400 px in firefox and chromium.

## Ranking today

**Size index** = geometric mean over 19 elements of `height(theme, element) / median over 22 themes of height(element)`.
(A median of those ratios tied 14 themes at 1.00, so it could not name a smallest.)

| Largest                                              | Median                          | Smallest                                        |
| ---------------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| **brutalism 1.245** (synthwave 1.220, phantom 1.131) | **titanium 1.008** (11th of 22) | **blueprint 0.947** (light 0.949, forest 0.968) |

Spread per element, today (max ÷ min across 22): button 36–48 px (1.33), small button 28–48 (1.71, brutalism), field/select/combobox
36–47.8 (1.33, brutalism), tab 29.6–43 (1.45), alert 47–78 (1.66, nostromo), table row 38.1–44.3 (1.16), side-nav item 27.6–41.4 (1.50),
field label 14–22 (1.57), card title 17–31.9 (1.88, phantom), dialog title 19.3–55.2 (2.86, nostromo). The switch is 24 px everywhere.
Composites: form card 390.1–459.3 (1.18), whole column 1131.5–1379.2 (1.22), settings page column 527–612.8 (1.16).
**Compact density does not narrow it** (form 1.18, column 1.23): pinned heights are written as offsets and follow the density down.

## Top 3 causes

1. **Registers pin control box metrics past the scale.** The size tokens are identical in all 22 `themes/*/tokens.json`
   (`kp-space-xs`…`2xl`, `kp-text-xs/sm/md`: one distinct value each, printed by `analyze.mjs`), so the tokens are not the cause —
   the registers bypass them: `min-block-size: calc(3rem + …)` in `css/brutalism-register.css:399`, `css/synthwave-register.css:560`,
   `css/phantom-register.css:494` (48 px); `2.9rem` in `css/terminal-register.css:486`, `css/deco-register.css:359` (46.4 px); field
   padding `calc(var(--kp-space-sm) * 1.3/1.4)` with 2–3 px borders in `css/brutalism-register.css:463-472` and
   `css/synthwave-register.css:701-706` (47.8 / 47.4 px).
2. **`line-height: normal` everywhere.** The base sets no line height (`css/_rules.css:280` gives `body` only a face), so fields, tabs,
   alerts, rows and labels take each face's own ascent and descent: the same two-line alert is 60 px in dark (Archivo) and 78 px in
   nostromo (Titillium Web), 76 in lapis (Vazirmatn); field labels 14–22 px.
3. **Text width makes lines wrap.** Display faces in capitals with letter spacing, at register-chosen sizes: nostromo's dialog title
   (Michroma, `css/nostromo-register.css:665`, token `theme-font-display`) and brutalism's (Archivo Black) take two lines where
   blueprint's takes one; phantom's card title is `1.9rem` (`css/phantom-register.css:756`); synthwave's nav links carry
   `letter-spacing: 0.18em` and `1.2rem` bottom padding (`css/synthwave-register.css:429-435`). A fourth, smaller one is layout, not
   size: grotesk stacks the nav links in a column at ≤40rem (`css/grotesk-register.css:257`), 128 px of nav in a 400 px column.

## Options, measured (max ÷ min)

| Option                                                                     | What the package owns / what a register keeps                                                                                                              | form 22  | column 22 | page 22  | form 3   | column 3 |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- | -------- | -------- | -------- |
| **A** today                                                                | —                                                                                                                                                          | 1.18     | 1.22      | 1.16     | 1.15     | 1.20     |
| **B** one box scale (`option-b.css`)                                       | package: all heights (border-box), padding, gaps, margins, font sizes, `line-height`; register: colour, border, radius, shadow, face, case, letter spacing | **1.03** | 1.14      | **1.06** | **1.01** | **1.05** |
| **C** B + `font-size-adjust: ex-height 0.5` (`option-c.css`)               | as B, faces scaled to one x-height                                                                                                                         | 1.12     | 1.14      | 1.07     | 1.02     | 1.02     |
| **D** own sizes clamped ±8% of median (`option-d.css`, from `build-d.mjs`) | register keeps its values inside a band                                                                                                                    | 1.14     | 1.21      | 1.11     | 1.08     | 1.15     |
| **E** line boxes only (`option-e.css`)                                     | package: control/row heights, one `line-height`; register: everything else                                                                                 | 1.07     | **1.12**  | 1.10     | 1.03     | 1.12     |

What remains after B is cause 3: shell 1.45, tabs 1.24, dialog 1.20 across 22 — lines that wrap in one face and not another. Across 22, C
makes the form card worse than B (1.12 against 1.03): most faces already have an x-height of 0.49–0.53 (a one-off 1ex probe at 100 px
in firefox, not kept), and deco's KP Deco Sans (0.38) grows by a third and wraps — its checkbox row goes from 25.6 to 67.4 px. Its better
three-column figure (1.02) comes from those three faces sitting near 0.5. D leaves causes 2 and 3 untouched and needs every
register to express its sizes as tokens first.

| Option | Reference                                                           | What the package can reuse                                                                         | Build cost        | Recommendation   |
| ------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------- | ---------------- |
| A      | —                                                                   | —                                                                                                  | none              | control only     |
| B      | <https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing>       | the defaults already in `css/components.css`, `--kp-control-height`, `--kp-space-*`, `--kp-text-*` | medium–large      | yes, second step |
| C      | <https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust> | option B                                                                                           | small on top of B | no               |
| D      | <https://developer.mozilla.org/en-US/docs/Web/CSS/clamp>            | nothing yet: registers have no size tokens                                                         | large             | no               |
| E      | <https://developer.mozilla.org/en-US/docs/Web/CSS/line-height>      | `--kp-control-height`, the min-height rules of button, field, combobox                             | small             | yes, first step  |

**What each costs.** B: `css/components.css` gains a body line height and border-box heights; the registers' 1,217 declarations of
`font-size`/`padding`/`margin`/`gap`/`height`/`line-height` (grep over `css/*-register.css`) must be sorted into ornament (stays) and
box metric (goes), in 22 released themes — a version raise — and a gate in `gates/` that refuses a box-metric property on a
component selector in a register. Themes lose: brutalism, synthwave and phantom their 48 px plates, brutalism its 24 px and phantom its 30.4 px card title; terminal
and deco their 46 px buttons; nostromo the `1.7rem` lamp gutter on every button (`css/nostromo-register.css:1272`); terminal's 28 px nav
rows grow to 36. E: `option-e.css` is 2,029 bytes (`wc -c`), about that much in `css/components.css`; registers keep their type sizes, caps and paddings; the 48 px plates still
go, and dialogs and nav bars keep differing (dialog 1.42).

## Implemented (E, 2026-09-14)

Kenny chose E first and B later (`scope-80`). What landed, and where it differs from `option-e.css`:

- **Package-owned box.** `css/components.css`: `.kp-button` (all sizes and variants), `.kp-field__input` (text, select, date field,
  inline editor; not `--multiline`) and `.kp-combobox__input` (also the tag input) are border-box with `min-height:
var(--kp-control-height, 2.25rem)` (small and large keep `--kp-button-height-sm` / `-lg`) and `line-height:
var(--kp-control-line-height, 1.25)`. `.kp-table th, td` take `block-size: var(--kp-row-height, calc(var(--kp-control-height) +
0.25rem))` — 40 px, 32 px compact — and the same line height; a cell in card mode sizes to its value. `css/_rules.css` gives `body`
  `line-height: var(--kp-line-height, 1.5)`.
- **Block padding, not zero.** Fields keep none. Buttons take `max(0px, min(var(--kp-space-xs), (floor − 1lh) / 2 − 3px))`
  (`--kp-control-padding-block`) and cells `var(--kp-space-xs)`: never enough to lift a one-line box past its floor, but a two-line
  label no longer touches its frame, which it did with E's zero in brutalism, titanium and phantom (`catalogue/button.html#extremes`).
- **Registers.** The 48 and 46.4 px pins, phantom's and synthwave's sm/lg pins, the hero-row pins of dark, retro, terminal and titanium,
  and every block padding on those boxes (brutalism, deco, pastel, phantom, synthwave) are gone; each keeps its `padding-inline`, type,
  border and paint. Retro's pressed label moves a pixel of block padding from bottom to top. Tabs, badges, nav and side-nav links,
  labels and titles were not taken (nav and side nav had other work in flight; labels and titles are B).
- **Guard.** `gates/box-metrics.test.mjs` (in `npm test`) refuses a register rule whose subject is one of those boxes and that sets a
  height, block size, line height or block padding, and a register that restates one of the tokens; 26 findings on the registers of
  `2738d1c`.

Measured with `node research/uniform-size/measure.mjs --options a --out measurements-implemented.json` and
`node research/uniform-size/analyze.mjs --in measurements-implemented.json --detail` (firefox, the package as built, no option sheet):

| max ÷ min            | form 22  | table 22 | column 22 | page 22  | tabs 22 | shell 22 | form 3 | column 3 | page 3 |
| -------------------- | -------- | -------- | --------- | -------- | ------- | -------- | ------ | -------- | ------ |
| A, before            | 1.18     | 1.17     | 1.22      | 1.16     | 1.36    | 1.69     | 1.15   | 1.20     | 1.16   |
| E, predicted         | 1.07     | 1.06     | 1.12      | 1.10     | 1.24    | 1.63     | 1.03   | 1.12     | 1.08   |
| **E, implemented**   | **1.08** | **1.06** | 1.15      | **1.09** | 1.32    | 1.64     | 1.02   | 1.13     | 1.05   |
| implemented, compact | 1.09     | 1.07     | 1.16      | 1.10     | 1.32    | 1.64     | —      | —        | —      |

The "3" columns are the research's three: brutalism, titanium, blueprint. Buttons, small buttons, fields, selects, comboboxes, table
headers and rows are one height in all 22: 36, 28, 36, 36, 36, 40, 40 px (compact 28, 28, 28, 28, 28, 32, 32; brutalism's field,
with its 3 px border, 30). The column misses the prediction by the tabs, nav and side nav that were not taken; the form card by a
hundredth, its title and labels.

## B implemented (2026-09-15)

Kenny started option B's round on top of E (`scope-87`). What landed, and where it differs from `option-b.css`:

- **Package-owned type and block sizes, at titanium's values** (the median theme, `scope-82`), as `var(--token, default)` knobs.
  `css/_rules.css`: `h1`–`h6` `--kp-h1-size`…`--kp-h6-size` (2, 1.5, 1.17, 1, 0.83, 0.67em, the browser's steps) at
  `--kp-heading-line-height` 1.1; `[data-kp-surface] h1` `--kp-text-display` at `--kp-display-line-height` 1.08.
  `css/components.css`: `--kp-card-title-size` 1.5rem and `--kp-dialog-title-size` 1.25rem (heading line height),
  `--kp-footer-heading-size` 0.9375rem; `--kp-field-label-size` 0.9rem and `--kp-field-help-size` 0.8rem; `--kp-badge-size`
  (`--kp-text-sm`), `--kp-badge-line-height` 1.4, `--kp-badge-padding-block` 0.125rem; `--kp-tab-size` (`--kp-text-md`),
  `--kp-tab-padding-block` (`--kp-space-sm`); `--kp-nav-link-size` 0.9375rem with `--kp-nav-link-padding-block` (`--kp-space-sm`),
  shared by `.kp-nav__disclosure` and the search trigger, whose border-box floor is one line plus both paddings;
  `--kp-nav-menu-link-size` 0.875rem with `--kp-nav-menu-link-padding-block` (0.9 × `--kp-space-sm`); `--kp-sidenav-link-size`
  0.875rem with `--kp-sidenav-link-padding-block` (`--kp-space-sm`); `--kp-breadcrumb-size` and `--kp-pagination-size` 0.9rem.
  Everything else reads `--kp-line-height`. Titanium's 0.94rem link, 0.92rem menu link, 1.2rem dialog title and 0.95rem footer
  heading were taken to whole pixels: at 15.04px a bar's height fell between two layout units and the scroll offset written from
  it no longer matched (`tests/nav-sticky.spec.mjs`). B's mock used 1rem titles, 36px tabs and links; this keeps titanium's.
- **Registers.** The guard's 322 findings on the registers of `4783e3f` (265 declarations in all 22) are gone or
  became `padding-inline` / `padding-left` + `padding-right`; eleven rules left empty were removed, and nine badge rules shared with
  `.kp-tag` (and cyberpunk's `.kp-health`, high-contrast's `.kp-field__required`) now give the uncovered part its size in a rule of
  its own. Cyberpunk's hover copy on a bar link reads `--kp-nav-link-padding-block` for its inset. Six declarations stay, each named
  with its reason in `MAY_KEEP`: retro's h1 and dialog title bars, retro's surface headline that undoes the bar, deco's cartouche,
  terminal's two-line floor for the typed headline, cyberpunk's bracket room above a surface h2.
- **Guard.** `gates/box-metrics.test.mjs` adds `COVERED_TYPE`: font, font size, line height, block padding and heights on those
  roots, type only on `.kp-nav__links`, `.kp-breadcrumb` and `.kp-pagination`; and the tokens above. 322 findings on `4783e3f`, 0 now.

Measured with `node research/uniform-size/measure.mjs --options a --out measurements-b-implemented.json` and
`node research/uniform-size/analyze.mjs --in measurements-b-implemented.json --detail` (firefox, the package as built). The "3"
columns are the research's three, brutalism, titanium and blueprint:

| max ÷ min            | form 22  | table 22 | column 22 | page 22  | tabs 22 | shell 22 | dialog 22 | form 3 | column 3 | page 3 |
| -------------------- | -------- | -------- | --------- | -------- | ------- | -------- | --------- | ------ | -------- | ------ |
| E, implemented       | 1.08     | 1.06     | 1.15      | 1.09     | 1.32    | 1.64     | 1.39      | 1.02   | 1.13     | 1.05   |
| B, predicted         | 1.03     | 1.03     | 1.14      | 1.06     | 1.24    | 1.45     | 1.20      | 1.01   | 1.05     | 1.03   |
| **B, implemented**   | **1.02** | **1.03** | **1.13**  | **1.06** | 1.26    | 1.63     | 1.23      | 1.01   | 1.09     | 1.03   |
| implemented, compact | 1.03     | 1.04     | 1.14      | 1.06     | 1.28    | 1.65     | 1.24      | 1.03   | 1.10     | 1.04   |

Card title and field label are one height in all 22 (26.4 and 21.6px); nav links 38.5–44.5 (brutalism's 3px border), side-nav
rows 37–41, tabs 41–46, badges 22.2–26.2. What is left is cause 3 and cause 4: grotesk's bar stacks its links at ≤40rem, now three
38.5px rows (nav 183.5px, shell 347.5 against nostromo's 213.5), and dialog titles that wrap in wide capitals (retro 28px). The column
misses B's three-theme prediction for the same reason: the mock gave links 36px and no stacking cost.

## Recommendation

Take **E now and B's type scale second**. E is small, lives in the base layer, and removes causes 1 and 2 for what users touch most:
form card 1.18 → 1.07, table 1.17 → 1.06, tabs 1.36 → 1.24 across 22. Then move the heading, label and nav sizes onto
package tokens registers may not restate (B), guarded by the gate — that is what brings the three columns to 1.05. Do not take C or D.
Accept that cause 3 remains: nearly-equal is reachable (±5% across the three), identical is not while themes keep their faces.
Kenny decides; nothing in `css/` was changed.
