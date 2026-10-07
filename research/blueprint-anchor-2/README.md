# What anchors blueprint, round two

Kenny, 2026-10-07 20:44, on round one: "I kind of like the measuring part of option 1 [the dimension line], but not the implementation itself, like I don't like the form. And I LOVE the plotter pen, so that should be a thing for sure. Come up with some more examples based on this feedback."

## Why

The plotter pen is now the base of the theme, and the idea of measuring survives ("a dark blue theme that measures"), but not the dimension line's bar form (arrowheads, hatched fill, chain line): that form is not offered again. So every option below is led by the same visible pen (round one's gantry rail and carriage, drawn identically) and differs in KIND by what the pen does and how it measures. Colours are settled: cyan pen, amber annotation, Prussian ground. One page, blueprint only, one aspect ("The anchor"), six options, the recommendation first, a line-up of all six on one clock at the top.

## What

| #   | Option                      | What the pen does                                                                                     | Verdict                                                             |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | The pen that dimensions     | draws extension lines, a dimension line with slash ticks, writes the value in single-stroke lettering | Recommended: the loved pen with the theme's own job, no bar form    |
| 2   | The plotter pen             | plots a series, rings the last point, amber leader (round one's option 2, frame for frame)            | The one you loved, unchanged: the reference                         |
| 3   | The pen on the straightedge | rules along a sliding parallel-motion straightedge, a margin readout counts the distance              | Clearest progress; but a sweep along an edge is titanium's/formal's |
| 4   | The dividers                | dividers step off equal spans, the pen inks a tick at each point, a count rises                       | Plainest count; two instruments, reads as a counter                 |
| 5   | The hatching pen            | hatches a circle in 45 degree strokes, no wash                                                        | Best waiting picture; a texture, not a way to arrive                |
| 6   | The tracing pen             | traces a curve across a graticule, amber witness lines and pointers read both axes                    | Best chart/data picture; needs data to trace                        |

Each stage plays by itself on one clock: the anchor as the loading picture, its arrival complete, then the leave, which is the same keyframes played backwards (`animation-direction: reverse`).

## How

- `build.mjs` writes `art.js` (the six drawings) and `options.css` (their poses and motion) from one description of each pen route: a gantry rail that follows the pen's height, a carriage that follows its position, a nib that is down or up (hollow when lifted), and ink that is exactly where the pen has been. Run `node research/blueprint-anchor-2/build.mjs` after changing a route. Option 2 is written percent for percent from round one's keyframes.
- One timeline for all six, T = 2880 ms (18 units of 160 ms). The feed is G1's trapezoid (`--ba2-feed`) at every vertex; the tracing pen is sampled so its one stroke has a single ramp up and down; steps are used nowhere.
- Every part's base style is its finished pose (so reduced motion shows the finished picture) and its first keyframe is written out for `gap`; `hold` and `gap` carry no animation, so each `in` and `out` starts a fresh CSS animation.
- Every rule and custom property hangs on `.ba2-scene`, never on the page, because the review dialog moves the section into `.rv-dialog__stage`. All in `@layer kp.signature`; tokens only; no external assets.
- `demo.js` holds the options as data and builds the row, the line-up and the dialog's `data-review-choices` from it.

## Measured

Firefox, `research/_review/measure-motion.mjs` run from a copy whose scene-class pattern accepts a digit (the shipped one matches `[a-z]+-scene`, so `ba2-scene` is not found; the copy changes only that pattern), full speed. Per-frame reversal: all parts of all six, 145 frames of 20 ms, `opacity`, `clip-path`, `translate`, `rotate`, `scale`, `stroke-dashoffset`, `fill-opacity`: 0 mismatches between the arrival at t and the leave at 2880 - t; the gap pose equals the first frame and the hold pose the last frame in every option. Option 2 compared with round one's plotter (7 parts, 290 frames, in and out): 0 differences.

Pen strokes arrive one after the other (t90 of the strokes from 280 to 2400 ms in), the carriage and rail run the whole route, so their t50/t90 sit late (they are multi-vertex paths ending in a park). The rail and carriage of the dimension, dividers and hatching show `FRONT` on the leave only because the long last hop to the park is most of their travel; it is the arrival's own last move played first.
