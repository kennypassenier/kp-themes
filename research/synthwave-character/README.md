# What makes synthwave synthwave

**Decided (Kenny, 07/10/2026 23:54): all eighteen questions settled over five updates, anchored on the page horizon** (research/synthwave-character/decided.json; applied in css/synthwave-register.css; see themes/synthwave/CHARACTER.md §0). Round 1 (20:41) approved ten as recommended; the later updates settled the curve (the tube leads), opening (the beam climbs), warning (the VCR's symbols), focus (two tubes), press (the piece charges), corners (pink down the left, cyan down the right, fading), leave (the sun takes it down with it) and loading (the oncoming tube and floor, the bars as they were).

**Round 5 / Update 3 (Kenny, 2026-10-07 23:32, on update 2).** Two questions are picked and locked: corners = `fall` (the light runs down the sides from the stripe's colours, pink at the left and cyan at the right, and fades) and leave = `setssink` (the sun sets through it, the part sinking with it); all seventeen picks are written as `data-sy-<id>` on every scene, their CSS stays in `options.css`, scoped to the parts they paint (a plate's sides, a leaving part), so they move nothing on the loading page. Loading comes back once more, his words: "I want a option 2, but with the progress bars of option 5". The demo asks only that, in six options that are all option 2's motion (the page tube with the ramp flowing through it, 1800 ms; the floor driving toward you, 900 ms) on the three bars of option 5 (Sync 72 %, Backup 48 %, Upload 88 %, mono captions, the package's `.kp-progressbar`, 4500 ms): `combo` (recommended, the bars as they were), `headramp` (the ramp flows through each bar's head as a 7 rem tail), `barfloor` (a floor of its own under each bar), `locked` (one beat clock, 3600 ms, the heads stepping one notch per beat), `busy3` (the three bars busy, the package's road at 600 ms) and `mixed` (the ramp in the heads alternating, bar 2 against bars 1 and 3). Tokens `--lx-*` on `:is(.sy-page, .rv-dialog__stage)`; scene class `.sy-pg--lx`. Measured (Firefox, `getComputedStyle` of the running `sy-flow` at three times): the old text of option 2 had the direction backwards. `sy-flow` reversed carries the ramp from the tube's left end to its right (the old text said right to left); the CSS is unchanged, so it is what Kenny saw, and the texts now say what is seen.

**Round 4 / Update 2 (Kenny, 2026-10-07 23:00, on update 1).** Five questions are picked and locked: curve = the tube leads, the bodies follow (`lead`), opening = the beam climbs to the horizon (`climb`), tone of a warning = the VCR's symbols, on a tube that turns (`osd`), focus = two tubes, top and foot (`rails`) and press = the piece charges (`charge`). They are in `GROUND` in `demo.js` (so `data-sy-<id>` is on every scene and their CSS stays in `options.css`; the curve's rules are scoped to the scene that holds `.sy-pg--curve`, because they animate the tube and the rise of any scene they sit on) and in `update.json`'s `picks`; the dialog asks only three questions. **Corners** (6 options): variations on "the light runs down the sides and fades", with Kenny's rule that each side starts in the colour of the top stripe it touches (`--kp-stripe`: `--primary` pink at the left end, `--accent` cyan at the right): fade out, on through the ramp, a short fixed drop, a hairline, sides that sink into the floor, and the old option 3 last. **Loading** (10): four mixes of "the ramp flows" and "the floor drives" (together, against, floor first, the floor wearing the ramp), then the progress bars: the three bars of the curve question as measured (Sync 72, Backup 48, Upload 88, caption and all, the tube leading), the package's busy bar unchanged, and four derived bars (three weights, slats that count the beats, the bar as the page tube, a head that leaves the road). Loops are not measured: the periods are in each option's text; a determinate bar fills, holds and empties backwards, never jumps back. **Leave** (8): "the sun sets through it" and "the sun's slab", each with three variations (`setsrim`, `setswiden`, `setssink`; `slabrim`, `slabhold`, `slabcut`), authored like the existing ones. The round marker is `2026-10-07-r4`.

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
| 6   | Leaving and arriving (G12)            | the sun sets through it · the sun rises behind it and cuts it into scanlines · the sun steps down through it on the beat · the sun's stripes take it band by band · the sunset pours over it · the sun's slab · the progress bar's ramp wipes it · the floor takes it from its foot up · it recedes into the page horizon · the light drains out of it      |
| 7   | The focus ring (G14, DI2)             | twin tubes · two tubes, top and foot · the horizon shouts, the ring whispers · the sun's ramp as the ring · the light spills down from the piece · the part stands on its own tube                                                                                                                                                                          |
| 8   | The press (G14)                       | the piece charges · the sun's ramp fills the piece · the light gathers under the part · a gleam crosses the part · the piece draws in to its core · the VCR acknowledges: ▶ lights on the piece                                                                                                                                                             |

**How each question departs from the page horizon.**

1. Curve: the page tube is the clock. A lit length with a glowing head charges along the header's foot while three bars (the same tube at component scale) fill and a tile rises; the options differ in who goes first (the tube leads a beat; the tube strikes; the light passes and each part takes it as it reaches it) and how the light and bodies travel (hard beats, a capacitor's charge then release, an even tape pace). Dropped: round 2's strike-then-burn-in (the quick-curve family), the three surges, the plain sunrise S and the tape transport as it was (blueprint's trapezoid).
2. Opening: every option lights the piece of tube under the Add and More buttons (the hand), and what opens comes from that line: a beam climbs the panel to the horizon and the piece turns up as it arrives, the blinds are drawn up toward the tube, the panel stands up on the floor, a beam lets the panel down from the piece. Kenny's two liked ones stay.
3. Corners: a corner is where the horizon's light (1 px on a part's top edge) ends or starts: overshooting the sides, only top and foot rules, running down the sides and fading, a stripe lifted off the slab, a pixel. Dropped: the sun-stripe slots (a grille) and the horizon slit (a rendering fault).
4. Warning: the piece of the tube over the warned part changes tone (laser yellow, red for a failure) exactly as wide as the part, and a second channel that is not colour carries the level: a symbol, the ring, the piece's thickness, three cells, a rail at the foot, cut letters. Dropped: the sun going down (the sun is the clock) and round 2's three-pip level before the title (it moved onto the piece).
5. Loading: when the page waits its tube is the unlit track of the bar and the picture lights it; every waiting part carries the same picture on its top edge. The floor options keep the tube lit and move the floor. Dropped: the scanner (back and forth, G10), the equaliser (a widget, not the horizon), the fill, ladder and bulbs of round 2 as drawn on parts alone.
6. Leave (update 1, after Kenny's round-1 words "I like the sun swallows it, but it doesn't feel quite right yet"): the sun swallows it is back, five times, as the synthwave sun and not an eclipse. The striped sun (laser yellow to pink, stripes widening toward the foot, horizontal cuts only) goes down behind the part's foot, the page's floor line, on the sunrise curve or on the beat: it sets through the part (a slab from the top edge to the foot, the part gone above its lower edge); it rises behind the part while four slits cut the part into scanlines and sets; it steps down through the part in four hard beats (225, 450, 675, 900 ms); five bands take the part from its top edge down and drain toward the foot; the sunset dyes it and it sets. The other five are round 3's best that are not the sun's shape: the slab, the bar's ramp, the floor, the recession into the page horizon and the draining light. The piece of tube over the part answers while it goes (a pulse). None draws a growing circle.
7. Focus: the piece of the page tube lights over the focused part, as under the pointer; the ring round it keeps DI2's two channels in every option.
8. Press: the piece lit over a hovered part is what the press acts on (charges, fills with the ramp, dims while light pools under the part, a gleam crosses, draws in, shows ▶).

What was wrong with round 1's swallow, found in the CSS: the disc was cyan, pink and violet (the sun is laser yellow to pink), its stripes
all one width (the sun's widen toward the horizon), the part faded under it, it ended as a whole striped rectangle that vanished in one
frame, and a circle growing from the foot is solstice's moon and dome (solstice's G12 is an eclipse, a charcoal moon crossing start to end with an amber corona). The swallows now keep "the sun takes it" in the sun's real colours and stripes, go down instead of across, end clean, and are authored as the leave itself: their keyframes read forward as what you see leaving, the arrival plays them `reverse` (the page's script then plays the arrival backwards for the close, so the close is the leave again). Only transforms, `clip-path: inset()` and `mask-size` move (no circle), so the tool can compare every frame.

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

**Measured** (Firefox, 1600 px, `node research/_review/measure-motion.mjs research/synthwave-character --base http://127.0.0.1:8754 --aspect leave`, update 2): all eight leave options measure "mirror" on every part (the part, the sun or slab, the stripes, the line, the 1 px horizon, the piece of the page tube), with no FRONT, BLINK, CUT-IN or CUT-OUT and no part off the 8 % tolerance (the whole demo run without `--aspect` gives the same: the leave is its only cycle scene now). Times on the close (900 ms): sets (sun t50 450 / t90 740, part t50 230 / t90 320), setsrim (the same, the rim is part of the slab), setswiden (the stripes t50 460 / t90 650), setssink (part t50 240 / t90 650 over 60 to 900), slab (slab t50 350 / t90 720, part off at 410), slabrim (the line t50 210 / t90 290 over 50 to 410), slabhold (slab t50 200 / t90 740, stripes t50 340 / t90 430, part off at 230), slabcut (wipe t50 180 / t90 260, five stripes 360 ms each 45 ms apart, part off at 360). Loading loops: mixes 1800 / 900 ms (floor first 3600 / 450 ms), bars 4500 ms, beats 5400 ms, busy 600 ms. In the dialog (clicking `[data-rv-open]`, flipping with the arrow keys) the tokens are defined in `.rv-dialog__stage`, the column's zoom is 1, the animations run on every option and the dialog asks exactly three questions.

**What could not be made true.**

- Update 2: Kenny's "progress bar from the screenshot" cannot be seen from here; option 5 (the curve question's bars) and option 6 (the package's busy bar) are the two bars that exist in the demo. The three bars of option 5 differ only in their value, so they are one option, not three. A determinate bar "loading" is a demonstration: it fills and empties on a loop.

- The swallow is not round 1's disc: it is the sun's stripes going down behind the part's foot, because a growing circle cannot be measured
  as an exact reverse and reads as solstice's moon. The scene's parts are 2 to 6 rem tall, so the sun is a rectangle of stripes (a sun
  with its round edge would need a part as tall as it is wide); the beats option's steps and the scanlines on the 2 rem alert are a few
  pixels.
- The press options act on the piece of the page tube, which stands up to 8 rem above a part low on the page (a legend key, a day):
  the part's own top edge carries the other half of the press so the two read together, but the distance is real.
- The pieces over parts in the header stand on the tube; over parts in the body they sit above them across the gap (1.25 rem): the
  anchor's rule (a piece exactly as wide as the part) holds, the tube is not at the part's own edge, by design.
- At 390 px the header reads top to bottom and the two-column bodies stack; the tube is the page's width, so on a phone the
  curve's and the loading's lit length is short in pixels but the same in proportion.
- Contrast: all text reads at AA or better; the faint floor grid, ghost lines and loader tracks are not text and fall below AA by design.
