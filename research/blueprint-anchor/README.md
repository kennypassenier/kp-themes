# What anchors blueprint

**Decided (Kenny, 07/10/2026 20:44): not approved, "I kind of like the measuring part of option 1, but not the implementation itself, like I don't like the form. And I LOVE the plotter pen, so that should be a thing for sure. Come up with some more examples based on this feedback".** Round two, built on the plotter pen with the measuring kept and the dimension line's form dropped, is [research/blueprint-anchor-2](../blueprint-anchor-2/README.md).

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

## How

- One timeline for all six, T = 2880 ms (18 units of 160 ms): 0 to 16.7 % the instrument is drawn, 16.7 to 77.8 % it works (the
  loading picture), 77.8 to 100 % it completes. The feed is G1's trapezoid (`--ba-feed`); the ruler counts with `steps(41, jump-none)`.
- `demo.js` holds the options as data (`OPTIONS`) and builds the row, the line-up and the dialog's `data-review-choices` from it.
- `options.css` (all in `@layer kp.signature`) hangs every rule and custom property on `.ba-scene`, never on the page, since the
  review dialog moves the section into its own stage. Base style is the finished pose, so reduced motion shows the finished picture;
  every animation sits under `prefers-reduced-motion: no-preference`.
- `hold` and `gap` carry no animation (gap's first frames are written out), so each `in` and `out` starts a fresh CSS animation.
- Clips use `view-box`, so the dimension line's head sits exactly on its fill's end.
- Tokens only; no external assets.

## Measured (Firefox, `research/_review/measure-motion.mjs`, full speed)

Every part's leave is its arrival mirrored (tool: "mirror"), and a per-frame check of all parts in all six (145 frames of 20 ms, six
properties) found 0 mismatches between the arrival at t and the leave at 2880 - t.
