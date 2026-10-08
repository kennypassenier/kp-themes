# What makes deco deco

**Open (2026-10-08).** Nineteen questions wait for Kenny's verdicts in the review dialog (`data-review="deco-character"`, round
`2026-10-08-r1`).

**Why.** Kenny, 2026-10-08, on research/deco-anchor: the anchor is **the fan opens** (a crest of gold rays folded to a point opens ray
by ray from one side to the other and folds back), and "I'm really not a fan of the progress bar btw, that needs to be redone for
sure". Deco's grammar is asked question by question, as the other themes' were
(Kenny, 2026-10-07 02:54: "waar jij eerst uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet"). The analysis is
[themes/deco/CHARACTER.md](../../themes/deco/CHARACTER.md): every decided deco pick measured, the grammar G1-G21, the outliers and the
questions. This page turns the proposals into the questions Kenny answers to fix deco's grammar.

**Already decided, not asked again.** The anchor (the fan opens), that the progress bar is redone (question 11 asks with what), and
that the network graph changes in no theme (G21; it is in no scene). The questions ask how the anchor lands on every other component;
where a decided pick of an earlier round is at odds with the rule, it is on the page as an option named "the pick", and where the
register does something today the option says "today".

**What.** One page, deco only, in the review kit's aspect mode (`data-review-themes="deco"`). An intro, "What deco is" (the story from
`aspects.js`, the package's own parts in deco including the busy and the share bar, and on demand six decided character demos embedded
as they are today), then nineteen questions. Each question is one rule of the grammar and three options (four in question 10, five
in question 11), each a live scene built from the package's components in deco (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`,
`.kp-toast`, `.kp-tooltip`, `.kp-card`, `.kp-kpi`, `.kp-meter`, `.kp-progressbar`, `.kp-spinner`, `.kp-badge`, `.kp-tag`, `.kp-alert`,
`.kp-skeleton`, `.kp-switch`, `.kp-empty`, `.kp-page-header`). The first option is always the recommendation; every option says what
you see and why it is or is not recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                       | Options, recommended first                                                                                     |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)                 | ray by ray, counted · one smooth sweep · the register's curve (today)                                          |
| 2   | The direction (G2)                    | from a point outward, groups from the centre · rising from the foot (the picks) · start → end                  |
| 3   | Opening what drops from a button (G3) | fans open from its anchor · the curtain rises (the picks) · as today                                           |
| 4   | How long things take (G4)             | 160 · 480 (+160, +80) · 2400 ms · brisk 120 · 320 · 1600 · grand 200 · 720 · 3600                              |
| 5   | Where the colour goes (G5)            | gold acts flat, emerald marks, ruby warns · gold with a glint (the picks) · gold and ivory only                |
| 6   | The corners (G6)                      | cut corners, lozenge ends · stepped ziggurat corners · all square                                              |
| 7   | The surface (G7)                      | lacquer, the double rule, one crest · a sunburst behind every figure · setbacks behind every plate (the picks) |
| 8   | A warning (G8)                        | the gilt notice · a tinted sunburst (the state's pick) · framed all round in gold                              |
| 9   | A live update (G9)                    | one flash of the fan · gilded: a flare (the picks) · the glint (the picks)                                     |
| 10  | Loading (G10)                         | a fan opens and folds · the glint runs · the bulbs chase (the picks) · the skeleton's strips (today)           |
| 11  | The progress bar, redone (G11)        | a fan laid flat · a flat band with a chevron tip · the lift's lamps · stepped tiers · the pennant (today)      |
| 12  | The spinner (G12)                     | a fan opens and folds · the sunburst rotates (today) · the lift's lamps round                                  |
| 13  | Leaving and arriving (G13)            | fans open from its base, folds to it · folds flat (today) · the curtain (the picks)                            |
| 14  | Buttons inside composites (G14)       | exactly deco's own · deco's own on a gilt plaque · as today                                                    |
| 15  | Pointing at something (G15)           | the fan opens behind the label · the gilded edge (the picks) · the bulbs light (the picks)                     |
| 16  | The focus ring (G16)                  | the two-channel ring · a double gold ring · as today                                                           |
| 17  | The press (G17)                       | the fan opens fully · the fan folds shut · a colour step (today)                                               |
| 18  | The voice (G18)                       | Poiret capitals, Josefin figures · Poiret figures too · Josefin everywhere                                     |
| 19  | Motifs (G19)                          | the fan, the double rule, the lozenge, the chevron · plus the bulbs and the setbacks (the picks) · as today    |

**How.**

- `aspects.js` is the designer's data (the nineteen questions with their texts, used verbatim, and the story). `demo.js` imports it,
  gives each question its scene (the package's own parts, with the `PART` helpers), builds the rows (`data-dc-aspect`, option cells
  `data-dc-option`) and writes `data-review-choices` from the same data, so the page and the dialog cannot disagree.
- `grammar.css` is deco's grammar as tokens (`.dc-page, .dc-scene`), registered properties (`--dc-a` the angle a fan has opened to,
  `--dc-fill` how far its plate has followed, `--dc-p` a count) and the recommended keyframes (`dcg-*`, each a pair `name` /
  `name-out`). `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-dc-<question>="<key>"` on the scene.
  Colours are tokens only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the fan open.
- The fan: a part that opens stands in `.dc-fx`, the wrapper the clock's animation runs on. It carries the angle (twelve rays, one
  15deg cell each, 4deg of gold in the middle of the cell, one ray per step: `steps(12, jump-end)` open, `steps(12, jump-start)` shut,
  40 ms a ray); the part inside is masked into blades (a conic mask), the gold rays are the wrapper's `::before`, and the plate
  follows in four steps (`--dc-fill`, 160 ms) while the rays thin to nothing. The dialog's crest is its own element that opens first
  and the panel follows in four pleats; a plate with no crest is counted in vertical pleats from its centre (question 13).
- One clock in `demo.js` plays every scene that opens, arrives, updates or leaves (`data-dc-phase`: gap, in, hold, out), so the
  options of a row start together. Every close is its open reversed: each keyframe pair is written `name` / `name-out` with the timing
  function literally inside the @keyframes, an eased open closing on the inverse curve and `steps(n, jump-end)` on
  `steps(n, jump-start)`, and `out` starts as late as the opening ended (`--dc-T` minus the part's delay and length), so what opened
  last folds first. Replay restarts the clock; the speed buttons stretch every duration by 2 or 4; the dialog's Pause (Space) stops it.
  Loops (loading, the bar, the spinner) run in CSS.
- Hover, focus and press are shown standing still on marked parts (`.dc-pointed`, `.dc-focused`, `.dc-press` beside `.dc-rest`); the
  State buttons force a state on every button, entry, link and day of questions 14 to 17 (`data-dc-show` on the scene, so it moves with
  the scene into the dialog's stage), and the dialog presses Hover for question 14 by itself.
- The gallery of decided components loads the six character demos through the review kit's embed mode (`?embed=…&theme=deco`) only
  when it is opened.

**Measured.** Pending: the mirror of every cycle scene (each close its open reversed, per frame) and the frames of every row at 1280
and 390 px were checked in Chromium on 2026-10-08, before Kenny's first look; nothing is measured in Firefox yet (the tests run only
after a release go).
