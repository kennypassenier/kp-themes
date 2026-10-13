# Solstice: close = open reversed, and the register's own entrance on every part that opens

Changed: `css/solstice-register.css` (only), the note "Applied 2026-10-13" at the end of `themes/solstice/CHARACTER.md`.
Measured in Firefox only (`research/all-themes/_audit`). Before: `out/solstice/pairs-before.txt`, `identity-before.txt`;
after: `out/solstice/pairs.txt`, `identity.txt`, `tab-paint.txt`.

Result: **11 → 21 of 25 pairs pass** (the meter's list as of 16:05: the phone bar is one row that holds the bar's close timer;
before, two failing rows, so the before run read 11 of 26); identity (identity-summary) before: palette FADE/FADE, datepicker NONE/NONE, combobox
NONE/NONE, desktop-dropdown FADE/NONE, desktop-mega, phone-frame, phone-390 NONE/NONE, tour the package's `kp-tour-in`;
after: **all 14 parts OWN/OWN**. Tab stops: 41, NOMARK only "Review in a dialog" and "Copy answer". Focus on opening:
dialog, drawer, palette and date picker take it (probe).

The theme's own motion, kept as the register has it: the popover's **rise** (`kp-sig-solstice-solstice-rise`, 640 ms,
`cubic-bezier(0.2, 0, 0, 1)`), the dialog's **dawn** (`kp-sig-solstice-solstice-dawn`, 560 ms, played by js/motion.js in its
close time, 373 ms), the leave's **morning mist** (`kp-sig-solstice-leave`, 540 ms `ease-in`, arrivals as it played
backwards). Every new rule borrows one of these.

## Fixes

| # | Part | Cause | Change (selector) | Before | After |
|---|------|-------|-------------------|--------|-------|
| 1 | alert-close, upload-file, toast | lessons 19/23/24 | root `[data-theme='solstice']`: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close open 0 / close 855 ms, 110.2 %; upload-file 855 / 0 ms; toast ok at 855/855 | all ok at 540/540, 0.0 % |
| 2 | tree | lesson 26 | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | open 448 / close 0 ms, 102.0 % | ok 448/448, 0.0 % |
| 3 | table-busy | after 1 the layer mirrored, but the table's two dims (`[aria-busy]` 0.7 in css/layout.css, rows 0.55) switched in one frame | `:is(.kp-datatable[aria-busy='true'], … tbody)` dim in 540 ms `ease-out` (`kp-sig-solstice-busy-dim`), `.kp-datatable:not([aria-busy='true']):has(> .kp-datatable__busy-overlay[data-kp-leaving])` (and its rows) back by the same frames reversed (`-busy-dim-back`, so the leave runs `ease-in`, the mist's curve) | open 675 / close 0 ms, 105.2 % | ok 540/540, 4.1 % |
| 4 | calendar-busy | layers came in by the package's 240 ms fade and went at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold; transition: none }`; shown layers arrive as the mist played backwards under a second name (`kp-sig-solstice-leave-back`, so the leave's `kp-sig-solstice-leave` restarts); leaving layers kept displayed and placed (cyberpunk's rules) | open 240 / close 0 ms, 100 % | 540/540, 98.7 % (see Still failing) |
| 5 | sidenav | lesson 31 checked, no clip; the package's backdrop is a literal 220 ms against the 240 ms panel | `.kp-sidenav__backdrop { animation-duration: 240ms }` | 240/240, 21.9 % | ok 240/240, 2.8 % |
| 6 | palette | bare fade | `.kp-palette { --kp-sig-dur: 560ms; animation: kp-sig-solstice-solstice-dawn … both }` (the dialog's own declaration) | ok 373/373 but FADE | ok 373/373, 0.0 %; OWN (opacity + transform) |
| 7 | tour | card `kp-tour-in` (160 ms); dim/ring 350/250 ms `ease` in, 1000 ms `ease-in` out | `.kp-tour[open]:not([data-kp-tour-stepping])` dawn 560 ms, stepping `animation: none`; root `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: 560ms; --kp-tour-dim-close-ease: cubic-bezier(1, 0, 0.8, 1)` (the dawn curve turned round); `[data-kp-tour-target]` ring keyframe + transitions on 560 ms `cubic-bezier(0.2, 0, 0, 1)`, `backwards` | 350/1000 ms, 28.8 % | ok 560/560, 0.6 % |
| 8 | datepicker, combobox | no animation either way | `:is(.kp-combobox__list:popover-open, .kp-datepicker__panel:is([data-kp-date-open], [data-kp-closing], [data-kp-reversing]):popover-open)` rise 640 ms (lesson 10: the name stays the same through the close) | both open 0 / close 0 ms, 100 % | datepicker ok 640/640, 3.5 %; combobox ok 640/640, 0.0 % |
| 9 | bar-equipment (mega), hover dropdown | mega nothing; dropdown 240 ms fade in, nothing out (lesson 36) | open states rise; `li[data-kp-nav-closing]:not(…) > .kp-nav__menu` held `display: block` and played back (`kp-sig-solstice-solstice-rise-back`, reverse); `--kp-nav-close-time: 640ms` (`0ms` under reduce); registered `--kp-sig-solstice-hold` 640 ms transition for the mega menu's hold | open 0 / close 0, 100 %; dropdown FADE/NONE, mega NONE/NONE | ok 640/640, 0.1 %; OWN/OWN |
| 10 | phone-bar | nothing | `@container kp-nav (max-width: 40rem)`: `[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` rise, `[data-kp-nav-closing] > .kp-nav__links` rise-back reversed; nested menus none | open 0 / close 0, 100 % | ok 640/640, 0.0 % on the meter of 16:05 (the meter before it read 87.5 %: js/components.js's close timer fired between its paused frames); OWN/OWN |

## Deviations for Kenny

- **The decided "kindled" dome (G3, 480 ms) is not in the register for any part.** The register's popovers rise (640 ms) and
  its dialog dawns (560 ms); `CHARACTER.md` says "Nothing here is applied yet" for the grammar's opening. Following the brief
  (keep the theme's own open motion and timing), I carried the register's rise and dawn to the parts that lacked one, not the
  dome. If the dome is wanted, it replaces rise and dawn everywhere in one go.
- **Command palette and tour card:** the dialog's dawn (G3 lists the dialog; the palette and tour were not decided). The tour's
  dim and ring take the dawn's time and curve.
- **Combobox list, date picker panel, bar's hover dropdown, mega menu, phone bar's list:** the popover's rise ("a menu and a
  popover rise into the light as the toast does", the register's G3 note). The phone bar's toggle is unchanged.
- **Calendar busy layers and the busy table's dims:** the morning mist's leave and its reverse (the register's arrival rule).

## Still failing

- **calendar-busy 98.7 %:** as forest (95-113 %): the days change their tone and js/calendar.js empties the whole-month card's
  words at the state change, in one frame. Shared JS / state.
- **wizard-step, empty-state, tabs-panel:** state changes, not pairs (ignored per brief).
- **Not asked, noted:** the dialog's, drawer's and palette's backdrops take js/motion.js's `ease-in` fallback (lesson 16), though
  they mirror.

Measured wall time (Firefox, solstice): targeted pairs runs 41 s, 19 s, 43 s, 7 s, 6 s; full pairs-meter 2 min 41 s (old meter)
and 2 min 21 s (re-run on the meter of 16:05); identity 1 min 6 s and 1 min 5 s; tab-paint 1 min 12 s. Re-run of datepicker and sidenav after the focus-return change in js/datepicker.js and js/sidenav.js
(16:17, not mine) 11 s: still ok (1.4 %, 0.0 %). Total 10 min 32 s.
