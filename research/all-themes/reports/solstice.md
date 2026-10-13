# Solstice: close = open reversed, and the register's own entrance on every part that opens

Changed: `css/solstice-register.css` (only), the note "Applied 2026-10-13" at the end of `themes/solstice/CHARACTER.md`.
Measured in Firefox only (`research/all-themes/_audit`). Before: `out/solstice/pairs-before.txt`, `identity-before.txt`;
after: `out/solstice/pairs.txt`, `identity.txt`, `tab-paint.txt`.

Result: **11 → 21 of 25 pairs pass** (the meter's list as of 16:05: the phone bar is one row that holds the bar's close timer;
before, two failing rows, so the before run read 11 of 26); identity (identity-summary) before: palette FADE/FADE, datepicker NONE/NONE, combobox
NONE/NONE, desktop-dropdown FADE/NONE, desktop-mega, phone-frame, phone-390 NONE/NONE, tour the package's `kp-tour-in`;
after: **all 14 parts OWN/OWN**. Tab stops: 41, NOMARK only "Review in a dialog" and "Copy answer". Focus on opening:
dialog, drawer, palette and date picker take it (probe).

The theme's own motion, kept as the register has it: the popover's **rise** (`kp-sig-solstice-solstice-rise`, 640 ms,
`cubic-bezier(0.2, 0, 0, 1)`), the dialog's **dawn** (`kp-sig-solstice-solstice-dawn`, 560 ms, played by js/motion.js in its
close time, 373 ms), the leave's **morning mist** (`kp-sig-solstice-leave`, 540 ms `ease-in`, arrivals as it played
backwards). Every new rule borrows one of these.

## Fixes

| # | Part | Cause | Change (selector) | Before | After |
|---|------|-------|-------------------|--------|-------|
| 1 | alert-close, upload-file, toast | lessons 19/23/24 | root `[data-theme='solstice']`: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close open 0 / close 855 ms, 110.2 %; upload-file 855 / 0 ms; toast ok at 855/855 | all ok at 540/540, 0.0 % |
| 2 | tree | lesson 26 | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | open 448 / close 0 ms, 102.0 % | ok 448/448, 0.0 % |
| 3 | table-busy | after 1 the layer mirrored, but the table's two dims (`[aria-busy]` 0.7 in css/layout.css, rows 0.55) switched in one frame | `:is(.kp-datatable[aria-busy='true'], … tbody)` dim in 540 ms `ease-out` (`kp-sig-solstice-busy-dim`), `.kp-datatable:not([aria-busy='true']):has(> .kp-datatable__busy-overlay[data-kp-leaving])` (and its rows) back by the same frames reversed (`-busy-dim-back`, so the leave runs `ease-in`, the mist's curve) | open 675 / close 0 ms, 105.2 % | ok 540/540, 4.1 % |
| 4 | calendar-busy | layers came in by the package's 240 ms fade and went at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold; transition: none }`; shown layers arrive as the mist played backwards under a second name (`kp-sig-solstice-leave-back`, so the leave's `kp-sig-solstice-leave` restarts); leaving layers kept displayed and placed (cyberpunk's rules) | open 240 / close 0 ms, 100 % | 540/540, 98.7 % (see Still failing) |
| 5 | sidenav | lesson 31 checked, no clip; the package's backdrop is a literal 220 ms against the 240 ms panel | `.kp-sidenav__backdrop { animation-duration: 240ms }` | 240/240, 21.9 % | ok 240/240, 2.8 % |
| 6 | palette | bare fade | `.kp-palette { --kp-sig-dur: 560ms; animation: kp-sig-solstice-solstice-dawn … both }` (the dialog's own declaration) | ok 373/373 but FADE | ok 373/373, 0.0 %; OWN (opacity + transform) |
| 7 | tour | card `kp-tour-in` (160 ms); dim/ring 350/250 ms `ease` in, 1000 ms `ease-in` out | `.kp-tour[open]:not([data-kp-tour-stepping])` dawn 560 ms, stepping `animation: none`; root `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: 560ms; --kp-tour-dim-close-ease: cubic-bezier(1, 0, 0.8, 1)` (the dawn curve turned round); `[data-kp-tour-target]` ring keyframe + transitions on 560 ms `cubic-bezier(0.2, 0, 0, 1)`, `backwards` | 350/1000 ms, 28.8 % | ok 560/560, 0.6 % |
| 8 | datepicker, combobox | no animation either way | `:is(.kp-combobox__list:popover-open, .kp-datepicker__panel:is([data-kp-date-open], [data-kp-closing], [data-kp-reversing]):popover-open)` rise 640 ms (lesson 10: the name stays the same through the close) | both open 0 / close 0 ms, 100 % | datepicker ok 640/640, 3.5 %; combobox ok 640/640, 0.0 % |
| 9 | bar-equipment (mega), hover dropdown | mega nothing; dropdown 240 ms fade in, nothing out (lesson 36) | open states rise; `li[data-kp-nav-closing]:not(…) > .kp-nav__menu` held `display: block` and played back (`kp-sig-solstice-solstice-rise-back`, reverse); `--kp-nav-close-time: 640ms` (`0ms` under reduce); registered `--kp-sig-solstice-hold` 640 ms transition for the mega menu's hold | open 0 / close 0, 100 %; dropdown FADE/NONE, mega NONE/NONE | ok 640/640, 0.1 %; OWN/OWN |
| 10 | phone-bar | nothing | `@container kp-nav (max-width: 40rem)`: `[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` rise, `[data-kp-nav-closing] > .kp-nav__links` rise-back reversed; nested menus none | open 0 / close 0, 100 % | ok 640/640, 0.0 % on the meter of 16:05 (the meter before it read 87.5 %: js/components.js's close timer fired between its paused frames); OWN/OWN |

## Deviations for Kenny

- **The decided "kindled" dome (G3, 480 ms) is not in the register for any part.** The register's popovers rise (640 ms) and
  its dialog dawns (560 ms); `CHARACTER.md` says "Nothing here is applied yet" for the grammar's opening. Following the brief
  (keep the theme's own open motion and timing), I carried the register's rise and dawn to the parts that lacked one, not the
  dome. If the dome is wanted, it replaces rise and dawn everywhere in one go.
- **Command palette and tour card:** the dialog's dawn (G3 lists the dialog; the palette and tour were not decided). The tour's
  dim and ring take the dawn's time and curve.
- **Combobox list, date picker panel, bar's hover dropdown, mega menu, phone bar's list:** the popover's rise ("a menu and a
  popover rise into the light as the toast does", the register's G3 note). The phone bar's toggle is unchanged.
- **Calendar busy layers and the busy table's dims:** the morning mist's leave and its reverse (the register's arrival rule).

## Still failing

- **calendar-busy 98.7 %:** as forest (95-113 %): the days change their tone and js/calendar.js empties the whole-month card's
  words at the state change, in one frame. Shared JS / state.
- **wizard-step, empty-state, tabs-panel:** state changes, not pairs (ignored per brief).
- **Not asked, noted:** the dialog's, drawer's and palette's backdrops take js/motion.js's `ease-in` fallback (lesson 16), though
  they mirror.

Measured wall time (Firefox, solstice): targeted pairs runs 41 s, 19 s, 43 s, 7 s, 6 s; full pairs-meter 2 min 41 s (old meter)
and 2 min 21 s (re-run on the meter of 16:05); identity 1 min 6 s and 1 min 5 s; tab-paint 1 min 12 s. Re-run of datepicker and sidenav after the focus-return change in js/datepicker.js and js/sidenav.js
(16:17, not mine) 11 s: still ok (1.4 %, 0.0 %). Total 10 min 32 s.

## Review round 1 (2026-10-13, Kenny's rejection)

### palette · solstice: "I don't think that's the right animation for this theme?"

- **Cause:** round 1 gave the palette the register's dialog *dawn* (a fade-rise, 560 ms), which is not the opening Kenny
  decided. themes/solstice/CHARACTER.md G3 (research/solstice-character/decided.json, `"opening": "dome"`, approved
  2026-10-07 23:18) is **kindled**: a dome of first light grows from the middle of the panel's foot
  (`clip-path: ellipse(0 0 at 50% 100%)` → `ellipse(150% 150% at 50% 100%)`), what it reaches overbright and warm
  (`brightness(1.35) saturate(1.3)` → 1) and cooling, 2 units (480 ms) on G1's coming curve
  `cubic-bezier(0.61, 1, 0.88, 1)`; closing is the dome sinking back into the foot. The register had never built it.
- **Built:** `@keyframes kp-sig-solstice-kindled` (and `kp-sig-solstice-kindled-back`, the same frames under a second name
  for the bar's closes), tokens `--kp-sig-solstice-open: 480ms` and `--kp-sig-solstice-come` on the root. No timing
  function inside the keyframes, so a reversed play is the opening's frames in reverse (the close then runs on G1's
  going curve by itself).
- **The palette:** `.kp-palette { animation: kp-sig-solstice-kindled 480ms <come> backwards }`; js/motion.js opens it in the
  dialog's close time and plays it backwards to close.

**Parts G3 names for the same opening** ("A menu, the header's menu, a popover, the dialog, the drawer, a toast and a
tooltip"). G3 names each explicitly, so each now opens kindled and closes as it backwards:

| Part (G3's word) | Selector | Before (open/close, motion) | After (Firefox pairs) |
|---|---|---|---|
| the palette (asked; G3 does not name it) | `.kp-palette` | 373/373 ms, the dawn | palette 480/480 ms, 0.0 % |
| the dialog | `.kp-dialog` (720 ms unopened, so js/motion.js reads a 480 ms close; 480 ms `[open]`) | 373/373 ms, the dawn | dialog 480/480 ms, 0.0 % |
| the drawer | `dialog.kp-drawer` (a `.kp-dialog`) | 373/373 ms, the dawn | drawer 480/480 ms, 0.0 % |
| a menu | `.kp-menu-button > .kp-menu` | 640 ms, the rise | (no pair of its own; same rule as the popover) |
| a popover | `.kp-popover[popover]:not(.kp-tooltip)` | 640/640 ms, the rise | theme-menu 480/480 ms, 0.0 %; popover-row-actions 480/480 ms, 0.0 % |
| the header's menu | `.kp-nav__menu` (dropdown, mega menu), `--kp-nav-close-time: 480ms`, the hold transition 480 ms | 640/640 ms, the rise | bar-equipment 480/480 ms, 0.1 % |
| the header's menu on a phone | collapsed `.kp-nav__links` | 640/640 ms, the rise | phone-bar 480/480 ms, 0.0 % |
| a toast | `.kp-toast` opens kindled; `.kp-toast.kp-toast[data-kp-leaving]` leaves as it reversed, so js/motion.js arrives it as that leave turned round | 540/540 ms, the morning mist | toast 480/480 ms, 0.0 % |
| a tooltip | `.kp-tooltip` | 360/360 ms, the ember (scale + fade) | tooltip 480/480 ms, 0.0 % |

Evidence (frames in the review stage): the palette opens as a dome rising from the middle of its foot over the panel,
warm and bright, cooling as it reaches the top; Escape sinks it back into the foot. The bar's dropdown in the same
frames: a small dome at the foot (frame 0), half the panel (frame 1), all but the top corners (frame 2), whole (frame 3).

**Not changed, for Kenny:**
- The combobox list, the date picker panel and the tour card are not named in G3; they keep round 1's borrowed motion (the
  popover's old rise, 640 ms, and the dialog's dawn, 560 ms). Since the popover and the dialog now kindle, those three are
  now the only parts in solstice that open differently. One line each makes them kindled too, if Kenny wants it.
- The toast's leave is now the dome sinking (G3 names the toast), not the morning mist (G12, Kenny's pick for leaving);
  every other leaving part keeps the mist.
- `kp-sig-solstice-solstice-dawn`, `-rise` and `-ember` stay in the file: the rise still serves the combobox, date picker
  and toast's old row in js/effects.js; the ember is now unused but has a TIMINGS row in js/effects.js, which is not mine.
- `gates/check-motion.mjs` reports `kp-sig-solstice-kindled` and `-kindled-back` as needing a TIMINGS row and an
  OUT_OF_SCOPE line (js/effects.js, gates), as for every other new keyframe this round: for the coordinator.
- The demo's own words for solstice (bar: "rise into the light … the dome is built nowhere yet"; palette: "it dawns as the
  dialog does (560 ms)") are now out of date; they are written by research/all-themes/build-demo.py (shared).
- Pressing Escape on the palette inside the review dialog also closes the review dialog (seen in the frames); that is
  research/_review/review.js, shared.

Wall time of the timed runs: pairs (palette, dialog, drawer, toast, tooltip, theme-menu, popover-row-actions,
bar-equipment, phone-bar) 51 s; stage frame runs about 4 × 30 s, not timed.

### Follow-up (coordinator, 2026-10-13): one opening for every part that opens

The combobox list, the date picker panel and the tour card are now kindled too: same dome, 480 ms on G1's coming curve,
closing as it backwards. **Borrowed from G3**, which does not name these parts. The tour's dim and ring take the same
480 ms: they open on `cubic-bezier(0.61, 1, 0.88, 1)` and close on G1's going curve `cubic-bezier(0.12, 0, 0.39, 0)`
(`--kp-tour-dim-time`, `--kp-tour-dim-close-ease`, and the `[data-kp-tour-target]` ring and transitions). The shared tour
rules in css/components.css were not touched. With this, every part that opens in solstice uses the one decided opening.

| Pair | Before | After (Firefox) |
|---|---|---|
| combobox | 640/640 ms, the rise, 0.0 % | 480/480 ms, 0.0 % |
| datepicker | 640/640 ms, the rise, 1.4 % | 480/480 ms, 1.7 % |
| tour | 560/560 ms, the dawn, 0.6 % | 480/480 ms, 0.8 % |

Wall time of the pairs run (combobox, datepicker, tour): 18 s.


## Review round 2 (2026-10-13 20:37): the side navigation and the alarm

Kenny, verbatim: "sidenav: Niet de open/close animatie van dit thema" and "alarm: Niet de open/close animatie van dit thema".

### sidenav (over and push, `#fa-over`, `#fa-side` pushes, and the window-edge panels of research/sidenav-edge)

- **Cause:** the register gave the over/push panel no motion of its own, so it ran the package's plain slide from its edge
  (identity: transition:translate 240 ms (the package slide)).
- **Change:** it now opens as solstice's dialog does, G3's kindling: a dome of first light grows from the middle of the foot (`ellipse(0 0 at 50% 100%)` to past every corner), overbright and warm, cooling to its colour, 2 units (480 ms) on the coming curve; the close is the dome sinking back into the foot. It no longer slides: `translate: 0 0` in every state, shut it is
  `visibility: hidden` (after the close's last frame). Keyframes: `kp-sig-solstice-kindled` on the panel and `kp-sig-solstice-kindled-back` (the existing second name) with `reverse both` for the close. The content a push panel moves (and the edge
  tab) glides in the same two units, on the coming curve to make room and on the going curve (the same curve played back, G1) to give it back: js/sidenav.js copies the panel's `translate` transition onto it, and the panel's `translate` never
  changes, so that transition is only the clock. The backdrop (where a page keeps one) takes the same time and curve.
  Selectors: `[data-theme='solstice'] .kp-sidenav:is([data-kp-sidenav-mode='over'], [data-kp-sidenav-mode='push'])`, its
  `[data-kp-sidenav-open='true']` state and their `::after` (end of the `kp.signature` layer, under
  `prefers-reduced-motion: no-preference`; reduced motion keeps the package's instant show and hide).
- **Evidence:** identity `sidenav` row FAIL (NOT split) → ok (split, open and close), now kp-sig-solstice-kindled 480 ms; close kp-sig-solstice-kindled-back, reverse. Pair meter
  before: sidenav 240/240 0.0 %, sidenav-push 240/240, edge-push/gutter/over 240/240 0.0 %, alarm 480/480 0.2 %; after: sidenav 480/480 0.0 %, sidenav-push 480/480 0.0 %, sidenav-edge-push 480/480 0.0 %, -gutter 480/480 0.0 %, -over 480/480 0.0 %, -tab 480/480 0.0 %, sidenav-group 240/240 0.0 % (unchanged), alarm 480/480 2.2 % (the Acknowledge button's 240 ms press colour on the open), dialog 480/480 0.0 %: 9 of 9. Seen in frames (review dialog stage, real clicks at
  coordinates, the animations paused and sought): sidenav: at 25 % a warm dome over the panel's foot, at 50 % it has passed the top corners, cooling to the panel's colour; the close sinks the same dome into the foot. The alarm: a dome of light rises from the bottom middle of the window and uncovers the whole red screen; the close sinks it.

### alarm (`.kp-alarm`, its panel and title)

- **Cause:** the register named no alarm motion, so it ran the package's script[opacity] on the plate, script[opacity,scale,translate] on the panel, script[opacity,scale] on the title, which js/motion.js replays
  and turns round.
- **Change:** `kp-sig-solstice-kindled` on `.kp-alarm[open]`: the whole screen kindled from the middle of its foot; the package's fade, rise and scale set to none. js/motion.js keeps this entrance and closes the alarm by playing it backwards in the dialog's
  close time, as it does the dialog. Respects `data-kp-alarm-motion='still'`.
- **Evidence:** identity now lists script[clipPath,filter]@dialog.kp-alarm, exactly the dialog's own row (script[clipPath,filter]@dialog). The audit's regex can only read keyframe NAMES, and js/motion.js
  replays every dialog-like entrance as an unnamed script animation, so the `alarm` row prints FAIL exactly as this
  theme's `dialog` row does; the property sets are the evidence. Pair meter: alarm 480/480 2.2 % (open =
  close, close the open reversed).

### Deviations for Kenny (this round)

- The push panel's content glides in the dome's two units on G1's coming and going curves while the panel itself does not move; borrowed from G1, G3 does not name the page next to a panel.

Focus after the change (`tab-paint.mjs`): only "Review in a dialog" and "Copy answer" read NOMARK, as allowed.
Measured wall time of this round's runs (Firefox, four themes in parallel): identity + pairs before 1 min 23 s, after
1 min 31 s, tab-paint 1 min 15 s, frame sheets about 40 s each.
