# What is sepia's anchor element

**Decided (Kenny, 08/10/2026): the theme is dropped.** "We are also stopping with Sepia, it may be deleted" (review dialog). The theme was removed from the package; no anchor was chosen. Recorded in decided.json.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Sepia has pieces of one (the ink stain a press leaves, the rule
that is thickest in the middle, the burn every leave ends in, the open-book spinner) but no single gesture the rest depart from, and it is
unhurried on purpose: nothing in its page chrome loops or shouts.

**What.** One page, sepia only, one question (one page in the review dialog's aspect mode, `data-review-themes="sepia"`), seven
candidates, each drawn only from what sepia's world already owns (aged paper and brown ink). Each option is one live scene with three
places on one clock: the anchor in its own scene (centred, large), as a progress bar, and as a button press, so the reviewer sees whether
it carries the theme.

| #   | Candidate                                        | What it draws                                                                                                                                                                     |
| --- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The ink spreads into the paper (**recommended**) | a drop of sienna ink lands at the end of the title and spreads, feathered, the title darkening under it; ink soaks along the dotted track; the stain spreads from the press point |
| 2   | The rule that is thickest in the middle          | the swelled rule drawn by hand under the title; the stroke itself is the fill; a short stroke is drawn under the label                                                            |
| 3   | Pressed by the platen                            | the platen's shadow comes down, the page takes a blind impression and the title the ink with a speckle; the rule grows blind and is pressed into ink; the face is bitten in       |
| 4   | The page turns                                   | a leaf turns down from its top edge over a sheet beneath, its curl's shadow fading; the fill turns in as a leaf; the face turns under the finger                                  |
| 5   | The dinkus is set                                | three sienna diamonds set one by one under the title, the middle first; the dinkus runs the dotted track and sits as the head; a diamond set beside the label                     |
| 6   | Burned at the edge                               | the page comes up out of its own char (the register's leave backwards); the rule uncharred; the face singed at its edge                                                           |
| 7   | The page foxes                                   | seven spots of ochre and sienna bloom across the page, the title's ink ageing; the rule on a foxed track; one spot under the finger                                               |

**Recommendation and why.** The ink: it is Kenny's own sentence for the theme ("the ink spreading into the paper on a press"), it is
already in the register on every button (the stain that outlasts the finger) and in the picks for the columns, the key figure and the busy
table, it is a liquid and not a line (so it is nothing of blueprint's pen, grotesk's rule or formal's seal), and it gives arrival (the
figure soaks in), hover (a shade wetter), press (the stain), loading (spreading and drawing back), live update (a fresh drop) and leave
(the ink drawing back until the page is bare) from one act. The swelled rule is the runner-up (the register's strongest static mark) but
it is a line being drawn, the anchor of two finished themes; the platen is seen in the result more than in the motion; the page turn is
a 3-D move on a flat theme and a tilt on a button; the dinkus says "finished" and little else; the burn is the right leave and the
wrong anchor (a loss on every hover, solstice's embers next door); foxing is a stain of neglect and says "waiting".

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 130 ms); `demo.js` and `demo.css` are the engine shared by every anchor demo of this round (copied unchanged from
  `research/formal-anchor`; it builds the one row, `data-an-aspect`, option cells `data-an-option`, and writes `data-review-choices`).
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held, the
  ink standing), out 8; 22 units is a loop. Replay restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`, because the review
  dialog moves the section into its stage. The base style of a part is its drawn pose, so reduced motion shows the finished picture; `gap`
  sets the undrawn pose. Every open is a keyframe pair (`se-x`, `se-x-out`), a part's delay mirrored (`8 - delay - length` units), and
  every eased open has its close on the inverse curve (`--an-hand`/`--an-hand-out`, `--an-soak`/`--an-soak-out`, `--an-stop`/`--an-stop-out`,
  written out literally inside the keyframes). The page, the bar and the stain are drawn like the register's (dialog mat, progress bar,
  `.kp-button::after` with the registered `--kp-ink-spread`).
- Measured as seen (`node research/_review/measure-motion.mjs research/sepia-anchor`): the measurement is pending.
