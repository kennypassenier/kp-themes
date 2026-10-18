# kpadopt56 designer notes: solstice, brutalism, deco (worktree t56-c)

Scope: `css/solstice-register.css`, `css/brutalism-register.css`, `css/deco-register.css` only. Firefox, ports served from the worktree,
`measure-gaps.mjs`, `measure-overflow.mjs`, `measure-plate.mjs` (0 findings in all three themes). No browser test run.
Measured first on the nine original demo pages (79 sections, every state button clicked, 1280 and 390 px), then on the eleven
`research/kpadopt56-<part>` pages after merging `theme/themes56`.

## Commits (all in css/ plus the generated dist files)

| commit | theme | what |
|---|---|---|
| ecef3214 `[t56-solstice-1018]` | solstice | a 64-character digest in the version badge breaks anywhere; conversation bubbles are plates lit from below (foot edge and wash, warmer for the sender's own, red for a failed one) |
| 7d4c9b7f `[t56-brutalism-1018]` | brutalism | text margins at 390 px (weekday chips, segments, small round identity mark, code cell's Show all, Back/Next, calendar day numbers, display rating); bubbles, gallery tiles and the QR plate are slabs (2 px / 3 px and 3 px / 6 px ink line on a hard shadow, the sender's bubble yellow) |
| 31571539 `[t56-deco-1018]` | deco | text margins at 390 px (segments, weekday chips, Back/Next); the checklist's empty and failed plate is lacquer + wallpaper + double rule (was a bare dark void); waiting words stand over the lift doors; the quote mark is a gold lozenge; bubbles, gallery tiles and the QR plate carry the gold double rule |
| 5c838dce `[t56-merge-1018]` | - | merge of theme/themes56 |
| next `[t56-parts-1018]` | all three | print-checklist detail wraps (label was 0 to 25 px wide at 390 px); digest break in brutalism and deco; code-box tools wrap (brutalism, solstice, deco); availability person row keeps 6 rem for the name (brutalism, deco); small buttons tighter on a phone (brutalism); phone tables with 8 px cells (solstice) |

## Measured, before and after

Original demo pages, `measure-gaps` at 1280 and 390 (text findings, clear = 0):

| theme | before | after |
|---|---|---|
| solstice | 2 (digest -3.4 px past its badge; "Updating" 1.9 px from the scroll box) | 1 ("Updating" fixed on the part page by the 8 px cells) |
| brutalism | 74 (weekday and sentence chips 0.1 to 3.9 px, calendar days 3.8 px, "GH" 3.1 px, Show all -0.0 px, Everything -3.0 px, Failed 2.9 px, rating overlap, Back overlap) | 0 |
| deco | 52 (chips 0.1 to 3.3 px, Everything -1.0 px, Failed -1.0 px, overlaps in version states) | 1 (focus-states "Back", see below) |

Part pages (`research/kpadopt56-*`), cells = section x theme x width:

| tier | solstice before / after | brutalism before / after | deco before / after |
|---|---|---|---|
| A text gaps (FINDINGS) | 3 / 2 | 15 / 2 | 9 / 3 |
| B sticks out / scrolls sideways | 4 / 2 | 6 / 2 | 4 / 2 |
| C squeezed (weak signal) | 19 / 19 | 12 / 12 | 12 / 12 (all judged false positives, see below) |

Measured numbers per fix: brutalism chips 2.0 to 3.9 px -> >= 4 px; "GH" 3.1 -> >= 4; Show all -0.0 -> 3.4+ -> clear; version
digest sticking out 74 / 103 / 165 / 266 px -> 0; print-checklist label 0 / 8 / 25 px -> readable two lines; Copy button in the
brutalism request inspector 77 px past the box -> inside; availability "Kenny (you)" 0 px -> 96 px (brutalism and deco).

## Could not fix in my registers (shared css/js or the demo page; for Kenny to decide)

1. **auto-refresh (updates), 390 px, solstice / brutalism / deco (and formal, every theme):** `.kp-refresh__bar` is a flex row whose
   chooser holds an `inline-grid` segmented control of 6 nowrap segments; the flex item cannot shrink (min-width auto), so the bar
   sticks out 127 to 186 px. Fix belongs in `css/components.css` (`min-inline-size: 0` on the bar's children) plus the segmented
   control's own scroll. I tried it in the three registers: the bar then fits but the segmented control clips its last segment
   against its own edge (new text-gap findings, and at 1280 the inspector filter lost 1 px), so I reverted it.
2. **request-inspector (lists), 390 px, all three:** same cause in `.kp-inspector__bar` (91 / 59 / 19 px past the section).
3. **shortcut-engine (choose), 390 px, all three:** the first `kp-shortcuts` dialog is 957 to 1011 px tall inside a 384 px frame
   (`.kb-frame`, demo CSS in `research/kpadopt56/src/kpadopt5-basics/page.css`), so it runs into the second frame's dialog. Same in
   formal (986 px). The frame needs a height or `overflow: auto`; not a register matter.
4. **dated (choose), 390 px, all three:** the "shown opened" list of the picker stands over the status line and the field by design;
   `measure-gaps` reports it only when it samples during the popover's own open; it is flaky between runs (clear on single runs).
5. **focus-states (calm), 390 px, deco:** "Back" sits 1.3 px from the mark of the last answer of the long-answer frame; that answer is
   clipped by the frame's scroll body under the nav, so the mark is not on screen there. Measure artefact of the clipped body.
6. **Tier C "squeezed" signals** (rating foot, version link `a.kp-version__to`, claim person, code meta, heat label, entity menu,
   `kp-pane__head` 0 px high): checked by eye in the screenshots, text reads correctly; they are the sr-only/hidden parts of the
   components, or text exactly at the 40 px threshold ("6 lines", "Stretch"). `kp-pane__head` is the Back button hidden at desk width.
7. `research/_review` check-rereview and `npm test` (themes count 12 vs 16) fail at the base commit independent of this work;
   every other gate in `npm run gates` is green.

## DEMO_RULES.md chapters 2, 3, 4, 5

- **Chapter 2 (components):** kept. Only the packages' own parts (kp-button looks, segmented, menus, busy card) were restyled in
  register layers; text margins >= 4 px at 1280 and 390 (see the tables; the remaining lines are items 3 to 5 above); raised plates
  opaque (`measure-plate`: every surface plated, the same everywhere, 0 findings); no detached menus touched.
- **Chapter 3 (states):** kept for these themes: empty and failed fill the footprint and are centred (deco's checklist plate now a
  lacquer plate, brutalism's and solstice's already); loading uses each theme's busy card (lift doors, hoisted beam, sun crossing);
  no structure changed, no layout shift introduced.
- **Chapter 4 (motion and loading):** kept. Nothing animated was added; loading animations were left as the registers have them
  (verified they play in the walks); every new rule is static or inside an existing reduced-motion pattern.
- **Chapter 5 (themes and character):** kept: slabs and yellow hand for brutalism (G5, G7), foot light for solstice (G7, G13),
  lacquer, wallpaper and the double gold rule for deco (G5 to G7); distinct from each other and from other themes; anchors untouched.
