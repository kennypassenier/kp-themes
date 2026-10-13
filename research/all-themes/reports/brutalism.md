# Brutalism: close = open reversed, and the drop on every part that opens

Changed: `css/brutalism-register.css` (only), the note "Applied 2026-10-13" at the end of `themes/brutalism/CHARACTER.md`.
Measured in Firefox only (`research/all-themes/_audit`). Before: `out/brutalism/pairs-before.txt`, `identity-before.txt`;
after: `out/brutalism/pairs.txt`, `identity.txt`, `tab-paint.txt`.

Result: **10 → 20 of 25 pairs pass**, **21 of 25** with the focus-return change in js/datepicker.js and js/sidenav.js that
appeared in this worktree at 16:17 (not mine; lesson 11), (the after run is on the meter of 16:05, whose phone bar is one row holding the bar's
close timer; the before run had it as two failing rows and read 10 of 26). Identity (identity-summary) before: palette
FADE/FADE, datepicker and combobox NONE/NONE, desktop-dropdown FADE/NONE, desktop-mega, phone-frame, phone-390 NONE/NONE;
after: **all 14 parts OWN/OWN**. Tab stops: 41, NOMARK only "Review in a dialog" and "Copy answer".

The theme's own motion, kept as decided (G1-G4, G12): the **drop** onto the footprint (`kp-sig-brutalism-drop`, the fall
curve `cubic-bezier(0.6, 0, 0.9, 0.5)`, 3 units = 300 ms from 1.5 rem; the dialog's big slab 15 units = 1500 ms from 2.5 rem),
closing as the drop played backwards, which is the lift on `cubic-bezier(0.1, 0.5, 0.4, 1)`; a part without a slab is set
down and lifted off (`kp-sig-brutalism-leave`, 1 rem, gone in one cut at the top). Every new rule borrows one of these.

## Fixes

| # | Part | Cause | Change (selector) | Before | After |
|---|------|-------|-------------------|--------|-------|
| 1 | alert-close, upload-file, toast, table-busy | lessons 19/23/24 | signature root `[data-theme='brutalism']`: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close open 0 / close 475 ms, 103.5 %; upload-file 475 / 0; table-busy 375 / 0, 109.6 %; toast 475/475, 168.2 % | all ok at 300/300 (0.0 %; table-busy 3.8 %) |
| 2 | tree | lesson 26 | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | open 300 / close 0, 106.7 % | ok 300/300, 0.0 % |
| 3 | tour | the card dropped (300 ms) but the veil and ring came in 350/250 ms `ease` and went in 1000 ms `ease-in` | root `--kp-tour-dim-close: var(--kp-pixel), 0 0 0 0 var(--foreground)` (the veil shrinks into the target in solid ink, the pixel ring kept), `--kp-tour-dim-time: var(--kp-sig-br-time)`, `--kp-tour-dim-close-ease: var(--kp-sig-br-up)`; `[data-kp-tour-target]` arrives by `kp-sig-brutalism-tour-veil` (from the ring transparent and the veil at spread 0, solid ink) on the fall, `backwards`, with `transition: none` (a transition from no shadow faded the ink in and outranks the animation: first try read 65.9 %) | 350/1000 ms, 25.5 % | ok 300/300, 0.2 % |
| 4 | palette | bare fade (1500 ms, js/motion.js's) | `.kp-palette { --kp-sig-dur: var(--kp-sig-br-dialog); --kp-sig-br-h: var(--kp-sig-br-h-slab); --kp-sig-br-sh: var(--kp-sig-br-drop); animation: kp-sig-brutalism-drop … both }`; `.kp-palette::backdrop` holds like the dialog's (`kp-sig-brutalism-hold`, no fade, G1) | ok 1500/1500 but FADE/FADE | ok 1500/1500, 1.6 %; OWN/OWN |
| 5 | datepicker, combobox | no animation (the datepicker pair read only the opener's press, 97.2 %) | `:is(.kp-combobox__list:popover-open, .kp-datepicker__panel:is([data-kp-date-open], [data-kp-closing], [data-kp-reversing]):popover-open)` drop 300 ms from 1.5 rem (lesson 10) | datepicker 100/100, 97.2 %; combobox 0/0, 100 % | datepicker 300/300, 10.4 % (see Still failing); combobox ok 300/300, 0.0 % |
| 6 | bar-equipment (mega), hover dropdown | mega nothing; dropdown 100 ms fade in, nothing out (lesson 36) | `.kp-nav__menu` open states drop; `li[data-kp-nav-closing]:not(…) > .kp-nav__menu` held `display: block` and played back (`kp-sig-brutalism-drop-back`, reverse); `--kp-nav-close-time: 300ms` (`0ms` under reduce); registered `--kp-sig-br-hold` 300 ms transition for the mega menu's hold; the package's opacity fade replaced | 0/0, 100 %; FADE/NONE, NONE/NONE | ok 300/300, 0.0 %; OWN/OWN |
| 7 | phone-bar | nothing | `@container kp-nav (max-width: 40rem)`: the open list set down (`kp-sig-brutalism-leave-back` reversed, 1 rem), the closing list lifted off (`kp-sig-brutalism-leave`), nested menus none | 0/0, 100 % | ok 300/300, 0.0 %; OWN/OWN |
| 8 | calendar-busy | the layers came by the package's 100 ms fade; the whole month's card went at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold }`; the month card dropped as a slab (from 1.5 rem) and lifted with `kp-sig-brutalism-leave-slab` (`.kp-calendar--busy-whole > .kp-calendar__busy[data-kp-leaving]`, kept displayed and placed); a day's block set down (`-leave-back` reversed) and lifted (`.kp-calendar__day > .kp-calendar__day-busy[data-kp-leaving]`, kept placed) | open 100 / close 700 ms, 162.4 % | layers 300/300 each way; pair 300/700, 163.2 % (see Still failing) |
| 9 | sidenav | lesson 31 checked, no clip; the package's backdrop is a literal 220 ms against a 100 ms panel | `.kp-sidenav__backdrop { animation-duration: 100ms }` | 220/220, 7.7 % | ok 100/100, 0.7 % |

## Deviations for Kenny

- **Command palette:** the dialog's drop (the big slab, 1500 ms from 2.5 rem) and the dialog's backdrop that holds instead of
  fading. G3 names the dialog; the palette was not decided. If the palette should be a plate (300 ms from 1.5 rem), it is one
  value.
- **Combobox list, date picker panel, bar's dropdown and mega menu:** the popover's drop (G3 names the menu, the header's menu
  and the popover).
- **Phone bar's list:** set down and lifted off as a part (G12), since it carries no slab or shadow of its own; the toggle is
  unchanged.
- **Tour veil and ring:** the veil grows out of the target in solid ink and shrinks back into it, the ring's colour comes in and
  goes out over the same 300 ms. The ring's colour change is the one transition of colour here; G1 says nothing fades.
- **Calendar busy layers:** the month's card as a slab, a day's block as a part.

## Still failing

- **datepicker 10.4 % in the full run:** js/datepicker.js returned the focus to the opener at the close's first frame, so its
  yellow ring and tag stood in every close frame while the open had none. With the focus-return change that appeared in the
  worktree at 16:17 (shared JS, not mine) it passes: 300/300, 5.1 % (sidenav 100/100, 1.3 %); an `--only` re-run, so
  `out/brutalism/pairs-firefox.json` holds those two rows and `pairs.txt` is the full run before the change.
- **calendar-busy 163.2 %:** the busy layers now mirror (300/300 each way); the pair also contains brutalism's own day arrival
  when the tones come (the days dropped one row after another, 300 to 700 ms), which is a state change with no opposite, and
  js/calendar.js empties the month card's words at the state change. As forest (95-113 %), shared JS / state.
- **wizard-step, empty-state, tabs-panel:** state changes, not pairs (ignored per brief).
- **Noted, not changed:** the side navigation's backdrop is the package's opacity fade (now in the panel's 100 ms) and its panel
  slides in from the edge; G1 and G2 say nothing fades and nothing slides in from a side edge. Likewise the alarm's scripted
  entrance scales and fades (it mirrors, 0.6 %). Both are decisions for Kenny, not mechanism.

Measured wall time (Firefox, brutalism): targeted pairs runs 39 s, 43 s, 11 s, 11 s; full pairs-meter 2 min 14 s; identity
1 min 4 s; tab-paint 1 min 13 s; datepicker and sidenav re-run 11 s. Total 6 min 26 s.

## Review round 1 (2026-10-13)

**tour · "The page dim is too dark … it's just black"** (keep the no-fade grammar)
- Cause: the veil was `0 0 0 100vmax var(--foreground)`, solid ink (proposal-13), so only the target showed.
- Change: a flat ink veil `--kp-br-veil: hsl(from var(--foreground) h s l / 0.62)` on the theme root, used by the target's
  dim (`--kp-tour-dim: var(--kp-pixel), 0 0 0 100vmax var(--kp-br-veil)` on `[data-kp-tour-target]`, per the coordinator's
  shared change: a register's own box-shadow there now loses to kp.layout), by the arrival keyframe's `from` (spread 0)
  and by `--kp-tour-dim-close`. The weight never changes during the motion: the veil grows out of the target and shrinks
  back into it, no opacity ramp (G1).
- Evidence: stage screenshots, settled: the page, the calendar and the incidents card read through the veil; frames every
  40 ms show the veil growing from the target on open and shrinking into it on close (`scratchpad/r2/kb/sheet-br2.png`).
  Pair meter `tour`: ok 300/300 ms, 0.3 % (was 0.2 %).

**Deviation for Kenny:** G7/proposal-13 say "no transparency"; the veil is now translucent ink (62 %), which is Kenny's own
pick r2-br-highlight-1 (78 % ink veil) at a lighter weight so the page reads. Slabs stay untinted.

## Review round 2 (2026-10-13, Kenny's rejections)

Frames read in Firefox on `research/all-themes-applied/demo.html` (real clicks at coordinates, animations paused and
sought frame by frame, sheets looked at); numbers from `pairs-meter.mjs` and `identity.mjs`.

**sidenav · "Niet de open/close animatie van dit thema"**
- Cause: the panel slid in from its edge (100 ms translate), which G2 forbids; no drop.
- Change: dropped onto its footprint as G3 drops a plate: `[data-kp-sidenav-open='true']`
  `kp-sig-brutalism-sidenav-drop 300ms` on the fall curve (a `transform` from 1.5 rem up-left, plus the registered
  `--kp-sig-br-lift`, new top-level `@property`), `[...='false']` `kp-sig-brutalism-sidenav-drop-back reverse forwards`
  (lifted off). Each slab's hard shadow stays on the ground: the links' `box-shadow` offset is `3px + lift` (the current
  link `lift`). The panel stands in place (`translate 0s`; close `0s 300ms`), a pushed page likewise; a backdrop holds
  (`kp-sig-brutalism-hold`).
- Evidence: frames show the column held up-left over its black footprints, falling onto them and stopping dead; the close
  lifts it back off. Pairs: sidenav 300/300 ms 1.0 %, sidenav-push 0.0 %, sidenav-edge-push 0.0 %, -gutter 0.0 %, -over
  1.7 % (were 100/100 ms); sidenav-group 100/100, 0.0 %. Identity: `kp-sig-brutalism-sidenav-drop` / `-drop-back`.

**alarm · "Niet de open/close animatie van dit thema"**
- Cause: the package's opacity/scale/rise (1500 ms).
- Change: the stamp (`.kp-alarm__panel`, the red plate on its 10 px shadow) is dropped from 2.5 rem up-left with
  `kp-sig-brutalism-drop` (the dialog's slab drop, `--kp-sig-br-sh: 10px`), the screen stands at once (`.kp-alarm[open]
  { animation: none }`, `::backdrop` held as the dialog's); title and detail animations `none`. js/motion.js plays it in
  the dialog's 1500 ms and lifts it off backwards.
- Evidence: frames show the stamp falling onto its shadow, which stays on the ground, and lifted off on close. Identity:
  `script[boxShadow,translate]@div.kp-alarm__panel` + the backdrop's hold, the dialog's row (scripted copy). Pair
  1500/1500 ms, 0.8 %.

Tab paint: 41 stops, NOMARK only "Review in a dialog" and "Copy answer".

**Deviation for Kenny:** a panel at the window's edge, held 1.5 rem up-left, has its first frames partly beyond that
edge (the dialog keeps a margin for this; the side navigation cannot).

Measured wall time (Firefox, the four themes in parallel): pairs + identity 1 min 57 s, tab-paint 1 min 18 s.
