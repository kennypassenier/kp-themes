# What is high-contrast's anchor element

**Decided (Kenny, 08/10/2026): the theme is dropped.** "we are actually not going further with high contrast, the theme can be removed from everywhere" (review dialog). The theme was removed from the package; no anchor was chosen. Recorded in decided.json.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. High-contrast has no anchor: it is black on white with one signal
yellow, its register changes by a switch and never by a fade, and its signature pieces (the walking spinner, the hazard-striped bar, the
"✕ REMOVED" plate on a leave) are not yet one idea. Kenny's binding rule for it: contrast may never go down (no opacity between 0 and 1,
no blur, no grey but `--muted-foreground`, no gradient wash; every change a hard step or a clip-path wipe; yellow a plate under black ink).

**What.** One page, high-contrast only, one question (one page in the review dialog's aspect mode, `data-review-themes="high-contrast"`),
seven candidates, each drawn only from what high-contrast's world already owns (the sign: ink, paper, one signal yellow, line weight). Each
option is one live scene with three places on one clock: the anchor in its own scene (centred, large), as a progress bar (the register's own,
ticked, ink-framed, with its yellow head), and as a button press, so the reviewer sees whether it carries the theme.

| #   | Candidate                                     | What it draws                                                                                                                                                                                |
| --- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Announced: the sign says it (**recommended**) | a board placed in one step, a yellow plate "✓ READY" wiped in across its top edge and off again; a flag plate "62 %" on the bar's head; the press inverts, a yellow bar wipes along the foot |
| 2   | The marker walks to it                        | a yellow square walks five framed cells, 1.75 units in each, every cell it leaves filled ink; the bar is ten cells; the square lands beside the label                                        |
| 3   | The frame thickens                            | a hairline board thickens 2, 3, 4 px in three steps and its title goes bold; the bar's frame thickens as the ink fills; the button's frame goes 2 px to 4 px                                 |
| 4   | A sign in the corner                          | title then line placed, then a yellow ✓ sign cut into the top corner; a ✓ sign at the full bar's end; a ● sign in the button's corner                                                        |
| 5   | Inverted: the plate flips                     | the board placed, then flipped to ink with a paper rule inside its frame; the ticks flip one by one; the button flips to ink                                                                 |
| 6   | Tape is run across it                         | hazard tape run across the board's top edge in ten steps, then the lines placed; stripes one cell ahead of the ink; a strip of tape across the button's foot                                 |
| 7   | Placed cell by cell                           | frame, title, line, foot rule each placed whole, taken apart last first; one tick per step; the button placed inverted                                                                       |

**Recommendation and why.** The announcing plate: it is the one whole idea the register already has (the "✕ REMOVED" leave: a yellow plate
in a frame with a caption, wiped in, then gone in a step), it is what a sign does and what a screen reader does, it keeps every rule of the
theme (hard steps, a wipe, a plate, 21:1 ink), and it gives every state a word of its own: ✓ READY, ● LOADING, ↻ UPDATED, ✕ REMOVED. No
finished theme speaks on the way in or out. The walking square is the spinner's own but needs a row of cells to walk; the thickening frame
says "important" and not "here" or "done"; the corner sign is small; the flip is terminal's reverse video and brutalism's hover; tape is
brutalism's tone and cyberpunk's stripes and says only "wait"; placing cell by cell is a rhythm, not an object.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 120 ms); `demo.js` and `demo.css` are the engine shared by every anchor demo of this round (copied unchanged from
  `research/formal-anchor`; it builds the one row, `data-an-aspect`, option cells `data-an-option`, and writes `data-review-choices` from the
  same data).
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held), out 8;
  22 units is a loop. The clock counts only unpaused time, so the dialog's Pause freezes a scene where it is. Replay restarts it; the speed
  buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`, because the review
  dialog moves the section into its stage. The base style of a part is its drawn pose, so reduced motion shows the finished picture; `gap`
  sets the undrawn pose. Every open is a keyframe pair (`hc-x`, `hc-x-out`), the out written by mirroring the open (blocks reversed, a
  step-end becomes a step-start, steps(n, jump-end) steps(n, jump-start), an eased animation sets `--an-ease-out` to the inverse curve), so
  every close is its open reversed. A jump sits a hair off the clock's 0.25-unit grid (a keyframe at 87.49 %, a delay of 0.001 unit) so that
  a sample taken exactly on the grid sees the same pose going in and coming out.
- Measured as seen: pending (`node research/_review/measure-motion.mjs research/high-contrast-anchor`). The mirror check
  (in `out`, every part's pose at T-t equals its pose at t in `in`) reads "mirrored" for all seven scenes.
