# Time components the admin dashboard still draws itself

Kenny's rule (2026-10-15): the dashboard draws nothing itself, so what the package lacks is built here first. Two gaps from the homelab `admin/web`: the week of the schedules page (`sch-week`, `sch-pill`) and the timeline of the Activity page (`ac-tl`). Demo: `demo.html` (formal only first, Kenny 2026-10-04 rule; the registers of the other fifteen themes are drafted and wait for his formal verdict). Edit `build.mjs`, not `demo.html`.

| Component                   | What it is for                                                                                        | Dashboard source                                                       | What the package reused                                                                               | Build cost | Recommendation          |
| --------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| `.kp-week` + `js/week.js`   | Seven days, items at their time of day, now-line, today mark, `+N` for a crowded day, rows on a phone | `js/pages/schedules.js` `week`, `css/pages/schedules.css`, `stackTops` | `chart.js` `wallTime`, `calendar.js` day helpers, the menu button for `+N`, the hover card for detail | medium     | Ship as a new component |
| `.kp-gantt` + `js/gantt.js` | Bars per job on a live time axis, running bars growing, ranges, brushed selection                     | `js/pages/activity.js` `paintTimeline`, `css/pages/activity.css`       | `segmented.js` for the ranges, the hover card, `.kp-skeleton`                                         | large      | Ship as a new component |

## API

- Week: `<div class="kp-week" data-kp-week data-kp-week-start="YYYY-MM-DD" data-kp-week-nav data-kp-week-days="7">`; `attachWeeks`, `setWeekEvents(el, events)` (`{ id, start, label, series 1-5, state next|off|skipped|reference, detail }`), `setWeekState`, `setWeekStart`, `setWeekLegend`; events `kp-week-open`, `kp-week-range`; knobs `--kp-week-height|pill|axis|day-label|pill-radius|now|today|gap`.
- Gantt: `<div class="kp-gantt" data-kp-gantt data-kp-gantt-ranges="1h 6h 24h 7d" data-kp-gantt-range="6h" data-kp-gantt-live="false">`; `attachGantts`, `setGanttRuns(el, runs, lanes)` (`{ id, lane, label, start, end, state queued|running|ok|failed, detail }`), `setGanttState`, `setGanttWindow`, `setGanttSelection`; events `kp-gantt-open`, `kp-gantt-select`, `kp-gantt-window`; knobs `--kp-gantt-label|row|bar|bar-failed|bar-min|height|bar-radius|now|axis`. Bars are placed by CSS from `--kp-g-from|span|now`, so a live tick writes three properties.

## Where the dashboard’s behaviour is not matched

- The dashboard timeline had a Failures lane with diamonds and a Nightly lane; here a failed run is a taller bar with a cap and a cross in its own lane (the page chooses lanes).
- Dashboard "click a day to jump" is not built; ticks are text. Selecting a range is the brush (pointer) plus the range buttons; there is no keyboard brush.
- The dashboard week had no `+N` and no week buttons; both are new and optional.

## Open for Kenny to judge in the demo

1. A run that overlaps another needs a row, and the frame must not jump while a person watches. Decided in the build: a lane with a run still open reserves one spare row (the next start overlaps it), and the scrolling viewport keeps the height it first had with data, so a start that needs yet another row scrolls inside the frame (the pattern of a table with a fixed-height body, not a page that grows under the cursor). Only an act of the person (a range button, Live, Zoom) or the page's own `loading` lays the lanes out again. The alternative, reserving the rows of every lane for every window, leaves empty ruled rows on a calm day. Right trade-off?
2. Pills mark time by their top edge, not their centre; the axis labels sit on the hour lines.
3. `+N` sits at the foot of the stack and opens the package's menu button, not a custom popover.
4. Running bars march stripes; the other themes’ motion grammar waits for the formal verdict.
5. The selected range is a chip floating over the foot of the plot, not a row of the toolbar: absent it costs no height at any width, present it moves nothing, but it can cover the lowest lane's bars until Clear.
