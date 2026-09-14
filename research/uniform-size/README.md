# Uniform size across themes (scope-79)

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

## Recommendation

Take **E now and B's type scale second**. E is small, lives in the base layer, and removes causes 1 and 2 for what users touch most:
form card 1.18 → 1.07, table 1.17 → 1.06, tabs 1.36 → 1.24 across 22. Then move the heading, label and nav sizes onto
package tokens registers may not restate (B), guarded by the gate — that is what brings the three columns to 1.05. Do not take C or D.
Accept that cause 3 remains: nearly-equal is reachable (±5% across the three), identical is not while themes keep their faces.
Kenny decides; nothing in `css/` was changed.
