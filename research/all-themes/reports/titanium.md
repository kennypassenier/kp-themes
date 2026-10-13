# Titanium: close = open reversed, and the theme's own effect on every part that opens

Changed: `css/titanium-register.css` only (plus the "Applied 2026-10-13" note at the end of
`themes/titanium/CHARACTER.md`). Firefox only. Pairs passing: **9 of 26 → 17 of 26** (`out/titanium/pairs.txt`);
identity: **every part OWN on open and close (14 of 14)**, where before the palette was FADE, the date picker,
combobox, theme menu, row-actions, mega menu and phone panel NONE, and the hover dropdown faded in and closed with
NONE. The theme keeps its values: the cut 240 ms (the dialog's `--kp-sig-dur`; js/motion.js plays a dialog at two
thirds, 160 ms), the leave 400 ms, the decided curve `cubic-bezier(0.2, 0.8, 0.2, 1)` (§0: eased, slowing as it
lands; the register already runs every one-shot motion on it).

## Fixes

| # | Part | Cause | What changed (selector) | Before → after (pairs open/close, worst; identity) |
|---|------|-------|-------------------------|----------------------------------------------------|
| 1 | alert-close, upload-file, table-busy | the leave tokens were unset (lessons 19, 23, 24, 37) | root `[data-theme='titanium']` in the leave block: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close 0/633 ms 101.5 % → 400/400 ms 0.0 %; upload-file 633/0 242.4 % → 400/400 0.0 %; toast 633/633 → 400/400 0.0 % |
| 1b | calendar busy layers | faded in by the package (60 ms) and vanished at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold }`; arrival `…busy:not([data-kp-leaving])` = the cool-away reversed under second names `kp-sig-titanium-leave-in` / `-leave-2-in` (the heat on `::after`); the leaving layers kept drawn (cyberpunk's rules) | 60/0 ms 100 % → 400/400 ms; still fails (state change, below) |
| 1c | table-busy | the status line's spinner arrived on its own and was removed at once | `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-datatable__status > .kp-spinner { display: none }` (forest's, cyberpunk's) | 633/0 ms 241.8 % → 400/400 ms; still fails (below) |
| 2 | tree | the shutting group was `display: none` at once (lesson 26) | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 192/192 ms 55.1 % → 192/192 ms 0.0 % |
| 3 | tour | the card ran the package's 160 ms fade, the dim 350, the ring 250, the close 1000 ms | root: `--kp-sig-ti-panel: 240ms; --kp-sig-ti-ease-back: cubic-bezier(0.8, 0, 0.8, 0.2)` (the theme curve turned round, 1 − f(1 − x)); `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: var(--kp-sig-ti-panel); --kp-tour-dim-close-ease: var(--kp-sig-ti-ease-back)`; `.kp-tour[open]:not([data-kp-tour-stepping])` cut open (`kp-sig-titanium-panel-cut`, cutter `::after`); `[data-kp-tour-target]` ring keyframe `kp-sig-titanium-tour-ring` (`backwards`) + transitions in 240 ms; stepping moves in 240 ms | 350/1000 ms 26.9 % → 240/240 ms 0.6 %; identity OWN/OWN |
| 4a | theme menu, row-actions, combobox, date picker | no animation at all | `:is(.kp-popover[popover]:popover-open, .kp-menu-button > .kp-menu:not([hidden]), .kp-combobox__list:popover-open, .kp-datepicker__panel:is([data-kp-date-open], [data-kp-closing], [data-kp-reversing]):popover-open):not(.kp-tooltip)` → `kp-sig-titanium-panel-cut` (the panel uncovered from its top edge down, `clip-path: inset(0 -3rem 100% -3rem)` → `inset(0 -3rem -3rem -3rem)`, room for the shadow) with the dialog's cutter line on `::after` (`kp-sig-titanium-ti-cutter`); `.kp-combobox__list { --kp-open: own }` | theme-menu, row-actions, combobox 0/0 100 % → 240/240 0.0 %; datepicker 0/0 100 % → 240/240 8.1 % (focus, below); NONE → OWN |
| 4b | command palette (and shortcuts) | the package's bare fade | `:is(.kp-palette, .kp-shortcuts)` the cut with the cutter at the dialog's `--kp-sig-dur: 240ms` (played at 160 ms by js/motion.js, closed backwards) | 160/160 ms 0.0 % both; FADE → OWN |
| 5a | hover dropdown, mega menu | the dropdown faded in (the register's opacity transition) and closed at once in Firefox; the mega menu had nothing | root `--kp-nav-close-time: 240ms` (0 ms reduced); open state cut open with the cutter on `::after` (a labelled dropdown's `::before` is its caption); `li[data-kp-nav-closing]` holds the dropdown and plays `kp-sig-titanium-panel-cut-back` / `-ti-cutter-back` `reverse forwards` (second names, lesson 8); the mega menu is held by a transition on `--kp-sig-ti-hold` (`@property` at the top of the file, outside the layers) | bar-equipment 0/0 100 % → 240/240 ms 0.2 %; desktop-dropdown FADE/NONE → OWN/OWN; desktop-mega NONE/NONE → OWN/OWN |
| 5b | phone bar | no motion at all | `@container kp-nav (max-width: 40rem)`: `.kp-nav[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` cut open, `[data-kp-nav-closing]` cut shut backwards, cutter on `::after`; nested lists reset | 0/0 100 % → 240/240 ms (meter limit below); NONE → OWN |
| 6 | sidenav | not lesson 31 (titanium clips nothing): the panel slid in the 60 ms contact band (`--fx-duration`) under the package's literal 220 ms backdrop, so frame t of the close was not frame T − t of the open | `.kp-sidenav { --kp-sidenav-duration: var(--kp-sig-ti-panel) }`, `.kp-sidenav__backdrop { animation-duration: var(--kp-sig-ti-panel) }` | 220/220 ms 52.3 % → 240/240 ms 7.0 % (focus, below); sidenav-push and sidenav-group 60 → 240 ms, still 0.0 % |

## Deviations for Kenny

- **Popovers, menu, combobox list, date picker panel:** G3's top-down cut is the dialog's; these borrow it at the
  cut's 240 ms, with the dialog's cutter line in the second oxide (`--chart-2`) running ahead of the cut. Popovers are
  square (no chamfer), so the cut is an `inset()` clip, not the dialog's chamfered polygon.
- **Header dropdown, mega menu and phone panel:** the same cut (G3: "Menus ... open by a clip-path cut from the
  top"); the dropdown no longer fades (the register's 60 ms opacity transition is replaced).
- **Command palette and shortcuts sheet:** the cut at the dialog's time, not the fade.
- **Tour card:** the cut with the cutter; the dim and ring on the same 240 ms, back on the curve turned round.
- **Side navigation:** slides in 240 ms (the cut band) instead of 60 ms (the contact band), its backdrop with it; the
  push mode and the group fold follow the same token (60 → 240 ms).
- **Busy table:** the status line's small spinner is hidden while the busy layer stands (forest's and cyberpunk's
  rule): one loading picture.
- **Calendar busy layers:** arrive as the cool-away reversed instead of the package's fade.

## Still failing (Firefox)

- **datepicker 8.1 %**, **sidenav 7.0 %**: the panel frames mirror; the difference is the focus mark moving (into the
  grid or the first link on the open, back to the opener on the close). js, not the register.
- **phone-bar** (two entries, 101.1 %): the nav script removes the panel after a real 240 ms timer; the gate's entry
  holds only timers of 400-600 ms (cyberpunk's), and the all-themes meter never calls `release`, so the timer fires in
  wall time while the meter takes its frames. Synthwave's and terminal's held entry reads 0.0 % with the same rules.
- **calendar-busy 101 %**: the days' tones and the status line repaint at once when loading ends (forest 113 %,
  cyberpunk 95 %); the whole-month card also loses its words and shrinks while it leaves.
- **table-busy 150 %**: the rows' busy dimming flips at once and the close starts a size glide whose decided machined
  edge (`[data-kp-resizing]`) shows on the close only.
- **wizard-step, empty-state, tabs-panel**: state changes, not pairs (ignored by the brief).
- **Tab paint:** 41 stops, only the two allowed NOMARK.

Measured wall time of the measurement runs (Firefox): scratch full pairs 164 s, final full pairs 166 s, identity 64 s,
tab-paint 73 s. Total about 7 min 47 s.

## Round 2 (2026-10-13)

Measured with `KP_THEME=titanium node pairs-meter.mjs --theme titanium --engine firefox --only <id>`; frames kept in a
private scratch folder (the shared `test-results/pairs/` was being overwritten by another theme's run mid-look).

### table-busy: 150.4 % (frame 19/20) → 4.2 % (pass)

- **Cause 1, the layer left its place.** `[data-theme='titanium'] [data-kp-leaving] { position: relative }` (the leave's
  own rule, for the heat's `::after`) beats `.kp-datatable__busy-overlay { position: absolute }` on specificity. While
  the layer arrived (it is marked `[data-kp-leaving]` while its leave plays backwards) and while it left, it dropped
  out of its place over the rows into the flow below the table, and js/motion.js folded a space for it (the third,
  cubic-bezier script animation in the old row). Fix: `.kp-datatable__busy-overlay[data-kp-leaving] { position:
  absolute }`. After it: 142 %, every frame 100-140 %.
- **Cause 2, the dims under the layer flipped at once.** Two dims stand while a table is busy: the whole table's
  (css/layout.css `[aria-busy='true'] { opacity: 0.7 }`) and its rows' (`--kp-datatable-busy-opacity` 0.55), and
  titanium's oxide bath on the rows. All three followed `aria-busy`, which the script sets and clears in one frame,
  so the open ran over dimmed, bathed rows and the close over plain ones. Fix: the bath (and its row stagger) now
  stays while the layer is there, leaving included (`.kp-datatable:has(> .kp-datatable__busy-overlay)`), and both
  dims transition in the layer's own fade: closing, 120 ms on the theme curve after 280 ms (the leave holds full
  until 70 %, then cools); opening, 120 ms from 0 on `--kp-sig-ti-ease-back` (the curve turned round). The table's
  transition keeps the package's resize character (outline-color, outline-offset, filter) beside the opacity.
- **What is left (4.2 %, under the bar):** the status line's words ("Asking the pump houses…" / "Showing 1-7 of 7")
  swap in the first frame on both sides; js/datatable.js writes them.

### phone-bar: 101.1 % (frame 10/20), unchanged: a meter limit, measured

- **Cause:** the register is right; the meter's hold is not. js/components.js removes `[data-kp-nav-closing]` after a
  real timer of `--kp-nav-close-time` (240 ms, the cut's time). `pairs.mjs` `holdNavTimers()` holds only timers of
  300-2000 ms, so titanium's 240 ms timer fires in wall time while the meter takes its paused frames: the close's
  frames 0-5 mirror the open exactly (0 %), from frame 6 on the panel is gone (101 %).
- **Proof:** the same meter with the hold floor at 200 ms (a private copy of `pairs.mjs`, nothing else changed):
  `phone-bar open 240 ms, close 240 ms, worst 0.0 %`, every one of the 21 frames 0 %.
- **Not changed in the register:** raising `--kp-nav-close-time` to 300 ms would only feed the meter, and hold an
  invisible (fully cut) panel's space 60 ms after the cut ends. The fix belongs to `pairs.mjs`: a floor of 200 ms, or
  holding the timer whose length is the theme's `--kp-nav-close-time`. Not edited (shared tooling, other themes are
  measured with it right now).

### Changed (css/titanium-register.css only)

- `[data-theme='titanium'] .kp-datatable__busy-overlay[data-kp-leaving] { position: absolute }` (in the leave block).
- New block before "One loading picture": the bath on `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-table tbody
  tr:not([data-kp-skeleton-row])`; the opacity transitions on that `.kp-datatable` and its `tbody`, with and without
  `[aria-busy='true']`.
- The rows' bath stagger (`tr:nth-child(2..4)`) now reads `.kp-datatable:is([aria-busy='true'], :has(> .kp-datatable__busy-overlay))`.

Full pairs after round 2: 20 of 25 (was 19). Still failing besides phone-bar: calendar-busy 101.4 %, wizard-step,
empty-state, tabs-panel, all as in round 1 and outside this round. No other pair moved.

Measured wall time of the round-2 runs (Firefox): targeted runs about 9 x 12 s, final full pairs 143 s (2 min 23 s).

## Review round 1 (2026-10-13)

**sidenav · "a splash of colour next to the bar, filling the parent element, looked a bit like the loading colours"**
- Cause: js/motion.js let the backdrop it found added arrive as titanium's leave played backwards
  (`[data-kp-leaving][data-kp-arriving]`): the leave's `::after` heat gradient (gold, violet, blue, `mix-blend-mode: color`)
  ran over the whole frame beside the panel for 400 ms, and the shade popped in at the end (opacity 0 until 190 ms, 1 at
  274 ms). The close used the package's shade fade backwards, so it was not the open reversed either.
- Change: `.kp-sidenav__backdrop:is([data-kp-leaving], [data-kp-arriving])` keeps `kp-sidenav-backdrop` on the panel's
  240 ms (the same animation as at rest, so js/motion.js finds no exit of its own and leaves it), `overflow: visible`, and
  its `::after` is `content: none`.
- Evidence: rAF trace in the stage: only `kp-sidenav-backdrop` 0 → 240 ms, opacity rising from the first frame, no
  `::after`; screenshot bursts on open and close show no colour (`scratchpad/r2/kb/sheet-ti4.png`, `sheet-ti5.png`; before:
  `sheet-ti2.png`, the gradient at 223-326 ms). Pair meter `sidenav`, `sidenav-push`, `sidenav-group`: ok 240/240 ms, 0.0 %.

## Review round 2 (2026-10-13, Kenny's rejections)

Frames read in Firefox on `research/all-themes-applied/demo.html` (real clicks at coordinates, animations paused and
sought frame by frame, sheets looked at); numbers from `pairs-meter.mjs` and `identity.mjs`.

**sidenav · "Niet de open/close animatie van dit thema"**
- Cause: the panel slid in (the package's translate on the 240 ms band), no cut.
- Change: the over/push panel is cut open as the dialog and the menus are (G3): `[data-kp-sidenav-open='true']`
  `kp-sig-titanium-panel-cut 240ms` on the theme curve with the cutter line in `--chart-2` on a new `::after`
  (`kp-sig-titanium-ti-cutter`); `[...='false']` `kp-sig-titanium-panel-cut-back` / `-ti-cutter-back` `reverse forwards`.
  It stands in place (`translate 0s` on open, `0s 240ms` on close), a pushed page moves with those frames.
- Evidence: frames show the panel uncovered from its top edge down behind the violet cutter line; the close cuts it shut
  upward. Pairs: sidenav, sidenav-push, sidenav-group, sidenav-edge-push/-gutter/-over 240/240 ms, 0.0 %. Identity:
  `kp-sig-titanium-panel-cut` + `-ti-cutter` open, the `-back` pair reversed on close.

**alarm · "Niet de open/close animatie van dit thema"**
- Cause: the package's opacity/scale/rise.
- Change: `.kp-alarm[open]` runs `kp-sig-titanium-panel-cut` (the palette's cut); the cutter line is
  `.kp-alarm__scan::after` (titanium does not sweep the scan): `inset: 0`, the 2 px `--chart-2` line, `kp-sig-titanium-ti-cutter`.
  Panel, title and detail animations `none`. js/motion.js plays it in the dialog's 160 ms and closes it backwards.
- Evidence: frames show the whole screen cut open from the top with the line running ahead; the close the reverse.
  Identity: `script[clipPath]@dialog.kp-alarm` + `script[opacity,transform]@div.kp-alarm__scan::after`, the palette's
  row (scripted copy). Pair 160/160 ms, 0.0 %.

Tab paint: 41 stops, NOMARK only "Review in a dialog" and "Copy answer".

**Deviation for Kenny:** G3 says a part that lives at an edge (drawer, toast) slides in from it; the side navigation no
longer slides, it is cut open in place as a dialog, per your verdict that the slide is not titanium's opening.

Measured wall time (Firefox, the four themes in parallel): pairs + identity 1 min 57 s, tab-paint 1 min 18 s.
