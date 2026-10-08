# What is dark's anchor element

**Open (2026-10-08).** Kenny's verdict pending in the review dialog.

**Why.** Kenny, 2026-10-07 18:13: every theme gets one recognisable anchor element, the thing every later decision of the theme departs
from (forest: the tree progress bar, grotesk: the red plate that falls into register, synthwave: the page horizon, blueprint: the tracing
pen). The colours are already right and are the shared base. On 2026-10-08 he asked for the same round for the nine themes without an
anchor: six to ten bold, inventive candidates each, safe fades rejected. Dark has no anchor: it is a spectral instrument whose one
mechanism, the anodised oxide film (`--kp-iris`), runs along every edge that matters and turns with the pointer, but otherwise stands
still; its signature (bracketed button, ticked progress bar, the darkroom's develop) is a set of parts, not one behaviour.

**What.** One page, dark only, one question (one page in the review dialog's aspect mode, `data-review-themes="dark"`), seven candidates,
each drawn only from what dark's world already owns (the film, the brackets, the chamfer, the darkroom, the pool of light). Each option is
one live scene with three places on one clock: the anchor in its own scene (centred, large), as a progress bar, and as a button press.

| #   | Candidate                        | What it draws                                                                                                                                                                   |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The film turns (**recommended**) | the panel's film edge turned once round (cyan to cyan), the figure takes the film; the bar's fill colour turns as it fills; the button's film edge turns a quarter on the press |
| 2   | The brackets close on it         | tall mono brackets slide in from outside and close on the panel, locking in the film; `[` at the bar's start, `]` at its head; the button's brackets close a further step       |
| 3   | Cut open from a slit             | a lit slit, then the panel cut open from it (the tooltip's cut); the bar's fill end is chamfered as it grows; the press cuts the button's corners deeper                        |
| 4   | The spectral line sweeps it      | a dark slab, a line of film light sweeps it and the panel is lit behind the line; the line is the bar's head; the line sweeps the button's face on the press                    |
| 5   | Brought into register            | figure and readout arrive as a cyan and a magenta copy that converge; the bar's fill as two converging copies; the label splits a hair on the press and resolves                |
| 6   | Developed in the darkroom        | the panel comes up as a pale print under a flash of film (the register's develop); the bar's fill develops; the press flashes the face film                                     |
| 7   | The pool of light arrives        | the page's pool of light slides onto a dark panel and lights its edge and figure; the pool follows the bar's head; the press concentrates the pool on the pill                  |

**Recommendation and why.** The film that turns: the film is the one thing dark already has on every border, edge, rule and fill, and it
has no behaviour of its own (it turns with the pointer and otherwise stands still), so the anchor is found, not invented. "Its colour is its
angle" is what anodised oxide does; arrival (one turn), live update (a quarter turn), loading (turning on and on), hover (the edge turned
toward the pointer), press (a further quarter) and leave (turned dark) follow without a new idea, and it is nothing of titanium's (a bath
that drifts in heat order, never turns) or cyberpunk's. The brackets are the runner-up (the register's most complete signature, but "held",
not "light"); the slit overlaps titanium's cut-open panels; the line is the loading picture of half the set; register is too near
cyberpunk's two copies; develop is a filter that cannot be seen in a still; the pool is a lamp (synthwave, nostromo) and slow on a press.

**How.**

- `anchors.js` holds the candidates as data (`ANCHORS`: see, what follows from it, why, three captions, three markups) and the theme's
  beat (`UNIT`, 110 ms); `demo.js` and `demo.css` are the engine and the page shared by every anchor demo of this round (copied unchanged
  from `research/formal-anchor`).
- The page's one clock writes `data-an-phase` on every `.an-scene[data-an-kind="cycle"]`: gap 2 units, in 8, hold 4 (the press held),
  out 8; 22 units is a loop. Replay restarts it; the speed buttons stretch it by 2 or 4; Show looks at one place alone.
- `options.css` (in `@layer kp.signature`): every rule and custom property hangs on `.an-scene`, never on `.an-page`. The base style of a
  part is its drawn pose, so reduced motion shows the finished picture; `gap` sets the undrawn pose. Every open is a keyframe pair
  (`dk-x`, `dk-x-out`), every close its open reversed on the inverse curve (`--an-settle`/`--an-settle-out`, `--an-quick`/`--an-quick-out`),
  written out literally inside the keyframes. The film turns on a registered `@property --an-angle`; the register's `--kp-iris` follows
  the pointer, which the demo has not, so the demo writes the same conic on its own angle.
- Measured as seen (`node research/_review/measure-motion.mjs research/dark-anchor`): pending.
