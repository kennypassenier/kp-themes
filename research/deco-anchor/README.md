# What is deco's anchor element

**Open (2026-10-08).** Kenny's verdict pending in the review dialog.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Deco has no anchor: its register has the fan of rays on every
hovered button, the sun that rises on the dialog, the fluted pennant bar and the lobby's lamps on the meter, but they are a handful of fine
devices, and nothing says which one every later decision departs from.

**What.** One page, deco only, one question (one page in the review dialog's aspect mode, `data-review-themes="deco"`), seven candidates,
each drawn only from what deco's world already owns (the skyscraper lobby: gilt, lift, marquee, setbacks, curtain, jewel). Each option is one
live scene with three places on one clock: the anchor in its own scene (centred, large), as a progress bar drawn as the register draws it,
and as a button press, so the reviewer sees whether it carries the theme. Gold is flat `--primary` everywhere, never a gradient.

| #   | Candidate                       | What it draws                                                                                                                                                                 |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The fan opens (**recommended**) | a crest of gold rays opens from its base point ray by ray, then the double rule is drawn; a small fan opens at the pennant's tip; the button's own fan opens behind the label |
| 2   | The lift ascends                | eight lamps and an arrow light one a step from the foot, the title takes the gold; the bar is a row of lamps lit a step each; a lamp lights beside the label                  |
| 3   | The setbacks rise               | five tiers of gold hairline rise behind the title in hard steps, the title rises into its line; a stair-stepped fill in five steps; the button's top corners cut in steps     |
| 4   | The curtain rises               | a pleated lacquer curtain with a double-rule hem lifts off the plaque, slowing as it clears; lifts off the bar; a pleated band drops over the button's face                   |
| 5   | The jewel is set                | an emerald lozenge drops turning into a gold setting on the crest; the head lozenge drops into the bar; a lozenge is set beside the label                                     |
| 6   | The glint runs the gilt         | a glint runs the plaque's double rule, the rule behind it stands full gold, the title brightens; the glint runs the pennant; it runs across the button's gold edge            |
| 7   | The marquee bulbs chase         | twelve bulbs light in turn along the plaque's top edge, the title takes the gold; the pennant fills in twelve steps with a bulb each; the frame lights as a dotted row        |

**Recommendation and why.** The fan: it is the one idea that is in the register twice already (the fan on every hovered button, the sun
rising on the dialog) and in nine of Kenny's picks, so it unites what the theme already does, it is the motif of the style itself, and it is
told from the suns next door by what it is: a crest of rays from a point that opens and folds, never a disc that travels or sets (solstice)
and never stripes on a horizon (synthwave). The lift is the lobby in one object but is a column that a plate must carry beside it; the
setbacks are deco's own geometry but tall and thin; the curtain is a reveal that needs a top edge; the jewel is a mark set after the
thing is done; the glint is the shimmer of every skeleton, told apart by its gold only; the bulbs are retro's and synthwave's device and
the loudest of the seven on a theme whose gold is meant to be flat and still.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 120 ms); `demo.js` is the engine shared by every anchor demo of this round (it builds the one row, `data-an-aspect`,
  option cells `data-an-option`, and writes `data-review-choices` from the same data); `demo.css` is the shared page.
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held, the
  gold lit), out 8; 22 units is a loop. The clock counts only unpaused time, so the dialog's Pause freezes a scene where it is. Replay
  restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`. The base style of a
  part is its drawn pose, so reduced motion shows the finished picture; `gap` sets the undrawn pose. Every open is a keyframe pair
  (`dc-x`, `dc-x-out`), so every close is its open reversed, a part's delay mirrored (`8 - delay - length` units). Timing functions inside
  `@keyframes` are written out, and an eased open closes on the curve's inverse (`--an-fx-out`, `--an-sweep-out`); hard steps close on
  `jump-start` and sit an hair (0.01 unit) off the quarter-unit grid so that the boundary of a step belongs to the same side in and out.
- Measured: pending. The mirror check (every animated part, every quarter unit, Chromium) finds all seven scenes mirrored; the motion
  measurement of each scene is still to be run.
