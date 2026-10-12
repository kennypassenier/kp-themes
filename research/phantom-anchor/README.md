# What is phantom's anchor element

**Update 1 (2026-10-08).** Kenny: "I like both the card is thrown and half tone shift, make another attempt with those combined" — the new candidates
are five ways of making the thrown card and the shifting halftone one gesture (round one's seven candidates are replaced); judged in the review dialog (round `2026-10-08-r2`).

**Decided (Kenny, 08/10/2026): Thrown as a screen, resolves at the slap** ("phantom-anchor · phantom: The anchor element = Thrown as a screen, resolves at the slap"; the jolt was recommended and not chosen). Recorded in decided.json; the character round builds on it.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Phantom has plenty of pieces (the red bar that slides behind a
pointed-at item, the skewed key-cap button that drops onto its deep-red shadow, the slanted progress bar with its white shard, the star
that snaps, the stamped tick) but no single gesture that all of them depart from, and its one signature leave, the ghostly waver, is the
only blur and glow in a theme whose rule is "no glow, no blur": Cyberpunk emits light, phantom is print.

**What.** One page, phantom only, one question (one page in the review dialog's aspect mode, `data-review-themes="phantom"`), five candidates, each
drawn only from what phantom's world already owns (the calling card thrown onto the board, the halftone dot screen). Each option is one live scene with
three places on one clock: the anchor in its own scene (centred, large), as a progress bar, and as a button press, so the reviewer sees whether it carries
the theme. The throw is round one's exactly (the card flies in from off the stage on `cubic-bezier(0.81, 0, 0, 1)`, stops dead at 4 units a degree and a
half askew, the deep-red shadow cut in on the next unit; the close on the inverse curve, `cubic-bezier(1, 0, 0.19, 1)`). The screen is the register's 7px
dot grid; it SLIPS between fixed `background-position` poses in hard `steps(1)` cuts and locks, it never ticks and no two plates are brought into register.

| #   | Candidate                                              | What it draws                                                                                                                                                                                                                                                        |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The card is thrown, the screen jolts (**recommended**) | the card slaps down; at the stop the board's screen slips +4, -3, +2, 0 px in four cuts and locks (`ph-throw`, `ph-a-slip`); the slab shoved across the well and the well's screen slips; the key cap drops and its dots slip one cut                                |
| 2   | Thrown as a screen, resolves at the slap               | the card flies as a silhouette of white dots and resolves into the solid card in three cuts at the stop (`ph-fly`, `ph-b-dots`, `ph-b-shadow`); the dotted slab resolves solid; the key cap's face resolves in two cuts                                              |
| 3   | The screen tears aside for the card                    | a gap opens in the screen in two cuts (+6, +12 px), the card flies through it, the screen shuts in two cuts with black dots over the card (`ph-c-open`, `ph-c-slot`, `ph-c-shut`); the well's screen opens and shuts over the slab; the cap's screen opens and shuts |
| 4   | The throw drags the screen                             | the screen is displaced against the throw in four cuts (-12, -8, -4, 0 px) with a 3px-off smear behind the card, locked at the slap (`ph-d-drag`, `ph-d-wake`); the well's screen dragged by the shove; the cap's screen dragged one cut                             |
| 5   | Slapped down, the screen shuffles and locks            | the slap, then the board's screen and the card's own dots shuffle in three slips and returns (+4/0, -4/0, +2/0 px) and lock at 7 units (`ph-e-shuffle`); the well's screen shuffles three times; the cap's screen twice                                              |

**Recommendation and why.** The jolt: it keeps the throw exactly as Kenny liked it and makes the halftone shift its consequence (the screen jolts because the
card hit the board), so the two are one event with one dead stop; the card stays readable the whole time, the slip is four hard cuts and locks, and nothing
in it is grotesk's register or cyberpunk's glitch. The resolve makes the halftone the card's own material but is hard to read in the air and is a dither (retro's
way of appearing in grey); the tear ends with the card under the dots and is a lot of board moving for a toast; the drag has a smear that reads as motion blur
and moves close to cyberpunk's jitter; the shuffle comes after the stop, so the slap and the shuffle are two beats, and three slips and returns are
cyberpunk's jitter in dots.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 100 ms); `demo.js` and `demo.css` are the engine and the page shared by every anchor demo of this round, copied unchanged
  from `research/formal-anchor` (it builds the one row, `data-an-aspect`, option cells `data-an-option`, and writes `data-review-choices`
  from the same data). `update.json` carries Kenny's comment and the reply the dialog shows. No inner span was added to the designer's markup.
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held, the
  card down), out 8; 22 units is a loop. Replay restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`, because the review
  dialog moves the section into its stage. The base style of a part is its drawn pose, so reduced motion shows the finished picture; `gap`
  stands each part at its first keyframe. Every open is a keyframe pair (`ph-x`, `ph-x-out`) so every close is its open reversed: the out
  keyframes are the open's keys in reverse order with each segment's curve inverted (a cut is its own inverse, the shove is written out as
  its inverse, steps(1, end) becomes steps(1, start)); a screen cut is placed 0.01 unit before its nominal time so that the close lands on
  the mirrored pose. Colours come from tokens only; shadows are hard and offset in `--kp-red-deep`; the red is always a plate with black
  ink; nothing glows or blurs.
- Measured: pending. The mirror check (`mirror.mjs`) reports every scene mirrored; the motion is to be measured as seen with
  `node research/_review/measure-motion.mjs research/phantom-anchor`.
