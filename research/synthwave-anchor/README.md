# Synthwave's anchor element

**Why.** Kenny, 2026-10-07: "ik wil voor synthwave meer opties voor het ankerelement". An anchor is the one recognisable
element from which every decision about the whole theme is made: forest's is the tree progress bar, titanium's the new loading
animation, cyberpunk's the glitch, solstice's the sun on its arc, nostromo's the LED bank, brutalism's the hard slab, grotesk's
out-of-register, blueprint's the dimension line, terminal's the blinking block cursor. The colours are already right in every
theme and are the base; the anchor is a **shape and a motion**. Synthwave's own decided parts already point at it (the sun's ramp
and the busy road, the setting-sun spinner, the toast stripe, the link stripe, the band's neon rule, the marquee loading family),
but no single element has been named as the one they all come from.

**What.** One page, synthwave only, in the review kit's aspect mode (`data-review-themes="synthwave"`): one question, "which
element is synthwave's anchor?", six options, one per page in the dialog (the arrow keys flip). The page and the dialog show the
same board for every option:

- **Stage** (top left): the element alone in the middle, away, arriving, standing, leaving, by itself, in a loop.
- **Busy** and **Progress** (top right): the same element as a loading indicator. Busy has no end known; progress runs from 0 to
  100 % and starts again (a registered `--sa-p`, so one number drives every drawing; the readout counts it).
- **Three tiny chips** (bottom): how the same element would shape a **button press** (the package's own `.kp-button`, there all
  along, dipping when the element completes), a **card arriving** and a **toast leaving** (it arrives, and leaves the same way back).

| #   | Option                         | What it is                                                                                     | Existing synthwave part that already shows it                                     | Honest overlap                                                                                                        |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | The neon horizon (recommended) | one tube struck from the centre, the floor running to it, the object rising over it            | every panel's horizon line, the floor under every plate (G3, G7)                  | solstice's horizon line (divider, busy glow), nostromo's tube strike                                                  |
| 2   | The wireframe ridge            | a neon polyline mountain range drawn left to right, valleys filling with the grid              | nothing draws mountains (cousin: the graph's grid-floor constellation, untouched) | none, no other theme draws a ridge                                                                                    |
| 3   | The VCR on-screen display      | PLAY ▶, a segmented counter and a blocky SP/LP bar typed in; the tracking bar is the progress  | the OSD voice: VT323 labels, the tooltip typed in (G15)                           | typed-in text is cyberpunk's number, nostromo's figure, terminal's cells                                              |
| 4   | The chrome plate               | a chrome wordmark split by a hard horizon line (sky half, mirrored half), a glint on the line  | "chrome over the grid", Kenny's shape family (G7)                                 | cyberpunk's chrome gloss and chrome wipe (here a horizontal streak, never a diagonal)                                 |
| 5   | The slat cut (venetian blind)  | ten slats open like blinds, the gaps widening toward the foot like the sun's stripes           | the sunset leave cut by stripes, the button's sun cut                             | none; nostromo's vent slots are the nearest                                                                           |
| 6   | The marquee frame              | 32 bulbs round a sign frame lighting one after the other; loading is the chase round the frame | the marquee loading family (G10), along the top edge                              | it is that decision stretched to a frame, so it adds the least that is new; nostromo's LED bank is a row, this a ring |

Each option's page text says what you see, why it carries the theme, which existing part already shows it, and its overlap.
Option 1 is the recommendation. Strict grammar in every option: horizontal cuts, radius 2 px (plates square), nothing notched,
**nothing flickers**, a neon is a near-white core (`--kp-core`) with the colour in its glow, pink signals, cyan labels, laser
yellow warns. Kept out on purpose (another theme owns them): a glitch or chromatic split, a sun on an arc, an LED lamp bank, a hard
offset slab, dimension lines or arrowheads, a blinking block cursor, growth, mis-registered print plates. The network graph is not
touched.

**Controls** (in the page and mirrored into the dialog): State of the element (Cycle by itself, At rest, Arriving only), Replay,
and Slow every animation down x1 / x2 / x4 (the dialog's own speed button and Pause, Space, work too: the clock waits while paused).
Under reduced motion nothing moves and every board shows its finished pose (the progress at 62 %).

**How it is built.**

- `demo.js` holds the six options as data (`OPTIONS`: name, what you see, why, overlap) and builds the board from per-option part
  templates (`PARTS`), and writes `data-review-choices` from the same data, so the page and the dialog cannot disagree. The one
  clock writes `data-sa-phase` (gap 700, in 1500, hold 2300, out 1500 ms) on every board, which is what
  `research/_review/measure-motion.mjs` drives.
- `options.css` (layer `kp.signature`, tokens defined on `:is(.sa-page, .rv-dialog__stage)` because the dialog moves the section
  into its stage) draws every option. Every part that arrives carries `.sa-arr` and one kind (`sa-k-draw`, `-clipx`, `-clipc`,
  `-clipv`, `-clipup`, `-rise`, `-dash`, `-lift`, `-glint`, `-slat`, `-fade`, `-dip`): the kind names the keyframes, its own
  `--d` and `--t` set the delay and duration, and its `gap` rule is the pose it starts from. **Every leave is its arrival played
  backwards**: at `out` the same keyframes (a copy named `-r`: an animation of the same name would carry on from where `hold` left
  it instead of starting), the same curve and duration run with `animation-direction: reverse` and the delay mirrored
  (`--T - --d - --t`, `--T` being the board's span), so what arrived last leaves first. Bodies glide on the sunrise curve
  (`--sy-sun`); light (the typed blocks, the marquee bulbs) switches in hard steps or a 140 ms ramp.
- `.sa-mark`, an empty hidden-at-`gap` element in every stage and chip, is there only so `measure-motion.mjs` can tell a cell that
  arrives from one that was there all along: the tool reads "away" as hidden or opacity 0, and most of these arrivals are clips and
  transforms.
- Loading is CSS only and loops: `sa-prog` animates `--sa-p` 0 → 1 (in whole steps for the VCR's 16 blocks and the marquee's 32
  bulbs), the floor and the valley grid scroll linearly, the ridge's bright run travels at a constant speed, the VCR's counter ticks
  through a registered integer, the glint rests between runs, the slat wave and the tube's breathing alternate on the sunrise curve,
  the marquee chases one bulb in four, one bulb per beat (225 ms).
- Colours are tokens only (`--primary`, `--accent`, `--kp-core`, `--card`, `--background`, `--popover`, `--kp-stripe`,
  `--kp-hairline`, `--sidebar-background`); fonts are the theme's (KP Outrun Display, VT323, Rajdhani).

**Measured** (Firefox, 1600 px, `node research/_review/measure-motion.mjs research/synthwave-anchor --base http://127.0.0.1:8745`;
t50 / t90 in ms from the start of `in`, and from the start of `out` for the leave). Every leave of every part of every board is
its arrival's mirror (82 grouped part lines over the six options, every one "mirror"); no FRONT, no BLINK, no cut-in, no cut-out.

| Option    | Arrival span | Parts, in t50 / t90                                                                                      | Leave  |
| --------- | ------------ | -------------------------------------------------------------------------------------------------------- | ------ |
| 1 horizon | 1100         | tube 250/360, floor 250/350, far glow 350/460, haze 300/430, object rises 700/880, press dip 930/1000    | mirror |
| 2 ridge   | 1200         | ridge line 350/500, floor 350/500, ribs 550/700, valleys 700/850, object 900/1030, press dip 1030/1100   | mirror |
| 3 vcr     | 1200         | PLAY 230/450 (6 steps), counter 450/750 (8), bar 650/960 (16), object 850/1150 (12), press dip 1030/1100 | mirror |
| 4 chrome  | 1200         | mirror half and line 250/350, sky word 500/630, glint 900/1140, caption 800/890                          | mirror |
| 5 slat    | 1100         | slat 1 330/470 to slat 10 780/920 (a wave, 50 ms apart), rails 250/360, words 630/700                    | mirror |
| 6 marquee | 900          | bulb 1 70/130 to bulb 32 690/750 (20 ms apart), object opens 600/720, press dip 730/800                  | mirror |

**Compared before it was handed over** (Firefox, the board at 1600 and at 390 px, on the page and in the dialog; each option
frame by frame at 200, 450, 700 and 1000 ms). What was found and fixed: the mirrored half of the chrome plate first flipped the
glyphs and read "EXNCED" (it now shows the word's own lower half in the reflected colours); the slat blind's stripes first crossed
the words (the words now stand above the slats once they open); the first measure showed the leaves as not played backwards,
because a CSS animation of the same name carries on instead of restarting (hence the `-r` copies); and an `.sa-obj` without
`border-box` pushed the marquee's plate over its bulbs. In the dialog the section no longer overflows sideways (the kit's
`--rv-flip-max: 100%` for a full-width component, and no padding of its own).

**What could not be made true.**

- On a phone (390 × 844) the **dialog** leaves the stage only about 40 to 75 px: the kit's own phone layout (controls, bar, side
  panel) takes the rest, the same for every demo; the board itself, on the page at 390 px, is whole and uncropped (stage, loading
  pair and chips stack, nothing scrolls sideways). The option's hint in the dialog is kept to what you see and the overlap.
- The press chip's dip lands as the element completes (so the chip's span is the board's, which the mirror check needs), not at the
  first frame.
- Contrast: all words read at AA or better (cyan 11.7:1 on the tape, near-white 14.6:1, captions 5.4:1). Below AA, by design and
  never text: the unlit marquee bulbs, the VCR counter's ghost digits, the ridge's unlit ghost line, and the foot of the chrome
  plate's reflection, which fades into the void.
- The marquee's bulbs light with a 140 ms ramp, not an instant step (a bulb is half lit for about eight frames, so the arrival
  is not a hard-stepped chase like the loading chase, which is). It is the only place light is not a hard step; nothing flickers.
