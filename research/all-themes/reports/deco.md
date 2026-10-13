# Deco: close = open reversed, deco's own effect on every part that opens (2026-10-13)

Changed: `css/deco-register.css` only, plus the "Applied 2026-10-13" note at the end of `themes/deco/CHARACTER.md`.
Every number below is Firefox (`pairs-meter.mjs`, `identity.mjs` + `identity-summary.mjs`, `tab-paint.mjs`,
`tones.mjs`). Deco's own timing is kept: contact 160, arrival 480 (draw 320 + up 160), leave 720 (wipe 360),
settle `cubic-bezier(0.22, 1, 0.36, 1)` and its reflection `cubic-bezier(0.64, 0, 0.78, 0)`.

**Pairs: 11 of 26 → 18 of 26.** Identity: 10 of 14 parts OWN → 14 of 14 OWN (the four navbar parts were FADE/NONE).

## Fixes

| # | Part | Cause | Change (selector) | Before → after |
|---|------|-------|-------------------|----------------|
| 1 | alert-close, upload-file, table-busy, toast | the mechanism tokens were unset (lessons 19, 23, 24, 37): a re-shown alert did not arrive, a file row and the busy layer vanished at once, folds ran 1.25× from a third in | `[data-theme='deco']` (the grammar's root block): `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close 0/1140 ms 155.8 % → 720/720 ms 0.0 %; upload-file 720/0 ms 100 % → 480/480 ms 0.7 % |
| 1b | table-busy | the status line's own spinner arrived in turn before the layer and folded its space (480 ms against the layer's 360); the rows' dim was instant | `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-datatable__status > .kp-spinner { display: none }` (cyberpunk's rule, lesson 23); `.kp-datatable .kp-table tbody` / `[aria-busy='true']` transition opacity 360 ms settle-out / settle | 600/0 ms 93.8 % → 360/360 ms 2.7 % |
| 1c | toast | (a) the wipe rule's mask (`[data-kp-leaving]:not(.kp-card…)`, sector resting folded at 182deg) hid the whole toast from frame 0 of its close; (b) the toast arrived by CSS only, so its space folded on the close but never unfolded on the open | (a) the wipe rule gains `:not(:where(.kp-toast, .kp-dialog, .kp-popover, .kp-menu-button > .kp-menu))`; (b) `.kp-toast.kp-toast[data-kp-leaving] { animation: kp-sig-deco-arrive 480ms linear reverse forwards }` (same name turned round, as forest's toast; the doubled class outweighs the arrival list's `dialog.kp-drawer[open]`, specificity 0,3,1) | 480/760 ms 102.7 % → 480/480 ms 0.0 % |
| 1d | calendar-busy | the busy layers (month card, day sunbursts) faded in 160 ms and left at once | `:is(.kp-calendar__day-busy, .kp-calendar__busy) { --kp-calendar-busy-leave: hold }`, arrival `kp-sig-deco-unwipe` (the wipe backwards under its own name, lesson 8), leave = deco's existing wipe on `[data-kp-leaving]`, the layers kept drawn while leaving (cyberpunk's display rules) | both layers now arrive and leave by the wipe, 360/360 ms; the pair still reads 98.5 % (see Still failing) |
| 2 | tree | no rule kept a shutting group drawn (lesson 26) | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 480/480 ms 33.7 % → 0.1 % |
| 3 | tour | the dim and ring closed on the package's 1000 ms ease-in and opened on 350/250 ms ease | root: `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: var(--kp-sig-deco-arrive); --kp-tour-dim-close-ease: var(--kp-sig-deco-settle-out)`; `[data-kp-tour-target]` opens on 480 ms settle (transition + `kp-sig-deco-tour-ring` from transparent, `backwards`) | 480/1000 ms 34.3 % → 480/480 ms 4.7 % |
| 4 | palette, date picker, combobox, menus | already deco's own (`kp-sig-deco-arrive`, played backwards by js/motion.js) | none | OWN/OWN before and after |
| 5 | navbar: hover dropdown, mega menu, phone bar | no animation of deco's: the dropdown faded in the package's 160 ms and closed at once (Firefox, lesson 36); mega menu and phone bar had none | `.kp-nav__menu` and, collapsed, `.kp-nav[data-kp-nav-open/closing] > .kp-nav__links`: mask = deco's draw sector (48 px wider than the panel, `mask-clip: no-clip`, so at rest the panel and its shadow are whole), words `opacity: var(--kp-sig-deco-up)`; open `kp-sig-deco-arrive 480ms`, close `kp-sig-deco-arrive-back 480ms reverse`; `--kp-nav-close-time: 480ms` (0 ms under reduced motion); the closing dropdown held `display: block`; the mega menu held by a 480 ms transition on `--kp-sig-deco-hold` (new `@property`) | bar-equipment 0/0 ms 100 % → 480/480 ms 0.1 %; phone-bar 0/0 ms 100 % → 480/480 ms 0.0 % frames (see Still failing); identity FADE/NONE → OWN/OWN on all four |
| 6 | sidenav | not a clip (lesson 31): the backdrop ran the package's literal 220 ms while the panel slid in deco's 160 ms, so the close (panel 0-160, dim 0-220) was not the open mirrored | `.kp-sidenav__backdrop { animation: kp-sidenav-backdrop 160ms cubic-bezier(0.22, 1, 0.36, 1) both }` | 220/220 ms 42.1 % → 160/160 ms 6.6 % |
| + | alert label, warning and destructive | ruby `--destructive` on the lacquer read 4.37:1 | `:is(.kp-alert--warning, .kp-alert--destructive) .kp-alert__label { color: hsl(from var(--destructive) h s calc(l + 4)) }` | 4.37 → 4.88:1 (tones.mjs) |

Note on the alert label: the brief asked to darken the ink a step. Deco's alert plate is the dark lacquer (about 11 %
lightness), so a darker ruby reads worse; the step that passes is the same ruby four points lighter. Nothing else of
the alert changed.

## Deviations for Kenny

- **Navbar (hover dropdown, mega menu, phone bar's panel):** CHARACTER.md decides no motion for the navbar. It now opens
  the way deco's menu and popover open (G3, `kp-sig-deco-arrive`): the panel is uncovered round from the middle of its
  top edge both ways and meets at the bottom (320 ms), then its words come up (160 ms); it closes as that backwards.
  Because the navbar's panels carry no gold inlay (their look stays as it was), it is the panel itself, not an inlay,
  that is drawn round. Borrowed rule: G3 (menu/popover opening).
- **Calendar busy layers:** they now arrive and leave by deco's wipe (the fan's sector, G13's leave for a part without
  the great fan's dressing), 360 ms. Borrowed rule: G13 as already applied to rows and tab panels.
- **Busy table rows:** they dim with the busy layer in its 360 ms. Borrowed: the layer's own wipe time and the settle.
- **Side navigation backdrop:** 160 ms on the settle instead of the package's 220 ms (the panel's own time).
- **Not done, for Kenny to decide:** the alarm still opens and closes by the package's scripted opacity/scale/translate
  (identity counts it OWN, the pair is 0.0 %); it does not draw an inlay. The brief limits the alarm to a close that
  differs from its open, which is not the case.

## Still failing

- **datepicker 6.3 %, sidenav 6.6 %** (tolerance 6 %): the motion mirrors frame for frame; the remainder is the focus
  ring, which moves back to the opener (the calendar button, "Open the panel") at the first frame of the close, while
  on the open it reaches the panel only at its end. That is js (the opener takes focus when the close begins, lesson 11),
  not the register.
- **phone-bar (two rows):** the held-timer row (the gate's, which holds every 400-600 ms timeout) mirrors at 0.0 % and
  fails only "after the closing": the held timer never lets `data-kp-nav-closing` go, so the panel's space stays. The
  other row runs the real timer during the paused seek, so the 480 ms hold ends while frames are still being read and
  the closed bar appears at the last close frame (82 %). Both are meter artefacts of a time-based hold; in real time the
  space is taken at the first frame of the open and released at the last of the close.
- **calendar-busy 98.5 %:** the busy layers now mirror; the rest is the loading days' lift doors and day tones, a state
  change (fails the same way in forest, 95-113 %).
- **wizard-step, empty-state, tabs-panel:** state changes, ignored per the brief.
- **Gates:** `gates/check-motion.mjs` reports the three new keyframes (`kp-sig-deco-tour-ring`, `kp-sig-deco-unwipe`,
  `kp-sig-deco-arrive-back`) as missing a TIMINGS row (js/effects.js) and an OUT_OF_SCOPE line, exactly as it does for
  forest's and cyberpunk's tour rings. js/* is outside this brief: the rows are for the coordinator.

Tab paint (end): 41 stops, NOMARK only "Review in a dialog" and "Copy answer".

Measured wall time of the timed runs: pairs (all) 2 min 51 s, identity 1 min 8 s and 1 min 9 s, tab-paint 1 min 17 s,
first pair subset 45 s: 7 min 10 s in total; about fifteen single-pair checks between fixes were not timed.
