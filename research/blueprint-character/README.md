# What makes blueprint blueprint

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
flips at half time): CHARACTER.md outlier-14 and proposal-13.

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
