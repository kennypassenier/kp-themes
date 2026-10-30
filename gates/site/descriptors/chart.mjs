// Page descriptor for the "chart" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const chartDescriptor = {
        id: 'chart',
        title: 'Time chart',
        group: 'Data',
        classes: ['kp-chart', 'kp-chart-group', 'kp-chart-ranges', 'kp-chart-zoom'],
        exports: [],
        // The marks the script writes on what it draws: a source's colour
        // (`data-kp-series`, `data-kp-dash`), a legend button kept off, a
        // pinned tooltip, an event's tone, the hint's two audiences.
        aliases: ['series', 'dash', 'off', 'pinned', 'tone', 'when', 'outside', 'band', 'faint', 'note', 'wait'],
        intro: 'The one time chart every page draws, so its controls mean the same everywhere. js/chart.js draws a `[data-kp-chart]` from the page’s data: a legend that singles a source out and keeps sources on or off, a crosshair every chart of a group shares, a tooltip beside it with every value, the change over the hour before and the events within reach, drag to zoom, event markers, range buttons, and a spark variant that is a tile’s 24-hour line on the same crosshair.',
        whenToUse:
            'For readings over time: pressures, flows, response times, a queue’s length. Not for a share of a whole or a comparison of categories, and not for a single number now, which is a key figure.',
        examples: [
            {
                title: 'Two sources, an alarm level and events',
                why: 'The data is the page’s, here as a JSON child (`setChartData()` does the same from a script). Point at the plot for the tooltip, click to pin it, drag to zoom, and use ←/→, Home/End, Enter and Esc on the focused plot. With one or two sources on, a soft area lies under each line.',
                markup: `
<figure class="kp-chart" data-kp-chart aria-label="Pressure" lang="en-GB">
<figcaption class="kp-chart__title">Pressure, bar</figcaption>
<script type="application/json" data-kp-chart-data>{"label":"Pressure","unit":"bar","digits":2,"threshold":2.1,"series":[{"label":"Pump house 1","start":1791010800000,"step":3600000,"values":[3.36,3.45,3.44,3.44,3.45,3.45,3.45,3.44,3.4,3.35,3.32,3.35,3.41,3.44,3.46,3.44,3.48,3.55,3.58,3.55,3.51,3.38,3.31,3.3,3.36]},{"label":"Pump house 3","start":1791010800000,"step":3600000,"values":[2.77,2.86,2.86,2.89,2.87,2.9,2.85,2.87,2.83,2.75,2.74,2.76,2.84,2.84,2.85,2.87,2.92,2.97,3,3.01,2.91,2.83,2.69,1.92,2.76]}],"events":[{"at":1791087000000,"label":"Valve swap, ring main","tone":"info"},{"at":1791091920000,"label":"Alarm: pump house 3 below 2.1 bar","tone":"critical"},{"at":1791094320000,"label":"Pump restart, pump house 3","tone":"warning"}]}</script>
</figure>
`,
            },
            {
                title: 'A group with ranges, a zoom chip and a spark',
                why: 'The charts of one `[data-kp-chart-group]` share a crosshair, a zoom and a range. A range button fires `kp-chart-range` before the charts redraw, so the page can hand them that range’s data; the chip shows a zoom and resets it.',
                markup: `
<div class="kp-chart-group" data-kp-chart-group data-kp-chart-span="24h" lang="en-GB">
<div class="kp-chart-group__bar">
<div class="kp-chart-ranges" role="group" aria-label="Time range">
<button type="button" class="kp-button kp-button--sm" data-kp-chart-range="6h">6 h</button>
<button type="button" class="kp-button kp-button--sm" data-kp-chart-range="24h">24 h</button>
</div>
<span class="kp-chart-zoom" data-kp-chart-zoom hidden></span>
</div>
<figure class="kp-chart" data-kp-chart aria-label="Pump house 1">
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"series":[{"label":"Pump house 1","start":1791010800000,"step":3600000,"values":[3.36,3.45,3.44,3.44,3.45,3.45,3.45,3.44,3.4,3.35,3.32,3.35,3.41,3.44,3.46,3.44,3.48,3.55,3.58,3.55,3.51,3.38,3.31,3.3,3.36]}]}</script>
</figure>
<div class="kp-chart" data-kp-chart="spark" aria-label="Pump house 3">
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"series":[{"label":"Pump house 3","start":1791010800000,"step":3600000,"values":[2.77,2.86,2.86,2.89,2.87,2.9,2.85,2.87,2.83,2.75,2.74,2.76,2.84,2.84,2.85,2.87,2.92,2.97,3,3.01,2.91,2.83,2.69,1.92,2.76],"colour":"var(--chart-2)"}]}</script>
</div>
</div>
`,
            },
            {
                title: 'Events by kind, a maintenance window and the median',
                why: 'An event with a `kind` takes its tone and its word from the chart’s `kinds` map (`tone` is `info`, `warning` or `critical`); an event with `until` is a band from `at` to there, drawn `tint` across the plot, `hatch` as diagonal lines (readable without colour) or as a `bracket` along the top (`data-kp-chart-band`, or `band` in the data). The key above the plot names the kinds present and each item switches its kind off and on (`kp-chart-kinds` fires with `{ off }`; `data-kp-chart-annotation-key="off"` leaves the key out). An event outside the window shows as an arrow with its count at the edge. `data-kp-chart-median` draws each shown source’s median as a dashed line with its value, and `data-kp-chart-median-label` words it.',
                markup: `
<div class="kp-stack">
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="How a window is drawn">
<button type="button" class="kp-button" data-doc-band="tint" aria-pressed="true">Tint</button>
<button type="button" class="kp-button" data-doc-band="hatch" aria-pressed="false">Hatch</button>
<button type="button" class="kp-button" data-doc-band="bracket" aria-pressed="false">Bracket</button>
</div>
<figure class="kp-chart" id="doc-chart-events" data-kp-chart data-kp-chart-median data-kp-chart-band="tint" aria-label="Pump house 1 pressure" lang="en-GB">
<figcaption class="kp-chart__title">Pump house 1 pressure, bar</figcaption>
</figure>
<pre class="kp-code-block" id="doc-chart-log" aria-live="polite">Switch a kind off in the key.</pre>
</div>
`,
                script: `
import { attachCharts, setChartData } from '@kp-soft/themes/js/chart';

const chart = document.getElementById('doc-chart-events');
attachCharts(chart.parentElement);
const HOUR = 3_600_000;
const to = Date.UTC(2026, 9, 17, 10, 0) - 12 * HOUR;
const from = to - 72 * HOUR;
const points = [];
for (let t = from - 6 * HOUR; t <= to + 12 * HOUR; t += HOUR) {
    points.push([t, 3.7 - 0.5 * Math.max(0, Math.sin((((t / HOUR) % 24) / 24) * Math.PI * 2 - 1.2)) + 0.06 * Math.sin(t / HOUR)]);
}
setChartData(chart, {
    unit: 'bar',
    from,
    to,
    height: 190,
    series: [{ label: 'Pump house 1', points }],
    kinds: {
        operation: { label: 'An operation the host ran', tone: 'info' },
        update: { label: 'An update', tone: 'warning' },
        failure: { label: 'A failure', tone: 'critical' },
        window: { label: 'A maintenance window', tone: 'warning' },
    },
    events: [
        { at: from - 30 * HOUR, label: 'Backup', kind: 'operation' },
        { at: from + 9 * HOUR, label: 'Backup finished', kind: 'operation' },
        { at: from + 22 * HOUR, label: 'Firmware 4.2 installed', kind: 'update' },
        { at: from + 33 * HOUR, until: from + 38 * HOUR, label: 'Maintenance window: pump house 1', kind: 'window' },
        { at: from + 50 * HOUR, label: 'Pressure sensor lost contact', kind: 'failure' },
        { at: to + 5 * HOUR, label: 'Firmware 4.3 installed', kind: 'update' },
    ],
});
chart.addEventListener('kp-chart-kinds', (event) => (document.getElementById('doc-chart-log').textContent = 'kp-chart-kinds { off: ' + JSON.stringify(event.detail.off) + ' }'));
for (const button of document.querySelectorAll('[data-doc-band]')) {
    button.addEventListener('click', () => {
        for (const other of document.querySelectorAll('[data-doc-band]')) other.setAttribute('aria-pressed', String(other === button));
        chart.setAttribute('data-kp-chart-band', button.getAttribute('data-doc-band'));
    });
}
`,
            },
            {
                title: 'A run chart: the median and the runs',
                why: '`data-kp-chart-runs="mark"` rings the points of every run of six or more on one side of the median (the run-chart rule; a point exactly on the median neither breaks a run nor counts in it), and the key explains the ring. `chartMedian(values)` and `chartRuns(values, median, least)` are the two calculations on their own, for a page that draws something else with them.',
                markup: `
<figure class="kp-chart" id="doc-chart-runs" data-kp-chart data-kp-chart-median data-kp-chart-median-label="median" data-kp-chart-runs="mark" aria-label="Mood each day" lang="en-GB">
<figcaption class="kp-chart__title">Mood each day, 1 (low) to 5 (high)</figcaption>
</figure>
`,
                script: `
import { attachCharts, setChartData } from '@kp-soft/themes/js/chart';

const chart = document.getElementById('doc-chart-runs');
attachCharts(chart.parentElement);
const DAY = 86_400_000;
const to = Date.UTC(2026, 9, 17, 10, 0);
const from = to - 28 * DAY;
const mood = [3, 4, 3, 4, 3, 4, 4, 2, 2, 1, 2, 2, 1, 2, 2, 3, 4, 3, 4, 4, 5, 4, 4, 5, 4, 5, 4, 5];
setChartData(chart, {
    from,
    to,
    height: 190,
    yMax: 5,
    series: [{ label: 'Mood', points: mood.map((v, i) => [from + (i + 0.5) * DAY, v]) }],
});
`,
            },
            {
                title: 'Too few readings for a trend',
                why: '`data-kp-chart-min-points="7"` (`minPoints`) holds the lines back until there are enough readings and says “3 of 7 days needed before a trend means something” on an opaque plate, at heading size, over the empty plot at its full height; `data-kp-chart-min-unit` (`minUnit`) names the readings. The chart draws itself the moment enough arrive.',
                markup: `
<div class="kp-stack">
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="Readings">
<button type="button" class="kp-button" id="doc-chart-more">Enough readings</button>
</div>
<figure class="kp-chart" id="doc-chart-few" data-kp-chart data-kp-chart-min-points="7" data-kp-chart-min-unit="days" aria-label="Sleep" lang="en-GB">
<figcaption class="kp-chart__title">Sleep, hours</figcaption>
</figure>
</div>
`,
                script: `
import { attachCharts, setChartData } from '@kp-soft/themes/js/chart';

const chart = document.getElementById('doc-chart-few');
attachCharts(chart.parentElement);
const DAY = 86_400_000;
const to = Date.UTC(2026, 9, 17, 10, 0);
const hours = [6.5, 7.2, 5.9, 7.8, 8.1, 6.4, 7.0];
const draw = (n) =>
    setChartData(chart, {
        from: to - 7 * DAY,
        to,
        height: 190,
        yMax: 10,
        unit: 'h',
        series: [{ label: 'Sleep', points: hours.slice(0, n).map((v, i) => [to - (n - i) * DAY, v]) }],
    });
draw(3);
document.getElementById('doc-chart-more').addEventListener('click', () => draw(hours.length));
`,
            },
            {
                title: 'A chart that failed to load',
                why: 'A chart whose data carries `error` draws a tinted, bordered plate with a heading-size sentence and a Retry in the plot’s place (the same plate every other failed area uses, dressed by the theme). Retry fires `kp-chart-retry` on the chart; the page fetches again and calls `setChartData`.',
                markup: `
<figure class="kp-chart" id="doc-chart-failed" data-kp-chart aria-label="Pressure" lang="en-GB">
<figcaption class="kp-chart__title">Pressure, bar</figcaption>
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"error":"The readings could not be loaded.","series":[]}</script>
</figure>
`,
                script: `
import { setChartData } from '@kp-soft/themes/js/chart';

document.getElementById('doc-chart-failed').addEventListener('kp-chart-retry', () => {
    setChartData(document.getElementById('doc-chart-failed'), {
        unit: 'bar',
        digits: 2,
        series: [{ label: 'Pump house 1', start: 1791010800000, step: 3600000, values: [3.36, 3.45, 3.44, 3.4, 3.35, 3.41, 3.48, 3.55] }],
    });
});
`,
            },
        ],
        variants: [
            { name: 'kp-chart-retry', what: 'Fired on the chart, bubbling, when Retry is pressed in a failed chart (`CHART_RETRY_EVENT` in js/chart.js; the button’s words are the string `chartRetry`). The focus moves to the plot first, because the button goes with the state.' },
            { name: 'axis labels', what: 'The first and the last time label anchor to their tick when, centred, they would cross the drawing’s edge, so an end label is never cut.' },
            { name: 'data-kp-outside', what: 'Written on the tooltip while its pinned moment lies outside the window: it docks at the plot’s edge and says so.' },
            { name: '[data-kp-chart]', what: 'A chart; usually a `figure.kp-chart` with a `.kp-chart__title` caption. Its data comes from a `script[type="application/json"][data-kp-chart-data]` child or from `setChartData(el, data)`, before or after it is attached.' },
            { name: 'data-kp-chart="spark"', what: 'The spark variant: one source’s line over a soft area, its value at the crosshair (or now) beside its name, on the group’s crosshair.' },
            { name: '.kp-chart-group', what: '`[data-kp-chart-group]`: the charts in it share one crosshair, one zoom and one range; `data-kp-chart-span="24h"` is the window (`15m`, `1h`, `7d` …).' },
            { name: '.kp-chart-ranges', what: 'The range buttons, each with `data-kp-chart-range`; the script writes `aria-pressed` on the one in force and fires `kp-chart-range`.' },
            { name: '.kp-chart-zoom', what: '`[data-kp-chart-zoom]`: the chip the script fills while the group is zoomed, with its Reset; `kp-chart-zoom` fires on the group.' },
            { name: 'the legend', what: 'Hover or focus singles a source out; a click keeps one or several on and fires `kp-chart-select`; Show all and Esc reset. Hidden for a single source.' },
            { name: 'the tooltip', what: 'Beside the crosshair, on the side with room: every visible source’s value, ▲/▼ over the hour before, the events within a thirtieth of the window. A click pins it; ✕ or Esc releases it.' },
            { name: 'event kind and kinds', what: 'An event’s `kind` is the application’s own name for it (“operation”, “update”, “failure”); the data’s `kinds` maps each to a word for the key and a tone (`info`, `warning`, `critical`). An event’s own `tone` wins, then its kind’s, then `info`.' },
            { name: 'event until and data-kp-chart-band', what: 'An event with `until` is a band from `at` to there instead of a line. `tint` (the default) lies across the plot, `hatch` is diagonal lines that read without colour, `bracket` is a line along the top with short ticks. Point at a band for its start and end in words.' },
            { name: 'data-kp-chart-median and data-kp-chart-median-label', what: 'A dashed median line per shown source, in the source’s colour, with its value at the end; `off` leaves it out, and the label words the value (“median 3.4 bar”). The key says what the line is when one source shows.' },
            { name: 'data-kp-chart-runs', what: '`mark` rings the points of every run of six or more on one side of the median; `off` is the default.' },
            { name: 'data-kp-chart-min-points and data-kp-chart-min-unit', what: 'Below this many readings the chart says it is too early for a trend over the faint points already known; the unit names the readings (“days”).' },
            { name: 'data-kp-chart-annotation-key', what: '`off` leaves out the key above the plot, which is on while the chart has events, a median or runs. Each item of the key is a button that switches its kind of event off and on; `kp-chart-kinds` carries `{ off }`.' },
            { name: 'chartMedian and chartRuns', what: '`chartMedian(values)` is the median (the mean of the middle two for an even count), or `null` for none; `chartRuns(values, median, least)` is the set of indexes that belong to a run of at least `least` (6) points on one side of the median.' },
            { name: 'chartMedian … chartKindOn strings', what: 'Every word of the annotations is in the dictionary: `chartMedian`, `chartFew`, `chartFewUnit`, `chartAnnotationKey`, `chartKindTone`, `chartRunsKey`, `chartMarkBand`, `chartBandWhen`, `chartEdgeBefore`, `chartEdgeAfter` and `chartKindOn`.' },
            { name: 'colours', what: 'The theme’s five chart colours in order; from the sixth source on they come round again with one of three dashes. A series’ own `colour` overrides.' },
            { name: 'under the lines', what: 'A soft area while one or two sources are on, a stronger one for a source alone; with three or more, the lines alone. Stacked sources are areas.' },
        ],
        accessibility: [
            'Built in — the plot is focusable, with ←/→ (Shift: ten points), Home/End, Enter to pin and Esc to step back; what is under the crosshair is said through a polite live region, on keys and pins only.',
            'Built in — the legend’s buttons carry `aria-pressed`; a source kept off is faded and named so in its title.',
            'Built in — the hint under the legend speaks to a pointer or to a finger, never both.',
            'Built in — every word the chart says is in the dictionary (`chart…` in js/strings.js); `attachCharts(root, { strings, locale })` overrides them per chart.',
            'Yours — name each chart (`aria-label`) and give it a caption; the drawing itself is hidden from a screen reader.',
            'Yours — say the reading that matters in text near the chart; a chart is the overview, not the only place a number lives.',
        ],
    };
