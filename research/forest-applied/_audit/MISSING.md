# Forest: what is still missing (audit of the current review-branch state)

Measured with `research/forest-applied/_audit/` (audit.mjs: 19 catalogue pages, 175 pointable parts, Firefox and Chromium; pairs-meter.mjs: 25 pairs; raw numbers in `out/*.json`). Engines agree unless stated. Severity: B = breaks a decided rule, I = inconsistent, C = cosmetic. Ranked by how visible to Kenny.

| # | Component | Measured (engine) | Grammar says | Suspected cause | Sev | Fix |
|---|-----------|-------------------|--------------|-----------------|-----|-----|
| 1 | Table busy overlay and panel | open 1250 ms, close 0 ms: gone within one frame (both) | G10, close = open reversed | js/datatable.js busy layer (~l.1029) is removed, no `leave()` | B | Route the busy layer's removal through js/motion.js `leave()`. |
| 2 | Empty state (table filter) | grows 1000 ms (170 px), vanishes in one frame on clearing (both) | G10 | js/datatable.js l.2123 `empty.hidden = ...` | B | Let the empty state leave via `leave()` before hiding. |
| 3 | Tabs panel switch | old panel withers ~1500 ms, new panel appears only after, with no growth (box height glide only) (Firefox) | G3, G10, 1000 ms | js/motion.js leave of the old panel, no arrival on the new one | B | Play the arrival (`kp-sig-forest-grow`) on the incoming panel and overlap it with the leave. |
| 4 | Tree branch | children open and close at once; only the box glides: pair 40.4 % off (Firefox) | G3/G4 like the accordion (1000 ms) | js/structure.js l.142-144 toggles `aria-expanded`, CSS `display:none` | B | Animate the group (grid-rows or fold) on the growth curve both ways. |
| 5 | Upload file row | open 1583 ms, close 0 ms (both) | G10 | js/upload.js removes the row directly | B | Remove via `leave()`. |
| 6 | Alarm text and button | mono face on prose, hint, countdown and "Acknowledge" (mono, tracked caps) | G13 mono for identifiers only; G11 button is forest's own | css/components.css l.7897-8036 mono; no forest override | B | Reset the alarm's detail, hint, countdown and button to the body face in forest-register. |
| 7 | Other prose in mono | `.kp-error` (p and button), `.kp-platforms`, `.kp-health`, `.kp-combobox__status`, palette and theme-menu status, `.kp-cell-truncate` cells, `.microlabel` | G13 | forest-register.css l.118, 310, 1055, 1074, 1089, 1279 | B | Drop `font-family: mono` on these; keep it on ids, times and logs. |
| 8 | Loading picture on busy table | overlay planting row plus the status line's small tree at once (Firefox screenshot) | G9 one picture | datatable status-line spinner not hidden under `overlay` | I | Hide the status line's spinner while the overlay shows. |
| 9 | Space fold after a leave (alert, toast, upload row, tab panel, empty state, wizard) | fold 1250 ms starting at 333 ms: total 1583 ms (both) | 1000 ms growth | js/motion.js l.1204 and l.1582 (`* 1.25`, `lasts / 3`) | I | Read the fold factor from a forest token set to 1 (and start with the leave). |
| 10 | Alert close | closes 1583 ms; no arrival (open 0 ms) | G10 | `hidden=false` brings it back unanimated | C | Give a re-shown alert the arrival; note it in CHARACTER. |
| 11 | Pressed secondary, default and ghost buttons | plate turns (252,251,248) to (191,187,176); ghost transparent to the same, text 4.35:1 (both) | a pressed part keeps its plate | forest-register.css l.1517-1518 `background: var(--secondary-active)` | I | Let a press keep the rest plate, as primary and destructive do (F-10). |
| 12 | Tour card close | 14.4 % off at frame 5/20 (both) | close = open reversed (tolerance 6 %) | `kp-sig-forest-tour-ring` plays forward on close; components.css ~l.9021 | I | Play the ring reversed (second keyframes name) on close. |
| 13 | Phone bar toggle | pressed tint stays until about 1000 ms after the close starts; pair 4.6 to 14.6 % (flaky between runs) | G12, close = open reversed | toggle tint keyed on `[data-kp-nav-open]`, removed at the end | C | Key the tint on `aria-expanded`. |
| 14 | Leaf corner missing | `.kp-code-block` 10 px; `.kp-datepicker__title`, `.kp-kpi__value`, `.kp-log__level`, `.kp-mono`, `.kp-palette__keys` (navigation, page) 5 px (both) | G6 plate 0/20, part 0/10 | not in the lists forest-register.css l.3039-3120 | I | Add them to the plate and part lists. |
| 15 | Swatches and pills | `.kp-swatch` 50 %, `.kp-calendar__swatch` 0/4, `.kp-spec__swatch` 0, `.kp-datatable__sort-order` 999 px, vs colour picker swatch 0/10 | G6 | components.css defaults | C | One swatch shape: the part leaf. |
| 16 | Hover answers | calendar day: underline only; month title: grey wash with 5 px corners; tag remove: red disc; sortable `th`: none (Firefox screenshots) | G12 blaze | no rule in forest-register | I | Give these parts the blaze (keep tag remove round). |
| 17 | Press on rows | no press state (same as hover): side nav rows, combobox, palette and theme options, accordion heading, tree row, check, switch | G12 press closes the blaze | blaze rules only have `:hover` | C | Add the `:active` solid ring to the row family. |
| 18 | Focus ring, one channel | `.kp-kpi__link` and `a.kp-palette__option`: shadow only, no outline (both) | DI2 two channels | missing from the DI2 list, forest-register.css l.658-680 | I | Add both to that list. |
| 19 | Alarm backdrop | `ease-in` 1000 ms both ways | backdrops on the growth curve (F-25) | alarm backdrop animation in components.css | C | Use `kp-sig-forest-fade` as the dialog does. |
| 20 | Phone bar links opacity | 700 ms, height 1000 ms | one growth time | forest-register.css l.3652-3662 `time * 0.7` | C | Use the growth time. |
| 21 | Outline-style transition | 200 ms `ease` (discrete) on every pointable part | contact on the growth curve | forest-register.css ~l.1399 (no timing function) | C | Add `var(--fx-ease)`. |
| 22 | Progress bar head | transform 240 ms ease-out while the fill moves 200 ms on the growth curve | G4 | components.css l.5423-5427 | C | Set `--kp-progressbar-duration` and ease in forest. |
| 23 | Marquee | 48000 ms linear loop | loop 3200 | package default | C | Decide: exempt, or note it in CHARACTER. |
| 24 | Calendar busy pair | open 1000 ms, close 1820 ms, 119.9 % off | G10 | days re-grow staggered on ready (by decision) | C | Record as a decided exception. |
| 25 | CHARACTER note stale | the date picker, alarm, palette and theme list closes now measure as mirrors (4.6, 2.1, 0.5, 0.0 %); the note says they still need a script | n/a | themes/forest/CHARACTER.md l.413-417 | C | Update the note. |

Count: B 7, I 8, C 10.

Pairs that pass in both engines: dialog, drawer, palette, datepicker (4.6 / 5.2 %), alarm, side nav (over and push), side nav group, bar dropdown, accordion, toast, tooltip, phone bar (when idle). Combobox, theme menu and row-actions pass in Firefox; in Chromium the meter reports "no animation" because of the ghost copy (limitation, per-frame sampling is right).

## Not measured, and why
- Network graph (excluded). Progress bar and meter corners (excluded).
- Meter limitations: Chromium ghost popovers; script animations are sought to endTime minus 0.5 ms or the accordion false-fails at 102 % (Chromium still reads accordion 18.8 % and tree 45 % at the last frame; real-time sampling shows the accordion mirrors, t50 409/609 ms); phone bar and tooltip vary between runs under load.
- Wizard step, tabs panel and empty state are state changes, not open/close pairs: the meter's 99 to 109 % there is meaningless; they were read by frame sampling (rows 2 and 3).
- Colour picker, reorder drag, tour step walking, calendar pad days: nothing opens or the gesture cannot be scripted.
- Hover and focus use the first part of each signature: a selected tab or current page hides the unselected state (checked by screenshot, tab and pagination are fine). Native select press, hover on covered parts (skip link, dialog table wrap), alarm buttons' focus are unreliable.
- Not measured: RTL, 390 px (except the phone bar), reduced motion, contrast except pressed buttons, 150 ms ease-out keep-alive transitions in components.css l.4625 (invisible size-glide mechanism, not findings), the 1500 ms closed-dialog duration (a probe value, not played).
