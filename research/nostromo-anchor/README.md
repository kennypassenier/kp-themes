# Nostromo's anchor element

**Decided (Kenny, 07/10/2026 20:10): The raster** ("nostromo-anchor · nostromo: Nostromo’s anchor element = The raster"), option 6, not the recommended LED lamp bank. Recorded in themes/nostromo/CHARACTER.md §0 and decided.json.

**Why.** Kenny, 2026-10-07: "bij nostromo wil ik meer opties waaruit ik kan kiezen, maar er een demo voor." Forest's anchor is the tree
progress bar, titanium's its loading animation, cyberpunk's the glitch: the one recognisable element every decision about the theme is
made from. Colours are the shared base and are not asked here.

**What.** One page in the review kit's aspect mode (`data-review="nostromo-anchor"`, `data-review-themes="nostromo"`), one question
("Which element is nostromo's anchor?") and six options, the recommendation first. Each option is a live scene: the element alone on
its stage, playing by itself (gap, in, hold, out), and four real package parts (a switch thrown, a menu arriving, a figure changing,
something waiting) drawn by that one rule. In the dialog the anchor stands beside its parts (`--rv-flip-max: 100%`, a container query).

| #   | Anchor                            | The rule it gives every part                              |
| --- | --------------------------------- | --------------------------------------------------------- |
| 1   | The LED lamp bank (recommended)   | a lamp switches on or off in one frame                    |
| 2   | The label-tape embosser           | tape is printed a letter a frame and cut with a notch     |
| 3   | The vent grille                   | a louvre opens in steps with the glow behind              |
| 4   | The key that pushes into its well | a switch is thrown: in, lamp on, released                 |
| 5   | The bridge klaxon                 | the frame flashes amber and red, the beacon turns         |
| 6   | The raster                        | drawn row by row from the top, a beam and a phosphor tail |

**How.** `demo.js` holds the options as data and writes `data-review-choices` from the same data. `options.css` (layer
`kp.signature`) draws everything from theme tokens; all motion is under `prefers-reduced-motion: no-preference` and the reduced pose is
the finished picture. Durations are counts of 80 ms frames (`--na-fr`, stretched by `--na-slow`); steps use `steps(n, end)` so a
close, which is the arrival played backwards by script (`closeByReverse`, as in nostromo-character), is its exact mirror. Loops are
infinite, run at `hold`, and are never part of an arrival. Shared custom properties are declared on `:is(.na-page, .rv-dialog__stage)`.
The network graph is in no scene.

**Measured** (`node research/_review/measure-motion.mjs research/nostromo-anchor`): every arrival's close is its mirror, except two
parts (key cap, tapped figure) flagged only for a 1/255 rounding of a constant shadow colour.
