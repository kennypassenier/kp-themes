// Page descriptor for the "kpi-trend" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const kpiTrendDescriptor = {
        id: 'kpi-trend',
        title: 'Key figure with its 24-hour trend',
        group: 'Data',
        classes: [],
        exports: [],
        // The spark variant's two options, and the chip's two-line form.
        aliases: ['spark-head', 'spark-axis', 'stacked'],
        intro: 'A key figure whose whole tile opens its chart, with its last 24 hours inside it. `.kp-kpi--trend` stretches its `.kp-kpi__link` over the tile; the trend is the time chart’s spark variant without its head line (`data-kp-spark-head="none"`), with the axis under it (`data-kp-spark-axis="relative"`): where it starts, as `14:40 yesterday`, and `now`. A pointer, a finger or the arrow keys read one point: a crosshair and a chip with its moment and value over the line, kept inside the tile. A note such as “avg 15 min” goes in the label, in its capitals (`.kp-kpi__label-note`). js/chart.js draws it.',
        whenToUse:
            'At the top of a dashboard, for the few readings whose last day matters as much as their value now, each leading to its full chart. Not for a reading whose history nobody looks at (a plain key figure), and not for comparing sources (the time chart).',
        examples: [
            {
                title: 'A trend tile, its data in the markup',
                why: 'The data is the page’s: a JSON child as here, or `setTrendData(figure, { points, step, unit, digits })` from a script (`null` is loading). The axis counts from the reader’s now on the Brussels clock; this sample’s readings are from 04/10/2026, so it names their dates.',
                markup: `
<div class="kp-kpis" data-kp-kpis-columns="4 2 1" role="group" aria-label="Pump house 1 right now">
<div class="kp-kpi kp-kpi--trend">
<span class="kp-kpi__label">Pressure <span class="kp-kpi__label-note">avg 15 min</span></span>
<a class="kp-kpi__link" href="#" title="Open Pressure on Charts"><span class="kp-kpi__link-word">Charts</span> ↗</a>
<span class="kp-kpi__value">3.30<small>bar</small></span>
<span class="kp-kpi__trend">now <b>3.36 bar</b> · peak 3.58 bar · two pumps</span>
<figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="Pressure, last 24 hours">
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"series":[{"label":"Pressure","start":1791010800000,"step":3600000,"values":[3.36,3.45,3.44,3.44,3.45,3.45,3.45,3.44,3.4,3.35,3.32,3.35,3.41,3.44,3.46,3.44,3.48,3.55,3.58,3.55,3.51,3.38,3.31,3.3,3.36]}]}</script>
</figure>
</div>
</div>
`,
            },
            {
                title: 'A long label wraps and stops before the corner link',
                why: 'Added 2026-10-14 (`kpi-label-cut-M1`). The trend tile\u2019s label stops before the corner link and, where it does not fit, wraps between words instead of ending in an ellipsis. Two label lines are kept for it whether it wraps or not, so a row of trend tiles stays one height. Here the window is 14rem wide, one tile.',
                frame: { height: '22rem', width: '14rem' },
                markup: `
<div class="kp-kpis" role="group" aria-label="Pump house 1">
<div class="kp-kpi kp-kpi--trend">
<span class="kp-kpi__label">Discharge pressure at the reservoir inlet</span>
<a class="kp-kpi__link" href="#" title="Open Pressure on Charts"><span class="kp-kpi__link-word">Charts</span> \u2197</a>
<span class="kp-kpi__value">3.30<small>bar</small></span>
<span class="kp-kpi__trend">now <b>3.36 bar</b> \u00b7 two pumps</span>
<figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="Pressure, last 24 hours">
<script type="application/json" data-kp-chart-data>{"unit":"bar","digits":2,"series":[{"label":"Pressure","start":1791010800000,"step":3600000,"values":[3.36,3.45,3.44,3.44,3.45,3.45,3.45,3.44,3.4,3.35,3.32,3.35,3.41,3.44,3.46,3.44,3.48,3.55,3.58,3.55,3.51,3.38,3.31,3.3,3.36]}]}</script>
</figure>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-kpi--trend', what: 'The tile: its link stretched over it, the trend a second stop for the keyboard; the whole tile takes the focus ring while its link has it.' },
            { name: '.kp-kpi__label (trend tile)', what: 'Stops before the corner link and wraps between words, never cut; two lines are kept for it so a row of trend tiles stays one height.' },
            { name: '.kp-kpi__link', what: 'The corner link (“Charts ↗”); in a tile of 12rem or less only ↗ shows, the word stays for a screen reader (`.kp-kpi__link-word`).' },
            { name: '.kp-kpi__label-note', what: 'A note in the label, in its capitals, after a dot: “PRESSURE · AVG 15 MIN”.' },
            { name: 'data-kp-spark-head="none"', what: 'On a `[data-kp-chart="spark"]`: no name and value line; a reading is a chip over the line, on the trend’s own crosshair, and a click that was not a drag follows the tile’s link.' },
            { name: 'data-kp-spark-axis="relative"', what: 'The axis under the line: the first point’s clock and day (`today`, `yesterday`, else its date) and `now` while the last point is at most two steps old, else its clock. One point or none: two no-break spaces, so the row keeps its height.' },
            { name: 'data-kp-stacked', what: 'Written on the chip when moment and value do not fit on one line: the value goes under the moment. When even that does not fit, the reading takes the axis row.' },
            { name: 'states', what: 'Loading (`setTrendData(figure, null)`, or no data yet): the trend empty at its height, the tile `aria-busy`. No points: no trend, no tab stop. One point: the same, with the axis kept.' },
            { name: 'trendAxis(points, { now, step })', what: 'The axis words on their own; `attachTrendCharts(root, options)` draws only the trends under `root` (attachCharts() draws them too).' },
            { name: 'loading, empty and failed', what: '`setTrendData(figure, null)` is the theme’s busy card over the trend (not an empty line); `{ points: [] }` is the empty plate; `{ error, text?, art? }` is the failed plate with a Retry (`kp-chart-retry`).' },
        ],
        accessibility: [
            'Built in — no control sits inside the link: the tile’s link is one tab stop, the trend (`role="application"`, named by the figure’s `aria-label`) the next, and only while it has two points or more.',
            'Built in — ←/→ read point by point (Shift: ten), Home and End go to the ends, Esc hides the reading; what a key reads is said through a polite live region, with the keys described (`chartTrendKeys`).',
            'Built in — every moment is `dd/mm/yyyy HH:mm` on the Brussels clock (rule 52); the words `now`, `today` and `yesterday` are the dictionary’s.',
            'Yours — name the figure (“Pressure, last 24 hours”) and give the link a title that says where it goes; say the value that matters in the tile’s words, not only in the line.',
        ],
    };
