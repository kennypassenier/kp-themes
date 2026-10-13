# Terminal: close = open reversed, and the theme's own effect on every part that opens

Changed: `css/terminal-register.css` only (plus the "Applied 2026-10-13" note at the end of
`themes/terminal/CHARACTER.md`). Firefox only. Pairs passing: **12 of 26 → 18 of 26** (`out/terminal/pairs.txt`);
identity: **every part OWN on open and close (14 of 14)**, where before the palette was FADE, the date picker,
combobox, mega menu and phone panel NONE, and the hover dropdown faded in and closed with NONE. The theme keeps its
clocks: one line 136 ms, a menu printed in four lines (544 ms, `steps(4, jump-end)`), a dialog in six (816 ms), the
cursor's leave 480 ms linear.

## Fixes

| # | Part | Cause | What changed (selector) | Before → after (pairs open/close, worst; identity) |
|---|------|-------|-------------------------|----------------------------------------------------|
| 1 | alert-close, upload-file, table-busy | the leave tokens were unset (lessons 19, 23, 24, 37) | root `[data-theme='terminal']` in the leave block: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close 0/952 ms 101.7 % → 816/816 ms 0.0 %; upload-file 952/0 101.5 % → 816/816 0.0 %; toast 952/952 0.5 % → 816/816 0.4 % |
| 1b | calendar busy layers | faded in by the package (34 ms) and vanished at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold }`; arrival `…busy:not([data-kp-leaving])` = the cursor's leave reversed (typed in, G2/G12) under second names `kp-sig-terminal-leave-in` / `-leave-2-in` with the cursor on `::after`; the leaving layers kept drawn (cyberpunk's rules, the foot keeps the register's room for the loading row) | 34/0 ms 97.1 % → 480/480 ms; typed in and deleted. Still fails (state change, below) |
| 1c | table-busy | the status line's spinner was typed in on its own and removed at once | `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-datatable__status > .kp-spinner { display: none }` (forest's, cyberpunk's) | 952/816 ms 80.8 % → 816/816 ms 16.3 % (below) |
| 2 | tree | the shutting group was `display: none` at once (lesson 26) | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 408/0 ms 85.8 % → 480/480 ms 0.1 % |
| 3 | tour | the card ran the package's 160 ms fade, the dim 350, the ring 250, the close 1000 ms | root: `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: calc(4 * var(--kp-sig-tm-line)); --kp-tour-dim-close-ease: linear(0 0%, 0.25 0.01%, …, 1 75.01%, 1 100%)` (the four steps the other way round, cyberpunk's construction); `.kp-tour[open]:not([data-kp-tour-stepping])` printed as a menu (`kp-sig-terminal-tm-menu`, cursor `::before`); `[data-kp-tour-target]` ring keyframe `kp-sig-terminal-tour-ring` (`backwards`) and transitions in `steps(4, jump-end)`; stepping moves in the same four steps | 350/1000 ms 29.3 % → 544/544 ms 0.5 %; identity OWN/OWN |
| 4a | combobox, date picker | no animation | the menu's print selector widened: `:is(.kp-popover[popover]:popover-open, .kp-menu-button > .kp-menu:not([hidden]), .kp-combobox__list:popover-open, .kp-datepicker__panel:is([data-kp-date-open], [data-kp-closing], [data-kp-reversing]):popover-open):not(.kp-tooltip)` and its `::before` cursor (base rule lists both); `.kp-combobox__list { --kp-open: own }` | combobox 0/0 100 % → 544/544 0.0 %; datepicker 0/0 101.1 % → 544/544 4.3 % (1.1 % left over, below); NONE → OWN |
| 4b | command palette (and shortcuts) | the package's bare fade | `:is(.kp-palette, .kp-shortcuts)` printed as the dialog (`kp-sig-terminal-tm-rows`, six lines, `--kp-sig-dur` 1.5 prints unopened, one open), the cursor `::after` (`kp-sig-terminal-tm-feed`), the dim `::backdrop` in the same steps (`tm-wash`) | 816/816 ms 0.0 % both; FADE → OWN |
| 5a | hover dropdown, mega menu | the dropdown faded in (package) and closed at once in Firefox; the mega menu had nothing | root `--kp-nav-close-time: 544ms` (0 ms reduced); open state prints (`kp-sig-terminal-tm-menu`, cursor on `::after` since a labelled dropdown's `::before` is its caption); `li[data-kp-nav-closing]` holds the dropdown and plays `kp-sig-terminal-tm-menu-back` / `-feed-back` `reverse forwards` (second names, lesson 8); the mega menu is held by a transition on `--kp-sig-tm-hold` (an `@property` at the top level of the file: Firefox does not register one inside a layer) | bar-equipment 0/0 100 % → 544/544 ms 0.2 %; desktop-dropdown FADE/NONE → OWN/OWN; desktop-mega NONE/NONE → OWN/OWN |
| 5b | phone bar | no motion at all | `@container kp-nav (max-width: 40rem)`: `.kp-nav[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` prints, `[data-kp-nav-closing]` clears it backwards, cursor on `::after`; nested lists reset | 0/0 100 % → 544/544 ms; gate's entry 0.0 % frames (meter limit below); NONE → OWN |
| 6 | sidenav | — | passes (220/220 ms 1.5 %) | unchanged |

## Deviations for Kenny

- **Tour card:** printed as a menu is (four lines, 544 ms, the cursor at the line being printed), not as the dialog's
  six; its dim and ring come and go in the same four steps.
- **Header dropdown, mega menu and phone panel:** printed in the menu's four lines and cleared backwards (G3 names
  "the header's menu"; the phone panel and the mega menu borrow the menu's print, whatever their number of rows).
- **Command palette and shortcuts sheet:** the dialog's six-line print, not the fade.
- **Combobox list and date picker panel:** the menu's four-line print.
- **Busy table:** the status line's small spinner is hidden while the busy layer stands (forest's and cyberpunk's
  rule): one loading picture.
- **Calendar busy layers:** typed in as the leave reversed instead of the package's fade.

## Still failing (Firefox)

- **datepicker**: worst 4.3 % (inside the tolerance) but "1.1 % left over" after the close, as before this work: the
  trigger's focus mark after Escape. Not the panel.
- **phone-bar** (two entries): the gate's entry reads 0.0 % but "92.5 % left over" because the all-themes meter never
  calls the entry's `release` (the held timer never fires); the second entry has no hold, so the real 544 ms timer
  removes the panel mid-measurement (95.6 %). Cyberpunk reads 104 % the same way.
- **calendar-busy 100 %**: the days' tones and the status line repaint at once when loading ends (forest 113 %,
  cyberpunk 95 %); the whole-month card also loses its words and shrinks while it leaves.
- **table-busy 16.3 %**: the rows' busy dimming and the status words flip at once (component state).
- **wizard-step, empty-state, tabs-panel**: state changes, not pairs (ignored by the brief).
- **Tab paint:** 41 stops, only the two allowed NOMARK.

Measured wall time of the measurement runs (Firefox): targeted pairs 91 s, table-busy 18 s (with synthwave),
calendar-busy 9 s, final full pairs 178 s, identity 85 s, tab-paint 75 s (41 stops, only the two allowed NOMARK). Total about 7 min 36 s.

## Round 2 (2026-10-13)

Measured with `KP_THEME=terminal node pairs-meter.mjs --theme terminal --engine firefox --only table-busy`.

### table-busy: 16.3 % (frame 7/20, open 816+336 ms against close 480 ms) → 6.9 %, open 480 ms = close 480 ms

- **Cause 1, the layer left its place.** `[data-theme='terminal'] [data-kp-leaving] { position: relative }` beats
  `.kp-datatable__busy-overlay { position: absolute }`: while arriving (marked `[data-kp-leaving]` while its leave
  plays backwards) and leaving, the layer fell into the flow below the table, and js/motion.js folded a space for it
  in six steps (the 816 ms script animation after a 336 ms wait, open only). Fix:
  `.kp-datatable__busy-overlay[data-kp-leaving] { position: absolute }`. The open is now the cursor's 480 ms, as the
  close.
- **Cause 2, the rows' dim** (0.55, `aria-busy`) came back at once on the close, under a layer still standing, while the
  open dims them in its first frame. Fix, in the theme's grammar (G1: one hard step, no fade): closing, the rows keep
  their dim until the cursor has deleted the layer and come back in one step (`transition: opacity 480ms steps(1,
  jump-end)`); opening, they dim at once (`transition: none`). The whole table's 0.7 dim is off in terminal
  (`--kp-busy-opacity: 1`).
- **What is left (6.9 %, a measured reason):** the status line's words. A cell-by-cell difference of the frames shows
  only one region differing, x 280-480 / y 600-680 (the status line), the same 7 % in all 21 frames: "Asking the pump
  houses…" stands under the open's every frame, "Showing 1-7 of 7" under the close's, because js/datatable.js writes
  the words in the first frame of each side. Terminal's layer is a transparent ground with a small bracketed panel,
  so the whole gesture changes only 0.27 % of the screen and that swap weighs 7 % against it (titanium's layer changes
  1.36 %, synthwave's 0.54 %: the same swap reads 4.2 % and 2.6 % there). Not a register matter: CSS cannot hold the
  old words, and hiding the live status line under the layer would take it from screen readers.

### Changed (css/terminal-register.css only)

- In the leave block: `.kp-datatable__busy-overlay[data-kp-leaving] { position: absolute }`; the stepped opacity
  transition on `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-table tbody` (none while `[aria-busy='true']`).

Full pairs after round 2: 20 of 25 (unchanged count; table-busy 16.3 → 6.9 %). Still failing besides table-busy:
calendar-busy 100 %, wizard-step, empty-state, tabs-panel, all as in round 1. No other pair moved.

Measured wall time of the round-2 runs (Firefox): targeted runs 2 x 15 s, final full pairs 165 s (2 min 45 s).
