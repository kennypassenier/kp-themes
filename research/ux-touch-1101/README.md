# research/ux-touch-1101: the board on a phone, the secret field, touch targets and the documentation on a phone

Kenny's answers of 2026-11-01 to the review of the apps (`~/Projects/ux-review/kp-themes.md`, `kp-themes-components.md`), built.
One review page, formal only, one section per visible change:

| Section         | Answer                                  | Change                                                                                                   | Controls                       |
| --------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `board-phone`   | board-phone: one column with a switcher | under 40rem one lane under a switcher of every lane with its exact count; Move to in the card's menus | width                          |
| `secret-reveal` | secret-reveal: fixed height             | the countdown inside the value's box; the field keeps one height (before above, new under it)          | one line / wrap, width         |
| `touch-targets` | touch-targets, dialog-close             | an invisible 44 px hit area per small part under a coarse pointer (or `data-kp-touch`)                  | Mouse / Touch, hit areas, width |
| `docs-nav`      | docs-phone-nav: fold                    | the documentation's navigation folds behind a menu button under 40rem                                   | Closed / Open                  |

A touch screen's behaviour is shown with a switch, because a mouse cannot be a finger: the Touch switch puts the package's
`data-kp-touch` on the stage, and the line under it counts the targets whose hit area (their box grown by the invisible area, or
their label's) is still under 44 px. The board's cards are the Habits app's task rows (`research/habits-1101` shapes); titles,
names and values are mock.

## Measured (Firefox, 2026-11-01)

- Touch targets on the 161 `site/components` pages at 390 px with `ui.primaryPointerCapabilities=1` (probe: the centre and 21 px
  up, down, left and right must land on the target or its label; uptime cells up and down only): under 44 px went from 28635 to
  1516 (26730 of the 28635 were documentation links drawn before the page); on the component pages alone from 1905 to 1516.
  Segmented 232 → 107 (scrolling tracks clip), check box and radio 102 → 46 (neighbours' areas overlap, a bare table tick has no
  label), switch 25 → 9, quantity 17 → 0, inputs and selects 123 → 2, time toggle 9 → 0, search trigger 3 → 0, table edit 58 → 9.
  A fine pointer draws every page pixel-identical.
- Secret field: the row under a revealed field moves 0 px at 1280 and 390 (it moved 58.5 px for a wrapping field at 390 before).
- Documentation at 390: the page's title starts 89 px from the top (the content started about 5194 px down before).

**Generated** by `node research/ux-touch-1101/build.mjs` from `sections.mjs` and `markup.mjs` (edit those, never the page);
`demo.js`, `demo-touch.js` and `data.js` fill and wire it.
