# Formal: close = open reversed, formal's own ruling on every part that opens (2026-10-13)

Changed: `css/formal-register.css` only, plus the "Applied 2026-10-13" note at the end of `themes/formal/CHARACTER.md`.
Every number is Firefox (`pairs-meter.mjs`, `identity.mjs` + `identity-summary.mjs`, `tab-paint.mjs`). Formal's own
motion and timing are kept: the rule ruled at an even pace (`linear`), 400 ms a rule, 60 ms between lines, the pen lifted
160 ms later, the dialog's 740 ms, a leave's 560 ms.

**Pairs: 11 of 26 → 19 of 26.** Identity: 9 of 14 parts OWN on open and close → 14 of 14 (palette FADE, alarm close
FADE, desktop dropdown FADE/NONE, mega menu, phone frame and phone at 390 px NONE before).
Focus (`tab-paint.mjs`): 41 stops, only "Review in a dialog" and "Copy answer" NOMARK, as allowed.

## Fixes

| # | Part | Cause | Change (selector) | Before → after (open/close, worst) |
|---|------|-------|-------------------|------------------------------------|
| 1 | alert-close, table-busy, upload-file, toast | mechanism tokens unset (lessons 19, 23, 24, 37) | `[data-theme='formal']` in the ruled-open block (`--kp-open` root, no-preference): `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close 0/887 ms 103.0 % → 560/560 ms 2.4 %; upload-file 887/0 ms 112.7 % → 560/560 ms 0.0 %; toast 887/887 ms 3.5 % → 560/560 ms 0.0 % |
| 1b | table-busy | the layer left at once; after the tokens the rows' dim (layout's and the package's `tbody` opacity) still jumped | tokens above; `.kp-datatable` (its resize transitions kept) and `.kp-datatable .kp-table tbody` transition `opacity 560ms linear` | 700/0 ms 100.1 % → 560/560 ms 5.2 % |
| 1c | calendar-busy | the busy layers faded in 180 ms (package) and left at once; first fix still left the month card at once, because its arrival and leave shared the name `kp-sig-formal-leave` and the leave took over the finished arrival (lesson 10) | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold; transition: none }`; arrival `kp-sig-formal-ruled-in` (the leave's frames under a second name) played backwards, the month card's loop kept beside it; leave = formal's `[data-kp-leaving]` ruling off; the leaving layers kept drawn (cyberpunk's display rules) | 180/0 ms 99.9 % → 560/560 ms 96.8 % (both layers now ruled in and off; see Still failing) |
| 2 | tree | no rule kept the shutting group drawn (lesson 26) | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 400/400 ms 48.0 % → 400/400 ms 0.1 % |
| 3 | tour | dim and ring opened on the package's 350/250 ms ease and closed on 1000 ms ease-in; the card's close turned only the card and its frame rule round, not its title, text and foot lines | root: `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: 740ms; --kp-tour-dim-close-ease: linear`; `[data-kp-tour-target]` transition box-shadow and outline-color `740ms linear`; ring drawn in from transparent by `kp-sig-formal-tour-ring` (`backwards`) only round a live tour (`[data-theme='formal']:has(dialog.kp-tour[open])`, so the catalogue's frozen example does not play it); `.kp-tour[data-kp-reversing='reset'|'play'] > *, > *::after` reset and reversed like the card | 740/1000 ms 48.6 % → 740/740 ms 1.1 % |
| 4a | palette | FADE: the package's scripted opacity | `dialog.kp-palette` added to the dialog's ruling lists (`:is(.kp-dialog, dialog.kp-drawer, .kp-tour, dialog.kp-palette)`: frame rule, lines, pens, 740 ms); backdrop `:is(.kp-dialog, .kp-palette, .kp-alarm:not([data-kp-alarm-motion='still']))::backdrop` ruled across | 740/740 ms 0.0 % FADE → 740/740 ms 0.0 % OWN |
| 4b | alarm | opened by transitions; js/motion.js keeps only CSS animations of a dialog, so the close fell back to its ease-in fade | the five transitions (ground, sheet, double rule, tick, reason) rewritten as keyframes over the dialog's 740 ms whose offsets carry the old waits (`kp-sig-formal-alarm-ground/-sheet/-double/-tick/-reason`), `@starting-style` removed; backdrop ruled (4a) | 740/740 ms 19.6 %, close FADE → 740/740 ms 0.0 %, OWN/OWN |
| 4c | date picker, combobox, menus, tooltip | already formal's ruling | none | OWN/OWN before and after |
| 5 | navbar: hover dropdown, mega menu, phone bar's panel | dropdown faded in 180 ms (package) and closed at once in Firefox (lesson 36); mega menu and phone panel had no animation | `.kp-nav:not([data-kp-nav-open], [data-kp-nav-closing]) .kp-nav__links > li > .kp-nav__menu` and `.kp-nav:has(> .kp-nav__toggle) > .kp-nav__links`: the menus' ruling (panel clip and frame pen, each entry ruled 60 ms after the one above) driven by `--kp-fm-t` in a `transition` (`@starting-style` 0 → 1), entries counted with `:has(> :nth-child(k))`; closing dropdown kept `display: block; opacity: 1` on `li[data-kp-nav-closing]`; `--kp-nav-close-time` per entry count (560 + 60 per entry, e.g. 680 ms for the demo's three-entry dropdown, 740 ms for the four-link phone panel; 0 ms under reduced motion); the mega menu is held by its own `--kp-fm-t` transition (settleClosing) | bar-equipment 0/0 ms 100 % → 680/680 ms 0.2 %; phone-bar 0/0 ms 100 % → 740/740 ms (frames 0.0 % with the timer held, see Still failing) |
| 6 | sidenav | not a clip (lesson 31): the backdrop ran the package's 220 ms while the panel slides in 180 ms | `.kp-sidenav__backdrop { animation-duration: var(--fx-duration) }` | 220/220 ms 7.5 % → 180/180 ms 1.0 % |

## Deviations for Kenny

- **Navbar (hover dropdown, mega menu, phone bar's panel):** CHARACTER.md decides no motion for the bar. It now opens
  the way formal's menus open (G3): the panel's frame rule is ruled start to end and each entry's line under it 60 ms
  after the one above (a mega menu's columns are its lines), the words revealed behind each rule; it closes as the rules
  taken off, bottom first. Borrowed: G3/G13 and the menu's ruling (`kp-sig-formal-ruling`, here carried by a transition
  of the same number).
- **Palette:** ruled in as the dialog is (frame rule, its input, its list, its status line). Borrowed: G3, the dialog.
- **Tour dim and ring:** they now take the card's 740 ms at the even pace instead of the package's 350/250 ms ease.
  Borrowed: G1 and the card's own time.
- **Calendar busy layers:** ruled in and off like any arrival and leave (560 ms). Borrowed: G13.
- **Busy table rows:** their dim comes and goes over the layer's 560 ms, linear. Borrowed: the layer's time.
- **Alarm:** its motion is unchanged frame for frame, but it now lasts the dialog's 740 ms: the last 160 ms hold the
  finished notice (js/motion.js plays every kept entrance in the theme's one dialog time). The close therefore starts
  with 160 ms in which nothing moves, then the rulings come off.
- **Side navigation backdrop:** 180 ms (the panel's contact time) instead of the package's 220 ms.

## Still failing

- **datepicker 6.2 %** (tolerance 6 %): the panel mirrors; the remainder is the focus ring, which goes back to the
  calendar button at the first frame of the close while on the open it reaches day 9 only at its end (js, lesson 11).
- **phone-bar, both rows (94.6 %, 91.6 %):** meter artefact of a time-based hold. The gate's row holds only 400-600 ms
  timers and the audit's row none, so the 740 ms timer in js/components.js runs out while the paused frames are read and
  the panel is gone from mid-close on. With the timer held (a scratch copy of the meter, removed afterwards) the pair
  reads 740/740 ms, 0.0 %.
- **calendar-busy 96.8 %:** both busy layers now mirror; the rest is the days' tones and counts changing at once, a state
  change (fails the same way in forest).
- **wizard-step, empty-state, tabs-panel:** state changes, ignored per the brief.
- **Gates (for the coordinator, js/* is outside this brief):** `gates/check-motion.mjs` asks TIMINGS rows (js/effects.js)
  for `kp-sig-formal-alarm-ground/-sheet/-double/-tick/-reason`, `kp-sig-formal-tour-ring`, `kp-sig-formal-ruled-in`, and an
  OUT_OF_SCOPE line for `kp-sig-formal-tour-ring`, as it does for forest's and cyberpunk's tour rings.

Measured wall time of the formal measurement runs: 10 min 14 s (pairs 189 s and 199 s; partial pairs 56, 14 and 15 s; identity 67 s; tab-paint 74 s). Three short partial runs (datepicker/table-busy, table-busy/calendar-busy, calendar-busy) and the probes were not timed and are not in the sum.

## Round 2 (2026-10-13)

**tooltip: 560/560 ms, 0.0 %, 3.6 % left over → the same pair passes 15 of 16 runs, and the remainder is not formal.**

- **What stays on screen, measured from the frames:** not the tooltip under test. The live tooltip ("Recalibrate
  (live)") is gone in the after picture. What differs is the catalogue's two *frozen* tooltip examples above it
  ("Takes about two minutes", "Closes the valve…", `data-kp-tooltip-owner="catalogue"`, placed by CSS anchor
  positioning). In formal 36 pixels on their top rule moved by one pixel. In forest (25.5 % and 32.3 %) the text of
  both frozen tooltips is re-rastered about a pixel off. In grotesk the top edge of both moved by one pixel row.
- **Why:** the frozen examples have no animation and never move. A probe read their boxes before the open, while it was
  open and after the close as identical to 0.001 px (formal `y = 237.767`, forest `y = 240.167`: fractional). In a
  failing run their raster flips at the open's first frame and keeps that state through the close. A passing run of
  the same theme has the other raster in every frame. Firefox paints these fractionally placed parts on a different
  pixel row once the top layer changes. The meter compares the whole page, so a frozen part reads as "left over".
  It is intermittent: formal 1 of 10 runs alone, 0 of 6 more; forest 2 of 11; grotesk 2 of 6. A plain probe
  (focus, Escape, wait, no paused frames) never showed it.
- **Change:** none. It is not formal's tooltip and not a register rule. A fix belongs to the page or the meter: for
  example, whole-pixel placement of the catalogue's frozen tooltip stage, or a meter that compares only the pair's
  region on that page.
- **forest (approved and frozen, not changed):** the same cause and the same parts. forest's larger number only
  reflects that its frozen tooltips are filled green plates with white text, so a one-pixel re-raster changes more
  pixels. The cause is shared by formal, forest and grotesk.
- Full formal run (register unchanged since round 1): 21 of 25 pass; tooltip passed. Still failing: calendar-busy
  96.8 % (shared with forest), wizard-step, empty-state and tabs-panel (ignored per the brief).

Measured wall time of the round 2 formal runs: full pairs 168 s; the tooltip repeats (formal 10, forest 11, about 7 s each) were not timed.
