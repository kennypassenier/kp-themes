# What is light's anchor element

**Open (2026-10-08).** Kenny's verdict pending in the review dialog.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Light has no anchor: its anatomy forbids ornament, its register
leaves in a glare and opens a window, its one drawn ornament (the seam with its circle) is still, and the only part that moves is the
bead of its progress bar.

**What.** One page, light only, one question (one page in the review dialog's aspect mode, `data-review-themes="light"`), seven
candidates, each drawn only from what light's world already owns (white, ink, indigo, and light itself). Each option is one live scene
with three places on one clock: the anchor in its own scene (centred, large), as a progress bar, and as a button press, so the reviewer
sees whether it carries the theme.

| #   | Candidate                                         | What it draws                                                                                                                                                                          |
| --- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The bead of light runs the seam (**recommended**) | a cyan bead runs the card's seam on light's settle curve, the seam lit indigo behind it, the bead resting as the divider's open circle; the bar's head; a bead lands on the pill's end |
| 2   | A window opens                                    | the card opens from a rounded slit at its centre; the bar's line opens from its middle; a slit of white light across the pressed pill                                                  |
| 3   | The highlighter reads it                          | a pale-cyan highlighter is drawn behind each line in turn and the words turn full ink; the track highlighted ahead of the line; a wash sweeps the pill                                 |
| 4   | Daylight crosses it                               | a band of daylight crosses the grey card and leaves it white with a lit edge; the band crosses the track leaving the line; the band crosses the pill                                   |
| 5   | Overexposed: out of the glare                     | the card comes down out of a blurred, too bright glare into focus; the line comes out of the glare as it fills; the face overexposes and settles                                       |
| 6   | A ring of light settles on it                     | a cyan ring blooms out of the card's centre past its edge and tightens onto it; a ring opens round the bar's head; the ring tightens onto the pill                                     |
| 7   | The shadow lifts                                  | the card rises 6 px as its shadow grows from the softest to the deepest step; the line gains a soft shadow as it fills; the pill settles, its shadow tightens                          |

**Recommendation and why.** The bead: it is the one drawn thing light already owns three times over (the head of the progress bar, the
beads of the spinner, the circle on the seam of every divider), it makes the theme's only ornament move without adding one, and it gives
loading (the bead runs until the reading is there), arrival, hover (the bead resting at a control's end), press (it lands), focus, live
update (it passes the changed figure) and leave (the bead gone, the seam grey) from one object. No finished theme owns it: solstice's sun
rises on an arc, synthwave's light is a tube, deco's glint runs along gilt; light's bead is a dot of light on a hairline and never rises.
The window and the glare are what the register already does on every arrival and leave, so they add least; the highlighter is strongest
on text and close to pastel's mark; daylight is the loading picture of the meter and a shimmer every skeleton has; the ring is a state,
not a motion; the lifting shadow is what every UI kit does.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 100 ms); `demo.js` and `demo.css` are the engine shared by every anchor demo of this round, copied unchanged from
  `research/formal-anchor`.
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held), out
  8; 22 units is a loop. The clock counts only unpaused time, so the dialog's Pause freezes a scene where it is. Replay restarts it; the
  speed buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`, because the review
  dialog moves the section into its stage. The base style of a part is its drawn pose, so reduced motion shows the finished picture; `gap`
  sets the undrawn pose. Every open is a keyframe pair (`lt-x`, `lt-x-out`), so every close is its open reversed: a part's delay is
  mirrored (`8 - delay - length` units) and its curve is the inverse of the open's (light's settle `--kp-ease-arrive`, 0.16 1 0.3 1,
  closes on 0.7 0 0.84 0; timing functions inside `@keyframes` are written out, never `var()`).
- The progress bar is drawn as the register draws it (`.kp-progressbar`): a 2 px hairline, a 4 px indigo line clipped to the value, a
  white-ringed cyan bead at its head that turns indigo when the bar is full; the button's rest and pressed grounds are the package's
  `--secondary` and `--secondary-active`, the press is the register's hover (settles 2 px, shadow tightened).
- Measured as seen: pending (`node research/_review/measure-motion.mjs research/light-anchor`).
