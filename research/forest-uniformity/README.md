**Status (2026-10-09, round r1): waiting for Kenny's verdicts on ten questions; nothing in the package changed.**

# Forest, straightened — the uniformity audit

Kenny, 2026-10-09: "Despite our efforts to make everything uniform … many
components are still not uniform. Think of navbars … maybe spinners … Analyse
the Forest theme and see where we can still straighten it." This page is the
audit; `demo.html` asks the choices; `findings.json` is the full list (39
findings, machine-readable).

## Method

Every component root of `css/components.css` (93, read by `declaredRoots` of
`gates/selectors.mjs`) and the six required parts of
`gates/check-register-coverage.mjs` were loaded in forest from the catalogue
pages (button, navigation, overlays, feedback, field, switch, data, table,
structure, page, media, chart, combobox, datepicker, colorpicker, upload,
motion, alarm, page-effects) in Chromium at 1280 px (390 px for the phone
menu). Per root: computed corners, face, transitions and animations. Per
pointable part (41 kinds): `:hover`, `:focus-visible` and `:active` forced
through the DevTools protocol and the computed difference read. Per opening:
the state toggled (or the real control pressed) and `document.getAnimations()`
read for name, duration, curve and direction; motion frames sampled at fixed
times and paused frames screenshotted. Compared with forest's approved grammar
(`themes/forest/CHARACTER.md` G1–G16, Kenny 2026-10-07). All values below are
measured in Chromium.

Result: **15 off-grammar, 13 inconsistent, 4 unanswered, 7 fine.** The first
apply reached the dialog, the menus under a button, the popover, the tooltip,
the toast, the drawer, the buttons and the loading surfaces, and those hold.
What breaks the grammar is what it did not reach.

## Findings by severity

| ID   | Class        | Component                                      | Measured (Chromium)                                                                          | Grammar says                            | Recommendation                     |
| ---- | ------------ | ---------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------- |
| F-01 | OFF-GRAMMAR  | bar dropdown, mega menu                        | 200 ms opacity fade both ways (0 / .37 / .85 / 1 at 0 / 60 / 120 / 180 ms)                   | G3: grows down out of its link, 1000 ms | question 1                         |
| F-02 | OFF-GRAMMAR  | phone menu (collapsed bar)                     | appears and goes at once (display none ↔ flex)                                               | G3: grows out of the bar                | question 1                         |
| F-10 | OFF-GRAMMAR  | pressed primary / destructive button           | turns `--secondary-active` (191,187,176) under its light label: **1.8:1**                    | press closes the blaze; the plate stays | **fix** (forest-register.css:1275) |
| F-20 | OFF-GRAMMAR  | tour card                                      | fades in 160 ms ease-out, goes at once                                                       | G3, G10, close reversed                 | question 4                         |
| F-21 | OFF-GRAMMAR  | command palette                                | no motion: opens and closes at once                                                          | G3: grows like the dialog               | question 5                         |
| F-22 | OFF-GRAMMAR  | date picker panel, theme menu list             | no motion: opens and closes at once                                                          | G3: grows out of its trigger            | question 5                         |
| F-03 | OFF-GRAMMAR  | bar's Report button, menu toggle               | no hover, no press; Report 0 px corners                                                      | G11, G12, G6                            | question 1                         |
| F-13 | OFF-GRAMMAR  | theme menu option focus                        | pale outer channel (≈1.03:1 on the card) + a 1 px line; inner channel missing                | DI2                                     | **fix**                            |
| F-14 | OFF-GRAMMAR  | day of the month focus                         | one 2 px `--ring` outline, 3 px out                                                          | DI2                                     | **fix**                            |
| F-18 | OFF-GRAMMAR  | checkbox, radio                                | tick drawn 200 ms, cleared at once; dot `scale(1.6)` in, cleared at once                     | G1 mirrored, G3 never scale             | question 4                         |
| F-19 | OFF-GRAMMAR  | combobox list                                  | grows UP from its own foot (1000 ms), closes at once                                         | G3: down out of its field, reversed     | question 4                         |
| F-23 | OFF-GRAMMAR  | `kp-sig-forest-root/grow/edge` keyframes       | clip opens 3 rem past the anchor while growing: a menu drawn 32 px over its button at 500 ms | G3: clipped at its line all the way     | **fix**                            |
| F-29 | OFF-GRAMMAR  | alarm                                          | package entrance (240 ease-out, 520 quick curve, scales 0.98 / 1.06), glow pulse 1400 ms     | G1, G3, G8                              | question 8                         |
| F-31 | OFF-GRAMMAR  | small parts                                    | pages and Report 0, days / tree rows / theme options 5 px, swatches 10 px, legend keys pill  | G6: leaf on every small part            | question 9                         |
| F-05 | OFF-GRAMMAR  | breadcrumb, pagination                         | ui-monospace                                                                                 | G13: mono for identifiers only          | **fix**                            |
| F-08 | INCONSISTENT | busy table panel, busy month card              | planting row (6600 ms) **and** the spinner's tree (1600 ms) in one panel                     | G9: one picture per surface             | question 2                         |
| F-28 | INCONSISTENT | rows: table, tree, side nav, dropdown          | four answers: kraft at once / grey at once / grey + greyed words / ground + blaze 200 ms     | one row answer, contact time            | question 7                         |
| F-06 | INCONSISTENT | side navigation                                | slides 200 ms; the drawer grows 1000 ms                                                      | G3, G4                                  | question 5                         |
| F-07 | INCONSISTENT | side navigation group                          | unfolds 200 ms; the accordion 1000 ms                                                        | G4                                      | question 4                         |
| F-12 | INCONSISTENT | date picker day, theme option, legend key      | grey ground at once / 8 % wash 200 ms / grey edge                                            | G12: the blaze                          | question 3                         |
| F-24 | INCONSISTENT | `.kp-popover > .kp-menu`                       | two frames and two shadows: a square menu plate inside the leafed popover                    | G6, G7: one plate                       | **fix**                            |
| F-09 | INCONSISTENT | loading loops                                  | rows 6600 ms, skeleton block / circle 3200 ms, spinner 1600 ms                               | G4: one rhythm                          | question 10                        |
| F-15 | INCONSISTENT | prose link hover                               | at once; nav and footer links 200 ms                                                         | G4 contact 200 ms                       | **fix**                            |
| F-33 | INCONSISTENT | calendar busy card, to-top                     | 200 ms fade in, card goes at once                                                            | G10                                     | **fix**                            |
| F-34 | INCONSISTENT | headline, rule, tick, meter wipe, alert edge   | physical left / `inset(0 100% 0 0)`: end → start in RTL; headline slides + fades             | G2 logical, G10                         | **fix**                            |
| F-35 | INCONSISTENT | DI5 table (`TIMINGS`)                          | headline 500 / trace 1800 listed, 1000 played; plant 3200 listed, 1600 played                | the table states what plays             | **fix**                            |
| F-17 | INCONSISTENT | ghost and icon button hover                    | an 8 % wash under the blaze                                                                  | G12                                     | keep (shows a ghost is a button)   |
| F-36 | INCONSISTENT | progress bar with a share                      | edge moves in 200 ms; meter share 1000 ms                                                    | G4                                      | keep (follows live progress)       |
| F-04 | UNANSWERED   | tabs, crumbs, page numbers                     | no hover at all                                                                              | G11: a link is forest's link            | question 1                         |
| F-11 | UNANSWERED   | accordion heading, combobox / palette options  | no hover at all                                                                              | G12                                     | question 3                         |
| F-27 | UNANSWERED   | field, select, check, radio, switch, drop zone | no hover at all                                                                              | G12                                     | question 6                         |
| F-25 | UNANSWERED   | dialog and drawer backdrop                     | js/motion.js default fade, 1000 ms `ease-in`                                                 | G1                                      | **fix**                            |

Fine (F-16, F-26, F-30, F-32, F-37, F-38, F-39): the blaze family (button, icon
button, menu entry, key-figure link, tile, to-top, row actions; dashed 2 px,
offset 5 → 2 → 1 px, 200 ms on the growth curve, DI2 wins); every dialog,
drawer, popover, menu button, tooltip, accordion and tree at 1000 ms with its
close reversed; toast and alert grow and wither; leaf corners on the plates
and parts in the list; the tokens (200 · 1000 · 3200 ms, the Gompertz curve,
80 ms stagger); the spinner (one tree in three steps per 1600 ms) and the
skeletons; `gates/box-metrics.test.mjs` passes and the register names no
colour.

## The questions (demo.html)

1. **The bar** (F-01–F-04): recommended, the dropdown and phone menu grow out
   of the bar; a link, tab, crumb and page answer as forest's link; Report and
   the toggle blaze.
2. **One picture per waiting panel** (F-08): recommended, the row where it
   fits, the tree only where it does not.
3. **Pointing and focus on small parts** (F-11, F-12): recommended, every
   pointable part blazes; DI2 everywhere.
4. **Every close is its open reversed** (F-07, F-18–F-20), ticked by the
   grammar.
5. **The overlays that do not grow yet** (F-06, F-21, F-22), ticked.
6. **Fields under the pointer** (F-27): recommended, they blaze.
7. **Rows under the pointer** (F-28): recommended, every row answers as a
   menu entry.
8. **The alarm** (F-29): recommended, grows like the dialog; a growth ring
   instead of the glow pulse.
9. **The leaf corner on the last small parts** (F-31), ticked.
10. **One rhythm for every waiting surface** (F-09): recommended, the bar's
    breath (3000 / 600 / 3000) everywhere.

## To fix, no choice needed

F-10 (pressed primary 1.8:1), F-13 and F-14 (DI2), F-23 (the growth's clip
past the anchor line), F-24 (double plate), F-05 (mono crumbs and pages), F-15,
F-25, F-33, F-34, F-35. Also in `research/PACKAGE_FINDINGS.md` under
"Forest uniformity". The demo's own growths already keep the anchor side
clipped (F-23).

## The demo

`demo.html` in the review kit's aspect mode (round `2026-10-09-r1`), forest
only, on the package's own components with `css/forest-register.css` as it
stands; `aspects.js` holds the words, `demo.js` the scenes and the clock,
`options.css` the drawings (`@layer kp.signature`, hung on `.fu-scene`). No
`update.json` on round one (the kit's fetch of it answers 404, as expected).
Checked in Chromium at 1280 and 390 px (nothing clipped, no horizontal
scroll) and in the review dialog (`Review in a dialog`: questions 1 and 2 play
inside the stage). It still has to be added to `catalogue/pages.js`.
