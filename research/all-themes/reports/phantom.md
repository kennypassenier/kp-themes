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
