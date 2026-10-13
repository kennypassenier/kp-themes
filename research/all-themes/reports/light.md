# Light: close = open reversed, light's own exposure on every part that opens (2026-10-13)

Changed: `css/light-register.css` only, plus the "Applied 2026-10-13" note at the end of `themes/light/CHARACTER.md`.
Every number is Firefox (`pairs-meter.mjs`, `identity.mjs` + `identity-summary.mjs`, `tab-paint.mjs`). Light's own
motion and timing are kept: the exposure (brightness 1.6 and blur 5 px down to the crisp picture, opacity with it), 700 ms
on the settle `cubic-bezier(0.16, 1, 0.3, 1)`, the leave on its inverse `cubic-bezier(0.7, 0, 0.84, 0)`, contact 200 ms.

**Pairs: 10 of 26 → 19 of 26.** Identity: 8 of 14 parts OWN on open and close → 14 of 14 (palette FADE, date picker and
combobox NONE, desktop dropdown FADE/NONE, mega menu, phone frame and phone at 390 px NONE before).
Focus (`tab-paint.mjs`): 41 stops, only "Review in a dialog" and "Copy answer" NOMARK, as allowed.

## Fixes

| # | Part | Cause | Change (selector) | Before → after (open/close, worst) |
|---|------|-------|-------------------|------------------------------------|
| 1 | alert-close, upload-file, toast | mechanism tokens unset (lessons 19, 23, 24, 37); the fold also ran on the settle while the part left on the inverse curve, so the space closed before the part had gone | `[data-theme='light']` beside `--kp-open` (no-preference): `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0; --kp-leave-fold-ease: var(--kp-sig-light-ease-out)` | alert-close 0/1108 ms 105.1 % → 700/700 ms 0.0 %; upload-file 1108/0 ms 125.3 % → 700/700 ms 0.0 %; toast 1108/1108 ms 50.2 % → 700/700 ms 0.0 % |
| 1b | table-busy | the layer left at once; the rows' dim (package `tbody` opacity) jumped; the status line's own spinner arrived in turn beside the layer (lesson 23) | tokens above; `.kp-datatable .kp-table tbody` transition opacity 700 ms on the inverse, `[aria-busy='true']` on the settle; `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-datatable__status > .kp-spinner { display: none }` (cyberpunk's and deco's rule) | 875/0 ms 100.0 % → 700/700 ms 5.9 % |
| 1c | calendar-busy | the busy layers faded in 200 ms (package) and left at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold; transition: none }`; arrival `kp-sig-light-expose` 700 ms; leave = light's `[data-kp-leaving]` (`kp-sig-light-leave`, a second name, so it restarts); leaving layers kept drawn (cyberpunk's display rules) | 200/1930 ms 123.3 % → 700/1930 ms 128.3 % (layers now pair; see Still failing) |
| 2 | tree | no rule kept the shutting group drawn (lesson 26) | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 700/0 ms 92.4 % → 700/700 ms 0.0 % |
| 3 | tour | dim and ring opened on the package's 350/250 ms ease, closed on 1000 ms ease-in | root: `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: var(--kp-sig-light-time); --kp-tour-dim-close-ease: var(--kp-sig-light-ease-out)`; `[data-kp-tour-target]` transition box-shadow and outline-color 700 ms on the settle; ring from transparent by `kp-sig-light-tour-ring` (`backwards`) only round a live tour (`[data-theme='light']:has(dialog.kp-tour[open])`) | 700/1000 ms 49.9 % → 700/700 ms 2.8 % |
| 4 | palette, date picker, combobox | palette FADE (the package's scripted opacity); date picker panel and combobox list NONE | `:is(dialog.kp-palette, .kp-combobox__list, .kp-datepicker__panel) { animation: kp-sig-light-expose 700ms settle backwards }`; js/motion.js keeps the palette's entrance and plays it backwards, playClose() turns the two panels round | palette 700/700 ms 1.1 % FADE → OWN; combobox 0/0 ms 100 % → 700/700 ms 0.0 %; datepicker 200/200 ms 99.9 % → 700/700 ms 8.8 % (see Still failing) |
| 5 | navbar: hover dropdown, mega menu, phone bar's panel | dropdown faded in the package's 200 ms and closed at once in Firefox (lesson 36); mega menu and phone panel had no animation | `.kp-nav:not([data-kp-nav-open], [data-kp-nav-closing]) .kp-nav__links > li > .kp-nav__menu` and `.kp-nav:has(> .kp-nav__toggle) > .kp-nav__links`: closed = opacity 0 + `--kp-sig-light-glare`, open = 1 + none, as transitions (700 ms, settle to open, inverse to close; `@starting-style` for the first frame); closing dropdown kept `display: block`; `--kp-nav-close-time: 700ms` (0 ms under reduced motion); the mega menu held by its own transitions (settleClosing); wide, the phone bar's links stand still | bar-equipment 0/0 ms 100 % → 700/700 ms 0.3 %; phone-bar 0/0 ms 100 % → 700/700 ms (frames 0.0 % with the timer held, see Still failing) |
| 6 | sidenav | not a clip (lesson 31): the backdrop ran the package's 220 ms while the panel slides in 200 ms | `.kp-sidenav__backdrop { animation-duration: var(--fx-duration) }` | 220/220 ms 7.3 % → 200/200 ms 1.1 % |

## Deviations for Kenny

- **Navbar (hover dropdown, mega menu, phone bar's panel):** CHARACTER.md decides no motion for the bar. It now comes into
  focus out of the glare under the bar as light's menus do (G3: brightness, blur and opacity together, 700 ms on the
  settle) and goes back into the glare to close. Borrowed: G3/G13 and `kp-sig-light-expose`.
- **Date picker panel, combobox list:** exposed as a menu under its button. Borrowed: G3, the menu/popover entrance.
- **Palette:** exposed as the dialog. Borrowed: G3, the dialog.
- **Tour dim and ring:** they now take the card's 700 ms on the settle (back on the inverse) instead of the package's
  350/250 ms ease. Borrowed: G1 and the card's own exposure.
- **Calendar busy layers:** they come out of the glare and go back into it (700 ms). Borrowed: G13.
- **Busy table:** the rows' dim comes and goes over the layer's 700 ms; the status line's small spinner stands down while
  the layer shows (one loading picture, as in cyberpunk and deco).
- **Leave fold curve:** a leaving part's space now folds on the leave's inverse curve rather than on the settle, so the
  space and the part go together (`--kp-leave-fold-ease`); the arrival is that backwards, on the settle.
- **Side navigation backdrop:** 200 ms (the panel's contact time) instead of the package's 220 ms.

## Still failing

- **datepicker 8.8 %:** the panel mirrors; the remainder is the focus ring (and the button's pressed look), which goes
  back to the calendar button at the first frame of the close while on the open it reaches day 9 only at its end (js,
  lesson 11).
- **phone-bar, both rows (87.4 %, 90.6 %):** meter artefact of a time-based hold. The gate's row holds only 400-600 ms
  timers and the audit's row none, so the 700 ms timer in js/components.js runs out while the paused frames are read.
  With the timer held (a scratch copy of the meter, removed afterwards) the pair reads 700/700 ms, 0.0 %.
- **calendar-busy 128.3 % (close 1930 ms):** the busy layers now pair; the rest is light's decided arrival of a month:
  when the reading comes in, its days are exposed one after the other in reading order (CHARACTER.md, the calendar,
  G2), which the loading has no mirror for. A state change (forest fails this pair too).
- **wizard-step, empty-state, tabs-panel:** state changes, ignored per the brief.
- **Gates (for the coordinator, js/* is outside this brief):** `gates/check-motion.mjs` asks a TIMINGS row
  (js/effects.js) and an OUT_OF_SCOPE line for `kp-sig-light-tour-ring`, as for forest's and cyberpunk's tour rings.

Measured wall time of the light measurement runs: 9 min 24 s (pairs 162 s and 155 s; partial pairs 80 and 26 s; identity 68 s; tab-paint 73 s). One short partial run (table-busy) and the probes were not timed and are not in the sum.

## Round 2 (2026-10-13)

**datepicker: 700/700 ms, 6.1 % → 700/700 ms, 3.1 % (pass).**

- **Cause, measured from the frames:** at the open's first frame the calendar button ("Open the calendar") still carried
  its focus ring and lift. They were leaving over the button's 200 ms settle (`box-shadow` and `translate`
  transitions on `:is(.kp-button, .kp-icon-button)`), because the focus had just moved to day 9. At the close's last
  frame the button had no ring: js/datepicker.js gives the focus back only once the panel is gone, so the ring
  returned (and settled for another 200 ms) after the close. The open ran a ring transition the close never ran.
- **Change:** `[data-theme='light'] .kp-datepicker [data-kp-date-open] { transition-property: background-color,
  border-color, color; }` (inside the motion block). On this one button the ring and the lift come and go in the frame
  the focus moves. They leave at the open's first frame and come back right after the close's last, mirrored, with no
  200 ms tail after the close. The ring itself is unchanged, and tab-paint still reads 40 stops with only the two
  allowed NOMARKs.
- **Remaining 3.1 %:** day 9's focus ring. It is on through the whole open (the focus goes to the day at once). In
  the close it is off from the first frame, because js/datepicker.js makes the panel `inert` as the close begins and
  that blurs the day. This is js (`js/*` is out of scope) and sits under the tolerance.
- Full light run after the change: 21 of 25 pass (was 20). Still failing: calendar-busy 128.1 % (light's decided
  arrival of a month, see above), wizard-step, empty-state and tabs-panel (ignored per the brief).

### Deviations for Kenny (round 2)

- **Date picker's calendar button:** its focus ring and its lift appear and go at once instead of over the button's
  200 ms settle. Every other button keeps the settle. The reason is that the ring moving to the day and back is part
  of the picker's pair.

Measured wall time of the round 2 light runs: full pairs 140 s, tab-paint 71 s; the partial runs (3 × about 8 s) were not timed.
