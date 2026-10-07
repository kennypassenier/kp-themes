# What makes synthwave synthwave

**Round 1 verdict (Kenny, 07/10/2026 20:41): ten of eighteen questions approved as recommended (direction, durations, colour, surface, live, spinner, composites, hover, voice, motifs); the other eight (curve, opening, corners, warning, loading, leave, focus, press) came back with new options in round 2.** Round 3 (this page) asks the same eight again, every option drawn from the anchor Kenny decided at 21:21: the page horizon. The machine-readable decided.json follows once all eighteen are settled (the gate treats a decided.json as a finished topic).

**Why.** Kenny, 2026-10-07 04:23: the themes one by one, in this order: cyberpunk, synthwave, solstice, brutalism, grotesk,
blueprint; synthwave second, the same way as titanium, forest, nostromo and cyberpunk (02:54: "waar jij eerst uitzoekt wat bij
mekaar past, wat niet past en dan zo voorstellen doet"). The analysis is [themes/synthwave/CHARACTER.md](../../themes/synthwave/CHARACTER.md):
every decided synthwave pick measured, the grammar G1-G18, the families, seventeen outliers, the composites and twenty-seven
proposals. This page turns the proposals into the questions Kenny answers to fix synthwave's grammar.

**Round 3 (Kenny, 2026-10-07, after the anchor): the anchor first.** At 21:21 Kenny decided synthwave's anchor element, the page
horizon (research/synthwave-anchor): one neon tube for the page on the header's foot, the floor being the page below it, each part
carrying 1 px of its light, and under a hand a brighter piece of the tube exactly as wide as that part. He asked whether round 2 had
been made after that conclusion, because the anchor decides the whole theme. It had not: round 2 was built in parallel with the anchor
demo, so its eight options were drawn on stages of their own and only some of them happened to lie on that line. **Round 3 re-derives
the eight questions from the anchor, so that every option departs from the page horizon.** Round 2's options that Kenny never judged
were kept only where they already departed from the horizon (and then redrawn on it); the rest are dropped. Two things Kenny did judge
stay as options in the opening question (his liked 1 and 2 of round 1, now on the page horizon). The round marker in `demo.html` is
`{"round":"2026-10-07-r3","reopen":[]}`: the eight questions had no verdict to reopen.

**Every option is a real piece of page at real size.** The scene is `.kp-page-header` with its title and actions at real size (a
primary button is 36 px tall), the page tube (3 px, near-white core, the quieter bloom) on its foot, the floor (a perspective grid,
8.5 rem) under it, and the part in question on that floor (a card, a key figure, a menu, a dialog, a table, a progress bar, a day, a
legend key). In the review dialog it shows 1:1: `demo.css` forces `zoom: 1 !important` on `.rv-dialog__stage .sy-col` (beating the
kit's inline `fitShown()` zoom, as the anchor demo does) and hides the option's own text there (the dialog's bar says it), so the
stage holds the page piece at the stage's width (1014 x 242 px for the curve at 1600 x 1000) and nothing is magnified. Each scene is cropped to what its question needs.
On the page itself the options stand three to a line (about 415 px wide each, the header reading top to bottom below 36 rem).

**Already decided, not asked again.** Outrun Horizon (2026-09-08), the signature (2026-10-03), the size change and the leave
(2026-10-04), the reverse-close pairing, every component pick of the character round, Kenny's family picks of 2026-10-07 01:32
(the marquee chases, over the horizon, the laser flares, the marquee glows, the neon spotlight ring, chrome over the grid), the ten
questions approved at 20:41 (`GROUND` in `demo.js` writes their `data-sy-<question>` attributes on every scene; `options.css` keys
the parts at rest and the rise over the horizon on them), and now the anchor. **The network graph is in no scene**: it changes in no
theme (Kenny, 02:54); in synthwave it is a source of the grammar, never a target.

**What.** One page, synthwave only, in the review kit's aspect mode (`data-review-themes="synthwave"`). An intro, "What synthwave
is" (the drive into the sunset; on demand six decided character demos embedded as they are today), then eight questions with six
options each, loading and leave ten. The first option is always the recommendation; every option says what you see, why it is or is
not recommended, its honest overlap with another theme's CHARACTER.md, and what `research/_review/measure-motion.mjs` read.

| #   | Question (rule)                       | Options, recommended first                                                                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)                 | the tube leads, the bodies follow · the tube strikes, the bodies glide · four beats · the light passes, each body takes it · charge, then release · an even pace, a tape counter                                                                                                                                                                            |
| 2   | Opening what drops from a button (G3) | the beam climbs to the horizon · the blinds are drawn up into the horizon · it stands up on the floor · the horizon lets it down · over the horizon, its stripe striking on (round 1's 1) · neon strikes (round 1's 2)                                                                                                                                      |
| 3   | The corners (G6)                      | the light overshoots the corners · only the top and foot rules · the light runs down the sides and fades · the stripe floats above the plate · a corner pixel · square (the baseline)                                                                                                                                                                       |
| 4   | A warning (G13)                       | the VCR's symbols on a tube that turns · your neon ring on a tube that turns · the piece swells with the severity · three cells in the piece · the part between two tubes · the words cut by the sun's stripes                                                                                                                                              |
| 5   | Loading (G10)                         | the tube charges in five steps · the ramp flows through the tube · the road runs on the tube · the floor drives toward you · a slice of light runs the tube · headlights and tail lights · the sun's stripes light up from the horizon · the surface is the bar · the marquee on the tube in the ramp's colours · the rows of the floor light up toward you |
| 6   | Leaving and arriving (G12)            | the sun's slab · the sun's stripes close over it · the progress bar's ramp wipes it · the horizon's light pours over it · the floor takes it from its foot up · it is cut away by the sun's stripes · it recedes into the page horizon · it closes toward its centre · it sets in four beats · the light drains out of it                                   |
| 7   | The focus ring (G14, DI2)             | twin tubes · two tubes, top and foot · the horizon shouts, the ring whispers · the sun's ramp as the ring · the light spills down from the piece · the part stands on its own tube                                                                                                                                                                          |
| 8   | The press (G14)                       | the piece charges · the sun's ramp fills the piece · the light gathers under the part · a gleam crosses the part · the piece draws in to its core · the VCR acknowledges: ▶ lights on the piece                                                                                                                                                             |

**How each question departs from the page horizon.**

1. Curve: the page tube is the clock. A lit length with a glowing head charges along the header's foot while three bars (the same tube at component scale) fill and a tile rises; the options differ in who goes first (the tube leads a beat; the tube strikes; the light passes and each part takes it as it reaches it) and how the light and bodies travel (hard beats, a capacitor's charge then release, an even tape pace). Dropped: round 2's strike-then-burn-in (the quick-curve family), the three surges, the plain sunrise S and the tape transport as it was (blueprint's trapezoid).
2. Opening: every option lights the piece of tube under the Add and More buttons (the hand), and what opens comes from that line: a beam climbs the panel to the horizon and the piece turns up as it arrives, the blinds are drawn up toward the tube, the panel stands up on the floor, a beam lets the panel down from the piece. Kenny's two liked ones stay.
3. Corners: a corner is where the horizon's light (1 px on a part's top edge) ends or starts: overshooting the sides, only top and foot rules, running down the sides and fading, a stripe lifted off the slab, a pixel. Dropped: the sun-stripe slots (a grille) and the horizon slit (a rendering fault).
4. Warning: the piece of the tube over the warned part changes tone (laser yellow, red for a failure) exactly as wide as the part, and a second channel that is not colour carries the level: a symbol, the ring, the piece's thickness, three cells, a rail at the foot, cut letters. Dropped: the sun going down (the sun is the clock) and round 2's three-pip level before the title (it moved onto the piece).
5. Loading: when the page waits its tube is the unlit track of the bar and the picture lights it; every waiting part carries the same picture on its top edge. The floor options keep the tube lit and move the floor. Dropped: the scanner (back and forth, G10), the equaliser (a widget, not the horizon), the fill, ladder and bulbs of round 2 as drawn on parts alone.
6. Leave: the horizon takes a part and gives it back, the piece of tube over the part answering while it goes (a pulse). Round 1's swallow, a growing disc, is not shown again (its close cannot be played backwards exactly, see below); the ten are the sun's slab and bands in its real colours, the ramp, the dye, the floor, the stripes alone, the recession into the page tube, the closing to the centre, four hard beats and the drain of light. None draws a growing circle.
7. Focus: the piece of the page tube lights over the focused part, as under the pointer; the ring round it keeps DI2's two channels in every option.
8. Press: the piece lit over a hovered part is what the press acts on (charges, fills with the ramp, dims while light pools under the part, a gleam crosses, draws in, shows ▶).

What was wrong with the swallow, found in the CSS: the disc was cyan, pink and violet (the sun is laser yellow to pink), its stripes
all one width (the sun's widen toward the horizon), the part faded under it, it ended as a whole striped rectangle that vanished in one
frame, and a circle growing from the foot is solstice's moon and dome. The new leaves keep "the sun takes it" in the sun's real colours
and stripes, end clean and are authored as arrivals (the leave is the arrival played backwards by the page's script).

**How.**

- `demo.js` holds the eight questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and the
  verdict), builds the rows (`data-sy-aspect`, option cells `data-sy-option`) and writes `data-review-choices` from the same data,
  so the page and the dialog cannot disagree. A scene is `page(actions, body)`: the header, the page tube (`.sy-hz`, a line of no
  height with its floor, ghost, far line, tube, head and an `fx` layer) and the body of cells (`.sy-part`).
- A part the horizon can light is wrapped in `.sy-host`, whose last child `.sy-seg` is the piece of the tube: as wide as the part,
  at the tube's height. The one layout read of the file, `placePieces`, writes the distance to the tube as `--sy-to` on each host
  (when a page's size changes or it first shows, never per frame). The clock never reads layout.
- `options.css` (layer `kp.signature`; tokens on `:is(.sy-page, .rv-dialog__stage)`) draws every option, scoped by `data-sy-<question>="<key>"`
  on the scene. Colours are tokens only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the
  finished part. Parts at rest are the recommended grammar (chrome over the floor, the stripe, square panels and 2 px controls, the
  OSD and the chrome display, the marquee). The page glue (grid, header, the dialog's 1:1) is in `demo.css`, unlayered, because the
  package's layout layer comes after the signature layer.
- The rise over the horizon (ground): each part that opens, arrives or leaves sits in `.sy-rise` with the part, the sun's stripes
  (`.sy-cuts`) and its horizon line (`.sy-horizon`, the 1 px-of-light every part carries when it rises); bodies move on the sunrise
  curve `cubic-bezier(0.65, 0, 0.35, 1)`; light switches in hard steps.
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-sy-phase`: gap, in, hold, out), so
  the options of a row start together. Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's Pause
  (Space) stops it. The loading pictures loop in CSS.
- Every close is its open played backwards (Kenny's standing rule): at `out`, `closeByReverse` plays every arrival of a cell backwards
  over the cell's whole arrival. Round 3 fixed one thing in it: what waited at the start of an arrival (a delay) now waits at the end
  of its close (`endDelay`), so a part that arrived late closes as long as the arrival, which the measuring tool had flagged.
- Focus is shown standing still on marked parts (`.sy-focused`, the ring drawn in `.sy-fring`) and the press by the clock
  (`.sy-press`, drawn in `.sy-fx` and on the piece): pressed for a beat at `in`, released at `hold` as the press played backwards.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Each option's verdict names the theme it meets. The
anchor itself overlaps solstice's horizon divider and light (its foot is lit under the pointer) and titanium's tool-edge (a lit line
along the top of a surface); here it is one tube for the page with a floor, and the hand lights a piece of it as wide as the part.
New overlaps named on the page: the tube-leads curve (none), hard beats (terminal, cyberpunk, nostromo), an even pace (grotesk,
titanium, blueprint), the lowering beam (titanium's top-down cut, forest's menu), the swelling piece (grotesk's 6 px bar), pips
(nostromo's lamp bank), rails (nostromo's frame), the drain (the ground's sunset with a filter).

**Measured** (Firefox, 1600 px, `node research/_review/measure-motion.mjs research/synthwave-character --base http://127.0.0.1:8750`,
mirror everywhere, no FRONT except the hard steps: 15 s for the whole demo, 56 options): every part that arrives closes as its
arrival reversed ("mirror", 138 parts) except two parts of curve option 5, "charge, then release" (the head's opacity 9 % and the
tile's horizon 11 % off at the first 40 to 60 ms of the close, over the tool's 8 % tolerance; the ease-in tube curve is not
symmetrical). FRONT appears only where a hard step is the idea (the tube strike, the stripe strikes, the piece's strike and the
press). In the dialog (clicking `[data-rv-open]`, flipping with the arrow keys) the tokens are defined in `.rv-dialog__stage`, the
column's zoom is 1 and the animations run on every cycle and loop option; no option overflows sideways. See the verification list
under "What could not be made true" for the sizes.

**What could not be made true.**

- Round 1's swallow is not shown as it was: a growing disc's `clip-path: circle()` area changes too steeply for the measuring tool's
  one-frame tolerance, so no authoring of it measured as an exact mirror (82 to 98 % off at the steepest frames, though the radius
  values are exact mirrors at 75 ms steps). The tenth leave option is therefore the drain instead.
- The press options act on the piece of the page tube, which stands up to 8 rem above a part low on the page (a legend key, a day):
  the part's own top edge carries the other half of the press so the two read together, but the distance is real.
- The pieces over parts in the header stand on the tube; over parts in the body they sit above them across the gap (1.25 rem): the
  anchor's rule (a piece exactly as wide as the part) holds, the tube is not at the part's own edge, by design.
- At 390 px the header reads top to bottom and the two-column bodies stack; the tube is the page's width, so on a phone the
  curve's and the loading's lit length is short in pixels but the same in proportion.
- Contrast: all text reads at AA or better; the faint floor grid, ghost lines and loader tracks are not text and fall below AA by design.
