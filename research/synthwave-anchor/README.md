# Synthwave's anchor element, round 2

**Why.** Round 1 offered six anchors. Kenny, 2026-10-07 20:41: option 1, the neon horizon, is the one he likes, "but not sure how that
plays out in real life, like that button press, that's waaay bigger than the button itself? that's not right? come up with a couple of
new attempts and show them in an actual page before attempting the next demo." The fault: round 1 drew the anchor on a stage of its
own, at a scale that is not the real component's, so the press chip struck a tube and floor several times the size of its button.
**The principle now: the anchor is a proportionate part of the real components, drawn at each component's real size.** Each attempt is
defined by ONE rule of scale (what the tube and the floor are relative to the component they belong to), so it stays proportionate at
every size.

**What.** One page, synthwave only, review kit aspect mode (`data-review-themes="synthwave"`, round marker `2026-10-07-anchor-r2`,
reopening the pair): one question, "which attempt is synthwave's anchor?", four attempts, one per dialog page. Each is a real page of
the package's own components at their real size: `.kp-page-header` with secondary, plain, primary and icon buttons, `.kp-alert`, four
`.kp-kpi` tiles, a `.kp-card` with a `.kp-progressbar` (looping 0 to 100 %) and a busy `.kp-table`, a `.kp-card` form with a valid and
an invalid `.kp-field`, a dialog-trigger button, `.kp-badge`s and a `.kp-toast`. At 390 px it reflows like a real page. It plays by
itself (gap, in, hold, out; the leave is the arrival reversed); during `hold` the loop hovers and presses the primary button, hovers a
tile and focuses a field, with the same classes (`sa-hot`, `sa-down`, `sa-focus`) a real pointer sets, so hovering and pressing by hand
looks the same. Controls: state (cycle, at rest, arriving only), replay, speed x1/x2/x4 (also the dialog's own). Reduced motion shows
the finished pose, the progress at 62 %. Under each page the numbers are measured from the real components.

| #   | Attempt           | Rule of scale                                                                                                                                                                                           | Existing synthwave part that already shows it                              | Honest overlap                                                                                                     |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | The foot line     | tube on every component's foot, the component's width x 2 px; floor 42 % of its height (four rows, cell at least 7 px), blocks only                                                                     | the tape stripe and neon base of every card, the toast's stripe, busy road | solstice's horizon divider, nostromo's tube strike; here it is on each foot with a floor above                     |
| 2   | The page horizon  | ONE tube, the page column x 3 px, on the header's foot; floor is the page below; components carry 1 px of light; under a hand the tube brightens exactly as wide as the component                       | the band's neon rule, the hero's horizon and floor                         | solstice's horizon divider is the same idea of one line; here it has a floor and follows the hand                  |
| 3   | The lit length    | hairline on each stateful component's foot; the lit part = state x width, 2 px (progress, rows in, validity, tile value, button ready)                                                                  | the progress head, the meter in a key figure, the check's tube strike      | every theme's progress bar; nostromo's LED bank (a row of lamps, not one line)                                     |
| 4   | The press horizon | hairline as wide as the component; its height is the state: none at rest, foot on hover, 80 % of the height on press or busy, floor 20 % under it; the same tube is the arrival, riding the rising edge | the button's sun cut, the dialog's horizon rise                            | nostromo's tube strike, cyberpunk's edge wipe; a fixed share of the component with a floor under it is synthwave's |

Strict grammar in every attempt: horizontal cuts, radius 2 px, nothing notched, nothing flickers, near-white core with the colour in
the glow, pink signals, cyan labels, laser yellow warns. Kept out (another theme owns them): glitch, sun on an arc, LED bank, hard slab,
dimension lines, block cursor, growth, mis-registered plates. The network graph is not touched.

**How it is built.** `demo.js` holds the four attempts as data and builds the same real page per attempt (`realPage`), appends one
`.sa-fx` overlay (a size container, so `cqh`/`cqw` are the host's own height and width) to every `[data-sa-host]`, and runs the one clock
(`gap 700, in 2000, hold 4000, out 2000`, writes `data-sa-phase`) and the hand. `options.css` (layer `kp.signature`; tokens on
`:is(.sa-page, .rv-dialog__stage)`) draws each attempt, scoped by `data-sa-anchor`. Every part that arrives has `.sa-arr` and a kind
(`sa-k-fade|draw|lit|rise|scan`) with `--d` and `--t`; everything lands together at `--T` (1600 ms) and later parts start later, so each
leave is its arrival reversed (same keyframes under a `-r` name, `animation-direction: reverse`, delay `T - d - t`). The page is ONE
measure cell (`.sa-part` on `.sa-real`, one `.sa-mark`), so the whole page reverses as one. The page glue (padding, corner-pinned toast)
is in `demo.css`, unlayered, because `kp.layout` comes after `kp.signature`. Colours are tokens only.

**Measured** (Firefox, 1600 px, `node research/_review/measure-motion.mjs research/synthwave-anchor --base http://127.0.0.1:8747`):
every part of every attempt "mirror", no FRONT, no BLINK, no cut-in or cut-out (arrival span 1600 ms; first visible change 180 to
1100 ms, nine tenths done 800 to 1370 ms). In the dialog (clicking `[data-rv-open]`) the tokens are defined in `.rv-dialog__stage`, the
animations run (18 to 27 per attempt) and nothing overflows sideways. Real sizes at 1600 px: primary button 221.1 x 36 px, tube
221.1 x 2 px (button height : tube = 18 : 1); card 608 x 333.8 px, foot floor 138.1 px (41 %); page tube 1228 x 3 px (12 : 1 against the
button); tile 298 px wide, lit 277 px (93 %); pressed (attempt 4) the tube is 28.8 px down a 36 px button, 7.2 px of floor.

**What could not be made true.**

- The dialog fits a tall demo with the kit's `zoom` (down to 0.4), so the page is shown uniformly smaller there (proportions are the
  same); the page itself, and every number above, is at 1:1.
- The tile's meter and the foot tube compete in attempts 1 and 3 (two bars at one foot); the meter was kept on two tiles so both can be
  seen.
- Attempt 4 draws nothing at rest by design; on the page only the busy table shows it until a hand arrives.
- The package's own toast entrance is switched off for the demo's clock (`.kp-toast.sa-arr::before`); the real toast leaves with the
  synthwave sunset, which is not shown here.
- Contrast: all text reads at AA or better; the faint floor grid and hairline ghosts are not text and fall below AA by design.
