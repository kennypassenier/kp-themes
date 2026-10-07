# What makes grotesk grotesk

**Why.** Kenny, 2026-10-07 04:23: the themes one by one, in this order: cyberpunk, synthwave, solstice, brutalism, grotesk, blueprint;
grotesk fifth in that order, the same way as titanium, forest, nostromo, cyberpunk, synthwave, solstice and brutalism (02:54: "waar jij
eerst uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet"). It also carries the grotesk-only loading demo Kenny asked
for on 2026-10-06 at 21:37, when he picked _Out of register_ as the network graph's grotesk loading: that picture is the start of
grotesk's loading grammar and has four questions of its own (9 to 12). The analysis is
[themes/grotesk/CHARACTER.md](../../themes/grotesk/CHARACTER.md): every decided grotesk pick measured and played in Firefox, the grammar
G1-G18, the families, seventeen outliers, the composites and twenty-eight proposals. This page turns the proposals into the questions
Kenny answers to fix grotesk's grammar.

**Already decided, not asked again.** Twelve Columns (2026-09-08), the baseline that appears under a touched control (scope-12,
2026-09-12), the inverting coloured buttons and their grey press with a black label (2026-09-13/14), the alarm (scope-94), the signature
(2026-10-03), the cut as the resize and the colour bands as the leave (2026-10-04), the reverse-close pairing, and every component pick
of the character round. Grotesk has **no family picks** (research/families/VERDICTS.md lists it as open), so the grammar is read from the
component picks themselves. Several picks, drawn as they are, are another theme's picture (a cut in place from the start is titanium's
arrival, the red bar on every plate is synthwave's stripe, the inversion is high-contrast's, at once is formal's, the eased set-in-type
curve is synthwave's sunrise); each is still on the page as an option, named after the theme it meets. **The network graph is in no
scene**: it changes in no theme (Kenny, 02:54); in grotesk it is a source of the grammar (out of register, the train passes, the transit
map), never a target. The gallery shows it as decided, first.

**Played before it was written.** Kenny found grotesk picks that do not move ("sommigen bewegen zelfs niet!", 2026-10-06 21:07). Every
grotesk pick was played in Firefox through its demo's own embed (`?embed=<aspect>&theme=grotesk`), its animations listed and their
animated properties sampled every frame after the demo's replay button. Three picks do not move (the busy table's _The poster shifts_,
the tour's _The rule re-stamps_, the tiles' _Flipped_) and neither does the package's resize cut (`kp-sig-grotesk-size-cut`, an inset
animated toward `none`, which flips at half time): CHARACTER.md outlier-14 and proposal-17, with the cause of each.

**What.** One page, grotesk only, in the review kit's aspect mode (`data-review-themes="grotesk"`). An intro, "What grotesk is" (the
package's own parts, and on demand six decided character demos embedded as they are today, the graph's _Out of register_ first), then
nineteen questions. Each question is one rule of the grammar, with three options, each a live scene built from the package's components
in grotesk (`.kp-button` with its label, so the register's baseline draws, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`,
`.kp-kpi`, `.kp-meter`, `.kp-progressbar`, `.kp-spinner`, `.kp-skeleton`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-empty`, `.kp-field`,
`.kp-page-header`, the divider). The first option is always the recommendation; every option says what you see and why it is or is not
recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                              | Options, recommended first                                                                                                       |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)                        | on time: an even pace, a dead stop, the loop's dwell · hard cuts (terminal's, nostromo's, cyberpunk's) · eased (synthwave's)     |
| 2   | The direction (G2)                           | set along its line from behind its start edge · cut in place from the start (titanium's feed) · rising (solstice's, synthwave's) |
| 3   | Opening a menu or a dialog (G3)              | printed by the colour bands (the leave backwards) · cut in from the start, as picked (near titanium's) · slid in from the end    |
| 4   | How long things take (G4)                    | 120 · 240 · 480 · 2640 (units of 120 ms) · as the picks, the slowest · at once (retro's 0 ms)                                    |
| 5   | Where the colour goes (G5)                   | black builds, the red signals once · line colours (the transit map on every plate) · black plates (near high-contrast's)         |
| 6   | The surface (G7)                             | a column under its rule, no box · the transit board's red bar (near synthwave's stripe) · the box (high-contrast's, brutalism's) |
| 7   | A warning (G13)                              | indexed: a start-edge bar and the tone's word · the figure on the tone's plate (high-contrast's) · the underlined figure         |
| 8   | A live update (G9)                           | the train passes (the graph's) · flipped, as picked (a jump) · inverted (high-contrast's)                                        |
| 9   | Loading: the picture on every waiting part   | out of register (the graph's, carried) · a line runs (forest's, solstice's, nostromo's way) · the flap board                     |
| 10  | Loading: how the red plate moves (G10)       | round the black, then into register (the graph's) · along the line · in hard steps                                               |
| 11  | Loading: the spinner (G11)                   | the register mark · the signature's quarter, as approved · the package's ring                                                    |
| 12  | Loading: the busy bar and the skeleton (G11) | printed out of register · the signature, as approved · a line runs                                                               |
| 13  | Leaving and arriving (G12)                   | the colour bands at an even pace (the leave) · cut out in three hard cuts (near titanium's) · shoved out (near brutalism's slam) |
| 14  | Buttons inside composites (G17)              | exactly grotesk's own · as today · grotesk's own but quiet (words only inside a composite)                                       |
| 15  | Pointing at something (G8)                   | the baseline appears (scope-12) · a bar on the edge thickens (near solstice's lit foot) · inverted (high-contrast's)             |
| 16  | The focus ring (G14, DI2)                    | the two-channel ring with the baseline · one red outline · a thin ink frame                                                      |
| 17  | The press (G14)                              | the rule thickens (scope-12) · the grey alone · reverse video (terminal's)                                                       |
| 18  | The voice (G15)                              | Archivo heavy and tight, Inter, sentence case · mono capitals (the dark themes') · all lowercase (the Bauhaus)                   |
| 19  | Motifs (G16)                                 | every motif means one thing · only the grid and the rule · on everything                                                         |

**How.**

- `demo.js` holds the nineteen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and the
  verdict), builds the rows (`data-gk-aspect`, option cells `data-gk-option`) and writes `data-review-choices` from the same data, so the
  page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-gk-<question>="<key>"` on the scene. Colours are tokens only;
  every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The "as picked" options reproduce
  the decided picks with the values measured in CHARACTER.md §2. Parts at rest are drawn as the recommended grammar has them, so each
  question changes only its own rule. The page-wide knobs are declared on the scene too, because the review dialog shows a copy of a scene
  outside the page.
- The set: a part slides out from behind its own start edge (a translate of its own width with a clip that keeps the start edge still), so
  nothing shows before its turn. Every clip animation writes both ends: an inset toward the part's own `none` flips at half time, which is
  exactly the fault found in the register's resize cut.
- The bands: a 300 % strip of red, ink and paper thirds over the part (the leave's own drawing), moved by `translate` only; paper covers the
  part in the clock's gap, so nothing needs hiding.
- The proof: a waiting reading's place in two plates, the red on `::before` and the ink on `::after`, both painted from one `--gk-img`
  declared on each pseudo-element so each resolves its own `--gk-c`; only the red plate moves (`translate`, a transform), round the ink
  through eight positions at an even pace, into register and a 4-unit dwell, 22 units in all, two units apart from proof to proof. The plot's
  proof is its own line drawn twice in the svg.
- The train: a 1.5 em red mark on the value's baseline (`::after`), run once along it by `background-position`; the value never moves.
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-gk-phase`: gap, in, hold, out), so the
  options of a row start together; still and looping scenes stand at `hold`. It only writes attributes and text, in one pass, and never
  reads layout; rows far off screen are not rendered (`content-visibility: auto`). Replay restarts it; the speed buttons stretch every
  duration by 2 or 4; the dialog's Pause (Space) stops it. Loading pictures and the spinners loop in CSS.
- Hover, focus and press are shown standing still on marked parts (`.gk-pointed`, `.gk-focused`) and by the clock (`.gk-press`); the State
  buttons force a state on every button of question 14.
- The gallery of decided components loads the character demos through the review kit's embed mode only when it is opened.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every recommendation was
measured against titanium's decided grammar, forest's, nostromo's, cyberpunk's, synthwave's, solstice's and brutalism's proposed ones, the
other registers and the families' picks (CHARACTER.md §7). Six first ideas overlapped and were replaced by a grotesk-own one: the
register's smooth curve (formal's, light's, nostromo's, brutalism's) by the even pace with the station clock's dwell; the cut in place
from the start (titanium's arrival) by the set along the line, and as the opening by the colour bands; the red bar on every plate
(synthwave's stripe) by the ink rule; the jump, the inversion and the at-once update (high-contrast's, formal's) by the train; eight
runners along the foot (forest's, solstice's, nostromo's way) by out of register; the register's mono labels (the dark themes') by Inter
in sentence case. Each overlap stays on the page as an option, named after the theme it belongs to.

**Compared before it was handed over** (2026-10-07, Firefox, 1600 px wide, each row's options side by side at rest and the motion rows
mid-motion: the set at 100 ms into its turn, the bands half way, the train running, the leave half way; every option's animations sampled
through one whole cycle, so every option that should move was seen to move). A clip animated toward `none` flipped at half time in the
first build; every clip now writes both ends. The index bar sat on a key figure's words (the key figure's grid placed it in a grid area);
it now takes the plate's padding box. The plot's red plate slipped far more than the others (a translate on the svg is in viewBox units,
stretched by the plot); its distance is set in those units. The chart's reading label was crossed by the plot's baseline; it now stands
under it. A toned state's plate stretched the whole width; it keeps to its words. The tile's Open link stretched and the header's actions
stacked in reverse under the package's grid; both keep their own size and order. The signature skeleton's lines took the page's gap on
top of the register's own spacing; they keep the register's. The punched holes of the last motif option were too faint to see; they are
drawn in ink. At 900 px, where the options stack, each scene ran 44 px onto the next option's heading (as a grid, the
scene's row left out its padding and border; brutalism's demo does the same); a stacked option is now a plain column.
