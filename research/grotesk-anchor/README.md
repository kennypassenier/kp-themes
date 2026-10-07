# What is grotesk's anchor element

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, titanium: the new loading animation, cyberpunk: the glitch, solstice: the sun on its arc, terminal:
the block cursor, brutalism: the hard slab). The colours are already right and are the shared base. Grotesk's candidate so far was the
loading _Out of register_ (themes/grotesk/CHARACTER.md G10, G11); Kenny asked for more options.

**What.** One page, grotesk only, one question (one page in the review dialog's aspect mode, `data-review-themes="grotesk"`), five
candidates, each drawn only from what grotesk's world already owns. Each option is one live scene with three places on one clock: the anchor
in its own scene (centred, large), as a progress bar, and as a button press, so the reviewer sees whether it carries the theme.

| #   | Candidate                                    | What it draws                                                                                                          |
| --- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | The baseline (**recommended**)               | the red rule the type stands on is drawn under a ghosted word and inks the letters it passes; bar and press the same line |
| 2   | Out of register (the graph's pick, as built) | the proof in two plates, the red one orbiting the ink, registering, dwelling 4 of 22 units; the press registers it       |
| 3   | The twelve columns                           | the grid laid column by column, the page set into it piece by piece, counted steps; bar of cells; face filled by columns |
| 4   | The train on time                            | a red three-car train between five stations, stopping dead at each; a heavy rule laid behind it                        |
| 5   | The colour bands                             | red, ink and paper bands sweep over a part and print it, and back (Kenny's leave and, reversed, every opening)           |

**Recommendation and why.** The baseline: grotesk's controls already draw it on every hover and press (scope-12), so hover, press, focus,
the live update (the train along it), the index and loading all depart from it without a new idea; it reads at a glance as Swiss type
on its line; no other theme owns it (blueprint's dimension line runs between two points, forest's and solstice's marks run along a foot, here
the line sets the type). Out of register is the strongest runner-up and stays the loading picture whichever is picked: it speaks for waiting
only. The columns are already the theme's ground, the train is the live update, the bands are the leave and the opening.

**How.**

- `demo.js` holds the candidates as data (`ANCHORS`: see, what follows from it, verdict, three captions, three markups), builds the one row
  (`data-ga-aspect`, option cells `data-ga-option`) and writes `data-review-choices` from the same data.
- The page's one clock writes `data-ga-phase` on every `.ga-scene[data-ga-kind="cycle"]`: gap 2 units, in 8, hold 4 (the dwell, the press held),
  out 8; a unit is the register's 120 ms; 22 units is the graph's loop. The clock counts only unpaused time, so the dialog's Pause freezes a
  scene where it is. Replay restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone (the tour steps through them).
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.ga-scene`, never on `.ga-page`, because the review
  dialog moves the section into its stage (forest's demo lost every option animation this way, 48bfa5b3). The base style of a part is its drawn
  pose, so reduced motion shows the finished picture; `gap` sets the undrawn pose. Every open is a keyframe pair (`ga-x`, `ga-x-out`), so every
  close is its open reversed, a part's delay mirrored (`8 - delay - length` units). Out of register loops in CSS as the graph's does.
- Measured as seen (`node research/_review/measure-motion.mjs research/grotesk-anchor`, Firefox, 1600 px): every drawn part's out has the
  same t50 and t90 as its in (the baseline ink 460 / 870 ms, the train 420 / 900 ms, the bands 480 / 870 ms), the staggered column pieces mirror.
