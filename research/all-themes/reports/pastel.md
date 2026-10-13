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
