# What makes synthwave synthwave

**Round 1 verdict (Kenny, 07/10/2026 20:41): ten of eighteen questions approved as recommended (direction, durations, colour, surface, live, spinner, composites, hover, voice, motifs); the other eight (curve, opening, corners, warning, loading, leave, focus, press) come back with new options in round 2**; the machine-readable decided.json follows once all eighteen are settled (the gate treats a decided.json as a finished topic).

**Why.** Kenny, 2026-10-07 04:23: the themes one by one, in this order: cyberpunk, synthwave, solstice, brutalism, grotesk,
blueprint; synthwave second, the same way as titanium, forest, nostromo and cyberpunk (02:54: "waar jij eerst uitzoekt wat bij
mekaar past, wat niet past en dan zo voorstellen doet"). The analysis is [themes/synthwave/CHARACTER.md](../../themes/synthwave/CHARACTER.md):
every decided synthwave pick measured, the grammar G1-G18, the families, seventeen outliers, the composites and twenty-seven
proposals. This page turns the proposals into the questions Kenny answers to fix synthwave's grammar.

**Already decided, not asked again.** Outrun Horizon (2026-09-08), the signature (2026-10-03), the size change and the leave
(2026-10-04), the reverse-close pairing, every component pick of the character round, and Kenny's family picks of 2026-10-07 01:32,
approved in full: the marquee chases (loading), over the horizon (arrival), the laser flares (live), the marquee glows (hover, focus,
press), the neon spotlight ring (tone), chrome over the grid (shape). Four of those families, drawn as they are, are another theme's
picture (light's Sunrise on titanium's curve, dark's trace flares, dark's scope grid and cyberpunk's circuit, cyberpunk's holo rim);
the questions keep each family's name and idea and ask how it is drawn on the horizon, with the drawing as picked as a named option.
**The network graph is in no scene**: it changes in no theme (Kenny, 02:54); in synthwave it is a source of the grammar (the
grid-floor constellation, the outrun pulse), never a target.

**What.** One page, synthwave only, in the review kit's aspect mode (`data-review-themes="synthwave"`). An intro, "What synthwave
is" (the drive into the sunset: the floor, the tubes, the sun; the package's own parts, and on demand six decided character demos
embedded as they are today), then eighteen questions. Each question is one rule of the grammar, with three options, each a live
scene built from the package's components in synthwave (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`,
`.kp-kpi`, `.kp-meter`, `.kp-progressbar`, `.kp-spinner`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-skeleton`, `.kp-tooltip`,
`.kp-empty`, `.kp-field`, `.kp-page-header`, the divider). The first option is always the recommendation; every option says what you
see and why it is or is not recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                       | Options, recommended first                                                                                                    |
| --- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)                 | bodies on the sunrise curve, light switches · the register's quick curve (cyberpunk's, near titanium's) · a spring (pastel's) |
| 2   | The direction (G2)                    | rise over the horizon · race in from the start (the size change; near titanium's feed) · down from the top                    |
| 3   | Opening what drops from a button (G3) | over the horizon, its stripe striking on · Neon strikes alone (cyberpunk's, nostromo's) · cut from the top (titanium's)       |
| 4   | How long things take (G4)             | 225 · 450 · 675 · 900 (beats) · as the slowest picks (the dialog's 2880) · brisk 150 · 300 · 450 · 600                        |
| 5   | Where the colour goes (G5)            | pink acts, cyan reads, laser warns · as today · one neon: pink for everything                                                 |
| 6   | The corners (G6)                      | square panels, 2 px controls · the marquee's 0.4 rem (cyberpunk's holo, near dark's) · pills (light's, pastel's)              |
| 7   | The surface (G7)                      | chrome over the floor · the flat grid as picked (dark's scope, cyberpunk's circuit) · the marquee rim (cyberpunk's holo)      |
| 8   | A warning (G13)                       | the neon ring, the words in the tone · the arcade warning (the plates) · the full neon frame (nostromo's klaxon)              |
| 9   | A live update (G9)                    | the laser drawn under it · the glow flares on the digits (dark's trace flares) · as the components play it today              |
| 10  | Loading (G10)                         | the marquee on every waiting part · the floor drives (dark's ticker) · as today                                               |
| 11  | The spinner (G11)                     | the sun sets and rises, on the beat · a ring of marquee bulbs · the road                                                      |
| 12  | Leaving and arriving (G12)            | sets behind its horizon, cut by the stripes · the sun swallows it (solstice's eclipse) · switched off to a line (nostromo's)  |
| 13  | Buttons inside composites (G17)       | exactly synthwave's own · as today · synthwave's own, the header's as cyan pills                                              |
| 14  | Pointing at something (G8)            | the tube turns up, the sun cut crosses · the marquee outline on everything · as today                                         |
| 15  | The focus ring (G14, DI2)             | the two-channel ring, the tube lit · the marquee trace (one channel) · as today                                               |
| 16  | The press (G14)                       | the tube dips · drops 1 px (titanium's) · the sun cut holds                                                                   |
| 17  | The voice (G15)                       | the OSD names, the chrome counts · KP Tech Mono for the data (cyberpunk's face) · no OSD voice                                |
| 18  | Motifs (G16)                          | every motif means one thing · only the stripe · on everything                                                                 |

**How.**

- `demo.js` holds the eighteen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and the
  verdict), builds the rows (`data-sy-aspect`, option cells `data-sy-option`) and writes `data-review-choices` from the same data,
  so the page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-sy-<question>="<key>"` on the scene. Colours are
  tokens only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The "today"
  options reproduce the decided picks with the values measured in CHARACTER.md §2 (they are not the character demos' own CSS, so one
  scene shows the same parts in every option). Parts at rest are drawn as the recommended grammar has them (chrome over the floor,
  the stripe, square panels and 2 px controls, the OSD and the chrome display, the marquee), so each question changes only its own
  rule.
- The rise over the horizon: each part that opens, arrives or leaves sits in a `.sy-rise` wrapper with three children: the part,
  the sun's stripes (`.sy-cuts`: four bars in the ground's colour, fixed above the horizon and wider toward it, closing as the part
  rises) and the horizon (`.sy-horizon`: a near-white line with the pink bloom, drawn from its centre out). The part rises 0.5 rem,
  uncovered from its foot by `clip-path`; setting plays the same frames the other way. Bodies move on the sunrise curve
  `cubic-bezier(0.65, 0, 0.35, 1)`; light (the bulbs, the stripe's strike, the sun cut) switches in hard steps.
- A plate's stripe (`.sy-strip`) and floor (`.sy-floor`, a band at its foot so the words stand above the horizon) are elements of
  their own, so a question can switch them; in the key figure, a grid, they take no grid area.
- The marquee: a row of bulbs (0.5 rem, one every 0.85 rem) along the top of each waiting part, one in four lit, the light stepping
  one bulb per beat (`steps(4)` per 900 ms); a day carries one bulb that lights on its beat, the days a beat apart.
- The laser of a live change is each carrier's `::after`: drawn from its centre out on the sunrise curve, flaring, burning down
  (675 ms).
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-sy-phase`: gap, in, hold, out), so
  the options of a row start together. It only writes attributes and text, in one pass, and never reads layout; rows far off screen
  are not rendered (`content-visibility: auto`). Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's
  Pause (Space) stops it. Loading pictures, the spinner and the sun cut on a pointed button loop in CSS.
- Every close is its open played backwards (Kenny's standing rule; 2026-10-07 15:16: "ik weet niet of je openen en sluiten bv altijd het omgekeerde van mekaar hebt gemaakt"). At `out`, `demo.js` (`closeByReverse`, keyed to `data-sy-phase`) plays every arrival of a cell backwards over the cell's whole arrival: the same keyframes, curve and pace, what arrived last leaving first; the clock's `out` lasts as long as the longest close. Before, most scenes stood through `out` and were cut away at `gap`, or snapped shut as `out` began. The hand-drawn closes (setting behind the horizon, lift out, the strike's fade, the tape out) are gone, and the leave question's swallow and CRT arrive as their leaves backwards on the same curve (they arrived on a different curve). Measured frame by frame in Firefox with `research/_review/measure-motion.mjs`: every arrival's close is now its mirror within one frame.
- Hover, focus and press are shown standing still on marked parts (`.sy-pointed`, `.sy-focused`) and by the clock (`.sy-press`), so
  they can be compared without a pointer; the State buttons force a state on every button of question 13, and the dialog presses
  Hover there by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode (`?embed=…&theme=synthwave`) only
  when it is opened.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every recommendation
was measured against titanium's decided grammar, forest's, nostromo's and cyberpunk's proposed ones, the other registers and the
families' picks (CHARACTER.md §7); cyberpunk's analysis had warned that synthwave shares its register curve and its neon. Nine first
ideas overlapped and were replaced by a synthwave-own one: the register's quick curve (cyberpunk's exactly, nearly titanium's) by
the sunrise curve with light that switches; the rise from the baseline (light's Sunrise) by the rise over a lit horizon through the
sun's stripes; the menu's strike alone (cyberpunk's and nostromo's) by the rise with the strike kept as its light; the flat grid
(dark's scope, cyberpunk's circuit) and the glowing rim (cyberpunk's holo) by the floor; the soft corner (cyberpunk's holo) by square
panels and 2 px controls; the glow flare on the digits (dark's live family) by the laser under the value; the circle closing over a
leaving part (solstice's eclipse) by the sunset behind the horizon; the 1 px press (titanium's) by the tube's dip; KP Tech Mono
(cyberpunk's label face) by the OSD. Each overlap stays on the page as an option, named after the theme it belongs to.

**Compared before it was handed over** (2026-10-07, Firefox, 1600 px wide, each row's options side by side at rest, and the motion
rows at a quarter speed mid-motion). The floor first filled the lower half of every plate, where it ran under the words; it is now a
band at the plate's foot. The key figure's stripe and floor first sat inside its padding, because a grid places an absolute child in
its grid area; they now take no area. The sun's stripes as a mask on the rising part did not follow the animated value in Firefox;
they are now bars in the ground's colour that the part rises through. The warning's ring first took a row of its own in the key
figure; it now stands in the label. The full-frame tone option first blinked the whole part; it now stands still.
