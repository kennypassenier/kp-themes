# Blueprint: close = open reversed, and the trace on every part that opens

Changed: `css/blueprint-register.css` (only), the note "Applied 2026-10-13" at the end of `themes/blueprint/CHARACTER.md`.
Measured in Firefox only (`research/all-themes/_audit`). Before: `out/blueprint/pairs-before.txt`, `identity-before.txt`;
after: `out/blueprint/pairs.txt`, `identity.txt`, `tab-paint.txt`.

Result: **11 → 19 of 25 pairs pass**, **21 of 25** with the focus-return change in js/datepicker.js and js/sidenav.js that appeared in this worktree at 16:17 (not mine: the focus now goes back to the opener when the panel is gone, lesson 11); (the meter's list as of 16:05: the phone bar is one row now and holds the bar's close
timer; before, it was two rows, both failing, so the before run read 11 of 26); identity **3 → 14 of 14** parts open and close by the theme's own family
(`kp-sig-blueprint-*`, the dialog's scripted copy of it included). Tab stops: 41, NOMARK only "Review in a dialog" and
"Copy answer".

The theme's own motion, kept: the trace (`kp-sig-blueprint-trace` / `-trace-out`, 5 units = 800 ms, the plotter's feed,
inked at 75 %) for what opens (G3), the read-out (`kp-sig-blueprint-read`, 3 units = 480 ms) for a part that arrives or
leaves (G12 as applied 2026-10-08). No new effect was invented; every new rule borrows one of these two.

## Fixes

| # | Part | Cause | Change (selector) | Before | After |
|---|------|-------|-------------------|--------|-------|
| 1 | alert-close, upload-file, toast | lesson 19/23/24: leaves not asked of js/motion.js, fold of the old 1.25x/one-third timing | root block `[data-theme='blueprint']`: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close open 0 / close 760 ms, 108.5 %; upload-file 760 / 0 ms; toast 800 / 1267 ms, 102.6 % | all three ok, 0.0 % (480/480, 480/480, 800/800) |
| 1b | toast | `--kp-open: normal` on the toast (a comment from the old fold timing: "466 ms of nothing") made the open trace-only while the close also folded the space | `:is(.kp-combobox__list, .kp-toast) { --kp-open: normal }` narrowed to `.kp-combobox__list`: the toast now arrives as its leave played backwards (trace and space together) | 84.1 % after step 1 | ok 0.0 % |
| 2 | tree | lesson 26: the shutting group was `display: none` at once | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` (forest's two selectors) | open 0 / close 0 ms, 104.7 % | ok 480/480, 0.0 % |
| 3 | table-busy | (a) the read-out's `position: relative` for every arriving/leaving part took the absolute busy layer out of its place: it was read out under the table, folding space of its own (lesson 5); (b) the table's two dims (`[aria-busy]` 0.7 in css/layout.css, rows 0.55) switched in one frame while the layer is a transparent plate, so they were most of what the pair changes | `.kp-datatable > .kp-datatable__busy-overlay:is([data-kp-leaving],[data-kp-arriving]) { position: absolute }`; `:is(.kp-datatable[aria-busy='true'], … tbody)` and the leaving counterpart `.kp-datatable:not([aria-busy='true']):has(> .kp-datatable__busy-overlay[data-kp-leaving])` animate the dims on the feed in 480 ms (`kp-sig-blueprint-busy-dim` / `-dim-out`) | open 760 / close 0 ms, 268.7 % | ok 480/480, 4.3 % |
| 4 | calendar-busy | the busy layers came in by the package's 160 ms opacity fade and left at once | `:is(.kp-calendar__busy, .kp-calendar__day-busy) { --kp-calendar-busy-leave: hold }`; shown layers read out (`kp-sig-blueprint-read`, 480 ms) with the read's mask and pen; leaving layers `.kp-calendar > .kp-calendar__busy[data-kp-leaving]`, `.kp-calendar__day > .kp-calendar__day-busy[data-kp-leaving]` read back under a second name `kp-sig-blueprint-read-out` (the same keyframes: only flipping the finished arrival's direction showed its first frame at once), kept displayed and placed through the leave | open 160 / close 0 ms, 100 % | open 480 / close 480 ms, 100.4 % (see Still failing) |
| 5 | tour | the card opened by the package's `kp-tour-in` (160 ms fade); dim and ring 350/250 ms `ease` in, 1000 ms `ease-in` out | `.kp-tour[open]:not([data-kp-tour-stepping])` traced; root `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: var(--kp-sig-bp-panel); --kp-tour-dim-close-ease: var(--kp-sig-bp-feed)` (the feed is its own mirror); `[data-kp-tour-target]` ring keyframe `kp-sig-blueprint-tour-ring` + transitions on the panel time and feed, `backwards` (lesson 21); a stepped card plays nothing and keeps `position: fixed` under the read's update mark (`.kp-tour[data-kp-updating]`, lesson 5) | open 350 / close 1000 ms, 27.2 %; identity FADE (`kp-tour-in`) | ok 800/800, 0.7 %; identity OWN |
| 6 | palette | a bare fade (no `animation`) | `.kp-palette` traced like the dialog (`--kp-bp-ov: hidden`), its `::after` added to the pen's lists | ok 800/800 but FADE/FADE | ok 800/800, 0.1 %; OWN/OWN |
| 7 | datepicker (and dialog, drawer focus) | the trace hides the panel by `visibility: hidden` for 600 ms, so js/datepicker.js's focus on a day fell through: focus stayed on the opener, Escape never closed the panel (close 0 ms). The same hid the dialog's and the drawer's buttons from `showModal()`: focus went to `<body>` (probe: dialog and drawer `BODY` at 60 and 1060 ms) | `@property --kp-bp-ink` (top level, initial 1), written 0/1 by both trace keyframes at the ink (74.9 %/75 %); `:is(.kp-dialog:not(.kp-alarm), .kp-palette, .kp-datepicker__panel, .kp-tour, .kp-nav__menu, the phone bar's links) > * { visibility: visible; opacity: var(--kp-bp-ink) }`: the contents are focusable, painted only at the ink; the picture is unchanged | datepicker open 800 / close 0 ms, 100.2 %; focus BODY in dialog and drawer | datepicker 800/800, 7.0 % (see Still failing); focus lands on the dialog's button, the drawer's close, the day |
| 8 | bar-equipment (mega), hover dropdown | the mega menu had no animation either way; the hover dropdown faded in (160 ms) and closed at once in Firefox (lesson 36) | `.kp-nav__menu` open states (`li:is(:hover,:focus-within,[data-kp-nav-menu-open])`, the disclosure's `aria-expanded='true'`) traced; `li[data-kp-nav-closing]:not(...)` traced backwards and held `display: block`; `--kp-nav-close-time: 800ms` (no-preference; `0ms` under reduce); a registered `--kp-bp-hold` transition of 800 ms replaces the package's opacity fade and is what js/components.js waits for on the mega menu | bar-equipment open 0 / close 0 ms, 100 %; identity dropdown FADE/NONE, mega NONE/NONE | bar-equipment ok 800/800, 0.5 %; dropdown and mega OWN/OWN |
| 9 | phone-bar | no animation on the toggle's panel | in `@container kp-nav (max-width: 40rem)`: `.kp-nav:has(> .kp-nav__toggle)[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` traced, `[data-kp-nav-closing] > .kp-nav__links` traced backwards (`position: relative` for the pen, the list is static there); nested menus draw nothing | open 0 / close 0 ms, 100 %; NONE/NONE | ok 800/800, 0.0 % (meter of 16:05, which holds js/components.js's close timer; the meter before it read 82.9 %, the timer firing between its paused frames); OWN/OWN |
| 10 | sidenav | lesson 31 checked: no clip; the content slides out of the stage's frame whole. The package's backdrop fade is a literal 220 ms against blueprint's 160 ms panel, so the pair's frames were out of step | `.kp-sidenav__backdrop { animation-duration: 160ms }` (literal, for the flash check) | open 220 / close 220 ms, 25.0 % | 160/160, 6.3 % (see Still failing) |

Identity before → after (open/close): dialog OWN/OWN → OWN/OWN; drawer OWN/OWN → OWN/OWN; palette FADE/FADE → OWN/OWN;
alarm OWN/OWN → OWN/OWN; datepicker OWN/NONE → OWN/OWN; combobox, theme-menu, row-actions OWN/OWN → OWN/OWN;
tour FADE/FADE (`kp-tour-in`, counted OWN by the summary's property rule) → OWN/OWN (the trace); sidenav OWN/OWN (the
package's slide) → unchanged; desktop-dropdown FADE/NONE → OWN/OWN; desktop-mega NONE/NONE → OWN/OWN; phone-frame and
phone-390 NONE/NONE → OWN/OWN. The remaining "ASYM" marks only name `-trace` against `-trace-out` (the same keyframes under
a second name) and the `--kp-bp-hold` clock.

## Deviations for Kenny

- **Command palette:** traced like the dialog (5 units, inked at 75 %), closing as the drawing backwards. Borrows the dialog's
  rule (G3 lists the dialog, not the palette).
- **Tour card:** traced like the dialog; the page's dim grows out of the target and the ring is drawn in, both on the panel's
  800 ms and the feed, and go back the same way. Borrows the dialog's trace; the dim's growth is forest's mechanism on
  blueprint's time and curve.
- **Phone bar:** its list of links is traced as a panel (outline, then inked) and drawn backwards on close; the toggle itself
  is unchanged. Borrows the header's menu (G3 names "the header's menu"; the phone panel was not decided).
- **Calendar busy layers and the busy table's dims:** read out and back in 3 units like any part that arrives (G12 as
  applied); the dims run on the feed with the layer. Borrows the read-out.
- **Focus during a trace:** a traced panel's contents are now visible to focus (and painted only at the ink) instead of being
  hidden with the panel. Nothing changes on screen; the focus lands where js/*.js puts it. A deviation only in mechanism.

## Still failing

- **datepicker 7.0 % and sidenav 6.3 % in the full run:** both were the focus coming back to the opener at the close's first
  frame (js/datepicker.js, js/sidenav.js), while the open had no ring there. With the focus-return change that appeared in the
  worktree at 16:17 (shared JS, not mine) they pass: datepicker 800/800, 3.0 %; sidenav 160/160, 0.2 % (`--only` re-run, so `out/blueprint/pairs-firefox.json` holds those two rows; `pairs.txt` is the full run before the change).
- **calendar-busy 100.4 %:** as forest (95-113 %): the days change their tone at the state change in one frame, and
  js/calendar.js empties the whole-month card's words at the same moment, so the leaving card is smaller than the arriving one.
  Both are shared JS / state, not the layer's motion.
- **wizard-step, empty-state, tabs-panel:** state changes, not pairs (ignored per brief).
- **Not asked, noted:** the side navigation still slides (the package's translate on blueprint's feed), not traced; the
  dialog's and palette's backdrops still take js/motion.js's `ease-in` fallback (lesson 16) though they mirror.

Measured wall time (Firefox, blueprint): pairs-meter full 2 min 52 s (old meter) and 2 min 30 s (re-run on the meter of 16:05),
phone-bar alone 7 s, datepicker and sidenav re-run 12 s, identity 1 min 7 s, tab-paint 1 min 18 s: 8 min 6 s; plus the targeted `--only` runs and probes while
fixing, not each timed (the first two measured 6 s and 37 s).
