# What is retro's anchor element

**Decided (Kenny, 08/10/2026): Copying…: the sheet flies between the folders** ("retro-anchor · retro: The anchor element = Copying…: the sheet flies between the folders (recommended)", attempt 1 of 3; "I like the windows environment with the task bar and desktop that you created around it"). Recorded in decided.json; the character round builds on it, the 1995 desktop included.

**Update 1 (2026-10-08).** Kenny: "None of these, I want 3 more attempts at this, redesign it completely from the ground up, based on an
old windows UI. It needs to feel really retro and oldschool. This theme has the potential to be one of the most distinct ones we have, so it
needs to feel professionally done. Let me see why they call you world class" — the new candidates are eight moments of the 1995 desktop
itself (attempt 1 of 3), each drawn as a whole desktop (the teal at 4:3, its icons, the taskbar with Start and the clock, windows with the
title-bar ramp, menu bar and status bar, dialog boxes with their icon and the dotted focus rectangle); none of round one's mechanics
returns. Kenny's verdict pending in the review dialog (round `2026-10-08-r2`).

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Retro has no anchor: its register draws the 1995 desktop (the page
one window on the teal, the navy title-bar ramp, bevels, sunken wells, the dither, the navy progress blocks, the selection bar, the
hourglass) and moves it in hard steps, nothing easing, but no one moving thing decides how the rest arrives, waits, points, presses and
leaves; a dialog is a stepped scale and every other arrival is a stepped copy of it.

**What.** One page, retro only, one question (one page in the review dialog's aspect mode, `data-review-themes="retro"`), eight
candidates, each a moment of the 1995 desktop. Each option is one live scene with three places on one clock: the anchor in its own scene (a
whole desktop, centred, large), as a progress bar, and as a button press, so the reviewer sees whether it carries the theme. Nothing eases
in any of them: every animation runs on `steps(n, jump-end)` or `step-end` between fixed poses, its close on the inverse.

| #   | Candidate                                                       | What it draws (keyframe pairs)                                                                                                                                                                                                                                       |
| --- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Copying…: the sheet flies between the folders (**recommended**) | the Copying dialog: a sheet flies out of the left folder and into the right one in eight fixed poses while the dialog's bar fills (`rt-c-fly`); the bar's small sheet hops ahead of the fill, seven hops, two blocks each (`rt-c-hop`); the press is the bevel press |
| 2   | Solitaire is won: the cards cascade                             | the king of hearts bounces out of its foundation in six poses (`rt-s-bounce`), each place painted with the copies of its flight as hard shadows (`rt-s-paint`); cards laid on the felt one a step; the button flips through its edge to the card back (`rt-s-flip`)  |
| 3   | Defrag: the blocks are read and written                         | a 14 × 6 cluster map: fourteen moves, the last used cluster read green and written red then blue into the first free place (`rt-d-src`, `rt-d-dst`); the bar is fourteen clusters gathering; the face reads green for a frame, then is pressed (`rt-d-face`)         |
| 4   | Start: the menu slides up                                       | Start pressed with its dotted focus (`rt-m-start`), the Start menu with its banner and icons slides up out of the taskbar in six frames (`rt-m-slide`), the pointer walks up (`rt-m-point`) and Settings takes the navy bar (`rt-m-pick`); the press stays sunk      |
| 5   | The message box dings                                           | over Pump house 3's inactive window a message box pops in one frame (`rt-g-pop`) with the warning triangle and the default OK, and its title bar flashes three times (`rt-g-flash`); the press draws the dotted focus rectangle inside OK (`rt-g-focus`)             |
| 6   | Minesweeper: the face reacts, the field floods open             | the pointer presses a cell (`rt-w-aim`), the face says "o" (`rt-w-mood`), the field floods open ring by ring with its numbers (`rt-w-open`), the mines are flagged (`rt-w-flag`), the LEDs count (`rt-w-tick`, `rt-w-left`) and the face puts on sunglasses          |
| 7   | The screensaver: flying through space                           | the screen goes black in one frame (`rt-f-black`), stars stream out from the middle in six-frame runs (`rt-f-fly`), the desktop comes back with the window (`rt-f-back`); the bar's stars stream behind the blocks (`rt-f-stream`); one frame of space on the face   |
| 8   | Dragged by its outline                                          | the pointer grabs the title bar (`rt-x-grab`), the checker outline steps across in five frames while the window waits (`rt-x-drag`), the window is painted at the drop (`rt-x-paint`); the outline steps ahead of the bar's blocks (`rt-x-ahead`)                    |

**Recommendation and why.** The Copying dialog: it is the single most remembered animation of that desktop (nobody who waited for a copy
forgets the flying sheet), it is only retro's (no other theme flies paper between folders), it moves in frames by nature, and it gives
arrival, loading, live and leave as one picture, where the bevel press and the segmented bar it already carries decide the rest. Solitaire
is the joy of that desktop but a celebration on every arrival; Defrag counts in whole blocks but makes every surface carry a grid; Start is
an opening, not an object; the ding is the one motion the flash gate counts; Minesweeper's smiley is a joke on a dashboard of pump readings;
the screensaver begins every arrival with a blackout; the outline drag is close to round one's outline zoom.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups, built on the
  shared `desktop()`, `win()` and `dialog()` markup) and the theme's beat (`UNIT`, 90 ms, whole frames of the 1995 desktop); `update.json`
  holds Kenny's comment and the reply the dialog shows; `demo.js` and `demo.css` are the engine and the page shared by every anchor demo of
  this round (copied unchanged from `research/formal-anchor`).
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held, the
  window painted), out 8; 22 units is a loop. The clock counts only unpaused time, so the dialog's Pause freezes a scene where it is.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`, because the review
  dialog moves the section into its stage. The base style of a part is its drawn pose, so reduced motion shows the finished picture; `gap`
  sets the undrawn pose. Every open is a keyframe pair (`rt-x`, `rt-x-out`): the out keyframes are the in poses at 100 % minus their
  offset, run on the inverse step (`step-end` in, `step-start` out; `steps(n, jump-end)` in, `steps(n, jump-start)` out), so every close
  is its open reversed; the open runs half a millisecond early and the close half a millisecond late, so both sides of every jump agree to
  the instant. Every colour is a token or a relative colour of one (the bright VGA red, green and blue are the tokens' hues at full
  saturation); the bevels are the register's own `--kp-raised`, `--kp-pressed` and `--kp-sunken`, the title bar `--kp-ramp`, the drop
  `--kp-drop-hard`, the checker the register's 2 px dither cell. Every icon (computer, bin, folder, sheet, flag, pointer, warning triangle,
  smiley, the Start menu's icons) is a pixel map drawn as background layers in `em` on a 1 or 2 px grid; the chrome text is Pixelify Sans
  at 12 to 13 px, the LEDs VT323 (`--kp-dos`).
- Measured as seen (`node research/_review/measure-motion.mjs research/retro-anchor`): pending.
