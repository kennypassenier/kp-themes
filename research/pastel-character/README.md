# What makes pastel pastel

**Decided (Kenny, 14/10/2026 03:23): all nineteen questions approved after update 2** (research/pastel-character/decided.json): loading = the pom-pom caterpillar 6 (`b-bug-6`), spinner = the caterpillar 2 (`b-curl-2`), leave = the anchor then a thumbtack, focus = the dashed line alone, every other question its recommendation; not yet applied in css/pastel-register.css (the port); see themes/pastel/CHARACTER.md §0.

**Update 2, round 3 (2026-10-14): loading and the spinner are four families of six variants; everything else is decided.** Kenny's
round 2 verdict (update.json, update 2) locks 17 picks: the leave is _the anchor, then a thumbtack_ (`tack`), pointing _the corner
peels_ (`peel`), the motifs _from the sticker sheet and the press_ (`sheet`). Of the 21 loading/spinner pairs he kept 6 (the
doodle), 11 (the tag), 13 (the pom-pom caterpillar) and 20 (the paper plane) and asked for five variants of each; his point was that
the plane and the caterpillar went THROUGH the days of the month where the doodle had its own treatment for a day. So both questions
are 24 options: 1-6 the doodle, 7-12 the tag (`pairs-a.js`/`.css`), 13-18 the caterpillar, 19-24 the plane (`pairs-b.js`/`.css`);
variant 1 of each family is round 2's pair as he saw it ("jouw keuze uit ronde 2"), variants 2-6 are alternatives that treat every
carrier on purpose, the day circles above all (around them, onto them, from one to the next). Loading option N and spinner option N
are one variant, with the same name; `aspects.js` refuses to load if the two lists stop following each file's `PAIRS`. Neither
question recommends (`noRec`: all four families are Kenny's), so the dialog marks no option "aanbevolen" there. One layout for all
24: the week, the skeleton and the busy bar reserve the largest room any variant draws in above and below them (options.css), no
variant sets a margin of its own. The washi tape token (`--pa-tape-bg`) is two layers now, mint bands over the stripe colour,
because Firefox 153 painted a color-mix() stop inside the repeating gradient as the stripe colour with hairlines. The list is in
CHARACTER.md §6a.

**Update 1, round 2 (2026-10-14): loading and the spinner are 21 matched pairs.** Loading N and spinner N are one idea (every
name says "Paar N"): pair 1 the washi flutter and the tape roll, pair 2 pearls on a thread and today's candy dots, pairs 3-11 from
the planner and the risograph (`pairs-a.js`/`.css`), pairs 12-21 from the craft table (`pairs-b.js`/`.css`). Loading recommends
pair 1, the spinner pair 2 (Kenny's best; an option's `rec` marks a recommendation that is not first, so the pairs keep their
numbers), the tape roll marked "ook goed". The old drift, hop and chase options are gone. The list is in CHARACTER.md §6a.

**Update 1 (2026-10-14): five questions wait for Kenny's verdicts in the review dialog** (research/pastel-character/demo.html). Round
`2026-10-14-r1` was judged on 2026-10-14 (snapshot in `_previous/`): fourteen questions are approved and locked in `update.json`
(`picks.pastel`, the option keys; focus is _the dashed line alone_, not the recommendation), so the dialog no longer walks them and the
page marks each as decided with Kenny's option tagged. Asked again (`questions.pastel`, Kenny's words and the reply): loading and the
spinner (redone), the leave (option 1 shown to be the anchor itself, and two new options: the tape stuck on, a thumbtack pushed in), pointing
(the key figure's fold fixed) and the motifs (the empty state's lip redrawn). See themes/pastel/CHARACTER.md §0.

**Why.** Pastel was the only theme without a `CHARACTER.md`, and its one opening (the sheet: up from 18 px below, turned -2.5°, out of
nothing) reads plain (docs/THEME_LESSONS.md lesson 52). The analysis in [themes/pastel/CHARACTER.md](../../themes/pastel/CHARACTER.md)
reads Kenny's decisions for pastel (the 2026-09-08 concept "Second Pass", scope-4, scope-23, scope-24, the balloon leave, the open-reverse
rule, the thirteen character demos and his six family picks of 2026-10-07) and proposes the grammar G1 to G20 and, because pastel never had
an anchor round, the anchor itself (§0a): **printed twice, stuck on**. A part's second pass (a flat sky silhouette, `--fx-overprint`, no
words) springs from a wide misregistration into its rest 6 px off register, where it stays as the part's flat shadow; 120 ms later the part
swings down from its top-start corner onto it (Kenny's arrival family, _Stuck on_), one soft overshoot. The close is that backwards.

**What.** One page, pastel only, in the review kit's aspect mode (`data-review-themes="pastel"`): an intro (three paragraphs, from
`aspects.js`), "Wat pastel vandaag is" (the package's own parts in pastel), then nineteen questions, each one rule and three options (four for
the anchor; 24 for loading and the spinner, five for the leave), each a live scene built from the package's own components in
pastel. The first option is the recommendation, except in loading and the spinner, which have none (`noRec`); every option says
what you see and why it is or is not recommended, on the page and in its hint in the dialog. Options named "jouw keuze(s)" are the decided
demos' values, "vandaag" the register's. The text Kenny reads is Dutch; identifiers and this file are English.

| #   | Question (rule)                | Options, recommended first                                                                      |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | The anchor (§0a)               | printed twice, stuck on · into its off-register rest · popped (the picks) · the sheet (today)    |
| 2   | The curve (G1)                 | the soft landing · the register's spring (today) · the jelly                                    |
| 3   | The direction (G2)             | from its corner, in reading order · up from below (today) · bubbles from the corner (the pick)  |
| 4   | Opening from a trigger (G3)    | stuck on beside its trigger · bounced in (the pick) · popped from the button (the pick)         |
| 5   | Durations (G4)                 | one landing of 560 ms · brisk (400) · unhurried (780)                                           |
| 6   | Colour (G5)                    | three inks · as today (four, the pass in two colours) · candy (the picks)                       |
| 7   | Corners (G6)                   | two radii and the pill · all pills · the picks' mix                                             |
| 8   | Surface (G7)                   | paper with its pass, taped · paper with its pass · as today (soft shadows)                      |
| 9   | A tone (G8)                    | the sticker (family) · the heart sticker askew · the tape label                                 |
| 10  | Live (G9)                      | the wobble (family) · reprinted · squished (the picks)                                          |
| 11  | Loading (G10)                  | 24, no recommendation: the doodle 1-6 · the tag 7-12 · the caterpillar 13-18 · the plane 19-24 (CHARACTER.md §6a) |
| 12  | The spinner (G11)              | 24, option N the same variant as loading option N, no recommendation (CHARACTER.md §6a)          |
| 13  | Leaving and arriving (G12)     | the anchor itself · the anchor, then taped · the anchor, then a thumbtack · the balloon · popped |
| 14  | Composites (G13)               | pastel's own · as the register today · as the picks                                            |
| 15  | Pointing (G14)                 | the corner peels · lifted askew (today) · the tape tab                                          |
| 16  | Focus (G15)                    | the two rings, the outer dashed · the two rings (today) · the dashed line alone (the picks)     |
| 17  | Press (G16)                    | stuck down flat · squashed · the bubble shrinks (the pick)                                      |
| 18  | The voice (G17)                | one face, weight speaks · labels in spaced capitals · mono figures and labels                  |
| 19  | Motifs (G18)                   | from the sticker sheet and the press · plus the candy · none                                    |

**How.**

- `aspects.js` holds the questions as data (question, reason, rule, kind, scene key, options with what you see and the verdict). `demo.js`
  builds each question's scene (`SCENES`), the rows (`data-pa-aspect`, option cells `data-pa-option`) and `data-review-choices` from the
  same data, so the page and the dialog cannot disagree.
- **Two passes, two elements.** A part that opens or arrives is a `.pa-sheet` wrapper: its `::before` is the second pass, its first child
  (`.pa-ink`) the part itself, so the two run on their own clocks. `grammar.css` holds the tokens (the landing curve as `linear()`, the inks
  by role, the 6 px offset, the radii, the tape) and every keyframes pair (`pa-x` and `pa-x-r`, same frames). `options.css` (layer
  `kp.signature`) draws every option by `data-pa-<question>="<key>"` on its scene, mostly by naming keyframes and times in custom
  properties.
- **One clock** (`data-pa-phase`: gap 600, in 1800, hold 1600, out 1800 ms) plays every scene that opens, arrives or leaves; the close is
  `pa-x-r` played `reverse` on the same curve, delayed by the cell's window less the part's delay less its length, so it is the open's frames
  in reverse order and what came last goes first. The window is per cell (`--pa-nmax`, written by `demo.js`), the cell being what
  measure-motion.mjs mirrors on. The live question has its own beat (every 2.2 s, `data-pa-beat` a/b, two keyframes names). Loops
  (loading, the spinner, the press) run in CSS. The speed buttons stretch every duration by 2 or 4 (`--pa-slow`).
- Colours are tokens only (relative colours and `color-mix` of tokens, no literal); every motion is under
  `prefers-reduced-motion: no-preference`, the reduced pose is the part stuck on with its pass beside it.

**Measured (Firefox, 2026-10-14).**

- Motion: `python3 -m http.server 8749 --bind 127.0.0.1` from the repository root, then
  `node research/_review/measure-motion.mjs research/pastel-character --base http://127.0.0.1:8749` (10 s): 183 parts read "mirror"
  (every part of the anchor, curve, direction, opening, durations and leave scenes); no fault left. Not a pair by design: the durations
  question's contact button (pressed in hold, released in out: "closes with motion, opens without") and the trend line's clip, for which
  the tool prints no verdict (in run 140→560, out 170→440 ms). Recommended landing: the pass t50 160, t90 250 ms (from its start at 20),
  the part t50 280, t90 370 ms; FRONT only on the jelly (option 3 of question 2).
- Curve (computed from the curves, not the page): the landing is half at 36 % of its time and 90 % at 56 %, peak 1.08 at 75 %; the
  register's `cubic-bezier(0.34, 1.56, 0.64, 1)` is 90 % at 30 %, peak 1.098 at 57 %.
- Contrast (text against its composited plate, every button, menu entry, key-figure link, tone sticker and mark on the page): primary
  buttons 6.10:1, plain 10.16:1, ghost 6.45:1, menu entries 5.46:1 or more, the good tone sticker 4.57:1, the bad 5.16:1 or more, marks
  4.54:1 or more (the candy option's lowest). Unmeasured: the striped tape labels of question 9 option 3 (a gradient plate).
- Layout: no horizontal overflow at 390 px (page scroll width 390); screenshots at 1600 and 390 px checked by eye.

**Measured, update 1 (Firefox, 2026-10-14).** `python3 -m http.server 8771 --bind 127.0.0.1` from the worktree root, then
`node research/_review/measure-motion.mjs research/pastel-character --base http://127.0.0.1:8771 --aspect leave` (6 s):

- Leave option 1 is the anchor: every part reads exactly as the anchor question's option 1 (the pass in t50 160, t90 250, run 20→440; the
  part in t50 280, t90 370, run 140→560; out the mirror), and all of them "mirror". It names the anchor's keyframes (`pa-pass`, `pa-stuck`),
  curve and times; no option rule overrides them.
- Options 2 and 3: the tape and the tack run 580→920 ms in (from the moment the part has landed, 360 ms on the landing curve), and are the
  first thing out (140→360 ms), then the part (530→800) and its pass (650→920): every part "mirror". A cell that carries a fix has a window
  360 ms longer (`--pa-fixT`); the notice and the toast, which carry none, keep the anchor's window.
- Pointing: the key figure's fold sat 12 px inside its corner (measured with getBoundingClientRect: tile right 483, fold right 471) because
  the package gives every child of `.kp-kpi` `grid-column: 1 / -1`, which places an absolute child in that column; now `grid-column: auto`
  and the plate's radius. The empty state's lip: the plate is cut along the crease with `clip-path`, the lip is the folded corner.
- Layout: page scroll width 1600 at 1600 px and 390 at 390 px; screenshots at both widths checked by eye.

**Measured, round 2 (Firefox, 2026-10-14).** `python3 -m http.server 8791 --bind 127.0.0.1` from the worktree root, then
Playwright Firefox scripts over `demo.html?review=all` and the review dialog:

- 21 options in loading and in the spinner, on the page and in the dialog (flipped 1/21 to 21/21, each a distinct label); 14
  questions marked decided; the dialog walks five steps (loading 21, spinner 21, leave 5, pointing 3, motifs 3).
- Every carrier plays: each of the 13 strips of every loading scene and each of the 5 spinners of every spinner scene has a
  running animation (0 without one); under reduced motion 0 animations run in either row.
- No console error; page scroll width 1600 at 1600 px and 390 at 390 px, the dialog's 1502 and 388.
- Pair 3's ring (`a-circle`): 3.56:1 on the busy button, 3.88:1 on the page, 4.21:1 on the panel (was 1.52-1.80:1).
- `node research/_review/measure-motion.mjs research/pastel-character --base http://127.0.0.1:8791` (16 s): 202 part lines, 197
  "mirror", the 5 others the trend line's clip and the durations contact button as before. The loading and spinner loops are
  not cycle scenes, so the tool does not read them.

**Measured, round 3 (Firefox, 2026-10-14).** `python3 -m http.server 8801 --bind 127.0.0.1` from the worktree root, then Playwright
Firefox scripts over `demo.html?review=all` and the review dialog (`?next=../../catalogue/agenda.html&review=open`):

- One layout: every loading scene is 865.3 px high at 1600 and at 390 px (the seven cells 116.8, 134.9, 80.8, 120, 104, 115.6 and
  95.2 px in all 24; before, 755.7 to 819.7 px over nine layouts), every spinner scene 312.4 px; in the dialog 395.7 px (1600) and
  865.3 px (390) for all 24 loading options, 240 and 312.4 px for the spinners.
- The dialog walks two steps, Laden (24) and De spinner (24), each flipped 1/24 to 24/24 with 24 distinct labels; no visible text
  in either says "aanbevolen". Every one of the 7 loading carriers and 3 spinner carriers of every option has a running animation
  (168 and 72 of 168 and 72 in the dialog, 240 of 240 parts on the page); under reduced motion none runs.
- No console error or warning; page scroll width 1600 at 1600 px and 390 at 390 px, in the dialog too.
- The washi tape: every element that paints `--pa-tape-bg` (the surface tape, the leave's tape, the hover tab, caterpillar 5's
  leaf, plane 5's tape and tabs) now computes mint bands over the stripe colour, with no color() stop in the gradient; screenshots
  before (stripe colour with hairlines) and after checked by eye.
- `node research/_review/measure-motion.mjs research/pastel-character --base http://127.0.0.1:8801` (33 s): 199 part lines, 197
  "mirror", the 2 others the trend line's clip; FRONT only on the jelly (question 2 option 3). The loading and spinner loops are
  not cycle scenes, so the tool does not read them.

**Doubts.** The anchor's second pass is drawn by `::before`, which several package parts already use (the tooltip's bubble dots, the
empty state's disc); the port will need a box-shadow layer or a wrapper there. RTL is not drawn: the pass's offset and the swing's corner
are physical in this demo (CHARACTER.md G2 asks for logical ones).
