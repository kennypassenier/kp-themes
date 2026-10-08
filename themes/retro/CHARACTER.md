# Retro — character

The reference for how retro looks and moves, derived from its anchor. Read the
grammar before adding or changing any retro component; the inventory and the
outliers record where the decided picks (2026-10-05 … 2026-10-07) stand against
it, and the questions (research/retro-character) are the plan to bring them in
line. Kenny picked the anchor on 2026-10-08 in research/retro-anchor (attempt 1
of 3, after rejecting round one outright); the grammar below is proposed from
it and goes to him question by question.

Sources measured (2026-10-08): every `research/character-*/decided.json` pick
for retro resolved to its option, `css/retro-register.css` (layers
`kp.register` and `kp.signature`, the bevel stacks `--kp-raised` /
`--kp-pressed` / `--kp-sunken`, the title-bar ramp `--kp-ramp`, the dither
brush `--kp-brush` and the four densities `--kp-dd-*` / `--kp-dm-*`, the
segmented bar `--kp-rp-*`, `--fx-duration` 0 ms, `--fx-ease` `linear`),
`css/themes.css` (retro's tokens: chrome grey, title-bar navy, teal desktop,
the VGA palette), `js/motion.js` (`--kp-open: reverse-close`), the families
page (retro still open there: no family pick), `themes/retro/anatomy.md`
("grey chrome, a navy title bar, bevels around a gated boundary; nothing
blinks; 1995 did not ease") and research/retro-anchor (round one, rejected, and
update 1).

---

## 0. Decided before this analysis (Kenny)

| When             | Where                                            | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-07 02:54 | the Homelab project thread                       | **The network graph changes in no theme.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 2026-10-08       | research/retro-anchor, review dialog (round one) | "None of these, I want 3 more attempts at this, redesign it completely from the ground up, based on an old windows UI. It needs to feel really retro and oldschool. This theme has the potential to be one of the most distinct ones we have, so it needs to feel professionally done."                                                                                                                                                                                                                                                                                                                                                                                    |
| 2026-10-08       | research/retro-anchor, review dialog (update 1)  | **The anchor = Copying…: the sheet flies between the folders** (option 1, recommended, attempt 1 of 3): the Copying dialog of 1995, two folders and a sheet of paper that flies out of the left one, over, and down into the right one in eight whole frames, while the segmented bar underneath gains a block each time a sheet lands; the press is the bevel pressed in one step with the label a pixel over. "I like the windows environment with the task bar and desktop that you created around it": the teal desktop, its icons, the taskbar with Start and the clock, the window with its title-bar ramp, menu bar and status bar, the pointer, are retro's world. |

What Kenny has not decided and research/retro-character asks: the grammar's
parameters (curve, direction, opening, durations, colour, corners, surface,
type, motifs), how the flying sheet and the desktop carry to a warning, a live
update, loading, the busy bar, the spinner, leaving and arriving, the buttons
inside composites, hover, focus and the press. Every question's first option is
the recommendation; where a decided pick is at odds with it, the pick is on the
page as an option named "the pick" or "today".

---

## 1. The retro grammar (proposed)

Retro is **the 1995 desktop**: a teal ground with its icons, a taskbar with
Start and the clock, windows of grey chrome with a navy title bar, bevels for
what you press and sunken wells for what you read, a 16-colour palette, and a
clock that ticks in whole frames because nothing in 1995 eased. The anchor
says what the desktop does: it **copies**. A sheet of paper flies out of one
folder, over, and into the other in eight whole frames, and the segmented bar
gains a block each time a sheet lands. Everything that happens on screen is
copied in or out: a part **flies in as a sheet and lands whole, is copied over
when it changes, waits while sheets fly and blocks fill, flies out to the
Recycle Bin when it goes**. Every motion is whole frames; the bevel presses in
one; nothing fades, nothing eases, nothing blinks.

| #   | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **Nothing eases: whole frames.** Every motion runs on `steps(n, jump-end)` at 90 ms a frame (the anchor's clock); a flight is 8 frames, a short motion 4, a repaint 1; a close is the same frames backwards on `steps(n, jump-start)`. Never a curve, never a spring, never a fade; `--fx-ease` stays `linear` and `--fx-duration` 0 for colour.                                                                                                                                                                                                   |
| G2  | **Copied in from the folder, top-left, in frames.** A part flies in from the top-left of its container (where the source folder stands) along an arc of whole frames and lands whole; a group (toasts, days, columns) is copied one sheet after another, one frame apart, in reading order; a line (the trend, the bar) is drawn left to right block by block, as the segmented bar fills.                                                                                                                                                         |
| G3  | **A menu is dealt from its edge, a dialog zooms open in outline frames.** A menu slides out of its button's edge in 6 frames (the Start menu's way), clipped at the edge; a dialog opens as 1995's window zoom: four outline rectangles growing from its centre, then the window whole; a tooltip waits and appears in one frame; a toast drops from its edge in 3 frames. The close is the frames backwards.                                                                                                                                      |
| G4  | **Durations: one flight.** A frame is 90 ms. Contact 0 ms (a bevel presses at once). A flight: 8 frames (720 ms). A short motion (a menu dealt, a toast dropped, a zoom): 4 to 6 frames (360 to 540 ms). A group: one frame apart. A loop (sheets flying while loading, the busy bar's hop): 2520 ms (28 frames, the Copying dialog's rhythm).                                                                                                                                                                                                     |
| G5  | **The 16-colour palette.** Chrome grey for every surface, title-bar navy for what is selected and for title bars, teal for the desktop, white for a well's paper, black ink; warnings yellow, failure dark red, success green, as the VGA palette had them; no other hue, no tint, no gradient but the title-bar ramp and the dither.                                                                                                                                                                                                              |
| G6  | **Square, bevelled.** Radius 0 everywhere; a raised bevel for what you press, a sunken well for what you read, a groove for a divider; nothing cut, nothing rounded, no notch (the floppy's shutter notch stays the busy table's pick where it was picked).                                                                                                                                                                                                                                                                                        |
| G7  | **The desktop behind, every surface a window part.** The teal desktop with its icons and the taskbar is the ground; every surface is a window part: a raised plate, a sunken well, a title bar with the ramp, a menu strip, a status bar with the grip; the 4 % checker dither on the chrome; a hard 3 to 4 px drop under a window or a menu, never a blur. No woodgrain, no scanlines, no CRT.                                                                                                                                                    |
| G8  | **A warning is the message box.** A warning or failed figure is framed as a 1995 message box: its title bar in the tone, the yellow triangle for a warning, the red X for a failure, beside the figure; a destructive menu entry has the red X before it; the plate stays chrome. Never a tinted plate, never a lit LED, never a scope.                                                                                                                                                                                                            |
| G9  | **A live update is a sheet copied over.** A small sheet flies from the top-left onto the changed figure in 4 frames and the figure repaints in one frame as it lands; the figure never swells, blinks or steps on its own. Not the bevel pop (the chart's pick), not the three-blink repaint (the graph's).                                                                                                                                                                                                                                        |
| G10 | **Loading is the Copying dialog in small.** On every waiting surface two small folders and a sheet flying between them in 8 frames, again and again, with a short segmented bar under them gaining a block per landing and emptying when full (2520 ms a loop); the skeleton's lines are the dither with the sheet flying over them. Not the progress blocks alone (the picks), not the marching ants, not the dissolve.                                                                                                                           |
| G11 | **The busy bar is the segmented bar with the sheet hopping ahead.** The register's sunken well with navy blocks stays: with a share known the blocks fill whole, block by block; busy, a small sheet hops along the empty well two blocks a hop, 7 hops, and the blocks fill behind it, then empty, 2520 ms, and again.                                                                                                                                                                                                                            |
| G12 | **The spinner is the hourglass.** The register's 1995 hourglass cursor (the sand drains, the glass turns) stays as the spinner, in frames; the busy button carries it.                                                                                                                                                                                                                                                                                                                                                                             |
| G13 | **Arriving is copied in, leaving flies to the Recycle Bin.** One animation played forward and backwards (`reverse-close` stays): a part arrives as a sheet flying in from the top-left in 8 frames and landing whole; to leave it shrinks in 4 outline frames toward the bottom-left, where the Recycle Bin stands, and is gone. The register's shrink-to-centre leave and the picks' dissolves are retired.                                                                                                                                       |
| G14 | **An element inside a composite is retro's own element.** A button in a header, menu, drawer, tile or alert is the raised bevel and presses exactly like retro's `.kp-button`; a menu entry takes the navy selection bar like `.kp-menu__item`; a link is navy underlined.                                                                                                                                                                                                                                                                         |
| G15 | **Pointing does nothing, as in 1995.** Hover is no change on a button (the accelerator's underline only); a menu entry takes the navy selection bar at once; a link's pointer is the hand; a tile does not lift. No bevel raise, no highlight, no lamp.                                                                                                                                                                                                                                                                                            |
| G16 | **Focus is DI2's two-channel ring**, and inside a button the dotted focus rectangle of 1995 is drawn too (1 px dotted ink inside the bevel), as the anchor drew it.                                                                                                                                                                                                                                                                                                                                                                                |
| G17 | **A press is the bevel pressed in one frame.** The bevel inverts to `--kp-pressed` in one step and the label moves a pixel down and right; the box and its neighbours never move; release restores it in one step. The register's own press.                                                                                                                                                                                                                                                                                                       |
| G18 | **Pixelify for chrome, Instrument Sans for words, VT323 for the DOS voice.** Window titles, headings and the brand in Pixelify Sans; prose, figures and the alarm's headline in Instrument Sans; labels, help, status lines, tags and identifiers in VT323. No other face.                                                                                                                                                                                                                                                                         |
| G19 | **Motifs: the bevel, the title-bar ramp, the selection bar, the dither, the navy blocks, the hard drop, the desktop's icons and pointer.** The bevel on what you press, the ramp on a title, the navy bar on a selection, the dither on what is disabled or waiting, the blocks for a share, the hard drop under a window, the desktop's icons, taskbar and pointer where the desktop is shown. Retired: the woodgrain tray, scanlines, CRT glow and hi-fi dials (the drawer's picks), the marching ants and the floppy labels as a general shape. |
| G20 | **Every animation sits under `prefers-reduced-motion: no-preference`;** the reduced pose is the sheet in its folder, the part whole.                                                                                                                                                                                                                                                                                                                                                                                                               |
| G21 | **The network graph is never a target** (Kenny, 2026-10-07 02:54).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

---

## 2. The decided picks against the grammar

Only the meter is in `css/retro-register.css` beyond the signature elements.

| Component · aspect        | Pick                                                   | Verdict                                                    |
| ------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| register · leave          | shrunk to its centre in 4 steps, with opacity          | outlier-1 (G13: to the Recycle Bin, no opacity)            |
| register · dialog         | zooms open from 0.25 in 4 steps                        | near G3 (outline frames); the close at 0.1: outlier-1      |
| register · toast, tooltip | drops 12 px in 3 steps; waits 500 ms, appears          | fits (G3)                                                  |
| register · busy bar       | blocks in the dither, standing still                   | outlier-2 (G11)                                            |
| register · spinner        | the hourglass                                          | **the reference** (G12)                                    |
| register · skeleton       | the dither pulsing in 4 steps                          | outlier-3 (G10)                                            |
| register · hover          | nothing but the accelerator                            | **the reference** (G15)                                    |
| register · press          | the bevel pressed, the label a pixel                   | **the reference** (G17)                                    |
| meter · all               | the system monitor's LEDs, the modem handshake         | outlier-4 (G7: a black LED well), the handshake: outlier-3 |
| chart · all               | the Excel wizard, blocks, slides open, bevel pops      | the shape fits; loading: outlier-3; update: outlier-5      |
| calendar · all            | floppy labels, tear-off pad, the dissolve              | shape: outlier-6 (G19); arrival: outlier-1                 |
| trend · all               | the title bar, blocks, at once, message box, repaint   | shape and tone fit; loading: outlier-3; live: outlier-5    |
| columns · all             | the status bar, blocks, painted, sunken, repainted     | shape fits; loading: outlier-3; arrival, live: outlier-5   |
| menu · all                | the 1995 dialog, blocks, painted, Start menu select    | shape and select fit; open: near G3; loading: outlier-3    |
| kpi · all                 | the title bar card, skeleton, dialog, presses, repaint | fits; live: outlier-5                                      |
| tiles · all               | the title bar, blocks, dragged in, button, scrolled    | fits; loading: outlier-3; arrival: near G2 (frames)        |
| busy table · all          | the floppy label, blocks, at once, message box         | the notch: kept where picked; loading: outlier-3           |
| state · all               | the LED dot, the scope warning, switched               | outlier-4 (G8: no LED, no scope)                           |
| header · all              | the 1995 dialog, painted, the flat field               | fits; hover rules a line: outlier-7 (G15)                  |
| drawer · all              | the woodgrain tray, scanlines, hi-fi dials             | outlier-8 (off-theme: a 1970s console)                     |
| graph · all               | the 1995 network diagram, marching ants, zoom, blinks  | never changes (G21)                                        |

---

## 3. The outliers

| #         | What                                                                      | Breaks                                   | Strength |
| --------- | ------------------------------------------------------------------------- | ---------------------------------------- | -------- |
| outlier-1 | leaves that shrink to the centre and fade; dissolves; a 0.1/0.25 mismatch | copied in, flies to the Bin (G13, G1)    | ●●●      |
| outlier-2 | the busy bar standing still                                               | the sheet hopping ahead (G11)            | ●●       |
| outlier-3 | progress blocks alone, dither pulses, handshakes, marching ants           | the Copying dialog in small (G10)        | ●●●      |
| outlier-4 | LED wells, scope grids, lamps                                             | the message box and the palette (G7, G8) | ●●       |
| outlier-5 | bevel pops, blinks, repaints in jumps, typed figures                      | a sheet copied over (G9)                 | ●●       |
| outlier-6 | floppy labels, tear-off pads, perforations as a general shape             | window parts (G6, G19)                   | ●●       |
| outlier-7 | a rule under a hovered button, bevels that raise on hover                 | nothing on hover (G15)                   | ●        |
| outlier-8 | the drawer's woodgrain, scanlines, CRT glow, dials                        | the 1995 desktop (G7, G19)               | ●●●      |

---

## 4. The questions (research/retro-character)

| #   | Question                         | Rule | Options, recommended first                                                                                                                                 |
| --- | -------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve                 | G1   | whole frames, 8 a flight · 4 frames · 16 frames · smooth (as 2026 would)                                                                                   |
| 2   | The direction                    | G2   | copied in from the folder, top-left · dragged in from above (the picks) · painted left to right (the picks)                                                |
| 3   | Opening what drops from a button | G3   | dealt from its edge, the dialog zooms in outline · painted from the edge (the picks) · pops whole (today)                                                  |
| 4   | How long things take             | G4   | one flight: 90 a frame, 8 frames, loop 2520 · quick 60 a frame · slow 120 a frame                                                                          |
| 5   | Where the colour goes            | G5   | the 16-colour palette · the LED console (the picks) · navy and grey only                                                                                   |
| 6   | The corners                      | G6   | square, bevelled · the floppy notch on plates (the picks) · square and flat                                                                                |
| 7   | The surface                      | G7   | the desktop behind, window parts · the LED wells and scopes (the picks) · the woodgrain console (the drawer's pick)                                        |
| 8   | A warning                        | G8   | the message box · the LED and the scope (the picks) · the tinted plate                                                                                     |
| 9   | A live update                    | G9   | a sheet copied over · the bevel pops (the picks) · repainted in jumps (the picks)                                                                          |
| 10  | Loading                          | G10  | the Copying dialog in small · the progress blocks (the picks) · the dither pulses (today) · marching ants (the picks)                                      |
| 11  | The busy progress bar            | G11  | the sheet hops ahead · the blocks stand in the dither (today) · the blocks fill and empty                                                                  |
| 12  | The spinner                      | G12  | the hourglass (today) · the sheet flies round · the Find flashlight                                                                                        |
| 13  | Leaving and arriving             | G13  | copied in, flies to the Recycle Bin · shrunk to the centre (today) · the dissolve (the picks)                                                              |
| 14  | Buttons inside composites        | G14  | exactly retro's own · retro's own on a sunken panel · as today                                                                                             |
| 15  | Pointing at something            | G15  | nothing, as in 1995 · the selection bar on everything · the bevel raises (the picks)                                                                       |
| 16  | The focus ring                   | G16  | the two-channel ring with the dotted rectangle inside · the two-channel ring alone (today) · the dotted rectangle alone                                    |
| 17  | The press                        | G17  | the bevel pressed in one frame (today) · the bevel sinks in two frames (the picks) · the label only                                                        |
| 18  | The voice                        | G18  | Pixelify for chrome, Instrument Sans for words, VT323 for DOS · Pixelify for figures too · VT323 everywhere                                                |
| 19  | Motifs                           | G19  | the bevel, the ramp, the selection bar, the dither, the blocks, the drop, the desktop · plus the floppies and the LEDs (the picks) · as today (everything) |

---

## 5. Distinct from the other themes

| Aspect  | Retro (recommended)                    | Overlap found, and the difference                                                                                            |
| ------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Curve   | whole frames, nothing eases            | terminal and nostromo step too (phosphor and amber consoles); retro's frames are a desktop's redraw in grey, navy and teal   |
| Arrival | copied in as a flying sheet            | phantom throws a card on a curve; retro's sheet flies in frames along an arc and lands in a folder                           |
| Loading | the Copying dialog in small            | formal rules lines, titanium mills; nobody else flies paper between folders                                                  |
| Live    | a sheet copied over                    | nostromo refreshes a readout; retro's figure gets a new sheet on it                                                          |
| Hover   | nothing                                | every other theme marks hover; retro's 1995 did not, and its menu bar is the one that answers                                |
| Surface | the teal desktop, window chrome        | high-contrast and formal share Instrument Sans; retro's ground is a desktop with icons and a taskbar, which nothing else has |
| Motifs  | bevel, ramp, selection, dither, blocks | brutalism has hard drops on cream; retro's are grey-ink under a bevelled window                                              |
