# Causes of the 60 failures of the 10.1.0 release suite

Read-only analysis of `~/.suite.log` and `research/SUITE_10_1_0_RUN.md` against the commits since 2026-10-14 20:00. No test code was run (fix-118): each cause comes from the error text, the test code at its line, the commit diffs and the 10.0.0 triage (`research/SUITE_10_0_0_TRIAGE.md`). Where a cause is a deduction and not a measurement it says "suspected". The row numbers are those of `SUITE_10_1_0_RUN.md`.

Classes: (A) a hard contrast check still failing, becomes a report; (B) a test outdated against a look or behaviour Kenny approved tonight or earlier, update the test; (C) a real package bug, fix the package; (D) timeout, flake or harness artefact.

## Summary

| Class | Failures | Groups                                                                                                                  |
| ----- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| A     | 0        | none: every contrast floor already became a report in 236d7d1f; no failure block in the log names a contrast or a ratio |
| B     | 34       | 1, 2, 3, 4, 5, 6, 7, 8                                                                                                  |
| C     | 21       | 9, 10, 11, 12, 13, 14, 15, 16, 17                                                                                       |
| D     | 5        | 18                                                                                                                      |
| Total | 60       |                                                                                                                         |

Most failures are not from tonight. 17 of the 34 class-B rows are headline-reveal and phantom-look tests that went stale when the dark, phantom, formal, light and pastel grammars were applied on 2026-10-08 to 10-14; the 10.0.0 suite ran before those commits.

## Class B: the test is outdated, update the test

### 1. Phantom's approved grammar: skewed key caps, no word-by-word headline (7 rows, pre-existing)

Cause: phantom's buttons and dossier stamp are skewX(-8deg) key caps (`--kp-skew`), and its headline no longer shouts in word by word and ends as `is-deciphered`; the tests still expect a 1.5 degree rotation (`matrix(0.99`), a button that moves when pressed, and the old reveal. Commit: pre-existing, eec02423 (10-09, "Apply dark and phantom grammars"; the skew itself dates from 8b2cd2ba).

- 5 button-notes.spec.mjs:188 phantom, the primary is pressed like the others (every variant reads `matrix(1, 0, -0.140541, 1, 0, 0)` hovered and pressed)
- 47 register-phantom.spec.mjs:193 dossier stamp is a rotated red plate, framework-free (expects `matrix(0.99`, got the skew)
- 48 the same, React
- 49 register-phantom.spec.mjs:95 headline shouts in word by word, framework-free (`is-deciphered` never lands)
- 50 the same, React
- 21 effects-arrival-order.spec.mjs:72 phantom: the reveal starts once the overlay is gone, framework-free (no `data-kp-reveal-state`)
- 22 the same, React

### 2. Dark, formal, light and pastel headline and mark tests against their applied grammars (10 rows, pre-existing)

Cause: each register's reveal was replaced by its approved grammar. Dark's `kp-resolve` keyframe is gone from the CSS (rows 37, 38); formal now rules its lines in and no longer holds the headline at opacity 0 at load (39, 40); light's rule uses `kp-sig-light-expose` instead of the base `kp-rule-in` and its headline no longer clips (41 to 44); pastel's second lede mark is mint, not violet (45, 46). Commits: eec02423 (dark, 10-09); 6316e673 (formal and light, 10-08, with e785e30a and 3eba5336 on 10-13); 087d9e77 and 218bfee0 (pastel, 10-14). None is from tonight.

- 37, 38 register-dark.spec.mjs:109 headline resolves word by word, framework-free and React
- 39, 40 register-formal.spec.mjs:78 headline fades and rises once, both channels
- 41, 43 register-light.spec.mjs:175 rule draws itself reusing `kp-rule-in`, both channels
- 42, 44 register-light.spec.mjs:108 headline opens through a rounded clip window, both channels
- 45, 46 register-pastel.spec.mjs:156 lede marks fill in, mint then violet, both channels

### 3. A closing copy of a menu or card is still in the page when the test counts it (4 rows)

Cause: a popover or dialog that closes leaves a `data-kp-ghost` copy (inert, `data-kp-closing`) for as long as its close plays. A locator that matches the part by class or data attribute then resolves to two elements and Playwright's strict mode throws. Formal's line-by-line closes (the tour card, the menu) now play longer, which widens the window; the date picker panel also carries `data-kp-date-open` while open, so the trigger selector matches two elements. Commits: ecdd1b69 (rows 11, 13, 60, suspected); ef1da350 (10-12, row 15).

- 11 datatable-add-filter.spec.mjs:274 whole flow from the keyboard, framework-free (`[data-kp-datatable-add-menu]` matches the menu and its ghost)
- 13 the same, React
- 60 tour.spec.mjs:102 on a phone: the card 16 px from both edges (`dialog.kp-tour` matches the old inert card and the new one)
- 15 datatable.spec.mjs:484 calendar inside a card or alert (`[data-kp-date-open]` matches the trigger button and the open panel)

Fix: scope the locators to `:not([data-kp-ghost])`, or wait for the ghost to go; for 15 select `button[data-kp-date-open]`.

### 4. The React theme list now stays mounted and inert while its close plays (3 rows)

Cause: the React theme list is removed only after `playClose()` has played the opening backwards, and it is `inert` meanwhile. The tests click the next option at once and hit `<html>` through the inert list, or do not reopen the list because it still reads as visible. Commit: 73d472c7 ("React theme list close").

- 36 picker.spec.mjs:99 picker, react: derives which themes are dark from the data
- 58 theme-menu-nowrap.spec.mjs:17 no row wraps at 390 px
- 59 theme-menu-nowrap.spec.mjs:17 no row wraps at 1280 px

Fix: after choosing, wait for the list to be gone (or for `[data-kp-closing]` to clear) before the next choose or the `isVisible` check.

### 5. Formal's menu button against formal's grammar (2 rows)

Cause: formal has `text-transform: none` on menu group headings since its grammar was applied, and the test expects small capitals (`Run:uppercase`); the loading entry is 13.4 px off a real row's height in formal, a number the test took from before. Commits: 6316e673 (10-08, row 27); row 28 is suspected 6316e673 or ecdd1b69 (formal's menu rules were rewritten tonight).

- 27 menu-button.spec.mjs:29 the keys of a menu, end to end
- 28 menu-button.spec.mjs:101 every state keeps a real row's height inside the screen

### 6. Key-figure and meter tests (2 rows)

Cause: row 33, formal's meter mark is a ribbon hanging 8 px below the bar (`[2, 8]` against `[3, 3]`); this was already listed as a stale test in the 10.0.0 triage (row 28) and left. Row 25, `:scope > *` of the key-figure strip counts 8 children where the test waits for 7; a0b8a061 changed the catalogue block and the test was repaired in that commit without being run. Commits: pre-existing 6316e673 (row 33); a0b8a061 (row 25, suspected).

- 33 meter.spec.mjs:20 the fill, the tick, past the end and the tone
- 25 kpi-columns.spec.mjs:126 at 390 px, every D7 row keeps the rules

### 7. Register changes in alarm, tooltip, switch focus and a review demo (6 rows, pre-existing)

- 1 alarm.spec.mjs:464 glitch and flicker run only in cyberpunk (pastel's alarm arrives with one animation, test wants more than one)
- 2 alarm.spec.mjs:547 flash rate in pastel (2 animations, test wants more than 2). Cause for 1 and 2: pastel's alarm now opens as its dialog with its approved grammar. Commits: e785e30a (10-13), 3eba5336 (10-13), 218bfee0 (10-14). The tests count animations, a number that follows the grammar.
- 9 dark-themes-notes.spec.mjs:338 tooltips under their trigger's start edge (pastel #2 and #3 start 14 px in, so their start is left of the trigger's middle). Cause: pastel's applied grammar (087d9e77, 218bfee0, 10-14) places the live tooltips differently; the rule "past the middle >= 0" is the test's own.
- 56, 57 switch.spec.mjs:110 focus on a switch is visible (cyberpunk: outline none, shadow none on the input). Cause: cyberpunk draws the focus on the row through `:has(input:focus-visible)` (css/cyberpunk-register.css:3083, 3130), not on the input the test reads. Commit: pre-existing (3eba5336, "focus visible everywhere", 10-13). Change the test to read the painted focus, as tests/helpers/focus-paint.mjs does.
- 14 control-font.spec.mjs:68 no control on a review page takes the browser default font (`button.fa-ref-open` in `research/all-themes-applied/demo.html`, formal and nostromo). Cause: a research demo page, not the package; give the demo's button the font, or leave the page out of the sweep.

### 8. Groups with a single cause that did not fit above: none. (Rows are in groups 1 to 7.)

## Class C: a real package bug, fix the package

Rows here are suspected from the error plus the diff; a measurement in Firefox (with Kenny's go) would confirm each cause before a fix.

### 9. Phantom's hard plate changed the geometry of lists and menus (7 rows)

Cause: the deep red second plate (`clip-path` widened by 4 px, `box-shadow: var(--kp-hard)`, a `position: relative` and an `::after` on `.kp-menu`, `.kp-card`, `.kp-toast`) leaves phantom's lists and menus 3 to 4 px off where every other theme puts them: a select list 4 px wider than its select, a combobox list "0 of 3 reachable, 28 px under the input", a nav dropdown 3 px from its item, a mega menu panel 3.0 px short of the bar's edges. A clip-path and a shadow do not change a box, so a bounding-box change means layout moved. Commit: beec5724 (phantom's plate, 02:32). Decision for Kenny: keep the plate and bring the layout box back to the unplated size (package), or let the tests allow the plate's 4 px (then these rows become B).

- 6 batch3-faults.spec.mjs:68 nav dropdown declared open with data-kp-nav-menu-open (phantom: -3px from its item)
- 7 combobox.spec.mjs:147 open list inside a clipping card, React (phantom: 0 of 3 out of reach, -28px under the input)
- 34 nav-menu.spec.mjs:93 dropdown under a bar's last item and the mega menu panel (phantom, 420 px, both channels: panel misses the bar's edges by 3.0 px)
- 51 select.spec.mjs:239 every register answers the drawn list (phantom: top 4, left 0, width 4)
- 52 select.spec.mjs:292 drawn list inside a clipping card, framework-free (phantom)
- 53 the same, React
- 8 choice-centre.spec.mjs:198 words beside the data table's checkboxes (phantom, 5 labels 1.1 to 2.8 px off centre; only the filter and column menus, the field page passes). Suspected beec5724, possibly a0b8a061.

### 10. Side navigation closed over the page is not off screen (4 rows)

Cause: in cyberpunk, synthwave, terminal and solstice the closed over-the-page panel stays on the screen (240 px, its full width; solstice 248 px into its box) and never leaves within 5 s. These are the themes whose open is a keyframe; the close that plays the opening backwards no longer ends translated out. Not in the 10.0.0 triage, so new since 10-08. Commit: suspected ecdd1b69 (motion.js replays a copy of the entrance effect); alternative 33b04caa (edge tab as default opener, but the fixture has no tab so it keeps its launcher).

- 29 menu-in-window.spec.mjs:142 cyberpunk
- 30 synthwave
- 31 terminal
- 32 solstice

### 11. Calendar grid translate breaks hit-testing and panel width (3 rows)

Cause: the calendar overhang fix moves the grid with `translate` (two gaps) and its rows back one gap (`thead, tbody`); Firefox then no longer reaches day 2026-08-15 at its centre in the add-filter calendar (both channels), and in pastel the months view is 262 px against the days view's 302 px (the panel keeps its size across views). Commit: 73d472c7 (suspected; the commit measured rectangles, not `elementFromPoint`).

- 10 datatable-add-filter.spec.mjs:217 dates from two package date pickers, framework-free
- 12 the same, React
- 20 datepicker-jump.spec.mjs:279 the panel keeps its size across the three views, in every theme (pastel)

### 12. A typed date is not rewritten to dd/mm/yyyy (2 rows)

Cause: the field is set to `13-09-2026`; after choosing a year and a month the test expects the value `13/09/2026` (the rule 52 display), but the field still shows the dashes it was given (the framework-free fixture even shows the Dutch placeholder `dd-mm-jjjj`). The 10.0.0 suite passed this row, so the picker used to rewrite it. Either the init path no longer formats a parsed value, or the test's start value should be slash form. Commit: 03a92724 (dd/mm/yyyy date picker).

- 18 datepicker-jump.spec.mjs:107 the year title opens twelve years, framework-free
- 19 the same, React

### 13. Key-figure row heights differ by one line (1 row)

Cause: at 1280 px with 5 tiles at 700, row 2's tile heights differ by 31 px, where the uncut-label rule says a row stays one height. a0b8a061 rewrote this test without running it; if the test is right, a theme draws a tile with a longer label than the row's others. Commit: 03a92724 (labels wrap between words), suspected.

- 24 kpi-columns.spec.mjs:102 at 1280 px, every D7 row as the spec says

### 14. Pastel page scrolls sideways at 320 px (1 row)

Cause: the pastel showcase page is 332 px wide at 320 px (327 in the 10.0.0 triage, 320 after 6ba69067). 332 is 320 plus two 6 px gaps, which also matches the calendar's translate, but the page is not shown to contain a calendar. Commit: 6ba69067 (did not hold) or 73d472c7, unconfirmed.

- 23 fixtures.spec.mjs:44 pastel fixture reflows at 320 px without sideways scrolling

### 15. Showcase theme menus are not clickable (2 rows)

Cause: after opening a half's theme menu and scrolling to 400, the option click lands on the specimen behind it (`.sc-states`, `.sc-chip`) as if the menu were inert or not at the click point. These tests did not fail in 10.0.0. Candidates: the closing/ghost and inert handling in js/motion.js (ecdd1b69) or the showcase pages regenerated in 6ba69067. Cause not isolated; needs a trace (`test-results/showcase-*/trace.zip`).

- 54 showcase.spec.mjs:46 the left picker changes the left half and nothing else
- 55 showcase.spec.mjs:129 the picker remembers each half across a reload

### 16. Cyberpunk log columns move 4 px (1 row)

Cause: the four columns of a log sit 4 px apart between the two states compared (time 293/289, source 357/353, level 438/434, message 516/512), cyberpunk only. Not in the 10.0.0 triage. Commit: unknown; cyberpunk changed in 1549199c (dead charge removed, only a hover rule) and earlier in 3eba5336. Low confidence.

- 26 log.spec.mjs:39 the four columns of a log do not move, in every theme

## Class D: timeout, flake or harness artefact

### 17. Reads taken mid-transition or on a moving page (5 rows)

- 16, 17 datatable.spec.mjs:660 sticky header reach, plain and React (forest, the shadow read mid-transition: `rgba(246, 244, 238, 0.066) 0px -0.13px` and `0.002`, i.e. fading out; a read before the transition settled)
- 35 redaction-cover.spec.mjs:331 synthwave (`scrollIntoViewIfNeeded`, element not attached; the dossier card is re-rendered; the 10.0.0 triage already found it passes with the spec's own empty register)
- 4 auto-lazy.spec.mjs:212 calendar.html (965 nodes "only in the lazy page": the eager comparison side did not attach the calendars on this page; in the 10.0.0 triage the same test failed on timing of the other side, rows 1 to 5; 03a92724 added one table row to this page)
- 3 app-shell.spec.mjs:200 an open dropdown stays above a popover-layer element (solstice and nostromo only; `elementFromPoint` is read right after the theme switch, while the dropdown replays its arrival; suspected ecdd1b69 changing how an arrival is replayed, in which case it moves to C)

## The five biggest groups

1. Phantom's approved grammar against old tests (7, class B, pre-existing, eec02423)
2. Phantom's hard plate geometry (7, class C, beec5724)
3. Dark, formal, light and pastel headline and mark tests (10, class B, pre-existing, 10-08 to 10-14)
4. Closing copy or open-state attribute matching two elements (4, class B, ecdd1b69 and ef1da350)
5. Side navigation closed but on screen (4, class C, suspected ecdd1b69), tied with the React theme list close (3, class B, 73d472c7), the calendar translate (3, class C, 73d472c7) and the alarm, tooltip and switch registers (6 rows, class B, pre-existing)

## Repair log: groups 9-16

Kenny's go 2026-10-15 03:26 ("suite-red: Eerst oplossen"). Every number below is a Firefox measurement with a standalone Playwright script (no spec body run, fix-118), fixtures served from this worktree; "before" is the register of 0c487c8b (the parent of the plate's merge 4987a95d) or the code at HEAD 04d497a7.

### 9. Phantom's plate: not the cause; a turned overlay was placed by its bounding box (fixed)

- Measured: the plate moves no box. Select list at 1280 px, phantom: layout box 8, 74, 448 (left, top, width) before and after 4987a95d; menu button menu items 322.4 x 66.88 before and after; nav dropdown `offset` 0, 39, 204 x 192 and mega menu 0, 74, 1384 x 116 before and after.
- Cause of the 3 to 4 px: phantom's menus, lists and cards land askew (`rotate: -1.5deg`, 3eba5336 and e785e30a, approved), and the failing tests read `getBoundingClientRect()`, the box of the turned part. v10.0.0's phantom had `rotate: none`: select list bounding width 448, now 451.83. The same code at 3eba5336 (before the rotation reached the list) reads 448.
- One real defect inside it: `layoutRect()` (js/top-layer.js) is what `raiseInPlace()` and `placeBlockSide()` place a list by, and it measured the turned bounding box. A 1227 px combobox list in a card was placed at `top: 633.3 px` (field bottom 649.3 px) and 1229.6 px wide: gap -28.1 px under the input. Now `unturnedRect()` sets the single-angle `rotate` aside about the `transform-origin`: `top: 649.3 px`, 1227 px wide, layout offset 653 (4 px under the field), 0 of 3 options out of reach, both channels (before: 0 of 3 too, but 28 px up over the input).
- Not changed: `rotate: -1.5deg` itself (the approved askew landing), so the select, nav-menu, combobox and choice-centre tests (rows 6, 7, 34, 51, 52, 53, 8), which compare the bounding box of an askew part with a straight box, still read 2 to 4 px by design: they are class B. Select list in phantom: bounding box 451.8 wide, layout box 448 = the select's 448.

### 10. Closed side navigation on screen in four themes (fixed)

- Cause: cyberpunk, synthwave, terminal and solstice keep the panel still and hide it with `visibility` (the approved "nothing slides in from an edge" arrival), so shut it stood at `translate: 0` on the screen: rect 0..240 (scoped 8..248, terminal 26..266). Not ecdd1b69 and not 33b04caa: the rules date from 3eba5336 and e785e30a (10-13). Cyberpunk is red in reduced motion too (its shut rule is outside the motion query); the other three only with motion.
- Fix: shut, the panel also carries `transform: translateX(var(--kp-sidenav-away, -100%))`, with `transform 0s linear <the close's own delay>` in the closed transition and `transform: none; transition: transform 0s` when open. `translate` and its transition are untouched (js/sidenav.js reads them as the clock of a pushed page).
- Numbers (1280 px, rect left/right of the window panel): shut -240/0 in all four, reduced motion and motion; opened 0/240; scoped panel shut right 8 (terminal 26) = its box's x. During the close with motion the panel is on the screen and visible until 467 ms (cyberpunk), 450 (synthwave), 802 (terminal), 467 (solstice) and off the screen from 486, 468, 819, 486 ms: the tear, beam, print and dome play in place as before. Command: `node g10b.mjs` (scratchpad).

### 11. Calendar grid translate (not a defect; one test and one reading repaired)

- Hit-testing: in the add-filter fixture, August 2026 open, all 31 day centres answer `elementFromPoint` in all 16 themes (0 unreachable). Rows 10 and 12 failed because the test formats its dates with `formatDate(..., 'en')` (08/10/2026) and the date picker's default is dd/mm/yyyy since 03a92724, so August became 8 October and `[data-kp-day="2026-08-15"]` did not exist. Repaired in the test: `formatDate(..., 'en', 'rule52')`.
- Pastel 262 against 302: pastel's panel is 262 x 276 in the days, months and years views (all 16 themes equal within 0 px with reduced motion). 301.95 px is the panel read in the first frames of its stuck-on arrival (`scale`, 262 x 1.15), which the sweep reads right after `toBeVisible()`: reproduced with motion on (days 301.95 x 313.58). No change to the calendar; the 334 px overhang fix is untouched.

### 12. A typed date is rewritten to the display format (fixed)

- Cause: `commit(date, 'typed')` deliberately leaves what is typed, and nothing wrote the date back afterwards (03a92724 made dd/mm/yyyy the default and the 10.0.0 locale format happened to equal the typed form).
- Fix: `tidy()` in js/datepicker.js on the input's `change` and when the calendar opens; the same in the React `DatePicker` (`onBlur` of the input, and the open button). Text that is not a date stays.
- Numbers (components fixture, nl): fill `13-09-2026`, click away: `13/09/2026` (framework-free and React); fill `1-2-2026`, open the calendar: `01/02/2026`; fill `not a date`, click away: unchanged.

### 13. Key-figure row heights (not real in the steady state)

- With reduced motion every tile is 121.2 px in every row of all nine rows of the test (5/full, 4/600, 5/700, 7/700, 8/700, 5/358, 6/358, 1/358, 2/358), at 1280 px. With motion on, the same sequence reads tiles mid-leave and mid-enter (heights 9.3 to 111.7 px in one row): the test polls the column count only, not the tiles' own transitions. Nothing changed in the package; the test should wait for the strip's animations.

### 14. Pastel at 320 px (transient, not changed)

- At rest the pastel fixture is 320 px wide at 320 px, in all 16 themes (scrollWidth 320), with and without motion. The failure is the first 60 to 120 ms of the load with motion on (tests/fixtures.spec.mjs sets `reducedMotion: 'no-preference'` for the whole file): scrollWidth 330 to 338 while the static toast of the page swings in (`kp-sig-pastel-stuck-plate-in`, rotate -9deg for the first 21 % of 560 ms): with the toast's animation off the maximum over 6 loads is 320, with everything off 320. It is the approved swing; the page has an in-flow toast. Not changed.

### 15. Showcase theme menus (a race with formal's arrival, not changed)

- At rest the left menu (formal) answers at every button centre (`elementFromPoint` = the button, menu 38, 52, 170 x 498). With motion on, formal's menu opens line by line through a clip (500 ms), and a Playwright click in the first frames passes through the unrevealed part to the specimen behind (`.sc-states`); Playwright then scrolls (400 to 652) and the page scroll closes the menu. Reproduced 4 of 4 with motion on, 0 of 4 with reduced motion. Right half (dark) clicks in both.

### 16. Cyberpunk log columns (fixed)

- Real: the current line's cells (`[data-kp-current] > *`) were washed with `padding-inline: .25rem; margin-inline: -.25rem`, which put each cell's box 4 px left of its column: time 289 (293 on every other line), source 353 (357), level 434 (438), message 512 (516).
- Fix: the wash is two hard shadows (`-0.25rem 0 0` and `0.25rem 0 0` in `--muted`). After: 293 / 357 / 438 / 516 on all five lines, the words in the same places; the level of the warning and error lines now carries the package's 0.4em padding like the other lines (word at 443.2 on both).

### Also: pastel's tooltip (coordinator's addition)

- All four tooltips of catalogue/overlays.html#tooltip, pastel, 1920 x 1000: gap under the trigger 12, 12, 14, 14 before; 12, 12, 12, 12 after (`.kp-tooltip-anchor:has(> .kp-button:hover) > .kp-tooltip { margin-block-start: calc(0.75rem - 2px) }`: the hovered button lifts 2 px).
