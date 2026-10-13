# Grotesk: close = open reversed, and the plate's fall on every part that opens

Audit of 2026-10-13, Firefox only. Changed: `css/grotesk-register.css` (a "Pairs" block at the foot of
`kp.signature`, plus one top-level `@property --kp-sig-gr-hold`), and an "Applied 2026-10-13" note at the
end of `themes/grotesk/CHARACTER.md`. The focus rules of lesson 41 (selected tab, switch) are untouched.

Result: **5 of 26 pairs passed before, 15 of 26 after** (`out/grotesk/pairs-before.txt` against
`out/grotesk/pairs.txt`). Identity by `identity-summary.mjs`: **7 of 14 parts OWN both ways before
(palette NONE/FADE, date picker, combobox and the bar's four parts NONE or FADE; the alarm read OWN but
ran the package's keyframes), 14 of 14 after**, all of them the plate's fall; `identity.mjs` itself:
4 → 12 of 14 (the two it fails are a labelling artefact, see Still failing). Tab paint: 42 focus stops, only "Review in a dialog" and "Copy answer"
read NOMARK (before: 40 stops, 4 NOMARK, the tab and the switch included).

## First: which closes are decided not to mirror, and which are dialog closes

CHARACTER.md §0b breaks the opposites rule for exactly two things: the waiting loop, and **a part's leave**
(`[data-kp-leaving]`, `kp-sig-grotesk-leave`: the plate leaves register and turns one full turn clockwise
out). It keeps everything else mirrored: "opening and closing a menu or dialog, an arrival and its close
... stay the open played backwards". So:

| Close                                                                                   | What it is                                    | Must mirror? |
| --------------------------------------------------------------------------------------- | --------------------------------------------- | ------------ |
| dialog, drawer, palette, alarm, tour card, menus, popovers, date picker, combobox list, the bar's menus, side navigation | a window closing (js/motion.js `closeDialog`, `playClose`, `playEntranceBackwards`, a CSS state) | yes          |
| table busy layer, calendar busy layers, upload file row, toast, dismissed alert         | a part a script removes or hides: the decided leave | no (§0b)     |

The dialog (96.7 %), drawer (91.6 %), palette (open 0 ms) and alarm (63.2 %) were all in the first group:
none of their faults came from the clockwise leave.

## Fixes

| Part | Cause | Change (selector) | Before → after (pairs; identity) |
| --- | --- | --- | --- |
| dialog | The backdrop had no animation, so js/motion.js closed it with its fallback 960 ms `ease-in` fade, while it opened at once (lesson 16): 96.7 % off at frame 0. Second, smaller: the title rule (`kp-sig-grotesk-gr-rule`, 360 ms after 120 ms) is replayed backwards by `closeDialog` in 960 ms without its delay. | `:is(.kp-dialog, .kp-drawer, .kp-alarm, .kp-palette, .kp-shortcuts)[open]::backdrop` takes `kp-sig-grotesk-hold` (printed at once, held 960 ms); `.kp-dialog__title::before` takes `kp-sig-grotesk-gr-rule-set`, the same rule in the fall's 960 ms with the unit of rest and the draw written into the keyframes (0-12.5 % none, 12.5-50 % draws, then held). | 960/960 ms, 96.7 % → 0.1 %; OWN/OWN both |
| drawer | Same two causes. | Same rules. | 960/960, 91.6 % → 0.0 %; OWN/OWN |
| palette | No entrance (open 0 ms), so the close was the package's bare opacity fade. | `:is(.kp-palette, .kp-shortcuts)[open]` takes `kp-sig-grotesk-fall` 960 ms; backdrop as above. | open 0 → 960, close 960, 99.4 % → 0.0 %; NONE/FADE → OWN/OWN |
| alarm | The package's own entrance ran (ground 240 ms, panel 520, title 120+480, reason 360+300): `closeDialog` replays each kept entrance backwards in the close's 960 ms with no delay, so each part closed on a different clock than it opened; plus the `ease-in` backdrop. Not a leave: a dialog close. | `.kp-alarm[open]:not([data-kp-alarm-motion='still'])` animation none (the red ground printed at once); `.kp-alarm .kp-alarm__panel` takes the fall with the ink as its plate (`--kp-sig-gr-plate: var(--foreground)`, 8 px); title and reason none; backdrop held. | 960/960, 63.2 % → 0.8 %; package keyframes → OWN/OWN |
| date picker | No entrance (NONE). | `.kp-datepicker__panel:is([data-kp-date-open], [data-kp-closing], [data-kp-reversing]):popover-open` takes the fall (lesson 10's union). | open 0 → 960, close 960, 101.1 % → 7.8 % (Still failing); NONE → OWN/OWN |
| combobox | No entrance (NONE). | `.kp-combobox__list:popover-open` takes the fall. | 0/0 → 960/960, 100 % → 0.0 %; NONE → OWN/OWN |
| tour | The card opened with the package's 160 ms fade; the dim and ring came in 350/250 ms `ease` and left in the default 1000 ms `ease-in`. | `.kp-tour[open]:not([data-kp-tour-stepping])` takes the fall, a step none; `[data-kp-tour-target]` transitions `box-shadow` and `outline-color` 960 ms `steps(1, start)`; root `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: 960ms; --kp-tour-dim-close-ease: steps(1, end); --kp-tour-dim-close-delay: 0s` (printed at once, taken off at the end of the card's close). | 960/1000, 61.4 % → 960/960, 0.7 %; OWN/OWN |
| side navigation (over, push) | Open 220 ms (backdrop 220 ms fade, panel 120 ms slide) against close 960 ms (the opener's focus fall when focus returns): 75.5 %. Not lesson 31's clip. | `.kp-sidenav:is([over],[push])[data-kp-sidenav-open='true']` takes the fall plus `kp-sig-grotesk-slide` (one unit out from the start edge, then held, 960 ms); `='false'` takes both backwards under second names (no fill) and is `visibility: hidden` after the close (`visibility 0s 960ms`), so its plate never shows past its edge at rest; `.kp-sidenav__backdrop` held; `[data-kp-sidenav-shift]` moves in the first unit of the open and the last of the close. | 220/960, 75.5 % → 960/960, 1.2 %; push 0.0 % (was 0.0 % at 120 ms) |
| bar: mega menu (bar-equipment) | No animation either way (Firefox does not hold `display`, lesson 36). | `.kp-nav__menu` closed state `kp-sig-grotesk-fall-back` reversed with a `--kp-sig-gr-hold` transition (the script releases the mega menu's item when a transition ends); open state `li:is(:hover, :focus-within, [data-kp-nav-menu-open]) > .kp-nav__menu`, `li:is([data-kp-nav-menu-open], :has(> [data-kp-nav-disclosure][aria-expanded='true'])) > .kp-nav__menu--wide` the fall; `li[data-kp-nav-closing] > .kp-nav__menu` kept displayed; root `--kp-nav-close-time: 960ms` (0 ms under reduced motion). The package's opacity fade on the panel is replaced. | 0/0 → 960/960, 0.3 %; NONE → OWN/OWN |
| bar: hover dropdown | Package fade in, nothing out. | Same rules. | identity FADE/NONE → OWN/OWN |
| bar: phone panel | No animation either way. | Inside `@container kp-nav (max-width: 40rem)`: `.kp-nav[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` the fall, `[data-kp-nav-closing] > .kp-nav__links` the fall backwards; nested menus in the open panel none. | 0/0 → 960/960 (meter limit, Still failing); identity NONE → OWN/OWN |
| table busy, kept rows | The kept rows' busy dim (0.55) went off at the start of the layer's leave. | `.kp-datatable .kp-table tbody` takes `opacity 0s linear 960ms`, `[aria-busy='true']` `0s` (on at the first frame, off when the leave is over). Measured after the full run: table-busy 550.6 % → 549.2 % (the decided leave dominates). | — |
| tree | Branch children vanished at once (lesson 26). | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` (forest's). | 0/0 → 240/240, 121.2 % → 0.0 % |
| table busy, upload file, alert, toast | Leaves not asked (lesson 19), unseen spinner first (23), fold 1.25× from a third in (24). | Root `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0`. | table 960/0 → 960/960; upload 960/0 → 960/960; alert 0/1520 → 960/960; toast 960/1520 → 960/960 (now timed; frames decided not to mirror) |
| calendar busy | The layers left at once (close 0 ms) and arrived by the package's 120 ms fade. | `:is(.kp-calendar__day-busy, .kp-calendar__busy)` `--kp-calendar-busy-leave: hold`, transition none; the loading selectors take the fall; `[data-kp-leaving]` copies keep each layer drawn through its leave (cyberpunk's rules, the radius 0). | 120/0 → 960/960 (frames decided not to mirror) |

Theme values kept: fall 960 ms, contact 120 ms, the title rule's 120 + 360 ms, the plate radii (4, 6,
8 px), `linear` everywhere; no new effect: every addition is the existing fall, hold or slide.

## Deviations for Kenny

CHARACTER.md decides nothing for these parts; each borrows the nearest existing rule.

| Part | What it does now | Borrowed from |
| --- | --- | --- |
| Command palette, shortcuts sheet | Their red plate falls into register (960 ms); the close is that backwards. | the dialog's fall |
| Date picker panel, combobox list | The plate's fall on open, backwards on close. | the popover's and menu's fall |
| Bar dropdown, mega menu, phone panel | The fall on open, backwards on close; the phone toggle's ink plate comes with the first frame and goes with the last. | the popover's fall |
| Tour card | The fall on open, backwards on close (was the package's 160 ms fade). | the dialog's fall |
| Tour dim and target ring | Printed at once with the card and taken off at once at the end of its close (was a 350 ms `ease` fade in, 1000 ms out). | the dialog's backdrop (G1: nothing fades) |
| Every backdrop (dialog, drawer, alarm, palette, shortcuts, side navigation) | Printed at once and held for the 960 ms (an invisible `opacity: 1` hold), so the close keeps it and lets it go with the window. | G1 (nothing fades); the backdrop already appeared at once |
| Alarm | The red ground at once, the panel's plate (ink on red) falls; title and reason come with the panel, not after it (were 120 and 360 ms late). | the dialog's fall; a red face's plate is the ink (existing rule) |
| Side navigation (over, push) | Slides out from its start edge in one unit while its plate falls over 960 ms; closing is that backwards (plate first, the slide in the last unit); shut, it is `visibility: hidden`. | the dialog's fall; G2's slide from the start edge |
| Dialog title rule | The same 120 ms rest and 360 ms draw, now written as keyframes inside 960 ms; a consumer's `--kp-rule-draw` no longer changes the dialog's title rule. | its own rule |

For Kenny to look at, not changed: now that the busy table's layer leaves instead of vanishing, its
leave (and, as before, its arrival) draws the red plate as a copy of the whole translucent veil, so the
table reads pink for most of the 960 ms. That is the decided plate on a veil; a narrower carrier (the
busy panel only) would be a new decision.

## Still failing

| Pair | Reading | Reason |
| --- | --- | --- |
| table-busy, calendar-busy, upload-file, toast, alert-close | 960/960 ms; 550.6 %, 99.6 %, 123.8 %, 135.0 %, 122.9 % | **Decided** (§0b): the leave turns clockwise out and is not the arrival reversed. Two parts to it: the plate leaves register at once and turns the other way, and js/motion.js folds the space shut during the leave while the arrival (not reverse-close, also decided) takes its space at once. The busy overlay's red plate is drawn over the whole translucent overlay, which is why that pair reads highest. |
| datepicker | 960/960, 7.8 % at frame 18 | The trigger takes its focus back at the start of the close and plays grotesk's focus fall then (lesson 11: the opener should take focus when the panel is gone); that is js/datepicker.js, not the register. |
| phone-bar (both rows) | 960/960, 105.7 % and 106.7 % | Meter limit: js/components.js ends the close with a real 960 ms timer that runs out while the meter takes its frames (the gate pair holds only 400-600 ms timers; forest 10 %, cyberpunk 104 %). With the timer held (a scratch copy of the pair, since removed) the close reads **0.0 %** off. |
| wizard-step, empty-state, tabs-panel | 960/0 103.0 %, 960/960 148.5 %, 960/960 928.9 % | Ignored by the brief (state changes, not pairs). |
| identity.mjs: palette, alarm close | "NOT split" | Labelling only: the script that plays a kept drop-shadow entrance backwards is named `kp-sig-cyberpunk-split-bar (script)` by identity.mjs, which does not match `^kp-sig-grotesk`; `identity-summary.mjs` reads both as OWN. |

Measured wall time of the measurement runs: about 11 min (two full pair-meter runs, 2 min 36 s and
2 min 45 s; identity 1 min 5 s; tab paint 1 min 14 s; targeted pair runs and probes about 4 min).
`out/grotesk/pairs.txt` is the second full run; the kept-rows change came after it and was measured on
its own (table-busy only).

## Round 2 (2026-10-13)

**sidenav-push: 960/960 ms, 0.0 %, 55.9 % left over → 960/960 ms, 0.0 %, nothing left over (pass, 0 failures in 10
repeats of the sequence that failed).**

- **Cause, measured from the frames:** the pair is intermittent. Alone it passed 4 of 4 runs. In a full run it failed
  (56.5 %), and so did `--only dialog,sidenav-push` (1 of 4) and `--only dialog,palette,sidenav-push` (1 of 2).
  In every failing run the *before* picture was the odd one: it matched neither a passing run's before nor its own
  after. It showed the shut panel half slid out, with its red plate (the drop-shadow of `kp-sig-grotesk-fall-back`)
  at x ≈ 404 inside the stage. The panel has no `data-kp-sidenav-open` in the markup, and grotesk hid only
  `[data-kp-sidenav-open='false']`. So the panel was *visible* until js/sidenav.js wrote its first `false`. When that
  write landed after a style flush, the close rule's `transition: visibility 0s linear 960ms` held the panel visible
  for 960 ms while the close (`fall-back`, `slide-back`, reversed) played on a panel that had never been opened. The
  meter freezes the page's running animations before its *before* picture, and in the slower runs it froze that
  page-load close mid-way. This was a real flash on page load, not only a meter artefact.
- **Change:** the shut rule is now
  `[data-theme='grotesk'] .kp-sidenav:is([data-kp-sidenav-mode='over'], [data-kp-sidenav-mode='push']):not([data-kp-sidenav-open='true']) { visibility: hidden; }`
  (was `[data-kp-sidenav-open='false']`). An unmarked panel is shut and hidden, so the script's first `false` changes
  nothing visible and starts no visibility transition. A load probe (every frame, first 2.5 s) reads `visible` before
  the script with the old selector and `hidden` throughout with the new one. The close and its 960 ms hold are
  unchanged, and the open still turns visibility on at once.
- Full grotesk run after the change: 16 of 25 pass. sidenav-push passes. The other failures (table-busy, upload-file,
  toast, alert-close, calendar-busy and the three ignored state changes) are those listed above. **tooltip** failed
  in that full run (7.1 % left over) and in 1 of 4 repeats alone. That is the catalogue's frozen tooltip examples
  being re-rastered, not grotesk: see research/all-themes/reports/formal.md, Round 2.

Measured wall time of the round 2 grotesk runs: full pairs 142 s and 141 s; partial runs about 20 × 7 to 20 s, not timed.

## Review round 1 (2026-10-13, Kenny's rejection)

### bar · grotesk: "The items appearing in the phone version are weirly aligned to the right"

- **Cause:** grotesk's bar is a 14-column grid; the collapsed rules (`@container kp-nav (max-width: 40rem)`: one column,
  brand and links in column 1) were written *before* the wide placement (`.kp-nav__brand { grid-column: 1 / 4 }`,
  `.kp-nav__links { grid-column: 4 / 15 }`) at the same weight, so the wide placement won on a phone too. In a one-column
  grid the links then fell into implicit columns 4 to 15, starting at the toggle's x (about 60 % across the 390 px
  frame). Present since 2026-09-08 (2ec32509), not from this round's motion.
- **Change:** the collapsed block moved after the wide placement and made a two-track row:
  `.kp-nav { grid-template-columns: minmax(0, 1fr) auto }`, `.kp-nav__brand { grid-column: 1 }`,
  `.kp-nav__toggle { grid-column: 2 }`, `.kp-nav__links { grid-column: 1 / -1; align-items: flex-start }`. The wide bar is
  untouched (checked: brand left, links right, dropdown under Readings as before).
- **Evidence (frames in the review stage, phone 390 px):** before, Overview / Readings / Rota / Request access stood in a
  column starting under the toggle, the left 60 % of the panel empty. After, brand and toggle share the top row (toggle
  at the end) and the links stand in a column from the start edge under the brand, the dropdown's caption and links
  indented 1rem from them; the fall plays the same.
- **Pairs (Firefox):** phone-bar 960/960 ms, 0.0 %; bar-equipment 960/960 ms, 0.3 % (both ok, as before).

Wall time of the timed run: pairs (phone-bar, bar-equipment) 12 s; stage frame runs 2 × 30 s, not timed.
