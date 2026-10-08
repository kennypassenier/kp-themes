# What is retro's anchor element

**Open (2026-10-08).** Kenny's verdict pending in the review dialog.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Retro has no anchor: its register draws the 1995 desktop (the page
one window on the teal, the navy title-bar ramp, bevels, sunken wells, the dither, the navy progress blocks, the selection bar, the
hourglass) and moves it in hard steps, nothing easing, but no one moving thing decides how the rest arrives, waits, points, presses and
leaves; a dialog is a stepped scale and every other arrival is a stepped copy of it.

**What.** One page, retro only, one question (one page in the review dialog's aspect mode, `data-review-themes="retro"`), seven
candidates, each drawn only from what retro's world already owns. Each option is one live scene with three places on one clock: the anchor
in its own scene (centred, large), as a progress bar, and as a button press, so the reviewer sees whether it carries the theme. Nothing
eases in any of them: every animation is `steps(n)`, `step-end` or `step-start`.

| #   | Candidate                                          | What it draws                                                                                                                                                                                                                     |
| --- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The window zooms open in outline (**recommended**) | four dotted outlines step up from the taskbar button to the window's place, one frame each, then the window is painted whole; the bar fills a block a step; the press is the register's bevel press                               |
| 2   | The hourglass turns                                | the register's hourglass large beside a waiting window, sand draining in seven hard frames, the glass turned in one step and the body painted; a small glass drains at the bar's end; the pointer becomes the glass on the button |
| 3   | The selection bar snaps on                         | the navy bar snaps down a Start-menu list row by row (ink going white under it); the bar is the selection painted a block a step; the button is selected, navy and white                                                          |
| 4   | Dissolved through the dither                       | a cover in the four densities (`--kp-dd-*`) lifts off the window in four hard steps; each new block comes in through three densities; the face dissolves to pressed through two densities                                         |
| 5   | Marching ants select it                            | a dashed line is drawn round the window body and marches, then the lines are selected; a dashed box marches ahead of the blocks; the focus rectangle is drawn round the button                                                    |
| 6   | The progress blocks fill                           | the install wizard: a well fills with navy blocks a step, then the window's lines are painted; the face of the button is filled in four blocks                                                                                    |
| 7   | The window becomes active                          | a grey inactive window is clicked: the title bar takes the navy ramp, the frame its raised bevel and hard drop, the text its ink; the well wakes before the blocks; the button takes the default ring                             |

**Recommendation and why.** The window zoom: it is the most remembered motion of that desktop, no other theme can have it (every other theme
opens by a clip, a fold, a rise or a fall; none zooms in outline), it is hard steps by nature so it keeps retro's one law, and it decides at
once how everything opens and closes (a window, a dialog, a menu, a toast; a tile zooms from its button; the leave is the outline zooming
down), where the bevel press, the blocks and the hourglass already decide the rest. The hourglass is the runner-up (the theme's one bespoke
moving object) but it is a wait, not a way of opening or closing; the selection bar and the dither are already everywhere in the register;
the ants overlap forest's blaze and terminal's dashed box in grey; the blocks are a bar; activation is a colour step a theme switch could
do.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 90 ms, whole frames of the 1995 desktop); `demo.js` and `demo.css` are the engine and the page shared by every anchor demo
  of this round (copied unchanged from `research/formal-anchor`).
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held, the
  window painted), out 8; 22 units is a loop. The clock counts only unpaused time, so the dialog's Pause freezes a scene where it is.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`, because the review
  dialog moves the section into its stage. The base style of a part is its drawn pose, so reduced motion shows the finished picture; `gap`
  sets the undrawn pose. Every open is a keyframe pair (`rt-x`, `rt-x-out`), and a run of steps is mirrored by swapping the jump
  (`jump-end` in, `jump-start` out), so every close is its open reversed; the open runs half a millisecond early and the close half a
  millisecond late, so both sides of every jump agree to the instant. Every colour is a token; the bevels are the register's own
  `--kp-raised`, `--kp-pressed` and `--kp-sunken`, the title bar `--kp-ramp`, the dither `--kp-brush` and `--kp-dd-*` / `--kp-dm-*`.
- Measured as seen (`node research/_review/measure-motion.mjs research/retro-anchor`): pending.
