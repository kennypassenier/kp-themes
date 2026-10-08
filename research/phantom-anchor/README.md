# What is phantom's anchor element

**Open (2026-10-08).** Kenny's verdict pending in the review dialog.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Phantom has plenty of pieces (the red bar that slides behind a
pointed-at item, the skewed key-cap button that drops onto its deep-red shadow, the slanted progress bar with its white shard, the star
that snaps, the stamped tick) but no single gesture that all of them depart from, and its one signature leave, the ghostly waver, is the
only blur and glow in a theme whose rule is "no glow, no blur": Cyberpunk emits light, phantom is print.

**What.** One page, phantom only, one question (one page in the review dialog's aspect mode, `data-review-themes="phantom"`), seven
candidates, each drawn only from what phantom's world already owns (the calling card, cut paper, the red plate, the halftone, the evidence
board). Each option is one live scene with three places on one clock: the anchor in its own scene (centred, large), as a progress bar, and
as a button press, so the reviewer sees whether it carries the theme.

| #   | Candidate                            | What it draws                                                                                                                                                                                     |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The card is thrown (**recommended**) | the calling card flies in turning and slaps down askew on the shove's dead stop, shadow cut in, the board's halftone jolts; the slab shoved across the well; the key cap dropped onto its shadow  |
| 2   | The red bar slides behind it         | a red parallelogram slides out from behind capitals and the ink flips to black exactly where the red passes; the bar slides across the well; the bar fills the button                             |
| 3   | Slashed: torn in at an angle         | a red slash cuts the board, a jagged edge tears the card in from its line, the slash is cut back; the diagonal cut sweeps the well with a slash at its head; a slash across the face              |
| 4   | Pinned with red string               | a pin, a string pulled slack-then-taut with a snap, the card pinned at its end with a jolt; a string pulled across the well; a pin pushed into the button's corner                                |
| 5   | The halftone shifts                  | the board's dot screen slips in hard cuts (4, -3, 2, back) as the card is laid under it, the title's ink going from halftone to full; the well's screen slips; the key cap's screen shifts a step |
| 6   | Stamped askew                        | the card is cut in, a red stamp is slammed askew in the register's tick (bite, bounce, stick), the card jolts; a stamp lands at the head; a small stamp on the key cap                            |
| 7   | The star snaps                       | the card is cut in, a white star over a red one snaps in five turns of a fifth at its end; the fill is cut in five steps with a star that snaps at each; a star snaps in at the key cap's corner  |

**Recommendation and why.** The card is thrown: it is the calling card itself, the one object the theme is named for and already draws
(the intro, the dialog, the tooltip and the toast are all thrown or shoved cards), it gives every state a throw or a slap with a dead stop
and nothing glows, shivers or eases in it (arrival thrown and leave snatched, loading a card thrown again and again, a live update the
changed figure slapped down again, the press the key cap dropped onto its shadow), and no finished theme throws: brutalism drops onto a
footprint, grotesk falls into register, cyberpunk tears. The red bar is the runner-up (the widest reach in the register) but it is a state
under the pointer first; the slash is cyberpunk's torn bands with the colours swapped; the string brings two objects to everything that
moves; the halftone shift is subtle on a phone and a hair from cyberpunk's jitter; the stamp is shared with brutalism, formal and sepia and
holds the theme's one overshoot; the star is an ornament and says "wait" on a press.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 100 ms); `demo.js` and `demo.css` are the engine and the page shared by every anchor demo of this round, copied unchanged
  from `research/formal-anchor` (it builds the one row, `data-an-aspect`, option cells `data-an-option`, and writes `data-review-choices`
  from the same data). The one change to the designer's markup is in candidate 2: each line of capitals carries a black copy of its text
  (`ph-r-ink`), clipped to the red bar's own shape, so the ink flips exactly where the red passes.
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held, the
  card down), out 8; 22 units is a loop. Replay restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`, because the review
  dialog moves the section into its stage. The base style of a part is its drawn pose, so reduced motion shows the finished picture; `gap`
  stands each part at its first keyframe. Every open is a keyframe pair (`ph-x`, `ph-x-out`) so every close is its open reversed: the out
  keyframes are the open's keys in reverse order with each segment's curve inverted (a cut is its own inverse, the shove and the register's
  `fx-ease` and tick curves are written out as their inverses; steps(1, end) becomes steps(1, start)), and a part's delay is mirrored
  (`8 - delay - length` units). Colours come from tokens only; shadows are hard and offset in `--kp-red-deep`; the red is always a plate
  with black ink; nothing glows, blurs or loops.
- Measured: pending. The mirror check (`mirror.mjs`) reports every scene mirrored; the motion is to be measured as seen with
  `node research/_review/measure-motion.mjs research/phantom-anchor`.
