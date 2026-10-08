# What makes retro retro

**Status: Open (2026-10-08).** Kenny judges the nineteen questions in the review dialog (round `2026-10-08-r1`); nothing is decided yet
beyond the anchor and the network graph.

**Why.** Kenny decided the anchor of retro on 2026-10-08 in [research/retro-anchor](../retro-anchor/README.md), update 1, attempt 1 of 3:
**Copying…: the sheet flies between the folders** (the Copying dialog of 1995: a sheet of paper flies out of one folder, over, and into the
other in eight whole frames while the segmented bar gains a block per landing), and he added: "I like the windows environment with the task
bar and desktop that you created around it". So the 1995 desktop drawn around the anchor (the teal ground, My Computer and the Recycle Bin,
the taskbar with Start and the clock, the window chrome with its title-bar ramp, menu bar and status bar, the pointer) is the world every
scene on this page lives in. The analysis is [themes/retro/CHARACTER.md](../../themes/retro/CHARACTER.md): the grammar G1 to G21 proposed
from the anchor, the decided picks measured against it, eight outliers and the questions. This page turns the proposals into the nineteen
questions Kenny answers to fix retro's grammar, the way research/forest-character and research/light-character did for theirs.

**Already decided, not asked again.** The anchor (with its desktop); the network graph, which changes in no theme and is in no scene.

**What.** One page, retro only, in the review kit's aspect mode (`data-review-themes="retro"`). An intro (the designer's three paragraphs,
from `aspects.js`), "What retro is" (the package's own parts in retro, and on demand six decided demos embedded as they are today), then
nineteen questions. Each question is one rule of the grammar and three options (four for questions 1, 10 and 13), each a live scene: a small
1995 desktop with the package's own components in retro standing on it as windows. The first option is the recommendation; every option
says what you see and why it is or is not recommended, on the page and in its hint in the dialog. The options named "the pick" are the
decided demos' values, the ones named "today" the register's own.

| #   | Question (rule)                       | Options, recommended first                                                                                                                    |
| --- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)                 | whole frames, eight a flight · four frames · sixteen frames · smooth (as 2026 would)                                                          |
| 2   | The direction (G2)                    | copied in from the folder, top-left · dragged in from above (the picks) · painted left to right (the picks)                                   |
| 3   | Opening what drops from a button (G3) | dealt from its edge, the dialog zooms in outline · painted from the edge (the picks) · pops whole (today)                                     |
| 4   | How long things take (G4)             | one flight: 90 ms a frame, 8 frames, a loop of 2520 ms · quick: 60 ms a frame · slow: 120 ms a frame                                          |
| 5   | Where the colour goes (G5)            | the 16-colour palette · the LED console (the picks) · navy and grey only                                                                      |
| 6   | The corners (G6)                      | square, bevelled · the floppy notch on plates (the picks) · square and flat                                                                   |
| 7   | The surface (G7)                      | the desktop behind, every surface a window part · the LED wells and scopes (the picks) · the woodgrain console (the drawer's pick)            |
| 8   | A warning (G8)                        | the message box · the LED and the scope (the picks) · the tinted plate                                                                        |
| 9   | A live update (G9)                    | a sheet copied over · the bevel pops (the picks) · repainted in jumps (the picks)                                                             |
| 10  | Loading (G10), update 1               | the Copying dialog fitted to each part · the Copying bar on every part · folders at the part’s ends · the progress blocks (the picks)         |
| 11  | The busy progress bar (G11)           | the sheet hops ahead · the blocks stand in the dither (today) · the blocks fill and empty                                                     |
| 12  | The spinner (G12)                     | the hourglass (today) · the sheet flies round · the Find flashlight                                                                           |
| 13  | Leaving and arriving (G13)            | copied in, copied back out · flies to the Recycle Bin · shrunk to the centre (today) · the dissolve (the picks)                               |
| 14  | Buttons inside composites (G14)       | exactly retro's own · retro's own on a sunken panel · as today                                                                                |
| 15  | Pointing at something (G15)           | nothing, as in 1995 · the selection bar on everything · the bevel raises (the picks)                                                          |
| 16  | The focus ring (G16)                  | the two-channel ring with the dotted rectangle inside · the two-channel ring alone (today) · the dotted rectangle alone                       |
| 17  | The press (G17)                       | the bevel pressed in one frame (today) · the bevel sinks in two frames (the picks) · the label only                                           |
| 18  | The voice (G18)                       | Pixelify for chrome, Instrument Sans for words, VT323 for DOS · Pixelify for figures too · VT323 everywhere                                   |
| 19  | Motifs (G19)                          | the bevel, the ramp, the selection bar, the dither, the blocks, the drop, the desktop · plus the floppies and the LEDs (the picks) · as today |

**How.**

- `aspects.js` holds the nineteen questions as data (the designer's text, verbatim: question, reason, rule, kind, scene key, options with
  what you see and the verdict). `demo.js` imports it, adds each question's scene (`SCENES`, by the scene key, every scene wrapped in the
  1995 desktop), builds the rows (`data-rt-aspect`, option cells `data-rt-option`) and writes `data-review-choices` from the same data, so
  the page and the dialog cannot disagree.
- `grammar.css` is the grammar as tokens on `.rt-page, .rt-scene` (the frame of 90 ms and the frame counts, the colours by role, the bevel
  stacks, the ramp, the hard drop, the dither and the 4 % checker, the three voices) and the keyframes of the recommended options: the sheet
  copied in (`rt-fly-8`, `rt-land-8`), the anchor's own stage flight (`rt-stage-8`), the window zoom in outline frames (`rt-zoom`,
  `rt-zoom-win`), the menu dealt (`rt-deal`), the notice dropped from its edge (`rt-drop-edge`), the tip (`rt-tip`), a value copied over
  (`rt-fly-5`, `rt-redraw`), the Copying dialog in small (`rt-load-sheet`, `rt-load-bar`) and fitted to the month, the plot and the skeleton's grooves (`rt-fit-walk`, `rt-fit-day`, `rt-fit-num`, `rt-fit-walkbar`, `rt-fit-cross`, `rt-fit-foot`, `rt-fit-groove`, `rt-fit-hop`), the sheet hopping ahead
  (`rt-hop`, `rt-hop-fill`), the hourglass in frames (`rt-glass-sand`, `rt-glass-turn`), the leave copied back out (the same
  `rt-fly-8` / `rt-land-8` pair backwards; the Bin option's `rt-bin-part`, `rt-bin-ghost`) and the press (`rt-tap-bevel`, `rt-tap-label`, `rt-tap`).
- `options.css` (in `@layer kp.signature`) draws the world and every option, scoped by `data-rt-<question>="<key>"` on the scene. The
  desktop, the icons, the taskbar, the window and dialog chrome, the pointer, the sheet, the folders and the segmented bar are the anchor's
  own CSS (research/retro-anchor/options.css, its pixel maps included), copied under `.rt-scene`; the error icon, the hand pointer, the info
  bubble, the Find magnifier and its torch are drawn the same way, pixel maps in `em` on a 1 or 2 px grid. Colours are tokens only (the
  bright VGA red, green and blue are the tokens' own hues at full saturation, the woodgrain the warning's hue turned); every motion sits
  under `prefers-reduced-motion: no-preference`; the reduced pose is the sheet in its folder, the part whole. A scene off the screen is not
  drawn (`content-visibility: auto`): fifty-seven desktops of pixel maps.
- Nothing eases: every motion is whole frames (`steps(n, jump-end)`, or each pose held for its frame), its close the same frames backwards
  (`steps(n, jump-start)`); the only curve is question 1's "smooth", the option that asks for one.
- One clock in `demo.js` plays every scene that arrives, opens, updates or leaves (`data-rt-phase`, in frames of 90 ms: gap 4, in 20, hold
  14, out 20): the options of a row start together. Replay restarts it, the speed buttons stretch every duration by 2 or 4, the dialog's
  Pause (Space) stops it. Loops (loading, the busy bar, the spinner, the press) run in CSS. A live value is copied over at the frame its
  sheet lands (`--rt-swap`).
- Every open is a pair of keyframes (`rt-x`, `rt-x-out`) and a part's delay is mirrored in the window (20 frames less delay less length:
  what came last goes first); the open runs half a millisecond early and the close half a millisecond late, so both sides of a jump agree.
- State (Rest, Hover, Focus, Press) forces a state on every button, entry and link of question 14; the hover, focus and press rows draw
  their own state (`rt-pointed` with the 1995 pointer or hand on the part, `rt-focused`, a looped `rt-press`), which the dialog also plays
  by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode (`?embed=…&theme=retro`) only when it
  is opened: the meter, the menu, the tiles, the trend tile, the month heatmap and the network graph.

**Findings while building.**

- Question 13: G13's first draft named two paths for one part (copied in from the top-left, gone to the Bin at the bottom-left), which
  cannot be one animation played forwards and backwards. Resolved by the designer (2026-10-08): the recommended leave is the arrival
  backwards ("Copied in, copied back out", mirrored); the Bin stays on the page as the second option. The mirror check reports the Bin and
  today's leave (the 0.25 / 0.1 mismatch its verdict names) as not mirrored, by design.
- Pixelify Sans' bold 2 reads as an 8 at 13 px in a title bar; the scenes' titles avoid it (worth a look before the register sets figures
  in title bars).

**Measured:** pending (`node research/_review/measure-motion.mjs research/retro-character`).
