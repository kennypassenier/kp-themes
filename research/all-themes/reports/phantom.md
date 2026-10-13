# Phantom: close = open reversed, the throw on every part that opens (2026-10-13)

Changed: `css/phantom-register.css` only (one block at the foot of `kp.signature`, the tokens in the existing leave
block, one top-level `@property`), plus the "Applied 2026-10-13" note at the end of `themes/phantom/CHARACTER.md`.
Firefox only. Phantom's own motion and timing are kept: the throw `kp-sig-phantom-fly` (the shove
`cubic-bezier(0.81, 0, 0, 1)`, 400 ms) with the resolve `kp-sig-phantom-resolve` (three hard cuts, 300 ms) = 700 ms;
the close is that backwards or the leave pair (`-fly-out`, `-resolve-out`, the shove's inverse
`cubic-bezier(1, 0, 0.19, 1)`); contact 120 ms.

**Pairs: 8 of 26 → 18 of 26.** Identity: 10 of 14 parts open and close OWN → 14 of 14 (palette was FADE/FADE, combobox
NONE/NONE, the hover dropdown OWN/NONE, both phone bars NONE/NONE).

## Fixes

| # | Part | Cause | Change (selector) | Before → after |
|---|------|-------|-------------------|----------------|
| 1 | alert-close, upload-file, toast, table-busy, wizard/empty arrivals | mechanism tokens unset (lessons 19, 23, 24, 37): instant leaves and arrivals, folds 1.25× from a third in (1108 ms) | in the existing `@media (no-preference) [data-theme='phantom']` leave block: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close 0/1108 ms 106.7 % → 700/700 0.0 %; upload-file 1108/0 104.3 % → 700/700 0.0 %; toast 1108/1108 36.1 % → 700/700 0.0 % |
| 1b | table-busy | the status line's spinner arrived in turn (875 ms) and the table's busy dim (layout's `[aria-busy]` 0.7 and the rows' 0.55) switched at once | `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-datatable__status > .kp-spinner { display: none }` (cyberpunk's rule); `:is(.kp-datatable, … tbody)` opacity `300ms steps(3, jump-start)`, busy `300ms steps(3, jump-end) 400ms` (the dim falls in the resolve's three cuts, lifts in them reversed) | 875/0 ms 101.1 % → 700/700 ms 1.0 % |
| 1c | calendar-busy | the busy layers faded in 120 ms and left at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold }`, arrival fly + resolve, leave = the existing `[data-kp-leaving]` dissolve and snatch, the layers kept drawn while leaving (cyberpunk's display rules), landing level | both layers 700/700 ms by phantom's pair; the pair still reads 186.5 % (state, see Still failing) |
| 2 | tree | no rule kept a shutting group drawn (lesson 26) | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 0/0 ms 101.5 % → 700/700 ms 0.0 % |
| 3 | tour | dim and ring on the package's 350/250 ms ease in, 1000 ms ease-in out | `[data-theme='phantom'] { --kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: 400ms; --kp-tour-dim-close-ease: cubic-bezier(1, 0, 0.19, 1); --kp-tour-dim-close-delay: 300ms }`; `[data-kp-tour-target]` in 400 ms on the shove (transition + `kp-sig-phantom-tour-ring` from transparent, `backwards`). The dim comes with the card's throw and goes with its throw back, after the 300 ms dissolve | 700/1000 ms 42.2 % → 700/700 ms 0.5 % |
| 4a | palette | a dialog of its own class, it had only the package's fade | `.kp-palette { mask-size: 7px 7px; animation: kp-sig-phantom-fly 700ms, kp-sig-phantom-resolve 700ms backwards }` (the dialog's throw; js/motion.js plays it backwards) | identity FADE/FADE → OWN/OWN; pair 700/700 0.0 % both |
| 4b | date picker, combobox | no animation (NONE) | `:is(.kp-datepicker__panel, .kp-combobox__list)`: the menu's origin (`--kp-sig-ph-x0: -1.6rem` …, RTL mirrored), land 0deg, fly + resolve 700 ms; a list inside a dialog-like surface plays nothing | datepicker 0/0 100 % → 700/700 3.4 %; combobox 0/0 100 % → 700/700 0.0 %; identity NONE → OWN |
| 4c | date picker (found while fixing 4b) | the throw's first instant is `visibility: hidden`; the picker moves the focus onto a day at that instant, Firefox refuses it, the keyboard stayed outside and Escape never closed the panel | `.kp-datepicker__panel { visibility: visible !important }` (inside no-preference) | Escape closes again; the pair above |
| 5 | navbar: hover dropdown, mega menu, phone bar | the dropdown was thrown in but went at once (lesson 36), the mega menu went at once, the phone panel had nothing | `--kp-nav-close-time: 700ms` (0 ms under reduced motion); `.kp-nav__menu` transitions `--kp-sig-ph-hold` (new `@property`) 700 ms so the mega menu is held; open (cyberpunk's selector list) fly + resolve; the closing dropdown `display: block; opacity: 1` + fly-out + resolve-out; the closing mega menu fly-out + resolve-out; collapsed: `.kp-nav[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` fly + resolve from the menu's origin, landing level, `[data-kp-nav-closing]` fly-out + resolve-out, nested lists play nothing | bar-equipment 700/0 ms 100 % → 700/700 ms 1.3 %; phone-bar 0/0 → 700/700 (see Still failing); identity: dropdown close NONE → OWN, phone NONE → OWN |
| 6 | sidenav | not a clip (lesson 31): the backdrop ran the package's literal 220 ms against the panel's 120 ms | `.kp-sidenav__backdrop { animation: kp-sidenav-backdrop 120ms cubic-bezier(0.81, 0, 0, 1) both }` | 220/220 ms 71.8 % → 120/120 ms 3.7 % |

## Deviations for Kenny

- **Date picker panel and combobox list:** CHARACTER.md (G3) throws a menu from its button's edge; these two now take
  the menu's throw and resolve, but land level (0deg), as they stood, instead of a degree and a half askew. The date
  picker's panel shows its 25 % screen from the throw's first instant (it must take the focus), where G3 says a closed
  part is never drawn.
- **Palette:** the dialog's throw (from the board's start edge, -22deg, landing askew as the dialog does).
- **Navbar:** the hover dropdown and the mega menu already opened by the throw; their close is now the dissolve and
  snatch (G13's leave, the throw backwards). The phone bar's panel is thrown from the menu's origin and lands level
  (its layout stays as it was). Borrowed: G3 (menu) and G13.
- **Tour dim and ring:** they move with the card's throw (400 ms, the shove) and go with its throw back; the grammar
  does not decide the dim.
- **Busy table dim:** in the resolve's three hard cuts (no fade, G1), after the throw.
- **Calendar busy layers:** thrown in and snatched off (G13), landing level.
- **Side navigation backdrop:** the package's opacity fade, now on the panel's 120 ms shove. G1 says nothing fades;
  replacing the backdrop's fade with cuts is a design change, not mechanism, and is left for Kenny.
- **Alarm:** opens and closes by the package's scripted opacity/scale/translate (identity OWN, pair 0.0 %), not by the
  throw; the brief limits the alarm to a close that differs from its open, which it does not.

## Still failing

- **theme-menu 66.1 %, popover-row-actions 64.6 %:** the motion is the throw backwards, but the close plays on the
  ghost copy js/motion.js makes for a popover the browser hides (`closePopoverWithGhost`), placed at the popover's
  `getBoundingClientRect()`. Phantom's popovers stand rotated (`rotate: var(--kp-land)`, -1.5deg), so that rectangle is
  the rotated box's bounds and the ghost lands about 2 px up and left of the real menu: even the first close frame
  differs from the last open frame (5,863 changed pixels). A js/motion.js fix (place the ghost by the untransformed box,
  e.g. offsetLeft/offsetTop against its containing block, or copy the computed `inset`), outside this brief.
- **phone-bar (both rows, 88.9 % and 85.4 % at frame 0):** a meter artefact. js/components.js keeps the panel's space
  for `--kp-nav-close-time` in real time; the gate's row holds only timeouts between 400 and 600 ms, and phantom's is
  700, so in both rows the real timer ends while the paused frames are still being read and the last close frame shows
  the bar already shut. In real time the space is taken from the open's first frame to the close's last; the throw and
  its reverse are measured frame-equal (open-20 against close-00: 0 changed pixels).
- **calendar-busy 186.5 %:** the busy layers now mirror; the rest is the loading days' slash and day tones, a state
  change (fails likewise in forest).
- **wizard-step, empty-state, tabs-panel:** state changes, ignored per the brief.
- **Gates:** `gates/check-motion.mjs` reports `kp-sig-phantom-tour-ring` without a TIMINGS row and OUT_OF_SCOPE line,
  as it does for forest's and cyberpunk's tour rings; js/effects.js is outside this brief.

Tab paint (end): 41 stops, NOMARK only "Review in a dialog" and "Copy answer".

Measured wall time of the timed runs: pairs (all) 4 min 14 s, identity 1 min 28 s, tab-paint 1 min 14 s: 6 min 56 s;
about ten single-pair checks between fixes were not timed.

## Review round 2 (2026-10-13, Kenny's rejections)

Frames read in Firefox on `research/all-themes-applied/demo.html` (real mouse clicks at coordinates, each animation
paused and sought frame by frame, sheets looked at); numbers from `pairs-meter.mjs` and `identity.mjs`.

**sidenav · "Niet de open/close animatie van dit thema"**
- Cause: the panel slid in on the package's translate (120 ms); the throw and the screen were nowhere.
- Change: the over/push panel is thrown as phantom's drawer is (G3, G13): `.kp-sidenav:is([data-kp-sidenav-mode='over'],
  [data-kp-sidenav-mode='push'])[data-kp-sidenav-open='true']` travels on the shove (`translate 400ms cubic-bezier(0.81, 0,
  0, 1)`) as a screen of dots and resolves in three cuts (`kp-sig-phantom-resolve 700ms`); `[...='false']` dissolves
  (`kp-sig-phantom-resolve-out`) and is snatched back on the inverse after 300 ms (`translate 400ms cubic-bezier(1, 0,
  0.19, 1) 300ms`). The travel stays a transition, so js/sidenav.js moves a pushed page with the throw. A backdrop (where
  the package lays one) runs `kp-sig-phantom-sidenav-dim` (700 ms, dim in the shove's 400, held).
- Evidence: frames show the panel coming off the start edge as 25 % dots, landing, then 50 / 75 % / solid; the close is
  that backwards. Identity: `kp-sig-phantom-resolve` open, `-resolve-out` close. Pairs: sidenav, sidenav-push,
  sidenav-edge-push/-gutter/-over 700/700 ms, 0.0 % (were 120/120 ms); sidenav-group 120/120, 0.0 %.

**alarm · "Niet de open/close animatie van dit thema"**
- Cause: the package's opacity/scale/rise on the plate, panel, headline and reason, not the throw.
- Change: `.kp-alarm[open]` runs the dialog's pair `kp-sig-phantom-fly` + `kp-sig-phantom-resolve` (700 ms), posed as the
  full-size drawer (from the start edge, level: `--kp-sig-ph-x0: -100%`, r0 0, land 0; RTL mirrored); the panel, title
  and detail animations are `none`; `visibility: visible !important` while open so Acknowledge takes the focus at the
  throw's first instant (the 4c fault of round 1). js/motion.js keeps the entrance and closes it backwards.
- Evidence: frames show the whole alarm thrown in from the left as dots and resolving; the close dissolves and is
  snatched back. Identity: open `script[rotate,scale,translate,visibility]` + `script[maskImage]` on `dialog.kp-alarm`,
  exactly the dialog's row (the audit marks scripted copies FAIL by name, as it does the dialog). Pair 700/700 ms, 0.0 %.
  Focus: Acknowledge is focused 50 ms after the click; Enter closes the alarm.

**combobox · "Niet de open/close animatie van dit thema"**
- Cause: the list was given `--kp-sig-ph-land: 0deg` in round 1, so it landed level, not as phantom's menus (askew).
- Change: `.kp-combobox__list { --kp-sig-ph-land: var(--kp-land); rotate: var(--kp-land) }` (inside a dialog, popover or
  the palette: `rotate: none`); the date picker keeps its level landing (not rejected).
- Evidence: the last open frame shows the list cut paper standing -1.5 degrees, as the theme menu; pair 700/700 ms, 0.0 %.

**calendar · "Bij het laden ... staat de laadanimatie over het hele scherm ipv enkel in de tabel"**
- Cause (lesson 5 in reverse: a layer with no positioned parent): the loading picture's halftone block (`::before`) and
  red slash (`::after`) are `position: absolute; inset: 0`, but `.kp-calendar--busy-whole > .kp-calendar__busy` and
  `.kp-datatable__busy-panel` are static in the package, so both layers were laid against the nearest positioned
  ancestor: measured 1280 x 900 px, the whole window, for the month's card.
- Change: `position: relative` on `:is(.kp-datatable__busy-panel, .kp-calendar--busy-whole > .kp-calendar__busy)` (both
  are static flex/grid items, so nothing moves).
- Evidence: the card's `::before` is now 304 x 92 px (its own box), and the screenshot shows the block and slash only on
  the card. **Round 1's fault ("nothing visible below the phone bar and a red line constantly streaking") was the same
  cause in the table:** the busy panel's block and slash filled the whole busy layer, 954 x 280 px at 1280 px wide and
  312 x 343 px at 390 px wide (on a phone: the whole table under the bar hidden, the slash sweeping across it); now 213 x 96
  and 245 x 54 px, the panel only. Pairs: table-busy 700/700 ms, 3.3 % (ok); calendar-busy 700/700 ms, 176.7 % (was
  186.5 %; the day tones' state change, on the ignore list).

Tab paint: 41 stops, NOMARK only "Review in a dialog" and "Copy answer".

**Deviations for Kenny:** the alarm is thrown level from the start edge (the drawer's pose, a full-screen part cannot
land askew without showing the page at its corners); the side navigation's backdrop (off in the review demo) fades on the
throw's clock.

Measured wall time (Firefox, the four themes in parallel): pairs + identity 1 min 57 s, tab-paint 1 min 18 s.

## Review round 2, follow-up (coordinator, 2026-10-13): the combobox list's place

- **Cause:** js/top-layer.js `raiseInPlace()` measures the list where it is drawn the moment it opens and sets aside a
  move, not a turn or a scale. At that moment the list stands at the throw's first pose (-1.6 rem, -2.4 rem, -9 deg),
  so its layout box was placed 13.4 px left of the field, 16.0 px up (over the field's lower edge) and 245.7 px wide
  against the field's 219 px, for as long as it was open. (Without any motion, the resting -1.5 deg turn alone put it
  2.4 px left, 2.8 px up, 223.9 px wide.)
- **Change** (`css/phantom-register.css`): `.kp-combobox__list` runs `kp-sig-phantom-fly-placed`, the throw with one
  frame in front of it (0 to 0.01 %): unturned, unmoved, `visibility: hidden`, so the measurement reads the box where
  it lands; every visible frame is the throw's. Inside a dialog-like surface it still plays nothing.
- **Evidence:** layout box after opening: left 0.0, top 0.0 px from the field's bottom, width 219 px (= the field),
  landing at -1.5 deg. Pairs combobox 700/700 ms 0.0 % → 700/700 ms 0.0 % (now `kp-sig-phantom-fly-placed` +
  `kp-sig-phantom-resolve`); datepicker 1.4 %, unchanged (it is placed by offsets, not measured). Frames in the review
  stage: thrown in from the start edge, resolving, landing under the field; the close the same backwards. Tab paint:
  41 stops, only the two allowed NOMARK.
- **Gate:** `kp-sig-phantom-fly-placed` needs a TIMINGS row in js/effects.js.

## Review round 3, Kenny's rejection (2026-10-13 22:12)

**combobox:** "Niet de open/close animatie van dit thema, er is precies geen vlak achter de opties die tevoorschijn
komen, waardoor de achtergrond doorzichtig lijkt, is dit anders dan bij andere thema's?"

- **Cause (reproduced in the review dialog's stage):** the review dialog is itself a `.kp-dialog`, and phantom's register
  named `.kp-combobox__list` among the lists that are part of the surface they sit in
  (`:is(.kp-dialog, .kp-popover, …) :is(.kp-menu, .kp-combobox__list, .kp-theme-menu__list)`: ground `transparent`, no edge,
  no paperclip), plus two more rules for a list inside a dialog: `rotate: none` and `animation: none`. So inside any
  dialog, the stage included, the open list read `background-color: rgba(0, 0, 0, 0)`, `clip-path: none`, `border-left:
  0px`, `rotate: none`, `animation-name: none`: no plate (the page showed through the options), no throw, no resolve,
  level. Yes, it was different from the other themes and from phantom's own menus. On the plain page it was right,
  which is why the meter passed. A combobox list is never part of the surface that holds its field: it floats over it in
  the top layer (js/top-layer.js).
- **Change 1** (`css/phantom-register.css`): `.kp-combobox__list` taken out of the "list inside a surface is bare" rule,
  and the two dialog-only rules for it (`rotate: none`, `animation: none`) removed. Inside a dialog it now keeps the menu
  plate, the throw and resolve, and lands askew.
- **Change 2, placement:** the list is placed by measuring where it is drawn when it opens (`raiseInPlace()`, which sets
  aside only the list's own move). Phantom's dialog stands a degree and a half turned, so inside it the measured box was
  the larger box round the turned list: the raised list stood 2.4 px before its field, 1.2 px under it instead of the
  4 px margin, and 224 px wide against the field's 219. The placed throw's first, unseen frame now turns the list back by
  its surface's turn: `kp-sig-phantom-fly-placed` 0 % `rotate: calc(-1 * var(--kp-sig-ph-host-turn, 0deg))`, with
  `--kp-sig-ph-host-turn: var(--kp-land)` on `.kp-dialog` and `0deg` on `.kp-dialog.kp-drawer` (level).
- **Evidence:**
  - Stage, computed on the open list: before `rgba(0, 0, 0, 0)`, `clip-path: none`, `0px` edge, `rotate: none`,
    `animation: none`; after `rgb(33, 33, 33)`, the paperclip polygon, `4px solid rgb(255, 41, 59)`, `-1.5deg`,
    `kp-sig-phantom-fly-placed, kp-sig-phantom-resolve`. The catalogue's theme menu (`#cat-theme-menu`) reads the same
    four values: `rgb(33, 33, 33)`, the same polygon, `4px solid rgb(255, 41, 59)`, `-1.5deg`.
  - Placement measured along the field's own (turned) axes: in the stage, list top-start corner 0.0 px along and 4.0 px
    under the field's bottom-start corner (the 4 px margin), width 219 = the field, both at -1.5deg (before change 2:
    -2.4 / 1.2 px, 224 px). On the plain page (place4.mjs): left 0, top 0 from the field, 219 px = the field, -1.5deg:
    the earlier `kp-sig-phantom-fly-placed` fix holds.
  - Frames in the stage (real click on the field, ArrowDown, animations paused and sought at 0, 100, 250, 400, 450, 550,
    650, 699 ms; close by a real click beside the field): the list is thrown from up-left of the field at -9deg as a
    25 % dot screen, slaps down under the field, cuts to 50 %, 75 %, solid and stands on its grey plate with the red
    edge and the cut corner, a degree and a half askew, the page hidden behind it. The close is that backwards:
    dissolved in the three cuts, then snatched back up-left. Mirrored frames differ only at the field's focus ring
    (open 250 / close 450: 1,015 px of 151,200; open 699 / close 0: 991 px, the same ring).
  - Pairs: combobox 700/700 ms 0.0 % (now `kp-sig-phantom-fly-placed` + `kp-sig-phantom-resolve`), datepicker 1.4 %,
    dialog, drawer, palette 0.0 %. Full run 27 of 32, as before (failing: rail-tip, calendar-busy, wizard-step,
    empty-state, tabs-panel, each on the brief's known list). Identity: combobox OWN/OWN.
  - Tab paint: 41 stops, only "Review in a dialog" and "Copy answer" NOMARK.
- **Gate:** `--kp-sig-ph-host-turn` is a plain custom property (no `@property`); nothing new for js/effects.js.

Measured wall time of the round 3 phantom runs: pairs (5 pairs) 46 s, full identity 88 s, full pairs 280 s, tab paint
74 s (pairs and tab paint in parallel with dark's).
