# Release suite for 10.1.0 (2026-10-15 03:07-03:24)

`npm run test:release -- --go`, Firefox: 1638 passed, 60 failed, 4 skipped in 17.7 min (Playwright's own figure). Kenny's go: form release-go "Nu uitbrengen" (03:06).

| #   | test                                       | title                                                                                                                                                  |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | tests/alarm.spec.mjs:464:1                 | the glitch and the flicker run only in cyberpunk, in all 16 themes [scope-98]                                                                          |
| 2   | tests/alarm.spec.mjs:547:5                 | flash rate in pastel: at most 2 per second, measured from rendered frames [WCAG 2.3.1]                                                                 |
| 3   | tests/app-shell.spec.mjs:200:5             | the application shell › an open dropdown in the bar stays above a popover-layer element that follows the bar, in every theme [finding 3]               |
| 4   | tests/auto-lazy.spec.mjs:212:5             | site/components/calendar.html ends up the same as with every module attached [scope-115]                                                               |
| 5   | tests/button-notes.spec.mjs:188:5          | phantom: the primary is pressed like the others [scope-80] › pressing any variant moves it from where hovering put it                                  |
| 6   | tests/batch3-faults.spec.mjs:68:1          | a nav dropdown declared open with data-kp-nav-menu-open is painted open in every theme, and closes when the declaration goes [gap-12]                  |
| 7   | tests/combobox.spec.mjs:147:5              | inside a card that clips its corners the open list is whole, takes its clicks and stays against the input, in every theme — React [2026-09-13]         |
| 8   | tests/choice-centre.spec.mjs:198:5         | the words beside the data table's checkboxes sit on the box's centre and stay put when ticked, in every theme, devicePixelRatio 1 [scope-92]           |
| 9   | tests/dark-themes-notes.spec.mjs:338:13    | every theme: a tooltip on the overlays page sits under its trigger [Kenny's phantom note, 2026-09-15] › all four tooltips of #tooltip open under their |
| 10  | tests/datatable-add-filter.spec.mjs:217:9  | datatable add-filter mode — framework-free › dates come from two package date pickers, whose calendar opens above everything; remove drops a pill; Cle |
| 11  | tests/datatable-add-filter.spec.mjs:274:9  | datatable add-filter mode — framework-free › the whole flow works from the keyboard: the menu moves with the arrows, Escape leaves the editor and the  |
| 12  | tests/datatable-add-filter.spec.mjs:217:9  | datatable add-filter mode — React › dates come from two package date pickers, whose calendar opens above everything; remove drops a pill; Clear all sh |
| 13  | tests/datatable-add-filter.spec.mjs:274:9  | datatable add-filter mode — React › the whole flow works from the keyboard: the menu moves with the arrows, Escape leaves the editor and the menu      |
| 14  | tests/control-font.spec.mjs:68:1           | no control on a review page takes the browser default font [fix-28]                                                                                    |
| 15  | tests/datatable.spec.mjs:484:9             | datatable review notes — framework-free › a calendar opened inside a card or an alert that clips its corners is whole and takes its clicks, in every t |
| 16  | tests/datatable.spec.mjs:660:9             | datatable sticky header reach [fix-32, scope-90] › the sticky header's ground reaches 2px above it and the box clips its top edge only while scrolled, |
| 17  | tests/datatable.spec.mjs:660:9             | datatable sticky header reach [fix-32, scope-90] › the sticky header's ground reaches 2px above it and the box clips its top edge only while scrolled, |
| 18  | tests/datepicker-jump.spec.mjs:107:9       | date picker month and year grids — framework-free › the year title opens twelve years; a year and then a month land on that month’s days [scope-89]    |
| 19  | tests/datepicker-jump.spec.mjs:107:9       | date picker month and year grids — React › the year title opens twelve years; a year and then a month land on that month’s days [scope-89]             |
| 20  | tests/datepicker-jump.spec.mjs:279:1       | the panel keeps its size across the three views, in every theme [scope-89]                                                                             |
| 21  | tests/effects-arrival-order.spec.mjs:72:13 | the headline reveal after the arrival, framework-free › phantom: the headline reveal starts once the arrival overlay is removed [scope-86]             |
| 22  | tests/effects-arrival-order.spec.mjs:72:13 | the headline reveal after the arrival, React › phantom: the headline reveal starts once the arrival overlay is removed [scope-86]                      |
| 23  | tests/fixtures.spec.mjs:44:9               | pastel fixture › reflows at 320 px without sideways scrolling [DI11]                                                                                   |
| 24  | tests/kpi-columns.spec.mjs:102:1           | at 1280 px, every D7 row as the spec says, and the phone pane (D7) [scope-143]                                                                         |
| 25  | tests/kpi-columns.spec.mjs:126:1           | at 390 px, every D7 row keeps the rules, with no sideways scroll (D7) [scope-143]                                                                      |
| 26  | tests/log.spec.mjs:39:1                    | the four columns of a log do not move, in every theme [gap-14, fix-64]                                                                                 |
| 27  | tests/menu-button.spec.mjs:29:1            | the keys of a menu, end to end: open, move, a disabled entry that says why, Esc, Tab and a pick (B7 1-4, 6, 7) [scope-143]                             |
| 28  | tests/menu-button.spec.mjs:101:1           | every state keeps a real row’s height inside the screen: a refill waits, loading, empty, twenty-four, a phone (B7 5, 8, 9; B6) [scope-143]             |
| 29  | tests/menu-in-window.spec.mjs:142:9        | a closed over-the-page side navigation is out of sight › cyberpunk: closed, the panel is off screen, and opening still brings it in [fix-40]           |
| 30  | tests/menu-in-window.spec.mjs:142:9        | a closed over-the-page side navigation is out of sight › synthwave: closed, the panel is off screen, and opening still brings it in [fix-40]           |
| 31  | tests/menu-in-window.spec.mjs:142:9        | a closed over-the-page side navigation is out of sight › terminal: closed, the panel is off screen, and opening still brings it in [fix-40]            |
| 32  | tests/menu-in-window.spec.mjs:142:9        | a closed over-the-page side navigation is out of sight › solstice: closed, the panel is off screen, and opening still brings it in [fix-40]            |
| 33  | tests/meter.spec.mjs:20:1                  | the fill, the tick, past the end and the tone, through setMeter() (C7.1–C7.3) [scope-143]                                                              |
| 34  | tests/nav-menu.spec.mjs:93:1               | the dropdown under a bar’s last item, and the mega menu’s panel, stay inside the window in every theme, both channels [fix-27]                         |
| 35  | tests/redaction-cover.spec.mjs:331:5       | every redaction covers its phrase at three widths and after a resize under synthwave [fix-33]                                                          |
| 36  | tests/picker.spec.mjs:99:9                 | picker · react › derives which themes are dark from the data, not from a list                                                                          |
| 37  | tests/register-dark.spec.mjs:109:9         | the dark register, framework-free › the headline resolves word by word out of a blur and ends as its own text [DK2]                                    |
| 38  | tests/register-dark.spec.mjs:109:9         | the dark register, React › the headline resolves word by word out of a blur and ends as its own text [DK2]                                             |
| 39  | tests/register-formal.spec.mjs:78:9        | the formal register, framework-free › the headline fades and rises once, untouched — no glitch, no glyph                                               |
| 40  | tests/register-formal.spec.mjs:78:9        | the formal register, React › the headline fades and rises once, untouched — no glitch, no glyph                                                        |
| 41  | tests/register-light.spec.mjs:175:9        | the light register, framework-free › the rule draws itself under a heading when it enters the viewport, reusing the base layer’s kp-rule-in [TH122]    |
| 42  | tests/register-light.spec.mjs:108:9        | the light register, framework-free › the headline opens through a rounded clip window once, and ends as its own whole text [S48]                       |
| 43  | tests/register-light.spec.mjs:175:9        | the light register, React › the rule draws itself under a heading when it enters the viewport, reusing the base layer’s kp-rule-in [TH122]             |
| 44  | tests/register-light.spec.mjs:108:9        | the light register, React › the headline opens through a rounded clip window once, and ends as its own whole text [S48]                                |
| 45  | tests/register-pastel.spec.mjs:156:9       | the pastel register, framework-free › the lede’s marks fill in, mint then violet [TH120]                                                               |
| 46  | tests/register-pastel.spec.mjs:156:9       | the pastel register, React › the lede’s marks fill in, mint then violet [TH120]                                                                        |
| 47  | tests/register-phantom.spec.mjs:193:9      | the phantom register, framework-free › the dossier stamp is a rotated red plate, and the censor plates shear off on the trigger                        |
| 48  | tests/register-phantom.spec.mjs:193:9      | the phantom register, React › the dossier stamp is a rotated red plate, and the censor plates shear off on the trigger                                 |
| 49  | tests/register-phantom.spec.mjs:95:9       | the phantom register, framework-free › the headline shouts in word by word and ends as its own text [PH2]                                              |
| 50  | tests/register-phantom.spec.mjs:95:9       | the phantom register, React › the headline shouts in word by word and ends as its own text [PH2]                                                       |
| 51  | tests/select.spec.mjs:239:1                | every register answers the drawn list the way it answers the combobox list, and the list opens under its select [scope-54]                             |
| 52  | tests/select.spec.mjs:292:5                | inside a card that clips its corners the drawn list is whole, takes its clicks and opens under its select, in every theme — framework-free [2026-09-13 |
| 53  | tests/select.spec.mjs:292:5                | inside a card that clips its corners the drawn list is whole, takes its clicks and opens under its select, in every theme — React [2026-09-13]         |
| 54  | tests/showcase.spec.mjs:46:5               | the left picker changes the left half and nothing else [TH88]                                                                                          |
| 55  | tests/showcase.spec.mjs:129:1              | the picker remembers each half across a reload [TH88]                                                                                                  |
| 56  | tests/switch.spec.mjs:110:9                | switch — framework-free › focus on a switch is visible, in every theme, framework-free [gap-11]                                                        |
| 57  | tests/switch.spec.mjs:110:9                | switch — React › focus on a switch is visible, in every theme, React [gap-11]                                                                          |
| 58  | tests/theme-menu-nowrap.spec.mjs:17:9      | the theme menu keeps every row on one line [theme-menu-nowrap] › in every theme, no row of the open menu wraps at 390px                                |
| 59  | tests/theme-menu-nowrap.spec.mjs:17:9      | the theme menu keeps every row on one line [theme-menu-nowrap] › in every theme, no row of the open menu wraps at 1280px                               |
| 60  | tests/tour.spec.mjs:102:1                  | on a phone: the card 16 px from both edges, the drawer at the end edge at full height, Help gets the focus back, the tab bar toured (I.3.7 5) [scope-1 |
