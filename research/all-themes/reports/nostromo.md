# Nostromo: close = open reversed, and the raster on every part that opens

Audit of 2026-10-13, Firefox only. Changed: `css/nostromo-register.css` (a "Pairs" block at the foot of
`kp.signature`, plus one top-level `@property --kp-sig-no-hold`), and an "Applied 2026-10-13" note at the
end of `themes/nostromo/CHARACTER.md`. The focus rule of lesson 41 (the selected tab) is untouched.

Result: **11 of 26 pairs passed before, 20 of 26 after** (`out/nostromo/pairs-before.txt` against
`out/nostromo/pairs.txt`). Identity by `identity-summary.mjs`: before 7 of 14 parts OWN both ways (palette
FADE, date picker and combobox NONE, the bar's four parts FADE or NONE; the alarm and side navigation read
OWN but ran the package's rise-and-scale and a slide); **after 14 of 14 OWN, all of them the raster**.
`identity.mjs` itself: 3 → 10 of 14 (the four it still fails are a labelling artefact, see Still failing).
Tab paint: 43 focus stops, only "Review in a dialog" and "Copy answer" read NOMARK (before: 41 stops, the
selected tab NOMARK as well).

Nostromo declares `--kp-open: reverse-close` and its leave (`kp-sig-nostromo-erase`) is the raster's draw
played backwards, so unlike grotesk nothing here is decided not to mirror.

## Fixes

| Part | Cause | Change (selector) | Before → after (pairs; identity) |
| --- | --- | --- | --- |
| upload file, alert, table busy | Leaves not asked (lesson 19), unseen spinner first (23), fold 1.25× from a third in (24). | Root `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0`. | upload 400/0 → 320/320, 0.0 %; alert 0/400 → 320/320, 0.0 % |
| table busy | After the tokens: 51.3 % off. The table's busy dim (`[aria-busy]` in layout.css, and its kept rows at 0.55) switched off at the start of the erase, while it had switched on at the first frame of the draw. | `.kp-datatable` and `.kp-datatable .kp-table tbody` take `opacity 0s linear 320ms` (on at once, off after the 4 frames), the package's resize transitions restated with it. | 320/0, 95.7 % → 320/320, 2.0 % (the status line's words) |
| tree | Branch children vanished at once (lesson 26). | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }`. | 0/240, 116 % → 320/320, 0.0 % |
| tour | Dim and ring in 350/250 ms `ease`, out in the default 1000 ms `ease-in`. | `[data-kp-tour-target]` transitions `box-shadow` and `outline-color` 320 ms `steps(4, end)`; root `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: var(--kp-sig-no-strike); --kp-tour-dim-close-ease: var(--kp-sig-no-back4); --kp-tour-dim-close-delay: 0s`, with `--kp-sig-no-back4` the four equal frames turned round (cyberpunk's `--kp-cp-back` pattern). | 350/1000, 18.0 % → 320/320, 2.6 %; OWN |
| palette | A bare fade (identity FADE/FADE; the pair passed on timing alone, lesson 38). | `:is(.kp-palette, .kp-shortcuts)[open]` takes `kp-sig-nostromo-raster` + `kp-sig-nostromo-beam-layer`, 4 frames. | 320/320, 0.0 % (unchanged); FADE → OWN |
| date picker | No entrance. | `.kp-datepicker__panel:is([data-kp-date-open], [data-kp-closing], [data-kp-reversing]):popover-open` takes the raster and beam. | 0/0 → 320/320, 5.7 % (pass); NONE → OWN |
| combobox | No entrance. | `.kp-combobox__list:popover-open` takes the raster and beam; the list says `--kp-open: own` (arrives as its own draw, cyberpunk's rule). | 0/0 → 320/320, 0.0 %; NONE → OWN |
| alarm | Passed on timing, but ran the package's entrance: a fade, a 1.25 rem rise and a 0.98 scale on the panel, a 1.06 scale on the headline (G3: nothing rises or scales). | `.kp-alarm[open]:not([data-kp-alarm-motion='still'])` takes the raster and beam (4 frames, tail 1.2 rem); panel, headline and reason none. | 320/320, 0.2 % → 0.1 %; package motion → raster |
| side navigation (over, push) | 24.3 % off: the package's backdrop is a 220 ms literal against the panel's 160 ms slide. And the panel slid in from its edge (G2: nothing slides in from a side). | `.kp-sidenav:is([over],[push])[data-kp-sidenav-open='true']` drawn by the raster and beam where it stands (`translate 0s`); `='false'` erased (no fill) and only then put away (`translate` and `visibility` `0s` after 320 ms; hidden at rest); `.kp-sidenav__backdrop` in the same 320 ms, `steps(4, end)`; `[data-kp-sidenav-shift]` moves at the first frame of the open and the last of the close. | 220/220, 24.3 % → 320/320, 0.9 %; push 160/160 → 320/320, 0.0 %; slide → raster |
| bar: mega menu (bar-equipment) | No animation either way (lesson 36). | `.kp-nav__menu` closed state `kp-sig-nostromo-erase` + `kp-sig-nostromo-beam-layer-erase`, `steps(4, jump-start)`, with a `--kp-sig-no-hold` transition the script waits for; `li:is(:hover, :focus-within, [data-kp-nav-menu-open]) > .kp-nav__menu`, `li:is([data-kp-nav-menu-open], :has(> [data-kp-nav-disclosure][aria-expanded='true'])) > .kp-nav__menu--wide` the raster and beam; `li[data-kp-nav-closing] > .kp-nav__menu` kept displayed; root `--kp-nav-close-time: 320ms` (0 ms under reduced motion). | 0/0 → 320/320, 0.0 %; NONE → OWN |
| bar: hover dropdown | Package fade in, nothing out. | Same rules. | identity FADE/NONE → OWN/OWN |
| bar: phone panel | No animation either way. | Inside `@container kp-nav (max-width: 40rem)`: `[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` the raster and beam, `[data-kp-nav-closing] > .kp-nav__links` the erase; nested menus in the open panel none. | 0/0 → 320/320 (meter limit, Still failing); identity NONE → OWN |
| calendar busy | The layers left at once and arrived by the package's 160 ms fade. | `:is(.kp-calendar__day-busy, .kp-calendar__busy)` `--kp-calendar-busy-leave: hold`, transition none; the loading selectors drawn by the raster; `[data-kp-leaving]` copies keep each layer drawn through the erase. | 160/0 → 320/320 (Still failing, as in forest) |

Theme values kept: 80 ms frames, the 320 ms strike, `steps(4, end)` for a draw and `steps(4, jump-start)`
for the erase, the beam's tails; every addition is the existing raster, beam-layer or erase keyframes.

## Deviations for Kenny

| Part | What it does now | Borrowed from |
| --- | --- | --- |
| Command palette, shortcuts sheet | Drawn by the raster from the top with the beam, 4 frames; closed as that backwards. | the dialog's and the toast's raster |
| Date picker panel, combobox list | Drawn by the raster with the beam; closed as that backwards. | the popover's raster |
| Bar dropdown, mega menu, phone panel | Drawn by the raster with the beam; erased as the leave erases (the same frames backwards). | the popover's raster; the leave's erase |
| Alarm | The whole alarm screen drawn by the raster from the top with the beam, headline and reason with it (was the package's fade, rise and scale). | the dialog's raster |
| Side navigation (over, push) | No longer slides in from its edge: switched on where it stands (drawn by the raster, 4 frames), erased when it closes, then put away and hidden. A push panel's content moves at the first frame of the opening and the last of the closing. | the dialog's raster; G2 |
| Side navigation backdrop | The package's fade, in the panel's 4 equal frames (was 220 ms on the 2-frame curve). | the raster's `steps(4, end)` |
| Tour dim and ring | In and out in the card's 4 equal frames (were 350 ms `ease` in, 1000 ms out). | the raster's `steps(4, end)` |
| Busy table's dim | Switches on at the first frame of the busy layer's draw and off after its erase (was off at the start of the erase). | G1: a change of state is one switch |

Not changed, for Kenny to judge: every dialog backdrop still fades by js/motion.js's fallback (`ease-in`,
mirrored, so the pairs pass); lesson 16 would give it the theme's own fade, which nostromo has not
decided (a screen does not fade; 4 equal frames would match the tour's dim).

## Still failing

| Pair | Reading | Reason |
| --- | --- | --- |
| phone-bar (both rows) | 320/320, 103.0 % at frame 0 | Meter limit: js/components.js ends the close with a real 320 ms timer that runs out while the meter takes its frames (the gate pair holds only 400-600 ms timers; forest 10 %, cyberpunk 104 %). With the timer held (a scratch copy of the pair, since removed) the close reads **0.0 %** off. |
| calendar-busy | 320/320, 112.4 % at frame 0 | The calendar repaints its days (tones and words) at once when its state changes, under the layers: the same cause and range as forest's 95-113 %. The layers themselves draw and erase as mirrors. |
| wizard-step, empty-state, tabs-panel | 320/0 83.6 %, 320/3200 122.5 %, 320/320 81.7 % | Ignored by the brief (state changes, not pairs). |
| identity.mjs: dialog, drawer, palette, alarm | "NOT split" | Labelling only: with `--kp-open: reverse-close` js/motion.js plays these as script animations (`script[clipPath]`, the beam's background layer), which identity.mjs does not name `kp-sig-nostromo-*`; `identity-summary.mjs` reads all four as OWN and the keyframes are the raster's. |

Measured wall time of the measurement runs: about 13 min (three full pair-meter runs, 2 min 49 s,
2 min 49 s and 2 min 31 s; identity twice, 1 min 5 s and 1 min 4 s; tab paint 1 min 14 s; targeted pair
runs and probes about 3 min).
