# What is formal's anchor element

**Decided (Kenny, 08/10/2026): The account is closed: the double rule** ("formal-anchor · formal: The anchor element = The account is closed: the double rule"); the seal (recommended), the signature, the redaction, the ribbon, squaring up and blotting were not chosen. Recorded in decided.json; the character round builds on it.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Formal has no anchor: its register moves by fades and rises, and
its one stated gesture (the rule that doubles 2 px inside a hovered control, gap-4) is quiet by design.

**What.** One page, formal only, one question (one page in the review dialog's aspect mode, `data-review-themes="formal"`), seven
candidates, each drawn only from what formal's world already owns (paper and ink, the clerk's desk). Each option is one live scene with
three places on one clock: the anchor in its own scene (centred, large), as a progress bar, and as a button press, so the reviewer sees
whether it carries the theme.

| #   | Candidate                                    | What it draws                                                                                                                                                         |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The seal is pressed (**recommended**)        | a navy seal drops on the minute, dead stop, its rim spreads into the paper, held, lifted; the bar is sealed when full; the press is the rim spreading from the button |
| 2   | The account is closed: the double rule       | a navy rule ruled under the figure from the start, a thinner second rule closes it; the bar closed at the end; the hover rule doubled on press                        |
| 3   | Countersigned: the signature dries           | one flourish written by path length at a pen's pace, wet while written, dry in the last beat; a nib writes the band; a stroke signs the button                        |
| 4   | Cleared: the redaction is lifted             | ink-black bars over the minutes cleared toward the start line by line; the bar cleared from the start; a bar strikes under the label                                  |
| 5   | The ribbon marks the place                   | the bound volume's gold ribbon drops into the page and marks a line; the ribbon hangs at the band's head; a ribbon drops over the button's end                        |
| 6   | Squared up on the desk                       | a sheet laid down 2.5° off and tapped square; the band laid in at a tilt and squared; the press lands on a corner and the release squares it                          |
| 7   | Blotted: the wet ink dries under the blotter | a figure written wet and blotted dry as the blotter rocks across; the wet band blotted; the press is the blotter laid on the face                                     |

**Recommendation and why.** The seal: it is what Kenny's own formal picks keep reaching for (the seal is pressed for the busy table and
the key figure, re-sealed for the state word, the raised seal on a tile, the voided stamp), it says "official" in one gesture, and it
gives hover (the seal held just above the paper), press (the rim spreading from the control), arrival (sealed, dead stop), live
(re-sealed), loading (pressed and lifted until the reading is there) and leave (lifted) without a new idea. No finished theme owns it:
brutalism's stamp is a still, sepia's seal is a bead in a row, titanium presses by dropping a pixel. The double rule is the runner-up
(it is the gesture formal's controls already make), but it is a drawn line under type, grotesk's territory. The signature overlaps
blueprint's pen and sepia's quill; the redaction hides what it announces; the ribbon puts gold on every press against formal's own
colour rule; squaring is a dialog's gesture more than a control's; blotting belongs to sepia's warmer paper.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 110 ms); `demo.js` is the engine shared by every anchor demo of this round (it builds the one row, `data-an-aspect`, option
  cells `data-an-option`, and writes `data-review-choices` from the same data).
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held, the
  seal down), out 8; 22 units is a loop. The clock counts only unpaused time, so the dialog's Pause freezes a scene where it is. Replay
  restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`, because the review
  dialog moves the section into its stage. The base style of a part is its drawn pose, so reduced motion shows the finished picture; `gap`
  sets the undrawn pose. Every open is a keyframe pair (`fm-x`, `fm-x-out`), so every close is its open reversed, a part's delay mirrored
  (`8 - delay - length` units).
- Measured as seen (`research/_review/measure-motion.mjs` run with Chromium, since this session has no Firefox; 1280 px): the seal
  lands t50 290 / t90 420 ms of its 440 ms drop (dead stop at 4 units), the bar's seal 740 / 770 ms; the rule is ruled t50 330 /
  t90 600 of 660 ms, the second rule 770 / 860; the signature's flourish t50 310 / t90 550 of 610 ms, its cross 690 / 760, dry at
  880; the redaction bars clear t50 90 / 260 / 420 ms, each 410 ms long, 1.5 units apart; the ribbon drops t50 390 / t90 700 of
  770 ms; the sheet is laid t50 200 / t90 730 (laid by 550, squared 660–880); the dry figure is revealed t50 550 / t90 730 under
  the blotter (330–770). Every close is its open reversed: a mirror check (the pose of every animated part at t into `in` against
  its pose at T − t into `out`, every quarter unit, Chromium) finds all seven scenes mirrored. Two things made that hold and bind
  every anchor demo of this round: a timing function inside `@keyframes` is written out (a `var()` there is invalid and falls back
  to `ease`), and an eased open closes on the curve's inverse (`--an-commit-out`, `--an-drop-out`: cubic-bezier(1 − x2, 1 − y2,
  1 − x1, 1 − y1)).
