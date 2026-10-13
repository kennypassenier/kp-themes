# Dark: close = open reversed, dark's own pass on every part that opens (2026-10-13)

Changed: `css/dark-register.css` only, plus the "Applied 2026-10-13" note at the end of `themes/dark/CHARACTER.md`.
Every number is Firefox (`pairs-meter.mjs`, `identity.mjs` + `identity-summary.mjs`, `tab-paint.mjs`). Dark's own motion
and timing are kept: the line passes at one pace (`linear`, 660 ms) laying the panel behind it, the film's turn settles
220 ms later (880 ms in all), the pass back to close; contact 220 ms.

**Pairs: 11 of 26 → 17 of 26.** Identity: 10 of 14 parts OWN on open and close → 14 of 14 (the desktop dropdown, the
mega menu, the phone frame and the phone at 390 px opened by the pass but closed with NONE before).
Focus (`tab-paint.mjs`): 41 stops, only "Review in a dialog" and "Copy answer" NOMARK, as allowed.

## Fixes

| # | Part | Cause | Change (selector) | Before → after (open/close, worst) |
|---|------|-------|-------------------|------------------------------------|
| 1 | alert-close, upload-file | mechanism tokens unset (lessons 19, 23, 24, 37) | `[data-theme='dark']` beside `--kp-open` (no-preference): `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close 0/1393 ms 106.6 % → 880/880 ms 0.0 %; upload-file 1393/0 ms 112.8 % → 880/880 ms 0.0 % |
| 1b | toast | the leave rule `[data-theme='dark'] [data-kp-leaving]` (0,2,0) lost to the entrance list, whose `dialog.kp-drawer` makes it (0,2,1): a leaving toast kept its entrance, so it had no leave of its own for js/motion.js to turn into its arrival (it arrived by CSS with no fold, and left with a fold); the leave also used the entrance's own keyframe names, which do not restart (lesson 10) | `[data-theme='dark'] [data-kp-leaving][data-kp-leaving]` (the attribute named twice) with `kp-sig-dark-sweep-back` / `kp-sig-dark-film-back` (the same frames under second names) and the line's `kp-sig-dark-pass-line-back` | 880/1393 ms 77.6 % → 880/880 ms 0.0 % |
| 1c | table-busy | the layer left at once; the rows' dim jumped | tokens above; `.kp-datatable .kp-table tbody` transition opacity 880 ms linear | 1393/0 ms 93.0 % → 880/880 ms 48.7 % (see Still failing) |
| 1d | calendar-busy | the busy layers faded in 220 ms (package) and left at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold; transition: none }`; arrival = the pass (`kp-sig-dark-sweep` + `kp-sig-dark-film`), leave = the `-back` pass reversed (1b); leaving layers kept drawn (cyberpunk's display rules) | 220/0 ms 100.0 % → 880/880 ms 95.5 % (see Still failing) |
| 2 | tree | no rule kept the shutting group drawn (lesson 26) | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 480/480 ms 51.5 % → 480/480 ms 0.0 % |
| 3 | tour | the card ran the package's 160 ms `kp-tour-in` fade; the dim and ring opened on 350/250 ms ease and closed on 1000 ms ease-in | `.kp-tour[open]:not([data-kp-tour-stepping])`: the dialog's pass (`kp-sig-dark-sweep` + `kp-sig-dark-film`, `::after` the line), `--kp-sig-dk-r` the halo's reach; root `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: var(--kp-sig-dk-time); --kp-tour-dim-close-ease: linear`; `[data-kp-tour-target]` transition box-shadow and outline-color 880 ms linear; ring from transparent by `kp-sig-dark-tour-ring` only round a live tour (`[data-theme='dark']:has(dialog.kp-tour[open])`) | 350/1000 ms 29.7 % → 880/880 ms 0.9 % |
| 4 | palette, date picker, combobox, menus, alarm | already dark's pass (OWN/OWN) | none | unchanged |
| 5 | navbar: hover dropdown, mega menu, phone bar's panel | the dropdown and mega menu were swept in but closed at once in Firefox: the closed style's `reverse` on the same keyframe names never restarts, and Firefox holds no `display`; the phone panel had no pass (only its nested list's line ran) | `--kp-nav-close-time: 880ms` on `.kp-nav` (0 ms under reduced motion); in `@container kp-nav (width > 40rem)`: `li[data-kp-nav-closing]:not(:hover, :focus-within, [data-kp-nav-menu-open]) > .kp-nav__menu:not(.kp-nav__menu--wide)` held `display: block` and given the `-back` pass reversed; `.kp-nav__menu--wide` held by a transition of `--kp-sig-dk-hold` (new `@property` at the top of the file) and its closing item given the `-back` pass; collapsed, `.kp-nav:has(> .kp-nav__toggle)[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` swept in with its `::after` line, `[data-kp-nav-closing] > .kp-nav__links` the pass back, the nested list not swept again | bar-equipment 880/0 ms 101.7 % → 880/880 ms 0.1 %; phone-bar 880/0 ms 100.9 % → 880/880 ms (frames 0.0 % with the timer held, see Still failing) |
| 6 | sidenav | not a clip and not the mechanism (lesson 31 checked): panel and backdrop are both 220 ms, settle to open and its inverse to close | none | 13.5 % → 13.5 % (see Still failing) |

## Deviations for Kenny

- **Tour card:** CHARACTER.md's G3 names the dialog, the menu and the tooltip, not the tour. The card is now swept in
  where it stands as the dialog is (it had the package's 160 ms fade) and taken off by the pass back. Borrowed: G3, the
  dialog.
- **Phone bar's panel:** the bar has no decided motion. The panel is now swept in under the bar from its start edge with
  the line crossing it, and taken off by the pass back; the dropdown and mega menu keep the pass they had and gain its
  close. Borrowed: G3, the menu.
- **Tour dim and ring:** they now take the card's 880 ms at the line's one pace instead of the package's 350/250 ms ease.
  Borrowed: G1/G4.
- **Calendar busy layers:** laid by the pass and taken off by the pass back (880 ms). Borrowed: G13.
- **Busy table rows:** their dim comes and goes over the layer's 880 ms, linear.

## Still failing

- **datepicker 8.1 %, sidenav 13.5 %:** the panels mirror; the remainder is the focus mark, which goes back to the opener
  (the calendar button, "Open the panel", with dark's brackets) at the first frame of the close while on the open it
  reaches the panel only at its end (js, lesson 11), not the register.
- **phone-bar, both rows (90.0 %, 98.4 %):** meter artefact of a time-based hold. The gate's row holds only 400-600 ms
  timers and the audit's row none, so the 880 ms timer in js/components.js runs out while the paused frames are read.
  With the timer held (a scratch copy of the meter, removed afterwards) the pair reads 880/880 ms, 0.0 %.
- **table-busy 48.7 %:** the layer, its line and the rows' dim now mirror; the remainder is the status line's words,
  which js swaps at once in both directions ("Asking the pump houses…" / "Showing 1–7 of 7"). Dark's dim of dark rows
  on a dark ground is a small change on screen, so the words weigh half of it. Hiding the status line's spinner (as in
  cyberpunk, deco and light) changed nothing here and was taken out again.
- **calendar-busy 95.5 %:** the busy layers now pair; the rest is the days' tones and counts changing at once, a state
  change (forest fails this pair too).
- **wizard-step, empty-state, tabs-panel:** state changes, ignored per the brief.
- **Gates (for the coordinator, js/* is outside this brief):** `gates/check-motion.mjs` asks TIMINGS rows (js/effects.js)
  for `kp-sig-dark-sweep-back`, `kp-sig-dark-film-back`, `kp-sig-dark-pass-line-back`, `kp-sig-dark-tour-ring`, and
  OUT_OF_SCOPE lines for `kp-sig-dark-sweep-back` and `kp-sig-dark-tour-ring` (the original `kp-sig-dark-sweep` is listed
  there already).

Measured wall time of the dark measurement runs: 7 min 29 s (pairs 169 s; partial pairs 80, 34 and 27 s; identity 66 s; tab-paint 73 s). One short partial run (table-busy) and the probes were not timed and are not in the sum.

## Round 2 (2026-10-13)

**table-busy: 880/880 ms, 48.7 % → 880/880 ms, 1.6 % (pass).**

- **Cause, measured from the frames:** the open's first frame (1 ms) against the close's last frame differed over the
  whole table, not only its status words: search field, header, rows and border were all dimmer. A probe at 1 ms read
  `div.kp-datatable` at `opacity: 0.7`. That is css/layout.css's `[aria-busy='true'] { opacity: var(--kp-busy-opacity, 0.7) }`
  on the whole data table, which flipped in one frame both ways. Round 1 only gave the rows' dim (`tbody`, the
  package's `--kp-datatable-busy-opacity`) the pass's time. Round 1's note that the status words weigh half the change
  was wrong: they are the 1.6 % that is left.
- **Change:** the existing rule `[data-theme='dark'] .kp-datatable .kp-table tbody { transition: opacity
  var(--kp-sig-dk-time) linear }` now also names `[data-theme='dark'] .kp-datatable`, so the whole table dims and
  comes back over the same 880 ms linear pass as its rows and its layer.
- **Remaining 1.6 %:** the status line's words ("Asking the pump houses…" / "Showing 1–7 of 7"), which js/datatable.js
  swaps in one frame in both directions. That is a mirror (they flip at the open's first frame and at the close's
  first frame), and it stays under the 6 % tolerance.
- Full dark run after the change: 21 of 25 pass (was 20). Still failing: calendar-busy 95.5 % (shared with forest),
  wizard-step, empty-state and tabs-panel (state changes, ignored per the brief).

Measured wall time of the round 2 dark runs: full pairs 146 s; the partial table-busy runs (2 × about 8 s) were not timed.

## Review round 2, Kenny's rejection (2026-10-13 20:37)

**alarm:** "Dat gaat niet open/close met de animatie van Dark".

- **Cause:** the alarm was not in dark's pass list. It ran the package's entrance (the plate faded in 240 ms, the panel
  rose 1.25 rem and scaled from 0.98, the headline shrank from 1.06, the reason faded in late), which js/motion.js
  kept and played forwards and backwards in the 587 ms close time: timed and mirrored (pairs 0.0 %, identity "OWN" by
  the script's name) but not dark's opening.
- **Change** (`css/dark-register.css`, new block at the foot of `kp.signature`): `.kp-alarm[open]:not([data-kp-alarm-motion='still'])`
  takes `kp-sig-dark-sweep` over its own box, the whole screen, with no halo reach (`--kp-sig-dk-r: 0px`); the line is
  `.kp-alarm__scan::after` (the plate's own `::after` is its breathing glow) running `kp-sig-dark-pass-line`; panel,
  headline and reason run nothing of their own. js/motion.js plays the pass forwards to open and backwards to close in
  the dialog's 587 ms. No film turn: the alarm draws no film edge. The catalogue's held-open frame
  (`[data-kp-alarm-inline]`) stays still.
- **Evidence:** pairs `alarm` 587/587 ms 0.0 % → 587/587 ms 0.0 %, now `kp-alarm` mask (the sweep) and
  `kp-alarm__scan::after` (the line) instead of opacity/scale/translate on four parts. Frames in the review stage at
  0, 100, 200, 300, 400, 500, 586 ms: the line crosses the screen left to right laying the red plate, frame and
  headline behind it; the close is the line crossing back right to left taking them off, ending on the page.
  Full dark run: 27 of 32 pass (the side-navigation edge rows included; nothing else moved). Tab paint: 41 stops, only
  "Review in a dialog" and "Copy answer" NOMARK.
- **Deviation for Kenny:** the alarm is swept as one screen-wide box (G3, "a dialog is swept from its start edge where
  it stands"); the alternative is to sweep only its card and let the red plate come with the backdrop's fade.

Measured wall time: alarm pair + identity 15 s; full pairs 182 s; identity 65 s; tab paint 72 s.

## Review round 3, Kenny's rejection (2026-10-13 22:12)

**sidenav:** "Niet de open/close animatie van dit thema".

- **Cause:** dark's register gave the over/push panel no motion of its own (round 1, fix 6, only checked the pair), so it
  slid in from its edge on the package's `translate` transition, 220 ms on `--fx-ease` (identity before:
  `transition:translate@nav.kp-sidenav 220ms`, PLAIN/PLAIN). Timed and mirrored, but a slide, not dark's pass.
- **Change** (`css/dark-register.css`, new block at the foot of `kp.signature`, under `prefers-reduced-motion:
  no-preference`): `[data-theme='dark'] .kp-sidenav:is([data-kp-sidenav-mode='over'], [data-kp-sidenav-mode='push'])`
  no longer slides (`translate: 0 0` in every state, `visibility: hidden` from the close's last frame). Open
  (`[data-kp-sidenav-open='true']`): the dialog's pass, `kp-sig-dark-sweep 880ms linear` with the line on its `::after`
  (`kp-sig-dark-pass-line`); close: the same frames under the second names, `kp-sig-dark-sweep-back` /
  `kp-sig-dark-pass-line-back`, `880ms linear reverse forwards`, so the line crosses back right to left taking the panel
  off. No halo reach (`--kp-sig-dk-r: 0px`, as the drawer) and no film turn (it draws no film edge, as the alarm). The
  push content and the edge tab travel with the line: the panel's `translate` timing, which js/sidenav.js copies onto
  them, is `880ms linear(0, 1 75%, 1)` to open and `880ms linear(0, 0 25%, 1)` to close (the 660 ms pass at one pace,
  held for the settle; the close its mirror). `.kp-sidenav__backdrop` (where a page keeps one): `kp-sidenav-backdrop
  880ms linear both`.
- **Evidence:**
  - Pairs (Firefox), all 8 of `--only sidenav,sidenav-push,sidenav-group,alarm,sidenav-edge-push,sidenav-edge-gutter,
    sidenav-edge-over,sidenav-edge-tab` pass: sidenav 880/880 ms 0.4 %, sidenav-push 0.0 %, sidenav-edge-push 0.0 %,
    -gutter 0.0 %, -over 0.0 %, -tab 0.1 % (all were 220/220 ms); sidenav-group 220/220 0.0 % (unchanged, the fold);
    alarm 587/587 0.0 % (unchanged). Full run: 27 of 32 (as before; the five failures are rail-tip, calendar-busy,
    wizard-step, empty-state, tabs-panel, each on the brief's known list).
  - Identity: `kp-sig-dark-sweep@nav.kp-sidenav 880ms` + `kp-sig-dark-pass-line@nav.kp-sidenav::after 880ms` on the open,
    `kp-sig-dark-sweep-back` + `kp-sig-dark-pass-line-back` reverse on the close: OWN/OWN (was PLAIN/PLAIN); the ASYM note
    is only the close's `visibility` flip at the end.
  - Frames in the review dialog's stage (`demo.html?review=open&next=…`, step "2 · The side navigation" in dark, real
    clicks on "Open the panel" and the panel's "Close", animations paused and sought at 0, 110, 220 … 879 ms): the
    spectral line enters at the panel's start edge and crosses it at one pace, the panel, its rows and its foot laid
    behind it; at 660 ms the line stops at the end edge and is gone. The close is the line coming back from the end
    edge and the panel going dark behind it; close frame 550 matches open frame 330 except the focus brackets (they sit
    on "Open the panel" while opening and on "Close" while closing). On research/sidenav-edge/push.html the page's
    edge travels with the line (at 220 ms the line and the page's edge both at about a third of the panel's width) and
    back in the close.
  - Tab paint: 41 stops, only "Review in a dialog" and "Copy answer" NOMARK.
- **Deviation for Kenny:** none new; the pass is the dialog's (G3) at the dialog's 880 ms. The push content moving with
  the line (instead of jumping when the pass ends) is borrowed from G2 ("the film is laid along the edge the line has
  passed").

Measured wall time of the round 3 dark runs: sidenav/alarm pairs 50 s, identity (sidenav, alarm) 10 s, full identity
65 s (twice: 130 s), full pairs 196 s, tab paint 72 s (pairs and tab paint in parallel with phantom's).
