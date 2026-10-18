# Triage of the 90 failures of the 11.0.0 release suite, on theme/rel-11 at 1c9b6149

Triage of 2026-10-19. Source: the full Firefox run of `npm run verify` on the 11.0.0 release commit plus gate fixes (8cc1fdd4, 1c9b6149): 1593 passed, 90 failed, 4 skipped, 23 min 30 s. Shape copied from research/SUITE_10_0_0_TRIAGE.md.

## Summary

| Group | Cause                                                                                                      | Failures | Proposed action                                                                                        |
| ----- | ---------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| 1     | auto-lazy: the test's "every module attached" side attaches none of the modules registered since 10.1.1    | 64       | (a) stale test: build the eager side's extra attach list from `NEEDS` instead of the hand list `EXTRA` |
| 2     | Four themes removed (16 to 12): counts of 16, and `light` still named by tests                             | 7        | (a) stale test: count `themes/order.json`, replace `light` with a theme that still exists              |
| 3     | Review kit changed on purpose: header demo walks 36 steps, the mirror bar is gone, topic rounds walk lanes | 9        | (a) stale test: 36 steps, controls at the component, read the lane's theme                             |
| 4     | research/character-graph demo throws on load: its round files still carry the removed themes               | 1        | (b) research demo fault (not the package): skip themes not in `IDEAS`                                  |
| 5     | Site: three Buttons pages not in the navigation; compare's live example points at images that do not exist | 3        | (b) for the nav group and the missing images; (a) allow the two deliberate "failed picture" addresses  |
| 6     | Synthwave: every button on a coral plate is now a dark key, scope-94 said only Try again                   | 1        | (d) needs Kenny                                                                                        |
| 7     | Motion runs in every test: `reducedMotion: 'reduce'` in the config is not a Playwright 1.62 option         | 3        | (c) harness: move it to `contextOptions`, then rerun                                                   |
| 8     | Load and budget: a sweep over 144 review pages outgrows 180 s; one compare-column click under full load    | 2        | (c) timing                                                                                             |
|       | **Total**                                                                                                  | **90**   | (a) 81, (b) 3, (c) 5, (d) 1                                                                            |

(a) is counted per failure: group 5's row 88 is (a), rows 87 and 89 are (b); row 87 also needs the (a) allowance.

The one finding that matters beyond these 90 rows is group 7: the suite has run with motion on since 2026-10-03 (55406956). `playwright.config.mjs` sets `use.reducedMotion: 'reduce'`, but @playwright/test 1.62.1 has no `reducedMotion` test option (its option fixtures in node_modules/playwright/lib/index.js are acceptDownloads, bypassCSP, colorScheme, ... serviceWorkers, with no reducedMotion; types/test.d.ts:7604-7626 documents it as `use.contextOptions.reducedMotion`). The trace of every failed test shows the context created with `"reducedMotion":"undefined"`, and Firefox then gets `no-preference` (playwright-core sends `Browser.setReducedMotion` with `no-preference` when the option is undefined). The `test.use({ reducedMotion: 'no-preference' })` calls in 15 spec files are ignored for the same reason (they get motion anyway, so they pass by accident). This also answers the open question at the end of research/SUITE_10_1_0_CAUSES.md (rows reproduced only with motion on although the config said reduce).

### How this was done

- Constraint kept: the suite was not rerun. One test was run once, alone, because its cause could not be read from the output: `npx playwright test tests/catalogue-review.spec.mjs:729 --project=firefox` (row 70). It passed in 6.3 s (7 s wall clock), output kept in the session scratchpad.
- Everything else is read: the error in the run log, the test at its line, the code it reads, `git log`/`git diff` against v10.1.1, and the traces and error-context files the run left in `test-results/` (no test was run to read them).
- "Read" in the evidence column means classified from the test, the code and the history. "Trace" means read from the run's own trace or page snapshot. "Measured" means the one run above or a node script over the repository files (the auto-lazy module map, the site navigation count, the review page count), never a browser.
- The only file written in the repository is this one.

## Table

Class codes: a = stale test, b = real fault, c = flaky or timing, d = needs Kenny. Evidence: R = read, T = trace, M = measured.

| #    | Test (file:line)                                | Title (short)                                                                                    | Error (one line)                                                                            | Class | Evidence | Group |
| ---- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ----- | -------- | ----- |
| 1    | alarm.spec.mjs:464                              | the glitch and the flicker run only in cyberpunk, in all 16 themes [scope-98]                    | `expect(THEMES.length).toBe(16)`: received 12                                               | a     | R        | 2     |
| 2    | app-shell.spec.mjs:200                          | an open dropdown in the bar stays above a popover-layer element that follows the bar [finding 3] | covered: `solstice: div#probe-layer at 416,57`, `nostromo: div#probe-layer at 557,58`       | c     | R, T     | 7     |
| 3-66 | auto-lazy.spec.mjs:212 (64 pages, see group 1)  | `<page>` ends up the same as with every module attached [scope-115]                              | "only in the lazy page": 1 to 1297 lines, every one written by a module born after 6.1.0    | a     | R, M     | 1     |
| 67   | button-surfaces.spec.mjs:31                     | the two surfaces cost the control nothing, framework-free [scope-16]                             | timeout 30 s waiting for `.kp-button` on /examples/concept-light.html                       | a     | R        | 2     |
| 68   | button-surfaces.spec.mjs:74                     | a theme that paints neither sees nothing, framework-free [scope-16]                              | same timeout, same page                                                                     | a     | R        | 2     |
| 69   | catalogue-review-dialog.spec.mjs:503            | the review note stands before "Look at:" ... in the look's font in another colour [scope-92]     | `pastel`: note visible expected true, received false                                        | a     | R        | 2     |
| 70   | catalogue-review.spec.mjs:729                   | Not approved with an empty note records nothing and says why; with a note it records [scope-89]  | compare column: `[data-cat-reject-refused]` stays hidden after the click                    | c     | T, M     | 8     |
| 71   | catalogue-round.spec.mjs:37                     | the round page: with nothing judged it says what is left, per theme                              | `[data-cat-round-rows] tr`: expected 16, received 12                                        | a     | R        | 2     |
| 72   | dark-themes-notes.spec.mjs:270                  | synthwave: the data table's Try again frames in the alert label's own ink ... [scope-94]         | `empty Try again: a button's own frame`: rgb(250,249,251) instead of pink rgb(255,71,130)   | d     | R        | 6     |
| 73   | datatable.spec.mjs:660 (plain-sticky)           | the sticky header's ground reaches 2px above it ... in every theme [fix-32, scope-90]            | forest and titanium scrolled, th 1: shadow read mid-transition (`0px -0.12px`, alpha 0.062) | c     | R, T     | 7     |
| 74   | datatable.spec.mjs:660 (react-sticky)           | the same, React                                                                                  | forest and titanium scrolled, th 1: `0px -0.009px` alpha 0.004 / `-0.94px` alpha 0.47       | c     | R, T     | 7     |
| 75   | control-font.spec.mjs:68                        | no control on a review page takes the browser default font [fix-28]                              | test timeout 180 s in `page.goto` of research/datatable/demo.html                           | c     | R, M     | 8     |
| 76   | review-kit-dialog.spec.mjs:111                  | the dialog shows a visible mirror of every control of the demo on every aspect page [fix-106]    | position expected `Step 1/48 ... option 1/3`, received `Step 1/36 · option 1/3`             | a     | R        | 3     |
| 77   | review-kit-dialog.spec.mjs:151                  | Space pauses on an aspect page and never picks or moves on [fix-107]                             | same `Step 1/36`                                                                            | a     | R        | 3     |
| 78   | review-kit-dialog.spec.mjs:39 (character-meter) | the review dialog ... stays modal and in place over ten approvals in character-meter [fix-102]   | `ten approvals walked eleven themes`: expected 11, received 1                               | a     | R        | 3     |
| 79   | review-kit-dialog.spec.mjs:39 (character-graph) | the same, in character-graph                                                                     | page error `can't access property "loading", IDEAS[t] is undefined`                         | b     | R        | 4     |
| 80   | review-kit-dialog.spec.mjs:182                  | a picked shape is drawn in the next rows, and the arrows flip under any focus [fix-108]          | same `Step 1/36`                                                                            | a     | R        | 3     |
| 81   | review-kit-dialog.spec.mjs:236                  | the flip draws the whole shown card, with nothing clipped inside it [fix-109]                    | same `Step 1/36`                                                                            | a     | R        | 3     |
| 82   | review-kit-dialog.spec.mjs:253                  | the header More menu hangs inside the shown card, in every option [fix-110]                      | same `Step 1/36`                                                                            | a     | R        | 3     |
| 83   | review-kit-dialog.spec.mjs:280                  | the header menu hangs 8px under More and shares an edge with it [fix-111]                        | same `Step 1/36`                                                                            | a     | R        | 3     |
| 84   | review-kit-dialog.spec.mjs:322                  | a menu opened on the first page is still open on eight pages, each flipped [fix-112]             | same `Step 1/36`                                                                            | a     | R        | 3     |
| 85   | sidenav.spec.mjs:256                            | a submenu item carries a mark of its own, and no label moves for it [fix-64]                     | `the themes were read`: expected 16, received 12                                            | a     | R        | 2     |
| 86   | review-kit-dialog.spec.mjs:430                  | the flip reads n/7 in a theme with seven options and n/8 in one with eight [fix-113]             | `counts.light` is undefined (`toBeGreaterThan` on undefined)                                | a     | R        | 2     |
| 87   | site.spec.mjs:40 (compare)                      | compare carries its nine sections and draws every example [TH100]                                | 404 /site/components/before.png, /after.png, /missing/before.png                            | b     | R        | 5     |
| 88   | site.spec.mjs:40 (idmark)                       | idmark carries its nine sections and draws every example [TH100]                                 | 404 /site/components/missing-photo.jpg                                                      | a     | R        | 5     |
| 89   | site.spec.mjs:139                               | every navigation entry leads to a page that exists [TH100]                                       | nav links expected 153 (5 + 148 descriptors), received 150                                  | b     | R, M     | 5     |
| 90   | review-kit-dialog.spec.mjs:363                  | Close plays the open backwards before the menu hides, in every theme of the menu demo [fix-114]  | timeout 120 s waiting for `.rv-dialog .rv-controls button` "Open"                           | a     | R        | 3     |

Rows 3 to 66 count 64; the table adds to 90.

## The groups

### Group 1: auto-lazy, the comparison side is from 6.1.0 (64 failures, a)

The test opens every page twice: as it is (js/auto.js loads only the modules the page asks for) and with the 6.1.0 entry served in its place (tests/fixtures/auto-eager.txt), which attaches every module that existed in 6.1.0, plus the hand list `EXTRA` in tests/auto-lazy.spec.mjs:46-58 (progressbar, actions, kpi, attention, tiles, freshness, chart, graph, menu-button). Since v10.1.1 js/auto.js went from 28 to 109 `NEEDS` entries (the kpadopt4/5/6 components: steplist, row-keys, hovercard, nav-fold, segmented, idmark, code, timer, calendar's neighbours, lede, compare, rating, slider, ...). None is in `EXTRA`, so on every page that carries one of them the lazy side has markup the eager side never writes. All 64 failures are of that one direction ("only in the lazy page"); none says "only with every module attached", which is what a missing `when` selector would look like.

Measured with a node script over the page sources and `NEEDS`: every failing page carries at least one module born after 6.1.0 and not in `EXTRA` (column 4 below; `loading-pieces` and `motion`, which match nearly every page, are left out). The catalogue index composes the table blocks, so it inherits catalogue/table.html's row-keys rows. type-confirm is the new `attachTypeConfirms()` call inside the old `components` entry, which the 6.1.0 file does not make.

A user sees nothing wrong: the lazy side is the shipped behaviour, and each difference is the component doing its job.

Action (a): replace `EXTRA` with a list computed from `NEEDS`: every entry whose name is not one of the 6.1.0 modules gets its `load()` and `attach()` called on the eager side too. Then a module born later can never make this test red by being born. Caveat: the second assertion (`only with every module attached`) was never reached in these 64 tests, so a real missing `when` could still be hiding behind them; the rerun after the repair is the first real reading.

| #   | Page                                  | Lines only in the lazy page | Modules the eager side does not attach |
| --- | ------------------------------------- | --------------------------- | -------------------------------------- |
| 3   | examples/compare-frame.html           | 2                           | lede                                   |
| 4   | catalogue/table.html                  | 34                          | row-keys, row-select                   |
| 5   | examples/concept-blueprint.html       | 1                           | lede                                   |
| 6   | site/components/ack-gate.html         | 19                          | ack-gate                               |
| 7   | site/components/anchors.html          | 38                          | anchors                                |
| 8   | site/components/autosize.html         | 9                           | reason, autosize                       |
| 9   | site/components/bar-cell.html         | 2                           | barcell                                |
| 10  | site/components/availability.html     | 97                          | reason, availability, footprint        |
| 11  | site/components/bullets.html          | 25                          | bullets                                |
| 12  | site/components/calm.html             | 2                           | calm                                   |
| 13  | site/components/calendar.html         | 1297                        | calendar, timefield                    |
| 14  | catalogue/index.html                  | 2                           | row-keys (composed table blocks)       |
| 15  | site/components/claim.html            | 7                           | checklist, print, claim, footprint     |
| 16  | site/components/code.html             | 236                         | code                                   |
| 17  | site/components/command.html          | 58                          | command                                |
| 18  | site/components/compare.html          | 45                          | compare                                |
| 19  | site/components/console.html          | 74                          | reason, console                        |
| 20  | site/components/countdown.html        | 78                          | countdown                              |
| 21  | site/components/document-preview.html | 13                          | card-state, docpreview                 |
| 22  | site/components/datatable.html        | 38                          | row-keys, row-select, card-state       |
| 23  | site/components/empty-state.html      | 98                          | art                                    |
| 24  | site/components/entity-card.html      | 18                          | entity-card, footprint                 |
| 25  | site/components/flash.html            | 60                          | flash                                  |
| 26  | site/components/focus-steps.html      | 2                           | focus-steps, timer, timefield          |
| 27  | site/components/gallery.html          | 5                           | gallery, footprint                     |
| 28  | site/components/idmark.html           | 16                          | idmark                                 |
| 29  | site/components/heat.html             | 4                           | heat                                   |
| 30  | site/components/json-field.html       | 34                          | json-field                             |
| 31  | site/components/master-detail.html    | 11                          | master-detail                          |
| 32  | site/components/lede.html             | 15                          | lede                                   |
| 33  | site/components/matrix.html           | 1                           | matrix, footprint                      |
| 34  | site/components/nav-bar.html          | 18                          | nav-fold, tabbar                       |
| 35  | site/components/new-pill.html         | 5                           | newpill                                |
| 36  | site/components/passkeys.html         | 4                           | passkeys                               |
| 37  | site/components/print.html            | 13                          | checklist, print, footprint            |
| 38  | site/components/path-trace.html       | 6                           | path-trace                             |
| 39  | site/components/problems.html         | 3                           | problems                               |
| 40  | site/components/qr.html               | 53                          | qr                                     |
| 41  | site/components/question.html         | 4                           | question-card                          |
| 42  | site/components/quote.html            | 94                          | quote                                  |
| 43  | site/components/range.html            | 194                         | range, timefield                       |
| 44  | site/components/rating.html           | 362                         | reason, rating                         |
| 45  | site/components/selection.html        | 39                          | row-select, selection-bar              |
| 46  | site/components/shortcut-sheet.html   | 1                           | shortcuts                              |
| 47  | site/components/segmented.html        | 31                          | segmented                              |
| 48  | site/components/slider.html           | 138                         | card-state, tick, reason, slider       |
| 49  | site/components/status-row.html       | 113                         | statusrow, card-state                  |
| 50  | site/components/steplist.html         | 12                          | steplist, gantt                        |
| 51  | site/components/stackbar.html         | 25                          | stackbar                               |
| 52  | site/components/time.html             | 71                          | card-state, reason, timefield          |
| 53  | site/components/timer-disc.html       | 52                          | timer-disc, timefield                  |
| 54  | site/components/timer.html            | 2                           | timer, timefield                       |
| 55  | site/components/transfer.html         | 5                           | transfer                               |
| 56  | site/components/toggle.html           | 8                           | toggle                                 |
| 57  | site/components/toolbar.html          | 2                           | segmented, toolbar                     |
| 58  | site/components/tooltip.html          | 1                           | hovercard                              |
| 59  | site/components/type-confirm.html     | 7                           | components' attachTypeConfirms()       |
| 60  | site/components/unsaved.html          | 120                         | unsaved                                |
| 61  | site/components/uses-map.html         | 3                           | matrix, footprint                      |
| 62  | site/components/viewer.html           | 1                           | docpreview                             |
| 63  | site/components/usual-picker.html     | 101                         | usual-picker                           |
| 64  | site/components/version-delta.html    | 69                          | version-delta                          |
| 65  | site/components/weekdays.html         | 25                          | week, reason, weekdays                 |
| 66  | tests/fixtures/components.html        | 5                           | row-keys, row-select                   |

### Group 2: the four removed themes (7 failures, a)

Terminal, phantom, light and grotesk were dropped (5eb6134e, 22903bbb, aa72052f, 74296117); themes/order.json lists 12. These tests still count 16 or still name `light`.

- **1 alarm.spec.mjs:464.** `expect(THEMES.length).toBe(16)`, received 12; the title says "all 16 themes". Action: assert the length of themes/order.json, or drop the count.
- **71 catalogue-round.spec.mjs:37.** The round page shows one row per theme: 12 rows, the test wants 16. Action: count themes/order.json.
- **85 sidenav.spec.mjs:256.** `names.length` read from themes/order.json is 12, the test pins 16. Action: drop the pinned number or pin 12.
- **67, 68 button-surfaces.spec.mjs:31, :74, framework-free.** The channel URL is /examples/concept-light.html, deleted with the light theme (aa72052f), so there is no `.kp-button` and `scrollIntoViewIfNeeded` times out. The React channel (`?example=concept&copy=light`) passes, probably by falling back to another copy; check that it still reads what it claims. Test 68 is about "a theme that paints neither surface", and light was that theme. Action: point both channels at a concept page that exists; for 68 pick a remaining theme that paints neither surface, or drop the case if none is left.
- **69 catalogue-review-dialog.spec.mjs:503.** aa72052f swapped `light` for `pastel` in the theme loop (line 524) but the `NOTES` fixture (line 373) still gives the note to `formal, dark, nostromo, light`. Pastel has no note, so the note box is hidden. Formal, dark and nostromo passed. Action: `pastel: SHORT_NOTE` in `NOTES`.
- **86 review-kit-dialog.spec.mjs:430.** Walks research/families looking for "Light · A live update" to compare its option count with formal's; there is no Light step, so `counts.light` is undefined. Action: pick another theme whose live-update row has fewer options than formal's, or rewrite the check over whatever two counts differ.

### Group 3: the review kit changed on purpose (9 failures, a)

Three deliberate changes in research/_review/review.js, each with Kenny's own words in the commit:

1. **The header demo has 36 steps, not 48.** 3 aspect pages per theme times 12 themes. `openHeader()` (review-kit-dialog.spec.mjs:92) waits for `Step 1/48`. Rows 76, 77, 80, 81, 82, 83, 84 all stop there. Action: `Step 1/36`, or better, read the total and check it is 3 times the theme count.
2. **No mirror bar any more.** 51ce6bfd (2026-10-18, Kenny 07:09: "Die controls moeten niet gewoon meer boven staan, maar enkel de geschikte control per component zoals die tevoorschijn komt"): the dialog no longer copies the demo's controls into `.rv-controls`; each demo's own controls stand directly above their component (`data-review-controls-for`), and check-kit.mjs now fails a page that has a bar on top. The tests at :111 (fix-106, "a visible mirror of every control" — the opposite of the new rule), :151, :182, :253, :280, :322 and :363 use `mirrored()` / `MIRROR`. Row 90 (:363) times out on exactly that locator; the others will hit it once the step count is fixed. Action: rewrite them against the controls at the component (`[data-rv-stage] [data-review-controls]`); retire fix-106's assertion, which check-kit section on the layout now covers the other way round. Only :236 (fix-109) does not touch the bar.
3. **A round asked in several themes walks topic by topic, every theme in its own lane.** 68ab4a98 (2026-10-16, Kenny 17:44: "per group, maar dan 1 item per thema per approval"). A topic step has `theme: null` and its own `laneTheme`; review.js:2775 switches the document theme only when `step.theme` is set. character-meter is not an aspect demo, so it walks topics and `document.documentElement.dataset.theme` stays formal for all eleven steps: row 78 reads 1 theme. Action: read the step's lane theme (or the step title "… · <Theme>") instead of the document's.

None of the three changes the package.

### Group 4: research/character-graph throws on load (1 failure, b, research only)

Row 79. fba03937 and the four theme drops removed the dead themes from `IDEAS` in research/character-graph/demo.js, but the round files it merges still carry them: round2-a.js has `light`, round2-b.js `terminal`, round2-d.js `phantom`, round2-e.js, round3-b.js and round4-b.js `grotesk`. The merge at demo.js:609-611 does `IDEAS[t][id] = options` for every theme of every file, and `IDEAS.light` is undefined: "can't access property "loading", IDEAS[t] is undefined". The review dialog still walked eleven themes and stayed in place (lines 59 to 63 of the test passed); only the page-error check failed.

Action (b): in demo.js skip a theme that `IDEAS` does not have (`if (!IDEAS[t]) continue;`), or strip the dead themes from the six round files. A research page: no package file, no approved visual changes. It matters for the next review of this demo: the loop is top-level in a module, and round2-a.js is merged first with `light` second, so evaluation stops at line 611 after formal's round-2 options. Nothing after it in demo.js runs (the review text and `data-review-choices` at :618 onwards, the drawing code), so a reviewer opening the graph demo today sees a console error and a half-built page.

### Group 5: the site pages (3 failures: 2 b, 1 a)

- **89 site.spec.mjs:139 (b).** The navigation has 150 links; the test wants 5 + 148 descriptors = 153. Measured: the three descriptors `toggle`, `action-tile` and `flash` have `group: 'Buttons'`, and `GROUPS` in gates/site/descriptors.mjs lists Getting started, Theming, Layout, Forms, Data, Feedback, Navigation, Content, Structure: no Buttons. The navigation (gates/site/chrome.mjs) is built per group, so the three pages exist but no link leads to them. Action (b): add `Buttons` to `GROUPS` (or put the three in `Forms`, where Button is) and regenerate the site. Site only; no package visual changes.
- **87 site.spec.mjs:40, compare (b, plus a).** The first live example, "A chart before and after" (gates/site/descriptors.mjs:4578), uses `before.png` and `after.png`, which exist nowhere in the repository, so the page's main example shows two failed panes instead of a chart. Action (b): give it real pictures (two inline SVGs, as the failed-picture example already does for its "after" pane). The third 404, `missing/before.png`, is deliberate: it is the "A picture that fails, and Retry" example. Action (a) for that one: let the test accept addresses an example fails on purpose (`READERS_OWN` in tests/site.spec.mjs:34 is the existing list; a marker on the example would be better than a list).
- **88 site.spec.mjs:40, idmark (a).** `missing-photo.jpg` is the deliberate "the photo is gone, the letters stay" example. Action (a): the same allowance as above.

### Group 6: synthwave's buttons on a coral plate (1 failure, d)

Row 72. Kenny's scope-94 ruling ("Alleen Try again") narrowed an earlier rule: only the data table's Try again in its failed slot takes the alert label's ink as its frame; the plain Try again in #empty on catalogue/table.html keeps the button's own pink frame. The test holds exactly that.

186895bd (2026-10-18, round t56, "[t56-coralkeys-1018] synthwave: buttons on a solid coral plate are dark keys, not a pink frame on coral") added `[data-theme='synthwave'] .kp-alert--destructive .kp-button:not(.kp-icon-button)` in css/synthwave-register.css:6108: dark ground, near-white frame (`--kp-frame: var(--kp-core)`). Its own comment names "a failed state, an urgent or refused question", but the selector takes every button on every destructive alert, including #empty's. The test reads rgb(250, 249, 251) where it wants the pink. This is the same wide selector scope-94 once took back.

Needs Kenny, two ways:

- Keep the t56 look everywhere: the test's "every other button keeps its own frame" half is dropped (a).
- Keep scope-94: narrow the selector to the plates its comment names (`.kp-stateplate--error`, `.kp-question`, the failure plates) in css/synthwave-register.css (b). This changes the look of any other button on a plain synthwave destructive alert back to the pink frame; the t56 demo did not show such a button, so the approved t56 pictures should stay as they are, but that is for Kenny to confirm.

### Group 7: the suite runs with motion on (3 failures, c, harness)

See the summary. With `prefers-reduced-motion: no-preference` in every context:

- **73, 74 datatable.spec.mjs:660 (forest, titanium).** The scrolled header's reach (`box-shadow: 0 -2px 0 0 <ground>`, css/components.css:7953) is read two animation frames after the scroll. Forest (css/forest-register.css:4287) and titanium (css/titanium-register.css:5258) are the only two themes with a `box-shadow` transition on `.kp-table th[data-kp-sort]`, both inside `@media (prefers-reduced-motion: no-preference)`. The read catches the transition in flight: offsets of -0.12, -0.009, -0.89 and -0.94 px, alpha 0.004 to 0.47, different in every reading. The same rows failed the same way in 10.1.0 (SUITE_10_1_0_CAUSES.md row 16, 17).
- **2 app-shell.spec.mjs:200 (solstice, nostromo).** The test switches theme with the dropdown held open and hit-tests at once. Solstice's dropdown arrives through `kp-sig-solstice-kindled` (a `clip-path` ellipse growing from 0, css/solstice-register.css:1633) and nostromo's through `kp-sig-nostromo-raster` (`clip-path: inset(... 100% ...)`, css/nostromo-register.css:2394), both replayed by the theme switch and both inside the no-preference query. A clipped point does not hit-test, so `elementFromPoint` finds the probe layer underneath. The base keeps the bar at z-index 30 over the layer's 20 in every theme (css/components.css:4033). Same row in 10.1.0 (row 3, "suspected").

Action (c, harness): in playwright.config.mjs replace `reducedMotion: 'reduce'` with `contextOptions: { reducedMotion: 'reduce' }`, and turn the `test.use({ reducedMotion: 'no-preference' })` calls in the 15 spec files into `test.use({ contextOptions: { reducedMotion: 'no-preference' } })` (else they silently get reduce from then on). Then rerun the whole suite: every test that does not ask for motion has been reading moving pages for two weeks, so failures may come and go elsewhere. Independently, rows 73 and 74 should wait for the header's transitions after the scroll, and row 2 for the dropdown's animations after the theme switch, so they hold in either mode. No package file changes.

### Group 8: load and budget (2 failures, c)

- **75 control-font.spec.mjs:68.** One test walks every review page in sequence (`blockPages()`, gates/verdict-hashes.mjs:79) in formal and nostromo, inside a 180 s budget. Measured: 144 pages now (research hrefs in catalogue/pages.js went from 91 at v10.1.1 to 124); the budget ran out in `page.goto` of research/datatable/demo.html, page 125 of 144. The timeout fell during the 125th navigation; nothing points at that page itself. Motion being on (group 7) makes each page slower. Action: split the sweep per page (one test each, as auto-lazy does) or scale the budget with the page count.
- **70 catalogue-review.spec.mjs:729.** The trace shows the compare column's Not approved button enabled, the click performed ("click action done"), and then nothing: no refusal, no verdict, the page snapshot reads "Not yet judged · Cyberpunk" with an empty note. catalogue/judging.js is unchanged since v10.1.1, and the main-page half of the same test (three clicks on the same button code) passed. Run alone once (the one run of this triage), it passed in 6.3 s. Under the full suite's load the cyberpunk column was most likely still being read (the click handler returns early while `current` has no hash for the block, judging.js:404) when the click landed. Action: wait for the column's reading to finish (`data-cat-state` leaving `checking`, or the block's hash present) before clicking, not only for the button to be enabled.

## Real faults (b)

1. **The site navigation leaves out three pages (row 89).** gates/site/descriptors.mjs: `toggle`, `action-tile` and `flash` are in group `Buttons`, which `GROUPS` does not list. Site only.
2. **compare's live example has no pictures (row 87).** gates/site/descriptors.mjs:4578 points at `before.png` and `after.png`, which do not exist; the documentation page's first example shows the failed state. Site only.
3. **research/character-graph throws on load (row 79).** demo.js merges round files that still carry light, terminal, phantom and grotesk. Research only; the module stops at the throw, so the demo is half built.

None of the three is in the shipped package (css/, js/), and none changes an approved visual.

## Needs Kenny (d)

1. **Synthwave, buttons on a red alert (row 72).** Round t56 made every button on a synthwave coral plate a dark key with a near-white frame. Scope-94 ("Alleen Try again") said only the data table's Try again gets the alert's ink and every other button keeps its pink frame. The new rule's selector covers every destructive alert, so the plain Try again of the empty-table example now looks like the dark key too. Kenny decides: the dark key everywhere (the test changes), or only on the plates the t56 round named (the CSS narrows).

## Repairs in order of reach

1. auto-lazy's eager side computed from `NEEDS` (64 rows).
2. The review-kit file against the current kit: 36 steps, controls at the component, lane theme (9 rows).
3. The removed-theme leftovers (7 rows).
4. The motion setting moved to `contextOptions` and the full suite rerun (3 rows here, unknown reach elsewhere).
5. The three real faults, the site allowance, control-font's budget and the compare-column wait (6 rows).
6. Kenny's word on synthwave (1 row).
