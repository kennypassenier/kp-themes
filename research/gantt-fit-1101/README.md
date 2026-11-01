# research/gantt-fit-1101: the run timeline fits its width

Kenny chose on 2026-11-01 ("Passend maken") to make Kitchen's read-only cook timeline fit a phone instead of scrolling sideways. Under
32rem the run timeline keeps `--kp-gantt-min-width` and scrolls inside its frame (the default since wish-1028); on Kitchen's cook page at
390 px that hid the later bars and their labels past the frame's edge and kept a spare row under a lane with a running step. Built as the
opt-in value `data-kp-gantt-scroll="fit"` (`js/gantt/fit.js`, `css/components/run-timeline/fits-its-width.css`): the whole window across
the frame, every label whole (inside, after, before, or on its own line under its bar), lanes as tall as the rows they use.

**Round 1** (one section, `gantt-fit`, formal only): Kitchen's cook plan twice, today's timeline above and the fitted one below, in a
390 px stage (Full width as the other choice) with the timelines' loading, empty and failed states. The plan is built by
`kitchen-plan.js` the way Kitchen's `cook/logic.js` builds it, from the spaghetti recipe Kitchen's own cook-mode checks seed (two tracks,
a step in both), and drawn with the calls Kitchen's `recipe/timeline.js` makes, repainted every 10 s as the app does. The progress (water
boiled, pasta on for 3 of its 10 minutes) is fixed.

**Generated** by `node research/gantt-fit-1101/build.mjs` (edit the builder, never the page).
