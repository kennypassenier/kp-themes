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
embedded as they are today), then, in round 2, eight questions. Each question is one rule of the grammar, with six or ten options, each a live
scene built from the package's components in synthwave (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`,
`.kp-kpi`, `.kp-meter`, `.kp-progressbar`, `.kp-spinner`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-skeleton`, `.kp-tooltip`,
`.kp-empty`, `.kp-field`, `.kp-page-header`, the divider). The first option is always the recommendation; every option says what you
see and why it is or is not recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                       | Options, recommended first                                                                                                                                                                                                       |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)                 | light leads, the body follows · tape transport · marquee beats · charge-up in three surges · strike then burn in · the sunrise S (round 1's), all shown on the package's progress bars                                           |
| 2   | Opening what drops from a button (G3) | the laser climbs · the sun's blinds · it stands up from the floor · the marquee carries it on · over the horizon (round 1's 1) · neon strikes (round 1's 2)                                                                      |
| 3   | The corners (G6)                      | tube ends overshoot · only top and bottom rules · the sun-stripe slots · a horizon slit through the sides · a corner pixel · square (the baseline)                                                                               |
| 4   | A warning (G13)                       | the VCR's pause and stop · the neon ring (round 1's) · a three-pip level · two tube rails · words cut by the sun's stripes · the sun going down                                                                                  |
| 5   | Loading (G10)                         | the ramp charges · the ramp flows · the road · the part is the bar · the sun's stripes light up · the floor drives · the scanner · headlights and tail lights · the equaliser · the marquee in the ramp's colours (ten attempts) |
| 6   | Leaving and arriving (G12)            | the sun's slab · the sun's stripes · the progress bar's ramp · the sunset's dye · five neon lines · a laser erases it · the marquee carries it off · it drives off · it lies down · the swallow as it was (round 1's, ten)       |
| 7   | The focus ring (G14, DI2)             | twin tubes · the sun's ramp · marquee bulbs · a tube cut by the slits · tube ends cross · the two-channel ring on its horizon                                                                                                    |
| 8   | The press (G14)                       | the ramp fills · the tube overdrives · the laser underneath · the light sinks · a chrome gleam · the VCR's ▶                                                                                                                     |

**Round 2 (Kenny, 2026-10-07 20:41).** Ten of the eighteen questions were approved as recommended and are not asked again: the
direction (rise over the horizon), the durations (beats 225 · 450 · 675 · 900), the colour roles, the surface (chrome over the floor),
the live update (the laser), the spinner (the sun), composites (synthwave's own button), hover (the tube turns up), the voice (the OSD
names, the chrome counts) and the motifs (research/synthwave-character/decided.json). They stay applied on every scene as the fixed
ground (`GROUND` in `demo.js` writes their `data-sy-<question>` attributes on each `.sy-scene`; `options.css` keys the parts at rest
and the rise over the horizon on them) and are no longer in the questions, the table of contents or `data-review-choices`. The other
eight came back with new options in Kenny's words: the curve ("I like the progress bars, come up with more examples": six characters
shown on `.kp-progressbar`), opening ("I like 1 and 2, more potential": his two stay as options 5 and 6, four bolder ones are new),
corners ("square, but we can do better": square is the baseline, five ideas strictly inside the grammar), the warning ("need more
options": six marks, the plate and the frame retired as terminal's and nostromo's), loading (ten attempts on the bar's ramp, stripes,
head and road, plus new ones), leaving and arriving (ten: what was wrong with the swallow is written on the page, none draws a growing
circle), the focus ring and the press (six new each; round 1's three are dropped). Each option says what you see, why it does or
does not suit synthwave, its honest overlap with another theme, and what `research/_review/measure-motion.mjs` read in Firefox.
Measured in the dialog too (tokens defined on `.rv-dialog__stage`, animations running). The round marker in `demo.html` is
`{"round":"2026-10-07-r2","reopen":[]}`: nothing was approved about these eight, so there is nothing to reopen.

**The anchor (Kenny, 2026-10-07 21:21): the page horizon.** One neon tube for the page on the header's foot, the floor being the page below
it, components carrying 1 px of its light, a brighter piece under a hand exactly as wide as the component. Nothing here was redone for it.
The options that already depart from that line: every option keeps the rise over the horizon as the ground; in the curve, the horizon
strikes first and the body follows (option 1); in the opening, the laser climbs as the horizon itself (option 1) and the blinds open from it
(option 2); in the corners, the rules and the tube ends are horizons at a plate's top and foot (options 1 and 2); in the warning, the rails
(option 4) and the dusk (option 6) are lines on the horizon; in the focus ring, the ring stands on its horizon (option 6); in the leave, the
slab, the ramp, the laser and the dye set behind the same horizon (options 1, 3, 4, 6); in the press, the laser, the sink and the gleam are
a lit line at the part's foot (options 3 to 5), as wide as the part. If Kenny picks any of these, its line should be the anchor's tube in
the real page, at the real component's width; the options here draw their own line at each scene part's width.

What was wrong with the swallow, found in the CSS: the disc was cyan, pink and violet (the sun is laser yellow to pink), its stripes
all one width (the sun's widen toward the horizon), the part faded under it, it ended as a whole striped rectangle that vanished in one
frame, and a circle growing from the foot is solstice's moon and dome. The new leaves keep "the sun takes it" in the sun's real colours
and stripes, end clean behind the horizon, and are authored as arrivals (the leave is the arrival played backwards by the page's script,
so the close is exact: measured "mirror" for every part of every option).

**How.**

- `demo.js` holds the eight questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and the
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
  Pause (Space) stops it. The loading pictures loop in CSS.
- Every close is its open played backwards (Kenny's standing rule; 2026-10-07 15:16: "ik weet niet of je openen en sluiten bv altijd het omgekeerde van mekaar hebt gemaakt"). At `out`, `demo.js` (`closeByReverse`, keyed to `data-sy-phase`) plays every arrival of a cell backwards over the cell's whole arrival: the same keyframes, curve and pace, what arrived last leaving first; the clock's `out` lasts as long as the longest close. Before, most scenes stood through `out` and were cut away at `gap`, or snapped shut as `out` began. The hand-drawn closes (setting behind the horizon, lift out, the strike's fade, the tape out) are gone, and the leave question's swallow and CRT arrive as their leaves backwards on the same curve (they arrived on a different curve). Measured frame by frame in Firefox with `research/_review/measure-motion.mjs`: every arrival's close is now its mirror within one frame.
- Focus is shown standing still on marked parts (`.sy-focused`, the ring drawn in `.sy-fring`) and the press by the clock (`.sy-press`,
  drawn in `.sy-fx`): pressed for a beat at `in`, released at `hold` as the press played backwards. The State buttons of round 1 are gone
  with composites and hover (both approved).
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
