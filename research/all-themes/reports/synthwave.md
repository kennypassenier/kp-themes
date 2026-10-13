# Synthwave: close = open reversed, and the theme's own effect on every part that opens

Changed: `css/synthwave-register.css` only (plus the "Applied 2026-10-13" note at the end of
`themes/synthwave/CHARACTER.md`). Firefox only. Pairs passing: **8 of 26 → 17 of 26** (`out/synthwave/pairs.txt`);
identity: **every part OWN on open and close (14 of 14)**, where before the palette was FADE, the date picker,
combobox and mega menu NONE, the theme menu and row-actions closed with NONE and the hover dropdown faded in and
closed with NONE. The theme keeps its own values: the beat (225 ms), the climb in two beats (450 ms), the leave and
arrival in four (900 ms), the sunrise curve `cubic-bezier(0.65, 0, 0.35, 1)`.

## Fixes

| # | Part | Cause | What changed (selector) | Before → after (pairs open/close, worst; identity) |
|---|------|-------|-------------------------|----------------------------------------------------|
| 1 | alert-close, upload-file, table-busy, toast | the leave tokens were unset (lessons 19, 23, 24, 37) | root `[data-theme='synthwave']` in the leave block: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close 0/1425 ms 100.5 % → 900/900 ms 0.0 %; upload-file 1425/0 ms 146.4 % → 900/900 ms 0.0 %; toast 1425/1425 → 900/900 ms 0.0 % |
| 1b | the same arrivals | a part that arrives as its leave reversed carries `[data-kp-arriving]` **and** `[data-kp-leaving]`; synthwave's size-change rule `[data-kp-arriving]:not(.kp-toast)` (0,3,0) outranked the leave (0,2,0), so js/motion.js read the row-rise as "the leave" and played it backwards: the alert vanished in the second half of its arrival (10.5 % off) | `[data-kp-arriving]:not(.kp-toast, [data-kp-leaving])` | alert-close 10.5 % → 0.0 %, upload-file 27.5 % → 0.0 % |
| 1c | calendar busy layers | the layers faded in by the package's opacity and vanished at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold }`; arrival `…busy:not([data-kp-leaving])` = the sunset reversed under second names `kp-sig-synthwave-sink-in` / `-sun-in` (lesson 8: the same name only re-times a finished animation, so the leave was instant); the leaving layers kept drawn (cyberpunk's rules) | 225/0 ms 100 % → 900/900 ms; the layers now set behind their horizon. Still fails (state change, below) |
| 1d | table-busy | the status line's spinner arrived on its own and was removed at once | `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-datatable__status > .kp-spinner { display: none }` (forest's, cyberpunk's) | 1425/150 ms 177 % → 900/900 ms; still fails (below) |
| 2 | tree | the shutting group was `display: none` at once (lesson 26) | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 0/450 ms 109.8 % → 450/450 ms 0.0 % |
| 3 | tour | the card ran the package's 160 ms fade, the dim 350 ms, the ring 250 ms, the close 1000 ms | root: `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: 450ms; --kp-tour-dim-close-ease: cubic-bezier(0.65, 0, 0.35, 1)` (the sunrise curve is its own reverse); `.kp-tour[open]:not([data-kp-tour-stepping])` climbs with the beam on `::after`; `[data-kp-tour-target]` ring keyframe `kp-sig-synthwave-tour-ring` (`backwards`) + transitions in two beats; stepping walks in two beats | 350/1000 ms 23.6 % → 450/450 ms 0.9 %; identity OWN/OWN |
| 4a | theme menu, row-actions popover | the popover closed by a transition with `display`/`overlay allow-discrete`; Firefox drops a popover from the top layer at once, and js/motion.js copies (ghosts) only a panel with a keyframe entrance | the transitions replaced by the dialog's keyframes: `:is(.kp-menu-button > .kp-menu, .kp-popover[popover]:not(.kp-tooltip), .kp-combobox__list:popover-open, .kp-datepicker__panel:is([data-kp-date-open], [data-kp-closing], [data-kp-reversing]):popover-open, .kp-tooltip)` → `kp-sig-synthwave-climb`, `::after` → `-beam` + `-glow`, two beats | theme-menu 450/0 ms 101.8 % → 450/450 ms 0.0 %; row-actions 450/0 108.4 % → 450/450 0.0 %; identity close NONE → OWN |
| 4b | combobox, date picker | no animation | same rule; `.kp-combobox__list { --kp-open: own }` | combobox 0/0 100 % → 450/450 0.0 %, NONE → OWN; datepicker 0/0 100 % → 450/450 7.1 % (focus, below), NONE → OWN |
| 4c | tooltip | no animation (G3 lists the tooltip among what rises) | same rule | 0/0 100 % → 450/450 ms 0.0 % |
| 4d | command palette (and shortcuts) | the package's bare fade | `:is(.kp-palette, .kp-shortcuts)` the dialog's climb (`--kp-sig-dur` three beats, `[open]` two) with the beam on `::after`; the `::after` base rule lists them | 450/450 ms 0.0 % both; FADE → OWN |
| 5a | hover dropdown, mega menu | the dropdown faded in (package) and closed at once in Firefox; the mega menu had nothing | root `--kp-nav-close-time: 450ms` (0 ms under reduced motion); `.kp-nav__menu` climbs by a transition on `clip-path` with the beam on `::after` (`.kp-nav__links > li > .kp-nav__menu::after`, which must outrank the shared `::after` rule), open state on the item's `:hover/:focus-within/[data-kp-nav-menu-open]` or the disclosure's `aria-expanded`, `@starting-style` for the open; `li[data-kp-nav-closing]` holds the dropdown drawn | bar-equipment 0/0 ms 100 % → 450/450 ms 0.1 %; desktop-dropdown FADE/NONE → OWN/OWN; desktop-mega NONE/NONE → OWN/OWN |
| 5b | phone bar | the page-load slide (`kp-bar-in`, 520 ms + 80 ms) replayed on the panel and replayed forwards on the close | `@container kp-nav (max-width: 40rem)`: `.kp-nav:has(> .kp-nav__toggle) > .kp-nav__links` `animation: none`, the climb by `clip-path` transition with the beam on `::after`; nested menus reset | 600/600 ms 96.7 % → 450/450 ms; gate's entry 0.0 % frames (meter limit below); identity OWN/OWN (now the climb) |
| 6 | sidenav | 13.6 % at frame 15/20 | not lesson 31: synthwave clips nothing; the frames differ by the focus mark (the open puts focus on the first link, the close gives it back to the opener) | unchanged, reported |

## Deviations for Kenny

- **Header dropdown, mega menu and phone panel:** they now climb behind the beam (the clip from the foot up, two
  beats) and set back behind it to close. G3 names "the header's menu"; the phone panel and the mega menu borrow the
  popover's climb. The phone panel no longer replays the bar's page-load slide (`kp-bar-in`); the desktop bar keeps
  it on load.
- **Command palette and shortcuts sheet:** the dialog's climb (three beats unopened, two played), not the fade.
- **Combobox list and date picker panel:** the popover's climb (two beats).
- **Tour card:** the dialog's climb with the beam; the dim and ring on the same two beats.
- **Busy table:** the status line's small spinner is hidden while the busy layer stands (forest's and cyberpunk's
  rule): one loading picture.
- **Calendar busy layers:** arrive as the sunset reversed (the toast's arrival) instead of the package's fade.

## Still failing (Firefox)

- **datepicker 7.1 %**, **sidenav 13.6 %**: the panel frames mirror; the difference is the focus mark moving (into
  the grid or the first link on the open, back to the opener on the close). js, not the register.
- **phone-bar** (two entries): the gate's entry reads 0.0 % but "92.5 % left over" because the all-themes meter never
  calls the entry's `release` (the held 450 ms timer never fires, so the panel stays open); the second entry has no
  hold, so the real timer removes the panel mid-measurement (101.4 %). Cyberpunk reads 104 % the same way.
- **calendar-busy 122 %**: the days' tones and the status line repaint at once when loading ends (forest 113 %,
  cyberpunk 95 %); the whole-month card also loses its words and shrinks while it leaves.
- **table-busy 49-141 % (varies run to run)**: the rows' busy dimming flips at once, and the close starts a size
  glide whose decided neon burn (`[data-kp-resizing]` drop-shadows) runs on the close only.
- **wizard-step, empty-state, tabs-panel**: state changes, not pairs (ignored by the brief).
- **Tab paint:** 41 stops, only the two allowed NOMARK.

Measured wall time of the measurement runs (Firefox): first full pairs 196 s, targeted reruns 11 + 56 + 17 + 9 + 17 +
18 s (with terminal), final full pairs 201 s, identity 89 s, tab-paint 75 s (41 stops, only "Review in a dialog" and "Copy answer" NOMARK; the slider keeps its mark, lesson 41). Total about 11 min 40 s.

## Round 2 (2026-10-13)

Measured with `KP_THEME=synthwave node pairs-meter.mjs --theme synthwave --engine firefox --only <id>`.

### table-busy: 115.1 % (frame 20/20) → 2.6 % (pass)

- **Cause 1, the layer left its place.** `[data-theme='synthwave'] [data-kp-leaving] { position: relative }` beats
  `.kp-datatable__busy-overlay { position: absolute }` on specificity: while the layer arrived (marked
  `[data-kp-leaving]` while its leave plays backwards) and left, it fell into the flow below the table and
  js/motion.js folded a space for it. That fold changed the table's height, and the size glide that followed marked
  the table `[data-kp-resizing]`: the package's resize character (filter, outline-offset, outline-color, 150 ms
  ease-out) is what ran on the close only. Fix: `.kp-datatable__busy-overlay[data-kp-leaving] { position: absolute }`;
  the filter and outline transitions are gone from the pair.
- **Cause 2, the dims under the layer flipped at once:** the whole table's 0.7 (css/layout.css, `aria-busy`) and the
  rows' 0.55. Fix: both transition in the layer's own four beats (900 ms) on the sun curve, both ways (the curve
  `cubic-bezier(0.65, 0, 0.35, 1)` is its own mirror image). The table keeps the package's resize transitions beside
  the opacity.
- **What is left (2.6 %):** the status line's words swap in the first frame on both sides (js/datatable.js).

### sidenav: 7.3 % (frame 1/20) → 0.0 % (pass)

- **Cause:** the panel slides in the theme's beat (`--fx-duration` 225 ms); the backdrop's dim is the package's literal
  220 ms. Mirrored frame for frame, the backdrop of the close stood 5 ms behind the open's (frame 1: 12 ms into the
  open's dim against 7 ms). `kp-sun-cut` no longer appears on the open in today's run (round 1's change).
- **Fix:** `[data-theme='synthwave'] .kp-sidenav__backdrop { animation-duration: var(--fx-duration) }` (reduced-motion
  no-preference block): the backdrop dims in the panel's beat. All 21 frames 0 %.

### Changed (css/synthwave-register.css only)

- In the leave block: the sidenav backdrop's duration; `.kp-datatable__busy-overlay[data-kp-leaving] { position:
  absolute }`; the opacity transitions on `.kp-datatable:has(> .kp-datatable__busy-overlay)` and its `tbody`.

Full pairs after round 2: 21 of 25 (was 19). Still failing: calendar-busy 122.1 %, wizard-step, empty-state,
tabs-panel, all as in round 1 and outside this round. No other pair moved.

Measured wall time of the round-2 runs (Firefox): targeted runs about 4 x 15 s, final full pairs 183 s (3 min 3 s).
