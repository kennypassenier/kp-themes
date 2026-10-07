# What anchors blueprint

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

- `build.mjs` writes `art.js` (the six drawings) and `options.css` (their poses and motion) from one description of each pen route: a gantry rail that follows the pen's height, a carriage that follows its position, a nib that is down or up (hollow when lifted), and ink that is exactly where the pen has been. Run `node research/blueprint-anchor/build.mjs` after changing a route. Option 2 is written percent for percent from round one's keyframes.
- One timeline for all six, T = 2880 ms (18 units of 160 ms). The feed is G1's trapezoid (`--ba2-feed`) at every vertex; the tracing pen is sampled so its one stroke has a single ramp up and down; steps are used nowhere.
- Every part's base style is its finished pose (so reduced motion shows the finished picture) and its first keyframe is written out for `gap`; `hold` and `gap` carry no animation, so each `in` and `out` starts a fresh CSS animation.
- Every rule and custom property hangs on `.ba2-scene`, never on the page, because the review dialog moves the section into `.rv-dialog__stage`. All in `@layer kp.signature`; tokens only; no external assets.
- `demo.js` holds the options as data and builds the row, the line-up and the dialog's `data-review-choices` from it.

## Measured

Firefox, `research/_review/measure-motion.mjs` run from a copy whose scene-class pattern accepts a digit (the shipped one matches `[a-z]+-scene`, so `ba2-scene` is not found; the copy changes only that pattern), full speed. Per-frame reversal: all parts of all six, 145 frames of 20 ms, `opacity`, `clip-path`, `translate`, `rotate`, `scale`, `stroke-dashoffset`, `fill-opacity`: 0 mismatches between the arrival at t and the leave at 2880 - t; the gap pose equals the first frame and the hold pose the last frame in every option. Option 2 compared with round one's plotter (7 parts, 290 frames, in and out): 0 differences.

Pen strokes arrive one after the other (t90 of the strokes from 280 to 2400 ms in), the carriage and rail run the whole route, so their t50/t90 sit late (they are multi-vertex paths ending in a park). The rail and carriage of the dimension, dividers and hatching show `FRONT` on the leave only because the long last hop to the park is most of their travel; it is the arrival's own last move played first.

## Round one (history)

**Decided (Kenny, 07/10/2026 20:44): not approved, "I kind of like the measuring part of option 1, but not the implementation itself, like I don't like the form. And I LOVE the plotter pen, so that should be a thing for sure. Come up with some more examples based on this feedback".** Round two, built on the plotter pen with the measuring kept and the dimension line's form dropped, is [research/blueprint-anchor-2](#what-anchors-blueprint).

Kenny, 2026-10-07 15:55 and 16:13: forest's tree progress bar and titanium's new loading animation were the one element he
could take every other decision of the theme from; he asked what each theme's anchor element will be, and for a blueprint demo
with options. Colours are settled everywhere and are the base (cyan pen, amber annotation, Prussian ground).

One page, blueprint only, one aspect ("The anchor"), six options that differ in kind, the recommendation first. Each option is one
inline SVG on its own stage, playing by itself on one clock: the anchor as the loading picture, its arrival complete, then the
leave, which is the same keyframes played backwards (`animation-direction: reverse`). A line-up of all six runs at the top.

| #   | Option                 | What a drawing office has                       | Verdict                                  |
| --- | ---------------------- | ----------------------------------------------- | ---------------------------------------- |
| 1   | The dimension line     | a measured length, hatched fill, chain line     | Recommended                              |
| 2   | The plotter pen        | a gantry and pen plotting a series              | Second: decides arrival, not the theme   |
| 3   | The cyanotype exposure | a sheet exposing pale to blue, then developing  | Tone change; breaks "no wash, no fill"   |
| 4   | The revision cloud     | a scalloped cloud, a revision triangle + letter | Annotation, not a base (live update)     |
| 5   | The compass            | a pencil leg swinging a circle round a centre   | Already the spinner; only draws circles  |
| 6   | The scale ruler        | ticks counting up under a sliding cursor        | Counts well; reads as terminal's counter |

**Why the dimension line stays the recommendation** (after drawing all six): it is Kenny's own sentence for the theme ("a dark blue
theme that measures"); the progress bar, meter, witness lines, press, skeleton hatch and the hatched leave are all already parts of
it. The plotter pen carries arrival and opening best (G2, G3) and is the strongest runner-up, but it needs a visible pen and does not
say anything about measuring or hatching.

### How

- One timeline for all six, T = 2880 ms (18 units of 160 ms): 0 to 16.7 % the instrument is drawn, 16.7 to 77.8 % it works (the
  loading picture), 77.8 to 100 % it completes. The feed is G1's trapezoid (`--ba-feed`); the ruler counts with `steps(41, jump-none)`.
- `demo.js` holds the options as data (`OPTIONS`) and builds the row, the line-up and the dialog's `data-review-choices` from it.
- `options.css` (all in `@layer kp.signature`) hangs every rule and custom property on `.ba-scene`, never on the page, since the
  review dialog moves the section into its own stage. Base style is the finished pose, so reduced motion shows the finished picture;
  every animation sits under `prefers-reduced-motion: no-preference`.
- `hold` and `gap` carry no animation (gap's first frames are written out), so each `in` and `out` starts a fresh CSS animation.
- Clips use `view-box`, so the dimension line's head sits exactly on its fill's end.
- Tokens only; no external assets.

### Measured (Firefox, `research/_review/measure-motion.mjs`, full speed)

Every part's leave is its arrival mirrored (tool: "mirror"), and a per-frame check of all parts in all six (145 frames of 20 ms, six
properties) found 0 mismatches between the arrival at t and the leave at 2880 - t.
