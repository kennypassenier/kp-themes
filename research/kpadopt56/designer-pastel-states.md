# Designer notes, round 2: every state of every section (pastel, forest, blueprint; t56-b)

Measured in Firefox with `research/kpadopt56/measure-states.mjs` (new: presses every state button of every section of the eleven pages and prints the height of the driven component per state against Ready), at 1280 and 390 px, formal as the reference. Every state was also looked at in a contact sheet (all states of one section, three themes side by side). Only `css/<theme>-register.css` changed (plus the generated `dist/`, `docs/MINIFIED.md`, `catalogue/code-version.json`).

## What is level now (state height = loaded height, both widths)

Next times (runs, 166 px in all four states), sentence, usual, intent (formal -17 too), dated (426/410/412), slider, rating, deplist, master-detail, console, notices, today (735/716/690), calendar tones, quote (176; 215.5 at 390), focus, chart, trace, availability, qr, passkeys, thread, entity cards, version badge (23.2).

## Changed (commit per fix; the first commit holds three fixes of one kind)

| section | theme | before | after |
|---|---|---|---|
| every empty plate | forest | seedling and trig point stood at the plate's top while the clearing sat in the middle (calendar, focus, uses, trace, gallery, availability, today ...) | one picture on the `::before`, centred together |
| every `.kp-stateplate` action (Retry, Add ...) | forest, blueprint | text at heading size (23.7 px) in a 36 px button | 16 px |
| claim-row (checklist) empty/failed | all | plain dashed box, Retry a 338 px strip | empty plate / destructive plate, Retry normal in the middle |
| quote empty | pastel / forest / blueprint | 202 / 196 / 190 px against 176 (+10 pastel at 390) | 176 (215.5 at 390) |
| rating failed | pastel | 158 px against 80 (142 against 92 at 390) | 80 / 92 |
| version badge loading | pastel | 29.6 px against 23.2 | 23.5 |
| gallery loading | all | tiles collapsed, 70 px of 456 drawn; pastel 147 px pom-poms | square tiles fill the footprint (471 at 1280; 628 against 788 at 390, as formal's rows cannot be known) |
| titles of empty/failed plates | blueprint | 13.6 px mono capitals (runs failed, dated empty, passkeys, thread) | 18 px |
| today, quote, request inspector: failed card | all | left-aligned strip, small bold title (dark on red in pastel and forest), plate as high as its words | plate fills the stage, title heading size in the alert's own ink, Retry under it; request inspector Try again 28 px / 13 px -> 36 px / normal |
| next times empty | pastel, forest, blueprint | regression of my own first commit (169 to 198 px) | 166 again (selector wrapped in `:where()`, blueprint gets the compact plate) |

Loading animates in the theme's own way in every section (Firefox, motion on, running infinite animations inside each section in Loading): pastel the caterpillar and its curl (twice printed, stuck on), forest `kp-progressbar-forest-breath` (the planted row) and `kp-skeleton-forest-treeline`, blueprint `kp-sig-blueprint-blueprint-compass` / `-place` / `-frame`. One miss: pastel `schedule/sentence-states` has 0 running animations (the sentence field waits as a still skeleton; formal draws a still skeleton there as well).

## Re-checks

- `measure-plate.mjs pastel forest blueprint`: forest and blueprint clear; pastel 7 findings (every menu, popover, hovercard inside a popover bare) exactly as at the merge base `b63c6d42`, the approved known case in the script's header.
- Forest 664303ee (busy panel foot padding), every Loading state of the 11 pages: 42 busy panels at 1280, 41 at 390, words to planting row 6 px in all, every panel inside its component, 0 faults.

## Shared (same in formal, or in css/components.css / js; not touched)

1. `.kp-stateplate` sets the heading size on the plate and `.kp-stateplate__action` inherits it (Retry 23.7 px in formal; 19288 to 19325 of components.css). Fixed per register in forest and blueprint (pastel's button has its own size).
2. `.kp-card__state` does not stretch (`align-content: center`), `.kp-card__failure` is a flex strip and `.kp-card__retry` is the small button (components.css 935 to 1000); formal draws the strip in today, quote, request inspector.
3. Gallery waiting tile: `.kp-gallery__tile.kp-skeleton { block-size: auto }` collapses (no image, aspect ratio lost); formal draws 70 px of 456.
4. `.kp-checklist__empty` is a plain dashed box and its Retry stretches (components.css 15555, 25439).
5. uses-states: Empty and Failed are 288 px against 476 (1280) and 702 (390), Loading -12 / -238, in formal as well (`.kp-uses__state`, 25172).
6. claim-row, payload-cell, request-inspector: Empty/Failed are shorter than Ready (formal -149, -113, -789): the loaded height depends on the data, the stage keeps only its minimum. payload-cell is one cell of a table, not a data area.
7. time-field Loading +25 px (skeleton placed under the help line), autosize error +50 (the message is added under the field), quote Loading +2, version loading -5 (formal): by design or by the same cause.
8. Command palette / usual combobox Failed keeps the list and puts the alert under it (-17 px, formal too).
9. rating failed plate is only as wide as the stars (formal too); chart-annotations Failed is a small centred line (the chart has its own approved plate, `OWN` in check-busy-card); ops-page failed is a band strip.
10. `runs-states` at 390: Ready is two lines per row (202 px) against the 166 px states (formal too).
11. `choose/dated` and `choose/shortcut-engine` at 390, see designer-pastel.md.
12. `npm run gates` blocks at `check:rereview` / unit tests on the unchanged base (16 to 12 themes); the commit hook prints "gates green".
