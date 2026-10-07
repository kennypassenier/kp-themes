# What is grotesk's anchor element

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, titanium: the new loading animation, cyberpunk: the glitch, solstice: the sun on its arc, terminal:
the block cursor, brutalism: the hard slab). The colours are already right and are the shared base. Grotesk's candidate so far was the
loading _Out of register_ (themes/grotesk/CHARACTER.md G10, G11); Kenny asked for more options.

**What.** One page, grotesk only, one question (one page in the review dialog's aspect mode, `data-review-themes="grotesk"`), five
candidates, each drawn only from what grotesk's world already owns. Each option is one live scene with three places on one clock: the anchor
in its own scene (centred, large), as a progress bar, and as a button press, so the reviewer sees whether it carries the theme.

| #   | Candidate                                    | What it draws                                                                                                                                  |
| --- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The baseline (**recommended**)               | the red rule the type stands on is drawn under a ghosted word and inks the letters it passes; bar and press the same line (unchanged)          |
| 2   | Out of register (refined)                    | skeleton text in two plates; the red plate travels round the ink in a closing spiral, falls into register, dwells 4 units, is released         |
| 3   | Overprint (new)                              | a red plate three columns wide passes over grey skeleton text; where it lies on a bar the two inks multiply into a deeper red                  |
| 4   | Reversed out (new)                           | a red field is set behind the skeleton text row by row (a staircase front) and the text is reversed out of it, paper on red                   |
| 5   | Jogged into register (new)                   | skeleton text as black keylines, the red fill printed off to one side, jogged home row by row in four counted stops                            |

**Round two.** Kenny's verdict on round one: "I like one and two, but with two, I feel like it could be refined still, and don't like the
crosshairs. But I like the general effect. Especially on the skeleton text. So come up with a couple more examples." The baseline stays.
Out of register lost the registration mark (a ring crossed by two hairlines) and every cross; its hero is now the skeleton text (a heading
bar and five lines) and the red plate no longer circles at a constant distance: the spiral closes and the plate falls into register in the
seventh of eight units, then dwells (the dwell is the clock's hold) and is released as the spiral played backwards. The twelve columns, the
train and the colour bands are gone; the three new candidates are print effects on the same skeleton text, each told apart by what carries the
effect (a blend, a polarity change, a counted gait) and from other themes' anchors (cyberpunk's glitch jitters cyan and red copies, brutalism's
offset is one still copy). Round id `2026-10-07-r2` reopens the page for his next verdict.

**Recommendation and why.** The baseline: grotesk's controls already draw it on every hover and press (scope-12), so hover, press, focus,
the live update (the train along it), the index and loading all depart from it without a new idea; it reads at a glance as Swiss type
on its line; no other theme owns it (blueprint's dimension line runs between two points, forest's and solstice's marks run along a foot, here
the line sets the type). Out of register is the strongest runner-up and stays the loading picture whichever is picked: it speaks for waiting
only. Overprint, reversed out and the jog each say one thing (a blend, a polarity, a gait) and none has a hover or a press of its own.

**How.**

- `demo.js` holds the candidates as data (`ANCHORS`: see, what follows from it, verdict, three captions, three markups), builds the one row
  (`data-ga-aspect`, option cells `data-ga-option`) and writes `data-review-choices` from the same data.
- The page's one clock writes `data-ga-phase` on every `.ga-scene[data-ga-kind="cycle"]`: gap 2 units, in 8, hold 4 (the dwell, the press held),
  out 8; a unit is the register's 120 ms; 22 units is the graph's loop. The clock counts only unpaused time, so the dialog's Pause freezes a
  scene where it is. Replay restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone (the tour steps through them).
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.ga-scene`, never on `.ga-page`, because the review
  dialog moves the section into its stage (forest's demo lost every option animation this way, 48bfa5b3). The base style of a part is its drawn
  pose, so reduced motion shows the finished picture; `gap` sets the undrawn pose. Every open is a keyframe pair (`ga-x`, `ga-x-out`), so every
  close is its open reversed, a part's delay mirrored (`8 - delay - length` units). Out of register is on the same clock too (the spiral is `ga-fall` / `ga-fall-out`), so Pause and Replay hold it.
- Measured as seen (`node research/_review/measure-motion.mjs research/grotesk-anchor`, Firefox, 1600 px): out t50/t90 = in, mirrored in
  time. Baseline ink 460 / 870 ms, overprint plate 480 / 870, reversed-out bar 490 / 880 (button 460 / 870), jog fill 480 / 960 in and
  480 / 720 out (counted stops: the out uses `steps(4, jump-start)`, the open's mirror). The staggered rows mirror (row 1 in 290 / 540,
  row 6 out 290 / 540). The spiral is flagged FRONT by the tool (in t50 130 / t90 200 of 840 ms): its x component first crosses zero at the
  first quarter turn; the plate moves at an even angular pace for the whole 840 ms. The tool's CUT flags read the clock's units as ms and
  are artefacts. Frame by frame (every 20 ms, Firefox) every animated part's out equals its in reversed, worst difference 0 of range.
