# What makes blueprint blueprint

## Round two (2026-10-07 21:19, after the anchor)

**Why.** Kenny picked **the tracing pen** as blueprint's anchor ([research/blueprint-anchor](../blueprint-anchor/README.md), decided 21:19): the
visible plotter pen following one curve across a graticule, amber witness lines dropping from its nib to both axes and a pointer on each, so its
place is read on both scales. It is the one element every other decision of the theme departs from (forest: the tree bar; titanium: the loading
animation). The colours (cyan pen, amber annotation, Prussian ground) are the settled base. He loved the pen and the measuring, but not the
dimension line's bar form: **arrowheads, a hatched fill and a chain line do not come back**. Nothing in round one had been judged yet, so this round
reworks the sixteen questions around the anchor, in place (same demo id, same section and item keys, round marker `2026-10-07-r2`): where an option
drew another idiom (a sliding edge, a rise, a frame, a hatched plate, a cloud on its own, a line along the foot) it is replaced by one built from the
pen; where a question is about something the pen cannot draw (time, colour, type, consistency, the focus ring, where marks may stand) its options
stay and the recommended one agrees with the anchor. Every question keeps exactly three options, the recommendation first, and every option's text
says how it comes from the pen.

**The pen is one piece.** [pen.js](pen.js) and [pen.css](pen.css) hold the anchor's carriage (a 16 unit square in the steel line, a crosshair, a
nib that is down or up) on its gantry rail, the anchor's curve and its readings, and every pen route; the carriage and the curve are copied from
`research/blueprint-anchor/art.js` (the decided record is never read at run time). The pen is away at rest and while a part is away, shows only while
it works, and ends hidden, so every finished pose is the finished picture without a pen. A route is two fractions of the part's box (`--bw-px`,
`--bw-py`), two lengths (`--bw-ox`, `--bw-oy`: a witness line's overhang) and the nib (`--bw-nib`), all registered properties; the ink that follows
the nib ([options.css](options.css)) is written from the **same keyframe offsets**, so the ink and the pen cannot drift apart. The tracer reads the
one number `--bw-p` (0 to 1): the ink is uncovered to the pen's place, the nib's height is computed from the curve's own formula (`1 - e^(-5x)
cos(10x)`, scaled to 80 %), the two witness lines run from the nib to the foot and to the start edge, a pointer rests on each axis. One ramp for
the whole stroke, as in the anchor (a single interval of `--bw-p`); the corner-to-corner routes ramp on every stroke, as G1 says.

| #   | Question                        | Kept                                                                           | Replaced                                                                                                                                                            | Why                                                                                                                                                         |
| --- | ------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)           | all three: the plotter's feed (rec.), plain even pace, hard steps              | none                                                                                                                                                                | the feed is the anchor's own; the scene now shows it as the pen's speed on every stroke                                                                     |
| 2   | How a part arrives (G2)         | "constructed, then drawn", now the visible pen tracing the outline (rec.)      | "uncovered from the start" (titanium's feed) by **the pen sets it out on a diagonal**; "risen in steps" by **the pen marks it off with witness lines**              | a sliding edge and a rise are not a pen; the line in time is the anchor itself in every option (traced, read against both axes)                             |
| 3   | Opening a menu or a dialog (G3) | "drawn: traced from its corner", now the visible pen (rec.)                    | "drafted from the top" (titanium's cut) by **two axes first**; "unrolled from the tube" by **led in: a leader from the trigger, then traced**                       | the cut and the unroll are not a pen; the leader is the tooltip's approved way; a trigger now stands above the panel in the scene                           |
| 4   | How long things take (G4)       | all three: units of 160 ms (rec.), as the picks, at once                       | none                                                                                                                                                                | time is not drawn; the recommended one is the anchor's own timeline (18 units of 160 ms = 2880 ms)                                                          |
| 5   | Where the colour goes (G5)      | all three: cyan draws, amber annotates (rec.), cyan only, amber as main line   | none                                                                                                                                                                | colour meaning is not drawn; the scene adds the pen's trace and readings, so the split is seen on the anchor (cyan trace, amber witness lines and pointers) |
| 6   | The surface (G7)                | "four corner brackets" (your scope-18 instrument, now 2nd), "the section view" | "millimetre paper on every plate" (synthwave's grid) by **the graticule's axes** (rec.): a ruler along the start edge and the foot, paper only under data           | the anchor is framed by two ticked axes, not by a box or brackets; the decided brackets stay as the honest second choice                                    |
| 7   | A warning (G13)                 | "flagged: △ ▲ and the word" (now 2nd)                                          | "framed all round" (nostromo's klaxon) by **pointed out on a scale** (rec.); "hatched" (brutalism's tape) by **underscored by the pen**                             | frames and hatches are not the pen; the tone's pointer is the anchor's pointer, so the reading is placed on a scale                                         |
| 8   | A live update (G9)              | "revised: the amber cloud" (now 2nd), drawn by a visible pen                   | "retraced" (rise, solstice's) by **read again: the pointer slides** (rec.); "turned over" (grotesk's flap) by **gone over once more: a rule**                       | the pointer and its witness line are the anchor's reading; the cloud alone is a shape that says only "changed"                                              |
| 9   | Loading (G10)                   | "a section being hatched" (now 2nd), with a pen on its edge                    | "the pen along the foot" by **the pen traces its curve across the waiting place** (rec.); "marching outline" by **the pen keeps tracing the outline**               | the anchor is itself a loading picture; a line along the foot is forest's, solstice's and nostromo's, and marching dashes are high-contrast's               |
| 10  | Leaving and arriving (G12)      | "hatched out and lifted off" (your leave, now drawn by a pen), "untraced"      | "erased from the start" (titanium's cut) by **crossed out: two diagonals**                                                                                          | a sliding edge is not a pen; the cross is the drawing's sign for removed                                                                                    |
| 11  | Buttons inside composites (G17) | all three                                                                      | none                                                                                                                                                                | consistency is not drawn; the press dimension is now drawn with slash ticks (no arrowheads)                                                                 |
| 12  | Pointing at something (G8)      | "the witness lines alone" (your gap-4, now 3rd)                                | "the grid lights" (cyberpunk's) by **read on a scale: witness lines and a pointer on a ruler** (rec.); "a dashed ring" (forest's) by **a leader**                   | the pointers on a scale are the anchor's other half; a lit grid and a ring are other themes' ideas                                                          |
| 13  | The focus ring (DI2)            | all three                                                                      | none                                                                                                                                                                | an accessibility constant, not a drawing; the recommended ring already carries the witness lines                                                            |
| 14  | The press (G14)                 | "the darker ground alone"                                                      | "the dimension is taken" (arrowheads) by **the pen takes the dimension** (rec., slash ticks, drawn by a pen); "the line pressed in" by **the pen pricks the datum** | arrowheads must not come back; an inset line is a frame                                                                                                     |
| 15  | The voice (G15)                 | all three                                                                      | none                                                                                                                                                                | type is not drawn; the recommended lettering is the anchor's own (mono capitals sloped 15°)                                                                 |
| 16  | Motifs (G16)                    | all three                                                                      | none                                                                                                                                                                | where marks may stand is not drawn; the pen joins the motifs (shown only while something is drawn), parked on every plate in "on everything"                |

**The sixteen questions, the three options each (recommendation first; new = built from the pen in round two, kept = round one's idea).**

1. The motion curve: the plotter's feed (kept) · a plain even pace (kept) · hard steps (kept)
2. How a part arrives: the pen traces its outline, then inks it (kept, pen visible) · the pen sets it out on a diagonal (new) · the pen marks it off with witness lines (new)
3. Opening: the pen traces the panel from its corner (kept, pen visible) · two axes first (new) · led in: a leader from the trigger, then traced (new)
4. Durations: units of 160 ms (kept) · as the picks (kept) · at once (kept)
5. Colour: cyan draws, amber annotates (kept) · cyan only (kept) · amber as the main line (kept)
6. Surface: the graticule's axes, two ticked scales (new) · four corner brackets (kept) · the section view (kept)
7. A warning: pointed out on the reading's scale (new) · flagged △ ▲ and the word (kept) · underscored by the pen (new)
8. A live update: read again, the pointer slides (new) · revised, the pen draws the cloud (kept, pen visible) · gone over once more, a rule (new)
9. Loading: the pen traces its curve across the waiting place (new) · the pen hatches the section (kept, pen visible) · the pen keeps tracing the outline (new)
10. Leave: the pen hatches it out, then lifted off (kept, pen visible) · untraced (kept) · crossed out (new)
11. Composites: exactly blueprint's own · as today · own but quiet (all kept)
12. Hover: read on a scale (new) · a leader (new) · the witness lines alone (kept)
13. Focus ring: the two-channel ring · one dashed outline · one thin cyan outline (all kept)
14. Press: the pen takes the dimension (new, slash ticks) · the pen pricks the datum (new) · the darker ground alone (kept)
15. Voice: the draughtsman's lettering · upright mono capitals · the sans in sentence case (all kept)
16. Motifs: every motif means one thing · only the line · on everything (all kept, the pen added)

**Measured in Firefox** (`research/_review/measure-motion.mjs`, full speed, 1600 px; it matches the scene class `bw-scene`, so it runs unchanged).
Every part that arrives, opens, leaves or is pressed was driven `gap → in` and `hold → out` and seeked in 10 ms steps. The part is inked at three
quarters of its construction on purpose (t50 = t90 = 360 of 480 ms; 600 of 800 ms for a panel), the pen and its construction line run from the first
to the last frame of that time (a pen goes out and comes back, so the tool calls it a pulse), and the tracer is one ramp (t50 400, t90 670 of 800 ms:
the feed's own 50 % and 83.75 %). The close of every part is its arrival played backwards: the tool reports `mirror` for every one of them
(curve 1 to 3, arrival 1 to 3, opening 1 to 3, durations 1 to 2, leave 1 to 3), and no `FRONT`, `BLINK` or cut-off. A separate per-frame check (every part that arrives: the leave at t against the arrival at T − t, every animated component incl. the pen's registered
properties, 10 ms steps, ±1 frame, the two boundary frames apart) compared 20 651 frames in the 14 option scenes that have a part arriving
(234 to 3 734 frames each) and found 0 % deviation; run with the mirror deliberately wrong it fails at 100 %, so it does measure. The tool's own
report (247 parts, all `mirror`, no `FRONT`, `BLINK` or cut-off) agrees. Live updates and presses are not arrivals (they stay in place), so they have no close; their own timings: the reading 960 ms, the dimension
320 ms (drawn in 70 % of it), the leave 1120 ms (the hatch done at 60 %).

**Checked in the review dialog itself** (`demo.html?next=…&review=open`, Firefox, 1600 px and 390 px): every question and every option was shown in
`[data-rv-stage]` (flip with `[data-rv-flip-next]`, step with `[data-rv-go="1"]`); in all of them the scene's custom properties resolve (`--bw-feed`,
the pen's registered `--bw-px` and the others), every motion question's animations run inside the stage (arrival: ink, outline, pen, tracer; opening;
live; loading; leave; press: dimension, datum), and there are no console errors. No horizontal scroll of the page or the dialog at 390 px (the
stage's own inner width is 34 px wider than its box, in round one too; nothing inside it overflows).

**Scope.** `css/blueprint-register.css`, every package CSS and JS, `research/blueprint-anchor/`, other themes' files and `js/motion.js` are untouched;
the register changes only after Kenny's character verdict. The network graph is in no scene.

---

# Round one (history)

**Why.** Kenny, 2026-10-07 04:23: the themes one by one, in this order: cyberpunk, synthwave, solstice, brutalism, grotesk, blueprint;
blueprint last in that order, the same way as titanium, forest, nostromo, cyberpunk, synthwave, solstice, brutalism and grotesk (02:54:
"waar jij eerst uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet"). The analysis is
[themes/blueprint/CHARACTER.md](../../themes/blueprint/CHARACTER.md): every decided blueprint pick measured and played in Firefox, the
grammar G1-G18, the families, sixteen outliers, the composites and twenty-six proposals. This page turns the proposals into the questions
Kenny answers to fix blueprint's grammar.

**Already decided, not asked again.** Working Drawing (2026-09-08), the measurement frame (scope-18), the witness lines under the hand
(gap-4), the alarm and the laurels (2026-09-16), the signature (2026-10-03: the compass, the section skeleton, the dimension progress bar
and its chain line, the drawn check, toast, dialog and tooltip), the drawing as the resize and the hatched leave (2026-10-04), the
reverse-close pairing, and every component pick of the character round. Blueprint has **no family picks** (research/families/VERDICTS.md
lists it as open), so the grammar is read from the component picks themselves. Several picks, drawn as they are, are another theme's
picture (the uncovering edge is titanium's feed and formal's ledger pen, the top-down cut titanium's opening, a hatched plate cyberpunk's
scan-lined holo card, a lit grid cyberpunk's circuit, a dashed ring forest's blaze, a frame all round nostromo's klaxon, a rise
solstice's); each is still on the page as an option, named after the theme it meets. **The network graph is in no scene**: it changes in
no theme (Kenny, 02:54); in blueprint it is a source (_Revised_ gives the live update), never a target. The gallery shows it as decided,
first.

**Played before it was written.** Every blueprint pick was played in Firefox through its demo's own embed (`?embed=<aspect>&theme=blueprint`),
its animations listed and their animated properties sampled after the demo's replay button. Two picks do not move as named (the columns'
_Lettered_: `cl-a-wipe` declares only a `from` inset, two poses instead of six; the tiles' _Retraced in ink_: the arrival rule outranks the
flash and it never starts) and neither does the package's resize plot (`kp-sig-blueprint-size-plot`, an inset animated toward `none`, which
flips at half time): CHARACTER.md outlier-14 and proposal-13. All three were fixed on 2026-10-07 and sampled again per frame: _Lettered_
now wipes in six steps, _Retraced in ink_ plays (no arrival rule matches a flashing tile), the resize plot uncovers the line top down.

**What.** One page, blueprint only, in the review kit's aspect mode (`data-review-themes="blueprint"`). An intro, "What blueprint is" (the
package's own parts, and on demand six decided character demos embedded as they are today), then sixteen questions. Each question is one
rule of the grammar, with three options, each a live scene built from the package's components in blueprint (`.kp-button` with its
register's witness lines, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`, `.kp-kpi`, `.kp-meter`, `.kp-progressbar`, `.kp-spinner`,
`.kp-skeleton`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-empty`, `.kp-field`, `.kp-page-header`, the divider). The first option is always
the recommendation; every option says what you see and why it is or is not recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                 | Options, recommended first                                                                                                                |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)           | the plotter's feed (a ramp, an even feed, a ramp) · a plain even pace (grotesk's, high-contrast's) · hard steps                           |
| 2   | How a part arrives (G2)         | constructed, then drawn · uncovered from the start (titanium's feed) · risen in steps (near solstice's and synthwave's rise)              |
| 3   | Opening a menu or a dialog (G3) | drawn: traced from its corner, then inked · drafted from the top (titanium's cut) · unrolled from the tube                                |
| 4   | How long things take (G4)       | units of 160 ms · as the picks · at once (retro's 0 ms)                                                                                   |
| 5   | Where the colour goes (G5)      | cyan draws, amber annotates · cyan only · amber as the main line (near solstice's and deco's)                                             |
| 6   | The surface (G7)                | a measured part: four corner brackets · the section view (near cyberpunk's scan lines) · millimetre paper (near synthwave's grid)         |
| 7   | A warning (G13)                 | flagged: △ or ▲ and the word · framed all round (nostromo's klaxon) · hatched in its colour (near brutalism's hazard tape)                |
| 8   | A live update (G9)              | revised: the amber cloud and its letter (the graph's) · retraced in ink (near solstice's rise) · turned over                              |
| 9   | Loading (G10)                   | a section being hatched (the signature skeleton) · the pen along the foot (forest's, solstice's, nostromo's way) · a marching outline     |
| 10  | Leaving and arriving (G12)      | hatched out and lifted off (the leave) · untraced · erased from the start (near titanium's cut)                                           |
| 11  | Buttons inside composites (G17) | exactly blueprint's own · as today · own but quiet                                                                                        |
| 12  | Pointing at something (G8)      | the witness lines (gap-4) · the grid lights (cyberpunk's circuit) · a dashed ring (forest's blaze)                                        |
| 13  | The focus ring (DI2)            | the two-channel ring with the witness lines · one dashed outline · one thin cyan outline                                                  |
| 14  | The press (G14)                 | the dimension is taken · the darker ground alone · the line pressed in                                                                    |
| 15  | The voice (G15)                 | the draughtsman's lettering, mono capitals sloped 15° · upright mono capitals tracked wide (the dark themes') · the sans in sentence case |
| 16  | Motifs (G16)                    | every motif means one thing · only the line · on everything                                                                               |

**How.**

- `demo.js` holds the sixteen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and the
  verdict), builds the rows (`data-bw-aspect`, option cells `data-bw-option`) and writes `data-review-choices` from the same data, so the
  page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-bw-<question>="<key>"` on the scene. Colours are tokens only;
  every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The "as picked" options reproduce
  the decided picks with the values measured in CHARACTER.md §2. Parts at rest are drawn as the recommended grammar has them, so each
  question changes only its own rule.
- The feed: `linear(0, 0.031 10%, 0.125 20%, 0.875 80%, 0.969 90%, 1)`, the stepper plotter's trapezoid, applied per keyframe segment, so
  every stroke of an outline ramps on its own.
- The construction: a part stays hidden (`visibility`) while its `.bw-trace` (which keeps `visibility: visible`) draws the four sides of its
  outline by `background-size`; at three quarters the part is inked at once. Every clip animation writes both ends.
- The revision: a scalloped cloud on `.bw-cloud::before` (four rows of radial-gradient arcs), uncovered clockwise by a polygon swept from the
  carrier's centre; the letter (△B, △C …) is written by the clock.
- The section: two rules, two ticks and a cyan 45° hatch, cut start → end in 7 of 18 units, standing 7, lifted at once.
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-bw-phase`: gap, in, hold, out), so the
  options of a row start together; still and looping scenes stand at `hold`. It only writes attributes and text, in one pass, and never
  reads layout; rows far off screen are not rendered (`content-visibility: auto`). Replay restarts it; the speed buttons stretch every
  duration by 2 or 4; the dialog's Pause (Space) stops it.
- Every close is its open played backwards (Kenny's standing rule; 2026-10-07 15:16: "ik weet niet of je openen en sluiten bv altijd het omgekeerde van mekaar hebt gemaakt"). At `out`, `demo.js` (`closeByReverse`, keyed to `data-bw-phase`) plays every arrival of a cell backwards over the cell's whole arrival: the same keyframes, curve and pace, what arrived last leaving first; the clock's `out` lasts as long as the longest close. Before, most scenes stood through `out` and were cut away at `gap`, or snapped shut as `out` began. The hand-drawn closes (the ink hidden at once, a separate untrace) are gone; a closing panel keeps its ink for the quarter its drawing stood, as the open did. The unroll closes on its own curve and 300 ms (it closed in 280 ms on the reflected curve). Measured frame by frame in Firefox with `research/_review/measure-motion.mjs`: every arrival's close is now its mirror within one frame.
- Hover, focus and press are shown standing still on marked parts (`.bw-pointed`, `.bw-focused`) and by the clock (`.bw-press`); the State
  buttons force a state on every button of question 11.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every recommendation was
measured against titanium's decided grammar, the seven proposed ones before it (forest, nostromo, cyberpunk, synthwave, solstice,
brutalism, grotesk), the other registers and the families' picks (CHARACTER.md §7). The first ideas that overlapped were replaced by a
blueprint-own one: plain linear (grotesk's, high-contrast's) by the plotter's feed; the uncovering edge (titanium's, formal's) by the
construction; the top-down cut (titanium's) by the drawn opening; the hatched plate (cyberpunk's scan lines) by the measurement frame;
the frames and plates of the tones by the flag; the flip, rise and swell by the revision; the line along the foot by the section; upright
mono capitals by sloped lettering.

**Compared before it was handed over** (2026-10-07, Firefox, at 1600 px and at 900 px, each row's options side by side at rest and the
motion rows mid-motion: the construction 300 ms in, the revision 500 ms in, the press 450 ms in, the section 900 ms into its loop, the
leave 600 ms out; every option's animations sampled through a whole cycle, and every option that should move was seen to move). Found and
fixed on the way: the revision letter sat on the label above the figure (it stands beside the cloud now); the key figure placed the drawn
marks in its grid's area, so the witness lines crossed the figure (they take the plate's box now); the tile's Open link stretched and the
header's actions stacked in reverse under the package's narrow header (both keep their size and order); the register's own `.kp-menu`
frame and shadow doubled inside the overlay sheet. The scene is `box-sizing: border-box`, so it never runs past its row: at 900 px no scene
reaches the next option, and at 1600 px nothing sticks out of a scene.
