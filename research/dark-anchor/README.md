# What is dark's anchor element

**Open (2026-10-08).**

**Update 1 (2026-10-08).** Kenny: "I love the colours of everything, especially the progress bar on option 1, but I also like the sleek
animations of spectral line, can we combine these somehow?" The new candidates are five ways of making the film's turn (round one's option 1)
and the spectral line (round one's option 4) one thing: the line is what turns the film. Every candidate keeps round one's progress bar
(chamfered ticked track, film fill whose colour turns as it fills, the `]` head) and adds the line to it. Round one's seven candidates are
replaced; the verdict is pending in the review dialog.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Dark has no anchor: it is a spectral instrument whose one
mechanism, the anodised oxide film (`--kp-iris`), runs along every edge that matters and turns with the pointer, but otherwise stands
still; its signature (bracketed button, ticked progress bar, the darkroom's develop) is a set of parts, not one behaviour.

**What.** One page, dark only, one question (one page in the review dialog's aspect mode, `data-review-themes="dark"`), five candidates,
each drawn only from what dark's world already owns (the film, the spectral line, the chamfered panel, the bracketed button). Each option is
one live scene with three places on one clock: the anchor in its own scene (centred, large), as a progress bar, and as a button press. The
line is a 2px slice of the film with the one glow the theme allows (10px of chart-1 at 40 %); sweeps are linear, turns settle on `--kp-settle`.

| #   | Candidate                                              | What it draws                                                                                                                                                                                           |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The line lays the film down, turning (**recommended**) | the line sweeps the panel in 6 units and lights it behind it while the film's angle turns 345 degrees, then settles; the bar's line is its head; the press sweeps the face and turns the edge a quarter |
| 2   | The line scans the edge round                          | a short bright segment runs clockwise round the chamfered edge, the film laid behind it; along the bar's fill and round the `]`; once round the button                                                  |
| 3   | Two wavelengths meet in the middle                     | a cyan line from the start and a magenta line from the end lay the film from both ends and meet at the centre; the bar's two lines meet at the head; two lines meet under the label                     |
| 4   | The slit stands, the film turns under it               | a still slit at the panel's centre while the panel's film ground turns once under it; the slit at the bar's head; the slit on the label while the face's film turns a quarter                           |
| 5   | The line sweeps, then the film turns                   | round one's sweep (4 units), then the film turns once (3 units); the bar's fill, then its colour turns; the face is swept, then the edge turns a quarter                                                |

**Recommendation and why.** The line lays the film down, turning: it is the two things Kenny picked made into one cause and one effect (the
line is what turns the film, so neither is decoration); it keeps the bar he loved exactly, with the line on its head; it has the even pace of
the sweep and the settle of the turn in one gesture, and no finished theme does either (titanium's wash drifts and never turns, deco's glint
runs along a fixed gold). Arrival (one pass that lays and turns), live update (a pass over the changed figure), loading (the line sweeping an
empty slot), hover (the line resting at the control's start), press (a pass and a quarter turn) and leave (the pass that takes the film off)
follow without a new idea. The runner-up is the segment that scans the edge (one path for line and turn, but small on a wide panel); the meeting
of two wavelengths reads as cyberpunk in dark's colours; the standing slit is restful but not the sleek sweep; sweep-then-turn is two gestures.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 110 ms); `update.json` holds Kenny's comment and the reply the dialog shows; `demo.js` and `demo.css` are the engine and the page shared by every anchor demo of this round (copied unchanged
  from `research/formal-anchor`).
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held),
  out 8; 22 units is a loop. Replay restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`. The base style of a
  part is its drawn pose, so reduced motion shows the finished picture; `gap` sets the undrawn pose. Every open is a keyframe pair
  (`dk-x`, `dk-x-out`: `dk-sweep`, `dk-a-turn`, `dk-b-scan`, `dk-c-reveal`, `dk-d-turn`, `dk-e-turn`, ...), every close its open reversed on the inverse curve (`--an-settle`/`--an-settle-out`, `--an-quick`/`--an-quick-out`),
  written out literally inside the keyframes. The film turns on a registered `@property --an-angle`; the register's `--kp-iris` follows
  the pointer, which the demo has not, so the demo writes the same conic on its own angle.
- Measured as seen (`node research/_review/measure-motion.mjs research/dark-anchor`): pending.
