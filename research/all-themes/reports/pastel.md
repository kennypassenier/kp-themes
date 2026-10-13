# Pastel: the close mechanism only (2026-10-13)

Scope (coordinator): pastel has no CHARACTER.md and no decided signature, so only the brief's mechanism items 1
(leave tokens), 2 (tree), 3 (tour timing) and 6 (sidenav); no new effect, no CHARACTER.md. Changed:
`css/pastel-register.css` only. Firefox only. Pastel's own timing is kept (its leave, the balloon `kp-sig-pastel-leave`
520 ms; contact 220 ms; the package's tour card `kp-tour-in` 160 ms ease-out).

**Pairs: 8 of 26 → 12 of 25** (this run listed `phone-bar` once instead of twice; both rows failed before). Identity:
unchanged, as intended (no effect added): 4 of 14 parts OWN before and after.

## Fixes

| # | Part | Cause | Change (selector) | Before → after |
|---|------|-------|-------------------|----------------|
| 1 | alert-close, upload-file, toast, table-busy | mechanism tokens unset (lessons 19, 23, 24, 37): a re-shown alert did not arrive, a file row and the busy layer left at once, folds ran 1.25× from a third in (823 ms) | in the existing `@media (no-preference) [data-theme='pastel']` leave block: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close 0/823 ms 105.7 % → 520/520 ms 0.0 %; upload-file 823/0 ms 110.8 % → 520/520 ms 0.0 %; toast 823/823 ms 6.4 % → 520/520 ms 0.0 %; table-busy 650/0 ms 116.6 % → 520/520 ms 77.1 % (see Still failing) |
| 1b | table-busy | the status line's spinner arrived in turn before the layer and folded its own space (lesson 23) | `.kp-datatable:has(> .kp-datatable__busy-overlay) .kp-datatable__status > .kp-spinner { display: none }` (cyberpunk's rule) | the open is the layer's arrival alone, 520 ms, the mirror of its leave |
| 2 | tree | no rule kept a shutting group drawn (lesson 26): open 0 ms | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` | 0/480 ms 86.8 % → 480/480 ms 0.1 % |
| 3 | tour | the dim and ring opened on the package's 350/250 ms ease and closed on 1000 ms ease-in | `[data-theme='pastel'] { --kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: 160ms; --kp-tour-dim-close-ease: ease-in }`; `[data-kp-tour-target]` opens in the card's 160 ms ease-out (transition, and `kp-sig-pastel-tour-ring` from transparent, `backwards`, lesson 11/21) | 350/1000 ms 27.9 % → 220/220 ms 62.0 % (see Still failing: the dim, ring and card now mirror) |
| 6 | sidenav | nothing to fix: 220/220 ms, 0.5 % (panel and backdrop both 220 ms, no clip) | none | ok before and after |

## Deviations for Kenny

- **Tour dim and ring:** they now come in the card's own 160 ms ease-out and go in 160 ms ease-in (was 350/250 ms in,
  1000 ms out). The time and curve are the package's tour card's, as pastel has none of its own; no new effect.
- Nothing else: no part was given a new motion.

## Still failing

- **tour 62.0 %:** the card, the dim and the ring are now 160 ms each way, all starting at 0, each the other's mirror.
  The meter's window is 220 ms because the opener (`.kp-button`, pastel's 220 ms box-shadow on press and on the focus
  it gets back) transitions in both directions; frame f of the open is compared with frame 1-f of the close over 220
  ms, which offsets every 160 ms part by 60 ms. The meter leaves out only an opener's pseudo-element effects. Before,
  the pair read lower (27.9 %) while its close really took 1000 ms against a 350 ms open.
- **table-busy 77.1 %:** the busy layer arrives and leaves by the balloon, mirrored (520/520 ms); the rest is the rows'
  and the table's dim (`[aria-busy]` 0.7, the rows 0.55), which switches at once in both directions, a state change.
  Giving the dim a motion would be a new effect, outside pastel's scope.
- **calendar-busy 100 % (open 220, close 0):** the busy layers fade in by the package's 220 ms and leave at once. The fix
  (`--kp-calendar-busy-leave: hold`, cyberpunk's mechanism) needs an arrival for the layer that is the balloon played
  backwards under a name of its own: a new animation on that part, so left for when pastel has a character.
- **datepicker, combobox, theme-menu, popover-row-actions, bar-equipment, phone-bar:** no animation (items 4 and 5,
  out of pastel's scope: pastel has no decided popover or menu entrance to give them). The palette stays the package's
  fade (identity FADE).
- **alarm 99.0 % (open 520, close 427):** the alarm's close differs from its open (item 4, out of scope).
- **wizard-step, empty-state, tabs-panel:** state changes, ignored per the brief.
- **Gates:** `gates/check-motion.mjs` will list `kp-sig-pastel-tour-ring` without a TIMINGS row (js/effects.js), as
  for forest's and cyberpunk's tour rings; js/* is outside this brief.

Tab paint (end): 41 stops, NOMARK only "Review in a dialog" and "Copy answer".

Measured wall time of the timed runs: pairs (all) 2 min 24 s, identity 1 min 3 s, tab-paint 1 min 13 s: 4 min 40 s;
four single-pair checks between fixes were not timed.

## Review round 2 (Kenny's rejections, 2026-10-13 20:37)

Kenny, on the bar, the palette, the date picker, the combobox, the alarm and the side navigation: "Niet de open/close
animatie van dit thema". Cause, for all six: pastel has no CHARACTER.md, so round 1 gave these parts only the
mechanism and no effect of pastel's own: the palette faded (motion.js's fallback), the date picker and combobox had no
motion, the alarm ran a landing of its own (a plate fade and a 6 px askew drop by transitions, a mint fill and an
overprint spring later) that closed as a fade, the side navigation slid 220 ms, the bar's dropdown and mega menu faded
in and vanished. Pastel's one decided opening is the dialog's **sheet** (`kp-sig-pastel-pastel-sheet`, approved on
research/signature-elements: up from 18 px below, turned -2.5 degrees, out of nothing, springing into place on
`--fx-ease`), seen in 427 ms (js/motion.js plays the 640 ms entrance in the dialog's close time) and closing as that
backwards. Every one of the six now opens with that sheet in those 427 ms on that curve and closes as it backwards.
Changed: `css/pastel-register.css` only (a new block at the foot of `kp.signature`, the alarm block in `kp.register`,
one `@property` at the top).

| Part | Change (selector) | Pairs before → after | Identity before → after |
|------|-------------------|----------------------|-------------------------|
| palette, shortcut sheet | `:is(.kp-palette, .kp-shortcuts)` take the dialog's own rule (sheet, 640 ms, js/motion.js turns it round) | 427/427 0.3 % → 427/427 0.3 % (it passed as a fade) | FADE → OWN |
| date picker | `.kp-datepicker__panel` sheet 427 ms; playClose() plays it backwards | 220/220 100.2 % → 427/427 2.4 % | NONE → OWN |
| combobox | `.kp-combobox__list` sheet; `kp-sig-pastel-sheet-placed` (see below) | 0/0 100.0 % → 427/427 0.0 % | NONE → OWN |
| alarm | plate `.kp-alarm[open]` `kp-sig-pastel-sheet-ground` (the sheet's fade), `.kp-alarm__panel` `kp-sig-pastel-sheet-lay` (its drop and turn), 640 ms `--fx-ease`; the transitions, `@starting-style`, the code's fill and the overprint's spring removed (words, plate and overprint come with the panel) | 520/427 99.0 % → 427/427 0.4 % | close FADE → OWN/OWN |
| side navigation (over, push, window edge) | `[data-kp-sidenav-open='true']` sheet where it stands, `translate 0s`; `='false'` `kp-sig-pastel-sheet-back` reversed, then `translate 0s` after 427 ms (it no longer slides); the push content glides on 427 ms `--fx-ease` and back on its reflection `cubic-bezier(0.36, 0, 0.66, -0.56)`; backdrop 427 ms | sidenav 220/220 0.3 % → 427/427 0.3 %; push 0.0 → 0.0 %; edge-push 0.0 → 0.0 %, edge-gutter 0.1 → 0.1 %, edge-over 1.5 → 1.5 %, edge-tab 1.5 → 1.5 % (all at 427 ms) | OWN (slide) → OWN (sheet) |
| side navigation, rail flyout | `.kp-sidenav__flyout` sheet (the ghost close plays it back) | 0/0 100.0 % → 427/427 0.0 % | - |
| bar: hover dropdown, mega menu | `--kp-nav-close-time: 427ms` (0 ms under reduced motion); in `@container kp-nav (width > 40rem)` the open item's panel takes the sheet, a closing dropdown is held `display: block` and plays `kp-sig-pastel-sheet-back` reversed; the mega menu is held by a 427 ms transition of `--kp-sig-pastel-hold` (new `@property`) | bar-equipment 0/0 100.0 % → 427/427 0.2 % | dropdown FADE/NONE → OWN/OWN; mega NONE → OWN |
| bar: phone panel | collapsed, `[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` sheet, `[data-kp-nav-closing]` sheet-back reversed; nested lists still | 0/0 → 427/427 0.0 % | NONE → OWN (frame and 390 px) |

Seen frame by frame in the review stage (research/all-themes-applied/demo.html, real clicks, animations paused and
sought to 0, 60, 120, 200, 300, 427 ms): each part comes up out of nothing from below with the -2.5 degree turn and
springs flat, and the close shows the same frames in reverse order; the alarm's plate fades while its card turns into
place; the side panel is laid where it stands.

**Combobox placement, found while measuring:** js/top-layer.js `raiseInPlace()` measures the list where it is drawn
the moment it opens and sets aside a move but not a turn, so with the sheet the list stayed 4 px left, 12.6 px low and
8 px wider than the field for as long as it was open (also the cause of a NOMARK on the combobox in tab-paint, whose
"mark" there is the open list's edge). `kp-sig-pastel-sheet-placed` is the sheet with the turn held back on its first
frame, which is fully transparent: measured, the list hangs 4.0 px under the field at its width, as without motion;
every visible frame is the sheet's.

Pairs (full run, 32 rows): 17 of 32 → 23 of 32. Identity: 4 of 14 OWN on open and close → 12 of 14. Tab paint: 41
stops, only "Review in a dialog" and "Copy answer" NOMARK.

### Deviations for Kenny

- **Every part above borrows the dialog's sheet** (pastel decides nothing for them): the date picker, the combobox
  and the bar's menus could instead take the tooltip's bubble (`kp-sig-pastel-pastel-bubble`, a pop from its corner,
  420 ms), pastel's only other opening; the sheet was chosen so that everything that opens in pastel opens one way.
- **The side navigation no longer slides in** from its edge: it is laid where it stands as the dialog is, and goes
  back behind its edge only after the sheet has gone. The push content glides aside in the sheet's time.
- **The alarm lost its staged landing** (the mint plate filling at 300 ms, the overprint springing at 200 ms): with
  delays js/motion.js cannot turn it round; plate and card come together.
- **Timing:** 427 ms (the dialog as seen) where these parts had 220 ms or none.

### Still failing / not done

- **theme-menu, popover-row-actions** (identity NONE, pairs 0/0): menus and popovers have no motion in pastel and
  were not among the rejected parts; one selector (`.kp-popover:not(.kp-tooltip)`, `.kp-theme-menu__list`) would give
  them the sheet as well.
- **sidenav-rail-tip** 0.0 % (the pair's setup, every theme), **tour** 62.0 % (meter window, round 1), table-busy,
  calendar-busy, wizard-step, empty-state, tabs-panel: as in round 1.
- **Gates (js/* is outside this brief):** `gates/check-motion.mjs` asks TIMINGS rows (js/effects.js) for
  `kp-sig-pastel-sheet-ground`, `kp-sig-pastel-sheet-lay`, `kp-sig-pastel-sheet-back` and `kp-sig-pastel-sheet-placed`.
- **Observation:** the combobox's input shows almost no focus ring of its own in pastel (outline in the page's colour,
  a 0 px shadow); tab-paint passed it only by the list opening under it.

### Applied 2026-10-13

Pastel has no CHARACTER.md, so the note stands here: every part that opens (dialog, drawer, palette, shortcut sheet,
date picker, combobox, rail flyout, alarm, side navigation, the bar's dropdown, mega menu and phone panel) opens with
the dialog's sheet as seen (427 ms, `--fx-ease`) and closes as it played backwards; the tooltip keeps its bubble and the
toast its slap; menus and popovers still have none.

### Review round 2, follow-up (coordinator, 2026-10-13)

- **Menus and popovers:** `:is(.kp-popover:not(.kp-tooltip, .kp-sidenav__flyout), .kp-theme-menu__list, .kp-menu-button > .kp-menu)`
  take the sheet (`kp-sig-pastel-sheet-placed`, 427 ms, `--fx-ease`); a menu or popover inside a popover plays
  nothing of its own; tooltips keep the bubble. Pairs: theme-menu 0/0 100.0 % → 427/427 0.0 %, popover-row-actions
  0/0 100.0 % → 427/427 0.0 %; the menu button's menu opens with the sheet and closes with it reversed (427 ms). Placement
  measured against the opener, with and without the sheet: identical (theme menu 0/4 px, row actions 0.4/4.7 px, menu
  button 0.3/5.1 px). Identity: 12 → 14 of 14 OWN.
- **Combobox focus:** `.kp-combobox__input:focus-visible` takes the package's field ring (2 px `--focus-ring` inside the
  page-coloured outline), as every pastel field shows it; css/components.css gave the combobox only a border colour,
  pastel's resting one. Tab paint with the open list hidden: 0 px → 1118 px (a field: 1080 px); in the plain run
  1368 px, marked.
- Full run: **25 of 32** (was 23). Left: tour (meter window), sidenav-rail-tip (pair setup), calendar-busy,
  table-busy, wizard-step, empty-state, tabs-panel, as in round 1. Tab paint: only the two allowed NOMARK.
