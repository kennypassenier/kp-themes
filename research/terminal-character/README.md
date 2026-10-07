# What makes terminal terminal

**Why.** Kenny, 2026-10-07 14:32: "doe nu terminal", the next theme of the one-by-one series, the same way as titanium, forest,
nostromo, cyberpunk, synthwave, solstice, brutalism, grotesk and blueprint (02:54: "waar jij eerst uitzoekt wat bij mekaar past, wat
niet past en dan zo voorstellen doet"). The analysis is [themes/terminal/CHARACTER.md](../../themes/terminal/CHARACTER.md): every
decided terminal pick measured and played in Firefox, the grammar G1-G18, the families, seventeen outliers, the composites and
twenty-six proposals. This page turns the proposals into the questions Kenny answers to fix terminal's grammar.

**Already decided, not asked again.** Green Phosphor (2026-09-08: the screen, one hue, one mono, the scanlines, the headline that types
itself with a block cursor, inverse video as the only emphasis), the cursor in the box (R6-Q7), the cursor under the hand (gap-4), the
alarm (2026-09-16), the signature (2026-10-03: the braille spinner, `[####]` and `<=>`, the typed skeleton, toast and tooltip, the
printed dialog, `[x]`, the empty prompt), the resize a line at a time and the cursor's leave (2026-10-04), the reverse-close pairing,
every component pick of the character round, and **all six family picks** (2026-10-07 01:32, approved in full: the cursor waits, typed
out, the cursor blink, the cursor ring, the dumb-terminal plot, the htop meter). Terminal is the first theme of the series whose
grammar is mostly decided by its families; the questions ask how they carry to every part and where the other picks differ. Several
picks, drawn as they are, are another theme's picture (reverse video under the pointer is high-contrast's hover family, the trend's
_Reverse flash_ high-contrast's live family, a grid of cells on a plate blueprint's paper and synthwave's console, the dotted march
dark's ticker baseline, an edge bar grotesk's index, a 1 px press titanium's); each is still on the page as an option, named after the
theme it meets. **The network graph is in no scene**: it changes in no theme (Kenny, 02:54); in terminal it is a source (_The cursor
blink_ is the live family), never a target. The gallery shows it as decided.

**Played before it was written.** Every terminal pick was played in Firefox through its demo's own embed
(`?embed=<aspect>&theme=terminal`), its animations listed and their animated properties sampled every frame after the demo's replay
button and the review kit's restart. The tiles' _Scrolled_ never starts (the arrival rule, 0,4,0, outranks the live flash, 0,3,0), and
the trend's _Reverse flash_ changes the line from `rgb(53, 242, 52)` to `rgb(104, 243, 104)`, 1.05:1, so nothing is seen: CHARACTER.md
outlier-14 and proposal-13. Both were fixed on 2026-10-07 and sampled again per frame (_Scrolled_ steps up and back; _Reverse flash_ lights
the area under the line solid and turns the line to the plate's dark for 300 ms), with the blinks the names promise (CHARACTER.md outlier-13).

**What.** One page, terminal only, in the review kit's aspect mode (`data-review-themes="terminal"`). An intro, "What terminal is" (the
package's own parts, and on demand six decided character demos embedded as they are today: the families and the graph), then sixteen
questions. Each question is one rule of the grammar, with three options, each a live scene built from the package's components in
terminal (`.kp-button` with its register's cursor, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`, `.kp-kpi`, `.kp-meter`,
`.kp-progressbar`, `.kp-spinner`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-empty`, `.kp-field`, `.kp-page-header`, the divider). The
first option is always the recommendation; every option says what you see and why it is or is not recommended, on the page and in its
hint in the dialog.

| #   | Question (rule)                 | Options, recommended first                                                                                                              |
| --- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The step (G1)                   | one hard step per cell or line written · two jumps whatever the distance (the register) · a smooth glide (near grotesk's pace)          |
| 2   | How a part arrives (G2)         | typed out, the cursor at the head · typed out without the cursor (the family as drawn) · printed from the top (near nostromo, titanium) |
| 3   | Opening a menu or a dialog (G3) | printed by line feeds, the cursor at the next line · printed, no cursor (near titanium's cut) · slid in from its edge (titanium's)      |
| 4   | How long things take (G4)       | two clocks: the line and the blink · as the picks · at once (retro's 0 ms)                                                              |
| 5   | Where the colour goes (G5)      | one phosphor at three brightnesses · second hues and glows (near cyberpunk's and synthwave's neon) · one flat brightness                |
| 6   | The surface (G7)                | a line of htop: brackets at two ends (the family) · a grid of cells (near blueprint's paper) · a double box line (near high-contrast)   |
| 7   | A warning (G13)                 | reverse in its colour with `[warn]` / `[fail]` · reverse in its colour (the family as drawn) · an edge bar (grotesk's index)            |
| 8   | A live update (G9)              | three rapid blinks, bright and dim (the family, readable) · three blinks off and on (the graph's) · the reverse flash (high-contrast's) |
| 9   | Loading (G10)                   | the cursor waits (the family) · a run of cells along the foot (near dark's ticker) · the turning bar `\| / - \`                         |
| 10  | Leaving and arriving (G12)      | deleted by the cursor in one sweep (the leave) · backspaced, a cell a step · cleared line by line from the bottom                       |
| 11  | Buttons inside composites (G17) | exactly terminal's own · as today · own but quiet                                                                                       |
| 12  | Pointing at something (G8)      | the cursor ring and the cursor after the label (the family, gap-4) · reverse video (high-contrast's bar flips) · brighter only          |
| 13  | The focus ring (DI2)            | the dashed box, 2 px out (the family) · the package's two-channel ring · one 1 px dashed ring                                           |
| 14  | The press (G14)                 | entered in reverse video (the family's words) · a phosphor tint (the key figure as drawn) · sinks 1 px (titanium's press)               |
| 15  | The voice (G15)                 | as a shell writes: lower case, the sigils · capitals tracked wide (the dark themes' voice) · plain sentence case                        |
| 16  | Motifs (G16)                    | every motif means one thing · only text · on everything                                                                                 |

**How.**

- `demo.js` holds the sixteen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and the
  verdict), builds the rows (`data-tc-aspect`, option cells `data-tc-option`) and writes `data-review-choices` from the same data, so the
  page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-tc-<question>="<key>"` on the scene. Colours are tokens
  only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part, the waiting cursor
  standing lit. The "as picked" options reproduce the decided picks with the values measured in CHARACTER.md §2. Parts at rest are drawn
  as the recommended grammar has them, so each question changes only its own rule.
- The writing: one registered number, `--tc-k` (`@property`, inherited), runs 0 → 1 on a part in hard steps, one per cell
  (`--tc-n`, 34 ms each) or per line (`--tc-lines`, 136 ms each); the part's clip and its block cursor (`.tc-cur`) both read it, so the
  cursor stands on the cell or the line being written. A row of parts is one line typed through (`--tc-at`, the cells before a part);
  a row longer than 32 cells sends its cells faster (the process list: 19 ms a cell), so every part of a scene lands within about a
  second.
- Every close, leave and un-typing is its opening, arrival or typing played backwards: the same keyframes under a second name (so the
  motion restarts) with `animation-direction: reverse`, the row's last part first (`--tc-back`, the cells after a part). The cursor goes
  back with it.
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-tc-phase`: gap, in, hold, out), so the
  options of a row start together. It only writes attributes and text, in one pass, and never reads layout; rows far off screen are not
  rendered (`content-visibility: auto`). Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's Pause
  (Space) stops it.
- Hover, focus and press are shown standing still on marked parts (`.tc-pointed`, `.tc-focused`) and by the clock (`.tc-press`); the
  State buttons force a state on every button of question 11.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every recommendation was
measured against titanium's decided grammar, the eight proposed ones before it (forest, nostromo, cyberpunk, synthwave, solstice,
brutalism, grotesk, blueprint), the other registers and the families' picks (CHARACTER.md §7). The families are terminal's own and stay;
where the first recommendation met another theme, a terminal-own one replaced it: the register's two jumps by a step per cell or line;
the bare top-down print (near titanium's cut) by the print with the cursor at the next line; reverse video under the pointer
(high-contrast's hover family) by the family's cursor ring; the trend's flash in the ink (high-contrast's live family) by the family's
blink; the cell grids on plates (blueprint's paper, synthwave's console) by the htop brackets; tracked capitals (the dark themes'
labels) by the shell's lower case.

**Measured as the eye sees it** (Kenny, 15:16; 2026-10-07, Firefox, the page clock paused and every animation of a scene seeked together
to each 60 Hz frame, the revealed fraction read per part; at 1600 px):

| Scene (recommended option) | Part                                   | In: 50 % / 90 % / whole (ms)                  | Out: 50 % / 90 % gone / gone (ms) | Out = in backwards |
| -------------------------- | -------------------------------------- | --------------------------------------------- | --------------------------------- | ------------------ |
| The step, arrival          | a week, day by day (7 × 3 cells)       | 83–683 / 117–717 / 717                        | the last day first, 717 in all    | yes, every day     |
|                            | a tile (24 cells)                      | 417 / 750 / 817                               | 383 / 717 / 783                   | yes                |
|                            | a menu (4 lines)                       | 283 / 550 / 550                               | 150 / 417 / 417                   | yes                |
| How a part arrives         | three log lines (57 cells at 19 ms)    | 200–917 / 350–1067 / 1083                     | the last line first               | yes                |
|                            | a strip of columns (3 × 7 cells)       | 150–617 / 250–717 / 717                       | the last column first             | yes                |
|                            | a line in time (32 cells)              | 550 / 1000 / 1100                             | 517 / 967 / 1067                  | yes                |
| Opening                    | a menu (4 lines), a dialog (6 lines)   | 283, 417 / 550, 817                           | 150, 283 / 417, 683               | yes                |
| Leaving                    | an alert, a card, a key figure (glide) | 250 / 433 / 483                               | 250 / 433 / 483                   | yes (linear)       |
| A live update              | a value, a mark                        | bright at 0, dim at 167, 450, 750; ink at 900 | —                                 | —                  |
| The press                  | a button, the primary                  | reverse at 50 (one cell)                      | —                                 | —                  |
| Loading                    | the waiting cursor                     | lit 0–500, dark 500–1000                      | —                                 | —                  |

Side by side in a scene every part lands within 0.5 to 1.1 s (the week 717 ms, the tile 817, the menu 550, the log lines 1083, the line
in time 1100), so none looks instant beside another; each option's words were checked against these numbers (the glide and the slide
are even: 50 % at half their time; the steps are even: 50 % at half the cells). A one-frame difference between a run and its reverse
appears only where a step boundary falls exactly on a frame edge.

**Compared before it was handed over** (Firefox, at 1600 px and at 900 px, each row's options side by side at rest, and the motion rows
seeked through their frames as above): at rest no element of a scene runs past its scene and no scene reaches the next option at either
width; every scene clips what slides (`overflow: clip`). Found and fixed on the way: the leaving cursor started 1 ch left of its part
(it now stands at the part's start at the last frame); a close kept its first line and cursor visible after it ended (it now goes with
its last step); the cursor did not come back on a close (its animation took the same name both ways and did not restart); the week and
the strip typed in about half the time of the tile beside them (each day and column now counts its separating space). The page runs at
60 frames a second at every row (measured 17 ms median frame, 18 ms at the 95th percentile).
