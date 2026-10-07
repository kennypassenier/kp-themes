# What makes nostromo nostromo

**Decided (Kenny, 08/10/2026 00:05): all eighteen approved** (decided.json); the two reopened in update 2 settled as recommended: the live update is the raster redraw with its lamp, Loading is the screen redraws.; A live update: option 1 with a fix for the cut-off glow on the key figure; Loading: option 1 liked, ten more options asked (Update 2).

**Why.** Kenny, 2026-10-07 03:50, while he judges forest: "doe terwijl nostromo al", the same way as titanium and forest (02:54:
"waar jij eerst uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet? begin met 1 thema en we zullen dat één voor
één afwerken zo"). Nostromo is the second theme of that series. The analysis is
[themes/nostromo/CHARACTER.md](../../themes/nostromo/CHARACTER.md): every decided nostromo pick measured, the grammar G1-G18, the
families, nineteen outliers, the composites and twenty-six proposals. This page turns the proposals into the questions Kenny answers
to fix nostromo's grammar.

**Already decided, not asked again.** The lamp on every switch (scope-12, 2026-09-11), Beige Freight (2026-09-08), the size change
and the reverse-close pairing, and every component pick of the character round. Nostromo has no family picks
(research/families/VERDICTS.md: still open), so the questions derive the grammar from the component picks and the theme's world: the
warm-up five times (arrival), the klaxon five times (tone), the amber CRT, the duty roster and MU/TH/UR's screen (the screen), the
backlit vents and the indicator panel (the case). **The network graph is in no scene**: it changes in no theme (Kenny, 02:54); in
nostromo it is a source of the grammar (its lamp that blinks, its panel that switches on), never a target.

**What.** One page, nostromo only, in the review kit's aspect mode (`data-review-themes="nostromo"`). An intro, "What nostromo is"
(the ship's console: the case and the screens, the package's own parts, and on demand six decided character demos embedded as they
are today), then eighteen questions. Each question is one rule of the grammar and three options, each a live scene built from the
package's components in nostromo (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`, `.kp-kpi`, `.kp-meter`,
`.kp-progressbar`, `.kp-spinner`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-skeleton`, `.kp-tooltip`, `.kp-empty`, `.kp-field`,
`.kp-page-header`). The first option is always the recommendation; every option says what you see and why it is or is not
recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                       | Options, recommended first                                                                       |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | The motion curve (G1)                 | the ship's frame clock · smooth on the register's curve (four themes share it) · the current mix |
| 2   | The direction (G2)                    | the raster, rows from the top · everything start → end (titanium's) · as today                   |
| 3   | Opening what drops from a button (G3) | the tube strikes on · the tracker pings it open · cut open from the top (titanium's)             |
| 4   | How long things take (G4)             | 160 · 320 · 640 · 1600 ms · 80 · 160 · 320 · 960 · 240 · 480 · 960 · 2400                        |
| 5   | Where the colour goes (G5)            | ink acts, the lamp indicates, the screen amber · green phosphor (terminal's) · orange acts       |
| 6   | The corners (G6)                      | moulded plates, keys, tape and glass · 0.75 rem on everything · 2 px on everything               |
| 7   | The surface (G7)                      | the case and the screen, each its own · a screen on everything · only the case                   |
| 8   | A warning (G13)                       | the klaxon frame · the tone lamp · as today                                                      |
| 9   | A live update (G9)                    | the reading's lamp lights · a blip (dark's and synthwave's flare) · as today                     |
| 10  | Loading (G10)                         | the lamp bank computes · the lamps scan (synthwave's marquee) · as today                         |
| 11  | The spinner (G11)                     | the tape reel · a ring of lamps computes · the tracker pings                                     |
| 12  | Leaving and arriving (G12)            | switched off, struck on · the flare (today) · scrolls off the top                                |
| 13  | Buttons inside composites (G17)       | exactly nostromo's own · as today · nostromo's own plus the header's stripe                      |
| 14  | Pointing at something (G8)            | the switch's lamp lights · a scanline sweeps · as today                                          |
| 15  | The focus ring (G14, DI2)             | the two-channel ring, the lamp lit · the ring, the lamp lit orange · as today                    |
| 16  | The press (G14)                       | the key goes in · drops 1 px (titanium's) · as today                                             |
| 17  | The voice (G15)                       | label tape names, Michroma counts · mono for figures (titanium's, terminal's) · Michroma only    |
| 18  | Lamps, tape, vents, screws (G16)      | only where the ship has them · none · on everything                                              |

**How.**

- `demo.js` holds the eighteen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and
  the verdict), builds the rows (`data-nc-aspect`, option cells `data-nc-option`) and writes `data-review-choices` from the same
  data, so the page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-nc-<question>="<key>"` on the scene. Colours are
  tokens only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The "today"
  options reproduce the decided picks with the values measured in CHARACTER.md §2 (they are not the character demos' own CSS, so
  one scene shows the same parts in every option).
- The frame clock is a set of `linear()` easings (`--nc-f1` … `--nc-f12`, the count of 80 ms frames): the register's curve, each
  frame holding the value at its start, so the first frame shows the part switched on (a line, a lamp) and the last lands.
- The lamp bank is the signature progress bar's LED window drawn again (`.nc-bank`): a sixteen-LED pattern tile shifted by 0, 6, 3,
  13 and 9 LEDs, one shift every 320 ms (`steps(1)`), so nothing travels; the scan option moves one block of three LEDs instead.
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-nc-phase`: gap, in, hold, out), so
  the options of a row start together. Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's Pause
  (Space) stops it. Loading pictures loop in CSS.
- Every close is its open played backwards (Kenny's standing rule; 2026-10-07 15:16: "ik weet niet of je openen en sluiten bv altijd het omgekeerde van mekaar hebt gemaakt"). At `out`, `demo.js` (`closeByReverse`, keyed to `data-nc-phase`) plays every arrival of a cell backwards over the cell's whole arrival: the same keyframes, curve and pace, what arrived last leaving first; the clock's `out` lasts as long as the longest close. Before, most scenes stood through `out` and were cut away at `gap`, or snapped shut as `out` began. The tube's strike now closes as the strike backwards (it was the switch-off, 480 ms, a different path), and the ping and the cut, which snapped shut, close back the way they opened. Measured frame by frame in Firefox with `research/_review/measure-motion.mjs`: every arrival's close is now its mirror within one frame.
- Hover, focus and press are shown standing still on marked parts (`.nc-pointed`, `.nc-focused`) and by the clock (`.nc-press`), so
  they can be compared without a pointer; the State buttons force a state on every button of question 13, and the dialog presses
  Hover there by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode (`?embed=…&theme=nostromo`) only
  when it is opened.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every
recommendation was measured against titanium's decided grammar, forest's proposed one, the other registers and the families' picks
(CHARACTER.md §7). Six first recommendations overlapped and were replaced by a nostromo-own one: the smooth register curve (formal's,
light's, brutalism's and grotesk's too) by the frame clock, the blip (dark's and synthwave's live flare) by the reading's lamp, the
scanning lamps (synthwave's marquee) by the lamp bank computing, the cut from the top (titanium's opening) by the tube striking on,
mono figures (titanium's and terminal's voice) by Michroma figures, and the 1 px press (titanium's) by the key going in. Each overlap
stays on the page as an option, named after the theme it belongs to.

**Compared before it was handed over** (2026-10-07, Firefox, 1600 px wide, each row's three options side by side, paused
mid-motion frames of the motion rows, and the still rows at rest): the frame clock first ran at 40 ms frames, which could not be told
from the smooth curve; it now runs at 80 ms frames and holds each frame's starting value, so the strike shows its line first. The
focus question first offered "the ring alone", which differed from the recommendation only by an ink dot; it now offers the lamp lit
orange. The press first differed from titanium's 1 px drop only by a faint shadow; a key now rests raised and falls into a shadowed
well.

## Round 2 (anchor: the raster)

**Why.** Kenny decided on 07/10/2026 at 20:10 that nostromo's anchor, the one element every decision about the theme departs from, is
**the raster** (research/nostromo-anchor, option 6): a CRT picture drawn row by row from the top, with scanlines and a phosphor
persistence tail. The lamps on the case stay as decided (scope-12: a lamp on every switch and reading; G8, G9). This is the next round of
the same demo (round id `2026-10-07-r2`, every verdict reopened), reworked so the screen is drawn by the raster and the case keeps its lamps.

**The building blocks are the anchor's own**, not a second raster: the part uncovered from its top edge in whole 80 ms frames
(`nc-raster`, `steps(n, end)`), the beam riding the edge of what is written with a fading tail (`nc-beam`, the same gradient), the hum band
rolling down the glass in steps (`nc-roll`, `nc-hum`), the scanlines (`--nc-scan`). One clock for every raster-led option: a panel is written
in **4 frames** (320 ms), a screen or a figure in **8** (640 ms), a waiting screen loops in **20** (1600 ms). A close is the arrival played
backwards by `demo.js` (`closeByReverse`), so the raster's close erases from the bottom up under a climbing beam.

### Every question: kept, changed or replaced

| #   | Question         | Verdict                     | Why, in one line                                                                                                                                                             |
| --- | ---------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Motion curve     | kept, scene redrawn         | The frame clock is the raster's clock; its panels are now drawn by the raster in frames (smooth = the same draw gliding).                                                    |
| 2   | Direction        | changed                     | The raster is now the explicit leading rule (one picture, rows from the top, beam and tail); feed (titanium) and as today stay.                                              |
| 3   | Opening          | changed (cut replaced)      | Raster first, the tube strike second, the ping third; the cut from the top (titanium's) went, as the raster without beam and frames is the same picture.                     |
| 4   | Durations        | kept, scene redrawn         | The numbers are the raster's frame counts (2, 4, 8, 20); dialog, figure and loop now show the raster.                                                                        |
| 5   | Colour           | kept                        | Ink acts, lamp indicates, screen amber: the raster is amber on dark glass.                                                                                                   |
| 6   | Corners          | kept                        | Nothing in the raster changes a corner.                                                                                                                                      |
| 7   | Surface          | changed (option 3 replaced) | The screen is drawn by the raster and hums once drawn; "only the case" contradicts the anchor and became "scanlines on the plastic too".                                     |
| 8   | Warning          | kept                        | The klaxon frame is the case and the screen both; the raster adds nothing.                                                                                                   |
| 9   | Live update      | changed (blip replaced)     | The reading is redrawn under the beam and its lamp lights (screen and case in one); the lamp alone is option 2; dark's and synthwave's blip went.                            |
| 10  | Loading          | changed (scan replaced)     | A waiting part is a small screen that redraws; the lamp bank stays as the case-side option; synthwave's marquee scan went.                                                   |
| 11  | Spinner          | changed (ping replaced)     | A round glass scope redraws (recommended); the reel (case-side, already decided as the busy phone window) and the ring of lamps stay; the tracker's ping went.               |
| 12  | Leave and arrive | changed (scroll replaced)   | Drawn and erased by the raster (the close is the draw backwards); the tube switched off stays second; "scrolls off the top" went (rising is light's, pastel's, phantom's).   |
| 13  | Composites       | kept                        | A button is a switch of the case wherever it sits: lamp, ring, well.                                                                                                         |
| 14  | Pointing         | kept, option 2 reworked     | The lamp stays the recommendation (the case is what you touch); the old orange sweep is now a pass of the raster's beam, a transition so the way out is the way in reversed. |
| 15  | Focus ring       | kept                        | A system constant plus the lit lamp.                                                                                                                                         |
| 16  | Press            | kept                        | The key goes in: the case.                                                                                                                                                   |
| 17  | Voice            | kept                        | The screen already reads out in phosphor mono.                                                                                                                               |
| 18  | Motifs           | kept                        | Scanlines, beam and hum are the screen's motifs; the question already says "only on a screen".                                                                               |

### The recommendations of 2, 3, 9, 10 and 12 read as one grammar

Same drawing idea (the part is written from the top, a band per frame), same row order (top to bottom; a close bottom to top), same tail
(the anchor's beam gradient, 0.7 to 1.6 rem by part), same frame clock (80 ms; 4 frames a panel; 8 a screen; 20 a loop). Question 9 uses
the beam as the front of a veil of not-yet-refreshed phosphor over a value that is already there; question 10 and 11 loop the draw (12
frames writing, 6 standing, 2 blank) with the hum band; question 12 is question 3's draw backwards.

### Measured as seen (`measure-motion.mjs`, Firefox, 1600 px, ms from the start of the motion)

| Row                                | in t50 / t90         | out t50 / t90        | Mirror |
| ---------------------------------- | -------------------- | -------------------- | ------ |
| 3 raster: dialog, menu             | 160 / 320            | 170 / 250            | yes    |
| 3 raster: beam                     | 300 / 320            | 20 / 250             | yes    |
| 2 raster: week of days, list, tile | 160 / 240-320        | 170 / 250            | yes    |
| 2 raster: the screen's picture     | 320 / 560            | 330 / 570            | yes    |
| 4 frames: dialog; figure           | 160 / 320; 240 / 480 | 170 / 250; 330 / 570 | yes    |
| 7 screen: the plot's picture       | 320 / 560            | 330 / 570            | yes    |
| 12 raster: alert, card, key figure | 160 / 240-320        | 170 / 250            | yes    |
| 9 raster: veil / beam (no close)   | 160 / 320; 300 / 320 | not an arrival       | n/a    |

Not in the tool: the loops of 10 and 11 (infinite, no arrival), and the pointer of 14 (a transition played by the review dialog's own
pointer loop, 3 frames each way). The measured `out` run starts at 0 and ends at 250 while `in` runs 70 to 320: the same four frames, the
close having no first blank frame.

## Round 3 (update 2)

**Why.** Kenny, 07/10/2026 23:18, approved sixteen of eighteen and reopened two: "A live update: I pick option 1, but there is a
little bug, in the key figure number, the left side of the glowing button is cut off a bit, so it seems sliced, fix that · Loading: I like
one, but I want 10 more options, this defines the theme so make sure that I ge world class options, I want it to be hard to pick the best
one". `update.json` (update 2) locks the sixteen picks and reopens `live` and `loading` with his words and the reply; the dialog walks only
those two (checked in Firefox: "Step 1/2 · A live update", "Step 2/2 · Loading", the update box with comment and answer on each).

**The slice (live, option 1 and 2).** The package's key-figure label, `.kp-kpi__label` in `css/components.css`, has `overflow: hidden`
with `text-overflow: ellipsis`, and the demo's lamp (`.nc-lamp`, with `::after` drawing the lens at `inset: -1px` and a glow
`box-shadow: 0 0 6px 1px`) is the label's first child at its start: the label's clip box cut the glow flat on the start side and a little at
the top and foot. Fixed in options.css on `.nc-scene .kp-kpi__label:has(> .nc-lamp)` with `padding: 0.5rem; margin: -0.5rem` (the clip
keeps its ellipsis, the glow gets its room, the layout does not move). Reproduced and checked after the fix in Firefox at 4× on frames 40,
400 and 620 ms of the 640 ms lamp, for the key figure's, the trend line's and the strip column's labels (the same `.kp-kpi__label`), in both
options that light a lamp. **For the register:** any lamp drawn inside `.kp-kpi__label` will be clipped by that same rule (selector
`.kp-kpi__label`, property `overflow: hidden`, components.css line 1102); the register's `.kp-kpi` lamp needs the same room, or a place
outside the label's clip box.

**Loading: option 1 kept, `bank` and `mix` dropped** (the lamp bank and "as today" of round 2, to make room; their markup, rules and
keyframes are removed from demo.js and options.css). Ten new options follow, every one on the same eight waiting surfaces (busy bar, key
figure, table, menu entry, five days, chart plot, skeleton, meter), the same glass (`.nc-ras`, and a day as a glass cell), all custom
properties on `:is(.nc-page, .rv-dialog__stage)`, every loop infinite, 20 frames of 80 ms (`--nc-loop`), held whole (`steps(1, end)`
between keyframes), amber (`--sidebar-primary`) on the dark glass and the LED orange only as light; the reduced-motion pose is the picture
standing. The order after option 1 is the ranking; the recommendation stays option 1 (the only one drawn row by row from the top on
every surface), the phosphor decay is the named runner-up.

| #   | Key         | Name                            | What you see (per 1.6 s loop)                                                                                               | Overlap check                                                                                              |
| --- | ----------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | `raster`    | The screen redraws (unchanged)  | COMPUTING written row by row in 12 frames under the beam, stands 6, blank 2; hum band                                       | none (terminal waits on a cursor, cyberpunk hunts with a reticle)                                          |
| 2   | `decay`     | The phosphor decays             | struck in one frame (brightness 1.5), then 1 · 0.7 · 0.5 · 0.35 · 0.25, four frames each                                    | dark's and synthwave's flare is a smooth glow once on a value; this is five hard steps on a glass, forever |
| 3   | `diag`      | The ship runs its checklist     | CHK PUMPS / VALVES / FLOW / PRESSURE / TANKS, each written in 3 frames from the top, OK (cream) on the 4th; a day rewritten | words that change: none elsewhere; G10 literally                                                           |
| 4   | `interlace` | Two fields, as a 1979 tube      | odd lines (1 px mask) in 6 frames from the top, even lines in 6, whole 6, blank 2                                           | none; the stripes are 1 px apart at the small sizes                                                        |
| 5   | `lampsync`  | The write lamp follows the beam | option 1's redraw; the case's lamp beside the glass (a day's own lamp) lit LED orange for frames 0-11, out while it stands  | none; the screen half is option 1                                                                          |
| 6   | `warmup`    | The tube warms up               | dot (1), line (2), opens from the middle in 4, settles 2, stands 6, collapses in 2, line, dot, out                          | nostromo's own G3/G12, which Kenny did not pick for opening/leaving; opens from the middle, not the top    |
| 7   | `matrix`    | The character matrix            | the word through a 2 px dot grid (bold, 0.875 rem); rows lit from the top, a row a frame, 8 frames; stands 10, blank 2      | terminal is a neighbour (it types cells; this lights rows of dots)                                         |
| 8   | `scope`     | The oscilloscope trace          | a sine (SVG, `pathLength` 1) drawn start → end in 16 frames, stands 2, wiped 2; days show a short trace                     | start → end is the chart arrival's order, blueprint's pen and titanium's feed; not mirrored by `dir`       |
| 9   | `dither`    | The picture resolves            | a checkerboard mask 8 · 6 · 4 · 2 px, then whole, four frames each; opacity 0.7 → 1                                         | cyberpunk's glitch is a neighbour (it splits colours and jumps; this only sharpens)                        |
| 10  | `vhold`     | The vertical hold slips         | the picture and its next copy roll a fifth of the glass a frame with a blanking bar (two pictures in 10 frames), lock 10    | breaks G2 on purpose (a picture that falls); no other theme rolls a picture                                |
| 11  | `counter`   | The frame counter               | COMPUTING dim; two digit drums (`white-space: pre`, translated in 1em steps) count 00-19, the units drum twice a cycle      | none; a number that counts promises an amount                                                              |

**Measured as seen** (Firefox, every animation paused and seeked in 40 ms steps over two loops, the key figure's glass): every option's
value is the same at t and t + 1600 ms (period 1600, one `animation-duration` of 1600 ms; the checklist also 320 ms per day, the counter's
units drum 800 ms), and the held frames count as the names say: raster 12 writing steps + stand + blank, decay 5 steps, diag 15 (5 × 3),
interlace 6 + 6, lampsync 2 (on 0-959 ms, off 960-1599), warmup 11 distinct clips, matrix 8 + stand + blank, scope 16 steps of 1/16,
dither 4 sizes + whole, vhold 10 positions, counter 20 digit positions. No option glides: between samples the values jump.

**Compared side by side** before hand-over: a contact sheet per option (its scene at 0, 240, 640 and 1320 ms, Firefox 1600 px) was looked
at and three were redone: the checklist first wrote the empty top of the glass for two of its three frames (the row now has a 1.2 em box
round the glyphs), the dither's dot grid was unreadable at 0.62 rem (now a 50 % checkerboard), the counter's drums moved their own window
(now the count is the window). The overbright frames were pulled from brightness 2.2 to 1.5 so amber stays amber.

**Not solved (round 3).** The checklist's `nc-check` writes in three uneven slices (58 %, 47 %, whole) because the glyphs sit in the
middle of the glass; the day's number in `diag` the same. The scope's SVG trace does not mirror under `dir="rtl"`. The counter's drums use
`white-space: pre` line breaks for digits (no `content: counter()`: Firefox does not re-resolve a counter from an animated custom property,
tested). In the dialog the eight surfaces share one stage, so a glass is about 200 px wide; the page shows them two to a line at 1600 px (`.nc-trio--many`, columns of at least 26 rem).

### Not solved

- The chart's decided arrival (the phosphor trace, start to end) is a different order from the raster's; question 2 names it.
- Terminal prints a menu a line at a time under a block cursor: the raster's bands, beam and tail tell them apart, but they are neighbours.
- The word COMPUTING at 0.62 rem in dim amber on dark glass is below WCAG 2.2 AA for small text; it is decoration beside the busy part's own label.
- The raster's close shows its tail ahead of the climbing beam (it is the arrival backwards), not a lingering afterglow.
- CHARACTER.md (G2, G3, G9, G10, G11, G12) is not edited; it follows Kenny's verdict.
